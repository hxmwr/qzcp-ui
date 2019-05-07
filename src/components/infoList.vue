<template>
  <div class="popDialog">
    <div>
      <el-dialog
        :visible.sync="dialogVisible"
        :close-on-click-modal="false" :modal-append-to-body="false" :show-close="false">
        <div slot="title" class="dialogTitle">
          <i class="logo"></i><span>衢州市非机动车"芯车牌"管理系统</span>
        </div>
        <div class="close_btn" @click="closeDialog"><img src="../img/closeBtn.png" alt=""></div>
        <div>
          <div class="infoList_title flex">
            <div :class="{active:changeItems==0}" @click="changeItem(0)">车辆列表</div><div :class="{active:changeItems==1}" @click="changeItem(1)">违章列表</div>
          </div>
          <!--<div class="search_wrap">-->
            <!--<el-input class="searchInput" v-model="searchInputVal" placeholder="请输入车牌号/告警ID/车架号"-->
                      <!--@keyup.enter.native="searchInput">-->
              <!--<i slot="suffix" class="el-input__icon el-icon-search" @click="searchInput"></i>-->
            <!--</el-input>-->
          <!--</div>-->
          <div class="infoList_table" :class="{showSelectedItem:changeItems==0}">
            <el-table :data="infoListAllData" style="width:100%">
              <el-table-column prop="id" label="ID" align="center"></el-table-column>
              <el-table-column prop="plate_no" label="车牌号" align="center"></el-table-column>
              <el-table-column prop="frame_no" label="车架号" align="center"></el-table-column>
              <el-table-column  label="车辆类型" align="center">
                <template slot-scope="scope">
                  <span>{{scope.row.type==1?'私人':'外卖'}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="name" label="车主" align="center"></el-table-column>
              <el-table-column prop="mobile" label="联系方式" align="center"></el-table-column>
              <el-table-column label="轨迹" align="center">
                 <template slot-scope="scope">
                   <i class="infoList_track" @click="showHistoryTrack(scope.row.id,scope.row.plate_no)"></i>
                   <!--<i class="infoList_warn"></i>-->
                 </template>
              </el-table-column>
            </el-table>
            <!-- 分页栏 -->
            <div class="page_bar">
              <el-pagination class="paginationBar" :current-page="currentPage" background layout="total,prev,pager,next" @current-change="handlePageNum" :total="infoListTotal" :page-size="limitNum"></el-pagination>
            </div>
          </div>
          <div class="infoList_breakTable infoList_table" :class="{showSelectedItem:changeItems==1}">
              <div class="break_select">
                <!--<span :class="{break_active:break_actived==0}" @click="break_selByType(0)">全部</span>-->
                <span @click="break_selByType(2)" :class="{break_active:break_actived==2}">逆行</span><span @click="break_selByType(1)" :class="{break_active:break_actived==1}">超速</span><span @click="break_selByType(3)" :class="{break_active:break_actived==3}">占用机动车道</span>
              </div>
              <el-table :data="breakData" style="width:100%">
                <el-table-column label="违章类型" align="center">
                  <template slot-scope="scope">
                    <span>{{scope.row.type==1?'超速':(scope.row.type==2?'逆行':'占用机动车道')}}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="plate_no" label="违章车辆" align="center"></el-table-column>
                <el-table-column label="违章地点" align="center">
                  <template slot-scope="scope">
                    <span>{{locations[scope.row.device_id]}}</span>
                  </template>
                </el-table-column>
                <el-table-column label="违章时间" align="center">
                  <template slot-scope="scope">
                    <span>{{scope.row.recorded_at}}</span>
                  </template>
                </el-table-column>
                <el-table-column label="违章实况" align="center">
                  <template slot-scope="scope">
                      <el-popover ref="liveStatus" placement="left"  trigger="click" popper-class="popImgWrap">
                        <div class="img_wrap">
                          <img src="../img/example1.png" alt="">
                        </div>
                        <i class="break_status"  slot="reference"></i>
                      </el-popover>
                  </template>
                </el-table-column>
              </el-table>
              <!-- 分页栏 -->
              <div class="page_bar">
                <el-pagination class="paginationBar" :current-page="breakcurrentPage" background layout="total,prev,pager,next" @current-change="handlePageNum2" :total="illegal_events_total" :page-size="limitNum"></el-pagination>
              </div>

          </div>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
  import {getEllegalEvents, getInfoList} from "../api/remConfig";
    export default {
      name: "infoList",
      props:['infoListShow','jumpBreak'],
      data(){
        return{
          locations: ['','白云中大道与南海路交叉(A点)', '白云中大道鹿鸣公园(B点)', '白云小区(C点)', '颐高电子(D点)', '白云中大道与南海路交叉(E点)'],
          break_actived:2,
          changeItems:0,
          limitNum:10,
          event_type: 2,
          infoListTotal:0,
          illegal_events_total: 0,
          currentPage:1,
          totalPage:1,
          breakcurrentPage:1,
          infoListAllData: [],//车辆信息列表数据
          infolistParams:{},//车辆列表分页参数
          dialogVisible:true,
          searchInputVal:'',
          breakParams:{}, //违章列表的参数
          breakData:[]
        }
      },
      watch:{
        infoListShow:function(val){
          if(val){
            if(this.jumpBreak == '2'){
              this.changeItems = 1;
            }else{
              this.changeItems = 0;
            }
            this.currentPage = 1;
            this.breakcurrentPage = 1;
            this.infolistParams = {
              offset:0,
              limit:this.limitNum
            };
            this.getInfoLists(this.infolistParams);
            this.breakParams = {
              event_type: this.event_type,
              offset:0,
              limit: this.limitNum,
            };
            this.getBreakData(this.breakParams );
          }
        }
      },
      methods:{
        break_selByType(type){
          //违章列表类型选择
          this.break_actived = type;
          this.event_type = type;
          this.breakcurrentPage = 1;
          this.breakParams = {
            event_type: this.event_type,
            // offset: (val - 1) * this.limitNum,
            offset:0,
            limit: this.limitNum,
          };
          this.getBreakData(this.breakParams);
        },
        getBreakData(data){
          //违章列表数据
          getEllegalEvents(data).then(r => {
            if (r.data.result) {
              this.breakData = r.data.result.map(e => ({...e, type: this.event_type}));
              this.illegal_events_total = r.data.total;
            }
          }).catch(err=>{
            console.log(err);
          })
        },
        getInfoLists(data){
          //车辆列表
          getInfoList(data).then(refs => {
            this.infoListTotal = refs.data.total;
            this.infoListAllData = refs.data.result;
          }).catch(err => {
            console.log(err);
          })
        },
        changeItem(type){
          this.changeItems = type;
          // this.infolistParams['offset'] = 0;
          // this.breakParams['offset'] = 0;
          // this.currentPage = 1;
          // this.breakcurrentPage = 1;
        },
        showHistoryTrack(vehicleId,plate_no){
          this.$emit('historyTrack',{"vehicle_id":vehicleId,"flag":1,"plate_no":plate_no});
        },
        closeDialog(){
          this.searchInputVal = '';
          this.$emit('closeInfoList');
        },
        searchInput(){
          getInfoList({"search":this.searchInputVal}).then(refs=>{
            console.log('fff:',refs);
            this.infoListAllData = refs.data.result;
            // this.$emit('changeData',refs.data.result);
          }).catch(err=>{
            console.log(err);
          })
        },
        handlePageNum(val){
          this.currentPage = val;
          this.infolistParams = {
            offset:(val - 1) * this.limitNum,
            limit:this.limitNum
          };
          this.getInfoLists(this.infolistParams);
        },
        handlePageNum2(val) {
          console.log(val);
          this.breakcurrentPage = val;
          this.breakParams = {
            event_type: this.event_type,
            offset: (val - 1) * this.limitNum,
            limit: this.limitNum,
          };
          this.getBreakData(this.breakParams);
        }
      }
    }
</script>

<style scoped lang="scss">
  @import '~@/scss/dialog.scss';
  .popDialog /deep/ .el-dialog__wrapper{
    overflow: hidden;
  }
  .popDialog /deep/ .el-dialog{
    width:100%;
    margin-top:0 !important;
    border-radius: 0;
    background:#fff;
    .el-dialog__header{
      border-radius: 0;
      height:0.8rem;
      line-height:0.8rem;
      border:none;
      background:#fff;
      box-shadow: 0 0 8px 0 rgba(0,0,0,0.20);
      z-index: 100;
      position: relative;
      .dialogTitle{
        font-size:0.28rem;
        color: #333;
        i{
          display: inline-block;
          width: 0.528rem;
          height: 0.6rem;
          background: url("../img/jinghui.png") no-repeat center;
          background-size: 100% 100%;
          vertical-align: middle;
          margin-right:18px;
        }
      }
    }
    .el-dialog__body{
      height:calc(100vh - 0.8rem);
      box-sizing: border-box;
      padding:0;
      background:#fcfcfc;
      .search_wrap{
        width:3.8rem;
        height:0.4rem;
        margin-top:0.6rem;
        margin-bottom:0.45rem;
        padding-left:0.69rem;
        .el-input {
          /*width: 3rem;*/
          /*height: 0.5rem;*/
          width:100%;
          height:0.4rem;
          .el-input__inner {
            height:0.4rem;
            font-size:0.18rem;
            padding: 0 0.55rem 0 0.1rem;
            color: #666;
            box-shadow: inset 0 1px 3px 0 rgba(0,0,0,0.50);
            border-radius: 0.08rem;
          }
          .el-icon-search:before {
            cursor: pointer;
            position: absolute;
            content: '';
            width:0.3rem;
            height:0.3rem;
            top: 50%;
            left: 50%;
            margin-top: -0.15rem;
            margin-left: -0.3rem;
            background: url("../img/search.png") no-repeat center;
            background-size: 100% 100%;
          }
        }
        .el-input__suffix {
          right: 1px;
        }
      }
    }
  }

  .popDialog{
    .infoList_title{
      height:0.5rem;
      line-height:0.5rem;
      font-size:0.24rem;
      color: #666666;
      font-family: 'pingfangMedium';
      div{
        width:50%;
        text-align: center;
        position:relative;
        cursor: pointer;
      }
      .active{
        background:#017AFF;
        color:#fff;
      }
    }
    .page_bar{
      text-align: center;
      margin-top:0.2rem;
    }
  }
  .popDialog /deep/ .infoList_table{
    display: none;
    margin-top:1rem;
    .el-table__header{
      thead th{
        background:#fcfcfc;
        div{
          font-size:0.2rem;
          color:#666;
          font-family: 'pingfangMedium';
        }
      }
    }
    .el-table__body{
      tr td{
        background:#fcfcfc;
        div{
          font-size:0.16rem;
          color:#333;
        }
      }
    }
    .infoList_track{
      display: inline-block;
      width:0.23rem;
      height:0.24rem;
      background:url("../img/track.png") no-repeat center;
      vertical-align: middle;
      /*margin-right:0.3rem;*/
      cursor: pointer;
    }
    .infoList_warn{
      display: inline-block;
      width:0.24rem;
      height:0.24rem;
      background:url("../img/weizhang.png") no-repeat center;
      vertical-align: middle;
    }
  }
  .popDialog .infoList_breakTable{
    display: none;
    .break_select{
      padding-left:0.87rem;
      margin-top:0.5rem;
      margin-bottom:0.54rem;
      span{
        display: inline-block;
        width:1.6rem;
        height:0.4rem;
        line-height: 0.4rem;
        text-align: center;
        border: 1px solid #F0F0F0;
        border-right:0;
        font-size:0.18rem;
        font-family: 'pingfangMedium';
        color:#333;
        cursor: pointer;
        &:last-child{
          border-right:1px solid #F0F0F0;
        }
      }
      .break_active{
        background: #017AFF;
        color:#fff;
      }
    }
    .break_status{
      display:inline-block;
      width:0.28rem;
      height:0.2rem;
      background:url("../img/eye1.png") no-repeat;
      background-size:100% 100%;
      cursor: pointer;
    }
  }
  .popDialog .showSelectedItem{
    display: block;
  }
</style>
