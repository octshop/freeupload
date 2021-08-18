//=================商品评价====================//

/**-----定义公共变量------**/

//AjaxURL
var mAjaxUrl = "../Goods/GooAppraise";

var OctWapWeb_AddrDomain = ""; //公众号手机端域名

var mReTxtJson = null; //分页返回的Json对象

var mPhotoSwipeDataList = null; //PhotoSwipe的数据列表

/******数据分页的变量********/
var strPOSTSe = ""; //搜索条件对象 POST参数
var intPageCurrent = 1; //当前页
var pageSize = 15; //当页的记录条数，与后台保持一致
var recordSum = 0; //总记录数
var tableColNum = 7; //当前表列数

/**------初始化------**/
$(function () {

    OctWapWeb_AddrDomain = $("#hidOctWapWeb_AddrDomain").val().trim();

    if ($("#hidAppScore").val().trim() != "") {
        var _selOrderStatusOption = $("#AppScore_se").find("option");
        for (var i = 0; i < _selOrderStatusOption.length; i++) {
            if ($("#hidAppScore").val().trim() == $(_selOrderStatusOption[i]).val().trim()) {

                $(_selOrderStatusOption[i]).attr("selected", true);
                $("#AppScore_se").trigger('changed.selected.amui');

            }
        }
    }

    if ($("#hidCountAppraiseImg").val().trim() != "") {
        var _selOrderStatusOption = $("#CountAppraiseImg_se").find("option");
        for (var i = 0; i < _selOrderStatusOption.length; i++) {
            if ($("#hidCountAppraiseImg").val().trim() == $(_selOrderStatusOption[i]).val().trim()) {

                $(_selOrderStatusOption[i]).attr("selected", true);
                $("#CountAppraiseImg_se").trigger('changed.selected.amui');

            }
        }
    }


    //统计店铺所有商品评价信息
    countShopAllGoodsAppraise();

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

    var AppScore = $("#AppScore_se").val().trim();
    var OrderID = $("#OrderID_se").val().trim();
    var GoodsID = $("#GoodsID_se").val().trim();
    var AppContent = $("#AppContent_se").val().trim();
    var IsAnonymity = $("#IsAnonymity_se").val().trim();
    var CountAppraiseImg = $("#CountAppraiseImg_se").val().trim();
    var WriteDate = $("#WriteDate_se").val().trim();


    //构造POST参数
    var strPOST = {
        "pageCurrent": "1", "Type": "1",
    };

    //翻页所用
    var strPOSTSePush = {
        "AppScore": AppScore, "OrderID": OrderID, "GoodsID": GoodsID, "AppContent": AppContent,
        "IsAnonymity": IsAnonymity, "CountAppraiseImg": CountAppraiseImg, "WriteDate": WriteDate,

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


    mReTxtJson = pJsonObject;


    //将字符串转换成功JSON对象
    //var json = JSON.parse(pJsonTxt);
    var json = pJsonObject;

    //-----内容显示前台显示代码----//
    var myJsVal = "";    //循环构造    for (var i = 0; i < json.DataPage.length; i++) {

        var indexDataPage = json.DataPage[i];
        var indexDataPageExtra = json.DataPageExtra[i];


        var _appScroe = "";
        if (parseInt(indexDataPage.AppScore) >= 4) {
            _appScroe = "<td>" + indexDataPage.AppScore + "-好评</td>";
        }
        else if (parseInt(indexDataPage.AppScore) == 3) {
            _appScroe = "<td>" + indexDataPage.AppScore + "-中评</td>";
        }
        else if (parseInt(indexDataPage.AppScore) <= 2) {
            _appScroe = "<td>" + indexDataPage.AppScore + "-差评</td>";
        }

        myJsVal += "<tr>";        myJsVal += " <td><a href=\"" + OctWapWeb_AddrDomain + "/Goods/GoodsDetailPreMobileIframe?GID=" + indexDataPage.GoodsID + "\" target=\"_blank\">" + indexDataPage.GoodsID + "<br />" + indexDataPageExtra.GoodsTitle + "</a></td>";        myJsVal += " <td><a href=\"../TradingPage/OrderDetail?OID=" + indexDataPage.OrderID + "\" target=\"_blank\">" + indexDataPage.OrderID + "</a></td>";        myJsVal += _appScroe;        myJsVal += " <td>" + indexDataPage.AppContent + "</td>";        if (parseInt(indexDataPage.CountAppraiseImg) > 0) {            myJsVal += " <td class=\"appraise-img-msg\"><span onclick=\"initPhotoSwipeData(" + i + ") \">有<b>" + indexDataPage.CountAppraiseImg + "</b>张晒单照片</span></td>";
        }        else {            myJsVal += " <td class=\"appraise-img-msg\"></td>";
        }        if (indexDataPage.IsAnonymity == "true") {            myJsVal += " <td class=\"user-header-appraise\"></td>";
        }        else {            myJsVal += " <td class=\"user-header-appraise\"><img src=\"" + indexDataPage.HeaderImg + "\" />" + indexDataPage.UserNick + "</td>";
        }        myJsVal += " <td>" + indexDataPage.WriteDate + "</td>";        myJsVal += "</tr>";    }    //alert(myJsVal);    //-----分页控制条显示代码-------//    var pageBarXhtml = "";    pageBarXhtml += " <li><a href=\"javascript:void(0)\" onclick=\"PrePage()\">«</a></li>";    pageBarXhtml += " <li><a href=\"javascript:void(0)\" onclick=\"NumberPage('1')\">1</a></li>";    pageBarXhtml += "  <li><span>...</span></li>";    if ((intPageCurrent - 2) > 0) {
        pageBarXhtml += "  <li><a href=\"javascript:void(0)\" onclick=\"NumberPage('" + (intPageCurrent - 2) + "')\">" + (intPageCurrent - 2) + "</a></li>";
    }    if ((intPageCurrent - 1) > 0) {
        pageBarXhtml += "  <li><a href=\"javascript:void(0)\" onclick=\"NumberPage('" + (intPageCurrent - 1) + "')\">" + (intPageCurrent - 1) + "</a></li>";
    }    pageBarXhtml += "  <li class=\"am-active\"><a href=\"javascript:void(0)\" onclick=\"NumberPage('" + json.PageCurrent + "')\">" + json.PageCurrent + "</a></li>";    //console.log(parseInt(json.PageSum));    if ((intPageCurrent + 1) <= parseInt(json.PageSum)) {
        pageBarXhtml += "  <li><a href=\"javascript:void(0)\" onclick=\"NumberPage('" + (intPageCurrent + 1) + "')\">" + (intPageCurrent + 1) + "</a></li>";
    }    if ((intPageCurrent + 2) <= parseInt(json.PageSum)) {
        pageBarXhtml += "  <li><a href=\"javascript:void(0)\" onclick=\"NumberPage('" + (intPageCurrent + 2) + "')\">" + (intPageCurrent + 2) + "</a></li>";
    }    pageBarXhtml += "  <li><span>...</span></li>";    pageBarXhtml += "  <li><a href=\"javascript:void(0)\" onclick=\"NumberPage('" + json.PageSum + "')\">" + json.PageSum + "</a></li>";    pageBarXhtml += "  <li><input type=\"number\" id=\"PageNumTxt\" class=\"page-go-text am-form-field\" placeholder=\"跳转页\" /></li>";    pageBarXhtml += "  <li><a href=\"javascript:void(0)\" onclick=\"NextPage()\">»</a></li>";    var _pageMsgArr = new Array()    //内容显示代码     _pageMsgArr[0] = myJsVal;    //控制条件显示代码    _pageMsgArr[1] = pageBarXhtml;    //返回数组    return _pageMsgArr;
}


