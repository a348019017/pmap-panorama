import { MarkersPlugin } from "photo-sphere-viewer/dist/plugins/markers";
import { cloneDeep } from 'lodash';
import * as _ from "lodash";
import * as turf from "@turf/turf"
let TEMP_ID_1 = 'marker-temp';
let id=0;
let TEMP_ID;

const EARTH_RADIUS=6371000;
/**
 * 计算面积
 */
export function caculateArea(panoData,position,center){
    
}

/**
 * 坐标转换，本地坐标转换成84坐标
 */
export function coordinatesLocalTransformWGS84(panoData,position,center){
     //return [center[0],center[1]]

     let realtiveHeight=center.height;
     let latitude=position.latitude;
     //let distance=realtiveHeight/Math.tan(latitude);
     //let offsetlatitude=panoData.poseHeading;
    
}


/**
 * 绘制帮助类，
 */
export class DrawUtil
{
  /**
   * 
   * @param {*} viewer  PSV对象
   */
    constructor(viewer){
      this.containerViewer=viewer;
        this.viewer=viewer.PSV;
        //this.markerForm={};

        this.markerForm  = {
            saved      : false,
            id         : null,
            type       : null,
            longitude  : null,
            latitude   : null,
            image      : null,
            imageLayer : null,
            html       : null,
            polygonRad : null,
            polylineRad: null,
            width      : null,
            height     : null,
            orientation: null,
            anchor     : null,
            listContent: null,
            content    : null,
            tooltip    : {
              content : null,
              position: null,
            },
            style      : {
              fontSize: null,
              color   : null,
            },
            svgStyle   : {
              fill       : null,
              stroke     : null,
              strokeWidth: null,
            },
          };

        this.viewer.on('click',  (e, data) => this.onClick(data));
        this.viewer.on('dblclick', (e, data)  => this.onDblClick(data));

        this.markers = this.viewer.getPlugin(MarkersPlugin);
        this.editMarkers =false;

        this.PIN_RED_URL = 'https://photo-sphere-viewer-data.netlify.app/assets/pictos/pin-red.png';

    }


    /**
     * image，imageLayer，html，polygonRad，polylineRad，开启绘制
     * @param {*} type 
     */
    newMarker(type) {
        this.editMarkers=true;
        this.cancelMarker();
        this.markerForm.id = 'marker-' + Math.random().toString(36).slice(2);
        this.markerForm.type = type;
        this.markerForm.orientation = 'front';
        this.markerForm.anchor = 'center center';
        this.markerForm.tooltip.position = 'top center';

        TEMP_ID=TEMP_ID_1+id++;

        switch (type) {
          case 'image':
            this.markerForm.image = this.PIN_RED_URL;
            this.markerForm.width = 32;
            this.markerForm.height = 32;
            this.markerForm.anchor = 'bottom center';

            break;
          case 'imageLayer':
            this.markerForm.imageLayer = this.TARGET_URL;
            this.markerForm.width = 120;
            this.markerForm.height = 120;
            break;
          case 'html':
            this.markerForm.html = 'Test content';
            this.markerForm.style.fontSize = '15px';
            this.markerForm.style.color = '#222F3D';
            break;
          case 'polygonRad':
            this.markerForm.polygonRad = [];
            this.markerForm.svgStyle.fill = '#E84B3C';
            this.markerForm.svgStyle.strokeWidth = 2;
            this.markerForm.svgStyle.stroke = '#C0382B';
            break;
          case 'polylineRad':
            this.markerForm.polylineRad = [];
            this.markerForm.svgStyle.strokeWidth = 5;
            this.markerForm.svgStyle.stroke = '#27AF60';
            break;
        }
    }


    callbackShowArea(positions){

      let that=this;
      let realpos=positions.map(i=>that.transformCoordinate({latitude:i[1],longitude:i[0]},false));
      realpos.push(realpos[0]);
      let areapolygon=turf.polygon([realpos]);
      let areaValue=turf.area(areapolygon);
      //let center=turf.center(areapolygon);

      let meansx= _.meanBy(positions,i=>i[0]);
      let meansy=_.meanBy(positions,i=>i[1]);

      debugger
      if(this.markers.markers["my_area"])
      {
        this.markers.removeMarker("my_area",false);
      }
      this.markers.addMarker({
        id:'my_area',
        html : `面积${areaValue.toFixed(2)}平方米`,
        fontSize : '20px',
        color : '#FF0000',
        longitude: meansx,
        latitude: meansy,
      })
    }

    /**
     * 
     */
    transformCoordinate(coord,isradis=true){
      
      let lat=coord.latitude;
      let lng=coord.longitude;
      let center=this.containerViewer.getCenter();
      
      let panoData=this.containerViewer.getPoseData();
      let rheight=this.containerViewer.getRHeight();

      let distance=rheight/Math.tan(Math.abs(lat));
      let offsetlng=panoData.poseHeading/180*Math.PI;

      //方位角
      let offsetAzmu=lng-offsetlng;
      let offsetlat=distance*Math.cos(offsetAzmu);
       offsetlng=distance*Math.sin(offsetAzmu);

      offsetlat=offsetlat/EARTH_RADIUS;
      offsetlng=offsetlng/(EARTH_RADIUS*Math.sin(center[1]/180*Math.PI));
      
      if(isradis){
        return [center[0]/180*Math.PI+offsetlng,center[1]/180*Math.PI+offsetlat]
      }else
      {
        return [(center[0]/180*Math.PI+offsetlng)/Math.PI*180,(center[1]/180*Math.PI+offsetlat)/Math.PI*180]
      }
      
    }


