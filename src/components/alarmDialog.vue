<template>
    <div class="popDialog">
       <div>
         <el-dialog
           :title="showTitle"
           :visible.sync="dialogVisible"
           :close-on-click-modal="false" :modal-append-to-body="false" :show-close="false">
           <div class="close_btn" @click="closeDialog"><img src="../img/closeBtn.png" alt=""></div>
           <!--车牌号-->
           <!--告警弹窗内容-->
           <div class="dialog_con" v-show="alarmCon">
             <div>
               车牌号: <span>衢{{ detailAlarm.plate_no}}</span>
             </div>
             <div v-if="detailAlarm.velocity">
               车辆速度：<span>{{(parseFloat(detailAlarm.velocity) * 3600).toFixed(2) }}km/h</span>
             </div>
             <div>
               告警类型: <span>{{detailAlarm.type}}</span>
             </div>
             <div>
               告警地点: <span>{{detailAlarm.location}}</span>
             </div>
             <div>
             </div>
             <div>
               告警时间: <span>{{detailAlarm.time}}</span>
             </div>
             <!--<div>告警描述：</div>-->
             <div>
               <!--<span>浙H19415于2019年4月15日上午10点34分29秒在柯城区双林路由南向北路段被ZQ0168号基站通过雷达测速手段，测得区间55km/h，超速100%以上。</span>-->
               <span>{{detailAlarm.description}}</span>
             </div>
             <div>
               违章轨迹: <button class="show_btn" @click="showTrackMap">查看轨迹</button>
             </div>
           </div>

           <!--事故弹窗内容-->
           <div class="dialog_con" v-show="accidentCon">
             <div>
               车牌号: <span>{{ detailAlarm.plate_no}}</span>
             </div>
             <div>
               事故类型: <span>{{detailAlarm.type}}</span>
             </div>
             <div>
               事故地点: <span>{{detailAlarm.location}}</span>
             </div>
             <div>
               事故时间: <span>{{detailAlarm.time}}</span>
             </div>
             <div>事故描述：</div>
             <div>
               <!--<span>浙H19415于2019年4月15日上午10点34分29秒在柯城区双林路由南向北路段被ZQ0168号基站通过雷达测速手段，测得区间55km/h，超速100%以上。</span>-->
               <span>{{detailAlarm.description}}</span>
             </div>
           </div>
         </el-dialog>
       </div>
    </div>
</template>

<script>
    export default {
      name: "alarmDialog",
      props:['detailType','detailAlarm'],
      data(){
          return{
            dialogVisible:true,
            showTitle:'',
            alarmCon:false,
            accidentCon:false,
          }
      },
      mounted(){
        if(this.detailType==1){
          this.alarmCon = true;
          this.showTitle = '告警详情（衢'+this.detailAlarm['plate_no'] + '）';
        }else{
          this.accidentCon = true;
          this.showTitle = '事故详情（衢'+this.detailAlarm['plate_no'] + '）';
        }
      },
      methods:{
        getDateTimeString(date) {
          let arr = date.toISOString().split('.')[0].split('T')
          return arr[0] + ' ' + arr[1]
        },
        closeDialog(){
          this.$emit('closeDia');
        },
        showTrackMap(){
          //点击查看轨迹，隐藏界面上所有元素
          this.$emit('toshowTrack',{"vehicle_id":this.detailAlarm['vehicle_id'],"flag":1, "start_time": this.getDateTimeString(new Date((new Date).getTime() + 4 * 3600 * 1000))});
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

  }
</style>
