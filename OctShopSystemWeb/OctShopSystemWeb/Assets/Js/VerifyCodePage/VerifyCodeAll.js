//============各种验证码信息-验证===================//

/**-----定义公共变量------**/
//AjaxURL
var mAjaxUrl = "../VerifyCode/VerifyCodeAll";
//扫描的数据
var mScanData = "";
//判断是否发送了验证请求
var mIsHttpCheck = false;


var mOctWapWebAddrDomain = "";



/**------初始化------**/
$(function () {

    mOctWapWebAddrDomain = $("#hidOctWapWebAddrDomain").val().trim();

    mScanData = $("#hidScanData").val().trim();


    //加载店铺简单信息
    loadShopMsgSimple();

    //显示一个加载进度条
    loadingWin();


    //发送验证请求
    setTimeout(function () {

        VerifyCodeScanData();

    }, 2000);
});


//=====================自定义函数============================//


/**
 * 验证 订单验证码信息是否正确 [待消费/自取]验证
 * */
function VerifyCodeScanData() {

    if (mScanData == "" || mScanData == null) {
        return;
    }

    if (mIsHttpCheck == true) {
        return;
    }

    //构造POST参数
    var dataPOST = {
        "Type": "1", "ScanData": mScanData,
    };
    console.log(dataPOST);

    mIsHttpCheck = true;

    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: mAjaxUrl + "?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("各种验证码信息-验证=" + reTxt);

            //移除加载提示
            closeLoadingWin();

            if (reTxt != "") {
                var _jsonReTxt = JSON.parse(reTxt);
                //alert(reTxt);

                if (_jsonReTxt.ErrMsg != "" && _jsonReTxt.ErrMsg != null && _jsonReTxt.ErrMsg != undefined) {

                    //显示错误提示
                    $("#LogoHintSuccess").hide();
                    $("#LogoHintErr").show();
                    $("#ErrHintContent").html(_jsonReTxt.ErrMsg);
                    //更改样式为红色
                    $(".oct-header").css("background", "red");
                    $(".oct-header").css("border-bottom", "2px solid #F20000");
                    $(".main-logo").css("background", "red");

                    //---------------判断验证信息的类型----------------//
                    if (_jsonReTxt.DataDic.VerifyType == "Coupons") //优惠券
                    {
                        $("#LogoHintErrB").html("优惠券核销失败");
                        $("#LogoHintErrSpan").html(_jsonReTxt.ErrMsg);
                    }

                    if (_jsonReTxt.DataDic.VerifyType == "PresentOrder") //礼品订单
                    {
                        $("#LogoHintErrB").html("礼品订单 [消费/自取] 核销失败");
                        $("#LogoHintErrSpan").html(_jsonReTxt.ErrMsg);
                    }

                    if (_jsonReTxt.DataDic.VerifyType == "ActivityJoin") //活动参与验证信息
                    {
                        $("#LogoHintErrB").html("活动参与验证失败");
                        $("#LogoHintErrSpan").html(_jsonReTxt.ErrMsg);
                    }

                    if (_jsonReTxt.DataDic.VerifyType == "Luckydraw") //抽奖奖品领取验证
                    {
                        $("#LogoHintErrB").html("奖品领取验证失败");
                        $("#LogoHintErrSpan").html(_jsonReTxt.ErrMsg);
                    }



                }

                if (_jsonReTxt.Msg != "" && _jsonReTxt.Msg != null && _jsonReTxt.Msg != undefined) {

                    //显示成功提示
                    $("#LogoHintSuccess").show();
                    $("#LogoHintErr").hide();

                    //-------------判断验证信息的类型---------------//
                    if (_jsonReTxt.DataDic.VerifyType == "Coupons") //优惠券
                    {
                        var CouponsMsg = JSON.parse(_jsonReTxt.DataDic.CouponsMsg);
                        console.log(CouponsMsg);
                        $("#LogoHintSuccessB").html("优惠券核销成功");


                        var CouponsMsg = JSON.parse(_jsonReTxt.DataDic.CouponsMsg);
                        var ModelCouponsMsg = CouponsMsg.ModelCouponsMsg
                        var ModelCouponsIssueMsg = CouponsMsg.ModelCouponsIssueMsg

                        var UserAccAndNick = JSON.parse(_jsonReTxt.DataDic.UserAccAndNick);

                        if (parseFloat(ModelCouponsMsg.UseMoney) > 0) {
                            $("#VerifyContentMain").html("<span>抵用金额：</span><b>&#165; " + ModelCouponsMsg.UseMoney + "</b>");
                        }
                        else if (parseFloat(ModelCouponsMsg.UseDiscount) > 0) {
                            $("#VerifyContentMain").html("<span>抵用折扣：</span><b>" + ModelCouponsMsg.UseDiscount + "折</b>");
                        }

                        var myJsValVerifyContent = "<span>券号：</span><b>" + ModelCouponsIssueMsg.IssueID + "</b>";
                        myJsValVerifyContent += "<span style=\"padding-left: 20px;\"></span>";
                        myJsValVerifyContent += "<span>验证码：</span><b>" + _jsonReTxt.DataDic.VerifyCode + "</b>";
                        $("#VerifyContentSub").html(myJsValVerifyContent);

                        //查看详情
                        $("#BtnSeeDetail").val("查看优惠券详情")
                        $("#BtnSeeDetail").on("click", function () {
                            window.location.href = "" + mOctWapWebAddrDomain + "/Buyer/CouponsDetail?CID=" + ModelCouponsMsg.CouponsID;
                        });

                        //具体的优惠券信息
                        var myJsValVerifyContentUl = "<li>";
                        myJsValVerifyContentUl += "<a href=\"" + mOctWapWebAddrDomain + "/Buyer/CouponsDetail?CID=" + ModelCouponsMsg.CouponsID + "\">" + ModelCouponsMsg.CouponsTitle + "</a>";
                        myJsValVerifyContentUl += "<span>" + UserAccAndNick.UserNick + "<br />" + UserAccAndNick.UserAccount + "</span>";
                        myJsValVerifyContentUl += " </li>";
                        $("#VerifyContentUl").html(myJsValVerifyContentUl);
                    }
                    else if (_jsonReTxt.DataDic.VerifyType == "PresentOrder")//礼品订单
                    {
                        var PresentOrderMsg = JSON.parse(_jsonReTxt.DataDic.PresentOrderMsg);
                        console.log(PresentOrderMsg);
                        $("#LogoHintSuccessB").html("礼品订单 [消费/自取] 核销成功");

                        var UserAccAndNick = JSON.parse(_jsonReTxt.DataDic.UserAccAndNick);


                        $("#VerifyContentMain").html("<span>订单金额：</span><b>&#165; " + PresentOrderMsg.OrderPrice + "</b>");

                        var myJsValVerifyContent = "<span>订单ID：</span><b>" + PresentOrderMsg.PstOrderID + "</b>";
                        myJsValVerifyContent += "<span style=\"padding-left: 20px;\"></span>";
                        myJsValVerifyContent += "<span>验证码：</span><b>" + _jsonReTxt.DataDic.VerifyCode + "</b>";
                        $("#VerifyContentSub").html(myJsValVerifyContent);

                        //查看详情
                        $("#BtnSeeDetail").val("查看订单详情")
                        $("#BtnSeeDetail").on("click", function () {
                            window.location.href = "../PresentPage/PresentOrderDetail?POID=" + PresentOrderMsg.PstOrderID;
                        });

                        //具体的优惠券信息
                        var myJsValVerifyContentUl = "";

                        if (PresentOrderMsg.PresentIDArr.indexOf("^") >= 0) {
                            var PresentIDArr = PresentOrderMsg.PresentIDArr.split("^");
                            var PresentTitleArr = PresentOrderMsg.PresentTitleArr.split("^");
                            var PresentPriceArr = PresentOrderMsg.PresentPriceArr.split("^");
                            var OrderNumArr = PresentOrderMsg.OrderNumArr.split("^");
                            for (var i = 0; i < PresentIDArr.length; i++) {
                                myJsValVerifyContentUl += "<li>";
                                myJsValVerifyContentUl += "<a href=\"" + mOctWapWebAddrDomain + "/Present/PresentDetail?PID=" + PresentIDArr[i] + "\">" + PresentTitleArr[i] + "</a>";
                                myJsValVerifyContentUl += "<span>" + PresentPriceArr[i] + "x" + OrderNumArr[i] + "</span>";
                                myJsValVerifyContentUl += " </li>";
                            }
                        }
                        else {
                            myJsValVerifyContentUl += "<li>";
                            myJsValVerifyContentUl += "<a href=\"" + mOctWapWebAddrDomain + "/Present/PresentDetail?PID=" + PresentOrderMsg.PresentIDArr + "\">" + PresentOrderMsg.PresentTitleArr + "</a>";
                            myJsValVerifyContentUl += "<span>" + PresentOrderMsg.PresentPriceArr + " x " + PresentOrderMsg.OrderNumArr + "</span>";
                            myJsValVerifyContentUl += " </li>";
                        }

                        $("#VerifyContentUl").html(myJsValVerifyContentUl);
                    }
                    else if (_jsonReTxt.DataDic.VerifyType == "ActivityJoin")//活动参与验证信息
                    {
                        var ActivityMsg = JSON.parse(_jsonReTxt.DataDic.ActivityMsg);
                        console.log(ActivityMsg);
                        $("#LogoHintSuccessB").html("活动参与验证成功");

                        var ActivityMsg = JSON.parse(_jsonReTxt.DataDic.ActivityMsg);

                        var UserAccAndNick = JSON.parse(_jsonReTxt.DataDic.UserAccAndNick);

                        //$("#VerifyContentMain").html("<span>报名时间：</span><b>现在可以让会</b>");

                        var myJsValVerifyContent = "<span>活动ID：</span><b>" + ActivityMsg.ActivityID + "</b>";
                        myJsValVerifyContent += "<span style=\"padding-left: 20px;\"></span>";
                        myJsValVerifyContent += "<span>验证码：</span><b>" + _jsonReTxt.DataDic.VerifyCode + "</b>";
                        $("#VerifyContentSub").html(myJsValVerifyContent);

                        //查看详情
                        $("#BtnSeeDetail").val("查看活动详情")
                        $("#BtnSeeDetail").on("click", function () {
                            window.location.href = "" + mOctWapWebAddrDomain + "/Shop/ActivityDetail?AID=" + ActivityMsg.ActivityID
                        });

                        //具体的优惠券信息
                        var myJsValVerifyContentUl = "<li>";
                        myJsValVerifyContentUl += "<a href=\"" + mOctWapWebAddrDomain + "/Shop/ActivityDetail?AID=" + ActivityMsg.ActivityID + "\">" + ActivityMsg.AcTitle + "</a>";
                        myJsValVerifyContentUl += "<span>" + UserAccAndNick.UserNick + "<br />" + UserAccAndNick.UserAccount + "</span>";
                        myJsValVerifyContentUl += " </li>";
                        $("#VerifyContentUl").html(myJsValVerifyContentUl);
                    }
                    else if (_jsonReTxt.DataDic.VerifyType == "Luckydraw")//抽奖奖品领取验证
                    {
                        var LuckydrawMsg = JSON.parse(_jsonReTxt.DataDic.LuckydrawMsg);
                        //console.log(LuckydrawMsg);
                        $("#LogoHintSuccessB").html("奖品领取验证成功");

                        var LuckydrawMsg = JSON.parse(_jsonReTxt.DataDic.LuckydrawMsg);

                        var UserAccAndNick = JSON.parse(_jsonReTxt.DataDic.UserAccAndNick);

                        $("#VerifyContentMain").html("<span>中奖结果：</span><b>" + LuckydrawMsg.AwardsItem + "</b>");

                        var myJsValVerifyContent = "<span>中奖ID：</span><b>" + LuckydrawMsg.LuckyDrawResultID + "</b>";
                        myJsValVerifyContent += "<span style=\"padding-left: 20px;\"></span>";
                        myJsValVerifyContent += "<span>验证码：</span><b>" + _jsonReTxt.DataDic.VerifyCode + "</b>";
                        $("#VerifyContentSub").html(myJsValVerifyContent);

                        //查看详情
                        $("#BtnSeeDetail").val("查看抽奖详情")
                        $("#BtnSeeDetail").on("click", function () {
                            window.location.href = "" + mOctWapWebAddrDomain + "/Buyer/LuckyDrawDetail?LID=" + LuckydrawMsg.LuckydrawID
                        });

                        //具体的优惠券信息
                        var myJsValVerifyContentUl = "<li>";
                        myJsValVerifyContentUl += "<a href=\"" + mOctWapWebAddrDomain + "/Buyer/LuckyDrawDetail?LID=" + LuckydrawMsg.LuckydrawID + "\">" + LuckydrawMsg.LuckydrawTitle + "</a>";
                        myJsValVerifyContentUl += "<span>" + UserAccAndNick.UserNick + "<br />" + UserAccAndNick.UserAccount + "</span>";
                        myJsValVerifyContentUl += " </li>";
                        $("#VerifyContentUl").html(myJsValVerifyContentUl);
                    }


                }

            }
            else {

            }
        },
        error: function (xhr, errorTxt, status) {
            console.log("异步请求错误，errorTxt=" + errorTxt + " | status=" + status);
            return;
        }
    });
}




