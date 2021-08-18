﻿//========================评价详情=========================//

/**-----定义公共变量------**/
var mAjaxUrl = "../BuyerAjax/AppraiseDetail";

var mOrderID = ""; //订单ID

var mPhotoSwipeDataList = null; //PhotoSwipe的数据列表


/**------初始化------**/
$(function () {

    mOrderID = $("#hidOrderID").val().trim();

    //初始化订单商品信息
    initOrderGoodsMsg();

});


/**------自定义函数------**/

/**
 * 初始化订单商品信息
 * */
function initOrderGoodsMsg() {
    //构造POST参数
    var dataPOST = {
        "Type": "1", "OrderID": mOrderID,
    };
    console.log(dataPOST);
    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: "../BuyerAjax/AppraiseForm?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("初始化订单商品信息=" + reTxt);
            if (reTxt != "") {
                var _jsonReTxt = JSON.parse(reTxt);

                //初始化 订单的商品评价信息，包括商品评价，晒单评价，店铺评价
                initOrderGoodsShopAppraise(_jsonReTxt);


            }
        }
    });
}

/**
 * 初始化 订单的商品评价信息，包括商品评价，晒单评价，店铺评价
 * @param pJsonReTxtOrderGoods 需要评价的订单商品列表
 * */
function initOrderGoodsShopAppraise(pJsonReTxtOrderGoods) {

    //构造POST参数
    var dataPOST = {
        "Type": "1", "OrderID": mOrderID,
    };
    console.log(dataPOST);
    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: mAjaxUrl + "?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("初始化订单商品评价信息=" + reTxt);
            if (reTxt != "") {
                var _jsonReTxt = JSON.parse(reTxt);


                //构造评价列表显示代码
                var _xhtml = xhtmlAppraiseItem(pJsonReTxtOrderGoods, _jsonReTxt);
                $("#OrderList").html(_xhtml);


                //初始化商品评价晒单的返积分信息
                initAppraiseShopIntegralSetting(pJsonReTxtOrderGoods.OrderGoodsList);

            }
        }
    });

}


/**
 * 构造评价列表显示代码
 * @param {any} pJsonReTxtOrderGoods 需要评价的订单商品列表
 * @param {any} pJsonReTxtOrderAppraise 订单商品评价的列表
 */
function xhtmlAppraiseItem(pJsonReTxtOrderGoods, pJsonReTxtOrderAppraise) {

    console.log(pJsonReTxtOrderAppraise);

    var OrderGoodsListArr = pJsonReTxtOrderGoods.OrderGoodsList;
    var GooAppraiseList = pJsonReTxtOrderAppraise.GooAppraiseList;
    var ShopAppraise = pJsonReTxtOrderAppraise.ShopAppraise;

    var myJsVal = "";
        }

    //店铺评价显示
    appraiseScoreShop("" + ShopAppraise.ConformityScore +"", "Goods", false);
    appraiseScoreShop("" + ShopAppraise.AttitudeScore + "", "Service", false);
    appraiseScoreShop("" + ShopAppraise.ExpressScore + "", "Speed", false);
    appraiseScoreShop("" + ShopAppraise.DeliverymanScore + "", "Attitude", false);

    return myJsVal;
}


/**
 * 初始化商品评价晒单的返积分信息
 * @param {any} pOrderGoodsList 订单商品信息列表JSON对象
 */
function initAppraiseShopIntegralSetting(pOrderGoodsList) {

    //构造GoodsIDArr
    var _goodsIDArr = "";
    for (var i = 0; i < pOrderGoodsList.length; i++) {
        _goodsIDArr += pOrderGoodsList[i].GoodsID + "^";
    }
    //去掉前后的"^"
    _goodsIDArr = removeFrontAndBackChar(_goodsIDArr, "^")

    //构造POST参数
    var dataPOST = {
        "Type": "3", "GoodsIDArr": _goodsIDArr,
    };
    console.log(dataPOST);
    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: "../BuyerAjax/AppraiseForm?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("初始化商品评价晒单的返积分信息=" + reTxt);
            if (reTxt != "") {
                var _jsonReTxt = JSON.parse(reTxt);

                //循环显示商品评价晒单返积分值
                for (var j = 0; j < pOrderGoodsList.length; j++) {
                    //商品ID
                    var _goodsID = pOrderGoodsList[j].GoodsID;
                    //当前GoodsID的评价和晒单的积分
                    var _appraiseIntergralSum = 0;

                    //循环积分
                    for (var k = 0; k < _jsonReTxt.AppraiseIntegralSetting.length; k++) {

                        var _appraiseIntegralSetting = _jsonReTxt.AppraiseIntegralSetting[k];

                        if (_appraiseIntegralSetting.GoodsID == _goodsID && (_appraiseIntegralSetting.InSettingType == "Appraise" || _appraiseIntegralSetting.InSettingType == "AppraiseImg")) {
                            //统计积分
                            _appraiseIntergralSum += parseFloat(_appraiseIntegralSetting.IntegralPrice)

                        }

                    }

                    if (_appraiseIntergralSum > 0) {
                        //总的积分在前台显示
                        $("#AppraiseIntregralSpan_" + _goodsID).html("评价晒单获 " + _appraiseIntergralSum + " 积分");
                    }


                }

            }
        }
    });

}

