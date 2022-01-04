<template>
  <div class="border-white border-2">
    <!--<vue-slider
      v-if="interactive && filter"
      min="0"
      max="765"
      v-model="threshold"
      :width="300"
      class="mx-auto"
    />
    <div class="text-center" v-if="interactive" @click="toggleFilter()">
      Toggle Filter
    </div>-->
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
          backgroundColor: filter
            ? 'rgb(' +
              applyFilter(exactPixel(getMyIndex(d, i, dimensions))) +
              ')'
            : 'rgb(' + exactPixel(getMyIndex(d, i, dimensions)) + ')',
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
<script>
//import "vue-slider-component/theme/antd.css";
//import VueSlider from "vue-slider-component";
import { mapActions } from "vuex";
import img_data from "@/assets/json/extract_img_data.json";
export default {
  name: "CopyCatImage",
  async mounted() {
    this.pixel_data = await img_data.filter((item) => item.img == this.img);
    this.pixel_data = this.pixel_data[0].data;
    this.opacity = new Array(this.pixel_data.length).fill(1);
    this.background_color = this.pixel_data[0];

    this.num_of_game_pixels = this.pixel_data.filter((item, index) =>
      this.isThisAnEdgePixel(index)
    ).length;
  },
  components: {
    //VueSlider,
  },
  props: {
    img: String,
    spacing: Number,
    interactive: Boolean,
    h: String,
    w: String,
  },
  methods: {
    ...mapActions({
      addPoint: "addToScore",
      setPlayStatus: "setPlayStatus",
      changeCat: "selectCat",
      resetScore: "resetScore",
    }),
    applyFilter(color) {
      color = color.split(",").map(Number);
      if (color[0] + color[1] + color[2] > this.threshold) {
        color = new Array(color.length).fill(255);
      } else {
        color = new Array(color.length).fill(0);
      }
      return color.toString();
    },
    toggleFilter() {
      this.filter = !this.filter;
    },
    getMyIndex(d, i, dimensions) {
      return (d - 1) * dimensions + i - 1;
    },
    isThisAnEdgePixel(index) {
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
    isGlide(event, d, i, dimensions) {
      if (this.detectLeftButton(event)) {
        this.popPixel(this.getMyIndex(d, i, dimensions));
      }
    },
    detectLeftButton(event) {
      if (event.metaKey || event.ctrlKey || event.altKey || event.shiftKey) {
        return false;
      } else if ("buttons" in event) {
        return event.buttons === 1;
      } else if ("which" in event) {
        return event.which === 1;
      } else {
        return event.button == 1 || event.type == "click";
      }
    },
    getNeighborIndexes(index) {
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
    exactPixel(index) {
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
    popPixel(index) {
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
      filter: false,
      threshold: 400,
    };
  },
};
</script>
<style scoped>
.pixel {
  border: 2px solid black;
  filter: invert(100%);
}
</style>
