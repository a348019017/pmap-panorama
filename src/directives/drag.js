export const drag = {
  inserted(el) {
    let oDiv = el;

    //  左边距最大值
    let maxLeft = el.parentNode.clientWidth - el.clientWidth;

    //  上边距最大值
    let maxTop = el.parentNode.clientHeight - el.clientHeight;

    oDiv.onmousedown = function (e) {
      //  鼠标按下，计算当前元素距离可视区的距离
      let disX = e.clientX - oDiv.offsetLeft;

      let disY = e.clientY - oDiv.offsetTop;

      document.onmousemove = function (e) {
        //  获取到鼠标拖拽后的横向位移(距离父级元素)
        let l = e.clientX - disX;

        //  获取到鼠标拖拽后的纵向位移(距离父级元素)
        let t = e.clientY - disY;

        oDiv.style.left = l + "px";

        oDiv.style.top = t + "px";

        if (e.clientX - disX <= 0) {
          oDiv.style.left = 0 + "px";
        }

        if (e.clientY - disY <= 0) {
          oDiv.style.top = 0 + "px";
        }

        if (e.clientX - disX >= maxLeft) {
          oDiv.style.left = maxLeft + "px";
        }

        if (e.clientY - disY >= maxTop) {
          oDiv.style.top = maxTop + "px";
        }
      };

      //    松开事件后，移除事件

      document.onmouseup = function () {
        document.onmousemove = null;
        document.onmouseup = null;
      };
    };
  },
};
