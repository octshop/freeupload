//=============买家设置========================//


/**-----定义公共变量------**/
var mAjaxUrl = "../BuyerAjax/Setting";



/**------初始化------**/
$(function () {

    //判断买家账号是否可以冻结
    isAbleFreezeUserAccount();

});


/**------自定义函数------**/

/**
 * 冻结账号账户
 * */
function freezeUserAccount() {

    confirmWin("确定要冻结账号吗？", function () {

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
                console.log("冻结账号账户=" + reTxt);
                if (reTxt != "") {
                    var _jsonReTxt = JSON.parse(reTxt);

                    if (_jsonReTxt.ErrMsg != "" && _jsonReTxt.ErrMsg != null && _jsonReTxtErr.Msg != undefined) {

                        toastWin(_jsonReTxt.ErrMsg);
                        return;
                    }

                    if (_jsonReTxt.Msg != "" && _jsonReTxt.Msg != null && _jsonReTxt.Msg != undefined) {

                        //退出登录
                        exitLogin('false');
                        return;
                    }

                }
            }
        });

    });
}

/**
 * 判断买家账号是否可以冻结
 * */
function isAbleFreezeUserAccount() {

    //构造POST参数
    var dataPOST = {
        "Type": "1",
    };
    console.log(dataPOST);
    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: mAjaxUrl + "?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("判断买家账号是否可以冻结=" + reTxt);
            if (reTxt != "") {
                var _jsonReTxt = JSON.parse(reTxt);

                if (_jsonReTxt.Msg != "" && _jsonReTxt.Msg != null && _jsonReTxt.Msg != undefined) {
                    $("#AbleFreezeUserAccount").show();
                }

            }
        }
    });

}

/**
 * 退出登录
 * */
function exitLogin(pIsConfirm = "true") {

    if (pIsConfirm == "true") {

        confirmWin("确定要退出吗?", function () {

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


        });

    }
    else {

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

}

/**
 * 清除所有缓存
 * */
function clearAllCookieValue() {

    confirmWin("确定要清除所有缓存？", function () {

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
                console.log("清除所有缓存=" + reTxt);
                if (reTxt != "") {

                    if (reTxt == "31") {
                        //跳转到登录页
                        window.location.href = "../Login/Buyer";
                    }

                }
            }
        });

    });



}