//==============相册管理=====================//

/**-----定义公共变量------**/

//AjaxURL
var mAjaxUrl = "../Goods/Album";

//添加窗口的Html显示代码
var mAddEditWinHtml = "";

/******数据分页的变量********/
var strPOSTSe = ""; //搜索条件对象 POST参数
var intPageCurrent = 1; //当前页
var pageSize = 15; //当页的记录条数，与后台保持一致
var recordSum = 0; //总记录数
var tableColNum = 9; //当前表列数
var mPageType = 1; //数据分页请求类别 Type值

//信息ID
var mMsgID = "0";



/**------初始化------**/
$(function () {

    //初始化添加窗口显示代码
    initAddEditWinHtml();

    //初始化加载
    searchContent();
});



/*
---------定义搜索函数---------
*/
var searchContent = function () {

    intPageCurrent = 1; //开始页


    //构造POST参数
    var strPOST = {
        "pageCurrent": "1", "Type": mPageType,
    };

    //翻页所用
    var strPOSTSePush = {
        "ShopUserID": "",
    };
    //将对象添加到分类对象中

    //搜索内容用
    var strPOSTSeContent = pushTwoObject(strPOST, strPOSTSePush);

    //分页操作用
    var strPOSTSearch = { "Type": mPageType };
    strPOSTSe = pushTwoObject(strPOSTSearch, strPOSTSePush);
    console.log(strPOSTSe);

    //加载提示
    $("#ImgList").html("<li>… 数据加载中 …</li>");

    console.log("mAjaxUrl=" + mAjaxUrl);

    //以POST方式发送异步请求
    $.ajax({
        type: "POST",
        url: mAjaxUrl + "?rnd=" + Math.random(),
        data: strPOSTSeContent,
        dataType: "html",
        success: function (reTxtJson, status, xhr) {
            //显示返回值
            console.log(reTxtJson);
            if (reTxtJson != "") {

                //分页成功返回，构造显示代码
                pageSuccess(reTxtJson);
            }
            else {
                //加载提示
                $("#ImgList").html("<li>没有搜索到相关数据 </li>");
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
    var myJsVal = "";    //循环构造    for (var i = 0; i < json.DataPage.length; i++) {

        var indexDataPage = json.DataPage[i];
        var indexDataPageExtra = json.DataPageExtra[i];

        //获取图片URL中的 域名和图片相对路径  
        var _domainAndImgPathArr = getImgURLDomainAndImgPathArr(indexDataPageExtra.AlbumCoverUrl).split("^");

        myJsVal += "<li class=\"img-item\">";        myJsVal += "   <div class=\"album-cover-div\">";        myJsVal += "       <a href=\"../GoodsPage/AlbumImg?AID=" + indexDataPage.AlbumID +"\"><img src=\"//" + _domainAndImgPathArr[0] + "/ToolWeb/ShowImgScale.aspx?FilePathFrom=" + _domainAndImgPathArr[1] + "&LimitWidthNum=200&LimitHeightNum=180\" /></a>";        myJsVal += "   </div>";        myJsVal += "   <div class=\"btn-img\">";        //myJsVal += "       <input type=\"checkbox\" />";        myJsVal += "       <div class=\"album-name-div\">";        myJsVal += "           <b id=\"AlbumTitle_" + indexDataPage.AlbumID +"\">" + indexDataPage.AlbumTitle + "</b>";        myJsVal += "           <input id=\"AlbumTitleEdit_" + indexDataPage.AlbumID +"\" style=\"display:none;\" class=\"album-name-txt\" type=\"text\" value=\"" + indexDataPage.AlbumTitle + "\" />";        myJsVal += "       </div>";        myJsVal += "       <span>" + indexDataPageExtra.AlbumImgCount +"张</span>";        myJsVal += "   </div>";        myJsVal += "   <div class=\"item-btn\">";        myJsVal += "       <input type=\"button\" class=\"am-btn am-block am-radius am-btn-xs am-btn-primary\" id=\"BtnEdit_" + indexDataPage.AlbumID + "\" value=\"编辑\" onclick=\"editAlbumTitle(" + indexDataPage.AlbumID +")\" />";        myJsVal += "       <input type=\"button\" class=\"am-btn am-block am-radius am-btn-xs am-btn-primary\" value=\"删除\" onclick=\"delAlbum(" + indexDataPage.AlbumID +")\" />";        myJsVal += "   </div>";        myJsVal += "</li>";
    }    //alert(myJsVal);    //-----分页控制条显示代码-------//    var pageBarXhtml = "";    pageBarXhtml += " <li><a href=\"javascript:void(0)\" onclick=\"PrePage()\">«</a></li>";    pageBarXhtml += " <li><a href=\"javascript:void(0)\" onclick=\"NumberPage('1')\">1</a></li>";    pageBarXhtml += "  <li><span>...</span></li>";    if ((intPageCurrent - 2) > 0) {
        pageBarXhtml += "  <li><a href=\"javascript:void(0)\" onclick=\"NumberPage('" + (intPageCurrent - 2) + "')\">" + (intPageCurrent - 2) + "</a></li>";
    }    if ((intPageCurrent - 1) > 0) {
        pageBarXhtml += "  <li><a href=\"javascript:void(0)\" onclick=\"NumberPage('" + (intPageCurrent - 1) + "')\">" + (intPageCurrent - 1) + "</a></li>";
    }    pageBarXhtml += "  <li class=\"am-active\"><a href=\"javascript:void(0)\" onclick=\"NumberPage('" + json.PageCurrent + "')\">" + json.PageCurrent + "</a></li>";    //console.log(parseInt(json.PageSum));    if ((intPageCurrent + 1) <= parseInt(json.PageSum)) {
        pageBarXhtml += "  <li><a href=\"javascript:void(0)\" onclick=\"NumberPage('" + (intPageCurrent + 1) + "')\">" + (intPageCurrent + 1) + "</a></li>";
    }    if ((intPageCurrent + 2) <= parseInt(json.PageSum)) {
        pageBarXhtml += "  <li><a href=\"javascript:void(0)\" onclick=\"NumberPage('" + (intPageCurrent + 2) + "')\">" + (intPageCurrent + 2) + "</a></li>";
    }    pageBarXhtml += "  <li><span>...</span></li>";    pageBarXhtml += "  <li><a href=\"javascript:void(0)\" onclick=\"NumberPage('" + json.PageSum + "')\">" + json.PageSum + "</a></li>";    pageBarXhtml += "  <li><input type=\"number\" id=\"PageNumTxt\" class=\"page-go-text am-form-field\" placeholder=\"跳转页\" /></li>";    pageBarXhtml += "  <li><a href=\"javascript:void(0)\" onclick=\"NextPage()\">»</a></li>";    var _pageMsgArr = new Array()    //内容显示代码     _pageMsgArr[0] = myJsVal;    //控制条件显示代码    _pageMsgArr[1] = pageBarXhtml;    //返回数组    return _pageMsgArr;
}


//------------------搜索结果分页-----------------//
//具体页
function NumberPage(pagecurrent) {
    intPageCurrent = parseInt(pagecurrent);

    //以GET方式发送分页请求的函数
    sendPageHttpGet(intPageCurrent);
}

//上一页
function PrePage() {
    intPageCurrent = intPageCurrent - 1;

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

    //计算总页数
    var intPageSum = recordSum % pageSize != 0 ? recordSum / pageSize + 1 : recordSum / pageSize;
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
    $("#ImgList").html("<li>… 数据加载中 …</li>");

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


//------分页信息成功返回------//
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
        $("#ImgList").html(_xhtmlArr[0]);
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
        //document.getElementById("SelAllCb").checked = false;

    }
    else {
        $("#ImgList").html("<li>没有搜索到相关数据 </li>");
    }
}


