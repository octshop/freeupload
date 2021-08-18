//================购物车======================//

/**-----定义公共变量------**/
//AjaxURL
var mAjaxUrl = "../SCartAjax/Index";

//登录器的买家UserID
var mBuyerUserID = "";

/**------初始化------**/
$(function () {

    mBuyerUserID = $("#hidBuyerUserID").val().trim();

    //初始化购物车信息
    initSCartMsg();

});

/**
 * 初始化购物车信息
 * pCallBack 回调函数
 * */
function initSCartMsg() {

    //构造POST参数
    var dataPOST = {
        "Type": "1",
    };
    console.log(dataPOST);

    $("#SCartListDiv").html("<div style=\"text-align:center;padding-top: 180px\"> … 加载中 … </div>");

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
                //构造购物车Xhtml代码 
                var _xhtml = xhtmlSCart(_jsonReTxt);
                $("#SCartListDiv").html(_xhtml);

                //统计总额
                $("#SumPriceB").html("&#165; " + sumPriceSelScartGoodsPrice());
            }
            else {
                var myJsVal = "";                myJsVal += "<div class=\"scart-empty-div\">";                myJsVal += "  <img src=\"../Assets/Imgs/Icon/buyer_scart.png\" />";                myJsVal += " <div>";                myJsVal += "  购物车没有商品,赶紧订购吧！";                myJsVal += "</div>";                myJsVal += "<a href=\"../Mall/Index\">查找优惠打折商品</a>";                myJsVal += "</div>";                $("#SCartListDiv").html(myJsVal);            }
        }
    });
}

/**
 * 构造购物车Xhtml代码 
 * @param {any} pJsonSCartMsg 购物车信息Json对象
 */
