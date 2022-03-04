<template>
  <div id="app">
    <home3D />
  </div>
</template>

<script>
import home3D from "./components/home3D";

export default {
  name: "App",
  components: {
    home3D
  },
};
</script>

<style>
#app {
  height: 100%;
  width: 100%;
  margin: 0;
  padding: 0;
}
*{
  padding: 0;
  margin: 0;
}

</style>
