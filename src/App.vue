<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
  @import "./scss/common.scss";
  @font-face{
    font-family: 'pingfangRegular';  /*给自定义字体命名*/
    src:url('~@/assets/fonts/PingFangRegular.ttf') format('truetype');
    font-weight:normal;
    font-style:normal;
  }
  #app {
    /*font-family: 'Avenir', Helvetica, Arial, sans-serif;*/
    font-family: 'pingfangRegular';
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    /*color: #2c3e50;*/
    /*margin-top: 60px;*/
  }
</style>
