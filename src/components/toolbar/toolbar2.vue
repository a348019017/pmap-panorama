
<style lang="scss" scoped>
.el-dropdown-link {
  cursor: pointer;
  color: #00dad8;
}

.el-icon-arrow-down {
  font-size: 12px;
}

.themsVertical {
  .menuBoxContainer {
    // position: absolute;
    // top: 80px;
    // right: 10px;
    z-index: 9;

    .eeIconfont {
      font-size: 48px;
    }
  }

  .menuBoxContent {
    height: calc(100vh - 190px);
    overflow: auto;
  }

  .menuListCol {
    background: rgba(13, 71, 161, 0.7);
    margin: 5px;
    padding: 5px;
    text-align: center;
  }

  .menuListCol .toolTitle {
    font-size: 20px;
  }

  .menuBoxMore {
    background: rgba(13, 71, 161, 0.7);
    color: #fff;
    padding: 5px;
  }

  .menuBoxMoreBox {
    text-align: center;
    color: #00dad8;
    padding: 0;
    margin: 0;
  }

  .menuBoxMore .toolTitle {
    font-size: 20px;
  }

  .menuBoxMore:hover {
    color: #fff !important;
    cursor: pointer;
  }

  .menuBoxList .fgx {
    color: #fff;
    padding: 0px;
    cursor: default;
  }

  .menuBoxList .sceneSelect {
    margin: 0px;
  }

  .menuBoxList span:hover {
    color: #fff;
    cursor: pointer;
  }

  .menuBoxList .checked {
    color: #fff;
  }

  .menuBoxContent::-webkit-scrollbar {
    /*滚动条整体样式*/
    width: 1px;
    /*高宽分别对应横竖滚动条的尺寸*/
    height: 1px;
  }

  .menuBoxContent::-webkit-scrollbar-thumb {
    /*滚动条里面小方块*/
    border-radius: 1px;
    box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    background: rgba(13, 71, 161, 0.1);
  }

  .menuBoxContent::-webkit-scrollbar-track {
    /*滚动条里面轨道*/
    box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    border-radius: 1px;
    background: rgba(13, 71, 161, 0.1);
  }
}

// 水平
.themsHorizontal {
  .menuBoxContainer {
    // position: absolute;
    // top: 10px;
    // right: 16%;
    z-index: 9;

    .eeIconfont {
      font-size: 24px;
    }
  }

  .menuBoxMore {
    display: none;
    background: rgba(13, 71, 161, 0.7);
    color: #fff;
    padding: 5px;

    .toolTitle {
      font-size: 20px;
    }

    .menuBoxMoreBox {
      text-align: center;
      color: #00dad8;
      padding: 0;
      margin: 0;
    }
  }

  .menuBoxMore:hover {
    color: #fff !important;
    cursor: pointer;
  }

  .menuBoxContent {
    // width: calc(100% - 190px);
    overflow: auto;
    display: flex;
  }

  .menuBoxList {
    margin: 0;
    padding: 0;
    color: #BFE2FF;
    text-align: center;

    .menuListCol {
      display: inline-block;
      background: linear-gradient(146deg,#1c2857,#05091f);
      border: 1px solid hsla(0,0%,100%,.3);
      box-shadow: 3px 4px 5px 0 rgba(5,6,12,.5);
      border-radius: 4px;
      margin: 5px;
      padding: 5px;
      text-align: center;
      cursor: pointer;

      .toolTitle {
        display: none;
        font-size: 12px;
      }
    }

    .fgx {
      color: #fff;
      padding: 0px;
      cursor: default;
    }

    .sceneSelect {
      margin: 0px;
    }

    span:hover {
      color: #fff;
      cursor: pointer;
    }

    .checked {
      color: #fff;
    }
  }
}
</style>
<template>
  <div style="z-index: 99;">
    <div :class="themsDefault">
    <div class="menuBoxContainer">
      <div class="menuBoxMore" @click="toolBarClick()">
        
        <el-tooltip class="item" effect="dark" content="收缩/展开" placement="left">
          <p class="menuBoxMoreBox">
            <span :class="['eeIconfont', isShowToolBarIcon]"></span><br /><span class="toolTitle">{{ isShowToolBarText
            }}</span>
          </p>
        </el-tooltip>
      </div>
      <transition name="el-zoom-in-top">
        <div class="menuBoxContent" v-show="isShowToolBar">
          <p class="menuBoxList">
            <el-tooltip v-for="(item, i) in toolBarData" v-show="!item.hide"  effect="dark" :key="i"
              :content="item.title" placement="top">
              <div class="menuListCol">     
                <img
                 v-if="item.icon"
                 :src="getToolbarsImg(item.icon)"
                 :class="[
                  'eeIconfont',
                  item.checked ? 'checked' : '',
                ]" @click="menuClick(item, i)"
                alt="" />   
                <span
                  v-else
                 :class="[
                  'eeIconfont',
                  'iconxuanqumoxing',
                  item.checked ? 'checked' : '',
                ]" @click="menuClick(item, i)"></span><br />
                <!-- <span :class="['toolTitle', item.checked ? 'checked' : '']">{{
                    item.title
                }}</span> -->
              </div>
            </el-tooltip>
          </p>
        </div>
      </transition>
    </div>
  </div>
  <component v-for="item in toolBarData" :key="item.name" ref="customcom" :is="getcomps(item)" :titem="item" :layerOptions="layerOptions">
    </component>
  </div>
