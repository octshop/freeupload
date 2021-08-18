//==============提现详情=========================//

/**-----定义公共变量------**/
//AjaxURL
var mAjaxUrl = "../VipAjax/WithdrawSubmit";

var mWithDrawID = "";


/**------初始化------**/
$(function () {

    mWithDrawID = $("#hidWithDrawID").val().trim();

    //初始化买家提现详细
    initBuyerWithDrawDetail();

});


/**------自定义函数------**/

/**
 * 初始化买家提现详细
 * */
function initBuyerWithDrawDetail() {

    if (mWithDrawID == "") {
        return;
    }

    //构造GET参数
    var dataPOST = {
        "Type": "5", "WithDrawID": mWithDrawID,
    };
    //正式发送GET请求
    $.ajax({
        type: "POST",
        url: mAjaxUrl + "?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("初始化买家提现详细=" + reTxt);
            if (reTxt != "") {
                //转换为Json对象
                var _jsonReTxt = JSON.parse(reTxt);

                if (_jsonReTxt.WithDrawStatus == "完成") {
                    window.location.href = "../Vip/BalanceIntegral";
                }

                //显示代码插入前台
                if (_jsonReTxt.WriteDate != "" && _jsonReTxt.WriteDate != null) {
                    $("#StepTime1").html(_jsonReTxt.WriteDate.split(" ")[0]);
                    $("#StepTime2").html(_jsonReTxt.WriteDate.split(" ")[0]);
                }

                $("#CurrentBalanceBuyer").html(_jsonReTxt.CurrentBalanceBuyer);
                $("#WithDrawAmt").html(_jsonReTxt.WithDrawAmt);

                //提现到什么地方 ( 微信钱包 WeChat， 支付宝 Alipay ，银行卡 Bank )
                if (_jsonReTxt.ToType == "WeChat") {
                    $("#WeChatAlipayUl").show();
                    $("#BankUl").hide();

                    $("#WeChatAccountLi").show();
                    $("#AlipayAccountLi").hide();

                    $("#ToTypeName").html(" ( " + _jsonReTxt.ToTypeName + " )");
                    $("#WeChatAccount").html(_jsonReTxt.WeChatAccount);

                    $("#TrueName").html(_jsonReTxt.TrueName);
                    $("#LinkMobile").html(_jsonReTxt.LinkMobile);
                }
                else if (_jsonReTxt.ToType == "Alipay") {
                    $("#WeChatAlipayUl").show();
                    $("#BankUl").hide();

                    $("#WeChatAccountLi").hide();
                    $("#AlipayAccountLi").show();

                    $("#ToTypeName").html(" ( " + _jsonReTxt.ToTypeName + " )");
                    $("#AlipayAccount").html(_jsonReTxt.AlipayAccount);

                    $("#TrueName").html(_jsonReTxt.TrueName);
                    $("#LinkMobile").html(_jsonReTxt.LinkMobile);
                }
                else if (_jsonReTxt.ToType == "Bank") {

                    $("#WeChatAlipayUl").hide();
                    $("#BankUl").show();

                    $("#WeChatAccountLi").hide();
                    $("#AlipayAccountLi").hide();

                    $("#BankCardNumber").html(" ( " + _jsonReTxt.BankCardNumber + " )");
                    $("#BankAccName").html(_jsonReTxt.BankAccName);

                    $("#OpeningBank").html(_jsonReTxt.OpeningBank);
                    $("#LinkMobileBank").html(_jsonReTxt.LinkMobile);
                }




            }
        },
        error: function (xhr, errorTxt, status) {
            console.log("异步请求错误，errorTxt=" + errorTxt + " | status=" + status);
            return;
        }
    });

}