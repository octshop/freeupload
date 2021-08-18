//===================发布商品====================//

/**-----定义公共变量------**/

//AjaxURL
var mAjaxUrl = "../Goods/GoodsMsg";

//添加规格，价格，库存窗口Html
var mPriceSpecWinHtml = "";

//信息ID 商品ID
var mMsgID = "0";

//判断是否有规格属性
var mIsHasSpecProp = false;

//商家UserID
var mUserID = "";
//规格标题
var mSpecTitle = "";
//属性标题
var mPropTitle = "";

//存储规格，价格，库存的字符串数组 
var mGoodsSpecPriceStockArr = "";
var mGoodsSpecTitle = ""; //规格标题
var mGoodsPropTitle = ""; //属性标题

//初始化上传插件的字符串数组  SpecIndex ~ PropIndex~ PropIndex ^ SpecIndex ~ PropIndex~ PropIndex [1~1~2 ^ 2~1~2]
var mInitUploadSpecPriceArr = "";

//规格属性价格库存 Json对象列表
var mJsonArrSpecProp = "";



/******数据分页的变量********/
var strPOSTSe = ""; //搜索条件对象 POST参数
var intPageCurrent = 1; //当前页
var pageSize = 15; //当页的记录条数，与后台保持一致
var recordSum = 0; //总记录数
var tableColNum = 10; //当前表列数

/**------初始化------**/
$(function () {

    //初始化规格价格库存窗口显示代码
    initPriceSpecWinHtml();

    //初始化加载
    searchContent();

    //搜索按钮单击事件
    $("#btnSearch").click(function () {
        searchContent();
    });

});


/*
---------定义搜索函数---------
*/
var searchContent = function () {

    intPageCurrent = 1; //开始页

    var GoodsID_se = $("#GoodsID_se").val().trim();
    var GoodsTitle_se = $("#GoodsTitle_se").val().trim();
    var GoodsStatus_se = $("#GoodsStatus_se").val().trim();
    var IsSpecParam_se = $("#IsSpecParam_se").val().trim();
    var IsUnSale_se = $("#IsUnSale_se").val().trim();
    var IsPayDelivery_se = $("#IsPayDelivery_se").val().trim();
    var IsShopExpense_se = $("#IsShopExpense_se").val().trim();
    var IsDistri_se = $("#IsDistri_se").val().trim();
    var WriteDate_se = $("#WriteDate_se").val().trim();


    //构造POST参数
    var strPOST = {
        "pageCurrent": "1", "Type": "1",
    };

    //翻页所用
    var strPOSTSePush = {
        "GoodsID": GoodsID_se, "GoodsTitle": GoodsTitle_se, "GoodsStatus": GoodsStatus_se,
        "IsSpecParam": IsSpecParam_se, "IsUnSale": IsUnSale_se, "IsPayDelivery": IsPayDelivery_se, "IsShopExpense": IsShopExpense_se, "IsDistri": IsDistri_se,
        "WriteDate": WriteDate_se
    };
    //将对象添加到分类对象中

    //搜索内容用
    var strPOSTSeContent = pushTwoObject(strPOST, strPOSTSePush);

    //分页操作用
    var strPOSTSearch = { "Type": "1" };
    strPOSTSe = pushTwoObject(strPOSTSearch, strPOSTSePush);
    console.log(strPOSTSe);

    //加载提示
    $("#TbodyTrPage").html("<tr><td colspan=\"" + tableColNum + "\">… 数据加载中 …</td></tr>");

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
                //加载提示
                $("#TbodyTrPage").html("<tr><td colspan=\"" + tableColNum + "\">没有搜索到相关数据</td></tr>");
            }
        },
        error: function (xhr, errorTxt, status) {
            console.log("错误信息errorTxt=" + errorTxt + " | status=" + status);
            //alert("网络出现异常,请重试！");
        }

    });
};


//------------解析JSON数据 构造 前台显示代码--------------//
// pJsonTxt Json字符串
function jsonToXhtml(pJsonObject) {

    //将字符串转换成功JSON对象
    //var json = JSON.parse(pJsonTxt);
    var json = pJsonObject;

    //-----内容显示前台显示代码----//
    var myJsVal = "";    //循环构造    for (var i = 0; i < json.DataPage.length; i++) {

        var indexDataPage = json.DataPage[i];
        var indexDataPageExtra = json.DataPageExtra[i];

        //上架下架
        var _strIsUnSale = "true" //下架
        var _strIconUnSale = "am-icon-arrow-circle-up";
        if (indexDataPage.IsUnSale == "true") {

            _strIsUnSale = "false"; //上传
            _strIconUnSale = "am-icon-arrow-circle-down";
        }

        if (indexDataPageExtra.IsStockEnough == "false") {
            indexDataPageExtra.IsStockEnough = "库存不足";
        }
        else {
            indexDataPageExtra.IsStockEnough = "";
        }

        if (indexDataPage.GoodsStatus == "售") {
            indexDataPage.GoodsStatus = "出售中";
        }
        else if (indexDataPage.GoodsStatus == "审") {
            indexDataPage.GoodsStatus = "<font color=\"red\">审核中</font>";
        }

        if (indexDataPage.IsUnSale == "false") {
            indexDataPage.IsUnSale = "否";
        }
        else {
            indexDataPage.IsUnSale = "<font color=\"red\">是</font>";
        }

        if (indexDataPage.IsPayDelivery == "false") {
            indexDataPage.IsPayDelivery = "否";
        }
        else {
            indexDataPage.IsPayDelivery = "是";
        }

        if (indexDataPage.IsShopExpense == "false") {
            indexDataPage.IsShopExpense = "快递";
        }
        else if (indexDataPage.IsShopExpense == "true") {
            indexDataPage.IsShopExpense = "到店";
        }
        else if (indexDataPage.IsShopExpense == "both") {
            indexDataPage.IsShopExpense = "到店和快递";
        }

        if (indexDataPage.IsDistri == "false") {
            indexDataPage.IsDistri = "否";
        }
        else {
            indexDataPage.IsDistri = "是";
        }

        //加载拼团，秒杀标签
        var _labelSpan = "";
        if (indexDataPageExtra.IsExistGroup == "True") {
            _labelSpan += "<span class=\"label-span\">拼团</span>";
        }
        if (indexDataPageExtra.IsExistSecKill == "True") {
            _labelSpan += "<span class=\"label-span\">秒杀</span>";
        }

        myJsVal += " <tr>";        myJsVal += "   <td><input type=\"checkbox\" name=\"SelCbItem\" id=\"SelCbItem_" + indexDataPage.GoodsID + "\" /></td>";        myJsVal += "   <td>" + indexDataPage.GoodsID + "";        if (indexDataPage.IsShopCommend == "true") {            myJsVal += " <font color=\"red\">荐</font>";
        }        myJsVal += "</td><td>";        if (indexDataPageExtra.IsExistGroup == "True") {            myJsVal += "<a href=\"" + $("#hidOctWapWeb_AddrDomain").val().trim() + "/Goods/GroupDetailPreMobileIframe?GID=" + indexDataPage.GoodsID + "\" target=\"_blank\">" + indexDataPage.GoodsTitle + _labelSpan + "</a>";
        }        else {            myJsVal += "<a href=\"" + $("#hidOctWapWeb_AddrDomain").val().trim() + "/Goods/GoodsDetailPreMobileIframe?GID=" + indexDataPage.GoodsID + "\" target=\"_blank\">" + indexDataPage.GoodsTitle + _labelSpan + "</a>";
        }        myJsVal += "   </td><td>" + indexDataPage.GoodsStatus + "</td>";        myJsVal += "   <td>" + indexDataPage.IsUnSale + "</td>";        myJsVal += "   <td>" + indexDataPage.IsPayDelivery + "</td>";        myJsVal += "   <td>" + indexDataPage.IsShopExpense + "</td>";        myJsVal += "   <td>" + indexDataPage.IsDistri + "</td>";        myJsVal += "   <td>" + indexDataPage.WriteDate + "</td>";        myJsVal += "   <td>";        myJsVal += "       <button class=\"table-btn am-btn am-btn-default am-btn-xs am-text-secondary am-round\" onclick=\"window.location.href='../GoodsPage/GoodsEdit?GID=" + indexDataPage.GoodsID + "'\"><span class=\"am-icon-pencil-square-o\"></span></button>";        myJsVal += "       <button class=\"table-btn am-btn am-btn-default am-btn-xs am-text-success am-round\" onclick=\"openPriceSpecWin(" + indexDataPage.GoodsID + ")\"><span class=\"am-icon-cny\"></span></button>";        myJsVal += "       <button class=\"table-btn am-btn am-btn-default am-btn-xs am-text-warning am-round\" onclick=\"unSaleGoods(" + indexDataPage.GoodsID + ", " + _strIsUnSale + ")\"><span class=\"" + _strIconUnSale + "\"></span></button>";        myJsVal += "   </td>";        myJsVal += "</tr>";        if (indexDataPageExtra.StatusHint != "") {            myJsVal += "<tr><td class=\"td-hint-status\" colspan=\"10\">" + indexDataPageExtra.StatusHint + "</td></tr>";
        }    }    //alert(myJsVal);    //-----分页控制条显示代码-------//    var pageBarXhtml = "";    pageBarXhtml += " <li><a href=\"javascript:void(0)\" onclick=\"PrePage()\">«</a></li>";    pageBarXhtml += " <li><a href=\"javascript:void(0)\" onclick=\"NumberPage('1')\">1</a></li>";    pageBarXhtml += "  <li><span>...</span></li>";    if ((intPageCurrent - 2) > 0) {
        pageBarXhtml += "  <li><a href=\"javascript:void(0)\" onclick=\"NumberPage('" + (intPageCurrent - 2) + "')\">" + (intPageCurrent - 2) + "</a></li>";
    }    if ((intPageCurrent - 1) > 0) {
        pageBarXhtml += "  <li><a href=\"javascript:void(0)\" onclick=\"NumberPage('" + (intPageCurrent - 1) + "')\">" + (intPageCurrent - 1) + "</a></li>";
    }    pageBarXhtml += "  <li class=\"am-active\"><a href=\"javascript:void(0)\" onclick=\"NumberPage('" + json.PageCurrent + "')\">" + json.PageCurrent + "</a></li>";    //console.log(parseInt(json.PageSum));    if ((intPageCurrent + 1) <= parseInt(json.PageSum)) {
        pageBarXhtml += "  <li><a href=\"javascript:void(0)\" onclick=\"NumberPage('" + (intPageCurrent + 1) + "')\">" + (intPageCurrent + 1) + "</a></li>";
    }    if ((intPageCurrent + 2) <= parseInt(json.PageSum)) {
        pageBarXhtml += "  <li><a href=\"javascript:void(0)\" onclick=\"NumberPage('" + (intPageCurrent + 2) + "')\">" + (intPageCurrent + 2) + "</a></li>";
    }    pageBarXhtml += "  <li><span>...</span></li>";    pageBarXhtml += "  <li><a href=\"javascript:void(0)\" onclick=\"NumberPage('" + json.PageSum + "')\">" + json.PageSum + "</a></li>";    pageBarXhtml += "  <li><input type=\"number\" id=\"PageNumTxt\" class=\"page-go-text am-form-field\" placeholder=\"跳转页\" /></li>";    pageBarXhtml += "  <li><a href=\"javascript:void(0)\" onclick=\"NextPage()\">»</a></li>";    var _pageMsgArr = new Array()    //内容显示代码     _pageMsgArr[0] = myJsVal;    //控制条件显示代码    _pageMsgArr[1] = pageBarXhtml;    //返回数组    return _pageMsgArr;
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

    console.log("上一页intPageCurrent=" + intPageCurrent);

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

    console.log("下一页intPageCurrent=" + intPageCurrent);

    console.log("recordSum=" + recordSum);
    console.log("pageSize=" + pageSize);
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
    //构造GET参数
    strPOSTSe = pushTwoObject(strPOSTSe, { "pageCurrent": intPageCurrent });

    //加载提示
    $("#TbodyTrPage").html("<tr><td colspan=\"" + tableColNum + "\">… 数据加载中 …</td></tr>");

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
        $("#TbodyTrPage").html(_xhtmlArr[0]);
        //分页控制条
        $("#PageBar1").html(_xhtmlArr[1]);

        //滚动条回到顶部
        document.body.scrollTop = 0;


        //跳转页 获取当文本框获取了焦点，按了键盘事件
        $("#PageNumTxt").keydown(function (event) {
            //alert(event.keyCode);
            if (event.keyCode == "13") {

                //跳转方法
                gotoPage();

                return false;
            }
        });

        //全不选
        document.getElementById("SelAllCb").checked = false;

    }
    else {
        $("#TbodyTrPage").html("<tr><td colspan=\"" + tableColNum + "\">没有搜索到相关数据</td></tr>");
    }
}


