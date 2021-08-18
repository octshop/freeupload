//==============售后详情=========================//

/**-----定义公共变量------**/
var mAjaxUrl = "../AfterSaleAjax/AsDetail";

var mAID = ""; //申请售后ID
var mShopUserID = ""; //商家UserID

//构建商家店铺咨询进入IM在线客服系统 跳转 URL
var mBuyerGoToImSysURL_ShopWap = "";


/**------初始化------**/
$(function () {

    mAID = $("#hidAID").val().trim();

    //初始化售后信息
    initAfterSaleMsg();

});


/**------========自定义函数========------**/

/**
 * 初始化售后信息
 * */
function initAfterSaleMsg() {

    //构造POST参数
    var dataPOST = {
        "Type": "1", "ApplyID": mAID,
    };
    console.log(dataPOST);
    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: mAjaxUrl + "?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("初始化售后信息=" + reTxt);
            if (reTxt != "") {

                var _jsonReTxt = JSON.parse(reTxt);

                //赋值到表单
                setValToForm(_jsonReTxt);
            }
        }
    });
}

/**
 * 赋值到表单
 * @param {any} pJsonReTxt
 */
function setValToForm(pJsonReTxt) {

    //初始化全部变量
    mShopUserID = pJsonReTxt.AfterSaleMsg.ShopUserID;

    $("#StatusTitleDesc").html("<div>" + pJsonReTxt.StatusTitle + "</div>" + pJsonReTxt.StatusDesc + "");

    if (pJsonReTxt.AfterSaleSysMsg != undefined && pJsonReTxt.AfterSaleSysMsg != null) {
        //动态信息
        $("#AfterSaleDynamicMsg").html(pJsonReTxt.AfterSaleSysMsg.MsgContent);
        $("#AfterSaleDynamicDate").html(pJsonReTxt.AfterSaleSysMsg.WriteDate);

        if (pJsonReTxt.AfterSaleSysMsg.MsgContent.indexOf("物流单号") >= 0) {
            //$("#ExpressMsg").attr("onclick", "window.location.href='../Order/ExpressDetail?AID=" + pJsonReTxt.AfterSaleMsg.ApplyID + "'");
        }
    }

    if (pJsonReTxt.DiffAutoFinishTimeAs != undefined && pJsonReTxt.DiffAutoFinishTimeAs != null && pJsonReTxt.DiffAutoFinishTimeAs != "") {
        $("#AutoFinishDateTime").show();
        $("#AutoFinishDateTime").html(" [ 自动确认签收完成售后剩：<b> " + pJsonReTxt.DiffAutoFinishTimeAs + " </b> ]");
    }

    //售后信息
    var ServiceTypeName = getpServiceTypeName(pJsonReTxt.AfterSaleMsg.ServiceType)

    $(document).attr("title", "售后" + ServiceTypeName + "详情");
    $("#PageTitle").html("售后" + ServiceTypeName + "详情");
    $("#ServiceTypeName").html(ServiceTypeName);
    $("#ApplyReason").html(pJsonReTxt.AfterSaleMsg.ApplyReason);
    $("#ProblemDesc").html(pJsonReTxt.AfterSaleMsg.ProblemDesc);

    //构造问题图片
    var _xhtmlProblemImgs = "";
    if (pJsonReTxt.ProblemImgsList != undefined && pJsonReTxt.ProblemImgsList != null) {
        for (var i = 0; i < pJsonReTxt.ProblemImgsList.length; i++) {
            _xhtmlProblemImgs += "<a href=\"//" + pJsonReTxt.ProblemImgsList[i].ImgPath + "\" target=\"_blank\"><img src=\"//" + pJsonReTxt.ProblemImgsList[i].ImgPath + "\" /></a>";
        }
    }
    $("#ProblemImgsList").html(_xhtmlProblemImgs);

    //买家收货地址
    if (pJsonReTxt.AfterSaleDelivery != undefined && pJsonReTxt.AfterSaleDelivery != null) {

        if (pJsonReTxt.AfterSaleDelivery.DeliveryID != 0) {
            $("#AfterSaleDelivery").show();
            $("#RegionNameDetailAddr").html(pJsonReTxt.AfterSaleDelivery.RegionNameArr + "_" + pJsonReTxt.AfterSaleDelivery.DetailAddr);
            $("#DeliName").html(pJsonReTxt.AfterSaleDelivery.DeliName);
            $("#Mobile").html(pJsonReTxt.AfterSaleDelivery.Mobile);
        }
    }

    //判断是否显示 买家发货表单
    if (pJsonReTxt.AfterSaleMsg.ApplyStatus == "买家发货") {
        $("#BuyerExpressMsg").show();
    }

    //商家售后地址
    if (pJsonReTxt.AfterSaleDeliveryShop != undefined && pJsonReTxt.AfterSaleDeliveryShop != null) {

        if (pJsonReTxt.AfterSaleDeliveryShop.DeliveryID != 0) {
            $("#AfterSaleDeliveryShop").show();
            $("#RegionNameDetailAddrShop").html(pJsonReTxt.AfterSaleDeliveryShop.RegionNameArr + "_" + pJsonReTxt.AfterSaleDeliveryShop.DetailAddr);
            $("#DeliNameShop").html(pJsonReTxt.AfterSaleDeliveryShop.DeliName);
            $("#MobileShop").html("<a href=\"tel: " + pJsonReTxt.AfterSaleDeliveryShop.Mobile + "\" style=\"color:#006CB4\">" + pJsonReTxt.AfterSaleDeliveryShop.Mobile + "</a>");
        }
    }

    //构造底部按钮列表并赋值
    xhtmlBottomBtnList(pJsonReTxt.AfterSaleMsg.ApplyStatus, pJsonReTxt.AfterSaleMsg.ApplyID, pJsonReTxt.AfterSaleMsg.OrderID, pJsonReTxt.AfterSaleMsg.ShopUserID);

    //服务类型 (maintain 维修 barter 换货 , refund 退货)
    if (pJsonReTxt.AfterSaleMsg.ServiceType == "maintain") {
        $("#StepDescTxt3").html("维修中");
    }
    else if (pJsonReTxt.AfterSaleMsg.ServiceType == "barter") {
        $("#StepDescTxt3").html("换货中");
    }
    else if (pJsonReTxt.AfterSaleMsg.ServiceType == "refund") {
        $("#StepDescTxt3").html("退款中");
    }


    //设置当前进度步骤条
    if (pJsonReTxt.AfterSaleMsg.ApplyStatus == "确认") {
        setStepProgress(0);
    }
    else if (pJsonReTxt.AfterSaleMsg.ApplyStatus == "买家发货") {
        setStepProgress(1);
    }
    else if (pJsonReTxt.AfterSaleMsg.ApplyStatus == "待商家签收") {
        setStepProgress(1.5);
    }
    else if (pJsonReTxt.AfterSaleMsg.ApplyStatus == "商家处理中") {
        setStepProgress(2);
    }
    else if (pJsonReTxt.AfterSaleMsg.ApplyStatus == "退款中") {
        setStepProgress(2);
    }
    else if (pJsonReTxt.AfterSaleMsg.ApplyStatus == "商家发回") {
        setStepProgress(2.5);
    }
    else if (pJsonReTxt.AfterSaleMsg.ApplyStatus == "已退款") {
        setStepProgress(2.5);
    }
    else if (pJsonReTxt.AfterSaleMsg.ApplyStatus == "完成") {
        setStepProgress(3);
    }
    else if (pJsonReTxt.AfterSaleMsg.ApplyStatus == "拒绝") {

        var myJsValRefuse = "";        myJsValRefuse += "<div class=\"step-desc-num\">2</div>";        myJsValRefuse += "<div class=\"step-desc-txt\">拒绝售后</div>";
        $("#StepDescItem4").html(myJsValRefuse);

        $("#StepDescItem2").hide();
        $("#StepDescItem3").hide();

        setStepProgress(3);

        $("#RefuseExplain").show();
        $("#RefuseExplainContent").html(pJsonReTxt.AfterSaleMsg.ReplyExplain);
    }


    //------------上门服务流程--------------//
    if (pJsonReTxt.AfterSaleMsg.ApplyStatus == "待上门") {
        $("#StepDescTxt2").html("待上门");
        $("#StepDescTxt3").html("上门售后中");

        setStepProgress(1);
    }
    else if (pJsonReTxt.AfterSaleMsg.ApplyStatus == "上门服务中") {
        $("#StepDescTxt2").html("待上门");
        $("#StepDescTxt3").html("上门售后中");

        setStepProgress(2);
    }
    //显示上门信息
    if (pJsonReTxt.AfterSaleMsg.ApplyStatus == "待上门" || pJsonReTxt.AfterSaleMsg.ApplyStatus == "上门服务中") {
        $("#VisitingMsgShow").show();

        var myJsValVisiting = "<span>上门人员姓名：</span>" + pJsonReTxt.AfterSaleSendGoods.SendShopMan + " <span style=\"padding-left: 20px;\">联系电话：</span><a href=\"tel:" + pJsonReTxt.AfterSaleSendGoods.SendTelNumber + "\">" + pJsonReTxt.AfterSaleSendGoods.SendTelNumber + "</a>";
        $("#VisitingMsgShow").html(myJsValVisiting);
    }

    //------------退货流程--------------//
    if (pJsonReTxt.AfterSaleMsg.ApplyStatus != "确认" && pJsonReTxt.AfterSaleMsg.ApplyStatus != "拒绝") {
        if (pJsonReTxt.AfterSaleMsg.ServiceType == "refund") {
            $("#RefundMoneyShow").show();
            $("#RefundMoneyShow").html(" [ &nbsp; 退款金额：<b> &#165; " + formatNumberDotDigit(pJsonReTxt.AfterSaleMsg.RefundMoney) + " 元 </b>  &nbsp; ]");
        }
    }



    //初始化售后申请的订单商品信息
    initAsOrderGoodsMsg(pJsonReTxt.AfterSaleMsg.OrderID, pJsonReTxt.AfterSaleMsg.GoodsID, pJsonReTxt.AfterSaleMsg.SpecID, pJsonReTxt.AfterSaleMsg.ApplyGoodsNum);


}


