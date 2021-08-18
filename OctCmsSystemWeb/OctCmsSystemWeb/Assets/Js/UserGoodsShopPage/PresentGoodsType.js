//===================礼品分类============================//


/**-----定义公共变量------**/
//AjaxURL
var mAjaxUrl = "../UserGoodsShop/PresentGoodsType";

/**------初始化------**/

$(function () {

    //加载所有礼品分类
    loadPresentGoodsType();


    //搜索按钮单击事件
    $("#btnSearch").click(function () {

        //加载所有礼品分类
        loadPresentGoodsType();
    });

});


/**
 * 加载所有礼品分类
 * */
function loadPresentGoodsType() {

    var pIsEntity = $("#IsEntity_se").val().trim();

    //构造POST参数
    var dataPOST = {
        "Type": "1", "IsEntity": pIsEntity,
    };
    console.log(dataPOST);

    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: mAjaxUrl + "?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("加载所有礼品分类=" + reTxt);
            if (reTxt != "") {
                var _jsonReTxt = JSON.parse(reTxt);

                var PresentGoodsTypeList = _jsonReTxt.PresentGoodsTypeList;
                var ExtraDataList = _jsonReTxt.ExtraDataList;

                var myJsVal = "";
                for (var i = 0; i < PresentGoodsTypeList.length; i++) {

                    var _IsEntity = "否";
                    if (PresentGoodsTypeList[i].IsEntity == "true") {
                        _IsEntity = "是";
                    }

                    var _IsShow = "显示";
                    if (PresentGoodsTypeList[i].IsShow == "false") {
                        _IsShow = "隐藏";
                    }

                    var _IsLock = "否";
                    if (PresentGoodsTypeList[i].IsLock == "true") {
                        _IsLock = "是";
                    }

                    var _IsHasPresentMsg = "";
                    if (ExtraDataList[i].IsHasPresentMsg == "false") {
                        _IsHasPresentMsg = "<font color=\"red\">无礼品</font>"
                    }
                    //console.log(ExtraDataList[i].IsHasSkGoodsMsg);

                    myJsVal += " <tr>";
                    myJsVal += " <td>" + PresentGoodsTypeList[i].PresentTypeID + "</td>";
                    myJsVal += " <td>" + PresentGoodsTypeList[i].GoodsTypeID + "<br />" + _IsHasPresentMsg + "</td>";
                    myJsVal += " <td>" + PresentGoodsTypeList[i].GoodsTypeName + "</td>";
                    myJsVal += " <td>" + _IsEntity + "</td>";
                    myJsVal += " <td>";
                    myJsVal += "   " + _IsShow + "";
                    myJsVal += " </td>";
                    myJsVal += " <td>" + _IsLock + "</td>";
                    myJsVal += " <td>" + PresentGoodsTypeList[i].WriteDate + "</td>";
                    myJsVal += " <td>";

                    if (PresentGoodsTypeList[i].IsShow == "false") {
                        myJsVal += "<button class=\"table-btn am-btn am-btn-default am-btn-xs am-text-secondary am-round\" onclick=\"tglPresentGoodsTypeIsShow('" + PresentGoodsTypeList[i].PresentTypeID + "', 'true')\">显示</button>";
                    }
                    else {
                        myJsVal += "<button class=\"table-btn am-btn am-btn-default am-btn-xs am-text-secondary am-round\" onclick=\"tglPresentGoodsTypeIsShow('" + PresentGoodsTypeList[i].PresentTypeID + "', 'false')\">隐藏</button>";
                    }

                    myJsVal += " </td>";
                    myJsVal += "</tr>";
                }
                $("#TbodyTrPage").html(myJsVal);

            }
        },
        error: function (xhr, errorTxt, status) {
            console.log("异步请求错误，errorTxt=" + errorTxt + " | status=" + status);
            return;
        }
    });
}

/**
 * 显隐礼品分类
 * */
function tglPresentGoodsTypeIsShow(pPresentTypeID, pIsShow) {


    //构造POST参数
    var dataPOST = {
        "Type": "2", "PresentTypeID": pPresentTypeID, "IsShow": pIsShow,
    };
    console.log(dataPOST);

    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: mAjaxUrl + "?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("显隐礼品分类=" + reTxt);
            if (reTxt != "") {
                var _jsonReTxt = JSON.parse(reTxt);

                if (_jsonReTxt.ErrMsg != "" && _jsonReTxt.ErrMsg != undefined && _jsonReTxt.ErrMsg != null) {
                    toastWin(_jsonReTxt.ErrMsg);
                    return;
                }

                if (_jsonReTxt.Msg != "" && _jsonReTxt.Msg != undefined && _jsonReTxt.Msg != null) {
                    toastWin(_jsonReTxt.Msg);
                    //加载所有礼品分类
                    loadPresentGoodsType();
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
 * 删除没有礼品的礼品分类
 * */
function delPresentGoodsTypeNoPresentMsg() {


    //构造POST参数
    var dataPOST = {
        "Type": "3",
    };
    console.log(dataPOST);

    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: mAjaxUrl + "?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("删除没有礼品的礼品分类=" + reTxt);
            if (reTxt != "") {
                var _jsonReTxt = JSON.parse(reTxt);

                if (_jsonReTxt.ErrMsg != "" && _jsonReTxt.ErrMsg != undefined && _jsonReTxt.ErrMsg != null) {
                    toastWin(_jsonReTxt.ErrMsg);
                    return;
                }

                if (_jsonReTxt.Msg != "" && _jsonReTxt.Msg != undefined && _jsonReTxt.Msg != null) {
                    toastWin(_jsonReTxt.Msg);
                    //加载所有礼品分类
                    loadPresentGoodsType();
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