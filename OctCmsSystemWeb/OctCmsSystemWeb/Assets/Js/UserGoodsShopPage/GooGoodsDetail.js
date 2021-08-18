//=====================商品信息详情====================//

/**-----定义公共变量------**/
//AjaxURL
var mAjaxUrl = "../UserGoodsShop/GooGoodsDetail";

//手机端Web域名
var mOctWapWebAddrDomain = "";

/**------初始化------**/
$(function () {

    mOctWapWebAddrDomain = $("#hidOctWapWebAddrDomain").val().trim();

    //加载商品详情信息-视图(后台CMS)
    initGooGoodsDetail();

});

/*******************自定义函数*************************/

/**
 * 加载商品详情信息-视图(后台CMS)
 * */
function initGooGoodsDetail() {

    var _hidGoodsID = $("#hidGoodsID").val().trim();

    //构造POST参数
    var dataPOST = {
        "Type": "1", "GoodsID": _hidGoodsID,
    };
    console.log(dataPOST);

    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: mAjaxUrl + "?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("加载商品详情信息-视图(后台CMS)=" + reTxt);
            if (reTxt != "") {
                var _jsonReTxt = JSON.parse(reTxt);
                var ModelGooGoodsMsg = _jsonReTxt.ModelGooGoodsMsg;
                var ModelShopMsg = _jsonReTxt.ModelShopMsg;

                //商品状态区
                if (ModelGooGoodsMsg.GoodsStatus == "审") {

                    $(".order-status").css("background", "#D60000");
                    $("#StatusTtitle").html("审核中");
                    $("#StatusDesc").html("商品审核中不能订购下单，请工作员尽快审核。");
                    $("#GoodsCheckReason").html(ModelGooGoodsMsg.GoodsCheckReason);
                }
                else if (ModelGooGoodsMsg.GoodsStatus == "售") {
                    $(".order-status").css("background", "#03AD05");
                    $("#StatusTtitle").html("商品正常出售");
                    $("#StatusDesc").html("商品状态正常，售卖中…");
                    $("#GoodsCheckReason").html(ModelGooGoodsMsg.GoodsCheckReason);
                }
                if (ModelGooGoodsMsg.IsLock == "true") {
                    $(".order-status").css("background", "#D60000");
                    $("#StatusTtitle").html("被锁定");
                    $("#StatusDesc").html("商品被锁定中商家不能操作与售卖，请工作员尽快处理。");
                    $("#GoodsCheckReason").html(ModelGooGoodsMsg.GoodsCheckReason);
                }

                $("#GoodsID").html(ModelGooGoodsMsg.GoodsID);
                $("#GoodsDetailPreA").attr("href", mOctWapWebAddrDomain + "/Goods/GoodsDetailPreMobileIframe?GID=" + ModelGooGoodsMsg.GoodsID);

                $("#GoodsTypeID").html("" + ModelGooGoodsMsg.GoodsTypeID + "(" + _jsonReTxt.GoodsTypeName + ")");
                $("#IsLock").html(ModelGooGoodsMsg.IsLockName);
                $("#WriteDate").html(ModelGooGoodsMsg.WriteDate);
                $("#GoodsTitle").html(ModelGooGoodsMsg.GoodsTitle);

                $("#GoodsPrice").html("&#165;" + ModelGooGoodsMsg.GoodsPrice);
                $("#MarketPrice").html("&#165;" + ModelGooGoodsMsg.MarketPrice);
                $("#Discount").html(ModelGooGoodsMsg.Discount);
                $("#SaleCount").html(ModelGooGoodsMsg.SaleCount);
                $("#PaidCount").html(ModelGooGoodsMsg.PaidCount);

                $("#IsSpecParam").html(_jsonReTxt.IsSpecParamName);
                $("#IsUnSale").html(_jsonReTxt.IsUnSaleName);
                $("#IsPayDelivery").html(_jsonReTxt.IsPayDeliveryName);
                $("#IsShopExpense").html(_jsonReTxt.IsShopExpenseName);
                $("#IsOfflinePay").html(_jsonReTxt.IsOfflinePayName);

                $("#IsShopCommend").html(_jsonReTxt.IsShopCommendName);
                $("#FtID").html(ModelGooGoodsMsg.FtID + "(" + _jsonReTxt.ShopFtTitle + ")");
                $("#ShopGoodsTypeID").html("" + ModelGooGoodsMsg.ShopGoodsTypeID + "(连衣裙)");
                $("#GoodsTypeNeedProp").html(ModelGooGoodsMsg.GoodsTypeNeedProp);
                $("#GoodsTypeCustomProp").html(ModelGooGoodsMsg.GoodsTypeCustomProp);
                $("#PackAfterSaleDesc").html(ModelGooGoodsMsg.PackAfterSaleDesc);
                $("#GoodsMemo").html(ModelGooGoodsMsg.GoodsMemo);

                $("#ShopID").html("<a href=\"../UserGoodsShopPage/ShopMsgDetail?UserID=" + ModelGooGoodsMsg.ShopUserID + "\" target=\"_blank\">" + ModelShopMsg.ShopID + "(" + ModelShopMsg.ShopName + ")</a>");
                $("#ShopTypeID").html(ModelShopMsg.ShopTypeID + "(" + _jsonReTxt.ShopTypeName + ")");
                $("#CompanyID").html("" + ModelShopMsg.CompanyID + "(" + _jsonReTxt.CompanyName + ")");
                $("#ShopUserID").html(ModelGooGoodsMsg.ShopUserID);
                $("#DetailAddr").html(ModelShopMsg.RegionNameArr + "_" + ModelShopMsg.DetailAddr);
                $("#LinkMan").html(ModelShopMsg.LinkMan);
                $("#LinkManMobile").html("<a href=\"tel:" + ModelShopMsg.LinkManMobile + "\">" + ModelShopMsg.LinkManMobile + "</a>");
                $("#ShopMobile").html("<a href=\"tel:" + ModelShopMsg.ShopMobile + "\">" + ModelShopMsg.ShopMobile + "</a>");
                $("#SendMobile").html("<a href=\"tel:" + ModelShopMsg.SendMobile + "\">" + ModelShopMsg.SendMobile + "</a>");


                //----赠品信息-----//
                $("#GoodsGiftList").html(xhtmlGiftMsgList(_jsonReTxt.GiftMsgList));


            }
        },
        error: function (xhr, errorTxt, status) {
            console.log("异步请求错误，errorTxt=" + errorTxt + " | status=" + status);
            //alert("异步请求错误，errorTxt=" + errorTxt + " | status=" + status);
            return;
        }
    });

}




