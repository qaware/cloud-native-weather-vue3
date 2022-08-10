## 2) Connect the Vue frontend to the backend locally

Now after you personalized your frontend according to your preferences you are able to 
connect it to your backend. First, we want to achieve this locally before we get to the kubernetes cloud native concepts
and deploying.

For this, open the `vue.config.js` file in your root directory. In the beginning it should something like this:

```
const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true
})
```

To connect our frontend to a given backend we need to specify the address of it as well as the kind of calls made to 
this url. To achieve this paste the following code into your config and fill it according to your backend:

```
const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        ws: true,
        changeOrigin: true
      }
    }
  }
})
```

In this case the desired port for our frontend is chosen to be 3000. Furthermore, our backend is given under the address
`'https://localhost:8080'` and api calls to our backend start with `'/api'`.

To show a response of our frontend to the backend, we need to display an information retrieved from the backend in our
frontend component. A simple way to include this is to fill a text field with the value retrieved from. In case
of this weather application the `HelloWorld.vue` file in the `components` folder was replaced by the WeatherView.vue file and 
contains following lines:

```
<template>
  <div class="hello">
    <h1>{{ title }}</h1>
  </div>
  <p v-if="weatherDto.weather != null">{{"The weather in " + weatherDto.city + " is: " + weatherDto.weather + " and "
    + weatherDto.temperature + "°C"}}</p>
  <p v-else-if="weatherDto.city != null">{{"There is no current weather data for: " + weatherDto.city}}</p>
  <p v-else>{{"Tell me where you live!"}}</p>
  <div>
    <input v-model="cityInput" placeholder="Where do you live?" />
    <button @click="search">How is the weather?</button>
  </div>
</template>

<script>
export default {
  name: 'WeatherView',
  props: {
    title: String
  },
  data() {
    return {
      weatherDto: {weather: null, city: null, temperature: null},
      cityInput: ""
    }
  },
  methods: {
    search() {
      fetch("/api/weather?city=" + this.cityInput)
          .then((response) => response.text())
          .then((data) => {this.weatherDto = JSON.parse(data);});
    }
  }
}
</script>

<!-- "scoped" attribute to limit CSS to this component only -->
<style scoped>
input {
  margin-right: 4px;
}
</style>
```

Most importantly the method `search()` is declared retrieving the response of our backend depending on a given city. 
This response is then parsed from a JSON to a data object called weatherDTO, which is then displayed as a text message 
on the screen. 

To test this, go to a repository of the cloud-native-lab containing a backend, change the settings of ports according to 
this backend and start both (first the backend, secondly the frontend) locally. After this you should be able to open the 
browser and observe some data being retrieved and displayed.

---
Last chapter: [Chapter 01 - Creating a Vue.js Application](chapter-1.md)

Next chapter: [Chapter 03 - Dockerize the Vue frontend](chapter-3.md)