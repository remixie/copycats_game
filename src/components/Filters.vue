<template>
  <div>
    <div
      class="text-center bg-white text-black hover:bg-black hover:text-white w-2/3 mt-10 mx-auto rounded-full cursor-pointer p-2"
      @click="
        toggleFilter();
        isFilterOn
          ? currentFilter == 'CUSTOM'
            ? setBackground(background)
            : setBackground(
                filters.filter((item) => {
                  return item.name == currentFilter;
                })[0].background
              )
          : setBackground(getDefaultBackground);
      "
    >
      {{ isFilterOn ? "remove" : "activate" }} filter
    </div>
    <div v-if="isFilterOn">
      <vue-slider
        :min="0"
        :max="765"
        v-model="thresh"
        :width="200"
        class="mx-auto mt-2"
      />
      <div
        class="mt-2 text-center mx-auto bg-white hover:bg-black hover:text-white text-black w-2/3 rounded-full cursor-pointer"
        @click="menu = !menu"
      >
        filter: {{ currentFilter }} &#9660;
      </div>
      <div v-if="menu">
        <div
          v-for="f in filters"
          class="mt-1 text-center mx-auto bg-white hover:bg-black hover:text-white text-black w-1/3 cursor-pointer"
          :key="f.name"
          @click="
            changeFilter(f.name);
            menu = !menu;
            setBackground(
              currentFilter == 'CUSTOM'
                ? background
                : f.background
            );
          "
        >
          {{ f.name }}
        </div>
      </div>
      <div v-if="currentFilter == 'CUSTOM'" class="mx-auto text-center">
        <v-swatches
          v-model="foreground"
          show-fallback
          fallback-input-type="color"
          popover-x="left"
          class="border-solid border-2 border-white mt-5"
          :style="'backgroundColor: ' + foreground"
        ></v-swatches>
        <v-swatches
          v-model="background"
          show-fallback
          fallback-input-type="color"
          popover-x="left"
          class="border-solid border-2 border-white mt-5"
          :style="'backgroundColor: ' + background"
        ></v-swatches>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import "vue-swatches/dist/vue-swatches.css";
import VSwatches from "vue3-swatches";
import "vue-slider-component/theme/antd.css";
import VueSlider from "vue-slider-component";
import { mapActions, mapGetters } from "vuex";
import filters from "@/assets/filters.json";
import { useStore } from "vuex";
import { computed } from "vue";
export default {
  name: "Filters",
  components: {
    VueSlider,
    VSwatches,
  },
  setup() {
    const store = useStore();
    const thresh = computed({
      get: () => {
        return store.getters.whatThreshold;
      },
      set: (value) => {
        store.dispatch("changeFilterThreshold", value);
      },
    });

    const foreground = computed({
      get: () => {
        return store.getters.getCustomBackgroundPixel;
      },
      set: (value) => {
        store.dispatch("setCustomBackgroundPixel", value);
      },
    });

    const background = computed({
      get: () => {
        return store.getters.getBackground;
      },
      set: (value) => {
        store.dispatch("setBackground", value);
      },
    });

    return {
      thresh,
      foreground,
      background,
    };
  },
  data() {
    return {
      menu: false,
    };
  },
  computed: {
    filters() {
      return filters;
    },
    ...mapGetters({
      getDefaultBackground: "getDefaultBackground",
      getCustomBackgroundPixel: "getCustomBackgroundPixel",
      getBackground: "getBackground",
      isFilterOn: "isFilterOn",
      whatThreshold: "whatThreshold",
      currentFilter: "currentFilter",
    }),
  },
  methods: {
    ...mapActions({
      setCustomBackgroundPixel: "setCustomBackgroundPixel",
      setBackground: "setBackground",
      toggleFilter: "filterSwitch",
      changeFilter: "changeFilter",
      changeFilterThreshold: "changeFilterThreshold",
    }),
  },
};
</script>
<style scoped>
.sr-only {
  position: absolute;
  overflow: hidden;
  clip: rect(0 0 0 0);
  width: 1px;
  height: 1px;
  margin: -1px;
  padding: 0;
  border: 0;
  white-space: nowrap;
}
</style>
