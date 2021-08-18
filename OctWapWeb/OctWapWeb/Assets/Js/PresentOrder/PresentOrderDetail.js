//=================礼品订单详情=========================//

/**---------定义公共变量-----------**/

//AjaxURL
var mAjaxUrl = "../PresentOrderAjax/PresentOrderDetail";

var mPOID = ""; //礼品订单ID
var mBReceiAddrID = ""; //收货地址ID
var mShopUserID = ""; //商家UserID
var mShopID = "";//店铺ID

//构建商家店铺咨询进入IM在线客服系统 跳转 URL
var mBuyerGoToImSysURL_ShopWap = "";


/**------初始化------**/
$(function () {

    mPOID = $("#hidPOID").val().trim();
    mBReceiAddrID = $("#hidBReceiAddrID").val().trim();

    //初始化礼品订单详情
    initPresentOrderDetail();

    //初始化复制订单ID
    initCopyOrderID();

    //更新订单的收货地址信息
    updatePresentOrderDelivery();

});

/**
 * 初始化礼品订单详情
 * */
function initPresentOrderDetail() {

    //构造POST参数
    var dataPOST = {
        "Type": "1", "PstOrderID": mPOID,
    };
    console.log(dataPOST);
    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: mAjaxUrl + "?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("初始化礼品订单详情=" + reTxt);
            if (reTxt != "") {
                var _jsonReTxt = JSON.parse(reTxt);

                //构造设置页面显示代码
                xhtmlPresentOrderDetail(_jsonReTxt);


            }
        }
    });
}

/**
 * 构造设置页面显示代码
 * @param {any} pJsonReTxt 返回的Json对象
 */
