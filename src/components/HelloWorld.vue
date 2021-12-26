<template>
  <div>
    <h1>{{ msg }}</h1>
    <div v-if="account != ''">
      <h3>Your wallet address is: {{ account }}</h3>
      <div class="cat-selector">
        Select a CopyCat:
        <table>
          <tr v-for="cc in copycats_metadata" :key="cc.mint">
            <td>{{ cc.mint }}</td>
          </tr>
        </table>
      </div>
    </div>
    <p v-else>
      <button @click="connectToWallet()">Connect to Phantom Wallet</button>
    </p>
  </div>
</template>

<script>
import { Connection } from "@solana/web3.js";
import {
  getParsedNftAccountsByOwner,
  //isValidSolanaAddress,
} from "@nfteyez/sol-rayz";
const connection = new Connection("https://api.mainnet-beta.solana.com");

export default {
  name: "HelloWorld",
  data: () => {
    return { account: "", error: [], copycats_metadata: [] };
  },
  props: {
    msg: String,
  },
  methods: {
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

        console.log(copycat_nfts);

        this.copycats_metadata = copycat_nfts;
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
