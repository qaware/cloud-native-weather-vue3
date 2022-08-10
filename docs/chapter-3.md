## 3) Dockerize the Vue frontend

In this chapter the concept of Docker in software development as well as its usage is discussed.

Docker is a software enabling developers to containerize their application. These docker images can then be shared and
run on all environments supporting these images, completely independent of the operating system used.

To create a Docker image of your application a so-called Dockerfile needs to be created, telling Docker what to do.
The Dockerfile of this application looks as follows:

```
FROM node:latest as build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY ./ .
RUN npm run build

FROM nginx as production-stage
RUN mkdir /app
COPY --from=build-stage /app/dist /app
COPY nginx.conf /etc/nginx/nginx.conf
```

In the first half, you see the so-called build stage. Here, the mandatory dependencies are installed by npm and the frontend
is build. In the second half, the so-called production stage is given. Here, nginx is used to configure the frontend and 
starting the frontend in a container. 

To achieve this in each of these stages an existing docker image is retrieved by the `FROM` command. These docker images
are given on DockerHub and are extended in the following lines. A working directory is chosen by `WORKDIR` and mandatory 
files are copied into our docker image. Commands are then executed by the `RUN` command. With this the Dockerfile is done 
and able to work for this application.

In this case it is recommended to create a `.dockerignore` file inside your root directory. Filling this file with:

```
**/node_modules
**/dist
```

guarantees that neither intermediate frontend versions nor `node_modules`, which cost much space and are not mandatory here,
are copied to your docker image.

Still, there is one part missing. Inside the Dockerfile a so called `nginx.conf` is given containing the configuration and
desired properties of our frontend containerized in a docker image. This file needs to be created now.

For this go to the root directory of your frontend and create a new file with this name. After that fill the file with
following lines:

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
  server {
    listen       3000;
    server_name  localhost;
    location / {
      root   /app;
      index  index.html;
      try_files $uri $uri/ /index.html;
    }
    error_page   500 502 503 504  /50x.html;
    location = /50x.html {
      root   /usr/share/nginx/html;
    }
  }
}
```

This is a simple `nginx.conf` file, which serves the frontend on port 3000 and handles simple errors and logs for us.

With this configured, you are now able to build your docker image via:

```
docker build -t vue-frontend .
```

and start it via:

```
docker run -p 3000:3000 my-app
```

With this your frontend container should start up and a link given will open your browser and display your application.

Still, this application is containerized, but does not know anything about your backend. Therefore, in the next chapter 
we will discuss how to connect your frontend to a given backend after deploying it to a kubernetes cluster in the following 
chapters.

---
Last chapter: [Chapter 02 - Connect the Vue frontend to the backend locally](chapter-2.md)

Next chapter: [Chapter 04 - Deploy the Vue frontend to kubernetes](chapter-4.md)