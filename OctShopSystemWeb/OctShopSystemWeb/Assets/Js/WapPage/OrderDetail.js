//===============订单详情=======================//


/**-----定义公共变量------**/
var mAjaxUrl = "../Wap/OrderDetail";

//订单ID
var mOrderID = "";
//订单交易号
var mBillNumber = "";
//商家UserID
var mShopUserID = "";
//订单发票对象
var mOrderInvoice = null;
//赠品信息对象
var mOrderGiftMsg = null;
//确认收货加积分
var mConfirmReceiReturnIntegral = 0;
//店铺ID  ShopID
var mShopID = 0;

//商品ID
var mGoodsID = 0;
//拼团ID,开团ID
var mGroupID = 0;

//订单状态
var mOrderStatus = "";

//OctWapWeb 手机Web端(公众号端)地址域名
var mhidOctWapWeb_AddrDomain = "";

/**------初始化------**/
$(function () {

    mhidOctWapWeb_AddrDomain = $("#hidOctWapWeb_AddrDomain").val().trim();
    mOrderID = $("#hidOrderID").val().trim();

    //初始化订单信息
    initOrderMsg();

    //初始化复制订单ID
    initCopyOrderID();
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
    var OrderStatusDesc = pJsonReTxt.OrderStatusDesc;
    //店铺信息
    var ShopMsg = pJsonReTxt.ShopMsg;
    //订单动态消息
    var OrderSysMsg = pJsonReTxt.OrderSysMsg;
    //订单收货地址 
    var OrderDelivery = pJsonReTxt.OrderDelivery;
    //订单发票
    var OrderInvoice = pJsonReTxt.OrderInvoice;
    //订单信息
    var OrderMsg = pJsonReTxt.OrderMsg;
    //订单额外信息
    var OrderMsgExtra = pJsonReTxt.OrderMsgExtra;
    //订单完成赠送信息
    var OrderGivingMsg = pJsonReTxt.OrderGivingMsg;

    mConfirmReceiReturnIntegral = OrderMsgExtra.ConfirmReceiReturnIntegral //确认收货+积分

    mShopUserID = OrderMsg.ShopUserID; //商家UserID
    mBillNumber = OrderMsg.BillNumber; //交易号赋值
    mOrderInvoice = OrderInvoice; //记录发票信息对象
    mOrderGiftMsg = pJsonReTxt.OrderGiftMsg; //赠品信息对象
    mShopID = ShopMsg.ShopID //记录ShopID

    mGoodsID = OrderMsg.GoodsIDArr;
    mGroupID = OrderMsg.GroupID;

    mOrderStatus = OrderMsg.OrderStatus;

    //订单状态信息
    $("#StatusTtitle").html(OrderStatusDesc.StatusTtitle);
    $("#StatusDesc").html(OrderStatusDesc.StatusDesc);

    //订单动态消息
    $("#MsgContent").html(OrderSysMsg.MsgContent);
    $("#MsgWriteDate").html(OrderSysMsg.WriteDate);

    //订单收货地址 ,设置店铺导航信息
    if (OrderMsg.ExpressType.indexOf("到店") >= 0) {

        //显隐
        $("#ShopAddrNav").show();
        $("#ReceiMsg").hide();

        //设置店铺导航信息
        setShopAddrMsg(ShopMsg);

    }
    else {
        //显隐
        $("#ShopAddrNav").hide();
        $("#ReceiMsg").show();

        $("#DeliName").html(OrderDelivery.DeliName);
        $("#Mobile").html(OrderDelivery.Mobile);
        $("#RegionDetailAddr").html(OrderDelivery.RegionNameArr + "_" + OrderDelivery.DetailAddr);
    }


    //店铺信息
    $("#ShopNameA").html("<img src=\"//" + ShopMsg.ShopHeaderImg + "\" />" + ShopMsg.ShopName + "");
    $("#ShopNameA").attr("href", "#");
    $("#OrderStatusDiv").html(OrderMsg.OrderStatus);


    //构造订单商品列表 并赋值
    var _xhtmlOrderGoods = xhtmlGoodsItemList(OrderMsg.GoodsIDArr, OrderMsg.GoodsTitleArr, OrderMsg.GoodsSpecIDOrderNumArr, OrderMsg.GoodsUnitPriceArr, OrderMsg.IsSpecParamArr, OrderMsgExtra.GoodsImgArr, OrderMsg.SpecParamValArr, OrderMsg.GroupID);
    $("#OrderGoodsListDiv").html(_xhtmlOrderGoods);

    //统计订单商品总额
    var _sumTotalGoodsPrice = sumTotalGoodsPrice(OrderMsg.GoodsSpecIDOrderNumArr, OrderMsg.GoodsUnitPriceArr);
    $("#SumTotalGoodsPrice").html("&#165; " + _sumTotalGoodsPrice);

    //运费
    $("#FreightMoneyDiv").html("&#165; " + OrderMsg.FreightMoney);
    //优惠券
    $("#UseMoneyDiv").html("- &#165; " + OrderMsg.UseMoney);
    //订单总额
    $("#OrderPriceDIv").html("&#165; " + OrderMsg.OrderPrice);
    //实付款
    $("#PayOrderPriceB").html("&#165; " + OrderMsg.OrderPrice);

    //订单其他信息
    $("#OrderIDB").html(OrderMsg.OrderID);
    $("#OrderTimeDiv").html(OrderMsg.OrderTime);
    $("#PayWayDiv").html(OrderMsg.PayWay);
    $("#PayTimeDiv").html(OrderMsg.PayTime);
    $("#ExpressTypeDiv").html(OrderMsg.ExpressType);

    //----发票信息
    var _orderInvoiceShow = getShowOrderInvoice(OrderInvoice.InvoiceID, OrderInvoice.InvoiceContent, OrderInvoice.InvoiceType, OrderInvoice.InvoiceTitle, OrderInvoice.CompanyName);
    $("#OrderInvoiceDiv").html(_orderInvoiceShow);

    ////构造订单状态的操作按钮列表 显示代码
    //var _xhtmlBtnList = xhtmlOrderStatusBtnList(OrderMsg.OrderID, OrderMsg.OrderStatus, OrderStatusDesc.StatusTtitle, OrderMsg.PayWay, OrderMsg.IsDelayFinishTime);
    //$(".oct-footer").html(_xhtmlBtnList);

    //设置订单状态Logo图片
    setStatusLogoImg(OrderMsg.OrderStatus);

    //隐藏修改收货地址按钮 订单状态 [ 待付款]，[ 待确认(货到付款)]，[到店付], [转账]， [取消] ,[待消费/自取] ,[待发货]，[退款中]，[退款成功]，[待收货],[待评价]，[完成]
    if (OrderMsg.OrderStatus == "待收货" || OrderMsg.OrderStatus.indexOf("待消费") >= 0 || OrderMsg.OrderStatus == "待评价" || OrderMsg.OrderStatus == "完成" || OrderMsg.OrderStatus == "退款中" || OrderMsg.OrderStatus == "退款成功" || OrderMsg.OrderStatus == "取消") {
        $("#ChgReceiAddr").hide();
    }

    if (OrderMsg.OrderStatus.indexOf("待消费") >= 0) {
        $("#CheckCodeDiv").show();


    }

    //如果是待收货，快递发货则订单动态列表，直接连接到快递查询页
    if (OrderMsg.OrderStatus.indexOf("待收货") >= 0 && OrderMsg.ExpressType.indexOf("送货上门") >= 0) {
        $("#ExpressMsgDiv").removeAttr("onclick");
        $("#ExpressMsgDiv").on("click", function () {
            window.location.href = "../WapPage/ExpressDetail?OID=" + OrderMsg.OrderID;
            return;
        });
    }

    if (mOrderGiftMsg != undefined && mOrderGiftMsg != null) {
        //赠品信息
        $("#OrderGiftArrDiv").html("共 " + pJsonReTxt.OrderGiftMsg.GiftMsgList.length + " 件");
    }

    //显示订单完成赠送信息
    if (OrderGivingMsg.GivingMsgID != 0) {

        var GivingDescArr = new Array();
        if (OrderGivingMsg.GivingDescArr.indexOf("^") >= 0) {
            GivingDescArr = OrderGivingMsg.GivingDescArr.split("^");
        }
        else {
            GivingDescArr[0] = OrderGivingMsg.GivingDescArr;
        }

        //构造显示代码
        var _xhtmlOrderGivingMsg = "";
        for (var i = 0; i < GivingDescArr.length; i++) {
            _xhtmlOrderGivingMsg += "<div>" + GivingDescArr[i] + "</div>";
        }
        //console.log("_xhtmlOrderGivingMsg=" + _xhtmlOrderGivingMsg);
        //显示代码插入前台
        $("#GivingMsg").html(_xhtmlOrderGivingMsg);
        $("#GivingMsg").show();
    }

    //设置订单类型标签 -- 拼团 , 秒杀
    if (OrderMsg.GroupID != "0" && OrderMsg.GroupID != 0) {
        $("#OrderTypeLabelSpan").show();
        $("#OrderTypeLabelSpan").html("拼团");
    }
    else if (OrderMsg.SkGoodsID != "0" && OrderMsg.SkGoodsID != 0) {
        $("#OrderTypeLabelSpan").show();
        $("#OrderTypeLabelSpan").html("秒杀");
    }


    //商家客服，拨打电话，投诉商家
    $("#CustomerOnLineDiv").on("click", function () {
        window.location.href = "tel:" + ShopMsg.ShopMobile;
    });
    $("#ShopMobileDiv").on("click", function () {
        window.location.href = "tel:" + ShopMsg.ShopMobile;
    });

    if (OrderMsg.OrderStatus == "待分享") {
        //初始化复制 【邀请好友参团】
        initCopyGroupShare();
    }

    //-------------根据不同的订单状态显示操作区域----------------//
    if (OrderMsg.OrderStatus == "待发货" || OrderMsg.OrderStatus == "待收货") {
        $("#SendGoodsOrder").show();
        //初始化订单发货信息
        initOrderSendGoodsMsg(OrderMsg.OrderStatus);

        if (OrderMsg.OrderStatus == "待收货") {
            //买家拒收
            if (OrderMsg.PayWay.indexOf("货到付款") >= 0) {
                $("#RejectReceiOrderLi").show();
            }
        }
    }
    else if (OrderMsg.OrderStatus == "待付款") {
        //初始化订单的的价格
        initEditOrderPrice(OrderMsg.OrderPrice);
    }
    else if (OrderMsg.OrderStatus == "待确认") {

        //确认货到付款订单
        $("#ConfirmPayDeliveryDiv").show();

    }
    else if (OrderMsg.OrderStatus == "到店付") {

        //确认货到付款订单
        $("#ConfirmOfflinePayDiv").show();

    }
    else if (OrderMsg.OrderStatus == "待消费/自取") {

        //核销验证
        $("#VerifyCodeDiv").show();

    }
    else if (OrderMsg.OrderStatus == "退款中") {

        //同意退款
        if (OrderMsg.IsAgreeRefund == "false") {
            $("#DealRefundDiv").show();

            //按钮名称 
            var _btnName = "同意退款";
            //console.log(OrderMsg.PayWay);
            if (OrderMsg.PayWay.indexOf("到店付") >= 0) {
                _btnName = "已退款";
            }
            $("#BtnDealRefund").val(_btnName);

        }
    }

}

/**
 * 设置店铺导航信息
 * @param {any} pShopMsgJson 店铺信息Json对象
 */
function setShopAddrMsg(pShopMsgJson) {

    $("#DistanceKmB").html(pShopMsgJson.DistanceKm + "km");
    $("#ShopAddrDetailDiv").html(pShopMsgJson.RegionNameArr + "_" + pShopMsgJson.DetailAddr);

    //初始化店铺地址坐标相关信息
    initShopAddrNav(pShopMsgJson.Latitude, pShopMsgJson.Longitude, pShopMsgJson.ShopName, pShopMsgJson.DetailAddr);
}

/**
 * ------构造订单商品列表 ------
 * @param {any} pGoodsIDArr
 * @param {any} pGoodsTitleArr
 * @param {any} pGoodsSpecIDOrderNumArr
 * @param {any} pGoodsUnitPriceArr
 * @param {any} pIsSpecParamArr
 * @param {any} pGoodsImgArr
 * @param {any} pSpecParamValArr
 */
function xhtmlGoodsItemList(pGoodsIDArr, pGoodsTitleArr, pGoodsSpecIDOrderNumArr, pGoodsUnitPriceArr, pIsSpecParamArr, pGoodsImgArr, pSpecParamValArr, pGroupID) {

    var GoodsIDArr = new Array();
    var GoodsTitleArr = new Array();
    var GoodsSpecIDOrderNumArr = new Array();
    var GoodsUnitPriceArr = new Array();
    var IsSpecParamArr = new Array();
    var GoodsImgArr = new Array();
    var SpecParamValArr = new Array();


    //判断是否是多商品
    if (pGoodsIDArr.indexOf("^") >= 0) {
        GoodsIDArr = pGoodsIDArr.split("^");
        GoodsTitleArr = pGoodsTitleArr.split("^");
        GoodsSpecIDOrderNumArr = pGoodsSpecIDOrderNumArr.split("^");
        GoodsUnitPriceArr = pGoodsUnitPriceArr.split("^");
        IsSpecParamArr = pIsSpecParamArr.split("^");
        GoodsImgArr = pGoodsImgArr.split("^");
        SpecParamValArr = pSpecParamValArr.split("^");

    }
    else {
        GoodsIDArr[0] = pGoodsIDArr;
        GoodsTitleArr[0] = pGoodsTitleArr;
        GoodsSpecIDOrderNumArr[0] = pGoodsSpecIDOrderNumArr;
        GoodsUnitPriceArr[0] = pGoodsUnitPriceArr;
        IsSpecParamArr[0] = pIsSpecParamArr;
        GoodsImgArr[0] = pGoodsImgArr;
        SpecParamValArr[0] = pSpecParamValArr;
    }



    //构造商品详情跳转链接,如果是拼团订单则跳转到拼团详情
    var _hrefUrl = "Goods/GoodsDetail";
    if (pGroupID != 0 && pGroupID != "0") {
        _hrefUrl = "Group/GroupDetail";
    }


    var myJsVal = "";
    for (var i = 0; i < GoodsIDArr.length; i++) {

        var _orderNum = GoodsSpecIDOrderNumArr[i].split('_')[1];

        myJsVal += "<a href=\"../" + _hrefUrl + "?GID=" + GoodsIDArr[i] + "\" class=\"order-goods-item\">";
        myJsVal += "   <div class=\"goods-item-left\">";
        myJsVal += "       <img src=\"//" + GoodsImgArr[i] + "\" />";
        myJsVal += "   </div>";
        myJsVal += "   <div class=\"goods-item-mid\">";
        myJsVal += "       <span class=\"goods-item-title\">" + GoodsTitleArr[i] + "</span>";


        myJsVal += "<span class=\"goods-item-spec\">" + SpecParamValArr[i] + "</span>";


        myJsVal += "   </div>";
        myJsVal += "   <div class=\"goods-item-right\">";
        myJsVal += "       <span class=\"goods-item-price\">&#165;" + GoodsUnitPriceArr[i] + "</span>";
        myJsVal += "       <span class=\"goods-item-ordernum\">&times; " + _orderNum + "</span>";
        myJsVal += "   </div>";
        myJsVal += "</a>";
    }
    return myJsVal;
}

/**
 * 统计订单商品总额
 * @param {any} pGoodsSpecIDOrderNumArr
 * @param {any} pGoodsUnitPriceArr
 */
function sumTotalGoodsPrice(pGoodsSpecIDOrderNumArr, pGoodsUnitPriceArr) {

    var GoodsSpecIDOrderNumArr = new Array();
    var GoodsUnitPriceArr = new Array();


    //判断是否是多商品
    if (pGoodsUnitPriceArr.indexOf("^") >= 0) {
        GoodsSpecIDOrderNumArr = pGoodsSpecIDOrderNumArr.split("^");
        GoodsUnitPriceArr = pGoodsUnitPriceArr.split("^");
    }
    else {
        GoodsSpecIDOrderNumArr[0] = pGoodsSpecIDOrderNumArr;
        GoodsUnitPriceArr[0] = pGoodsUnitPriceArr;
    }

    var _sumTotalGoodsPrice = 0; //订单商品总额

    //循环统计
    for (var i = 0; i < GoodsUnitPriceArr.length; i++) {
        //订单数量
        var _orderNum = parseFloat(GoodsSpecIDOrderNumArr[i].split("_")[1]);
        //统计
        _sumTotalGoodsPrice += parseFloat(GoodsUnitPriceArr[i]) * _orderNum;
    }

    //格式化返回
    return formatNumberDotDigit(_sumTotalGoodsPrice, 2);
}

/**
 * 构造显示代码 发票信息
 * @param pInvoiceID 订单ID
 * @param {any} pInvoiceContent 发票内容（GoodsDetail 商品明细 GoodsType 商品类别  InvoiceNo 不开发票  等）
 * @param {any} pInvoiceType 发票类型( General 普通发票  AddValue 增值税专用发票 )
 * @param pInvoiceTitle 发票抬头 ( Person 个人  /  Company  企业 )
 * @param pCompanyName 公司名称 
 */
function getShowOrderInvoice(pInvoiceID, pInvoiceContent, pInvoiceType, pInvoiceTitle, pCompanyName) {
    var _invoiceTypeName = "普通发票";
    var _orderTypeVal = _invoiceTypeName;
    var _invoiceContent = "";
    //发票内容（GoodsDetail 商品明细 GoodsType 商品类别  InvoiceNo 不开发票  等）
    if (pInvoiceContent == "GoodsDetail") {
        _invoiceContent = "商品明细";
    }
    else if (pInvoiceContent == "GoodsType") {
        _invoiceContent = "商品类别";
    }
    _orderTypeVal += "(" + _invoiceContent + ")";

    //发票类型( General 普通发票  AddValue 增值税专用发票 )
    if (pInvoiceType == "AddValue") {
        _invoiceTypeName = "增值税专用发票";
        _orderTypeVal = _invoiceTypeName + "(" + _invoiceContent + ")";
    }
    if (pInvoiceTitle == "Company") {
        _orderTypeVal += " - " + pCompanyName;
    }

    if (pInvoiceID == "0") {
        _orderTypeVal = "不开发票";
    }

    return _orderTypeVal;
}

/**
 * -------打开发票申请窗口------
 */
var mInvoiceWinHtml = "";
function openInvoiceWin() {

    if (mInvoiceWinHtml == "") {

        mInvoiceWinHtml = getInvoiceWinHtml();
    }
    //初始化SliderDown窗口
    initSilderDownWin(600, mInvoiceWinHtml);

    toggleSilderDownWin();

    //设置值到发票窗口
    setInvoiceWinHtml();
}
/**
 * 得到发票申请窗口显示代码
 */
function getInvoiceWinHtml() {

    var _html = $("#WinInvoice").html();

    $("#WinInvoice").html("");
    $("#WinInvoice").remove();
    $("body").remove("#WinInvoice");

    mInvoiceWinHtml = "";

    return _html
}

/**
 * 设置值到发票窗口
 * */
function setInvoiceWinHtml() {

    console.log("执行啦");
    //发票类型(General 普通发票  AddValue 增值税专用发票)
    var _InvoiceType = "";
    if (mOrderInvoice.InvoiceType == "AddValue") {
        _InvoiceType = "增值税专用发票";
    }
    else if (mOrderInvoice.InvoiceType == "General") {
        _InvoiceType = "普通发票";
    }
    $("#InvoiceTypeDiv").html(_InvoiceType);
    //发票抬头 ( Person 个人  /  Company  企业 )
    var _InvoiceTitle = "";
    if (mOrderInvoice.InvoiceTitle == "Person") {
        _InvoiceTitle = "个人";
    }
    else if (mOrderInvoice.InvoiceTitle == "Company") {
        _InvoiceTitle = "企业";
    }
    $("#InvoiceTitleDiv").html(_InvoiceTitle);

    //发票内容（GoodsDetail 商品明细 GoodsType 商品类别  InvoiceNo 不开发票  等）
    var _InvoiceContent = "";
    if (mOrderInvoice.InvoiceContent == "GoodsDetail") {
        _InvoiceContent = "商品明细";
    }
    else if (mOrderInvoice.InvoiceContent == "GoodsType") {
        _InvoiceContent = "商品类别";
    }
    else if (mOrderInvoice.InvoiceContent == "InvoiceNo") {
        _InvoiceContent = "不开发票";
    }
    $("#InvoiceContentDiv").html(_InvoiceContent);

    //企业发票
    if (mOrderInvoice.InvoiceTitle == "Company") {
        $("#CompanyNameDiv").html(mOrderInvoice.CompanyName);
        $("#TaxNumberDiv").html(mOrderInvoice.TaxNumber);
    }

    //增值税专用发票
    if (mOrderInvoice.InvoiceType == "AddValue") {

        $("#ReceiMobileDiv").html(mOrderInvoice.ReceiMobile);
        $("#ReceiEmailDiv").html(mOrderInvoice.ReceiEmail);
        $("#CompanyRegAddrDiv").html(mOrderInvoice.CompanyRegAddr);
        $("#CompanyTelDiv").html(mOrderInvoice.CompanyTel);
        $("#BankAccDiv").html(mOrderInvoice.BankAcc);
        $("#OpeningBankDiv").html(mOrderInvoice.OpeningBank);

    }
}

/**
 * 初始化复制订单ID
 * */
function initCopyOrderID() {
    //得到按钮标签
    var btn = document.getElementById('BtnCopyOrderID');
    //实例化ClipBoard对象
    var clipboard = new ClipboardJS(btn);

    clipboard.on('success', function (e) {
        console.log(e);
        toastWin("复制成功");
        //alert("复制成功！");
    });

    clipboard.on('error', function (e) {
        console.log(e);
        toastWin("复制失败");
        //alert("复制失败！");
    });
}

/**
 * 初始化复制 【邀请好友参团】
 * */
function initCopyGroupShare() {
    //得到按钮标签
    var btn = document.getElementById('BtnCopyGroupShare');
    //实例化ClipBoard对象
    var clipboard = new ClipboardJS(btn);

    clipboard.on('success', function (e) {
        console.log(e);
        toastWin("复制成功,请将网址粘贴发送给好友！");
        //alert("复制成功！");
    });

    clipboard.on('error', function (e) {
        console.log(e);
        toastWin("复制失败");
        //alert("复制失败！");
    });
}

/**
 * 设置订单状态Logo图片
 * @param {any} pOrderStatus 订单状态 [ 待付款]，[ 待确认(货到付款)]，[到店付], [转账]， [取消] ,[待消费/自取] ,[待发货]，[退款中]，[退款成功]，[待收货],[待评价]，[完成]
 */
function setStatusLogoImg(pOrderStatus) {

    if (pOrderStatus == "待付款" || pOrderStatus == "待确认" || pOrderStatus == "到店付" || pOrderStatus == "转账") {
        $("#StatusLogoImg").html("<img src=\"../Assets/Imgs/Icon/order_waitpay.png\" />");
    }
    else if (pOrderStatus == "待发货") {
        $("#StatusLogoImg").html("<img src=\"../Assets/Imgs/Icon/order_trucks.png\" />");
    }
    else if (pOrderStatus == "待收货") {
        $("#StatusLogoImg").html("<img src=\"../Assets/Imgs/Icon/order_trucks.png\" />");
    }
    else if (pOrderStatus == "待消费/自取") {
        $("#StatusLogoImg").html("<img src=\"../Assets/Imgs/Icon/order_shopconfirm.png\" />");
    }
    else if (pOrderStatus == "待评价") {
        $("#StatusLogoImg").html("<img src=\"../Assets/Imgs/Icon/order_appraise.png\" />");
    }
    else if (pOrderStatus == "完成") {
        $("#StatusLogoImg").html("<img src=\"../Assets/Imgs/Icon/order_finish.png\" />");
    }
    else if (pOrderStatus == "取消") {
        $("#StatusLogoImg").html("<img src=\"../Assets/Imgs/Icon/order_cancel.png\" />");
    }
    else if (pOrderStatus.indexOf("退款") >= 0) {
        $("#StatusLogoImg").html("<img src=\"../Assets/Imgs/Icon/order_refund.png\" />");
    }

}

//------------------赠品窗口信息---------------//
var mGiftWinHtml = "";
function openGiftWin() {

    if (mGiftWinHtml == "") {

        mGiftWinHtml = getGiftWinHtml();
    }
    //初始化SliderDown窗口
    initSilderDownWin(600, mGiftWinHtml);

    //设置赠品窗口显示代码Html --旋转在toggleSilderDownWin()可以高度可以自动适应
    setGiftWinHtml();

    //打开窗口
    toggleSilderDownWin();


}
/**
 * 得到发票申请窗口显示代码
 */
function getGiftWinHtml() {

    var _html = $("#WinOrderGift").html();

    $("#WinOrderGift").html("");
    $("#WinOrderGift").remove();
    $("body").remove("#WinOrderGift");

    mGiftWinHtml = "";

    return _html
}

//设置赠品窗口显示代码Html
function setGiftWinHtml() {

    if (mOrderGiftMsg != null && mOrderGiftMsg != undefined) {

        var myJsVal = "";
        //循环构造赠品信息
        for (var i = 0; i < mOrderGiftMsg.GiftMsgList.length; i++) {
            myJsVal += "<div>";
            myJsVal += "<a href=\"../Goods/GiftDetail?GIID=" + mOrderGiftMsg.GiftMsgList[i].GiftID + "\" target=\"_blank\">" + mOrderGiftMsg.GiftMsgList[i].GiftName + "</a>";
            myJsVal += "<span>x " + mOrderGiftMsg.GiftNumList[i].GiftNum + "</span>";
            myJsVal += "</div>";
        }
        //显示代码插入前台
        $("#WinOrderGiftContent").html(myJsVal);
    }

}


//========================店铺地址与导航=============================//

/**
 * 初始化店铺地址坐标相关信息
 * @param {any} pLatitude 纬度
 * @param {any} pLongitude 经度
 * @param {any} pShopName 店铺名称
 * @param {any} pShopAddrDetail 店铺详细地址
 */
function initShopAddrNav(pLatitude, pLongitude, pShopName, pShopAddrDetail) {


    //初始化所有的 地图导航URL连接
    allMapURL(pLatitude, pLongitude, pShopName, pShopAddrDetail);

}

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

//=======================打开地图导航=========================//

/**
 * 初始化所有的 地图导航URL连接
 * @param {any} pLatitude
 * @param {any} pLongitude
 * @param {any} pAddrName
 * @param {any} pAddrDetail
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
        _urlMap = mhidOctWapWeb_AddrDomain + "/Shop/MapUrlRedirect?Longitude=" + pLongitude + "&Latitude=" + pLatitude + "&AddrName=" + pAddrName + "&AddrDetail=" + pAddrDetail + "&MapType=amap";

        $("#amapA").attr("href", _urlMap);
    }
    else if (pMapType == "bdmap") //百度地图
    {
        _urlMap = mhidOctWapWeb_AddrDomain + "/Shop/MapUrlRedirect?Longitude=" + pLongitude + "&Latitude=" + pLatitude + "&AddrName=" + pAddrName + "&AddrDetail=" + pAddrDetail + "&MapType=bdmap";
        //_urlMap = "http://api.map.baidu.com/marker?location=40.047669,116.313082&title=我的位置&content=百度奎科大厦&output=html&src=webapp.baidu.openAPIdemo";

        $("#bdmapA").attr("href", _urlMap);
    }
    else //其他方式
    {

    }

    //console.log("_urlMap=" + _urlMap);

}




//=======================商家订单操作 - 相关函数=========================//

/*---------发货区------------ */

/**
 * 切换发货类型
 */
function chgSendType() {

    var _SendType = $("#SendTypeWin").val();
    //快递发货
    if (_SendType == "Express") {
        $("#ExpressNameLi").show();
        $("#ExpressNumberLi").show();
        $("#SendTelNumberLabel").html("发货电话:");
        $("#SendShopManLi").hide();
    }
    else if (_SendType == "MySend") {
        $("#ExpressNameLi").hide();
        $("#ExpressNumberLi").hide();
        $("#SendTelNumberLabel").html("送货电话:");
        $("#SendShopManLi").show();
    }

    //初始化订单发货信息
    //initOrderSendGoods(_SendType);
}

/**
 * 初始化订单发货信息
 * @param {any} pOrderStatus 订单状态
 */
function initOrderSendGoodsMsg(pOrderStatus) {

    if (pOrderStatus == "待发货") {
        //初始化订单发货信息
        initOrderSendGoods($("#SendTypeWin").val());
    }
    else if (pOrderStatus == "待收货") {
        //查询订单发货信息
        queryOrderSendGoods();
    }
}

/**
 * 初始化订单发货信息
 * @param {any} pSendType 送货方式(Express 快递发货， MySend 自己送货)
 */
function initOrderSendGoods(pSendType) {

    //构造POST参数
    var dataPOST = {
        "Type": "6", "SendType": pSendType,
    };
    console.log(dataPOST);

    ////加载提示窗口
    //loadingWinToDiv("dragWinDiv");

    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: "../Trading/OrderMan?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("初始化订单发货信息=" + reTxt);

            ////移除加载提示
            //closeLoadingWin();

            if (reTxt != "") {
                var _jsonObj = JSON.parse(reTxt);
                //为表单赋值
                $("#ExpressNameWin").val(_jsonObj.ExpressName);
                $("#SendTelNumberWin").val(_jsonObj.SendTelNumber);
                $("#SendShopManWin").val(_jsonObj.SendShopMan);
            }
        },
        error: function (xhr, errorTxt, status) {
            console.log("异步请求错误，errorTxt=" + errorTxt + " | status=" + status);
            return;
        }
    });
}