//---------------------------跳转页---------------------//
function gotoPage() {

    var pageNum = $("#PageNumTxt").val()
    //判断输入的页数是否小于0
    if (parseInt(pageNum) <= 0) {
        toastWin("跳转的页数不能小于或等于0!");
        return;
    }

    //判断页输入框是否为空
    if (pageNum == "" || pageNum == null) {
        toastWin("请输入要跳转的页数！");
        return;
    }
    //判断输入的页是否为数字
    if (isNaN(pageNum)) {
        toastWin("跳转的页数必须是数字！");
        return;
    }

    //调用数据库函数
    NumberPage(pageNum);
}


//==================其他相关操作==================//

/**
 * 上架下载切换
 * @param {any} pGoodsID 商品ID
 * @param pIsUnSale 是否下架 ( false/true )
 */
function unSaleGoods(pGoodsID, pIsUnSale) {

    console.log("pIsUnSale=" + pIsUnSale);

    var _hintTxt = "";
    if (pIsUnSale == true) {
        _hintTxt = "下架";
    }
    else {
        _hintTxt = "上架";
    }

    confirmWinWidth("确定要【" + _hintTxt + "】吗？", function () {

        //构造POST参数
        var dataPOST = {
            "Type": "2", "GoodsID": pGoodsID, "IsUnSale": pIsUnSale
        };
        console.log(dataPOST);

        //正式发送异步请求
        $.ajax({
            type: "POST",
            url: mAjaxUrl + "?rnd=" + Math.random(),
            data: dataPOST,
            dataType: "html",
            success: function (reTxt, status, xhr) {
                console.log(reTxt);
                if (reTxt != "") {
                    var _jsonReTxt = JSON.parse(reTxt);

                    if (_jsonReTxt.Msg != null) {
                        toastWin(_jsonReTxt.Msg);

                        //重新加载数据
                        NumberPage(intPageCurrent)
                        return;
                    }

                    if (_jsonReTxt.ErrMsg != null) {

                        toastWin(_jsonReTxt.ErrMsg);
                    }

                }
            }
        });

    }, 400);
}


/**
 * 全选与全不选
 */
function toggleSelAll() {

    //获取所有的Select控件
    var _selectItemArr = document.getElementsByName("SelCbItem");

    //全选与全不先的Select控件
    var isAllCheck = document.getElementById("SelAllCb").checked;
    console.log(isAllCheck);
    if (isAllCheck) //全选
    {
        for (var i = 0; i < _selectItemArr.length; i++) {
            _selectItemArr[i].checked = true;
        }
    }
    else {
        for (var i = 0; i < _selectItemArr.length; i++) {
            _selectItemArr[i].checked = false;
        }
    }
}

/**
 * 获取全选与全不选控件信息ID值数组
* return  23434^234324^254354
 */
function getSelectValArr() {

    //获取所有的Select控件
    var _selectItemArr = document.getElementsByName("SelCbItem");

    //定义数组
    var _msgIdArr = new Array();
    //定义数组索引
    var _arrIndex = 0;

    //循环获取MsgID
    for (var i = 0; i < _selectItemArr.length; i++) {
        var _msgID = _selectItemArr[i].id.replace("SelCbItem_", "");
        //console.log(_msgID);
        if (_selectItemArr[i].checked) {
            _msgIdArr[_arrIndex] = _msgID;
            _arrIndex++
        }
    }
    // console.log("_msgIdArr=" + _msgIdArr);

    return _msgIdArr.join("^");
}

/**
 * 批量删除信息
 */
function delMsgArr() {

    //获取全选与全不选控件信息ID值数组
    var MsgIDArr = getSelectValArr();
    console.log("MsgIDArr=" + MsgIDArr);

    if (MsgIDArr == "") {
        toastWin("请选择要删除的信息！");
        return;
    }

    confirmWinWidth("确定要删除吗？无法恢复！", function () {

        //构造POST参数
        var dataPOST = {
            "Type": "6", "GoodsIDArr": MsgIDArr,
        };
        console.log(dataPOST);

        //正式发送异步请求
        $.ajax({
            type: "POST",
            url: mAjaxUrl + "?rnd=" + Math.random(),
            data: dataPOST,
            dataType: "html",
            success: function (reTxt, status, xhr) {
                console.log(reTxt);
                if (reTxt != "") {
                    var _jsonReTxt = JSON.parse(reTxt);

                    if (_jsonReTxt.Msg != "" && _jsonReTxt.Msg != null && _jsonReTxt.Msg != undefined) {
                        toastWin(_jsonReTxt.Msg);

                        //重新加载数据
                        NumberPage(intPageCurrent)
                        return;
                    }

                    if (_jsonReTxt.ErrMsg != "" && _jsonReTxt.ErrMsg != null && _jsonReTxt.ErrMsg != undefined) {
                        toastWin(_jsonReTxt.ErrMsg);
                    }

                }
            }
        });

    }, 400);
}

/**
 * 批量切换 - 商家是否推荐商品
 * @param {any} pIsShopCommend 商家是否推荐些商品 ( false / true
 */
