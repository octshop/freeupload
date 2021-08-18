//==============选择售后类型=========================//

/**-----定义公共变量------**/
var mAjaxUrl = "../AfterSaleAjax/AsSelType";

var mOID = ""; //订单ID
var mGID = ""; //商品ID
var mSID = "";//规格属性ID


/**------初始化------**/
$(function () {

    mOID = $("#hidOID").val().trim();
    mGID = $("#hidGID").val().trim();
    mSID = $("#hidSID").val().trim();

    //判断是否存在未完成或退货的售后申请
    existNoFinishAfterSaleApply();

});


/**------==========自定义函数===================------**/


/**
 * 判断是否存在未完成或退货的售后申请
 * */
function existNoFinishAfterSaleApply() {

    //构造POST参数
    var dataPOST = {
        "Type": "3", "OrderID": mOID, "GoodsID": mGID, "SpecID": mSID
    };
    console.log(dataPOST);
    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: mAjaxUrl + "?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("判断是否存在未完成或退货的售后申请=" + reTxt);
            if (reTxt != "") {
                var _jsonReTxt = JSON.parse(reTxt);

                if (_jsonReTxt.ErrMsg != "" && _jsonReTxt.ErrMsg != null && _jsonReTxt.ErrMsg != undefined) {
                    //初始化售后申请的订单商品信息
                    initAsOrderGoodsMsg();
                }

                if (_jsonReTxt.Msg != "" && _jsonReTxt.Msg != null && _jsonReTxt.Msg != undefined) {
                    //跳转到售后详情
                    window.location.href = "../AfterSale/AsDetail?AID=" + _jsonReTxt.DataDic.ApplyID;
                }

            }
        }
    });


}

/**
 * 初始化售后申请的订单商品信息
 * */
function initAsOrderGoodsMsg() {
    //构造POST参数
    var dataPOST = {
        "Type": "1", "OrderID": mOID, "GoodsID": mGID, "SpecID": mSID
    };
    console.log(dataPOST);
    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: mAjaxUrl + "?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("初始化售后申请的订单商品信息=" + reTxt);
            if (reTxt != "") {
                var _jsonReTxt = JSON.parse(reTxt);

                if (_jsonReTxt.GoodsTitle.length > 35) {
                    _jsonReTxt.GoodsTitle = _jsonReTxt.GoodsTitle.substring(0, 34) + "..."
                }

                $("#ShopLinkA").attr("href", "../Shop/Index?SID=" + _jsonReTxt.ShopID + "");
                $("#ShopLinkA").html(_jsonReTxt.ShopName);
                $("#GoodsImg").attr("src", "//" + _jsonReTxt.GoodsCoverImgPath + "");
                $("#GoodsTitle").html(_jsonReTxt.GoodsTitle);
                $("#GoodsSpec").html(_jsonReTxt.SpecParamVal);
                $("#GoodsPrice").html("&#165;" + _jsonReTxt.GoodsUnitPrice);
                $("#OrderNum").html(_jsonReTxt.OrderNum);

                $("#CustomerServicesOnLineDiv").on("click", function () {
                    window.location.href = "tel:" + _jsonReTxt.ShopMobile;
                });


                //构建商家店铺咨询进入IM在线客服系统 跳转 URL
                buildBuyerGoToImSysURL_ShopWap(_jsonReTxt.ShopUserID, _jsonReTxt.BuyerUserID);


            }
        }
    });
}

/**
 * 增减申请数据
 * @param {any} pExeType 操作类型 [ Add , Reduce]
 */
function addReduceNumTxt(pExeType) {

    //获取当前输入数据值
    var _numberTxt = $("#NumberTxt").val().trim();

    //获取商品订单数量
    var _goodsOrderNum = $("#OrderNum").text();

    if (pExeType == "Add") //增加
    {
        if (parseInt(_numberTxt) >= parseInt(_goodsOrderNum)) {
            return;
        }

        _numberTxt = (parseInt(_numberTxt) + 1);
    }
    else {
        if (parseInt(_numberTxt) <= 1) {
            return;
        }
        _numberTxt = (parseInt(_numberTxt) - 1);
    }

    //赋值文本框
    $("#NumberTxt").val(_numberTxt);
}

/**
 * 检测申请数据的输入
 * */
function checkInputNumber() {
    //获取当前输入数据值
    var _numberTxt = $("#NumberTxt").val().trim();
    //获取商品订单数量
    var _goodsOrderNum = $("#OrderNum").text();

    if (parseInt(_numberTxt) >= parseInt(_goodsOrderNum)) {

        //赋值文本框
        $("#NumberTxt").val(_goodsOrderNum);
        return;
    }

    if (parseInt(_numberTxt) <= 1) {
        //赋值文本框
        $("#NumberTxt").val("1");
        return;
    }

    $("#NumberTxt").val(parseInt(_numberTxt));
}

/**
 * 提交选择的售后申请类型信息
 * @param pServiceType 服务类型 (maintain 维修 barter 换货 , refund 退货)
 * */
function submitSelAsType(pServiceType) {

    //构造POST参数
    var dataPOST = {
        "Type": "2", "OrderID": mOID, "GoodsID": mGID, "SpecID": mSID, "ServiceType": pServiceType, "ApplyGoodsNum": $("#NumberTxt").val().trim(),
    };
    console.log(dataPOST);
    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: mAjaxUrl + "?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("提交选择的售后申请类型信息=" + reTxt);
            if (reTxt != "") {

                if (reTxt == "21") {

                    window.location.href = "../AfterSale/AsSubmit";

                    //if (pServiceType == "maintain") {
                    //    window.location.href = "../AfterSale/AsSubmit";
                    //}
                    //else if (pServiceType == "barter") {
                    //    window.location.href = "../AfterSale/AsSubmitChg";
                    //}
                    //else if (pServiceType == "refund") {
                    //    window.location.href = "../AfterSale/AsSubmitRefund";
                    //}

                    return;
                }


            }
        }
    });

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

                    $("#CustomerServicesOnLineDiv").unbind();
                    //页脚下面的客服
                    $("#CustomerServicesOnLineDiv").on("click", function () {
                        window.location.href = encodeURI(mBuyerGoToImSysURL_ShopWap);
                    });
                    //$("#CusServiceA").attr("href", encodeURI(mBuyerGoToImSysURL_ShopWap));
                }
            }
        }
    });
}
