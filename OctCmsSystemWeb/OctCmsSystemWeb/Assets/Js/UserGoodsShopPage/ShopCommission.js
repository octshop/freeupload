//================店铺抽成比例======================//


/**-----定义公共变量------**/
//AjaxURL
var mAjaxUrl = "../UserGoodsShop/ShopCommission";

//添加窗口的Html显示代码
var mAddEditWinHtml = "";

//信息ID
var mMsgID = "";

//手机端Web域名
var mOctWapWebAddrDomain = "";

/**------初始化------**/
$(function () {

    mOctWapWebAddrDomain = $("#hidOctWapWebAddrDomain").val().trim();

    //初始化加载
    searchContent();

    //搜索按钮单击事件
    $("#btnSearch").click(function () {
        searchContent();
    });


    //初始化添加窗口显示代码
    initAddEditWinHtml();

});



//===================数据搜索分页======================//

/******数据分页的变量********/
var strPOSTSe = ""; //搜索条件对象 POST参数
var intPageCurrent = 1; //当前页
var pageSize = 0; //当页的记录条数，与后台保持一致
var recordSum = 0; //总记录数
var tableColNum = 9; //当前表列数

/*
---------定义搜索函数---------
*/
var searchContent = function () {

    intPageCurrent = 1; //开始页

    var CommissionID_se = $("#CommissionID_se").val().trim();
    var ShopID_se = $("#ShopID_se").val().trim();
    var ShopUserID_se = $("#ShopUserID_se").val().trim();
    var CommissionPersent_se = $("#CommissionPersent_se").val().trim();
    var CommissionMemo_se = $("#CommissionMemo_se").val().trim();
    var IsLock_se = $("#IsLock_se").val().trim();
    var WriteDate_se = $("#WriteDate_se").val().trim();


    //构造POST参数
    var strPOST = {
        "pageCurrent": "1", "Type": "1"
    };

    //翻页所用
    var strPOSTSePush = {
        "CommissionID": CommissionID_se, "ShopID": ShopID_se, "ShopUserID": ShopUserID_se,
        "CommissionPersent": CommissionPersent_se, "CommissionMemo": CommissionMemo_se, "IsLock": IsLock_se, "WriteDate": WriteDate_se
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

        var _IsLock = "否";
        if (indexDataPage.IsLock == "true") {
            _IsLock = "是";
        }

        myJsVal += "<tr>";
        myJsVal += "  <td><input type=\"checkbox\" name=\"SelCbItem\" id=\"SelCbItem_" + indexDataPage.CommissionID + "\" /></td>";
        myJsVal += " <td>" + indexDataPage.CommissionID + "</td>";
        myJsVal += " <td>" + indexDataPage.ShopUserID + "</td>";
        myJsVal += " <td>";
        myJsVal += "" + indexDataPage.ShopID + "<i style=\"color: gray;display: block;\"><a href=\"" + mOctWapWebAddrDomain + "/Mall/PagePreMobileIframe?LoadPreURL=" + mOctWapWebAddrDomain + "/Shop/Index?SID=" + indexDataPage.ShopID + "\" target=\"_blank\">" + indexDataPage.ShopName + "</a></i>";
        myJsVal += " </td>";
        myJsVal += " <td>" + indexDataPage.CommissionPersent + "%</td>";
        myJsVal += " <td>" + indexDataPage.CommissionMemo + "</td>";
        myJsVal += " <td>" + _IsLock + "</td>";
        myJsVal += " <td>" + indexDataPage.WriteDate + "</td>";
        myJsVal += " <td>";
        if (indexDataPage.IsLock == "true") {
            myJsVal += "<button class=\"table-btn am-btn am-btn-default am-btn-xs am-text-secondary am-round\" onclick=\"tglLockShopCommission('" + indexDataPage.CommissionID + "', 'false')\">解锁</button>";
        }
        else {
            myJsVal += "<button class=\"table-btn am-btn am-btn-default am-btn-xs am-text-secondary am-round\" onclick=\"tglLockShopCommission('" + indexDataPage.CommissionID + "', 'true')\">锁定</button>";
        }

        myJsVal += "<button class=\"table-btn am-btn am-btn-default am-btn-xs am-text-warning  am-round\" onclick=\"openEditWin('" + indexDataPage.CommissionID + "')\">修改</button>";
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

//-----------以GET方式发送分页请求的函数------------//
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
        document.getElementById("SelAllCb").checked = false;

    }
    else {
        $("#TbodyTrPage").html("<tr><td colspan=\"" + tableColNum + "\">没有搜索到相关数据</td></tr>");
    }
}


