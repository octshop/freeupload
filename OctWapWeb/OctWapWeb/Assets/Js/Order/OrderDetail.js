//=============订单详情===================//


/**-----定义公共变量------**/
var mAjaxUrl = "../OrderAjax/OrderDetail";

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

//买家UserID
var mBuyerUserID = "";

//商品ID
var mGoodsID = 0;
//拼团ID,开团ID
var mGroupID = 0;

//OctWapWeb 手机Web端(公众号端)地址域名
var mhidOctWapWeb_AddrDomain = "";

//构建商家店铺咨询进入IM在线客服系统 跳转 URL
var mBuyerGoToImSysURL_ShopWap = "";

/**------初始化------**/
$(function () {

    mhidOctWapWeb_AddrDomain = $("#hidOctWapWeb_AddrDomain").val().trim();
    mOrderID = $("#hidOrderID").val().trim();

    //初始化订单信息
    initOrderMsg();

    //更新订单的收货地址信息
    updateOrderDelivery();

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

    mBuyerUserID = OrderMsg.BuyerUserID;

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
    $("#ShopNameA").attr("href", "../Shop/Index?SID=" + ShopMsg.ShopID + "");
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

    //构造订单状态的操作按钮列表 显示代码
    var _xhtmlBtnList = xhtmlOrderStatusBtnList(OrderMsg.OrderID, OrderMsg.OrderStatus, OrderStatusDesc.StatusTtitle, OrderMsg.PayWay, OrderMsg.IsDelayFinishTime);
    $(".oct-footer").html(_xhtmlBtnList);

    //设置订单状态Logo图片
    setStatusLogoImg(OrderMsg.OrderStatus);

    //隐藏修改收货地址按钮 订单状态 [ 待付款]，[ 待确认(货到付款)]，[到店付], [转账]， [取消] ,[待消费/自取] ,[待发货]，[退款中]，[退款成功]，[待收货],[待评价]，[完成]
    if (OrderMsg.OrderStatus == "待收货" || OrderMsg.OrderStatus.indexOf("待消费") >= 0 || OrderMsg.OrderStatus == "待评价" || OrderMsg.OrderStatus == "完成" || OrderMsg.OrderStatus == "退款中" || OrderMsg.OrderStatus == "退款成功" || OrderMsg.OrderStatus == "取消") {
        $("#ChgReceiAddr").hide();
    }

    if (OrderMsg.OrderStatus.indexOf("待消费") >= 0) {
        $("#CheckCodeDiv").show();

        //初始化 订单 [待消费/自取] 验证码 --包括创建
        initShopCheckOrderStatus(OrderMsg.OrderID, "false");
    }

    //如果是待收货，快递发货则订单动态列表，直接连接到快递查询页
    if (OrderMsg.OrderStatus.indexOf("待收货") >= 0 && OrderMsg.ExpressType.indexOf("送货上门") >= 0) {
        $("#ExpressMsgDiv").removeAttr("onclick");
        $("#ExpressMsgDiv").on("click", function () {
            window.location.href = "../Order/ExpressDetail?OID=" + OrderMsg.OrderID;
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


    //构建商家店铺咨询进入IM在线客服系统 跳转 URL
    buildBuyerGoToImSysURL_ShopWap(mShopUserID, mBuyerUserID);


}

/**
 * 更新订单的收货地址信息
 * */
function updateOrderDelivery() {

    var _hidBReceiAddrID = $("#hidBReceiAddrID").val().trim();
    if (_hidBReceiAddrID == "" || _hidBReceiAddrID == null || _hidBReceiAddrID == undefined) {
        return;
    }

    //构造POST参数
    var dataPOST = {
        "Type": "2", "OrderID": mOrderID, "BReceiAddrID": _hidBReceiAddrID,
    };
    console.log(dataPOST);
    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: mAjaxUrl + "?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("更新订单的收货地址=" + reTxt);
            if (reTxt != "") {
                var _jsonReTxt = JSON.parse(reTxt);

                //设置为更新的收货地址
                var DataDic = _jsonReTxt.DataDic;
                $("#DeliName").html(DataDic.DeliName);
                $("#Mobile").html(DataDic.Mobile);
                $("#RegionDetailAddr").html(DataDic.RegionNameArr + "_" + DataDic.DetailAddr);
            }
        }
    });


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


    var myJsVal = "";    for (var i = 0; i < GoodsIDArr.length; i++) {        var _orderNum = GoodsSpecIDOrderNumArr[i].split('_')[1];        myJsVal += "<a href=\"../" + _hrefUrl + "?GID=" + GoodsIDArr[i] + "\" class=\"order-goods-item\">";        myJsVal += "   <div class=\"goods-item-left\">";        myJsVal += "       <img src=\"//" + GoodsImgArr[i] + "\" />";        myJsVal += "   </div>";        myJsVal += "   <div class=\"goods-item-mid\">";        myJsVal += "       <span class=\"goods-item-title\">" + GoodsTitleArr[i] + "</span>";        myJsVal += "<span class=\"goods-item-spec\">" + SpecParamValArr[i] + "</span>";        myJsVal += "   </div>";        myJsVal += "   <div class=\"goods-item-right\">";        myJsVal += "       <span class=\"goods-item-price\">&#165;" + GoodsUnitPriceArr[i] + "</span>";        myJsVal += "       <span class=\"goods-item-ordernum\">&times; " + _orderNum + "</span>";        myJsVal += "   </div>";        myJsVal += "</a>";    }    return myJsVal;
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
 * ----------构造订单状态的操作按钮列表 显示代码----------------
 * pOrderStatus 订单状态 [ 待付款]，[ 待确认(货到付款)]，[到店付], [转账]， [取消] ,[待消费/自取] ,[待发货]，[退款中]，[退款成功]，[待收货],[待评价]，[完成]
 * @pPayWay 支付方式 （WeiXinPay [微信支付], Alipay[支付宝] , Transfer[银行转账] , Offline[线下付款(到店付)], PayDelivery [货到付款]  Balance[余额支付]）
 * */
function xhtmlOrderStatusBtnList(pOrderID, pOrderStatus, pStatusTtitle, pPayWay, pIsDelayFinishTime) {

    //按钮Html
    var _xhtmlBtnList = "";

    if (pOrderStatus != "待收货") {
        _xhtmlBtnList = "<div onclick=\"window.location.href='../Buyer/ComplainSubmit?OID=" + pOrderID + "'\">投诉</div >";
    }

    if (pOrderStatus == "待付款" || pOrderStatus == "待确认" || pOrderStatus == "到店付" || pOrderStatus == "转账") {

        //构造支付显示文字
        var _payName = "立即付款";
        if (pOrderStatus == "待确认" || pOrderStatus == "到店付" || pOrderStatus == "转账") {
            _payName = "选择其他支付";
        }

        _xhtmlBtnList += "<div onclick=\"cancelOrder()\">取消订单</div >";
        _xhtmlBtnList += "<div class=\"footer-btn-current\" onclick=\"window.location.href='../Pay/OrderPay?OID=" + mOrderID + "'\">" + _payName + "</div >";

        //转账付款方式
        if (pOrderStatus == "转账") {

            //转账按钮显示名称
            var _btnTransferName = "立即转账";
            if (pStatusTtitle == "转账确认") {
                _btnTransferName = "修改转账信息";
            }

            _xhtmlBtnList += "<div class=\"footer-btn-current\" onclick=\"window.location.href='../Order/BankTransfer?BillNum=" + mBillNumber + "'\">" + _btnTransferName + "</div >";
        }
    }
    else if (pOrderStatus == "待发货") {

        if (pPayWay.indexOf("货到付款") < 0 && pPayWay.indexOf("积分支付") < 0) {
            _xhtmlBtnList += "<div onclick=\"applyRefund()\">申请退款</div >";
        }
        _xhtmlBtnList += "<div class=\"footer-btn-current\" onclick=\"remindSendGoods()\">提醒发货</div >";
    }
    else if (pOrderStatus == "待消费/自取") {

        _xhtmlBtnList += "<div onclick=\"window.location.reload()\">刷新订单</div >";
        if (pPayWay.indexOf("货到付款") < 0 && pPayWay.indexOf("积分支付") < 0) {
            _xhtmlBtnList += "<div onclick=\"applyRefund()\">申请退款</div >";
        }
    }
    else if (pOrderStatus == "待收货") {

        _xhtmlBtnList += "<div onclick=\"window.location.href='../Order/ExpressDetail?OID=" + pOrderID + "'\">查看物流</div >";

        if (pIsDelayFinishTime != "true") {
            _xhtmlBtnList += "<div onclick=\"delayReceiOrder()\">延长收货</div >";
        }

        //是否加积分
        var _addReturnIntegral = "";
        if (parseFloat(mConfirmReceiReturnIntegral) > 0) {
            _addReturnIntegral = " +" + mConfirmReceiReturnIntegral + " 积分";
        }

        _xhtmlBtnList += "<div class=\"footer-btn-current\" onclick=\"confirmReceiOrder()\">确认收货" + _addReturnIntegral + "</div >";
    }
    else if (pOrderStatus == "待评价") {
        _xhtmlBtnList += "<div onclick=\"window.location.href='../AfterSale/AsMulSel?OID=" + pOrderID + "'\">申请售后</div >";
        _xhtmlBtnList += "<div class=\"footer-btn-current\" onclick=\"window.location.href='../Buyer/AppraiseForm?OID=" + pOrderID + "'\">立即评价+积分</div >";
    }
    else if (pOrderStatus == "退款中") {
        _xhtmlBtnList += "<div onclick=\"remindRefund('" + pPayWay + "')\">提醒退款</div >";
    }
    else if (pOrderStatus == "完成") {
        _xhtmlBtnList += "<div onclick=\"window.location.href='../AfterSale/AsMulSel?OID=" + pOrderID + "'\">申请售后</div >";
        _xhtmlBtnList += "<div class=\"footer-btn-current\" onclick=\"window.location.href='../Buyer/AppraiseDetail?OID=" + pOrderID + "'\">查看评价</div >";
    }
    else if (pOrderStatus == "待分享") {
        _xhtmlBtnList += "<div class=\"footer-btn-current\" id=\"BtnCopyGroupShare\" data-clipboard-text=\"" + mhidOctWapWeb_AddrDomain + "/Group/GroupDetail?GID=" + mGoodsID + "&GroupID=" + mGroupID + "\" onclick=\"\">邀好友参团</div >";
    }

    return _xhtmlBtnList;
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

/**
 * 取消订单,关闭交易
 * */
function cancelOrder() {

    confirmWinCCb("确定要取消订单吗？", function () {

        //构造POST参数
        var dataPOST = {
            "Type": "3", "OrderID": mOrderID,
        };
        console.log(dataPOST);
        //正式发送异步请求
        $.ajax({
            type: "POST",
            url: mAjaxUrl + "?rnd=" + Math.random(),
            data: dataPOST,
            dataType: "html",
            success: function (reTxt, status, xhr) {
                console.log("取消订单=" + reTxt);
                if (reTxt != "") {
                    var _jsonReTxt = JSON.parse(reTxt);

                    if (_jsonReTxt.ErrMsg != "" && _jsonReTxt.ErrMsg != null && _jsonReTxt.ErrMsg != undefined) {
                        toastWin(_jsonReTxt.ErrMsg);
                        return;
                    }

                    if (_jsonReTxt.Msg != "" && _jsonReTxt.Msg != null && _jsonReTxt.Msg != undefined) {
                        //初始化订单信息
                        initOrderMsg();
                    }

                }
            }
        });

    }, function () { });
}

/**
 * 提醒商家订单发货
 * */
function remindSendGoods() {

    //构造POST参数
    var dataPOST = {
        "Type": "4", "OrderID": mOrderID, "ShopUserID": mShopUserID
    };
    console.log(dataPOST);
    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: mAjaxUrl + "?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("提醒商家订单发货=" + reTxt);
            if (reTxt != "") {
                var _jsonReTxt = JSON.parse(reTxt);

                if (_jsonReTxt.ErrMsg != "" && _jsonReTxt.ErrMsg != null && _jsonReTxt.ErrMsg != undefined) {
                    toastWin("提醒成功");
                    return;
                }

                if (_jsonReTxt.Msg != "" && _jsonReTxt.Msg != null && _jsonReTxt.Msg != undefined) {
                    toastWin("提醒成功");
                    return;
                }

            }
        }
    });


}

