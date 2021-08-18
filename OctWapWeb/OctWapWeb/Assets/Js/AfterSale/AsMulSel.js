﻿//==============多商品售后选择页=========================//

/**-----定义公共变量------**/
var mAjaxUrl = "../AfterSaleAjax/AsMulSel";

var mOID = ""; //订单ID

/**------初始化------**/
$(function () {

    mOID = $("#hidOrderID").val().trim();

    //初始化订单商品信息
    initOrderGoodsMsg();

});



/**------自定义函数------**/

/**
 * 初始化订单商品信息
 * */
function initOrderGoodsMsg() {
    //构造POST参数
    var dataPOST = {
        "Type": "1", "OrderID": mOID,
    };
    console.log(dataPOST);
    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: mAjaxUrl + "?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("初始化订单商品信息=" + reTxt);
            if (reTxt != "") {
                var _jsonReTxt = JSON.parse(reTxt);

                var myJsValShop = "";

                var myJsVal = "";
                //循环构造商品列表
                for (var i = 0; i < _jsonReTxt.OrderGoodsList.length; i++) {

                    var _orderGoodsMsg = _jsonReTxt.OrderGoodsList[i];

                    myJsVal += "<div class=\"order-goods-item\">";
                $("#OrderGoodsListLabel").html(myJsVal);

            }
        }
    });

}

/**
 * 跳转到售后类型选择页
 * @param {any} pOrderID
 * @param {any} pGoodsID
 * @param {any} pSpecID
 */
function goToApplyAfterSale(pOrderID, pGoodsID, pSpecID) {

    window.location.href = "../AfterSale/AsSelType?OID=" + pOrderID + "&GID=" + pGoodsID + "&SID=" + pSpecID;
    //阻止冒泡
    event.stopPropagation();

}