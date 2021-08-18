//===========商城首页 O2o 附近===============//

/**------定义公共变量----**/

var mAjaxUrl = "../O2oAjax/Index";

var mBuyerUserID = ""; //买家UserID
var mSelCityRegionArrCookie = ""; //选择城市信息 “ 430000_430100 ^ 湖南省_长沙市 ”

/**------初始化------**/
$(function () {

    mBuyerUserID = $("#hidBuyerUserID").val().trim();
    mSelCityRegionArrCookie = $("#hidSelCityRegionArrCookie").val().trim();

    //加载用户选择城市区域,没登录时加载默认
    initSelCityRegion();

    ////栏目图标导航信息
    //loadListNavIconMsg(function () {
    //    //初始化 导航条
    //    initSliderNav();
    //});

    ////加载主轮播图片
    //loadAdvCarousel();

    ////加载图片列表广告
    //loadAdvImgList();

    ////加载推荐商家与商品信息 (首页显示)
    //loadRcdGoodsShop("Shop", function () {
    //    loadRcdGoodsShop("Goods", function () { });
    //});


});


/**
 * 栏目图标导航信息
 * */
function loadListNavIconMsg(pCallBack) {
    //构造POST参数
    var dataPOST = {
        "Type": "4", "NavType": "O2oIndex",
    };
    console.log(dataPOST);
    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: "../MallAjax/Index?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("栏目图标导航信息=" + reTxt);

            if (reTxt != "") {
                var _jsonReTxt = JSON.parse(reTxt);

                //构造导航图标列表显示代码
                $("#content-slider-2").html(xhtmlListNavIcon(_jsonReTxt));

                pCallBack();
            }

        }
    });
}

/**
 * 构造导航图标列表显示代码
 * @param {any} pJsonReTxtNavIcon
 */
function xhtmlListNavIcon(pJsonReTxtNavIcon) {

    var NavIconList = pJsonReTxtNavIcon.NavIconList;

    //当前导航索引
    var NavIndex = 0;

    var myJsVal = "";
    //循环构造显示代码
    for (var i = 0; i < NavIconList.length; i++) {

        NavIndex++;
        if (NavIndex == 1) {
            myJsVal += "<li>";
        }


        myJsVal += "<a class=\"nav-item\" href=\"" + NavIconList[i].LinkURL + "\">";
        myJsVal += "<img src=\"//" + NavIconList[i].IconUrl + "\" />" + NavIconList[i].NavName + "</a>";


        if (NavIndex == 10 || i == NavIconList.length - 1) {
            myJsVal += "</li>";
            //归零
            NavIndex = 0;
        }

    }

    console.log("显示代码=" + myJsVal);

    //返回显示代码
    return myJsVal;
}


/**----------------加载，横幅通栏广告  ，图片列表广告-------------------------**/

/**
 * 加载图片列表广告
 * */
function loadAdvImgList() {

    //构造POST参数
    var dataPOST = {
        "Type": "3", "AdvType": "AdvO2o", "AdvTitleType": "O2oIndex",
    };
    console.log(dataPOST);
    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: "../MallAjax/Index?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("加载图片列表广告=" + reTxt);
            if (reTxt != "") {
                var _jsonReTxt = JSON.parse(reTxt);

                //构造图片栏目列表显示代码
                var _xhtml = xhtmlAdvImgList(_jsonReTxt);
                $("#AdvO2oAdvImgList").html(_xhtml);

                console.log(_xhtml);

            }


            //加载推荐商家与商品信息 (首页显示)
            loadRcdGoodsShop("Shop", function () {
                loadRcdGoodsShop("Goods", function () { });
            });


        }
    });

}

/**
 * 构造图片栏目列表显示代码
 * @param {any} pJsonReTxtAdvImgList
 */