/**
 * 申请退款(未发货)
 * */
function applyRefund() {

    confirmWinCCb("确定要申请退款吗？", function () {

        //构造POST参数
        var dataPOST = {
            "Type": "5", "OrderID": mOrderID
        };
        console.log(dataPOST);
        //正式发送异步请求
        $.ajax({
            type: "POST",
            url: mAjaxUrl + "?rnd=" + Math.random(),
            data: dataPOST,
            dataType: "html",
            success: function (reTxt, status, xhr) {
                console.log("申请退款(未发货)=" + reTxt);
                if (reTxt != "") {
                    var _jsonReTxt = JSON.parse(reTxt);

                    if (_jsonReTxt.ErrMsg != "" && _jsonReTxt.ErrMsg != null && _jsonReTxt.ErrMsg != undefined) {
                        toastWin(_jsonReTxt.ErrMsg);
                        return;
                    }

                    if (_jsonReTxt.Msg != "" && _jsonReTxt.Msg != null && _jsonReTxt.Msg != undefined) {
                        toastWinCb(_jsonReTxt.Msg, function () {
                            //初始化订单信息
                            initOrderMsg();
                        });
                        return;
                    }

                }
            }
        });


    }, function () { });

}

/**
 * 向商家或平台发送提醒退款
 * @param {any} pPayWayName 支付方式名称  -- 支付方式 （WeiXinPay [微信支付], Alipay[支付宝] , Transfer[银行转账] , Offline[线下付款(到店付)], PayDelivery [货到付款]  Balance[余额支付]）
 */
