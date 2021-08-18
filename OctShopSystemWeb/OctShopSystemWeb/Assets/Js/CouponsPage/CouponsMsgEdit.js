//================优惠券编辑====================//

/**-----定义公共变量------**/

//AjaxURL
var mAjaxUrl = "../Coupons/CouponsMsgAdd";

//优惠券类型 UserMoney 抵用, DiscountVal折扣
var mCouponsType = "UseMoney";
//发放方式[ BuyGoods 购买商品时,  ShopGet 商铺中领取, BuyOrShop 购买商品或商铺中领取都可 ]
var mIssueType = "ShopGet";

//选择商品窗口
var mGoodsSelWinHtml = "";
var mOpenWinFirst = true;

//选择商品的ID拼接字符串 用 "^"隔开
var mSelGoodsIDArr = "";
//选择商品的标题拼接字符串 用 "^"隔开
var mSelGoodsTitleArr = "";


/**------初始化------**/
$(function () {

    //初始化选择商品窗口显示代码
    initGoodsSelWinHtml();

    //初始化优惠券信息
    initCouponsMsg();

});

/**
 * 初始化优惠券信息
 * */
function initCouponsMsg() {

    //优惠券ID
    var hidCouponsID = $("#hidCouponsID").val().trim();

    //构造POST参数
    var dataPOST = {
        "Type": "4", "CouponsID": hidCouponsID,
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

                //给表单赋值
                $("#CouponsTitle").val(_jsonReTxt.CouponsTitle);

                //优惠券类别                if (_jsonReTxt.UseMoney != 0 && _jsonReTxt.UseMoney != "") {                    $("#CouponsType1").attr("checked", true);
                    _jsonReTxt.UseDiscount = "";
                }                else {                    $("#CouponsType2").attr("checked", true);
                    _jsonReTxt.UseMoney = "";
                }                $("#UseMoney").val(_jsonReTxt.UseMoney);                $("#UseDiscount").val(_jsonReTxt.UseDiscount);                //切换优惠券类别                chgCouponsType();                //发放设置                $("#NumTotal").val(_jsonReTxt.NumTotal);                //发放方式                if (_jsonReTxt.IssueType == "ShopGet") {                    $("#IsSueType1").attr("checked", "checked");
                    $("#IssueOrderGoodsDiv").hide();
                    $("#IssueExpenseSum").val("");
                }                else if (_jsonReTxt.IssueType == "BuyGoods") {                    $("#IsSueType2").attr("checked", "checked");
                    $("#IssueOrderGoodsDiv").show();
                    $("#IssueExpenseSum").val(_jsonReTxt.IssueExpenseSum);
                }                else if (_jsonReTxt.IssueType == "BuyOrShop") {                    $("#IsSueType3").attr("checked", "checked");
                    $("#IssueOrderGoodsDiv").hide();
                    $("#IssueExpenseSum").val("");
                }                mIssueType = _jsonReTxt.IssueType;                if (_jsonReTxt.IsRepeatGet == "true") {                    $("#IsRepeatGet").prop("checked", true);
                }                //可使用的商品                mSelGoodsIDArr = _jsonReTxt.UseGoodsIDArr + "^";                mSelGoodsTitleArr = _jsonReTxt.UseGoodsTitleArr + "^";                var _xhtmlTitleArr = "";                var _goodsTitleArr = mSelGoodsTitleArr.split("^");                for (var i = 0; i < _goodsTitleArr.length; i++) {                    _xhtmlTitleArr += "<a href=\"#\" target=\"_blank\">" + _goodsTitleArr[i] + "</a>，"
                }                $("#UseGoodsListDiv").html(_xhtmlTitleArr);                //可使用的条件                if (_jsonReTxt.UseTimeRange != "") {                    var _useTimeRangeArr = _jsonReTxt.UseTimeRange.split("^");

                    //设置amaze日期选择控件值,必须这样否则无效
                    $('#UseTimeRangeStart').datepicker('setValue', _useTimeRangeArr[0]);
                    $('#UseTimeRangeEnd').datepicker('setValue', _useTimeRangeArr[1]);
                }                if (_jsonReTxt.ExpenseReachSum != 0) {                    $("#ExpenseReachSum").val(_jsonReTxt.ExpenseReachSum);
                }                $("#CouponsDesc").val(_jsonReTxt.CouponsDesc);                //----如果有发放信息则不能修改关键信息                if (_jsonReTxt.ExistIssueMsg == "true") {                    $("#CouponsType1").attr("disabled", true);
                    $("#CouponsType2").attr("disabled", true);
                    $("#UseMoney").attr("disabled", true);
                    $("#UseDiscount").attr("disabled", true);
                    //$("#NumTotal").attr("disabled", true);
                    //$("#IsSueType1").attr("disabled", true);
                    //$("#IsSueType2").attr("disabled", true);
                    //$("#IsSueType3").attr("disabled", true);
                    //$("#IssueExpenseSum").attr("disabled", true); 
                    $("#BtnUseGoods").attr("disabled", true);
                    $("#UseTimeRangeStart").attr("disabled", true);
                    $("#UseTimeRangeEnd").attr("disabled", true);
                    $("#ExpenseReachSum").attr("disabled", true);
                    $("#LongEffectiveCb").attr("disabled", true);
                }                //-----是否请允许线下验证使用-----//                $("#IsOfflineUseCb").prop("checked", true);                if (_jsonReTxt.IsOfflineUse == "false") {                    $("#IsOfflineUseCb").prop("checked", false);
                }            }
        }
    });
}

