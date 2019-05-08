<template>
  <div class="myMapWrap">
    <l-map
      ref="myMap"
      :zoom="zoom"
      :maxZoom="17"
      :minZoom="13"
      :center="center"
      :zoomControl="undefined"
      @update:zoom="zoomUpdated"
      @update:center="centerUpdated"
      @update:bounds="boundsUpdated"
    >
      <l-tile-layer :url="url"></l-tile-layer>
      <l-marker ref="markerVehicle" v-if="polyline.latlngs.length > 0" :lat-lng="animMarkerLatlng" :icon="bycleIcon"
                :zIndexOffset="100">
        <l-popup>{{pointVelocity}}km/h</l-popup>
      </l-marker>
      <l-marker v-for="(item, key) in base_stations" :lat-lng="[item.latitude, item.longitude]"
                :icon="item.status?dufaultMarkIcon:customMarkIcon" :key="item.id">
        <l-popup>{{item.desc}}</l-popup>
        <l-popup>
          <div><span>编号:</span>{{item.id}}</div>
          <div><span>位置:</span>{{item.desc}}</div>
          <div><span>设备型号:</span>NRFQZ01</div>
          <div><span>当前状态:</span>{{item.status?'在线':'离线'}}</div>
          <div><span>上报次数:</span>{{getReportCountById(item.id)}}</div>
          <div><img style="width: 250px;margin-top: 10px;" :src="'../../static/point' + item.id + '.png'" alt=""></div>
        </l-popup>
      </l-marker>

      <l-polyline
        v-if="polyline.latlngs.length > 0"
        ref="polyline"
        :lat-lngs="polyline.latlngs"
        @snake="onSnake"
        :color="polyline.color">
        <!--<l-popup>-->
        <!--<div style="max-height: 600px; overflow-y: scroll">-->
        <!--<div v-for="(item,key) in speedArea" :key="key" style="width: 100%;">-->
        <!--<div>基站{{item.siteName1}}->基站{{item.siteName2}} | {{item.time.toLocaleString()}} | {{item.speed}}m/s</div>-->
        <!--</div>-->
        <!--</div>-->
        <!--</l-popup>-->
      </l-polyline>
      <l-polyline v-if="polyline.latlngs.length > 0" :lat-lngs="highlighted_segment" color="red">
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
      <div class="map_list" v-show="showTrack" @click="showInfoList"></div>
      <div class="map_fullScreen" @click="launchFullScreen" v-show="showTrack"
           :class="{fullScreen:goFullScreen==0,quitFullScreen:goFullScreen==1}"></div>
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
            alarmData[0].time)}}
          </div>
        </div>
        <!--<div class="map_alarmLine">-->
        <!--</div>-->
        <div class="map_alarmLineWrap">
          <!--<div class="map_alarmsWrap" >-->
          <div class="map_alarmsWrap" :class="{animation_start:showAnimation}"
               :style="{transform: 'translateY(' + offset2 + 'rem)', transition: transition1?'all .2s':'none'}">
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
        <!--<div class="map_alarmLine">-->
        <!--</div>-->
        <div class="map_alarmLineWrap">
          <div class="map_alarmsWrap" :class="{animation_alarms:showAnimation}"
               :style="{transform: 'translateY(' + offset1 + 'rem)', transition: transition1?'all .2s':'none'}">
            <div class="map_alarms" v-for="(item,key) in accident_data" :key="item.id">
              <!--左边信息-->

              <div class="alarm_info alarm_left" :class="{showLeft:item.id%2==1}">
                <div class="left alarm_time"><span>{{item.time}}</span><i></i></div>
                <div class="right alarm_con" @click="openAlarmDialog(item,'2')">
                  <i></i>
                  <div>车牌号:{{item.plate_no}}</div>
                  <div>基站:{{item.device_id}}</div>
                  <div class="text_overflow">类型:{{item.type}}</div>
                </div>
              </div>
              <!--右边信息-->
              <div class="alarm_info alarm_right" :class="{showLeft:item.id%2==0}">
                <div class="right alarm_time"><i></i><span>{{item.time}}</span></div>
                <div class="left alarm_con" @click="openAlarmDialog(item,'2')">
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
      <!--收缩箭头栏-->
      <div class="map_shrikArrow">
        <span @click="shrinkLeft"><i></i></span>
      </div>
      <!--告警详情按钮-->
      <div class="map_alarmListIcon">
      </div>
    </div>

    <!--右边模块统计部分-->
    <!--右边模块收起图标-->
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
                <div>上牌车辆: <span>740915</span></div>
                <div>今日活动: <span>335788</span></div>
                <div>外卖车辆: <span>10859</span></div>
                <div>违标车辆: <span>13088</span></div>
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
                <div>超速告警: <span>149735</span></div>
                <div>逆行告警: <span>145788</span></div>
                <div>布控告警: <span>859</span></div>
                <div>事故告警: <span>3088</span></div>
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
                <div>事故报警: <span>190415</span></div>
                <div>自动处警: <span>551</span></div>
                <div>死亡事故: <span>32</span></div>
                <div>伤人事故: <span>325</span></div>
                <div>简易事故: <span>1089</span></div>
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
                <div>衢江区: <span>503</span></div>
                <div>柯城区: <span>632</span></div>
                <div>龙游县: <span>260</span></div>
                <div>常山县: <span>255</span></div>
                <div>江山市: <span>310</span></div>
                <div>开化县: <span>222</span></div>
              </div>
            </div>
            <div class="map_rightTitle flex flex_center">
              <span>基站统计</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!--退出登录-->
    <div class="logout" @click="toLogout"></div>
    <div class="popDialog logoutDialog" v-if="logout_show">
      <el-dialog :visible.sync="logout_show" :close-on-click-modal="false" :modal-append-to-body="false" :show-close="false">
        <div class="close_btn" @click="cancelLogout"><img src="../img/closeBtn.png" alt=""></div>
        <div>
          是否确认退出系统？
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="confirmLogout">确 定</el-button>
          <el-button @click="cancelLogout">取 消</el-button>
        </span>
      </el-dialog>
    </div>
    <!--告警详情弹窗-->
    <alarmDialog v-if="showAlarmDialog" @closeDia="hiddenDialog" @toshowTrack="toShowTrack" :detailAlarm="detailAlarm"
                 :detailType="detailType"></alarmDialog>
    <!--车辆信息弹窗-->
    <mobileInfo v-if="showMobileDialog" :selectTimeArea="selectTimeArea" @closeMobileDia="hiddenMobileDialog"
                :detailMobileInfo="detailMobileInfo" @searchTrack="toSearchTrack"></mobileInfo>

    <!--关闭轨迹大按钮  右上角-->
    <div class="track_closeBtn" v-show="!showTrack" @click="closeTrack"></div>
    <!--查询信息查询轨迹后缩放成icon-->
    <div class="track_infoIcon" v-show="!showTrack" @click="showInfoDialog"></div>

    <!--天气日期时间等-->
    <!--<div class="map_weather flex flex_align flex_between">-->
    <!--<span><span class="map_weatherStatus">{{showWeather.weather}}</span><span>{{showWeather.temperature}}℃</span></span>-->
    <!--<span>{{Dates.year}}年{{Dates.month}}月{{Dates.date}}日{{Dates.hour}}:{{Dates.minute}}</span>-->
    <!--</div>-->

    <!--车辆信息列表页面-->
    <infoListDialog v-show="infoListShow" :infoListShow="infoListShow" class="infoListWrap" @closeInfoList="closeInfoList" :jumpBreak="jumpBreak"
                    @historyTrack="historyTracks"></infoListDialog>
    <!--轨迹动画窗口-->
    <div class="trackAnimation_dialog" v-if="trackAnim_show">
      <!--<div style="font-size: 0.15rem; margin: 0 -0.12rem; color: white;background: #037aff;padding: 0.03rem 0;position: absolute;top: 0;left: 0;right:0;z-index: 8888;">轨迹记录</div>-->
      <div class="trackHistory_top">
        <div class="trackHistory_title">历史轨迹记录</div>
        <div class="trackHistory_sel flex flex_align">
          <span>车辆选择</span>
          <el-select v-model="bycleOptionSelect" filterable @change="changeSelect">
            <el-option v-for="item in bycleOption" :key="item.id" :value="item.value"></el-option>
          </el-select>
        </div>
      </div>
      <div class="trackHistory_bottom">
        <div class="track_detailConBox">
          <div @click="selectTrackPoint({lat: item.lat, lng:item.lng}, item.speed, item.prevLatlng, key)"
               :class="{track_detailCon: true, active_history_record: active_history_record === key}" v-for="(item,key) in speedArea" :key="key">
            <div>区间: <span>{{item.siteName1}}---{{item.siteName2}}</span></div>
            <div>开始: <span>{{item.time0.toISOString().split('.')[0].replace('T', ' ')}}</span></div>
            <div>结束: <span>{{item.time.toISOString().split('.')[0].replace('T', ' ')}}</span></div>
            <div>速度: <span>{{item.speed}}km/h</span></div>
            <div>类型: <span :style="{color: item.itemClass?'red':'black'}">{{item.type}}</span></div>
          </div>
        </div>
        <div class="track_noHistory" v-if="noTrackHistory">暂无历史轨迹记录</div>
      </div>
    </div>
    <div id="dock-container" v-if="true">
      <ul>
        <li class="console_1">
          <div class="sub_menuBox">
            <div class="sub_menu">
              <div>
                <i class="sub_menu1"></i><i class="sub_menu2"></i>
              </div>
            </div>
            <img @click="showDevelop" src="../img/manage.png">
          </div>
          <!--<span>登记管理</span>-->
        </li>
        <li class="console_2">
          <div class="sub_menuBox">
            <div class="sub_menu">
              <div>
              </div>
            </div>
            <img @click="showDevelop" src="../img/road.png">
          </div>
          <!--<span>即时路况</span>-->
        </li>
        <li  class="console_3">
          <div class="sub_menuBox">
            <div class="sub_menu">
              <div>
                <b>视频监控</b>
              </div>
            </div>
            <img @click="showMonitor" src="../img/monitor.png">
          </div>
          <!--<span>视频监控</span>-->
        </li>
        <li class="console_4">
          <div class="sub_menuBox">
            <div class="sub_menu">
              <div>
                <b>违法违章</b>
              </div>
            </div>
            <img @click="showBreak"  src="../img/breakimg.png">
          </div>
          <!--<span>违法违章</span>-->
        </li>
        <li class="console_5">
          <!--<span>事故处理</span>-->
          <div class="sub_menuBox">
            <div class="sub_menu">
              <div>
                <i class="sub_menu1"></i><i class="sub_menu2"></i><i class="sub_menu3"></i>
              </div>
            </div>
            <img @click="showDevelop" src="../img/accident.png">
          </div>
        </li>
        <li class="console_6">
          <div class="sub_menuBox">
            <div class="sub_menu">
              <div>
                <b>数据统计</b>
              </div>
            </div>
            <img  @click="showDevelop" src="../img/datas.png">
          </div>
          <!--<span>数据统计</span>-->
        </li>
      </ul>
    </div>

    <!--视频监控弹窗页面-->
    <div class="videoMonitor_popup" v-if="showVideoMonitor">
      <div class="img_bg"></div>
      <div class="close_imgBG" @click="close_img"><-</div>
    </div>
    <!--正在开发中-->
    <developing v-show="showDeveloping" @closeDevelop="closeDevelop" class="developing"></developing>

  </div>
