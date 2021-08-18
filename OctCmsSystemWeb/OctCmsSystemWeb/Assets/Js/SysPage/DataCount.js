//================数据统计===================//
/**-----定义公共变量------**/

//AjaxURL
var mAjaxUrl = "../Sys/DataCount";

/**------初始化------**/
$(function () {

    //统计订单的相关数据
    countOrderData();

    //统计店铺所有商品评价信息
    countAllGoodsAppraise();

    //统计优惠券各种总数
    countCouponsData();

});

//====================自定义函数==========================//

/**
 * 统计订单的相关数据
 * */
function countOrderData() {
    //构造POST参数
    var dataPOST = {
        "Type": "3", "IsTodayCount": "false",
    };
    console.log(dataPOST);

    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: "../Sys/Index?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("统计订单的相关数据=" + reTxt);

            if (reTxt != "") {
                var _jsonReTxt = JSON.parse(reTxt);

                //显示赋值 
                //订单统计
                //$("#NewOrderTodayCount").html(_jsonReTxt.NewOrderTodayCount);
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
 * 统计平台所有商品评价信息
 * */
function countAllGoodsAppraise() {

    //构造POST参数
    var dataPOST = {
        "Type": "4",
    };

    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: "../UserGoodsShop/GooAppraise?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("统计平台所有商品评价信息=" + reTxt);
            if (reTxt != "") {
                var _jsonReTxt = JSON.parse(reTxt);

                //赋值
                $("#CountAppraiseB").html(_jsonReTxt.CountAppraise);
                $("#CountGoodsAppraiseB").html(_jsonReTxt.CountGoodsAppraise);
                $("#CountMidAppraiseB").html(_jsonReTxt.CountMidAppraise);
                $("#CountBadAppraiseB").html(_jsonReTxt.CountBadAppraise);
                $("#SumAppraiseImgsB").html(_jsonReTxt.SumAppraiseImgs);
                $("#GoodAppraisePercentB").html((_jsonReTxt.GoodAppraisePercent * 100) + "%");
                $("#MidAppraisePercentB").html((_jsonReTxt.MidAppraisePercent * 100) + "%");
                $("#BadAppraisePercentB").html((_jsonReTxt.BadAppraisePercent * 100) + "%");

            }
        }
    });
}

/**
 * 统计优惠券各种总数
 * */
function countCouponsData() {

    //构造POST参数
    var dataPOST = {
        "Type": "1",
    };

    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: mAjaxUrl + "?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("统计优惠券各种总数=" + reTxt);
            if (reTxt != "") {
                var _jsonReTxt = JSON.parse(reTxt);

                //显示代码赋值
                $("#CouponsMsgCount").html(_jsonReTxt.CouponsMsgCount);
                $("#CouponsIssueMsgCount").html(_jsonReTxt.CouponsIssueMsgCount);
                $("#CouponsIssuUsedCount").html(_jsonReTxt.CouponsIssuUsedCount);

            }
        }
    });
}


