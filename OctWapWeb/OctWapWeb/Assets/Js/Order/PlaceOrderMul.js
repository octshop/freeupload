//================确认订单 -- 多个商家多个商品===================//

/**-----定义公共变量------**/

//AjaxURL
var mAjaxUrl = "../OrderAjax/PlaceOrderMul";
//标记是否需要加载收货地址
var mIsLoadReceiAddr = false; //默认不需要加载
//当前打开优惠券窗口， 初始化优惠券使用列表对象 不同商家数据不一样
var mUseCouponsMsgListJsonByShop = null;

//当前店铺订单的索引 初始化确认订单Json对象数组索引 可看做 ShopMsgArr 的索引
var mShopOrderIndex = 0;
//初始化确认订单信息Json对象
var mInitOrderGoodsMsgJsonObj = null;

//记录发票信息
var mInvoiceType = "General"; //发票类型
var mInvoiceTitle = "Person"; //发票抬头
var mInvoiceContent = "InvoiceNo"; //发票内容
//当前编辑保存的发票Guid
var mInvoiceGuid = "";

//当前操作的商家UserID
var mShopUserID = "";


//-----支付相关-----//
var mSelPayType = "WeiXinPay"; //当前选择支付方式 
var mPayJsonReTxt = null; //提交订单返回的信息  -- 支付要用的

var mCurrentBalance = 0; //当前的用户余额
var mCurrentIntegral = 0; //当前的用户积分

var mTotalOrderPrice = 0; //所有支付订单的总额
var mIsPayDelivery = "false"; //是否显示货到付款支付项
var mIsPayOffline = "false"; //是否显示【到店付】项
var mIsBuyerIntegralPay = "false"; //是否显示【积分支付】项
var mIsPayTransfer = "false"; //是否显示【银行转账】项

//------定时器，监听支付窗口是否关闭-----//
var mTimerPayWinClose = null;

/**------初始化------**/
$(function () {

    //初始化买家收货地址
    initBuyerReceiAddr();

    //初始化商家商品列表信息
    //initGoodsShopListMsg();

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
        url: "../OrderAjax/PlaceOrder?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("收货地址=" + reTxt);
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

            //初始化商家商品列表信息
            initGoodsShopListMsg();


        }
    });
}

/**
 * 初始化商家商品列表信息
 * */
function initGoodsShopListMsg() {

    //构造POST参数
    var dataPOST = {
        "Type": "1",
    };
    console.log(dataPOST);
    //加载提示
    $("#OrderGoodsMsgDiv").html("<div style=\"font-size: 14px;text-align:center;padding-top: 50px;\">… 数据加载中 …</div>");
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

                //记录这个对象 
                mInitOrderGoodsMsgJsonObj = _jsonReTxt;

                if (mInitOrderGoodsMsgJsonObj == null || mInitOrderGoodsMsgJsonObj == undefined) {
                    return;
                }


                //判断是否需要加载 买家收货地址
                isLoadReceiAddr(_jsonReTxt.OrderMsgArr);

                //构造确认订单信息列表显示代码 
                var _xhtml = xhtmlOrderList(_jsonReTxt);
                //显示代码插入前台
                $("#OrderGoodsMsgDiv").html(_xhtml);

                //统计总的订单金额，包含所有的订单
                sumTotalOrderPrice();
            }
        }
    });
}

/**
 * 构造确认订单信息列表显示代码 
 * @param {any} pInitOrderGoodsMsgJsonObj 初始化订单商品信息Json对象
 */
