//================店铺首页栏目=========================//
/**-----定义公共变量------**/

//AjaxURL
var mAjaxUrl = "../Shop/ShopHomeSection";

// 加载不同类型的数据 Discount,Group,Commend,Present,SecKill
var mSectionName = "";
//手机web端域名
var mOctWapWeb_AddrDomain = "";

//店铺ID
var mShopID = "";

//添加窗口的Html显示代码
var mAddEditWinHtml = "";

//修改排序窗口的Html显示代码
var mEditSortWinHtml = "";


/**------初始化------**/
$(function () {

    mOctWapWeb_AddrDomain = $("#hidOctWapWeb_AddrDomain").val().trim();

    //初始化添加窗口显示代码
    initAddEditWinHtml();

    //初始化修改排序窗口显示代码
    initEditSortWinHtml();

    //初始化店铺首页 各种栏目展示信息
    initShopShowMsg();

});




//===================弹出窗口操作逻辑============================//

/**
 * 初始化添加窗口显示代码
 */
function initAddEditWinHtml() {
    //获取窗口显示代码
    mAddEditWinHtml = $("#AddEditWin").html();
    $("#AddEditWin").empty();
}

/**
 * 打开添加窗口
 * @param  pSectionName 加载不同类型的数据 Discount,Group,Commend,Present
 */
function openAddWin(pSectionName) {

    var _winTitle = "";
    if (pSectionName == "Discount") {
        _winTitle = "【打折】";
    }
    else if (pSectionName == "Group") {
        _winTitle = "【团购】";
    }
    else if (pSectionName == "Commend") {
        _winTitle = "【商家推荐】";
    }
    else if (pSectionName == "Present") {
        _winTitle = "【礼品领取】";
    }
    else if (pSectionName == "SecKill") {
        _winTitle = "【秒杀商品】";
    }



    //打开Dialog弹出窗口
    openDialogWinNoClose("选择" + _winTitle + "栏目商品", mAddEditWinHtml, function () {

        //提交店铺展示信息
        submitShopShowMsg();

    }, function () {


    }, 700);

    mSectionName = pSectionName;

    //搜索相应的选择商品
    searchContent();
}

/**
 * 初始化修改排序窗口显示代码
 */
function initEditSortWinHtml() {
    //获取窗口显示代码
    mEditSortWinHtml = $("#EditSortWin").html();
    $("#EditSortWin").empty();
}

/**
 * 打开添加窗口
 * @param  pSectionName 加载不同类型的数据 Discount,Group,Commend,Present
 */
function openEditSortWin(pShopShowID, pSectionName, pTitle, pSortNum) {

    var _winTitle = "";
    if (pSectionName == "Discount") {
        _winTitle = "【打折】";
    }
    else if (pSectionName == "Group") {
        _winTitle = "【团购】";
    }
    else if (pSectionName == "Commend") {
        _winTitle = "【商家推荐】";
    }
    else if (pSectionName == "Present") {
        _winTitle = "【礼品领取】";
    }
    else if (pSectionName == "SecKill") {
        _winTitle = "【秒杀商品】";
    }

    //打开Dialog弹出窗口
    openDialogWinNoClose("排序" + _winTitle + "栏目商品", mEditSortWinHtml, function () {

        //更改排序值
        chgSortNum(pShopShowID)

    }, function () {


    }, 500);

    mSectionName = pSectionName;

    $("#TitleHrefWin").html(pTitle);
    $("#SortNumWin").val(pSortNum);
}





//=====================搜索商品数据分页====================//

/******数据分页的变量********/
var strPOSTSe = ""; //搜索条件对象 POST参数
var intPageCurrent = 1; //当前页
var pageSize = 0; //当页的记录条数，与后台保持一致
var recordSum = 0; //总记录数


/**
 * 搜索相应的选择商品
 * @param {any} pSectionName 加载不同类型的数据 Discount,Group,Commend,Present
 */
function searchContent() {

    //获取搜索表单值
    var SearchTxtWin = $("#SearchTxtWin").val().trim();

    intPageCurrent = 1; //开始页

    //构造POST参数
    var strPOST = {
        "PageCurrent": "1", "Type": "1"
    };

    //翻页所用
    var strPOSTSePush = {
        "SectionName": mSectionName, "SearchGoodsKey": SearchTxtWin,
    };
    //将对象添加到分类对象中

    //搜索内容用
    var strPOSTSeContent = pushTwoObject(strPOST, strPOSTSePush);

    //分页操作用
    var strPOSTSearch = { "Type": "1" };
    strPOSTSe = pushTwoObject(strPOSTSearch, strPOSTSePush);
    console.log(strPOSTSe);

    //加载提示
    $("#SearchResultUL").html("<li>… 加载中 …</li>");

    //以POST方式发送异步请求
    $.ajax({
        type: "POST",
        url: mAjaxUrl + "?rnd=" + Math.random(),
        data: strPOSTSeContent,
        dataType: "html",
        success: function (reTxtJson, status, xhr) {
            //显示返回值
            console.log(reTxtJson);
            if (reTxtJson != "") {

                //分页成功返回，构造显示代码
                pageSuccess(reTxtJson);

            }
            else {

                $("#SearchResultUL").html("<li></li>");
            }
        },
        error: function (xhr, errorTxt, status) {
            console.log("错误信息errorTxt=" + errorTxt + " | status=" + status);
            //alert("网络出现异常,请重试！");
        }

    });


}

