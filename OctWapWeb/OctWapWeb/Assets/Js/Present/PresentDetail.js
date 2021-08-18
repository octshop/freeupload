//===========礼品详情==================//

/**---------定义公共变量-----------**/

//AjaxURL
var mAjaxUrl = "../PresentAjax/PresentDetail";

var mIsHttping = false; //记录是否正在发送Http请求

var mPID = ""; //礼品ID
var mBuyerUserID = ""; //买家UserID
var mShopUserID = ""; //商家UserID
var mShopID = ""; //店铺ID

//礼品标题
var mPresentTitle = "";

var mShopMsgObj = null; //店铺Json对象

var mGoodsImgListJson = null; //商品图片列表Json对象

/**------初始化------**/
$(function () {

    mPID = $("#hidPID").val().trim();
    mBuyerUserID = $("#hidBuyerUserID").val().trim();

    //初始化礼品详情
    initPresentMsg();

    //加载商品图片轮播的内容
    //loadSliderContent();


});

/**
 * 初始化礼品详情
 * */
function initPresentMsg() {

    //构造POST参数
    var dataPOST = {
        "Type": "1", "PID": mPID,
    };
    console.log(dataPOST);
    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: mAjaxUrl + "?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("初始化礼品详情=" + reTxt);
            if (reTxt != "") {
                var _jsonReTxt = JSON.parse(reTxt);

                mGoodsImgListJson = _jsonReTxt.PresentImgs;
                //店铺地址导航信息
                mShopMsgObj = _jsonReTxt.ShopMsg;

                var PresentMsgDetail = _jsonReTxt.PresentMsgDetail;
                mShopID = PresentMsgDetail.ShopID;
                mShopUserID = PresentMsgDetail.ShopUserID;

                mPresentTitle = PresentMsgDetail.PresentTitle;

                if (mGoodsImgListJson != "" && mGoodsImgListJson != null) {
                    //初始化滑动插件
                    initSlider();
                }

                //为显示表单赋值
                setValToForm(_jsonReTxt);



                //加载店铺条相关信息(前端) - 如: 商品详情页的店铺信息
                loadShopBarMsg();

            }
        }
    });
}

/**
 * 为显示表单赋值
 * @param {any} pInitJsonReTxt 初始化礼品返回的Json对象
 */
function setValToForm(pInitJsonReTxt) {

    var PresentMsgDetail = pInitJsonReTxt.PresentMsgDetail;
    var PresentExtra = pInitJsonReTxt.PresentExtra;
    var ShopMsg = pInitJsonReTxt.ShopMsg;

    $("#IntegralPriceLowB").html("积分:" + formatNumberDotDigit(PresentMsgDetail.PresentPrice, 2));
    $("#SurplusTxtB").html("剩余:" + PresentMsgDetail.StockNum);
    $("#PresentTitle").html(PresentMsgDetail.PresentTitle);

    $("#PageTitle").html(PresentMsgDetail.PresentTitle + "-礼品详情");

    if (ShopMsg.IsEntity == "true") {
        $("#IsEntitySpan").show();
    }

    if (PresentMsgDetail.IsShopExpense == "both") {
        //$("#IsShopExpenseSpan").html("到店或快递物流");
    }
    else if (PresentMsgDetail.IsShopExpense == "true") {
        //$("#IsShopExpenseSpan").html("到店消费或自取");

        $("#ShopAddrNav").show();
        $("#ExpressFreight").hide();

    }
    else if (PresentMsgDetail.IsShopExpense == "false") {
        //$("#IsShopExpenseSpan").html("快递物流发货");
    }

    $("#ExchangeNote").html(PresentMsgDetail.ExchangeNote);

    //加载商品额外数据 如收货地址,店铺地址等
    initExtraGoodsMsg(PresentMsgDetail.IsShopExpense);

    //是否包邮
    if (PresentMsgDetail.IsPinkage == "true") {
        $("#FreightMoneyB").html("包邮-免运费");
    }
    else {
        $("#FreightMoneyB").html("不包邮-买家付运费");
    }

    //初始化配送方式 选择 
    initExpressTypeSel(PresentMsgDetail.IsShopExpense);
}

