## 6) Tilt

In this chapter Tilt as a tool of analyzing running container and simplification of workflow is discussed.

At this point you now created a working Vue frontend and were able to containerize it, deploy it to a container
inside docker as well as a local kubernetes cluster on your device. Furthermore, you were able to create different configurations,
and reducing the effort by using Kustomize. Now, we want to simplify this processes even more. For this reason we want
to take a closer look onto Tilt.

Tilt is a microservice not only deploying to the kubernetes cluster as you wish, it also enables a graphic overview of
your running pods and immediate feedback if something goes wrong or crashes. Furthermore, it updates your kubernetes cluster
on any code change automatically and reduces your command line input to `tilt up`. To get a feeling for all this,
shut down all running kubernetes pods and docker container for now. And go to your command line into the
root folder.

To check, if your tilt is set up correctly and is working, you can type:

```
tilt version
```

an additional time. Now if all is set up correctly, you should be able to run

```
tilt up
``` 

and a short output gives you the option to press spacebar. After you pressed spacebar your standard browser should open
and tilt should start your local kubernetes pods automatically. At this point, check the outputs by taking a closer look
onto all given pods and deployments.

After we saw now how powerful tilt is, let's add tilt to your application. Again, you need to add a setup file for tilt,
a so called Tiltfile. This Tiltfile contains information of your kubernetes yaml files and Dockerfile as well as further
information of port forwarding. Looking at the Tiltfile of this project all will become a little clearer, hopefully.

```
docker_build('cloud-native-weather-vue', '.', dockerfile='Dockerfile')

k8s_yaml(kustomize('k8s/overlays/dev'))

k8s_resource(workload='vue-frontend', port_forwards=[port_forward(13000, 3000, 'HTTP FRONTEND')], labels=['Vue'])

```
The first line in this Tiltfile builds your frontend according to the docker file given in the root directory. Therefore,
the docker image `cloud-native-weather-vue`is created.

The second line uses Kustomize as installed in the previous chapter to gather the yamls of the development server.
According to this the base yaml-files in `k8s/base` as well as all patches from `k8s/overlays/dev` are used.

And the third line starts the pods specifying last environment variables of the frontend.

If you add a Tiltfile as easy as this to your application, you now added Tilt to your project and hopefully need to use
a lot less commands in your workflow. The kubernetes frontend is forwarded to port "13000" and is labeled as "vue-frontend" and
"HTTP Frontend" in your Tilt Overview.

With this Tilt is configured for this application.

---
Last chapter: [Chapter 05 - Kustomize](chapter-5.md)

Next chapter: [Chapter 07- Connect frontend and backend in a kubernetes cluster](chapter-7.md)