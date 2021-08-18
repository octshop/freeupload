//==============店铺信息===================//

/**-----定义公共变量------**/

//AjaxURL
var mAjaxUrl = "../Shop/ShopMsg";

/******数据分页的变量********/

//信息ID
var mMsgID = 0;
var mImgKeyGuid = ""; //上传标识
var mImgPathDomain = ""; //上传返回的图片URL

var mExistCompany = true; //判断是否存在公司信息
var mExistAccount = true; //判断是否存在帐号信息

var mUserID = 0; //用户UserID

var mShopName = "";

var mIsEntity = "false"; //是否有实体店

/**------初始化------**/
$(function () {

    //初始化UserID
    mUserID = $("#hidUserID").val().trim();
    var hidShopHeaderImg = $("#hidShopHeaderImg").val().trim();

    //是否有实体店
    mIsEntity = $("#hidIsEntity").val().trim();
    if (mIsEntity == "checked") {
        mIsEntity = "true";
    }
    else {
        mIsEntity = "false";
    }


    //记录关键数据的值
    mShopName = $("#ShopName").val().trim();

    //加载店铺父级类别列表
    loadFatherShopType("0", function () {

        //初始化店铺类别列表下拉框
        initShopTypeSelect();

        //当父级类别改变时，加载子级菜单列表
        chgLoadSubShopType(function () {

            //初始化店铺类别列表下拉框
            initShopTypeSelect();

        });
    });

    //初始化地区选择
    var hidRegionCodeArr = $("#hidRegionCodeArr").val().trim().split("_");
    initRegionCodeNameDefaultVal(hidRegionCodeArr[0], hidRegionCodeArr[1], hidRegionCodeArr[2]);

    //初始化上传店铺头像插件
    initUploadShopHeaderImg();

    //初始化上传店铺门头照插件
    initUploadShopLogoImg();

    //初始化店铺图片裁剪按钮
    initCropHeaderImgA(mUserID, hidShopHeaderImg);

    //初始化位置选择窗口事件
    initSelLocationWin();
});

/**
 * 加载店铺父级类别列表
@param {any} pFatherShopTypeID 父级类别ID
 * @param {any} pCallBack 回调函数
 */
function loadFatherShopType(pFatherShopTypeID, pCallBack) {

    if (pCallBack == undefined || pCallBack == "") {
        pCallBack = function () { };
    }

    //构造GET参数
    var dataGET = {
        "Type": "1", "FatherShopTypeID": pFatherShopTypeID
    };

    console.log(dataGET);

    $.ajax({
        type: "GET",
        url: mAjaxUrl + "?rnd=" + Math.random(),
        data: dataGET,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log(reTxt);
            if (reTxt != "") {
                //对象化Json字符串
                var _jsonObj = JSON.parse(reTxt);

                if (pFatherShopTypeID == "0") {
                    $("#ShopTypeIDFather").empty();
                }
                else {
                    $("#ShopTypeIDSub").empty();
                }

                //为下拉列表赋值
                for (var i = 0; i < _jsonObj.ShopTypeFatherList.length; i++) {

                    if (pFatherShopTypeID == "0") {
                        $("#ShopTypeIDFather").append("<option value='" + _jsonObj.ShopTypeFatherList[i].ShopTypeID + "'>" + _jsonObj.ShopTypeFatherList[i].ShopTypeName + "</option>");
                    }
                    else {
                        $("#ShopTypeIDSub").append("<option value='" + _jsonObj.ShopTypeFatherList[i].ShopTypeID + "'>" + _jsonObj.ShopTypeFatherList[i].ShopTypeName + "</option>");
                    }
                }                //回调函数                pCallBack();            }
            else {
                $("#ShopTypeIDSub").empty();
                $("#ShopTypeIDSub").append("<option value=''></option>");;
            }
        },
        error: function (xhr, errorTxt, status) {
            console.log("异步请求错误，errorTxt=" + errorTxt + " | status=" + status);
            //alert("网络出现异常,请重试！");
            return;
        }
    });
}

/**
 * 初始化店铺类别列表下拉框
 * @param {any} pFatherShopTypeID 父级店铺类别ID  0则加载父级，如果不是则加载子级
 */
function initShopTypeSelect() {
    var hidShopTypeIDArr = $("#hidShopTypeIDArr").val().trim().split("|");
    console.log(hidShopTypeIDArr);
    $("#ShopTypeIDFather").val(hidShopTypeIDArr[0]);    $("#ShopTypeIDSub").val(hidShopTypeIDArr[1]);
}

/**
 * 当父级类别改变时，加载子级菜单列表
 */
