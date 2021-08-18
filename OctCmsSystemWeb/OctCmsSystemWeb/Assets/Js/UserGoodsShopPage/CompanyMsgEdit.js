//================编辑公司信息========================//

/**-----定义公共变量------**/

//AjaxURL
var mAjaxUrl = "../UserGoodsShop/CompanyMsgEdit";

//信息ID,公司ID
var mMsgID = 0; //CompanyID
//商家UserID
var mUserID = 0;

//上传的参数
var mImgKeyGuid = "";
var mImgPathDomain = "";

//判断是否存在帐号信息
var mExistAccount = true;


/**------初始化------**/
$(function () {

});


/**
 * 初始化买家信息
 */
function initBuyerMsg() {

    //获取账号值
    var UserAccount = $("#UserAccount").val().trim();
    if (UserAccount == "") {
        $("#CompanyAccHintDiv").html("输入公司的用户账号(注册的手机号)");
        return;
    }

    //构造POST参数
    var dataPOST = {
        "Type": "1", "UserAccount": UserAccount, "IsAdd": "false",
    };
    console.log(dataPOST);


    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: "../UserGoodsShop/CompanyMsgAdd?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log(reTxt);
            if (reTxt != "") {

                //账号已存在店铺不能重复添加
                if (reTxt == "54") {
                    //$("#CompanyAccHintDiv").html("<span style=\"color:red\">账号已有公司信息,不能重复添加!</span>");
                    //存在账号信息
                    mExistAccount = true;
                    return;
                }

                var _jsonReTxt = JSON.parse(reTxt);
                if (_jsonReTxt.UserID != 0) {

                    var myJsVal = "";
                    myJsVal += " <img src=\"" + _jsonReTxt.HeaderImg + "\" class=\"img-header\" /><span>" + _jsonReTxt.UserNick + "</span>，<span>UserID：" + _jsonReTxt.UserID + "</span>";
                    $("#CompanyAccHintDiv").html(myJsVal);

                    //存在账号信息
                    mExistAccount = true;
                    return
                }
                else {
                    $("#CompanyAccHintDiv").html("<span style=\"color:red\">账号不存在!</span>");
                }
            }
            else {
                $("#CompanyAccHintDiv").html("输入公司的用户账号(注册的手机号)");
            }

            //不存在账号信息
            mExistAccount = false;
        },
        error: function (xhr, errorTxt, status) {
            console.log("异步请求错误，errorTxt=" + errorTxt + " | status=" + status);
            return;
        }
    });
}


/**
 * 保存公司信息
 */