/**
 * 构造赠品列表显示代码
 * @param {any} pGiftJsonArr
 */
function xhtmlGiftMsgList(pGiftMsgJson) {

    if (pGiftMsgJson == null || pGiftMsgJson == undefined) {
        return "";
    }

    if (pGiftMsgJson.length <= 0) {
        return "";
    }

    var GiftNumList = pGiftMsgJson.GiftNumList;
    var GiftMsgList = pGiftMsgJson.GiftMsgList;

    var myJsVal = "";
    for (var i = 0; i < GiftMsgList.length; i++) {


        myJsVal += "<div>";
        myJsVal += " <span>";
        myJsVal += "<a href=\"" + mOctWapWebAddrDomain + "/Mall/PagePreMobileIframe?LoadPreURL=" + mOctWapWebAddrDomain + "/Goods/GiftDetail?GIID=" + GiftMsgList[i].GiftID + "\" target=\"_blank\">" + GiftMsgList[i].GiftName + "</a>";
        myJsVal += " </span>";
        myJsVal += " <span>";
        myJsVal += "     &#165; " + GiftMsgList[i].GiftPrice + " &nbsp; x " + GiftNumList[i].GiftNum + "";
        myJsVal += " </span>";
        myJsVal += "</div>";
    }
    return myJsVal;
}

