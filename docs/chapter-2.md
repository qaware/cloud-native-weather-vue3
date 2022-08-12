## 2) Connect The Vue Frontend To The Backend Locally

Now after you personalized your frontend according to your preferences you are able to 
connect it to your backend. First, we want to achieve this locally, before we get to Kubernetes, Cloud Native concepts
and Deployments.

### Modify The Vue.config.js

Open the `vue.config.js` file in your root directory. In the beginning it should look something like this:

```
const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true
})
```

To connect our frontend to a given backend we need to specify the address of it as well as the kind of calls made to 
this url. To achieve this follow these steps:

1) Create a devServer component
2) Specify the desired port for your UI (we choose 3000)
3) Create a proxy component inside your devServer
4) Specify that the api calls start with `/api` and the backend runs on `localhost:8080`

Alternatively just paste the code of the solution.

<details>
  <summary markdown="span">Click to expand solution ...</summary>

```
const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    // desired port for your UI
    port: 3000,
    proxy: {
      // according to our backend api calls start with /api
      '/api': {
        // the local backend is running on localhost:8080
        target: 'http://localhost:8080',
        ws: true,
        changeOrigin: true
      }
    }
  }
})
```
</details>

### Modify The Vue Component

To show a response of our frontend to the backend, we need to display an information retrieved from the backend in our
frontend component.

To obtain the result given in thiss repository follow these steps:


1) Rename `HelloWorld.vue` to `WeatherView.vue` as this is a weather UI
2) Modify your export in this component as well as in `App.vue` (it is recommended to test your frontend afterwards before continuing)
3) Add a date object to your `WeatherView.vue` called weatherDto, containing three variables: weather, city, temperature (initially null)
4) Add a text field displaying these result, in case they are not empty
5) Add a String variable to your component called cityInput, which will be filled by the user and given to the backend
6) Add an input field to the frontend, which is connected to the cityInput variable
7) Implement a method called search, which calls the backend via an api call (`"/api/weather?city=" + this.cityInput`) and
   fills the weatherDto Object via parsing the retrieved JSON response.
8) Implement a button, which executed your newly created search method on click.


Alternatively the code obtained is given below.

<details>
  <summary markdown="span">Click to expand solution ...</summary>

```
<template>
  <div class="hello">
    <h1>{{ title }}</h1>
  </div>
  
  <!-- v-if checks if the weatherDto is empty -->
  <p v-if="weatherDto.weather != null">{{"The weather in " + weatherDto.city + " is: " + weatherDto.weather + " and "
  + weatherDto.temperature + "°C"}}</p>
  <p v-else-if="weatherDto.city != null">{{"There is no current weather data for: " + weatherDto.city}}</p>
  <!-- if there is no weather information so far an alternative message is shown -->
  <p v-else>{{"Tell me where you live!"}}</p>
  
  <div>
    <!-- v-model connects the cityInput variable in this component to the text Field -->
    <input v-model="cityInput" placeholder="Where do you live?" />
    <!-- @click connects the search method to this button click -->
    <button @click="search">How is the weather?</button>
  </div>
</template>

<script>
export default {
  name: 'WeatherView',
  props: {
    title: String
  },
  // data objects are specified in this data() component
  data() {
    return {
      // weatherDto is an object, consisting of multiple variables obtained by a JSON of the backend
      weatherDto: {weather: null, city: null, temperature: null},
      // cityInput is a String variable, modified by the user in the frontend and given to the backend 
      cityInput: ""
    }
  },
  // methods including for example api calls are defined in the methods component
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
</details>

### Testing The Connection

To test this, go to a repository of the cloud-native-lab containing a backend, change the settings of ports according to 
this configuration (backend: 8080, frontend: 3000) and start both (first the backend, secondly the frontend) locally. 
After this you should be able to open the browser and observe some data being retrieved and displayed.

---
Last chapter: [Chapter 01 - Creating a Vue.js Application](chapter-1.md)

Next chapter: [Chapter 03 - Containerize the Vue frontend](chapter-3.md)