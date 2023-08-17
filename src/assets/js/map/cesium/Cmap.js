/*
 * @$START: =================
 * @Author: WQF
 * @Date: 2022-11-22 16:46:43
 * @company:
 * @LastEditors: WQF
 * @LastEditTime: 2023-01-11 15:34:41
 * @Description:
 * @$END: ===================
 */
import * as Cesium from "cesium";
import Geom from "./Geom";
import measureDistance from "@/components/Map/measureMap2";
export default class {
  constructor(el) {
    let viewer = this.initMap(el);
    this.viewer = viewer;
    this.scene = viewer.scene;
    this.camera = viewer.camera;
    this.Global = { viewer, scene: this.scene, camera: this.camera };
    this.initTool(viewer);
  }
  initMap(el) {
    // Cesium.Ion.defaultAccessToken='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI2MjM4ODFiOC00OTFiLTRjOGEtYmRmNy00ZTIzMmNkYTIzOWQiLCJpZCI6MTIwMzU3LCJpYXQiOjE2NzI4OTQ3MDB9.VhwO_sDGB-uU0r2OT5oILAxzmWp5CpVsUcJtJVFayaA';
    const viewer = new Cesium.Viewer( el||"cesiumContainer", {
      showRenderLoopErrors: false,
      timeline: false,
      animation: false,
      homeButton: false,
      imageryProvider:false,
      selectionIndicator: false,
      navigationHelpButton: false,
      navigationInstructionsInitiallyVisible: false,
      // infoBox: false, //控制是否显示属性窗口
      vrButton: false,
      fullscreenButton: false,
      geocoder: false, //显示地名查询
      sceneModePicker: false,
      baseLayerPicker: false,
      infoBox: false, //  false 设置为 cesium的一些实体默认点击 不显示infobox
      shouldAnimate: true,
    });

    viewer.scene.globe.baseColor = Cesium.Color.BLACK;
    viewer.cesiumWidget.creditContainer.style.display = "none";

    return viewer;
  }

  initTool(viewer) {
    // 监听鼠标移入事件
    this.Global.handler = new Cesium.ScreenSpaceEventHandler(
      this.viewer.scene.canvas
    );
    this.Global.geom = new Geom(viewer)
    // 测量工具
    this.measureTool = new measureDistance(this.viewer);
  }
  // 初始化视野
  flyTo(opts) {
    opts = {
      lon: 112.153953,
      lat: 29.65766,
      height: 100000,
      heading: 0.0,
      pitch: -25.0,
      roll: 0.0,
      ...opts,
    };
    this.viewer.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(
        opts.lon,
        opts.lat,
        opts.height
      ),
      oridntation: {
        heading: Cesium.Math.toRadians(opts.heading),
        pitch: Cesium.Math.toRadians(opts.pitch),
        roll: opts.roll,
      },
    });
  }
  //   放大
  zoomIn() {
    // viewer 为 Viewer 对象
    let position = this.viewer.camera.position;
    let cameraHeight =
      this.viewer.scene.globe.ellipsoid.cartesianToCartographic(
        position
      ).height;
    // 每次缩小 20 倍，参数可改
    let moveRate = cameraHeight / 20.0;
    this.viewer.camera.moveForward(moveRate);
  }
  //   缩小
  zoomOut() {
    // viewer 为 Viewer 对象
    let position = this.viewer.camera.position;
    let cameraHeight =
      this.viewer.scene.globe.ellipsoid.cartesianToCartographic(
        position
      ).height;
    // 每次缩小 20 倍，参数可改
    let moveRate = cameraHeight / 20.0;
    this.viewer.camera.moveBackward(moveRate);
  }
//   全屏
  fullToScreen(flag) {
    if (flag) {
      Cesium.Fullscreen.requestFullscreen(document.body);
    } else {
      Cesium.Fullscreen.exitFullscreen();
    }
  }
  switchViewer() {
    if (this.viewer.scene.mode == Cesium.SceneMode.SCENE3D)
      this.viewer.scene.mode = Cesium.SceneMode.SCENE2D;
    else this.viewer.scene.mode = Cesium.SceneMode.SCENE3D;
  }
}
