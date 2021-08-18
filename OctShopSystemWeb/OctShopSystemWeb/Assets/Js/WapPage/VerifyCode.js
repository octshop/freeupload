/*=====================核销验证===========================*/

/**-----定义公共变量------**/

//AjaxURL
var mAjaxUrl = "../VerifyCode/VerifyCodeAll";


/**------初始化------**/
$(function () {

    $("input[name=ExtraDataName]").val($("#hidExtraDataID").val().trim());

});

/**------自定义函数------**/

/**
 * 切换验证类型
 * */
function chgVerifyType() {

    var pVerifyType = $("#VerifyTypeSel").val().trim();

    $("#OrderCheckDiv").hide();
    $("#PresentOrderDiv").hide();
    $("#CouponsDiv").hide();
    $("#ActivityJoinDiv").hide();
    $("#LuckydrawDiv").hide();

    if (pVerifyType == "OrderCheck") {
        $("#OrderCheckDiv").show();
    }
    else if (pVerifyType == "PresentOrder") {
        $("#PresentOrderDiv").show();
    }
    else if (pVerifyType == "Coupons") {
        $("#CouponsDiv").show();
    }
    else if (pVerifyType == "ActivityJoin") {
        $("#ActivityJoinDiv").show();

    }
    else if (pVerifyType == "Luckydraw") {
        $("#LuckydrawDiv").show();
    }
}

/**
 * 提交核销验证
 * */
function submitVerifyCode() {

    //获取表单信息
    var VerifyType = $("#VerifyTypeSel").val().trim();

    //商家订单的核销验证
    if (VerifyType == "OrderCheck") {
        //查询验证订单信息列表
        searchCheckOrder();
    }
    else {
        //得到店铺指定类别的 验证码信息 列表
        getShopVerifyCodeMsgList();
    }
}

/**
 * 查询验证订单信息列表
 * */
function searchCheckOrder() {

    //获取表单值
    var OrderIDTxt = $("#OrderIDTxt").val().trim();
    var VerifyCodeTxt = $("#VerifyCodeTxt").val().trim();
    if (VerifyCodeTxt == "") {
        toastWin("【验证码】不能为空！");
        $("#VerifyCodeTxt").focus();
        return;
    }

    //构造POST参数
    var dataPOST = {
        "Type": "1", "OrderID": OrderIDTxt, "CheckCode": VerifyCodeTxt,
    };
    console.log(dataPOST);

    //加载提示窗口
    //loadingWin();

    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: "../Trading/VerifyCheckCodeOrderStatus?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("验证订单验证码=" + reTxt);

            //移除加载提示
            //closeLoadingWin();

            if (reTxt != "") {
                var _jsonObj = JSON.parse(reTxt);
                if (_jsonObj.OrderCheckCodeOrderMsgList.length > 1) {
                    toastWin("有相同验证码，请输入订单ID！");
                    $("#OrderIDTxt").focus();
                    return;
                }
                if (_jsonObj.OrderCheckCodeOrderMsgList.length > 0) {
                    // 订单的核销验证 [待消费/自取]验证
                    verifyOrderCheckCode(_jsonObj.OrderCheckCodeOrderMsgList[0].ModelOrderCheckCode.OrderID, _jsonObj.OrderCheckCodeOrderMsgList[0].ModelOrderCheckCode.BuyerUserID);
                }
            }
            else {
                toastWin("未找到验证信息！");
            }
        },
        error: function (xhr, errorTxt, status) {
            console.log("异步请求错误，errorTxt=" + errorTxt + " | status=" + status);
            return;
        }
    });
}

/**
 * 订单的核销验证 [待消费/自取]验证
 * */
function verifyOrderCheckCode(pOrderID, pBuyerUserID) {


    //获取表单值
    var VerifyCodeTxt = $("#VerifyCodeTxt").val().trim();
    if (VerifyCodeTxt == "") {
        toastWin("【验证码】不能为空！");
        $("#VerifyCodeTxt").focus();
        return;
    }

    //构造POST参数
    var dataPOST = {
        "Type": "9", "OrderID": pOrderID, "BuyerUserID": pBuyerUserID, "CheckType": "ShopCheck", "CheckCode": VerifyCodeTxt,
    };
    console.log(dataPOST);

    //加载提示窗口
    loadingWin();

    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: "../Trading/OrderMan?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("核销验证 [待消费/自取]验证=" + reTxt);

            //移除加载提示
            closeLoadingWin();

            if (reTxt != "") {
                var _jsonObj = JSON.parse(reTxt);
                if (_jsonObj.ErrMsg != "" && _jsonObj.ErrMsg != null && _jsonObj.ErrMsg != undefined) {
                    toastWin(_jsonObj.ErrMsg);
                    return;
                }
                if (_jsonObj.Msg != "" && _jsonObj.Msg != null && _jsonObj.Msg != undefined) {

                    confirmWinCCb("核销验证成功,是否继续？", function () {
                        $("#VerifyCodeTxt").val("");
                        $("input[type=number]").val("");
                    }, function () {
                        //跳转到订单详情页
                        window.location.href = "../WapPage/OrderDetail?OID=" + pOrderID;
                    });
                }
            }
        },
        error: function (xhr, errorTxt, status) {
            console.log("异步请求错误，errorTxt=" + errorTxt + " | status=" + status);
            return;
        }
    });


}

