//==================编辑活动=========================//

/**-----定义公共变量------**/

//AjaxURL
var mAjaxUrl = "../Activity/ActivityMsg";

//活动ID
var mActivityID = 0;


//商家UserID
var mUserID = 0;

/**------初始化------**/
$(function () {

    mActivityID = $("#hidActivityID").val().trim();

    //商家UserID
    mUserID = $("#hidShopUserID").val().trim();

    //初始化活动日期时间选择器
    initActivitySelDateTime();

    //初始化位置选择窗口事件
    initSelLocationWin();

    //初始化所有活动图片上传插件
    initAllGoodsImgUploadFile();


    //初始化活动信息
    initActivityMsg(function () {

        //初始化地区选择
        var hidRegionCodeArr = $("#hidRegionCodeArr").val().trim().split("_");
        initRegionCodeNameDefaultVal(hidRegionCodeArr[0], hidRegionCodeArr[1], hidRegionCodeArr[2]);

    });


});

/**
 * 初始化活动信息
 * */
function initActivityMsg(pCallBack) {

    if (mActivityID == 0 || mActivityID == "") {
        return;
    }

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
            console.log("初始化活动信息=" + reTxt);
            if (reTxt != "") {
                var _jsonBack = JSON.parse(reTxt);

                var ActivityMsg = _jsonBack.ActivityMsg;
                var ActivityImgs = _jsonBack.ActivityImgs;

                //赋值到表单
                $("#AcTitle").val(ActivityMsg.AcTitle);
                $("#AcType").val(ActivityMsg.AcType);
                //切换活动类别表单
                if (ActivityMsg.AcType != "OffLine") {
                    $("#RegionDiv").hide();
                    $("#RegionDetailDiv").hide();
                    $("#RegionLocationDiv").hide();
                }
                else {
                    $("#RegionDiv").show();
                    $("#RegionDetailDiv").show();
                    $("#RegionLocationDiv").show();
                }

                $("#AcMobile").val(ActivityMsg.AcMobile);
                $("#AcMobile").val(ActivityMsg.AcMobile);
                //初始化区域范围
                $("#hidRegionCodeArr").val(ActivityMsg.RegionCodeArr);
                $("#AcAddress").val(ActivityMsg.AcAddress);
                $("#LatitudeTxt").val(ActivityMsg.Latitude);
                $("#LongitudeTxt").val(ActivityMsg.Longitude);
                //赋值时间
                var StartDateTimeArr = ActivityMsg.StartDate.split(" ");
                $("#StartDate").val(StartDateTimeArr[0]);
                $("#StartTime").val(StartDateTimeArr[1]);
                var EndDateTimeArr = ActivityMsg.EndDate.split(" ");
                $("#EndDate").val(EndDateTimeArr[0]);
                $("#EndTime").val(EndDateTimeArr[1]);

                $("#AcSketch").val(ActivityMsg.AcSketch);
                $("#AcDesc").val(ActivityMsg.AcDesc);
                $("#LimitJoinType").val(ActivityMsg.LimitJoinType);
                $("#LimitNumber").val(ActivityMsg.LimitNumber);
                if (ActivityMsg.IsJoinCheck == "true") {
                    $("#IsJoinCheck").prop("checked", true);
                }

                //初始化照片上传 插件
                initGoodsImgUploadList(ActivityImgs);


                //回调函数
                pCallBack();
            }
        },
        error: function (xhr, errorTxt, status) {
            console.log("异步请求错误，errorTxt=" + errorTxt + " | status=" + status);
            return;
        }
    });


}


//=============活动图片相关===============//

/**
 * 初始化所有活动图片上传插件
 * */
function initAllGoodsImgUploadFile() {

    for (var i = 1; i < 6; i++) {
        //初始化商品图片上传插件
        initGoodsImgUploadFile(i);
    }
}

/**
 * 初始化商品图片上传插件
 * @param {any} pUploadIndex 上传文件域索引
 */
