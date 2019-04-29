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
            <div>统计列表</div><div class="active">车辆列表</div><div>告警列表</div><div>事故列表</div><div>基站列表</div>
          </div>
          <div class="search_wrap">
            <el-input class="searchInput" v-model="searchInputVal" placeholder="请输入车牌号/告警ID/车架号"
                      @keyup.enter.native="searchInput">
              <i slot="suffix" class="el-input__icon el-icon-search" @click="searchInput"></i>
            </el-input>
          </div>
          <div class="infoList_table">
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
              <el-table-column label="轨迹/违章" align="center">
                 <template slot-scope="scope">
                   <i class="infoList_track"></i><i class="infoList_warn"></i>
                 </template>
              </el-table-column>
            </el-table>
            <!-- 分页栏 -->
            <div class="page_bar">
              <el-pagination class="paginationBar" :current-page="currentPage" background layout="total,prev,pager,next" @current-change="handlePageNum" :total="infoListAllData.length" :page-size="limitNum"></el-pagination>
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
      props:['infoListAllData'],
      data(){
        return{
          limitNum:10,
          currentPage:1,
          totalPage:1,
          dialogVisible:true,
          searchInputVal:'',
          // infoListData:this.infoListAllData
          // infoListData:[{
          //   id:'ZH19415001ND',
          //   licenseNum:'浙H19415',
          //   frameNum:'112334565354324321',
          //   type:'私人用车',
          //   owner:'赵三宝',
          //   phone:'18012346321'
          // },{
          //   id:'ZH19415001ND',
          //   licenseNum:'浙H19415',
          //   frameNum:'112334565354324321',
          //   type:'私人用车',
          //   owner:'赵三宝',
          //   phone:'18012346321'
          // },{
          //   id:'ZH19415001ND',
          //   licenseNum:'浙H19415',
          //   frameNum:'112334565354324321',
          //   type:'私人用车',
          //   owner:'赵三宝',
          //   phone:'18012346321'
          // },{
          //   id:'ZH19415001ND',
          //   licenseNum:'浙H19415',
          //   frameNum:'112334565354324321',
          //   type:'私人用车',
          //   owner:'赵三宝',
          //   phone:'18012346321'
          // }]
        }
      },
      methods:{
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
      height:80px;
      line-height:80px;
      border:none;
      box-shadow: 0 0 8px 0 rgba(0,0,0,0.20);
      .dialogTitle{
        font-size: 28px;
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
      height:calc(100vh - 80px);
      box-sizing: border-box;
      padding:0;
      .search_wrap{
        width:380px;
        height:40px;
        margin-top:60px;
        margin-bottom:45px;
        padding-left:69px;
        .el-input {
          /*width: 3rem;*/
          /*height: 0.5rem;*/
          width:100%;
          height:40px;
          .el-input__inner {
            height:40px;
            font-size:18px;
            padding: 0 55px 0 10px;
            color: #666;
            box-shadow: inset 0 1px 3px 0 rgba(0,0,0,0.50);
            border-radius: 8px;
          }
          .el-icon-search:before {
            cursor: pointer;
            position: absolute;
            content: '';
            width: 30px;
            height: 30px;
            top: 50%;
            left: 50%;
            margin-top: -15px;
            margin-left: -30px;
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
      height:50px;
      line-height: 50px;
      font-size: 24px;
      color: #666666;
      font-family: 'pingfangMedium';
      div{
        width:260px;
        text-align: center;
        position:relative;
        &:after{
          position:absolute;
          right:-1px;
          content:'';
          width:2px;
          height:21px;
          background:#ccc;
          top:50%;
          margin-top:-10.5px;
        }
      }
      .active{
        background:#017AFF;
        color:#fff;
      }
    }
    .page_bar{
      text-align: center;
      margin-top:20px;
    }
  }
  .popDialog /deep/ .infoList_table{
    .el-table__header{
      thead th{
        div{
          font-size:20px;
          color:#666;
          font-family: 'pingfangMedium';
        }
      }
    }
    .el-table__body{
      tr td{
        div{
          font-size:16px;
          color:#333;
        }
      }
    }
    .infoList_track{
      display: inline-block;
      width:23px;
      height:24px;
      background:url("../img/track.png") no-repeat center;
      vertical-align: middle;
      margin-right:30px;
    }
    .infoList_warn{
      display: inline-block;
      width:24px;
      height:24px;
      background:url("../img/weizhang.png") no-repeat center;
      vertical-align: middle;
    }
  }
</style>
