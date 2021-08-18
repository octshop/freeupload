/*=============赠品编辑======================*/

/**-----定义公共变量------**/

//AjaxURL
var mAjaxUrl = "../Goods/GooGiftMsg";
//编辑器对象
var mEditor;

var mEditorContent = "";

//信息ID
var mMsgID = 0;
//商家UserID
var mUserID = 0;

//插入图片窗口Html
var mInsertImgWinHtml = "";

/**------初始化------**/
$(function () {

    //判断是通过手机访问还是电脑访问的 定义编辑框的宽度
    if (isVisiteByMobile() == "mobile") {
        $("#EditorContent").css("width", "720");
        $(".goods-desc-btn").css("width", "720");
        $(".goods-btn").css("width", "720");
    }

    //初始化编辑器
    initEditor();

    //初始化所有赠品图片上传插件
    initAllGiftImgUploadFile();

    //初始化插入图片窗口显示代码
    initInsertImgWinHtml();

    //初始化赠品信息
    initGiftMsg();
});



/**
 * -----初始化编辑器------
 * */
function initEditor() {

    // 关闭过滤模式，保留所有标签 ,这样设置后那么 style=\"color:red\" 才有效
    KindEditor.options.filterMode = false;

    //将初始化KindEditor
    KindEditor.ready(function (K) {
        mEditor = window.editor = K.create('#EditorContent', {
            newlineTag: "br", //参数设置
            allowUpload: false,
            allowImageUpload: false, //不允许上传图片
            designMode: true,
            items: [
                'source', '|', 'undo', 'redo', '|', 'fontname', 'fontsize', '|', 'forecolor', 'hilitecolor', 'bold', 'italic', 'underline',
                'removeformat', '|', 'justifyleft', 'justifycenter', 'justifyright', 'insertorderedlist',
                'insertunorderedlist', '|', 'emoticons', 'image', 'baidumap']
        });

        //判断是通过手机访问还是电脑访问的
        if (isVisiteByMobile() == "mobile") {
            try {
                mEditor.clickToolbar('source');
            }
            catch (e) { }
        }
    });
}

/**
 * 判断是通过手机访问还是电脑访问的
 * @returns 返回值：mobile ， computer
 * */
function isVisiteByMobile() {
    var ua = navigator.userAgent;
    var ipad = ua.match(/(iPad).*OS\s([\d_]+)/),
        isIphone = !ipad && ua.match(/(iPhone\sOS)\s([\d_]+)/),
        isAndroid = ua.match(/(Android)\s+([\d.]+)/),
        isMobile = isIphone || isAndroid;
    if (isMobile) {
        //location.href = 'http://m.domain.com';
        //alert("通过【手机】访问的");
        return "mobile";
    } else {
        //location.href = 'http://www.domain.com';
        //alert("通过【电脑】访问的");
        return "computer";
    }

    //或者单独判断iphone或android 
    if (isIphone) {
        //code 
    }
    else if (isAndroid) {
        //code
    } else {
        //code
    }
}


/**
 * 得到KindEditor的内容
 * */
function getEditorContent() {

    // 同步数据后可以直接取得textarea的value,必须同步否则得不到值
    editor.sync();
    //得到编辑器内容
    var _editorContent = $("#EditorContent").val().trim();
    return _editorContent;
}


//===================上传赠品图片===============================//

/**
 * 初始化所有赠品图片上传插件
 * */
function initAllGiftImgUploadFile() {

    for (var i = 1; i < 6; i++) {
        //初始化商品图片上传插件
        initGiftImgUploadFile(i);
    }
}

/**
 * 初始化商品图片上传插件
 * @param {any} pUploadIndex 上传文件域索引
 */
