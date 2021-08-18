//============投诉详情========================//


/**-----定义公共变量------**/
var mAjaxUrl = "../BuyerAjax/ComplainDetail";

var mCID = "0";

/**------初始化------**/
$(function () {

    var mCID = $("#hidCID").val().trim();
    console.log("mCID=" + mCID);

    //初始化投诉详情信息
    initComplainDetail();

});


/**------自定义函数------**/

/**
 * 初始化投诉详情信息
 * */
function initComplainDetail() {

    //构造POST参数
    var dataPOST = {
        "Type": "1", "ComplainID": $("#hidCID").val().trim(),
    };
    console.log(dataPOST);
    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: mAjaxUrl + "?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("初始化投诉详情=" + reTxt);
            if (reTxt != "") {
                var _jsonReTxt = JSON.parse(reTxt);

                var ComplainStatusArr = _jsonReTxt.ComplainStatusArr;
                var ComplainMsg = _jsonReTxt.ComplainMsg;


                //设置进度条和底部按钮 投诉状态( 商家处理  -- 官方介入 --  买家确认 --  完成  ) 
                if (ComplainMsg.ComplainStatus == "商家处理") {
                    setStepProgress(0);

                    $("#OctFooterBtn").html("<div class=\"footer-btn-current\" onclick=\"applyOfficialIntervene()\">申请官方介入</div>");
                }
                else if (ComplainMsg.ComplainStatus == "官方介入") {
                    setStepProgress(1);
                }
                else if (ComplainMsg.ComplainStatus == "买家确认") {
                    setStepProgress(2);

                    $("#OctFooterBtn").html("<div onclick=\"applyOfficialIntervene()\">申请官方介入</div><div class=\"footer-btn-current\" onclick=\"buyerConfirmComplain()\">确认投诉</div>");
                }
                else if (ComplainMsg.ComplainStatus == "完成") {
                    setStepProgress(3);
                }

                //投诉分类( order 订单投诉，aftersale售后投诉，shop商家投诉，paltform平台投诉)
                var _ComplainCategory = "";
                if (ComplainMsg.ComplainCategory == "order") {
                    _ComplainCategory = "订单";
                }
                if (ComplainMsg.ComplainCategory == "PresentOrder") {
                    _ComplainCategory = "礼品订单";
                }
                else if (ComplainMsg.ComplainCategory == "aftersale") {
                    _ComplainCategory = "售后";
                }
                else if (ComplainMsg.ComplainCategory == "shop") {
                    _ComplainCategory = "商家";
                }
                else if (ComplainMsg.ComplainCategory == "paltform") {
                    _ComplainCategory = "平台";
                }

                $("#ComplainHint").html(ComplainStatusArr.ComplainStatusDesc);
                $("#ComplainCategory").html(_ComplainCategory);
                $("#ComplainType").html(ComplainMsg.ComplainType);
                $("#ComplainContent").html(ComplainMsg.ComplainContent);

                //======加载各种回复====//
                if (ComplainMsg.ShopReply != "" && ComplainMsg.ShopReply != null) {
                    $("#ShopReply").show();
                    $("#ShopReply").html(" <b>商家回复：</b>" + ComplainMsg.ShopReply + "<div>" + ComplainMsg.ShopReplyDate + "</div>");
                }
                if (ComplainMsg.ComplainReply != "" && ComplainMsg.ComplainReply != null) {
                    $("#ComplainReply").show();
                    $("#ComplainReply").html(" <b>官方回复：</b>" + ComplainMsg.ComplainReply + "<div>" + ComplainMsg.ReplyDate + "</div>");
                }


                //============加载不同投诉的显示信息==========//

                console.log("ComplainMsg.ComplainCategory=" + ComplainMsg.ComplainCategory);

                //判断不同分类的投诉
                if (ComplainMsg.ComplainCategory == "order") {

                    $("#OrderComplainCategory").show();

                    var OrderGoodsMsg = _jsonReTxt.OrderGoodsMsg;

                    $("#OrderID").html(OrderGoodsMsg.OrderID);
                    $("#OrderTime").html(OrderGoodsMsg.OrderTime);

                    mShopUserID = OrderGoodsMsg.ShopUserID;

                    if (OrderGoodsMsg.OrderGoodsList != undefined && OrderGoodsMsg.OrderGoodsList != null) {

                        //构造商店显示Xhtml
                        var myJsValShop = "";                        myJsValShop += "<a href=\"../Shop/Index?SID=" + OrderGoodsMsg.ShopMsg.ShopID + "\"><img src=\"//" + OrderGoodsMsg.ShopMsg.ShopHeaderImg + "\" />" + OrderGoodsMsg.ShopMsg.ShopName + "</a>";                        myJsValShop += "<div class=\"order-status-txt\">" + OrderGoodsMsg.OrderStatus + "</div>";                        $("#ShopMsg").html(myJsValShop);
                        //构造商品显示Xhtml
                        var myJsValGoods = "";                        for (var i = 0; i < OrderGoodsMsg.OrderGoodsList.length; i++) {                            if (OrderGoodsMsg.OrderGoodsList[i].GoodsTitle.length > 35) {                                OrderGoodsMsg.OrderGoodsList[i].GoodsTitle = OrderGoodsMsg.OrderGoodsList[i].GoodsTitle.substring(0, 34);
                            }                            myJsValGoods += "<a href=\"../Order/OrderDetail?OID=" + OrderGoodsMsg.OrderID + "\" class=\"order-goods-item\">";                            myJsValGoods += " <div class=\"goods-item-left\">";                            myJsValGoods += "     <img src=\"//" + OrderGoodsMsg.OrderGoodsList[i].GoodsCoverImgPath + "\" />";                            myJsValGoods += " </div>";                            myJsValGoods += " <div class=\"goods-item-mid\">";                            myJsValGoods += "     <span class=\"goods-item-title\">" + OrderGoodsMsg.OrderGoodsList[i].GoodsTitle + "</span>";                            myJsValGoods += "     <span class=\"goods-item-spec\">" + OrderGoodsMsg.OrderGoodsList[i].SpecParamVal + "</span>";                            myJsValGoods += " </div>";                            myJsValGoods += " <div class=\"goods-item-right\">";                            myJsValGoods += "     <span class=\"goods-item-price\">&#165; " + OrderGoodsMsg.OrderGoodsList[i].GoodsUnitPrice + "</span>";                            myJsValGoods += "     <span class=\"goods-item-ordernum\">&times; " + OrderGoodsMsg.OrderGoodsList[i].OrderNum + "</span>";                            myJsValGoods += " </div>";                            myJsValGoods += "</a>";
                        }                        //显示代码插入前台                        $("#OrderGoodsMsg").html(myJsValGoods);
                    }
                }
                else if (ComplainMsg.ComplainCategory == "PresentOrder") {

                    var PresentOrderMsg = _jsonReTxt.PresentOrder.PresentOrderMsg
                    var ShopMsg = _jsonReTxt.PresentOrder.ShopMsg
                    var ExtraData = _jsonReTxt.PresentOrder.ExtraData

                    mShopUserID = ShopMsg.UserID;


                    $("#PresentOrderComplainCategory").show();

                    $("#PresentOrderID").html(PresentOrderMsg.PstOrderID);
                    $("#PresentOrderTime").html(PresentOrderMsg.OrderTime);

                    var _xhtmlShop = "";
                    _xhtmlShop += "<a href=\"../Shop/Index?SID=" + ShopMsg.ShopID + "\"><img src=\"//" + ShopMsg.ShopHeaderImg + "\" />" + ShopMsg.ShopName + "</a>";                    _xhtmlShop += "<div class=\"order-status-txt\">" + PresentOrderMsg.OrderStatus + "</div>";                    $("#PresentShopMsg").html(_xhtmlShop);                    //礼品显示                    var _xhtmlGoods = "";                    _xhtmlGoods += "<a href=\"../PresentOrder/PresentOrderDetail?POID=" + PresentOrderMsg.PstOrderID + "\" class=\"order-goods-item\">";                    _xhtmlGoods += " <div class=\"goods-item-left\">";                    _xhtmlGoods += "     <img src=\"//" + ExtraData.PresentCoverImgURL + "\" />";                    _xhtmlGoods += " </div>";                    _xhtmlGoods += " <div class=\"goods-item-mid\">";                    _xhtmlGoods += "     <span class=\"goods-item-title\">" + PresentOrderMsg.PresentTitleArr + "</span>";                    _xhtmlGoods += "     <span class=\"goods-item-spec\"></span>";                    _xhtmlGoods += " </div>";                    _xhtmlGoods += " <div class=\"goods-item-right\">";                    _xhtmlGoods += "     <span class=\"goods-item-price\">&#165;" + PresentOrderMsg.PresentPriceArr + "</span>";                    _xhtmlGoods += "     <span class=\"goods-item-ordernum\">&times; 1</span>";                    _xhtmlGoods += " </div>";                    _xhtmlGoods += "</a>";                    $("#PresentOrderGoodsMsg").html(_xhtmlGoods);
                }
                else if (ComplainMsg.ComplainCategory == "aftersale") {

                    $("#AfterSaleComplain").show();
                    $("#ComplainTypeVal").text("售后问题");

                    var AfterSaleGoods = _jsonReTxt.AfterSaleMsg.AfterSaleGoods;
                    var AfterSaleApplyMsg = _jsonReTxt.AfterSaleMsg.AfterSaleApplyMsg;

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


                    var myJsValAs = "<li class=\"order-item\">";                    myJsValAs += " <div class=\"order-item-top aftersale-item-top\">";                    myJsValAs += "     <a href=\"../AfterSale/AsDetail?AID=" + AfterSaleApplyMsg.ApplyID + "\"><img src=\"../Assets/Imgs/Icon/aftersale_list.png\" />售后ID:" + AfterSaleApplyMsg.ApplyID + "</a>";                    myJsValAs += "     <div class=\"aftersale-status-txt\">";                    myJsValAs += "" + AfterSaleApplyMsg.ApplyStatus + "";                    myJsValAs += "     </div>";                    myJsValAs += " </div>";                    myJsValAs += " <div class=\"order-item-mid\" onclick=\"window.location.href=\'#\'\">";                    myJsValAs += "     <a href=\"../AfterSale/AsDetail?AID=" + AfterSaleApplyMsg.ApplyID + "\" class=\"order-goods-item\">";                    myJsValAs += "         <div class=\"goods-item-left\">";                    myJsValAs += "             <img src=\"//" + AfterSaleGoods.GoodsCoverImgPath + "\" />";                    myJsValAs += "         </div>";                    myJsValAs += "         <div class=\"goods-item-mid\">";                    myJsValAs += "             <span class=\"goods-item-title\">" + AfterSaleGoods.GoodsTitle + "</span>";                    myJsValAs += "             <span class=\"goods-item-spec\">" + AfterSaleGoods.SpecParamVal + "</span>";                    myJsValAs += "         </div>";                    myJsValAs += "         <div class=\"goods-item-right\">";                    myJsValAs += "             <span class=\"goods-item-price\">&#165;" + AfterSaleGoods.GoodsUnitPrice + "</span>";                    myJsValAs += "             <span class=\"goods-item-ordernum\">&times; " + AfterSaleGoods.OrderNum + "</span>";                    myJsValAs += "             <span class=\"goods-aftersale-num\">" + AfterSaleApplyMsg.ServiceType + "数量:" + AfterSaleApplyMsg.ApplyGoodsNum + "</span>";                    myJsValAs += "         </div>";                    myJsValAs += "     </a>";                    myJsValAs += " </div>";                    myJsValAs += "</li>";                    //显示代码插入前台
                    $("#AfterSaleComplainUl").html(myJsValAs);
                }
                else if (ComplainMsg.ComplainCategory == "shop") {

                    $("#ShopMsgBar").show();
                    $("#ComplainTypeVal").text("店铺服务");

                    var ShopMsg = _jsonReTxt.ShopMsg;
                    var ShopAppScoreList = ShopMsg.ShopAppScoreList;

                    mShopUserID = ShopMsg.ShopMsg.UserID;

                    //店铺标签                    var _shopLabelArr = new Array();
                    if (ShopMsg.ShopMsg.ShopLabelArr.indexOf("^")) {
                        _shopLabelArr = ShopMsg.ShopMsg.ShopLabelArr.split("^");
                    }
                    else {
                        _shopLabelArr[0] = ShopMsg.ShopMsg.ShopLabelArr;
                    }

                    $("#ShopHeaderBar").html("<a href=\"../Shop/Index?SID=" + ShopMsg.ShopMsg.ShopID + "\"><img src=\"//" + ShopMsg.ShopMsg.ShopHeaderImg + "\" /></a>");
                    var myJsValShopTitle = "<a href=\"../Shop/Index?SID=" + ShopMsg.ShopMsg.ShopID + "\" target=\"_blank\">" + ShopMsg.ShopMsg.ShopName + "</a>";                    for (var i = 0; i < _shopLabelArr.length; i++) {                        if (_shopLabelArr[i] != "") {                            myJsValShopTitle += "<span class=\"shop-label\">" + _shopLabelArr[i] + "</span>";
                        }                    }                    myJsValShopTitle += "<span class=\"shop-arrow\">&nbsp;</span>";                    $("#ShopTitleBar").html(myJsValShopTitle);

                    $("#ShopScoreBar").html("商品: <b>" + ShopAppScoreList.ConformityScoreAvg + "</b>服务: <b>" + ShopAppScoreList.AttitudeScoreAvg + "</b>物流: <b>" + ShopAppScoreList.ExpressScoreAvg + "</b>配送: <b>" + ShopAppScoreList.DeliverymanScoreAvg + "</b>");

                    $("#ShopAttenBar").html(ShopMsg.ShopFavCount + " ");
                    $("#ShopMajorGoodBar").html(ShopMsg.ShopMsg.MajorGoods);

                    $("#ShopGoIndexBar").attr("href", "../Shop/Index?SID=" + ShopMsg.ShopMsg.ShopID);
                    $("#ShopGoSeviceBar").attr("href", "tel:" + ShopMsg.ShopMsg.ShopMobile);
                }
                else {

                }


            }
        }
    });
}


