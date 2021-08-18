//============积分设置================//

/**-----定义公共变量------**/

//AjaxURL
var mAjaxUrl = "../Integral/IntegralSetting";

/******数据分页的变量********/
var strPOSTSe = ""; //搜索条件对象 POST参数
var intPageCurrent = 1; //当前页
var pageSize = 15; //当页的记录条数，与后台保持一致
var recordSum = 0; //总记录数
var tableColNum = 7; //当前表列数

//OctWapWeb 手机Web端(公众号端)地址域名
var mOctWapWebAddrDomain = "";

//添加窗口的Html显示代码
var mAddEditWinHtml = "";

/**------初始化------**/
$(function () {

    mOctWapWebAddrDomain = $("#hidOctWapWebAddrDomain").val().trim();

    //初始化添加编辑窗口显示代码
    initAddEditWinHtml();

    //统计商家当前积分总额
    sumCurrentIntegralShop();

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

    var InSettingType = $("#InSettingType_se").val().trim();
    var GoodsID = $("#GoodsID_se").val().trim();
    var IntegralPrice = $("#IntegralPrice_se").val().trim();
    var IsLock = $("#IsLock_se").val().trim();
    var WriteDate = $("#WriteDate_se").val().trim();


    //构造POST参数
    var strPOST = {
        "pageCurrent": "1", "Type": "1",
    };

    //翻页所用
    var strPOSTSePush = {
        "InSettingType": InSettingType, "GoodsID": GoodsID, "IntegralPrice": IntegralPrice, "IsLock": IsLock, "WriteDate": WriteDate,
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

        //积分设置类型 ( Appraise 商品评价  AppraiseImg 买家晒单 BuyGoods 购买商品 )
        var _InSettingType = "";
        if (indexDataPage.InSettingType == "Appraise") {
            _InSettingType = "商品评价";
        }
        else if (indexDataPage.InSettingType == "AppraiseImg") {
            _InSettingType = "买家晒单";
        }
        else if (indexDataPage.InSettingType == "BuyGoods") {
            _InSettingType = "购买商品";
        }

        //是否启用
        var _IsLock = "已启用";
        if (indexDataPage.IsLock == "true") {
            _IsLock = "已暂停";
        }

        myJsVal += "<tr>";        myJsVal += " <td>" + indexDataPage.InSettingID + "</td>";        myJsVal += " <td>" + _InSettingType + "(" + indexDataPage.InSettingType + ")</td>";        myJsVal += " <td><a href=\"" + mOctWapWebAddrDomain + "/Goods/GoodsDetailPreMobileIframe?GID=" + indexDataPage.GoodsID + "\" target=\"_blank\">" + indexDataPage.GoodsID + "</a><br />" + indexDataPageExtra.GoodsTitle + "</td>";        myJsVal += " <td>" + indexDataPage.IntegralPrice + "</td>";        myJsVal += " <td>" + _IsLock + "</td>";        myJsVal += " <td>" + indexDataPage.WriteDate + "</td>";        myJsVal += " <td>";        if (indexDataPage.IsLock == "true") {            myJsVal += " <button class=\"table-btn am-btn am-btn-default am-btn-xs am-text-secondary am-round\" style=\"margin-bottom:2px\" onclick=\"toggleShopIntegralSetting('" + indexDataPage.InSettingID + "', 'false')\">启用</button>";
        }        else {            myJsVal += " <button class=\"table-btn am-btn am-btn-default am-btn-xs am-text-secondary am-round\" style=\"margin-bottom:2px\" onclick=\"toggleShopIntegralSetting('" + indexDataPage.InSettingID + "', 'true')\">暂停</button>";
        }        myJsVal += " <button class=\"table-btn am-btn am-btn-default am-btn-xs am-text-secondary am-round\" style=\"margin-bottom:2px\" onclick=\"openEditWin('" + indexDataPage.InSettingID + "')\">修改</button>";        myJsVal += " <button class=\"table-btn am-btn am-btn-default am-btn-xs am-text-secondary am-round\" style=\"margin-bottom:2px\" onclick=\"delShopIntegralSetting('" + indexDataPage.InSettingID + "')\">删除</button>";        myJsVal += " </td>";        myJsVal += "</tr>";    }    //alert(myJsVal);    //-----分页控制条显示代码-------//    var pageBarXhtml = "";    pageBarXhtml += " <li><a href=\"javascript:void(0)\" onclick=\"PrePage()\">«</a></li>";    pageBarXhtml += " <li><a href=\"javascript:void(0)\" onclick=\"NumberPage('1')\">1</a></li>";    pageBarXhtml += "  <li><span>...</span></li>";    if ((intPageCurrent - 2) > 0) {
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
        //document.getElementById("SelAllCb").checked = false;

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
    openDialogWinNoClose("添加积分规则", mAddEditWinHtml, function () {

        //添加内容
        submitIntegralSetting(0);

    }, function () {


    }, 600);

}

/**
 * 打开编辑窗口
 * @param {any} pInSettingID 信息ID 
 */
function openEditWin(pInSettingID) {


    //打开Dialog弹出窗口
    openDialogWinNoClose("编辑积分规则", mAddEditWinHtml, function () {

        //添加或保存
        submitIntegralSetting(pInSettingID);

    }, function () {


    }, 600);

    //初始化商家积分设置信息
    initShopIntegralSetting(pInSettingID);
}



/**
 * 提交商家积分规则设置 
 * @param pInSettingID 积分设置ID 等于0为插入
 * */
function submitIntegralSetting(pInSettingID) {


    //获取表单值
    var InSettingType_ae = $("#InSettingType_ae").val().trim();
    var GoodsID_ae = $("#GoodsID_ae").val().trim();
    var IntegralPrice_ae = $("#IntegralPrice_ae").val().trim();

    if (GoodsID_ae == "" || IntegralPrice_ae == "") {
        toastWinToDiv("【商品ID】【返积分值】不能为空！", "dragWinDiv");
        return;
    }

    //构造POST参数
    var dataPOST = {
        "Type": "3", "InSettingID": pInSettingID, "InSettingType": InSettingType_ae, "GoodsID": GoodsID_ae, "IntegralPrice": IntegralPrice_ae
    };
    console.log(dataPOST);

    //显示加载提示
    loadingWinToDiv("dragWinDiv");

    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: mAjaxUrl + "?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("提交商家积分规则设置=" + reTxt);

            //移除加载提示
            closeLoadingWin();

            if (reTxt != "") {
                var _jsonReTxt = JSON.parse(reTxt);
                //错误返回信息
                if (_jsonReTxt.ErrMsg != "" && _jsonReTxt.ErrMsg != null && _jsonReTxt.ErrMsg != undefined) {
                    toastWinToDiv(_jsonReTxt.ErrMsg, "dragWinDiv");
                    return;
                }
                //操作成功信息
                if (_jsonReTxt.Msg != "" && _jsonReTxt.Msg != null && _jsonReTxt.Msg != undefined) {
                    toastWinToDiv(_jsonReTxt.Msg, "dragWinDiv");
                    //关闭窗口
                    closeDialogWin();
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
 * 初始化商家积分设置信息
 * @param {any} pInSettingID 积分设置信息ID
 */
function initShopIntegralSetting(pInSettingID) {

    //构造POST参数
    var dataPOST = {
        "Type": "4", "InSettingID": pInSettingID,
    };
    console.log(dataPOST);

    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: mAjaxUrl + "?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("初始化商家积分设置信息=" + reTxt);
            if (reTxt != "") {
                var _jsonReTxt = JSON.parse(reTxt);

                var _shopIntegralSetting = _jsonReTxt.ShopIntegralSettingList[0]

                $("#InSettingType_ae").val(_shopIntegralSetting.InSettingType);
                $("#GoodsID_ae").val(_shopIntegralSetting.GoodsID);
                $("#IntegralPrice_ae").val(_shopIntegralSetting.IntegralPrice);

                $("#GoodsID_ae").attr("disabled", true);

                //初始化商品的信息
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
        url: mAjaxUrl + "?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("初始化商品的信息=" + reTxt);
            if (reTxt != "") {
                var _jsonReTxt = JSON.parse(reTxt);

                if (_jsonReTxt.GoodsTitle != null) {
                    $("#ShowGoodsNameA").html(_jsonReTxt.GoodsTitle);
                    $("#ShowGoodsNameA").attr("href", "" + $("#hidOctWapWebAddrDomain").val().trim() + "/Goods/GoodsDetailPreMobileIframe?GID=" + _jsonReTxt.GoodsID + "")
                }
                else {
                    $("#ShowGoodsNameA").html("商品不存在！");
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
 * 启用/暂停  商家积分设置
 * @param {any} pInSettingID 积分设置ID
 * @param {any} pIsLock 是否锁定，商家可以锁定, 锁定后规则不起作用( 启用，暂停 )  false / true
 */
function toggleShopIntegralSetting(pInSettingID, pIsLock) {

    //构造POST参数
    var dataPOST = {
        "Type": "5", "InSettingID": pInSettingID, "IsLock": pIsLock,
    };
    console.log(dataPOST);

    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: mAjaxUrl + "?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("启用/暂停商家积分设置=" + reTxt);
            if (reTxt != "") {
                var _jsonReTxt = JSON.parse(reTxt);

                //错误返回信息
                if (_jsonReTxt.ErrMsg != "" && _jsonReTxt.ErrMsg != null && _jsonReTxt.ErrMsg != undefined) {
                    toastWin(_jsonReTxt.ErrMsg);
                    return;
                }
                //操作成功信息
                if (_jsonReTxt.Msg != "" && _jsonReTxt.Msg != null && _jsonReTxt.Msg != undefined) {
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
 * 删除商家积分设置
 * @param {any} pInSettingID 积分设置ID
 */
function delShopIntegralSetting(pInSettingID) {

    confirmWinWidth("确定要删除吗？", function () {


        //构造POST参数
        var dataPOST = {
            "Type": "6", "InSettingIDArr": pInSettingID,
        };
        console.log(dataPOST);

        //正式发送异步请求
        $.ajax({
            type: "POST",
            url: mAjaxUrl + "?rnd=" + Math.random(),
            data: dataPOST,
            dataType: "html",
            success: function (reTxt, status, xhr) {
                console.log("删除商家积分设置=" + reTxt);
                if (reTxt != "") {
                    var _jsonReTxt = JSON.parse(reTxt);

                    //错误返回信息
                    if (_jsonReTxt.ErrMsg != "" && _jsonReTxt.ErrMsg != null && _jsonReTxt.ErrMsg != undefined) {
                        toastWin(_jsonReTxt.ErrMsg);
                        return;
                    }
                    //操作成功信息
                    if (_jsonReTxt.Msg != "" && _jsonReTxt.Msg != null && _jsonReTxt.Msg != undefined) {
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
 * 统计商家当前积分总额
 * */
function sumCurrentIntegralShop() {

    //构造POST参数
    var dataPOST = {
        "Type": "7",
    };
    console.log(dataPOST);

    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: mAjaxUrl + "?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("统计商家当前积分总额=" + reTxt);
            if (reTxt != "") {
                var _jsonReTxt = JSON.parse(reTxt);

                //当前积分总额
                $("#ShopCurrentIntegralB").html(_jsonReTxt.CurrentIntegralShop);

            }
        },
        error: function (xhr, errorTxt, status) {
            console.log("异步请求错误，errorTxt=" + errorTxt + " | status=" + status);
            return;
        }
    });

}