function tglGoodsShopCommendArr(pIsShopCommend) {

    //获取全选与全不选控件信息ID值数组
    var MsgIDArr = getSelectValArr();
    console.log("MsgIDArr=" + MsgIDArr);

    if (MsgIDArr == "") {
        toastWin("请选择操作的信息！");
        return;
    }

    //构造POST参数
    var dataPOST = {
        "Type": "5", "GoodsIDArr": MsgIDArr, "IsShopCommend": pIsShopCommend,
    };
    console.log(dataPOST);

    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: mAjaxUrl + "?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log(reTxt);
            if (reTxt != "") {
                var _jsonReTxt = JSON.parse(reTxt);

                if (_jsonReTxt.ErrMsg != null && _jsonReTxt.ErrMsg != undefined && _jsonReTxt.ErrMsg != "") {
                    toastWin(_jsonReTxt.ErrMsg);
                    return;
                }

                if (_jsonReTxt.Code != "" && _jsonReTxt.Code != null && _jsonReTxt.Code != undefined) {

                    toastWin(_jsonReTxt.Msg);

                    //重新加载数据
                    NumberPage(intPageCurrent)
                    return;
                }



            }
        }
    });

}

//===================弹出窗口相关===================//

/**
 * 初始化规格价格库存窗口显示代码
 */
function initPriceSpecWinHtml() {
    //获取窗口显示代码
    mPriceSpecWinHtml = $("#GoodsPriceSpecWin").html();
    $("#GoodsPriceSpecWin").empty();
}


/**
 * 打开规格价格库存窗口
 */
function openPriceSpecWin(pGoodsID) {

    mMsgID = pGoodsID;

    //打开Dialog弹出窗口
    openCustomDialogWinNoClose("编辑规格价格库存", mPriceSpecWinHtml, 750, function () {

        //添加规格项
        //addSpecItem();

    }, function () {
        //[保存]规格
        //alert("[保存]规格");
        //saveGooSpecParamPre();

        //关闭窗口
        //closeCustomDialogWin();

    });

    //初始化初始化 商品规格属性总标题
    initGooSpecParamName(pGoodsID, function () {

        //初始化规格属性窗口信息
        initSpecPropFormWin();

    });
}

/**
 * 添加规格项
 * */
function addSpecItem() {

    //得到当前有多少规格项
    var _nameSpecNameCount = document.getElementsByName("name_SpecName").length;
    console.log("nameSpecNameCount=" + _nameSpecNameCount);
    //alert("nameSpecNameCount=" + _nameSpecNameCount);

    //下一个Item的索引
    var _indexItem = _nameSpecNameCount + 1;
    //构造显示代码
    var myJsVal = "";
    myJsVal += "                        <div class=\"goods-pricespec-item\">";
    myJsVal += "                            <div class=\"pricespec-item-title\">";
    myJsVal += "                                <label>规格" + _indexItem + "：</label>";
    myJsVal += "                                <span>名称</span><input id=\"id_SpecName_" + _indexItem + "\" name=\"name_SpecName\" data-SpecID=\"0\" type=\"text\" class=\"spec-name-txt\" />";

    myJsVal += "<div id=\"id_SpecPriceStock_" + _indexItem + "\"><span>价格</span><input id=\"id_SpecPrice_" + _indexItem + "\" name=\"name_SpecPrice\" type=\"number\" class=\"spec-title-pricestock spec-name-txt\" spec-name-txt\" />";
    myJsVal += "                                <span>库存</span><input id=\"id_SpecStock_" + _indexItem + "\" name=\"name_SpecStock\" type=\"number\" class=\"spec-title-pricestock spec-name-txt\" /></div>";

    myJsVal += "                                <img id=\"id_SpecPropImg_" + _indexItem + "\"  class=\"pricespec-pre-img\" src=\"../Assets/Imgs/Icon/icon_spec_default.png\" />";
    myJsVal += "                                <div class=\"am-form-group am-form-file\">";
    myJsVal += "                                    <button type=\"button\" class=\"am-btn am-btn-default am-btn-xs am-round\">";
    myJsVal += "                                        <i class=\"am-icon-cloud-upload\"></i> 规格图片(可选)";
    myJsVal += "                                    </button>";
    myJsVal += "                                    <input id=\"id_SpecPropUpload_" + _indexItem + "\" name=\"name_SpecUpload\" type=\"file\">";
    myJsVal += "<input type=\"hidden\" id=\"id_SpecPropUploadValArr_" + _indexItem + "\" name=\"name_SpecUploadValArr\" value=\"\" />";
    myJsVal += "                                </div>";
    myJsVal += "                            </div>";
    myJsVal += "                            <div class=\"pricespec-prop-list\" id=\"id_PropList_" + _indexItem + "\">";

    myJsVal += "                            </div>";
    myJsVal += "                            <div class=\"pricespec-prop-add\">";
    myJsVal += "                                <div class=\"btn-prop-add\" onclick=\"addPropItem(" + _indexItem + ")\">添加属性</div>";
    myJsVal += "                                <div onclick=\"removePropItem(" + _indexItem + ")\">删除属性</div>";
    myJsVal += "                            </div>";
    myJsVal += "                        </div>";

    //显示代码追加前台 
    $("#GoodsPriceSpecList").append(myJsVal);

    //滚动条滚到最后
    $("#GoodsPriceSpecForm").animate({ scrollTop: $("#GoodsPriceSpecForm").prop("scrollHeight") }, 400);

    //初始化指定索引的规格属性上传插件
    initSpecPropUploadFile(_indexItem);
}

/**
 * 添加属性项
 * @param {any} pSpecItemIndex 规格项的索引
 * @param {any} pFatherSpecID 父级规格ID ( 如果为 0 则为【规格名称】 否则为 【规格属性】 )
 */
function addPropItem(pSpecItemIndex, pFatherSpecID) {

    if (pFatherSpecID == undefined || pFatherSpecID == "") {
        pFatherSpecID = "0";
    }

    //得到当前规格项有多少属性项
    var _namePropNameCount = document.getElementsByName("name_PropName_" + pSpecItemIndex).length;
    console.log("_namePropNameCount=" + _namePropNameCount);
    //alert("_namePropNameCount=" + _namePropNameCount);
    //下一个Item的索引
    var _indexPropItem = _namePropNameCount + 1;
    //alert("_indexPropItem=" + _indexPropItem);

    //构造显示代码
    var myJsVal = "";
    myJsVal += "<div class=\"pricespec-prop-item\">";
    myJsVal += "                                    <span>属性名称</span><input id=\"id_PropName_" + pSpecItemIndex + "_" + _indexPropItem + "\" name=\"name_PropName_" + pSpecItemIndex + "\" data-SpecID=\"0\" data-FatherSpecID=\"" + pFatherSpecID + "\" type=\"text\" class=\"spec-prop-name-txt spec-name-txt\" />";
    myJsVal += "                                    <span>价格</span><input id=\"id_PropPrice_" + pSpecItemIndex + "_" + _indexPropItem + "\" name=\"name_PropPrice_" + pSpecItemIndex + "\" type=\"number\" class=\"spec-name-txt\" />";
    myJsVal += "                                    <span>库存</span><input id=\"id_PropStock_" + pSpecItemIndex + "_" + _indexPropItem + "\" name=\"name_PropStock_" + pSpecItemIndex + "\" type=\"number\" class=\"spec-name-txt\" />";
    myJsVal += "                                    <img id=\"id_SpecPropImg_" + pSpecItemIndex + "_" + _indexPropItem + "\" class=\"pricespec-pre-img\" src=\"../Assets/Imgs/Icon/icon_spec_default.png\" />";
    myJsVal += "                                    <div class=\"am-form-group am-form-file\">";
    myJsVal += "                                        <button type=\"button\" class=\"am-btn am-btn-default am-btn-xs am-round\">";
    myJsVal += "                                            <i class=\"am-icon-cloud-upload\"></i> 属性图片(可选)";
    myJsVal += "                                        </button>";
    myJsVal += "                                        <input id=\"id_SpecPropUpload_" + pSpecItemIndex + "_" + _indexPropItem + "\" name=\"name_PropUpload_" + pSpecItemIndex + "\" type=\"file\">";

    myJsVal += "<input type=\"hidden\" id=\"id_SpecPropUploadValArr_" + pSpecItemIndex + "_" + _indexPropItem + "\" name=\"name_PropUploadValArr_" + pSpecItemIndex + "\" value=\"\" />";

    myJsVal += "                                    </div>";
    myJsVal += "                                </div>";

    //显示代码追加前台
    $("#id_PropList_" + pSpecItemIndex + "").append(myJsVal);

    //关掉规格的价格和库存
    $("#id_SpecPriceStock_" + pSpecItemIndex).hide();

    //初始化指定索引的规格属性上传插件
    initSpecPropUploadFile(pSpecItemIndex, _indexPropItem);
}

/**
 * 初始化指定索引的规格属性上传插件
 * @param {any} pSpecItemIndex 规格项的索引
 * @param {any} pPropItemIndex 属性项的索引 为“” 则上传规格图片
 */