function xhtmlOrderList(pInitOrderGoodsMsgJsonObj) {

    var ShopMsgArr = pInitOrderGoodsMsgJsonObj.ShopMsgArr; //店铺信息数组
    var GoodsMsgArr = pInitOrderGoodsMsgJsonObj.GoodsMsgArr; //商品信息数组
    var OrderMsgArr = pInitOrderGoodsMsgJsonObj.OrderMsgArr; //订单信息数组



    var myJsVal = "";    //循环构造    for (var i = 0; i < ShopMsgArr.length; i++) {        myJsVal += " <div class=\"oct-section order-list\">";        myJsVal += "            <div class=\"order-item-title\" id=\"OrderItemTitle\">";        myJsVal += "                <a href=\"../Shop/Index?SID=" + ShopMsgArr[i].ShopID +"\" target=\"_blank\">" + ShopMsgArr[i].ShopName + "</a>";        myJsVal += "            </div>";        //订单的商品总数        var _orderTotalNum = 0;        //订单商品ID拼接字符串        var _goodsIDArr = "";        //加入折扣后的商品单价拼接字符串 "^"字符拼接        var _goodsUnitPriceArr = "";        //商家订单中商品信息数组        var ShopGoodsArr = GoodsMsgArr[i].ShopGoodsArr;        for (var j = 0; j < ShopGoodsArr.length; j++) {            //商品价格,加上折扣            var _goodsPrice = parseFloat(ShopGoodsArr[j].GoodsPrice);            if (ShopGoodsArr[j].GoodsPriceSpec > 0) {                _goodsPrice = ShopGoodsArr[j].GoodsPriceSpec;
            }            //乘以折扣            if (ShopGoodsArr[j].Discount != 0 && ShopGoodsArr[j].Discount != "0" && ShopGoodsArr[j].Discount != "") {                _goodsPrice = formatNumberDotDigit(_goodsPrice * (ShopGoodsArr[j].Discount / 10), 2);
            }            //构造规格属性参数            var _specPropShow = "";            if (ShopGoodsArr[j].SpecParamValFather != "") {                _specPropShow = ShopGoodsArr[j].SpecParamValFather + "," + ShopGoodsArr[j].SpecParamVal;
            }            else {                _specPropShow = ShopGoodsArr[j].SpecParamVal;
            }            //到店徽章
            var _spanBadge = "";
            if (ShopGoodsArr[j].IsShopExpense == "true") {
                _spanBadge = " <span style=\"color:white;background:red;padding:1px 3px;border-radius:5px\">到店</span>";
            }            //规格属性ID,有属性ID则显示属性ID,没有则显示规格ID            var _specPropID = ShopGoodsArr[j].SpecID;            if (ShopGoodsArr[j].PropID != 0 && ShopGoodsArr[j].PropID != "0") {                _specPropID = ShopGoodsArr[j].PropID;
            }            myJsVal += "            <div class=\"scart-item-goods\">";            myJsVal += "                <div class=\"item-goods-mid\" id=\"GoodsImgDiv\">";            myJsVal += "                    <a href=\"../Goods/GoodsDetail?GID=" + ShopGoodsArr[j].GoodsID + "\" target=\"_blank\">";            myJsVal += "                        <img src=\"//" + ShopGoodsArr[j].GoodsImg + "\" />";            myJsVal += "                    </a>";            myJsVal += "                </div>";            myJsVal += "                <div class=\"item-goods-right\">";            myJsVal += "                    <ul>";            myJsVal += "                        <li>";            myJsVal += "                            <span id=\"GoodsTitleSpan\">" + ShopGoodsArr[j].GoodsTitle + _spanBadge + "</span>";            myJsVal += "                        </li>";            myJsVal += "                        <li class=\"goods-right-spec\">";            myJsVal += "                            <span id=\"SpecParamValSpan\">" + _specPropShow + "</span>";            myJsVal += "                        </li>";            myJsVal += "                        <li class=\"goods-right-price\">";            myJsVal += "                            <div class=\"goods-price\" id=\"GoodsPriceDiv\">";            myJsVal += "                                &#165;" + _goodsPrice + "";            myJsVal += "                            </div>";            myJsVal += "                            <div class=\"goods-txt-number\">";            myJsVal += "                                <input class=\"btn-reduce\" type=\"button\" value=\"-\" onclick=\"addReduceOrderNum(\'Reduce\'," + ShopGoodsArr[j].CartID + "," + ShopGoodsArr[j].GoodsID + "," + _specPropID + "," + ShopMsgArr[i].ShopID + "," + i + ")\" />";            myJsVal += "                                <input class=\"input-order-number\" name=\"InputOrderNumber_" + ShopMsgArr[i].ShopID + "\" id=\"OrderNum_" + ShopGoodsArr[j].CartID + "\"  type=\"number\" value=\"" + ShopGoodsArr[j].OrderNum + "\" onkeyup=\"chgOrderNumTxt(" + ShopGoodsArr[j].CartID + "," + ShopGoodsArr[j].GoodsID + "," + _specPropID + "," + ShopMsgArr[i].ShopID + "," + i + ")\" onblur=\"chgOrderNumTxt(" + ShopGoodsArr[j].CartID + "," + ShopGoodsArr[j].GoodsID + "," + _specPropID + "," + ShopMsgArr[i].ShopID + "," + i + "," + true + ")\" />";            myJsVal += "                                <input class=\"btn-add\" type=\"button\" value=\"+\" onclick=\"addReduceOrderNum(\'Add\'," + ShopGoodsArr[j].CartID + "," + ShopGoodsArr[j].GoodsID + "," + _specPropID + "," + ShopMsgArr[i].ShopID + "," + i + ")\" />";            myJsVal += "                            </div>";            myJsVal += "                        </li>";            myJsVal += "                    </ul>";            myJsVal += "                </div>";            myJsVal += "            </div>";            //订单商品总数            _orderTotalNum += parseInt(ShopGoodsArr[j].OrderNum);            //订单商品ID拼接字符串            _goodsIDArr += ShopGoodsArr[j].GoodsID + "^";            //加入折扣后的商品单价拼接字符串 "^"字符拼接            _goodsUnitPriceArr += _goodsPrice + "^";        }        //去掉前后的"^"        _goodsIDArr = removeFrontAndBackChar(_goodsIDArr, "^");        _goodsUnitPriceArr = removeFrontAndBackChar(_goodsUnitPriceArr, "^");        //---------运费的显示----------//        var FreightTemplateParamArr = GoodsMsgArr[i].FreightTemplateParamArr;        var _sumFreightPrice = 0;//运费总额        //上一个单品的ID        var _preGoodsID = 0;        for (var m = 0; m < FreightTemplateParamArr.length; m++) {            //如果是到店则跳过            if (ShopGoodsArr[m].IsShopExpense == "true") {                continue;
            }            //如果上一个商品ID与当前商品ID相同，说明是同一个商品,乘以续件。            if (_preGoodsID == ShopGoodsArr[m].GoodsID) {                _sumFreightPrice += FreightTemplateParamArr[m].AddPieceMoney * ShopGoodsArr[m].OrderNum;
            }            else {                _sumFreightPrice += sumFreightPrice(FreightTemplateParamArr[m], ShopGoodsArr[m].OrderNum)
            }
            _preGoodsID = ShopGoodsArr[m].GoodsID;
        }        _sumFreightPrice = formatNumberDotDigit(_sumFreightPrice, 2);        //如果订单是到店消费或自取则运费为0        if (OrderMsgArr[i].IsShopExpense == "true" || OrderMsgArr[i].IsShopExpense == true) {            _sumFreightPrice = 0;
        }        //---配送方式---//        var _expressValShow = "送货上门(快递)";        var _expressTypeVal = ""; //配送方式正式值 express , shop        var _expressValXhtml = ""; //快递方式切换HTML        var _isShowShopAddNav = false; //是否显示店铺地址导航,默认不显示        if (OrderMsgArr[i].IsShopExpense == "true") //到店        {            _expressValShow = "到店消费/自取";

            _expressValXhtml += "<div class=\"express-type-current\" id=\"ShopToValDiv_" + ShopMsgArr[i].ShopID + "\" onclick=\"chgIsShopExpense('true','" + ShopMsgArr[i].ShopID + "',0)\">";            _expressValXhtml += "到店消费/自取";            _expressValXhtml += "</div>";

            _isShowShopAddNav = true; //显示 店铺地址导航

            _expressTypeVal = "shop"; //到店
        }        else if (OrderMsgArr[i].IsShopExpense == "false") //快递物流        {            _expressValShow = "送货上门(快递)";

            _expressValXhtml += "<div class=\"express-type-current\" id=\"ExpressValDiv_" + ShopMsgArr[i].ShopID + "\" onclick=\"chgIsShopExpense('false','" + ShopMsgArr[i].ShopID + "'," + _sumFreightPrice + ")\">";            _expressValXhtml += "送货上门(快递)";            _expressValXhtml += "</div>";

            isShowShopAddNav = false; //不显示 店铺地址导航

            _expressTypeVal = "express"; //快递物流
        }        else //both  到店,快递物流        {            _expressValShow = "送货上门(快递)";

            _expressValXhtml += "<div class=\"express-type-current\" id=\"ExpressValDiv_" + ShopMsgArr[i].ShopID + "\" onclick=\"chgIsShopExpense('false','" + ShopMsgArr[i].ShopID + "'," + _sumFreightPrice + ")\">";            _expressValXhtml += "送货上门(快递)";            _expressValXhtml += "</div>";            _expressValXhtml += "<div id=\"ShopToValDiv_" + ShopMsgArr[i].ShopID + "\" onclick=\"chgIsShopExpense('true','" + ShopMsgArr[i].ShopID + "',0)\">";            _expressValXhtml += "到店消费/自取";            _expressValXhtml += "</div>";

            _isShowShopAddNav = true; //显示 店铺地址导航

            _expressTypeVal = "express"; //快递物流
        }        myJsVal += "            <div class=\"express-type\">";        myJsVal += "                <div class=\"express-type-top\">";        myJsVal += "                    <div>配送方式</div>";        myJsVal += "                    <div class=\"express-type-val\" id=\"ExpressTypeValDiv_" + ShopMsgArr[i].ShopID + "\">" + _expressValShow + "</div>";        myJsVal += "                </div>";        myJsVal += "                <div class=\"express-type-bottom\">";        myJsVal += _expressValXhtml;        myJsVal += "                </div>";        myJsVal += "<input type=\"hidden\" id=\"hidExpressTypeVal_" + ShopMsgArr[i].ShopID + "\" name=\"ExpressTypeName\" value=\"" + _expressTypeVal + "\" />";        myJsVal += "            </div>";        //显示 店铺地址导航        if (_isShowShopAddNav == true) {            var _shopAddrDetail = ShopMsgArr[i].RegionNameArr + "_" + ShopMsgArr[i].DetailAddr;            myJsVal += "            <div class=\"freight-main shop-nav-addr\">";            myJsVal += "                <div class=\"nav-addr-left\">";            myJsVal += "                    店铺";            myJsVal += "                </div>";            myJsVal += "                <div class=\"freight-price nav-addr-mid\">";            myJsVal += _shopAddrDetail;            myJsVal += "                </div>";            myJsVal += "                <div class=\"nav-addr-right\" onclick=\"openShopNavWin('" + ShopMsgArr[i].Latitude + "', '" + ShopMsgArr[i].Longitude + "', '" + ShopMsgArr[i].ShopName + "', '" + _shopAddrDetail + "')\">";            myJsVal += "                    导航";            myJsVal += "                </div>";            myJsVal += "            </div>";
        }        myJsVal += "            <div class=\"freight-main\" style=\"display:none;\">";        myJsVal += "                <div>";        myJsVal += "                    运费";        myJsVal += "                </div>";        myJsVal += "                <div class=\"freight-price\">";        myJsVal += "                    <b id=\"FreightValB_" + ShopMsgArr[i].ShopID + "\">&#165; " + _sumFreightPrice + "</b>";        myJsVal += "                </div>";        myJsVal += "<input type=\"hidden\" id=\"hidFreightPrice_" + ShopMsgArr[i].ShopID + "\" value=\"" + _sumFreightPrice + "\" />";        myJsVal += "            </div>";        myJsVal += "            <div style=\"display:none;\" class=\"invoice\" onclick=\"openInvoiceWin(" + ShopMsgArr[i].ShopUserID + ",'" + OrderMsgArr[i].InvoiceGuid + "')\">";        myJsVal += "                <div>";        myJsVal += "                    发票";        myJsVal += "                </div>";        myJsVal += "                <div class=\"invoice-val\" id=\"InvoiceValDiv_" + ShopMsgArr[i].ShopUserID + "\">";        myJsVal += "                    不开发票";        myJsVal += "                </div>";        myJsVal += "            </div>";        //---------优惠券信息----------//        //如果订单的总额小于 优惠券的金额，则不使用优惠券
        if (OrderMsgArr[i].OrderPriceSubTotal < OrderMsgArr[i].CouponsDefault.UseDiscountMoney) {            OrderMsgArr[i].CouponsDefault = "";
        }        var CouponsDefault = OrderMsgArr[i].CouponsDefault        //if (CouponsDefault != "") {        var _showCouponsDefault = "";        var CouponsDefault_UseDiscountMoney = 0;        var CouponsDefault_IssueID = 0;        var CouponsDefault_UseGoodsID = 0;        if (CouponsDefault == "") {            _showCouponsDefault = "没有可用优惠券";
        }        else {            if (parseFloat(CouponsDefault.ExpenseReachSum) > 0) {                _showCouponsDefault = "满" + CouponsDefault.ExpenseReachSum
            }            _showCouponsDefault += "减" + CouponsDefault.UseDiscountMoney + "元";

            CouponsDefault_UseDiscountMoney = CouponsDefault.UseDiscountMoney;
            CouponsDefault_IssueID = CouponsDefault.IssueID;
            CouponsDefault_UseGoodsID = CouponsDefault.UseGoodsID;
        }        console.log("CouponsDefault_UseGoodsID=" + CouponsDefault_UseGoodsID);        myJsVal += "            <div class=\"ticket\" id=\"CouponsMsgDiv_" + ShopMsgArr[i].ShopID + "\" onclick=\"openUseTicketWin('" + _goodsIDArr + "','" + _goodsUnitPriceArr + "'," + OrderMsgArr[i].OrderPriceSubTotal + ",'" + ShopMsgArr[i].ShopID + "')\">";        myJsVal += "                <div>";        myJsVal += "                    优惠券";        myJsVal += "                </div>";        myJsVal += "                <div class=\"ticket-val\">";        myJsVal += "                    <span id=\"CouponsMsgSpan_" + ShopMsgArr[i].ShopID + "\">" + _showCouponsDefault + "<b>&#165;-" + CouponsDefault_UseDiscountMoney + " </b></span>";        myJsVal += "                </div>";        myJsVal += "<input type=\"hidden\" id=\"hidCouponsDefault_" + ShopMsgArr[i].ShopID + "\"  value=\"" + CouponsDefault_IssueID + "_" + CouponsDefault_UseDiscountMoney + "_" + CouponsDefault_UseGoodsID + "\" />";        myJsVal += "            </div>";        //}        myJsVal += "            <div class=\"buyer-memo\">";        myJsVal += "                <div>留言</div>";        myJsVal += "                <div class=\"buyer-memo-val\">";        myJsVal += "                    <input type=\"text\" id=\"OrderMemo_" + ShopMsgArr[i].ShopID + "\" value=\"\" placeholder=\"给商家的留言信息\" />";        myJsVal += "                </div>";        myJsVal += "            </div>";        //-------订单小计金额-----------//        var UseDiscountMoney = 0;        if (CouponsDefault.UseDiscountMoney != undefined) {            UseDiscountMoney = CouponsDefault.UseDiscountMoney;
        }        var _sumOrderPriceSub = parseFloat(OrderMsgArr[i].OrderPriceSubTotal) + parseFloat(_sumFreightPrice) - parseFloat(UseDiscountMoney);        //格式化金额        _sumOrderPriceSub = formatNumberDotDigit(_sumOrderPriceSub, 2);        myJsVal += "            <div class=\"sum-price\">";        myJsVal += "                共<b id=\"OrderNumB_" + ShopMsgArr[i].ShopID + "\">" + _orderTotalNum + "</b>件商品,小计：<b class=\"sum-price-content\" id=\"SumPriceContentDiv_" + ShopMsgArr[i].ShopID + "\">&#165; " + _sumOrderPriceSub + "</b>";        myJsVal += "            </div>";        myJsVal += "<input type=\"hidden\" id=\"hidSumOrderSub_" + ShopMsgArr[i].ShopID + "\" class=\"sum-order-sub\" name=\"SumOrderSub\" value=\"" + _sumOrderPriceSub + "\" />";        myJsVal += "</div>";    }

    //返回显示代码
    return myJsVal;
}

