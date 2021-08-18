//==================订单详情=====================//

/**-----定义公共变量------**/

//AjaxURL
var mAjaxUrl = "../Trading/OrderDetail";
var mOrderID = "";
var mOctWapWebAddrDomain = "";

var mPayWay = "";
var mBillNumber = "";
var mRefundAmount = "";
var mBuyerUserID = "";
var mShopUserID = "";


/**------初始化------**/
$(function () {

    mOrderID = $("#hidOrderID").val().trim();
    mOctWapWebAddrDomain = $("#hidOctWapWebAddrDomain").val().trim();

    //初始化商家端订单详情
    initOrderDetail();

});

/**
 * 初始化订单详情
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
            console.log("初始化订单详情=" + reTxt);

            if (reTxt != "") {
                var _jsonReTxt = JSON.parse(reTxt);
                //赋值到显示代码中
                setValToXhtml(_jsonReTxt);

                mPayWay = _jsonReTxt.OrderMsgExtra.PayWayCode;
                mBillNumber = _jsonReTxt.OrderMsg.BillNumber;
                mRefundAmount = _jsonReTxt.OrderMsg.OrderPrice;
                mBuyerUserID = _jsonReTxt.OrderMsg.BuyerUserID;
                mShopUserID = _jsonReTxt.OrderMsg.ShopUserID;

                //显示按钮组区域
                if (_jsonReTxt.OrderMsg.OrderStatus == "退款中") {
                    $("#ExeBtnList").show();
                }

                if (_jsonReTxt.OrderMsg.OrderStatus == "退款中") {

                    $("#ExeBtnItemRefund").show();
                    if (mPayWay == "WeiXinPay" || mPayWay == "Alipay" || mPayWay == "Balance") {
                        //显示按支付原路返回按钮
                        $("#BtnPayWayBack").show();
                    }
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
 * 赋值到显示代码中
 * @param {any} pReTxtJson 接口返回的Json对象
 */
function setValToXhtml(pReTxtJson) {

    var OrderMsg = pReTxtJson.OrderMsg;
    var ShopMsg = pReTxtJson.ShopMsg;
    var OrderStatusDesc = pReTxtJson.OrderStatusDesc;
    var OrderGiftMsg = pReTxtJson.OrderGiftMsg;
    var OrderInvoice = pReTxtJson.OrderInvoice;
    var OrderSendGoods = pReTxtJson.OrderSendGoods;
    var OrderDelivery = pReTxtJson.OrderDelivery;
    var OrderSysMsg = pReTxtJson.OrderSysMsg;
    var OrderMsgExtra = pReTxtJson.OrderMsgExtra;

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
    $("#OrderGiftList").html(xhtmlGiftMsgList(OrderGiftMsg));

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

    //-----店铺信息------//
    if (ShopMsg.ShopName != null && ShopMsg.ShopName != "") {

        $("#ShopName").html("<a href=\"" + mOctWapWebAddrDomain + "/Mall/PagePreMobileIframe?LoadPreURL=" + mOctWapWebAddrDomain + "/Shop/Index?SID=" + ShopMsg.ShopID + "\" target=\"_blank\"><img src=\"//" + ShopMsg.ShopHeaderImg + "\" />" + ShopMsg.ShopName + "</a>");
        $("#DetailAddr").html(ShopMsg.RegionNameArr + "_" + ShopMsg.DetailAddr);
        $("#ShopID").html(ShopMsg.ShopID);
        $("#ShopUserID").html(ShopMsg.ShopUserID);
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

        myJsVal += "<div>";        myJsVal += "  <span>";        if (pGroupID != 0 && pGroupID != undefined && pGroupID != "") {            myJsVal += "      <a href=\"" + mOctWapWebAddrDomain + "/Goods/GroupDetailPreMobileIframe?GID=" + GoodsIDArr[i] + "\" target=\"_blank\">" + GoodsTitleArr[i] + "  " + _specParamName + "</a>";
        }        else {            myJsVal += "      <a href=\"" + mOctWapWebAddrDomain + "/Goods/GoodsDetailPreMobileIframe?GID=" + GoodsIDArr[i] + "\" target=\"_blank\">" + GoodsTitleArr[i] + "  " + _specParamName + "</a>";
        }        myJsVal += "  </span>";        myJsVal += "  <span>";        myJsVal += "      &#165;" + GoodsUnitPriceArr[i] + "  x " + _orderNum + "";        myJsVal += "  </span>";        myJsVal += "</div>";    }
    return myJsVal;
}

/**
 * 构造赠品列表显示代码
 * @param {any} pOrderGiftJsonArr
 */
