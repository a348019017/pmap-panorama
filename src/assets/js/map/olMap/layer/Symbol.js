/*
 * @$START: =================
 * @Author: WQF
 * @Date: 2022-04-01 09:39:33
 * @company:
 * @LastEditors: WQF
 * @LastEditTime: 2022-11-02 23:33:07
 * @Description:
 * @$END: ===================
 */

// import Style from 'ol/style/Symbol';
import { Style, Fill, Stroke, Circle, Icon, Text } from "ol/style";

let isArray = function (obj) {
  return toString.call(obj) === "[object Array]";
};
let isJson = function (obj) {
  return toString.call(obj) === "[object Object]";
};

export default class Symbol {
  constructor() {}
  fill(opts) {
    return new Fill({
      color: "rgba(255,255,255,0.4)",
      ...opts,
    });
  }
  stroke(opts) {
    return new Stroke({
      color: "#3399CC",
      width: 1.25,
      ...opts,
    });
  }
  circle(opts = {}) {
    return new Circle({
      radius: 5,
      ...opts,
      fill: this.fill(opts.fill),
      stroke: this.stroke(opts.stroke),
    });
  }
  icon(opts) {
    return new Icon({
      ...opts,
    });
  }
  text(opts = {}) {
    let _this = this;
    return new Text({
      ...opts,
      fill: _this.fill(opts.fill),
      stroke: _this.stroke(opts.stroke),
      backgroundFill: opts.backgroundFill
        ? _this.fill(opts.backgroundFill)
        : null,
      // backgroundFill: opts.backgroundFill ? _this.fill(opts.backgroundFill) : null,
    });
  }
  /* ============================wqf-常用类型  ============================== */
  /**
   * @Author: WQF
   * @param {*} obj
   * @return {Style | *} 点样式
   * @Description: 点样式
   */
  point(obj = {}) {
    var style = new Style({
      ...obj,
      image: obj.icon ? this.icon(obj.icon) : this.circle(obj.circle),
      text: obj.text ? this.text(obj.text) : null,
    });
    /*
    obj = {
      circle: { color: "", width: 1, fill: { color: "" } },
      icon:{}
      text:{}
    };
    */
    return style;
  }

  /**
   * @Author: WQF
   * @param {*} obj
   * @return {*}
   * @Description: 线样式
   */
  line(obj = {}) {
    return new Style({
      ...obj,
      stroke: obj.stroke ? this.stroke(obj.stroke) : null,
      text: obj.text ? this.text(obj.text) : null,
    });
  }
  /**
   * @Author: WQF
   * @param {Object} obj
   * @param {Object} obj.fill 填充属性配置
   * @param {String} obj.fill.color 填充色
   * @param {Object} obj.stroke 描边属性配置
   * @param {String} obj.stroke.color 边框颜色
   * @param {Number} obj.stroke.width  边框宽度
   * @param {Object} obj.text 显示文字标题配置
   * @return {Style}
   * @Description: 面状几何样式
   */
  polygon(
    obj = {
      fill,
      stroke,
      text,
    }
  ) {
    var style = new Style({
      fill: obj.fill ? this.fill(obj.fill) : null,
      stroke: obj.stroke ? this.stroke(obj.stroke) : null,
      text: obj.text ? this.text(obj.text) : null,
    });
    return style;
  }

  /**
   * @Author: WQF
   * @param {Object } symbol 数组或对象
   * @return {*}
   * @Description:复杂样式
   */
  fnSymbol(symbol = {}) {
    let _this = this;
    let style = isArray(symbol) ? symbol : [symbol];
    let list = [];
    for (const item of style) {
      list.push(
        new Style({
          ...item,
          fill: _this.fill(item.fill),
          stroke: _this.stroke(item.stroke),
          image:
            item.icon === null
              ? undefined
              : item.icon
              ? _this.icon(item.icon)
              : _this.circle(item.circle),
          // image: item.icon ? _this.icon(item.icon) :item.circle ? _this.circle(item.circle):undefined,
          text: item.text ? _this.text(item.text) : null,
        })
      );
    }
    return list;
  }
}

let st = [
  {
    fill: {
      color: "",
    },
    image: {
      icon: {
        src: "",
        scale: "",
      },
      circle: {
        fill: {
          color: "",
        },
        radius: "",
      },
    },
    stroke: {
      color: "",
      width: "",
    },
    text: {},
  },
];

// const vector = new VectorLayer({
//   source: source,
//   style: {
//     'fill-color': 'rgba(255, 255, 255, 0.2)',
//     'stroke-color': '#ffcc33',
//     'stroke-width': 2,
//     'circle-radius': 7,
//     'circle-fill-color': '#ffcc33',
//   },
// });
