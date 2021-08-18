﻿//==============买家退换售后=========================//

/**-----定义公共变量------**/
var mAjaxUrl = "../AfterSaleAjax/BuyerAsIndex";

//操作类型
var mType = 1; //申请信息分页
//售后状态
var mApplyStatus = "";

/**------初始化------**/
$(function () {

    //初始化分页滚动对象
    initPageMescroll();

});

/**
 * 切换Tab选项，加载不同数据
 * @param {any} pTabNum Tab选项数字 [0] 加载可以申请售后的订单 [1][2] 售后信息数据分页
 */
function chgTabLoad(pTabNum) {

    //移除所有选中Tab
    var _tabLabelArr = $(".oct-header-sub-a");
    for (var i = 0; i < _tabLabelArr.length; i++) {
        $(_tabLabelArr[i]).removeClass("oct-header-sub-curren-a");
    }
    $(_tabLabelArr[pTabNum]).addClass("oct-header-sub-curren-a");


    if (pTabNum != 0) {

        mType = 2;
    }
    else {
        mType = 1;
    }



    if (pTabNum == 1) {
        mApplyStatus = "处理中";
    }
    else {
        mApplyStatus = "";
    }

    $("#PageContentList").html("<li style=\"text-align:center;padding: 15px;\">…数据加载中…</li>");
    //重新加载指定页的数据
    reloadPageData(1);
}

//===============================数据分页===============================//

var mIsRefresh = true; //是否为刷新
var mescroll;
var mPageSize = 15; //每页的数据条数
var mCurPageDataJson = null; //当前分页的返回数据 Json对象
var mIntPageCurrent = 1; //当前的分页索引

/**
 * 加载网络数据
 * @param {any} pageNum
 * @param {any} pageSize
 * @param {any} successCallback
 * @param {any} errorCallback
 */
function getListDataFromNet(pageNum, pageSize, successCallback, errorCallback) {

    //获取搜索条件
    //var SearchTxtArr = "";

    //记录当前的分页索引
    mIntPageCurrent = pageNum;

    //构造GET参数
    var dataGET = {
        "Type": mType,
        "PageCurrent": pageNum,
        "SearchTxtArr": mApplyStatus,
    };
    //正式发送GET请求
    $.ajax({
        type: "GET",
        url: mAjaxUrl + "?rnd=" + Math.random(),
        data: dataGET,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("数据分页=" + reTxt);
            if (reTxt != "") {
                //转换为Json对象
                var jsonObj = JSON.parse(reTxt);
                //console.log(jsonObj);

                //联网成功的回调 并传值，传Json对象
                successCallback && successCallback(jsonObj);
                //特别注意返回的Json数据中必须要有 JsonObj.DataPage.length, JsonObj.PageSum
                return;
            }
            else {
                document.getElementById("PageContentList").innerHTML = "";
            }

            successCallback && successCallback(null);
        },
        error: function (xhr, errorTxt, status) {

            console.log("异步请求错误，errorTxt=" + errorTxt + " | status=" + status);

            //联网失败的回调
            errorCallback && errorCallback();

            return;
        }
    });
}

/**
 * 构造显示代码
 * @param {any} curPageDataJson 返回的Json分页对象
 */
