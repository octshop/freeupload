//=============订单支付===================//

/**-----定义公共变量------**/
var mAjaxUrl = "../PayAjax/OrderPay";

//订单ID
var mOrderID = "";


//-----支付相关-----//
var mSelPayType = "WeiXinPay"; //当前选择支付方式 
var mPayJsonReTxt = null; //提交订单返回的信息  -- 支付要用的

var mCurrentBalance = 0; //当前的用户余额
var mCurrentIntegral = 0; //当前的用户积分

var mTotalOrderPrice = 0; //所有支付订单的总额
var mIsPayDelivery = "false"; //是否显示货到付款支付项
var mIsPayOffline = "false"; //是否显示【到店付】项
var mIsBuyerIntegralPay = "false"; //是否显示【积分支付】项
var mIsPayTransfer = "false"; //是否显示【银行转账】项



/**------初始化------**/
$(function () {

    mOrderID = $("#hidOrderID").val().trim();

    //初始化订单信息
    initOrderMsg();

});


/**
 * 初始化订单信息
 * */
function initOrderMsg() {

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
            console.log("初始化订单信息=" + reTxt);
            if (reTxt != "") {
                var _jsonReTxt = JSON.parse(reTxt);

                //设置值到页面
                setValToForm(_jsonReTxt);

                //保存更新订单的收货地址
                updateOrderDelivery();
            }
        }
    });
}

/**
 * 设置值到页面
 * @param {any} pJsonReTxt
 */
function setValToForm(pJsonReTxt) {

    //订单状态信息
    var OrderStatus = pJsonReTxt.OrderStatus;
    //店铺信息
    var ShopMsg = pJsonReTxt.ShopMsg;
    //订单收货地址 
    var OrderDelivery = pJsonReTxt.OrderDelivery;
    //订单发票
    var OrderInvoice = pJsonReTxt.OrderInvoice;
    //订单信息
    var OrderMsg = pJsonReTxt.OrderMsg;
    //订单额外信息
    var OrderMsgExtra = pJsonReTxt.OrderMsgExtra;

    //赋值店铺地址和收货地址
    if (OrderMsg.ExpressType.indexOf("送货上门") >= 0) {

        $("#SelAddrClick").show();
        $("#ShopAddrNav").hide();

        //设置订单的收货地址
        setValOrderDelivery(OrderDelivery);
    }
    else {

        $("#SelAddrClick").hide();
        $("#ShopAddrNav").show();

        //设置店铺导航信息
        setShopAddrMsg(ShopMsg);
    }
    //店铺名称
    $("#ShopNameALink").attr("href", "../Shop/Index?ShID=" + ShopMsg.ShopID);
    $("#ShopNameALink").html(ShopMsg.ShopName);

    //构造商品显示代码 列表
    var _xhtmlGoods = xhtmlGoods(OrderMsg, OrderMsgExtra);
    $("#OrderGoodsList").html(_xhtmlGoods);

    //配送方式
    if (OrderMsg.ExpressType.indexOf("送货上门") >= 0) {
        OrderMsg.ExpressType = "送货上门(快递)";
    }
    $("#ExpressValDiv").html(OrderMsg.ExpressType);

    //运费
    $("#FreightValB").html("&#165; " + formatNumberDotDigit(OrderMsg.FreightMoney));

    //发票 构造发票显示信息
    $("#InvoiceValDiv").html(xhtmlInvoice(OrderInvoice));

    // 优惠券
    $("#CouponsMsgSpan").html("减 " + OrderMsg.UseMoney + " 元<b>&#165;-" + formatNumberDotDigit(OrderMsg.UseMoney) + "</b>");

    //商品的总件数 统计订单总的商品总数
    $("#OrderNumB").html(countGoodsOrderNum(OrderMsg.GoodsSpecIDOrderNumArr));

    //支付总额
    $("#SumPriceContentDiv").html("&#165; " + formatNumberDotDigit(OrderMsg.OrderPrice));
    $("#SumOrderPriceB").html("&#165; " + formatNumberDotDigit(OrderMsg.OrderPrice));

    //订单备注
    $("#OrderMemo").val(OrderMsg.OrderMemo);


    //设置订单类型标签 -- 拼团 , 秒杀
    if (OrderMsg.GroupID != "0" && OrderMsg.GroupID != 0) {
        $("#OrderTypeLabelSpan").show();
        $("#OrderTypeLabelSpan").html("拼团");
    }
    else if (OrderMsg.SkGoodsID != "0" && OrderMsg.SkGoodsID != 0) {
        $("#OrderTypeLabelSpan").show();
        $("#OrderTypeLabelSpan").html("秒杀");
    }


}

