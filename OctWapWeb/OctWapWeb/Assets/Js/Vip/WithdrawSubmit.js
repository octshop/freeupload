//==============立即提现=========================//


/**-----定义公共变量------**/
//AjaxURL
var mAjaxUrl = "../VipAjax/WithdrawSubmit";

//提现到什么地方 ( 微信钱包 WeChat， 支付宝 Alipay ，银行卡 Bank )
var mToType = "";
//是否在微信中撕开
var mIsInWeiXinBrowse = "";
//微信OPENID
var mWxOpenID = "";
//微信UnionID
var mWxUnionID = "";
//绑定的手机号
var mBindMobile = "";
//当前买家的余额
var mCurrentBalance = "";

//是否正在发送Http请求
var mIsHttpCheck = false;
//定时器
var mTimer = null;
//计数器 以60开始
var mCountNum = 60;




/**------初始化------**/
$(function () {

    mToType = $("#hidToType").val().trim();
    mIsInWeiXinBrowse = $("#hidIsInWeiXinBrowse").val().trim();

    //得到最新没有完成的提现信息ID
    recentNoFinishWithDrawID(function () {

        //根据选择的提现类别,显示表单
        showToType(mToType);

        //获取账户微信注册信息
        getUserAccWeiXinMsg();

        //得到当前买家的余额
        getBuyerCurrentBalance();

        //预加载买家以前最近的提现信息
        loadPreBuyerWithDraw();

    });


});


/**-----------自定义函数-----------**/

/**
 * 得到最新没有完成的提现信息ID
 * */
function recentNoFinishWithDrawID(pCallBack) {

    //构造GET参数
    var dataPOST = {
        "Type": "4",
    };
    //正式发送GET请求
    $.ajax({
        type: "POST",
        url: mAjaxUrl + "?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log(" 得到最新没有完成的提现信息ID=" + reTxt);
            //回调
            pCallBack();

            if (reTxt != "") {
                //转换为Json对象
                var _jsonReTxt = JSON.parse(reTxt);
                if (_jsonReTxt.RecentNoFinishWithDrawID != 0) {
                    window.location.href = "../Vip/WithdrawDetail?WDID=" + _jsonReTxt.RecentNoFinishWithDrawID;
                }
            }
        },
        error: function (xhr, errorTxt, status) {
            console.log("异步请求错误，errorTxt=" + errorTxt + " | status=" + status);
            return;
        }
    });

}

/**
 * 根据选择的提现类别,显示表单
 * @param {any} pToType 提现到什么地方 ( 微信钱包 WeChat， 支付宝 Alipay ，银行卡 Bank )
 */
function showToType(pToType) {

    if (pToType == "WeChat") {
        $("#WxAlipayUl").show();
        $("#BankUl").hide();

        $("#WeChatAccountLi").show();
        $("#AlipayAccountLi").hide();
    }
    else if (pToType == "Alipay") {
        $("#WxAlipayUl").show();
        $("#BankUl").hide();

        $("#WeChatAccountLi").hide();
        $("#AlipayAccountLi").show();
    }
    else if (pToType == "Bank") {
        $("#BankUl").show();
        $("#WxAlipayUl").hide();
    }
}

/**
 * 获取账户微信注册信息
 * */
function getUserAccWeiXinMsg() {

    //构造GET参数
    var dataPOST = {
        "Type": "1",
    };
    //正式发送GET请求
    $.ajax({
        type: "POST",
        url: mAjaxUrl + "?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("获取账户微信注册信息=" + reTxt);
            if (reTxt != "") {
                //转换为Json对象
                var _jsonReTxt = JSON.parse(reTxt);

                if (_jsonReTxt.BindMobile == "" || _jsonReTxt.BindMobile == null || _jsonReTxt.BindMobile == undefined) {

                    toastWinCb("你没有绑定手机，不能提现！", function () {

                        window.location.href = "../Setting/BindMobileChg?BackUrl=../Vip/WithdrawType";

                    }, 4000);
                }
                else {
                    mBindMobile = _jsonReTxt.BindMobile;

                    $("#BindMobileB").html(mBindMobile);
                    $("#LinkMobile").val(mBindMobile);
                    $("#LinkMobileBank").val(mBindMobile);
                    $("#BindMobileBHint").html(mBindMobile);
                }


                if (_jsonReTxt.WxOpenID == "" || _jsonReTxt.WxOpenID == null || _jsonReTxt.WxOpenID == undefined) {

                    if (mToType == "WeChat") {
                        //没有账户微信注册信息 不能提现到微信钱包
                        toastWinCb("账户没有微信注册信息 不能提现到微信钱包", function () {

                            window.location.href = "../Buyer/Index";

                        }, 4000);
                    }

                    return;
                }
                else {
                    mWxOpenID = _jsonReTxt.WxOpenID;
                    mWxUnionID = _jsonReTxt.WxUnionID;
                }



            }
        },
        error: function (xhr, errorTxt, status) {
            console.log("异步请求错误，errorTxt=" + errorTxt + " | status=" + status);
            return;
        }
    });


}