function xhtmlAdvImgList(pJsonReTxtAdvImgList) {

    //构造构造显示代码
    var _xhtml = "";
    for (var i = 0; i < pJsonReTxtAdvImgList.length; i++) {

        var _AdvImgList = pJsonReTxtAdvImgList[i];
        var _AdvImgSubList = _AdvImgList.AdvImgSubList;

        console.log("执行啦 .....");


        //横幅广告
        if (_AdvImgList.AdvTitleNameIsShow == "false") {
            if (_AdvImgSubList != undefined) {
                //_xhtml += "<div class=\"gg-bar\">";
                //_xhtml += "<a href=\"" + _AdvImgSubList[0].AdvLinkA + "\" target=\"_blank\">";
                //_xhtml += "    <img src=\"//" + _AdvImgSubList[0].ImgURL + "\" />";
                //_xhtml += "</a>";
                //_xhtml += "</div>";

                //循环构造显示图片
                for (var j = 0; j < _AdvImgSubList.length; j++) {

                    _xhtml += "<a class=\"gg-item\" href=\"" + _AdvImgSubList[j].AdvLinkA + "\" target=\"_blank\"><img src=\"//" + _AdvImgSubList[j].ImgURL + "\" /></a>";
                }

            }
        }
        else {
            //列表栏目
            //_xhtml += " <div class=\"second-kill\">";

            if (_AdvImgList.AdvTitleNameIsShow == "true") {
                //_xhtml += " <div class=\"second-kill-title\" onclick=\"window.open(\'" + _AdvImgList.AdvLinkA + "\')\">";
                //_xhtml += "     <div>" + _AdvImgList.AdvTitleName + "</div>";
                //_xhtml += "     <div class=\"second-kill-arrow\">" + _AdvImgList.AdvTitleNameSub + "</div>";
                //_xhtml += " </div>";
            }

            //_xhtml += " <div class=\"second-kill-list\">";



            ////循环构造显示图片
            //for (var j = 0; j < _AdvImgSubList.length; j++) {



            //    _xhtml += "<a class=\"gg-item\" href=\"" + _AdvImgSubList[j].AdvLinkA + "\" target=\"_blank\"><img src=\"//" + _AdvImgSubList[j].ImgURL + "\" /></a>";
            //}

            //_xhtml += " </div>";
            //_xhtml += " </div>";
        }
    }
    return _xhtml;
}

/**
 * 加载推荐商家与商品信息 (首页显示)
 * @param pRcdType 推荐类别 ( Shop店铺，Goods商品 )
 * */
