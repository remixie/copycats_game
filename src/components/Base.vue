<template>
  <div class="pb-20">
    <headings :title="msg" :subtitle="subheading" />
    <div v-if="!instructionsState">
      <div v-if="!playing">
        <connect-buttons />
        <a
          v-if="!wallet"
          href="https://windy-dracorex-29f.notion.site/CopyCats-White-Paper-WIP-72e4589db15248ca97d0fcaa88252287"
          target="_blank"
          ><div
            class="text-xs text-center bg-yellow-100 text-yellow-900 hover:bg-yellow-900 p-1 w-1/2 md:w-1/6 rounded-full mx-auto hover:text-white cursor-pointer mt-5 close-btn"
          >
            white paper
          </div></a
        >
        <cat-selection v-if="wallet && chosen.length == 0" />
        <chosen-cat v-if="chosen.length != 0" />
      </div>
      <play v-if="playing" />
    </div>
    <instructions v-if="!playing && !wallet" />
    <div
      v-if="!playing && !wallet"
      class="mx-auto text-center text-xs readable mt-10 w-5/6 md:w-1/4"
    >
      <span class="font-bold text-green-400">Note:</span> Sketchette will NOT
      ask you to sign anything at this time.<br />
      It will ONLY ask you to connect your wallet. This allow us to get your
      wallet address. If you need clarification, contact Rem#0001 on Discord.
    </div>
  </div>
</template>

<script lang="ts">
import ChosenCat from "./ChosenCat.vue";
import Headings from "./Headings.vue";
import ConnectButtons from "./ConnectButtons.vue";
import Instructions from "./Instructions.vue";
import { Options, Vue } from "vue-class-component";
import { mapActions, mapGetters } from "vuex";
import { defineAsyncComponent } from "vue";
@Options({
  computed: {
    ...mapGetters({
      wallet: "getWallet",
      chosen: "getChosenCat",
      playing: "isPlaying",
      instructionsState: "instructionsState",
    }),
  },
  props: {
    msg: String,
    subheading: String,
  },
  components: {
    Headings,
    Instructions,
    ConnectButtons,
    ChosenCat,
    CatSelection: defineAsyncComponent({
      loader: () => import("./CatSelection.vue"),
    }),
    Play: defineAsyncComponent({
      loader: () => import("./Play.vue"),
      loadingComponent: Headings,
    }),
  },
  methods: {
    ...mapActions(["startSOLConnection"]),
  },
})
export default class Base extends Vue {}
</script>
<style scoped>
.readable {
  font-family: arial;
}
</style>
