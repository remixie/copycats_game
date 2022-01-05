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
}
</style>
