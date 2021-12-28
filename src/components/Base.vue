<template>
  <div class="gameplay_area">
    <h1>{{ msg }}</h1>
    <h4>{{ subheading }}</h4>
    <div v-if="account != ''">
      <!--<p>Your Address: {{ account }}</p>-->
      <div v-if="selected_cat.length == 0" class="selector">
        <h2>
          {{
          copycats_metadata.length &lt; 1
            ? "Loading..."
            : "Select a CopyCat:"
          }}
        </h2>
        <table>
          <tr>
            <td
              v-for="cc in copycats_metadata"
              :key="cc.mint"
              @click="select(cc)"
            >
              <CopyCatImage :img="cc.image" :spacing="0" :w="2" :h="2" />
              <!--<img :src="cc.image" />-->
            </td>
          </tr>
        </table>
      </div>
      <div v-else-if="!playing">
        <h2>You selected {{ selected_cat.name.replace("CopyCats ", "") }}</h2>
        <br />
        <button @click="changeCat">Choose a different Cat</button>
        <br />
        <br />
        <CopyCatImage
          :img="selected_cat.img"
          :spacing="0"
          :w="5"
          :h="5"
          @click="play"
        />
        <br />
        Rarity Rank:
        {{ selected_cat.rank }}
        <br />
        Type: {{}}
      </div>
      <Play :img="selected_cat.img" v-if="playing" />
    </div>
    <p v-else>
      <button @click="connectToWallet()">Connect</button>
    </p>
  </div>
</template>

<script>
import rarities from "@/assets/json/rarity.json";
import imagemap from "@/assets/json/img_map.json";
import { Connection } from "@solana/web3.js";
import CopyCatImage from "./CopyCatImage.vue";
import Play from "./Play.vue";
import {
  getParsedNftAccountsByOwner,
  //isValidSolanaAddress,
} from "@nfteyez/sol-rayz";
const connection = new Connection("https://api.mainnet-beta.solana.com");

export default {
  name: "Base",
  components: {
    CopyCatImage,
    Play,
  },
  data: () => {
    return {
      account: "",
      error: [],
      copycats_metadata: [],
      selected_cat: [],
      playing: false,
    };
  },
  props: {
    msg: String,
    subheading: String,
  },
  methods: {
    play() {
      this.playing = true;
    },
    changeCat() {
      this.selected_cat = [];
    },
    select(cat_obj) {
      let rarity = rarities.filter(
        (item) => item.id == cat_obj.name.split("#")[1]
      );

      this.selected_cat = {
        mint: cat_obj.mint,
        attributes: cat_obj.attributes,
        name: cat_obj.name,
        rank: rarity[0].rank,
        img: cat_obj.image,
      };
    },
    async connectToWallet() {
      try {
        const resp = await window.solana.connect();
        this.account = resp.publicKey.toString();

        let ownerToken = this.account;
        const nfts = await getParsedNftAccountsByOwner({
          publicAddress: ownerToken,
          connection,
          serialization: true,
        });

        let copycat_nfts = nfts.filter(
          (cat) =>
            cat.updateAuthority ===
            "9mmdJRBi9zU5t4n633TzMEGyXnRjNEEyogV98uCNH7GD" //address of the copycats project
        );
        let arr = [];
        let n = copycat_nfts.length;

        if (n < 1) {
          this.copycats_metadata = [];
        } else {
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
          this.copycats_metadata = arr;
        }
        //console.log(arr);
        //this.copycats_metadata = copycat_nfts;
      } catch (err) {
        this.error = { code: 4001, message: "User rejected the request." };
      }
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1 {
  font-size: 50px;
  margin: 0;
  padding-top: 10px;
}
h4 {
  margin: 0;
}
button {
  padding: 5px;
  cursor: pointer;
}
.selector {
  margin-top: 20px;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
table {
  margin: 0 auto;
}
</style>
