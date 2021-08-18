//==================编辑抽奖信息=========================//

/**-----定义公共变量------**/

//AjaxURL
var mAjaxUrl = "../LuckyDraw/LuckyDrawMsg";

//商家UserID
var mUserID = 0;
//抽奖ID
var mLuckydrawID = "";

//奖项列表Json字符串
var mJsonAwardsItemContentTotal = "";


/**------初始化------**/
$(function () {

    //商家UserID
    mUserID = $("#hidShopUserID").val().trim();
    //抽奖ID
    mLuckydrawID = $("#hidLuckydrawID").val().trim();

    //初始化所有图片上传插件
    initAllGoodsImgUploadFile();

    //初始化活动日期时间选择器
    initSelDateTime();

    //初始化位置选择窗口事件
    initSelLocationWin();

    //初始化自定义设置窗口显示代码
    initSettingWinHtml();

    //初始化抽奖信息
    initLuckyDrawMsg(function () {

    });


});


/**
 * 初始化抽奖信息
 * */
function initLuckyDrawMsg(pCallBack) {
    if (mLuckydrawID == 0 || mLuckydrawID == "") {
        return;
    }

    //构造POST参数
    var dataPOST = {
        "Type": "3", "LuckydrawID": mLuckydrawID,
    };
    console.log(dataPOST);

    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: mAjaxUrl + "?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("初始化抽奖信息=" + reTxt);
            if (reTxt != "") {
                var _jsonBack = JSON.parse(reTxt);

                var LuckyDrawMsg = _jsonBack.LuckyDrawMsg;
                var LuckyDrawImgs = _jsonBack.LuckyDrawImgs;

                $("#LuckydrawTitle").val(LuckyDrawMsg.LuckydrawTitle);
                $("#ExpressType").val(LuckyDrawMsg.ExpressType);
                $("#LuckydrawMobile").val(LuckyDrawMsg.LuckydrawMobile);
                $("#GetAddress").val(LuckyDrawMsg.GetAddress);
                $("#LatitudeTxt").val(LuckyDrawMsg.GaLatitude);
                $("#LongitudeTxt").val(LuckyDrawMsg.GaLongitude);
                $("#StartLuckyType").val(LuckyDrawMsg.StartLuckyType);
                $("#StartLuckyNumber").val(LuckyDrawMsg.StartLuckyNumber);
                var StartLuckyTimeArr = LuckyDrawMsg.StartLuckyTime.split(" ");
                $("#StartLuckyDate").val(StartLuckyTimeArr[0]);
                $("#StartLuckyTime").val(StartLuckyTimeArr[1]);
                $("#LuckydrawDesc").val(LuckyDrawMsg.LuckydrawDesc);
                $("#JoinLimit").val(LuckyDrawMsg.JoinLimit);
                $("#JoinNumberMax").val(LuckyDrawMsg.JoinNumberMax);


                //初始化设置奖项窗口
                mJsonAwardsItemContentTotal = buildAwardsItemContentTotalJSON(LuckyDrawMsg.AwardsItemArr, LuckyDrawMsg.AwardsContentArr, LuckyDrawMsg.WinnerTotalArr).toString();
                //构造奖项奖品数量 表格显示代码 
                var _xhtml = xhtmlAwardsItemContentTotalTable(LuckyDrawMsg.AwardsItemArr, LuckyDrawMsg.AwardsContentArr, LuckyDrawMsg.WinnerTotalArr);
                $("#TableTbody").html(_xhtml);
        
                if (LuckyDrawMsg.ExpressType == "shop") {
                    $("#RegionDetailDiv").show();
                    $("#RegionLocationDiv").show();
                }
                else {
                    $("#RegionDetailDiv").hide();
                    $("#RegionLocationDiv").hide();
                }

                if (LuckyDrawMsg.StartLuckyType == "OverTime") {
                    $("#OverTimeLabel").show();
                    $("#JoinNumberLabel").hide();
                }
                else {
                    $("#OverTimeLabel").hide();
                    $("#JoinNumberLabel").show();
                }


                //初始化照片上传 插件
                initGoodsImgUploadList(LuckyDrawImgs);

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


//==================自定义函数=================//

/**
 * 切换 奖品配送方式
 * */
function chgExpressType() {

    var ExpressType = $("#ExpressType").val().trim();
    if (ExpressType == "shop") {
        $("#RegionDetailDiv").show();
        $("#RegionLocationDiv").show();
    }
    else if (ExpressType == "express") {
        $("#RegionDetailDiv").hide();
        $("#RegionLocationDiv").hide();
    }
}

/**
 * 切换开奖方式
 * */
function chgStartLuckyType() {

    var StartLuckyType = $("#StartLuckyType").val().trim();

    //到时间开奖
    if (StartLuckyType == "OverTime") {
        $("#JoinNumberLabel").hide();
        $("#OverTimeLabel").show();
    }
    else if (StartLuckyType == "JoinNumber") //到人数开奖
    {
        $("#JoinNumberLabel").show();
        $("#OverTimeLabel").hide();
    }
}

/**
 * 设置与保存奖项的Json
 * */
function setAwardsItemContentTotal() {

    //得到奖项Json字符串
    mJsonAwardsItemContentTotal = getAwardsItemContentTotalJSON();
    if (mJsonAwardsItemContentTotal == "" || mJsonAwardsItemContentTotal == "[]") {
        return;
    }

    var _AwardsItemContentTotalJSON = JSON.parse(mJsonAwardsItemContentTotal);

    //循环赋值表格
    var myJsVal = "";
    for (var i = 0; i < _AwardsItemContentTotalJSON.length; i++) {
        myJsVal += "<tr>";
        myJsVal += "<td>" + _AwardsItemContentTotalJSON[i].AwardsItem + "</td>";        myJsVal += "<td>" + _AwardsItemContentTotalJSON[i].AwardsContent + "</td>";        myJsVal += "<td>" + _AwardsItemContentTotalJSON[i].WinnerTotal + "</td>";        myJsVal += "</tr>";    }
    $("#TableTbody").html(myJsVal);

    //关闭窗口
    closeDialogWin();

}

/**
 * 得到奖项Json字符串
 * */
function getAwardsItemContentTotalJSON() {

    var AwardsItemLabelArr = $("input[name='AwardsItem']");
    var AwardsContentLabelArr = $("input[name='AwardsContent']");
    var WinnerTotalLabelArr = $("input[name='WinnerTotal']");
    console.log(AwardsItemLabelArr);

    //构造Json
    var _json = "[";

    for (var i = 0; i < AwardsItemLabelArr.length; i++) {

        var AwardsItem = $(AwardsItemLabelArr[i]).val();
        var AwardsContent = $(AwardsContentLabelArr[i]).val();
        var WinnerTotal = $(WinnerTotalLabelArr[i]).val();
        //console.log("AwardsItem=" + AwardsItem);

        if (AwardsItem == "" || AwardsContent == "" || WinnerTotal == "") {
            toastWinToDiv("【奖项信息】填写不完整！", "dragWinDiv");
            return "[]";
        }

        _json += "{";
        _json += "\"AwardsItem\":\"" + AwardsItem + "\",";
        _json += "\"AwardsContent\":\"" + AwardsContent + "\",";
        _json += "\"WinnerTotal\":\"" + WinnerTotal + "\"";
        _json += "},";
    }
    //去掉
    _json = removeFrontAndBackChar(_json, ",");

    _json += "]"

    console.log(_json);

    return _json;

}

/**
 * 构造奖项，奖品，奖项数量 Json字符串
 * @param {any} pAwardsItemArr 奖项名称： 用^连接  ( 一等奖 ^ 二等奖)
 * @param {any} pAwardsContentArr 奖品内容 （2000元快客购物卡 x 10 ^ 200元消费券 x20  )   与 AwardsItemArr 一一对应
 * @param {any} pWinnerTotalArr 每个奖项的中奖人数，与 AwardsItemArr 一一对应 [ 23 ^ 32]
 */
function buildAwardsItemContentTotalJSON(pAwardsItemArr, pAwardsContentArr, pWinnerTotalArr) {


    //分割数组
    var AwardsItemArr = new Array();
    var AwardsContentArr = new Array();
    var WinnerTotalArr = new Array();

    if (pAwardsItemArr.indexOf("^") >= 0) {
        AwardsItemArr = pAwardsItemArr.split('^');
        AwardsContentArr = pAwardsContentArr.split('^');
        WinnerTotalArr = pWinnerTotalArr.split('^');
    }
    else {
        AwardsItemArr[0] = pAwardsItemArr;
        AwardsContentArr[0] = pAwardsContentArr;
        WinnerTotalArr[0] = pWinnerTotalArr;
    }

    //循环构造
    var _json = "[";
    for (var i = 0; i < AwardsItemArr.length; i++) {

        _json += "{";
        _json += "\"AwardsItem\":\"" + AwardsItemArr[i] + "\",";
        _json += "\"AwardsContent\":\"" + AwardsContentArr[i] + "\",";
        _json += "\"WinnerTotal\":\"" + WinnerTotalArr[i] + "\"";
        _json += "},";
    }
    //去掉
    _json = removeFrontAndBackChar(_json, ",");

    _json += "]";
    return _json;
}

/**
 * 构造奖项奖品数量 表格显示代码 
 * @param {any} pAwardsItemArr
 * @param {any} pAwardsContentArr
 * @param {any} pWinnerTotalArr
 */
function xhtmlAwardsItemContentTotalTable(pAwardsItemArr, pAwardsContentArr, pWinnerTotalArr) {
    //分割数组
    var AwardsItemArr = new Array();
    var AwardsContentArr = new Array();
    var WinnerTotalArr = new Array();

    if (pAwardsItemArr.indexOf("^") >= 0) {
        AwardsItemArr = pAwardsItemArr.split('^');
        AwardsContentArr = pAwardsContentArr.split('^');
        WinnerTotalArr = pWinnerTotalArr.split('^');
    }
    else {
        AwardsItemArr[0] = pAwardsItemArr;
        AwardsContentArr[0] = pAwardsContentArr;
        WinnerTotalArr[0] = pWinnerTotalArr;
    }

    //循环构造
    var _xhtml = "";
    for (var i = 0; i < AwardsItemArr.length; i++) {
        _xhtml += "<tr>";        _xhtml += "<td>" + AwardsItemArr[i] +"</td>";        _xhtml += "<td>" + AwardsContentArr[i] +"</td>";        _xhtml += "<td>" + WinnerTotalArr[i] +"</td>";    }
    return _xhtml;
}

//=================提交抽奖信息================//

/**
 * 提交抽奖信息
 * */
function submitLuckyDrawMsg() {

    var LuckydrawTitle = $("#LuckydrawTitle").val().trim();
    var ExpressType = $("#ExpressType").val().trim();
    var LuckydrawMobile = $("#LuckydrawMobile").val().trim();
    var GetAddress = $("#GetAddress").val().trim();
    var LatitudeTxt = $("#LatitudeTxt").val().trim();
    var LongitudeTxt = $("#LongitudeTxt").val().trim();
    var StartLuckyType = $("#StartLuckyType").val().trim();
    var StartLuckyNumber = $("#StartLuckyNumber").val().trim();

    var StartLuckyDate = $("#StartLuckyDate").val().trim();
    var StartLuckyTime = $("#StartLuckyTime").val().trim();
    var StartLuckyDateTime = StartLuckyDate + " " + StartLuckyTime;

    var LuckydrawDesc = $("#LuckydrawDesc").val().trim();
    var JoinLimit = $("#JoinLimit").val().trim();
    var JoinNumberMax = $("#JoinNumberMax").val().trim();

    //得到奖项Json字符串
    //var JSONAwardsItemContentTotal = getAwardsItemContentTotalJSON();

    //得到商品上传图片拼接数组  mImgKeyGuid | mImgPathDomain ^ mImgKeyGuid | mImgPathDomain^ mImgKeyGuid | mImgPathDomain
    var GoodsImgArr = getGoodsImgArr();

    //-----------判断输入合法性---------//
    if (LuckydrawTitle == "") {
        toastWinCb("【抽奖标题】不能为空！", function () {
            $("#LuckydrawTitle").focus();
        });
        return;
    }
    if (LuckydrawTitle.length > 80) {
        toastWinCb("【抽奖标题】字数不能超过80个！", function () {
            $("#LuckydrawTitle").focus();
        });
        return;
    }
    //判断联系电话
    if (LuckydrawMobile == "") {
        toastWinCb("【联系电话】不能为空！", function () {
            $("#LuckydrawMobile").focus();
        });
        return;
    }
    //领奖地址 
    if (ExpressType == "shop") {
        if (GetAddress == "" || LatitudeTxt == "" || LongitudeTxt == "") {
            toastWinCb("【领奖详细地址】【领奖位置坐标】都不能为空！", function () {
                $("#GetAddress").focus();
            });
            return;
        }
    }
    //开奖方式
    if (StartLuckyType == "JoinNumber") {
        if (StartLuckyNumber == "" || StartLuckyNumber == "0") {
            toastWinCb("【开奖人数】不能为空或零！", function () {
                $("#StartLuckyNumber").focus();
            });
            return;
        }

        StartLuckyDateTime = "";
    }
    else if (StartLuckyType == "OverTime") {
        if (StartLuckyDate == "") {
            toastWinCb("【开奖时间】填写不完整！", function () {
                $("#StartLuckyDate").focus();
            });
            return;
        }
    }
    //奖项设置
    console.log("mJsonAwardsItemContentTotal=" + mJsonAwardsItemContentTotal);
    if (mJsonAwardsItemContentTotal == "" || JSON.parse(mJsonAwardsItemContentTotal).length <= 0) {
        toastWinCb("请设置【奖项】内容！", function () {
            openSettingWin();
        });
        return;
    }
    //抽奖图片
    if (GoodsImgArr == "") {
        toastWinCb("【抽奖图片】至少上传一张！", function () {

        });
        return;
    }
    //抽奖描述
    if (LuckydrawDesc == "") {
        toastWinCb("【抽奖描述】不能为空！", function () {
            $("#LuckydrawDesc").focus();
        });
        return;
    }
    //最大参与人数
    if (JoinNumberMax == "") {
        toastWinCb("【最大参与人数】不能为空！", function () {
            $("#JoinNumberMax").focus();
        });
        return;
    }
    if (parseInt(JoinNumberMax) < 0) {
        toastWinCb("【最大参与人数】必须 >=0 ！", function () {
            $("#JoinNumberMax").focus();
        });
        return;
    }

    if (mJsonAwardsItemContentTotal == "" || JSON.parse(mJsonAwardsItemContentTotal).length <= 0) {

        return
    }


    //构造POST参数
    var dataPOST = {
        "Type": "2", "LuckydrawTitle": LuckydrawTitle, "LuckydrawDesc": LuckydrawDesc, "LuckydrawMobile": LuckydrawMobile, "ExpressType": ExpressType, "StartLuckyType": StartLuckyType, "StartLuckyNumber": StartLuckyNumber, "StartLuckyTime": StartLuckyDateTime, "JoinNumberMax": JoinNumberMax, "GetAddress": GetAddress, "GaLongitude": LongitudeTxt, "GaLatitude": LatitudeTxt, "JoinLimit": JoinLimit, "LuckyDrawImgArr": GoodsImgArr, "JsonAwardsItemContentTotal": mJsonAwardsItemContentTotal, "LuckydrawID": $("#hidLuckydrawID").val().trim(),
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
            console.log("提交抽奖信息=" + reTxt);
            //移除加载提示
            closeLoadingWin();
            if (reTxt != "") {
                var _json = JSON.parse(reTxt);

                if (_json.Msg != "" && _json.Msg != null && _json.Msg != undefined) {

                    toastWinCb(_json.Msg, function () {
                        window.location.href = "../LuckyDrawPage/LuckyDrawMsgDetail?LID=" + _json.DataDic.LuckydrawID;
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



//=============抽奖图片相关===============//

/**
 * 初始化所有图片上传插件
 * */
function initAllGoodsImgUploadFile() {

    for (var i = 1; i < 6; i++) {
        //初始化商品图片上传插件
        initGoodsImgUploadFile(i);
    }
}

/**
 * 初始化图片上传插件
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
        url: "../FileUpload/LuckyDrawImgs?" + _dataPost + "&rnd=" + Math.random(),
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

    confirmWinWidth("确定要删除照片吗？", function () {

        //构造POST参数
        var dataPOST = {
            "Type": "2", "ImgKeyGuid": pImgKeyGuid, "DomainUpload": pDomainUpload,
        };
        console.log(dataPOST);

        //正式发送异步请求
        $.ajax({
            type: "POST",
            url: "../FileUpload/LuckyDrawImgs?rnd=" + Math.random(),
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
        url: "../FileUpload/LuckyDrawImgs?rnd=" + Math.random(),
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
        var _btnGoodsListXhtml = "<a href=\"//" + _domainAndImgPathArr[0] + "/ToolWeb/CropZoom/CropZoom.aspx?CropImgWidth=700&CropImgHeight=700&CropTitle=抽奖&ImgSourceURL=" + _domainAndImgPathArr[1] + "&RedirectURL=#\" target=\"_blank\">裁剪</a>";
        _btnGoodsListXhtml += "<div onclick=\"delGooGoodsImg('" + mImgKeyGuid + "','" + _domainAndImgPathArr[0] + "'," + i + ")\">删除</div><div onclick=\"refreshImgSrcRnd('GoodsImgPre_" + i + "')\">刷新</div>";
        //显示代码插入前台 
        $("#BtnGoodsList_" + i).html(_btnGoodsListXhtml);
        $("#BtnGoodsList_" + i).show();
    }

}




//=====================弹出设置窗口==================================//

var mSettingWinHtml = "";
/**
 * 初始化设置窗口显示代码
 */
function initSettingWinHtml() {
    //获取窗口显示代码
    mSettingWinHtml = $("#SettingWin").html();
    $("#SettingWin").empty();
}

/**
 * 打开设置窗口
 */
function openSettingWin() {

    //mMsgID = pMsgID;

    //打开Dialog弹出窗口
    openDialogWinNoClose("设置奖项信息", mSettingWinHtml, function () {

        //设置与保存奖项的Json
        setAwardsItemContentTotal();

    }, function () {


    }, 580);

    //初始化设置奖项窗口
    if (mJsonAwardsItemContentTotal != "") {
        initSettingWin();
    }

}

/**
 * 初始化设置奖项窗口
 * */
function initSettingWin() {

    var myJsVal = "";

    var _jsonAwardsItemContentTotal = JSON.parse(mJsonAwardsItemContentTotal);

    //console.log(_jsonAwardsItemContentTotal);

    //赋值窗口表单
    for (var i = 0; i < _jsonAwardsItemContentTotal.length; i++) {
        myJsVal += "<li>";        myJsVal += " <div>";        myJsVal += "     <span>奖项名称：</span>";        myJsVal += "     <input type=\"text\" name=\"AwardsItem\" class=\"txt-css-win\" value=\"" + _jsonAwardsItemContentTotal[i].AwardsItem + "\" />";        myJsVal += " </div>";        myJsVal += " <div>";        myJsVal += "     <span>奖品内容：</span>";        myJsVal += "     <input type=\"text\" name=\"AwardsContent\" class=\"txt-css-win\" value=\"" + _jsonAwardsItemContentTotal[i].AwardsContent + "\" />";        myJsVal += " </div>";        myJsVal += " <div>";        myJsVal += "     <span>奖项数量：</span>";        myJsVal += "     <input type=\"number\" name=\"WinnerTotal\" class=\"txt-css-win\" value=\"" + _jsonAwardsItemContentTotal[i].WinnerTotal + "\" />";        myJsVal += " </div>";        myJsVal += "</li>";    }

    if (_jsonAwardsItemContentTotal.length <= 0) {
        myJsVal += "<li>";        myJsVal += " <div>";        myJsVal += "     <span>奖项名称：</span>";        myJsVal += "     <input type=\"text\" name=\"AwardsItem\" class=\"txt-css-win\" />";        myJsVal += " </div>";        myJsVal += " <div>";        myJsVal += "     <span>奖品内容：</span>";        myJsVal += "     <input type=\"text\" name=\"AwardsContent\" class=\"txt-css-win\" />";        myJsVal += " </div>";        myJsVal += " <div>";        myJsVal += "     <span>奖项数量：</span>";        myJsVal += "     <input type=\"number\" name=\"WinnerTotal\" class=\"txt-css-win\" />";        myJsVal += " </div>";        myJsVal += "</li>";
    }

    $("#WinSettingUL").html(myJsVal);

    
}

/**
 * 添加奖项
 * */
function addAwardsItemXhtml() {

    //奖项显示代码 
    var myJsVal = "";    myJsVal += "<li>";    myJsVal += " <div>";    myJsVal += "     <span>奖项名称：</span>";    myJsVal += "     <input type=\"text\" name=\"AwardsItem\" class=\"txt-css-win\" />";    myJsVal += " </div>";    myJsVal += " <div>";    myJsVal += "     <span>奖品内容：</span>";    myJsVal += "     <input type=\"text\" name=\"AwardsContent\" class=\"txt-css-win\" />";    myJsVal += " </div>";    myJsVal += " <div>";    myJsVal += "     <span>奖项数量：</span>";    myJsVal += "     <input type=\"number\" name=\"WinnerTotal\" class=\"txt-css-win\" />";    myJsVal += " </div>";    myJsVal += "</li>";    $("#WinSettingUL").append(myJsVal);}

/**
 * 删除奖项
 * */
function removeAwardsItemXhtml() {

    $("#WinSettingUL").children(':last-child').remove();

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


/**
 * 初始化活动日期时间选择器
 * */
function initSelDateTime() {

    $("#StartLuckyDate").dateDropper(
        {
            maxYear: '3020',
            animate: false
        }
    );
    $("#StartLuckyTime").timeDropper(
        {
            format: "HH:mm",
        });
}