<template>
  <div class="mt-6">
    <div class="text-center text-2xl">Score: {{ score }}</div>

    <copy-cat-image
      class="mx-auto mt-2"
      style="width: 360px"
      :img="selected_cat.image"
      :interactive="true"
      h="15px"
      w="15px"
    />
    <filters />
  </div>
</template>
<script lang="ts">
import { Options, Vue } from "vue-class-component";
import CopyCatImage from "./CopyCatImage.vue";
import { mapGetters } from "vuex";
import Filters from "./Filters.vue";
@Options({
  name: "Play",
  components: {
    CopyCatImage,
    Filters,
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