function remindRefund(pPayWayName) {

    //构造POST参数
    var dataPOST = {
        "Type": "6", "OrderID": mOrderID, "ShopUserID": mShopUserID, "PayWayName": pPayWayName,
    };
    console.log(dataPOST);
    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: mAjaxUrl + "?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("提醒退款=" + reTxt);
            if (reTxt != "") {
                var _jsonReTxt = JSON.parse(reTxt);

                if (_jsonReTxt.ErrMsg != "" && _jsonReTxt.ErrMsg != null && _jsonReTxt.ErrMsg != undefined) {
                    toastWin("提醒成功");
                    return;
                }

                if (_jsonReTxt.Msg != "" && _jsonReTxt.Msg != null && _jsonReTxt.Msg != undefined) {
                    toastWin("提醒成功");
                    return;
                }

            }
        }
    });


}

/**
 * 初始化 订单 [待消费/自取] 验证码 --包括重新生成
 * @param {any} pIsReSet 如果存在,是否重新生成 [false / true 重新生成]
 */
function initShopCheckOrderStatus(pIsReSet) {

    if (pIsReSet == "true") {
        $("#BtnReset").attr("disabled", true);
        $("#BtnReset").val("…生成中…");
    }

    //构造POST参数
    var dataPOST = {
        "Type": "7", "OrderID": mOrderID, "IsReSet": pIsReSet,
    };
    console.log(dataPOST);
    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: mAjaxUrl + "?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("初始化 订单 [待消费/自取] 验证码=" + reTxt);
            if (reTxt != "") {
                var _jsonReTxt = JSON.parse(reTxt);

                if (pIsReSet == "true") //重新生成
                {

                    $("#BtnReset").attr("disabled", false);
                    $("#BtnReset").val("重新生成");


                    if (_jsonReTxt.ErrMsg != "" && _jsonReTxt.ErrMsg != null && _jsonReTxt.ErrMsg != undefined) {
                        toastWin(_jsonReTxt.ErrMsg);
                        return;
                    }

                    if (_jsonReTxt.Msg != "" && _jsonReTxt.Msg != null && _jsonReTxt.Msg != undefined) {
                        toastWin(_jsonReTxt.Msg);

                        //更新显示信息
                        $("#checkCodeNumberB").html(_jsonReTxt.DataDic.CheckCode);
                        //扫码图片
                        $("#ScanImgA").attr("href", "../ToolWeb/GetQrCodeImg.aspx?QrCodeContent=" + _jsonReTxt.DataDic.ScanUrl + "&rnd=" + Math.random());
                        $("#ScanImg").attr("src", "../ToolWeb/GetQrCodeImg.aspx?QrCodeContent=" + _jsonReTxt.DataDic.ScanUrl + "&rnd=" + Math.random());

                        return;
                    }
                }
                //更新显示信息
                $("#checkCodeNumberB").html(_jsonReTxt.DataDic.CheckCode);
                //扫码图片
                $("#ScanImgA").attr("href", "../ToolWeb/GetQrCodeImg.aspx?QrCodeContent=" + _jsonReTxt.DataDic.ScanUrl + "&rnd=" + Math.random());
                $("#ScanImg").attr("src", "../ToolWeb/GetQrCodeImg.aspx?QrCodeContent=" + _jsonReTxt.DataDic.ScanUrl + "&rnd=" + Math.random());


            }
        }
    });
}

