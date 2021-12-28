<template>
  <div>
    <table :cellspacing="spacing">
      <tr v-for="d in dimensions" :key="d">
        <td
          @click="popPixel((d - 1) * dimensions + i - 1)"
          :width="w + 'px'"
          :height="h + 'px'"
          v-for="i in dimensions"
          :key="i"
          :style="{
            backgroundColor:
              'rgb(' + exactPixel((d - 1) * dimensions + i - 1) + ')',
            opacity: opacity[(d - 1) * dimensions + i - 1],
          }"
        >
          {{ (d - 1) * dimensions + i - 1 }}
        </td>
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

    this.num_of_game_pixels = this.pixel_data[0].data.filter((item, index) =>
      this.isThisAnEdgePixel(this.pixel_data[0].data, index)
    );
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
    isThisAnEdgePixel(arr, index) {
      let neighbors = this.getNeighborIndexes(index);
      for (let i = 0; i < neighbors.length; i++) {
        if (
          //if any neighbors is not the background color, this might be an edge pixel
          arr[neighbors[i]][0] != this.background_color[0] &&
          arr[neighbors[i]][1] != this.background_color[1] &&
          arr[neighbors[i]][2] != this.background_color[2] &&
          arr[index][0] == this.background_color[0] && //this edge pixel has to be a background color pixel
          arr[index][1] == this.background_color[1] &&
          arr[index][2] == this.background_color[2]
        ) {
          return true;
        }
      }
      return false;
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
      if (this.pixel_data[0] != null) {
        return this.pixel_data[0].data[index].toString();
      }
      return "0,0,0";
    },
    popPixel(index) {
      if (this.interactive) {
        if (
          this.opacity[index] != 0 &&
          this.pixel_data[0].data[index][0] != this.background_color[0] &&
          this.pixel_data[0].data[index][1] != this.background_color[1] &&
          this.pixel_data[0].data[index][2] != this.background_color[2]
        ) {
          alert("game over!");
        } else {
          //console.log(this.getNeighborIndexes(index));
          console.log(this.isThisAnEdgePixel(this.pixel_data[0].data, index));

          //this.pixel_data[0].data[index] = [0, 0, 0];
          this.opacity[index] = 0;
        }
      }
    },
  },
  data: () => {
    return {
      dimensions: 24,
      pixel_data: [],
      num_of_game_pixels: 0,
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
  border: 2px solid transparent;
  cursor: pointer;
}
td:hover {
  border: 2px solid white;
  filter: invert(100%);
}
</style>
