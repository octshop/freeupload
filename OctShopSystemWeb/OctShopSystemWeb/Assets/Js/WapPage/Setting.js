//=============买家设置========================//


/**-----定义公共变量------**/
var mAjaxUrl = "../Wap/Setting";



/**------初始化------**/
$(function () {



});


/**------自定义函数------**/



/**
 * 退出登录
 * */
function exitLogin() {



    confirmWin("确定要退出吗?", function () {

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
                console.log("退出登录=" + reTxt);
                if (reTxt != "") {

                    if (reTxt == "11") {
                        //toastWinCb("退出成功！", function () {
                        window.location.href = "../LoginPage/Index?BackUrl=../WapPage/Index";
                        //});
                    }

                }
            }
        });


    });
}



/**
 * 清除所有缓存
 * */
function clearAllCookieValue() {

    confirmWin("确定要清除所有缓存？", function () {

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
                console.log("清除所有缓存=" + reTxt);
                if (reTxt != "") {

                    if (reTxt == "21") {
                        //跳转到登录页
                        window.location.href = "../LoginPage/Index?BackUrl=../WapPage/Index";
                    }

                }
            }
        });

    });



}