﻿//==================订单详情=====================//

/**-----定义公共变量------**/

//AjaxURL
var mAjaxUrl = "../Trading/OrderDetail";
var mOrderID = "";
var mOctWapWebAddrDomain = "";

/**------初始化------**/
$(function () {

    mOrderID = $("#hidOrderID").val().trim();
    mOctWapWebAddrDomain = $("#hidOctWapWebAddrDomain").val().trim();

    //初始化商家端订单详情
    initOrderDetail();

});

/**
 * 初始化商家端订单详情
 * */
function initOrderDetail() {
    //构造POST参数
    var dataPOST = {
        "Type": "1", "OrderID": mOrderID,
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

    var OrderMsg = pReTxtJson.OrderMsg
    var OrderStatusDesc = pReTxtJson.OrderStatusDesc
    var OrderGiftArr = pReTxtJson.OrderGiftArr
    var OrderInvoice = pReTxtJson.OrderInvoice
    var OrderSendGoods = pReTxtJson.OrderSendGoods
    var OrderDelivery = pReTxtJson.OrderDelivery
    var OrderSysMsg = pReTxtJson.OrderSysMsg
    var OrderMsgExtra = pReTxtJson.OrderMsgExtra

    $("#StatusTtitle").text(OrderStatusDesc.StatusTtitle);
    $("#StatusDesc").text(OrderStatusDesc.StatusDesc);
    $("#MsgContent").text("订单动态：" + OrderSysMsg.MsgContent + "  -- [ " + OrderSysMsg.WriteDate + " ]");
    $("#OrderID").text(OrderMsg.OrderID);
    $("#BillNumber").text(OrderMsg.BillNumber);
    $("#OrderPrice").text(OrderMsg.OrderPrice);
    $("#OrderTime").text(OrderMsg.OrderTime);

    //产品列表
    $("#OrderGoodsListDD").html(xhtmlGoodsList(OrderMsg.GoodsIDArr, OrderMsg.GoodsTitleArr, OrderMsg.GoodsSpecIDOrderNumArr, OrderMsg.GoodsUnitPriceArr, OrderMsg.SpecParamValArr, OrderMsg.IsSpecParamArr, OrderMsg.GroupID));

    $("#ExpressType").text(OrderMsg.ExpressType + " [ 送货上门 ]");
    if (OrderMsg.ExpressType == "shop") {
        $("#ExpressType").text("shop [ 到店消费/自取 ]");
    }

    $("#IsPaySuccess").text(OrderMsg.IsPaySuccess + " [ 未支付 ]");
    if (OrderMsg.IsPaySuccess == "true") {
        $("#IsPaySuccess").text("true [ 已支付 ]");
    }

    $("#PayWay").text(OrderMsg.PayWay);
    $("#PayTime").text(OrderMsg.PayTime);
    $("#UseMoney").text(OrderMsg.UseMoney);
    $("#CouponsMsgVal").text(OrderMsgExtra.CouponsTitle + " ( 优惠券ID：" + OrderMsgExtra.CouponsID + " ) ");
    $("#SkDiscountVal").text(OrderMsg.SkDiscount);
    $("#FreightMoney").text(OrderMsg.FreightMoney);
    $("#FreightTemplate").text(OrderMsgExtra.FtTitle + " ( 模板ID：" + OrderMsgExtra.FtID + " )");

    $("#IsSettle").text(OrderMsg.IsSettle + " [ 未结算 ] ");
    if (OrderMsg.IsSettle == "true") {
        $("#IsSettle").text(OrderMsg.IsSettle + " [ 已结算 ] ");
    }

    $("#IsRefund").text(OrderMsg.IsRefund + " [ 未退款 ] ");
    if (OrderMsg.IsRefund == "true") {
        $("#IsRefund").text(OrderMsg.IsRefund + " [ 已申请退款 ] ");
    }

    $("#IsPayService").text(OrderMsg.IsPayService + " [ 非服务商 ] ");
    if (OrderMsg.IsPayService == "true") {
        $("#IsPayService").text(OrderMsg.IsPayService + " [ 服务商 ] ");
    }

    $("#PayMemo").text(OrderMsg.PayMemo);
    $("#FinishTime").text(OrderMsg.FinishTime);
    $("#OrderMemo").text(OrderMsg.OrderMemo);

    //----赠品信息-----//
    $("#OrderGiftList").html(xhtmlGiftMsgList(OrderGiftArr));

    //----发票信息----  //
    if (OrderInvoice.InvoiceType != null) {
        //发票类型(General 普通发票  AddValue 增值税专用发票)
        $("#InvoiceType").text(OrderInvoice.InvoiceType + " [ 普通发票 ] ");
        if (OrderInvoice.InvoiceType == "AddValue") {
            $("#InvoiceType").text(OrderInvoice.InvoiceType + " [ 增值税专用发票 ] ");
        }
        //发票抬头 ( Person 个人  /  Company  企业 )
        $("#InvoiceTitle").text(OrderInvoice.InvoiceTitle + " [ 个人 ] ");
        if (OrderInvoice.InvoiceTitle == "Company") {
            $("#InvoiceTitle").text(OrderInvoice.InvoiceTitle + " [ 企业 ] ");
        }

        //发票内容（GoodsDetail 商品明细 GoodsType 商品类别  InvoiceNo 不开发票  等）
        $("#InvoiceContent").text(OrderInvoice.InvoiceContent + " [ 不开发票 ] ");
        if (OrderInvoice.InvoiceContent == "GoodsType") {
            $("#InvoiceContent").text(OrderInvoice.InvoiceContent + " [ 商品类别 ] ");
        }
        else if (OrderInvoice.InvoiceContent == "GoodsDetail") {
            $("#InvoiceContent").text(OrderInvoice.InvoiceContent + " [ 商品明细 ] ");
        }

        $("#ReceiMobile").text(OrderInvoice.ReceiMobile);
        $("#ReceiEmail").text(OrderInvoice.ReceiEmail);
        $("#CompanyName").text(OrderInvoice.CompanyName);
        $("#TaxNumber").text(OrderInvoice.TaxNumber);
        $("#CompanyTel").text(OrderInvoice.CompanyTel);
        $("#CompanyRegAddr").text(OrderInvoice.CompanyRegAddr);
        $("#BankAcc").text(OrderInvoice.BankAcc);
        $("#OpeningBank").text(OrderInvoice.OpeningBank);
        $("#BankCode").text(OrderInvoice.BankCode);
    }

    //----收货人信息----//
    if (OrderDelivery.DeliName != null && OrderDelivery.DeliName != "" && OrderDelivery.DeliName != undefined) {
        $("#DeliName").text(OrderDelivery.DeliName);
        $("#Mobile").text(OrderDelivery.Mobile);
        $("#RegionNameArr").text(OrderDelivery.RegionNameArr);
        $("#DetailAddr").text(OrderDelivery.RegionNameArr + "_" + OrderDelivery.DetailAddr);
    }

    //-----发货信息--------//
    if (OrderSendGoods.SendType != null && OrderSendGoods.SendType != undefined && OrderSendGoods.SendType != "") {

        //送货方式(Express 快递发货， MySend 自己送货)
        $("#SendType").text(OrderSendGoods.SendType + " [ 快递发货 ] ");
        if (OrderSendGoods.SendType == "MySend") {
            $("#SendType").text(OrderSendGoods.SendType + " [ 自己送货 ] ");
        }
        $("#ExpressName").text(OrderSendGoods.ExpressName);
        $("#ExpressNumber").text(OrderSendGoods.ExpressNumber);
        $("#SendShopMan").text(OrderSendGoods.SendShopMan);
        $("#SendTelNumber").text(OrderSendGoods.SendTelNumber);
        $("#SendGoodsMemo").text(OrderSendGoods.SendGoodsMemo);
    }

}

/**
 * 构造产品列表
 * @param {any} pGoodsIDArr
 * @param {any} pGoodsTitleArr
 * @param {any} pGoodsSpecIDOrderNumArr
 * @param {any} pGoodsUnitPriceArr
 * @param {any} pSpecParamValArr
 * @param {any} pIsSpecParamArr
 */
function xhtmlGoodsList(pGoodsIDArr, pGoodsTitleArr, pGoodsSpecIDOrderNumArr, pGoodsUnitPriceArr, pSpecParamValArr, pIsSpecParamArr, pGroupID) {
    //分割字符串
    var GoodsIDArr = new Array();
    var GoodsTitleArr = new Array();
    var GoodsSpecIDOrderNumArr = new Array();
    var GoodsUnitPriceArr = new Array();
    var SpecParamValArr = new Array();
    var IsSpecParamArr = new Array();
    if (pGoodsIDArr.indexOf("^") >= 0) {
        GoodsIDArr = pGoodsIDArr.split("^");
        GoodsTitleArr = pGoodsTitleArr.split("^");
        GoodsSpecIDOrderNumArr = pGoodsSpecIDOrderNumArr.split("^");
        GoodsUnitPriceArr = pGoodsUnitPriceArr.split("^");
        SpecParamValArr = pSpecParamValArr.split("^");
        IsSpecParamArr = pIsSpecParamArr.split("^");
    }
    else {
        GoodsIDArr[0] = pGoodsIDArr;
        GoodsTitleArr[0] = pGoodsTitleArr;
        GoodsSpecIDOrderNumArr[0] = pGoodsSpecIDOrderNumArr;
        GoodsUnitPriceArr[0] = pGoodsUnitPriceArr;
        SpecParamValArr[0] = pSpecParamValArr;
        IsSpecParamArr[0] = pIsSpecParamArr;
    }
    var myJsVal = "";
    for (var i = 0; i < GoodsIDArr.length; i++) {

        //订购的数量
        var _orderNum = GoodsSpecIDOrderNumArr[i].split("_")[1];
        var _specParamName = "";
        if (IsSpecParamArr[i] == "true") {
            _specParamName = " [ " + SpecParamValArr[i] + " ] ";
        }

        myJsVal += "<div>";
        }
        }
    return myJsVal;
}

/**
 * 构造赠品列表显示代码
 * @param {any} pOrderGiftJsonArr
 */
function xhtmlGiftMsgList(pOrderGiftJsonArr) {

    if (pOrderGiftJsonArr == null || pOrderGiftJsonArr == undefined) {
        return "";
    }


    var myJsVal = "";
    for (var i = 0; i < pOrderGiftJsonArr.length; i++) {

        console.log(pOrderGiftJsonArr);

        myJsVal += "<div>";
    }
    return myJsVal;
