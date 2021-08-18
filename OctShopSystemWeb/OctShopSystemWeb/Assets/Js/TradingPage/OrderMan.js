//=================订单管理====================//

/**-----定义公共变量------**/

//AjaxURL
var mAjaxUrl = "../Trading/OrderMan";

//订单ID
var mOrderID = "";
//订单状态
var mOrderStatus = "";
//OctWapWeb 手机Web端(公众号端)地址域名
var mOctWapWebAddrDomain = "";

/********弹出窗口相关*********/
//窗口的Html显示代码
var mPopWinHtml = "";

/******数据分页的变量********/
var strPOSTSe = ""; //搜索条件对象 POST参数
var intPageCurrent = 1; //当前页
var pageSize = 15; //当页的记录条数，与后台保持一致
var recordSum = 0; //总记录数
var tableColNum = 12; //当前表列数


/**------初始化------**/
$(function () {

    mOctWapWebAddrDomain = $("#hidOctWapWebAddrDomain").val().trim();

    if ($("#hidOrderStatus").val().trim() != "") {
        var _selOrderStatusOption = $("#OrderStatus_se").find("option");
        for (var i = 0; i < _selOrderStatusOption.length; i++) {
            if ($("#hidOrderStatus").val().trim() == $(_selOrderStatusOption[i]).val().trim()) {

                $(_selOrderStatusOption[i]).attr("selected", true);
                $("#OrderStatus_se").trigger('changed.selected.amui');

            }
        }
        //$('#OrderStatus_se').find('option').eq(1).attr('selected', true);
        //$("#OrderStatus_se").trigger('changed.selected.amui');
    }


    //初始化加载
    searchContent();

    //搜索按钮单击事件
    $("#btnSearch").click(function () {
        searchContent();
    });

    //初始化添加窗口显示代码
    initPopWinHtml();
    //初始化核销验证弹窗窗口显示代码
    initPopWinHtmlCheckOrder();
    //初始化价格修改弹窗窗口显示代码
    initPopWinHtmlEditPrice();

});


