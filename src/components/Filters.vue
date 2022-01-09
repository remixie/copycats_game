<template>
  <div>
    <div
      class="text-center bg-white text-black w-1/6 text-center mx-auto rounded-full cursor-pointer"
      v-if="areTheyWorthy"
      @click="toggleFilter()"
    >
      {{ isFilterOn ? "Remove" : "Activate" }} Filter
    </div>
    <div v-if="isFilterOn">
      <vue-slider
        :min="0"
        :max="765"
        v-model="thresh"
        :width="300"
        class="mx-auto"
      />
      <div
        class="mt-2 text-center mx-auto bg-white text-black w-1/6 rounded-full cursor-pointer"
        @click="menu = !menu"
      >
        Filter: {{ currentFilter }} &#9660;
      </div>
      <div v-if="menu">
        <div
          v-for="f in filters"
          class="mt-1 text-center mx-auto bg-white text-black w-1/6 cursor-pointer"
          :key="f.name"
          @click="
            changeFilter(f.name);
            menu = !menu;
          "
        >
          {{ f.name }}
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import "vue-slider-component/theme/antd.css";
import VueSlider from "vue-slider-component";
import { mapActions, mapGetters } from "vuex";
import filters from "@/assets/json/filters.json";
import { useStore } from "vuex";
import { computed } from "vue";
export default {
  name: "Filters",
  components: {
    VueSlider,
  },
  setup() {
    const store = useStore();
    const thresh = computed({
      get: () => {
        return store.getters.whatThreshold;
      },
      set: (value: number) => {
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
      areTheyWorthy: "areTheyWorthy",
      interactive: "isPlaying",
      isFilterOn: "isFilterOn",
      whatThreshold: "whatThreshold",
      currentFilter: "currentFilter",
    }),
  },
  methods: {
    ...mapActions({
      toggleFilter: "filterSwitch",
      changeFilter: "changeFilter",
      changeFilterThreshold: "changeFilterThreshold",
    }),
  },
};
</script>
