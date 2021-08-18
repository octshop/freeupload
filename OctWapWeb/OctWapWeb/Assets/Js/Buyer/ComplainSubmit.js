﻿//================提交投诉========================//

/**-----定义公共变量------**/
var mAjaxUrl = "../BuyerAjax/ComplainSubmit";

var mOID = ""; //订单ID
var mPOID = ""; //礼品订单ID
var mAID = ""; //售后ID
var mSID = ""; //店铺ID
var mComplainCategory = ""; //投诉分类( order 订单投诉，aftersale售后投诉，shop商家投诉，paltform平台投诉)
var mExtraDataID = ""; //另外额外的数据ID

var mShopUserID = "";//商家UserID 用于提交信息用

var mBuyerUserID = "";

/**------初始化------**/
$(function () {

    mOID = $("#hidOID").val().trim();
    mAID = $("#hidAID").val().trim();
    mSID = $("#hidSID").val().trim();

    mPOID = $("#hidPOID").val().trim();

    mBuyerUserID = $("#hidBuyerUserID").val().trim();


    //初始化投诉提交表单信息
    initComplainSubmitMsg();

});


/**--------------------自定义函数---------------------**/

/**
 * 初始化投诉提交表单信息
 * */
function initComplainSubmitMsg() {

    //定义投诉类型
    var ComplainCategory = "";
    if (mOID != "") {
        ComplainCategory = "order"; //订单投诉
    }
    else if (mPOID != "") {
        ComplainCategory = "PresentOrder"; //礼品订单投诉

        mExtraDataID = mPOID;
    }
    else if (mAID != "") {
        ComplainCategory = "aftersale"; //售后投诉

        mExtraDataID = mAID;
    }
    else if (mSID != "") {
        ComplainCategory = "shop"; //商家投诉

        mExtraDataID = mSID;
    }
    else {
        ComplainCategory = "paltform"; //平台投诉
        //官方投诉与意见
        $("#ComplainOffcial").show();
        return;
    }

    if (ComplainCategory == "") {
        return;
    }

    mComplainCategory = ComplainCategory;

    //构造POST参数
    var dataPOST = {
        "Type": "1", "ComplainCategory": ComplainCategory, "OrderID": mOID, "ApplyID": mAID, "ShopID": mSID, "ExtraDataID": mExtraDataID,
    };
    console.log(dataPOST);
    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: mAjaxUrl + "?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("初始化投诉提交表单信息=" + reTxt);
            if (reTxt != "") {
                var _jsonReTxt = JSON.parse(reTxt);

                //构造并赋值显示代码到页面
                xhtmlSetToPage(ComplainCategory, _jsonReTxt);

            }
        }
    });
}

/**
 * 构造并赋值显示代码到页面
 * @param {any} pComplainCategory 投诉分类( order 订单投诉，aftersale售后投诉，shop商家投诉，paltform平台投诉)
 * @param {any} pJsonReTxt 初始化返回的Json对象
 */