function xhtmlGiftMsgList(pOrderGiftMsgJson) {

    if (pOrderGiftMsgJson == null || pOrderGiftMsgJson == undefined) {
        return "";
    }

    var GiftNumList = pOrderGiftMsgJson.GiftNumList;
    var GiftMsgList = pOrderGiftMsgJson.GiftMsgList;

    var myJsVal = "";
    for (var i = 0; i < GiftMsgList.length; i++) {


        myJsVal += "<div>";        myJsVal += " <span>";        myJsVal += "<a href=\"" + mOctWapWebAddrDomain + "/Mall/PagePreMobileIframe?LoadPreURL=" + mOctWapWebAddrDomain + "/Goods/GiftDetail?GIID=" + GiftMsgList[i].GiftID + "\" target=\"_blank\">" + GiftMsgList[i].GiftName + "</a>";        myJsVal += " </span>";        myJsVal += " <span>";        myJsVal += "     &#165; " + GiftMsgList[i].GiftPrice + " &nbsp; x " + GiftNumList[i].GiftNum + "";        myJsVal += " </span>";        myJsVal += "</div>";
    }
    return myJsVal;}

/**
 * (后台CMS)在线支付退款处理 --带订单逻辑处理 - WeiXinPay [微信支付], Alipay[支付宝] , Balance[余额支付]
 * */
function refundOnLinePayLogicOrder() {

    if (mOrderID == "" || mPayWay == "" || mBillNumber == "" || mRefundAmount == "" || mBuyerUserID == "" || mShopUserID == "") {
        toastWin("订单信息错误不能退款！");
        return;
    }
    if (mPayWay != "WeiXinPay" && mPayWay != "Alipay" && mPayWay != "Balance") {
        toastWin("只有,微信支付,支付宝,余额支付才能退款！");
        return;
    }

    confirmWinWidth("确定要退款吗？", function () {

        //构造POST参数
        var dataPOST = {
            "Type": "2", "OrderID": mOrderID, "PayWay": mPayWay, "BillNumber": mBillNumber, "RefundAmount": mRefundAmount, "BuyerUserID": mBuyerUserID, "ShopUserID": mShopUserID,
        };
        console.log(dataPOST);

        //正式发送异步请求
        $.ajax({
            type: "POST",
            url: mAjaxUrl + "?rnd=" + Math.random(),
            data: dataPOST,
            dataType: "html",
            success: function (reTxt, status, xhr) {
                console.log("退款处理=" + reTxt);

                if (reTxt != "") {
                    var _jsonReTxt = JSON.parse(reTxt);

                    if (_jsonReTxt.ErrMsg != "" && _jsonReTxt.ErrMsg != null && _jsonReTxt.ErrMsg != undefined) {
                        toastWin(_jsonReTxt.ErrMsg);
                        return;
                    }

                    if (_jsonReTxt.Msg != "" && _jsonReTxt.Msg != null && _jsonReTxt.Msg != undefined) {
                        toastWinCb(_jsonReTxt.Msg, function () {
                            //刷新页面
                            window.location.reload();
                        });
                        return;
                    }
                }
            },
            error: function (xhr, errorTxt, status) {
                console.log("异步请求错误，errorTxt=" + errorTxt + " | status=" + status);
                return;
            }
        });

    }, 400);
}

/**
 * 已退款给买家商城数据逻辑处理
 * */
function proRefundedToBuyerData() {

    if (mOrderID == "" || mBuyerUserID == "" || mShopUserID == "") {
        toastWin("订单信息错误不能退款！");
        return;
    }
    if (mPayWay != "WeiXinPay" && mPayWay != "Alipay" && mPayWay != "Transfer") {
        toastWin("只有微信支付,支付宝,银行转账支付才能使用此退款方式！");
        return;
    }

    confirmWinWidth("确定已将款项退回给买家了吗？", function () {

        //构造POST参数
        var dataPOST = {
            "Type": "3", "OrderID": mOrderID, "BuyerUserID": mBuyerUserID, "ShopUserID": mShopUserID,
        };
        console.log(dataPOST);

        //正式发送异步请求
        $.ajax({
            type: "POST",
            url: mAjaxUrl + "?rnd=" + Math.random(),
            data: dataPOST,
            dataType: "html",
            success: function (reTxt, status, xhr) {
                console.log("退款处理=" + reTxt);

                if (reTxt != "") {
                    var _jsonReTxt = JSON.parse(reTxt);

                    if (_jsonReTxt.ErrMsg != "" && _jsonReTxt.ErrMsg != null && _jsonReTxt.ErrMsg != undefined) {
                        toastWin(_jsonReTxt.ErrMsg);
                        return;
                    }

                    if (_jsonReTxt.Msg != "" && _jsonReTxt.Msg != null && _jsonReTxt.Msg != undefined) {
                        toastWinCb(_jsonReTxt.Msg, function () {
                            //刷新页面
                            window.location.reload();
                        });
                        return;
                    }
                }
            },
            error: function (xhr, errorTxt, status) {
                console.log("异步请求错误，errorTxt=" + errorTxt + " | status=" + status);
                return;
            }
        });

    }, 400);
}