function saveCompanyMsg() {

    //获取表单值
    var hidCompanyID = $("#hidCompanyID").val().trim();

    var UserAccount = $("#UserAccount").val().trim();
    var CompanyName = $("#CompanyName").val().trim();
    var RegAddress = $("#RegAddress").val().trim();
    var CreditCode = $("#CreditCode").val().trim();
    var LegalPerson = $("#LegalPerson").val().trim();
    var RegMoney = $("#RegMoney").val().trim();
    var SetUpDate = $("#SetUpDate").val().trim();
    var BusiScope = $("#BusiScope").val().trim();

    if (UserAccount == "" || CompanyName == "" || RegAddress == "" || CreditCode == "" || LegalPerson == "" || RegMoney == "" || SetUpDate == "" || BusiScope == "") {
        toastWin("所有项都必须填写！");
        return;
    }

    //注册资本必须为数字
    if (isNaN(RegMoney)) {
        toastWin("【注册资本】必须为数字！");
        ("#RegMoney").focus();
        return;
    }

    if (mExistAccount == false) {
        toastWin("【用户账号】错误！");
        $("#UserAccount").focus();
        return;
    }

    //构造POST参数
    var dataPOST = {
        "Type": "2", "CompanyID": hidCompanyID, "UserAccount": UserAccount, "CompanyName": CompanyName,
        "RegAddress": RegAddress, "CreditCode": CreditCode, "LegalPerson": LegalPerson,
        "RegMoney": RegMoney, "SetUpDate": SetUpDate, "BusiScope": BusiScope,
    };
    console.log(dataPOST);
    //加载提示
    loadingWin();
    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: "../UserGoodsShop/CompanyMsgAdd?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log(reTxt);
            //关闭加载提示
            closeLoadingWin();

            if (reTxt != "") {
                var _jsonReTxt = JSON.parse(reTxt);
                if (_jsonReTxt.Code == "SCMA_03") {
                    //记录公司ID
                    mMsgID = _jsonReTxt.DataDic.CompanyID;
                    mUserID = _jsonReTxt.DataDic.UserID;

                    toastWinCb("公司信息保存成功,请上传证件和资质！", function () {

                        $("#CompanyMsgDiv").hide();
                        $("#CompanyCertificateDiv").show();

                        //初始化所有的上传插件
                        for (var i = 1; i < 10; i++) {
                            initUploadImg(i);
                        }
                    });
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



/**
 * 初始化所有的上传插件
 * @param {any} pFileIndex 上传文件域索引 从 1 开始
 */
function initUploadImg(pFileIndex) {

    if (mUserID == "0" || mUserID == "") {
        return;
    }

    //构造POST参数
    var _dataPost = "Type=1&UserID=" + mUserID;
    console.log(_dataPost);

    $('#fileupload_' + pFileIndex).fileupload({
        url: "../FileUpload/CompanyCertificateImg?" + _dataPost + "&rnd=" + Math.random(),
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

            //为隐藏换件记录UploadGuid赋值
            $("#hidUploadGuid_" + pFileIndex).val(mImgKeyGuid);

            ////获取图片域名 localhost:1400/Upload/ShopHeaderImg/SHI_1_201906160949557860.jpg
            //var _domain = mImgPathDomain.substring(0, mImgPathDomain.indexOf("/"));
            //console.log("_domain=" + _domain);
            ////获取图片相对路径 
            //var _imgPath = mImgPathDomain.replace(_domain + "/", "");
            //console.log("_imgPath=" + _imgPath);

            //构造显示代码 显示上传后的图片
            var _xhtml = "";
            _xhtml += "<a href=\"//" + mImgPathDomain + "\" target=\"_blank\">";
            _xhtml += " <img src=\"//" + mImgPathDomain + "\" />";
            _xhtml += "</a>";
            $("#FileUploadPreImg_" + pFileIndex).html(_xhtml);

            //保存公司证件资质图片 
            saveCompanyCertificateImg(mMsgID, pFileIndex, mImgPathDomain, mImgKeyGuid);

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

        });
}

/**
 * 保存公司证件资质图片 
 * @param {any} pCompanyID 公司ID
 * @param {any} pCertType 证件类别 (营业执照 [ 1 ],法人身份证 [ 2 ],银行开户许可 [ 3 ],特许经营许可 [ 4 ],商标证 [ 5 ] , 商品代理授权 [ 6 ] 其他资质许可1 [ 7 ] 其他资质许可2 [ 8 ] 其他资质许可3 [ 9 ])
 * @param {any} pCertImg 证件图片(在上传服务器上)
 * @param {any} pUploadGuid 上传GUID
 */
function saveCompanyCertificateImg(pCompanyID, pCertType, pCertImg, pUploadGuid) {

    //构造POST参数
    var dataPOST = {
        "Type": "2", "CompanyID": pCompanyID, "CertType": pCertType,
        "CertImg": pCertImg, "UploadGuid": pUploadGuid
    };
    console.log(dataPOST);


    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: "../UserGoodsShop/CompanyCertificate?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log(reTxt);
            if (reTxt != "") {

            }
        },
        error: function (xhr, errorTxt, status) {
            console.log("异步请求错误，errorTxt=" + errorTxt + " | status=" + status);
            return;
        }
    });
}

/**
 * 保存公司完成 
 */
function saveCompanyFinish() {
    window.location.href = "../UserGoodsShopPage/CompanyMsgDetail?CompanyID=" + mMsgID;
}

/**
 * 删除公司证件信息
 * @param {any} pCertType 证件类型 上传文件域索引 从 1 开始
 */
function delCompanyCertificate(pCertType) {

    //获取上传GUID
    var _uploadGuid = $("#hidUploadGuid_" + pCertType).val();

    //构造POST参数
    var dataPOST = {
        "Type": "4", "CertType": pCertType, "UploadGuid": _uploadGuid
    };
    console.log(dataPOST);


    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: "../UserGoodsShop/CompanyCertificate?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log(reTxt);
            if (reTxt != "") {
                var _json = JSON.parse(reTxt);
                if (_json.Code == "DCAA_01") {
                    $("#FileUploadPreImg_" + pCertType).html("");
                    toastWin(_json.Msg);
                }
                if (_json.ErrCode != null) {
                    //弹出错误提示
                    toastWin(_json.ErrMsg);
                }
            }
        },
        error: function (xhr, errorTxt, status) {
            console.log("异步请求错误，errorTxt=" + errorTxt + " | status=" + status);
            return;
        }
    });

}





