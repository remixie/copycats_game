<template>
  <div class="text-7xl mt-10 text-center bg-slate-300">{{ title }}</div>
  <div class="text-l text-center">{{ subtitle }}</div>
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