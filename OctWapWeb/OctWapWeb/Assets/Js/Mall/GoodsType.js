//================商城商品类目=======================//

/**------定义公共变量----**/
var mAjaxUrl = "../MallAjax/GoodsType";

/**------初始化------**/
$(function () {

    //设置中间区别高度
    setContentHeightAuto();

    //加载第二级商品类目,主要用于手机端(分类显示页) 并SortNum排序
    loadGoodsTypeSecLevel();

});


/**------自定义函数----**/

/**
 * 设置中间区别高度
 * */
function setContentHeightAuto() {

    var _windowHeight = $(window).height();
    $("#TypeListLeft").height(_windowHeight - 110);
    $("#TypeListRight").height(_windowHeight - 110);

}

/**
 * 加载第二级商品类目,主要用于手机端(分类显示页) 并SortNum排序
 * @param pIsEntity 是否实体店分类(false /true )
 * */
function loadGoodsTypeSecLevel(pIsEntity = "") {
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
            console.log("加载第二级商品类目=" + reTxt);
            if (reTxt != "") {
                var _jsonReTxt = JSON.parse(reTxt);

                var GooGoodsTypeSecLevelList = _jsonReTxt.GooGoodsTypeSecLevelList;

                //循环构造显示代码
                var myJsVal = "";
                for (var i = 0; i < GooGoodsTypeSecLevelList.length; i++) {

                    var _classCurrent = "";
                    if (i == 0) {
                        _classCurrent = "class=\"goods-type-current\"";

                    }
                    else {
                        _classCurrent = "";
                    }

                    myJsVal += " <li name=\"GoodsTypeItem\" " + _classCurrent + " onclick=\"loadGoodsTypeThirdLevelBySec('" + GooGoodsTypeSecLevelList[i].GoodsTypeID + "')\">" + GooGoodsTypeSecLevelList[i].GoodsTypeName + "</li>";

                }
                $("#TypeListUl").html(myJsVal);

                //加载第一个二级菜单的第三级菜单 
                loadGoodsTypeThirdLevelBySec(GooGoodsTypeSecLevelList[0].GoodsTypeID, "true");

            }
        }
    });
}

/**
 * 加载第三级商品类目,根据第二级类目ID
 * @param {any} pGoodsTypeIDSec 第二级类目ID
 * @param pIsInit 是否为初始化
 */
function loadGoodsTypeThirdLevelBySec(pGoodsTypeIDSec, pIsInit = "false") {

    if (pIsInit == "false") {
        $("li[name='GoodsTypeItem']").removeClass("goods-type-current");
        $(event.currentTarget).addClass("goods-type-current");
    }

    //构造POST参数
    var dataPOST = {
        "Type": "2", "GoodsTypeIDSec": pGoodsTypeIDSec,
    };
    console.log(dataPOST);
    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: mAjaxUrl + "?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("加载第三级商品类目,根据第二级类目ID=" + reTxt);
            if (reTxt != "") {
                var _jsonReTxt = JSON.parse(reTxt);

                var GooGoodsTypeThirdLevelList = _jsonReTxt.GooGoodsTypeThirdLevelList;

                //构造显示代码
                var myJsVal = "";
                for (var i = 0; i < GooGoodsTypeThirdLevelList.length; i++) {

                    if (GooGoodsTypeThirdLevelList[i].GoodsTypeName.length > 12) {
                        GooGoodsTypeThirdLevelList[i].GoodsTypeName = GooGoodsTypeThirdLevelList[i].GoodsTypeName.substring(0, 12);
                    }

                    if (GooGoodsTypeThirdLevelList[i].IsEntity == "true") {
                        myJsVal += "<a href=\"../O2o/GoodsType?GTID=" + GooGoodsTypeThirdLevelList[i].GoodsTypeID + "\">";
                    }
                    else {
                        myJsVal += "<a href=\"../Mall/GoodsTypeListDetail?GTID=" + GooGoodsTypeThirdLevelList[i].GoodsTypeID + "\">";
                    }
                    myJsVal += "<img src=\"//" + GooGoodsTypeThirdLevelList[i].TypeIcon + "\" /><br />";
                    myJsVal += "" + GooGoodsTypeThirdLevelList[i].GoodsTypeName + "";
                    myJsVal += "</a>";
                }
                //显示代码插入前台
                $("#TypeListRight").html(myJsVal);


            }
            else {
                //显示代码插入前台
                $("#TypeListRight").html("");
            }
        }
    });


}

/**
 * 切换到加载实体店分类
 * */
function chgTab(pTabNum) {

    $(".tab-nav-item").removeClass("tab-nav-current");
    $(event.currentTarget).addClass("tab-nav-current");

    if (pTabNum == "1") {
        loadGoodsTypeSecLevel("");

        $("#TabNavSearch").on("click", function () {
            window.location.href = '../Mall/SearchGoods';
        });

    }
    else {
        loadGoodsTypeSecLevel("true");

        $("#TabNavSearch").on("click", function () {
            window.location.href = '../Mall/SearchGoods?ST=Entity';
        });
    }
}