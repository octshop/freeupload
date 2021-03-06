//============== 团购优惠 - 搜索商品结果===================//

/**------定义公共变量----**/

//AjaxURL
var mAjaxUrl = "../O2oAjax/GroupBuy";

var mBuyerUserID = ""; //买家UserID


//商品搜索内容
var mSearchKeyword = "";

//当前价格排序
var mGoodsPriceSort = "GoodsPriceAsc";

var mRegionCountyCode = ""; //区县的代号
var mPageOrderName = "Distance";


var mGoodsTypeIDThird = ""; //第三级商品类目ID



/**-----------初始化-----------**/

$(function () {

    //加载拼团商品显示分类
    loadGroupGoodsType();

    //加载当前用户所在城市 的区县列表，没有登录则加载默认或已选择的
    loadCurUserCountyList(function () {

        //初始化查询条件
        initSearchWhereArr();

        //初始化分页滚动对象
        initPageMescroll();


    });



});


/**-----------自定义函数-----------**/

/**
 * 加载拼团商品显示分类
 * */
function loadGroupGoodsType() {
    //构造POST参数
    var dataPOST = {
        "Type": "1", "IsEntity": "true",
    };
    console.log(dataPOST);
    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: "../MallAjax/GroupBuy?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("加载拼团商品显示分类=" + reTxt);
            if (reTxt != "") {
                var _jsonReTxt = JSON.parse(reTxt);

                var GroupGoodsTypeList = _jsonReTxt.GroupGoodsTypeList;

                var myJsVal = "";
                myJsVal += " <span class=\"goods-type-item goods-type-current\" onclick=\"clickItemSearchWhere1('')\">全部分类</span>";
                for (var i = 0; i < GroupGoodsTypeList.length; i++) {
                    myJsVal += "<span class=\"goods-type-item\" onclick=\"clickItemSearchWhere1('" + GroupGoodsTypeList[i].GoodsTypeID + "')\">" + GroupGoodsTypeList[i].GoodsTypeName + "</span>";
                }
                $("#AllWhereType").html(myJsVal);
            }
        }
    });
}


/**
 * 加载当前用户所在城市 的区县列表，没有登录则加载默认或已选择的
 * */
function loadCurUserCountyList(pCallBack) {
    //构造POST参数
    var dataPOST = {
        "Type": "2",
    };
    console.log(dataPOST);
    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: "../MallAjax/SearchGoodsResultO2o?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("加载当前用户所在城市的区县列表=" + reTxt);
            if (reTxt != "") {
                var _jsonReTxt = JSON.parse(reTxt);

                //--------全部地区-------//
                if (_jsonReTxt != undefined && _jsonReTxt != null) {
                    var UserCountyList = _jsonReTxt;

                    var xhtmlAllWhereType2 = "";
                    xhtmlAllWhereType2 += "<span class=\"goods-type-region goods-type-current\" onclick=\"clickItemSearchWhere2('')\">全部地区</span>";
                    for (var j = 0; j < UserCountyList.length; j++) {
                        xhtmlAllWhereType2 += "<span class=\"goods-type-region\" onclick=\"clickItemSearchWhere2('" + UserCountyList[j].REGIONCODE + "')\">" + UserCountyList[j].REGIONNAME + "</span>";
                    }
                    //显示代码插入前台
                    $("#AllWhereType2").html(xhtmlAllWhereType2);
                }

                //回调函数
                pCallBack();
            }
        }
    });
}




//============切换选项卡==============//


/**
 * 第一个条件选项卡
 * */
function searchWhere1() {

    var _display = $("#AllWhereType").css("display");

    $("#AllWhereType2").hide();

    if (_display == "none") {
        $("#AllWhereShow").show();
        $("#AllWhereType").show();
    }
    else {
        $("#AllWhereType").hide();
        $("#AllWhereShow").hide();
    }
}

/**
 * 第二个条件选项卡
 * */
function searchWhere2() {

    var _display = $("#AllWhereType2").css("display");

    $("#AllWhereType").hide();

    if (_display == "none") {

        $("#AllWhereShow").show();
        $("#AllWhereType2").show();
    }
    else {
        $("#AllWhereType2").hide();
        $("#AllWhereShow").hide();
    }

}

/**
 * 切换价格排序
 * */
function chgTabPrice() {

    if (mGoodsPriceSort == "GoodsPriceAsc") {
        mGoodsPriceSort = "GoodsPriceDesc";
        //切换选项卡
        clickItemSearchWhere3('GoodsPriceDesc')

    }
    else {
        mGoodsPriceSort = "GoodsPriceAsc";
        //切换选项卡
        clickItemSearchWhere3('GoodsPriceAsc')
    }

}


