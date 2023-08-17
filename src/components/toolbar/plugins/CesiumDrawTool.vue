
<style scoped>

</style>
<template>
  <div>
  </div>
</template>

<script>
import DrawGraphicUtils from  "@/utils/cesiumdraw";
import {pointsToGeojson} from "../../../utils/mapHelper"
//绘制功能的Vue组件封装，包含多种绘制操作通过params去指定
export default {
  name: "CesiumDrawTool",
  extends: "",
  components: {},
  props: {
    titem: { type: Object },
  },
  computed: {},
  methods: {
    //基本方法,以此来处理每个功能的点击响应操作
    onclick: function (item) { 
      item.checked = !item.checked;
      if(item.checked) 
      {
         this.drawtool.drawPolygons(this.drawComplete)
      }else
      {
         this.drawtool.clearDrawEntities();
      }
    },
    //结束当前的绘制
    deactive: function () {
      this.drawtool.clearDrawEntities();
    },
    drawComplete:function(dt){
       debugger
       let rst=pointsToGeojson(dt);  
    }
  },
  mounted() {
    //测试加载多个相同组件的情况
    if (!window.drawtool) {
      window.drawtool = new DrawGraphicUtils(viewer);
    }
    this.drawtool = window.drawtool;
  },
  created() { },
  data() {
    return {
      
    };
  },
  watch: {
     
  },
};
</script>

 