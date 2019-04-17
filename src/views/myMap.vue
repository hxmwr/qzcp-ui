<template>
  <div class="myMapWrap">
    <div id="myMap"></div>
    <!--顶部-->
    <div class="map_top">
      <span>"芯车牌"管理系统</span>
    </div>
    <!--左边-->
    <!--<div class="map_left">-->
      <!--&lt;!&ndash;搜索框&ndash;&gt;-->
      <!--<div class="map_inputWrap">-->
        <!--<el-input placeholder="请输入内容">-->
          <!--<i class="el-icon-search el-input__icon"-->
             <!--slot="suffix">-->
          <!--</i>-->
        <!--</el-input>-->
      <!--</div>-->
      <!--&lt;!&ndash;滚动的告警信息&ndash;&gt;-->
      <!--<div class="map_alarmWrap">-->
        <!--&lt;!&ndash; 一块一块告警信息&ndash;&gt;-->
        <!--<div class="map_detailAlarm">-->
          <!--<div>车牌: <span>浙H123451</span></div>-->
          <!--<div>车主: <span>王某某</span></div>-->
          <!--<div>唯一ID: <span>xxx123xxx</span></div>-->
          <!--<div>告警内容: <span>超速行驶超速行驶</span></div>-->
        <!--</div>-->
        <!--<div class="map_detailAlarm">-->
          <!--<div>车牌: <span>浙H123452</span></div>-->
          <!--<div>车主: <span>王某某</span></div>-->
          <!--<div>唯一ID: <span>xxx123xxx</span></div>-->
          <!--<div>告警内容: <span>超速行驶超速行驶</span></div>-->
        <!--</div>-->
        <!--<div class="map_detailAlarm">-->
          <!--<div>车牌: <span>浙H123453</span></div>-->
          <!--<div>车主: <span>王某某</span></div>-->
          <!--<div>唯一ID: <span>xxx123xxx</span></div>-->
          <!--<div>告警内容: <span>超速行驶超速行驶</span></div>-->
        <!--</div>-->
        <!--<div class="map_detailAlarm">-->
          <!--<div>车牌: <span>浙H123454</span></div>-->
          <!--<div>车主: <span>王某某</span></div>-->
          <!--<div>唯一ID: <span>xxx123xxx</span></div>-->
          <!--<div>告警内容: <span>超速行驶超速行驶</span></div>-->
        <!--</div>-->
        <!--<div class="map_detailAlarm">-->
          <!--<div>车牌: <span>浙H123455</span></div>-->
          <!--<div>车主: <span>王某某</span></div>-->
          <!--<div>唯一ID: <span>xxx123xxx</span></div>-->
          <!--<div>告警内容: <span>超速行驶超速行驶</span></div>-->
        <!--</div>-->
        <!--<div class="map_detailAlarm">-->
          <!--<div>车牌: <span>浙H123456</span></div>-->
          <!--<div>车主: <span>王某某</span></div>-->
          <!--<div>唯一ID: <span>xxx123xxx</span></div>-->
          <!--<div>告警内容: <span>超速行驶超速行驶</span></div>-->
        <!--</div>-->
      <!--</div>-->
    <!--</div>-->
    <!--右边-->
    <div class="map_right">
      <!--第一块-->
      <div class="map_rightOne">
        系统信息：
        <div>系统名称：xxxx系统V1.0</div>
        <div>系统状态：</div>
        <div>时间：</div>
        <div>天气：</div>
      </div>
      <!--第二块-->
      <div class="map_rightTwo">
        统计信息：（流量图）
        <div>天线最大流量：</div>
        <div>车辆总量：已上牌车辆量，活跃车辆</div>
      </div>
      <!--第三块-->
      <div class="map_rightThree">
        待定
      </div>
    </div>
  </div>
</template>

