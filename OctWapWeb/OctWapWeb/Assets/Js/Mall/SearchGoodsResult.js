//==============搜索商品结果===================//

/**------定义公共变量----**/

//AjaxURL
var mAjaxUrl = "../MallAjax/SearchGoodsResult";

var mBuyerUserID = ""; //买家UserID

//商品搜索内容
var mSearchKeyword = "";

//当前价格排序
var mGoodsPriceSort = "GoodsPriceAsc";

//商品必填属性（属性名_属性值^属性名_属性值） [ 袖长_无袖^腰型_高腰^廓形_A型^当季热销_121^裙长_超短裙 ]
var mGoodsTypeNeedProp = "";
//搜索商品重复次数最多的商品类目ID
var mGoodsTypeIDRepeatMax = "";

//各种查询条件切换
var mIsPayDelivery = ""; //是否支持货到付款
var mIsShopExpense = ""; //是否到店消费/自取
var mIsOfflinePay = ""; //是否到店付
var mIsHasGift = ""; //是否有赠品


/**-------------初始化---------**/

$(function () {

    mSearchKeyword = $("#hidSearchContent").val().trim();
    mBuyerUserID = $("#hidBuyerUserID").val().trim();

    mGoodsTypeIDRepeatMax = "";


    //初始化右侧侧边栏
    initSimpleSidebar()

    //初始化搜索条件
    initSearchWhereArr("Commend", "false");

    //初始化分页滚动对象
    initPageMescroll();


});


//===============================数据分页===============================//

var mSearchWhereArr = "";//搜索条件拼接字符串 "^"

var mIsRefresh = true; //是否为刷新
var mescroll;
var mPageSize = 16; //每页的数据条数
var mCurPageDataJson = null; //当前分页的返回数据 Json对象
var mIntPageCurrent = 1; //当前的分页索引

/**
 * 初始化搜索条件
 * @param pPageOrderName Commend 推荐 SaleCount 销量 GoodsPriceAsc 价格升序 GoodsPriceDesc 价格降序 WriteDate 新品 Discount 打折  GroupMsgCount 团购  SecKill  秒杀
 * @param pIsOnlyDiscount  是否只加载打折的商品 ( true / false )
 * */
