;(function (window, document, $){
    /*
    参数1:让哪个元素拖动的时候可以滚动
    参数2:滚动的方向
    */
    function flexScroll(ele, direction, initTranslateX, initTranslateY){
        if (direction.toLowerCase() == "v"){
            vertical(ele, initTranslateX, initTranslateY);
        }else if (direction.toLowerCase() == "h"){
            horizontal(ele, initTranslateX, initTranslateY)
        }
    }

    /*垂直方向*/
    function vertical(ele, initTranslateX, initTranslateY){

    }

    /*水平方向*/
    function horizontal(ele, initTranslateX, initTranslateY){
        ele.addEventListener("touchstart", listener);
        ele.addEventListener("touchmove", listener);
        ele.addEventListener("touchend", listener);

        var startX, deltaX;

        function listener(e){
            var type = e.type,
                touch = e.changedTouches[0];
            if (type == "touchstart"){
                startX = touch.clientX;
            }else if (type == "touchmove"){
                deltaX = touch.clientX - startX;
                var tx = initTranslateX + deltaX;
                if(Math.abs(tx) < 16) return;
                ele.style.transform = "translate(" + tx + "px, " + initTranslateY + "px)"
            }else{

            }
        }
    }

    window.flexScroll = flexScroll;
})(window, document, Zepto);