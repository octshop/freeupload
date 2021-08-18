//===================拼团商品分类============================//


/**-----定义公共变量------**/
//AjaxURL
var mAjaxUrl = "../UserGoodsShop/GroupGoodsType";

/**------初始化------**/

$(function () {

    //加载所有拼团商品分类
    loadGroupGoodsType();


    //搜索按钮单击事件
    $("#btnSearch").click(function () {

        //加载所有拼团商品分类
        loadGroupGoodsType();
    });

});


/**
 * 加载所有拼团商品分类
 * */
function loadGroupGoodsType() {

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
            console.log("加载所有拼团商品分类=" + reTxt);
            if (reTxt != "") {
                var _jsonReTxt = JSON.parse(reTxt);

                var GroupGoodsTypeList = _jsonReTxt.GroupGoodsTypeList;
                var ExtraDataList = _jsonReTxt.ExtraDataList;

                var myJsVal = "";
                for (var i = 0; i < GroupGoodsTypeList.length; i++) {

                    var _IsEntity = "否";
                    if (GroupGoodsTypeList[i].IsEntity == "true") {
                        _IsEntity = "是";
                    }

                    var _IsShow = "显示";
                    if (GroupGoodsTypeList[i].IsShow == "false") {
                        _IsShow = "隐藏";
                    }

                    var _IsLock = "否";
                    if (GroupGoodsTypeList[i].IsLock == "true") {
                        _IsLock = "是";
                    }

                    var _IsHasGroupGoods = "";
                    if (ExtraDataList[i].IsHasGroupGoods == "false") {
                        _IsHasGroupGoods = "<font color=\"red\">无拼团商品</font>"
                    }
                    //console.log(ExtraDataList[i].IsHasSkGoodsMsg);

                    myJsVal += " <tr>";
                    myJsVal += " <td>" + GroupGoodsTypeList[i].GroupTypeID + "</td>";
                    myJsVal += " <td>" + GroupGoodsTypeList[i].GoodsTypeID + "<br />" + _IsHasGroupGoods + "</td>";
                    myJsVal += " <td>" + GroupGoodsTypeList[i].GoodsTypeName + "</td>";
                    myJsVal += " <td>" + _IsEntity + "</td>";
                    myJsVal += " <td>";
                    myJsVal += "   " + _IsShow + "";
                    myJsVal += " </td>";
                    myJsVal += " <td>" + _IsLock + "</td>";
                    myJsVal += " <td>" + GroupGoodsTypeList[i].WriteDate + "</td>";
                    myJsVal += " <td>";

                    if (GroupGoodsTypeList[i].IsShow == "false") {
                        myJsVal += "<button class=\"table-btn am-btn am-btn-default am-btn-xs am-text-secondary am-round\" onclick=\"toggleGroupGoodsTypeIsShow('" + GroupGoodsTypeList[i].GroupTypeID + "', 'true')\">显示</button>";
                    }
                    else {
                        myJsVal += "<button class=\"table-btn am-btn am-btn-default am-btn-xs am-text-secondary am-round\" onclick=\"toggleGroupGoodsTypeIsShow('" + GroupGoodsTypeList[i].GroupTypeID + "', 'false')\">隐藏</button>";
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
 * 显隐拼团商品分类
 * */
function toggleGroupGoodsTypeIsShow(pGroupTypeID, pIsShow) {


    //构造POST参数
    var dataPOST = {
        "Type": "2", "GroupTypeID": pGroupTypeID, "IsShow": pIsShow,
    };
    console.log(dataPOST);

    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: mAjaxUrl + "?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("显隐拼团商品分类=" + reTxt);
            if (reTxt != "") {
                var _jsonReTxt = JSON.parse(reTxt);

                if (_jsonReTxt.ErrMsg != "" && _jsonReTxt.ErrMsg != undefined && _jsonReTxt.ErrMsg != null) {
                    toastWin(_jsonReTxt.ErrMsg);
                    return;
                }

                if (_jsonReTxt.Msg != "" && _jsonReTxt.Msg != undefined && _jsonReTxt.Msg != null) {
                    toastWin(_jsonReTxt.Msg);
                    //重新加载数据
                    loadGroupGoodsType();
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
 * 删除没有拼团商品的  拼团商品分类
 * */
function delGroupGoodsTypeNoSkGoods() {


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
            console.log("删除没有拼团商品的  拼团商品分类=" + reTxt);
            if (reTxt != "") {
                var _jsonReTxt = JSON.parse(reTxt);

                if (_jsonReTxt.ErrMsg != "" && _jsonReTxt.ErrMsg != undefined && _jsonReTxt.ErrMsg != null) {
                    toastWin(_jsonReTxt.ErrMsg);
                    return;
                }

                if (_jsonReTxt.Msg != "" && _jsonReTxt.Msg != undefined && _jsonReTxt.Msg != null) {
                    toastWin(_jsonReTxt.Msg);
                    //重新加载数据
                    loadGroupGoodsType();
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