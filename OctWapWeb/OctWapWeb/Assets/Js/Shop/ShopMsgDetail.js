//==================店铺信息详情================//

/**------定义公共变量----**/

//AjaxURL
var mAjaxUrl = "../ShopAjax/ShopMsgDetail";

var mShopID = ""; //店铺ID
var mBuyerUserID = ""; //买家UserID

var mhidOctShopSystemWeb_AddrDomain = "";

/**------初始化------**/
$(function () {

    mShopID = $("#hidShopID").val().trim();
    mBuyerUserID = $("#hidBuyerUserID").val().trim();

    mhidOctShopSystemWeb_AddrDomain = $("#hidOctShopSystemWeb_AddrDomain").val().trim();


    //加载店铺详细信息
    loadShopDetailMsg();

    //加载店铺Logo门头照片
    loadShopLogoImg();

});


/*******************自定义函数************************ */

/**
 * 加载店铺详细信息
 * */
function loadShopDetailMsg() {

    //构造POST参数
    var dataPOST = {
        "Type": "1", "ShopID": mShopID,
    };

    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: mAjaxUrl + "?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("加载店铺详细信息=" + reTxt);
            if (reTxt != "") {
                var _jsonReTxt = JSON.parse(reTxt);

                var ShopMsg = _jsonReTxt.ShopMsg;
                var ShopAppraise = _jsonReTxt.ShopAppraise;

                //是否显示商家中/管理店铺按钮
                if (mBuyerUserID == ShopMsg.UserID) {
                    $("#ShopCenterDiv").show();
                    $("#ShopCenterA").attr("href", mhidOctShopSystemWeb_AddrDomain + "/WapPage/Index");
                }

                $("#ShopNameVal").html(ShopMsg.ShopName);
                $("#ShopHeaderImgVal").attr("src", "//" + ShopMsg.ShopHeaderImg);
                $("#FansCountVal").html(_jsonReTxt.FansCount);
                //星星显示代码
                var _starAppraiseHtml = getStarAppraiseHtml(ShopAppraise.AvgShopScore);
                $("#ShopAppraiseVal").html(_starAppraiseHtml);
                $("#AvgShopScoreVal").html(ShopAppraise.AvgShopScore + "分 ");
                $("#AvgShopScoreB").html(ShopAppraise.AvgShopScore + "分 ")


                //星星显示代码
                var _starAvgConformityScoreHtml = getStarAppraiseHtml(ShopAppraise.AvgConformityScore);
                $("#AvgConformityScoreImg").html(_starAvgConformityScoreHtml);
                $("#AvgConformityScoreSpan").html(ShopAppraise.AvgConformityScore + "分 ");

                var _starAvgAttitudeScoreHtml = getStarAppraiseHtml(ShopAppraise.AvgAttitudeScore);
                $("#AvgAttitudeScoreImg").html(_starAvgAttitudeScoreHtml);
                $("#AvgAttitudeScoreSpan").html(ShopAppraise.AvgAttitudeScore + "分 ");

                var _starAvgExpressScoreHtml = getStarAppraiseHtml(ShopAppraise.AvgExpressScore);
                $("#AvgExpressScoreImg").html(_starAvgExpressScoreHtml);
                $("#AvgExpressScoreSpan").html(ShopAppraise.AvgExpressScore + "分 ");

                var _starAvgDeliverymanScoreHtml = getStarAppraiseHtml(ShopAppraise.AvgDeliverymanScore);
                $("#AvgDeliverymanScoreImg").html(_starAvgDeliverymanScoreHtml);
                $("#AvgDeliverymanScoreSpan").html(ShopAppraise.AvgDeliverymanScore + "分 ");

                $("#IsEntityVal").html("线上店");
                if (ShopMsg.IsEntity == "true") {
                    $("#IsEntityVal").html("有实体店");
                }

                $("#ShopNameVal2").html(ShopMsg.ShopName);
                $("#ShopMobileA").attr("href", "tel:" + ShopMsg.ShopMobile);
                $("#ShopMobileA").html(ShopMsg.ShopMobile);
                $("#RegionNameArrVal").html(ShopMsg.RegionNameArr);

                $("#IsNormalCompanyVal").html("官方审核中");
                if (_jsonReTxt.IsNormalCompany == true) {
                    $("#IsNormalCompanyVal").html("已通过官方审核");
                }
                $("#WriteDateVal").html(ShopMsg.WriteDate);
                $("#MajorGoodsVal").html(ShopMsg.MajorGoods);
                $("#ShopDescVal").html(ShopMsg.ShopDesc);

            }
        }
    });
}

/**
 * 加载店铺Logo门头照片
 * */
function loadShopLogoImg() {

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
            console.log("加载店铺Logo门头照片=" + reTxt);
            if (reTxt != "") {
                var _jsonReTxt = JSON.parse(reTxt);

                $("#OctSlider").show();

                var ShopLogoImgList = _jsonReTxt.ShopLogoImgList;
                var myJsVal = "";
                for (var i = 0; i < ShopLogoImgList.length; i++) {
                    myJsVal += "<li onclick=\"openPhotoSwipe(1)\">";
                    myJsVal += " <a href=\"javascript:void(0)\">";
                    myJsVal += "     <div class=\"img-slider img-slider-1\">";
                    myJsVal += "         <img class=\"browse-win-img-label\" src=\"//" + ShopLogoImgList[i].ImgURL + "\" />";
                    myJsVal += "     </div>";
                    myJsVal += " </a>";
                    myJsVal += "</li>";
                }
                //显示代码插入前台
                $("#content-slider").html(myJsVal);


                //初始化 主轮播图片
                initSliderGoodsImg();

                //初始化PhotoSwipe的数据
                initPhotoSwipeData();

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


//=======================公共函数区=========================//


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




//===================浏览图片模式窗口=========================//


var mPhotoSwipeDataList = null; //PhotoSwipe的数据列表

/**
 * 初始化PhotoSwipe的数据
 * */
function initPhotoSwipeData() {

    //获取图片标签的类
    var _browseImgLabelArr = $(".browse-win-img-label");
    //console.log($(_appraiseImgLabelArr[0]).attr("src"));

    mPhotoSwipeDataList = [];

    for (var i = 0; i < _browseImgLabelArr.length; i++) {


        mPhotoSwipeDataList[i] = {
            src: $(_browseImgLabelArr[i]).attr("src"),
            title: '<div style=\"font-size: 20px;\"></span>',
            w: 0,
            h: 0
        };

    }
    console.log(mPhotoSwipeDataList);
}

/**
 * 打开晒单图片浏览
 * @param {any} pImgIndex
 */
function openPhotoSwipe(pImgIndex) {

    console.log("pImgIndex=" + pImgIndex);

    if (mPhotoSwipeDataList == null) {
        return
    }

    //初始化 PhotoSwipe 相册浏览   -- $(function(){  在这里调用，必须是加载完成所有文件 });
    initPhotoSwipeAlbum(mPhotoSwipeDataList, pImgIndex);
}