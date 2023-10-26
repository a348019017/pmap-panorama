import * as turf from "@turf/turf"
import { MarkersPlugin } from "photo-sphere-viewer/dist/plugins/markers";


const PIN_RED_URL = 'https://photo-sphere-viewer-data.netlify.app/assets/pictos/pin-red.png';



/**
 * 加载GeoJSON
 */
export class GeoJSONLoader {
    /**
     * 
     * @param {*} viewer  主viewer对象
     */
  constructor(viewer) {
    this.viewer = viewer;
    this.psv = this.viewer.PSV;
    
    this.markers = this.psv.getPlugin(MarkersPlugin);
  }

  /**
   * 加载GeoJSON文件，点作为marker加载，线面分别加载，仅支持FeatureCollection对象，其它对象自行修改支持
   */
  loadGeoJSON(geojson,groupname,idfileds) {
    //获取当前中心点
    this.center = this.viewer.getCenter();
    this.height=this.viewer.getRHeight();

    let that=this;
    let rst=geojson.features.map(i=>that.loadFeature(i));

    let id=0;
    //获取id信息
    rst.forEach(p=>{
        p.id=groupname+id;
        that.markers.addMarker(p);
    })
  }

  /**
   * 根据geosjon文件名移除markers自行
   */
  removeMarkers(groupname){
      
  }


  loadPolygon(feature) {
    return {};
  }

  azimuth(lonlat1, lonlat2) {
    var lon1 = THREE.MathUtils.degToRad(lonlat1[0]);
    var lat1 = THREE.MathUtils.degToRad(lonlat1[1]);
    var lon2 = THREE.MathUtils.degToRad(lonlat2[0]);
    var lat2 = THREE.MathUtils.degToRad(lonlat2[1]);

    if (lon1 == lon2) {
      if (lat2 >= lat1) {
        return 0;
      } else {
        return 180;
      }
    }
    if (lat1 == lat2) {
      if (lon2 > lon1) {
        return 90;
      } else if (lon2 < lon1) {
        return 270;
      }
    }

    var a = THREE.MathUtils.radToDeg(
      Math.atan(((lon2 - lon1) * Math.cos(lat2)) / (lat2 - lat1))
    );
    if (lat2 > lat1) {
      if (lon2 > lon1) {
        return a;
      } else {
        return a + 360;
      }
    } else {
      return a + 180;
    }
  }

  distance(lonlat1, lonlat2) {
    let lat1 = lonlat1[1];
    let lng1 = lonlat1[0];
    let lat2 = lonlat2[1];
    let lng2 = lonlat2[0];

    var radLat1 = (lat1 * Math.PI) / 180.0;
    var radLat2 = (lat2 * Math.PI) / 180.0;
    var a = radLat1 - radLat2;
    var b = (lng1 * Math.PI) / 180.0 - (lng2 * Math.PI) / 180.0;
    var s =
      2 *
      Math.asin(
        Math.sqrt(
          Math.pow(Math.sin(a / 2), 2) +
            Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)
        )
      );
    s = s * 6378.137; // EARTH_RADIUS;
    s = Math.round(s * 10000) / 10;
    return s;
  }

  coordinatesTransform(lonlat) {
    let azimuth = this.azimuth(this.center, lonlat);
    let distance = this.distance(this.center, lonlat);

    let longitude= azimuth/180.0*Math.PI;
    let latitude= -Math.atan(this.height/distance);

    return [longitude,latitude];
  }

  loadFeature(feature){
    if(feature.geometry.type==='Point')
    {
        return this.loadPoint(feature);
    }else if(feature.geometry.type==='Polyline')
    {
        return this.loadPolyline(feature);
    }else if(feature.geometry.type==='Polyline')
    {
        return this.loadPolygon(feature);
    }
  }

  loadPoint(feature) {
    //默认经纬度，转换后
    //let cc = turf.point();
debugger
    let lng = feature.geometry.coordinates[0];
    let lat = feature.geometry.coordinates[1];

    let rpos=  this.coordinatesTransform([lng,lat]);
    
    let markerForm = {};
    markerForm.image = PIN_RED_URL;
    markerForm.width = 32;
    markerForm.height = 32;
    markerForm.anchor = "bottom center";

    markerForm.latitude = rpos[1];
    markerForm.longitude=rpos[0];

    return markerForm;
  }

  loadPolyline(feature) {
     return {};
  }

}
