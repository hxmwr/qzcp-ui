<template>
  <div class="popDialog">
    <div>
      <el-dialog
        title="车辆信息"
        :visible.sync="dialogVisible"
        :close-on-click-modal="false" :modal-append-to-body="false" :show-close="false">
        <div class="close_btn" @click="closeDialog"><img src="../img/closeBtn.png" alt=""></div>
        <!--车牌号-->
        <div class="dialog_con" v-if="!emptyShow">
          <div class="flex info_icon">
            <i></i>
            <div>
              <p>{{detailMobileInfo.plate_no}}</p>
              <div>{{detailMobileInfo.name}}</div>
            </div>
          </div>
          <div>
            <!--车辆类型: <span>{{detailMobileInfo.type}}</span>-->
            车辆类型：<span>普通电动车</span>
          </div>
          <div>
            联系方式: <span>{{detailMobileInfo.mobile}}</span>
          </div>
          <div>
            <!--注册地: <span>{{detailMobileInfo.location}}</span>-->
            注册地：<span>柯城区</span>
          </div>
          <div class="split_line"></div>
          <!--<div>-->
            <!--待处理违法: <span>共计4次违法记录</span> <button class="show_btn">查看详情</button>-->
          <!--</div>-->
          <div class="mobile_infoTime">
            <div class="mobile_infoTitle">轨迹查询:</div>
            <div class="mobile_dataWrap">
              <el-date-picker
                v-model="dataArea"
                type="datetimerange"
                value-format="yyyy-MM-dd HH:mm:ss"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期" popper-class="dateSel_obj">
              </el-date-picker>
              <div class="mobile_dataNext" @click="searchTrack"></div>
            </div>
          </div>
        </div>

        <div class="show_empty" v-if="emptyShow">
          未搜索到相关信息。
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
  export default {
    name: "mobileInfo",
    props:['detailMobileInfo','selectTimeArea'],
    data(){
      return{
        dialogVisible:true,
        dataArea:[],
        emptyShow:true,
      }
    },
    mounted(){
      if(this.detailMobileInfo){
        this.emptyShow = false;
        if(this.selectTimeArea){
          // this.dataArea = [new Date(this.selectTimeArea['start_time']),new Date(this.selectTimeArea['end_time'])];
          console.log(this.selectTimeArea);
          this.dataArea = [this.selectTimeArea['start_time'],this.selectTimeArea['end_time']];
        }
      }else{
        this.emptyShow = true;
      }
    },
    methods:{
      closeDialog(){
        this.$emit('closeMobileDia');
      },
      searchTrack(){
        if(this.dataArea.length!=0){
          this.$emit('searchTrack',{"start_time":this.dataArea[0],"end_time":this.dataArea[1],"vehicle_id":this.detailMobileInfo['id'],"flag":1});
        }
      }
    }
  }
</script>

<style scoped lang="scss">
  @import '~@/scss/dialog.scss';
  .popDialog{
    .show_empty{
      font-size:25px;
      padding-bottom:40px;
    }
    .dialog_con{
      .split_line{
        width:100%;
        height:1px;
        background:#EEE;
        margin-bottom:30px !important;
      }
      .info_icon{
        i{
          display:inline-block;
          width:69px;
          height:50px;
          background:url("../img/mobile_info.png") no-repeat center;
          background-size:100% 100%;
          margin-right:18px;
          vertical-align: middle;
        }
        div{
          font-size: 18px;
          color: #333333;
          font-family: 'pingfangMedium';
        }
        p{
          font-size: 14px;
          color: #666666;
          letter-spacing: 0.88px;
        }
      }
      .show_btn{
        width:60px;
        height:20px;
        border: 1px solid #017AFF;
        font-size: 12px;
        color: #017AFF;
        border-radius: 0;
        background:#fff;
        margin-left:10px;
      }
      .mobile_infoTime{
        .mobile_infoTitle{
          margin-right:10px;
          margin-bottom:3px !important;
        }
        .mobile_dataWrap{
          position:relative;
          .mobile_dataNext{
            position:absolute;
            right:21px;bottom:0;
            width:32px;
            height:32px;
            background: url("../img/next.png") no-repeat center;
            background-size:100% 100%;
            cursor: pointer;
          }
        }
        .el-date-editor{
          width:305px;
          height:32px;
          line-height: 32px;
        }
      }
    }
  }
  .popDialog /deep/ .mobile_infoTime{
    .el-date-editor{
      padding-left:10px;
      padding-right:0;
      input,span{
        font-size:12px !important;
      }
      .el-range-input{
        width:100%;
      }
      .el-range-separator{
        width:11%;
        line-height: 25px;
        padding:0;
      }
      .el-range__icon{
        line-height: 25px;
      }
      .el-range__close-icon{
        display:none;
        line-height: 25px;
        width:0;
      }
    }
  }
</style>
