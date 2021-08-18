//==================店铺首页轮播 - 管理===========================//

//AjaxURL
var mAjaxUrl = "../Shop/ShopHomeCarousel";

//添加修改窗口的Html显示代码
var mAddEditWinHtml = "";

var mUserID = 0; //商家UserID

var mShopID = ""; //店铺ID

//连接值是否正确
var mIsCorrectAdvLinkA = false;

var mCarouselID = ""; //当前的轮播ID

//手机web端域名
var mOctWapWeb_AddrDomain = "";


/******数据分页的变量********/
var strPOSTSe = ""; //搜索条件对象 POST参数
var intPageCurrent = 1; //当前页
var pageSize = 15; //当页的记录条数，与后台保持一致
var recordSum = 0; //总记录数
var tableColNum = 10; //当前表列数




/**------初始化------**/
$(function () {

    mOctWapWeb_AddrDomain = $("#hidOctWapWeb_AddrDomain").val().trim();

    //初始化UserID
    mUserID = $("#hidUserID").val().trim();

    //初始化添加修改窗口显示代码
    initAddEditWinHtml();

    //初始化加载
    searchContent();

    //搜索按钮单击事件
    $("#btnSearch").click(function () {
        searchContent();
    });


});


/*
---------定义搜索函数---------
*/
var searchContent = function () {

    intPageCurrent = 1; //开始页

    var CarouselID_se = $("#CarouselID_se").val().trim();
    var CarouselTitle_se = $("#CarouselTitle_se").val().trim();
    var CMemo_se = $("#CMemo_se").val().trim();
    var AdvLinkType_se = $("#AdvLinkType_se").val().trim();
    var WriteDate_se = $("#WriteDate_se").val().trim();

    //构造POST参数
    var strPOST = {
        "pageCurrent": "1", "Type": "3",
    };

    //翻页所用
    var strPOSTSePush = {
        "CarouselID": CarouselID_se, "CarouselTitle": CarouselTitle_se, "CMemo": CMemo_se, "AdvLinkType": AdvLinkType_se, "WriteDate": WriteDate_se,
    };
    //将对象添加到分类对象中

    //搜索内容用
    var strPOSTSeContent = pushTwoObject(strPOST, strPOSTSePush);

    //分页操作用
    var strPOSTSearch = { "Type": "3" };
    strPOSTSe = pushTwoObject(strPOSTSearch, strPOSTSePush);
    console.log(strPOSTSe);

    //加载提示
    $("#TbodyTrPage").html("<tr><td colspan=\"" + tableColNum + "\">… 数据加载中 …</td></tr>");

    //以POST方式发送异步请求
    $.ajax({
        type: "POST",
        url: mAjaxUrl + "?rnd=" + Math.random(),
        data: strPOSTSeContent,
        dataType: "html",
        success: function (reTxtJson, status, xhr) {
            //显示返回值
            console.log("数据分页=" + reTxtJson);
            if (reTxtJson != "") {

                //分页成功返回，构造显示代码
                pageSuccess(reTxtJson);

            }
            else {
                //加载提示
                $("#TbodyTrPage").html("<tr><td colspan=\"" + tableColNum + "\">没有搜索到相关数据</td></tr>");
            }
        },
        error: function (xhr, errorTxt, status) {
            console.log("错误信息errorTxt=" + errorTxt + " | status=" + status);
            //alert("网络出现异常,请重试！");
        }

    });
};


