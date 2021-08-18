/*===================问题类型说明 - 详情========================*/

/**-----定义公共变量------**/
var mAjaxUrl = "../BuyerAjax/OfficialService";

var mExplainID = "";
var mExplainType = "";
var mExplainTitle = "";

/**------初始化------**/
$(function () {

    mExplainID = $("#hidExplainID").val().trim();
    mExplainType = $("#hidExplainType").val().trim();
    mExplainTitle = $("#hidExplainTitle").val().trim();

    //初始化说明性文本内容
    initExplainText();

});


/**
 * 初始化说明性文本内容
 * */
function initExplainText() {
    //构造GET参数
    var dataPOST = {
        "Type": "2", "ExplainID": mExplainID, "ExplainType": mExplainType, "ExplainTitle": mExplainTitle
    };
    //正式发送GET请求
    $.ajax({
        type: "POST",
        url: mAjaxUrl + "?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("初始化说明性文本内容=" + reTxt);
            if (reTxt != "") {
                //转换为Json对象
                var _jsonReTxt = JSON.parse(reTxt);

                $("#ExplainTitle").html(_jsonReTxt.ExplainTitle);
                $("#PageTitle").html(_jsonReTxt.ExplainTitle);
                $("#ExplainContent").html(_jsonReTxt.ExplainContent);

            }
        },
        error: function (xhr, errorTxt, status) {
            console.log("异步请求错误，errorTxt=" + errorTxt + " | status=" + status);
            return;
        }
    });
}