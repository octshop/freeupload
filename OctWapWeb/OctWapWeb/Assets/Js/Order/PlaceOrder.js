//================确认订单===================//

/**-----定义公共变量------**/

//AjaxURL
var mAjaxUrl = "../OrderAjax/PlaceOrder";

//商品ID
var mGoodsID = "";
//店铺ID
var mShopID = "";
//配送方式
var mIsShopExpense = "";

//只有提交订单后才会有值
var mOrderID = "";

//运费相关
var mFreightMoney = 0;
var mAddPieceMoney = 0;
var mFreightMoneyConst = 0;
var mAddPieceMoneyConst = 0;


//计算折扣后的商品价格
var mGoodsPriceSum = 0;
//优惠券使用金额
var mCouponsMoney = 0;

//默认使用的优惠券放发ID
var mIssueID = 0;
//买家可使用优惠券列表Json对象
var mUseCouponsMsgListJson = null;

//记录发票信息
var mInvoiceType = "General"; //发票类型
var mInvoiceTitle = "Person"; //发票抬头
var mInvoiceContent = "InvoiceNo"; //发票内容

//-----支付相关-----//
var mSelPayType = "WeiXinPay"; //当前选择支付方式 
var mPayJsonReTxt = null; //提交订单返回的信息  -- 支付要用的

var mCurrentBalance = 0; //当前的用户余额
var mCurrentIntegral = 0; //当前的账户积分

var mTotalOrderPrice = 0; //所有支付订单的总额
var mIsPayDelivery = "false"; //是否显示货到付款支付项
var mIsBuyerIntegralPay = "false"; //是否显示【积分支付】项
var mIsPayOffline = "false"; //是否显示【到店付】项
var mIsPayTransfer = "false"; //是否显示【银行转账】项

//------定时器，监听支付窗口是否关闭-----//
var mTimerPayWinClose = null;

//-------秒杀相关--------//
var mSkStockNum = 0; //秒杀的总库存数

//-------拼团相关--------//
var mGroupDiscount = 0; //拼团折扣


/**------初始化------**/
$(function () {

    mGoodsID = $("#hidGoodsID").val().trim();

    //初始化买家收货地址
    initBuyerReceiAddr();

    //初始化订购商品信息
    //initOrderGoodsMsg();

});

/**
 * 初始化买家收货地址
 * */
function initBuyerReceiAddr() {

    //构造POST参数
    var dataPOST = {
        "Type": "1",
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
                if (_jsonReTxt.BReceiAddrID != 0) {
                    $("#ReceiNameDiv").html("收货人：" + _jsonReTxt.ReceiName);
                    $("#MobileDiv").html(_jsonReTxt.Mobile);
                    $("#RegionDetailAddrDiv").html("收货地址：" + _jsonReTxt.RegionNameArr + "_" + _jsonReTxt.DetailAddr + "");
                }
                else {
                    $("#ReceiNameDiv").html("请先添加收货地址！");
                    $("#MobileDiv").html("");
                    $("#RegionDetailAddrDiv").html("");
                    $("#SelAddrClick").on("click", function () {
                        //window.location.href = '../Buyer/ReceiAddrAdd?BackUrl=../Order/PlaceOrder';
                    });
                }
            }

            //初始化订购商品信息
            initOrderGoodsMsg();
        }
    });
}

/**
 * 初始化订购商品信息
 * */
function initOrderGoodsMsg() {

    //构造POST参数
    var dataPOST = {
        "Type": "2",
    };
    console.log(dataPOST);
    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: mAjaxUrl + "?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("初始化订购商品信息=" + reTxt);
            if (reTxt != "") {
                var _jsonReTxt = JSON.parse(reTxt);

                //配送方式
                mIsShopExpense = _jsonReTxt.ModelGooGoodsMsg.IsShopExpense;

                //记录商家UserID
                $("#hidShopUserID").val(_jsonReTxt.ModelGooGoodsMsg.ShopUserID);
                mShopID = _jsonReTxt.ModelGooGoodsMsg.ShopID;


                //----------------秒杀与拼团相关-------------//
                //拼团商品设置信息ID
                var hidGroupSettingID = $("#hidGroupSettingID").val().trim();
                //是否拼团
                var hidIsGroup = $("#hidIsGroup").val().trim();

                if (hidGroupSettingID == "0" || hidGroupSettingID == "" || hidIsGroup == "false" || hidIsGroup == "") {
                    //初始化抢购秒杀条
                    if (_jsonReTxt.SecKillMsg.SkDiscount != 0) {
                        //初始化
                        initSecKillBar(_jsonReTxt.SecKillMsg);
                        $("#SecKillTitle").show();
                    }
                }

                //----显隐拼团条----//
                if (hidIsGroup == "true") {
                    $("#GroupTitle").show();

                    //初始化 初始化拼团商品设置信息
                    initGroupGoodsSetting(function () {

                        if (mGroupDiscount <= 0) {
                            $("#GroupTitle").hide();
                        }

                        //设置为拼团的折扣
                        _jsonReTxt.ModelGooGoodsMsg.Discount = mGroupDiscount;

                        //构造订购商品信息代码并赋值
                        xhtmlOrderGoodsMsg(_jsonReTxt);

                    });

                }
                else {
                    $("#GroupTitle").hide();

                    //构造订购商品信息代码并赋值
                    xhtmlOrderGoodsMsg(_jsonReTxt);
                }

                //根据商品的配送方式，是否加载收货地址
                if (_jsonReTxt.ModelGooGoodsMsg.IsShopExpense == "true") //到店消费
                {
                    $("#SelAddrClick").hide();
                    $("#ShopAddrNav").show();
                    //加载店铺地址和位置信息
                    initShopAddrNav();
                }
                else if (_jsonReTxt.ModelGooGoodsMsg.IsShopExpense == "false") //快递物流
                {
                    $("#SelAddrClick").show();
                    $("#ShopAddrNav").hide();

                    //初始化买家收货地址
                    //initBuyerReceiAddr();
                }
                else {
                    $("#SelAddrClick").show();
                    $("#ShopAddrNav").hide();

                    //初始化买家收货地址
                    //initBuyerReceiAddr();

                    setTimeout(function () {

                        //加载店铺地址和位置信息
                        initShopAddrNav();

                    }, 1000);

                }
            }
            else {

                toastWinCb("商品被下架！", function () {
                    window.history.go(-1); //回退页面
                });
            }
        }
    });

}

/**
 * 构造订购商品信息代码并赋值
 * @param pJsonReTxtOrderMsg 返回的Json对象 
 * */