function initSpecPropUploadFile(pSpecItemIndex, pPropItemIndex) {

    console.log("pSpecItemIndex=" + pSpecItemIndex + " | pPropItemIndex=" + pPropItemIndex);
    //alert("pSpecItemIndex=" + pSpecItemIndex + " | pPropItemIndex=" + pPropItemIndex);

    //if (mUserID == "0" || mUserID == "") {
    //    return;
    //}

    //构造上传控件的ID字符串
    var _uploadIDstr = "id_SpecPropUpload_" + pSpecItemIndex;
    if (pPropItemIndex != "" && pPropItemIndex != undefined) {
        _uploadIDstr += "_" + pPropItemIndex;
    }

    //构造POST参数
    var _dataPost = "Type=1&UserID=" + mUserID;
    console.log(_dataPost);

    $('#' + _uploadIDstr).fileupload({
        url: "../FileUpload/GooSpecParamImg?" + _dataPost + "&rnd=" + Math.random(),
        //dataType: 'json',
        dataType: "text",
        //------------处理上传成功后的事件------------//
        done: function (e, data) {

            //关闭加载提示
            closeLoadingWin();

            //-------------此处是返回后后台文件输出的内容----------------//
            console.log(data.result);
            //alert(data.result);
            //对象化JSON字符串
            var _JsonObj = JSON.parse(data.result);

            //操作错误提示
            if (_JsonObj.ErrCode != null) {
                toastWin(_JsonObj.ErrMsg);
                return;
            }

            mImgKeyGuid = _JsonObj.DataDic.ImgKeyGuid;
            mImgPathDomain = _JsonObj.DataDic.ImgPathDomain;
            console.log("mImgKeyGuid=" + mImgKeyGuid + " | mImgPathDomain=" + mImgPathDomain);
            //alert("mImgKeyGuid=" + mImgKeyGuid + " | mImgPathDomain=" + mImgPathDomain);
            //mImgKeyGuid=91318a05-a4c0-4ff8-95ad-17117eccb7d1 | mImgPathDomain=localhost:1400/Upload/GooSpecParamImg/GSPI_1_201907121414565670.jpg

            //构造隐藏控件的ID字符串
            var _uploadHideIDstr = "id_SpecPropUploadValArr_" + pSpecItemIndex;
            if (pPropItemIndex != "" && pPropItemIndex != undefined) {
                _uploadHideIDstr += "_" + pPropItemIndex;
            }
            //为隐藏控件赋值上传图片信息
            $("#" + _uploadHideIDstr).val(mImgKeyGuid + "~" + mImgPathDomain);

            //构造图片显示控件的ID字符串
            var _uploadSpecPropImgIDstr = "id_SpecPropImg_" + pSpecItemIndex;
            if (pPropItemIndex != "" && pPropItemIndex != undefined) {
                _uploadSpecPropImgIDstr += "_" + pPropItemIndex;
            }
            //为图标赋值
            $("#" + _uploadSpecPropImgIDstr).attr("src", "//" + mImgPathDomain);

        },

        //---------------处理上传进度的方法-------------//
        progressall: function (e, data) {

            console.log("progressall 执行");

            var progress = parseInt(data.loaded / data.total * 100, 10);
            $('#progress').css(
                'width',
                progress + '%'
            );

            //输出进度
            console.log("上传的进度：" + progress);

            if (progress >= 100) {
                //alert("上传成功！");
            }


        }
    }).prop('disabled', !$.support.fileInput)
        .parent().addClass($.support.fileInput ? undefined : 'disabled').on('fileuploadadd', function (e, data) {

            console.log("添加了文件");
            //显示加载提示
            loadingWinToDiv("dragCustomWinDiv");

        });
}

/**
 * 移除最后一个 属性项
 * @param {any} pSpecItemIndex 规格项索引
 */
function removePropItem(pSpecItemIndex) {

    $("#id_PropList_" + pSpecItemIndex + " .pricespec-prop-item:last").remove();
    //(".index li:last").remove()

    //得到当前规格项有多少属性项
    var _namePropNameCount = document.getElementsByName("name_PropName_" + pSpecItemIndex).length;
    console.log("_namePropNameCount=" + _namePropNameCount);

    if (_namePropNameCount <= 0) {
        //显示规格的价格和库存
        $("#id_SpecPriceStock_" + pSpecItemIndex).show();
    }
}

/**
 * 保存 规格，价格，库存窗口
 * */