/**
 * 统计总的订单金额，包含所有的订单 -- 用于初始化订单时的
 * */
function sumTotalOrderPrice() {

    //总订单金额 
    var _totalOrderPrice = 0

    var _sumOrderSubArr = $("input[name='SumOrderSub']");
    //console.log(_sumOrderSubArr);
    for (var i = 0; i < _sumOrderSubArr.length; i++) {
        //console.log(_sumOrderSubArr.eq(i).val());
        _totalOrderPrice += parseFloat(_sumOrderSubArr.eq(i).val());
    }

    _totalOrderPrice = formatNumberDotDigit(_totalOrderPrice);
    $("#SumOrderPriceB").html("&#165; " + _totalOrderPrice);

    return _totalOrderPrice;
}

/**
 * 小计店铺订单总额
 * @param {any} pShopID 店铺ID
 */
function countShopOrderPrice(pShopID) {

    if (mInitOrderGoodsMsgJsonObj == null || mInitOrderGoodsMsgJsonObj == undefined) {
        toastWin("订单信息初始化失败,请刷新！");
        return;
    }

    var ShopMsgArr = mInitOrderGoodsMsgJsonObj.ShopMsgArr //店铺信息数组
    var GoodsMsgArr = mInitOrderGoodsMsgJsonObj.GoodsMsgArr //商品,运费信息数组
    var OrderMsgArr = mInitOrderGoodsMsgJsonObj.OrderMsgArr //订单信息数组

    //当前店铺在初始化Json对象数组中的索引,从0开始的
    var ShopOrderIndex = null;
    //小计金额
    var _sumShopOrderPrice = 0;
    //商品的总数量
    var _sumOrderNum = 0;

    //得到当前店铺在初始化Json对象数组中的索引
    for (var i = 0; i < ShopMsgArr.length; i++) {
        if (pShopID == ShopMsgArr[i].ShopID) {
            ShopOrderIndex = i;
        }
    }

    //获取店铺订单，单个商品的订购数量数组
    var _goodsSingleOrderNumArr = $("input[name='InputOrderNumber_" + pShopID + "']");
    //得到店铺订单所有商品的订购数量
    var _goodsOrderNumArr = new Array();
    for (var j = 0; j < _goodsSingleOrderNumArr.length; j++) {
        _goodsOrderNumArr[j] = parseInt(_goodsSingleOrderNumArr.eq(j).val().trim());
    }
    console.log(_goodsSingleOrderNumArr);

    //循环统计商品单价加入折扣后和订购数量的小计
    for (var n = 0; n < _goodsOrderNumArr.length; n++) {

        //当前的商品信息
        var _ShopGoodsMsg = GoodsMsgArr[ShopOrderIndex].ShopGoodsArr[n];

        //计算商品单价
        var _goodsUnitPrice = 0;
        if (parseFloat(_ShopGoodsMsg.GoodsPriceSpec) > 0) {

            if (parseFloat(_ShopGoodsMsg.Discount) <= 0) {
                _ShopGoodsMsg.Discount = 10;
            }

            _goodsUnitPrice = (parseFloat(_ShopGoodsMsg.GoodsPriceSpec) * (parseFloat(_ShopGoodsMsg.Discount) / 10));
        }
        else {

            if (parseFloat(_ShopGoodsMsg.Discount) <= 0) {
                _ShopGoodsMsg.Discount = 10;
            }

            _goodsUnitPrice = (parseFloat(_ShopGoodsMsg.GoodsPrice) * (parseFloat(_ShopGoodsMsg.Discount) / 10));
        }

        //计算 订单小计总额,消费满多少的总额，需乘以折扣(不包括运费)
        _sumShopOrderPrice += (parseInt(_goodsOrderNumArr[n]) * parseFloat(_goodsUnitPrice));

        //订购总数量
        _sumOrderNum += parseInt(_goodsOrderNumArr[n]);
    }

    //得到运费的金额
    var _sumFreightPrice = 0;
    var _ExpressTypeValDiv = $("#ExpressTypeValDiv_" + pShopID).html();
    if (_ExpressTypeValDiv.indexOf("到店") >= 0) {
        _sumFreightPrice = 0;
    }
    else {
        _sumFreightPrice = parseFloat($("#hidFreightPrice_" + pShopID).val().trim());
    }
    console.log("_sumFreightPrice=" + _sumFreightPrice);

    //运费加到总金额中
    _sumShopOrderPrice += parseFloat(_sumFreightPrice);

    console.log("_sumShopOrderPrice减去优惠券=" + _sumShopOrderPrice);

    //得到优惠券的使用金额
    var _useDiscountMoney = 0;
    try {
        _useDiscountMoney = parseFloat($("#hidCouponsDefault_" + pShopID).val().trim().split("_")[1]);
    } catch (e) { }
    console.log("_useDiscountMoney=" + _useDiscountMoney);

    //总金额减去优惠券的使用金额
    _sumShopOrderPrice -= parseFloat(_useDiscountMoney);

    //格式化总金额
    _sumShopOrderPrice = formatNumberDotDigit(_sumShopOrderPrice);

    //店铺小计金额插入前台
    $("#OrderNumB_" + pShopID).html(_sumOrderNum);
    $("#SumPriceContentDiv_" + pShopID).html("&#165; " + _sumShopOrderPrice);

    console.log("_sumShopOrderPrice减去优惠券金额=" + _sumShopOrderPrice);

    return _sumShopOrderPrice;
}

