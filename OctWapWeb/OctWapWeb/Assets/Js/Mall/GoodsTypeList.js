﻿//================商品分类列表=======================//

/**------定义公共变量----**/
//AjaxURL
var mAjaxUrl = "../MallAjax/GoodsTypeList";

var mBuyerUserID = ""; //买家UserID
var mGoodsTypeIDSec = ""; //第二级商品类目

/**------初始化------**/
$(function () {

    mBuyerUserID = $("#hidBuyerUserID").val().trim();
    mGoodsTypeIDSec = $("#hidGoodsTypeIDSec").val().trim();

    console.log("mGoodsTypeIDSec=" + mGoodsTypeIDSec);

    //加载第二级商品类目
    loadGoodsTypeSecLevelWap();

    // 加载第三级商品类目
    loadGoodsTypeThirdLevelBySecWap();


    //初始化搜索条件
    initSearchWhereArr("Commend", "false");

    //初始化分页滚动对象
    initPageMescroll();



});



/**------自定义函数------**/

/**
 *  加载第二级商品类目
 * */
function loadGoodsTypeSecLevelWap() {

    //构造POST参数
    var dataPOST = {
        "Type": "1", "IsEntity": "false",
    };
    console.log(dataPOST);
    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: "../MallAjax/GoodsType?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("加载第二级商品类目=" + reTxt);
            if (reTxt != "") {
                var _jsonReTxt = JSON.parse(reTxt);

                var GooGoodsTypeSecLevelList = _jsonReTxt.GooGoodsTypeSecLevelList;

                var myJsVal = "";
                myJsVal += " <li>";
                myJsVal += "    <div onclick=\"window.location.href='../Mall/Index'\">热门</div>";
                myJsVal += "</li>";

                var myJsValFor = "";
                var myJsValCur = "";
                for (var i = 0; i < GooGoodsTypeSecLevelList.length; i++) {

                    if (mGoodsTypeIDSec == GooGoodsTypeSecLevelList[i].GoodsTypeID) {
                        myJsValCur += "<li class=\"goods-type-li-current\" onclick=\"window.location.href='../Mall/GoodsTypeList?GTID=" + GooGoodsTypeSecLevelList[i].GoodsTypeID + "'\">";
                        myJsValCur += "    <div>" + GooGoodsTypeSecLevelList[i].GoodsTypeName + "</div>";
                        myJsValCur += "</li>";
                        continue;
                    }

                    myJsValFor += "<li onclick=\"window.location.href='../Mall/GoodsTypeList?GTID=" + GooGoodsTypeSecLevelList[i].GoodsTypeID + "'\">";
                    myJsValFor += "    <div>" + GooGoodsTypeSecLevelList[i].GoodsTypeName + "</div>";
                    myJsValFor += "</li>";
                }
                //拼接到一起
                myJsVal += myJsValCur + myJsValFor;
                myJsVal += "<li>&nbsp;</li>";

                $("#GoodsTypeUl").html(myJsVal);
            }
        }
    });
}

/**
 * 加载第三级商品类目,根据第二级类目ID,主要用于手机端(分类显示页) 并SortNum排序
 * */
function loadGoodsTypeThirdLevelBySecWap() {

    //构造POST参数
    var dataPOST = {
        "Type": "2", "GoodsTypeIDSec": mGoodsTypeIDSec,
    };
    console.log(dataPOST);
    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: "../MallAjax/GoodsType?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("加载第三级商品类目=" + reTxt);
            if (reTxt != "") {
                var _jsonReTxt = JSON.parse(reTxt);

                var GooGoodsTypeThirdLevelList = _jsonReTxt.GooGoodsTypeThirdLevelList;

                var myJsVal = "";
                for (var i = 0; i < GooGoodsTypeThirdLevelList.length; i++) {
                    myJsVal += " <a href=\"../Mall/GoodsTypeListDetail?GTID=" + GooGoodsTypeThirdLevelList[i].GoodsTypeID + "\" class=\"goods-type-item\">";
                    myJsVal += " <img src=\"//" + GooGoodsTypeThirdLevelList[i].TypeIcon + "\" />";
                    myJsVal += " <div>" + GooGoodsTypeThirdLevelList[i].GoodsTypeName + "</div>";
                    myJsVal += "</a>";
                }
                if (GooGoodsTypeThirdLevelList.length > 0) {
                    myJsVal += "<a href=\"../Mall/GoodsTypeListDetail?GTID=" + GooGoodsTypeThirdLevelList[0].GoodsTypeID + "&LoadAll=true\" class=\"goods-type-item goods-type-all\">";
                    myJsVal += " <div class=\"icon-circle\">";
                    myJsVal += "     <img src=\"../Assets/Imgs/Icon/3point.png\" />";
                    myJsVal += " </div>";
                    myJsVal += " <div>查看全部</div>";
                    myJsVal += "</a>";
                }
               
                //显示代码插入前台
                $("#GoodsTypeList").html(myJsVal);


            }
        }
    });

}


