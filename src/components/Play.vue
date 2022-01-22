<template>
  <div class="mt-6">
    <div class="text-center text-2xl">Score: {{ score }}</div>
    <div class="grid grid-cols-12 mt-5">
    <copy-cat-image
      class="mx-auto mt-2 col-span-8"
      :img="selected_cat.image"
      :interactive="true"
      h="15px"
      w="15px"
    />
    <filters class="col-span-3" />
    </div>
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