function saveGooSpecParamPre() {

    //信息Guid 与发布商品MsgGuid相关联
    mGoodsMsgGuid = $("#hidGoodsMsgGuid").val().trim();

    //清除储存值
    mGoodsSpecPriceStockArr = "";

    //规格项数组
    var name_SpecNameArr = $("input[name='name_SpecName']");
    var name_SpecPriceArr = $("input[name='name_SpecPrice']");
    var name_SpecStockArr = $("input[name='name_SpecStock']");
    //这个控件存储的值为 【ImgKeyGuid~ImgURL】 
    var name_SpecUploadValArr = $("input[name='name_SpecUploadValArr']");

    //判断是否添加了规格
    if (name_SpecNameArr.length <= 0) {
        //关闭窗口
        closeCustomDialogWin();
        return;
    }

    //标记是否有规格，是否有属性
    var _isHasSpec = false;
    var _isHasProp = false;

    //判断是否输入了规格和属性标题
    var SpecTitleTxt = $("#SpecTitleTxt").val().trim();
    if (SpecTitleTxt == "") {
        toastWinToDiv("【规格标题】不能为空！", "dragCustomWinDiv");
        $("#SpecTitleTxt").focus();
        return;
    }
    else {
        mGoodsSpecTitle = SpecTitleTxt;
    }
    var SpecAttrNameTxt = $("#SpecAttrNameTxt").val().trim();
    //得到第一项属性值
    var _propNameLabelVal = $($("input[name='name_PropName_1']")[0]).val();
    //console.log(_propNameLabelVal);
    if (SpecAttrNameTxt == "" && _propNameLabelVal != undefined) {
        toastWinToDiv("【属性标题】不能为空！", "dragCustomWinDiv");
        $("#SpecAttrNameTxt").focus();
        return;
    }
    else {
        mGoodsPropTitle = SpecAttrNameTxt;
    }

    //循环取规格项的属性值数组
    for (var i = 0; i < name_SpecNameArr.length; i++) {

        //规格项的索引从1开始
        var _specIndex = i + 1;

        //获取当前规格项的值
        var val_SpecName = $(name_SpecNameArr[i]).val().trim();
        var val_SpecPrice = $(name_SpecPriceArr[i]).val().trim();
        var val_SpecStock = $(name_SpecStockArr[i]).val().trim();
        var val_SpecUploadValArr = $(name_SpecUploadValArr[i]).val().trim();
        console.log("val_SpecName=" + val_SpecName + " | val_SpecPrice=" + val_SpecPrice + " | val_SpecStock=" + val_SpecStock + " | val_SpecUploadValArr=" + val_SpecUploadValArr);
        //alert("val_SpecName=" + val_SpecName + " | val_SpecPrice=" + val_SpecPrice + " | val_SpecStock=" + val_SpecStock + " | val_SpecUploadValArr=" + val_SpecUploadValArr);

        //属性项数组
        var name_PropNameArr = $("input[name='name_PropName_" + _specIndex + "']");
        var name_PropPriceArr = $("input[name='name_PropPrice_" + _specIndex + "']");
        var name_PropStockArr = $("input[name='name_PropStock_" + _specIndex + "']");
        //这个控件存储的值为 【ImgKeyGuid~ImgURL】 
        var name_PropUploadValArr = $("input[name='name_PropUploadValArr_" + _specIndex + "']");

        //构造规格项拼接字符串
        if (name_PropNameArr.length <= 0 && val_SpecName != "" && val_SpecPrice != "" && val_SpecStock != "" && parseFloat(val_SpecPrice) > 0 && parseFloat(val_SpecStock) > 0) {

            //判断价格和库存是否为数字
            if (checkNumber(val_SpecPrice) == false || isNaN(val_SpecStock)) {
                toastWinToDiv("规格【价格】和【库存】必须是数字！", "dragCustomWinDiv");
                return;
            }

            //储存规格价格库存值 
            mGoodsSpecPriceStockArr += val_SpecName + "~" + val_SpecPrice + "~" + val_SpecStock + "~" + val_SpecUploadValArr;
        }
        else if (name_PropNameArr.length > 0 && val_SpecName != "") {
            //储存规格价格库存值 
            mGoodsSpecPriceStockArr += val_SpecName + "~" + val_SpecUploadValArr;
        }
        else {
            //继续循环
            continue;
        }

        //标记为有规格
        if (_isHasSpec == false) {
            _isHasSpec = true;
        }

        if (name_PropNameArr.length > 0) {
            mGoodsSpecPriceStockArr += "$";
        }

        //循环取属性项的值 拼接数组
        for (var j = 0; j < name_PropNameArr.length; j++) {

            var val_PropName = $(name_PropNameArr[j]).val().trim();
            var val_PropPrice = $(name_PropPriceArr[j]).val().trim();
            var val_PropStock = $(name_PropStockArr[j]).val().trim();
            var val_PropUploadValArr = $(name_PropUploadValArr[j]).val().trim();

            //判断价格和库存是否为数字
            if (checkNumber(val_PropPrice) == false || val_PropPrice == "" || isNaN(val_PropStock) || val_PropStock == "") {
                toastWinToDiv("属性【价格】和【库存】必须是数字！", "dragCustomWinDiv");
                return;
            }
            if (parseFloat(val_PropPrice) <= 0 || parseFloat(val_PropStock) <= 0) {
                toastWinToDiv("属性【价格】和【库存】必须大于0！", "dragCustomWinDiv");
                return;
            }

            if (val_PropName != "" && val_PropPrice != "" && val_PropStock != "" && parseFloat(val_PropPrice) > 0 && parseFloat(val_PropStock) > 0) {

                //储存规格价格库存
                mGoodsSpecPriceStockArr += val_PropName + "~" + val_PropPrice + "~" + val_PropStock + "~" + val_PropUploadValArr + "|";

                //标记为有属性
                if (_isHasProp == false) {
                    _isHasProp = true;
                }
            }
        }
        //去掉最后一个"|"
        mGoodsSpecPriceStockArr = removeFrontAndBackChar(mGoodsSpecPriceStockArr, "|");

        mGoodsSpecPriceStockArr += "^";

    }
    //去掉最后一个“^”
    mGoodsSpecPriceStockArr = removeFrontAndBackChar(mGoodsSpecPriceStockArr, "^");

    //输出规格价格库存
    //console.log("mGoodsSpecPriceStockArr=" + mGoodsSpecPriceStockArr);
    //alert("mGoodsSpecPriceStockArr=" + mGoodsSpecPriceStockArr);

    //当只有规格没有价格库存数时，返回
    if (mGoodsSpecPriceStockArr.indexOf("~$") >= (mGoodsSpecPriceStockArr.length - 2)) {
        mGoodsSpecPriceStockArr = "";
    }

    //--------------发送异步请求保存数据-----------------//
    //显示加载提示
    loadingWinToDiv("dragCustomWinDiv");

    //构造POST参数
    var dataPOST = {
        "Type": "2", "GoodsID": mMsgID, "GoodsSpecPriceStockArr": mGoodsSpecPriceStockArr, "SpecTitle": mGoodsSpecTitle, "SpecAttrName": mGoodsPropTitle,
    };
    console.log(dataPOST);

    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: "../Goods/GooSpecParam?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log(reTxt);
            //移除加载提示
            closeLoadingWin();

            if (reTxt != "") {
                var _jsonObj = JSON.parse(reTxt);
                if (_jsonObj.Msg != "") {

                    toastWinToDiv(_jsonObj.Msg, "dragCustomWinDiv");

                    //保存成功后的逻辑处理
                    mSpecTitle = $("#SpecTitleTxt").val().trim();
                    mPropTitle = $("#SpecAttrNameTxt").val().trim();

                    if (mGoodsSpecPriceStockArr == "") {
                        $("#GoodsSpecPropPriceStockNoDiv").show();
                        $("#GoodsSpecPropPriceStockDiv").hide();
                        $("#BtnDelAllSpecPropMsg").hide();
                    }
                    else {
                        $("#GoodsSpecPropPriceStockNoDiv").hide();
                        $("#GoodsSpecPropPriceStockDiv").show();
                        $("#BtnDelAllSpecPropMsg").show();
                    }

                    //关闭窗口
                    closeCustomDialogWin();

                }
                if (_jsonObj.ErrMsg != "") {
                    toastWinToDiv(_jsonObj.ErrMsg, "dragCustomWinDiv");
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
 * 保存 规格，价格，库存窗口  --优化后，不会删除重新插入啦
 * */
function saveGooSpecParam() {

    //构建保存规格属性所需的Json字符串
    var _gooSpecParamJson = buildGooSpecParamJson();
    if (_gooSpecParamJson == "" || _gooSpecParamJson == undefined) {
        return;
    }

    //--------------发送异步请求保存数据-----------------//
    //显示加载提示
    loadingWinToDiv("dragCustomWinDiv");

    //构造POST参数
    var dataPOST = {
        "Type": "4", "GoodsID": mMsgID, "GooSpecParamJson": escape(_gooSpecParamJson), "SpecTitle": mGoodsSpecTitle, "SpecAttrName": mGoodsPropTitle,
    };
    console.log(dataPOST);

    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: "../Goods/GooSpecParam?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log(reTxt);
            //移除加载提示
            closeLoadingWin();

            if (reTxt != "") {
                var _jsonObj = JSON.parse(reTxt);
                if (_jsonObj.Msg != "") {

                    toastWinToDiv(_jsonObj.Msg, "dragCustomWinDiv");

                    //保存成功后的逻辑处理
                    mSpecTitle = $("#SpecTitleTxt").val().trim();
                    mPropTitle = $("#SpecAttrNameTxt").val().trim();

                    if (mGoodsSpecPriceStockArr == "") {
                        $("#GoodsSpecPropPriceStockNoDiv").show();
                        $("#GoodsSpecPropPriceStockDiv").hide();
                        $("#BtnDelAllSpecPropMsg").hide();
                    }
                    else {
                        $("#GoodsSpecPropPriceStockNoDiv").hide();
                        $("#GoodsSpecPropPriceStockDiv").show();
                        $("#BtnDelAllSpecPropMsg").show();
                    }

                    //关闭窗口
                    closeCustomDialogWin();

                }
                if (_jsonObj.ErrMsg != "") {
                    toastWinToDiv(_jsonObj.ErrMsg, "dragCustomWinDiv");
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
 * 构建保存规格属性所需的Json字符串
 * */
function buildGooSpecParamJson() {

    var _jsonBack = "["; //返回的Json字符串

    //规格项数组
    var name_SpecNameArr = $("input[name='name_SpecName']");
    var name_SpecPriceArr = $("input[name='name_SpecPrice']");
    var name_SpecStockArr = $("input[name='name_SpecStock']");
    //这个控件存储的值为 【ImgKeyGuid~ImgURL】 
    var name_SpecUploadValArr = $("input[name='name_SpecUploadValArr']");

    //判断是否添加了规格
    if (name_SpecNameArr.length <= 0) {
        //关闭窗口
        closeCustomDialogWin();
        return;
    }

    //标记是否有规格，是否有属性
    var _isHasSpec = false;
    var _isHasProp = false;

    //判断是否输入了规格和属性标题
    var SpecTitleTxt = $("#SpecTitleTxt").val().trim();
    if (SpecTitleTxt == "") {
        toastWinToDiv("【规格标题】不能为空！", "dragCustomWinDiv");
        $("#SpecTitleTxt").focus();
        return;
    }
    else {
        mGoodsSpecTitle = SpecTitleTxt;
    }
    var SpecAttrNameTxt = $("#SpecAttrNameTxt").val().trim();
    //得到第一项属性值
    var _propNameLabelVal = $($("input[name='name_PropName_1']")[0]).val();
    //console.log(_propNameLabelVal);
    if (SpecAttrNameTxt == "" && _propNameLabelVal != undefined) {
        toastWinToDiv("【属性标题】不能为空！", "dragCustomWinDiv");
        $("#SpecAttrNameTxt").focus();
        return;
    }
    else {
        mGoodsPropTitle = SpecAttrNameTxt;
    }

    //循环取规格项的属性值数组
    for (var i = 0; i < name_SpecNameArr.length; i++) {

        //规格项的索引从1开始
        var _specIndex = i + 1;

        //获取当前规格项的值
        var val_SpecName = $(name_SpecNameArr[i]).val().trim();
        var val_SpecID = $(name_SpecNameArr[i]).attr("data-SpecID");
        var val_SpecPrice = $(name_SpecPriceArr[i]).val().trim();
        var val_SpecStock = $(name_SpecStockArr[i]).val().trim();
        var val_SpecUploadValArr = $(name_SpecUploadValArr[i]).val().trim();
        console.log("val_SpecName=" + val_SpecName + " | val_SpecID=" + val_SpecID + " | val_SpecPrice=" + val_SpecPrice + " | val_SpecStock=" + val_SpecStock + " | val_SpecUploadValArr=" + val_SpecUploadValArr);
        //alert("val_SpecName=" + val_SpecName + " | val_SpecPrice=" + val_SpecPrice + " | val_SpecStock=" + val_SpecStock + " | val_SpecUploadValArr=" + val_SpecUploadValArr);

        //属性项数组
        var name_PropNameArr = $("input[name='name_PropName_" + _specIndex + "']");
        var name_PropPriceArr = $("input[name='name_PropPrice_" + _specIndex + "']");
        var name_PropStockArr = $("input[name='name_PropStock_" + _specIndex + "']");
        //这个控件存储的值为 【ImgKeyGuid~ImgURL】 
        var name_PropUploadValArr = $("input[name='name_PropUploadValArr_" + _specIndex + "']");



        //构造规格项拼接字符串
        if (name_PropNameArr.length <= 0 && val_SpecName != "" && val_SpecPrice != "" && val_SpecStock != "" && parseFloat(val_SpecPrice) > 0 && parseFloat(val_SpecStock) > 0) {

            //正式构造Json字符串
            _jsonBack += "{";

            //判断价格和库存是否为数字
            if (checkNumber(val_SpecPrice) == false || isNaN(val_SpecStock)) {
                toastWinToDiv("规格【价格】和【库存】必须是数字！", "dragCustomWinDiv");
                return;
            }

            ////储存规格价格库存值 
            //mGoodsSpecPriceStockArr += val_SpecName + "~" + val_SpecPrice + "~" + val_SpecStock + "~" + val_SpecUploadValArr;
            //分割上传的图片与Guid
            var _specUploadValArr = val_SpecUploadValArr.split('~');
            if (_specUploadValArr[1] == undefined) {
                _specUploadValArr[1] = "";
            }
            _jsonBack += "\"SpecID\":\"" + val_SpecID + "\",";
            _jsonBack += "\"FatherSpecID\":\"0\",";
            _jsonBack += "\"SpecParamVal\":\"" + val_SpecName + "\",";
            _jsonBack += "\"SpecParamImg\":\"" + _specUploadValArr[1] + "\",";
            _jsonBack += "\"UploadGuid\":\"" + _specUploadValArr[0] + "\",";
            _jsonBack += "\"GoodsPrice\":\"" + val_SpecPrice + "\",";
            _jsonBack += "\"StockNum\":\"" + val_SpecStock + "\"";


        }
        else if (name_PropNameArr.length > 0 && val_SpecName != "") {

            //正式构造Json字符串
            _jsonBack += "{";

            ////储存规格价格库存值 
            //mGoodsSpecPriceStockArr += val_SpecName + "~" + val_SpecUploadValArr;

            var _specUploadValArr = val_SpecUploadValArr.split('~');
            if (_specUploadValArr[1] == undefined) {
                _specUploadValArr[1] = "";
            }

            _jsonBack += "\"SpecID\":\"" + val_SpecID + "\",";
            _jsonBack += "\"FatherSpecID\":\"0\",";
            _jsonBack += "\"SpecParamVal\":\"" + val_SpecName + "\",";
            _jsonBack += "\"SpecParamImg\":\"" + _specUploadValArr[1] + "\",";
            _jsonBack += "\"UploadGuid\":\"" + _specUploadValArr[0] + "\",";
            _jsonBack += "\"GoodsPrice\":\"" + val_SpecPrice + "\",";
            _jsonBack += "\"StockNum\":\"" + val_SpecStock + "\"";

        }
        else {
            //继续循环
            continue;
        }

        //标记为有规格
        if (_isHasSpec == false) {
            _isHasSpec = true;
        }


        //循环取属性项的值 拼接数组

        _jsonBack += ",\"PropList\":[";

        for (var j = 0; j < name_PropNameArr.length; j++) {

            _jsonBack += "{";

            var val_PropName = $(name_PropNameArr[j]).val().trim();
            var val_SpecID = $(name_PropNameArr[j]).attr("data-SpecID");
            var val_FatherSpecID = $(name_PropNameArr[j]).attr("data-FatherSpecID");
            var val_PropPrice = $(name_PropPriceArr[j]).val().trim();
            var val_PropStock = $(name_PropStockArr[j]).val().trim();
            var val_PropUploadValArr = $(name_PropUploadValArr[j]).val().trim();

            //判断价格和库存是否为数字
            if (checkNumber(val_PropPrice) == false || val_PropPrice == "" || isNaN(val_PropStock) || val_PropStock == "") {
                toastWinToDiv("属性【价格】和【库存】必须是数字！", "dragCustomWinDiv");
                return;
            }
            if (parseFloat(val_PropPrice) <= 0 || parseFloat(val_PropStock) <= 0) {
                toastWinToDiv("属性【价格】和【库存】必须大于0！", "dragCustomWinDiv");
                return;
            }

            if (val_PropName != "" && val_PropPrice != "" && val_PropStock != "" && parseFloat(val_PropPrice) > 0 && parseFloat(val_PropStock) > 0) {

                //储存规格价格库存
                //mGoodsSpecPriceStockArr += val_PropName + "~" + val_PropPrice + "~" + val_PropStock + "~" + val_PropUploadValArr + "|";

                var _propUploadValArr = val_PropUploadValArr.split('~');
                if (_propUploadValArr[1] == undefined) {
                    _propUploadValArr[1] = "";
                }
                //构造属性值Json字符串
                _jsonBack += "\"SpecID\":\"" + val_SpecID + "\",";
                _jsonBack += "\"FatherSpecID\":\"" + val_FatherSpecID + "\",";
                _jsonBack += "\"SpecParamVal\":\"" + val_PropName + "\",";
                _jsonBack += "\"SpecParamImg\":\"" + _propUploadValArr[1] + "\",";
                _jsonBack += "\"UploadGuid\":\"" + _propUploadValArr[0] + "\",";
                _jsonBack += "\"GoodsPrice\":\"" + val_PropPrice + "\",";
                _jsonBack += "\"StockNum\":\"" + val_PropStock + "\"";


                //标记为有属性
                if (_isHasProp == false) {
                    _isHasProp = true;
                }
            }

            _jsonBack += "},";
        }
        //去掉最后一个","
        _jsonBack = removeFrontAndBackChar(_jsonBack, ",");


        _jsonBack += "]";

        _jsonBack += "},";
    }
    //去掉前后的","
    _jsonBack = removeFrontAndBackChar(_jsonBack, ",");

    //返回Json字符串
    _jsonBack += "]";

    console.log("构建保存规格属性所需的Json字符串=" + _jsonBack);

    return _jsonBack;

}


/**
 * 删除因重复上传导致的多余规格图片
 * */
function delGooSpecParamImgRepeat() {
    //构造POST参数
    var dataPOST = {
        "Type": "2"
    };
    console.log(dataPOST);

    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: "../FileUpload/GooSpecParamImg?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log(reTxt);
            if (reTxt != "") {

            }
        },
        error: function (xhr, errorTxt, status) {
            console.log("异步请求错误，errorTxt=" + errorTxt + " | status=" + status);
            return;
        }
    });
}

/**
 * 初始化规格属性窗口信息
 * */
function initSpecPropFormWin() {
    //获取商品ID
    var hidGoodsID = mMsgID;

    //构造POST参数
    var dataPOST = {
        "Type": "1", "GoodsID": hidGoodsID,
    };
    console.log(dataPOST);

    //显示加载提示
    loadingWinToDiv("dragCustomWinDiv");

    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: "../Goods/GooSpecParam?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log(reTxt);
            //关闭加载提示
            closeLoadingWin();

            if (reTxt != "") {
                var _jsonArr = JSON.parse(reTxt);
                console.log(_jsonArr);

                //无规格属性的情况
                if (_jsonArr.length <= 0) {

                    //alert("无规格属性!");
                    //初始化编辑规格价格窗口，没有规格的情况
                    initNoSpeckParamWin();

                    return;
                }

                //-----设置按钮事件----//
                $("#btnCustomDialogWinOk").on("click", function () {
                    //添加规格项
                    addSpecItem();
                });
                $("#btnCustomDialogWinCancel").on("click", function () {
                    //[保存]规格
                    saveGooSpecParam();
                });

                //构造规格属性窗体显示代码
                var _xhtmlForm = xhtmlSpecPropForm(_jsonArr);

                $("#GoodsPriceSpecList").html(_xhtmlForm);

                //初始化规格价格库存上传插入
                initUploadSpecPriceFormWin();
            }
        },
        error: function (xhr, errorTxt, status) {
            console.log("异步请求错误，errorTxt=" + errorTxt + " | status=" + status);
            return;
        }
    });
}

