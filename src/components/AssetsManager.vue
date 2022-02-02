<template>
  <div class="mt-5 md:mt-0">
    <div class="text-center md:text-left text-lg md:text-md">My Assets:</div>
    <div class="mx-auto text-center md:text-left">
      <input
        class="text-black p-2 mt-2 txt-md md:text-sm readable font-bold w-2/3"
        @input="acceptInput($event.target.value)"
        placeholder="Search by asset name"
      />
    </div>

    <div class="mt-2 text-center md:text-left">
      <asset-image
        class="mx-auto border-white border-2 cursor-pointer inline-block"
        v-for="a in asset_list"
        :key="a.trait_name"
        :scale="2.5"
        :trait="a.trait"
        :trait-name="a.trait_name"
      />
      <asset-image
        v-if="getEthWallet"
        class="mx-auto border-white border-2 cursor-pointer inline-block"
        :scale="2.5"
        trait="head5"
        trait-name="1217"
      />
      <asset-image
        v-if="getEthWallet"
        class="mx-auto border-white border-2 cursor-pointer inline-block"
        :scale="2.5"
        trait="head5"
        trait-name="2360"
      />
    </div>
  </div>
</template>
<script lang="ts">
import { mapGetters, mapActions, useStore } from "vuex";
import { Options, Vue } from "vue-class-component";
import AssetImage from "./AssetImage.vue";

@Options({
  components: {
    AssetImage,
  },
  mounted() {
    this.rerun();
  },
  methods: {
    acceptInput(value: string) {
      this.setKeyword(value);
      this.rerun();
    },
    ...mapActions(["setKeyword"]),
    removeDuplicates(array: [], key: string) {
      return array.filter(
        (obj, index, self) =>
          index === self.findIndex((el) => el[key] === obj[key])
      );
    },
    rerun() {
      let arr = [] as any[];
      for (let cc in this.$store.getters.getCatList) {
        arr.push(this.$store.getters.getCatList[cc].attributes);
      }

      let tarr = [] as any[];
      arr = arr.map((x: any) => {
        tarr = [];
        for (var t = 0; t < this.traits.length; t++) {
          if (
            this.$store.getters.getKeyword.length === 0 ||
            x[this.traits[t]]
              .toLowerCase()
              .includes(this.$store.getters.getKeyword.toLowerCase())
          ) {
            tarr.push({ trait: this.traits[t], trait_name: x[this.traits[t]] });
          }
          /*if(store.getters.getKeyword.length > 0 && x[this.traits[t]].includes(store.getters.getKeyword)){
          tarr.push({ trait: this.traits[t], trait_name: x[this.traits[t]] });
        }
        else{

        }*/
        }
        return tarr;
        /*return [
        { trait: "background", trait_name: x.background },
        { trait: "mask", trait_name: x.mask },
        { trait: "clothes", trait_name: x.clothes },
        { trait: "eyes", trait_name: x.eyes },
        { trait: "mouth", trait_name: x.mouth },
        { trait: "head", trait_name: x.head },
      ];*/
      });
      arr = [].concat(...arr);
      arr = this.removeDuplicates(arr, "trait_name");
      this.asset_list = arr;
    },
  },
  computed: {
    ...mapGetters({
      my_cats: "getCatList",
      getEthWallet: "getEthWallet"
    }),
  },

  data() {
    return {
      asset_list: [],
      traits: ["head", "mouth", "mask", "background", "clothes", "eyes"],
    };
  },
})
export default class AssetsManager extends Vue {}
</script>
<style scoped>
.readable {
  font-family: arial;
}
</style>
