//================店铺类别========================//

/**-----定义公共变量------**/

//AjaxURL
var mAjaxUrl = "../UserGoodsShop/ShopType";

/******数据分页的变量********/
var strPOSTSe = ""; //搜索条件对象 POST参数
var intPageCurrent = 1; //当前页
var pageSize = 0; //当页的记录条数，与后台保持一致
var recordSum = 0; //总记录数
var tableColNum = 9; //当前表列数

//添加窗口的Html显示代码
var mAddEditWinHtml = "";
//详情窗口的Html显示代码
var mDetailWinHtml = "";

//信息ID
var mMsgID = "0";
var mImgKeyGuid = "";
var mImgPathDomain = "";


/**------初始化------**/
$(function () {

    //初始化加载
    searchContent();

    //搜索按钮单击事件
    $("#btnSearch").click(function () {
        searchContent();
    });


    //初始化添加窗口显示代码
    initAddEditWinHtml();

});


/**------自定义函数------**/

/*
---------定义搜索函数---------
*/
var searchContent = function () {

    intPageCurrent = 1; //开始页

    var ShopTypeID_se = $("#ShopTypeID_se").val().trim();
    var ShopTypeName_se = $("#ShopTypeName_se").val().trim();
    var FatherTypeID_se = $("#FatherTypeID_se").val().trim();
    var ShopTypeMemo_se = $("#ShopTypeMemo_se").val().trim();
    var IsEntity_se = $("#IsEntity_se").val().trim();
    var IsLock_se = $("#IsLock_se").val().trim();
    var WriteDate_se = $("#WriteDate_se").val().trim();


    //构造POST参数
    var strPOST = {
        "pageCurrent": "1", "Type": "1"
    };

    //翻页所用
    var strPOSTSePush = {
        "ShopTypeID": ShopTypeID_se, "ShopTypeName": ShopTypeName_se, "FatherTypeID": FatherTypeID_se,
        "ShopTypeMemo": ShopTypeMemo_se, "IsLock": IsLock_se, "IsEntity": IsEntity_se, "WriteDate": WriteDate_se
    };
    //将对象添加到分类对象中

    //搜索内容用
    var strPOSTSeContent = pushTwoObject(strPOST, strPOSTSePush);

    //分页操作用
    var strPOSTSearch = { "Type": "1" };
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
            console.log(reTxtJson);
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
    var myJsVal = "";    //循环构造    for (var i = 0; i < json.DataPage.length; i++) {

        var indexDataPage = json.DataPage[i];
        var indexDataPageExtra = json.DataPageExtra[i];

        var _IsEntity = "否";        if (indexDataPage.IsEntity == "true") {            _IsEntity = "是";
        }
        var _IsLock = "否";
        if (indexDataPage.IsLock == "true") {
            _IsLock = "是";
        }

        myJsVal += "<tr>";        myJsVal += "  <td><input type=\"checkbox\" name=\"SelCbItem\" id=\"SelCbItem_" + indexDataPage.ShopTypeID + "\" /></td>";        myJsVal += "  <td>" + indexDataPage.ShopTypeID + "</td>";        myJsVal += "  <td>" + indexDataPage.ShopTypeName + "</td>";        myJsVal += "  <td>" + indexDataPage.FatherTypeID + " <i> ( " + indexDataPageExtra.FatherShopTypeName + " ) </i></td>";        if (indexDataPage.TypeIcon != "") {            myJsVal += "<td><img src=\"//" + indexDataPage.TypeIcon + "\" class=\"goods-type-icon\" /></td>";
        }        else {            myJsVal += "<td></td>";
        }        myJsVal += "  <td>" + indexDataPage.ShopTypeMemo + "</td>";        myJsVal += "  <td>" + _IsEntity + "</td>";        myJsVal += "  <td>" + _IsLock + "</td>";        myJsVal += "  <td>" + indexDataPage.WriteDate + "</td>";        myJsVal += "  <td>";        myJsVal += "      <button class=\"table-btn am-btn am-btn-default am-btn-xs am-text-secondary am-round\" onclick=\"openEditWin(" + indexDataPage.ShopTypeID + ")\"><span class=\"am-icon-pencil-square-o\"></span></button>";        //myJsVal += "<button class=\"table-btn am-btn am-btn-default am-btn-xs am-text-warning am-round\" onclick=\"toggleLockMsg(" + indexDataPage.ShopTypeID + ")\">";        //if (indexDataPage.IsLock == "false") {
        //    myJsVal += "<span class=\"am-icon-unlock\"></span>"
        //}        //else {
        //    myJsVal += "<span class=\"am-icon-lock\"></span>"
        //}        //myJsVal += "</button>";        myJsVal += "</td>";        myJsVal += "</tr>";
    }    //alert(myJsVal);    //-----分页控制条显示代码-------//    var pageBarXhtml = "";    //pageBarXhtml = " 共<font color=\"red\" id=\"recordSum\">" + json.RecordSum + "</font>条记录  页次:<font color=\"red\">" + json.PageCurrent + "/" + json.PageSum + "</font>页 ";
    //pageBarXhtml += "<span onclick=\"NumberPage('1')\">首页</span> <span  onclick=\"PrePage();\">上一页</span> ";
    //pageBarXhtml += "<span onclick=\"NextPage();\">下一页</span> <span onclick=\"NumberPage('" + json.PageSum + "')\">尾页</span>&nbsp;<input id=\"PageNumTxt\" class=\"TxtPage\" type=\"text\" size=\"5\" /> <input class=\"GoToPage\" type=\"button\" value=\"GO\" onclick=\"gotoPage()\" />";    pageBarXhtml += " <li><a href=\"javascript:void(0)\" onclick=\"PrePage()\">«</a></li>";    pageBarXhtml += " <li><a href=\"javascript:void(0)\" onclick=\"NumberPage('1')\">1</a></li>";    pageBarXhtml += "  <li><span>...</span></li>";    if ((intPageCurrent - 2) > 0) {
        pageBarXhtml += "  <li><a href=\"javascript:void(0)\" onclick=\"NumberPage('" + (intPageCurrent - 2) + "')\">" + (intPageCurrent - 2) + "</a></li>";
    }    if ((intPageCurrent - 1) > 0) {
        pageBarXhtml += "  <li><a href=\"javascript:void(0)\" onclick=\"NumberPage('" + (intPageCurrent - 1) + "')\">" + (intPageCurrent - 1) + "</a></li>";
    }    pageBarXhtml += "  <li class=\"am-active\"><a href=\"javascript:void(0)\" onclick=\"NumberPage('" + json.PageCurrent + "')\">" + json.PageCurrent + "</a></li>";    console.log(parseInt(json.PageSum));    if ((intPageCurrent + 1) <= parseInt(json.PageSum)) {
        pageBarXhtml += "  <li><a href=\"javascript:void(0)\" onclick=\"NumberPage('" + (intPageCurrent + 1) + "')\">" + (intPageCurrent + 1) + "</a></li>";
    }    if ((intPageCurrent + 2) <= parseInt(json.PageSum)) {
        pageBarXhtml += "  <li><a href=\"javascript:void(0)\" onclick=\"NumberPage('" + (intPageCurrent + 2) + "')\">" + (intPageCurrent + 2) + "</a></li>";
    }    pageBarXhtml += "  <li><span>...</span></li>";    pageBarXhtml += "  <li><a href=\"javascript:void(0)\" onclick=\"NumberPage('" + json.PageSum + "')\">" + json.PageSum + "</a></li>";    pageBarXhtml += "  <li><input type=\"text\" id=\"PageNumTxt\" class=\"page-go-text am-form-field\" placeholder=\"跳转页\" /></li>";    pageBarXhtml += "  <li><a href=\"javascript:void(0)\" onclick=\"NextPage()\">»</a></li>";    var _pageMsgArr = new Array()    //内容显示代码     _pageMsgArr[0] = myJsVal;    //控制条件显示代码    _pageMsgArr[1] = pageBarXhtml;    //返回数组    return _pageMsgArr;
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


