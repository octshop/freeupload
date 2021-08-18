/*===================收货地址列表==========================*/

/**-----定义公共变量------**/
var mAjaxUrl = "../BuyerAjax/ReceiAddrList";

//买家UserID
var mBuyerUserID = "";

/**------初始化------**/
$(function () {

    mBuyerUserID = $("#hidBuyerUserID").val().trim();

    //初始化数据分页Mescroll对象
    initPageMescroll();

    //搜索方法 数据分页
    //searchContent();

    //给加载更多按钮定义事件
    //$("#loadMoreData").click(function () {
    //    //翻页函数
    //    sendPageHttp(mIntPageCurrent);
    //});


});


//===============================数据分页===============================//

var mescroll;//分页滚动对象
var mIsRemoveDefaultMsg = false; //判断是否要删除页面默认加载的信息
var mIntPageCurrent = 1; //当前页
var mIsScrollLoadMore = true; //是否上拉加载更多,默认不加载
var mIsPageHttp = true; //是否可以发送分页Http请求
var mPageType = "1"; //数据分页操作类型


/**
 * 搜索方法 数据分页
 * */
function searchContent() {
    //删除之前的所有数据
    mIsRemoveDefaultMsg = true;

    //初始化当前页
    mIntPageCurrent = 1;

    //重新加载数据
    sendPageHttp("1");

    //显示加载提示
    $("#PageContentList").html("<div style=\"text-align:center; font-size:10px; padding: 10px; color:#FF5700;\">…数据加载中…</div>");
}




//----------------以GET方式发送分页请求的函数---------------//
function sendPageHttp(intPageCurrent) {

    //判断是否可以发送分页Http 防止重复提交
    if (mIsPageHttp == false) {
        return;
    }
    $("#loadMoreData").html("… 加载中 …");

    //获取搜索条件
    var SearchTxtArr = "";

    //构造GET参数
    var dataGET = {
        "type": "1",
        "PageCurrent": intPageCurrent,
        "SearchTxtArr": SearchTxtArr,
    };
    //正式发送GET请求
    $.ajax({
        type: "GET",
        url: mAjaxUrl + "?rnd=" + Math.random(),
        data: dataGET,
        dataType: "html",
        success: function (reTxt, status, xhr) {

            //成功返回后的处理函数
            pageSuccess(reTxt)

        },
        error: function (xhr, errorTxt, status) {
            console.log("异步请求错误，errorTxt=" + errorTxt + " | status=" + status);
            //alert("网速不给力哦,请刷新一下！");
            return;
        }
    });
}


//------------分页信息成功返回------------//
function pageSuccess(reTxtJson) {
    if (reTxtJson != "") {


        var reJsonObject = JSON.parse(reTxtJson);
        //console.log(reJsonObject);

        //解析JSON数据 构造 前台显示代码
        var _strXhtml = jsonToXhtml(reJsonObject);
        //console.log(_strXhtml);

        //返回显示代码插入前台
        if (mIsRemoveDefaultMsg == true) {
            document.getElementById("PageContentList").innerHTML = _strXhtml;
        }
        else {
            document.getElementById("PageContentList").innerHTML += _strXhtml;
        }

        //是否要移除所有内容
        mIsRemoveDefaultMsg = false;

        //------创建加载更多条-----//
        if (parseInt(reJsonObject.PageSum) <= 1 || mIntPageCurrent >= parseInt(reJsonObject.PageSum)) {

            mIsScrollLoadMore = false; //不可以上拉加载

            $("#loadMoreData").hide();
        }
        else {

            mIsScrollLoadMore = true; //可以上拉加载
            $("#loadMoreData").html("… 点我加载更多 …");

            $("#loadMoreData").show();
            mIntPageCurrent += 1; //分页加1
        }

        //Http成功返回，可再次发送Http请求
        mIsPageHttp = true;
        //结束加载
        mescroll.endErr(); //不调用此方法，就不会再次执行，上拉加载
    }
    else {
        if (mIsRemoveDefaultMsg == true) {
            $("#PageContentList").html("<div style=\"text-align:center; font-size:10px; padding: 10px; color:#FF5700;\">无数据加载</div>");
            //移除加载更多
            $("#loadMoreData").hide();
        }
    }
}


//------------解析JSON数据 构造 前台显示代码--------------//
// pJsonTxt Json字符串
function jsonToXhtml(pJsonObject) {


    var json = pJsonObject;
    console.log(pJsonObject);

    //前台显示代码
    var myJsVal = "";
    for (var i = 0; i < json.DataPage.length; i++) {

        var dataPage = json.DataPage[i];
        var dataPageExtra = json.DataPageExtra[i];

        myJsVal += "<div class=\"recei-addr-item oct-section\">";        myJsVal += "   <div class=\"addr-item-top\">";        myJsVal += "       <div>";        myJsVal += "" + dataPage.ReceiName +"";        myJsVal += "       </div>";        myJsVal += "       <div>";        myJsVal += "" + dataPage.Mobile +"";        myJsVal += "       </div>";        myJsVal += "   </div>";        myJsVal += "   <div class=\"addr-item-mid\">";        myJsVal += "" + dataPage.RegionNameArr + "_" + dataPage.DetailAddr +"";        myJsVal += "   </div>";        myJsVal += "   <div class=\"addr-item-bottom\">";        myJsVal += "       <div class=\"addr-item-default\">";        myJsVal += "           <img src=\"../Assets/Imgs/Icon/sel_no.png\" />默认地址";        myJsVal += "       </div>";        myJsVal += "       <div class=\"addr-item-btn\">";        myJsVal += "           <div class=\"addr-item-edit\" onclick=\"window.location.href=\'../Buyer/ReceiAddrEdit\'\">";        myJsVal += "               编辑";        myJsVal += "           </div>";        myJsVal += "           <div class=\"addr-item-del\">";        myJsVal += "               删除";        myJsVal += "           </div>";        myJsVal += "       </div>";        myJsVal += "   </div>";        myJsVal += "</div>";    }

    return myJsVal;
}


/**
 * 初始化数据分页Mescroll对象
 * */
function initPageMescroll() {

    //创建MeScroll对象:
    mescroll = new MeScroll("mescroll", {
        //第一个参数"mescroll"对应上面布局结构div的id
        down: {
            auto: false,
            callback: downCallback //下拉刷新的回调,别写成downCallback(),多了括号就自动执行方法了
        },
        up: {
            auto: true,
            offset: 3,
            callback: upCallback //上拉加载回调,简写callback:function(page){upCallback(page);}
        }
    });
}

/**
 * 下拉刷新的回调
 * */
function downCallback() {

    console.log("执行了下拉刷新的回调");
    //alert("执行了下拉刷新的回调");
    mescroll.endSuccess();//无参
}

/**
 * 上拉加载的回调 page = {num:1, size:10}; num:当前页 从1开始, size:每页数据条数
 * */
function upCallback() {
    console.log("上拉加载的回调");
    //alert("上拉加载的回调");

    //----判断是否需要执行加载更多---//
    //if (mIsScrollLoadMore) {
    //    //下拉加载更多
    //    sendPageHttp(mIntPageCurrent);
    //}

    //结束加载
    mescroll.endErr(); //不调用此方法，就不会再次执行，上拉加载

}






//===============================数据分页===============================//



