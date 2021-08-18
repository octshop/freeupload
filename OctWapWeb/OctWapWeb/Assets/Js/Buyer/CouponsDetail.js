//================优惠券详情=========================//

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
                    var myJsValNoLogin = "<li>";                    myJsValNoLogin += " <div class=\"coupons-item-left\">";                    myJsValNoLogin += "     <div class=\"coupons-price\">";                    if (parseFloat(CouponsMsg.UseMoney) > 0) {                        myJsValNoLogin += " &#165; <b>" + CouponsMsg.UseMoney + "</b>";
                    }                    else {                        myJsValNoLogin += " <b>" + CouponsMsg.UseDiscount + "</b> 折";
                    }                    myJsValNoLogin += "         <br />";                    myJsValNoLogin += "         满" + CouponsMsg.ExpenseReachSum + "元可用";                    myJsValNoLogin += "     </div>";                    myJsValNoLogin += " </div>";                    myJsValNoLogin += " <div class=\"coupons-item-right\">";                    myJsValNoLogin += "     <div class=\"coupons-item-top\">";                    myJsValNoLogin += CouponsMsg.CouponsTitle;                    if (CouponsMsg.IsMallCoupons == "false") {                        myJsValNoLogin += "<span>店铺券</span>";
                    }                    else {                        myJsValNoLogin += "<span>商城券</span>";
                    }                    myJsValNoLogin += "     </div>";                    myJsValNoLogin += "     <div class=\"coupons-item-mid\">";                    if (DataExtra.CouponsOverTime != "" && DataExtra.CouponsOverTime != null) {                        myJsValNoLogin += "有效期：" + DataExtra.CouponsOverTime + " ";
                        if (DataExtra.IsOverDateCoupons == "False") {
                            myJsValNoLogin += "<span>" + _WriteDateDay + "天</span>";
                        }
                        else {
                            myJsValNoLogin += "<span>已过期</span>";
                        }

                    }                    else {                        myJsValNoLogin += "有效期：永久有效 ";
                    }                    myJsValNoLogin += "     </div>";                    myJsValNoLogin += "     <div class=\"coupons-item-bottom\">";                    myJsValNoLogin += "         <div>";                    myJsValNoLogin += "             优惠券ID：" + CouponsMsg.CouponsID + "";                    if (CouponsMsg.IsOfflineUse == "true") {                        myJsValNoLogin += "(可线下使用)";
                    }                    myJsValNoLogin += "         </div>";                    if (DataExtra.IsOverDateCoupons == "False") {                        myJsValNoLogin += "         <input class=\"btn-use\" id=\"Btn_GetCoupons\" type=\"button\" onclick=\"buyerGetCoupons('" + CouponsMsg.CouponsID + "')\" value=\"立即领取\" />";
                    }                    myJsValNoLogin += "     </div>";                    myJsValNoLogin += " </div>";                    myJsValNoLogin += "</li>";                    $("#CouponsListUl").html(myJsValNoLogin);                    $("#CheckCodeDiv").hide();                    //已过期的样式
                    if (DataExtra.IsOverDateCoupons == "True") {
                        $(".coupons-item-left").css("background", "gray");
                        $(".coupons-item-top span").css("background", "gray");
                    }                    return;                }

                //-----------------------登录状态,有发放信息的界面----------------//

                //判断是否已使用
                var _classUsed = "";
                if (CouponsIssueMsg.IsUsed == "true") {
                    _classUsed = "coupons-used";
                }
                var myJsVal = "<li class=\"" + _classUsed + "\" onclick=\"window.location.href = \'../Buyer/CouponsDetail?CID=" + CouponsIssueMsg.CouponsID + "&IID=" + CouponsIssueMsg.IssueID + "\'\">";                myJsVal += " <div class=\"coupons-item-left\">";                myJsVal += "     <div class=\"coupons-price\">";                if (parseFloat(CouponsMsg.UseMoney) > 0) {                    myJsVal += " &#165; <b>" + CouponsMsg.UseMoney + "</b>";
                }                else {                    myJsVal += " <b>" + CouponsMsg.UseDiscount + "</b> 折";
                }                myJsVal += "         <br />";                myJsVal += "         满" + CouponsMsg.ExpenseReachSum + "元可用";                myJsVal += "     </div>";                myJsVal += " </div>";                myJsVal += " <div class=\"coupons-item-right\">";                myJsVal += "     <div class=\"coupons-item-top\">";                myJsVal += CouponsMsg.CouponsTitle;                if (CouponsMsg.IsMallCoupons == "false") {                    myJsVal += "<span>店铺券</span>";
                }                else {                    myJsVal += "<span>商城券</span>";
                }                myJsVal += "     </div>";                myJsVal += "     <div class=\"coupons-item-mid\">";                if (DataExtra.CouponsOverTime != "" && DataExtra.CouponsOverTime != null) {                    myJsVal += "有效期：" + DataExtra.CouponsOverTime + " ";

                    if (CouponsIssueMsg.IsUsed == "false") {

                        if (CouponsIssueMsg.IsOverTime == "false") {
                            myJsVal += "<span>" + _WriteDateDay + "天</span>";
                        }
                        else {
                            myJsVal += "<span>已过期</span>";
                        }
                    }
                }                else {                    myJsVal += "有效期：永久有效 ";
                }                if (CouponsIssueMsg.IsUsed == "true" && DataExtra.OrderUseMoney != "") {                    myJsVal += "<span>已省：" + DataExtra.OrderUseMoney + "元</span>";                }                myJsVal += "     </div>";                myJsVal += "     <div class=\"coupons-item-bottom\">";                myJsVal += "         <div>";                myJsVal += "             优惠券ID：" + CouponsMsg.CouponsID + "";                myJsVal += "         </div>";                if (CouponsIssueMsg.IsUsed == "true") {                    if (DataExtra.IsOfflineUseCoupons == "True") {                        myJsVal += "线下验证使用";
                    }                    else {                        myJsVal += "使用订单ID：" + DataExtra.UseOrderID + "";
                    }
                }                else {                    //myJsVal += "<input class=\"btn-use\" type=\"button\" value=\"立即使用\" />";
                }                myJsVal += "     </div>";                myJsVal += " </div>";                myJsVal += "</li>";

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

    var myJsVal = "";    for (var i = 0; i < _jsonReTxt.length; i++) {        myJsVal += "<li onclick=\"window.location.href='../Goods/GoodsDetail?GID=" + _jsonReTxt[i].GoodsID + "'\">";        myJsVal += " <div class=\"use-item-left\">";        myJsVal += "     <a href=\"#\">";        myJsVal += "         <img src=\"//" + _jsonReTxt[i].GoodsCoverImgPath + "\" />";        myJsVal += "     </a>";        myJsVal += " </div>";        myJsVal += " <div class=\"use-item-right\">";        myJsVal += "     <div class=\"use-item-top\">";        myJsVal += "" + _jsonReTxt[i].GoodsTitle + "";        myJsVal += "     </div>";        myJsVal += "     <div class=\"use-item-mid\">";        myJsVal += "" + _jsonReTxt[i].SpecPropName + "";        myJsVal += "     </div>";        myJsVal += "     <div class=\"use-item-bottom\">";        myJsVal += "         <b>&#165;" + formatNumberDotDigit(_jsonReTxt[i].GoodsPrice) + "</b>";        myJsVal += "         <input type=\"button\" class=\"btn-use\" value=\"立即使用\" />";        myJsVal += "     </div>";        myJsVal += " </div>";        myJsVal += "</li>";
    }    $("#UserListUL").html(myJsVal);
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

    var myJsVal = "";    for (var i = 0; i < pJsonReTxt.length; i++) {        if (pJsonReTxt[i].MajorGoods.length > 40) {            pJsonReTxt[i].MajorGoods = pJsonReTxt[i].MajorGoods.substring(0, 40) + "…";
        }        myJsVal += "<li class=\"use-shop-item\" onclick=\"window.location.href='../Shop/Index?SID=" + pJsonReTxt[i].ShopID + "'\">";        myJsVal += " <div class=\"use-item-left\">";        myJsVal += "     <a href=\"#\">";        myJsVal += "         <img src=\"//" + pJsonReTxt[i].ShopHeaderImg + "\" />";        myJsVal += "     </a>";        myJsVal += " </div>";        myJsVal += " <div class=\"use-item-right\">";        myJsVal += "     <div class=\"use-item-top\">";        myJsVal += "" + pJsonReTxt[i].ShopName + "";        myJsVal += "     </div>";        myJsVal += "     <div class=\"use-item-mid\">";        myJsVal += "" + pJsonReTxt[i].MajorGoods + "";        myJsVal += "     </div>";        myJsVal += "     <div class=\"use-item-bottom\">";        myJsVal += "         <b>" + pJsonReTxt[i].CountFavShop + "人关注,评分：" + pJsonReTxt[i].ShopAvgAppraiseScore + "</b>";        myJsVal += "         <input type=\"button\" class=\"btn-use\" value=\"立即使用\" />";        myJsVal += "     </div>";        myJsVal += " </div>";        myJsVal += "</li>";
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