</template>

<script>

//这里没有把每个按钮的功能完全独立处理出来，但是尽可能的简化了代码，功能按钮内部的逻辑写在js/command中，做到了界面逻辑相分离的程度
export default {
  setup(){
    const getToolbarsImg = (iconUrl)=>{
      return new URL(`/src/assets/img/toolbars/${iconUrl}.png`,import.meta.url).href;
    };
    return {
      getToolbarsImg
    }
  },
  extends: "",
  components: {},
  props: {
    itemparams: {
      type: Object,
      default: () => { themsDefault: "themsVertical" },
    },
    toolBarData:{
      type:Array,
      default:[]
    }
  },
  computed: {
    themsDefault: {
      get() {
        return this.itemparams && this.itemparams.themsdefault
          ? this.itemparams.themsdefault
          : "themsHorizontal";
      },
    },
  },
  methods: {
    closeAllPanel(name) {
      this.toolBarData.map((val) => {
        val.checked = false;
      });
    },
    menuClick(item, index) {
      let child = this.$refs.customcom.find(
        (i) => i.titem && i.titem.id == item.id
      );
      if (child) {
        if (this.pretool != child && this.pretool && this.pretool.deactive) {
          this.pretool.deactive();
          this.preitem.checked = false;
        }
        if(item.name === 'baseLayers'){
          this.layerOptions.layerTreeData = item.params?.layerTreeData;
        }
        child.onclick(item);
        this.pretool = child;
        this.preitem = item;
      }
    },
    toolBarClick() {
      this.isShowToolBar = !this.isShowToolBar;
      if (this.isShowToolBar) {
        this.isShowToolBarIcon = "iconshow_zhediezhankai_xiangshang";
        this.isShowToolBarText = "展开";
      } else {
        this.isShowToolBarIcon = "iconshow_zhediezhankai_xiangxia";
        this.isShowToolBarText = "收缩";
      }
    },
    gettoolbar() {
      return gettoolbar()
    },
    getcomps(item) {
      //require  webpack打包动态加载的办法
      // try {
      //   //所有要动态加载的均需要丢到指定目录中去
      //   var myComponent = require("./plugins/" + item.component).default;
      //   return myComponent;
      // } catch (error) {
      //   console.log("组件加载失败:" + item.name);
      //   return null;
      // }
      try {
        //所有要动态加载的均需要丢到指定目录中去
        if(item.componentDir){
          var myComponent = import.meta.glob("../../components/*/*.vue" ,{eager:true});
          return myComponent[item.component].default;
        }else
        {
          var myComponent = import.meta.glob("./plugins/*.vue" ,{eager:true});
          return myComponent["./plugins/"+item.component].default;
        }

        
      } catch (error) {
        console.log("组件加载失败:" + item.name);
        return null;
      }
    },
  },
  mounted() {
    //返回当前的toolbar信息，然后进行初始化
    //this.toolBarData = this.gettoolbar();
  },
  created() { },
  data() {
    return {
      isShowToolBar: true,
      isShowToolBarIcon: "iconshow_zhediezhankai_xiangxia",
      isShowToolBarText: "展开",
      //前一个功能的指引
      pretool: {},
      preitem: {},
      layerOptions:{
         //图层目录树
         layerTreeData: [],
         mapType:"3D"
      },
      //toolBarData: [],
      //themsDefault: "themsVertical", //themsHorizontal,themsVertical
    };
  },
  watch: {},
};
</script>

 