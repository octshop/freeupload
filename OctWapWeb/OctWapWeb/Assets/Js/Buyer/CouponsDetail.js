﻿//================优惠券详情=========================//

/**-----定义公共变量------**/
var mAjaxUrl = "../BuyerAjax/CouponsMy";

//优惠券ID
var mCouponsID = 0;
//发放ID
var mIssueID = 0;
//买家登录后的UserID
var mBuyerUserID = "";
//商家UserID
var mShopUserID = "";

var mCouponsAbleUseGoodsListJSON = null;
var mCouponsAbleUseShopListJSON = null;

/**----------初始化----------**/
$(function () {

    mCouponsID = $("#hidCouponsID").val().trim();
    mIssueID = $("#hidIssueID").val().trim();
    mBuyerUserID = $("#hidBuyerUserID").val().trim();

    //初始化优惠券横条的Bar信息
    intCouponsMsgBar();

});




/**--------------自定义函数-----------------**/

/**
 * 初始化优惠券横条的Bar信息
 * */
function intCouponsMsgBar() {

    //构造POST参数
    var dataPOST = {
        "Type": "2", "CouponsID": mCouponsID, "IssueID": mIssueID,
    };
    console.log(dataPOST);

    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: mAjaxUrl + "?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("初始化优惠券横条的Bar信息=" + reTxt);

            if (reTxt != "") {

                var _jsonReTxt = JSON.parse(reTxt);

                if (mCouponsAbleUseGoodsListJSON == null) {
                    //得到优惠券可以使用的产品列表
                    loadCouponsAbleUseGoodsList();
                }

                var CouponsMsg = _jsonReTxt.CouponsMsg;
                var CouponsIssueMsg = _jsonReTxt.CouponsIssueMsg;
                var DataExtra = _jsonReTxt.DataExtra;

                mShopUserID = CouponsMsg.ShopUserID;

                var _WriteDateDay = "";
                if (DataExtra.CouponsOverTime != "" && DataExtra.CouponsOverTime != null) {
                    _WriteDateDay = dateDiffDay(getTodayDate(), DataExtra.CouponsOverTime, false);
                    if (Math.abs(_WriteDateDay) > 100 || parseInt(_WriteDateDay) <= 0) {
                        _WriteDateDay = "";
                    }
                }



                //----------如果是没有登录状态下优惠券加载---------------//
                if (CouponsIssueMsg == undefined || CouponsIssueMsg == null || CouponsIssueMsg == "") {

                    }
                    }
                    }
                    }
                        if (DataExtra.IsOverDateCoupons == "False") {
                            myJsValNoLogin += "<span>" + _WriteDateDay + "天</span>";
                        }
                        else {
                            myJsValNoLogin += "<span>已过期</span>";
                        }

                    }
                    }
                    }
                    }
                    if (DataExtra.IsOverDateCoupons == "True") {
                        $(".coupons-item-left").css("background", "gray");
                        $(".coupons-item-top span").css("background", "gray");
                    }

                //-----------------------登录状态,有发放信息的界面----------------//

                //判断是否已使用
                var _classUsed = "";
                if (CouponsIssueMsg.IsUsed == "true") {
                    _classUsed = "coupons-used";
                }

                }
                }
                }
                }

                    if (CouponsIssueMsg.IsUsed == "false") {

                        if (CouponsIssueMsg.IsOverTime == "false") {
                            myJsVal += "<span>" + _WriteDateDay + "天</span>";
                        }
                        else {
                            myJsVal += "<span>已过期</span>";
                        }
                    }
                }
                }
                    }
                    }
                }
                }

                $("#CouponsListUl").html(myJsVal);

                //如果使用了则验证码，二维码
                if (CouponsIssueMsg.IsUsed == "true" || CouponsIssueMsg.IsOverTime == "true" || CouponsMsg.IsOfflineUse == "false") {
                    $("#CheckCodeDiv").hide();
                }
                else {
                    $("#CheckCodeDiv").show();

                    if (CouponsMsg.IsOfflineUse != "false") {
                        //初始化 优惠券线下使用 验证码 --包括重新生成
                        initCouponsVerifyCode('false');
                    }

                }

                //已过期的样式
                if (CouponsIssueMsg.IsOverTime == "true") {
                    $(".coupons-item-left").css("background", "gray");
                    $(".coupons-item-top span").css("background", "gray");
                }


            }
        }
    });

}

/**
 * 买家单个获取 优惠券
 * */
function buyerGetCoupons(pCouponsID) {

    if (mBuyerUserID == "" || mBuyerUserID == "0") {
        toastWinCb("请先登录再领取！", function () {
            window.location.href = "../Login/Buyer";
        });
    }

    //构造POST参数
    var dataPOST = {
        "Type": "3", "CouponsID": pCouponsID,
    };
    console.log(dataPOST);

    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: mAjaxUrl + "?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("买家单个获取优惠券=" + reTxt);

            if (reTxt != "") {
                var _jsonReTxt = JSON.parse(reTxt);

                //领取成功
                if (_jsonReTxt.Code == "BGC_01" || _jsonReTxt.ErrCode == "BGC_02") {

                    console.log($("#Btn_GetCoupons"));
                    $("#Btn_GetCoupons").attr("disabled", true);
                    $("#Btn_GetCoupons").css("border", "1px solid gray");
                    $("#Btn_GetCoupons").css("color", "gray");
                    $("#Btn_GetCoupons").val("已领取");
                    toastWin("领取成功！");

                }
                else {
                    toastWin(_jsonReTxt.ErrMsg);
                    return;
                }
            }


        }
    });

}