function xhtmlOrderGoodsMsg(pJsonReTxtOrderMsg) {

    var ModelGooGoodsMsg = pJsonReTxtOrderMsg.ModelGooGoodsMsg;
    var GoodsCoverImgPath = pJsonReTxtOrderMsg.GoodsCoverImgPath;
    var ModelShopMsg = pJsonReTxtOrderMsg.ModelShopMsg;
    var GooSpecParam = pJsonReTxtOrderMsg.GooSpecParam;
    var FreightTemplateParam = pJsonReTxtOrderMsg.FreightTemplateParam;
    var CouponsDefault = pJsonReTxtOrderMsg.CouponsDefault;

    console.log("ModelGooGoodsMsg.Discount=" + ModelGooGoodsMsg.Discount);


    $("#OrderItemTitle").html("<a href=\"../Shop/Index?SID=" + ModelShopMsg.ShopID + "\" target=\"_blank\">" + ModelShopMsg.ShopName + "</a>");

    //到店徽章
    var _spanBadge = "";
    if (mIsShopExpense == "true") {
        _spanBadge = " <span style=\"color:white;background:red;padding:1px 3px;border-radius:5px\">到店</span>";
    }
    $("#GoodsTitleSpan").html(ModelGooGoodsMsg.GoodsTitle + _spanBadge);

    //规格参数
    if (GooSpecParam != undefined) {
        if (GooSpecParam.SpecParamVal != "" && GooSpecParam.SpecParamVal != null) {
            var _specParamValFather = "";
            if (GooSpecParam.SpecParamValFather != "" && GooSpecParam.SpecParamValFather != null) {
                _specParamValFather = GooSpecParam.SpecParamValFather + ","
            }
            $("#SpecParamValSpan").html(_specParamValFather + GooSpecParam.SpecParamVal);
        }
        //显示商品的单价
        $("#GoodsPriceDiv").html("&#165; " + getGoodsPrice(GooSpecParam.GoodsPrice, ModelGooGoodsMsg.GoodsPrice, ModelGooGoodsMsg.Discount));
    }
    else {
        //规格显示
        $("#SpecParamValSpan").html("");

        //显示商品的单价
        $("#GoodsPriceDiv").html("&#165; " + getGoodsPrice(ModelGooGoodsMsg.GoodsPrice, ModelGooGoodsMsg.GoodsPrice, ModelGooGoodsMsg.Discount));
    }



    //显示规格参数图片 或者 商品图片
    var myJsVal = "<a href=\"../Goods/GoodsDetail?GID=" + mGoodsID + "\">";

    //判断是否有拼团
    if ($("#hidIsGroup").val().trim() == "true") {
        myJsVal = "<a href=\"../Group/GroupDetail?GID=" + mGoodsID + "\">";
    }

    if (GooSpecParam != undefined) {
        if (GooSpecParam.SpecParamImg != "" && GooSpecParam.SpecParamImg != null) {
            myJsVal += "<img src=\"//" + GooSpecParam.SpecParamImg + "\" />";        }
        else {
            myJsVal += "<img src=\"//" + GoodsCoverImgPath.ImgPath + "\" />";        }
    }
    else {
        myJsVal += "<img src=\"//" + GoodsCoverImgPath.ImgPath + "\" />";
    }
    myJsVal += "</a>";

    $("#GoodsImgDiv").html(myJsVal);
    //订购数量赋值
    $("#OrderNum").val($("#hidOrderNum").val());
    $("#OrderNumB").html($("#hidOrderNum").val());
    //配送方式
    showIsShopExpense(ModelGooGoodsMsg.IsShopExpense);
    //计算运费
    if (FreightTemplateParam != null && FreightTemplateParam != undefined) {
        mFreightMoneyConst = mFreightMoney = parseFloat(FreightTemplateParam.FreightMoney);
        mAddPieceMoneyConst = mAddPieceMoney = parseFloat(FreightTemplateParam.AddPieceMoney);
        var _sumFreight = countFreight(mFreightMoney, mAddPieceMoney);
        $("#FreightValB").html("&#165; " + _sumFreight);

    }
    else {
        mFreightMoneyConst = mFreightMoney = 0;
        mAddPieceMoneyConst = mAddPieceMoney = 0;
        $("#FreightValB").html("&#165; 0");
    }

    //如果是到店消费/自取 则运费为0
    if (ModelGooGoodsMsg.IsShopExpense == "true") {
        mFreightMoneyConst = mFreightMoney = 0;
        mAddPieceMoneyConst = mAddPieceMoney = 0;
        $("#FreightValB").html("&#165; 0");
    }


    //显示默认使用的优惠券
    if (CouponsDefault == "" || CouponsDefault == undefined || CouponsDefault == null) {
        $("#CouponsMsgDiv").hide();
        mIssueID = 0;
    }
    else {
        $("#CouponsMsgSpan").html(xhtmlCouponsDefault(CouponsDefault.CouponsID, parseFloat(CouponsDefault.UseMoney), parseFloat(CouponsDefault.UseDiscount), parseFloat(CouponsDefault.ExpenseReachSum)));

        //默认使用的优惠券放发ID
        mIssueID = CouponsDefault.IssueID;
    }

    //小计订单总额
    var _sumOrderPrice = sumOrderPrice();
    $("#SumPriceContentDiv").html("&#165; " + _sumOrderPrice);
    $("#SumOrderPriceB").html("&#165; " + _sumOrderPrice);

    //判断订单总额(计入优惠券金额)是否小于优惠券金额，如果则不使用优惠券
    if (_sumOrderPrice < 0.01) {
        mIssueID = 0;
        $("#CouponsMsgDiv").hide();
        console.log("不使用优惠券");
    }

}

/**
 * 小计订单总额
 * */
function sumOrderPrice() {

    //统计商品价格和订购数量总价格
    var _countGoodsPriceOrderNum = countGoodsPriceOrderNum();
    console.log("_countGoodsPriceOrderNum=" + _countGoodsPriceOrderNum);
    console.log("mCouponsMoney=" + mCouponsMoney);

    //当前优惠券金额大于 总的订单金额时，则不使用优惠券
    if (_countGoodsPriceOrderNum <= mCouponsMoney) {
        mCouponsMoney = 0;
        mIssueID = 0;
        $("#CouponsMsgDiv").hide();
    }

    //运费
    var _sumFreight = countFreight(mFreightMoney, mAddPieceMoney);
    //优惠券抵用金额

    //计算订单总金额
    var _sumOrderPrice = parseFloat(_countGoodsPriceOrderNum) + parseFloat(_sumFreight) - parseFloat(mCouponsMoney);

    return formatNumberDotDigit(_sumOrderPrice);
}

/**
 * 统计商品价格和订购数量总价格
 * */
function countGoodsPriceOrderNum() {

    var OrderNum = parseInt($("#OrderNum").val().trim());

    var _sumGoodsPriceOrderNum = mGoodsPriceSum * OrderNum;

    return _sumGoodsPriceOrderNum;
}

/**
 * 构造默认使用的优惠券显示代码
 * @param {any} pCouponsID 优惠券ID
 * @param {any} pUseMoney 可抵用的金额
 * @param {any} pUseDiscount 可抵用的折扣
 * @param {any} pExpenseReachSum 消费满多少可以使用
 */
function xhtmlCouponsDefault(pCouponsID, pUseMoney, pUseDiscount, pExpenseReachSum) {

    //为优惠券ID赋值
    $("#hidCouponsID").val(pCouponsID);

    //优惠券的价格
    var _couponsMoney = 0;

    //显示代码
    var _xhtml = ""; //"满18减2元<b>&#165;-25.30 </b>";
    if (pExpenseReachSum > 0) {
        _xhtml = "满" + pExpenseReachSum + "";
    }
    else {
        if (pUseDiscount > 0) {
            _xhtml = "" + pUseDiscount + "折券";
        }
        else {
            _xhtml = "抵用券";
        }

    }
    if (parseFloat(pUseMoney) > 0) {
        _xhtml += "减" + pUseMoney + "元";

        _couponsMoney = pUseMoney;

    }
    else if (parseFloat(pUseDiscount) > 0) {


        console.log("折扣券商品单价mGoodsPriceSum=" + mGoodsPriceSum);

        //统计商品价格和订购数量总价格
        // var _countGoodsPriceOrderNum = countGoodsPriceOrderNum();
        //计算折扣券减的值
        var _discountMoney = mGoodsPriceSum - mGoodsPriceSum * (parseFloat(pUseDiscount) / 10);

        _couponsMoney = _discountMoney;

        _xhtml += "减" + formatNumberDotDigit(_discountMoney) + "元";
    }

    mCouponsMoney = formatNumberDotDigit(_couponsMoney);

    _xhtml += "<b>&#165; -" + mCouponsMoney + "</b>"

    return _xhtml
}