//------------------------------搜索结果分页-------------------------------//
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

    //计算总页数
    var intPageSum = recordSum % pageSize != 0 ? recordSum / pageSize + 1 : recordSum / pageSize;

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
    //构造GET参数
    strPOSTSe = pushTwoObject(strPOSTSe, { "PageCurrent": intPageCurrent });

    //加载提示
    $("#SearchResultUL").html("<li>… 加载中 …</li>");

    $.ajax({
        type: "GET",
        url: mAjaxUrl + "?rnd=" + Math.random(),
        data: strPOSTSe,
        dataType: "html",
        success: function (reTxt, status, xhr) {
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
        console.log(reJsonObject);

        //总的记录数
        recordSum = reJsonObject.RecordSum;
        pageSize = reJsonObject.PageSize;


        //解析JSON数据 构造 前台显示代码
        var _xhtmlArr = jsonToXhtml(reJsonObject);

        //显示内容
        $("#SearchResultUL").html(_xhtmlArr[0]);
        //分页控制条
        $("#PageBar1").html(_xhtmlArr[1]);


        //全不选
        //document.getElementById("SelAllCb").checked = false;

    }
    else {
        $("#SearchResultUL").html("<li></li>");
    }
}

//------------解析JSON数据 构造 前台显示代码--------------//
// pJsonTxt Json字符串
function jsonToXhtml(pJsonObject) {

    //将字符串转换成功JSON对象
    //var json = JSON.parse(pJsonTxt);
    var json = pJsonObject;

    //-----内容显示前台显示代码----//
    var myJsVal = "";
    //循环构造
    for (var i = 0; i < json.DataPage.length; i++) {

        var indexDataPage = json.DataPage[i];
        var indexDataPageExtra = json.DataPageExtra[i];

        //礼品
        if (mSectionName == "Present") {
            myJsVal += "<li>";
            myJsVal += " <div class=\"search-checkbox\">";
            myJsVal += "     <input type=\"checkbox\" name=\"CbItem\" id=\"" + indexDataPage.PresentID + "\" />";
            myJsVal += " </div>";
            myJsVal += " <div class=\"goods-title-win\">";

            var _preGoodsUrl = "" + mOctWapWeb_AddrDomain + "/Present/PresentDetailPreMobileIframe?PID=" + indexDataPage.PresentID + "";

            myJsVal += "<a href=\"" + _preGoodsUrl + "\" target=\"_blank\">" + indexDataPage.PresentTitle + "</a>";
            myJsVal += " </div>";
            myJsVal += " <div class=\"search-stocknum\">";
            myJsVal += "     库存：" + indexDataPage.StockNum;
            myJsVal += " </div>";
            myJsVal += "</li>";
        }
        else {

            myJsVal += "<li>";
            myJsVal += " <div class=\"search-checkbox\">";
            myJsVal += "<input type=\"checkbox\" name=\"CbItem\" id=\"" + indexDataPage.GoodsID + "\" />";
            myJsVal += " </div>";
            myJsVal += " <div class=\"goods-title-win\">";

            var _preGoodsUrl = "" + mOctWapWeb_AddrDomain + "/Goods/GoodsDetailPreMobileIframe?GID=" + indexDataPage.GoodsID + "";
            if (mSectionName == "Group") {
                _preGoodsUrl = "" + mOctWapWeb_AddrDomain + "/Goods/GroupDetailPreMobileIframe?GID=" + indexDataPage.GoodsID + "";
            }


            myJsVal += "<a href=\"" + _preGoodsUrl + "\" target=\"_blank\">" + indexDataPage.GoodsTitle + "</a>";

            myJsVal += " </div>";
            myJsVal += " <div class=\"search-stocknum\">";
            myJsVal += "     库存：" + indexDataPage.StockNum;
            myJsVal += " </div>";
            myJsVal += "</li>";

        }

    }
    //alert(myJsVal);

    //-----分页控制条显示代码-------//
    var pageBarXhtml = "";

    pageBarXhtml += "<div onclick=\"NumberPage('1')\">首页</div>";
    pageBarXhtml += "<div onclick=\"PrePage()\">上一页</div>";
    pageBarXhtml += "<div onclick=\"NextPage()\">下一页</div>";
    pageBarXhtml += "<div onclick=\"NumberPage('" + json.PageSum + "')\">尾页</div>";

    var _pageMsgArr = new Array()
    //内容显示代码 
    _pageMsgArr[0] = myJsVal;
    //控制条件显示代码
    _pageMsgArr[1] = pageBarXhtml;
    //返回数组
    return _pageMsgArr;
}


//======================自定义函数=========================//

/**
 * 得到选择的商品或礼品信息ID拼接字符串
 * */
function getSelCbItemArr() {

    var _cgItemLabelArr = $("input[name='CbItem']");
    //console.log("_cgItemLabelArr=" + _cgItemLabelArr.length);

    var _IdArr = "";
    for (var i = 0; i < _cgItemLabelArr.length; i++) {
        var _isSel = $(_cgItemLabelArr[i]).is(":checked");
        //console.log("_isSel=" + _isSel);
        if (_isSel) {
            _IdArr += $(_cgItemLabelArr[i]).attr("id") + "^";
        }
    }
    //删除前后的"^"
    _IdArr = removeFrontAndBackChar(_IdArr, "^");

    console.log("_IdArr=" + _IdArr);
    return _IdArr;
}

/**
 * 提交店铺展示信息
 * */
function submitShopShowMsg() {

    //得到选择的商品或礼品信息ID拼接字符串
    var _extraDataIDArr = getSelCbItemArr();
    if (_extraDataIDArr == "") {
        //关闭窗口
        closeDialogWin();
        return;
    }

    //构造POST参数
    var dataPOST = {
        "Type": "2", "ExtraDataIDArr": _extraDataIDArr, "SectionName": mSectionName,
    };
    console.log(dataPOST);

    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: mAjaxUrl + "?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("提交店铺展示信息=" + reTxt);
            if (reTxt != "") {

                var _jsonReTxt = JSON.parse(reTxt);

                if (_jsonReTxt.ErrMsg != "" && _jsonReTxt.ErrMsg != undefined && _jsonReTxt.ErrMsg != null) {
                    toastWinToDiv(_jsonReTxt.ErrMsg, "dragWinDiv");
                    return;
                }

                if (_jsonReTxt.Msg != "" && _jsonReTxt.Msg != undefined && _jsonReTxt.Msg != null) {
                    //关闭窗口
                    closeDialogWin();
                    toastWin(_jsonReTxt.Msg);
                    //重新加载数据
                    initShopShowMsg();
                    return;
                }

            }
            else {

            }
        },
        error: function (xhr, errorTxt, status) {
            console.log("异步请求错误，errorTxt=" + errorTxt + " | status=" + status);
            return;
        }
    });
}

/**
 * 初始化店铺首页 各种栏目展示信息
 * */
