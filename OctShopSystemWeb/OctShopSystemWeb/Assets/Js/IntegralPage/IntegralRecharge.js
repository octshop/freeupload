//=================商家充积分=======================//

/**-----定义公共变量------**/

//AjaxURL
var mAjaxUrl = "../Integral/IntegralRecharge";
//定义定时器
var mTimer = null;

/**------初始化------**/
$(function () {

    //统计当前商家积分,总收入减去总支出
    sumCurrentIntegralShop();

});

/**
 * 创建支付扫码图片信息
 * */
function createPayScanImg() {

    //获取表单值
    var RechargeIntegralTxt = $("#RechargeIntegralTxt").val().trim();
    if (RechargeIntegralTxt == "") {
        toastWin("请输入充值金额！");
        $("#RechargeIntegralTxt").focus();
        return;
    }

    //构造POST参数
    var dataPOST = {
        "Type": "1", "RechargePrice": RechargeIntegralTxt,
    };
    console.log(dataPOST);

    $("#BtnCreatePayScanImg").html("…支付生成中…");
    $("#BtnCreatePayScanImg").attr("disabled", true);

    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: mAjaxUrl + "?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("创建支付扫码图片信息=" + reTxt);

            $("#BtnCreatePayScanImg").html("立即支付");
            $("#BtnCreatePayScanImg").attr("disabled", false);


            if (reTxt != "") {
                var _jsonReTxt = JSON.parse(reTxt);

                //错误信息
                if (_jsonReTxt.ErrMsg != "" && _jsonReTxt.ErrMsg != undefined && _jsonReTxt.ErrMsg != null) {
                    toastWin(_jsonReTxt.ErrMsg);
                    return;
                }

                if (_jsonReTxt.Msg != "" && _jsonReTxt.Msg != undefined && _jsonReTxt.Msg != null) {

                    //显示扫码支付区
                    $(".pay-content").show();
                    toastWin(_jsonReTxt.Msg);

                    //显示支付二维码
                    $("#WxPayScanA").attr("href", _jsonReTxt.DataDic.WxPayScanImgOutputURL);
                    $("#WxPayScanImg").attr("src", _jsonReTxt.DataDic.WxPayScanImgOutputURL);

                    $("#AlipayScanA").attr("href", _jsonReTxt.DataDic.AlipayScanImgOutputURL);
                    $("#AlipayScanImg").attr("src", _jsonReTxt.DataDic.AlipayScanImgOutputURL);


                    //判断是否存在未支付的充积分订单记录
                    existNoPayIntegralRechargeOrder();


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

/**
 * 显示与隐藏扫码支付区
 * */
function hidePayScanImgDiv() {
    //var _displayStyle = $(".pay-content").get(0).style.display;
    //console.log("_displayStyle=" + _displayStyle);
    $(".pay-content").hide();

    //清除定时器
    clearTimeout(mTimer);
    mTimer = null;

}

/**
 * 判断是否存在未支付的充积分订单记录
 * */
function existNoPayIntegralRechargeOrder() {

    //构造POST参数
    var dataPOST = {
        "Type": "2",
    };
    console.log(dataPOST);

    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: mAjaxUrl + "?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("判断是否存在未支付的充积分订单记录=" + reTxt);
            //清除定时器
            clearTimeout(mTimer);
            mTimer = null;

            if (reTxt != "") {
                var _jsonReTxt = JSON.parse(reTxt);

                //错误信息 存在 未支付的充积分订单记录
                if (_jsonReTxt.ErrMsg != "" && _jsonReTxt.ErrMsg != undefined && _jsonReTxt.ErrMsg != null) {

                    //不存在 未支付的充积分订单记录 跳转到明细页
                    window.location.href = "../IntegralPage/IntegralMy";

                    return;
                }

                if (_jsonReTxt.Msg != "" && _jsonReTxt.Msg != undefined && _jsonReTxt.Msg != null) {

                       //开始定时器
                    mTimer = setTimeout(function () {

                        //判断是否存在未支付的充积分订单记录
                        existNoPayIntegralRechargeOrder();

                    }, 4000);

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

/**
 * 统计当前商家积分,总收入减去总支出
 * */
function sumCurrentIntegralShop() {

    //构造POST参数
    var dataPOST = {
        "Type": "3",
    };
    console.log(dataPOST);

    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: mAjaxUrl + "?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("统计当前商家积分=" + reTxt);
            //清除定时器
            clearTimeout(mTimer);
            mTimer = null;

            if (reTxt != "") {
                var _jsonReTxt = JSON.parse(reTxt);
                $("#ShopCurrentIntegralB").html(_jsonReTxt.CurrentIntegral);
            }
        },
        error: function (xhr, errorTxt, status) {
            console.log("异步请求错误，errorTxt=" + errorTxt + " | status=" + status);
            return;
        }
    });

}