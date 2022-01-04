<template>
  <headings :title="msg" :subtitle="subheading" />
  <div v-if="!instructionsState">
    <div v-if="!playing">
      <connect-button />
      <cat-selection v-if="wallet && chosen.length == 0" />
      <chosen-cat v-if="chosen.length != 0" />
    </div>
    <play v-if="playing" />
  </div>
  <instructions v-if="!playing && !wallet" />
</template>

<script>
import ChosenCat from "./ChosenCat.vue";
import Headings from "./Headings.vue";
import ConnectButton from "./ConnectButton.vue";
import Instructions from "./Instructions.vue";
import CatSelection from "./CatSelection.vue";
import { Connection } from "@solana/web3.js";
import { mapActions, mapGetters } from "vuex";
import Play from "./Play.vue";
export default {
  setup() {
    let connection = new Connection("https://api.mainnet-beta.solana.com");
    return { connection };
  },
  computed: {
    ...mapGetters({
      wallet: "getWallet",
      chosen: "getChosenCat",
      playing: "isPlaying",
      instructionsState: "instructionsState",
    }),
  },
  mounted() {
    this.$nextTick(function () {
      this.startSOLConnection(this.connection);
    });
  },
  components: {
    Instructions,
    Headings,
    ConnectButton,
    ChosenCat,
    CatSelection,
    Play,
  },
  props: {
    msg: String,
    subheading: String,
  },
  methods: {
    ...mapActions(["startSOLConnection"]),
  },
};
</script>
