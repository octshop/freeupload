//=============投诉信息处理===================//

/**-----定义公共变量------**/

//AjaxURL
var mAjaxUrl = "../AfterSaleAccCus/OrderComplainMsg";

var mComplainID = "";

//添加或编辑窗口的Html显示代码
var mAddEditWinHtml = "";

var mhidOctWapWebAddrDomain = "";

/**------初始化------**/
$(function () {

    if ($("#hidComplainStatus").val().trim() != "") {
        var _selOption = $("#ComplainStatus_se").find("option");
        for (var i = 0; i < _selOption.length; i++) {
            if ($("#hidComplainStatus").val().trim() == $(_selOption[i]).val().trim()) {

                $(_selOption[i]).attr("selected", true);
                $("#ComplainStatus_se").trigger('changed.selected.amui');
                break;
            }
        }
    }

    mhidOctWapWebAddrDomain = $("#hidOctWapWebAddrDomain").val().trim();

    //初始化加载
    searchContent();

    //搜索按钮单击事件
    $("#btnSearch").click(function () {
        searchContent();
    });

    //初始化添加窗口显示代码
    initAddEditWinHtml();

});



//===========================数据搜索分页=========================//

/******数据分页的变量********/
var strPOSTSe = ""; //搜索条件对象 POST参数
var intPageCurrent = 1; //当前页
var pageSize = 15; //当页的记录条数，与后台保持一致
var recordSum = 0; //总记录数
var tableColNum = 9; //当前表列数


