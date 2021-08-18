//==================登录首页========================//

//AjaxURL 
var mAjaxUrl = "../Login/Index";

//判断是否为移动端 true / false
var mhidIsMobileOS = "";

//是否正在发送Http请求
var mIsHttpCheck = false;
//定时器
var mTimer = null;
//计数器 以60开始
var mCountNum = 60;

/**------初始化------**/
$(function () {

    mhidIsMobileOS = $("#hidIsMobileOS").val().trim();


});

/*********************自定义函数********************* */

/**
 * 登录类型的切换
 * @param {any} pLoginType Mobile 手机登录，Acc 账号登录
 */
function chgLoginType(pLoginType) {

    //手机登录
    if (pLoginType == "Mobile") {
        $("#AccLogin").hide();
        $("#MobileLogin").show();
    }
    else //账号登录
    {
        $("#AccLogin").show();
        $("#MobileLogin").hide();
    }
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
 * 用户登录验证 (Acc 账号登录，手机短信登录)
 * */
function userLogin(pLoginVerifyType) {

    //获取表单值
    var UserAccount = $("#UserAccount").val().trim();
    var LoginPwd = $("#LoginPwd").val().trim();

    var BindMobile = $("#BindMobile").val().trim();
    var VerifyCode = $("#VerifyCode").val().trim();

    if (pLoginVerifyType == "Acc") {

        if (UserAccount == "" || LoginPwd == "") {
            toastWin("【手机号】和【登录密码】不能为空！");
            return;
        }
    }
    else if (pLoginVerifyType == "Mobile") {
        if (BindMobile == "" || VerifyCode == "") {
            toastWin("【手机号】和【短信验证码】不能为空！");
            return;
        }
    }

    $("#AccLoginB").html("登录中…")
    $("#MobileLoginB").html("登录中…")


    //构造POST参数
    var dataPOST = {
        "Type": "1", "UserAccount": UserAccount, "LoginPwd": LoginPwd, "BindMobile": BindMobile, "SmsVerifyCode": VerifyCode, "LoginVerifyType": pLoginVerifyType,
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
        url: mAjaxUrl + "?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("用户登录验证=" + reTxt);

            //Http请求发送完成
            mIsHttpCheck = false;

            if (reTxt != "") {

                $("#AccLoginB").html("账号登录")
                $("#MobileLoginB").html("手机登录");

                var _jsonReTxt = JSON.parse(reTxt);

                //登录成功
                if (_jsonReTxt.Msg != "" && _jsonReTxt.Msg != null && _jsonReTxt.Msg != undefined) {
                    var hidBackUrl = $("#hidBackUrl").val().trim();
                    //alert(hidBackUrl);
                    if (hidBackUrl != "") {

                        top.window.location.href = hidBackUrl;
                    }
                    else {

                        if (mhidIsMobileOS == "true") {
                            top.window.location.href = "../WapPage/Index";
                        }
                        else {
                            top.window.location.href = "../CmsFrame/Index";
                        }

                    }
                    return;
                }
                //登录失败
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

