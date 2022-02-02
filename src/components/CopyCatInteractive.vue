<template>
  <div class="">
    <div class="text-sm border-2 border-white p-5">
      <div v-for="(m, i) in cat_info.attributes" :key="m">
        <div
          v-if="!Number.isFinite(m) && i != 'background' && i != 'type'"
          class="m-2"
        >
          {{ i.charAt(0) + i.slice(1) + ": " }}
          <span
            v-if="
              m != 'None' &&
              !Number.isFinite(m) &&
              i != 'background' &&
              i != 'type'
            "
            :class="[
              { 'bg-green-500': toggleTraits[i] },
              { 'bg-red-500': !toggleTraits[i] },
              'text-white rounded-md p-1 hover:bg-black cursor-pointer',
            ]"
            @click="
              toggleTraits[i] = !toggleTraits[i];
              rerun();
            "
            >{{ toggleTraits[i] ? "on" : "off" }}</span
          ><span v-else>none</span>
        </div>
      </div>
    </div>
    <div class="border-2 border-white cursor-pointer">
      <div v-for="d in dimensions" :key="d" class="grid grid-cols-24">
        <div
          @mousedown="popPixel(getMyIndex(d, i, dimensions))"
          v-for="i in dimensions"
          :key="i"
          @mouseenter="
            [
              (hover[getMyIndex(d, i, dimensions)] = true),
              isGlide($event, d, i, dimensions),
            ]
          "
          @mouseleave="hover[getMyIndex(d, i, dimensions)] = false"
          :style="{
            backgroundColor: bgColor(d, i, dimensions),
            'hover:backgroundColor': 'red',
            opacity: opacity[getMyIndex(d, i, dimensions)],
            height: h,
            width: w,
          }"
          :class="{ pixel: hover[getMyIndex(d, i, dimensions)] }"
        ></div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { mapActions, mapGetters } from "vuex";
