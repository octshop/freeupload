//==================活动详情=====================//

/**-----定义公共变量------**/

//AjaxURL
var mAjaxUrl = "../Activity/ActivityMsg";
//活动ID
var mActivityID = 0;

var mOctWapWebAddrDomain = "";

/**------初始化------**/
$(function () {

    mActivityID = $("#hidActivityID").val().trim();
    mOctWapWebAddrDomain = $("#hidOctWapWebAddrDomain").val().trim();

    //初始化商家端后台活动详情
    initActivityDetail();

});


/**
 * 初始化商家端后台活动详情
 * */
function initActivityDetail() {
    //构造POST参数
    var dataPOST = {
        "Type": "3", "ActivityID": mActivityID,
    };
    console.log(dataPOST);

    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: mAjaxUrl + "?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("初始化商家端后台活动详情=" + reTxt);

            if (reTxt != "") {
                var _jsonObj = JSON.parse(reTxt);
                //赋值到显示代码中
                setValToXhtml(_jsonObj);
            }
        },
        error: function (xhr, errorTxt, status) {
            console.log("异步请求错误，errorTxt=" + errorTxt + " | status=" + status);
            return;
        }
    });
}



/**
 * 赋值到显示代码中
 * @param {any} pReTxtJson 接口返回的Json对象
 */
function setValToXhtml(pReTxtJson) {

    var ActivityStatus = pReTxtJson.ActivityStatus
    var ActivityImgs = pReTxtJson.ActivityImgs
    var ActivityMsg = pReTxtJson.ActivityMsg

    $("#StatusTtitle").html(ActivityStatus);
    if (ActivityMsg.IsCheck != "pass") {
        $("#StatusDesc").html(ActivityMsg.CheckReason);
    }

    $("#ActivityID").html(ActivityMsg.ActivityID);

    $("#AcType").html("OnLine-线上");
    if (ActivityMsg.AcType == "OffLine") {
        $("#AcType").html("OffLine-线下");
    }

    $("#StartDate").html(ActivityMsg.StartDate);
    $("#EndDate").html(ActivityMsg.EndDate);

    $("#AcTitle").html("<span><b>标题：</b><a href=\"" + mOctWapWebAddrDomain + "/Shop/ActivityDetailPreMobileIframe?AID=" + ActivityMsg.ActivityID + "\" target=\"_blank\">" + ActivityMsg.AcTitle + "</a></span>");
    $("#AcSketch").html("<span><b>活动简述：</b>" + ActivityMsg.AcSketch + "</span>");
    $("#AcDesc").html("<span><b>活动描述：</b>" + ActivityMsg.AcDesc + "</span>");

    var _IsJoinPause = "false-加入中";
    if (ActivityMsg.IsJoinPause == "true") {
        _IsJoinPause = "true-已暂停加入";
    }
    $("#IsJoinPause").html(_IsJoinPause);

    var LimitNumber = "无限制";
    if (ActivityMsg.LimitNumber != "0") {
        LimitNumber = ActivityMsg.LimitNumber;
        $("#LimitNumber").html(LimitNumber);
    }
    else {
        $("#LimitNumber").html(LimitNumber);
    }

    var LimitJoinType = "不限制";
    //参与加入限制类别 - 参与条件 （ Fav 已收藏店铺， Order 订购过店铺商品 All 不限制 ）
    if (ActivityMsg.LimitJoinType == "Fav") {
        LimitJoinType = "Fav-已收藏店铺";
    }
    else if (ActivityMsg.LimitJoinType == "Order") {
        LimitJoinType = "Order-订购过店铺商品";
    }
    $("#LimitJoinType").html(LimitJoinType);

    var IsJoinCheck = "无需验证";
    if (ActivityMsg.IsJoinCheck == "true") {
        IsJoinCheck = "需要验证";
    }
    $("#IsJoinCheck").html(IsJoinCheck);

    $("#AcMobile").html(ActivityMsg.AcMobile);
    $("#RegionNameArr").html(ActivityMsg.RegionNameArr);
    $("#AcAddress").html(ActivityMsg.AcAddress);
    //坐标位置
    if (ActivityMsg.Longitude != "" && ActivityMsg.Latitude != "") {

        //打开腾讯地图
        var _urlMap = "https://apis.map.qq.com/uri/v1/marker?marker=coord:" + ActivityMsg.Latitude + "," + ActivityMsg.Longitude + ";title:活动位置;addr:" + ActivityMsg.AcAddress + "&referer=myapp";


        $("#Loction").html("经度-" + ActivityMsg.Longitude + "，纬度-" + ActivityMsg.Latitude + "，<a href=\"" + _urlMap + "\" target=\"_blank\">地图中查看</a>");
    }

    //构造活动图片显示代码
    var myJsVal = "";    for (var i = 0; i < ActivityImgs.length; i++) {        myJsVal += " <a href=\"//" + ActivityImgs[i].ImgURL + "\" target=\"_blank\"><img src=\"//" + ActivityImgs[i].ImgURL + "\" /></a>";
    }    $("#ActivityImgList").html(myJsVal);    //活动参与    $("#JoinCount").html(pReTxtJson.ExtraData.JoinCount + "人");    $("#JoinedCount").html(pReTxtJson.ExtraData.JoinedCount + "人");    $("#SeeJoinActivityA").attr("href", "../ActivityPage/ActivityJoin?ActivityID=" + ActivityMsg.ActivityID);


}




