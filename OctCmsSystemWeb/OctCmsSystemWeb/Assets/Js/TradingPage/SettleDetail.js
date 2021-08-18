//================结算申请处理========================//

/**-----定义公共变量------**/
//AjaxURL
var mAjaxUrl = "../Trading/SettleDispose";

//结算单ID
var mSettleID = "";

/**------初始化------**/
$(function () {

    mSettleID = $("#hidSettleID").val().trim();

    //初始化商家结算申请信息
    initSettleApplyDetail(function () {

        //数据分页222 - 可结算商城订单
        searchContent2(function () {

            //数据分页333 - 可结算-线下扫码订单
            searchContent3();

        });

    });


});




//===================自定义函数===========================//

/**
 * 初始化商家结算申请信息
 * */
function initSettleApplyDetail(pCallBack) {

    if (mSettleID == "" || mSettleID == "0") {
        return;
    }

    //构造POST参数
    var dataPOST = {
        "Type": "3", "SettleID": mSettleID
    };
    console.log(dataPOST);

    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: mAjaxUrl + "?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("初始化商家结算申请信息=" + reTxt);

            //回调函数
            pCallBack();

            if (reTxt != "") {
                var _jsonReTxt = JSON.parse(reTxt);

                //为表单赋值
                //状态区
                if (_jsonReTxt.SettleStatus == "处理中") {
                    $("#StatusTtitle").html("结算处理中");
                    $("#StatusDesc").html("结算申请对账处理中，请相关工作人员尽快处理。");
                    $(".order-status").css("background", "#DE7400");
                }
                else if (_jsonReTxt.SettleStatus == "完成") {
                    $("#StatusTtitle").html("结算完成");
                    $("#StatusDesc").html("结算申请处理完成，结算转账成功！");
                    $(".order-status").css("background", "#05A23B");
                }

                //结算转账金额
                var _SettleTransSum = parseFloat(_jsonReTxt.ApplySettleMoney) - parseFloat(_jsonReTxt.SumCommissionMoney);
                $("#SettleTransSum").html("&#165;" + formatNumberDotDigit(_SettleTransSum, 2) + "");
                $("#RealTransSum").val(formatNumberDotDigit(_SettleTransSum, 2));

                $("#SettleID").html(_jsonReTxt.SettleID);
                $("#ApplySettleMoney").html(_jsonReTxt.ApplySettleMoney);
                $("#MallOrderSettleMoney").html(_jsonReTxt.MallOrderSettleMoney);
                $("#AggreOrderSettleMoney").html(_jsonReTxt.AggreOrderSettleMoney);

                $("#SumCommissionMoney").html(_jsonReTxt.SumCommissionMoney);
                $("#CountSettleOrder").html(_jsonReTxt.CountSettleOrder);
                //$("#MallCountSettleOrder").html(_jsonReTxt.MallCountSettleOrder);
                //$("#AggreCountSettleOrder").html(_jsonReTxt.AggreCountSettleOrder);

                $("#ApplyName").html(_jsonReTxt.ApplyName);
                $("#ApplyTel").html(_jsonReTxt.ApplyTel);
                $("#ApplyDate").html(_jsonReTxt.ApplyDate);

                //结算处理完成
                if (_jsonReTxt.SettleStatus == "完成") {
                    $("#RealTransSum").html("&#165;" + _jsonReTxt.RealTransSum + "");
                    $("#DisposeMan").html(_jsonReTxt.DisposeMan);
                    $("#DisposeDate").html(_jsonReTxt.DisposeDate);

                    var myJsValTransferVoucherImg = " <a href=\"" + _jsonReTxt.TransferVoucherImg + "\" target=\"_blank\"><img src=\"//" + _jsonReTxt.TransferVoucherImg + "\" /></a>";
                    $("#TransferVoucherImg").html(myJsValTransferVoucherImg);
                }


            }
        },
        error: function (xhr, errorTxt, status) {
            console.log("异步请求错误，errorTxt=" + errorTxt + " | status=" + status);
            return;
        }
    });

}


//===================数据分页222 - 可结算商城订单====================//

