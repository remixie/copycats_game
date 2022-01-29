<template>
  <div
    :class="[
      {
        'bg-purple-400 hover:bg-purple-800 cursor-pointer hover:text-white text-black':
          noEthWallet,
      },
      'text-xs text-center p-1 w-1/5 rounded-full mx-auto   mt-5',
    ]"
    @click="ethConnect()"
  >
    {{
      getEthWallet != "" ? "head5.io connection established" : "connect to head5.io"
    }}
  </div>
</template>
<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { useStore } from "vuex";
import { mapGetters, mapActions } from "vuex";
declare var window: any;
@Options({
  computed: {
    noEthWallet() {
      const store = useStore();
      return store.getters.getEthWallet == "";
    },
    ...mapGetters({
      wallet: "getWallet",
      my_cats: "getCatList",
      getEthWallet: "getEthWallet",
    }),
  },
  methods: {
    async ethConnect() {
      if (typeof window.ethereum !== "undefined") {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        this.setEthWallet(accounts[0]);
      }
    },
    ...mapActions(["setEthWallet"]),
  },
})
export default class EthConnectButton extends Vue {}
</script>
