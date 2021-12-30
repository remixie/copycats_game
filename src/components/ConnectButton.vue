<template>
  <div v-if="wallet == ''">
    <div
      @click="connectToWallet()"
      class="
        rounded-full
        bg-green-400
        text-black text-center
        hover:bg-green-800 hover:text-white
        mt-10
        mx-auto
        p-2
        w-1/4
      "
    >
      connect your wallet
    </div>
    <div
      class="
        text-xs text-center
        bg-purple-400
        text-purple-900
        hover:bg-purple-900
        p-1
        w-1/6
        rounded-full
        mx-auto
        hover:text-white
        cursor-pointer
        mt-5
      "
      @click="generateGuestWallet()"
    >
      or play as guest
    </div>
  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
export default {
  data: () => {
    return {};
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
  setup() {},
};
</script>
<style scoped>
div {
  cursor: pointer;
}
</style>