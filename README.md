
## @pmap-cesium/panorama
 <a href="">
    <img src="https://raster.shields.io/npm/v/@pmap-cesium/panorama">
  </a>
   <a href="">
    <img src="https://img.shields.io/npm/dm/@pmap-cesium/panorama">
  </a>


## 依赖
THREE.JS,photo-sphere-viewer 4.7.3

## 主要功能特性

### 瓦片全景数据加载
数据经过处理后，通过索引文件直接加载显示，支持瓦片全景图的加载方式，进一步降低加载时效
### 在线POI标注加载
在线加载POI数据在全景球上展示，目前支持天地图的POI接口
### 手动标注功能
手动标注线、面、图标、文字等（独立坐标系数据）
### 测量功能
面积测量功能已实现，测量结果误差较大仅供参考示意；
### 矢量数据加载
支持加载GeoJSON格式数据，WGS84参考系


## 调试

demo
```````````````````````````````````
npm run dev
```````````````````````````````````
sdk
```````````````````````````````````
npm run build2
```````````````````````````````````

## 安装和使用
```````````````````````````````````
cnpm install @pmap-cesium/panorama --save
```````````````````````````````````

```````````````````````````````````
<script  >
import {photos} from "@/assets/qindex.js"    //索引文件，可通过服务获取
//import * as THREE from  "three"           //这里再html中引用THREE不用再此处import
//import  { PanoramaViewer} from "@/utils/panorama.js"
//import  "../dist/index.js.umd"
import  "../dist/index.js.umd"              //引用全景封装的库
import  "../dist/style.css"                 //引用全景封装的库


export default {
  components: {  }, 
  mounted() {
      let testbaseurl="/pano/"            //存放全景数据的服务地址
      this.pviewer=new MyLib.PanoramaViewer("app",{
          baseUrl:testbaseurl
      });
      //获取元数据的信息取第二条测试加载
      let firstphotogroup=photos[1];
      //默认加载图片组的第一个图片
      this.pviewer.loadData(firstphotogroup);

  },
  data() {
    return { 
    }
  }

}
</script>
````````````````````````````````````


## API

new(div,options)

loadData(metadata)