//---------跳转页---------//
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


/**
 * 编辑相册标题
 * @param {any} pAlbumID 相册ID
 */
function editAlbumTitle(pAlbumID) {

    
    //获取表单对象
    var AlbumTitle = $("#AlbumTitle_" + pAlbumID);
    var AlbumTitleEdit = $("#AlbumTitleEdit_" + pAlbumID);
    var BtnEdit = $("#BtnEdit_" + pAlbumID);

    var _valBtn = BtnEdit.val();
    console.log("_valBtn=" + _valBtn);
    if (_valBtn == "保存") {

        //保存相册标题
        saveAlbumTitle(pAlbumID, AlbumTitleEdit.val().trim());
        BtnEdit.val("编辑");

        return;
    }

    //隐藏对象
    AlbumTitle.hide();
    AlbumTitleEdit.show();
    BtnEdit.val("保存");
    AlbumTitleEdit.focus();


}

/**
 * 保存相册标题
 * @param {any} pAlbumID 相册ID
 * @param {any} pAlbumTitle 相册标题
 */
function saveAlbumTitle(pAlbumID, pAlbumTitle) {

    if (pAlbumTitle.length > 10) {
        toastWin("【相册标题】控制在10个字符之内!");
        return;
    }

    //构造POST参数
    var dataPOST = {
        "Type": "3", "AlbumTitle": pAlbumTitle, "AlbumID": pAlbumID,
    };
    console.log(dataPOST);
    //提示加载
    //loadingWinToDiv("dragWinDiv");
    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: mAjaxUrl + "?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log(reTxt);
            //移除加载
            //closeLoadingWin();
            if (reTxt != "") {
                var _jsonReTxt = JSON.parse(reTxt);

                if (_jsonReTxt.Code != null) {
                    toastWin(_jsonReTxt.Msg);

                    //关闭窗口
                    closeDialogWin();

                    //重新加载数据
                    NumberPage(intPageCurrent);

                    return;
                }

                if (ErrCode != null) {
                    toastWin(_jsonReTxt.ErrMsg);
                }

            }
        }
    });

}