/**
 * 初始化售后申请的订单商品信息
 * */
function initAsOrderGoodsMsg(pOrderID, pGoodsID, pSpecID, pApplyGoodsNum) {
    //构造POST参数
    var dataPOST = {
        "Type": "1", "OrderID": pOrderID, "GoodsID": pGoodsID, "SpecID": pSpecID,
    };
    console.log(dataPOST);
    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: "../AfterSaleAjax/AsSelType?rnd=" + Math.random(),
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

                $("#ApplyNum").html(pApplyGoodsNum);

                $("#CustomServicesOnlineDiv").on("click", function () {
                    window.location.href = "tel:" + _jsonReTxt.ShopMobile;
                });
                $("#CustomServicesTelDiv").on("click", function () {
                    window.location.href = "tel:" + _jsonReTxt.ShopMobile;
                });

                //设置跳转到详情页
                $("#ToOrderDetail").click(function () {
                    window.location.href = '../Order/OrderDetail?OID=' + pOrderID;
                });

                //构建商家店铺咨询进入IM在线客服系统 跳转 URL
                buildBuyerGoToImSysURL_ShopWap(_jsonReTxt.ShopUserID, _jsonReTxt.BuyerUserID);


            }
        }
    });
}

/**
 * 构造底部按钮列表并赋值
 * @param {any} pApplyStatus 售后状态
 * @param {any} pApplyID 售后ID
 * @param {any} pOrderID 订单ID
 * @param {any} pShopUserID 商家UserID
 */
