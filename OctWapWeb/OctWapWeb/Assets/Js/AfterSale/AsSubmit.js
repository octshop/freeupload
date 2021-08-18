//==============提交维修申请=========================//

/**-----定义公共变量------**/
var mAjaxUrl = "../AfterSaleAjax/AsSubmit";

var mOID = ""; //订单ID
var mGID = ""; //商品ID
var mSpecID = "";//申请商品的规格属性ID
var mApplyGoodsNum = "1"; //申请数量
var mBReceiAddrID = ""; //新选择的收货地址ID
var mServiceType = ""; //服务类型 (maintain 维修 barter 换货 , refund 退货)



/**------初始化------**/
$(function () {

    mOID = $("#hidOID").val().trim();
    mGID = $("#hidGID").val().trim();
    mSpecID = $("#hidSID").val().trim();

    mApplyGoodsNum = $("#hidApplyGoodsNum").val().trim();
    mBReceiAddrID = $("#hidBReceiAddrID").val().trim();
    mServiceType = $("#hidServiceType").val().trim();

    //如果是退款货则隐藏选择 服务/收货地址
    if (mServiceType == "refund") {
        $("#AsReceiAddr").hide();
    }
    else {
        $("#AsReceiAddr").show();
    }

    //初始化售后申请的订单商品信息
    initAsOrderGoodsMsg();

    if (mBReceiAddrID == "") {
        //初始化订单收货地址信息
        initOrderDelivery();
    }
    else {
        //初始化新选择的收货地址 
        initSelBuyerReceiAddr();
    }

    //-----初始化上传插件---//
    initUploadImg(0);

    
});


/**===================自定义函数======================**/

/**
 * 初始化售后申请的订单商品信息
 * */
function initAsOrderGoodsMsg() {
    //构造POST参数
    var dataPOST = {
        "Type": "1", "OrderID": mOID, "GoodsID": mGID, "SpecID": mSpecID,
    };
    console.log(dataPOST);
    //正式发送异步请求
    $.ajax({
        type: "POST",
        url:  "../AfterSaleAjax/AsSelType?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("初始化售后申请的订单商品信息=" + reTxt);
            if (reTxt != "") {
                var _jsonReTxt = JSON.parse(reTxt);

                if (_jsonReTxt.GoodsTitle.length > 35) {
                    _jsonReTxt.GoodsTitle = _jsonReTxt.GoodsTitle.substring(0, 34) + "..."
                }

                $("#ShopLinkA").attr("href", "../Shop/Index?SID=" + _jsonReTxt.ShopID + "");
                $("#ShopLinkA").html(_jsonReTxt.ShopName);
                $("#GoodsImg").attr("src", "//" + _jsonReTxt.GoodsCoverImgPath + "");
                $("#GoodsTitle").html(_jsonReTxt.GoodsTitle);
                $("#GoodsSpec").html(_jsonReTxt.SpecParamVal);
                $("#GoodsPrice").html("&#165;" + _jsonReTxt.GoodsUnitPrice);
                $("#OrderNum").html(_jsonReTxt.OrderNum);

                $("#ApplyNum").html(mApplyGoodsNum);

              }
        }
    });
}

/**
 * 选择申请原因值
 * @param {any} pApplyReasonVal 早请原因值
 */
function selApplyReasonVal(pApplyReasonVal) {
    $("#ApplyReasonVal").text(pApplyReasonVal.trim());
    //关闭窗口
    toggleSilderDownWin();
}

/**
 * 初始化订单收货地址信息
 * */
function initOrderDelivery() {

    //构造POST参数
    var dataPOST = {
        "Type": "1", "OrderID": mOID,
    };
    console.log(dataPOST);
    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: mAjaxUrl + "?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("初始化订单收货地址信息=" + reTxt);
            if (reTxt != "") {

                var _jsonReTxt = JSON.parse(reTxt);
                if (_jsonReTxt.Mobile != null && _jsonReTxt.Mobile != "") {
                    //赋值显示代码
                    $("#ReceiAddrDetail").html(_jsonReTxt.RegionNameArr + "_" + _jsonReTxt.DetailAddr);
                    $("#DeliName").val(_jsonReTxt.DeliName);
                    $("#Mobile").val(_jsonReTxt.Mobile);
                    $("#hidRegionCodeArr").val(_jsonReTxt.RegionCodeArr);
                    $("#hidRegionNameArr").val(_jsonReTxt.RegionNameArr);
                    $("#hidDetailAddr").val(_jsonReTxt.DetailAddr);
                }
            }
        }
    });
}

