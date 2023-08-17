
<style scoped>

</style>
<template>
  <div>
  </div>
</template>

<script>
import "@/utils/cesium-measure.js";
//测量Vue封装,不包含UI，但是包含一些逻辑处理,例如点击后的状态修改cheked，操作完成后的处理，以及deactive反向激活的问题等
//包含多种测量方法的封装，通过参数进行指定
export default {
  name: "CesiumMeasureTool",
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
      if(!item.checked) this.deactive();

      if(!item.params)
      {
        item.params={drawMode:'面积测量'};
      }
      if (item.title == '面积测量') {
        this.measure.drawAreaMeasureGraphics({
          clampToGround: this.clampToGround,
          callback: () => { },
        });
      }else if(item.title == '长度测量'){
        this.measure.drawLineMeasureGraphics({
          clampToGround: this.clampToGround,
          callback: () => { },
        });
      }else
      {
        this.measure.drawTrianglesMeasureGraphics({
          clampToGround: this.clampToGround,
          callback: () => { },
        });
      }
    },
    //结束当前的绘制
    deactive: function () {
      this.measure.destroy();
    },
  },
  mounted() {
    //测试加载多个相同组件的情况
    if(!window.viewer) return;
    if (!window.measure) {
      window.measure = new Cesium.Measure(viewer);
    }
    this.measure = window.measure;
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

 