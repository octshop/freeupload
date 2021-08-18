/*===================说明文章添加编辑===========================*/

/**-----定义公共变量------**/

//AjaxURL
var mAjaxUrl = "../AfterSaleAccCus/ExplainText";

//说明文章ID
var mExplainID = "";

//编辑器对象
var mEditor;
var mEditorContent = "";

//插入图片窗口Html
var mInsertImgWinHtml = "";

/**------初始化------**/
$(function () {

    mExplainID = $("#hidExplainID").val().trim();
    if (mExplainID == "" || mExplainID == "0") {
        $("#ExplainType option[value='ShopEnter']").remove();
        $("#ExplainType option[value='VipLevel^CreditScore']").remove();
    }

    //判断是通过手机访问还是电脑访问的 定义编辑框的宽度
    if (isVisiteByMobile() == "mobile") {
        $("#EditorContent").css("width", "720");
        $(".goods-desc-btn").css("width", "720");
        $(".goods-btn").css("width", "720");
    }

    //初始化编辑器
    initEditor();

    //初始化插入图片窗口显示代码
    initInsertImgWinHtml();

    //初始化 说明性文本内容
    initExplainText();


});


/*=================自定义函数=====================*/

/**
 * 初始化 说明性文本内容
 * */
function initExplainText() {

    if (mExplainID == "" || mExplainID == "0") {
        return;
    }

    //构造POST参数
    var dataPOST = {
        "Type": "3", "ExplainID": mExplainID,
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
            console.log("初始化 说明性文本内容=" + reTxt);

            //移除加载提示
            closeLoadingWin();

            if (reTxt != "") {
                var _jsonReTxt = JSON.parse(reTxt);

                $("#ExplainType").val(_jsonReTxt.ExplainType);
                $("#ExplainTitle").val(_jsonReTxt.ExplainTitle);

                if (_jsonReTxt.ExplainType.indexOf("VipLevel^CreditScore") >= 0 || _jsonReTxt.ExplainType.indexOf("ServiceTel") >= 0 || _jsonReTxt.ExplainType.indexOf("ShopEnter") >= 0) {
                    $("#ExplainType").attr("disabled", true);
                }

                setTimeout(function () {
                    //为编辑器赋值
                    mEditor.insertHtml(_jsonReTxt.ExplainContent);
                }, 2000);

            }
        },
        error: function (xhr, errorTxt, status) {
            console.log("异步请求错误，errorTxt=" + errorTxt + " | status=" + status);
            return;
        }
    });

}

/**
 * 提交 说明性文本内容
 * */
function submitExplainText() {

    //获取表单值
    var ExplainType = $("#ExplainType").val().trim();
    var ExplainTitle = $("#ExplainTitle").val().trim();
    var ExplainContent = getEditorContent().trim();

    if (ExplainTitle == "" || ExplainContent == "") {
        toastWin("【文章标题】【文章内容】不能为空！");
        return;
    }

    //构造POST参数
    var dataPOST = {
        "Type": "2", "ExplainID": mExplainID, "ExplainType": ExplainType, "ExplainTitle": ExplainTitle, "ExplainContent": ExplainContent,
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
            console.log("提交说明性文本内容=" + reTxt);

            //移除加载提示
            closeLoadingWin();

            if (reTxt != "") {
                var _jsonReTxt = JSON.parse(reTxt);

                if (_jsonReTxt.ErrMsg != "" && _jsonReTxt.ErrMsg != undefined && _jsonReTxt.ErrMsg != null) {
                    toastWin(_jsonReTxt.ErrMsg);
                    return;
                }

                if (_jsonReTxt.Msg != "" && _jsonReTxt.Msg != undefined && _jsonReTxt.Msg != null) {
                    toastWinCb(_jsonReTxt.Msg, function () {
                        window.location.href = "../AfterSaleAccCusPage/ExplainText";
                    });
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
 * 初始化编辑器
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
 * 得到KindEditor的内容
 * */
function getEditorContent() {

    // 同步数据后可以直接取得textarea的value,必须同步否则得不到值
    editor.sync();
    //得到编辑器内容
    var _editorContent = $("#EditorContent").val().trim();
    return _editorContent;
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


    //初始化本地上传的插件
    initUploadEditorImg();

    //搜索图片
    searchContent();

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
 * 初始化本地上传的插件
 * */
function initUploadEditorImg() {

    //构造上传控件的ID字符串
    var _uploadIDstr = "fileupload_Editor";

    //构造POST参数
    var _dataPost = "Type=1&ExplainType=" + $("#ExplainType").val().trim();
    console.log(_dataPost);

    $('#' + _uploadIDstr).fileupload({
        url: "../FileUpload/ExplainImg?" + _dataPost + "&rnd=" + Math.random(),
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

            //搜索图片
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


//=================图片数据分页====================//

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

    //构造POST参数
    var strPOST = {
        "pageCurrent": "1", "Type": "3"
    };

    //翻页所用
    var strPOSTSePush = {
        "ExtraData": "",
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
        url: "../FileUpload/ExplainImg?rnd=" + Math.random(),
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
        url: "../FileUpload/ExplainImg?rnd=" + Math.random(),
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
    var myJsVal = "";
    //循环构造
    for (var i = 0; i < json.DataPage.length; i++) {

        var indexDataPage = json.DataPage[i];
        var indexDataPageExtra = json.DataPageExtra[i];

        myJsVal += "<li>";
        myJsVal += " <img src=\"//" + indexDataPage.ServerDomain + "/ToolWeb/ShowImgScale.aspx?FilePathFrom=" + indexDataPage.ImgPath + "&LimitWidthNum=80&LimitHeightNum=80\" />";
        myJsVal += " <input class=\"sel-img-cb\" type=\"checkbox\" data-imgurl=\"//" + indexDataPage.ServerDomain + "/" + indexDataPage.ImgPath + "\" onchange=\"chgSelInsertImgCb()\" />";
        myJsVal += "</li>";

    }
    //alert(myJsVal);

    //-----分页控制条显示代码-------//
    var pageBarXhtml = "";

    pageBarXhtml += "<div onclick=\"NumberPage('1')\">首页<\/div>";
    pageBarXhtml += "<div onclick=\"PrePage()\">上一页<\/div>";
    pageBarXhtml += "<div onclick=\"NextPage()\">下一页<\/div>";
    pageBarXhtml += "<div onclick=\"NumberPage('" + json.PageSum + "')\">尾页<\/div>";

    var _pageMsgArr = new Array()
    //内容显示代码 
    _pageMsgArr[0] = myJsVal;
    //控制条件显示代码
    _pageMsgArr[1] = pageBarXhtml;
    //返回数组
    return _pageMsgArr;
}




/*=================公共函数=====================*/

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

