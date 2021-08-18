//=============线下使用验证===============//

/**-----定义公共变量------**/

//AjaxURL
var mAjaxUrl = "../Coupons/CouponsUseVerify";

/**------初始化------**/
$(function () {

    //初始化详细窗口显示代码
    initDetailWinHtml();

});

/**
 * 查询验证优惠券信息列表
 * */
function searchCheckCouponsUseVerify() {

    //获取表单值
    var IssueIDTxt = $("#IssueIDTxt").val().trim();
    var CheckCodeTxt = $("#CheckCodeTxt").val().trim();
    if (CheckCodeTxt == "") {
        toastWin("【验证码】不能为空！");
        $("#CheckCodeTxt").focus();
        return;
    }

    //构造POST参数
    var dataPOST = {
        "Type": "1", "IssueID": IssueIDTxt, "VerifyCode": CheckCodeTxt,
    };
    console.log(dataPOST);

    //加载提示窗口
    loadingWin();

    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: mAjaxUrl + "?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("查询验证优惠券信息列表=" + reTxt);

            //移除加载提示
            closeLoadingWin();

            if (reTxt != "") {
                var _jsonObj = JSON.parse(reTxt);

                if (_jsonObj.VerifyCodeList.length <= 0) {
                    $("#CheckOrderList").html("没有查询到相关数据");
                    return;
                }

                //构造验证优惠券列表 显示代码
                var _xhtmlCouponsUseVerifyList = xhtmlCouponsUseVerifyList(_jsonObj.VerifyCodeList);
                $("#CheckOrderList").html(_xhtmlCouponsUseVerifyList);

            }
            else {
                $("#CheckOrderList").html("没有查询到相关数据");
            }
        },
        error: function (xhr, errorTxt, status) {
            console.log("异步请求错误，errorTxt=" + errorTxt + " | status=" + status);
            return;
        }
    });
}

/**
 * 构造验证优惠券列表 显示代码
 * @param {any} pVerifyCodeListJson
 */
function xhtmlCouponsUseVerifyList(pVerifyCodeListJson) {

    var myJsVal = "";    for (var i = 0; i < pVerifyCodeListJson.length; i++) {        myJsVal += "<div class=\"check-order-item\">";        myJsVal += "<ul>";        myJsVal += "    <li class=\"order-item-title\">";        myJsVal += "        <span>";        myJsVal += "            券号：<b>" + pVerifyCodeListJson[i].IssueID + "</b>";        if (parseFloat(pVerifyCodeListJson[i].UseDiscount) <= 0) {            myJsVal += "抵用：<b>&#165;" + formatNumberDotDigit(pVerifyCodeListJson[i].UseMoney) + "</b>";
        }        else {            myJsVal += "抵用：<b>" + pVerifyCodeListJson[i].UseDiscount +" 折</b>";
        }        if (pVerifyCodeListJson[i].IsMallCoupons == "false") {            myJsVal += "类型：<b>店铺券</b>";
        }        else {            myJsVal += "类型：<b>商城券</b>";
        }        myJsVal += "        </span>";        myJsVal += "        <a href=\"javascript:void(0)\" onclick=\"openDetailWin('" + pVerifyCodeListJson[i].CouponsID +"')\" class=\"am-btn\">优惠券详情</a>";        myJsVal += "    </li>";        myJsVal += "    <li class=\"order-item-goods\">";        myJsVal += "        <a href=\"javascript:void(0)\" onclick=\"openDetailWin('" + pVerifyCodeListJson[i].CouponsID +"')\">" + pVerifyCodeListJson[i].CouponsTitle +"</a>";        myJsVal += "    </li>";        myJsVal += "    <li class=\"order-user-msg\">";        myJsVal += "        <span>";        myJsVal += "            用户昵称：<b>" + pVerifyCodeListJson[i].UserNick +"</b>";        myJsVal += "            手机号：<b>" + pVerifyCodeListJson[i].BindMobile +"</b>";        myJsVal += "        </span>";        myJsVal += "        <span>";        myJsVal += "            <input type=\"button\" class=\"btn-common am-btn am-radius am-btn-success\" value=\"使用验证\" onclick=\"verifyCouponsCheckCode('" + pVerifyCodeListJson[i].IssueID + "','" + pVerifyCodeListJson[i].BuyerUserID +"')\" />";        myJsVal += "        </span>";        myJsVal += "    </li>";        myJsVal += "</ul>";        myJsVal += "</div>";    }
    return myJsVal;
}


/**
 * 优惠券使用验证  进行验证
 * */
function verifyCouponsCheckCode(pIssueID, pBuyerUserID) {

    if (pIssueID == "" || pBuyerUserID == "") {
        return;
    }

    confirmWinWidth("确定要验证使用吗？", function () {

        //获取表单值
        var CheckCodeTxt = $("#CheckCodeTxt").val().trim();
        if (CheckCodeTxt == "") {
            toastWin("【验证码】不能为空！");
            $("#CheckCodeTxt").focus();
            return;
        }

        //构造POST参数
        var dataPOST = {
            "Type": "2", "ExtraData": pIssueID, "BuyerUserID": pBuyerUserID, "VerifyType": "Coupons", "VerifyCode": CheckCodeTxt,
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
                console.log("优惠券使用验证=" + reTxt);

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

                            //重新加载数据
                            searchCheckCouponsUseVerify();

                            //跳转到订单详情页
                            //window.location.href = "../ActivityPage/ActivityDetail?AID=" + pActivityID;

                        });

                    }
                }
            },
            error: function (xhr, errorTxt, status) {
                console.log("异步请求错误，errorTxt=" + errorTxt + " | status=" + status);
                return;
            }
        });

    }, 400);
}