/**
 * 查询订单发货信息
 */
function queryOrderSendGoods() {

    //构造POST参数
    var dataPOST = {
        "Type": "8", "OrderID": mOrderID,
    };
    console.log(dataPOST);

    ////加载提示窗口
    //loadingWinToDiv("dragWinDiv");

    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: "../Trading/OrderMan?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("查询订单发货信息=" + reTxt);

            ////移除加载提示
            //closeLoadingWin();

            if (reTxt != "") {
                var _jsonObj = JSON.parse(reTxt);
                //为表单赋值
                $("#SendTypeWin").val(_jsonObj.SendType);

                $("#ExpressNameWin").val(_jsonObj.ExpressName);
                $("#ExpressNumberWin").val(_jsonObj.ExpressNumber);
                $("#SendTelNumberWin").val(_jsonObj.SendTelNumber);
                $("#SendShopManWin").val(_jsonObj.SendShopMan);
                $("#SendGoodsMemoWin").val(_jsonObj.SendGoodsMemo);

                if (_jsonObj.SendType == "MySend") {
                    $("#ExpressNumberWin").val("");
                }

                //切换发货类型
                chgSendType();
            }
        },
        error: function (xhr, errorTxt, status) {
            console.log("异步请求错误，errorTxt=" + errorTxt + " | status=" + status);
            return;
        }
    });
}

