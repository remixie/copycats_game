<template>
  <div class="border-white border-2" v-if="assetExists(trait)">
    <div v-for="d in dimensions" :key="d" class="grid grid-cols-24 gap-0">
      <div
        v-for="i in dimensions"
        :key="i"
        :style="{
          backgroundColor: bgColor(d, i, dimensions),
          height: h,
          width: w,
        }"
      ></div>
    </div>
  </div>
</template>
<script lang="ts">
import { mapGetters } from "vuex";
import mapper from "@/assets/asset_pixels/mapper.json";
import backgrounds_data from "@/assets/asset_pixels/backgrounds_pixels.json";
import clothes_data from "@/assets/asset_pixels/clothes_pixels.json";
import heads_data from "@/assets/asset_pixels/heads_pixels.json";
import mouths_data from "@/assets/asset_pixels/mouths_pixels.json";
import eyes_data from "@/assets/asset_pixels/eyes_pixels.json";
import masks_data from "@/assets/asset_pixels/masks_pixels.json";
import type_data from "@/assets/asset_pixels/type_pixels.json";
import { Options, Vue } from "vue-class-component";
import filters from "@/assets/filters.json";
@Options({
  name: "AssetImage",
  async created() {
    this.rerun();
  },
  computed: {
    ...mapGetters(["isFilterOn", "whatThreshold", "currentFilter"]),
    currentFilterData() {
      if (this.$store.getters.currentFilter == "CUSTOM") {
        return [
          { hex: [255, 255, 255], max: "threshold" },
          {
            hex: this.$store.getters.getCustomBackgroundPixel
              .match(/.{1,2}/g)
              .map((n: string) => parseInt(n, 16)),
            max: "else",
          },
        ];
      } else {
        return filters.filter((item) => {
          return item.name == this.$store.getters.currentFilter;
        })[0].colors;
      }
    },
  },
  props: {
    img: Number,
    trait: String,
    h: String,
    w: String,
  },
  methods: {
    assetExists(trait: string) {
      this.mapped_data = mapper.filter((item) => {
        return item.id == this.img;
      })[0];

      if (this.mapped_data[trait] == "None") {
        return false;
      } else {
        return true;
      }
    },
    rerun() {
      this.mapped_data = mapper.filter((item) => {
        return item.id == this.img;
      })[0];

      let json_file;

      switch (this.trait) {
        case "head":
          json_file = heads_data;
          break;
        case "eyes":
          json_file = eyes_data;
          break;
        case "background":
          json_file = backgrounds_data;
          break;
        case "mouth":
          json_file = mouths_data;
          break;
        case "mask":
          json_file = masks_data;
          break;
        case "type":
          json_file = type_data;
          break;
        case "clothes":
          json_file = clothes_data;
          break;
        default:
        // code block
      }

      let specific_pixels = this.getTraitPixels(
        this.trait,
        576,
        json_file,
        this.mapped_data
      );

      for (var i = 0; i < 576; i++) {
        if (specific_pixels[i][3] != 0) {
          this.pixel_data[i] = specific_pixels[i];
        } else {
          this.pixel_data[i] = [57, 255, 7, 255];
        }
      }
    },
    getTraitPixels(
      trait: string,
      length: number,
      json_file: any,
      mapped_data: any
    ) {
      return mapped_data[trait] == "None"
        ? Array.from(Array(length), (_) => Array(4).fill(0))
        : json_file.filter((item: any) => {
            return item.trait_name == mapped_data[trait];
          })[0].data;
    },
    bgColor(d: number, i: number, dimensions: number) {
      if (this.isFilterOn) {
        return (
          "rgb(" +
          this.applyBWFilter(
            this.exactPixel(this.getMyIndex(d, i, dimensions))
          ) +
          ")"
        );
      } else {
        return (
          "rgb(" + this.exactPixel(this.getMyIndex(d, i, dimensions)) + ")"
        );
      }
    },
    applyBWFilter(color: string) {
      let c = color.split(",").map((n) => parseInt(n, 10));

      let sum = c.reduce((a, b) => a + b);
      if (sum > this.whatThreshold) {
        c = this.currentFilterData[1].hex;
      } else {
        c = this.currentFilterData[0].hex;
      }
      return c[0] + "," + c[1] + "," + c[2];
    },
    getMyIndex(d: number, i: number, dimensions: number) {
      let num = (d - 1) * dimensions + i - 1;
      return num;
    },
    exactPixel(index: number) {
      if (this.pixel_data[index] != null) {
        return this.pixel_data[index].toString();
      }
      return "0,0,0,0";
    },
  },
  data: () => {
    return {
      dimensions: 24,
      pixel_data: [],
    };
  },
})
export default class AssetImage extends Vue {
  h!: string;
  w!: string;
}
</script>
