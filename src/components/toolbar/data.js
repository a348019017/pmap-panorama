import { yunyao1 } from "@/components/timePlayer/yuyao.js";
import { layerJson } from "../../../public/data/layerJson.json";
const toolbarDT = [
  {
    "id": "af66ae8e-129d-4861-ac1b-60efb8ef18a2",
    "name": "baseLayers",
    "title": "基础图层",
    "icon": "",
    "checked": false,
    "component": "BaseLayers.vue",
    "description": "基础图层",
    "hide": false,
    "params": {
      "layerTreeData":layerJson
    },
    "children":[],
   },
   {
    "id": "af66ae8e-129d-4861-ac1b-60efrf1f14r6",
    "name": "LayerIQuery",
    "title": "i查询",
    "icon": "",
    "checked": false,
    "component": "LayerIQuery.vue",
    "description": "i查询",
    "hide": false,
    "params":null,
    "children":[],
    },
    {
      "id": "af66ae8e-129d-4861-ac1b-60efb8ec68a8",
      "name": "areameasure",
      "title": "面积测量",
      "icon": "cemian",
      "checked": false,
      "component": "CesiumMeasureTool.vue",
      "description": "面积测量",
      "hide": false,
      "params": {drawMode:"面积测量"},
      "children":[],
    },
    {
      "id": "af66ae8e-129d-4861-ac1b-60efb8ec5832",
      "name": "lengthmeasure",
      "title": "长度测量",
      "icon": "ceju",
      "checked": false,
      "component": "CesiumMeasureTool.vue",
      "description": "长度测量",
      "hide": false,
      "params": {drawMode:"长度测量"},
      "children":[],
    },
     {
      "id": "af66ae8e-129d-4861-ac1b-60efb8ec6878",
      "name": "trackRoam",
      "title": "卷帘",
      "icon": "juanlian",
      "checked": false,
      "component": "VueCesiumShutter.vue",
      "description": "卷帘",
      "hide": false,
      "params": null
    },
    {
      "id": "af66ae8e-129d-4861-ac1b-60efb8ed6879",
      "name": "flymanager",
      "title": "影像时间轴",
      "icon": "timePlayer",
      "checked": false,
      "component": "ImageTimeLine.vue",
      "description": "影像图层管理",
      "hide": false,
      "params": {
        "timeLineOption":{
          "yunyaoServerUrl":"https://onemapserver.img.net/onemap/tokens/generateToken?username=hnslyj&password=wxyy@20200827&expiration=30&request=getToken",
          "layerList":yunyao1,
          "timeLineWidth":500,
          "defaultNissinChart":false,
          "showTimeTextBottomWidth":50,
          "timeLineBottom":"30px"
        }
      }
    }, 
    {
      "id": "af66ae8e-129d-4861-ac1b-60efb8ed6875",
      "name": "mapswitch",
      "title": "地图风格切换",
      "icon": "",
      "checked": false,
      "component": "CesiumThemeSwitchTool.vue",
      "description": "地图风格切换",
      "hide": false,
      "params": null
    },
    {
      "id": "af66ae8e-129d-4861-ac1b-60efb8ed6876",
      "name": "mapXGAnly",
      "title": "限高分析",
      "icon": "",
      "checked": false,
      "params":{"polygon":{"type":"Feature","properties":{},"geometry":{"type":"Polygon","coordinates":[[[112.56695750635149,28.470394416961657,0],[112.56540889172099,28.468437863393685,0],[112.56917105851095,28.4676087442739,0],[112.57010420177261,28.468528149342944,0],[112.56944417218834,28.470134785989625,0],[112.56866432875786,28.470523705289533,0],[112.56866907268041,28.470528513347684,0],[112.56695750635149,28.470394416961657,0]]]}}},
      "componentDir":true,
      "component": "../CesiumXGAnalysis/CesiumTestXGAnlysis.vue",
      "description": "限高分析",
      "hide": false
    },
    {
      "id": "af66ae8e-129d-4861-ac1b-60efb8ed6679",
      "name": "CesiumDrawTool",
      "title": "绘制面",
      "icon": "",
      "checked": false,
      "component": "CesiumDrawTool.vue",
      "description": "绘制面",
      "hide": false,
      "params": null
    },
    {
      "id": "af66ae8e-129d-4861-ac1b-60efb8ed6979",
      "name": "CesiumTestJJAnlysis",
      "title": "间距分析",
      "icon": "",
      "checked": false,
      "component": "CesiumTestJJAnlysis.vue",
      "description": "间距分析",
      "hide": false,
      "params": null
    },
    {
      "id": "af66ae8e-129d-4861-ac1b-60efb8ec5365",
      "name": "zoomIn",
      "title": "放大",
      "icon": "zoomin",
      "checked": false,
      "component": "CesiumZoomInOrOut.vue",
      "description": "放大",
      "hide": false,
      "params": null
    },
    {
      "id": "af66ae8e-129d-4861-ac1b-60efb8ec5366",
      "name": "zoomOut",
      "title": "缩小",
      "icon": "zoomout",
      "checked": false,
      "component": "CesiumZoomInOrOut.vue",
      "description": "放大",
      "hide": false,
      "params": null
    }
  ];

  export {toolbarDT}