/**
 * 提交发货送货信息
 * */
function submitSendGoods() {

    //获取表单值
    var SendType = $("#SendTypeWin").val().trim();
    var ExpressName = $("#ExpressNameWin").val().trim();
    var ExpressNumber = $("#ExpressNumberWin").val().trim();
    var SendTelNumber = $("#SendTelNumberWin").val().trim();
    var SendShopMan = $("#SendShopManWin").val().trim();
    var SendGoodsMemo = $("#SendGoodsMemoWin").val().trim();

    var ExeType = "Add";
    if (mOrderStatus == "待收货") {
        ExeType = "Edit";
    }

    if (SendType == "Express") {
        if (ExpressName == "" || ExpressNumber == "" || SendTelNumber == "") {
            toastWinToDiv("【快递名称】【快递单号】【发货电话】都不能为空！", "dragWinDiv");
            return;
        }
    }
    else if (SendType == "MySend") {
        if (SendShopMan == "" || SendTelNumber == "") {
            toastWinToDiv("【送货人姓名】【送货电话】都不能为空！", "dragWinDiv");
            return;
        }
    }

    //构造POST参数
    var dataPOST = {
        "Type": "7", "OrderID": mOrderID, "SendType": SendType, "ExpressName": ExpressName, "ExpressNumber": ExpressNumber, "SendTelNumber": SendTelNumber, "SendShopMan": SendShopMan, "SendGoodsMemo": SendGoodsMemo, "ExeType": ExeType
    };
    console.log(dataPOST);

    //加载提示窗口
    loadingWin();

    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: "../Trading/OrderMan?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("提交发货送货信息=" + reTxt);

            //移除加载提示
            closeLoadingWin();

            if (reTxt != "") {
                var _jsonObj = JSON.parse(reTxt);
                if (_jsonObj.ErrMsg != "" && _jsonObj.ErrMsg != null && _jsonObj.ErrMsg != undefined) {
                    toastWin(_jsonObj.ErrMsg);
                    return;
                }
                if (_jsonObj.Msg != "" && _jsonObj.Msg != null && _jsonObj.Msg != undefined) {
                    toastWinCb(_jsonObj.Msg, function () {
                        //重新刷新页面
                        window.location.reload();
                        return;
                    });
                }
            }
        },
        error: function (xhr, errorTxt, status) {
            console.log("异步请求错误，errorTxt=" + errorTxt + " | status=" + status);
            return;
        }
    });
}

