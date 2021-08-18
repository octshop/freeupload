//==================店铺首页================//

/**------定义公共变量----**/

//AjaxURL
var mAjaxUrl = "../ShopAjax/Index";

var mShopID = ""; //店铺ID
var mShopUserID = ""; //商家UserID
var mBuyerUserID = ""; //买家UserID

var mhidOctShopSystemWeb_AddrDomain = "";

//构建商家店铺咨询进入IM在线客服系统 跳转 URL
var mBuyerGoToImSysURL_ShopWap = "";

/**------初始化------**/
$(function () {

    mShopID = $("#hidShopID").val().trim();
    mBuyerUserID = $("#hidBuyerUserID").val().trim();

    mhidOctShopSystemWeb_AddrDomain = $("#hidOctShopSystemWeb_AddrDomain").val().trim();

    //加载店铺首页信息
    loadShopHomeMsg(function () {

        //数据分页查询
        pageDataSearch();

        //构建商家店铺咨询进入IM在线客服系统 跳转 URL
        buildBuyerGoToImSysURL_ShopWap(mShopUserID, mBuyerUserID);

    });

    //初始化轮播图片信息
    initSliderGoodsImgData();

    //加载优惠券指定记录条数
    loadShopCouponsTopList();



});

/**
 * 加载店铺首页信息
 * */
