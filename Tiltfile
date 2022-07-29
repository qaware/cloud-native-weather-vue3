print("Hello TiltFile")

docker_build('cloud-native-weather-vue', '.', dockerfile='Dockerfile')
k8s_yaml(['k8s/base/vue-deployment.yaml', 'k8s/base/vue-service.yaml'])
k8s_resource(workload='vue-frontend', port_forwards=[port_forward(13000, 3000, 'HTTP FRONTEND')], labels=['Vue'])

