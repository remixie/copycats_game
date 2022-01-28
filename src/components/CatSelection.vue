<template>
  <div class="text-center">
    <!--<div class="text-center text-2xl mt-6">$PAW Balance: 100</div>-->
    <div class="mt-5" v-if="exec_wallet">
      hello <span class="text-green-400">Executive</span>
      {{ exec_wallet.username }}. please
    </div>
    <div class="text-xl mt-3">
      {{
          my_cats.length &lt; 1
            ? "loading..."
            : "select a copycat:"
      }}
    </div>
    <div
      :class="[
        'grid',
        'w-1/2',
        'mx-auto',
        ' grid-cols-' + Math.min(my_cats.length, 6),
      ]"
    >
      <keep-alive>
        <copy-cat-image
          v-for="cc in my_cats"
          :key="cc.mint"
          class="mt-5 mx-auto"
          @click="selectCat(cc)"
          :img="cc.image"
          h="4px"
          w="4px"
        />
      </keep-alive>
    </div>
  </div>
</template>
<script lang="ts">
import exec_wallets from "@/assets/executive_wallets.json";
import imagemap from "@/assets/img_map.json";
import CopyCatImage from "./CopyCatImage.vue";
import { getParsedNftAccountsByOwner } from "@nfteyez/sol-rayz";
import { mapGetters, mapActions } from "vuex";
import { Options, Vue } from "vue-class-component";
import { useStore } from "vuex";
@Options({
  computed: {
    exec_wallet() {
      const store = useStore();
      return exec_wallets.filter((item) => {
        return item.wallet_addr == store.getters.getWallet;
      })[0];
    },
    ...mapGetters({
      my_cats: "getCatList",
    }),
  },
  components: {
    CopyCatImage,
  },
  data() {
    return {};
  },
  methods: {
    ...mapActions(["setCatList", "selectCat", "setEthWallet"]),
  },
  async mounted() {
    const store = useStore();
    if (store.getters.getWallet == "guest") {
      let arr = [];

      arr.push({
        mint: "guest",
        image: "wEQtZCoiUQwP8KPodTCCd7oeFSnSLVfWZ6c4TW2v0T4",
        attributes: [], //val.data.attributes,
        name: "CopyCats #2433",
      });
      store.dispatch("setCatList", arr);
    } else if (!store.getters.getCatList.length) {
      const nfts = await getParsedNftAccountsByOwner({
        publicAddress: store.getters.getWallet,
      });
      let copycat_nfts = nfts.filter(
        (cat) =>
          cat.updateAuthority === "9mmdJRBi9zU5t4n633TzMEGyXnRjNEEyogV98uCNH7GD" //address of the copycats project
      );
      let arr = [];
      let n = copycat_nfts.length;

      if (n > 0) {
        for (let i = 0; i < n; i++) {
          arr.push({
            mint: copycat_nfts[i].mint,
            image: imagemap
              .filter(
                (obj) =>
                  obj.id.toString() == copycat_nfts[i].data.name.split("#")[1]
              )[0]
              .img.toString(),
            attributes: [], //val.data.attributes,
            name: copycat_nfts[i].data.name,
          });
        }
        store.dispatch("setCatList", arr);
      }
    }
  },
})
export default class CatSelection extends Vue {}
</script>
