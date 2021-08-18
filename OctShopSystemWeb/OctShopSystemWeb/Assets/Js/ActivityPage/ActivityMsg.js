﻿//============活动信息===============//

/**-----定义公共变量------**/

//AjaxURL
var mAjaxUrl = "../Activity/ActivityMsg";

var mhidOctWapWeb_AddrDomain = "";

/******数据分页的变量********/
var strPOSTSe = ""; //搜索条件对象 POST参数
var intPageCurrent = 1; //当前页
var pageSize = 15; //当页的记录条数，与后台保持一致
var recordSum = 0; //总记录数
var tableColNum = 10; //当前表列数

/**------初始化------**/
$(function () {

    mhidOctWapWeb_AddrDomain = $("#hidOctWapWeb_AddrDomain").val().trim();

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

    var ActivityID_se = $("#ActivityID_se").val().trim();
    var AcTitle_se = $("#AcTitle_se").val().trim();
    var AcType_se = $("#AcType_se").val().trim();
    var AcMobile_se = $("#AcMobile_se").val().trim();
    var LimitJoinType_se = $("#LimitJoinType_se").val().trim();
    var IsJoinPause_se = $("#IsJoinPause_se").val().trim();
    var StartDate_se = $("#StartDate_se").val().trim();
    var EndDate_se = $("#EndDate_se").val().trim();
    var WriteDate_se = $("#WriteDate_se").val().trim();


    //构造POST参数
    var strPOST = {
        "pageCurrent": "1", "Type": "1",
    };

    //翻页所用
    var strPOSTSePush = {
        "ActivityID": ActivityID_se, "AcTitle": AcTitle_se, "AcType": AcType_se,
        "AcMobile": AcMobile_se, "LimitJoinType": LimitJoinType_se, "IsJoinPause": IsJoinPause_se, "StartDate": StartDate_se, "EndDate": EndDate_se, "WriteDate": WriteDate_se,
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
    var myJsVal = "";

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


        myJsVal += "<tr>";
        }
        if (indexDataPage.CheckReason != "" && indexDataPage.IsCheck == "true") {
        }

        pageBarXhtml += "  <li><a href=\"javascript:void(0)\" onclick=\"NumberPage('" + (intPageCurrent - 2) + "')\">" + (intPageCurrent - 2) + "</a></li>";
    }
        pageBarXhtml += "  <li><a href=\"javascript:void(0)\" onclick=\"NumberPage('" + (intPageCurrent - 1) + "')\">" + (intPageCurrent - 1) + "</a></li>";
    }
        pageBarXhtml += "  <li><a href=\"javascript:void(0)\" onclick=\"NumberPage('" + (intPageCurrent + 1) + "')\">" + (intPageCurrent + 1) + "</a></li>";
    }
        pageBarXhtml += "  <li><a href=\"javascript:void(0)\" onclick=\"NumberPage('" + (intPageCurrent + 2) + "')\">" + (intPageCurrent + 2) + "</a></li>";
    }
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


//=======================自定义函数=========================//

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
 * 批量开关暂停活动的加入参与
 * @param {any} pIsJoinPause 商家暂停加入 (false / true )
 */
function tglActivityPauseJoinArr(pIsJoinPause) {

    var ActivityIDArr = getSelectValArr();

    if (ActivityIDArr == "") {
        toastWin("请选择操作的记录!");
        return;
    }

    //构造POST参数
    var dataPOST = {
        "Type": "4", "ActivityIDArr": ActivityIDArr, "IsJoinPause": pIsJoinPause,
    };
    console.log(dataPOST);

    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: mAjaxUrl + "?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("批量开关暂停活动的加入参与=" + reTxt);
            if (reTxt != "") {
                var _jsonReTxt = JSON.parse(reTxt);

                if (_jsonReTxt.ErrMsg != "" && _jsonReTxt.ErrMsg != null && _jsonReTxt.ErrMsg != undefined) {
                    toastWin(_jsonReTxt.ErrMsg);
                    return;
                }

                if (_jsonReTxt.Msg != "" && _jsonReTxt.Msg != null && _jsonReTxt.Msg != undefined) {
                    toastWinCb(_jsonReTxt.Msg, function () {
                        //重新加载数据
                        NumberPage(intPageCurrent);
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
}

/**
 * 批量删除活动信息
 * */
function delActivityMsgArr() {

    var _ActivityIDArr = getSelectValArr();


    if (_ActivityIDArr == "") {
        toastWin("请选择操作的记录!");
        return;
    }

    //构造POST参数
    var dataPOST = {
        "Type": "9", "ActivityIDArr": _ActivityIDArr,
    };
    console.log(dataPOST);

    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: mAjaxUrl + "?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("批量删除活动信息=" + reTxt);
            if (reTxt != "") {
                var _jsonReTxt = JSON.parse(reTxt);

                if (_jsonReTxt.ErrMsg != "" && _jsonReTxt.ErrMsg != null && _jsonReTxt.ErrMsg != undefined) {
                    toastWin(_jsonReTxt.ErrMsg);
                    return;
                }

                if (_jsonReTxt.Msg != "" && _jsonReTxt.Msg != null && _jsonReTxt.Msg != undefined) {
                    toastWinCb(_jsonReTxt.Msg, function () {
                        //重新加载数据
                        NumberPage(intPageCurrent);
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
}

/**
 * 生成二维码图片
 * @param {any} pActivityID
 * @param {any} pAcTitle
 */
function createQRCodeImg(pActivityID, pAcTitle) {

    var QRCodeTitle = "活动分享二维码";
    var QRCodeTitleSub = pAcTitle;
    var QRCodeDesc = "请将此二维码分享给好友或其他人，扫码识别，邀请好友参与活动！";
    var QRCodeURL = mhidOctWapWeb_AddrDomain + "/Shop/ActivityDetail?AID=" + pActivityID + "";

    //window.location.href = "../SysPage/CreateSysQRCode?QRCodeTitle=" + escape(QRCodeTitle) + "&QRCodeTitleSub=" + escape(QRCodeTitleSub) + "&QRCodeDesc=" + escape(QRCodeDesc) + "&QRCodeURL=" + escape(QRCodeURL);

    window.open("../SysPage/CreateSysQRCode?QRCodeTitle=" + escape(QRCodeTitle) + "&QRCodeTitleSub=" + escape(QRCodeTitleSub) + "&QRCodeDesc=" + escape(QRCodeDesc) + "&QRCodeURL=" + escape(QRCodeURL));

    return;
}