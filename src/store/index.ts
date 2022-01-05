import { createStore } from "vuex";

export default createStore({
  state: {
    wallet: "",
    connection: [],
    cat_list: [],
    current_cat: [],
    playing: false,
    current_score: 0,
    showInstructions: false,
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
  },
});