/**
 * 得到当前买家的余额
 * */
function getBuyerCurrentBalance() {

    //构造GET参数
    var dataPOST = {
        "Type": "2",
    };
    //正式发送GET请求
    $.ajax({
        type: "POST",
        url: mAjaxUrl + "?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("得到当前买家的余额=" + reTxt);
            if (reTxt != "") {
                //转换为Json对象
                var _jsonReTxt = JSON.parse(reTxt);

                mCurrentBalance = _jsonReTxt.CurrentBalance;
                $("#CurrentBalanceB").html(mCurrentBalance);

            }
        },
        error: function (xhr, errorTxt, status) {
            console.log("异步请求错误，errorTxt=" + errorTxt + " | status=" + status);
            return;
        }
    });

}

/**
 * 提交添加用户提现请求
 * */
function addBuyerWithDraw() {

    //获取表单值
    var hidToType = $("#hidToType").val().trim();
    var WithDrawAmt = $("#WithDrawAmt").val().trim();
    var WeChatAccount = $("#WeChatAccount").val().trim();
    var AlipayAccount = $("#AlipayAccount").val().trim();
    var TrueName = $("#TrueName").val().trim();
    var LinkMobile = $("#LinkMobile").val().trim();
    var BankCardNumber = $("#BankCardNumber").val().trim();
    var BankAccName = $("#BankAccName").val().trim();
    var OpeningBank = $("#OpeningBank").val().trim();
    var LinkMobileBank = $("#LinkMobileBank").val().trim();
    var VerifyCode = $("#VerifyCode").val().trim();

    if (WithDrawAmt <= 0 || WithDrawAmt == "") {
        toastWin("提现金额必须大于零！");
        return;
    }

    console.log("hidToType=" + hidToType);
    if (hidToType != "Bank") {
        if (TrueName == "" || LinkMobile == "") {
            toastWin("【真实姓名】和【联系电话】不能为空！");
            return;
        }
    }


    if (VerifyCode == "") {
        toastWin("【短信验证码】不能为空！");
        $("#VerifyCode").focus();
        return;
    }

    //提现到什么地方 ( 微信钱包 WeChat， 支付宝 Alipay ，银行卡 Bank )
    if (hidToType == "WeChat") {
        if (WeChatAccount == "") {
            toastWin("【微信号】不能为空！");
            return;
        }
    }
    else if (hidToType == "Alipay") {
        if (AlipayAccount == "") {
            toastWin("【支付宝账号】不能为空！");
            return;
        }
    }
    else if (hidToType == "Bank") {
        if (BankCardNumber == "" || BankAccName == "" || OpeningBank == "" || LinkMobileBank == "") {
            toastWin("所有项必须填写！");
            return;
        }
    }

    if (LinkMobile == "") {
        LinkMobile = LinkMobileBank;
    }


    //构造POST参数
    var dataPOST = {
        "Type": "3", "ToType": hidToType, "WithDrawAmt": WithDrawAmt, "TrueName": TrueName,
        "LinkMobile": LinkMobile, "WeChatAccount": WeChatAccount, "AlipayAccount": AlipayAccount,
        "BankCardNumber": BankCardNumber, "BankAccName": BankAccName, "OpeningBank": OpeningBank, "WithDrawMemo": "", "SmsVerifyCode": VerifyCode,
    };
    console.log(dataPOST);

    //正式发送Http就直接返回
    if (mIsHttpCheck == true) {
        return;
    }
    mIsHttpCheck = true;

    $("#BtnWithdraw").val("…提交中…");
    $("#BtnWithdraw").attr("disabled", true);

    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: mAjaxUrl + "?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("提交添加用户提现请求=" + reTxt);
            //Http请求发送完成
            mIsHttpCheck = false;
            $("#BtnWithdraw").val("立即提现");
            $("#BtnWithdraw").attr("disabled", false);
            if (reTxt != "") {
                //转换成Json对象
                var _jsonReTxt = JSON.parse(reTxt);

                if (_jsonReTxt.ErrMsg != "" && _jsonReTxt.ErrMsg != null && _jsonReTxt.ErrMsg != undefined) {
                    toastWin(_jsonReTxt.ErrMsg);
                    return;
                }

                if (_jsonReTxt.Msg != "" && _jsonReTxt.Msg != null && _jsonReTxt.Msg != undefined) {
                    toastWinCb(_jsonReTxt.Msg, function () {

                        window.location.href = "../Vip/WithdrawDetail?WDID=" + _jsonReTxt.DataDic.RecentWithDrawID;

                    });
                    return;
                }

            }

        },
        error: function (xhr, errorTxt, status) {
            console.log("异步请求错误，errorTxt=" + errorTxt + " | status=" + status);
            return;
        }
    });



}