/**
 * 得到商品的单价
 * @param {any} pSpecGoodsPrice 规格属性的单价
 * @param {any} pGoodsPrice 没有规格属性，商品本身的单价
 * @param pDiscount 折扣 [0 - 10之前的数]
 */
function getGoodsPrice(pSpecGoodsPrice, pGoodsPrice, pDiscount) {

    var _goodsPrice = 0;

    if (pSpecGoodsPrice <= 0 || pSpecGoodsPrice == null) {
        _goodsPrice = pGoodsPrice;
    }
    else {
        _goodsPrice = pSpecGoodsPrice;
    }
    if (parseFloat(pDiscount) > 0) {
        //乘以折扣
        _goodsPrice = _goodsPrice * (parseFloat(pDiscount) / 10);
    }

    return mGoodsPriceSum = formatNumberDotDigit(_goodsPrice);
}


/**
 * 计算运费
 * @param {any} pFreightMoney 运费(1件)  金额
 * @param {any} pAddPieceMoney 续件(每增加1件) 金额
 */
function countFreight(pFreightMoney, pAddPieceMoney) {


    //获取当前订购数量
    var OrderNum = parseInt($("#OrderNum").val().trim());

    var sumFreight = 0;
    if (OrderNum <= 1) {
        sumFreight = pFreightMoney;
    }
    else {
        if (pAddPieceMoney < 0) {
            pAddPieceMoney = 0;
        }
        sumFreight = pFreightMoney + (pAddPieceMoney * (OrderNum - 1));
    }

    return formatNumberDotDigit(sumFreight);
}

/**
 * 显示配送方式
 * @param 配送方式 true false both
 * */
function showIsShopExpense(pIsShopExpense) {

    $("#ExpressValDiv").removeClass("express-type-current");
    $("#ShopToValDiv").removeClass("express-type-current");

    //到店消费
    if (pIsShopExpense == "true") {
        $("#ExpressTypeValDiv").html("到店消费/自取");
        $("#hidExpressType").val("shop");

        $("#ExpressValDiv").hide();
        $("#ShopToValDiv").show();

        $("#ShopToValDiv").addClass("express-type-current");
    }
    else if (pIsShopExpense == "false") //  快递发货
    {
        $("#ExpressTypeValDiv").html("送货上门(快递)");
        $("#hidExpressType").val("express");

        $("#ExpressValDiv").show();
        $("#ShopToValDiv").hide();

        $("#ExpressValDiv").addClass("express-type-current");
    }
    else if (pIsShopExpense == "both")//两者都支持
    {
        $("#ExpressTypeValDiv").html("送货上门(快递)");
        $("#hidExpressType").val("express");

        $("#ExpressValDiv").show();
        $("#ShopToValDiv").show();

        $("#ExpressValDiv").addClass("express-type-current");

    }
}

/**
 * 改变配送方式
 * @param {any} pIsShopExpense 配送方式 true false both
 */
function chgIsShopExpense(pIsShopExpense) {

    $("#ExpressValDiv").removeClass("express-type-current");
    $("#ShopToValDiv").removeClass("express-type-current");

    //到店消费
    if (pIsShopExpense == "true") {
        $("#ExpressTypeValDiv").html("到店消费/自取");
        $("#hidExpressType").val("shop")
        $("#ShopToValDiv").addClass("express-type-current");

        //运费
        mFreightMoney = 0;
        mAddPieceMoney = 0;

        //显隐 店铺地址与导航
        $("#SelAddrClick").hide();
        $("#ShopAddrNav").show();


    }
    else if (pIsShopExpense == "false") //  快递发货
    {
        $("#ExpressTypeValDiv").html("送货上门(快递)");
        $("#hidExpressType").val("express")
        $("#ExpressValDiv").addClass("express-type-current");

        //运费
        mFreightMoney = mFreightMoneyConst;
        mAddPieceMoney = mAddPieceMoneyConst;

        //显隐 店铺地址与导航
        $("#SelAddrClick").show();
        $("#ShopAddrNav").hide();
    }

    //计算运费
    $("#FreightValB").html("&#165; " + countFreight(mFreightMoney, mAddPieceMoney));

    //订单总额小计
    var _sumOrderPrice = sumOrderPrice();
    $("#SumPriceContentDiv").html("&#165; " + _sumOrderPrice);
    $("#SumOrderPriceB").html("&#165; " + _sumOrderPrice);
}

/**
 * 增减订购数量
 * @param {any} pType 操作类别  [Add增 Reduce减]
 */
function addReduceOrderNum(pType) {
    //获取当前订购数量
    var OrderNum = parseInt($("#OrderNum").val().trim());
    if (pType == "Add") {
        OrderNum += 1;
    }
    else if (pType == "Reduce") {
        if (parseInt(OrderNum) <= 1) {
            OrderNum = 1;
        }
        else {
            OrderNum -= 1;
        }
    }

    if (isNaN(OrderNum)) {
        OrderNum = 1;
    }
    //赋值给文本框
    $("#OrderNum").val(OrderNum);
    //订购数量
    $("#OrderNumB").html(OrderNum);

    //计算运费
    $("#FreightValB").html("&#165; " + countFreight(mFreightMoney, mAddPieceMoney));

    //重新初始化默认使用的优惠券信息
    initUseCouponsDefault();

    return;
}

/**
 * 输入订购数量时，更改各项显示
 * */
function chgOrderNumTxt() {

    //订购数量
    $("#OrderNumB").html($("#OrderNum").val());

    //计算运费
    $("#FreightValB").html("&#165; " + countFreight(mFreightMoney, mAddPieceMoney));

    //重新初始化默认使用的优惠券信息
    initUseCouponsDefault();

    return;
}

/**
 * 初始化默认使用的优惠券信息
 * @param pCallBack 返回函数
 * */
function initUseCouponsDefault() {

    //if ($("#CouponsMsgDiv").get(0).style.display == "none") {
    //    return;
    //}

    //默认使用的优惠券放发ID
    mIssueID = 0;

    //规格属性ID
    var _hidSpecID = $("#hidSpecID").val().trim();
    //计算订单总额
    var _ExpenseReachSum = countGoodsPriceOrderNum();

    //构造POST参数
    var dataPOST = {
        "Type": "4", "GoodsID": mGoodsID, "ExpenseReachSum": _ExpenseReachSum, "SpecPropID": _hidSpecID,
    };
    console.log(dataPOST);

    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: mAjaxUrl + "?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("初始化默认使用的优惠券信息=" + reTxt);
            if (reTxt != "") {

                var _jsonReTxt = JSON.parse(reTxt);
                if (_jsonReTxt.CouponsID != 0 && _jsonReTxt.CouponsID != undefined) {

                    $("#CouponsMsgDiv").show(); //显示优惠券条
                }

                mIssueID = _jsonReTxt.IssueID;

                //构造使用的优惠券信息显示代码
                _xhtmlUseCoupons = xhtmlCouponsDefault(_jsonReTxt.CouponsID, _jsonReTxt.UseMoney, _jsonReTxt.UseDiscount, _jsonReTxt.ExpenseReachSum);
                //显示代码插入前台
                $("#CouponsMsgSpan").html(_xhtmlUseCoupons);
            }
            else {

                mCouponsMoney = 0;
                mIssueID = 0;
                mUseCouponsMsgListJson = null;

                $("#CouponsMsgDiv").hide(); //隐藏优惠券条
            }

            try {
                //订单总额小计
                var _sumOrderPrice = sumOrderPrice();
                $("#SumPriceContentDiv").html("&#165; " + _sumOrderPrice);
                $("#SumOrderPriceB").html("&#165; " + _sumOrderPrice);
            } catch (e) { };

        }
    });



}

