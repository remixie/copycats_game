<template>
  <Base msg="Cut-A-Cat" subheading="by the CopyCats Team" />
</template>

<script>
import Base from "./components/Base.vue";

export default {
  name: "App",
  components: {
    Base,
  },
};
</script>

<style>
html,
body {
  margin: 0;
  background-color: #666;
  color: white;
  height: 100%;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
}
</style>
