//---------------------从底部滑出的窗口--------------------------------//

/**
 * 使用说明：首先调用 initSilderDownWin(pWinHeight,pContentHtml,pZIndex)初始化窗口
* 然后调用  toggleSilderDownWin()  开关窗口
 */

/**
 * 公共变量定义
 */


/**
 * 初始化
 */
$(function () {

    //-----加载Css样式表----//
    loadCssFile("../Assets/Lib/SliderDownWin/SliderDownWin.css");
    //loadCssFile("SliderDownWin.css");

    //初始化SliderDown窗口
    //initSilderDownWin(600);

});

/**
 * ----- 加载Css文件 方法 -----
 * @param pHrefPath Css文件的路径 
 * */
function loadCssFile(pHrefPath) {
    var head = document.getElementsByTagName('head')[0];
    var link = document.createElement('link');
    link.href = pHrefPath;
    link.rel = 'stylesheet';
    link.type = 'text/css';
    head.appendChild(link)
}

/**
 * 初始化SliderDown窗口
 * @param {any} pWinHeight 窗口宽度
 * @param pContentHtml 内容显示代码
 */
function initSilderDownWin(pWinHeight, pContentHtml, pZIndex) {

    //console.log("pContentHtml=" + pContentHtml);

    if (pWinHeight == undefined || pWinHeight == "")
    {
        pWinHeight = 600;
    }
    if (pZIndex == undefined || pZIndex == "") {
        pZIndex = 10011
    }
    if (pContentHtml == undefined) {
        pContentHtml == ""
    }

    var myJsVal = "";    myJsVal += " <div class=\"slider-down-win\" id=\"SliderDownWin\" style=\"display:none;\">";    myJsVal += "        <div class=\"slider-down-win-main\">";    myJsVal += "        <\/div>";    myJsVal += "    <\/div>";    //将代码插入到body标签中
    $("body").append(myJsVal);    
    $(".slider-down-win").css("height", pWinHeight);
    $(".slider-down-win").css("display", "none");

    $(".slider-down-win").css("z-index", pZIndex);
    //插入内容Html代码
    $(".slider-down-win-main").html(pContentHtml);

}

/**
 * 开关SliderDown窗口
 */
function toggleSilderDownWin() {

    //判断窗口是否显示出来了
    var _styleDisplay = $(".slider-down-win").css("display");
    //console.log(_styleDisplay);

    var _zIndex = $(".slider-down-win").css("z-index");
    //console.log("_zIndex=" + _zIndex);

    //创建透明遮罩层
    createSliderDownWinMaskLayer("", "SliderDownWinMaskLayer", _zIndex - 1);

    //隐藏状态
    if (_styleDisplay == "none") {


        $(".slider-down-win").css("display","block");

        var _winHeight = $(".slider-down-win").height();
        //console.log("_winHeight=" + _winHeight);
        var _contentHeight = $(".slider-down-win-main").height();
        //console.log("_contentHeight=" + _contentHeight);

        $(".slider-down-win").height("0");

        //显示出来
        $(".slider-down-win").slideDown("fast", function () {

            if (parseFloat(_contentHeight) < parseFloat(_winHeight))
            {
                $(".slider-down-win").height("" + (parseFloat(_contentHeight)) +"px");
            }
            else {
                $(".slider-down-win").height(_winHeight + "px");
            }

        });


    }
    else //显示状态
    {
        //隐藏起来
        $(".slider-down-win").slideUp("fast",function () {

            $(".slider-down-win-main").html("");
            $("div").remove(".slider-down-win");
            $("div").remove(".slider-down-win-main");
            //移除遮罩层
            $("div").remove("#SliderDownWinMaskLayer");

        });
        

       
       
    }



    //设置单击遮罩层关闭窗口
    $("#SliderDownWinMaskLayer").on("click", function () {
        //移除遮罩层
        $("div").remove("#SliderDownWinMaskLayer");
        //开关SliderDown窗口
        toggleSilderDownWin();
    });

}


/*-----------创建透明遮罩层-------------
@ pOpacityNum 透明度 [1-100 ]
@ pMaskLayerDivID 遮罩层的Div的ID
@ pZIndex 遮罩层次
*/
function createSliderDownWinMaskLayer(pOpacityNum, pMaskLayerDivID, pZIndex) {

    if (pOpacityNum == undefined || pOpacityNum == "") {
        pOpacityNum = 40;
    }
    if (pMaskLayerDivID == undefined || pMaskLayerDivID == "") {
        pMaskLayerDivID = "SliderDownWinMaskLayer";
    }
    if (pZIndex == undefined || pZIndex == "") {
        pZIndex = 1;
    }

    //console.log("createMaskLayer,pZIndex=" + pZIndex);

    var _maskLayerDiv = "<div id=\"" + pMaskLayerDivID + "\">   </div>";

    //设置层次 必须在Append之前
    $("#" + pMaskLayerDivID + "").css("z-index", pZIndex);

    //将遮罩层添加到body中去
    $("body").append(_maskLayerDiv);

    //设置布局方式和位置
    $("#" + pMaskLayerDivID + "").css("position", "absolute");
    $("#" + pMaskLayerDivID + "").css("top", "0px");
    $("#" + pMaskLayerDivID + "").css("left", "0px");

    //设置宽高
    $("#" + pMaskLayerDivID + "").css("width", $(document).outerWidth(true));
    $("#" + pMaskLayerDivID + "").css("height", $(document).outerHeight(true));
    //设置背景色
    $("#" + pMaskLayerDivID + "").css("background", "#000000");

    //设置透明度
    try {

        $("#" + pMaskLayerDivID + "").css("opacity", pOpacityNum / 100);
        $("#" + pMaskLayerDivID + "").css("filter", "alpha(opacity=" + pOpacityNum + ")");

    } catch (e) { };

}