/**
 * 星星评分函数 -- 商品评价
 * @param {any} pAppraiseScore 评分（1非常不满，2 不满意，3一般，4满意，5 非常满意 ）
 * @param {any} pAppraiseIndex 承载评分的Label索引 从0开始
 * @param pIsBackHtml 是否返回Html [ true / false ]
 */
function appraiseScore(pAppraiseScore, pAppraiseIndex, pIsBackHtml) {

    if (pAppraiseIndex == undefined || pAppraiseIndex == null || pAppraiseIndex == "") {
        pAppraiseIndex = "";
    }

    //console.log("pAppraiseScore=" + pAppraiseScore + " | pAppraiseIndex=" + pAppraiseIndex);

    //构造评分Img
    var _imgScoreHtml = "";

    if (pAppraiseScore == "1") {
        _imgScoreHtml += "<img src=\"../Assets/Imgs/Icon/appraise_star.png\" />";
    }
    else if (pAppraiseScore == "2") {
        _imgScoreHtml += "<img src=\"../Assets/Imgs/Icon/appraise_star.png\" />";
        _imgScoreHtml += "<img src=\"../Assets/Imgs/Icon/appraise_star.png\" />";
    }
    else if (pAppraiseScore == "3") {
        _imgScoreHtml += "<img src=\"../Assets/Imgs/Icon/appraise_star.png\" />";
        _imgScoreHtml += "<img src=\"../Assets/Imgs/Icon/appraise_star.png\" />";
        _imgScoreHtml += "<img src=\"../Assets/Imgs/Icon/appraise_star.png\" />";
    }
    else if (pAppraiseScore == "4") {
        _imgScoreHtml += "<img src=\"../Assets/Imgs/Icon/appraise_star.png\" />";
        _imgScoreHtml += "<img src=\"../Assets/Imgs/Icon/appraise_star.png\" />";
        _imgScoreHtml += "<img src=\"../Assets/Imgs/Icon/appraise_star.png\" />";
        _imgScoreHtml += "<img src=\"../Assets/Imgs/Icon/appraise_star.png\" />";
    }
    else if (pAppraiseScore == "5") {
        _imgScoreHtml += "<img src=\"../Assets/Imgs/Icon/appraise_star.png\" />";
        _imgScoreHtml += "<img src=\"../Assets/Imgs/Icon/appraise_star.png\" />";
        _imgScoreHtml += "<img src=\"../Assets/Imgs/Icon/appraise_star.png\" />";
        _imgScoreHtml += "<img src=\"../Assets/Imgs/Icon/appraise_star.png\" />";
        _imgScoreHtml += "<img src=\"../Assets/Imgs/Icon/appraise_star.png\" />";
    }

    for (var i = 0; i < 5 - parseInt(pAppraiseScore); i++) {

        var _appraiseScore = parseInt(pAppraiseScore) + i + 1;

        _imgScoreHtml += "<img src=\"../Assets/Imgs/Icon/appraise_star_gray.png\" />";
    }

    //console.log("_imgScoreHtml=" + _imgScoreHtml);

    if (pAppraiseIndex != "") {
        if (pIsBackHtml == false) {
            $("#AppraiseStarItem_" + pAppraiseIndex).html(_imgScoreHtml);
            $("#hidAppraiseStarScore_" + pAppraiseIndex).val(pAppraiseScore);
            console.log("当前评分：" + pAppraiseScore);
        }
    }

    if (pIsBackHtml == true) {
        return _imgScoreHtml;
    }

}

/**
 * 构造商品晒单图片显示代码
 * @param {any} pGooAppraiseImgsList  晒单图片列表
 * @param {any} pGoodsID 评价商品ID
 */
function xhtmlAppraiseImgs(pGooAppraiseImgsList, pGoodsID, pSpecParamVal) {

    //初始化PhotoSwipe的数据
    initPhotoSwipeData(pGooAppraiseImgsList);

    var myJsVal = "";
    for (var i = 0; i < pGooAppraiseImgsList.length; i++) {
        if (pGooAppraiseImgsList[i].GoodsID == pGoodsID && pGooAppraiseImgsList[i].SpecParamVal == pSpecParamVal) {
            myJsVal += "<div class=\"upload-pre-item\">";
        }
    }
    return myJsVal;
}