/*
---------定义搜索函数---------
*/
var searchContent = function () {

    intPageCurrent = 1; //开始页

    var ComplainID_se = $("#ComplainID_se").val().trim();
    var ComplainContent_se = $("#ComplainContent_se").val().trim();
    var ShopReply_se = $("#ShopReply_se").val().trim();
    var ComplainReply_se = $("#ComplainReply_se").val().trim();
    var OrderID_se = $("#OrderID_se").val().trim();
    var ExtraData_se = $("#ExtraData_se").val().trim();
    var BuyerUserID_se = $("#BuyerUserID_se").val().trim();
    var ShopUserID_se = $("#ShopUserID_se").val().trim();
    var ComplainCategory_se = $("#ComplainCategory_se").val().trim();
    var ComplainType_se = $("#ComplainType_se").val().trim();
    var ComplainStatus_se = $("#ComplainStatus_se").val().trim();
    var IsLock_se = $("#IsLock_se").val().trim();
    var ShopReplyDate_se = $("#ShopReplyDate_se").val().trim();
    var ReplyDate_se = $("#ReplyDate_se").val().trim();
    var WriteDate_se = $("#WriteDate_se").val().trim();

    //构造POST参数
    var strPOST = {
        "pageCurrent": "1", "Type": "1"
    };

    //翻页所用
    var strPOSTSePush = {
        "ComplainID": ComplainID_se, "ComplainContent": ComplainContent_se, "ShopReply": ShopReply_se, "ComplainReply": ComplainReply_se,
        "OrderID": OrderID_se, "ExtraData": ExtraData_se, "BuyerUserID": BuyerUserID_se, "ShopUserID": ShopUserID_se, "ComplainCategory": ComplainCategory_se, "ComplainType": ComplainType_se, "ComplainStatus": ComplainStatus_se, "IsLock": IsLock_se, "ShopReplyDate": ShopReplyDate_se, "ReplyDate": ReplyDate_se, "WriteDate": WriteDate_se,


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
    var myJsVal = "";
    //循环构造
    for (var i = 0; i < json.DataPage.length; i++) {

        var indexDataPage = json.DataPage[i];
        var indexDataPageExtra = json.DataPageExtra[i];

        var _ExtraDataHref = "#";
        if (indexDataPage.ComplainCategory == "order") {
            _ExtraDataHref = "../TradingPage/OrderDetail?OID=" + indexDataPage.ExtraData;
        }
        else if (indexDataPage.ComplainCategory == "aftersale") {
            _ExtraDataHref = "../AfterSaleAccCusPage/AfterSaleDetail?AID=20046" + indexDataPage.ExtraData;
        }
        else if (indexDataPage.ComplainCategory == "PresentOrder") {
            _ExtraDataHref = "../TradingPage/PresentOrderDetail?POID=" + indexDataPage.ExtraData;
        }
        else if (indexDataPage.ComplainCategory == "shop") {
            _ExtraDataHref = "" + mhidOctWapWebAddrDomain + "/Mall/PagePreMobileIframe?LoadPreURL=" + mhidOctWapWebAddrDomain + "/Shop/Index?SID=" + indexDataPage.ExtraData;
        }

        myJsVal += "<tr>";
        myJsVal += " <td>" + indexDataPage.ComplainID + "<i style=\"color: #939393;display:block\"><a href=\"../TradingPage/OrderDetail?OID=" + indexDataPage.OrderID + "\" target=\"_blank\">" + indexDataPage.OrderID + "</a></i></td>";
        myJsVal += " <td>" + indexDataPage.BuyerUserID + "<i style=\"color: #939393;display: block\"><a href=\"../UserGoodsShopPage/ShopMsgDetail?UserID=" + indexDataPage.ShopUserID + "\" target=\"_blank\">" + indexDataPage.ShopUserID + "</a></i></td>";
        myJsVal += " <td>" + indexDataPage.ComplainStatus + "<i style=\"color: #939393;display:block\">" + indexDataPage.ComplainContent + "</i></td>";
        myJsVal += " <td>" + indexDataPage.ShopReply + "<i style=\"color: #939393;display:block\">" + indexDataPage.ShopReplyDate + "</i></td>";
        myJsVal += " <td>" + indexDataPage.ComplainReply + "<i style=\"color: #939393;display:block\">" + indexDataPage.ReplyDate + "</i></td>";
        myJsVal += " <td>" + indexDataPageExtra.ComplainCategoryName + "(" + indexDataPage.ComplainCategory + ")<i style=\"color: #939393;display:block\">" + indexDataPage.ComplainType + "</i></td>";
        myJsVal += " <td><a href=\"" + _ExtraDataHref + "\" target=\"_blank\">" + indexDataPage.ExtraData + "</a><i style=\"color: #939393;display:block\">" + indexDataPageExtra.IsLockName + "</i></td>";
        myJsVal += " <td>";
        myJsVal += "" + indexDataPage.WriteDate + "";
        myJsVal += " </td>";
        myJsVal += " <td>";

        if (indexDataPage.ComplainStatus == "官方介入") {
            myJsVal += "<button class=\"table-btn am-btn am-btn-default am-btn-xs am-text-success am-round\" onclick=\"openEditWin('" + indexDataPage.ComplainID + "', '" + indexDataPage.ComplainStatus + "', '" + indexDataPage.ComplainCategory + "', '" + indexDataPage.ComplainReply + "')\">回复</button>";
        }
        if (indexDataPage.IsLock == "false") {
            myJsVal += "<button class=\"table-btn am-btn am-btn-default am-btn-xs am-text-secondary am-round\" onclick=\"lockOrderComplainMsg('" + indexDataPage.ComplainID + "')\">锁定</button>";
        }
        else {
            myJsVal += "<button class=\"table-btn am-btn am-btn-default am-btn-xs am-text-secondary am-round\" onclick=\"lockOrderComplainMsg('" + indexDataPage.ComplainID + "')\">解锁</button>";
        }

        myJsVal += " </td>";
        myJsVal += "</tr>";

    }
    //alert(myJsVal);

    //-----分页控制条显示代码-------//
    var pageBarXhtml = "";
    pageBarXhtml += " <li><a href=\"javascript:void(0)\" onclick=\"PrePage()\">«</a></li>";
    pageBarXhtml += " <li><a href=\"javascript:void(0)\" onclick=\"NumberPage('1')\">1</a></li>";
    pageBarXhtml += "  <li><span>...</span></li>";


    if ((intPageCurrent - 2) > 0) {
        pageBarXhtml += "  <li><a href=\"javascript:void(0)\" onclick=\"NumberPage('" + (intPageCurrent - 2) + "')\">" + (intPageCurrent - 2) + "</a></li>";
    }
    if ((intPageCurrent - 1) > 0) {
        pageBarXhtml += "  <li><a href=\"javascript:void(0)\" onclick=\"NumberPage('" + (intPageCurrent - 1) + "')\">" + (intPageCurrent - 1) + "</a></li>";
    }


    pageBarXhtml += "  <li class=\"am-active\"><a href=\"javascript:void(0)\" onclick=\"NumberPage('" + json.PageCurrent + "')\">" + json.PageCurrent + "</a></li>";

    console.log(parseInt(json.PageSum));

    if ((intPageCurrent + 1) <= parseInt(json.PageSum)) {
        pageBarXhtml += "  <li><a href=\"javascript:void(0)\" onclick=\"NumberPage('" + (intPageCurrent + 1) + "')\">" + (intPageCurrent + 1) + "</a></li>";
    }
    if ((intPageCurrent + 2) <= parseInt(json.PageSum)) {
        pageBarXhtml += "  <li><a href=\"javascript:void(0)\" onclick=\"NumberPage('" + (intPageCurrent + 2) + "')\">" + (intPageCurrent + 2) + "</a></li>";
    }


    pageBarXhtml += "  <li><span>...</span></li>";
    pageBarXhtml += "  <li><a href=\"javascript:void(0)\" onclick=\"NumberPage('" + json.PageSum + "')\">" + json.PageSum + "</a></li>";
    pageBarXhtml += "  <li><input type=\"text\" id=\"PageNumTxt\" class=\"page-go-text am-form-field\" placeholder=\"跳转页\" /></li>";
    pageBarXhtml += "  <li><a href=\"javascript:void(0)\" onclick=\"NextPage()\">»</a></li>";


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

//---------以GET方式发送分页请求的函数-----------//
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
        //document.body.scrollTop = 0;


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
        //document.getElementById("SelAllCb").checked = false;

    }
    else {
        $("#TbodyTrPage").html("<tr><td colspan=\"" + tableColNum + "\">没有搜索到相关数据</td></tr>");
    }
}


