//==============系统首页====================//

/**-----定义公共变量------**/

//AjaxURL
var mAjaxUrl = "../Sys/Index";

/**------初始化------**/
$(function () {

    //统计总数-各种数据
    initCountSumData();

    //得到平台与商家的通知信息，一般是审核中
    getNotificationList();

    //统计今日订单的相关数据
    countOrderData();

    //统计售后和投诉信息
    countAfterSaleComplain();

    //自动确认收货-商家版
    autoConfirmReceiOrderShop();

    //自动完成售后，自动确认签收 售后商品--商家版
    autoConfirmReceiAsGoodsFinishShop();

    //统计商家IM在线客户提示数字
    countRedCircelHintNum();

    //进入IM在线客服系统
    enterImSys();

});


/**
 *  统计总数-各种数据
 * */
function initCountSumData() {

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
            console.log("统计总数-各种数据=" + reTxt);

            if (reTxt != "") {
                var _jsonReTxt = JSON.parse(reTxt);

                //显示赋值
                $("#SumAblSettleBalance").html("&#165; " + _jsonReTxt.SumAblSettleBalance);
                $("#ShopCurrentIntegral").html(_jsonReTxt.ShopCurrentIntegral);
                $("#CountGoodsNum").html(_jsonReTxt.CountGoodsNum);
                $("#CountOrderNum").html(_jsonReTxt.CountOrderNum);
                $("#CountCouponsNum").html(_jsonReTxt.CountCouponsNum);
                $("#CountAppraiseNum").html(_jsonReTxt.CountAppraiseNum);
                $("#CountComplainNum").html(_jsonReTxt.CountComplainNum);
            }
        },
        error: function (xhr, errorTxt, status) {
            console.log("异步请求错误，errorTxt=" + errorTxt + " | status=" + status);
            return;
        }
    });
}

/**
 * 得到平台与商家的通知信息，一般是审核中
 * */
function getNotificationList() {

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
            console.log("得到平台与商家的通知信息=" + reTxt);

            if (reTxt != "") {
                var _jsonReTxt = JSON.parse(reTxt);

                //构造通知显示代码
                var myJsVal = "";
                for (var i = 0; i < _jsonReTxt.NotificationList.length; i++) {

                    var _notification = _jsonReTxt.NotificationList[i];

                    myJsVal += " <a class=\"notification-bar\" href=\"" + _notification.NotifiHref + "\"><i class=\"am-icon-volume-up\"></i>" + _notification.NotifiTitle + "</a>";
                }
                //显示代码插入前台 
                $("#NotificationList").html(myJsVal);

            }
        },
        error: function (xhr, errorTxt, status) {
            console.log("异步请求错误，errorTxt=" + errorTxt + " | status=" + status);
            return;
        }
    });
}

/**
 * 统计今日订单的相关数据
 * */
function countOrderData() {
    //构造POST参数
    var dataPOST = {
        "Type": "3", "IsTodayCount": "true",
    };
    console.log(dataPOST);

    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: mAjaxUrl + "?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("统计今日订单的相关数据=" + reTxt);

            if (reTxt != "") {
                var _jsonReTxt = JSON.parse(reTxt);

                //显示赋值 
                //今日订单统计
                $("#NewOrderTodayCount").html(_jsonReTxt.NewOrderTodayCount);
                $("#WaitSendOrderCount").html(_jsonReTxt.WaitSendOrderCount);
                $("#WaitExpenseOrderCount").html(_jsonReTxt.WaitExpenseOrderCount);
                $("#WaitReceiOrderCount").html(_jsonReTxt.WaitReceiOrderCount);
                $("#WaitShareOrderCount").html(_jsonReTxt.WaitShareOrderCount);
                $("#WaitPayOrderCount").html(_jsonReTxt.WaitPayOrderCount);
                $("#WaitComfirmOrderCount").html(_jsonReTxt.WaitComfirmOrderCount);
                $("#ShopPayOrderCount").html(_jsonReTxt.ShopPayOrderCount);
                $("#TransPayOrderCount").html(_jsonReTxt.TransPayOrderCount);
                $("#WaitAppraiseOrderCount").html(_jsonReTxt.WaitAppraiseOrderCount);
                $("#FinishOrderCount").html(_jsonReTxt.FinishOrderCount);
                $("#CancelOrderCount").html(_jsonReTxt.CancelOrderCount);
                $("#RefuseOrderCount").html(_jsonReTxt.RefuseOrderCount);
                $("#WaitRefundOrderCount").html(_jsonReTxt.WaitRefundOrderCount);
                $("#WaitRefundSuOrderCount").html(_jsonReTxt.WaitRefundSuOrderCount);
                //今日扫码收单
                $("#AggrePaySuOrderCount").html(_jsonReTxt.AggrePaySuOrderCount);
                $("#AggreRefundOrderCount").html(_jsonReTxt.AggreRefundOrderCount);
                $("#AggreRefundOrderSuCount").html(_jsonReTxt.AggreRefundOrderSuCount);
                //今日礼品订单
                $("#PresentWaitPayOrderCount").html(_jsonReTxt.PresentWaitPayOrderCount);
                $("#PresentWaitSendOrderCount").html(_jsonReTxt.PresentWaitSendOrderCount);
                $("#PresentWaitExpenseOrderCount").html(_jsonReTxt.PresentWaitExpenseOrderCount);
                $("#PresentWaitReceiOrderCount").html(_jsonReTxt.PresentWaitReceiOrderCount);
                $("#PresentWaitFinishOrderCount").html(_jsonReTxt.PresentWaitFinishOrderCount);

            }
        },
        error: function (xhr, errorTxt, status) {
            console.log("异步请求错误，errorTxt=" + errorTxt + " | status=" + status);
            return;
        }
    });
}

