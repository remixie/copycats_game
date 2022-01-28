<template>
  <div class="border-white border-2 cursor-pointer">
    <!--<div v-for="d in dimensions" :key="d" class="grid grid-cols-24">
      <div
        v-for="i in dimensions"
        :key="i"
        @mouseenter="[(hover[getMyIndex(d, i, dimensions)] = true)]"
        @mouseleave="hover[getMyIndex(d, i, dimensions)] = false"
        :style="{
          backgroundColor: bgColor(d, i, dimensions),
          'hover:backgroundColor': 'red',
          height: h,
          width: w,
        }"
        :class="{ pixel: hover[getMyIndex(d, i, dimensions)] }"
      ></div>
    </div>-->
    <canvas
      :id="img"
      resize="true"
    />
  </div>
</template>
<script lang="ts">
import paper from "paper";
import { mapGetters } from "vuex";
import img_data from "@/assets/copycat_images.json";
import { Options, Vue } from "vue-class-component";
import filters from "@/assets/filters.json";
//import fs from "fs";
@Options({
  name: "CopyCatImage",
  async mounted() {
    this.pixel_data = await img_data.filter((item) => item.img == this.img);
    this.pixel_data = this.pixel_data[0].data;
    this.opacity = new Array(this.pixel_data.length).fill(1);
    this.background_color = this.pixel_data[0];

    this.scope = new paper.PaperScope();
    this.scope.setup(this.img);

    // Create an empty raster placed at view center.
    let raster = new paper.Raster(
      new paper.Size(96,96),
      this.scope.view.center
      
    );

    //let scaler= 4;
    // For all of its pixels...
    /*for (let q = 0; q < 24*scaler; q+=scaler) {
      for (let j = 0; j < 24*scaler; j+=scaler) {
        for(let r = q; r < q+scaler; r++) {
          for(let k = j; k < j+scaler; k++) {
            //console.log(j/scaler+ " and "+ q/scaler + " meanwhile "+r+" and "+ k)
            raster.setPixel(
              4*q+k,
              4*j+r,
              new paper.Color(this.bgColor(j/scaler, q/scaler, this.dimensions))
            ); //
          }
        }
      }
    }*/
    //console.log()

     for (let q = 1; q <= 24; q++) {
      for (let j = 1; j <= 24; j++) {
        for (let k = 0; k < 4; k++) {
          for (let r = 0; r < 4; r++) {
            //console.log((4*q+k)+" and "+ (4*j+r) +" is "+this.bgColor(j, q, 24))
            raster.setPixel(
              4*q+k,
              4*j+r,
              new paper.Color(this.bgColor(j,q, 24))
            ); //
          }
        }
      }
    }
    console.log(raster.width)
    raster.position = new paper.Point(24, 24);
    // Draw the view now:
    this.scope.view.draw();
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
    img: String,
    h: String,
    w: String,
  },
  methods: {
    async capture() {
      return false;
    },
    bgColor(d: number, i: number, dimensions: number) {
      return "rgb(" + this.exactPixel(this.getMyIndex(d, i, dimensions)) + ")";
    },
    bgColor2(d: number, i: number, dimensions: number) {
      return this.exactPixel(this.getMyIndex(d, i, dimensions));
    },
    getMyIndex(d: number, i: number, dimensions: number) {
      let num = (d - 1) * dimensions + i - 1;
      return num;
    },
    exactPixel(index: number) {
      if (this.pixel_data[index] != null) {
        return this.pixel_data[index].toString();
      }
      return "0,0,0";
    },
  },
  data: () => {
    return {
      png_data: [],
      hover: [],
      scope: null,
      path: null,
      dimensions: 24,
      pixel_data: [],
      background_color: [],
    };
  },
})
export default class CopyCatImage extends Vue {
  img!: string;
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