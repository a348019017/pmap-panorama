/*
 * @$START: =================
 * @Author: WQF
 * @Date: 2022-11-23 22:36:37
 * @company:
 * @LastEditors: WQF
 * @LastEditTime: 2022-12-30 14:27:33
 * @Description:
 * @$END: ===================
 */
import * as Cesium from "cesium";
import BaseObject from "./BaseObject.js";
import transf from "./transf.js";
import * as turf from '@turf/turf'

export default class extends BaseObject {
  constructor(viewer) {
    super(viewer);
  }

  test() {
    let coll = {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          geometry: "...",
        },
      ],
    };
    this.loadGeojson(coll);
  }

  removeDataSource(name, destroy) {
    let dataSourceCollection = this.viewer.dataSources;
    let list = dataSourceCollection.getByName(name);
    for (let i = 0; i < list.length; i++) {
      const dataSource = list[i];
      dataSource && dataSourceCollection.remove(dataSource, destroy || true);
    }
  }
  //价值FeatureCollection
//   loadGeojson(name, collection,opts,isShow) {
//     // var polygon = transf.wkt2GeoJson(wkt);
//     opts = {
//       polygon: {
//         fill: false,
//         outline: false,
//         outlineColor: Cesium.Color.BLUE,
//       },
//       polyline: {
//         width: 3,
//         material: new Cesium.Color(2 / 255, 167 / 255, 240 / 255, 1),
//         // clampToGround: true,
//       },
//       ...opts,
//     };
//     this.removeDataSource(name, true);
//     var source = Cesium.GeoJsonDataSource.load(collection);
//     debugger;
//    return  source.then(
//       function (data) {
//         debugger;
//         data.name = name;
        
//         var entities = data.entities.values;
//         let labelStyle = {
//           style: Cesium.LabelStyle.FILL_AND_OUTLINE,
//           outlineWidth: 2,
//           verticalOrigin: Cesium.VerticalOrigin.CENTER,
//           horizontalOrigin: Cesium.HorizontalOrigin.CENTER, 
//           pixelOffset: new Cesium.Cartesian2(0, 0),
//           color: '#fff',
//           backgroundColor: '#000',
//           showBackground: true,
//           font: "16px sans-serif",
//         }
//         for (var i = 0; i < entities.length; i++) {
//           var entity = entities[i];
//           entity.fDistcode = entity._properties._fDistcode._value;
//           entity._id=`${name}${entity.fDistcode}`;
//           if (entity.polygon) {
//             Object.assign(entity.polygon, {
//               ...opts?.polygon,
//             });
//             entity.polyline = {
//               positions: entity.polygon.hierarchy._value.positions,
//               ...opts?.polyline,
//             };
//             var pointsArray = entity.polygon.hierarchy.getValue(Cesium.JulianDate.now()).positions;

//             // var centerpoint = Cesium.BoundingSphere.fromPoints(pointsArray).center;
//             // entity.position = centerpoint;
//             entity.position = Cesium.Cartesian3.fromDegrees(entity._properties.fLnt._value, entity._properties.fLat._value,0);
//             entity.label = { 
//               text:entity._name,
//               ...labelStyle
//             } 
//           } else if (entity.polyline) {
//             Object.assign(entity.polyline, {
//               ...opts?.polyline,
//             });
//             var pointsArray = entity.polyline.hierarchy.getValue(Cesium.JulianDate.now()).positions;
//             var centerpoint = Cesium.BoundingSphere.fromPoints(pointsArray).center;
//             entity.position = centerpoint;
//             entity.label = { 
//               text:entity._name,
//               ...labelStyle
//             } 
//           }
//         }
//         // var pointsArray = entity.polyline.hierarchy.getValue(Cesium.JulianDate.now()).positions;
//         // var centerpoint = Cesium.BoundingSphere.fromPoints(pointsArray).center;
//         // entity.position = centerpoint;
//         // entity.label = 1112
//         console.log({data})
//         console.log(this.viewer.dataSources)
        
//         this.viewer.dataSources.add(data);
//         // global.viewer.dataSources.raiseToTop(source)
//         if(isShow!=undefined&&isShow){
//           this.viewer.camera.flyTo({
//             // destination: Cesium.Cartesian3.fromDegrees(112.053953, 27.05766, 10000000),
//             destination:{ 
//               x: -2464557.2676887685, 
//               y: 6274707.902514838, 
//               z: 3449063.2924635466
//             },
//             oridntation: {
//               heading: Cesium.Math.toRadians(0.0),
//               putch: Cesium.Math.toRadians(-25.0),
//               roll: 0.0,
//             },
//           });
//         }else {
//           this.viewer.flyTo(data);
//         }
//         return data
//       }.bind(this)
//     );
//   }
// }

