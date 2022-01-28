<template>
  <div>
    <headings :title="msg" :subtitle="subheading" />
    <div v-if="!instructionsState">
      <div v-if="!playing">
        <connect-buttons />
        <cat-selection v-if="wallet && chosen.length == 0" />
        <chosen-cat v-if="chosen.length != 0" />
      </div>
      <play v-if="playing" />
    </div>
    <instructions v-if="!playing && !wallet" />
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
