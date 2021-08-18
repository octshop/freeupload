//===================登录密码设置========================//

//AjaxURL 
var mAjaxUrl = "../Login/Index";

//是否正在发送Http请求
var mIsHttpCheck = false;
//定时器
var mTimer = null;
//计数器 以60开始
var mCountNum = 60;

/**------初始化------**/
$(function () {

    //初始化店铺用户的信息 -- 绑定的手机号信息
    initShopUserMsg();

});

/*********************自定义函数********************* */

/**
 * 初始化店铺用户的信息 -- 绑定的手机号信息
 * */
function initShopUserMsg() {
    //构造POST参数
    var dataPOST = {
        "Type": "8", "IsMaskMobile": "false",
    };
    console.log(dataPOST);

    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: "../Shop/ShopMsg?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("初始化店铺用户的信息=" + reTxt);

            if (reTxt != "") {
                var _jsonReTxt = JSON.parse(reTxt);

                $("#BindMobile").val(_jsonReTxt.BindMobile);
                $("#hidUserID").val(_jsonReTxt.UserID);

            }
        },
        error: function (xhr, errorTxt, status) {
            console.log("异步请求错误，errorTxt=" + errorTxt + " | status=" + status);
            return;
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
        //$("#BindMobile").focus();
        return;
    }

    //构造POST参数
    var dataPOST = {
        "Type": "1", "ToMobileNumbers": BindMobile, "SmsType": "ChgLoginPwd",
    };
    console.log(dataPOST);

    //正式发送Http就直接返回
    if (mIsHttpCheck == true) {
        return;
    }
    mIsHttpCheck = true;

    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: "../Sms/Index?rnd=" + Math.random(),
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
                    $("#VerifyCode").val();

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

/**
 * 重设登录密码
 * */
function chgUserLoginPwd() {


    //获取表单值
    var BindMobile = $("#BindMobile").val().trim();
    var LoginPwdNew = $("#LoginPwdNew").val().trim();
    var VerifyCode = $("#VerifyCode").val().trim();

    if (LoginPwdNew == "" || VerifyCode == "") {
        toastWin("【新的登录密码】和【短信验证码】不能为空！");
        return;
    }
    if (LoginPwdNew.length < 6) {
        toastWin("登录密码必须6个字符以上！");
        return;
    }

    $("#BtnResetLoginPwd").html("重设中…")

    //构造POST参数
    var dataPOST = {
        "Type": "6", "BindMobile": BindMobile, "LoginPwdNew": LoginPwdNew, "SmsVerifyCode": VerifyCode,
    };
    console.log(dataPOST);

    //正式发送Http就直接返回
    if (mIsHttpCheck == true) {
        return;
    }
    mIsHttpCheck = true;


    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: "../Sys/Index?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("重设登录密码=" + reTxt);

            //Http请求发送完成
            mIsHttpCheck = false;

            if (reTxt != "") {

                $("#BtnResetLoginPwd").html("重设登录密码");

                var _jsonReTxt = JSON.parse(reTxt);

                //重设成功
                if (_jsonReTxt.Msg != "" && _jsonReTxt.Msg != null && _jsonReTxt.Msg != undefined) {

                    toastWinCb(_jsonReTxt.Msg, function () {
                        top.window.location.href = "../LoginPage/Index?BackUrl=../CmsFrame/Index";
                    });

                    return;
                }
                //重设失败
                if (_jsonReTxt.ErrMsg != "" && _jsonReTxt.ErrMsg != null && _jsonReTxt.ErrMsg != undefined) {
                    toastWin(_jsonReTxt.ErrMsg);
                    return;
                }

            }
            else {

            }
        },
        error: function (xhr, errorTxt, status) {
            console.log("异步请求错误，errorTxt=" + errorTxt + " | status=" + status);
            return;
        }
    });


}