/**
 * 加载店铺简单信息
 * */
function loadShopMsgSimple() {

    //构造POST参数
    var dataPOST = {
        "Type": "8",
    };
    console.log(dataPOST);
    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: "../Shop/ShopMsg?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("加载店铺简单信息=" + reTxt);
            if (reTxt != "") {
                var _jsonReTxt = JSON.parse(reTxt);
                $("#ShopNameALink").attr("href", mOctWapWebAddrDomain + "/Shop/Index?SID=" + _jsonReTxt.ShopID);

                var myJsVal = "";
                if (_jsonReTxt.ShopHeaderImg == "" || _jsonReTxt.ShopHeaderImg == undefined || _jsonReTxt.ShopHeaderImg == null) {
                    myJsVal += "<img src=\"../Assets/Imgs/Icon/shop_verify.png\" />";
                }
                else {
                    myJsVal += "<img class=\"shop-header-img\" src=\"//" + _jsonReTxt.ShopHeaderImg + "\" />";
                }
                myJsVal += _jsonReTxt.ShopName;
                $("#ShopNameALink").html(myJsVal);

            }
            else {

            }
        },
        error: function (xhr, errorTxt, status) {
            console.log("异步请求错误，errorTxt=" + errorTxt + " | status=" + status);
            return;
        }
    });
}

/**
 * 退出登录
 * */
function exitLogin() {

    confirmWin("确定要退出吗？", function () {

        //构造POST参数
        var dataPOST = {
            "Type": "2",
        };
        console.log(dataPOST);
        //正式发送异步请求
        $.ajax({
            type: "POST",
            url: "../Login/Index?rnd=" + Math.random(),
            data: dataPOST,
            dataType: "html",
            success: function (reTxt, status, xhr) {
                console.log("退出登录=" + reTxt);
                if (reTxt != "") {

                    if (reTxt == "21") {
                        //跳转到登录页
                        window.location.href = "../LoginPage/Index?BackUrl=../LoginPage/LoginedScanPrompt";
                        return;
                    }
                }
                else {

                }
            },
            error: function (xhr, errorTxt, status) {
                console.log("异步请求错误，errorTxt=" + errorTxt + " | status=" + status);
                return;
            }
        });


    });
}