/**
 * 构造规格属性窗体显示代码
 * @param pJsonArr 构造规格属性Json字符串
 * */
function xhtmlSpecPropForm(pJsonArr) {

    mInitUploadSpecPriceArr = "";

    //为规格标题，属性标题赋值
    $("#SpecTitleTxt").val(mSpecTitle);
    $("#SpecAttrNameTxt").val(mPropTitle);

    var myJsVal = "";
    //构造规格显示代码
    for (var i = 0; i < pJsonArr.length; i++) {

        var pSpecItemIndex = i + 1;

        //显隐规格的价格，库存
        var _styleDisplay = "normal";
        if (pJsonArr[i].GoodsPrice <= 0) {
            _styleDisplay = "none";
        }

        //构造图片的显示
        var _SpecParamImg = "//" + pJsonArr[i].SpecParamImg;
        if (_SpecParamImg == "//") {
            _SpecParamImg = "../Assets/Imgs/Icon/icon_spec_default.png";
        }
        console.log("_SpecParamImg=" + _SpecParamImg);

        myJsVal += " <div class=\"goods-pricespec-item\">";
        myJsVal += "     <div class=\"pricespec-item-title\">";
        myJsVal += "         <label>规格" + pSpecItemIndex + "：</label>";
        myJsVal += "         <span>名称</span><input id=\"id_SpecName_" + pSpecItemIndex + "\" name=\"name_SpecName\" data-SpecID=\"" + pJsonArr[i].SpecID + "\" type=\"text\" class=\"spec-name-txt\" value=\"" + pJsonArr[i].SpecParamVal + "\" />";

        myJsVal += "         <div id=\"id_SpecPriceStock_" + pSpecItemIndex + "\" style=\"display:" + _styleDisplay + "\">";
        myJsVal += "             <span>价格</span><input id=\"id_SpecPrice_" + pSpecItemIndex + "\" name=\"name_SpecPrice\" type=\"number\" class=\"spec-title-pricestock spec-name-txt\" spec-name-txt\" value=\"" + pJsonArr[i].GoodsPrice + "\" />";
        myJsVal += "             <span>库存</span><input id=\"id_SpecStock_" + pSpecItemIndex + "\" name=\"name_SpecStock\" type=\"number\" value=\"" + pJsonArr[i].StockNum + "\" class=\"spec-title-pricestock spec-name-txt\" />";
        myJsVal += "         </div>";


        myJsVal += "         <img id=\"id_SpecPropImg_" + pSpecItemIndex + "\" class=\"pricespec-pre-img\" src=\"" + _SpecParamImg + "\" />";
        myJsVal += "         <div class=\"am-form-group am-form-file\">";
        myJsVal += "             <button type=\"button\" class=\"am-btn am-btn-default am-btn-xs am-round\">";
        myJsVal += "                 <i class=\"am-icon-cloud-upload\"></i> 规格图片(可选)";
        myJsVal += "             </button>";
        myJsVal += "             <input id=\"id_SpecPropUpload_" + pSpecItemIndex + "\" name=\"name_SpecUpload\" type=\"file\">";
        myJsVal += "             <input type=\"hidden\" id=\"id_SpecPropUploadValArr_" + pSpecItemIndex + "\" name=\"name_SpecUploadValArr\" value=\"" + pJsonArr[i].UploadGuid + "~" + pJsonArr[i].SpecParamImg + "\" />";
        myJsVal += "         </div>";
        myJsVal += "     </div>";
        myJsVal += "     <div class=\"pricespec-prop-list\" id=\"id_PropList_" + pSpecItemIndex + "\">";

        //初始化上传插入字符串数组 SpecIndex ~ PropIndex ^ SpecIndex ~ PropIndex
        mInitUploadSpecPriceArr += "^" + pSpecItemIndex;


        //构造规格属性显示代码
        var _propListArr = pJsonArr[i].PropList;
        for (var j = 0; j < _propListArr.length; j++) {

            var _indexPropItem = j + 1;

            //构造图片的显示
            var _PropParamImg = "//" + _propListArr[j].SpecParamImg;
            if (_PropParamImg == "//") {
                _PropParamImg = "../Assets/Imgs/Icon/icon_spec_default.png";
            }
            console.log("_PropParamImg=" + _PropParamImg);

            myJsVal += "<div class=\"pricespec-prop-item\">";
            myJsVal += "                                    <span>属性名称</span><input id=\"id_PropName_" + pSpecItemIndex + "_" + _indexPropItem + "\" name=\"name_PropName_" + pSpecItemIndex + "\" data-SpecID=\"" + _propListArr[j].SpecID + "\" data-FatherSpecID=\"" + _propListArr[j].FatherSpecID + "\" type=\"text\" value=\"" + _propListArr[j].SpecParamVal + "\" class=\"spec-prop-name-txt spec-name-txt\" />";
            myJsVal += "                                    <span>价格</span><input id=\"id_PropPrice_" + pSpecItemIndex + "_" + _indexPropItem + "\" value=\"" + _propListArr[j].GoodsPrice + "\" name=\"name_PropPrice_" + pSpecItemIndex + "\" type=\"number\" class=\"spec-name-txt\" />";
            myJsVal += "                                    <span>库存</span><input id=\"id_PropStock_" + pSpecItemIndex + "_" + _indexPropItem + "\" name=\"name_PropStock_" + pSpecItemIndex + "\" type=\"number\" value=\"" + _propListArr[j].StockNum + "\" class=\"spec-name-txt\" />";
            myJsVal += "                                    <img id=\"id_SpecPropImg_" + pSpecItemIndex + "_" + _indexPropItem + "\" class=\"pricespec-pre-img\" src=\"" + _PropParamImg + "\" />";
            myJsVal += "                                    <div class=\"am-form-group am-form-file\">";
            myJsVal += "                                        <button type=\"button\" class=\"am-btn am-btn-default am-btn-xs am-round\">";
            myJsVal += "                <i class=\"am-icon-cloud-upload\"></i> 属性图片(可选)";
            myJsVal += "                                        </button>";
            myJsVal += "                                        <input id=\"id_SpecPropUpload_" + pSpecItemIndex + "_" + _indexPropItem + "\" name=\"name_PropUpload_" + pSpecItemIndex + "\" type=\"file\">";

            myJsVal += "<input type=\"hidden\" id=\"id_SpecPropUploadValArr_" + pSpecItemIndex + "_" + _indexPropItem + "\" value=\"" + _propListArr[j].UploadGuid + "~" + _propListArr[j].SpecParamImg + "\" name=\"name_PropUploadValArr_" + pSpecItemIndex + "\" />";

            myJsVal += "                                    </div>";
            myJsVal += "                                </div>";


            //初始化上传插入字符串数组 SpecIndex ~ PropIndex ^ SpecIndex ~ PropIndex
            mInitUploadSpecPriceArr += "~" + _indexPropItem;
        }
        myJsVal += "     </div>";
        myJsVal += "     <div class=\"pricespec-prop-add\">";
        myJsVal += "         <div class=\"btn-prop-add\" onclick=\"addPropItem(" + pSpecItemIndex + "," + pJsonArr[i].SpecID + ")\">添加属性</div>";
        myJsVal += "         <div onclick=\"removePropItem(" + pSpecItemIndex + ")\">删除属性</div>";
        myJsVal += "     </div>";
        myJsVal += " </div>";
    }

    //删除前后的“^”
    mInitUploadSpecPriceArr = removeFrontAndBackChar(mInitUploadSpecPriceArr, "^");

    console.log("mInitUploadSpecPriceArr=" + mInitUploadSpecPriceArr);
    //alert("mInitUploadSpecPriceArr=" + mInitUploadSpecPriceArr);

    return myJsVal;
}

