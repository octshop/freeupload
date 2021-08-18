//==================拼团商品详情================//

/**---------定义公共变量-----------**/

//AjaxURL
var mAjaxUrl = "../GoodsAjax/GoodsDetail";
var mGID = ""; //商品ID
var mFtID = ""; //运费模板ID
var mBuyerUserID = ""; //买家UserID
var mShopUserID = ""; //商家UserID
var mShopID = ""; //店铺ID
var mShopMsgObj = null; //店铺Json对象

//商品标题
var mGoodsTitle = "";

var mGoodsPrice = "";//当前商品价格
var mIsSpecParam = ""; //是否有规格 

var mSelCurrentSpecID = ""; //当前选择的规格值
var mSelCurrentPropID = ""; //当前选择的属性值

var mSelSpecPropIDArr = ""; //初始化 选择的规格ID和属性ID

//本身原来最低的商品价格，包括规格的处理
var mGoodsPriceLowSelf = "";

//-----------拼团相关-------//
var mDiscount = ""; //当前商品使用的折扣,如果有拼团，则是拼团折扣
var mNoGroupDiscount = ""; //商品本来的折扣，没有拼团折扣
var mGroupDiscount = ""; //拼团折扣
//记录 加载商品的规格和属性值
var mloadSpecPropMsgJson = null;
//是否单独购买
var mIsNoGroupOrder = false; //默认拼团购买
//记录加入的拼团，如果为0则单独开团
var mGroupID = 0; //开团的ID


var mGoodsImgListJson = null; //商品图片列表Json对象

//得到 商品可以使用的优惠券列表
var mGoodsAbleUseCouponsListJson = null;

//判断是否单击了，立即订购按钮
var mIsOrderAsk = false;

var mAppraiseImgIndex = 0; //晒单图片的索引
var mPhotoSwipeDataList = null; //PhotoSwipe的数据列表

/**------初始化------**/
$(function () {

    mGID = $("#hidGID").val().trim();
    mBuyerUserID = $("#hidBuyerUserID").val().trim();

    //加载商品图片轮播的内容
    loadSliderContent();

    //加载商品信息
    loadGoodsMsg();

    //统计商品评价信息
    countAppraiseMsg();

    //加载可参与加入的开团信息
    loadingGroupCreateMsgAbleJoin("3");

    //添加浏览足
    addBuyerBrowseHistory();

    //判断是否可以打开小程序版
    isOpenWxMiniPage();

});

/**
 * 加载商品额外数据 如收货地址,店铺地址等
 * @pIsShopExpense 是否支付到店消费
 * */
function initExtraGoodsMsg(pIsShopExpense) {

    //----加载店铺地址
    if (pIsShopExpense == "true" || pIsShopExpense == "both") {

        //$("#ExpressFreight").hide();
        $("#ShopAddrNav").show();

        //加载店铺地址坐标相关信息
        var _shopAddrDetail = mShopMsgObj.RegionNameArr + "_" + mShopMsgObj.DetailAddr;
        //显示插入前台
        $("#ShopAddrSpan").html(_shopAddrDetail);
        $("#ShopTelA").html(mShopMsgObj.ShopMobile);
        $("#ShopTelA").attr("href", "tel:" + mShopMsgObj.ShopMobile);

        //初始化所有的 地图导航URL连接
        allMapURL(mShopMsgObj.Latitude, mShopMsgObj.Longitude, mShopMsgObj.ShopName, _shopAddrDetail);

    }

    if (pIsShopExpense == "false" || pIsShopExpense == "both") {  //----加载收货地址

        $("#ExpressFreight").show();
        //$("#ShopAddrNav").hide();

        if ($("#hidBuyerReceiAddrSelCookieArr").val().trim() != "") {

            var hidBuyerReceiAddrSelCookieArr = $("#hidBuyerReceiAddrSelCookieArr").val().trim();
            if (hidBuyerReceiAddrSelCookieArr != "" && hidBuyerReceiAddrSelCookieArr != undefined && hidBuyerReceiAddrSelCookieArr != null) {

                $("#ExpressAddressDiv").html(hidBuyerReceiAddrSelCookieArr.split('^')[2]);

                //初始化统计商品运费
                initFreightMoney();

                return;
            }
        }

        //构造POST参数
        var dataPOST = {
            "Type": "4", "GoodsID": mGID,
        };
        console.log(dataPOST);
        //正式发送异步请求
        $.ajax({
            type: "POST",
            url: mAjaxUrl + "?rnd=" + Math.random(),
            data: dataPOST,
            dataType: "html",
            success: function (reTxt, status, xhr) {
                //console.log("额外数据=" + reTxt);
                if (reTxt != "") {
                    var _jsonReTxt = JSON.parse(reTxt);

                    //收货地址显示
                    if (_jsonReTxt.ReceiAddrRegion.RegionNameArr != undefined) {

                        //选择收货地址Cookie =  BReceiAddrID ^ 430000_430100_430121 ^ 湖南省_长沙市_长沙县
                        //赋值给隐藏记录控件
                        $("#hidBuyerReceiAddrSelCookieArr").val(_jsonReTxt.ReceiAddrRegion.BReceiAddrID + "^" + _jsonReTxt.ReceiAddrRegion.RegionCodeArr + "^" + _jsonReTxt.ReceiAddrRegion.RegionNameArr);

                        //初始化统计商品运费
                        initFreightMoney();

                        var hidBuyerReceiAddrSelCookieArr = $("#hidBuyerReceiAddrSelCookieArr").val().trim();
                        if (hidBuyerReceiAddrSelCookieArr != "" && hidBuyerReceiAddrSelCookieArr != undefined && hidBuyerReceiAddrSelCookieArr != null) {

                            $("#ExpressAddressDiv").html(hidBuyerReceiAddrSelCookieArr.split('^')[2]);

                        }
                        else {
                            $("#ExpressAddressDiv").html(_jsonReTxt.ReceiAddrRegion.RegionNameArr);
                        }
                    }
                    else {
                        $("#ExpressAddressDiv").html("");
                    }

                }
                else {
                    $("#ExpressAddressDiv").html("");
                }
            }
        });

    }

}

/**
 * 加载买家收货地址
 * */
function loadBuyerReceiAddrList() {

    if (mBuyerUserID == "") {
        return;
    }

    //构造POST参数
    var dataPOST = {
        "Type": "1", "PageCurrent": "1",
    };
    console.log(dataPOST);
    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: "../BuyerAjax/ReceiAddrList?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log(reTxt);
            if (reTxt != "") {
                var _jsonReTxt = JSON.parse(reTxt);
                var _xhtml = xhtmlBuyerReceiAddrList(_jsonReTxt);
                //显示代码插入前台
                $("#ReceiAddListUl").html(_xhtml);
            }
            else {
                $("#ReceiAddrABtn").html("添加收货地址");
                //设置添加收货地址连接地址
                $("#ReceiAddrABtn").attr("href", "../Buyer/ReceiAddrAdd?BackUrl=" + window.location.href);
                return;
            }

        }
    });
}

/**
 * 构造弹窗收货地址列表显示代码
 * @param {any} pJsonReTxt Json对象
 */
function xhtmlBuyerReceiAddrList(pJsonReTxt) {

    var DataPageArr = pJsonReTxt.DataPage;

    var myJsVal = "";
    for (var i = 0; i < DataPageArr.length; i++) {
        if (i >= 4) {
            break;
        }
        myJsVal += "<li onclick=\"selReceiAddrCurrent(" + DataPageArr[i].BReceiAddrID + ", '" + DataPageArr[i].RegionCodeArr + "', '" + DataPageArr[i].RegionNameArr + "')\">";
        myJsVal += "" + DataPageArr[i].RegionNameArr + "_" + DataPageArr[i].DetailAddr + "";
        myJsVal += "</li>";
    }

    if (DataPageArr.length <= 4) {
        $("#ReceiAddrABtn").html("添加收货地址");
        //设置添加收货地址连接地址
        $("#ReceiAddrABtn").attr("href", "../Buyer/ReceiAddrAdd?BackUrl=" + window.location.href);
    }
    else {
        //设置收货地址连接地址
        $("#ReceiAddrABtn").attr("href", "../Buyer/ReceiAddrList?BackUrl=" + window.location.href);
    }

    return myJsVal;
}

/**
 * 加载商品图片轮播的内容
 * */
function loadSliderContent() {

    //构造POST参数
    var dataPOST = {
        "Type": "1", "GoodsID": mGID,
    };
    console.log(dataPOST);
    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: mAjaxUrl + "?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("mGoodsImgListJson=" + reTxt);
            if (reTxt != "") {
                var _jsonReTxt = JSON.parse(reTxt);

                mGoodsImgListJson = _jsonReTxt.GoodsImgList;

                if (_jsonReTxt.GoodsImgList == null || _jsonReTxt.GoodsImgList == undefined) {
                    return;
                }

                //初始化滑动插件
                initSlider();
            }
        }
    });
}

/**
 * 加载商品信息
 * */
