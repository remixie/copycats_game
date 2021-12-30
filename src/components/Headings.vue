<template>
  <div class="text-l text-center">
    <div class="text-xs bg-purple-400 text-purple-900 p-1">
      verify that this site's URL reads as {{ subtitle }}. If unsure, consult
      Rem#0001 on discord.
    </div>
    <img src="/logo.png" class="mx-auto w-1/6 mt-10" />
    <div class="text-5xl mt-2 text-center bg-slate-300">{{ title }}</div>
  </div>
</template>
<script>
export default {
  props: {
    title: String,
    subtitle: String,
  },
  setup() {},
};
</script>