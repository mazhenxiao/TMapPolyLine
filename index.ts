type RES = {
  message: string;
  status: number;
  request_id?: string;
  result?: {
    routes: Array<{
      distance: number;
      duration: number;
      mode: string; //"DRIVING"
      polyline: Array<number>;
      restriction: string;
      status: number;
      steps: Array<number>;
      tags: Array<string>;
      taxi_fare: { fare: number };
      toll: number;
      traffic_light_count: number;
    }>;
  };
};
import md5 from "md5";

class TMapPolyLine {
  /**
   * var url="https://apis.map.qq.com/ws/direction/v1/driving/"; //请求路径
    url+="?from=39.984039,116.307630";  //起点坐标
    url+="&to=39.977263,116.337063";  //终点坐标
    url+="&output=jsonp&callback=cb" ;  //指定JSONP回调函数名，本例为cb
    url+="&key=OB4BZ-D4W3U-B7VVO-4PJWW-6TKDJ-WPB77"; //开发key，可在控制台自助创建
   */
  private key: string = "";
  private url: string = `https://apis.map.qq.com/ws/direction/v1/driving/`;
  private callbackName: string = "TMapPolyLine_Callback";
  private sk: string = "";
  //key: string = ""
  constructor(arg: { apikey: string; secretKey: string }) {
    this.key = arg.apikey;
    this.sk = arg.secretKey;
  }
  //TODO:等待Promise获取返回
  private getCallback(): Promise<number[][]> {
    const setLine = (data: Array<number>): number[][] => {
      //从结果中取出路线坐标串
      var coors = data,
        pl = [];
      //坐标解压（返回的点串坐标，通过前向差分进行压缩，因此需要解压）
      var kr = 1000000;
      for (var i = 2; i < coors.length; i++) {
        coors[i] = Number(coors[i - 2]) + Number(coors[i]) / kr;
      }
      //将解压后的坐标生成LatLng数组
      for (var i = 0; i < coors.length; i += 2) {
        pl.push([coors[i], coors[i + 1]]);
      }
      return pl;
    };
    return new Promise((resolve, reject) => {
      (window as any)[this.callbackName] = (res: RES) => {
        if (res.status !== 0) {
          return reject(new Error(res.message));
        }
        if (res.result?.routes[0].polyline) {
          return resolve(setLine(res.result?.routes[0].polyline));
        }

        return reject(new Error("未获取到有效数据"));
      };
    });
    // return Promise.resolve([]);
  }
  // TODO:获取点
  getPolyLine(req: { from: string; to: string }): Promise<number[][]> {
    let script = document.createElement("script");
    let nomalURL = `${this.url}?callback=${this.callbackName}&from=${req.from}&key=${this.key}&output=jsonp&to=${req.to}`;
    let url = new URL(nomalURL);
    let sig = url.pathname + url.search + this.sk;
    script.src = `${nomalURL}&sig=${md5(sig)}`;
    document.body.appendChild(script);
    return this.getCallback();
  }
}

// let map = new TMapPolyLine({
//   apikey: "B46BZ-QFTRP-HAHD7-LITAR-ZLATK-A2FPP",
//   secretKey: "PgO5N03v5CCfgcZTBGS1JEwJeO5HRuAj",
// });
// map
//   .getPolyLine({ from: "39.984039,116.307630", to: "39.977263,116.337063" })
//   .then((da) => {
//     console.log(da);
//   });

export default TMapPolyLine;
