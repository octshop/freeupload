//=============活动参与验证===============//

/**-----定义公共变量------**/

//AjaxURL
var mAjaxUrl = "../Activity/ActivityMsg";

/**------初始化------**/
$(function () {


});

/**
 * 查询验证活动信息列表
 * */
function searchCheckActivity() {

    //获取表单值
    var ActivityIDTxt = $("#ActivityIDTxt").val().trim();
    var CheckCodeTxt = $("#CheckCodeTxt").val().trim();
    if (CheckCodeTxt == "") {
        toastWin("【验证码】不能为空！");
        $("#CheckCodeTxt").focus();
        return;
    }

    //构造POST参数
    var dataPOST = {
        "Type": "5", "ActivityID": ActivityIDTxt, "VerifyCode": CheckCodeTxt,
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
            console.log("查询验证活动信息列表=" + reTxt);

            //移除加载提示
            closeLoadingWin();

            if (reTxt != "") {
                var _jsonObj = JSON.parse(reTxt);

                if (_jsonObj.VerifyCodeList.length <= 0) {
                    $("#CheckOrderList").html("没有查询到相关数据");
                    return;
                }

                //构造验证活动显示代码
                var _xhtmlCheckActivityList = xhtmlCheckActivityList(_jsonObj.VerifyCodeList);
                $("#CheckOrderList").html(_xhtmlCheckActivityList);
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
 * 构造构造验证活动显示代码
 * @param {any} pJsonVerifyCodeList
 */
function xhtmlCheckActivityList(pJsonVerifyCodeList) {

    var myJsVal = "";    for (var i = 0; i < pJsonVerifyCodeList.length; i++) {        var JsonVerifyCode = pJsonVerifyCodeList[i];        myJsVal += "<div class=\"check-order-item\">";        myJsVal += " <ul>";        myJsVal += "     <li class=\"order-item-title\">";        myJsVal += "         <span>";        myJsVal += "             活动ID：<b>" + JsonVerifyCode.ActivityID + "</b>";        myJsVal += "             活动状态：<b>" + JsonVerifyCode.ActivityStatus + "</b>";        myJsVal += "         </span>";        myJsVal += "         <a href=\"../ActivityPage/ActivityDetail?AID=" + JsonVerifyCode.ActivityID + "\" target=\"_blank\" class=\"am-btn\">活动详情</a>";        myJsVal += "     </li>";        myJsVal += "   ";        myJsVal += "     <li class=\"order-item-goods\">";        myJsVal += "         <a href=\"../ActivityPage/ActivityDetail?AID=" + JsonVerifyCode.ActivityID + "\" target=\"_blank\">" + JsonVerifyCode.AcTitle + "</a>";        myJsVal += "     </li>";        myJsVal += "     <li class=\"order-user-msg\">";        myJsVal += "         <span>";        myJsVal += "             用户昵称：<b>IT" + JsonVerifyCode.UserNick + "</b>";        myJsVal += "             手机号：<b>" + JsonVerifyCode.LinkMobile + "</b>";        myJsVal += "         </span>";        myJsVal += "         <span>";        myJsVal += "             <input type=\"button\" class=\"btn-common am-btn am-radius am-btn-success\" value=\"参与验证\" onclick=\"verifyActivityCheckCode('" + JsonVerifyCode.ActivityID + "', '" + JsonVerifyCode.BuyerUserID +"')\" />";        myJsVal += "         </span>";        myJsVal += "     </li>";        myJsVal += " </ul>";        myJsVal += "</div>";    }
    return myJsVal;
}




/**
 * 活动参与验证  进行验证
 * */
function verifyActivityCheckCode(pActivityID, pBuyerUserID) {

    if (pActivityID == "" || pBuyerUserID == "") {
        return;
    }

    confirmWinWidth("确定要验证吗？", function () {

        //获取表单值
        var CheckCodeTxt = $("#CheckCodeTxt").val().trim();
        if (CheckCodeTxt == "") {
            toastWin("【验证码】不能为空！");
            $("#CheckCodeTxt").focus();
            return;
        }

        //构造POST参数
        var dataPOST = {
            "Type": "2", "ExtraData": pActivityID, "BuyerUserID": pBuyerUserID, "VerifyType": "ActivityJoin", "VerifyCode": CheckCodeTxt,
        };
        console.log(dataPOST);

        //加载提示窗口
        loadingWin();

        //正式发送异步请求
        $.ajax({
            type: "POST",
            url: "../VerifyCode/VerifyCodeAll?rnd=" + Math.random(),
            data: dataPOST,
            dataType: "html",
            success: function (reTxt, status, xhr) {
                console.log("活动参与验证=" + reTxt);

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

                            //重新加载数据
                            searchCheckActivity();

                            //跳转到订单详情页
                            //window.location.href = "../ActivityPage/ActivityDetail?AID=" + pActivityID;

                        });

                    }
                }
            },
            error: function (xhr, errorTxt, status) {
                console.log("异步请求错误，errorTxt=" + errorTxt + " | status=" + status);
                return;
            }
        });

    }, 400);
}