function loadGoodsMsg() {

    //构造POST参数
    var dataPOST = {
        "Type": "2", "GoodsID": mGID,
    };
    console.log(dataPOST);
    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: mAjaxUrl + "?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("初始化商品信息=" + reTxt);
            if (reTxt != "") {
                var _jsonReTxt = JSON.parse(reTxt);

                //读取运费模板ID
                mFtID = _jsonReTxt.GoodsMsg.FtID;

                //设置店铺ID
                mShopID = _jsonReTxt.GoodsMsg.ShopID;
                mShopMsgObj = _jsonReTxt.ShopMsg;
                //设置页脚店铺连接
                $("#Footer_ShopLinkHref").attr("href", "../Shop/Index?SID=" + mShopID);

                //记录当前折扣
                mDiscount = _jsonReTxt.GoodsMsg.Discount;
                mNoGroupDiscount = _jsonReTxt.GoodsMsg.Discount;

                //拼团
                if (_jsonReTxt.GroupDiscount != 0 && _jsonReTxt.GroupDiscount != null) {
                    mDiscount = _jsonReTxt.GroupDiscount; //拼团的折扣

                    mGroupDiscount = _jsonReTxt.GroupDiscount; //拼团的折扣
                }
                else {
                    //拼团信息错误，或不存在拼团，返回商品详情
                    window.location.href = "../Goods/GoodsDetail?GID=" + mGID;
                    return;
                }

                //是否显示实体店徽章
                if (mShopMsgObj.IsEntity == "true") {
                    $(".badge-red-span").show();
                }

                //设置商家UserID
                $("#hidShopUserID").val(_jsonReTxt.GoodsMsg.ShopUserID);
                mShopUserID = _jsonReTxt.GoodsMsg.ShopUserID;


                mGoodsTitle = _jsonReTxt.GoodsMsg.GoodsTitle;


                $("#GoodsTitle").html(_jsonReTxt.GoodsMsg.GoodsTitle);
                $("#PageTitle").html(_jsonReTxt.GoodsMsg.GoodsTitle + "-拼团详情");

                //商品价格
                mGoodsPrice = showDiscountGoodsPrice(_jsonReTxt.GoodsMsgExtra.GoodsPriceLow, mDiscount);
                $("#GoodsPriceLowB").html("&#165;" + mGoodsPrice);

                if (_jsonReTxt.GoodsMsg.MarketPrice != "0" || _jsonReTxt.GoodsMsg.MarketPrice != "") {

                    if (_jsonReTxt.GoodsMsg.IsShopExpense == "true") {
                        $("#MarketPrice").html("门店:&#165;" + _jsonReTxt.GoodsMsg.MarketPrice);
                    }
                    else {
                        $("#MarketPrice").html("市场:&#165;" + _jsonReTxt.GoodsMsg.MarketPrice);
                    }
                }
                else {
                    $("#MarketPrice").hide();
                }

                if (mDiscount != "0" || mDiscount != "") {

                    //记录当前折扣
                    //mDiscount = _jsonReTxt.GoodsMsg.Discount;

                    $("#Discount").html(mDiscount + "折");

                }
                else {
                    $("#Discount").hide();
                }


                //规格属性赋值
                $("#SpecPropDiv").html(showDefaultSpecProp(_jsonReTxt.GoodsMsgExtra.GoodsPriceLowSpecPropArr));

                $("#SelGoodsSpecPropB").html(showDefaultSpecProp(_jsonReTxt.GoodsMsgExtra.GoodsPriceLowSpecPropArr) + "");

                //显示是否支付货到付款，是否支持需到店自取
                $("#DeliveryShopExpense").html(showDeliveryShopExpense(_jsonReTxt.GoodsMsg.IsPayDelivery, _jsonReTxt.GoodsMsg.IsShopExpense, _jsonReTxt.ShopMsg.IsSelfShop));

                //显隐相关规格区域
                if (_jsonReTxt.GoodsMsg.IsSpecParam == "true") {
                    $("#SpecList").show();
                    $("#WinSelSpecMidDiv").show();
                }
                else {
                    $("#SpecList").hide();
                    $("#WinSelSpecMidDiv").hide();
                    //设置规格属性窗口中的价格
                    $("#WinSpecPriceDiv").html("&#165;" + showDiscountGoodsPrice(_jsonReTxt.GoodsMsgExtra.GoodsPriceLow, mDiscount));
                }
                mIsSpecParam = _jsonReTxt.GoodsMsg.IsSpecParam;
                //规格和属性标题
                $("#WinSpecTitle").html(_jsonReTxt.GoodsMsgExtra.SpecTitle);
                $("#WinPropTitle").html(_jsonReTxt.GoodsMsgExtra.SpecAttrName);

                //获取当前选择规格和属性
                var _specPropArr = _jsonReTxt.GoodsMsgExtra.GoodsPriceLowSpecPropArr
                if (_specPropArr.indexOf("|") >= 0) {
                    var _specPropMsgArr = _specPropArr.split("|");
                    mSelSpecPropIDArr = _specPropMsgArr[0].split("^")[0] + "^" + _specPropMsgArr[1].split("^")[0];
                }
                else {
                    mSelSpecPropIDArr = _specPropArr.split("^")[0];
                }

                //构造商品赠品信息显示代码
                if (_jsonReTxt.GiftIDArrMsg != undefined && _jsonReTxt.GiftIDArrMsg != null && _jsonReTxt.GiftIDArrMsg.length > 0 && _jsonReTxt.GoodsMsg.GiftIDArr != "") {
                    $("#GiftListDiv").show();
                    $("#GiftListItemDiv").html(xhtmlGiftMsgList(_jsonReTxt.GiftIDArrMsg));
                }


                //加载收货地址费等
                initExtraGoodsMsg(_jsonReTxt.GoodsMsg.IsShopExpense);

                //加载商品的规格和属性值
                loadSpecPropMsg(mIsSpecParam);



                //得到 商品可以使用的优惠券列表  买家UserID不判断 
                goodsAbleUseCouponsList();

                //显隐购买返积分条
                if (parseFloat(_jsonReTxt.GoodsMsgExtra.ConfirmReceiReturnIntegral) > 0) {
                    $("#GoodsReturnIntegralDiv").show();
                    $("#GoodsReturnIntegralValB").html(" + " + _jsonReTxt.GoodsMsgExtra.ConfirmReceiReturnIntegral);
                }


                //初始化商品评价,指定记录条数
                initGoodsAppraiseSelTop();

                //初始化抢购秒杀条
                //if (_jsonReTxt.SecKillMsg.SkDiscount != 0) {
                //    //初始化
                //    initSecKillBar(_jsonReTxt.SecKillMsg);
                //    $("#SecKillTitle").show();
                //}

                //原来最低的商品价格
                mGoodsPriceLowSelf = _jsonReTxt.GoodsMsgExtra.GoodsPriceLow

                //设置单独购买和拼团的显示价格
                setShowNoGroupOrGroupPrice();


                $("#SkStockNum").html(_jsonReTxt.GroupSaleNum);

                //加载店铺条相关信息(前端) - 如:商品详情页的店铺信息
                loadShopBarMsg();


                //显示分享商品返回相关
                if (_jsonReTxt.GoodsMsg.IsShareGoods == "true") {

                    $("#ShareMoneyDiv").show();
                    if (_jsonReTxt.GoodsMsg.IsShowShareMoney == "true") {
                        $("#ShareMoneyValB").show();
                        $("#ShareMoneyValB").html("订单总额 x " + _jsonReTxt.GoodsMsgExtra.CommissionPersent + " x " + _jsonReTxt.GoodsMsgExtra.ShareGoodsPersent);
                    }

                    //得到买家分享商品返佣的URL
                    getBuyerShareGoodsURL();

                }

            }
        }
    });
}

/**
 * 构造商品赠品信息显示代码
 * @param {any} pJsonArrGiftIDArrMsg 商品赠品信息数组 Json对象
 */
function xhtmlGiftMsgList(pJsonArrGiftIDArrMsg) {

    //构造显示代码
    var myJsVal = "";
    for (var i = 0; i < pJsonArrGiftIDArrMsg.length; i++) {

        //限制赠品标题显示
        var _giftName = pJsonArrGiftIDArrMsg[i].GiftName;
        if (_giftName.length > 16) {
            _giftName = _giftName.substring(0, 13) + " (" + pJsonArrGiftIDArrMsg[i].GiftNum + "件)...";
        }
        else {
            _giftName += " (" + pJsonArrGiftIDArrMsg[i].GiftNum + "件)"
        }

        myJsVal += "<a href=\"../Goods/GiftDetail?GIID=" + pJsonArrGiftIDArrMsg[i].GiftID + "\" target=\"_blank\">";
        myJsVal += "  <div><img src=\"//" + pJsonArrGiftIDArrMsg[i].ImgURL + "\" /></div>";
        myJsVal += "  <div>";
        myJsVal += "" + _giftName + "";
        myJsVal += "  </div>";
        myJsVal += "</a>";
    }
    return myJsVal;
}

/**
 * 显示打折后的商品价格
 * @param {any} pGoodsPriceLow 商品规格最低价
 * @param {any} pDiscount 折扣
 */
function showDiscountGoodsPrice(pGoodsPriceLow, pDiscount) {

    if (pDiscount != "0") {
        var _goodsPriceLow = parseFloat(pGoodsPriceLow) * (parseFloat(pDiscount) * 0.1);
        return formatNumberDotDigit(_goodsPriceLow, 2);
    }

    return formatNumberDotDigit(pGoodsPriceLow, 2);
}

/**
 * 显示默认的规格属性
 * @param {any} pGoodsPriceLowSpecPropArr 规格属性值 (规格ID^规格名称)或(规格ID^规格名称 | 属性ID^属性名称)
 */
function showDefaultSpecProp(pGoodsPriceLowSpecPropArr) {
    var _backMsg = "";
    if (pGoodsPriceLowSpecPropArr.indexOf("|") >= 0) {
        var _specPropArr = pGoodsPriceLowSpecPropArr.split("|");
        _backMsg = _specPropArr[0].split("^")[1] + "，" + _specPropArr[1].split("^")[1]
    }
    else {
        _backMsg = pGoodsPriceLowSpecPropArr.split("^")[1];
    }

    if (_backMsg == undefined) {
        _backMsg = "";
    }

    return _backMsg;
}

/**
 * 显示是否支付货到付款，是否支持需到店自取
 * @param {any} pIsPayDelivery
 * @param {any} pIsShopExpense
 */
function showDeliveryShopExpense(pIsPayDelivery, pIsShopExpense, pIsSelfShop) {

    var _xhtml = "";
    if (pIsPayDelivery == "true") {
        _xhtml += "支持货到付款 &nbsp; ";
    }

    if (pIsSelfShop == "true") {
        _xhtml += "<span class=\"shop-isself-span\">自营</span> &nbsp;";
    }


    //是否支持 【到店消费 或者 快递，到店都支持】 (true , false , both)
    if (pIsShopExpense == "true") {
        _xhtml += "<span>到店消费或自取</span>";
    }
    else if (pIsShopExpense == "false") {
        _xhtml += "<span>快递物流发货</span>";
    }
    else if (pIsShopExpense == "both") {
        _xhtml += "<span>到店或快递物流</span>";
    }
    return _xhtml;
}

/**
 * 加载商品的规格和属性值
 * @parm pIsSpecParam 是否有规格 [true / false]
 * */
function loadSpecPropMsg(pIsSpecParam) {

    $("#WinGoodsIDDiv").html("商品编码：" + mGID);

    if (pIsSpecParam == "false") {
        return "";
    }

    //构造POST参数
    var dataPOST = {
        "Type": "3", "GoodsID": mGID,
    };
    console.log(dataPOST);
    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: mAjaxUrl + "?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("加载规格属性Json=" + reTxt);
            if (reTxt != "") {
                var _jsonReTxt = JSON.parse(reTxt);

                mloadSpecPropMsgJson = _jsonReTxt;

                if (_jsonReTxt.length <= 0) {
                    //隐藏规格选择
                    $("#SpecList").hide();
                    $("#GoodsSpec").hide();
                    return;
                }

                //获取默认选择的规格ID和属性ID
                var _selSpecID = "", _selPropID = "";
                if (mSelSpecPropIDArr.indexOf("^") >= 0) {
                    var _selSpecPropIDArr = mSelSpecPropIDArr.split("^");
                    _selSpecID = _selSpecPropIDArr[0];
                    _selPropID = _selSpecPropIDArr[1];
                }
                else {
                    _selSpecID = mSelSpecPropIDArr;
                }
                //$("#WinGoodsIDDiv").html("商品编码：" + mGID);

                //显示商品规格属性
                showGoodsSpecProp(_jsonReTxt, _selSpecID, _selPropID);
                //显示规格属性图片列表
                showSpecPropImgList(_jsonReTxt);
            }
        }
    });
}

/**
 * 显示商品规格属性
 * @param {any} pSpecParamArrJson 商品规格属性Json字符串
 * @param pSelSpecID 选择的规格ID
 * @param pSelPropID 选择的属性ID
 */
function showGoodsSpecProp(pSpecParamArrJson, pSelSpecID, pSelPropID) {

    var _specPropArr = pSpecParamArrJson;

    //循环构造规格和属性的显示代码
    var _xhtmlSpec = ""; var _xhtmlProp = "";
    for (var i = 0; i < _specPropArr.length; i++) {
        //规格数组
        var _specItem = _specPropArr[i];
        _xhtmlSpec += "<span data-img=\"" + _specItem.SpecParamImg + "\" data-price=\"" + _specItem.GoodsPrice + "\" id=\"WinSpecItem_" + _specItem.SpecID + "\" onclick=\"selCurrentSpec(" + _specItem.SpecID + ")\">" + _specItem.SpecParamVal + "</span>";

        //属性显示代码
        _xhtmlProp += "<div class=\"win-prop-item\" id=\"WinSpecPropItem_" + _specItem.SpecID + "\" style=\"display:none;\">";
        for (var j = 0; j < _specItem.PropList.length; j++) {
            _xhtmlProp += "<span data-img=\"" + _specItem.PropList[j].SpecParamImg + "\" data-price=\"" + _specItem.PropList[j].GoodsPrice + "\" id=\"WinSpecPropItemSpan_" + _specItem.PropList[j].SpecID + "\" onclick=\"selCurrentProp(" + _specItem.PropList[j].SpecID + ")\" >" + _specItem.PropList[j].SpecParamVal + "</span>";
        }
        _xhtmlProp += "</div>";

    }

    //显示代码插入前台
    $("#WinSpeckList").html(_xhtmlSpec);
    //判断是否有属性
    if (_xhtmlProp != "") {
        $("#WinPropTitle").show();
        $("#WinPropList").html(_xhtmlProp);
    }
    else {
        $("#WinPropTitle").hide();
        $("#WinPropList").html("");
    }

    //显示默认的规格属性
    if (pSelSpecID != "" && pSelSpecID != "0" && pSelSpecID != undefined) {
        selCurrentSpec(pSelSpecID);
    }
    if (pSelPropID != "" && pSelPropID != "0" && pSelPropID != undefined) {
        selCurrentProp(pSelPropID);
    }
}