loadGeojson(name, collection,opts,isShow) {
  // var polygon = transf.wkt2GeoJson(wkt);
  this.viewer.scene.globe.depthTestAgainstTerrain = false;
  opts = {
    polygon: {
      fill: false,
      outline: false,
      outlineColor: Cesium.Color.BLUE,
    },
    polyline: {
      width: 3,
      material: new Cesium.Color(2 / 255, 167 / 255, 240 / 255, 1),
      // clampToGround: true,
    },
    ...opts,
  };
  this.removeDataSource(name, true);
  var source = Cesium.GeoJsonDataSource.load(collection);
 return  source.then(
    function (data) {
      data.name = name;
      var entities = data.entities.values;
      let labelStyle = {
        style: Cesium.LabelStyle.FILL_AND_OUTLINE,
        outlineWidth: 2,
        verticalOrigin: Cesium.VerticalOrigin.CENTER,
        horizontalOrigin: Cesium.HorizontalOrigin.CENTER, 
        pixelOffset: new Cesium.Cartesian2(20, -20),
        color: '#fff',
        backgroundColor: '#000',
        showBackground: true,
        font: "16px sans-serif",
      }
      let labelContainer = [];
      for (var i = 0; i < entities.length; i++) {
        var entity = entities[i];
        entity.fDistcode = entity._properties._fDistcode._value;
        entity._id=`${name}${entity.fDistcode}`+i;
        if (entity.polygon) {
          Object.assign(entity.polygon, {
            ...opts?.polygon,
          });
          entity.polyline = {
            positions: entity.polygon.hierarchy._value.positions,
            ...opts?.polyline,
          };
          // var pointsArray = entity.polygon.hierarchy.getValue(Cesium.JulianDate.now()).positions;
          // var centerpoint = Cesium.BoundingSphere.fromPoints(pointsArray).center;
          // entity.position = centerpoint;
          let fLnt = entity._properties.fLnt._value;
          let fLat = entity._properties.fLat._value;


          if(entity._name=="岳阳市"){
            // fLat -= 0.5;
            fLnt -= 0.1;
          }else if(entity._name=="常德市"){
            fLat -= 0.1;
            // fLnt -= 0.1;
          }else if(entity._name=="娄底市"){
            fLat -= 0.1;
            fLnt -= 0.1;
            // fLnt -= 0.4;
          }else if(entity._name=="益阳市"){
            // fLat -= 0.2;
            fLat -= 0.3;
            fLnt -= 0.3;
          }
          else if(entity._name=="湘潭市"){
            fLat -= 0.1;
            fLnt -= 0.2;
            // fLat -= 0.2;
            // fLnt -= 0.5;
          }
          else if(entity._name=="株洲市"){
            // fLat -= 0.3;
            // fLnt += 0.1;
            fLnt -= 0.1;
          }
          // else if(entity._name=="邵阳市"){
          //   fLat -= 0.25;
          //   fLnt -= 0.7;
          // }
          // else if(entity._name=="永州市"){
          //   fLat -= 0.9;
          //   fLnt += 0.1;
          // }
          // else if(entity._name=="长沙市"){
          //   fLat -= 0.1;
          // }
          // else if(entity._name=="衡阳市"){
          //   fLat -= 0.2;
          // }

          entity.position = Cesium.Cartesian3.fromDegrees(fLnt,fLat,0);
          if(labelContainer.indexOf(entity._name)<0){
          entity.label = { 
            text:entity._name,
            ...labelStyle
          } 
          labelContainer.push(entity._name);
        }
        } else if (entity.polyline) {
          Object.assign(entity.polyline, {
            ...opts?.polyline,
          });
          var pointsArray = entity.polyline.hierarchy.getValue(Cesium.JulianDate.now()).positions;
          var centerpoint = Cesium.BoundingSphere.fromPoints(pointsArray).center;
          entity.position = centerpoint;
          if(labelContainer.indexOf(entity._name)<0){
          entity.label = { 
            text:entity._name,
            ...labelStyle
          } 
          labelContainer.push(entity._name);
        }
        }
      }
      console.log({data})
      this.viewer.dataSources.add(data);
      // if(isShow!=undefined&&isShow){
      //   this.viewer.camera.flyTo({
      //     destination:{ 
      //       x: -2464557.2676887685, 
      //       y: 6274707.902514838, 
      //       z: 3449063.2924635466
      //     },
      //     oridntation: {
      //       heading: Cesium.Math.toRadians(0.0),
      //       putch: Cesium.Math.toRadians(-25.0),
      //       roll: 0.0,
      //     },
      //   });
      // }else {
      //   this.viewer.flyTo(data);
      // }
      return data
    }.bind(this)
  );
}
}