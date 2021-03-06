//===================商城订单抽成与分红分润信息===========================//

/**-----定义公共变量------**/

//AjaxURL
var mAjaxUrl = "../Trading/OrderCommission";



/**------初始化------**/
$(function () {

    //初始化加载
    searchContent();

    //搜索按钮单击事件
    $("#btnSearch").click(function () {
        searchContent();
    });

});


//======================数据搜索分页=========================//


/******数据分页的变量********/
var strPOSTSe = ""; //搜索条件对象 POST参数
var intPageCurrent = 1; //当前页
var pageSize = 15; //当页的记录条数，与后台保持一致
var recordSum = 0; //总记录数
var tableColNum = 12; //当前表列数


/*
---------定义搜索函数---------
*/
var searchContent = function () {

    intPageCurrent = 1; //开始页

    var OrderCommissionID_se = $("#OrderCommissionID_se").val().trim();
    var OrderID_se = $("#OrderID_se").val().trim();
    var OrderPrice_se = $("#OrderPrice_se").val().trim();
    var CommissionPersent_se = $("#CommissionPersent_se").val().trim();
    var CommissionMoney_se = $("#CommissionMoney_se").val().trim();
    var IsDividend_se = $("#IsDividend_se").val().trim();
    var DividendPersent_se = $("#DividendPersent_se").val().trim();
    var DividendSumMoney_se = $("#DividendSumMoney_se").val().trim();
    var IsPromemDividend_se = $("#IsPromemDividend_se").val().trim();
    var PromemDividendPersent_se = $("#PromemDividendPersent_se").val().trim();
    var PromemDividendMoney_se = $("#PromemDividendMoney_se").val().trim();
    var WriteDate_se = $("#WriteDate_se").val().trim();

    var IsShareGoodsMoney_se = $("#IsShareGoodsMoney_se").val().trim();
    var ShareGoodsPersent_se = $("#ShareGoodsPersent_se").val().trim();
    var ShareGoodsMoney_se = $("#ShareGoodsMoney_se").val().trim();

    var IsExpandShopMoney_se = $("#IsExpandShopMoney_se").val().trim();
    var ExpandShopPersent_se = $("#ExpandShopPersent_se").val().trim();
    var ExpandShopMoney_se = $("#ExpandShopMoney_se").val().trim();


    //构造POST参数
    var strPOST = {
        "pageCurrent": "1", "Type": "1"
    };

    //翻页所用
    var strPOSTSePush = {
        "OrderCommissionID": OrderCommissionID_se, "OrderCommissionID": OrderCommissionID_se, "OrderID": OrderID_se, "OrderPrice": OrderPrice_se, "CommissionPersent": CommissionPersent_se, "CommissionMoney": CommissionMoney_se, "IsDividend": IsDividend_se, "DividendPersent": DividendPersent_se, "DividendSumMoney": DividendSumMoney_se, "IsPromemDividend": IsPromemDividend_se, "PromemDividendPersent": PromemDividendPersent_se, "PromemDividendMoney": PromemDividendMoney_se, "WriteDate": WriteDate_se, "IsShareGoodsMoney": IsShareGoodsMoney_se, "ShareGoodsPersent": ShareGoodsPersent_se, "ShareGoodsMoney": ShareGoodsMoney_se, "IsExpandShopMoney": IsExpandShopMoney_se, "ExpandShopPersent": ExpandShopPersent_se, "ExpandShopMoney": ExpandShopMoney_se,
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

        myJsVal += "<tr>";
        myJsVal += " <td>" + indexDataPage.OrderCommissionID + "</td>";
        myJsVal += " <td><a href=\"../TradingPage/OrderDetail?OID=" + indexDataPage.OrderID + "\" target=\"_blank\">" + indexDataPage.OrderID + "</a></td>";
        myJsVal += " <td>&#165;" + indexDataPage.OrderPrice + "(-" + indexDataPage.CommissionPersent + "%)<i style=\"color:gray;display:block;\">&#165;" + indexDataPage.CommissionMoney + "</i></td>";

        myJsVal += " <td>" + indexDataPageExtra.IsShareGoodsMoneyName + "</td>";
        myJsVal += " <td>" + indexDataPage.ShareGoodsPersent + "%<i style=\"color:gray;display:block;\">&#165;" + indexDataPage.ShareGoodsMoney + "</i></td>";

        myJsVal += " <td>" + indexDataPageExtra.IsExpandShopMoneyName + "</td>";
        myJsVal += " <td>" + indexDataPage.ExpandShopPersent + "%<i style=\"color:gray;display:block;\">&#165;" + indexDataPage.ExpandShopMoney + "</i></td>";


        myJsVal += " <td>" + indexDataPageExtra.IsDividendName + "</td>";
        myJsVal += " <td>" + indexDataPage.DividendPersent + "%<i style=\"color:gray;display:block;\">&#165;" + indexDataPage.DividendSumMoney + "</i></td>";
        myJsVal += " <td>" + indexDataPageExtra.IsPromemDividendName + "</td>";
        myJsVal += " <td>" + indexDataPage.PromemDividendPersent + "%<i style=\"color:gray;display:block;\">&#165;" + indexDataPage.PromemDividendMoney + "</i></td>";





        myJsVal += " <td>";
        myJsVal += "" + indexDataPage.WriteDate + "";
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