function xhtmlSetToPage(pComplainCategory, pJsonReTxt) {


    //判断是否已存在投诉
    if (pJsonReTxt.ComplainID != undefined && pJsonReTxt.ComplainID != 0) {
        window.location.href = "../Buyer/ComplainDetail?CID=" + pJsonReTxt.ComplainID;
        return;
    }


    //判断不同分类的投诉
    if (pComplainCategory == "order") {

        $("#OrderComplainCategory").show();

        $("#OrderID").html(pJsonReTxt.OrderID);
        $("#OrderTime").html(pJsonReTxt.OrderTime);

        mShopUserID = pJsonReTxt.ShopUserID;


        //构造商店显示Xhtml
        var myJsValShop = "";
        //构造商品显示Xhtml
        var myJsValGoods = "";
            }
        }
    }
    else if (pComplainCategory == "PresentOrder") {

        var PresentOrderMsg = pJsonReTxt.PresentOrderMsg
        var ShopMsg = pJsonReTxt.ShopMsg
        var ExtraData = pJsonReTxt.ExtraData

        mShopUserID = ShopMsg.UserID;


        $("#PresentOrderComplainCategory").show();

        $("#PresentOrderID").html(PresentOrderMsg.PstOrderID);
        $("#PresentOrderTime").html(PresentOrderMsg.OrderTime);

        var _xhtmlShop = "";
        _xhtmlShop += "<a href=\"../Shop/Index?SID=" + ShopMsg.ShopID + "\"><img src=\"//" + ShopMsg.ShopHeaderImg + "\" />" + ShopMsg.ShopName + "</a>";
    }
    else if (pComplainCategory == "aftersale") {

        $("#AfterSaleComplain").show();
        $("#ComplainTypeVal").text("售后问题");

        var AfterSaleGoods = pJsonReTxt.AfterSaleGoods;
        var AfterSaleApplyMsg = pJsonReTxt.AfterSaleApplyMsg;

        mShopUserID = AfterSaleApplyMsg.ShopUserID;

        if (AfterSaleApplyMsg.ServiceType == "maintain") {
            AfterSaleApplyMsg.ServiceType = "维修";
        }
        else if (AfterSaleApplyMsg.ServiceType == "barter") {
            AfterSaleApplyMsg.ServiceType = "换货";
        }
        else if (AfterSaleApplyMsg.ServiceType == "refund") {
            AfterSaleApplyMsg.ServiceType = "退货";
        }


        var myJsValAs = "<li class=\"order-item\">";
        $("#AfterSaleComplainUl").html(myJsValAs);
    }
    else if (pComplainCategory == "shop") {

        $("#ShopMsgBar").show();
        $("#ComplainTypeVal").text("店铺服务");

        var ShopMsg = pJsonReTxt.ShopMsg;
        var ShopAppScoreList = pJsonReTxt.ShopAppScoreList;

        mShopUserID = ShopMsg.UserID;

        //店铺标签
        if (ShopMsg.ShopLabelArr.indexOf("^")) {
            _shopLabelArr = ShopMsg.ShopLabelArr.split("^");
        }
        else {
            _shopLabelArr[0] = ShopMsg.ShopLabelArr;
        }



        }

        $("#ShopScoreBar").html("综合: <b>" + ShopAppScoreList.ShopScoreAvg + "</b> 商品: <b>" + ShopAppScoreList.ConformityScoreAvg + "</b>服务: <b>" + ShopAppScoreList.AttitudeScoreAvg + "</b>物流: <b>" + ShopAppScoreList.ExpressScoreAvg + "</b>配送: <b>" + ShopAppScoreList.DeliverymanScoreAvg + "</b>");

        $("#ShopAttenBar").html(pJsonReTxt.ShopFavCount + " ");
        $("#ShopMajorGoodBar").html(ShopMsg.MajorGoods);

        $("#ShopGoIndexBar").attr("href", "../Shop/Index?SID=" + ShopMsg.ShopID);
        $("#ShopGoSeviceBar").attr("href", "tel:" + ShopMsg.ShopMobile);

        //构建商家店铺咨询进入IM在线客服系统 跳转 URL
        buildBuyerGoToImSysURL_ShopWap(ShopMsg.UserID, mBuyerUserID);

    }
    else {
        //官方投诉与意见
        $("#ComplainOffcial").show();
    }

}

/**
 * 提交投诉信息
 * */