function pageSuccess(curPageDataJson) {

    //记录当前分页数据Json对象
    mCurPageDataJson = curPageDataJson;

    var dataPageArr = curPageDataJson.DataPage;
    var dataPageExtraArr = curPageDataJson.DataPageExtra;

    //前台显示代码
    var myJsVal = "";
    for (var i = 0; i < dataPageArr.length; i++) {

        var dataPage = dataPageArr[i];
        var dataPageExtra = dataPageExtraArr[i];

        //判断加载数据的类型  [1] 加载可以申请售后的订单 [2] 售后信息数据分页
        if (mType != "2") {
            //格式化日期
            var dayDate = new Date(dataPage.FinishTime);
            var _formatFinishTime = dayDate.getFullYear() + "-" + (dayDate.getMonth() + 1) + "-" + dayDate.getDate();

            //构造订单商品列Item显示代码
            var _xhtmlItem = xhtmlGoodsItem(dataPage.GoodsIDArr, dataPage.GoodsTitleArr, dataPage.GoodsSpecIDOrderNumArr, dataPage.GoodsUnitPriceArr, dataPageExtra.SpecNameArr, dataPageExtra.GoodsCoverImgPathArr, dataPage.OrderID);

            myJsVal += "<li class=\"order-item\">";            myJsVal += " <div class=\"order-item-top\">";            myJsVal += "     <a href=\"../Shop/Index?SID=" + dataPageExtra.ShopID + "\"><img src=\"//" + dataPageExtra.ShopHeaderImg + "\" />" + dataPageExtra.ShopName + "</a>";            myJsVal += "     <div class=\"order-status-txt\">";            myJsVal += "" + _formatFinishTime + "";            myJsVal += "     </div>";            myJsVal += " </div>";            myJsVal += " <div class=\"order-item-mid\" onclick=\"window.location.href=\'../Order/OrderDetail?OID=" + dataPage.OrderID + "\'\">";            //订单商品列Item显示代码            myJsVal += _xhtmlItem;            myJsVal += " </div>";            myJsVal += "</li>";
        }
        else //售后信息数据分页
        {
            myJsVal += "<li class=\"order-item\">";            myJsVal += " <div class=\"order-item-top aftersale-item-top\">";            myJsVal += "     <a href=\"../AfterSale/AsDetail?AID=" + dataPage.ApplyID + "\"><img src=\"../Assets/Imgs/Icon/aftersale_list.png\" />售后ID:" + dataPage.ApplyID + "</a>";            myJsVal += "     <div class=\"aftersale-status-txt\">";            myJsVal += "" + dataPage.ApplyStatus + "";            myJsVal += "     </div>";            myJsVal += " </div>";            myJsVal += " <div class=\"order-item-mid\">";            myJsVal += "     <a href=\"../AfterSale/AsDetail?AID=" + dataPage.ApplyID + "\" class=\"order-goods-item\">";            myJsVal += "         <div class=\"goods-item-left\">";            myJsVal += "             <img src=\"//" + dataPageExtra.GoodsCoverImgPath + "\" />";            myJsVal += "         </div>";            myJsVal += "         <div class=\"goods-item-mid\">";            myJsVal += "             <span class=\"goods-item-title\">" + dataPageExtra.GoodsTitle + "</span>";            myJsVal += "             <span class=\"goods-item-spec\">" + dataPageExtra.SpecParamVal + "</span>";            myJsVal += "         </div>";            myJsVal += "         <div class=\"goods-item-right\">";            myJsVal += "             <span class=\"goods-item-price\">&#165;" + dataPageExtra.GoodsUnitPrice + "</span>";            myJsVal += "             <span class=\"goods-item-ordernum\">&times; " + dataPageExtra.OrderNum + "</span>";            myJsVal += "             <span class=\"goods-aftersale-num\">售后数量:" + dataPage.ApplyGoodsNum + "</span>";            myJsVal += "         </div>";            myJsVal += "     </a>";            myJsVal += " </div>";            myJsVal += "</li>";        }

    }

    //显示代码插入前台
    if (mIsRefresh == false) {
        document.getElementById("PageContentList").innerHTML += myJsVal;
    }
    else {
        document.getElementById("PageContentList").innerHTML = myJsVal;
    }
    mIsRefresh = false;
}

/**
 * 构造订单商品列Item显示代码
 * */
