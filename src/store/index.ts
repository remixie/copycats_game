import { createStore } from "vuex";

export const store = createStore({
  state: {
    wallet: "",
    connection: [],
    cat_list: [],
    current_cat: [],
    playing: false,
    current_score: 0,
    showInstructions: false,
    filter: false,
    filterType: "BW",
    filterThreshold: 346, //this was chosen since it seems to work well for lots of cats as the default
  },
  getters: {
    getWallet(state) {
      return state.wallet;
    },
    getSOLConnection(state) {
      return state.connection;
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
    changeWallet(state, address) {
      state.wallet = address;
    },
    setSOLConnection(state, connection) {
      state.connection = connection;
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
    setWallet({ commit }, address) {
      commit("changeWallet", address);
    },
    startSOLConnection({ commit }, connection) {
      commit("setSOLConnection", connection);
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
