//================运费模板参数列表设置========================//

/**-----定义公共变量------**/

//AjaxURL
var mAjaxUrl = "../Shop/FreightTemplateParamList";

//信息ID
var mMsgID = "0";

//华东 选择的区域范围拼接字符串 用"^"隔开
var mRegionArr_hd = "";
//华北
var mRegionArr_hb = "";
//华中
var mRegionArr_hz = "";
//华南
var mRegionArr_hn = "";
//东北
var mRegionArr_db = "";
//西北
var mRegionArr_xb = "";
//西南
var mRegionArr_xn = "";
//港澳台
var mRegionArr_gat = "";

//各地区名称
var mRegionNameArr = ["hd", "hb", "hz", "hn", "db", "xb", "xn", "gat"];

//总的已选择的地址区域拼接字符串 [500000 ^ 510000 ^ 2324324 ~ 500000 ^ 510000 ^ 2324324]
var mSelRegionArr = "";

//选择地区窗口显示代码
var mSelRegionWinHtml = "";

/**------初始化------**/
$(function () {

    //初始化添加窗口显示代码
    initSelRegionWinHtml();

    //信息ID 模板ID
    mMsgID = $("#hidFtID").val().trim();

    //初始化运费模板参数
    initFreightTemplateParamList();

});


//*********************弹出窗口操作逻辑******************//

/**
 * 初始化运费模板参数
 * */
function initFreightTemplateParamList() {

    //构造POST参数
    var dataPOST = {
        "Type": "2", "FtID": mMsgID,
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

                //构造运费模板列表显示代码
                var _xhtml = xhtmlFreightTemplateParamList(_jsonReTxt);

                //显示代码插入前台
                $("#TbodyTrPage").html(_xhtml);
            }
        },
        error: function (xhr, errorTxt, status) {
            console.log("异步请求错误，errorTxt=" + errorTxt + " | status=" + status);
            return;
        }
    });
}

/**
 * 构造运费模板列表显示代码
 * @param {any} pJsonReTxt Json对象字符串
 */
function xhtmlFreightTemplateParamList(pJsonReTxt) {

    //console.log(pJsonReTxt);

    var _freightTemplateParamListArr = pJsonReTxt.FreightTemplateParamList;

    var _ftTitle = pJsonReTxt.FreightTemplate.FtTitle;
    $("#FtTitleSpan").html(_ftTitle);

    //循环构造显示代码
    var myJsVal = "";
    for (var i = 0; i < _freightTemplateParamListArr.length; i++) {

        //构造地区名称
        var _xhtmlSpan = ""
        var _regionNameArr = _freightTemplateParamListArr[i].RegionProNameArr.split("^");
        for (var j = 0; j < _regionNameArr.length; j++) {
            _xhtmlSpan += "<span>" + _regionNameArr[j] + "</span>";
        }

        myJsVal += "<tr id=\"tr_" + i + "\">";        myJsVal += " <td>";        myJsVal += "     <div class=\"province-list-div\">";        myJsVal += "         <input type=\"hidden\" id=\"hidRegionArr_" + i + "\" name=\"HidRegionArr\" value=\"" + _freightTemplateParamListArr[i].RegionProCodeArr + "\" />";        myJsVal += "         <div class=\"province-div\" id=\"ProvinceDiv_" + i + "\">" + _xhtmlSpan + "</div>           <b onclick=\"openSelRegionWin(" + i + ")\">编辑</b>";        myJsVal += "     </div>";        myJsVal += " </td>";        myJsVal += " <td><input type=\"number\" class=\"freight-txt\" name=\"FreightOne\" id=\"freightTxt_" + i + "\" value=\"" + _freightTemplateParamListArr[i].FreightMoney + "\" /></td>";        myJsVal += " <td> &nbsp; + &nbsp; <input type=\"number\" class=\"freight-txt\" id=\"freightTxtAdd_" + i + "\" name=\"FreightAdd\" value=\"" + _freightTemplateParamListArr[i].AddPieceMoney + "\" /></td>";        myJsVal += " <td>";        myJsVal += "     <button class=\"table-btn am-btn am-btn-default am-btn-xs am-text-danger  am-round\" onclick=\"removeFreightTemplateItem(" + i + ")\"><span class=\"am-icon-trash\"></span></button>";        myJsVal += " </td>";        myJsVal += "</tr>";    }

    //返回显示代码
    return myJsVal;
}