function xhtmlGoodsItem(pGoodsIDArr, pGoodsTitleArr, pGoodsSpecIDOrderNumArr, pGoodsUnitPriceArr, pSpecParamValArr, pGoodsCoverImgPathArr, pOrderID) {

    //定义数据
    var GoodsIDArr = new Array();
    var GoodsTitleArr = new Array();
    var GoodsSpecIDOrderNumArr = new Array();
    var GoodsUnitPriceArr = new Array();
    var SpecParamValArr = new Array(); //规格属性
    var GoodsCoverImgPathArr = new Array();

    if (pGoodsIDArr.indexOf("^") >= 0) {
        GoodsIDArr = pGoodsIDArr.split("^");
        GoodsTitleArr = pGoodsTitleArr.split("^");
        GoodsSpecIDOrderNumArr = pGoodsSpecIDOrderNumArr.split("^");
        GoodsUnitPriceArr = pGoodsUnitPriceArr.split("^");
        SpecParamValArr = pSpecParamValArr.split("^");
        GoodsCoverImgPathArr = pGoodsCoverImgPathArr.split("^");
    }
    else {
        GoodsIDArr[0] = pGoodsIDArr;
        GoodsTitleArr[0] = pGoodsTitleArr;
        GoodsSpecIDOrderNumArr[0] = pGoodsSpecIDOrderNumArr;
        GoodsUnitPriceArr[0] = pGoodsUnitPriceArr;
        SpecParamValArr[0] = pSpecParamValArr;
        GoodsCoverImgPathArr[0] = pGoodsCoverImgPathArr;
    }

    var myJsVal = "";
    //构造显示代码
    for (var i = 0; i < GoodsIDArr.length; i++) {

        if (GoodsTitleArr[i].length > 31) {
            GoodsTitleArr[i] = GoodsTitleArr[i].substring(0, 30) + "...";
        }

        var _goodsSpecIDOrderNumArr = GoodsSpecIDOrderNumArr[i].split("_");
        var _specID = _goodsSpecIDOrderNumArr[0];
        var _orderNum = _goodsSpecIDOrderNumArr[1];
        if (SpecParamValArr[i] == "") {
            _specID = 0;
        }



        myJsVal += "<a href=\"javascript:void(0)\" class=\"order-goods-item\">";        myJsVal += "         <div class=\"goods-item-left\">";        myJsVal += "             <img src=\"//" + GoodsCoverImgPathArr[i] + "\" />";        myJsVal += "         </div>";        myJsVal += "         <div class=\"goods-item-mid\">";        myJsVal += "             <span class=\"goods-item-title\">" + GoodsTitleArr[i] + "</span>";        myJsVal += "             <span class=\"goods-item-spec\">" + SpecParamValArr[i] + "</span>";        myJsVal += "         </div>";        myJsVal += "         <div class=\"goods-item-right\">";        myJsVal += "             <span class=\"goods-item-price\">&#165;" + GoodsUnitPriceArr[i] + "</span>";        myJsVal += "             <span class=\"goods-item-ordernum\">&times; " + _orderNum + "</span>";        myJsVal += "             <span class=\"goods-aftersale-span\" onclick=\"applyAfterSale(" + pOrderID + "," + GoodsIDArr[i] + "," + _specID + ")\">申请售后</span>";        myJsVal += "         </div>";        myJsVal += "</a>";
    }
    return myJsVal;
}

/**
 * 初始化分页滚动对象
 * */
function initPageMescroll() {

    mescroll = null;
    mIsRefresh = true; //刷新

    //-------处理分页加载的代码 初始化必须是这样--------//
    //创建MeScroll对象
    mescroll = new MeScroll("mescroll", {
        down: {
            auto: false, //是否在初始化完毕之后自动执行下拉回调callback; 默认true
            callback: downCallback //下拉刷新的回调
        },
        up: {
            auto: true, //是否在初始化时以上拉加载的方式自动加载第一页数据; 默认false
            isBounce: false, //此处禁止ios回弹,解析(务必认真阅读,特别是最后一点): http://www.mescroll.com/qa.html#q10
            callback: upCallback, //上拉回调,此处可简写; 相当于 callback: function (page) { upCallback(page); }
            page: {
                num: 0, //当前页码,默认0,回调之前会加1,即callback(page)会从1开始
                size: mPageSize, //每页数据的数量
                time: null //加载第一页数据服务器返回的时间; 防止用户翻页时,后台新增了数据从而导致下一页数据重复;
            },
            htmlNodata: '<p class="upwarp-nodata">-- END --</p>',
            toTop: { //配置回到顶部按钮
                src: "../Assets/Lib/mescroll/mescroll-totop.png", //默认滚动到1000px显示,可配置offset修改
                //offset : 1000
            }
        }
    });
}

