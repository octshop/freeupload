//==================买家余额提现处理==========================//

/**-----------定义公共变量----------**/

//AjaxURL
var mAjaxUrl = "../Trading/BuyerWithDraw";

var mWithDrawID = "";
var mBuyerUserID = "";

/**----------------初始化-------------**/
$(function () {

    mWithDrawID = $("#hidWithDrawID").val().trim();

    //初始化买家提现详细CMS版
    initBuyerWithDrawDetail();

});


/**-------------自定义函数-----------**/

/**
 * 初始化买家提现详细CMS版
 * */
function initBuyerWithDrawDetail() {

    //构造POST参数
    var dataPOST = {
        "Type": "2", "WithDrawID": mWithDrawID,
    };
    console.log(dataPOST);

    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: mAjaxUrl + "?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("初始化详情(CMS版)=" + reTxt);

            if (reTxt != "") {
                var _jsonReTxt = JSON.parse(reTxt);

                //状态显示
                if (_jsonReTxt.WithDrawStatus == "完成") {
                    $("#StatusTtitle").html("提现完成");
                    $("#StatusDesc").html("提现处理已完成");
                    $(".order-status").css("background", "#43B743");

                    $("#BtnSubmitDD").hide();
                    $("#WithDrawMemoTxtArea").attr("disabled", true);
                }
                else {
                    $("#BtnSubmitDD").show();
                }
                $("#WithDrawAmtB").html("&#165;" + _jsonReTxt.WithDrawAmt);
                $("#ToTypeB").html(_jsonReTxt.ToTypeName);
                $("#WithDrawID").html(_jsonReTxt.WithDrawID);
                $("#SerialNumber").html(_jsonReTxt.SerialNumber);
                $("#WithDrawStatus").html(_jsonReTxt.WithDrawStatus);
                $("#TrueName").html(_jsonReTxt.TrueName);
                $("#LinkMobile").html(_jsonReTxt.LinkMobile);
                $("#WeChatAccount").html(_jsonReTxt.WeChatAccount);
                $("#AlipayAccount").html(_jsonReTxt.AlipayAccount);
                $("#BankCardNumber").html(_jsonReTxt.BankCardNumber);
                $("#BankAccName").html(_jsonReTxt.BankAccName);
                $("#OpeningBank").html(_jsonReTxt.OpeningBank);
                $("#WxOpenID").html(_jsonReTxt.WxOpenID);
                $("#WxUnionID").html(_jsonReTxt.WxUnionID);
                $("#WriteDate").html(_jsonReTxt.WriteDate);
                $("#FinishDate").html(_jsonReTxt.FinishDate);
                $("#WithDrawMemoTxtArea").html(_jsonReTxt.WithDrawMemo);


                mBuyerUserID = _jsonReTxt.BuyerUserID;

                //买家信息
                $("#BuyerUserID").html(_jsonReTxt.BuyerUserID);
                $("#UserNick").html("<img src=\"" + _jsonReTxt.HeaderImg + "\" /> " + _jsonReTxt.UserNick + "");
                $("#BindMobile").html(_jsonReTxt.BindMobile);
                $("#CreditScore").html(_jsonReTxt.CreditScore);
                $("#VipLevel").html(_jsonReTxt.VipLevel);

                //提现到什么地方 ( 微信钱包 WeChat， 支付宝 Alipay ，银行卡 Bank )
                if (_jsonReTxt.ToType == "WeChat") {
                    $("#BtnCompanyWxPay").show();
                    $("#BtnCompanyAliPay").hide();
                }
                else if (_jsonReTxt.ToType == "Alipay") {
                    $("#BtnCompanyWxPay").hide();
                    $("#BtnCompanyAliPay").show();
                }
            }
        },
        error: function (xhr, errorTxt, status) {
            console.log("异步请求错误，errorTxt=" + errorTxt + " | status=" + status);
            return;
        }
    });
}

/**
 * 完成买家提现处理
 * */
