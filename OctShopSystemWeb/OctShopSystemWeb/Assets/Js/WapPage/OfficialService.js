/*===================官方客服========================*/

/**-----定义公共变量------**/
var mAjaxUrl = "../Wap/OfficialService";

var mImSystemWebDomainURL = "";
var mImSystemShopUserAccount = "";

/**------初始化------**/
$(function () {

    mImSystemWebDomainURL = $("#hidImSystemWebDomainURL").val().trim();
    mImSystemShopUserAccount = $("#hidImSystemShopUserAccount").val().trim();

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

                        //当前的域名URL
                        var _CurrentDomainURL = getCurrentDomainURL();

                        //function locationEnterImWap() {   var _enterUrl = "http://192.168.3.10:6688/EnterIm/VisitorEnter?ShopUserID=20040&VisitType=Platform&MobileNum=111111&IsShowTitleHeader=true&BuyerUserID=0&BuyerNick=1111111&BuyerHeaderImg=&VisitorMemo=商家手机后台中心&TopTitle=平台官方客服&TopAHref=&ShowItemHeaderImgUrl=&ShowTitle=商城平台官方客服&ShowTitleSub=&OsType=Wap&rnd=0.23525633683958413";   window.location.href = _enterUrl;}

                        var _ServiceEnterUrl = mImSystemWebDomainURL + "/EnterIm/VisitorEnter?ShopUserID=" + mImSystemShopUserAccount + "&VisitType=Platform&MobileNum=" + ExplainText.ExplainContent.trim() + "&IsShowTitleHeader=true&BuyerUserID=0&BuyerNick=&BuyerHeaderImg=&VisitorMemo=商家手机后台中心&TopTitle=平台官方客服&TopAHref=" + _CurrentDomainURL + "/WapPage/Index" + "&ShowItemHeaderImgUrl=&ShowTitle=商城平台官方客服&ShowTitleSub=&OsType=Wap&rnd=" + Math.random();


                        $("#BtnServicesOnLine").attr("href", _ServiceEnterUrl);
                        //$("#BtnServicesOnLine").attr("href", "tel:" + ExplainText.ExplainContent.trim());
                        $("#BtnServicesTel").attr("href", "tel:" + ExplainText.ExplainContent.trim());
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

                    myJsVal += "<li onclick=\"window.location.href='../WapPage/QuestionDetail?EID=" + ExplainText.ExplainID + "'\"><span>" + ExplainText.ExplainTitle + "</span></li>";

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