/**
 * 统计所有店铺订单的总额
 * */
function countTotalOrderPrice() {

    //所有店铺订单的总额
    var _totalOrderPrice = 0;

    //店铺信息数组
    var ShopMsgArr = mInitOrderGoodsMsgJsonObj.ShopMsgArr;

    //循环统计
    for (var i = 0; i < ShopMsgArr.length; i++) {

        //小计店铺订单总额
        _totalOrderPrice += parseFloat(countShopOrderPrice(ShopMsgArr[i].ShopID));

        if (_totalOrderPrice <= 0) {

            _totalOrderPrice = 0;
            //赋值隐藏控件
            $("#hidCouponsDefault_" + ShopMsgArr[i].ShopID).val(0 + "_" + 0 + "_" + 0);
            //隐藏优惠券区域
            $("#CouponsMsgDiv_" + ShopMsgArr[i].ShopID).hide();

            //小计店铺订单总额
            _totalOrderPrice += parseFloat(countShopOrderPrice(ShopMsgArr[i].ShopID));
        }

    }
    console.log("_totalOrderPrice=" + _totalOrderPrice);

    //格式化总金额
    _totalOrderPrice = formatNumberDotDigit(_totalOrderPrice);

    //总金额插入前台
    $("#SumOrderPriceB").html("&#165; " + _totalOrderPrice + " ");

}


/**
 * 统计商家订单的总运费是多少
 * @param {any} pFreightTemplateParamJsonObj 每个商品的运费信息，Json对象 
 * @param pOrderNum 订购数量
 */
function sumFreightPrice(pFreightTemplateParamJsonObj, pOrderNum) {

    var _sumPrice = parseFloat(pFreightTemplateParamJsonObj.FreightMoney);

    if (pOrderNum > 1 && parseFloat(pFreightTemplateParamJsonObj.AddPieceMoney) > 0) {
        _sumPrice += (parseInt(pOrderNum) - 1) * parseFloat(pFreightTemplateParamJsonObj.AddPieceMoney);
    }

    return _sumPrice;
}

/**
 * 判断是否需要加载 买家收货地址
 * @param {any} pJsonObjOrderMsgArr 订单信息数组 Json对象
 */
function isLoadReceiAddr(pJsonObjOrderMsgArr) {

    for (var i = 0; i < pJsonObjOrderMsgArr.length; i++) {
        if (pJsonObjOrderMsgArr[i].IsShopExpense == "false" || pJsonObjOrderMsgArr[i].IsShopExpense == "both") {

            $("#SelAddrClick").show();

            mIsLoadReceiAddr = true;

            return true;//需要加载
        }
    }
}


/**
 * 增减订购数量
 * @param {any} pType 操作类别  [Add增 Reduce减]
 * @param pLabelID 标签ID
 * @param {any} pGoodsID 商品ID
 * @param {any} pSpecPropID 规格或属性ID
 * @param pShopID 店铺ID
 *  @param pShopOrderIndex 初始化字符串店铺所在索引值
 */
function addReduceOrderNum(pType, pLabelID, pGoodsID, pSpecPropID, pShopID, pShopOrderIndex) {

    //获取当前订购数量
    var OrderNum = parseInt($("#OrderNum_" + pLabelID).val().trim());
    //预订购数量
    var _OrderNumPre = OrderNum;

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
        _OrderNumPre = 1;
    }
    //赋值给文本框
    $("#OrderNum_" + pLabelID).val(OrderNum);

    //判断库存是否足够
    isStockEnough(pGoodsID, pSpecPropID, OrderNum, function (_jsonReTxt) {

        if (_jsonReTxt.ErrMsg != null && _jsonReTxt.ErrMsg != "") {
            toastWin("库存不足！");
            $("#OrderNum_" + pLabelID).val(_OrderNumPre);
            return;
        }
        else {
            //计算运费
            countFreightPrice(pShopID, pShopOrderIndex);
            //重新初始化默认使用的优惠券信息
            reloadDefaultUseCouponsMsgMul(pShopID, pShopOrderIndex);
        }


    });

    return;
}

/**
 * 判断库存是否足够
 * @param {any} pGoodsID 商品ID
 * @param {any} pSpecPropID 规格或属性ID
 * @param {any} pOrderNum 订购数量
 * @param pCallBackOk 判断成功后回调 返回Json对象 
 */
function isStockEnough(pGoodsID, pSpecPropID, pOrderNum, pCallBackOk) {

    //构造POST参数
    var dataPOST = {
        "Type": "3", "GoodsID": pGoodsID, "SpecPropID": pSpecPropID, "OrderNum": pOrderNum,
    };
    console.log(dataPOST);
    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: mAjaxUrl + "?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("判断库存是否足够=" + reTxt);
            if (reTxt != "") {
                var _jsonReTxt = JSON.parse(reTxt);

                //回调函数
                pCallBackOk(_jsonReTxt);

            }
        }
    });
}

/**
 * 重新统计商家订单的运费
 * @param {any} pLabelID 标签ID,一般是店铺ID
 * @param pShopOrderIndex 初始化字符串店铺所在索引值
 */
