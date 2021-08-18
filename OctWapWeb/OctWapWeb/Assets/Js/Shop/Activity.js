//===============店铺活动优惠======================//

/**------定义公共变量----**/

//AjaxURL
var mAjaxUrl = "../ShopAjax/Activity";

var mShopID = ""; //店铺ID
var mBuyerUserID = ""; //买家UserID

//构建商家店铺咨询进入IM在线客服系统 跳转 URL
var mBuyerGoToImSysURL_ShopWap = "";


/**------初始化------**/
$(function () {

    mShopID = $("#hidShopID").val().trim();
    mBuyerUserID = $("#hidBuyerUserID").val().trim();

    //初始化 店铺信息条，店铺首页顶部条信息
    initShopMsgTopBarItem();

    //加载活动页信息 ,活动，抽奖
    loadActivityPageMsg();

    //加载优惠券指定记录条数
    loadShopCouponsTopList();


});

/**
 * 加载活动页信息 ,活动，抽奖
 * */
function loadActivityPageMsg() {

    //构造POST参数
    var dataPOST = {
        "Type": "1", "ShopID": mShopID,
    };

    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: mAjaxUrl + "?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("加载活动页信息 ,活动，抽奖=" + reTxt);
            if (reTxt != "") {
                var _jsonReTxt = JSON.parse(reTxt);

                var ActivityMsgList = _jsonReTxt.ActivityMsg.ActivityMsgList;
                var LuckyDrawMsgList = _jsonReTxt.LuckyDrawMsg.LuckyDrawMsgList;

                if (ActivityMsgList != undefined) {
                    //构造显示代码
                    var myJsValAc = "";
                    for (var i = 0; i < ActivityMsgList.length; i++) {

                        myJsValAc += "<div class=\"activity-shop-item\" onclick=\"window.location.href='../Shop/ActivityDetail?AID=" + ActivityMsgList[i].ActivityID + "'\">";
                        myJsValAc += " <div class=\"activity-shop-item-1\" style=\"width: 80px;\">";

                        if (ActivityMsgList[i].AcType == "OffLine") {
                            myJsValAc += "线下活动";
                        }
                        else {
                            myJsValAc += "线上活动";
                        }

                        myJsValAc += " </div>";
                        myJsValAc += " <div class=\"activity-shop-item-2\" style=\"width: 100%;\">";
                        myJsValAc += "" + ActivityMsgList[i].AcTitle + "";
                        myJsValAc += " </div>";
                        myJsValAc += " <div class=\"activity-shop-item-3\">";
                        myJsValAc += "     <img src=\"../Assets/Imgs/Icon/arrows_right_black.png\" />";
                        myJsValAc += " </div>";
                        myJsValAc += "</div>";
                    }
                    //显示代码插入前台
                    $("#ActivityContentList").html(myJsValAc);
                }

                if (LuckyDrawMsgList != undefined) {
                    var myJsValLuckyDraw = "";
                    for (var j = 0; j < LuckyDrawMsgList.length; j++) {
                        myJsValLuckyDraw += "<div class=\"activity-shop-item\" onclick=\"window.location.href='../Mall/LuckyDrawDetail?LID=" + LuckyDrawMsgList[j].LuckydrawID + "'\">";
                        myJsValLuckyDraw += " <div class=\"withdraw-title\">";
                        myJsValLuckyDraw += "" + LuckyDrawMsgList[j].LuckydrawTitle + "";
                        myJsValLuckyDraw += " </div>";
                        myJsValLuckyDraw += " <div class=\"activity-shop-item-3\">";
                        myJsValLuckyDraw += "     <img src=\"../Assets/Imgs/Icon/arrows_right_black.png\" />";
                        myJsValLuckyDraw += " </div>";
                        myJsValLuckyDraw += "</div>";
                    }
                    //显示代码插入前台
                    $("#LuckyDrawDiv").html(myJsValLuckyDraw);
                }
                

            }
        }
    });

}


/**
 * 加载优惠券指定记录条数
 * */