/**
 * 设置当前进度步骤条
 * @param {any} pProgressNum 当前进度数 从0开始
 */
function setStepProgress(pProgressNum) {

    //获取进度条标签
    var stepDescNumArr = $(".step-desc-num");
    var stepDescTxtArr = $(".step-desc-txt");

    //移除所有当前进度样式 
    for (var j = 0; j < stepDescNumArr.length; j++) {
        $(stepDescNumArr[j]).removeClass("step-desc-num-current");
        $(stepDescTxtArr[j]).removeClass("step-desc-txt-current");
    }

    //循环检测是否为当前进度
    for (var i = 0; i < stepDescNumArr.length; i++) {
        if (i <= pProgressNum) {
            $(stepDescNumArr[i]).addClass("step-desc-num-current");
            $(stepDescTxtArr[i]).addClass("step-desc-txt-current");
        }
    }

    //设置进度条长度
    if (pProgressNum == 0) {
        $(".complain-step-current").css("width", "20%");
    }
    else if (pProgressNum == 1) {
        $(".complain-step-current").css("width", "45%");
    }
    else if (pProgressNum == 1.5) {
        $(".complain-step-current").css("width", "53%");
    }
    else if (pProgressNum == 2) {
        $(".complain-step-current").css("width", "70%");
    }
    else if (pProgressNum == 2.5) {
        $(".complain-step-current").css("width", "80%");
    }
    else if (pProgressNum == 3) {
        $(".complain-step-current").css("width", "100%");
    }
}