/**
 * 统计订单总的商品总数
 * @param {any} pGoodsSpecIDOrderNumArr
 */
function countGoodsOrderNum(pGoodsSpecIDOrderNumArr) {

    var _GoodsSpecIDOrderNumArr = new Array();
    if (pGoodsSpecIDOrderNumArr.indexOf("^") >= 0) {
        _GoodsSpecIDOrderNumArr = pGoodsSpecIDOrderNumArr.split("^");
    }
    else {
        _GoodsSpecIDOrderNumArr[0] = pGoodsSpecIDOrderNumArr;
    }
    //总数
    var _sumCount = 0;
    //循环统计
    for (var i = 0; i < _GoodsSpecIDOrderNumArr.length; i++) {
        var _orderNumArr = _GoodsSpecIDOrderNumArr[i].split("_");
        _sumCount += parseInt(_orderNumArr[1]);
    }
    return _sumCount;
}

/**
 * 构造发票显示信息
 * @param {any} pOrderInvoiceJson 订单发票信息Json对象
 */
function xhtmlInvoice(pOrderInvoiceJson) {



    if (pOrderInvoiceJson.InvoiceID == 0) {
        return "不开发票";
    }

    var _xhtml = "";

    var _invoiceContent = "不开发票";
    if (pOrderInvoiceJson.InvoiceContent == "GoodsType") {
        _invoiceContent = "商品类别";
    }
    else if (pOrderInvoiceJson.InvoiceContent == "GoodsDetail") {
        _invoiceContent = "商品明细";
    }

    if (pOrderInvoiceJson.InvoiceType == "AddValue") {
        _xhtml = "增值税专票 - " + pOrderInvoiceJson.CompanyName;
    }
    else {

        _xhtml = "普通发票 - " + _invoiceContent;
    }

    return _xhtml;
}

/**
 * 构造商品显示代码 列表
 * @param {any} pOrderMsgJson 订单信息Json对象
 * @param {any} pOrderMsgExtraJson 订单额外信息Json对象
 */
