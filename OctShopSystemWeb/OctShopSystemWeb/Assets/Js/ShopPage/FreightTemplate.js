//================运费模板管理========================//

/**-----定义公共变量------**/

//AjaxURL
var mAjaxUrl = "../Shop/FreightTemplate";

//信息ID
var mMsgID = "0";

//添加窗口的Html显示代码
var mAddEditWinHtml = "";

/**------初始化------**/
$(function () {

    //初始化添加窗口显示代码
    initAddEditWinHtml();

});



//*********************弹出窗口操作逻辑******************//

/**
 * 初始化添加窗口显示代码
 */
function initAddEditWinHtml() {
    //获取窗口显示代码
    mAddEditWinHtml = $("#AddEditWin").html();
    $("#AddEditWin").empty();

    //初始化店铺运费模板
    loadShopFreightTemplate();
}

/**
 * 打开添加窗口
 */
function openAddWin() {

    mMsgID = "0";

    //打开Dialog弹出窗口
    openDialogWinNoClose("添加模板", mAddEditWinHtml, function () {

        //提交运费模板信息
        submitFreightTemplate();

    }, function () {


    }, 600);
}

/**
 * 打开编辑窗口
 * @param {any} pMsgID 信息ID 
 */
function openEditWin(pMsgID, pFtTitle, pFtDesc) {
    //信息ID
    mMsgID = pMsgID;

    //打开Dialog弹出窗口
    openDialogWinNoClose("编辑模板", mAddEditWinHtml, function () {

        //提交运费模板信息
        submitFreightTemplate();

    }, function () {


    }, 600);

    //初始化表单
    $("#FtTitle_ae").val(pFtTitle);
    $("#FtDesc_ae").val(pFtDesc);

}

/**
 * 提交运费模板信息
 * */
function submitFreightTemplate() {

    //获取表单信息
    var FtTitle_ae = $("#FtTitle_ae").val().trim();
    var FtDesc_ae = $("#FtDesc_ae").val().trim();

    if (FtTitle_ae == "") {
        toastWinToDiv("【模板标题】不能为空！", "dragWinDiv");
        return;
    }
    if (FtDesc_ae == "") {
        FtDesc_ae = "-";
    }

    //构造POST参数
    var dataPOST = {
        "Type": "1", "MsgID": mMsgID, "FtTitle": FtTitle_ae, "FtDesc": FtDesc_ae,
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
                if (_jsonReTxt.ErrMsg != null) {
                    toastWinToDiv(_jsonReTxt.ErrMsg, "dragWinDiv");
                    return;
                }
                else {
                    toastWinToDiv(_jsonReTxt.Msg, "dragWinDiv");
                    //重新加载数据
                    loadShopFreightTemplate();
                    //关闭窗口
                    closeDialogWin();
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
 * 加载所有的运费模板信息
 * */
function loadShopFreightTemplate() {

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
            console.log(reTxt);
            if (reTxt != "") {

                var _jsonReTxt = JSON.parse(reTxt);

                //构造表格显示代码
                var _xhtml = xhtmlShopFreightTemplate(_jsonReTxt);
                //显示代码插入前台
                $("#TbodyTrPage").html(_xhtml);

            }
            else {
                //显示代码插入前台
                $("#TbodyTrPage").html("");
            }
        },
        error: function (xhr, errorTxt, status) {
            console.log("异步请求错误，errorTxt=" + errorTxt + " | status=" + status);
            return;
        }
    });
}

/**
 * 构造表格显示代码  
 * @param {any} pJsonReTxt 列表Json对象
 */
