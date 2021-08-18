//================支付成功-非订单模式=========================//

/**-----定义公共变量------**/
var mAjaxUrl = "../PayAjax/";

//交易号
var mBillNumber = "";

/**------初始化------**/
$(function () {

    mBillNumber = $("#hidBillNumber").val().trim();

    //根据不同的支付类型，显示支付成功的信息
    showMsgByPayType();

    //数据分页查询--猜你喜欢
    pageDataSearch();
});

//=====================自定义函数=====================//

/**
 * 根据不同的支付类型，显示支付成功的信息
 * */
function showMsgByPayType() {

    //买家充值
    if (mBillNumber.indexOf("77") == 0) {

        $("#PaySeeBtnA").attr("href", "../Vip/BalanceIntegral");
        $("#PayMsgTitle").html("账户余额,充值成功！");
        $("#PayMsgTitleB").html("账户余额充值-支付成功");
        $("#PayPriceDiv").hide();
    }
    //扫码聚合支付
    else if (mBillNumber.indexOf("66") == 0) {
        $("#PaySeeBtnA").attr("href", "../Vip/AggreOrder");
        $("#PayMsgTitle").html("扫码支付成功！");
        $("#PayMsgTitleB").html("扫码支付成功！");
        $("#PayPriceDiv").hide();
    }

}




//===============数据分页==========================//
var mIntPageCurrent = 1; //当前的分页索引
var mPageSum = 1; //总页数

/**
 * 下一页
 * */
function nextPage() {

    $("#BtnMoreGoods").hide();

    if (mIntPageCurrent < mPageSum) {

        mIntPageCurrent += 1;

        //重新加载数据
        pageDataSearch();
    }

}

/**
 * 数据分页查询
 * */
function pageDataSearch() {

    //构造GET参数
    var dataPOST = {
        "Type": "5",
        "PageCurrent": mIntPageCurrent,
        "IsEntity": ""
    };
    //正式发送GET请求
    $.ajax({
        type: "POST",
        url: "../MallAjax/Index?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("猜你喜欢数据分页=" + reTxt);
            if (reTxt != "") {
                //转换为Json对象
                var _jsonReTxt = JSON.parse(reTxt);

                var myJsVal = "";
                for (var i = 0; i < _jsonReTxt.DataPage.length; i++) {

                    var dataPage = _jsonReTxt.DataPage[i];
                    var dataPageExtra = _jsonReTxt.DataPageExtra[i];

                    if (dataPage.GoodsTitle.length > 25) {
                        dataPage.GoodsTitle = dataPage.GoodsTitle.substring(0, 24) + "...";
                    }

                    //---计算价格----//
                    var _maxDiscount = 10;
                    if (dataPage.GroupDiscount < _maxDiscount && dataPage.GroupDiscount > 0) {
                        _maxDiscount = dataPage.GroupDiscount;
                    }
                    if (dataPage.Discount < _maxDiscount && dataPage.Discount > 0 && dataPage.GroupDiscount <= 0) {
                        _maxDiscount = dataPage.Discount;
                    }
                    if (dataPage.SkDiscount < _maxDiscount && dataPage.SkDiscount > 0 && dataPage.GroupDiscount <= 0) {
                        _maxDiscount = dataPage.SkDiscount;
                    }
                    var _goodsPrice = parseFloat(dataPage.GoodsPrice) * (_maxDiscount / 10);

                    //构造徽章
                    var _bageSpan = "";
                    if (dataPage.Discount > 0) {
                        _bageSpan = dataPage.Discount + "折";
                    }
                    if (dataPage.SkDiscount > 0) {
                        _bageSpan = "秒杀";
                    }
                    if (dataPage.GroupDiscount > 0) {
                        _bageSpan = "团购";
                    }
                    //_bageSpan = "团购";

                    myJsVal += " <li class=\"goods-item\">";
                    myJsVal += " <a href=\"../Goods/GoodsDetail?GID=" + dataPage.GoodsID + "\">";
                    myJsVal += "     <img src=\"//" + dataPage.ImgPathCover + "\" />";
                    myJsVal += " </a>";
                    myJsVal += " <div class=\"goods-item-title\">";
                    myJsVal += dataPage.GoodsTitle;
                    myJsVal += " </div>";
                    myJsVal += " <div class=\"goods-item-price\">";
                    myJsVal += "     <div class=\"goods-price-left\">";
                    myJsVal += "         <b>&#165; " + formatNumberDotDigit(_goodsPrice, 2) + "</b>";
                    myJsVal += "     </div>";
                    myJsVal += "     <div class=\"goods-price-right\">";
                    myJsVal += "" + dataPage.PaidCount + "人付款";
                    myJsVal += "     </div>";
                    myJsVal += " </div>";
                    myJsVal += " <span class=\"goods-item-badge\">" + _bageSpan + "</span>";
                    myJsVal += "</li>";

                }

                //--------分页按钮与显示内容-----//
                if (mIntPageCurrent == 1) {
                    document.getElementById("PageContentList").innerHTML = myJsVal;
                }
                else {
                    document.getElementById("PageContentList").innerHTML += myJsVal;
                }
                if (mIntPageCurrent < parseInt(_jsonReTxt.PageSum)) {
                    //加载更多按钮
                    $("#BtnMoreGoods").show();
                }
                else {
                    //加载更多按钮
                    $("#BtnMoreGoods").hide();
                }
                //当前页
                mIntPageCurrent = parseInt(_jsonReTxt.PageCurrent);
                //总页数
                mPageSum = parseInt(_jsonReTxt.PageSum);


            }
            else {
                if (mIntPageCurrent == 1) {
                    document.getElementById("PageContentList").innerHTML = "";
                }
            }
        },
        error: function (xhr, errorTxt, status) {
            console.log("异步请求错误，errorTxt=" + errorTxt + " | status=" + status);
            return;
        }
    });


}

//===============数据分页==========================//