//----------跳转页-------------//
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

//===================数据搜索分页======================//


//===================自定义函数======================//

/**
 * 切换 -锁定店铺抽成比例信息
 * @param {any} pCommissionID
 * @param {any} pIsLock
 */
function tglLockShopCommission(pCommissionID, pIsLock) {

    //构造POST参数
    var dataPOST = {
        "Type": "2", "CommissionID": pCommissionID, "IsLock": pIsLock,
    };
    console.log(dataPOST);

    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: mAjaxUrl + "?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("切换 -锁定店铺抽成比例信息=" + reTxt);
            if (reTxt != "") {
                var _jsonReTxt = JSON.parse(reTxt);

                if (_jsonReTxt.ErrMsg != "" && _jsonReTxt.ErrMsg != undefined && _jsonReTxt.ErrMsg != undefined) {
                    toastWin(_jsonReTxt.ErrMsg);
                    return;
                }

                if (_jsonReTxt.Msg != "" && _jsonReTxt.Msg != undefined && _jsonReTxt.Msg != undefined) {
                    toastWin(_jsonReTxt.Msg);
                    //重新加载数据
                    NumberPage(intPageCurrent);
                    return;
                }


            }
        },
        error: function (xhr, errorTxt, status) {
            console.log("异步请求错误，errorTxt=" + errorTxt + " | status=" + status);
            //alert("异步请求错误，errorTxt=" + errorTxt + " | status=" + status);
            return;
        }
    });

}

/**
 * 批量删除店铺抽成比例信息
 */
function delShopCommissionArr() {

    var MsgIDArr = getSelectValArr();
    console.log("MsgIDArr=" + MsgIDArr);

    if (MsgIDArr == "") {
        toastWin("请选择要删除的信息！");
        return;
    }

    //构造POST参数
    var dataPOST = {
        "Type": "3", "CommissionIDArr": MsgIDArr,
    };
    console.log(dataPOST);

    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: mAjaxUrl + "?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("批量删除店铺抽成比例信息=" + reTxt);
            if (reTxt != "") {
                var _jsonReTxt = JSON.parse(reTxt);

                if (_jsonReTxt.ErrMsg != "" && _jsonReTxt.ErrMsg != undefined && _jsonReTxt.ErrMsg != undefined) {
                    toastWin(_jsonReTxt.ErrMsg);
                    return;
                }

                if (_jsonReTxt.Msg != "" && _jsonReTxt.Msg != undefined && _jsonReTxt.Msg != undefined) {
                    toastWin(_jsonReTxt.Msg);
                    //重新加载数据
                    NumberPage(intPageCurrent);
                    return;
                }


            }
        },
        error: function (xhr, errorTxt, status) {
            console.log("异步请求错误，errorTxt=" + errorTxt + " | status=" + status);
            //alert("异步请求错误，errorTxt=" + errorTxt + " | status=" + status);
            return;
        }
    });

}



//----------------弹出窗口功能-------------//

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

    mMsgID = "";

    //打开Dialog弹出窗口
    openDialogWinNoClose("添加窗口", mAddEditWinHtml, function () {

        //提交信息
        submitShopCommission();

    }, function () {



    }, 600);

}


/**
 * 打开编辑窗口
 * @param {any} mMsgID 信息ID
 */
function openEditWin(pMsgID) {

    //console.log("mEditWinHtml=" + mEditWinHtml);

    //打开Dialog弹出窗口
    openDialogWinNoClose("编辑窗口", mAddEditWinHtml, function () {

        //提交信息
        submitShopCommission();

    }, function () {



    }, 600);

    mMsgID = pMsgID;

    //初始化店铺抽成比例信息
    initShopCommission(pMsgID);

}


/**
 * 初始化店铺简单信息
 * */
