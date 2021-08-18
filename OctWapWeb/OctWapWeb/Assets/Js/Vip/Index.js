//==============余额/虎点=========================//

/**-----定义公共变量------**/

//AjaxURL
var mAjaxUrl = "../VipAjax/Index";

var mBuyerUserID = ""; //买家UserID


/**------初始化------**/
$(function () {

    //得到买家所有的余额和积分信息
    loadBuyerAllCurBalanceIntegral();

    //得到用户的当前等级和信用分
    loadUserVipLevelMsg();

});


/**------自定义函数------**/

/**
 * 得到用户的当前等级和信用分
 * */
function loadUserVipLevelMsg() {
    //构造GET参数
    var dataPOST = {
        "Type": "2",
    };
    //正式发送GET请求
    $.ajax({
        type: "POST",
        url: mAjaxUrl + "?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("得到用户的当前等级和信用分=" + reTxt);
            if (reTxt != "") {

                //转换为Json对象
                var _jsonReTxt = JSON.parse(reTxt);
                $("#UserVipLevelMsgDiv").html("( " + _jsonReTxt.VipLevelName + "，信用分：" + _jsonReTxt.CreditScore +" )");
              

            }
        },
        error: function (xhr, errorTxt, status) {
            console.log("异步请求错误，errorTxt=" + errorTxt + " | status=" + status);
            return;
        }
    });
}

/**
 * 得到买家所有的余额和积分信息
 * */
function loadBuyerAllCurBalanceIntegral() {
    //构造GET参数
    var dataPOST = {
        "Type": "3",
    };
    //正式发送GET请求
    $.ajax({
        type: "POST",
        url: mAjaxUrl + "?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("得到买家所有的余额和积分信息=" + reTxt);
            if (reTxt != "") {

                //转换为Json对象
                var _jsonReTxt = JSON.parse(reTxt);

                //前端显示
                $("#CurBalance").html(_jsonReTxt.CurBalance);
                $("#CurBalanceDividend").html(_jsonReTxt.CurBalanceDividend);

                $("#CurIntegral").html(_jsonReTxt.CurIntegral);
                $("#CurIntegralDividend").html(_jsonReTxt.CurIntegralDividend);


            }
        },
        error: function (xhr, errorTxt, status) {
            console.log("异步请求错误，errorTxt=" + errorTxt + " | status=" + status);
            return;
        }
    });
}

