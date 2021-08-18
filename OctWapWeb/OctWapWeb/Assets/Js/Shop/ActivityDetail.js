//===================活动详情==========================//

/**-----定义公共变量-----**/

//AjaxURL
var mAjaxUrl = "../ShopAjax/ActivityDetail";

var mActivityID = 0;
var mShopUserID = "0";
var mShopID = "0";
var mBuyerUserID = "0";

var mJsonActivityJoin = null; //参与用户列表Json对象

var mBuyerMobile = ""; //买家绑定的手机号


//构建商家店铺咨询进入IM在线客服系统 跳转 URL
var mBuyerGoToImSysURL_ShopWap = "";

/**------初始化------**/
$(function () {

    mActivityID = $("#hidActivityID").val().trim();
    mBuyerUserID = $("#hidBuyerUserID").val().trim();

    //初始化活动详情
    initActivityDetail();

    //初始化复制当前连接
    initCopyCurrentALink();
});

/**
 * 初始化活动详情
 * */
function initActivityDetail() {
    //构造POST参数
    var dataPOST = {
        "Type": "1", "ActivityID": mActivityID,
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

                var ActivityMsg = _jsonReTxt.ActivityMsg;
                var ActivityImgs = _jsonReTxt.ActivityImgs;
                var ActivityJoin = _jsonReTxt.ActivityJoin;
                var UserMsgCurrent = _jsonReTxt.UserMsgCurrent;

                //参与人数
                var _activityJoinNumber = "0";
                if (ActivityJoin != undefined) {
                    _activityJoinNumber = ActivityJoin.length;
                }

                //存储买家手机号
                mBuyerMobile = UserMsgCurrent.BuyerMobile;
                mShopUserID = ActivityMsg.ShopUserID;
                mShopID = ActivityMsg.ShopID;

                mJsonActivityJoin = _jsonReTxt.ActivityJoin;
                if (mJsonActivityJoin == null) {
                    $("#ActivityJoinDiv").hide();
                }
                else {
                    $("#ActivityJoinDiv").show();
                }


                //--------初始化状态条-------------//
                if (_jsonReTxt.ActivityStatus != "") {

                    $("#ActivityStatus").html("状态：" + _jsonReTxt.ActivityStatus);
                }
                else {

                }

                if (UserMsgCurrent.UserNick != "") {
                    $("#BtnApply").attr("disabled", true);
                    $("#BtnApply").val("你已报名");
                    $("#BtnApply").css("background", "#9B9B9B");
                }

                if (ActivityMsg.IsJoinCheck == "true" && UserMsgCurrent.UserNick != "") {
                    $("#CheckCodeDiv").show();
                }
                else {
                    $("#CheckCodeDiv").hide();
                }

                //显示当前正在参与活动用户
                if (UserMsgCurrent.IsChecked == "true" && UserMsgCurrent.UserNick != "") {
                    $("#UserJoiningDiv").show();

                    $("#CheckCodeDiv").hide();

                    //显示代码
                    $("#UserJoiningName").html("<img src=\"" + UserMsgCurrent.HeaderImg + "\" />" + UserMsgCurrent.UserNick + "");
                }
                else {
                    $("#UserJoiningDiv").hide();
                }

                if (_jsonReTxt.ActivityStatus.indexOf("已结束") >= 0) {
                    $("#UserJoiningDiv").hide();
                }

                //报名按钮状态
                if (_jsonReTxt.ActivityStatus.indexOf("可报名") < 0 && _jsonReTxt.ActivityStatus.indexOf("报名中") < 0) {
                    $("#BtnApply").attr("disabled", true);
                    $("#BtnApply").css("background", "#9B9B9B");
                }

                if (ActivityMsg.AcTitle.length > 20) {
                    ActivityMsg.AcTitle = ActivityMsg.AcTitle.substring(0, 20) + "…";
                }

                $("#PageAcTitle").html(ActivityMsg.AcTitle + "-活动详情");

                if (ActivityMsg.AcSketch.length > 40) {
                    ActivityMsg.AcSketch = ActivityMsg.AcSketch.substring(0, 40) + "…";
                }

                if (ActivityMsg.LimitNumber <= 0) {
                    ActivityMsg.LimitNumber = "无限制";
                }
                else {
                    ActivityMsg.LimitNumber = ActivityMsg.LimitNumber + "人";
                }

                var _IsJoinCheck = "是";
                if (ActivityMsg.IsJoinCheck == "false") {
                    _IsJoinCheck = "否";
                }

                var _AcType = "线下：";
                if (ActivityMsg.AcType == "OnLine") {
                    _AcType = "线上：";
                }

                $("#AcTitle").html(_AcType + ActivityMsg.AcTitle);
                $("#AcSketch").html(ActivityMsg.AcSketch);

                //其他信息显示代码
                var _xhtmlAcStatus = "当前报名：" + _activityJoinNumber + "， 活动人数上限：" + ActivityMsg.LimitNumber + "，参与验证：" + _IsJoinCheck + "<br />活动时间：" + ActivityMsg.StartDate.replace(":00", "") + " 至 " + ActivityMsg.EndDate.replace(":00", "");
                $("#AcStatus").html(_xhtmlAcStatus);

                //线下活动
                if (ActivityMsg.AcType == "OffLine") {
                    $("#LocationAddress").show();

                    if (_jsonReTxt.DistanceKm != undefined) {
                        $("#DistanceKm").html(_jsonReTxt.DistanceKm + "km");
                    }

                    var _AcAddress = ActivityMsg.RegionNameArr + "_" + ActivityMsg.AcAddress;
                    $("#AcAddress").html(_AcAddress);

                    //初始化所有的 地图导航URL连接
                    allMapURL(ActivityMsg.Latitude, ActivityMsg.Longitude, "活动地址", _AcAddress);

                }
                else {
                    $("#LocationAddress").hide();
                }

                //构造描述显示内容
                var _xhtmlAcImgsDesc = "";
                for (var i = 0; i < ActivityImgs.length; i++) {
                    _xhtmlAcImgsDesc += "<a href=\"//" + ActivityImgs[i].ImgURL + "\"><img src=\"//" + ActivityImgs[i].ImgURL + "\" /></a>";                }
                _xhtmlAcImgsDesc += "<div class=\"activity-desc\">" + ActivityMsg.AcDesc + "</div>";
                //显示代码插入前台
                $("#AcImgsDesc").html(_xhtmlAcImgsDesc);

                //----------显示参与用户信息------------//
                if (_jsonReTxt.ActivityJoin != undefined) {
                    xhtmlActivityJoinMsg(_jsonReTxt.ActivityJoin);
                }

                //----初始化 活动参与 验证码 --包括重新生成-----//
                if (ActivityMsg.IsJoinCheck == "true") {
                    initActivityJoinVerifyCode("false");
                }


                //加载店铺条相关信息(前端) - 如:商品详情页的店铺信息
                loadShopBarMsg();

            }
        }
    });
}