//===============================数据分页===============================//

var mSearchWhereArr = "";//搜索条件拼接字符串 "^"

var mIsRefresh = true; //是否为刷新
var mescroll;
var mPageSize = 15; //每页的数据条数
var mCurPageDataJson = null; //当前分页的返回数据 Json对象
var mIntPageCurrent = 1; //当前的分页索引

/**
 * 初始化搜索条件
 * @param pPageOrderName Commend 推荐 SaleCount 销量 GoodsPriceAsc 价格升序 GoodsPriceDesc 价格降序 WriteDate 新品 Discount 打折  GroupMsgCount 团购  SecKill  秒杀
 * @param pIsOnlyDiscount  是否只加载打折的商品 ( true / false )
 * */
function initSearchWhereArr(pPageOrderName, pIsOnlyDiscount) {

    //SearchKeyword + "^" + pPageOrderName + "^" + pIsOnlyDiscount 
    var mSearchKeyword = "";
    mSearchWhereArr = mSearchKeyword + "^" + pPageOrderName + "^" + pIsOnlyDiscount;

}


/**
 * 加载网络数据
 * @param {any} pageNum
 * @param {any} pageSize
 * @param {any} successCallback
 * @param {any} errorCallback
 */
function getListDataFromNet(pageNum, pageSize, successCallback, errorCallback) {

    //记录当前的分页索引
    mIntPageCurrent = pageNum;

    //构造GET参数
    var dataGET = {
        "Type": "1",
        "PageCurrent": pageNum,
        "SearchWhereArr": mSearchWhereArr,
        //"GoodsTypeID": mGoodsTypeIDThird,
        "GoodsTypeIDSec": mGoodsTypeIDSec,
        //"IsPayDelivery": mIsPayDelivery,
        //"IsShopExpense": mIsShopExpense,
        //"IsOfflinePay": mIsOfflinePay,
        //"IsHasGift": mIsHasGift,

    };
    console.log(dataGET);
    //正式发送GET请求
    $.ajax({
        type: "POST",
        url: "../MallAjax/SearchGoodsResult?rnd=" + Math.random(),
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
                if (pageNum == 1) {
                    document.getElementById("PageContentList").innerHTML = "";
                }
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


        if (dataPage.GoodsTitle.length > 25) {
            dataPage.GoodsTitle = dataPage.GoodsTitle.substring(0, 25) + "...";
        }
        //---计算价格----//
        var _maxDiscount = 10;
        if (dataPage.GroupDiscount < _maxDiscount && dataPage.GroupDiscount > 0) {
            _maxDiscount = dataPage.GroupDiscount;
        }
        if (dataPage.Discount < _maxDiscount && dataPage.Discount > 0 && dataPage.GroupDiscount <= 0) {
            _maxDiscount = dataPage.Discount;
        }
        if (dataPage.SkDiscount < _maxDiscount && dataPage.SkDiscount > 0 && dataPage.GroupDiscount <= 0) {
            _maxDiscount = dataPage.SkDiscount;
        }
        var _goodsPrice = parseFloat(dataPage.GoodsPrice) * (_maxDiscount / 10);

        //构造徽章
        var _bageSpan = "";
        if (dataPage.Discount > 0) {
            _bageSpan = dataPage.Discount + "折";
        }
        if (dataPage.CountSecKill > 0) {
            _bageSpan = "秒杀";
        }
        if (dataPage.GroupMsgCount > 0) {
            _bageSpan = "团购";
        }

        myJsVal += " <li class=\"goods-item\" onclick=\"window.location.href='../Goods/GoodsDetail?GID=" + dataPage.GoodsID + "'\">";
        myJsVal += "<div class=\"goods-img\">";
        myJsVal += "    <img src=\"//" + dataPage.ImgPathCover + "\" />";
        myJsVal += "</div>";
        myJsVal += "<div class=\"goods-name\">" + dataPage.GoodsTitle + "</div>";
        myJsVal += "<div class=\"goods-price\">";
        myJsVal += "    <b>&#165;" + formatNumberDotDigit(_goodsPrice, 2) + "</b>";
        myJsVal += "    <div>" + dataPage.PaidCount + "人付款</div>";
        myJsVal += "</div>";
        myJsVal += "<span class=\"goods-item-badge\">" + _bageSpan + "</span>";
        myJsVal += "</li>";
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

