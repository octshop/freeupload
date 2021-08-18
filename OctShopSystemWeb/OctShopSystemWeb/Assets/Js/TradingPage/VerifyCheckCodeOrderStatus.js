//=============订单核销验证===============//

/**-----定义公共变量------**/

//AjaxURL
var mAjaxUrl = "../Trading/VerifyCheckCodeOrderStatus";

//订单ID
var mOrderID = "";
//OctWapWeb 手机Web端(公众号端)地址域名
var mOctWapWebAddrDomain = "";

/**------初始化------**/
$(function () {

    mOctWapWebAddrDomain = $("#hidOctWapWeb_AddrDomain").val().trim();

    $("#CheckCodeTxt").focus();

});

/**
 * 查询验证订单信息列表
 * */
function searchCheckOrder() {

    //获取表单值
    var OrderIDTxt = $("#OrderIDTxt").val().trim();
    var CheckCodeTxt = $("#CheckCodeTxt").val().trim();
    if (CheckCodeTxt == "") {
        toastWin("【验证码】不能为空！");
        $("#CheckCodeTxt").focus();
        return;
    }

    //构造POST参数
    var dataPOST = {
        "Type": "1", "OrderID": OrderIDTxt, "CheckCode": CheckCodeTxt,
    };
    console.log(dataPOST);

    //加载提示窗口
    loadingWin();

    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: mAjaxUrl + "?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("验证订单验证码=" + reTxt);

            //移除加载提示
            closeLoadingWin();

            if (reTxt != "") {
                var _jsonObj = JSON.parse(reTxt);

                //构造验证订单显示代码
                var _xhtmlCheckOrderList = xhtmlCheckOrderList(_jsonObj);
                $("#CheckOrderList").html(_xhtmlCheckOrderList);
            }
            else {
                $("#CheckOrderList").html("没有查询到相关数据");
            }
        },
        error: function (xhr, errorTxt, status) {
            console.log("异步请求错误，errorTxt=" + errorTxt + " | status=" + status);
            return;
        }
    });
}

/**
 * 构造验证订单显示代码
 * @param {any} pJsonReTxt 查询返回的Json对象
 */
