//================货到付款订单=============================//

/**-----定义公共变量------**/
var mAjaxUrl = "../BuyerAjax/MyOrder";

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
        "PayWay": "PayDelivery",
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

        if (dataPage.OrderStatus == "待确认") {
            dataPage.OrderStatus = "货到付款-待确认";
        }

        myJsVal += "<li class=\"order-item\">";
        myJsVal += "                    <div class=\"order-item-top\">";
        myJsVal += "                        <a href=\"../Shop/Index?SID=" + dataPageExtra.ShopID + "\"><img src=\"" + _shopHeaderImg + "\" />" + dataPageExtra.ShopName + "</a>";
        myJsVal += "                        <div class=\"order-status-txt\">";
        myJsVal += "                            " + dataPage.OrderStatus + "";
        myJsVal += "                        </div>";
        myJsVal += "                    </div>";
        myJsVal += "                    <div class=\"order-item-mid\" onclick=\"window.location.href=\'../Order/OrderDetail?OID=" + dataPage.OrderID + "\'\">";

        myJsVal += xhtmlGoodsItemList(dataPage.GoodsIDArr, dataPage.GoodsTitleArr, dataPage.GoodsSpecIDOrderNumArr, dataPage.GoodsUnitPriceArr, dataPage.IsSpecParamArr, dataPageExtra.SpecNameArr, dataPageExtra.GoodsCoverImgPathArr);

        //myJsVal += "                        <a href=\"#\" class=\"order-goods-item\">";
        //myJsVal += "                            <div class=\"goods-item-left\">";
        //myJsVal += "                                <img src=\"~/Assets/Imgs/01.jpg\" />";
        //myJsVal += "                            </div>";
        //myJsVal += "                            <div class=\"goods-item-mid\">";
        //myJsVal += "                                <span class=\"goods-item-title\">商品名称呀商品名称呀商品名称呀商品名称呀商品名称呀商品名称呀</span>";
        //myJsVal += "                                <span class=\"goods-item-spec\">规格尺寸规格尺寸</span>";
        //myJsVal += "                            </div>";
        //myJsVal += "                            <div class=\"goods-item-right\">";
        //myJsVal += "                                <span class=\"goods-item-price\">&#165;2354.43</span>";
        //myJsVal += "                                <span class=\"goods-item-ordernum\">&times; 3</span>";
        //myJsVal += "                            </div>";
        //myJsVal += "                        </a>";

        myJsVal += "                    </div>";
        myJsVal += "                    <div class=\"order-item-bottom\">";

        if (dataPage.SkGoodsID != 0 && dataPage.SkGoodsID != "0") {
            myJsVal += "<span class=\"badge-label\">秒杀</span>";
        }

        if (dataPage.GroupID != 0 && dataPage.GroupID != "0") {
            myJsVal += "<span class=\"badge-label\">拼团</span>";
        }

        myJsVal += "                        共<span>" + countGoodsNum(dataPage.GoodsIDArr) + "</span>件商品，实付款：<b>&#165; " + dataPage.OrderPrice + "</b>";
        myJsVal += "                    </div>";
        myJsVal += "                    <div class=\"order-item-btn\">";


        //根据不同订单状态加载数据
        //订单状态 [ 待付款]，[ 待确认(货到付款)]，[到店付], [转账]， [取消] ,[待消费/自取] ,[待发货]，[退款中]，[退款成功]，[待收货],[待评价]，[完成]
        myJsVal += xhtmlOrderStatusBtnList(dataPage.OrderID, dataPage.BillNumber, dataPage.ShopUserID, dataPage.OrderStatus, dataPage.PayWay, dataPage.IsDelayFinishTime);

        //myJsVal += "                        <input type=\"button\" onclick=\"window.location.href=\'../Buyer/ComplainSubmit\'\" value=\"投诉\" />";
        //myJsVal += "                        <input type=\"button\" value=\"立即付款\" />";
        //myJsVal += "                        <input type=\"button\" value=\"确认收货\" />";
        //myJsVal += "                        <input type=\"button\" value=\"评价\" onclick=\"window.location.href=\'../Buyer/AppraiseCenter\'\" />";



        myJsVal += "                    </div>";
        myJsVal += "                </li>";

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
 * ----------构造订单状态的操作按钮列表 显示代码----------------
 * pOrderStatus 订单状态 [ 待付款]，[ 待确认(货到付款)]，[到店付], [转账]， [取消] ,[待消费/自取] ,[待发货]，[退款中]，[退款成功]，[待收货],[待评价]，[完成]
 * @pPayWay 支付方式 （WeiXinPay [微信支付], Alipay[支付宝] , Transfer[银行转账] , Offline[线下付款(到店付)], PayDelivery [货到付款]  Balance[余额支付]）
 * */
