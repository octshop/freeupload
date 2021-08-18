//==============O2O商品=================//

/**----------------定义公共变量----------------**/
//AjaxURL
var mAjaxUrl = "../O2oAjax/GoodsIndex";

var mBuyerUserID = ""; //买家UserID


/**----------------初始化--------------------**/
$(function () {


    //加载第二级商品类目, 主要用于手机端(分类显示页) 并SortNum排序
    loadGoodsTypeSecLevel("true", function () {

        //初始化 导航条
        initSliderNav();

        //加载主轮播图片
        loadAdvCarousel();

    });

    //加载图片列表广告
    loadAdvImgList()

    //数据分页查询 --猜你喜欢
    pageDataSearch();

});


/**----------------加载，横幅通栏广告  ，图片列表广告-------------------------**/

/**
 * 加载图片列表广告
 * */
function loadAdvImgList() {


    //构造POST参数
    var dataPOST = {
        "Type": "3", "AdvType": "AdvO2o", "AdvTitleType": "O2oGoodsIndex",
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
                $("#SectionContent").html(_xhtml);

                console.log(_xhtml);

            }
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


        if (_AdvImgList.AdvTitleNameIsShow == "false") {
            if (_AdvImgSubList != undefined) {

                if (_AdvImgSubList.length > 1) {

                    //列表栏目
                    _xhtml += " <div class=\"second-kill\">";

                    _xhtml += " <div class=\"second-kill-list\">";

                    //循环构造显示图片
                    if (_AdvImgSubList != undefined && _AdvImgSubList != null) {
                        for (var j = 0; j < _AdvImgSubList.length; j++) {
                            _xhtml += "<a href=\"" + _AdvImgSubList[j].AdvLinkA + "\" target=\"_blank\"><img src=\"//" + _AdvImgSubList[j].ImgURL + "\" /></a>";
                        }
                    }

                    _xhtml += " </div>";
                    _xhtml += " </div>";

                }
                else  //横幅广告
                {
                    _xhtml += "<div class=\"gg-bar\">";
                    _xhtml += "<a href=\"" + _AdvImgSubList[0].AdvLinkA + "\" target=\"_blank\">";
                    _xhtml += "    <img src=\"//" + _AdvImgSubList[0].ImgURL + "\" />";
                    _xhtml += "</a>";
                    _xhtml += "</div>";
                }

            }
        }
        else {
            //列表栏目
            _xhtml += " <div class=\"second-kill\">";

            if (_AdvImgList.AdvTitleNameIsShow == "true") {
                _xhtml += " <div class=\"second-kill-title\" onclick=\"window.open(\'" + _AdvImgList.AdvLinkA + "\')\">";
                _xhtml += "     <div>" + _AdvImgList.AdvTitleName + "</div>";
                _xhtml += "     <div class=\"second-kill-arrow\">" + _AdvImgList.AdvTitleNameSub + "</div>";
                _xhtml += " </div>";
            }

            _xhtml += " <div class=\"second-kill-list\">";

            //循环构造显示图片
            for (var j = 0; j < _AdvImgSubList.length; j++) {
                _xhtml += "<a href=\"" + _AdvImgSubList[j].AdvLinkA + "\" target=\"_blank\"><img src=\"//" + _AdvImgSubList[j].ImgURL + "\" /></a>";
            }

            _xhtml += " </div>";
            _xhtml += " </div>";
        }
    }
    return _xhtml;
}



/**------------------自定义函数------------------**/

/**
 * 加载第二级商品类目,主要用于手机端(分类显示页) 并SortNum排序
 * @param pIsEntity 是否实体店分类(false /true )
 * @param pCallBack 回调函数
 * */
function loadGoodsTypeSecLevel(pIsEntity = "", pCallBack) {
    //构造POST参数
    var dataPOST = {
        "Type": "1", "IsEntity": pIsEntity,
    };
    console.log(dataPOST);
    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: "../MallAjax/GoodsType?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("加载第二级商品类目=" + reTxt);
            if (reTxt != "") {
                var _jsonReTxt = JSON.parse(reTxt);

                var GooGoodsTypeSecLevelList = _jsonReTxt.GooGoodsTypeSecLevelList;

                //GooGoodsTypeSecLevelList.length = 12;

                //取数组的余数
                var yuIconNum = GooGoodsTypeSecLevelList.length % 10;
                console.log("yuIconNum=" + yuIconNum);
                //循环数
                var _forNum = GooGoodsTypeSecLevelList.length + (10 - yuIconNum);

                console.log("_forNum=" + _forNum);

                //循环构造显示代码
                var myJsVal = "";
                var _isLi = "";
                for (var i = 0; i < _forNum; i++) {

                    //这里重要，分栏导航构造
                    if (i % 10 == 0) {

                        if (_isLi == "") {
                            _isLi = "one";
                            myJsVal += "<li>";
                        }
                        else {
                            myJsVal += "</li><li>";
                            _isLi = "";
                        }
                    }

                    if (GooGoodsTypeSecLevelList[i] == undefined) {
                        myJsVal += "<a class=\"nav-item\" href=\"#\"> &nbsp; </a>";
                    }
                    else {
                        myJsVal += "<a class=\"nav-item\" href=\"../O2o/GoodsTypeO2o?GTIDSe=" + GooGoodsTypeSecLevelList[i].GoodsTypeID + "&GTL=Sec&GTNaSe=" + GooGoodsTypeSecLevelList[i].GoodsTypeName + "\">";
                        myJsVal += "<img src=\"//" + GooGoodsTypeSecLevelList[i].TypeIcon + "\" />";
                        myJsVal += "" + GooGoodsTypeSecLevelList[i].GoodsTypeName + "";
                        myJsVal += "</a>";
                    }

                }

                myJsVal += "</li>";

                console.log(myJsVal)

                //显示代码插入前台
                $("#content-slider-2").html(myJsVal);


                //回调函数
                pCallBack();
            }
        }
    });
}





/**-------------------公共函数---------------------**/


/**
 * 加载主轮播图片
 * */
function loadAdvCarousel() {


    //构造POST参数
    var dataPOST = {
        "Type": "1", "AdvOsTypeFix": "H5", "AdvType": "AdvO2o", "AdvTitleType": "O2oGoodsIndex",
    };
    console.log(dataPOST);
    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: "../MallAjax/Index?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log(" 加载主轮播图片=" + reTxt);
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
        "IsEntity": "true"
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