//------------解析JSON数据 构造 前台显示代码--------------//
// pJsonTxt Json字符串
function jsonToXhtml(pJsonObject) {

    //将字符串转换成功JSON对象
    //var json = JSON.parse(pJsonTxt);
    var json = pJsonObject;

    //-----内容显示前台显示代码----//
    var myJsVal = "";
    //循环构造
    for (var i = 0; i < json.DataPage.length; i++) {

        var indexDataPage = json.DataPage[i];
        var indexDataPageExtra = json.DataPageExtra[i];

        if (i == 0) {
            mShopID = indexDataPageExtra.ShopID;
            //浏览效果按钮
            goPreShopIndex();
        }

        var _AdvLinkType = "";
        if (indexDataPage.AdvLinkType == "Goods") {
            _AdvLinkType = "商品";
        }
        else if (indexDataPage.AdvLinkType == "Present") {
            _AdvLinkType = "礼品";
        }
        else if (indexDataPage.AdvLinkType == "Coupons") {
            _AdvLinkType = "优惠券";
        }
        else if (indexDataPage.AdvLinkType == "Activity") {
            _AdvLinkType = "活动";
        }
        else if (indexDataPage.AdvLinkType == "LuckyDraw") {
            _AdvLinkType = "抽奖";
        }

        var _IsShow = "显示";
        if (indexDataPage.IsShow == "false") {
            _IsShow = "隐藏";
        }

        myJsVal += "<tr>";
        myJsVal += "  <td><input type=\"checkbox\" name=\"SelCbItem\" id=\"SelCbItem_" + indexDataPage.CarouselID + "\" />";
        myJsVal += " <td>" + indexDataPage.CarouselID + "</td>";
        myJsVal += " <td>" + indexDataPage.CarouselTitle + "</td>";
        myJsVal += " <td><a href=\"//" + indexDataPage.ImgURL + "\" target=\"_blank\"><img src=\"//" + indexDataPage.ImgURL + "\" style=\"width: 210px; height: 80px;\" /></a></td>";
        myJsVal += " <td>" + _AdvLinkType + "</td>";
        myJsVal += " <td>" + _AdvLinkType + "ID:" + indexDataPage.AdvLinkA + "</td>";
        myJsVal += " <td>" + indexDataPage.CMemo + "</td>";
        myJsVal += " <td>" + _IsShow + "</td>";
        myJsVal += " <td>" + indexDataPage.WriteDate + "</td>";
        myJsVal += " <td>";

        if (indexDataPage.IsShow == "true") {
            myJsVal += "<button class=\"table-btn am-btn am-btn-default am-btn-xs am-text-secondary am-round\" onclick=\"tglShopCarouselIsShow('" + indexDataPage.CarouselID + "','false')\">隐藏</button>";
        }
        else {
            myJsVal += "<button class=\"table-btn am-btn am-btn-default am-btn-xs am-text-secondary am-round\" onclick=\"tglShopCarouselIsShow('" + indexDataPage.CarouselID + "','true')\">显示</button>";
        }


        myJsVal += "     <button class=\"table-btn am-btn am-btn-default am-btn-xs am-text-success am-round\" onclick=\"goTopShopCarousel('" + indexDataPage.CarouselID + "')\">置顶</button>";

        myJsVal += "     <button class=\"table-btn am-btn am-btn-default am-btn-xs am-text-danger am-round\" onclick=\"openEditWin('" + indexDataPage.CarouselID + "')\">修改</button>";
        myJsVal += " </td>";
        myJsVal += "</tr>";


    }
    //alert(myJsVal);

    //-----分页控制条显示代码-------//
    var pageBarXhtml = "";

    pageBarXhtml += " <li><a href=\"javascript:void(0)\" onclick=\"PrePage()\">«</a></li>";
    pageBarXhtml += " <li><a href=\"javascript:void(0)\" onclick=\"NumberPage('1')\">1</a></li>";
    pageBarXhtml += "  <li><span>...</span></li>";


    if ((intPageCurrent - 2) > 0) {
        pageBarXhtml += "  <li><a href=\"javascript:void(0)\" onclick=\"NumberPage('" + (intPageCurrent - 2) + "')\">" + (intPageCurrent - 2) + "</a></li>";
    }
    if ((intPageCurrent - 1) > 0) {
        pageBarXhtml += "  <li><a href=\"javascript:void(0)\" onclick=\"NumberPage('" + (intPageCurrent - 1) + "')\">" + (intPageCurrent - 1) + "</a></li>";
    }


    pageBarXhtml += "  <li class=\"am-active\"><a href=\"javascript:void(0)\" onclick=\"NumberPage('" + json.PageCurrent + "')\">" + json.PageCurrent + "</a></li>";

    //console.log(parseInt(json.PageSum));

    if ((intPageCurrent + 1) <= parseInt(json.PageSum)) {
        pageBarXhtml += "  <li><a href=\"javascript:void(0)\" onclick=\"NumberPage('" + (intPageCurrent + 1) + "')\">" + (intPageCurrent + 1) + "</a></li>";
    }
    if ((intPageCurrent + 2) <= parseInt(json.PageSum)) {
        pageBarXhtml += "  <li><a href=\"javascript:void(0)\" onclick=\"NumberPage('" + (intPageCurrent + 2) + "')\">" + (intPageCurrent + 2) + "</a></li>";
    }

    pageBarXhtml += "  <li><span>...</span></li>";
    pageBarXhtml += "  <li><a href=\"javascript:void(0)\" onclick=\"NumberPage('" + json.PageSum + "')\">" + json.PageSum + "</a></li>";
    pageBarXhtml += "  <li><input type=\"number\" id=\"PageNumTxt\" class=\"page-go-text am-form-field\" placeholder=\"跳转页\" /></li>";
    pageBarXhtml += "  <li><a href=\"javascript:void(0)\" onclick=\"NextPage()\">»</a></li>";

    var _pageMsgArr = new Array()
    //内容显示代码 
    _pageMsgArr[0] = myJsVal;
    //控制条件显示代码
    _pageMsgArr[1] = pageBarXhtml;
    //返回数组
    return _pageMsgArr;
}


