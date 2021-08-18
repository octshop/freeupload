//===================秒杀商品分类============================//


/**-----定义公共变量------**/
//AjaxURL
var mAjaxUrl = "../UserGoodsShop/SecKillGoodsType";

/**------初始化------**/

$(function () {

    //加载所有秒杀商品分类
    loadSecKillGoodsType();


    //搜索按钮单击事件
    $("#btnSearch").click(function () {

        //加载所有秒杀商品分类
        loadSecKillGoodsType();
    });

});


/**
 * 加载所有秒杀商品分类
 * */
function loadSecKillGoodsType() {

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
            console.log("加载所有秒杀商品分类=" + reTxt);
            if (reTxt != "") {
                var _jsonReTxt = JSON.parse(reTxt);

                var SecKillGoodsTypeList = _jsonReTxt.SecKillGoodsTypeList;
                var ExtraDataList = _jsonReTxt.ExtraDataList;

                var myJsVal = "";
                for (var i = 0; i < SecKillGoodsTypeList.length; i++) {

                    var _IsEntity = "否";
                    if (SecKillGoodsTypeList[i].IsEntity == "true") {
                        _IsEntity = "是";
                    }

                    var _IsShow = "显示";
                    if (SecKillGoodsTypeList[i].IsShow == "false") {
                        _IsShow = "隐藏";
                    }

                    var _IsLock = "否";
                    if (SecKillGoodsTypeList[i].IsLock == "true") {
                        _IsLock = "是";
                    }

                    var _IsHasSkGoodsMsg = "";
                    if (ExtraDataList[i].IsHasSkGoodsMsg == "false") {
                        _IsHasSkGoodsMsg = "<font color=\"red\">无秒杀商品</font>"
                    }
                    //console.log(ExtraDataList[i].IsHasSkGoodsMsg);

                    myJsVal += " <tr>";
                    myJsVal += " <td>" + SecKillGoodsTypeList[i].SkTypeID + "</td>";
                    myJsVal += " <td>" + SecKillGoodsTypeList[i].GoodsTypeID + "<br />" + _IsHasSkGoodsMsg + "</td>";
                    myJsVal += " <td>" + SecKillGoodsTypeList[i].GoodsTypeName + "</td>";
                    myJsVal += " <td>" + _IsEntity + "</td>";
                    myJsVal += " <td>";
                    myJsVal += "   " + _IsShow + "";
                    myJsVal += " </td>";
                    myJsVal += " <td>" + _IsLock + "</td>";
                    myJsVal += " <td>" + SecKillGoodsTypeList[i].WriteDate + "</td>";
                    myJsVal += " <td>";

                    if (SecKillGoodsTypeList[i].IsShow == "false") {
                        myJsVal += "<button class=\"table-btn am-btn am-btn-default am-btn-xs am-text-secondary am-round\" onclick=\"toggleSkGoodsTypeIsShow('" + SecKillGoodsTypeList[i].SkTypeID + "', 'true')\">显示</button>";
                    }
                    else {
                        myJsVal += "<button class=\"table-btn am-btn am-btn-default am-btn-xs am-text-secondary am-round\" onclick=\"toggleSkGoodsTypeIsShow('" + SecKillGoodsTypeList[i].SkTypeID + "', 'false')\">隐藏</button>";
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
 * 显隐秒杀商品分类
 * */
function toggleSkGoodsTypeIsShow(pSkTypeID, pIsShow) {


    //构造POST参数
    var dataPOST = {
        "Type": "2", "SkTypeID": pSkTypeID, "IsShow": pIsShow,
    };
    console.log(dataPOST);

    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: mAjaxUrl + "?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("加载所有秒杀商品分类=" + reTxt);
            if (reTxt != "") {
                var _jsonReTxt = JSON.parse(reTxt);

                if (_jsonReTxt.ErrMsg != "" && _jsonReTxt.ErrMsg != undefined && _jsonReTxt.ErrMsg != null) {
                    toastWin(_jsonReTxt.ErrMsg);
                    return;
                }

                if (_jsonReTxt.Msg != "" && _jsonReTxt.Msg != undefined && _jsonReTxt.Msg != null) {
                    toastWin(_jsonReTxt.Msg);
                    //重新加载数据
                    loadSecKillGoodsType();
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
 * 删除没有秒杀商品的  秒杀商品分类
 * */
function delSecKillGoodsTypeNoSkGoods() {


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
            console.log(" 删除没有秒杀商品的  秒杀商品分类=" + reTxt);
            if (reTxt != "") {
                var _jsonReTxt = JSON.parse(reTxt);

                if (_jsonReTxt.ErrMsg != "" && _jsonReTxt.ErrMsg != undefined && _jsonReTxt.ErrMsg != null) {
                    toastWin(_jsonReTxt.ErrMsg);
                    return;
                }

                if (_jsonReTxt.Msg != "" && _jsonReTxt.Msg != undefined && _jsonReTxt.Msg != null) {
                    toastWin(_jsonReTxt.Msg);
                    //重新加载数据
                    loadSecKillGoodsType();
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