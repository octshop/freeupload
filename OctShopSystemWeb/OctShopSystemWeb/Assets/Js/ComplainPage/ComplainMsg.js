//=================投诉信息====================//

/**-----定义公共变量------**/
//AjaxURL
var mAjaxUrl = "../Complain/ComplainMsg";

/******数据分页的变量********/
var strPOSTSe = ""; //搜索条件对象 POST参数
var intPageCurrent = 1; //当前页
var pageSize = 15; //当页的记录条数，与后台保持一致
var recordSum = 0; //总记录数
var tableColNum = 8; //当前表列数


/**------初始化------**/

$(function () {

    if ($("#hidComplainStatus").val().trim() != "") {
        var _selOrderStatusOption = $("#ComplainStatus_se").find("option");
        for (var i = 0; i < _selOrderStatusOption.length; i++) {
            if ($("#hidComplainStatus").val().trim() == $(_selOrderStatusOption[i]).val().trim()) {

                $(_selOrderStatusOption[i]).attr("selected", true);
                $("#ComplainStatus_se").trigger('changed.selected.amui');

            }
        }
    }


    //初始化加载
    searchContent();

    //搜索按钮单击事件
    $("#btnSearch").click(function () {
        searchContent();
    });

    //初始化处理回复窗口显示代码
    initPopWinHtmlReply();

});



//========================数据分页搜索==============================//