/**
 * 星星评分函数 -- 店铺评价
 * @param {any} pAppraiseScore 评价分数
 * @param {any} pLabelIDSubName 评价标子名称 [Goods,Service ,Speed,Attitude]
 * @param {any} pIsBackHtml 是否返回Html [true,false]
 */
function appraiseScoreShop(pAppraiseScore, pLabelIDSubName, pIsBackHtml) {


    //console.log("pAppraiseScore=" + pAppraiseScore + " | pAppraiseIndex=" + pAppraiseIndex);

    //构造评分Img
    var _imgScoreHtml = "";

    if (pAppraiseScore == "1") {
        _imgScoreHtml += "<img src=\"../Assets/Imgs/Icon/appraise_star.png\" />";
    }
    else if (pAppraiseScore == "2") {
        _imgScoreHtml += "<img src=\"../Assets/Imgs/Icon/appraise_star.png\" />";
        _imgScoreHtml += "<img src=\"../Assets/Imgs/Icon/appraise_star.png\" />";
    }
    else if (pAppraiseScore == "3") {
        _imgScoreHtml += "<img src=\"../Assets/Imgs/Icon/appraise_star.png\" />";
        _imgScoreHtml += "<img src=\"../Assets/Imgs/Icon/appraise_star.png\" />";
        _imgScoreHtml += "<img src=\"../Assets/Imgs/Icon/appraise_star.png\" />";
    }
    else if (pAppraiseScore == "4") {
        _imgScoreHtml += "<img src=\"../Assets/Imgs/Icon/appraise_star.png\" />";
        _imgScoreHtml += "<img src=\"../Assets/Imgs/Icon/appraise_star.png\" />";
        _imgScoreHtml += "<img src=\"../Assets/Imgs/Icon/appraise_star.png\" />";
        _imgScoreHtml += "<img src=\"../Assets/Imgs/Icon/appraise_star.png\" />";
    }
    else if (pAppraiseScore == "5") {
        _imgScoreHtml += "<img src=\"../Assets/Imgs/Icon/appraise_star.png\" />";
        _imgScoreHtml += "<img src=\"../Assets/Imgs/Icon/appraise_star.png\" />";
        _imgScoreHtml += "<img src=\"../Assets/Imgs/Icon/appraise_star.png\" />";
        _imgScoreHtml += "<img src=\"../Assets/Imgs/Icon/appraise_star.png\" />";
        _imgScoreHtml += "<img src=\"../Assets/Imgs/Icon/appraise_star.png\" />";
    }

    for (var i = 0; i < 5 - parseInt(pAppraiseScore); i++) {

        var _appraiseScore = parseInt(pAppraiseScore) + i + 1;

        _imgScoreHtml += "<img src=\"../Assets/Imgs/Icon/appraise_star_gray.png\" />";
    }

    //console.log("_imgScoreHtml=" + _imgScoreHtml);

    if (pLabelIDSubName != "") {
        if (pIsBackHtml == false) {
            $("#AppraiseStarItemShop_" + pLabelIDSubName).html(_imgScoreHtml);
            $("#hidAppraiseStarItemShop_" + pLabelIDSubName).val(pAppraiseScore);
            console.log("当前评分：" + pAppraiseScore);
        }
    }

    if (pIsBackHtml == true) {
        return _imgScoreHtml;
    }

}

//===================浏览晒单图片=========================//

/**
 * 初始化PhotoSwipe的数据
 * */
function initPhotoSwipeData(pGooAppraiseImgsList) {

    if (pGooAppraiseImgsList == null) {
        return;
    }

    mPhotoSwipeDataList = [];

    for (var i = 0; i < pGooAppraiseImgsList.length; i++) {


        mPhotoSwipeDataList[i] = {
            src: "//" + pGooAppraiseImgsList[i].ImgUrl,
            title: '<div style=\"font-size: 20px;\"></span>',
            w: 0,
            h: 0
        };

    }
    //console.log(mPhotoSwipeDataList);
}

/**
 * 打开晒单图片浏览
 * @param {any} pImgIndex
 */
function openPhotoSwipe(pImgIndex) {


    if (mPhotoSwipeDataList == null) {
        return
    }

    //初始化 PhotoSwipe 相册浏览   -- $(function(){  在这里调用，必须是加载完成所有文件 });
    initPhotoSwipeAlbum(mPhotoSwipeDataList, pImgIndex);

}