/**
 * 选择当前规格值
 * @param {any} pSelSpecID 选择的规格ID
 */
function selCurrentSpec(pSelSpecID) {

    console.log("选择当前规格值pSelSpecID=" + pSelSpecID);

    if (pSelSpecID != "" && pSelSpecID != undefined) {

        //记录当前选择的规格值
        mSelCurrentSpecID = pSelSpecID

        //清除所有选择项目样式
        $(".win-spec-list span").removeClass("current-sel-specprop");
        //设置当前选择的样式
        $(".win-spec-list #WinSpecItem_" + pSelSpecID).addClass("current-sel-specprop");
        //规格图片路径
        var _dataImg = $(".win-spec-list #WinSpecItem_" + pSelSpecID).attr("data-img");
        //console.log("_dataImg=" + _dataImg);
        if (_dataImg != "" && _dataImg != "null") {
            $(".win-spec-top-left").show();
            $(".win-spec-top-left #SpecPropImgPre").attr("src", "//" + _dataImg);

            $("#hidSpecImgPre").val(_dataImg);
        }
        else {

            $(".win-spec-top-left").hide();

            $("#hidSpecImgPre").val("");
        }



        //商品价格计算
        var _dataPrice = $(".win-spec-list #WinSpecItem_" + pSelSpecID).attr("data-price");
        //console.log("_dataPrice=" + _dataPrice);
        if (_dataPrice != "" && _dataPrice != "0" && _dataPrice != "null") {
            if (mDiscount != "" && mDiscount != "0") {

                mGoodsPrice = formatNumberDotDigit((parseFloat(_dataPrice) * parseFloat(mDiscount) * 0.1), 2);

                $(".win-spec-top-right #WinSpecPriceDiv").html("&#165; " + mGoodsPrice);
            }
            else {

                mGoodsPrice = formatNumberDotDigit(_dataPrice, 2)

                $(".win-spec-top-right #WinSpecPriceDiv").html("&#165; " + formatNumberDotDigit(_dataPrice, 2));
            }
            $(".win-txt-number #InputOrderNumber").val(1);
        }


        //显示当前选择规格名称
        var _winSpecItemHtml = $(".win-spec-list #WinSpecItem_" + pSelSpecID).html();
        console.log("#WinSpecItem_" + pSelSpecID + "=" + _winSpecItemHtml);
        $("#WinGoodsSpecPropDiv #SelSpecSpan").text(_winSpecItemHtml);


    }

    //默认选择第一个属性值
    //隐藏所有的属性值DIv
    $(".win-prop-item").hide();
    var _propItemArr = $("#WinSpecPropItem_" + pSelSpecID + " span");
    //console.log(_propItemArr.length);
    if (_propItemArr.length > 0) {
        $(".win-spec-list #WinSpecPropItem_" + pSelSpecID).show();
        $(".win-prop-item #" + _propItemArr[0].id).addClass("current-sel-specprop");

        //规格图片路径
        var _dataImgProp = $(".win-prop-item #" + _propItemArr[0].id).attr("data-img");
        //console.log("_dataImg=" + _dataImg);
        if (_dataImgProp != "" && _dataImgProp != "null") {
            $(".win-spec-top-left").show();
            $(".win-spec-top-left #SpecPropImgPre").attr("src", "//" + _dataImgProp);
        }
        else {

            if (_dataImg == "" && _dataImg == "null") {
                $(".win-spec-top-left").hide();
            }
        }

        //商品价格计算
        var _dataPrice = $(".win-prop-item #" + _propItemArr[0].id).attr("data-price");
        console.log("属性_dataPrice=" + _dataPrice);
        if (_dataPrice != "" && _dataPrice != "0" && _dataPrice != "null") {
            console.log("mDiscount=" + mDiscount);
            if (mDiscount != "" && mDiscount != "0") {

                mGoodsPrice = formatNumberDotDigit((parseFloat(_dataPrice) * parseFloat(mDiscount) * 0.1), 2);
                $(".win-spec-top-right #WinSpecPriceDiv").html("&#165; " + mGoodsPrice);
            }
            else {
                mGoodsPrice = formatNumberDotDigit(_dataPrice, 2);
                $(".win-spec-top-right #WinSpecPriceDiv").html("&#165; " + formatNumberDotDigit(_dataPrice, 2));
            }
            $(".win-txt-number #InputOrderNumber").val(1);
        }

        //显示当前选择属性名称
        var _winSpecPropItemHtml = $(".win-prop-item #" + _propItemArr[0].id).html();
        $("#WinGoodsSpecPropDiv #SelPropSpan").text(_winSpecPropItemHtml);


    }
}

/**
 * 选择当前的属性值
 * @param {any} pSelPropID 属性ID
 */
function selCurrentProp(pSelPropID) {

    console.log("选择当前的属性值pSelPropID=" + pSelPropID);

    if (pSelPropID != "" && pSelPropID != undefined) {

        //记录选择当前的属性值
        mSelCurrentPropID = pSelPropID;

        //清除所有选择项目样式
        $(".win-prop-item span").removeClass("current-sel-specprop");
        $(".win-prop-item #WinSpecPropItemSpan_" + pSelPropID).addClass("current-sel-specprop");

        //规格图片路径
        var _dataImgProp = $(".win-prop-item #WinSpecPropItemSpan_" + pSelPropID).attr("data-img");
        //console.log("_dataImg=" + _dataImg);
        if (_dataImgProp != "" && _dataImgProp != "null") {
            $(".win-spec-top-left").show();
            $(".win-spec-top-left #SpecPropImgPre").attr("src", "//" + _dataImgProp);
        }
        else {
            var hidSpecImgPre = $("#hidSpecImgPre").val();
            if (hidSpecImgPre != "") {

            }
            else {
                $(".win-spec-top-left").hide();
            }
        }

        //商品价格计算
        var _dataPrice = $(".win-prop-item #WinSpecPropItemSpan_" + pSelPropID).attr("data-price");
        console.log("属性_dataPrice=" + _dataPrice);
        if (_dataPrice != "" && _dataPrice != "0" && _dataPrice != "null") {
            console.log("mDiscount=" + mDiscount);
            if (mDiscount != "" && mDiscount != "0") {

                mGoodsPrice = formatNumberDotDigit((parseFloat(_dataPrice) * parseFloat(mDiscount) * 0.1), 2);

                $(".win-spec-top-right #WinSpecPriceDiv").html("&#165; " + mGoodsPrice);
            }
            else {

                mGoodsPrice = formatNumberDotDigit(_dataPrice, 2);
                $(".win-spec-top-right #WinSpecPriceDiv").html("&#165; " + formatNumberDotDigit(_dataPrice, 2));
            }
            $(".win-txt-number #InputOrderNumber").val(1);
        }


        //显示当前选择属性名称
        var _winSpecPropItemHtml = $(".win-prop-item #WinSpecPropItemSpan_" + pSelPropID).html();
        $("#WinGoodsSpecPropDiv #SelPropSpan").text(_winSpecPropItemHtml);

    }
}

/**
 * 增加或减少 订购数量
 * @param {any} pExeType 操作类型 [ Add / Reduce ]
 */
function chgOrderNum(pExeType) {

    //获取订单数量
    var _inputOrderNumber = parseInt($(".win-txt-number #InputOrderNumber").val().trim());
    //价格
    var _orderPrice = parseFloat($("#WinSpecPriceDiv").html().replace("¥ ", "").trim());
    console.log("_orderPrice=" + _orderPrice);

    if (pExeType == "Add") {
        _inputOrderNumber += 1;
    }
    else if (pExeType == "Reduce") {
        if (_inputOrderNumber < 2) {
            _inputOrderNumber = 1;
        }
        else {
            _inputOrderNumber -= 1;
        }
    }

    console.log(_inputOrderNumber);
    //当前订购数量写入
    $(".win-txt-number #InputOrderNumber").val(_inputOrderNumber);

    //重新计算订购价格
    var _sumOrderPrice = parseFloat(mGoodsPrice) * parseInt(_inputOrderNumber);
    console.log("_sumOrderPrice=" + _sumOrderPrice);

    $(".win-spec-top-right #WinSpecPriceDiv").html("&#165; " + formatNumberDotDigit(_sumOrderPrice, 2));
}

/**
 * 显示规格属性图片列表
 * @param {any} pSpecParamArrJson 商品规格属性Json字符串
 */
function showSpecPropImgList(pSpecParamArrJson) {

    //规格属性数据
    var _specPropArr = pSpecParamArrJson;

    var _countSpecPropImg = 0;

    //循环构造显示代码
    var _xhtml = "";
    for (var i = 0; i < _specPropArr.length; i++) {
        var _specArr = _specPropArr[i];
        var _propArr = _specPropArr[i].PropList;

        //规格图片值
        if (_specArr.SpecParamImg != "" && _specArr.SpecParamImg != null && _specArr.SpecParamImg != undefined) {

            _xhtml += " <img data-img=\"//" + _specArr.SpecParamImg + "\" src=\"//" + _specArr.SpecParamImg + "\" onclick=\"showSliderFirstSpeckImg(event)\" />";

            _countSpecPropImg++;
        }

        //有规格的属性
        if (_propArr.length > 0 && _propArr != undefined && _propArr != null) {
            for (var j = 0; j < _propArr.length; j++) {
                if (_propArr[j].SpecParamImg != "" && _propArr[j].SpecParamImg != null && _propArr[j].SpecParamImg != undefined) {

                    _xhtml += " <img data-img=\"//" + _propArr[j].SpecParamImg + "\" src=\"//" + _propArr[j].SpecParamImg + "\" onclick=\"showSliderFirstSpeckImg(event)\" />";

                    _countSpecPropImg++;
                }
            }
        }
        //else {
        //    //只有规格
        //    if (_specArr.SpecParamImg != "" && _specArr.SpecParamImg != null && _specArr.SpecParamImg != undefined) {

        //        _xhtml += " <img data-img=\"//" + _specArr.SpecParamImg + "\" src=\"//" + _specArr.SpecParamImg + "\" onclick=\"showSliderFirstSpeckImg(event)\" />";
        //    }
        //}
    }

    $("#SpecListDiv").html("可选" + _countSpecPropImg);


    console.log("规格属性图片显示Xhtml：" + _xhtml);
    if (_xhtml == "") {
        $("#SpecList").hide();
        return;
    }
    //显示代码插入前台
    $("#SpecListItemDiv").html(_xhtml);
}

/**
 * 初始化滑动插件
 */
function initSlider() {

    //初始化主轮播图的Html代码
    $("#sliderMainContent").html(initSliderHtml(""));

    //初始化 主轮播图片
    initSliderGoodsImg();


    //可选规格图片
    $("#SpecListImg").lightSlider({
        speed: 0,  //过渡动画的持续时间，单位毫秒
        item: 6, //同时显示的slide的数量
        auto: false, //如果设置为true，幻灯片将自动播放
        loop: false, //false表示在播放到最后一帧时不会跳转到开头重新播放
        slideMargin: 1, //每一个slide之间的间距
        controls: false, //如果设置为false，prev/next按钮将不会被显示
        pause: 4000 //停留多久
    });

}

/**
 * 初始化 主轮播图片
 * */
var _slider = null;
function initSliderGoodsImg() {
    //主轮播图片
    _slider = $("#content-slider").lightSlider({
        speed: 500,  //过渡动画的持续时间，单位毫秒
        auto: false, //如果设置为true，幻灯片将自动播放
        loop: false, //false表示在播放到最后一帧时不会跳转到开头重新播放
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
            $("#SliderCountDiv").html(_curSliderNum + "/" + _totalSliderNum);
        },
        onAfterSlide: function (data) { //每一个slide过渡动画之后被执行
            //console.log(data);
            //console.log("当前Sidler索引：" + data.getCurrentSlideCount());
            //console.log("总的Slider数：" + data.getTotalSlideCount());
            var _curSliderNum = data.getCurrentSlideCount();
            var _totalSliderNum = data.getTotalSlideCount();
            $("#SliderCountDiv").html(_curSliderNum + "/" + _totalSliderNum);
        }
    });
}


