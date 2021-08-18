//===================登录密码设置========================//

//AjaxURL 
var mAjaxUrl = "../Login/Index";

//是否正在发送Http请求
var mIsHttpCheck = false;


/**------初始化------**/
$(function () {



});

/*********************自定义函数********************* */


/**
 * 重设登录密码
 * */
function chgUserLoginPwd() {


    //获取表单值
    var LoginPwdOld = $("#LoginPwdOld").val().trim();
    var LoginPwdNew = $("#LoginPwdNew").val().trim();
    var LoginPwdCon = $("#LoginPwdCon").val().trim();

    if (LoginPwdOld == "" || LoginPwdNew == "" || LoginPwdCon == "") {
        toastWin("所有项都必须填写！");
        return;
    }
    if (LoginPwdNew.length < 6) {
        toastWin("登录密码必须6个字符以上！");
        return;
    }
    if (LoginPwdNew != LoginPwdCon) {
        toastWin("两次输入的新密码不一致！");
        return;
    }

    $("#BtnResetLoginPwd").html("重设中…")

    //构造POST参数
    var dataPOST = {
        "Type": "3", "AdUserPwdOld": LoginPwdOld, "AdUserPwdNew": LoginPwdNew, 
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
        url: "../Login/Index?rnd=" + Math.random(),
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