/**
 * ----------打开使用优惠券的窗口 -------------
 */
var mGetTicketWinHtml = "";
function openUseTicketWin() {

    //console.log("执行了");

    if (mGetTicketWinHtml == "") {

        mGetTicketWinHtml = getGetTicketWinHtml();
    }
    //初始化SliderDown窗口
    initSilderDownWin(600, mGetTicketWinHtml);

    toggleSilderDownWin();

    //初始化 买家可以使用的优惠券列表
    initUseCouponsMsgList();
}
/**
 * 得到领取优惠券的窗口显示代码
 */
function getGetTicketWinHtml() {

    var _html = $("#WinGetTicket").html();

    $("#WinGetTicket").html("");
    $("#WinGetTicket").remove();
    $("body").remove("#WinGetTicket");

    mGetTicketWinHtml = "";

    return _html
}

/**
 * 初始化 买家可以使用的优惠券列表
 * */
function initUseCouponsMsgList() {

    //计算订单总额
    var _ExpenseReachSum = countGoodsPriceOrderNum();

    //构造POST参数
    var dataPOST = {
        "Type": "3", "GoodsID": mGoodsID, "ExpenseReachSum": _ExpenseReachSum,
    };
    console.log(dataPOST);
    //加载提示
    $("#WinTicketList").html("<div style=\"color:gray; text-align:center\">…加载中…</div>");

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

                mUseCouponsMsgListJson = _jsonReTxt

                //构造买家可使用的优惠券列表显示代码
                var _xhtml = xhtmlUseCouponsMsgList(_jsonReTxt);
                $("#WinTicketList").html(_xhtml);
                $("#CouponsSumB").html(_jsonReTxt.UseCouponsMsgList.length);

            }
        }
    });
}

/**
 * 构造买家可使用的优惠券列表显示代码
 * @param {any} pUseCouponsMsgListJson 返回的可使用优惠券列表Json对象
 */
function xhtmlUseCouponsMsgList(pUseCouponsMsgListJson) {

    var _useCouponsMsgListArr = pUseCouponsMsgListJson.UseCouponsMsgList;

    var myJsVal = "";    //循环构造显示代码    for (var i = 0; i < _useCouponsMsgListArr.length; i++) {        var couponsType = "店铺券";        if (_useCouponsMsgListArr[i].IsMallCoupons == "true") {            couponsType = "商城券";
        }        //抵用金额或折扣        var _moneyDiscount = "&#165; " + _useCouponsMsgListArr[i].UseMoney;        if (parseFloat(_useCouponsMsgListArr[i].UseDiscount) > 0) {            _moneyDiscount = _useCouponsMsgListArr[i].UseDiscount + "折";

            couponsType = "店铺折扣券";
            if (_useCouponsMsgListArr[i].IsMallCoupons == "true") {                couponsType = "商城折扣券";
            }
        }        //消费满限制        var _expenseReachName = "无消费限制";        if (parseFloat(_useCouponsMsgListArr[i].ExpenseReachSum) > 0) {            _expenseReachName = "满" + _useCouponsMsgListArr[i].ExpenseReachSum + "使用";
        }        //有效期        var _useTimeRangeName = "永久有效";        if (_useCouponsMsgListArr[i].UseTimeRange != "") {            var _useTimeRangeNameArr = _useCouponsMsgListArr[i].UseTimeRange.split("^");            var _diffDay = diffDateDay(_useTimeRangeNameArr[0], _useTimeRangeNameArr[1]);            _useTimeRangeName = _useCouponsMsgListArr[i].UseTimeRange.replace("^", "至") + " ( " + _diffDay + "天 )";
        }        myJsVal += "<div class=\"win-ticket-item\">";        myJsVal += "  <div class=\"win-ticket-item-left\">";        myJsVal += "      <ul>";        myJsVal += "          <li><b>" + _moneyDiscount + "</b> " + couponsType + " </li>";        myJsVal += "          <li>" + _expenseReachName + "</li>";        myJsVal += "          <li>有效期：" + _useTimeRangeName + "</li>";        myJsVal += "      </ul>";        myJsVal += "  </div>";        myJsVal += "  <div class=\"win-ticket-item-right\" onclick=\"useCoupons(" + _useCouponsMsgListArr[i].IssueID + ")\">";        myJsVal += "      立即使用";        myJsVal += "  </div>";        myJsVal += "</div>";
    }    return myJsVal;}

/**
 * 使用优惠券
 * @param pIssueID 优惠券发放ID
 * */
function useCoupons(pIssueID) {

    mIssueID = pIssueID;

    var _xhtmlUseCoupons = "";
    if (mUseCouponsMsgListJson == null || mUseCouponsMsgListJson == "") {
        return;
    }
    var _useCouponsMsgListArr = mUseCouponsMsgListJson.UseCouponsMsgList;

    //循环检测是否为选择使用的优惠券
    for (var i = 0; i < _useCouponsMsgListArr.length; i++) {
        if (pIssueID == _useCouponsMsgListArr[i].IssueID) {

            //构造使用的优惠券信息显示代码
            _xhtmlUseCoupons = xhtmlCouponsDefault(_useCouponsMsgListArr[i].CouponsID, _useCouponsMsgListArr[i].UseMoney, _useCouponsMsgListArr[i].UseDiscount, _useCouponsMsgListArr[i].ExpenseReachSum);
        }
    }
    //显示代码插入前台
    $("#CouponsMsgSpan").html(_xhtmlUseCoupons);

    console.log("mCouponsMoney=" + mCouponsMoney);

    //小计订单总额
    var _sumOrderPrice = sumOrderPrice();
    $("#SumPriceContentDiv").html("&#165; " + _sumOrderPrice);
    $("#SumOrderPriceB").html("&#165; " + _sumOrderPrice);

    //关闭Slider窗口
    toggleSilderDownWin();
}





//========================发票相关业务逻辑=========================//

/**
 * -------打开发票申请窗口------
 */
var mInvoiceWinHtml = "";
function openInvoiceWin() {

    if (mInvoiceWinHtml == "") {

        mInvoiceWinHtml = getInvoiceWinHtml();
    }
    //初始化SliderDown窗口
    initSilderDownWin(600, mInvoiceWinHtml);

    toggleSilderDownWin();

    //初始化发票信息
    preLoadInvoiceMsg();
}

/**
 * 得到发票申请窗口显示代码
 */
function getInvoiceWinHtml() {

    var _html = $("#WinInvoice").html();

    $("#WinInvoice").html("");
    $("#WinInvoice").remove();
    $("body").remove("#WinInvoice");

    mInvoiceWinHtml = "";

    return _html
}

/**
 * 切换 发票类型( General 普通发票  AddValue 增值税专用发票 )
 * @param pTypeNum 类别值  [General 普通发票  AddValue 增值税专用发票]
 * */
function chgInvoiceType(pInvoiceTypeVal) {

    $("#InvoiceTypeSpan_1").removeClass("win-invoice-currenttype");
    $("#InvoiceTypeSpan_2").removeClass("win-invoice-currenttype");

    if (pInvoiceTypeVal == "General") { //普通发票
        mInvoiceType = "General";
        $("#InvoiceTypeSpan_1").addClass("win-invoice-currenttype");

        //切换其他项的显隐
        chgInvoiceTitle("Person"); // 切换发票抬头  
    }
    else if (pInvoiceTypeVal == "AddValue") {
        mInvoiceType = "AddValue";
        $("#InvoiceTypeSpan_2").addClass("win-invoice-currenttype");

        //切换其他项的显隐
        chgInvoiceTitle("Company"); // 切换发票抬头  

    }

}