function initSearchWhereArr(pPageOrderName, pIsOnlyDiscount, pIsOnlyGroup, pIsOnlySecKill) {

    //SearchKeyword + "^" + pPageOrderName + "^" + pIsOnlyDiscount 

    mSearchWhereArr = mSearchKeyword + "^" + pPageOrderName + "^" + pIsOnlyDiscount + "^" + pIsOnlyGroup + "^" + pIsOnlySecKill;

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
        "GoodsTypeNeedProp": mGoodsTypeNeedProp,
        "IsPayDelivery": mIsPayDelivery,
        "IsShopExpense": mIsShopExpense,
        "IsOfflinePay": mIsOfflinePay,
        "IsHasGift": mIsHasGift,

    };
    //正式发送GET请求
    $.ajax({
        type: "POST",
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

    if (dataPageArr.length > 0) {
        //添加搜索商品历史记录
        addSearchHistoryGoods();


        if (mGoodsTypeIDRepeatMax != curPageDataJson.GoodsTypeIDRepeatMax) {

            mGoodsTypeIDRepeatMax = curPageDataJson.GoodsTypeIDRepeatMax;

            //得到商品类目必填属性集合
            getGoodsTypeNeedProp();
        }


    }

    //前台显示代码
    var myJsVal = "";
    for (var i = 0; i < dataPageArr.length; i++) {

        var dataPage = dataPageArr[i];
        var dataPageExtra = dataPageExtraArr[i];


        if (dataPage.GoodsTitle.length > 33) {
            dataPage.GoodsTitle = dataPage.GoodsTitle.substring(0, 33) + "...";
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

        var _IsSelfShop = "";
        if (dataPage.IsSelfShop == "true") {
            _IsSelfShop = "<span class=\"shop-self-span\">自营</span>";
        }


        myJsVal += " <li class=\"goods-item\" onclick=\"window.location.href='../Goods/GoodsDetail?GID=" + dataPage.GoodsID + "'\">";
        myJsVal += " <div class=\"goods-img\">";
        myJsVal += "     <img src=\"//" + dataPage.ImgPathCover + "\" />";

        myJsVal += "<span>" + _bageSpan + "</span>";

        myJsVal += " </div>";
        myJsVal += " <div>";
        myJsVal += "     <div class=\"goods-title-div\">";
        myJsVal += "" + dataPage.GoodsTitle + " " + _IsSelfShop;
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


/**------------自定义函数----------**/


/**
 * 切换价格排序
 * */
function chgTabPrice() {

    if (mGoodsPriceSort == "GoodsPriceAsc") {
        mGoodsPriceSort = "GoodsPriceDesc";
        //切换选项卡
        chgTab("4")
    }
    else {
        mGoodsPriceSort = "GoodsPriceAsc";
        //切换选项卡
        chgTab("3")
    }

}

/**
 * 切换选项卡
 * @param {any} pTabNum
 */
function chgTab(pTabNum, pIsReload) {

    if (pTabNum == "" || pTabNum == undefined) {
        return;
    }

    var _navItemLabelArr = $(".nav-item");
    $(".nav-item").removeClass("search-current");


    //Commend 推荐 SaleCount 销量 GoodsPriceAsc 价格升序 GoodsPriceDesc 价格降序 WriteDate 新品 Discount 打折  GroupMsgCount 团购  SecKill  秒杀

    //推荐
    if (pTabNum == "1") {
        initSearchWhereArr("Commend", "false", "false", "false");
        $(_navItemLabelArr[0]).addClass("search-current");
    }
    else if (pTabNum == "2") //销量
    {
        initSearchWhereArr("SaleCount", "false", "false", "false");
        $(_navItemLabelArr[1]).addClass("search-current");
    }
    else if (pTabNum == "3") //价格升序
    {
        initSearchWhereArr("GoodsPriceAsc", "false", "false", "false");
        $(_navItemLabelArr[2]).addClass("search-current");
    }
    else if (pTabNum == "4") //价格降序
    {
        initSearchWhereArr("GoodsPriceDesc", "false", "false", "false");
        $(_navItemLabelArr[2]).addClass("search-current");
    }
    else if (pTabNum == "5") //新品
    {
        initSearchWhereArr("WriteDate", "false", "false", "false");
        $(_navItemLabelArr[3]).addClass("search-current");
    }
    else if (pTabNum == "6") //打折
    {
        initSearchWhereArr("Discount", "true", "false", "false");
        $(_navItemLabelArr[4]).addClass("search-current");
    }
    else if (pTabNum == "7") //团购
    {
        initSearchWhereArr("GroupMsgCount", "false", "true", "false");
        $(_navItemLabelArr[5]).addClass("search-current");
    }
    else if (pTabNum == "8") //秒杀
    {
        initSearchWhereArr("SecKill", "false", "false", "true");
        $(_navItemLabelArr[6]).addClass("search-current");
    }

    if (pIsReload == undefined || pIsReload == null || pIsReload != "false") {

        $("#PageContentList").html("<div style=\"padding:20px; text-align:center;\">…加载中…</div>");
        //重新加载数据
        reloadPageData("1");
    }

}

/**
 * 进入店铺
 * @param {any} pShopID 店铺ID
 */
function goToShop(pShopID) {
    event.stopPropagation();
    window.location.href = "../Shop/Index?SID=" + pShopID + "";
    return;
}

/**
 * 添加搜索商品历史记录
 * */
function addSearchHistoryGoods() {

    //判断登录
    if (mBuyerUserID == "" || mBuyerUserID == undefined) {
        return "";
    }

    //构造POST参数
    var dataPOST = {
        "Type": "2", "SearchContent": mSearchKeyword, "BuyerUserID": mBuyerUserID, "IsEntity": "false",
    };

    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: mAjaxUrl + "?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("添加搜索商品历史记录=" + reTxt);
            if (reTxt != "") {

                var _jsonReTxt = JSON.parse(reTxt);

            }
        }
    });

}

/**
 * 得到商品类目必填属性集合
 * */
function getGoodsTypeNeedProp() {

    //构造POST参数
    var dataPOST = {
        "Type": "3", "GoodsTypeID": mGoodsTypeIDRepeatMax,
    };

    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: mAjaxUrl + "?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("得到商品类目必填属性集合=" + reTxt);
            if (reTxt != "") {

                var _jsonReTxt = JSON.parse(reTxt);
                var GooGoodsTypeNeedPropList = _jsonReTxt.GooGoodsTypeNeedPropList;

                var myJsVal = "";
                myJsVal += "<li class=\"sidebar-title-filter\">";
                myJsVal += "筛选";
                myJsVal += "</li>";
                myJsVal += "<li>";
                myJsVal += "    <div onclick=\"tglIsPayDelivery()\" class=\"subNav\"><a href=\"javascript:void(0)\">货到付款</a></div>";
                myJsVal += "    <div onclick=\"tglIsShopExpense()\" class=\"subNav\"><a href=\"javascript:void(0)\">到店消费/自取</a></div>";
                myJsVal += "    <div onclick=\"tglIsOfflinePay()\" class=\"subNav\"><a href=\"javascript:void(0)\">到店付</a></div>";
                myJsVal += "    <div onclick=\"tglIsHasGift()\" class=\"subNav\"><a href=\"javascript:void(0)\">有赠品</a></div>";
                myJsVal += "</li>";
                for (var i = 0; i < GooGoodsTypeNeedPropList.length; i++) {

                    var PropValueArr = GooGoodsTypeNeedPropList[i].PropValue.split("^");

                    myJsVal += "<li class=\"sidebar-title\">";
                    myJsVal += "" + GooGoodsTypeNeedPropList[i].PropName + "";
                    myJsVal += "</li>";
                    myJsVal += "<li>";
                    for (var j = 0; j < PropValueArr.length; j++) {
                        myJsVal += "<div onclick=\"clickPropValueItem('" + GooGoodsTypeNeedPropList[i].GtPropID + "','" + GooGoodsTypeNeedPropList[i].PropName + "','" + PropValueArr[j] + "')\" name=\"Item_" + GooGoodsTypeNeedPropList[i].GtPropID + "\" class=\"subNav\"><a href=\"javascript:void(0)\">" + PropValueArr[j] + "</a></div>";
                    }
                    myJsVal += "</li>";
                }
                //显示代码插入前台
                $("#SideBarListUl").html(myJsVal);
            }
        }
    });
}


