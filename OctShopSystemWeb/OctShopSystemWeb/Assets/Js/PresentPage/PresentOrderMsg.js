//=================礼品订单管理====================//

/**-----定义公共变量------**/

//AjaxURL
var mAjaxUrl = "../Present/PresentOrderMsg";

var mOctWapWebAddrDomain = "";

var mPstOrderID = ""; //礼品订单ID
var mOrderStatus = ""; //订单状态
var mSendGoodsID = "0"; //发货信息ID

/********弹出窗口相关*********/

//窗口的Html显示代码
var mPopWinHtml = "";

/******数据分页的变量********/
var strPOSTSe = ""; //搜索条件对象 POST参数
var intPageCurrent = 1; //当前页
var pageSize = 15; //当页的记录条数，与后台保持一致
var recordSum = 0; //总记录数
var tableColNum = 10; //当前表列数


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
    }


    //初始化加载
    searchContent();

    //搜索按钮单击事件
    $("#btnSearch").click(function () {
        searchContent();
    });

    //初始化添加窗口显示代码
    initPopWinHtml();

    //核销验证弹出窗口
    initPopWinHtmlCheckOrder();

});


/*
---------定义搜索函数---------
*/
var searchContent = function () {

    intPageCurrent = 1; //开始页

    var PstOrderID_se = $("#PstOrderID_se").val().trim();
    var BillNumber_se = $("#BillNumber_se").val().trim();
    var PresentIDArr_se = $("#PresentIDArr_se").val().trim();
    var OrderStatus_se = $("#OrderStatus_se").val().trim();
    var OrderPrice_se = $("#OrderPrice_se").val().trim();
    var ExpressType_se = $("#ExpressType_se").val().trim();
    var IsPinkage_se = $("#IsPinkage_se").val().trim();
    var OrderTime_se = $("#OrderTime_se").val().trim();


    //构造POST参数
    var strPOST = {
        "pageCurrent": "1", "Type": "1",
    };

    //翻页所用
    var strPOSTSePush = {
        "PstOrderID": PstOrderID_se, "BillNumber": BillNumber_se, "PresentIDArr": PresentIDArr_se,
        "OrderStatus": OrderStatus_se, "OrderPrice": OrderPrice_se, "ExpressType": ExpressType_se, "IsPinkage": IsPinkage_se, "OrderTime": OrderTime_se,
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

        var _ExpressType = "送货上门(快递)";
        if (indexDataPage.ExpressType == "shop") {
            _ExpressType = "到店消费/自取";
        }

        var _IsPinkage = "是";
        if (indexDataPage.ExpressType == "false") {
            _IsPinkage = "否";
        }

        myJsVal += "<tr>";        myJsVal += " <td><input type=\"checkbox\" /></td>";        myJsVal += " <td><a href=\"../PresentPage/PresentOrderDetail?POID=" + indexDataPage.PstOrderID + "\" target=\"_blank\">" + indexDataPage.PstOrderID + "</a></td>";        myJsVal += " <td>" + indexDataPage.BillNumber + "</td>";        myJsVal += " <td><a href=\"" + mOctWapWebAddrDomain + "/Present/PresentDetailPreMobileIframe?PID=" + indexDataPage.PresentIDArr + "\" target=\"_blank\">" + indexDataPage.PresentIDArr + "</a><br />" + indexDataPageExtra.PresentTitle + "</td>";        myJsVal += " <td>" + indexDataPage.OrderStatus + "</td>";        myJsVal += " <td>" + formatNumberDotDigit(indexDataPage.OrderPrice, 2) + "</td>";        myJsVal += " <td>" + _ExpressType + "</td>";        myJsVal += " <td>" + _IsPinkage + "</td>";        myJsVal += " <td>" + indexDataPage.OrderTime + "</td>";        myJsVal += " <td>";        myJsVal += "     <button class=\"table-btn am-btn am-btn-default am-btn-xs am-text-secondary am-round\" style=\"margin-bottom:2px\" onclick=\"window.open('../PresentPage/PresentOrderDetail?POID=" + indexDataPage.PstOrderID + "')\">详情</button>";        if (indexDataPage.OrderStatus == "待发货") {            myJsVal += "<button class=\"table-btn am-btn am-btn-default am-btn-xs am-text-secondary am-round\" onclick=\"openSendGoodsWin('" + indexDataPage.PstOrderID + "','" + indexDataPage.OrderStatus + "')\">发货</button>";
        }        if (indexDataPage.OrderStatus == "待收货") {            myJsVal += "<button class=\"table-btn am-btn am-btn-default am-btn-xs am-text-secondary am-round\" onclick=\"openSendGoodsWin('" + indexDataPage.PstOrderID + "','" + indexDataPage.OrderStatus + "')\">修改发货</button>";
        }        if (indexDataPage.OrderStatus.indexOf('待消费') >= 0) {            myJsVal += "<button class=\"table-btn am-btn am-btn-default am-btn-xs am-text-secondary am-round\" onclick=\"openCheckOrderWin('" + indexDataPage.PstOrderID + "', '" + indexDataPage.BuyerUserID + "')\">核销</button>";
        }        myJsVal += " </td>";        myJsVal += "</tr>";    }    //alert(myJsVal);    //-----分页控制条显示代码-------//    var pageBarXhtml = "";    pageBarXhtml += " <li><a href=\"javascript:void(0)\" onclick=\"PrePage()\">«</a></li>";    pageBarXhtml += " <li><a href=\"javascript:void(0)\" onclick=\"NumberPage('1')\">1</a></li>";    pageBarXhtml += "  <li><span>...</span></li>";    if ((intPageCurrent - 2) > 0) {
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


//=======================其他自定义函数=====================//


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
function openSendGoodsWin(pPstOrderID, pOrderStatus) {
    //订单ID
    mPstOrderID = pPstOrderID;
    mOrderStatus = pOrderStatus;

    //打开Dialog弹出窗口
    openDialogWinNoClose("发货信息", mPopWinHtml, function () {

        //发货和更改 - 礼品订单发货信息操作
        proPresentOrderSendGoods();

    }, function () {


    }, 600);

    $("#OrderIDA").html(mPstOrderID);


    if (pOrderStatus == "待发货") {
        //初始化礼品订单发货信息
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

}

/**
 * 初始化订单发货信息
 * @param {any} pSendType 送货方式(Express 快递发货， MySend 自己送货)
 */
function initOrderSendGoods(pSendType) {

    //构造POST参数
    var dataPOST = {
        "Type": "3", "SendType": pSendType,
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
            console.log("初始化礼品订单发货信息=" + reTxt);

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
        "Type": "4", "PstOrderID": mPstOrderID,
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

                mSendGoodsID = _jsonObj.SendGoodsID


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
 * 发货和更改 - 礼品订单发货信息操作
 * */
function proPresentOrderSendGoods() {

    //获取表单值
    var SendType = $("#SendTypeWin").val().trim();
    var ExpressName = $("#ExpressNameWin").val().trim();
    var ExpressNumber = $("#ExpressNumberWin").val().trim();
    var SendTelNumber = $("#SendTelNumberWin").val().trim();
    var SendShopMan = $("#SendShopManWin").val().trim();
    var SendGoodsMemo = $("#SendGoodsMemoWin").val().trim();

    console.log("mSendGoodsID=" + mSendGoodsID);
    console.log("mOrderStatus=" + mOrderStatus);

    var ExeType = "Add";
    if (mOrderStatus == "待收货") {
        ExeType = "Edit";
    }

    if (ExeType == "Add") {
        mSendGoodsID = "0";
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
        "Type": "2", "PstOrderID": mPstOrderID, "SendType": SendType, "ExpressName": ExpressName, "ExpressNumber": ExpressNumber, "SendTelNumber": SendTelNumber, "SendShopMan": SendShopMan, "SendGoodsMemo": SendGoodsMemo, "ExeType": ExeType, "SendGoodsID": mSendGoodsID,
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
function openCheckOrderWin(pPstOrderID, pBuyerUserID) {
    //订单ID
    mPstOrderID = pPstOrderID;

    //打开Dialog弹出窗口
    openDialogWinNoClose("核销验证", mPopWinHtmlCheckOrder, function () {

        //核销验证 [待消费/自取]验证
        verifyOrderCheckCode(pPstOrderID, pBuyerUserID);

    }, function () {


    }, 600);

    $("#OrderIDA").html(pPstOrderID);
    $("#CheckCodeWin").focus();
}

/**
 * 核销验证 [待消费/自取]验证
 * */
function verifyOrderCheckCode(pPstOrderID, pBuyerUserID) {

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
        "Type": "2", "ExtraData": pPstOrderID, "BuyerUserID": pBuyerUserID, "VerifyType": CheckTypeWin, "VerifyCode": CheckCodeWin,
    };
    console.log(dataPOST);

    //加载提示窗口
    loadingWinToDiv("dragWinDiv");

    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: "../VerifyCode/VerifyCodeAll?rnd=" + Math.random(),
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

