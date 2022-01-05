<template>
  <div class="mt-6">
    <div class="text-center text-2xl">Score: {{ score }}</div>
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
<script lang="ts">
import { Options, Vue } from "vue-class-component";
import CopyCatImage from "./CopyCatImage.vue";
import { mapGetters } from "vuex";
@Options({
  name: "Play",
  components: {
    CopyCatImage,
  },
  computed: {
    ...mapGetters({ selected_cat: "getChosenCat", score: "currentScore" }),
  },
  props: {
    img: String,
  },
})
export default class Play extends Vue {
  img!: string;
}
</script>