function xhtmlPresentOrderDetail(pJsonReTxt) {

    var PresentOrderMsg = pJsonReTxt.PresentOrderMsg;
    var ShopMsg = pJsonReTxt.ShopMsg;
    var PresentOrderDelivery = pJsonReTxt.PresentOrderDelivery;
    var OrderStatusArr = pJsonReTxt.OrderStatusArr;
    var ExtraData = pJsonReTxt.ExtraData;
    var PresentOrderSendGoods = pJsonReTxt.PresentOrderSendGoods


    mShopUserID = PresentOrderMsg.ShopUserID;
    mShopID = ShopMsg.ShopID;

    //标题与描述
    $("#StatusTtitle").html(OrderStatusArr.OrderStatusTtitle);
    $("#StatusDesc").html(OrderStatusArr.OrderStatusDesc);

    if (PresentOrderDelivery != undefined && PresentOrderDelivery != null) {

        $("#ReceiMsg").show();
        $("#ShopAddrNav").hide();
        $("#CheckCodeDiv").hide();

        //收货地址
        $("#DeliName").html(PresentOrderDelivery.DeliName);
        $("#Mobile").html(PresentOrderDelivery.Mobile);
        $("#RegionDetailAddr").html(PresentOrderDelivery.RegionNameArr + "_" + PresentOrderDelivery.DetailAddr);

        if (PresentOrderMsg.OrderStatus == "待发货") {
            $("#ChgReceiAddr").show();
        }
        else {
            $("#ChgReceiAddr").hide();
        }
    }
    else {

        $("#ReceiMsg").hide();
        $("#ShopAddrNav").show();
        $("#CheckCodeDiv").show();

        //加载店铺导航信息
        $("#DistanceKmB").html(ShopMsg.DistanceKm + "km");
        $("#ShopAddrDetailDiv").html(ShopMsg.RegionNameArr + "_" + ShopMsg.DetailAddr);

        //初始化店铺地址坐标相关信息
        initShopAddrNav(ShopMsg.Latitude, ShopMsg.Longitude, ShopMsg.ShopName, ShopMsg.DetailAddr);
    }

    //商品区域
    //店铺信息
    $("#ShopNameA").html("<img src=\"//" + ShopMsg.ShopHeaderImg + "\" />" + ShopMsg.ShopName + "");
    $("#ShopNameA").attr("href", "../Shop/Index?SID=" + ShopMsg.ShopID + "");
    $("#OrderStatusDiv").html(PresentOrderMsg.OrderStatus);

    //构造设置商品列表显示代码
    xhtmlGoodsItemList(PresentOrderMsg, ExtraData.PresentCoverImgURL);

    $("#SumTotalGoodsPrice").html(formatNumberDotDigit(PresentOrderMsg.OrderPrice));
    $("#PayOrderPriceB").html(formatNumberDotDigit(PresentOrderMsg.OrderPrice));

    //订单信息
    $("#OrderIDB").html(PresentOrderMsg.PstOrderID);

    if (PresentOrderMsg.IsPinkage == "true") {
        $("#IsPinkage").html("包邮-免运费");
    }
    else {
        $("#IsPinkage").html("不包邮-买家付运费");
    }
    $("#OrderTimeDiv").html(PresentOrderMsg.OrderTime);

    if (PresentOrderMsg.PayWay == "Integral") {
        $("#PayWayDiv").html("积分支付");
    }

    if (PresentOrderMsg.ExpressType == "express") {
        $("#ExpressTypeDiv").html("送货上门(快递)");
    }
    else if (PresentOrderMsg.ExpressType == "shop") {
        $("#ExpressTypeDiv").html("到店消费/自取");
    }

    if (PresentOrderMsg.ExpressType == "shop" && PresentOrderMsg.OrderStatus.indexOf("待消费") >= 0) {
        //初始化 订单 [待消费/自取] 验证码
        initShopCheckOrderStatus("false");

        $("#CheckCodeDiv").show();
    }
    else {
        $("#CheckCodeDiv").hide();
    }

    //发货信息
    if (PresentOrderSendGoods.SendGoodsID != 0 && PresentOrderMsg.ExpressType == "express") {
        $("#ExpressSendGoods").show();
        if (PresentOrderSendGoods.SendType == "Express") {
            $("#SendGoodsType").html("快递信息");

            var myJsVal = "";            myJsVal += "快递名称：" + PresentOrderSendGoods.ExpressName + "  ， 单号: " + PresentOrderSendGoods.ExpressNumber; //+ "  <a href=\"#\" style=\"color: #0266d1;display:inline; padding: 0px 15px;\">查询</a>";            $("#SendGoodsContent").html(myJsVal);
        }
        else if (PresentOrderSendGoods.SendType == "MySend") {
            $("#SendGoodsType").html("送货信息");

            var myJsVal = "";            myJsVal += "送货人姓名：" + PresentOrderSendGoods.SendShopMan + "  ， 备注: " + PresentOrderSendGoods.SendGoodsMemo;            $("#SendGoodsContent").html(myJsVal);
        }

        $("#SendTelNumber").html("<a href=\"tel:" + PresentOrderSendGoods.SendTelNumber + "\" style=\"color: #0266d1;\">" + PresentOrderSendGoods.SendTelNumber + "</a>");
    }
    else {
        $("#ExpressSendGoods").hide();
    }

    //构造底部按钮组
    xhtmlOrderStatusBtnList(PresentOrderMsg.PstOrderID, PresentOrderMsg.OrderStatus, PresentOrderMsg.ShopUserID)

    //商家客服，拨打电话，投诉商家
    $("#CustomerOnLineDiv").on("click", function () {
        window.location.href = "tel:" + ShopMsg.ShopMobile;
    });
    $("#ShopMobileDiv").on("click", function () {
        window.location.href = "tel:" + ShopMsg.ShopMobile;
    });


    //构建商家店铺咨询进入IM在线客服系统 跳转 URL
    buildBuyerGoToImSysURL_ShopWap(PresentOrderMsg.ShopUserID, PresentOrderMsg.BuyerUserID);

}

/**
 * 构造设置商品列表显示代码
 * @param {any} pPresentOrderMsgJson 商品对象Json
 * @param 礼品封面
 */
function xhtmlGoodsItemList(pPresentOrderMsgJson, pPresentCoverImgURL) {

    var myJsVal = "";    myJsVal += "<a href=\"../Present/PresentDetail?PID=" + pPresentOrderMsgJson.PresentIDArr + "\" target=\"_blank\" class=\"order-goods-item\">";    myJsVal += " <div class=\"goods-item-left\">";    myJsVal += "     <img src=\"//" + pPresentCoverImgURL + "\" />";    myJsVal += " </div>";    myJsVal += " <div class=\"goods-item-mid\">";    myJsVal += "     <span class=\"goods-item-title\">" + pPresentOrderMsgJson.PresentTitleArr + "</span>";    myJsVal += " </div>";    myJsVal += " <div class=\"goods-item-right\">";    myJsVal += "     <span class=\"goods-item-price\">" + pPresentOrderMsgJson.PresentPriceArr + "</span>";    myJsVal += "     <span class=\"goods-item-ordernum\">&times; 1</span>";    myJsVal += " </div>";    myJsVal += "</a>";    $("#OrderGoodsListDiv").html(myJsVal);
}


