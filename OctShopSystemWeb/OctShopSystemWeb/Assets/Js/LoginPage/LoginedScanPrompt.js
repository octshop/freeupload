//==============登录成功-扫码验证核销=====================//

/**------公共变量------**/
var mAjaxUrl = "../Login/Index";

var mOctWapWebAddrDomain = "";

/**------初始化------**/
$(function () {

    mOctWapWebAddrDomain = $("#hidOctWapWebAddrDomain").val().trim();

    //加载店铺简单信息
    loadShopMsgSimple();


});

/**
 * 加载店铺简单信息
 * */
function loadShopMsgSimple() {

    //构造POST参数
    var dataPOST = {
        "Type": "8",
    };
    console.log(dataPOST);
    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: "../Shop/ShopMsg?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("加载店铺简单信息=" + reTxt);
            if (reTxt != "") {
                var _jsonReTxt = JSON.parse(reTxt);
                $("#ShopNameALink").attr("href", mOctWapWebAddrDomain + "/Shop/Index?SID=" + _jsonReTxt.ShopID);

                var myJsVal = "";
                if (_jsonReTxt.ShopHeaderImg == "" || _jsonReTxt.ShopHeaderImg == undefined || _jsonReTxt.ShopHeaderImg == null) {
                    myJsVal += "<img src=\"../Assets/Imgs/Icon/shop_verify.png\" />";
                }
                else {
                    myJsVal += "<img class=\"shop-header-img\" src=\"//" + _jsonReTxt.ShopHeaderImg + "\" />";
                }
                myJsVal += _jsonReTxt.ShopName;
                $("#ShopNameALink").html(myJsVal);

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

/**
 * 退出登录
 * */
function exitLogin() {

    confirmWin("确定要退出吗？", function () {

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
                console.log("退出登录=" + reTxt);
                if (reTxt != "") {

                    if (reTxt == "21") {
                        //跳转到登录页
                        window.location.href = "../LoginPage/Index?BackUrl=../LoginPage/LoginedScanPrompt";
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


    });
}