function xhtmlGoods(pOrderMsgJson, pOrderMsgExtraJson) {

    //定义数组
    var GoodsIDArr = new Array();
    var GoodsTitleArr = new Array();
    var GoodsSpecIDOrderNumArr = new Array();
    var GoodsUnitPriceArr = new Array();
    var SpecParamValArr = new Array();
    var IsSpecParamArr = new Array();
    var GoodsImgArr = new Array();

    //判断是否是多商品
    if (pOrderMsgJson.GoodsIDArr.indexOf("^") >= 0) {
        GoodsIDArr = pOrderMsgJson.GoodsIDArr.split("^");
        GoodsTitleArr = pOrderMsgJson.GoodsTitleArr.split("^");;
        GoodsSpecIDOrderNumArr = pOrderMsgJson.GoodsSpecIDOrderNumArr.split("^");;
        GoodsUnitPriceArr = pOrderMsgJson.GoodsUnitPriceArr.split("^");;
        SpecParamValArr = pOrderMsgJson.SpecParamValArr.split("^");;
        IsSpecParamArr = pOrderMsgJson.IsSpecParamArr.split("^");;
        GoodsImgArr = pOrderMsgExtraJson.GoodsImgArr.split("^");;
    }
    else {
        GoodsIDArr[0] = pOrderMsgJson.GoodsIDArr;
        GoodsTitleArr[0] = pOrderMsgJson.GoodsTitleArr;
        GoodsSpecIDOrderNumArr[0] = pOrderMsgJson.GoodsSpecIDOrderNumArr;
        GoodsUnitPriceArr[0] = pOrderMsgJson.GoodsUnitPriceArr;
        SpecParamValArr[0] = pOrderMsgJson.SpecParamValArr;
        IsSpecParamArr[0] = pOrderMsgJson.IsSpecParamArr;
        GoodsImgArr[0] = pOrderMsgExtraJson.GoodsImgArr;

    }

    //显示代码
    var myJsVal = "";    for (var i = 0; i < GoodsIDArr.length; i++) {        var OrderNum = GoodsSpecIDOrderNumArr[i].split("_")[1];        var _goodsTitle = GoodsTitleArr[i];        if (_goodsTitle.length > 40) {            _goodsTitle = _goodsTitle.substring(0, 39);
        }        //构造商品详情跳转链接,如果是拼团订单则跳转到拼团详情
        var _hrefUrl = "Goods/GoodsDetail";
        if (pOrderMsgJson.GroupID != 0 && pOrderMsgJson.GroupID != "0") {
            _hrefUrl = "Group/GroupDetail";
        }        myJsVal += "<div class=\"scart-item-goods\">";        myJsVal += " <div class=\"item-goods-mid\" id=\"GoodsImgDiv\">";        myJsVal += "     <a href=\"../" + _hrefUrl + "?GID=" + GoodsIDArr[i] + "\" target=\"_blank\">";        myJsVal += "         <img src=\"//" + GoodsImgArr[i] + "\" />";        myJsVal += "     </a>";        myJsVal += " </div>";        myJsVal += " <div class=\"item-goods-right\" onclick=\"window.location.href='../Goods/GoodsDetail?GID=" + GoodsIDArr[i] + "'\">";        myJsVal += "     <ul>";        myJsVal += "         <li>";        myJsVal += "             <span id=\"GoodsTitleSpan\">" + _goodsTitle + "</span>";        myJsVal += "         </li>";        myJsVal += "         <li class=\"goods-right-spec\">";        myJsVal += "             <span id=\"SpecParamValSpan\">" + SpecParamValArr[i] + "</span>";        myJsVal += "         </li>";        myJsVal += "         <li class=\"goods-right-price\">";        myJsVal += "             <div class=\"goods-price\" id=\"GoodsPriceDiv\">";        myJsVal += "                 &#165;" + GoodsUnitPriceArr[i];        myJsVal += "             </div>";        myJsVal += "             <div class=\"goods-txt-number goods-order-num\">";        myJsVal += "                 <div>x " + OrderNum + "</div>";        myJsVal += "             </div>";        myJsVal += "         </li>";        myJsVal += "     </ul>";        myJsVal += " </div>";        myJsVal += "</div>";
    }    //返回显示代码    return myJsVal;}

/**
 * 设置订单的收货地址
 * @param {any} pOrderDeliveryJson 订单收货地址信息Json对象
 */
function setValOrderDelivery(pOrderDeliveryJson) {
    //赋值
    $("#ReceiNameDiv").html("收货人：" + pOrderDeliveryJson.DeliName);
    $("#MobileDiv").html(pOrderDeliveryJson.Mobile);
    $("#RegionDetailAddrDiv").html("收货地址：" + pOrderDeliveryJson.RegionNameArr + "_" + pOrderDeliveryJson.DetailAddr);
}

/**
 * 设置店铺导航信息
 * @param {any} pShopMsgJson 店铺信息Json对象
 */
function setShopAddrMsg(pShopMsgJson) {

    $("#DistanceKmB").html(pShopMsgJson.DistanceKm + "km");
    $("#ShopAddrDetailDiv").html(pShopMsgJson.RegionNameArr + "_" + pShopMsgJson.DetailAddr);

    //初始化店铺地址坐标相关信息
    allMapURL(pShopMsgJson.Latitude, pShopMsgJson.Longitude, pShopMsgJson.ShopName, pShopMsgJson.DetailAddr);
}

/**
 * 保存更新订单的收货地址
 * */
function updateOrderDelivery() {

    //获取隐藏记录值
    var hidBReceiAddrID = $("#hidBReceiAddrID").val().trim();
    if (hidBReceiAddrID == "") {
        return;
    }
    var hidOrderID = $("#hidOrderID").val().trim();

    //构造POST参数
    var dataPOST = {
        "Type": "2", "OrderID": hidOrderID, "BReceiAddrID": hidBReceiAddrID
    };
    console.log(dataPOST);
    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: mAjaxUrl + "?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("保存订单收货地址=" + reTxt);
            if (reTxt != "") {
                var _jsonReTxt = JSON.parse(reTxt);

                //赋值到页面
                //var DataDic = _jsonReTxt.DataDic;
                setValOrderDelivery(_jsonReTxt.DataDic);

            }
        }
    });
}