/*
---------定义搜索函数---------
*/
var searchContent = function () {

    intPageCurrent = 1; //开始页

    var ComplainID_se = $("#ComplainID_se").val().trim();
    var ComplainCategory_se = $("#ComplainCategory_se").val().trim();
    var ComplainType_se = $("#ComplainType_se").val().trim();
    var ComplainStatus_se = $("#ComplainStatus_se").val().trim();
    var ComplainContent_se = $("#ComplainContent_se").val().trim();
    var ExtraData_se = $("#ExtraData_se").val().trim();
    var ShopReplyDate_se = $("#ShopReplyDate_se").val().trim();
    var WriteDate_se = $("#WriteDate_se").val().trim();


    //构造POST参数
    var strPOST = {
        "pageCurrent": "1", "Type": "1",
    };

    //翻页所用
    var strPOSTSePush = {
        "ComplainID": ComplainID_se, "ComplainCategory": ComplainCategory_se, "ComplainType": ComplainType_se,
        "ComplainStatus": ComplainStatus_se, "ComplainContent": ComplainContent_se, "ExtraData": ExtraData_se, "ShopReplyDate": ShopReplyDate_se, "WriteDate": WriteDate_se,
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

        //相关ID的连接XHtml
        var _xhtmlALink = "";

        //投诉分类( order 订单投诉，aftersale售后投诉，shop商家投诉，paltform平台投诉)
        var _ComplainCategory = "";
        if (indexDataPage.ComplainCategory == "order") {
            _ComplainCategory = "订单";

            _xhtmlALink = "<a href=\"../TradingPage/OrderDetail?OID=" + indexDataPage.ExtraData +"\" target=\"_blank\">" + _ComplainCategory + "ID:" + indexDataPage.ExtraData + "</a>";
        }
        if (indexDataPage.ComplainCategory == "PresentOrder") {
            _ComplainCategory = "礼品订单";

            _xhtmlALink = "<a href=\"../PresentPage/PresentOrderDetail?POID=" + indexDataPage.ExtraData + "\" target=\"_blank\">" + _ComplainCategory + "ID:" + indexDataPage.ExtraData + "</a>";
        }
        else if (indexDataPage.ComplainCategory == "aftersale") {
            _ComplainCategory = "售后";

            _xhtmlALink = "<a href=\"../AfterSalePage/AfterSaleDetail?AID=" + indexDataPage.ExtraData + "\" target=\"_blank\">" + _ComplainCategory + "ID:" + indexDataPage.ExtraData + "</a>";
        }
        else if (indexDataPage.ComplainCategory == "shop") {
            _ComplainCategory = "店铺";

            _xhtmlALink = "" + _ComplainCategory + "ID:" + indexDataPage.ExtraData + "";
        }
        else if (indexDataPage.ComplainCategory == "paltform") {
            _ComplainCategory = "平台";
        }

        if (indexDataPage.ComplainContent.length > 25) {
            indexDataPage.ComplainContent = indexDataPage.ComplainContent.substring(0, 24) + "...";
        }

        myJsVal += "<tr>";        myJsVal += " <td><a href=\"../ComplainPage/ComplainDetail?CID=" + indexDataPage.ComplainID +"\" target=\"_blank\">" + indexDataPage.ComplainID +"</a></td>";        myJsVal += " <td>" + _ComplainCategory +"</td>";        myJsVal += " <td>" + indexDataPage.ComplainType +"</td>";        myJsVal += " <td>" + indexDataPage.ComplainStatus +"</td>";        myJsVal += " <td>" + indexDataPage.ComplainContent + "</td>";        myJsVal += " <td>" + _xhtmlALink + "</td>";        myJsVal += " <td>" + indexDataPage.WriteDate + "</td>";        if (indexDataPage.ComplainStatus == "商家处理") {            myJsVal += " <td> <button class=\"table-btn am-btn am-btn-default am-btn-xs am-text-secondary am-round\" onclick=\"openReplyWin('" + indexDataPage.ComplainID + "', '" + _ComplainCategory + "', '" + indexDataPage.ComplainType + "','" + indexDataPage.ShopReply +"')\">处理回复</button></td>";
        }        else if (indexDataPage.ComplainStatus == "买家确认") {            myJsVal += " <td> <button class=\"table-btn am-btn am-btn-default am-btn-xs am-text-secondary am-round\" onclick=\"openReplyWin('" + indexDataPage.ComplainID + "', '" + _ComplainCategory + "', '" + indexDataPage.ComplainType + "','" + indexDataPage.ShopReply + "')\">修改回复</button></td>";
        }        else {            myJsVal += " <td> <button class=\"table-btn am-btn am-btn-default am-btn-xs am-text-secondary am-round\" onclick=\"window.open('../ComplainPage/ComplainDetail?CID=" + indexDataPage.ComplainID +"')\">详情</button></td>";
        }        myJsVal += "</tr>";    }    //alert(myJsVal);    //-----分页控制条显示代码-------//    var pageBarXhtml = "";    pageBarXhtml += " <li><a href=\"javascript:void(0)\" onclick=\"PrePage()\">«</a></li>";    pageBarXhtml += " <li><a href=\"javascript:void(0)\" onclick=\"NumberPage('1')\">1</a></li>";    pageBarXhtml += "  <li><span>...</span></li>";    if ((intPageCurrent - 2) > 0) {
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


//========================数据分页搜索==============================//


//==============自定义函数=============//



//--------------处理回复 窗口------------//

var mPopWinHtmlReply = "";
/**
 * 初始化处理回复窗口显示代码
 */
function initPopWinHtmlReply() {
    //获取窗口显示代码
    mPopWinHtmlReply = $("#ReplyContentWin").html();
    $("#ReplyContentWin").empty();
}

/**
 * 打开窗口
 */
function openReplyWin(pComplainID, pComplainCategory, pComplainType, pShopReply) {


    //打开Dialog弹出窗口
    openDialogWinNoClose("处理回复", mPopWinHtmlReply, function () {

        //提交商家处理回复
        submitShopReply(pComplainID);

    }, function () {


    }, 600);

    //赋值窗体
    $("#ComplainIDA_Win").attr("href", "../ComplainPage/ComplainDetail?CID=" + pComplainID + "");
    $("#ComplainIDA_Win").html(pComplainID);
    $("#ComplainCategoryB_Win").html(pComplainCategory);
    $("#ComplainTypeB_Win").html(pComplainType);
    if (pShopReply != "" && pShopReply != null) {
        $("#ShopReplyWin").val(pShopReply);
    }
}

/**
 * 提交商家处理回复
 * */
function submitShopReply(pComplainID) {

    //获取表单值
    var ShopReplyWin = $("#ShopReplyWin").val().trim();
    if (ShopReplyWin == "") {
        toastWinToDiv("【处理回复内容】不能为空！", "dragWinDiv");
        $("#ShopReplyWin").focus();
        return;
    }

    //构造POST参数
    var dataPOST = {
        "Type": "2", "ComplainID": pComplainID, "ShopReply": ShopReplyWin, 
    };
    console.log(dataPOST);
    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: mAjaxUrl + "?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("提交商家处理回复=" + reTxt);
            if (reTxt != "") {
                var _jsonReTxt = JSON.parse(reTxt);

                if (_jsonReTxt.ErrMsg != "" && _jsonReTxt.ErrMsg != undefined && _jsonReTxt.ErrMsg != null) {
                    toastWinToDiv(_jsonReTxt.ErrMsg, "dragWinDiv");
                    return;
                }

                if (_jsonReTxt.Msg != "" && _jsonReTxt.Msg != undefined && _jsonReTxt.Msg != null) {
                    toastWinToDiv(_jsonReTxt.Msg, "dragWinDiv");
                    //重新加载数据
                    NumberPage(intPageCurrent);
                    //关闭窗口
                    closeDialogWin();
                    return;
                }

            }
        }
    });

}