function countFreightPrice(pLabelID, pShopOrderIndex) {

    //总的运费
    var _sumFreightMoney = 0;

    //获取店铺订单，单个商品的订购数量
    var _goodsSingleOrderNumArr = $("input[name='InputOrderNumber_" + pLabelID + "']");

    console.log(_goodsSingleOrderNumArr);
    console.log("---------_goodsSingleOrderNumArr=" + _goodsSingleOrderNumArr.length);

    var _freightTemplateParamArr = mInitOrderGoodsMsgJsonObj.GoodsMsgArr[pShopOrderIndex].FreightTemplateParamArr;

    //商品信息数组
    var _shopGoodsArr = mInitOrderGoodsMsgJsonObj.GoodsMsgArr[pShopOrderIndex].ShopGoodsArr;
    //console.log(_shopGoodsArr);

    if (mInitOrderGoodsMsgJsonObj.OrderMsgArr[pShopOrderIndex].IsShopExpense == "true") {
        return;
    }

    //输出运费模板信息
    //console.log(_freightTemplateParamArr);

    //上一个单品的ID    var _preGoodsID = 0;

    //循环计算
    for (var i = 0; i < _goodsSingleOrderNumArr.length; i++) {
        //订购数量
        var _goodsSingleOrderNum = parseInt(_goodsSingleOrderNumArr.eq(i).val().trim());

        var _freightTemplateParam = _freightTemplateParamArr[i];

        //console.log("_preGoodsID=" + _preGoodsID + " | _shopGoodsArr[i].GoodsID=" + _shopGoodsArr[i].GoodsID);
        if (_preGoodsID == _shopGoodsArr[i].GoodsID) {
            //console.log("执行啦11111111");
            _sumFreightMoney += _freightTemplateParam.AddPieceMoney * parseInt(_goodsSingleOrderNum);
        }
        else {
            //计算方法
            _sumFreightMoney += _freightTemplateParam.FreightMoney + (parseInt(_goodsSingleOrderNum) - 1) * _freightTemplateParam.AddPieceMoney;
        }

        _preGoodsID = _shopGoodsArr[i].GoodsID
    }

    //运费插入前台
    $("#hidFreightPrice_" + pLabelID).val(_sumFreightMoney);

    //当前订单的配送方式 
    var _expressTypeVal = $("#hidExpressTypeVal_" + pLabelID).val().trim();

    if (_expressTypeVal == "express") {
        $("#FreightValB_" + pLabelID).html("&#165; " + _sumFreightMoney + "");
    }
}


/**
 * 输入订购数量时，更改各项显示
 * @param pLabelID 标签ID -- SCartID
 * @param {any} pGoodsID 商品ID
 * @param {any} pSpecPropID 规格或属性ID
 * @param pShopID 店铺ID
 * @param pShopOrderIndex 初始化字符串店铺所在索引值
 * @param pIsFocusEvent  是否为失去焦点事件
 * */
function chgOrderNumTxt(pLabelID, pGoodsID, pSpecPropID, pShopID, pShopOrderIndex, pIsFocusEvent) {

    var _orderNum = $("#OrderNum_" + pLabelID).val();

    //预订购数量
    var _OrderNumPre = parseInt(_orderNum);

    if (_orderNum == "0") {
        $("#OrderNum_" + pLabelID).val("1");
    }
    if (_orderNum == "") {

        if (pIsFocusEvent != null && pIsFocusEvent != undefined && pIsFocusEvent == true) {
            _orderNum = "1";
            $("#OrderNum_" + pLabelID).val("1");
        }
        else {
            return;
        }
    }

    if (isNaN(_OrderNumPre)) {
        _orderNum = "1";
        _OrderNumPre = 1;
    }


    //判断库存是否足够
    isStockEnough(pGoodsID, pSpecPropID, _orderNum, function (_jsonReTxt) {

        if (_jsonReTxt.ErrMsg != null && _jsonReTxt.ErrMsg != "") {
            toastWin("库存不足！");
            $("#OrderNum_" + pLabelID).val(_OrderNumPre);
            return;
        }
        else {
            //计算运费
            countFreightPrice(pShopID, pShopOrderIndex);
            //重新初始化默认使用的优惠券信息
            reloadDefaultUseCouponsMsgMul(pShopID, pShopOrderIndex);
            ////小计店铺订单总额
            //countShopOrderPrice(pShopID)
            //统计所有店铺订单的总额
            //countTotalOrderPrice();
        }


    });

    return;
}

/**
 * 改变配送方式
 * @param {any} pIsShopExpense 配送方式 true false both
 * @param pLabelID 标签的ID 一般是店铺ID
 */
function chgIsShopExpense(pIsShopExpense, pLabelID) {

    $("#ExpressValDiv_" + pLabelID).removeClass("express-type-current");
    $("#ShopToValDiv_" + pLabelID).removeClass("express-type-current");

    //到店消费
    if (pIsShopExpense == "true") {
        $("#ExpressTypeValDiv_" + pLabelID).html("到店消费/自取");
        $("#ShopToValDiv_" + pLabelID).addClass("express-type-current");

        $("#hidExpressTypeVal_" + pLabelID).val("shop");

        //运费
        $("#FreightValB_" + pLabelID).html("&#165; 0");
        //$("#hidFreightPrice_" + pLabelID).val("0");
    }
    else if (pIsShopExpense == "false") //  快递发货
    {
        $("#ExpressTypeValDiv_" + pLabelID).html("送货上门(快递)");
        $("#ExpressValDiv_" + pLabelID).addClass("express-type-current");

        $("#hidExpressTypeVal_" + pLabelID).val("express");

        //运费
        var _FreightPrice = $("#hidFreightPrice_" + pLabelID).val().trim();
        $("#FreightValB_" + pLabelID).html("&#165; " + _FreightPrice);
        //$("#hidFreightPrice_" + pLabelID).val("" + pFreightPrice + "");

    }

    //统计所有店铺订单的总额
    countTotalOrderPrice();
}

/**
 * 重新加载默认使用的优惠券
 * @param {any} pShopID 店铺ID
 * @param {any} pShopOrderIndex  初始化字符串店铺所在索引值
 */
