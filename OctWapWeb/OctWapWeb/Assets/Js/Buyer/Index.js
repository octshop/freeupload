//===============买家中心=================//

/**------定义公共变量----**/

//AjaxURL
var mAjaxUrl = "../BuyerAjax/Index";

//商家管理平台域名
var mOctShopSystemWeb_AddrDomain = "";

/**------初始化------**/
$(function () {

    mOctShopSystemWeb_AddrDomain = $("#hidOctShopSystemWeb_AddrDomain").val().trim();

    //加载买家用户的 账号，买家信息，余额积分信息
    loadUserMsgAccFinance();

    //数据分页查询
    pageDataSearch();

    //统计买家中心首页 各项小红点提示数
    countBuyerIndexRCHint();

    //判断是否用户绑定了手机号
    isBindMobile();

});


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
        "Type": "1",
        "PageCurrent": mIntPageCurrent,
    };
    //正式发送GET请求
    $.ajax({
        type: "POST",
        url: mAjaxUrl + "?rnd=" + Math.random(),
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



/**------ 自定义 函数 ------**/

/**
 * 加载加载买家用户的 账号，买家信息，余额积分信息
 * */
function loadUserMsgAccFinance() {
    //构造GET参数
    var dataPOST = {
        "Type": "3",
    };
    //正式发送GET请求
    $.ajax({
        type: "POST",
        url: mAjaxUrl + "?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("加载买家用户的 账号，买家信息，余额积分信息=" + reTxt);
            if (reTxt != "") {

                //转换为Json对象
                var _jsonReTxt = JSON.parse(reTxt);

                //前端赋值
                if (_jsonReTxt.HeaderImg != "" && _jsonReTxt.HeaderImg != null) {
                    $("#HeaderImg").attr("src", _jsonReTxt.HeaderImg);
                }
                $("#UserNickVipLevelName").html("" + _jsonReTxt.UserNick + " <span>" + _jsonReTxt.VipLevelName.replace("会员", "") + "</span>");
                $("#UserIDDiv").html("UID:" + _jsonReTxt.UserID);

                if (_jsonReTxt.UserAccount != "" && _jsonReTxt.UserAccount != null && _jsonReTxt.UserAccount != undefined) {
                    $("#UserAccountDiv").show();
                    $("#UserAccountDiv").html("UAC:" + maskMobileNumber(_jsonReTxt.UserAccount));
                }

                $("#CurBalanceB").html("&#165;" + _jsonReTxt.CurBalance);
                $("#CurIntegralB").html(_jsonReTxt.CurIntegral);

                //是否显示进入商家中的入口
                if (_jsonReTxt.IsOpenShop == "true") {
                    $("#ShopCenterGoA").show();
                    $("#ShopCenterGoA").attr("href", mOctShopSystemWeb_AddrDomain + "/WapPage/Index");
                }
                else {
                    $("#ShopCenterGoA").hide();
                }

            }
        },
        error: function (xhr, errorTxt, status) {
            console.log("异步请求错误，errorTxt=" + errorTxt + " | status=" + status);
            return;
        }
    });
}

/**
 * 统计买家中心首页 各项小红点提示数
 * */
function countBuyerIndexRCHint() {
    //构造GET参数
    var dataPOST = {
        "Type": "1",
    };
    //正式发送GET请求
    $.ajax({
        type: "POST",
        url: "../RCHintAjax/CountData?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("统计买家中心首页 各项小红点提示数=" + reTxt);
            if (reTxt != "") {

                //转换为Json对象
                var _jsonReTxt = JSON.parse(reTxt);


                if (parseInt(_jsonReTxt.WaitPayOrder) > 0) {
                    $("#WaitPayOrder").show();
                    if (parseInt(_jsonReTxt.WaitPayOrder) > 99) {
                        $("#WaitPayOrder").html("...");
                    }
                    else {
                        $("#WaitPayOrder").html(_jsonReTxt.WaitPayOrder);
                    }
                }

                if (parseInt(_jsonReTxt.WaitSendOrder) > 0) {
                    $("#WaitSendOrder").show();
                    if (parseInt(_jsonReTxt.WaitSendOrder) > 99) {
                        $("#WaitSendOrder").html("...");
                    }
                    else {
                        $("#WaitSendOrder").html(_jsonReTxt.WaitSendOrder);
                    }
                }

                if (parseInt(_jsonReTxt.WaitReceiOrder) > 0) {
                    $("#WaitReceiOrder").show();
                    if (parseInt(_jsonReTxt.WaitReceiOrder) > 99) {
                        $("#WaitReceiOrder").html("...");
                    }
                    else {
                        $("#WaitReceiOrder").html(_jsonReTxt.WaitReceiOrder);
                    }
                }

                if (parseInt(_jsonReTxt.WaitAppraiseOrder) > 0) {
                    $("#WaitAppraiseOrder").show();
                    if (parseInt(_jsonReTxt.WaitAppraiseOrder) > 99) {
                        $("#WaitAppraiseOrder").html("...");
                    }
                    else {
                        $("#WaitAppraiseOrder").html(_jsonReTxt.WaitAppraiseOrder);
                    }
                }


                if (parseInt(_jsonReTxt.GroupOrder) > 0) {
                    $("#GroupOrder").show();
                    if (parseInt(_jsonReTxt.GroupOrder) > 99) {
                        $("#GroupOrder").html("...");
                    }
                    else {
                        $("#GroupOrder").html(_jsonReTxt.GroupOrder);
                    }
                }

                if (parseInt(_jsonReTxt.PresentOrder) > 0) {
                    $("#PresentOrder").show();
                    if (parseInt(_jsonReTxt.PresentOrder) > 99) {
                        $("#PresentOrder").html("...");
                    }
                    else {
                        $("#PresentOrder").html(_jsonReTxt.PresentOrder);
                    }
                }

                if (parseInt(_jsonReTxt.LuckyDrawCount) > 0) {
                    $("#LuckyDrawCount").show();
                    if (parseInt(_jsonReTxt.LuckyDrawCount) > 99) {
                        $("#LuckyDrawCount").html("...");
                    }
                    else {
                        $("#LuckyDrawCount").html(_jsonReTxt.LuckyDrawCount);
                    }
                }

                if (parseInt(_jsonReTxt.ActivityCount) > 0) {
                    $("#ActivityCount").show();
                    if (parseInt(_jsonReTxt.ActivityCount) > 99) {
                        $("#ActivityCount").html("...");
                    }
                    else {
                        $("#ActivityCount").html(_jsonReTxt.ActivityCount);
                    }
                }

                if (parseInt(_jsonReTxt.AfterSaleCount) > 0) {
                    $("#AfterSaleCount").show();
                    if (parseInt(_jsonReTxt.AfterSaleCount) > 99) {
                        $("#AfterSaleCount").html("...");
                    }
                    else {
                        $("#AfterSaleCount").html(_jsonReTxt.AfterSaleCount);
                    }
                }

                if (parseInt(_jsonReTxt.ExpenseTakeOrder) > 0) {
                    $("#ExpenseTakeOrder").show();
                    if (parseInt(_jsonReTxt.ExpenseTakeOrder) > 99) {
                        $("#ExpenseTakeOrder").html("...");
                    }
                    else {
                        $("#ExpenseTakeOrder").html(_jsonReTxt.ExpenseTakeOrder);
                    }
                }

                if (parseInt(_jsonReTxt.PayDeliveryOrder) > 0) {
                    $("#PayDeliveryOrder").show();
                    if (parseInt(_jsonReTxt.PayDeliveryOrder) > 99) {
                        $("#PayDeliveryOrder").html("...");
                    }
                    else {
                        $("#PayDeliveryOrder").html(_jsonReTxt.PayDeliveryOrder);
                    }
                }

                if (parseInt(_jsonReTxt.CouponsCount) > 0) {
                    $("#CouponsCount").show();
                    if (parseInt(_jsonReTxt.CouponsCount) > 99) {
                        $("#CouponsCount").html("...");
                    }
                    else {
                        $("#CouponsCount").html(_jsonReTxt.CouponsCount);
                    }
                }

                if (parseInt(_jsonReTxt.ComplainCount) > 0) {
                    $("#ComplainCount").show();
                    if (parseInt(_jsonReTxt.ComplainCount) > 99) {
                        $("#ComplainCount").html("...");
                    }
                    else {
                        $("#ComplainCount").html(_jsonReTxt.ComplainCount);
                    }
                }

                if (parseInt(_jsonReTxt.AllCount) > 0) {
                    $("#MyNavBottom").show();
                }
                if (parseInt(_jsonReTxt.ShoppingCartCount) > 0) {
                    $("#SCartNavBottom").show();
                }
                if (parseInt(_jsonReTxt.BuyerSysMsgNoRead) > 0) {
                    $("#BuyerMsgNavBottom").show();
                }


            }
        },
        error: function (xhr, errorTxt, status) {
            console.log("异步请求错误，errorTxt=" + errorTxt + " | status=" + status);
            return;
        }
    });
}

/**
 * 判断是否用户绑定了手机号
 * */
function isBindMobile() {

    //构造GET参数
    var dataPOST = {
        "Type": "2",
    };
    //正式发送GET请求
    $.ajax({
        type: "POST",
        url: "../SettingAjax/Index?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("判断是否用户绑定了手机号=" + reTxt);
            if (reTxt != "") {
                //转换为Json对象
                var _jsonReTxt = JSON.parse(reTxt);

                if (_jsonReTxt.ErrCode == "IBMA_02") {
                    confirmWin("你未绑定手机号，请绑定?", function () {
                        window.location.href = "../Setting/BindMobileChg?BackUrl=../Buyer/Index";
                    })
                }
            }
        },
        error: function (xhr, errorTxt, status) {
            console.log("异步请求错误，errorTxt=" + errorTxt + " | status=" + status);
            return;
        }
    });

}