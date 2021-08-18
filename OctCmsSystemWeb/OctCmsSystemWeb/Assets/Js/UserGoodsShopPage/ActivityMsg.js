//============活动信息管理===============//

/**-----定义公共变量------**/

//AjaxURL
var mAjaxUrl = "../UserGoodsShop/ActivityMsg";

var mhidOctWapWebAddrDomain = "";

/******数据分页的变量********/
var strPOSTSe = ""; //搜索条件对象 POST参数
var intPageCurrent = 1; //当前页
var pageSize = 15; //当页的记录条数，与后台保持一致
var recordSum = 0; //总记录数
var tableColNum = 10; //当前表列数

/**------初始化------**/
$(function () {

    mhidOctWapWebAddrDomain = $("#hidOctWapWeb_AddrDomain").val().trim()

    //初始化加载
    searchContent();

    //搜索按钮单击事件
    $("#btnSearch").click(function () {
        searchContent();
    });

    //初始化添加窗口显示代码
    initAddEditWinHtml();

});


/*
---------定义搜索函数---------
*/
var searchContent = function () {

    intPageCurrent = 1; //开始页

    var ActivityID_se = $("#ActivityID_se").val().trim();
    var ShopUserID_se = $("#ShopUserID_se").val().trim();
    var ShopName_se = $("#ShopName_se").val().trim();
    var AcTitle_se = $("#AcTitle_se").val().trim();
    var AcType_se = $("#AcType_se").val().trim();
    var AcMobile_se = $("#AcMobile_se").val().trim();
    var LimitJoinType_se = $("#LimitJoinType_se").val().trim();
    var IsJoinPause_se = $("#IsJoinPause_se").val().trim();
    var StartDate_se = $("#StartDate_se").val().trim();
    var EndDate_se = $("#EndDate_se").val().trim();
    var IsCheck_se = $("#IsCheck_se").val().trim();
    var IsLock_se = $("#IsLock_se").val().trim();
    var WriteDate_se = $("#WriteDate_se").val().trim();


    //构造POST参数
    var strPOST = {
        "pageCurrent": "1", "Type": "1",
    };

    //翻页所用
    var strPOSTSePush = {
        "ActivityID": ActivityID_se, "AcTitle": AcTitle_se, "AcType": AcType_se,
        "AcMobile": AcMobile_se, "LimitJoinType": LimitJoinType_se, "IsJoinPause": IsJoinPause_se, "StartDate": StartDate_se, "EndDate": EndDate_se, "WriteDate": WriteDate_se, "ShopUserID": ShopUserID_se, "ShopName": ShopName_se, "IsCheck": IsCheck_se, "IsLock": IsLock_se,
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

        var _AcType = "线上";
        if (indexDataPage.AcType == "OffLine") {
            _AcType = "线下";
        }

        //参与加入限制类别 - 参与条件 （ Fav 已收藏店铺， Order 订购过店铺商品 All 不限制 ）
        var _LimitJoinType = "不限制";
        if (indexDataPage.LimitJoinType == "Fav") {
            _LimitJoinType = "已收藏店铺";
        }
        else if (indexDataPage.LimitJoinType == "Order") {
            _LimitJoinType = "订购过店铺商品";
        }

        var _IsJoinPause = "加入中";
        if (indexDataPage.IsJoinPause == "true") {
            _IsJoinPause = "已暂停";
        }

        var _IsCheck = "待审核";
        if (indexDataPage.IsCheck == "pass") {
            _IsCheck = "通过";
        }
        else if (indexDataPage.IsCheck == "true") {
            _IsCheck = "未通过";
        }

        var _StartDay = dateDiffDay(getTodayDate(), indexDataPage.StartDate, false);
        if (Math.abs(_StartDay) > 100) {
            _StartDay = 0;
        }
        var _EndDay = dateDiffDay(getTodayDate(), indexDataPage.EndDate, false);
        if (Math.abs(_EndDay) > 100) {
            _EndDay = 0;
        }

        var _IsLock = "否";
        if (indexDataPage.IsLock == "true") {
            _IsLock = "是";
        }


        myJsVal += "<tr>";        myJsVal += "  <td><input type=\"checkbox\" name=\"SelCbItem\" id=\"SelCbItem_" + indexDataPage.ActivityID + "\" /></td>";        myJsVal += " <td>" + indexDataPage.ActivityID + "<i style=\"color: gray; display: block;\"><a href=\"../UserGoodsShopPage/ShopMsgDetail?UserID=" + indexDataPage.ShopUserID + "\" target=\"_blank\">" + indexDataPage.ShopUserID + "</a></i></td>";        myJsVal += " <td><a href=\"" + mhidOctWapWebAddrDomain + "/Shop/ActivityDetailPreMobileIframe?AID=" + indexDataPage.ActivityID + "\" target=\"_blank\">" + indexDataPage.AcTitle + "</a></td>";        myJsVal += " <td>" + _AcType + "</td>";        myJsVal += " <td>" + _LimitJoinType + "</td>";        myJsVal += " <td>" + _IsJoinPause + "<i style=\"color: gray; display: block;\">" + _IsLock + "</i></td>";        myJsVal += " <td>" + _IsCheck + "<br /><i style=\"color: gray; display: block;\">" + indexDataPage.CheckReason + "</i></td>";        myJsVal += " <td>" + indexDataPage.StartDate + " <font color=\"red\">" + _StartDay + "</font></td>";        myJsVal += " <td>" + indexDataPage.EndDate + " <font color=\"red\">" + _EndDay + "</font></td>";        myJsVal += " <td>";        myJsVal += "<button class=\"table-btn am-btn am-btn-default am-btn-xs am-text-secondary am-round\" onclick=\"window.open('../UserGoodsShopPage/ActivityDetail?AID=" + indexDataPage.ActivityID + "')\">详情</button>";        myJsVal += "<button class=\"table-btn am-btn am-btn-default am-btn-xs am-text-warning am-round\" onclick=\"openEditWin('" + indexDataPage.ActivityID + "', '" + indexDataPage.AcTitle + "', '" + indexDataPage.IsCheck + "', '" + indexDataPage.CheckReason + "') \">审核</button>";
        myJsVal += " </td>";        myJsVal += "</tr>";
        //if (indexDataPage.CheckReason != "" && indexDataPage.IsCheck == "true") {        //    myJsVal += "<tr><td class=\"td-hint-status\" colspan=\"10\">" + indexDataPage.CheckReason + "</td></tr>";
        //}
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


//================自定义函数===================//

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
    //console.log("_msgIdArr=" + _msgIdArr);

    return _msgIdArr.join("^");
}


/**
 * 批量锁定与解锁 活动信息
 */
function lockActivityMsgArr(pActivityIDArr, pIsLock) {

    if (pActivityIDArr == "") {
        pActivityIDArr = getSelectValArr();
    }

    if (pActivityIDArr == "") {
        toastWin("请选择要操作的记录！");
        return;
    }

    //构造POST参数
    var dataPOST = {
        "Type": "3", "ActivityIDArr": pActivityIDArr, "IsLock": pIsLock,
    };
    console.log(dataPOST);

    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: mAjaxUrl + "?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("批量锁定与解锁 活动信息=" + reTxt);
            if (reTxt != "") {
                var _jsonReTxt = JSON.parse(reTxt);

                if (_jsonReTxt.ErrCode != null && _jsonReTxt.ErrCode != undefined && _jsonReTxt.ErrCode != "") {
                    toastWin(_jsonReTxt.ErrMsg);
                    return;
                }

                if (_jsonReTxt.Code != "" && _jsonReTxt.Code != undefined && _jsonReTxt.Code != null) {
                    toastWin(_jsonReTxt.Msg);
                    //重新加载数据
                    NumberPage(intPageCurrent)
                    return;
                }
            }
        }
    });

}



//===========================弹出添加与修改窗口=====================//

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
function openEditWin(pActivityIDWin, pAcTitleWin, pIsCheckWin, pCheckReasonWin) {

    //打开Dialog弹出窗口
    openDialogWinNoClose("审核窗口", mAddEditWinHtml, function () {

        //提交审核
        chkActivityMsg(pActivityIDWin);

    }, function () {


    }, 620);

    //初始化窗口
    $("#ActivityIDWin").html("" + pActivityIDWin + "(" + pAcTitleWin + ")");
    $("#IsCheckWin").val(pIsCheckWin);
    $("#CheckReasonWin").val(pCheckReasonWin);
}


/**
 * 提交审核
 * */
function chkActivityMsg(pActivityID) {

    if (pActivityID == "") {
        return;
    }

    //获取表单值
    var IsCheckWin = $("#IsCheckWin").val().trim();
    var CheckReasonWin = $("#CheckReasonWin").val().trim();

    //---判断输入是否合法-----//


    //构造POST参数
    var dataPOST = {
        "Type": "2", "ActivityID": pActivityID, "IsCheck": IsCheckWin, "CheckReason": CheckReasonWin,
    };
    console.log(dataPOST);

    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: mAjaxUrl + "?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("提交审核=" + reTxt);
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