/******数据分页的变量********/
var strPOSTSe2 = ""; //搜索条件对象 POST参数
var intPageCurrent2 = 1; //当前页
var pageSize2 = 15; //当页的记录条数，与后台保持一致
var recordSum2 = 0; //总记录数
var tableColNum2 = 8; //当前表列数

/*
---------定义搜索函数---------
*/
var searchContent2 = function (pCallBack) {

    intPageCurrent2 = 1; //开始页

    var ShopUserID = "";

    //构造POST参数
    var strPOST = {
        "pageCurrent": "1", "Type": "1", "SettleID": mSettleID
    };

    //翻页所用
    var strPOSTSePush = {
        "ShopUserID": ShopUserID,
    };
    //将对象添加到分类对象中

    //搜索内容用
    var strPOSTSeContent = pushTwoObject(strPOST, strPOSTSePush);

    //分页操作用
    var strPOSTSearch = { "Type": "1" };
    strPOSTSe2 = pushTwoObject(strPOSTSearch, strPOSTSePush);
    console.log(strPOSTSe2);

    //加载提示
    $("#TbodyTrPage2").html("<tr><td colspan=\"" + tableColNum2 + "\">… 数据加载中 …</td></tr>");

    //以POST方式发送异步请求
    $.ajax({
        type: "POST",
        url: mAjaxUrl + "?rnd=" + Math.random(),
        data: strPOSTSeContent,
        dataType: "html",
        success: function (reTxtJson, status, xhr) {
            //显示返回值
            console.log("数据分页2=" + reTxtJson);

            //回调函数
            pCallBack();

            mIsLoadMallOrderMsg = true;

            if (reTxtJson != "") {

                //分页成功返回，构造显示代码
                pageSuccess2(reTxtJson);

            }
            else {
                //加载提示
                $("#TbodyTrPage2").html("<tr><td colspan=\"" + tableColNum2 + "\">没有搜索到相关数据</td></tr>");
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
function jsonToXhtml2(pJsonObject) {

    //将字符串转换成功JSON对象
    //var json = JSON.parse(pJsonTxt);
    var json = pJsonObject;

    $("#MallCountSettleOrder").html(json.RecordSum);

    //-----内容显示前台显示代码----//
    var myJsVal = "";
    //循环构造
    for (var i = 0; i < json.DataPage.length; i++) {

        var indexDataPage = json.DataPage[i];
        //var indexDataPage2 = json.DataPage2[i];
        var indexDataPageExtra = json.DataPageExtra[i];

        //计算结算金额 
        var _settleOrderPrice = parseFloat(indexDataPage.OrderPrice) - parseFloat(indexDataPage.CommissionMoney);
        _settleOrderPrice = formatNumberDotDigit(_settleOrderPrice, 2);

        myJsVal += "<tr>";
        myJsVal += " <td><a href=\"../TradingPage/OrderDetail?OID=" + indexDataPage.OrderID + "\" target=\"_blank\">" + indexDataPage.OrderID + "</a></td>";
        myJsVal += " <td>" + indexDataPage.OrderStatus + "</td>";
        myJsVal += " <td>" + indexDataPageExtra.PayWayName + "</td>";
        myJsVal += " <td>&#165;" + indexDataPage.OrderPrice + "</td>";
        myJsVal += " <td>&#165;" + indexDataPage.CommissionMoney + "</td>";
        myJsVal += " <td>&#165;" + _settleOrderPrice + "</td>";
        myJsVal += " <td>" + indexDataPage.FinishTime + "</td>";
        myJsVal += " <td>";
        myJsVal += "     <input type=\"button\" class=\"table-btn am-btn am-btn-default am-btn-xs am-text-secondary am-round\" value=\"详情\" onclick=\"window.open('../TradingPage/OrderDetail?OID=" + indexDataPage.OrderID + "')\" />";
        myJsVal += " </td>";
        myJsVal += "</tr>";
    }

    //alert(myJsVal);

    //-----分页控制条显示代码-------//
    var pageBarXhtml = "";

    pageBarXhtml += " <li><a href=\"javascript:void(0)\" onclick=\"PrePage2()\">«</a></li>";
    pageBarXhtml += " <li><a href=\"javascript:void(0)\" onclick=\"NumberPage2('1')\">1</a></li>";
    pageBarXhtml += "  <li><span>...</span></li>";


    if ((intPageCurrent2 - 2) > 0) {
        pageBarXhtml += "  <li><a href=\"javascript:void(0)\" onclick=\"NumberPage2('" + (intPageCurrent2 - 2) + "')\">" + (intPageCurrent2 - 2) + "</a></li>";
    }
    if ((intPageCurrent2 - 1) > 0) {
        pageBarXhtml += "  <li><a href=\"javascript:void(0)\" onclick=\"NumberPage2('" + (intPageCurrent2 - 1) + "')\">" + (intPageCurrent2 - 1) + "</a></li>";
    }


    pageBarXhtml += "  <li class=\"am-active\"><a href=\"javascript:void(0)\" onclick=\"NumberPage2('" + json.PageCurrent + "')\">" + json.PageCurrent + "</a></li>";

    //console.log(parseInt(json.PageSum));

    if ((intPageCurrent2 + 1) <= parseInt(json.PageSum)) {
        pageBarXhtml += "  <li><a href=\"javascript:void(0)\" onclick=\"NumberPage2('" + (intPageCurrent2 + 1) + "')\">" + (intPageCurrent2 + 1) + "</a></li>";
    }
    if ((intPageCurrent2 + 2) <= parseInt(json.PageSum)) {
        pageBarXhtml += "  <li><a href=\"javascript:void(0)\" onclick=\"NumberPage2('" + (intPageCurrent2 + 2) + "')\">" + (intPageCurrent2 + 2) + "</a></li>";
    }

    pageBarXhtml += "  <li><span>...</span></li>";
    pageBarXhtml += "  <li><a href=\"javascript:void(0)\" onclick=\"NumberPage2('" + json.PageSum + "')\">" + json.PageSum + "</a></li>";
    pageBarXhtml += "  <li><input type=\"number\" id=\"PageNumTxt2\" class=\"page-go-text am-form-field\" placeholder=\"跳转页\" /></li>";
    pageBarXhtml += "  <li><a href=\"javascript:void(0)\" onclick=\"NextPage2()\">»</a></li>";

    var _pageMsgArr = new Array()
    //内容显示代码 
    _pageMsgArr[0] = myJsVal;
    //控制条件显示代码
    _pageMsgArr[1] = pageBarXhtml;
    //返回数组
    return _pageMsgArr;
}


//------------------------------搜索结果分页-------------------------------//
//具体页
function NumberPage2(pagecurrent) {
    intPageCurrent2 = parseInt(pagecurrent);

    //以GET方式发送分页请求的函数
    sendPageHttpGet2(intPageCurrent2);
}

//上一页
function PrePage2() {
    intPageCurrent2 = intPageCurrent2 - 1;

    console.log("上一页intPageCurrent2=" + intPageCurrent2);

    if (intPageCurrent2 > 0) {

        //以GET方式发送分页请求的函数
        sendPageHttpGet2(intPageCurrent2);

    }
    else {
        intPageCurrent2 = 1;
    }
}


//下一页
function NextPage2() {
    intPageCurrent2 = parseInt(intPageCurrent2) + 1;

    console.log("下一页intPageCurrent2=" + intPageCurrent2);

    console.log("recordSum2=" + recordSum2);
    console.log("pageSize2=" + pageSize2);
    //计算总页数
    var intPageSum2 = recordSum2 % pageSize2 != 0 ? recordSum2 / pageSize2 + 1 : recordSum2 / pageSize2;
    console.log("intPageSum2=" + intPageSum2);
    if (intPageCurrent2 <= parseInt(intPageSum2)) {

        //以GET方式发送分页请求的函数
        sendPageHttpGet2(intPageCurrent2);

    }
    else {
        intPageCurrent2 = parseInt(intPageSum2);
    }

}

//----------------以GET方式发送分页请求的函数-----------------//
var sendPageHttpGet2 = function (intPageCurrent) {
    //构造GET参数
    strPOSTSe2 = pushTwoObject(strPOSTSe2, { "pageCurrent": intPageCurrent });

    //加载提示
    $("#TbodyTrPage2").html("<tr><td colspan=\"" + tableColNum2 + "\">… 数据加载中 …</td></tr>");

    $.ajax({
        type: "GET",
        url: mAjaxUrl + "?rnd=" + Math.random(),
        data: strPOSTSe2,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            //成功返回后的处理函数
            pageSuccess2(reTxt)
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
function pageSuccess2(reTxtJson) {
    if (reTxtJson != "") {

        var reJsonObject = JSON.parse(reTxtJson);
        console.log(reJsonObject);

        //总的记录数
        recordSum2 = reJsonObject.RecordSum;
        pageSize2 = reJsonObject.PageSize;


        //解析JSON数据 构造 前台显示代码
        var _xhtmlArr = jsonToXhtml2(reJsonObject);

        //显示内容
        $("#TbodyTrPage2").html(_xhtmlArr[0]);
        //分页控制条
        $("#PageBar2").html(_xhtmlArr[1]);

        //滚动条回到顶部
        //document.body.scrollTop = 0;


        //跳转页 获取当文本框获取了焦点，按了键盘事件
        $("#PageNumTxt2").keydown(function (event) {
            //alert(event.keyCode);
            if (event.keyCode == "13") {

                //跳转方法
                gotoPage2();

                return false;
            }
        });

        //全不选
        //document.getElementById("SelAllCb").checked = false;

    }
    else {
        $("#TbodyTrPage2").html("<tr><td colspan=\"" + tableColNum2 + "\">没有搜索到相关数据</td></tr>");
    }
}


//---------------------------跳转页---------------------//
function gotoPage2() {

    var pageNum = $("#PageNumTxt2").val()
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
    NumberPage2(pageNum);
}


//===================数据分页222 - 可结算商城订单====================//




//====================数据分页333 - 可结算-线下扫码订单====================//

/******数据分页的变量********/
var strPOSTSe3 = ""; //搜索条件对象 POST参数
var intPageCurrent3 = 1; //当前页
var pageSize3 = 15; //当页的记录条数，与后台保持一致
var recordSum3 = 0; //总记录数
var tableColNum3 = 8; //当前表列数

/*
---------定义搜索函数---------
*/
var searchContent3 = function () {

    intPageCurrent3 = 1; //开始页

    var ShopUserID = "";

    //构造POST参数
    var strPOST = {
        "pageCurrent": "1", "Type": "2", "SettleID": mSettleID
    };

    //翻页所用
    var strPOSTSePush = {
        "ShopUserID": ShopUserID,
    };
    //将对象添加到分类对象中

    //搜索内容用
    var strPOSTSeContent = pushTwoObject(strPOST, strPOSTSePush);

    //分页操作用
    var strPOSTSearch = { "Type": "2" };
    strPOSTSe3 = pushTwoObject(strPOSTSearch, strPOSTSePush);
    console.log(strPOSTSe3);

    //加载提示
    $("#TbodyTrPage3").html("<tr><td colspan=\"" + tableColNum3 + "\">… 数据加载中 …</td></tr>");

    //以POST方式发送异步请求
    $.ajax({
        type: "POST",
        url: mAjaxUrl + "?rnd=" + Math.random(),
        data: strPOSTSeContent,
        dataType: "html",
        success: function (reTxtJson, status, xhr) {
            //显示返回值
            console.log("数据分页3=" + reTxtJson);

            mIsLoadAggreOrderMsg = true;

            if (reTxtJson != "") {

                //分页成功返回，构造显示代码
                pageSuccess3(reTxtJson);

            }
            else {
                //加载提示
                $("#TbodyTrPage3").html("<tr><td colspan=\"" + tableColNum3 + "\">没有搜索到相关数据</td></tr>");
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
function jsonToXhtml3(pJsonObject) {

    //将字符串转换成功JSON对象
    //var json = JSON.parse(pJsonTxt);
    var json = pJsonObject;

    $("#AggreCountSettleOrder").html(json.RecordSum);

    //-----内容显示前台显示代码----//
    var myJsVal = "";
    //循环构造
    for (var i = 0; i < json.DataPage.length; i++) {

        var indexDataPage = json.DataPage[i];
        //var indexDataPage2 = json.DataPage2[i];
        var indexDataPageExtra = json.DataPageExtra[i];

        //计算结算金额 
        var _settleOrderPrice = parseFloat(indexDataPage.OrderPrice) - parseFloat(indexDataPage.CommissionMoney);
        _settleOrderPrice = formatNumberDotDigit(_settleOrderPrice, 2);

        myJsVal += "<tr>";
        myJsVal += " <td><a href=\"../TradingPage/AggreOrderDetail?AOID=" + indexDataPage.AggregateOrderID + "\" target=\"_blank\">" + indexDataPage.AggregateOrderID + "</a></td>";
        myJsVal += " <td>" + indexDataPage.OrderStatus + "</td>";
        myJsVal += " <td>" + indexDataPageExtra.PayWayName + "</td>";
        myJsVal += " <td>&#165;" + indexDataPage.OrderPrice + "</td>";
        myJsVal += " <td>&#165;" + indexDataPage.CommissionMoney + "</td>";
        myJsVal += " <td>&#165;" + _settleOrderPrice + "</td>";
        myJsVal += " <td>" + indexDataPage.PayTime + "</td>";
        myJsVal += " <td>";
        myJsVal += "     <input type=\"button\" class=\"table-btn am-btn am-btn-default am-btn-xs am-text-secondary am-round\" value=\"详情\" onclick=\"window.open('../TradingPage/AggreOrderDetail?AOID=" + indexDataPage.AggregateOrderID + "')\" />";
        myJsVal += " </td>";
        myJsVal += "</tr>";


    }
    //alert(myJsVal);

    //-----分页控制条显示代码-------//
    var pageBarXhtml = "";

    pageBarXhtml += " <li><a href=\"javascript:void(0)\" onclick=\"PrePage3()\">«</a></li>";
    pageBarXhtml += " <li><a href=\"javascript:void(0)\" onclick=\"NumberPage3('1')\">1</a></li>";
    pageBarXhtml += "  <li><span>...</span></li>";


    if ((intPageCurrent3 - 2) > 0) {
        pageBarXhtml += "  <li><a href=\"javascript:void(0)\" onclick=\"NumberPage3('" + (intPageCurrent3 - 2) + "')\">" + (intPageCurrent3 - 2) + "</a></li>";
    }
    if ((intPageCurrent3 - 1) > 0) {
        pageBarXhtml += "  <li><a href=\"javascript:void(0)\" onclick=\"NumberPage3('" + (intPageCurrent3 - 1) + "')\">" + (intPageCurrent3 - 1) + "</a></li>";
    }


    pageBarXhtml += "  <li class=\"am-active\"><a href=\"javascript:void(0)\" onclick=\"NumberPage3('" + json.PageCurrent + "')\">" + json.PageCurrent + "</a></li>";

    //console.log(parseInt(json.PageSum));

    if ((intPageCurrent3 + 1) <= parseInt(json.PageSum)) {
        pageBarXhtml += "  <li><a href=\"javascript:void(0)\" onclick=\"NumberPage3('" + (intPageCurrent3 + 1) + "')\">" + (intPageCurrent3 + 1) + "</a></li>";
    }
    if ((intPageCurrent3 + 2) <= parseInt(json.PageSum)) {
        pageBarXhtml += "  <li><a href=\"javascript:void(0)\" onclick=\"NumberPage3('" + (intPageCurrent3 + 2) + "')\">" + (intPageCurrent3 + 2) + "</a></li>";
    }

    pageBarXhtml += "  <li><span>...</span></li>";
    pageBarXhtml += "  <li><a href=\"javascript:void(0)\" onclick=\"NumberPage3('" + json.PageSum + "')\">" + json.PageSum + "</a></li>";
    pageBarXhtml += "  <li><input type=\"number\" id=\"PageNumTxt3\" class=\"page-go-text am-form-field\" placeholder=\"跳转页\" /></li>";
    pageBarXhtml += "  <li><a href=\"javascript:void(0)\" onclick=\"NextPage3()\">»</a></li>";

    var _pageMsgArr = new Array()
    //内容显示代码 
    _pageMsgArr[0] = myJsVal;
    //控制条件显示代码
    _pageMsgArr[1] = pageBarXhtml;
    //返回数组
    return _pageMsgArr;
}


//------------------------------搜索结果分页-------------------------------//
//具体页
function NumberPage3(pagecurrent) {
    intPageCurrent3 = parseInt(pagecurrent);

    //以GET方式发送分页请求的函数
    sendPageHttpGet3(intPageCurrent3);
}

//上一页
function PrePage3() {
    intPageCurrent3 = intPageCurrent3 - 1;

    console.log("上一页intPageCurrent3=" + intPageCurrent3);

    if (intPageCurrent3 > 0) {

        //以GET方式发送分页请求的函数
        sendPageHttpGet3(intPageCurrent3);

    }
    else {
        intPageCurrent3 = 1;
    }
}


//下一页
function NextPage3() {
    intPageCurrent3 = parseInt(intPageCurrent3) + 1;

    console.log("下一页intPageCurrent3=" + intPageCurrent3);

    console.log("recordSum3=" + recordSum3);
    console.log("pageSize3=" + pageSize3);
    //计算总页数
    var intPageSum3 = recordSum3 % pageSize3 != 0 ? recordSum3 / pageSize3 + 1 : recordSum3 / pageSize3;
    console.log("intPageSum3=" + intPageSum3);
    if (intPageCurrent3 <= parseInt(intPageSum3)) {

        //以GET方式发送分页请求的函数
        sendPageHttpGet3(intPageCurrent3);

    }
    else {
        intPageCurrent3 = parseInt(intPageSum3);
    }

}

//----------------以GET方式发送分页请求的函数-----------------//
var sendPageHttpGet3 = function (intPageCurrent) {
    //构造GET参数
    strPOSTSe3 = pushTwoObject(strPOSTSe3, { "pageCurrent": intPageCurrent });

    //加载提示
    $("#TbodyTrPage3").html("<tr><td colspan=\"" + tableColNum3 + "\">… 数据加载中 …</td></tr>");

    $.ajax({
        type: "GET",
        url: mAjaxUrl + "?rnd=" + Math.random(),
        data: strPOSTSe3,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            //成功返回后的处理函数
            pageSuccess3(reTxt)
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
function pageSuccess3(reTxtJson) {
    if (reTxtJson != "") {

        var reJsonObject = JSON.parse(reTxtJson);
        console.log(reJsonObject);

        //总的记录数
        recordSum3 = reJsonObject.RecordSum;
        pageSize3 = reJsonObject.PageSize;


        //解析JSON数据 构造 前台显示代码
        var _xhtmlArr = jsonToXhtml3(reJsonObject);

        //显示内容
        $("#TbodyTrPage3").html(_xhtmlArr[0]);
        //分页控制条
        $("#PageBar3").html(_xhtmlArr[1]);

        //滚动条回到顶部
        //document.body.scrollTop = 0;


        //跳转页 获取当文本框获取了焦点，按了键盘事件
        $("#PageNumTxt3").keydown(function (event) {
            //alert(event.keyCode);
            if (event.keyCode == "13") {

                //跳转方法
                gotoPage3();

                return false;
            }
        });

        //全不选
        //document.getElementById("SelAllCb").checked = false;

    }
    else {
        $("#TbodyTrPage3").html("<tr><td colspan=\"" + tableColNum3 + "\">没有搜索到相关数据</td></tr>");
    }
}


//---------------------------跳转页---------------------//
function gotoPage3() {

    var pageNum = $("#PageNumTxt3").val()
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
    NumberPage3(pageNum);
}


//===================数据分页333 - 可结算-线下扫码订单====================//




