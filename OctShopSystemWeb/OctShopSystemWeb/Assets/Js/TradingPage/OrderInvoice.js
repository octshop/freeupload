﻿//=================订单发票管理====================//

/**-----定义公共变量------**/
//AjaxURL
var mAjaxUrl = "../Trading/OrderInvoice";


//OctWapWeb 手机Web端(公众号端)地址域名
var mOctWapWebAddrDomain = "";

//分页的数据对象
var mJsonReTxt = null;

/******数据分页的变量********/
var strPOSTSe = ""; //搜索条件对象 POST参数
var intPageCurrent = 1; //当前页
var pageSize = 15; //当页的记录条数，与后台保持一致
var recordSum = 0; //总记录数
var tableColNum = 11; //当前表列数


/**------初始化------**/
$(function () {

    mOctWapWebAddrDomain = $("#hidOctWapWebAddrDomain").val().trim();

    //初始化加载
    searchContent();

    //搜索按钮单击事件
    $("#btnSearch").click(function () {
        searchContent();
    });

    //初始化发票详情窗口
    initPopWinHtmlOrderInvoice();

});



//========================数据分页搜索==============================//

/*
---------定义搜索函数---------
*/
var searchContent = function () {

    intPageCurrent = 1; //开始页

    var InvoiceID_se = $("#InvoiceID_se").val().trim();
    var OrderID_se = $("#OrderID_se").val().trim();
    var InvoiceType_se = $("#InvoiceType_se").val().trim();
    var InvoiceTitle_se = $("#InvoiceTitle_se").val().trim();
    var ReceiMobile_se = $("#ReceiMobile_se").val().trim();
    var CompanyName_se = $("#CompanyName_se").val().trim();
    var IsInvoiced_se = $("#IsInvoiced_se").val().trim();
    var WriteDate_se = $("#WriteDate_se").val().trim();


    //构造POST参数
    var strPOST = {
        "pageCurrent": "1", "Type": "1",
    };

    //翻页所用
    var strPOSTSePush = {
        "InvoiceID": InvoiceID_se, "OrderID": OrderID_se, "InvoiceType": InvoiceType_se,
        "InvoiceTitle": InvoiceTitle_se, "ReceiMobile": ReceiMobile_se, "CompanyName": CompanyName_se, "IsInvoiced": IsInvoiced_se, "WriteDate": WriteDate_se,
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
            console.log("数据分页=" + reTxtJson);
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

    mJsonReTxt = pJsonObject;

    //将字符串转换成功JSON对象
    //var json = JSON.parse(pJsonTxt);
    var json = pJsonObject;

    //-----内容显示前台显示代码----//
    var myJsVal = "";    //循环构造    for (var i = 0; i < json.DataPage.length; i++) {

        var indexDataPage = json.DataPage[i];
        var indexDataPageExtra = json.DataPageExtra[i];



        myJsVal += "<tr>";        myJsVal += " <td><input type=\"checkbox\" name=\"SelCbItem\" id=\"SelCbItem_" + indexDataPage.InvoiceID + "\" /></td>";        myJsVal += " <td>" + indexDataPage.InvoiceID + "</td>";        myJsVal += " <td><a href=\"../TradingPage/OrderDetail?OID=" + indexDataPage.OrderID + "\" target=\"_blank\">" + indexDataPage.OrderID + "</a> <br /><font color=\"gray\">" + indexDataPageExtra.OrderStatus + "</td>";        myJsVal += " <td>" + getInvoiceTypeName(indexDataPage.InvoiceType) + "</td>";        myJsVal += " <td>" + getInvoiceTitleName(indexDataPage.InvoiceTitle) + "</td>";        myJsVal += " <td>" + getInvoiceContentName(indexDataPage.InvoiceContent) + "</td>";        myJsVal += " <td>" + indexDataPage.ReceiMobile + "</td>";        myJsVal += " <td>" + indexDataPage.CompanyName + "</td>";        myJsVal += " <td>" + getIsInvoicedName(indexDataPage.IsInvoiced) + "</font></td>";        myJsVal += " <td>" + indexDataPage.WriteDate + "</td>";        myJsVal += " <td>";        myJsVal += "     <button class=\"table-btn am-btn am-btn-default am-btn-xs am-text-secondary am-round\" style=\"margin-bottom:2px\" onclick=\"openOrderInvoiceWin(" + i + ")\">详情</button>";        if (indexDataPage.IsInvoiced == "false") {            myJsVal += "<button class=\"table-btn am-btn am-btn-default am-btn-xs am-text-secondary am-round\" onclick=\"makedOrderInvoiceArr('" + indexDataPage.InvoiceID + "')\">已开票</button>";
        }        myJsVal += " </td>";        myJsVal += "</tr>";
    }    //alert(myJsVal);    //-----分页控制条显示代码-------//    var pageBarXhtml = "";    pageBarXhtml += " <li><a href=\"javascript:void(0)\" onclick=\"PrePage()\">«</a></li>";    pageBarXhtml += " <li><a href=\"javascript:void(0)\" onclick=\"NumberPage('1')\">1</a></li>";    pageBarXhtml += "  <li><span>...</span></li>";    if ((intPageCurrent - 2) > 0) {
        pageBarXhtml += "  <li><a href=\"javascript:void(0)\" onclick=\"NumberPage('" + (intPageCurrent - 2) + "')\">" + (intPageCurrent - 2) + "</a></li>";
    }    if ((intPageCurrent - 1) > 0) {
        pageBarXhtml += "  <li><a href=\"javascript:void(0)\" onclick=\"NumberPage('" + (intPageCurrent - 1) + "')\">" + (intPageCurrent - 1) + "</a></li>";
    }    pageBarXhtml += "  <li class=\"am-active\"><a href=\"javascript:void(0)\" onclick=\"NumberPage('" + json.PageCurrent + "')\">" + json.PageCurrent + "</a></li>";    //console.log(parseInt(json.PageSum));    if ((intPageCurrent + 1) <= parseInt(json.PageSum)) {
        pageBarXhtml += "  <li><a href=\"javascript:void(0)\" onclick=\"NumberPage('" + (intPageCurrent + 1) + "')\">" + (intPageCurrent + 1) + "</a></li>";
    }    if ((intPageCurrent + 2) <= parseInt(json.PageSum)) {
        pageBarXhtml += "  <li><a href=\"javascript:void(0)\" onclick=\"NumberPage('" + (intPageCurrent + 2) + "')\">" + (intPageCurrent + 2) + "</a></li>";
    }    pageBarXhtml += "  <li><span>...</span></li>";    pageBarXhtml += "  <li><a href=\"javascript:void(0)\" onclick=\"NumberPage('" + json.PageSum + "')\">" + json.PageSum + "</a></li>";    pageBarXhtml += "  <li><input type=\"number\" id=\"PageNumTxt\" class=\"page-go-text am-form-field\" placeholder=\"跳转页\" /></li>";    pageBarXhtml += "  <li><a href=\"javascript:void(0)\" onclick=\"NextPage()\">»</a></li>";    var _pageMsgArr = new Array()    //内容显示代码     _pageMsgArr[0] = myJsVal;    //控制条件显示代码    _pageMsgArr[1] = pageBarXhtml;    //返回数组    return _pageMsgArr;
}


