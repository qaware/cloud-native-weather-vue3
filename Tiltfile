docker_build('cloud-native-weather-vue', '.', dockerfile='Dockerfile')
k8s_yaml(kustomize('k8s/overlays/dev'))
k8s_resource(workload='vue-frontend', port_forwards=[port_forward(13000, 3000, 'HTTP FRONTEND')], labels=['Vue'])

