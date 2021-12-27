<template>
  <div>
    <table cellspacing="0">
      <tr v-for="d in dimensions" :key="d">
        <td
          v-for="i in dimensions"
          :key="i"
          :style="{
            backgroundColor:
              'rgb(' +
              (pixel_data[0]
                ? pixel_data[0].data[(d - 1) * 24 + i - 1].toString()
                : 'black') +
              ')',
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
  },
  props: {
    img: String,
  },
  data: () => {
    return {
      dimensions: 24,
      pixel_data: [],
    };
  },
};
</script>
<style scoped>
table {
  margin: 0 auto;
}
td {
  width: 5px;
  height: 5px;
  padding: 0;
}
</style>
