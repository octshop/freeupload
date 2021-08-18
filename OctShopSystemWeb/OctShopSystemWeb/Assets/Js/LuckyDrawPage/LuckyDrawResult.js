//================中奖结果信息===========================//


/**-----定义公共变量------**/

//AjaxURL
var mAjaxUrl = "../LuckyDraw/LuckyDrawResult";

//抽奖结果ID
var mLuckyDrawResultID = "";
//是否已领取
var mIsGetPrize = "";
//买家UserID
var mBuyerUserID = "";


/******数据分页的变量********/
var strPOSTSe = ""; //搜索条件对象 POST参数
var intPageCurrent = 1; //当前页
var pageSize = 15; //当页的记录条数，与后台保持一致
var recordSum = 0; //总记录数
var tableColNum = 10; //当前表列数

/**------初始化------**/
$(function () {

    $("#LuckydrawID_se").val($("#hidLuckydrawID").val().trim());

    //领奖验证弹出窗口
    initPopWinHtmlCheckOrder();

    //初始化添加窗口显示代码
    initPopWinHtml();

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

    var LuckyDrawResultID_se = $("#LuckyDrawResultID_se").val().trim();
    var LuckydrawID_se = $("#LuckydrawID_se").val().trim();
    var AwardsItem_se = $("#AwardsItem_se").val().trim();
    var UserNick_se = $("#UserNick_se").val().trim();
    var LinkMobile_se = $("#LinkMobile_se").val().trim();
    var WriteDate_se = $("#WriteDate_se").val().trim();
    var IsGetPrize_se = $("#IsGetPrize_se").val().trim();


    //构造POST参数
    var strPOST = {
        "pageCurrent": "1", "Type": "1",
    };

    //翻页所用
    var strPOSTSePush = {
        "LuckyDrawResultID": LuckyDrawResultID_se, "LuckydrawID": LuckydrawID_se, "UserNick": UserNick_se, "LinkMobile": LinkMobile_se, "WriteDate": WriteDate_se, "IsGetPrize": IsGetPrize_se, "AwardsItem": AwardsItem_se
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
    var myJsVal = "";    //循环构造    for (var i = 0; i < json.DataPage1.length; i++) {

        var indexDataPage1 = json.DataPage1[i];
        var indexDataPage2 = json.DataPage2[i];
        var indexDataPageExtra = json.DataPageExtra[i];


        var _WriteDateDay = Math.abs(dateDiffDay(getTodayDate(), indexDataPage1.WriteDate, false));
        if (Math.abs(_WriteDateDay) > 100) {
            _WriteDateDay = 0;
        }

        var _IsGetPrizeName = "";
        if (indexDataPageExtra.ExpressType == "shop" && indexDataPage1.IsGetPrize == "false") {
            _IsGetPrizeName = "未领取"
        }
        else if (indexDataPageExtra.ExpressType == "shop" && indexDataPage1.IsGetPrize == "true") {
            _IsGetPrizeName = "已领取"
        }
        else if (indexDataPageExtra.ExpressType == "express" && indexDataPage1.IsGetPrize == "false") {
            _IsGetPrizeName = "未发货"
        }
        else if (indexDataPageExtra.ExpressType == "express" && indexDataPage1.IsGetPrize == "true") {
            _IsGetPrizeName = "已发货"
        }

        myJsVal += "<tr>";        myJsVal += " <td><input type=\"checkbox\" /></td>";        myJsVal += " <td>" + indexDataPage1.LuckyDrawResultID + "</td>";        myJsVal += " <td><a href=\"../LuckyDrawPage/LuckyDrawMsgDetail?LID=" + indexDataPage1.LuckydrawID + "\" target=\"_blank\">" + indexDataPage1.LuckydrawID + "</a></td>";        myJsVal += " <td>" + indexDataPage1.AwardsItem +"</td>";        myJsVal += " <td>";        myJsVal += "     <img src=\"" + indexDataPage2.HeaderImg + "\" />";        myJsVal += "     " + indexDataPage2.UserNick + "";        myJsVal += " </td>";        myJsVal += " <td>" + indexDataPage2.LinkMobile + "</td>";        myJsVal += " <td>" + _IsGetPrizeName + "</td>";        myJsVal += "<td>" + indexDataPage1.GetPrizeDate + "</td>";        myJsVal += " <td>" + indexDataPage1.WriteDate + " <font color=\"red\">" + _WriteDateDay + "</font></td>";        myJsVal += " <td>";        if (indexDataPageExtra.ExpressType == "shop" && indexDataPage1.IsGetPrize == "false") {            myJsVal += "<button class=\"table-btn am-btn am-btn-default am-btn-xs am-text-secondary am-round\" onclick=\"openCheckOrderWin('" + indexDataPage1.LuckyDrawResultID + "','" + indexDataPage1.LuckydrawID + "', '" + indexDataPage1.BuyerUserID + "') \">领取验证</button>";
        }        else if (indexDataPageExtra.ExpressType == "express" && indexDataPage1.IsGetPrize == "false") {            myJsVal += "<button class=\"table-btn am-btn am-btn-default am-btn-xs am-text-warning am-round\" onclick=\"openSendGoodsWin('" + indexDataPage1.LuckyDrawResultID + "','" + indexDataPage1.IsGetPrize + "','" + indexDataPage1.LuckydrawID + "','" + indexDataPage1.BuyerUserID + "','" + indexDataPage2.LinkMobile + "','" + indexDataPage1.AwardsItem +"')\">奖品发货</button>";
        }        else if (indexDataPageExtra.ExpressType == "express" && indexDataPage1.IsGetPrize == "true") {            myJsVal += "<button class=\"table-btn am-btn am-btn-default am-btn-xs am-text-warning am-round\" onclick=\"openSendGoodsWin('" + indexDataPage1.LuckyDrawResultID + "','" + indexDataPage1.IsGetPrize + "','" + indexDataPage1.LuckydrawID + "','" + indexDataPage1.BuyerUserID + "','" + indexDataPage2.LinkMobile + "','" + indexDataPage1.AwardsItem +"')\">修改发货</button>";
        }        myJsVal += " </td>";        myJsVal += "</tr>";    }    //alert(myJsVal);    //-----分页控制条显示代码-------//    var pageBarXhtml = "";    pageBarXhtml += " <li><a href=\"javascript:void(0)\" onclick=\"PrePage()\">«</a></li>";    pageBarXhtml += " <li><a href=\"javascript:void(0)\" onclick=\"NumberPage('1')\">1</a></li>";    pageBarXhtml += "  <li><span>...</span></li>";    if ((intPageCurrent - 2) > 0) {
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


//------------跳转页---------------//
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


//====================自定义其他 的函数======================//






//================领奖验证 弹出窗口==================//

var mPopWinHtmlCheckOrder = "";
/**
 * 初始化 领奖验证 弹窗窗口显示代码
 */
function initPopWinHtmlCheckOrder() {
    //获取窗口显示代码
    mPopWinHtmlCheckOrder = $("#CheckOrderWin").html();
    $("#CheckOrderWin").empty();
}


/**
 * 打开领奖验证 窗口
 */
function openCheckOrderWin(pLuckyDrawResultID, pLuckyDrawID, pBuyerUserID) {
    //订单ID
    mLuckyDrawResultID = pLuckyDrawResultID;

    //打开Dialog弹出窗口
    openDialogWinNoClose("领取验证", mPopWinHtmlCheckOrder, function () {

        //领奖验证 
        verifyOrderCheckCode(pLuckyDrawResultID, pBuyerUserID);

    }, function () {


    }, 600);


    $("#OrderIDA").html(pLuckyDrawResultID);
    $("#OrderIDA").attr("href", "../LuckyDrawPage/LuckyDrawMsgDetail?LID=" + pLuckyDrawID);
    $("#CheckCodeWin").focus();


}


/**
 * 领奖验证  
 * */
function verifyOrderCheckCode(pLuckyDrawResultID, pBuyerUserID) {

    //获取表单值
    var CheckTypeWin = $("#CheckTypeWin").val().trim();
    var CheckCodeWin = $("#CheckCodeWin").val().trim();
    if (CheckCodeWin == "") {
        toastWinToDiv("【验证码】不能为空！", "dragWinDiv");
        $("#CheckCodeWin").focus();
        return;
    }

    //构造POST参数
    var dataPOST = {
        "Type": "2", "ExtraData": pLuckyDrawResultID, "BuyerUserID": pBuyerUserID, "VerifyType": CheckTypeWin, "VerifyCode": CheckCodeWin,
    };
    console.log(dataPOST);

    //加载提示窗口
    loadingWinToDiv("dragWinDiv");

    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: "../VerifyCode/VerifyCodeAll?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("领奖验证 =" + reTxt);

            //移除加载提示
            closeLoadingWin();

            if (reTxt != "") {
                var _jsonObj = JSON.parse(reTxt);
                if (_jsonObj.ErrMsg != "" && _jsonObj.ErrMsg != null && _jsonObj.ErrMsg != undefined) {
                    toastWinToDiv(_jsonObj.ErrMsg, "dragWinDiv");
                    return;
                }
                if (_jsonObj.Msg != "" && _jsonObj.Msg != null && _jsonObj.Msg != undefined) {
                    toastWinToDivCb(_jsonObj.Msg, function () {

                        //关闭窗口
                        closeDialogWin();
                        //重新加载数据
                        NumberPage(intPageCurrent);

                    }, "dragWinDiv");

                }
            }
        },
        error: function (xhr, errorTxt, status) {
            console.log("异步请求错误，errorTxt=" + errorTxt + " | status=" + status);
            return;
        }
    });
}


