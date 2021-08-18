//=================售后申请信息====================//

/**-----定义公共变量------**/
//AjaxURL
var mAjaxUrl = "../AfterSale/AfterSaleApplyMsg";

//售后ID
var mApplyID = "";
//订单ID
var mOrderID = "";
//商品ID
var mGoodsID = "";
//售后备注
var mApplyMemo = "";

//OctWapWeb 手机Web端(公众号端)地址域名
var mOctWapWebAddrDomain = "";

/******数据分页的变量********/
var strPOSTSe = ""; //搜索条件对象 POST参数
var intPageCurrent = 1; //当前页
var pageSize = 15; //当页的记录条数，与后台保持一致
var recordSum = 0; //总记录数
var tableColNum = 11; //当前表列数


/**------初始化------**/
$(function () {

    mOctWapWebAddrDomain = $("#hidOctWapWebAddrDomain").val().trim();

    if ($("#hidApplyStatus").val().trim() != "") {
        var _selOrderStatusOption = $("#ApplyStatus_se").find("option");
        for (var i = 0; i < _selOrderStatusOption.length; i++) {
            if ($("#hidApplyStatus").val().trim() == $(_selOrderStatusOption[i]).val().trim()) {

                $(_selOrderStatusOption[i]).attr("selected", true);
                $("#ApplyStatus_se").trigger('changed.selected.amui');

            }
        }
    }

    //初始化加载
    searchContent();

    //搜索按钮单击事件
    $("#btnSearch").click(function () {
        searchContent();
    });

    //初始化核销验证弹窗窗口显示代码
    initPopWinHtmlCheckConfirm();

    //初始化发回售后商品窗口显示代码
    initPopWinHtmlSendExpress();

    //初始化退货签收窗口显示代码
    initPopWinHtmlRefundRecei();

    //初始化拒绝售后窗口显示代码
    initPopWinHtmlRefuseAs();
});



//========================数据分页搜索==============================//