function loadShopHomeMsg(pCallBack) {

    //构造POST参数
    var dataPOST = {
        "Type": "1", "ShopID": mShopID, "BuyerUserID": mBuyerUserID,
    };

    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: mAjaxUrl + "?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("加载店铺首页信息=" + reTxt);
            if (reTxt != "") {

                var _jsonReTxt = JSON.parse(reTxt);

                mShopUserID = _jsonReTxt.ShopMsgTopBarItem.ShopUserID;

                //是否显示管理店铺按钮
                if (mBuyerUserID == mShopUserID) {
                    $("#ShopManA").show();
                    $("#ShopManA").attr("href", mhidOctShopSystemWeb_AddrDomain + "/WapPage/Index");
                }


                //------设置店铺主推荐新注册用户的Cookie------//
                setShopUserIDPromoteBuyerCookie(_jsonReTxt.ShopMsgTopBarItem.ShopID, _jsonReTxt.ShopMsgTopBarItem.ShopUserID, _jsonReTxt.ShopMsgTopBarItem.ShopMobile);

                //-----店铺信息条-----//
                var ShopMsgTopBarItem = _jsonReTxt.ShopMsgTopBarItem;

                var _IsSelfShopSpan = "";
                if (ShopMsgTopBarItem.IsSelfShop == "true") {
                    _IsSelfShopSpan = "<span class=\"shop-bage-span\">自营店</span>";
                }

                $("#ShopName").html(ShopMsgTopBarItem.ShopName + " " + _IsSelfShopSpan);
                $("#ShopHeaderImgVal").attr("src", "//" + ShopMsgTopBarItem.ShopHeaderImg);
                var _starHtml = getStarAppraiseHtml(ShopMsgTopBarItem.AvgAppraiseScore);
                $("#HeaderSpanStar").html(_starHtml);
                $("#AvgAppraiseScoreVal").html(ShopMsgTopBarItem.AvgAppraiseScore + " 分");
                $("#CountFansVal").html(ShopMsgTopBarItem.CountFans);
                $("#CountFavShopVal").html(ShopMsgTopBarItem.CountFavShop + "人");

                //页面标题
                $("#PageTitle").html(ShopMsgTopBarItem.ShopName + "-首页");

                //页脚下面的客服
                $("#CusServiceFooter").on("click", function () {

                    window.location.href = "tel:" + ShopMsgTopBarItem.ShopMobile;

                });


                //------店铺地址与导航------//
                var ShopAddrLocationTel = _jsonReTxt.ShopAddrLocationTel;
                if (ShopAddrLocationTel != undefined) {
                    if (ShopAddrLocationTel.RegionNameArr != "" && ShopAddrLocationTel.RegionNameArr != null && ShopAddrLocationTel.Longitude != "" && ShopAddrLocationTel.Longitude != null && ShopAddrLocationTel.Latitude != "" && ShopAddrLocationTel.Latitude != null) {

                        //显示导航地址
                        if (ShopMsgTopBarItem.IsEntity == "true") {
                            $("#AddressNav").show();
                        }


                        var _detailAddr = ShopAddrLocationTel.RegionNameArr + "_" + ShopAddrLocationTel.DetailAddr;

                        var _detailAddrMap = _detailAddr;

                        if (ShopAddrLocationTel.DistanceKm != "" && ShopAddrLocationTel.DistanceKm != null) {
                            _detailAddr += " <span> (距您<b> " + ShopAddrLocationTel.DistanceKm + "km </b>)</span>";
                        }
                        $("#DetailAddrDiv").html(_detailAddr);
                        //电话
                        $("#ShopMobileA").attr("href", "tel:" + ShopAddrLocationTel.ShopMobile);

                        $("#ShopMobileA2").unbind();
                        //页脚下面的客服
                        $("#ShopMobileA2").on("click", function () {
                            window.location.href = "tel:" + ShopAddrLocationTel.ShopMobile;
                        });


                        //初始化所有的 地图导航URL连接
                        allMapURL(ShopAddrLocationTel.Latitude, ShopAddrLocationTel.Longitude, ShopMsgTopBarItem.ShopName, _detailAddrMap);
                    }
                }

                //------销量与收藏排行榜------//
                //----销量排行----//
                var SaleCountSortList = _jsonReTxt.SaleCountSortList;
                if (SaleCountSortList != undefined && SaleCountSortList != null) {

                    $("#OrderSortListDiv").show();

                    var myJsValSaleCount = "";
                    for (var i = 0; i < SaleCountSortList.length; i++) {

                        if (SaleCountSortList[i].GoodsTitle.length > 15) {
                            SaleCountSortList[i].GoodsTitle = SaleCountSortList[i].GoodsTitle.substring(0, 14);
                        }

                        myJsValSaleCount += "<div class=\"order-item\" onclick=\"window.location.href='../Goods/GoodsDetail?GID=" + SaleCountSortList[i].GoodsID + "'\">";
                        myJsValSaleCount += " <img src=\"//" + SaleCountSortList[i].ImgPathCover + "\" />";
                        myJsValSaleCount += " <div>";
                        myJsValSaleCount += "" + SaleCountSortList[i].GoodsTitle + "";
                        myJsValSaleCount += " </div>";
                        myJsValSaleCount += " <span>";
                        myJsValSaleCount += "" + SaleCountSortList[i].PaidCount + "付款";
                        myJsValSaleCount += " </span>";
                        myJsValSaleCount += "</div>";
                    }
                    //插入显示代码
                    $("#SaleCountSortList").html(myJsValSaleCount);
                }

                //-----关注排行 -----//
                var FavCountSortList = _jsonReTxt.FavCountSortList;
                if (FavCountSortList != undefined && FavCountSortList != null) {

                    $("#OrderSortListDiv").show();

                    var myJsValFavCount = "";
                    for (var i = 0; i < FavCountSortList.length; i++) {
                        if (FavCountSortList[i].GoodsTitle.length > 15) {
                            FavCountSortList[i].GoodsTitle = FavCountSortList[i].GoodsTitle.substring(0, 14);
                        }

                        myJsValFavCount += "<div class=\"order-item\" onclick=\"window.location.href='../Goods/GoodsDetail?GID=" + FavCountSortList[i].GoodsID + "'\">";
                        myJsValFavCount += " <img src=\"//" + FavCountSortList[i].ImgPathCover + "\" />";
                        myJsValFavCount += " <div>";
                        myJsValFavCount += "" + FavCountSortList[i].GoodsTitle + "";
                        myJsValFavCount += " </div>";
                        myJsValFavCount += " <span>";
                        myJsValFavCount += "" + FavCountSortList[i].FavGoodsCount + "关注";
                        myJsValFavCount += " </span>";
                        myJsValFavCount += "</div>";
                    }
                    //插入显示代码
                    $("#FavCountSortList").html(myJsValFavCount);
                }


                //----------各栏目显示内容---------//
                if (_jsonReTxt.ShopShowMsgList != undefined) {

                    $("#ShopShowMsgContent").show();

                    var ShopShowMsgArr = _jsonReTxt.ShopShowMsgList.ShopShowMsg;
                    var ShopShowMsgGoodsArr = _jsonReTxt.ShopShowMsgList.ShopShowMsgGoods;
                    //构造显示内容
                    var myJsValShopShow = "";
                    for (var k = 0; k < ShopShowMsgArr.length; k++) {


                        //打折商品
                        if (ShopShowMsgArr[k].HomeDiscountList != "" && ShopShowMsgArr[k].HomeDiscountList != undefined && ShopShowMsgArr[k].HomeDiscountList != null) {

                            var HomeDiscountList = ShopShowMsgArr[k].HomeDiscountList;
                            var HomeDiscountGoodsList = ShopShowMsgGoodsArr[k].HomeDiscountGoodsList;

                            myJsValShopShow += "<div class=\"goods-main\">";
                            myJsValShopShow += " <div class=\"goods-title\">";
                            myJsValShopShow += "     <div class=\"goods-title-left\">";
                            myJsValShopShow += "         打折商品";
                            myJsValShopShow += "     </div>";
                            myJsValShopShow += "     <div class=\"goods-title-right\" onclick=\"window.location.href='../Shop/GoodsAll?SID=" + mShopID + "&TBN=6'\">";
                            myJsValShopShow += "         更多>>";
                            myJsValShopShow += "     </div>";
                            myJsValShopShow += " </div>";
                            myJsValShopShow += " <div class=\"goods-list\">";

                            for (var n = 0; n < HomeDiscountGoodsList.length; n++) {

                                if (HomeDiscountGoodsList[n].Discount <= 0) {
                                    continue;
                                }

                                if (HomeDiscountGoodsList[n].GoodsTitle.length > 26) {
                                    HomeDiscountGoodsList[n].GoodsTitle = HomeDiscountGoodsList[n].GoodsTitle.substring(0, 25) + "...";;
                                }

                                //价格
                                var GoodsPrice = parseFloat(HomeDiscountGoodsList[n].GoodsPrice) * (parseFloat(HomeDiscountGoodsList[n].Discount) / 10);

                                myJsValShopShow += "     <div class=\"goods-item\" onclick=\"window.location.href='../Goods/GoodsDetail?GID=" + HomeDiscountGoodsList[n].GoodsID + "'\">";
                                myJsValShopShow += "         <div class=\"goods-img\">";
                                myJsValShopShow += "             <img src=\"//" + HomeDiscountGoodsList[n].GoodsCoverImgPath + "\" />";
                                myJsValShopShow += "         </div>";
                                myJsValShopShow += "         <div class=\"goods-name\">" + HomeDiscountGoodsList[n].GoodsTitle + "</div>";
                                myJsValShopShow += "         <div class=\"goods-price\">";
                                myJsValShopShow += "             <b>&#165;" + formatNumberDotDigit(GoodsPrice, 2) + "</b>";
                                myJsValShopShow += "             <span>" + HomeDiscountGoodsList[n].Discount + "折</span>";
                                myJsValShopShow += "         </div>";
                                myJsValShopShow += "     </div>";
                            }
                            myJsValShopShow += " </div>";
                            myJsValShopShow += "</div>";
                        }


                        //拼团商品
                        if (ShopShowMsgArr[k].HomeGroupList != "" && ShopShowMsgArr[k].HomeGroupList != undefined && ShopShowMsgArr[k].HomeGroupList != null) {

                            var HomeGroupList = ShopShowMsgArr[k].HomeGroupList;
                            var HomeGroupGoodsList = ShopShowMsgGoodsArr[k].HomeGroupGoodsList;

                            if (HomeGroupGoodsList.length > 0) {

                                myJsValShopShow += "<div class=\"goods-main\">";
                                myJsValShopShow += " <div class=\"goods-title\">";
                                myJsValShopShow += "     <div class=\"goods-title-left\">";
                                myJsValShopShow += "         团购商品";
                                myJsValShopShow += "     </div>";
                                myJsValShopShow += "     <div class=\"goods-title-right\" onclick=\"window.location.href='../Shop/GoodsAll?SID=" + mShopID + "&TBN=7'\">";
                                myJsValShopShow += "         更多>>";
                                myJsValShopShow += "     </div>";
                                myJsValShopShow += " </div>";
                                myJsValShopShow += " <div class=\"goods-list\">";

                                for (var n = 0; n < HomeGroupGoodsList.length; n++) {

                                    if (HomeGroupGoodsList[n].GroupDiscount <= 0) {
                                        continue;
                                    }

                                    if (HomeGroupGoodsList[n].GoodsTitle.length > 26) {
                                        HomeGroupGoodsList[n].GoodsTitle = HomeGroupGoodsList[n].GoodsTitle.substring(0, 25) + "...";
                                    }

                                    //价格
                                    var GoodsPrice = parseFloat(HomeGroupGoodsList[n].GoodsPrice) * (parseFloat(HomeGroupGoodsList[n].GroupDiscount) / 10);

                                    myJsValShopShow += "     <div class=\"goods-item\" onclick=\"window.location.href='../Group/GroupDetail?GID=" + HomeGroupGoodsList[n].GoodsID + "'\">";
                                    myJsValShopShow += "         <div class=\"goods-img\">";
                                    myJsValShopShow += "             <img src=\"//" + HomeGroupGoodsList[n].GoodsCoverImgPath + "\" />";
                                    myJsValShopShow += "         </div>";
                                    myJsValShopShow += "         <div class=\"goods-name\">" + HomeGroupGoodsList[n].GoodsTitle + "</div>";
                                    myJsValShopShow += "         <div class=\"goods-price\">";
                                    myJsValShopShow += "             <b>&#165;" + formatNumberDotDigit(GoodsPrice, 2) + "</b>";
                                    myJsValShopShow += "             <span>团购</span>";
                                    myJsValShopShow += "         </div>";
                                    myJsValShopShow += "     </div>";
                                }
                                myJsValShopShow += " </div>";
                                myJsValShopShow += "</div>";
                            }
                        }

                        //秒杀商品
                        if (ShopShowMsgArr[k].HomeSecKillList != "" && ShopShowMsgArr[k].HomeSecKillList != undefined && ShopShowMsgArr[k].HomeSecKillList != null) {

                            var HomeSecKillList = ShopShowMsgArr[k].HomeSecKillList;
                            var HomeSecKillGoodsList = ShopShowMsgGoodsArr[k].HomeSecKillGoodsList;

                            if (HomeSecKillGoodsList.length > 0) {

                                myJsValShopShow += "<div class=\"goods-main\">";
                                myJsValShopShow += " <div class=\"goods-title\">";
                                myJsValShopShow += "     <div class=\"goods-title-left\">";
                                myJsValShopShow += "         秒杀商品";
                                myJsValShopShow += "     </div>";
                                myJsValShopShow += "     <div class=\"goods-title-right\" onclick=\"window.location.href='../Shop/GoodsAll?SID=" + mShopID + "&TBN=8'\">";
                                myJsValShopShow += "         更多>>";
                                myJsValShopShow += "     </div>";
                                myJsValShopShow += " </div>";
                                myJsValShopShow += " <div class=\"goods-list\">";

                                console.log("HomeSecKillGoodsList.length=" + HomeSecKillGoodsList.length);

                                for (var n = 0; n < HomeSecKillGoodsList.length; n++) {


                                    if (HomeSecKillGoodsList[n].SkDiscount <= 0) {
                                        continue;
                                    }


                                    if (HomeSecKillGoodsList[n].GoodsTitle.length > 26) {
                                        HomeSecKillGoodsList[n].GoodsTitle = HomeSecKillGoodsList[n].GoodsTitle.substring(0, 25) + "...";
                                    }

                                    //价格
                                    var GoodsPrice = parseFloat(HomeSecKillGoodsList[n].GoodsPrice) * (parseFloat(HomeSecKillGoodsList[n].SkDiscount) / 10);

                                    myJsValShopShow += "     <div class=\"goods-item\" onclick=\"window.location.href='../Goods/GoodsDetail?GID=" + HomeSecKillGoodsList[n].GoodsID + "'\">";
                                    myJsValShopShow += "         <div class=\"goods-img\">";
                                    myJsValShopShow += "             <img src=\"//" + HomeSecKillGoodsList[n].GoodsCoverImgPath + "\" />";
                                    myJsValShopShow += "         </div>";
                                    myJsValShopShow += "         <div class=\"goods-name\">" + HomeSecKillGoodsList[n].GoodsTitle + "</div>";
                                    myJsValShopShow += "         <div class=\"goods-price\">";
                                    myJsValShopShow += "             <b>&#165;" + formatNumberDotDigit(GoodsPrice, 2) + "</b>";
                                    myJsValShopShow += "             <span>秒杀</span>";
                                    myJsValShopShow += "         </div>";
                                    myJsValShopShow += "     </div>";

                                }
                                myJsValShopShow += " </div>";
                                myJsValShopShow += "</div>";

                            }

                        }


                        //商家推荐
                        if (ShopShowMsgArr[k].HomeCommendList != "" && ShopShowMsgArr[k].HomeCommendList != undefined && ShopShowMsgArr[k].HomeCommendList != null) {

                            var HomeCommendList = ShopShowMsgArr[k].HomeCommendList;
                            var HomeCommendGoodsList = ShopShowMsgGoodsArr[k].HomeCommendGoodsList;

                            myJsValShopShow += "<div class=\"goods-main\">";
                            myJsValShopShow += " <div class=\"goods-title\">";
                            myJsValShopShow += "     <div class=\"goods-title-left\">";
                            myJsValShopShow += "         商家推荐";
                            myJsValShopShow += "     </div>";
                            myJsValShopShow += "     <div class=\"goods-title-right\" onclick=\"window.location.href='../Shop/GoodsAll?SID=" + mShopID + "&TBN=1'\">";
                            myJsValShopShow += "         更多>>";
                            myJsValShopShow += "     </div>";
                            myJsValShopShow += " </div>";
                            myJsValShopShow += " <div class=\"goods-list\">";

                            for (var n = 0; n < HomeCommendGoodsList.length; n++) {

                                if (HomeCommendGoodsList[n].GoodsTitle.length > 26) {
                                    HomeCommendGoodsList[n].GoodsTitle = HomeCommendGoodsList[n].GoodsTitle.substring(0, 25) + "...";
                                }

                                //取最大折扣
                                var _discount = HomeCommendGoodsList[n].Discount;
                                if (_discount <= 0) {
                                    _discount = 10;
                                }
                                if (_discount > HomeCommendGoodsList[n].GroupDiscount && HomeCommendGoodsList[n].GroupDiscount > 0) {
                                    _discount = HomeCommendGoodsList[n].GroupDiscount;
                                }
                                if (_discount > HomeCommendGoodsList[n].SkDiscount && HomeCommendGoodsList[n].SkDiscount > 0) {
                                    _discount = HomeCommendGoodsList[n].SkDiscount;
                                }

                                console.log("_discount=" + _discount);

                                //价格
                                var GoodsPrice = parseFloat(HomeCommendGoodsList[n].GoodsPrice) * (parseFloat(_discount) / 10);


                                myJsValShopShow += "     <div class=\"goods-item\" onclick=\"window.location.href='../Goods/GoodsDetail?GID=" + HomeCommendGoodsList[n].GoodsID + "'\">";
                                myJsValShopShow += "         <div class=\"goods-img\">";
                                myJsValShopShow += "             <img src=\"//" + HomeCommendGoodsList[n].GoodsCoverImgPath + "\" />";
                                myJsValShopShow += "         </div>";
                                myJsValShopShow += "         <div class=\"goods-name\">" + HomeCommendGoodsList[n].GoodsTitle + "</div>";
                                myJsValShopShow += "         <div class=\"goods-price\">";
                                myJsValShopShow += "             <b>&#165;" + formatNumberDotDigit(GoodsPrice, 2) + "</b>";
                                myJsValShopShow += "             <span class=\"goods-price-no\">&#165;" + HomeCommendGoodsList[n].MarketPrice + "</span>";
                                myJsValShopShow += "         </div>";
                                myJsValShopShow += "     </div>";
                            }
                            myJsValShopShow += " </div>";
                            myJsValShopShow += "</div>";
                        }



                        ////礼品领取
                        //if (ShopShowMsgArr[k].HomePresentList != "" && ShopShowMsgArr[k].HomePresentList != undefined && ShopShowMsgArr[k].HomePresentList != null) {

                        //    var HomePresentList = ShopShowMsgArr[k].HomePresentList;
                        //    var HomePresentGoodsList = ShopShowMsgGoodsArr[k].HomePresentGoodsList;

                        //    myJsValShopShow += "<div class=\"goods-main\">";
                        //    myJsValShopShow += " <div class=\"goods-title\">";
                        //    myJsValShopShow += "     <div class=\"goods-title-left\">";
                        //    myJsValShopShow += "         礼品领取";
                        //    myJsValShopShow += "     </div>";
                        //    myJsValShopShow += "     <div class=\"goods-title-right\" onclick=\"window.location.href='../Shop/Present?SID=" + mShopID + "'\">";
                        //    myJsValShopShow += "         更多>>";
                        //    myJsValShopShow += "     </div>";
                        //    myJsValShopShow += " </div>";
                        //    myJsValShopShow += " <div class=\"goods-list\">";

                        //    for (var n = 0; n < HomePresentGoodsList.length; n++) {

                        //        if (HomePresentGoodsList[n].PresentTitle != null && HomePresentGoodsList[n].PresentTitle != undefined) {
                        //            if (HomePresentGoodsList[n].PresentTitle.length > 26) {
                        //                HomePresentGoodsList[n].PresentTitle = HomePresentGoodsList[n].PresentTitle.substring(0, 25) + "...";
                        //            }
                        //        }
                        //        else {
                        //            HomePresentGoodsList[n].PresentTitle = "";
                        //        }

                        //        myJsValShopShow += "     <div class=\"goods-item\" onclick=\"window.location.href='../Present/PresentDetail?PID=" + HomePresentGoodsList[n].PresentID + "'\">";
                        //        myJsValShopShow += "         <div class=\"goods-img\">";
                        //        myJsValShopShow += "             <img src=\"//" + HomePresentGoodsList[n].PresentCoverImgURL + "\" />";
                        //        myJsValShopShow += "         </div>";
                        //        myJsValShopShow += "         <div class=\"goods-name\">" + HomePresentGoodsList[n].PresentTitle + "</div>";
                        //        myJsValShopShow += "         <div class=\"goods-price\">";
                        //        myJsValShopShow += "             <b>积分:" + formatNumberDotDigit(HomePresentGoodsList[n].PresentPrice, 2) + "</b>";
                        //        myJsValShopShow += "            <span class=\"goods-stock-residue\">剩余:" + HomePresentGoodsList[n].StockNum + "</span>";
                        //        myJsValShopShow += "         </div>";
                        //        myJsValShopShow += "     </div>";

                        //    }
                        //    myJsValShopShow += " </div>";
                        //    myJsValShopShow += "</div>";
                        //}





                    }
                    //显示代码插入前台
                    $("#ShopShowMsgContent").html(myJsValShopShow);
                }

                //回调函数
                pCallBack();

            }
        }
    });
}