/**
 * 切换发票抬头  
 * @param {any} pInvoiceTitleVal 发票抬头值 ( Person 个人  /  Company  企业 )
 */
function chgInvoiceTitle(pInvoiceTitleVal) {

    mInvoiceTitle = pInvoiceTitleVal; //记录选择的发票抬头值

    $("#InvoiceTitleSpan_1").removeClass("win-invoice-currenttype");
    $("#InvoiceTitleSpan_2").removeClass("win-invoice-currenttype");

    console.log("pInvoiceTitleVal=" + pInvoiceTitleVal);

    if (pInvoiceTitleVal == "Person") {

        if (mInvoiceType == "AddValue") {
            $("#InvoiceTitleSpan_2").addClass("win-invoice-currenttype");
            mInvoiceTitle = "Company"; //增值税专用发票只能是企业
            return;
        }

        $("#InvoiceTitleSpan_1").addClass("win-invoice-currenttype");
        //切换其他项的显隐
        $("#CompanyItemList").hide();
        $("#CompanyItem_3").hide();

    }
    else if (pInvoiceTitleVal == "Company") {

        $("#InvoiceTitleSpan_2").addClass("win-invoice-currenttype");

        //切换其他项的显隐
        $("#CompanyItemList").show();
        $("#CompanyItem_1").show();

        if (mInvoiceType == "AddValue") { //增值税专用发票
            $("#CompanyItem_2").show();
            $("#CompanyItem_3").show();
        }
        else if (mInvoiceType == "General") { //普通发票
            $("#CompanyItem_2").hide();
            $("#CompanyItem_3").hide();
        }
    }
}

/**
 * 切换发票内容
 * @param {any} pInvoiceContent 发票内容（GoodsDetail 商品明细 GoodsType 商品类别  InvoiceNo 不开发票  等）
 */
function chgInvoiceContent(pInvoiceContent) {

    mInvoiceContent = pInvoiceContent;

    $("#InvoiceContentSpan_1").removeClass("win-invoice-currenttype");
    $("#InvoiceContentSpan_2").removeClass("win-invoice-currenttype");
    $("#InvoiceContentSpan_3").removeClass("win-invoice-currenttype");

    if (pInvoiceContent == "InvoiceNo") {
        $("#InvoiceContentSpan_1").addClass("win-invoice-currenttype");
    }
    else if (pInvoiceContent == "GoodsDetail") {
        $("#InvoiceContentSpan_2").addClass("win-invoice-currenttype");
    }
    else if (pInvoiceContent == "GoodsType") {
        $("#InvoiceContentSpan_3").addClass("win-invoice-currenttype");
    }
}

/**
 * 提交订单发票
 * */
function submitOrderInvoice() {

    var hidInvoiceGuid = $("#hidInvoiceGuid").val().trim();

    var ShopUserID = $("#hidShopUserID").val().trim();
    var CompanyName = $("#CompanyName").val().trim();
    var TaxNumber = $("#TaxNumber").val().trim();
    var CompanyRegAddr = $("#CompanyRegAddr").val().trim();
    var CompanyTel = $("#CompanyTel").val().trim();
    var BankAcc = $("#BankAcc").val().trim();
    var OpeningBank = $("#OpeningBank").val().trim();
    var ReceiMobile = $("#ReceiMobile").val().trim();
    var ReceiEmail = $("#ReceiEmail").val().trim();

    if (ShopUserID == "") {
        return;
    }

    //---判断输入合法信息----//
    //var mInvoiceType = "General"; //发票类型
    //var mInvoiceTitle = "Person"; //发票抬头
    //var mInvoiceContent = "InvoiceNo"; //发票内容
    if (mInvoiceType == "General" && mInvoiceTitle == "Company") {
        if (CompanyName == "" || TaxNumber == "") {
            $("#HintTxt").html("【单位名称】和【纳税人识别号】不能为空！");
            return;
        }
    }
    if (mInvoiceType == "AddValue") { //增值税专用发票
        if (CompanyName == "" || TaxNumber == "" || CompanyRegAddr == "" || CompanyTel == "" || BankAcc == "" || OpeningBank == "" || ReceiMobile == "") {
            $("#HintTxt").html("【值税专用发票】信息填写不完整,请检查！");
            return;
        }
        //验证手机号是否正确
        if (checkMobileNumber(ReceiMobile) == false) {
            $("#HintTxt").html("【收票人手机】错误,请检查！");
            return;
        }
    }

    //构造POST参数
    var dataPOST = {
        "Type": "1", "InvoiceGuid": hidInvoiceGuid, "ShopUserID": ShopUserID, "InvoiceType": mInvoiceType, "InvoiceTitle": mInvoiceTitle, "InvoiceContent": mInvoiceContent, "CompanyName": CompanyName, "TaxNumber": TaxNumber, "CompanyRegAddr": CompanyRegAddr, "CompanyTel": CompanyTel, "BankAcc": BankAcc, "OpeningBank": OpeningBank, "ReceiMobile": ReceiMobile, "ReceiEmail": ReceiEmail,
    };
    console.log(dataPOST);
    //加载提示
    $("#BtnSubmitInvoice").attr("disabled", true);
    $("#BtnSubmitInvoice").val("…提交中…");
    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: "../OrderAjax/OrderInvoice?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log(reTxt);
            //移除加载提示
            $("#BtnSubmitInvoice").attr("disabled", false);
            $("#BtnSubmitInvoice").val("确定");

            if (reTxt != "") {
                var _jsonReTxt = JSON.parse(reTxt);
                if (_jsonReTxt.ErrMsg != "" && _jsonReTxt.ErrMsg != null) {
                    $("#HintTxt").html(_jsonReTxt.ErrMsg);
                    return;
                }
                if (_jsonReTxt.Code == "AOI_01") {

                    //----显示保存的发票信息----//
                    showSaveInvoiceContent();

                    //关闭Slider窗口
                    toggleSilderDownWin();

                    if (mInvoiceContent != "InvoiceNo") {
                        //弹出提示
                        toastWin("发票申请成功！");
                    }


                    return;
                }
            }
        }
    });
}

/**
 * 显示保存的订单发票信息
 * */
function showSaveInvoiceContent() {

    console.log(mInvoiceContent);

    //发票内容（GoodsDetail 商品明细 GoodsType 商品类别  InvoiceNo 不开发票  等）
    var _invoiceContent = "";
    if (mInvoiceContent == "GoodsDetail") {
        _invoiceContent = "商品明细"
    }
    else if (mInvoiceContent == "GoodsType") {
        _invoiceContent = "商品类别"
    }
    else if (mInvoiceContent == "InvoiceNo") {
        _invoiceContent = "不开发票"
    }

    var _xhtml = "";
    //发票抬头 ( Person 个人  /  Company  企业 )
    if (mInvoiceTitle == "Person") {
        _xhtml = _invoiceContent;
    }
    else if (mInvoiceTitle == "Company") {
        var CompanyName = $("#CompanyName").val().trim();

        _xhtml = _invoiceContent;

        if (mInvoiceContent != "InvoiceNo") {
            _xhtml += " ( " + CompanyName + " )";
        }
    }
    //显示代码插入前台
    $("#InvoiceValDiv").html(_xhtml);
}

/**
 * 初始化发票信息
 * */
function preLoadInvoiceMsg() {

    //构造POST参数
    var dataPOST = {
        "Type": "2",
    };
    console.log(dataPOST);
    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: "../OrderAjax/OrderInvoice?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log(reTxt);
            if (reTxt != "") {
                var _jsonReTxt = JSON.parse(reTxt);

                if (_jsonReTxt.InvoiceID != 0 && _jsonReTxt.InvoiceType != null) {
                    //为 发票申请窗口赋值
                    setValFormInvoiceMsg(_jsonReTxt);
                }

            }
        }
    });
}

