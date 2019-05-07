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
              <el-pagination class="paginationBar" :current-page="currentPage" background layout="total,prev,pager,next" @current-change="handlePageNum" :total="infoListAllData.length" :page-size="limitNum"></el-pagination>
            </div>
          </div>
          <div class="infoList_breakTable infoList_table" :class="{showSelectedItem:changeItems==1}">
              <div class="break_select">
                <span class="break_active">全部</span><span>逆行</span><span>超速</span><span>占用机动车道</span>
              </div>
              <el-table :data="breakData" style="width:100%">
                <el-table-column prop="type" label="违章类型" align="center"></el-table-column>
                <el-table-column prop="plate_no" label="违章车辆" align="center"></el-table-column>
                <el-table-column prop="address" label="违章地点" align="center"></el-table-column>
                <el-table-column prop="time" label="违章时间" align="center"></el-table-column>
                <el-table-column label="轨迹" align="center">
                  <template slot-scope="scope">
                    <i class="break_status" @click="showHistoryTrack(scope.row.id,scope.row.plate_no)"></i>
                  </template>
                </el-table-column>
              </el-table>
              <!-- 分页栏 -->
              <div class="page_bar">
                <el-pagination class="paginationBar" :current-page="breakcurrentPage" background layout="total,prev,pager,next" @current-change="handlePageNum" :total="breakData.length" :page-size="limitNum"></el-pagination>
              </div>
          </div>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
  import { getInfoList } from "../api/remConfig";
    export default {
      name: "infoList",
      props:['infoListAllData','infoListShow'],
      data(){
        return{
          changeItems:0,
          limitNum:10,
          currentPage:1,
          totalPage:1,
          breakcurrentPage:1,
          dialogVisible:true,
          searchInputVal:'',
          breakData:[{
            type:'逆行',
            plate_no: '浙H19415',
            address:'ZQ0168',
            time:'2019/04/15 14:50:36'
          },{
            type:'逆行',
            plate_no: '浙H19415',
            address:'ZQ0168',
            time:'2019/04/15 14:50:36'
          },{
            type:'逆行',
            plate_no: '浙H19415',
            address:'ZQ0168',
            time:'2019/04/15 14:50:36'
          }]
        }
      },
      watch:{
        infoListShow:function(val){
          if(val){
            this.changeItems = 0;
          }
        }
      },
      methods:{
        changeItem(type){
          this.changeItems = type;
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
            // this.infoListData = refs.data.result;
            this.$emit('changeData',refs.data.result);
          }).catch(err=>{
            console.log(err);
          })
        },
        handlePageNum(val){
          this.currentPage = val;
          // this.logData['page'] = val;
          // this.getLogs(this.logData);
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
        &:hover{
          background:#eee;
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