function loadRcdGoodsShop(pRcdType, pCallBack) {

    var _loadNum = 6
    if (pRcdType == "Shop") {
        _loadNum = 8;
    }
    else if (pRcdType == "Goods") {
        _loadNum = 6;
    }

    //构造POST参数
    var dataPOST = {
        "Type": "3", "AdvType": "AdvO2o", "RcdType": pRcdType, "LoadNum": _loadNum
    };
    console.log(dataPOST);
    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: mAjaxUrl + "?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("加载推荐商家与商品信息=" + reTxt);

            if (reTxt != "" && reTxt.indexOf("{,,") < 0) {

                var _jsonReTxt = JSON.parse(reTxt);

                if (pRcdType == "Shop") {

                    var RcdGoodsShopList = _jsonReTxt.RcdGoodsShopList;
                    var ShopMsgList = _jsonReTxt.ShopMsgList;
                    var ExtraData = _jsonReTxt.ExtraData

                    var myJsVal = "";
                    for (var i = 0; i < RcdGoodsShopList.length; i++) {

                        //徽章
                        var _itemBage = "";
                        if (ShopMsgList[i].CountSecKill > 0) {
                            _itemBage += "<span>秒杀</span> "
                        }
                        if (ShopMsgList[i].CountDiscount > 0) {
                            _itemBage += "<span>打折</span> "
                        }
                        if (ShopMsgList[i].GroupMsgCount > 0) {
                            _itemBage += "<span>团购</span> "
                        }
                        if (ShopMsgList[i].CountActivity > 0) {
                            _itemBage += "<span>活动</span> "
                        }
                        if (ShopMsgList[i].CountLuckyDraw > 0) {
                            _itemBage += "<span>抽奖</span> "
                        }
                        if (ShopMsgList[i].CountPresent > 0) {
                            _itemBage += "<span>礼品</span> "
                        }

                        if (ExtraData[i].DistanceKm == undefined) {
                            ExtraData[i].DistanceKm = "";
                        }

                        myJsVal += " <a class=\"commend-item\" href=\"../Shop/Index?SID=" + RcdGoodsShopList[i].ShopID + "\">";
                        myJsVal += " <div class=\"commend-item-img\">";
                        myJsVal += "     <img src=\"//" + ShopMsgList[i].ShopHeaderImg + "\" />";
                        myJsVal += " </div>";
                        myJsVal += " <div class=\"commend-item-msg\">";
                        myJsVal += "     <div class=\"item-msg-title\">";
                        myJsVal += "         <span>" + ShopMsgList[i].ShopName + "</span>";
                        myJsVal += "         <span class=\"item-msg-distance\">" + ExtraData[i].DistanceKm + "km</span>";
                        myJsVal += "     </div>";
                        myJsVal += "     <div class=\"item-msg-appraise\">";
                        myJsVal += "         " + ExtraData[i].ShopAvgAppraiseScore + "分 | " + ShopMsgList[i].SumPaidCount + "人付款";
                        myJsVal += "     </div>";
                        myJsVal += "     <div class=\"item-msg-badge\">";
                        myJsVal += _itemBage;
                        myJsVal += "     </div>";
                        myJsVal += "     <div class=\"item-msg-price\">";
                        myJsVal += "         <span><b>&#165; " + ShopMsgList[i].ShopAllGoodsMinPrice + "</b> 起</span>";
                        myJsVal += "         <span class=\"item-msg-sale\">已售:" + ShopMsgList[i].SumPaidCount + "</span>";
                        myJsVal += "     </div>";
                        myJsVal += " </div>";
                        myJsVal += "</a>";
                    }
                    //显示代码插入前台
                    $("#CommendShopList").html(myJsVal);

                }
                else if (pRcdType == "Goods") { //推荐的商品

                    var RcdGoodsShopList = _jsonReTxt.RcdGoodsShopList;
                    var GoodsMsgList = _jsonReTxt.GoodsMsgList;
                    var ExtraData = _jsonReTxt.ExtraData

                    var myJsVal = "";
                    for (var i = 0; i < RcdGoodsShopList.length; i++) {

                        if (GoodsMsgList[i].GoodsTitle.length > 24) {
                            GoodsMsgList[i].GoodsTitle = GoodsMsgList[i].GoodsTitle.substring(0, 24) + "…";
                        }

                        myJsVal += "<div class=\"commend-goods-item\" onclick=\"window.location.href='../Goods/GoodsDetail?GID=" + RcdGoodsShopList[i].GoodsID + "'\">";
                        myJsVal += " <div class=\"commend-goods-img\">";
                        myJsVal += "     <img src=\"//" + GoodsMsgList[i].ImgPathCover + "\" />";
                        myJsVal += " </div>";
                        myJsVal += " <div class=\"commend-goods-name\">";
                        myJsVal += "" + GoodsMsgList[i].GoodsTitle + "";
                        myJsVal += " </div>";
                        myJsVal += " <div class=\"commend-goods-price\">";
                        myJsVal += "     <span>&#165;" + GoodsMsgList[i].GoodsPrice + "</span>";
                        myJsVal += "     <span class=\"commend-goods-del\">&#165;" + GoodsMsgList[i].MarketPrice + "</span>";
                        myJsVal += " </div>";
                        myJsVal += "</div>";
                    }
                    //显示代码插入前台
                    $("#CommendGoodsList").html(myJsVal);
                }

                pCallBack();
            }
        }
    });

}


/**------自定义函数------**/

/**
 * 加载用户选择城市区域,没登录时加载默认
 * */
