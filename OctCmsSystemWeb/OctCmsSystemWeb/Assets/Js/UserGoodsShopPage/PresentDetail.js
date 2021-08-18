//==================礼品详情=====================//

/**-----定义公共变量------**/

//AjaxURL
var mAjaxUrl = "../UserGoodsShop/PresentMsg";


var mPresentID = "";
var mOctWapWebAddrDomain = "";



/**------初始化------**/
$(function () {

    mPresentID = $("#hidPresentID").val().trim();
    mOctWapWebAddrDomain = $("#hidOctWapWebAddrDomain").val().trim();

    //初始化礼品详情信息
    initPresentMsgDetail();
});

/**
 * 初始化礼品详情信息
 * */
function initPresentMsgDetail() {
    //构造POST参数
    var dataPOST = {
        "Type": "4", "PresentID": mPresentID,
    };
    console.log(dataPOST);

    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: mAjaxUrl + "?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("初始化礼品详情=" + reTxt);

            if (reTxt != "") {
                var _jsonReTxt = JSON.parse(reTxt);

                var PresentMsgDetail = _jsonReTxt.PresentMsgDetail;
                var PresentImgs = _jsonReTxt.PresentImgs;

                //显示代码插入前台

                //状态栏
                if (PresentMsgDetail.PresentStatus == "审") {
                    $(".order-status").css("background", "red");
                    $("#StatusTtitle").html("审核中");
                    if (PresentMsgDetail.PresentCheckReason != "") {
                        $("#StatusDesc").html(PresentMsgDetail.PresentCheckReason);
                    }
                    else {
                        $("#StatusDesc").html("请相关工作人员尽快审核…");
                    }
                }
                else {
                    $(".order-status").css("background", "#07b100");
                    $("#StatusTtitle").html("出售中");
                    $("#StatusDesc").html("礼品信息正常，正常出售中！");
                }

                $("#PresentID").html(PresentMsgDetail.PresentID);
                $("#SeePresentDetailA").attr("href", mOctWapWebAddrDomain + "/Present/PresentDetailPreMobileIframe?PID=" + PresentMsgDetail.PresentID);

                $("#ShopUserID").html(PresentMsgDetail.ShopUserID);
                $("#GoodsTypeID").html("" + _jsonReTxt.GoodsTypeName + "(" + PresentMsgDetail.GoodsTypeID + ")");
                $("#PresentPrice").html(PresentMsgDetail.PresentPrice);
                $("#StockNum").html(PresentMsgDetail.StockNum);
                $("#ShopIDName").html("<a href=\"../UserGoodsShopPage/ShopMsgDetail?UserID=" + PresentMsgDetail.ShopUserID + "\" target=\"_blank\">" + _jsonReTxt.ShopName + "(" + PresentMsgDetail.ShopID + ")</a>");

                $("#IsShopExpense").html(_jsonReTxt.IsShopExpenseName);
                $("#IsPinkage").html(_jsonReTxt.IsPinkageName);
                $("#IsUnSale").html(_jsonReTxt.IsUnSaleName);
                $("#IsLock").html(_jsonReTxt.IsLockName);

                $("#WriteDate").html(PresentMsgDetail.WriteDate);

                $("#PresentTitle").html(PresentMsgDetail.PresentTitle);
                $("#ExchangeNote").html(PresentMsgDetail.ExchangeNote);
                $("#PresentMemo").html(PresentMsgDetail.PresentMemo);

                //循环构造图片显示
                var myJsValImg = "";
                for (var i = 0; i < PresentImgs.length; i++) {
                    myJsValImg += "<a href=\"//" + PresentImgs[i].ImgURL + "\" target=\"_blank\"><img src=\"//" + PresentImgs[i].ImgURL + "\" /></a>";
                }
                $("#PresentImgsDiv").html(myJsValImg);
            }
        },
        error: function (xhr, errorTxt, status) {
            console.log("异步请求错误，errorTxt=" + errorTxt + " | status=" + status);
            return;
        }
    });
}