function finishBuyerWithDraw() {

    if (mWithDrawID == "") {
        return;
    }

    confirmWinWidth("确定已将金额提现给买家了吗？", function () {

        //获取表单值
        var WithDrawMemo = $("#WithDrawMemoTxtArea").val().trim();


        //构造POST参数
        var dataPOST = {
            "Type": "3", "WithDrawID": mWithDrawID, "WithDrawMemo": WithDrawMemo, "BuyerUserID": mBuyerUserID,
        };
        console.log(dataPOST);

        $("#BtnCompanyPayedPerson").val("…处理中…");
        $("#BtnCompanyPayedPerson").attr("disabled", true);

        //正式发送异步请求
        $.ajax({
            type: "POST",
            url: mAjaxUrl + "?rnd=" + Math.random(),
            data: dataPOST,
            dataType: "html",
            success: function (reTxt, status, xhr) {
                console.log("完成买家提现处理=" + reTxt);

                $("#BtnCompanyPayedPerson").val("已提现到个人");
                $("#BtnCompanyPayedPerson").attr("disabled", false);

                if (reTxt != "") {
                    var _jsonReTxt = JSON.parse(reTxt);

                    if (_jsonReTxt.ErrMsg != "" && _jsonReTxt.ErrMsg != null && _jsonReTxt.ErrMsg != undefined) {
                        toastWin(_jsonReTxt.ErrMsg);
                        return;
                    }

                    if (_jsonReTxt.Msg != "" && _jsonReTxt.Msg != null && _jsonReTxt.Msg != undefined) {
                        toastWinCb(_jsonReTxt.Msg, function () {
                            //刷新页面
                            window.location.reload();
                        });
                        return;
                    }

                }
            },
            error: function (xhr, errorTxt, status) {
                console.log("异步请求错误，errorTxt=" + errorTxt + " | status=" + status);
                return;
            }
        });
    }, 400);


}

/**
 * 微信企业付款到个人，完成买家提现处理
 * */
function sendWxCompanyPay() {

    if (mWithDrawID == "") {
        return;
    }

    confirmWinWidth("确定要微信付款到个人吗？", function () {

        //获取表单值
        var WithDrawMemo = $("#WithDrawMemoTxtArea").val().trim();


        //构造POST参数
        var dataPOST = {
            "Type": "4", "WithDrawID": mWithDrawID, "WithDrawMemo": WithDrawMemo, "BuyerUserID": mBuyerUserID,
        };
        console.log(dataPOST);

        $("#BtnCompanyWxPay").val("…处理中…");
        $("#BtnCompanyWxPay").attr("disabled", true);

        //正式发送异步请求
        $.ajax({
            type: "POST",
            url: mAjaxUrl + "?rnd=" + Math.random(),
            data: dataPOST,
            dataType: "html",
            success: function (reTxt, status, xhr) {
                console.log("完成买家提现处理=" + reTxt);

                $("#BtnCompanyWxPay").val("企业付款到微信钱包");
                $("#BtnCompanyWxPay").attr("disabled", false);

                if (reTxt != "") {
                    var _jsonReTxt = JSON.parse(reTxt);

                    if (_jsonReTxt.ErrMsg != "" && _jsonReTxt.ErrMsg != null && _jsonReTxt.ErrMsg != undefined) {
                        toastWin(_jsonReTxt.ErrMsg);
                        return;
                    }

                    if (_jsonReTxt.Msg != "" && _jsonReTxt.Msg != null && _jsonReTxt.Msg != undefined) {
                        toastWinCb(_jsonReTxt.Msg, function () {
                            //刷新页面
                            window.location.reload();
                        });
                        return;
                    }
                }
            },
            error: function (xhr, errorTxt, status) {
                console.log("异步请求错误，errorTxt=" + errorTxt + " | status=" + status);
                return;
            }
        });
    }, 400);


}




/**
 * 转账到支付宝账户，完成买家提现处理
 * */
function sendAlipayCompanyTransPerson() {

    if (mWithDrawID == "") {
        return;
    }

    confirmWinWidth("确定要转账到支付宝账户吗？", function () {

        //获取表单值
        var WithDrawMemo = $("#WithDrawMemoTxtArea").val().trim();


        //构造POST参数
        var dataPOST = {
            "Type": "5", "WithDrawID": mWithDrawID, "WithDrawMemo": WithDrawMemo, "BuyerUserID": mBuyerUserID,
        };
        console.log(dataPOST);

        $("#BtnCompanyAliPay").val("…处理中…");
        $("#BtnCompanyAliPay").attr("disabled", true);

        //正式发送异步请求
        $.ajax({
            type: "POST",
            url: mAjaxUrl + "?rnd=" + Math.random(),
            data: dataPOST,
            dataType: "html",
            success: function (reTxt, status, xhr) {
                console.log("完成买家提现处理=" + reTxt);

                $("#BtnCompanyAliPay").val("转账到支付宝账户");
                $("#BtnCompanyAliPay").attr("disabled", false);

                if (reTxt != "") {
                    var _jsonReTxt = JSON.parse(reTxt);

                    if (_jsonReTxt.ErrMsg != "" && _jsonReTxt.ErrMsg != null && _jsonReTxt.ErrMsg != undefined) {
                        toastWin(_jsonReTxt.ErrMsg);
                        return;
                    }

                    if (_jsonReTxt.Msg != "" && _jsonReTxt.Msg != null && _jsonReTxt.Msg != undefined) {
                        toastWinCb(_jsonReTxt.Msg, function () {
                            //刷新页面
                            window.location.reload();
                        });
                        return;
                    }
                }
            },
            error: function (xhr, errorTxt, status) {
                console.log("异步请求错误，errorTxt=" + errorTxt + " | status=" + status);
                return;
            }
        });
    }, 400);


}


