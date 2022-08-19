# Cloud-native Experience Lab Workshop (in Vue3)

This lab will focus on the development and deployment of the Cloud-native weather UI application in Vue3. It will take you through the relevant phases and tasks reuired to go from source code to a fully deployed application on an integration environment.

## Prerequisites

Before you dive right into Cloud-native development with Vue.js, make sure your local development environment is setup properly! 

- Modern Operating System (Windows 10, MacOS, ...) with terminal and shell
- IDE of your personal choice (with relevant plugins installed)
  - IntelliJ Ultimate
  - VS Code
- Local Docker / Kubernetes installation (Docker Desktop, Rancher Desktop, Minikube)
- [Node.js](https://nodejs.org/)
- [Kustomize](https://kustomize.io)
- [Tilt](https://tilt.dev)
- [Flux2](https://tilt.dev)

## Project setup

The focus of this lab is not on the actual implementation of the service itself. However, kicking off a cloud-native project in Node.js with Vue3 is pretty straight forward.


```bash
npm init vue@latest

cd <your-project-name>
npm install
npm run lint
npm run dev
```

With this, you can now start to implement the required UI and business logic of the weather service UI.

## Containerization

In this step we now need to containerize the single page application. To serve the HTML/CSS, JavaScript and also expose the REST API we will use a Nginx server. We use Docker for the containerization and leverage a multi-stage approach:
the SPA artifacts are build during the image build stage and then used and copied to the final runtime stage.

**Lab Instructions**
1. Create a `Dockerfile` and add the following two stages
    - Build the SPA artifacts using the correct `node` base image
    - Assemble the final runtime image using `nginx` as base image
    - Provide a Nginx configuration to serve the SPA and the REST API
    - Create a `.dockerignore` file, exclude `node_modules` and `dist/`

<details>
  <summary markdown="span">Click to expand solution ...</summary>

```Dockerfile
FROM node:16.17.0 as builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY ./ .
RUN npm run build

FROM nginx:1.23.1 as runtime
RUN mkdir /app
COPY --from=builder /app/dist /app
COPY nginx.conf /etc/nginx/nginx.conf
```

Next, write a nginx.conf file to configure the Nginx server to serve the SPA and expose the weather service REST API as backend. Have a look at the official [Nginx documentation](https://www.nginx.com/resources/wiki/start/topics/examples/full/) for a full example.
```
user  nginx;
worker_processes  1;

error_log  /var/log/nginx/error.log warn;
pid        /var/run/nginx.pid;

events {
  worker_connections  1024;
}

http {
  include       /etc/nginx/mime.types;
  default_type  application/octet-stream;
  log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
                    '$status $body_bytes_sent "$http_referer" '
                    '"$http_user_agent" "$http_x_forwarded_for"';
  access_log  /var/log/nginx/access.log  main;
  sendfile        on;
  keepalive_timeout  65;

  upstream backend {
    server weather-service:8080;
  }

  server {
    listen       3000;
    server_name  localhost;
    location / {
      root   /app;
      index  index.html;
      try_files $uri $uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://backend;
    }

    error_page   500 502 503 504  /50x.html;
    location = /50x.html {
      root   /usr/share/nginx/html;
    }
  }
}
```
</details>

## K8s Deployment

The application needs to be deployed, configured, run and exposed with Kubernetes. Several competing 
approaches exist, namely Kustomize and Helm. For this section, you only need to choose and use one of them.

### Option a) Kustomize

In this step we are going to use [Kustomize](https://kustomize.io) to handle the Kubernetes manifests required
to deploy, configure and expose the application to multiple Kubernetes environments.

**Lab Instructions**
1. Create directory structure for Kustomize `base/` and overlays for `dev/` and `prod/`
2. Create base Kubernetes resources for the application and adjust Kustomization
    - Create `Deployment` resource for application and add resource to `kustomization.yaml`
    - Create `Service` resource for application and add resource to `kustomization.yaml`
3. Adjust Kustomization in the `dev/` overlay to include base resources
4. Create the following Kustomize patches for the application in the `prod/` overlay
    - Patch the deployment and set `replicas: 2` with a dedicated file
    - Patch the service and set `type: LoadBalancer` as Json6902 patch file

<details>
  <summary markdown="span">Click to expand solution ...</summary>

The directory structure for the base and overlay Kustomization should follow the suggested [common layout](https://kubectl.docs.kubernetes.io/references/kustomize/glossary/#kustomization-root)

```bash
# create the suggested directory layout
mkdir -p k8s/base
mkdir -p k8s/overlays/dev
mkdir -p k8s/overlays/prod

# create initial kustomization.yaml
cd k8s/base && kustomize create && cd ...
cd k8s/overlays/dev && kustomize create && cd ....
cd k8s/overlays/prod && kustomize create && cd ....
```

Next, we create the **base** Kubernetes resources for the application and register these with the Kustomization.
```yaml
# add this to a new base/vue-deployment.yaml file
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: vue-frontend
spec:
  selector:
    matchLabels:
      app: weather-frontend
      tier: frontend
  replicas: 1
  template:
    metadata:
      labels:
        app: weather-frontend
        tier: frontend
    spec:
      containers:
        - name: cloud-native-weather-vue3
          image: cloud-native-weather-vue3
          imagePullPolicy: IfNotPresent
          ports:
            - name: http
              containerPort: 3000

# add this to a new base/vue-service.yaml file
---
apiVersion: v1
kind: Service
metadata:
  name: vue-frontend
spec:
  type: ClusterIP
  selector:
    app: vue-frontend
  ports:
    - name: http
      protocol: TCP
      port: 3000
      targetPort: http

# add these to the base/kustomization.yaml
---
commonLabels:
  app: weather-service
  framework: golang

buildMetadata: [managedByLabel]

resources:
  - vue-deployment.yaml
  - vue-service.yaml
```

The **dev** overlay only need to reference the base resources inside the `overlays/dev/kustomization.yaml`.
```yaml
resources:
  - ../../base/
```

For the **prod** overlay we need to patch the **base** Kubernetes resources to only modify certain fields, like 
replica count of the `Deployment` or the `Service` type.

```yaml
# add the following YAML patch to the overlays/prod/2-replicas.yaml file
# the resource is identified by apiVersion + kind + name, everything under spec will be patched
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: vue-frontend
spec:
  replicas: 2

# add the following JSON 6902 patch to the overlays/prod/loadbalancer.yaml
---
- op: replace
  path: /spec/type
  value: LoadBalancer

# register the patches in the overlays/prod/kustomization.yaml
---
patchesStrategicMerge:
  - 2-replicas.yaml

patchesJson6902:
  - target:
      version: v1
      kind: Service
      name: vue-frontend
    path: loadbalancer.yaml
```
</details>

### Option b) Helm Chart

_TODO_

<details>
  <summary markdown="span">Click to expand solution ...</summary>
</details>


## Continuous Development

A good and efficient developer experience (DevEx) is of utmost importance for any cloud-native software
engineer. Rule 1: stay local as long as possible. Rule 2: automate all required steps: compile and package the source code, containerize the artifact and deploy the Kubernetes resources locally. Continuously. The tools _Tilt_ and _Skaffold_ can both be used to establish this continuous dev-loop. For this section, you
only need to choose and use one of them.

### Option a) Tilt

In this step we are going to use [Tilt](https://tilt.dev) to build, containerize and deploy the application
continuously to a local Kubernetes environment.

**Lab Instructions**
1. Make sure Tilt is installed locally on the development machine
2. Write a `Tiltfile` that performs the following steps
    - Build the required Docker image on every change to the source code
    - Apply the DEV overlay resources using Kustomize
    - Create a local port forward to the weather service HTTP port

<details>
  <summary markdown="span">Click to expand solution ...</summary>

Depending on your local K8s environment, the final `Tiltfile` might look slighty different.
```python
# -*- mode: Python -*-

# to disable push with rancher desktop we need to use custom_build instead of docker_build
# custom_build('cloud-native-weather-vue3', 'docker build -t $EXPECTED_REF .', ['./'], disable_push=True)
docker_build('cloud-native-weather-vue3', '.', dockerfile='Dockerfile')

k8s_yaml(kustomize('k8s/overlays/dev'))
k8s_resource(workload='vue-frontend', port_forwards=[port_forward(13000, 3000, 'HTTP FRONTEND')], labels=['Vue'])
```

To see of everything is working as expected issue the following command: `tilt up`
</details>

### Option b) Skaffold

In this step we are going to use [Skaffold](https://skaffold.dev) to build, containerize and deploy the application
continuously to a local Kubernetes environment.

**Lab Instructions**
1. Make sure Skaffold is installed locally on the development machine
2. Write a `skaffold.yaml` that performs the following steps
    - Build the required Docker image on every change to the source code
    - Apply the DEV overlay resources using Kustomize
    - Create a local port forward to the UI application HTTP port

<details>
  <summary markdown="span">Click to expand solution ...</summary>

The 3 steps of building, deployment and port-forwarding can all be codified in the `skaffold.yaml` descriptor file.
```yaml
apiVersion: skaffold/v2beta24
kind: Config
metadata:
  name: cloud-native-weather-vue3

build:
  tagPolicy:
    gitCommit: {}
  artifacts:
    - image: cloud-native-weather-vue3
      docker:
        dockerfile: Dockerfile
  local:
    push: false
    useBuildkit: true
    useDockerCLI: false

deploy:
  kustomize:
    defaultNamespace: default
    paths: ["k8s/overlays/dev"]

portForward:
  - resourceName: vue-frontend
    resourceType: service
    namespace: default
    port: 3000
    localPort: 13000
```

To see of everything is working as expected issue the following command: `skaffold dev --no-prune=false --cache-artifacts=false`

</details>

## Continuous Integration

For any software project there must be a CI tool that takes care of continuously building and testing the produced software artifacts on every change.

### Github Actions

In this step we are going to use Github actions to build and test the application on every change. Also we are going to
leverage Github actions to perform 3rd party dependency checks as well as building and pushing the Docker image.

**Lab Instructions**
1. Create a Github action for each of the following tasks
    - Build the project on every change on main branch and every pull request
    - Build and push the Docker image to Github packages main branch, every pull request and tags
    - (_optional_) Perform CodeQL scans on main branch and every pull request
    - (_optional_) Perform a dependency review on every pull request

<details>
  <summary markdown="span">Click to expand solution ...</summary>

For each of the tasks, open the Github actions tab for the repository in your browser. Choose 'New workflow'. 

In the list of predefined actions, choose the **Npm - Build a Node project** action. Adjust the suggested YAML
file content and commit.
```yaml
name: "Node CI"

on:
  push:
    branches: [ "main" ]
  pull_request:
    branches: [ "main" ]

jobs:
  node:
    name: Node
    runs-on: ubuntu-latest

    steps:
      - name: Checkout repository
        uses: actions/checkout@v3

      - name: Set up Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v3
        with:
          node-version: 16.x

      - name: Install dependencies
        run: npm install

      - name: Build the Vue frontend
        run: npm run build --if-present
```

Next, choose the **Publish Docker Container** action from the Continuous integration section. Adjust the suggested YAML file content and commit.
```yaml
name: "Docker Publish"

on:
  push:
    branches: [ "main" ]
    tags: [ 'v*.*.*' ]
  pull_request:
    branches: [ "main" ]

env:
  # Use docker.io for Docker Hub if empty
  REGISTRY: ghcr.io
  # github.repository as <account>/<repo>
  IMAGE_NAME: ${{ github.repository }}

jobs:
  docker-publish:
    name: Docker Publish
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write
      # This is used to complete the identity challenge
      # with sigstore/fulcio when running outside of PRs.
      id-token: write

    steps:
      - name: Checkout repository
        uses: actions/checkout@v3

      - name: Set up Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v3
        with:
          node-version: 16.x

      - name: Install dependencies
        run: npm install

      - name: Build the Vue frontend
        run: npm run build --if-present

      # Install the cosign tool except on PR
      # https://github.com/sigstore/cosign-installer
      - name: Install cosign
        if: github.event_name != 'pull_request'
        uses: sigstore/cosign-installer@main
        with:
          cosign-release: 'v1.9.0'

      # Workaround: https://github.com/docker/build-push-action/issues/461
      - name: Setup Docker buildx
        uses: docker/setup-buildx-action@v2

      # Login against a Docker registry except on PR
      # https://github.com/docker/login-action
      - name: Log into registry ${{ env.REGISTRY }}
        if: github.event_name != 'pull_request'
        uses: docker/login-action@v2
        with:
          registry: ${{ env.REGISTRY }}
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      # Extract metadata (tags, labels) for Docker
      # https://github.com/docker/metadata-action
      - name: Extract Docker metadata
        id: meta
        uses: docker/metadata-action@v4
        with:
          images: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}
          tags: |
            type=semver,pattern={{version}}
            type=semver,pattern={{major}}.{{minor}}
            type=semver,pattern={{major}}
            type=ref,event=branch
            type=raw,value=latest,enable={{is_default_branch}}

      # Build and push Docker image with Buildx (don't push on PR)
      # https://github.com/docker/build-push-action
      - name: Build and push Docker image
        id: build-and-push
        uses: docker/build-push-action@v3
        with:
          context: .
          push: ${{ github.event_name != 'pull_request' }}
          tags: ${{ steps.meta.outputs.tags }}
          labels: ${{ steps.meta.outputs.labels }}
```

Now repeat this process for the remaining two optional CI tasks of this lab. Use the preconfigured workflows.
</details>

## Continuous Deployment

## Flux2

In this step we are going to deploy the application using Flux2 onto the lab cluster. Flux will manage
the whole lifecycle, from initial deployment to automatic updates in case of changes and new versions.

**Lab Instructions**
1. Clone the Gitops repository for your cluster and create a dedicated apps directory
2. Install the UI service into the backed service namespace using Kustomize
3. (_optional_) Setup the image update automation workflow with suitable image repository and policy

<details>
  <summary markdown="span">Click to expand solution ...</summary>

First, we need to onboard and integrate the application with the Gitops workflow and repository.
```bash
# clone the experience lab Gitops repository
git clone https://github.com/qaware/cloud-native-explab.git
# create dedicated apps directory, e.g.
take applications/bare/microk8s-cloudkoffer/weather-service-vue3/
# initialize Kustomize descriptor
kustomize create
```

Create the relevant Flux2 resources, such as `GitRepository` and `Kustomization` for the application.
```bash
flux create source git cloud-native-weather-vue3 \
    --url=https://github.com/qaware/cloud-native-weather-vue3 \
    --branch=main \
    --interval=5m0s \
    --export > vue3ui-source.yaml

flux create kustomization cloud-native-weather-vue3 \
    --source=GitRepository/cloud-native-weather-vue3 \
    --path="./k8s/overlays/prod" \
    --prune=true \
    --interval=5m0s \
    --target-namespace=weather-golang \
    --export > vue3ui-kustomization.yaml
```

The desired environment specific patches need to be added manually to the `vue3ui-kustomization.yaml`, e.g.
```yaml
  images:
    - name: cloud-native-weather-vue3
      newName: ghcr.io/qaware/cloud-native-weather-vue3 # {"$imagepolicy": "flux-system:cloud-native-weather-vue3:name"}
      newTag: 1.0.0 # {"$imagepolicy": "flux-system:cloud-native-weather-vue3:tag"}
```

Finally, add and configure image repository and policy for the image update automation to work.
```bash
flux create image repository cloud-native-weather-vue3 \
    --image=ghcr.io/qaware/cloud-native-weather-vue3 \
    --interval 1m0s \
    --export > vue3ui-registry.yaml

flux create image policy cloud-native-weather-vue3 \
    --image-ref=cloud-native-weather-vue3 \
    --select-semver=">=1.0.0 <2.0.0" \
    --export > vue3ui-policy.yaml
```

Once all files have been created and modified, Git commit and push everything and watch the cluster
and Flux do the magic.

```bash
# to manually trigger the GitOps process use the following commands
flux reconcile source git flux-system
flux reconcile kustomization applications
flux get all
```
</details>
