import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import XYZ from "ol/source/XYZ";
import { Vector as VectorLayer, Heatmap as HeatmapLayer } from "ol/layer";
import { Vector as VectorSource, Cluster } from "ol/source";
import GeoJSON from "ol/format/GeoJSON";
import Feature from "ol/Feature";
import { Icon, Fill, Stroke, Style, Text, Circle as CircleStyle } from "ol/style";
import { LinearRing, Point } from "ol/geom";
import { fromExtent } from "ol/geom/Polygon";
import { fromLonLat, transformExtent } from "ol/proj";
import { defaults as defaultControls } from "ol/control";
import WMTS from "ol/source/WMTS";
import WMTSTileGrid from "ol/tilegrid/WMTS";
import { get as getProjection } from "ol/proj";
import { getTopLeft, getWidth } from "ol/extent";
import "ol/ol.css";
import gcj02Mecator from "./gcj02Mecator.js";
import treeKingImg from "@/assets/imgs/icons/2.1.png";
// import treeParkImg from '@/assets/imgs/icons/3.1.png'
import gs1 from "@/assets/imgs/icons/gs1.png";
import gs2 from "@/assets/imgs/icons/gs2.png";
import gs3 from "@/assets/imgs/icons/gs3.png";
import levelMaxImg from "@/assets/imgs/icons/7.1.png";
import gushu from "@/assets/imgs/icons/gushu.png";
import shuwang from "@/assets/imgs/icons/shuwang.png";
import mm from "@/assets/imgs/icons/mm.png";
const OLFn = {
  // 初始化地图
  init(params) {
    const map = new Map({
      layers: [
        new TileLayer({
          source: new XYZ({
            url: `https://t3.tianditu.gov.cn/img_w/wmts?service=WMTS&version=1.0.0&request=GetTile&tilematrix={z}&layer=img&style=default&tilerow={y}&tilecol={x}&tilematrixset=w&format=tiles&tk=5e5949f7e96e8a136ef36a6594f18cdf`,
          }),
        }),
      ],
      target: params.target,
      controls: defaultControls({
        zoom: false,
        rotate: false,
        attribution: false,
      }),
      view: new View({
        // center: fromLonLat([116, 40]),
        center: [12414182.634029679, 3175670.568346872],
        zoom: 7,
        minZoom: 2,
        maxZoom: 18,
      }),
    });
    window.map = map;
    return map;
  },
  // 放大缩小地图
  zoom(params) {
    const { map, zoom } = params;
    const view = map.getView();
    if (zoom == "in") {
      view.animate({ zoom: view.getZoom() + 1, duration: 500 });
    } else if (zoom == "out") {
      view.animate({ zoom: view.getZoom() - 1, duration: 500 });
    }
  },
  // 根据geojson的范围做定位
  zoomByGeoJson(params) {
    const { map, geojson } = params;
    const view = map.getView();
    const source = new VectorSource({
      features: new GeoJSON().readFeatures(geojson, {
        dataProjection: "EPSG:4326",
        featureProjection: "EPSG:3857",
      }),
    });
    // const [width, height] = map.getSize()
    // view.fit(source.getExtent(), { padding: [height, width, height, width - 410], duration: 1000 })
    view.fit(source.getExtent(), { padding: [150, 450, 150, 390], duration: 1000 });
  },
  // 设置为中心点
  toCenter(params) {
    const { map, lonLat } = params;
    let xy = fromLonLat(lonLat);
    map.getView().setCenter(xy);
  },
  toExtent(params) {
    const { map, layer } = params;
    const view = map.getView();
    let extent = [12110113.444927854, 2831713.568196721, 12718251.823131505, 3519627.5684970235];
    if (layer) {
      extent = layer.getSource().getExtent();
    }
    view.fit(extent, { padding: [150, 450, 150, 390], duration: 1000 });
  },
  /* ============================wqf-图层类  ============================== */
  // 通过geojson绘制范围
  drawAreaByGeoJson(params, id) {
    const { geojson, map } = params;
    const vectorSource = new VectorSource({
      features: new GeoJSON().readFeatures(geojson, {
        dataProjection: "EPSG:4326",
        featureProjection: "EPSG:3857",
      }),
    });
    const vectorLayer = new VectorLayer({
      source: vectorSource,
      style: function (feature) {
        let name = feature.get("fName");
        return new Style({
          text: new Text({
            font: "18px sans-serif",
            fill: new Fill({
              color: "#fff",
            }),
            stroke: new Stroke({
              color: "#000",
              width: 1.5,
            }),
            text: name,
          }),
          stroke: new Stroke({
            color: "rgba(115, 211, 250, 1)",
            width: 2,
          }),
          fill: new Fill({
            color: "rgba(255, 255, 0, 0)",
          }),
        });
      },
      zIndex: 2,
    });
    vectorLayer.set("id", id || "drawAreaByGeoJson");
    map.addLayer(vectorLayer);
    return vectorLayer;
  },
  // 通过geojson绘制文字
  drawPointTextByGeoJson(params, id) {
    const { geojson, map } = params;
    const vectorSource = new VectorSource({
      features: new GeoJSON().readFeatures(geojson, {
        dataProjection: "EPSG:4326",
        featureProjection: "EPSG:3857",
      }),
    });
    const vectorLayer = new VectorLayer({
      source: vectorSource,
      zIndex: 10,
      style: function (feature) {
        // let name = feature.get('name');
        let num = feature.get("num");
        return [
          new Style({
            text: new Text({
              font: "40px YouSheBiaoTiHei",
              fill: new Fill({
                color: "#fff",
              }),
              stroke: new Stroke({
                color: "#000",
                width: 3.5,
              }),
              text: num,
              offsetY: 30,
            }),
          }),
        ];
      },
    });
    vectorLayer.set("id", id || "drawAreaByGeoJson");
    map.addLayer(vectorLayer);
    return vectorLayer;
  },
  // 热力图
  heatMap(params) {
    const { geojson, map, radius, blur } = params;
    const vectorSource = new VectorSource({
      features: new GeoJSON().readFeatures(geojson, {
        dataProjection: "EPSG:4326",
        featureProjection: "EPSG:3857",
      }),
    });
    // 创建热力图
    const heatMap = new HeatmapLayer({
      source: vectorSource,
      // 热力图半径，数值越大，点越融合
      radius: radius,
      // 热力图聚焦，数值越小越聚焦，越大越散
      blur: blur,
      // 权重回调函数
      weight: function (f) {
        var weight = (f && f.get("weight")) || 1;
        weight = parseFloat(weight);
        return weight;
      },
    });
    map.addLayer(heatMap);
    return heatMap;
  },
  // 清理图层
  removeLayer(params) {
    let { layer, map } = params;
    map.removeLayer(layer);
    layer = null;
  },
  // 根据geojosn绘制点图层
  drawPointByGeoJson(params, id) {
    const { geojson, map } = params;
    const vectorSource = new VectorSource({
      features: new GeoJSON().readFeatures(geojson, {
        dataProjection: "EPSG:4326",
        featureProjection: "EPSG:3857",
      }),
    });
    const style = (feature) => {
      const properties = feature.getProperties();
      const { type, num, layerName } = properties;
      let imageStyle = "";
      let textStyle = "";
      if (layerName === "gsmm") {
        // 古树名木
        let text = "";
        // let color = [45, 98, 174, 0.5];
        if (type == "①一级") {
          // color = [32, 175, 38, 1];
          text = "Ⅰ";
          imageStyle = new Icon({
            anchor: [0.5, 33],
            anchorXUnits: "fraction",
            anchorYUnits: "pixels",
            src: gs1,
          });
        }
        if (type == "②二级") {
          // color = [48, 163, 167, 1];
          text = "Ⅱ";
          imageStyle = new Icon({
            anchor: [0.5, 33],
            anchorXUnits: "fraction",
            anchorYUnits: "pixels",
            src: gs2,
          });
        }
        if (type == "③三级") {
          // color = [46, 113, 177, 1];
          text = "Ⅲ";
          imageStyle = new Icon({
            anchor: [0.5, 33],
            anchorXUnits: "fraction",
            anchorYUnits: "pixels",
            src: gs3,
          });
        }
        // imageStyle = new CircleStyle({
        //     radius: 15,
        //     stroke: new Stroke({
        //         color: 'rgba(255, 255, 255, 1)',
        //         width: 2,
        //     }),
        //     fill: new Fill({
        //         color: color,
        //     }),
        // });
        if (type == "④名木") {
          imageStyle = new Icon({
            anchor: [0.5, 33],
            anchorXUnits: "fraction",
            anchorYUnits: "pixels",
            src: mm,
          });
        }
        textStyle = new Text({
          font: "12px sans-serif",
          fill: new Fill({
            color: [255, 255, 255, 1],
          }),
          text: num,
        });
      }
      if (layerName === "gsmmtj") {
        // 古树名木统计
        imageStyle = new CircleStyle({
          radius: 30,
          stroke: new Stroke({
            color: "rgba(103, 145, 211, 1)",
            width: 2,
          }),
          fill: new Fill({
            color: [45, 98, 174, 0.5],
          }),
        });
        textStyle = new Text({
          font: "16px YouSheBiaoTiHei",
          fill: new Fill({
            color: [255, 255, 255, 1],
          }),
          text: num,
        });
      }
      if (layerName === "sdsw") {
        // 十大树王
        imageStyle = new Icon({
          anchor: [0.5, 33],
          anchorXUnits: "fraction",
          anchorYUnits: "pixels",
          src: shuwang,
        });
        textStyle = new Text({
          font: "10px sans-serif",
          fill: new Fill({
            color: [255, 255, 255, 1],
          }),
          text: num,
        });
      }
      return new Style({
        image: imageStyle,
        text: textStyle,
      });
    };

    const vectorLayer = new VectorLayer({
      source: vectorSource,
      style,
      zIndex: 3,
    });
    vectorLayer.set("id", id || "drawAreaByGeoJson");
    map.addLayer(vectorLayer);
    return vectorLayer;
  },
  // 根据geojosn绘制点图层
  drawClusterByGeoJson(params, id) {
    const { geojson, map } = params;
    const vectorSource = new VectorSource({
      features: new GeoJSON().readFeatures(geojson, {
        dataProjection: "EPSG:4326",
        featureProjection: "EPSG:3857",
      }),
    });
    const clusterSource = new Cluster({
      distance: 240,
      source: vectorSource,
    });
    const style = (feature) => {
      var size = feature.get("features").length;
      let icon = gushu;
      let text = "数量" + size.toString();
      return new Style({
        image: new Icon({
          anchor: [0.5, 33],
          anchorXUnits: "fraction",
          anchorYUnits: "pixels",
          src: icon,
        }),
        text: new Text({
          offsetY: -18,
          offsetX: 20,
          textAlign: "left",
          font: "12px sans-serif",
          fill: new Fill({
            color: [255, 255, 255, 1],
          }),
          backgroundFill: new Fill({
            color: [32, 180, 38, 0.5],
          }),
          backgroundStroke: new Stroke({
            color: [41, 196, 37, 1],
            width: 2,
          }),
          padding: [3, 3, 3, 3],
          text: text,
        }),
      });
    };

    const vectorLayer = new VectorLayer({
      source: clusterSource,
      style,
      zIndex: 3,
    });
    vectorLayer.set("id", id || "drawAreaByGeoJson");
    map.addLayer(vectorLayer);
    return vectorLayer;
  },
  // 通过坐标打图标点
  drawPointByCenter(params, id) {
    const { data, map } = params;
    const vectorSource = new VectorSource();
    const pointsLayer = new VectorLayer({
      zIndex: 10,
      source: vectorSource,
      style: new Style({
        image: new Icon({
          anchor: [0.5, 36],
          anchorXUnits: "fraction",
          anchorYUnits: "pixels",
          src: treeKingImg,
        }),
      }),
    });
    const iconFeature = new Feature({
      geometry: new Point(fromLonLat([data.fLnt, data.fLat])),
      eventPointData: data,
    });
    pointsLayer.getSource().addFeature(iconFeature);
    pointsLayer.set("id", id || "pointsLayer");
    map.addLayer(pointsLayer);
    return pointsLayer;
  },
  // 绑定点击事件
  events(params) {
    const { map, callback } = params;

    // 鼠标在图标处变为手型
    map.on("pointermove", function (e) {
      const pixel = map.getEventPixel(e.originalEvent);
      const hit = map.hasFeatureAtPixel(pixel);
      map.getTarget().style.cursor = hit ? "pointer" : "move";
    });

    // 绑定地图点击事件
    map.on("click", (e) => {
      const obj = map.forEachFeatureAtPixel(e.pixel, function (feature, layer) {
        return { feature, layer };
      });
      const { feature, layer } = obj;
      if (!feature) return;
      callback(feature, layer, e.coordinate);
    });
  },
  moveEnd(params) {
    const { map, callback } = params;
    map.on("moveend", (e) => {
      callback(e);
    });
  },
  // 绘制掩膜功能
  drawShadeByGeoJson(params, id) {
    const { map, geojson } = params;
    const style = new Style({
      fill: new Fill({
        color: "rgba(0, 0, 0, 0.5)",
      }),
      stroke: new Stroke({
        width: 0,
        color: "rgba(0,0,0,0)",
      }),
    });
    const source = new VectorSource();
    const layer = new VectorLayer({
      source,
      style,
      zIndex: 1,
    });
    map.addLayer(layer);
    // 生成遮罩数据源
    const features = new GeoJSON().readFeatures(geojson);
    const polygon = this.erase(features);
    layer.getSource().addFeature(polygon);
    layer.set("id", id || "drawShadeByGeoJson");
    return layer;
  },
  // 生成遮罩范围
  erase(features) {
    const extent = transformExtent([-180, -90, 180, 90], "EPSG:4326", "EPSG:3857");
    const polygonRing = fromExtent(extent);
    for (let n = 0; n < features.length; n++) {
      const part = this.getCoordsGroup(features[n]);
      if (!part) continue;
      for (let i = 0; i < part.length; i++) {
        const linearRing = new LinearRing(part[i]);
        linearRing.transform("EPSG:4326", "EPSG:3857");
        polygonRing.appendLinearRing(linearRing);
      }
    }
    return new Feature({
      geometry: polygonRing,
    });
  },
  // 处理每种类型坐标
  getCoordsGroup(feature) {
    let geom = feature.getGeometry();
    let group = []; //
    let geomType = geom.getType();
    if (geomType === "LineString") {
      group.push(geom.getCoordinates());
    } else if (geomType === "MultiLineString") {
      group = geom.getCoordinates();
    } else if (geomType === "Polygon") {
      group = geom.getCoordinates();
    } else if (geomType === "MultiPolygon") {
      geom.getPolygons().forEach((poly) => {
        let coords = poly.getCoordinates();
        group = group.concat(coords);
      });
    } else {
      console.log("暂时不支持的类型");
    }
    return group;
  },
  // 添加瓦片图层
  addTitleLayer(map, url, projection) {
    let titleLayer = new TileLayer({
      source: new XYZ({
        projection: projection ? gcj02Mecator : "EPSG:4326",
        url: url,
      }),
    });
    map.addLayer(titleLayer);
    return titleLayer;
  },
  addTitleLayerYunYao(map, url) {
    const projection = getProjection("EPSG:3857");
    const projectionExtent = projection.getExtent();
    const size = getWidth(projectionExtent) / 256;
    const resolutions = new Array(19);
    const matrixIds = new Array(19);
    for (let z = 0; z < 19; ++z) {
      // generate resolutions and matrixIds arrays for this WMTS
      resolutions[z] = size / Math.pow(2, z);
      matrixIds[z] = z;
    }
    let titleLayer = new TileLayer({
      source: new WMTS({
        url: url,
        layer: "sgmc2",
        // matrixSet: 'GoogleMapsCompatible',
        format: "image/webp",
        projection: gcj02Mecator,
        tileGrid: new WMTSTileGrid({
          origin: getTopLeft(projectionExtent),
          resolutions: resolutions,
          matrixIds: matrixIds,
        }),
        style: "default",
        wrapX: true,
      }),
    });
    map.addLayer(titleLayer);
    return titleLayer;
  },
};

export default OLFn;
