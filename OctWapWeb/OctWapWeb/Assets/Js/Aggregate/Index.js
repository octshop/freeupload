//================聚合扫码支付=========================//

/**-----定义公共变量------**/
var mAjaxUrl = "../AggregateAjax/Index";

var mShopID = "";

/**------初始化------**/
$(function () {

    mShopID = $("#hidShopID").val().trim();

    //加载店铺简单信息
    loadShopMsgSimple();


});


/**
 * 加载店铺简单信息
 * */
function loadShopMsgSimple() {


    if (mShopID == "" || mShopID == "0") {
        return;
    }

    //构造POST参数
    var dataPOST = {
        "Type": "1", "ShopID": mShopID,
    };
    console.log(dataPOST);

    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: mAjaxUrl + "?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("加载店铺简单信息=" + reTxt);

            if (reTxt != "") {
                var _jsonReTxt = JSON.parse(reTxt);
                if (_jsonReTxt.ShopID != 0) {
                    $("#ShopHeaderImg").attr("src", "//" + _jsonReTxt.ShopHeaderImg);
                    $("#ShopName").html(_jsonReTxt.ShopName);

                    //设置店铺主推荐新注册用户的Cookie
                    setShopUserIDPromoteBuyerCookie(_jsonReTxt.ShopID, _jsonReTxt.UserID, _jsonReTxt.BindMobile)
                }
                else {
                    window.location.href = "../Mall/Index";
                }
            }


        }


    });


}

/**
 * 设置店铺主推荐新注册用户的Cookie
 * @param {any} pShopID
 * @param {any} pShopUserID
 * @param {any} pBindMobile
 */
function setShopUserIDPromoteBuyerCookie(pShopID, pShopUserID, pBindMobile) {

    if (pShopID == "" || pShopUserID == "" || pBindMobile == "") {
        return;
    }

    //构造POST参数
    var dataPOST = {
        "Type": "3", "ShopID": pShopID, "ShopUserID": pShopUserID, "BindMobile": pBindMobile,
    };
    console.log(dataPOST);

    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: "../ShopAjax/ShopMsg?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("设置店铺主推荐新注册用户的Cookie=" + reTxt);

            if (reTxt != "") {

            }
        }
    });
}