/**
 * 在轮播中展示规格图片
 * @param {any} event
 */
function showSliderFirstSpeckImg(event) {

    //删除之前插入的
    $(".img-slider-li").remove();

    var _dataHref = "#";
    var _dataImg = $(event.currentTarget).attr("data-img");

    var myJsVal = "";
    myJsVal += "<li class=\"img-slider-li\">";
    myJsVal += "   <a href=\"" + _dataHref + "\">";
    myJsVal += "       <div class=\"img-slider img-slider-insert\" style=\"background: url(" + _dataImg + ") no-repeat; background-size: cover;\"></div>";
    myJsVal += "   </a>";
    myJsVal += "</li>";

    //插入新的SliderItem
    $("#sliderMainContent").html(initSliderHtml(myJsVal));

    //定义Slider对象
    _slider = null;

    //重新初始化Slider
    initSliderGoodsImg();


    //移除选择样式
    var _imgArr = $(".spec-list-item img");
    for (var i = 0; i < _imgArr.length; i++) {
        //console.log(_imgArr[i]);
        $(_imgArr[i]).removeClass("current-spec-img");
    }

    //设置当前Img选择样式
    $(event.currentTarget).addClass("current-spec-img");
}

/**
 * 初始化主轮播图的Html代码
 * @param {any} pInsertHtml 临时插入的Html代码
 */
function initSliderHtml(pInsertHtml) {
    var myJsVal = "";
    myJsVal += " <ul id=\"content-slider\" class=\"content-slider\">";
    myJsVal += pInsertHtml

    for (var i = 0; i < mGoodsImgListJson.length; i++) {

        //获取图片URL中的 域名和图片相对路径  
        var _domainAndImgPathArr = getImgURLDomainAndImgPathArr(mGoodsImgListJson[i].ImgPath).split("^");

        myJsVal += "<li>";
        myJsVal += "    <a href=\"javascript:void(0)\">";
        myJsVal += "        <div class=\"img-slider img-slider-" + (i + 1) + "\"><img src=\"//" + _domainAndImgPathArr[0] + "/ToolWeb/ShowImgScale.aspx?FilePathFrom=" + _domainAndImgPathArr[1] + "&LimitWidthNum=800&LimitHeightNum=800\" /></div>";
        myJsVal += "    </a>";
        myJsVal += "</li>";
    }

    myJsVal += "</ul>";
    return myJsVal;
}



/**
 * 展示规格图片
 * @param {any} pImgSrc 规格图片的Src路径
 */
function showBigGoodsSpecImg(event) {

    //移除选择样式
    var _imgArr = $(".spec-list-right a img");
    for (var i = 0; i < _imgArr.length; i++) {
        //console.log(_imgArr[i]);
        $(_imgArr[i]).removeClass("current-spec-img");
    }

    //console.log(event.currentTarget);
    //console.log($(event.currentTarget).attr("data-href"));

    var _dataHref = $(event.currentTarget).attr("data-href");
    //设置当前Img选择样式
    $(event.currentTarget).children("img").addClass("current-spec-img");

    popImgWin(_dataHref, '', '', '80');
}

/**
 * ----打开选择规格参数的窗口-----
 */
var mSelSpecWinHtml = "";
function openSelSpecWin(pNoGroup, pGroupID) {

    if (pNoGroup == undefined || pNoGroup == "" || pNoGroup == null) {
        pNoGroup = "";
    }

    if (pGroupID == undefined || pGroupID == "" || pGroupID == null) {
        pGroupID = "0";
        mGroupID = 0;
    }
    else {
        mGroupID = pGroupID;
    }



    if (mSelSpecWinHtml == "") {
        mSelSpecWinHtml = getSelSpecWinHtml();
    }
    //初始化SliderDown窗口
    initSilderDownWin(610, mSelSpecWinHtml);

    toggleSilderDownWin();

    if (pNoGroup == "NoGroup") {

        //当前折扣为商品原本折扣
        mDiscount = mNoGroupDiscount;
        mIsNoGroupOrder = true;

        //----单独购买的价格----//
        //var _goodsPriceLow = "";
        //if (mNoGroupDiscount > 0) {
        //    _goodsPriceLow = parseFloat(mGoodsPriceLowSelf) * (parseFloat(mNoGroupDiscount) * 0.1);
        //}
        //else {
        //    _goodsPriceLow = mGoodsPriceLowSelf;
        //}
        //$(".win-spec-top-right #WinSpecPriceDiv").html("&#165;" + formatNumberDotDigit(_goodsPriceLow,2));
        $(".win-spec-top-right #WinSpecPriceDiv").html($("#NoGroupPriceB").html());

    }
    else {
        //当前折扣为拼团折扣
        mDiscount = mGroupDiscount;

        mIsNoGroupOrder = false; //拼团购买
    }

    //重新加载商品的规格和属性值 主要是打开弹窗
    reloadSpecPropMsg();
}

/**
 * 得到选择规格的窗口显示代码
 */
function getSelSpecWinHtml() {

    var _html = $("#SelSpecWin").html();

    $("#SelSpecMain").html("");
    $("#SelSpecMain").remove();
    $("body").remove("#SelSpecMain");

    mSelSpecWinHtml = "";

    return _html
}

/**
 * 重新加载商品的规格和属性值 主要是打开弹窗
 * */
function reloadSpecPropMsg() {

    if (mloadSpecPropMsgJson != null && mloadSpecPropMsgJson != "") {
        if (mloadSpecPropMsgJson.length <= 0) {
            //隐藏规格选择
            $("#SpecList").hide();
            $("#GoodsSpec").hide();
            return;
        }

        //获取默认选择的规格ID和属性ID
        var _selSpecID = "", _selPropID = "";
        if (mSelSpecPropIDArr.indexOf("^") >= 0) {
            var _selSpecPropIDArr = mSelSpecPropIDArr.split("^");
            _selSpecID = _selSpecPropIDArr[0];
            _selPropID = _selSpecPropIDArr[1];
        }
        else {
            _selSpecID = mSelSpecPropIDArr;
        }
        $("#WinGoodsIDDiv").html("商品编码：" + mGID);

        //显示商品规格属性
        showGoodsSpecProp(mloadSpecPropMsgJson, _selSpecID, _selPropID);
        //显示规格属性图片列表
        showSpecPropImgList(mloadSpecPropMsgJson);
    }
    else {

        //重新加载商品的规格和属性值
        loadSpecPropMsg(mIsSpecParam);


    }
}



/**
 * ----------打开选择收货地址窗口 -------------
 */
var mSelReceiAddrWinHtml = "";
function openSelReceiAddrWin() {

    //判断买家是否登录 
    if (isBuyerLogin() == false) {
        return;
    }

    if (mSelReceiAddrWinHtml == "") {

        mSelReceiAddrWinHtml = getSelReceiAddrWinHtml();
    }
    //初始化SliderDown窗口
    initSilderDownWin(600, mSelReceiAddrWinHtml);

    toggleSilderDownWin();

    //加载买家收货地址
    loadBuyerReceiAddrList();
}
/**
 * 得到选择收货地址窗口显示代码
 */
function getSelReceiAddrWinHtml() {

    var _html = $("#WinSelReceiAddr").html();

    $("#WinSelReceiAddr").html("");
    $("#WinSelReceiAddr").remove();
    $("body").remove("#WinSelReceiAddr");

    mSelReceiAddrWinHtml = "";

    return _html
}

/**
 * 选择当前的收货地址,并存入Cookie中
 * @param {any} pBReceiAddrID  买家收货地址ID
 * @param {any} pRegionCodeArr 地区范围代码 用"_"连接
 * @param {any} pRegionNameArr 地区范围名称 用"_"连接
 */
function selReceiAddrCurrent(pBReceiAddrID, pRegionCodeArr, pRegionNameArr) {

    //构造POST参数
    var dataPOST = {
        "Type": "4", "BReceiAddrID": pBReceiAddrID, "RegionCodeArr": pRegionCodeArr, "RegionNameArr": pRegionNameArr,
    };
    console.log(dataPOST);
    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: "../BuyerAjax/ReceiAddrList?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            if (reTxt != "") {
                if (reTxt == "41") {
                    $("#ExpressAddressDiv").html(pRegionNameArr);
                    //关闭选择收货地址窗口
                    toggleSilderDownWin();

                    //选择收货地址Cookie =  BReceiAddrID ^ 430000_430100_430121 ^ 湖南省_长沙市_长沙县
                    //赋值给隐藏记录控件
                    $("#hidBuyerReceiAddrSelCookieArr").val(pBReceiAddrID + "^" + pRegionCodeArr + "^" + pRegionNameArr);

                    //初始化统计商品运费
                    initFreightMoney();

                    return;
                }
            }
        }
    });

}


/**
 * 获取图片URL中的 域名和图片相对路径  
 * @param pImgUrl 图片URL地址 [localhost:1400/Upload/ShopHeaderImg/SHI_1_201906160949557860.jpg]
 * */
function getImgURLDomainAndImgPathArr(pImgUrl) {

    //获取图片域名 localhost:1400/Upload/ShopHeaderImg/SHI_1_201906160949557860.jpg
    var _domain = pImgUrl.substring(0, pImgUrl.indexOf("/"));
    //console.log("_domain=" + _domain);
    //获取图片相对路径 
    var _imgPath = pImgUrl.replace(_domain + "/", "");
    //console.log("_imgPath=" + _imgPath);

    return _domain + "^" + _imgPath;
}

/**
 * 判断买家是否登录 
 * @param pIsWin 是否为窗口立即订购 [默认 false 不是窗口]
 * */
function isBuyerLogin(pIsWin) {
    if (mBuyerUserID == "" || mBuyerUserID == undefined) {

        if (pIsWin) {
            //toastWinToDivCb("请先登录！", function () {

            alert("请先登录,再购买！");
            //跳转到登录页面
            window.location.href = "../Login/Buyer?BackUrl=" + window.location.href + "";

            //}, "SliderDownWin");
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

/*************优惠券相关****************/

/**
 * 打开领取优惠券的窗口 
 */
var mGetTicketWinHtml = "";
function openGetTicketWin() {

    if (mGetTicketWinHtml == "") {

        mGetTicketWinHtml = getGetTicketWinHtml();
    }
    //初始化SliderDown窗口
    initSilderDownWin(600, mGetTicketWinHtml);

    toggleSilderDownWin();
}
/**
 * 得到领取优惠券的窗口显示代码
 */
function getGetTicketWinHtml() {

    //构造领取优惠券窗口显示代码
    var _html = xhtmlSelCouponsWin();   //$("#WinGetTicket").html();

    $("#WinGetTicket").html("");
    $("#WinGetTicket").remove();
    $("body").remove("#WinGetTicket");

    mGetTicketWinHtml = "";

    return _html
}

/**
 * 得到 商品可以使用的优惠券列表  买家UserID不判断 
 * */
function goodsAbleUseCouponsList() {
    //构造POST参数
    var dataPOST = {
        "Type": "5", "ShopUserID": mShopUserID, "GoodsID": mGID,
    };
    console.log(dataPOST);
    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: mAjaxUrl + "?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("mGoodsAbleUseCouponsListJson=" + reTxt);
            if (reTxt != "") {
                var _jsonReTxt = JSON.parse(reTxt);

                mGoodsAbleUseCouponsListJson = _jsonReTxt;

                //显示两条优惠券信息
                showGoodsCouponsTwo();

            }
        }
    });
}

/**
 * 显示两条优惠券信息
 * */
