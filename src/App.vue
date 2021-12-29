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
@import url("https://fonts.googleapis.com/css2?family=Baloo+Tamma+2&display=swap");
html,
body {
  margin: 0;
  font-family: "Baloo Tamma 2" !important;
  background-color: #666;
  color: white;
  height: 100%;
}
#app {
  /*font-family: Avenir, Helvetica, Arial, sans-serif;*/
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
