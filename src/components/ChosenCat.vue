<template>
  <div>
    <div class="text-2xl text-center mt-10">
      You selected {{ getID }}.<br />Click it again to confirm.
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
        bg-gray-600
        text-center
        hover:bg-gray-800
        cursor-pointer
        mt-10
        mx-auto
        p-2
        w-1/6
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