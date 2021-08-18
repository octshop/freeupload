/*=================== 后台管理框架---数据处理脚本 ===========================*/

/************** 公共变量与配置参数 ***************/



/*************** 初始化 *********************/
$(function () {

    //统计平台通知信息和 系统异常信息 未读总数
    countPlatformSystemNoRead();

    //初始化 CMS管理用户信息
    initAdminUserMsg();

});



/********************* 自定义函数 *********************/

/**
 * 初始化 CMS管理用户信息
 * */
function initAdminUserMsg() {
    //构造POST参数
    var dataPOST = {
        "Type": "6",
    };
    console.log(dataPOST);

    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: "../Sys/Index?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("初始化 CMS管理用户信息=" + reTxt);

            if (reTxt != "") {
                var _jsonReTxt = JSON.parse(reTxt);

                $("#AdUserTypeNameB").html("<br />" + _jsonReTxt.AdUserTypeName);
                $("#AdUserNameB").html("<br />" + _jsonReTxt.AdUserName);
                $("#WriteDateB").html("<br />" + _jsonReTxt.WriteDate);

            }
        },
        error: function (xhr, errorTxt, status) {
            console.log("异步请求错误，errorTxt=" + errorTxt + " | status=" + status);
            return;
        }
    });
}

/**
 * 安全退出登录
 * */
function ExitSafeLogin() {

    if (confirm("确定要退出吗？") == false) {
        return;
    }

    //构造POST参数
    var dataPOST = {
        "Type": "2",
    };
    console.log(dataPOST);

    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: "../Login/Index?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("安全退出登录=" + reTxt);
            if (reTxt != "") {

                window.location.href = "../LoginPage/Index";
            }
        },
        error: function (xhr, errorTxt, status) {
            console.log("异步请求错误，errorTxt=" + errorTxt + " | status=" + status);
            return;
        }
    });

}

/**
 * 统计平台通知信息和 系统异常信息 未读总数
 * */
function countPlatformSystemNoRead() {

    //构造POST参数
    var dataPOST = {
        "Type": "5",
    };
    console.log(dataPOST);

    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: "../Sys/Index?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("统计平台通知信息和 系统异常信息 未读总数=" + reTxt);

            if (reTxt != "") {
                var _jsonReTxt = JSON.parse(reTxt);

                $("#PlatformMsgNoRead").html(_jsonReTxt.PlatformMsgNoRead);
                $("#SystemMsgNoRead").html(_jsonReTxt.SystemMsgNoRead);

                var _sumCount = 0;
                if (_jsonReTxt.PlatformMsgNoRead.indexOf("…") < 0) {
                    _sumCount += parseInt(_jsonReTxt.PlatformMsgNoRead);
                }
                if (_jsonReTxt.SystemMsgNoRead.indexOf("…") < 0) {
                    _sumCount += parseInt(_jsonReTxt.SystemMsgNoRead);
                }
                $("#SumCountMsgNoRead").html(_sumCount);

            }
        },
        error: function (xhr, errorTxt, status) {
            console.log("异步请求错误，errorTxt=" + errorTxt + " | status=" + status);
            return;
        }
    });
}