/**
 * 确认收货 
 * */
function confirmReceiOrder() {

    confirmWin("确认收货？", function () {
        //构造POST参数
        var dataPOST = {
            "Type": "8", "OrderID": mOrderID,
        };
        console.log(dataPOST);
        //正式发送异步请求
        $.ajax({
            type: "POST",
            url: mAjaxUrl + "?rnd=" + Math.random(),
            data: dataPOST,
            dataType: "html",
            success: function (reTxt, status, xhr) {
                console.log("确认收货" + reTxt);
                if (reTxt != "") {
                    var _jsonReTxt = JSON.parse(reTxt);

                    //错误提示
                    if (_jsonReTxt.ErrMsg != null && _jsonReTxt.ErrMsg != undefined && _jsonReTxt.ErrMsg != "") {
                        toastWin(_jsonReTxt.ErrMsg);
                    }

                    if (_jsonReTxt.Msg != null && _jsonReTxt.Msg != undefined && _jsonReTxt.Msg != "") {
                        //刷新页面
                        window.location.reload();

                    }
                }
            }
        });
    });
}


/**
 * 延长自动确认收货时间
 * */
function delayReceiOrder() {

    confirmWin("延长自动确认收货时间？", function () {
        //构造POST参数
        var dataPOST = {
            "Type": "9", "OrderID": mOrderID,
        };
        console.log(dataPOST);
        //正式发送异步请求
        $.ajax({
            type: "POST",
            url: mAjaxUrl + "?rnd=" + Math.random(),
            data: dataPOST,
            dataType: "html",
            success: function (reTxt, status, xhr) {
                console.log("延长自动确认收货时间" + reTxt);
                if (reTxt != "") {
                    var _jsonReTxt = JSON.parse(reTxt);

                    //错误提示
                    if (_jsonReTxt.ErrMsg != null && _jsonReTxt.ErrMsg != undefined && _jsonReTxt.ErrMsg != "") {
                        toastWin(_jsonReTxt.ErrMsg);
                    }

                    if (_jsonReTxt.Msg != null && _jsonReTxt.Msg != undefined && _jsonReTxt.Msg != "") {

                        toastWinCb(_jsonReTxt.Msg, function () {
                            //刷新页面
                            window.location.reload();
                        })
                    }
                }
            }
        });
    });
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

        var myJsVal = "";        //循环构造赠品信息
        for (var i = 0; i < mOrderGiftMsg.GiftMsgList.length; i++) {
            myJsVal += "<div>";            myJsVal += "<a href=\"../Goods/GiftDetail?GIID=" + mOrderGiftMsg.GiftMsgList[i].GiftID + "\" target=\"_blank\">" + mOrderGiftMsg.GiftMsgList[i].GiftName + "</a>";            myJsVal += "<span>x " + mOrderGiftMsg.GiftNumList[i].GiftNum + "</span>";            myJsVal += "</div>";        }
        //显示代码插入前台
        $("#WinOrderGiftContent").html(myJsVal);
    }

}