function xhtmlSCart(pJsonSCartMsg) {

    var ShopMsgArr = pJsonSCartMsg.ShopMsgArr;
    var GoodsMsgArr = pJsonSCartMsg.GoodsMsgArr;

    if (ShopMsgArr.length <= 0) {
        var myJsVal = "<div class=\"scart-empty-div\">";        myJsVal += "  <img src=\"../Assets/Imgs/Icon/buyer_scart.png\" />";        myJsVal += " <div>";        myJsVal += "  购物车没有商品,赶紧订购吧！";        myJsVal += "</div>";        myJsVal += "<a href=\"../Mall/Index\">查找优惠打折商品</a>";        myJsVal += "</div>";        return myJsVal;
    }

    //循环构造Xhtml代码
    var _xhtml = "";
    for (var i = 0; i < ShopMsgArr.length; i++) {
        //店铺列表        _xhtml += "<div class=\"scart-item\">";        _xhtml += " <div class=\"scart-item-title\">";        _xhtml += "     <div class=\"scart-item-left\">";        _xhtml += "         <img class=\"scart-sel-img\" name=\"CheckImgShop\" onclick=\"toggleCheckShop(" + ShopMsgArr[i].ShopUserID + ")\" id=\"CheckImgShop_" + ShopMsgArr[i].ShopUserID + "\" src=\"../Assets/Imgs/Icon/sel_yes.png\" />";        _xhtml += "     </div>";        _xhtml += "     <div class=\"scart-item-mid\">";        _xhtml += "         <a href=\"../Shop/Index?SID=" + ShopMsgArr[i].ShopID +"\">";        _xhtml += "             " + ShopMsgArr[i].ShopName + "";        _xhtml += "         </a>";        _xhtml += "     </div>";        _xhtml += "     <div class=\"scart-item-right\" onclick=\"openGetTicketWin(" + ShopMsgArr[i].ShopUserID + ")\">";        _xhtml += "         领券";        _xhtml += "     </div>";        _xhtml += " </div>";        //商品列表        for (var j = 0; j < GoodsMsgArr[i].ShopGoodsMsgArr.length; j++) {            var ShopGoodsMsgArr = GoodsMsgArr[i].ShopGoodsMsgArr[j];            //计算折扣后的商品价格            var _goodsPrice = parseFloat(ShopGoodsMsgArr.GoodsPrice);            if (ShopGoodsMsgArr.Discount != null && ShopGoodsMsgArr.Discount != undefined) {                if (parseFloat(ShopGoodsMsgArr.Discount) > 0 && parseFloat(ShopGoodsMsgArr.Discount) <= 10) {                    _goodsPrice = _goodsPrice * (parseFloat(ShopGoodsMsgArr.Discount) / 10);
                }
            }            _goodsPrice = formatNumberDotDigit(_goodsPrice);            //到店徽章
            var _spanBadge = "";
            if (ShopGoodsMsgArr.IsShopExpense == "true") {
                _spanBadge = " <span style=\"color:white;background:red;padding:1px 3px;border-radius:5px\">到店</span>";
            }

            if (ShopGoodsMsgArr.GoodsTitle.length > 28) {
                ShopGoodsMsgArr.GoodsTitle = ShopGoodsMsgArr.GoodsTitle.substring(0, 26) + "…";
            }
            _xhtml += "<div class=\"scart-item-goods\" id=\"SCartItemGoods_" + ShopGoodsMsgArr.CartID + "\">";            _xhtml += " <div class=\"item-goods-left\">";            _xhtml += "     <img class=\"scart-sel-img\" name=\"CheckImgShopGoodsItem_" + ShopMsgArr[i].ShopUserID + "\" data-checkimg=\"CheckImg\" data-scartid=\"" + ShopGoodsMsgArr.CartID + "\" id=\"CheckImg_" + ShopGoodsMsgArr.CartID + "\" src=\"../Assets/Imgs/Icon/sel_yes.png\" onclick=\"toggleCheckGoods(" + ShopGoodsMsgArr.CartID + ")\" />";            _xhtml += " </div>";            _xhtml += " <div class=\"item-goods-mid\">";            _xhtml += "     <a href=\"../Goods/GoodsDetail?GID=" + ShopGoodsMsgArr.GoodsID + "\" target=\"_blank\">";            _xhtml += "         <img src=\"//" + ShopGoodsMsgArr.GoodsImgPath + "\" />";            _xhtml += "     </a>";            _xhtml += " </div>";            _xhtml += " <div class=\"item-goods-right\">";            _xhtml += "     <ul>";            _xhtml += "         <li>";            _xhtml += "             " + ShopGoodsMsgArr.GoodsTitle + _spanBadge + "";            _xhtml += "         </li>";            _xhtml += "         <li class=\"goods-right-spec\">";            _xhtml += "             " + ShopGoodsMsgArr.SpecPropNameArr + "";            _xhtml += "         </li>";            _xhtml += "         <li class=\"goods-right-price\">";            _xhtml += "             <div class=\"goods-price\">";            _xhtml += "<input id=\"GoodsPrice_" + ShopGoodsMsgArr.CartID + "\" type=\"hidden\" value=\"" + _goodsPrice + "\">";            _xhtml += "                 &#165;" + _goodsPrice + "";            _xhtml += "             </div>";            _xhtml += "             <div class=\"goods-txt-number\">";            _xhtml += "                 <input class=\"btn-reduce\" type=\"button\" onclick=\"addReduOrderNum(" + ShopGoodsMsgArr.CartID + ",'Reduce')\" value=\"-\" />";            _xhtml += "                 <input class=\"input-order-number\"  id=\"OrderNum_" + ShopGoodsMsgArr.CartID + "\" type=\"number\" value=\"" + ShopGoodsMsgArr.OrderNum + "\" onblur=\"showSumPrice(" + ShopGoodsMsgArr.CartID + ")\" onkeyup=\"showSumPrice(" + ShopGoodsMsgArr.CartID + ")\" />";            _xhtml += "                 <input class=\"btn-add\" type=\"button\" value=\"+\" onclick=\"addReduOrderNum(" + ShopGoodsMsgArr.CartID + ",'Add')\" />";            _xhtml += "             </div>";            _xhtml += "         </li>";            _xhtml += "     </ul>";            _xhtml += " </div>";            _xhtml += "</div>";        }        _xhtml += "</div>";

    }

    return _xhtml;
}

