//=============附近商家=====================//

/**------定义公共变量----**/

//AjaxURL
var mAjaxUrl = "../O2oAjax/ShopNear";

var mBuyerUserID = ""; //买家UserID

var mSearchKeyword = ""; //搜索内容


/**------初始化------**/
$(function () {



    //加载O2o店铺类目 (两级分类)
    loadShopTypeList(function () {

        //初始化 导航条
        initSliderNav();

    });

    //初始化分页滚动对象
    initPageMescroll();



});

/**------自定义函数------**/

/**
 * 加载O2o店铺类目 (两级分类)
 * */
function loadShopTypeList(pCallBack) {

    //构造POST参数
    var dataPOST = {
        "Type": "1", "IsEntity": "true", "FatherTypeID": "0",
    };
    console.log(dataPOST);
    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: mAjaxUrl + "?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("加载O2o店铺类目 (两级分类)=" + reTxt);
            if (reTxt != "") {
                var _jsonReTxt = JSON.parse(reTxt);

                var ShopTypeList = _jsonReTxt.ShopTypeList;

                //取数组的余数
                var yuIconNum = ShopTypeList.length % 10;
                console.log("yuIconNum=" + yuIconNum);
                //循环数
                var _forNum = ShopTypeList.length + (10 - yuIconNum);

                console.log("_forNum=" + _forNum);

                //循环构造显示代码
                var myJsVal = "";
                var _isLi = "";
                for (var i = 0; i < _forNum; i++) {

                    //这里重要，分栏导航构造
                    if (i % 10 == 0) {

                        if (_isLi == "") {
                            _isLi = "one";
                            myJsVal += "<li>";
                        }
                        else {
                            myJsVal += "</li><li>";
                            _isLi = "";
                        }
                    }


                    if (ShopTypeList[i] == undefined) {
                        myJsVal += "<a class=\"nav-item\" href=\"#\"> &nbsp; </a>";
                    }
                    else {
                        myJsVal += "<a class=\"nav-item\" href=\"../O2o/ShopNearType?STID=" + ShopTypeList[i].ShopTypeID + "&STIDN=" + ShopTypeList[i].ShopTypeName + "\">";
                        myJsVal += "<img src=\"//" + ShopTypeList[i].TypeIcon + "\" />";
                        myJsVal += "" + ShopTypeList[i].ShopTypeName + "";
                        myJsVal += "</a>";
                    }

                }
                myJsVal += "</li>";
                //显示代码插入前台
                $("#content-slider-2").html(myJsVal);



                //回调函数
                pCallBack();
            }
        }
    });
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
 * @param pPageOrderName Commend 推荐 SaleCount 销量 GoodsPriceAsc 价格升序 GoodsPriceDesc 价格降序 WriteDate 新品 Discount 打折  GroupMsgCount 团购  SecKill  秒杀
 * @param pIsOnlyDiscount  是否只加载打折的商品 ( true / false )
 * */
