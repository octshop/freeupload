//==================店铺搜索==========================//

/**------定义公共变量----**/

//AjaxURL
var mAjaxUrl = "../ShopAjax/ShopSearch";

var mShopID = ""; //店铺ID
var mBuyerUserID = ""; //买家UserID


/**------初始化------**/
$(function () {

    mShopID = $("#hidShopID").val().trim();
    mBuyerUserID = $("#hidBuyerUserID").val().trim();

    //加载买家商品店铺搜索历史
    loadSearchHistoryGoodsShop();

    $("#SearchTxt").focus();
    //搜索文本框事件，获取当文本框获取了焦点，按了键盘事件
    $("#SearchTxt").keydown(function (event) {
        //alert(event.keyCode);
        if (event.keyCode == "13") {

            //直接跳转搜索内容 
            clickSearchGoods()

            return false;
        }
    });


});

/**
 * 加载买家商品店铺搜索历史
 * */
function loadSearchHistoryGoodsShop() {

    //构造POST参数
    var dataPOST = {
        "Type": "1", "BuyerUserID": mBuyerUserID,
    };

    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: mAjaxUrl + "?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("加载买家商品店铺搜索历史=" + reTxt);
            if (reTxt != "") {
                var _jsonReTxt = JSON.parse(reTxt);

                var SearchHistoryGoodsShopList = _jsonReTxt.SearchHistoryGoodsShopList;

                var myJsVal = "";
                for (var i = 0; i < SearchHistoryGoodsShopList.length; i++) {
                    myJsVal += "<div class=\"result-item\" onclick=\"clickItemHistory('" + SearchHistoryGoodsShopList[i].SearchContent + "')\">";
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
 * 直接跳转搜索内容 
 * */
function clickSearchGoods() {

    //获取搜索内容值
    var SearchTxt = $("#SearchTxt").val().trim();

    if (SearchTxt == "") {
        toastWin("请输入搜索的内容！");
        $("#SearchTxt").focus();
        return;
    }

    //构造跳转地址
    window.location.href = "../Shop/ShopSearchResult?SID=" + mShopID + "&SC=" + encodeURI(SearchTxt);
}

/**
 * 单击最近搜索列
 * @param {any} pSeContent 搜索内容
 */
function clickItemHistory(pSeContent) {
    //构造跳转地址
    window.location.href = "../Shop/ShopSearchResult?SID=" + mShopID + "&SC=" + encodeURI(pSeContent);
}

/**
 * 删除商品搜索历史
 * */
function delSearchHistoryGoodsShop() {

    confirmWin("确定要删除商品搜索历史！", function () {


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
                console.log("删除商品搜索历史=" + reTxt);
                if (reTxt != "") {
                    var _jsonReTxt = JSON.parse(reTxt);

                    if (_jsonReTxt.ErrMsg != "" && _jsonReTxt.ErrMsg != undefined && _jsonReTxt.ErrMsg != null) {
                        toastWin(_jsonReTxt.ErrMsg);
                        return;
                    }

                    if (_jsonReTxt.Msg != "" && _jsonReTxt.Msg != undefined && _jsonReTxt.Msg != null) {
                        toastWin(_jsonReTxt.Msg);
                        //加载买家商品店铺搜索历史
                        loadSearchHistoryGoodsShop();
                        return;
                    }

                }
            }
        });


    });
}