//------------------------------搜索结果分页-------------------------------//
//具体页
function NumberPage(pagecurrent) {
    intPageCurrent = parseInt(pagecurrent);

    //以GET方式发送分页请求的函数
    sendPageHttpGet(intPageCurrent);
}

//上一页
function PrePage() {
    intPageCurrent = intPageCurrent - 1;

    console.log("上一页intPageCurrent=" + intPageCurrent);

    if (intPageCurrent > 0) {

        //以GET方式发送分页请求的函数
        sendPageHttpGet(intPageCurrent);

    }
    else {
        intPageCurrent = 1;
    }
}


//下一页
function NextPage() {
    intPageCurrent = parseInt(intPageCurrent) + 1;

    console.log("下一页intPageCurrent=" + intPageCurrent);

    console.log("recordSum=" + recordSum);
    console.log("pageSize=" + pageSize);
    //计算总页数
    var intPageSum = recordSum % pageSize != 0 ? recordSum / pageSize + 1 : recordSum / pageSize;
    console.log("intPageSum=" + intPageSum);
    if (intPageCurrent <= parseInt(intPageSum)) {

        //以GET方式发送分页请求的函数
        sendPageHttpGet(intPageCurrent);

    }
    else {
        intPageCurrent = parseInt(intPageSum);
    }

}

//----------------以GET方式发送分页请求的函数-----------------//
var sendPageHttpGet = function (intPageCurrent) {
    //构造GET参数
    strPOSTSe = pushTwoObject(strPOSTSe, { "pageCurrent": intPageCurrent });

    //加载提示
    $("#TbodyTrPage").html("<tr><td colspan=\"" + tableColNum + "\">… 数据加载中 …</td></tr>");

    $.ajax({
        type: "GET",
        url: mAjaxUrl + "?rnd=" + Math.random(),
        data: strPOSTSe,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            //成功返回后的处理函数
            pageSuccess(reTxt)
        },
        error: function (xhr, errorTxt, status) {
            console.log("异步请求错误，errorTxt=" + errorTxt + " | status=" + status);
            //alert("网络出现异常,请重试！");
            return;
        }
    });
}