/**
 * 为 发票申请窗口赋值
 * @param {any} pJsonInvoiceMsg 订单发票信息Json对象
 */
function setValFormInvoiceMsg(pJsonInvoiceMsg) {

    $("#CompanyName").val(pJsonInvoiceMsg.CompanyName);
    $("#TaxNumber").val(pJsonInvoiceMsg.TaxNumber);
    $("#CompanyRegAddr").val(pJsonInvoiceMsg.CompanyRegAddr);
    $("#CompanyTel").val(pJsonInvoiceMsg.CompanyTel);
    $("#BankAcc").val(pJsonInvoiceMsg.BankAcc);
    $("#OpeningBank").val(pJsonInvoiceMsg.OpeningBank);
    $("#ReceiMobile").val(pJsonInvoiceMsg.ReceiMobile);
    $("#ReceiEmail").val(pJsonInvoiceMsg.ReceiEmail);

    //切换显隐
    mInvoiceType = pJsonInvoiceMsg.InvoiceType;
    chgInvoiceType(mInvoiceType);

    mInvoiceTitle = pJsonInvoiceMsg.InvoiceTitle;
    chgInvoiceTitle(mInvoiceTitle);

    mInvoiceContent = pJsonInvoiceMsg.InvoiceContent;
    chgInvoiceContent(mInvoiceContent);
}


//========================提交订单=========================//

var mIsSendOrder = false; //是否正在提交订单

/**
 * 提交订单信息
 * */
function submitOrderMsg() {

    //获取表单值
    var hidOrderGuid = $("#hidOrderGuid").val().trim();
    var hidGoodsID = $("#hidGoodsID").val().trim();
    var hidSpecID = $("#hidSpecID").val().trim();
    var OrderNum = $("#OrderNum").val().trim();
    var ExpressType = $("#hidExpressType").val().trim(); //shop , express
    var InvoiceGuid = $("#hidInvoiceGuid").val().trim();
    var OrderMemo = $("#OrderMemo").val().trim();
    //拼团相关
    var hidGroupSettingID = $("#hidGroupSettingID").val().trim();
    var hidGroupID = $("#hidGroupID").val().trim();

    //判断输入是否正确
    if (OrderNum == "" || isNaN(OrderNum)) {
        toastWin("【订购数量】不能为空且必须为数字！");
        return;
    }
    if (parseInt(OrderNum) <= 0) {
        toastWin("【订购数量】必须大于零！");
        return;
    }

    //----------判断秒杀的订购数量是否大于 总的库存数量--------//
    if (parseInt(mSkStockNum) > 0) {
        if (parseInt(mSkStockNum) < parseInt(OrderNum)) {
            toastWin("【订购数量】不能大于【秒杀总库存】！");
            return;
        }
    }


    if (mIsSendOrder == true) {
        return;
    }
    mIsSendOrder = true;

    //构造POST参数
    var dataPOST = {
        "Type": "5", "GoodsID": hidGoodsID, "SpecID": hidSpecID, "OrderNum": OrderNum, "ExpressType": ExpressType, "IssueID": mIssueID, "InvoiceGuid": InvoiceGuid, "OrderMemo": OrderMemo, "OrderGuid": hidOrderGuid, "GroupSettingID": hidGroupSettingID, "GroupID": hidGroupID,
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

            mIsSendOrder = false;

            if (reTxt != "") {

                if (reTxt == "12") {
                    toastWinCb("请先添加收货地址！", function () {
                        window.location.href = "../Buyer/ReceiAddrAdd?BackUrl=../Order/PlaceOrder";
                    });
                    return;
                }

                var _jsonReTxt = JSON.parse(reTxt);

                if (_jsonReTxt.ErrMsg != null && _jsonReTxt.ErrMsg != "") {
                    toastWinCb(_jsonReTxt.ErrMsg, function () {

                        if (_jsonReTxt.ErrCode == "POM_02" || _jsonReTxt.ErrCode == "POM_04") {
                            //返回上一页
                            window.history.go(-1);
                        }

                    });
                    return;
                }

                //提交订单返回的信息  -- 支付要用的
                mPayJsonReTxt = _jsonReTxt;

                //是否显示货到付款支付项
                mIsPayDelivery = _jsonReTxt.DataDic.IsPayDelivery;
                //是否显示【到店付】支付项
                mIsPayOffline = _jsonReTxt.DataDic.IsPayOffline;
                //是否显示【银行转账】支付项
                mIsPayTransfer = _jsonReTxt.DataDic.IsPayTransfer;
                //是否显示【积分支付】项
                mIsBuyerIntegralPay = _jsonReTxt.DataDic.IsBuyerIntegralPay;

                //订单ID
                mOrderID = _jsonReTxt.DataDic.OrderID;

                //下单成功
                if (_jsonReTxt.Msg != null && _jsonReTxt.Msg != "") {

                    //请求支付窗口
                    openPayConfirmWin(_jsonReTxt);


                    return;
                }
            }
        }
    });



}


//=======================打开支付确认窗口============================//

/**
 * 打开支付确认窗口
 */
var mPayConfirmWinHtml = "";
function openPayConfirmWin(pJsonReTxt) {

    if (mPayConfirmWinHtml == "") {

        mPayConfirmWinHtml = getPayConfirmWinHtml();
    }
    //初始化SliderDown窗口
    initSilderDownWin(600, mPayConfirmWinHtml);

    toggleSilderDownWin();

    //为支付窗口赋值
    var _orderPrice = formatNumberDotDigit(pJsonReTxt.DataDic.OrderPrice);
    $("#OrderPriceBPayWin").html("&#165; " + _orderPrice);

    mTotalOrderPrice = parseFloat(_orderPrice);

    //得到用户当前的可用余额
    initCurrentBalance();

    //得到用户当前的可用积分
    initCurrentIntegral();

    //是否显示货到付款项
    if (mIsPayDelivery == "true") {
        $("#PayDeliveryLi").show();
    }
    else {
        $("#PayDeliveryLi").hide();
    }

    //是否显示【积分支付】项
    if (mIsBuyerIntegralPay == "true") {
        $("#PayIntegralLi").show();
    }
    else {
        $("#PayIntegralLi").hide();
    }

    //是否显示【到店付】项
    if (mIsPayOffline == "true") {
        $("#PayOfflineLi").show();
    }
    else {
        $("#PayOfflineLi").hide();
    }

    //是否显示【银行转账】项
    if (mIsPayTransfer == "true") {
        $("#PayTransferLi").show();
    }
    else {
        $("#PayTransferLi").hide();
    }

    //定时判断，支付窗口是否关闭
    mTimerPayWinClose = setTimeout(function () {
        isPayWinClose();
    }, 1000);

}
/**
 * 得到支付确认窗口显示代码
 */
function getPayConfirmWinHtml() {

    var _html = $("#WinSelPay").html();

    $("#WinSelPay").html("");
    $("#WinSelPay").remove();
    $("body").remove("#WinSelPay");

    mPayConfirmWinHtml = "";

    return _html
}

/**
 * 切换付款方式 
 * @param pPayType 支付类型名称  支付方式 （WeiXinPay [微信支付], Alipay[支付宝] , Transfer[转账汇款] , Offline[线下付款(到店付)], PayDelivery [货到付款]  Balance[余额支付]）
 * */
function chgPayType(pPayType) {

    //获取所有的支付类型图片标签Class
    var $PayTypeImgArr = $(".pay-type-img");
    //将所有标签设置成未选中
    $PayTypeImgArr.attr("src", "../Assets/Imgs/Icon/sel_no.png");


    //选中的支付类型
    mSelPayType = pPayType;
    $("#PayTypeImg_" + pPayType + "").attr("src", "../Assets/Imgs/Icon/sel_yes.png");
}