//================发货弹窗==================//

/**
 * 初始化添加窗口显示代码
 */
function initPopWinHtml() {
    //获取窗口显示代码
    mPopWinHtml = $("#SendGoodsWin").html();
    $("#SendGoodsWin").empty();
}


/**
 * 打开发货窗口
 * @param {any} pMsgID 信息ID ShopGoodsTypeID
 * @param pIsGetPrize 是否已发货 [ false / true ]
 */
function openSendGoodsWin(pLuckyDrawResultID, pIsGetPrize, pLuckyDrawID, pBuyerUserID, pLinkMobile, pAwardsItem) {


    mLuckyDrawResultID = pLuckyDrawResultID;
    mIsGetPrize = pIsGetPrize;
    mBuyerUserID = pBuyerUserID


    //打开Dialog弹出窗口
    openDialogWinNoClose("发货信息", mPopWinHtml, function () {

        //发货和更改 - 发货信息操作
        proLuckyDrawSendGoods();

    }, function () {


    }, 600);

    $("#OrderIDASG").html(mLuckyDrawResultID);

    if (pIsGetPrize == "true") {

        //查询发货信息
        querySendGoods(pLuckyDrawResultID);
    }
    else {

        //预加载发货信息
        preSendGoods();

    }
    //预加载买家收货地址
    preBuyerReceiAddr();

    $("#OrderIDSG").html(pLuckyDrawResultID);
    $("#OrderIDSG").attr("href", "../LuckyDrawPage/LuckyDrawMsgDetail?LID=" + pLuckyDrawID);
    $("#LinkMobileWin").html(pLinkMobile);
    $("#AwardsItemWin").html(pAwardsItem);
}

