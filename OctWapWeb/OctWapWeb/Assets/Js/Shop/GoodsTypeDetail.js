//=================店分类===================//

/**------定义公共变量----**/

//AjaxURL
var mAjaxUrl = "../ShopAjax/GoodsTypeDetail";

var mShopID = ""; //店铺ID
var mBuyerUserID = ""; //买家UserID
var mShopGoodsTypeID = "" //店铺商品分类ID

//当前价格排序
var mGoodsPriceSort = "GoodsPriceAsc";

/**------初始化------**/
$(function () {

    mShopID = $("#hidShopID").val().trim();
    mBuyerUserID = $("#hidBuyerUserID").val().trim();
    mShopGoodsTypeID = $("#hidShopGoodsTypeID").val().trim();

    //初始化搜索条件
    initSearchWhereArr("", "false");

    //初始化店铺商品分类信息
    initShopGoodsTypeMsg();

    //初始化分页滚动对象
    initPageMescroll();
});

/**
 * 初始化店铺商品分类信息ShopGoodsTypeID
 * */
function initShopGoodsTypeMsg() {

    if (mShopGoodsTypeID == "1") {
        $("#ShopGoodsNameB").html("店分类:未分类商品");
        return;
    }

    //构造POST参数
    var dataPOST = {
        "Type": "2", "ShopGoodsTypeID": mShopGoodsTypeID,
    };

    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: mAjaxUrl + "?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("初始化店铺商品分类信息=" + reTxt);
            if (reTxt != "") {

                var _jsonReTxt = JSON.parse(reTxt);

                $("#ShopGoodsNameB").html("店分类:" + _jsonReTxt.ShopGoodsTypeName +"");

            }
        }
    });
}

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
    $(".nav-item").removeClass("nav-item-current");


    //Commend 推荐 SaleCount 销量 GoodsPriceAsc 价格升序 GoodsPriceDesc 价格降序 WriteDate 新品 Discount 打折  GroupMsgCount 团购  SecKill  秒杀

    //推荐
    if (pTabNum == "1") {
        initSearchWhereArr("", "false");
        $(_navItemLabelArr[0]).addClass("nav-item-current");
    }
    else if (pTabNum == "2") //销量
    {
        initSearchWhereArr("SaleCount", "false");
        $(_navItemLabelArr[1]).addClass("nav-item-current");
    }
    else if (pTabNum == "3") //价格升序
    {
        initSearchWhereArr("GoodsPriceAsc", "false");
        $(_navItemLabelArr[2]).addClass("nav-item-current");
    }
    else if (pTabNum == "4") //价格降序
    {
        initSearchWhereArr("GoodsPriceDesc", "false");
        $(_navItemLabelArr[2]).addClass("nav-item-current");
    }
    else if (pTabNum == "5") //新品
    {
        initSearchWhereArr("WriteDate", "false");
        $(_navItemLabelArr[3]).addClass("nav-item-current");
    }
    else if (pTabNum == "6") //打折
    {
        initSearchWhereArr("Discount", "true");
        $(_navItemLabelArr[4]).addClass("nav-item-current");
    }
    else if (pTabNum == "7") //团购
    {
        initSearchWhereArr("GroupMsgCount", "true");
        $(_navItemLabelArr[5]).addClass("nav-item-current");
    }
    else if (pTabNum == "8") //秒杀
    {
        initSearchWhereArr("SecKill", "true");
        $(_navItemLabelArr[6]).addClass("nav-item-current");
    }

    if (pIsReload == undefined || pIsReload == null || pIsReload != "false") {

        $("#PageContentList").html("…加载中…");
        //重新加载数据
        reloadPageData("1");
    }

}


/**
 * 快捷加入购物车，不需要带规格属性ID
 * */
function addToSCartNoSpecPropID(pGoodsID) {

    //防止冒泡
    event.stopPropagation();


    //判断登录
    var _boolLogin = isBuyerLogin(false);
    if (_boolLogin == false) {
        return;
    }

    //构造POST参数
    var dataPOST = {
        "Type": "2", "GoodsID": pGoodsID,
    };

    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: "../ShopAjax/GoodsAll?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("快捷加入购物车=" + reTxt);
            if (reTxt != "") {

                var _jsonReTxt = JSON.parse(reTxt);

                //错误提示
                if (_jsonReTxt.ErrMsg != "" && _jsonReTxt.ErrMsg != null && _jsonReTxt.ErrMsg != undefined) {
                    if (_jsonReTxt.ErrMsg.indexOf("购物车失败") >= 0) {
                        _jsonReTxt.ErrMsg = "已加入购物车";
                    }
                    toastWin(_jsonReTxt.ErrMsg);
                    return;
                }
                //成功提示
                if (_jsonReTxt.Msg != "" && _jsonReTxt.Msg != null && _jsonReTxt.Msg != undefined) {
                    toastWin(_jsonReTxt.Msg);
                    return;
                }

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

    mSearchWhereArr = mShopID + "^" + pPageOrderName + "^" + pIsOnlyDiscount + "^" + mShopGoodsTypeID;

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

    //前台显示代码
    var myJsVal = "";
    for (var i = 0; i < dataPageArr.length; i++) {

        var dataPage = dataPageArr[i];
        var dataPageExtra = dataPageExtraArr[i];

        if (dataPage.GoodsTitle.length > 25) {
            dataPage.GoodsTitle = dataPage.GoodsTitle.substring(0, 24) + "...";
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
        if (dataPage.SkDiscount > 0) {
            _bageSpan = "秒杀";
        }
        if (dataPage.GroupDiscount > 0) {
            _bageSpan = "团购";
        }


        myJsVal += " <div class=\"goods-item\" onclick=\"window.location.href='../Goods/GoodsDetail?GID=" + dataPage.GoodsID + "'\">";
        myJsVal += " <div class=\"goods-img\">";
        myJsVal += "     <img src=\"//" + dataPage.ImgPathCover + "\" />";
        myJsVal += " </div>";
        myJsVal += " <div class=\"goods-name\">" + dataPage.GoodsTitle + "</div>";
        myJsVal += " <div class=\"goods-price\">";
        myJsVal += "     <b>&#165;" + formatNumberDotDigit(_goodsPrice, 2) + "</b>";
        myJsVal += "     <div>" + dataPage.PaidCount + "人付款</div>";
        myJsVal += " <img src=\"../Assets/Imgs/Icon/scart_add.png\" onclick=\"addToSCartNoSpecPropID('" + dataPage.GoodsID + "')\" />";
        myJsVal += " </div>";

        myJsVal += " <span class=\"goods-item-badge\">" + _bageSpan + "</span>";
        myJsVal += "</div>";

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



/**
 * 判断买家是否登录 
 * @param pIsWin 是否为窗口立即订购 [默认 false 不是窗口]
 * */
function isBuyerLogin(pIsWin) {

    if (mBuyerUserID == "" || mBuyerUserID == undefined) {

        if (pIsWin) {
            toastWinToDivCb("请先登录！", function () {

                //跳转到登录页面
                window.location.href = "../Login/Buyer?BackUrl=" + window.location.href + "";

            }, "SliderDownWin");
        }
        else {
            toastWinCb("请先登录！", function () {


                //跳转到登录页面
                window.location.href = "../Login/Buyer?BackUrl=" + window.location.href + "";
            });
        }

        return false;
    }
    return true;
}





