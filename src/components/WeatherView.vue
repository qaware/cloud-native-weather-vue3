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