function reloadDefaultUseCouponsMsgMul(pShopID, pShopOrderIndex) {

    // pGoodsIDArr, pExpenseReachSum, pSpecPropIDArr, pGoodsUnitPriceArr

    var _goodsIDArr = ""; //用“^”分割
    var _specPropIDArr = ""; //用“^”分割,规格ID或属性ID
    var _goodsUnitPriceArr = ""; //用“^”分割 商品单价，加入折扣后

    var _expenseReachSum = 0; //店铺订单金额小计

    var _goodsOrderNumArr = "";//用“^”分割
    //获取店铺订单，单个商品的订购数量数组
    var _goodsSingleOrderNumArr = $("input[name='InputOrderNumber_" + pShopID + "']");
    for (var j = 0; j < _goodsSingleOrderNumArr.length; j++) {
        _goodsOrderNumArr += _goodsSingleOrderNumArr.eq(j).val().trim() + "^";
    }
    _goodsOrderNumArr = removeFrontAndBackChar(_goodsOrderNumArr, "^");
    //转换成数组
    var _goodsOrderNumArrInt = _goodsOrderNumArr.split("^");

    //获取当前商品信息数组
    var _GoodsMsgArr = mInitOrderGoodsMsgJsonObj.GoodsMsgArr[pShopOrderIndex];
    //循环获取单个商品信息
    for (var i = 0; i < _GoodsMsgArr.ShopGoodsArr.length; i++) {

        //单个商品信息对象
        var _ShopGoodsMsg = _GoodsMsgArr.ShopGoodsArr[i];

        //商品的单价，加入折扣后
        var _goodsUnitPrice = 0;

        //构造商品ID拼接字符串
        _goodsIDArr += _ShopGoodsMsg.GoodsID + "^";

        //规格或属性ID拼接字符串
        if (_ShopGoodsMsg.PropID != 0 && _ShopGoodsMsg.PropID != "0") {
            _specPropIDArr += _ShopGoodsMsg.PropID + "^";
        }
        else {
            _specPropIDArr += _ShopGoodsMsg.SpecID + "^";
        }

        //商品单价拼接字符串
        if (parseFloat(_ShopGoodsMsg.GoodsPriceSpec) > 0) {

            if (parseFloat(_ShopGoodsMsg.Discount) <= 0) {
                _ShopGoodsMsg.Discount = 10;
            }

            _goodsUnitPrice = (parseFloat(_ShopGoodsMsg.GoodsPriceSpec) * (parseFloat(_ShopGoodsMsg.Discount) / 10));

            _goodsUnitPriceArr += _goodsUnitPrice + "^";
        }
        else {

            if (parseFloat(_ShopGoodsMsg.Discount) <= 0) {
                _ShopGoodsMsg.Discount = 10;
            }

            _goodsUnitPrice = (parseFloat(_ShopGoodsMsg.GoodsPrice) * (parseFloat(_ShopGoodsMsg.Discount) / 10));

            //console.log("_goodsUnitPrice=" + _goodsUnitPrice);

            _goodsUnitPriceArr += _goodsUnitPrice + "^";
        }

        //计算 订单小计总额,消费满多少的总额，需乘以折扣(不包括运费)
        _expenseReachSum += (parseInt(_goodsOrderNumArrInt[i]) * parseFloat(_goodsUnitPrice));

    }
    //去掉前后的"^"
    _goodsIDArr = removeFrontAndBackChar(_goodsIDArr, "^");
    _specPropIDArr = removeFrontAndBackChar(_specPropIDArr, "^");
    _goodsUnitPriceArr = removeFrontAndBackChar(_goodsUnitPriceArr, "^");

    //打印日志构造的信息
    console.log("_goodsIDArr=" + _goodsIDArr);
    console.log("_specPropIDArr=" + _specPropIDArr);
    console.log("_goodsUnitPriceArr=" + _goodsUnitPriceArr);
    console.log("_goodsOrderNumArr=" + _goodsOrderNumArr);
    console.log("_expenseReachSum=" + _expenseReachSum);

    //-------发送异步请求------//
    //构造POST参数
    var dataPOST = {
        "Type": "4", "GoodsIDArr": _goodsIDArr, "SpecPropIDArr": _specPropIDArr, "GoodsUnitPriceArr": _goodsUnitPriceArr, "ExpenseReachSum": _expenseReachSum,
    };
    console.log(dataPOST);
    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: mAjaxUrl + "?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("重新加载默认使用的优惠券=" + reTxt);
            if (reTxt != "") {
                var _jsonReTxt = JSON.parse(reTxt);

                //构造优惠券显示代码

                //---------优惠券信息----------//                var CouponsDefault = _jsonReTxt                var _showCouponsDefault = "";                if (parseFloat(_expenseReachSum) <= CouponsDefault.UseDiscountMoney) {
                    _showCouponsDefault = "没有可用优惠券";
                    //构造显示代码
                    var _xhtml = _showCouponsDefault + "<b>&#165; -0</b >";
                    $("#CouponsMsgSpan_" + pShopID).html(_xhtml);

                    //赋值隐藏控件
                    $("#hidCouponsDefault_" + pShopID).val(0 + "_" + 0 + "_" + 0);

                }                else {
                    if (parseFloat(CouponsDefault.ExpenseReachSum) > 0) {                        _showCouponsDefault = "满" + CouponsDefault.ExpenseReachSum
                    }                    _showCouponsDefault += "减" + CouponsDefault.UseDiscountMoney + "元";
                    //构造显示代码
                    var _xhtml = _showCouponsDefault + "<b>&#165; -" + CouponsDefault.UseDiscountMoney + "</b >";
                    $("#CouponsMsgSpan_" + pShopID).html(_xhtml);

                    //赋值隐藏控件
                    $("#hidCouponsDefault_" + pShopID).val(CouponsDefault.IssueID + "_" + CouponsDefault.UseDiscountMoney + "_" + CouponsDefault.UseGoodsID);

                }


                //重新设置优惠券单击弹出选择优惠券列表窗口
                $("#CouponsMsgDiv_" + pShopID).unbind(); //必须解决绑定事件，否则再次添加事件会多次执行
                $("#CouponsMsgDiv_" + pShopID).removeAttr("onclick");
                $("#CouponsMsgDiv_" + pShopID).on("click", function () {
                    console.log("重新设置优惠券单击弹出选择优惠券列表窗口");
                    //重新定义领取窗口
                    openUseTicketWin(_goodsIDArr, _goodsUnitPriceArr, _expenseReachSum, pShopID);
                });

                //隐藏优惠券区域
                $("#CouponsMsgDiv_" + pShopID).show();
            }
            else {
                //赋值隐藏控件
                //$("#hidCouponsDefault_" + pShopID).val("");

                //赋值隐藏控件
                $("#hidCouponsDefault_" + pShopID).val(0 + "_" + 0 + "_" + 0);
                //隐藏优惠券区域
                $("#CouponsMsgDiv_" + pShopID).hide();


            }

            //统计所有店铺订单的总额
            countTotalOrderPrice();

        }
    });



}


/**
 * ----------打开使用优惠券的窗口 -------------
 */
var mGetTicketWinHtml = "";
// * @param pLabelID 标签的ID （主要是店铺ID）
function openUseTicketWin(pGoodsIDArr, pGoodsUnitPriceArr, pOrderExpenseReachSum, pLabelID) {

    //console.log("执行了");

    if (mGetTicketWinHtml == "") {

        mGetTicketWinHtml = getGetTicketWinHtml();
    }
    //初始化SliderDown窗口
    initSilderDownWin(600, mGetTicketWinHtml);

    //初始化 买家可以使用的优惠券列表
    initUseCouponsMsgList(pGoodsIDArr, pGoodsUnitPriceArr, pOrderExpenseReachSum, pLabelID);
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
 * 初始化 买家可以使用的优惠券列表 --多个商品
 * @param pGoodsIDArr 商品ID拼接字符中 "^"
 * @param pGoodsUnitPriceArr 加入折扣后的商品单价拼接字符串 "^"字符拼接
 * @param pOrderExpenseReachSum 订单的小计金额，不加入运费
 * @param pLabelID 标签的ID （主要是店铺ID）
 * */
function initUseCouponsMsgList(pGoodsIDArr, pGoodsUnitPriceArr, pOrderExpenseReachSum, pLabelID) {

    if (pGoodsIDArr == undefined || pGoodsIDArr == "") {
        return;
    }
    if (pGoodsUnitPriceArr == undefined || pGoodsUnitPriceArr == "") {
        return;
    }

    //构造POST参数
    var dataPOST = {
        "Type": "2", "GoodsIDArr": pGoodsIDArr, "OrderExpenseReachSum": pOrderExpenseReachSum, "GoodsUnitPriceArr": pGoodsUnitPriceArr,
    };
    console.log(dataPOST);

    //加载提示
    loadingWin();
    $(".loading-win-content").css("width", "130");

    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: mAjaxUrl + "?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("优惠券列表多个商品=" + reTxt);
            //移除加载提示
            closeLoadingWin();
            if (reTxt != "") {
                var _jsonReTxt = JSON.parse(reTxt);

                //mUseCouponsMsgListJson = _jsonReTxt

                //构造买家可使用的优惠券列表显示代码
                var _xhtml = xhtmlUseCouponsMsgList(_jsonReTxt, pLabelID);
                $("#WinTicketList").html(_xhtml);
                $("#CouponsSumB").html(_jsonReTxt.UseCouponsMsgList.length);

            }

            //打开优惠券领取窗口 -- 放在这里可以自适应
            toggleSilderDownWin();
        }
    });
}

/**
 * 构造买家可使用的优惠券列表显示代码
 * @param {any} pUseCouponsMsgListJson 返回的可使用优惠券列表Json对象
 * @param pLabelID 标签的ID （主要是店铺ID）
 */
function xhtmlUseCouponsMsgList(pUseCouponsMsgListJson, pLabelID) {

    //记录选择的商家，买家可以使用的优惠券
    mUseCouponsMsgListJsonByShop = pUseCouponsMsgListJson;

    var _useCouponsMsgListArr = pUseCouponsMsgListJson.UseCouponsMsgList;

    var myJsVal = "";    //循环构造显示代码    for (var i = 0; i < _useCouponsMsgListArr.length; i++) {        var couponsType = "店铺券";        if (_useCouponsMsgListArr[i].IsMallCoupons == "true") {            couponsType = "商城券";
        }        //抵用金额或折扣        var _moneyDiscount = "&#165; " + _useCouponsMsgListArr[i].UseMoney;        if (parseFloat(_useCouponsMsgListArr[i].UseDiscount) > 0) {            _moneyDiscount = _useCouponsMsgListArr[i].UseDiscount + "折";

            couponsType = "店铺折扣券";
            if (_useCouponsMsgListArr[i].IsMallCoupons == "true") {                couponsType = "商城折扣券";
            }
        }        //消费满限制        var _expenseReachName = "无消费限制";        if (parseFloat(_useCouponsMsgListArr[i].ExpenseReachSum) > 0) {            _expenseReachName = "满" + _useCouponsMsgListArr[i].ExpenseReachSum + "使用";
        }        //有效期        var _useTimeRangeName = "永久有效";        if (_useCouponsMsgListArr[i].UseTimeRange != "") {            var _useTimeRangeNameArr = _useCouponsMsgListArr[i].UseTimeRange.split("^");            var _diffDay = diffDateDay(_useTimeRangeNameArr[0], _useTimeRangeNameArr[1]);            _useTimeRangeName = _useCouponsMsgListArr[i].UseTimeRange.replace("^", "至") + " ( " + _diffDay + "天 )";
        }        myJsVal += "<div class=\"win-ticket-item\">";        myJsVal += "  <div class=\"win-ticket-item-left\">";        myJsVal += "      <ul>";        myJsVal += "          <li><b>" + _moneyDiscount + "</b> " + couponsType + " </li>";        myJsVal += "          <li>" + _expenseReachName + "</li>";        myJsVal += "          <li>有效期：" + _useTimeRangeName + "</li>";        myJsVal += "      </ul>";        myJsVal += "  </div>";        myJsVal += "  <div class=\"win-ticket-item-right\" onclick=\"useCoupons(" + _useCouponsMsgListArr[i].IssueID + ",'" + pLabelID + "')\">";        myJsVal += "      立即使用";        myJsVal += "  </div>";        myJsVal += "</div>";
    }    return myJsVal;}

