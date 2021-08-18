//========================添加收货地址=========================//

/**-----定义公共变量------**/
var mAjaxUrl = "../BuyerAjax/ReceiAddrEdit";

//买家UserID
var mBReceiAddrID = "";

var switchBtn; //switch按钮

/**------初始化------**/
$(function () {

    mBReceiAddrID = $("#hidBReceiAddrID").val().trim();

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
    switchBtn = new Switch(document.querySelector('.switch-default-1'), switchConfig);
    //switchBtn.on();

    //初始化买家收货地址
    initBuyerReceiAddr();
});

/**
 * 初始化买家收货地址
 * */
function initBuyerReceiAddr() {

    //构造POST参数
    var dataPOST = {
        "Type": "2", "BReceiAddrID": mBReceiAddrID,
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
       
                //给表单赋值
                setValToForm(_jsonReTxt);
            }
        }
    });
}

/**
 * 给表单赋值
 * @param {any} pJsonReTxt 返回的Json对象
 */
function setValToForm(pJsonReTxt) {

    $("#ReceiName").val(pJsonReTxt.ReceiName);
    $("#Mobile").val(pJsonReTxt.Mobile);

    var _RegionCodeArr = pJsonReTxt.RegionCodeArr.split("_");
    //初始化区域范围值
    initRegionCodeNameDefaultVal(_RegionCodeArr[0], _RegionCodeArr[1], _RegionCodeArr[2]);

    $("#DetailAddr").val(pJsonReTxt.DetailAddr);

    if (pJsonReTxt.AddrType == "default") {
        switchBtn.on();
        //console.log("执行了");
    }
}

/**
 * 编辑买家收货地址
 * */
function editBuyerReceiAddr() {
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

    //构造POST参数
    var dataPOST = {
        "Type": "1", "BReceiAddrID": mBReceiAddrID, "ReceiName": ReceiName, "Mobile": Mobile, "DetailAddr": DetailAddr,
        "AddrType": AddrType, "RegionCodeArr": RegionCodeArr,
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
                        //跳转到收货地址列表页
                        //window.location.href = "../Buyer/ReceiAddrList";
                        window.history.back(-1);
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