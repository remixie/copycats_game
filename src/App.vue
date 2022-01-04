<template>
  <Base msg="arcade" subheading="https://copycats-game.vercel.app" />
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
@import url("https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap");
html,
body {
  margin: 0;
  font-family: "Press Start 2P" !important;
  background-color: #37393e;
  color: white;
}
</style>