//---------跳转页----------//
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


//===========================数据搜索分页=========================//


/**-----========自定义函数=====------**/




/**
 * 解锁锁定信息
 * @param {any} pComplainID
 */
function lockOrderComplainMsg(pComplainID) {

    //构造POST参数
    var dataPOST = {
        "Type": "3", "ComplainID": pComplainID,
    };
    console.log(dataPOST);

    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: mAjaxUrl + "?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("解锁锁定信息=" + reTxt);
            if (reTxt != "") {
                var _jsonReTxt = JSON.parse(reTxt);

                if (_jsonReTxt.ErrMsg != undefined && _jsonReTxt.ErrMsg != null && _jsonReTxt.ErrMsg != "") {

                    toastWinToDiv(_jsonReTxt.ErrMsg, "dragWinDiv");

                    return;
                }

                if (_jsonReTxt.Msg != undefined && _jsonReTxt.Msg != null && _jsonReTxt.Msg != "") {
                    toastWinToDivCb(_jsonReTxt.Msg, function () {

                        //重新加载数据
                        NumberPage(intPageCurrent);

                    }, "dragWinDiv");

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


/**-----========弹出窗口操作逻辑=====------**/


/**
 * 初始化添加窗口显示代码
 */
function initAddEditWinHtml() {
    //获取窗口显示代码
    mAddEditWinHtml = $("#AddEditWin").html();
    $("#AddEditWin").empty();
}


/**
 * 打开编辑信息窗口
 */
function openEditWin(pComplainIDWin, pComplainStatusWin, pComplainCategoryWin, pComplainReply) {

    //打开Dialog弹出窗口
    openDialogWinNoClose("官方回复窗口", mAddEditWinHtml, function () {

        //提交投诉官方回复信息
        submitOfficialReply(pComplainIDWin);

    }, function () {


    }, 620);

    //初始化窗口
    $("#ComplainIDWin").html(pComplainIDWin);
    $("#ComplainStatusWin").html(pComplainStatusWin);
    $("#ComplainReply").html(pComplainReply);
    $("#ComplainCategoryWin").html(pComplainCategoryWin);


}

/**
 * 提交投诉官方回复信息
 * */
function submitOfficialReply(pComplainID) {

    //获取表单值
    var ComplainReplyWin = $("#ComplainReplyWin").val().trim();

    //---判断输入是否合法-----//
    if (ComplainReplyWin == "") {
        toastWinToDiv("请输入回复内容！", "dragWinDiv");
        return;
    }

    //构造POST参数
    var dataPOST = {
        "Type": "2", "ComplainID": pComplainID, "ComplainReply": ComplainReplyWin,
    };
    console.log(dataPOST);

    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: mAjaxUrl + "?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("提交投诉官方回复信息=" + reTxt);
            if (reTxt != "") {
                var _jsonReTxt = JSON.parse(reTxt);

                if (_jsonReTxt.ErrMsg != undefined && _jsonReTxt.ErrMsg != null && _jsonReTxt.ErrMsg != "") {

                    toastWinToDiv(_jsonReTxt.ErrMsg, "dragWinDiv");

                    return;
                }

                if (_jsonReTxt.Msg != undefined && _jsonReTxt.Msg != null && _jsonReTxt.Msg != "") {
                    toastWinToDivCb(_jsonReTxt.Msg, function () {

                        //重新加载数据
                        NumberPage(intPageCurrent);

                        //关闭窗口
                        closeDialogWin();

                    }, "dragWinDiv");

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

