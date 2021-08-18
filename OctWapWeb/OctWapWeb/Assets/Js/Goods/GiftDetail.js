//===========赠品详情==================//

/**---------定义公共变量-----------**/

//AjaxURL
var mAjaxUrl = "../GoodsAjax/GiftDetail";

var mGIID = ""; //赠品ID

var mGoodsImgListJson = null; //商品图片列表Json对象

var mShopUserID = "";

var mBuyerUserID = "";

/**------初始化------**/
$(function () {

    mGIID = $("#hidGIID").val().trim();

    mBuyerUserID = $("#hidBuyerUserID").val().trim();

    //初始化赠品信息
    initGooGiftMsg();

});

/**
 * 初始化赠品信息
 * */
function initGooGiftMsg() {

    //构造POST参数
    var dataPOST = {
        "Type": "1", "GIID": mGIID,
    };
    console.log(dataPOST);
    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: mAjaxUrl + "?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("初始化赠品详情=" + reTxt);
            if (reTxt != "") {
                var _jsonReTxt = JSON.parse(reTxt);

                var GooGiftMsg = _jsonReTxt.GooGiftMsg;
                var GooGiftImgList = _jsonReTxt.GooGiftImgList;

                $("#IntegralPriceLowB").html("&#165;" + formatNumberDotDigit(GooGiftMsg.GiftPrice, 2));
                $("#SurplusTxtB").html("剩余:" + GooGiftMsg.StockNum);
                $("#PresentTitle").html(GooGiftMsg.GiftName);

                $("#PageTitle").html(GooGiftMsg.GiftName + "-赠品详情");

                //商品图片列表Json对象
                mGoodsImgListJson = GooGiftImgList;

                if (mGoodsImgListJson != "" && mGoodsImgListJson != null) {
                    //初始化滑动插件
                    initSlider();
                }


                //加载店铺条相关信息(前端) - 如: 商品详情页的店铺信息
                mShopUserID = GooGiftMsg.ShopUserID
                loadShopBarMsg();
            }
        }
    });

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

/**
 * ---------加载店铺条相关信息(前端) - 如:商品详情页的店铺信息-----------
 * */
function loadShopBarMsg() {

    //构造POST参数
    var dataPOST = {
        "Type": "2", "ShopID": "0", "ShopUserID": mShopUserID, "IsLoadGoods": "true",
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

