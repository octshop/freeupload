//============余额积分详情=================//

/**-----定义公共变量------**/

//AjaxURL
var mAjaxUrl = "../VipAjax/BalanceIntegral";


/**------初始化------**/
$(function () {

    //得到买家所有的余额和积分信息
    loadBuyerAllCurBalanceIntegral();

});


/**
 * 得到买家所有的余额和积分信息
 * */
function loadBuyerAllCurBalanceIntegral() {
    //构造GET参数
    var dataPOST = {
        "Type": "3",
    };
    //正式发送GET请求
    $.ajax({
        type: "POST",
        url: "../VipAjax/Index?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("得到买家所有的余额和积分信息=" + reTxt);
            if (reTxt != "") {

                //转换为Json对象
                var _jsonReTxt = JSON.parse(reTxt);

                //前端显示
                $("#CurBalance").html(_jsonReTxt.CurBalance);
                $("#CurBalanceDividend").html(_jsonReTxt.CurBalanceDividend);

                $("#CurIntegral").html(_jsonReTxt.CurIntegral);
                $("#CurIntegralDividend").html(_jsonReTxt.CurIntegralDividend);
            }
        },
        error: function (xhr, errorTxt, status) {
            console.log("异步请求错误，errorTxt=" + errorTxt + " | status=" + status);
            return;
        }
    });
}

/**
 * 将买家当前所有的【分润余额】转入【账户余额】
 * */
function transDividendToAccBalance() {

    //阻止冒泡
    event.stopPropagation();

    if (parseFloat($("#CurBalanceDividend").html()) <= 0) {
        toastWin("分润余额为零,不能转入！");
        return;
    }

    confirmWinWidth("确定要转入吗？", function () {

        //加载提示
        $("#BtnTransBalance").val("…转入中…");
        $("#BtnTransBalance").attr("disabled", true);

        //构造GET参数
        var dataPOST = {
            "Type": "1",
        };
        //正式发送GET请求
        $.ajax({
            type: "POST",
            url: mAjaxUrl + "?rnd=" + Math.random(),
            data: dataPOST,
            dataType: "html",
            success: function (reTxt, status, xhr) {
                console.log("将买家当前所有的【分润余额】转入【账户余额】=" + reTxt);

                //移除加载提示
                $("#BtnTransBalance").val("转入账户余额");
                $("#BtnTransBalance").attr("disabled", false);

                if (reTxt != "") {

                    //转换为Json对象
                    var _jsonReTxt = JSON.parse(reTxt);

                    if (_jsonReTxt.ErrMsg != undefined && _jsonReTxt.ErrMsg != null && _jsonReTxt.ErrMsg != "") {
                        toastWin(_jsonReTxt.ErrMsg);
                        return;
                    }

                    if (_jsonReTxt.Msg != undefined && _jsonReTxt.Msg != null && _jsonReTxt.Msg != "") {
                        toastWin(_jsonReTxt.Msg);
                        //更改显示
                        var _CurBalance = parseFloat($("#CurBalance").html());
                        var _transCurBalance = _CurBalance + parseFloat($("#CurBalanceDividend").html());
                        $("#CurBalance").html(formatNumberDotDigit(_transCurBalance, 2));
                        $("#CurBalanceDividend").html("0.00");

                        return;
                    }

                }
            },
            error: function (xhr, errorTxt, status) {
                console.log("异步请求错误，errorTxt=" + errorTxt + " | status=" + status);
                return;
            }
        });


    }, 300);

}


/**
 * 将买家当前所有的【分润积分】转入【账户积分】
 * */
function transDividendToAccIntegral() {

    //阻止冒泡
    event.stopPropagation();

    if (parseFloat($("#CurIntegralDividend").html()) <= 0) {
        toastWin("分润积分为零,不能转入！");
        return;
    }

    confirmWinWidth("确定要转入吗？", function () {

        //加载提示
        $("#BtnTransIntegral").val("…转入中…");
        $("#BtnTransIntegral").attr("disabled", true);

        //构造GET参数
        var dataPOST = {
            "Type": "2",
        };
        //正式发送GET请求
        $.ajax({
            type: "POST",
            url: mAjaxUrl + "?rnd=" + Math.random(),
            data: dataPOST,
            dataType: "html",
            success: function (reTxt, status, xhr) {
                console.log("将买家当前所有的【分润积分】转入【账户积分】=" + reTxt);

                //移除加载提示
                $("#BtnTransIntegral").val("转入账户积分");
                $("#BtnTransIntegral").attr("disabled", false);

                if (reTxt != "") {

                    //转换为Json对象
                    var _jsonReTxt = JSON.parse(reTxt);

                    if (_jsonReTxt.ErrMsg != undefined && _jsonReTxt.ErrMsg != null && _jsonReTxt.ErrMsg != "") {
                        toastWin(_jsonReTxt.ErrMsg);
                        return;
                    }

                    if (_jsonReTxt.Msg != undefined && _jsonReTxt.Msg != null && _jsonReTxt.Msg != "") {
                        toastWin(_jsonReTxt.Msg);
                        //更改显示
                        var _CurIntegral = parseFloat($("#CurIntegral").html());
                        var _transCurIntegral = _CurIntegral + parseFloat($("#CurIntegralDividend").html());
                        $("#CurIntegral").html(formatNumberDotDigit(_transCurIntegral, 2));
                        $("#CurIntegralDividend").html("0.00");

                        return;
                    }

                }
            },
            error: function (xhr, errorTxt, status) {
                console.log("异步请求错误，errorTxt=" + errorTxt + " | status=" + status);
                return;
            }
        });


    }, 300);

}



