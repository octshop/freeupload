//====================模拟支付=======================//

/**-----定义公共变量------**/
//AjaxURL
var mAjaxUrl = "../PayPubAjax/SimulatePay";

/**------初始化------**/
$(function () {

    
});


/**
 * 模拟支付
 * */
function SimulatePay() {

    //获取表单值
    var hidBillNumber = $("#hidBillNumber").val().trim();
    var hidUserKeyID = $("#hidUserKeyID").val().trim();
    var hidPayWay = $("#hidPayWay").val().trim();

    //构造POST参数
    var dataPOST = {
        "Type": "1", "PayWay": hidPayWay, "BillNumber": hidBillNumber, "UserKeyID": hidUserKeyID,
    };
    console.log(dataPOST);
    //加载提示
    $("#BtnSimulatePay").attr("disabled", true);
    $("#BtnSimulatePay").val("…模拟支付中…");

    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: mAjaxUrl + "?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log(reTxt);

            $("#BtnSimulatePay").attr("disabled", false);
            $("#BtnSimulatePay").val("立即模拟支付");

            if (reTxt != "") {
                var _jsonReTxt = JSON.parse(reTxt);

                //错误信息
                if (_jsonReTxt.ErrMsg != null && _jsonReTxt.ErrMsg != "") {
                    toastWin(_jsonReTxt.ErrMsg);
                    return;
                }

                if (_jsonReTxt.Msg != null && _jsonReTxt.Msg != "") {
                    //跳转到支付成功页
                    window.location.href = _jsonReTxt.DataDic.ReturnUrl;
                }
              
            }
            else {
                           }
        }
    });

}