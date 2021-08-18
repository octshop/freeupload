//========================添加收货地址=========================//

/**-----定义公共变量------**/
var mAjaxUrl = "../BuyerAjax/ReceiAddrAdd";

//买家UserID
var mBuyerUserID = "";

/**------初始化------**/
$(function () {

    mBuyerUserID = $("#hidBuyerUserID").val().trim();

    //初始化省市县区域范围值
    initRegionCodeName();

    //配置参数
    var switchConfig = {
        checked: false,
        onSwitchColor: '#FF5700',
        onChange: function (data) {

            console.log("执行了…… ");
            console.log(data);

        }
    };
    //新建对象
    var switchBtn = new Switch(document.querySelector('.switch-default-1'), switchConfig);
    //switchBtn.on();
});

/**
 * 添加买家收货地址
 * */
function addReceiAddr() {

    //获取表单值
    var ReceiName = $("#ReceiName").val().trim();
    var Mobile = $("#Mobile").val().trim();

    var region_province = $("#region_province").val().trim();
    var region_city = $("#region_city").val().trim();
    var region_county = $("#region_county").val().trim();

    var DetailAddr = $("#DetailAddr").val().trim();

    //判断是否为空
    if (ReceiName == "" || Mobile == "" || DetailAddr == "" || region_county == "") {
        toastWin("【收货地址】填写不完整！");
        return;
    }

    //判断手机号是否正确
    if (checkMobileNumber(Mobile) == false) {
        toastWin("【联系手机】不正确！");
        return;
    }

    var AddrType = "general";
    if ($("#AddrType").is(":checked")) {
        AddrType = "default";
    }
    var RegionCodeArr = region_province + "_" + region_city + "_" + region_county;

    //获取返回的URL
    var _backUrl = getCurrentUrlParam("BackUrl");


    //构造POST参数
    var dataPOST = {
        "Type": "1", "ReceiName": ReceiName, "Mobile": Mobile, "DetailAddr": DetailAddr,
        "AddrType": AddrType, "RegionCodeArr": RegionCodeArr, "BackUrl": _backUrl,
    };
    console.log(dataPOST);
    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: mAjaxUrl + "?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log(reTxt);
            if (reTxt != "") {
                var _jsonReTxt = JSON.parse(reTxt);
                if (_jsonReTxt.Msg != null && _jsonReTxt.Msg != "") {
                    toastWinCb(_jsonReTxt.Msg, function () {

                        //console.log("_backUrl=" + _backUrl);
                        if (_backUrl != undefined && _backUrl != "" && _backUrl != null) {

                            //判断是否是【订单支付页】跳转过来的
                            if (_backUrl.indexOf("OrderPay") >= 0 || _backUrl.indexOf("AfterSale") >= 0) {
                                //跳转到返回URL页面
                                window.location.href = _backUrl + "&BID=" + _jsonReTxt.DataDic.BReceiAddrID;
                            }
                            else {
                                //跳转到返回URL页面
                                window.location.href = _backUrl + "#GoodsSpec";
                            }
                        }
                        else {
                            //跳转到收货地址列表页
                            window.location.href = "../Buyer/ReceiAddrList";
                        }

                    });
                    return;
                }
                if (_jsonReTxt.ErrMsg != null && _jsonReTxt.ErrMsg != "") {
                    toastWin(_jsonReTxt.ErrMsg);
                    return;
                }

            }
        }
    });


}