/*
---------定义搜索函数---------
*/
var searchContent = function () {

    intPageCurrent = 1; //开始页

    var OrderID_se = $("#OrderID_se").val().trim();
    var BillNumber_se = $("#BillNumber_se").val().trim();
    var GoodsIDArr_se = $("#GoodsIDArr_se").val().trim();
    var OrderStatus_se = $("#OrderStatus_se").val().trim();
    var OrderPrice_se = $("#OrderPrice_se").val().trim();
    var PayWay_se = $("#PayWay_se").val().trim();
    var ExpressType_se = $("#ExpressType_se").val().trim();
    var IsSettle_se = $("#IsSettle_se").val().trim();
    var IsRefund_se = $("#IsRefund_se").val().trim();
    var OrderTime_se = $("#OrderTime_se").val().trim();
    var IsSk_se = $("#IsSk_se").val().trim();
    var IsGroup_se = $("#IsGroup_se").val().trim();


    //构造POST参数
    var strPOST = {
        "pageCurrent": "1", "Type": "1",
    };

    //翻页所用
    var strPOSTSePush = {
        "OrderID": OrderID_se, "BillNumber": BillNumber_se, "GoodsIDArr": GoodsIDArr_se,
        "OrderStatus": OrderStatus_se, "OrderPrice": OrderPrice_se, "PayWay": PayWay_se, "ExpressType": ExpressType_se, "IsSettle": IsSettle_se, "IsRefund": IsRefund_se,
        "OrderTime": OrderTime_se, "IsSk": IsSk_se, "IsGroup": IsGroup_se,
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

    //将字符串转换成功JSON对象
    //var json = JSON.parse(pJsonTxt);
    var json = pJsonObject;

    //-----内容显示前台显示代码----//
    var myJsVal = "";    //循环构造    for (var i = 0; i < json.DataPage.length; i++) {

        var indexDataPage = json.DataPage[i];
        var indexDataPageExtra = json.DataPageExtra[i];


        //构造GoodsIDArr显示字符串
        var _xhtmlGoodsIDArr = "";
        var _goodsIDArr = indexDataPage.GoodsIDArr.split("^");
        for (var j = 0; j < _goodsIDArr.length; j++) {

            if (indexDataPage.GroupID != 0 && indexDataPage.GroupID != "") {

                _xhtmlGoodsIDArr += "<a href=\"" + mOctWapWebAddrDomain + "/Goods/GroupDetailPreMobileIframe?GID=" + _goodsIDArr[j] + "\" target=\"_blank\">" + _goodsIDArr[j] + "</a>,"

            }
            else {
                _xhtmlGoodsIDArr += "<a href=\"" + mOctWapWebAddrDomain + "/Goods/GoodsDetailPreMobileIframe?GID=" + _goodsIDArr[j] + "\" target=\"_blank\">" + _goodsIDArr[j] + "</a>,"
            }
        }

        if (indexDataPage.SkGoodsID != 0) {
            _xhtmlGoodsIDArr += "<font color=\"red\">秒杀</font>";
        }
        if (indexDataPage.GroupID != 0 && indexDataPage.GroupID != "") {
            _xhtmlGoodsIDArr += "<font color=\"red\">拼团</font>";
        }


        myJsVal += "<tr>";        myJsVal += " <td><input type=\"checkbox\" data-billnumber=\"" + indexDataPage.BillNumber + "\" name=\"SelCbItem\" id=\"SelCbItem_" + indexDataPage.OrderID + "\" /></td>";        myJsVal += " <td><a href=\"../TradingPage/OrderDetail?OID=" + indexDataPage.OrderID + "\" target=\"_blank\">" + indexDataPage.OrderID + "</a></td>";        myJsVal += " <td>" + indexDataPage.BillNumber + "</td>";        myJsVal += " <td>" + _xhtmlGoodsIDArr + "</td>";        myJsVal += " <td>" + indexDataPage.OrderStatus + "</td>";        myJsVal += " <td>" + indexDataPage.OrderPrice + "</td>";        myJsVal += " <td>" + indexDataPage.PayWay + "<br />" + getPayWayName(indexDataPage.PayWay) + "</td>";        myJsVal += " <td>" + indexDataPage.ExpressType + "<br />" + getExpressTypeName(indexDataPage.ExpressType) + "</td>";        myJsVal += " <td>" + truefalseToChinese(indexDataPage.IsSettle) + "</td>";        myJsVal += " <td>" + truefalseToChinese(indexDataPage.IsRefund) + "</td>";        myJsVal += " <td>" + indexDataPage.OrderTime + "</td>";        myJsVal += " <td>";        myJsVal += "     <button class=\"table-btn am-btn am-btn-default am-btn-xs am-text-secondary am-round\" style=\"margin-bottom:2px\" onclick=\"window.open('../TradingPage/OrderDetail?OID=" + indexDataPage.OrderID + "')\">详情</button>";        //----------构造不同状态的操作按钮---------//        if (indexDataPage.OrderStatus == "待确认") {            myJsVal += "<button class=\"table-btn am-btn am-btn-default am-btn-xs am-text-secondary am-round\" onclick=\"confirmPayDelivery('" + indexDataPage.OrderID + "', '" + indexDataPage.BillNumber + "')\">确认</button>";
        }        if (indexDataPage.OrderStatus == "待付款") {            myJsVal += "<button class=\"table-btn am-btn am-btn-default am-btn-xs am-text-secondary am-round\" onclick=\"openEditPriceWin('" + indexDataPage.OrderID + "','" + indexDataPage.OrderPrice + "')\">修改价格</button>";
        }        if (indexDataPage.OrderStatus == "到店付") {            myJsVal += "<button class=\"table-btn am-btn am-btn-default am-btn-xs am-text-secondary am-round\" onclick=\"confirmOfflinePay('" + indexDataPage.OrderID + "', '" + indexDataPage.BillNumber + "')\">确认到店付</button>";
        }        if (indexDataPage.OrderStatus == "退款中") {            //按钮名称             var _btnName = "同意退款";            if (indexDataPage.PayWay == "Offline") {                _btnName = "已退款";
            }            if (indexDataPage.IsAgreeRefund == "false" || indexDataPage.IsAgreeRefund == "") {                myJsVal += "<button class=\"table-btn am-btn am-btn-default am-btn-xs am-text-secondary am-round\" onclick=\"DealRefund('" + indexDataPage.OrderID + "')\">" + _btnName + "</button>";
            }        }        if (indexDataPage.OrderStatus == "待发货") {            myJsVal += "<button class=\"table-btn am-btn am-btn-default am-btn-xs am-text-secondary am-round\" onclick=\"openSendGoodsWin('" + indexDataPage.OrderID + "','" + indexDataPage.OrderStatus + "')\">发货</button>";
        }        if (indexDataPage.OrderStatus == "待消费/自取") {            myJsVal += "<button class=\"table-btn am-btn am-btn-default am-btn-xs am-text-secondary am-round\" onclick=\"openCheckOrderWin('" + indexDataPage.OrderID + "','" + indexDataPage.BuyerUserID + "')\">核销</button>";
        }        if (indexDataPage.OrderStatus == "待收货") {            myJsVal += "<button class=\"table-btn am-btn am-btn-default am-btn-xs am-text-secondary am-round\" onclick=\"openSendGoodsWin('" + indexDataPage.OrderID + "','" + indexDataPage.OrderStatus + "')\">修改发货</button>";

            if (indexDataPage.PayWay == "PayDelivery") {
                myJsVal += "<button class=\"table-btn am-btn am-btn-default am-btn-xs am-text-secondary am-round\" onclick=\"rejectReceiOrder('" + indexDataPage.OrderID + "')\">买家拒收</button>";
            }
        }        if (indexDataPage.OrderStatus == "待评价") {            //if (indexDataPage.PayWay == "PayDelivery") {
            //    myJsVal += "<button class=\"table-btn am-btn am-btn-default am-btn-xs am-text-secondary am-round\" onclick=\"rejectReceiOrder('" + indexDataPage.OrderID + "')\">买家拒收</button>";
            //}

        }        myJsVal += " </td>";        myJsVal += "</tr>";    }    //alert(myJsVal);    //-----分页控制条显示代码-------//    var pageBarXhtml = "";    pageBarXhtml += " <li><a href=\"javascript:void(0)\" onclick=\"PrePage()\">«</a></li>";    pageBarXhtml += " <li><a href=\"javascript:void(0)\" onclick=\"NumberPage('1')\">1</a></li>";    pageBarXhtml += "  <li><span>...</span></li>";    if ((intPageCurrent - 2) > 0) {
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


