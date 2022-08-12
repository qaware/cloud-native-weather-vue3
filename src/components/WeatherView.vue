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