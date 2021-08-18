//==================推荐商品商家===========================//

/**-----定义公共变量------**/

//AjaxURL
var mAjaxUrl = "../Advertiser/RcdGoodsShop";

//信息ID
var mRcdGoodsShopID = "0";

//添加或编辑窗口的Html显示代码
var mAddEditWinHtml = "";

//手机web端域名
var mOctWapWeb_AddrDomain = "";




/**------初始化------**/
$(function () {

    mOctWapWeb_AddrDomain = $("#hidOctWapWeb_AddrDomain").val().trim();

    //初始化地区选择
    initRegionCodeName();

    //初始化加载
    searchContent();

    //搜索按钮单击事件
    $("#btnSearch").click(function () {
        searchContent();
    });

    //初始化添加窗口显示代码
    initAddEditWinHtml();

});


//======================数据搜索分页=========================//


/******数据分页的变量********/
var strPOSTSe = ""; //搜索条件对象 POST参数
var intPageCurrent = 1; //当前页
var pageSize = 15; //当页的记录条数，与后台保持一致
var recordSum = 0; //总记录数
var tableColNum = 11; //当前表列数


/*
---------定义搜索函数---------
*/
var searchContent = function () {

    intPageCurrent = 1; //开始页

    var RcdGoodsShopID_se = $("#RcdGoodsShopID_se").val().trim();
    var AdvType_se = $("#AdvType_se").val().trim();
    var RcdType_se = $("#RcdType_se").val().trim();
    var IsLock_se = $("#IsLock_se").val().trim();
    var GoodsID_se = $("#GoodsID_se").val().trim();
    var ShopID_se = $("#ShopID_se").val().trim();
    var ShopUserID_se = $("#ShopUserID_se").val().trim();
    var RcdMemo_se = $("#RcdMemo_se").val().trim();
    var WriteDate_se = $("#WriteDate_se").val().trim();

    //选择地区
    var region_province = $("#region_province").val();
    var region_city = $("#region_city").val();

    var RegionCodeArr = "";
    if (region_city == null || region_city == "") {
        RegionCodeArr = "";
    }
    else {
        RegionCodeArr = region_province + "_" + region_city;
    }


    //构造POST参数
    var strPOST = {
        "pageCurrent": "1", "Type": "1"
    };

    //翻页所用
    var strPOSTSePush = {
        "RcdGoodsShopID": RcdGoodsShopID_se, "AdvType": AdvType_se, "RcdType": RcdType_se,
        "GoodsID": GoodsID_se, "ShopID": ShopID_se, "ShopUserID": ShopUserID_se,
        "RcdMemo": RcdMemo_se, "RegionCodeArr": RegionCodeArr, "IsLock": IsLock_se, "WriteDate": WriteDate_se
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
    //循环构造
    for (var i = 0; i < json.DataPage.length; i++) {

        var indexDataPage = json.DataPage[i];
        var indexDataPageExtra = json.DataPageExtra[i];

        if (indexDataPageExtra.GoodsTitle.length > 10) {
            indexDataPageExtra.GoodsTitle = indexDataPageExtra.GoodsTitle.substring(0, 10);
        }

        var _IsLock = "显示中";
        if (indexDataPage.IsLock == "true") {
            _IsLock = "隐藏中";
        }

        myJsVal += "<tr>";
        myJsVal += "  <td><input type=\"checkbox\" name=\"SelCbItem\" id=\"SelCbItem_" + indexDataPage.RcdGoodsShopID + "\" /></td>";
        myJsVal += " <td>" + indexDataPage.RcdGoodsShopID + "</td>";
        myJsVal += " <td>" + indexDataPageExtra.IsEntityName + "<i style=\"color: #939393;display: block\">" + indexDataPageExtra.SelCityRegionNameArr + "</i></td>";
        myJsVal += " <td>";
        myJsVal += "" + indexDataPageExtra.RcdTypeName + "";
        myJsVal += " </td>";
        myJsVal += " <td>";
        if (indexDataPage.GoodsID != 0 && indexDataPage.GoodsID != "") {
            myJsVal += "<a href=\"" + mOctWapWeb_AddrDomain + "/Mall/PagePreMobileIframe?LoadPreURL=" + mOctWapWeb_AddrDomain + "/Goods/GoodsDetail?GID=" + indexDataPage.GoodsID + "\" target=\"_blank\">" + indexDataPage.GoodsID + "(" + indexDataPageExtra.GoodsTitle + ")</a>";
        }

        myJsVal += "</td>";
        myJsVal += " <td>";
        if (indexDataPage.ShopID != 0 && indexDataPage.ShopID != "") {
            myJsVal += "<a href=\"" + mOctWapWeb_AddrDomain + "/Mall/PagePreMobileIframe?LoadPreURL=" + mOctWapWeb_AddrDomain + "/Shop/Index?SID=" + indexDataPage.ShopID + "\" target=\"_blank\">" + indexDataPage.ShopID + "(" + indexDataPageExtra.ShopName + ")</a>";
        }

        myJsVal += " </td>";
        myJsVal += " <td>" + indexDataPageExtra.IsLockName + "</td>";
        myJsVal += " <td>" + indexDataPage.RcdMemo + "</td>";
        myJsVal += " <td>" + indexDataPage.WriteDate + "</td>";
        myJsVal += " <td>";


        if (indexDataPage.IsLock == "false") {
            myJsVal += "<button class=\"table-btn am-btn am-btn-default am-btn-xs am-text-secondary am-round\" onclick=\"tglLock('" + indexDataPage.RcdGoodsShopID + "', 'true')\">隐藏</button>";
        }
        else {
            myJsVal += "<button class=\"table-btn am-btn am-btn-default am-btn-xs am-text-secondary am-round\" onclick=\"tglLock('" + indexDataPage.RcdGoodsShopID + "', 'false')\">显示</button>";
        }

        myJsVal += "     <button class=\"table-btn am-btn am-btn-default am-btn-xs am-text-success am-round\" onclick=\"goTop('" + indexDataPage.RcdGoodsShopID + "')\">置顶</button>";
        myJsVal += "     <button class=\"table-btn am-btn am-btn-default am-btn-xs am-text-danger am-round\" onclick=\"openEditWin('" + indexDataPage.RcdGoodsShopID + "')\">修改</button>";
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


//-----------------跳转页-------------//
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


//======================数据搜索分页=========================//


/**===============自定义函数======================= */

/**
 * 切换 锁定与解锁
 * @param {any} pRcdGoodsShopID
 * @param {any} pIsLock 锁定 ( true / false )
 */
function tglLock(pRcdGoodsShopID, pIsLock) {

    confirmWinWidth("显示与隐藏操作确认？", function () {

        //构造POST参数
        var dataPOST = {
            "Type": "4", "RcdGoodsShopIDArr": pRcdGoodsShopID, "IsLock": pIsLock,
        };
        console.log(dataPOST);

        //正式发送异步请求
        $.ajax({
            type: "POST",
            url: mAjaxUrl + "?rnd=" + Math.random(),
            data: dataPOST,
            dataType: "html",
            success: function (reTxt, status, xhr) {
                console.log(" 切换 锁定与解锁=" + reTxt);
                if (reTxt != "") {
                    var _jsonReTxt = JSON.parse(reTxt);

                    if (_jsonReTxt.Msg != "" && _jsonReTxt.Msg != null && _jsonReTxt.Msg != null) {
                        //toastWin("操作成功!");
                        //重新加载数据
                        NumberPage(intPageCurrent);
                        return;
                    }
                    if (_jsonReTxt.ErrMsg != "" && _jsonReTxt.ErrMsg != null && _jsonReTxt.ErrMsg != null) {
                        toastWin("操作失败!");
                        return;
                    }

                }
                else {

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
 * 置顶 操作
 * @param {any} pRcdGoodsShopID
 * @param {any} pIsLock 锁定 ( true / false )
 */
function goTop(pRcdGoodsShopID) {

    confirmWinWidth("置顶操作确认？", function () {

        //构造POST参数
        var dataPOST = {
            "Type": "5", "RcdGoodsShopID": pRcdGoodsShopID,
        };
        console.log(dataPOST);

        //正式发送异步请求
        $.ajax({
            type: "POST",
            url: mAjaxUrl + "?rnd=" + Math.random(),
            data: dataPOST,
            dataType: "html",
            success: function (reTxt, status, xhr) {
                console.log("置顶操作=" + reTxt);
                if (reTxt != "") {
                    var _jsonReTxt = JSON.parse(reTxt);

                    if (_jsonReTxt.Msg != "" && _jsonReTxt.Msg != null && _jsonReTxt.Msg != null) {
                        //toastWin("操作成功!");
                        //重新加载数据
                        NumberPage(intPageCurrent);
                        return;
                    }
                    if (_jsonReTxt.ErrMsg != "" && _jsonReTxt.ErrMsg != null && _jsonReTxt.ErrMsg != null) {
                        toastWin(_jsonReTxt.ErrMsg);
                        return;
                    }

                }
                else {

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
 * 批量删除 轮播广告
 * */
function delRcdGoodsShopArr() {

    var _selIDArr = getSelectValArr();
    if (_selIDArr == "" || getSelectValArr == null) {
        toastWin("请选择操作的记录！");
        return;
    }

    //构造POST参数
    var dataPOST = {
        "Type": "6", "RcdGoodsShopIDArr": _selIDArr,
    };
    console.log(dataPOST);

    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: mAjaxUrl + "?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("批量删除=" + reTxt);
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

}

/**
 * 切换选项
 * */
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
 * 打开添加窗口
 */
function openAddWin() {


    mRcdGoodsShopID = "";

    //打开Dialog弹出窗口
    openDialogWinNoClose("添加", mAddEditWinHtml, function () {

        //提交推荐信息
        submitRcdGoodsShop();

    }, function () {


    }, 620);

    //初始化地区选择
    initRegionCodeName("2region_province", "2region_city", "2region_county");

}

/**
 * 打开编辑轮播信息窗口
 * @param {any} pRcdGoodsShopID 信息ID
 */
function openEditWin(pRcdGoodsShopID) {

    mRcdGoodsShopID = pRcdGoodsShopID;

    //打开Dialog弹出窗口
    openDialogWinNoClose("编辑", mAddEditWinHtml, function () {

        //提交推荐信息
        submitRcdGoodsShop();

    }, function () {


    }, 620);

    //初始化地区选择
    initRegionCodeName("2region_province", "2region_city", "2region_county");

    //初始化推荐信息
    initRcdGoodsShop();
}

/**
 * 提交推荐信息
 * */
function submitRcdGoodsShop() {

    //获取表单值
    var RcdTypeWin = $("#RcdTypeWin").val().trim();
    var AdvTypeWin = $("#AdvTypeWin").val().trim();
    //var AdvOsTypeWin = $("#AdvOsTypeWin").val().trim();
    var GoodsIDWin = $("#GoodsIDWin").val().trim();
    var ShopIDWin = $("#ShopIDWin").val().trim();
    var RcdMemoWin = $("#RcdMemoWin").val().trim();

    var region_province_2 = $("#2region_province").val().trim();
    var region_city_2 = "";
    if (region_province_2 != "") {
        region_city_2 = $("#2region_city").val().trim();
    }
    var SelCityRegionCodeArr = region_province_2 + "_" + region_city_2;

    //---判断输入是否合法-----//
    if (AdvTypeWin == "AdvO2o" && region_city_2 == "") {
        toastWinToDiv("请选择【城市区域】！", "dragWinDiv");
        return;
    }

    if (RcdTypeWin == "Shop" && ShopIDWin == "") {
        toastWinToDiv("请填写【店铺ID】！", "dragWinDiv");
        return;
    }
    if (RcdTypeWin == "Goods" && GoodsIDWin == "") {
        toastWinToDiv("请填写【商品ID】！", "dragWinDiv");
        return;
    }

    //构造POST参数
    var dataPOST = {
        "Type": "2", "RcdGoodsShopID": mRcdGoodsShopID, "RcdType": RcdTypeWin, "AdvType": AdvTypeWin, "GoodsID": GoodsIDWin, "ShopID": ShopIDWin, "RcdMemo": RcdMemoWin, "SelCityRegionCodeArr": SelCityRegionCodeArr,
    };
    console.log(dataPOST);

    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: mAjaxUrl + "?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("提交推荐信息=" + reTxt);
            if (reTxt != "") {
                var _jsonReTxt = JSON.parse(reTxt);

                if (_jsonReTxt.ErrMsg != undefined && _jsonReTxt.ErrMsg != null && _jsonReTxt.ErrMsg != "") {
                    toastWinToDiv(_jsonReTxt.ErrMsg, "dragWinDiv");
                    return;
                }

                if (_jsonReTxt.Msg != undefined && _jsonReTxt.Msg != null && _jsonReTxt.Msg != "") {
                    toastWinToDivCb(_jsonReTxt.Msg, function () {

                        mImgKeyGuid = "";
                        mImgPathDomain = "";

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

/**
 * 初始化推荐信息
 * */
function initRcdGoodsShop() {
    //构造POST参数
    var dataPOST = {
        "Type": "3", "RcdGoodsShopID": mRcdGoodsShopID,
    };
    console.log(dataPOST);

    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: mAjaxUrl + "?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("初始化推荐信息=" + reTxt);
            if (reTxt != "") {
                var _jsonReTxt = JSON.parse(reTxt);

                //初始化表单
                $("#AdvTypeWin").val(_jsonReTxt.AdvType);
                $("#RcdTypeWin").val(_jsonReTxt.RcdType);
                $("#AdvOsTypeWin").val(_jsonReTxt.AdvOsType);
                $("#GoodsIDWin").val(_jsonReTxt.GoodsID);
                $("#ShopIDWin").val(_jsonReTxt.ShopID);
                $("#RcdMemoWin").val(_jsonReTxt.RcdMemo);



            }
            else {

            }


        },
        error: function (xhr, errorTxt, status) {
            console.log("异步请求错误，errorTxt=" + errorTxt + " | status=" + status);
            return;
        }
    });
}

