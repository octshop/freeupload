//=============热门分类==================//

/**------定义公共变量----**/

//AjaxURL
var mAjaxUrl = "../ShopAjax/GoodsType";

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

    //加载店铺商品分类
    loadShopGoodsType();

});

/**
 * 加载店铺商品分类
 * */
function loadShopGoodsType() {

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
            console.log("加载店铺商品分类=" + reTxt);
            if (reTxt != "") {

                var _jsonReTxt = JSON.parse(reTxt);

                ShopGoodsTypeFatherArr = _jsonReTxt.ShopGoodsTypeFather;
                ShopGoodsTypeSubArr = _jsonReTxt.ShopGoodsTypeSub;

                //循环构造显示代码
                var myJsVal = "";
                for (var i = 0; i < ShopGoodsTypeFatherArr.length; i++) {

                    var ShopGoodsTypeSubList = ShopGoodsTypeSubArr[i].ShopGoodsTypeSubList;

                    myJsVal += "<div class=\"goods-type-item\">";
                    myJsVal += " <div class=\"type-item-title\" onclick=\"window.location.href='../Shop/GoodsTypeDetail?SGTID=" + ShopGoodsTypeFatherArr[i].ShopGoodsTypeID + "&SID=" + mShopID + "'\">";
                    myJsVal += "     <span>" + ShopGoodsTypeFatherArr[i].ShopGoodsTypeName + "</span>";
                    myJsVal += "     <img src=\"../Assets/Imgs/Icon/arrows_right_black.png\" />";
                    myJsVal += " </div>";
                    myJsVal += " <div class=\"type-item-content\">";

                    for (var j = 0; j < ShopGoodsTypeSubList.length; j++) {
                        myJsVal += "<a href=\"../Shop/GoodsTypeDetail?SGTID=" + ShopGoodsTypeSubList[j].ShopGoodsTypeID + "&SID=" + mShopID + "\" class=\"type-name-item\">";
                        myJsVal += "" + ShopGoodsTypeSubList[j].ShopGoodsTypeName + "";
                        myJsVal += "</a>";
                    }

                    myJsVal += " </div>";
                    myJsVal += "</div>";
                }
                myJsVal += "<div class=\"goods-type-item\">";
                myJsVal += " <div class=\"type-item-title\" onclick=\"window.location.href='../Shop/GoodsTypeDetail?SGTID=1&SID=" + mShopID + "'\">";
                myJsVal += "     <span> 未分类商品</span>";
                myJsVal += "     <img src=\"../Assets/Imgs/Icon/arrows_right_black.png\" />";
                myJsVal += " </div>";
                myJsVal += "</div>";

                //显示代码插入前台
                $("#GoodsTypeList").html(myJsVal);

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

                    $("#CusServiceFooter2").unbind();
                    //页脚下面的客服
                    $("#CusServiceFooter2").on("click", function () {
                        window.location.href = encodeURI(mBuyerGoToImSysURL_ShopWap);
                    });



                }


            }

        }
    });
}


