//==================抽奖信息-客户端========================//


/**-----定义公共变量------**/
var mAjaxUrl = "../BuyerAjax/LuckyDrawMsg";

//搜索条件
var mSearchKey = "";


/**------初始化------**/
$(function () {

    //初始化分页滚动对象
    initPageMescroll();

});


//===============数据分页=================//

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

    //记录当前的分页索引
    mIntPageCurrent = pageNum;

    //构造GET参数
    var dataGET = {
        "Type": "1",
        "PageCurrent": pageNum,
        "SearchKey": mSearchKey,
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

    var dataPageArr1 = curPageDataJson.DataPage1;
    var dataPageArr2 = curPageDataJson.DataPage2;
    var dataPageArr3 = curPageDataJson.DataPage3;
    var dataPageExtraArr = curPageDataJson.DataPageExtra;


    //前台显示代码
    var myJsVal = "";
    for (var i = 0; i < dataPageArr1.length; i++) {

        var dataPage1 = dataPageArr1[i];
        var dataPage2 = dataPageArr2[i];
        var dataPage3 = dataPageArr3[i];
        var dataPageExtra = dataPageExtraArr[i];

        if (dataPage2.LuckydrawTitle.length >= 23) {
            dataPage2.LuckydrawTitle = dataPage2.LuckydrawTitle.substring(0, 23) + "…";
        }

        myJsVal += " <li>";        myJsVal += " <div class=\"shop-msg\" onclick=\"window.location.href='../shop/index?SID=" + dataPage2.SponsorShopID + "'\">";        myJsVal += "     <div class=\"shop-msg-left\">";        myJsVal += "         <img src=\"../Assets/Imgs/Icon/shop.png\" />";        myJsVal += "         " + dataPage2.SponsorName + "";        myJsVal += "         <img src=\"../Assets/Imgs/Icon/arrows_right.png\" />";        myJsVal += "     </div>";        myJsVal += "     <div class=\"shop-msg-right\">";        if (dataPage2.LuckydrawStatus == "未开奖") {            myJsVal += "未开奖";
        }        else if (dataPage2.LuckydrawStatus == "已开奖") {            if (dataPage3.AwardsItem != "" && dataPage3.AwardsItem != null) {                myJsVal += "<span>您中奖啦</span>";                if (dataPage2.ExpressType == "shop") {                    if (dataPage3.IsGetPrize == "true") {                        myJsVal += "&nbsp;已中奖-已领取";
                    }                    else {                        myJsVal += "&nbsp;已中奖-待领取";
                    }                   
                }                else {                    if (dataPage3.IsGetPrize == "true") {                        myJsVal += "&nbsp;已中奖-已发货";
                    }                    else {                        myJsVal += "&nbsp;已中奖-待发货";
                    }                }            }
            else {
                myJsVal += "已开奖";
            }
        }        myJsVal += "     </div>";        myJsVal += " </div>";        myJsVal += " <div class=\"goods-msg\" onclick=\"window.location.href='../Buyer/LuckyDrawDetail?LID=" + dataPage1.LuckydrawID + "'\">";        myJsVal += "     <div class=\"goods-msg-left\">";        myJsVal += "         <img src=\"//" + dataPage2.CoverImgUrl + "\" />";        myJsVal += "     </div>";        myJsVal += "     <div class=\"goods-msg-right\">";        myJsVal += "         <div class=\"goods-msg-title\">";        myJsVal += "             " + dataPage2.LuckydrawTitle + "";        myJsVal += "         </div>";        myJsVal += "         <div class=\"goods-msg-extra\">";        if (dataPage3.AwardsItem != "" && dataPage3.AwardsItem != null) {            myJsVal += "奖项：<font color=\"#FF6A00\">" + dataPage3.AwardsItem + "</font><br />";        }        else {            myJsVal += "奖项：<font color=\"#FF6A00\">未中奖</font><br />";
        }        if (dataPage2.ExpressType == "shop") {            myJsVal += "配送方式：到店消费或自取<br />";
        }        else {            myJsVal += "配送方式：快递发货<br />";
        }        myJsVal += "参与时间：" + dataPage1.WriteDate + "";        myJsVal += "         </div>";        myJsVal += "     </div>";        myJsVal += " </div>";        myJsVal += "</li>";
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
        mescroll.endByPage(curPageData.DataPage1.length, curPageData.PageSum); //必传参数(当前页的数据个数, 总页数)

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


//===================数据分页=================//


/******************************自定义函数********************************/

/**
 * 切换选项卡
 * @param {any} pTabNum 选项卡次序数 1开始
 */
function chgTab(pTabNum) {

    //获取选项卡
    var _tabLabelArr = $(".oct-header-sub-a");

    //去掉所有当前选择
    for (var i = 0; i < _tabLabelArr.length; i++) {
        $(_tabLabelArr[i]).removeClass("oct-header-sub-curren-a");

       
    }

    if (pTabNum == "1") {
        $(_tabLabelArr[0]).addClass("oct-header-sub-curren-a");

        mSearchKey = "";
    }
    else if (pTabNum == "2") {
        $(_tabLabelArr[1]).addClass("oct-header-sub-curren-a");

        mSearchKey = "中奖的";
       
    }
    else if (pTabNum == "3") {
        $(_tabLabelArr[2]).addClass("oct-header-sub-curren-a");

        mSearchKey = "已开奖";
       
    }
    else if (pTabNum == "4") {
        $(_tabLabelArr[3]).addClass("oct-header-sub-curren-a");

        mSearchKey = "未开奖";
    }

    //重新加载数据
    reloadPageData('1');

}