function initShopMsgSimple() {

    var pShopID = $("#ShopIDWin").val().trim();
    if (pShopID == "" || parseInt(pShopID) <= 0) {
        $("#ShopNameB").html("");
        return;
    }

    //构造POST参数
    var dataPOST = {
        "Type": "8", "ShopID": pShopID,
    };
    console.log(dataPOST);

    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: "../UserGoodsShop/ShopMsg?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("初始化店铺简单信息=" + reTxt);
            if (reTxt != "") {
                var _jsonReTxt = JSON.parse(reTxt);

                if (_jsonReTxt.ShopName != null) {
                    $("#ShopNameB").html("<a href=\"" + mOctWapWebAddrDomain + "/Shop/Index?SID=" + _jsonReTxt.ShopID + "\" target=\"_blank\" >" + _jsonReTxt.ShopName + "</a>");
                }
                else {
                    $("#ShopNameB").html("");
                }

            }
        },
        error: function (xhr, errorTxt, status) {
            console.log("异步请求错误，errorTxt=" + errorTxt + " | status=" + status);
            //alert("异步请求错误，errorTxt=" + errorTxt + " | status=" + status);
            return;
        }
    });
}

/**
 * 初始化店铺抽成比例信息
 * @param {any} pCommissionID 抽成ID
 */
function initShopCommission(pCommissionID) {

    //构造POST参数
    var dataPOST = {
        "Type": "5", "CommissionID": pCommissionID,
    };
    console.log(dataPOST);

    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: mAjaxUrl + "?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("初始化店铺抽成比例信息=" + reTxt);
            if (reTxt != "") {
                var _jsonReTxt = JSON.parse(reTxt);

                $("#ShopIDWin").val(_jsonReTxt.ShopID);
                //初始化店铺
                initShopMsgSimple();
                $("#CommissionPersentWin").val(_jsonReTxt.CommissionPersent);
                $("#CommissionMemoWin").val(_jsonReTxt.CommissionMemo);
                $("#ShareGoodsPersentWin").val(_jsonReTxt.ShareGoodsPersent);
                $("#ExpandShopPersentWin").val(_jsonReTxt.ExpandShopPersent);

            }
        },
        error: function (xhr, errorTxt, status) {
            console.log("异步请求错误，errorTxt=" + errorTxt + " | status=" + status);
            //alert("异步请求错误，errorTxt=" + errorTxt + " | status=" + status);
            return;
        }
    });

}

/**
 * 提交信息
 * */
function submitShopCommission() {

    //获取表单值
    var ShopIDWin = $("#ShopIDWin").val().trim();
    var CommissionPersentWin = $("#CommissionPersentWin").val().trim();
    var CommissionMemoWin = $("#CommissionMemoWin").val().trim();

    var ShareGoodsPersentWin = $("#ShareGoodsPersentWin").val().trim();
    var ExpandShopPersentWin = $("#ExpandShopPersentWin").val().trim();

    //判断输入合法性
    if (ShopIDWin == "" || CommissionPersentWin == "") {
        toastWinToDiv("【店铺ID】和【抽成百分比】不能为空！", "dragWinDiv");
        return;
    }

    var ShopNameB = $("#ShopNameB").html().trim();
    if (ShopNameB == "") {
        toastWinToDiv("【店铺】不存在！", "dragWinDiv");
        return;
    }

    //构造POST参数
    var dataPOST = {
        "Type": "4", "CommissionID": mMsgID, "ShopID": ShopIDWin, "CommissionPersent": CommissionPersentWin, "CommissionMemo": CommissionMemoWin, "ShareGoodsPersent": ShareGoodsPersentWin, "ExpandShopPersent": ExpandShopPersentWin,
    };
    console.log(dataPOST);

    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: mAjaxUrl + "?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("提交信息=" + reTxt);
            if (reTxt != "") {
                var _jsonReTxt = JSON.parse(reTxt);

                if (_jsonReTxt.ErrMsg != "" && _jsonReTxt.ErrMsg != undefined && _jsonReTxt.ErrMsg != undefined) {
                    toastWinToDiv(_jsonReTxt.Msg, "dragWinDiv");
                    return;
                }

                if (_jsonReTxt.Msg != "" && _jsonReTxt.Msg != undefined && _jsonReTxt.Msg != undefined) {

                    toastWinToDivCb(_jsonReTxt.Msg, function () {

                        //关闭窗口
                        closeDialogWin();
                        //重新加载数据
                        NumberPage(intPageCurrent);

                    }, "dragWinDiv");


                    return;
                }
            }
        },
        error: function (xhr, errorTxt, status) {
            console.log("异步请求错误，errorTxt=" + errorTxt + " | status=" + status);
            //alert("异步请求错误，errorTxt=" + errorTxt + " | status=" + status);
            return;
        }
    });

}