/**
 * 初始化新选择的收货地址
 * */
function initSelBuyerReceiAddr() {

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
            console.log("初始化新选择的收货地址=" + reTxt);
            if (reTxt != "") {

                var _jsonReTxt = JSON.parse(reTxt);
                if (_jsonReTxt.Mobile != null && _jsonReTxt.Mobile != "") {
                    //赋值显示代码
                    $("#ReceiAddrDetail").html(_jsonReTxt.RegionNameArr + "_" + _jsonReTxt.DetailAddr);
                    $("#DeliName").val(_jsonReTxt.ReceiName);
                    $("#Mobile").val(_jsonReTxt.Mobile);
                    $("#hidRegionCodeArr").val(_jsonReTxt.RegionCodeArr);
                    $("#hidRegionNameArr").val(_jsonReTxt.RegionNameArr);
                    $("#hidDetailAddr").val(_jsonReTxt.DetailAddr);
                }
            }
        }
    });

}


/**
 * -------打开投诉类型窗口------
 */
var mAsReasonTypeWinHtml = "";
function openAsReasonTypeWin() {

    if (mAsReasonTypeWinHtml == "") {

        mAsReasonTypeWinHtml = getAsReasonTypeWinHtml();
    }
    //初始化SliderDown窗口
    initSilderDownWin(600, mAsReasonTypeWinHtml);

    toggleSilderDownWin();

}
/**
 * 得到窗口显示代码
 */
function getAsReasonTypeWinHtml() {

    var _html = $("#WinSelReasonType").html();

    $("#WinSelReasonType").html("");
    $("#WinSelReasonType").remove();
    $("body").remove("#WinSelReasonType");

    mAsReasonTypeWinHtml = "";

    return _html
}

/**
 * 提交售后申请信息
 * */
function submitAsApplyMsg() {

    //获取表单值
    var hidOID = $("#hidOID").val().trim();
    var hidGID = $("#hidGID").val().trim();
    var hidApplyGoodsNum = $("#hidApplyGoodsNum").val().trim();

    //var hidBReceiAddrID = $("#hidBReceiAddrID").val().trim();

    var ApplyReasonVal = $("#ApplyReasonVal").text().trim();
    var ProblemDescTxtArea = $("#ProblemDescTxtArea").val().trim();
    var hidUploadGuid_0 = $("#hidUploadGuid_0").val().trim();

    //服务收货地址
    var hidRegionCodeArr = $("#hidRegionCodeArr").val().trim();
    var hidRegionNameArr = $("#hidRegionNameArr").val().trim();
    var hidDetailAddr = $("#hidDetailAddr").val().trim();
    //var ReceiAddrDetail = $("#ReceiAddrDetail").val().trim();
    var DeliName = $("#DeliName").val().trim();
    var Mobile = $("#Mobile").val().trim();


    //构造上传图片路径字符串数组  
    //localhost:1400/Upload/GooAppraiseImg/GAI_10006_202005091850052300.jpg ^ localhost:1400/Upload/GooAppraiseImg/GAI_10006_202005091850052300.jpg
    var _imgPathArr = getImgPathArr();

    //判断输入
    if (ApplyReasonVal == "" || ApplyReasonVal.indexOf("请选择") >= 0) {
        toastWin("请选择【申请原因】!");
        return;
    }
    if (ProblemDescTxtArea == "") {
        toastWin("请填写【问题描述】!");
        $("#ProblemDescTxtArea").focus();
        return
    }

    if (mServiceType != "refund") {
        if (hidRegionCodeArr == "" || hidRegionNameArr == "") {
            toastWin("请选择【服务/收货地址】!");
            return
        }
        if (DeliName == "" || Mobile == "") {
            toastWin("【联系人】【联系电话】都不能为空!");
            return
        }
    }
    

    //构造POST参数
    var dataPOST = {
        "Type": "3", "OrderID": hidOID, "GoodsID": hidGID, "SpecID": mSpecID, "ApplyGoodsNum": hidApplyGoodsNum, "ApplyReason": ApplyReasonVal, "ProblemDesc": ProblemDescTxtArea, "UploadGuid": hidUploadGuid_0, "ImgPathArr": _imgPathArr, "DeliName": DeliName, "Mobile": Mobile, "RegionCodeArr": hidRegionCodeArr, "RegionNameArr": hidRegionNameArr, "DetailAddr": hidDetailAddr, "ServiceType": mServiceType, 
    };
    console.log(dataPOST);

    //加载提示
    $("#BtnApply").val("…提交中…");
    $("#BtnApply").attr("disabled",true);

    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: mAjaxUrl + "?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("提交售后申请信息=" + reTxt);

            //移除加载提示
            $("#BtnApply").val("提交申请");
            $("#BtnApply").attr("disabled", false);

            if (reTxt != "") {
                var _jsonReTxt = JSON.parse(reTxt);

                if (_jsonReTxt.ErrMsg != "" && _jsonReTxt.ErrMsg != null && _jsonReTxt.ErrMsg != undefined) {
                    toastWin(_jsonReTxt.ErrMsg);
                    return;
                }

                if (_jsonReTxt.Msg != "" && _jsonReTxt.Msg != null && _jsonReTxt.Msg != undefined) {
                    toastWinCb(_jsonReTxt.Msg, function () {
                        window.location.href = "../AfterSale/AsDetail?AID=" + _jsonReTxt.DataDic.ApplyID;
                    });
                    return;
                }


                
            }


        }
    });

}



