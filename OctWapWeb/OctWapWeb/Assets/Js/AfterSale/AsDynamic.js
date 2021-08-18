//===========订单动态=============//

/**-----定义公共变量------**/
var mAjaxUrl = "../AfterSaleAjax/AsDynamic";

//售后ID
var mAID = "";

/**------初始化------**/
$(function () {

    mAID = $("#hidAID").val().trim();

    //初始化售后动态信息列表
    initAsDynamic();

});

/**
 * 初始化售后动态信息列表
 * */
function initAsDynamic() {
    //构造POST参数
    var dataPOST = {
        "Type": "1", "ApplyID": mAID,
    };
    console.log(dataPOST);
    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: mAjaxUrl + "?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("初始化售后动态=" + reTxt);
            if (reTxt != "") {
                var _jsonReTxt = JSON.parse(reTxt);

                //构造售后动态列表显示代码
                var myJsVal = "";
                for (var i = 0; i < _jsonReTxt.AsDynamicList.length; i++) {

                    var _WriteDate = _jsonReTxt.AsDynamicList[i].WriteDate.replace("", "<br />");
                    var _currentClass = "";                    if (i == 0) {                        _currentClass = "order-dynamic-item-current";
                    }                    //定义动态项的跳转                    var _locationHref = "";                    if (_jsonReTxt.AsDynamicList[i].MsgContent.indexOf("物流单号") >= 0) {
                        //_locationHref = "onclick=\"window.location.href='../Order/ExpressDetail?AID=23432'\"";
                        _locationHref = "onclick=\"window.location.href='../AfterSale/AsDetail?AID=" + mAID + "'\"";
                    }                    else {                        _locationHref = "onclick=\"window.location.href='../AfterSale/AsDetail?AID=" + mAID +"'\"";
                    }                    myJsVal += "<div class=\"order-dynamic-item " + _currentClass + "\" " + _locationHref +">";                    myJsVal += " <div class=\"dynamic-item-left\">";                    myJsVal += _WriteDate                    myJsVal += " </div>";                    myJsVal += " <div class=\"dynamic-item-mid\">";                    myJsVal += "     <div class=\"dynamic-circle\"></div>";                    myJsVal += " </div>";                    myJsVal += " <div class=\"dynamic-item-right\">";                    myJsVal += _jsonReTxt.AsDynamicList[i].MsgContent                    myJsVal += " </div>";                    myJsVal += "</div>";
                }
                $("#AsDynamicList").html(myJsVal);            }
        }
    });
}

