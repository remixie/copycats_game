<template>
  <div>
    <div class="text-xl mt-6 text-center">
      {{
          my_cats.length &lt; 1
            ? "Loading..."
            : "Select a CopyCat:"
      }}
    </div>
    <div class="grid grid-cols-5 w-1/2 mx-auto">
      <span class="" v-for="cc in my_cats" :key="cc.mint">
        <copy-cat-image
          class="mt-5"
          :style="{ width: '96px' }"
          @click="selectCat(cc)"
          :img="cc.image"
          :spacing="0"
          h="4px"
          w="4px"
        />
      </span>
    </div>
  </div>
</template>
<script>
import imagemap from "@/assets/json/img_map.json";
import CopyCatImage from "./CopyCatImage.vue";
import { getParsedNftAccountsByOwner } from "@nfteyez/sol-rayz";
import { mapGetters, mapActions } from "vuex";
export default {
  computed: {
    ...mapGetters({
      wallet: "getWallet",
      connection: "getSOLConnection",
      my_cats: "getCatList",
    }),
  },
  components: {
    CopyCatImage,
  },
  methods: {
    ...mapActions(["setCatList", "selectCat"]),
  },
  async mounted() {
    const nfts = await getParsedNftAccountsByOwner({
      publicAddress: this.wallet,
      connection: this.connection,
      serialization: true,
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
              (obj) => obj.id == copycat_nfts[i].data.name.split("#")[1]
            )[0]
            .img.toString(),
          attributes: [], //val.data.attributes,
          name: copycat_nfts[i].data.name,
        });
      }
      this.setCatList(arr);
    }
  },
};
</script>