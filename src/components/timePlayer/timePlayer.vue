<template>
  <div class="play-container" style="z-index: 10">
    <div class="mapTip" v-show="mapTip">请您放大地图，查看日新图服务</div>
    <div class="timeTip" ref="timeTip" style="pointer-events: none;" v-if="isShowTimeTip" :style="{bottom:timeTipBottom}">{{ timeTip }}</div>
    <div class="bt-select btn_1">
      <el-select
        class="btn-select"
        v-model="oItem"
        placeholder="请选择"
        @change="fnChange1"
      >
        <el-option
          v-for="(item, index) in options"
          :key="index"
          :label="item.label"
          :value="item"
        >
        </el-option>
      </el-select>
    </div>
    <div class="bt-select btn_2" v-show="options2.length > 0">
      <el-select
        class="btn-select"
        v-model="oItem2"
        placeholder="请选择"
        @change="fnChange2"
      >
        <el-option
          v-for="(item, index) in options2"
          :key="index"
          :label="item.label"
          :value="item"
        >
        </el-option>
      </el-select>
    </div>
    <!-- 左侧箭头 -->
    <div class="btn-arr arr-left" v-if="timeLineList.length">
      <img
        v-if="isIndex <= 0 && (sectionIndex === 1 || sectionTotal === 1)"
        class="img arr_1"
        src="./img/arr_lf_3x.png"
      />
      <img
        v-else
        class="img arr_2"
        src="./img/arr_lf_act_3x.png"
        @click="fnPre()"
      />
    </div>
    <div class="play-box">
      <div class="content" ref="content">
        <div
          class="coin"
          v-if="!isRXT"
          :style="{
            width: (list.length <= 4 ? list.length * 100 : 400) + 'px',
          }"
        >
          <!-- 底轴 -->
          <div class="xs_one"></div>
          <div
            class="coinAll"
            :style="{ width: 100 + 'px' }"
            v-for="(item, index) in list"
            :key="index"
            :v-show="item.show"
            :class="{ one: true }"
            :title="item.label"
          >
            <!-- 文字 -->
            <span
              class="two"
              :style="{ display: isRXT ? 'none' : 'block' }"
              :class="{
                active: isIndex == index,
              }"
            >
              {{ item.label }}
            </span>
            <!-- 当前条目 -->
            <div
              class="xPoistion xs"
              :class="{ xs_active: isIndex >= index }"
            ></div>
            <!-- <div class="xPoistion xs" :class="{ xs_active: isIndex > index }"></div> -->
            <!-- 节点 -->
            <span
              class="xs_icon active"
              v-show="isIndex >= index"
              @click="fnClickNode(index)"
            ></span>
            <span
              class="xs_icon"
              v-show="index > isIndex"
              @click="fnClickNode(index)"
            ></span>
          </div>
        </div>
        <div
          class="coin"
          v-if="isRXT"
          :style="{
            width: (list.length <= 4 ? list.length * 100 : 400) + 'px',
            display: 'flex',
          }"
        >
          <!-- 底轴 -->
          <div class="xs_one"></div>
          <div
            class="coinAll"
            :style="{ width: '3px', marginRight: item.dayDiff + 'px' }"
            v-for="(item, index) in list"
            :key="index"
            :v-show="item.show"
            :class="{ one: true }"
            :title="item.label"
          >
            <!-- 文字 -->
            <span
              class="two"
              :style="{ display: isRXT ? 'none' : 'block' }"
              :class="{
                active: isIndex == index,
              }"
            >
              {{ item.label }}
            </span>
            <!-- 当前条目 -->
            <div
              class="xPoistion xs1"
              :class="{ xs_active: isIndex >= index }"
            ></div>
            <!-- <div class="xPoistion xs" :class="{ xs_active: isIndex > index }"></div> -->
            <!-- 节点 -->
            <span
              class="xs_icon1 active"
              v-show="isIndex >= index"
              @click="fnClickNode(index)"
            ></span>
            <span
              class="xs_icon1"
              v-show="index > isIndex"
              @click="fnClickNode(index)"
            ></span>
          </div>
        </div>
      </div>
    </div>
    <!-- 右侧箭头 -->
    <div class="btn-arr arr-left" v-if="timeLineList.length">
      <img
        v-if="
          isIndex && isIndex >= list.length - 1 && sectionIndex >= sectionTotal
        "
        class="img arr_3"
        src="./img/arr_lf_3x.png"
      />
      <img
        v-else
        class="img arr_4"
        src="./img/arr_lf_act_3x.png"
        @click="fnNext()"
      />
    </div>
    <!-- 暂停，播放 -->
    <div class="btn-arr btn-play" v-if="timeLineList.length">
      <img
        class="img"
        src="./img/stop_1x.png"
        v-if="playStatus"
        @click="fnStopPlayer"
        title="暂停"
      />
      <img
        class="img"
        src="./img/play_3x.png"
        v-else
        @click="fnPlayer"
        title="播放"
      />
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { yunyao1 } from "./yuyao";
import CesiumUtil from "@/utils/cesiumUtil.js";
export default {
  props: {
    type: {
      type: Number,
      // 1-循环播放，2-播放完暂停，3-播放完恢复初始状位置
      default: 2,
    },
    layerList: {
      type: Array,
      default: () => [],
    },
    viewer: {
      type: Object,
    },
    mapViewer:{
      type:Object,
    },
    isShowTimeTip:{
      type:Boolean,
      default:false
    },
    timeTipBottom:{
      type:String,
      default:"780px"
    },
    defaultNissinChart: {
      type: Boolean,
      default: false,
    },
  },
  watch:{
    defaultNissinChart:{
      handler(flag){
        this.fnInitData(yunyao1,flag);
        // this.fnChange1(this.options[2]);
      },
      deep:true,
      immediate:true
    }
  },
  data() {
    return {
      /* ============================wqf- 类型 ============================== */
      options: [],
      oItem: {},
      /* ============================wqf- 分辨率 ============================== */
      options2: [],
      oItem2: {},
      /* ============================wqf- 播放轴 ============================== */
      list: [], //列表
      isIndex: 3, //高亮显示
      inter: null, //定时器
      playStatus: false,
      /* ============================wqf-  ============================== */
      aList: [],
      mapExtend: {
        maxx: 0,
        maxy: 0,
        minx: 0,
        miny: 0,
      },
      sectionTotal: 0, // 每段4个，总段数
      sectionIndex: 0, // 当前段数
      timeLineList: [],
      mapTip: false,
      isRXT: false,
      curViewer: null,
      timeTip: "",
    };
  },
  computed: {},
  mounted() {
    // this.fnInitData(yunyao1,false);
    if (this.viewer) {
      this.curViewer = this.viewer;
      this.curViewer.camera.moveEnd.addEventListener(this.getDateLine);
    }else if(this.mapViewer){
      this.mapViewer.on("moveend",this.get2DDateLine);
    }
  },
  methods: {
    mountedViewer(timeViewer) {
      this.curViewer = timeViewer;
      this.curViewer.camera.moveEnd.addEventListener(this.getDateLine);
    },
    mounted2DViewer(timeViewer){
      this.curViewer = timeViewer;
      this.curViewer.on("moveend",this.get2DDateLine);
    },
    sortTime(value1, value2) {
      return Date.parse(value2) - Date.parse(value1);
    },
    // 格式化初始化json数据
    fnInitData(arr,flag=false) {
      // this.isRXT = false;
      this.isRXT = flag;
      if (arr && arr.length > 0) {
        let list = JSON.parse(JSON.stringify(arr)).map((item) => {
          let vals = item.children.map((item) => {
            let arr = this.fnFormat(item.children);
            return { id: item.id, label: item.label, value: arr };
          });
          return { id: item.id, label: item.label, value: vals };
        });
        this.options = list;
        let getRXTData = list.findIndex((item=>item.label.includes("日新图")));
        // this.oItem = list[0];
        this.oItem = flag?list[getRXTData]:list[0];
        this.fnChange1(this.oItem);
        this.options2 = this.oItem?.value;
        this.oItem2 = this.options2[0];
        this.timeLineList = this.oItem2.value;
        this.sectionTotal = this.timeLineList.length
          ? Math.ceil(this.timeLineList.length / 4)
          : 1;
        // 取倒序最新的日期
        this.list = this.timeLineList.length
          ? this.timeLineList.slice(
              (this.sectionTotal - 1) * 4,
              this.timeLineList.length
            )
          : [];
        // console.log(this.list, this.sectionIndex, "sectionIndex");
        this.timeTip = this.list[3].label;
        this.sectionIndex = this.sectionTotal;
      }
    },
    fnFormat(data) {
      let list = [];
      for (let i = 0; i < data.length; i += 1) {
        let item = data[i];

        list.push({
          ...item,
          id: item.id,
          label: item.label,
          url: item.server,
          type: "",
          layerName: item.serverName,
        });
      }
      return list;
    },
    fnSubmit(item) {
      item && this.$emit("change", item);
      console.log(item);
      this.timeTip = item.label;
    },
    fnClickNode(i) {
      let item = this.list[i];
      this.fnSubmit(item);
      this.isIndex = i;
    },
    fnPre() {
      if (this.isIndex > 0) {
        this.isIndex -= 1;
        let item = this.list[this.isIndex];
        this.fnSubmit(item);
      } else if (this.isIndex === 0 && this.sectionIndex > 0) {
        this.sectionIndex -= 1;
        this.list = this.timeLineList.slice(
          (this.sectionIndex - 1) * 4,
          this.sectionIndex * 4
        );
        this.isIndex = this.list.length - 1;
        let item = this.list[this.isIndex];
        this.fnSubmit(item);
      }
      console.log(
        this.isIndex,
        "isIndex",
        this.sectionIndex,
        "sectionindex",
        this.timeLineList,
        "pre"
      );
    },
    fnNext() {
      if (this.isIndex < this.list.length - 1) {
        this.isIndex += 1;
        let item = this.list[this.isIndex];
        this.fnSubmit(item);
      } else if (this.isIndex >= this.list.length - 1) {
        this.isIndex = 0;
        this.sectionIndex += 1;
        let length =
          this.sectionIndex == this.sectionTotal
            ? this.timeLineList.length
            : this.sectionIndex * 4;
        this.list = this.timeLineList.slice(
          (this.sectionIndex - 1) * 4,
          length
        );
        let item = this.list[this.isIndex];
        this.fnSubmit(item);
      }
      console.log(this.isIndex, "isindex", this.sectionIndex, "sectionIndex");
    },
    // 开始播放
    fnPlayer() {
      this.playStatus = true;
      if (this.isIndex == this.list.length - 1) {
        this.isIndex = -1;
      }
      this.inter = setInterval(
        function () {
          if (this.isIndex < this.list.length - 1) {
            this.isIndex += 1;
            let i = this.isIndex;
            let item = this.list[i];
            this.fnSubmit(item);
          } else {
            if (this.type == 1) {
              this.isIndex = 0;
              let item = this.list[this.isIndex];
              this.fnSubmit(item);
            } else if (this.type == 2) {
              this.fnStopPlayer();
            } else if (this.type == 3) {
              this.fnRest();
            }
          }
        }.bind(this),
        2 * 1000
      );
    },
    // 停止播放
    fnStopPlayer() {
      this.playStatus = false;
      this.inter && window.clearInterval(this.inter);
    },
    // 重置初始化位置
    fnRest() {
      this.fnStopPlayer();
      this.isIndex = this.list.length - 1;
      console.log(this.list[this.list.length - 1])
      this.$emit("change", this.list[this.list.length - 1]);
    },
    // 切换选项一
    fnChange1(item) {
      this.timeTip = null;
      // alert(item.label)
      if (item.label === "日新图") {
        this.isRXT = true;
        this.mapTip = true;
        let timeTip = document.querySelector(".play-container>.timeTip");
        // timeTip.style.display = "none";
      } else {
        this.isRXT = false;
        this.mapTip = false;
      }

      this.options2 = [];
      this.list = [];
      if (item?.value?.length > 0) { 
        this.options2 = item.value;
        this.oItem2 = this.options2[0];
        this.timeLineList = this.oItem2.value;
        this.fnChange2(this.oItem2);
        this.mapTip = false;
      } else {
        this.oItem2 = {};
        this.timeLineList = [];
        this.$emit("change");
        this.mapExtend = {
          maxx: 0,
          maxy: 0,
          minx: 0,
          miny: 0,
        };
        this.getDateLine();
      }
      this.$forceUpdate();
    },
    // 切换选项二
    fnChange2(item) {
      this.sectionTotal = item?.value.length
        ? Math.ceil(item?.value.length / 4)
        : 1;
      this.list = item?.value.length
        ? item?.value.slice((this.sectionTotal - 1) * 4, item?.value.length)
        : [];
      if(this.list.length<4&&this.sectionTotal>1){
        this.list = item?.value.length
        ? item?.value.slice((this.sectionTotal - 1) * 4-1, item?.value.length)
        : [];
      }
      this.timeLineList = item?.value;
      this.sectionIndex = this.sectionTotal;
      this.timeTip = this.list.at(-1).label;
      console.log(this.list, this.sectionIndex, "sectionIndex");
      this.fnRest();
    },
    // 切换选项二
    fnChange3(item) {
      this.sectionTotal = item?.value.length
        ? Math.ceil(item?.value.length / 4)
        : 1;
      this.list = item?.value.length
        ? item?.value.slice((this.sectionTotal - 1) * 4, item?.value.length)
        : [];
      this.timeLineList = item?.value;
      this.sectionIndex = this.sectionTotal;
      console.log(this.list, this.sectionIndex, "sectionIndex");
      this.fnRest();
    },
    mercatorToWGS84(lonlat){
      const coord = [];
      const maxx = lonlat.maxx / 20037508.34 * 180;
      const minx = lonlat.minx / 20037508.34 * 180;

      let maxy = lonlat.maxy / 20037508.34 * 180;
      maxy = 180 / Math.PI * (2 * Math.atan(Math.exp(maxy * Math.PI / 180)) - Math.PI / 2);

      let miny = lonlat.miny/ 20037508.34 * 180;
      miny = 180 / Math.PI * (2 * Math.atan(Math.exp(miny * Math.PI / 180)) - Math.PI / 2);
   
      let extend = {maxx:maxx,maxy:maxy,minx:minx,miny:miny};

      return extend;
    },
    get2DDateLine(e) {
      if (!this.isRXT) return;
      var $this = this;
      let targetMap = e.target;
      let targetZoom = targetMap.getView().getZoom();
      let range = targetMap.getView().calculateExtent(targetMap.getSize());
      let lngLat = {maxx:range[2],maxy:range[3],minx:range[0],miny:range[1]};
      let extend = this.mercatorToWGS84(lngLat);

      //判断当前地图范围是否和上次一样
      if (
        extend.maxx !== $this.mapExtend.maxx ||
        extend.maxy !== $this.mapExtend.maxy ||
        extend.minx !== $this.mapExtend.minx ||
        extend.miny !== $this.mapExtend.miny
      ) {
        if (targetZoom > 12 && !Object.keys($this.oItem2).length) {
          //记录当年屏幕范围，注：当前屏幕有其他组件范围改变，会影响屏幕内地图的范围
          $this.mapExtend = extend;
          $this.mapTip = false;
          const { maxx, maxy, minx, miny } = extend;
          const params = {
            queryGeometry: {
              coordinates: [
                [
                  [maxx, maxy],
                  [minx, maxy],
                  [minx, miny],
                  [maxx, miny],
                  [maxx, maxy],
                ],
              ],
              type: "Polygon",
            },
          };
          axios
            .post("https://www.img.net/v1/metadata/search/timeline", params)
            .then(
              function (res) {
                //记录上次地图范围
                let resData = res?.data?.result || [];
                let Arr = resData.filter((a) => a.imagedate.indexOf("-") < 0);
                Arr = Arr.sort(function (a, b) {
                  return new Date(a.imagedate).getTime() -
                    new Date(b.imagedate).getTime() >
                    0
                    ? 1
                    : -1;
                }).reverse();

                if (Arr.length) {
                  let set = new Set();
                  let newArr = [];
                  let server =
                    "https://onemapserver.img.net/OneMapServer/rest/services/HiGIS_RiXinTu/Transfer";

                  let endTime = new Date(Number(Arr[0].imagedate));
                  let totelDiff = 205;
                  for (var i = 0; i < Arr.length; i++) {
                    let item = Arr[i];
                    let time = new Date(Number(item.imagedate)).Format(
                      "yyyy/MM/dd"
                    );
                    // if(totelDiff<=0) break;
                    if (!set.has(time)) {
                      set.add(time);
                      let startTime = new Date(Number(item.imagedate));
                      let dayDiff = Math.floor(
                        (endTime.getTime() - startTime.getTime()) /
                          (1000 * 60 * 60 * 24)
                      );
                      if (dayDiff > 60) {
                        dayDiff = 6;
                      } else if (dayDiff > 30) {
                        dayDiff = 5;
                      } else if (dayDiff > 20) {
                        dayDiff = 4;
                      } else if (dayDiff > 10) {
                        dayDiff = 3;
                      }
                      // dayDiff=totelDiff-dayDiff;
                      // if(dayDiff<=0)
                      //   dayDiff = 0;
                      // totelDiff=dayDiff;

                      newArr.push({
                        ...item,
                        id: item.appid,
                        layerName: item.appid,
                        url: server,
                        label: time,
                        dayDiff: dayDiff,
                        addYYLayerFun:"addYYLayer3",
                      });

                      endTime = new Date(Number(item.imagedate));
                    }
                  }
                  // );

                  // 取前 100 条数据

                  this.timeLineList = newArr.slice(0, 90).reverse();
                  this.sectionTotal = 1;
                  // 取倒序最新的日期
                  // this.list = thioItem2alert(9s.timeLineList.length ? this.timeLineList.slice((this.sectionTotal - 1) * 50, this.timeLineList.length) : [];
                  this.list = this.timeLineList;
                  this.sectionIndex = 1;
                  this.isIndex = this.list.length - 1;
                  // this.fnRest()
                } else {
                  this.mapTip = true;
                  this.timeLineList = [];
                  this.list = [];
                }
              }.bind(this)
            )
            .catch((error) => {
              console.log(error);
            });
        }
        if (targetZoom <= 12 && !Object.keys(this.oItem2).length) {
          this.mapTip = true;
          this.list = [];
          this.timeLineList = [];
          this.$emit("change");
        }
      }
    },
    getDateLine() {
      var $this = this;
      const cameraHeight = $this.curViewer.camera.positionCartographic.height;
      const util = new CesiumUtil($this.curViewer);
      const extend = util.getViewerExtend();
      if (!this.isRXT) return;
      //判断当前地图范围是否和上次一样
      if (
        extend.maxx !== $this.mapExtend.maxx ||
        extend.maxy !== $this.mapExtend.maxy ||
        extend.minx !== $this.mapExtend.minx ||
        extend.miny !== $this.mapExtend.miny
      ) {        
        if (cameraHeight < 14138 && !Object.keys($this.oItem2).length) {
          //记录当年屏幕范围，注：当前屏幕有其他组件范围改变，会影响屏幕内地图的范围
          $this.mapExtend = extend;
          $this.mapTip = false;
          const { maxx, maxy, minx, miny } = extend;
          const params = {
            queryGeometry: {
              coordinates: [
                [
                  [maxx, maxy],
                  [minx, maxy],
                  [minx, miny],
                  [maxx, miny],
                  [maxx, maxy],
                ],
              ],
              type: "Polygon",
            },
          };
          axios
            .post("https://www.img.net/v1/metadata/search/timeline", params)
            .then(
              function (res) {
                //记录上次地图范围
                let resData = res?.data?.result || [];
                let Arr = resData.filter((a) => a.imagedate.indexOf("-") < 0);
                Arr = Arr.sort(function (a, b) {
                  return new Date(a.imagedate).getTime() -
                    new Date(b.imagedate).getTime() >
                    0
                    ? 1
                    : -1;
                }).reverse();

                if (Arr.length) {
                  let set = new Set();
                  let newArr = [];
                  let server =
                    "https://onemapserver.img.net/OneMapServer/rest/services/HiGIS_RiXinTu/Transfer";

                  let endTime = new Date(Number(Arr[0].imagedate));
                  let totelDiff = 205;
                  for (var i = 0; i < Arr.length; i++) {
                    let item = Arr[i];
                    let time = new Date(Number(item.imagedate)).Format(
                      "yyyy/MM/dd"
                    );
                    // if(totelDiff<=0) break;
                    if (!set.has(time)) {
                      set.add(time);
                      let startTime = new Date(Number(item.imagedate));
                      let dayDiff = Math.floor(
                        (endTime.getTime() - startTime.getTime()) /
                          (1000 * 60 * 60 * 24)
                      );
                      if (dayDiff > 60) {
                        dayDiff = 6;
                      } else if (dayDiff > 30) {
                        dayDiff = 5;
                      } else if (dayDiff > 20) {
                        dayDiff = 4;
                      } else if (dayDiff > 10) {
                        dayDiff = 3;
                      }
                      // dayDiff=totelDiff-dayDiff;
                      // if(dayDiff<=0)
                      //   dayDiff = 0;
                      // totelDiff=dayDiff;
                      newArr.push({
                        ...item,
                        id: item.appid,
                        layerName: item.appid,
                        url: server,
                        label: time,
                        addYYLayerFun:"addYYLayer3",
                        dayDiff: dayDiff,
                      });

                      endTime = new Date(Number(item.imagedate));
                    }
                  }
                  // );

                  // 取前 100 条数据

                  this.timeLineList = newArr.slice(0, 90).reverse();
                  this.sectionTotal = 1;
                  // 取倒序最新的日期
                  // this.list = this.timeLineList.length ? this.timeLineList.slice((this.sectionTotal - 1) * 50, this.timeLineList.length) : [];
                  this.list = this.timeLineList;
                  this.sectionIndex = 1;
                  this.isIndex = this.list.length - 1;
                  // this.fnRest()
                } else {
                  this.mapTip = true;
                  this.timeLineList = [];
                  this.list = [];
                }
              }.bind(this)
            )
            .catch((error) => {
              console.log(error);
            });
        }
        if (cameraHeight >= 14138 && !Object.keys(this.oItem2).length) {
          this.mapTip = true;
          this.list = [];
          this.timeLineList = [];
          this.$emit("change");
        }
      }
    },
    beforeDestroy() {
      this.curViewer.camera.moveEnd.removeEventListener(this.getDateLine);
      this.inter && window.clearInterval(this.inter);
    },
  },
};
</script>

