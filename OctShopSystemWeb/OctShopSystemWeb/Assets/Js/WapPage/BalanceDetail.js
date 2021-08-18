//==============余额明细=========================//

/**-----定义公共变量------**/
var mAjaxUrl = "../Settle/ShopIncomeExpense";


/**------初始化------**/
$(function () {

    //初始化日期选择器
    initSelDate();

    //初始化搜索分页组件
    initSearchContent();

});

/**
 * 初始化日期选择器
 * */
function initSelDate() {
    var currYear = (new Date()).getFullYear();
    var opt = {};
    opt.date = {
        preset: 'date',
        onSelect: function (valueText, inst) {
            //console.log("已选择回调");

            //搜索方法
            searchContent();

        },
        onCancel: function (event, inst) {
            //清除日期值
            $("#SearchKeyDateTxt").val("");

            //搜索方法
            searchContent();

        },
    };
    //opt.datetime = { preset : 'datetime', minDate: new Date(2012,3,10,9,22), maxDate: new Date(2014,7,30,15,44), stepMinute: 5  };
    opt.datetime = { preset: 'datetime' };
    opt.time = { preset: 'time' };
    opt.default = {
        theme: 'android-ics light', //皮肤样式
        display: 'modal', //显示方式 
        mode: 'scroller', //日期选择模式
        lang: 'zh',
        startYear: currYear - 10, //开始年份
        endYear: currYear + 10, //结束年份
    };

    $("#SearchKeyDateTxt").val('').scroller('destroy').scroller($.extend(opt['date'], opt['default']));
    //var optDateTime = $.extend(opt['datetime'], opt['default']);
    //var optTime = $.extend(opt['time'], opt['default']);
    //$("#appDateTime").mobiscroll(optDateTime).datetime(optDateTime);
    //$("#appTime").mobiscroll(optTime).time(optTime);
}



//===============================数据分页===============================//

var mSearchKeyDate = "";  //搜索内容日期
var mSearchKeyContent = "";  //搜索内容访客昵称

var mIsRefresh = true; //是否为刷新
var mescroll;
var mPageSize = 15; //每页的数据条数
var mCurPageDataJson = null; //当前分页的返回数据 Json对象
var mIntPageCurrent = 1; //当前的分页索引

/**
 * 初始化搜索分页组件
 * */
function initSearchContent() {



    //为“搜索”按钮定义单击事件
    $("#SearchKeyBtn").click(function () {
        //搜索方法
        searchContent();
    });

    //初始化分页滚动对象
    initPageMescroll();
}

/**
 * 搜索内容函数
 * */
function searchContent() {

    mSearchKeyDate = $("#SearchKeyDateTxt").val().trim();

    //判断搜索是否为空
    if (mSearchKeyDate == "" || mSearchKeyDate == undefined || mSearchKeyDate == null) {
        mSearchKeyDate = "";
    }

    //加载提示
    $("#PageContentList").html("<li style=\"text-align:center\">…数据加载中…</li>");

    //重新加载指定页的数据
    reloadPageData(1);
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
        "WriteDateStart": mSearchKeyDate,
        "WriteDateEndWap": mSearchKeyDate,
    };
    //正式发送GET请求
    $.ajax({
        type: "POST",
        url: mAjaxUrl + "?rnd=" + Math.random(),
        data: dataGET,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("数据搜索分页=" + reTxt);
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

        myJsVal += " <li>";
        myJsVal += " <div class=\"balance-item-left\">";
        myJsVal += "     <div>";
        myJsVal += "         <b>" + dataPage.InExMemo + "</b>";
        myJsVal += "     </div>";
        myJsVal += "     <div>";
        myJsVal += "         余额: " + dataPage.CurrentBalance + "";
        myJsVal += "     </div>";
        myJsVal += " </div>";
        myJsVal += " <div class=\"balance-item-right\">";
        myJsVal += "     <div>";
        myJsVal += "         " + dataPage.WriteDate + "";
        myJsVal += "     </div>";
        myJsVal += "     <div>";

        if (parseFloat(dataPage.IncomeSum) > 0) {
            myJsVal += "<b>+" + dataPage.IncomeSum + "</b>";
        }
        else {
            myJsVal += "<b>-" + dataPage.ExpenseSum + "</b>";
        }

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
 * @param pCallBackHttpFinish http请求完成返回
 */
function reloadPageData(pCurrentPageNum, pCallBackHttpFinish) {

    if (pCallBackHttpFinish == undefined || pCallBackHttpFinish == null) {
        pCallBackHttpFinish = function () { };
    }

    //重新刷新
    mIsRefresh = true;

    //联网加载数据
    getListDataFromNet(pCurrentPageNum, mPageSize, function (mCurPageDataJson) {

        //联网成功的回调,隐藏下拉刷新的状态
        mescroll.endSuccess();

        //------这里是操作前台显示代码-----//
        if (mCurPageDataJson != null && mCurPageDataJson != undefined && mCurPageDataJson != "") {
            pageSuccess(mCurPageDataJson);

            pCallBackHttpFinish();
        }


    }, function () {
        //联网失败的回调,隐藏下拉刷新的状态
        mescroll.endErr();

        pCallBackHttpFinish();
    });

}



//===============================数据分页===============================//



