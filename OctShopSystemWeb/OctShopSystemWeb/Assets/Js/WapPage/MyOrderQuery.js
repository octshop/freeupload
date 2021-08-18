//=====================我的订单搜索======================//

/**-----定义公共变量------**/
var mAjaxUrl = "../Wap/MyOrder";

var mOrderStatus = ""; //当前订单状态

/**------初始化------**/
$(function () {

    //初始化分页滚动对象
    initPageMescroll();

    //初始化搜索Bar
    initSearchContent();

});


//===============================数据分页===============================//

var mSearchKey = "";  //搜索内容 

var mIsRefresh = true; //是否为刷新
var mescroll;
var mPageSize = 15; //每页的数据条数
var mCurPageDataJson = null; //当前分页的返回数据 Json对象
var mIntPageCurrent = 1; //当前的分页索引

/**
 * 初始化搜索Bar
 * */
function initSearchContent() {
    //搜索文本框事件，获取当文本框获取了焦点，按了键盘事件
    $("#SearchKeyTxt").keydown(function (event) {

        //alert(event.keyCode);
        if (event.keyCode == "13") {

            //搜索方法
            searchContent();

            return false;
        }

    });

    //为“搜索”按钮定义单击事件
    $("#SearchKeyBtn").click(function () {
        //搜索方法
        searchContent();
    });
}

/**
 * 搜索内容函数
 * */
