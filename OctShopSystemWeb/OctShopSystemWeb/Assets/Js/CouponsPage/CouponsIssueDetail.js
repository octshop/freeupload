//================优惠券发放详情==========================//


/**-----定义公共变量------**/
//AjaxURL
var mAjaxUrl = "../Coupons/CouponsIssueMsg";

var mIssueID = "";

/**------初始化------**/
$(function () {

    mIssueID = $("#hidIssueID").val().trim();

    //初始化优惠券发放信息 -带优惠券详情，会员信息，订单信息
    initCouponsIssueDetailView();
});


//=================自定义函数=======================//

/**
 * 初始化优惠券发放信息 -带优惠券详情，会员信息，订单信息
 * */
function initCouponsIssueDetailView() {


    //构造POST参数
    var dataPOST = {
        "Type": "2", "IssueID": mIssueID,
    };
    console.log(dataPOST);

    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: mAjaxUrl + "?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log(reTxt);
            if (reTxt != "") {
                var _jsonReTxt = JSON.parse(reTxt);
                var ModelCouponsIssueMsg = _jsonReTxt.ModelCouponsIssueMsg;
                var ModelCouponsMsg = _jsonReTxt.ModelCouponsMsg;
                var BuyerMsg = _jsonReTxt.BuyerMsg;
                var OrderMsg = _jsonReTxt.OrderMsg;

                //优惠券是否使用
                if (ModelCouponsIssueMsg.IsUsed == "true") {
                    $(".order-status").css("background", "#818181");
                    $("#StatusTtitle").html("已使用");
                    $("#StatusDesc").html("优惠券已使用！");
                    //判断是否为线下使用
                    if (_jsonReTxt.IsOfflineUse == "true") {
                        $("#StatusDesc").html("优惠券已使用 - <b>线下核销验证使用</b>");
                    }
                }
                else {
                    $(".order-status").css("background", "#03AD05");
                    $("#StatusTtitle").html("未使用");
                    $("#StatusDesc").html("优惠券未使用，可以使用！");

                    //判断是否过期
                    if (ModelCouponsIssueMsg.IsOverTime == "true") {
                        $(".order-status").css("background", "#E02E00");
                        $("#StatusTtitle").html("已过期");
                        $("#StatusDesc").html("优惠券已过期，不能使用！");
                    }

                    //判断是否锁定
                    if (ModelCouponsIssueMsg.IsLock == "true") {
                        $(".order-status").css("background", "#E02E00");
                        $("#StatusTtitle").html("已被锁定");
                        $("#StatusDesc").html("优惠券已被锁定，不能使用！");
                    }
                }

                //显示赋值
                $("#HeaderImg").attr("src", BuyerMsg.HeaderImg);
                $("#UserNick").html(BuyerMsg.UserNick);
                $("#BindMobile").html(BuyerMsg.BindMobile);
                $("#BuyerUserID").html(BuyerMsg.BuyerUserID);

                $("#IssueID").html(ModelCouponsIssueMsg.IssueID);
                $("#CouponsID").html(ModelCouponsIssueMsg.CouponsID);

                var _IsUsed = "否";
                if (ModelCouponsIssueMsg.IsUsed == "true") {
                    _IsUsed = "是";
                }
                $("#IsUsed").html(_IsUsed);
                $("#UsedTime").html(ModelCouponsIssueMsg.UsedTime);
                var _IsLock = "否";
                if (ModelCouponsIssueMsg.IsLock == "true") {
                    _IsLock = "是";
                }
                $("#IsLock").html(_IsLock);

                if (ModelCouponsMsg.UseTimeRange.indexOf("^") >= 0) {
                    $("#UseTimeRange").html(ModelCouponsMsg.UseTimeRange.replace("^", " 至 "));
                }
                else {
                    $("#UseTimeRange").html("永久有效");
                }
                $("#WriteDate").html(ModelCouponsIssueMsg.WriteDate);

                //优惠券信息
                $("#CouponsTitle").html(ModelCouponsMsg.CouponsTitle);
                $("#CouponsDesc").html(ModelCouponsMsg.CouponsDesc);
                $("#UseMoney").html("&#165;" + ModelCouponsMsg.UseMoney);
                $("#UseDiscount").html(ModelCouponsMsg.UseDiscount + "折");

                var _IsOfflineUse = "否";
                if (ModelCouponsMsg.IsOfflineUse == "true") {
                    _IsOfflineUse = "是";
                }
                $("#IsOfflineUse").html(_IsOfflineUse);

                //订单信息
                //判断是否为线下使用
                if (_jsonReTxt.IsOfflineUse == "true") {
                    $("#OrderDt").html("线下核销验证使用-无订单信息");
                }
                $("#OrderID").html(OrderMsg.OrderID);
                $("#OrderStatus").html(OrderMsg.OrderStatus);
                $("#OrderPrice").html(OrderMsg.OrderPrice);
                $("#OrderUseMoney").html(OrderMsg.UseMoney);
                $("#IssueIDArr").html(OrderMsg.IssueIDArr);
                $("#SeeOrderDetail").attr("href", "../TradingPage/OrderDetail?OID=" + OrderMsg.OrderID);

            }
        }
    });



}