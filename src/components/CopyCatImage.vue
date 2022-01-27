<template>
  <div class="border-white border-2 cursor-pointer">
    <div v-for="d in dimensions" :key="d" class="grid grid-cols-24">
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
    </div>
  </div>
</template>
<script lang="ts">
import { mapGetters } from "vuex";
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
    bgColor(d: number, i: number, dimensions: number) {
      /*if (this.isFilterOn) {
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
      }*/
      return (
          "rgb(" + this.exactPixel(this.getMyIndex(d, i, dimensions)) + ")"
        );
    },
    /*applyBWFilter(color: string) {
      let c = color.split(",").map((n) => parseInt(n, 10));
      let sum = c.reduce((a, b) => a + b);
      if (sum > this.whatThreshold) {
        c = this.currentFilterData[1].hex;
      } else {
        c = this.currentFilterData[0].hex;
      }
      return c[0] + "," + c[1] + "," + c[2];
    },*/
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
      hover: [],
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