/**
 * 提交保存支付订单信息
 * */
function submitOrderMsg() {

    if (mOrderID == "" || mOrderID == "") {
        return;
    }

    //获取表单值
    var OrderMemo = $("#OrderMemo").val().trim();

    //构造POST参数
    var dataPOST = {
        "Type": "3", "OrderID": mOrderID, "OrderMemo": OrderMemo,
    };
    console.log(dataPOST);
    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: mAjaxUrl + "?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("提交保存支付订单信息=" + reTxt);

            if (reTxt != "") {

                //转换成功Json对象
                var _jsonReTxt = JSON.parse(reTxt);
                if (_jsonReTxt.ErrMsg != "" && _jsonReTxt.ErrMsg != null && _jsonReTxt.ErrMsg != undefined) {
                    toastWin(_jsonReTxt.ErrMsg);
                    return;
                }
                //提交成功
                if (_jsonReTxt.Msg != "" && _jsonReTxt.Msg != null) {
                    //请求支付窗口
                    openPayConfirmWin(_jsonReTxt);
                }
            }
        }
    });
}


//=======================打开支付确认窗口============================//

/**
 * 打开支付确认窗口
 */
var mPayConfirmWinHtml = "";
function openPayConfirmWin(pJsonReTxt) {

    if (mPayConfirmWinHtml == "") {

        mPayConfirmWinHtml = getPayConfirmWinHtml();
    }

    mPayJsonReTxt = pJsonReTxt;

    //是否显示货到付款支付项
    mIsPayDelivery = pJsonReTxt.DataDic.IsPayDelivery;
    //是否显示【到店付】支付项
    mIsPayOffline = pJsonReTxt.DataDic.IsPayOffline;
    //是否显示【积分支付】支付项
    mIsBuyerIntegralPay = pJsonReTxt.DataDic.IsBuyerIntegralPay;
    //是否显示【银行转账】支付项
    mIsPayTransfer = pJsonReTxt.DataDic.IsPayTransfer;


    //初始化SliderDown窗口
    initSilderDownWin(600, mPayConfirmWinHtml);

    toggleSilderDownWin();

    //为支付窗口赋值
    var _orderPrice = formatNumberDotDigit(pJsonReTxt.DataDic.OrderPrice);
    $("#OrderPriceBPayWin").html("&#165; " + _orderPrice);

    mTotalOrderPrice = parseFloat(_orderPrice);

    //得到用户当前的可用余额
    initCurrentBalance();

    //得到用户当前的可用积分
    initCurrentIntegral();

    //是否显示货到付款项
    if (mIsPayDelivery == "true") {
        $("#PayDeliveryLi").show();
    }
    else {
        $("#PayDeliveryLi").hide();
    }


    //是否显示【到店付】项
    if (mIsPayOffline == "true") {
        $("#PayOfflineLi").show();
    }
    else {
        $("#PayOfflineLi").hide();
    }


    //是否显示【积分支付】项
    if (mIsBuyerIntegralPay == "true") {
        $("#PayIntegralLi").show();
    }
    else {
        $("#PayIntegralLi").hide();
    }



    //是否显示【银行转账】项
    if (mIsPayTransfer == "true") {
        $("#PayTransferLi").show();
    }
    else {
        $("#PayTransferLi").hide();
    }

}
/**
 * 得到支付确认窗口显示代码
 */
