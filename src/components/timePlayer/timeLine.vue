<template>
  <div class="play-container" style="z-index: 10">
    <!-- 当前选中日期 -->
    <div class="labelTip" v-show="currentTimeTip">{{ currentTimeTip }}</div>
    <!-- 日新图提示 -->
    <div class="mapZoomOutTip" v-show="mapZoomOutTip">请您放大地图，查看日新图服务</div>
    <!-- 影像类别集合 -->
    <div class="bt-select btn_1">
      <el-select
        class="btn-select"
        popper-class="popper-Select"
        v-model="imageName"
        placeholder="请选择"
        @change="fnChangeImageName"
      >
        <el-option
          v-for="(item, index) in imageNameOptions"
          :key="index"
          :label="item.label"
          :value="item"
        >
        </el-option>
      </el-select>
    </div>
    <!-- 距离  -->
    <div class="bt-select btn_2" v-show="distanceOptions.length">
      <el-select
        class="btn-select"
        popper-class="popper-Select"
        v-model="distanceValue"
        placeholder="请选择"
        @change="fnChangeDistance"
      >
        <el-option
          v-for="(item, index) in distanceOptions"
          :key="index"
          :label="item.label"
          :value="item"
        >
        </el-option>
      </el-select>
    </div>
    <!-- 左侧箭头 -->
    <div class="btn-arr arr-left" v-show="timeLineList.length">
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
      <div
        class="content"
        ref="content"
        :style="{ width: `${timeLineWidth}px` }"
      >
        <div class="coin" v-if="!isRXT">
          <!-- 底轴 -->
          <el-tooltip
            class="item"
            effect="light"
            v-for="(item, index) in timeLineList"
            :key="index"
            :content="item.label"
            placement="bottom"
          >
            <div
              class="coinAll"
              :style="coinAllStyle"
              :v-show="item.show"
              :class="{ one: true }"
            >
             <!-- 节点 -->
             <span               
                :class="[
                  'xs_icon',
                  isIndex >= index ? 'active-time-xs_icon' : '',
                ]"
                :style="xsIconlStyle"
                @click="fnClickNode(index)"
              >
              </span>
              <!-- 文字 -->
              <p
                class="time-text-bottom"
                v-show="showTimeTextBottomWidth<=singleWidth"
                :style="xsIconlStyle"
                :class="{
                  active: isIndex == index,
                }"
              >
                {{ item.label }}
              </p>             
            </div>
          </el-tooltip>
        </div>
        <div class="coin" v-if="isRXT">
          <!-- 底轴 -->
          <div
            class="coinAll"
            :style="{ width: '3px', marginRight: item.dayDiff + 'px' }"
            v-for="(item, index) in timeLineList"
            :key="index"
            :v-show="item.show"
            :class="{ one: true }"
            :title="item.label"
          >
            <!-- 节点 -->
            <span
              :class="[
                'xs_icon1',
                isIndex >= index ? 'active-time-xs_icon1' : '',
              ]"
              class="xs_icon1 active"
              v-show="isIndex >= index"
              @click="fnClickNode(index)"
            ></span>
          </div>
        </div>
      </div>
    </div>
    <!-- 右侧箭头 -->
    <div class="btn-arr arr-left" v-show="timeLineList.length">
      <img
        v-if="
          isIndex &&
          isIndex >= timeLineList.length - 1 &&
          sectionIndex >= sectionTotal
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
    <div class="btn-arr btn-play" v-show="timeLineList.length">
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
import CesiumUtil from "@/utils/cesiumUtil.js";
import axios from 'axios';
export default {
  props: {
    palyType: {
      type: Number,
      // 1-循环播放，2-播放完暂停，3-播放完恢复初始状位置
      default: 2,
    },
    //   时间轴参数
    timeLineOption: {
      type: Object,
      default: () => {
        return {
          layerList: [], //列表集合
          timeLineWidth: 400, //时间轴宽度
          defaultNissinChart: false, //是否默认显示日新图
          showTimeTextBottomWidth:90,//单节宽度50px显示底部日期
        };
      },
    },
    // 三维视图
    viewer: {
      type: Object,
    },
    // 二维地图
    mapViewer: {
      type: Object,
    },
  },
  watch: {
    timeLineOption: {
      handler(values) {
        
        let { layerList, timeLineWidth, defaultNissinChart: flag,showTimeTextBottomWidth } = values;
        
        this.timeLineWidth = timeLineWidth;
        this.fnInitData(layerList, flag); //加载数据
      },
      deep: true,
      immediate: true,
    },
  },
  data() {
    return {
      timeLineWidth: 500, //时间轴宽度
      imageNameOptions: [], //影像类别
      imageName: {}, //当前影像类名
      distanceOptions: [], //距离集合
      distanceValue: {}, //当前距离值
      timeLineList: [], //底部时间列表
      isIndex: 3, //高亮显示
      inter: null, //定时器
      playStatus: false,
      aList: [],
      mapExtend: {
        maxx: 0,
        maxy: 0,
        minx: 0,
        miny: 0,
      },
      sectionTotal: 0, // 每段4个，总段数
      sectionIndex: 0, // 当前段数
      mapZoomOutTip: false,//日新图-地图放大提示
      isRXT: false, //当前是否是日新图
      curViewer: null,
      currentTimeTip: "", //当前日期
      singleWidth:10,//单节宽度
      showTimeTextBottomWidth:90,//单节宽度50px显示底部日期
    };
  },
  computed: {
    coinAllStyle() {
      return {
        width: this.timeLineWidth / this.timeLineList.length + "px",
      };
    },
    xsIconlStyle() {
        this.singleWidth = this.timeLineWidth / this.timeLineList.length;
      return {
        width: this.singleWidth - 4 + "px",
      };
    },
  },
  mounted() {
    if (viewer) {
      this.curViewer = viewer;
      this.curViewer.camera.moveEnd.addEventListener(this.getDateLine);
    } else if (this.mapViewer) {
      this.mapViewer.on("moveend", this.get2DDateLine);
    }else if(window.viewer)
    {
      this.curViewer = window.viewer;
      this.curViewer.camera.moveEnd.addEventListener(this.getDateLine);
    }
  },
  methods: {
    mountedViewer(timeViewer) {
      this.curViewer = timeViewer;
      this.curViewer.camera.moveEnd.addEventListener(this.getDateLine);
    },
    mounted2DViewer(timeViewer) {
      this.curViewer = timeViewer;
      this.curViewer.on("moveend", this.get2DDateLine);
    },
    sortTime(value1, value2) {
      return Date.parse(value2) - Date.parse(value1);
    },
    // 格式化初始化json数据
    fnInitData(arr, flag = false) {
      this.isRXT = flag;
      if (arr && arr.length > 0) {
        let timeList = JSON.parse(JSON.stringify(arr)).map((item) => {
          let vals = item.children.map((item) => {
            let arr = this.fnFormat(item.children);
            return { id: item.id, label: item.label, value: arr };
          });
          return { id: item.id, label: item.label, value: vals };
        });
        this.imageNameOptions = timeList;
        let getRXTData = timeList.findIndex((item) =>
          item.label.includes("日新图")
        );
        this.imageName = flag ? timeList[getRXTData] : timeList[0];
        this.fnChangeImageName(this.imageName);
        this.distanceOptions = this.imageName?.value;
        this.distanceValue = this.distanceOptions[0];
        this.timeLineList = this.distanceValue.value;
        this.sectionTotal = this.timeLineList.length
          ? Math.ceil(this.timeLineList.length / 4)
          : 1;
        // 取倒序最新的日期
        this.currentTimeTip = this.timeLineList.at(-1).label;
        this.sectionIndex = this.sectionTotal;
      }
    },
    fnFormat(data) {
      let timeList = [];
      for (let i = 0; i < data.length; i += 1) {
        let item = data[i];

        timeList.push({
          ...item,
          id: item.id,
          label: item.label,
          url: item.server,
          type: "",
          layerName: item.serverName,
        });
      }
      return timeList;
    },
    fnSubmit(item) {
      item && this.$emit("change", item);
      this.currentTimeTip = item.label;
    },
    fnClickNode(i) {
      let item = this.timeLineList[i];
      this.fnSubmit(item);
      this.isIndex = i;
    },
    // 上一节点
    fnPre() {
      if (this.isIndex > 0) {
        this.isIndex -= 1;
        let item = this.timeLineList[this.isIndex];
        this.fnSubmit(item);
      } else if (this.isIndex === 0 && this.sectionIndex > 0) {
        this.sectionIndex -= 1;
        this.timeLineList = this.timeLineList.slice(
          (this.sectionIndex - 1) * 4,
          this.sectionIndex * 4
        );
        this.isIndex = this.timeLineList.length - 1;
        let item = this.timeLineList[this.isIndex];
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
    // 下一节点
    fnNext() {
      if (this.isIndex < this.timeLineList.length - 1) {
        this.isIndex += 1;
        let item = this.timeLineList[this.isIndex];
        this.fnSubmit(item);
      } else if (this.isIndex >= this.timeLineList.length - 1) {
        this.isIndex = 0;
        this.sectionIndex += 1;
        let length =
          this.sectionIndex == this.sectionTotal
            ? this.timeLineList.length
            : this.sectionIndex * 4;
        this.timeLineList = this.timeLineList.slice(
          (this.sectionIndex - 1) * 4,
          length
        );
        let item = this.timeLineList[this.isIndex];
        this.fnSubmit(item);
      }
      console.log(this.isIndex, "isindex", this.sectionIndex, "sectionIndex");
    },
    // 开始播放
    fnPlayer() {
      this.playStatus = true;
      if (this.isIndex == this.timeLineList.length - 1) {
        this.isIndex = -1;
      }
      this.inter = setInterval(
        function () {
          if (this.isIndex < this.timeLineList.length - 1) {
            this.isIndex += 1;
            let i = this.isIndex;
            let item = this.timeLineList[i];
            this.fnSubmit(item);
          } else {
            if (this.palyType == 1) {
              this.isIndex = 0;
              let item = this.timeLineList[this.isIndex];
              this.fnSubmit(item);
            } else if (this.palyType == 2) {
              this.fnStopPlayer();
            } else if (this.palyType == 3) {
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
      this.isIndex = this.timeLineList.length - 1;
      this.$emit("change", this.timeLineList.at(-1));
    },
    // 切换影像类名
    fnChangeImageName(item) {
      this.currentTimeTip = null;
      if (item.label === "日新图") {
        this.isRXT = true;
        this.mapZoomOutTip = true;
      } else {
        this.isRXT = false;
        this.mapZoomOutTip = false;
      }

      this.distanceOptions = [];
      this.timeLineList = [];
      if (item?.value?.length > 0) {
        this.distanceOptions = item.value;
        this.distanceValue = this.distanceOptions[0];
        this.timeLineList = this.distanceValue.value;
        this.fnChangeDistance(this.distanceValue);
        this.mapZoomOutTip = false;
      } else {
        this.distanceValue = {};
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
    // 切换距离
    fnChangeDistance(item) {
      this.sectionTotal = item?.value.length
        ? Math.ceil(item?.value.length / 4)
        : 1;
      this.timeLineList = item?.value;
      if (this.timeLineList.length < 4 && this.sectionTotal > 1) {
        this.timeLineList = item?.value.length
          ? item?.value.slice(
              (this.sectionTotal - 1) * 4 - 1,
              item?.value.length
            )
          : [];
      }
      this.timeLineList = item?.value;
      this.sectionIndex = this.sectionTotal;
      this.currentTimeTip = this.timeLineList.at(-1).label;
      this.fnRest();
    },
    mercatorToWGS84(lonlat) {
      const maxx = (lonlat.maxx / 20037508.34) * 180;
      const minx = (lonlat.minx / 20037508.34) * 180;

      let maxy = (lonlat.maxy / 20037508.34) * 180;
      maxy =
        (180 / Math.PI) *
        (2 * Math.atan(Math.exp((maxy * Math.PI) / 180)) - Math.PI / 2);

      let miny = (lonlat.miny / 20037508.34) * 180;
      miny =
        (180 / Math.PI) *
        (2 * Math.atan(Math.exp((miny * Math.PI) / 180)) - Math.PI / 2);

      let extend = { maxx: maxx, maxy: maxy, minx: minx, miny: miny };

      return extend;
    },
    // 二维
    get2DDateLine(e) {
      if (!this.isRXT) return;
      var $this = this;
      let targetMap = e.target;
      let targetZoom = targetMap.getView().getZoom();
      let range = targetMap.getView().calculateExtent(targetMap.getSize());
      let lngLat = {
        maxx: range[2],
        maxy: range[3],
        minx: range[0],
        miny: range[1],
      };
      let extend = this.mercatorToWGS84(lngLat);

      //判断当前地图范围是否和上次一样
      if (
        extend.maxx !== $this.mapExtend.maxx ||
        extend.maxy !== $this.mapExtend.maxy ||
        extend.minx !== $this.mapExtend.minx ||
        extend.miny !== $this.mapExtend.miny
      ) {
        if (targetZoom > 12 && !Object.keys($this.distanceValue).length) {
          //记录当年屏幕范围，注：当前屏幕有其他组件范围改变，会影响屏幕内地图的范围
          $this.mapExtend = extend;
          $this.mapZoomOutTip = false;
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
                  for (var i = 0; i < Arr.length; i++) {
                    let item = Arr[i];
                    let time = new Date(Number(item.imagedate)).Format(
                      "yyyy/MM/dd"
                    );
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

                      newArr.push({
                        ...item,
                        id: item.appid,
                        layerName: item.appid,
                        url: server,
                        label: time,
                        dayDiff: dayDiff,
                        addYYLayerFun: "addYYLayer3",
                      });

                      endTime = new Date(Number(item.imagedate));
                    }
                  }
                  // );

                  // 取前 100 条数据

                  this.timeLineList = newArr.slice(0, 90).reverse();
                  this.sectionTotal = 1;
                  // 取倒序最新的日期
                  this.sectionIndex = 1;
                  this.isIndex = this.timeLineList.length - 1;
                } else {
                  this.mapZoomOutTip = true;
                  this.timeLineList = [];
                }
              }.bind(this)
            )
            .catch((error) => {
              console.log(error);
            });
        }
        if (targetZoom <= 12 && !Object.keys(this.distanceValue).length) {
          this.mapZoomOutTip = true;
          this.timeLineList = [];
          this.$emit("change");
        }
      }
    },
    // 三维
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
        if (cameraHeight < 14138 && !Object.keys($this.distanceValue).length) {
          //记录当年屏幕范围，注：当前屏幕有其他组件范围改变，会影响屏幕内地图的范围
          $this.mapExtend = extend;
          $this.mapZoomOutTip = false;
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
                      newArr.push({
                        ...item,
                        id: item.appid,
                        layerName: item.appid,
                        url: server,
                        label: time,
                        addYYLayerFun: "addYYLayer3",
                        dayDiff: dayDiff,
                      });

                      endTime = new Date(Number(item.imagedate));
                    }
                  }

                  // 取前 100 条数据

                  this.timeLineList = newArr.slice(0, 90).reverse();
                  this.sectionTotal = 1;
                  // 取倒序最新的日期
                  this.sectionIndex = 1;
                  this.isIndex = this.timeLineList.length - 1;
                } else {
                  this.mapZoomOutTip = true;
                  this.timeLineList = [];
                }
              }.bind(this)
            )
            .catch((error) => {
              console.log(error);
            });
        }
        if (cameraHeight >= 14138 && !Object.keys(this.distanceValue).length) {
          this.mapZoomOutTip = true;
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
  background: url("./img/bg_3x.png") no-repeat;
  box-sizing: border-box;
  padding: 9px 10px 0;
  border-radius: 15px;
  width: fit-content;
  .labelTip {
    position: absolute;
    top: -40px;
    left: 50%;
    padding: 10px;
    background: #1a253d;
    color: rgba(245, 189, 39, 1);
    border-radius: 5px;
  }
  .mapZoomOutTip {
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
      color: #fff;
      font-size: 13px;
      padding: 0 10px;
    }
    &.btn_1 {
      width: 120px;
    }
    &.btn_2 {
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
      top: 30%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 12px;
      height: 12px;
      &.arr_4 {
        transform: translate(-50%, -50%) rotate(180deg);
      }
    }
  }
  .play-box {
    .content {
      height: 70px;
      margin: 0 10px;
      position: relative;
      overflow-x: auto;

      .coin {
        width: 100%;
        height: 70px;
        display: flex;
        justify-content: center;
        position: relative;
        overflow-x: hidden;
        .xs_one {
          width: 100%;
          height: 40px;
          background: #000;
          position: absolute;
          top: 16%;
          left: 0;
        }
        .coinAll {
          height: 100%;
          float: left;
          position: relative;
          cursor: pointer;
          &:last-of-type {
            margin-right: 5px;
          }
          span {
            width: 100%;
            color: #fff;
            font-size: 16px;
            position: absolute;
            top: 5px;
          }
          .time-text-bottom {
            width: 100%;
            color: #fff;
            font-size: 12px;
            position: absolute;
            top: 35px;
            right: 0;
            text-align: center;
            background: #1a253d;
            padding:3px 0;
            border-radius: 5px;
            &.active {
              color: rgb(245, 189, 39);
            }
          }

          // 高亮线
          .xs {
            width: 100%;
            height: 15px;
          }

          .xs_icon {
            position: absolute;
            top: 16%;
            right: 0;
            display: block;
            height: 14px;
            border-radius: 10px;
            cursor: pointer;
            background: #e7ffff;
            transform: translate(0, -50%);
          }
          .active-time-xs_icon {
            background: rgb(245, 189, 39);
          }
          .xs1 {
            width: 100%;
            height: 10px;
            background: #000;

            &.xs_active {
              background: #000;
            }
          }
          .xs_icon1 {
            display: block;
            background: rgb(61, 183, 270);
            width: 3px;
            height: 20px;
            cursor: pointer;
          }
          .active-time-xs_icon1 {
            background: rgba(245, 189, 39, 1);
          }
        }
      }
    }
  }
}
</style>
<style lang="scss">
.popper-Select {
  .el-select-dropdown__item.hover,
  .el-select-dropdown__item:hover {
    background-color: #1c233f;
  }
}
</style>