/**
 * 立即支付
 * */
function goPay() {


    if (mSelPayType == "" || mSelPayType == null) {
        return;
    }



    //微信支付
    if (mSelPayType == "WeiXinPay") {

        //加载提示
        $("#BtnPay").attr("disabled", true);
        $("#BtnPay").val("…拉起支付中…");

        //跳转URL --- 正式支付地址
        var goPayURL = mPayJsonReTxt.DataDic.OctThirdApiCallSystemWeb_ApiDomain + "/WxPay/WxApiPayRedirectRe?BillNumber=" + mPayJsonReTxt.DataDic.BillNumber + "&UserKeyID=" + mPayJsonReTxt.DataDic.UserKeyID;
        //----测试----//
        //var goPayURL = mPayJsonReTxt.DataDic.OctThirdApiCallSystemWeb_ApiDomain + "/Test/WxApiPayRedirect?BillNumber=" + mPayJsonReTxt.DataDic.BillNumber + "&UserKeyID=" + mPayJsonReTxt.DataDic.UserKeyID;

        //跳转到模拟支付页
        if (mPayJsonReTxt.DataDic.WxPay_IsSimulatePay == "是") {
            goPayURL = mPayJsonReTxt.DataDic.OctThirdApiCallSystemWeb_ApiDomain + "/PayPub/SimulatePay?PayWay=WeiXinPay&BillNumber=" + mPayJsonReTxt.DataDic.BillNumber + "&UserKeyID=" + mPayJsonReTxt.DataDic.UserKeyID;
        }
        //else {

        //}

        //跳转到微信公众号支付页
        window.location.href = goPayURL;
    }
    else if (mSelPayType == "Alipay") //支付宝支付
    {
        //加载提示
        $("#BtnPay").attr("disabled", true);
        $("#BtnPay").val("…拉起支付中…");

        //跳转URL  --- 正式支付地址
        var goPayURL = mPayJsonReTxt.DataDic.OctThirdApiCallSystemWeb_ApiDomain + "/Alipay/AlipayWappay?BillNumber=" + mPayJsonReTxt.DataDic.BillNumber + "&UserKeyID=" + mPayJsonReTxt.DataDic.UserKeyID;

        //跳转到模拟支付页
        if (mPayJsonReTxt.DataDic.Alipay_IsSimulatePay == "是") {
            goPayURL = mPayJsonReTxt.DataDic.OctThirdApiCallSystemWeb_ApiDomain + "/PayPub/SimulatePay?PayWay=Alipay&BillNumber=" + mPayJsonReTxt.DataDic.BillNumber + "&UserKeyID=" + mPayJsonReTxt.DataDic.UserKeyID;
        }

        //跳转到支付宝支付页
        window.location.href = goPayURL;
    }
    else if (mSelPayType == "Balance") //余额支付
    {
        //余额支付
        payCurrentBalance();
    }
    else if (mSelPayType == "Integral") //积分支付
    {
        //积分支付
        payCurrentIntegral();
    }  
    else if (mSelPayType == "PayDelivery") //货到付款
    {
        //货到付款支付
        payDelivery();
    }
    else if (mSelPayType == "Offline") //到店付支付
    {
        //到店付支付
        payOffline();
    }
    else if (mSelPayType == "Transfer") //银行转账支付
    {
        //银行转账支付
        payTransfer();
    }

    //{
    //    "Code": "POM_01",
    //        "Msg": "订单写入成功",
    //            "ErrCode": null,
    //                "ErrMsg": null,
    //                    "DataDic": {
    //        "OrderID": 170369,
    //            "OrderPrice": 454.3,
    //                "BillNumber": "2020030515415220620683607",
    //                    "UserKeyID": "8866",
    //                        "OctThirdApiCallSystemWeb_ApiDomain": "http://localhost:1600",
    //                            "WxPay_IsSimulatePay": "是",
    //                                "Alipay_IsSimulatePay": "是"
    //    },
    //    "DataListDic": null,
    //        "DataDicExtra": null,
    //            "DataListDicExtra": null
    //}


}

/**
 * 余额支付
 * */
function payCurrentBalance() {

    if (mCurrentBalance < mTotalOrderPrice) {
        alert("余额不足，请充值或选择其他支付方式！");
        return;
    }

    //构造POST参数
    var dataPOST = {
        "Type": "6", "PayWay": "Balance", "BillNumber": mPayJsonReTxt.DataDic.BillNumber,
    };
    console.log(dataPOST);

    //加载提示
    $("#BtnPay").attr("disabled", true);
    $("#BtnPay").val("…支付中…");

    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: mAjaxUrl + "?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("余额支付=" + reTxt);
            if (reTxt != "") {
                var _jsonReTxt = JSON.parse(reTxt);

                if (_jsonReTxt.ErrMsg != "" && _jsonReTxt.ErrMsg != null) {
                    alert(_jsonReTxt.ErrMsg);
                    return;
                }

                if (_jsonReTxt.Msg != "" && _jsonReTxt.Msg != null) {
                    window.location.href = "../Pay/PaySuRedirect?BillNumber=" + _jsonReTxt.DataDic.BillNumber;
                    return;
                }


            }
        }
    });
}

/**
 * 积分支付
 * */
function payCurrentIntegral() {

    if (mCurrentIntegral < mTotalOrderPrice) {
        alert("积分不足，选择其他支付方式！");
        return;
    }

    //构造POST参数
    var dataPOST = {
        "Type": "6", "PayWay": "Integral", "BillNumber": mPayJsonReTxt.DataDic.BillNumber,
    };
    console.log(dataPOST);

    //加载提示
    $("#BtnPay").attr("disabled", true);
    $("#BtnPay").val("…支付中…");

    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: mAjaxUrl + "?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("积分支付=" + reTxt);
            if (reTxt != "") {
                var _jsonReTxt = JSON.parse(reTxt);

                if (_jsonReTxt.ErrMsg != "" && _jsonReTxt.ErrMsg != null) {
                    alert(_jsonReTxt.ErrMsg);
                    return;
                }

                if (_jsonReTxt.Msg != "" && _jsonReTxt.Msg != null) {
                    window.location.href = "../Pay/PaySuRedirect?BillNumber=" + _jsonReTxt.DataDic.BillNumber;
                    return;
                }

            }
        }
    });
}

/**
 * 得到用户当前的可用余额
 * */
function initCurrentBalance() {

    //构造POST参数
    var dataPOST = {
        "Type": "1",
    };
    console.log(dataPOST);
    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: "../VipAjax/Index?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log(reTxt);
            if (reTxt != "") {
                var _jsonReTxt = JSON.parse(reTxt);

                //赋值当前用户余额
                $("#CurrentBalanceB").html("&#165;" + _jsonReTxt.CurrentBalance);

                mCurrentBalance = parseFloat(_jsonReTxt.CurrentBalance);

            }
        }
    });
}

/**
 * 得到用户当前的可用积分
 * */
function initCurrentIntegral() {

    //构造POST参数
    var dataPOST = {
        "Type": "4",
    };
    console.log(dataPOST);
    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: "../VipAjax/Index?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log(reTxt);
            if (reTxt != "") {
                var _jsonReTxt = JSON.parse(reTxt);

                //赋值当前用户积分
                $("#CurrentIntegralB").html(_jsonReTxt.CurrentIntegral);

                mCurrentIntegral = parseFloat(_jsonReTxt.CurrentIntegral);

            }
        }
    });
}

/**
 * 货到付款支付
 * */