function xhtmlShopFreightTemplate(pJsonReTxt) {

    //列表数组
    var _shopFreightTemplateArr = pJsonReTxt.ShopFreightTemplateList;
    var _shopFreightTemplateExtraArr = pJsonReTxt.ShopFreightTemplateListExtra;

    var myJsVal = "";    //循环构造显示代码    for (var i = 0; i < _shopFreightTemplateArr.length; i++) {        var _status = "正常";        if (_shopFreightTemplateArr[i].IsLock == "true") {            _status = "暂停";
        }        //锁定与解锁
        var _lockIcoClass = "";
        if (_shopFreightTemplateArr[i].IsLock == "true") {            _lockIcoClass = "am-icon-minus-square";
        }        else {            _lockIcoClass = "am-icon-check-square";
        }        //构造使用商品列表        var _xhtmlUserGoods = "";        if (_shopFreightTemplateExtraArr[i].UseGoodsIDArr != "") {            var _useGoodsIDArr = _shopFreightTemplateExtraArr[i].UseGoodsIDArr.split("^");            for (var j = 0; j < _useGoodsIDArr.length; j++) {                _xhtmlUserGoods += "<a href=\"#\">" + _useGoodsIDArr[j] +"</a>,"
            }
        }                myJsVal += "<tr class=\"tr-father\">";        myJsVal += "  <td>" + _shopFreightTemplateArr[i].FtID +"</td>";        myJsVal += "  <td><a href=\"../ShopPage/FreightTemplateParamList?FtID=" + _shopFreightTemplateArr[i].FtID +"\">" + _shopFreightTemplateArr[i].FtTitle +"</a></td>";        myJsVal += "  <td>" + _shopFreightTemplateArr[i].FtDesc +"</td>";        myJsVal += "  <td>";        myJsVal += "" + _xhtmlUserGoods +"";        myJsVal += "  </td>";        myJsVal += "  <td>" + _shopFreightTemplateExtraArr[i].FreightMoneyMinMax +"</td>";        myJsVal += "  <td>" + _status +"</td>";        myJsVal += "  <td>";        myJsVal += "<button class=\"table-btn am-btn am-btn-default am-btn-xs am-text-success am-round\" onclick=\"window.location.href='../ShopPage/FreightTemplateParamList?FtID=" + _shopFreightTemplateArr[i].FtID +"'\"><span class=\"am-icon-newspaper-o\"><\/span><\/button>";        myJsVal += "<button class=\"table-btn am-btn am-btn-default am-btn-xs am-text-secondary am-round\" onclick=\"openEditWin(" + _shopFreightTemplateArr[i].FtID + ", '" + _shopFreightTemplateArr[i].FtTitle + "', '" + _shopFreightTemplateArr[i].FtDesc + "')\"><span class=\"am-icon-pencil-square-o\"></span></button>";        myJsVal += "<button class=\"table-btn am-btn am-btn-default am-btn-xs am-text-warning  am-round\" onclick=\"lockFreightTemplate(" + _shopFreightTemplateArr[i].FtID + ",'" + _shopFreightTemplateArr[i].IsLock +"')\"><span class=\"" + _lockIcoClass +"\"></span></button>";        myJsVal += "<button class=\"table-btn am-btn am-btn-default am-btn-xs am-text-danger am-round\" onclick=\"delMsg(" + _shopFreightTemplateArr[i].FtID + ")\"><span class=\"am-icon-trash\"><\/span><\/button>";        myJsVal += "  </td>";        myJsVal += "</tr>";
    }    return myJsVal;
}

/**
 * 启用/暂停运费模板
 * @param {any} pFtID  运费模板ID
 * @param {any} pIsLock 解锁/锁定 运费模板
 */
function lockFreightTemplate(pFtID, pIsLock) {

    var _hintTxt = " [ 启用 ] 运费模板";
    if (pIsLock == "false") {
        _hintTxt = " [ 暂停 ] 运费模板";
    }

    confirmWinWidth("确定要" + _hintTxt +"吗？", function () {

        //构造POST参数
        var dataPOST = {
            "Type": "3", "FtID": pFtID,
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
                    if (_jsonReTxt.ErrMsg != null) {
                        //显示提示
                        toastWin(_jsonReTxt.ErrMsg);
                        return;
                    }
                    if (_jsonReTxt.Msg != null) {
                        //显示提示
                        toastWin(_jsonReTxt.Msg);
                        //重新加载数据
                        loadShopFreightTemplate();
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
 * 删除信息 
 * @param {any} pMsgID 信息ID
 */
function delMsg(pMsgID) {

    confirmWinWidth("确定要删除吗？应用此模板的商品将免运费！", function () {


        //构造POST参数
        var dataPOST = {
            "Type": "4", "FtID": pMsgID,
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
                    var _json = JSON.parse(reTxt);
                    if (_json.Msg != null) {

                        toastWin(_json.Msg);

                        //重新加载数据
                        loadShopFreightTemplate();

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

