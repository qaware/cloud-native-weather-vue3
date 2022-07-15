<template>
  <div class="hello">
    <h1>{{ title }}</h1>
  </div>
  <p>{{msg}}</p>
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
      msg: "Hier könnte Ihre Werbung stehen",
      cityInput: ""
    }
  },
  methods: {
    search() {
      fetch("/api/weather?city=" + this.cityInput)
          .then((response) => response.text())
          .then((data) => {this.msg = data;});
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