//================搜索店铺============================//

/**------定义公共变量----**/

//AjaxURL
var mAjaxUrl = "../MallAjax/SearchShop";

var mBuyerUserID = ""; //买家UserID
var mSearchType = ""; //搜索的类型，实体店 Entity

/**------初始化------**/
$(function () {

    mBuyerUserID = $("#hidBuyerUserID").val().trim();
    mSearchType = $("#hidSearchType").val().trim();
    if (mSearchType == "Entity") {
        $("#SearchEntityLabel").show();
        $("#SearchImgIcon").hide();
    }
    else {
        $("#SearchEntityLabel").hide();
        $("#SearchImgIcon").show();
    }

    $("#SearchTxt").focus();
    //搜索文本框事件，获取当文本框获取了焦点，按了键盘事件
    $("#SearchTxt").keydown(function (event) {
        //alert(event.keyCode);
        if (event.keyCode == "13") {

            //直接跳转搜索内容 
            clickSearchShop();

            return false;
        }
    });

    //加载买家店铺搜索历史
    loadSearchHistoryShop();
    //加载搜索发现内容
    loadTopSearchFindMsg();
});


/**-----------自定义函数-----------**/

/**
 * 加载买家店铺搜索历史
 * */
function loadSearchHistoryShop() {

    var IsEntity = "false";
    if (mSearchType == "Entity") {
        IsEntity = "true"
    }

    //构造POST参数
    var dataPOST = {
        "Type": "1", "BuyerUserID": mBuyerUserID, "IsEntity": IsEntity,
    };

    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: mAjaxUrl + "?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("加载买家店铺搜索历史=" + reTxt);
            if (reTxt != "") {
                var _jsonReTxt = JSON.parse(reTxt);

                var SearchHistoryGoodsShopList = _jsonReTxt.SearchHistoryGoodsShopList;

                var myJsVal = "";
                for (var i = 0; i < SearchHistoryGoodsShopList.length; i++) {

                    //是否为实体
                    var _Entity = "";
                    if (SearchHistoryGoodsShopList[i].IsEntity == "true") {
                        _Entity = "Entity";
                    }

                    myJsVal += "<div class=\"result-item\" onclick=\"clickItemHistory('" + SearchHistoryGoodsShopList[i].SearchContent + "','" + _Entity + "')\">";
                    myJsVal += SearchHistoryGoodsShopList[i].SearchContent;
                    myJsVal += "</div>";
                }
                //显示代码插入前台
                $("#SearchResultContent").html(myJsVal);
            }
            else {
                $("#SearchResultContent").html("");
            }
        }
    });
}



/**
 * 加载搜索发现内容
 * */
function loadTopSearchFindMsg() {

    var IsEntity = "false";
    if (mSearchType == "Entity") {
        IsEntity = "true"
    }

    //构造POST参数
    var dataPOST = {
        "Type": "3", "FindType": "Shop", "IsEntity": IsEntity,
    };

    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: "../MallAjax/SearchGoods?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("加载搜索发现内容=" + reTxt);
            if (reTxt != "") {
                var _jsonReTxt = JSON.parse(reTxt);

                var SearchFindMsgList = _jsonReTxt.SearchFindMsgList;
                var myJsVal = "";
                for (var i = 0; i < SearchFindMsgList.length; i++) {

                    //是否为实体
                    var _Entity = "";
                    if (SearchFindMsgList[i].IsEntity == "true") {
                        _Entity = "Entity";
                    }

                    myJsVal += "<div class=\"result-item\" onclick=\"clickItemHistory('" + SearchFindMsgList[i].SearchContent + "','" + _Entity + "')\">";
                    myJsVal += SearchFindMsgList[i].SearchContent;
                    myJsVal += "</div>";
                }
                $("#SearchFindContent").html(myJsVal);
            }
            else {
                $("#SearchFindContent").html("");
            }
        }
    });
}




/**
 * 删除商品搜索历史
 * */
function delSearchHistoryShop() {

    confirmWin("确定要删除吗?", function () {


        //构造POST参数
        var dataPOST = {
            "Type": "2", "BuyerUserID": mBuyerUserID,
        };

        //正式发送异步请求
        $.ajax({
            type: "POST",
            url: mAjaxUrl + "?rnd=" + Math.random(),
            data: dataPOST,
            dataType: "html",
            success: function (reTxt, status, xhr) {
                console.log("确定要删除店铺搜索历史=" + reTxt);
                if (reTxt != "") {
                    var _jsonReTxt = JSON.parse(reTxt);

                    if (_jsonReTxt.ErrMsg != "" && _jsonReTxt.ErrMsg != undefined && _jsonReTxt.ErrMsg != null) {
                        toastWin(_jsonReTxt.ErrMsg);
                        return;
                    }

                    if (_jsonReTxt.Msg != "" && _jsonReTxt.Msg != undefined && _jsonReTxt.Msg != null) {
                        toastWin(_jsonReTxt.Msg);
                        //加载买家商品店铺搜索历史
                        loadSearchHistoryShop();
                        return;
                    }

                }
            }
        });


    });
}


/**
 * 直接跳转搜索内容 
 * */
function clickSearchShop(pEntity = "") {

    if (pEntity != "") {
        mSearchType = pEntity;
    }

    //获取搜索内容值
    var SearchTxt = $("#SearchTxt").val().trim();

    if (SearchTxt == "") {
        toastWin("请输入搜索的内容！");
        $("#SearchTxt").focus();
        return;
    }

    if (mSearchType == "Entity") {
        //构造跳转地址
        window.location.href = "../Mall/SearchShopResultO2o?SC=" + encodeURI(SearchTxt);
    }
    else {
        //构造跳转地址
        window.location.href = "../Mall/SearchShopResult?SC=" + encodeURI(SearchTxt);
    }

}

/**
 * 单击最近搜索列
 * @param {any} pSeContent 搜索内容
 */
function clickItemHistory(pSeContent, pEntity = "") {

    if (pEntity != "") {
        mSearchType = pEntity;
    }

    if (mSearchType == "Entity") {
        //构造跳转地址
        window.location.href = "../Mall/SearchShopResultO2o?SC=" + encodeURI(pSeContent);
    }
    else {
        //构造跳转地址
        window.location.href = "../Mall/SearchShopResult?SC=" + encodeURI(pSeContent);
    }

}