function xhtmlBottomBtnList(pApplyStatus, pApplyID, pOrderID, pShopUserID) {

    var _xhtmlBottomList = "<div onclick=\"window.location.href='../Buyer/ComplainSubmit?AID=" + pApplyID + "'\">投诉</div>";

    if (pApplyStatus == "确认") {
        _xhtmlBottomList += "<div class=\"footer-btn-current\" onclick=\"remindAfterSaleCheck(" + pApplyID + ", " + pOrderID + ", " + pShopUserID + ")\">提醒审核</div>";    }
    if (pApplyStatus == "商家发回") {
        _xhtmlBottomList += "<div class=\"footer-btn-current\" onclick=\"buyerReceiAsGoodsFinish()\">确认签收</div>";    }
    if (pApplyStatus == "待上门") {
        _xhtmlBottomList += "<div onclick=\"confirmAsVisitingFinish('" + pApplyStatus + "')\">确认售后完成</div>";
        _xhtmlBottomList += "<div class=\"footer-btn-current\" onclick=\"confirmAsVisiting('" + pOrderID + "')\">已上门售后中</div>";    }
    if (pApplyStatus == "上门服务中") {
        _xhtmlBottomList += "<div class=\"footer-btn-current\" onclick=\"confirmAsVisitingFinish('" + pApplyStatus + "')\">确认售后完成</div>";
    }

    if (pApplyStatus == "已退款") {
        _xhtmlBottomList += "<div class=\"footer-btn-current\" onclick=\"confirmAsRefundFinish('" + pApplyID + "')\">确认收到退款</div>";
    }

    if (pApplyStatus == "拒绝") {
        //_xhtmlBottomList += "<div class=\"footer-btn-current\" onclick=\"\">投诉商家</div>";
    }


    $("#BottomBtnList").html(_xhtmlBottomList);
    $("#ComplainShopDiv").on("click", function () {
        window.location.href = "../Buyer/ComplainSubmit?AID=" + pApplyID + "";
    });

}

