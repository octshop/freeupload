//===================抽奖详情=============================//

/**-----定义公共变量-----**/

//AjaxURL
var mAjaxUrl = "../MallAjax/LuckyDrawDetail";

//抽奖ID
var mLuckydrawID = 0;
//买家UserID
var mBuyerUserID = "0";
//买家绑定的手机号
var mBuyerMobile = "";

var mShopID = "";
var mShopUserID = "";

//参与抽奖信息Json对象
var mJsonLuckyDrawJoinMsgList = "";

//总的奖项数量
var mSumAwardsItem = 0;
//总的中奖人数
var mSumWinnerTotal = 0;

//构建商家店铺咨询进入IM在线客服系统 跳转 URL
var mBuyerGoToImSysURL_ShopWap = "";


/**------初始化------**/
$(function () {

    mLuckydrawID = $("#hidLuckydrawID").val().trim();
    mBuyerUserID = $("#hidBuyerUserID").val().trim();

    //初始化抽奖详情
    initLuckyDrawMsg();

    //初始化抽奖参与信息列表
    initloadLuckyDrawJoinMsgList();

    //初始化复制当前连接
    initCopyCurrentALink();

});

/**
 * 初始化抽奖详情
 * */
function initLuckyDrawMsg() {

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
            console.log("初始化活动详情=" + reTxt);
            if (reTxt != "") {
                var _jsonReTxt = JSON.parse(reTxt);

                var LuckyDrawMsg = _jsonReTxt.LuckyDrawMsg;
                var LuckyDrawImgs = _jsonReTxt.LuckyDrawImgs;
                var LuckyDrawJoinMsgList = _jsonReTxt.LuckyDrawJoinMsgList;
                var LuckyDrawResultList = _jsonReTxt.LuckyDrawResultList

                mShopUserID = LuckyDrawMsg.ShopUserID;
                mShopID = LuckyDrawMsg.SponsorShopID;

                mBuyerMobile = _jsonReTxt.BuyerBindMobile

                $("#SponsorName").html(LuckyDrawMsg.SponsorName);
                $("#SponsorNameB").html(LuckyDrawMsg.SponsorName);
                $("#LuckydrawShopNameDiv").on("click", function () {
                    window.location.href = "../shop/index?sid=" + LuckyDrawMsg.SponsorShopID;
                });

                $("#CoverImgUrlLabel").attr("src", "//" + LuckyDrawMsg.CoverImgUrl);
                $("#LuckydrawTitle").html(LuckyDrawMsg.LuckydrawTitle);

                $("#PageTitle").html(LuckyDrawMsg.LuckydrawTitle + "-抽奖详情");

                //构造奖项，奖品，数量显示代码
                var _xhtml = xhtmlAwardsItemContentWinnerTotal(LuckyDrawMsg.AwardsItemArr, LuckyDrawMsg.AwardsContentArr, LuckyDrawMsg.WinnerTotalArr);
                $("#AwardsItemContentWinnerTotal").html(_xhtml);

                var _xhtmlStartLuckyType = "";
                if (LuckyDrawMsg.StartLuckyType == "JoinNumber") {
                    _xhtmlStartLuckyType = "达到 <font color=\"red\">" + LuckyDrawMsg.StartLuckyNumber + "</font> 人 自动开奖";
                }
                else if (LuckyDrawMsg.StartLuckyType == "OverTime") {
                    _xhtmlStartLuckyType = LuckyDrawMsg.StartLuckyTime + " 自动开奖";
                }
                $("#StartLuckyType").html(_xhtmlStartLuckyType);

                //买家是否已参与,配送方式 
                var _xhtmlLuckyType = "";
                if (_jsonReTxt.IsJoin.toLowerCase() == "true") {
                    _xhtmlLuckyType = "<span class=\"user-joined-span\">你已参与</span>";
                }
                else {
                    _xhtmlLuckyType = "<span class=\"user-joined-span\" style=\"display:none\">你已参与</span>";
                }
                if (LuckyDrawMsg.ExpressType == "express") {
                    _xhtmlLuckyType += "<span class=\"user-joined-span\">奖品:快递发货</span>";
                    $("#ExpressTypeSpan").html("奖品:快递发货");
                }
                else if (LuckyDrawMsg.ExpressType == "shop") {
                    _xhtmlLuckyType += "<span class=\"express-type-span\">奖品:到店消费或领取</span>";
                    $("#ExpressTypeSpan").html("奖品:到店消费或领取");
                    $("#LuckydrawGetAddr").show();
                }
                $("#LuckydrawExtra").html(_xhtmlLuckyType);

                //----中间奖品信息----//
                $("#SumAwardsItem").html(mSumAwardsItem);
                $("#SumWinnerTotal").html(mSumWinnerTotal);

                //领取奖品地址
                $("#GetAddressSpan").html(LuckyDrawMsg.GetAddress);

                //奖品详情显示
                var _detailContent = "";
                for (var i = 0; i < LuckyDrawImgs.length; i++) {
                    _detailContent += "<img src=\"//" + LuckyDrawImgs[i].ImgURL + "\" />";                }
                _detailContent += "<br /><br />" + LuckyDrawMsg.LuckydrawDesc;
                $("#LuckydrawDetailContent").html(_detailContent);


                //初始化所有的 地图导航URL连接
                if (LuckyDrawMsg.ExpressType == "shop") {
                    allMapURL(LuckyDrawMsg.GaLatitude, LuckyDrawMsg.GaLongitude, "领奖地址", LuckyDrawMsg.GetAddress);
                }

                if (_jsonReTxt.IsJoin == "True") {
                    $("#btn-join").hide();
                    $("#btn-joined").show();

                    $(".user-joined-span").show();
                }
                else {
                    $("#btn-join").show();
                    $("#btn-joined").hide();
                }
                //中奖结果 
                if (LuckyDrawResultList != undefined && LuckyDrawMsg.LuckydrawStatus == "已开奖") {

                    $("#btn-join").hide();
                    $("#btn-joined").hide();
                    $("#ResultLuckyDraw").show();

                    //构造中奖结果
                    var _xhtmlResult = "";
                    for (var j = 0; j < LuckyDrawResultList.length; j++) {
                        _xhtmlResult += "<a href=\"" + LuckyDrawResultList[j].HeaderImg + "\"><img src=\"" + LuckyDrawResultList[j].HeaderImg + "\" /><br />" + LuckyDrawResultList[j].LinkMobile + "</a>";
                    }
                    $("#ResultUserList").html(_xhtmlResult);

                    $("#ResultCountB").html(LuckyDrawResultList.length);
                }

                //加载店铺条相关信息(前端) - 如:商品详情页的店铺信息
                loadShopBarMsg();

            }
        }
    });

}