/**
 * 更新订单的收货地址信息
 * */
function updatePresentOrderDelivery() {

    var _hidBReceiAddrID = $("#hidBReceiAddrID").val().trim();
    if (_hidBReceiAddrID == "" || _hidBReceiAddrID == null || _hidBReceiAddrID == undefined) {
        return;
    }

    //构造POST参数
    var dataPOST = {
        "Type": "2", "PstOrderID": mPOID, "BReceiAddrID": _hidBReceiAddrID,
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
        "Type": "3", "PstOrderID": mPOID, "IsReSet": pIsReSet, "ShopUserID": mShopUserID,
    };
    console.log(dataPOST);
    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: mAjaxUrl + "?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("初始化 礼品订单 [待消费/自取] 验证码=" + reTxt);
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
                        $("#checkCodeNumberB").html(_jsonReTxt.DataDic.VerifyCode);
                        //扫码图片
                        $("#ScanImgA").attr("href", "../ToolWeb/GetQrCodeImg.aspx?QrCodeContent=" + _jsonReTxt.DataDic.ScanUrl + "&rnd=" + Math.random());
                        $("#ScanImg").attr("src", "../ToolWeb/GetQrCodeImg.aspx?QrCodeContent=" + _jsonReTxt.DataDic.ScanUrl + "&rnd=" + Math.random());

                        return;
                    }
                }
                //更新显示信息
                $("#checkCodeNumberB").html(_jsonReTxt.DataDic.VerifyCode);
                //扫码图片
                $("#ScanImgA").attr("href", "../ToolWeb/GetQrCodeImg.aspx?QrCodeContent=" + _jsonReTxt.DataDic.ScanUrl + "&rnd=" + Math.random());
                $("#ScanImg").attr("src", "../ToolWeb/GetQrCodeImg.aspx?QrCodeContent=" + _jsonReTxt.DataDic.ScanUrl + "&rnd=" + Math.random());

            }
        }
    });
}

/**
 * 构造底部按钮组
 * @param {any} pPstOrderID
 * @param {any} pOrderStatus
 */
function xhtmlOrderStatusBtnList(pPstOrderID, pOrderStatus, pShopUserID) {

    //按钮Html
    var myJsVal = "";    myJsVal += "<div onclick=\"window.location.href='../Buyer/ComplainSubmit?POID=" + pPstOrderID + "'\">投诉</div>";    if (pOrderStatus == "待收货") {        myJsVal += "<div class=\"footer-btn-current\" onclick=\"confirmReceiPresentOrderBuyer('" + pPstOrderID + "', '" + pShopUserID + "')\">确认收货</div>";
    }
    $(".oct-footer").html(myJsVal);
}

/**
 * 买家 确认收货 -快递发货
 * @param {any} pPstOrderID
 * @param {any} pBuyerUserID
 */
function confirmReceiPresentOrderBuyer(pPstOrderID, pShopUserID) {

    confirmWin("确认收货？", function () {

        //构造POST参数
        var dataPOST = {
            "Type": "4", "PstOrderID": pPstOrderID, "ShopUserID": pShopUserID,
        };
        console.log(dataPOST);
        //正式发送异步请求
        $.ajax({
            type: "POST",
            url: mAjaxUrl + "?rnd=" + Math.random(),
            data: dataPOST,
            dataType: "html",
            success: function (reTxt, status, xhr) {
                console.log("买家确认收货=" + reTxt);
                if (reTxt != "") {
                    var _jsonReTxt = JSON.parse(reTxt);

                    if (_jsonReTxt.ErrMsg != "" && _jsonReTxt.ErrMsg != null && _jsonReTxt.ErrMsg != undefined) {
                        toastWin(_jsonReTxt.ErrMsg);
                        return;
                    }

                    if (_jsonReTxt.Msg != "" && _jsonReTxt.Msg != null && _jsonReTxt.Msg != undefined) {
                        toastWinCb(_jsonReTxt.Msg, function () {
                            window.location.reload();
                        });
                        return;
                    }
                }
            }
        });

    });


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


