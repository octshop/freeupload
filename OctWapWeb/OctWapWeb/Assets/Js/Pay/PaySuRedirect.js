//==================支付成功===========================//

/**-----定义公共变量------**/
var mAjaxUrl = "../PayAjax/PaySuRedirect";

//交易号
var mBillNumber = "";

/**------初始化------**/
$(function () {

    mBillNumber = $("#hidBillNumber").val().trim();

    //初始化BillNumber下的所有订单信息
    initBillNumberOrderMsg();

    //数据分页查询--猜你喜欢
    pageDataSearch();

});

/**
 * 初始化BillNumber下的所有订单信息
 * */
function initBillNumberOrderMsg() {

    //构造POST参数
    var dataPOST = {
        "Type": "1", "BillNumber": mBillNumber,
    };
    console.log(dataPOST);
    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: mAjaxUrl + "?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("初始化订单信息=" + reTxt);
            if (reTxt != "") {
                var _jsonReTxt = JSON.parse(reTxt);

                $("#SumBillNumberOrderPriceB").html("&#165; " + _jsonReTxt.SumBillNumberOrderPrice);

                if (_jsonReTxt.BillNumberOrderMsgList.length <= 1) {
                    $("#PaySeeBtnA").attr("href", "../Order/OrderDetail?OID=" + _jsonReTxt.BillNumberOrderMsgList[0].OrderID);
                }
            }
        }
    });


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


