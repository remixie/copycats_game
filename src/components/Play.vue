<template>
  <div class="mt-6">
    <div class="text-center text-2xl">Score: {{ score }}</div>
    <div class="grid grid-cols-12 mt-5">
      <copy-cat-interactive
        class="mx-auto mt-2 col-span-7"
        :cat_info="passCat"
        h="15px"
        w="15px"
      />
      <div class="col-span-4">
        <assets-manager />
        <div
          class="rounded-full text-center text-sm bg-green-400 text-black hover:bg-green-800 hover:text-white cursor-pointer mt-10 mx-auto p-2 w-2/3"
          @click="resetGame()"
        >
          Choose a different Cat
        </div>
        <filters />
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import mapper from "@/assets/asset_pixels/mapper.json";
import { Options, Vue } from "vue-class-component";
import CopyCatInteractive from "./CopyCatInteractive.vue";
import { mapGetters, mapActions } from "vuex";
import Filters from "./Filters.vue";
import AssetsManager from "./AssetsManager.vue";
@Options({
  components: {
    CopyCatInteractive,
    Filters,
    AssetsManager,
  },
  computed: {
    passCat() {
      return this.$store.getters.getChosenCat;
    },
    ...mapGetters({
      playing: "isPlaying",
      score: "currentScore",
    }),
  },
  methods: {
    resetGame() {
      this.setPlayStatus(false);
      this.changeCat("");
      this.resetScore();
    },
    ...mapActions({
      setPlayStatus: "setPlayStatus",
      changeCat: "selectCat",
      resetScore: "resetScore",
    }),
  },
  props: {
    img: String,
  },
})
export default class Play extends Vue {}
</script>