function loadShopCouponsTopList() {

    //构造POST参数
    var dataPOST = {
        "Type": "3", "ShopID": mShopID, "LoadNum": "20",
    };

    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: "../ShopAjax/Index?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("加载优惠券指定记录条数=" + reTxt);
            if (reTxt != "") {

                var _jsonReTxt = JSON.parse(reTxt);

                var CouponsMsgList = _jsonReTxt.CouponsMsgList;

                //构造显示代码
                var myJsVal = "";
                for (var i = 0; i < CouponsMsgList.length; i++) {

                    myJsVal += "<div class=\"activity-item\" onclick=\"window.location.href='../Buyer/CouponsDetail?CID=" + CouponsMsgList[i].CouponsID + "'\">";
                    myJsVal += " <div class=\"activity-item-1\" style=\"width: 180px;\">";

                    if (CouponsMsgList[i].UseDiscount > 0) {
                        myJsVal += CouponsMsgList[i].UseDiscount + "折券";
                    }
                    else {
                        myJsVal += "&#165;" + formatNumberDotDigit(CouponsMsgList[i].UseMoney, 2);
                    }
                    myJsVal += " </div>";
                    myJsVal += " <div class=\"activity-item-2\" style=\"width: 80%;\">";

                    if (CouponsMsgList[i].ExpenseReachSum > 0) {
                        myJsVal += "消费满" + CouponsMsgList[i].ExpenseReachSum + "可用<br />";
                    }
                    else {
                        myJsVal += "无消费限制<br />";
                    }

                    if (CouponsMsgList[i].UseTimeRange != "" && CouponsMsgList[i].UseTimeRange != null) {
                        myJsVal += CouponsMsgList[i].UseTimeRange.replace("^", "至");
                    }
                    else {
                        myJsVal += "永久有效";
                    }

                    myJsVal += " </div>";
                    myJsVal += " <div class=\"activity-item-3\" style=\"margin-right:20px;\">";
                    myJsVal += " </div>";
                    myJsVal += " <div class=\"activity-item-4\">";
                    myJsVal += "  <input type=\"button\" value=\"立即领取\" onclick=\"buyerGetCoupons('" + CouponsMsgList[i].CouponsID + "')\" />";
                    myJsVal += " </div>";
                    myJsVal += "</div>";
                }
                //显示代码插入前台
                $("#CouponsContentList").html(myJsVal);

            }
        }
    });
}


/**
 * 买家获取优惠券 单个获取
 * @param pCouponsID 优惠券ID
 * */
function buyerGetCoupons(pCouponsID) {

    event.stopPropagation();

    //判断买家是否登录
    var _isLogin = isBuyerLogin(false);
    if (_isLogin == false) {
        return;
    }

    //构造POST参数
    var dataPOST = {
        "Type": "4", "CouponsID": pCouponsID, "BuyerUserID": mBuyerUserID,
    };

    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: "../ShopAjax/Index?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("买家获取优惠券 单个获取=" + reTxt);
            if (reTxt != "") {
                var _jsonReTxt = JSON.parse(reTxt);

                if (_jsonReTxt.ErrMsg != undefined && _jsonReTxt.ErrMsg != null && _jsonReTxt.ErrMsg != "") {
                    toastWin(_jsonReTxt.ErrMsg);
                }
                if (_jsonReTxt.Msg != undefined && _jsonReTxt.Msg != null && _jsonReTxt.Msg != "") {
                    toastWin(_jsonReTxt.Msg);
                }

            }
        }
    });

}






//================初始化店铺首页顶部条信息=========================//

/**
 * 初始化 店铺信息条，店铺首页顶部条信息
 * */
function initShopMsgTopBarItem() {

    //构造POST参数
    var dataPOST = {
        "Type": "5", "ShopID": mShopID,
    };

    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: "../ShopAjax/Index?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("初始化店铺首页顶部条信息=" + reTxt);
            if (reTxt != "") {

                var _jsonReTxt = JSON.parse(reTxt);

                var ShopMsgTopBarItem = _jsonReTxt;

                var _IsSelfShopSpan = "";
                if (ShopMsgTopBarItem.IsSelfShop == "true") {
                    _IsSelfShopSpan = "<span class=\"shop-bage-span\">自营店</span>";
                }

                $("#ShopName").html(ShopMsgTopBarItem.ShopName + " " + _IsSelfShopSpan);
                $("#ShopHeaderImgVal").attr("src", "//" + ShopMsgTopBarItem.ShopHeaderImg);
                var _starHtml = getStarAppraiseHtml(ShopMsgTopBarItem.AvgAppraiseScore);
                $("#HeaderSpanStar").html(_starHtml);
                $("#AvgAppraiseScoreVal").html(ShopMsgTopBarItem.AvgAppraiseScore + " 分");
                $("#CountFansVal").html(ShopMsgTopBarItem.CountFans);
                $("#CountFavShopVal").html(ShopMsgTopBarItem.CountFavShop + "人");

                //页脚下面的客服
                $("#CusServiceFooter").on("click", function () {
                    window.location.href = "tel:" + ShopMsgTopBarItem.ShopMobile;
                });


                //构建商家店铺咨询进入IM在线客服系统 跳转 URL
                buildBuyerGoToImSysURL_ShopWap(ShopMsgTopBarItem.ShopUserID, mBuyerUserID);


            }
        }
    });

}

/**
 * /添加关注收藏信息 (收藏商品或店铺)
 * */
function addBuyerFocusFav() {

    if (mShopID == "0" || mShopID == "") {
        return;
    }

    //判断买家是否登录
    var _isLogin = isBuyerLogin(false);

    //构造POST参数
    var dataPOST = {
        "Type": "1", "FocusFavType": "shop", "ShopID": mShopID,
    };

    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: "../BuyerAjax/BuyerFocusFav?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("添加关注收藏信息=" + reTxt);
            if (reTxt != "") {

                var _jsonReTxt = JSON.parse(reTxt);

                //错误提示
                if (_jsonReTxt.ErrMsg != "" && _jsonReTxt.ErrMsg != null && _jsonReTxt.ErrMsg != undefined) {
                    toastWin(_jsonReTxt.ErrMsg);
                    return;
                }
                //成功提示
                if (_jsonReTxt.Msg != "" && _jsonReTxt.Msg != null && _jsonReTxt.Msg != undefined) {
                    toastWin(_jsonReTxt.Msg);
                    return;
                }

            }
        }
    });


}


