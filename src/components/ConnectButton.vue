<template>
  <div
    v-if="wallet == ''"
    @click="connectToWallet()"
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
  >
    Connect to Phantom
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
  },
  setup() {},
};
</script>
<style scoped>
</style>