//==================弹出窗口==================//

/**
 * 初始化详细窗口显示代码
 * */
function initDetailWinHtml() {
    //获取窗口显示代码
    mDetailWinHtml = $("#DetailWin").html();
    $("#DetailWin").empty();
}


/**
 * 打开详情窗口
 * @param {any} pCouponsID 优惠券ID
 */
function openDetailWin(pCouponsID) {

    //打开Dialog弹出窗口
    openCustomDialogWin("优惠券详情", mDetailWinHtml, 600);

    //初始化优惠券详情窗口信息
    initDetailWinMsg(pCouponsID);

}

/**
 * 初始化优惠券详情窗口信息
 * @param {any} pCouponsID 优惠券ID
 */
function initDetailWinMsg(pCouponsID) {

    //构造POST参数
    var dataPOST = {
        "Type": "4", "CouponsID": pCouponsID,
    };
    console.log(dataPOST);

    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: "../Coupons/CouponsMsg?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log(reTxt);
            if (reTxt != "") {
                var _jsonReTxt = JSON.parse(reTxt);

                //构造显示代码
                var myJsVal = "";                myJsVal += "<li>";                myJsVal += "<span>优惠券ID：</span>" + _jsonReTxt.CouponsID + "";                if (_jsonReTxt.IsMallCoupons == "true") {                    myJsVal += "<span class=\"span-padding-left\">类型：</span>商城券";
                }                else {                    myJsVal += "<span class=\"span-padding-left\">类型：</span>店铺券";
                }                                myJsVal += "</li>";                myJsVal += "<li>";                myJsVal += "<span>标题：</span>" + _jsonReTxt.CouponsTitle + "";                myJsVal += "</li>";                myJsVal += "<li>";                myJsVal += "<span>类别：</span>";                if (_jsonReTxt.UseMoney != "" && _jsonReTxt.UseMoney != "0") {                    myJsVal += "抵用券";
                    myJsVal += "<span class=\"span-padding-left\">抵用金额：</span>" + _jsonReTxt.UseMoney + "元";
                }                else {                    myJsVal += "折扣券";
                    myJsVal += "<span class=\"span-padding-left\">使用折扣：</span>" + _jsonReTxt.UseDiscount + "折";
                }                myJsVal += "<span class=\"span-padding-left\">线下验证使用：</span>";                if (_jsonReTxt.IsOfflineUse == "true") {                    myJsVal += "允许";
                }                else {                    myJsVal += "不允许";
                }                myJsVal += "</li>";                myJsVal += "<li>";                myJsVal += "<span>优惠券总数：</span>" + _jsonReTxt.NumTotal + "";                myJsVal += "<span class=\"span-padding-left\">可多次领取：</span>";                if (_jsonReTxt.IsRepeatGet == "true") {                    myJsVal += "是";
                }                else {                    myJsVal += "否";
                }                myJsVal += "<span class=\"span-padding-left\">发放方式：</span>";                if (_jsonReTxt.IssueType == "BuyGoods") {                    myJsVal += "购买商品自动发放"
                    myJsVal += "<div>";                    myJsVal += "   <span>消费满多少时自动发放：</span>" + _jsonReTxt.IssueExpenseSum + "元";                    myJsVal += "</div>";
                }                else if (_jsonReTxt.IssueType == "ShopGet") {                    myJsVal += "店铺中领取";
                }                else if (_jsonReTxt.IssueType == "BuyOrShop") {                    myJsVal += "两者均可";
                }                myJsVal += "</li>";                myJsVal += "<li>";                myJsVal += "<span>可使用的商品ID：</span>";                console.log("_jsonReTxt.UseGoodsTitleArr=" + _jsonReTxt.UseGoodsTitleArr);                if (_jsonReTxt.UseGoodsTitleArr.indexOf("^") >= 0) {                    var _goodsTitleArr = _jsonReTxt.UseGoodsTitleArr.split("^");                    for (var i = 0; i < _goodsTitleArr.length; i++) {                        myJsVal += "<a href=\"#\">" + _goodsTitleArr[i] + "</a> ，";
                    }
                }                else {                    if (_jsonReTxt.UseGoodsTitleArr.trim() != "") {                        myJsVal += "<a href=\"#\">" + _jsonReTxt.UseGoodsTitleArr + "</a> ，";
                    }                }                myJsVal += "</li>";                myJsVal += "<li>";                myJsVal += "<span>使用日期范围：</span>";                if (_jsonReTxt.UseTimeRange.indexOf("^") >= 0) {                    var _useTimeRangeArr = _jsonReTxt.UseTimeRange.split("^");                    myJsVal += " " + _useTimeRangeArr[0] + " 至 " + _useTimeRangeArr[1] + "";
                }                else {                    myJsVal += "永久有效";
                }                myJsVal += "<span class=\"span-padding-left\">消费满多少可用：</span>" + _jsonReTxt.ExpenseReachSum + "元";                myJsVal += "</li>";                myJsVal += "<li>";                myJsVal += "<span>使用说明与描述：</span>";                myJsVal += "" + _jsonReTxt.CouponsDesc + "";                myJsVal += "</li>";                $("#DetailUl").html(myJsVal);                //窗口剧中显示                alignCustomCenterWin();            }
        }
    });


}


