//=================投诉详情====================//

/**-----定义公共变量------**/
//AjaxURL
var mAjaxUrl = "../Complain/ComplainMsg";

//投诉ID
var mCID = "0";

/**------初始化------**/

$(function () {

    mCID = $("#hidCID").val().trim();

    //初始化投诉信息
    initComplainMsg();

});

/**
 * 初始化投诉信息
 * */
function initComplainMsg() {

    //构造POST参数
    var dataPOST = {
        "Type": "3", "ComplainID": mCID, 
    };
    console.log(dataPOST);
    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: mAjaxUrl + "?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("初始化投诉信息=" + reTxt);
            if (reTxt != "") {
                var _jsonReTxt = JSON.parse(reTxt);

                var ComplainStatusArr = _jsonReTxt.ComplainStatusArr;
                var ComplainMsg = _jsonReTxt.ComplainMsg;

                //投诉分类( order 订单，aftersale售后，shop店铺，paltform平台)
                if (ComplainMsg.ComplainCategory == "order") {
                    ComplainMsg.ComplainCategory += "-订单";

                    $("#OrderID").html(ComplainMsg.ExtraData);
                    $("#OrderID").attr("href", "../TradingPage/OrderDetail?OID=" + ComplainMsg.ExtraData);
                }
                if (ComplainMsg.ComplainCategory == "PresentOrder") {
                    ComplainMsg.ComplainCategory += "-礼品订单";

                    $("#PstOrderID").html(ComplainMsg.ExtraData);
                    $("#PstOrderID").attr("href", "../PresentPage/PresentOrderDetail?POID=" + ComplainMsg.ExtraData);
                }
                else if (ComplainMsg.ComplainCategory == "aftersale") {
                    ComplainMsg.ComplainCategory += "-售后";

                    $("#AfterSaleID").html(ComplainMsg.ExtraData);
                    $("#AfterSaleID").attr("href", "../AfterSalePage/AfterSaleDetail?AID=" + ComplainMsg.ExtraData);
                }
                else if (ComplainMsg.ComplainCategory == "shop") {
                    ComplainMsg.ComplainCategory += "-店铺";

                    $("#ShopID").html(ComplainMsg.ExtraData);
                    $("#ShopID").attr("href", "#");
                }
                else if (ComplainMsg.ComplainCategory == "paltform") {
                    ComplainMsg.ComplainCategory += "-平台";
                }

                $("#StatusTtitle").html(ComplainStatusArr.ComplainStatusTitle);
                $("#StatusDesc").html(ComplainStatusArr.ComplainStatusDesc);

                $("#ComplainID").html(ComplainMsg.ComplainID);
                $("#ComplainCategory").html(ComplainMsg.ComplainCategory);
                $("#ComplainType").html(ComplainMsg.ComplainType);
                $("#WriteDate").html(ComplainMsg.WriteDate);

                $("#ComplainContent").html(ComplainMsg.ComplainContent);
                $("#ShopReply").html(ComplainMsg.ShopReply);
                $("#ComplainReply").html(ComplainMsg.ComplainReply);

                $("#ShopReplyDate").html(ComplainMsg.ShopReplyDate);
                $("#ReplyDate").html(ComplainMsg.ReplyDate);
            }
        }
    });


}