function initGiftImgUploadFile(pUploadIndex) {

    //console.log("执行了initGoodsImgUploadFile()");

    //构造上传控件的ID字符串
    var _uploadIDstr = "UploadGift_" + pUploadIndex;


    //构造POST参数
    var _dataPost = "Type=1&UserID=" + mUserID;
    console.log(_dataPost);

    $('#' + _uploadIDstr).fileupload({
        url: "../FileUpload/GooGiftImg?" + _dataPost + "&rnd=" + Math.random(),
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
            $("#HidUploadGiftVal_" + pUploadIndex).val(mImgKeyGuid + "|" + mImgPathDomain);

            //给图片控件赋值
            $("#GiftImgPre_" + pUploadIndex).attr("src", "//" + mImgPathDomain);

            //显示操作按钮组
            $("#BtnGiftList_" + pUploadIndex).show();

            //----构造按钮显示代码
            //获取图片URL中的 域名和图片相对路径  
            var _domainAndImgPathArr = getImgURLDomainAndImgPathArr(mImgPathDomain).split("^");
            var _btnGoodsListXhtml = "<a href=\"//" + _domainAndImgPathArr[0] + "/ToolWeb/CropZoom/CropZoom.aspx?CropImgWidth=700&CropImgHeight=700&CropTitle=赠品&ImgSourceURL=" + _domainAndImgPathArr[1] + "&RedirectURL=#\" target=\"_blank\">裁剪</a>";            _btnGoodsListXhtml += "<div onclick=\"delGooGiftImg('" + mImgKeyGuid + "','" + _domainAndImgPathArr[0] + "'," + pUploadIndex + ")\">删除</div><div onclick=\"refreshImgSrcRnd('GiftImgPre_" + pUploadIndex + "')\">刷新</div>";            //显示代码插入前台             $("#BtnGiftList_" + pUploadIndex).html(_btnGoodsListXhtml);        },

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
 * 获取图片URL中的 域名和图片相对路径  
 * @param pImgUrl 图片URL地址 [localhost:1400/Upload/ShopHeaderImg/SHI_1_201906160949557860.jpg]
 * */
function getImgURLDomainAndImgPathArr(pImgUrl) {

    //获取图片域名 localhost:1400/Upload/ShopHeaderImg/SHI_1_201906160949557860.jpg
    var _domain = pImgUrl.substring(0, pImgUrl.indexOf("/"));
    console.log("_domain=" + _domain);
    //获取图片相对路径 
    var _imgPath = pImgUrl.replace(_domain + "/", "");
    console.log("_imgPath=" + _imgPath);

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
 * 删除已上传没保存的赠品图片
 * @param pImgKeyGuid 上传图片Key的GUID
 * @param pDomainUpload 上传服务器域名 [localhost:1400]
 * @param pUploadIndex 上传控件索引
 * */
function delGooGiftImg(pImgKeyGuid, pDomainUpload, pUploadIndex) {

    confirmWinWidth("确定要删除赠品照片吗？", function () {

        //构造POST参数
        var dataPOST = {
            "Type": "2", "ImgKeyGuid": pImgKeyGuid, "DomainUpload": pDomainUpload,
        };
        console.log(dataPOST);

        //正式发送异步请求
        $.ajax({
            type: "POST",
            url: "../FileUpload/GooGiftImg?rnd=" + Math.random(),
            data: dataPOST,
            dataType: "html",
            success: function (reTxt, status, xhr) {
                console.log(reTxt);
                if (reTxt != "") {
                    var _jsonBack = JSON.parse(reTxt);
                    if (_jsonBack.Msg != null) {
                        toastWin(_jsonBack.Msg);

                        //给隐藏控件赋值
                        $("#HidUploadGiftVal_" + pUploadIndex).val("");

                        //给图片控件赋值
                        $("#GiftImgPre_" + pUploadIndex).attr("src", "../Assets/Imgs/Icon/icon_camera_gift.png");

                        //显示操作按钮组
                        $("#BtnGiftList_" + pUploadIndex).hide();

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
 * 删除因重复上传导致的多余赠品图片
 * */
function delGooGiftImgRepeat() {

    console.log("执行了delGooGiftImgRepeat()");

    //构造POST参数
    var dataPOST = {
        "Type": "4"
    };
    console.log(dataPOST);

    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: "../FileUpload/GooGiftImg?rnd=" + Math.random(),
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


//--------------插入图片窗口-----------//

/**
 * 初始化插入图片窗口显示代码
 */
function initInsertImgWinHtml() {
    //获取窗口显示代码
    mInsertImgWinHtml = $("#InsertImgWin").html();
    $("#InsertImgWin").empty();
}

/**
 * 打开编辑窗口
 */
function openInsertImgWin() {

    //mMsgID = pMsgID;

    //打开Dialog弹出窗口
    openDialogWinNoClose("插入图片", mInsertImgWinHtml, function () {

        //确定按钮
        //alert("mInsertImgArr=" + mInsertImgArr);
        //插入选中的图片到编辑中
        insertImgToEditor();

        //关闭窗口
        closeDialogWin();

    }, function () {

        //清空已选中的图片
        mInsertImgArr = "";

    }, 700);

    //初始化商家的相册信息 [相册名称下拉列表]
    initShopAlbum();
}

//--------------插入图片函数--------------//

//存储要插入图片的URL 如：“//localhost:1400/Upload/ShopHeaderImg/SHI_1_201906221720413810.jpg^//localhost:1400/Upload/ShopHeaderImg/SHI_1_201906221720413810.jpg^//localhost:1400/Upload/ShopHeaderImg/SHI_1_201906221720413810.jpg”
var mInsertImgArr = "";

/**
 * 选中和取消插入的图片,CheckBox变化时事件
 * */
function chgSelInsertImgCb() {

    var _dataImgUrl = $(event.currentTarget).attr("data-imgurl");
    var _checked = $(event.currentTarget).prop("checked");
    console.log("_dataImgUrl=" + _dataImgUrl);
    console.log("_checked=" + _checked);

    //alert("开始mInsertImgArr=" + mInsertImgArr);

    //选中图片
    if (_checked) {
        if (mInsertImgArr == "") {
            mInsertImgArr = _dataImgUrl;
        }
        else {
            mInsertImgArr += "^" + _dataImgUrl;
        }

        //alert("选中图片!");
    }
    else {
        //判断被取消选择的是在前，中，后哪个位置
        if (mInsertImgArr.indexOf("^" + _dataImgUrl + "^") >= 0) //在中间
        {
            mInsertImgArr = mInsertImgArr.replace("^" + _dataImgUrl + "^", "^");
            //alert("在中间");
        }
        else if (mInsertImgArr.indexOf(_dataImgUrl + "^") == 0) //在最前
        {
            mInsertImgArr = mInsertImgArr.replace(_dataImgUrl + "^", "");
            //alert("在最前");
        }
        else if (mInsertImgArr.indexOf("^" + _dataImgUrl) >= 0) //在最后
        {
            mInsertImgArr = mInsertImgArr.replace("^" + _dataImgUrl, "");
            //alert("在最后");
        }
        else //只选择一张图片
        {
            mInsertImgArr = "";
            //alert("只选择一张图片!");
        }

        //alert("取消选中图片!");
    }
    console.log("mInsertImgArr=" + mInsertImgArr);
    //alert("mInsertImgArr=" + mInsertImgArr);
}

/**
 * 插入选中的图片到编辑中
 * */
function insertImgToEditor() {

    //构造需要插入的图标显示代码
    var _xhtml = "";
    if (mInsertImgArr.indexOf("^") >= 0) {
        //分割字符
        var _insertImgArr = mInsertImgArr.split('^');
        for (var i = 0; i < _insertImgArr.length; i++) {
            _xhtml += "<div style=\"clear:both;width:100%;padding:0;margin:0;\"><img src=\"" + _insertImgArr[i] + "\" /></div>";
        }
    }
    else {
        _xhtml += "<div style=\"clear:both;width:100%;padding:0;margin:0;\"><img src=\"" + mInsertImgArr + "\" /></div>";
    }
    //显示代码插入编辑器
    mEditor.insertHtml(_xhtml);
    //清空已选中的图片
    mInsertImgArr = "";
}

/**
 * 初始化商家的相册信息 [相册名称下拉列表]
 * */
function initShopAlbum() {

    //构造POST参数
    var dataPOST = {
        "Type": "2"
    };
    console.log(dataPOST);

    //显示加载提示
    loadingWinToDiv("dragWinDiv");

    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: "../FileUpload/ShopAlbum?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log(reTxt);

            //关闭加载提示
            closeLoadingWin();


            if (reTxt != "") {
                var _jsonBack = JSON.parse(reTxt);
                var _jsonShopAlbumArr = _jsonBack.ShopAlbum;
                //清除下拉列表值
                $("#ShopAlbumSelect1").empty();
                //循环赋值
                for (var i = 0; i < _jsonShopAlbumArr.length; i++) {

                    $("#ShopAlbumSelect1").append("<option value='" + _jsonShopAlbumArr[i].AlbumID + "'>" + _jsonShopAlbumArr[i].AlbumTitle + "</option>"); //为Select追加一个Option(下拉项)
                }

                //初始化上传相册图片的插件
                initUploadAlbumImg();

                //搜索相册图片
                searchContent();

            }
            else {
                //清除下拉列表值
                $("#ShopAlbumSelect1").empty();
            }

            //搜索赠品图片
            searchContent2();

        },
        error: function (xhr, errorTxt, status) {
            console.log("异步请求错误，errorTxt=" + errorTxt + " | status=" + status);
            return;
        }
    });
}

/**
 * 初始化上传相册图片的插件
 * */
function initUploadAlbumImg() {

    //构造上传控件的ID字符串
    var _uploadIDstr = "fileupload_Album";

    //构造POST参数
    var _dataPost = "Type=1&AlbumID=" + $("#ShopAlbumSelect1").val().trim();
    console.log(_dataPost);

    $('#' + _uploadIDstr).fileupload({
        url: "../FileUpload/ShopAlbum?" + _dataPost + "&rnd=" + Math.random(),
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
            //搜索相册图片
            searchContent();
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



//=================相册图片数据分页====================//

/******数据分页的变量********/
var strPOSTSe = ""; //搜索条件对象 POST参数
var intPageCurrent = 1; //当前页
var pageSize = 0; //当页的记录条数，与后台保持一致
var recordSum = 0; //总记录数

/**
 * 搜索相册图片
 * */
function searchContent() {

    intPageCurrent = 1; //开始页

    var AlbumID_se = $("#ShopAlbumSelect1").val().trim();

    //构造POST参数
    var strPOST = {
        "pageCurrent": "1", "Type": "3"
    };

    //翻页所用
    var strPOSTSePush = {
        "AlbumID": AlbumID_se,
    };
    //将对象添加到分类对象中

    //搜索内容用
    var strPOSTSeContent = pushTwoObject(strPOST, strPOSTSePush);

    //分页操作用
    var strPOSTSearch = { "Type": "3" };
    strPOSTSe = pushTwoObject(strPOSTSearch, strPOSTSePush);
    console.log(strPOSTSe);

    //加载提示
    $("#PhotoImgUl").html("<li>… 加载中 …</li>");

    //以POST方式发送异步请求
    $.ajax({
        type: "POST",
        url: "../FileUpload/ShopAlbum?rnd=" + Math.random(),
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

                $("#PhotoImgUl").html("<li></li>");
            }
        },
        error: function (xhr, errorTxt, status) {
            console.log("错误信息errorTxt=" + errorTxt + " | status=" + status);
            //alert("网络出现异常,请重试！");
        }

    });
};

//----------------- 搜索结果分页 -------------------//
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
    $("#PhotoImgUl").html("<li>… 加载中 …</li>");

    $.ajax({
        type: "GET",
        url: "../FileUpload/ShopAlbum?rnd=" + Math.random(),
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
        $("#PhotoImgUl").html(_xhtmlArr[0]);
        //分页控制条
        $("#PageBar1").html(_xhtmlArr[1]);


        //全不选
        //document.getElementById("SelAllCb").checked = false;

    }
    else {
        $("#PhotoImgUl").html("<li></li>");
    }
}

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

        myJsVal += "<li>";        myJsVal += " <img src=\"//" + indexDataPage.ServerDomain + "/ToolWeb/ShowImgScale.aspx?FilePathFrom=" + indexDataPage.ImgPath + "&LimitWidthNum=80&LimitHeightNum=80\" />";        myJsVal += " <input class=\"sel-img-cb\" type=\"checkbox\" data-imgurl=\"//" + indexDataPage.ServerDomain + "/" + indexDataPage.ImgPath + "\" onchange=\"chgSelInsertImgCb()\" />";        myJsVal += "</li>";    }    //alert(myJsVal);    //-----分页控制条显示代码-------//    var pageBarXhtml = "";    pageBarXhtml += "<div onclick=\"NumberPage('1')\">首页<\/div>";    pageBarXhtml += "<div onclick=\"PrePage()\">上一页<\/div>";    pageBarXhtml += "<div onclick=\"NextPage()\">下一页<\/div>";    pageBarXhtml += "<div onclick=\"NumberPage('" + json.PageSum + "')\">尾页<\/div>";    var _pageMsgArr = new Array()    //内容显示代码     _pageMsgArr[0] = myJsVal;    //控制条件显示代码    _pageMsgArr[1] = pageBarXhtml;    //返回数组    return _pageMsgArr;
}


//===================赠品图片数据分页=========================//

/******数据分页的变量********/
var strPOSTSe2 = ""; //搜索条件对象 POST参数
var intPageCurrent2 = 1; //当前页
var pageSize2 = 0; //当页的记录条数，与后台保持一致
var recordSum2 = 0; //总记录数

/**
 * 搜索商品图片
 * */
function searchContent2() {

    intPageCurrent2 = 1; //开始页

    //构造POST参数
    var strPOST = {
        "pageCurrent": "1", "Type": "3"
    };

    //翻页所用
    var strPOSTSePush = {
        "1": 1,
    };
    //将对象添加到分类对象中

    //搜索内容用
    var strPOSTSeContent = pushTwoObject(strPOST, strPOSTSePush);

    //分页操作用
    var strPOSTSearch = { "Type": "3" };
    strPOSTSe2 = pushTwoObject(strPOSTSearch, strPOSTSePush);
    console.log(strPOSTSe2);

    //加载提示
    $("#GoodsImgUl").html("<li>… 加载中 …</li>");

    //以POST方式发送异步请求
    $.ajax({
        type: "POST",
        url: "../FileUpload/GooGiftImg?rnd=" + Math.random(),
        data: strPOSTSeContent,
        dataType: "html",
        success: function (reTxtJson, status, xhr) {
            //显示返回值
            console.log(reTxtJson);
            if (reTxtJson != "") {

                //分页成功返回，构造显示代码
                pageSuccess2(reTxtJson);

            }
            else {

                $("#GoodsImgUl").html("<li></li>");
            }
        },
        error: function (xhr, errorTxt, status) {
            console.log("错误信息errorTxt=" + errorTxt + " | status=" + status);
            //alert("网络出现异常,请重试！");
        }

    });
};



//---------------搜索结果分页--------------//
//具体页
function NumberPage2(pagecurrent) {
    intPageCurrent2 = parseInt(pagecurrent);

    //以GET方式发送分页请求的函数
    sendPageHttpGet2(intPageCurrent2);
}

//上一页
function PrePage2() {
    intPageCurrent2 = intPageCurrent2 - 1;

    if (intPageCurrent2 > 0) {

        //以GET方式发送分页请求的函数
        sendPageHttpGet2(intPageCurrent2);

    }
    else {
        intPageCurrent2 = 1;
    }
}


//下一页
function NextPage2() {

    intPageCurrent2 = parseInt(intPageCurrent2) + 1;

    //计算总页数
    var intPageSum = recordSum2 % pageSize2 != 0 ? recordSum2 / pageSize2 + 1 : recordSum2 / pageSize2;

    if (intPageCurrent2 <= parseInt(intPageSum)) {

        //以GET方式发送分页请求的函数
        sendPageHttpGet2(intPageCurrent2);

    }
    else {
        intPageCurrent2 = parseInt(intPageSum);
    }

}

//----------------以GET方式发送分页请求的函数-----------------//
var sendPageHttpGet2 = function (intPageCurrent) {
    //构造GET参数
    strPOSTSe2 = pushTwoObject(strPOSTSe2, { "pageCurrent": intPageCurrent });

    //加载提示
    $("#GoodsImgUl").html("<li>… 加载中 …</li>");

    $.ajax({
        type: "GET",
        url: "../FileUpload/GooGiftImg?rnd=" + Math.random(),
        data: strPOSTSe2,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            //成功返回后的处理函数
            pageSuccess2(reTxt)
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
function pageSuccess2(reTxtJson) {
    if (reTxtJson != "") {

        var reJsonObject = JSON.parse(reTxtJson);
        console.log(reJsonObject);

        //总的记录数
        recordSum2 = reJsonObject.RecordSum;
        pageSize2 = reJsonObject.PageSize;


        //解析JSON数据 构造 前台显示代码
        var _xhtmlArr = jsonToXhtml2(reJsonObject);
        //console.log("赠品图片HTML" + _xhtmlArr[0]);

        //显示内容
        $("#GoodsImgUl").html(_xhtmlArr[0]);
        //分页控制条
        $("#PageBar2").html(_xhtmlArr[1]);


        //全不选
        //document.getElementById("SelAllCb").checked = false;

    }
    else {
        $("#GoodsImgUl").html("<li></li>");
    }
}

//------------解析JSON数据 构造 前台显示代码--------------//
// pJsonTxt Json字符串
function jsonToXhtml2(pJsonObject) {

    //将字符串转换成功JSON对象
    //var json = JSON.parse(pJsonTxt);
    var json = pJsonObject;

    //-----内容显示前台显示代码----//
    var myJsVal = "";    //循环构造    for (var i = 0; i < json.DataPage.length; i++) {

        var indexDataPage = json.DataPage[i];
        var indexDataPageExtra = json.DataPageExtra[i];

        myJsVal += "<li>";        myJsVal += " <img src=\"//" + indexDataPage.ServerDomain + "/ToolWeb/ShowImgScale.aspx?FilePathFrom=" + indexDataPage.ImgPath + "&LimitWidthNum=80&LimitHeightNum=80\" />";        myJsVal += " <input class=\"sel-img-cb\" type=\"checkbox\" data-imgurl=\"//" + indexDataPage.ServerDomain + "/" + indexDataPage.ImgPath + "\" onchange=\"chgSelInsertImgCb()\" />";        myJsVal += "</li>";    }    //alert(myJsVal);    //-----分页控制条显示代码-------//    var pageBarXhtml = "";    pageBarXhtml += "<div onclick=\"NumberPage2('1')\">首页<\/div>";    pageBarXhtml += "<div onclick=\"PrePage2()\">上一页<\/div>";    pageBarXhtml += "<div onclick=\"NextPage2()\">下一页<\/div>";    pageBarXhtml += "<div onclick=\"NumberPage2('" + json.PageSum + "')\">尾页<\/div>";    var _pageMsgArr = new Array()    //内容显示代码     _pageMsgArr[0] = myJsVal;    //控制条件显示代码    _pageMsgArr[1] = pageBarXhtml;    //返回数组    return _pageMsgArr;
}



//=====================赠品信息====================//

/**
 * 初始化赠品信息
 * */
function initGiftMsg() {

    var HidGiftID = $("#HidGiftID").val().trim();

    //构造POST参数
    var dataPOST = {
        "Type": "5", "GiftID": HidGiftID,
    };
    console.log(dataPOST);
    //显示加载提示
    loadingWin();

    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: mAjaxUrl + "?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log(reTxt);
            //移除加载提示
            closeLoadingWin();
            if (reTxt != "") {
                var _json = JSON.parse(reTxt);
                //设置值到表单
                setValToForm(_json);


            }
        },
        error: function (xhr, errorTxt, status) {
            console.log("异步请求错误，errorTxt=" + errorTxt + " | status=" + status);
            return;
        }
    });
}

/**
 * 设置值到表单
 * @param {any} pJsonGiftMsg 初始化信息Json对象
 */
function setValToForm(pJsonGiftMsg) {

    var _jsonGooGiftMsg = pJsonGiftMsg.GooGiftMsg;
    var _jsonGooGiftImgArr = pJsonGiftMsg.GooGiftImgList;

    $("#GiftName").val(_jsonGooGiftMsg.GiftName);
    $("#GiftPrice").val(_jsonGooGiftMsg.GiftPrice);
    $("#StockNum").val(_jsonGooGiftMsg.StockNum);

    //console.log("_jsonGooGiftMsg.GiftDesc=" + _jsonGooGiftMsg.GiftDesc);
    setTimeout(function () {
        //为编辑器赋值
        mEditor.insertHtml(_jsonGooGiftMsg.GiftDesc);
    }, 2000);

    //初始化上传赠品图片的上传插件 
    initGooGiftImgUploadList(_jsonGooGiftImgArr);
}

/**
 * 初始化上传赠品图片的上传插件 
 * @param {any} pJsonGooGiftImgList 赠品图片列表 Json对象
 */
function initGooGiftImgUploadList(pJsonGooGiftImgList) {

    if (pJsonGooGiftImgList == undefined || pJsonGooGiftImgList == null) {
        return;
    }

    for (var i = 1; i < pJsonGooGiftImgList.length + 1; i++) {

        //获取图片URL中的 域名和图片相对路径  
        var _domainAndImgPathArr = getImgURLDomainAndImgPathArr(pJsonGooGiftImgList[i-1].ImgURL).split("^");

        $("#GiftImgPre_" + i).attr("src", "//" + pJsonGooGiftImgList[i-1].ImgURL);
        $("#HidUploadGiftVal_" + i).val(pJsonGooGiftImgList[i-1].UploadGuid + "|" + pJsonGooGiftImgList[i-1].ImgURL);

        var _btnGoodsListXhtml = "<a href=\"//" + _domainAndImgPathArr[0] + "/ToolWeb/CropZoom/CropZoom.aspx?CropImgWidth=700&CropImgHeight=700&CropTitle=赠品&ImgSourceURL=" + _domainAndImgPathArr[1] + "&RedirectURL=#\" target=\"_blank\">裁剪</a>";        _btnGoodsListXhtml += "<div onclick=\"delGooGiftImg('" + pJsonGooGiftImgList[i - 1].UploadGuid + "','" + _domainAndImgPathArr[0] + "'," + i + ")\">删除</div><div onclick=\"refreshImgSrcRnd('GiftImgPre_" + i + "')\">刷新</div>";        //显示代码插入前台         $("#BtnGiftList_" + i).html(_btnGoodsListXhtml);
        $("#BtnGiftList_" + i).show();
    }

}

/**
 * 提交赠品信息
 * */
function submitGiftMsg() {

    //获取表单值
    var HidGiftID = $("#HidGiftID").val().trim();
    var GiftName = $("#GiftName").val().trim();
    var GiftPrice = $("#GiftPrice").val().trim();
    var StockNum = $("#StockNum").val().trim();
    //赠品图片信息
    var HidUploadGiftVal_1 = $("#HidUploadGiftVal_1").val().trim();
    var HidUploadGiftVal_2 = $("#HidUploadGiftVal_2").val().trim();
    var HidUploadGiftVal_3 = $("#HidUploadGiftVal_3").val().trim();
    var HidUploadGiftVal_4 = $("#HidUploadGiftVal_4").val().trim();
    var HidUploadGiftVal_5 = $("#HidUploadGiftVal_5").val().trim();
    //赠品描述
    var GiftDesc = getEditorContent().trim();

    if (GiftName == "" || GiftPrice == "" || StockNum == "" || GiftDesc == "") {
        toastWin("【赠品标题】【价格】【库存】【赠品描述】都不能为空！");
        return;
    }

    if (GiftName.length > 80) {
        $("#GiftName").focus();
        toastWin("【赠品标题】字数不能超过80个！");
        return;
    }

    if (isNaN(GiftPrice)) {
        $("#GiftPrice").focus();
        toastWin("【价格】必须是数字！");
        return;
    }
    if (isNaN(StockNum)) {
        $("#StockNum").focus();
        toastWin("【库存】必须是数字！");
        return;
    }

    if (parseFloat(GiftPrice) <= 0) {
        $("#GiftPrice").focus();
        toastWin("【价格】必须大于0！");
        return;
    }

    if (parseInt(StockNum) <= 0) {
        $("#StockNum").focus();
        toastWin("【库存】必须大于0！");
        return;
    }
    StockNum = parseInt(StockNum);

    //mImgKeyGuid + "|" + mImgPathDomain ^ mImgKeyGuid + "|" + mImgPathDomain
    if (HidUploadGiftVal_1 == "" && HidUploadGiftVal_2 == "" && HidUploadGiftVal_3 == "" && HidUploadGiftVal_4 == "" && HidUploadGiftVal_5 == "") {
        toastWin("请至少上传一张赠品照片！");
        return;
    }
    //构造赠品图片上传字符串
    var _giftImgValArr = "";
    if (HidUploadGiftVal_1 != "") {
        _giftImgValArr += HidUploadGiftVal_1 + "^"
    }
    if (HidUploadGiftVal_2 != "") {
        _giftImgValArr += HidUploadGiftVal_2 + "^"
    }
    if (HidUploadGiftVal_3 != "") {
        _giftImgValArr += HidUploadGiftVal_3 + "^"
    }
    if (HidUploadGiftVal_4 != "") {
        _giftImgValArr += HidUploadGiftVal_4 + "^"
    }
    if (HidUploadGiftVal_5 != "") {
        _giftImgValArr += HidUploadGiftVal_5;
    }

    //构造POST参数
    var dataPOST = {
        "Type": "1", "GiftName": GiftName, "GiftPrice": GiftPrice, "GiftID": HidGiftID,
        "StockNum": StockNum, "GiftDesc": GiftDesc, "GiftImgUrlArr": _giftImgValArr,
    };
    console.log(dataPOST);
    //显示加载提示
    loadingWin();

    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: mAjaxUrl + "?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log(reTxt);
            //移除加载提示
            closeLoadingWin();
            if (reTxt != "") {
                var _json = JSON.parse(reTxt);
                if (_json.Msg != null) {

                    //删除因重复上传导致的多余赠品图片
                    delGooGiftImgRepeat();

                    toastWinCb(_json.Msg, function () {
                        window.location.href = "../GoodsPage/GooGiftMsg";
                    });
                    return;
                }
                if (_json.ErrMsg != null) {
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


