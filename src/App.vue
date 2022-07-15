<template>
  <img alt="Cloudy logo" src="./assets/cloudy.png" height="300">
  <WeatherView title="Welcome to this Spring Boot Weather Application" msg=""/>
</template>

<script>
import WeatherView from './components/WeatherView.vue'

export default {
  name: 'App',
  components: {
    WeatherView
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>