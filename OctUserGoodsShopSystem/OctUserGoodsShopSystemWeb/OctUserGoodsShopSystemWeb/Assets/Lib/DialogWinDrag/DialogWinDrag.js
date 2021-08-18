// ===============  可以被拖动的Dialog窗口   ============= //

//------- 公共变量 -------//
var _winElement = "#dragWinDiv"; //窗口div的ID字符
var _winDragElement = "#dragWinTitle"; //用于拖动窗口的div的ID字符
var _winContentElement = "#dragWinContent"; //显示内容区的div的ID字符

var _winWidth = 600; //窗口的宽度
var _isShowBtnList = true; //是否显示下部按钮区
var _winTitleText = "";
var _contentHtml = ""; //内容区域插入HTML代码
var _isCreateMaskLayer = true; //是否要创建遮罩层

//-------初始化------//
$(function () {

    //-----加载Css样式表----//
    loadCssFile("../Assets/Lib/DialogWinDrag/DialogWinDrag.css");

    //打开Dialog弹出窗口
    //openDialogWinNoClose("可拖动弹出窗口标题", "<div style=\"color:red; height: 400px;\">窗口主本内容区窗口主本内容区</div>", function () {

    //    //toastDialogDragWinNoClose("确认操作确认操作！");
    //    toastDialogDragWin("确认操作确认操作！");

    //    return;

    //}, function () {


    //}, 300);

    //var _xhtml = "<b>窗口内容</b><input type='button' id='btnCustomDialogWinOk' value='确定'>";
    //_xhtml += "<input type='button' id='btnCustomDialogWinCancel' value='取消'>";


    //openCustomDialogWin("自定义窗口11", _xhtml, function () {
    //    console.log("确定啦");
    //}, function () {
    //    console.log("取消啦");
    //}, 600, true);

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
    head.appendChild(link);
}


/**
 * 打开Dialog弹出窗口
 * @param pWinTitle 窗口标题
 * @param {any} pContentHtml 内容HTML
 * @param pCallBackOk 确定回调函数
 * @param pCallBackCancel 取消回调函数
 * @param {any} pWinWidth 窗口宽度 [可选]
 * @param {any} pIsShowBtnList 是否显示下部按钮区 [可选]
 * @param {any} pIsCreateMaskLayer 是否要创建遮罩层 [可选]
 */
function openDialogWin(pWinTitle, pContentHtml, pCallBackOk, pCallBackCancel, pWinWidth, pIsShowBtnList, pIsCreateMaskLayer) {

    if (pWinTitle == undefined || pWinTitle == "") {
        pWinTitle = "";
    }
    if (pContentHtml == undefined || pContentHtml == "") {
        pContentHtml = "";
    }
    if (pCallBackOk == undefined || pCallBackOk == "") {
        pCallBackOk = function () { };
    }
    if (pCallBackCancel == undefined || pCallBackCancel == "") {
        pCallBackCancel = function () { };
    }

    if (pWinWidth == undefined || pWinWidth == "") {
        pWinWidth = 600;
    }
    if (pIsShowBtnList == undefined || pIsShowBtnList == "") {
        pIsShowBtnList = true;
    }
    if (pIsCreateMaskLayer == undefined || pIsCreateMaskLayer == "") {
        pIsCreateMaskLayer = true;
    }

    //窗口的标题字符串
    var _winTitleText = pWinTitle;


    //判断Dialog窗口是否已打开
    //alert($("#dragWinDiv").length);
    if ($("#dragWinDiv").length > 0) {
        return;
    }

    _winWidth = pWinWidth; //窗口的宽度
    _isShowBtnList = pIsShowBtnList; //是否显示下部按钮区
    _contentHtml = pContentHtml; //内容区域插入HTML代码

    _isCreateMaskLayer = pIsCreateMaskLayer; //是否要创建遮罩层


    //构造窗口的HTML代码
    structureDialogWinHtml();


    //处理移动的函数
    DialogWinDrag()
    //设置被 拖动的窗口高宽
    setWindWidthHeight();

    //内容区域插入HTML代码
    insertContentHtml(_contentHtml);

    //修改窗口的标题
    $("#winTitleSpan").html(_winTitleText);

    //窗口居中显示
    alignCenterDragWin();



    //设置【确定】按钮的单击事件
    $("#btnDialogWinOk").click(function () {
        //alert("哈合");
        pCallBackOk();

        //关闭Dialog窗口
        closeDialogWin();
    });
    //设置【取消】按钮的单击事件
    $("#btnDialogWinCancel").click(function () {

        pCallBackCancel();

        //关闭Dialog窗口
        closeDialogWin();
    });
}


/**
 * 打开Dialog弹出窗口 确定后不关闭窗口，需调用关闭窗口函数  closeDialogWin();
 * @param pWinTitle 窗口标题
 * @param {any} pContentHtml 内容HTML
 * @param pCallBackOk 确定回调函数
 * @param pCallBackCancel 取消回调函数
 * @param {any} pWinWidth 窗口宽度 [可选]
 * @param {any} pIsShowBtnList 是否显示下部按钮区 [可选]
 * @param {any} pIsCreateMaskLayer 是否要创建遮罩层 [可选]
 */
function openDialogWinNoClose(pWinTitle, pContentHtml, pCallBackOk, pCallBackCancel, pWinWidth, pIsShowBtnList, pIsCreateMaskLayer) {

    if (pWinTitle == undefined || pWinTitle == "") {
        pWinTitle = "";
    }
    if (pContentHtml == undefined || pContentHtml == "") {
        pContentHtml = "";
    }
    if (pCallBackOk == undefined || pCallBackOk == "") {
        pCallBackOk = function () { };
    }
    if (pCallBackCancel == undefined || pCallBackCancel == "") {
        pCallBackCancel = function () { };
    }

    if (pWinWidth == undefined || pWinWidth == "") {
        pWinWidth = 600;
    }
    if (pIsShowBtnList == undefined || pIsShowBtnList == "") {
        pIsShowBtnList = true;
    }
    if (pIsCreateMaskLayer == undefined || pIsCreateMaskLayer == "") {
        pIsCreateMaskLayer = true;
    }

    //窗口的标题字符串
    var _winTitleText = pWinTitle;


    //判断Dialog窗口是否已打开
    //alert($("#dragWinDiv").length);
    if ($("#dragWinDiv").length > 0) {
        return;
    }

    _winWidth = pWinWidth; //窗口的宽度
    _isShowBtnList = pIsShowBtnList; //是否显示下部按钮区
    _contentHtml = pContentHtml; //内容区域插入HTML代码

    _isCreateMaskLayer = pIsCreateMaskLayer; //是否要创建遮罩层


    //构造窗口的HTML代码
    structureDialogWinHtml();


    //处理移动的函数
    DialogWinDrag()
    //设置被 拖动的窗口高宽
    setWindWidthHeight();

    //内容区域插入HTML代码
    insertContentHtml(_contentHtml);

    //修改窗口的标题
    $("#winTitleSpan").html(_winTitleText);

    //窗口居中显示
    alignCenterDragWin();

    //设置关闭按钮单击事件
    //$("#winCloseSpan").click(function () {
    //    //关闭Dialog窗口
    //    closeDialogWin();
    //});

    //设置【确定】按钮的单击事件
    $("#btnDialogWinOk").click(function () {
        //alert("哈合");
        //$.mDialogWinSetting.ObjectProperty.FunDialogWinOk();
        pCallBackOk();

        //关闭Dialog窗口
        //closeDialogWin();
    });
    //设置【取消】按钮的单击事件
    $("#btnDialogWinCancel").click(function () {
        //$.mDialogWinSetting.ObjectProperty.FunDialogWinCancel();
        pCallBackCancel();

        //关闭Dialog窗口
        closeDialogWin();
    });
}



//------处理移动的函数-----//
function DialogWinDrag() {
    var _move = false;//移动标记  
    var _x, _y;//鼠标离控件左上角的相对位置  

    $(_winDragElement).click(function () {
        //alert("click");//点击（松开后触发）  
    }).mousedown(function (e) {
        _move = true;
        _x = e.pageX - parseInt($(_winElement).css("left"));
        _y = e.pageY - parseInt($(_winElement).css("top"));
        $(_winElement).fadeTo(20, 0.5);//点击后开始拖动并透明显示  
    });
    $(document).mousemove(function (e) {
        if (_move) {
            var x = e.pageX - _x;//移动时根据鼠标位置计算控件左上角的绝对位置  
            var y = e.pageY - _y;
            $(_winElement).css({ top: y, left: x });//控件新位置  
        }
    }).mouseup(function () {
        _move = false;
        $(_winElement).fadeTo("fast", 1);//松开鼠标后停止移动并恢复成不透明  
    });

    //判断是否要显示下部按钮区
    if (_isShowBtnList == true) {
        $("#dragWinBtnList").css("display", "block");
    }
    else {
        $("#dragWinBtnList").css("display", "none");
    }

    //判断是否需要创建遮罩层
    if (_isCreateMaskLayer == true) {
        createDragMaskLayer();
    }
}

//-----------设置被 拖动的窗口高宽---------------//
function setWindWidthHeight() {
    $(_winElement).width(_winWidth);
    //$(_winElement).height(_winHeight);
    //设置内容的高度
    //$(_winContentElement).height(_winContentHeight);
    //判断浏览器的类型
    var _browserType = IsBrowserType();
    if (_browserType == "Firefox") {
        //$(_winContentElement).height(parseInt(_winContentHeight) - 8);
    }
}

//----------窗口居中显示----------//
function alignCenterDragWin() {


    $(window).resize(function () {
        $(_winElement).css({
            position: 'absolute',
            left: ($(window).width() - $(_winElement).outerWidth()) / 2,
            top: ($(window).height() - $(_winElement).outerHeight()) / 2 + $(document).scrollTop()
        });
    });
    //重设窗口尺寸
    $(window).resize();
}

//----------内容区域插入HTML代码------//
function insertContentHtml(pContentHtml) {
    if (pContentHtml != null) {
        $("#dragWinContent").html(pContentHtml);
    }
}

//-----------创建透明遮罩层-------------//
function createDragMaskLayer() {
    var _maskLayerDiv = "<div id=\"DailogWinMaskLayer\">  </div>";
    //将遮罩层添加到body中去
    $("body").append(_maskLayerDiv);

    //设置布局方式和位置
    $("#DailogWinMaskLayer").css("position", "absolute");
    $("#DailogWinMaskLayer").css("top", "0px");
    $("#DailogWinMaskLayer").css("left", "0px");
    //设置层次
    $("#DailogWinMaskLayer").css("z-index", 100);
    //设置Dialog窗口的层次
    $("#dragWinDiv").css("z-index", 101);
    //设置宽高
    $("#DailogWinMaskLayer").css("width", $(document).outerWidth(true));
    $("#DailogWinMaskLayer").css("height", $(document).outerHeight(true));
    //设置背景色
    $("#DailogWinMaskLayer").css("background", "#000000");
    //设置透明度
    try {
        $("#DailogWinMaskLayer").css("opacity", 0.3);
        $("#DailogWinMaskLayer").css("filter", "alpha(opacity=30)");
    } catch (e) { };

}


//--------------判断用户浏览器的类型--------------//
function IsBrowserType() {
    var explorer = navigator.userAgent;
    //alert(explorer);

    //ie 
    if (explorer.indexOf("MSIE") >= 0) {
        //alert("ie");
        return "ie"
    }
    //firefox 
    else if (explorer.indexOf("Firefox") >= 0) {
        //alert("Firefox");
        return "Firefox";
    }
    //Chrome
    else if (explorer.indexOf("Chrome") >= 0) {
        //alert("Chrome");
        return "Chrome";
    }
    //Opera
    else if (explorer.indexOf("Opera") >= 0) {
        //alert("Opera");
        return "Opera";
    }
    //Safari
    else if (explorer.indexOf("Safari") >= 0) {
        //alert("Safari");
        return "Safari";
    }
    //Netscape
    else if (explorer.indexOf("Netscape") >= 0) {
        //alert('Netscape'); 
        return "Netscape";
    }
}


//关闭Dialog窗口
function closeDialogWin() {
    //$(_winElement).css("display","none");
    //移除样式代码
    //$("style").remove("style[title=winDialogStyleCss]");
    //移除遮罩层
    $("div").remove("#DailogWinMaskLayer");
    //移除Dialog窗口代码
    $("div").remove("#dragWinDiv");
}



//构造窗口的HTML代码
function structureDialogWinHtml() {


    var winHtml = "";
    winHtml += "<div id=\"dragWinDiv\">";
    winHtml += "        ";
    winHtml += "        <div id=\"dragWinTitle\" style=\"text-align:center\">";
    winHtml += "           <div id=\"winTitleSpan\">被拖动的窗口<\/div>";
    //winHtml += "           被拖动的窗口";
    //winHtml += "           <span id=\"winCloseSpan\">×<\/span>";
    winHtml += "        <\/div>";
    winHtml += "        ";
    winHtml += "        <div id=\"dragWinContent\">";
    winHtml += "            ";
    winHtml += "        <\/div>";
    winHtml += "        ";
    winHtml += "        <div id=\"dragWinBtnList\">";

    winHtml += "<div id=\"btnDialogWinCancel\">取消</div>";
    winHtml += "<div id=\"btnDialogWinOk\">确定</div>";

    //winHtml += "            <input id=\"btnDialogWinCancel\" type=\"button\" value=\"取 消\" \/>";
    //winHtml += "            <input id=\"btnDialogWinOk\" type=\"button\" value=\"确 定\" \/>";

    winHtml += "        <\/div>";
    winHtml += "        ";
    winHtml += "<\/div>";
    //将代码插入到body标签中
    $("body").append(winHtml);
}


/***********************  Dialog 窗口 有标题栏，其他的完全自定义 ************************************/

/**
 * 打开完全自定义的Dialog弹出窗口 标题栏不可自定义 
 * 只要将确认按钮ID设置 【btnCustomDialogWinOk】
 * 取消按钮ID设置为【btnCustomDialogWinCancel】  就可以实现回调
 * @param pWinTitle 窗口标题
 * @param {any} pContentHtml 内容HTML
 * @param pBtnOkIsCloseWin 确定回调后，是否关闭窗口
 * @param pCallBackOk 确定回调函数
 * @param pCallBackCancel 取消回调函数
 * @param {any} pWinWidth 窗口宽度 [可选]
 * @param {any} pIsCreateMaskLayer 是否要创建遮罩层 [可选]
 */
function openCustomDialogWin(pWinTitle, pContentHtml, pWinWidth, pBtnOkIsCloseWin, pCallBackOk, pCallBackCancel,  pIsCreateMaskLayer) {

    if (pWinTitle == undefined || pWinTitle == "") {
        pWinTitle = "";
    }
    if (pContentHtml == undefined || pContentHtml == "") {
        pContentHtml = "";
    }
    if (pBtnOkIsCloseWin == undefined || pBtnOkIsCloseWin == "") {
        pBtnOkIsCloseWin = true;
    }

    if (pCallBackOk == undefined || pCallBackOk == "") {
        pCallBackOk = function () { };
    }
    if (pCallBackCancel == undefined || pCallBackCancel == "") {
        pCallBackCancel = function () { };
    }

    if (pWinWidth == undefined || pWinWidth == "") {
        pWinWidth = 600;
    }
    if (pIsCreateMaskLayer == undefined || pIsCreateMaskLayer == "") {
        pIsCreateMaskLayer = true;
    }



    //窗口的标题字符串
    var _winTitleText = pWinTitle;


    //判断Dialog窗口是否已打开
    //alert($("#dragWinDiv").length);
    if ($("#dragCustomWinDiv").length > 0) {
        return;
    }

    _winWidth = pWinWidth; //窗口的宽度
    //_isShowBtnList = pIsShowBtnList; //是否显示下部按钮区
    _contentHtml = pContentHtml; //内容区域插入HTML代码

    _isCreateMaskLayer = pIsCreateMaskLayer; //是否要创建遮罩层



    //构造窗口的HTML代码
    buildCustomDialogWinHtml();
    //structureDialogWinHtml();

    //处理移动的函数
    DialogCustomWinDrag()
    //设置被 拖动的窗口高宽
    setCustomWindWidthHeight();

    //内容区域插入HTML代码
    insertCustomContentHtml(_contentHtml);

    //修改窗口的标题
    $("#winCustomTitleSpan").html(_winTitleText);

    //窗口居中显示
    alignCustomCenterWin();



    try {
        //设置【确定】按钮的单击事件
        $("#btnCustomDialogWinOk").click(function () {
            //alert("哈合");
            pCallBackOk();

            //关闭Dialog窗口
            //closeCustomDialogWin();
        });
    }
    catch (e) { }


    try {
        //设置【取消】按钮的单击事件
        $("#btnCustomDialogWinCancel").click(function () {

            pCallBackCancel();

            if (pBtnOkIsCloseWin == true) {
                //关闭Dialog窗口
                closeCustomDialogWin();
            }

        });
    } catch (e) { }

    try {
        //设置【X】按钮的单击事件
        $("#winCustomCloseSpan").click(function () {

            pCallBackCancel();

            //关闭Dialog窗口
            closeCustomDialogWin();
        });
    } catch (e) { }




}


//构造窗口的HTML代码
function buildCustomDialogWinHtml() {


    var winHtml = "";
    winHtml += "<div id=\"dragCustomWinDiv\">";
    winHtml += "        ";
    winHtml += "        <div id=\"dragCustomWinTitle\">";
    winHtml += "           <div id=\"winCustomTitleSpan\">被拖动的窗口<\/div>";
    //winHtml += "           被拖动的窗口";
    winHtml += "           <div id=\"winCustomCloseSpan\">×<\/div>";
    winHtml += "        <\/div>";
    winHtml += "        ";
    winHtml += "        <div id=\"dragCustomWinContent\">";
    winHtml += "         sdfsdfsdfsdfwerwer   ";
    winHtml += "        <\/div>";
    winHtml += "        ";
    //winHtml += "        <div id=\"dragWinBtnList\">";

    //winHtml += "<div id=\"btnDialogWinCancel\">取消</div>";
    //winHtml += "<div id=\"btnDialogWinOk\">确定</div>";

    //winHtml += "        <\/div>";
    winHtml += "<\/div>";

    //将代码插入到body标签中
    $("body").append(winHtml);

}


//------处理移动的函数-----//
function DialogCustomWinDrag() {
    var _move = false;//移动标记  
    var _x, _y;//鼠标离控件左上角的相对位置  

    $("#dragCustomWinTitle").click(function () {
        //alert("click");//点击（松开后触发）  
    }).mousedown(function (e) {
        _move = true;
        _x = e.pageX - parseInt($("#dragCustomWinDiv").css("left"));
        _y = e.pageY - parseInt($("#dragCustomWinDiv").css("top"));
        $("#dragCustomWinDiv").fadeTo(20, 0.5);//点击后开始拖动并透明显示  
    });
    $(document).mousemove(function (e) {
        if (_move) {
            var x = e.pageX - _x;//移动时根据鼠标位置计算控件左上角的绝对位置  
            var y = e.pageY - _y;
            $("#dragCustomWinDiv").css({ top: y, left: x });//控件新位置  
        }
    }).mouseup(function () {
        _move = false;
        $("#dragCustomWinDiv").fadeTo("fast", 1);//松开鼠标后停止移动并恢复成不透明  
    });

    //判断是否要显示下部按钮区
    //if (_isShowBtnList == true) {
    //    $("#dragWinBtnList").css("display", "block");
    //}
    //else {
    //    $("#dragWinBtnList").css("display", "none");
    //}

    //判断是否需要创建遮罩层
    if (_isCreateMaskLayer == true) {
        createDragMaskLayerCustom();
    }
}


//----------内容区域插入HTML代码------//
function insertCustomContentHtml(pContentHtml) {
    if (pContentHtml != null) {
        $("#dragCustomWinContent").html(pContentHtml);
    }
}


//-----------创建透明遮罩层-------------//
function createDragMaskLayerCustom() {
    var _maskLayerDiv = "<div id=\"DailogCustomWinMaskLayer\">  </div>";
    //将遮罩层添加到body中去
    $("body").append(_maskLayerDiv);

    //设置布局方式和位置
    $("#DailogCustomWinMaskLayer").css("position", "absolute");
    $("#DailogCustomWinMaskLayer").css("top", "0px");
    $("#DailogCustomWinMaskLayer").css("left", "0px");
    //设置层次
    $("#DailogCustomWinMaskLayer").css("z-index", 100);
    //设置Dialog窗口的层次
    $("#dragCustomWinDiv").css("z-index", 101);
    //设置宽高
    $("#DailogCustomWinMaskLayer").css("width", $(document).outerWidth(true));
    $("#DailogCustomWinMaskLayer").css("height", $(document).outerHeight(true));
    //设置背景色
    $("#DailogCustomWinMaskLayer").css("background", "#000000");
    //设置透明度
    try {
        $("#DailogCustomWinMaskLayer").css("opacity", 0.3);
        $("#DailogCustomWinMaskLayer").css("filter", "alpha(opacity=30)");
    } catch (e) { };
}


//-----------设置被 拖动的窗口高宽---------------//
function setCustomWindWidthHeight() {
    $("#dragCustomWinDiv").width(_winWidth);
    //$(_winElement).height(_winHeight);
    //设置内容的高度
    //$(_winContentElement).height(_winContentHeight);
    //判断浏览器的类型
    var _browserType = IsBrowserType();
    if (_browserType == "Firefox") {
        //$(_winContentElement).height(parseInt(_winContentHeight) - 8);
    }
}

//----------窗口居中显示----------//
function alignCustomCenterWin() {


    $(window).resize(function () {
        $("#dragCustomWinDiv").css({
            position: 'absolute',
            left: ($(window).width() - $("#dragCustomWinDiv").outerWidth()) / 2,
            top: ($(window).height() - $("#dragCustomWinDiv").outerHeight()) / 2 + $(document).scrollTop()
        });
    });
    //重设窗口尺寸
    $(window).resize();
}

//关闭Dialog窗口
function closeCustomDialogWin() {
    //$(_winElement).css("display","none");
    //移除样式代码
    //$("style").remove("style[title=winDialogStyleCss]");
    //移除遮罩层
    $("div").remove("#DailogCustomWinMaskLayer");
    //移除Dialog窗口代码
    $("div").remove("#dragCustomWinDiv");
}


/*************************** Toast窗口，没有用到了 *******************************************************/

///**
// *  -----弹出Toast提示窗口,指定遮罩到具体Div上-----
// * @param {any} pWinContent 提示的内容
// * @param pCallBackClose 关闭回调函数 [可选]
// */
//function toastDialogDragWin(pWinContent, pCallBackClose) {

//    //构建Toast的Html显示代码
//    buildHtmlToastDialogDragWin(pWinContent, undefined, pCallBackClose)
//}

///**
// *  -----弹出Toast提示窗口,不会自动关闭 需调用closeToastDialogDragWin()-----
// * @param {any} pWinContent 提示内容
// */
//function toastDialogDragWinNoClose(pWinContent) {

//    //构建Toast的Html显示代码
//    buildHtmlToastDialogDragWin(pWinContent, false, undefined);

//}


///**
// *----  构建Toast的Html显示代码 ---
// * @param {any} pWinContent 提示的内容
// * @param pIsClose 是否自动关闭窗口
// * @param pCallBackClose 关闭回调函数
// */
//function buildHtmlToastDialogDragWin(pWinContent, pIsAutoClose, pCallBackClose) {
//    console.log("pIsAutoClose=" + pIsAutoClose);


//    if (pIsAutoClose == undefined) {
//        pIsAutoClose = true;
//    }

//    if (pCallBackClose == undefined || pCallBackClose == "") {
//        pCallBackClose = function () { };
//    }



//    var pCloseTime = 1500;
//    var pBgColor = "black";

//    var myJsVal = "";
//    myJsVal += "    <div class=\"toast-dialog-win-main\">";
//    myJsVal += "" + pWinContent + "";
//    myJsVal += "    <\/div>";

//    //设置窗口层次 必须在添加Append之前，否则无效
//    $(".toast-dialog-win-main").css("z-index", "1000");

//    //将代码插入到body标签中
//    $("#dragWinDiv").append(myJsVal);

//    //设置窗口的样式
//    $(".toast-dialog-win-main").css("font-size", "14px");
//    $(".toast-dialog-win-main").css("background", pBgColor);
//    if (pBgColor == "black") {
//        $(".toast-dialog-win-main").css("color", "white");
//    }
//    else {
//        $(".toast-dialog-win-main").css("color", "black");
//    }

//    //必须在这里设置窗口的Left和position值 这样才不会出现窗口不能水平居中情况
//    $(".toast-dialog-win-main").css({
//        position: 'absolute',
//        left: ($("#dragWinDiv").width() - $(".toast-win-main").outerWidth()) / 2,
//        //top: ($(window).height() - $(".toast-win-main").outerHeight()) / 2 + $(document).scrollTop()
//    });

//    //Toast窗口居中显示
//    alignCenterToastDialogWin();

//    //创建遮罩层
//    createDialogDragMaskLayerToDivID("dragWinDiv");

//    if (pIsAutoClose) {
//        //关闭移除Toast窗口
//        setTimeout(function () {

//            closeToastDialogDragWin();

//            //关闭回调
//            pCallBackClose();

//        }, pCloseTime);
//    }

//}


////----------窗口居中显示----------//
//function alignCenterToastDialogWin() {

//    $(window).resize(function () {

//        $(".toast-dialog-win-main").css({
//            position: 'absolute',
//            left: ($("#dragWinDiv").width() - $(".toast-dialog-win-main").outerWidth()) / 2,
//            top: ($("#dragWinDiv").height() - $(".toast-dialog-win-main").outerHeight()) / 2 + $(document).scrollTop()
//        });


//    });
//    //重设窗口尺寸
//    $(window).resize();
//}

///**
// * 关闭移除Toast窗口
// */
//function closeToastDialogDragWin() {

//    //移除遮罩层
//    $("div").remove("#DailogDragWinMaskLayerToDiv");

//    //移除Dialog窗口代码
//    $("div").remove(".toast-dialog-win-main");
//    //移除样式代码
//    //$("style").remove("style[title=winToastDialogStyleCss]");
//}


///**
// * ----创建透明遮罩层 指定插入Div层-----
// * @param pMaskLayerAppendDivID 插入遮罩层Div的ID
// * @param {any} pOpacityNum 透明度
// * @param {any} pMaskLayerDivID 遮罩层DIV的ID
// * @param {any} pZIndex 层次
// */
//function createDialogDragMaskLayerToDivID(pMaskLayerAppendDivID, pOpacityNum, pMaskLayerDivID, pZIndex) {

//    if (pOpacityNum == undefined || pOpacityNum == "") {
//        pOpacityNum = 40;
//    }
//    if (pMaskLayerDivID == undefined || pMaskLayerDivID == "") {
//        pMaskLayerDivID = "DailogDragWinMaskLayerToDiv";
//    }
//    if (pZIndex == undefined || pZIndex == "") {
//        pZIndex = 1;
//    }

//    //console.log("createMaskLayer,pZIndex=" + pZIndex);

//    var _maskLayerDiv = "<div id=\"" + pMaskLayerDivID + "\">  </div>";

//    //设置层次 必须在Append之前
//    $("#" + pMaskLayerDivID + "").css("z-index", pZIndex);

//    //将遮罩层添加到body中去
//    $("#" + pMaskLayerAppendDivID + "").append(_maskLayerDiv);

//    //设置布局方式和位置
//    $("#" + pMaskLayerDivID + "").css("position", "absolute");
//    $("#" + pMaskLayerDivID + "").css("top", "0px");
//    $("#" + pMaskLayerDivID + "").css("left", "0px");

//    //设置宽高
//    $("#" + pMaskLayerDivID + "").css("width", $("#" + pMaskLayerAppendDivID).outerWidth(true));
//    $("#" + pMaskLayerDivID + "").css("height", $("#" + pMaskLayerAppendDivID).outerHeight(true));
//    //$("#" + pMaskLayerDivID + "").css("width", 500);
//    //$("#" + pMaskLayerDivID + "").css("height", 500);
//    //设置背景色
//    $("#" + pMaskLayerDivID + "").css("background", "#000000");
//    //设置透明度
//    if ($.support.opacity == true) {
//        $("#" + pMaskLayerDivID + "").css("opacity", pOpacityNum / 100);
//    }
//    else {
//        $("#" + pMaskLayerDivID + "").css("filter", "alpha(opacity=" + pOpacityNum + ")");
//    }
//}


