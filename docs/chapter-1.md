## 1) Creating A Vue.js Application

In this chapter of this workshop a short introduction into Vue 3 is given, helping you to create a Vue.js application, 
which later can be used to apply concepts of Cloud Native to it.

To start, go to *Settings/Preferences | Plugins* of your IntelliJ installation and make sure to install the PlugIns for 
Typescript, Javascript as well as Vue to start with your Vue.js application, if that is not already the case.
After that, create a new project and select Vue under the javascript folder of the new project dialog.

In addition, you will specify name and a place to save for your project on the next page. Furthermore, you need to either give
or install a node interpreter. After you completed these steps, the generation of your Vue application starts fully automatically
and all necessary dependencies are set up for you.

After this process is finished you are already able to start your frontend by typing ` yarn serve`/`npm run serve` into 
a terminal at your projects root directory. After your frontend started it will tell you the port it has chosen 
(default: 8080). You can then open the given link (default: localhost:8080) and should be able to see the default UI of 
a Vue application.

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
of an image - given locally in the `src/assets` folder - right on top of a component labeled here with "HelloWorld", which we
will talk about in a moment.

Secondly, here an export is given using the reference "App" for this file. This will be mounted in the `src/main.js` file 
making it the entrypoint of the Ui you can see in your browser.

The HelloWorld component mentioned before is positioned in the `src/components` folder as `HelloWorld.vue`. This file contains code just like
`App.vue` and is exported as well. But, instead of using it as starting point of our application this time the code 
is reused as a component in the App.vue file. This inserts this component here and implements the UI given, while reducing 
the code in `App.vue`, improving the structure of your code.

With this information you are now able to modify your vue frontend application however you like it. In this workshop we 
want to focus on the Cloud Native concepts and therefore no more explicit vue guides are given here, but feel free to check out 
other guides to form your frontend or look into the given code more closely.

---

Next chapter: [Chapter 02 - Connect the Vue frontend to the backend locally](chapter-2.md)