function initShopShowMsg() {

    //构造POST参数
    var dataPOST = {
        "Type": "3",
    };
    console.log(dataPOST);

    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: mAjaxUrl + "?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("初始化店铺首页各种栏目展示信息=" + reTxt);
            if (reTxt != "") {
                var _jsonReTxt = JSON.parse(reTxt);

                mShopID = _jsonReTxt.ShopID;

                //预览店铺首页
                $("button[name='PreShopBtn']").on("click", function () {

                    window.open(mOctWapWeb_AddrDomain + "/Shop/IndexPreMobileIframe?SID=" + mShopID);

                });

                var ShopShowMsgList = _jsonReTxt.ShopShowMsg;
                var ShopShowMsgListGoods = _jsonReTxt.ShopShowMsgGoods;

                var HomeDiscountList = null;
                var HomeGroupList = null;
                var HomeCommendList = null;
                var HomePresentList = null;
                var HomeSecKillList = null;

                var HomeDiscountGoodsList = null;
                var HomeGroupGoodsList = null;
                var HomeCommendGoodsList = null;
                var HomePresentGoodsList = null;
                var HomeSecKillGoodsList = null;


                //先将一整块排序的放到显示代码中
                var myJsVal = "";
                for (var k = 0; k < ShopShowMsgList.length; k++) {

                    //打折
                    if (ShopShowMsgList[k].HomeDiscountList != undefined && ShopShowMsgList[k].HomeDiscountList != null) {

                        HomeDiscountList = ShopShowMsgList[k].HomeDiscountList;
                        HomeDiscountGoodsList = ShopShowMsgListGoods[k].HomeDiscountGoodsList;


                        myJsVal += "        <div class=\"section-content-item\">";
                        myJsVal += "            <div class=\"main-title am-cf am-nbfc\">";
                        myJsVal += "                <div class=\"title-txt-div am-fl\">";
                        myJsVal += "                    <i class=\"am-icon-list\"></i> 打折商品";
                        myJsVal += "                </div>";
                        myJsVal += "                <div class=\"title-btn-div am-fr\">";
                        myJsVal += "                    <span id=\"HomeDiscountSpanBtn\">";
                        myJsVal += "                        <button class=\"title-btn am-btn am-btn-xs am-btn-danger am-round\" onclick=\"tglAllIsShow(\'true\', \'Discount\')\"><i class=\"am-icon-cog\"></i> 全部显示</button>";
                        myJsVal += "                    </span>";
                        myJsVal += "                    <button class=\"title-btn am-btn am-btn-xs am-btn-success am-round\" name=\"PreShopBtn\"><i class=\"am-icon-internet-explorer\"></i> 浏览效果</button>";
                        myJsVal += " <button class=\"title-btn am-btn am-btn-xs am-btn-warning am-round\" onclick=\"goTopSortNumSection(\'Home_Discount\')\"><i class=\"am-icon-level-up\"></i> 置顶</button>";
                        myJsVal += "                </div>";
                        myJsVal += "            </div>";
                        myJsVal += "            <div class=\"form-main am-nbfc am-padding\">";
                        myJsVal += "                <ul class=\"goods-item-ul\" id=\"HomeDiscountUl\">";
                        myJsVal += "</ul></div></div>"
                    }


                    //拼团的
                    if (ShopShowMsgList[k].HomeGroupList != undefined && ShopShowMsgList[k].HomeGroupList != null) {

                        HomeGroupList = ShopShowMsgList[k].HomeGroupList;
                        HomeGroupGoodsList = ShopShowMsgListGoods[k].HomeGroupGoodsList;


                        myJsVal += "<div class=\"section-content-item\">";
                        myJsVal += "            <div class=\"main-title am-cf am-nbfc\">";
                        myJsVal += "                <div class=\"title-txt-div am-fl\">";
                        myJsVal += "                    <i class=\"am-icon-list\"></i> 团购商品";
                        myJsVal += "                </div>";
                        myJsVal += "                <div class=\"title-btn-div am-fr\">";
                        myJsVal += "                    <span id=\"HomeGroupSpanBtn\">";
                        myJsVal += "                        <button class=\"title-btn am-btn am-btn-xs am-btn-danger am-round\" onclick=\"tglAllIsShow(\'true\', \'Group\')\"><i class=\"am-icon-cog\"></i> 全部显示</button>";
                        myJsVal += "                    </span>";
                        myJsVal += "                    <button class=\"title-btn am-btn am-btn-xs am-btn-success am-round\" name=\"PreShopBtn\"><i class=\"am-icon-internet-explorer\"></i> 浏览效果</button>";
                        myJsVal += " <button class=\"title-btn am-btn am-btn-xs am-btn-warning am-round\" onclick=\"goTopSortNumSection(\'Home_Group\')\"><i class=\"am-icon-level-up\"></i> 置顶</button>";
                        myJsVal += "                </div>";
                        myJsVal += "            </div>";
                        myJsVal += "            <div class=\"form-main am-nbfc am-padding\">";
                        myJsVal += "                <ul class=\"goods-item-ul\" id=\"HomeGroupUl\">";
                        myJsVal += "</ul></div></div>"
                    }


                    //秒杀的
                    if (ShopShowMsgList[k].HomeSecKillList != undefined && ShopShowMsgList[k].HomeSecKillList != null) {

                        HomeSecKillList = ShopShowMsgList[k].HomeSecKillList;
                        HomeSecKillGoodsList = ShopShowMsgListGoods[k].HomeSecKillGoodsList;


                        myJsVal += " <div class=\"section-content-item\">";
                        myJsVal += "            <div class=\"main-title am-cf am-nbfc\">";
                        myJsVal += "                <div class=\"title-txt-div am-fl\">";
                        myJsVal += "                    <i class=\"am-icon-list\"></i> 秒杀商品";
                        myJsVal += "                </div>";
                        myJsVal += "                <div class=\"title-btn-div am-fr\">";
                        myJsVal += "                    <span id=\"HomeSecKillSpanBtn\">";
                        myJsVal += "                        <button class=\"title-btn am-btn am-btn-xs am-btn-danger am-round\" onclick=\"tglAllIsShow(\'true\', \'SecKill\')\"><i class=\"am-icon-cog\"></i> 全部显示</button>";
                        myJsVal += "                    </span>";
                        myJsVal += "                    <button class=\"title-btn am-btn am-btn-xs am-btn-success am-round\" name=\"PreShopBtn\"><i class=\"am-icon-internet-explorer\"></i> 浏览效果</button>";
                        myJsVal += " <button class=\"title-btn am-btn am-btn-xs am-btn-warning am-round\" onclick=\"goTopSortNumSection(\'Home_SecKill\')\"><i class=\"am-icon-level-up\"></i> 置顶</button>";
                        myJsVal += "                </div>";
                        myJsVal += "            </div>";
                        myJsVal += "            <div class=\"form-main am-nbfc am-padding\">";
                        myJsVal += "                <ul class=\"goods-item-ul\" id=\"HomeSecKillUl\">";
                        myJsVal += "</ul></div></div>"
                    }



                    //推荐的
                    if (ShopShowMsgList[k].HomeCommendList != undefined && ShopShowMsgList[k].HomeCommendList != null) {

                        HomeCommendList = ShopShowMsgList[k].HomeCommendList;
                        HomeCommendGoodsList = ShopShowMsgListGoods[k].HomeCommendGoodsList;

                        myJsVal += " <div class=\"section-content-item\">";
                        myJsVal += "            <div class=\"main-title am-cf am-nbfc\">";
                        myJsVal += "                <div class=\"title-txt-div am-fl\">";
                        myJsVal += "                    <i class=\"am-icon-list\"></i> 商家推荐";
                        myJsVal += "                </div>";
                        myJsVal += "                <div class=\"title-btn-div am-fr\">";
                        myJsVal += "                    <span id=\"HomeCommendSpanBtn\">";
                        myJsVal += "                        <button class=\"title-btn am-btn am-btn-xs am-btn-danger am-round\" onclick=\"tglAllIsShow(\'true\', \'Commend\')\"><i class=\"am-icon-cog\"></i> 全部显示</button>";
                        myJsVal += "                    </span>";
                        myJsVal += "                    <button class=\"title-btn am-btn am-btn-xs am-btn-success am-round\" name=\"PreShopBtn\"><i class=\"am-icon-internet-explorer\"></i> 浏览效果</button>";
                        myJsVal += " <button class=\"title-btn am-btn am-btn-xs am-btn-warning am-round\" onclick=\"goTopSortNumSection(\'Home_Commend\')\"><i class=\"am-icon-level-up\"></i> 置顶</button>";
                        myJsVal += "                </div>";
                        myJsVal += "            </div>";
                        myJsVal += "            <div class=\"form-main am-nbfc am-padding\">";
                        myJsVal += "                <ul class=\"goods-item-ul\" id=\"HomeCommendUl\">";
                        myJsVal += "</ul></div></div>"
                    }

                    //礼品的
                    if (ShopShowMsgList[k].HomePresentList != undefined && ShopShowMsgList[k].HomePresentList != null) {

                        HomePresentList = ShopShowMsgList[k].HomePresentList;
                        HomePresentGoodsList = ShopShowMsgListGoods[k].HomePresentGoodsList;


                        myJsVal += " <div class=\"section-content-item\">";
                        myJsVal += "            <div class=\"main-title am-cf am-nbfc\">";
                        myJsVal += "                <div class=\"title-txt-div am-fl\">";
                        myJsVal += "                    <i class=\"am-icon-list\"></i> 礼品领取";
                        myJsVal += "                </div>";
                        myJsVal += "                <div class=\"title-btn-div am-fr\">";
                        myJsVal += "                    <span id=\"HomePresentSpanBtn\">";
                        myJsVal += "                        <button class=\"title-btn am-btn am-btn-xs am-btn-danger am-round\" onclick=\"tglAllIsShow(\'true\', \'Present\')\"><i class=\"am-icon-cog\"></i> 全部显示</button>";
                        myJsVal += "                    </span>";
                        myJsVal += "                    <button class=\"title-btn am-btn am-btn-xs am-btn-success am-round\" name=\"PreShopBtn\"><i class=\"am-icon-internet-explorer\"></i> 浏览效果</button>";
                        myJsVal += " <button class=\"title-btn am-btn am-btn-xs am-btn-warning am-round\" onclick=\"goTopSortNumSection(\'Home_Present\')\"><i class=\"am-icon-level-up\"></i> 置顶</button>";
                        myJsVal += "                </div>";
                        myJsVal += "            </div>";
                        myJsVal += "            <div class=\"form-main am-nbfc am-padding\">";
                        myJsVal += "                <ul class=\"goods-item-ul\" id=\"HomePresentUl\">";
                        myJsVal += "</ul></div></div>"
                    }
                }

                //如果栏目为 undefined 那就接在最后
                if (HomeDiscountList == null) {
                    myJsVal += "        <div class=\"section-content-item\">";
                    myJsVal += "            <div class=\"main-title am-cf am-nbfc\">";
                    myJsVal += "                <div class=\"title-txt-div am-fl\">";
                    myJsVal += "                    <i class=\"am-icon-list\"></i> 打折商品";
                    myJsVal += "                </div>";
                    myJsVal += "                <div class=\"title-btn-div am-fr\">";
                    myJsVal += "                    <span id=\"HomeDiscountSpanBtn\">";
                    myJsVal += "                        <button class=\"title-btn am-btn am-btn-xs am-btn-danger am-round\" onclick=\"tglAllIsShow(\'true\', \'Discount\')\"><i class=\"am-icon-cog\"></i> 全部显示</button>";
                    myJsVal += "                    </span>";
                    myJsVal += "                    <button class=\"title-btn am-btn am-btn-xs am-btn-success am-round\" name=\"PreShopBtn\"><i class=\"am-icon-internet-explorer\"></i> 浏览效果</button>";
                    myJsVal += " <button class=\"title-btn am-btn am-btn-xs am-btn-warning am-round\" onclick=\"goTopSortNumSection(\'Home_Discount\')\"><i class=\"am-icon-level-up\"></i> 置顶</button>";
                    myJsVal += "                </div>";
                    myJsVal += "            </div>";
                    myJsVal += "            <div class=\"form-main am-nbfc am-padding\">";
                    myJsVal += "                <ul class=\"goods-item-ul\" id=\"HomeDiscountUl\">";
                    myJsVal += "</ul></div></div>"
                }
                if (HomeGroupList == null) {
                    myJsVal += "<div class=\"section-content-item\">";
                    myJsVal += "            <div class=\"main-title am-cf am-nbfc\">";
                    myJsVal += "                <div class=\"title-txt-div am-fl\">";
                    myJsVal += "                    <i class=\"am-icon-list\"></i> 团购商品";
                    myJsVal += "                </div>";
                    myJsVal += "                <div class=\"title-btn-div am-fr\">";
                    myJsVal += "                    <span id=\"HomeGroupSpanBtn\">";
                    myJsVal += "                        <button class=\"title-btn am-btn am-btn-xs am-btn-danger am-round\" onclick=\"tglAllIsShow(\'true\', \'Group\')\"><i class=\"am-icon-cog\"></i> 全部显示</button>";
                    myJsVal += "                    </span>";
                    myJsVal += "                    <button class=\"title-btn am-btn am-btn-xs am-btn-success am-round\" name=\"PreShopBtn\"><i class=\"am-icon-internet-explorer\"></i> 浏览效果</button>";
                    myJsVal += " <button class=\"title-btn am-btn am-btn-xs am-btn-warning am-round\" onclick=\"goTopSortNumSection(\'Home_Group\')\"><i class=\"am-icon-level-up\"></i> 置顶</button>";
                    myJsVal += "                </div>";
                    myJsVal += "            </div>";
                    myJsVal += "            <div class=\"form-main am-nbfc am-padding\">";
                    myJsVal += "                <ul class=\"goods-item-ul\" id=\"HomeGroupUl\">";
                    myJsVal += "</ul></div></div>"
                }
                if (HomeCommendList == null) {
                    myJsVal += " <div class=\"section-content-item\">";
                    myJsVal += "            <div class=\"main-title am-cf am-nbfc\">";
                    myJsVal += "                <div class=\"title-txt-div am-fl\">";
                    myJsVal += "                    <i class=\"am-icon-list\"></i> 商家推荐";
                    myJsVal += "                </div>";
                    myJsVal += "                <div class=\"title-btn-div am-fr\">";
                    myJsVal += "                    <span id=\"HomeCommendSpanBtn\">";
                    myJsVal += "                        <button class=\"title-btn am-btn am-btn-xs am-btn-danger am-round\" onclick=\"tglAllIsShow(\'true\', \'Commend\')\"><i class=\"am-icon-cog\"></i> 全部显示</button>";
                    myJsVal += "                    </span>";
                    myJsVal += "                    <button class=\"title-btn am-btn am-btn-xs am-btn-success am-round\" name=\"PreShopBtn\"><i class=\"am-icon-internet-explorer\"></i> 浏览效果</button>";
                    myJsVal += " <button class=\"title-btn am-btn am-btn-xs am-btn-warning am-round\" onclick=\"goTopSortNumSection(\'Home_Commend\')\"><i class=\"am-icon-level-up\"></i> 置顶</button>";
                    myJsVal += "                </div>";
                    myJsVal += "            </div>";
                    myJsVal += "            <div class=\"form-main am-nbfc am-padding\">";
                    myJsVal += "                <ul class=\"goods-item-ul\" id=\"HomeCommendUl\">";
                    myJsVal += "</ul></div></div>"
                }
                if (HomePresentList == null) {
                    myJsVal += " <div class=\"section-content-item\">";
                    myJsVal += "            <div class=\"main-title am-cf am-nbfc\">";
                    myJsVal += "                <div class=\"title-txt-div am-fl\">";
                    myJsVal += "                    <i class=\"am-icon-list\"></i> 礼品领取";
                    myJsVal += "                </div>";
                    myJsVal += "                <div class=\"title-btn-div am-fr\">";
                    myJsVal += "                    <span id=\"HomePresentSpanBtn\">";
                    myJsVal += "                        <button class=\"title-btn am-btn am-btn-xs am-btn-danger am-round\" onclick=\"tglAllIsShow(\'true\', \'Present\')\"><i class=\"am-icon-cog\"></i> 全部显示</button>";
                    myJsVal += "                    </span>";
                    myJsVal += "                    <button class=\"title-btn am-btn am-btn-xs am-btn-success am-round\" name=\"PreShopBtn\"><i class=\"am-icon-internet-explorer\"></i> 浏览效果</button>";
                    myJsVal += " <button class=\"title-btn am-btn am-btn-xs am-btn-warning am-round\" onclick=\"goTopSortNumSection(\'Home_Present\')\"><i class=\"am-icon-level-up\"></i> 置顶</button>";
                    myJsVal += "                </div>";
                    myJsVal += "            </div>";
                    myJsVal += "            <div class=\"form-main am-nbfc am-padding\">";
                    myJsVal += "                <ul class=\"goods-item-ul\" id=\"HomePresentUl\">";
                    myJsVal += "</ul></div></div>"
                }
                if (HomeSecKillList == null) {
                    myJsVal += " <div class=\"section-content-item\">";
                    myJsVal += "            <div class=\"main-title am-cf am-nbfc\">";
                    myJsVal += "                <div class=\"title-txt-div am-fl\">";
                    myJsVal += "                    <i class=\"am-icon-list\"></i> 秒杀商品";
                    myJsVal += "                </div>";
                    myJsVal += "                <div class=\"title-btn-div am-fr\">";
                    myJsVal += "                    <span id=\"HomeSecKillSpanBtn\">";
                    myJsVal += "                        <button class=\"title-btn am-btn am-btn-xs am-btn-danger am-round\" onclick=\"tglAllIsShow(\'true\', \'SecKill\')\"><i class=\"am-icon-cog\"></i> 全部显示</button>";
                    myJsVal += "                    </span>";
                    myJsVal += "                    <button class=\"title-btn am-btn am-btn-xs am-btn-success am-round\" name=\"PreShopBtn\"><i class=\"am-icon-internet-explorer\"></i> 浏览效果</button>";
                    myJsVal += " <button class=\"title-btn am-btn am-btn-xs am-btn-warning am-round\" onclick=\"goTopSortNumSection(\'Home_SecKill\')\"><i class=\"am-icon-level-up\"></i> 置顶</button>";
                    myJsVal += "                </div>";
                    myJsVal += "            </div>";
                    myJsVal += "            <div class=\"form-main am-nbfc am-padding\">";
                    myJsVal += "                <ul class=\"goods-item-ul\" id=\"HomeSecKillUl\">";
                    myJsVal += "</ul></div></div>"
                }

                //排序显示代码插入前台
                $("#SectionContent").html(myJsVal);



                //===============插入具体的商品===================//


                //打折商品
                var myJsValDiscount = "";
                if (HomeDiscountList != undefined && HomeDiscountList != null) {
                    for (var i = 0; i < HomeDiscountGoodsList.length; i++) {


                        //全部显示与隐藏
                        if (HomeDiscountList[i].IsShow == "true") {
                            if ($("#HomeDiscountSpanBtn").html().indexOf("全部显示") >= 0) {
                                $("#HomeDiscountSpanBtn").html("<button class=\"title-btn am-btn am-btn-xs am-btn-default am-round\" onclick=\"tglAllIsShow('false', 'Discount')\"><i class=\"am-icon-cog\"></i> 全部隐藏</button>");
                            }
                        }
                        else {
                            if ($("#HomeDiscountSpanBtn").html().indexOf("全部隐藏") >= 0) {
                                $("#HomeDiscountSpanBtn").html("<button class=\"title-btn am-btn am-btn-xs am-btn-danger am-round\" onclick=\"tglAllIsShow('true', 'Discount')\"><i class=\"am-icon-cog\"></i> 全部显示</button>");
                            }
                        }


                        if (HomeDiscountGoodsList[i].GoodsTitle.length > 18) {
                            HomeDiscountGoodsList[i].GoodsTitle = HomeDiscountGoodsList[i].GoodsTitle.substring(0, 17);
                        }

                        myJsValDiscount += "<li class=\"goods-item-li\">";
                        myJsValDiscount += " <a href=\"" + mOctWapWeb_AddrDomain + "/Goods/GoodsDetailPreMobileIframe?GID=" + HomeDiscountList[i].GoodsID + "\" target=\"_blank\" class=\"goods-msg\">";
                        myJsValDiscount += "     <img src=\"//" + HomeDiscountGoodsList[i].GoodsCoverImgPath + "\" />";
                        myJsValDiscount += "     <div>";
                        myJsValDiscount += "" + HomeDiscountGoodsList[i].GoodsTitle + "";
                        myJsValDiscount += "     </div>";
                        myJsValDiscount += "     <div class=\"goods-price-msg\">";
                        myJsValDiscount += "         <div class=\"goods-price-left\">&#165;" + HomeDiscountGoodsList[i].GoodsPrice + "</div>";
                        myJsValDiscount += "         <div class=\"goods-extra-right\">" + HomeDiscountGoodsList[i].Discount + "折</div>";
                        myJsValDiscount += "     </div>";
                        myJsValDiscount += " </a>";
                        myJsValDiscount += " <div class=\"goods-exe\">";
                        myJsValDiscount += "     排序值:<b>" + HomeDiscountList[i].SortNum + "</b> <div onclick=\"openEditSortWin('" + HomeDiscountList[i].ShopShowID + "','Discount','" + HomeDiscountGoodsList[i].GoodsTitle + "','" + HomeDiscountList[i].SortNum + "')\">排序</div>  ";
                        if (HomeDiscountList[i].IsShow == "true") {
                            myJsValDiscount += "<div onclick=\"tglIsShow('" + HomeDiscountList[i].ShopShowID + "', 'false')\">隐藏</div>"
                        }
                        else {
                            myJsValDiscount += "<div onclick=\"tglIsShow('" + HomeDiscountList[i].ShopShowID + "', 'true')\">显示</div>"
                        }
                        myJsValDiscount += "<div onclick=\"delShopShowMsgArr('" + HomeDiscountList[i].ShopShowID + "')\">删除</div>"
                        myJsValDiscount += " </div>";
                        myJsValDiscount += "</li>";
                    }
                }
                myJsValDiscount += "<li class=\"goods-item-li goods-item-li-add\" onclick=\"openAddWin(\'Discount\')  \">";
                myJsValDiscount += " <div class=\"goods-msg goods-msg-btn-add\">";
                myJsValDiscount += "     添加商品";
                myJsValDiscount += " </div>";
                myJsValDiscount += " <div class=\"goods-exe\">";
                myJsValDiscount += "     排序值:<b>1</b> <div>排序</div> <div>显示</div> <div>删除</div>";
                myJsValDiscount += " </div>";
                myJsValDiscount += "</li>";
                //显示代码插入前台
                $("#HomeDiscountUl").html(myJsValDiscount);


                //团购商品
                var myJsValGroup = "";
                if (HomeGroupList != undefined && HomeGroupList != null) {
                    for (var i = 0; i < HomeGroupGoodsList.length; i++) {

                        if (HomeGroupGoodsList.length <= 0) {
                            continue;
                        }
                        if (HomeGroupGoodsList[i].GroupDiscount <= 0) {
                            continue;
                        }


                        //全部显示与隐藏
                        if (HomeGroupList[i].IsShow == "true") {
                            if ($("#HomeGroupSpanBtn").html().indexOf("全部显示") >= 0) {
                                $("#HomeGroupSpanBtn").html("<button class=\"title-btn am-btn am-btn-xs am-btn-default am-round\" onclick=\"tglAllIsShow('false', 'Group')\"><i class=\"am-icon-cog\"></i> 全部隐藏</button>");
                            }
                        }
                        else {
                            if ($("#HomeGroupSpanBtn").html().indexOf("全部隐藏") >= 0) {
                                $("#HomeGroupSpanBtn").html("<button class=\"title-btn am-btn am-btn-xs am-btn-danger am-round\" onclick=\"tglAllIsShow('true', 'Group')\"><i class=\"am-icon-cog\"></i> 全部显示</button>");
                            }
                        }


                        if (HomeGroupGoodsList[i].GoodsTitle.length > 18) {
                            HomeGroupGoodsList[i].GoodsTitle = HomeGroupGoodsList[i].GoodsTitle.substring(0, 17);
                        }

                        myJsValGroup += "<li class=\"goods-item-li\">";
                        myJsValGroup += " <a href=\"" + mOctWapWeb_AddrDomain + "/Goods/GoodsDetailPreMobileIframe?GID=" + HomeGroupGoodsList[i].GoodsID + "\" target=\"_blank\" class=\"goods-msg\">";
                        myJsValGroup += "     <img src=\"//" + HomeGroupGoodsList[i].GoodsCoverImgPath + "\" />";
                        myJsValGroup += "     <div>";
                        myJsValGroup += "" + HomeGroupGoodsList[i].GoodsTitle + "";
                        myJsValGroup += "     </div>";
                        myJsValGroup += "     <div class=\"goods-price-msg\">";
                        myJsValGroup += "         <div class=\"goods-price-left\">&#165;" + HomeGroupGoodsList[i].GoodsPrice + "</div>";
                        myJsValGroup += "         <div class=\"goods-extra-right\">团购</div>";
                        myJsValGroup += "     </div>";
                        myJsValGroup += " </a>";
                        myJsValGroup += " <div class=\"goods-exe\">";
                        myJsValGroup += "     排序值:<b>" + HomeGroupList[i].SortNum + "</b> <div onclick=\"openEditSortWin('" + HomeGroupList[i].ShopShowID + "','Group','" + HomeGroupGoodsList[i].GoodsTitle + "','" + HomeGroupList[i].SortNum + "')\">排序</div>";
                        if (HomeGroupList[i].IsShow == "true") {
                            myJsValGroup += "<div onclick=\"tglIsShow('" + HomeGroupList[i].ShopShowID + "', 'false')\">隐藏</div>"
                        }
                        else {
                            myJsValGroup += "<div onclick=\"tglIsShow('" + HomeGroupList[i].ShopShowID + "', 'true')\">显示</div>"
                        }
                        myJsValGroup += "<div onclick=\"delShopShowMsgArr('" + HomeGroupList[i].ShopShowID + "')\">删除</div>"
                        myJsValGroup += " </div>";
                        myJsValGroup += "</li>";
                    }
                }
                myJsValGroup += "<li class=\"goods-item-li goods-item-li-add\" onclick=\"openAddWin(\'Group\')  \">";
                myJsValGroup += " <div class=\"goods-msg goods-msg-btn-add\">";
                myJsValGroup += "     添加商品";
                myJsValGroup += " </div>";
                myJsValGroup += " <div class=\"goods-exe\">";
                myJsValGroup += "     排序值:<b>1</b> <div>排序</div> <div>显示</div> <div>删除</div>";
                myJsValGroup += " </div>";
                myJsValGroup += "</li>";
                //显示代码插入前台
                $("#HomeGroupUl").html(myJsValGroup);


                //秒杀商品
                var myJsValSecKill = "";
                if (HomeSecKillList != undefined && HomeSecKillList != null) {
                    for (var i = 0; i < HomeSecKillGoodsList.length; i++) {

                        if (HomeSecKillGoodsList.length <= 0) {
                            continue;
                        }
                        if (HomeSecKillGoodsList[i].SkDiscount <= 0) {
                            continue;
                        }

                        //全部显示与隐藏
                        if (HomeSecKillList[i].IsShow == "true") {
                            if ($("#HomeSecKillSpanBtn").html().indexOf("全部显示") >= 0) {
                                $("#HomeSecKillSpanBtn").html("<button class=\"title-btn am-btn am-btn-xs am-btn-default am-round\" onclick=\"tglAllIsShow('false', 'SecKill')\"><i class=\"am-icon-cog\"></i> 全部隐藏</button>");
                            }
                        }
                        else {
                            if ($("#HomeSecKillSpanBtn").html().indexOf("全部隐藏") >= 0) {
                                $("#HomeSecKillSpanBtn").html("<button class=\"title-btn am-btn am-btn-xs am-btn-danger am-round\" onclick=\"tglAllIsShow('true', 'SecKill')\"><i class=\"am-icon-cog\"></i> 全部显示</button>");
                            }
                        }


                        if (HomeSecKillGoodsList[i].GoodsTitle.length > 18) {
                            HomeSecKillGoodsList[i].GoodsTitle = HomeSecKillGoodsList[i].GoodsTitle.substring(0, 17);
                        }

                        myJsValSecKill += "<li class=\"goods-item-li\">";
                        myJsValSecKill += " <a href=\"" + mOctWapWeb_AddrDomain + "/Goods/GoodsDetailPreMobileIframe?GID=" + HomeSecKillGoodsList[i].GoodsID + "\" target=\"_blank\" class=\"goods-msg\">";
                        myJsValSecKill += "     <img src=\"//" + HomeSecKillGoodsList[i].GoodsCoverImgPath + "\" />";
                        myJsValSecKill += "     <div>";
                        myJsValSecKill += "" + HomeSecKillGoodsList[i].GoodsTitle + "";
                        myJsValSecKill += "     </div>";
                        myJsValSecKill += "     <div class=\"goods-price-msg\">";
                        myJsValSecKill += "         <div class=\"goods-price-left\">&#165;" + HomeSecKillGoodsList[i].GoodsPrice + "</div>";
                        myJsValSecKill += "         <div class=\"goods-extra-right\">秒杀</div>";
                        myJsValSecKill += "     </div>";
                        myJsValSecKill += " </a>";
                        myJsValSecKill += " <div class=\"goods-exe\">";
                        myJsValSecKill += "     排序值:<b>" + HomeSecKillList[i].SortNum + "</b> <div onclick=\"openEditSortWin('" + HomeSecKillList[i].ShopShowID + "','SecKill','" + HomeSecKillGoodsList[i].GoodsTitle + "','" + HomeSecKillList[i].SortNum + "')\">排序</div>";
                        if (HomeSecKillList[i].IsShow == "true") {
                            myJsValSecKill += "<div onclick=\"tglIsShow('" + HomeSecKillList[i].ShopShowID + "', 'false')\">隐藏</div>"
                        }
                        else {
                            myJsValSecKill += "<div onclick=\"tglIsShow('" + HomeSecKillList[i].ShopShowID + "', 'true')\">显示</div>"
                        }
                        myJsValSecKill += "<div onclick=\"delShopShowMsgArr('" + HomeSecKillList[i].ShopShowID + "')\">删除</div>"
                        myJsValSecKill += " </div>";
                        myJsValSecKill += "</li>";
                    }
                }
                myJsValSecKill += "<li class=\"goods-item-li goods-item-li-add\" onclick=\"openAddWin(\'SecKill\')  \">";
                myJsValSecKill += " <div class=\"goods-msg goods-msg-btn-add\">";
                myJsValSecKill += "     添加商品";
                myJsValSecKill += " </div>";
                myJsValSecKill += " <div class=\"goods-exe\">";
                myJsValSecKill += "     排序值:<b>1</b> <div>排序</div> <div>显示</div> <div>删除</div>";
                myJsValSecKill += " </div>";
                myJsValSecKill += "</li>";
                //显示代码插入前台
                $("#HomeSecKillUl").html(myJsValSecKill);



                //商家推荐
                var myJsValCommend = "";
                if (HomeCommendList != undefined && HomeCommendList != null) {
                    for (var i = 0; i < HomeCommendGoodsList.length; i++) {

                        //全部显示与隐藏
                        if (HomeCommendList[i].IsShow == "true") {
                            if ($("#HomeCommendSpanBtn").html().indexOf("全部显示") >= 0) {
                                $("#HomeCommendSpanBtn").html("<button class=\"title-btn am-btn am-btn-xs am-btn-default am-round\" onclick=\"tglAllIsShow('false', 'Commend')\"><i class=\"am-icon-cog\"></i> 全部隐藏</button>");
                            }
                        }
                        else {
                            if ($("#HomeCommendSpanBtn").html().indexOf("全部隐藏") >= 0) {
                                $("#HomeCommendSpanBtn").html("<button class=\"title-btn am-btn am-btn-xs am-btn-danger am-round\" onclick=\"tglAllIsShow('true', 'Commend')\"><i class=\"am-icon-cog\"></i> 全部显示</button>");
                            }
                        }


                        if (HomeCommendGoodsList[i].GoodsTitle.length > 18) {
                            HomeCommendGoodsList[i].GoodsTitle = HomeCommendGoodsList[i].GoodsTitle.substring(0, 17);
                        }

                        myJsValCommend += "<li class=\"goods-item-li\">";
                        myJsValCommend += " <a href=\"" + mOctWapWeb_AddrDomain + "/Goods/GoodsDetailPreMobileIframe?GID=" + HomeCommendGoodsList[i].GoodsID + "\" target=\"_blank\" class=\"goods-msg\">";
                        myJsValCommend += "     <img src=\"//" + HomeCommendGoodsList[i].GoodsCoverImgPath + "\" />";
                        myJsValCommend += "     <div>";
                        myJsValCommend += "" + HomeCommendGoodsList[i].GoodsTitle + "";
                        myJsValCommend += "     </div>";
                        myJsValCommend += "     <div class=\"goods-price-msg\">";
                        myJsValCommend += "         <div class=\"goods-price-left\">&#165;" + HomeCommendGoodsList[i].GoodsPrice + "</div>";
                        myJsValCommend += "         <div class=\"goods-extra-right goods-extra-right-delline\">&#165;" + HomeCommendGoodsList[i].MarketPrice + "</div>";
                        myJsValCommend += "     </div>";
                        myJsValCommend += " </a>";
                        myJsValCommend += " <div class=\"goods-exe\">";
                        myJsValCommend += "     排序值:<b>" + HomeCommendList[i].SortNum + "</b> <div onclick=\"openEditSortWin('" + HomeCommendList[i].ShopShowID + "','Commend','" + HomeCommendGoodsList[i].GoodsTitle + "','" + HomeCommendList[i].SortNum + "')\">排序</div>";
                        if (HomeCommendList[i].IsShow == "true") {
                            myJsValCommend += "<div onclick=\"tglIsShow('" + HomeCommendList[i].ShopShowID + "', 'false')\">隐藏</div>"
                        }
                        else {
                            myJsValCommend += "<div onclick=\"tglIsShow('" + HomeCommendList[i].ShopShowID + "', 'true')\">显示</div>"
                        }
                        myJsValCommend += "<div onclick=\"delShopShowMsgArr('" + HomeCommendList[i].ShopShowID + "')\">删除</div>"
                        myJsValCommend += " </div>";
                        myJsValCommend += "</li>";
                    }
                }
                myJsValCommend += "<li class=\"goods-item-li goods-item-li-add\" onclick=\"openAddWin(\'Commend\')  \">";
                myJsValCommend += " <div class=\"goods-msg goods-msg-btn-add\">";
                myJsValCommend += "     添加商品";
                myJsValCommend += " </div>";
                myJsValCommend += " <div class=\"goods-exe\">";
                myJsValCommend += "     排序值:<b>1</b> <div>排序</div> <div>显示</div> <div>删除</div>";
                myJsValCommend += " </div>";
                myJsValCommend += "</li>";
                //显示代码插入前台
                $("#HomeCommendUl").html(myJsValCommend);


                //礼品领取
                var myJsValPresent = "";
                if (HomePresentList != undefined && HomePresentList != null) {
                    for (var i = 0; i < HomePresentGoodsList.length; i++) {

                        //全部显示与隐藏
                        if (HomePresentList[i].IsShow == "true") {
                            if ($("#HomePresentSpanBtn").html().indexOf("全部显示") >= 0) {
                                $("#HomePresentSpanBtn").html("<button class=\"title-btn am-btn am-btn-xs am-btn-default am-round\" onclick=\"tglAllIsShow('false', 'Present')\"><i class=\"am-icon-cog\"></i> 全部隐藏</button>");
                            }
                        }
                        else {
                            if ($("#HomePresentSpanBtn").html().indexOf("全部隐藏") >= 0) {
                                $("#HomePresentSpanBtn").html("<button class=\"title-btn am-btn am-btn-xs am-btn-danger am-round\" onclick=\"tglAllIsShow('true', 'Present')\"><i class=\"am-icon-cog\"></i> 全部显示</button>");
                            }
                        }

                        if (HomePresentGoodsList[i].PresentTitle == null) {
                            HomePresentGoodsList[i].PresentTitle = "";
                        }
                        else {
                            if (HomePresentGoodsList[i].PresentTitle.length > 18) {
                                HomePresentGoodsList[i].PresentTitle = HomePresentGoodsList[i].PresentTitle.substring(0, 17);
                            }
                        }

                        myJsValPresent += "<li class=\"goods-item-li\">";
                        myJsValPresent += " <a href=\"" + mOctWapWeb_AddrDomain + "/Present/PresentDetailPreMobileIframe?PID=" + HomePresentGoodsList[i].PresentID + "\" target=\"_blank\" class=\"goods-msg\">";
                        myJsValPresent += "     <img src=\"//" + HomePresentGoodsList[i].PresentCoverImgURL + "\" />";
                        myJsValPresent += "     <div>";
                        myJsValPresent += "" + HomePresentGoodsList[i].PresentTitle + "";
                        myJsValPresent += "     </div>";
                        myJsValPresent += "     <div class=\"goods-price-msg\">";
                        myJsValPresent += "         <div class=\"goods-price-left\">积分:" + HomePresentGoodsList[i].PresentPrice + "</div>";
                        myJsValPresent += "         <div class=\"goods-extra-right goods-extra-right-nobg\">剩余:" + HomePresentGoodsList[i].StockNum + "</div>";
                        myJsValPresent += "     </div>";
                        myJsValPresent += " </a>";
                        myJsValPresent += " <div class=\"goods-exe\">";
                        myJsValPresent += "     排序值:<b>" + HomePresentList[i].SortNum + "</b> <div onclick=\"openEditSortWin('" + HomePresentList[i].ShopShowID + "','Present','" + HomePresentGoodsList[i].PresentTitle + "','" + HomePresentList[i].SortNum + "')\">排序</div>";
                        if (HomePresentList[i].IsShow == "true") {
                            myJsValPresent += "<div onclick=\"tglIsShow('" + HomePresentList[i].ShopShowID + "', 'false')\">隐藏</div>"
                        }
                        else {
                            myJsValPresent += "<div onclick=\"tglIsShow('" + HomePresentList[i].ShopShowID + "', 'true')\">显示</div>"
                        }
                        myJsValPresent += "<div onclick=\"delShopShowMsgArr('" + HomePresentList[i].ShopShowID + "')\">删除</div>"
                        myJsValPresent += " </div>";
                        myJsValPresent += "</li>";
                    }
                }
                myJsValPresent += "<li class=\"goods-item-li goods-item-li-add\" onclick=\"openAddWin(\'Present\')  \">";
                myJsValPresent += " <div class=\"goods-msg goods-msg-btn-add\">";
                myJsValPresent += "     添加商品";
                myJsValPresent += " </div>";
                myJsValPresent += " <div class=\"goods-exe\">";
                myJsValPresent += "     排序值:<b>1</b> <div>排序</div> <div>显示</div> <div>删除</div>";
                myJsValPresent += " </div>";
                myJsValPresent += "</li>";
                //显示代码插入前台
                $("#HomePresentUl").html(myJsValPresent);


                //初始化浏览效果按钮
                goPreShopIndex();

            }
            else {

            }
        },
        error: function (xhr, errorTxt, status) {
            console.log("异步请求错误，errorTxt=" + errorTxt + " | status=" + status);
            return;
        }
    });


}

