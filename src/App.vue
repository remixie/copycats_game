<template>
  <Base
    msg="sketchette"
    class="base"
    :style="'backgroundColor: ' + getBackground"
    subheading="https://sketchette.com"
  />
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { mapGetters } from "vuex";
import Base from "./components/Base.vue";

@Options({
  components: {
    Base,
  },
  computed: {
    ...mapGetters(["getBackground"]),
  },
})
export default class App extends Vue {}
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap");
html,
body {
  margin: 0;
  font-family: "Press Start 2P" !important;
  /*background-color: #37393e;*/
  color: white;
  -webkit-touch-callout: none; /* iOS Safari */
  -webkit-user-select: none; /* Safari */
  -khtml-user-select: none; /* Konqueror */
  -moz-user-select: none; /* Old version of Firefox */
  -ms-user-select: none; /* Internet Explorer or Edge */
  user-select: none; /* All modern browsers */
}

html,
body {
  overflow-x: hidden;
}
body {
  position: relative;
}

html,
body,
#app,
.base {
  width: 100vw;
  min-height: 100vh;
}
</style>
