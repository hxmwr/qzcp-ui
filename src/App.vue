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

<style lang="scss">
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
  .dateSel_obj{
    .el-picker-panel__body{
      .el-date-range-picker__time-header{
        .el-date-range-picker__editors-wrap{
          .el-input__inner{
            height:26px;
            line-height: 26px;
            padding: 5px;
            border-radius: 0;
          }
        }
      }
    }
  }
  .popImgWrap{
    /*width:11.9rem;*/
    /*height:6.68rem;*/
    /*img{*/
      /*width:100%;*/
    /*}*/
  }
</style>
