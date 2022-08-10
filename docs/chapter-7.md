## 7) Connect frontend and backend in a kubernetes cluster

As you probably noticed by now, the Kubernetes deployment is simple, but does not connect to a given backend so far.

This is of course an important point, which was shifted to the end here to let you first understand the frontend and kubernetes
themselves before connecting this frontend to other applications. To achieve a connection inside the kubernetes cluster, we
need to modify the Dockerfile, which was created in chapter 3 and already was not capable of working with a backend.

For this connection to work, we need to modify our nginx.conf with following lines:

```
  upstream backend {
      server weather-service:8080;
  }
```

as well as:

```
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
```

The `upstream` command describes to our frontend server configured by nginx, that there is a component later called "backend", 
which is named "weather-service". At this "weather-service" we are interested in the port 8080, which is the port our
weather services from the backend in this workshop are running one.

In addition the `location` command now specifies, that all calls to "/api/" should be proxied to the path
`http://backend`, where backend is using the weather-service declared in `upstream` to generate the path to the backend 
application.

With this simple modification now the frontend is capable of connecting to the backend component of this weather application
and retrieve information.

Congrats! When u reached this point, you fully understood the cloud-native concepts of this fronted in the cloud-native 
workshop. To learn more about backend services, feel free to look into the repositories given in this workshop as well!

---
Last chapter: [Chapter 06 - Tilt](chapter-6.md)
