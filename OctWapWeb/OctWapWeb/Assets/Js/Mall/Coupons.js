//==============优惠券结果===================//

/**------定义公共变量----**/

//AjaxURL
var mAjaxUrl = "../MallAjax/Coupons";

var mBuyerUserID = ""; //买家UserID

var mShopTypeIDSec = ""; //第二级店铺类目ID
var mExpenseReachSum = ""; //无门槛券
var mIsOfflineUse = ""; //是否线下使用
var mRegionCountyCode = ""; //区县代号

/**-----------初始化-----------**/

$(function () {

    //加载店铺显示分类
    loadCouponsShopType();

    ////初始化搜索条件
    //initSearchWhereArr("Commend", "false");

    ////初始化分页滚动对象
    initPageMescroll();

});


/**-----------自定义函数-----------**/

/**
 *  加载店铺显示分类
 * */
function loadCouponsShopType() {
    //构造POST参数
    var dataPOST = {
        "Type": "2", "IsEntity": "false",
    };
    console.log(dataPOST);
    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: mAjaxUrl + "?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("加载店铺显示分类=" + reTxt);
            if (reTxt != "") {
                var _jsonReTxt = JSON.parse(reTxt);

                var ShopTypeList = _jsonReTxt.ShopTypeList;

                var myJsVal = "";
                myJsVal += " <span class=\"goods-type-item goods-type-current\" onclick=\"clickItemSearchWhere1('')\">全部分类</span>";
                for (var i = 0; i < ShopTypeList.length; i++) {
                    myJsVal += "<span class=\"goods-type-item\" onclick=\"clickItemSearchWhere1('" + ShopTypeList[i].ShopTypeID + "')\">" + ShopTypeList[i].ShopTypeName + "</span>";
                }
                $("#AllWhereType").html(myJsVal);

            }
        }
    });
}


//============切换选项卡==============//

/**
 * 选择分类
 */
function clickItemSearchWhere1(pShopTypeIDSec) {

    mShopTypeIDSec = pShopTypeIDSec;

    //初始化搜索条件
    //initSearchWhereArr("Commend", "false");

    //重新加载数据
    reloadPageData("1");

    //清除选择样式 
    $(".goods-type-item").removeClass("goods-type-current");
    $(event.currentTarget).addClass("goods-type-current");
    $("#SearchWhere1Span").html($(event.currentTarget).html());

    //关闭弹出层
    searchWhere1();
}


/**
 * 第一个条件选项卡
 * */
function searchWhere1() {

    var _display = $("#AllWhereShow").css("display");

    if (_display == "none") {
        $("#AllWhereShow").show();
    }
    else {
        $("#AllWhereShow").hide();
    }
    //$("#AllWhereType1").show();
}



/**
 * 选择排序方式
 * @param pPageOrderName 
 */
function clickItemSearchWhere2(pPageOrderName) {


    //初始化搜索条件
    //initSearchWhereArr(pPageOrderName, "false");

    if (pPageOrderName == "NoExpenseReach") {
        mExpenseReachSum = "1";
    }
    else {
        mExpenseReachSum = "";
    }


    //重新加载数据
    reloadPageData("1");

    //清除选择样式 
    $(".goods-type-order").removeClass("search-current");
    $(event.currentTarget).addClass("search-current");
    //$("#SearchWhere3Span").html($(event.currentTarget).html());

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

    //搜索条件拼接字符串  SearchKeyword + "^" + pPageOrderName + "^" + pIsOnlyDiscount + "^" + pIsOnlyGroup
    var mSearchKeyword = "";
    mSearchWhereArr = mSearchKeyword + "^" + pPageOrderName + "^" + pIsOnlyDiscount + "^true";

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
        "ShopTypeID": mShopTypeIDSec,
        //"IsEntity": "",
        "IsOfflineUse": mIsOfflineUse,
        "RegionCountyCode": mRegionCountyCode,
        "ExpenseReachSum": mExpenseReachSum,
    };
    console.log(dataGET);
    //正式发送GET请求
    $.ajax({
        type: "POST",
        url: "../MallAjax/Coupons?rnd=" + Math.random(),
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

        var _UseMoneyDiscount = dataPage.UseMoney;
        if (parseFloat(_UseMoneyDiscount) <= 0) {
            _UseMoneyDiscount = "<b>" + dataPage.UseDiscount + "折</b>";
        }
        else {
            _UseMoneyDiscount = "&#165; <b>" + dataPage.UseMoney + "</b>"
        }

        var _ExpenseReachSum = "";
        if (parseFloat(dataPage.ExpenseReachSum) > 0) {
            _ExpenseReachSum = "满" + dataPage.ExpenseReachSum + "元可用";
        }

        if (dataPage.CouponsTitle.length > 30) {
            dataPage.CouponsTitle = dataPage.CouponsTitle.substring(0, 30);
        }

        var couponsLabelSpan = "";
        if (dataPage.ExpenseReachSum <= 0) {
            couponsLabelSpan += "<span>无门槛</span>";
        }
        if (dataPage.UseTimeRange == null || dataPage.UseTimeRange == "") {
            couponsLabelSpan += "<span>永久有效</span>";
        }
        else {
            couponsLabelSpan += "<span>限期使用</span>";
        }
        if (dataPage.IsOfflineUse == "true") {
            couponsLabelSpan += "<span>线下可用</span>";
        }

        myJsVal += " <li class=\"goods-item\" onclick=\"window.location.href='../Buyer/CouponsDetail?CID=" + dataPage.CouponsID + "'\">";
        myJsVal += " <div class=\"goods-item-img\">";
        myJsVal += "     <div class=\"coupons-price-div\">" + _UseMoneyDiscount + "</div>";
        myJsVal += "     <div>" + _ExpenseReachSum + "</div>";
        myJsVal += " </div>";
        myJsVal += " <div class=\"goods-item-msg\">";
        myJsVal += "     <div class=\"goods-item-title\">";
        myJsVal += "" + dataPage.CouponsTitle + "";
        myJsVal += "     </div>";
        myJsVal += "     <div class=\"coupons-label-span\">";
        myJsVal += "" + couponsLabelSpan + "";
        myJsVal += "     </div>";
        myJsVal += " </div>";
        myJsVal += " <div class=\"goods-item-integral\">";
        myJsVal += "     <div>";
        myJsVal += "         消耗积分";
        myJsVal += "     </div>";
        myJsVal += "     <div class=\"expend-integral\">0.00</div>";
        myJsVal += "     <div>";
        myJsVal += "         <input class=\"btn-get\" type=\"button\" value=\"领取\" />";
        myJsVal += "     </div>";
        myJsVal += " </div>";
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

