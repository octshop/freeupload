//============== 附近商家分类 ===================//

/**------定义公共变量----**/

//AjaxURL
var mAjaxUrl = "../O2oAjax/ShopNearType";

var mBuyerUserID = ""; //买家UserID

var mFatherTypeID = ""; //商家第一级分类

//商品搜索内容
var mSearchKeyword = "";

//当前价格排序
var mGoodsPriceSort = "GoodsPriceAsc";

var mRegionCountyCode = ""; //区县的代号

var mShopTypeID = ""; //店铺分类
var mOrderBy = "Distance"; //排序类型



/**-----------初始化-----------**/

$(function () {

    //商家第一级分类
    mFatherTypeID = $("#hidFatherTypeID").val().trim();
    $("#ShopTypeNameB").html($("#hidShopTypeName").val().trim() + " - 附近商家");

    //加载商家第二级分类
    loadShopTypeList();

    //加载当前用户所在城市 的区县列表，没有登录则加载默认或已选择的
    loadCurUserCountyList(function () {

        //初始化分页滚动对象
        initPageMescroll();

    });



});


/**-----------自定义函数-----------**/


/**
 * 加载商家第二级分类 根据第一级分类
 * */
function loadShopTypeList() {

    //构造POST参数
    var dataPOST = {
        "Type": "1", "IsEntity": "true", "FatherTypeID": mFatherTypeID,
    };
    console.log(dataPOST);
    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: "../O2oAjax/ShopNear?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("加载商家第二级分类=" + reTxt);
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

    $("#AllWhereShow").hide();
    $("#AllWhereType").hide();
    $("#AllWhereType2").hide();
    $("#AllWhereType3").hide();

    if (_display == "none") {
        $("#AllWhereShow").show();
        $("#AllWhereType").show();
    }
}

/**
 * 第二个条件选项卡
 * */
function searchWhere2() {

    var _display = $("#AllWhereType2").css("display");

    $("#AllWhereShow").hide();
    $("#AllWhereType").hide();
    $("#AllWhereType2").hide();
    $("#AllWhereType3").hide();

    if (_display == "none") {

        $("#AllWhereShow").show();
        $("#AllWhereType2").show();
    }

}

/**
 * 第三个条件选项卡
 * */
function searchWhere3() {

    var _display = $("#AllWhereType3").css("display");

    $("#AllWhereShow").hide();
    $("#AllWhereType").hide();
    $("#AllWhereType2").hide();
    $("#AllWhereType3").hide();

    if (_display == "none") {

        $("#AllWhereShow").show();
        $("#AllWhereType3").show();
    }
}

/**
 * 选择分类
 */
function clickItemSearchWhere1(pShopTypeID) {

    mShopTypeID = pShopTypeID

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
 * 选择排序方式  距离 Distance  销量 SaleCount ，价格 GoodsPriceAsc,GoodsPriceDesc，
 */
function clickItemSearchWhere3(pOrderBy) {

    mOrderBy = pOrderBy;
  
    //重新加载数据
    reloadPageData("1");

    //清除选择样式 
    $(".goods-type-order").removeClass("goods-type-current");
    $(event.currentTarget).addClass("goods-type-current");
    $("#SearchWhere3Span").html($(event.currentTarget).html());

    //关闭弹出层
    searchWhere3();
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

    //mSearchWhereArr = mSearchKeyword + "^" + pPageOrderName + "^" + pIsOnlyDiscount;

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
        "OrderBy": mOrderBy,
        "RegionCountyCode": mRegionCountyCode,
        "LoadTypeExtra": "PreGoodsList",
        "ShopTypeID": mShopTypeID,
        "FatherTypeID": mFatherTypeID,
        
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
            //_spanBageEntity = "<span>实体店</span>";
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

        myJsVal += "<li class=\"goods-item\"  onclick=\"window.location.href='../Shop/Index?SID=" + dataPage.ShopID + "'\">";
        myJsVal += "<div class=\"shop-item-top\">";
        myJsVal += "    <div class=\"shop-item-left\">";
        myJsVal += "        <div>";
        myJsVal += "            <img src=\"//" + dataPage.ShopHeaderImg + "\" />";
        myJsVal += "        </div>";
        myJsVal += "        <div class=\"shop-name-right\">";
        myJsVal += "            <div class=\"shop-name-title\">" + dataPage.ShopName + " " + _spanBageEntity + "</div>";
        myJsVal += "            <div class=\"shop-name-extra\">";
        myJsVal += "                <span class=\"header-span-star\">";
        myJsVal += _starAppraiseHtml;
        myJsVal += "                </span>";
        myJsVal += "                <span class=\"header-span-val\">";
        myJsVal += "" + dataPageExtra.ShopAvgAppraiseScore + "分";
        myJsVal += "                </span>";
        myJsVal += "                <span>销量：" + dataPage.SumPaidCount + "</span>";
        myJsVal += "            </div>";
        myJsVal += "        </div>";
        myJsVal += "    </div>";
        myJsVal += "    <div class=\"shop-item-right\">";
        myJsVal += "    <div> 进店 >></div><div><b>&#165; " + formatNumberDotDigit(dataPage.ShopAllGoodsMinPrice,2) + "</b> 起</div>";
        myJsVal += "    </div>";
        myJsVal += "</div>";
        myJsVal += "<div class=\"shop-item-bottom\">";
        myJsVal += "    <ul class=\"shop-goods-ul\">";

        for (var j = 0; j < ShopPreGoodsList.length; j++) {
            myJsVal += "        <li>";
            myJsVal += "            <img src=\"//" + ShopPreGoodsList[j].ImgPathCover + "\" />";
            myJsVal += "            <div>&#165; " + ShopPreGoodsList[j].GoodsPrice + "</div>";
            myJsVal += "        </li>";
        }


        myJsVal += "    </ul>";
        myJsVal += "</div>";

        if (_itemBage != "") {
            myJsVal += "<div class=\"shop-item-bage\">";
            myJsVal += _itemBage;
            myJsVal += "</div>";
        }

        if (dataPage.IsEntity == "true") {
            myJsVal += "<div class=\"shop-item-addr\">";
            myJsVal += "    <div><b>地址:</b></div>";
            myJsVal += "    <div>";
            myJsVal += dataPage.RegionNameArr + "_" + dataPage.DetailAddr;

            if (dataPageExtra.DistanceKm != "" && dataPageExtra.DistanceKm != null) {
                myJsVal += "<span class=\"addr-distance-span\">" + dataPageExtra.DistanceKm + "km</span>";
            }


            myJsVal += "    </div>";
            myJsVal += "</div>";
        }

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
