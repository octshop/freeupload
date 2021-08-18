//============抽奖信息===============//

/**-----定义公共变量------**/

//AjaxURL
var mAjaxUrl = "../LuckyDraw/LuckyDrawMsg";

var mhidOctWapWeb_AddrDomain = "";

/******数据分页的变量********/
var strPOSTSe = ""; //搜索条件对象 POST参数
var intPageCurrent = 1; //当前页
var pageSize = 15; //当页的记录条数，与后台保持一致
var recordSum = 0; //总记录数
var tableColNum = 11; //当前表列数

/**------初始化------**/
$(function () {

    mhidOctWapWeb_AddrDomain = $("#hidOctWapWeb_AddrDomain").val().trim()

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

    var LuckydrawID_se = $("#LuckydrawID_se").val().trim();
    var LuckydrawTitle_se = $("#LuckydrawTitle_se").val().trim();
    var AwardsContentArr_se = $("#AwardsContentArr_se").val().trim();
    var LuckydrawStatus_se = $("#LuckydrawStatus_se").val().trim();
    var StartLuckyType_se = $("#StartLuckyType_se").val().trim();
    var ExpressType_se = $("#ExpressType_se").val().trim();
    var JoinLimit_se = $("#JoinLimit_se").val().trim();
    var IsPauseJoin_se = $("#IsPauseJoin_se").val().trim();
    var StartLuckyTime_se = $("#StartLuckyTime_se").val().trim();
    var WriteDate_se = $("#WriteDate_se").val().trim();


    //构造POST参数
    var strPOST = {
        "pageCurrent": "1", "Type": "1",
    };

    //翻页所用
    var strPOSTSePush = {
        "LuckydrawID": LuckydrawID_se, "LuckydrawTitle": LuckydrawTitle_se, "AwardsContentArr": AwardsContentArr_se,
        "LuckydrawStatus": LuckydrawStatus_se, "StartLuckyType": StartLuckyType_se, "ExpressType": ExpressType_se, "JoinLimit": JoinLimit_se, "IsPauseJoin": IsPauseJoin_se, "StartLuckyTime": StartLuckyTime_se, "WriteDate": WriteDate_se,
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

        var _StartLuckyType = "到人数开奖";
        if (indexDataPage.StartLuckyType == "OverTime") {
            _StartLuckyType = "到时间开奖";
        }

        var _JoinLimit = "不限制";
        if (indexDataPage.JoinLimit == "FavShop") {
            _JoinLimit = "已收藏店铺";
        }
        else if (indexDataPage.JoinLimit == "OrderShop") {
            _JoinLimit = "订购过店铺商品";
        }
        else if (indexDataPage.JoinLimit == "FavOrderShop") {
            _JoinLimit = "收藏店铺或订购过商品";
        }

        var _IsPauseJoin = "加入中";
        if (indexDataPage.IsPauseJoin == "true") {
            _IsPauseJoin = "已暂停";
        }

        var _IsCheck = "待审核";
        if (indexDataPage.IsCheck == "pass") {
            _IsCheck = "通过";
        }
        else if (indexDataPage.IsCheck == "true") {
            _IsCheck = "不通过";
        }

        if (indexDataPage.StartLuckyTime != null && indexDataPage.StartLuckyTime != "" && indexDataPage.StartLuckyTime != undefined) {
            var _StartLuckyTimeDay = dateDiffDay(getTodayDate(), indexDataPage.StartLuckyTime, false);
            if (Math.abs(_StartLuckyTimeDay) > 100 || parseInt(_StartLuckyTimeDay) <= 0) {
                _StartLuckyTimeDay = "";
            }
        }
        else {
            _StartLuckyTimeDay = "";
        }

        var _WriteDateDay = dateDiffDay(getTodayDate(), indexDataPage.WriteDate, false);
        if (Math.abs(_WriteDateDay) > 100) {
            _WriteDateDay = 0;
        }



        myJsVal += "<tr>";        myJsVal += "  <td><input type=\"checkbox\" name=\"SelCbItem\" id=\"SelCbItem_" + indexDataPage.LuckydrawID + "\" />";        myJsVal += " <td><a href=\"../LuckyDrawPage/LuckyDrawJoinMsg?LID=" + indexDataPage.LuckydrawID + "\">" + indexDataPage.LuckydrawID + "</a></td>";        myJsVal += " <td><a href=\"../LuckyDrawPage/LuckyDrawMsgDetail?LID=" + indexDataPage.LuckydrawID + "\" target=\"_blank\">" + indexDataPage.LuckydrawTitle + "</a></td>";        myJsVal += " <td>" + indexDataPage.LuckydrawStatus + "</td>";        myJsVal += " <td>" + _StartLuckyType + "</td>";        myJsVal += " <td>" + _JoinLimit + "</td>";        myJsVal += " <td>" + _IsPauseJoin + "<br /><font color=\"red\">" + indexDataPageExtra.JoinTotalNumber + "</font></td>";        myJsVal += " <td>" + _IsCheck + "</td>";        myJsVal += " <td>" + indexDataPage.StartLuckyTime + " <font color=\"red\">" + _StartLuckyTimeDay + "</font></td>";        myJsVal += " <td>" + indexDataPage.WriteDate + "</td>";        myJsVal += " <td>";        myJsVal += "<button class=\"table-btn am-btn am-btn-default am-btn-xs am-text-success am-round\" onclick=\"createQRCodeImg('" + indexDataPage.LuckydrawID + "', '" + indexDataPage.LuckydrawTitle + "')\">二维码</button>";        myJsVal += "<button class=\"table-btn am-btn am-btn-default am-btn-xs am-text-secondary am-round\" onclick=\"window.location.href='../LuckyDrawPage/LuckyDrawMsgEdit?LID=" + indexDataPage.LuckydrawID + "'\">编辑</button>";        if (indexDataPage.LuckydrawStatus == "未开奖") {            myJsVal += "<button class=\"table-btn am-btn am-btn-default am-btn-xs am-text-danger am-round\" onclick=\"openLuckyDrawResult('" + indexDataPage.LuckydrawID + "')\">立即开奖</button>";
        }        if (indexDataPage.LuckydrawStatus == "已开奖" && indexDataPage.ExpressType == "shop") {            myJsVal += "<button class=\"table-btn am-btn am-btn-default am-btn-xs am-text-warning am-round\" onclick=\"window.location.href='../LuckyDrawPage/LuckyDrawResult'\">领奖验证</button>";
        }        else if (indexDataPage.LuckydrawStatus == "已开奖" && indexDataPage.ExpressType == "express") {            myJsVal += "<button class=\"table-btn am-btn am-btn-default am-btn-xs am-text-warning am-round\" onclick=\"window.location.href='../LuckyDrawPage/LuckyDrawResult'\">中奖发货</button>";
        }        myJsVal += " </td>";        myJsVal += "</tr>";        if (indexDataPage.CheckReason != "" && indexDataPage.IsCheck == "true") {            myJsVal += "<tr><td class=\"td-hint-status\" colspan=\"11\">" + indexDataPage.CheckReason + "</td></tr>";
        }    }    //alert(myJsVal);    //-----分页控制条显示代码-------//    var pageBarXhtml = "";    pageBarXhtml += " <li><a href=\"javascript:void(0)\" onclick=\"PrePage()\">«</a></li>";    pageBarXhtml += " <li><a href=\"javascript:void(0)\" onclick=\"NumberPage('1')\">1</a></li>";    pageBarXhtml += "  <li><span>...</span></li>";    if ((intPageCurrent - 2) > 0) {
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


//=====================其他自定义函数=========================//

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
 * 开奖 指定的抽奖信息
 * @param {any} pLuckydrawID
 */
function openLuckyDrawResult(pLuckydrawID) {

    confirmWinWidth("确定要开奖吗？", function () {

        //构造POST参数
        var dataPOST = {
            "Type": "4", "LuckydrawID": pLuckydrawID,
        };
        console.log(dataPOST);

        //加载进度条
        loadingWin();

        //正式发送异步请求
        $.ajax({
            type: "POST",
            url: mAjaxUrl + "?rnd=" + Math.random(),
            data: dataPOST,
            dataType: "html",
            success: function (reTxt, status, xhr) {
                console.log("开奖指定的抽奖信息=" + reTxt);
                //移除加载进度条
                closeLoadingWin();
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

    }, 400);

}

/**
 * 批量操作 - 暂停与重启抽奖参与
 * @param pIsPauseJoin 暂停加入 ( false / true)
 * */
function tglPauseJoinArr(pIsPauseJoin) {

    var _SelectValArr = getSelectValArr()

    if (_SelectValArr == "") {
        toastWin("请选择需操作的记录!");
        return;
    }

    //构造POST参数
    var dataPOST = {
        "Type": "6", "LuckydrawIDArr": _SelectValArr, "IsPauseJoin": pIsPauseJoin,
    };
    console.log(dataPOST);

    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: mAjaxUrl + "?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("暂停与重启抽奖参与=" + reTxt);
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
 * 删除抽奖信息
 * */
function delLuckyDrawMsgArr() {

    var _SelectValArr = getSelectValArr()

    if (_SelectValArr == "") {
        toastWin("请选择需操作的记录!");
        return;
    }

    //构造POST参数
    var dataPOST = {
        "Type": "7", "LuckydrawIDArr": _SelectValArr,
    };
    console.log(dataPOST);

    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: mAjaxUrl + "?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("删除抽奖信息=" + reTxt);
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
 */
function createQRCodeImg(pLuckydrawID, pLuckydrawTitle) {

    var QRCodeTitle = "抽奖分享二维码";
    var QRCodeTitleSub = pLuckydrawTitle;
    var QRCodeDesc = "请将此二维码分享给好友或其他人，扫码识别，邀请好友参与抽奖！";
    var QRCodeURL = mhidOctWapWeb_AddrDomain + "/Mall/LuckyDrawDetail?lid=" + pLuckydrawID + "";

    //window.location.href = "../SysPage/CreateSysQRCode?QRCodeTitle=" + escape(QRCodeTitle) + "&QRCodeTitleSub=" + escape(QRCodeTitleSub) + "&QRCodeDesc=" + escape(QRCodeDesc) + "&QRCodeURL=" + escape(QRCodeURL);

    window.open("../SysPage/CreateSysQRCode?QRCodeTitle=" + escape(QRCodeTitle) + "&QRCodeTitleSub=" + escape(QRCodeTitleSub) + "&QRCodeDesc=" + escape(QRCodeDesc) + "&QRCodeURL=" + escape(QRCodeURL));

    return;
}

