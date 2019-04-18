const data = [
  {
    location: '柯城区下街',
    plate_no: '衢3919381',
    type: '直行',
    description: '',
    device_id: 'QZRF55829'
  },
  {
    location: '柯城区芹江东路',
    plate_no: '衢3298183',
    type: '追尾',
    description: '',
    device_id: 'QZRF82938'
  },
  {
    location: '柯城区东港八路',
    plate_no: '衢2838192',
    type: '超车',
    description: '',
    device_id: 'QZRF66291'
  },
  {
    location: '百灵北路',
    plate_no: '衢5183913',
    type: '转弯',
    description: '',
    device_id: 'QZRF66001'
  },
  {
    location: '衢江区迎宾大道',
    plate_no: '衢3111928',
    type: '坡道',
    description: '',
    device_id: 'QZRF55118'
  },
  {
    location: '衢江区江源路',
    plate_no: '衢5790183',
    type: '',
    description: '',
    device_id: 'QZRF00001'
  },
  {
    location: '柯城区盈川东路',
    plate_no: '衢6983198',
    type: '直行',
    description: '',
    device_id: 'QZRF40391'
  },
  {
    location: '柯城区荷花中路',
    plate_no: '衢3891923',
    type: '转弯',
    description: '',
    device_id: 'QZRF28319'
  },
  {
    location: '衢化路与物流大道交汇处',
    plate_no: '衢6001382',
    type: '坡道',
    description: '',
    device_id: 'QZRF50183'
  },
  {
    location: '柯城区滨三小区(',
    plate_no: '衢6158291',
    type: '追尾',
    description: '',
    device_id: 'QZRF41381'
  },
  {
    location: '衢江区廿里镇白马街',
    plate_no: '衢3818291',
    type: '追尾',
    description: '',
    device_id: 'QZRF12330'
  },
  {
    location: '柯城区石室乡',
    plate_no: '衢2899993',
    type: '坡道',
    description: '',
    device_id: 'QZRF51288'
  },
  {
    location: '衢江区三二零国道',
    plate_no: '衢3182993',
    type: '超车',
    description: '',
    device_id: 'QZRF50636'
  },
]

const gen_mock_event = (function() {
  var len = data.length;
  var index = 0;
  var fn = function() {
    return {...data[(index++ % len)]};
  }
  return fn;
})()

export {gen_mock_event }
