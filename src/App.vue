<template>
  <Base msg="arcade" subheading="https://copycats-game.vercel.app" />
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import Base from "./components/Base.vue";

@Options({
  components: {
    Base,
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
  background-color: #37393e;
  color: white;
  -webkit-touch-callout: none; /* iOS Safari */
  -webkit-user-select: none; /* Safari */
  -khtml-user-select: none; /* Konqueror */
  -moz-user-select: none; /* Old version of Firefox */
  -ms-user-select: none; /* Internet Explorer or Edge */
  user-select: none; /* All modern browsers */
}
</style>
