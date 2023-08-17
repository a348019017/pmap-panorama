<script  >
import {photos} from "@/assets/qindex.js"
//import * as THREE from  "three"
//import  { PanoramaViewer} from "@/utils/panorama.js"
//import  "../dist/index.js.umd"
import  "../dist/index.js.umd"
import  "../dist/style.css"


export default {
  components: {  },
  mounted() {
      let testbaseurl="/pano/"
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

<template>
  <div id="app" style="display:flex;width:100%;height:100%;">
    
    
  </div>
</template>

<style scoped>




</style>