</template>

<script>
  import infoListDialog from '../components/infoList'
  import alarmDialog from '../components/alarmDialog'
  import mobileInfo from '../components/mobileInfo'
  import developing from '../components/developing'
  import {
    getBaseStation,
    getTrack,
    getTrafficFlow,
    searchInfo,
    getTrackByTime,
    getInfoList,
    getPoints,
    toLogout
  } from "../api/remConfig";
  import {gen_mock_event} from '../data/accident-data'
  import {gen_mock_alert, gen_alert_desc} from '../data/alarm-data'
  import heatMap from '../components/heatmap'
  import L from 'leaflet'
  import polyline_snake_anim from '../components/polyline.snake'
  import route_interpolate_data from '../data/route-interpolate-data'
  // require('leaflet-routing-machine');

  polyline_snake_anim();
  heatMap(L);
  export default {
    name: "test",
    components: {
      alarmDialog, mobileInfo, infoListDialog,developing
    },
    data() {
      return {
        logout_show:false,
        fromInfoList:0, //判断是否从车辆列表页面过来的
        showDeveloping:false,
        jumpBreak:2,
        showVideoMonitor:false,
        highlighted_segment: [],
        pointVelocity: 0,
        noTrackHistory: false,
        bycleOptionSelect: '',
        bycleOption: [],
        trackAnim_show: false,
        infoListShow: false,//车辆信息列表显示判断
        animMarkerLatlng: {lat: '0', lng: '0'},
        report_count: [], // 基站上报次数
        testSpeed: [{
          time: '2019-04-18T00:00:01.390000128Z', lat: '28.969353', lng: '118.857255', device_id: '1'
        }, {
          time: '2019-04-18T18:05:51.500999936Z', lat: '28.976684', lng: '118.886719', device_id: '2'
        }, {
          time: '2019-04-18T20:05:51.500999936Z', lat: '28.990712', lng: '118.863291', device_id: '3'
        }], //测试速度的数据
        testSpeedArea: '',
        speedArea: [],
        dufaultMarkIcon: null,
        customMarkIcon: null,
        bycleIcon: null,
        url: 'http://' + location.host.split(':')[0] + ':4040/map/{z}/{x}/{y}.png',
        // url: 'http://172.16.0.34:4040/map/{z}/{x}/{y}.png',
        center: [28.966173, 118.84945],
        zoom: 15,
        bounds: null,
        polyline: {
          latlngs: [],
          color: '#d7ff18',
        },
        latlngs: [[28.966173, 118.84945, 0.7], [28.966173, 118.84945, 0.5]],
        heatPoints: [
          [28.966173, 118.84945, 100], // lat, lng, intensity
          [28.976173, 118.94945, 20],
        ],
        passedPolyline: null,
        bycleMarker: null, //电动自行车标识图
        goFullScreen: 0,
        showWeather: {'temperature': '22', 'weather': '阴'},//天气情况
        Dates: {
          year: '',
          month: '',
          date: '',
          hour: '',
          minute: ''
        },//日期
        timeInterval: null,// 时间定时器
        infoWindow: '',//地图上的信息窗体
        selectTimeArea: '', //所有车辆查询时间段
        hasShowTrack: false,//是否已经显示轨迹
        detailAlarm: '',//具体事故详情
        detailMobileInfo: '',// 搜索车辆信息详情
        detailType: '',
        showTrack: true,//显示轨迹的页面，其他模块按钮都隐藏
        selectDialog: 0,//看是打开告警窗口还是信息查询窗口 默认0是告警窗口
        map: null,
        vehicle_track: null,
        offset1: -3.8,
        offset2: -4.1,
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
        accident_data: [],
        active_history_record: null
      }
    },
    mounted() {
      const me = this;
      // this.dufaultMarkIcon = new L.Icon.Default();
      this.dufaultMarkIcon = L.icon({
        iconUrl: '../../static/bs.gif',
        iconSize: [25, 45.8],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        tooltipAnchor: [16, -28],
      });
      this.customMarkIcon = L.icon({
        iconUrl: '../../static/bs-offline.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        tooltipAnchor: [16, -28],
      });

      this.bycleIcon = L.icon({
        iconUrl: '../../static/bycicle.png',
        iconSize: [32, 42],
        iconAnchor: [16, 42],
        popupAnchor: [1, -34],
        tooltipAnchor: [16, -28],
      });

      this.map = this.$refs.myMap.mapObject;
      this.map.removeControl(this.map.zoomControl)
      this.heatMap = L.heatLayer(this.heatPoints, {radius: 10}).addTo(this.map);
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
        me.base_stations = r.data.data;
        console.log(r);
      });

      // 获取历史过点数据
      getPoints({flag: 3}).then(r => {
        if (r.data.result.length > 0) {
          let data = r.data.result.slice(r.data.result.length - 6, r.data.result.length - 1).map(e => {
            return {
              longitude: e.longitude,
              latitude: e.latitude,
              rfid: e.rfid,
              timestamp: Date.parse(e.time),
              device_id: e.device_id,
              plate_no: e.plate_no,
              entity_id: e.entity_id,
              vehicle_id: e.vehicle_id,
              location: ['', '白云中大道与南海路交叉(A点)', '白云中大道鹿鸣公园(B点)', '白云小区(C点)', '颐高电子(D点)', '白云中大道与南海路交叉(E点)'][e.device_id],
              type: e.entity_id == 5?'上机动车道行驶': '过车',
              time: this.toTimeString(new Date(Date.parse(e.time) - 3600 * 8 * 1000))
            }
          });
          let i = 0;
          data.map(e => {
            e.id = i++;
            return e;
          })
          this.alarmData = data.reverse()
          this.offset2 += data.length * 0.8;
        }
      });

      // 定时更新基站流量数据
      setInterval(() => {
        getTrafficFlow({flag: 2, start_time: '2000-01-01 00:00:00'}).then(r => {
          //热力图
          this.report_count = r.data.result;
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
          });
          this.heatMap.setLatLngs(this.heat_map_points)
        });
      }, 10000);

      getTrafficFlow({flag: 2}).then(r => {
        //热力图
        this.report_count = r.data.result;
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
      // var host = '172.16.0.34' + ':8889'
      var host = location.host.split(':')[0] + ':8889'
      var ws = new WebSocket('ws://' + host);
      ws.onmessage = (e) => {
        this.showAnimation = true;
        let data = JSON.parse(e.data);
        data.id = index2++;
        data.type = '过车';
        data.location = this.base_stations.find(item => item.id === data.device_id).desc
        data.time = this.toTimeString(new Date);
        if (data.velocity && data.velocity > 7) {
          data.type = '超速';
        }
        if (data.is_reverse) {
          data.type = '逆行'
        }
        if (data.is_wrong_lane) {
          data.type = '上机动车道'
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

      this.getPlateNo();
    },
    destroyed() {
      clearInterval(this.timeInterval)
    },
    methods: {
      confirmLogout(){
        //确认登出
        toLogout().then(refs=>{
          console.log(refs);
          if(refs.data=='ok'){
            this.logout_show = false;
            this.$router.push('/');
          }
        }).catch(err=>{
          console.log(err);
        })
      },
      cancelLogout(){
        //取消登出
        this.logout_show = false;
      },
      toLogout(){
        this.logout_show = true;
      },
      closeDevelop(){
        this.showDeveloping = false;
      },
      showDevelop(){
        this.showDeveloping = true;
      },
      showBreak(){
        this.infoListShow = true;
        this.jumpBreak = 2;
      },
      close_img(){
        this.showVideoMonitor = false;
      },
      showMonitor(){
        this.showVideoMonitor = true;
      },
      selectTrackPoint(latlng, speed, prevLatlng, key) {
        this.active_history_record = key;
        this.$refs.polyline.mapObject._snakeEnd();
        this.animMarkerLatlng = latlng
        this.pointVelocity = speed
        // this.$refs.markerVehicle.mapObject.openPopup()
        this.highlighted_segment = [...prevLatlng, latlng]

      },
      changeSelect(val) {
        let vehicleid = '';
        this.bycleOption.forEach(e => {
          if (e.value == val) {
            vehicleid = e.id;
          }
        });
        let data = {"vehicle_id": vehicleid, "flag": 1};
        // console.log('val',data);
        this.getAllTracks(data,'history');
        searchInfo({"key_word": val}).then(refs => {
          // refs.data.profile
          this.detailMobileInfo = refs.data.profile;
          // this.selectTimeArea = {"start_time":new Date(new Date().getTime()-86400000).toISOString().split('.')[0].replace('T', ' '),"end_time":new Date().toISOString().split('.')[0].replace('T', ' ')};
          this.selectTimeArea = '';
        }).catch(err => {
          console.log(err);
        });
      },
      getPlateNo() {
        let temp = [];
        getInfoList({offset:0, limit:10000}).then(refs => {
          refs.data.result.forEach(e => {
            temp.push({id: e.id, value: e.plate_no});
          });
          this.bycleOption = temp;
        }).catch(err => {
          console.log(err);
        })
      },
      historyTracks(data) {
        this.showTrack = false;
        this.showMobileDialog = false;
        this.infoListShow = false;
        this.selectDialog = 1;
        this.fromInfoList = 1; //从车辆列表过来的
        this.bycleOptionSelect = data.plate_no;
        this.getAllTracks(data,'history');
        searchInfo({"key_word": data.plate_no}).then(refs => {
          this.detailMobileInfo = refs.data.profile;
        }).catch(err => {
          console.log(err);
        });
      },
      closeInfoList() {
        this.infoListShow = false;

      },
      //车辆信息列表弹窗
      showInfoList() {
        this.infoListShow = true;
        this.jumpBreak = 1;
      },
      onSnake() {
        if (this.$refs.polyline) {
          // console.log('polyline:',this.$refs.polyline);
          this.animMarkerLatlng = this.$refs.polyline.mapObject._latlngs[0][this.$refs.polyline.mapObject._latlngs[0].length - 1]
        }
      },
      zoomUpdated(zoom) {
        this.zoom = zoom;
      },
      centerUpdated(center) {
        this.center = center;
      },
      boundsUpdated(bounds) {
        this.bounds = bounds;
      },
      getReportCountById(id) {
        for (let i = 0; i < this.report_count.length; i++) {
          if (this.report_count[i][0] == id) {
            return this.report_count[i][1];
          }
        }
        return 0
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
        //显示轨迹   告警窗口过来的  需要字段vehicle_id，flag:1
        this.showTrack = false;
        this.showAlarmDialog = false;
        this.selectDialog = 0;
        this.fromInfoList = 0;
        if (!this.hasShowTrack) {
          this.getAllTracks(data,'alarm');
        } else {
          return false;
        }
      },
      setAlarmTrack() {
        this.hasShowTrack = true;
        this.vehicle_track.setPath(this.get_random_point());
      },
      get_random_point() {
        let len = this.base_stations.length;
        let points = [];
        for (let i = 0; i < len; i++) {
          let d = this.base_stations[Math.floor(Math.random() * len)];
          points.push([d.longitude, d.latitude])
        }
        return points;
      },
      toSearchTrack(data) {
        //显示轨迹   车辆所有信息窗口过来的  需要字段vehicle_id，flag:1,start_time,end_time
        this.showTrack = false;
        this.showMobileDialog = false;
        this.selectDialog = 1;
        this.selectTimeArea = data;
        this.getAllTracks(data,'history');
      },
      getAllTracks(data,type) {
        getTrackByTime(data).then(refs => {
          const real_latlngs = [[], [28.958532, 118.850663], [28.966163,118.84944], [28.977356,118.849815], [28.973611,118.849643], [28.958532,118.850663]]
          let station_lnglats = this.base_stations.map(e => ({lat:real_latlngs[e.id][0], lng:real_latlngs[e.id][1], id:e.id}))
          // let station_lnglats2 = station_lnglats.map(e => ({lat: e[0], lng: e[1]}))
          if(type=='history'){
            this.trackAnim_show = true;
          }
          if (refs.data.result.length > 0) {
            this.bycleOptionSelect = refs.data.result[0].plate_no;
            this.noTrackHistory = false;
            this.polyline.latlngs = [];
            let tmp = refs.data.result.map(e => station_lnglats[e.device_id - 1]);
            let tmpSpeed = refs.data.result.map(e => {
              return {"time": e.time, ...station_lnglats[e.device_id - 1], "deviceId": e.device_id}
            });
            let points = [], pointSpeed = [];
            if (tmp.length == 0) return;
            points.push({...tmp[0]});
            pointSpeed.push({...tmpSpeed[0]});
            let jj = 0;
            let kk = 0;
            for (let i = 1; i < tmp.length; i++) {
              if (tmp[i].id != tmp[i - 1].id) {
                let interpolate = route_interpolate_data[tmp[i - 1].id + '_' + tmp[i].id];
                // console.log(tmp[i - 1].id + '_' + tmp[i].id);
                if (interpolate) {
                  // console.log(interpolate)
                  for (let j = 0; j < interpolate.length; j++) {
                    points.push({...interpolate[j]})
                    jj++;
                  }
                }
                points.push({...tmp[i]});
                pointSpeed.push({...tmpSpeed[i]});
                jj++;
                kk++;
              } else {
                points[jj] = {...tmp[i]};
                pointSpeed[kk] = {...tmpSpeed[i]};
              }
            }
            if (points.length == 1) {
              this.animMarkerLatlng = points[0]
            }
            // console.log('points', points)
            // console.log('pointSpeed', pointSpeed);
            this.polyline.latlngs = points;
            setTimeout(() => {
              this.highlighted_segment = []
              if (this.$refs.polyline.mapObject._snaking) {
                this.$refs.polyline.mapObject._snakeEnd()
              }
              this.$refs.polyline.mapObject._snakeLatLngs = null
              this.$refs.polyline.mapObject.snakeIn()
            }, 0);

            //测试速度
            //  let dist = this.distance(this.testSpeed[0].lat,this.testSpeed[0].lng,this.testSpeed[1].lat,this.testSpeed[1].lng,'K');
            //  console.log('dist:',dist);
            //  let testDistTime = new Date(this.testSpeed[1].time).getTime() - new Date(this.testSpeed[0].time).getTime();
            //   this.testSpeedArea = (dist*1000 / (testDistTime/1000)).toFixed(3);

            this.speedArea = [];
            if (pointSpeed.length > 1) {
              for (let i = 0; i < pointSpeed.length - 1; i++) {
                let dist = this.distance(pointSpeed[i].lat, pointSpeed[i].lng, pointSpeed[i + 1].lat, pointSpeed[i + 1].lng, 'K');
                let testDistTime = new Date(pointSpeed[i + 1].time).getTime() - new Date(pointSpeed[i].time).getTime();
                let speedAreas = (dist * 3600 / (testDistTime / 1000)).toFixed(3);
                let type = '正常';
                let itemClass = 0;

                if (speedAreas > 25) {
                  itemClass = 1;
                  type = '超速'
                }

                if (
                  (pointSpeed[i + 1].deviceId == 1 && pointSpeed[i].deviceId == 2) ||
                  (pointSpeed[i + 1].deviceId == 3 && pointSpeed[i].deviceId == 4) ||
                  (pointSpeed[i + 1].deviceId == 5 && pointSpeed[i].deviceId == 2)
                ) {
                  type = '逆行';
                  itemClass = 2
                }
                if (pointSpeed[i + 1].deviceId == 5) {
                  type = '机动车道行驶';
                  itemClass = 3;
                }
                let prevLatlng = []
                let interpolate = route_interpolate_data[pointSpeed[i].deviceId + '_' + pointSpeed[i + 1].deviceId]
                if (interpolate) {
                  prevLatlng = interpolate
                }
                prevLatlng.unshift({
                  lat: pointSpeed[i].lat,
                  lng: pointSpeed[i].lng
                })
                this.speedArea.push({
                  siteName1: this.base_stations[pointSpeed[i].deviceId - 1].desc,
                  siteName2: this.base_stations[pointSpeed[i + 1].deviceId - 1].desc,
                  speed: speedAreas,
                  time0: new Date(pointSpeed[i].time),
                  time: new Date(pointSpeed[i + 1].time),
                  type: type,
                  lat: pointSpeed[i + 1].lat,
                  lng: pointSpeed[i + 1].lng,
                  itemClass: itemClass,
                  prevLatlng: prevLatlng
                });
                // this.speedArea.push({siteName1:pointSpeed[i].deviceId,siteName2:pointSpeed[i+1].deviceId,speed:speedAreas, time0:new Date(pointSpeed[i].time),time: new Date(pointSpeed[i + 1].time)});
              }
            } else {
              this.speedArea = [];
              this.noTrackHistory = true;
              this.hasShowTrack = false;
              this.polyline.latlngs = [];
            }
          } else {
            this.speedArea = [];
            this.noTrackHistory = true;
            this.hasShowTrack = false;
            this.polyline.latlngs = [];
          }
        }).catch(err => {
          console.log(err);
        })
      },
      distance(lat1, lon1, lat2, lon2, unit) {
        if ((lat1 == lat2) && (lon1 == lon2)) {
          return 0;
        } else {
          var radlat1 = Math.PI * lat1 / 180;
          var radlat2 = Math.PI * lat2 / 180;
          var theta = lon1 - lon2;
          var radtheta = Math.PI * theta / 180;
          var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
          if (dist > 1) {
            dist = 1;
          }
          dist = Math.acos(dist);
          dist = dist * 180 / Math.PI;
          dist = dist * 60 * 1.1515;
          if (unit == "K") {
            dist = dist * 1.609344
          }
          if (unit == "N") {
            dist = dist * 0.8684
          }
          return dist;
        }
      },
      closeTrack() {
        //关闭轨迹
        this.selectTimeArea = '';
        this.searchInputVal = '';
        this.polyline.latlngs = [];
        this.trackAnim_show = false;
        if(this.fromInfoList == 1){
          this.infoListShow = true;
          this.showTrack = true;
          this.hasShowTrack = false;
        }else{
          this.showTrack = true;
          this.hasShowTrack = false;
        }
      },
      hiddenDialog() {
        this.showAlarmDialog = false;
        this.hasShowTrack = false;
        this.polyline.latlngs = [];
        this.trackAnim_show = false;
      },
      hiddenMobileDialog() {
        this.selectTimeArea = '';
        this.searchInputVal = '';
        this.showMobileDialog = false;
        this.hasShowTrack = false;
        this.polyline.latlngs = [];
        this.trackAnim_show = false;
      },
      toTimeString(dt) {
        return dt.toTimeString().split(' ')[0]
      },
      openAlarmDialog(item, type) {
        this.showAlarmDialog = true;
        this.detailAlarm = item;
        this.detailType = type;
      },
      searchEnterInput() {
        if (this.searchInputVal) {
          searchInfo({"key_word": this.searchInputVal}).then(refs => {
            console.log(refs);
            this.showMobileDialog = true;
            this.detailMobileInfo = refs.data.profile;
            this.fromInfoList = 0;
          }).catch(err => {
            console.log(err);
          });
        }
      },
      fullScreenChange() {
        var isFullscreen = document.fullscreenEnabled ||
          window.fullScreen ||
          document.webkitIsFullScreen ||
          document.msFullscreenEnabled;
        if (!isFullscreen) {
          this.goFullScreen = 0;
        }
      },
      launchFullScreen() {
        if (this.goFullScreen == 0) {
          this.goFullScreen = 1;
          var element = document.documentElement;
          if (element.requestFullscreen) {
            element.requestFullscreen();
          } else if (element.mozRequestFullScreen) {
            element.mozRequestFullScreen();
          } else if (element.webkitRequestFullscreen) {
            element.webkitRequestFullscreen();
          } else if (element.msRequestFullscreen) {
            element.msRequestFullscreen();
          }
        } else {
          this.goFullScreen = 0;
          if (document.exitFullscreen) {
            document.exitFullscreen();
          } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
          } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
          } else if (document.msExitFullscreen) {
            document.msExiFullscreen();
          }
        }
        document.addEventListener('fullscreenchange', this.fullScreenChange);
        document.addEventListener('webkitfullscreenchange', this.fullScreenChange);
        document.addEventListener('mozfullscreenchange', this.fullScreenChange);
        document.addEventListener('MSFullscreenChange', this.fullScreenChange);
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
      // setAnimation() {
      //   let i = 4;
      //   this.alarmInterval = setInterval(() => {
      //     // console.log(i);
      //     this.alarmData.unshift({
      //       id: i++,
      //       time: '14:15:0' + i,
      //       mobileId: '浙H20190606',
      //       mobileSite: 'ZQ0067',
      //       alarmType: '超速:50%'
      //     });
      //     // this.alarmData.pop();
      //     this.showAnimation = false;
      //     this.alarmTimeout = setTimeout(() => {
      //       this.showAnimation = true;
      //     }, 1000);
      //   }, 2000);
      // },
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
            data: ['上午', '中午', '下午', '晚上']
          },
          yAxis: {
            type: 'value'
          },
          series: [{
            data: [82000, 120000, 250300, 335900],
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
            data: ['1-3', '3-5', '5-7']
          },
          yAxis: {
            type: 'value'
          },
          series: [{
            data: [42, 38, 32],
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
  @import '~@/scss/dialog.scss';
  .logoutDialog /deep/ .el-dialog{
      margin-top:35vh !important;
     .el-dialog__header{
       height:40px;
       line-height: 40px;
     }
     .el-dialog__body{
       div{
         font-size:20px;
       }
       .close_btn{
         top:2px;
       }
     }
     .el-dialog__footer{
       display: flex;
       justify-content: flex-end;
       .dialog-footer{
         font-size:14px;
       }
     }
  }
  .active_history_record {
    -webkit-border-radius: 0px!important;
    -moz-border-radius: 0px!important;
    border-radius: 0px!important;
    border: 1px solid #2196f3;
    position: relative;
    &:after {
      content: '';
      display: block;
      width: 10px;
      background: #2196f3;
      position: absolute;
      right: -10px;
      top: -1px;
      bottom: -1px;
    }

  }

  #dock-container {
    font-size: 14px;
    position: fixed;
    bottom: 0;
    text-align: center;
    /*right: 20%;*/
    /*left: 20%;*/
    width:8.5rem;
    height:0.8rem;
    left:50%;
    margin-left:-4.2rem;
    z-index: 999;
    background: rgba(128,128,128,0.70);
    box-shadow: 0 2px 10px 0 rgba(0,0,0,0.30);
    border-radius: 20px 20px 0 0;
  }
  #dock-container ul{
    padding:0;
    margin:0;
  }
  #dock-container li {
    list-style-type: none;
    display: inline-block;
    position: relative;
    width:16%;
    font-weight: bold;
    .sub_menuBox{
      -webkit-transition: all 0.3s;
      position:relative;
      .sub_menu{
        display: none;
        position:absolute;
        top:-0.3rem;
        left:50%;
        margin-left:-0.45rem;
        width:0.9rem;
        height:0.3rem;
        background:url("../img/Rectangle.png") no-repeat center;
        background-size:100% 100%;
        div{
          width:100%;
          height:100%;
          display: flex;
          justify-content: space-around;
          align-items: center;
          i{
            position:relative;
            top:-0.02rem;
            cursor: pointer;
          }
          b{
            font-weight: normal;
            font-size:0.12rem;
            color:#fff;
            position: relative;
            top:-0.02rem;
          }
        }
      }
    }
  }
  #dock-container li.console_5{
    .sub_menuBox{
      .sub_menu{
        .sub_menu1{
          display: inline-block;
          width:0.14rem;
          height:0.14rem;
          background:url("../img/alarmInfo.png") no-repeat center;
          background-size:100% 100%;
          &:hover{
            background:url("../img/alarmInfo_active.png") no-repeat center;
            background-size:100% 100%;
          }
        }
        .sub_menu2{
          display: inline-block;
          width:0.2rem;
          height:0.14rem;
          background:url("../img/cloudjing.png") no-repeat center;
          background-size:100% 100%;
          &:hover{
            background:url("../img/cloudjing_active.png") no-repeat center;
            background-size:100% 100%;
          }
        }
        .sub_menu3{
          display: inline-block;
          width:0.15rem;
          height:0.15rem;
          background:url("../img/sanfangtonghua.png") no-repeat center;
          background-size:100% 100%;
          &:hover{
            background:url("../img/sanfangtonghua_active.png") no-repeat center;
            background-size:100% 100%;
          }
        }
      }
    }
  }
  #dock-container li.console_1{
    .sub_menuBox{
      .sub_menu{
        margin-left:-0.35rem;
        width:0.7rem;
        .sub_menu1{
          display: inline-block;
          width:0.215rem;
          height:0.125rem;
          background:url("../img/console1_1.png") no-repeat center;
          background-size:100% 100%;
          &:hover{
            background:url("../img/console1_1active.png") no-repeat center;
            background-size:100% 100%;
          }
        }
        .sub_menu2{
          display: inline-block;
          width:0.22rem;
          height:0.135rem;
          background:url("../img/console1_2.png") no-repeat center;
          background-size:100% 100%;
          &:hover{
            background:url("../img/console1_2active.png") no-repeat center;
            background-size:100% 100%;
          }
        }
      }
    }
  }
  #dock-container li.console_2{
    .sub_menuBox{
      .sub_menu{
        width: 1.8rem;
        height:1.3rem;
        top:-1.3rem;
        margin-left:-0.9rem;
        div{
          width:1.6rem;
          height:0.9rem;
          margin:0 auto;
          position: relative;
          top:0.08rem;
          background:url("../img/mapdemo.jpg") no-repeat center;
          background-size:cover;
        }
      }
    }
  }

  #dock-container li img {
    width: 0.65rem;
    height:0.69rem;
    cursor: pointer;
    -webkit-box-reflect: below 2px
    -webkit-gradient(linear, left top, left bottom, from(transparent),
        color-stop(0.7, transparent), to(rgba(255,255,255,.5))); /* reflection is supported by webkit only */
    -webkit-transition: all 0.3s;
    -webkit-transform-origin: 50% 100%;
  }
  #dock-container li.console_1 img{
   top:0.08rem;
    position:relative;
  }
  #dock-container li.console_2 img{
    width: 0.81rem;
    height:0.60rem;
  }
  #dock-container li.console_3 img{
    width: 0.75rem;
    height:0.60rem;
  }
  #dock-container li.console_4 img{
    width: 0.79rem;
    height:0.60rem;
  }
  #dock-container li.console_5 img{
    width: 0.60rem;
    height:0.72rem;
  }
  #dock-container li.console_6 img{
    width: 0.60rem;
    height:0.67rem;
  }
  #dock-container li:hover{
    .sub_menuBox{
      -webkit-transform: scale(2);
      .sub_menu{
        display: block;
      }
    }
    /*img{*/
      /*-webkit-transform: scale(2);*/
    /*}*/
  }
  #dock-container li:hover + li
 {
    img{
      -webkit-transform: scale(1.5);
    }
  }

  #dock-container li span {
    display: none;
    position: absolute;
    bottom: 140px;
    left: 0;
    width: 100%;
    background-color: rgba(0,0,0,0.75);
    padding: 4px 0;
    border-radius: 12px;
  }
  #dock-container li:hover span {
    display: inline-block;
    color: #fff;
  }
  .myMapWrap /deep/ .trackAnimation_dialog {
    .trackHistory_sel {
      .el-select {
        .el-input {
          height: 0.3rem;
        }

        .el-input__inner {
          height: 0.3rem;
          padding: 0 0.55rem 0 0.3rem;
          border-radius: 0.06rem;
        }

        .el-input__icon {
          line-height: 0.3rem;
        }
      }
    }
  }

  .myMapWrap {
    width: 100%;
    height: 100vh;
    overflow: hidden;
    position: relative;

    /*轨迹动画窗口*/
    .trackAnimation_dialog {
      position: absolute;
      z-index: 1000;
      width: 4rem;
      /*height:9.14rem;*/
      background: #FBFBFB;
      top: 0.9rem;
      box-sizing: border-box;
      /*padding:0 0.12rem;*/
      box-shadow: 0 0.02rem 0.04rem 0 rgba(0, 0, 0, 0.50);
      border-top-right-radius: 0.2rem;
      /*border-radius: 0 0.2rem 0.2rem 0;*/
      .trackHistory_bottom {
        position: relative;
        height: 8.24rem;
        overflow-y: auto;
        overflow-x: hidden;
        margin-top: 0.9rem;
      }

      .track_detailConBox {
        padding-top: 0.2rem;
        position: absolute;
        /*bottom:0;*/
      }

      .track_noHistory {
        font-size: 0.14rem;
        padding-top: 0.5rem;
      }

      .track_detailCon {
        cursor: pointer;
        width: 3.75rem;
        box-sizing: border-box;
        padding: 0.14rem 0.2rem;
        background: #fff;
        border-radius: 0.08rem;
        margin-bottom: 0.1rem;

        div {
          font-size: 0.14rem;
          font-family: 'pingfangMedium';
          color: #333;
          text-align: left;

          span {
            font-family: 'pingfangRegular';
            color: #666;
          }
        }
      }

      .trackHistory_top {
        position: fixed;
        width: 4rem;
        height: 0.9rem;
        left: 0;
        z-index: 1001;
        border-top-right-radius: 0.2rem;

        .trackHistory_title {
          height: 0.44rem;
          line-height: 0.44rem;
          background: #017AFF;
          font-size: 0.2rem;
          color: #fff;
          font-family: 'pingfangMedium';
          border-top-right-radius: 0.2rem;
        }

        .trackHistory_sel {
          padding-left: 0.35rem;
          height: 0.46rem;
          background: #FFFFFF;
          box-shadow: 0 0.02rem 0.04rem 0 rgba(0, 0, 0, 0.20);

          span {
            font-size: 0.18rem;
            color: #333;
            font-family: 'pingfangMedium';
            margin-right: 0.12rem;
          }
        }
      }
    }

    #myMap {
      width: 100%;
      height: 100vh;
    }
    .infoListWrap {
      position: relative;
      z-index: 1001;
    }
    .developing{
      z-index: 1001;
    }
    /*退出登录*/
    .logout{
      position: fixed;
      width:0.41rem;
      height:0.42rem;
      background:url("../img/logout.png") no-repeat center;
      background-size:100% 100%;
      bottom:0.15rem;
      right:0.2rem;
      z-index: 1000;
      cursor: pointer;
    }
    /*顶部信息*/
    .map_top {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 0.8rem;
      z-index: 999;

      .searchInput {
        z-index: 999;
      }

      /*background:rgba(0,0,0,.1);*/
      background: linear-gradient(rgba(216, 216, 216, 1), rgba(255, 255, 255, 0));

      .logo {
        display: inline-block;
        width: 0.528rem;
        height: 0.6rem;
        background: url("../img/jinghui.png") no-repeat center;
        background-size: 100% 100%;
      }

      span {
        font-size: 0.42rem;
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

      .fullScreen {
        background: url("../img/fullscreen.png") no-repeat center;
        background-size: 100% 100%;
      }

      .quitFullScreen {
        background: url('../img/quitFullscreen.png') no-repeat center;
        background-size: 100% 100%;
      }
    }

    /*左边部分*/
    /*模块收起icon*/
    .map_leftShrikIcon {
      position: absolute;
      top: 0.9rem;
      left: 0.2rem;
      width: 0.8rem;
      height: 0.8rem;
      background: lightgreen;
      box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.50);
      border-radius: 0.1rem;
      /*border: 2px solid #037aff;*/
      cursor: pointer;
      z-index: 999;

      i {
        /*position: absolute;*/
        display: block;
        width: 100%;
        height: 100%;
        background: url("../img/alarm.gif") no-repeat center;
        background-size: 120% 120%;
        /*top: 50%;*/
        /*left: 50%;*/
      }
    }

    /*模块展开部分*/
    .map_alarmWrap {
      position: absolute;
      top: 0.9rem;
      left: 0;
      z-index: 1000;
      /*width: 4.4rem;*/
      width:3.8rem;
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
          left: 52%;
        }

        .map_alarmLineWrap {
          width: 100%;
          height: 4.57rem;
          position: absolute;
          /*overflow-y:auto;*/
          /*&:before{*/
          /*content:'';*/
          /*position:absolute;*/
          /*width: 0.01rem;*/
          /*background: #017AFF;*/
          /*left:2.3rem;top:0;bottom:0;*/
          /*}*/
        }

        .map_alarmsWrap {
          position: absolute;
          bottom: 0;
          width: 2rem;
          transition: all .2s;
          left: 1rem;
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

        .animation_start {
          transform: translateY(-5.7rem);
          transition: all .2s;
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

          &:before {
            content: '';
            position: absolute;
            width: 0.01rem;
            background: #017AFF;
            bottom: 0;
            height: 0.8rem;
            left: 0.05rem;
            z-index: -1;
          }

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
            /*width: 1.7rem;*/
            width:1.4rem;
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
          width: 0.34rem;
          height: 1rem;
          top: 50%;
          margin-top: -0.5rem;
          box-sizing: border-box;
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
        /*width: 4.1rem;*/
        width:3.7rem;
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

          &:before {
            content: '';
            position: absolute;
            width: 0.01rem;
            background: #CB0500;
            bottom: 0;
            height: 0.8rem;
            left: 0.05rem;
            z-index: -1;
          }

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

        .map_alarmLineWrap {
          height: 4.2rem;
          /*overflow-y: auto;*/
          /*overflow-y: hidden !important;*/
        }
      }

      .map_shrikArrow {
        position: absolute;
        height: 0.25rem;
        bottom: -0.05rem;
        width: 100%;
        background: #FCFCFC;
        border-bottom-right-radius: 0.2rem;
        box-shadow: 0 0.04rem 0.04rem 0 rgba(0, 0, 0, 0.30);

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
        left: 0.1rem;
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
      z-index: 999;

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
      z-index: 1000;
      width:3.6rem;
      /*width: 4.1rem;*/
      height: 8.43rem;
      padding-left: 0.15rem;
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
              width: 0.34rem;
              height: 1.3rem;
              background: #017AFF;
              border-radius: 0.1rem 0 0 0.1rem;
              box-sizing: border-box;
              padding-left: 0.05rem;

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
    .track_closeBtn {
      position: absolute;
      top: 0.8rem;
      right: 0.2rem;
      width: 0.34rem;
      height: 0.34rem;
      background: url("../img/bigClose.png") no-repeat center;
      background-size: 100% 100%;
      cursor: pointer;
      z-index: 999;
    }

    /*轨迹查询后缩放的icon*/
    .track_infoIcon {
      position: absolute;
      bottom: 1rem;
      left: 50%;
      margin-left: -0.25rem;
      width: 0.5rem;
      height: 0.5rem;
      background: url("../img/trackIcon.png") no-repeat center;
      background-size: 100% 100%;
      cursor: pointer;
      z-index: 999;
    }

    /*天气时间等栏位*/
    .map_weather {
      position: absolute;
      bottom: 0.2rem;
      right: 0.2rem;
      width: 2.7rem;
      height: 0.3rem;
      box-sizing: border-box;
      padding: 0 0.25rem;
      background: rgba(255, 255, 255, 0.80);
      box-shadow: inset 0 0.01rem 0.03rem 0 rgba(0, 0, 0, 0.30);
      border-radius: 0.18rem;
      z-index: 999;

      .map_weatherStatus {
        margin-right: 0.1rem;
      }

      span {
        font-size: 0.14rem;
        color: #333333;
      }
    }
    //视频监控页面
    .videoMonitor_popup{
      position:absolute;
      top:0;left:0;bottom:0;right:0;
      z-index: 1001;
      background:#0D0D0D;
      .img_bg{
        width:100%;
        height:100%;
        background:url("../img/monitoring.png") no-repeat center;
        background-size: contain;
      }
      .close_imgBG{
        position:absolute;
        cursor: pointer;
        top:0.1rem;
        left:1rem;
        color:#fff;
        font-size:0.5rem;
      }
      img{
        width:100%;
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

      .el-icon-search:before {
        cursor: pointer;
        position: absolute;
        content: '';
        width: 0.33rem;
        height: 0.33rem;
        top: 50%;
        left: 50%;
        margin-top: -0.165rem;
        margin-left: -0.35rem;
        background: url("../img/search.png") no-repeat center;
        background-size: 100% 100%;
      }
    }

    .el-input__suffix {
      right: 0.01rem;
    }
  }

  .showLeft {
    display: none;
  }

  @media only screen and (max-width: 1367px) {
    .myMapWrap {
      .map_statistics {
        width: 4.3rem;
      }

      .map_weather {
        width: 3rem;
      }
    }
  }



</style>
