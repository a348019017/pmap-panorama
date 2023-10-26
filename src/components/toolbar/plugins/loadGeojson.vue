
<style lang="scss" scoped>
.toolbarstyle {
  top: 40px;
  left: 0px;
  width: 140px;
  position: absolute;

  .iconstyle {
    font-size: 24px;
    width: 32px;
    height: 32px;
    display: inline-block;
    vertical-align: middle
  }

  .selectstyle {
    width: 100px;
  }

  .el-checkbox__input {
    background: rgba(13, 71, 161, 0.7);
  }

  .el-button {
    border: 1px solid #00dad8;
    background: rgba(13, 71, 161, 0.7);
  }

  .el-button {
    color: #ffffff;
    font-size: 18px;
  }

  .el-checkbox {
    color: #ffffff;
  }
}
</style>
<template>
  <div v-if="ishowtools" class="toolbarstyle">
    <span>
      <img class="iconstyle" src="@/assets/img/play_3x.png" />
    </span>

    <!-- <el-select v-model="selectedvalues" class="selectstyle" @change="handleimageschanged" placeholder="请选择">
      <el-option v-for="(item, index) in preimgaes" :key="item.name" :label="item.title" :value="item.name">
      </el-option>
    </el-select> -->


  </div>
</template>

<script>
import {GeoJSONLoader} from "../../../utils/geojsonloader"

//加载Geojson的UI
export default {
  name: "loadgeojson",
  extends: "",
  components: {},
  props: {
    titem: { type: Object },
  },
  computed: {},
  methods: {
    //基本方法,以此来处理每个功能的点击响应操作
    onclick(item) {
      
      //测试打开文件选择
      const inpEle = document.createElement("input");
      inpEle.id = `__file_${Math.trunc(Math.random() * 100000)}`;
      inpEle.type = "file";
      inpEle.style.display = "none";
      // 文件类型限制
      //accept && (inpEle.accept = accept);
      // 多选限制
      //multiple && (inpEle.multiple = multiple);
      inpEle.addEventListener("change", this.handleData, {once: true});
      inpEle.click();

       
    },
    handleData(element,dt){
        let file=element.target.files[0];
        let that=this;
        if(file)
        {
          file.text().then(dt=>{
             let obj=JSON.parse(dt);
             that.geoloader.loadGeoJSON(obj,'test');
          })
        }
    },
  },
  mounted() {
    this.geoloader=new GeoJSONLoader(window.pviewer);
    //this.geoloader.loadGeoJSON()
  },
  created() { },
  data() {
    return {
      ishowtools: false,
    };
  },
  watch: {

  },
};
</script>

 