/**
 * 初始化配送方式 选择 
 * @param {any} pIsShopExpense 是否支持 【到店消费 或者 快递，到店都支持】 (true , false , both)
 */
function initExpressTypeSel(pIsShopExpense) {

    if (pIsShopExpense == "both") {
        var myJsVal = "<span class=\"express-type-current\" id=\"ExpressType_1\" onclick=\"chgExpressType('express')\">送货上门(快递)</span> <span id=\"ExpressType_2\" onclick=\"chgExpressType('shop')\">到店消费/自取</span>";        $("#ExpressTypeRight").html(myJsVal);        //,配送方式（送货上门 express 到店消费自取 shop）        $("#hidExpressType").val("express");
    }
    else if (pIsShopExpense == "true") {
        var myJsVal = "<span class=\"express-type-current\">到店消费/自取</span>";        $("#ExpressTypeRight").html(myJsVal);

        $("#hidExpressType").val("shop");
    }
    else if (pIsShopExpense == "false") {
        var myJsVal = "<span class=\"express-type-current\">送货上门(快递)</span>";        $("#ExpressTypeRight").html(myJsVal);

        $("#hidExpressType").val("express");
    }

}

/**
 * 选择当前的配送方式
 * @param {any} pExpressType  配送方式（送货上门 express 到店消费自取 shop）
 */
function chgExpressType(pExpressType) {

    //移除当前选择
    $("#ExpressType_1").removeClass("express-type-current");
    $("#ExpressType_2").removeClass("express-type-current");

    if (pExpressType == "express") {
        $("#ExpressType_1").addClass("express-type-current");
        $("#ExpressFreight").show();
        $("#ShopAddrNav").hide();
    }
    else if (pExpressType == "shop") {
        $("#ExpressType_2").addClass("express-type-current");
        $("#ExpressFreight").hide();
        $("#ShopAddrNav").show();
    }

    $("#hidExpressType").val(pExpressType);

}


/**
 * 加载商品额外数据 如收货地址,店铺地址等
 * @pIsShopExpense 是否支付到店消费
 * */