/**
 * 切换单个商品选择按钮
 * @param {any} pCartID 购物车信息ID
 */
function toggleCheckGoods(pCartID) {

    var _$checkImg = $("#CheckImg_" + pCartID);
    var _imgSrc = _$checkImg.attr("src");
    console.log("_imgSrc=" + _imgSrc);
    if (_imgSrc.indexOf("sel_yes.png") >= 0) {
        _$checkImg.attr("src", "../Assets/Imgs/Icon/sel_no.png");
    }
    else {
        _$checkImg.attr("src", "../Assets/Imgs/Icon/sel_yes.png");
    }

    //统计总额
    $("#SumPriceB").html("&#165; " + sumPriceSelScartGoodsPrice());
}

/**
 * 切换店铺选择按钮 
 * @param {any} pShopUserID 商家UserID
 */
function toggleCheckShop(pShopUserID) {

    //店铺选择按钮
    var _$checkImgShop = $("#CheckImgShop_" + pShopUserID);
    var _imgSrc = _$checkImgShop.attr("src");
    if (_imgSrc.indexOf("sel_yes.png") >= 0) {
        _$checkImgShop.attr("src", "../Assets/Imgs/Icon/sel_no.png");
    }
    else {
        _$checkImgShop.attr("src", "../Assets/Imgs/Icon/sel_yes.png");
    }

    console.log("pShopUserID=" + pShopUserID);
    //获取店铺商品选择按钮数组  Js对象转Jquery对象
    var _$checkImgShopGoodsItemArr = $(document.getElementsByName("CheckImgShopGoodsItem_" + pShopUserID + ""));
    console.log(_$checkImgShopGoodsItemArr);
    //循环选中与不选中切换
    for (var i = 0; i < _$checkImgShopGoodsItemArr.length; i++) {

        //var _imgSrcItem = _$checkImgShopGoodsItemArr.eq(i).attr("src");
        //console.log("_imgSrcItem=" + _imgSrcItem)
        if (_imgSrc.indexOf("sel_no.png") >= 0) {
            _$checkImgShopGoodsItemArr.eq(i).attr("src", "../Assets/Imgs/Icon/sel_yes.png");
        }
        else {
            _$checkImgShopGoodsItemArr.eq(i).attr("src", "../Assets/Imgs/Icon/sel_no.png");
        }
    }

    //统计总额
    $("#SumPriceB").html("&#165; " + sumPriceSelScartGoodsPrice());
}

/**
 * 全选与全不先
 * */
function toggleCheckAll() {

    var _$CheckAllImg = $("#CheckAllImg");
    //切换全选按钮
    var _imgSrc = _$CheckAllImg.attr("src");
    if (_imgSrc.indexOf("sel_yes.png") >= 0) {
        _$CheckAllImg.attr("src", "../Assets/Imgs/Icon/sel_no.png");
    }
    else {
        _$CheckAllImg.attr("src", "../Assets/Imgs/Icon/sel_yes.png");
    }

    //----切换店铺选择按钮 ----//
    var _$CheckImgShopArr = $(document.getElementsByName("CheckImgShop"));
    for (var i = 0; i < _$CheckImgShopArr.length; i++) {

        if (_imgSrc.indexOf("sel_yes.png") >= 0) {
            //未选中状态
            _$CheckImgShopArr.eq(i).attr("src", "../Assets/Imgs/Icon/sel_no.png");
        }
        else {
            //选中状态
            _$CheckImgShopArr.eq(i).attr("src", "../Assets/Imgs/Icon/sel_yes.png");
        }

        //----切换商品选择按钮-----//
        var _goodsCheckImgID = _$CheckImgShopArr.eq(i).attr("id").replace("CheckImgShop_", "");
        //console.log("_goodsCheckImgID=" + _goodsCheckImgID);
        //获取商品选择按钮Item
        var $CheckImgShopGoodsItemArr = $(document.getElementsByName("CheckImgShopGoodsItem_" + _goodsCheckImgID));
        for (var j = 0; j < $CheckImgShopGoodsItemArr.length; j++)
            if (_imgSrc.indexOf("sel_yes.png") >= 0) {
                //未选中状态
                $CheckImgShopGoodsItemArr.eq(j).attr("src", "../Assets/Imgs/Icon/sel_no.png");
            }
            else {
                //选中状态
                $CheckImgShopGoodsItemArr.eq(j).attr("src", "../Assets/Imgs/Icon/sel_yes.png");
            }
    }

    //统计总额
    $("#SumPriceB").html("&#165; " + sumPriceSelScartGoodsPrice());
}