/**
 * 选择分类
 */
function clickItemSearchWhere1(pGoodsTypeIDThird) {

    mGoodsTypeIDThird = pGoodsTypeIDThird

    //初始化搜索条件
    initSearchWhereArr();

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
 * 选择地区范围
 */
function clickItemSearchWhere2(pRegionCountyCode) {

    mRegionCountyCode = pRegionCountyCode;
    initSearchWhereArr();
    //重新加载数据
    reloadPageData("1");

    //清除选择样式 
    $(".goods-type-region").removeClass("goods-type-current");
    $(event.currentTarget).addClass("goods-type-current");
    $("#SearchWhere2Span").html($(event.currentTarget).html());

    //关闭弹出层
    searchWhere2();

}


/**
 * 选择排序方式
 */
function clickItemSearchWhere3(pPageOrderName) {

    mPageOrderName = pPageOrderName;

    initSearchWhereArr();
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
var mPageSize = 16; //每页的数据条数
var mCurPageDataJson = null; //当前分页的返回数据 Json对象
var mIntPageCurrent = 1; //当前的分页索引

/**
 * 初始化搜索条件
 * @param pPageOrderName   综合 Distance ，销量 SaleCount ，价格 GoodsPriceAsc,GoodsPriceDesc
 * @param pRegionCodeArr  区域范围 430000_430100_430121
 * */
function initSearchWhereArr() {

    // RegionCodeArr + "^" + pPageOrderName + "^" + SearchKeyword
    mSearchWhereArr = mRegionCountyCode + "^" + mPageOrderName + "^" + mSearchKeyword;

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
        "GoodsTypeID": mGoodsTypeIDThird,
        "IsOnlyGroup": "true",
        "PageCurrent": pageNum,
        "SearchWhereArr": mSearchWhereArr,
    };
    console.log(dataGET);
    //正式发送GET请求
    $.ajax({
        type: "POST",
        url: "../MallAjax/SearchGoodsResultO2o?rnd=" + Math.random(),
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

        if (dataPage.GoodsTitle.length > 40) {
            dataPage.GoodsTitle = dataPage.GoodsTitle.substring(0, 40) + "...";
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
        var _goodsPrice = formatNumberDotDigit(parseFloat(dataPage.GoodsPrice) * (_maxDiscount / 10));

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

        //构造商品标签
        var _goodsLabelSpan = "";
        if (dataPage.IsShopExpense == "true") {
            _goodsLabelSpan += "<span>到店消费/自取</span>";
        }
        if (dataPage.IsPayDelivery == "true") {
            _goodsLabelSpan += "<span>货到付款</span>";
        }
        if (dataPage.IsOfflinePay == "true") {
            _goodsLabelSpan += "<span>到店付</span>";
        }
        if (dataPage.GiftIDArr != "" && dataPage.GiftIDArr != null) {
            _goodsLabelSpan += "<span>赠品</span> ";
        }


        myJsVal += " <li class=\"goods-item\" onclick=\"window.location.href='../Goods/GoodsDetail?GID=" + dataPage.GoodsID + "'\">";
        myJsVal += " <div class=\"goods-img\">";
        myJsVal += "     <img src=\"//" + dataPage.ImgPathCover + "\" />";

        myJsVal += "<span>" + _bageSpan + "</span>";

        myJsVal += " </div>";
        myJsVal += " <div>";
        myJsVal += "     <div class=\"goods-title-div\">";
        myJsVal += "" + dataPage.GoodsTitle + "";
        myJsVal += "     </div>";
        myJsVal += "     <div class=\"goods-price\">";
        myJsVal += "         &#165; " + _goodsPrice + "";
        myJsVal += "     </div>";
        myJsVal += "     <div class=\"goods-label\">";
        myJsVal += _goodsLabelSpan;
        myJsVal += "     </div>";
        myJsVal += "     <div class=\"goods-extra\">";
        myJsVal += "<i>" + dataPage.PaidCount + " 人付款，" + dataPage.CountAppraise + "  条评价</i><br />";
        myJsVal += "         " + dataPage.ShopName + "<a href=\"javascript:void(0)\" onclick=\"goToShop('" + dataPage.ShopID + "')\">进店>></a>";
        myJsVal += "     </div>";
        myJsVal += " </div>";
        myJsVal += "</li>";
    }
    myJsVal += "<li style=\"height: 30px;\"></li>";


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

