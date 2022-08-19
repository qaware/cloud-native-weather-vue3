# Cloud-native Weather UI with Vue 3

This example implements a simple UI for the weather service using Vue 3.

## Build and Run locally

Before deploying the UI, make sure that a weather service of this workshop is already running on your Kubernetes cluster
on port 8080 as the frontend is depending on this existing weather service.

To deploy the UI using Tilt, execute the command:

```bash
# to start in Kubernetes either use Tilt or Skaffold
tilt up
skaffold dev --no-prune=false --cache-artifacts=false

# start the UI locally
# make sure the backend is running under `http://localhost:8080`
npm run serve
```

## Maintainer

M.-Leander Reimer (@lreimer), <mario-leander.reimer@qaware.de>

Robin Kalleicher (@robink001), <robin.kalleicher@qaware.de>

## License

This software is provided under the Apache v2.0 open source license, read the `LICENSE`
file for details.