/**
 * 判断买家是否登录 
 * @param pIsWin 是否为窗口立即订购 [默认 false 不是窗口]
 * */
function isBuyerLogin(pIsWin) {

    if (mBuyerUserID == "" || mBuyerUserID == undefined) {

        if (pIsWin) {
            toastWinToDivCb("请先登录！", function () {

                //跳转到登录页面
                window.location.href = "../Login/Buyer?BackUrl=" + window.location.href + "";

            }, "SliderDownWin");
        }
        else {
            toastWinCb("请先登录！", function () {


                //跳转到登录页面
                window.location.href = "../Login/Buyer?BackUrl=" + window.location.href + "";
            });
        }

        return false;
    }
    return true;
}

/**
 * 根据评分得到星星评价显示
 * @param {any} pAvgAppraiseScore 评分数
 */
function getStarAppraiseHtml(pAvgAppraiseScore) {

    var myJsVal = "";


    if (pAvgAppraiseScore >= 1 && pAvgAppraiseScore < 2) {
        myJsVal += "<img src=\"../Assets/Imgs/Icon/appraise_star.png\" />";
        myJsVal += "<img src=\"../Assets/Imgs/Icon/appraise_star_gray.png\" />";
        myJsVal += "<img src=\"../Assets/Imgs/Icon/appraise_star_gray.png\" />";
        myJsVal += "<img src=\"../Assets/Imgs/Icon/appraise_star_gray.png\" />";
        myJsVal += "<img src=\"../Assets/Imgs/Icon/appraise_star_gray.png\" />";
    }
    else if (pAvgAppraiseScore >= 2 && pAvgAppraiseScore < 3) {
        myJsVal += "<img src=\"../Assets/Imgs/Icon/appraise_star.png\" />";
        myJsVal += "<img src=\"../Assets/Imgs/Icon/appraise_star.png\" />";
        myJsVal += "<img src=\"../Assets/Imgs/Icon/appraise_star_gray.png\" />";
        myJsVal += "<img src=\"../Assets/Imgs/Icon/appraise_star_gray.png\" />";
        myJsVal += "<img src=\"../Assets/Imgs/Icon/appraise_star_gray.png\" />";
    }
    else if (pAvgAppraiseScore >= 3 && pAvgAppraiseScore < 4) {
        myJsVal += "<img src=\"../Assets/Imgs/Icon/appraise_star.png\" />";
        myJsVal += "<img src=\"../Assets/Imgs/Icon/appraise_star.png\" />";
        myJsVal += "<img src=\"../Assets/Imgs/Icon/appraise_star.png\" />";
        myJsVal += "<img src=\"../Assets/Imgs/Icon/appraise_star_gray.png\" />";
        myJsVal += "<img src=\"../Assets/Imgs/Icon/appraise_star_gray.png\" />";
    }
    else if (pAvgAppraiseScore >= 4 && pAvgAppraiseScore < 5) {
        myJsVal += "<img src=\"../Assets/Imgs/Icon/appraise_star.png\" />";
        myJsVal += "<img src=\"../Assets/Imgs/Icon/appraise_star.png\" />";
        myJsVal += "<img src=\"../Assets/Imgs/Icon/appraise_star.png\" />";
        myJsVal += "<img src=\"../Assets/Imgs/Icon/appraise_star.png\" />";
        myJsVal += "<img src=\"../Assets/Imgs/Icon/appraise_star_gray.png\" />";
    }
    else if (pAvgAppraiseScore >= 5) {
        myJsVal += "<img src=\"../Assets/Imgs/Icon/appraise_star.png\" />";
        myJsVal += "<img src=\"../Assets/Imgs/Icon/appraise_star.png\" />";
        myJsVal += "<img src=\"../Assets/Imgs/Icon/appraise_star.png\" />";
        myJsVal += "<img src=\"../Assets/Imgs/Icon/appraise_star.png\" />";
        myJsVal += "<img src=\"../Assets/Imgs/Icon/appraise_star.png\" />";
    }
    else {
        myJsVal += "<img src=\"../Assets/Imgs/Icon/appraise_star_gray.png\" />";
        myJsVal += "<img src=\"../Assets/Imgs/Icon/appraise_star_gray.png\" />";
        myJsVal += "<img src=\"../Assets/Imgs/Icon/appraise_star_gray.png\" />";
        myJsVal += "<img src=\"../Assets/Imgs/Icon/appraise_star_gray.png\" />";
        myJsVal += "<img src=\"../Assets/Imgs/Icon/appraise_star_gray.png\" />";
    }
    return myJsVal;
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

                    $("#CusServiceFooter").unbind();
                    //页脚下面的客服
                    $("#CusServiceFooter").on("click", function () {
                        window.location.href = encodeURI(mBuyerGoToImSysURL_ShopWap);
                    });

                }


            }

        }
    });
}