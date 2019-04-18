<template>
    <div class="popDialog">
       <div>
         <el-dialog
           title="提示"
           :visible.sync="showDialog"
           :close-on-click-modal="false" :modal-append-to-body="false">
           <span>这是一段信息</span>
         </el-dialog>
       </div>
    </div>
</template>

<script>
    export default {
      name: "alarmDialog",
      props:['showDialog'],
      data(){
          return{
            dialogVisible:true
          }
      }
    }
</script>

<style scoped lang="scss">
  @import '~@/scss/dialog.scss';
</style>
