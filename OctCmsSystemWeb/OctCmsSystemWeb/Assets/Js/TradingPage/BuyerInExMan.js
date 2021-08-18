//===================会员账户余额管理==========================//

/**-----定义公共变量------**/

//AjaxURL
var mAjaxUrl = "../Trading/BuyerInExMan";


/**------初始化------**/
$(function () {



});

/**------自定义函数------**/

/**
 * 得到用户的当前等级和信用分 还有会员账号信息
 * */
function initUserVipLevelUserMsg() {

    var BindMobile = $("#BindMobile").val().trim();

    $("#UserNick").html("");
    $("#VipLevel").html("");
    $("#CreditScore").html("");

    if (BindMobile.length != 11) {
        return;
    }

    //构造POST参数
    var dataPOST = {
        "Type": "5", "BindMobile": BindMobile, "IsMaskMobile": "false",
    };
    console.log(dataPOST);

    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: "../UserGoodsShop/UserAccount?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("得到用户的当前等级和信用分 还有会员账号信息=" + reTxt);

            if (reTxt != "") {
                var _jsonReTxt = JSON.parse(reTxt);

                $("#UserNick").html(_jsonReTxt.UserNick);
                $("#VipLevel").html(_jsonReTxt.VipLevelName);
                $("#CreditScore").html(_jsonReTxt.CreditScoreLevelName + "(" + _jsonReTxt.CreditScore + ")");
            }
            else {
                $("#UserNick").html("");
                $("#VipLevel").html("");
                $("#CreditScore").html("");
            }
        },
        error: function (xhr, errorTxt, status) {
            console.log("异步请求错误，errorTxt=" + errorTxt + " | status=" + status);
            return;
        }
    });
}

/**
 * 平台管理增减买家用户的余额收支
 * */
function AddReduceBuyerInExPlatform() {

    //获取表单值
    var InExType = $("#InExType").val().trim();
    var AddReduceSum = $("#AddReduceSum").val().trim();
    var BindMobile = $("#BindMobile").val().trim();
    var InExMemo = $("#InExMemo").val().trim();

    if (AddReduceSum == "" || AddReduceSum <= 0) {
        toastWin("金额必须大于0！");
        $("#AddReduceSum").focus();
        return;
    }
    if (BindMobile.length != 11) {
        toastWin("手机号输入错误！");
        $("#BindMobile").focus();
        return;
    }

    if ($("#VipLevel").html().trim() == "") {
        toastWin("绑定手机错误，不存在此的用户！");
        $("#BindMobile").focus();
        return;
    }


    //构造POST参数
    var dataPOST = {
        "Type": "1", "BindMobile": BindMobile, "AddReduceSum": AddReduceSum, "InExType": InExType, "InExMemo": InExMemo,
    };
    console.log(dataPOST);

    //加载提示
    $("#BtnSubmit").val("…执行中…");
    $("#BtnSubmit").attr("disabled", true);

    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: mAjaxUrl + "?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("平台管理增减买家用户的余额收支=" + reTxt);

            if (reTxt != "") {
                var _jsonReTxt = JSON.parse(reTxt);

                if (_jsonReTxt.Msg != "" && _jsonReTxt.Msg != null && _jsonReTxt.Msg != undefined) {
                    toastWinCb(_jsonReTxt.Msg, function () {

                        $("#BindMobile").val("");

                        window.location.href = "../TradingPage/BuyerIncomeExpense?UID=" + _jsonReTxt.DataDic.BuyerUserID + "";

                    });
                    return;
                }

                if (_jsonReTxt.ErrMsg != "" && _jsonReTxt.ErrMsg != null && _jsonReTxt.ErrMsg != undefined) {
                    $("#BtnSubmit").val("立即执行");
                    $("#BtnSubmit").attr("disabled", false);
                    toastWin(_jsonReTxt.ErrMsg);
                    return;
                }
            }
        },
        error: function (xhr, errorTxt, status) {
            console.log("异步请求错误，errorTxt=" + errorTxt + " | status=" + status);
            return;
        }
    });


}