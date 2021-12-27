<template>
  <div class="gameplay_area">
    <h1>{{ msg }}</h1>
    <div v-if="account != ''">
      <p>Your Address: {{ account }}</p>
      <div v-if="selected_cat.length == 0" class="cat-selector">
        Select a CopyCat:
        <table>
          <tr>
            <td
              v-for="cc in copycats_metadata"
              :key="cc.mint"
              @click="select(cc)"
            >
              <img :src="cc.image" />
            </td>
          </tr>
        </table>
      </div>
      <div v-else>
        <h2>You selected {{ selected_cat.name.replace("CopyCats ", "") }}</h2>
        Rarity Rank:
        {{ selected_cat.rank }}
        <br />
        Type:
        {{ selected_cat.attributes[1].value }}
      </div>
    </div>
    <p v-else>
      <button @click="connectToWallet()">Connect</button>
    </p>
  </div>
</template>

<script>
import rarities from "@/assets/json/rarity.json";
import { Connection } from "@solana/web3.js";
import axios from "axios";
import {
  getParsedNftAccountsByOwner,
  //isValidSolanaAddress,
} from "@nfteyez/sol-rayz";
const connection = new Connection("https://api.mainnet-beta.solana.com");

export default {
  name: "HelloWorld",
  data: () => {
    return { account: "", error: [], copycats_metadata: [], selected_cat: [] };
  },
  props: {
    msg: String,
  },
  methods: {
    select(cat_obj) {
      console.log(cat_obj);
      console.log(cat_obj.name.split("#")[1]);

      let rarity = rarities.filter(
        (item) => item.id == cat_obj.name.split("#")[1]
      );

      this.selected_cat = {
        mint: cat_obj.mint,
        attributes: cat_obj.attributes,
        name: cat_obj.name,
        rank: rarity[0].rank,
      };
    },
    async connectToWallet() {
      try {
        const resp = await window.solana.connect();
        this.account = resp.publicKey.toString();
        //console.log(resp);

        let ownerToken = this.account;
        //const result = isValidSolanaAddress(ownerToken);
        //console.log("result", result);
        const nfts = await getParsedNftAccountsByOwner({
          publicAddress: ownerToken,
          connection,
          serialization: true,
        });
        //return nfts;
        //console.log(nfts);

        let copycat_nfts = nfts.filter(
          (cat) =>
            cat.updateAuthority ===
            "9mmdJRBi9zU5t4n633TzMEGyXnRjNEEyogV98uCNH7GD"
        );

        //console.log(copycat_nfts);

        let arr = [];
        let n = copycat_nfts.length;
        for (let i = 0; i < n; i++) {
          //console.log(copycat_nfts[i].data.uri);
          let val = await axios.get(copycat_nfts[i].data.uri);
          arr.push({
            mint: copycat_nfts[i].mint,
            image: val.data.image,
            attributes: val.data.attributes,
            name: val.data.name,
          });
        }
        this.copycats_metadata = arr;

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
.cat-selector {
  margin: 3rem;
}
h1 {
  margin: 0;
  padding-top: 10px;
}
img {
  cursor: pointer;
  width: 100px;
  height: 100px;
  border-radius: 15px;
}
h3 {
  margin: 40px 0 0;
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
</style>
