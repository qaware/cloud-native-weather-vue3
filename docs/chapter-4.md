## 4) Deploy the Vue frontend to kubernetes

In this chapter Kubernetes cluster and deployments are discussed.

### Why Kubernetes?

To achieve concepts of a 12 Factor App, we want to be able of a deployment to a
kubernetes cluster independent of local devices.

While docker is used to locally run docker images in containers, kubernetes organizes containers, services and deployments.
This enables developers to watch containers, while kubernetes fully cares about managing running containers, restart
policies, etc..

### Set Up A Local Kubernetes Cluster

To test the deployment to a kubernetes cluster, we can use docker again. Docker Desktop enables developers
to create a local kubernetes cluster for deployments. To enable this go to your local Docker Desktop settings.

To make sure all your settings are set up correctly, open a command line and type:

```
kubectl config get-contexts
```

If docker-desktop is not already chosen as your context, type:

```
kubectl config use-context docker-desktop
```

to do so. To check all is working correctly you can further execute:

```
kubectl get nodes
```

With the local kubernetes cluster set up correctly, we can now start deploying our application!

### Deploy To A Local Kubernetes Cluster

To achieve a deployment you will need files telling what to deploy. Kubectl needs .yaml-files of the structure given in this project,
which distinguishes between pods, deployments, containers and further information needed to define your wanted cluster setup.

Therefore, in this case for a good overview two .yaml-files where created. one of them is used for the deployment and one 
for the service inside the Kubernetes cluster.

At this point, you probably wonder why we need a service and a deployment and can't combine them. A deployment is necessary
as it is responsible to set up a so-called pod. A pod is necessary to give the framework for your application to run in.
It decides how many of your applications run in parallel and how it should behave in certain cases. It declares
dependencies and cares about the context around your app. A service
does not care about these points. It uses a pod to run and grants users network access to the application from
the outside.

With this out of the way it should be clear now, that services and deployments work nicely together. To set up a deployment,
a yaml file could look something like:

```
apiVersion: apps/v1
kind: Deployment
metadata:
  name: vue-frontend
spec:
  selector:
    matchLabels:
      app: vue-frontend
      tier: frontend
      track: stable
  replicas: 1
  template:
    metadata:
      labels:
        app: vue-frontend
        tier: frontend
        track: stable
    spec:
      containers:
        - name: cloud-native-weather-vue
          image: cloud-native-weather-vue
          imagePullPolicy: Never
          ports:
            - name: http
              containerPort: 3000
```

As explained before, here general information is given. Next to the apiVersion of your file, the kind of this file is
clarified as well as the name of the desired pod, labels, environment variables and much more.
An important line in this code is ```ImagePullPolicy: Never```. This prevents your kubernetes of trying to pull a docker
image of docker hub as you want to use your local Docker image. Defining now a service of this app:

```
apiVersion: v1
kind: Service
metadata:
  name: vue-frontend
spec:
  selector:
    app: vue-frontend
  ports:
    - protocol: "TCP"
      port: 3000
      targetPort: http
  type: LoadBalancer
```

your app will be able to be accessed. Analog files for your backend will become necessary as well, during the deployment
of the frontend used in this workshop.

After you fully understood the .yaml-files, you are now capable of deploying to your local cluster. For this open your
command line at the folder your yaml files are in. After that use these to create your application with the commands:

```
kubectl apply -f <yaml-file>
```

To create the frontend of this example open the `k8s/base` folder and type the commands:

```
kubectl apply -f vue-deployment.yaml
kubectl apply -f vue-service.yaml
```

After retrieving information of running pods, with the line

```
kubectl get pods
```

or specific logs of a single pod running:

```
kubectl logs <podname>
```

you should see one running pod in your local kubernetes cluster. If that is the case, congrats, you just deployed your
frontend to a local kubernetes cluster. To now stop your kubernetes cluster, type:

```
kubectl delete -f <yaml-file>
```

and your pod will shut down.

As you probably noticed already, these are a lot of commands to do, so can we simplify that?
Of course, we can.

---
Last chapter: [Chapter 03 - Dockerize the Vue frontend](chapter-3.md)

Next chapter: [Chapter 05- ](chapter-5.md)