<script>

  export default {
    data(){
      return{
        geoCoordMap:{
          "第一":[118.858548,28.973397],
          "第二":[118.860704,28.973777],
          "第三":[118.852799,28.974282],
          "第四":[118.858548,28.975672],
          "第五":[118.858548,28.975672],
        }
      }
    },
    mounted() {
      this.getMap();
    },
    methods:{
      convertData(data) {
        var res = [];
        for (var i = 0; i < data.length; i++) {
          var geoCoord = this.geoCoordMap[data[i].name];
          if (geoCoord) {
            res.push(geoCoord.concat(data[i].value));
          }
        }
        return res;
      },
      getMap(){
        let myChart = this.$echarts.init(document.getElementById('myMap'));
        let vm = this;
        this.$axios.get('../../static/data.json').then(data=>{
          console.log(data);
          var points = [].concat.apply([], data.data.map(function (track) {
            return track.map(function (seg) {
              return seg.coord.concat([1]);
            });
          }));
          myChart.setOption({
            bmap: {
              center: [118.871,28.97],
              zoom: 14,
              roam: true,
              // mapStyle: {
              //   'styleJson': [
              //     {
              //       'featureType': 'water',
              //       'elementType': 'all',
              //       'stylers': {
              //         'color': '#031628'
              //       }
              //     },
              //     {
              //       'featureType': 'land',
              //       'elementType': 'geometry',
              //       'stylers': {
              //         'color': '#000102'
              //       }
              //     },
              //     {
              //       'featureType': 'highway',
              //       'elementType': 'all',
              //       'stylers': {
              //         'visibility': 'off'
              //       }
              //     },
              //     {
              //       'featureType': 'arterial',
              //       'elementType': 'geometry.fill',
              //       'stylers': {
              //         'color': '#000000'
              //       }
              //     },
              //     {
              //       'featureType': 'arterial',
              //       'elementType': 'geometry.stroke',
              //       'stylers': {
              //         'color': '#0b3d51'
              //       }
              //     },
              //     {
              //       'featureType': 'local',
              //       'elementType': 'geometry',
              //       'stylers': {
              //         'color': '#000000'
              //       }
              //     },
              //     {
              //       'featureType': 'railway',
              //       'elementType': 'geometry.fill',
              //       'stylers': {
              //         'color': '#000000'
              //       }
              //     },
              //     {
              //       'featureType': 'railway',
              //       'elementType': 'geometry.stroke',
              //       'stylers': {
              //         'color': '#08304b'
              //       }
              //     },
              //     {
              //       'featureType': 'subway',
              //       'elementType': 'geometry',
              //       'stylers': {
              //         'lightness': -70
              //       }
              //     },
              //     {
              //       'featureType': 'building',
              //       'elementType': 'geometry.fill',
              //       'stylers': {
              //         'color': '#000000'
              //       }
              //     },
              //     {
              //       'featureType': 'all',
              //       'elementType': 'labels.text.fill',
              //       'stylers': {
              //         'color': '#857f7f'
              //       }
              //     },
              //     {
              //       'featureType': 'all',
              //       'elementType': 'labels.text.stroke',
              //       'stylers': {
              //         'color': '#000000'
              //       }
              //     },
              //     {
              //       'featureType': 'building',
              //       'elementType': 'geometry',
              //       'stylers': {
              //         'color': '#022338'
              //       }
              //     },
              //     {
              //       'featureType': 'green',
              //       'elementType': 'geometry',
              //       'stylers': {
              //         'color': '#062032'
              //       }
              //     },
              //     {
              //       'featureType': 'boundary',
              //       'elementType': 'all',
              //       'stylers': {
              //         'color': '#465b6c'
              //       }
              //     },
              //     {
              //       'featureType': 'manmade',
              //       'elementType': 'all',
              //       'stylers': {
              //         'color': '#022338'
              //       }
              //     },
              //     {
              //       'featureType': 'label',
              //       'elementType': 'all',
              //       'stylers': {
              //         'visibility': 'off'
              //       }
              //     }
              //   ]
              // }
            },
            visualMap: {
              show: false,
              top: 'top',
              min: 0,
              max: 5,
              seriesIndex: 0,
              calculable: true,
              inRange: {
                color: ['blue', 'blue', 'green', 'yellow', 'red']
              }
            },
            series: [
              //   {
              //   type: 'lines',
              //   coordinateSystem: 'bmap',
              //   polyline: true,
              //   data: busLines,
              //   silent: true,
              //   lineStyle: {
              //     normal: {
              //       // color: '#c23531',
              //       // color: 'rgb(200, 35, 45)',
              //       opacity: 0.2,
              //       width: 1
              //     }
              //   },
              //   progressiveThreshold: 500,
              //   progressive: 200
              // },
              //   {
              //   type: 'lines',
              //   coordinateSystem: 'bmap',
              //   polyline: true,
              //   data: busLines,
              //   lineStyle: {
              //     normal: {
              //       width: 0
              //     }
              //   },
              //   effect: {
              //     constantSpeed: 20,
              //     show: true,
              //     trailLength: 0.1,
              //     symbolSize: 1.5
              //   },
              //   zlevel: 1
              // }

              // {
              //   name: 'Top 5',
              //   type: 'effectScatter',
              //   coordinateSystem: 'bmap',
              //   data:[
              //     [118.867388,28.975262],
              //     {
              //       value: [118.880323,28.970332],
              //       label: {},
              //       itemStyle:{
              //         color:'#f00',
              //         shadowBlur: 10,
              //         shadowColor: '#333',
              //         symbolSize: 30,
              //       }
              //     },
              //     // [118.880323,28.970332],
              //     [118.894,28.94],
              //     [118.889,28.93]
              //   ],
              //   encode: {
              //     value: 2
              //   },
              //   symbolSize: 20,
              //   showEffectOn: 'render',
              //   rippleEffect: {
              //     brushType: 'stroke'
              //   },
              //   hoverAnimation: true,
              //   label: {
              //     normal: {
              //       formatter: '{b}',
              //       position: 'right',
              //       show: true
              //     }
              //   },
              //   itemStyle: {
              //     normal: {
              //       color: '#f4e925',
              //       shadowBlur: 10,
              //       shadowColor: '#333'
              //     }
              //   },
              //   zlevel: 2
              // },
              {
                type: 'heatmap',
                coordinateSystem: 'bmap',
                // data: points,
                data: vm.convertData([
                  {name: "第一", value: 9},
                  {name: "第二", value: 12},
                  {name: "第三", value: 12},
                  {name: "第四", value: 12},
                  {name: "第五", value: 50}]),
                pointSize: 10,
                blurSize: 6
              }
            ]
          });
          var bmap = myChart.getModel().getComponent('bmap').getBMap();
          bmap.addControl(new BMap.MapTypeControl());
        });
        // var bmap = myChart.getModel().getComponent('bmap').getBMap();
        // bmap.addControl(new BMap.MapTypeControl());
      }
    }
  }