/**
 * 提醒商家审核售后
 * @param {any} pApplyID 售后ID
 * @param {any} pOrderID 订单ID
 * @param {any} pShopUserID 商家UserID
 */
function remindAfterSaleCheck(pApplyID, pOrderID, pShopUserID) {

    //构造POST参数
    var dataPOST = {
        "Type": "2", "ApplyID": pApplyID, "OrderID": pOrderID, "ShopUserID": pShopUserID,
    };
    console.log(dataPOST);
    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: mAjaxUrl + "?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("提醒商家审核售后=" + reTxt);
            if (reTxt != "") {
                var _jsonReTxt = JSON.parse(reTxt);
                toastWin("提醒成功");
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
 * 得到 售后服务 服务类型
 * @param {any} pServiceType 服务类型 (maintain 维修 barter 换货 , refund 退货)
 */
function getpServiceTypeName(pServiceType) {
    if (pServiceType == "maintain") {
        return "维修";
    }
    else if (pServiceType == "barter") {
        return "换货";
    }
    else if (pServiceType == "refund") {
        return "退货";
    }
    return "";
}

/**
 * 买家发货，发回售后商品
 * */
function buyerSendGoods() {

    //获取表单值
    var ExpressName = $("#ExpressName").val().trim();
    var ExpressNumber = $("#ExpressNumber").val().trim();
    if (ExpressName == "" || ExpressNumber == "") {

        toastWin("【物流名称】【物流单号】都不能为空！");
        return;
    }

    $("#BtnSubmitExpress").val("…提交中…");
    $("#BtnSubmitExpress").attr("disabled", true);

    //构造POST参数
    var dataPOST = {
        "Type": "3", "ApplyID": mAID, "ShopUserID": mShopUserID, "ExpressName": ExpressName, "ExpressNumber": ExpressNumber,
    };
    console.log(dataPOST);
    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: mAjaxUrl + "?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("买家发货=" + reTxt);
            $("#BtnSubmitExpress").val("提交物流信息");
            $("#BtnSubmitExpress").attr("disabled", false);
            if (reTxt != "") {

                var _jsonReTxt = JSON.parse(reTxt);

                if (_jsonReTxt.ErrMsg != undefined && _jsonReTxt.ErrMsg != null && _jsonReTxt.ErrMsg != "") {
                    toastWin(_jsonReTxt.ErrMsg);
                    return;
                }

                if (_jsonReTxt.Msg != undefined && _jsonReTxt.Msg != null && _jsonReTxt.Msg != "") {
                    toastWinCb(_jsonReTxt.Msg, function () {
                        //重新加载
                        window.location.reload();
                    });
                    return;
                }

            }
        }
    });

}

