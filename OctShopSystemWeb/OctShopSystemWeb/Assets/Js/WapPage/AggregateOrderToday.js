/*=================收单提醒====================*/

/**-----定义公共变量------**/
//AjaxURL
var mAjaxUrl = "../Aggregate/AggregateOrderMsg";

//当前最近加载的扫码支付订单 交易号 
var mCurRecentBillNumber = "";
//定义器
var mTimer = null;

/**------初始化------**/

$(function () {


    //初始化定时器
    initTimer();

    //初始化分页滚动对象
    initPageMescroll();

});



//========================自定义函数==============================//

/**
 * 初始化定时器
 * */
function initTimer() {

    clearTimeout(mTimer);
    mTimer = undefined
    mTimer = null;
    mTimer = setTimeout(function () {

        //加载当前最近的扫码支付订单信息
        loadRecentAggregateOrder();

    }, 4000);


}

/**
 * 加载当前最近的扫码支付订单信息
 * */
function loadRecentAggregateOrder() {

    //构造POST参数
    var dataPOST = {
        "Type": "3",
    };
    //console.log(dataPOST);

    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: mAjaxUrl + "?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            //console.log("加载当前最近的扫码支付订单信息=" + reTxt);
            if (reTxt != "") {

                //初始化定时器
                initTimer();

                var _jsonReTxt = JSON.parse(reTxt);
                var AggregateOrder = _jsonReTxt.AggregateOrderList[0];
                var UserMsg = _jsonReTxt.UserMsg;

                if (AggregateOrder.BillNumber != "" && AggregateOrder.BillNumber != null && AggregateOrder.BillNumber != undefined) {

                    //新的支付订单生成
                    if (mCurRecentBillNumber != AggregateOrder.BillNumber) {

                        //当前交易号
                        mCurRecentBillNumber = AggregateOrder.BillNumber;

                        //----显示代码赋值----//
                        $("#OrderPrice").html("&#165; " + AggregateOrder.OrderPrice)
                        $("#HeaderImg").attr("src", UserMsg.HeaderImg);
                        $("#UserNickBindMobile").html("" + UserMsg.UserNick + "<br />(" + UserMsg.BindMobile + ")");
                        $("#PayWayName").html("" + AggregateOrder.OrderStatus + " (" + _jsonReTxt.PayWayName + ")");
                        $("#PayTime").html(AggregateOrder.PayTime);

                        //执行动画
                        $("#RealNewOrderMsg").addClass("am-animation-shake").one($.AMUI.support.animation.end, function () {
                            $("#RealNewOrderMsg").removeClass("am-animation-shake");
                        });
                        try {
                            //播放音效
                            var audio = new Audio("../Assets/Sound/money.mp3");
                            audio.play();
                            audio = null;
                            audio = undefined;
                        }
                        catch (e) { };


                        //--重新加载数据--//
                        reloadPageData('1');

                    }


                }

            }
        },
        error: function (xhr, errorTxt, status) {
            console.log("异步请求错误，errorTxt=" + errorTxt + " | status=" + status);
            return;
        }
    });

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

    //记录当前的分页索引
    mIntPageCurrent = pageNum;

    //构造GET参数
    var dataGET = {
        "Type": "1",
        "PageCurrent": pageNum,
        "PayTime": getTodayDate(),
    };
    //正式发送GET请求
    $.ajax({
        type: "POST",
        url: mAjaxUrl + "?rnd=" + Math.random(),
        data: dataGET,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("Ajax返回的值：" + reTxt);
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

        myJsVal += "<li onclick=\"window.location.href='../WapPage/OrderAggreDetail?AOID=" + dataPage.AggregateOrderID + "'\">";
        myJsVal += " <div class=\"order-user-header\">";
        myJsVal += "     <img src=\"" + dataPageExtra.HeaderImg + "\" />";
        myJsVal += " </div>";
        myJsVal += " <div class=\"order-user-msg\">";
        myJsVal += "     <div class=\"order-nick-name\">";
        myJsVal += "         " + dataPageExtra.BuyerNickName + " (" + dataPageExtra.BindMobile + ")";
        myJsVal += "     </div>";
        myJsVal += "     <div class=\"order-pay-price\">";
        myJsVal += "         <b>&#165;" + dataPage.OrderPrice + "</b> - " + dataPageExtra.PayWayName + " -  " + dataPage.OrderTime + "";
        myJsVal += "     </div>";
        myJsVal += "     <div class=\"order-pay-extra\">";
        myJsVal += "         订单ID：" + dataPage.AggregateOrderID + " ，状态：" + dataPage.OrderStatus + "";
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