//-----------搜索结果分页--------------//
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

//------以GET方式发送分页请求的函数--------//
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


//------------跳转页-----------//
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


//========================数据分页搜索==============================//

/**
 * 得到 发票类型 名称
 * @param {any} pInvoiceType 发票类型( General 普通发票  AddValue 增值税专用发票 )
 */
function getInvoiceTypeName(pInvoiceType) {

    //发票类型( General 普通发票  AddValue 增值税专用发票 )
    if (pInvoiceType == "AddValue") {
        return "增值税专用发票";
    }
    else if (pInvoiceType == "General") {
        return "普通发票";
    }
    return "";
}

/**
 * 得到 发票抬头 名称
 * @param {any} pInvoiceTitle
 */
function getInvoiceTitleName(pInvoiceTitle) {

    //发票抬头 ( Person 个人  /  Company  企业 )
    if (pInvoiceTitle == "Person") {
        return "个人";
    }
    else if (pInvoiceTitle == "Company") {
        return "企业";
    }
    return "";
}

/**
 * 得到 发票内容 名称
 * @param {any} pInvoiceContent 发票内容（GoodsDetail 商品明细 GoodsType 商品类别  InvoiceNo 不开发票  等）
 */
function getInvoiceContentName(pInvoiceContent) {

    //发票内容（GoodsDetail 商品明细 GoodsType 商品类别  InvoiceNo 不开发票  等）
    if (pInvoiceContent == "GoodsDetail") {
        return "商品明细";
    }
    else if (pInvoiceContent == "GoodsType") {
        return "商品类别";
    }
    else if (pInvoiceContent == "InvoiceNo") {
        return "不开发票";
    }
    return "";
}

