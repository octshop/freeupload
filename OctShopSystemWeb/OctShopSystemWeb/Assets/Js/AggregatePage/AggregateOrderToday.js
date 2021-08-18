/*=================今日扫码支付========================*/

/**-----定义公共变量------**/
//AjaxURL
var mAjaxUrl = "../Aggregate/AggregateOrderMsg";

//当前最近加载的扫码支付订单 交易号 
var mCurRecentBillNumber = "";
//定义器
var mTimer = null;

/**------初始化------**/

$(function () {


    //初始化定时器
    initTimer();

    //初始化加载
    //searchContent();

});



//========================数据分页搜索==============================//

/******数据分页的变量********/
var strPOSTSe = ""; //搜索条件对象 POST参数
var intPageCurrent = 1; //当前页
var pageSize = 15; //当页的记录条数，与后台保持一致
var recordSum = 0; //总记录数
var tableColNum = 8; //当前表列数

/*
---------定义搜索函数---------
*/
var searchContent = function () {

    intPageCurrent = 1; //开始页



    //构造POST参数
    var strPOST = {
        "pageCurrent": "1", "Type": "1",
    };

    //翻页所用
    var strPOSTSePush = {
        "PayTime": getTodayDate(),
    };
    //将对象添加到分类对象中

    //搜索内容用
    var strPOSTSeContent = pushTwoObject(strPOST, strPOSTSePush);
    console.log(strPOSTSeContent);

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
    //循环构造
    for (var i = 0; i < json.DataPage.length; i++) {

        var indexDataPage = json.DataPage[i];
        var indexDataPageExtra = json.DataPageExtra[i];

        //匿名用户头像
        if (indexDataPageExtra.HeaderImg == "" || indexDataPageExtra.HeaderImg == null || indexDataPageExtra.HeaderImg == undefined) {
            indexDataPageExtra.HeaderImg = "../Assets/Imgs/Icon/user_default.png";
        }

        myJsVal += "<tr>";
        myJsVal += " <td><a href=\"../AggregatePage/AggreOrderDetail?AOID=" + indexDataPage.AggregateOrderID + "\" target=\"_blank\">" + indexDataPage.AggregateOrderID + "</a></td>";
        myJsVal += " <td>" + indexDataPage.BillNumber + "</td>";
        myJsVal += " <td>" + indexDataPage.OrderPrice + "</td>";
        myJsVal += " <td>" + indexDataPage.OrderStatus + "</td>";
        myJsVal += " <td>" + indexDataPageExtra.PayWayName + "(" + indexDataPage.PayWay + ")</td>";
        myJsVal += " <td>";
        myJsVal += "     <div class=\"div-header-img\">";
        myJsVal += "         <img src=\"" + indexDataPageExtra.HeaderImg + "\" />";
        myJsVal += "         <div>";
        myJsVal += "             " + indexDataPageExtra.BuyerNickName + "<br />(" + indexDataPageExtra.BindMobile + ")";
        myJsVal += "         </div>";
        myJsVal += "     </div>";
        myJsVal += " </td>";
        myJsVal += " <td>" + indexDataPage.PayTime + "</td>";
        myJsVal += " <td>";
        myJsVal += "<button class=\"table-btn am-btn am-btn-default am-btn-xs am-text-secondary am-round\" onclick=\"window.open('../AggregatePage/AggreOrderDetail?AOID=" + indexDataPage.AggregateOrderID + "')\">详细</button>";
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

    //console.log(parseInt(json.PageSum));

    if ((intPageCurrent + 1) <= parseInt(json.PageSum)) {
        pageBarXhtml += "  <li><a href=\"javascript:void(0)\" onclick=\"NumberPage('" + (intPageCurrent + 1) + "')\">" + (intPageCurrent + 1) + "</a></li>";
    }
    if ((intPageCurrent + 2) <= parseInt(json.PageSum)) {
        pageBarXhtml += "  <li><a href=\"javascript:void(0)\" onclick=\"NumberPage('" + (intPageCurrent + 2) + "')\">" + (intPageCurrent + 2) + "</a></li>";
    }

    pageBarXhtml += "  <li><span>...</span></li>";
    pageBarXhtml += "  <li><a href=\"javascript:void(0)\" onclick=\"NumberPage('" + json.PageSum + "')\">" + json.PageSum + "</a></li>";
    pageBarXhtml += "  <li><input type=\"number\" id=\"PageNumTxt\" class=\"page-go-text am-form-field\" placeholder=\"跳转页\" /></li>";
    pageBarXhtml += "  <li><a href=\"javascript:void(0)\" onclick=\"NextPage()\">»</a></li>";

    var _pageMsgArr = new Array()
    //内容显示代码 
    _pageMsgArr[0] = myJsVal;
    //控制条件显示代码
    _pageMsgArr[1] = pageBarXhtml;
    //返回数组
    return _pageMsgArr;
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


//========================数据分页搜索==============================//


//========================自定义函数==============================//

/**
 * 初始化定时器
 * */
function initTimer() {

    clearTimeout(mTimer);
    mTimer = undefined
    mTimer = null;
    mTimer = setTimeout(function () {

        //加载当前最近的扫码支付订单信息
        loadRecentAggregateOrder();

    }, 4000);


}

/**
 * 加载当前最近的扫码支付订单信息
 * */
function loadRecentAggregateOrder() {

    //构造POST参数
    var dataPOST = {
        "Type": "3",
    };
    //console.log(dataPOST);

    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: mAjaxUrl + "?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            //console.log("加载当前最近的扫码支付订单信息=" + reTxt);
            if (reTxt != "") {

                //初始化定时器
                initTimer();

                var _jsonReTxt = JSON.parse(reTxt);
                var AggregateOrder = _jsonReTxt.AggregateOrderList[0];
                var UserMsg = _jsonReTxt.UserMsg;

                if (AggregateOrder.BillNumber != "" && AggregateOrder.BillNumber != null && AggregateOrder.BillNumber != undefined) {

                    //新的支付订单生成
                    if (mCurRecentBillNumber != AggregateOrder.BillNumber) {

                        //当前交易号
                        mCurRecentBillNumber = AggregateOrder.BillNumber;

                        //----显示代码赋值----//
                        $("#OrderPrice").html("&#165; " + AggregateOrder.OrderPrice)
                        $("#HeaderImg").attr("src", UserMsg.HeaderImg);
                        $("#UserNickBindMobile").html("" + UserMsg.UserNick + "<br />(" + UserMsg.BindMobile + ")");
                        $("#PayWayName").html("" + AggregateOrder.OrderStatus + " (" + _jsonReTxt.PayWayName + ")");
                        $("#PayTime").html(AggregateOrder.PayTime);

                        //执行动画
                        $("#RealNewOrderMsg").addClass("am-animation-shake").one($.AMUI.support.animation.end, function () {
                            $("#RealNewOrderMsg").removeClass("am-animation-shake");
                        });
                        try {
                            //播放音效
                            var audio = new Audio("../Assets/Sound/money.mp3");
                            audio.play();
                            audio = null;
                            audio = undefined;
                        }
                        catch (e) { };


                        //--重新加载数据--//
                        //NumberPage("1");
                        searchContent();

                    }


                }

            }
        },
        error: function (xhr, errorTxt, status) {
            console.log("异步请求错误，errorTxt=" + errorTxt + " | status=" + status);
            return;
        }
    });

}