<template>
  <div class="text-l text-center">
    <div class="text-xs bg-purple-400 text-purple-900 p-2">
      verify that this site's URL reads as {{ subtitle }}. If unsure, consult
      Rem#0001 on discord.
    </div>
    <img src="/logo.png" class="mx-auto w-1/6 mt-10" />
    <div class="text-2xl md:text-5xl mt-2 text-center bg-slate-300 subtitle">
      {{ title }}
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";

@Options({
  props: {
    title: String,
    subtitle: String,
  },
})
export default class Headings extends Vue {
  msg!: string;
  subheading!: string;
}
</script>
<style scoped>
.subtitle {
  text-shadow: 0px 5px #000;
}
</style>
