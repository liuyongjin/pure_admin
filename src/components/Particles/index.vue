<template>
  <div style="min-height:730px; height:100px">
    <div id="particles-js"></div>
  </div>
</template>

<script>
  /* eslint-disable */
  import particlesJs from "particles.js";
  import particlesConfig from "./particles.json";
  export default {
    data() {
      return {};
    },
    mounted() {
      this.init();
    },
    methods: {
      init() {
        particlesJS("particles-js", particlesConfig);
        document.body.style.overflow = "hidden";
      }
    }
  };
</script>

<style scoped>
  #particles-js{
    background-color:#2d3a4b;
    position:fixed;
    width: 100%;
    height: 100%;
    top:0;
    left:0;
    z-index:-1;
  }
</style>