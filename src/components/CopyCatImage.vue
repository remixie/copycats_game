<template>
  <div>
    <table :cellspacing="spacing">
      <tr v-for="d in dimensions" :key="d">
        <td
          @click="popPixel((d - 1) * 24 + i - 1)"
          :width="w + 'px'"
          :height="h + 'px'"
          v-for="i in dimensions"
          :key="i"
          :style="{
            backgroundColor: 'rgb(' + exactPixel((d - 1) * 24 + i - 1) + ')',
            opacity: opacity[(d - 1) * 24 + i - 1],
          }"
        ></td>
      </tr>
    </table>
  </div>
</template>
<script>
import img_data from "@/assets/json/extract_img_data.json";
export default {
  name: "CopyCatImage",
  async mounted() {
    this.pixel_data = await img_data.filter((item) => item.img == this.img);
    this.opacity = new Array(this.pixel_data[0].data.length).fill(1);
    this.background_color = this.pixel_data[0].data[0];
  },
  props: {
    img: String,
    spacing: Number,
    interactive: Boolean,
    h: Number,
    w: Number,
  },
  computed: {},
  methods: {
    exactPixel(index) {
      if (this.pixel_data[0] != null) {
        return this.pixel_data[0].data[index].toString();
      }
      return "0,0,0";
    },
    popPixel(index) {
      if (this.interactive) {
        if (
          this.pixel_data[0].data[index][0] != this.background_color[0] &&
          this.pixel_data[0].data[index][1] != this.background_color[1] &&
          this.pixel_data[0].data[index][2] != this.background_color[2]
        ) {
          alert("game over!");
        } else {
          this.pixel_data[0].data[index] = [0, 0, 0];
          this.opacity[index] = 0;
        }
      }
    },
  },
  data: () => {
    return {
      dimensions: 24,
      pixel_data: [],
      opacity: [],
      background_color: [],
    };
  },
};
</script>
<style scoped>
table {
  margin: 0 auto;
}
td {
  padding: 0;
}
</style>
