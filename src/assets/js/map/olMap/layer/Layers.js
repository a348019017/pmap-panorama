/*
 * @$START: =================
 * @Author: 魏青峰
 * @Date: 2021-12-17 10:43:18
 * @company:
 * @LastEditors: WQF
 * @LastEditTime: 2022-11-26 21:09:44
 * @Description:图层构造器
 * @$END: ===================
 */


import {
//   Image as ImageLayer,
  Vector as VectorLayer,
  Tile as TileLayer
} from "ol/layer";
import {
//   ImageStatic,
  Cluster,
  Vector as VectorSource,
//   ImageCanvas as ImageCanvasSource
} from "ol/source";
import GeoJSON from 'ol/format/GeoJSON';
import { get as getProjection } from 'ol/proj';
import WMTS from 'ol/source/WMTS';
import XYZ from 'ol/source/XYZ'
import WMTSTileGrid from 'ol/tilegrid/WMTS';
import { getTopLeft, getWidth } from 'ol/extent';
import gcj02Mecator  from "../gcj02Mecator"
/* ============================wqf- 自定义方法 ============================== */
// import GroupLayers from "./class/GroupLayers";



export default class  {

  constructor(map) {
    this.map = map;
    this.formatGeoJSON = new GeoJSON();
  }
  setMap(map) {
    this.map = map;

  }
  getName() {
    console.log('layers.js');
  }
  /* ============================wqf- 单图层操作 ============================== */
  /**
   * @Author: 魏青峰
   * @param {*} id
   * @return {*}
   * @Description: 获取指定图层
   */
  getLayer(id) {
    if (id) {
      let list = this.map.getLayers().getArray();
      for (const layer of list) {
        // console.log('id', layer.get('id'))
        if (layer.get('id') == id) {
          return layer;
        }
      }
      console.warn('图层:', id, ' 不存在');
    } else {
      console.warn('图层id不能为空');
    }

    return false;
  }

  /**
   * @Author: WQF
   * @param {*} id 图层id，不能为空
   * @return {*}
   * @Description:
   */
  getSource(id) {
    if (id) {
      let layer = this.getLayer(id);
      return layer ? layer.getSource() : false;
    } else {
      console.warn('图层id不能为空');
    }

    return false;
  }
  /**
   * @Author: WQF
   * @param {*} id
   * @return {*}
   * @Description: 刪除指定图层
   */
  removeLayer(id) {
    let layer = this.getLayer(id);
    console.log(id, layer)
    layer ? this.map.removeLayer(layer) : '';
  }
  /**
   * @Author: 魏青峰
   * @param {*} id
   * @return {*}
   * @Description: 清空指定图层
   */
  clearLayer(id) {
    let layer = this.getLayer(id);
    if (layer) {
      let source = layer.getSource();
      source.clear();
      return source;
    }
    console.log(id, '图层不存在')
    return false;
  }

  /**
   * @Author: 魏青峰
   * @param {*} id -图层id
   * @return {*}
   * @Description: 切换指定图层的显隐属性
   */
  switchLayer(id) {
    let layer = this.getLayer(id);
    if (layer) {
      let visible = layer.getVisible();
      layer.setVisible(!visible);
    }
    return layer;
  }
  /**
   * @Author: 魏青峰
   * @param {*} id -图层 id
   * @param {boolean} visible - 是否可见
   * @return {*}
   * @Description: 设置图层是否可见
   */
  setVisible(id, visible) {
    let layer = this.getLayer(id);
    if (layer) {
      layer.setVisible(visible);
    }
  }
  /**
   * @Author: 魏青峰
   * @param {*} id
   * @return {*}
   * @Description: 显示指定图层
   */
  showLayer(id) {
    this.setVisible(id, true)
  }
  /**
   * @Author: 魏青峰
   * @param {*} id
   * @return {*}
   * @Description: 隐藏指定图层
   */
  hideLayer(id) {
    this.setVisible(id, false)
  }
  /* ============================wqf- 图层创建模板 ============================== */

  /**
   * @Author: WQF
   * @param {*} id 图层id
   * @param {Object} options 图层配置参数
   *  options.bSelect : true 开启选择功能后可以被选中；false 不可被选中
   * @return {*}
   * @Description: 添加矢量图层
   */
  addVectorLayer(id, options) {
    let layer = this.getLayer(id);
    if (!layer) {
      layer = new VectorLayer({
        zIndex: 15,
        ...options,
        source: new VectorSource({}),
      });
      layer.set('id', id);
      layer.setProperties({
        ...options
      });
      this.map.addLayer(layer);
    }

    return layer
  }
  /**
   * @Author: WQF
   * @param {*} lyId
   * @param {*} url
   * @param {*} epsg
   * @return {*}
   * @Description:
   */
  fnAddGeoJsonByUrl(lyId, url, options) {
    let layer = this.getLayer(lyId)
    if (!layer) {
      layer = this.addVectorLayer(lyId,options)
      layer.setSource(new VectorSource({
        format: this.formatGeoJSON,
        url
      }))
    }

    return layer
  }
  /**
   * @Author: WQF
   * @param {*} id
   * @param {*} options
   * @return {*}
   * @Description: 添加聚合图层
   */
  addClusterLayer(id, layerOptions, sourceOptions = {}) {
    var layer = new VectorLayer({
      zIndex: 16,
      ...layerOptions,
      source: new Cluster({
        source: new VectorSource({}),
        ...sourceOptions
      }),

    });
    layer.set('id', id);
    layer.setProperties({
      ...layerOptions
    });
    this.map.addLayer(layer);
    return layer
  }
      // 添加瓦片图层
      addTitleLayer(map, url, projection,id) {
        let titleLayer = new TileLayer({
            source: new XYZ({
                projection: projection ? gcj02Mecator : "EPSG:4326",
                url: url
            })
        })
        titleLayer.set('id',id)
        map.addLayer(titleLayer);
        return titleLayer;
    }
    addTitleLayerYunYao(map, url,id) {
        const projection = getProjection('EPSG:3857');
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
                layer: 'sgmc2',
                // matrixSet: 'GoogleMapsCompatible',
                format: 'image/webp',
                projection: gcj02Mecator,
                tileGrid: new WMTSTileGrid({
                    origin: getTopLeft(projectionExtent),
                    resolutions: resolutions,
                    matrixIds: matrixIds,
                }),
                style: 'default',
                wrapX: true,
            }),
        });
        titleLayer.set('id',id)
        map.addLayer(titleLayer);
        return titleLayer;
    }
}
