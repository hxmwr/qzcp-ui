<template>
    <div class="popDialog">
      <el-dialog  :visible.sync="dialogVisible"
                  :close-on-click-modal="false" :modal-append-to-body="false" :show-close="false">
        <div class="close_btn" @click="closeDialog"><img src="../img/closeBtn.png" alt=""></div>
        <div class="content">功能正在开发中,敬请期待~</div>
      </el-dialog>
    </div>
</template>

<script>
    export default {
      name: "developing",
      data(){
          return{
            dialogVisible:true
          }
      },
      methods:{
        closeDialog(){
          this.$emit('closeDevelop');
        },
      }
    }
</script>

<style scoped lang="scss">
  @import '~@/scss/dialog.scss';
  .popDialog /deep/ .el-dialog{
    margin-top: 35vh !important;
    // 弹框头部
     .el-dialog__header {
        height:0.45rem;
        line-height: 0.45rem;
      }
      .el-dialog__body{
        .close_btn{
          top:5px;
        }
        .content{
          font-size:25px;
          padding-bottom:25px;
        }
      }
    }
</style>