function getPayConfirmWinHtml() {

    var _html = $("#WinSelPay").html();

    $("#WinSelPay").html("");
    $("#WinSelPay").remove();
    $("body").remove("#WinSelPay");

    mPayConfirmWinHtml = "";

    return _html
}

/**
 * 切换付款方式 
 * @param pPayType 支付类型名称  支付方式 （WeiXinPay [微信支付], Alipay[支付宝] , Transfer[转账汇款] , Offline[线下付款(到店付)], PayDelivery [货到付款]  Balance[余额支付]）
 * */
function chgPayType(pPayType) {

    //获取所有的支付类型图片标签Class
    var $PayTypeImgArr = $(".pay-type-img");
    //将所有标签设置成未选中
    $PayTypeImgArr.attr("src", "../Assets/Imgs/Icon/sel_no.png");


    //选中的支付类型
    mSelPayType = pPayType;
    $("#PayTypeImg_" + pPayType + "").attr("src", "../Assets/Imgs/Icon/sel_yes.png");
}

/**
 * 立即支付
 * */
function goPay() {


    if (mSelPayType == "" || mSelPayType == null) {
        return;
    }



    //微信支付
    if (mSelPayType == "WeiXinPay") {

        //加载提示
        $("#BtnPay").attr("disabled", true);
        $("#BtnPay").val("…拉起支付中…");

        //跳转URL --- 正式支付地址
        var goPayURL = mPayJsonReTxt.DataDic.OctThirdApiCallSystemWeb_ApiDomain + "/WxPay/WxApiPayRedirectRe?BillNumber=" + mPayJsonReTxt.DataDic.BillNumber + "&UserKeyID=" + mPayJsonReTxt.DataDic.UserKeyID;
        //----测试----//
        //var goPayURL = mPayJsonReTxt.DataDic.OctThirdApiCallSystemWeb_ApiDomain + "/Test/WxApiPayRedirect?BillNumber=" + mPayJsonReTxt.DataDic.BillNumber + "&UserKeyID=" + mPayJsonReTxt.DataDic.UserKeyID;

        //跳转到模拟支付页
        if (mPayJsonReTxt.DataDic.WxPay_IsSimulatePay == "是") {
            goPayURL = mPayJsonReTxt.DataDic.OctThirdApiCallSystemWeb_ApiDomain + "/PayPub/SimulatePay?PayWay=WeiXinPay&BillNumber=" + mPayJsonReTxt.DataDic.BillNumber + "&UserKeyID=" + mPayJsonReTxt.DataDic.UserKeyID;
        }
        //else {

        //}

        //跳转到微信公众号支付页
        window.location.href = goPayURL;
    }
    else if (mSelPayType == "Alipay") //支付宝支付
    {
        //加载提示
        $("#BtnPay").attr("disabled", true);
        $("#BtnPay").val("…拉起支付中…");

        //跳转URL  --- 正式支付地址
        var goPayURL = mPayJsonReTxt.DataDic.OctThirdApiCallSystemWeb_ApiDomain + "/Alipay/AlipayWappay?BillNumber=" + mPayJsonReTxt.DataDic.BillNumber + "&UserKeyID=" + mPayJsonReTxt.DataDic.UserKeyID;

        //跳转到模拟支付页
        if (mPayJsonReTxt.DataDic.Alipay_IsSimulatePay == "是") {
            goPayURL = mPayJsonReTxt.DataDic.OctThirdApiCallSystemWeb_ApiDomain + "/PayPub/SimulatePay?PayWay=Alipay&BillNumber=" + mPayJsonReTxt.DataDic.BillNumber + "&UserKeyID=" + mPayJsonReTxt.DataDic.UserKeyID;
        }

        //跳转到支付宝支付页
        window.location.href = goPayURL;
    }
    else if (mSelPayType == "Balance") //余额支付
    {
        //余额支付
        payCurrentBalance();
    }
    else if (mSelPayType == "Integral") //积分支付
    {
        //积分支付
        payCurrentIntegral();
    }
    else if (mSelPayType == "PayDelivery") //货到付款
    {
        //货到付款支付
        payDelivery();
    }
    else if (mSelPayType == "Offline") //到店付支付
    {
        //到店付支付
        payOffline();
    }
    else if (mSelPayType == "Transfer") //银行转账支付
    {
        //银行转账支付
        payTransfer();
    }

    //{
    //    "Code": "POM_01",
    //        "Msg": "订单写入成功",
    //            "ErrCode": null,
    //                "ErrMsg": null,
    //                    "DataDic": {
    //        "OrderID": 170369,
    //            "OrderPrice": 454.3,
    //                "BillNumber": "2020030515415220620683607",
    //                    "UserKeyID": "8866",
    //                        "OctThirdApiCallSystemWeb_ApiDomain": "http://localhost:1600",
    //                            "WxPay_IsSimulatePay": "是",
    //                                "Alipay_IsSimulatePay": "是"
    //    },
    //    "DataListDic": null,
    //        "DataDicExtra": null,
    //            "DataListDicExtra": null
    //}


}