//====================其他函数============================//

/**
 * 确认货到付款订单
 * @param {any} pOrderID 订单ID
 * @param {any} pBillNumber 交易号
 */
function confirmPayDelivery(pOrderID, pBillNumber) {

    confirmWinWidth("确认货到付款订单？", function () {

        //构造POST参数
        var dataPOST = {
            "Type": "2", "OrderID": pOrderID, "BillNumber": pBillNumber,
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
                console.log(reTxt);

                //移除加载提示
                closeLoadingWin();

                if (reTxt != "") {
                    var _jsonObj = JSON.parse(reTxt);
                    if (_jsonObj.ErrMsg != "" && _jsonObj.ErrMsg != null && _jsonObj.ErrMsg != undefined) {
                        toastWin(_jsonObj.ErrMsg);
                    }
                    if (_jsonObj.Msg != "" && _jsonObj.Msg != null && _jsonObj.Msg != undefined) {
                        toastWin(_jsonObj.Msg);
                        //重新加载数据
                        NumberPage(intPageCurrent);
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
 * 确认买家已到店付款(商家操作)
 * @param {any} pOrderID 订单ID
 * @param {any} pBillNumber 交易号
 */
function confirmOfflinePay(pOrderID, pBillNumber) {

    confirmWinWidth("确定买家已到店支付吗？", function () {

        //构造POST参数
        var dataPOST = {
            "Type": "4", "OrderID": pOrderID, "BillNumber": pBillNumber,
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
                console.log(reTxt);

                //移除加载提示
                closeLoadingWin();

                if (reTxt != "") {
                    var _jsonObj = JSON.parse(reTxt);
                    if (_jsonObj.ErrMsg != "" && _jsonObj.ErrMsg != null && _jsonObj.ErrMsg != undefined) {
                        toastWin(_jsonObj.ErrMsg);
                        return;
                    }
                    if (_jsonObj.Msg != "" && _jsonObj.Msg != null && _jsonObj.Msg != undefined) {
                        toastWin(_jsonObj.Msg);
                        //重新加载数据
                        NumberPage(intPageCurrent);
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
 * 处理退款申请
 * */
function DealRefund(pOrderID) {


    confirmWinWidth("确定退款吗？", function () {

        //构造POST参数
        var dataPOST = {
            "Type": "5", "OrderID": pOrderID,
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
                console.log(reTxt);

                //移除加载提示
                closeLoadingWin();

                if (reTxt != "") {
                    var _jsonObj = JSON.parse(reTxt);
                    if (_jsonObj.ErrMsg != "" && _jsonObj.ErrMsg != null && _jsonObj.ErrMsg != undefined) {
                        toastWin(_jsonObj.ErrMsg);
                        return;
                    }
                    if (_jsonObj.Msg != "" && _jsonObj.Msg != null && _jsonObj.Msg != undefined) {
                        toastWin(_jsonObj.Msg);
                        //重新加载数据
                        NumberPage(intPageCurrent);
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
 * 得到支付方式名称
 * @param {any} pPayWayCode 支付方式 （WeiXinPay [微信支付], Alipay[支付宝] , Transfer[银行转账] , Offline[线下付款(到店付)], PayDelivery [货到付款]  Balance[余额支付]  Integral [积分支付]）
 */
function getPayWayName(pPayWayCode) {

    if (pPayWayCode == "" || pPayWayCode == undefined) {
        return "未知";
    }

    if (pPayWayCode == "WeiXinPay") {
        return "微信支付";
    }
    else if (pPayWayCode == "Alipay") {
        return "支付宝";
    }
    else if (pPayWayCode == "Balance") {
        return "余额支付";
    }
    else if (pPayWayCode == "Integral") {
        return "积分支付";
    }
    else if (pPayWayCode == "Transfer") {
        return "银行转账";
    }
    else if (pPayWayCode == "Offline") {
        return "到店付";
    }
    else if (pPayWayCode == "PayDelivery") {
        return "货到付款";
    }
}

/**
 * 得到,配送方式名称
 * @param {any} pExpressTypeCode 配送方式（送货上门 express 到店自取 take 到店消费 shop）
 */
function getExpressTypeName(pExpressTypeCode) {
    if (pExpressTypeCode == "express") {
        return "送货上门";
    }
    else if (pExpressTypeCode == "shop" || pExpressTypeCode == "take") {
        return "到店消费/自取";
    }
}

/**
 * 将true / false 转换成功 中文 是 / 否
 * @param {any} pTruefalse true / false
 */
function truefalseToChinese(pTruefalse) {

    if (pTruefalse.toLowerCase() == "true") {
        return "是";
    }
    else if (pTruefalse.toLowerCase() == "false") {
        return "否";
    }

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
 * 确认货到付款订单 --批量操作
 */
function confirmPayDeliveryMul() {

    //获取选择的订单ID拼接字符串
    var _orderIDArr = getSelectValArr();

    if (_orderIDArr == "") {
        toastWin("请选择需操作的订单!");
        return;
    }

    //分解数组
    var _arrOrderID = new Array();
    if (_orderIDArr.indexOf("^") >= 0) {
        _arrOrderID = _orderIDArr.split("^");
    }
    else {
        _arrOrderID = _orderIDArr;
    }
    //获取交易号
    var _billNumberArr = "";
    for (var i = 0; i < _arrOrderID.length; i++) {
        var _billNumber = $("#SelCbItem_" + _arrOrderID[i]).attr("data-billnumber");
        _billNumberArr += _billNumber + "^"
    }
    //删除前后的"^"
    _billNumberArr = removeFrontAndBackChar(_billNumberArr, "^")
    //console.log("_billNumberArr=" + _billNumberArr);


    confirmWinWidth("确认这些货到付款订单？", function () {

        //构造POST参数
        var dataPOST = {
            "Type": "3", "OrderIDArr": _orderIDArr, "BillNumberArr": _billNumberArr,
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
                console.log(reTxt);

                //移除加载提示
                closeLoadingWin();

                if (reTxt != "") {
                    var _jsonObj = JSON.parse(reTxt);
                    if (_jsonObj.ErrMsg != "" && _jsonObj.ErrMsg != null && _jsonObj.ErrMsg != undefined) {
                        alertWinWidth(_jsonObj.ErrMsg, 400);
                    }
                    if (_jsonObj.Msg != "" && _jsonObj.Msg != null && _jsonObj.Msg != undefined) {
                        toastWin(_jsonObj.Msg);
                        //重新加载数据
                        NumberPage(intPageCurrent);
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


//================发货弹窗==================//

/**
 * 初始化添加窗口显示代码
 */
function initPopWinHtml() {
    //获取窗口显示代码
    mPopWinHtml = $("#SendGoodsWin").html();
    $("#SendGoodsWin").empty();
}


/**
 * 打开发货窗口
 * @param {any} pMsgID 信息ID ShopGoodsTypeID
 * @param pOrderStatus 订单状态
 */
function openSendGoodsWin(pOrderID, pOrderStatus) {
    //订单ID
    mOrderID = pOrderID;
    mOrderStatus = pOrderStatus;

    //打开Dialog弹出窗口
    openDialogWinNoClose("发货信息", mPopWinHtml, function () {

        //提交发货送货信息
        submitSendGoods();

    }, function () {


    }, 600);

    $("#OrderIDA").html(mOrderID);

    if (pOrderStatus == "待发货") {
        //初始化订单发货信息
        initOrderSendGoods($("#SendTypeWin").val());
    }
    else if (pOrderStatus == "待收货") {
        //查询订单发货信息
        queryOrderSendGoods();
    }

}

/**
 * 切换发货类型
 */
function chgSendType() {

    var _SendType = $("#SendTypeWin").val();
    //快递发货
    if (_SendType == "Express") {
        $("#ExpressNameLi").show();
        $("#ExpressNumberLi").show();
        $("#SendTelNumberLabel").html("发货电话:");
        $("#SendShopManLi").hide();
    }
    else if (_SendType == "MySend") {
        $("#ExpressNameLi").hide();
        $("#ExpressNumberLi").hide();
        $("#SendTelNumberLabel").html("送货电话:");
        $("#SendShopManLi").show();
    }

    //初始化订单发货信息
    //initOrderSendGoods(_SendType);
}

/**
 * 初始化订单发货信息
 * @param {any} pSendType 送货方式(Express 快递发货， MySend 自己送货)
 */
function initOrderSendGoods(pSendType) {

    //构造POST参数
    var dataPOST = {
        "Type": "6", "SendType": pSendType,
    };
    console.log(dataPOST);

    ////加载提示窗口
    //loadingWinToDiv("dragWinDiv");

    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: mAjaxUrl + "?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("初始化订单发货信息=" + reTxt);

            ////移除加载提示
            //closeLoadingWin();

            if (reTxt != "") {
                var _jsonObj = JSON.parse(reTxt);
                //为表单赋值
                $("#ExpressNameWin").val(_jsonObj.ExpressName);
                $("#SendTelNumberWin").val(_jsonObj.SendTelNumber);
                $("#SendShopManWin").val(_jsonObj.SendShopMan);
            }
        },
        error: function (xhr, errorTxt, status) {
            console.log("异步请求错误，errorTxt=" + errorTxt + " | status=" + status);
            return;
        }
    });
}

/**
 * 查询订单发货信息
 */
function queryOrderSendGoods() {

    //构造POST参数
    var dataPOST = {
        "Type": "8", "OrderID": mOrderID,
    };
    console.log(dataPOST);

    ////加载提示窗口
    //loadingWinToDiv("dragWinDiv");

    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: mAjaxUrl + "?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("查询订单发货信息=" + reTxt);

            ////移除加载提示
            //closeLoadingWin();

            if (reTxt != "") {
                var _jsonObj = JSON.parse(reTxt);
                //为表单赋值
                $("#SendTypeWin").val(_jsonObj.SendType);

                $("#ExpressNameWin").val(_jsonObj.ExpressName);
                $("#ExpressNumberWin").val(_jsonObj.ExpressNumber);
                $("#SendTelNumberWin").val(_jsonObj.SendTelNumber);
                $("#SendShopManWin").val(_jsonObj.SendShopMan);
                $("#SendGoodsMemoWin").val(_jsonObj.SendGoodsMemo);

                if (_jsonObj.SendType == "MySend") {
                    $("#ExpressNumberWin").val("");
                }

                //切换发货类型
                chgSendType();
            }
        },
        error: function (xhr, errorTxt, status) {
            console.log("异步请求错误，errorTxt=" + errorTxt + " | status=" + status);
            return;
        }
    });
}


/**
 * 提交发货送货信息
 * */
function submitSendGoods() {

    //获取表单值
    var SendType = $("#SendTypeWin").val().trim();
    var ExpressName = $("#ExpressNameWin").val().trim();
    var ExpressNumber = $("#ExpressNumberWin").val().trim();
    var SendTelNumber = $("#SendTelNumberWin").val().trim();
    var SendShopMan = $("#SendShopManWin").val().trim();
    var SendGoodsMemo = $("#SendGoodsMemoWin").val().trim();

    var ExeType = "Add";
    if (mOrderStatus == "待收货") {
        ExeType = "Edit";
    }

    if (SendType == "Express") {
        if (ExpressName == "" || ExpressNumber == "" || SendTelNumber == "") {
            toastWinToDiv("【快递名称】【快递单号】【发货电话】都不能为空！", "dragWinDiv");
            return;
        }
    }
    else if (SendType == "MySend") {
        if (SendShopMan == "" || SendTelNumber == "") {
            toastWinToDiv("【送货人姓名】【送货电话】都不能为空！", "dragWinDiv");
            return;
        }
    }

    //构造POST参数
    var dataPOST = {
        "Type": "7", "OrderID": mOrderID, "SendType": SendType, "ExpressName": ExpressName, "ExpressNumber": ExpressNumber, "SendTelNumber": SendTelNumber, "SendShopMan": SendShopMan, "SendGoodsMemo": SendGoodsMemo, "ExeType": ExeType
    };
    console.log(dataPOST);

    //加载提示窗口
    loadingWinToDiv("dragWinDiv");

    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: mAjaxUrl + "?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("提交发货送货信息=" + reTxt);

            //移除加载提示
            closeLoadingWin();

            if (reTxt != "") {
                var _jsonObj = JSON.parse(reTxt);
                if (_jsonObj.ErrMsg != "" && _jsonObj.ErrMsg != null && _jsonObj.ErrMsg != undefined) {
                    toastWinToDiv(_jsonObj.ErrMsg, "dragWinDiv");
                    return;
                }
                if (_jsonObj.Msg != "" && _jsonObj.Msg != null && _jsonObj.Msg != undefined) {
                    toastWinToDivCb(_jsonObj.Msg, function () {

                        //关闭窗口
                        closeDialogWin();
                        //重新加载数据
                        NumberPage(intPageCurrent);

                    }, "dragWinDiv");

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
 * 拒收订单操作
 * @param {any} pOrderID 订单ID
 */
function rejectReceiOrder(pOrderID) {

    confirmWinWidth("确定买家已拒收吗？", function () {

        //构造POST参数
        var dataPOST = {
            "Type": "10", "OrderID": pOrderID,
        };
        console.log(dataPOST);

        //正式发送异步请求
        $.ajax({
            type: "POST",
            url: mAjaxUrl + "?rnd=" + Math.random(),
            data: dataPOST,
            dataType: "html",
            success: function (reTxt, status, xhr) {
                console.log("拒收订单操作=" + reTxt);

                if (reTxt != "") {
                    var _jsonObj = JSON.parse(reTxt);
                    if (_jsonObj.ErrMsg != "" && _jsonObj.ErrMsg != null && _jsonObj.ErrMsg != undefined) {
                        //提示
                        toastWin(_jsonObj.ErrMsg);
                        return;
                    }
                    if (_jsonObj.Msg != "" && _jsonObj.Msg != null && _jsonObj.Msg != undefined) {

                        toastWinCb(_jsonObj.Msg, function () {
                            //重新加载数据
                            NumberPage(intPageCurrent);

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


//================核销验证弹出窗口==================//

var mPopWinHtmlCheckOrder = "";
/**
 * 初始化核销验证弹窗窗口显示代码
 */
function initPopWinHtmlCheckOrder() {
    //获取窗口显示代码
    mPopWinHtmlCheckOrder = $("#CheckOrderWin").html();
    $("#CheckOrderWin").empty();
}


/**
 * 打开核销验证窗口
 */
function openCheckOrderWin(pOrderID, pBuyerUserID) {
    //订单ID
    mOrderID = pOrderID;

    //打开Dialog弹出窗口
    openDialogWinNoClose("核销验证", mPopWinHtmlCheckOrder, function () {

        //核销验证 [待消费/自取]验证
        verifyOrderCheckCode(pOrderID, pBuyerUserID);

    }, function () {


    }, 600);

    $("#OrderIDA").html(pOrderID);
    $("#CheckCodeWin").focus();
}

/**
 * 核销验证 [待消费/自取]验证
 * */
function verifyOrderCheckCode(pOrderID, pBuyerUserID) {

    //获取表单值
    var CheckTypeWin = $("#CheckTypeWin").val().trim();
    var CheckCodeWin = $("#CheckCodeWin").val().trim();
    if (CheckCodeWin == "") {
        toastWinToDiv("【验证码】不能为空！", "dragWinDiv");
        $("#CheckCodeWin").focus();
        return;
    }

    //构造POST参数
    var dataPOST = {
        "Type": "9", "OrderID": pOrderID, "BuyerUserID": pBuyerUserID, "CheckType": CheckTypeWin, "CheckCode": CheckCodeWin,
    };
    console.log(dataPOST);

    //加载提示窗口
    loadingWinToDiv("dragWinDiv");

    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: mAjaxUrl + "?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("验证订单验证码=" + reTxt);

            //移除加载提示
            closeLoadingWin();

            if (reTxt != "") {
                var _jsonObj = JSON.parse(reTxt);
                if (_jsonObj.ErrMsg != "" && _jsonObj.ErrMsg != null && _jsonObj.ErrMsg != undefined) {
                    toastWinToDiv(_jsonObj.ErrMsg, "dragWinDiv");
                    return;
                }
                if (_jsonObj.Msg != "" && _jsonObj.Msg != null && _jsonObj.Msg != undefined) {
                    toastWinToDivCb(_jsonObj.Msg, function () {

                        //关闭窗口
                        closeDialogWin();
                        //重新加载数据
                        NumberPage(intPageCurrent);

                    }, "dragWinDiv");

                }
            }
        },
        error: function (xhr, errorTxt, status) {
            console.log("异步请求错误，errorTxt=" + errorTxt + " | status=" + status);
            return;
        }
    });
}


//================价格修改弹出窗口==================//

var mPopWinHtmlEditPrice = "";
/**
 * 初始化价格修改弹窗窗口显示代码
 */
function initPopWinHtmlEditPrice() {
    //获取窗口显示代码
    mPopWinHtmlEditPrice = $("#EditPriceWin").html();
    $("#EditPriceWin").empty();
}


/**
 * 打开窗口
 */
function openEditPriceWin(pOrderID, pOrderPrice) {
    //订单ID
    mOrderID = pOrderID;

    //打开Dialog弹出窗口
    openDialogWinNoClose("订单价格修改", mPopWinHtmlEditPrice, function () {

        //订单价格修改
        modifyOrderPrice(pOrderID);

    }, function () {


    }, 600);

    $("#OrderIDA").html(pOrderID);
    $("#OrderIDA").attr("href", "../TradingPage/OrderDetail?OID=" + pOrderID);
    $("#OrderPriceWin").val(pOrderPrice);
    $("#OrderPriceWin").focus();
}

/**
 * 订单价格修改
 * @param {any} pOrderID
 * @param {any} pOrderPrice
 */
function modifyOrderPrice(pOrderID) {

    //获取表单值
    var OrderPriceWin = $("#OrderPriceWin").val().trim();
    if (OrderPriceWin == "") {
        toastWinToDiv("【订单价格】不能为空！", "dragWinDiv");
        $("#OrderPriceWin").focus();
        return;
    }

    //构造POST参数
    var dataPOST = {
        "Type": "11", "OrderID": pOrderID, "OrderPrice": OrderPriceWin,
    };
    console.log(dataPOST);

    //加载提示窗口
    loadingWinToDiv("dragWinDiv");

    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: mAjaxUrl + "?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("订单价格修改=" + reTxt);

            //移除加载提示
            closeLoadingWin();

            if (reTxt != "") {
                var _jsonObj = JSON.parse(reTxt);
                if (_jsonObj.ErrMsg != "" && _jsonObj.ErrMsg != null && _jsonObj.ErrMsg != undefined) {
                    toastWinToDiv(_jsonObj.ErrMsg, "dragWinDiv");
                    return;
                }
                if (_jsonObj.Msg != "" && _jsonObj.Msg != null && _jsonObj.Msg != undefined) {
                    toastWinToDivCb(_jsonObj.Msg, function () {

                        //关闭窗口
                        closeDialogWin();
                        //重新加载数据
                        NumberPage(intPageCurrent);

                    }, "dragWinDiv");

                }
            }
        },
        error: function (xhr, errorTxt, status) {
            console.log("异步请求错误，errorTxt=" + errorTxt + " | status=" + status);
            return;
        }
    });

}

