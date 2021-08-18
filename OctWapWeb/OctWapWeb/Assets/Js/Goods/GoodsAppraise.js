﻿//=================商品评价========================//

/**---------定义公共变量-----------**/

//AjaxURL
var mAjaxUrl = "../GoodsAjax/GoodsAppraise";

var mGID = ""; //商品ID

var mSearchTxt = "0"; //搜索的内容

var mAppraiseImgIndex = 0; //晒单图片的索引
var mPhotoSwipeDataList = null; //PhotoSwipe的数据列表

/**------初始化------**/
$(function () {

    mGID = $("#hidGoodsID").val().trim();

    //统计商品评价信息
    countAppraiseMsg();

    //初始化分页滚动对象
    initPageMescroll();

});


//===============================数据分页===============================//

var mIsRefresh = true; //是否为刷新
var mescroll;
var mPageSize = 15; //每页的数据条数

/**
 * 加载网络数据
 * @param {any} pageNum
 * @param {any} pageSize
 * @param {any} successCallback
 * @param {any} errorCallback
 */
function getListDataFromNet(pageNum, pageSize, successCallback, errorCallback) {

    //获取搜索条件
    //var SearchTxtArr = "";

    //构造GET参数
    var dataPOST = {
        "Type": "1",
        "PageCurrent": pageNum,
        "GoodsID": mGID,
        "SearchTxt": mSearchTxt // 0 全部，1 好评，2中评，3差评,4有图
    };
    //正式发送GET请求
    $.ajax({
        type: "POST",
        url: mAjaxUrl + "?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("数据分页=" + reTxt);
            if (reTxt != "") {
                //转换为Json对象
                var jsonObj = JSON.parse(reTxt);
                //console.log(jsonObj);

                //联网成功的回调 并传值，传Json对象
                successCallback && successCallback(jsonObj);
                //特别注意返回的Json数据中必须要有 JsonObj.DataPage.length, JsonObj.PageSum
                return;
            }
            else {
                if (pageNum == 1) {
                    document.getElementById("PageContentList").innerHTML = "";
                }
            }

            successCallback && successCallback(null);
        },
        error: function (xhr, errorTxt, status) {

            console.log("异步请求错误，errorTxt=" + errorTxt + " | status=" + status);

            //联网失败的回调
            errorCallback && errorCallback();

            return;
        }
    });
}

/**
 * 构造显示代码
 * @param {any} curPageDataJson 返回的Json分页对象
 */
function pageSuccess(curPageDataJson) {

    var dataPageArr = curPageDataJson.DataPage;
    var dataPageExtraArr = curPageDataJson.DataPageExtra;


    //显示代码插入前台
    if (mIsRefresh == false) {

    }
    else {
        mAppraiseImgIndex = 0;
    }

    //前台显示代码
    var myJsVal = "";
    //for (var i = 0; i < dataPageArr.length; i++) {

    //    var dataPage = dataPageArr[i];
    //    var dataPageExtra = dataPageExtraArr[i];



    //}

    //构造商品评价显示代码
    myJsVal = xhtmlItemGoodsAppraiseImg(curPageDataJson);


    //显示代码插入前台
    if (mIsRefresh == false) {
        document.getElementById("PageContentList").innerHTML += myJsVal;
    }
    else {
        document.getElementById("PageContentList").innerHTML = myJsVal;
    }
    mIsRefresh = false;


    //初始化PhotoSwipe的数据
    initPhotoSwipeData();

}


/**
 * 构造商品评价显示代码
 * @param {any} pGooAppraiseJsonReTxt 返回的评价信息Json对象
 */
function xhtmlItemGoodsAppraiseImg(pGooAppraiseJsonReTxt) {


    var myJsVal = "";
            GooAppraise.HeaderImg = "../Assets/Imgs/Icon/buyer_group.png";
        }
        }
            _xhtmlAppraiseImg += "<img class=\"appraise-img-label\" style=\"width: 80px; height:80px; margin-right: 8px;\" src=\"//" + GooAppraiseImg.ImgUrl + "\" onclick=\"openPhotoSwipe(" + mAppraiseImgIndex + ")\" />";

            //索引
            mAppraiseImgIndex++;

        }
}

/**
 * 星星评分函数 返回星星显示代码
 * @param {any} pAppraiseScore 评价分数
 */
