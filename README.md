
## @pmap-cesium/panorama
 <a href="">
    <img src="https://raster.shields.io/npm/v/@pmap-cesium/panorama">
  </a>
   <a href="">
    <img src="https://img.shields.io/npm/dm/@pmap-cesium/panorama">
  </a>


## 依赖
THREE

## 调试

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

