/*
 * @Author: xiezhipeng
 * @Date: 2023-8-07 10:25:40
 * @LastEditors: xiezhipeng
 * @LastEditTime: 2023-8-07 10:25:41
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { EquirectangularTilesAdapter } from "photo-sphere-viewer/dist/adapters/equirectangular-tiles";
import { Viewer } from "photo-sphere-viewer";
import { MarkersPlugin } from "photo-sphere-viewer/dist/plugins/markers";
import { GalleryPlugin } from "photo-sphere-viewer/dist/plugins/gallery";
import { VirtualTourPlugin } from "photo-sphere-viewer/dist/plugins/virtual-tour";
import "photo-sphere-viewer/dist/photo-sphere-viewer.css";
import "photo-sphere-viewer/dist/plugins/markers.css";
import "photo-sphere-viewer/dist/plugins/gallery.css";
import "photo-sphere-viewer/dist/plugins/virtual-tour.css";
import * as THREE from "three";
import axios from "axios";
import icon1 from "@/asset/3dland/service.png"
import icon2 from "@/asset/3dland/hospitalmark.png"
import icon3 from "@/asset/3dland/business.png"


const tiandituQueryParam={
  baseUrl: "https://api.tianditu.gov.cn/v2/search",
  level: 12,
  mapBound: "114.09583369165028,35.62628683569018,114.48687830834871,35.87343329946653",//六盘水:"104.82799834945087,26.545609772366603,104.91963361683992,26.61815347028798",//鹤壁:"114.09583369165028,35.62628683569018,114.48687830834871,35.87343329946653"
  queryType: 1,
  start: 0,
  count: 100,
  type: "query",
  queryRadius: 1000,
  tk: "1ab633275c9b7f231b5ccb4b073d2fd0"
};


/**
 * 全景类
 */
export class PanoramaViewer {
  /***
   * 构造全景图插件
   * @param {String} div
   * @param {Object} option
   */
  constructor(div, option) {
    let cfg = {
      adapter: [EquirectangularTilesAdapter,{
        baseBlur: false,
    }],
      container: document.getElementById(div),
      caption: "全景图",
      navbar: ["autorotate", "zoom", "caption", "fullscreen", "gallery"],
      plugins: [
        [MarkersPlugin, {}],
        [
          GalleryPlugin,
          {
            visibleOnLoad: true,
          },
        ],
        // [
        //   VirtualTourPlugin,
        //   {
        //     positionMode: VirtualTourPlugin.MODE_GPS,
        //     renderMode: VirtualTourPlugin.MODE_3D,
        //   },
        // ],
      ],
    };

    this.PSV = new Viewer(cfg);

    //传入数据所在根目录
    this.baseUrl2 = option.baseUrl ? option.baseUrl : "";

    this.iconconfig={
      学校:"3dland/service.png",
      医院:"3dland/service.png",
      超市:"3dland/service.png",
   },
    //默认加载第一个
    // if(imagescfg&&imagescfg.length>0)
    // {
    //    this.curphoto=this.curphotos.images[0];
    //    cfg.panorama=imagescfg[0].panorama;
    // }
    // this.PSV = new Viewer(cfg);

    //panorama-loaded
    this.PSV.on("panorama-loaded", () => {
      
      this.changepano(this.PSV.config.panorama.name);
      
    });

    this.resultList=[];
    this.resultList2=[];
    this.resultList3=[];

  }
  loadMarker(option){

  }
  startPointMarker(){
      
  }


  /**
   * 获取当前相对地面高度
   * @returns 
   */
  getRHeight(){
      return this.curphoto.height;
  }


  getCenter(){
    return this.curphoto.lonlat;
  }

  /**
   * 获取当前姿态角度
   * @returns 
   */
  getPoseData(){
    return this.curphoto.panoData;
  }

  /**
   * 加载数据,传入配置文件，配置文件记录相关信息
   * @param {*} url
   */
  load(url) {
    //默认加载第一组
  }
  /**
   * 加载全部数据
   * @param {Object} metadata
   */
  loadDatas(metadata) {
    let that = this;
    let imagescfg = this.curphotos.images.map((c) => {
      return that.image2config(c, that.curphotos.name);
    });
  }
  /**
   * 加载单组数据
   * @param {Object} metadata
   */
  loadData(metadata) {
    let that = this;
    let imagescfg = metadata.images.map((c) => {
      return that.image2config(c, metadata.name);
    });

    //添加link信息,遍历全部id
    let ids = imagescfg.map((i) => i.id);

    imagescfg.forEach((j) => {
      //排除自己
      let newids = ids
        .filter((k) => {
          return k != j.id;
        })
        .map((f) => {
          return {
            nodeId: f,
          };
        });
      j.links = newids;
    });

    
    //获取到
    const galleryPlugin = this.PSV.getPlugin(GalleryPlugin);
    galleryPlugin.setItems(imagescfg);

     //const virtualTourPlugin = this.PSV.getPlugin(VirtualTourPlugin);
     //virtualTourPlugin.setNodes(imagescfg);

    this.PSV.setPanorama(imagescfg[0].panorama,imagescfg[0].options);
    this.curphotos = metadata;
  }