/**
 * 切换 是否支持货到付款
 * */
function tglIsPayDelivery() {

    if (mIsPayDelivery == "") {
        mIsPayDelivery = "true";
    }
    else {
        mIsPayDelivery = "";
    }

    if (mIsPayDelivery == "true") {
        $(event.currentTarget).addClass("sub-nav-current");
    }
    else {
        $(event.currentTarget).removeClass("sub-nav-current");
    }
    //console.log("mIsPayDelivery=" + mIsPayDelivery);
    //重新加载数据
    chgTab('1');
}

/**
 * 切换 是否支持 - 到店消费/自取
 * */
function tglIsShopExpense() {


    if (mIsShopExpense == "") {
        mIsShopExpense = "true";
    }
    else {
        mIsShopExpense = "";
    }

    if (mIsShopExpense == "true") {
        $(event.currentTarget).addClass("sub-nav-current");
    }
    else {
        $(event.currentTarget).removeClass("sub-nav-current");
    }
    //console.log("mIsPayDelivery=" + mIsPayDelivery);
    //重新加载数据
    chgTab('1');
}

/**
 * 切换 是否支持 - 到店付
 * */
function tglIsOfflinePay() {


    if (mIsOfflinePay == "") {
        mIsOfflinePay = "true";
    }
    else {
        mIsOfflinePay = "";
    }

    if (mIsOfflinePay == "true") {
        $(event.currentTarget).addClass("sub-nav-current");
    }
    else {
        $(event.currentTarget).removeClass("sub-nav-current");
    }
    //console.log("mIsPayDelivery=" + mIsPayDelivery);
    //重新加载数据
    chgTab('1');
}

