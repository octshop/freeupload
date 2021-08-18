//================买家登录页============================//

/**-----定义公共变量------**/

//AjaxURL
var mAjaxUrl = "../LoginAjax/Buyer";

//是否正在发送Http请求
var mIsHttpCheck = false;
//定时器
var mTimer = null;
//计数器 以60开始
var mCountNum = 60;

//买家分享商品返佣KeyEn
var mKeyEn = "";


/**-------------------初始化-----------------------------**/
$(function () {

    mKeyEn = $("#hidKeyEn").val().trim();

});

/**
 * 买家手机号登录请求
 * */
function loginBuyerMobile() {

    //获取表单值
    var BindMobile = $("#BindMobile").val().trim();
    var VerifyCode = $("#VerifyCode").val().trim();

    var hidBackUrl = $("#hidBackUrl").val().trim();

    if (BindMobile == "" || VerifyCode == "") {
        toastWin("【手机号】和【短信验证码】不能为空！");
        return;
    }

    //构造POST参数
    var dataPOST = {
        "Type": "1", "ToMobileNumber": BindMobile, "SmsVerifyCode": VerifyCode,
    };
    console.log(dataPOST);

    //正式发送Http就直接返回
    if (mIsHttpCheck == true) {
        return;
    }
    mIsHttpCheck = true;
    $("#MobileLoginB").html("登录中…");


    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: mAjaxUrl + "?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log(reTxt);

            //Http请求发送完成
            mIsHttpCheck = false;
            $("#MobileLoginB").html("手机登录");

            if (reTxt != "") {
                var _jsonReTxt = JSON.parse(reTxt);
                //错误提示
                if (_jsonReTxt.ErrMsg != "" && _jsonReTxt.ErrMsg != null && _jsonReTxt.ErrMsg != undefined) {
                    toastWin(_jsonReTxt.ErrMsg);
                    return;
                }
                //登录成功
                if (_jsonReTxt.Msg != "" && _jsonReTxt.Msg != null && _jsonReTxt.Msg != undefined) {

                    if (hidBackUrl != "") {
                        console.log(hidBackUrl);

                        if (mKeyEn != "") {
                            hidBackUrl = hidBackUrl + "&KeyEn=" + mKeyEn;
                        }

                        window.location.href = hidBackUrl;
                    }
                    else {
                        window.location.href = "../Buyer/Index";
                    }
                    return;
                }
            }
        }
    });
}

/**
 * 得到短信验证码
 * */
function getSmsVerifyCode() {

    //获取登录表单值
    var BindMobile = $("#BindMobile").val().trim();

    if (BindMobile == "" || VerifyCode == "") {
        toastWin("请输入【手机号】！");
        $("#BindMobile").focus();
        return;
    }

    //构造POST参数
    var dataPOST = {
        "Type": "1", "ToMobileNumbers": BindMobile, "SmsType": "Login",
    };
    console.log(dataPOST);

    //正式发送Http就直接返回
    if (mIsHttpCheck == true) {
        return;
    }
    mIsHttpCheck = true;

    $("#BtnSpanGetVerifyCode").hide();
    $("#BtnSpanReSetVerifyCode").show();
    $("#VerifyCode").val("");


    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: "../SmsAjax/Index?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("得到短信验证码=" + reTxt);

            //Http请求发送完成
            mIsHttpCheck = false;

            if (reTxt != "") {

                if (reTxt == "12") {
                    toastWin("手机号码错误,请检查！");
                    $("#BindMobile").focus();


                    $("#BtnSpanGetVerifyCode").show();
                    $("#BtnSpanReSetVerifyCode").hide();
                    $("#VerifyCode").val("");


                    return;
                }

                var _jsonReTxt = JSON.parse(reTxt);
                //alert(reTxt);

                if (_jsonReTxt.ErrMsg != "" && _jsonReTxt.ErrMsg != null && _jsonReTxt.ErrMsg != undefined) {

                    toastWin(_jsonReTxt.ErrMsg);
                    return;

                }

                if (_jsonReTxt.Msg != "" && _jsonReTxt.Msg != null && _jsonReTxt.Msg != undefined) {

                    $("#BtnSpanGetVerifyCode").hide();
                    $("#BtnSpanReSetVerifyCode").show();
                    $("#VerifyCode").val("");

                    //启动定时器读秒
                    timerSecond();

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
 * 启动定时器
 * */
function timerSecond() {

    clearInterval(mTimer);
    mTimer = null;
    mTimer = undefined;

    mTimer = setInterval(function () {

        if (mCountNum <= 0) {
            clearInterval(mTimer);
            mTimer = null;
            mTimer = undefined;
            //重置计数器
            mCountNum = 60;

            $("#BtnSpanGetVerifyCode").show();
            $("#BtnSpanReSetVerifyCode").hide();

            return
        }

        mCountNum--;
        $("#TimerSecondI").html(mCountNum + "s");

    }, 1000);

}