/**
 * 初始化添加窗口显示代码
 */
function initSelRegionWinHtml() {
    //获取窗口显示代码
    mSelRegionWinHtml = $("#SelRegionWin").html();
    $("#SelRegionWin").empty();

}

/**
 * 打开添加窗口
 * @param pCurrentItemIndex 当前项索引
 */
function openSelRegionWin(pCurrentItemIndex) {

    mMsgID = "0";

    //打开Dialog弹出窗口
    openDialogWinNoClose("选择地区", mSelRegionWinHtml, function () {

        //确定选择的地区值
        okSelRegion(pCurrentItemIndex);

        //关闭窗口
        closeDialogWin();

    }, function () {


    }, 600);

    //初始化 选择地区值 窗口
    initSelRegionValWin(pCurrentItemIndex)

}

/**
 * 确定选择的地区值
 * @param {any} pCurrentItemIndex 当前项索引
 */
function okSelRegion(pCurrentItemIndex) {

    //选择的地区值拼接字符串插入前台
    var _diffRegionSelValArr = getDiffRegionSelValArr(pCurrentItemIndex);

    //记录当前项选择的地区拼接字符串值
    $("#hidRegionArr_" + pCurrentItemIndex).val(_diffRegionSelValArr);

    //构造地区显示代码
    var _xhtml = xhtmlSelRegionSpan(_diffRegionSelValArr);
    $("#ProvinceDiv_" + pCurrentItemIndex).html(_xhtml);
}

/**
 * 构造已选择的地区显示代码
 * @param {any} pDiffRegionSelValArr 选择的地区拼接字符串
 */
function xhtmlSelRegionSpan(pDiffRegionSelValArr) {

    if (pDiffRegionSelValArr == "" || pDiffRegionSelValArr == undefined) {
        return "未添加地区";
    }

    console.log("pDiffRegionSelValArr=" + pDiffRegionSelValArr);

    var _xhtml = "";

    if (pDiffRegionSelValArr.indexOf("^") >= 0) {
        //分割字符串
        var _regionSelValArr = pDiffRegionSelValArr.split("^");
        for (var i = 0; i < _regionSelValArr.length; i++) {

            //获取省份名称
            var _provinceName = $(".cb_" + _regionSelValArr[i]).attr("data-province");
            console.log("_provinceName=" + _provinceName);

            _xhtml += "<span>" + _provinceName + "</span>";
        }
    }
    else {
        //获取省份名称
        var _provinceName = $(".cb_" + pDiffRegionSelValArr).attr("data-province");
        console.log("_provinceName=" + _provinceName);

        _xhtml += "<span>" + _provinceName + "</span>";
    }

    //返回显示代码
    return _xhtml;
}

/**
 * 得到选择地区窗口选中的值拼接字符串 用"^"隔开
 * @param {any} pCurrentItemIndex 当前项的索引
 */
function getDiffRegionSelValArr(pCurrentItemIndex) {

    mRegionArr_hd = "";
    mRegionArr_hb = "";
    mRegionArr_hz = "";
    mRegionArr_hn = "";
    mRegionArr_db = "";
    mRegionArr_xb = "";
    mRegionArr_xn = "";
    mRegionArr_gat = "";


    //循环获取各地区选择的拼接字符串 存储在全局变量中
    for (var i = 0; i < mRegionNameArr.length; i++) {
        getRegionSelValArr(mRegionNameArr[i]);
    }

    var _regionSelValArr = ""
    if (mRegionArr_hd != "") {
        _regionSelValArr += mRegionArr_hd
    }
    if (mRegionArr_hb != "") {
        _regionSelValArr += "^" + mRegionArr_hb;
    }
    if (mRegionArr_hz != "") {
        _regionSelValArr += "^" + mRegionArr_hz;
    }
    if (mRegionArr_hn != "") {
        _regionSelValArr += "^" + mRegionArr_hn;
    }
    if (mRegionArr_db != "") {
        _regionSelValArr += "^" + mRegionArr_db;
    }
    if (mRegionArr_xb != "") {
        _regionSelValArr += "^" + mRegionArr_xb;
    }
    if (mRegionArr_xn != "") {
        _regionSelValArr += "^" + mRegionArr_xn;
    }
    if (mRegionArr_gat != "") {
        _regionSelValArr += "^" + mRegionArr_gat;
    }
    //去掉前后的"^"
    _regionSelValArr = removeFrontAndBackChar(_regionSelValArr, "^");
    return _regionSelValArr;
}

