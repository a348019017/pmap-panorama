import * as turf from "@turf/turf";
import * as THREE from "three";



const TEMP_ID="temp_marker"

/**
 * 绘制功能封装，依赖PSV库
 * @ignore
 */
export class PhotoSphereViewerDrawPolygonTool {
  //构造函数,这里地形的传入
  constructor(_callback, viewer, option) {
    this.viewer = viewer;
    this._isdraw = false;

    this.markerForm.id = "marker-" + Math.random().toString(36).slice(2);
    this.markerForm.type = type;
    this.markerForm.orientation = "front";
    this.markerForm.anchor = "center center";
    this.markerForm.tooltip.position = "top center";

    this.markerForm.polygon = [];
    this.markerForm.svgStyle.fill = "#E84B3C";
    this.markerForm.svgStyle.fillOpacity = 0.5;
    this.markerForm.svgStyle.strokeWidth = 2;
    this.markerForm.svgStyle.stroke = "#C0382B";

    this.markers = this.viewer.getPlugin(this.MarkersPlugin);
  }

  completeMarker() {
    this.markers.addMarker(this.markerForm);
  }

  //构造一个polygon对象传出,这里场景是EPSG:4978参考系，默认传出为EPSG4326参考系的数据，同理加载也需要额外处理
  toGeojson() {
    //每三个坐标构成一个数组
    let coords = [];
    for (let index = 0; index < this.pointsArray.length; index += 3) {
      coords.push(
        this.prjcoordinates(
          this.pointsArray[index] + this.center[0],
          this.pointsArray[index + 1] + this.center[1],
          this.pointsArray[index + 2] + this.center[2]
        )
      );
    }

    //再次添加前一个点
    coords.push(
      this.prjcoordinates(
        this.pointsArray[0] + this.center[0],
        this.pointsArray[1] + this.center[1],
        this.pointsArray[2] + this.center[2]
      )
    );

    //默认传出的顺序为逆时针
    if (turf.booleanClockwise(coords)) {
      coords = coords.reverse();
    }
    //将首位
    let polygon = turf.polygon([coords]);
    //console.log(JSON.stringify(polygon));
    return polygon;
  }

  //转换参考系，默认为EPSG:4326
  prjcoordinates(x, y, z) {
    //取viewer的参考系
    let refcrs = viewer.referenceCrs;
    let tmpcoord = new itowns.Coordinates(refcrs, x, y, z);
    const coordinates = tmpcoord.as("EPSG:4326");
    return [coordinates.longitude, coordinates.latitude, coordinates.altitude];
  }

  /* 鼠标按下事件 */
  onMouseDown(data) {
    const yaw = Math.round(data.yaw * 1000) / 1000;
    const pitch = Math.round(data.pitch * 1000) / 1000;
    this.markerForm.position = { yaw, pitch };

    this.markerForm.polygon.push([yaw, pitch]);
    switch (this.markerForm.polygon.length) {
      case 1:
        this.markers.addMarker({
          id: TEMP_ID,
          hideList: true,
          position: { yaw, pitch },
          anchor: "center center",
          circle: Math.max(1, this.markerForm.svgStyle.strokeWidth / 2),
          svgStyle: {
            fill: this.markerForm.svgStyle.strokeWidth
              ? this.markerForm.svgStyle.stroke
              : this.markerForm.svgStyle.fill,
          },
        });
        break;
      case 2:
        this.markers.removeMarker(TEMP_ID, false);
        this.markers.addMarker({
          id: TEMP_ID,
          hideList: true,
          polyline: this.markerForm.polygon,
          svgStyle: {
            strokeWidth: Math.max(1, this.markerForm.svgStyle.strokeWidth),
            stroke: this.markerForm.svgStyle.strokeWidth
              ? this.markerForm.svgStyle.stroke
              : this.markerForm.svgStyle.fill,
          },
        });
        break;
      default:
        this.markers.removeMarker(TEMP_ID, false);
        this.markers.addMarker({
          ...this.getMarkerConfig(),
          id: TEMP_ID,
          hideList: true,
        });
        break;
    }
  }

  /**
   * 双击结束绘制
   * @param {*} data
   */
  onDblClick(data) {
    if (this._isdraw) {
      this.completeMarker();
    }
  }

  /* 鼠标移动事件 */
  onMouseMove(event) {}

  active() {
    //这里和ori相互冲突，绘制的时候不能平移界面
    // this.dom.addEventListener('mousedown', this.onMouseDown.bind(this), false);
    // this.dom.addEventListener('mousemove', this.onMouseMove.bind(this), false);

    this.viewer.addEventListener("click", ({ data }) => this.onMouseDown(data));
    this.viewer.addEventListener("dblclick", ({ data }) =>
      this.onDblClick(data)
    );

    this.dom.style.cursor = "crosshair";
    this.window_mouse = true;
    //this.scene.add(this.meshpolygon);
  }

  deactive() {
    //移除
    if (this.meshpolygon) {
      this.scene.remove(this.meshpolygon);
    }
    this.pointsArray = [];
    this.center = undefined;
    //meshpolygon = undefined;
    // this.dom.removeEventListener('mousemove', onMouseMove, false)
    // this.dom.removeEventListener('mousedown', onMouseDown, false)
    this.dom.removeEventListener("pointermove", this._onMouseMove, false);
    this.dom.removeEventListener("pointerdown", this._onMouseDown, false);
    this.dom.style.cursor = "default";
  }
}

export function startdraw() {}

export function enddraw() {}
