//=====================抽奖信息详情========================//

/**-----定义公共变量------**/

//AjaxURL
var mAjaxUrl = "../UserGoodsShop/LuckyDrawMsgDetail";
//抽奖ID
var mLuckydrawID = 0;

var mOctWapWebAddrDomain = "";

/**------初始化------**/
$(function () {

    mLuckydrawID = $("#hidLuckydrawID").val().trim();
    mOctWapWebAddrDomain = $("#hidOctWapWebAddrDomain").val().trim();

    //初始化商家端后台抽奖详情
    initLuckyDrawDetail();

});


/**
 * 初始化商家端后台抽奖详情
 * */
function initLuckyDrawDetail() {
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
            console.log("初始化后台抽奖详情=" + reTxt);
            if (reTxt != "") {

                var _jsonReTxt = JSON.parse(reTxt);

                //显示代码赋值到页面
                setValToXhtml(_jsonReTxt);
            }
        },
        error: function (xhr, errorTxt, status) {
            console.log("异步请求错误，errorTxt=" + errorTxt + " | status=" + status);
            return;
        }
    });
}

/**
 * 显示代码赋值到页面
 * @param {any} pJsonReTxt 初始化返回的Json对象
 */
function setValToXhtml(pJsonReTxt) {

    var LuckyDrawMsg = pJsonReTxt.LuckyDrawMsg;
    var LuckyDrawResultList = pJsonReTxt.LuckyDrawResultList;
    var LuckyDrawImgs = pJsonReTxt.LuckyDrawImgs;

    //状态
    var _StatusTtitle = "待审核";
    var _StatusDesc = "等待平台审核抽奖信息";
    if (LuckyDrawMsg.IsCheck == "pass") {
        _StatusTtitle = "审核通过"
        _StatusDesc = "抽奖信息审核通过";
    }
    else if (LuckyDrawMsg.IsCheck == "true") {
        _StatusTtitle = "审核未通过"
        _StatusDesc = LuckyDrawMsg.CheckReason;
    }
    $("#StatusTtitle").html(_StatusTtitle);
    $("#StatusDesc").html(_StatusDesc);

    $("#LuckydrawID").html(LuckyDrawMsg.LuckydrawID);

    var _StartLuckyType = "到人数开奖(JoinNumber)";
    if (LuckyDrawMsg.StartLuckyType == "OverTime") {
        _StartLuckyType = "到时间开奖(OverTime)";
    }
    $("#StartLuckyTypeVal").html(_StartLuckyType);
    $("#StartLuckyType").html(_StartLuckyType);

    $("#StartLuckyTime").html(LuckyDrawMsg.StartLuckyTime);
    $("#WriteDate").html(LuckyDrawMsg.WriteDate);

    $("#LuckydrawTitle").html("<span><b>标题：</b><a href=\"" + mOctWapWebAddrDomain + "/Mall/LuckyDrawDetailPreMobileIframe?LID=" + LuckyDrawMsg.LuckydrawID + "\" target=\"_blank\">" + LuckyDrawMsg.LuckydrawTitle + "</a></span>");
    $("#LuckydrawDesc").html("<span><b>抽奖描述：</b>" + LuckyDrawMsg.LuckydrawDesc + "</span>");

    $("#LuckydrawStatus").html(LuckyDrawMsg.LuckydrawStatus);

    var _JoinNumberMax = LuckyDrawMsg.JoinNumberMax;
    if (LuckyDrawMsg.JoinNumberMax == "0") {
        _JoinNumberMax = "无限制";
    }
    $("#JoinNumberMax").html(_JoinNumberMax);

    var _JoinLimit = "无限制(NoLimit)";
    if (LuckyDrawMsg.JoinLimit == "FavShop") {
        _JoinLimit = "已收藏店铺(FavShop)";
    }
    else if (LuckyDrawMsg.JoinLimit == "OrderShop") {
        _JoinLimit = "订购过店铺商品(OrderShop)";
    }
    else if (LuckyDrawMsg.JoinLimit == "FavOrderShop") {
        _JoinLimit = "收藏店铺或订购过商品(FavOrderShop)";
    }
    $("#LimitJoinType").html(_JoinLimit);

    var _IsPauseJoin = "参与中";
    if (LuckyDrawMsg.IsPauseJoin == "true") {
        _IsPauseJoin = "已暂停";
    }
    $("#IsPauseJoin").html(_IsPauseJoin);
    $("#StartLuckyNumber").html(LuckyDrawMsg.StartLuckyNumber);
    $("#RealStartLuckyTime").html(LuckyDrawMsg.RealStartLuckyTime);
    $("#JoinCount").html(pJsonReTxt.CountJoinTotalNumber + "人");

    //抽奖结果表
    var myJsVal = "";    for (var i = 0; i < LuckyDrawResultList.length; i++) {        var _isGetPrize = "";        if (LuckyDrawMsg.ExpressType == "express" && LuckyDrawResultList[i].IsGetPrize == "true") {            _isGetPrize = " -已发货";
        }        else if (LuckyDrawMsg.ExpressType == "shop" && LuckyDrawResultList[i].IsGetPrize == "true") {            _isGetPrize = " -已领取";
        }        myJsVal += "<tr>";        myJsVal += " <td>" + LuckyDrawResultList[i].AwardsItem + "</td>";        myJsVal += " <td>" + LuckyDrawResultList[i].AwardsContent + "<font color=\"red\">" + _isGetPrize + "</font> </td>";        myJsVal += " <td>";        myJsVal += "     <img src=\"" + LuckyDrawResultList[i].HeaderImg + "\" />" + LuckyDrawResultList[i].UserNick;        myJsVal += " </td>";        myJsVal += " <td>";        myJsVal += "" + LuckyDrawResultList[i].LinkMobile + "";        myJsVal += " </td>";        myJsVal += "</tr>";
    }    $("#TableTbodyResult").html(myJsVal);
    //奖项信息表
    var _xhtmlAwardsTable = xhtmlAwardsItemContentTotalTable(LuckyDrawMsg.AwardsItemArr, LuckyDrawMsg.AwardsContentArr, LuckyDrawMsg.WinnerTotalArr);
    $("#TableTbody").html(_xhtmlAwardsTable);

    $("#LuckydrawMobile").html(LuckyDrawMsg.LuckydrawMobile);

    var _ExpressType = "到店消费自取(shop)";
    if (LuckyDrawMsg._ExpressType == "express") {
        _ExpressType = "送货上门(express)";
    }
    $("#ExpressType").html(_ExpressType);

    $("#GetAddress").html(LuckyDrawMsg.GetAddress);


    //坐标位置
    if (LuckyDrawMsg.GaLongitude != "" && LuckyDrawMsg.GaLatitude != "") {

        //打开腾讯地图
        var _urlMap = "https://apis.map.qq.com/uri/v1/marker?marker=coord:" + LuckyDrawMsg.GaLatitude + "," + LuckyDrawMsg.GaLongitude + ";title:领奖位置;addr:" + LuckyDrawMsg.GetAddress + "&referer=myapp";

        $("#Loction").html("经度-" + LuckyDrawMsg.GaLongitude + "，纬度-" + LuckyDrawMsg.GaLatitude + "，<a href=\"" + _urlMap + "\" target=\"_blank\">地图中查看</a>");
    }

    //构造抽奖图片
    var myJsVal = "";    for (var i = 0; i < LuckyDrawImgs.length; i++) {        myJsVal += " <a href=\"//" + LuckyDrawImgs[i].ImgURL + "\" target=\"_blank\"><img src=\"//" + LuckyDrawImgs[i].ImgURL + "\" /></a>";
    }    $("#LuckyDrawImgsList").html(myJsVal);


    $("#SponsorShopID").html("<a href=\"../UserGoodsShopPage/ShopMsgDetail?UserID=" + LuckyDrawMsg.ShopUserID + "\"  target=\"_blank\">" + LuckyDrawMsg.SponsorShopID + " &nbsp;(<b>" + LuckyDrawMsg.SponsorName + "</b>)</a>")
    $("#ShopUserID").html(LuckyDrawMsg.ShopUserID);
}

/**
 * 构造奖项奖品数量 表格显示代码 
 * @param {any} pAwardsItemArr
 * @param {any} pAwardsContentArr
 * @param {any} pWinnerTotalArr
 */
function xhtmlAwardsItemContentTotalTable(pAwardsItemArr, pAwardsContentArr, pWinnerTotalArr) {
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

    //循环构造
    var _xhtml = "";
    for (var i = 0; i < AwardsItemArr.length; i++) {
        _xhtml += "<tr>";        _xhtml += "<td>" + AwardsItemArr[i] + "</td>";        _xhtml += "<td>" + AwardsContentArr[i] + "</td>";        _xhtml += "<td>" + WinnerTotalArr[i] + "</td>";    }
    return _xhtml;
}

