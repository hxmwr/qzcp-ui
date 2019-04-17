export default function(){
  var deviceWidth = document.documentElement.clientWidth || window.innerWidth;
  var whdef = 100/1920;// 表示1920的设计图,使用100PX的默认值
  var wH =document.documentElement.clientHeight || window.innerHeight;// 当前窗口的高度
  var wW = document.documentElement.clientWidth || window.innerWidth;// 当前窗口的宽度
  // if(wW>=1920){
  //   wW = 1920;
  // }
  if(wW <= 1366){
    wW = 1366;
  }
  var rem = wW * whdef;// 以默认比例值乘以当前窗口宽度,得到该宽度下的相应FONT-SIZE值
  document.documentElement.style.fontSize = rem + 'px'
}