/**
 * 获取各地区选择的拼接字符串 存储在全局变量中
 * @param {any} pGroupName 地区组名称
 */
function getRegionSelValArr(pGroupName) {

    //获取checkbox组
    var _groupCbNameArr = $("input[name='" + pGroupName + "']");
    //var _isCheck = $("#" + pGroupName + "").is(":checked");

    for (var i = 0; i < _groupCbNameArr.length; i++) {

        //判断是否选择了地区
        var _groupCbNameCheck = _groupCbNameArr[i].checked;
        //console.log("_groupCbNameCheck=" + _groupCbNameCheck);

        if (_groupCbNameCheck) {

            if (pGroupName == "hd") {
                mRegionArr_hd += "^" + _groupCbNameArr[i].id.replace(pGroupName + "_", "");
            }
            else if (pGroupName == "hb") {
                mRegionArr_hb += "^" + _groupCbNameArr[i].id.replace(pGroupName + "_", "");
            }
            else if (pGroupName == "hz") {
                mRegionArr_hz += "^" + _groupCbNameArr[i].id.replace(pGroupName + "_", "");
            }
            else if (pGroupName == "hn") {
                mRegionArr_hn += "^" + _groupCbNameArr[i].id.replace(pGroupName + "_", "");
            }
            else if (pGroupName == "db") {
                mRegionArr_db += "^" + _groupCbNameArr[i].id.replace(pGroupName + "_", "");
            }
            else if (pGroupName == "xb") {
                mRegionArr_xb += "^" + _groupCbNameArr[i].id.replace(pGroupName + "_", "");
            }
            else if (pGroupName == "xn") {
                mRegionArr_xn += "^" + _groupCbNameArr[i].id.replace(pGroupName + "_", "");
            }
            else if (pGroupName == "gat") {
                mRegionArr_gat += "^" + _groupCbNameArr[i].id.replace(pGroupName + "_", "");
            }

        }
    }
    //去掉前后的 "^"
    mRegionArr_hd = removeFrontAndBackChar(mRegionArr_hd, "^");
    mRegionArr_hb = removeFrontAndBackChar(mRegionArr_hb, "^");
    mRegionArr_hz = removeFrontAndBackChar(mRegionArr_hz, "^");
    mRegionArr_hn = removeFrontAndBackChar(mRegionArr_hn, "^");
    mRegionArr_db = removeFrontAndBackChar(mRegionArr_db, "^");
    mRegionArr_xb = removeFrontAndBackChar(mRegionArr_xb, "^");
    mRegionArr_xn = removeFrontAndBackChar(mRegionArr_xn, "^");
    mRegionArr_gat = removeFrontAndBackChar(mRegionArr_gat, "^");
    //console.log("mRegionArr_hd=" + mRegionArr_hd);
    //console.log("mRegionArr_hb=" + mRegionArr_hb);
    //console.log("mRegionArr_hz=" + mRegionArr_hz);
    //console.log("mRegionArr_hn=" + mRegionArr_hn);
    //console.log("mRegionArr_db=" + mRegionArr_db);
    //console.log("mRegionArr_xb=" + mRegionArr_xb);
    //console.log("mRegionArr_xn=" + mRegionArr_xn);
    //console.log("mRegionArr_gat=" + mRegionArr_gat);

}

/**
 * 初始化 选择地区值 窗口
 * @param {any} pCurrentItemIndex 当前项的索引
 */
