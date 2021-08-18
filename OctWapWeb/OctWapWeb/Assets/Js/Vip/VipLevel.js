//==============会员等级=========================//

/**-----定义公共变量------**/
//AjaxURL
var mAjaxUrl = "../VipAjax/VipLevel";



/**------初始化------**/
$(function () {

    //得到用户的当前等级和信用分
    loadUserVipLevelMsg()

    //加载指定类型的说明性文本
    loadExplainTextList();

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
        url: "../VipAjax/Index?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("得到用户的当前等级和信用分=" + reTxt);
            if (reTxt != "") {

                //转换为Json对象
                var _jsonReTxt = JSON.parse(reTxt);

                $("#CreditScore").html(_jsonReTxt.CreditScore);
                $("#CreditScoreLevelName").html(_jsonReTxt.CreditScoreLevelName);
                $("#VipLevelName").html(_jsonReTxt.VipLevelName);
                $("#CreditScoreBottom").html("信用分:" + _jsonReTxt.CreditScore);
            }
        },
        error: function (xhr, errorTxt, status) {
            console.log("异步请求错误，errorTxt=" + errorTxt + " | status=" + status);
            return;
        }
    });
}

/**
 * 加载指定类型的说明性文本
 * */
function loadExplainTextList() {
    //构造GET参数
    var dataPOST = {
        "Type": "1", "ExplainType":"VipLevel^CreditScore",
    };
    //正式发送GET请求
    $.ajax({
        type: "POST",
        url: mAjaxUrl + "?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("加载指定类型的说明性文本=" + reTxt);
            if (reTxt != "") {

                //转换为Json对象
                var _jsonReTxt = JSON.parse(reTxt);
                //列表
                var ExplainTextList = _jsonReTxt.ExplainTextList;

                for (var i = 0; i < ExplainTextList.length; i++) {

                    if (ExplainTextList[i].ExplainTitle.indexOf("信用分") >= 0) {
                        $("#ExplainContent_VipLevel").html(ExplainTextList[i].ExplainContent);
                    }
                    if (ExplainTextList[i].ExplainTitle.indexOf("会员等级") >= 0) {
                        $("#ExplainContent_CreditScore").html(ExplainTextList[i].ExplainContent);
                    }
                }
                
            }
        },
        error: function (xhr, errorTxt, status) {
            console.log("异步请求错误，errorTxt=" + errorTxt + " | status=" + status);
            return;
        }
    });
}