/**
 * 切换优惠券类别
 * */
function chgCouponsType() {

    var _couponsTypeArr = $("input[name='CouponsType']");
    console.log("_couponsType=" + _couponsTypeArr[0].checked);
    if (_couponsTypeArr[0].checked == true) {
        $("#ToUseMoneyDiv").show();
        $("#ToDiscountDiv").hide();
        mCouponsType = "UseMoney";
    }
    else {
        $("#ToDiscountDiv").show();
        $("#ToUseMoneyDiv").hide();
        mCouponsType = "DiscountVal";
    }
}

/**
 * 切换发放方式
 * */
function chgIssueType() {
    var _IssueTypeArr = $("input[name='IsSueType']");

    if (_IssueTypeArr[1].checked) {
        $("#IssueOrderGoodsDiv").show();
    }
    else {
        $("#IssueOrderGoodsDiv").hide();
    }

    if (_IssueTypeArr[0].checked) {
        mIssueType = "ShopGet";
    }
    else if (_IssueTypeArr[1].checked) {
        mIssueType = "BuyGoods";
    }
    else {
        mIssueType = "BuyOrShop";
    }
}

/**
 * 初始化选择商品窗口显示代码
 */
function initGoodsSelWinHtml() {
    //获取窗口显示代码
    mGoodsSelWinHtml = $("#GoodsSelWin").html();
    $("#GoodsSelWin").empty();
}

/**
 * 打开选择商品窗口
 */
function openGoodsSelWin() {

    mOpenWinFirst = true;

    intPageCurrent = 1;

    //初始化商家商品信息
    sendPageHttpGet("1");

}

/**
 * 提交优惠券信息
 * */