function xhtmlCheckOrderList(pJsonReTxt) {

    var OrderCheckCodeOrderMsgList = pJsonReTxt.OrderCheckCodeOrderMsgList
    var UserMsgArr = pJsonReTxt.UserMsgArr

    //循环构造显示代码
    var myJsVal = "";
    for (var i = 0; i < OrderCheckCodeOrderMsgList.length; i++) {

        var ModelOrderCheckCode = OrderCheckCodeOrderMsgList[i].ModelOrderCheckCode
        var ModelOrderMsg = OrderCheckCodeOrderMsgList[i].ModelOrderMsg

        //构造商品显示列表
        var _xhtmlGoodsItemList = xhtmlGoodsItemList(ModelOrderMsg.GoodsIDArr, ModelOrderMsg.GoodsTitleArr, ModelOrderMsg.GoodsSpecIDOrderNumArr);

        myJsVal += "<div class=\"check-order-item\">";        myJsVal += " <ul>";        myJsVal += "     <li class=\"order-item-title\">";        myJsVal += "         <span>";        myJsVal += "             订单ID：<b>" + ModelOrderCheckCode.OrderID + "</b>";        myJsVal += "             订单总额：<b>&#165;" + ModelOrderMsg.OrderPrice + "</b>";        myJsVal += "             订单状态：<b>" + ModelOrderMsg.OrderStatus + "</b>";        myJsVal += "         </span>";        myJsVal += "         <a href=\"../TradingPage/OrderDetail?OID=" + ModelOrderCheckCode.OrderID +"\" target=\"_blank\" class=\"am-btn\">订单详情</a>";        myJsVal += "     </li>";        //商品显示列表        myJsVal += _xhtmlGoodsItemList;        myJsVal += "     <li class=\"order-user-msg\">";        myJsVal += "         <span>";        myJsVal += "             用户昵称：<b>" + UserMsgArr[i].UserNick + "</b>";        myJsVal += "             手机号：<b>" + UserMsgArr[i].BindMobile + "</b>";        myJsVal += "         </span>";        myJsVal += "         <span>";        myJsVal += "             <input type=\"button\" class=\"btn-common am-btn am-radius am-btn-success\" value=\"核销验证\" onclick=\"verifyOrderCheckCode('" + ModelOrderCheckCode.OrderID + "', '" + ModelOrderCheckCode.BuyerUserID + "')\" />";        myJsVal += "         </span>";        myJsVal += "     </li>";        myJsVal += " </ul>";        myJsVal += "</div>";    }
    return myJsVal;
}

/**
 * 构造商品显示列表
 * @param {any} pGoodsIDArr
 * @param {any} pGoodsTitleArr
 * @param {any} pGoodsSpecIDOrderNumArr
 */
function xhtmlGoodsItemList(pGoodsIDArr, pGoodsTitleArr, pGoodsSpecIDOrderNumArr) {

    var GoodsIDArr = new Array();
    var GoodsTitleArr = new Array();
    var GoodsSpecIDOrderNumArr = new Array();

    if (pGoodsIDArr.indexOf("^") >= 0) {
        GoodsIDArr = pGoodsIDArr.split("^");
        GoodsTitleArr = pGoodsTitleArr.split("^");
        GoodsSpecIDOrderNumArr = pGoodsSpecIDOrderNumArr.split("^");
    }
    else {
        GoodsIDArr[0] = pGoodsIDArr;
        GoodsTitleArr[0] = pGoodsTitleArr;
        GoodsSpecIDOrderNumArr[0] = pGoodsSpecIDOrderNumArr;
    }

    //循环构造 显示代码
    var myJsVal = "";
    for (var i = 0; i < GoodsIDArr.length; i++) {

        var OrderNum = GoodsSpecIDOrderNumArr[i].split("_")[1];

        myJsVal += "     <li class=\"order-item-goods\">";        myJsVal += "         <a href=\"" + mOctWapWebAddrDomain + "/Goods/GoodsDetailPreMobileIframe?GID=" + GoodsIDArr[i] + "\" target=\"_blank\">" + GoodsTitleArr[i] + "</a><span>x " + OrderNum + "</span>";        myJsVal += "     </li>";

    }

    return myJsVal;


}

/**
 * 核销验证 [待消费/自取]验证
 * */
function verifyOrderCheckCode(pOrderID, pBuyerUserID) {

    if (pOrderID == "" || pBuyerUserID == "") {
        return;
    }

    confirmWinWidth("确定要核销验证吗？", function () {

        //获取表单值
        var CheckCodeTxt = $("#CheckCodeTxt").val().trim();
        if (CheckCodeTxt == "") {
            toastWin("【验证码】不能为空！");
            $("#CheckCodeTxt").focus();
            return;
        }

        //构造POST参数
        var dataPOST = {
            "Type": "9", "OrderID": pOrderID, "BuyerUserID": pBuyerUserID, "CheckType": "ShopCheck", "CheckCode": CheckCodeTxt,
        };
        console.log(dataPOST);

        //加载提示窗口
        loadingWin();

        //正式发送异步请求
        $.ajax({
            type: "POST",
            url: "../Trading/OrderMan?rnd=" + Math.random(),
            data: dataPOST,
            dataType: "html",
            success: function (reTxt, status, xhr) {
                console.log("核销验证 [待消费/自取]验证=" + reTxt);

                //移除加载提示
                closeLoadingWin();

                if (reTxt != "") {
                    var _jsonObj = JSON.parse(reTxt);
                    if (_jsonObj.ErrMsg != "" && _jsonObj.ErrMsg != null && _jsonObj.ErrMsg != undefined) {
                        toastWin(_jsonObj.ErrMsg);
                        return;
                    }
                    if (_jsonObj.Msg != "" && _jsonObj.Msg != null && _jsonObj.Msg != undefined) {
                        toastWinCb(_jsonObj.Msg, function () {

                            //跳转到订单详情页
                            window.location.href = "../TradingPage/OrderDetail?OID=" + pOrderID;

                        });

                    }
                }
            },
            error: function (xhr, errorTxt, status) {
                console.log("异步请求错误，errorTxt=" + errorTxt + " | status=" + status);
                return;
            }
        });

    },400);
}