/**
 * 切换 是否有 - 赠品
 * */
function tglIsHasGift() {


    if (mIsHasGift == "") {
        mIsHasGift = "true";
    }
    else {
        mIsHasGift = "";
    }

    if (mIsHasGift == "true") {
        $(event.currentTarget).addClass("sub-nav-current");
    }
    else {
        $(event.currentTarget).removeClass("sub-nav-current");
    }
    //console.log("mIsPayDelivery=" + mIsPayDelivery);
    //重新加载数据
    chgTab('1');
}






//-----------构造必填属性查询--------//

/**
 * 单击必填属性值项
 * @param {any} pGtPropID 必填属性ID
 * @param {any} pPropName 属性名称
 * @param {any} pPropValue 属性值
 */
function clickPropValueItem(pGtPropID, pPropName, pPropValue) {

    $("div[name='Item_" + pGtPropID + "']").removeClass("sub-nav-current");
    //当前单击的添加选择样式
    $(event.currentTarget).addClass("sub-nav-current");

    //构造商品类目必填属性 查询条件字符串 
    whereGoodsTypeNeedProp(pPropName, pPropValue)

    //重新加载数据
    chgTab('1');
}

/**
 * 构造商品类目必填属性 查询条件字符串 
 * @param {any} pPropName 属性名称
 * @param {any} pPropValue 属性值
 */
function whereGoodsTypeNeedProp(pPropName = "", pPropValue = "") {

    if (pPropName == "" || pPropValue == "") {
        mGoodsTypeNeedProp = "";
        return;
    }

    var _addPropValue = false; //是否已添加

    //商品必填属性（属性名_属性值^属性名_属性值） [ 袖长_无袖^腰型_高腰^廓形_A型^当季热销_121^裙长_超短裙 ]
    var GoodsTypeNeedPropArr = splitStringJoinChar(mGoodsTypeNeedProp);
    //循环判断是否为当前属性名
    for (var i = 0; i < GoodsTypeNeedPropArr.length; i++) {
        if (GoodsTypeNeedPropArr[i].indexOf(pPropName + "_") >= 0) {
            GoodsTypeNeedPropArr[i] = pPropName + "_" + pPropValue;

            _addPropValue = true; //已添加

            break;
        }
    }
    if (_addPropValue == false) {
        GoodsTypeNeedPropArr[GoodsTypeNeedPropArr.length] = pPropName + "_" + pPropValue;
    }

    //连接数据
    mGoodsTypeNeedProp = GoodsTypeNeedPropArr.join("^");
    console.log("mGoodsTypeNeedProp=" + mGoodsTypeNeedProp);
}

/**
 * 重置必填属性查询条件字符串
 * */
function resetGoodsTypeNeedProp() {

    //重置条件
    whereGoodsTypeNeedProp();

    //移除选择样式
    $(".subNav").removeClass("sub-nav-current");

    mIsPayDelivery = ""; //是否支持货到付款
    mIsShopExpense = ""; //是否到店消费/自取
    mIsOfflinePay = ""; //是否到店付
    mIsHasGift = ""; //是否有赠品

    return;
}


/**
 * 初始化右侧侧边栏
 * */
function initSimpleSidebar() {
    //初始化侧边栏
    $('.sidebar').simpleSidebar({
        settings: {
            opener: '#OpenSbDiv',
            wrapper: '.wrapper',
            animation: {
                duration: 300,
                easing: 'easeOutQuint'
            }
        },
        sidebar: {
            align: 'right',
            width: 350, //侧边栏的宽度
            closingLinks: 'a',
        }
    });
    //初始化单击关闭按钮
    $(".subNav").click(function () {
        // 修改数字控制速度， slideUp(500)控制卷起速度
        $(this).next(".navContent").slideToggle(200);

    });

}