/**
 * 构造显示代码 加入的用户信息列表
 * @param {any} pJsonActivityJoin 加入的用户信息列表Json对象
 */
function xhtmlActivityJoinMsg(pJsonActivityJoin) {

    $("#SumJoinUser").html(pJsonActivityJoin.length);
    var myJsVal = "";    for (var i = 0; i < pJsonActivityJoin.length; i++) {        if (i > 34) {            break;
        }        myJsVal += "<a href=\"" + pJsonActivityJoin[i].HeaderImg + "\"><img alt=\"" + pJsonActivityJoin[i].UserNick + "\" src=\"" + pJsonActivityJoin[i].HeaderImg + "\" /></a>";
    }    //显示代码插入前台    $("#ActivityJoinUserList").html(myJsVal);}

/**
 * 构造参与活动的用户列表 显示代码
 * */
function xhtmlActivityJoinUserListWin() {

    if (mJsonActivityJoin == null) {
        return "";
    }

    var myJsVal = "";    for (var i = 0; i < mJsonActivityJoin.length; i++) {        myJsVal += "<a href=\"" + mJsonActivityJoin[i].HeaderImg + "\"><img alt=\"" + mJsonActivityJoin[i].UserNick + "\" src=\"" + mJsonActivityJoin[i].HeaderImg + "\" /></a>";
    }
    return myJsVal;
}

/**
 * 立即报名
 * */
function addActivityJoin() {


    var LinkMobile = $("#LimitNumberWin").val().trim();

    if (LinkMobile == "") {
        toastWinToDiv("【联系手机号】不能为空！", "SliderDownWin");
        return;
    }

    //构造POST参数
    var dataPOST = {
        "Type": "2", "ActivityID": mActivityID, "LinkMobile": LinkMobile,
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
            console.log("立即报名=" + reTxt);

            //加载提示
            $("#BtnSubmit").attr("disabled", false);
            $("#BtnSubmit").val("提交报名");

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
                        //重新加载页面
                        window.location.reload();
                    });

                    return;
                }
            }
        }
    });
}


//==============报名窗口==============//
/**
 * -------打开报名窗口------
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
 * 得到报名窗口显示代码
 */
function getJoinWinHtml() {

    var _html = $("#WinJoinActivity").html();

    $("#WinJoinActivity").html("");
    $("#WinJoinActivity").remove();
    $("body").remove("#WinJoinActivity");

    mJoinWinHtml = "";

    return _html
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
    $("#WinUserList").html(xhtmlActivityJoinUserListWin());

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


/**
 * 初始化 活动参与 验证码 --包括重新生成
 * @param {any} pIsReSet 如果存在,是否重新生成 [false / true 重新生成]
 */
function initActivityJoinVerifyCode(pIsReSet) {

    if (pIsReSet == "true") {
        $("#BtnReset").attr("disabled", true);
        $("#BtnReset").val("…生成中…");
    }

    //构造POST参数
    var dataPOST = {
        "Type": "3", "ActivityID": mActivityID, "IsReSet": pIsReSet, "ShopUserID": mShopUserID,
    };
    console.log(dataPOST);
    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: mAjaxUrl + "?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("初始化活动参与验证码=" + reTxt);
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

                //页脚下面的客服，店铺链接,投诉
                $("#CusServiceAFooter").on("click", function () {
                    window.location.href = "tel:" + ShopMsg.ShopMobile;
                });
                $("#TelShopPhoneFooter").on("click", function () {
                    window.location.href = "tel:" + ShopMsg.ShopMobile;
                });
                $("#ComplainShopFooter").on("click", function () {
                    window.location.href = " ../Buyer/ComplainSubmit?SID=" + ShopMsg.ShopID;
                });


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

                    $("#CusServiceAFooter").unbind();
                    //页脚下面的客服
                    $("#CusServiceAFooter").on("click", function () {
                        window.location.href = encodeURI(mBuyerGoToImSysURL_ShopWap);
                    });
                    $("#CusServiceA").attr("href", encodeURI(mBuyerGoToImSysURL_ShopWap));


                }


            }

        }
    });
}