/**
 * 预加载发货信息
 */
function preSendGoods() {

    //构造POST参数
    var dataPOST = {
        "Type": "2",
    };
    console.log(dataPOST);

    ////加载提示窗口
    //loadingWinToDiv("dragWinDiv");

    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: "../LuckyDraw/LuckyDrawSendGoods?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("预加载发货信息=" + reTxt);

            ////移除加载提示
            //closeLoadingWin();

            if (reTxt != "") {
                var _jsonObj = JSON.parse(reTxt);
                //为表单赋值
                $("#ExpressNameWin").val(_jsonObj.ExpressName);
                $("#SendTelNumberWin").val(_jsonObj.SendTelNumber);
            }
        },
        error: function (xhr, errorTxt, status) {
            console.log("异步请求错误，errorTxt=" + errorTxt + " | status=" + status);
            return;
        }
    });
}


/**
 * 查询发货信息
 */
function querySendGoods(pLuckyDrawResultID) {

    //构造POST参数
    var dataPOST = {
        "Type": "3", "LuckyDrawResultID": pLuckyDrawResultID,
    };
    console.log(dataPOST);

    ////加载提示窗口
    //loadingWinToDiv("dragWinDiv");

    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: "../LuckyDraw/LuckyDrawSendGoods?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("查询订单发货信息=" + reTxt);

            ////移除加载提示
            //closeLoadingWin();

            if (reTxt != "") {
                var _jsonObj = JSON.parse(reTxt);

                mSendGoodsID = _jsonObj.SendGoodsID


                //为表单赋值
                $("#SendTypeWin").val(_jsonObj.SendType);

                $("#ExpressNameWin").val(_jsonObj.ExpressName);
                $("#ExpressNumberWin").val(_jsonObj.ExpressNumber);
                $("#SendTelNumberWin").val(_jsonObj.SendTelNumber);
                $("#SendGoodsMemoWin").val(_jsonObj.SendGoodsMemo);

               

            }
        },
        error: function (xhr, errorTxt, status) {
            console.log("异步请求错误，errorTxt=" + errorTxt + " | status=" + status);
            return;
        }
    });
}