function appraiseScoreStar(pAppraiseScore) {


    //console.log("pAppraiseScore=" + pAppraiseScore + " | pAppraiseIndex=" + pAppraiseIndex);

    //构造评分Img
    var _imgScoreHtml = "";

    if (pAppraiseScore == "1") {
        _imgScoreHtml += "<img src=\"../Assets/Imgs/Icon/appraise_star.png\" />";
    }
    else if (pAppraiseScore == "2") {
        _imgScoreHtml += "<img src=\"../Assets/Imgs/Icon/appraise_star.png\" />";
        _imgScoreHtml += "<img src=\"../Assets/Imgs/Icon/appraise_star.png\" />";
    }
    else if (pAppraiseScore == "3") {
        _imgScoreHtml += "<img src=\"../Assets/Imgs/Icon/appraise_star.png\" />";
        _imgScoreHtml += "<img src=\"../Assets/Imgs/Icon/appraise_star.png\" />";
        _imgScoreHtml += "<img src=\"../Assets/Imgs/Icon/appraise_star.png\" />";
    }
    else if (pAppraiseScore == "4") {
        _imgScoreHtml += "<img src=\"../Assets/Imgs/Icon/appraise_star.png\" />";
        _imgScoreHtml += "<img src=\"../Assets/Imgs/Icon/appraise_star.png\" />";
        _imgScoreHtml += "<img src=\"../Assets/Imgs/Icon/appraise_star.png\" />";
        _imgScoreHtml += "<img src=\"../Assets/Imgs/Icon/appraise_star.png\" />";
    }
    else if (pAppraiseScore == "5") {
        _imgScoreHtml += "<img src=\"../Assets/Imgs/Icon/appraise_star.png\" />";
        _imgScoreHtml += "<img src=\"../Assets/Imgs/Icon/appraise_star.png\" />";
        _imgScoreHtml += "<img src=\"../Assets/Imgs/Icon/appraise_star.png\" />";
        _imgScoreHtml += "<img src=\"../Assets/Imgs/Icon/appraise_star.png\" />";
        _imgScoreHtml += "<img src=\"../Assets/Imgs/Icon/appraise_star.png\" />";
    }

    for (var i = 0; i < 5 - parseInt(pAppraiseScore); i++) {

        var _appraiseScore = parseInt(pAppraiseScore) + i + 1;

        _imgScoreHtml += "<img src=\"../Assets/Imgs/Icon/appraise_star_gray.png\" />";
    }

    return _imgScoreHtml;
}




/**
 * 初始化分页滚动对象
 * */
function initPageMescroll() {

    mescroll = null;
    mIsRefresh = true; //刷新

    //-------处理分页加载的代码 初始化必须是这样--------//
    //创建MeScroll对象
    mescroll = new MeScroll("mescroll", {
        down: {
            auto: false, //是否在初始化完毕之后自动执行下拉回调callback; 默认true
            callback: downCallback //下拉刷新的回调
        },
        up: {
            auto: true, //是否在初始化时以上拉加载的方式自动加载第一页数据; 默认false
            isBounce: false, //此处禁止ios回弹,解析(务必认真阅读,特别是最后一点): http://www.mescroll.com/qa.html#q10
            callback: upCallback, //上拉回调,此处可简写; 相当于 callback: function (page) { upCallback(page); }
            page: {
                num: 0, //当前页码,默认0,回调之前会加1,即callback(page)会从1开始
                size: mPageSize, //每页数据的数量
                time: null //加载第一页数据服务器返回的时间; 防止用户翻页时,后台新增了数据从而导致下一页数据重复;
            },
            htmlNodata: '<p class="upwarp-nodata">-- END --</p>',
            toTop: { //配置回到顶部按钮
                src: "../Assets/Lib/mescroll/mescroll-totop.png", //默认滚动到1000px显示,可配置offset修改
                //offset : 1000
            }
        }
    });
}

/*下拉刷新的回调 */
function downCallback(pageDown) {

    //为下拉刷新
    mIsRefresh = true;

    //重新设置当前分页
    mescroll.options.up.page.num = 1;
    //这里hasNext必须设置为true 否则下拉刷新后，上拉加载就失效了。
    mescroll.options.up.hasNext = true;

    //mescroll会根据传的参数,自动判断列表如果无任何数据,则提示空;列表无下一页数据,则提示无更多数据;
    //console.log("下拉刷新的回调 pageDown.optUp.page.num=" + pageDown.optUp.page.num + ", pageDown.optUp.page.size=" + pageDown.optUp.page.size);


    //联网加载数据
    getListDataFromNet(pageDown.optUp.page.num, pageDown.optUp.page.size, function (curPageData) {

        //联网成功的回调,隐藏下拉刷新的状态
        mescroll.endSuccess();

        //------这里是操作前台显示代码-----//
        if (curPageData != null && curPageData != undefined && curPageData != "") {
            pageSuccess(curPageData);
        }


    }, function () {
        //联网失败的回调,隐藏下拉刷新的状态
        mescroll.endErr();
    });
}

