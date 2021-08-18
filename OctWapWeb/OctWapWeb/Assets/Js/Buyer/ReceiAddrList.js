/*===================收货地址列表==========================*/

/**-----定义公共变量------**/
var mAjaxUrl = "../BuyerAjax/ReceiAddrList";

//返回的URL地址
var mBackUrl = "";

/**------初始化------**/
$(function () {

    mBackUrl = getCurrentUrlParam("BackUrl");
    if (mBackUrl != "" && mBackUrl != undefined && mBackUrl != null) {
        $("#ReceiAddrPromptDiv").show();
    }
    else {
        $("#ReceiAddrPromptDiv").hide();
    }

    console.log("mBackUrl=" + mBackUrl);

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
    var SearchTxtArr = "";

    //构造GET参数
    var dataGET = {
        "Type": "1",
        "PageCurrent": pageNum,
        "SearchTxtArr": SearchTxtArr,
    };
    //正式发送GET请求
    $.ajax({
        type: "GET",
        url: mAjaxUrl + "?rnd=" + Math.random(),
        data: dataGET,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("Ajax返回的值：" + reTxt);
            if (reTxt != "") {
                //转换为Json对象
                var jsonObj = JSON.parse(reTxt);
                //console.log(jsonObj);

                //联网成功的回调 并传值，传Json对象
                successCallback && successCallback(jsonObj);
                //特别注意返回的Json数据中必须要有 JsonObj.DataPage.length, JsonObj.PageSum
                return;
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

    //前台显示代码
    var myJsVal = "";
    for (var i = 0; i < dataPageArr.length; i++) {

        var dataPage = dataPageArr[i];
        var dataPageExtra = dataPageExtraArr[i];

        myJsVal += "<div id=\"ReceiAddrItem_" + dataPage.BReceiAddrID + "\" class=\"recei-addr-item oct-section\">";
        myJsVal += "   <div class=\"addr-item-top\" onclick=\"clickItemReceiAddr(" + dataPage.BReceiAddrID + ", '" + dataPage.RegionCodeArr + "', '" + dataPage.RegionNameArr +"')\">";
        myJsVal += "       <div>";
        myJsVal += "" + dataPage.ReceiName + "";
        myJsVal += "       </div>";
        myJsVal += "       <div>";
        myJsVal += "" + dataPage.Mobile + "";
        myJsVal += "       </div>";
        myJsVal += "   </div>";
        myJsVal += "   <div class=\"addr-item-mid\" onclick=\"clickItemReceiAddr(" + dataPage.BReceiAddrID + ", '" + dataPage.RegionCodeArr + "', '" + dataPage.RegionNameArr +"')\">";
        myJsVal += "" + dataPage.RegionNameArr + "_" + dataPage.DetailAddr + "";
        myJsVal += "   </div>";
        myJsVal += "   <div class=\"addr-item-bottom\">";
        myJsVal += "       <div class=\"addr-item-default\">";

        //判断是否为默认地址
        if (dataPage.AddrType == "default") {
            myJsVal += "<img id=\"SetDefaultImg_" + dataPage.BReceiAddrID + "\" class=\"set-default-img\" src=\"../Assets/Imgs/Icon/sel_yes.png\" onclick=\"setDefaultReceiAddr(" + dataPage.BReceiAddrID + ")\" />";
        }
        else {
            myJsVal += "<img id=\"SetDefaultImg_" + dataPage.BReceiAddrID + "\" class=\"set-default-img\" src=\"../Assets/Imgs/Icon/sel_no.png\" onclick=\"setDefaultReceiAddr(" + dataPage.BReceiAddrID + ")\" />";
        }

        myJsVal += "默认地址";
        myJsVal += "       </div>";
        myJsVal += "       <div class=\"addr-item-btn\">";
        myJsVal += "           <div class=\"addr-item-edit\" onclick=\"window.location.href=\'../Buyer/ReceiAddrEdit?RAID=" + dataPage.BReceiAddrID + "\'\">";
        myJsVal += "               编辑";
        myJsVal += "           </div>";
        myJsVal += "           <div class=\"addr-item-del\" onclick=\"delReceiAddr(" + dataPage.BReceiAddrID + ")\">";
        myJsVal += "               删除";
        myJsVal += "           </div>";
        myJsVal += "       </div>";
        myJsVal += "   </div>";
        myJsVal += "</div>";
    }

    //显示代码插入前台
    if (mIsRefresh == false) {
        document.getElementById("PageContentList").innerHTML += myJsVal;
    }
    else {
        document.getElementById("PageContentList").innerHTML = myJsVal;
    }
    mIsRefresh = false;
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
 * 设为默认地址
 * @param {any} pBReceiAddrID 收货地址ID
 */
function setDefaultReceiAddr(pBReceiAddrID) {

    //构造POST参数
    var dataPOST = {
        "Type": "2", "BReceiAddrID": pBReceiAddrID
    };
    console.log(dataPOST);
    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: mAjaxUrl + "?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log(reTxt);
            if (reTxt != "") {
                var _jsonReTxt = JSON.parse(reTxt);

                if (_jsonReTxt.Msg != null && _jsonReTxt.Msg != "") {

                    //改变设为默认地址的显示状态
                    chgCssSetDefault(pBReceiAddrID)

                    toastWin(_jsonReTxt.Msg);
                    return;
                }
                if (_jsonReTxt.ErrMsg != null && _jsonReTxt.ErrMsg != "") {
                    toastWin(_jsonReTxt.ErrMsg);
                    return;
                }
            }
        }
    });
}

/**
 * 改变设为默认地址的显示状态
 * @param {any} pBReceiAddrID 收货地址ID
 */
function chgCssSetDefault(pBReceiAddrID) {
    //将所有的Img更改为不选中状态
    $(".set-default-img").attr("src", "../Assets/Imgs/Icon/sel_no.png");
    $("#SetDefaultImg_" + pBReceiAddrID).attr("src", "../Assets/Imgs/Icon/sel_yes.png");
}

/**
 * 删除收货地址
 * @param {any} pBReceiAddrID 收货地址ID
 */
function delReceiAddr(pBReceiAddrID) {

    confirmWinWidth("确认要删除吗？", function () {


        //构造POST参数
        var dataPOST = {
            "Type": "3", "BReceiAddrID": pBReceiAddrID
        };
        console.log(dataPOST);
        //正式发送异步请求
        $.ajax({
            type: "POST",
            url: mAjaxUrl + "?rnd=" + Math.random(),
            data: dataPOST,
            dataType: "html",
            success: function (reTxt, status, xhr) {
                console.log(reTxt);
                if (reTxt != "") {
                    var _jsonReTxt = JSON.parse(reTxt);

                    if (_jsonReTxt.Msg != null && _jsonReTxt.Msg != "") {

                        toastWin(_jsonReTxt.Msg);
                        //移除删除的列表
                        $("#ReceiAddrItem_" + pBReceiAddrID).remove();

                        return;
                    }
                    if (_jsonReTxt.ErrMsg != null && _jsonReTxt.ErrMsg != "") {
                        toastWin(_jsonReTxt.ErrMsg);
                        return;
                    }
                }
            }
        });



    }, 300);


}

/**
 * 单击列表 写入选择的收货地址Cookie
 * @param {any} pBReceiAddrID 收货地址ID
 * @param pRegionCodeArr 地区范围代码 用"_"连接
 * @param pRegionNameArr 地区范围名称 用"_"连接
 */
function clickItemReceiAddr(pBReceiAddrID, pRegionCodeArr, pRegionNameArr) {

    //判断是否有返回URL
    if (mBackUrl == "" || mBackUrl == undefined || mBackUrl == null) {
        return;
    }

    //构造POST参数
    var dataPOST = {
        "Type": "4", "BReceiAddrID": pBReceiAddrID, "RegionCodeArr": pRegionCodeArr, "RegionNameArr": pRegionNameArr,
    };
    console.log(dataPOST);
    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: mAjaxUrl + "?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log(reTxt);
            if (reTxt != "") {
                if (reTxt == "41") {

                    //判断是否是【订单支付页】【订单详情页】跳转过来的
                    if (mBackUrl.indexOf("OrderPay") >= 0 || mBackUrl.indexOf("OrderDetail") >= 0 || mBackUrl.indexOf("AsSubmit") >= 0) {
                        //跳转到返回URL页面
                        window.location.href = mBackUrl + "&BID=" + pBReceiAddrID;
                    }
                    else {
                        //跳转到返回URL页面
                        window.location.href = mBackUrl + "#GoodsSpec";
                    }
                    return;
                }
            }
        }
    });
}

/**
 * 跳转到收货地址
 * */
function goToAddReceiAdd() {
    if (mBackUrl != "" && mBackUrl != null) {
        window.location.href = "../Buyer/ReceiAddrAdd?BackUrl=" + mBackUrl;
    }
    else {
        window.location.href = "../Buyer/ReceiAddrAdd";
    }
}