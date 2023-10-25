
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

    <el-select v-model="selectedvalues" class="selectstyle" @change="handleimageschanged" placeholder="请选择">
      <el-option v-for="(item, index) in preimgaes" :key="item.name" :label="item.title" :value="item.name">
      </el-option>
    </el-select>


  </div>
</template>

<script>


//添加标注的UI
export default {
  name: "addMarker",
  extends: "",
  components: {},
  props: {
    titem: { type: Object },
  },
  computed: {},
  methods: {
    //基本方法,以此来处理每个功能的点击响应操作
    onclick(item) {
      item.checked=!item.checked;
      let pviewer=window.pviewer;
      if(item.checked)
      {
        pviewer.loadPOI();
      }else
      { pviewer.clearMarkers();

      }
       
       
       
    },
    handleimageschanged: function (item) {
      
    }
  },
  mounted() {
    
   
  },
  created() { },
  data() {
    return {
      ishowtools: false,
      preimgaes: [],
      selectedvalues: "google影像",
    };
  },
  watch: {

  },
};
</script>

 