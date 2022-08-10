## 5) Kustomize

In this chapter Kustomize as an option of simplifying configurations is displayed.

Now we were able to deploy our applications to a local kubernetes cluster. But this was a lot of effort and now imagine
you want to create different configurations like staging, dev or prod. This will lead to lots and lots of code next to the
effort starting this in the command line.

To reduce this effort Kustomize can be used. Kustomize reduces the different configurations to patches being applied in
so-called overlays. For this inside the `k8s/base` folder a base kustomization.yaml is defined using previous .yaml-files.

```
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization

resources:
  - vue-deployment.yaml
  - vue-service.yaml
```

These are then combined and applied by several patches defining new names
and much more if necessary. An example of a patch applied is given in `k8s/overlays/prod/kustomization.yaml`:

```
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization

images:
  - name: cloud-native-weather-vue
    newName: ghcr.io/qaware/cloud-native-weather-vue3
    newTag: 1.0.0

resources:
  - ../../base/
```

Changes in patches can not only affect the `kustomization` files itself, but other single yaml-files as well.

With this set up, the entire application can be started via a command like:

```
kustomize build <kustomization.yaml directory> | kubectl apply -f -
```

So if you are in the `k8s/base` directory, just execute:

```
kustomize build . | kubectl apply -f -
```

to apply the base kubernetes cluster or:

```
kustomize build ../overlays/prod | kubectl apply -f -
```

to apply the production kubernetes cluster.

---
Last chapter: [Chapter 04 - Deploy the Vue frontend to kubernetes](chapter-4.md)

Next chapter: [Chapter 06 - Tilt](chapter-6.md)