/**
 * 发货和更改 - 发货信息操作
 * */
function proLuckyDrawSendGoods() {

    //获取表单值
    var ExpressName = $("#ExpressNameWin").val().trim();
    var ExpressNumber = $("#ExpressNumberWin").val().trim();
    var SendTelNumber = $("#SendTelNumberWin").val().trim();
    var SendGoodsMemo = $("#SendGoodsMemoWin").val().trim();


    if (ExpressName == "" || ExpressNumber == "" || SendTelNumber == "") {
        toastWinToDiv("【快递名称】【快递单号】【发货电话】都不能为空！", "dragWinDiv");
        return;
    }


    //构造POST参数
    var dataPOST = {
        "Type": "4", "LuckyDrawResultID": mLuckyDrawResultID,"IsGetPrize": mIsGetPrize, "ExpressName": ExpressName, "ExpressNumber": ExpressNumber, "SendTelNumber": SendTelNumber, "SendGoodsMemo": SendGoodsMemo
    };
    console.log(dataPOST);

    //加载提示窗口
    loadingWinToDiv("dragWinDiv");

    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: "../LuckyDraw/LuckyDrawSendGoods?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("提交发货信息=" + reTxt);

            //移除加载提示
            closeLoadingWin();

            if (reTxt != "") {
                var _jsonObj = JSON.parse(reTxt);
                if (_jsonObj.ErrMsg != "" && _jsonObj.ErrMsg != null && _jsonObj.ErrMsg != undefined) {
                    toastWinToDiv(_jsonObj.ErrMsg, "dragWinDiv");
                    return;
                }
                if (_jsonObj.Msg != "" && _jsonObj.Msg != null && _jsonObj.Msg != undefined) {
                    toastWinToDivCb(_jsonObj.Msg, function () {

                        //关闭窗口
                        closeDialogWin();
                        //重新加载数据
                        NumberPage(intPageCurrent);

                    }, "dragWinDiv");

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
 * 预加载买家收货地址
 */
function preBuyerReceiAddr() {

    //构造POST参数
    var dataPOST = {
        "Type": "1", "BuyerUserID": mBuyerUserID,
    };
    console.log(dataPOST);

    ////加载提示窗口
    //loadingWinToDiv("dragWinDiv");

    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: "../Buyer/BuyerReceiAddr?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("预加载买家收货地址=" + reTxt);

            ////移除加载提示
            //closeLoadingWin();

            if (reTxt != "") {
                var _jsonObj = JSON.parse(reTxt);
                //为表单赋值
                var _referToReceiVal = "收货人：" + _jsonObj.ReceiName + "，联系电话：" + _jsonObj.Mobile + "，地址：" + _jsonObj.RegionNameArr + "_" + _jsonObj.DetailAddr;
                $("#ReferToReceiVal").html(_referToReceiVal);

            }
        },
        error: function (xhr, errorTxt, status) {
            console.log("异步请求错误，errorTxt=" + errorTxt + " | status=" + status);
            return;
        }
    });
}