function payDelivery() {

    //构造POST参数
    var dataPOST = {
        "Type": "6", "PayWay": "PayDelivery", "BillNumber": mPayJsonReTxt.DataDic.BillNumber,
    };
    console.log(dataPOST);

    //加载提示
    $("#BtnPay").attr("disabled", true);
    $("#BtnPay").val("…支付中…");

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

                if (_jsonReTxt.ErrMsg != "" && _jsonReTxt.ErrMsg != null) {
                    alert(_jsonReTxt.ErrMsg);
                    window.location.reload();
                    return;
                }

                if (_jsonReTxt.Msg != "" && _jsonReTxt.Msg != null) {
                    //跳转到订单详情页
                    window.location.href = "../Order/OrderDetail?OID=" + mPayJsonReTxt.DataDic.OrderID;
                    return;
                }


            }
        }
    });
}

/**
 * 到店付支付
 * */
function payOffline() {

    console.log("执行了payOffline()");

    //构造POST参数
    var dataPOST = {
        "Type": "6", "PayWay": "Offline", "BillNumber": mPayJsonReTxt.DataDic.BillNumber,
    };
    console.log(dataPOST);

    //加载提示
    $("#BtnPay").attr("disabled", true);
    $("#BtnPay").val("…支付中…");

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

                if (_jsonReTxt.ErrMsg != "" && _jsonReTxt.ErrMsg != null) {
                    alert(_jsonReTxt.ErrMsg);
                    window.location.reload();
                    return;
                }

                if (_jsonReTxt.Msg != "" && _jsonReTxt.Msg != null) {
                    //跳转到订单详情页
                    window.location.href = "../Order/OrderDetail?OID=" + mPayJsonReTxt.DataDic.OrderID;
                    return;
                }


            }
        }
    });
}

/**
 * 银行转账支付
 * */
function payTransfer() {

    //构造POST参数
    var dataPOST = {
        "Type": "6", "PayWay": "Transfer", "BillNumber": mPayJsonReTxt.DataDic.BillNumber,
    };
    console.log(dataPOST);

    //加载提示
    $("#BtnPay").attr("disabled", true);
    $("#BtnPay").val("…支付中…");

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

                if (_jsonReTxt.ErrMsg != "" && _jsonReTxt.ErrMsg != null) {
                    alert(_jsonReTxt.ErrMsg);
                    window.location.reload();
                    return;
                }

                if (_jsonReTxt.Msg != "" && _jsonReTxt.Msg != null) {
                    //跳转到订单详情页
                    window.location.href = "../Order/BankTransfer?BillNum=" + mPayJsonReTxt.DataDic.BillNumber;
                    return;
                }
            }
        }
    });
}

/**
 * 定时判断，支付窗口是否关闭
 * */
function isPayWinClose() {

    mTimerPayWinClose = null;
    mTimerPayWinClose = undefined;

    //判断窗口是否显示出来了
    var _styleDisplay = $(".slider-down-win").css("display");

    console.log(_styleDisplay);

    if (mPayConfirmWinHtml != "" && _styleDisplay == undefined) {
        window.location.href = "../Order/OrderDetail?OID=" + mOrderID;
    }
    else {
        mTimerPayWinClose = setTimeout(function () {

            isPayWinClose();

        }, 1000);
    }
    return;
}



//==============店铺地址与导航=============//

/**
 * 初始化店铺地址坐标相关信息
 * */
function initShopAddrNav() {

    if (mShopID == "") {
        return;
    }

    //构造POST参数
    var dataPOST = {
        "Type": "1", "ShopID": mShopID,
    };
    console.log(dataPOST);
    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: "../ShopAjax/ShopMsg?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("店铺地址坐标=" + reTxt);
            if (reTxt != "") {
                var _jsonReTxt = JSON.parse(reTxt);

                //显示代码插入前台
                $("#DistanceKmB").html(_jsonReTxt.DistanceKm + "km");
                var _shopAddrDetail = _jsonReTxt.RegionNameArr + "_" + _jsonReTxt.DetailAddr
                $("#ShopAddrDetailDiv").text(_shopAddrDetail);

                //初始化所有的 地图导航URL连接
                allMapURL(_jsonReTxt.Latitude, _jsonReTxt.Longitude, _jsonReTxt.ShopName, _shopAddrDetail);

            }
        }
    });

}


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

//=======================打开地图导航=========================//

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

/**
 * 初始化抢购秒杀条
 * @param {any} pJsonSecKillMsg 抢购秒杀信息Json对象
 */
function initSecKillBar(pJsonSecKillMsg) {

    $("#WinBtnOrder").html("立即抢购");
    $("#BtnOrder").html("立即抢购");

    //判断是否为 限时秒杀 或一般抢购秒杀
    if (pJsonSecKillMsg.EndTime != "" && pJsonSecKillMsg.EndTime != null && pJsonSecKillMsg.EndTime != undefined) {
        $("#SecKillLeft").html("<img src=\"../Assets/Imgs/Icon/clocktimer.png\" />限时秒杀");
        $("#SecKillMid").show();

        //倒计时开始
        mCountDownEndTime = pJsonSecKillMsg.EndTime;
        countDown();
    }
    else {
        $("#SecKillLeft").html("<img src=\"../Assets/Imgs/Icon/clocktimer.png\" />抢购秒杀");
        $("#SecKillMid").hide();
    }

    $("#SkStockNum").html(pJsonSecKillMsg.SkStockNum);
    $("#SkSaleNum").html(pJsonSecKillMsg.SkSaleNum);

    mSkStockNum = pJsonSecKillMsg.SkStockNum; //秒杀总库存数量
}

//================倒计时===============//
var mCountDownEndTime = ""; //倒计时，结束时间

function addZero(i) {
    return i < 10 ? "0" + i : i + "";
}
function countDown() {

    var nowtime = new Date();
    //var endtime = new Date("2020/07/03 17:57:00");
    var endtime = new Date(mCountDownEndTime);
    var lefttime = parseInt((endtime.getTime() - nowtime.getTime()) / 1000);
    var d = parseInt(lefttime / (24 * 60 * 60))
    var h = parseInt(lefttime / (60 * 60) % 24);
    var m = parseInt(lefttime / 60 % 60);
    var s = parseInt(lefttime % 60);
    d = addZero(d)
    h = addZero(h);
    m = addZero(m);
    s = addZero(s);

    var myJsVal = "";    myJsVal += "<span>" + d + "</span>天";    myJsVal += "<span>" + h + "</span>:";    myJsVal += "<span>" + m + "</span>:";    myJsVal += "<span>" + s + "</span>";
    // document.querySelector("#SecKillMid").innerHTML = `活动倒计时  ${d}天 ${h} 时 ${m} 分 ${s} 秒`;
    document.querySelector("#SecKillMid").innerHTML = myJsVal;

    if (lefttime <= 0) {
        document.querySelector("#SecKillMid").innerHTML = "活动已结束";
        return;
    }
    setTimeout(countDown, 1000);
}


//=================拼团===================//

/**
 * 初始化拼团商品设置信息
 * @param pCallBack 回调函数
 * */
function initGroupGoodsSetting(pCallBack) {

    //构造POST参数
    var dataPOST = {
        "Type": "1", "GoodsID": mGoodsID,
    };
    console.log(dataPOST);
    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: "../GroupAjax/GroupGoodsSetting?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("初始化拼团商品设置信息=" + reTxt);
            if (reTxt != "") {
                var _jsonReTxt = JSON.parse(reTxt);

                $("#GroupSaleNum").html(_jsonReTxt.GroupSaleNum);

                //记录拼团折扣
                mGroupDiscount = _jsonReTxt.GroupDiscount;

                //回调函数
                pCallBack();
            }
        }
    });

}