function showGoodsCouponsTwo() {

    if (mGoodsAbleUseCouponsListJson == undefined || mGoodsAbleUseCouponsListJson == null || mGoodsAbleUseCouponsListJson == "") {
        return;
    }

    $("#GoodsCouponsSelDiv").show();

    //优惠券信息列表
    var _goodsAbleUseCouponsArr = mGoodsAbleUseCouponsListJson.GoodsAbleUseCouponsList;

    //构造显示代码,只显示两个
    var _xhtml = "";
    for (var i = 0; i < _goodsAbleUseCouponsArr.length; i++) {

        if (i >= 2) {
            break;
        }

        //抵用券
        if (_goodsAbleUseCouponsArr[i].UseMoney != 0 && _goodsAbleUseCouponsArr[i].UseDiscount == 0) {
            if (_goodsAbleUseCouponsArr[i].ExpenseReachSum != 0) {
                _xhtml += "<b class=\"ticket-b\">满" + _goodsAbleUseCouponsArr[i].ExpenseReachSum + "减" + _goodsAbleUseCouponsArr[i].UseMoney + "</b>";
            }
            else {
                _xhtml += "<b class=\"ticket-b\">" + _goodsAbleUseCouponsArr[i].UseMoney + "元抵用券</b>";
            }
        }
        //折扣券
        else if (_goodsAbleUseCouponsArr[i].UseMoney == 0 && _goodsAbleUseCouponsArr[i].UseDiscount != 0) {
            if (_goodsAbleUseCouponsArr[i].ExpenseReachSum != 0) {
                _xhtml += "<b class=\"ticket-b\">满" + _goodsAbleUseCouponsArr[i].ExpenseReachSum + "打" + _goodsAbleUseCouponsArr[i].UseDiscount + "折</b>";
            }
            else {
                _xhtml += "<b class=\"ticket-b\">" + _goodsAbleUseCouponsArr[i].UseDiscount + "折-折扣券</b>";
            }
        }
    }
    $("#GoodsCouponsTwoShow").html("<span>领券：</span> " + _xhtml);
}

/**
 * 构造领取优惠券窗口显示代码
 * */
function xhtmlSelCouponsWin() {

    if (mGoodsAbleUseCouponsListJson == undefined || mGoodsAbleUseCouponsListJson == null || mGoodsAbleUseCouponsListJson == "") {
        return;
    }

    //优惠券信息列表
    var _goodsAbleUseCouponsArr = mGoodsAbleUseCouponsListJson.GoodsAbleUseCouponsList;

    var myJsVal = "";
    myJsVal += "<div class=\"win-ticket-content\">";
    myJsVal += "            <div class=\"win-ticket-title\">";
    myJsVal += " 优惠券";
    myJsVal += " <button type=\"button\" class=\"am-close\" onclick=\"toggleSilderDownWin()\">&times;</button>";
    myJsVal += "            </div>";
    myJsVal += "            <div class=\"win-ticket-integral\">";
    myJsVal += " <div>";
    myJsVal += "  领券";
    myJsVal += " </div>";
    myJsVal += " <div>";
    myJsVal += "  您的积分: --";
    myJsVal += " </div>";
    myJsVal += "            </div>";
    myJsVal += "            <div class=\"win-ticket-list\">";

    //循环构造列表
    for (var i = 0; i < _goodsAbleUseCouponsArr.length; i++) {

        var _reduceMoneyShow = "";
        var _couponsName = "";
        //抵用券
        if (_goodsAbleUseCouponsArr[i].UseMoney != 0) {
            //减去的金额
            _reduceMoneyShow = "&#165;" + _goodsAbleUseCouponsArr[i].UseMoney;
            _couponsName = "店铺券";
        }
        else { //折扣券
            _reduceMoneyShow = _goodsAbleUseCouponsArr[i].UseDiscount + "折";
            _couponsName = "店铺折扣券";
        }

        //消费满多少使用
        var _expenseReachSum = "无消费限制";
        if (_goodsAbleUseCouponsArr[i].ExpenseReachSum > 0) {
            _expenseReachSum = "满" + _goodsAbleUseCouponsArr[i].ExpenseReachSum + "使用";
        }

        //计算两日期间隔的天数 有效期限
        var _useTimeRangeShow = "";
        if (_goodsAbleUseCouponsArr[i].UseTimeRange == "" || _goodsAbleUseCouponsArr[i].UseTimeRange == null || _goodsAbleUseCouponsArr[i].UseTimeRange.indexOf("^") < 0) {
            _useTimeRangeShow = " 永久有效 ";
        }
        else {
            //分割日期
            _useTimeRangeArr = _goodsAbleUseCouponsArr[i].UseTimeRange.split("^");
            //计算两日期的间隔天数 
            var _diffDay = diffDateDay(getTodayDate(), _useTimeRangeArr[1]);

            _useTimeRangeShow = _goodsAbleUseCouponsArr[i].UseTimeRange.replace("^", " 至 ") + " (" + _diffDay + "天)";
        }

        myJsVal += "<div class=\"win-ticket-item\" id=\"TicketItem_" + _goodsAbleUseCouponsArr[i].CouponsID + "\">";
        myJsVal += "    <div class=\"win-ticket-item-left\">";
        myJsVal += "        <ul>";
        myJsVal += "            <li><b>" + _reduceMoneyShow + "</b> " + _couponsName + " (需积分:0)</li>";
        myJsVal += "            <li>" + _expenseReachSum + "</li>";
        myJsVal += "            <li>有效期:" + _useTimeRangeShow + "</li>";
        myJsVal += "        </ul>";
        myJsVal += "    </div>";
        myJsVal += "    <div class=\"win-ticket-item-right\" onclick=\"buyerGetCoupons(" + _goodsAbleUseCouponsArr[i].CouponsID + ")\" id=\"GetCouponsBtn_" + _goodsAbleUseCouponsArr[i].CouponsID + "\">";
        myJsVal += "立即领取";
        myJsVal += "    </div>";
        myJsVal += "</div>";
    }

    myJsVal += "            </div>";
    myJsVal += "</div>";

    return myJsVal;
}

/**
 * 买家领取优惠券
 * @param pCouponsID 优惠券ID
 * */
var mIsHttpSending = false;
function buyerGetCoupons(pCouponsID) {

    //判断买家是否登录 
    if (mBuyerUserID == "" || mBuyerUserID == undefined) {
        //关闭滑出窗口
        toggleSilderDownWin();

        toastWinCb("请先登录！", function () {

            //console.log(window.location.href);

            //跳转到登录页面
            window.location.href = "../Login/Buyer?BackUrl=" + window.location.href + "";
        }, 2500);
        return;
    }

    if (mIsHttpSending == true) {
        return;
    }

    //构造POST参数
    var dataPOST = {
        "Type": "6", "CouponsID": pCouponsID,
    };
    //加载提示
    $("#GetCouponsBtn_" + pCouponsID).html("领取中");
    //设置优惠券项 为 灰色
    setGrayTicketDiv(pCouponsID);

    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: mAjaxUrl + "?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log(reTxt);
            //Http请求结束
            mIsHttpSending = false;
            if (reTxt != "") {

                var _jsonReTxt = JSON.parse(reTxt);

                //已领取
                if (_jsonReTxt.Code == "BGC_01" || _jsonReTxt.ErrCode == "BGC_02") {
                    $("#GetCouponsBtn_" + pCouponsID).html("已领取");
                    return;
                }
                else {
                    $("#GetCouponsBtn_" + pCouponsID).html("领取失败");
                    reTxt;
                }
            }
        }
    });
}

/**
 * 设置优惠券项 为 灰色
 * @param {any} pCouponsID
 */
function setGrayTicketDiv(pCouponsID) {

    $("#TicketItem_" + pCouponsID).css("background", "#DEDEDE");
    $("#TicketItem_" + pCouponsID + " div").css("color", "#6A6A6A");

}

/**
 * 初始化统计商品运费
 * */
function initFreightMoney() {

    //获取当前收货地址的省份Code BReceiAddrID ^ 430000_430100_430121 ^ 湖南省_长沙市_长沙县
    var RegionProCode = "";
    var hidBuyerReceiAddrSelCookieArr = $("#hidBuyerReceiAddrSelCookieArr").val().trim();
    if (hidBuyerReceiAddrSelCookieArr != "" && hidBuyerReceiAddrSelCookieArr != undefined) {
        RegionProCode = hidBuyerReceiAddrSelCookieArr.split("^")[1].split("_")[0];
    }

    console.log("mFtID=" + mFtID);

    if (mFtID == "0" || mFtID == "" || RegionProCode == "") {
        $("#FreightMoneyB").html("免运费");
        return;
    }

    //构造POST参数
    var dataPOST = {
        "Type": "7", "FtID": mFtID, "RegionProCode": RegionProCode,
    };
    console.log(dataPOST);
    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: mAjaxUrl + "?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log(reTxt);
            if (reTxt != "") {
                var _jsonReTxt = JSON.parse(reTxt);
                var _freightMoney = _jsonReTxt.DataDic.FreightMoney;
                console.log("_freightMoney=" + _freightMoney);
                if (parseFloat(_freightMoney) <= 0) {
                    $("#FreightMoneyB").html("免运费");
                }
                else {
                    $("#FreightMoneyB").html("&#165;" + formatNumberDotDigit(_freightMoney, 2));
                }

            }
        }
    });
}

/**
 * 弹出窗口立即订购按钮 -- 拼团下单
 * @param pIsWin 是否为窗口立即订购 [默认 false 不是窗口]
 * */
function btnOrderNow(pIsWin) {

    //判断买家是否登录
    var _isLogin = isBuyerLogin(pIsWin);
    if (_isLogin == false) {
        return;
    }

    if (pIsWin == undefined || pIsWin == "") {
        pIsWin = false;
    }

    //选择收货地址Cookie =  BReceiAddrID ^ 430000_430100_430121 ^ 湖南省_长沙市_长沙县
    var _hidBuyerReceiAddrSelCookieArr = $("#hidBuyerReceiAddrSelCookieArr").val().trim();

    //alert("执行了" + mSelSpecPropIDArr);
    console.log("mSelSpecPropIDArr=" + mSelSpecPropIDArr);

    //当前的规格属性值
    var SelSpecPropIDVal = "";

    if (pIsWin) {
        if (mSelCurrentSpecID != "") {
            SelSpecPropIDVal = mSelCurrentSpecID;
        }
        //如果有属性值则以属性值为准
        if (mSelCurrentPropID != "") {
            SelSpecPropIDVal = mSelCurrentPropID;
        }
        console.log("SelSpecPropIDVal=" + SelSpecPropIDVal);
    }
    else {
        if (mSelSpecPropIDArr != "") {
            if (mSelSpecPropIDArr.indexOf("^") < 0) {
                SelSpecPropIDVal = mSelSpecPropIDArr
            }
            else {
                SelSpecPropIDVal = mSelSpecPropIDArr.split("^")[1];
            }
        }

    }

    //获取订购的数量
    var InputOrderNumber = $("#InputOrderNumber").val().trim();

    //商品ID  mGID

    //------异步请求验证商品状态，如库存，是否下架----//
    //构造POST参数
    var dataPOST = {
        "Type": "1", "GID": mGID, "SelSpecPropIDVal": SelSpecPropIDVal, "OrderNumber": InputOrderNumber, "BuyerReceiAddrSelCookieArr": _hidBuyerReceiAddrSelCookieArr, "IsNoGroupOrder": mIsNoGroupOrder,
    };
    console.log(dataPOST);
    //加载提示
    //$(".btn-order").html("…订购中…");
    $(".win-btn-order").html("…订购中…");

    if (mIsOrderAsk == true) {
        return;
    }
    mIsOrderAsk = true;

    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: "../GroupAjax/GroupDetail?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            //$(".btn-order").html("立即购买");
            $(".win-btn-order").html("确定");
            console.log(reTxt);
            if (reTxt != "") {

                mIsOrderAsk = false; //请求返回了

                var _jsonReTxt = JSON.parse(reTxt);

                if (_jsonReTxt.ErrMsg != null && _jsonReTxt.ErrMsg != "") {

                    //if (pIsWin) {
                    //    toastWinToDiv(_jsonReTxt.ErrMsg, "SliderDownWin",100);

                    //}
                    //else {
                    //    toastWin(_jsonReTxt.ErrMsg);
                    //}
                    alert(_jsonReTxt.ErrMsg);
                    return;
                }

                if (_jsonReTxt.Msg != null && _jsonReTxt.Msg != "") {

                    if (mIsNoGroupOrder == true) //非拼团购买
                    {
                        window.location.href = "../Order/PlaceOrder";
                    }
                    else //拼团购买
                    {
                        window.location.href = "../Order/PlaceOrder?IsGroup=" + !mIsNoGroupOrder + "&GroupID=" + mGroupID;
                    }
                }

            }
        }
    });
}

