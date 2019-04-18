const data = [
  {
    plate_no: '衢381812',
    date: '2019年4月18日',
    location: '纬五路与下刘村入口',
    speed: '50',
    device_id: '0013',
    overspeed: '100'
  },
  {
    plate_no: '衢1938199',
    date: '2019417',
    location: '大桥路与梅林路路口西南',
    speed: '40',
    device_id: '0024',
    overspeed: '60'
  },
  {
    plate_no: '衢2893912',
    date: '2019年4月17日',
    location: '高塘路与霞飞路路口路南',
    speed: '45',
    device_id: '1007',
    overspeed: '80'
  },
  {
    plate_no: '衢1234567',
    date: '2019年4月17日',
    location: '衢州科技局',
    speed: '25',
    device_id: '0020',
    overspeed: '0'
  },
  {
    plate_no: '衢7654321',
    date: '2019年4月17日',
    location: '衢州市政府',
    speed: '50',
    device_id: '0021',
    overspeed: '100'
  },
  {
    plate_no: '衢1234560',
    date: '2019年4月17日',
    location: '衢州市公安局',
    speed: '50',
    device_id: '0022',
    overspeed: '100'
  },
  {
    plate_no: '衢3819831',
    date: '2019年4月17日',
    location: '白云中大道与芹江东路路口西南',
    speed: '50',
    device_id: '0014',
    overspeed: '100'
  },
  {
    plate_no: '衢555000',
    date: '2019年4月17日',
    location: '白云北大道第三医院门口东',
    speed: '50',
    device_id: '0015',
    overspeed: '100'
  },
  {
    plate_no: '衢2389419',
    date: '2019年4月17日',
    location: '白云北大道与亭川东路路口东北',
    speed: '50',
    device_id: '0015',
    overspeed: '100'
  }
]

var gen_mock_alert = (function() {
  var len = data.length;
  var index = 0;
  var fn = function() {
    return {...data[(index++ % len)]};
  }
  return fn;
})()

var gen_alert_desc = function(alert) {
  return `${alert.plate_no}于${alert.date}在${alert.location}路段被${alert.device_id}通过雷达测速手段，监测到时速${alert.speed},超速${alert.overspeed}%以上`
}

export {gen_alert_desc, gen_mock_alert}
