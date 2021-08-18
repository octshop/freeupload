//=========验证 订单验证码信息是否正确 [待消费/自取]验证==============//


/**-----定义公共变量------**/
//AjaxURL
var mAjaxUrl = "../Order/VerifyOrderCheckCode";
//扫描的数据
var mScanData = "";
//判断是否发送了验证请求
var mIsHttpCheck = false;

var mOctWapWebAddrDomain = "";

/**------初始化------**/
$(function () {

    mOctWapWebAddrDomain = $("#hidOctWapWebAddrDomain").val().trim();

    mScanData = $("#hidScanData").val().trim();

    //加载店铺简单信息
    loadShopMsgSimple();

    //显示一个加载进度条
    loadingWin();

    //发送验证请求
    setTimeout(function () {

        VerifyOrderCheckCode();

    }, 2000);

});

//=====================自定义函数============================//

/**
 * 验证 订单验证码信息是否正确 [待消费/自取]验证
 * */
function VerifyOrderCheckCode() {

    if (mScanData == "" || mScanData == null) {
        return;
    }

    if (mIsHttpCheck == true) {
        return;
    }

    //构造POST参数
    var dataPOST = {
        "Type": "1", "ScanData": mScanData,
    };
    console.log(dataPOST);

    mIsHttpCheck = true;

    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: mAjaxUrl + "?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("验证订单验证码=" + reTxt);

            //移除加载提示
            closeLoadingWin();

            if (reTxt != "") {
                //alert(reTxt);
                var _jsonReTxt = JSON.parse(reTxt);

                if (_jsonReTxt.ErrMsg != "" && _jsonReTxt.ErrMsg != null && _jsonReTxt.ErrMsg != undefined) {

                    //显示错误提示
                    $("#LogoHintSuccess").hide();
                    $("#LogoHintErr").show();
                    $("#ErrHintContent").html(_jsonReTxt.ErrMsg);
                    //更改样式为红色
                    $(".oct-header").css("background", "red");
                    $(".oct-header").css("border-bottom", "2px solid #F20000");
                    $(".main-logo").css("background", "red");

                }

                if (_jsonReTxt.Msg != "" && _jsonReTxt.Msg != null && _jsonReTxt.Msg != undefined) {

                    //显示成功提示
                    $("#LogoHintSuccess").show();
                    $("#LogoHintErr").hide();

                    $("#OrderIDB").html(_jsonReTxt.DataDic.OrderID);
                    $("#CheckCodeB").html(_jsonReTxt.DataDic.CheckCode);

                    //查看订单详情
                    $("#BtnSeeOrderDetail").on("click", function () {
                        window.location.href = "../TradingPage/OrderDetail?OID=" + _jsonReTxt.DataDic.OrderID;
                    });

                    //----查询核销订单信息----//
                    searchVerifyOrderGoodsList(_jsonReTxt.DataDic.OrderID);

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

/**
 * 查询验证的订单商品信息
 * @param {any} pOrderID
 */
function searchVerifyOrderGoodsList(pOrderID) {

    //构造POST参数
    var dataPOST = {
        "Type": "12", "OrderID": pOrderID,
    };
    console.log(dataPOST);
    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: "../Trading/OrderMan?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("查询验证的订单商品信息=" + reTxt);
            if (reTxt != "") {
                var _jsonReTxt = JSON.parse(reTxt);

                //页面赋值
                $("#OrderPriceB").html("&#165; " + _jsonReTxt.OrderPrice);

                var _GoodsIDArr = _jsonReTxt.OrderGoodsList[0];
                var _GoodsTitleArr = _jsonReTxt.OrderGoodsList[1];
                var _GoodsSpecIDOrderNumArr = _jsonReTxt.OrderGoodsList[2];
                var _GoodsUnitPriceArr = _jsonReTxt.OrderGoodsList[3];
                var _SpecParamValArr = _jsonReTxt.OrderGoodsList[4];
                var _IsSpecParamArr = _jsonReTxt.OrderGoodsList[5];
                var _SpecIDArr = _jsonReTxt.OrderGoodsList[6];
                var _OrderNumArr = _jsonReTxt.OrderGoodsList[7];

                //循环构造显示代码 
                var myJsVal = "";
                for (var i = 0; i < _GoodsIDArr.length; i++) {

                    var _specParamStr = "";
                    if (_SpecParamValArr[i] != "") {
                        _specParamStr = "[" + _SpecParamValArr[i] + "]";
                    }

                    myJsVal += "<li>";
                    myJsVal += "<a href=\"" + mOctWapWebAddrDomain + "/Goods/GoodsDetail?GID=" + _GoodsIDArr[i] + "\">" + _GoodsTitleArr[i] + _specParamStr + "</a>";
                    myJsVal += "<span>&#165; " + _GoodsUnitPriceArr[i] + " x " + _OrderNumArr[i] + "</span>";
                    myJsVal += "</li>";
                }
                //显示代码插入前台
                $("#OrderGoodsUl").html(myJsVal);

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