/**
 * 得到店铺指定类别的 验证码信息 列表
 * */
function getShopVerifyCodeMsgList() {

    //获取表单值
    var VerifyTypeSel = $("#VerifyTypeSel").val().trim();
    var VerifyCodeTxt = $("#VerifyCodeTxt").val().trim();
    if (VerifyCodeTxt == "") {
        toastWin("【验证码】不能为空！");
        $("#VerifyCodeTxt").focus();
        return;
    }

    //构造POST参数
    var dataPOST = {
        "Type": "3", "VerifyType": VerifyTypeSel, "VerifyCode": VerifyCodeTxt,
    };
    console.log(dataPOST);

    //加载提示窗口
    //loadingWin();

    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: "../VerifyCode/VerifyCodeAll?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("得到店铺指定类别的验证码信息列表=" + reTxt);

            //移除加载提示
            //closeLoadingWin();

            if (reTxt != "") {
                var _jsonReTxt = JSON.parse(reTxt);
                if (_jsonReTxt.ListVerifyCode <= 0) {
                    return;
                }

                var _toastName = "";
                if (_jsonReTxt.ListVerifyCode > 0) {

                    if (_jsonReTxt.ListVerifyCode[0].VerifyType == "PresentOrder") {
                        _toastName = "礼品订单ID";
                        $("#PstOrderID").focus();

                        _extraData = _jsonReTxt.ListVerifyCode[0]
                    }
                    else if (_jsonReTxt.ListVerifyCode[0].VerifyType == "Coupons") {
                        _toastName = "券号";
                        $("#IssueID").focus();
                    }
                    else if (_jsonReTxt.ListVerifyCode[0].VerifyType == "ActivityJoin") {
                        _toastName = "活动ID";
                        $("#ActivityID").focus();
                    }
                    else if (_jsonReTxt.ListVerifyCode[0].VerifyType == "Luckydraw") {
                        _toastName = "中奖ID";
                        $("#LuckyDrawResultID").focus();
                    }
                }
                if (_jsonReTxt.ListVerifyCode > 1) {

                    toastWin("有相同验证码，请输入" + _toastName + "！");
                    return;
                }

                //----各种核销验证 -----//
                verifyOrderCheckCode(_jsonReTxt.ListVerifyCode[0].ExtraData, _jsonReTxt.ListVerifyCode[0].BuyerUserID);


            }
            else {
                toastWin("未找到验证信息！");
            }
        },
        error: function (xhr, errorTxt, status) {
            console.log("异步请求错误，errorTxt=" + errorTxt + " | status=" + status);
            return;
        }
    });
}



/**
 * 各种核销验证 
 * */
function verifyOrderCheckCode(pExtraData, pBuyerUserID) {

    if (pExtraData == "" || pExtraData == undefined) {
        return;
    }

    //获取表单值
    var VerifyTypeSel = $("#VerifyTypeSel").val().trim();
    var VerifyCodeTxt = $("#VerifyCodeTxt").val().trim();
    if (VerifyCodeTxt == "") {
        toastWin("【验证码】不能为空！");
        $("#VerifyCodeTxt").focus();
        return;
    }

    //构造POST参数
    var dataPOST = {
        "Type": "2", "ExtraData": pExtraData, "BuyerUserID": pBuyerUserID, "VerifyType": VerifyTypeSel, "VerifyCode": VerifyCodeTxt,
    };
    console.log(dataPOST);

    //加载提示窗口
    loadingWin();

    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: "../VerifyCode/VerifyCodeAll?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("各种核销验证 =" + reTxt);

            //移除加载提示
            closeLoadingWin();

            if (reTxt != "") {
                var _jsonObj = JSON.parse(reTxt);
                if (_jsonObj.ErrMsg != "" && _jsonObj.ErrMsg != null && _jsonObj.ErrMsg != undefined) {
                    toastWin(_jsonObj.ErrMsg);
                    return;
                }
                if (_jsonObj.Msg != "" && _jsonObj.Msg != null && _jsonObj.Msg != undefined) {

                    toastWinCb(_jsonObj.Msg, function () {

                        $("#VerifyCodeTxt").val("");
                        $("input[type=number]").val("");

                    }, 3000);
                }
            }
        },
        error: function (xhr, errorTxt, status) {
            console.log("异步请求错误，errorTxt=" + errorTxt + " | status=" + status);
            return;
        }
    });
}