/**
 * 预加载买家以前最近的提现信息
 * */
function loadPreBuyerWithDraw() {

    //构造GET参数
    var dataPOST = {
        "Type": "6",
    };
    //正式发送GET请求
    $.ajax({
        type: "POST",
        url: mAjaxUrl + "?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("预加载买家以前最近的提现信息=" + reTxt);
            if (reTxt != "") {
                //转换为Json对象
                var _jsonReTxt = JSON.parse(reTxt);

                if (_jsonReTxt.BuyerWithDrawList != null && _jsonReTxt.BuyerWithDrawList != undefined) {

                    var BuyerWithDraw = _jsonReTxt.BuyerWithDrawList[0];

                    $("#WeChatAccount").val(BuyerWithDraw.WeChatAccount);
                    $("#AlipayAccount").val(BuyerWithDraw.AlipayAccount);
                    $("#TrueName").val(BuyerWithDraw.TrueName);
                    $("#LinkMobile").val(BuyerWithDraw.LinkMobile);
                    $("#BankCardNumber").val(BuyerWithDraw.BankCardNumber);
                    $("#BankAccName").val(BuyerWithDraw.BankAccName);
                    $("#OpeningBank").val(BuyerWithDraw.OpeningBank);
                    $("#LinkMobileBank").val(BuyerWithDraw.LinkMobile);

                }

            }
        },
        error: function (xhr, errorTxt, status) {
            console.log("异步请求错误，errorTxt=" + errorTxt + " | status=" + status);
            return;
        }
    });


}

/**--------------获取短信验证码---------------------**/


/**
 * 得到短信验证码
 * */
function getSmsVerifyCode() {

    //获取登录表单值
    //var BindMobile = $("#BindMobile").val().trim();

    if (mBindMobile == "") {
        return;
    }

    //构造POST参数
    var dataPOST = {
        "Type": "1", "ToMobileNumbers": mBindMobile, "SmsType": "BuyerWithDraw",
    };
    console.log(dataPOST);

    //正式发送Http就直接返回
    if (mIsHttpCheck == true) {
        return;
    }
    mIsHttpCheck = true;

    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: "../SmsAjax/Index?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("得到短信验证码=" + reTxt);

            //Http请求发送完成
            mIsHttpCheck = false;

            if (reTxt != "") {

                if (reTxt == "12") {
                    toastWin("手机号码错误,请检查！");
                    return;
                }

                var _jsonReTxt = JSON.parse(reTxt);
                //alert(reTxt);

                if (_jsonReTxt.ErrMsg != "" && _jsonReTxt.ErrMsg != null && _jsonReTxt.ErrMsg != undefined) {

                    toastWin(_jsonReTxt.ErrMsg);
                    return;

                }

                if (_jsonReTxt.Msg != "" && _jsonReTxt.Msg != null && _jsonReTxt.Msg != undefined) {

                    $("#GetSmsVerifyCodeDiv").show();
                    $("#GetSmsVerifyCodeHintDiv").hide();

                    $("#BtnGetVerifyCode").hide();
                    $("#VerifyCode").val("");

                    //启动定时器读秒
                    timerSecond();

                    return;


                }
            }

        },
        error: function (xhr, errorTxt, status) {
            console.log("异步请求错误，errorTxt=" + errorTxt + " | status=" + status);
            return;
        }
    });

}

/**
 * 启动定时器
 * */
function timerSecond() {

    clearInterval(mTimer);
    mTimer = null;
    mTimer = undefined;

    mTimer = setInterval(function () {

        if (mCountNum <= 0) {
            clearInterval(mTimer);
            mTimer = null;
            mTimer = undefined;
            //重置计数器
            mCountNum = 60;

            $("#BtnGetVerifyCode").show();
            $("#VerifyCode").val("");

            $("#GetSmsVerifyCodeDiv").hide();
            $("#GetSmsVerifyCodeHintDiv").show();

            return
        }

        mCountNum--;
        $("#TimerSecondI").html(mCountNum + "秒");

    }, 1000);

}