function searchContent() {

    mSearchKey = $("#SearchKeyTxt").val().trim();
    //判断搜索是否为空
    if (mSearchKey == "" || mSearchKey == undefined || mSearchKey == null) {
        mSearchKey = "";
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
        "OrderStatus": mOrderStatus,
        "SearchKey": mSearchKey,
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
        myJsVal += "                        <a href=\"#\"><img src=\"" + _shopHeaderImg + "\" />" + dataPageExtra.ShopName + "</a>";
        myJsVal += "                        <div class=\"order-status-txt\">";
        myJsVal += "                            " + dataPage.OrderStatus + "";
        myJsVal += "                        </div>";
        myJsVal += "                    </div>";
        myJsVal += "                    <div class=\"order-item-mid\" onclick=\"window.location.href=\'../WapPage/OrderDetail?OID=" + dataPage.OrderID + "\'\">";

        myJsVal += xhtmlGoodsItemList(dataPage.GoodsIDArr, dataPage.GoodsTitleArr, dataPage.GoodsSpecIDOrderNumArr, dataPage.GoodsUnitPriceArr, dataPage.IsSpecParamArr, dataPageExtra.SpecNameArr, dataPageExtra.GoodsCoverImgPathArr);


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
        myJsVal += xhtmlOrderStatusBtnList(dataPage.OrderID, dataPage.BillNumber, dataPage.ShopUserID, dataPage.OrderStatus, dataPage.PayWay, dataPage.IsDelayFinishTime, dataPage.IsAgreeRefund);

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
function xhtmlOrderStatusBtnList(pOrderID, pBillNumber, pShopUserID, pOrderStatus, pPayWay, pIsDelayFinishTime, pIsAgreeRefund) {

    //console.log("pOrderStatus=" + pOrderStatus);
    console.log("pPayWay=" + pPayWay);

    //按钮Html
    var _xhtmlBtnList = "";

    if (pOrderStatus == "待付款" || pOrderStatus.indexOf("待确认") >= 0 || pOrderStatus == "到店付" || pOrderStatus == "转账") {

        if (pOrderStatus == "待付款") {
            _xhtmlBtnList += "<input type=\"button\" onclick=\"window.location.href='../WapPage/OrderDetail?OID=" + pOrderID + "'\" value=\"修改价格\" />";
        }
        else if (pOrderStatus.indexOf("待确认") >= 0) {
            _xhtmlBtnList += "<input type=\"button\" onclick=\"confirmPayDeliveryMul('" + pOrderID + "','" + pBillNumber + "')\" value=\"确认货到付款\" />";
        }
        else if (pOrderStatus.indexOf("到店付") >= 0) {
            _xhtmlBtnList += "<input type=\"button\" onclick=\"confirmOfflinePay('" + pOrderID + "','" + pBillNumber + "')\" value=\"确认到店付\" />";
        }
    }
    else if (pOrderStatus == "待发货") {

        _xhtmlBtnList += "<input type=\"button\" onclick=\"window.location.href='../WapPage/OrderDetail?OID=" + pOrderID + "'\" value=\"立即发货\" />";

    }
    else if (pOrderStatus == "待消费/自取") {

        _xhtmlBtnList += "<input type=\"button\" onclick=\"window.location.href='../VerifyCodePage/PopVerifyScanWin'\" value=\"核销验证\" />";

    }
    else if (pOrderStatus == "待收货") {

        _xhtmlBtnList += "<input type=\"button\" onclick=\"window.location.href='../WapPage/ExpressDetail?OID=" + pOrderID + "'\" value=\"查看物流\" />";

    }
    else if (pOrderStatus == "待评价") {

    }
    else if (pOrderStatus == "退款中") {

        console.log("pIsAgreeRefund=" + pIsAgreeRefund);
        if (pIsAgreeRefund == "false") {

            //按钮名称 
            var _btnName = "同意退款";
            if (pPayWay == "Offline") {
                _btnName = "已退款";
            }

            _xhtmlBtnList += "<input type=\"button\" onclick=\"DealRefund('" + pOrderID + "')\" value=\"" + _btnName + "\" />";

        }
    }
    else if (pOrderStatus == "完成") {

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

        myJsVal += "<a href=\"javascript:void(0)\" class=\"order-goods-item\">";        myJsVal += "    <div class=\"goods-item-left\">";        myJsVal += "        <img src=\"//" + _goodsCoverImgPathArr[i] + "\" />";        myJsVal += "    </div>";        myJsVal += "    <div class=\"goods-item-mid\">";        myJsVal += "        <span class=\"goods-item-title\">" + _goodsTitleArr[i] + "</span>";        myJsVal += "        <span class=\"goods-item-spec\">" + _specNameArr[i] + "</span>";        myJsVal += "    </div>";        myJsVal += "    <div class=\"goods-item-right\">";        myJsVal += "        <span class=\"goods-item-price\">&#165;" + _goodsUnitPriceArr[i] + "</span>";        myJsVal += "        <span class=\"goods-item-ordernum\">&times; " + _orderNum + "</span>";        myJsVal += "    </div>";        myJsVal += "</a>";
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




//=======================订单相关操作函数=====================//

/**
 * 确认货到付款订单 --批量操作
 */
function confirmPayDeliveryMul(pOrderID, pBillNumber) {

    //获取选择的订单ID拼接字符串
    var _orderIDArr = pOrderID; //getSelectValArr();

    //获取交易号
    var _billNumberArr = pBillNumber;


    //console.log("_billNumberArr=" + _billNumberArr);


    confirmWinWidth("确认货到付款订单？", function () {

        //构造POST参数
        var dataPOST = {
            "Type": "3", "OrderIDArr": _orderIDArr, "BillNumberArr": _billNumberArr,
        };
        console.log(dataPOST);

        //加载提示窗口
        loadingWin();

        //正式发送异步请求
        $.ajax({
            type: "POST",
            url: "../Trading/OrderMan?rnd=" + Math.random(),
            data: dataPOST,
            dataType: "html",
            success: function (reTxt, status, xhr) {
                console.log(reTxt);

                //移除加载提示
                closeLoadingWin();

                if (reTxt != "") {
                    var _jsonObj = JSON.parse(reTxt);
                    if (_jsonObj.ErrMsg != "" && _jsonObj.ErrMsg != null && _jsonObj.ErrMsg != undefined) {
                        alertWinWidth(_jsonObj.ErrMsg, 300);
                    }
                    if (_jsonObj.Msg != "" && _jsonObj.Msg != null && _jsonObj.Msg != undefined) {
                        toastWin(_jsonObj.Msg);
                        //重新加载数据
                        reloadPageData(mIntPageCurrent);
                    }
                }
            },
            error: function (xhr, errorTxt, status) {
                console.log("异步请求错误，errorTxt=" + errorTxt + " | status=" + status);
                return;
            }
        });


    }, 300);

}

/**
 * 确认买家已到店付款(商家操作)
 * @param {any} pOrderID 订单ID
 * @param {any} pBillNumber 交易号
 */
function confirmOfflinePay(pOrderID, pBillNumber) {

    confirmWinWidth("确定买家已到店支付吗？", function () {

        //构造POST参数
        var dataPOST = {
            "Type": "4", "OrderID": pOrderID, "BillNumber": pBillNumber,
        };
        console.log(dataPOST);

        //加载提示窗口
        loadingWin();

        //正式发送异步请求
        $.ajax({
            type: "POST",
            url: "../Trading/OrderMan?rnd=" + Math.random(),
            data: dataPOST,
            dataType: "html",
            success: function (reTxt, status, xhr) {
                console.log(reTxt);

                //移除加载提示
                closeLoadingWin();

                if (reTxt != "") {
                    var _jsonObj = JSON.parse(reTxt);
                    if (_jsonObj.ErrMsg != "" && _jsonObj.ErrMsg != null && _jsonObj.ErrMsg != undefined) {
                        toastWin(_jsonObj.ErrMsg);
                        return;
                    }
                    if (_jsonObj.Msg != "" && _jsonObj.Msg != null && _jsonObj.Msg != undefined) {
                        toastWin(_jsonObj.Msg);
                        //重新加载数据
                        reloadPageData(mIntPageCurrent);
                    }
                }
            },
            error: function (xhr, errorTxt, status) {
                console.log("异步请求错误，errorTxt=" + errorTxt + " | status=" + status);
                return;
            }
        });


    }, 300);

}

/**
 * 处理退款申请
 * */
function DealRefund(pOrderID) {


    confirmWinWidth("确定退款吗？", function () {

        //构造POST参数
        var dataPOST = {
            "Type": "5", "OrderID": pOrderID,
        };
        console.log(dataPOST);

        //加载提示窗口
        loadingWin();

        //正式发送异步请求
        $.ajax({
            type: "POST",
            url: "../Trading/OrderMan?rnd=" + Math.random(),
            data: dataPOST,
            dataType: "html",
            success: function (reTxt, status, xhr) {
                console.log(reTxt);

                //移除加载提示
                closeLoadingWin();

                if (reTxt != "") {
                    var _jsonObj = JSON.parse(reTxt);
                    if (_jsonObj.ErrMsg != "" && _jsonObj.ErrMsg != null && _jsonObj.ErrMsg != undefined) {
                        toastWin(_jsonObj.ErrMsg);
                        return;
                    }
                    if (_jsonObj.Msg != "" && _jsonObj.Msg != null && _jsonObj.Msg != undefined) {
                        toastWin(_jsonObj.Msg);
                        //重新加载数据
                        reloadPageData(mIntPageCurrent);
                    }
                }
            },
            error: function (xhr, errorTxt, status) {
                console.log("异步请求错误，errorTxt=" + errorTxt + " | status=" + status);
                return;
            }
        });


    }, 300);
}