//------------分页信息成功返回------------//
// @ reTxtJson 返回的Json字符串
function pageSuccess(reTxtJson) {
    if (reTxtJson != "") {

        var reJsonObject = JSON.parse(reTxtJson);
        console.log(reJsonObject);

        //总的记录数
        recordSum = reJsonObject.RecordSum;
        pageSize = reJsonObject.PageSize;


        //解析JSON数据 构造 前台显示代码
        var _xhtmlArr = jsonToXhtml(reJsonObject);

        //显示内容
        $("#TbodyTrPage").html(_xhtmlArr[0]);
        //分页控制条
        $("#PageBar1").html(_xhtmlArr[1]);

        //滚动条回到顶部
        document.body.scrollTop = 0;


        //跳转页 获取当文本框获取了焦点，按了键盘事件
        $("#PageNumTxt").keydown(function (event) {
            //alert(event.keyCode);
            if (event.keyCode == "13") {

                //跳转方法
                gotoPage();

                return false;
            }
        });

        //全不选
        document.getElementById("SelAllCb").checked = false;

    }
    else {
        $("#TbodyTrPage").html("<tr><td colspan=\"" + tableColNum + "\">没有搜索到相关数据</td></tr>");
    }
}


//------------跳转页---------------//
function gotoPage() {

    var pageNum = $("#PageNumTxt").val()
    //判断输入的页数是否小于0
    if (parseInt(pageNum) <= 0) {
        toastWin("跳转的页数不能小于或等于0!");
        return;
    }

    //判断页输入框是否为空
    if (pageNum == "" || pageNum == null) {
        toastWin("请输入要跳转的页数！");
        return;
    }
    //判断输入的页是否为数字
    if (isNaN(pageNum)) {
        toastWin("跳转的页数必须是数字！");
        return;
    }

    //调用数据库函数
    NumberPage(pageNum);
}




//===============自定义函数==========================//

/**
 * 查询商品，礼品，优惠券，活动，抽奖标题等信息
 * */
function searchShopAllCategoryMsg() {

    var SearchType = $("#AdvLinkTypeWin").val().trim();
    var DataID = $("#AdvLinkAWin").val().trim();
    if (DataID == "") {
        $("#TitlePreLi").hide();
    }

    $("#TitlePreLi").hide();

    //构造POST参数
    var dataPOST = {
        "Type": "1", "SearchType": SearchType, "DataID": DataID
    };
    console.log(dataPOST);

    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: mAjaxUrl + "?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("查询商品，礼品，优惠券，活动，抽奖标题等信息=" + reTxt);
            if (reTxt != "") {
                var _jsonReTxt = JSON.parse(reTxt);

                if (_jsonReTxt.Title != null) {
                    //轮播图片的跳转链接类型 ( Goods 商品，Present 礼品，Coupons 优惠券，Activity 活动，LuckyDraw 抽奖) 
                    if (_jsonReTxt.SearchType == "Goods") {

                        $("#TitlePreLi").show();
                        $("#TitlePreLi").html("<a href=\"" + mOctWapWeb_AddrDomain + "/Goods/GoodsDetailPreMobileIframe?GID=" + _jsonReTxt.DataID + "\" target=\"_blank\">" + _jsonReTxt.Title + "</a>");
                    }
                    else if (_jsonReTxt.SearchType == "Present") {
                        $("#TitlePreLi").show();
                        $("#TitlePreLi").html("<a href=\"" + mOctWapWeb_AddrDomain + "/Present/PresentDetailPreMobileIframe?PID=" + _jsonReTxt.DataID + "\" target=\"_blank\">" + _jsonReTxt.Title + "</a>");
                    }
                    else if (_jsonReTxt.SearchType == "Coupons") {
                        $("#TitlePreLi").show();
                        $("#TitlePreLi").html("<a href=\"" + mOctWapWeb_AddrDomain + "/Mall/PagePreMobileIframe?LoadPreURL=../Buyer/CouponsDetail?CID=" + _jsonReTxt.DataID + "\" target=\"_blank\">" + _jsonReTxt.Title + "</a>");
                    }
                    else if (_jsonReTxt.SearchType == "Activity") {
                        $("#TitlePreLi").show();
                        $("#TitlePreLi").html("<a href=\"" + mOctWapWeb_AddrDomain + "/Shop/ActivityDetailPreMobileIframe?AID=" + _jsonReTxt.DataID + "\" target=\"_blank\">" + _jsonReTxt.Title + "</a>");
                    }
                    else if (_jsonReTxt.SearchType == "LuckyDraw") {
                        $("#TitlePreLi").show();
                        $("#TitlePreLi").html("<a href=\"" + mOctWapWeb_AddrDomain + "/Mall/LuckyDrawDetailPreMobileIframe?LID=" + _jsonReTxt.DataID + "\" target=\"_blank\">" + _jsonReTxt.Title + "</a>");
                    }


                    mIsCorrectAdvLinkA = true;
                }
                else {
                    mIsCorrectAdvLinkA = false;
                }

            }
            else {
                mIsCorrectAdvLinkA = false;
            }


        },
        error: function (xhr, errorTxt, status) {
            console.log("异步请求错误，errorTxt=" + errorTxt + " | status=" + status);
            return;
        }
    });

}

