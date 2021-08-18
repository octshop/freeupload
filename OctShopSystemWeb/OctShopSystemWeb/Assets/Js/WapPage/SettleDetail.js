//====================结算详情===========================//

/**-----定义公共变量------**/
//AjaxURL
var mAjaxUrl = "../Settle/SettleDetail";

//结算单ID
var mSettleID = "";

/**------初始化------**/
$(function () {

    mSettleID = $("#hidSettleID").val().trim();

    //初始化商家结算申请信息
    initSettleApplyDetail(function () {


    });

});


//===================自定义函数===========================//

/**
 * 初始化商家结算申请信息
 * */
function initSettleApplyDetail(pCallBack) {

    if (mSettleID == "" || mSettleID == "0") {
        return;
    }

    //构造POST参数
    var dataPOST = {
        "Type": "3", "SettleID": mSettleID
    };
    console.log(dataPOST);

    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: mAjaxUrl + "?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("初始化商家结算申请信息=" + reTxt);

            //回调函数
            pCallBack();

            if (reTxt != "") {
                var _jsonReTxt = JSON.parse(reTxt);

                //为表单赋值
                //状态区
                if (_jsonReTxt.SettleStatus == "处理中") {
                    $("#StatusTtitle").html("结算处理中");
                    $("#StatusDesc").html("结算申请对账处理中，请保持联系电话畅通。");
                    $(".order-status").css("background", "#FF6A00");
                }
                else if (_jsonReTxt.SettleStatus == "完成") {
                    $("#StatusTtitle").html("结算完成");
                    $("#StatusDesc").html("结算申请处理完成，结算转账成功，请核对是否收到结算转账金额！");
                    $(".order-status").css("background", "#00BC40");
                }

                //结算转账金额
                var _SettleTransSum = parseFloat(_jsonReTxt.ApplySettleMoney) - parseFloat(_jsonReTxt.SumCommissionMoney);
                $("#SettleTransSum").html("&#165;" + formatNumberDotDigit(_SettleTransSum, 2) + "");

                $("#SettleID").html(_jsonReTxt.SettleID);
                $("#ApplySettleMoney").html("&#165;" + _jsonReTxt.ApplySettleMoney);
                $("#MallOrderSettleMoney").html("&#165;" + _jsonReTxt.MallOrderSettleMoney);
                $("#AggreOrderSettleMoney").html("&#165;" + _jsonReTxt.AggreOrderSettleMoney);

                $("#SumCommissionMoney").html("&#165;" + _jsonReTxt.SumCommissionMoney);
                $("#CountSettleOrder").html(_jsonReTxt.CountSettleOrder);
                $("#MallCountSettleOrder").html(_jsonReTxt.CountSettleMallOrder);
                $("#AggreCountSettleOrder").html(_jsonReTxt.CountSettleAggreOrder);

                $("#ApplyName").html(_jsonReTxt.ApplyName);
                $("#ApplyTel").html(_jsonReTxt.ApplyTel);
                $("#ApplyDate").html(_jsonReTxt.ApplyDate);

                //结算处理完成
                if (_jsonReTxt.SettleStatus == "完成") {
                    $("#RealTransSum").html("&#165;" + _jsonReTxt.RealTransSum + "");
                    $("#DisposeMan").html(_jsonReTxt.DisposeMan);
                    $("#DisposeDate").html(_jsonReTxt.DisposeDate);

                    var myJsValTransferVoucherImg = " <a href=\"" + _jsonReTxt.TransferVoucherImg + "\" target=\"_blank\"><img src=\"//" + _jsonReTxt.TransferVoucherImg + "\" /></a>";
                    $("#TransferVoucherImg").html(myJsValTransferVoucherImg);
                }


            }
        },
        error: function (xhr, errorTxt, status) {
            console.log("异步请求错误，errorTxt=" + errorTxt + " | status=" + status);
            return;
        }
    });

}


