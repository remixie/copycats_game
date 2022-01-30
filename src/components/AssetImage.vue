<template>
  <div
    class="border-white border-2 inline-block cursor-pointer"
    v-if="assetExists(trait)"
    :title="trait + ': ' + mapped_data[trait]"
    @click="setCurrentTrait({
          attributes: {
            ...getChosenCat.attributes,
          [trait] : mapped_data[trait]}
        })"
  >
    <canvas
      :id="img + '_' + trait"
      :width="24 * scale"
      :height="24 * scale"
      class="border-white mx-auto cursor-pointer"
    />
  </div>
</template>
<script lang="ts">
import { mapGetters, mapActions } from "vuex";
import mapper from "@/assets/asset_pixels/mapper.json";
import backgrounds_data from "@/assets/asset_pixels/backgrounds_pixels.json";
import clothes_data from "@/assets/asset_pixels/clothes_pixels.json";
import heads_data from "@/assets/asset_pixels/heads_pixels.json";
import mouths_data from "@/assets/asset_pixels/mouths_pixels.json";
import eyes_data from "@/assets/asset_pixels/eyes_pixels.json";
import masks_data from "@/assets/asset_pixels/masks_pixels.json";
import type_data from "@/assets/asset_pixels/type_pixels.json";
import { Options, Vue } from "vue-class-component";
import filters from "@/assets/filters.json";
import paper from "paper";
@Options({
  name: "AssetImage",
  mounted() {
    this.rerun();
  },
  computed: {
    ...mapGetters(["isFilterOn", "whatThreshold", "currentFilter","getChosenCat"]),
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
    img: Number,
    trait: String,
    scale: Number,
  },
  methods: {
    ...mapActions([
      'setCurrentTrait'
    ]),
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
    rerun() {
      if (this.assetExists(this.trait)) {
        this.mapped_data = mapper.filter((item) => {
          return item.id == this.img;
        })[0];

        let json_file;

        switch (this.trait) {
          case "head":
            json_file = heads_data;
            break;
          case "eyes":
            json_file = eyes_data;
            break;
          case "background":
            json_file = backgrounds_data;
            break;
          case "mouth":
            json_file = mouths_data;
            break;
          case "mask":
            json_file = masks_data;
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

        let specific_pixels = this.getTraitPixels(
          this.trait,
          576,
          json_file,
          this.mapped_data
        );

        for (var i = 0; i < 576; i++) {
          if (specific_pixels[i][3] != 0) {
            this.pixel_data[i] = specific_pixels[i];
          } else {
            this.pixel_data[i] = [
              255 - 3 * ((i / this.dimensions) % this.dimensions),
              255 - 3 * ((i / this.dimensions) % this.dimensions),
              255 - 3 * ((i / this.dimensions) % this.dimensions),
              255,
            ];
          }
        }
        //console.log(this.img+'_'+this.trait)

        this.scope = new paper.PaperScope();
        this.scope.setup(this.img + "_" + this.trait);
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
      }
    },
    getTraitPixels(
      trait: string,
      length: number,
      json_file: any,
      mapped_data: any
    ) {
      return mapped_data[trait] == "None"
        ? Array.from(Array(length), () => Array(4).fill(0))
        : json_file.filter((item: any) => {
            return item.trait_name == mapped_data[trait];
          })[0].data;
    },
    bgColor(d: number, i: number, dimensions: number) {
      return "rgb(" + this.exactPixel(this.getMyIndex(d, i, dimensions)) + ")";
    },
    getMyIndex(d: number, i: number, dimensions: number) {
      let num = (d - 1) * dimensions + i - 1;
      return num;
    },
    exactPixel(index: number) {
      if (this.pixel_data[index] != null) {
        return this.pixel_data[index].toString();
      }
      return "0,0,0,0";
    },
  },
  data: () => {
    return {
      dimensions: 24,
      pixel_data: [],
    };
  },
})
export default class AssetImage extends Vue {}
</script>
