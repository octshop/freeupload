//==================结算资料=========================//


/**-----定义公共变量------**/

//AjaxURL
var mAjaxUrl = "../Settle/SettleShopMsg";

//结算资料ID
var mSettleShopMsgID = 0;

var mImgKeyGuid = ""; //上传标识
var mImgPathDomain = ""; //上传返回的图片URL

var mUserID = 0; //用户UserID

var mJsonSettleShopMsg = null; //结算资料信息Json对象


/**------初始化------**/
$(function () {

    //初始化UserID
    mUserID = $("#hidUserID").val().trim();

    //初始化上传结算营业执照照片插件
    initUploadSettleCertificateImg();

    //初始化商家结算资料
    initSettleShopMsg();

});

//===================自定义函数=======================//

/**
 * 初始化商家结算资料
 * */
function initSettleShopMsg() {

    //构造POST参数
    var dataPOST = {
        "Type": "2",
    };
    console.log(dataPOST);

    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: mAjaxUrl + "?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("初始化商家结算资料=" + reTxt);

            if (reTxt != "") {
                var _jsonReTxt = JSON.parse(reTxt);

                mJsonSettleShopMsg = _jsonReTxt

                //赋值给表单
                mSettleShopMsgID = _jsonReTxt.SettleShopMsgID;

                if (mSettleShopMsgID == 0) {
                    //初始化地区选择
                    var hidRegionCodeArr = $("#hidRegionCodeArr").val().trim().split("_");
                    initRegionCodeNameDefaultVal(hidRegionCodeArr[0], hidRegionCodeArr[1], hidRegionCodeArr[2]);
                }
                else {
                    //初始化地区选择
                    var hidRegionCodeArr = _jsonReTxt.RegionCodeArr.split("_");
                    initRegionCodeNameDefaultVal(hidRegionCodeArr[0], hidRegionCodeArr[1], hidRegionCodeArr[2]);
                }

                if (mSettleShopMsgID == 0) {
                    return;
                }

                mImgPathDomain = _jsonReTxt.CertificateImg;


                $("#CompanyName").val(_jsonReTxt.CompanyName);
                $("#CertificateID").val(_jsonReTxt.CertificateID);
                $("#CompanyAddr").val(_jsonReTxt.CompanyAddr);
                $("#CompanyTel").val(_jsonReTxt.CompanyTel);
                $("#LegalPerson").val(_jsonReTxt.LegalPerson);
                $("#LinkMan").val(_jsonReTxt.LinkMan);
                $("#MobileNumber").val(_jsonReTxt.MobileNumber);
                $("#Department").val(_jsonReTxt.Department);
                $("#Email").val(_jsonReTxt.Email);
                $("#BankAccount").val(_jsonReTxt.BankAccount);
                $("#BankAccName").val(_jsonReTxt.BankAccName);
                $("#OpeningBank").val(_jsonReTxt.OpeningBank);
                if (_jsonReTxt.CertificateImg != "" && _jsonReTxt.CertificateImg != undefined) {
                    $("#ImgPreLi").show();
                    $("#ImgPreLi").html("<a href=\"//" + _jsonReTxt.CertificateImg + "\"><img src=\"//" + _jsonReTxt.CertificateImg + "\" /></a>");
                }

                //显示审核状态 资料是否审核 ( false 待审核 true 不通过 pass 通过 )
                if (_jsonReTxt.IsCheck == "false") {

                    $("#StatusSpanBg").css("background", "#F55A00");
                    $("#StatusTtileB").html("等待审核-商家结算资料");
                    $("#StatusContentLabel").html("你的商家结算资料，现在审核中，请保持电话申通！");
                }
                else if (_jsonReTxt.IsCheck == "true") {
                    $("#StatusSpanBg").css("background", "#FF0000");
                    $("#StatusTtileB").html("审核不通过-商家结算资料");
                    $("#StatusContentLabel").html(_jsonReTxt.CheckReason);
                }
                else if (_jsonReTxt.IsCheck == "pass") {
                    $("#StatusSpanBg").css("background", "#03AD05");
                    $("#StatusTtileB").html("审核通过-商家结算资料");
                    $("#StatusContentLabel").html("你的商家结算资料，审核通过，可以正常申请结算！");
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
 * 公司名称与银行账户名称保持一致
 * */
function blurBankAccName() {
    $("#BankAccName").val($("#CompanyName").val().trim());
}

/**
 * 提交商家结算资料
 * */
function submitSettleShopMsg() {

    //获取表单值
    var CompanyName = $("#CompanyName").val().trim();
    var CertificateID = $("#CertificateID").val().trim();

    var region_province = $("#region_province").val().trim();
    var region_city = $("#region_city").val().trim();
    var region_county = $("#region_county").val().trim();
    var RegionCodeArr = region_province + "_" + region_city + "_" + region_county;

    var CompanyAddr = $("#CompanyAddr").val().trim();
    var CompanyTel = $("#CompanyTel").val().trim();
    var LegalPerson = $("#LegalPerson").val().trim();

    var LinkMan = $("#LinkMan").val().trim();
    var MobileNumber = $("#MobileNumber").val().trim();
    var Department = $("#Department").val().trim();
    var Email = $("#Email").val().trim();

    var BankAccount = $("#BankAccount").val().trim();
    var BankAccName = $("#BankAccName").val().trim();
    var OpeningBank = $("#OpeningBank").val().trim();

    //判断输入合法性
    if (CompanyName == "" || CertificateID == "") {
        toastWin("【公司名称】【 统一社会信用代码】都不能为空！");
        return;
    }
    if (region_county == "" || CompanyAddr == "") {
        toastWin("【公司地址】填写不完整！");
        return;
    }
    if (CompanyTel == "" || LegalPerson == "") {
        toastWin("【公司电话】【公司法人】都不能为空！");
        return;
    }

    if (mImgPathDomain == "" || mImgPathDomain == null) {
        toastWin("请上传【营业执照】照片！");
        return;
    }

    if (LinkMan == "" || MobileNumber == "") {
        toastWin("【联系人姓名】【联系人手机号】都不能为空！");
        return;
    }
    if (BankAccount == "" || BankAccName == "" || OpeningBank == "") {
        toastWin("【银行账号】【账户名称】【开户支行名称】都不能为空！");
        return;
    }

    if (mSettleShopMsgID != "0" && mSettleShopMsgID != "") {

        if (RegionCodeArr != mJsonSettleShopMsg.RegionCodeArr || CompanyName != mJsonSettleShopMsg.CompanyName || CompanyAddr != mJsonSettleShopMsg.CompanyAddr || CertificateID != mJsonSettleShopMsg.CertificateID || mImgPathDomain != mJsonSettleShopMsg.CertificateImg || LegalPerson != mJsonSettleShopMsg.LegalPerson || BankAccount != mJsonSettleShopMsg.BankAccount || BankAccName != mJsonSettleShopMsg.BankAccName || OpeningBank != mJsonSettleShopMsg.OpeningBank) {

            confirmWin("修改结算资料关键信息，需要重新审核，是否修改？", function () {

                //保存 商家结算资料
                saveSettleShopMsg(CompanyName, CertificateID, RegionCodeArr, CompanyAddr, CompanyTel, LegalPerson, LinkMan, MobileNumber, Department, Email, BankAccount, BankAccName, OpeningBank);

            });

            return;
        }
    }

    //保存 商家结算资料
    saveSettleShopMsg(CompanyName, CertificateID, RegionCodeArr, CompanyAddr, CompanyTel, LegalPerson, LinkMan, MobileNumber, Department, Email, BankAccount, BankAccName, OpeningBank);


}

/**
 * 保存 商家结算资料
 * @param {any} pCompanyName
 * @param {any} pCertificateID
 * @param {any} pRegionCodeArr
 * @param {any} pCompanyAddr
 * @param {any} pCompanyTel
 * @param {any} pLegalPerson
 * @param {any} pLinkMan
 * @param {any} pMobileNumber
 * @param {any} pDepartment
 * @param {any} pEmail
 * @param {any} pBankAccount
 * @param {any} pBankAccName
 * @param {any} pOpeningBank
 */
function saveSettleShopMsg(pCompanyName, pCertificateID, pRegionCodeArr, pCompanyAddr, pCompanyTel, pLegalPerson, pLinkMan, pMobileNumber, pDepartment, pEmail, pBankAccount, pBankAccName, pOpeningBank) {

    //构造POST参数
    var dataPOST = {
        "Type": "1", "SettleShopMsgID": mSettleShopMsgID, "CompanyName": pCompanyName, "CertificateID": pCertificateID, "RegionCodeArr": pRegionCodeArr, "CertificateImg": mImgPathDomain, "CompanyAddr": pCompanyAddr, "CompanyTel": pCompanyTel, "LegalPerson": pLegalPerson, "LinkMan": pLinkMan, "MobileNumber": pMobileNumber, "Department": pDepartment, "Email": pEmail, "BankAccount": pBankAccount, "BankAccName": pBankAccName, "OpeningBank": pOpeningBank,
    };
    console.log(dataPOST);

    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: mAjaxUrl + "?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("提交商家结算资料=" + reTxt);

            if (reTxt != "") {
                var _jsonReTxt = JSON.parse(reTxt);

                if (_jsonReTxt.ErrMsg != undefined && _jsonReTxt.ErrMsg != null && _jsonReTxt.ErrMsg != "") {
                    toastWin(_jsonReTxt.ErrMsg);
                    return;
                }

                if (_jsonReTxt.Msg != undefined && _jsonReTxt.Msg != null && _jsonReTxt.Msg != "") {
                    toastWinCb(_jsonReTxt.Msg, function () {

                        window.location.reload();

                    });

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

}




//========================上传图片=======================//

/**
 * 初始化上传结算营业执照照片插件
 * */
function initUploadSettleCertificateImg() {

    console.log("mUserID=" + mUserID);
    if (mUserID == 0 || mUserID == "") {
        return;
    }

    //构造POST参数
    var _dataPost = "Type=1&UserID=" + mUserID;


    $('#fileupload_0').fileupload({
        url: "../FileUpload/SettleCertificateImg?" + _dataPost + "&rnd=" + Math.random(),
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
            mImgKeyGuid = _JsonObj.DataDic.ImgKeyGuid;
            mImgPathDomain = _JsonObj.DataDic.ImgPathDomain;

            console.log("mImgKeyGuid=" + mImgKeyGuid + " | mImgPathDomain=" + mImgPathDomain);

            //为Img赋值
            //$("#ShopHeaderImg").attr("src", "//" + mImgPathDomain);
            $("#ImgPreLi").show();
            $("#ImgPreLi").html("<a href=\"//" + mImgPathDomain + "\"><img src=\"//" + mImgPathDomain + "\" /></a>");

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