/**
 * 增减订购数量 文本框
 * @param {any} pCartID 购物车ID
 * @param {any} pExeType 操作类型 [ Add / Reduce ]
 */
function addReduOrderNum(pCartID, pExeType) {

    var _$OrderNum = $("#OrderNum_" + pCartID);
    var _orderNumVal = _$OrderNum.val().trim();

    if (_orderNumVal == "" || _orderNumVal == null) {
        _orderNumVal = 0;
        _$OrderNum.val(0);
    }

    if (isNaN(_orderNumVal)) {
        toastWin("【订购数量】必须是数字！");
        return;
    }
    _orderNumVal = parseInt(_orderNumVal);

    if (pExeType == "Add") {
        _orderNumVal = _orderNumVal + 1;
    }
    else {
        if (_orderNumVal <= 1) {
            _orderNumVal = 1;
        }
        else {
            _orderNumVal -= 1;
        }
    }
    //订购数量文本赋值
    _$OrderNum.val(_orderNumVal);

    //统计总额
    $("#SumPriceB").html("&#165; " + sumPriceSelScartGoodsPrice());

    //----------保存商品订购数量的增减-----------//
    saveScartNumAddReduce(pCartID, _$OrderNum.val());

}

/**
 * 保存商品订购数量的增减
 * @param {any} pCartID 购物车ID
 * @param {any} pOrderNum 当前订购数量
 */
function saveScartNumAddReduce(pCartID, pOrderNum) {

    //构造POST参数
    var dataPOST = {
        "Type": "5", "CartID": pCartID, "OrderNum": pOrderNum,
    };
    console.log("保存商品订购数量的增减POST参数");
    console.log(dataPOST);
    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: mAjaxUrl + "?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("保存商品订购数量=" + reTxt);
            if (reTxt != "") {
                var _jsonReTxt = JSON.parse(reTxt);
                if (_jsonReTxt.ErrCode == "SSNAR_04") {
                    //提示
                    toastWin(_jsonReTxt.ErrMsg);

                    $("#OrderNum_" + pCartID).val("1");
                    //不进行界面操作的 保存商品订购数量的增减
                    saveScartNumAddReduceNoHtml(pCartID, "1");

                }
            }
        }
    });
}

/**
 * 不进行界面操作的 保存商品订购数量的增减
 * @param {any} pCartID
 * @param {any} pOrderNum
 */
function saveScartNumAddReduceNoHtml(pCartID, pOrderNum) {
    //构造POST参数
    var dataPOST = {
        "Type": "5", "CartID": pCartID, "OrderNum": pOrderNum,
    };
    console.log(dataPOST);
    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: mAjaxUrl + "?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            //console.log("保存商品订购数量=" + reTxt);
        }
    });
}


/**
 * 删除购物车中商品信息
 * */