/*
---------定义搜索函数---------
*/
var searchContent = function () {

    intPageCurrent = 1; //开始页

    var ApplyID_se = $("#ApplyID_se").val().trim();
    var OrderID_se = $("#OrderID_se").val().trim();
    var GoodsID_se = $("#GoodsID_se").val().trim();
    var ApplyStatus_se = $("#ApplyStatus_se").val().trim();
    var ServiceType_se = $("#ServiceType_se").val().trim();
    var ServiceWay_se = $("#ServiceWay_se").val().trim();
    var ApplyReason_se = $("#ApplyReason_se").val().trim();
    var WriteDate_se = $("#WriteDate_se").val().trim();


    //构造POST参数
    var strPOST = {
        "pageCurrent": "1", "Type": "1",
    };

    //翻页所用
    var strPOSTSePush = {
        "ApplyID": ApplyID_se, "OrderID": OrderID_se, "GoodsID": GoodsID_se,
        "ApplyStatus": ApplyStatus_se, "ServiceType": ServiceType_se, "ServiceWay": ServiceWay_se, "ApplyReason": ApplyReason_se, "WriteDate": WriteDate_se,
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

        //服务类型 (maintain 维修 barter 换货 , refund 退货)
        var _ServiceType = indexDataPage.ServiceType;
        if (indexDataPage.ServiceType == "maintain") {
            indexDataPage.ServiceType = "维修";
        }
        else if (indexDataPage.ServiceType == "barter") {
            indexDataPage.ServiceType = "换货";
        }
        else if (indexDataPage.ServiceType == "refund") {
            indexDataPage.ServiceType = "退货";
        }

        //售后方式 ( Express 快递售后  , Visiting 上门服务 )
        var _ServiceWay = indexDataPage.ServiceWay;
        if (indexDataPage.ServiceWay == "Express") {
            indexDataPage.ServiceWay = "快递售后";
        }
        else if (indexDataPage.ServiceWay == "Visiting") {
            indexDataPage.ServiceWay = "上门服务";
        }

        myJsVal += " <tr>";        myJsVal += " <td><input type=\"checkbox\" name=\"SelCbItem\" data-orderid=\"" + indexDataPage.OrderID + "\" id=\"SelCbItem_" + indexDataPage.ApplyID + "\" /></td>";        myJsVal += " <td><a href=\"../AfterSalePage/AfterSaleDetail?AID=" + indexDataPage.ApplyID + "\" target=\"_blank\">" + indexDataPage.ApplyID + "</a></td>";        myJsVal += " <td><a href=\"../TradingPage/OrderDetail?OID=" + indexDataPage.OrderID + "\" target=\"_blank\">" + indexDataPage.OrderID + "</a></td>";        myJsVal += " <td><a href=\"" + mOctWapWebAddrDomain + "/Goods/GoodsDetailPreMobileIframe?GID=" + indexDataPage.GoodsID + "\" target=\"_blank\">" + indexDataPage.GoodsID + "<br />" + indexDataPageExtra.GoodsTitle + "</a></td>";        myJsVal += " <td>" + indexDataPage.ApplyStatus + "</td>";        myJsVal += " <td>" + indexDataPage.ServiceType + "</td>";        myJsVal += " <td>" + indexDataPage.ApplyReason + "</td>";        myJsVal += " <td>" + indexDataPage.ServiceWay + "</td>";        myJsVal += " <td>" + indexDataPage.ApplyMemo + "</td>";        myJsVal += " <td>" + indexDataPage.WriteDate + "</td>";        myJsVal += " <td>";        //根据售后状态，构造按钮  -- 售后状态【确认 - 买家发货 - 待商家签收 - 商家处理中 - 商家发回 - 完成】【确认 - 拒绝】【确认 - 待上门 - 上门服务中 - 完成】【确认 - 买家发货 - 退款中 - 已退款 - 完成】        if (indexDataPage.ApplyStatus == "确认") {            myJsVal += "<button class=\"table-btn am-btn am-btn-default am-btn-xs am-text-secondary am-round\" style=\"margin-bottom:2px\" onclick=\"openCheckConfirmWin('" + indexDataPage.ApplyID + "', '" + indexDataPage.OrderID + "', '" + indexDataPage.GoodsID + "', '" + indexDataPage.ApplyMemo + "','Add','Express','" + _ServiceType + "','" + indexDataPage.SpecID + "','" + indexDataPage.ApplyGoodsNum + "')\">审核通过</button>";
            myJsVal += "<button class=\"table-btn am-btn am-btn-default am-btn-xs am-text-secondary am-round\" style=\"margin-bottom:2px\" onclick=\"openRefuseAsWin('" + indexDataPage.ApplyID + "', '" + indexDataPage.OrderID + "', '" + indexDataPage.GoodsID + "')\">拒绝售后</button>";
        }        else if (indexDataPage.ApplyStatus == "买家发货" || indexDataPage.ApplyStatus == "待上门") {            myJsVal += "<button class=\"table-btn am-btn am-btn-default am-btn-xs am-text-secondary am-round\" style=\"margin-bottom:2px\" onclick=\"openCheckConfirmWin('" + indexDataPage.ApplyID + "', '" + indexDataPage.OrderID + "', '" + indexDataPage.GoodsID + "', '" + indexDataPage.ApplyMemo + "','Edit','" + _ServiceWay + "','" + _ServiceType + "','" + indexDataPage.SpecID + "','" + indexDataPage.ApplyGoodsNum + "')\">修改审核</button>";        }        else if (indexDataPage.ApplyStatus == "待商家签收") {            if (indexDataPage.ServiceType == "退货") {                myJsVal += "<button class=\"table-btn am-btn am-btn-default am-btn-xs am-text-secondary am-round\" style=\"margin-bottom:2px\" onclick=\"refundReceiAsGoodsShop('" + indexDataPage.ApplyID + "')\">退货签收</button>";            }            else {                myJsVal += "<button class=\"table-btn am-btn am-btn-default am-btn-xs am-text-secondary am-round\" style=\"margin-bottom:2px\" onclick=\"confirmReceiArr('" + indexDataPage.ApplyID + "','" + indexDataPage.OrderID + "')\">确认签收</button>";
            }        }        else if (indexDataPage.ApplyStatus == "商家处理中") {            if (indexDataPage.ServiceType != "退货") {                myJsVal += "<button class=\"table-btn am-btn am-btn-default am-btn-xs am-text-secondary am-round\" style=\"margin-bottom:2px\" onclick=\"openSendExpressWin('" + indexDataPage.ApplyID + "','" + indexDataPage.BuyerUserID + "')\">发回商品</button>";
            }        }        else if (indexDataPage.ApplyStatus == "退款中") {            if (indexDataPage.ServiceType == "退货") {                myJsVal += "<button class=\"table-btn am-btn am-btn-default am-btn-xs am-text-secondary am-round\" style=\"margin-bottom:2px\" onclick=\"refundAsSuccess('" + indexDataPage.ApplyID + "','" + indexDataPage.BuyerUserID + "')\">已退款</button>";
            }        }        else {            myJsVal += "<button class=\"table-btn am-btn am-btn-default am-btn-xs am-text-secondary am-round\" style=\"margin-bottom:2px\" onclick=\"window.open('../AfterSalePage/AfterSaleDetail?AID=" + indexDataPage.ApplyID + "')\">详情</button>";
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


//-------------其他函数-------------//

/**
 * 切换  售后方式 
 * */
function chgServiceWay() {

    //获取值
    var ServiceWayWin = $("#ServiceWayWin").val().trim();

    if (ServiceWayWin == "Express") {

        $("#ExpressAs").show();
        $("#VisitingAs").hide();
    }
    else if (ServiceWayWin == "Visiting") {

        $("#ExpressAs").hide();
        $("#VisitingAs").show();

    }
}

/**
 * 提交售后审核通过信息
 *  @param pServiceType 服务类型 (maintain 维修 barter 换货 , refund 退货)
 * */
function submitAsCheckConfirm(pServiceType) {

    //获取表单信息
    var ServiceWayWin = $("#ServiceWayWin").val().trim();
    var DeliNameWin = $("#DeliNameWin").val().trim();
    var MobileWin = $("#MobileWin").val().trim();
    var DetailAddrWin = $("#DetailAddrWin").val().trim();
    var SendShopManWin = $("#SendShopManWin").val().trim();
    var SendTelNumberWin = $("#SendTelNumberWin").val().trim();
    var ApplyMemoWin = $("#ApplyMemoWin").val().trim();

    var region_province = $("#region_province").val().trim();
    var region_city = $("#region_city").val().trim();
    var region_county = $("#region_county").val().trim();

    RegionCodeArr = region_province + "_" + region_city + "_" + region_county


    //获取表单值
    var RefundMoneyWin = "";
    if (pServiceType == "refund") {
        RefundMoneyWin = $("#RefundMoneyWin").val().trim();
        if (RefundMoneyWin == "") {
            toastWinToDiv("【退款金额】不能为空！", "dragWinDiv");
            $("#RefundMoneyWin").focus();
            return;
        }
    }


    //判断输入
    if (ServiceWayWin == "Express") //快递售后
    {
        if (DeliNameWin == "" || MobileWin == "" || DetailAddrWin == "" || region_county == "") {
            toastWinToDiv("信息填写不完整，请检查！", "dragWinDiv");
            return;
        }
    }
    else if (ServiceWayWin == "Visiting") //上门服务
    {
        if (SendShopManWin == "" || SendTelNumberWin == "") {
            toastWinToDiv("信息填写不完整，请检查！", "dragWinDiv");
            return;
        }
    }

    //构造POST参数
    var dataPOST = {
        "Type": "3", "ApplyID": mApplyID, "OrderID": mOrderID, "ServiceWay": ServiceWayWin, "DeliName": DeliNameWin, "Mobile": MobileWin, "DetailAddr": DetailAddrWin, "SendShopMan": SendShopManWin, "SendTelNumber": SendTelNumberWin, "ApplyMemo": ApplyMemoWin, "RegionCodeArr": RegionCodeArr, "RefundMoney": RefundMoneyWin,
    };
    console.log(dataPOST);

    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: mAjaxUrl + "?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("提交售后审核通过信息=" + reTxt);

            if (reTxt != "") {
                var _jsonReTxt = JSON.parse(reTxt);

                if (_jsonReTxt.ErrMsg != undefined && _jsonReTxt.ErrMsg != null && _jsonReTxt.ErrMsg != "") {
                    toastWinToDiv(_jsonReTxt.ErrMsg, "dragWinDiv");
                    return;
                }

                if (_jsonReTxt.Msg != undefined && _jsonReTxt.Msg != null && _jsonReTxt.Msg != "") {
                    //关闭窗口
                    closeDialogWin();

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

}

/**
 * 批量确认签收，底部按钮
 * */
function confirmReceiArrCb() {

    //获取操作pApplyIDArr 
    var _applyIDArr = getSelectValArr();
    //删除前后的"^"
    _applyIDArr = removeFrontAndBackChar(_applyIDArr, "^")


    if (_applyIDArr == "") {
        toastWin("请选择确认签收的售后信息！");
        return;
    }

    var ApplyIDArr = _applyIDArr.split("^");

    //获取交易号
    var _orderIDArr = "";
    for (var i = 0; i < ApplyIDArr.length; i++) {
        var _orderID = $("#SelCbItem_" + ApplyIDArr[i]).attr("data-orderid");
        _orderIDArr += _orderID + "^"
    }
    //删除前后的"^"
    _orderIDArr = removeFrontAndBackChar(_orderIDArr, "^")

    //批量确认签收售后商品
    confirmReceiArr(_applyIDArr, _orderIDArr);
}

/**
 * 批量确认签收售后商品
 * @param {any} pApplyIDArr 售后ID 拼接字符串 ["^"]
 * @param {any} pOrderIDArr 订单ID 拼接字符串 ["^"]
 */
function confirmReceiArr(pApplyIDArr, pOrderIDArr) {

    confirmWinWidth("确认要签收吗？", function () {

        //构造POST参数
        var dataPOST = {
            "Type": "4", "ApplyIDArr": pApplyIDArr, "OrderIDArr": pOrderIDArr,
        };
        console.log(dataPOST);

        //正式发送异步请求
        $.ajax({
            type: "POST",
            url: mAjaxUrl + "?rnd=" + Math.random(),
            data: dataPOST,
            dataType: "html",
            success: function (reTxt, status, xhr) {
                console.log("批量确认签收售后商品=" + reTxt);

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

/**
 * 商家发回售后商品
 * */
function shopSendAsSendGoods(pApplyID, pBuyerUserID) {

    //获取表单值
    var ExpressNameWin = $("#ExpressNameWin").val().trim();
    var ExpressNumberWin = $("#ExpressNumberWin").val().trim();
    if (ExpressNameWin == "" || ExpressNumberWin == "") {
        toastWinToDiv("【快递名称】【快递单号】都不能为空！", "dragWinDiv");
        return;
    }

    //构造POST参数
    var dataPOST = {
        "Type": "6", "ApplyID": pApplyID, "BuyerUserID": pBuyerUserID, "ExpressName": ExpressNameWin, "ExpressNumber": ExpressNumberWin,
    };
    console.log(dataPOST);

    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: mAjaxUrl + "?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("提交售后审核通过信息=" + reTxt);

            if (reTxt != "") {
                var _jsonReTxt = JSON.parse(reTxt);

                if (_jsonReTxt.ErrMsg != undefined && _jsonReTxt.ErrMsg != null && _jsonReTxt.ErrMsg != "") {
                    toastWinToDiv(_jsonReTxt.ErrMsg, "dragWinDiv");
                    return;
                }

                if (_jsonReTxt.Msg != undefined && _jsonReTxt.Msg != null && _jsonReTxt.Msg != "") {
                    //关闭窗口
                    closeDialogWin();

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


}

/**
 * 商家退货签收
 * @param {any} pApplyID
 */
function refundReceiAsGoodsShop(pApplyID) {

    ////获取表单值
    //var RefundMoneyWin = $("#RefundMoneyWin").val().trim();

    //if (RefundMoneyWin == "") {
    //    toastWinToDiv("【退款金额】不能为空！", "dragWinDiv");
    //    return;
    //}

    confirmWinWidth("确认退货签收?", function () {

        //构造POST参数
        var dataPOST = {
            "Type": "8", "ApplyID": pApplyID, "RefundMoney": "0",
        };
        console.log(dataPOST);

        //正式发送异步请求
        $.ajax({
            type: "POST",
            url: mAjaxUrl + "?rnd=" + Math.random(),
            data: dataPOST,
            dataType: "html",
            success: function (reTxt, status, xhr) {
                console.log("商家退货签收=" + reTxt);

                if (reTxt != "") {
                    var _jsonReTxt = JSON.parse(reTxt);

                    if (_jsonReTxt.ErrMsg != undefined && _jsonReTxt.ErrMsg != null && _jsonReTxt.ErrMsg != "") {
                        toastWinToDiv(_jsonReTxt.ErrMsg, "dragWinDiv");
                        return;
                    }

                    if (_jsonReTxt.Msg != undefined && _jsonReTxt.Msg != null && _jsonReTxt.Msg != "") {
                        //关闭窗口
                        closeDialogWin();

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


/**
 * 售后 商家已退款操作
 * @param {any} pApplyID
 * @param {any} pBuyerUserID
 */
function refundAsSuccess(pApplyID, pBuyerUserID) {

    confirmWinWidth("确认已退款吗？否则会引起投诉", function () {

        //构造POST参数
        var dataPOST = {
            "Type": "9", "ApplyID": pApplyID, "BuyerUserID": pBuyerUserID,
        };
        console.log(dataPOST);

        //正式发送异步请求
        $.ajax({
            type: "POST",
            url: mAjaxUrl + "?rnd=" + Math.random(),
            data: dataPOST,
            dataType: "html",
            success: function (reTxt, status, xhr) {
                console.log("确认已退款=" + reTxt);

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

/**
 * 商家拒绝售后
 * @param {any} pApplyID
 */
function submitRefuseAsExplain(pApplyID) {

    //获取表单值
    var ReplyExplain = $("#ReplyExplainWin").val().trim();
    if (ReplyExplain == "") {
        toastWinToDiv("请认真填写拒绝售后的理由和说明！", "dragWinDiv");
        $("#ReplyExplainWin").focus();
        return;
    }

    //构造POST参数
    var dataPOST = {
        "Type": "10", "ApplyID": pApplyID, "ReplyExplain": ReplyExplain,
    };
    console.log(dataPOST);

    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: mAjaxUrl + "?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("拒绝售后=" + reTxt);

            if (reTxt != "") {
                var _jsonReTxt = JSON.parse(reTxt);

                if (_jsonReTxt.ErrMsg != undefined && _jsonReTxt.ErrMsg != null && _jsonReTxt.ErrMsg != "") {
                    toastWinToDiv(_jsonReTxt.ErrMsg, "dragWinDiv");
                    return;
                }

                if (_jsonReTxt.Msg != undefined && _jsonReTxt.Msg != null && _jsonReTxt.Msg != "") {

                    //关闭窗口
                    closeDialogWin();

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



}


//--------------审核确认弹出窗口------------//

var mPopWinHtmlCheckConfirm = "";
/**
 * 初始化核销验证弹窗窗口显示代码
 */
function initPopWinHtmlCheckConfirm() {
    //获取窗口显示代码
    mPopWinHtmlCheckConfirm = $("#CheckConfirmWin").html();
    $("#CheckConfirmWin").empty();
}

/**
 * 打开审核确认窗口
 * @param pExeType  操作类型 [Add / Edit]
 * @param pServiceWay 售后方式 ( Express 快递售后  , Visiting 上门服务 )
 * @param pServiceType 服务类型 (maintain 维修 barter 换货 , refund 退货)
 */
function openCheckConfirmWin(pApplyID, pOrderID, pGoodsID, pApplyMemo, pExeType, pServiceWay, pServiceType, pSpecID, pApplyGoodsNum) {

    mApplyID = pApplyID;
    mOrderID = pOrderID;
    mGoodsID = pGoodsID;
    mApplyMemo = pApplyMemo;

    if (pServiceWay == "") {
        pServiceWay = "Express";
    }

    //窗口标题
    var _winTitle = "维修";
    if (pServiceType == "barter") {
        _winTitle = "换货";
    }
    else if (pServiceType == "refund") {
        _winTitle = "退货";
    }

    //打开Dialog弹出窗口
    openDialogWinNoClose(_winTitle + "-审核确认", mPopWinHtmlCheckConfirm, function () {

        //审核确认操作
        submitAsCheckConfirm(pServiceType);

    }, function () {


    }, 600);

    if (pExeType == "Add") {

        //初始化商家审核售后信息，售后地址信息，上门服务信息
        initAfterSaleCheckMsg(0, pServiceWay)
    }
    else if (pExeType == "Edit") {

        //加载指定的审核信息
        initAfterSaleCheckMsg(mApplyID, pServiceWay)
    }

    //console.log("pServiceType=" + pServiceType);
    //如果是退款
    if (pServiceType == "refund") {
        //初始化售后申请的订单商品信息
        initAsOrderGoodsMsg(pApplyID, pOrderID, pGoodsID, pSpecID, pApplyGoodsNum, pExeType);
        $("#RefundMsg").show();
    }

}

/**
 * 初始化商家审核售后信息，售后地址信息，上门服务信息
 * @param  pApplyID 如果为 0 侧表示不是修改初始化
 * */
function initAfterSaleCheckMsg(pApplyID, pServiceWay) {


    //构造POST参数
    var dataPOST = {
        "Type": "2", "ApplyID": pApplyID
    };
    console.log(dataPOST);

    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: mAjaxUrl + "?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("初始化商家审核售后信息=" + reTxt);

            if (reTxt != "") {
                var _jsonReTxt = JSON.parse(reTxt);

                //赋值表单
                $("#ApplyIDA").attr("href", "../AfterSalePage/AfterSaleDetail?AID=" + mApplyID);
                $("#ApplyIDA").html(mApplyID);
                $("#OrderIDA").attr("href", "../TradingPage/OrderDetail?OID=" + mOrderID);
                $("#OrderIDA").html(mOrderID);
                $("#GoodsIDA").attr("href", "" + mOctWapWebAddrDomain + "/Goods/GoodsDetailPreMobileIframe?GID=" + mGoodsID);
                $("#GoodsIDA").html(mGoodsID);

                $("#ApplyMemoWin").val(mApplyMemo);
                $("#ServiceWayWin").val(pServiceWay);

                if (_jsonReTxt.AfterSaleDelivery != null && _jsonReTxt.AfterSaleDelivery != undefined && _jsonReTxt.AfterSaleDelivery != "") {
                    $("#DeliNameWin").val(_jsonReTxt.AfterSaleDelivery.DeliName);
                    $("#MobileWin").val(_jsonReTxt.AfterSaleDelivery.Mobile);
                    $("#DetailAddrWin").val(_jsonReTxt.AfterSaleDelivery.DetailAddr);

                    var _RegionCodeArr = _jsonReTxt.AfterSaleDelivery.RegionCodeArr.split("_");
                    //初始化省市县区域范围值
                    initRegionCodeNameDefaultVal(_RegionCodeArr[0], _RegionCodeArr[1], _RegionCodeArr[2]);
                }
                else {
                    //初始化区域
                    initRegionCodeName();
                }


                if (_jsonReTxt.AfterSaleSendGoods != null && _jsonReTxt.AfterSaleSendGoods != undefined && _jsonReTxt.AfterSaleSendGoods != "") {

                    $("#SendShopManWin").val(_jsonReTxt.AfterSaleSendGoods.SendShopMan);
                    $("#SendTelNumberWin").val(_jsonReTxt.AfterSaleSendGoods.SendTelNumber);

                }

                //退款金额信息
                if (_jsonReTxt.AfterSaleApplyMsg != null && _jsonReTxt.AfterSaleApplyMsg != undefined) {

                    $("#RefundMoneyWin").val(formatNumberDotDigit(_jsonReTxt.AfterSaleApplyMsg.RefundMoney));
                }

                //切换售后方式
                chgServiceWay();
            }
        },
        error: function (xhr, errorTxt, status) {
            console.log("异步请求错误，errorTxt=" + errorTxt + " | status=" + status);
            return;
        }
    });
}


//--------------发回售后商品窗口------------//

var mPopWinHtmlSendExpress = "";
/**
 * 初始化发回售后商品窗口显示代码
 */
function initPopWinHtmlSendExpress() {
    //获取窗口显示代码
    mPopWinHtmlSendExpress = $("#SendExpressWin").html();
    $("#SendExpressWin").empty();
}

/**
 * 打开发回售后商品窗口
 * @param {any} pApplyID 售后ID
 * @param {any} pBuyerUserID 买家UserID
 */
function openSendExpressWin(pApplyID, pBuyerUserID) {


    //打开Dialog弹出窗口
    openDialogWinNoClose("发回售后商品", mPopWinHtmlSendExpress, function () {

        //商家发回售后商品
        shopSendAsSendGoods(pApplyID, pBuyerUserID);

    }, function () {


    }, 600);

    //初始化 售后买家收货信息,上门服务地址
    initAsBuyerDelivery(pApplyID, pBuyerUserID);
}

/**
 * 初始化 售后买家收货信息,上门服务地址
 * @param {any} pApplyID 售后ID
 * @param {any} pBuyerUserID 买家UserID
 */
function initAsBuyerDelivery(pApplyID, pBuyerUserID) {

    //构造POST参数
    var dataPOST = {
        "Type": "5", "ApplyID": pApplyID, "BuyerUserID": pBuyerUserID,
    };
    console.log(dataPOST);

    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: mAjaxUrl + "?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("初始化 售后买家收货信息,上门服务地址=" + reTxt);

            if (reTxt != "") {
                var _jsonReTxt = JSON.parse(reTxt);

                $("#DeliNameWin").html(_jsonReTxt.DeliName);
                $("#MobileWin").html(_jsonReTxt.Mobile);
                $("#DetailAddrWin").html(_jsonReTxt.RegionNameArr + "_" + _jsonReTxt.DetailAddr);

                $("#ApplyIDA").attr("href", "../AfterSalePage/AfterSaleDetail?AID=" + pApplyID);
                $("#ApplyIDA").html(pApplyID);

            }
        },
        error: function (xhr, errorTxt, status) {
            console.log("异步请求错误，errorTxt=" + errorTxt + " | status=" + status);
            return;
        }
    });


}


//--------------退货签收窗口------------//

var mPopWinHtmlRefundRecei = "";
/**
 * 初始化退货签收窗口显示代码
 */
function initPopWinHtmlRefundRecei() {
    //获取窗口显示代码
    mPopWinHtmlRefundRecei = $("#RefundReceiWin").html();
    $("#RefundReceiWin").empty();
}

/**
 * 打开退货签收窗口
 * @param {any} pApplyID 售后ID
 */
function openRefundReceiWin(pApplyID, pOrderID, pGoodsID, pSpecID, pApplyGoodsNum) {


    //打开Dialog弹出窗口
    openDialogWinNoClose("退货签收", mPopWinHtmlRefundRecei, function () {

        //商家退货签收
        refundReceiAsGoodsShop(pApplyID)

    }, function () {


    }, 600);

    //初始化售后申请的订单商品信息
    initAsOrderGoodsMsg(pApplyID, pOrderID, pGoodsID, pSpecID, pApplyGoodsNum);
}

/**
 * 初始化售后申请的订单商品信息
 *  @param pExeType  操作类型 [Add / Edit]
 * */
function initAsOrderGoodsMsg(pApplyID, pOrderID, pGoodsID, pSpecID, pApplyGoodsNum, pExeType) {

    if (pExeType == undefined || pExeType == null) {
        pExeType = "";
    }

    //构造POST参数
    var dataPOST = {
        "Type": "7", "OrderID": pOrderID, "GoodsID": pGoodsID, "SpecID": pSpecID,
    };
    console.log(dataPOST);
    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: mAjaxUrl + "?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("初始化售后申请的订单商品信息=" + reTxt);
            if (reTxt != "") {
                var _jsonReTxt = JSON.parse(reTxt);

                //赋值表单
                $("#ApplyIDA").attr("href", "../AfterSalePage/AfterSaleDetail?AID=" + pApplyID);
                $("#ApplyIDA").html(pApplyID);
                $("#OrderIDA").attr("href", "../TradingPage/OrderDetail?OID=" + pOrderID);
                $("#OrderIDA").html(pOrderID);
                $("#GoodsIDA").attr("href", "" + mOctWapWebAddrDomain + "/Goods/GoodsDetailPreMobileIframe?GID=" + pGoodsID);
                $("#GoodsIDA").html(pGoodsID);

                $("#GoodsUnitPriceSpan").html("&#165;" + _jsonReTxt.GoodsUnitPrice);
                $("#ApplyGoodsNumSpan").html(pApplyGoodsNum);

                if (pExeType != "Edit") {
                    //计算退款金额
                    var _refundMoney = parseFloat(_jsonReTxt.GoodsUnitPrice) * parseInt(pApplyGoodsNum);
                    $("#RefundMoneyWin").val(formatNumberDotDigit(_refundMoney));
                }


            }
        }
    });
}


//--------------拒绝售后窗口------------//

var mPopWinHtmlRefuseAs = "";
/**
 * 初始化拒绝售后窗口显示代码
 */
function initPopWinHtmlRefuseAs() {
    //获取窗口显示代码
    mPopWinHtmlRefuseAs = $("#RefuseAsWin").html();
    $("#RefuseAsWin").empty();
}

/**
 * 打开窗口
 * @param {any} pApplyID 售后ID
 */
function openRefuseAsWin(pApplyID, pOrderID, pGoodsID) {

    //打开Dialog弹出窗口
    openDialogWinNoClose("拒绝售后", mPopWinHtmlRefuseAs, function () {

        //商家拒绝售后
        submitRefuseAsExplain(pApplyID)

    }, function () {


    }, 600);


    //赋值表单
    $("#ApplyIDA").attr("href", "../AfterSalePage/AfterSaleDetail?AID=" + pApplyID);
    $("#ApplyIDA").html(pApplyID);
    $("#OrderIDA").attr("href", "../TradingPage/OrderDetail?OID=" + pOrderID);
    $("#OrderIDA").html(pOrderID);
    $("#GoodsIDA").attr("href", "" + mOctWapWebAddrDomain + "/Goods/GoodsDetailPreMobileIframe?GID=" + pGoodsID);
    $("#GoodsIDA").html(pGoodsID);

}