import { Options, Vue } from "vue-class-component";
import filters from "@/assets/filters.json";
import background_data from "@/assets/asset_pixels/backgrounds_pixels.json";
import clothes_data from "@/assets/asset_pixels/clothes_pixels.json";
import head_data from "@/assets/asset_pixels/heads_pixels.json";
import mouth_data from "@/assets/asset_pixels/mouths_pixels.json";
import eyes_data from "@/assets/asset_pixels/eyes_pixels.json";
import mask_data from "@/assets/asset_pixels/masks_pixels.json";
import type_data from "@/assets/asset_pixels/type_pixels.json";
import head5_data from "@/assets/asset_pixels/head5_heads_pixels.json"
@Options({
  name: "CopyCatInteractive",
  created() {
    this.rerun();
  },
  watch: {
    current_cat() {
      this.rerun();
    },
  },
  computed: {
    current_cat() {
      return this.$store.getters.getChosenCat.attributes;
    },
    ...mapGetters(["isFilterOn", "whatThreshold", "currentFilter"]),
    currentFilterData() {
      if (this.$store.getters.currentFilter == "CUSTOM") {
        return [
          { hex: [255, 255, 255], max: "threshold" },
          {
            hex: this.$store.getters.getCustomBackgroundPixel
              .replace("#", "")
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
    cat_info: Object,
    h: String,
    w: String,
  },
  methods: {
    rerun() {
      let json_files = {
        background_data,
        type_data,
        clothes_data,
        head5_data,
        mouth_data,
        mask_data,
        eyes_data,
        head_data,
      };

      let asset_info = [];

      let trait = "";
      for (let asset in json_files) {
        trait = asset.replace("_data", "");
        if (this.assetExists(trait)) {
          asset_info.push(this.getTraitPixels(trait));
        }
      }

      //console.log(asset_info);
      //expected output for asset_info:
      //0: {trait_name: 'Violet', data: Array(578)}
      //1: {trait_name: 'Evil', data: Array(576)}
      //2: {trait_name: 'Black collar', data: Array(576)}

      for (var i = 0; i < asset_info.length; i++) {
        for (var d = 0; d < asset_info[i].data.length; d++) {
          if (
            asset_info[i].data[d][3] != 0 &&
            this.toggleTraits[asset_info[i].trait]
          ) {
            this.pixel_data[d] = asset_info[i].data[d];
          }
        }
      }

      this.background_color = this.pixel_data[0];
      this.num_of_game_pixels = this.pixel_data.filter(
        (item: string, index: number) => this.isThisAnEdgePixel(index)
      ).length;
    },
    getTraitPixels(trait: string) {
      let json_file;

      switch (trait) {
        case "head5":
          json_file = head5_data;
          break;
        case "head":
          json_file = head_data;
          break;
        case "eyes":
          json_file = eyes_data;
          break;
        case "background":
          json_file = background_data;
          break;
        case "mouth":
          json_file = mouth_data;
          break;
        case "mask":
          json_file = mask_data;
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

      if (json_file) {
        let obj = {
          ...json_file.filter((item: any) => {
            return item.trait_name == this.cat_info.attributes[trait];
          })[0],
          trait,
        };
        return obj;
      }
    },
    bgColor(d: number, i: number, dimensions: number) {
      if (this.isFilterOn) {
        return (
          "rgba(" +
          this.applyBWFilter(
            this.exactPixel(this.getMyIndex(d, i, dimensions))
          ) +
          ")"
        );
      } else {
        return (
          "rgba(" + this.exactPixel(this.getMyIndex(d, i, dimensions)) + ")"
        );
      }
    },
    ...mapActions({
      addPoint: "addToScore",
      setPlayStatus: "setPlayStatus",
      changeCat: "selectCat",
      resetScore: "resetScore",
      setCurrentTrait: "setCurrentTrait",
    }),
    applyBWFilter(color: string) {
      let c = color.split(",").map((n) => parseFloat(n));
      let o = c[3];
      //console.log(o)
      c = [c[0], c[1], c[2]];
      let sum = c.reduce((a, b) => a + b);
      if (sum > this.whatThreshold) {
        c = this.currentFilterData[1].hex;
      } else {
        c = this.currentFilterData[0].hex;
      }
      return c[0] + "," + c[1] + "," + c[2] + "," + o;
    },
    getMyIndex(d: number, i: number, dimensions: number): number {
      let num = (d - 1) * dimensions + i - 1;
      return num;
    },
    isThisAnEdgePixel(index: number) {
      let neighbors = this.getNeighborIndexes(index);
      for (let i = 0; i < neighbors.length; i++) {
        if (
          //if any neighbors is not the background color, this might be an edge pixel
          this.pixel_data[neighbors[i]][0] !== this.background_color[0] &&
          this.pixel_data[neighbors[i]][1] !== this.background_color[1] &&
          this.pixel_data[neighbors[i]][2] !== this.background_color[2] &&
          this.pixel_data[index][0] === this.background_color[0] && //this edge pixel has to be a background color pixel
          this.pixel_data[index][1] === this.background_color[1] &&
          this.pixel_data[index][2] === this.background_color[2]
        ) {
          return true;
        }
      }
      return false;
    },
    isGlide(event: MouseEvent, d: number, i: number, dimensions: number) {
      if (this.detectLeftButton(event)) {
        this.popPixel(this.getMyIndex(d, i, dimensions));
      }
    },
    detectLeftButton(event: MouseEvent) {
      if (event.metaKey || event.ctrlKey || event.altKey || event.shiftKey) {
        return false;
      } else if ("buttons" in event) {
        return event.buttons === 1;
      }
    },
    getNeighborIndexes(index: number) {
      let arr = [
        index - this.dimensions - 1,
        index - this.dimensions,
        index - this.dimensions + 1,
        index - 1,
        index + 1,
        index + this.dimensions - 1,
        index + this.dimensions,
        index + this.dimensions + 1,
      ];
      arr = arr.filter(
        (item) =>
          item >= 0 &&
          item < Math.pow(this.dimensions, 2) &&
          (index % 24 == 0 ? item % 24 != 23 : true) &&
          (index % 24 == 23 ? item % 24 != 0 : true)
      );

      return arr;
    },
    exactPixel(index: number) {
      //console.log(s[0] + "," + s[1] + ","+ s[2] + "," + o);
      if (this.pixel_data[index] != null) {
        let s = this.pixel_data[index].toString().split(/,/);
        let o = parseInt(s[3]) / 255;
        return s[0] + "," + s[1] + "," + s[2] + "," + o;
      } else {
        return "0,0,0,255";
      }
    },
    resetGame() {
      this.setPlayStatus(false);
      this.changeCat("");
      this.resetScore();
    },
    popPixel(index: number) {
      if (this.opacity[index] != 0) {
        if (
          this.pixel_data[index][0] == this.background_color[0] &&
          this.pixel_data[index][1] == this.background_color[1] &&
          this.pixel_data[index][2] == this.background_color[2]
        ) {
          if (this.isThisAnEdgePixel(index)) {
            this.num_of_game_pixels -= 1;
            this.addPoint(1);
          }
          this.opacity[index] = 0;

          if (this.num_of_game_pixels == 0) {
            alert("You Win!");
            this.resetGame();
          }
        } else {
          alert("Game Over!");
          this.resetGame();
        }
      }
    },
    assetExists(trait: string) {
      return (
        this.cat_info.attributes[trait] != "None" &&
        this.cat_info.attributes[trait] != undefined
      );
    },
  },

  data: () => {
    return {
      toggleTraits: {
        type: true,
        clothes: true,
        mouth: true,
        mask: true,
        head: true,
        eyes: true,
        background: true,
        head5: true
      },
      hover: [],
      mapped_data: [],
      dimensions: 24,
      pixel_data: [],
      num_of_game_pixels: 576,
      opacity: [],
      background_color: [],
    };
  },
})
export default class CopyCatInteractive extends Vue {
  h!: string;
  w!: string;
}
</script>
<style scoped>
.pixel {
  border: 2px solid black;
  filter: invert(100%);
}
</style>
