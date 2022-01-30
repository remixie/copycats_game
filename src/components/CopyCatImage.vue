<template>
  <canvas
    :id="img"
    :width="24 * scale"
    :height="24 * scale"
    class="border-white bg-white mx-auto cursor-pointer"
  />
</template>
<script lang="ts">
import paper from "paper";
import { mapGetters } from "vuex";
import img_data from "@/assets/copycat_images.json";
import { Options, Vue } from "vue-class-component";
import filters from "@/assets/filters.json";
@Options({
  name: "CopyCatImage",
  async mounted() {
    this.pixel_data = await img_data.filter((item) => {
      return item.img == this.img;
    });
    this.pixel_data = this.pixel_data[0].data;
    this.opacity = new Array(this.pixel_data.length).fill(1);
    this.background_color = this.pixel_data[0];
    this.scope = new paper.PaperScope();
    this.scope.setup(this.img);
    let raster = new paper.Raster({
      size: new paper.Size(24, 24),
      smoothing: false,
    });
    raster.position = this.scope.view.center;
    this.pixel_data = [].concat(...this.pixel_data);
    let arr = new ImageData(new Uint8ClampedArray(this.pixel_data), 24, 24);
    raster.scale(this.scale);
    raster.setImageData(arr, new paper.Point(0, 0));
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
    scale: Number,
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
      } else {
        return "0,0,0";
      }
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
export default class CopyCatImage extends Vue {}
</script>
<style scoped>
.pixel {
  border: 2px solid black;
  filter: invert(100%);
}
</style>
<style>
canvas[resize] {
  width: 100%;
  height: 100%;
}
</style>
