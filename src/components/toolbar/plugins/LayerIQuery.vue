<!--
 * @Author: wumanman
 * @Date: 2023-7-25
 * @LastEditTime: 2023-7-25
 * @FilePath: vueComponentV2\src\components\toolbar\plugins\LayerIQuery.vue
 * @Description: i查询
-->
<template>
  <iQuery ref="iQueryRef" :checkListLayers="checkListLayers" />
</template>

<script>
import iQuery from "@/components/iSelect/iQuery.vue";
export default {
  components: {
    iQuery,
  },
  props: {
    titem: { type: Object },
    // //查询图层组
    // checkListLayers:{
    //   type:Array,
    //   default:()=>[]
    // }
  },
  data() {
    return {
      checkListLayers: [],
    };
  },
  created() {
    this.addListen(); //事件监听
  },
  methods: {
    onclick(item) {
      if (this.checkListLayers.length < 1)
        return this.$message.warning("请选择图层");
      item.checked = !item.checked;
      this.$refs["iQueryRef"].fnLoadIQuery(item.checked, gisMap2D, "2D");
    },
    //更新图层列表
    updateCheckLayer(checkListLayers) {
      this.checkListLayers = checkListLayers;
    },
    addListen() {
      this.eventBus.$on("updateCheckLayer", this.updateCheckLayer); //更新图层列表
    },
    removeListen() {
      this.eventBus.$off("updateCheckLayer", this.updateCheckLayer); //更新图层列表
    },
  },
  destroyed() {
    this.removeListen(); //销毁监听
  },
};
</script>
