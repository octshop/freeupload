//=====================礼品内容详情======================//

/**---------定义公共变量-----------**/

//AjaxURL
var mAjaxUrl = "../PresentAjax/PresentDetail";

var mPID = ""; //礼品ID

/**------初始化------**/
$(function () {

    mPID = $("#hidPID").val().trim();

    //初始化 礼品描述
    initPresentDesc();

});

/**
 * 初始化 礼品描述
 * */
function initPresentDesc() {
    //构造POST参数
    var dataPOST = {
        "Type": "2", "PID": mPID,
    };
    console.log(dataPOST);
    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: mAjaxUrl + "?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("初始化 礼品描述=" + reTxt);
            if (reTxt != "") {
                var _jsonReTxt = JSON.parse(reTxt);

                $("#PresentDescDiv").html(_jsonReTxt.PresentDesc);
            }
        }
    });
}