</script>

<style scoped lang="scss">
  .myMapWrap{
    width:100%;
    height:100vh;
    position:relative;
  }
  #myMap{
    width:100%;
    height:100vh;
  }
  .map_top{
    position:absolute;
    top:0;left:0;
    width:100%;
    height:80px;
    line-height: 80px;
    background:rgba(0,0,0,.3);
    span{
      color:#fff;
      font-size:24px;
    }
  }
  .map_left{
    position:absolute;
    top:0;
    left:0;
    width:250px;
    height:100vh;
    overflow: hidden;
    background:rgba(0,0,0,.8);
    box-sizing: border-box;
    .map_inputWrap{
      border-bottom:1px solid #eee;
      padding-top:15px;
      position:relative;
      padding-bottom:20px;
      background:#fff;
      z-index: 100;
      .el-input{
        width:200px;
      }
    }
    .map_alarmWrap{
      margin-top:15px;
      animation:animation_top 20s linear infinite normal;
      .map_detailAlarm{
        width:200px;
        text-align: left;
        padding:10px;
        border:1px solid #efefef;
        margin:0 auto 10px;
        font-size:16px;
        color:#666;
      }
    }
  }
  .map_right{
    position: absolute;
    top:0;right:0;
    width:250px;
    height:100vh;
    background:#fff;
    .map_rightOne{
      height:25vh;
      /*text-align: left;*/
    }
    .map_rightTwo{
      height:25vh;
    }
  }
  @keyframes animation_top {
    0%{
      transform: translateY(0px);
      -webkit-transform: translateY(0px);
    }
    100%{
      transform: translateY(-500px);
      -webkit-transform: translateY(-500px);
    }
  }
</style>
