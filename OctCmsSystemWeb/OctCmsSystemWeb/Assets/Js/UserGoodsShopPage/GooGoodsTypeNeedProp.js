//================商品类目必填属性========================//

/**-----定义公共变量------**/

//AjaxURL
var mAjaxUrl = "../UserGoodsShop/GooGoodsTypeNeedProp";

/******数据分页的变量********/

//信息ID
var mMsgID = "0";

//添加参数的Item值
var mAddMsgID = "0";



/**------初始化------**/
$(function () {

    //加载子级类目列表
    loadGoodsTypeSub(0, "SelGoodsType_1");

    $("#SelGoodsType_1").on("change", function () {

        //初始化第二级下拉框
        initSecondTypeSelect();

    });



});


/**------自定义函数------**/

/**
 * 加载子级类目列表
 * @param {any} pFatherTypeID 父级类目ID
 * @param {any} pSelLabelID 下拉框ID
 */
function loadGoodsTypeSub(pFatherTypeID, pSelLabelID, pCallBack) {

    //判断是否有回调
    if (pCallBack == undefined || pCallBack == "") {
        pCallBack = function () { };
    }

    //获取级别数字
    var _levelNum = pSelLabelID.replace("SelGoodsType_", "");
    console.log(_levelNum);


    //构造POST参数
    var dataPOST = {
        "Type": "8", "FatherTypeID": pFatherTypeID
    };
    console.log(dataPOST);


    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: "../UserGoodsShop/GooGoodsType?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log(reTxt);
            if (reTxt != "") {
                var _jsonReTxt = JSON.parse(reTxt);
                //为Select赋值
                $("#" + pSelLabelID).empty();

                console.log("_levelNum=" + _levelNum);
                if (_levelNum == "1") {
                    $("#" + pSelLabelID).append("<option value=' '>选择第一级类目</option>");
                }
                else if (_levelNum == "2") {
                    $("#" + pSelLabelID).append("<option value=' '>选择第二级类目</option>");
                }
                else if (_levelNum == "3") {
                    $("#" + pSelLabelID).append("<option value=' '>选择第三级类目</option>");
                }

                for (var i = 0; i < _jsonReTxt.GoodsTypeSubList.length; i++) {
                    $("#" + pSelLabelID).append("<option value='" + _jsonReTxt.GoodsTypeSubList[i].GoodsTypeID + "'>" + _jsonReTxt.GoodsTypeSubList[i].GoodsTypeName + "</option>");
                }

                //回调函数
                pCallBack();
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
 * 初始化第二级下拉框
 */
function initSecondTypeSelect() {

    //获取第一级菜单值
    var _firstSelectVal = $("#SelGoodsType_1").val().trim();
    console.log("第一级值：" + _firstSelectVal);


    //设置二三级为空
    $("#SelGoodsType_2").empty();
    $("#SelGoodsType_2").append("<option value=' '>选择第二级类目</option>");
    $("#SelGoodsType_3").empty();
    $("#SelGoodsType_3").append("<option value=' '>选择第三级类目</option>");

    if (_firstSelectVal == "") {
        console.log("第一级为空！");
        return;
    }

    loadGoodsTypeSub(_firstSelectVal, "SelGoodsType_2", function () {

        $("#SelGoodsType_2").on("change", function () {

            //获取第二级菜单值
            var _secondSelectVal = $("#SelGoodsType_2").val().trim();
            console.log("第二级值：" + _firstSelectVal);

            if (_secondSelectVal == "") {
                //设置三级为空
                $("#SelGoodsType_3").empty();
                $("#SelGoodsType_3").append("<option value=' '>选择第三级类目</option>");
                return;
            }

            //初始化第三级下拉框
            loadGoodsTypeSub(_secondSelectVal, "SelGoodsType_3");

        });
    });
}

//--------------------添加参数表单列表-------------------//

/**
 * 加载参数
 */
function loadGoodTypeParam() {

    //获取第三级类目下拉框值
    var SelGoodsType_3 = $("#SelGoodsType_3").val().trim();
    if (SelGoodsType_3 == "") {
        toastWin("请选择第三级类目！");
        return;
    }

    //记录当前加载的类目ID
    $("#hidGoodsTypeID").val(SelGoodsType_3);

    //构造POST参数
    var dataPOST = {
        "Type": "3", "GoodsTypeID": SelGoodsType_3
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

                var _xhtml = xhtmlShow(_jsonReTxt);                $("#AddPropUL").html(_xhtml);
            }
            else {
                var _xhtml = "<li class=\"empty-msg-li\" style=\"color:red\">… 无类目参数,请添加 …</li>";
                $("#AddPropUL").html(_xhtml);
            }
            $("#GoodsPropBtn").show();
        },
        error: function (xhr, errorTxt, status) {
            console.log("异步请求错误，errorTxt=" + errorTxt + " | status=" + status);
            //alert("异步请求错误，errorTxt=" + errorTxt + " | status=" + status);
            return;
        }
    });
}