/**
 * 使用优惠券
 * @param pIssueID 优惠券发放ID
 * @param pLabelID 标签的ID （主要是店铺ID）
 * */
function useCoupons(pIssueID, pLabelID) {

    //mIssueID = pIssueID;

    console.log("执行了useCoupons()");

    if (mUseCouponsMsgListJsonByShop == null || mUseCouponsMsgListJsonByShop == "") {
        return;
    }
    var _useCouponsMsgListArr = mUseCouponsMsgListJsonByShop.UseCouponsMsgList;

    //循环检测是否为选择使用的优惠券
    for (var i = 0; i < _useCouponsMsgListArr.length; i++) {
        if (pIssueID == _useCouponsMsgListArr[i].IssueID) {

            var _showCoupons = "";            if (parseFloat(_useCouponsMsgListArr[i].ExpenseReachSum) > 0) {                _showCoupons = "满" + _useCouponsMsgListArr[i].ExpenseReachSum
            }            _showCoupons += "减" + _useCouponsMsgListArr[i].UseDiscountMoney + "元";

            //构造使用的优惠券信息显示代码
            $("#CouponsMsgSpan_" + pLabelID).html(_showCoupons + "<b>&#165;-" + _useCouponsMsgListArr[i].UseDiscountMoney + " </b>");

            //赋值隐藏控件
            $("#hidCouponsDefault_" + pLabelID).val(pIssueID + "_" + _useCouponsMsgListArr[i].UseDiscountMoney + "_" + _useCouponsMsgListArr[i].UseGoodsID);

            //统计所有店铺订单的总额
            countTotalOrderPrice();

            break;
        }
    }



    //关闭Slider窗口
    toggleSilderDownWin();
}


//=======================发票相关业务逻辑=========================//

//发票窗口HTML代码
var mInvoiceWinHtml = "";

/**
 * 打开发票申请窗口
 * @param {any} pShopUserID 商家UserID
 * @param {any} pInvoiceGuid 发票的InvoiceGuid
 */
function openInvoiceWin(pShopUserID, pInvoiceGuid) {

    mInvoiceGuid = pInvoiceGuid;
    mShopUserID = pShopUserID;

    if (mInvoiceWinHtml == "") {

        mInvoiceWinHtml = getInvoiceWinHtml();
    }
    //初始化SliderDown窗口
    initSilderDownWin(600, mInvoiceWinHtml);

    toggleSilderDownWin();

    //初始化发票信息
    preLoadInvoiceMsgMul(pInvoiceGuid);
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
 * 初始化发票信息
 * @param {any} pInvoiceGuid 发票的InvoiceGuid
 * */
function preLoadInvoiceMsgMul(pInvoiceGuid) {

    //构造POST参数
    var dataPOST = {
        "Type": "3", "InvoiceGuid": pInvoiceGuid,
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


/**
 * 提交订单发票
 * */
function submitOrderInvoice() {

    var hidInvoiceGuid = mInvoiceGuid;
    var ShopUserID = mShopUserID;

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
                    showSaveInvoiceContent(ShopUserID);

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
function showSaveInvoiceContent(ShopUserID) {

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
    $("#InvoiceValDiv_" + ShopUserID).html(_xhtml);
}


//====================提交订单相关逻辑=====================//

//记录提交订单Http请求是否正在进行
var mIsHttpOrderMsg = false;

/**
 * 提交订单信息
 * */
function submitOrderMsgMul() {

    if (mInitOrderGoodsMsgJsonObj == null || mInitOrderGoodsMsgJsonObj == undefined) {        toastWin("下单信息错误，请刷新重试！");
        return;
    }    //判断是否要选择收货地址    var _isSel = isSelReceiAddr();    if (_isSel) {        var _receiNameDiv = $("#ReceiNameDiv").html();
        if (_receiNameDiv.indexOf("添加收货地址") >= 0) {
            toastWin("请选择或添加收货地址！");
            return;
        }
    }    //构造下单的Json字符串    var _jsonOrder = buidOrderJson();    //console.log("_jsonOrder=" + _jsonOrder);
    //构造POST参数
    var dataPOST = {
        "Type": "5", "JsonOrder": escape(_jsonOrder),
    };

    console.log(dataPOST);

    //加载提示
    loadingWin();
    $(".loading-win-content").css("width", "130");

    if (mIsHttpOrderMsg == true) {
        return;
    }

    mIsHttpOrderMsg = true;

    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: mAjaxUrl + "?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("下单返回：" + reTxt);
            //移除加载提示
            closeLoadingWin();
            mIsHttpOrderMsg = false;

            if (reTxt != "") {
                var reTxtJson = JSON.parse(reTxt);
                if (reTxtJson.ErrMsg != "" && reTxtJson.ErrMsg != null) {
                    //弹出错误提示
                    toastWinCb(reTxtJson.ErrMsg, function () {
                        if (reTxtJson.ErrCode == "PJO_06" || reTxtJson.ErrCode == "SOMM_02") {
                            window.location.href = "../SCart/Index";
                        }
                    });

                    return;
                }

                //提交订单返回的信息  -- 支付要用的
                mPayJsonReTxt = reTxtJson;

                //是否显示货到付款支付项
                mIsPayDelivery = reTxtJson.DataDic.IsPayDelivery;
                //是否显示【到店付】支付项
                mIsPayOffline = reTxtJson.DataDic.IsPayOffline;

                //是否显示【积分支付】支付项
                mIsBuyerIntegralPay = reTxtJson.DataDic.IsBuyerIntegralPay;

                //是否显示【银行转账】支付项
                mIsPayTransfer = reTxtJson.DataDic.IsPayTransfer;

                if (reTxtJson.Msg != "" && reTxtJson.Msg != null) {
                    //弹出支付窗口
                    openPayConfirmWin(reTxtJson);
                }

            }
        }
    });
}

/**
 * 构造下单的Json字符串
 * */
