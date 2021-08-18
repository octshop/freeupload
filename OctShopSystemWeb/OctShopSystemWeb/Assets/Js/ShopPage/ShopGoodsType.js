//=================== 店铺商品分类 ====================//

/**-----定义公共变量------**/

//AjaxURL
var mAjaxUrl = "../Shop/ShopGoodsType";

//信息ID
var mMsgID = "0";

//添加窗口的Html显示代码
var mAddEditWinHtml = "";

var mJsonFatherArr; //父级分类Json对象数组

/**------初始化------**/
$(function () {

    //加载店铺商品类别父级和子级列表
    loadShopGoodsType();

    //初始化添加窗口显示代码
    initAddEditWinHtml();

});

/**
 * 加载店铺商品类别父级和子级列表
 * */
function loadShopGoodsType() {

    //构造POST参数
    var dataPOST = {
        "Type": "1"
    };
    console.log(dataPOST);

    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: "../Shop/ShopGoodsType?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log(reTxt);
            var _json;
            if (reTxt != "") {
                try {
                    _json = JSON.parse(reTxt);
                } catch (e) {
                    $("#TbodyTrPage").html("");
                    return;
                };

                //构造前台显示代码
                var _xhtml = xhtmlShopGoodsType(_json)
                $("#TbodyTrPage").html(_xhtml);
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
 * 构造前台显示代码
 * @param 返回的字符串 Json对象 
 * */
function xhtmlShopGoodsType(pJsonBack) {

    //子级或父级的数组
    var _jsonFatherArr = pJsonBack.ShopGoodsTypeFather;
    var _jsonSubArr = pJsonBack.ShopGoodsTypeSub;

    mJsonFatherArr = _jsonFatherArr;

    //总的显示代码
    var xhtml = "";
    for (var i = 0; i < _jsonFatherArr.length; i++) {

        //锁定与解锁
        var _lockIcoClass = "";
        if (_jsonFatherArr[i].IsLock == "true") {            _lockIcoClass = "am-icon-lock";
        }        else {            _lockIcoClass = "am-icon-unlock";
        }

        xhtml += " <tr class=\"tr-father\">";        xhtml += "  <td>" + _jsonFatherArr[i].ShopGoodsTypeName + "<\/td>";        xhtml += "  <td>" + _jsonFatherArr[i].TypeMemo + "<\/td>";        xhtml += "  <td>" + _jsonFatherArr[i].SortNum + "<\/td>";        xhtml += "  <td>" + _jsonFatherArr[i].IsLock + "<\/td>";        xhtml += "  <td>";        xhtml += "      <button class=\"table-btn am-btn am-btn-default am-btn-xs am-text-secondary am-round\" onclick=\"openEditWin(" + _jsonFatherArr[i].ShopGoodsTypeID + ")\"><span class=\"am-icon-pencil-square-o\"><\/span><\/button>";        xhtml += "      <button class=\"table-btn am-btn am-btn-default am-btn-xs am-text-warning  am-round\" onclick=\"toggleLock(" + _jsonFatherArr[i].ShopGoodsTypeID + ")\"><span class=\"" + _lockIcoClass + "\"><\/span><\/button>";        xhtml += "      <button class=\"table-btn am-btn am-btn-default am-btn-xs am-text-danger am-round\" onclick=\"delMsg(" + _jsonFatherArr[i].ShopGoodsTypeID + ")\"><span class=\"am-icon-trash\"><\/span><\/button>";        xhtml += "  <\/td>";        xhtml += "<\/tr>";

        //子级列表数组
        if (_jsonSubArr.length <= 0) {
            continue;
        }
        var _shopGoodsTypeSubArr = _jsonSubArr[i].ShopGoodsTypeSubList;
        for (var j = 0; j < _shopGoodsTypeSubArr.length; j++) {

            //锁定与解锁
            var _lockIcoClassSub = "";
            if (_shopGoodsTypeSubArr[j].IsLock == "true") {                _lockIcoClassSub = "am-icon-lock";
            }            else {                _lockIcoClassSub = "am-icon-unlock";
            }

            xhtml += " <tr>";            xhtml += "  <td>" + _shopGoodsTypeSubArr[j].ShopGoodsTypeName + "<\/td>";            xhtml += "  <td>" + _shopGoodsTypeSubArr[j].TypeMemo + "<\/td>";            xhtml += "  <td>" + _shopGoodsTypeSubArr[j].SortNum + "<\/td>";            xhtml += "  <td>" + _shopGoodsTypeSubArr[j].IsLock + "<\/td>";            xhtml += "  <td>";            xhtml += "      <button class=\"table-btn am-btn am-btn-default am-btn-xs am-text-secondary am-round\" onclick=\"openEditWin(" + _shopGoodsTypeSubArr[j].ShopGoodsTypeID + ")\"><span class=\"am-icon-pencil-square-o\"><\/span><\/button>";            xhtml += "      <button class=\"table-btn am-btn am-btn-default am-btn-xs am-text-warning am-round\" onclick=\"toggleLock(" + _shopGoodsTypeSubArr[j].ShopGoodsTypeID + ")\"><span class=\"" + _lockIcoClassSub + "\"><\/span><\/button>";            xhtml += "      <button class=\"table-btn am-btn am-btn-default am-btn-xs am-text-danger am-round\" onclick=\"delMsg(" + _shopGoodsTypeSubArr[j].ShopGoodsTypeID + ")\"><span class=\"am-icon-trash\"><\/span><\/button>";            xhtml += "  <\/td>";            xhtml += "<\/tr>";
        }
    }
    //显示代码返回
    return xhtml;
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
    openDialogWinNoClose("添加分类", mAddEditWinHtml, function () {

        //添加或保存店铺商品类目
        submitShopGoodsType();

    }, function () {


    }, 600);

    //初始化父级分类下拉列表
    initFatherTypeSelect();
}

/**
 * 打开编辑窗口
 * @param {any} pMsgID 信息ID ShopGoodsTypeID
 */
function openEditWin(pMsgID) {
    //信息ID
    mMsgID = pMsgID;

    //打开Dialog弹出窗口
    openDialogWinNoClose("编辑分类", mAddEditWinHtml, function () {

        //添加或保存店铺商品类目
        submitShopGoodsType();

    }, function () {


    }, 600);

    //初始化父级分类下拉列表
    initFatherTypeSelect();

    //初始化店铺商品分类
    initShopGoodsType();
}

/**
 * 初始化店铺商品分类
 * */
function initShopGoodsType() {

    //构造POST参数
    var dataPOST = {
        "Type": "3", "ShopGoodsTypeID": mMsgID,
    };
    console.log(dataPOST);

    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: "../Shop/ShopGoodsType?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log(reTxt);
            if (reTxt != "") {
                var _json = JSON.parse(reTxt);
                $("#FatherTypeID_ae").val(_json.FatherTypeID);
                $("#ShopGoodsTypeName_ae").val(_json.ShopGoodsTypeName);
                $("#TypeMemo_ae").val(_json.TypeMemo);
                $("#SortNum_ae").val(_json.SortNum);
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
 * 初始化父级分类下拉列表
 */
function initFatherTypeSelect() {

    $("#FatherTypeID_ae").empty();
    $("#FatherTypeID_ae").append("<option value=\"0\">自身为父级</option>");
    for (var i = 0; i < mJsonFatherArr.length; i++) {
        $("#FatherTypeID_ae").append("<option value='" + mJsonFatherArr[i].ShopGoodsTypeID + "'>" + mJsonFatherArr[i].ShopGoodsTypeName + "</option>");
    }
}


/**
 * 添加或保存店铺商品类目
 * */
function submitShopGoodsType() {

    //获取表单值
    var FatherTypeID_ae = $("#FatherTypeID_ae").val().trim();
    var ShopGoodsTypeName_ae = $("#ShopGoodsTypeName_ae").val().trim();
    var TypeMemo_ae = $("#TypeMemo_ae").val().trim();
    var SortNum_ae = $("#SortNum_ae").val().trim();
    //var IsLock_ae = $("#IsLock_ae").is(":checked");

    if (ShopGoodsTypeName_ae == "") {
        toastWinToDiv("【分类名称】不能为空！", "dragWinDiv");
        return;
    }
    if (SortNum_ae == "" || parseInt(SortNum_ae) < 0) {
        SortNum_ae = 0;
    }
    if (isNaN(SortNum_ae)) {
        toastWinToDiv("【排序数值】必须是数字！", "dragWinDiv");
        return;
    }

    //构造POST参数
    var dataPOST = {
        "Type": "2", "ShopGoodsTypeID": mMsgID, "FatherTypeID": FatherTypeID_ae, "ShopGoodsTypeName": ShopGoodsTypeName_ae, "TypeMemo": TypeMemo_ae, "SortNum": SortNum_ae,
    };
    console.log(dataPOST);
    //显示加载提示
    loadingWinToDiv("dragWinDiv");

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

                    toastWinToDivCb(_json.Msg, function () {

                        //加载店铺商品类别父级和子级列表
                        loadShopGoodsType();

                        //关闭弹出窗口
                        closeDialogWin();

                    }, "dragWinDiv");
                    return
                }
                if (_json.ErrMsg != null) {
                    toastWinToDiv(_json.ErrMsg, "dragWinDiv");
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
 * 解锁与锁定
 * @param {any} pMsgID 信息ID
 */
function toggleLock(pMsgID) {

    //构造POST参数
    var dataPOST = {
        "Type": "4", "ShopGoodsTypeID": pMsgID,
    };
    console.log(dataPOST);

    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: "../Shop/ShopGoodsType?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log(reTxt);
            if (reTxt != "") {
                var _json = JSON.parse(reTxt);
                if (_json.Msg != null) {

                    toastWin(_json.Msg);

                    //加载店铺商品类别父级和子级列表
                    loadShopGoodsType();

                    return;
                }
                if (_json.ErrMsg != null) {
                    toastWin(_json.ErrMsg);
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

/**
 * 删除信息 
 * @param {any} pMsgID 信息ID
 */
function delMsg(pMsgID) {

    confirmWinWidth("确定要删除吗？", function () {


        //构造POST参数
        var dataPOST = {
            "Type": "5", "ShopGoodsTypeID": pMsgID,
        };
        console.log(dataPOST);

        //正式发送异步请求
        $.ajax({
            type: "POST",
            url: "../Shop/ShopGoodsType?rnd=" + Math.random(),
            data: dataPOST,
            dataType: "html",
            success: function (reTxt, status, xhr) {
                console.log(reTxt);
                if (reTxt != "") {
                    var _json = JSON.parse(reTxt);
                    if (_json.Msg != null) {

                        toastWin(_json.Msg);

                        //加载店铺商品类别父级和子级列表
                        loadShopGoodsType();

                        return;
                    }
                    if (_json.ErrMsg != null) {
                        toastWin(_json.ErrMsg);
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

    }, 400);


}