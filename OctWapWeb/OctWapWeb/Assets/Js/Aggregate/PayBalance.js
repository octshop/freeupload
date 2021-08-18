//================余额支付=========================//

/**-----定义公共变量------**/
var mAjaxUrl = "../AggregateAjax/PayBalance";

var mShopID = "";
var mShopUserID = "";

//当前买家余额
var mCurrentBalance = 0;

/**------初始化------**/
$(function () {

    mShopID = $("#hidShopID").val().trim();


    //加载店铺简单信息
    loadShopMsgSimple();

    //得到用户当前的可用余额
    initCurrentBalance();


    //文本框事件，获取当文本框获取了焦点，按了键盘事件
    $("#OrderPrice").keydown(function (event) {

        //alert(event.keyCode);
        if (event.keyCode == "13") {

            payAggregateOrder();

            return false;
        }

    });


});


//===============自定义函数======================//

/**
 * 加载店铺简单信息
 * */
function loadShopMsgSimple() {


    if (mShopID == "" || mShopID == "0") {
        return;
    }

    //构造POST参数
    var dataPOST = {
        "Type": "1", "ShopID": mShopID,
    };
    console.log(dataPOST);

    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: "../AggregateAjax/Index?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("加载店铺简单信息=" + reTxt);

            if (reTxt != "") {
                var _jsonReTxt = JSON.parse(reTxt);
                if (_jsonReTxt.ShopID != 0) {
                    $("#ShopHeaderImg").attr("src", "//" + _jsonReTxt.ShopHeaderImg);
                    $("#ShopName").html(_jsonReTxt.ShopName);

                    mShopUserID = _jsonReTxt.UserID;
                }
                else {
                    window.location.href = "../Mall/Index";
                }
            }


        }


    });
}

/**
 * 得到用户当前的可用余额
 * */
function initCurrentBalance() {

    //构造POST参数
    var dataPOST = {
        "Type": "1",
    };
    console.log(dataPOST);
    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: "../VipAjax/Index?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log(reTxt);
            if (reTxt != "") {
                var _jsonReTxt = JSON.parse(reTxt);

                //赋值当前用户余额
                $("#CurrentBalanceB").html("&#165;" + _jsonReTxt.CurrentBalance);

                mCurrentBalance = parseFloat(_jsonReTxt.CurrentBalance);

            }
        }
    });
}


/**
 * 立即余额支付
 * */
function payAggregateOrder() {

    if (mShopUserID == "" || mShopUserID == "0") {
        toastWin("商家信息错误，请重新扫码刷新！");
        return;
    }

    //获取表单值
    var OrderPrice = $("#OrderPrice").val().trim();

    if (OrderPrice == "") {
        toastWin("请输入支付金额！");
        $("#OrderPrice").focus();
        return;
    }
    if (isNaN(OrderPrice)) {
        toastWin("支付金额必须是数字！");
        $("#OrderPrice").focus();
        return;
    }

    if (parseFloat(OrderPrice) <= 0) {
        toastWin("支付金额必须大于0！");
        $("#OrderPrice").focus();
        return;
    }

    //判断余额是否足够
    var _currentBalance = $("#CurrentBalanceB").html().replace("¥", "").trim();
    //console.log(_currentBalance);
    if (parseFloat(_currentBalance) < parseFloat(OrderPrice)) {
        toastWin("当前可用余额不足！");
        $("#OrderPrice").focus();
        return;
    }



    var PayWay = "Balance"; //余额支付方式


    //构造POST参数
    var dataPOST = {
        "Type": "1", "OrderPrice": OrderPrice, "ShopUserID": mShopUserID, "PayWay": PayWay,
    };
    console.log(dataPOST);

    //加载提示
    $("#BtnPay").attr("disabled", true);
    $("#BtnPay").val("…支付中…");

    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: "../AggregateAjax/PayDirect?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("立即余额支付=" + reTxt);

            if (reTxt != "") {
                var _jsonReTxt = JSON.parse(reTxt);

                if (_jsonReTxt.ErrMsg != "" && _jsonReTxt.ErrMsg != null && _jsonReTxt.ErrMsg != undefined) {

                    //移除加载提示
                    $("#BtnPay").attr("disabled", false);
                    $("#BtnPay").val("立即余额支付");

                    toastWin(_jsonReTxt.ErrMsg);
                    return;
                }

                if (_jsonReTxt.Msg != "" && _jsonReTxt.Msg != null && _jsonReTxt.Msg != undefined) {

                    $("#OrderPrice").val("");


                    //支付成功跳转页
                    window.location.href = _jsonReTxt.DataDic.PayRedirectURL;
                    return;
                }
            }
        }
    });
}

