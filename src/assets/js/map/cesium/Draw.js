// const Cesium = Window.Cesium || global.Cesium;
//import * as Cesium from "cesium";
var radiansPerDegree = Math.PI / 180.0; //角度转化为弧度(rad)
var degreesPerRadian = 180.0 / Math.PI; //弧度转化为角度
export default class Draw {
  constructor(viewer, options = {}) {
    this._viewer = viewer;
    this._drawLayer = new Cesium.CustomDataSource("DrawLayer");
    this._viewer.dataSources.add(this._drawLayer);
    this._handlers = null;

    // 默认线的样式
    this.polylineStyle = {
      width: 3,
      color: "#7FFF00",
      opacity: 1,
    };

    // 默认面的样式
    this.polygonStyle = {
      color: "#7FFF00",
      opacity: 0.4,
      outline: true,
      outlineColor: "#7FFF00",
    };

    // 默认label的样式
    options.label = options.label || {};

    // 默认point的样式
    options.point = options.point || {};
    this.pointStyle = this.fnGetStyle({
      size: 8,
      color: "#f00",
      outlineColor: "#fff",
      outlineWidth: 2,
      ...options.point,
    });

    // 去掉entity的默认双击追踪，防止双击结束的时候点击到entity上引起视角跳转
    // this._viewer.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
  }

  /**
   * 根据类型返回样式
   * @param {*} type
   */
  fnGetStyle(pstyle) {
    let style = {
      ...pstyle,
    };
    for (let key in style) {
      switch (key) {
        case "color": {
          style["color"] = Cesium.Color.fromCssColorString(style[key]);
          break;
        }
        case "outlineColor": {
          style["outlineColor"] = Cesium.Color.fromCssColorString(style[key]);
          break;
        }
        case "size": {
          style["pixelSize"] = style[key];
          break;
        }
      }
    }
    return style;
  }

  /**
   * 移除handlers
   */
  removeHandlers() {
    this._handlers && this._handlers.destroy();
    this._handlers = null;
  }

  /**
   * 清除绘制
   */
  clearDraw() {
    // this._handlers && this._handlers.destroy();
    // this._handlers = null;
    this._drawLayer.entities.removeAll();
  }
  /**
   * 销毁
   */
  destroy() {
    this.removeHandlers();
    this.clearDraw();
    // this._viewer.dataSources.remove(this._drawLayer);
  }

  DrawPoint(callBack, options) {
    let _this = this;
    options = options || {};
    debugger
    if (this._viewer && options) {
      this._viewer.scene.globe.depthTestAgainstTerrain = false;
      this._handlers = new Cesium.ScreenSpaceEventHandler(this._viewer.scene.canvas);
      // 绑定左键点击事件
      this._handlers.setInputAction(
        function (movement) {
          // 连续单击或者双击，不处理后面一个点
          // if (_this.isNearPoint(movement)) {
          //   return;
          // }
          // _this._viewer.scene.globe.depthTestAgainstTerrain = false;
          debugger;
          let obj = _this.pickModel(movement.position);
          let objTerrain = _this.pickTerrain(movement.position);
          let cartesianTerrainHeight = objTerrain.height;
          debugger
          if(objTerrain?.height){
          var cartesianModelHeight = objTerrain.height;

          const searchLocalOneHeight = cartesianModelHeight > cartesianTerrainHeight
              ? cartesianModelHeight
              : cartesianTerrainHeight;

          // obj.cartesian.z = searchLocalOneHeight;
            debugger
          var cartographic = Cesium.Cartographic.fromCartesian(objTerrain.cartesian);

          if (objTerrain?.cartesian?.x) {
            this.clearDraw();
            this.addInfoPoint(objTerrain.cartesian);
            console.log("第一步获取点位:"+cartographic.longitude+","+cartographic.latitude);
            callBack && callBack(objTerrain,movement.position);
          }
         }else{
          callBack && callBack("emptyData");
         }
         this._viewer.scene.globe.depthTestAgainstTerrain = false;
        }.bind(this),
        Cesium.ScreenSpaceEventType.LEFT_CLICK
      );
    }
  }
  addInfoPoint(position) {
    var ent_point = new Cesium.Entity();
    ent_point.position = position;
    ent_point.point = {
      ...this.pointStyle,
    };
    this._drawLayer.entities.add(ent_point);
  }
  /**
   * 在模型上取点
   * @param {*} position
   * @returns
   */
  pickModel(position) {
    debugger
    var cartesian = this._viewer.scene.pickPosition(position);
    // var ray = this._viewer.camera.getPickRay(position);
    // var cartesian = this._viewer.scene.globe.pick(ray, this._viewer.scene);
    if (!Cesium.defined(cartesian)) {
      return;
    }

    // 转成成经纬度
    var ellipsoid = this._viewer.scene.globe.ellipsoid;
    // let cartesian = this._viewer.camera.pickEllipsoid(
    //   position,
    //   ellipsoid
    // );
    //  if (!Cesium.defined(cartesian)) {
    //   return;
    // }
    var cartographic = ellipsoid.cartesianToCartographic(cartesian);
    var lat = Cesium.Math.toDegrees(cartographic.latitude);
    var lng = Cesium.Math.toDegrees(cartographic.longitude);
    var height = cartographic.height;
    return { cartesian, lat, lng, height };
  }

  /**
   * 在地形上取点
   * @param {*} position
   * @returns
   */
  pickTerrain(position) {
    var ray = this._viewer.camera.getPickRay(position);
    var cartesian = this._viewer.scene.globe.pick(ray, this._viewer.scene);

    // 转成成经纬度
    var cartographic = Cesium.Cartographic.fromCartesian(cartesian);
    var lat = Cesium.Math.toDegrees(cartographic.latitude);
    var lng = Cesium.Math.toDegrees(cartographic.longitude);
    var height = cartographic.height;
    return { cartesian, lat, lng, height };
  }
  /* ============================wqf-  ============================== */
}
