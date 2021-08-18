//===============银行转账====================//

/**-----定义公共变量------**/

//AjaxURL
var mAjaxUrl = "../OrderAjax/BankTransfer";
//交易号
var mBillNum = "";
//买家UserID
var mBuyerUserID = "0";
//上传图片的UploadGuid
var mUploadGuid = "";
//BillNumber总额
var mTotalOrderPrice = "0";

//标记是否上传了汇款凭证
var mIsUploadCertImg = false; //没有上传



/**------初始化------**/
$(function () {

    //初始化交易号
    mBillNum = $("#hidBillNum").val().trim();
    mBuyerUserID = $("#hidBuyerUserID").val().trim();
    mUploadGuid = $("#hidUploadGuid").val().trim();

    //初始化转账付款支付信息
    initPayTransBankMsg(mBillNum);

    //初始化上传转账汇款照片
    initUploadTransCertImg();

});

/**
 * 初始化转账付款支付信息 [订单信息,平台转账银行信息,买家之前的转账汇款信息,]
 * */
function initPayTransBankMsg(pBillNumber) {

    console.log("pBillNumber=" + pBillNumber);

    //构造POST参数
    var dataPOST = {
        "Type": "1", "BillNumber": pBillNumber,
    };
    console.log(dataPOST);

    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: mAjaxUrl + "?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("初始化转账付款支付信息=" + reTxt);
            if (reTxt != "") {

                //转换成功Json对象
                var _reTxtJson = JSON.parse(reTxt);
                if (_reTxtJson.ErrMsg != "" && _reTxtJson.ErrMsg != null && _reTxtJson.ErrMsg != undefined) {
                    toastWin(_reTxtJson.ErrMsg);
                    return;
                }
                //设置值到HTML中
                setValToForm(_reTxtJson);
            }
        }
    });
}

/**
 * 设置值到HTML中
 * @param {any} pReTxtJson Http返回的Json对象
 */
function setValToForm(pReTxtJson) {

    var OrderMsg = pReTxtJson.OrderMsg;
    var PayTransBankMsg = pReTxtJson.PayTransBankMsg;
    var InitPayTransRecord = pReTxtJson.InitPayTransRecord;
    //订单列表
    var OrderIDArr = new Array();
    if (OrderMsg.OrderIDArr.indexOf("^") >= 0) {
        OrderIDArr = OrderMsg.OrderIDArr.split("^");
    }
    else {
        OrderIDArr[0] = OrderMsg.OrderIDArr;
    }

    //订单信息
    mTotalOrderPrice = OrderMsg.TotalOrderPrice;
    $("#TotalOrderPrice").html("&#165; " + OrderMsg.TotalOrderPrice);


    //构造汇款备注
    var _memoStr = "订单：";
    for (var i = 0; i < OrderIDArr.length; i++) {
        _memoStr += "<a href=\"../Order/OrderDetail?OID=" + OrderIDArr[i] + "\">" + OrderIDArr[i] + "</a>，";
    }
    $("#TransMemo").html(_memoStr);

    //平台官方汇款账号信息
    $("#BankAccName").html(PayTransBankMsg.BankAccName);
    $("#BankAccount").html(PayTransBankMsg.BankAccount);
    $("#OpenAccBank").html(PayTransBankMsg.OpenAccBank);

    //初始化 买家汇款确认信息
    $("#BuyerBankName").val(InitPayTransRecord.BuyerBankName);
    $("#BuyerBankAcc").val(InitPayTransRecord.BuyerBankAcc);
    $("#BankName").val(InitPayTransRecord.BankName);
    if (InitPayTransRecord.BillNumber == mBillNum && InitPayTransRecord.TransCertImg != null && InitPayTransRecord.TransCertImg != "") {

        $("#TransCertImg").attr("src", "//" + InitPayTransRecord.TransCertImg + "?rnd=" + Math.round);

        $("#BtnSubmitTransfer").val("保存汇款确认信息");

        mIsUploadCertImg = true; //上传啦
    }

}

/**
 * 提交买家汇款信息
 * */