/**
 * 构造显示代码
 * @param {any} pJsonReTxt 返回的Json对象
 */
function xhtmlShow(pJsonReTxt) {

    //Json对象
    var _jsonReTxtArr = pJsonReTxt.NeedPropArr;

    //构造显示代码
    var myJsVal = "";
    for (var i = 0; i < _jsonReTxtArr.length; i++) {

        //是否显示TextArea
        var _isShowTextArea = "none";        //展示类型Select赋值        var _isSelectTextArea = "";        if (_jsonReTxtArr[i].InputType == "select") {
            _isShowTextArea = "normal";            _isSelectTextArea = "selected";
        }

        myJsVal += "<li  id=\"GoodsTypeNeedPropLi_" + _jsonReTxtArr[i].GtPropID + "\">";        myJsVal += "<input type=\"hidden\" id=\"HidGtPropIDVal_" + _jsonReTxtArr[i].GtPropID + "\" value=\"" + _jsonReTxtArr[i].GtPropID + "\" />";        myJsVal += "    <div class=\"add-prop-form\">";        myJsVal += "        <div>";        myJsVal += "            展示类型:";        myJsVal += "            <select id=\"InputTypeSel_" + _jsonReTxtArr[i].GtPropID + "\" onchange=\"showTxtAreaPropValue(" + _jsonReTxtArr[i].GtPropID + ")\">";        myJsVal += "                <option value=\"text\">文本框</option>";        myJsVal += "                <option value=\"select\" " + _isSelectTextArea + ">下拉列表</option>";        myJsVal += "            </select>";        myJsVal += "        </div>";        myJsVal += "        <div>";        myJsVal += "            参数名称:";        myJsVal += "            <input id=\"PropNameTxt_" + _jsonReTxtArr[i].GtPropID + "\" type=\"text\" placeholder=\"如:腰型\" value=\"" + _jsonReTxtArr[i].PropName + "\" />";        myJsVal += "        </div>";        myJsVal += "    </div>";        myJsVal += "    <div class=\"add-prop-val\" id=\"AddPropVal_" + _jsonReTxtArr[i].GtPropID + "\" style=\"display:" + _isShowTextArea + "\">";        myJsVal += "        参数值:";        myJsVal += "        <textarea id=\"PropValue_" + _jsonReTxtArr[i].GtPropID + "\" placeholder=\"如:高腰^低腰^松紧腰^宽松腰^调节腰\" class=\"prop-val-areatxt\">" + _jsonReTxtArr[i].PropValue + "</textarea>";        myJsVal += "        <span class=\"span-hint-red\">多个选择值用“ ^ ”字符隔开</span>";        myJsVal += "    </div>";        myJsVal += "    <div class=\"add-prop-btn\">";        myJsVal += "        <input type=\"button\" class=\"am-btn am-btn-danger am-btn-xs\" id=\"BtnSave_" + _jsonReTxtArr[i].GtPropID + "\" onclick=\"saveGoodsTypeNeedProp(" + _jsonReTxtArr[i].GtPropID + ")\" value=\"保存\" />";        myJsVal += "        <input type=\"button\" class=\"am-btn am-btn-default am-btn-xs\" value=\"删除\" onclick=\"delGoodsTypeNeedProp(" + _jsonReTxtArr[i].GtPropID + ")\" />";        myJsVal += "    </div>";        myJsVal += "</li>";
    }

    //添加参数的Item值
    if (_jsonReTxtArr.length > 0) {
        mAddMsgID = _jsonReTxtArr[_jsonReTxtArr.length - 1].GtPropID;
        console.log("mAddMsgID=" + mAddMsgID);
    }

    //返回显示代码
    return myJsVal;
}

/**
 * 根据展示类型 显隐 TextArea
 * @param {any} pGtPropID 必填属性ID
 */
function showTxtAreaPropValue(pGtPropID) {
    var _inputTypeSelVal = $("#InputTypeSel_" + pGtPropID).val().trim();
    if (_inputTypeSelVal == "select") {
        $("#AddPropVal_" + pGtPropID).show();

        console.log("显示");
    }
    else {
        $("#AddPropVal_" + pGtPropID).hide();

        console.log("隐藏");
    }
}


/**
 * 添加参数列表项
 */
