<template>
  <div>
    <div id="container"></div>
  </div>
</template>

<script>
    export default {
        name: "mapVue2",
      mounted(){
        this.getMap();
      },
      methods:{
          createPoint(lng,lat,map){
            //布控点 //创建小狐狸
            var pt = new BMap.Point(lng,lat);
            var myIcon = new BMap.Icon("http://lbsyun.baidu.com/jsdemo/img/fox.gif", new BMap.Size(300,157));
            var marker2 = new BMap.Marker(pt,{icon:myIcon});  // 创建标注
            map.addOverlay(marker2);              // 将标注添加到地图中
            marker2.setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画
          },
          getMap(){
            var map = new BMap.Map("container");          // 创建地图实例
            var heatmapOverlay;
            var point = new BMap.Point(118.86631,28.97504);
            map.centerAndZoom(point, 15);             // 初始化地图，设置中心点坐标和地图级别
            map.enableScrollWheelZoom(); // 允许滚轮缩放
            var points =[
              {"lng":118.860129,"lat":28.974408,"count":50},
              {"lng":118.858117,"lat":28.974156,"count":51},
              {"lng":118.859267,"lat":28.974156,"count":15},
              {"lng":118.860273,"lat":28.974282,"count":40},
              {"lng":118.855674,"lat":28.973903,"count":100}];

            if(!isSupportCanvas()){
              alert('热力图目前只支持有canvas支持的浏览器,您所使用的浏览器不能使用热力图功能~')
            }
            //详细的参数,可以查看heatmap.js的文档 https://github.com/pa7/heatmap.js/blob/master/README.md
            //参数说明如下:
            /* visible 热力图是否显示,默认为true
               * opacity 热力的透明度,1-100
               * radius 势力图的每个点的半径大小
               * gradient  {JSON} 热力图的渐变区间 . gradient如下所示
               *	{
                      .2:'rgb(0, 255, 255)',
                      .5:'rgb(0, 110, 255)',
                      .8:'rgb(100, 0, 255)'
                  }
                  其中 key 表示插值的位置, 0~1.
                      value 为颜色值.
               */
            heatmapOverlay = new BMapLib.HeatmapOverlay({"radius":20});
            map.addOverlay(heatmapOverlay);
            heatmapOverlay.setDataSet({data:points,max:100});
            //判断浏览区是否支持canvas
            function isSupportCanvas(){
              var elem = document.createElement('canvas');
              return !!(elem.getContext && elem.getContext('2d'));
            }
            let licence_arr = [{
              id:0,
              cood:[118.867388,28.975262]
            },{
              id:1,
              cood:[118.880323,28.970332]
            },{
              id:2,
              cood:[118.886288,28.976936]
            },{
              id:3,
              cood:[118.881401,28.976304]
            },{
              id:4,
              cood:[118.882982,28.986794]
            }];
            licence_arr.forEach((item,index)=>{
               this.createPoint(item.cood[0],item.cood[1],map);
            });

            // 设置轨迹
            var polyline = new BMap.Polyline([
              new BMap.Point(118.867388,28.975262),
              new BMap.Point(118.880323,28.970332),
              new BMap.Point(118.886288,28.976936),
              new BMap.Point(118.882982,28.986794)
            ], {strokeColor:"#ff0000", strokeWeight:2, strokeOpacity:0.5});   //创建折线
            map.addOverlay(polyline);   //增加折线

          }
      }
    }
</script>

<style scoped lang="scss">
  #container{
    width:100%;
    height:100vh;
  }
</style>
