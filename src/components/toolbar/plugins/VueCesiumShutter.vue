<script>
import { CesiumShutter } from "@/utils/CesiumShutter";

/**
 * VueCesium卷帘组件，可复写其样式进行扩展
 * #split {
    position: absolute;
    left: 50%;
    top: 0;
    background-color: red;
    width: 3px;
    height: 100%;
}
#split:hover {
    cursor: ew-resize;
}
 */
export default {
    name: "VueCesiumShutter",
    mounted() {
        this.slider = new CesiumShutter("split", {});
        //
    },
    props: {
    titem: { type: Object },
  },
    data(){
        return {
            ishow:false
        }
    },
    methods: {
        //基本方法,以此来处理每个功能的点击响应操作
        onclick(item) {            
            item.checked = !item.checked;
            
            this.ishow=item.checked;
            if(item.checked)
            {
                this.slider.active();
            }else
            {
                this.slider.deactive();
            }
        },
        deactive: function () {

        },
    }
}
</script>

<template>
    <div>
        <div v-show="ishow" id='split'>
            <div class="slider-cirle-box"><p class="icon-slider-cirle"></p></div>
        </div>
    </div>
   
    
</template>

<style lang="scss" scoped>
#split {
    position: fixed;
    left: 50%;
    top: 0;
    background-color: #fff;
    width: 3px;
    height: 100%;
    .slider-cirle-box{
        height: 100%;
        transform: translate(-9px,50%);
        .icon-slider-cirle{        
            width: 16px;
            height: 16px;
            border: 2px solid #409eff;
            background-color: #fff;
            border-radius: 50%;
            transition: .2s;
        }
    }
    
}


#split:hover {
    cursor: ew-resize;
}
</style>
