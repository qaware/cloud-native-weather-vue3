## 1) Creating A Vue.js Application

In this chapter of this workshop a short introduction into spring boot is given, helping you to create a spring
boot application, which later can be used to apply concepts of cloud native.

To start of go to *Settings/Preferences | Plugins* of your IntelliJ and make sure to install the PlugIns for Typescript,
Javascript as well as Vue to start with your Vue.js application, if that is not already the case on your device.
After that, create a new project and select vue under the javascript folder of the new project dialog.

In addition, you will specify name and place to save for your project on the next page. Furthermore, you need to either give
or install a node interpreter. After you completed these steps, the generation of your Vue application starts fully automatic
and all necessary dependencies to start are set up.

After this process is finished you are already able to start your frontend by typing ` yarn serve` into a terminal at your 
applications root directory. After your frontend started it will tell you the port it choose to run on 
(default: localhost:8080).

After you started your frontend and got a feeling for the starting page, you can now look more closely into the code. 
I recommend to start at App.vue inside the `src` folder of your project. This file should look something like:

```
<template>
  <img alt="Vue logo" src="./assets/logo.png">
  <HelloWorld msg="Welcome to Your Vue.js App"/>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'

export default {
  name: 'App',
  components: {
    HelloWorld
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
```

Besides the not too important style choices made in the bottom section of this document, there are two important steps here.

First, the template gives the structure of the page you can see in your browser window. You can see here it consists
of an image given locally in the `src/assets` folder right on top of a component labeled here with "HelloWorld", which we
will talk about in a moment.

Secondly, here an export is given enabling our application using the reference "App" for this file and use it as start of
our single page frontend by mounting it in main.js file in the `src` folder.

The HelloWorld component mentioned before is now positioned in the `src/componentes` folder and acts like a substructure 
simplifying the code of ur App.vue file by exporting code, as a component to be used in other .vue-files of your application.

Therefore, the App.vue file you just looked on builds your entire application by using the component given in HelloWorld.vue.

With this information you are now able to modify your vue frontend application however you like it. In this workshop we 
want to focus on the cloud native concepts and therefore no more explicit vue guides are given here, but feel free to check out 
other guides to form your frontend as you like it.

---

Next chapter: [Chapter 02 - ](chapter-2.md)