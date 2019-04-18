<template>
    <div class="popDialog">
       <div>
         <el-dialog
           title="告警详情"
           :visible.sync="dialogVisible"
           :close-on-click-modal="false" :modal-append-to-body="false" :show-close="false">
           <div class="close_btn" @click="closeDialog"><img src="../img/closeBtn.png" alt=""></div>
           <!--车牌号-->
           <div class="dialog_con" >
             <div>
               车牌号: <span>浙H19415</span>
             </div>
             <div>
               告警类型: <span>超速告警</span>
             </div>
             <div>
               违章地点: <span>ZQ0168</span>
             </div>
             <div>
               违章时间: <span>2019-04-15 10:34:29</span>
             </div>
             <div>
               违章程度: <span>超速100%以上（55km/h）</span>
             </div>
             <div>违章描述：</div>
             <div>
               <span>浙H19415于2019年4月15日上午10点34分29秒在柯城区双林路由南向北路段被ZQ0168号基站通过雷达测速手段，测得区间55km/h，超速100%以上。</span>
             </div>
             <div>
               违章轨迹: <button class="show_btn" @click="showTrackMap">查看轨迹</button>
             </div>
           </div>

         </el-dialog>
       </div>
    </div>
</template>

<script>
    export default {
      name: "alarmDialog",
      data(){
          return{
            dialogVisible:true
          }
      },
      methods:{
        closeDialog(){
          this.$emit('closeDia');
        },
        showTrackMap(){
          //点击查看轨迹，隐藏界面上所有元素
          this.$emit('toshowTrack');
        }
      }
    }
</script>

<style scoped lang="scss">
  @import '~@/scss/dialog.scss';
  .popDialog{
    .dialog_con{
      .show_btn{
        width:60px;
        height:20px;
        border: 1px solid #017AFF;
        font-size: 12px;
        color: #017AFF;
        border-radius: 0;
        background:#fff;
      }
    }
    .close_btn{
      position:absolute;
      width:40px;
      height:40px;
      top:10px;
      right:10px;
      display:flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      img{
        max-width: 100%;
      }
    }
  }
</style>