/**
 * 切换排行榜
 * @param {any} pTabNum 1 销量排行  , 2 关注排行
 */
function chgSortListTab(pTabNum) {
    $("#SaleCountSortTab").removeClass("order-current");
    $("#FavCountSortTab").removeClass("order-current");
    if (pTabNum == "1") {
        $("#SaleCountSortTab").addClass("order-current");

        $("#SaleCountSortList").show();
        $("#FavCountSortList").hide();
    }
    else if (pTabNum == "2") {
        $("#FavCountSortTab").addClass("order-current");

        $("#SaleCountSortList").hide();
        $("#FavCountSortList").show();
    }
}

/**
 * 加载优惠券指定记录条数
 * */
function loadShopCouponsTopList() {

    //构造POST参数
    var dataPOST = {
        "Type": "3", "ShopID": mShopID,
    };

    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: mAjaxUrl + "?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("加载优惠券指定记录条数=" + reTxt);
            if (reTxt != "") {

                var _jsonReTxt = JSON.parse(reTxt);

                var CouponsMsgList = _jsonReTxt.CouponsMsgList;
                if (CouponsMsgList != undefined) {
                    if (CouponsMsgList.length >= 0) {

                        $("#CouponsContentDiv").show();
                        var myJsVal = "";
                        for (var i = 0; i < CouponsMsgList.length; i++) {
                            myJsVal += "<div class=\"coupons-item\" onclick=\"buyerGetCoupons('" + CouponsMsgList[i].CouponsID + "')\">";

                            if (CouponsMsgList[i].UseDiscount > 0) {
                                myJsVal += " <b>" + CouponsMsgList[i].UseDiscount + "折券</b>";
                            }
                            else {
                                myJsVal += " <b>&#165;" + formatNumberDotDigit(CouponsMsgList[i].UseMoney, 2) + "</b>";
                            }
                            myJsVal += " <div>";
                            if (CouponsMsgList[i].ExpenseReachSum <= 0) {
                                myJsVal += "无消费限制";
                            }
                            else {
                                myJsVal += "满" + CouponsMsgList[i].ExpenseReachSum + "元可用";
                            }
                            myJsVal += " </div>";
                            myJsVal += " <span>点击领取>></span>";
                            myJsVal += "</div>";
                        }
                        //显示代码插入前台
                        $("#CouponsListDiv").html(myJsVal);
                    }
                }

            }
        }
    });

}