  /**
   * 切换全景图时,需要切换标注
   * @param {Object} item
   */
  changepano(item) {
    this.curphoto = this.curphotos.images.find((i) => i.imagename == item);
    //this.loadPOI();
  }

  /**
   * 清除全部标记
   */
  clearMarkers(){
    const markersPlugin = this.PSV.getPlugin(MarkersPlugin);
    markersPlugin.clearMarkers();
  }


  
  image2config(item, dkname) {
    let isusetile = false;
    item ? (isusetile = item.usetile) : undefined;

    let sphereCorrection={pan:0,tilt:0,roll:0};
    
    if(item.panoData&&item.panoData.poseHeading)
    {
      sphereCorrection.pan=item.panoData.poseHeading/180*Math.PI;
    }
    
    if(item.panoData&&item.panoData.posePitch){
      sphereCorrection.tilt=-item.panoData.posePitch/180.0*Math.PI;
    }
    // if(item.panoData&&item.panoData.poseRoll){
    //   sphereCorrection.roll=item.panoData.roll/180*Math.PI;
    // }

    return {
      id: item.imagename,
      name: item.imagename,
      //baseBlur:false,
      thumbnail: `${this.baseUrl2}${dkname}/${item.imagename}/${item.imagename}_low.JPG`,
      panorama: {
        name: item.imagename,
        width: 8192,
        cols: 8,
        rows: 4,
        baseUrl: `${this.baseUrl2}${dkname}/${item.imagename}/${item.imagename}_low.JPG`,
        tileUrl: (col, row) => {
          return `${this.baseUrl2}${dkname}/${item.imagename}/row-${
            row + 1
          }-column-${col + 1}.jpg`;
        },
        //basePanoData: {poseHeading:0,posePitch:0,poseRoll:0}
      },
      options:{
        sphereCorrection:sphereCorrection,
        zoom:20,
      },
      position: item.lonlat,
      // option:{
      //   width: 8192,
      //   cols: 8,
      //   rows: 4,
      //   baseUrl: `${this.baseUrl2}${item.imagename}/${item.imagename}_low.JPG`,
      //   tileUrl: (col, row) => {
      //     return `${this.baseUrl2}${item.imagename}/row-${row+1}-column-${col+1}.jpg`;
      //   }
      // },
    };
  }


  //加载poi的标记点到地图上
  loadPOI(){
      const markersPlugin = this.PSV.getPlugin(MarkersPlugin);
      markersPlugin.clearMarkers();
      //加载内置定义的markers，否则可能加载失败
      if (this.curphoto) {
        // if (this.curphoto.markers) {
        //   this.curphoto.markers.forEach(p => {
        //     markersPlugin.addMarker(p);
        //   })
        // }
        //查询此全景图附近的POI，然后转换成MarkList然后添加进去，先只计算水平方向的offsetdebgre，放在中间，看是否准确。
         this.onQueryNearby({ lon: this.curphoto.lonlat[0], lat:this.curphoto.lonlat[1] }, 3000, "超市", this.resultList3);
         this.onQueryNearby({ lon: this.curphoto.lonlat[0], lat:this.curphoto.lonlat[1] }, 3000, "医院", this.resultList2);
         this.onQueryNearby({ lon: this.curphoto.lonlat[0], lat:this.curphoto.lonlat[1] }, 3000, "学校", this.resultList);
      }
  }