/**
 * 删除相册
 * @param {any} pAlbumID 相册ID
 */
function delAlbum(pAlbumID) {

    confirmWinWidth("确定要删除此相册吗？", function () {

        //构造POST参数
        var dataPOST = {
            "Type": "5", "AlbumID": pAlbumID,
        };
        console.log(dataPOST);
        //提示加载
        //loadingWinToDiv("dragWinDiv");
        //正式发送异步请求
        $.ajax({
            type: "POST",
            url: mAjaxUrl + "?rnd=" + Math.random(),
            data: dataPOST,
            dataType: "html",
            success: function (reTxt, status, xhr) {
                console.log(reTxt);
                //移除加载
                //closeLoadingWin();
                if (reTxt != "") {
                    var _jsonReTxt = JSON.parse(reTxt);

                    if (_jsonReTxt.Code != null) {
                        toastWin(_jsonReTxt.Msg);

                        //重新加载数据
                        NumberPage(intPageCurrent);

                        return;
                    }
                    if (ErrCode != null) {
                        toastWin(_jsonReTxt.ErrMsg);
                    }

                }
            }
        });


    },400);

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

    mMsgID = "0";

    //打开Dialog弹出窗口
    openDialogWinNoClose("新建相册", mAddEditWinHtml, function () {

        //新建相册
        addAlbum();

    }, function () {


    }, 500);
}

/**
 * 新建相册
 * */
function addAlbum() {

    //获取表单
    var AlbumTitle = $("#AlbumTitle_ae").val().trim();
    var AlbumDesc = $("#AlbumDesc_ae").val().trim();
    if (AlbumTitle == "") {
        toastWinToDiv("【相册标题】不能为空！", "dragWinDiv");
        return;
    }

    //构造POST参数
    var dataPOST = {
        "Type": "2", "AlbumTitle": AlbumTitle, "AlbumDesc": AlbumDesc,
    };
    console.log(dataPOST);
    //提示加载
    loadingWinToDiv("dragWinDiv");
    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: mAjaxUrl + "?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log(reTxt);
            //移除加载
            closeLoadingWin();
            if (reTxt != "") {
                var _jsonReTxt = JSON.parse(reTxt);

                if (_jsonReTxt.Code != null) {
                    toastWin(_jsonReTxt.Msg);

                    //关闭窗口
                    closeDialogWin();

                    //重新加载数据
                    NumberPage(intPageCurrent);

                    return;
                }

                if (ErrCode != null) {
                    toastWin(_jsonReTxt.ErrMsg);
                }

            }
        }
    });
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