function initGoodsImgUploadFile(pUploadIndex) {

    //console.log("执行了initGoodsImgUploadFile()");

    //构造上传控件的ID字符串
    var _uploadIDstr = "UploadGoods_" + pUploadIndex;


    //构造POST参数
    var _dataPost = "Type=1&UserID=" + mUserID;
    console.log(_dataPost);

    $('#' + _uploadIDstr).fileupload({
        url: "../FileUpload/ActivityImgs?" + _dataPost + "&rnd=" + Math.random(),
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
            //alert("mImgKeyGuid=" + mImgKeyGuid + " | mImgPathDomain=" + mImgPathDomain);
            //mImgKeyGuid=91318a05-a4c0-4ff8-95ad-17117eccb7d1 | mImgPathDomain=localhost:1400/Upload/GooSpecParamImg/GSPI_1_201907121414565670.jpg

            //给隐藏控件赋值
            $("#HidUploadGoodsVal_" + pUploadIndex).val(mImgKeyGuid + "|" + mImgPathDomain);

            //给图片控件赋值
            $("#GoodsImgPre_" + pUploadIndex).attr("src", "//" + mImgPathDomain);

            //显示操作按钮组
            $("#BtnGoodsList_" + pUploadIndex).show();

            //----构造按钮显示代码
            //获取图片URL中的 域名和图片相对路径  
            var _domainAndImgPathArr = getImgURLDomainAndImgPathArr(mImgPathDomain).split("^");
            var _btnGoodsListXhtml = "<a href=\"//" + _domainAndImgPathArr[0] + "/ToolWeb/CropZoom/CropZoom.aspx?CropImgWidth=700&CropImgHeight=700&CropTitle=活动&ImgSourceURL=" + _domainAndImgPathArr[1] + "&RedirectURL=#\" target=\"_blank\">裁剪</a>";            _btnGoodsListXhtml += "<div onclick=\"delGooGoodsImg('" + mImgKeyGuid + "','" + _domainAndImgPathArr[0] + "'," + pUploadIndex + ")\">删除</div><div onclick=\"refreshImgSrcRnd('GoodsImgPre_" + pUploadIndex + "')\">刷新</div>";            //显示代码插入前台             $("#BtnGoodsList_" + pUploadIndex).html(_btnGoodsListXhtml);        },

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
 * 得到商品上传图片拼接数组 
 * mImgKeyGuid | mImgPathDomain ^ mImgKeyGuid | mImgPathDomain^ mImgKeyGuid | mImgPathDomain
 * */
function getGoodsImgArr() {
    var _goodsImgArr = "";
    for (var i = 1; i < 6; i++) {
        _uploadVal = $("#HidUploadGoodsVal_" + i).val();
        //console.log("_uploadVal=" + _uploadVal);
        if (_uploadVal.indexOf("|") >= 0) {
            _goodsImgArr += $("#HidUploadGoodsVal_" + i).val() + "^";
        }
    }
    //删除前后“^”
    _goodsImgArr = removeFrontAndBackChar(_goodsImgArr, "^");
    return _goodsImgArr;
}

/**
 * 获取图片URL中的 域名和图片相对路径  
 * @param pImgUrl 图片URL地址 [localhost:1400/Upload/ShopHeaderImg/SHI_1_201906160949557860.jpg]
 * */
function getImgURLDomainAndImgPathArr(pImgUrl) {

    //获取图片域名 localhost:1400/Upload/ShopHeaderImg/SHI_1_201906160949557860.jpg
    var _domain = pImgUrl.substring(0, pImgUrl.indexOf("/"));
    //console.log("_domain=" + _domain);
    //获取图片相对路径 
    var _imgPath = pImgUrl.replace(_domain + "/", "");
    //console.log("_imgPath=" + _imgPath);

    return _domain + "^" + _imgPath;
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
 * 删除已上传没保存的商品图片
 * @param pImgKeyGuid 上传图片Key的GUID
 * @param pDomainUpload 上传服务器域名 [localhost:1400]
 * @param pUploadIndex 上传控件索引
 * */
function delGooGoodsImg(pImgKeyGuid, pDomainUpload, pUploadIndex) {

    confirmWinWidth("确定要删除活动照片吗？", function () {

        //构造POST参数
        var dataPOST = {
            "Type": "2", "ImgKeyGuid": pImgKeyGuid, "DomainUpload": pDomainUpload,
        };
        console.log(dataPOST);

        //正式发送异步请求
        $.ajax({
            type: "POST",
            url: "../FileUpload/ActivityImgs?rnd=" + Math.random(),
            data: dataPOST,
            dataType: "html",
            success: function (reTxt, status, xhr) {
                console.log(reTxt);
                if (reTxt != "") {
                    var _jsonBack = JSON.parse(reTxt);
                    if (_jsonBack.Msg != null) {
                        toastWin(_jsonBack.Msg);

                        //给隐藏控件赋值
                        $("#HidUploadGoodsVal_" + pUploadIndex).val("");

                        //给图片控件赋值
                        $("#GoodsImgPre_" + pUploadIndex).attr("src", "../Assets/Imgs/Icon/icon_camera.png");

                        //显示操作按钮组
                        $("#BtnGoodsList_" + pUploadIndex).hide();

                        return;
                    }
                    if (_jsonBack.ErrMsg != null) {
                        toastWin(_jsonBack.ErrMsg);
                    }

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
 * 删除因重复上传导致的多余礼品图片  -- 这里不需要，后台已处理
 * */
function delGoodsImgRepeat() {
    //构造POST参数
    var dataPOST = {
        "Type": "3"
    };
    console.log(dataPOST);

    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: "../FileUpload/ActivityImgs?rnd=" + Math.random(),
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
 * 初始化活动日期时间选择器
 * */
function initActivitySelDateTime() {

    $("#StartDate").dateDropper(
        {
            maxYear: '3020',
            animate: false
        }
    );
    $("#StartTime").timeDropper(
        {
            format: "HH:mm",
        });
    $("#EndDate").dateDropper(
        {
            maxYear: '3020',
            animate: false
        }
    );
    $("#EndTime").timeDropper(
        {
            format: "HH:mm",
        });

}

/**
 * 切换 ，活动类别 ( OnLine 线上 / OffLine 线下 )
 * */
function chgAcType() {
    var AcType = $("#AcType").val().trim();
    if (AcType == "OffLine") {
        $("#RegionDiv").show();
        $("#RegionDetailDiv").show();
        $("#RegionLocationDiv").show();
    }
    else if (AcType == "OnLine") {
        $("#RegionDiv").hide();
        $("#RegionDetailDiv").hide();
        $("#RegionLocationDiv").hide();
    }
}


/**
 * 初始化照片上传 插件
 * @param {any} pJsonGoodsImgList 照片列表 Json对象
 */
function initGoodsImgUploadList(pJsonGoodsImgList) {

    if (pJsonGoodsImgList == undefined || pJsonGoodsImgList == "") {
        return;
    }

    for (var i = 1; i < pJsonGoodsImgList.length + 1; i++) {

        $("#GoodsImgPre_" + i).attr("src", "//" + pJsonGoodsImgList[i - 1].ImgURL);
        $("#HidUploadGoodsVal_" + i).val(pJsonGoodsImgList[i - 1].UploadGuid + "|" + pJsonGoodsImgList[i - 1].ImgURL);


        var mImgPathDomain = pJsonGoodsImgList[i - 1].ImgURL;
        var mImgKeyGuid = pJsonGoodsImgList[i - 1].UploadGuid;

        //----构造按钮显示代码
        //获取图片URL中的 域名和图片相对路径  
        var _domainAndImgPathArr = getImgURLDomainAndImgPathArr(mImgPathDomain).split("^");
        var _btnGoodsListXhtml = "<a href=\"//" + _domainAndImgPathArr[0] + "/ToolWeb/CropZoom/CropZoom.aspx?CropImgWidth=700&CropImgHeight=700&CropTitle=礼品&ImgSourceURL=" + _domainAndImgPathArr[1] + "&RedirectURL=#\" target=\"_blank\">裁剪</a>";
        _btnGoodsListXhtml += "<div onclick=\"delGooGoodsImg('" + mImgKeyGuid + "','" + _domainAndImgPathArr[0] + "'," + i + ")\">删除</div><div onclick=\"refreshImgSrcRnd('GoodsImgPre_" + i + "')\">刷新</div>";
        //显示代码插入前台 
        $("#BtnGoodsList_" + i).html(_btnGoodsListXhtml);
        $("#BtnGoodsList_" + i).show();
    }

}



//=================提交 活动信息 =================//

/**
 * 提交活动信息
 * */
function submitActivityMsg() {


    //------活动标题-----//
    var AcTitle = $("#AcTitle").val().trim();
    if (AcTitle == "") {
        toastWinCb("【活动标题】不能为空！", function () {
            $("#AcTitle").focus();
        });

        return;
    }
    if (AcTitle.length > 80) {
        toastWinCb("【活动标题】字数不能超过80个！", function () {
            $("#AcTitle").focus();
        });
        return;
    }

    //------商品图片值------//
    //mImgKeyGuid | mImgPathDomain ^ mImgKeyGuid | mImgPathDomain^ mImgKeyGuid | mImgPathDomain
    //得到商品上传图片拼接数组 
    var _goodsImgArr = getGoodsImgArr();
    console.log("提交_goodsImgArr=" + _goodsImgArr);
    //alert("提交_goodsImgArr=" + _goodsImgArr);
    if (_goodsImgArr == "") {
        toastWin("请至少上传一张活动照片！");
        return;
    }

    //活动类别
    var AcType = $("#AcType").val().trim()
    //联系电话
    var AcMobile = $("#AcMobile").val().trim()
    if (AcMobile == "") {
        toastWinCb("【联系电话】不能为空！", function () {
            $("#AcMobile").focus();
        });
        return;
    }

    //区域范围
    var region_province = $("#region_province").val().trim();
    var region_city = $("#region_city").val().trim();
    var region_county = $("#region_county").val().trim();
    var RegionCodeArr = "";
    if (region_county == "" && AcType == "OffLine") {
        toastWin("【区域范围】不能为空！");
        return;
    }
    else {
        if (region_county != "" && AcType == "OffLine") {
            RegionCodeArr = region_province + "_" + region_city + "_" + region_county;
        }
    }



    //线下活动
    var AcAddress = "";
    var LatitudeTxt = "";
    var LongitudeTxt = "";
    if (AcType == "OffLine") {

        AcAddress = $("#AcAddress").val().trim();

        if (AcAddress == "") {
            toastWinCb("【详细地址】不能为空！", function () {
                $("#AcAddress").focus();
            });
            return;
        }

        LatitudeTxt = $("#LatitudeTxt").val().trim()
        LongitudeTxt = $("#LongitudeTxt").val().trim()

        if (LatitudeTxt == "" || LongitudeTxt == "") {
            toastWinCb("【活动位置坐标】不能为空，请在地图上选择！", function () {

            });
            return;
        }
    }

    //开始时间与结束时间
    var StartDate = $("#StartDate").val().trim();
    var StartTime = $("#StartTime").val().trim();
    var EndDate = $("#EndDate").val().trim();
    var EndTime = $("#EndTime").val().trim();
    if (StartDate == "" || StartTime == "" || EndDate == "" || EndTime == "") {
        toastWin("【开始时间】或【结束时间】填写不完整！");
        return;
    }

    //------活动简述------//
    var AcSketch = $("#AcSketch").val().trim();
    if (AcSketch == "") {
        toastWinCb("【活动简述】不能为空！", function () {
            $("#AcSketch").focus();
        });
        return;
    }
    if (AcSketch.length > 40) {
        toastWinCb("【活动简述】不能超过40个字！", function () {
            $("#AcSketch").focus();
        });
        return;
    }

    //-------活动描述---------//
    var AcDesc = $("#AcDesc").val().trim();
    if (AcDesc == "") {
        toastWinCb("【活动描述-】不能为空！", function () {
            $("#AcDesc").focus();
        });
        return;
    }

    //参与条件
    var LimitJoinType = $("#LimitJoinType").val().trim();
    //最大活动人数
    var LimitNumber = $("#LimitNumber").val().trim();
    if (LimitNumber == "") {
        LimitNumber = "0";
    }

    //到场参加验证
    var IsJoinCheck = $("#IsJoinCheck").is(":checked");
    //console.log("IsJoinCheck=" + IsJoinCheck);


    //构造POST参数
    var dataPOST = {
        "Type": "2", "AcTitle": AcTitle, "ActivityImgArr": _goodsImgArr, "AcType": AcType, "AcMobile": AcMobile, "AcAddress": AcAddress, "LatitudeTxt": LatitudeTxt, "LongitudeTxt": LongitudeTxt, "StartDate": StartDate, "StartTime": StartTime, "EndDate": EndDate, "EndTime": EndTime, "AcSketch": AcSketch, "AcDesc": AcDesc, "LimitJoinType": LimitJoinType, "LimitNumber": LimitNumber, "IsJoinCheck": IsJoinCheck, "RegionCodeArr": RegionCodeArr, "ActivityID": mActivityID,
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
            console.log("提交活动信息=" + reTxt);
            //移除加载提示
            closeLoadingWin();
            if (reTxt != "") {
                var _json = JSON.parse(reTxt);

                if (_json.Msg != "" && _json.Msg != null && _json.Msg != undefined) {

                    toastWinCb(_json.Msg, function () {
                        window.location.href = "../ActivityPage/ActivityDetail?AID=" + _json.DataDic.ActivityID;
                    });
                    return;
                }
                if (_json.ErrMsg != "" && _json.ErrMsg != null && _json.ErrMsg != undefined) {
                    toastWin(_json.ErrMsg);
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