/**
 * 构造奖项，奖品，数量显示代码
 * @param {any} pAwardsItemArr
 * @param {any} pAwardsContentArr
 * @param {any} pWinnerTotalArr
 */
function xhtmlAwardsItemContentWinnerTotal(pAwardsItemArr, pAwardsContentArr, pWinnerTotalArr) {

    //分割数组
    var AwardsItemArr = new Array();
    var AwardsContentArr = new Array();
    var WinnerTotalArr = new Array();

    if (pAwardsItemArr.indexOf("^") >= 0) {
        AwardsItemArr = pAwardsItemArr.split('^');
        AwardsContentArr = pAwardsContentArr.split('^');
        WinnerTotalArr = pWinnerTotalArr.split('^');
    }
    else {
        AwardsItemArr[0] = pAwardsItemArr;
        AwardsContentArr[0] = pAwardsContentArr;
        WinnerTotalArr[0] = pWinnerTotalArr;
    }

    mSumAwardsItem = AwardsItemArr.length;

    //循环构造显示代码
    var xhtml = "";
    for (var i = 0; i < AwardsItemArr.length; i++) {
        xhtml += AwardsItemArr[i] + "：" + AwardsContentArr[i] + "<span> 数量：" + WinnerTotalArr[i] + "</span><br />";

        mSumWinnerTotal += parseInt(WinnerTotalArr[i]);

    }
    return xhtml;
}

/**
 * 参加抽奖,添加加入抽奖信息
 * */
function addLuckyDrawJoinMsg() {

    var LinkMobile = $("#LimitNumberWin").val().trim();

    if (LinkMobile == "") {
        toastWinToDiv("【联系手机号】不能为空！", "SliderDownWin");
        return;
    }

    //构造POST参数
    var dataPOST = {
        "Type": "2", "LuckydrawID": mLuckydrawID, "LinkMobile": LinkMobile,
    };
    console.log(dataPOST);

    //加载提示
    $("#BtnSubmit").attr("disabled", true);
    $("#BtnSubmit").val("…提交中…");

    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: mAjaxUrl + "?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("参与抽奖=" + reTxt);

            //加载提示
            $("#BtnSubmit").attr("disabled", false);
            $("#BtnSubmit").val("立即参与");

            if (reTxt != "") {
                var _jsonReTxt = JSON.parse(reTxt);

                if (_jsonReTxt.ErrMsg != "" && _jsonReTxt.ErrMsg != null && _jsonReTxt.ErrMsg != undefined) {

                    toggleSilderDownWin();
                    toastWin(_jsonReTxt.ErrMsg);

                    return;
                }

                if (_jsonReTxt.Msg != "" && _jsonReTxt.Msg != null && _jsonReTxt.Msg != undefined) {

                    toggleSilderDownWin();

                    toastWinCb(_jsonReTxt.Msg, function () {

                        $("#btn-join").hide();
                        $("#btn-joined").show();
                        $(".user-joined-span").show();

                        //重新加载页面
                        window.location.reload();
                    });

                    return;
                }
            }
        }
    });

}

