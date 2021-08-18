// =============自定义弹出的Alert,Comfirm,Toast,loadingWin, ActionSheet的Win窗口============= //


/*
--------初始化----------
*/
$(function () {

    //-----加载Css样式表----//
    loadCssFile("../Assets/Lib/AlertConfirmWin/AlertConfirmWin.css");


    //弹出Alert窗口
    //alertWinCb("带回调的Alert窗口！", function () {

    //    alertWin("窗口第二次弹出", 200, "", 60);

    //});
    //alertWinWidth("指定宽度的Alert窗口", "200","","", 100);
    //confirmWin("确认窗口内容", function () {
    //    //alert("确认成功!");
    //    alertWin("确认成功!");
    //});

    //confirmWinCCb("可确认与取消的Confirm窗口", function () {
    //    toastWin("确认成功!");
    //}, function () {
    //    toastWin("取消成功!");
    //});

    //toastWin("提示成功");
    //toastWinCb("关闭提示回调", function () {
    //    toastWinNoClose("关闭成功!");

    //    //closeToastWin();
    //});

    //自定义内容的Confirm窗口
    //confirmHtmlWin("自定义Confirm窗口标题", "<div style=\"font-size: 20px; color: red;height:200px\">内容区域</div>", function () {


    //    //toastWin("确定回调");
    //    toastWinToDiv("确定回调", "ConfirmHtmlMain");


    //},
    //    function () {

    //        toastWin("取消回调");

    //    });

    //actionSheetWin("<div style=\"height: 300px;\">你好吗？</div>", function () {
    //    toastWinToDiv("ActionSheet回调成功", "ActionSheetWin");
    //});
    //构造ActionSheet窗口 HTML代码
    //buildActionSheetHtmlWin("<div style=\"height: 300px;\">你好吗？</div>",1000);

    //弹出加载窗口
    //loadingWinStyle();
    //buildLoadingHtmlWin(1000);

    //closeLoadingWin();
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
 * --------弹出Alert窗口--------
 * @param {any} pWinContent 提示内容
 * @param {any} pZIndex 窗口层次 [可选]
 * @param {any} pMaskLayerDivID 遮罩层标签ID [可选]
 * @param {any} pMaskLayerOpacity 遮罩层透明度 [可选]
 */
function alertWin(pWinContent, pZIndex, pMaskLayerDivID, pMaskLayerOpacity) {

    //移除之前弹出的标签
    closeAlertConfirmWin(pMaskLayerDivID);

    //构造Html显示代码, 并添加到Body中去
    buildHtmlAlertConfirmWin("提示信息", pWinContent, false, "", pMaskLayerDivID, pMaskLayerOpacity, pZIndex);

    //确定按钮事件
    $("#BtnAlertConfirmWinOk").on("click", function () {

        //关闭窗口
        closeAlertConfirmWin(pMaskLayerDivID);

    });
}
/**
 * -------弹出Alert窗口 带自定义标题-------
 * @param {any} pWinTitle 窗口标题
 * @param {any} pWinContent 提示内容
 * @param {any} pZIndex 窗口层次 [可选]
 * @param {any} pMaskLayerDivID 遮罩层标签ID [可选]
 * @param {any} pMaskLayerOpacity 遮罩层透明度 [可选]
 */
function alertWinTitle(pWinTitle, pWinContent, pZIndex, pMaskLayerDivID, pMaskLayerOpacity) {

    //移除之前弹出的窗口
    closeAlertConfirmWin(pMaskLayerDivID);

    //构造Html显示代码, 并添加到Body中去
    buildHtmlAlertConfirmWin(pWinTitle, pWinContent, false, "", pMaskLayerDivID, pMaskLayerOpacity, pZIndex);

    //确定按钮事件
    $("#BtnAlertConfirmWinOk").on("click", function () {

        //关闭窗口
        closeAlertConfirmWin(pMaskLayerDivID);

    });
}

/**
 * ------弹出Alert窗口 指定窗口宽度 ---------
 * @param {any} pWinContent 提示内容
 * @param {any} pWinWidth 指定的窗口宽度
 * @param {any} pZIndex 窗口层次 [可选]
 * @param {any} pMaskLayerDivID 遮罩层标签ID [可选]
 * @param {any} pMaskLayerOpacity 遮罩层透明度 [可选]
 */
function alertWinWidth(pWinContent, pWinWidth, pZIndex, pMaskLayerDivID, pMaskLayerOpacity) {
    //移除之前弹出的窗口
    closeAlertConfirmWin(pMaskLayerDivID);

    //构造Html显示代码, 并添加到Body中去
    buildHtmlAlertConfirmWin("提示信息", pWinContent, false, pWinWidth, pMaskLayerDivID, pMaskLayerOpacity, pZIndex);

    //构造Html显示代码, 并添加到Body中去
    //buildHtmlAlertConfirmWin("提示信息", pWinContent, false, pWinWidth);

    //确定按钮事件
    $("#BtnAlertConfirmWinOk").on("click", function () {

        //关闭窗口
        closeAlertConfirmWin(pMaskLayerDivID);

    });
}

/**
 * ------弹出Alert窗口 带回调--------
 * @param {any} pWinContent 提示内容
 * @param {any} pCallBackOk  确认回调函数
 * @param {any} pZIndex 窗口层次 [可选]
 * @param {any} pMaskLayerDivID 遮罩层标签ID [可选]
 * @param {any} pMaskLayerOpacity 遮罩层透明度 [可选]
 */
function alertWinCb(pWinContent, pCallBackOk, pZIndex, pMaskLayerDivID, pMaskLayerOpacity) {

    //移除之前弹出的标签
    closeAlertConfirmWin(pMaskLayerDivID);

    //构造Html显示代码, 并添加到Body中去
    buildHtmlAlertConfirmWin("提示信息", pWinContent, false, "", pMaskLayerDivID, pMaskLayerOpacity, pZIndex);

    //构造Html显示代码, 并添加到Body中去
    //buildHtmlAlertConfirmWin("提示信息", pWinContent, false, "");

    //确定按钮事件
    $("#BtnAlertConfirmWinOk").on("click", function () {

        //关闭窗口
        closeAlertConfirmWin(pMaskLayerDivID);

        pCallBackOk();

    });
}

/**
 * -----弹出Alert窗口 带回调 指定窗口宽度------
 * @param {any} pWinContent 提示内容
 * @param {any} pCallBackOk 确认回调函数
 * @param {any} pWinWidth 指定的窗口宽度 [可选]
 * @param {any} pZIndex 窗口层次 [可选]
 * @param {any} pMaskLayerDivID 遮罩层标签ID [可选]
 * @param {any} pMaskLayerOpacity 遮罩层透明度 [可选]
 */
function alertWinCbWidth(pWinContent, pCallBackOk, pWinWidth, pZIndex, pMaskLayerDivID, pMaskLayerOpacity) {

    //移除之前弹出的窗口
    closeAlertConfirmWin(pMaskLayerDivID);

    //构造Html显示代码, 并添加到Body中去
    buildHtmlAlertConfirmWin("提示信息", pWinContent, false, pWinWidth, pMaskLayerDivID, pMaskLayerOpacity, pZIndex);

    //构造Html显示代码, 并添加到Body中去
    //buildHtmlAlertConfirmWin("提示信息", pWinContent, false, pWinWidth);

    //确定按钮事件
    $("#BtnAlertConfirmWinOk").on("click", function () {

        //关闭窗口
        closeAlertConfirmWin(pMaskLayerDivID);

        pCallBackOk();

    });
}



/**
 * ------- 弹出确认窗口 -------
 * @param {any} pWinContent 提示内容
 * @param {any} pCallBackOk 确认回调函数
 * @param {any} pZIndex 窗口层次 [可选]
 * @param {any} pMaskLayerDivID 遮罩层标签ID [可选]
 * @param {any} pMaskLayerOpacity 遮罩层透明度 [可选]
 */
function confirmWin(pWinContent, pCallBackOk, pZIndex, pMaskLayerDivID, pMaskLayerOpacity) {
    //移除之前弹出的窗口
    closeAlertConfirmWin(pMaskLayerDivID);

    //构造Html显示代码, 并添加到Body中去
    buildHtmlAlertConfirmWin("提示信息", pWinContent, true, undefined, pMaskLayerDivID, pMaskLayerOpacity, pZIndex);

    ////构造Html显示代码, 并添加到Body中去
    //buildHtmlAlertConfirmWin("确认提示", pWinContent, true, "");

    //确定按钮事件
    $("#BtnAlertConfirmWinOk").on("click", function () {

        //关闭窗口
        closeAlertConfirmWin(pMaskLayerDivID);

        pCallBackOk();

    });

    //取消按钮事件
    $("#BtnAlertConfirmWinCancel").on("click", function () {

        //关闭窗口
        closeAlertConfirmWin(pMaskLayerDivID);

    });
}


/**
 * ------- 弹出确认窗口 带指定窗口宽度-------
 * @param {any} pWinContent 提示内容
 * @param {any} pCallBackOk 确认回调函数
 * @param {any} pWinWidth 窗口的宽度
 * @param {any} pZIndex 窗口层次 [可选]
 * @param {any} pMaskLayerDivID 遮罩层标签ID [可选]
 * @param {any} pMaskLayerOpacity 遮罩层透明度 [可选]
 */
function confirmWinWidth(pWinContent, pCallBackOk, pWinWidth, pZIndex, pMaskLayerDivID, pMaskLayerOpacity) {
    //移除之前弹出的窗口
    closeAlertConfirmWin(pMaskLayerDivID);

    //构造Html显示代码, 并添加到Body中去
    buildHtmlAlertConfirmWin("确认提示", pWinContent, true, pWinWidth, pMaskLayerDivID, pMaskLayerOpacity, pZIndex);

    //构造Html显示代码, 并添加到Body中去
    //buildHtmlAlertConfirmWin("确认提示", pWinContent, true, pWinWidth);

    //确定按钮事件
    $("#BtnAlertConfirmWinOk").on("click", function () {

        //关闭窗口
        closeAlertConfirmWin(pMaskLayerDivID);

        pCallBackOk();
    });

    //取消按钮事件
    $("#BtnAlertConfirmWinCancel").on("click", function () {

        //关闭窗口
        closeAlertConfirmWin(pMaskLayerDivID);

    });
}




/**
 * ------- 弹出确认窗口 带取消回调函数-------
 * @param {any} pWinContent 提示内容
 * @param {any} pCallBackOk 确认回调函数
 * @param {any} pCallBackCancel 取消回调函数
 * @param {any} pZIndex 窗口层次 [可选]
 * @param {any} pMaskLayerDivID 遮罩层标签ID [可选]
 * @param {any} pMaskLayerOpacity 遮罩层透明度 [可选]
 */
function confirmWinCCb(pWinContent, pCallBackOk, pCallBackCancel, pZIndex, pMaskLayerDivID, pMaskLayerOpacity) {
    //移除之前弹出的窗口
    closeAlertConfirmWin(pMaskLayerDivID);

    //构造Html显示代码, 并添加到Body中去
    buildHtmlAlertConfirmWin("确认提示", pWinContent, true, undefined, pMaskLayerDivID, pMaskLayerOpacity, pZIndex);

    //构造Html显示代码, 并添加到Body中去
    //buildHtmlAlertConfirmWin("确认提示", pWinContent, true, "");

    //确定按钮事件
    $("#BtnAlertConfirmWinOk").on("click", function () {

        //关闭窗口
        closeAlertConfirmWin(pMaskLayerDivID);

        //确定回调函数
        pCallBackOk();


    });

    //取消按钮事件
    $("#BtnAlertConfirmWinCancel").on("click", function () {

        //关闭窗口
        closeAlertConfirmWin(pMaskLayerDivID);
        //取消回调函数
        pCallBackCancel();


    });

}


/**
 * ------- 弹出确认窗口 带取消回调函数 指定窗口宽度-------
 * @param {any} pWinContent 提示内容
 * @param {any} pCallBackOk 确认回调函数
 * @param {any} pCallBackCancel 取消回调函数
 * @param {any} pWinWidth 窗口宽度
 * @param {any} pZIndex 窗口层次 [可选]
 * @param {any} pMaskLayerDivID 遮罩层标签ID [可选]
 * @param {any} pMaskLayerOpacity 遮罩层透明度 [可选]
 */
function confirmWinCCb(pWinContent, pCallBackOk, pCallBackCancel, pWinWidth, pZIndex, pMaskLayerDivID, pMaskLayerOpacity) {
    //移除之前弹出的窗口
    closeAlertConfirmWin(pMaskLayerDivID);

    //构造Html显示代码, 并添加到Body中去
    buildHtmlAlertConfirmWin("确认提示", pWinContent, true, pWinWidth, pMaskLayerDivID, pMaskLayerOpacity, pZIndex);
    //构造Html显示代码, 并添加到Body中去
    //buildHtmlAlertConfirmWin("确认提示", pWinContent, true, pWinWidth);

    //确定按钮事件
    $("#BtnAlertConfirmWinOk").on("click", function () {

        //关闭窗口
        closeAlertConfirmWin(pMaskLayerDivID);
        //确定回调函数
        pCallBackOk();

    });

    //取消按钮事件
    $("#BtnAlertConfirmWinCancel").on("click", function () {

        //关闭窗口
        closeAlertConfirmWin(pMaskLayerDivID);
        //取消回调函数
        pCallBackCancel();

    });

}


/*
*---------- 关闭窗口 -----------
* @param pMaskLayerDivID 遮罩层ID
*/
function closeAlertConfirmWin(pMaskLayerDivID) {
    if (pMaskLayerDivID == undefined || pMaskLayerDivID == "") {
        pMaskLayerDivID = "DailogWinMaskLayer";
    }

    $("#" + pMaskLayerDivID + "").hide();
    $("#AlertConfirmWinDiv").hide();

    //移除遮罩层
    $("div").remove("#" + pMaskLayerDivID + "");
    //移除Dialog窗口代码
    $("div").remove("#AlertConfirmWinDiv");
    //移除样式代码
    //$("style").remove("style[title=winDialogStyleCss]");
}

/*
------------构造Html显示代码,并添加到Body中去-------------
@ pWinTitle 窗口标题
@ pWinContent 窗口提示内容
@ pIsShowCancelBtn 是否显示取消按钮 [true / false]
@ pWinWidth  窗口宽度，可以为空，  为空时自动适应
@ pMaskLayerDivID 遮罩层Div的ID
@ pMaskLayerOpacity 遮罩透明度
@ pZIndex 窗口层次 1个数值
*/
function buildHtmlAlertConfirmWin(pWinTitle, pWinContent, pIsShowCancelBtn, pWinWidth, pMaskLayerDivID, pMaskLayerOpacity, pZIndex) {

    if (pZIndex == undefined || pZIndex == "") {
        pZIndex = 10;
    }
    //console.log("pWinTitle=" + pWinTitle + " | pWinContent=" + pWinContent);

    var myJsVal = "";
    myJsVal += "<div class=\"alert-confirm-win\" id=\"AlertConfirmWinDiv\">";
    myJsVal += "        <div class=\"alert-confirm-title\">";
    myJsVal += "" + pWinTitle + "";
    myJsVal += "        <\/div>";
    myJsVal += "        <div class=\"alert-confirm-content\">";
    myJsVal += "" + pWinContent + "";
    myJsVal += "        <\/div>";

    myJsVal += "        <div class=\"alert-confirm-btn\">";

    if (pIsShowCancelBtn == true) {
        myJsVal += "            <div id=\"BtnAlertConfirmWinCancel\">";
        myJsVal += "                取消";
        myJsVal += "            <\/div>";
        myJsVal += "            <div class=\"alert-confirm-btn-ok\" id=\"BtnAlertConfirmWinOk\">";
        myJsVal += "                确定";
        myJsVal += "            <\/div>";
    }
    else {
        myJsVal += "            <div class=\"alert-confirm-btn-ok\" style=\"width:100%;border:none;\" id=\"BtnAlertConfirmWinOk\">";
        myJsVal += "                确定";
        myJsVal += "            <\/div>";
    }


    myJsVal += "        <\/div>";
    myJsVal += "    <\/div>";

    //设置窗口层次 必须在Append之前设置层次
    $(".alert-confirm-win").css("z-index", parseInt(pZIndex) + parseInt(1));

    //myJsVal += "    <style type=\"text\/css\" title=\"winDialogStyleCss\">";
    //myJsVal += "        .alert-confirm-win {";
    //myJsVal += "            background: #ffffff;";
    //myJsVal += "            width: 300px;";
    //myJsVal += "            position: absolute;";
    //myJsVal += "            top: 60px;";
    //myJsVal += "            left: 20px;";
    //myJsVal += "            overflow: hidden;";
    //myJsVal += "            border-radius: 10px;";
    //myJsVal += "            font-size: 14px;";
    //myJsVal += "            z-index: 900000;";
    //myJsVal += "            border: 1px solid #ebebeb;";
    //myJsVal += "        }";
    //myJsVal += "        .alert-confirm-title {";
    //myJsVal += "            font-size: 16px;";
    //myJsVal += "            font-weight: bold;";
    //myJsVal += "            text-align: center;";
    //myJsVal += "            padding: 15px;";
    //myJsVal += "        }";
    //myJsVal += "        .alert-confirm-content {";
    //myJsVal += "            color: gray;";
    //myJsVal += "            padding: 10px;";
    //myJsVal += "            padding-bottom: 20px;";
    //myJsVal += "            padding-top: 0;";
    //myJsVal += "            text-align: center;";
    //myJsVal += "            line-height: 150%;";
    //myJsVal += "            overflow: hidden;";
    //myJsVal += "        }";
    //myJsVal += "        .alert-confirm-btn {";
    //myJsVal += "            clear: both;";
    //myJsVal += "            border-top: 1px solid #ebebeb;";
    //myJsVal += "        }";
    //myJsVal += "            .alert-confirm-btn div {";
    //myJsVal += "                float: left;";
    //myJsVal += "                text-align: center;";
    //myJsVal += "                width: 49%;";
    //myJsVal += "                font-size: 16px;";
    //myJsVal += "                cursor: pointer;";
    //myJsVal += "                padding: 10px 0;";
    //myJsVal += "            }";
    //myJsVal += "            .alert-confirm-btn .alert-confirm-btn-ok {";
    //myJsVal += "                border-left: 1px solid #ebebeb;";
    //myJsVal += "            }";
    //myJsVal += "    <\/style>";

    //将代码插入到body标签中
    $("body").append(myJsVal);




    //--------------对窗口进行样式或属性调整---------------//

    var _widthWin = $(window).width() - 40;
    if (pWinWidth != undefined) {
        if (pWinWidth != "") {
            _widthWin = parseFloat(pWinWidth);
        }
    }

    var _heightWin = $(window).height() / 2;


    //设置窗口的宽度
    $(".alert-confirm-win").width(_widthWin);

    //窗口居中显示
    alignCenterWin(pWinWidth);

    //创建透明遮罩层
    createMaskLayer(pMaskLayerOpacity, pMaskLayerDivID, pZIndex);


}

//----------窗口居中显示----------//
//@ pWinWidth  窗口宽度，可以为空，  为空时自动适应
function alignCenterWin() {
    $(window).resize(function () {

        $(".alert-confirm-win").css({
            position: 'absolute',
            left: ($(window).width() - $(".alert-confirm-win").outerWidth()) / 2,
            top: ($(window).height() - $(".alert-confirm-win").outerHeight()) / 2 + $(document).scrollTop()
        });
    });
    //重设窗口尺寸
    $(window).resize();
}

/*-----------创建透明遮罩层-------------
@ pOpacityNum 透明度 [1-100 ]
@ pMaskLayerDivID 遮罩层的Div的ID
@ pZIndex 遮罩层次
*/
function createMaskLayer(pOpacityNum, pMaskLayerDivID, pZIndex) {

    if (pOpacityNum == undefined || pOpacityNum == "") {
        pOpacityNum = 40;
    }
    if (pMaskLayerDivID == undefined || pMaskLayerDivID == "") {
        pMaskLayerDivID = "DailogWinMaskLayer";
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

    //if ($.support.opacity == true) {
    //    $("#" + pMaskLayerDivID + "").css("opacity", pOpacityNum / 100);
    //}
    //else {
    //    $("#" + pMaskLayerDivID + "").css("filter", "alpha(opacity=" + pOpacityNum + ")");
    //}
}

/**
 * ----创建透明遮罩层 指定插入Div层-----
 * @param pMaskLayerAppendDivID 插入遮罩层Div的ID
 * @param {any} pOpacityNum 透明度
 * @param {any} pMaskLayerDivID 遮罩层DIV的ID
 * @param {any} pZIndex 层次
 */
function createMaskLayerToDivID(pMaskLayerAppendDivID, pOpacityNum, pMaskLayerDivID, pZIndex) {

    if (pOpacityNum == undefined || pOpacityNum == "") {
        pOpacityNum = 40;
    }
    if (pMaskLayerDivID == undefined || pMaskLayerDivID == "") {
        pMaskLayerDivID = "DailogWinMaskLayerToDiv";
    }
    if (pZIndex == undefined || pZIndex == "") {
        pZIndex = 1;
    }

    //console.log("createMaskLayer,pZIndex=" + pZIndex);

    var _maskLayerDiv = "<div id=\"" + pMaskLayerDivID + "\"> 34234234234  </div>";

    //设置层次 必须在Append之前
    $("#" + pMaskLayerDivID + "").css("z-index", pZIndex);

    //将遮罩层添加到body中去
    $("#" + pMaskLayerAppendDivID + "").append(_maskLayerDiv);

    //设置布局方式和位置
    $("#" + pMaskLayerDivID + "").css("position", "absolute");
    $("#" + pMaskLayerDivID + "").css("top", "0px");
    $("#" + pMaskLayerDivID + "").css("left", "0px");

    //设置宽高
    $("#" + pMaskLayerDivID + "").css("width", $("#" + pMaskLayerAppendDivID).outerWidth(true));
    $("#" + pMaskLayerDivID + "").css("height", $("#" + pMaskLayerAppendDivID).outerHeight(true));
    //$("#" + pMaskLayerDivID + "").css("width", 500);
    //$("#" + pMaskLayerDivID + "").css("height", 500);
    //设置背景色
    $("#" + pMaskLayerDivID + "").css("background", "#000000");
    //设置透明度
    try {
        $("#" + pMaskLayerDivID + "").css("opacity", pOpacityNum / 100);
        $("#" + pMaskLayerDivID + "").css("filter", "alpha(opacity=" + pOpacityNum + ")");
    } catch (e) { };

    //if ($.support.opacity == true) {
    //    $("#" + pMaskLayerDivID + "").css("opacity", pOpacityNum / 100);
    //}
    //else {
    //    $("#" + pMaskLayerDivID + "").css("filter", "alpha(opacity=" + pOpacityNum + ")");
    //}
}



/*
------------------------ 定义可自动消失的Toast窗口 ---------------------
*/

/**
 * -----弹出Toast提示窗口-----
 * @param {any} pWinContent 提示的内容
 * @param {any} pCloseTime 延迟关闭的时间 毫秒单位 [可选]
 * @param {any} pZIndex 窗口层次 [可选]
 * @param {any} pMaskLayerDivID 遮罩层标签ID [可选]
 * @param {any} pMaskLayerOpacity 遮罩层透明度 1-100 [可选]
 * @param {any} pVerAlignType  垂直对齐方式 [top,center,bottom] [可选]
 * @param {any} pFontSize 字体大小  [14 , 15 ,16] [可选]
 * @param {any} pBgColor 背景颜色 [black , white] [可选]
 */
function toastWin(pWinContent, pCloseTime, pZIndex, pMaskLayerDivID, pMaskLayerOpacity, pVerAlignType, pFontSize, pBgColor) {

    //关闭之前的Toast窗口
    closeToastWin(pMaskLayerDivID);

    if (pCloseTime == undefined || pCloseTime == "") {
        pCloseTime = 1500;
    }

    //构建Toast的Html显示代码
    buildHtmlToastWin(pWinContent, undefined, pZIndex, pMaskLayerDivID, pMaskLayerOpacity, pVerAlignType, pCloseTime, pFontSize, pBgColor);

    //构建Toast的Html显示代码
    //buildHtmlToastWin(pWinContent, undefined, pVerAlignType, pCloseTime, pFontSize, pBgColor);
}



/**
 * -----弹出Toast提示窗口 带关闭回调-----
 * @param {any} pWinContent 提示的内容
 * @param {any} pCallBackClose 关闭回调函数
 * @param {any} pCloseTime 延迟关闭的时间 毫秒单位 [可选]
 * @param {any} pZIndex 窗口层次 [可选]
 * @param {any} pMaskLayerDivID 遮罩层标签ID [可选]
 * @param {any} pMaskLayerOpacity 遮罩层透明度 1-100 [可选]
 * @param {any} pVerAlignType  垂直对齐方式 [top,center,bottom] [可选]
 * @param {any} pFontSize 字体大小  [14 , 15 ,16] [可选]
 * @param {any} pBgColor 背景颜色 [black , white] [可选]
 */
function toastWinCb(pWinContent, pCallBackClose, pCloseTime, pZIndex, pMaskLayerDivID, pMaskLayerOpacity, pVerAlignType, pFontSize, pBgColor) {

    //关闭之前的Toast窗口
    closeToastWin(pMaskLayerDivID);

    if (pCloseTime == undefined) {
        pCloseTime = 1500;
    }

    //构建Toast的Html显示代码
    buildHtmlToastWin(pWinContent, pCallBackClose, pZIndex, pMaskLayerDivID, pMaskLayerOpacity, pVerAlignType, pCloseTime, pFontSize, pBgColor);

    //构建Toast的Html显示代码
    //buildHtmlToastWin(pWinContent, pCallBackClose, pVerAlignType, pCloseTime, pFontSize, pBgColor);

}


/**
 * -----弹出Toast提示窗口，不带回调，必须手动关闭窗口-----
 * @param {any} pWinContent 提示的内容
 * @param {any} pZIndex 窗口层次 [可选]
 * @param {any} pMaskLayerDivID 遮罩层标签ID [可选]
 * @param {any} pMaskLayerOpacity 遮罩层透明度 [可选]
 * @param {any} pVerAlignType  垂直对齐方式 [top,center,bottom] [可选]
 * @param {any} pFontSize 字体大小 [14 , 15 ,16] [可选]
 * @param {any} pBgColor 背景颜色 [black , white] [可选]
 */
function toastWinNoClose(pWinContent, pZIndex, pMaskLayerDivID, pMaskLayerOpacity, pVerAlignType, pFontSize, pBgColor) {
    //关闭之前的Toast窗口
    closeToastWin(pMaskLayerDivID);

    //构建Toast的Html显示代码
    buildHtmlToastWinNoClose(pWinContent, pZIndex, pMaskLayerDivID, pMaskLayerOpacity, pVerAlignType, pFontSize, pBgColor);
    //buildHtmlToastWinNoClose(pWinContent, pVerAlignType, pFontSize, pBgColor);

}

/**
 *  -----弹出Toast提示窗口,指定遮罩到具体Div上-----
 * @param {any} pWinContent 提示的内容
 * @param {any} pMaskLayerAppendDivID  指定遮罩到具体Div上的ID 一般是窗口的主体标签 [ConfirmHtmlMain]
 * @param {any} pZIndex 窗口层次 [可选]
 * @param {any} pMaskLayerDivID 遮罩层标签ID [可选]
 * @param {any} pMaskLayerOpacity 遮罩层透明度 [可选]
 * @param {any} pVerAlignType 垂直对齐方式 [top,center,bottom] [可选]
 * @param {any} pFontSize  字体大小 [14 , 15 ,16] [可选]
 * @param {any} pBgColor 背景颜色 [black , white] [可选]
 */
function toastWinToDiv(pWinContent, pMaskLayerAppendDivID, pZIndex, pMaskLayerDivID, pMaskLayerOpacity, pVerAlignType, pFontSize, pBgColor) {

    //构建Toast的Html显示代码
    buildHtmlToastWin(pWinContent, undefined, pZIndex, pMaskLayerDivID, pMaskLayerOpacity, pVerAlignType, undefined, pFontSize, pBgColor, pMaskLayerAppendDivID);

}

/**
 *  -----弹出Toast提示窗口,指定遮罩到具体Div上 并带关闭回调函数-----
 * @param {any} pWinContent 提示的内容
 * @param {any} pCallBackClose 关闭回调函数
 * @param {any} pMaskLayerAppendDivID  指定遮罩到具体Div上的ID 一般是窗口的主体标签 [ConfirmHtmlMain]
 * @param {any} pZIndex 窗口层次 [可选]
 * @param {any} pMaskLayerDivID 遮罩层标签ID [可选]
 * @param {any} pMaskLayerOpacity 遮罩层透明度 [可选]
 * @param {any} pVerAlignType 垂直对齐方式 [top,center,bottom] [可选]
 * @param {any} pFontSize  字体大小 [14 , 15 ,16] [可选]
 * @param {any} pBgColor 背景颜色 [black , white] [可选]
 */
function toastWinToDivCb(pWinContent, pCallBackClose, pMaskLayerAppendDivID, pZIndex, pMaskLayerDivID, pMaskLayerOpacity, pVerAlignType, pFontSize, pBgColor) {

    //构建Toast的Html显示代码
    buildHtmlToastWin(pWinContent, pCallBackClose, pZIndex, pMaskLayerDivID, pMaskLayerOpacity, pVerAlignType, undefined, pFontSize, pBgColor, pMaskLayerAppendDivID);

}



/**
 *----  构建Toast的Html显示代码 ---
 * @param {any} pWinContent 提示的内容
 * @param {any} pCallBackClose 关闭窗口回调函数
 * @param {any} pZIndex 窗口层次 [可选]
 * @param {any} pMaskLayerDivID 遮罩层标签ID [可选]
 * @param {any} pMaskLayerOpacity 遮罩层透明度 [可选]
 * @param {any} pVerAlignType  垂直对齐方式 [top,center,bottom]
 * @param {any} pCloseTime 关闭的延迟时间，以毫秒计算
 * @param {any} pFontSize 字体大小 [14 , 15 ,16]
 * @param {any} pBgColor 背景颜色 [black , white]
 */
function buildHtmlToastWin(pWinContent, pCallBackClose, pZIndex, pMaskLayerDivID, pMaskLayerOpacity, pVerAlignType, pCloseTime, pFontSize, pBgColor, pMaskLayerAppendDivID) {

    if (pFontSize == undefined || pFontSize == "") {
        pFontSize = 14;
    }
    if (pBgColor == undefined || pBgColor == "") {
        pBgColor = "black";
    }
    if (pCallBackClose == undefined || pCallBackClose == "") {
        pCallBackClose = function () { };
    }
    if (pZIndex == undefined || pZIndex == "") {
        pZIndex = 1000;
    }
    if (pMaskLayerDivID == undefined || pMaskLayerDivID == "") {
        pMaskLayerDivID = "ToastWinMaskLayerDivID";
    }
    if (pCloseTime == undefined || pCloseTime == "") {
        pCloseTime = 1500;
    }

    var myJsVal = "";
    //myJsVal += "<style type=\"text\/css\" title=\"winToastDialogStyleCss\">";
    //myJsVal += "        .toast-win-main {";
    //myJsVal += "            position: absolute;";
    //myJsVal += "            top: 10px;";
    //myJsVal += "            left: 200px;";
    //myJsVal += "            overflow: auto;";
    //myJsVal += "            border-radius: 15px;";
    //myJsVal += "            font-size: " + pFontSize + "px;";
    //myJsVal += "            z-index: 900000;";
    //myJsVal += "            background: " + pBgColor + ";";

    //if (pBgColor == "black") {
    //    myJsVal += "color: white;";
    //}
    //else {
    //    myJsVal += "color: black;";
    //}

    //myJsVal += "            padding: 8px 15px;";
    //myJsVal += "            opacity: 0.6;";
    //myJsVal += "            filter: alpha(opacity=60);";
    //myJsVal += "        }";
    //myJsVal += "    <\/style>";
    myJsVal += "    <div class=\"toast-win-main\">";
    myJsVal += "" + pWinContent + "";
    myJsVal += "    <\/div>";

    //设置窗口层次 必须在添加Append之前，否则无效
    $(".toast-win-main").css("z-index", parseInt(pZIndex) + parseInt(1));

    //将代码插入到body标签中
    $("body").append(myJsVal);

    //设置窗口的样式
    $(".toast-win-main").css("font-size", pFontSize);
    $(".toast-win-main").css("background", pBgColor);
    if (pBgColor == "black") {
        $(".toast-win-main").css("color", "white");
    }
    else {
        $(".toast-win-main").css("color", "black");
    }

    //必须在这里设置窗口的Left和position值 这样才不会出现窗口不能水平居中情况
    $(".toast-win-main").css({
        position: 'absolute',
        left: ($(window).width() - $(".toast-win-main").outerWidth()) / 2,
        //top: ($(window).height() - $(".toast-win-main").outerHeight()) / 2 + $(document).scrollTop()
    });

    //Toast窗口居中显示
    alignCenterToastWin(pVerAlignType);

    //指定遮罩的Div层
    if (pMaskLayerAppendDivID != undefined && pMaskLayerAppendDivID != "") {

        //创建透明遮罩层
        createMaskLayerToDivID(pMaskLayerAppendDivID, pMaskLayerOpacity, pMaskLayerDivID, pZIndex)

    }
    else { //这里不指定

        //创建透明遮罩层
        createMaskLayer(pMaskLayerOpacity, pMaskLayerDivID, pZIndex);

    }


    //关闭移除Toast窗口
    setTimeout(function () {

        closeToastWin(pMaskLayerDivID);

        //关闭回调
        pCallBackClose();

    }, pCloseTime);
}



/**
 * ----构建Toast的Html显示代码 不带自动关闭的，必须手动关闭---
 * @param {any} pWinContent 提示的内容
 * @param {any} pZIndex 窗口层次 [可选]
 * @param {any} pMaskLayerDivID 遮罩层标签ID [可选]
 * @param {any} pMaskLayerOpacity 遮罩层透明度 [可选]
 * @param {any} pVerAlignType  垂直对齐方式 [top,center,bottom]
 * @param {any} pFontSize 字体大小 [14 , 15 ,16]
 * @param {any} pBgColor 背景颜色 [black , white]
 */
function buildHtmlToastWinNoClose(pWinContent, pZIndex, pMaskLayerDivID, pMaskLayerOpacity, pVerAlignType, pFontSize, pBgColor) {

    if (pFontSize == undefined || pFontSize == "") {
        pFontSize = 14;
    }
    if (pBgColor == undefined || pBgColor == "") {
        pBgColor = "black";
    }
    if (pZIndex == undefined || pZIndex == "") {
        pZIndex = 1000;
    }
    if (pMaskLayerDivID == undefined || pMaskLayerDivID == "") {
        pMaskLayerDivID = "ToastWinMaskLayerDivID";
    }


    var myJsVal = "";
    //myJsVal += "<style type=\"text\/css\" title=\"winToastDialogStyleCss\">";
    //myJsVal += "        .toast-win-main {";
    //myJsVal += "            position: absolute;";
    //myJsVal += "            top: 10px;";
    //myJsVal += "            left: 200px;";
    //myJsVal += "            overflow: auto;";
    //myJsVal += "            border-radius: 15px;";
    //myJsVal += "            font-size: " + pFontSize + "px;";
    //myJsVal += "            z-index: 900000;";
    //myJsVal += "            background: " + pBgColor + ";";

    //if (pBgColor == "black") {
    //    myJsVal += "color: white;";
    //}
    //else {
    //    myJsVal += "color: black;";
    //}

    //myJsVal += "            padding: 8px 15px;";
    //myJsVal += "            opacity: 0.6;";
    //myJsVal += "            filter: alpha(opacity=60);";
    //myJsVal += "        }";
    //myJsVal += "    <\/style>";
    myJsVal += "    <div class=\"toast-win-main\">";
    myJsVal += "" + pWinContent + "";
    myJsVal += "    <\/div>";

    //设置窗口层次 必须在添加Append之前，否则无效
    $(".toast-win-main").css("z-index", parseInt(pZIndex) + parseInt(1));

    //将代码插入到body标签中
    $("body").append(myJsVal);

    //设置窗口的样式
    $(".toast-win-main").css("font-size", pFontSize);
    $(".toast-win-main").css("background", pBgColor);
    if (pBgColor == "black") {
        $(".toast-win-main").css("color", "white");
    }
    else {
        $(".toast-win-main").css("color", "black");
    }

    //必须在这里设置窗口的Left和position值 这样才不会出现窗口不能水平居中情况
    $(".toast-win-main").css({
        position: 'absolute',
        left: ($(window).width() - $(".toast-win-main").outerWidth()) / 2,
        //top: ($(window).height() - $(".toast-win-main").outerHeight()) / 2 + $(document).scrollTop()
    });

    //Toast窗口居中显示
    alignCenterToastWin(pVerAlignType);

    //创建透明遮罩层
    createMaskLayer(pMaskLayerOpacity, pMaskLayerDivID, pZIndex);

    //关闭移除Toast窗口
    //setTimeout(function () {

    //    closeToastWin();

    //    //关闭回调
    //    pCallBackClose();

    //}, pCloseTime);
}


//----------Toast窗口居中显示----------//
//@ pVerAlignType 可选 垂直对齐方式 [top,center,bottom]
function alignCenterToastWin(pVerAlignType) {

    if (pVerAlignType == undefined || pVerAlignType == "") {
        pVerAlignType = "center";
    }

    //console.log("width=" + $(".toast-win-main").width());
    //console.log("outerWidth=" + $(".toast-win-main").outerWidth());
    //console.log("windowWidth=" + $(window).width());
    //var _outerWidth = $(".toast-win-main").outerWidth();
    //if (_outerWidth > 200) {
    //    alert("大于极限");
    //}

    $(window).resize(function () {

        $(".toast-win-main").css({
            position: 'absolute',
            left: ($(window).width() - $(".toast-win-main").outerWidth()) / 2,
            //top: ($(window).height() - $(".toast-win-main").outerHeight()) / 2 + $(document).scrollTop()
        });

        if (pVerAlignType == "top") {
            $(".toast-win-main").css({
                top: 60
            });
        }
        if (pVerAlignType == "center") {
            $(".toast-win-main").css({
                top: ($(window).height() - $(".toast-win-main").outerHeight()) / 2 + $(document).scrollTop()
            });
        }
        if (pVerAlignType == "bottom") {
            $(".toast-win-main").css({
                top: $(window).height() - 80
            });
        }
    });
    //重设窗口尺寸
    $(window).resize();
}

/**
 * 关闭移除Toast窗口
 * @param {any} pMaskLayerDivID 遮罩层标签ID
 */
function closeToastWin(pMaskLayerDivID) {

    if (pMaskLayerDivID == undefined || pMaskLayerDivID == "") {
        pMaskLayerDivID = "ToastWinMaskLayerDivID";
    }

    //移除遮罩层
    $("div").remove("#" + pMaskLayerDivID + "");

    //移除Dialog窗口代码
    $("div").remove(".toast-win-main");
    //移除样式代码
    //$("style").remove("style[title=winToastDialogStyleCss]");
}



/*
------------------------ 定义可插入HTML代码内容的 【confirm窗口】 -----------------------------
*/

/**
 * 弹出 【可插入HTML代码内容的 confirm窗口】
 * @param {any} pWinHtmlTitle  窗口标题
 * @param {any} pWinHtmlContent 主体内容的Html代码
 * @param {any} pCallBackOk 确定的回调函数
 * @param {any} pCallBackCancel 取消的回调函数
 * @param {any} pWinWidth 窗口的宽度 [可选]
 * @param {any} pZIndex 窗口层次 [可选]
 * @param {any} pMaskLayerDivID 遮罩层标签ID [可选]
 * @param {any} pMaskLayerOpacity 遮罩层透明度 [可选]
 */
function confirmHtmlWin(pWinHtmlTitle, pWinHtmlContent, pCallBackOk, pCallBackCancel, pWinWidth, pZIndex, pMaskLayerDivID, pMaskLayerOpacity) {
    //关闭移除confirmHtmlWin窗口
    closeConfirmHtmlWin(pMaskLayerDivID);

    //构建ConfrimHtml的Html显示代码
    buildConfrimHtmlWin(pWinHtmlTitle, pWinHtmlContent, pWinWidth, pZIndex, pMaskLayerDivID, pMaskLayerOpacity)
    //buildConfrimHtmlWin(pWinHtmlTitle, pWinHtmlContent, pWinWidth)

    //设置窗口的回调函数
    //取消按钮事件
    $("#ConfirmWinBtnCancel").on("click", function () {

        pCallBackCancel();
        //关闭移除confirmHtmlWin窗口
        closeConfirmHtmlWin(pMaskLayerDivID);

    });
    //确定按钮事件
    $("#ConfirmWinBtnOk").on("click", function () {

        pCallBackOk();
        //关闭移除confirmHtmlWin窗口
        //closeConfirmHtmlWin(pMaskLayerDivID);

    });

}

/**
 * 构建ConfrimHtml的Html显示代码
 * @param pWinHtmlTitle 窗口标题
 * @param {any} pWinHtmlContent 主体内容的Html代码
 * @param pWinWidth 窗口的宽度 [可选]
 * @param {any} pZIndex 窗口层次 [可选]
 * @param {any} pMaskLayerDivID 遮罩层标签ID [可选]
 * @param {any} pMaskLayerOpacity 遮罩层透明度 [可选]
 */
function buildConfrimHtmlWin(pWinHtmlTitle, pWinHtmlContent, pWinWidth, pZIndex, pMaskLayerDivID, pMaskLayerOpacity) {

    if (pWinHtmlTitle == undefined || pWinHtmlTitle == "") {
        pWinHtmlTitle = "";
    }
    if (pWinHtmlContent == undefined || pWinHtmlContent == "") {
        pWinHtmlContent = "";
    }
    if (pWinWidth == undefined || pWinWidth == "") {
        pWinWidth = "300";
    }
    if (pZIndex == undefined || pZIndex == "") {
        pZIndex = 100;
    }
    if (pMaskLayerDivID == undefined || pMaskLayerDivID == "") {
        pMaskLayerDivID = "ConfrimHtmlWinMaskLayerDivID";
    }

    var myJsVal = "";    //myJsVal += "<style type=\"text\/css\" title=\"ConfrimHtmlWinStyleCss\">";    //myJsVal += "        .confirm-html-main {";    //myJsVal += "            position: absolute;";    //myJsVal += "            left: 200px;";    //myJsVal += "            top: 100px;";    //myJsVal += "            width: " + pWinWidth + "px;";    //myJsVal += "            background: white;";    //myJsVal += "            overflow: hidden;";    //myJsVal += "            clear: both;";    //myJsVal += "            box-shadow: 0px 0px 2px #b5b5b5;";    //myJsVal += "            border-radius: 5px;";    //myJsVal += "            color: #333333;";    //myJsVal += "            z-index: 1000000;";    //myJsVal += "        }";    //myJsVal += "        .confirm-content-title {";    //myJsVal += "            padding: 5px;";    //myJsVal += "            text-align: center;";    //myJsVal += "            font-size: 16px;";    //myJsVal += "            padding-top: 10px;";    ////myJsVal += "            font-weight: bold;";    //myJsVal += "        }";    //myJsVal += "        .confirm-content-html {";    //myJsVal += "            font-size: 14px;";    //myJsVal += "            overflow: hidden;";    //myJsVal += "            padding: 10px 15px;";    //myJsVal += "            padding-bottom: 15px;";    //myJsVal += "        }";    //myJsVal += "        .confirm-btn-list {";    //myJsVal += "            clear: both;";    //myJsVal += "            overflow: hidden;";    //myJsVal += "            width: 100%;";    //myJsVal += "            border-top: 1px solid #d5d5d5;";    //myJsVal += "        }";    //myJsVal += "        .confirm-content-btn-cancel {";    //myJsVal += "            float: left;";    //myJsVal += "            width: 49%;";    //myJsVal += "            text-align: center;";    //myJsVal += "            padding: 8px 0;";    //myJsVal += "            border-right: 1px solid #d5d5d5;";    //myJsVal += "            cursor: pointer;";    //myJsVal += "            font-size: 14px;";    //myJsVal += "        }";    //myJsVal += "        .confirm-content-btn-ok {";    //myJsVal += "            float: right;";    //myJsVal += "            width: 50%;";    //myJsVal += "            text-align: center;";    //myJsVal += "            padding: 8px 0;";    //myJsVal += "            cursor: pointer;";    //myJsVal += "            font-size: 14px;";    //myJsVal += "        }";    //myJsVal += "    <\/style>";    myJsVal += "    <div class=\"confirm-html-main\" id=\"ConfirmHtmlMain\">";    myJsVal += "        <div class=\"confirm-content-title\">";    myJsVal += "" + pWinHtmlTitle + "";    myJsVal += "        <\/div>";    myJsVal += "        <div class=\"confirm-content-html\">";    myJsVal += "" + pWinHtmlContent + "";    myJsVal += "        <\/div>";    myJsVal += "        <div class=\"confirm-btn-list\">";    myJsVal += "            <div class=\"confirm-content-btn-cancel\" id=\"ConfirmWinBtnCancel\">";    myJsVal += "                取消";    myJsVal += "            <\/div>";    myJsVal += "            <div class=\"confirm-content-btn-ok\" id=\"ConfirmWinBtnOk\">";    myJsVal += "                确定";    myJsVal += "            <\/div>";    myJsVal += "        <\/div>";    myJsVal += "    <\/div>";

    //将代码插入到body标签中
    $("body").append(myJsVal);

    //设置窗口的层次
    $(".confirm-html-main").css("z-index", parseInt(pZIndex) + 1);

    //设置窗口的宽度
    $(".confirm-html-main").css("width", pWinWidth);

    //必须在这里设置窗口的Left和position值 这样才不会出现窗口不能水平居中情况
    $(".confirm-html-main").css({
        position: 'absolute',
        left: ($(window).width() - $(".confirm-html-main").outerWidth()) / 2,
        //top: ($(window).height() - $(".toast-win-main").outerHeight()) / 2 + $(document).scrollTop()
    });

    //可插入HTML代码内容的 【confirm窗口】 居中显示
    alignCenterConfirmHtmlWin();

    //创建透明遮罩层
    createMaskLayer(pMaskLayerOpacity, pMaskLayerDivID, pZIndex);

}

/**
 * 可插入HTML代码内容的 【confirm窗口】 居中显示
 * */
function alignCenterConfirmHtmlWin() {


    //console.log("width=" + $(".toast-win-main").width());
    //console.log("outerWidth=" + $(".toast-win-main").outerWidth());
    //console.log("windowWidth=" + $(window).width());
    //var _outerWidth = $(".toast-win-main").outerWidth();
    //if (_outerWidth > 200) {
    //    alert("大于极限");
    //}

    $(window).resize(function () {

        $(".confirm-html-main").css({
            position: 'absolute',
            left: ($(window).width() - $(".confirm-html-main").outerWidth()) / 2,
            top: ($(window).height() - $(".confirm-html-main").outerHeight()) / 2 + $(document).scrollTop()
        });
    });
    //重设窗口尺寸
    $(window).resize();
}

/**
 * 关闭移除confirmHtmlWin窗口
 * @param pMaskLayerDivID 遮罩层标签ID
 * */
function closeConfirmHtmlWin(pMaskLayerDivID) {

    if (pMaskLayerDivID == undefined || pMaskLayerDivID == "") {
        pMaskLayerDivID = "ConfrimHtmlWinMaskLayerDivID";
    }

    //移除遮罩层
    $("div").remove("#" + pMaskLayerDivID + "");

    //移除Dialog窗口代码
    $("div").remove(".confirm-html-main");
    //移除样式代码
    //$("style").remove("style[title=ConfrimHtmlWinStyleCss]");
}


/************************** ActionSheet 窗口***********************************/

/**
 * 弹出 ActionSheet 窗口 关闭窗口 closeActionSheetWin()
 * @param {any} pWinHtmlContent 窗口内容HTML代码
 * @param {any} pCallBackOk 确定的回调函数 [可选]
 * @param {any} pCallBackCancel 取消的回调函数 [可选]
 * @param {any} pZIndex 显示的层次数 [可选]
 * @param {any} pMaskLayerDivID 遮罩层标签ID [可选]
 * @param {any} pMaskLayerOpacity 遮罩层透明度 [可选]
 */
function actionSheetWin(pWinHtmlContent, pCallBackOk, pCallBackCancel, pZIndex, pMaskLayerDivID, pMaskLayerOpacity) {

    if (pCallBackOk == undefined || pCallBackOk == "") {
        pCallBackOk = function () { };
    }
    if (pCallBackCancel == undefined || pCallBackCancel == "") {
        pCallBackCancel = function () { };
    }
    if (pMaskLayerDivID == undefined || pMaskLayerDivID == "") {
        pMaskLayerDivID = "ActionSheetWinMaskLayerDivID";
    }

    //构造ActionSheet窗口 HTML代码
    buildActionSheetHtmlWin(pWinHtmlContent, pZIndex, pMaskLayerDivID, pMaskLayerOpacity)


    //设置窗口的回调函数
    //取消按钮事件
    $(".action-sheet-btn-cancel").on("click", function () {

        pCallBackCancel();

        //关闭移除ActionSheetWin窗口
        closeActionSheetWin(pMaskLayerDivID)

    });
    //确定按钮事件
    $(".action-sheet-btn-Ok").on("click", function () {

        pCallBackOk();
        //关闭移除ActionSheetWin窗口
        //closeActionSheetWin(pMaskLayerDivID)

    });
}

/**
 * 构造ActionSheet窗口 HTML代码
 * @param {any} pWinHtmlContent 窗口内容HTML代码
 * @param {any} pZIndex 显示的层次数
 * @param {any} pMaskLayerDivID 遮罩层标签ID [可选]
 * @param {any} pMaskLayerOpacity 遮罩层透明度 [可选]
 */
function buildActionSheetHtmlWin(pWinHtmlContent, pZIndex, pMaskLayerDivID, pMaskLayerOpacity) {

    var myJsVal = "";    myJsVal += "<div class=\"action-sheet-win\" id=\"ActionSheetWin\" style=\"display:none;\">";    myJsVal += "        <div class=\"action-sheet-content\" id=\"ActionSheetContent\">";    myJsVal += pWinHtmlContent;    myJsVal += "        <\/div>";    myJsVal += "        <div class=\"action-sheet-btn\">";    myJsVal += "            <div class=\"action-sheet-btn-cancel\">";    myJsVal += "                取消";    myJsVal += "            <\/div>";    myJsVal += "            <div class=\"action-sheet-btn-Ok\">";    myJsVal += "                确定";    myJsVal += "            <\/div>";    myJsVal += "        <\/div>";    myJsVal += "    <\/div>";
    //设置窗口的层次
    $(".action-sheet-win").css("z-index", parseInt(pZIndex) + 1);

    //将代码插入到body标签中
    $("body").append(myJsVal);
    //向上推出动画
    $(".action-sheet-win").slideDown();

    //创建透明遮罩层
    createMaskLayer(pMaskLayerOpacity, pMaskLayerDivID, pZIndex);
}

/**
 * 关闭移除ActionSheetWin窗口
 * @param pMaskLayerDivID 遮罩层标签ID
 * */
function closeActionSheetWin(pMaskLayerDivID) {

    if (pMaskLayerDivID == undefined || pMaskLayerDivID == "") {
        pMaskLayerDivID = "ActionSheetWinMaskLayerDivID";
    }

    //向下收缩动画
    $(".action-sheet-win").slideUp("fast", function () {

        //移除遮罩层
        $("div").remove("#" + pMaskLayerDivID + "");

        //移除Dialog窗口代码
        $("div").remove(".action-sheet-win");

    });

}


/*****************************弹窗加载动画******************************************************/

/**
 * 弹出加载提示 可自定义颜色 white , black
 * @param {any} pStyleColor 颜色样式 white,black
 * @param {any} pZIndex 显示层次
 * @param {any} pMaskLayerDivID 遮罩层的ID
 * @param {any} pMaskLayerOpacity 遮罩层透明度
 */
function loadingWinStyle(pStyleColor, pZIndex, pMaskLayerDivID, pMaskLayerOpacity) {

    var pWinBgColor = "#FFFFFF";
    var pCircleColor = "#67CF22";

    if (pStyleColor == "black") {
        pWinBgColor = "#000000";
        pCircleColor = "#FFFFFF";
    }

    if (pMaskLayerDivID == undefined || pMaskLayerDivID == "") {
        pMaskLayerDivID = "LoadingWinMaskLayerDivID";
    }

    //弹出加载提示
    loadingWin(pWinBgColor, pCircleColor, pZIndex, pMaskLayerDivID, pMaskLayerOpacity)

}

/**
 * 
 * 弹出加载提示
 * @param {any} pWinBgColor 窗口底色
 * @param {any} pCircleColor 圆圈的颜色
 * @param {any} pZIndex 显示层次
 * @param {any} pMaskLayerDivID 遮罩层的ID
 * @param {any} pMaskLayerOpacity 遮罩层透明度
 */
function loadingWin(pWinBgColor, pCircleColor, pZIndex, pMaskLayerDivID, pMaskLayerOpacity) {

    if (pWinBgColor == undefined || pWinBgColor == "") {
        pWinBgColor = "#FFFFFF";
    }
    if (pCircleColor == undefined || pCircleColor == "") {
        pCircleColor = "#67CF22";
    }

    if (pMaskLayerDivID == undefined || pMaskLayerDivID == "") {
        pMaskLayerDivID = "LoadingWinMaskLayerDivID";
    }

    //构造LoadingWin窗口 HTML代码
    buildLoadingHtmlWin(pWinBgColor, pCircleColor, pZIndex, pMaskLayerDivID, pMaskLayerOpacity);
}


/**
 * 构造LoadingWin窗口 HTML代码
 * @param {any} pWinBgColor 窗口底色
 * @param {any} pCircleColor 圆圈的颜色
 * @param {any} pZIndex 显示层次
 * @param {any} pMaskLayerDivID 遮罩层的ID
 * @param {any} pMaskLayerOpacity 遮罩层透明度
 */
function buildLoadingHtmlWin(pWinBgColor, pCircleColor, pZIndex, pMaskLayerDivID, pMaskLayerOpacity) {

    var myJsVal = "";    myJsVal += "<div class=\"loading-win-content\">";    myJsVal += "<div class=\"loading-win-2\">";    myJsVal += "            <div class=\"spinner-container container1\">";    myJsVal += "                <div class=\"circle1\"><\/div>";    myJsVal += "                <div class=\"circle2\"><\/div>";    myJsVal += "                <div class=\"circle3\"><\/div>";    myJsVal += "                <div class=\"circle4\"><\/div>";    myJsVal += "            <\/div>";    myJsVal += "            <div class=\"spinner-container container2\">";    myJsVal += "                <div class=\"circle1\"><\/div>";    myJsVal += "                <div class=\"circle2\"><\/div>";    myJsVal += "                <div class=\"circle3\"><\/div>";    myJsVal += "                <div class=\"circle4\"><\/div>";    myJsVal += "            <\/div>";    myJsVal += "            <div class=\"spinner-container container3\">";    myJsVal += "                <div class=\"circle1\"><\/div>";    myJsVal += "                <div class=\"circle2\"><\/div>";    myJsVal += "                <div class=\"circle3\"><\/div>";    myJsVal += "                <div class=\"circle4\"><\/div>";    myJsVal += "            <\/div>";    myJsVal += "   <\/div>";    myJsVal += "</div>";

    //设置窗口的层次
    $(".loading-win-content").css("z-index", parseInt(pZIndex) + 1);

    //将代码插入到body标签中
    $("body").append(myJsVal);
    //向上推出动画
    //$(".action-sheet-win").slideDown();

    //创建透明遮罩层
    createMaskLayer(pMaskLayerOpacity, pMaskLayerDivID, pZIndex);

    //可插入HTML代码内容的 【Loading窗口】 居中显示
    alignCenterLodingHtmlWin();

    //改变窗口的样式
    //$(".loading-win-content").css("background", "#FFFFFF");
    //$(".spinner-container div").css("background", "#67CF22");

    $(".loading-win-content").css("background", pWinBgColor);
    $(".spinner-container div").css("background", pCircleColor);
}

/**
 * 关闭移除LoadingWin窗口
 * @param pMaskLayerDivID 遮罩层标签ID
 * */
function closeLoadingWin(pMaskLayerDivID) {

    if (pMaskLayerDivID == undefined || pMaskLayerDivID == "") {
        pMaskLayerDivID = "LoadingWinMaskLayerDivID";
    }

    //移除遮罩层
    $("div").remove("#" + pMaskLayerDivID + "");

    //移除Dialog窗口代码
    $("div").remove(".loading-win-content");
}


/**
 * 可插入HTML代码内容的 【Loading窗口】 居中显示
 * */
function alignCenterLodingHtmlWin() {

    $(window).resize(function () {

        $(".loading-win-content").css({
            position: 'absolute',
            // left: ($(window).width() - $(".loading-win-content").outerWidth()) / 2,
            left: $(window).width() / 2 - 70,
            top: ($(window).height() - $(".loading-win-content").outerHeight()) / 2 + $(document).scrollTop() - 10
        });
    });
    //重设窗口尺寸
    $(window).resize();
}


/********************** PopImgWin 弹出窗口 ************************/

/**
 * 弹出 PopImgWin 窗口
 * @param {any} pImgSrc  ../Assets/Imgs/win01.jpg
 * @param pImgHref 图片连接地址 [http://www.baidu.com]
 * @param pImgScalePer 图片缩放比
 * @param {any} pMaskLayerOpacity 遮罩层的透明度 [40]
 * @param {any} pMaskLayerDivID  遮罩层Div,ID
 * @param {any} pZIndex 显示层次
 */
function popImgWin(pImgSrc, pImgHref, pImgScalePer, pMaskLayerOpacity, pMaskLayerDivID, pZIndex) {

    //构造 【PopImgWin窗口】 造显示Html代码
    buildHtmlPopImgWin(pImgSrc, pImgHref, pImgScalePer, pMaskLayerOpacity, pMaskLayerDivID, pZIndex);

    //定义关闭事件
    $(".popimg-win-close").on("click", function () {

        //关闭移除 PopImgWin窗口
        closePopImgWin(pMaskLayerDivID)

    });

}

/**
 * 构造 【PopImgWin窗口】 造显示Html代码
 * @param {any} pImgSrc  ../Assets/Imgs/win01.jpg
 * @param pImgHref 图片连接地址 [http://www.baidu.com]
 * @param pImgScalePer 图片缩放比
 * @param {any} pMaskLayerOpacity 遮罩层的透明度 [40]
 * @param {any} pMaskLayerDivID 遮罩层Div,ID
 * @param {any} pZIndex 显示层次
 */
function buildHtmlPopImgWin(pImgSrc, pImgHref, pImgScalePer, pMaskLayerOpacity, pMaskLayerDivID, pZIndex) {

    if (pMaskLayerOpacity == undefined || pMaskLayerOpacity == "") {
        pMaskLayerOpacity = 40;
    }
    if (pZIndex == undefined || pZIndex == "") {
        pZIndex = 100;
    }
    if (pMaskLayerDivID == undefined || pMaskLayerDivID == "") {
        pMaskLayerDivID = "PopImgWinMaskLayerDivID";
    }
    if (pImgScalePer == undefined || pImgScalePer == "") {
        pImgScalePer = 98;
    }
    if (pImgHref == undefined || pImgHref == "") {
        pImgHref = "javascript:void(0)";
    }

    var myJsVal = "";    myJsVal += "<div class=\"popimg-win-main\">";    myJsVal += "        <div class=\"popimg-win-content\" style=\"width: 100%; overflow: hidden; height: 500px;\">";    myJsVal += "         <a href=\"" + pImgHref + "\" target=\"_blank\"><img src=\"" + pImgSrc + "\" style=\"width: " + pImgScalePer + "%;\" \/></a>";    myJsVal += "        <div class=\"popimg-win-close\">";    myJsVal += "            &times;";    myJsVal += "        <\/div>";    myJsVal += "        <\/div>";    myJsVal += "<\/div>";
    //设置窗口的层次
    $(".popimg-win-main").css("z-index", parseInt(pZIndex) + 1);

    //将代码插入到body标签中
    $("body").append(myJsVal);

    //设置内容区的高度
    $(".popimg-win-content").height($(window).height() - 30);


    //创建透明遮罩层
    createMaskLayer(pMaskLayerOpacity, pMaskLayerDivID, pZIndex);

    //窗口居中显示
    alignCenterPopImgWin();

}

/**
 * 【PopImgWin窗口】 居中显示
 * */
function alignCenterPopImgWin() {

    $(window).resize(function () {
        $(".popimg-win-main").css({
            position: 'absolute',
            left: ($(window).width() - $(".popimg-win-main").outerWidth()) / 2,
            top: 0
        });
    });
    //重设窗口尺寸
    $(window).resize();

    //回到顶部
    smoothscroll();
}

/**
 * 关闭移除PopImgWin窗口
 * @param pMaskLayerDivID 遮罩层标签ID
 * */
function closePopImgWin(pMaskLayerDivID) {

    if (pMaskLayerDivID == undefined || pMaskLayerDivID == "") {
        pMaskLayerDivID = "PopImgWinMaskLayerDivID";
    }

    //移除遮罩层
    $("div").remove("#" + pMaskLayerDivID + "");

    //移除Dialog窗口代码
    $("div").remove(".popimg-win-main");

}


/**
 * 平滑回到顶部
 */
function smoothscroll() {
    var currentScroll = document.documentElement.scrollTop || document.body.scrollTop;
    if (currentScroll > 0) {
        window.requestAnimationFrame(smoothscroll);
        window.scrollTo(0, currentScroll - (currentScroll / 5));
    }
}

