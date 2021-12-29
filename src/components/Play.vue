<template>
  <div class="mt-6">
    <copy-cat-image
      class="mx-auto mt-2"
      style="width: 480px"
      :img="selected_cat.image"
      :interactive="true"
      :spacing="0"
      h="20px"
      w="20px"
    />
  </div>
</template>
<script>
import CopyCatImage from "./CopyCatImage.vue";
import { mapGetters } from "vuex";
export default {
  name: "Play",
  components: {
    CopyCatImage,
  },
  computed: {
    ...mapGetters({ selected_cat: "getChosenCat" }),
  },
  props: {
    img: String,
  },
};
</script>