/**
 * 初始化抽奖参与信息列表
 * */
function initloadLuckyDrawJoinMsgList() {
    //构造POST参数
    var dataPOST = {
        "Type": "4", "LuckydrawID": mLuckydrawID,
    };
    console.log(dataPOST);

    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: mAjaxUrl + "?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("参与抽奖=" + reTxt);

            if (reTxt != "") {
                var _jsonReTxt = JSON.parse(reTxt);

                mJsonLuckyDrawJoinMsgList = _jsonReTxt;
                LuckyDrawJoinMsgList = _jsonReTxt.LuckyDrawJoinMsgList;

                //页面显示参与用户
                $("#JoinCountB").html(_jsonReTxt.LuckyDrawJoinMsgCount);

                var _xhtml = "";
                for (var i = 0; i < LuckyDrawJoinMsgList.length; i++) {

                    if (i >= 34) {
                        break;
                    }

                    _xhtml += "<a href=\"" + LuckyDrawJoinMsgList[i].HeaderImg + "\"><img alt=\"" + LuckyDrawJoinMsgList[i].UserNick + "\" src=\"" + LuckyDrawJoinMsgList[i].HeaderImg + "\" /></a>";

                }
                $("#JoinUserList").html(_xhtml);

            }
        }
    });

}


/**
 * 构造参与抽奖的用户列表 显示代码
 * */
function xhtmlLuckyDrawJoinUserListWin() {

    if (mJsonLuckyDrawJoinMsgList == null) {
        return "";
    }

    var LuckyDrawJoinMsgList = mJsonLuckyDrawJoinMsgList.LuckyDrawJoinMsgList;
    if (LuckyDrawJoinMsgList == undefined) {
        return "";
    }

    var myJsVal = "";    for (var i = 0; i < LuckyDrawJoinMsgList.length; i++) {        myJsVal += "<a href=\"" + LuckyDrawJoinMsgList[i].HeaderImg + "\"><img alt=\"" + LuckyDrawJoinMsgList[i].UserNick + "\" src=\"" + LuckyDrawJoinMsgList[i].HeaderImg + "\" /></a>";
    }
    return myJsVal;
}


//==============参与用户窗口==============//
/**
 * -------打开参与用户窗口------
 */
var mJoinUserWinHtml = "";
function openJoinUserWin() {

    if (mJoinUserWinHtml == "") {

        mJoinUserWinHtml = getJoinUserWinHtml();
    }
    //初始化SliderDown窗口
    initSilderDownWin(600, mJoinUserWinHtml);

    //构造参与活动的用户列表 显示代码
    $("#WinUserList").html(xhtmlLuckyDrawJoinUserListWin());

    toggleSilderDownWin();
}

/**
 * 得到报名窗口显示代码
 */
function getJoinUserWinHtml() {

    var _html = $("#WinJoinUserActivity").html();

    $("#WinJoinUserActivity").html("");
    $("#WinJoinUserActivity").remove();
    $("body").remove("#WinJoinUserActivity");

    mJoinUserWinHtml = "";

    return _html
}


//==============参与抽奖窗口==============//
/**
 * -------打开参与抽奖窗口------
 */
var mJoinWinHtml = "";
function openJoinWin() {

    if (mBuyerUserID == "0" || mBuyerUserID == "") {
        toastWinCb("请选择登录！", function () {
            //跳转到登录页面
            window.location.href = "../Login/Buyer?BackUrl=" + window.location.href + "";
        });
        return;
    }


    if (mJoinWinHtml == "") {

        mJoinWinHtml = getJoinWinHtml();
    }
    //初始化SliderDown窗口
    initSilderDownWin(600, mJoinWinHtml);

    toggleSilderDownWin();

    $("#LimitNumberWin").val(mBuyerMobile);
}

/**
 * 得到参与抽奖窗口显示代码
 */