function xhtmlOrderStatusBtnList(pOrderID, pBillNumber, pShopUserID, pOrderStatus, pPayWay, pIsDelayFinishTime) {

    console.log("pOrderStatus=" + pOrderStatus);

    //按钮Html
    var _xhtmlBtnList = "<input type=\"button\" onclick=\"window.location.href='../Buyer/ComplainSubmit?OID=" + pOrderID + "'\" value=\"投诉\" />";

    if (pOrderStatus == "待付款" || pOrderStatus.indexOf("待确认") >= 0 || pOrderStatus == "到店付" || pOrderStatus == "转账") {

        //构造支付显示文字
        var _payName = "立即付款";
        if (pOrderStatus.indexOf("待确认") >= 0 || pOrderStatus == "到店付" || pOrderStatus == "转账") {
            _payName = "选择其他支付";
        }

        _xhtmlBtnList += "<input type=\"button\" onclick=\"cancelOrder('" + pOrderID + "')\" value=\"取消订单\" />";
        _xhtmlBtnList += "<input type=\"button\" onclick=\"window.location.href='../Pay/OrderPay?OID=" + pOrderID + "'\" value=\"" + _payName + "\" />";

        console.log(_xhtmlBtnList);

        //转账付款方式
        if (pOrderStatus == "转账") {

            //转账按钮显示名称
            var _btnTransferName = "转账汇款";

            _xhtmlBtnList += "<input type=\"button\" onclick=\"window.location.href='../Order/BankTransfer?BillNum=" + pBillNumber + "'\" value=\"" + _btnTransferName + "\" />";
        }
    }
    else if (pOrderStatus == "待发货") {

        if (pPayWay.indexOf("货到付款") < 0) {

            _xhtmlBtnList += "<input type=\"button\" onclick=\"applyRefund('" + pOrderID + "')\" value=\"申请退款\" />";
        }
        _xhtmlBtnList += "<input type=\"button\" onclick=\" remindSendGoods('" + pOrderID + "', '" + pShopUserID + "')\" value=\"提醒发货\" />";

    }
    else if (pOrderStatus == "待消费/自取") {

        //_xhtmlBtnList += "<input type=\"button\" onclick=\"window.location.reload()\" value=\"刷新订单\" />";
        if (pPayWay.indexOf("货到付款") < 0) {
            _xhtmlBtnList += "<input type=\"button\" onclick=\"applyRefund('" + pOrderID + "')\" value=\"申请退款\" />";
        }
    }
    else if (pOrderStatus == "待收货") {

        _xhtmlBtnList += "<input type=\"button\" onclick=\"window.location.href='../Order/ExpressDetail?OID=" + pOrderID + "'\" value=\"查看物流\" />";

        if (pIsDelayFinishTime != "true") {
            _xhtmlBtnList += "<input type=\"button\" onclick=\"delayReceiOrder('" + pOrderID + "')\" value=\"延长收货\" />";
        }

        _xhtmlBtnList += "<input type=\"button\" onclick=\"confirmReceiOrder('" + pOrderID + "')\" value=\"确认收货\" />";
    }
    else if (pOrderStatus == "待评价") {
        _xhtmlBtnList += "<input type=\"button\" onclick=\"window.location.href='../AfterSale/AsMulSel?OID=" + pOrderID + "'\" value=\"申请售后\" />";
        _xhtmlBtnList += "<input type=\"button\" onclick=\"window.location.href='../Buyer/AppraiseForm?OID=" + pOrderID + "'\" value=\"立即评价+积分\" />";
    }
    else if (pOrderStatus == "退款中") {
        _xhtmlBtnList += "<input type=\"button\" onclick=\"remindRefund('" + pOrderID + "','" + pShopUserID + "','" + pPayWay + "')\" value=\"提醒退款\" />";
    }
    else if (pOrderStatus == "完成") {
        _xhtmlBtnList += "<input type=\"button\" onclick=\"window.location.href='../AfterSale/AsMulSel?OID=" + pOrderID + "'\" value=\"申请售后\" />";
        _xhtmlBtnList += "<input type=\"button\" onclick=\"window.location.href='../Buyer/AppraiseDetail?OID=" + pOrderID + "'\" value=\"查看评价\" />";
    }

    return _xhtmlBtnList;
}

/**
 * 构造订单显示Item 列表
 * @param {any} pGoodsIDArr
 * @param {any} pGoodsTitleArr
 * @param {any} pGoodsSpecIDOrderNumArr
 * @param {any} pGoodsUnitPriceArr
 * @param {any} pIsSpecParamArr
 * @param {any} pSpecNameArr
 * @param {any} pGoodsCoverImgPathArr
 */
