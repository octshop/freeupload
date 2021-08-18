//===================扫码支付订单详情========================//

/**-----定义公共变量------**/
//AjaxURL
var mAjaxUrl = "../Trading/AggregateOrderMsg";
//聚合支付订单ID
var mAggregateOrderID = "";

/**------初始化------**/

$(function () {

    mAggregateOrderID = $("#hidAggregateOrderID").val().trim();

    //初始化聚合支付订单详情信息
    initAggreOrderDetail();

});



/**
 * 初始化聚合支付订单详情信息
 * */
function initAggreOrderDetail() {


    //构造POST参数
    var dataPOST = {
        "Type": "2", "AggregateOrderID": mAggregateOrderID
    };
    console.log(dataPOST);

    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: mAjaxUrl + "?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("初始化聚合支付订单详情信息=" + reTxt);
            if (reTxt != "") {
                var _jsonReTxt = JSON.parse(reTxt);


                //---------前端显示赋值------//
                var AggregateOrderMsg = _jsonReTxt.AggregateOrderMsg;
                var AggregateOrderGoodsMsg = _jsonReTxt.AggregateOrderGoodsMsg;
                var BuyerMsg = _jsonReTxt.BuyerMsg;
                var ExtraData = _jsonReTxt.ExtraData

                var _IsPaySuccess = "已支付";
                if (AggregateOrderMsg.IsPaySuccess == "false") {
                    _IsPaySuccess = "支付中";
                }
                var _IsSettle = "未结算";
                if (AggregateOrderMsg.IsSettle == "true") {
                    _IsSettle = "已结算";
                }
                var _IsRefund = "未退款";
                if (AggregateOrderMsg.IsRefund == "true") {
                    _IsRefund = "已退款";
                }

                $("#StatusTtitle").html(AggregateOrderMsg.OrderStatus);
                if (AggregateOrderMsg.OrderStatus == "支付成功") {
                    $("#StatusDesc").html("线下扫码收单，支付成功！");
                }
                else if (AggregateOrderMsg.OrderStatus == "支付中") {
                    $("#StatusDesc").html("线下扫码收单，订单支付中！");
                    $(".order-status").css("background", "#DE7400");
                }
                $("#AggregateOrderID").html(AggregateOrderMsg.AggregateOrderID);
                $("#BillNumber").html(AggregateOrderMsg.BillNumber);
                $("#OrderPrice").html(AggregateOrderMsg.OrderPrice);
                $("#OrderTime").html(AggregateOrderMsg.OrderTime);
                $("#PayWay").html(AggregateOrderMsg.PayWay + "[" + ExtraData.PayWayName + "]");
                $("#PayTime").html(AggregateOrderMsg.PayTime);
                $("#PayMemo").html(AggregateOrderMsg.PayMemo);
                $("#OrderGuid").html(AggregateOrderMsg.OrderGuid);
                $("#IsPaySuccess").html("" + AggregateOrderMsg.IsPaySuccess + "[" + _IsPaySuccess + "]");
                $("#IsSettle").html("" + AggregateOrderMsg.IsSettle + "[" + _IsSettle + "]");
                $("#IsRefund").html("" + AggregateOrderMsg.IsRefund + "[" + _IsRefund + "]");

                //支付商品信息
                var myJsValGoods = "<span>";
                myJsValGoods += "    <a href=\"javascript:void(0)\">" + AggregateOrderGoodsMsg.GoodsTitle + "</a>";
                myJsValGoods += "</span>";
                myJsValGoods += "<span>";
                myJsValGoods += "    &#165;" + AggregateOrderGoodsMsg.GoodsUnitPrice + "  x 1";
                myJsValGoods += "</span>";
                $("#OrderGoodsMsgList").html(myJsValGoods);

                //付款者信息
                var _userNick = "";
                if (BuyerMsg.HeaderImg != "" && BuyerMsg.HeaderImg != null && BuyerMsg.HeaderImg != undefined) {
                    _userNick = "<img src='" + BuyerMsg.HeaderImg + "' />";
                }
                if (BuyerMsg.UserNick != "" && BuyerMsg.UserNick != null && BuyerMsg.UserNick != undefined) {
                    _userNick += " " + BuyerMsg.UserNick;
                }
                $("#UserNick").html(_userNick);

                $("#BuyerUserID").html(AggregateOrderMsg.BuyerUserID);
                $("#BindMobile").html(BuyerMsg.BindMobile);

            }
        },
        error: function (xhr, errorTxt, status) {
            console.log("异步请求错误，errorTxt=" + errorTxt + " | status=" + status);
            return;
        }
    });

}