/*下拉刷新的回调 */
function downCallback(pageDown) {

    //为下拉刷新
    mIsRefresh = true;

    //重新设置当前分页
    mescroll.options.up.page.num = 1;
    //这里hasNext必须设置为true 否则下拉刷新后，上拉加载就失效了。
    mescroll.options.up.hasNext = true;

    //mescroll会根据传的参数,自动判断列表如果无任何数据,则提示空;列表无下一页数据,则提示无更多数据;
    //console.log("下拉刷新的回调 pageDown.optUp.page.num=" + pageDown.optUp.page.num + ", pageDown.optUp.page.size=" + pageDown.optUp.page.size);


    //联网加载数据
    getListDataFromNet(pageDown.optUp.page.num, pageDown.optUp.page.size, function (curPageData) {

        //联网成功的回调,隐藏下拉刷新的状态
        mescroll.endSuccess();

        //------这里是操作前台显示代码-----//
        if (curPageData != null && curPageData != undefined && curPageData != "") {
            pageSuccess(curPageData);
        }


    }, function () {
        //联网失败的回调,隐藏下拉刷新的状态
        mescroll.endErr();
    });
}

/*上拉加载的回调 page = {num:1, size:10}; num:当前页 从1开始, size:每页数据条数 */
function upCallback(page) {

    //console.log("执行了upCallback(page) 上拉加载的回调");

    //联网加载数据
    getListDataFromNet(page.num, page.size, function (curPageData) {

        //console.log(curPageData);
        if (curPageData == null || curPageData == undefined && curPageData != "") {
            //没有下一页
            mescroll.options.up.hasNext = false;
            //联网失败的回调,隐藏下拉刷新和上拉加载的状态;
            mescroll.endErr();
            return;
        }
        //联网成功的回调,隐藏下拉刷新和上拉加载的状态;
        //mescroll会根据传的参数,自动判断列表如果无任何数据,则提示空;列表无下一页数据,则提示无更多数据;
        //console.log("上拉加载的回调 page.num=" + page.num + ", page.size=" + page.size + ", curPageData.length=" + curPageData.DataPage.length);

        //方法一(推荐): 后台接口有返回列表的总页数 totalPage
        mescroll.endByPage(curPageData.DataPage.length, curPageData.PageSum); //必传参数(当前页的数据个数, 总页数)

        //------这里是操作前台显示代码-----//
        pageSuccess(curPageData);


    }, function () {
        //联网失败的回调,隐藏下拉刷新和上拉加载的状态;
        mescroll.endErr();
    });
}


/**
 * 重新加载指定页的数据
 * @param {any} pCurrentPageNum 当前页
 */
function reloadPageData(pCurrentPageNum) {

    //重新刷新
    mIsRefresh = true;

    //联网加载数据
    getListDataFromNet(pCurrentPageNum, mPageSize, function (mCurPageDataJson) {

        //联网成功的回调,隐藏下拉刷新的状态
        mescroll.endSuccess();

        //------这里是操作前台显示代码-----//
        if (mCurPageDataJson != null && mCurPageDataJson != undefined && mCurPageDataJson != "") {
            pageSuccess(mCurPageDataJson);
        }


    }, function () {
        //联网失败的回调,隐藏下拉刷新的状态
        mescroll.endErr();
    });

}


//===============================数据分页===============================//




/**=========================自定义函数==============================-**/

/**
 * 跳转到选择售后类型页
 * @param {any} pOrderID 订单ID
 * @param {any} pGoodsID 商品ID
 * @param {any} pSpecID 规格属性ID
 */
function applyAfterSale(pOrderID, pGoodsID, pSpecID) {

    //alert("执行了");

    window.location.href = "../AfterSale/AsSelType?OID=" + pOrderID + "&GID=" + pGoodsID + "&SID=" + pSpecID;

    //阻止冒泡
    event.stopPropagation();
}