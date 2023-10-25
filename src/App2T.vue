<script>
import {photos} from "@/assets/qindex.js"
//import * as THREE from  "three"
import  { PanoramaViewer} from "@/utils/panorama.js"
//import  "../dist/index.js.umd"
//import  "../dist/index.js.umd"
import  "../dist/style.css"
import toolbar from "./components/toolbar/toolbar2.vue";
import { toolbarDT } from "./components/toolbar/data"


export default {
  components: { toolbar},
  mounted() {
      let testbaseurl="/pano/"
      this.pviewer=new PanoramaViewer("app",{
          baseUrl:testbaseurl
      });
      
      window.pviewer=this.pviewer;
      //获取元数据的信息取第二条测试加载
      let firstphotogroup=photos[1];
      
      //默认加载图片组的第一个图片
      this.pviewer.loadData(firstphotogroup);
      
      this.toolBarData = toolbarDT;
  },
  data() {
    return { 
      toolBarData:[],
    }
  }

}
</script>

<template>
  <div>
    <div id="app" style="display:flex;width:100%;height:900px;">
     
  </div>
  <toolbar style="position: absolute;right: 200px;top:10px" :toolBarData="toolBarData"></toolbar>
  
  </div>
 
</template>

<style scoped>




</style>