function submitCouponsMsg() {

    //去掉前后的 "^"
    mSelGoodsIDArr = removeFrontAndBackChar(mSelGoodsIDArr, "^");
    mSelGoodsTitleArr = removeFrontAndBackChar(mSelGoodsTitleArr, "^");

    //优惠券ID
    var hidCouponsID = $("#hidCouponsID").val().trim();
    if (hidCouponsID == "" || hidCouponsID == undefined) {
        return;
    }

    //获取表单值
    var CouponsTitle = $("#CouponsTitle").val().trim();
    var UseMoney = $("#UseMoney").val().trim();
    var UseDiscount = $("#UseDiscount").val().trim();
    var NumTotal = $("#NumTotal").val().trim();
    var IssueExpenseSum = $("#IssueExpenseSum").val().trim();
    var UseTimeRangeStart = $("#UseTimeRangeStart").val().trim();
    var UseTimeRangeEnd = $("#UseTimeRangeEnd").val().trim();
    var ExpenseReachSum = $("#ExpenseReachSum").val().trim();
    var CouponsDesc = $("#CouponsDesc").val().trim();
    var IsRepeatGet = $("#IsRepeatGet").is(":checked");

    if (CouponsTitle == "") {
        toastWin("【优惠券标题】不能为空！");
        return;
    }

    //抵用属性设置
    if (mCouponsType == "UseMoney") {
        UseDiscount = "0";
        if (UseMoney == "") {
            toastWin("【抵用金额】不能为空，且必须是数字！");
            return;
        }
        if (isNaN(UseMoney)) {
            toastWin("【抵用金额】必须是数字！");
            return;
        }
    }
    if (mCouponsType == "DiscountVal") {
        UseMoney = "0";
        if (UseDiscount == "") {
            toastWin("【折扣值】不能为空，且必须是数字！");
            return;
        }
        if (isNaN(UseDiscount)) {
            toastWin("【折扣值】必须是数字！");
            return;
        }
        if (parseFloat(UseDiscount) > 10 || parseFloat(UseDiscount) < 0) {
            toastWin("【折扣值】必须是0到10之间的数！");
            return;
        }
    }

    if (NumTotal == "") {
        toastWin("【优惠券总数】不能为空，且必须是数字！");
        return;
    }
    if (isNaN(NumTotal)) {
        toastWin("【优惠券总数】必须为数字！");
        return;
    }

    //发放方式
    if (mIssueType == "BuyGoods") {
        if (IssueExpenseSum == "") {
            toastWin("【消费满多少时自动发放】不能为空，且必须是数字！")
            return;
        }
        if (isNaN(IssueExpenseSum)) {
            toastWin("【消费满多少时自动发放】必须为数字！")
            return;
        }
    }
    else {
        IssueExpenseSum = "0";
    }

    //可使用的条件
    var UseTimeRange = "";
    if (UseTimeRangeStart != "" && UseTimeRangeEnd != "") {
        UseTimeRange = UseTimeRangeStart + "^" + UseTimeRangeEnd;
    }
    //勾选了永久有效
    var LongEffectiveCb = $("#LongEffectiveCb").is(":checked");
    if (LongEffectiveCb) {
        UseTimeRange = "";
    }

    //勾选是否可以线下验证使用
    var IsOfflineUseCb = $("#IsOfflineUseCb").is(":checked");


    if (ExpenseReachSum != "") {
        if (isNaN(ExpenseReachSum)) {
            toastWin("【消费满多少可用】必须为数字！");
            return;
        }
    }

    //构造POST参数
    var dataPOST = {
        "Type": "2", "CouponsID": hidCouponsID, "CouponsTitle": CouponsTitle, "UseMoney": UseMoney, "IsRepeatGet": IsRepeatGet,
        "UseDiscount": UseDiscount, "NumTotal": NumTotal, "IssueType": mIssueType,
        "IssueExpenseSum": IssueExpenseSum, "UseTimeRange": UseTimeRange, "ExpenseReachSum": ExpenseReachSum, "CouponsDesc": CouponsDesc, "SelGoodsIDArr": mSelGoodsIDArr, "IsOfflineUse": IsOfflineUseCb,
    };
    //显示加载提示
    $("#SubmitBtn").attr("disabled", true);
    $("#SubmitBtn").val("…保存中…");

    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: mAjaxUrl + "?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log(reTxt);
            //移除加载提示
            $("#SubmitBtn").attr("disabled", false);
            $("#SubmitBtn").val("保存优惠券信息");
            if (reTxt != "") {
                var _jsonReTxt = JSON.parse(reTxt);
                //有错误提示
                if (_jsonReTxt.ErrMsg != null && jsonReTxt.ErrMsg != "") {
                    toastWin(_jsonReTxt.ErrMsg);
                    return;
                }

                //跳转到优惠券管理
                window.location.href = "../CouponsPage/CouponsMsg";

            }
        },
        error: function (xhr, errorTxt, status) {
            console.log("异步请求错误，errorTxt=" + errorTxt + " | status=" + status);
            return;
        }
    });




}



//--------------选择商品弹出窗口，数据分页-----------------//

/******数据分页的变量********/
var strPOSTSe = ""; //搜索条件对象 POST参数
var intPageCurrent = 1; //当前页
var mPageSize = 10; //当页的记录条数，与后台保持一致
var recordSum = 0; //总记录数

//具体页
function NumberPage(pagecurrent) {
    intPageCurrent = parseInt(pagecurrent);

    //以GET方式发送分页请求的函数
    sendPageHttpGet(intPageCurrent);
}

//上一页
function PrePage() {
    intPageCurrent = intPageCurrent - 1;

    if (intPageCurrent > 0) {

        //以GET方式发送分页请求的函数
        sendPageHttpGet(intPageCurrent);

    }
    else {
        intPageCurrent = 1;
    }
}