//======================上传图片区域========================//

/**
 * 初始化上传插件
 * @param {any} pFileIndex 上传文件域索引 从 0 开始
 */
function initUploadImg(pFileIndex) {

    //上传的GUID
    $("#hidUploadGuid_" + pFileIndex).val(getNewGuid());
    var _UploadGuid = $("#hidUploadGuid_" + pFileIndex).val().trim();

    //构造POST参数
    var _dataPost = "Type=1&UploadGuid=" + _UploadGuid;
    console.log(_dataPost);

    $('#fileupload_' + pFileIndex).fileupload({
        url: "../FileUploadAjax/AfterSaleProblemImgs?" + _dataPost + "&rnd=" + Math.random(),
        //dataType: 'json',
        dataType: "text",
        //------------处理上传成功后的事件------------//
        done: function (e, data) {

            //关闭加载提示
            closeLoadingWin();

            //-------------此处是返回后后台文件输出的内容----------------//
            console.log(data.result);
            //alert(data.result);
            //对象化JSON字符串
            var _JsonObj = JSON.parse(data.result);

            //操作错误提示
            if (_JsonObj.ErrCode != null) {
                toastWin(_JsonObj.ErrMsg);
                return;
            }

            var mImgKeyGuid = _JsonObj.DataDic.ImgKeyGuid;
            var mImgPathDomain = _JsonObj.DataDic.ImgPathDomain;
            console.log("mImgKeyGuid=" + mImgKeyGuid + " | mImgPathDomain=" + mImgPathDomain);

            //插入与显示上传的图片
            insertUploadPreItem(mImgPathDomain, mImgKeyGuid, pFileIndex);

            ////为隐藏换件记录UploadGuid赋值
            //$("#hidUploadGuid_" + pFileIndex).val(mImgKeyGuid);

            ////获取图片域名 localhost:1400/Upload/ShopHeaderImg/SHI_1_201906160949557860.jpg
            //var _domain = mImgPathDomain.substring(0, mImgPathDomain.indexOf("/"));
            //console.log("_domain=" + _domain);
            ////获取图片相对路径 
            //var _imgPath = mImgPathDomain.replace(_domain + "/", "");
            //console.log("_imgPath=" + _imgPath);

            ////构造显示代码 显示上传后的图片
            //var _xhtml = "";
            //_xhtml += "<a href=\"//" + mImgPathDomain + "\" target=\"_blank\">";
            //_xhtml += " <img src=\"//" + mImgPathDomain + "\" />";
            //_xhtml += "</a>";
            //$("#FileUploadPreImg_" + pFileIndex).html(_xhtml);


        },

        //---------------处理上传进度的方法-------------//
        progressall: function (e, data) {

            console.log("progressall 执行");

            var progress = parseInt(data.loaded / data.total * 100, 10);
            $('#progress').css(
                'width',
                progress + '%'
            );

            //输出进度
            console.log("上传的进度：" + progress);

            if (progress >= 100) {
                //alert("上传成功！");
            }


        }
    }).prop('disabled', !$.support.fileInput)
        .parent().addClass($.support.fileInput ? undefined : 'disabled').on('fileuploadadd', function (e, data) {

            console.log("添加了文件");
            //显示加载提示
            loadingWin();
            $(".loading-win-content").css("width", "130");
        });
}