/**
 * 买家确认签收发回的售后商品，商家售后完成
 * */
function buyerReceiAsGoodsFinish() {

    confirmWin("确认签收完成售后？", function () {

        //构造POST参数
        var dataPOST = {
            "Type": "4", "ApplyID": mAID,
        };
        console.log(dataPOST);
        //正式发送异步请求
        $.ajax({
            type: "POST",
            url: mAjaxUrl + "?rnd=" + Math.random(),
            data: dataPOST,
            dataType: "html",
            success: function (reTxt, status, xhr) {
                console.log("买家确认签收=" + reTxt);

                if (reTxt != "") {

                    var _jsonReTxt = JSON.parse(reTxt);

                    if (_jsonReTxt.ErrMsg != undefined && _jsonReTxt.ErrMsg != null && _jsonReTxt.ErrMsg != "") {
                        toastWin(_jsonReTxt.ErrMsg);
                        return;
                    }

                    if (_jsonReTxt.Msg != undefined && _jsonReTxt.Msg != null && _jsonReTxt.Msg != "") {
                        toastWinCb(_jsonReTxt.Msg, function () {
                            //重新加载
                            window.location.reload();
                        });
                        return;
                    }

                }
            }
        });

    });
}

/**
 * 买家 确认上门人员已到达，售后服务中
 * @param {any} pOrderID
 */
function confirmAsVisiting(pOrderID) {

    confirmWin("确定已上门？", function () {

        //构造POST参数
        var dataPOST = {
            "Type": "5", "ApplyID": mAID, "OrderID": pOrderID,
        };
        console.log(dataPOST);
        //正式发送异步请求
        $.ajax({
            type: "POST",
            url: mAjaxUrl + "?rnd=" + Math.random(),
            data: dataPOST,
            dataType: "html",
            success: function (reTxt, status, xhr) {
                console.log("确认上门人员已到达=" + reTxt);

                if (reTxt != "") {

                    var _jsonReTxt = JSON.parse(reTxt);

                    if (_jsonReTxt.ErrMsg != undefined && _jsonReTxt.ErrMsg != null && _jsonReTxt.ErrMsg != "") {
                        toastWin(_jsonReTxt.ErrMsg);
                        return;
                    }

                    if (_jsonReTxt.Msg != undefined && _jsonReTxt.Msg != null && _jsonReTxt.Msg != "") {
                        toastWinCb(_jsonReTxt.Msg, function () {
                            //重新加载
                            window.location.reload();
                        });
                        return;
                    }

                }
            }
        });

    });

}

/**
 * 买家确认上门服务售后完成，商家售后完成
 * */
