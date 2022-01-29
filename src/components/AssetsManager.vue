<template>
  <div>
    <div class="mb-2">My Assets:</div>
    <div v-for="cc in my_cats" :key="cc.mint" class="inline-block">
      <asset-image
        class="mx-auto w-max cursor-pointer"
        :scale="2"
        :img="parseInt(cc.name.replace('CopyCats #', ''))"
        trait="head"
      />
      <asset-image
        class="mx-auto w-max cursor-pointer"
        :scale="2"
        :img="parseInt(cc.name.replace('CopyCats #', ''))"
        trait="eyes"
      />
      <asset-image
        class="mx-auto w-max cursor-pointer"
        :scale="2"
        :img="parseInt(cc.name.replace('CopyCats #', ''))"
        trait="mouth"
      />
      <asset-image
        class="mx-auto w-max cursor-pointer"
        :scale="2"
        :img="parseInt(cc.name.replace('CopyCats #', ''))"
        trait="clothes"
      />
      <asset-image
        class="mx-auto w-max cursor-pointer"
        :scale="2"
        :img="parseInt(cc.name.replace('CopyCats #', ''))"
        trait="mask"
      />
      <asset-image
        class="mx-auto w-max cursor-pointer"
        :scale="2"
        :img="parseInt(cc.name.replace('CopyCats #', ''))"
        trait="background"
      />
    </div>
  </div>
</template>
<script lang="ts">
import { mapGetters } from "vuex";
import { Options, Vue } from "vue-class-component";
import AssetImage from "./AssetImage.vue";
@Options({
  components: {
    AssetImage,
  },
  computed: {
    ...mapGetters({
      my_cats: "getCatList",
    }),
  },
})
export default class AssetsManager extends Vue {}
</script>
