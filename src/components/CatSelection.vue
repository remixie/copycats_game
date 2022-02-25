<template>
  <div class="text-center">
    <!--<div class="text-center text-2xl mt-6">$PAW Balance: 100</div>-->
    <div class="mt-4 md:mt-5" v-if="exec_wallet">
      hello <span class="text-green-400">Executive</span>
      {{ exec_wallet.username }}. please
    </div>
    <div class="text-xl mt-5 md:mt-3">
      {{
          my_cats.length &lt; 1
            ? "loading..."
            : "select a copycat:"
      }}
    </div>
    <div
      :class="[
        'mt-3',
        'grid',
        'w-1/2',
        'mx-auto',
        'grid-cols-' + Math.min(my_cats.length, 2),
        'md:grid-cols-' + Math.min(my_cats.length, 6),
      ]"
    >
      <span v-for="cc in my_cats" :key="cc.mint"
        ><copy-cat-image
          class="mt-1 md:mt-5 mx-auto border-2 border-white"
          @click="selectCat(cc)"
          :img="cc.image"
          :scale="4"
        />
        <div v-if="areTheyWorthy"
          :class="[
            'text-xs pt-1 pb-1 readable mx-auto',
            cc.rarity <= 100
              ? 'rainbow text-white'
              : cc.rarity <= 500
              ? 'bg-black text-white'
              : 'bg-white text-black',
          ]"
          style="width: 104px"
        >
          {{ "Rarity Rank: " + cc.rarity }}
        </div>
      </span>
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
import mapper from "@/assets/asset_pixels/mapper.json";
import rarity from "@/assets/rarities/rarity.json";
@Options({
  computed: {
    exec_wallet() {
      const store = useStore();
      return exec_wallets.filter((item) => {
        return item.wallet_addr == store.getters.getWallet;
      })[0];
    },
    ...mapGetters({
      areTheyWorthy: "areTheyWorthy",
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
        attributes: mapper.filter((item) => {
          return item.id == 2433;
        })[0],
        name: "CopyCats #2433",
        rarity: rarity.filter((item) => {
          return item.id == 2433;
        })[0].rank
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
            rarity: rarity.filter((item) => {
              return (
                item.id.toString() == copycat_nfts[i].data.name.split("#")[1]
              );
            })[0].rank,
            attributes: mapper.filter((item) => {
              return (
                item.id == parseInt(copycat_nfts[i].data.name.split("#")[1])
              );
            })[0],
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
<style scoped>
.readable {
  font-family: arial;
}
</style>