/**
 * 买家获取优惠券 单个获取
 * @param pCouponsID 优惠券ID
 * */
function buyerGetCoupons(pCouponsID) {

    //判断买家是否登录
    var _isLogin = isBuyerLogin(false);
    if (_isLogin == false) {
        return;
    }

    //构造POST参数
    var dataPOST = {
        "Type": "4", "CouponsID": pCouponsID, "BuyerUserID": mBuyerUserID,
    };

    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: mAjaxUrl + "?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("买家获取优惠券 单个获取=" + reTxt);
            if (reTxt != "") {
                var _jsonReTxt = JSON.parse(reTxt);

                if (_jsonReTxt.ErrMsg != undefined && _jsonReTxt.ErrMsg != null && _jsonReTxt.ErrMsg != "") {
                    toastWin(_jsonReTxt.ErrMsg);
                }
                if (_jsonReTxt.Msg != undefined && _jsonReTxt.Msg != null && _jsonReTxt.Msg != "") {
                    toastWin(_jsonReTxt.Msg);
                }

            }
        }
    });

}

/**
 * 店铺-猜你喜欢商品
 * */
function shopGuessYouLike() {

    //构造POST参数
    var dataPOST = {
        "Type": "6", "ShopID": mShopID, "ShopUserID": mShopUserID,
    };

    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: mAjaxUrl + "?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("店铺-猜你喜欢商品=" + reTxt);
            if (reTxt != "") {
                var _jsonReTxt = JSON.parse(reTxt);


            }
        }
    });

}