/**
 * 余额支付
 * */
function payCurrentBalance() {

    if (mCurrentBalance < mTotalOrderPrice) {
        alert("余额不足，请充值或选择其他支付方式！");
        return;
    }

    //构造POST参数
    var dataPOST = {
        "Type": "6", "PayWay": "Balance", "BillNumber": mPayJsonReTxt.DataDic.BillNumber,
    };
    console.log(dataPOST);

    //加载提示
    $("#BtnPay").attr("disabled", true);
    $("#BtnPay").val("…支付中…");

    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: "../OrderAjax/PlaceOrder?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log(reTxt);
            if (reTxt != "") {
                var _jsonReTxt = JSON.parse(reTxt);

                if (_jsonReTxt.ErrMsg != "" && _jsonReTxt.ErrMsg != null) {
                    alert(_jsonReTxt.ErrMsg);
                    return;
                }

                if (_jsonReTxt.Msg != "" && _jsonReTxt.Msg != null) {

                    window.location.href = "../Pay/PaySuRedirect?BillNumber=" + _jsonReTxt.DataDic.BillNumber;
                    return;
                }


            }
        }
    });
}

/**
 * 积分支付
 * */
function payCurrentIntegral() {

    if (mCurrentIntegral < mTotalOrderPrice) {
        alert("积分不足，选择其他支付方式！");
        return;
    }

    //构造POST参数
    var dataPOST = {
        "Type": "6", "PayWay": "Integral", "BillNumber": mPayJsonReTxt.DataDic.BillNumber,
    };
    console.log(dataPOST);

    //加载提示
    $("#BtnPay").attr("disabled", true);
    $("#BtnPay").val("…支付中…");

    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: "../OrderAjax/PlaceOrder?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log(reTxt);
            if (reTxt != "") {
                var _jsonReTxt = JSON.parse(reTxt);

                if (_jsonReTxt.ErrMsg != "" && _jsonReTxt.ErrMsg != null) {
                    alert(_jsonReTxt.ErrMsg);
                    return;
                }

                if (_jsonReTxt.Msg != "" && _jsonReTxt.Msg != null) {

                    window.location.href = "../Pay/PaySuRedirect?BillNumber=" + _jsonReTxt.DataDic.BillNumber;
                    return;
                }


            }
        }
    });
}