/**
 * 加入购物车按钮请求
 * @param pIsWin 是否为窗口立即订购 [默认 false 不是窗口]
 * */
function btnAddToSCart(pIsWin) {

    //判断买家是否登录
    var _isLogin = isBuyerLogin(pIsWin);
    if (_isLogin == false) {
        return;
    }

    if (pIsWin == undefined || pIsWin == "") {
        pIsWin = false;
    }

    //获取表单值
    var GoodsID = $("#hidGID").val().trim();
    var BuyerUserID = $("#hidBuyerUserID").val().trim();
    var OrderNum = $("#InputOrderNumber").val().trim();

    var SpecIDOrPropID = mSelCurrentSpecID; //当前选择的规格ID
    //属性ID是否为空,不为空则 则传递属性ID
    if (mSelCurrentPropID != "") {
        SpecIDOrPropID = mSelCurrentPropID;
    }

    //构造POST参数
    var dataPOST = {
        "Type": "9", "GoodsID": GoodsID, "BuyerUserID": BuyerUserID, "SpecIDOrPropID": SpecIDOrPropID, "OrderNum": OrderNum,
    };
    console.log(dataPOST);
    //加载提示
    $(".btn-scart").html("…加入中…");
    $(".win-btn-scart").html("…加入中…");

    if (mIsOrderAsk == true) {
        return;
    }
    mIsOrderAsk = true;

    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: mAjaxUrl + "?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            $(".btn-scart").html("加入购物车");
            $(".win-btn-scart").html("加入购物车");
            console.log(reTxt);

            mIsOrderAsk = false; //请求返回了

            if (reTxt != "") {

                //请先登录
                if (reTxt == "92") {
                    toastWinCb("请先登录!", function () {
                        window.location.href = "../Login/Buyer";
                    });
                }

                var _jsonReTxt = JSON.parse(reTxt);
                if (_jsonReTxt.ErrCode == "ATSC_02") {
                    _jsonReTxt.ErrMsg = "加入购物车成功";
                    if (pIsWin) {
                        //关闭窗口
                        toggleSilderDownWin();
                    }
                }
                if (_jsonReTxt.ErrMsg != null && _jsonReTxt.ErrMsg != "") {

                    if (pIsWin) {
                        if (_jsonReTxt.ErrCode == "ATSC_02") {
                            toastWin(_jsonReTxt.ErrMsg);
                        }
                        else {
                            toastWinToDiv(_jsonReTxt.ErrMsg, "SliderDownWin");
                        }
                    }
                    else {
                        toastWin(_jsonReTxt.ErrMsg);
                    }
                    return;
                }
                if (_jsonReTxt.Msg != null && _jsonReTxt.ErrMsg != "") {

                    if (pIsWin) {
                        //关闭窗口
                        toggleSilderDownWin();
                    }

                    toastWin(_jsonReTxt.Msg);

                    return;
                }
            }
        }
    });
}

/**
 *  初始化商品评价,指定记录条数
 * */
function initGoodsAppraiseSelTop() {

    //构造POST参数
    var dataPOST = {
        "Type": "2", "GoodsID": mGID,
    };

    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: "../BuyerAjax/AppraiseDetail?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("初始化商品评价=" + reTxt);
            if (reTxt != "") {

                var _jsonReTxt = JSON.parse(reTxt);

                //构造商品评价显示代码
                var _xhtml = xhtmlItemGoodsAppraiseImg(_jsonReTxt);
                $("#AppraiseContentList").html(_xhtml);

                //初始化PhotoSwipe的数据
                initPhotoSwipeData();

            }
        }
    });

}

/**
 * 构造商品评价显示代码
 * @param {any} pGooAppraiseJsonReTxt 返回的评价信息Json对象
 */
function xhtmlItemGoodsAppraiseImg(pGooAppraiseJsonReTxt) {

    var myJsVal = "";    for (var i = 0; i < pGooAppraiseJsonReTxt.ListGooAppraise.length; i++) {        var GooAppraise = pGooAppraiseJsonReTxt.ListGooAppraise[i];        var GooAppraiseImgList = pGooAppraiseJsonReTxt.ListGooAppraiseImg[i];        if (GooAppraise.IsAnonymity == "true") {            GooAppraise.UserNick = "匿名";
            GooAppraise.HeaderImg = "../Assets/Imgs/Icon/buyer_group.png";
        }        else {            GooAppraise.HeaderImg = "" + GooAppraise.HeaderImg + "";
        }        //构造晒单图片        var _xhtmlAppraiseImg = "";        for (var j = 0; j < GooAppraiseImgList.ListGooAppraiseImgs.length; j++) {            var GooAppraiseImg = GooAppraiseImgList.ListGooAppraiseImgs[j];
            _xhtmlAppraiseImg += "<img class=\"appraise-img-label\" style=\"width: 80px; height:80px\" src=\"//" + GooAppraiseImg.ImgUrl + "\" onclick=\"openPhotoSwipe(" + mAppraiseImgIndex + ")\" />";
            //索引
            mAppraiseImgIndex++;

        }
        myJsVal += "<div class=\"appraise-content-item\">";        myJsVal += "  <div class=\"appraise-list-1\">";        myJsVal += "      <div class=\"appraise-list-header\">";        myJsVal += "          <img src=\"" + GooAppraise.HeaderImg + "\" />" + GooAppraise.UserNick + "";        myJsVal += "      </div>";        myJsVal += "      <div class=\"appraise-list-star\">";        myJsVal += appraiseScoreStar(GooAppraise.AppScore);        myJsVal += "      </div>";        myJsVal += "  </div>";        myJsVal += "  <div class=\"appraise-list-2\">";        myJsVal += GooAppraise.AppContent        myJsVal += "  </div>";        myJsVal += "  <div class=\"appraise-list-3\">";        myJsVal += "      <div class=\"appraise-list-img\">";        myJsVal += _xhtmlAppraiseImg;        //myJsVal += "          <a href=\"#\"><img src=\"../Assets/Imgs/01.jpg\" /></a>";        //myJsVal += "          <a href=\"#\">";        //myJsVal += "              <img src=\"../Assets/Imgs/02.jpg\" />";        //myJsVal += "          </a>";        //myJsVal += "          <a href=\"#\">";        //myJsVal += "              <img src=\"../Assets/Imgs/03.jpg\" />";        //myJsVal += "          </a>";        //myJsVal += "          <a href=\"#\">";        //myJsVal += "              <img src=\"../Assets/Imgs/01.jpg\" />";        //myJsVal += "          </a>";        myJsVal += "      </div>";        myJsVal += "      <div class=\"appraise-list-count\">";        //myJsVal += "          共" + GooAppraiseImgList.ListGooAppraiseImgs.length + "张";        myJsVal += "      </div>";        myJsVal += "  </div>";        myJsVal += "  <div class=\"appraise-list-4\">";        myJsVal += "" + GooAppraise.SpecParamVal + "";        myJsVal += "  </div>";        myJsVal += "</div>";    }    return myJsVal;
}


/**
 * 星星评分函数 返回星星显示代码
 * @param {any} pAppraiseScore 评价分数
 */
function appraiseScoreStar(pAppraiseScore) {


    //console.log("pAppraiseScore=" + pAppraiseScore + " | pAppraiseIndex=" + pAppraiseIndex);

    //构造评分Img
    var _imgScoreHtml = "";

    if (pAppraiseScore == "1") {
        _imgScoreHtml += "<img src=\"../Assets/Imgs/Icon/appraise_star.png\" />";
    }
    else if (pAppraiseScore == "2") {
        _imgScoreHtml += "<img src=\"../Assets/Imgs/Icon/appraise_star.png\" />";
        _imgScoreHtml += "<img src=\"../Assets/Imgs/Icon/appraise_star.png\" />";
    }
    else if (pAppraiseScore == "3") {
        _imgScoreHtml += "<img src=\"../Assets/Imgs/Icon/appraise_star.png\" />";
        _imgScoreHtml += "<img src=\"../Assets/Imgs/Icon/appraise_star.png\" />";
        _imgScoreHtml += "<img src=\"../Assets/Imgs/Icon/appraise_star.png\" />";
    }
    else if (pAppraiseScore == "4") {
        _imgScoreHtml += "<img src=\"../Assets/Imgs/Icon/appraise_star.png\" />";
        _imgScoreHtml += "<img src=\"../Assets/Imgs/Icon/appraise_star.png\" />";
        _imgScoreHtml += "<img src=\"../Assets/Imgs/Icon/appraise_star.png\" />";
        _imgScoreHtml += "<img src=\"../Assets/Imgs/Icon/appraise_star.png\" />";
    }
    else if (pAppraiseScore == "5") {
        _imgScoreHtml += "<img src=\"../Assets/Imgs/Icon/appraise_star.png\" />";
        _imgScoreHtml += "<img src=\"../Assets/Imgs/Icon/appraise_star.png\" />";
        _imgScoreHtml += "<img src=\"../Assets/Imgs/Icon/appraise_star.png\" />";
        _imgScoreHtml += "<img src=\"../Assets/Imgs/Icon/appraise_star.png\" />";
        _imgScoreHtml += "<img src=\"../Assets/Imgs/Icon/appraise_star.png\" />";
    }

    for (var i = 0; i < 5 - parseInt(pAppraiseScore); i++) {

        var _appraiseScore = parseInt(pAppraiseScore) + i + 1;

        _imgScoreHtml += "<img src=\"../Assets/Imgs/Icon/appraise_star_gray.png\" />";
    }

    return _imgScoreHtml;
}


/**
 * 统计商品评价信息
 * */
function countAppraiseMsg() {
    //构造POST参数
    var dataPOST = {
        "Type": "2", "GoodsID": mGID,
    };

    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: "../GoodsAjax/GoodsAppraise?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("统计商品评价信息=" + reTxt);
            if (reTxt != "") {

                var _jsonReTxt = JSON.parse(reTxt);

                $("#CountAppraiseB").html(_jsonReTxt.CountAppraise);
                $("#GoodAppraisePercentB").html(parseInt(_jsonReTxt.GoodAppraisePercent * 100) + "%");

            }
        }
    });
}


//===================浏览晒单图片=========================//

/**
 * 初始化PhotoSwipe的数据
 * */
function initPhotoSwipeData() {

    //获取晒单图片标签
    var _appraiseImgLabelArr = $(".appraise-img-label");
    //console.log($(_appraiseImgLabelArr[0]).attr("src"));


    mPhotoSwipeDataList = [];

    for (var i = 0; i < _appraiseImgLabelArr.length; i++) {


        mPhotoSwipeDataList[i] = {
            src: $(_appraiseImgLabelArr[i]).attr("src"),
            title: '<div style=\"font-size: 20px;\"></span>',
            w: 0,
            h: 0
        };

    }
    console.log(mPhotoSwipeDataList);
}

/**
 * 打开晒单图片浏览
 * @param {any} pImgIndex
 */
function openPhotoSwipe(pImgIndex) {


    if (mPhotoSwipeDataList == null) {
        return
    }

    //初始化 PhotoSwipe 相册浏览   -- $(function(){  在这里调用，必须是加载完成所有文件 });
    initPhotoSwipeAlbum(mPhotoSwipeDataList, pImgIndex);
}



//=======================打开地图导航=========================//


/**
 * ----打开地图导航Slider窗口-----
 */
var mShopNavWinHtml = "";
function openShopNavWin() {

    if (mShopNavWinHtml == "") {
        mShopNavWinHtml = $("#WinSelShopNav").html();
    }
    //初始化SliderDown窗口
    initSilderDownWin(400, mShopNavWinHtml);
    //打开Slider窗口
    toggleSilderDownWin();
}

