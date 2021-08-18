//================我的礼品======================//


/**-----定义公共变量------**/
var mAjaxUrl = "../BuyerAjax/MyPresentOrder";

var mOrderStatus = ""; //当前订单状态


/**------初始化------**/
$(function () {

    mOrderStatus = $("#hidOrderStatus").val().trim();

    //初始化选项卡
    initTabData();

    //初始化分页滚动对象
    initPageMescroll();

});

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
        "OrderStatus": mOrderStatus,
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

        var _shopHeaderImg = "../Assets/Imgs/Icon/shop_order.png";
        if (dataPageExtra.ShopHeaderImg != null && dataPageExtra.ShopHeaderImg != "") {
            _shopHeaderImg = "//" + dataPageExtra.ShopHeaderImg;
        }

        myJsVal += "<li class=\"order-item\">";        myJsVal += " <div class=\"order-item-top\">";        myJsVal += "     <a href=\"../Shop/Index?SID=" + dataPageExtra.ShopID + "\"><img src=\"//" + dataPageExtra.ShopHeaderImg + "\" />" + dataPageExtra.ShopName +"</a>";        myJsVal += "     <div class=\"order-status-txt\">";        myJsVal += "" + dataPage.OrderStatus +"";        myJsVal += "     </div>";        myJsVal += " </div>";        myJsVal += " <div class=\"order-item-mid\" onclick=\"window.location.href=\'../PresentOrder/PresentOrderDetail?POID=" + dataPage.PstOrderID + "\'\">";        myJsVal += "     <a href=\"#\" class=\"order-goods-item\">";        myJsVal += "         <div class=\"goods-item-left\">";        myJsVal += "             <img src=\"//" + dataPageExtra.PresentCoverImgURL +"\" />";        myJsVal += "         </div>";        myJsVal += "         <div class=\"goods-item-mid\">";        myJsVal += "             <span class=\"goods-item-title\">" + dataPage.PresentTitleArr +"</span>";        myJsVal += "         </div>";        myJsVal += "         <div class=\"goods-item-right\">";        myJsVal += "             <span class=\"goods-item-price\">" + dataPage.PresentPriceArr +"</span>";        myJsVal += "             <span class=\"goods-item-ordernum\">&times;1</span>";        myJsVal += "         </div>";        myJsVal += "     </a>";        myJsVal += " </div>";        myJsVal += " <div class=\"order-item-bottom\">";        myJsVal += "   实付积分：<b>" + formatNumberDotDigit(dataPage.OrderPrice,2) + "</b>";        myJsVal += " </div>";        myJsVal += " <div class=\"order-item-btn\">";        myJsVal += "<input type=\"button\" onclick=\"window.location.href='../Buyer/ComplainSubmit?POID=" + dataPage.PstOrderID +"'\" value=\"投诉\" />";        if (dataPage.OrderStatus == "待收货") {            myJsVal += "<input type=\"button\" value=\"确认收货\" onclick=\"confirmReceiPresentOrderBuyer('" + dataPage.PstOrderID + "', '" + dataPage.ShopUserID +"')\" />";
        }        myJsVal += " </div>";        myJsVal += "</li>";    }

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


/**------自定义函数------**/

/**
 * 初始化选项卡
 * */
function initTabData() {

    var _tabIndex = 0

    if (mOrderStatus == "待付款") {
        _tabIndex = 1;
    }
    else if (mOrderStatus == "待发货") {
        _tabIndex = 2;
    }
    else if (mOrderStatus == "待消费/自取") {
        _tabIndex = 3;
    }
    else if (mOrderStatus == "待收货") {
        _tabIndex = 4;
    }

    //删除所有焦点样式 
    $(".oct-header-sub-a").removeClass("oct-header-sub-curren-a");
    //设置当前焦点样式
    $("#chgTab_" + _tabIndex).addClass("oct-header-sub-curren-a");

}

/**
 * 切换订单的状态
 * @param {any} pOrderStatus 订单的状态
 */
function chgTab(pOrderStatus, pLabelIndex) {

    mOrderStatus = pOrderStatus;

    //删除所有焦点样式 
    $(".oct-header-sub-a").removeClass("oct-header-sub-curren-a");
    //设置当前焦点样式
    $("#chgTab_" + pLabelIndex).addClass("oct-header-sub-curren-a");

    //重新初下拉刷新数据
    downCallback(mescroll);
}


/**
 * 买家 确认收货 -快递发货
 * @param {any} pPstOrderID
 * @param {any} pBuyerUserID
 */
function confirmReceiPresentOrderBuyer(pPstOrderID, pShopUserID) {

    confirmWin("确认收货？", function () {

        //构造POST参数
        var dataPOST = {
            "Type": "4", "PstOrderID": pPstOrderID, "ShopUserID": pShopUserID,
        };
        console.log(dataPOST);
        //正式发送异步请求
        $.ajax({
            type: "POST",
            url: "../PresentOrderAjax/PresentOrderDetail?rnd=" + Math.random(),
            data: dataPOST,
            dataType: "html",
            success: function (reTxt, status, xhr) {
                console.log("买家确认收货=" + reTxt);
                if (reTxt != "") {
                    var _jsonReTxt = JSON.parse(reTxt);

                    if (_jsonReTxt.ErrMsg != "" && _jsonReTxt.ErrMsg != null && _jsonReTxt.ErrMsg != undefined) {
                        toastWin(_jsonReTxt.ErrMsg);
                        return;
                    }

                    if (_jsonReTxt.Msg != "" && _jsonReTxt.Msg != null && _jsonReTxt.Msg != undefined) {
                        toastWinCb(_jsonReTxt.Msg, function () {
                            //重新加载数据
                            reloadPageData(mIntPageCurrent);
                        });
                        return;
                    }
                }
            }
        });

    });
}


