<!--
 * @Author: wumanman
 * @Date: 2023-7-25
 * @LastEditTime: 2023-7-25
 * @FilePath: vueComponentV2\src\components\toolbar\plugins\BaseLayers.vue
 * @Description: 基础图层
-->
<template>
  <div v-show="isShowLayers" class="base-layers-tree">
    <el-tree
      class="tool-layer"
      :data="layerOptions.layerTreeData"
      show-checkbox
      node-key="id"
      :default-expanded-keys="layerOptions.expandedKeys"
      :default-checked-keys="layerOptions.checkedKeys"
      :props="layerOptions.layerProps"
      ref="trees"
      @check="treeCheckChanged"
    ></el-tree>
  </div>
</template>

<script>
import OLFn from "@/utils/olMap";
import { mapHelper } from "@/utils/mapHelper";
export default {
  props: {
    titem: { type: Object },
    // 目录树参数
    layerOptions: {
      type: Object,
      default: () => {
        return {
          //图层目录树
          layerTreeData: [],
          //目录树字段
          layerProps: {
            children: "children",
            label: "label",
          },
          //展开节点集合
          expandedKeys: [],
          //勾选节点集合
          checkedKeys: [],
          mapType: "3D", //地图类型 2D-二维  3D-三维
        };
      },
    },
  },
  data() {
    return {
      isShowLayers: false, //是否显示
      checkListLayers: [], //勾选图层集合
    };
  },
  methods: {
    onclick(item) {
      item.checked = !item.checked;
      this.isShowLayers = item.checked;
    },
    // 图层勾选
    treeCheckChanged(data) {
      this.eventBus.$emit("closeIQueryDialog"); //关闭i查询弹框
      data.isChecked = !data.isChecked;  
      if (data.children) {
        data.children.map((item) => {
          item.isChecked = !item.isChecked;
          this.loadServerUrl(item);
        });
      } else {
        this.loadServerUrl(data);
      }
    },
    loadServerUrl(layerData) {
      let checkFlag = layerData.isChecked;
      if (checkFlag && !layerData.serverUrl) {
        return this.$message({
          message: `${layerData.label}暂无服务地址`,
          type: "warning",
        });
      } else {
        // 截取地址
        let serverUrl = layerData.serverUrl;
        if(serverUrl.includes("/getTile/{z}/{y}/{x}")){
          serverUrl = serverUrl.substring(0,serverUrl.lastIndexOf("/getTile"));
        }else if(serverUrl.includes("/{z}/{y}/{x}")){
          serverUrl = serverUrl.substring(0,serverUrl.lastIndexOf("/{z}"));
        }
        layerData.serverUrl = serverUrl;
        
        this.showHideLayers(layerData, checkFlag);
      }
    },
    // 添加/删除图层
    showHideLayers(layerData, checkFlag) {
      console.log(this.layerOptions);
      let mapType = this.layerOptions.mapType;
      if (checkFlag) {
        let isItem = this.checkListLayers.findIndex(
          (layers) => layers.id === layerData.id
        );
        if (isItem === -1) this.checkListLayers.push(layerData); // checkListLayers没有相同就push

        if (mapType === "3D") {
          mapHelper.loadTypeLayer(layerData); //三维加载
        } else {
          OLFn.addTypeLayers(gisMap2D, layerData); //二维加载
        }
      } else {
        let deleteIndex = this.checkListLayers.findIndex(
          (chedlt) => chedlt.id === layerData.id
        );
        if (deleteIndex !== -1) this.checkListLayers.splice(deleteIndex, 1);//删除图层

        if (mapType === "3D") {
          mapHelper.removeLayer({data:layerData}); //三维删除
        } else {
          OLFn.removeLayerById(layerData.id, gisMap2D); //二维删除
        }
      }
      this.eventBus.$emit("updateCheckLayer", this.checkListLayers); //更新图层数据
    },
  },
};
</script>

<style lang="scss" scoped>
.tool-layer {
  color: #bfe2ff;
  background: rgba(48, 56, 81, 0.93);
  border-radius: 4px;
  padding: 10px;
  width: fit-content;
  :deep(.el-tree-node__label) {
    font-size: 12px;
  }
  :deep(.el-tree-node:focus > .el-tree-node__content) {
    background-color: #537bfd;
  }
  :deep(
      .el-tree-node__content:hover,
      .el-upload-list__item:hover,
      .el-tree-node:focus > .el-tree-node__content
    ) {
    background-color: #537bfd;
  }
}
</style>