//---------------------------跳转页---------------------//
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

//---------------------弹出窗口功能-------------//

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
    openDialogWinNoClose("添加店铺类别", mAddEditWinHtml, function () {

        //添加或编辑信息
        aeMsg("add");

    }, function () {


    }, 600);

    //加载店铺父级类别列表
    loadFatherShopType(function () {

        //初始化上传商品类目图标
        initUploadTypeIcon();

    });


}


/**
 * 打开编辑窗口
 * @param {any} mMsgID 信息ID
 */
function openEditWin(pMsgID) {

    //console.log("mEditWinHtml=" + mEditWinHtml);

    //打开Dialog弹出窗口
    openDialogWinNoClose("编辑店铺类别", mAddEditWinHtml, function () {

        //确定按钮
        aeMsg("edit");

    }, function () {


    }, 600);

    mMsgID = pMsgID;


    //加载店铺父级类别列表
    loadFatherShopType(function () {

        //初始化编辑窗口信息
        initEditWin(pMsgID);

        //初始化上传商品类目图标
        initUploadTypeIcon();

    });
}

/**
 * 加载店铺父级类别列表
 * @param {any} pCallBack 回调函数
 */
function loadFatherShopType(pCallBack) {

    if (pCallBack == undefined || pCallBack == "") {
        pCallBack = function () { };
    }

    //构造GET参数
    var dataGET = {
        "Type": "4", "FatherShopTypeID": "0"
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
                //为下拉列表赋值
                for (var i = 0; i < _jsonObj.ShopTypeFatherList.length; i++) {
                    $("#FatherTypeID_ae").append("<option value='" + _jsonObj.ShopTypeFatherList[i].ShopTypeID + "'>" + _jsonObj.ShopTypeFatherList[i].ShopTypeName + "</option>");
                }                //回调函数                pCallBack();            }
        },
        error: function (xhr, errorTxt, status) {
            console.log("异步请求错误，errorTxt=" + errorTxt + " | status=" + status);
            //alert("网络出现异常,请重试！");
            return;
        }
    });
}

