//=====================赠品内容详情======================//

/**---------定义公共变量-----------**/

//AjaxURL
var mAjaxUrl = "../GoodsAjax/GiftDetail";

var mGIID = ""; //赠品ID

/**------初始化------**/
$(function () {

    mGIID = $("#hidGIID").val().trim();

    //初始化 赠品描述
    initGiftDesc();

});

/**
 * 初始化 赠品描述
 * */
function initGiftDesc() {
    //构造POST参数
    var dataPOST = {
        "Type": "2", "GIID": mGIID,
    };
    console.log(dataPOST);
    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: mAjaxUrl + "?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("初始化赠品描述=" + reTxt);
            if (reTxt != "") {
                var _jsonReTxt = JSON.parse(reTxt);

                $("#PresentDescDiv").html(_jsonReTxt.GiftDesc);
            }
        }
    });
}