function confirmAsVisitingFinish() {

    confirmWin("确定上门售后完成？", function () {

        //构造POST参数
        var dataPOST = {
            "Type": "6", "ApplyID": mAID,
        };
        console.log(dataPOST);
        //正式发送异步请求
        $.ajax({
            type: "POST",
            url: mAjaxUrl + "?rnd=" + Math.random(),
            data: dataPOST,
            dataType: "html",
            success: function (reTxt, status, xhr) {
                console.log("确定上门售后完成=" + reTxt);

                if (reTxt != "") {

                    var _jsonReTxt = JSON.parse(reTxt);

                    if (_jsonReTxt.ErrMsg != undefined && _jsonReTxt.ErrMsg != null && _jsonReTxt.ErrMsg != "") {
                        toastWin(_jsonReTxt.ErrMsg);
                        return;
                    }

                    if (_jsonReTxt.Msg != undefined && _jsonReTxt.Msg != null && _jsonReTxt.Msg != "") {
                        toastWinCb(_jsonReTxt.Msg, function () {
                            //重新加载
                            window.location.reload();
                        });
                        return;
                    }

                }
            }
        });

    });
}

/**
 * 买家确认收到退款 确认收到退款
 * */
function confirmAsRefundFinish(pApplyID) {

    confirmWin("确认收到退款？", function () {

        //构造POST参数
        var dataPOST = {
            "Type": "7", "ApplyID": pApplyID,
        };
        console.log(dataPOST);
        //正式发送异步请求
        $.ajax({
            type: "POST",
            url: mAjaxUrl + "?rnd=" + Math.random(),
            data: dataPOST,
            dataType: "html",
            success: function (reTxt, status, xhr) {
                console.log("确认收到退款=" + reTxt);

                if (reTxt != "") {

                    var _jsonReTxt = JSON.parse(reTxt);

                    if (_jsonReTxt.ErrMsg != undefined && _jsonReTxt.ErrMsg != null && _jsonReTxt.ErrMsg != "") {
                        toastWin(_jsonReTxt.ErrMsg);
                        return;
                    }

                    if (_jsonReTxt.Msg != undefined && _jsonReTxt.Msg != null && _jsonReTxt.Msg != "") {
                        toastWinCb(_jsonReTxt.Msg, function () {
                            //重新加载
                            window.location.reload();
                        });
                        return;
                    }

                }
            }
        });

    });

}




//=========================弹出窗口=============================//

//------------------选择快递窗口信息---------------//
var mSelExpressWinHtml = "";
function openSelExpressWin() {

    if (mSelExpressWinHtml == "") {

        mSelExpressWinHtml = getSelExpressWinHtml();
    }
    //初始化SliderDown窗口
    initSilderDownWin(600, mSelExpressWinHtml);

    //设置窗口显示代码Html --放在toggleSilderDownWin()之前可以高度可以自动适应
    //setSelExpressWinHtml();

    //打开窗口
    toggleSilderDownWin();


}
/**
 * 得到窗口显示代码
 */
function getSelExpressWinHtml() {

    var _html = $("#WinSelExpress").html();

    $("#WinSelExpress").html("");
    $("#WinSelExpress").remove();
    $("body").remove("#WinSelExpress");

    mSelExpressWinHtml = "";

    return _html
}

////设置窗口显示代码Html
//function setSelExpressWinHtml() {

//    var myJsVal = "";//    //显示代码插入前台
//    $("#WinSelExpressContent").html(myJsVal);
//}

/**
 * 选择快递名称
 * @param {any} pExpressName 快递名称
 */
function clickSelExpress(pExpressName) {

    $("#ExpressName").val(pExpressName);
    //关闭窗口
    toggleSilderDownWin();
}




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

                    $("#CustomServicesOnlineDiv").unbind();
                    //页脚下面的客服
                    $("#CustomServicesOnlineDiv").on("click", function () {
                        window.location.href = encodeURI(mBuyerGoToImSysURL_ShopWap);
                    });
                    //$("#CusServiceA").attr("href", encodeURI(mBuyerGoToImSysURL_ShopWap));


                }
            }
        }
    });
}