/**
 * 客服与投诉条的单击事件
 * @ pClickTypeNum [0] 商家客服 [1] 拨打电话 [2] 投诉商家
 * */
function serviceComplainBarClick(pClickTypeNum) {
    if (pClickTypeNum == "0") {

    }
    else if (pClickTypeNum == "1") {

    }
    else if (pClickTypeNum == "2") {
        window.location.href = "../Buyer/ComplainSubmit?SID=" + mShopID;
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


/**
 * -----构建商家店铺咨询进入IM在线客服系统 跳转 URL-----
 * @param {any} pShopUserID
 * @param {any} pBuyerUserID
 */
function buildBuyerGoToImSysURL_ShopWap(pShopUserID, pBuyerUserID) {

    //构造POST参数
    var dataPOST = {
        "Type": "1", "ShopUserID": pShopUserID, "BuyerUserID": pBuyerUserID,
    };
    console.log(dataPOST);

    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: "../ImSysAjax/Index?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("构建商家店铺咨询进入IM在线客服系统跳转URL=" + reTxt);

            if (reTxt != "") {
                //$("#hidBuyerGoToImSysURL_ShopWap").val(reTxt);

                mBuyerGoToImSysURL_ShopWap = reTxt;


                if (mBuyerGoToImSysURL_ShopWap != "" && mBuyerGoToImSysURL_ShopWap != null && mBuyerGoToImSysURL_ShopWap != undefined) {

                    $("#CustomerOnLineDiv").unbind();
                    //页脚下面的客服
                    $("#CustomerOnLineDiv").on("click", function () {
                        window.location.href = encodeURI(mBuyerGoToImSysURL_ShopWap);
                    });
                    //$("#CusServiceA").attr("href", encodeURI(mBuyerGoToImSysURL_ShopWap));


                }
            }
        }
    });
}



