<template>
  <div class="myMapWrap">
    <l-map
      ref="myMap"
      :zoom="zoom"
      :center="center"
      @update:zoom="zoomUpdated"
      @update:center="centerUpdated"
      @update:bounds="boundsUpdated"
    >
      <l-tile-layer :url="url"></l-tile-layer>
      <l-marker v-for="(item, key) in base_stations" :lat-lng="[item.latitude, item.longitude]" :key="item.id">
        <l-popup>{{item.desc}}</l-popup>
      </l-marker>
      <l-polyline
        :lat-lngs="polyline.latlngs"
        :color="polyline.color">
      </l-polyline>
    </l-map>
    <!--顶部-->
    <div class="map_top flex flex_center">
      <i class="logo"></i><span>衢州市非机动车"芯车牌"管理系统</span>
      <!--搜索框-->
      <div class="map_searchWrap" v-if="false"><i></i></div>
      <!--展开的搜索框-->
      <el-input class="searchInput" v-show="showTrack" v-model="searchInputVal" placeholder="请输入车牌号"
                @keyup.enter.native="searchEnterInput">
        <i slot="suffix" class="el-input__icon el-icon-search" @click="searchEnterInput"></i>
      </el-input>
      <!--右边两按钮-->
      <div class="map_list" v-show="showTrack"></div>
      <div class="map_fullScreen" @click="launchFullScreen" v-show="showTrack" :class="{fullScreen:goFullScreen==0,quitFullScreen:goFullScreen==1}"></div>
    </div>
    <!--左边模块警告信息-->
    <!--左边模块收起图标-->
    <div class="map_leftShrikIcon" @click="openLeft" v-show="showTrack"><i></i></div>
    <!--左边模块展开部分-->
    <div class="map_alarmWrap" v-show="showTrack" :class="{fadeOutLeft:shrink_left,fadeInLeft:open_left}">
      <!--告警-->
      <div class="map_alarm map_alarmTop">
        <!--标题-->
        <div class="map_alarmTitle flex flex_center">
          <span>告警</span>
        </div>
        <!--时间-->
        <div class="map_alarmTime">
          <div>{{(alarmData.length === 0)?'':((new Date).toISOString().split('T')[0] + ' ' +
            alarmData[0].time)}}</div>
        </div>
        <div class="map_alarmLine">
          <div class="map_alarmLineWrap">
            <div class="map_alarmsWrap" :class="{animation_alarms:showAnimation}" :style="{transform: 'translateY(' + offset2 + 'rem)', background: 'red', transition: transition2?'all .2s':'none'}">
              <div class="map_alarms" v-for="(item,key) in alarmData" :key="item.id">
                <!--左边信息-->
                <div class="alarm_info alarm_left" :class="{showLeft:item.id%2==1}">
                  <div class="left alarm_time"><span>{{item.time}}</span><i></i></div>
                  <div class="right alarm_con" @click="openAlarmDialog(item,'1')">
                    <i></i>
                    <div>车牌号:{{item.plate_no}}</div>
                    <div>基站:QZRF{{('' + item.device_id).padStart(5, '0')}}</div>
                    <div class="text_overflow">类型:{{item.type}}</div>
                  </div>
                </div>
                <!--右边信息-->
                <div class="alarm_info alarm_right" :class="{showLeft:item.id%2==0}">
                  <div class="right alarm_time"><i></i><span>{{item.time}}</span></div>
                  <div class="left alarm_con" @click="openAlarmDialog(item,'1')">
                    <i></i>
                    <div>车牌号:{{item.plate_no}}</div>
                    <div>基站:QZRF{{(item.device_id + '').padStart(5, '0')}}</div>
                    <div class="text_overflow">类型:{{item.type}}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!--分割线-->
      <div class="map_splitLine"></div>
      <!--事故-->
      <div class="map_alarm map_accident">
        <!--标题-->
        <div class="map_alarmTitle flex flex_center">
          <span>事故</span>
        </div>
        <!--时间-->
        <div class="map_alarmTime">
          <div>{{(accident_data.length > 0) && ((new Date).toISOString().split('T')[0] + ' ' +
            accident_data[0].time)}}
          </div>
        </div>
        <div class="map_alarmLine">
          <div class="map_alarmLineWrap">

            <div class="map_alarmsWrap" :class="{animation_alarms:showAnimation}"
                 :style="{transform: 'translateY(' + offset1 + 'rem)', background: 'red', transition: transition1?'all .2s':'none'}">
              <div class="map_alarms" v-for="(item,key) in accident_data" :key="item.id">
                <!--左边信息-->

                <div class="alarm_info alarm_left" :class="{showLeft:item.id%2==1}">
                  <div class="left alarm_time"><span>{{item.time}}</span><i></i></div>
                  <div class="right alarm_con"  @click="openAlarmDialog(item,'2')">
                    <i></i>
                    <div>车牌号:{{item.plate_no}}</div>
                    <div>基站:{{item.device_id}}</div>
                    <div class="text_overflow">类型:{{item.type}}</div>
                  </div>
                </div>
                <!--右边信息-->
                <div class="alarm_info alarm_right" :class="{showLeft:item.id%2==0}">
                  <div class="right alarm_time"><i></i><span>{{item.time}}</span></div>
                  <div class="left alarm_con"  @click="openAlarmDialog(item,'2')">
                    <i></i>
                    <div>车牌号:{{item.plate_no}}</div>
                    <div>基站:{{item.device_id}}</div>
                    <div class="text_overflow">类型:{{item.type}}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!--收缩箭头栏-->
      <div class="map_shrikArrow" >
        <span @click="shrinkLeft"><i></i></span>
      </div>
      <!--告警详情按钮-->
      <div class="map_alarmListIcon">
      </div>
    </div>

    <!--右边模块统计部分-->
    <!--左边模块收起图标-->
    <div class="map_rightShrikIcon" v-show="showTrack" @click="openRight"><i></i></div>
    <!--右边模块展开部分-->
    <div class="map_statistics" v-show="showTrack" :class="{fadeOutRight:shrink_right,fadeInRight:open_right}">
      <!--统计数据按钮栏-->
      <div class="map_dataIcon">
        <span><i></i></span>
      </div>
      <!--收缩箭头栏-->
      <div class="map_shrikArrow" @click="shrinkRight">
        <span><i></i></span>
      </div>
      <!--数据部分-->
      <div class="map_dataWrap">
        <!--第一部分 车辆活跃总数-->
        <div class="map_datas">
          <div class="map_dataTitle">车辆活跃总数</div>
          <div class="flex flex_between map_dataCon">
            <div class="flex flex_align">
              <div id="map_activeNum" style="width:1.7rem;height:1.3rem;"></div>
              <div class="map_dataDetail">
                <div>上牌车辆总数: <span>740915</span></div>
                <div>今日活动总数: <span>335788</span></div>
                <div>外卖车辆总数: <span>10859</span></div>
                <div>违标车辆总数: <span>13088</span></div>
              </div>
            </div>
            <div class="map_rightTitle flex flex_center">
              <span>车辆统计</span>
            </div>
          </div>
        </div>
        <!--第二部分 告警总数-->
        <div class="map_datas">
          <div class="map_dataTitle">告警总数</div>
          <div class="flex flex_between map_dataCon">
            <div class="flex flex_align">
              <div id="map_alarmTotal" style="width:1.7rem;height:1.3rem;"></div>
              <div class="map_dataDetail">
                <div>超速告警总数: <span>149735</span></div>
                <div>逆行告警总数: <span>145788</span></div>
                <div>布控告警总数: <span>859</span></div>
                <div>事故告警总数: <span>3088</span></div>
              </div>
            </div>
            <div class="map_rightTitle flex flex_center">
              <span>告警统计</span>
            </div>
          </div>
        </div>
        <!--第三部分 事故统计-->
        <div class="map_datas">
          <div class="map_dataTitle">事故死亡率</div>
          <div class="flex flex_between map_dataCon">
            <div class="flex flex_align">
              <div id="map_accidentTotal" style="width:1.7rem;height:1.3rem;"></div>
              <div class="map_dataDetail">
                <div>事故报警总数: <span>190415</span></div>
                <div>自动处警总数: <span>551</span></div>
                <div>死亡事故总数: <span>32</span></div>
                <div>伤人事故总数: <span>325</span></div>
                <div>简易事故总数: <span>1089</span></div>
              </div>
            </div>
            <div class="map_rightTitle flex flex_center">
              <span>事故统计</span>
            </div>
          </div>
        </div>
        <!--第四部分 基站总数-->
        <div class="map_datas">
          <div class="map_dataTitle">基站总数</div>
          <div class="flex flex_between map_dataCon">
            <div class="flex flex_align">
              <div id="map_siteTotal" style="width:1.7rem;height:1.3rem;"></div>
              <div class="map_dataDetail">
                <div>衢江区基站总数: <span>503</span></div>
                <div>柯城区基站总数: <span>632</span></div>
                <div>龙游县基站总数: <span>260</span></div>
                <div>常山县基站总数: <span>255</span></div>
                <div>江山市基站总数: <span>310</span></div>
                <div>开化县基站总数: <span>222</span></div>
              </div>
            </div>
            <div class="map_rightTitle flex flex_center">
              <span>基站统计</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!--告警详情弹窗-->
    <alarmDialog v-if="showAlarmDialog" @closeDia="hiddenDialog" @toshowTrack="toShowTrack" :detailAlarm="detailAlarm" :detailType="detailType"></alarmDialog>
    <!--车辆信息弹窗-->
    <mobileInfo v-if="showMobileDialog" :selectTimeArea="selectTimeArea" @closeMobileDia="hiddenMobileDialog" :detailMobileInfo="detailMobileInfo" @searchTrack="toSearchTrack"></mobileInfo>

     <!--关闭轨迹大按钮  右上角-->
     <div class="track_closeBtn" v-show="!showTrack" @click="closeTrack"></div>
     <!--查询信息查询轨迹后缩放成icon-->
     <div class="track_infoIcon" v-show="!showTrack" @click="showInfoDialog"></div>

    <!--天气日期时间等-->
    <div class="map_weather flex flex_align flex_between">
      <span><span class="map_weatherStatus">{{showWeather.weather}}</span><span>{{showWeather.temperature}}℃</span></span>
      <span>{{Dates.year}}年{{Dates.month}}月{{Dates.date}}日{{Dates.hour}}:{{Dates.minute}}</span>
    </div>
  </div>