function initSelCityRegion() {


    //构造POST参数
    var dataPOST = {
        "Type": "1", "BuyerUserID": mBuyerUserID,
    };
    console.log(dataPOST);
    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: mAjaxUrl + "?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("加载用户选择城市区域=" + reTxt);
            if (reTxt != "") {
                var _jsonReTxt = JSON.parse(reTxt);


                //设置显示城市名称
                if (_jsonReTxt.SelCityRegionNameArr.split("_")[1] == "市辖区") {
                    $("#MobileSelectCitySelRegion").html(_jsonReTxt.SelCityRegionNameArr.split("_")[0]);
                }
                else {
                    $("#MobileSelectCitySelRegion").html(_jsonReTxt.SelCityRegionNameArr.split("_")[1]);
                }


                //初始化城市选择器
                initMobileSelectCityAll("MobileSelectCitySelRegion", function (reSelData) {

                    //选择城市值后发生
                    console.log(reSelData);
                    if (reSelData[1].value == "市辖区") {
                        $("#MobileSelectCitySelRegion").html(reSelData[0].value);
                    }
                    else {
                        $("#MobileSelectCitySelRegion").html(reSelData[1].value);
                    }


                    //保存选择的 当前城市区域信息 
                    saveSelCityRegionCodeArr(reSelData[0].id + "_" + reSelData[1].id);


                }, _jsonReTxt.SelCityRegionCodeArr);

            }


            //栏目图标导航信息
            loadListNavIconMsg(function () {
                //初始化 导航条
                initSliderNav();

                //加载主轮播图片
                loadAdvCarousel();
            });






        }
    });
}

/**
 * 保存选择的 当前城市区域信息 
 * @param {any} pSelCityRegionCodeArr  省_市 区域代号 [ 430000_430100 ]
 */
function saveSelCityRegionCodeArr(pSelCityRegionCodeArr) {

    //构造POST参数
    var dataPOST = {
        "Type": "2", "SelCityRegionCodeArr": pSelCityRegionCodeArr,
    };
    console.log(dataPOST);
    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: mAjaxUrl + "?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("保存选择的 当前城市区域信息 =" + reTxt);
            if (reTxt != "") {

                //重新刷新页面
                window.location.reload();

            }
        }
    });

}

/**
 * 加载主轮播图片
 * */
function loadAdvCarousel() {


    //构造POST参数
    var dataPOST = {
        "Type": "1", "AdvOsTypeFix": "H5", "AdvType": "AdvO2o", "AdvTitleType": "O2oIndex",
    };
    console.log(dataPOST);
    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: "../MallAjax/Index?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("加载主轮播图片=" + reTxt);
            if (reTxt != "") {
                var _jsonReTxt = JSON.parse(reTxt);

                var AdvCarouselList = _jsonReTxt.AdvCarouselList;

                var myJsVal = "";
                for (var i = 0; i < AdvCarouselList.length; i++) {
                    myJsVal += "<li>";
                    myJsVal += " <a href=\"" + AdvCarouselList[i].AdvLinkA + "\" target=\"_blank\">";
                    myJsVal += "     <div class=\"img-slider img-slider-1\">";
                    myJsVal += "         <img src=\"//" + AdvCarouselList[i].ImgURL + "\" />";
                    myJsVal += "     </div>";
                    myJsVal += " </a>";
                    myJsVal += "</li>";
                }
                //显示代码插入前台
                $("#content-slider").html(myJsVal);

                //初始化 主轮播图片
                initSliderGoodsImg();
            }

            //加载图片列表广告
            loadAdvImgList();



        }
    });

}


//====================================================//

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

/**
 * 初始化 导航条
 * */
var _sliderNav = null;
function initSliderNav() {
    //导航条
    _sliderNav = $("#content-slider-2").lightSlider({
        speed: 500,  //过渡动画的持续时间，单位毫秒
        auto: false, //如果设置为true，幻灯片将自动播放
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
            //$("#SliderCountDiv").html(_curSliderNum + "/" + _totalSliderNum);
        },
        onAfterSlide: function (data) { //每一个slide过渡动画之后被执行
            //console.log(data);
            //console.log("当前Sidler索引：" + data.getCurrentSlideCount());
            //console.log("总的Slider数：" + data.getTotalSlideCount());
            var _curSliderNum = data.getCurrentSlideCount();
            var _totalSliderNum = data.getTotalSlideCount();
            //$("#SliderCountDiv").html(_curSliderNum + "/" + _totalSliderNum);
        }
    });
}