  async onQueryNearby(center, radius, keyWord, resultList) {
    let querystr = `${center.lon}, ${center.lat}`;
    let url = `${tiandituQueryParam.baseUrl}?postStr={"keyWord":"${keyWord}","level":${tiandituQueryParam.level},"mapBound":"${tiandituQueryParam.mapBound}","queryRadius":${radius},"queryType":"3","start":${tiandituQueryParam.start},"pointLonlat":"${querystr}","count":${tiandituQueryParam.count}}&type=${tiandituQueryParam.type}&tk=${tiandituQueryParam.tk}`;
    let that = this;
    await axios
      .get(url, { withCredentials: false })
      .then(({ data }) => {
        if (data.pois && data.pois.length > 0) {
          data.pois.map((item) => {
            let point = item.lonlat.split(",");
            item.geom = `POINT(${point[0]} ${point[1]})`;
            //同时计算原始方位角度
            //that.resultList.push(item)
            resultList.push({
              名称: item.name,
              地址: item.address,
              联系电话: item.phone,
              geom: item.geom,
              lonlat:[point[0],point[1]],
              azimuth:that.azimuth(that.curphoto.lonlat,[point[0],point[1]]),
              //atan:-that.distanceToTangle(that.photos[0].lonlat,[point[0],point[1]],that.photos[0].height),
              distance:that.distance(that.curphoto.lonlat,[point[0],point[1]]),
              poitype:keyWord
            });
          });
          //console.log(resultList);
          that.tomarkers({},resultList);
        } else {
           
        }
      })
      .catch((err) => {});
  }

  tomarkers(option,resultList){
      
    let defaultoffsetlng=option.defaultoffsetlng?option.defaultoffsetlng:0;
    let that=this;
    //查询经纬度一定范围内的poi点，保存然后,计算水平角度
    if(resultList)
    {
      const markersPlugin = this.PSV.getPlugin(MarkersPlugin);
      resultList.forEach(r=>{
        let marker={
          id:r.名称,
          longitude: (r.azimuth)/180.0*3.1415926,
          latitude: -Math.atan(that.curphoto.height/r.distance),
          image: that.iconconfig[r.poitype] ,
          width: 32,
          anchor: 'bottom center',
          height: 81,
          tooltip: r.名称,
          olongitude:(r.azimuth-180.0)/180*3.14,
          olatitude: r.atan,
          distance:r.distance
        };
        markersPlugin.addMarker(marker);
      })
    }
  }


  //添加水平控制的UI
  //添加垂直控制的UI
  
  azimuth(lonlat1, lonlat2) {
    var lon1 = THREE.MathUtils.degToRad(lonlat1[0])
    var lat1 = THREE.MathUtils.degToRad(lonlat1[1])
    var lon2 = THREE.MathUtils.degToRad(lonlat2[0])
    var lat2 = THREE.MathUtils.degToRad(lonlat2[1])

    if (lon1 == lon2) {
      if (lat2 >= lat1) {
        return 0
      } else {
        return 180
      }
    }
    if (lat1 == lat2) {
      if (lon2 > lon1) {
        return 90
      } else if (lon2 < lon1) {
        return 270
      }
    }

    var a = THREE.MathUtils.radToDeg(Math.atan((lon2 - lon1) * Math.cos(lat2) / (lat2 - lat1)))
    if (lat2 > lat1) {
      if (lon2 > lon1) {
        return a
      } else {
        return a + 360
      }
    } else {
      return a + 180
    }
  }
  
  // //计算两个经纬度之间的空间距离，tang据此进行计算，然后手动自行进行偏移。
  // distanceToTangle(lonlat1, lonlat2,height){
  //   debugger
  //    let point1=  new Cesium.Cartesian3.fromDegrees(lonlat1[0], lonlat1[1]);
  //    let point2=  new Cesium.Cartesian3.fromDegrees(Number.parseFloat(lonlat2[0]),Number.parseFloat(lonlat2[1]));
  //    let distance= Cesium.Cartesian3.distance(point1,point2);
  //    //弧度制
  //    let result= Math.atan(height/distance);
  //    return result;
  // },
  // distance(lonlat1, lonlat2) {
  //   let point1 = new Cesium.Cartesian3.fromDegrees(lonlat1[0], lonlat1[1]);
  //   let point2 = new Cesium.Cartesian3.fromDegrees(Number.parseFloat(lonlat2[0]), Number.parseFloat(lonlat2[1]));
  //   let distance = Cesium.Cartesian3.distance(point1, point2);
  //   return distance;
  // }


  distance( lonlat1, lonlat2){
    let lat1=lonlat1[1];
    let lng1=lonlat1[0];
    let lat2=lonlat2[1];
    let lng2=lonlat2[0];

    var radLat1 = lat1*Math.PI / 180.0;
    var radLat2 = lat2*Math.PI / 180.0;
    var a = radLat1 - radLat2;
    var  b = lng1*Math.PI / 180.0 - lng2*Math.PI / 180.0;
    var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a/2),2) +
    Math.cos(radLat1)*Math.cos(radLat2)*Math.pow(Math.sin(b/2),2)));
    s = s *6378.137 ;// EARTH_RADIUS;
    s = Math.round(s * 10000) / 10;
    return s;
}




}