/**
 * 插入与显示上传的图片
 * @param {any} pImgPathDomain localhost:1400/Upload/GooAppraiseImg/GAI_10006_202005091850052300.jpg
 * @param {any} pImgKeyGuid 7fba88e9-8622-5434-a251-7505cc085ed5
 * @param pItemIndex 列表Item索引
 */
function insertUploadPreItem(pImgPathDomain, pImgKeyGuid, pItemIndex) {

    var _uploadPreItemArr = $(".upload-pre-item_" + pItemIndex);
    console.log(_uploadPreItemArr);
    for (var i = 0; i < _uploadPreItemArr.length; i++) {
        var _uploadPreItemHtml = $(_uploadPreItemArr[i]).html().trim();
        console.log("_uploadPreItemHtml=" + _uploadPreItemHtml);
        if (_uploadPreItemHtml.indexOf("无照片") >= 0) {

            var myJsVal = "<img src=\"//" + pImgPathDomain + "\" />";            myJsVal += "<img class=\"icon-del\" src=\"../Assets/Imgs/Icon/icon-del.png\" onclick=\"delUploadImg('" + pImgKeyGuid + "','" + pImgPathDomain + "'," + pItemIndex + "," + i + ")\" />";            $(_uploadPreItemArr[i]).attr("data-upload", pImgPathDomain + "^" + pImgKeyGuid);            $(_uploadPreItemArr[i]).html(myJsVal);            return;        }
    }
}

/**
 * 删除上传的图片
 * @param {any} pUploadGuid 上传的GUID
 * @param pImgPath 图片的路径  localhost:1400/Upload/GooAppraiseImg/GAI_10006_202005091850052300.jpg
 * @param pPreImgIndex 预览图片的项索引
 * @param pItemIndex 列表Item索引
 */
function delUploadImg(pUploadGuid, pImgPath, pItemIndex, pPreImgIndex) {

    //去掉图片路径的域名
    pImgPath = pImgPath.substring(pImgPath.indexOf("/") + 1);
    console.log("pImgPath=" + pImgPath);

    //构造POST参数
    var dataPOST = {
        "Type": "3", "ImgKeyGuid": pUploadGuid, "ImgPath": pImgPath
    };
    console.log(dataPOST);
    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: "../FileUploadAjax/AfterSaleProblemImgs?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("删除上传的图片=" + reTxt);
            if (reTxt != "") {
                var _jsonReTxt = JSON.parse(reTxt);

                if (_jsonReTxt.Msg != null && _jsonReTxt.Msg != undefined && _jsonReTxt.Msg != "") {

                    $("#UploadPreItem_" + pItemIndex + "_" + pPreImgIndex).html("无照片");

                    console.log("UploadPreItem_" + pItemIndex + "_" + pPreImgIndex);
                }


            }
        }
    });
}

/**
 * 获取上传的图片路径 拼接字符串  localhost:1400/Upload/GooAppraiseImg/GAI_10006_202005091850052300.jpg ^ localhost:1400/Upload/GooAppraiseImg/GAI_10006_202005091850052300.jpg
 * */
function getImgPathArr() {
    var _uploadPreItemArr = $(".upload-pre-item_0");
    //console.log(_uploadPreItemArr);

    var _imgPathArr = "";
    for (var i = 0; i < _uploadPreItemArr.length; i++) {

        var _dataUpload = $(_uploadPreItemArr[i]).attr("data-upload");
        if (_dataUpload != "") {
            var _dataUploadImgPath = _dataUpload.split("^")[0];
            _imgPathArr += _dataUploadImgPath + "^";
            continue;
        }
    }
    //移除前后"^"
    _imgPathArr = removeFrontAndBackChar(_imgPathArr, "^");

    return _imgPathArr;
}





