<template>
  <div>
    <div
      class="text-center bg-white text-black w-full mt-10 text-center mx-auto rounded-full cursor-pointer"
      @click="
        toggleFilter();
        isFilterOn
          ? setBackground(getBackground)
          : setBackground(getDefaultBackground);
      "
    >
      {{ isFilterOn ? "Remove" : "Activate" }} Filter
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
        class="mt-2 text-center mx-auto bg-white text-black w-full rounded-full cursor-pointer"
        @click="menu = !menu"
      >
        Filter: {{ currentFilter }} &#9660;
      </div>
      <div v-if="menu">
        <div
          v-for="f in filters"
          class="mt-1 text-center mx-auto bg-white text-black w-1/2 cursor-pointer"
          :key="f.name"
          @click="
            changeFilter(f.name);
            menu = !menu;
            setBackground(
              currentFilter == 'CUSTOM'
                ? bgcolor.replace('#', '')
                : f.background
            );
          "
        >
          {{ f.name }}
        </div>
      </div>
      <div v-if="currentFilter == 'CUSTOM'" class="mx-auto text-center">
        <v-swatches
          v-model="color"
          show-fallback
          fallback-input-type="color"
          popover-x="left"
          @click="setCustomBackgroundPixel(color.replace('#', ''))"
          class="border-solid border-2 border-white mt-5"
          :style="'backgroundColor: #' + getCustomBackgroundPixel"
        ></v-swatches>
        <v-swatches
          v-model="bgcolor"
          show-fallback
          fallback-input-type="color"
          popover-x="left"
          @click="setBackground(bgcolor.replace('#', ''))"
          class="border-solid border-2 border-white mt-5"
          :style="'backgroundColor: #' + getBackground"
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

    return {
      thresh,
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
      areTheyWorthy: "areTheyWorthy",
      interactive: "isPlaying",
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
