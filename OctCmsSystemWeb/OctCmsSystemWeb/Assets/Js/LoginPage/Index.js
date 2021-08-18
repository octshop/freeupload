//==================商城平台管理系统登录========================//

//AjaxURL 
var mAjaxUrl = "../Login/Index";


//是否正在发送Http请求
var mIsHttpCheck = false;

var mhidBackUrl = "";

var mhidIsMobileOS = "";


/**------初始化------**/
$(function () {

    mhidBackUrl = $("#hidBackUrl").val().trim();
    mhidIsMobileOS = $("#hidIsMobileOS").val().trim();

});

/*********************自定义函数********************* */

/**
 * 管理用户登录
 * */
function chkAdminUserLogin() {

    //获取表单值
    var AdUserName = $("#AdUserName").val().trim();
    var AdUserPwd = $("#AdUserPwd").val().trim();

    if (AdUserName == "" || AdUserPwd == "") {
        toastWin("【用户名】【登录密码】都不能为空！");
        return;
    }

    //构造POST参数
    var dataPOST = {
        "Type": "1", "AdUserName": AdUserName, "AdUserPwd": AdUserPwd,
    };
    console.log(dataPOST);

    if (mIsHttpCheck == true) {
        return;
    }

    //加载提示
    $("#AccLoginB").html("登录中…");
    mIsHttpCheck = true;

    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: mAjaxUrl + "?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("管理用户登录=" + reTxt);

            //移除加载提示
            $("#AccLoginB").html("账号登录");
            mIsHttpCheck = false;

            if (reTxt != "") {
                var _jsonReTxt = JSON.parse(reTxt);

                if (_jsonReTxt.ErrMsg != "" && _jsonReTxt.ErrMsg != null && _jsonReTxt.ErrMsg != undefined) {
                    toastWin(_jsonReTxt.ErrMsg);
                    return;
                }

                if (_jsonReTxt.Msg != "" && _jsonReTxt.Msg != null && _jsonReTxt.Msg != undefined) {
                    //跳转到相关地址
                    if (mhidBackUrl != "") {
                        window.location.href = mhidBackUrl;
                    }
                    else {
                        if (mhidIsMobileOS == "true") {
                            window.location.href = "../NavPage/Index";
                        }
                        else {
                            window.location.href = "../CmsFrame/Index";
                        }
                    }
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