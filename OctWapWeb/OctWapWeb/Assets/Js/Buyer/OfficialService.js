/*===================官方客服========================*/

/**-----定义公共变量------**/
var mAjaxUrl = "../BuyerAjax/OfficialService";

//登录买家UserID
var mBuyerUserID = "";

/**------初始化------**/
$(function () {

    mBuyerUserID = $("#hidBuyerUserID").val().trim();

    //加载各种客服电话信息
    loadServiceTel();

});


/**
 * 加载各种客服电话信息
 * */
function loadServiceTel() {
    //构造GET参数
    var dataPOST = {
        "Type": "1", "ExplainType": "ServiceTel", "ClearOrShowPropertyNameArr": "IsLock^WriteDate^PageOrder"
    };
    //正式发送GET请求
    $.ajax({
        type: "POST",
        url: mAjaxUrl + "?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("加载各种客服电话信息=" + reTxt);
            if (reTxt != "") {

                //转换为Json对象
                var _jsonReTxt = JSON.parse(reTxt);
                //构造显示代码
                var myJsVal = "";
                for (var i = 0; i < _jsonReTxt.ExplainTextList.length; i++) {

                    var ExplainText = _jsonReTxt.ExplainTextList[i];

                    myJsVal += "<div><span>" + ExplainText.ExplainTitle + "：</span><a href=\"tel:" + ExplainText.ExplainContent + "\">" + ExplainText.ExplainContent + "</a></div>";

                    //设置按钮事件
                    if (ExplainText.ExplainTitle == "客服电话") {

                        $("#BtnServicesOnLine").attr("href", "tel:" + ExplainText.ExplainContent.trim());
                        $("#BtnServicesTel").attr("href", "tel:" + ExplainText.ExplainContent.trim());

                        //构建【商城平台官方客服】咨询进入IM在线客服系统 跳转 URL
                        buildBuyerGoToImSysURL_PlatformWap(mBuyerUserID);
                    }
                }
                //显示代码插入前台
                $("#ServiceTelList").html(myJsVal);


                //加载问题类型列表
                loadQuestionList();

            }
        },
        error: function (xhr, errorTxt, status) {
            console.log("异步请求错误，errorTxt=" + errorTxt + " | status=" + status);
            return;
        }
    });
}

/**
 * 加载问题类型列表
 * */
function loadQuestionList() {
    //构造GET参数
    var dataPOST = {
        "Type": "1", "ExplainType": "Question", "ClearOrShowPropertyNameArr": "ExplainContent^IsLock^WriteDate^PageOrder"
    };
    //正式发送GET请求
    $.ajax({
        type: "POST",
        url: mAjaxUrl + "?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("加载问题类型列表=" + reTxt);
            if (reTxt != "") {

                //转换为Json对象
                var _jsonReTxt = JSON.parse(reTxt);
                //构造显示代码
                var myJsVal = "";
                for (var i = 0; i < _jsonReTxt.ExplainTextList.length; i++) {

                    var ExplainText = _jsonReTxt.ExplainTextList[i];

                    myJsVal += "<li onclick=\"window.location.href='../Buyer/QuestionDetail?EID=" + ExplainText.ExplainID + "'\"><span>" + ExplainText.ExplainTitle + "</span></li>";

                }
                //显示代码插入前台
                $("#QuestionUl").html(myJsVal);
            }
        },
        error: function (xhr, errorTxt, status) {
            console.log("异步请求错误，errorTxt=" + errorTxt + " | status=" + status);
            return;
        }
    });
}



//构建【商城平台官方客服】咨询进入IM在线客服系统 跳转 URL
var mBuyerGoToImSysURL_PlatformWap = "";
/**
 * -----构建【商城平台官方客服】咨询进入IM在线客服系统 跳转 URL-----
 * @param {any} pShopUserID
 */
function buildBuyerGoToImSysURL_PlatformWap(pBuyerUserID) {

    //构造POST参数
    var dataPOST = {
        "Type": "3", "MallOfficialIMShopUserID": "88888888888888888", "BuyerUserID": pBuyerUserID, "VisitorMemo": "商城平台官方在线客服"
    };
    console.log(dataPOST);

    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: "../ImSysAjax/Index?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("构建【商城平台官方客服】咨询进入IM在线客服系统 跳转 URL=" + reTxt);

            if (reTxt != "") {
                //$("#hidBuyerGoToImSysURL_ShopWap").val(reTxt);

                mBuyerGoToImSysURL_PlatformWap = reTxt;


                if (mBuyerGoToImSysURL_PlatformWap != "" && mBuyerGoToImSysURL_PlatformWap != null && mBuyerGoToImSysURL_PlatformWap != undefined) {

                    //$("#CustomerServicesOnLineDiv").unbind();
                    ////页脚下面的客服
                    //$("#CustomerServicesOnLineDiv").on("click", function () {
                    //    window.location.href = encodeURI(mBuyerGoToImSysURL_PlatformWap);
                    //});
                    $("#BtnServicesOnLine").attr("href", encodeURI(mBuyerGoToImSysURL_PlatformWap));
                }
            }
        }
    });
}