function xhtmlGoodsItemList(pGoodsIDArr, pGoodsTitleArr, pGoodsSpecIDOrderNumArr, pGoodsUnitPriceArr, pIsSpecParamArr, pSpecNameArr, pGoodsCoverImgPathArr) {

    //分割字符串数组
    var _goodsIDArr = new Array();
    var _goodsTitleArr = new Array();
    var _goodsSpecIDOrderNumArr = new Array();
    var _goodsUnitPriceArr = new Array();
    var _isSpecParamArr = new Array();
    var _specNameArr = new Array();
    var _goodsCoverImgPathArr = new Array();

    if (pGoodsIDArr.indexOf("^")) {
        _goodsIDArr = pGoodsIDArr.split("^");
        _goodsTitleArr = pGoodsTitleArr.split("^");
        _goodsSpecIDOrderNumArr = pGoodsSpecIDOrderNumArr.split("^");
        _goodsUnitPriceArr = pGoodsUnitPriceArr.split("^");
        _isSpecParamArr = pIsSpecParamArr.split("^");
        _specNameArr = pSpecNameArr.split("^");
        _goodsCoverImgPathArr = pGoodsCoverImgPathArr.split("^");
    }
    else {
        _goodsIDArr[0] = pGoodsIDArr;
        _goodsTitleArr[0] = pGoodsTitleArr;
        _goodsSpecIDOrderNumArr[0] = pGoodsSpecIDOrderNumArr;
        _goodsUnitPriceArr[0] = pGoodsUnitPriceArr;
        _isSpecParamArr[0] = pIsSpecParamArr;
        _specNameArr[0] = pSpecNameArr;
        _goodsCoverImgPathArr[0] = pGoodsCoverImgPathArr;
    }


    var myJsVal = "";
    //循环构造
    for (var i = 0; i < _goodsIDArr.length; i++) {

        //订购数量
        var _orderNum = _goodsSpecIDOrderNumArr[i].split('_')[1];

        myJsVal += "<a href=\"javascript:void(0)\" class=\"order-goods-item\">";
        myJsVal += "    <div class=\"goods-item-left\">";
        myJsVal += "        <img src=\"//" + _goodsCoverImgPathArr[i] + "\" />";
        myJsVal += "    </div>";
        myJsVal += "    <div class=\"goods-item-mid\">";
        myJsVal += "        <span class=\"goods-item-title\">" + _goodsTitleArr[i] + "</span>";
        myJsVal += "        <span class=\"goods-item-spec\">" + _specNameArr[i] + "</span>";
        myJsVal += "    </div>";
        myJsVal += "    <div class=\"goods-item-right\">";
        myJsVal += "        <span class=\"goods-item-price\">&#165;" + _goodsUnitPriceArr[i] + "</span>";
        myJsVal += "        <span class=\"goods-item-ordernum\">&times; " + _orderNum + "</span>";
        myJsVal += "    </div>";
        myJsVal += "</a>";
    }

    //返回Xhtml
    return myJsVal;
}

/**
 * 统计订单商品数量
 * @param {any} pGoodsIDArr
 */
function countGoodsNum(pGoodsIDArr) {
    if (pGoodsIDArr.indexOf("^")) {
        return pGoodsIDArr.split("^").length;
    }
    return 1;
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

    if (mOrderStatus == "待确认") {
        _tabIndex = 1;
    }
    else if (mOrderStatus == "待发货") {
        _tabIndex = 2;
    }
    else if (mOrderStatus == "待收货") {
        _tabIndex = 3;
    }
    else if (mOrderStatus == "待评价") {
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

//=======================订单相关操作函数=====================//


/**
 * 取消订单,关闭交易
 * */
function cancelOrder(pOrderID) {

    confirmWinCCb("确定要取消订单吗？", function () {

        //构造POST参数
        var dataPOST = {
            "Type": "3", "OrderID": pOrderID,
        };
        console.log(dataPOST);
        //正式发送异步请求
        $.ajax({
            type: "POST",
            url: "../OrderAjax/OrderDetail?rnd=" + Math.random(),
            data: dataPOST,
            dataType: "html",
            success: function (reTxt, status, xhr) {
                console.log("取消订单=" + reTxt);
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


                    }

                }
            }
        });

    }, function () { });
}

/**
 * 申请退款(未发货)
 * */
