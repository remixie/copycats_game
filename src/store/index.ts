import State from "vue-slider-component/typings/utils/state";
import { createStore } from "vuex";

export const store = createStore({
  state: {
    wallet: "",
    eth_wallet: "",
    default_background: "37393e",
    custom_background_pixel: "999999",
    background: "37393e",
    cat_list: [],
    current_cat: [],
    keyword: "",
    playing: false,
    head5_toggle: false,
    current_score: 0,
    showInstructions: false,
    filter: false,
    filterType: "B/W",
    filterThreshold: 346, //this was chosen since it seems to work well for lots of cats as the default
  },
  getters: {
    isHead5On(state) {
      return state.head5_toggle;
    },
    getEthWallet(state) {
      return state.eth_wallet;
    },
    getKeyword(state) {
      return state.keyword;
    },
    getDefaultBackground(state) {
      return state.default_background;
    },
    getCustomBackgroundPixel(state) {
      return "#" + state.custom_background_pixel;
    },
    getBackground(state) {
      return "#" + state.background;
    },
    getWallet(state) {
      return state.wallet;
    },
    getCatList(state) {
      return state.cat_list;
    },
    getChosenCat(state) {
      return state.current_cat;
    },
    isPlaying(state) {
      return state.playing;
    },
    currentScore(state) {
      return state.current_score;
    },
    instructionsState(state) {
      return state.showInstructions;
    },
    areTheyWorthy(state) {
      return state.cat_list.length >= 5;
    },
    isFilterOn(state) {
      return state.filter;
    },
    currentFilter(state) {
      return state.filterType;
    },
    whatThreshold(state) {
      return state.filterThreshold;
    },
  },
  mutations: {
    toggleHead5(state) {
      state.head5_toggle = !state.head5_toggle
    },
    changeKeyword(state, word) {
      state.keyword = word;
    },
    changeCurrentTrait(state, payload) {
      state.current_cat = Object.assign(state.current_cat, {
        attributes: payload.attributes,
      });
    },
    changeEthWallet(state, wallet_addr) {
      state.eth_wallet = wallet_addr;
    },
    changeBackground(state, hex) {
      state.background = hex;
    },
    changeCustomBackgroundPixel(state, hex) {
      state.custom_background_pixel = hex;
    },
    changeWallet(state, address) {
      state.wallet = address;
    },
    createCatList(state, list) {
      state.cat_list = list;
    },
    setCat(state, cc) {
      state.current_cat = cc;
    },
    setPlayStatus(state, status) {
      state.playing = status;
    },
    changeScore(state, increment) {
      state.current_score += increment;
    },
    toggleInstructions(state) {
      state.showInstructions = !state.showInstructions;
    },
    toggleFilter(state) {
      state.filter = !state.filter;
    },
    setFilter(state, type) {
      state.filterType = type;
    },
    setFilterThreshold(state, thresh) {
      state.filterThreshold = thresh;
    },
  },
  actions: {
    setHead5Toggle({ commit }) {
      commit("toggleHead5");
    },
    setKeyword({ commit }, word) {
      commit("changeKeyword", word);
    },
    setCurrentTrait({ commit }, payload) {
      commit("changeCurrentTrait", payload);
    },
    setEthWallet({ commit }, wallet_addr) {
      commit("changeEthWallet", wallet_addr);
    },
    setCustomBackgroundPixel({ commit }, hex) {
      commit("changeCustomBackgroundPixel", hex.replace("#", ""));
    },
    setBackground({ commit }, hex) {
      commit("changeBackground", hex.replace("#", ""));
    },
    setWallet({ commit }, address) {
      commit("changeWallet", address);
    },
    setCatList({ commit }, list) {
      commit("createCatList", list);
    },
    selectCat({ commit }, cc) {
      commit("setCat", cc);
    },
    setPlayStatus({ commit }, status) {
      commit("setPlayStatus", status);
    },
    addToScore({ commit }, increment) {
      commit("changeScore", increment);
    },
    resetScore({ dispatch, getters }) {
      dispatch("addToScore", -getters.currentScore);
    },
    changeInstructions({ commit }) {
      commit("toggleInstructions");
    },
    filterSwitch({ commit }) {
      commit("toggleFilter");
    },
    changeFilter({ commit }, type) {
      commit("setFilter", type);
    },
    changeFilterThreshold({ commit }, thresh) {
      commit("setFilterThreshold", thresh);
    },
  },
});