/**
 * 申请官方介入
 * */
function applyOfficialIntervene() {

    confirmWin("确认申请官方介入吗？", function () {

        //构造POST参数
        var dataPOST = {
            "Type": "2", "ComplainID": $("#hidCID").val().trim(),
        };
        console.log(dataPOST);
        //正式发送异步请求
        $.ajax({
            type: "POST",
            url: mAjaxUrl + "?rnd=" + Math.random(),
            data: dataPOST,
            dataType: "html",
            success: function (reTxt, status, xhr) {
                console.log("申请官方介入=" + reTxt);
                if (reTxt != "") {
                    var _jsonReTxt = JSON.parse(reTxt);

                    if (_jsonReTxt.ErrMsg != undefined && _jsonReTxt.ErrMsg != null && _jsonReTxt.ErrMsg != "") {
                        toastWin(_jsonReTxt.ErrMsg);
                        return;
                    }

                    if (_jsonReTxt.Msg != undefined && _jsonReTxt.Msg != null && _jsonReTxt.Msg != "") {
                        toastWinCb(_jsonReTxt.Msg, function () {

                            window.location.reload();

                        });
                    }
                }
            }
        });


    });

}


/**
 * 买家确认投诉，投诉完成
 * */
function buyerConfirmComplain() {


    //构造POST参数
    var dataPOST = {
        "Type": "3", "ComplainID": $("#hidCID").val().trim(),
    };
    console.log(dataPOST);
    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: mAjaxUrl + "?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("买家确认投诉=" + reTxt);
            if (reTxt != "") {
                var _jsonReTxt = JSON.parse(reTxt);

                if (_jsonReTxt.ErrMsg != undefined && _jsonReTxt.ErrMsg != null && _jsonReTxt.ErrMsg != "") {
                    toastWin(_jsonReTxt.ErrMsg);
                    return;
                }

                if (_jsonReTxt.Msg != undefined && _jsonReTxt.Msg != null && _jsonReTxt.Msg != "") {
                    toastWinCb(_jsonReTxt.Msg, function () {

                        window.location.reload();

                    });
                }
            }
        }
    });


}