function applyRefund(pOrderID) {

    confirmWinCCb("确定要申请退款吗？", function () {

        //构造POST参数
        var dataPOST = {
            "Type": "5", "OrderID": pOrderID
        };
        console.log(dataPOST);
        //正式发送异步请求
        $.ajax({
            type: "POST",
            url: "../OrderAjax/OrderDetail?rnd=" + Math.random(),
            data: dataPOST,
            dataType: "html",
            success: function (reTxt, status, xhr) {
                console.log("申请退款(未发货)=" + reTxt);
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


    }, function () { });
}


/**
 * 提醒商家订单发货
 * */
function remindSendGoods(pOrderID, pShopUserID) {

    //构造POST参数
    var dataPOST = {
        "Type": "4", "OrderID": pOrderID, "ShopUserID": pShopUserID
    };
    console.log(dataPOST);
    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: "../OrderAjax/OrderDetail?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("提醒商家订单发货=" + reTxt);
            if (reTxt != "") {
                var _jsonReTxt = JSON.parse(reTxt);

                if (_jsonReTxt.ErrMsg != "" && _jsonReTxt.ErrMsg != null && _jsonReTxt.ErrMsg != undefined) {
                    toastWin("提醒成功");
                    return;
                }

                if (_jsonReTxt.Msg != "" && _jsonReTxt.Msg != null && _jsonReTxt.Msg != undefined) {
                    toastWin("提醒成功");
                    return;
                }

            }
        }
    });
}

/**
 * 延长自动确认收货时间
 * */
function delayReceiOrder(pOrderID) {

    confirmWin("延长自动确认收货时间？", function () {
        //构造POST参数
        var dataPOST = {
            "Type": "9", "OrderID": pOrderID,
        };
        console.log(dataPOST);
        //正式发送异步请求
        $.ajax({
            type: "POST",
            url: "../OrderAjax/OrderDetail?rnd=" + Math.random(),
            data: dataPOST,
            dataType: "html",
            success: function (reTxt, status, xhr) {
                console.log("延长自动确认收货时间" + reTxt);
                if (reTxt != "") {
                    var _jsonReTxt = JSON.parse(reTxt);

                    //错误提示
                    if (_jsonReTxt.ErrMsg != null && _jsonReTxt.ErrMsg != undefined && _jsonReTxt.ErrMsg != "") {
                        toastWin(_jsonReTxt.ErrMsg);
                    }

                    if (_jsonReTxt.Msg != null && _jsonReTxt.Msg != undefined && _jsonReTxt.Msg != "") {

                        toastWinCb(_jsonReTxt.Msg, function () {
                            //重新加载数据
                            reloadPageData(mIntPageCurrent);
                        })
                    }
                }
            }
        });
    });
}

/**
 * 确认收货 
 * */
function confirmReceiOrder(pOrderID) {

    confirmWin("确认收货？", function () {
        //构造POST参数
        var dataPOST = {
            "Type": "8", "OrderID": pOrderID,
        };
        console.log(dataPOST);
        //正式发送异步请求
        $.ajax({
            type: "POST",
            url: "../OrderAjax/OrderDetail?rnd=" + Math.random(),
            data: dataPOST,
            dataType: "html",
            success: function (reTxt, status, xhr) {
                console.log("确认收货" + reTxt);
                if (reTxt != "") {
                    var _jsonReTxt = JSON.parse(reTxt);

                    //错误提示
                    if (_jsonReTxt.ErrMsg != null && _jsonReTxt.ErrMsg != undefined && _jsonReTxt.ErrMsg != "") {
                        toastWin(_jsonReTxt.ErrMsg);
                    }

                    if (_jsonReTxt.Msg != null && _jsonReTxt.Msg != undefined && _jsonReTxt.Msg != "") {
                        //重新加载数据
                        reloadPageData(mIntPageCurrent);
                    }
                }
            }
        });
    });
}

/**
 * 向商家或平台发送提醒退款
 * @param {any} pPayWayName 支付方式名称  -- 支付方式 （WeiXinPay [微信支付], Alipay[支付宝] , Transfer[银行转账] , Offline[线下付款(到店付)], PayDelivery [货到付款]  Balance[余额支付]）
 */
function remindRefund(pOrderID, pShopUserID, pPayWayName) {

    //构造POST参数
    var dataPOST = {
        "Type": "6", "OrderID": pOrderID, "ShopUserID": pShopUserID, "PayWayName": pPayWayName,
    };
    console.log(dataPOST);
    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: "../OrderAjax/OrderDetail?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("提醒退款=" + reTxt);
            if (reTxt != "") {
                var _jsonReTxt = JSON.parse(reTxt);

                if (_jsonReTxt.ErrMsg != "" && _jsonReTxt.ErrMsg != null && _jsonReTxt.ErrMsg != undefined) {
                    toastWin("提醒成功");
                    return;
                }

                if (_jsonReTxt.Msg != "" && _jsonReTxt.Msg != null && _jsonReTxt.Msg != undefined) {
                    toastWin("提醒成功");
                    return;
                }

            }
        }
    });


}