/**
 * 更改排序值
 * @param {any} pShopShowID 店铺展示信息ID
 * @param {any} pSortNum 排序值，数值越大越排前
 */
function chgSortNum(pShopShowID) {

    //获取表单值
    var SortNumWin = $("#SortNumWin").val().trim();
    if (SortNumWin == "") {
        SortNumWin = "1";
    }

    //构造POST参数
    var dataPOST = {
        "Type": "4", "ShopShowID": pShopShowID, "SortNum": SortNumWin
    };
    console.log(dataPOST);

    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: mAjaxUrl + "?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("更改排序值=" + reTxt);
            if (reTxt != "") {
                var _jsonReTxt = JSON.parse(reTxt);

                if (_jsonReTxt.ErrMsg != "" && _jsonReTxt.ErrMsg != undefined && _jsonReTxt.ErrMsg != null) {
                    toastWinToDiv(_jsonReTxt.ErrMsg, "dragWinDiv");
                    return;
                }

                if (_jsonReTxt.Msg != "" && _jsonReTxt.Msg != undefined && _jsonReTxt.Msg != null) {
                    //关闭窗口
                    closeDialogWin();
                    //重新加载数据
                    initShopShowMsg();
                    return;
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
 * 切换是否显示
 * @param {any} pShopShowID
 * @param {any} pIsShow 是否显示 ( false / true )
 */
function tglIsShow(pShopShowID, pIsShow) {

    //构造POST参数
    var dataPOST = {
        "Type": "5", "ShopShowID": pShopShowID, "IsShow": pIsShow
    };
    console.log(dataPOST);

    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: mAjaxUrl + "?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("更改排序值=" + reTxt);
            if (reTxt != "") {
                var _jsonReTxt = JSON.parse(reTxt);

                if (_jsonReTxt.ErrMsg != "" && _jsonReTxt.ErrMsg != undefined && _jsonReTxt.ErrMsg != null) {
                    toastWin(_jsonReTxt.ErrMsg);
                    return;
                }

                if (_jsonReTxt.Msg != "" && _jsonReTxt.Msg != undefined && _jsonReTxt.Msg != null) {

                    toastWin(_jsonReTxt.Msg);
                    //重新加载数据
                    initShopShowMsg();
                    return;
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
 * 删除店铺展示信息
 * @param {any} pShopShowIDArr 店铺展示信息ID 拼接字符串 "^" 连接
 */
function delShopShowMsgArr(pShopShowIDArr) {

    confirmWinWidth("确定要删除吗？", function () {

        //构造POST参数
        var dataPOST = {
            "Type": "6", "ShopShowIDArr": pShopShowIDArr,
        };
        console.log(dataPOST);

        //正式发送异步请求
        $.ajax({
            type: "POST",
            url: mAjaxUrl + "?rnd=" + Math.random(),
            data: dataPOST,
            dataType: "html",
            success: function (reTxt, status, xhr) {
                console.log("删除店铺展示信息=" + reTxt);
                if (reTxt != "") {
                    var _jsonReTxt = JSON.parse(reTxt);

                    if (_jsonReTxt.ErrMsg != "" && _jsonReTxt.ErrMsg != undefined && _jsonReTxt.ErrMsg != null) {
                        toastWin(_jsonReTxt.ErrMsg);
                        return;
                    }

                    if (_jsonReTxt.Msg != "" && _jsonReTxt.Msg != undefined && _jsonReTxt.Msg != null) {

                        //toastWin(_jsonReTxt.Msg);
                        //重新加载数据
                        initShopShowMsg();
                        return;
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

/**
 * 切换全部 - 店铺展示信息是否显示
 * @param {any} pIsShow 是否显示 ( false / true )
 * @param {any} pShowType  
 */
function tglAllIsShow(pIsShow, pShowType) {

    //构造POST参数
    var dataPOST = {
        "Type": "7", "IsShow": pIsShow, "ShowType": pShowType,
    };
    console.log(dataPOST);

    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: mAjaxUrl + "?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("切换全部-店铺展示信息是否显示=" + reTxt);
            if (reTxt != "") {
                var _jsonReTxt = JSON.parse(reTxt);

                if (_jsonReTxt.ErrMsg != "" && _jsonReTxt.ErrMsg != undefined && _jsonReTxt.ErrMsg != null) {
                    toastWin(_jsonReTxt.ErrMsg);
                    return;
                }

                if (_jsonReTxt.Msg != "" && _jsonReTxt.Msg != undefined && _jsonReTxt.Msg != null) {

                    toastWin(_jsonReTxt.Msg);

                    //重新加载数据
                    initShopShowMsg();

                    return;
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
 * 置顶栏目 
 * @param {any} pShowType 展示的类型 (Home_Discount 店铺首页打折显示，Home_Group 店铺首页团购，Home_Commend 店铺首页商家推荐，Home_Present 店铺首页礼品领取，)
 */
function goTopSortNumSection(pShowType) {

    confirmWinWidth("确认要置顶显示吗？", function () {

        //构造POST参数
        var dataPOST = {
            "Type": "8", "ShowType": pShowType,
        };
        console.log(dataPOST);

        //正式发送异步请求
        $.ajax({
            type: "POST",
            url: mAjaxUrl + "?rnd=" + Math.random(),
            data: dataPOST,
            dataType: "html",
            success: function (reTxt, status, xhr) {
                console.log("置顶栏目=" + reTxt);
                if (reTxt != "") {
                    var _jsonReTxt = JSON.parse(reTxt);

                    if (_jsonReTxt.ErrMsg != "" && _jsonReTxt.ErrMsg != undefined && _jsonReTxt.ErrMsg != null) {
                        toastWin(_jsonReTxt.ErrMsg);
                        return;
                    }

                    if (_jsonReTxt.Msg != "" && _jsonReTxt.Msg != undefined && _jsonReTxt.Msg != null) {

                        //重新加载数据
                        initShopShowMsg();

                        toastWinCb(_jsonReTxt.Msg, function () {

                            document.body.scrollTop = document.documentElement.scrollTop = 0;

                        });

                        return;
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

/**
 * 浏览效果
 * */
function goPreShopIndex() {

    $("button[name='PreShopBtn']").on("click", function () {

        window.open(mOctWapWeb_AddrDomain + "/Shop/IndexPreMobileIframe?SID=" + mShopID);

    });

}