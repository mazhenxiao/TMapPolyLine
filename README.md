# 腾讯地图路线规划jsonp转promise
```
npm i TMapPolyLine --save

yarn add TMapPolyLine
```

|参数|类型|说明|
|--|--|--|
|TMapPolyLine| 构造函数||
|apikey|string|自己的apikey|
|secretKey|string|管理平台的secretKey|
|getPolyLine|方法||
|from|string|起始点，例如：39.984039,116.307630|
|to|string|结束点，例如：39.984039,116.307630|


``` javascript

import TMapPolyLine from "TMapPolyLine"
// 初始化
let map = new TMapPolyLine({
  apikey: "B46BZ-QFTRP-HAHD7-LITAR-ZLATK-*****",
  secretKey: "************************",
});

// 调用
map.getPolyLine({ 
    from: "39.984039,116.307630",  // 起始点
    to: "39.977263,116.337063"     // 结束点
}).then((da) => {
    console.log(da);
  });
  
```