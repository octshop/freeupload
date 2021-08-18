//================绑定手机(更改)============================//

/**-----定义公共变量------**/

//AjaxURL
var mAjaxUrl = "../SettingAjax/Index";

//是否正在发送Http请求
var mIsHttpCheck = false;
//定时器
var mTimer = null;
//计数器 以60开始
var mCountNum = 60;


/**---------------初始化----------------------**/
$(function () {

    $("#BindMobile").focus();

});

/**
 * 买家手机号绑定（更改）请求
 * */
function bindBuyerMobile() {

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
    $("#MobileLoginB").html("绑定中…");


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
            $("#MobileLoginB").html("绑定手机");

            if (reTxt != "") {
                var _jsonReTxt = JSON.parse(reTxt);
                //错误提示
                if (_jsonReTxt.ErrMsg != "" && _jsonReTxt.ErrMsg != null && _jsonReTxt.ErrMsg != undefined) {

                    //手机号已被绑定，请先登录冻结此手机账号，再进行绑定！
                    if (_jsonReTxt.ErrCode == "EBM_01_02") {

                        confirmWin(_jsonReTxt.ErrMsg + "（冻结操作：我的->设置->冻结账号）【是否重新登录？】", function () {

                            //退出登录
                            exitLogin();

                        });
                    }
                    else {

                        //手机号被绑定并且存在第三方注册信息（如：有微信小程序 OPENDID，没有微信公众号OPENDID）
                        if (_jsonReTxt.ErrCode == "EBM_01_05") {

                            //处理手机号被绑定并且存在第三方注册信息 - 【有微信小程序 OPENDID，没有微信公众号OPENDID 】
                            proBindMobileMiniOpenIDNoWxOpenID(_jsonReTxt.DataDic.LoginUserID, BindMobile)

                            //直接登录 OctBindMobileUserCookie
                            loginUserCookie(_jsonReTxt.DataDic.OctBindMobileUserCookie);
                            return;
                        }

                        if (_jsonReTxt.ErrCode.indexOf("EBM_01_") >= 0) {
                            //EBM_01_08
                            if (_jsonReTxt.ErrCode == "EBM_01_08") {

                                //直接登录 OctBindMobileUserCookie
                                loginUserCookie(_jsonReTxt.DataDic.OctBindMobileUserCookie);
                                return;
                            }

                            confirmWinCCb("手机号已被绑定，是否用被绑定手机：【" + BindMobile + "】 登录?", function () {

                                //直接登录 OctBindMobileUserCookie
                                loginUserCookie(_jsonReTxt.DataDic.OctBindMobileUserCookie);


                            }, function () {


                            });
                            return;
                        }

                        //其他错误
                        toastWin(_jsonReTxt.ErrMsg);
                        return;
                    }
                    return;
                }
                //成功
                if (_jsonReTxt.Msg != "" && _jsonReTxt.Msg != null && _jsonReTxt.Msg != undefined) {

                    toastWinCb(_jsonReTxt.Msg, function () {

                        if (hidBackUrl != "") {
                            console.log(hidBackUrl);
                            window.location.href = hidBackUrl;
                        }
                        else {
                            window.location.href = "../Buyer/Index";
                        }

                    });

                    return;
                }
            }
        }
    });
}

/**
 * 直接登录 OctBindMobileUserCookie
 * @param {any} pOctBindMobileUserCookie
 */
function loginUserCookie(pOctBindMobileUserCookie) {

    //构造POST参数
    var dataPOST = {
        "Type": "3", "OctBindMobileUserCookie": pOctBindMobileUserCookie,
    };
    console.log(dataPOST);


    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: "../LoginAjax/Buyer?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("直接登录 OctBindMobileUserCookie=" + reTxt);

            if (reTxt != "") {

                if (reTxt == "31") {

                    //跳转到会员中心
                    window.location.href = "../Buyer/Index";
                    return;
                }
                else {
                    toastWinCb("登录失败，请重试", function () {
                        window.location.reload();
                    });
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
 * 处理手机号被绑定并且存在第三方注册信息 - 【有微信小程序 OPENDID，没有微信公众号OPENDID 】
 * @param {any} pLoginUserID
 * @param {any} pBindMobile
 */
function proBindMobileMiniOpenIDNoWxOpenID(pLoginUserID, pBindMobile) {

    //构造POST参数
    var dataPOST = {
        "Type": "4", "LoginUserID": pLoginUserID, "BindMobile": pBindMobile,
    };
    console.log(dataPOST);


    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: "../LoginAjax/Buyer?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("处理手机号被绑定并且存在第三方注册信息 - 【有微信小程序 OPENDID，没有微信公众号OPENDID 】=" + reTxt);

            if (reTxt != "") {


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
        $("#BindMobile").focus();
        return;
    }

    //构造POST参数
    var dataPOST = {
        "Type": "1", "ToMobileNumbers": BindMobile, "SmsType": "BindMobile",
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

                    $("#BtnSpanGetVerifyCode").show();
                    $("#BtnSpanReSetVerifyCode").hide();
                    $("#VerifyCode").val("");


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

/**
 * 退出登录
 * */
function exitLogin() {

    //构造POST参数
    var dataPOST = {
        "Type": "2",
    };
    console.log(dataPOST);
    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: "../LoginAjax/Buyer?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("退出登录=" + reTxt);
            if (reTxt != "") {

                if (reTxt == "21") {
                    //toastWinCb("退出成功！", function () {
                    window.location.href = "../Login/Buyer?ExitLogin=true";
                    //});
                }

            }
        }
    });

}