/*上拉加载的回调 page = {num:1, size:10}; num:当前页 从1开始, size:每页数据条数 */
function upCallback(page) {

    //console.log("执行了upCallback(page) 上拉加载的回调");

    //联网加载数据
    getListDataFromNet(page.num, page.size, function (curPageData) {

        //console.log(curPageData);
        if (curPageData == null || curPageData == undefined && curPageData != "") {
            //没有下一页
            mescroll.options.up.hasNext = false;
            //联网失败的回调,隐藏下拉刷新和上拉加载的状态;
            mescroll.endErr();
            return;
        }
        //联网成功的回调,隐藏下拉刷新和上拉加载的状态;
        //mescroll会根据传的参数,自动判断列表如果无任何数据,则提示空;列表无下一页数据,则提示无更多数据;
        //console.log("上拉加载的回调 page.num=" + page.num + ", page.size=" + page.size + ", curPageData.length=" + curPageData.DataPage.length);

        //方法一(推荐): 后台接口有返回列表的总页数 totalPage
        mescroll.endByPage(curPageData.DataPage.length, curPageData.PageSum); //必传参数(当前页的数据个数, 总页数)

        //------这里是操作前台显示代码-----//
        pageSuccess(curPageData);


    }, function () {
        //联网失败的回调,隐藏下拉刷新和上拉加载的状态;
        mescroll.endErr();
    });
}

//===============================数据分页===============================//

/**
 * 统计商品评价信息
 * */
function countAppraiseMsg() {
    //构造POST参数
    var dataPOST = {
        "Type": "2", "GoodsID": mGID,
    };

    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: mAjaxUrl + "?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("统计商品评价信息=" + reTxt);
            if (reTxt != "") {

                var _jsonReTxt = JSON.parse(reTxt);

                $("#CountAppraiseB").html(_jsonReTxt.CountAppraise);
                $("#GoodAppraisePercentB").html(parseInt(_jsonReTxt.GoodAppraisePercent * 100) + "%");
                $("#CountAppraiseB2").html(_jsonReTxt.CountAppraise);
                $("#CountGoodsAppraiseB").html(_jsonReTxt.CountGoodsAppraise);
                $("#CountMidAppraiseB").html(_jsonReTxt.CountMidAppraise);
                $("#CountBadAppraiseB").html(_jsonReTxt.CountBadAppraise);
                $("#CountAppraiseImgsB").html(_jsonReTxt.CountAppraiseImgs);

            }
        }
    });
}

/**
 * 切换评价选项卡
 * @param {any} pTabNum 选项卡索引 从0开始
 */
function chgTabAppraise(pTabNum) {

    var _appraiseTabArr = $(".appraise-tab").removeClass("appraise-tab-current");
    for (var i = 0; i < _appraiseTabArr.length; i++) {
        if (pTabNum == i) {
            $(_appraiseTabArr[i]).addClass("appraise-tab-current");
            break;
        }
    }

    mSearchTxt = pTabNum;

    //重新初下拉刷新数据
    downCallback(mescroll);
}


//===================浏览晒单图片=========================//

/**
 * 初始化PhotoSwipe的数据
 * */
function initPhotoSwipeData() {

    //获取晒单图片标签
    var _appraiseImgLabelArr = $(".appraise-img-label");
    //console.log($(_appraiseImgLabelArr[0]).attr("src"));

    mPhotoSwipeDataList = null;
    mPhotoSwipeDataList = [];

    //--------初始化PhotoSwipe值------------//
    //浏览图片PhotoSwipe的数据列表
    mLoadIndex = 0;
    mIsAllImageSize = false; //是否全部都自动设置了图片尺寸
    gallery = null;
    mIsIniting = false; //是否初始化中



    for (var i = 0; i < _appraiseImgLabelArr.length; i++) {


        mPhotoSwipeDataList[i] = {
            src: $(_appraiseImgLabelArr[i]).attr("src"),
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