function delScartGoodsArr() {

    //得到选择的购物中商品ID拼接字符串
    var _selScartGoodsIDArr = getSelScartGoodsIDArr();
    if (_selScartGoodsIDArr == "") {
        toastWin("请选择要删除的商品！");
        return;
    }

    confirmWin("确定要删除吗？", function () {

        //构造POST参数
        var dataPOST = {
            "Type": "3", "SCartIDArr": _selScartGoodsIDArr,
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
                    //错误信息
                    if (_jsonReTxt.ErrMsg != null && _jsonReTxt.ErrMsg != "") {
                        toastWin(_jsonReTxt.ErrMsg);
                        return;
                    }
                    //操作成功信息
                    if (_jsonReTxt.Msg != null && _jsonReTxt.Msg != "") {

                        //移除删除的商品Item
                        if (_selScartGoodsIDArr.indexOf("^") >= 0) {
                            var _delScartGoodsIDArr = _selScartGoodsIDArr.split("^");
                            for (var i = 0; i < _delScartGoodsIDArr.length; i++) {
                                $("#SCartItemGoods_" + _delScartGoodsIDArr[i]).remove();
                            }
                        }
                        else {
                            $("#SCartItemGoods_" + _selScartGoodsIDArr).remove();
                        }


                        //统计总额
                        $("#SumPriceB").html("&#165; " + sumPriceSelScartGoodsPrice());

                        toastWin(_jsonReTxt.Msg);
                        return;
                    }
                }
            }
        });

    });
}

/**
 * 得到选择的购物中商品ID拼接字符串
 * */
function getSelScartGoodsIDArr() {

    //获取选中的商品ID
    var _$datacheckimgArr = $("img[data-checkimg='CheckImg']");
    //console.log(_$datacheckimgArr.eq(i));

    //构造要删除的 ScartID 字符串数组 [23423 ^ 234423 ^ 23423]
    var _scartIDArr = "";
    for (var i = 0; i < _$datacheckimgArr.length; i++) {
        var _checkImgSrc = _$datacheckimgArr.eq(i).attr("src");
        //console.log(_checkImgSrc);
        if (_checkImgSrc.indexOf("sel_yes") >= 0) {
            //选中
            _scartIDArr += _$datacheckimgArr.eq(i).attr("data-scartid") + "^";
        }
    }
    _scartIDArr = removeFrontAndBackChar(_scartIDArr, "^");
    console.log("_scartIDArr=" + _scartIDArr);

    return _scartIDArr;
}

/**
 * 统计选择商品总额 返回总额
 * */
function sumPriceSelScartGoodsPrice() {

    var _sumPrice = 0; //总额

    //获取选中的商品ID
    var _$datacheckimgArr = $("img[data-checkimg='CheckImg']");
    for (var i = 0; i < _$datacheckimgArr.length; i++) {
        var _checkImgSrc = _$datacheckimgArr.eq(i).attr("src");
        //console.log(_checkImgSrc);
        if (_checkImgSrc.indexOf("sel_yes") >= 0) {
            //选中
            var _scartID = _$datacheckimgArr.eq(i).attr("data-scartid");
            //得到商品单价
            var _goodsPrice = $("#GoodsPrice_" + _scartID).val().trim();
            //得到订购数量
            var _orderNum = $("#OrderNum_" + _scartID).val().trim();
            if (_orderNum == undefined || _orderNum == "") {
                _orderNum = 1;
            }

            //小计
            _sumPrice += parseFloat(parseFloat(_goodsPrice) * parseInt(_orderNum));
        }
    }
    console.log("_sumPrice=" + _sumPrice);
    return formatNumberDotDigit(_sumPrice); //格式化金额
}

/**
 * 显示重新统计总额
 * */
function showSumPrice(pCartID) {

    var _orderNum = $("#OrderNum_" + pCartID).val().trim();

    //统计总额
    $("#SumPriceB").html("&#165; " + sumPriceSelScartGoodsPrice());

    //----------保存商品订购数量的增减-----------//
    if (_orderNum != "" && _orderNum != "0") {
        saveScartNumAddReduce(pCartID, _orderNum);
    }

}

/**
 * 得到购物车信息ID 与之对应的  订购数量 拼接字符串  [ SCartID _ OrderNum ^ SCartID _ OrderNum | SCartID _ OrderNum ^ SCartID _ OrderNum]
 * */
