﻿//=================拼团商品设置===============//

/**-----定义公共变量------**/
//AjaxURL
var mAjaxUrl = "../Group/GroupGoodsSetting";

//移动手机端域名
var mOctWapWebAddrDomain = "";

//判断商品是否存在
var mIsExistGoods = false; //不存在
var mGoodsTypeID = "";


/******数据分页的变量********/
var strPOSTSe = ""; //搜索条件对象 POST参数
var intPageCurrent = 1; //当前页
var pageSize = 15; //当页的记录条数，与后台保持一致
var recordSum = 0; //总记录数
var tableColNum = 10; //当前表列数

/**------初始化------**/

$(function () {

    mOctWapWebAddrDomain = $("#hidOctWapWeb_AddrDomain").val().trim();

    //初始化加载
    searchContent();

    //搜索按钮单击事件
    $("#btnSearch").click(function () {
        searchContent();
    });

    //初始化添加编辑窗口显示代码
    initAddEditWinHtml();
});



//========================数据分页搜索==============================//

/*
------定义搜索函数-----
*/
var searchContent = function () {

    intPageCurrent = 1; //开始页

    var GoodsID_se = $("#GoodsID_se").val().trim();
    var GroupDiscount_se = $("#GroupDiscount_se").val().trim();
    var GroupPersonNum_se = $("#GroupPersonNum_se").val().trim();
    var GroupSaleNum_se = $("#GroupSaleNum_se").val().trim();
    var IsCheck_se = $("#IsCheck_se").val().trim();
    var IsUnSale_se = $("#IsUnSale_se").val().trim();
    var WriteDate_se = $("#WriteDate_se").val().trim();


    //构造POST参数
    var strPOST = {
        "pageCurrent": "1", "Type": "1",
    };

    //翻页所用
    var strPOSTSePush = {
        "GoodsID": GoodsID_se, "GroupDiscount": GroupDiscount_se, "GroupPersonNum": GroupPersonNum_se,
        "GroupSaleNum": GroupSaleNum_se, "IsCheck": IsCheck_se, "IsUnSale": IsUnSale_se, "WriteDate": WriteDate_se,
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

        var indexDataPage = json.DataPage[i];
        var indexDataPageExtra = json.DataPageExtra[i];

        //审核状态
        var _checkStatu = ""; //是否审核 ( true 不通过 / false 待审核 / pass 审核通过 )
        if (indexDataPage.IsCheck == "true") {
            _checkStatu = "不通过";
        }
        else if (indexDataPage.IsCheck == "false") {
            _checkStatu = "待审核";
        }
        else if (indexDataPage.IsCheck == "pass") {
            _checkStatu = "审核通过";
        }

        var _isUnSale = "否";
        if (indexDataPage.IsUnSale == "true") {
            _isUnSale = "是";
        }

        myJsVal += "<tr>";
        }
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
        //document.getElementById("SelAllCb").checked = false;

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


//============数据分页搜索=============//


//==================自定义函数==================//


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
 * 批量上下架拼团商品信息
 * @param {any} pGroupSettingIDArr 拼团商品信息ID拼接数组 用"^"拼接
 * @param {any} pIsUnSale 是否下架 ( false  上架  / true  下架)
 */
function tglGroupGoodsSettingIsUnSaleArr(pGroupSettingIDArr, pIsUnSale) {

    if (pGroupSettingIDArr == "") {
        pGroupSettingIDArr = getSelectValArr();
    }

    if (pGroupSettingIDArr == "") {
        toastWin("请选择要操作的记录！");
        return;
    }

    //构造POST参数
    var dataPOST = {
        "Type": "2", "GroupSettingIDArr": pGroupSettingIDArr, "IsUnSale": pIsUnSale,
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

                if (_jsonReTxt.ErrCode != null) {
                    toastWin(_jsonReTxt.ErrMsg);
                    return;
                }

                if (_jsonReTxt.Code != "") {
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
 * 初始化添加编辑窗口显示代码
 */
function initAddEditWinHtml() {
    //获取窗口显示代码
    mAddEditWinHtml = $("#AddEditWin").html();
    $("#AddEditWin").empty();
}

/**
 * 打开添加窗口
 */
function openAddWin() {


    //打开Dialog弹出窗口
    openDialogWinNoClose("添加拼团商品", mAddEditWinHtml, function () {

        //添加拼团商品
        submitGroupGoodsSetting(0);

    }, function () {


    }, 600);

}

/**
 * 打开编辑窗口
 */
function openEditWin(pGroupSettingID, pGoodsID) {


    //打开Dialog弹出窗口
    openDialogWinNoClose("编辑拼团商品", mAddEditWinHtml, function () {

        //提交拼团商品信息
        submitGroupGoodsSetting(pGroupSettingID);

    }, function () {


    }, 600);

    //初始化拼团商品设置
    initGroupGoodsSetting(pGoodsID);
}


/**
 * 初始化商品的信息
 * */
function initGoodsMsg() {

    //获取表单值
    var _goodsID = $("#GoodsID_ae").val().trim();
    if (_goodsID == "") {
        return;
    }

    //构造POST参数
    var dataPOST = {
        "Type": "2", "GoodsID": _goodsID,
    };
    console.log(dataPOST);

    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: "../Integral/IntegralSetting?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("初始化商品的信息=" + reTxt);
            if (reTxt != "") {
                var _jsonReTxt = JSON.parse(reTxt);

                if (_jsonReTxt.GoodsTitle != null) {
                    $("#ShowGoodsNameA").html(_jsonReTxt.GoodsTitle);
                    $("#ShowGoodsNameA").attr("href", "" + mOctWapWebAddrDomain + "/Goods/GoodsDetailPreMobileIframe?GID=" + _jsonReTxt.GoodsID + "")

                    mIsExistGoods = true;
                    mGoodsTypeID = _jsonReTxt.GoodsTypeID
                }
                else {
                    $("#ShowGoodsNameA").html("商品不存在！");

                    mIsExistGoods = false;
                    mGoodsTypeID = "";

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
 * 提交拼团商品信息
 * @param {any} pGroupSettingID 拼团商品信息ID  为 0 则是添加
 */
function submitGroupGoodsSetting(pGroupSettingID) {

    //获取表单值
    var GoodsID_ae = $("#GoodsID_ae").val().trim();
    var GroupDiscount_ae = $("#GroupDiscount_ae").val().trim();
    var GroupPersonNum_ae = $("#GroupPersonNum_ae").val().trim();
    var OverTimeDay_ae = $("#OverTimeDay_ae").val().trim();

    if (GroupDiscount_ae == "" || GroupPersonNum_ae == "" || OverTimeDay_ae == "") {
        toastWinToDiv("【拼团折扣】【成团人数】【过期天数】都不能为空！", "dragWinDiv");
        return
    }

    if (mIsExistGoods == false) {
        toastWinToDiv("拼团商品不存在,请检查【商品ID】！", "dragWinDiv");
        $("#GoodsID_ae").focus();
        return
    }

    if (parseFloat(GroupDiscount_ae) <= 0 || parseFloat(GroupDiscount_ae) > 10) {
        toastWinToDiv("【拼团折扣】必须是0到10之间的数！", "dragWinDiv");
        $("#GroupDiscount_ae").focus();
        return
    }

    //显示加载提示
    loadingWinToDiv("dragWinDiv");

    //构造POST参数
    var dataPOST = {
        "Type": "3", "GroupSettingID": pGroupSettingID, "GroupDiscount": GroupDiscount_ae, "GroupPersonNum": GroupPersonNum_ae, "GoodsID": GoodsID_ae, "GoodsTypeID": mGoodsTypeID, "OverTimeDay": OverTimeDay_ae,
    };
    console.log(dataPOST);

    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: mAjaxUrl + "?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("提交拼团商品信息=" + reTxt);

            //移除加载提示
            closeLoadingWin();

            if (reTxt != "") {
                var _jsonReTxt = JSON.parse(reTxt);

                if (_jsonReTxt.ErrMsg != null && _jsonReTxt.ErrMsg != undefined && _jsonReTxt.ErrMsg != "") {
                    toastWinToDiv(_jsonReTxt.ErrMsg, "dragWinDiv");
                    return;
                }

                if (_jsonReTxt.Msg != null && _jsonReTxt.Msg != undefined && _jsonReTxt.Msg != "") {
                    toastWin(_jsonReTxt.Msg);
                    //重新加载数据
                    NumberPage(intPageCurrent)
                    //关闭窗口
                    closeDialogWin();
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
 * 初始化拼团商品设置
 * @param {any} pGoodsID 商品ID
 */
function initGroupGoodsSetting(pGoodsID) {

    //构造POST参数
    var dataPOST = {
        "Type": "4", "GoodsID": pGoodsID,
    };
    console.log(dataPOST);

    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: mAjaxUrl + "?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("初始化拼团商品=" + reTxt);
            if (reTxt != "") {
                var _jsonReTxt = JSON.parse(reTxt);

                //表单赋值
                $("#GoodsID_ae").attr("disabled", true);
                $("#GoodsID_ae").val(_jsonReTxt.GoodsID);
                $("#GroupDiscount_ae").val(_jsonReTxt.GroupDiscount);
                $("#GroupPersonNum_ae").val(_jsonReTxt.GroupPersonNum);
                $("#OverTimeDay_ae").val(_jsonReTxt.OverTimeDay);

                //初始化商品信息
                initGoodsMsg();
            }
        },
        error: function (xhr, errorTxt, status) {
            console.log("异步请求错误，errorTxt=" + errorTxt + " | status=" + status);
            return;
        }
    });


}


