<template>
  <div class="myMapWrap">
    <div id="myMap"></div>
    <!--顶部-->
    <div class="map_top flex flex_center">
      <span>衢州市非机动车"芯车牌"管理系统</span>
      <!--搜索框-->
      <div class="map_searchWrap">搜索</div>
    </div>
    <!--左边模块警告信息-->
    <div class="map_alarmWrap">
      <!--告警-->
      <div class="map_alarm">
        <div class="map_alarmLine">
          <div class="map_alarmsWrap" :class="{animation_alarms:showAnimation}">
            <div class="map_alarms" v-for="(item,key) in alarmData" :key="item.id">
              <!--左边信息-->
              <div class="alarm_info alarm_left" v-if="key%2==0">
                <div class="left alarm_time"><span>{{item.time}}</span><i></i></div>
                <div class="right alarm_con">
                  <i></i>
                  <div>车牌号:{{item.mobileId}}</div>
                  <div>基站:{{item.mobileSite}}</div>
                  <div>{{item.alarmType}}</div>
                </div>
              </div>
              <!--右边信息-->
              <div class="alarm_info alarm_right" v-else>
                <div class="right alarm_time"><i></i><span>{{item.time}}</span></div>
                <div class="left alarm_con">
                  <i></i>
                  <div>车牌号:{{item.mobileId}}</div>
                  <div>基站:{{item.mobileSite}}</div>
                  <div>{{item.alarmType}}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
      <!--事故-->
      <div class="map_accident">

      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "test",
    data(){
      return{
        showAnimation:true,
        alarmData:[{
          id:0,
          time:'14:15:00',
          mobileId:'浙H20190606',
          mobileSite:'ZQ0067',
          alarmType:'超速:50%'
        },{
          id:1,
          time:'14:15:01',
          mobileId:'浙H20190607',
          mobileSite:'ZQ0067',
          alarmType:'超速:51%'
        },{
          id:2,
          time:'14:15:02',
          mobileId:'浙H20190606',
          mobileSite:'ZQ0067',
          alarmType:'超速:50%'
        },{
          id:3,
          time:'14:15:03',
          mobileId:'浙H20190607',
          mobileSite:'ZQ0067',
          alarmType:'超速:51%'
        }]
      }
    },
    mounted(){
      this.getMap();
      // this.setAnimation();
    },
    methods:{
      setAnimation(){
        let i = 2;
        let setInter,setTimeouts;
        setInter = setInterval(()=>{
          console.log(i);
          this.showAnimation = true;
          setTimeouts = setTimeout(()=>{
            this.alarmData.push({
              id:i++,
              time:'14:15:0'+i,
              mobileId:'浙H20190606',
              mobileSite:'ZQ0067',
              alarmType:'超速:50%'
            });
            this.showAnimation = false;
          },1000);
        },2000);
      },
      getMap(){
        var map = new AMap.Map('myMap', {
          resizeEnable: true, //是否监控地图容器尺寸变化
          zoom:15, //初始化地图层级
          center: [118.86631,28.97504] //初始化地图中心点
        });

        //***************************************** 热力图
        if (!isSupportCanvas()) {
          alert('热力图仅对支持canvas的浏览器适用,您所使用的浏览器不能使用热力图功能,请换个浏览器试试~')
        }
        var heatmap;
        map.plugin(["AMap.Heatmap"], function () {
          var points =[
            {"lng":118.860129,"lat":28.974408,"count":50},
            {"lng":118.858117,"lat":28.974156,"count":51},
            {"lng":118.859267,"lat":28.974156,"count":15},
            {"lng":118.860273,"lat":28.974282,"count":40},
            {"lng":118.855674,"lat":28.973903,"count":100}];
          //初始化heatmap对象
          heatmap = new AMap.Heatmap(map, {
            radius: 25, //给定半径
            opacity: [0, 0.8]
            /*,
            gradient:{
                0.5: 'blue',
                0.65: 'rgb(117,211,248)',
                0.7: 'rgb(0, 255, 0)',
                0.9: '#ffea00',
                1.0: 'red'
            }
             */
          });
          //设置数据集：该数据为北京部分“公园”数据
          heatmap.setDataSet({
            data: points,
            max: 100
          });
        });

        //判断浏览区是否支持canvas
        function isSupportCanvas() {
          var elem = document.createElement('canvas');
          return !!(elem.getContext && elem.getContext('2d'));
        }
        // ***********************************************************

        // 布点基站
        // 创建一个 Icon
        var startIcon = new AMap.Icon({
          // 图标尺寸
          size: new AMap.Size(100, 134),
          // 图标的取图地址
          image: 'http://lbsyun.baidu.com/jsdemo/img/fox.gif',
          // image:'https://webapi.amap.com/theme/v1.3/markers/n/mark_bs.png',
          // // 图标所用图片大小
          imageSize: new AMap.Size(135, 100),
          // // 图标取图偏移量
          imageOffset: new AMap.Pixel(-47, -13)
        });
        let maker1 = new AMap.Marker({
          position: new AMap.LngLat(118.867388,28.975262),   // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
          icon:startIcon,
          animation:'AMAP_ANIMATION_BOUNCE',
          offset: new AMap.Pixel(-13, -30),
          title: '衢州1'
        });
        let maker2 = new AMap.Marker({
          position: new AMap.LngLat(118.880323,28.970332),   // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
          title: '衢州2'
        });
        map.add([maker1,maker2]);

        // 轨迹
        let path_track = [
          [118.867388,28.975262],
          [118.880323,28.970332]
        ];

        var polyline_track = new AMap.Polyline({
          path: path_track,
          isOutline: true,
          outlineColor: '#ffeeff',
          borderWeight: 3,
          strokeColor: "#3366FF",
          strokeOpacity: 1,
          strokeWeight: 6,
          // 折线样式还支持 'dashed'
          strokeStyle: "solid",
          // strokeStyle是dashed时有效
          strokeDasharray: [10, 5],
          lineJoin: 'round',
          lineCap: 'round',
          zIndex: 50,
        });

        polyline_track.setMap(map);
        // 缩放地图到合适的视野级别
        // map.setFitView([ polyline_track ])
      }
    }
  }