function getScartIDOrderNumArr() {

    //构造拼接字符串
    var _scartIDOrderNumArr = "";

    //获取选中的商品ID
    var _$datacheckimgArr = $("img[data-checkimg='CheckImg']");
    for (var i = 0; i < _$datacheckimgArr.length; i++) {
        var _checkImgSrc = _$datacheckimgArr.eq(i).attr("src");
        //console.log(_checkImgSrc);
        if (_checkImgSrc.indexOf("sel_yes") >= 0) {
            //选中
            //得到购物车信息ID
            var _scartID = _$datacheckimgArr.eq(i).attr("data-scartid");
            //得到订购数量
            var _orderNum = $("#OrderNum_" + _scartID).val().trim();
            if (_orderNum == undefined || _orderNum == "") {
                _orderNum = 1;
            }

            //构造拼接字符串
            _scartIDOrderNumArr += _scartID + "_" + _orderNum + "^";
        }
    }
    //除去前后的"^"
    _scartIDOrderNumArr = removeFrontAndBackChar(_scartIDOrderNumArr, "^");
    console.log("_scartIDOrderNumArr=" + _scartIDOrderNumArr);
    return _scartIDOrderNumArr;
}

/**
 * 去结算
 * */
function goSettle() {

    //得到购物车信息ID 与之对应的  订购数量 拼接字符串 [ SCartID _ OrderNum ^ SCartID _ OrderNum]
    var _scartIDOrderNumArr = getScartIDOrderNumArr();
    if (_scartIDOrderNumArr == "") {
        toastWin("请选择结算的商品！");
        return;
    }

    //构造POST参数
    var dataPOST = {
        "Type": "4", "ScartIDOrderNumArr": _scartIDOrderNumArr,
    };
    console.log(dataPOST);

    //加载提示
    $("#BtnSettle").val("计算中");
    $("#BtnSettle").attr("disabled", true);

    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: mAjaxUrl + "?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log(reTxt);
            if (reTxt != "") {

                if (reTxt == "41") {
                    //跳转到确认订单页,多商品多商家
                    window.location.href = "../Order/PlaceOrderMul";
                }
            }
        }
    });

}

//=======================优惠券相关逻辑==========================//

/**
 * ----------打开领取优惠券的窗口 -------------
 */
var mGetTicketWinHtml = "";
/**
 * 打开领取优惠券窗口
 * @param {any} pShopUserID
 */
function openGetTicketWin(pShopUserID) {

    if (mGetTicketWinHtml == "") {

        mGetTicketWinHtml = getGetTicketWinHtml();
    }
    //初始化SliderDown窗口
    initSilderDownWin(600, mGetTicketWinHtml);

    //得到 店铺可以使用的优惠券列表  买家UserID不判断 
    shopAbleUseCouponsList(pShopUserID);
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
 * 得到 店铺可以使用的优惠券列表  买家UserID不判断 
 * @param pShopUserID  商家UserID
 * */
function shopAbleUseCouponsList(pShopUserID) {
    //构造POST参数
    var dataPOST = {
        "Type": "2", "ShopUserID": pShopUserID,
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
            console.log("可领取优惠券reTxt=" + reTxt);

            //移除加载提示
            closeLoadingWin();

            if (reTxt != "") {
                var _jsonReTxt = JSON.parse(reTxt);

                //构造领取优惠券窗口显示代码
                var _xhtml = xhtmlSelCouponsWin(_jsonReTxt);
                //console.log(_xhtml);
                $(".win-ticket-content").html(_xhtml);
            }
            else {
                //为空时的优惠券列表
                $(".win-ticket-content").html(xhtmlSelCouponsWin(""));
            }

            //打开领取优惠券窗口,放这里可以自动伸缩
            toggleSilderDownWin();
        }
    });
}


/**
 * 构造领取优惠券窗口显示代码
 * @param pShopAbleUseCouponsListJson  优惠券Json字符串列表
 * */
