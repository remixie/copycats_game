<template>
  <div class="border-white border-2">
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
        :class="[{ pixel: hover[getMyIndex(d, i, dimensions)] }]"
      ></div>
    </div>
  </div>
</template>
<script lang="ts">
import "vue-slider-component/theme/antd.css";
import VueSlider from "vue-slider-component";
import { mapActions, mapGetters } from "vuex";
import img_data from "@/assets/copycat_images.json";
import { Options, Vue } from "vue-class-component";
import filters from "@/assets/filters.json";
@Options({
  name: "CopyCatImage",
  async mounted() {
    this.pixel_data = await img_data.filter((item) => item.img == this.img);
    this.pixel_data = this.pixel_data[0].data;
    this.opacity = new Array(this.pixel_data.length).fill(1);
    this.background_color = this.pixel_data[0];

    this.num_of_game_pixels = this.pixel_data.filter(
      (item: string, index: number) => this.isThisAnEdgePixel(index)
    ).length;
  },
  components: {
    VueSlider,
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
    img: String,
    interactive: Boolean,
    h: String,
    w: String,
  },
  methods: {
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
      return "0,0,0";
    },
    resetGame() {
      this.setPlayStatus(false);
      this.changeCat("");
      this.resetScore();
    },
    popPixel(index: number) {
      if (this.interactive) {
        if (
          this.opacity[index] == 1 &&
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
        } else if (this.opacity[index] == 1) {
          alert("Game Over!");
          this.resetGame();
        }
      }
    },
  },
  data: () => {
    return {
      hover: [],
      dimensions: 24,
      pixel_data: [],
      num_of_game_pixels: 576,
      opacity: [],
      background_color: [],
    };
  },
})
export default class CatSelection extends Vue {
  img!: string;
  interactive!: boolean;
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
