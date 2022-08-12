# Cloud-native Weather UI with Vue 3

This example implements a simple UI for the weather service using Vue 3.

## Maintainer

M.-Leander Reimer (@lreimer), <mario-leander.reimer@qaware.de>

Robin Kalleicher (@robink001), <robin.kalleicher@qaware.de>

## License

This software is provided under the Apache v2.0 open source license, read the `LICENSE`
file for details.

## Deploy the UI

Before deploying the UI, make sure that a weather service of this workshop is already running on your Kubernetes cluster
on port 8080 as the frontend is depending on this existing weather service.

To deploy the UI using Tilt, execute the command:

```
tilt up
```

inside the root directory of this project.

Alternatively you can deploy this frontend on a local kubernetes cluster by building the docker image locally via the 
command:

```
docker build -t cloud-native-weather-vue .
```

followed by:

```
kubectl apply -k k8s/overlays/dev
```

## Start the UI locally

To instead start the UI locally on your device, go to the root directory of this project and run the command:

```
npm run serve
```

To test the frontend with a given backend of this workshop, make sure the backend is running under `http://localhost:8080`.