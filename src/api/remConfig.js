import axios from "axios";

const base = '/api';

export default function () {
  var deviceWidth = document.documentElement.clientWidth || window.innerWidth;
  var whdef = 100 / 1920;// 表示1920的设计图,使用100PX的默认值
  var wH = document.documentElement.clientHeight || window.innerHeight;// 当前窗口的高度
  var wW = document.documentElement.clientWidth || window.innerWidth;// 当前窗口的宽度
  // if(wW>=1920){
  //   wW = 1920;
  // }
  if (wW <= 1366) {
    wW = 1366;
  }
  var rem = wW * whdef;// 以默认比例值乘以当前窗口宽度,得到该宽度下的相应FONT-SIZE值
  document.documentElement.style.fontSize = rem + 'px'
}

export const getPoints = (data) => {
  return axios.post(`${base}/points`, data)
}

export const getBaseStation = () => {
  //基站
  return axios.get(`${base}/base-station`);
};

export const getTrafficFlow = (data) => {
  //位置
  return axios.post(`${base}/points`, data);
};

export const getTrack = (data) => {
  return axios.post(`${base}/points`, data);
};

// 搜索
export const searchInfo = (data)=>{
  return axios.get(`${base}/search`,{params: data});
};

// 车辆信息，根据时间段选择轨迹
export const getTrackByTime = (data)=>{
  return axios.post(`${base}/points`,data);
};

//车辆列表弹窗
export const getInfoList = (data)=>{
  return axios.get(`${base}/vehicles`,{params:data});
};

// 获取历史告警数据
export const getEllegalEvents = (data) => {
  return axios.get(`${base}/illegal-events`, {params:data})
};

//登录
export const toLogin = (data)=>{
  return axios.post(`${base}/user/login`,data);
};

//验证登录
export const checklogin = (data)=>{
  return axios.get(`${base}/user/is-login`,{params:data});
};

//登出
export const toLogout = (data)=>{
  return axios.get(`${base}/user/logout`,{params:data});
};