//-----------搜索结果分页------------//
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

//----------以GET方式发送分页请求的函数------------//
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


//-------------跳转页----------//
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


//========================其他函数=========================//

/**
 * 统计店铺所有商品评价信息
 * */
function countShopAllGoodsAppraise() {

    //构造POST参数
    var dataPOST = {
        "Type": "2",
    };

    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: mAjaxUrl + "?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("统计店铺所有商品评价信息=" + reTxt);
            if (reTxt != "") {
                var _jsonReTxt = JSON.parse(reTxt);

                //赋值
                $("#CountAppraiseB").html(_jsonReTxt.CountAppraise);
                $("#CountGoodsAppraiseB").html(_jsonReTxt.CountGoodsAppraise);
                $("#CountMidAppraiseB").html(_jsonReTxt.CountMidAppraise);
                $("#CountBadAppraiseB").html(_jsonReTxt.CountBadAppraise);
                $("#SumAppraiseImgsB").html(_jsonReTxt.SumAppraiseImgs);
                $("#GoodAppraisePercentB").html(formatNumberDotDigit(_jsonReTxt.GoodAppraisePercent * 100, 2) + "%");
                $("#MidAppraisePercentB").html(formatNumberDotDigit(_jsonReTxt.MidAppraisePercent * 100, 2) + "%");
                $("#BadAppraisePercentB").html(formatNumberDotDigit(_jsonReTxt.BadAppraisePercent * 100, 2) + "%");

            }
        }
    });
}


//===================浏览晒单图片=========================//


/**
 * 初始化PhotoSwipe的数据
 * @param pItemIndex 表格列索引
 * */
function initPhotoSwipeData(pItemIndex) {

    var ListGooAppraiseImg = mReTxtJson.ListGooAppraiseImg[pItemIndex].ListGooAppraiseImgs;

    mPhotoSwipeDataList = null;
    mPhotoSwipeDataList = [];

    //--------初始化PhotoSwipe值------------//

    //浏览图片PhotoSwipe的数据列表    _itemImgMsgArr = null;    //当前加载的图片索引
    mLoadIndex = 0;
    mIsAllImageSize = false; //是否全部都自动设置了图片尺寸
    gallery = null;
    mIsIniting = false; //是否初始化中


    for (var i = 0; i < ListGooAppraiseImg.length; i++) {


        mPhotoSwipeDataList[i] = {
            src: "//" + ListGooAppraiseImg[i].ImgUrl,
            title: '<div style=\"font-size: 20px;\"></span>',
            w: 0,
            h: 0
        };

    }
    console.log(mPhotoSwipeDataList);

    //打开晒单图片浏览,浏览第一张
    openPhotoSwipe(0)
}

/**
 * 打开晒单图片浏览
 * @param {any} pImgIndex
 */
function openPhotoSwipe(pImgIndex) {

    //console.log("pImgIndex=" + pImgIndex);

    if (mPhotoSwipeDataList == null) {
        return
    }

    //初始化 PhotoSwipe 相册浏览   -- $(function(){  在这里调用，必须是加载完成所有文件 });
    initPhotoSwipeAlbum(mPhotoSwipeDataList, pImgIndex);
}


