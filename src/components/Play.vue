<template>
  <div>
    <br />
    <br />
    <CopyCatImage :img="img" :spacing="0" :w="20" :h="20" :interactive="true" />
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
