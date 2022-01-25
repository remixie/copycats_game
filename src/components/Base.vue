<template>
  <div>
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
  </div>
</template>

<script lang="ts">
import ChosenCat from "./ChosenCat.vue";
import Headings from "./Headings.vue";
import ConnectButton from "./ConnectButton.vue";
import Instructions from "./Instructions.vue";
import CatSelection from "./CatSelection.vue";
import Play from "./Play.vue";
import { Options, Vue } from "vue-class-component";
import { Connection } from "@solana/web3.js";
import { mapActions, mapGetters } from "vuex";
import { nextTick } from "@vue/runtime-core";

@Options({
  setup() {
    let connection = new Connection("http://api.metaplex.solana.com");
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
  async mounted() {
    await nextTick();
    this.startSOLConnection(this.connection);
  },
  props: {
    msg: String,
    subheading: String,
  },
  components: {
    Headings,
    Instructions,
    ConnectButton,
    ChosenCat,
    CatSelection,
    Play,
  },
  methods: {
    ...mapActions(["startSOLConnection"]),
  },
})
export default class Base extends Vue {
  msg!: string;
  subheading!: string;
}
</script>
