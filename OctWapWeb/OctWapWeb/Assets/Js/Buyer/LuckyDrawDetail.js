//===================抽奖详情==========================//

/**-----定义公共变量-----**/

//AjaxURL
var mAjaxUrl = "../BuyerAjax/LuckyDrawDetail";

//抽奖ID
var mLuckydrawID = 0;

//商家UserID
var mShopUserID = "";
//抽奖结果ID
var mLuckyDrawResultID = "";

//构建商家店铺咨询进入IM在线客服系统 跳转 URL
var mBuyerGoToImSysURL_ShopWap = "";

/**------初始化------**/
$(function () {

    mLuckydrawID = $("#hidLuckydrawID").val().trim();

    //初始化抽奖详情
    initLuckydrawDetail();

});


/**
 * 初始化抽奖详情
 * */
function initLuckydrawDetail() {
    //构造POST参数
    var dataPOST = {
        "Type": "1", "LuckydrawID": mLuckydrawID,
    };
    console.log(dataPOST);
    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: mAjaxUrl + "?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("初始化抽奖详情=" + reTxt);
            if (reTxt != "") {
                var _jsonReTxt = JSON.parse(reTxt);

                var LuckyDrawMsg = _jsonReTxt.LuckyDrawMsg;
                var LuckyDrawResult = _jsonReTxt.LuckyDrawResult;
                var SendGoodsMsg = _jsonReTxt.SendGoodsMsg;

                mShopUserID = LuckyDrawMsg.ShopUserID;

                if (LuckyDrawMsg.LuckydrawStatus == "未开奖") {
                    $("#LogoTitleDiv").html("未开奖");
                    $("#LogoDescDiv").html("请等待开奖");
                }
                else if (LuckyDrawMsg.LuckydrawStatus == "已开奖") {
                    $("#LogoTitleDiv").html("已开奖");
                    $("#LogoDescDiv").html("已开奖，抽奖结束");

                    if (LuckyDrawResult != undefined) {
                        if (LuckyDrawResult.LuckyDrawResultID != "0" && LuckyDrawResult.LuckyDrawResultID != "") {
                            if (LuckyDrawMsg.ExpressType == "shop") {

                                if (LuckyDrawResult.IsGetPrize == "true") {
                                    $("#LogoTitleDiv").html("已中奖，已领取");
                                    $("#LogoDescDiv").html("您已中奖，您已到店消费或领取奖品");
                                }
                                else {
                                    $("#LogoTitleDiv").html("已中奖，待领取");
                                    $("#LogoDescDiv").html("您已中奖，等待到店消费或领取奖品");
                                }
                            }
                            else {
                                if (LuckyDrawResult.IsGetPrize == "true") {
                                    $("#LogoTitleDiv").html("已中奖，已发货");
                                    $("#LogoDescDiv").html("您已中奖，奖品商家已发货");
                                }
                                else {
                                    $("#LogoTitleDiv").html("已中奖，待发货");
                                    $("#LogoDescDiv").html("您已中奖，等待商家发货");
                                }
                            }
                        }
                    }
                }


                //领奖地址 
                if (LuckyDrawMsg.GetAddress != "" && LuckyDrawMsg.GaLongitude != "" && LuckyDrawMsg.GaLatitude != "") {
                    $("#GetAddressDiv").show();
                    $("#AddrDistanceDiv").html(_jsonReTxt.DistanceKm + "km");
                    $("#AddressDetailContent").html(LuckyDrawMsg.GetAddress);

                    //初始化所有的 地图导航URL连接
                    allMapURL(LuckyDrawMsg.GaLatitude, LuckyDrawMsg.GaLongitude, "领奖地址", LuckyDrawMsg.GetAddress);
                }
                else {
                    $("#GetAddressDiv").hide();
                }

                //-------------抽奖信息区域------//

                if (LuckyDrawMsg.LuckydrawTitle.length >= 22) {
                    LuckyDrawMsg.LuckydrawTitle = LuckyDrawMsg.LuckydrawTitle.substring(0, 22) + "…";
                }

                var myJsVal = " <li>";                myJsVal += " <div class=\"shop-msg\" onclick=\"window.location.href='../shop/index?SID=" + LuckyDrawMsg.SponsorShopID + "'\">";                myJsVal += "     <div class=\"shop-msg-left\">";                myJsVal += "         <img src=\"../Assets/Imgs/Icon/shop.png\" />";                myJsVal += "         " + LuckyDrawMsg.SponsorName + "";                myJsVal += "         <img src=\"../Assets/Imgs/Icon/arrows_right.png\" />";                myJsVal += "     </div>";                myJsVal += "     <div class=\"shop-msg-right\">";                if (LuckyDrawMsg.LuckydrawStatus == "未开奖") {                    myJsVal += "未开奖";
                }                else if (LuckyDrawMsg.LuckydrawStatus == "已开奖") {                    if (LuckyDrawResult != undefined) {                        if (LuckyDrawResult.AwardsItem != "" && LuckyDrawResult.AwardsItem != null) {                            myJsVal += "<span>您中奖啦</span>";                            if (LuckyDrawMsg.ExpressType == "shop") {                                if (LuckyDrawResult.IsGetPrize == "true") {                                    myJsVal += "&nbsp;已中奖-已领取";
                                }                                else {                                    myJsVal += "&nbsp;已中奖-待领取";
                                }                            }                            else {                                if (LuckyDrawResult.IsGetPrize == "true") {                                    myJsVal += "&nbsp;已中奖-已发货";
                                }                                else {                                    myJsVal += "&nbsp;已中奖-待发货";
                                }                            }                        }
                    }                    else {
                        myJsVal += "已开奖";
                    }
                }                myJsVal += "     </div>";                myJsVal += " </div>";                myJsVal += " <div class=\"goods-msg\" onclick=\"window.location.href='../mall/LuckyDrawDetail?lid=" + LuckyDrawMsg.LuckydrawID + "'\">";                myJsVal += "     <div class=\"goods-msg-left\">";                myJsVal += "         <img src=\"//" + LuckyDrawMsg.CoverImgUrl + "\" />";                myJsVal += "     </div>";                myJsVal += "     <div class=\"goods-msg-right\">";                myJsVal += "         <div class=\"goods-msg-title\">";                myJsVal += "             " + LuckyDrawMsg.LuckydrawTitle + "";                myJsVal += "         </div>";                myJsVal += "         <div class=\"goods-msg-extra\">";                if (LuckyDrawResult != undefined) {                    if (LuckyDrawResult.AwardsItem != "" && LuckyDrawResult.AwardsItem != null) {                        myJsVal += "奖项：<font color=\"#FF6A00\">" + LuckyDrawResult.AwardsItem + "</font><br />";                    }
                }                else {                    myJsVal += "奖项：<font color=\"#FF6A00\">未中奖</font><br />";
                }                if (LuckyDrawMsg.ExpressType == "shop") {                    myJsVal += "配送方式：到店消费或自取<br />";
                }                else {                    myJsVal += "配送方式：快递发货<br />";
                }                myJsVal += "开奖时间：" + LuckyDrawMsg.RealStartLuckyTime + "";                myJsVal += "         </div>";                myJsVal += "     </div>";                myJsVal += " </div>";                myJsVal += "</li>";
                //显示代码插入前台
                $("#LuckyDrawMsgUl").html(myJsVal);

                //----其他抽奖信息-----//
                var _StartLuckyType = "";
                if (LuckyDrawMsg.StartLuckyType == "JoinNumber") {
                    _StartLuckyType = "到人数开奖";
                }
                else if (LuckyDrawMsg.StartLuckyType == "OverTime") {
                    _StartLuckyType = "到时间开奖";
                }
                $("#StartLuckyType").html(_StartLuckyType);

                var _ExpressType = "";
                if (LuckyDrawMsg.ExpressType == "shop") {
                    _ExpressType = "到店消费或领取";
                }
                else if (LuckyDrawMsg.ExpressType == "express") {
                    _ExpressType = "快递发货";
                }
                $("#ExpressType").html(_ExpressType);

                //参与的条件限制 [ FavShop 已收藏店铺， OrderShop 订购过店铺商品， FavOrderShop 收藏店铺或订购过商品 ,NoLimit 不限制 ]
                var _JoinLimit = "";
                if (LuckyDrawMsg.JoinLimit == "NoLimit") {
                    _JoinLimit = "不限制";
                }
                else if (LuckyDrawMsg.JoinLimit == "FavShop") {
                    _JoinLimit = "已收藏店铺";
                }
                else if (LuckyDrawMsg.JoinLimit == "OrderShop") {
                    _JoinLimit = "订购过店铺商品";
                }
                else if (LuckyDrawMsg.JoinLimit == "FavOrderShop") {
                    _JoinLimit = "收藏店铺或订购过商品";
                }
                $("#JoinLimit").html(_JoinLimit);

                //初始化 到店领奖的 验证码 --包括重新生成
                if (LuckyDrawMsg.ExpressType == "shop" && LuckyDrawMsg.LuckydrawStatus == "已开奖" && LuckyDrawResult != undefined) {
                    if (LuckyDrawResult.AwardsItem != "" && LuckyDrawResult.AwardsItem != null) {

                        mLuckyDrawResultID = LuckyDrawResult.LuckyDrawResultID;

                        if (LuckyDrawResult.IsGetPrize == "false") {
                            $("#CheckCodeDiv").show();
                            initLuckyDrawVerifyCode('false');
                        }
                        else {
                            $("#CheckCodeDiv").hide();
                        }

                    }
                }

                //----中奖结果的发货信息-----//
                if (SendGoodsMsg != null && SendGoodsMsg != undefined && SendGoodsMsg != "") {

                    $("#ExpressReceiDiv").show();

                    var _expressMidContent = "快递名称：" + SendGoodsMsg.ExpressName + "，快递单号：" + SendGoodsMsg.ExpressNumber + "，联系电话：" + SendGoodsMsg.SendTelNumber + "，备注：" + SendGoodsMsg.SendGoodsMemo;

                    $("#ExpressMidContent").html(_expressMidContent);
                    $("#ExpressMidDate").html(SendGoodsMsg.WriteDate);
                }

                //------------下边客服条条--------//
                $("#CusServiceDiv").on("click", function () {
                    window.location.href = "tel:" + LuckyDrawMsg.LuckydrawMobile;
                });
                $("#ShopTelDiv").on("click", function () {
                    window.location.href = "tel:" + LuckyDrawMsg.LuckydrawMobile;
                });
                $("#ComplainShopDiv").on("click", function () {
                    window.location.href = "../Buyer/ComplainSubmit?SID=" + LuckyDrawMsg.SponsorShopID;
                });


                //构建商家店铺咨询进入IM在线客服系统 跳转 URL
                buildBuyerGoToImSysURL_ShopWap(mShopUserID, _jsonReTxt.BuyerUserID);


            }
        }
    });
}

/**
 * 初始化 到店领奖的 验证码 --包括重新生成
 * @param {any} pIsReSet 如果存在,是否重新生成 [false / true 重新生成]
 */
function initLuckyDrawVerifyCode(pIsReSet) {

    if (pIsReSet == "true") {
        $("#BtnReset").attr("disabled", true);
        $("#BtnReset").val("…生成中…");
    }

    //构造POST参数
    var dataPOST = {
        "Type": "2", "LuckyDrawResultID": mLuckyDrawResultID, "IsReSet": pIsReSet, "ShopUserID": mShopUserID,
    };
    console.log(dataPOST);
    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: mAjaxUrl + "?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("初始化到店领奖的验证码=" + reTxt);
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





//=======================打开地图导航=========================//


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

                    $("#CusServiceDiv").unbind();
                    //页脚下面的客服
                    $("#CusServiceDiv").on("click", function () {
                        window.location.href = encodeURI(mBuyerGoToImSysURL_ShopWap);
                    });
                    //$("#CusServiceA").attr("href", encodeURI(mBuyerGoToImSysURL_ShopWap));


                }
            }
        }
    });
}
