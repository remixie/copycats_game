<template>
  <div class="">
    <div class="text-sm border-2 border-white p-5" v-if="areTheyWorthy">
      <div v-for="(m, i) in mapped_data" :key="m">
        <div
          v-if="
            m != 'None' &&
            !Number.isFinite(m) &&
            i != 'background' &&
            i != 'type'
          "
          class="m-2"
        >
          {{ i.charAt(0).toUpperCase() + i.slice(1) + ": " }}
          <span
            :class="[
              { 'bg-green-500': toggleTraits[i] },
              { 'bg-red-500': !toggleTraits[i] },
              'text-white rounded-md p-1 hover:bg-black cursor-pointer',
            ]"
            @click="
              toggleTraits[i] = !toggleTraits[i];
              rerun();
            "
            >{{ toggleTraits[i] }}</span
          >
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
import mapper from "@/assets/asset_pixels/mapper.json";
import backgrounds_data from "@/assets/asset_pixels/backgrounds_pixels.json";
import clothes_data from "@/assets/asset_pixels/clothes_pixels.json";
import heads_data from "@/assets/asset_pixels/heads_pixels.json";
import mouths_data from "@/assets/asset_pixels/mouths_pixels.json";
import eyes_data from "@/assets/asset_pixels/eyes_pixels.json";
import masks_data from "@/assets/asset_pixels/masks_pixels.json";
import type_data from "@/assets/asset_pixels/type_pixels.json";
@Options({
  name: "CopyCatInteractive",
  created() {
    this.rerun();
  },
  computed: {
    ...mapGetters([
      "areTheyWorthy",
      "isFilterOn",
      "whatThreshold",
      "currentFilter",
    ]),
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
    id: Number,
    h: String,
    w: String,
  },
  methods: {
    async rerun() {
      this.mapped_data = await mapper.filter((item) => {
        return item.id == this.id;
      })[0];

      

      let backgrounds_pixels = await backgrounds_data.filter((item) => {
        return item.trait_name == this.mapped_data.background;
      })[0].data;

      let type_pixels = this.getTraitPixels(
        "type",
        backgrounds_pixels.length,
        type_data,
        this.mapped_data
      );
      let clothes_pixels = this.getTraitPixels(
        "clothes",
        backgrounds_pixels.length,
        clothes_data,
        this.mapped_data
      );
      let mouth_pixels = this.getTraitPixels(
        "mouth",
        backgrounds_pixels.length,
        mouths_data,
        this.mapped_data
      );
      let mask_pixels = this.getTraitPixels(
        "mask",
        backgrounds_pixels.length,
        masks_data,
        this.mapped_data
      );
      let head_pixels = this.getTraitPixels(
        "head",
        backgrounds_pixels.length,
        heads_data,
        this.mapped_data
      );
      let eyes_pixels = this.getTraitPixels(
        "eyes",
        backgrounds_pixels.length,
        eyes_data,
        this.mapped_data
      );

      this.opacity = new Array(this.pixel_data.length).fill(1);

      for (var i = 0; i < backgrounds_pixels.length; i++) {
          this.pixel_data[i] = backgrounds_pixels[i];
        if (type_pixels[i][3] != 0 && this.toggleTraits["type"]) {
          this.pixel_data[i] = type_pixels[i];
        }
        if (clothes_pixels[i][3] != 0 && this.toggleTraits["clothes"]) {
          this.pixel_data[i] = clothes_pixels[i];
        }
        if (mouth_pixels[i][3] != 0 && this.toggleTraits["mouth"]) {
          this.pixel_data[i] = mouth_pixels[i];
        }
        if (mask_pixels[i][3] != 0 && this.toggleTraits["mask"]) {
          this.pixel_data[i] = mask_pixels[i];
        }
        if (head_pixels[i][3] != 0 && this.toggleTraits["head"]) {
          this.pixel_data[i] = head_pixels[i];
        }
        if (eyes_pixels[i][3] != 0 && this.toggleTraits["eyes"]) {
          this.pixel_data[i] = eyes_pixels[i];
        }
        this.opacity[i] = this.pixel_data[i][3] / 255;
      }

      this.background_color = this.pixel_data[0];

      this.num_of_game_pixels = this.pixel_data.filter(
        (item: string, index: number) => this.isThisAnEdgePixel(index)
      ).length;
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
    ...mapActions({
      addPoint: "addToScore",
      setPlayStatus: "setPlayStatus",
      changeCat: "selectCat",
      resetScore: "resetScore",
    }),
    applyBWFilter(color: string) {
      let c = color.split(",").map((n) => parseInt(n, 10));
      let o = c[3];
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
      if (this.pixel_data[index] != null) {
        return this.pixel_data[index].toString();
      }
      else{
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
  },
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
