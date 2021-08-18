/*====================系统首页=====================*/


/**-----定义公共变量------**/

//AjaxURL
var mAjaxUrl = "../Sys/Index";

/**------初始化------**/
$(function () {

    //统计总数-各种数据
    initCountSumData();

    //得到平台的通知信息，一般是审核中
    getNotificationList();

    //统计今日订单的相关数据
    countOrderData();

    //统计售后和投诉信息
    countAfterSaleComplain();

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
                $("#CountSettleApplyChecking").html(_jsonReTxt.CountSettleApplyChecking);
                $("#CountBuyerWithDrawDisposing").html(_jsonReTxt.CountBuyerWithDrawDisposing);
                $("#CountGoodsNum").html(_jsonReTxt.CountGoodsNum);
                $("#CountOrderNum").html(_jsonReTxt.CountOrderNum);
                $("#CountCouponsNum").html(_jsonReTxt.CountCouponsNum);
                $("#CountAppraiseNum").html(_jsonReTxt.CountAppraiseNum);
                $("#CountComplainNum").html(_jsonReTxt.CountComplainNum);
                $("#CountSystemMsgNoRead").html(_jsonReTxt.CountSystemMsgNoRead);
                $("#CountUserAccount").html(_jsonReTxt.CountUserAccount);
                $("#CountShopMsg").html(_jsonReTxt.CountShopMsg);

            }
        },
        error: function (xhr, errorTxt, status) {
            console.log("异步请求错误，errorTxt=" + errorTxt + " | status=" + status);
            return;
        }
    });
}

/**
 * 得到平台的通知信息，一般是审核中
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
            console.log("得到平台的通知信息=" + reTxt);

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

