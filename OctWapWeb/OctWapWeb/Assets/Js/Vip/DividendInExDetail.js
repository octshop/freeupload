//================== 分润 余额与积分 收支详情============================//

/**-----定义公共变量------**/
var mAjaxUrl = "../VipAjax/DividendInExDetail";

//余额信息ID
var mInExMsgID = "";
//积分信息ID
var mIntegralID = "";

/**------初始化------**/
$(function () {

    mInExMsgID = $("#hidInExMsgID").val().trim();
    mIntegralID = $("#hidIntegralID").val().trim();

    if (mInExMsgID != "" && mInExMsgID != "0") {

        $("#InExTitleB").html("分润余额收支详情");

        //初始化买家收支详情 - 分润 余额详细
        initBuyerIncomeExpenseDetailDividend();
    }

    if (mIntegralID != "" && mIntegralID != "0") {

        $("#InExTitleB").html("分润积分收支详情");

        //初始化买家收支详情 - 分润 积分详细
        initBuyerIntegralDetailDividend();

    }


});

/**
 * 初始化买家收支详情 - 分润 余额详细
 * */
function initBuyerIncomeExpenseDetailDividend() {

    //构造GET参数
    var dataPOST = {
        "Type": "1", "InExMsgID": mInExMsgID
    };
    //正式发送GET请求
    $.ajax({
        type: "POST",
        url: mAjaxUrl + "?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log(" 初始化买家收支详情分润余额详细=" + reTxt);
            if (reTxt != "") {

                //转换为Json对象
                var _jsonReTxt = JSON.parse(reTxt);

                //显示代码
                $("#InExMsgID").html(_jsonReTxt.InExMsgID);
                $("#InExType").html(_jsonReTxt.InExType);

                if (parseFloat(_jsonReTxt.IncomeSum) > 0) {
                    $("#IncomeExpenseTtile").html("收入：");
                    $("#IncomeExpenseSum").html("+" + _jsonReTxt.IncomeSum);
                }
                else {
                    $("#IncomeExpenseTtile").html("支出：");
                    $("#IncomeExpenseSum").html("-" + _jsonReTxt.ExpenseSum);
                }
                $("#WriteDate").html(_jsonReTxt.WriteDate);

                $("#CurrentBalanceType").html(" 余额：");
                $("#CurrentBalance").html(_jsonReTxt.CurrentBalance);
                $("#InExMemo").html(_jsonReTxt.InExMemo);

            }
        },
        error: function (xhr, errorTxt, status) {
            console.log("异步请求错误，errorTxt=" + errorTxt + " | status=" + status);
            return;
        }
    });
}


/**
 * 初始化买家收支详情 - 分润积分详细
 * */
function initBuyerIntegralDetailDividend() {

    //构造GET参数
    var dataPOST = {
        "Type": "2", "IntegralID": mIntegralID
    };
    //正式发送GET请求
    $.ajax({
        type: "POST",
        url: mAjaxUrl + "?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("初始化买家收支详情分润积分详细=" + reTxt);
            if (reTxt != "") {

                //转换为Json对象
                var _jsonReTxt = JSON.parse(reTxt);

                //显示代码
                $("#InExMsgID").html(_jsonReTxt.IntegralID);
                $("#InExType").html(_jsonReTxt.InExType);

                if (parseFloat(_jsonReTxt.IncomeSum) > 0) {
                    $("#IncomeExpenseTtile").html("收入：");
                    $("#IncomeExpenseSum").html("+" + _jsonReTxt.IncomeSum);
                }
                else {
                    $("#IncomeExpenseTtile").html("支出：");
                    $("#IncomeExpenseSum").html("-" + _jsonReTxt.ExpenseSum);
                }
                $("#WriteDate").html(_jsonReTxt.WriteDate);

                $("#CurrentBalanceType").html(" 积分：");
                $("#CurrentBalance").html(_jsonReTxt.CurrentBalance);
                $("#InExMemo").html(_jsonReTxt.InExMemo);

            }
        },
        error: function (xhr, errorTxt, status) {
            console.log("异步请求错误，errorTxt=" + errorTxt + " | status=" + status);
            return;
        }
    });
}