function initExtraGoodsMsg(pIsShopExpense) {

    //----加载店铺地址
    if (pIsShopExpense == "true") {

        $("#ExpressFreight").hide();
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
    else {  //----加载收货地址

        $("#ExpressFreight").show();
        $("#ShopAddrNav").hide();

        if ($("#hidBuyerReceiAddrSelCookieArr").val().trim() != "") {

            var hidBuyerReceiAddrSelCookieArr = $("#hidBuyerReceiAddrSelCookieArr").val().trim();
            if (hidBuyerReceiAddrSelCookieArr != "" && hidBuyerReceiAddrSelCookieArr != undefined && hidBuyerReceiAddrSelCookieArr != null) {

                $("#ExpressAddressDiv").html(hidBuyerReceiAddrSelCookieArr.split('^')[2]);

                return;
            }
        }

        //构造POST参数
        var dataPOST = {
            "Type": "4", "GoodsID": "0",
        };
        console.log(dataPOST);
        //正式发送异步请求
        $.ajax({
            type: "POST",
            url: "../GoodsAjax/GoodsDetail?rnd=" + Math.random(),
            data: dataPOST,
            dataType: "html",
            success: function (reTxt, status, xhr) {
                console.log("收货地址=" + reTxt);
                if (reTxt != "") {
                    var _jsonReTxt = JSON.parse(reTxt);

                    //收货地址显示
                    if (_jsonReTxt.ReceiAddrRegion.RegionNameArr != undefined) {

                        //选择收货地址Cookie =  BReceiAddrID ^ 430000_430100_430121 ^ 湖南省_长沙市_长沙县
                        //赋值给隐藏记录控件
                        $("#hidBuyerReceiAddrSelCookieArr").val(_jsonReTxt.ReceiAddrRegion.BReceiAddrID + "^" + _jsonReTxt.ReceiAddrRegion.RegionCodeArr + "^" + _jsonReTxt.ReceiAddrRegion.RegionNameArr);



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


//================轮播相关=====================//

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
 * 初始化主轮播图的Html代码
 * @param {any} pInsertHtml 临时插入的Html代码
 */
function initSliderHtml(pInsertHtml) {
    var myJsVal = "";
    myJsVal += " <ul id=\"content-slider\" class=\"content-slider\">";
    myJsVal += pInsertHtml

    for (var i = 0; i < mGoodsImgListJson.length; i++) {

        //获取图片URL中的 域名和图片相对路径  
        var _domainAndImgPathArr = getImgURLDomainAndImgPathArr(mGoodsImgListJson[i].ImgURL).split("^");

        myJsVal += "<li>";
        myJsVal += "    <a href=\"javascript:void(0)\" target=\"_blank\">";
        myJsVal += "        <div class=\"img-slider img-slider-" + (i + 1) + "\"><img src=\"//" + _domainAndImgPathArr[0] + "/ToolWeb/ShowImgScale.aspx?FilePathFrom=" + _domainAndImgPathArr[1] + "&LimitWidthNum=800&LimitHeightNum=800\" /></div>";
        myJsVal += "    </a>";
        myJsVal += "</li>";
    }

    myJsVal += "</ul>";
    return myJsVal;
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

                    return;
                }
            }
        }
    });

}


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

//=====================提交礼品订单信息===================//

/**
 * 提交礼品订单信息
 * */
function submitPresentOrder() {

    //判断买家是否登录 
    if (isBuyerLogin() == false) {
        return;
    }

    confirmWinWidth("确定要兑换吗？", function () {



        //获取表单值
        var hidPID = $("#hidPID").val().trim();
        var hidExpressType = $("#hidExpressType").val().trim();


        //构造POST参数
        var dataPOST = {
            "Type": "1", "PresentID": hidPID, "ExpressType": hidExpressType,
        };
        console.log(dataPOST);

        if (mIsHttping == true) {
            return;
        }
        mIsHttping = true;
        $("#BtnOrder").html("…兑换中…");

        //正式发送异步请求
        $.ajax({
            type: "POST",
            url: "../PresentAjax/PresentOrder?rnd=" + Math.random(),
            data: dataPOST,
            dataType: "html",
            success: function (reTxt, status, xhr) {
                console.log(reTxt);

                //mIsHttping = false;
                //$("#BtnOrder").html("立即兑换");

                if (reTxt != "") {

                    if (reTxt == "12") {

                        mIsHttping = false;
                        $("#BtnOrder").html("立即兑换");

                        toastWinCb("请选择收货地址", function () {

                            openSelReceiAddrWin();

                        });
                        return;
                    }
                    var _jsonReTxt = JSON.parse(reTxt);

                    //错误信息
                    if (_jsonReTxt.ErrMsg != "" && _jsonReTxt.ErrMsg != null && _jsonReTxt.ErrMsg != undefined) {
                        toastWin(_jsonReTxt.ErrMsg);

                        mIsHttping = false;
                        $("#BtnOrder").html("立即兑换");

                        return;
                    }

                    //礼品下单成功
                    if (_jsonReTxt.Msg != "" && _jsonReTxt.Msg != null && _jsonReTxt.Msg != undefined) {

                        toastWinCb(_jsonReTxt.Msg, function () {

                            //跳转到礼品订单详情
                            window.location.href = "../PresentOrder/PresentOrderDetail?POID=" + _jsonReTxt.DataDic.PstOrderID;

                        });
                        return;

                    }
                }
                else {

                }

            }
        });


    }, 300);


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

                $("#ShopHeaderImgDiv").html("<a href=\"javascript:void(0)\"><img src=\"//" + ShopMsg.ShopHeaderImg + "\" /></a>");

                //------店铺名称区----//
                var ShopLabelArr = splitStringJoinChar(ShopMsg.ShopLabelArr);

                var myJsValName = "";
                myJsValName += " <a href=\"javascript:void(0)\">" + ShopMsg.ShopName + "</a>";

                for (var m = 0; m < ShopLabelArr.length; m++) {
                    myJsValName += "<span class=\"shop-label\">" + ShopLabelArr[m] + "</span>";
                }

                myJsValName += "<span class=\"shop-arrow\">&nbsp;</span>";
                $("#ShopNameDiv").html(myJsValName);

                //店铺评价
                $("#ShopAppraiseDiv").html("综合: <b>" + ShopAppScoreList.ShopScoreAvg + "</b>物流: <b>" + ShopAppScoreList.ExpressScoreAvg + "</b>商品: <b>" + ShopAppScoreList.ConformityScoreAvg + "</b>服务: <b>" + ShopAppScoreList.AttitudeScoreAvg + "</b>配送: <b>" + ShopAppScoreList.DeliverymanScoreAvg + "</b>");

                $("#FavAttenB").html(ShopFavCount);

                $("#ShopMsgNameTitleDiv").on("click", function () {
                    window.location.href = "../Shop/index?SID=" + ShopMsg.ShopID;
                });

                $("#MajorGoodsDiv").html(ShopMsg.MajorGoods);
                $("#MajorGoodsDiv").css("padding-bottom", "8px");

                //商品预览列表
                var myJsValPreGoods = "";
                for (var k = 0; k < PreListGoodsMsg.length; k++) {

                    if (PreListGoodsMsg[k].GoodsTitle.length > 5) {
                        PreListGoodsMsg[k].GoodsTitle = PreListGoodsMsg[k].GoodsTitle.substring(0, 5)
                    }

                    myJsValPreGoods += "<li><a href=\"../Goods/GoodsDetail?GID=" + PreListGoodsMsg[k].GoodsID + "\">";
                    myJsValPreGoods += "<img src=\"//" + PreListGoodsMsg[k].CoverImgPath + "\" /><br />";
                    myJsValPreGoods += "" + PreListGoodsMsg[k].GoodsTitle + "";
                    myJsValPreGoods += "</a></li>";
                }
                $("#PreListGoodsMsgUl").html(myJsValPreGoods);

                //客服，进店
                $("#CusServiceA").attr("href", "tel:" + ShopMsg.ShopMobile);
                $("#GoShopA").attr("href", "../Shop/index?SID=" + ShopMsg.ShopID);

                //构建商家店铺咨询进入IM在线客服系统 跳转 URL
                buildBuyerGoToImSysURL_ShopWap(ShopMsg.UserID, mBuyerUserID);

                //页脚下面的客服，店铺链接
                $("#CusServiceAFooter").attr("href", "tel:" + ShopMsg.ShopMobile);
                $("#GoShopAFooter").attr("href", "../Shop/index?SID=" + ShopMsg.ShopID);

                //构建【商品】咨询进入IM在线客服系统 跳转 URL
                buildBuyerGoToImSysURL_GoodsWap(mPID, mBuyerUserID);

            }
            else {
                $("#ShopMsgBar").hide();
            }
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
function buildBuyerGoToImSysURL_GoodsWap(pPresentID, pBuyerUserID) {

    if (mPresentTitle.length > 18) {
        mPresentTitle = mPresentTitle.substring(0, 18);
    }

    mPresentTitle += "-礼品"; //这里必须带礼品二字，这样就加载礼品信息

    //构造POST参数
    var dataPOST = {
        "Type": "2", "GoodsID": pPresentID, "BuyerUserID": pBuyerUserID, "VisitorMemo": mPresentTitle,
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
                    $("#CusServiceAFooter").attr("href", encodeURI(mBuyerGoToImSysURL_GoodsWap));


                }
            }
        }
    });
}





