<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
  export default {
    name: 'App'
  }
</script>

<style>
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
  }

  /*图片预览 缩略图*/
  .preview figure {
    float: left;
    width: 15%;
    height: 300px;
    margin: 1.5%;
  }

    .preview figure img {
      width: 100%;
    }
</style>
