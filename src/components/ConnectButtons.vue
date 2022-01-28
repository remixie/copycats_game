<template>
  <div v-if="wallet == ''">
    <div
      @click="connectToWallet()"
      class="rounded-full bg-green-400 text-black text-center hover:bg-green-800 hover:text-white mt-10 mx-auto p-2 w-1/4"
    >
      connect your SOL wallet
    </div>
    <eth-connect-button />
    <div
      class="text-xs text-center bg-gray-400 text-black hover:bg-gray-900 p-1 w-1/6 rounded-full mx-auto hover:text-white cursor-pointer mt-5"
      @click="generateGuestWallet()"
    >
      play as a guest
    </div>
  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import { Options, Vue } from "vue-class-component";
import EthConnectButton from "./EthConnectButton.vue";
@Options({
  data: () => {
    return {};
  },
  components: {
    EthConnectButton,
  },
  computed: {
    ...mapGetters({ wallet: "getWallet" }),
  },
  methods: {
    ...mapActions(["setWallet"]),
    async connectToWallet() {
      try {
        const resp = await window.solana.connect();
        this.setWallet(resp.publicKey.toString());
      } catch (err) {
        this.error = { code: 4001, message: "User rejected the request." };
      }
    },
    generateGuestWallet() {
      this.setWallet("guest");
    },
  },
})
export default class ConnectButton extends Vue {}
</script>
<style scoped>
div {
  cursor: pointer;
}
</style>