function buidOrderJson() {

    if (mInitOrderGoodsMsgJsonObj == null || mInitOrderGoodsMsgJsonObj == undefined) {        return;
    }

    var ShopMsgArr = mInitOrderGoodsMsgJsonObj.ShopMsgArr //商家信息列表
    var GoodsMsgArr = mInitOrderGoodsMsgJsonObj.GoodsMsgArr //商品信息列表
    var OrderMsgArr = mInitOrderGoodsMsgJsonObj.OrderMsgArr //订单信息列表

    var myJsVal = "{";

    //构造商品信息列表
    myJsVal += "    \"GoodsMsgArr\": [";    for (var i = 0; i < GoodsMsgArr.length; i++) {        myJsVal += "        {";        myJsVal += "            \"ShopGoodsArr\": [";        //构造商品信息数组        for (var j = 0; j < GoodsMsgArr[i].ShopGoodsArr.length; j++) {            //具体商品信息            var ShopGoods = GoodsMsgArr[i].ShopGoodsArr[j]            //获取订购数量            var _orderNum = $("#OrderNum_" + ShopGoods.CartID).val();            if (isNaN(_orderNum) || _orderNum == "") {                _orderNum = 1;
            }            myJsVal += "                {";            myJsVal += "                    \"CartID\": \"" + ShopGoods.CartID + "\",";            myJsVal += "                    \"GoodsID\": \"" + ShopGoods.GoodsID + "\",";            myJsVal += "                    \"SpecID\": \"" + ShopGoods.SpecID + "\",";            myJsVal += "                    \"PropID\": \"" + ShopGoods.PropID + "\",";            myJsVal += "                    \"OrderNum\": \"" + _orderNum + "\"";            myJsVal += "                },";
        }        //去掉前后的“,”        myJsVal = removeFrontAndBackChar(myJsVal, ",");        myJsVal += "            ]";        myJsVal += "        },";
    }    //去掉前后的“,”    myJsVal = removeFrontAndBackChar(myJsVal, ",");    myJsVal += "    ],";    //构造订购信息列表    myJsVal += "    \"OrderMsgArr\": [";    for (var n = 0; n < OrderMsgArr.length; n++) {        //配送方式        var _isShopExpense = $("#hidExpressTypeVal_" + ShopMsgArr[n].ShopID).val().trim();        var _couponsIssueID = "0";        var _couponsUseGoodsID = "0";        //console.log($("#hidCouponsDefault_" + ShopMsgArr[n].ShopID).val());        if ($("#hidCouponsDefault_" + ShopMsgArr[n].ShopID).val() != undefined) {            //获取使用优惠券发放ID            var _couponsIssueID = $("#hidCouponsDefault_" + ShopMsgArr[n].ShopID).val().trim().split("_")[0];            //获取使用优惠券的商品ID            var _couponsUseGoodsID = $("#hidCouponsDefault_" + ShopMsgArr[n].ShopID).val().trim().split("_")[2];
        }        //买家留言，订单备注        var _orderMemo = $("#OrderMemo_" + ShopMsgArr[n].ShopID).val().trim();        myJsVal += "        {";        myJsVal += "            \"IsShopExpense\": \"" + _isShopExpense + "\",";        myJsVal += "            \"InvoiceGuid\": \"" + OrderMsgArr[n].InvoiceGuid + "\",";        myJsVal += "            \"CouponsIssueID\": \"" + _couponsIssueID + "\",";        myJsVal += "            \"CouponsUseGoodsID\": \"" + _couponsUseGoodsID + "\",";        myJsVal += "            \"OrderMemo\": \"" + _orderMemo + "\"";        myJsVal += "        },";
    }    //去掉前后的“,”    myJsVal = removeFrontAndBackChar(myJsVal, ",");    myJsVal += "    ]";    myJsVal += "}";

    return myJsVal;
}

/**
 * 判断是否要选择收货地址
 * */
function isSelReceiAddr() {
    var _expressTypeNameArr = $("[name='ExpressTypeName']");
    for (var i = 0; i < _expressTypeNameArr.length; i++) {
        //console.log(_expressTypeNameArr.eq(i));
        var _jqObjVal = _expressTypeNameArr.eq(i).val().trim();
        if (_jqObjVal == "express") {
            return true; //需要选择收货地址
        }
    }

    return false;
}


/**
 * -------打开支付确认窗口------
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
    var _orderPrice = formatNumberDotDigit(pJsonReTxt.DataDic.TotalOrderPrice);
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

        //跳转URL
        var goPayURL = mPayJsonReTxt.DataDic.OctThirdApiCallSystemWeb_ApiDomain + "/WxPay/WxApiPayRedirectRe?BillNumber=" + mPayJsonReTxt.DataDic.BillNumber + "&UserKeyID=" + mPayJsonReTxt.DataDic.UserKeyID;
        //----测试----//
        //var goPayURL = mPayJsonReTxt.DataDic.OctThirdApiCallSystemWeb_ApiDomain + "/Test/WxApiPayRedirect?BillNumber=" + mPayJsonReTxt.DataDic.BillNumber + "&UserKeyID=" + mPayJsonReTxt.DataDic.UserKeyID;

        //跳转到模拟支付页
        if (mPayJsonReTxt.DataDic.WxPay_IsSimulatePay == "是") {
            goPayURL = mPayJsonReTxt.DataDic.OctThirdApiCallSystemWeb_ApiDomain + "/PayPub/SimulatePay?PayWay=WeiXinPay&BillNumber=" + mPayJsonReTxt.DataDic.BillNumber + "&UserKeyID=" + mPayJsonReTxt.DataDic.UserKeyID;
        }

        //跳转到微信公众号支付页
        window.location.href = goPayURL;
    }
    else if (mSelPayType == "Alipay") {

        //加载提示
        $("#BtnPay").attr("disabled", true);
        $("#BtnPay").val("…拉起支付中…");

        //跳转URL
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
        url: "../OrderAjax/PlaceOrder?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log(reTxt);
            if (reTxt != "") {
                var _jsonReTxt = JSON.parse(reTxt);

                if (_jsonReTxt.ErrMsg != "" && _jsonReTxt.ErrMsg != null) {
                    alert(_jsonReTxt.ErrMsg);
                    return;
                }

                if (_jsonReTxt.Msg != "" && _jsonReTxt.Msg != null) {

                    window.location.href = "../Pay/PaySuRedirect?BillNumber=" + _jsonReTxt.BillNumber;
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
        alert("积分不足，请选择其他支付方式！");
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
        url: "../OrderAjax/PlaceOrder?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log(reTxt);
            if (reTxt != "") {
                var _jsonReTxt = JSON.parse(reTxt);

                if (_jsonReTxt.ErrMsg != "" && _jsonReTxt.ErrMsg != null) {
                    alert(_jsonReTxt.ErrMsg);
                    return;
                }

                if (_jsonReTxt.Msg != "" && _jsonReTxt.Msg != null) {

                    window.location.href = "../Pay/PaySuRedirect?BillNumber=" + _jsonReTxt.BillNumber;
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
            console.log("得到用户当前的可用积分=" + reTxt);
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
        url: "../OrderAjax/PlaceOrder?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log(reTxt);
            if (reTxt != "") {
                var _jsonReTxt = JSON.parse(reTxt);

                if (_jsonReTxt.ErrMsg != "" && _jsonReTxt.ErrMsg != null) {
                    alert(_jsonReTxt.ErrMsg);
                    return;
                }

                if (_jsonReTxt.Msg != "" && _jsonReTxt.Msg != null) {

                    if (mPayJsonReTxt.DataListDic.length > 1) {
                        //跳转到我的订单
                        window.location.href = "../Buyer/MyOrder";
                    }
                    else {
                        //订单详情页
                        window.location.href = "../Order/OrderDetail?OID=" + mPayJsonReTxt.DataListDic[0].OrderID;
                    }
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
        url: "../OrderAjax/PlaceOrder?rnd=" + Math.random(),
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

                    if (mPayJsonReTxt.DataListDic.length > 1) {
                        //跳转到我的订单
                        window.location.href = "../Buyer/MyOrder";
                    }
                    else {
                        //订单详情页
                        window.location.href = "../Order/OrderDetail?OID=" + mPayJsonReTxt.DataListDic[0].OrderID;
                    }
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
        url: "../OrderAjax/PlaceOrder?rnd=" + Math.random(),
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
        window.location.href = "../Buyer/MyOrder";
    }
    else {
        mTimerPayWinClose = setTimeout(function () {

            isPayWinClose();

        }, 1000);
    }
    return;
}


//=======================打开地图导航=========================//

/**
 * ----打开地图导航Slider窗口-----
 */
var mShopNavWinHtml = "";
function openShopNavWin(pLatitude, pLongitude, pAddrName, pAddrDetail) {

    //初始化所有的 地图导航URL连接
    allMapURL(pLatitude, pLongitude, pAddrName, pAddrDetail)

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