/**
 * 切换店铺轮播显示
 * @param {any} pCarouselID
 * @param {any} pIsShow 是否显示 ( false / true )
 */
function tglShopCarouselIsShow(pCarouselID, pIsShow) {

    //构造POST参数
    var dataPOST = {
        "Type": "4", "CarouselID": pCarouselID, "IsShow": pIsShow
    };
    console.log(dataPOST);

    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: mAjaxUrl + "?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("切换店铺轮播显示=" + reTxt);
            if (reTxt != "") {
                var _jsonReTxt = JSON.parse(reTxt);

                if (_jsonReTxt.ErrMsg != undefined && _jsonReTxt.ErrMsg != null && _jsonReTxt.ErrMsg != "") {
                    toastWin(_jsonReTxt.ErrMsg);
                    return;
                }
                if (_jsonReTxt.Msg != undefined && _jsonReTxt.Msg != null && _jsonReTxt.Msg != "") {
                    toastWin(_jsonReTxt.Msg);
                    //重新加载数据
                    NumberPage(intPageCurrent);
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
 * 置顶-店铺轮播信息
 * @param {any} pCarouselID
 */
function goTopShopCarousel(pCarouselID) {

    //构造POST参数
    var dataPOST = {
        "Type": "5", "CarouselID": pCarouselID,
    };
    console.log(dataPOST);

    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: mAjaxUrl + "?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("置顶店铺轮播信息=" + reTxt);
            if (reTxt != "") {
                var _jsonReTxt = JSON.parse(reTxt);

                if (_jsonReTxt.ErrMsg != undefined && _jsonReTxt.ErrMsg != null && _jsonReTxt.ErrMsg != "") {
                    toastWin(_jsonReTxt.ErrMsg);
                    return;
                }
                if (_jsonReTxt.Msg != undefined && _jsonReTxt.Msg != null && _jsonReTxt.Msg != "") {
                    toastWin(_jsonReTxt.Msg);
                    //重新加载数据
                    NumberPage(intPageCurrent);
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
 * 初始化店铺轮播图片信息
 * */
function initShopCarouseDetail() {
    //构造POST参数
    var dataPOST = {
        "Type": "6", "CarouselID": mCarouselID,
    };
    console.log(dataPOST);

    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: mAjaxUrl + "?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("初始化店铺轮播图片信息=" + reTxt);
            if (reTxt != "") {
                var _jsonReTxt = JSON.parse(reTxt);

                //初始化表单
                $("#CarouselTitleWin").val(_jsonReTxt.CarouselTitle);
                $("#AdvLinkTypeWin").val(_jsonReTxt.AdvLinkType);
                $("#AdvLinkAWin").val(_jsonReTxt.AdvLinkA);
                $("#CMemo").val(_jsonReTxt.CMemo);

                //---显示图片区----//
                mImgPathDomain = _jsonReTxt.ImgURL;
                mImgKeyGuid = _jsonReTxt.UploadGuid;
                //获取图片域名 localhost:1400/Upload/ShopHeaderImg/SHI_1_201906160949557860.jpg
                var _domain = mImgPathDomain.substring(0, mImgPathDomain.indexOf("/"));
                //获取图片相对路径 
                var _imgPath = mImgPathDomain.replace(_domain + "/", "");

                $("#PreImgDiv").show();
                $("#CarouselPreImg").show();
                var myJsVal = "";
                myJsVal += " <a href=\"//" + mImgPathDomain + "\" target=\"_blank\"><img id=\"PreImgCarouse\" style=\"width: 380px; height: 150px;\" src=\"//" + mImgPathDomain + "\" /></a>";
                $("#PreImgDiv").html(myJsVal);

                $("#CarouselCropBtn").hide();
                //$("#CarouselCropBtn").click(function () {
                //    window.open("//" + _domain + "/ToolWeb/CropZoom/CropZoom.aspx?CropImgWidth=514&CropImgHeight=200&CropTitle=轮播图片裁剪&ImgSourceURL=" + _imgPath + "&RedirectURL=#");
                //});


                $("#CarouselRefreshBtn").click(function () {
                    refreshImgSrcRnd("PreImgCarouse");
                });


                mIsCorrectAdvLinkA = true; //连接值正确

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
 * 批量-删除店铺轮播信息
 * */
function delShopCarouselArr() {

    var _selIDArr = getSelectValArr();
    if (_selIDArr == "" || getSelectValArr == null) {
        toastWin("请选择操作的记录！");
        return;
    }

    //构造POST参数
    var dataPOST = {
        "Type": "7", "CarouselIDArr": _selIDArr,
    };
    console.log(dataPOST);

    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: mAjaxUrl + "?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("批量-删除店铺轮播信息=" + reTxt);
            if (reTxt != "") {
                var _jsonReTxt = JSON.parse(reTxt);

                if (_jsonReTxt.ErrMsg != undefined && _jsonReTxt.ErrMsg != null && _jsonReTxt.ErrMsg != "") {
                    toastWin(_jsonReTxt.ErrMsg);
                    return;
                }
                if (_jsonReTxt.Msg != undefined && _jsonReTxt.Msg != null && _jsonReTxt.Msg != "") {
                    toastWin(_jsonReTxt.Msg);
                    //重新加载数据
                    NumberPage(intPageCurrent);
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



//=================文件上传====================//

var mImgKeyGuid = "";
var mImgPathDomain = "";

/**
 * 初始化上传插件
 */
function initUploadImg() {


    //构造POST参数
    var _dataPost = "Type=1&UserID=" + mUserID;

    $('#fileupload_1').fileupload({
        url: "../FileUpload/ShopCarouselImg?" + _dataPost + "&rnd=" + Math.random(),
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
            var _domain1 = mImgPathDomain.substring(0, mImgPathDomain.indexOf("/"));
            console.log("_domain1=" + _domain1);
            //获取图片相对路径 
            var _imgPath1 = mImgPathDomain.replace(_domain1 + "/", "");
            console.log("_imgPath1=" + _imgPath1);


            //为Img赋值
            //$("#ShopHeaderImg").attr("src", "//" + mImgPathDomain);
            //构造显示代码
            //var myJsVal = "";
            //myJsVal += "<div id=\"DivImg_" + mImgKeyGuid + "\">";
            //myJsVal += " <img class=\"img-del\" onclick=\"delShopLogoImg('" + mImgKeyGuid + "')\" src=\"../Assets/Imgs/Icon/icon-del.png\" />";
            //myJsVal += " <a href=\"javascript:void(0)\"><img id=\"Img_" + mImgKeyGuid + "\" src=\"//" + mImgPathDomain + "\" /></a>";
            //myJsVal += " <div class=\"crop-img-btn\">";
            //myJsVal += "     <div><a href=\"//" + _domain + "/ToolWeb/CropZoom/CropZoom.aspx?CropImgWidth=800&CropImgHeight=500&CropTitle=店铺门头照裁剪&ImgSourceURL=" + _imgPath + "&RedirectURL=#\" target=\"_blank\">裁剪照片</a></div>";
            //myJsVal += "     <div style=\"border-left: 1px solid #5A5A5A;\" onclick=\"refreshImgSrcRnd('Img_" + mImgKeyGuid + "')\">刷新照片</div>";
            //myJsVal += " </div>";
            //myJsVal += "</div>";
            ////显示代码追加到前台
            //$("#ImgPreLi").append(myJsVal);

            $("#PreImgDiv").show();
            $("#CarouselPreImg").show();
            var myJsVal = "";
            myJsVal += " <a href=\"//" + mImgPathDomain + "\" target=\"_blank\"><img id=\"PreImgCarouse\" style=\"width: 380px; height: 150px;\" src=\"//" + mImgPathDomain + "\" /></a>";
            $("#PreImgDiv").html(myJsVal);

            $("#CarouselCropBtn").show();
            $("#CarouselCropBtn").click(function () {
                window.open("//" + _domain1 + "/ToolWeb/CropZoom/CropZoom.aspx?CropImgWidth=514&CropImgHeight=200&CropTitle=轮播图片裁剪&ImgSourceURL=" + _imgPath1 + "&RedirectURL=#");
            });



            $("#CarouselRefreshBtn").click(function () {
                refreshImgSrcRnd("PreImgCarouse");
            });

            //提交门头照片信息
            //submitShopLogoImg(mUserID, mImgPathDomain, mImgKeyGuid);
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
            loadingWinToDiv("dragWinDiv");

        });
}


//===================弹出窗口操作逻辑============================//

/**
 * 初始化添加窗口显示代码
 */
function initAddEditWinHtml() {
    //获取窗口显示代码
    mAddEditWinHtml = $("#AddEditWin").html();
    $("#AddEditWin").empty();
}

/**
 * 打开添加窗口
 */
function openAddWin() {


    mCarouselID = "";

    //打开Dialog弹出窗口
    openDialogWinNoClose("添加-轮播信息", mAddEditWinHtml, function () {

        //提交店铺轮播图
        submitShopHomeCarouse();

    }, function () {


    }, 620);

    //初始化上传插件
    initUploadImg();
}

/**
 * 打开编辑轮播信息窗口
 * @param {any} pCarouselID 轮播信息ID
 */
function openEditWin(pCarouselID) {

    mCarouselID = pCarouselID;

    //打开Dialog弹出窗口
    openDialogWinNoClose("编辑-轮播信息", mAddEditWinHtml, function () {

        //提交店铺轮播图
        submitShopHomeCarouse();

    }, function () {


    }, 620);

    //初始化上传插件
    initUploadImg();

    //初始化店铺轮播图片信息
    initShopCarouseDetail();

}

/**
 * 提交店铺轮播图信息
 * */
function submitShopHomeCarouse() {

    //获取表单值
    var CarouselTypeWin = $("#CarouselTypeWin").val().trim();
    var CarouselTitleWin = $("#CarouselTitleWin").val().trim();
    var AdvLinkTypeWin = $("#AdvLinkTypeWin").val().trim();
    var AdvLinkAWin = $("#AdvLinkAWin").val().trim();
    var CMemo = $("#CMemo").val().trim();

    //判断输入是否合法
    if (CarouselTitleWin == "" || AdvLinkAWin == "") {
        toastWinToDiv("【标题】和【链接值】不能为空！", "dragWinDiv");
        return;
    }

    //判断链接值是否正确
    if (mIsCorrectAdvLinkA == false) {
        toastWinToDiv("【链接值】错误,请检查！", "dragWinDiv");
        return;
    }

    //判断是否上传了图片
    if (mImgKeyGuid == undefined) {
        toastWinToDiv("请上传轮播图片！", "dragWinDiv");
        return;
    }
    if (mImgKeyGuid == "" || mImgPathDomain == "") {
        toastWinToDiv("请上传轮播图片！", "dragWinDiv");
        return;
    }


    //构造POST参数
    var dataPOST = {
        "Type": "2", "UploadGuid": mImgKeyGuid, "ImgURL": mImgPathDomain, "CarouselID": mCarouselID, "CarouselTitle": CarouselTitleWin, "AdvLinkType": AdvLinkTypeWin, "AdvLinkA": AdvLinkAWin, "CMemo": CMemo, "CarouselType": CarouselTypeWin,
    };
    console.log(dataPOST);

    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: mAjaxUrl + "?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("提交店铺轮播图信息=" + reTxt);
            if (reTxt != "") {
                var _jsonReTxt = JSON.parse(reTxt);

                if (_jsonReTxt.ErrMsg != undefined && _jsonReTxt.ErrMsg != null && _jsonReTxt.ErrMsg != "") {
                    toastWinToDiv(jsonReTxt.ErrMsg, "dragWinDiv");
                    return;
                }

                if (_jsonReTxt.Msg != undefined && _jsonReTxt.Msg != null && _jsonReTxt.Msg != "") {
                    toastWinToDivCb(_jsonReTxt.Msg, function () {

                        mImgKeyGuid = "";
                        mImgPathDomain = "";
                        //关闭窗口
                        closeDialogWin();

                        //重新加载数据
                        NumberPage(intPageCurrent);


                    }, "dragWinDiv");
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


//=========================公共函数=================//
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
 * 删除上传图片没有保存的
 * */
function delUploadImg() {

    if (mImgKeyGuid == "" || mImgKeyGuid == null) {
        return;
    }


    //构造POST参数
    var dataPOST = {
        "Type": "2", "ImgKeyGuid": mImgKeyGuid,
    };
    console.log(dataPOST);

    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: "../FileUpload/ShopCarouselImg?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("删除上传图片没有保存的=" + reTxt);
            if (reTxt != "") {
                //var _jsonReTxt = JSON.parse(reTxt);

                $("#CarouselPreImg").hide();
                mImgPathDomain = "";
                mImgKeyGuid = "";

            }
        },
        error: function (xhr, errorTxt, status) {
            console.log("异步请求错误，errorTxt=" + errorTxt + " | status=" + status);
            return;
        }
    });
}

/**
 * 全选与全不选
 */
function toggleSelAll() {

    //获取所有的Select控件
    var _selectItemArr = document.getElementsByName("SelCbItem");

    //全选与全不先的Select控件
    var isAllCheck = document.getElementById("SelAllCb").checked;
    console.log(isAllCheck);
    if (isAllCheck) //全选
    {
        for (var i = 0; i < _selectItemArr.length; i++) {
            _selectItemArr[i].checked = true;
        }
    }
    else {
        for (var i = 0; i < _selectItemArr.length; i++) {
            _selectItemArr[i].checked = false;
        }
    }
}

/**
 * 获取全选与全不选控件信息ID值数组
* return  23434^234324^254354
 */
function getSelectValArr() {

    //获取所有的Select控件
    var _selectItemArr = document.getElementsByName("SelCbItem");

    //定义数组
    var _msgIdArr = new Array();
    //定义数组索引
    var _arrIndex = 0;

    //循环获取MsgID
    for (var i = 0; i < _selectItemArr.length; i++) {
        var _msgID = _selectItemArr[i].id.replace("SelCbItem_", "");
        //console.log(_msgID);
        if (_selectItemArr[i].checked) {
            _msgIdArr[_arrIndex] = _msgID;
            _arrIndex++
        }
    }
    // console.log("_msgIdArr=" + _msgIdArr);

    return _msgIdArr.join("^");
}

/**
 * 浏览效果
 * */
function goPreShopIndex() {

    $("button[name='PreShopBtn']").on("click", function () {

        window.open(mOctWapWeb_AddrDomain + "/Shop/IndexPreMobileIframe?SID=" + mShopID);

    });

}