/**
 * 初始化规格价格库存上传插入
 * */
function initUploadSpecPriceFormWin() {

    //初始化上传插入字符串数组 SpecIndex ~ PropIndex~ PropIndex ^ SpecIndex ~ PropIndex~ PropIndex [1~1~2 ^ 2~1~2]
    if (mInitUploadSpecPriceArr == "") {
        return;
    }

    if (mInitUploadSpecPriceArr.indexOf("^") >= 0) //多个规格的情况
    {
        //分解字符串数组
        var _specPropIndexArr = mInitUploadSpecPriceArr.split("^");
        for (var i = 0; i < _specPropIndexArr.length; i++) {
            if (_specPropIndexArr[i].indexOf("~") >= 0) //有规格有属性
            {
                var _specPropIndexItemArr = _specPropIndexArr[i].split("~");

                for (var j = 0; j < _specPropIndexItemArr.length; j++) {

                    //alert("_specPropIndexItemArr[j]=" + _specPropIndexItemArr[j]);

                    if (j == 0) {
                        //初始化规格属性上传插入
                        initSpecPropUploadFile(_specPropIndexItemArr[0]);
                    }
                    else {
                        //初始化规格属性上传插入
                        initSpecPropUploadFile(_specPropIndexItemArr[0], _specPropIndexItemArr[j]);
                    }
                }
            }
            else //只有规格没有属性
            {
                //初始化规格属性上传插入
                initSpecPropUploadFile(_specPropIndexArr[i]);
            }
        }
    }
    else //只有一个规格属性的情况
    {
        if (mInitUploadSpecPriceArr.indexOf("~") >= 0) //有规格有属性
        {
            var _specPropIndexItemArr = mInitUploadSpecPriceArr.split("~");

            for (var j = 0; j < _specPropIndexItemArr.length; j++) {

                if (j == 0) {
                    //初始化规格属性上传插入
                    initSpecPropUploadFile(_specPropIndexItemArr[0]);
                }
                else {
                    //初始化规格属性上传插入
                    initSpecPropUploadFile(_specPropIndexItemArr[0], _specPropIndexItemArr[j]);
                }
            }
        }
        else //只有规格没有属性
        {
            //初始化规格属性上传插入
            initSpecPropUploadFile(mInitUploadSpecPriceArr);
        }
    }
}

/**
 * 加载规格属性信息并构造显示代码
 * */
