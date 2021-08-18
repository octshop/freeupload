/*=================== 后台管理框架---数据处理脚本 ===========================*/

/************** 公共变量与配置参数 ***************/

//手机端域名
var mOctWapWebAddrDomain = "";

/*************** 初始化 *********************/
$(function () {

    mOctWapWebAddrDomain = $("#hidOctWapWeb_AddrDomain").val().trim();

    //统计各种消息通知
    countShopSysMsg();

    //加载店铺简单信息
    loadShopMsgSimple();

    //安全退出单击事件
    $("#SafeExitBtn").on("click", function () {
        SafeExitLogin();
    });

    //进入IM在线客服系统
    enterImSys();

});



/********************* 自定义函数 *********************/

/**
 * 统计各种消息通知
 * */
function countShopSysMsg() {

    //构造POST参数
    var dataPOST = {
        "Type": "5",
    };
    console.log(dataPOST);

    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: "../Sys/Index?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("统计各种消息通知=" + reTxt);

            if (reTxt != "") {
                var _jsonReTxt = JSON.parse(reTxt);

                $("#TotalNotifiMsg").html(_jsonReTxt.TotalNotifiMsg);
                $("#OrderNoReadCount").html(_jsonReTxt.OrderNoReadCount);
                $("#ORemindNoReadCount").html(_jsonReTxt.ORemindNoReadCount);
                $("#AfterSaleNoReadCount").html(_jsonReTxt.AfterSaleNoReadCount);
                $("#AsRemindNoReadCount").html(_jsonReTxt.AsRemindNoReadCount);
                $("#RefundNoReadCount").html(_jsonReTxt.RefundNoReadCount);
                $("#ReRemindNoReadCount").html(_jsonReTxt.ReRemindNoReadCount);
                $("#ComplainNoFinishNo").html(_jsonReTxt.ComplainNoFinishNo);

            }
        },
        error: function (xhr, errorTxt, status) {
            console.log("异步请求错误，errorTxt=" + errorTxt + " | status=" + status);
            return;
        }
    });
}

/**
 * 加载店铺简单信息
 * */
function loadShopMsgSimple() {
    //构造POST参数
    var dataPOST = {
        "Type": "8",
    };
    console.log(dataPOST);

    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: "../Shop/ShopMsg?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("加载店铺简单信息=" + reTxt);

            if (reTxt != "") {
                var _jsonReTxt = JSON.parse(reTxt);

                $("#ShopNameB").html(_jsonReTxt.ShopName);
                $("#ShopIDB").html(_jsonReTxt.ShopID);
                $("#UserIDB").html(_jsonReTxt.UserID);
                $("#BindMobileB").html(_jsonReTxt.BindMobile);
                if (_jsonReTxt.ShopHeaderImg != "" && _jsonReTxt.ShopHeaderImg != null) {
                    $("#ShopHeaderImg").attr("src", "//" + _jsonReTxt.ShopHeaderImg);
                }
                //$("#ShopHomeLinkA").attr("href", mOctWapWebAddrDomain + "/Shop/IndexPreMobileIframe?SID=" + _jsonReTxt.ShopID);
            }
        },
        error: function (xhr, errorTxt, status) {
            console.log("异步请求错误，errorTxt=" + errorTxt + " | status=" + status);
            return;
        }
    });
}

/**
 * 安全退出
 * */
function SafeExitLogin() {

    if (confirm("确定要退出吗？") == false) {
        return;
    }

    //构造POST参数
    var dataPOST = {
        "Type": "2",
    };
    console.log(dataPOST);

    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: "../Login/Index?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("安全退出=" + reTxt);

            if (reTxt != "") {

                if (reTxt == "21") {
                    window.location.href = "../LoginPage/Index?BackUrl=../CmsFrame/Index";
                }

            }
        },
        error: function (xhr, errorTxt, status) {
            console.log("异步请求错误，errorTxt=" + errorTxt + " | status=" + status);
            return;
        }
    });
}


/**
 * -------------进入IM在线客服系统------------------------
 * */
function enterImSys() {

    //构造POST参数
    var dataPOST = {
        "Type": "1",
    };
    console.log(dataPOST);

    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: "../ImSys/Index?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("进入IM在线客服系统=" + reTxt);
            if (reTxt != "") {
                var _jsonReTxt = JSON.parse(reTxt);
                if (_jsonReTxt.ErrMsg != "" && _jsonReTxt.ErrMsg != null && _jsonReTxt.ErrMsg != undefined) {
                    alert(_jsonReTxt.ErrMsg);
                    return;
                }

                //可正常进入IM在线客服系统
                if (_jsonReTxt.Msg != "" && _jsonReTxt.Msg != null && _jsonReTxt.Msg != undefined) {

                    //top.window.open(_jsonReTxt.DataDic.GoImSysShopURL);

                    //openNewWindow_IM(_jsonReTxt.DataDic.GoImSysShopURL);

                    $("#EnterImSys").attr("href", _jsonReTxt.DataDic.GoImSysShopURL);
                    $("#EnterImSys2").attr("href", _jsonReTxt.DataDic.GoImSysShopURL);

                    

                    return;
                }

            }
            else {
                alert("商城还未开通【IM在线客服系统】,请联系平台官方！");
                return;
            }
        },
        error: function (xhr, errorTxt, status) {
            console.log("异步请求错误，errorTxt=" + errorTxt + " | status=" + status);
            return;
        }
    });

}



/**
 * 打开新的窗口不会被拦截
 * @param {any} url
 */
function openNewWindow_IM(url) {

    var a = document.createElement('a');

    a.setAttribute('href', url);

    a.setAttribute('target', '_blank');

    var id = Math.random(10000, 99999);

    a.setAttribute('id', id);

    // 防止反复添加

    if (!document.getElementById(id)) {

        document.body.appendChild(a);

    }

    a.click();

}