function xhtmlSelCouponsWin(pShopAbleUseCouponsListJson) {


    var myJsVal = "";    //myJsVal += "<div class=\"win-ticket-content\">";    myJsVal += "            <div class=\"win-ticket-title\">";    myJsVal += "                优惠券";    myJsVal += "                <button type=\"button\" class=\"am-close\" onclick=\"toggleSilderDownWin()\">&times;</button>";    myJsVal += "            </div>";    myJsVal += "            <div class=\"win-ticket-integral\">";    myJsVal += "                <div>";    myJsVal += "                    领券";    myJsVal += "                </div>";    myJsVal += "                <div>";    myJsVal += "                    您的积分: --";    myJsVal += "                </div>";    myJsVal += "            </div>";    myJsVal += "            <div class=\"win-ticket-list\">";



    if (pShopAbleUseCouponsListJson == undefined || pShopAbleUseCouponsListJson == null || pShopAbleUseCouponsListJson == "") {
        //return; //没有优惠券可领取
        myJsVal += "<div style=\"text-align:center;font-size: 14px; color:red; padding-top:20px;padding-bottom:120px;\">… 没有优惠券可领取 …</div>";
    }
    else {
        //优惠券信息列表
        var _goodsAbleUseCouponsArr = pShopAbleUseCouponsListJson.ShopAbleUseCouponsList;

        //循环构造列表        for (var i = 0; i < _goodsAbleUseCouponsArr.length; i++) {            var _reduceMoneyShow = "";            var _couponsName = "";            //抵用券            if (_goodsAbleUseCouponsArr[i].UseMoney != 0) {                //减去的金额                _reduceMoneyShow = "&#165;" + _goodsAbleUseCouponsArr[i].UseMoney;
                _couponsName = "店铺券";
            }            else { //折扣券                _reduceMoneyShow = _goodsAbleUseCouponsArr[i].UseDiscount + "折";
                _couponsName = "店铺折扣券";
            }            //消费满多少使用            var _expenseReachSum = "无消费限制";            if (_goodsAbleUseCouponsArr[i].ExpenseReachSum > 0) {                _expenseReachSum = "满" + _goodsAbleUseCouponsArr[i].ExpenseReachSum + "使用";
            }            //计算两日期间隔的天数 有效期限            var _useTimeRangeShow = "";            if (_goodsAbleUseCouponsArr[i].UseTimeRange == "" || _goodsAbleUseCouponsArr[i].UseTimeRange == null || _goodsAbleUseCouponsArr[i].UseTimeRange.indexOf("^") < 0) {                _useTimeRangeShow = " 永久有效 ";
            }            else {                //分割日期                _useTimeRangeArr = _goodsAbleUseCouponsArr[i].UseTimeRange.split("^");                //计算两日期的间隔天数                 var _diffDay = diffDateDay(getTodayDate(), _useTimeRangeArr[1]);

                _useTimeRangeShow = _goodsAbleUseCouponsArr[i].UseTimeRange.replace("^", " 至 ") + " (" + _diffDay + "天)";
            }            myJsVal += "<div class=\"win-ticket-item\" id=\"TicketItem_" + _goodsAbleUseCouponsArr[i].CouponsID + "\">";            myJsVal += "    <div class=\"win-ticket-item-left\">";            myJsVal += "        <ul>";            myJsVal += "            <li><b>" + _reduceMoneyShow + "</b> " + _couponsName + " (需积分:0)</li>";            myJsVal += "            <li>" + _expenseReachSum + "</li>";            myJsVal += "            <li>有效期:" + _useTimeRangeShow + "</li>";            myJsVal += "        </ul>";            myJsVal += "    </div>";            myJsVal += "    <div class=\"win-ticket-item-right\" onclick=\"buyerGetCoupons(" + _goodsAbleUseCouponsArr[i].CouponsID + ")\" id=\"GetCouponsBtn_" + _goodsAbleUseCouponsArr[i].CouponsID + "\">";            myJsVal += "立即领取";            myJsVal += "    </div>";            myJsVal += "</div>";
        }
    }
    //myJsVal += "            </div>";    myJsVal += "</div>";
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
        url: "../GoodsAjax/GoodsDetail?rnd=" + Math.random(),
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

