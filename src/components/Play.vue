<template>
  <div class="mt-6">
    <div class="text-center text-2xl">Score: {{ score }}</div>
    <div class="grid grid-cols-12 mt-5">
      <copy-cat-interactive
        class="mx-auto mt-2 col-span-7"
        :id="mapper.id"
        h="15px"
        w="15px"
      />
      <div class="col-span-4">
        <div class="">
          <div class="mb-2">My Assets:</div>
          <div v-for="cc in my_cats" :key="cc.mint" class="inline-block">
            <asset-image
              class="mx-auto w-max cursor-pointer"
              h="2px"
              w="2px"
              :img="parseInt(cc.name.replace('CopyCats #', ''))"
              trait="head"
            />
            <asset-image
              class="mx-auto w-max cursor-pointer"
              h="2px"
              w="2px"
              :img="parseInt(cc.name.replace('CopyCats #', ''))"
              trait="eyes"
            />
            <asset-image
              class="mx-auto w-max cursor-pointer"
              h="2px"
              w="2px"
              :img="parseInt(cc.name.replace('CopyCats #', ''))"
              trait="mouth"
            />
            <asset-image
              class="mx-auto w-max cursor-pointer"
              h="2px"
              w="2px"
              :img="parseInt(cc.name.replace('CopyCats #', ''))"
              trait="clothes"
            />
            <asset-image
              class="mx-auto w-max cursor-pointer"
              h="2px"
              w="2px"
              :img="parseInt(cc.name.replace('CopyCats #', ''))"
              trait="mask"
            />
            <!--<asset-image
              class="mx-auto w-max cursor-pointer"
              h="2px"
              w="2px"
              :img="parseInt(cc.name.replace('CopyCats #', ''))"
              trait="type"
            />-->
            <asset-image
              class="mx-auto w-max cursor-pointer"
              h="2px"
              w="2px"
              :img="parseInt(cc.name.replace('CopyCats #', ''))"
              trait="background"
            />
          </div>
        </div>
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
import AssetImage from "./AssetImage.vue";
import Filters from "./Filters.vue";
@Options({
  name: "Play",
  components: {
    CopyCatInteractive,
    Filters,
    AssetImage,
  },
  computed: {
    mapper() {
      return mapper.filter((item) => {
        return (
          item.id ==
          parseInt(
            this.$store.getters.getChosenCat.name.replace("CopyCats #", "")
          )
        );
      })[0];
    },
    ...mapGetters({
      selected_cat: "getChosenCat",
      score: "currentScore",
      my_cats: "getCatList",
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
export default class Play extends Vue {
  img!: string;
}
</script>
