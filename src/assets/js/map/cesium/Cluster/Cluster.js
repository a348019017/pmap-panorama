/*
 * @$START: =================
 * @Author: WQF
 * @Date: 2023-02-03 18:08:24
 * @company:
 * @LastEditors: WQF
 * @LastEditTime: 2023-02-06 17:38:05
 * @Description:
 * @$END: ===================
 */
import * as Cesium from "cesium";
// import { Cesium } from "@/assets/Emap/CMap/Namespace";

/**
 * @description: 点聚合功能效果
 * @param {*} viewer
 * @return {*}
 */
export function fromGeojson(viewer, url) {
  // new Cesium.GeoJsonDataSource().load("./data/sz_poi.geojson").then(dataSource => {
  new Cesium.GeoJsonDataSource().load(url).then((dataSource) => {
    viewer.dataSources.add(dataSource);

    // 设置聚合参数
    dataSource.clustering.enabled = true;
    dataSource.clustering.pixelRange = 60;
    dataSource.clustering.minimumClusterSize = 2;

    // foreach用于调用数组的每个元素，并将元素传递给回调函数。
    dataSource.entities.values.forEach((entity) => {
      // 将点拉伸一定高度，防止被地形压盖
      entity.position._value.z += 50.0;
      // 使用大小为64*64的icon，缩小展示poi
      entity.billboard = {
        image: "./icons/poi.png",
        width: 32,
        height: 32,
      };
      entity.label = {
        text: "POI",
        font: "bold 15px Microsoft YaHei",
        // 竖直对齐方式
        verticalOrigin: Cesium.VerticalOrigin.CENTER,
        // 水平对齐方式
        horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
        // 偏移量
        pixelOffset: new Cesium.Cartesian2(15, 0),
      };
    });

    // 添加监听函数
    dataSource.clustering.clusterEvent.addEventListener(function (clusteredEntities, cluster) {
      // 关闭自带的显示聚合数量的标签
      cluster.label.show = false;
      cluster.billboard.show = true;
      cluster.billboard.verticalOrigin = Cesium.VerticalOrigin.BOTTOM;

      // 根据聚合数量的多少设置不同层级的图片以及大小
      let length = clusteredEntities.length;
      if (length >= 20) {
        cluster.billboard.image = combineIconAndLabel("./icons/cluster_4.png", length, 64);
        cluster.billboard.width = 72;
        cluster.billboard.height = 72;
      } else if (length >= 12) {
        cluster.billboard.image = combineIconAndLabel("./icons/cluster_3.png", length, 64);
        cluster.billboard.width = 56;
        cluster.billboard.height = 56;
      } else if (length >= 8) {
        cluster.billboard.image = combineIconAndLabel("./icons/cluster_2.png", length, 64);
        cluster.billboard.width = 48;
        cluster.billboard.height = 48;
      } else {
        cluster.billboard.image = combineIconAndLabel("./icons/cluster_1.png", length, 64);
        cluster.billboard.width = 40;
        cluster.billboard.height = 40;
      }
    });
  });
}

/**
 * @description: 将图片和文字合成新图标使用（参考Cesium源码）
 * @param {*} url：图片地址
 * @param {*} label：文字
 * @param {*} size：画布大小
 * @return {*} 返回canvas
 */
function combineIconAndLabel(url, label, size) {
  // 创建画布对象
  let canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  let ctx = canvas.getContext("2d");

  let promise = new Cesium.Resource.fetchImage(url).then((image) => {
    // 异常判断
    try {
      ctx.drawImage(image, 0, 0);
    } catch (e) {
      console.log(e);
    }

    // 渲染字体
    // font属性设置顺序：font-style, font-variant, font-weight, font-size, line-height, font-family
    ctx.fillStyle = Cesium.Color.WHITE.toCssColorString();
    ctx.font = "bold 20px Microsoft YaHei";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(label, size / 2, size / 2);

    return canvas;
  });
  return promise;
}
export function fromPoint(viewer, list, name, isClear) {
  let dataSource = getDataSourceByName(viewer, "myData");
  if (!dataSource) {
    dataSource = new Cesium.CustomDataSource(name || "myData");
    viewer.dataSources.add(dataSource);
    // 设置聚合参数
    dataSource.clustering.enabled = true;
    dataSource.clustering.pixelRange = 60;
    dataSource.clustering.minimumClusterSize = 2;
  }
  if (isClear) {
    dataSource.entities.removeAll();
  }

  // var dataSource = new Cesium.CustomDataSource('myData');
  for (const item of list) {
    dataSource.entities.add({
        // 将点拉伸一定高度，防止被地形压盖
      position: Cesium.Cartesian3.fromDegrees(item.lon, item.lat, 50),
      //    billboard : {
      //        image : 'image.png'
      //    },
      label: {
        text: "POI",
        font: "bold 15px Microsoft YaHei",
        // 竖直对齐方式
        verticalOrigin: Cesium.VerticalOrigin.CENTER,
        // 水平对齐方式
        horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
        // 偏移量
        pixelOffset: new Cesium.Cartesian2(15, 0),
      },
    });
  }


  // 添加监听函数
  dataSource.clustering.clusterEvent.addEventListener(function (clusteredEntities, cluster) {
    // 关闭自带的显示聚合数量的标签
    cluster.label.show = false;
    cluster.billboard.show = true;
    cluster.billboard.verticalOrigin = Cesium.VerticalOrigin.BOTTOM;

    // 根据聚合数量的多少设置不同层级的图片以及大小
    let length = clusteredEntities.length;
    if (length >= 20) {
      cluster.billboard.image = combineIconAndLabel2("rgba(12,56,67,0.8)", length, 64);
      cluster.billboard.width = 72;
      cluster.billboard.height = 72;
    } else if (length >= 12) {
      cluster.billboard.image = combineIconAndLabel2("rgba(12,56,67,0.8)", length, 64);
      cluster.billboard.width = 56;
      cluster.billboard.height = 56;
    } else if (length >= 8) {
      cluster.billboard.image = combineIconAndLabel2("rgba(12,56,67,0.8)", length, 64);
      cluster.billboard.width = 48;
      cluster.billboard.height = 48;
    } else {
      cluster.billboard.image = combineIconAndLabel2("rgba(12,56,67,0.8)", length, 64);
      cluster.billboard.width = 40;
      cluster.billboard.height = 40;
    }
  });
}

/**
 * @description: 将图片和文字合成新图标使用（参考Cesium源码）
 * @param {*} url：图片地址
 * @param {*} label：文字
 * @param {*} size：画布大小
 * @return {*} 返回canvas
 */
function combineIconAndLabel2(color, label, size) {
  // 创建画布对象
  let canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  let ctx = canvas.getContext("2d");

  ctx.beginPath();
  ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2, false);
  ctx.closePath();
  //cans.fillStyle = 'orange';
  ctx.fillStyle = color || "rgba(12,56,67,0.8)";
  ctx.fill();
  //   标注
  if (label) {
    // 渲染字体
    // font属性设置顺序：font-style, font-variant, font-weight, font-size, line-height, font-family
    // ctx.fillStyle = Cesium.Color.WHITE.toCssColorString();
    ctx.fillStyle = "#fff";
    ctx.font = "bold 20px Microsoft YaHei";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(label, size / 2, size / 2);
  }

  return canvas;
}

function getDataSourceByName(viewer, name) {
  let coll = viewer.dataSources;
  for (let i = 0; i < coll.length; i++) {
    let dataSource = coll.get(i);
    if (name == dataSource.name) return dataSource;
  }
  return false;
}