</script>

<style scoped lang="scss">
  .myMapWrap{
    width:100%;
    height:100vh;
    position:relative;
    #myMap{
      width:100%;
      height:100vh;
    }
    /*顶部信息*/
    .map_top{
      position:absolute;
      top:0;left:0;
      width:100%;
      height:0.8rem;
      background:rgba(0,0,0,.1);
      span{
        font-size:0.24rem;
      }
      .map_searchWrap{
        position:absolute;
        top:50%;left:0.5rem;
        width:0.3rem;
        height:0.3rem;
        border:1px solid red;
        font-size:0.12rem;
        margin-top:-0.15rem;
      }
    }
    /*左边部分*/
    .map_alarmWrap{
      position:absolute;
      top:0.9rem;
      left:0;
      width:3rem;
      .map_alarm{
        width:100%;
        min-height:5rem;
        background:#eee;
        box-sizing: border-box;
        padding:0.1rem;
        border:1px solid red;
        position:relative;
        overflow: hidden;
        .map_alarmLine{
          position:absolute;
          top:0.2rem;
          bottom:0;
          width:0.01rem;
          background:red;
          left:50%;
          margin-left:-0.005rem;
          .map_alarmsWrap{
            position:absolute;
            height:100%;
            .map_alarms{
              height:2rem;
            }
          }
          .animation_alarms{
            top:0.5rem;
            transition:all 2s ;
          }
        }
        .alarm_info{
          position:absolute;
          width:0.11rem;
          height:0.11rem;
          background:url("../img/message_point.png") no-repeat center;
          background-size:100% 100%;
          left:50%;
          /*top:0.5rem;*/
          margin-left:-0.055rem;
          .alarm_time{
            position:absolute;
            display: flex;
            align-items: center;
            height:0.35rem;
            top:50%;
            margin-top:-0.17rem;
            span{
              font-size:0.12rem;
            }
            i{
              display: inline-block;
              width:0.41rem;
              height:0.3rem;
              background:url("../img/mobile_left.png") no-repeat center;
              background-size:100% 100%;
              vertical-align: middle;
            }
          }
          .alarm_con{
            position:absolute;
            width:1.2rem;
            height:0.7rem;
            text-align: left;
            border:1px solid red;
            top:50%;
            margin-top:-0.35rem;
            box-sizing: border-box;
            i{
              position:absolute;
              width:0.06rem;
              height:0.14rem;
              background:url("../img/arrow_right.png") no-repeat center;
              background-size:100% 100%;
              top:50%;
              margin-top:-0.07rem;
            }
            div{
              font-size:0.12rem;
            }
          }
        }
        .alarm_left{
          .left{
            right:0.2rem;
            i{
              background:url("../img/mobile_left.png") no-repeat center;
              background-size:100% 100%;
            }
          }
          .right{
            left:0.2rem;
            i{
              background:url("../img/arrow_right.png") no-repeat center;
              background-size:100% 100%;
              left:-0.06rem;
            }
          }
        }
        .alarm_right{
          margin-top:1rem;
          .left{
            right:0.2rem;
            i{
              background:url("../img/arrow_left.png") no-repeat center;
              background-size:100% 100%;
              right:-0.06rem;

            }
          }
          .right{
            left:0.2rem;
            i{
              background:url("../img/mobile_right.png") no-repeat center;
              background-size:100% 100%;
            }
          }
        }
      }
    }
  }

</style>