function getJoinWinHtml() {

    var _html = $("#WinJoinActivity").html();

    $("#WinJoinActivity").html("");
    $("#WinJoinActivity").remove();
    $("body").remove("#WinJoinActivity");

    mJoinWinHtml = "";

    return _html
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
 * ---------加载店铺条相关信息(前端) - 如:商品详情页的店铺信息-----------
 * */
function loadShopBarMsg() {

    //构造POST参数
    var dataPOST = {
        "Type": "2", "ShopID": mShopID, "ShopUserID": mShopUserID, "IsLoadGoods": "true",
    };

    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: "../ShopAjax/ShopMsg?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("加载店铺条相关信息(前端)=" + reTxt);
            if (reTxt != "") {
                var _jsonReTxt = JSON.parse(reTxt);

                var ShopFavCount = _jsonReTxt.ShopFavCount;
                var ShopAppScoreList = _jsonReTxt.ShopAppScoreList;
                var PreListGoodsMsg = _jsonReTxt.PreListGoodsMsg;
                var ShopMsg = _jsonReTxt.ShopMsg;

                $("#ShopHeaderImgDiv").html("<a href=\"javascript:void(0)\"><img src=\"//" + ShopMsg.ShopHeaderImg + "\" /></a>");

                //------店铺名称区----//
                var ShopLabelArr = splitStringJoinChar(ShopMsg.ShopLabelArr);

                var myJsValName = "";
                myJsValName += " <a href=\"javascript:void(0)\">" + ShopMsg.ShopName + "</a>";

                for (var m = 0; m < ShopLabelArr.length; m++) {
                    myJsValName += "<span class=\"shop-label\">" + ShopLabelArr[m] + "</span>";
                }

                myJsValName += "<span class=\"shop-arrow\">&nbsp;</span>";
                $("#ShopNameDiv").html(myJsValName);

                //店铺评价
                $("#ShopAppraiseDiv").html("综合: <b>" + ShopAppScoreList.ShopScoreAvg + "</b>物流: <b>" + ShopAppScoreList.ExpressScoreAvg + "</b>商品: <b>" + ShopAppScoreList.ConformityScoreAvg + "</b>服务: <b>" + ShopAppScoreList.AttitudeScoreAvg + "</b>配送: <b>" + ShopAppScoreList.DeliverymanScoreAvg + "</b>");

                $("#FavAttenB").html(ShopFavCount);

                $("#ShopMsgNameTitleDiv").on("click", function () {
                    window.location.href = "../Shop/index?SID=" + ShopMsg.ShopID;
                });

                $("#MajorGoodsDiv").html(ShopMsg.MajorGoods);
                $("#MajorGoodsDiv").css("padding-bottom", "8px");

                //商品预览列表
                var myJsValPreGoods = "";
                for (var k = 0; k < PreListGoodsMsg.length; k++) {

                    if (PreListGoodsMsg[k].GoodsTitle.length > 5) {
                        PreListGoodsMsg[k].GoodsTitle = PreListGoodsMsg[k].GoodsTitle.substring(0, 5)
                    }

                    myJsValPreGoods += "<li><a href=\"../Goods/GoodsDetail?GID=" + PreListGoodsMsg[k].GoodsID + "\">";
                    myJsValPreGoods += "<img src=\"//" + PreListGoodsMsg[k].CoverImgPath + "\" /><br />";
                    myJsValPreGoods += "" + PreListGoodsMsg[k].GoodsTitle + "";
                    myJsValPreGoods += "</a></li>";
                }
                $("#PreListGoodsMsgUl").html(myJsValPreGoods);

                //客服，进店
                $("#CusServiceA").attr("href", "tel:" + ShopMsg.ShopMobile);
                $("#GoShopA").attr("href", "../Shop/index?SID=" + ShopMsg.ShopID);

                //构建商家店铺咨询进入IM在线客服系统 跳转 URL
                buildBuyerGoToImSysURL_ShopWap(mShopUserID, mBuyerUserID);

            }
            else {
                $("#ShopMsgBar").hide();
            }
        }
    });
}



/**
 * 初始化复制当前连接
 * */
function initCopyCurrentALink() {
    //得到按钮标签
    var btn = document.getElementById('BtnCopyALink');
    //实例化ClipBoard对象
    var clipboard = new ClipboardJS(btn);

    clipboard.on('success', function (e) {
        console.log(e);
        toastWin("复制成功,请将内容粘贴发送给好友！", 3000);
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

                    //$("#CusServiceAFooter").unbind();
                    ////页脚下面的客服
                    //$("#CusServiceAFooter").on("click", function () {
                    //    window.location.href = encodeURI(mBuyerGoToImSysURL_ShopWap);
                    //});
                    $("#CusServiceA").attr("href", encodeURI(mBuyerGoToImSysURL_ShopWap));


                }
            }
        }
    });
}