//下一页
function NextPage() {

    intPageCurrent = parseInt(intPageCurrent) + 1;

    pageSize = mPageSize;

    //计算总页数
    var intPageSum = recordSum % pageSize != 0 ? recordSum / pageSize + 1 : recordSum / pageSize;
    console.log("intPageSum=" + intPageSum);

    if (intPageCurrent <= parseInt(intPageSum)) {

        //以GET方式发送分页请求的函数
        sendPageHttpGet(intPageCurrent);

    }
    else {
        intPageCurrent = parseInt(intPageSum);
    }

}

//----------------以GET方式发送分页请求的函数-----------------//
var sendPageHttpGet = function (intPageCurrent) {

    strPOSTSe = { "Type": "1" };

    //构造GET参数
    strPOSTSe = pushTwoObject(strPOSTSe, { "pageCurrent": intPageCurrent });

    //加载提示
    $("#GoodsSelUL").html("<li>… 加载中 …</li>");

    $.ajax({
        type: "GET",
        url: mAjaxUrl + "?rnd=" + Math.random(),
        data: strPOSTSe,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log(reTxt);
            //成功返回后的处理函数
            pageSuccess(reTxt)
        },
        error: function (xhr, errorTxt, status) {
            console.log("异步请求错误，errorTxt=" + errorTxt + " | status=" + status);
            //alert("网络出现异常,请重试！");
            return;
        }
    });
}


//------------分页信息成功返回------------//
// @ reTxtJson 返回的Json字符串
function pageSuccess(reTxtJson) {
    if (reTxtJson != "") {

        var reJsonObject = JSON.parse(reTxtJson);
        //console.log(reJsonObject);

        //总的记录数
        recordSum = reJsonObject.RecordSum;
        pageSize = reJsonObject.PageSize;


        //解析JSON数据 构造 前台显示代码
        var _xhtmlArr = jsonToXhtml(reJsonObject);

        if (mOpenWinFirst == true) {
            //构造窗口显示HTML代码
            var myJsVal = "";            myJsVal += "<div class=\"goods-sel-main\">";            myJsVal += "            <ul class=\"goods-sel-ul\" id=\"GoodsSelUL\">";            myJsVal += _xhtmlArr[0];            myJsVal += "            </ul>";            myJsVal += "            <div class=\"page-bar\" id=\"PageBar1\">";            myJsVal += _xhtmlArr[1];            myJsVal += "            </div>";            myJsVal += "</div>";            //打开Dialog弹出窗口
            openDialogWinNoClose("选择商品", myJsVal, function () {

                //构造选择商品标题列表并插入前台
                xhtmlSelGoodsTitle();

                //关闭窗口
                closeDialogWin();

            }, function () {


            }, 600);
        }
        else {
            //显示内容
            $("#GoodsSelUL").html(_xhtmlArr[0]);
            //分页控制条
            $("#PageBar1").html(_xhtmlArr[1]);
        }
        mOpenWinFirst = false;
        //全不选
        //document.getElementById("SelAllCb").checked = false;

    }
    else {
        $("#GoodsSelUL").html("<li></li>");
    }
}

