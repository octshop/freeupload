//=============查看快递物流===================//


/**-----定义公共变量------**/
var mAjaxUrl = "../Wap/ExpressDetail";

//订单ID
var mOrderID = "";

/**------初始化------**/
$(function () {

    mOrderID = $("#hidOrderID").val().trim();

    //查询快递信息
    searchOrderExpress();

    //加载订单第一个商品的简单信息
    loadOrderFirstGoodsMsgSimple();

});

/**
 * 查询快递信息
 * */
function searchOrderExpress() {

    //构造POST参数
    var dataPOST = {
        "Type": "1", "OrderID": mOrderID,
    };
    console.log(dataPOST);
    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: mAjaxUrl + "?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("查询快递信息=" + reTxt);
            if (reTxt != "") {

                //发货信息不存在
                if (reTxt == "HOEA_04") {
                    $("#ExpressMsgDiv").html("发货信息不存在！");
                }
                else {
                    var _jsonReTxt = JSON.parse(reTxt);
                    //无快递信息
                    if (_jsonReTxt.ExpName == "" || _jsonReTxt.ExpNumber == "") {

                    }
                    else {

                        //显示信息插入前台
                        $("#ExpName").html(_jsonReTxt.ExpName);
                        $("#ExpNumber").html(_jsonReTxt.ExpNumber);
                        $("#ExpPhone").attr("href", "tel:" + _jsonReTxt.ExpPhone);
                        $("#ExpPhone").html(_jsonReTxt.ExpPhone);
                        //if (_jsonReTxt.ExpSite.indexOf("//") < 0) {
                        //    $("#ExpSite").attr("href", "//" + _jsonReTxt.ExpSite);
                        //}
                        //else {
                        //    $("#ExpSite").attr("href", _jsonReTxt.ExpSite);
                        //}
                        $("#BtnCopyOrderID").attr("data-clipboard-text", _jsonReTxt.ExpNumber);
                        //初始化复制物流单号
                        initCopyOrderID();

                        var myJsVal = "";
                        for (var i = 0; i < _jsonReTxt.ExpList.length; i++) {

                            var _currentCss = "";
                            if (i == 0) {
                                _currentCss = "dynamic-current-li";
                            }

                            myJsVal += "<li class=\"" + _currentCss + "\">";
                            myJsVal += " <span class=\"express-circle\">&nbsp;</span>";
                            myJsVal += " <div>";
                            myJsVal += "" + _jsonReTxt.ExpList[i].Status + "";
                            myJsVal += "     <div class=\"express-datetime\">";
                            myJsVal += "" + _jsonReTxt.ExpList[i].Time + "";
                            myJsVal += "     </div>";
                            myJsVal += " </div>";
                            myJsVal += "</li>";
                        }
                        //前台插入显示代码
                        $("#DynamicUl").html(myJsVal);

                    }
                }

            }
        }
    });

}

/**
 * 加载订单第一个商品的简单信息
 * */
function loadOrderFirstGoodsMsgSimple() {

    //构造POST参数
    var dataPOST = {
        "Type": "2", "OrderID": mOrderID,
    };
    console.log(dataPOST);
    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: "../Wap/OrderDetail?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("加载订单第一个商品的简单信息=" + reTxt);
            if (reTxt != "") {
                var _jsonReTxt = JSON.parse(reTxt);
                if (_jsonReTxt.GoodsCoverImgPath != "") {
                    $("#GoodsCoverImgPath").attr("src", "//" + _jsonReTxt.GoodsCoverImgPath);
                }
            }
        }
    });

}

/**
 * 初始化复制订单ID
 * */
function initCopyOrderID() {
    //得到按钮标签
    var btn = document.getElementById('BtnCopyOrderID');
    //实例化ClipBoard对象
    var clipboard = new ClipboardJS(btn);

    clipboard.on('success', function (e) {
        console.log(e);
        toastWin("复制成功");
        //alert("复制成功！");
    });

    clipboard.on('error', function (e) {
        console.log(e);
        toastWin("复制失败");
        //alert("复制失败！");
    });
}