/**
 * 得到 是否开票 名称
 * @param {any} pIsInvoiced 是否开票( false / true [已开票] )
 */
function getIsInvoicedName(pIsInvoiced) {

    //是否开票( false / true [已开票] )
    if (pIsInvoiced == "false") {
        return "未开票";
    }
    else if (pIsInvoiced == "true") {
        return "已开票";
    }
    return "";
}


//============批量操作===============//

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
 * 发票置于-已开票状态
 * @param {any} pInvoiceID 发票ID
 */
function makedOrderInvoiceArr(pInvoiceID) {


    var _invoiceIDArr = ""
    if (pInvoiceID == "" || pInvoiceID == undefined) {
        _invoiceIDArr = getSelectValArr();
    }
    else {
        _invoiceIDArr = pInvoiceID;
    }

    if (_invoiceIDArr == "") {
        toastWin("请选择操作的记录！");
        return;
    }


    confirmWinWidth("确认已开票吗?", function () {


        //构造POST参数
        var dataPOST = {
            "Type": "2", "InvoiceIDArr": _invoiceIDArr,
        };
        console.log(dataPOST);

        //正式发送异步请求
        $.ajax({
            type: "POST",
            url: mAjaxUrl + "?rnd=" + Math.random(),
            data: dataPOST,
            dataType: "html",
            success: function (reTxt, status, xhr) {
                console.log("已开票状态=" + reTxt);

                if (reTxt != "") {
                    var _jsonReTxt = JSON.parse(reTxt);

                    if (_jsonReTxt.ErrMsg != undefined && _jsonReTxt.ErrMsg != null && _jsonReTxt.ErrMsg != "") {
                        toastWin(_jsonReTxt.ErrMsg);
                        return;
                    }

                    if (_jsonReTxt.Msg != undefined && _jsonReTxt.Msg != null && _jsonReTxt.Msg != "") {

                        toastWin(_jsonReTxt.Msg);

                        //重新加载数据
                        NumberPage(intPageCurrent);

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


//==================弹出窗口=======================//




//--------------发票详情弹出窗口------------//

var mPopWinHtmlOrderInvoice = "";
/**
 * 初始化发票详情窗口
 */
function initPopWinHtmlOrderInvoice() {
    //获取窗口显示代码
    mPopWinHtmlOrderInvoice = $("#OrderInVoiceWin").html();
    $("#OrderInVoiceWin").empty();
}

/**
 * 打开发票详情窗口
 */
function openOrderInvoiceWin(pJsonReTxtIndex) {

    //打开Dialog弹出窗口
    openCustomDialogWin("发票详情", mPopWinHtmlOrderInvoice, 600);

    var indexDataPage = mJsonReTxt.DataPage[pJsonReTxtIndex];

    $("#InvoiceID").html(indexDataPage.InvoiceID);
    $("#OrderIDA").html(indexDataPage.OrderID);
    $("#OrderIDA").attr("href", "..//TradingPage/OrderDetail?OID=" + indexDataPage.OrderID);
    $("#IsInvoiced").html("" + indexDataPage.IsInvoiced + "-" + getIsInvoicedName(indexDataPage.IsInvoiced) + "");
    $("#InvoiceTitle").html(indexDataPage.InvoiceTitle + "-" + getInvoiceTitleName(indexDataPage.InvoiceTitle));
    $("#InvoiceType").html(indexDataPage.InvoiceType + "-" + getInvoiceTypeName(indexDataPage.InvoiceType));
    $("#InvoiceContent").html(indexDataPage.InvoiceContent + "-" + getInvoiceContentName(indexDataPage.InvoiceContent));
    $("#ReceiMobile").html(indexDataPage.ReceiMobile);
    $("#ReceiEmail").html(indexDataPage.ReceiEmail);
    $("#CompanyName").html(indexDataPage.CompanyName);
    $("#TaxNumber").html(indexDataPage.TaxNumber);
    $("#CompanyTel").html(indexDataPage.CompanyTel);
    $("#CompanyRegAddr").html(indexDataPage.CompanyRegAddr);
    $("#BankAcc").html(indexDataPage.BankAcc);
    $("#OpeningBank").html(indexDataPage.OpeningBank);
    $("#BankCode").html(indexDataPage.BankCode);

}

