/*rem适配*/
(function (designWidth){
    var size = document.documentElement.clientWidth / (designWidth / 100);
    document.documentElement.style.fontSize = size + "px";
    document.body.style.fontSize = "12px";
})(1080);

/*禁用右键菜单*/
(function (){
    $(document).on("contextmenu", function (e){
        e.preventDefault();
    })
})();

$(function (){
    btnMenu();
    navMove();
    lbt();
    tab();
    verticalScroll();
});

/*面包菜单的显示和隐藏*/
function btnMenu(){
    var isOpen = false;
    $(".menu-btn").on("tap", function (){
        if (isOpen){
            $(".mask").hide();
            $(this).css({
                backgroundPositionY: "0.16rem"
            });
        }else{
            $(".mask").show();
            $(this).css({
                backgroundPositionY: "-1.2rem"
            })
        }
        isOpen = !isOpen;
    });
}

/*导航条左右滚动*/
function navMove(){
    /*导航项目点击之后样式改变*/
    $(".nav li a").on("tap", function (){
        $(this).css({
            backgroundColor: "#690",
            color: "#fff"
        }).parent().siblings().find("a").css({
            backgroundColor: "transparent",
            color: "#020202"
        });
    })

    var minX = -($(".nav").width() - window.innerWidth)
    var startX;
    var deltaX;
    var lastX = 0;
    $(".nav").on("touchstart touchmove touchend", function (e){
        var type = e.type;
        var touch = e.changedTouches[0];
        if (type == "touchstart"){
            startX = touch.clientX;
            $(this).css({
                transition: "none"
            });
        }else if (type == "touchmove"){
            deltaX = (touch.clientX - startX) + lastX;
            if (deltaX >= 200) deltaX = 200;
            if (deltaX <= minX - 200) deltaX = minX - 200;
            $(this).css({
                transform: "translateX(" + deltaX + "px)"
            });
        }else{
            if (deltaX >= 0){
                deltaX = 0;
            }else if (deltaX <= minX){
                deltaX = minX;
            }
            $(this).css({
                transform: "translateX(" + deltaX + "px)",
                transition: "all 400ms cubic-bezier(.29,.61,.8,1.25)"
            });
            lastX = deltaX;
        }
    })
}

/*无缝滑动的轮播图*/
function lbt(){
    var currentIndex = 1;
    var $lbt = $(".lbt");
    var $spans = $(".indicator span");
    var width = window.innerWidth;
    var intervalId;
    var startX;
    var deltaX;
    $lbt.on("transitionend", function (){
        if (currentIndex >= 6){
            currentIndex = 1;
            $(this).css({
                transition: "none",
                transform: "translateX(" + -width + "px)"
            });
        }else if (currentIndex <= 0){
            currentIndex = 5;
            $(this).css({
                transition: "none",
                transform: "translateX(" + -width * 5 + "px)"
            });
        }
        $spans.eq(currentIndex - 1).css({
            backgroundColor: "green"
        }).siblings().css({
            backgroundColor: "red"
        });
    });
    $lbt.on("touchstart touchmove touchend", function (e){
        var touch = e.changedTouches[0];
        var type = e.type;
        if (type == "touchstart"){
            clearInterval(intervalId);
            startX = touch.clientX;
            $lbt.css({
                transition: "none"
            });
        }else if (type == "touchmove"){
            deltaX = touch.clientX - startX;
            $lbt.css({
                transform: "translateX(" + (-currentIndex * width + deltaX) + "px)"
            })
        }else{
            autoPlay();
            currentIndex = -Math.round(deltaX / width) + currentIndex
            $lbt.css({
                transition: "all 0.4s",
                transform: "translateX(" + -currentIndex * width + "px)"
            });

        }
    });

    function play(){
        $lbt.css({
            transition: "all 0.4s",
            transform: "translateX(" + -width * currentIndex + "px)"
        });

    }

    function autoPlay(){
        intervalId = setInterval(function (){
            currentIndex++;
            play();
        }, 2000);
    }

    autoPlay();
}

/*tab选项卡*/
function tab(){
    /*选项卡点击效果*/
    $(".tab .tab_nav a").on("tap", function (){
        $(this).css({
            color: "black",
            fontWeight: "bold"
        }).siblings("a").css({
            color: "#6b6b6b",
            fontWeight: "normal"
        }).parent().find("span").css({
            left: $(this).position().left
        });
    });
    /*滑动选项卡*/
    var width = $(".tab_wrap").width() / 3;
    var startX;
    var deltaX;
    var currentIndexs = [0, 0, 0];
    $(".tab_wrap").on("touchstart touchmove touchend", function (e){
        var type = e.type;
        var touch = e.changedTouches[0];
        if (type == "touchstart"){
            startX = touch.clientX;
        }else if (type == "touchmove"){
            deltaX = touch.clientX - startX;
            if (Math.abs(deltaX) < 60) return;
            deltaX = deltaX > 0 ? (deltaX - 60) : (deltaX + 60);
            $(this).css({
                transition: "none",
                transform: "translateX(" + (-width + deltaX) + "px)"
            });
        }else{
            $(this).css({
                transition: "all 0.4s",
                transform: "translateX(" + (-width + Math.round(deltaX / width) * width) + "px)"
            });
            var i = Array.from($(".tab")).indexOf($(this).parent()[0]);
            currentIndexs[i] += -Math.round(deltaX / width);
            currentIndexs[i] = currentIndexs[i] == 6 ? 0 : currentIndexs[i];
            currentIndexs[i] = currentIndexs[i] == -1 ? 5 : currentIndexs[i];
            $(this).parent().find(".tab_nav a").eq(currentIndexs[i]).trigger("tap");
            setTimeout(function (that){
                $(that).css({
                    transition: "none",
                    transform: "translateX(" + -width + "px)"
                });
            }, 3000, this)
        }
    });

}

/*垂直滚动*/
function verticalScroll(){
    var content = $(".content")[0];
    var hammer = new Hammer(content);
    hammer.get('pan').set({direction: Hammer.DIRECTION_VERTICAL});

    hammer.on("panstart", function (e){
        content.style.transition = "none";
    });
    var lastTY = 0;
    var max = (content.offsetHeight + $(content).offset().top) - window.innerHeight;
    hammer.on("panmove", function (e){
        content.style.transform = "translateY(" + (lastTY + e.deltaY) + "px)"
    });
    hammer.on("panend", function (e){
        lastTY += e.deltaY;
        if (lastTY > 0){
            content.style.transform = "translateY(0)";
            content.style.transition = "all 0.5s";
            lastTY = 0;
        }else if(lastTY <= -max){
            console.log(lastTY);
            content.style.transform = "translateY("+ -max +"px)";
            content.style.transition = "all 0.5s";
            lastTY = -max;
        }

    });

}

