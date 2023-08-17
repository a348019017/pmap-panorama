<template>
  <!-- 影像时间轴 -->
  <timeLine
    class="timePlayerVue"
    v-if="showTimePlayer"
    :style="{ bottom: timeLineBottom }"
    :timeLineOption="timeLineOption"
    ref="timePlayerVue"
    @change="fnChangeYYimage"
    style=""
  ></timeLine>
</template>

<script>
import { GdTilingScheme } from "@/utils/createGdMap";
import http from "@/apis/http";
import timeLine from "@/components/timePlayer/timeLine.vue";
export default {
  name: "flymanager",
  props: {
    titem: { type: Object },
  },
  components: {
    timeLine,
  },
  data() {
    return {
      showTimePlayer: false, //是否显示
      layerMap: {}, //加载图层
      timeLineOption: {}, //影像时间轴参数
      yunyaoServerUrl: "", //云遥地图token
      itemYYlayers: null, //当前加载影像图层
      WMTSLayerList: {}, //图层集
      timeLineBottom: "30px", //距离底部距离
    };
  },
  methods: {
    //基本方法,以此来处理每个功能的点击响应操作
    onclick(item) {
      let { params } = item;
      item.checked = !item.checked;
      if(params.timeLineOption){
        let {yunyaoServerUrl,timeLineBottom} = params.timeLineOption;
        this.timeLineOption = params.timeLineOption;
        this.yunyaoServerUrl = yunyaoServerUrl;
        this.timeLineBottom = timeLineBottom;
      }      
      this.showTimePlayer = item.checked;
      if (!this.showTimePlayer) {
        this.fnStopAndClearPlayer();
      } else {
        this.$nextTick(() => {
          this.$refs["timePlayerVue"].isShowTimeTip = false;
          this.$refs["timePlayerVue"].fnRest();
        });
      }
    },

    // 清除影像
    fnStopAndClearPlayer() {
      this.$refs.timePlayerVue.fnStopPlayer();
      this.removeTimePlayerLayer();
    },

    // 加载影像
    fnChangeYYimage(item) {
      this.removeTimePlayerLayer(); //删除影像
      if (!item) return;
      item.id = item.id || item.layerName;
      item.layerType = "YYImage";
      if (item.addYYLayerFun) {
        this[item.addYYLayerFun]({ data: item });
      } else {
        this.addYYLayer({ data: item });
      }
      this.itemYYlayers = item;
    },

    //获取云遥地图token
    async getYunyaoToken() {
      const ret = await http({
        url: this.yunyaoServerUrl,
      });
      window.yunyaoMapToken = ret;
    },

    async addYYLayer(layerJson) {
      if (!window.yunyaoMapToken) {
        await this.getYunyaoToken();
      }
      const layer = new Cesium.WebMapTileServiceImageryProvider({
        url: layerJson.data.url + "?token=" + window.yunyaoMapToken,
        layer: layerJson.data.layerName,
        style: "default",
        format: "image/webp",
        tileMatrixSetID: "EGSP:3857",
        tileWidth: 256,
        tileHeight: 256,
        tilingScheme: new GdTilingScheme(),
        tileMatrixLabels: [
          "0",
          "1",
          "2",
          "3",
          "4",
          "5",
          "6",
          "7",
          "8",
          "9",
          "10",
          "11",
          "12",
          "13",
          "14",
          "15",
          "16",
          "17",
          "18",
          "19",
          "20",
        ],
        minimumLevel: 1,
        maximumLevel: layerJson.maximumLevel || 18,
      });
      this.layerMap[layerJson.data.id] = layer;
      let imageLayer = viewer.imageryLayers.addImageryProvider(layer);
      this.WMTSLayerList[layerJson.data.id] = imageLayer;

      return imageLayer;
    },

    // 删除影像
    removeTimePlayerLayer() {
      if (this.itemYYlayers) this.removeLayer({ data: this.itemYYlayers });
    },

    // 图层删除
    removeLayer(param) {
      let id = param.data.id;

      // 针对三维数据
      if (param.data.layerType === "3DTiles") {
        viewer.scene.primitives.remove(layer);
        delete this.layerMap[id];
        return;
      }

      let layer = this.layerMap[id];

      let imageLayer = {};
      viewer.imageryLayers._layers.forEach((element) => {
        if (element.imageryProvider._layer == param.data.layerName) {
          imageLayer = element;
        }
      });
      if (imageLayer) {
        viewer.imageryLayers.remove(imageLayer);
        delete this.layerMap[id];
      }
      let label = this.layerMap["_label" + id];
      if (label) {
        viewer.imageryLayers.remove(label);
        delete this.layerMap["_label" + id];
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.timePlayerVue {
  position: fixed;
  left: 50%;
  transform: translateX(-50%);
}
</style>