/**
 * 统计售后和投诉信息
 * */
function countAfterSaleComplain() {
    //构造POST参数
    var dataPOST = {
        "Type": "4",
    };
    console.log(dataPOST);

    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: mAjaxUrl + "?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("统计售后和投诉信息=" + reTxt);

            if (reTxt != "") {
                var _jsonReTxt = JSON.parse(reTxt);

                //显示赋值 
                $("#WaitCheckCount").html(_jsonReTxt.WaitCheckCount);
                $("#BuyerSendCount").html(_jsonReTxt.BuyerSendCount);
                $("#ShopReceiCount").html(_jsonReTxt.ShopReceiCount);
                $("#ShopDisposeCount").html(_jsonReTxt.ShopDisposeCount);
                $("#ShopSendBackCount").html(_jsonReTxt.ShopSendBackCount);
                $("#WaitShopVisitCount").html(_jsonReTxt.WaitShopVisitCount);
                $("#ShopVisitedCount").html(_jsonReTxt.ShopVisitedCount);
                $("#ShopRefundCount").html(_jsonReTxt.ShopRefundCount);
                $("#ShopRefundSuCount").html(_jsonReTxt.ShopRefundSuCount);
                $("#FinishCount").html(_jsonReTxt.FinishCount);
                $("#RefuseCount").html(_jsonReTxt.RefuseCount);
                //投诉处理统计
                $("#ComplainDisposeCount").html(_jsonReTxt.ComplainDisposeCount);
                $("#ComplainOfficialCount").html(_jsonReTxt.ComplainOfficialCount);
                $("#ComplainBuyerConfirmCount").html(_jsonReTxt.ComplainBuyerConfirmCount);
                $("#ComplainFinishCount").html(_jsonReTxt.ComplainFinishCount);

            }
        },
        error: function (xhr, errorTxt, status) {
            console.log("异步请求错误，errorTxt=" + errorTxt + " | status=" + status);
            return;
        }
    });
}

/**
 * 自动确认收货-商家版
 * */
function autoConfirmReceiOrderShop() {

    //构造POST参数
    var dataPOST = {
        "Type": "13",
    };
    console.log(dataPOST);

    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: "../Trading/OrderMan?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("自动确认收货-商家版=" + reTxt);

            if (reTxt != "") {
                //var _jsonReTxt = JSON.parse(reTxt);

            }
        },
        error: function (xhr, errorTxt, status) {
            console.log("异步请求错误，errorTxt=" + errorTxt + " | status=" + status);
            return;
        }
    });

}

/**
 * 自动完成售后，自动确认签收 售后商品--商家版
 * */
function autoConfirmReceiAsGoodsFinishShop() {

    //构造POST参数
    var dataPOST = {
        "Type": "12",
    };
    console.log(dataPOST);

    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: "../AfterSale/AfterSaleApplyMsg?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("自动完成售后-商家版=" + reTxt);

            if (reTxt != "") {
                //var _jsonReTxt = JSON.parse(reTxt);

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

                    //window.location.href = _jsonReTxt.DataDic.GoImSysShopURL;
                    //top.window.open(_jsonReTxt.DataDic.GoImSysShopURL);

                    $("#EnterImSys").attr("href", _jsonReTxt.DataDic.GoImSysShopURL);

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

                $("#CountIMNum").html(_jsonReTxt.CountOnlineAskMemberSum);

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