/**
 * 得到用户当前的可用余额
 * */
function initCurrentBalance() {

    //构造POST参数
    var dataPOST = {
        "Type": "1",
    };
    console.log(dataPOST);
    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: "../VipAjax/Index?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log(reTxt);
            if (reTxt != "") {
                var _jsonReTxt = JSON.parse(reTxt);

                //赋值当前用户余额
                $("#CurrentBalanceB").html("&#165;" + _jsonReTxt.CurrentBalance);

                mCurrentBalance = parseFloat(_jsonReTxt.CurrentBalance);

            }
        }
    });

}

/**
 * 得到用户当前的可用积分
 * */
function initCurrentIntegral() {

    //构造POST参数
    var dataPOST = {
        "Type": "4",
    };
    console.log(dataPOST);
    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: "../VipAjax/Index?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log(reTxt);
            if (reTxt != "") {
                var _jsonReTxt = JSON.parse(reTxt);

                //赋值当前用户积分
                $("#CurrentIntegralB").html(_jsonReTxt.CurrentIntegral);

                mCurrentIntegral = parseFloat(_jsonReTxt.CurrentIntegral);

            }
        }
    });

}



/**
 * 货到付款支付
 * */
function payDelivery() {

    //构造POST参数
    var dataPOST = {
        "Type": "6", "PayWay": "PayDelivery", "BillNumber": mPayJsonReTxt.DataDic.BillNumber,
    };
    console.log(dataPOST);

    //加载提示
    $("#BtnPay").attr("disabled", true);
    $("#BtnPay").val("…支付中…");

    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: "../OrderAjax/PlaceOrder?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log(reTxt);
            if (reTxt != "") {
                var _jsonReTxt = JSON.parse(reTxt);

                if (_jsonReTxt.ErrMsg != "" && _jsonReTxt.ErrMsg != null) {
                    alert(_jsonReTxt.ErrMsg);
                    window.location.reload();
                    return;
                }

                if (_jsonReTxt.Msg != "" && _jsonReTxt.Msg != null) {
                    //跳转到订单详情页
                    window.location.href = "../Order/OrderDetail?OID=" + mPayJsonReTxt.DataDic.OrderID;
                    return;
                }


            }
        }
    });
}


/**
 * 到店付支付
 * */
function payOffline() {

    console.log("执行了payOffline()");

    //构造POST参数
    var dataPOST = {
        "Type": "6", "PayWay": "Offline", "BillNumber": mPayJsonReTxt.DataDic.BillNumber,
    };
    console.log(dataPOST);

    //加载提示
    $("#BtnPay").attr("disabled", true);
    $("#BtnPay").val("…支付中…");

    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: "../OrderAjax/PlaceOrder?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log(reTxt);
            if (reTxt != "") {
                var _jsonReTxt = JSON.parse(reTxt);

                if (_jsonReTxt.ErrMsg != "" && _jsonReTxt.ErrMsg != null) {
                    alert(_jsonReTxt.ErrMsg);
                    window.location.reload();
                    return;
                }

                if (_jsonReTxt.Msg != "" && _jsonReTxt.Msg != null) {
                    //跳转到订单详情页
                    window.location.href = "../Order/OrderDetail?OID=" + mPayJsonReTxt.DataDic.OrderID;
                    return;
                }


            }
        }
    });
}

/**
 * 银行转账支付
 * */