function initSelRegionValWin(pCurrentItemIndex) {

    var _hidRegionArrByID = $("#hidRegionArr_" + pCurrentItemIndex).val();
    //分割字符串
    var _regionArr = _hidRegionArrByID.split("^");
    for (var i = 0; i < _regionArr.length; i++) {

        $(".cb_" + _regionArr[i]).prop("checked", true);

    }

    //隐藏其他项已选择的地区
    var _hidRegionArr = $("input[name='HidRegionArr']");
    for (var j = 0; j < _hidRegionArr.length; j++) {

        //如果是本项的则跳过
        if (_hidRegionArr[j].value == _hidRegionArrByID) {
            continue;
        }

        var _hidRegionValArr = _hidRegionArr[j].value.split("^");
        for (var k = 0; k < _hidRegionValArr.length; k++) {
            $(".div_" + _hidRegionValArr[k]).hide();
        }

    }
}

/**
 * 开关每组的CheckBox
 * @param pGroupName 地区组名 
 * */
function toggleCheckGroup(pGroupName) {

    //获取checkbox组
    var _groupCbNameArr = $("input[name='" + pGroupName + "']");
    console.log(_groupCbNameArr);
    var _isCheck = $("#" + pGroupName + "").is(":checked");

    for (var i = 0; i < _groupCbNameArr.length; i++) {
        if (_isCheck) {
            _groupCbNameArr[i].checked = true;
        }
        else {
            _groupCbNameArr[i].checked = false;
        }

        var _cbId = _groupCbNameArr[i].id;
        var _Div_cbID = "div" + _cbId.substring(_cbId.indexOf("_"));
        //console.log($("." + _Div_cbID).css("display"));

        if ($("." + _Div_cbID).css("display") == "none") {
            _groupCbNameArr[i].checked = false;
        }

    }
}

/**
 * 添加参数项
 * */
function addFreightTemplateItem() {

    //判断当前已有多少项了
    var _hidRegionArr = $("input[name='HidRegionArr']");
    //当前添加项的索引
    var addIndex = _hidRegionArr.length

    console.log("addIndex=" + addIndex);

    var myJsVal = "";    myJsVal += "<tr id=\"tr_" + addIndex + "\">";    myJsVal += " <td>";    myJsVal += "     <div class=\"province-list-div\">";    myJsVal += "         <input type=\"hidden\" id=\"hidRegionArr_" + addIndex + "\" name=\"HidRegionArr\" value=\"\" />";    myJsVal += "         <div class=\"province-div\" id=\"ProvinceDiv_" + addIndex + "\">未添加地区</div>           <b onclick=\"openSelRegionWin(" + addIndex + ")\">编辑</b>";    myJsVal += "     </div>";    myJsVal += " </td>";    myJsVal += " <td><input type=\"number\" class=\"freight-txt\" name=\"FreightOne\" id=\"freightTxt_" + addIndex + "\" value=\"0.00\" /></td>";    myJsVal += " <td> &nbsp; + &nbsp; <input type=\"number\" class=\"freight-txt\" id=\"freightTxtAdd_" + addIndex + "\" name=\"FreightAdd\" value=\"0.00\" /></td>";    myJsVal += " <td>";    myJsVal += "     <button class=\"table-btn am-btn am-btn-default am-btn-xs am-text-danger  am-round\" onclick=\"removeFreightTemplateItem(" + addIndex + ")\"><span class=\"am-icon-trash\"></span></button>";    myJsVal += " </td>";    myJsVal += "</tr>";
    //追加项到最后
    $("#TbodyTrPage").append(myJsVal);
}

/**
 * 移除当前项
 * @param {any} pCurrentItemIndex 当前项的索引
 */
function removeFreightTemplateItem(pCurrentItemIndex) {

    $("#tr_" + pCurrentItemIndex).remove();

}

/**
 * 得到所有选择地区值的拼接字符串
 * @returns  234234 ^ 234324 ^ 234234 ~ 23423423 ^ 234343 ^ 234234
 * */