/**
 * 初始化所有的 地图导航URL连接
 * @param {any} pLatitude
 * @param {any} pLongitude
 * @param {any} pAddrName
 * @param {any} pAddrDetail
 */
function allMapURL(pLatitude, pLongitude, pAddrName, pAddrDetail) {

    initMapNavURL("qqmap", pLatitude, pLongitude, pAddrName, pAddrDetail);
    initMapNavURL("amap", pLatitude, pLongitude, pAddrName, pAddrDetail);
    initMapNavURL("bdmap", pLatitude, pLongitude, pAddrName, pAddrDetail);
}

/**
 * 初始化地图导航URL连接
 * @param {any} pMapType 地图类型  qqmap , amap ,bdmap
 * @param {any} pLatitude 纬度
 * @param {any} pLongitude 经度
 * @param {any} pAddrName 地址名称
 * @param {any} pAddrDetail 地址详细
 */
function initMapNavURL(pMapType, pLatitude, pLongitude, pAddrName, pAddrDetail) {

    //pMapType = "bdmap";
    //pLatitude = "28.247008"; //纬度
    //pLongitude = "113.063961"; //经度
    //pAddrName = "地点名称";
    //pAddrDetail = "地址详细";


    var _urlMap = "";

    if (pMapType == "qqmap") //腾讯地图
    {
        _urlMap = "https://apis.map.qq.com/uri/v1/marker?marker=coord:" + pLatitude + "," + pLongitude + ";title:" + pAddrName + ";addr:" + pAddrDetail + "&referer=myapp";

        $("#qqmapA").attr("href", _urlMap);
    }
    else if (pMapType == "amap") //高德地图
    {
        //_urlMap = "../Shop/MapUrlRedirect?BackUrl=https://uri.amap.com/marker?position=" + pLongitude + "," + pLatitude + "&name=" + pAddrName + "&src=mypage&coordinate=gaode&callnative=1";
        _urlMap = "../Shop/MapUrlRedirect?Longitude=" + pLongitude + "&Latitude=" + pLatitude + "&AddrName=" + pAddrName + "&AddrDetail=" + pAddrDetail + "&MapType=amap";

        $("#amapA").attr("href", _urlMap);
    }
    else if (pMapType == "bdmap") //百度地图
    {
        _urlMap = "../Shop/MapUrlRedirect?Longitude=" + pLongitude + "&Latitude=" + pLatitude + "&AddrName=" + pAddrName + "&AddrDetail=" + pAddrDetail + "&MapType=bdmap";
        //_urlMap = "http://api.map.baidu.com/marker?location=40.047669,116.313082&title=我的位置&content=百度奎科大厦&output=html&src=webapp.baidu.openAPIdemo";

        $("#bdmapA").attr("href", _urlMap);
    }
    else //其他方式
    {

    }

    //console.log("_urlMap=" + _urlMap);

}


//===================抢购秒杀=====================//

///**
// * 初始化抢购秒杀条
// * @param {any} pJsonSecKillMsg 抢购秒杀信息Json对象
// */
//function initSecKillBar(pJsonSecKillMsg) {

//    $("#WinBtnOrder").html("立即抢购");
//    $("#BtnOrder").html("立即抢购");

//    //判断是否为 限时秒杀 或一般抢购秒杀
//    if (pJsonSecKillMsg.EndTime != "" && pJsonSecKillMsg.EndTime != null && pJsonSecKillMsg.EndTime != undefined) {
//        $("#SecKillLeft").html("<img src=\"../Assets/Imgs/Icon/clocktimer.png\" />限时秒杀");
//        $("#SecKillMid").show();

//        //倒计时开始
//        mCountDownEndTime = pJsonSecKillMsg.EndTime;
//        countDown();
//    }
//    else {
//        $("#SecKillLeft").html("<img src=\"../Assets/Imgs/Icon/clocktimer.png\" />抢购秒杀");
//        $("#SecKillMid").hide();
//    }

//    $("#SkStockNum").html(pJsonSecKillMsg.SkStockNum);
//    $("#SkSaleNum").html(pJsonSecKillMsg.SkSaleNum);
//}

////================倒计时===============//
//var mCountDownEndTime = ""; //倒计时，结束时间

//function addZero(i) {
//    return i < 10 ? "0" + i : i + "";
//}
//function countDown() {

//    var nowtime = new Date();
//    //var endtime = new Date("2020/07/03 17:57:00");
//    var endtime = new Date(mCountDownEndTime);
//    var lefttime = parseInt((endtime.getTime() - nowtime.getTime()) / 1000);
//    var d = parseInt(lefttime / (24 * 60 * 60))
//    var h = parseInt(lefttime / (60 * 60) % 24);
//    var m = parseInt(lefttime / 60 % 60);
//    var s = parseInt(lefttime % 60);
//    d = addZero(d)
//    h = addZero(h);
//    m = addZero(m);
//    s = addZero(s);

//    var myJsVal = "";//    myJsVal += "<span>" + d + "</span>天";//    myJsVal += "<span>" + h + "</span>:";//    myJsVal += "<span>" + m + "</span>:";//    myJsVal += "<span>" + s + "</span>";
//    // document.querySelector("#SecKillMid").innerHTML = `活动倒计时  ${d}天 ${h} 时 ${m} 分 ${s} 秒`;
//    document.querySelector("#SecKillMid").innerHTML = myJsVal;

//    if (lefttime <= 0) {
//        document.querySelector("#SecKillMid").innerHTML = "活动已结束";
//        return;
//    }
//    setTimeout(countDown, 1000);
//}

//==================拼团用户列表窗口==========================//

/**
 * 打开拼团用户列表的窗口
 */
var mGetGroupUserWinHtml = "";
function openGetGroupUserWin() {

    if (mGetGroupUserWinHtml == "") {

        mGetGroupUserWinHtml = getGetGroupUserWinHtml();
    }
    //初始化SliderDown窗口
    initSilderDownWin(600, mGetGroupUserWinHtml);

    //加载可参与加入的开团信息 -- 弹出窗口
    loadingGroupCreateMsgAbleJoinWin(20);

}
/**
 * 得到领取优惠券的窗口显示代码
 */
function getGetGroupUserWinHtml() {

    //构造领取优惠券窗口显示代码
    var _html = $("#WinSelGroupUser").html();

    $("#WinSelGroupUser").html("");
    $("#WinSelGroupUser").remove();
    $("body").remove("#WinSelGroupUser");

    mGetGroupUserWinHtml = "";

    return _html
}


//=======================拼团相关======================//

/**
 * 设置单独购买的显示价格
 * */
function setShowNoGroupOrGroupPrice() {

    //计算单独购买的价格
    var _noGroupPrice = 0;

    if (parseFloat(mNoGroupDiscount) <= 0) {
        _noGroupPrice = formatNumberDotDigit(parseFloat(mGoodsPriceLowSelf), 2);
    }
    else {
        _noGroupPrice = formatNumberDotDigit(parseFloat(mGoodsPriceLowSelf) * (parseFloat(mNoGroupDiscount) / 10), 2);
    }

    $("#NoGroupPriceB").html("&#165;" + _noGroupPrice);
    $("#GroupPriceB").html($("#GoodsPriceLowB").html());



}

/**
 * 加载可参与加入的开团信息
 * @param {any} pTopNum 加载记录数
 */
function loadingGroupCreateMsgAbleJoin(pTopNum) {

    var hidGroupID = $("#hidGroupID").val().trim();

    //构造POST参数
    var dataPOST = {
        "Type": "2", "GID": mGID, "TopNum": pTopNum, "GroupID": hidGroupID,
    };
    console.log(dataPOST);
    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: "../GroupAjax/GroupDetail?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("加载可参与加入的开团信息=" + reTxt);
            if (reTxt != "") {
                var _jsonReTxt = JSON.parse(reTxt);

                var _groupCreateMsgList = _jsonReTxt.GroupCreateMsgList;
                var _groupCreateMsgExtra = _jsonReTxt.GroupCreateMsgExtra;

                $("#GroupUserJoinNum").html(_jsonReTxt.CountGroupCreateMsg);

                var myJsVal = "";                for (var i = 0; i < _groupCreateMsgList.length; i++) {                    myJsVal += "<div class=\"group-user-item\">";                    myJsVal += " <div class=\"user-item-left\">";                    myJsVal += "     <img src=\"" + _groupCreateMsgList[i].HeaderImg + "\" />";                    myJsVal += " " + _groupCreateMsgList[i].UserNick + "";                    myJsVal += " </div>";                    myJsVal += " <div class=\"user-item-mid\">";                    myJsVal += "     <div class=\"user-item-mid-top\">";                    if (_groupCreateMsgExtra[i].ShowOneFinishGroup == "True") {                        myJsVal += "还差<b>1个</b>成团";
                    }                    myJsVal += "     </div>";                    myJsVal += "     <div>";                    if (_groupCreateMsgExtra[i].ShowOverTimeDate == "True") {                        myJsVal += "剩余:" + _groupCreateMsgExtra[i].DistanceOverTimeDate.replace("0天", "");
                    }                    myJsVal += "     </div>";                    myJsVal += " </div>";                    myJsVal += " <div class=\"user-item-right\">";                    myJsVal += "     <input type=\"button\" class=\"btn-join-group\" value=\"去拼单\" onclick=\"openSelSpecWin('','" + _groupCreateMsgList[i].GroupID + "')\" />";                    myJsVal += " </div>";                    myJsVal += "</div>";
                }                //显示代码插入前台                $("#GroupUserList").html(myJsVal);            }
            else {
                //隐藏整个在拼单的条条
                $("#GroupList").hide();
            }
        }
    });
}


/**
 * 加载可参与加入的开团信息 -- 弹出窗口
 * @param {any} pTopNum 加载记录数
 */
function loadingGroupCreateMsgAbleJoinWin(pTopNum) {

    var hidGroupID = $("#hidGroupID").val().trim();


    //构造POST参数
    var dataPOST = {
        "Type": "2", "GID": mGID, "TopNum": pTopNum, "GroupID": hidGroupID,
    };
    console.log(dataPOST);
    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: "../GroupAjax/GroupDetail?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("窗口：加载可参与加入的开团信息=" + reTxt);
            if (reTxt != "") {
                var _jsonReTxt = JSON.parse(reTxt);

                var _groupCreateMsgList = _jsonReTxt.GroupCreateMsgList;
                var _groupCreateMsgExtra = _jsonReTxt.GroupCreateMsgExtra;

                var myJsVal = "";                for (var i = 0; i < _groupCreateMsgList.length; i++) {                    myJsVal += "<div class=\"group-user-item\">";                    myJsVal += " <div class=\"user-item-left\">";                    myJsVal += "     <img src=\"" + _groupCreateMsgList[i].HeaderImg + "\" />";                    myJsVal += " " + _groupCreateMsgList[i].UserNick + "";                    myJsVal += " </div>";                    myJsVal += " <div class=\"user-item-mid\">";                    myJsVal += "     <div class=\"user-item-mid-top\">";                    if (_groupCreateMsgExtra[i].ShowOneFinishGroup == "True") {                        myJsVal += "还差<b>1个</b>成团";
                    }                    myJsVal += "     </div>";                    myJsVal += "     <div>";                    if (_groupCreateMsgExtra[i].ShowOverTimeDate == "True") {                        myJsVal += "剩余:" + _groupCreateMsgExtra[i].DistanceOverTimeDate.replace("0天", "");
                    }                    myJsVal += "     </div>";                    myJsVal += " </div>";                    myJsVal += " <div class=\"user-item-right\">";                    myJsVal += "     <input type=\"button\" class=\"btn-join-group\" value=\"去拼单\" onclick=\"openSelSpecWin('','" + _groupCreateMsgList[i].GroupID + "')\" />";                    myJsVal += " </div>";                    myJsVal += "</div>";

                }                //显示代码插入前台                $("#WinGroupUserList").html(myJsVal);                //打开下拉弹出窗口                toggleSilderDownWin();
            }
            else {
                $("#WinGroupUserList").html("无拼团信息");
            }
        }
    });

}