function payTransfer() {

    //构造POST参数
    var dataPOST = {
        "Type": "6", "PayWay": "Transfer", "BillNumber": mPayJsonReTxt.DataDic.BillNumber,
    };
    console.log(dataPOST);

    //加载提示
    $("#BtnPay").attr("disabled", true);
    $("#BtnPay").val("…支付中…");

    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: "../OrderAjax/PlaceOrder?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log(reTxt);
            if (reTxt != "") {
                var _jsonReTxt = JSON.parse(reTxt);

                if (_jsonReTxt.ErrMsg != "" && _jsonReTxt.ErrMsg != null) {
                    alert(_jsonReTxt.ErrMsg);
                    window.location.reload();
                    return;
                }

                if (_jsonReTxt.Msg != "" && _jsonReTxt.Msg != null) {
                    //跳转到订单详情页
                    window.location.href = "../Order/BankTransfer?BillNum=" + mPayJsonReTxt.DataDic.BillNumber;
                    return;
                }
            }
        }
    });
}







//========================店铺地址与导航=============================//



/**
 * ----打开地图导航Slider窗口-----
 */
var mShopNavWinHtml = "";
function openShopNavWin() {

    if (mShopNavWinHtml == "") {
        mShopNavWinHtml = $("#WinSelShopNav").html();
    }
    //初始化SliderDown窗口
    initSilderDownWin(400, mShopNavWinHtml);
    //打开Slider窗口
    toggleSilderDownWin();


}

//===打开地图导航===========//

/**
 * 初始化所有的 地图导航URL连接
 * @param {any} pLatitude 纬度
 * @param {any} pLongitude 经度
 * @param {any} pAddrName 店铺名称
 * @param {any} pAddrDetail 店铺详细地址
 */
function allMapURL(pLatitude, pLongitude, pAddrName, pAddrDetail) {

    initMapNavURL("qqmap", pLatitude, pLongitude, pAddrName, pAddrDetail);
    initMapNavURL("amap", pLatitude, pLongitude, pAddrName, pAddrDetail);
    initMapNavURL("bdmap", pLatitude, pLongitude, pAddrName, pAddrDetail);
}

/**
 * 初始化地图导航URL连接
 * @param {any} pMapType 地图类型  qqmap , amap ,bdmap
 * @param {any} pLatitude 纬度
 * @param {any} pLongitude 经度
 * @param {any} pAddrName 地址名称
 * @param {any} pAddrDetail 地址详细
 */
function initMapNavURL(pMapType, pLatitude, pLongitude, pAddrName, pAddrDetail) {

    //pMapType = "bdmap";
    //pLatitude = "28.247008"; //纬度
    //pLongitude = "113.063961"; //经度
    //pAddrName = "地点名称";
    //pAddrDetail = "地址详细";


    var _urlMap = "";

    if (pMapType == "qqmap") //腾讯地图
    {
        _urlMap = "https://apis.map.qq.com/uri/v1/marker?marker=coord:" + pLatitude + "," + pLongitude + ";title:" + pAddrName + ";addr:" + pAddrDetail + "&referer=myapp";

        $("#qqmapA").attr("href", _urlMap);
    }
    else if (pMapType == "amap") //高德地图
    {
        //_urlMap = "../Shop/MapUrlRedirect?BackUrl=https://uri.amap.com/marker?position=" + pLongitude + "," + pLatitude + "&name=" + pAddrName + "&src=mypage&coordinate=gaode&callnative=1";
        _urlMap = "../Shop/MapUrlRedirect?Longitude=" + pLongitude + "&Latitude=" + pLatitude + "&AddrName=" + pAddrName + "&AddrDetail=" + pAddrDetail + "&MapType=amap";

        $("#amapA").attr("href", _urlMap);
    }
    else if (pMapType == "bdmap") //百度地图
    {
        _urlMap = "../Shop/MapUrlRedirect?Longitude=" + pLongitude + "&Latitude=" + pLatitude + "&AddrName=" + pAddrName + "&AddrDetail=" + pAddrDetail + "&MapType=bdmap";
        //_urlMap = "http://api.map.baidu.com/marker?location=40.047669,116.313082&title=我的位置&content=百度奎科大厦&output=html&src=webapp.baidu.openAPIdemo";

        $("#bdmapA").attr("href", _urlMap);
    }
    else //其他方式
    {

    }

    //console.log("_urlMap=" + _urlMap);

}