function getAllSelRegionValArr() {

    //获取所有项的隐藏记录控件
    var _hidRegionArr = $("input[name='HidRegionArr']");

    var _allSelRegionArr = "";
    //循环构造值
    for (var i = 0; i < _hidRegionArr.length; i++) {
        var _hidRegionVal = _hidRegionArr[i].value.trim();
        console.log("_hidRegionVal=" + _hidRegionVal);
        if (_hidRegionVal != "" && _hidRegionVal.length > 2) {
            _allSelRegionArr += "~" + _hidRegionVal;
        }
    }
    //去掉前后的“^”
    _allSelRegionArr = removeFrontAndBackChar(_allSelRegionArr, "~");
    console.log("_allSelRegionArr=" + _allSelRegionArr);

    return _allSelRegionArr;
}

/**
 * 得到所有运费1件值的拼接字符串 用“^”隔开
 * */
function getAllFreightOneValArr() {

    //运费1件的拼接字符串
    var _allFreightOneArr = "";

    var _freightOneNameArr = $("input[name='FreightOne']");
    for (var i = 0; i < _freightOneNameArr.length; i++) {

        var _freightOneVal = _freightOneNameArr[i].value.trim();
        //判断值是否合法
        if (_freightOneVal == "" || isNaN(_freightOneVal)) {
            toastWin("【运费】不能为空,且必须是数字！");
            return "";
        }
        if (parseFloat(_freightOneVal) < 0) {
            toastWin("【运费】不能小于零！");
            return "";
        }

        _allFreightOneArr += "^" + _freightOneVal;
    }
    //去掉前后的"^"
    _allFreightOneArr = removeFrontAndBackChar(_allFreightOneArr, "^");
    console.log("_allFreightOneArr=" + _allFreightOneArr);

    return _allFreightOneArr;
}

/**
 * 得到所有运费续件值的拼接字符串 用“^”隔开
 * */
function getAllFreightAddValArr() {
    //运费1件的拼接字符串
    var _allFreightAddArr = "";

    var _freightAddNameArr = $("input[name='FreightAdd']");
    for (var i = 0; i < _freightAddNameArr.length; i++) {

        var _freightAddVal = _freightAddNameArr[i].value.trim();
        //判断值是否合法
        if (_freightAddVal == "" || isNaN(_freightAddVal)) {
            toastWin("【续件】不能为空,且必须是数字！");
            return "";
        }
        if (parseFloat(_freightAddVal) < 0) {
            toastWin("【续件】不能小于零！");
            return "";
        }
        _allFreightAddArr += "^" + _freightAddVal;
    }
    //去掉前后的"^"
    _allFreightAddArr = removeFrontAndBackChar(_allFreightAddArr, "^");
    console.log("_allFreightAddArr=" + _allFreightAddArr);

    return _allFreightAddArr;
}

/**
 * 保存模板参数信息
 * */
function saveFreightTemplateParamVal() {

    confirmWinWidth("确定要【保存】吗？", function () {


        var FtID = $("#hidFtID").val().trim();

        //得到所有选择地区值的拼接字符串
        var _allSelRegionArr = getAllSelRegionValArr();

        //得到所有运费1件值的拼接字符串
        var _allFreightOneArr = getAllFreightOneValArr();

        //所有运费续件值的拼接字符串
        var _allFreightAddValArr = getAllFreightAddValArr();

        if (_allFreightOneArr == "" || _allFreightAddValArr == "") {
            return;
        }


        //构造POST参数
        var dataPOST = {
            "Type": "1", "FtID": FtID, "AllSelRegionArr": _allSelRegionArr, "AllFreightOneArr": _allFreightOneArr, "AllFreightAddValArr": _allFreightAddValArr,
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

                    if (_jsonReTxt.ErrMsg != null && _jsonReTxt.ErrMsg != "") {
                        toastWin(_jsonReTxt.ErrMsg);
                        return;
                    }
                    //操作成功
                    if (_jsonReTxt.Msg != null && _jsonReTxt.Msg != "") {
                        toastWinCb(_jsonReTxt.Msg, function () {
                            //跳转到模板页
                            window.location.href = "../ShopPage/FreightTemplate";
                        });
                        return;
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

