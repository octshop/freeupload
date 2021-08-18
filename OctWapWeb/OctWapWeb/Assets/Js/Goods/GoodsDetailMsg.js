//================商品描述===========================//

/**
 * ------公共变量 ------
 */
var mAjaxUrl = "../GoodsAjax/GoodsDetailMsg";

//信息ID，商品ID
var mGoodsID = "";

/**
 * ------初始化 ------
 */
$(function () {

    mGoodsID = $("#hidGoodsID").val().trim();

    //加载商品描述规格参数包装售后
    loadGoodsDescPropPackAfterSale();

});


/**
* ------函数定义 ------
*/

/**
 * 切换选项卡
 * @param {any} pTabNum 选项卡Number
 */
function chgTab(pTabNum) {

    //删除所有当前class
    $(".oct-header-sub-a").removeClass("oct-header-sub-curren-a");
    //隐藏所有选项卡内容
    $(".goods-desc").hide();
    $(".spec-content").hide();
    $(".package-aftersale").hide();

    //设置当前选项卡样式
    $(".oct-header-sub-a-" + pTabNum + "").addClass("oct-header-sub-curren-a");

    if (pTabNum == "1") //商品介绍
    {
        $(".goods-desc").show();
    }
    else if (pTabNum == "2")//规格参数
    {
        $(".spec-content").show();
    }
    else if (pTabNum == "3") //包装售后
    {
        $(".package-aftersale").show();
    }

}

/**
 * 加载商品描述规格参数包装售后
 * */
function loadGoodsDescPropPackAfterSale() {

    //构造POST参数
    var dataPOST = {
        "Type": "1", "GoodsID": mGoodsID,
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

                //显示信息
                $("#GoodsDescDiv").html(_jsonReTxt.GoodsDesc);
                $("#PackageAfterSale").html(_jsonReTxt.PackAfterSaleDesc);
                var _showXhtml = showGoodsTypeProp(_jsonReTxt.GoodsTypeNeedProp, _jsonReTxt.GoodsTypeCustomProp);
                $("#SpecContentDiv").html(_showXhtml);

            }
        }
    });
}

/**
 * 显示规格参数代码
 * @param {any} pGoodsTypeNeedProp 商品必填属性（属性名_属性值^属性名_属性值）
 * @param {any} pGoodsTypeCustomProp 商品自定义属性（ 属性名|属性值 ^ 属性名|属性值 ）
 */
function showGoodsTypeProp(pGoodsTypeNeedProp, pGoodsTypeCustomProp) {

    var _goodsTypeNeedPropArr = pGoodsTypeNeedProp.split("^");
    //构造显示代码
    var _xhtml = "<table>";
    for (var i = 0; i < _goodsTypeNeedPropArr.length; i++) {
        var _needPropArr = _goodsTypeNeedPropArr[i].split("_");

        if (_needPropArr[0] == undefined || _needPropArr[1] == undefined) {
            continue;
        }

        _xhtml += " <tr>";        _xhtml += "  <td>" + _needPropArr[0] + "</td>";        _xhtml += "  <td class=\"prop-value\">" + _needPropArr[1] + "</td>";        _xhtml += "</tr>";    }

    if (pGoodsTypeCustomProp != "" && pGoodsTypeCustomProp != undefined && pGoodsTypeCustomProp != null) {
        var _goodsTypeCustomPropArr = pGoodsTypeCustomProp.split("^");
        for (var j = 0; j < _goodsTypeCustomPropArr.length; j++) {
            var _customPropArr = _goodsTypeCustomPropArr[j].split("|");

            if (_customPropArr[0] == undefined || _customPropArr[1] == undefined) {
                continue;
            }

            _xhtml += " <tr>";            _xhtml += "  <td>" + _customPropArr[0] + "</td>";            _xhtml += "  <td class=\"prop-value\">" + _customPropArr[1] + "</td>";            _xhtml += "</tr>";
        }
    }

    _xhtml += "</table>";

    //返回显示代码
    return _xhtml;


}