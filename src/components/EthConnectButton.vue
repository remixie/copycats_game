<template>
  <div
    :class="[
      {
        'bg-purple-400 hover:bg-purple-800 cursor-pointer hover:text-white text-black':
          noEthWallet,
      },
      'text-xs text-center p-1 w-1/2 md:w-1/4 rounded-full mx-auto   mt-5',
    ]"
    @click="ethConnect()"
  >
    {{
      getEthWallet == "error"
        ? "disconnect this wallet, refresh this page and connect to a wallet that has at least one head5."
        : getEthWallet != ""
        ? "successfully connected to head5.io"
        : "connect to head5.io"
    }}
  </div>
</template>
<script lang="ts">
import axios from "axios";
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
      if (
        typeof window.ethereum !== "undefined" &&
        (this.getEthWallet == "" || this.getEthWallet != "error")
      ) {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });

        const req = await axios.get(
          "https://deep-index.moralis.io/api/v2/" + accounts[0] + "/nft",
          {
            params: {
              token_addresses: "0x89d2e41408eacbbcc5eebeffaaa27fd2a01ff88b",
              chain: "polygon",
            },
            headers: {
              "Content-Type": "application/json",
              "x-api-key":
                "t1DD46G8w9YlVqLMsv41XfFH7oPoQoKloEMzbqjeQXUYUimOALlWx96zgREOYYAs",
            },
          }
        );

        const head5_ids = req.data.result.map((item: any) => {
          return JSON.parse(item.metadata).name.split("#")[1];
        });
        if (head5_ids.length == 0) {
          this.setEthWallet("error");
          alert(
            "There were no head5's detected on Polygon wallet " +
              accounts[0] +
              "."
          );
        } else {
          this.setEthWallet(accounts[0]);
        }
      }
    },
    ...mapActions(["setEthWallet"]),
  },
})
export default class EthConnectButton extends Vue {}
</script>
