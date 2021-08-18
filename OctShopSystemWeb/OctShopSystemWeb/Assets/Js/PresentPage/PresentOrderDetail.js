//==================礼品订单详情=====================//

/**-----定义公共变量------**/

//AjaxURL
var mAjaxUrl = "../Present/PresentOrderMsg";
var mPstOrderID = "";
var mOctWapWebAddrDomain = "";

/**------初始化------**/
$(function () {

    mPstOrderID = $("#hidPOID").val().trim();
    mOctWapWebAddrDomain = $("#hidOctWapWebAddrDomain").val().trim();

    //初始化商家端订单详情
    initPresentOrderDetail();

});


/**
 * 初始化商家端订单详情
 * */
function initPresentOrderDetail() {
    //构造POST参数
    var dataPOST = {
        "Type": "5", "PstOrderID": mPstOrderID,
    };
    console.log(dataPOST);

    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: mAjaxUrl + "?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("初始化商家端订单详情=" + reTxt);

            if (reTxt != "") {
                var _jsonObj = JSON.parse(reTxt);
                //赋值到显示代码中
                setValToXhtml(_jsonObj);
            }
        },
        error: function (xhr, errorTxt, status) {
            console.log("异步请求错误，errorTxt=" + errorTxt + " | status=" + status);
            return;
        }
    });
}


/**
 * 赋值到显示代码中
 * @param {any} pReTxtJson 接口返回的Json对象
 */
function setValToXhtml(pReTxtJson) {

    var PresentOrderMsg = pReTxtJson.PresentOrderMsg
    var OrderStatusArr = pReTxtJson.OrderStatusArr
    var PresentOrderSendGoods = pReTxtJson.PresentOrderSendGoods
    var PresentOrderDelivery = pReTxtJson.PresentOrderDelivery
    //var ShopMsg = pReTxtJson.ShopMsg

    $("#StatusTtitle").text(OrderStatusArr.OrderStatusTtitle);
    $("#StatusDesc").text(OrderStatusArr.OrderStatusDesc);

    //基本信息
    $("#PstOrderID").html(PresentOrderMsg.PstOrderID);
    $("#BillNumber").html(PresentOrderMsg.BillNumber);
    $("#OrderPrice").html(formatNumberDotDigit(PresentOrderMsg.OrderPrice, 2));
    $("#OrderTime").html(PresentOrderMsg.OrderTime);

    //配送方式（送货上门(快递) express 到店消费自取 shop）
    var _ExpressType = "express-送货上门(快递)";
    if (PresentOrderMsg.ExpressType == "shop") {
        _ExpressType = "shop-到店消费自取";
    }
    $("#ExpressType").html(_ExpressType);

    var _IsPaySuccess = "false-未支付"
    if (PresentOrderMsg.IsPaySuccess == "true") {
        _IsPaySuccess = "true-已支付"
    }
    $("#IsPaySuccess").html(_IsPaySuccess);

    var _PayWay = "Integral-积分支付"
    $("#PayWay").html(_PayWay);

    $("#PayTime").html(PresentOrderMsg.PayTime);

    var _IsPinkage = "true-包邮-免运费";
    if (PresentOrderMsg.IsPinkage == "false") {
        _IsPinkage = "false-不包邮-买家付运费";
    }
    $("#IsPinkage").html(_IsPinkage);

    $("#FinishTime").html(PresentOrderMsg.FinishTime);
    $("#OrderMemo").html(PresentOrderMsg.OrderMemo);

    //----收货人信息----//
    if (PresentOrderDelivery != undefined) {
        if (PresentOrderDelivery.DeliName != null && PresentOrderDelivery.DeliName != "" && PresentOrderDelivery.DeliName != undefined) {
            $("#DeliName").text(PresentOrderDelivery.DeliName);
            $("#Mobile").text(PresentOrderDelivery.Mobile);
            $("#RegionNameArr").text(PresentOrderDelivery.RegionNameArr);
            $("#DetailAddr").text(PresentOrderDelivery.RegionNameArr + "_" + PresentOrderDelivery.DetailAddr);
        }
    }


    //-----礼品信息-----//
    var myJsVal = "";    myJsVal += "<span>";    myJsVal += " <a href=\"" + mOctWapWebAddrDomain + "//Present/PresentDetailPreMobileIframe?PID=" + PresentOrderMsg.PresentIDArr + "\" target=\"_blank\">" + PresentOrderMsg.PresentTitleArr + "</a>";    myJsVal += " </span>";    myJsVal += "<span>";    myJsVal += "&#165; " + formatNumberDotDigit(PresentOrderMsg.PresentPriceArr, 2) + "  x 1";    myJsVal += " </span>";    $("#PresentOrderGoodsListDD").html(myJsVal);


    //-----发货信息--------//
    if (PresentOrderSendGoods != undefined) {
        if (PresentOrderSendGoods.SendType != null && PresentOrderSendGoods.SendType != undefined && PresentOrderSendGoods.SendType != "") {

            //送货方式(Express 快递发货， MySend 自己送货)
            $("#SendType").text(PresentOrderSendGoods.SendType + " [ 快递发货 ] ");
            if (PresentOrderSendGoods.SendType == "MySend") {
                $("#SendType").text(PresentOrderSendGoods.SendType + " [ 自己送货 ] ");
            }
            $("#ExpressName").text(PresentOrderSendGoods.ExpressName);
            $("#ExpressNumber").text(PresentOrderSendGoods.ExpressNumber);
            $("#SendShopMan").text(PresentOrderSendGoods.SendShopMan);
            $("#SendTelNumber").text(PresentOrderSendGoods.SendTelNumber);
            $("#SendGoodsMemo").text(PresentOrderSendGoods.SendGoodsMemo);
        }
    }
}


