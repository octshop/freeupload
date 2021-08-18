//==================商家中心-移动端==========================//

/**------定义公共变量----**/

//AjaxURL
var mAjaxUrl = "../Wap/Index";

var mShopID = ""; //店铺ID

//H5公众号端域名
var mhidOctWapWeb_AddrDomain = "";

//IM在线客服系统域名地址URL
var mhidImSystemWebDomainURL = "";

/**------初始化------**/
$(function () {

    mShopID = $("#hidShopID").val().trim();
    mhidOctWapWeb_AddrDomain = $("#hidOctWapWeb_AddrDomain").val().trim()
    mhidImSystemWebDomainURL = $("#hidImSystemWebDomainURL").val().trim()

    //加载店铺简单信息
    loadShopMsgSimple();

    //初始化店铺状态信息
    initShopStatusMsg();

    //统计商家IM在线客户提示数字
    countRedCircelHintNum();

    //统计商家移动端各项数据 -- 小红点数字
    countRedCircelHintNum_T_ShopCenter();

    //统计商家移动端 小红点数字-售后系统 
    countAsAcRCHintWapShopCenter();

});


/*******************自定义函数************************ */

/**
 * 初始化店铺状态信息
 * */
function initShopStatusMsg() {

    //构造POST参数
    var dataPOST = {
        "Type": "1",
    };
    console.log(dataPOST);

    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: mAjaxUrl + "?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("初始化店铺状态信息=" + reTxt);

            if (reTxt != "") {
                var _jsonReTxt = JSON.parse(reTxt);

                $("#StatusMsgB").html(_jsonReTxt.StatusMsg);
                if (_jsonReTxt.StatusCode != "S_01") {
                    $(".hint-msg").css("color", "#F06200");
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

                $("#hidShopID").html(_jsonReTxt.ShopID);
                $("#ShopIDB").html(_jsonReTxt.ShopID);
                $("#MobileB").html(_jsonReTxt.BindMobile);
                $("#ShopName").html(_jsonReTxt.ShopName);
                $("#CompanyName").html(_jsonReTxt.CompanyName);
                if (_jsonReTxt.ShopHeaderImg != "" && _jsonReTxt.ShopHeaderImg != null) {
                    $("#ShopHeaderImg").attr("src", "//" + _jsonReTxt.ShopHeaderImg);
                }
                $("#ShopMsgBar").on("click", function () {
                    window.location.href = "../WapPage/ShopDetail?SID=" + _jsonReTxt.ShopID + "";
                });

                //二维码生成
                $("#CreateQRScanA").attr("href", "../WapPage/CreateQRScan?SID=" + _jsonReTxt.ShopID);

                //店铺首页连接
                $("#ShopIndexLi").on("click", function () {
                    window.location.href = mhidOctWapWeb_AddrDomain + "/Shop/Index?SID=" + _jsonReTxt.ShopID + "";
                });

                //更多功能 MoreFunctionA
                $("#MoreFunctionA").attr("href", "../NavPage/Index?SID=" + _jsonReTxt.ShopID);

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
                    toastWin(_jsonReTxt.ErrMsg);
                    return;
                }

                //可正常进入IM在线客服系统
                if (_jsonReTxt.Msg != "" && _jsonReTxt.Msg != null && _jsonReTxt.Msg != undefined) {
                    window.location.href = _jsonReTxt.DataDic.GoImSysShopURL;
                    return;
                }

            }
            else {
                toastWin("商城还未开通【IM在线客服系统】,请联系平台官方！");
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
 * 统计商家IM在线客户提示数字
 * */
function countRedCircelHintNum() {

    //构造POST参数
    var dataPOST = {
        "Type": "2",
    };
    console.log(dataPOST);

    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: "../ImSys/Index?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("统计商家IM在线客户提示数字=" + reTxt);
            if (reTxt != "") {
                var _jsonReTxt = JSON.parse(reTxt);

                if (parseInt(_jsonReTxt.CountOnlineAskMemberSum) > 0) {
                    $("#CountIMNum").html(_jsonReTxt.CountOnlineAskMemberSum);
                    $("#CountIMNum").show();
                }


            }
            else {

            }
        },
        error: function (xhr, errorTxt, status) {
            console.log("异步请求错误，errorTxt=" + errorTxt + " | status=" + status);
            return;
        }
    });
}


/**
 * 统计商家移动端 小红点数字-售后系统 
 * */
function countRedCircelHintNum_T_ShopCenter() {

    //构造POST参数
    var dataPOST = {
        "Type": "2",
    };
    console.log(dataPOST);

    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: mAjaxUrl + "?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("统计商家移动端各项数据小红点数字=" + reTxt);
            if (reTxt != "") {
                var _jsonReTxt = JSON.parse(reTxt);

                if (_jsonReTxt.NewOrderTodayCount > 0) {
                    $("#NewOrderTodayCount").show();
                }
                $("#NewOrderTodayCount").html(_jsonReTxt.NewOrderTodayCount);

                if (_jsonReTxt.CountSettleApplyChecking > 0) {
                    $("#CountSettleApplyChecking").show();
                }
                $("#CountSettleApplyChecking").html(_jsonReTxt.CountSettleApplyChecking);

            }
            else {

            }
        },
        error: function (xhr, errorTxt, status) {
            console.log("异步请求错误，errorTxt=" + errorTxt + " | status=" + status);
            return;
        }
    });
}


/**
 * 统计商家移动端 小红点数字-售后系统 
 * */
function countAsAcRCHintWapShopCenter() {

    //构造POST参数
    var dataPOST = {
        "Type": "3",
    };
    console.log(dataPOST);

    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: mAjaxUrl + "?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("统计商家移动端 小红点数字-售后系统 =" + reTxt);
            if (reTxt != "") {
                var _jsonReTxt = JSON.parse(reTxt);

                if (parseInt(_jsonReTxt.ComplainNoFinishCount) > 0) {
                    $("#ComplainNoFinishCount").show();
                }
                $("#ComplainNoFinishCount").html(_jsonReTxt.ComplainNoFinishCount);

                if (parseInt(_jsonReTxt.AsNoFinishCount) > 0) {
                    $("#AsNoFinishCount").show();
                }
                $("#AsNoFinishCount").html(_jsonReTxt.AsNoFinishCount);

                if (parseInt(_jsonReTxt.NoReadShopSysMsgCount) > 0) {
                    $("#NoReadShopSysMsgCount").show();
                }
                $("#NoReadShopSysMsgCount").html(_jsonReTxt.NoReadShopSysMsgCount);

            }
            else {

            }
        },
        error: function (xhr, errorTxt, status) {
            console.log("异步请求错误，errorTxt=" + errorTxt + " | status=" + status);
            return;
        }
    });
}