//============关注与收藏============//

/**
 * /添加关注收藏信息 (收藏商品或店铺)
 * */
function addBuyerFocusFav() {

    if (mGID == "0" || mGID == "") {
        return;
    }

    //判断买家是否登录
    var _isLogin = isBuyerLogin(false);

    //构造POST参数
    var dataPOST = {
        "Type": "1", "FocusFavType": "goods", "GoodsID": mGID,
    };

    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: "../BuyerAjax/BuyerFocusFav?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("添加关注收藏信息=" + reTxt);
            if (reTxt != "") {

                var _jsonReTxt = JSON.parse(reTxt);

                //错误提示
                if (_jsonReTxt.ErrMsg != "" && _jsonReTxt.ErrMsg != null && _jsonReTxt.ErrMsg != undefined) {
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



//===========添加浏览足迹===========//

/**
 * 添加浏览足
 * */
function addBuyerBrowseHistory() {

    if (mGID == "0" || mGID == "") {
        return;
    }

    if (mBuyerUserID == "" || mBuyerUserID == undefined || mBuyerUserID == null) {
        return;
    }

    //判断买家是否登录
    var _isLogin = isBuyerLogin(false);

    //构造POST参数
    var dataPOST = {
        "Type": "2", "GoodsID": mGID,
    };

    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: "../BuyerAjax/BuyerBrowseHistory?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("添加浏览足=" + reTxt);
            if (reTxt != "") {

                //var _jsonReTxt = JSON.parse(reTxt);

            }
        }
    });
}

/**
 * ---------加载店铺条相关信息(前端) - 如:商品详情页的店铺信息-----------
 * */
function loadShopBarMsg() {

    //构造POST参数
    var dataPOST = {
        "Type": "2", "ShopID": mShopID, "ShopUserID": mShopUserID, "IsLoadGoods": "true",
    };

    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: "../ShopAjax/ShopMsg?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("加载店铺条相关信息(前端)=" + reTxt);
            if (reTxt != "") {
                var _jsonReTxt = JSON.parse(reTxt);

                var ShopFavCount = _jsonReTxt.ShopFavCount;
                var ShopAppScoreList = _jsonReTxt.ShopAppScoreList;
                var PreListGoodsMsg = _jsonReTxt.PreListGoodsMsg;
                var ShopMsg = _jsonReTxt.ShopMsg;

                var IsSelfShop = "";
                if (ShopMsg.IsSelfShop == "true") {
                    IsSelfShop = "自营店";
                }

                $("#ShopHeaderImgDiv").html("<a href=\"javascript:void(0)\"><img src=\"//" + ShopMsg.ShopHeaderImg + "\" /></a>");

                //------店铺名称区----//
                var ShopLabelArr = splitStringJoinChar(ShopMsg.ShopLabelArr);

                var myJsValName = "";                myJsValName += " <a href=\"javascript:void(0)\">" + ShopMsg.ShopName + "</a>";                if (IsSelfShop != "") {                    myJsValName += "<span class=\"shop-label\">" + IsSelfShop + "</span>";
                }                for (var m = 0; m < ShopLabelArr.length; m++) {                    myJsValName += "<span class=\"shop-label\">" + ShopLabelArr[m] + "</span>";
                }                myJsValName += "<span class=\"shop-arrow\">&nbsp;</span>";                $("#ShopNameDiv").html(myJsValName);                //店铺评价                $("#ShopAppraiseDiv").html("综合: <b>" + ShopAppScoreList.ShopScoreAvg + "</b>物流: <b>" + ShopAppScoreList.ExpressScoreAvg + "</b>商品: <b>" + ShopAppScoreList.ConformityScoreAvg + "</b>服务: <b>" + ShopAppScoreList.AttitudeScoreAvg + "</b>配送: <b>" + ShopAppScoreList.DeliverymanScoreAvg + "</b>");                $("#FavAttenB").html(ShopFavCount);

                $("#ShopMsgNameTitleDiv").on("click", function () {
                    window.location.href = "../Shop/index?SID=" + ShopMsg.ShopID;
                });

                $("#MajorGoodsDiv").html(ShopMsg.MajorGoods);
                $("#MajorGoodsDiv").css("padding-bottom", "8px");

                //商品预览列表
                var myJsValPreGoods = "";                for (var k = 0; k < PreListGoodsMsg.length; k++) {                    if (PreListGoodsMsg[k].GoodsTitle.length > 5) {                        PreListGoodsMsg[k].GoodsTitle = PreListGoodsMsg[k].GoodsTitle.substring(0, 5)
                    }                    myJsValPreGoods += "<li><a href=\"../Goods/GoodsDetail?GID=" + PreListGoodsMsg[k].GoodsID + "\">";                    myJsValPreGoods += "<img src=\"//" + PreListGoodsMsg[k].CoverImgPath + "\" /><br />";                    myJsValPreGoods += "" + PreListGoodsMsg[k].GoodsTitle + "";                    myJsValPreGoods += "</a></li>";
                }                $("#PreListGoodsMsgUl").html(myJsValPreGoods);
                //客服，进店
                $("#CusServiceA").attr("href", "tel:" + ShopMsg.ShopMobile);
                $("#GoShopA").attr("href", "../Shop/index?SID=" + ShopMsg.ShopID);

                //构建商家店铺咨询进入IM在线客服系统 跳转 URL
                buildBuyerGoToImSysURL_ShopWap(ShopMsg.UserID, mBuyerUserID);

                //页脚下面的客服
                $("#CusServiceFooter").attr("href", "tel:" + ShopMsg.ShopMobile);


                //构建【商品】咨询进入IM在线客服系统 跳转 URL
                buildBuyerGoToImSysURL_GoodsWap(mGID, mBuyerUserID);


            }
            else {
                $("#ShopMsgBar").hide();
            }
        }
    });
}


//构建商家店铺咨询进入IM在线客服系统 跳转 URL
var mBuyerGoToImSysURL_ShopWap = "";
/**
 * -----构建商家店铺咨询进入IM在线客服系统 跳转 URL-----
 * @param {any} pShopUserID
 * @param {any} pBuyerUserID
 */
function buildBuyerGoToImSysURL_ShopWap(pShopUserID, pBuyerUserID) {

    //构造POST参数
    var dataPOST = {
        "Type": "1", "ShopUserID": pShopUserID, "BuyerUserID": pBuyerUserID,
    };
    console.log(dataPOST);

    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: "../ImSysAjax/Index?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("构建商家店铺咨询进入IM在线客服系统跳转URL=" + reTxt);

            if (reTxt != "") {
                //$("#hidBuyerGoToImSysURL_ShopWap").val(reTxt);

                mBuyerGoToImSysURL_ShopWap = reTxt;


                if (mBuyerGoToImSysURL_ShopWap != "" && mBuyerGoToImSysURL_ShopWap != null && mBuyerGoToImSysURL_ShopWap != undefined) {

                    //$("#CustomerServicesOnLineDiv").unbind();
                    ////页脚下面的客服
                    //$("#CustomerServicesOnLineDiv").on("click", function () {
                    //    window.location.href = encodeURI(mBuyerGoToImSysURL_ShopWap);
                    //});
                    $("#CusServiceA").attr("href", encodeURI(mBuyerGoToImSysURL_ShopWap));


                }
            }
        }
    });
}



//构建【商品】咨询进入IM在线客服系统 跳转 URL
var mBuyerGoToImSysURL_GoodsWap = "";
/**
 * -----构建【商品】咨询进入IM在线客服系统 跳转 URL-----
 * @param {any} pGoodsID
 * @param {any} pBuyerUserID
 */
function buildBuyerGoToImSysURL_GoodsWap(pGoodsID, pBuyerUserID) {

    if (mGoodsTitle.length > 18) {
        mGoodsTitle = mGoodsTitle.substring(0, 18);
    }

    mGoodsTitle += "-拼团";

    //构造POST参数
    var dataPOST = {
        "Type": "2", "GoodsID": pGoodsID, "BuyerUserID": pBuyerUserID, "VisitorMemo": mGoodsTitle,
    };
    console.log(dataPOST);

    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: "../ImSysAjax/Index?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("构建【商品】咨询进入IM在线客服系统跳转URL=" + reTxt);

            if (reTxt != "") {
                //$("#hidBuyerGoToImSysURL_ShopWap").val(reTxt);

                mBuyerGoToImSysURL_GoodsWap = reTxt;


                if (mBuyerGoToImSysURL_GoodsWap != "" && mBuyerGoToImSysURL_GoodsWap != null && mBuyerGoToImSysURL_GoodsWap != undefined) {

                    //$("#CustomServicesOnlineDiv").unbind();
                    ////页脚下面的客服
                    //$("#CustomServicesOnlineDiv").on("click", function () {
                    //    window.location.href = encodeURI(mBuyerGoToImSysURL_ShopWap);
                    //});
                    $("#CusServiceFooter").attr("href", encodeURI(mBuyerGoToImSysURL_GoodsWap));


                }
            }
        }
    });
}




//===================分享商品返佣窗口==========================//

/**
 * ----打开分享商品返佣窗口-----
 */
var mWinShareGoodsHtml = "";
function openWinShareGoods() {

    if (mBuyerUserID == "") {

        toastWinCb("请先登录！", function () {

            //跳转到登录页面
            window.location.href = "../Login/Buyer?BackUrl=" + window.location.href + "";
        });
        return;
    }
    if (mGID == "") {
        return;
    }

    //设置分享按钮事件
    $("#BtnShareGoods").on("click", function () {

    });


    if (mWinShareGoodsHtml == "") {
        mWinShareGoodsHtml = $("#WinShareGoods").html();
    }
    //初始化SliderDown窗口
    initSilderDownWin(600, mWinShareGoodsHtml);
    //打开Slider窗口
    toggleSilderDownWin();
}

/**
 * 得到买家分享商品返佣的URL
 * */
function getBuyerShareGoodsURL() {

    if (mGID == "" || mBuyerUserID == "") {
        return;
    }

    //构造POST参数
    var dataPOST = {
        "Type": "11", "GoodsID": mGID, "BuyerUserID": mBuyerUserID,
    };

    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: "../GoodsAjax/GoodsDetail?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("得到买家分享商品返佣的URL=" + reTxt);
            if (reTxt != "") {
                var _jsonReTxt = JSON.parse(reTxt);

                $("#WinScanCodeImg").attr("src", "../ToolWeb/GetQrCodeImg.aspx?QrCodeContent=" + _jsonReTxt.BuyerShareGoodsURL);
                $("#WinScanCodeHref").attr("href", "../ToolWeb/GetQrCodeImg.aspx?QrCodeContent=" + _jsonReTxt.BuyerShareGoodsURL);

                $("#WinShareURLDiv").html(_jsonReTxt.BuyerShareGoodsURL);

                //初始化复制分享商品URL
                initCopyShareGoodsURL(_jsonReTxt.BuyerShareGoodsURL);


            }
        }
    });

}


/**
 * 初始化复制分享商品URL
 * */
function initCopyShareGoodsURL(pBuyerShareGoodsURL) {


    var clipboard = new ClipboardJS('#BtnShareGoods', {
        text: function () {
            return pBuyerShareGoodsURL;
        }
    });

    clipboard.on('success', function (e) {
        console.log(e);
        alert("链接复制成功，发送给好友下单订购吧！");
        //toastWinToDiv("链接复制成功，发送给好友下单订购吧！", "SliderDownWin", 10000,"toastWinToDivMask");
    });

    clipboard.on('error', function (e) {
        console.log(e);
        //alert("复制失败！");
    });


}


//===================判断是否可以打开小程序版==========================//
/**
 * 判断是否可以打开小程序版
 * */
function isOpenWxMiniPage() {
    var _hidWxUrlScheme = $("#hidWxUrlScheme").val().trim();
    if (_hidWxUrlScheme == "" || _hidWxUrlScheme == undefined) {
        return;
    }

    confirmWin("是否跳转到【小程序版】?", function () {
        window.location.href = _hidWxUrlScheme;
    });
}

