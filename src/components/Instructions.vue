<template>
  <div
    class="text-xs text-center bg-white text-black hover:bg-black p-1 w-2/12 rounded-full mx-auto hover:text-white cursor-pointer mt-5"
    v-if="!instructionsState"
    @click="changeInstructions()"
  >
    how to play
  </div>
  <div v-else class="mx-auto w-1/2">
    <div class="text-2xl mt-10">how to play</div>
    <div class="mt-5 readable text-2xl">
      1. Log in with your Phantom wallet or a guest account.<br />
      2. Select your CopyCat.<br />
      3. Quickly identify the top left most pixel on the white bordered play
      area. This is your background pixel variant.
      <br />
      4. Begin either left clicking or left click dragging the background pixels
      around the edge of your cat. <br />
      5. If anything other than a background pixel is clicked or dragged on, the
      game ends.
      <br />6. If the cat is successfully cut out of its background, you win!
    </div>
    <div
      @click="changeInstructions()"
      class="text-sm text-center bg-white text-black hover:bg-black p-1 w-1/6 rounded-full mx-auto hover:text-white cursor-pointer mt-5 close-btn"
    >
      close
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { mapActions, mapGetters } from "vuex";
@Options({
  data() {
    return {
      toggle: true,
    };
  },
  computed: {
    ...mapGetters(["instructionsState"]),
  },
  methods: {
    ...mapActions(["changeInstructions"]),
  },
})
export default class Instructions extends Vue {}
</script>
<style scoped>
.readable {
  font-family: arial;
}
</style>