//===================主轮播图片==========================//

/**
 * 初始化轮播图片信息
 * */
function initSliderGoodsImgData() {

    //构造POST参数
    var dataPOST = {
        "Type": "2", "ShopID": mShopID,
    };

    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: mAjaxUrl + "?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("初始化轮播图片信息=" + reTxt);
            if (reTxt != "") {

                var _jsonReTxt = JSON.parse(reTxt);

                $("#OctSlider").show();

                var ShopCarouselList = _jsonReTxt.ShopCarouselList;
                var ShopAddrLocationTel = _jsonReTxt.ShopAddrLocationTel;

                //构造显示代码
                var myJsVal = "";
                for (var i = 0; i < ShopCarouselList.length; i++) {

                    var _redirectURL = getRedirectPageURL(ShopCarouselList[i].AdvLinkType, ShopCarouselList[i].AdvLinkA);

                    myJsVal += "<li>";
                    myJsVal += " <a href=\"" + _redirectURL + "\" target=\"_blank\">";
                    myJsVal += "     <div class=\"img-slider img-slider-1\">";
                    myJsVal += "         <img src=\"//" + ShopCarouselList[i].ImgURL + "\" />";
                    myJsVal += "     </div>";
                    myJsVal += " </a>";
                    myJsVal += "</li>";
                }
                $("#content-slider").html(myJsVal);

                //初始化 主轮播图片插件
                initSliderGoodsImg();

            }
        }
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
        auto: true, //如果设置为true，幻灯片将自动播放
        loop: true, //false表示在播放到最后一帧时不会跳转到开头重新播放
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



