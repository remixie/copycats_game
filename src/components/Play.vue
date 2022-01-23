<template>
  <div class="mt-6">
    <div class="text-center text-2xl">Score: {{ score }}</div>
    <div class="grid grid-cols-12 mt-5">
      <copy-cat-interactive
        class="mx-auto mt-2 col-span-8"
        :id="mapper.id"
        :interactive="true"
        h="15px"
        w="15px"
      />
      <div class="col-span-3">
        <!--<div>
          <br />
          <input type="checkbox" name="eyes" :value="mapper.eyes" checked />
          <label for="eyes"> Eyes: {{ mapper.eyes }}</label>
          <br />
          <input type="checkbox" name="head" :value="mapper.head" checked />
          <label for="head"> Head: {{ mapper.head }}</label>
          <br />
          <input type="checkbox" name="mask" :value="mapper.mask" checked />
          <label for="mask"> Mask: {{ mapper.mask }}</label>
          <br />
          <input type="checkbox" name="mouth" :value="mapper.mouth" checked />
          <label for="mouth"> Mouth: {{ mapper.mouth }}</label>
          <br />
          <input
            type="checkbox"
            name="clothes"
            :value="mapper.clothes"
            checked
          />
          <label for="clothes"> Clothes: {{ mapper.clothes }}</label>
          <br />
          <input type="checkbox" name="type" :value="mapper.type" checked />
          <label for="type"> Type: {{ mapper.type }}</label>
          <br />
          <input
            type="checkbox"
            name="background"
            :value="mapper.background"
            checked
          />
          <label for="background"> Background: {{ mapper.background }}</label>
        </div>-->
        <div
      class="rounded-full text-center text-sm bg-green-400 text-black hover:bg-green-800 hover:text-white cursor-pointer mt-10 mx-auto p-2 w-full"
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
@Options({
  name: "Play",
  components: {
    CopyCatInteractive,
    Filters,
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
    ...mapGetters({ selected_cat: "getChosenCat", score: "currentScore" }),
  },
  methods:{
    resetGame() {
      this.setPlayStatus(false);
      this.changeCat("");
      this.resetScore();
    },
    ...mapActions({setPlayStatus: "setPlayStatus",
      changeCat: "selectCat",
      resetScore: "resetScore",})
  },
  props: {
    img: String,
  },
})
export default class Play extends Vue {
  img!: string;
}
</script>
