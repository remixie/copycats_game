<template>
  <div>
    <div class="text-2xl text-center mt-10">
      you selected {{ getID }}.<br />click it again to confirm.
    </div>
    <copy-cat-image
      class="mt-5 border-4 border-white"
      @click="play(true)"
      :img="selected_cat.image"
      :scale="10"
    />
    <div
      class="rounded-full text-center text-sm bg-green-400 text-black hover:bg-green-800 hover:text-white cursor-pointer mt-10 mx-auto p-2 w-1/4"
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
<script lang="ts">
import { mapGetters, mapActions } from "vuex";
import CopyCatImage from "./CopyCatImage.vue";
import { Options, Vue } from "vue-class-component";
@Options({
  components: { CopyCatImage },
  computed: {
    ...mapGetters({ selected_cat: "getChosenCat" }),
    getID() {
      return this.selected_cat.name
        ? this.selected_cat.name.replace("CopyCats", "")
        : "";
    },
  },
  methods: {
    ...mapActions({ changeCat: "selectCat", play: "setPlayStatus" }),
  },
})
export default class ChosenCat extends Vue {}
</script>