function initSearchWhereArr(pPageOrderName, pIsOnlyDiscount) {

    //SearchKeyword + "^" + pPageOrderName + "^" + pIsOnlyDiscount 

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
        "SearchKeyword": mSearchKeyword,
        "OrderBy": "Distance",
        "LoadTypeExtra": "NoPreGoodsList",
    };
    //正式发送GET请求
    $.ajax({
        type: "POST",
        url: "../MallAjax/SearchShopResultO2o?rnd=" + Math.random(),
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

        var ShopPreGoodsList = dataPageExtra.ShopPreGoodsList;

        var _spanBageEntity = "";
        if (dataPage.IsEntity == "true") {
            _spanBageEntity = "<span>实体店</span>";
        }

        var _starAppraiseHtml = getStarAppraiseHtml(dataPageExtra.ShopAvgAppraiseScore);

        //徽章
        var _itemBage = "";
        if (dataPage.CountSecKill > 0) {
            _itemBage += "<span>秒杀</span>"
        }
        if (dataPage.CountDiscount > 0) {
            _itemBage += "<span>打折</span>"
        }
        if (dataPage.GroupMsgCount > 0) {
            _itemBage += "<span>团购</span>"
        }
        if (dataPage.CountActivity > 0) {
            _itemBage += "<span>活动</span>"
        }
        if (dataPage.CountLuckyDraw > 0) {
            _itemBage += "<span>抽奖</span>"
        }
        if (dataPage.CountPresent > 0) {
            _itemBage += "<span>礼品</span>"
        }

        var _DistanceKm = "";
        if (dataPageExtra.DistanceKm != "" && dataPageExtra.DistanceKm != undefined) {
            _DistanceKm = dataPageExtra.DistanceKm + "km";
        }

        myJsVal += "<a class=\"commend-item\" href=\"../Shop/Index?SID=" + dataPage.ShopID + "\">";
        myJsVal += " <div class=\"commend-item-img\">";
        myJsVal += "     <img src=\"//" + dataPage.ShopHeaderImg + "\" />";
        myJsVal += " </div>";
        myJsVal += " <div class=\"commend-item-msg\">";
        myJsVal += "     <div class=\"item-msg-title\">";
        myJsVal += "         <span>" + dataPage.ShopName + "</span>";
        myJsVal += "         <span class=\"item-msg-distance\">" + _DistanceKm + "</span>";
        myJsVal += "     </div>";
        myJsVal += "     <div class=\"item-msg-appraise\">";
        myJsVal += "" + _starAppraiseHtml + " " + dataPageExtra.ShopAvgAppraiseScore + "分";
        myJsVal += "     </div>";
        myJsVal += "     <div class=\"item-msg-badge\">";
        myJsVal += _itemBage;
        myJsVal += "     </div>";
        myJsVal += "     <div class=\"item-msg-price\">";
        myJsVal += "         <span><b>&#165; " + dataPage.ShopAllGoodsMinPrice + "</b> 起</span>";
        myJsVal += "         <span class=\"item-msg-sale\">已售：" + dataPage.SumPaidCount + "</span>";
        myJsVal += "     </div>";
        myJsVal += " </div>";
        myJsVal += "</a>";


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





//===========================公共函数=============================//


/**
 * 初始化 导航条
 * */
var _sliderNav = null;
function initSliderNav() {
    //导航条
    _sliderNav = $("#content-slider-2").lightSlider({
        speed: 500,  //过渡动画的持续时间，单位毫秒
        auto: false, //如果设置为true，幻灯片将自动播放
        loop: true, //false表示在播放到最后一帧时不会跳转到开头重新播放
        slideMargin: 0, //每一个slide之间的间距
        item: 1, //同时显示的slide的数量
        keyPress: true,
        pager: true, //是否开启圆点导航
        controls: false, //如果设置为false，prev/next按钮将不会被显示
        pause: 4000, //停留多久
        onSliderLoad: function (data) //幻灯片被加载后立刻执行
        {
            var _curSliderNum = data.getCurrentSlideCount();
            var _totalSliderNum = data.getTotalSlideCount();
            //$("#SliderCountDiv").html(_curSliderNum + "/" + _totalSliderNum);
        },
        onAfterSlide: function (data) { //每一个slide过渡动画之后被执行
            //console.log(data);
            //console.log("当前Sidler索引：" + data.getCurrentSlideCount());
            //console.log("总的Slider数：" + data.getTotalSlideCount());
            var _curSliderNum = data.getCurrentSlideCount();
            var _totalSliderNum = data.getTotalSlideCount();
            //$("#SliderCountDiv").html(_curSliderNum + "/" + _totalSliderNum);
        }
    });
}



/**
 * 根据评分得到星星评价显示
 * @param {any} pAvgAppraiseScore 评分数
 */
function getStarAppraiseHtml(pAvgAppraiseScore) {

    var myJsVal = "";


    if (pAvgAppraiseScore >= 1 && pAvgAppraiseScore < 2) {
        myJsVal += "<img src=\"../Assets/Imgs/Icon/appraise_star.png\" />";
        myJsVal += "<img src=\"../Assets/Imgs/Icon/appraise_star_gray.png\" />";
        myJsVal += "<img src=\"../Assets/Imgs/Icon/appraise_star_gray.png\" />";
        myJsVal += "<img src=\"../Assets/Imgs/Icon/appraise_star_gray.png\" />";
        myJsVal += "<img src=\"../Assets/Imgs/Icon/appraise_star_gray.png\" />";
    }
    else if (pAvgAppraiseScore >= 2 && pAvgAppraiseScore < 3) {
        myJsVal += "<img src=\"../Assets/Imgs/Icon/appraise_star.png\" />";
        myJsVal += "<img src=\"../Assets/Imgs/Icon/appraise_star.png\" />";
        myJsVal += "<img src=\"../Assets/Imgs/Icon/appraise_star_gray.png\" />";
        myJsVal += "<img src=\"../Assets/Imgs/Icon/appraise_star_gray.png\" />";
        myJsVal += "<img src=\"../Assets/Imgs/Icon/appraise_star_gray.png\" />";
    }
    else if (pAvgAppraiseScore >= 3 && pAvgAppraiseScore < 4) {
        myJsVal += "<img src=\"../Assets/Imgs/Icon/appraise_star.png\" />";
        myJsVal += "<img src=\"../Assets/Imgs/Icon/appraise_star.png\" />";
        myJsVal += "<img src=\"../Assets/Imgs/Icon/appraise_star.png\" />";
        myJsVal += "<img src=\"../Assets/Imgs/Icon/appraise_star_gray.png\" />";
        myJsVal += "<img src=\"../Assets/Imgs/Icon/appraise_star_gray.png\" />";
    }
    else if (pAvgAppraiseScore >= 4 && pAvgAppraiseScore < 5) {
        myJsVal += "<img src=\"../Assets/Imgs/Icon/appraise_star.png\" />";
        myJsVal += "<img src=\"../Assets/Imgs/Icon/appraise_star.png\" />";
        myJsVal += "<img src=\"../Assets/Imgs/Icon/appraise_star.png\" />";
        myJsVal += "<img src=\"../Assets/Imgs/Icon/appraise_star.png\" />";
        myJsVal += "<img src=\"../Assets/Imgs/Icon/appraise_star_gray.png\" />";
    }
    else if (pAvgAppraiseScore >= 5) {
        myJsVal += "<img src=\"../Assets/Imgs/Icon/appraise_star.png\" />";
        myJsVal += "<img src=\"../Assets/Imgs/Icon/appraise_star.png\" />";
        myJsVal += "<img src=\"../Assets/Imgs/Icon/appraise_star.png\" />";
        myJsVal += "<img src=\"../Assets/Imgs/Icon/appraise_star.png\" />";
        myJsVal += "<img src=\"../Assets/Imgs/Icon/appraise_star.png\" />";
    }
    else {
        myJsVal += "<img src=\"../Assets/Imgs/Icon/appraise_star_gray.png\" />";
        myJsVal += "<img src=\"../Assets/Imgs/Icon/appraise_star_gray.png\" />";
        myJsVal += "<img src=\"../Assets/Imgs/Icon/appraise_star_gray.png\" />";
        myJsVal += "<img src=\"../Assets/Imgs/Icon/appraise_star_gray.png\" />";
        myJsVal += "<img src=\"../Assets/Imgs/Icon/appraise_star_gray.png\" />";
    }
    return myJsVal;
}


