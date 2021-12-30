<template>
  <div>
    <div class="text-2xl text-center mt-10">
      you selected {{ getID }}.<br />click it again to confirm.
    </div>
    <copy-cat-image
      @click="play(true)"
      class="mx-auto mt-2"
      style="width: 240px"
      :img="selected_cat.image"
      :spacing="0"
      h="10px"
      w="10px"
    />
    <div
      class="
        rounded-full
        text-center text-sm
        bg-green-400
        text-black
        hover:bg-green-800 hover:text-white
        cursor-pointer
        mt-10
        mx-auto
        p-2
        w-1/4
      "
      @click="changeCat('')"
    >
      Choose a different Cat
    </div>
    <!--<br />
    <br />
    Rarity Rank:
    {{ selected_cat.rank }}
    <br />
    Type: {{}}-->
  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import CopyCatImage from "./CopyCatImage.vue";
export default {
  components: { CopyCatImage },
  computed: {
    ...mapGetters({ selected_cat: "getChosenCat" }),
    getID() {
      return this.selected_cat.name.replace("CopyCats", "");
    },
  },
  methods: {
    ...mapActions({ changeCat: "selectCat", play: "setPlayStatus" }),
  },
  setup() {
    return {};
  },
};
</script>