<style lang="scss" scoped>
.play-container {
  display: flex;
  //   background: rgba(9, 27, 70, 0.8);
  background: url("./img/bg_3x.png") no-repeat;
  box-sizing: border-box;
  padding: 9px 10px 0;
  border-radius: 15px;
  width: fit-content;
  .mapTip {
    position: absolute;
    text-align: center;
    z-index: 99;
    font-size: 26px;
    color: red;
    top: -50%;
    left: 50%;
    transform: translateX(-50%);
    width: 80%;
  }
  .timeTip {
    width: 200px;
    height: 45px;
    line-height: 45px;
    text-align: start;
    padding-left: 18px;
    position: absolute;
    bottom: 780px;
    left: 300px;
    font-size: 18px;
    font-family: SourceHanSansCN-Bold, SourceHanSansCN;
    font-weight: 600;
    color: #ffffff;
    //background: url("@/assets/imgs/fireIcon/title_img.png");
    background-size: 100% 100%;
  }
  .bt-select {
    // height: 40px;
    height: 34px;
    position: relative;
    margin-right: 5px;
    font-size: 12px;
    :deep(.el-select) {
      display: inline-block;
    }
    :deep(.el-input__inner) {
      background-color: #fff0;
      border: 1px solid #3db7ff;
      font-size: 13px;
      padding: 0 10px;
    }
    &.btn_1 {
      //   width: 114px;
      width: 120px;
    }
    &.btn_2 {
      //   width: 70px;
      width: 78px;
    }
  }
  .btn-arr {
    position: relative;
    height: 40px;
    width: 20px;
    cursor: pointer;
    z-index: 10;
    .img {
      position: absolute;
      // top: 50%;
      top: 30%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 12px;
      height: 12px;
      &.arr_1 {
        transform: translate(-50%, -50%) rotate(180deg);
      }
      &.arr_2 {
      }
      &.arr_3 {
      }
      &.arr_4 {
        transform: translate(-50%, -50%) rotate(180deg);
      }
    }
  }
  .play-box {
    // width: calc(100% - 340px);
    .xPoistion {
      position: absolute;
      // top: 50%;
      top: 16%;
      transform: translate(0, -50%);
    }
    .content {
      //   width: calc(100% - 340px);
      //   width: 100%;
      width: 400px;
      height: 70px;
      margin: 0 10px;
      // background: rgb(9, 27, 70);
      position: relative;
      overflow-x: auto;

      .coin {
        width: 100%;
        height: 80px;

        position: relative;
        overflow-x: hidden;
        .xs_one {
          width: 100%;
          height: 10px;
          // background: rgb(61, 183, 270);
          background: #000;
          position: absolute;
          //   top: 50%;
          top: 16%;
          left: 0;
          //   right: 0;
          transform: translate(0, -50%);
        }
        .coinAll {
          height: 100%;
          float: left;
          position: relative;
          span {
            width: 100%;
            color: #fff;
            font-size: 16px;
            position: absolute;
            top: 5px;
          }
          .two {
            width: 100%;
            color: #fff;
            font-size: 12px;
            position: absolute;
            top: 35px;
            right: 0;
            text-align: right;
            &.active {
              color: rgb(245, 189, 39);
            }
          }

          // 高亮线
          .xs {
            width: 100%;
            height: 10px;
            background: rgb(61, 183, 270);

            &.xs_active {
              background: rgb(245, 189, 39);
            }
          }

          .xs_icon {
            position: absolute;
            // top: 50%;
            top: 16%;
            // left: 0;
            right: 0;
            display: block;
            background: rgba($color: #e7ffff, $alpha: 1);
            width: 8px;
            height: 10px;
            border-radius: 10px;
            transform: translate(0, -50%);
            cursor: pointer;
            .active {
              background: rgba(245, 189, 39, 1);
            }
          }
          .xs1 {
            width: 100%;
            height: 10px;
            // background: rgb(61, 183, 270);
            background: #000;

            &.xs_active {
              // background: rgb(61, 183, 270);
              background: #000;
            }
          }
          .xs_icon1 {
            position: absolute;
            // top: 50%;
            top: 16%;
            // left: 0;
            right: 0;
            display: block;
            // background: #000;
            background: rgb(61, 183, 270);
            width: 3px;
            height: 10px;
            // border-radius: 10px;
            transform: translate(0, -50%);
            cursor: pointer;
          }
          .xs_icon1.active{
            background: rgba(245, 189, 39, 1);
          }
        }
      }
      .paging {
        height: 20px;
        position: absolute;
        bottom: 10px;
        left: 50%;
        transform: translate(-50%);
        div {
          width: 15px;
          height: 15px;
          border-radius: 50%;
          background: rgb(120, 120, 120);
          float: left;
          margin-left: 5px;
        }
        .is_active {
          background: rgb(26, 82, 229);
        }
      }
    }
    .paly-btn {
      width: 100px;
      padding-top: 25px;
    }
  }
}

/* 文字高亮 */
// .coin .coinAll

/* 线条高亮 */
// .coin .coinAll .xs_active {
//   background: rgb(245, 189, 39);
// }
</style>