function submitPayTransRecord() {

    var BuyerBankName = $("#BuyerBankName").val().trim();
    var BuyerBankAcc = $("#BuyerBankAcc").val().trim();
    var BankName = $("#BankName").val().trim();

    if (BuyerBankName == "" || BuyerBankAcc == "" || BankName == "") {
        toastWin("汇款账户名,汇款银行账号,汇款银行名称都不能为空！");
        return;
    }

    if (mIsUploadCertImg == false) {
        toastWin("请上传汇款凭证！");
        return;
    }

    //加载提示
    $("#BtnSubmitTransfer").val("…提交中…");
    $("#BtnSubmitTransfer").attr("disabled", true);

    //构造POST参数
    var dataPOST = {
        "Type": "4", "BuyerBankName": BuyerBankName,
        "BuyerBankAcc": BuyerBankAcc, "BankName": BankName, "TotalOrderPrice": mTotalOrderPrice, "UploadGuid": mUploadGuid, "BillNumber": mBillNum,
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

                //保存成功
                if (_jsonReTxt.Code != null) {
                    //如果只有一个订单则跳转订单详情,否则跳转到我的订购
                    if (_jsonReTxt.DataDic.OrderIDArr.indexOf("^") >= 0) {
                        window.location.href = "../Buyer/MyOrder";
                    }
                    else {
                        window.location.href = "../Order/OrderDetail?OID=" + _jsonReTxt.DataDic.OrderIDArr;
                    }
                    return;
                }
                //错误提示
                if (_jsonReTxt.ErrCode != null) {
                    toastWin(_jsonReTxt.ErrMsg);
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


//----------------------照片上传---------------------//
/**
 * 初始化上传转账汇款照片
 */
function initUploadTransCertImg() {


    //构造POST参数
    var _dataPost = "Type=2&UploadGuid=" + mUploadGuid;

    $('#fileupload_0').fileupload({
        url: mAjaxUrl + "?" + _dataPost + "&rnd=" + Math.random(),
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

            mImgKeyGuid = _JsonObj.DataDic.ImgKeyGuid;
            mImgPathDomain = _JsonObj.DataDic.ImgPathDomain;
            console.log("mImgKeyGuid=" + mImgKeyGuid + " | mImgPathDomain=" + mImgPathDomain);

            //获取图片域名 localhost:1400/Upload/ShopHeaderImg/SHI_1_201906160949557860.jpg
            var _domain = mImgPathDomain.substring(0, mImgPathDomain.indexOf("/"));
            console.log("_domain=" + _domain);
            //获取图片相对路径 
            var _imgPath = mImgPathDomain.replace(_domain + "/", "");
            console.log("_imgPath=" + _imgPath);

            //为Img赋值
            $("#TransCertImg").attr("src", "//" + _domain + "/" + _imgPath + "?rnd=" + Math.random());
            $("#TransCertImgA").attr("href", "//" + _domain + "/" + _imgPath + "?rnd=" + Math.random());
            //提交买家转账凭证照片信息
            submitTransCertImg(mImgPathDomain, mImgKeyGuid);
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
 * 提交买家转账凭证照片信息
 * @param {any} pTransCertImg 图片URL ( localhost:1400/Upload/ShopHeaderImg/SHI_1_201906160924530250.jpg )
 * @param {any} pUploadGuid 上传GUID
 */
function submitTransCertImg(pTransCertImg, pUploadGuid) {

    //获取图片域名 localhost:1400/Upload/ShopHeaderImg/SHI_1_201906160949557860.jpg
    var _domain = pTransCertImg.substring(0, pTransCertImg.indexOf("/"));
    console.log("_domain=" + _domain);
    //获取图片相对路径 
    var _imgPath = pTransCertImg.replace(_domain + "/", "");
    console.log("_imgPath=" + _imgPath);

    //构造POST参数
    var dataPOST = {
        "Type": "3", "ImgPath": pTransCertImg,
        "UploadGuid": pUploadGuid, "BillNumber": mBillNum,
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

                //保存成功
                if (_jsonReTxt.Code != null) {

                    mIsUploadCertImg = true; //上传了汇款凭证

                    return;
                }
                //错误提示
                if (_jsonReTxt.ErrCode != null) {
                    toastWin(_jsonReTxt.ErrMsg);
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