</template>

<script>
  import alarmDialog from '../components/alarmDialog'
  import mobileInfo from '../components/mobileInfo'
  import {getBaseStation, getTrack, getTrafficFlow,searchInfo,getTrackByTime} from "../api/remConfig";
  import {gen_mock_event} from '../data/accident-data'
  import {gen_mock_alert, gen_alert_desc} from '../data/alarm-data'
  import heatMap from '../components/heatmap'
  import L from 'leaflet'

  heatMap(L)
  export default {
    name: "test",
    components:{
      alarmDialog,mobileInfo
    },
    data() {
      return {
        url: 'http://127.0.0.1:4040/map/{z}/{x}/{y}.png',
        center: [28.966173, 118.84945],
        zoom: 15,
        bounds: null,
        polyline: {
          latlngs: [[28.966173, 118.84945], [28.986173, 118.84945], [28.966173, 118.94945], [28.968173, 118.84445]],
          color: 'green'
        },
        latlngs: [[28.966173, 118.84945, 0.7], [28.966173, 118.84945, 0.5]],
        heatPoints: [
          [28.966173, 118.84945, 100], // lat, lng, intensity
          [28.976173, 118.94945, 20],
        ],
        goFullScreen:0,
        showWeather:{'temperature':'22','weather':'阴'},//天气情况
        Dates:{
          year:'',
          month:'',
          date:'',
          hour:'',
          minute:''
        },//日期
        timeInterval:null,// 时间定时器
        infoWindow:'',//地图上的信息窗体
        selectTimeArea:'', //所有车辆查询时间段
        hasShowTrack:false,//是否已经显示轨迹
        detailAlarm:'',//具体事故详情
        detailMobileInfo:'',// 搜索车辆信息详情
        detailType:'',
        showTrack:true,//显示轨迹的页面，其他模块按钮都隐藏
        selectDialog:0,//看是打开告警窗口还是信息查询窗口 默认0是告警窗口
        map:null,
        vehicle_track: null,
        offset1: -5.7,
        offset2: -5.7,
        transition2: true,
        transition1: true,
        heat_map_points: [],
        base_station_markers: [],
        base_stations: [],
        showAnimation: false, //滚动动画
        alarmInterval: null, //滚动定时器
        alarmTimeout: null,
        left_show: true, //车辆左右两边布局显示
        map_activeNum: '',//车辆活跃总数折线图
        map_alarmTotal: '',//告警总数饼图
        map_accidentTotal: '',//事故死亡率折线图
        map_siteTotal: '',//基站总数 环形图
        shrink_left: false,//左边展开状态
        open_left: false,
        shrink_right: false,//右边展开状态
        open_right: false,
        showAlarmDialog: false,//告警详情对话框
        showMobileDialog: false,//车辆信息对话框
        searchInputVal: '',//搜索
        alarmData: [],
        accident_data: []
      }
    },
    mounted() {
      const me = this;
      this.map = this.$refs.myMap.mapObject;
      this.heatMap = L.heatLayer(this.heatPoints, {radius: 10}).addTo(this.map);
      this.getTime(); //得到时间
      // this.getMap(); //创建地图
      // this.setAnimation();
      this.map_activeNum = this.$echarts.init(document.getElementById('map_activeNum'));
      this.getMapActiveNum();//车辆活跃总数 折线图

      this.map_alarmTotal = this.$echarts.init(document.getElementById('map_alarmTotal'));
      this.getMapAlarmTotal(); // 告警总数 饼图

      this.map_accidentTotal = this.$echarts.init(document.getElementById('map_accidentTotal'));
      this.getAccidentTotal(); // 事故死亡率 折线图

      this.map_siteTotal = this.$echarts.init(document.getElementById('map_siteTotal'));
      this.getSiteTotal(); // 基站总数 环形图

      getBaseStation().then(function (r) {
        //得到基站值
        me.base_stations = r.data.data
      });

      getTrafficFlow({flag: 2}).then(r => {
        //热力图
        // console.log(r.data.result)
        this.heat_map_points = [];
        r.data.result.forEach(e => {
          for (let i = 0; i < this.base_stations.length; i++) {
            if (this.base_stations[i].id == e[0]) {
              this.heat_map_points.push([
                this.base_stations[i].longitude,
                this.base_stations[i].latitude,
                e[1]
              ])
            }
          }
        })
        this.heatMap.setLatLngs(this.heat_map_points)
      })
      // this.showVehicleTrack(1);

      // 事故滚动列表
      var index = 0;
      const fn = () => {
        let e = gen_mock_event();
        e.id = index++;
        e.time = this.toTimeString(new Date);
        this.accident_data.unshift(e);
        this.offset1 += 0.8;
        if (this.accident_data.length > 1000) {
          this.accident_data = this.accident_data.slice(0, -990);
          this.offset1 -= (0.8 * 990);
          // this.transition1 = false
          // document.querySelector('.map_rightTitle').offsetHeight
          // // this.transition1 = true
          // setTimeout(() => this.transition1 = true, 0)
        }
        setTimeout(fn, Math.floor(2 + Math.random() * 4) * 1000)
      };
      fn();

      // 告警滚动列表
      var index2 = 0
      var host = location.host.split(':')[0] + ':8889'
      var ws = new WebSocket('ws://' + host);
      ws.onmessage = (e) => {
        let data = JSON.parse(e.data);
        data.id = index2++;
        data.type = '过车';
        data.location = this.base_stations.find(item => item.id === data.device_id).desc
        data.time = this.toTimeString(new Date);
        if (data.velocity && data.velocity > 7) {
          data.type = '超速';
        }
        this.alarmData.unshift(data)
        this.offset2 += 0.8
        if (this.alarmData.length > 1000) {
            this.alarmData = this.alarmData.slice(0, -990);
            this.offset2 -= (0.8 * 990);
            // this.transition2 = false
            // document.querySelector('.map_rightTitle').offsetHeight
            // this.transition2 = true
        }

      };
      // var index2 = 0;
      // const fn2 = () => {
      //   let e = gen_mock_alert();
      //   e.id = index2++;
      //   e.time = this.toTimeString(new Date);
      //   this.alarmData.unshift(e);
      //   this.offset2 += 0.8;
      //   if (this.alarmData.length > 15) {
      //     this.alarmData = this.alarmData.slice(0, -5);
      //     this.offset2 -= (0.8 * 5);
      //   }
      //   setTimeout(fn2, Math.floor(2 + Math.random() * 4) * 1000)
      // };
      // fn2();
    },
    destroyed(){
      clearInterval(this.timeInterval)
    },
    watch: {
      // base_stations: function (new_data, old_data) {
      //   var vm = this;
      //   this.map.remove(this.base_station_markers);
      //   this.base_station_markers = [];
      //   var startIcon = new AMap.Icon({
      //     // 图标尺寸
      //     size: new AMap.Size(45, 45),
      //     // 图标的取图地址
      //     image: '../../static/site.gif',
      //     // // 图标所用图片大小
      //     imageSize: new AMap.Size(45, 45),
      //     // // 图标取图偏移量
      //     // imageOffset: new AMap.Pixel(-5,8)
      //   });
      //   new_data.forEach(e => {
      //     let marker = new AMap.Marker({
      //       position: new AMap.LngLat(e.longitude, e.latitude),   // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9],
      //       // icon:startIcon,
      //       // offset: new AMap.Pixel(-20, -25),
      //       title: e.id
      //     });
      //     this.map.add(marker);
      //     this.base_station_markers.push(marker);
      //
      //     // 添加信息窗体
      //     AMap.event.addListener(marker, 'click', function () {
      //       let infoCon = '<div style="font-size:14px;font-family: pingfangMedium;color:#333333;">'+e.id+'</div><div style="font-size:14px;color:#666">'+e.desc+'</div>'
      //       vm.infoWindow.setContent(infoCon);
      //       vm.infoWindow.open(vm.map, marker.getPosition());
      //     });
      //   })
      // }
    },
    methods: {
      zoomUpdated(zoom) {
        this.zoom = zoom;
      },
      centerUpdated(center) {
        this.center = center;
      },
      boundsUpdated(bounds) {
        this.bounds = bounds;
      },
      getTime(){
        var self = this;
        // 得到天气
        AMap.plugin('AMap.Weather', function() {
          //创建天气查询实例
          var weather = new AMap.Weather();
          //执行实时天气信息查询
          weather.getLive('衢州市', function(err, data) {
            // console.log(data);
            self.showWeather = data;
          });
        });
        //得到时间
        this.timeInterval = setInterval(function(){
          self.getTime_realTime()
        },1000);
      },
      getTime_realTime(){
        var nowDate = new Date();
        this.Dates.year = nowDate.getFullYear();
        var now_Month = nowDate.getMonth()+1;
        this.Dates.month = now_Month<10 ? '0'+now_Month : now_Month;
        var now_Date = nowDate.getDate();
        this.Dates.date = now_Date<10? '0'+now_Date : now_Date;
        var now_hour = nowDate.getHours();
        this.Dates.hour = now_hour<10 ? '0' + now_hour : now_hour;
        var now_minute = nowDate.getMinutes();
        this.Dates.minute = now_minute < 10 ? '0' + now_minute : now_minute;
      },
      showInfoDialog() {
        //重新打开告警信息等窗口
        if (this.selectDialog == 0) {
          this.showTrack = true;
          this.showAlarmDialog = true;
        } else {
          this.showTrack = true;
          this.showMobileDialog = true;
        }
      },
      toShowTrack(data) {
        //显示轨迹   告警窗口过来的  需要字段vehicle_id，flat:1
        this.showTrack = false;
        this.showAlarmDialog = false;
        this.selectDialog = 0;
        if(!this.hasShowTrack){
          // this.setAlarmTrack();
          getTrackByTime(data).then(refs=>{
            console.log(refs);
            // if(refs.data.result.length>0){
            //   this.vehicle_track.setPath(['','']);
            //   this.hasShowTrack = true;
            //   this.vehicle_track.setPath(refs.data.result.map(e => [e.longitude, e.latitude]));
            // }
            this.polyline.latlngs = refs.data.result.map(e => [e.longitude, e.latitude])
          }).catch(err=>{
            console.log(err);
          })
        }else{
          return false;
        }
      },
      setAlarmTrack(){
        this.hasShowTrack = true;
        this.vehicle_track.setPath(this.get_random_point());
      },
      get_random_point() {
        let len = this.base_stations.length;
        let points = [];
        for (let i=0;i<len;i++) {
          let d = this.base_stations[Math.floor(Math.random() * len)];
          points.push([d.longitude, d.latitude])
        }
        return points;
      },
      toSearchTrack(data) {
        //显示轨迹   车辆所有信息窗口过来的  需要字段vehicle_id，flat:1,start_time,end_time
        this.showTrack = false;
        this.showMobileDialog = false;
        this.selectDialog = 1;
        this.selectTimeArea = data;
        getTrackByTime(data).then(refs=>{
          console.log(refs);
          if(refs.data.result.length>0){
            this.vehicle_track.setPath(['','']);
            this.vehicle_track.setPath(refs.data.result.map(e => [e.longitude, e.latitude]));
            // if(!this.hasShowTrack){
            //   this.hasShowTrack = true;
            //   this.vehicle_track.setPath(refs.data.result.map(e => [e.longitude, e.latitude]));
            // }else{
            //   return false;
            // }
          }
        }).catch(err=>{
          console.log(err);
        })
      },
      closeTrack(){
        //关闭轨迹
        this.selectTimeArea = '';
        this.searchInputVal = '';
        this.vehicle_track.setPath(['','']);
        this.showTrack = true;
        this.hasShowTrack = false;
      },
      hiddenDialog(){
        this.showAlarmDialog = false;
        this.vehicle_track.setPath(['','']);
        this.hasShowTrack = false;
      },
      hiddenMobileDialog(){
        this.selectTimeArea = '';
        this.searchInputVal = '';
        this.showMobileDialog = false;
        this.vehicle_track.setPath(['','']);
        this.hasShowTrack = false;
      },
      toTimeString(dt) {
        return dt.toTimeString().split(' ')[0]
      },
      openAlarmDialog(item,type){
        this.showAlarmDialog = true;
        this.detailAlarm = item;
        this.detailType = type;
      },
      searchEnterInput(){
        if(this.searchInputVal){
          searchInfo({"key_word":this.searchInputVal}).then(refs=>{
            // refs.data.profile
            this.showMobileDialog = true;
            this.detailMobileInfo = refs.data.profile;
          }).catch(err=>{
          });
        }
      },
      fullScreenChange(){
        var isFullscreen = document.fullscreenEnabled ||
          window.fullScreen ||
          document.webkitIsFullScreen ||
          document.msFullscreenEnabled;
        if(!isFullscreen){
          this.goFullScreen = 0;
        }
      },
      launchFullScreen(){
        if(this.goFullScreen == 0){
          this.goFullScreen = 1;
          var element = document.documentElement;
          if(element.requestFullscreen) {
            element.requestFullscreen();
          } else if(element.mozRequestFullScreen) {
            element.mozRequestFullScreen();
          } else if(element.webkitRequestFullscreen) {
            element.webkitRequestFullscreen();
          } else if(element.msRequestFullscreen) {
            element.msRequestFullscreen();
          }
        }else{
          this.goFullScreen = 0;
          if(document.exitFullscreen){
            document.exitFullscreen();
          } else if(document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
          } else if(document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
          }else if(document.msExitFullscreen){
            document.msExiFullscreen();
          }
        }
        document.addEventListener('fullscreenchange',this.fullScreenChange);
        document.addEventListener('webkitfullscreenchange',this.fullScreenChange);
        document.addEventListener('mozfullscreenchange',this.fullScreenChange);
        document.addEventListener('MSFullscreenChange',this.fullScreenChange);
      },
      openLeft() {
        //点击左边按钮展开
        this.shrink_left = false;
        this.open_left = true;
      },
      shrinkLeft() {
        //左边底部按钮点击收起模块
        this.open_left = false;
        this.shrink_left = true;
      },
      openRight() {
        //点击左边按钮展开
        this.shrink_right = false;
        this.open_right = true;
      },
      shrinkRight() {
        //右边底部按钮点击收起模块
        this.open_right = false;
        this.shrink_right = true;
      },
      setAnimation() {
        let i = 4;
        this.alarmInterval = setInterval(() => {
          // console.log(i);
          this.alarmData.unshift({
            id: i++,
            time: '14:15:0' + i,
            mobileId: '浙H20190606',
            mobileSite: 'ZQ0067',
            alarmType: '超速:50%'
          });
          // this.alarmData.pop();
          this.showAnimation = false;
          this.alarmTimeout = setTimeout(() => {
            this.showAnimation = true;
          }, 1000);
        }, 2000);
      },
      getMap() {
        // var map = new AMap.Map('myMap', {
        //   resizeEnable: true, //是否监控地图容器尺寸变化
        //   zoom: 15, //初始化地图层级
        //   center: [118.84945,28.966173] //初始化地图中心点
        // });

        // 信息窗体
        // this.infoWindow  = new AMap.InfoWindow({
        //   // isCustom: true,  //使用自定义窗体
        //   content: '',
        //   offset: new AMap.Pixel(1, -35)
        // });


        //***************************************** 热力图
        if (!isSupportCanvas()) {
          alert('热力图仅对支持canvas的浏览器适用,您所使用的浏览器不能使用热力图功能,请换个浏览器试试~')
        }
        var me = this;
        var heatmap;
        // map.plugin(["AMap.Heatmap"], function () {
        //   var points = [
        //     {"lng": 118.860129, "lat": 28.974408, "count": 50},
        //     {"lng": 118.858117, "lat": 28.974156, "count": 51},
        //     {"lng": 118.859267, "lat": 28.974156, "count": 15},
        //     {"lng": 118.860273, "lat": 28.974282, "count": 40},
        //     {"lng": 118.855674, "lat": 28.973903, "count": 100}];
        //   //初始化heatmap对象
        //   // heatmap = new AMap.Heatmap(map, {
        //   //   radius: 25, //给定半径
        //   //   opacity: [0, 0.8]
        //   //   /*,
        //   //   gradient:{
        //   //       0.5: 'blue',
        //   //       0.65: 'rgb(117,211,248)',
        //   //       0.7: 'rgb(0, 255, 0)',
        //   //       0.9: '#ffea00',
        //   //       1.0: 'red'
        //   //   }
        //   //    */
        //   // });
        //   // me.heatMap = heatmap
        //   //设置数据集：该数据为北京部分“公园”数据
        //   // heatmap.setDataSet({
        //   //   data: points,
        //   //   max: 100
        //   // });
        // });

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
          position: new AMap.LngLat(118.867388, 28.975262),   // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
          icon: startIcon,
          animation: 'AMAP_ANIMATION_BOUNCE',
          offset: new AMap.Pixel(-13, -30),
          title: '衢州1'
        });
        let maker2 = new AMap.Marker({
          position: new AMap.LngLat(118.880323, 28.970332),   // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
          title: '衢州2'
        });
        // map.add([maker1, maker2]);

        // 轨迹
        let path_track = [
          [118.867388, 28.975262],
          [118.880323, 28.970332]
        ];

        var polyline_track = new AMap.Polyline({
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
        this.vehicle_track = polyline_track;
        // 缩放地图到合适的视野级别
        // map.setFitView([ polyline_track ])
      },
      // 显示车辆 track
      showVehicleTrack(id) {
        getTrack({flag: 1, vehicle_id: id}).then(r => {
          console.log(r.data.result)
          this.vehicle_track.setPath(r.data.result.map(e => [e.longitude, e.latitude]))
        })
      },
      // 隐藏 track
      hideVehicleTrack() {
        this.vehicle_track.hide()
      },
      getMapActiveNum() {
        //车辆活跃总数
        var vm = this;
        let options = {
          grid: {
            left: '0.1%',
            right: '6%',
            bottom: '0.3%',
            top: '10%',
            containLabel: true
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            // "axisLabel":{
            //   interval: 0
            // },
            data: ['上午', '中午','下午','晚上']
          },
          yAxis: {
            type: 'value'
          },
          series: [{
            data: [82000, 120000,250300,335900],
            type: 'line',
            areaStyle: {}
          }]
        };
        this.map_activeNum.setOption(options);
        this.drawChart(this.map_activeNum);
      },
      getMapAlarmTotal() {
        // 告警总数 饼图
        var vm = this;
        let options = {
          backgroundColor: '#fff',
          // tooltip : {
          //   trigger: 'item',
          //   formatter: "{a} <br/>{b} : {c} ({d}%)"
          // },
          visualMap: {
            show: false,
            min: 80,
            max: 600,
            inRange: {
              colorLightness: [0, 1]
            }
          },
          series: [
            {
              name: '告警总数',
              type: 'pie',
              // hoverAnimation: false,
              radius: '95%',
              center: ['50%', '52%'],
              data: [
                {value: 335, name: '超速'},
                {value: 310, name: '逆行'},
                {value: 234, name: '布控'},
                {value: 275, name: '事故'}
              ].sort(function (a, b) {
                return a.value - b.value;
              }),
              roseType: 'radius',
              label: {
                normal: {
                  position: 'inner',
                  textStyle: {
                    color: '#fff'
                  }
                }
              },
              labelLine: {
                normal: {
                  show: false
                  // lineStyle: {
                  //   color: '#666'
                  // },
                  // smooth: 0.2,
                  // length: 10,
                  // length2: 20
                }
              },
              itemStyle: {
                normal: {
                  color: '#017AFF',
                  shadowBlur: 200,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              },
              animationType: 'scale',
              animationEasing: 'elasticOut',
              animationDelay: function (idx) {
                return Math.random() * 200;
              }
            }
          ]
        };
        this.map_alarmTotal.setOption(options);
        this.drawChart(this.map_alarmTotal);
      },
      getAccidentTotal() {
        var vm = this;
        let options = {
          grid: {
            left: '0.1%',
            right: '0%',
            bottom: '0.3%',
            top: '10%',
            containLabel: true
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: ['1-3','3-5','5-7']
          },
          yAxis: {
            type: 'value'
          },
          series: [{
            data: [42,38,32],
            type: 'line',
            smooth: true
          }]
        };
        this.map_accidentTotal.setOption(options);
        this.drawChart(this.map_accidentTotal);
      },
      getSiteTotal() {
        //基站总数 环形图
        var vm = this;
        let options = {
          // tooltip: {
          //   trigger: 'item',
          //   formatter: "{a} <br/>{b}: {c} ({d}%)"
          // },
          series: [
            {
              name: '访问来源',
              type: 'pie',
              radius: ['50%', '90%'],
              avoidLabelOverlap: false,
              hoverAnimation: false,
              label: {
                normal: {
                  position: 'inner',
                  formatter: function (param) {
                    if (!param.percent) return ''
                    var f = Math.round(param.percent * 10) / 10;
                    var s = f.toString();
                    var rs = s.indexOf('.');
                    if (rs < 0) {
                      rs = s.length;
                      s += '.';
                    }
                    while (s.length <= rs + 1) {
                      s += '0';
                    }
                    return s + '%';
                  }
                },
                emphasis: {
                  show: true,
                  textStyle: {
                    fontSize: '15',
                    fontWeight: 'bold'
                  }
                }
              },
              labelLine: {
                normal: {
                  show: false
                }
              },
              data: [
                {value: 503, name: '衢江区'},
                {value: 632, name: '柯城区'},
                {value: 260, name: '龙游'},
                {value: 255, name: '常山'},
                {value: 310, name: '江山'},
                {value: 222, name: '开化'}
              ]
            }
          ]
        };
        this.map_siteTotal.setOption(options);
        this.drawChart(this.map_siteTotal);
      },
      drawChart(myChart) {
        window.addEventListener('resize', function () {
          myChart.resize();
        })
      }
    }
  }
</script>

<style scoped lang="scss">
  .myMapWrap{
    width:100%;
    height:100vh;
    overflow: hidden;
    position:relative;
    #myMap{
      width:100%;
      height:100vh;
    }
    /*顶部信息*/
    .map_top {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 0.8rem;
      .searchInput {
        z-index: 9999;
      }
      /*background:rgba(0,0,0,.1);*/
       background:linear-gradient(rgba(216,216,216,1), rgba(255,255,255,0));
      .logo{
        display: inline-block;
        width: 0.528rem;
        height: 0.6rem;
        background: url("../img/jinghui.png") no-repeat center;
        background-size: 100% 100%;
      }

      span {
        font-size: 0.28rem;
        font-family: 'pingfangBold';
        margin-left: 0.18rem;
      }

      .map_searchWrap {
        position: absolute;
        top: 50%;
        left: 0.2rem;
        width: 0.5rem;
        height: 0.5rem;
        margin-top: -0.25rem;
        background: #FFFFFF;
        box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.50);
        border-radius: 0.1rem;
        cursor: pointer;

        i {
          position: absolute;
          width: 0.35rem;
          height: 0.35rem;
          background: url("../img/search.png") no-repeat center;
          background-size: 100% 100%;
          top: 50%;
          left: 50%;
          margin-top: -0.17rem;
          margin-left: -0.17rem;
        }
      }

      /*列表按钮*/
      .map_list {
        position: absolute;
        width: 0.34rem;
        height: 0.34rem;
        top: 50%;
        margin-top: -0.17rem;
        right: 1.12rem;
        background: url("../img/list.png") no-repeat center;
        background-size: 100% 100%;
        cursor: pointer;
      }

      /*全屏按钮*/
      .map_fullScreen {
        position: absolute;
        width: 0.38rem;
        height: 0.38rem;
        top: 50%;
        margin-top: -0.17rem;
        right: 0.26rem;
        cursor: pointer;
      }
      .fullScreen{
        background: url("../img/fullscreen.png") no-repeat center;
        background-size: 100% 100%;
      }
      .quitFullScreen{
        background:url('../img/quitFullscreen.png') no-repeat center;
        background-size:100% 100%;
      }
    }

    /*左边部分*/
    /*模块收起icon*/
    .map_leftShrikIcon {
      position: absolute;
      top: 0.9rem;
      left: 0.2rem;
      width: 0.5rem;
      height: 0.5rem;
      background: #FFFFFF;
      box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.50);
      border-radius: 0.1rem;
      cursor: pointer;

      i {
        position: absolute;
        width: 0.35rem;
        height: 0.36rem;
        background: url("../img/alarm_blue.png") no-repeat center;
        background-size: 100% 100%;
        top: 50%;
        left: 50%;
        margin-top: -0.18rem;
        margin-left: -0.17rem;
      }
    }

    /*模块展开部分*/
    .map_alarmWrap {
      position: absolute;
      top: 0.9rem;
      left: 0;
      z-index: 1000;
      width: 4.4rem;
      height: 9.14rem;
      box-sizing: border-box;
      background: #FCFCFC;
      box-shadow: 0 0.02rem 0.04rem 0 rgba(0, 0, 0, 0.50);
      border-radius: 0 0.2rem 0.2rem 0;
      /*告警*/
      .map_alarm {
        width: 100%;
        height: 4.57rem;
        box-sizing: border-box;
        position: relative;
        overflow: hidden;
        /*padding-top:0.2rem;*/
        /*background: #FCFCFC;*/
        .map_alarmLine {
          position: absolute;
          top: 0.39rem;
          bottom: 0;
          width: 0.01rem;
          background: #017AFF;
          left: 54%;

          .map_alarmLineWrap {
            height: 6.5rem;
            position: absolute;
            top: -0.45rem;
          }
        }

        .map_alarmsWrap {
          position: absolute;
          bottom: 0;
          width: 100%;
          transition: all .2s;
          .map_alarms {
            /*height:1.2rem;*/
            height: 0.8rem;
          }
        }

        .animation_alarms {
          margin-top: 0.8rem;
          transition: all 1s;
          /*animation: fadeDown 1s linear;*/
        }

        .alarm_info {
          position: absolute;
          width: 0.11rem;
          height: 0.11rem;
          background: url("../img/message_point.png") no-repeat center;
          background-size: 100% 100%;
          left: 50%;
          /*top:0.5rem;*/
          margin-left: -0.055rem;

          .alarm_time {
            position: absolute;
            display: flex;
            align-items: center;
            height: 0.35rem;
            top: 50%;
            margin-top: -0.17rem;

            span {
              font-size: 0.14rem;
              font-family: 'pingfangMedium';
              color: #333;
            }

            i {
              display: inline-block;
              width: 0.41rem;
              height: 0.3rem;
              background: url("../img/mobile_left.png") no-repeat center;
              background-size: 100% 100%;
              vertical-align: middle;
            }
          }

          .alarm_con {
            cursor: pointer;
            position: absolute;
            width: 1.7rem;
            height: 0.68rem;
            text-align: left;
            background: #FFFFFF;
            box-shadow: 0 0.01rem 0.04rem 0 rgba(0, 0, 0, 0.20);
            border-radius: 0.04rem;
            top: 50%;
            margin-top: -0.35rem;
            box-sizing: border-box;
            padding-top: 0.05rem;

            i {
              position: absolute;
              width: 0.06rem;
              height: 0.14rem;
              background: url("../img/arrow_right.png") no-repeat center;
              background-size: 100% 100%;
              top: 50%;
              margin-top: -0.07rem;
            }

            div {
              font-size: 0.14rem;
              color: #333;
              line-height: 0.2rem;
            }
          }
        }

        .alarm_left {
          .left {
            right: 0.2rem;

            i {
              background: url("../img/mobile_left.png") no-repeat center;
              background-size: 100% 100%;
              margin-left: 0.1rem;
            }
          }

          .right {
            left: 0.2rem;
            padding-left: 0.12rem;
            padding-right: 0.08rem;

            i {
              background: url("../img/arrow_right.png") no-repeat center;
              background-size: 100% 100%;
              left: -0.06rem;
            }
          }
        }

        .alarm_right {
          /*margin-top:1rem;*/
          .left {
            right: 0.2rem;
            padding-left: 0.08rem;
            padding-right: 0.08rem;

            i {
              background: url("../img/arrow_left.png") no-repeat center;
              background-size: 100% 100%;
              right: -0.06rem;
            }
          }

          .right {
            left: 0.2rem;

            i {
              background: url("../img/mobile_right.png") no-repeat center;
              background-size: 100% 100%;
              margin-right: 0.1rem;
            }
          }
        }

        /*时间*/
        .map_alarmTime {
          padding-top: 0.2rem;
          position: relative;
          background: #FCFCFC;
          z-index: 100;

          div {
            width: 2.95rem;
            height: 0.19rem;
            line-height: 0.19rem;
            background: #017AFF;
            border-radius: 0.95rem;
            margin: 0 auto;
            font-size: 0.14rem;
            color: #FFFFFF;
          }
        }

        /*标题*/
        .map_alarmTitle {
          position: absolute;
          background: #017AFF;
          border-radius: 0 0.1rem 0.1rem 0;
          left: 0;
          width: 0.38rem;
          height: 1rem;
          top: 50%;
          margin-top: -0.5rem;
          box-sizing: border-box;
          padding-right: 0.05rem;

          span {
            font-size: 0.18rem;
            color: #FFFFFF;
            letter-spacing: 0.035rem;
            font-family: 'pingfangMedium';
          }
        }
      }

      .map_alarmTop {
        .map_alarmTime {
          border-top-right-radius: 0.2rem;
        }
      }

      /*分割线*/
      .map_splitLine {
        width: 4.1rem;
        height: 0.01rem;
        background: #ccc;
        margin: 0 auto;
      }

      /*事故*/
      .map_accident {
        .map_alarmTitle {
          background: #EA6500;
        }

        .map_alarmLine {
          background: #CB0500;
        }

        .map_alarmTime {
          div {
            background: #EA6500;
          }
        }

        .alarm_info {
          background: url("../img/message_red.png") no-repeat center;
          background-size: 100% 100%;

          .alarm_time {
            i {
              background: url("../img/left_red.png") no-repeat center;
              background-size: 100% 100%;
            }
          }
        }

        .alarm_right {
          .right {
            i {
              background: url("../img/right_red.png") no-repeat center;
              background-size: 100% 100%;
            }
          }
        }
      }

      .map_shrikArrow {
        position: absolute;
        height: 0.25rem;
        bottom: -0.05rem;
        width: 100%;
        background: #FCFCFC;
        border-bottom-right-radius: 0.2rem;
        box-shadow: 0 0.04rem 0.04rem 0 rgba(0,0,0,0.30);
        span {
          position: absolute;
          width: 0.4rem;
          height: 0.2rem;
          bottom: 0.02rem;
          right: 0;
          cursor: pointer;
          i {
            position: absolute;
            width: 0.14rem;
            height: 0.14rem;
            background: url("../img/shrink_left.png") no-repeat center;
            background-size: 100% 100%;
            right: 0.07rem;
            bottom: 0.05rem;
          }
        }
      }

      /*告警详情列表按钮*/
      .map_alarmListIcon {
        position: absolute;
        z-index: 101;
        width: 0.27rem;
        height: 0.28rem;
        background: url("../img/alarm_gray.png") no-repeat center;
        background-size: 100% 100%;
        left: 0.2rem;
        top: 0.15rem;
      }
    }

    /*右边统计数据部分*/
    .map_rightShrikIcon {
      position: absolute;
      top: 0.9rem;
      right: 0.2rem;
      width: 0.5rem;
      height: 0.5rem;
      background: #FFFFFF;
      box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.50);
      border-radius: 0.1rem;
      cursor: pointer;

      i {
        position: absolute;
        width: 0.34rem;
        height: 0.34rem;
        background: url("../img/data_blue.png") no-repeat center;
        background-size: 100% 100%;
        top: 50%;
        left: 50%;
        margin-top: -0.17rem;
        margin-left: -0.17rem;
      }
    }

    .map_statistics {
      position: absolute;
      top: 0.9rem;
      right: 0;
      z-index: 1100;
      width: 4.1rem;
      height: 8.43rem;
      padding-left: 0.2rem;
      box-sizing: border-box;
      background: #FCFCFC;
      box-shadow: 0 0.02rem 0.04rem 0 rgba(0, 0, 0, 0.50);
      border-radius: 0.2rem 0 0 0.2rem;

      .map_dataIcon {
        height: 0.37rem;

        span {
          position: absolute;
          width: 0.5rem;
          height: 0.5rem;
          right: 0;
          top: 0;

          i {
            position: absolute;
            width: 0.28rem;
            height: 0.28rem;
            background: url("../img/data_icon.png") no-repeat center;
            background-size: 100% 100%;
            right: 0.07rem;
            bottom: 0.01rem;
          }
        }
      }

      .map_dataWrap {
        padding-top: 0.2rem;

        .map_datas {
          margin-bottom: 0.35rem;

          .map_dataTitle {
            text-align: left;
            font-size: 0.14rem;
            color: #666666;
            margin-bottom: 0.1rem;
          }

          .map_dataCon {
            .map_dataDetail {
              margin-left: 0.1rem;
              text-align: left;

              div {
                font-family: 'pingfangMedium';
                font-size: 0.14rem;
                color: #151515;
                line-height: 0.21rem;

                span {
                  font-family: 'pingfangRegular';
                  color: #666;
                }
              }
            }

            .map_rightTitle {
              width: 0.38rem;
              height: 1.3rem;
              background: #017AFF;
              border-radius: 0.1rem 0 0 0.1rem;
              box-sizing: border-box;
              padding-left: 0.08rem;

              span {
                font-family: 'pingfangMedium';
                font-size: 0.18rem;
                color: #FFFFFF;
                letter-spacing: 0.025rem;
              }
            }
          }
        }
      }

      /*收缩箭头*/
      .map_shrikArrow {
        position: absolute;
        width: 0.4rem;
        height: 0.3rem;
        bottom: 0.02rem;
        left: 0;
        cursor: pointer;
        i {
          position: absolute;
          width: 0.14rem;
          height: 0.14rem;
          background: url("../img/shrink_right.png") no-repeat center;
          background-size: 100% 100%;
          left: 0.1rem;
          bottom: 0.05rem;
        }
      }
    }

    /*关闭轨迹按钮*/
    .track_closeBtn{
      position:absolute;
      top:0.8rem;
      right:0.2rem;
      width:0.34rem;
      height:0.34rem;
      background:url("../img/bigClose.png") no-repeat center;
      background-size:100% 100%;
      cursor: pointer;
    }
    /*轨迹查询后缩放的icon*/
     .track_infoIcon{
       position:absolute;
       bottom:1rem;
       left:50%;
       margin-left:-0.25rem;
       width:0.5rem;
       height:0.5rem;
       background:url("../img/trackIcon.png") no-repeat center;
       background-size:100% 100%;
       cursor: pointer;
     }

    /*天气时间等栏位*/
    .map_weather{
      position:absolute;
      bottom:0.2rem;
      right:0.2rem;
      width:2.7rem;
      height:0.3rem;
      box-sizing: border-box;
      padding:0 0.25rem;
      background: rgba(255,255,255,0.80);
      box-shadow: inset 0 0.01rem 0.03rem 0 rgba(0,0,0,0.30);
      border-radius: 0.18rem;
      .map_weatherStatus{
        margin-right:0.1rem;
      }
      span{
        font-size:0.14rem;
        color:#333333;
      }
    }
  }

  /*展开的搜索框*/
  .myMapWrap /deep/ .map_top {
    .el-input {
      position: absolute;
      top: 50%;
      left: 0.2rem;
      width: 3rem;
      height: 0.5rem;
      margin-top: -0.2rem;

      .el-input__inner {
        height: 0.5rem;
        font-size: 0.18rem;
        padding: 0 0.55rem 0 0.3rem;
        color: #666;
      }
      .el-icon-search:before{
        cursor: pointer;
        position:absolute;
        content:'';
        width:0.33rem;
        height:0.33rem;
        top:50%;left:50%;
        margin-top:-0.165rem;margin-left:-0.35rem;
        background:url("../img/search.png") no-repeat center;
        background-size:100% 100%;
      }
    }
    .el-input__suffix{
      right:0.01rem;
    }
  }
  .showLeft{
    display: none;
  }

  @media only screen and (max-width: 1367px){
     .myMapWrap{
       .map_statistics{
         width:4.3rem;
       }
       .map_weather{
          width:3rem;
        }
     }
  }
</style>