//------------解析JSON数据 构造 前台显示代码--------------//
// pJsonTxt Json字符串
function jsonToXhtml(pJsonObject) {

    //将字符串转换成功JSON对象
    //var json = JSON.parse(pJsonTxt);
    var json = pJsonObject;

    console.log("mSelGoodsIDArr=" + mSelGoodsIDArr);

    //-----内容显示前台显示代码----//
    var myJsVal = "";    //循环构造    for (var i = 0; i < json.DataPage.length; i++) {

        var indexDataPage = json.DataPage[i];
        var indexDataPageExtra = json.DataPageExtra[i];

        //判断是否选中商品 
        var _srcSelPath = "sel_no.png";
        var _selGoodsIDArr = mSelGoodsIDArr.split("^");
        for (var j = 0; j < _selGoodsIDArr.length; j++) {
            if (_selGoodsIDArr[j] == indexDataPage.GoodsID) {
                _srcSelPath = "sel_yes.png";
                break;
            }
        }

        myJsVal += "<li>";        myJsVal += "   <div class=\"goods-item-1\">";        myJsVal += "       <img src=\"//" + indexDataPageExtra.ImgPath + "\" />";        myJsVal += "   </div>";        myJsVal += "   <div class=\"goods-item-2\">";        myJsVal += "       " + indexDataPage.GoodsTitle + "";        myJsVal += "   </div>";        myJsVal += "   <div class=\"goods-item-3\">";        myJsVal += "       <img name=\"GoodsSelName\" src=\"../Assets/Imgs/Icon/" + _srcSelPath + "\" data-goodsid=\"" + indexDataPage.GoodsID + "\" data-goodstitle=\"" + indexDataPage.GoodsTitle + "\" onclick=\"toggleGoodsSel()\" />";        myJsVal += "   </div>";        myJsVal += "</li>";    }    //alert(myJsVal);    //-----分页控制条显示代码-------//    var pageBarXhtml = "";    pageBarXhtml += "<div onclick=\"NumberPage('1')\">首页</div>";    pageBarXhtml += "<div onclick=\"PrePage()\">上一页</div>";    pageBarXhtml += "<div onclick=\"NextPage()\">下一页</div>";    pageBarXhtml += "<div onclick=\"NumberPage('" + json.PageSum + "')\">尾页</div>";    var _pageMsgArr = new Array()    //内容显示代码     _pageMsgArr[0] = myJsVal;    //控制条件显示代码    _pageMsgArr[1] = pageBarXhtml;    //返回数组    return _pageMsgArr;
}

/**
 * 开关，选择商品
 */
function toggleGoodsSel() {
    var _curTarget = $(event.currentTarget);
    var _src = _curTarget.attr("src");
    console.log(_src);

    //构造选择的商品标题拼接字符串
    var dataGoodsTitle = _curTarget.attr("data-goodstitle").trim();
    //构造选择的商品ID拼接字符串
    var dataGoodsID = _curTarget.attr("data-goodsid").trim();

    if (_src.indexOf("sel_no") >= 0) {
        //选中状态
        _curTarget.attr("src", "../Assets/Imgs/Icon/sel_yes.png");

        //选择的商品标题拼接字符串
        if (mSelGoodsTitleArr.indexOf(dataGoodsTitle + "^") < 0 && mSelGoodsTitleArr.indexOf("^" + dataGoodsTitle + "^") < 0 && mSelGoodsTitleArr.indexOf("^" + dataGoodsTitle) < 0 && mSelGoodsTitleArr.indexOf(dataGoodsTitle) != 0) {
            mSelGoodsTitleArr += dataGoodsTitle + "^";
        }
        console.log("mSelGoodsTitleArr=" + mSelGoodsTitleArr);

        //选择的商品ID拼接字符串
        if (mSelGoodsIDArr.indexOf(dataGoodsID + "^") < 0 && mSelGoodsIDArr.indexOf("^" + dataGoodsID + "^") < 0 && mSelGoodsIDArr.indexOf("^" + dataGoodsID) < 0 && mSelGoodsIDArr.indexOf(dataGoodsID) != 0) {
            mSelGoodsIDArr += dataGoodsID + "^";
        }
        console.log("mSelGoodsIDArr=" + mSelGoodsIDArr);

    }
    else {
        //未选状态
        _curTarget.attr("src", "../Assets/Imgs/Icon/sel_no.png");

        //选择的商品标题拼接字符串
        mSelGoodsTitleArr = mSelGoodsTitleArr.replace(dataGoodsTitle + "^", "");
        if (mSelGoodsTitleArr.indexOf(dataGoodsTitle) == 0) {
            mSelGoodsTitleArr = "";
        }

        //选择的商品ID拼接字符串
        mSelGoodsIDArr = mSelGoodsIDArr.replace(dataGoodsID + "^", "");
        if (mSelGoodsIDArr.indexOf(dataGoodsID) == 0) {
            mSelGoodsIDArr = "";
        }
    }
}

/**
 * 构造选择商品标题列表并插入前台
 * */
function xhtmlSelGoodsTitle() {

    //将标题拼接字符串插入前台
    var _xhtmlTitle = "";
    _selGoodsTitleArr = mSelGoodsTitleArr.split("^");
    for (var i = 0; i < _selGoodsTitleArr.length; i++) {
        _xhtmlTitle += "<a href=\"#\" target=\"_blank\">" + _selGoodsTitleArr[i] + "</a> &nbsp;&nbsp; &nbsp;&nbsp; ";
    }
    console.log(_xhtmlTitle);
    $("#UseGoodsListDiv").html(_xhtmlTitle);

}