function addGoodsTypeNeedPropItem() {

    //添加参数的Item值 加1
    mAddMsgID = parseInt(mAddMsgID) + 1;
    console.log("添加参数列表项mAddMsgID=" + mAddMsgID);

    var myJsVal = "<li id=\"GoodsTypeNeedPropLi_" + mAddMsgID + "\">";    myJsVal += "<input type=\"hidden\" id=\"HidGtPropIDVal_" + mAddMsgID + "\" value=\"\" />";    myJsVal += "    <div class=\"add-prop-form\">";    myJsVal += "        <div>";    myJsVal += "            展示类型:";    myJsVal += "            <select id=\"InputTypeSel_" + mAddMsgID + "\" onchange=\"showTxtAreaPropValue(" + mAddMsgID + ")\">";    myJsVal += "                <option value=\"text\">文本框</option>";    myJsVal += "                <option value=\"select\">下拉列表</option>";    myJsVal += "            </select>";    myJsVal += "        </div>";    myJsVal += "        <div>";    myJsVal += "            参数名称:";    myJsVal += "            <input id=\"PropNameTxt_" + mAddMsgID + "\" type=\"text\" placeholder=\"如:腰型\" value=\"\" />";    myJsVal += "        </div>";    myJsVal += "    </div>";    myJsVal += "    <div class=\"add-prop-val\" id=\"AddPropVal_" + mAddMsgID + "\" style=\"display:none\">";    myJsVal += "        参数值:";    myJsVal += "        <textarea id=\"PropValue_" + mAddMsgID + "\" placeholder=\"如:高腰^低腰^松紧腰^宽松腰^调节腰\" class=\"prop-val-areatxt\"></textarea>";    myJsVal += "        <span class=\"span-hint-red\">多个选择值用“ ^ ”字符隔开</span>";    myJsVal += "    </div>";    myJsVal += "    <div class=\"add-prop-btn\">";    myJsVal += "        <input type=\"button\" class=\"am-btn am-btn-danger am-btn-xs\" id=\"BtnSave_" + mAddMsgID + "\" onclick=\"saveGoodsTypeNeedProp(" + mAddMsgID + ")\" value=\"保存\" />";    myJsVal += "        <input type=\"button\" class=\"am-btn am-btn-default am-btn-xs\" value=\"删除\" onclick=\"delGoodsTypeNeedProp(" + mAddMsgID + ")\" />";    myJsVal += "    </div>";    myJsVal += "</li>";

    $(".empty-msg-li").remove();
    //插入显示代码
    $("#AddPropUL").append(myJsVal);
}

/**
 * 保存端口必填属性
 * @param {any} pGtPropID 必填属性ID 或新增item的ID
 */
function saveGoodsTypeNeedProp(pGtPropIDAddID) {

    //获取当前的必填属性ID
    var GtPropID = $("#HidGtPropIDVal_" + pGtPropIDAddID).val().trim();

    //获取表单内容
    var GoodsTypeID = $("#hidGoodsTypeID").val().trim();
    var InputType = $("#InputTypeSel_" + pGtPropIDAddID).val().trim();
    var PropName = $("#PropNameTxt_" + pGtPropIDAddID).val().trim();
    var PropValue = $("#PropValue_" + pGtPropIDAddID).val().trim();


    //构造POST参数
    var dataPOST = {
        "Type": "2", "GtPropID": GtPropID, "GoodsTypeID": GoodsTypeID,
        "PropName": PropName, "PropValue": PropValue, "InputType": InputType,
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
                }
                else {
                    toastWin(_jsonReTxt.ErrMsg);
                }
                //如果是添加
                if (_jsonReTxt.Code == "AGGTNP_01") {
                    $("#HidGtPropIDVal_" + pGtPropIDAddID).val(_jsonReTxt.DataDic.GtPropID);

                    console.log("HidGtPropIDVal_" + pGtPropIDAddID + "=" + $("#HidGtPropIDVal_" + pGtPropIDAddID).val());
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
 * 保存端口必填属性
 * @param {any} pGtPropID 必填属性ID 或新增item的ID
 */
function delGoodsTypeNeedProp(pGtPropIDAddID) {

    //获取当前的必填属性ID
    var GtPropID = $("#HidGtPropIDVal_" + pGtPropIDAddID).val().trim();

    //如果是增加的则直接删除
    if (GtPropID == "" || GtPropID == "0") {
        $("#GoodsTypeNeedPropLi_" + pGtPropIDAddID).remove();
        return;
    }

    confirmWinCCb("删除提示", function () {



        //构造POST参数
        var dataGET = {
            "Type": "4", "GtPropIDArr": GtPropID
        };
        console.log(dataGET);


        //正式发送异步请求
        $.ajax({
            type: "GET",
            url: mAjaxUrl + "?rnd=" + Math.random(),
            data: dataGET,
            dataType: "html",
            success: function (reTxt, status, xhr) {
                console.log(reTxt);
                if (reTxt != "") {
                    var _jsonReTxt = JSON.parse(reTxt);
                    if (_jsonReTxt.Code != "") {
                        toastWin(_jsonReTxt.Msg);
                    }
                    else {
                        toastWin(_jsonReTxt.ErrMsg);
                    }
                    //删除成功
                    if (_jsonReTxt.Code == "DGGTNPA_01") {
                        $("#GoodsTypeNeedPropLi_" + pGtPropIDAddID).remove();
                    }

                }
            },
            error: function (xhr, errorTxt, status) {
                console.log("异步请求错误，errorTxt=" + errorTxt + " | status=" + status);
                //alert("异步请求错误，errorTxt=" + errorTxt + " | status=" + status);
                return;
            }
        });



    }, function () {

    }, 500);

}