/**
 * 初始化 优惠券线下使用 验证码 --包括重新生成
 * @param {any} pIsReSet 如果存在,是否重新生成 [false / true 重新生成]
 */
function initCouponsVerifyCode(pIsReSet) {

    if (mCouponsID == "0" || mIssueID == "0") {
        return
    }

    $("#CheckCodeDiv").show();

    if (pIsReSet == "true") {
        $("#BtnReset").attr("disabled", true);
        $("#BtnReset").val("…生成中…");
    }

    //构造POST参数
    var dataPOST = {
        "Type": "4", "IssueID": mIssueID, "IsReSet": pIsReSet, "ShopUserID": mShopUserID,
    };
    console.log(dataPOST);
    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: mAjaxUrl + "?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("初始化 优惠券线下使用 验证码=" + reTxt);
            if (reTxt != "") {
                var _jsonReTxt = JSON.parse(reTxt);

                if (pIsReSet == "true") //重新生成
                {

                    $("#BtnReset").attr("disabled", false);
                    $("#BtnReset").val("重新生成");


                    if (_jsonReTxt.ErrMsg != "" && _jsonReTxt.ErrMsg != null && _jsonReTxt.ErrMsg != undefined) {
                        toastWin(_jsonReTxt.ErrMsg);
                        return;
                    }

                    if (_jsonReTxt.Msg != "" && _jsonReTxt.Msg != null && _jsonReTxt.Msg != undefined) {
                        toastWin(_jsonReTxt.Msg);

                        //更新显示信息
                        $("#checkCodeNumberB").html(_jsonReTxt.DataDic.VerifyCode);
                        //扫码图片
                        $("#ScanImgA").attr("href", "../ToolWeb/GetQrCodeImg.aspx?QrCodeContent=" + _jsonReTxt.DataDic.ScanUrl + "&rnd=" + Math.random());
                        $("#ScanImg").attr("src", "../ToolWeb/GetQrCodeImg.aspx?QrCodeContent=" + _jsonReTxt.DataDic.ScanUrl + "&rnd=" + Math.random());

                        return;
                    }
                }
                //更新显示信息
                $("#checkCodeNumberB").html(_jsonReTxt.DataDic.VerifyCode);
                //扫码图片
                $("#ScanImgA").attr("href", "../ToolWeb/GetQrCodeImg.aspx?QrCodeContent=" + _jsonReTxt.DataDic.ScanUrl + "&rnd=" + Math.random());
                $("#ScanImg").attr("src", "../ToolWeb/GetQrCodeImg.aspx?QrCodeContent=" + _jsonReTxt.DataDic.ScanUrl + "&rnd=" + Math.random());

            }
        }
    });
}

/**
 * 得到优惠券可以使用的产品列表
 * */
function loadCouponsAbleUseGoodsList() {

    //构造POST参数
    var dataPOST = {
        "Type": "5", "CouponsID": mCouponsID,
    };
    console.log(dataPOST);

    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: mAjaxUrl + "?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("得到优惠券可以使用的产品列表=" + reTxt);

            if (mCouponsAbleUseShopListJSON == null) {

                //加载优惠券可以使用的店铺列表
                loadCouponsAbleUseShopList();

            }


            if (reTxt != "") {
                var _jsonReTxt = JSON.parse(reTxt);

                mCouponsAbleUseGoodsListJSON = _jsonReTxt;

                //构造可使用商品列表
                xhtmlCouponsAbleUseGoodsList(_jsonReTxt);

            }
        }
    });
}

/**
 * 构造可使用商品列表
 * @param {any} pJsonReTxt 返回的Json
 */
function xhtmlCouponsAbleUseGoodsList(pJsonReTxt) {

    var _jsonReTxt = pJsonReTxt;

    var myJsVal = "";
    }
}

/**
 * 加载优惠券可以使用的店铺列表
 * */
function loadCouponsAbleUseShopList() {

    //构造POST参数
    var dataPOST = {
        "Type": "6", "CouponsID": mCouponsID,
    };
    console.log(dataPOST);

    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: mAjaxUrl + "?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("加载优惠券可以使用的店铺列表=" + reTxt);

            if (reTxt != "") {
                var _jsonReTxt = JSON.parse(reTxt);

                mCouponsAbleUseShopListJSON = _jsonReTxt

                //构造 优惠券可以使用的店铺列表 显示代码 
                //xhtmlCouponsAbleUseShopList(_jsonReTxt);

            }
        }
    });
}


/**
 * 构造 优惠券可以使用的店铺列表 显示代码 
 * @param {any} pJsonReTxt
 */
function xhtmlCouponsAbleUseShopList(pJsonReTxt) {

    var myJsVal = "";
        }
    }
    $("#UserListUL").html(myJsVal);
}

/**
 * 切换选项卡
 * @param {any} pTabNum [1 可使用商品 2 可使用店铺]
 */
function chgTab(pTabNum) {

    var _useTabLabelArr = $(".use-tab");
    //移除当前选项类
    for (var i = 0; i < _useTabLabelArr.length; i++) {
        $(_useTabLabelArr[i]).removeClass("use-tab-current");
    }

    if (pTabNum == "1") {
        $(_useTabLabelArr[0]).addClass("use-tab-current");

        //构造可使用商品列表
        xhtmlCouponsAbleUseGoodsList(mCouponsAbleUseGoodsListJSON);
    }
    else {
        $(_useTabLabelArr[1]).addClass("use-tab-current");

        // 构造 优惠券可以使用的店铺列表 显示代码 
        xhtmlCouponsAbleUseShopList(mCouponsAbleUseShopListJSON);
    }

}