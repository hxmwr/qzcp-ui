<template>
    <div class="popDialog">
      <el-dialog  :visible.sync="dialogVisible" :title="submenu_dialog.title"
                  :close-on-click-modal="false" :modal-append-to-body="false" :show-close="false">
        <div class="close_btn" @click="closeDialog"><img src="../img/closeBtn.png" alt=""></div>
        <div class="content">{{submenu_dialog.content}}<img v-if="!submenu_dialog.content" style="width: 100%;" src="../img/mapdemo.jpg" />
        </div>
      </el-dialog>
    </div>
</template>

<script>
    export default {
      name: "developing",
      props:['submenu_dialog'],
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
          font-size:20px;
          padding-bottom:25px;
        }
      }
    }
</style>
