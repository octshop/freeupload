//=================秒杀商品设置================================//


/**-----定义公共变量------**/
//AjaxURL
var mAjaxUrl = "../SecKill/SecKillGoodsMsg";

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
    var SkDiscount_se = $("#SkDiscount_se").val().trim();
    var SkStockNum_se = $("#SkStockNum_se").val().trim();
    var SkSaleNum_se = $("#SkSaleNum_se").val().trim();
    var IsCheck_se = $("#IsCheck_se").val().trim();
    var IsUnSale_se = $("#IsUnSale_se").val().trim();
    var EndTime_se = $("#EndTime_se").val().trim();
    var WriteDate_se = $("#WriteDate_se").val().trim();


    //构造POST参数
    var strPOST = {
        "pageCurrent": "1", "Type": "1",
    };

    //翻页所用
    var strPOSTSePush = {
        "GoodsID": GoodsID_se, "SkDiscount": SkDiscount_se, "SkStockNum": SkStockNum_se,
        "SkSaleNum": SkSaleNum_se, "IsCheck": IsCheck_se, "IsUnSale": IsUnSale_se, "EndTime": EndTime_se, "WriteDate": WriteDate_se,
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

        myJsVal += "<tr>";        myJsVal += "  <td><input type=\"checkbox\" name=\"SelCbItem\" id=\"SelCbItem_" + indexDataPage.SkGoodsID + "\" /></td>";        myJsVal += " <td><a href=\"" + mOctWapWebAddrDomain + "/Goods/GoodsDetailPreMobileIframe?GID=" + indexDataPage.GoodsID + "\" target=\"_blank\">" + indexDataPage.GoodsID + "<br />" + indexDataPageExtra.GoodsTitle + "</a></td>";        myJsVal += " <td>" + indexDataPage.SkDiscount + "折</td>";        myJsVal += " <td>" + indexDataPage.SkStockNum + "</td>";        myJsVal += " <td>" + indexDataPage.SkSaleNum + "</td>";        myJsVal += " <td>";        myJsVal += _checkStatu;        myJsVal += "<div style=\"color:gray;font-size:10px;\">" + indexDataPage.CheckReason + "</div>";        myJsVal += " </td>";        myJsVal += " <td>" + _isUnSale + "</td>";        myJsVal += " <td>" + indexDataPage.EndTime + " <font color=\"red\">" + indexDataPageExtra.EndDayNum + "</font> </td>";        myJsVal += " <td>" + indexDataPage.WriteDate + "</td>";        myJsVal += " <td>";        if (indexDataPage.IsUnSale == "true") {            myJsVal += "<button class=\"table-btn am-btn am-btn-default am-btn-xs am-text-secondary am-round\" onclick=\"tglSkGoodsMsgIsUnSaleArr('" + indexDataPage.SkGoodsID + "', 'false')\">上架</button>";
        }        else {            myJsVal += "<button class=\"table-btn am-btn am-btn-default am-btn-xs am-text-secondary am-round\" onclick=\"tglSkGoodsMsgIsUnSaleArr('" + indexDataPage.SkGoodsID + "', 'true')\">下架</button>";
        }        myJsVal += "<button class=\"table-btn am-btn am-btn-default am-btn-xs am-text-secondary am-round\" onclick=\"openEditWin('" + indexDataPage.SkGoodsID + "')\">修改</button>";        myJsVal += " </td>";        myJsVal += "</tr>";    }    //alert(myJsVal);    //-----分页控制条显示代码-------//    var pageBarXhtml = "";    pageBarXhtml += " <li><a href=\"javascript:void(0)\" onclick=\"PrePage()\">«</a></li>";    pageBarXhtml += " <li><a href=\"javascript:void(0)\" onclick=\"NumberPage('1')\">1</a></li>";    pageBarXhtml += "  <li><span>...</span></li>";    if ((intPageCurrent - 2) > 0) {
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


//==================数据分页搜索====================//



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
 * 批量上下架秒杀商品信息
 * @param {any} pSkGoodsIDArr 秒杀商品信息ID拼接数组 用"^"拼接
 * @param {any} pIsUnSale 是否下架 ( false  上架  / true  下架)
 */
