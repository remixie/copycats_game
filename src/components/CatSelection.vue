<template>
  <div>
    <!--<div class="text-center text-2xl mt-6">$PAW Balance: 100</div>-->
    <div class="text-xl mt-3 text-center">
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
        ' grid-cols-' + Math.min(my_cats.length, 5),
      ]"
    >
      <copy-cat-image
        v-for="cc in my_cats"
        :key="cc.mint"
        class="mt-5 mx-auto"
        :style="{ width: '96px' }"
        @click="selectCat(cc)"
        :img="cc.image"
        h="4px"
        w="4px"
      />
    </div>
  </div>
</template>
<script lang="ts">
//import web3 from "@solana/web3.js";
import imagemap from "@/assets/json/img_map.json";
import CopyCatImage from "./CopyCatImage.vue";
import { getParsedNftAccountsByOwner } from "@nfteyez/sol-rayz";
import { mapGetters, mapActions } from "vuex";
import { Options, Vue } from "vue-class-component";

@Options({
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
    if (this.wallet == "guest") {
      let arr = [];

      arr.push({
        mint: "guest",
        image: "wEQtZCoiUQwP8KPodTCCd7oeFSnSLVfWZ6c4TW2v0T4",
        attributes: [], //val.data.attributes,
        name: "CopyCats #2433",
      });
      this.setCatList(arr);
    } else {
      const nfts = await getParsedNftAccountsByOwner({
        publicAddress: this.wallet,
        connection: this.connection,
      });

      /*console.log(
        this.connection.getTokenLargestAccounts(
          "3WV4fTWGvtWNvQb8oVU4t99By8KztDLtExqHnkPfHAA9"
        )
      );*/

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
        this.setCatList(arr);
      }
    }
  },
})
export default class CatSelection extends Vue {}
</script>
