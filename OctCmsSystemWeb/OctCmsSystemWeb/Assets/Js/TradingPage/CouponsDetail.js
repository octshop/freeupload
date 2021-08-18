//==================优惠券详情=====================//

/**-----定义公共变量------**/

//AjaxURL
var mAjaxUrl = "../Trading/CouponsMsg";

var mCouponsID = "";
var mOctWapWebAddrDomain = "";

/**------初始化------**/
$(function () {

    mCouponsID = $("#hidCouponsID").val().trim();
    mOctWapWebAddrDomain = $("#hidOctWapWebAddrDomain").val().trim();

    //初始化商家端订单详情
    initCouponsMsgCMS();

});

/**
 * 初始化优惠券详情(CMS版)
 * */
function initCouponsMsgCMS() {
    //构造POST参数
    var dataPOST = {
        "Type": "3", "CouponsID": mCouponsID,
    };
    console.log(dataPOST);

    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: mAjaxUrl + "?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("初始化优惠券详情(CMS版)=" + reTxt);

            if (reTxt != "") {
                var _jsonReTxt = JSON.parse(reTxt);

                $("#CouponsID").html(_jsonReTxt.CouponsID);
                $("#ShopUserID").html("<a href=\"" + mOctWapWebAddrDomain + "/Mall/PagePreMobileIframe?LoadPreURL=" + mOctWapWebAddrDomain + "/Shop/Index?SID=" + _jsonReTxt.ShopID + "\" target=\"_blank\">" + _jsonReTxt.ShopUserID + "(" + _jsonReTxt.ShopName + ") </a>");
                $("#UseMoney").html(_jsonReTxt.UseMoney);
                $("#UseDiscount").html(_jsonReTxt.UseDiscount);
                $("#NumTotal").html(_jsonReTxt.NumTotal);
                $("#ExpenseReachSum").html(_jsonReTxt.ExpenseReachSum);
                $("#IssueType").html(_jsonReTxt.IssueTypeName);
                $("#IssueExpenseSum").html(_jsonReTxt.IssueExpenseSum);
                $("#IsMallCoupons").html(_jsonReTxt.IsMallCouponsName);
                $("#IssuePause").html(_jsonReTxt.IssuePauseName);
                $("#IsRepeatGet").html(_jsonReTxt.IsRepeatGetName);
                $("#IsOfflineUse").html(_jsonReTxt.IsOfflineUseName);
                $("#IsLock").html(_jsonReTxt.IsLockName);
                $("#WriteDate").html(_jsonReTxt.WriteDate);
                $("#UseTimeRange").html(_jsonReTxt.UseTimeRange.replace("^", " 至 "));
                $("#CountIssue").html(_jsonReTxt.CountIssue);
                $("#CountUsed").html(_jsonReTxt.CountUsed);
                $("#CouponsTitle").html(_jsonReTxt.CouponsTitle);
                $("#CouponsDesc").html(_jsonReTxt.CouponsDesc);

                //可使用商品ID列表
                var myJsValGoods = "";
                if (_jsonReTxt.UseGoodsTitleArr.indexOf("^") >= 0) {

                    var _UseGoodsTitleArr = _jsonReTxt.UseGoodsTitleArr.split("^");
                    var _UseGoodsIDArr = _jsonReTxt.UseGoodsIDArr.split("^");

                    for (var i = 0; i < _UseGoodsTitleArr.length; i++) {
                        myJsValGoods += "<div><span><a href=\"" + mOctWapWebAddrDomain + "/Goods/GoodsDetailPreMobileIframe?GID=" + _UseGoodsIDArr[i] + "\" target=\"_blank\">" + _UseGoodsTitleArr[i] + "</a></span></div>";
                    }
                }
                else {
                    myJsValGoods = "<div><span><a href=\"" + mOctWapWebAddrDomain + "/Goods/GoodsDetailPreMobileIframe?GID=" + _jsonReTxt.UseGoodsIDArr + "\" target=\"_blank\">" + _jsonReTxt.UseGoodsTitleArr + "</a></span></div>";
                }
                $("#UseGoodsTitleArrDD").html(myJsValGoods);

                //可使用店铺ID列表
                var myJsValShop = "";
                if (_jsonReTxt.UseShopNameArr.indexOf("^") >= 0) {

                    var _UseShopNameArr = _jsonReTxt.UseShopNameArr.split("^");
                    var _UseShopIDArr = _jsonReTxt.UseShopIDArr.split("^");

                    for (var i = 0; i < _UseShopNameArr.length; i++) {
                        myJsValShop += "<div><span><a href=\"" + mOctWapWebAddrDomain + "/Mall/PagePreMobileIframe?LoadPreURL=" + mOctWapWebAddrDomain + "/Shop/Index?SID=" + _UseShopIDArr[i] + "\" target=\"_blank\">" + _UseShopNameArr[i] + "</a></span></div>";
                    }
                }
                else {
                    myJsValShop = "<div><span><a href=\"" + mOctWapWebAddrDomain + "/Mall/PagePreMobileIframe?LoadPreURL=" + mOctWapWebAddrDomain + "/Shop/Index?SID=" + _jsonReTxt.UseShopIDArr + "\" target=\"_blank\">" + _jsonReTxt.UseShopNameArr + "</a></span></div>";
                }
                $("#UseShopNameArrDD").html(myJsValShop);




            }
        },
        error: function (xhr, errorTxt, status) {
            console.log("异步请求错误，errorTxt=" + errorTxt + " | status=" + status);
            return;
        }
    });
}