function tglSkGoodsMsgIsUnSaleArr(pSkGoodsIDArr, pIsUnSale) {

    if (pSkGoodsIDArr == "") {
        pSkGoodsIDArr = getSelectValArr();
    }

    if (pSkGoodsIDArr == "") {
        toastWin("请选择要操作的记录！");
        return;
    }

    //构造POST参数
    var dataPOST = {
        "Type": "2", "SkGoodsIDArr": pSkGoodsIDArr, "IsUnSale": pIsUnSale,
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
    openDialogWinNoClose("添加秒杀商品", mAddEditWinHtml, function () {

        //添加秒杀商品信息
        addSecKillGoodsMsg()

    }, function () {


    }, 600);

}

/**
 * 打开编辑窗口
 */
function openEditWin(pSkGoodsID) {


    //打开Dialog弹出窗口
    openDialogWinNoClose("编辑秒杀商品", mAddEditWinHtml, function () {

        //提交秒杀商品信息
        submitSecKillGoodsMsg(pSkGoodsID);

    }, function () {


    }, 600);

    //初始化秒杀商品信息;
    initSecKillGoodsMsg(pSkGoodsID)
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
 * 添加秒杀商品信息
 * */
function addSecKillGoodsMsg() {

    //获取表单值
    var GoodsID_ae = $("#GoodsID_ae").val().trim();
    var SkDiscount_ae = $("#SkDiscount_ae").val().trim();
    var SkStockNum_ae = $("#SkStockNum_ae").val().trim();
    var EndTime_ae = $("#EndTime_ae").val().trim(); //2017-06-30T00:00

    if (GoodsID_ae == "" || SkDiscount_ae == "" || SkStockNum_ae == "") {
        toastWinToDiv("【商品ID】【秒杀折扣】【秒杀库存】都不能为空！", "dragWinDiv");
        return
    }

    if (mIsExistGoods == false) {
        toastWinToDiv("秒杀商品不存在,请检查【商品ID】！", "dragWinDiv");
        $("#GoodsID_ae").focus();
        return
    }

    //显示加载提示
    loadingWinToDiv("dragWinDiv");


    //构造POST参数
    var dataPOST = {
        "Type": "3", "GoodsID": GoodsID_ae, "GoodsTypeID": mGoodsTypeID, "SkDiscount": SkDiscount_ae, "SkStockNum": SkStockNum_ae, "EndTime": EndTime_ae,
    };
    console.log(dataPOST);

    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: mAjaxUrl + "?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("添加秒杀商品信息=" + reTxt);

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
                    NumberPage(intPageCurrent);
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
 * 初始化秒杀商品信息
 * @param {any} pSkGoodsID 秒杀商品信息ID
 */
function initSecKillGoodsMsg(pSkGoodsID) {


    //构造POST参数
    var dataPOST = {
        "Type": "4", "SkGoodsID": pSkGoodsID,
    };
    console.log(dataPOST);

    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: mAjaxUrl + "?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("初始化秒杀商品=" + reTxt);
            if (reTxt != "") {
                var _jsonReTxt = JSON.parse(reTxt);

                //表单赋值
                $("#GoodsID_ae").attr("disabled", true);
                $("#GoodsID_ae").val(_jsonReTxt.GoodsID);
                $("#SkDiscount_ae").val(_jsonReTxt.SkDiscount);
                $("#SkStockNum_ae").val(_jsonReTxt.SkStockNum);
                //$("#EndTime_ae").val("2020-08-01T12:00");
                $("#EndTime_ae").val(_jsonReTxt.EndTime);

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

/**
 * 提交秒杀商品信息
 * @param {any} pSkGoodsID 秒杀商品信息ID
 */
function submitSecKillGoodsMsg(pSkGoodsID) {

    //获取表单值
    var SkDiscount_ae = $("#SkDiscount_ae").val().trim();
    var SkStockNum_ae = $("#SkStockNum_ae").val().trim();
    var EndTime_ae = $("#EndTime_ae").val().trim(); //2017-06-30T00:00

    if (GoodsID_ae == "" || SkDiscount_ae == "" || SkStockNum_ae == "") {
        toastWinToDiv("【秒杀折扣】【秒杀库存】都不能为空！", "dragWinDiv");
        return
    }


    //显示加载提示
    loadingWinToDiv("dragWinDiv");

    //构造POST参数
    var dataPOST = {
        "Type": "5", "SkGoodsID": pSkGoodsID, "SkDiscount": SkDiscount_ae, "SkStockNum": SkStockNum_ae, "EndTime": EndTime_ae,
    };
    console.log(dataPOST);

    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: mAjaxUrl + "?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("提交秒杀商品信息=" + reTxt);

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

