﻿//===========订单动态=============//

/**-----定义公共变量------**/
var mAjaxUrl = "../OrderAjax/OrderDynamic";

//订单ID
var mOrderID = "";

/**------初始化------**/
$(function () {

    mOrderID = $("#hidOrderID").val().trim();

    //初始化订单动态
    initOrderDynamic();

});

/**
 * 初始化订单动态
 * */
function initOrderDynamic() {

    //构造POST参数
    var dataPOST = {
        "Type": "1", "OrderID": mOrderID,
    };
    console.log(dataPOST);
    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: mAjaxUrl + "?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("初始化订单动态=" + reTxt);
            if (reTxt != "") {
                var _jsonReTxt = JSON.parse(reTxt);

                //构造订单动态列表显示代码
                var _xhtml = xhtmlOrderDynamic(_jsonReTxt.OrderSysMsgList);
                $("#OrderDynamicList").html(_xhtml);

            }
        }
    });
}

/**
 * 构造订单动态列表显示代码
 * @param {any} pOrderSysMsgListJson  订单动态列表Json对象
 */
function xhtmlOrderDynamic(pOrderSysMsgListJson) {

    var myJsVal = "";
        }
    }
}