function chgLoadSubShopType(pCallBack) {
    if (pCallBack == undefined || pCallBack == "") {
        pCallBack = function () { };
    }
    var _fatherShopTypeID = $("#ShopTypeIDFather").val().trim();
    //加载店铺父级类别列表
    loadFatherShopType(_fatherShopTypeID, pCallBack);
}

/**
 * 初始化上传店铺头像插件
 */
function initUploadShopHeaderImg() {

    console.log("mUserID=" + mUserID);
    if (mUserID == 0 || mUserID == "") {
        return;
    }

    //构造POST参数
    var _dataPost = "Type=1&UserID=" + mUserID;


    $('#fileupload_0').fileupload({
        url: "../FileUpload/ShopHeaderImg?" + _dataPost + "&rnd=" + Math.random(),
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
            $("#ShopHeaderImg").attr("src", "//" + mImgPathDomain);

            //更改店铺头像信息
            chgShopHeaderImg(mUserID, mImgPathDomain, mImgKeyGuid);
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
 * 初始化上传店铺门头照插件
 */
function initUploadShopLogoImg() {

    if (mUserID == "0" || mUserID == "") {
        return;
    }

    //构造POST参数
    var _dataPost = "Type=1&UserID=" + mUserID;

    $('#fileupload_1').fileupload({
        url: "../FileUpload/ShopLogoImg?" + _dataPost + "&rnd=" + Math.random(),
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
            //$("#ShopHeaderImg").attr("src", "//" + mImgPathDomain);
            //构造显示代码
            var myJsVal = "";            myJsVal += "<div id=\"DivImg_" + mImgKeyGuid + "\">";            myJsVal += " <img class=\"img-del\" onclick=\"delShopLogoImg('" + mImgKeyGuid + "')\" src=\"../Assets/Imgs/Icon/icon-del.png\" />";            myJsVal += " <a href=\"javascript:void(0)\"><img id=\"Img_" + mImgKeyGuid + "\" src=\"//" + mImgPathDomain + "\" /></a>";            myJsVal += " <div class=\"crop-img-btn\">";            myJsVal += "     <div><a href=\"//" + _domain + "/ToolWeb/CropZoom/CropZoom.aspx?CropImgWidth=800&CropImgHeight=500&CropTitle=店铺门头照裁剪&ImgSourceURL=" + _imgPath + "&RedirectURL=#\" target=\"_blank\">裁剪照片</a></div>";            myJsVal += "     <div style=\"border-left: 1px solid #5A5A5A;\" onclick=\"refreshImgSrcRnd('Img_" + mImgKeyGuid + "')\">刷新照片</div>";            myJsVal += " </div>";            myJsVal += "</div>";            //显示代码追加到前台            $("#ImgPreLi").append(myJsVal);            //提交门头照片信息
            submitShopLogoImg(mUserID, mImgPathDomain, mImgKeyGuid);
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
 * 更改店铺头像信息
 * @param {any} pUserID 用户UserID
 * @param {any} pShopHeaderImg 头像图片URL ( localhost:1400/Upload/ShopHeaderImg/SHI_1_201906160924530250.jpg )
 * @param {any} pUploadGuid 上传GUID
 */
function chgShopHeaderImg(pUserID, pShopHeaderImg, pUploadGuid) {

    //获取图片域名 localhost:1400/Upload/ShopHeaderImg/SHI_1_201906160949557860.jpg
    var _domain = pShopHeaderImg.substring(0, pShopHeaderImg.indexOf("/"));
    console.log("_domain=" + _domain);
    //获取图片相对路径 
    var _imgPath = pShopHeaderImg.replace(_domain + "/", "");
    console.log("_imgPath=" + _imgPath);

    //构造POST参数
    var dataPOST = {
        "Type": "2", "UserID": pUserID, "ShopHeaderImg": pShopHeaderImg,
        "UploadGuid": pUploadGuid
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
                    $("#CropHeaderImgA").attr("href", "//" + _domain + "/ToolWeb/CropZoom/CropZoom.aspx?CropImgWidth=600&CropImgHeight=600&CropTitle=店铺头像裁剪&ImgSourceURL=" + _imgPath + "&RedirectURL=#");

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
 * 初始化店铺图片裁剪按钮
 * @param {any} pUserID 用户UserID
 * @param {any} pShopHeaderImg 
 */
function initCropHeaderImgA(pUserID, pShopHeaderImg) {
    //获取图片域名 //localhost:1400/Upload/ShopHeaderImg/SHI_1_201906160949557860.jpg
    var _domain = pShopHeaderImg.substring(0, pShopHeaderImg.indexOf("/Upload"));
    console.log("_domain=" + _domain);
    //获取图片相对路径 
    var _imgPath = pShopHeaderImg.replace(_domain + "/", "");
    console.log("_imgPath=" + _imgPath);


    $("#CropHeaderImgA").attr("href", "//" + _domain + "/ToolWeb/CropZoom/CropZoom.aspx?CropImgWidth=600&CropImgHeight=600&CropTitle=店铺头像裁剪&ImgSourceURL=" + _imgPath + "&RedirectURL=#");
}


/**
 * 提交店铺门头照LOGO信息
 * @param {any} pUserID 用户UserID
 * @param {any} pShopHeaderImg 店铺门头图片URL ( localhost:1400/Upload/ShopHeaderImg/SHI_1_201906160924530250.jpg )
 * @param {any} pUploadGuid 上传GUID
 */
function submitShopLogoImg(pUserID, pShopLogoImg, pUploadGuid) {

    //获取图片域名 localhost:1400/Upload/ShopHeaderImg/SHI_1_201906160949557860.jpg
    var _domain = pShopLogoImg.substring(0, pShopLogoImg.indexOf("/"));
    console.log("_domain=" + _domain);
    //获取图片相对路径 
    var _imgPath = pShopLogoImg.replace(_domain + "/", "");
    console.log("_imgPath=" + _imgPath);

    //构造POST参数
    var dataPOST = {
        "Type": "3", "UserID": pUserID, "ShopLogoImg": pShopLogoImg,
        "UploadGuid": pUploadGuid
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
 * 刷新Img标签的Src值 以加载裁剪后的图片
 * @param {any} pImgLabelID Img标签的ID
 */
function refreshImgSrcRnd(pImgLabelID) {
    //获取Img标签的Src值
    var _imgSrc = $("#" + pImgLabelID).attr("src");
    console.log("_imgSrc=" + _imgSrc);
    //得到去掉Rnd参数的Src
    var _imgSrcNoRnd = _imgSrc;
    if (_imgSrc.indexOf("?rnd") >= 0) {
        _imgSrcNoRnd = _imgSrc.substring(0, _imgSrc.indexOf("?rnd"));
    }
    console.log("_imgSrcNoRnd=" + _imgSrcNoRnd);

    _imgSrc = _imgSrcNoRnd + "?rnd=" + Math.random();
    console.log("New_imgSrc=" + _imgSrc);
    $("#" + pImgLabelID).attr("src", _imgSrc);
}

/**
 * 删除店铺门头照片
 * @param {any} pUploadGuidArr 店铺Logo门头照片UploadGuid
 */
function delShopLogoImg(pUploadGuidArr) {

    confirmWinWidth("确定要删除吗？", function
        () {

        //构造POST参数
        var dataGET = {
            "Type": "4", "UploadGuidArr": pUploadGuidArr
        };
        console.log(dataGET);

        //正式发送异步请求
        $.ajax({
            type: "GET",
            url: mAjaxUrl + "?rnd=" + Math.random(),
            data: dataGET,
            dataType: "html",
            success: function (reTxt, status, xhr) {
                console.log(reTxt);

                if (reTxt != "") {
                    var _jsonReTxt = JSON.parse(reTxt);

                    //保存成功
                    if (_jsonReTxt.Code != null) {

                        $("#DivImg_" + pUploadGuidArr).remove();

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


    }, 400);
}

/**
 * 保存店铺信息
 */
function saveShopMsg() {



    //获取表单值
    var ShopID = $("#hidShopID").val().trim();
    var UserAccount = "";
    var CompanyID = "";
    var ShopTypeIDSub = $("#ShopTypeIDSub").val().trim();
    var ShopName = $("#ShopName").val().trim();
    var SearchKey = $("#SearchKey").val().trim();
    var MajorGoods = $("#MajorGoods").val().trim();
    var ShopDesc = $("#ShopDesc").val().trim();

    var region_province = $("#region_province").val().trim();
    var region_city = $("#region_city").val().trim();
    var region_county = $("#region_county").val().trim();

    var DetailAddr = $("#DetailAddr").val().trim();
    var ShopFixTel = $("#ShopFixTel").val().trim();
    var ShopMobile = $("#ShopMobile").val().trim();
    var SendMobile = $("#SendMobile").val().trim();
    var LinkMan = $("#LinkMan").val().trim();
    var LinkManMobile = $("#LinkManMobile").val().trim();
    var LinkEmail = $("#LinkEmail").val().trim();

    //----实体店-----//
    var IsEntity = "false";
    if ($("#IsEntityCb").is(":checked")) {
        IsEntity = "true";
    }
    var LatitudeTxt = $("#LatitudeTxt").val().trim();
    var LongitudeTxt = $("#LongitudeTxt").val().trim();
    //判断有实体店情况下是否输入了经纬度
    if (IsEntity == "true") {
        if (LatitudeTxt == "" || LongitudeTxt == "") {
            $("#LatitudeTxt").focus();
            toastWin("请输入实体店的【经纬度】!");
            return;
        }
    }

    if (ShopTypeIDSub == "" || ShopName == "" || SearchKey == "" || MajorGoods == "" || ShopDesc == "" || region_county == "" || DetailAddr == "" || ShopFixTel == "" || ShopMobile == "" || SendMobile == "" || LinkMan == "" || LinkManMobile == "" || LinkEmail == "") {
        toastWin("所有项都不能为空！");
        return;
    }

    if (ShopName.length > 15) {
        toastWin("【店铺名称】控制在15个字符之内！");
        $("#ShopName").focus();
        return;
    }
    if (SearchKey.length > 80) {
        toastWin("【搜索关键字】控制在80个字符之内！");
        $("#SearchKey").focus();
        return;
    }
    if (MajorGoods.length > 100) {
        toastWin("【主营商品】控制在100个字符之内！");
        $("#MajorGoods").focus();
        return;
    }

    if (checkMobileNumber(ShopMobile) == false) {
        toastWin("【店铺手机号】不正确！");
        $("#ShopMobile").focus();
        return;
    }

    if (checkMobileNumber(LinkManMobile) == false) {
        toastWin("【联系人手机号】不正确！");
        $("#LinkManMobile").focus();
        return;
    }

    if (checkEmail(LinkEmail) == false) {
        toastWin("【联系人邮箱】不正确！");
        $("#LinkEmail").focus();
        return;
    }

    //判断是否改变了关键数据
    //20006|20014
    var hidShopTypeID = $("#hidShopTypeIDArr").val().trim().split("|")[1];
    //430000_430100_430121
    var hidRegionCode = $("#hidRegionCodeArr").val().trim().split("_")[2];

    console.log("mIsEntity=" + mIsEntity);

    if (mShopName != ShopName || hidShopTypeID != ShopTypeIDSub || hidRegionCode != region_county || mIsEntity != IsEntity) {
        confirmWinWidth("修改关键数据，店铺将进入审核状态！", function () {
            //提交修改后的店铺信息
            submitShopMsg(UserAccount, ShopID, CompanyID, ShopTypeIDSub, ShopName, SearchKey, MajorGoods, ShopDesc, region_province, region_city, region_county, DetailAddr, ShopFixTel, ShopMobile, SendMobile, LinkMan, LinkManMobile, LinkEmail, IsEntity, LatitudeTxt, LongitudeTxt);
        }, 400);
        return;
    }

    //提交修改后的店铺信息
    submitShopMsg(UserAccount, ShopID, CompanyID, ShopTypeIDSub, ShopName, SearchKey, MajorGoods, ShopDesc, region_province, region_city, region_county, DetailAddr, ShopFixTel, ShopMobile, SendMobile, LinkMan, LinkManMobile, LinkEmail, IsEntity, LatitudeTxt, LongitudeTxt);

    ////构造POST参数
    //var dataPOST = {
    //    "Type": "5", "UserAccount": UserAccount, "ShopID": ShopID, "CompanyID": CompanyID,
    //    "ShopTypeID": ShopTypeIDSub, "ShopName": ShopName, "SearchKey": SearchKey,
    //    "MajorGoods": MajorGoods, "ShopDesc": ShopDesc, "region_province": region_province,
    //    "region_city": region_city, "region_county": region_county, "DetailAddr": DetailAddr,
    //    "ShopFixTel": ShopFixTel, "ShopMobile": ShopMobile, "SendMobile": SendMobile, "LinkMan": LinkMan,
    //    "LinkManMobile": LinkManMobile, "LinkEmail": LinkEmail
    //};
    //console.log(dataPOST);
    ////加载提示
    //loadingWin();
    ////正式发送异步请求
    //$.ajax({
    //    type: "POST",
    //    url: mAjaxUrl + "?rnd=" + Math.random(),
    //    data: dataPOST,
    //    dataType: "html",
    //    success: function (reTxt, status, xhr) {
    //        console.log(reTxt);
    //        //关闭加载提示
    //        closeLoadingWin();

    //        if (reTxt != "") {
    //            var _jsonReTxt = JSON.parse(reTxt);
    //            if (_jsonReTxt.Code == "ESMA_01") {
    //                //记录店铺的UserID
    //                //mUserID = _jsonReTxt.DataDic.UserID
    //                //console.log("mUserID=" + mUserID);

    //                toastWinCb(_jsonReTxt.Msg, function () {
    //                    window.location.reload();
    //                });
    //                return;
    //            }

    //            //错误提示
    //            if (_jsonReTxt.ErrCode != null) {
    //                toastWin(_jsonReTxt.ErrMsg);
    //            }
    //        }
    //        else {

    //        }
    //    },
    //    error: function (xhr, errorTxt, status) {
    //        console.log("异步请求错误，errorTxt=" + errorTxt + " | status=" + status);
    //        return;
    //    }
    //});
}

/**
 * 提交修改后的店铺信息
 * @param {any} UserAccount
 * @param {any} ShopID
 * @param {any} CompanyID
 * @param {any} ShopTypeIDSub
 * @param {any} ShopName
 * @param {any} SearchKey
 * @param {any} MajorGoods
 * @param {any} ShopDesc
 * @param {any} region_province
 * @param {any} region_city
 * @param {any} region_county
 * @param {any} DetailAddr
 * @param {any} ShopFixTel
 * @param {any} ShopMobile
 * @param {any} SendMobile
 * @param {any} LinkMan
 * @param {any} LinkManMobile
 * @param {any} LinkEmail
 * @param {any} IsEntity
 * @param {any} Latitude
 * @param {any} Longitude
 */
function submitShopMsg(UserAccount, ShopID, CompanyID, ShopTypeIDSub, ShopName, SearchKey, MajorGoods, ShopDesc, region_province, region_city, region_county, DetailAddr, ShopFixTel, ShopMobile, SendMobile, LinkMan, LinkManMobile, LinkEmail, IsEntity, Latitude, Longitude) {
    //构造POST参数
    var dataPOST = {
        "Type": "5", "UserAccount": UserAccount, "ShopID": ShopID, "CompanyID": CompanyID,
        "ShopTypeID": ShopTypeIDSub, "ShopName": ShopName, "SearchKey": SearchKey,
        "MajorGoods": MajorGoods, "ShopDesc": ShopDesc, "region_province": region_province,
        "region_city": region_city, "region_county": region_county, "DetailAddr": DetailAddr,
        "ShopFixTel": ShopFixTel, "ShopMobile": ShopMobile, "SendMobile": SendMobile, "LinkMan": LinkMan,
        "LinkManMobile": LinkManMobile, "LinkEmail": LinkEmail, "IsEntity": IsEntity, "Latitude": Latitude, "Longitude": Longitude
    };
    console.log(dataPOST);
    //加载提示
    loadingWin();
    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: mAjaxUrl + "?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log(reTxt);
            //关闭加载提示
            closeLoadingWin();

            if (reTxt != "") {
                var _jsonReTxt = JSON.parse(reTxt);
                if (_jsonReTxt.Code == "ESMA_01") {
                    //记录店铺的UserID
                    //mUserID = _jsonReTxt.DataDic.UserID
                    //console.log("mUserID=" + mUserID);

                    toastWinCb(_jsonReTxt.Msg, function () {
                        window.location.reload();
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


//==================地图上点选位置信息===================//

/**
 * 初始化位置选择窗口事件
 * */
function initSelLocationWin() {
    window.addEventListener('message', function (event) {
        // 接收位置信息，用户选择确认位置点后选点组件会触发该事件，回传用户的位置信息
        var loc = event.data;
        if (loc && loc.module == 'locationPicker') {//防止其他应用也会向该页面post信息，需判断module是否为'locationPicker'
            console.log('location', loc);

            console.log("纬度：" + loc.latlng.lat);
            console.log("经度：" + loc.latlng.lng);
            $("#LatitudeTxt").val(loc.latlng.lat);
            $("#LongitudeTxt").val(loc.latlng.lng);

            //关闭窗口
            closeDialogWin();

            //{
            //    module: 'locationPicker',
            //        latlng: {
            //        lat: 39.998766,
            //        lng: 116.273938
            //    },
            //    poiaddress: "北京市海淀区新建宫门路19号",
            //        poiname: "颐和园",
            //            cityname: "北京市"
            //}

        }
    }, false);
}

/**
 * 打开点选店铺位置窗口
 * */
function openSelLocationWin() {

    var _winXhtml = $(".win-form-main").html();    openDialogWinNoClose("选择店铺位置", _winXhtml, function () { }, function () { }, 750, "false");


}