/**
 * 添加或编辑信息
* @param {any} pExeType 操作类型 [add / edit]
 */
function aeMsg(pExeType) {

    //获取表单值
    var FatherTypeID_ae = $("#FatherTypeID_ae").val().trim();
    var ShopTypeName_ae = $("#ShopTypeName_ae").val().trim();
    var ShopTypeMemo_ae = $("#ShopTypeMemo_ae").val().trim();
    var SortNum_ae = $("#SortNum_ae").val().trim();

    var IsLock_ae = "false";
    if ($("#IsLock_ae").is(":checked")) {
        IsLock_ae = "true";
    }

    var IsEntity_ae = "false";
    if ($("#IsEntity_ae").is(":checked")) {
        IsEntity_ae = "true";
    }

    if (ShopTypeName_ae == "") {
        toastWinToDiv("【类别名称】不能为空！", "dragWinDiv");
        return;
    }
    if (isNaN(SortNum_ae)) {
        toastWinToDiv("【排序数值】必须为数字！", "dragWinDiv");
        return;
    }


    //构造POST参数
    var dataPOST = {
        "Type": "2", "MsgID": mMsgID, "FatherTypeID": FatherTypeID_ae, "ShopTypeName": ShopTypeName_ae,
        "ShopTypeMemo": ShopTypeMemo_ae, "SortNum": SortNum_ae, "IsLock": IsLock_ae, "IsEntity": IsEntity_ae, "ImgKeyGuid": mImgKeyGuid, "ImgPathDomain": mImgPathDomain,

    };
    console.log(dataPOST);

    //显示加载提示
    loadingWinToDiv("dragWinDiv");

    //以POST方式发送异步请求
    $.ajax({
        type: "POST",
        url: mAjaxUrl + "?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxtJson, status, xhr) {
            //显示返回值
            console.log(reTxtJson);

            //移除加载提示
            closeLoadingWin();

            if (reTxtJson != "") {

                var _jsonObj = JSON.parse(reTxtJson);
                if (_jsonObj.Code != null) {

                    //提示信息
                    toastWin(_jsonObj.Msg);
                    //关闭弹出窗口
                    closeDialogWin();
                    //重置信息ID
                    var mMsgID = "0";
                    //重新加载数据
                    NumberPage(intPageCurrent);

                    return
                }

                //显示错误信息
                if (_jsonObj.ErrCode != null) {
                    toastWin(_jsonObj.ErrMsg);
                }

            }
        },
        error: function (xhr, errorTxt, status) {
            console.log("错误信息errorTxt=" + errorTxt + " | status=" + status);
            //alert("网络出现异常,请重试！");
        }
    });
}