function loadSpecPropMsgXhtml() {

    if (mGoodsSpecPriceStockArr == "") {
        return;
    }

    //规格属性标题
    $("#SpecTitleDiv").html(mSpecTitle);
    $("#PropTitleDiv").html(mPropTitle);

    //构造POST参数
    var dataPOST = {
        "Type": "5", "MsgGuid": mGoodsMsgGuid,
    };
    console.log(dataPOST);

    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: mAjaxUrl + "?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            //console.log(reTxt);
            if (reTxt != "") {
                var _jsonArr = JSON.parse(reTxt);
                console.log(_jsonArr);

                if (_jsonArr.length > 0) {

                    //构造规格属性页面显示代码
                    var xhtmlSpecPropMsgArr = xhtmlSpecPropMsg(_jsonArr).split("^");
                    //显示代码插入前台 
                    $("#SpecItemDiv").html(xhtmlSpecPropMsgArr[0]);
                    $("#PropItemDiv").html(xhtmlSpecPropMsgArr[1]);

                    mJsonArrSpecProp = _jsonArr;

                    //初始化规格信息
                    chgTabSpec(mJsonArrSpecProp[0].SpecIDPre, true);
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
 * 构造规格属性页面显示代码
 * @param {any} pJsonArrSpecProp
 */
function xhtmlSpecPropMsg(pJsonArrSpecProp) {

    var _specXhtml = ""; //规格Xhtml
    var _propXhtml = ""; //属性Xhtml

    //循环构造显示代码
    for (var i = 0; i < pJsonArrSpecProp.length; i++) {

        //规格信息
        var _specMsg = pJsonArrSpecProp[i];

        var _currentClass = "";
        if (i == 0) {
            _currentClass = "current-price-spec";
        }

        //构造规格Xhtml
        if (_specMsg.SpecParamImg != "") {
            _specXhtml += "<div name=\"SpecListName\" data-price-stock=\"" + _specMsg.GoodsPrice + "|" + _specMsg.StockNum + "\" onclick=\"chgTabSpec(" + _specMsg.SpecIDPre + ")\" class=\"" + _currentClass + "\"><img src=\"//" + _specMsg.SpecParamImg + "\" /></div>";
        }
        else {
            _specXhtml += "<div name=\"SpecListName\" data-price-stock=\"" + _specMsg.GoodsPrice + "|" + _specMsg.StockNum + "\" onclick=\"chgTabSpec(" + _specMsg.SpecIDPre + ")\" class=\"" + _currentClass + "\"><span>" + _specMsg.SpecParamVal + "</span></div>";
        }

        //规格下面的属性信息数组
        var _propArr = _specMsg.PropList;

        var _currentStyleDisplay = "none";
        if (i == 0) {
            _currentStyleDisplay = "normal";
        }
        _propXhtml += " <div id=\"PropList_" + _specMsg.SpecIDPre + "\" name=\"PropListName\" class=\"price-spec-div-item\" style=\"display:" + _currentStyleDisplay + "\">";

        //构造规格下属性的Xhtml
        for (var j = 0; j < _propArr.length; j++) {
            //属性信息
            var _propMsg = _propArr[j];
            var _currentClass = "";

            if (j == 0) {
                _currentClass = "current-price-spec";
            }

            if (_propMsg.SpecParamImg != "") {
                _propXhtml += "<div name=\"PropItemName\" id=\"PropItem_" + _propMsg.SpecIDPre + "\" onclick=\"chgPropTabl(" + _specMsg.SpecIDPre + "," + _propMsg.SpecIDPre + ")\" data-price-stock=\"" + _propMsg.GoodsPrice + "|" + _propMsg.StockNum + "\" class=\"" + _currentClass + "\"><img src=\"//" + _propMsg.SpecParamImg + "\" /></div>";
            }
            else {
                _propXhtml += "<div name=\"PropItemName\" id=\"PropItem_" + _propMsg.SpecIDPre + "\" onclick=\"chgPropTabl(" + _specMsg.SpecIDPre + "," + _propMsg.SpecIDPre + ")\" data-price-stock=\"" + _propMsg.GoodsPrice + "|" + _propMsg.StockNum + "\" class=\"" + _currentClass + "\"><span>" + _propMsg.SpecParamVal + "</span></div>";
            }
        }
        _propXhtml += " </div>";
    }
    //alert("_specXhtml=" + _specXhtml);
    //alert("_propXhtml=" + _propXhtml);
    return _specXhtml + "^" + _propXhtml;
}

/**
 * 初始化初始化 商品规格属性总标题
 * @param pGoodsID 商品ID
 * @param pCallBack 回调函数
 * */
function initGooSpecParamName(pGoodsID, pCallBack) {

    if (pCallBack == undefined || pCallBack == "") {
        pCallBack = function () { };
    }

    //构造POST参数
    var dataPOST = {
        "Type": "1", "GoodsID": pGoodsID,
    };
    console.log(dataPOST);

    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: "../Goods/GooSpecParamName?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log(reTxt);
            if (reTxt != "") {
                var _jsonTxt = JSON.parse(reTxt);

                mGoodsSpecTitle = mSpecTitle = _jsonTxt.SpecTitle;
                mGoodsPropTitle = mPropTitle = _jsonTxt.SpecAttrName;

                //回调函数
                pCallBack();
            }
        },
        error: function (xhr, errorTxt, status) {
            console.log("异步请求错误，errorTxt=" + errorTxt + " | status=" + status);
            return;
        }
    });
}

/**
 * 初始化编辑规格价格窗口，没有规格的情况
 * */
function initNoSpeckParamWin() {

    //去掉添加规格和保存规格按钮
    $("#btnCustomDialogWinOk").val("取消");
    $("#btnCustomDialogWinOk").on("click", function () {

        //关闭窗口
        closeCustomDialogWin();

        return;
    });

    $("#btnCustomDialogWinCancel").val("确定");
    $("#btnCustomDialogWinCancel").on("click", function () {

        //保存商品价格与库存，没有规格的情况
        savePriceStockNoSpec();

        return;
    });


    //构造POST参数
    var dataPOST = {
        "Type": "3", "GoodsID": mMsgID,
    };
    console.log(dataPOST);

    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: "../Goods/GoodsMsg?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log(reTxt);
            if (reTxt != "") {
                var _jsonTxt = JSON.parse(reTxt);

                //构造显示代码                var myJsVal = "<div class=\"goods-pricespec-title\" id=\"GoodsNoSpecPriceStockDiv\">";                myJsVal += "  <span>商品价格</span>";                myJsVal += "  <input type=\"number\" id=\"GoodsPriceTxt\" class=\"pricespec-title pricespec-title-left\" value=\"" + _jsonTxt.GoodsPrice + "\" />";                myJsVal += "  <span>商品库存</span>";                myJsVal += "  <input type=\"number\" id=\"StockNumTxt\" class=\"pricespec-title\" value=\"" + _jsonTxt.StockNum + "\" />";                myJsVal += "</div>";                //显示代码插入前台                $("#GoodsPriceSpecForm").html(myJsVal);                //$("#GoodsPriceSpecForm").css("height", "200");            }
        },
        error: function (xhr, errorTxt, status) {
            console.log("异步请求错误，errorTxt=" + errorTxt + " | status=" + status);
            return;
        }
    });
}

/**
 * 保存商品价格与库存，没有规格的情况
 * */
function savePriceStockNoSpec() {

    var GoodsPriceTxt = $("#GoodsPriceTxt").val().trim();
    var StockNumTxt = $("#StockNumTxt").val().trim();

    if (GoodsPriceTxt == "" || StockNumTxt == "") {
        toastWinToDiv("【商品价格】和【商品库存】不能为空！", "dragCustomWinDiv");
        return;
    }

    if (parseFloat(GoodsPriceTxt) <= 0 || parseFloat(StockNumTxt) <= 0) {
        toastWinToDiv("【商品价格】和【商品库存】必须大于0 ！", "dragCustomWinDiv");
        return;
    }

    //构造POST参数
    var dataPOST = {
        "Type": "4", "GoodsID": mMsgID, "GoodsPrice": GoodsPriceTxt, "StockNum": StockNumTxt,
    };
    console.log(dataPOST);

    //显示加载提示
    loadingWinToDiv("dragCustomWinDiv");

    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: "../Goods/GoodsMsg?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log(reTxt);
            //移除加载提示
            closeLoadingWin();
            if (reTxt != "") {
                var _jsonTxt = JSON.parse(reTxt);

                if (_jsonTxt.Msg != null && _jsonTxt.Msg != "") {

                    toastWinToDiv(_jsonTxt.Msg, "dragCustomWinDiv");
                    //关闭窗口
                    closeCustomDialogWin();
                }
                if (_jsonTxt.ErrMsg != "") {
                    toastWinToDiv(_jsonTxt.ErrMsg, "dragCustomWinDiv");
                }
            }

        },
        error: function (xhr, errorTxt, status) {
            console.log("异步请求错误，errorTxt=" + errorTxt + " | status=" + status);
            return;
        }
    });
}