//============关注与收藏============//

/**
 * /添加关注收藏信息 (收藏商品或店铺)
 * */
function addBuyerFocusFav() {

    if (mShopID == "0" || mShopID == "") {
        return;
    }

    //判断买家是否登录
    var _isLogin = isBuyerLogin(false);

    //构造POST参数
    var dataPOST = {
        "Type": "1", "FocusFavType": "shop", "ShopID": mShopID,
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



//==============店铺地址与导航=============//


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




//===============公共函数区================//

/**
 * 判断买家是否登录 
 * @param pIsWin 是否为窗口立即订购 [默认 false 不是窗口]
 * */
function isBuyerLogin(pIsWin) {

    if (mBuyerUserID == "" || mBuyerUserID == undefined) {

        if (pIsWin) {
            toastWinToDivCb("请先登录！", function () {

                //跳转到登录页面
                window.location.href = "../Login/Buyer?BackUrl=" + window.location.href + "";

            }, "SliderDownWin");
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

/**
 * 根据评分得到星星评价显示
 * @param {any} pAvgAppraiseScore 评分数
 */
function getStarAppraiseHtml(pAvgAppraiseScore) {

    var myJsVal = "";


    if (pAvgAppraiseScore >= 1 && pAvgAppraiseScore < 2) {
        myJsVal += "<img src=\"../Assets/Imgs/Icon/appraise_star.png\" />";
        myJsVal += "<img src=\"../Assets/Imgs/Icon/appraise_star_gray.png\" />";
        myJsVal += "<img src=\"../Assets/Imgs/Icon/appraise_star_gray.png\" />";
        myJsVal += "<img src=\"../Assets/Imgs/Icon/appraise_star_gray.png\" />";
        myJsVal += "<img src=\"../Assets/Imgs/Icon/appraise_star_gray.png\" />";
    }
    else if (pAvgAppraiseScore >= 2 && pAvgAppraiseScore < 3) {
        myJsVal += "<img src=\"../Assets/Imgs/Icon/appraise_star.png\" />";
        myJsVal += "<img src=\"../Assets/Imgs/Icon/appraise_star.png\" />";
        myJsVal += "<img src=\"../Assets/Imgs/Icon/appraise_star_gray.png\" />";
        myJsVal += "<img src=\"../Assets/Imgs/Icon/appraise_star_gray.png\" />";
        myJsVal += "<img src=\"../Assets/Imgs/Icon/appraise_star_gray.png\" />";
    }
    else if (pAvgAppraiseScore >= 3 && pAvgAppraiseScore < 4) {
        myJsVal += "<img src=\"../Assets/Imgs/Icon/appraise_star.png\" />";
        myJsVal += "<img src=\"../Assets/Imgs/Icon/appraise_star.png\" />";
        myJsVal += "<img src=\"../Assets/Imgs/Icon/appraise_star.png\" />";
        myJsVal += "<img src=\"../Assets/Imgs/Icon/appraise_star_gray.png\" />";
        myJsVal += "<img src=\"../Assets/Imgs/Icon/appraise_star_gray.png\" />";
    }
    else if (pAvgAppraiseScore >= 4 && pAvgAppraiseScore < 5) {
        myJsVal += "<img src=\"../Assets/Imgs/Icon/appraise_star.png\" />";
        myJsVal += "<img src=\"../Assets/Imgs/Icon/appraise_star.png\" />";
        myJsVal += "<img src=\"../Assets/Imgs/Icon/appraise_star.png\" />";
        myJsVal += "<img src=\"../Assets/Imgs/Icon/appraise_star.png\" />";
        myJsVal += "<img src=\"../Assets/Imgs/Icon/appraise_star_gray.png\" />";
    }
    else if (pAvgAppraiseScore >= 5) {
        myJsVal += "<img src=\"../Assets/Imgs/Icon/appraise_star.png\" />";
        myJsVal += "<img src=\"../Assets/Imgs/Icon/appraise_star.png\" />";
        myJsVal += "<img src=\"../Assets/Imgs/Icon/appraise_star.png\" />";
        myJsVal += "<img src=\"../Assets/Imgs/Icon/appraise_star.png\" />";
        myJsVal += "<img src=\"../Assets/Imgs/Icon/appraise_star.png\" />";
    }
    else {
        myJsVal += "<img src=\"../Assets/Imgs/Icon/appraise_star_gray.png\" />";
        myJsVal += "<img src=\"../Assets/Imgs/Icon/appraise_star_gray.png\" />";
        myJsVal += "<img src=\"../Assets/Imgs/Icon/appraise_star_gray.png\" />";
        myJsVal += "<img src=\"../Assets/Imgs/Icon/appraise_star_gray.png\" />";
        myJsVal += "<img src=\"../Assets/Imgs/Icon/appraise_star_gray.png\" />";
    }
    return myJsVal;
}

/**
 * 得到 不同类型的链接 跳转地址 
 * @param {any} pAdvLinkType 链接类型 ( Goods 商品，Present 礼品，Coupons 优惠券，Activity 活动，LuckyDraw 抽奖)
 * @param {any} pAdvLinkA 各种ID
 */
function getRedirectPageURL(pAdvLinkType, pAdvLinkA) {

    var _redirectURL = "";
    //轮播图片的跳转链接类型 ( Goods 商品，Present 礼品，Coupons 优惠券，Activity 活动，LuckyDraw 抽奖) 
    if (pAdvLinkType == "Goods") {

        _redirectURL = "../Goods/GoodsDetail?GID=" + pAdvLinkA;
    }
    else if (pAdvLinkType == "Present") {
        _redirectURL = "../Present/PresentDetail?PID=" + pAdvLinkA;
    }
    else if (pAdvLinkType == "Coupons") {
        _redirectURL = "../Buyer/CouponsDetail?CID=" + pAdvLinkA;
    }
    else if (pAdvLinkType == "Activity") {
        _redirectURL = "../Shop/ActivityDetail?AID=" + pAdvLinkA;
    }
    else if (pAdvLinkType == "LuckyDraw") {
        _redirectURL = "../Mall/LuckyDrawDetail?LID=" + pAdvLinkA;
    }
    return _redirectURL;
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
        "Type": "6",
        "PageCurrent": mIntPageCurrent,
        "ShopID": mShopID,
        "ShopUserID": mShopUserID,
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


                    myJsVal += " <div class=\"goods-item\" onclick=\"window.location.href='../Goods/GoodsDetail?GID=" + dataPage.GoodsID + "'\">";
                    myJsVal += " <div class=\"goods-img\">";
                    myJsVal += "     <img src=\"//" + dataPage.ImgPathCover + "\" />";
                    myJsVal += " </div>";
                    myJsVal += " <div class=\"goods-name\">" + dataPage.GoodsTitle + "</div>";
                    myJsVal += " <div class=\"goods-price\">";
                    myJsVal += "     <b>&#165;" + formatNumberDotDigit(_goodsPrice, 2) + "</b>";
                    myJsVal += "     <div>" + dataPage.PaidCount + "人付款</div>";
                    myJsVal += " </div>";
                    myJsVal += " <span class=\"goods-item-badge\">" + _bageSpan + "</span>";
                    myJsVal += "</div>";

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

/**
 * 设置店铺主推荐新注册用户的Cookie
 * @param {any} pShopID
 * @param {any} pShopUserID
 * @param {any} pBindMobile
 */
function setShopUserIDPromoteBuyerCookie(pShopID, pShopUserID, pBindMobile) {

    if (pShopID == "" || pShopUserID == "" || pBindMobile == "") {
        return;
    }

    //构造POST参数
    var dataPOST = {
        "Type": "3", "ShopID": pShopID, "ShopUserID": pShopUserID, "BindMobile": pBindMobile,
    };
    console.log(dataPOST);

    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: "../ShopAjax/ShopMsg?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("设置店铺主推荐新注册用户的Cookie=" + reTxt);

            if (reTxt != "") {

            }
        }
    });
}

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

                    $("#CusServiceFooter").unbind();
                    //页脚下面的客服
                    $("#CusServiceFooter").on("click", function () {
                        window.location.href = encodeURI(mBuyerGoToImSysURL_ShopWap);
                    });

                    $("#CusServiceFooter2").unbind();
                    //页脚下面的客服
                    $("#CusServiceFooter2").on("click", function () {
                        window.location.href = encodeURI(mBuyerGoToImSysURL_ShopWap);
                    });



                }


            }

        }
    });
}