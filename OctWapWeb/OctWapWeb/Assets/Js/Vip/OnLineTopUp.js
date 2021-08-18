//===================在线充值 ======================//

/**-----定义公共变量------**/
//AjaxURL
var mAjaxUrl = "../VipAjax/OnLineTopUp";

var mRechargeID = "";
//支付方式
var mPayType = "WeChat";

/**------初始化------**/
$(function () {

    //搜索文本框事件，获取当文本框获取了焦点，按了键盘事件
    $("#RechargeAmt").keydown(function (event) {

        //alert(event.keyCode);
        if (event.keyCode == "13") {

            addBuyerRecharge();

            return false;
        }

    });


});


/**------自定义函数------**/

/**
 * 切换充值支付方式
 * @param {any} pType 从什么充值 ( 微信钱包 WeChat， 支付宝 Alipay ，银行卡 Bank )
 */
function chgPayType(pType) {

    mPayType = pType;

    if (pType == "WeChat") {
        $("#WxPayImg").attr("src", "../Assets/Imgs/Icon/sel_yes.png");
        $("#AlipayImg").attr("src", "../Assets/Imgs/Icon/sel_no.png");
    }
    else if (pType == "Alipay") {
        $("#AlipayImg").attr("src", "../Assets/Imgs/Icon/sel_yes.png");
        $("#WxPayImg").attr("src", "../Assets/Imgs/Icon/sel_no.png");
    }
    console.log("mPayType=" + mPayType);
}

/**
 * 添加买家充值信息
 * */
function addBuyerRecharge() {

    if (mPayType == "") {
        return;
    }

    //获取表单值
    var RechargeAmt = $("#RechargeAmt").val().trim();
    if (RechargeAmt == "") {
        toastWin("充值金额不能为空！");
        $("#RechargeAmt").focus();
        return;
    }
    if (isNaN(RechargeAmt)) {
        toastWin("充值金额必须是数字！");
        $("#RechargeAmt").focus();
        return;
    }
    if (parseFloat(RechargeAmt) <= 0) {
        toastWin("充值金额必须大于零！");
        return;
    }

    //构造GET参数
    var dataPOST = {
        "Type": "1", "RechargeAmt": RechargeAmt, "FromType": mPayType,
    };

    //加载提示
    $("#BtnRecharge").val("…提交中…");
    $("#BtnRecharge").attr("disabled", true);
    console.log(dataPOST);

    //正式发送GET请求
    $.ajax({
        type: "POST",
        url: mAjaxUrl + "?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("添加买家充值信息=" + reTxt);

            //移除加载提示
            $("#BtnRecharge").val("立即充值");
            $("#BtnRecharge").attr("disabled", false);

            if (reTxt != "") {
                //转换为Json对象
                var _jsonReTxt = JSON.parse(reTxt);

                if (_jsonReTxt.ErrMsg != "" && _jsonReTxt.ErrMsg != null && _jsonReTxt.ErrMsg != undefined) {
                    toastWin(_jsonReTxt.ErrMsg);
                    return;
                }

                if (_jsonReTxt.Msg != "" && _jsonReTxt.Msg != null && _jsonReTxt.Msg != undefined) {

                    //跳转到支付页
                    window.location.href = _jsonReTxt.DataDic.PayRedirectURL;

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