/**
 * 初始化编辑窗口
 * @param {any} pMsgID 信息ID
 */
function initEditWin(pMsgID) {

    //构造POST参数
    var dataPOST = {
        "Type": "5", "ShopTypeID": pMsgID,
    };
    console.log(dataPOST);

    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: mAjaxUrl + "?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("初始化=" + reTxt);
            if (reTxt != "") {
                var _jsonReTxt = JSON.parse(reTxt);
                //赋值给信息ID
                mMsgID = pMsgID;

                //给表单赋值
                $("#FatherTypeID_ae").val(_jsonReTxt.FatherTypeID);
                $("#ShopTypeName_ae").val(_jsonReTxt.ShopTypeName);
                $("#ShopTypeMemo_ae").val(_jsonReTxt.ShopTypeMemo);
                $("#SortNum_ae").val(_jsonReTxt.SortNum);

                if (_jsonReTxt.TypeIcon != "") {
                    $("#TypeIcon_ae").attr("src", "//" + _jsonReTxt.TypeIcon);
                }

                if (_jsonReTxt.IsLock == "true") {
                    $("#IsLock_ae").attr("checked", true);
                }
                else {
                    $("#IsLock_ae").attr("checked", false);
                }

                if (_jsonReTxt.IsEntity == "true") {
                    $("#IsEntity_ae").attr("checked", true);
                }
                else {
                    $("#IsEntity_ae").attr("checked", false);
                }
            }
        },
        error: function (xhr, errorTxt, status) {
            console.log("异步请求错误，errorTxt=" + errorTxt + " | status=" + status);
            //alert("异步请求错误，errorTxt=" + errorTxt + " | status=" + status);
            return;
        }
    });
}

/**
 * 批量删除信息
 */
function delMsgArr() {
    var MsgIDArr = getSelectValArr();
    console.log("MsgIDArr=" + MsgIDArr);


    if (MsgIDArr == "") {
        toastWin("请选择要删除的信息！");
        return;
    }

    //构造POST参数
    var dataPOST = {
        "Type": "6", "MsgIDArr": MsgIDArr,
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

                if (_jsonReTxt.Code != "") {
                    toastWin(_jsonReTxt.Msg);

                    //重新加载数据
                    NumberPage(intPageCurrent)
                    return;
                }

                if (ErrCode != null) {
                    toastWin(_jsonReTxt.ErrMsg);
                }

            }
        }
    });
}







/**------------------图片上传----------------------**/


/**
 * 初始化上传商品类目图标
 */
function initUploadTypeIcon() {

    //构造POST参数
    var _dataPost = "Type=1&MsgID=" + mMsgID;


    $('#fileupload').fileupload({
        url: "../FileUpload/ShopTypeIcon?" + _dataPost,
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
            $("#TypeIcon_ae").attr("src", "//" + mImgPathDomain);

            //保存类目图片上传信息
            saveImgPathServerDomainToDB(mMsgID, mImgPathDomain);
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

/**
 * 保存类目图片上传信息
 * @param {any} pMsgID 类目ID
 * @param {any} pImgPathDomain 上传服务器 域名 + 相对路径  192.168.3.10:1400/Upload/GooGoodsTypeIcon/GGTI_10030_201906010812236530.jpg
 */
function saveImgPathServerDomainToDB(pMsgID, pImgPathDomain) {

    if (pMsgID == 0 || pMsgID == "0") {
        return;
    }

    //构造POST参数
    var dataPOST = {
        "Type": "8", "ShopTypeID": pMsgID, "ImgPathDomain": pImgPathDomain
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
                if (_jsonReTxt.Code != "") {
                    //重新加载数据
                    //NumberPage(intPageCurrent);
                }
            }
        },
        error: function (xhr, errorTxt, status) {
            console.log("异步请求错误，errorTxt=" + errorTxt + " | status=" + status);
            //alert("异步请求错误，errorTxt=" + errorTxt + " | status=" + status);
            return;
        }
    });

}




