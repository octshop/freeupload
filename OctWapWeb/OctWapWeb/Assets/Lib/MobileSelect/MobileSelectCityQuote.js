//==================城市滚动级联选择,只需要引用这个文件就可以使用的=======================//

//-----------文件夹路径名称----------//
var mJsPath = "../../../Assets/Lib/MobileSelect/";

//-----------完整的路径----------//
var mJsPathFull = "";
mJsPathFull += "<link href=\"" + mJsPath + "css/mobileSelect.css\" rel=\"stylesheet\" type=\"text/css\" />";
mJsPathFull += "<script src=\"" + mJsPath + "js/mobileSelect.js\" type=\"text/javascript\"></script>";
document.write(mJsPathFull);

/**---------------公共变量------------------**/

//构造城市选择器Data Json对象
var mJsonWheelsDataRegion = null;


/**
 * ---------------初始化---------------------
 */
$(function () {


    ////这里调用示例
    //initMobileSelectCityAll("MobileSelectCitySelRegion",function (reSelData) {

    //    console.log("选择了城市");
    //    console.log(reSelData);

    //    //$("#MobileSelectCitySelRegion").html("选择了城市");

    //},"430000_430400");

});

/**
 * ------页面调用初始化函数-----
 * @param pHtmlLabelID Html标签ID
 * @param {any} pCallBack 回调函数 返回 Data 选择的值
 * @param pDefaultIDArr  初始化拼接字符串 430000_430100  (湖南省_长沙市)
 */
function initMobileSelectCityAll(pHtmlLabelID,pCallBack, pDefaultIDArr = "") {


    //初始化省城市Json级联字符串
    initRegionCodeNameMobileSelect(function () {

        if (mJsonWheelsDataRegion != null && mJsonWheelsDataRegion != undefined) {

            //console.log(mJsonWheelsDataRegion);

            //初始化城市选择器
            initMobileSelectCitySelRegion(pHtmlLabelID,function (data) {

                pCallBack(data);

            }, pDefaultIDArr);

        }

    });

}

/**
 * 初始化城市选择器  “ 430000_430100 ^ 湖南省_长沙市 ”
 * @param pHtmlLabelID Html标签ID
 * @param pDefaultIDArr  初始化拼接字符串 430000_430100  (湖南省_长沙市)
 * */
function initMobileSelectCitySelRegion(pHtmlLabelID, pCallBack, pDefaultIDArr = "") {

    //得到默认初始化 位置数组值
    var _position = getDefaultPosition(pDefaultIDArr);

    var mobileSelectCitySel = new MobileSelect({
        trigger: '#' + pHtmlLabelID,
        title: '城市选择',
        position: _position,
        wheels: [
            {
                data: mJsonWheelsDataRegion,
            }
        ],
        transitionEnd: function (indexArr, data) {
            //console.log(data);
        },
        callback: function (indexArr, data) {
            //console.log(data);
            pCallBack(data);
        }
    });


    //var mobileSelect4 = new MobileSelect({
    //    trigger: '#MobileSelectCitySelRegion',
    //    title: '地区选择',
    //    wheels: [
    //        {
    //            data: [
    //                {
    //                    id: '1',
    //                    value: '附近',
    //                    childs: [
    //                        { id: '1', value: '1000米' },
    //                        { id: '2', value: '2000米' },
    //                        { id: '3', value: '3000米' },
    //                        { id: '4', value: '5000米' },
    //                        { id: '5', value: '10000米' }
    //                    ]
    //                },
    //                { id: '2', value: '上城区' },
    //                { id: '3', value: '下城区' },
    //                { id: '4', value: '江干区' },
    //                { id: '5', value: '拱墅区' },
    //                { id: '6', value: '西湖区' }
    //            ]
    //        }
    //    ],
    //    transitionEnd: function (indexArr, data) {
    //        //console.log(data);
    //    },
    //    callback: function (indexArr, data) {
    //        console.log(data);
    //    }
    //});


}


/**
 * 初始化省城市Json级联字符串
 * */
function initRegionCodeNameMobileSelect(pCallBack) {

    //构造POST参数
    var dataPOST = {
        "Type": "1",
    };
    console.log(dataPOST);
    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: "../../../MobileSelect/LoadMobileSelectJsonData?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            //console.log("初始化省城市Json级联字符串=" + reTxt);
            if (reTxt != "") {
                var _jsonReTxt = JSON.parse(reTxt);
                mJsonWheelsDataRegion = _jsonReTxt;
            }
            //回调函数
            pCallBack();
        }
    });
}

/**
 * 得到默认初始化 位置数组值
 * @param {any} pDefaultIDArr 省，城市的代号拼接   “430000_430100”    --- 湖南省_长沙市
 */
function getDefaultPosition(pDefaultIDArr = "") {

    var _positionStart = 0;
    var _positionEnd = 0;

    if (pDefaultIDArr != "" && pDefaultIDArr != null) {


        var _defaultIDArr = pDefaultIDArr.split("_");
        //循环查找相应的位置
        for (var i = 0; i < mJsonWheelsDataRegion.length; i++) {
            if (mJsonWheelsDataRegion[i].id == _defaultIDArr[0]) {

                _positionStart = i;

                //循环子位置
                for (var j = 0; j < mJsonWheelsDataRegion[i].childs.length; j++) {

                    var _child = mJsonWheelsDataRegion[i].childs[j];

                    if (_child.id == _defaultIDArr[1]) {

                        _positionEnd = j;
                        break;
                    }
                }
                break;
            }
        }

    }

    return [_positionStart, _positionEnd];
}

/**
 * 去掉前后的指定字符 如“|”
 * @param {any} pStringChar 字符串数组
 * @param {any} pRemoveChar 要移除的字符
 */
function removeFrontAndBackCharMobileSelect(pStringChar, pRemoveChar) {

    //console.log("前：pStringChar=" + pStringChar + " ___ pRemoveChar=" + pRemoveChar);

    var _processChar = pStringChar;

    //移除最后一个指定字符 
    if (pStringChar.lastIndexOf(pRemoveChar) == pStringChar.length - 1) {
        _processChar = pStringChar.substring(0, pStringChar.lastIndexOf(pRemoveChar));
    }
    //移除前面一个指定字符
    if (pStringChar.indexOf(pRemoveChar) == 0) {
        _processChar = _processChar.substring(1);
    }

    //console.log("后：_processChar=" + _processChar);

    //返回处理后的字符串
    return _processChar;
}