/*---------修改价格------------ */

/**
 * 初始化订单的的价格
 * @param {any} pOrderPrice
 */
function initEditOrderPrice(pOrderPrice) {

    $("#ModifyOrderPriceDiv").show();
    $("#OrderPriceWin").val(pOrderPrice);

}

/**
 * 订单价格修改
 */
function modifyOrderPrice() {

    if (mOrderID == "" || mOrderID == "0") {
        return;
    }

    //获取表单值
    var OrderPriceWin = $("#OrderPriceWin").val().trim();
    if (OrderPriceWin == "") {
        toastWinToDiv("【订单价格】不能为空！", "dragWinDiv");
        $("#OrderPriceWin").focus();
        return;
    }

    //构造POST参数
    var dataPOST = {
        "Type": "11", "OrderID": mOrderID, "OrderPrice": OrderPriceWin,
    };
    console.log(dataPOST);

    //加载提示窗口
    loadingWin();

    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: "../Trading/OrderMan?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("订单价格修改=" + reTxt);

            //移除加载提示
            closeLoadingWin();

            if (reTxt != "") {
                var _jsonObj = JSON.parse(reTxt);
                if (_jsonObj.ErrMsg != "" && _jsonObj.ErrMsg != null && _jsonObj.ErrMsg != undefined) {
                    toastWin(_jsonObj.ErrMsg);
                    return;
                }
                if (_jsonObj.Msg != "" && _jsonObj.Msg != null && _jsonObj.Msg != undefined) {
                    toastWinCb(_jsonObj.Msg, function () {

                        //重新刷新页面
                        window.location.reload();

                    });

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
 * 确认货到付款订单 --批量操作
 */
function confirmPayDeliveryMul() {

    //获取选择的订单ID拼接字符串
    var _orderIDArr = mOrderID; //getSelectValArr();

    //获取交易号
    var _billNumberArr = mBillNumber;


    //console.log("_billNumberArr=" + _billNumberArr);


    confirmWinWidth("确认货到付款订单？", function () {

        //构造POST参数
        var dataPOST = {
            "Type": "3", "OrderIDArr": _orderIDArr, "BillNumberArr": _billNumberArr,
        };
        console.log(dataPOST);

        //加载提示窗口
        loadingWin();

        //正式发送异步请求
        $.ajax({
            type: "POST",
            url: "../Trading/OrderMan?rnd=" + Math.random(),
            data: dataPOST,
            dataType: "html",
            success: function (reTxt, status, xhr) {
                console.log(reTxt);

                //移除加载提示
                closeLoadingWin();

                if (reTxt != "") {
                    var _jsonObj = JSON.parse(reTxt);
                    if (_jsonObj.ErrMsg != "" && _jsonObj.ErrMsg != null && _jsonObj.ErrMsg != undefined) {
                        alertWinWidth(_jsonObj.ErrMsg, 300);
                    }
                    if (_jsonObj.Msg != "" && _jsonObj.Msg != null && _jsonObj.Msg != undefined) {
                        toastWinCb(_jsonObj.Msg, function () {

                            //重新刷新页面
                            window.location.reload();

                        });

                    }
                }
            },
            error: function (xhr, errorTxt, status) {
                console.log("异步请求错误，errorTxt=" + errorTxt + " | status=" + status);
                return;
            }
        });


    }, 300);

}

/**
 * 确认买家已到店付款(商家操作)
 * @param {any} pOrderID 订单ID
 * @param {any} pBillNumber 交易号
 */
function confirmOfflinePay() {

    if (mOrderID == "" || mBillNumber == "") {
        return;
    }

    confirmWinWidth("确定买家已到店支付吗？", function () {

        //构造POST参数
        var dataPOST = {
            "Type": "4", "OrderID": mOrderID, "BillNumber": mBillNumber,
        };
        console.log(dataPOST);

        //加载提示窗口
        loadingWin();

        //正式发送异步请求
        $.ajax({
            type: "POST",
            url: "../Trading/OrderMan?rnd=" + Math.random(),
            data: dataPOST,
            dataType: "html",
            success: function (reTxt, status, xhr) {
                console.log(reTxt);

                //移除加载提示
                closeLoadingWin();

                if (reTxt != "") {
                    var _jsonObj = JSON.parse(reTxt);
                    if (_jsonObj.ErrMsg != "" && _jsonObj.ErrMsg != null && _jsonObj.ErrMsg != undefined) {
                        toastWin(_jsonObj.ErrMsg);
                        return;
                    }
                    if (_jsonObj.Msg != "" && _jsonObj.Msg != null && _jsonObj.Msg != undefined) {
                        toastWinCb(_jsonObj.Msg, function () {
                            //重新刷新页面
                            window.location.reload();
                        });
                    }
                }
            },
            error: function (xhr, errorTxt, status) {
                console.log("异步请求错误，errorTxt=" + errorTxt + " | status=" + status);
                return;
            }
        });


    }, 300);

}

/**
 * 处理退款申请
 * */
function DealRefund() {


    confirmWinWidth("确定退款吗？", function () {

        //构造POST参数
        var dataPOST = {
            "Type": "5", "OrderID": mOrderID,
        };
        console.log(dataPOST);

        //加载提示窗口
        loadingWin();

        //正式发送异步请求
        $.ajax({
            type: "POST",
            url: "../Trading/OrderMan?rnd=" + Math.random(),
            data: dataPOST,
            dataType: "html",
            success: function (reTxt, status, xhr) {
                console.log(reTxt);

                //移除加载提示
                closeLoadingWin();

                if (reTxt != "") {
                    var _jsonObj = JSON.parse(reTxt);
                    if (_jsonObj.ErrMsg != "" && _jsonObj.ErrMsg != null && _jsonObj.ErrMsg != undefined) {
                        toastWin(_jsonObj.ErrMsg);
                        return;
                    }
                    if (_jsonObj.Msg != "" && _jsonObj.Msg != null && _jsonObj.Msg != undefined) {
                        toastWinCb(_jsonObj.Msg, function () {
                            //重新刷新页面
                            window.location.reload();
                        });
                    }
                }
            },
            error: function (xhr, errorTxt, status) {
                console.log("异步请求错误，errorTxt=" + errorTxt + " | status=" + status);
                return;
            }
        });
    }, 300);
}

/**
 * 拒收订单操作
 */
function rejectReceiOrder() {

    confirmWinWidth("确定买家已拒收吗？", function () {

        //构造POST参数
        var dataPOST = {
            "Type": "10", "OrderID": mOrderID,
        };
        console.log(dataPOST);

        //正式发送异步请求
        $.ajax({
            type: "POST",
            url: "../Trading/OrderMan?rnd=" + Math.random(),
            data: dataPOST,
            dataType: "html",
            success: function (reTxt, status, xhr) {
                console.log("拒收订单操作=" + reTxt);

                if (reTxt != "") {
                    var _jsonObj = JSON.parse(reTxt);
                    if (_jsonObj.ErrMsg != "" && _jsonObj.ErrMsg != null && _jsonObj.ErrMsg != undefined) {
                        //提示
                        toastWin(_jsonObj.ErrMsg);
                        return;
                    }
                    if (_jsonObj.Msg != "" && _jsonObj.Msg != null && _jsonObj.Msg != undefined) {

                        toastWinCb(_jsonObj.Msg, function () {
                            //重新刷新页面
                            window.location.reload();

                        });

                    }
                }
            },
            error: function (xhr, errorTxt, status) {
                console.log("异步请求错误，errorTxt=" + errorTxt + " | status=" + status);
                return;
            }
        });

    }, 300);
}