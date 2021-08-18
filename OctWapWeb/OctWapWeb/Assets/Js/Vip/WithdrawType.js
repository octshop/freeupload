//===========选择提现方式====================================//

/**-----定义公共变量------**/
//AjaxURL
var mAjaxUrl = "../VipAjax/WithdrawSubmit";



/**------初始化------**/
$(function () {

    //得到最新没有完成的提现信息ID
    recentNoFinishWithDrawID(function () {



    });

});




/**------自定义函数------**/

/**
 * 得到最新没有完成的提现信息ID
 * */
function recentNoFinishWithDrawID(pCallBack) {

    //构造GET参数
    var dataPOST = {
        "Type": "4",
    };
    //正式发送GET请求
    $.ajax({
        type: "POST",
        url: mAjaxUrl + "?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log(" 得到最新没有完成的提现信息ID=" + reTxt);
            //回调
            pCallBack();

            if (reTxt != "") {
                //转换为Json对象
                var _jsonReTxt = JSON.parse(reTxt);
                if (_jsonReTxt.RecentNoFinishWithDrawID != 0) {
                    window.location.href = "../Vip/WithdrawDetail?WDID=" + _jsonReTxt.RecentNoFinishWithDrawID;
                }
            }
        },
        error: function (xhr, errorTxt, status) {
            console.log("异步请求错误，errorTxt=" + errorTxt + " | status=" + status);
            return;
        }
    });

}
