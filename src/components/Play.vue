<template>
  <div>
    <CopyCatImage :img="img" :spacing="0" :w="14" :h="14" :interactive="true" />
  </div>
</template>
<script>
import CopyCatImage from "./CopyCatImage.vue";
export default {
  name: "Play",
  components: {
    CopyCatImage,
  },
  props: {
    img: String,
  },
};
</script>
