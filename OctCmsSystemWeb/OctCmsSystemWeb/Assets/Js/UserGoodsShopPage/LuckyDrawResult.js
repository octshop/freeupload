//================中奖结果信息===========================//


/**-----定义公共变量------**/

//AjaxURL
var mAjaxUrl = "../UserGoodsShop/LuckyDrawResult";

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
var tableColNum = 9; //当前表列数

/**------初始化------**/
$(function () {

    $("#LuckydrawID_se").val($("#hidLuckydrawID").val().trim());


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

    var ShopUserID_se = $("#ShopUserID_se").val().trim();
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
        "LuckyDrawResultID": LuckyDrawResultID_se, "ShopUserID": ShopUserID_se, "LuckydrawID": LuckydrawID_se, "UserNick": UserNick_se, "LinkMobile": LinkMobile_se, "WriteDate": WriteDate_se, "IsGetPrize": IsGetPrize_se, "AwardsItem": AwardsItem_se
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

        myJsVal += "<tr>";        myJsVal += " <td>" + indexDataPage1.LuckyDrawResultID + "</td>";        myJsVal += " <td><a href=\"../UserGoodsShopPage/ShopMsgDetail?UserID=" + indexDataPage1.ShopUserID + "\" target=\"_blank\">" + indexDataPage1.ShopUserID + "</a></td>";        myJsVal += " <td><a href=\"../UserGoodsShopPage/LuckyDrawMsgDetail?LID=" + indexDataPage1.LuckydrawID + "\" target=\"_blank\">" + indexDataPage1.LuckydrawID + "</a></td>";        myJsVal += " <td>" + indexDataPage1.AwardsItem + "</td>";        myJsVal += " <td>";        myJsVal += "     <img src=\"" + indexDataPage2.HeaderImg + "\" />";        myJsVal += "     " + indexDataPage2.UserNick + "";        myJsVal += " </td>";        myJsVal += " <td>" + indexDataPage2.LinkMobile + "</td>";        myJsVal += " <td>" + _IsGetPrizeName + "</td>";        myJsVal += "<td>" + indexDataPage1.GetPrizeDate + "</td>";        myJsVal += " <td>" + indexDataPage1.WriteDate + " <font color=\"red\">" + _WriteDateDay + "</font></td>";        myJsVal += "</tr>";    }    //alert(myJsVal);    //-----分页控制条显示代码-------//    var pageBarXhtml = "";    pageBarXhtml += " <li><a href=\"javascript:void(0)\" onclick=\"PrePage()\">«</a></li>";    pageBarXhtml += " <li><a href=\"javascript:void(0)\" onclick=\"NumberPage('1')\">1</a></li>";    pageBarXhtml += "  <li><span>...</span></li>";    if ((intPageCurrent - 2) > 0) {
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