function submitComplainMsg() {

    //获取表单值
    var ComplainTypeVal = $("#ComplainTypeVal").text().trim();
    var ComplainContentTxtArea = $("#ComplainContentTxtArea").val().trim();

    if (ComplainTypeVal == "" || ComplainContentTxtArea == "") {
        toastWin("【投诉内容】不能为空！");
        return;
    }

    //构造POST参数
    var dataPOST = {
        "Type": "2", "OrderID": mOID, "ComplainType": ComplainTypeVal, "ComplainContent": ComplainContentTxtArea, "ShopUserID": mShopUserID, "ComplainCategory": mComplainCategory, "ExtraData": mExtraDataID,
    };
    console.log(dataPOST);

    $("#BtnComplain").attr("disabled", true);
    $("#BtnComplain").val("…提交中…");

    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: mAjaxUrl + "?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("初始化投诉提交表单信息=" + reTxt);

            $("#BtnComplain").attr("disabled", false);
            $("#BtnComplain").val("提交投诉");

            if (reTxt != "") {
                var _jsonReTxt = JSON.parse(reTxt);

                if (_jsonReTxt.ErrMsg != "" && _jsonReTxt.ErrMsg != undefined && _jsonReTxt.ErrMsg != null) {
                    toastWinCb(_jsonReTxt.ErrMsg, function () {

                        if (_jsonReTxt.ErrCode == "SOCM_02") {
                            //跳转
                            window.location.href = "../Buyer/ComplainDetail?CID=" + _jsonReTxt.DataDic.ComplainID;
                        }

                    });

                    return;
                }

                if (_jsonReTxt.Msg != "" && _jsonReTxt.Msg != undefined && _jsonReTxt.Msg != null) {
                    toastWinCb(_jsonReTxt.Msg, function () {

                        //跳转
                        window.location.href = "../Buyer/ComplainDetail?CID=" + _jsonReTxt.DataDic.ComplainID;

                    });
                    return;
                }



            }
        }
    });

}


//===================打开弹出窗口===================//

/**
 * -------打开投诉类型窗口------
 */
var mComplainTypeWinHtml = "";
function openComplainTypeWin() {

    if (mComplainTypeWinHtml == "") {

        mComplainTypeWinHtml = getComplainTypeWinHtml();
    }
    //初始化SliderDown窗口
    initSilderDownWin(600, mComplainTypeWinHtml);

    toggleSilderDownWin();

}
/**
 * 得到支付确认窗口显示代码
 */
function getComplainTypeWinHtml() {

    var _html = $("#WinSelComplainType").html();

    $("#WinSelComplainType").html("");
    $("#WinSelComplainType").remove();
    $("body").remove("#WinSelComplainType");

    mComplainTypeWinHtml = "";

    return _html
}

/**
 * 选择投诉类型名称值 
 * @param {any} pComplainTypeVal 投诉类型名称 (质量问题，快递问题,售后问题，其他问题)
 */
function selComplainTypeVal(pComplainTypeVal) {

    $("#ComplainTypeVal").text(pComplainTypeVal);
    //关闭窗口
    toggleSilderDownWin();
}




//构建商家店铺咨询进入IM在线客服系统 跳转 URL
var mBuyerGoToImSysURL_ShopWap = "";
/**
 * -----构建商家店铺咨询进入IM在线客服系统 跳转 URL-----
 * @param {any} pShopUserID
 * @param {any} pBuyerUserID
 */
function buildBuyerGoToImSysURL_ShopWap(pShopUserID, pBuyerUserID) {

    //构造POST参数
    var dataPOST = {
        "Type": "1", "ShopUserID": pShopUserID, "BuyerUserID": pBuyerUserID,
    };
    console.log(dataPOST);

    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: "../ImSysAjax/Index?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("构建商家店铺咨询进入IM在线客服系统跳转URL=" + reTxt);

            if (reTxt != "") {
                //$("#hidBuyerGoToImSysURL_ShopWap").val(reTxt);

                mBuyerGoToImSysURL_ShopWap = reTxt;


                if (mBuyerGoToImSysURL_ShopWap != "" && mBuyerGoToImSysURL_ShopWap != null && mBuyerGoToImSysURL_ShopWap != undefined) {

                    //$("#CustomerServicesOnLineDiv").unbind();
                    ////页脚下面的客服
                    //$("#CustomerServicesOnLineDiv").on("click", function () {
                    //    window.location.href = encodeURI(mBuyerGoToImSysURL_ShopWap);
                    //});
                    $("#ShopGoSeviceBar").attr("href", encodeURI(mBuyerGoToImSysURL_ShopWap));


                }
            }
        }
    });
}