    onClick(data) {
        
        if (!this.editMarkers || !this.markerForm.type) {
            return;
          }
  
          const longitude = Math.round(data.longitude * 1000) / 1000;
          const latitude = Math.round(data.latitude * 1000) / 1000;

          let rs=this.transformCoordinate(data);

          Object.assign(this.markerForm, { longitude, latitude });
  
          switch (this.markerForm.type) {
            case 'image':
            case 'imageLayer':
            case 'html':
              if (!this.markerForm.saved) {
                this.markers.addMarker({
                  ...cloneDeep(this.markerForm),
                  longitude,
                  latitude,
                });

                this.markers.addMarker({
                  id:TEMP_ID+'_1',
                  html : `经度${(rs[0]*180/Math.PI).toFixed(4)}纬度${(rs[1]*180/Math.PI).toFixed(4)}`,
                  fontSize : '20px',
                  color : '#FF0000',
                  longitude,
                  latitude,
                })

                this.cancelMarker();
              }
              else {
                this.markers.updateMarker({
                  id: this.markerForm.id,
                  longitude,
                  latitude,
                });
              }
              break;
  
            case 'polygonRad':
              if (this.markerForm.saved) {
                return;
              }
              this.markerForm.polygonRad.push([longitude, latitude]);
              switch (this.markerForm.polygonRad.length) {
                case 1:
                  this.markers.addMarker({
                    id      : TEMP_ID,
                    hideList: true,
                    longitude,
                    latitude,
                    anchor  : 'center center',
                    circle  : Math.max(1, this.markerForm.svgStyle.strokeWidth / 2),
                    svgStyle: {
                      fill: this.markerForm.svgStyle.strokeWidth ? this.markerForm.svgStyle.stroke : this.markerForm.svgStyle.fill,
                    },
                  });
                  break;
                case 2:
                  this.markers.removeMarker(TEMP_ID, false);
                  this.markers.addMarker({
                    id         : TEMP_ID,
                    hideList   : true,
                    polylineRad: this.markerForm.polygonRad,
                    svgStyle   : {
                      strokeWidth: Math.max(1, this.markerForm.svgStyle.strokeWidth),
                      stroke     : this.markerForm.svgStyle.strokeWidth ? this.markerForm.svgStyle.stroke : this.markerForm.svgStyle.fill,
                    },
                  });
                  break;
                default:
                  this.markers.removeMarker(TEMP_ID, false);
                  this.markers.addMarker({
                    ...cloneDeep(this.markerForm),
                    id      : TEMP_ID,
                    hideList: true,
                  });

                  this.callbackShowArea(this.markerForm.polygonRad);

                  break;
              }
              break;
  
            case 'polylineRad':
              if (this.markerForm.saved) {
                return;
              }
              this.markerForm.polylineRad.push([longitude, latitude]);
              switch (this.markerForm.polylineRad.length) {
                case 1:
                  this.markers.addMarker({
                    id      : TEMP_ID,
                    hideList: true,
                    longitude,
                    latitude,
                    anchor  : 'center center',
                    circle  : Math.max(1, this.markerForm.svgStyle.strokeWidth / 2),
                    svgStyle: {
                      fill: this.markerForm.svgStyle.stroke,
                    },
                  });
                  break;
                default:
                  this.markers.removeMarker(TEMP_ID, false);
                  this.markers.addMarker({
                    ...cloneDeep(this.markerForm),
                    id      : TEMP_ID,
                    hideList: true,
                  });
                  break;
              }
              break;
          }
    }

    onDblClick() {
        if (!this.editMarkers || !this.markerForm.type) {
            return;
          }
  
          this.markerForm[this.markerForm.type].pop();
          this.completeMarker();
    }


    completeMarker() {
        if (!this.markerForm.saved &&
          (this.markerForm.type === 'polygonRad' || this.markerForm.type === 'polylineRad') &&
          this.markerForm[this.markerForm.type].length >= (this.markerForm.type === 'polygonRad' ? 3 : 2)) {
          this.markers.addMarker(cloneDeep(this.markerForm));
        }

        this.cancelMarker();
      }


      /**
       * 取消绘制
       */
      cancelMarker() {
        
        if (!this.markerForm.saved &&
          (this.markerForm.type === 'polygonRad' || this.markerForm.type === 'polylineRad') &&
          this.markerForm[this.markerForm.type].length > 0) {
          this.markers.removeMarker(TEMP_ID);
        }

        Object.keys(this.markerForm)
          .forEach(key => {
            if (key === 'tooltip' || key === 'style' || key === 'svgStyle') {
              Object.keys(this.markerForm[key])
                .forEach(key2 => this.markerForm[key][key2] = null);
            }
            else {
              this.markerForm[key] = null;
            }
          });
        this.markerForm.saved = false;
      }



   

}

