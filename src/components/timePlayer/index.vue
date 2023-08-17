
<style scoped>

</style>
<template>
  <div v-if="showtool">
      <timeline></timeline>
  </div>
</template>

<script>

import timeline from "./timeLine.vue"

export default {
  name: "CesiumTimeLine",
  extends: "",
  components: {timeline},
  props: {
    titem: { type: Object },
  },
  computed: {},
  methods: {
    //基本方法,以此来处理每个功能的点击响应操作
    onclick (item) { 
       item.checked=!item.checked;
        this.showtool=item.checked;
    },
    deactive () {
       
    },
  },
  mounted() {

    
  },
  created() { },
  data() {
    return {
        showtool:false,
    };
  },
  watch: {
     
  },
};
</script>

 