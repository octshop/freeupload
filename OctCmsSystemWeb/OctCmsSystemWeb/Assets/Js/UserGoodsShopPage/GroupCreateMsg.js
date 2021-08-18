//===============发起拼团管理=======================//


/**-----定义公共变量------**/
//AjaxURL
var mAjaxUrl = "../UserGoodsShop/GroupCreateMsg";

//移动手机端域名
var mOctWapWebAddrDomain = "";

/******数据分页的变量********/
var strPOSTSe = ""; //搜索条件对象 POST参数
var intPageCurrent = 1; //当前页
var pageSize = 15; //当页的记录条数，与后台保持一致
var recordSum = 0; //总记录数
var tableColNum = 12; //当前表列数

/**------初始化------**/

$(function () {

    mOctWapWebAddrDomain = $("#hidOctWapWeb_AddrDomain").val().trim();

    //初始化加载
    searchContent();

    //搜索按钮单击事件
    $("#btnSearch").click(function () {
        searchContent();
    });


});



//========================数据分页搜索==============================//

/*
------定义搜索函数-----
*/
var searchContent = function () {

    intPageCurrent = 1; //开始页

    var ShopUserID_se = $("#ShopUserID_se").val().trim();
    var GoodsID_se = $("#GoodsID_se").val().trim();
    var GroupPersonNum_se = $("#GroupPersonNum_se").val().trim();
    var UserNick_se = $("#UserNick_se").val().trim();
    var IsFinish_se = $("#IsFinish_se").val().trim();
    var IsPaySuccess_se = $("#IsPaySuccess_se").val().trim();
    var IsRefund_se = $("#IsRefund_se").val().trim();
    var OverTimeDate_se = $("#OverTimeDate_se").val().trim();
    var IsLock_se = $("#IsLock_se").val().trim();
    var WriteDate_se = $("#WriteDate_se").val().trim();


    //构造POST参数
    var strPOST = {
        "pageCurrent": "1", "Type": "1",
    };

    //翻页所用
    var strPOSTSePush = {
        "GoodsID": GoodsID_se, "GroupPersonNum": GroupPersonNum_se, "UserNick": UserNick_se,
        "IsFinish": IsFinish_se, "IsPaySuccess": IsPaySuccess_se, "IsRefund": IsRefund_se, "OverTimeDate": OverTimeDate_se, "WriteDate": WriteDate_se, "ShopUserID": ShopUserID_se, "IsLock": IsLock_se,
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

        if (indexDataPage.IsFinish == "true") {
            indexDataPage.IsFinish = "是";
        }
        else {
            indexDataPage.IsFinish = "否";
        }

        if (indexDataPage.IsPaySuccess == "true") {
            indexDataPage.IsPaySuccess = "是";
        }
        else {
            indexDataPage.IsPaySuccess = "否";
        }

        if (indexDataPage.IsRefund == "true") {
            indexDataPage.IsRefund = "是";
        }
        else {
            indexDataPage.IsRefund = "否";
        }

        var _IsLock = "否";
        if (indexDataPage.IsLock == "true") {
            _IsLock = "是";
        }

        var _distanceDayStr = "" + indexDataPageExtra.DistanceDay + "天";        if (indexDataPageExtra.IsOverTime == "True") {            _distanceDayStr = "过期";
        }

        myJsVal += "<tr>";        myJsVal += "<td>"        if (indexDataPage.IsFinish == "否" && indexDataPage.IsPaySuccess == "是" && indexDataPage.IsRefund == "否" && indexDataPageExtra.IsOverTime == "False") {            myJsVal += "<input type=\"checkbox\" name=\"SelCbItem\" id=\"SelCbItem_" + indexDataPage.GroupID + "\" />";        }        myJsVal += "</td>"        myJsVal += "<td><a href=\"../UserGoodsShopPage/GroupJoinMsg?GroupID=" + indexDataPage.GroupID +"\">" + indexDataPage.GroupID + "</a><i style=\"color: gray; display: block;\"><a href=\"../UserGoodsShopPage/ShopMsgDetail?UserID=" + indexDataPage.ShopUserID + "\" target=\"_blank\">" + indexDataPage.ShopUserID + "</a></i></td>";        myJsVal += "<td><a href=\"" + mOctWapWebAddrDomain + "/Goods/GroupDetailPreMobileIframe?GID=" + indexDataPage.GoodsID + "\" target=\"_blank\">" + indexDataPage.GoodsID + "</a></td>";        myJsVal += " <td>" + indexDataPage.GroupPersonNum + "</td>";        myJsVal += " <td>" + indexDataPageExtra.CountJoinUser + "</td>";        myJsVal += " <td>" + indexDataPage.IsFinish + "</td>";        myJsVal += " <td>" + indexDataPage.IsPaySuccess + "</td>";        myJsVal += " <td>" + indexDataPage.IsRefund + "<i style=\"color: gray; display: block;\">" + _IsLock + "</i></td>";        myJsVal += " <td class=\"user-header-appraise\"><img src=\"" + indexDataPage.HeaderImg + "\" />" + indexDataPage.UserNick + "</td>";        myJsVal += " <td>" + indexDataPage.OverTimeDate + " <font color=\"red\"> " + _distanceDayStr + "</font></td>";        myJsVal += " <td>" + indexDataPage.WriteDate + "</td>";        myJsVal += " <td>";        if (indexDataPage.IsLock == "true") {            myJsVal += "<button class=\"table-btn am-btn am-btn-default am-btn-xs am-text-secondary am-round\" onclick=\"lockGroupCreateMsgApi('" + indexDataPage.GroupID + "')\">解锁</button>";
        }        else {            myJsVal += "<button class=\"table-btn am-btn am-btn-default am-btn-xs am-text-secondary am-round\" onclick=\"lockGroupCreateMsgApi('" + indexDataPage.GroupID + "')\">锁定</button>";
        }        myJsVal += " </td>";        myJsVal += "</tr>";    }    //alert(myJsVal);    //-----分页控制条显示代码-------//    var pageBarXhtml = "";    pageBarXhtml += " <li><a href=\"javascript:void(0)\" onclick=\"PrePage()\">«</a></li>";    pageBarXhtml += " <li><a href=\"javascript:void(0)\" onclick=\"NumberPage('1')\">1</a></li>";    pageBarXhtml += "  <li><span>...</span></li>";    if ((intPageCurrent - 2) > 0) {
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


//============数据分页搜索=============//


//==================自定义函数==================//

/**
 * 锁定/解锁开团信息
 */
function lockGroupCreateMsgApi(pGroupID) {

    if (pGroupID == "") {
        return;
    }
    //构造POST参数
    var dataPOST = {
        "Type": "4", "GroupID": pGroupID,
    };
    console.log(dataPOST);


    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: mAjaxUrl + "?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("锁定/解锁开团信息=" + reTxt);


            if (reTxt != "") {
                var _jsonReTxt = JSON.parse(reTxt);

                if (_jsonReTxt.ErrMsg != null && _jsonReTxt.ErrMsg != undefined && _jsonReTxt.ErrMsg != "") {
                    toastWin(_jsonReTxt.ErrMsg);
                    return;
                }

                if (_jsonReTxt.Msg != null && _jsonReTxt.Msg != undefined && _jsonReTxt.Msg != "") {
                    toastWin(_jsonReTxt.Msg);
                    //重新加载数据
                    NumberPage(intPageCurrent)

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
 * 批量开团信息 成团操作
 */
function manualGroupFinishMul() {

    var _groupIDArr = getSelectValArr();

    if (_groupIDArr == "") {
        toastWin("请选择要操作的记录！");
        return;
    }

    confirmWinWidth("确定要手动成团吗？", function () {

        //构造POST参数
        var dataPOST = {
            "Type": "3", "GroupIDArr": _groupIDArr,
        };
        console.log(dataPOST);

        //显示加载提示
        loadingWin();

        //正式发送异步请求
        $.ajax({
            type: "POST",
            url: mAjaxUrl + "?rnd=" + Math.random(),
            data: dataPOST,
            dataType: "html",
            success: function (reTxt, status, xhr) {
                console.log("商家手动成团批量=" + reTxt);

                //移除加载提示
                closeLoadingWin();

                if (reTxt != "") {
                    var _jsonReTxt = JSON.parse(reTxt);

                    if (_jsonReTxt.ErrMsg != null && _jsonReTxt.ErrMsg != undefined && _jsonReTxt.ErrMsg != "") {
                        alertWinWidth(_jsonReTxt.ErrMsg, 400);
                        return;
                    }

                    if (_jsonReTxt.Msg != null && _jsonReTxt.Msg != undefined && _jsonReTxt.Msg != "") {
                        toastWin(_jsonReTxt.Msg);
                        //重新加载数据
                        NumberPage(intPageCurrent)

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