<template>
  <!-- 地图放大缩小 -->
  <div></div>
</template>

<script>
import DrawGraphicUtils from "@/utils/cesiumdraw.js";
export default {
  name: "CesiumZoomInOrOut",
  props: {
    titem: { type: Object },
  },
  data() {
    return {
      getDrawGraphicUtils: null,
    };
  },
  methods: {
    //基本方法,以此来处理每个功能的点击响应操作
    onclick(item) {
      this.getDrawGraphicUtils = new DrawGraphicUtils(viewer);
      this.getDrawGraphicUtils[item.name]();
    },
  },
};
</script>
