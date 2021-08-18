//================优惠券管理==================//


/**-----定义公共变量------**/
//AjaxURL
var mAjaxUrl = "../Coupons/CouponsMsg";

/******数据分页的变量********/
var strPOSTSe = ""; //搜索条件对象 POST参数
var intPageCurrent = 1; //当前页
var pageSize = 15; //当页的记录条数，与后台保持一致
var recordSum = 0; //总记录数
var tableColNum = 11; //当前表列数
var mType = 1; //数据分页的操作类型

//信息ID
var mMsgID = "0";

//弹出详细窗口
var mDetailWinHtml = "";


/**------初始化------**/
$(function () {

    //初始化加载
    searchContent();

    //搜索按钮单击事件
    $("#btnSearch").click(function () {
        searchContent();
    });

    //初始化详细窗口显示代码
    initDetailWinHtml();

});

/**
 * 初始化详细窗口显示代码
 * */
function initDetailWinHtml() {
    //获取窗口显示代码
    mDetailWinHtml = $("#DetailWin").html();
    $("#DetailWin").empty();
}


/**
 * 打开详情窗口
 * @param {any} pCouponsID 优惠券ID
 */
function openDetailWin(pCouponsID) {

    //打开Dialog弹出窗口
    openCustomDialogWin("优惠券详情", mDetailWinHtml, 600);

    //初始化优惠券详情窗口信息
    initDetailWinMsg(pCouponsID);

}

/**
 * 初始化优惠券详情窗口信息
 * @param {any} pCouponsID 优惠券ID
 */
function initDetailWinMsg(pCouponsID) {

    //构造POST参数
    var dataPOST = {
        "Type": "4", "CouponsID": pCouponsID,
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

               //构造显示代码
                var myJsVal = "";                myJsVal += "<li>";                myJsVal += "<span>标题：</span>" + _jsonReTxt.CouponsTitle +"";                myJsVal += "</li>";                myJsVal += "<li>";                myJsVal += "<span>类别：</span>";                if (_jsonReTxt.UseMoney != "" && _jsonReTxt.UseMoney != "0") {                    myJsVal += "抵用券";
                    myJsVal += "<span class=\"span-padding-left\">抵用金额：</span>" + _jsonReTxt.UseMoney +"元";
                }                else {                    myJsVal += "折扣券";
                    myJsVal += "<span class=\"span-padding-left\">使用折扣：</span>" + _jsonReTxt.UseDiscount + "折";
                }                myJsVal += "<span class=\"span-padding-left\">线下验证使用：</span>";                if (_jsonReTxt.IsOfflineUse == "true") {                    myJsVal += "允许";
                }                else {                    myJsVal += "不允许";
                }                myJsVal += "</li>";                myJsVal += "<li>";                myJsVal += "<span>优惠券总数：</span>" + _jsonReTxt.NumTotal + "";                myJsVal += "<span class=\"span-padding-left\">可多次领取：</span>";                if (_jsonReTxt.IsRepeatGet == "true") {                    myJsVal += "是";
                }                else {                    myJsVal += "否";
                }                myJsVal += "<span class=\"span-padding-left\">发放方式：</span>";                if (_jsonReTxt.IssueType == "BuyGoods") {                    myJsVal += "购买商品自动发放"
                    myJsVal += "<div>";                    myJsVal += "   <span>消费满多少时自动发放：</span>" + _jsonReTxt.IssueExpenseSum + "元";                    myJsVal += "</div>";
                }                else if (_jsonReTxt.IssueType == "ShopGet") {                    myJsVal += "店铺中领取";
                }                else if (_jsonReTxt.IssueType == "BuyOrShop") {                    myJsVal += "两者均可";
                }                                myJsVal += "</li>";                myJsVal += "<li>";                myJsVal += "<span>可使用的商品ID：</span>";                console.log("_jsonReTxt.UseGoodsTitleArr=" + _jsonReTxt.UseGoodsTitleArr);                if (_jsonReTxt.UseGoodsTitleArr.indexOf("^") >= 0) {                    var _goodsTitleArr = _jsonReTxt.UseGoodsTitleArr.split("^");                    for (var i = 0; i < _goodsTitleArr.length; i++) {                        myJsVal += "<a href=\"#\">" + _goodsTitleArr[i] + "</a> ，";
                    }
                }                else {                    if (_jsonReTxt.UseGoodsTitleArr.trim() != "") {                        myJsVal += "<a href=\"#\">" + _jsonReTxt.UseGoodsTitleArr + "</a> ，";
                    }                }                myJsVal += "</li>";                myJsVal += "<li>";                myJsVal += "<span>使用日期范围：</span>";                if (_jsonReTxt.UseTimeRange.indexOf("^") >= 0) {                    var _useTimeRangeArr = _jsonReTxt.UseTimeRange.split("^");                    myJsVal += " " + _useTimeRangeArr[0] + " 至 " + _useTimeRangeArr[1] + "";
                }                else {                    myJsVal += "永久有效";
                }                     myJsVal += "<span class=\"span-padding-left\">消费满多少可用：</span>" + _jsonReTxt.ExpenseReachSum +"元";                myJsVal += "</li>";                myJsVal += "<li>";                myJsVal += "<span>使用说明与描述：</span>";                myJsVal += "" + _jsonReTxt.CouponsDesc +"";                myJsVal += "</li>";                $("#DetailUl").html(myJsVal);                //窗口剧中显示                alignCustomCenterWin();            }
        }
    });


}



/*
---------定义搜索函数---------
*/
var searchContent = function () {

    intPageCurrent = 1; //开始页

    var CouponsID_se = $("#CouponsID_se").val().trim();
    var CouponsTitle_se = $("#CouponsTitle_se").val().trim();
    var UseMoney_se = $("#UseMoney_se").val().trim();
    var UseDiscount_se = $("#UseDiscount_se").val().trim();
    var NumTotal_se = $("#NumTotal_se").val().trim();
    var IssueType_se = $("#IssueType_se").val().trim();
    var IssuePause_se = $("#IssuePause_se").val().trim();

    var UseTimeRangeStart_se = $("#UseTimeRangeStart_se").val().trim();
    var UseTimeRangeEnd_se = $("#UseTimeRangeEnd_se").val().trim();
    var UseTimeRange_se = "";
    if (UseTimeRangeStart_se != "" && UseTimeRangeEnd_se != "") {
        UseTimeRange_se = UseTimeRangeStart_se + "^" + UseTimeRangeEnd_se;
    }

    var WriteDate_se = $("#WriteDate_se").val().trim();


    //构造POST参数
    var strPOST = {
        "pageCurrent": "1", "Type": mType
    };

    //翻页所用
    var strPOSTSePush = {
        "CouponsID": CouponsID_se, "CouponsTitle": CouponsTitle_se, "UseMoney": UseMoney_se,
        "UseDiscount": UseDiscount_se, "NumTotal": NumTotal_se, "IssueType": IssueType_se,
        "IssuePause": IssuePause_se, "UseTimeRange": UseTimeRange_se, "WriteDate": WriteDate_se
    };
    //将对象添加到分类对象中

    //搜索内容用
    var strPOSTSeContent = pushTwoObject(strPOST, strPOSTSePush);
    console.log(strPOSTSeContent);

    //分页操作用
    var strPOSTSearch = { "Type": mType };
    strPOSTSe = pushTwoObject(strPOSTSearch, strPOSTSePush);
    //console.log(strPOSTSe);

    //加载提示
    $("#TbodyTrPage").html("<tr><td colspan=\"" + tableColNum + "\">… 数据加载中 …</td></tr>");

    //以POST方式发送异步请求
    $.ajax({
        type: "POST",
        url: mAjaxUrl + "?rnd=" + Math.random(),
        data: strPOSTSeContent,
        dataType: "html",
        success: function (reTxtJson, status, xhr) {
            //显示返回值
            console.log(reTxtJson);
            if (reTxtJson != "") {

                //分页成功返回，构造显示代码
                pageSuccess(reTxtJson);

            }
            else {
                //加载提示
                $("#TbodyTrPage").html("<tr><td colspan=\"" + tableColNum + "\">没有搜索到相关数据</td></tr>");
            }
        },
        error: function (xhr, errorTxt, status) {
            console.log("错误信息errorTxt=" + errorTxt + " | status=" + status);
            //alert("网络出现异常,请重试！");
        }

    });
};


//------------解析JSON数据 构造 前台显示代码--------------//
// pJsonTxt Json字符串
function jsonToXhtml(pJsonObject) {

    //将字符串转换成功JSON对象
    //var json = JSON.parse(pJsonTxt);
    var json = pJsonObject;

    //-----内容显示前台显示代码----//
    var myJsVal = "";    //循环构造    for (var i = 0; i < json.DataPage.length; i++) {

        var indexDataPage = json.DataPage[i];
        var indexDataPageExtra = json.DataPageExtra[i];

        //是否暂停发放
        var _issuePause = "否";
        var _strPause = "true";
        var _strIcon_strPause = "am-icon-arrow-circle-up";
        if (indexDataPage.IssuePause == "true") {
            _issuePause = "是";
            _strPause = "false";
            _strIcon_strPause = "am-icon-arrow-circle-down";
        }

        if (indexDataPage.IsLock == "false") {
            indexDataPage.IsLock = "否";
        }
        else {
            indexDataPage.IsLock = "是";
        }

        //获取方式
        var _IssueType = "";
        if (indexDataPage.IssueType == "BuyGoods") {
            _IssueType = "购买商品自动发放";
        }
        else if (indexDataPage.IssueType == "ShopGet") {
            _IssueType = "商铺中领取";
        }
        else if (indexDataPage.IssueType == "BuyOrShop") {
            _IssueType = "两者均可";
        }

        myJsVal += "<tr>";        myJsVal += "  <td><input type=\"checkbox\" name=\"SelCbItem\" id=\"SelCbItem_" + indexDataPage.CouponsID + "\" /></td>";        myJsVal += "  <td><span class=\"click-span\" onclick=\"openDetailWin(" + indexDataPage.CouponsID + ")\">" + indexDataPage.CouponsID + "</span></td>";        myJsVal += "  <td>" + indexDataPage.CouponsTitle + "</td>";        myJsVal += "  <td>" + indexDataPage.UseMoney + "</td>";        myJsVal += "  <td>" + indexDataPage.UseDiscount + "折</td>";        myJsVal += "  <td>" + indexDataPage.NumTotal + "</td>";        myJsVal += "  <td>" + _IssueType + "</td>";        myJsVal += "  <td>" + _issuePause + "</td>";        myJsVal += "  <td>" + indexDataPageExtra.EffectDays + "</td>";        myJsVal += "  <td>" + indexDataPage.WriteDate + "</td>";        myJsVal += "  <td>";        myJsVal += "      <button class=\"table-btn am-btn am-btn-default am-btn-xs am-text-secondary am-round\" onclick=\"window.location.href='../CouponsPage/CouponsMsgEdit?CID=" + indexDataPage.CouponsID +"'\"><span class=\"am-icon-pencil-square-o\"></span></button>";        myJsVal += "      <button class=\"table-btn am-btn am-btn-default am-btn-xs am-text-warning  am-round\" onclick=\"unIssuePauseCoupons(" + indexDataPage.CouponsID + ",'" + _strPause + "')\"><span id=\"BtnToggleLock\" class=\"" + _strIcon_strPause + "\"></span></button>";        myJsVal += "  </td>";        myJsVal += "</tr>";
    }    //alert(myJsVal);    //-----分页控制条显示代码-------//    var pageBarXhtml = "";    pageBarXhtml += " <li><a href=\"javascript:void(0)\" onclick=\"PrePage()\">«</a></li>";    pageBarXhtml += " <li><a href=\"javascript:void(0)\" onclick=\"NumberPage('1')\">1</a></li>";    pageBarXhtml += "  <li><span>...</span></li>";    if ((intPageCurrent - 2) > 0) {
        pageBarXhtml += "  <li><a href=\"javascript:void(0)\" onclick=\"NumberPage('" + (intPageCurrent - 2) + "')\">" + (intPageCurrent - 2) + "</a></li>";
    }    if ((intPageCurrent - 1) > 0) {
        pageBarXhtml += "  <li><a href=\"javascript:void(0)\" onclick=\"NumberPage('" + (intPageCurrent - 1) + "')\">" + (intPageCurrent - 1) + "</a></li>";
    }    pageBarXhtml += "  <li class=\"am-active\"><a href=\"javascript:void(0)\" onclick=\"NumberPage('" + json.PageCurrent + "')\">" + json.PageCurrent + "</a></li>";    console.log(parseInt(json.PageSum));    if ((intPageCurrent + 1) <= parseInt(json.PageSum)) {
        pageBarXhtml += "  <li><a href=\"javascript:void(0)\" onclick=\"NumberPage('" + (intPageCurrent + 1) + "')\">" + (intPageCurrent + 1) + "</a></li>";
    }    if ((intPageCurrent + 2) <= parseInt(json.PageSum)) {
        pageBarXhtml += "  <li><a href=\"javascript:void(0)\" onclick=\"NumberPage('" + (intPageCurrent + 2) + "')\">" + (intPageCurrent + 2) + "</a></li>";
    }    pageBarXhtml += "  <li><span>...</span></li>";    pageBarXhtml += "  <li><a href=\"javascript:void(0)\" onclick=\"NumberPage('" + json.PageSum + "')\">" + json.PageSum + "</a></li>";    pageBarXhtml += "  <li><input type=\"number\" id=\"PageNumTxt\" class=\"page-go-text am-form-field\" placeholder=\"跳转页\" /></li>";    pageBarXhtml += "  <li><a href=\"javascript:void(0)\" onclick=\"NextPage()\">»</a></li>";    var _pageMsgArr = new Array()    //内容显示代码     _pageMsgArr[0] = myJsVal;    //控制条件显示代码    _pageMsgArr[1] = pageBarXhtml;    //返回数组    return _pageMsgArr;
}


//------------------------------搜索结果分页-------------------------------//
//具体页
function NumberPage(pagecurrent) {
    intPageCurrent = parseInt(pagecurrent);

    //以GET方式发送分页请求的函数
    sendPageHttpGet(intPageCurrent);
}

//上一页
function PrePage() {
    intPageCurrent = intPageCurrent - 1;

    if (intPageCurrent > 0) {

        //以GET方式发送分页请求的函数
        sendPageHttpGet(intPageCurrent);

    }
    else {
        intPageCurrent = 1;
    }
}


//下一页
function NextPage() {
    intPageCurrent = parseInt(intPageCurrent) + 1;

    //计算总页数
    var intPageSum = recordSum % pageSize != 0 ? recordSum / pageSize + 1 : recordSum / pageSize;
    if (intPageCurrent <= parseInt(intPageSum)) {

        //以GET方式发送分页请求的函数
        sendPageHttpGet(intPageCurrent);

    }
    else {
        intPageCurrent = parseInt(intPageSum);
    }

}

//----------------以GET方式发送分页请求的函数-----------------//
var sendPageHttpGet = function (intPageCurrent) {
    //构造GET参数
    strPOSTSe = pushTwoObject(strPOSTSe, { "pageCurrent": intPageCurrent });

    //加载提示
    $("#TbodyTrPage").html("<tr><td colspan=\"" + tableColNum + "\">… 数据加载中 …</td></tr>");

    $.ajax({
        type: "GET",
        url: mAjaxUrl + "?rnd=" + Math.random(),
        data: strPOSTSe,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            //成功返回后的处理函数
            pageSuccess(reTxt)
        },
        error: function (xhr, errorTxt, status) {
            console.log("异步请求错误，errorTxt=" + errorTxt + " | status=" + status);
            //alert("网络出现异常,请重试！");
            return;
        }
    });
}


//------------分页信息成功返回------------//
// @ reTxtJson 返回的Json字符串
function pageSuccess(reTxtJson) {
    if (reTxtJson != "") {

        var reJsonObject = JSON.parse(reTxtJson);
        console.log(reJsonObject);

        //总的记录数
        recordSum = reJsonObject.RecordSum;
        pageSize = reJsonObject.PageSize;


        //解析JSON数据 构造 前台显示代码
        var _xhtmlArr = jsonToXhtml(reJsonObject);

        //显示内容
        $("#TbodyTrPage").html(_xhtmlArr[0]);
        //分页控制条
        $("#PageBar1").html(_xhtmlArr[1]);

        //滚动条回到顶部
        document.body.scrollTop = 0;


        //跳转页 获取当文本框获取了焦点，按了键盘事件
        $("#PageNumTxt").keydown(function (event) {
            //alert(event.keyCode);
            if (event.keyCode == "13") {

                //跳转方法
                gotoPage();

                return false;
            }
        });

        //全不选
        document.getElementById("SelAllCb").checked = false;

    }
    else {
        $("#TbodyTrPage").html("<tr><td colspan=\"" + tableColNum + "\">没有搜索到相关数据</td></tr>");
    }
}


//---------------------------跳转页---------------------//
function gotoPage() {

    var pageNum = $("#PageNumTxt").val()
    //判断输入的页数是否小于0
    if (parseInt(pageNum) <= 0) {
        toastWin("跳转的页数不能小于或等于0!");
        return;
    }

    //判断页输入框是否为空
    if (pageNum == "" || pageNum == null) {
        toastWin("请输入要跳转的页数！");
        return;
    }
    //判断输入的页是否为数字
    if (isNaN(pageNum)) {
        toastWin("跳转的页数必须是数字！");
        return;
    }

    //调用数据库函数
    NumberPage(pageNum);
}

/**
 * 全选与全不选
 */
function toggleSelAll() {

    //获取所有的Select控件
    var _selectItemArr = document.getElementsByName("SelCbItem");

    //全选与全不先的Select控件
    var isAllCheck = document.getElementById("SelAllCb").checked;
    console.log(isAllCheck);
    if (isAllCheck) //全选
    {
        for (var i = 0; i < _selectItemArr.length; i++) {
            _selectItemArr[i].checked = true;
        }
    }
    else {
        for (var i = 0; i < _selectItemArr.length; i++) {
            _selectItemArr[i].checked = false;
        }
    }
}

/**
 * 获取全选与全不选控件信息ID值数组
* return  23434^234324^254354
 */
function getSelectValArr() {

    //获取所有的Select控件
    var _selectItemArr = document.getElementsByName("SelCbItem");

    //定义数组
    var _msgIdArr = new Array();
    //定义数组索引
    var _arrIndex = 0;

    //循环获取MsgID
    for (var i = 0; i < _selectItemArr.length; i++) {
        var _msgID = _selectItemArr[i].id.replace("SelCbItem_", "");
        //console.log(_msgID);
        if (_selectItemArr[i].checked) {
            _msgIdArr[_arrIndex] = _msgID;
            _arrIndex++
        }
    }
    // console.log("_msgIdArr=" + _msgIdArr);

    return _msgIdArr.join("^");
}

/**
 * 批量删除信息
 */
function delMsgArr() {

    //获取全选与全不选控件信息ID值数组
    var MsgIDArr = getSelectValArr();
    console.log("MsgIDArr=" + MsgIDArr);

    if (MsgIDArr == "") {
        toastWin("请选择要删除的信息！");
        return;
    }

    //构造POST参数
    var dataPOST = {
        "Type": "2", "MsgIDArr": MsgIDArr,
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

                if (_jsonReTxt.ErrCode != null) {
                    toastWin(_jsonReTxt.ErrMsg);
                    return;
                }

                if (_jsonReTxt.Code != "") {
                    toastWin(_jsonReTxt.Msg);
                    //重新加载数据
                    NumberPage(intPageCurrent)
                    return;
                }
            }
        }
    });
}


/**
 * 暂停与继续发放 优惠券
 * @param {any} pCouponsID 优惠券ID
 * @param {any} pIssuePause 暂停与继续 [ true 暂停 / false 继续]
 */
function unIssuePauseCoupons(pCouponsID, pIssuePause) {

    var _strPrompt = " [ 继续发放 ] ";
    if (pIssuePause == "true") {
        _strPrompt = " [ 暂停发放 ] ";
    }

    confirmWinWidth("确定要" + _strPrompt + "吗？", function () {

        //构造POST参数
        var dataPOST = {
            "Type": "3", "CouponsID": pCouponsID, "IssuePause": pIssuePause,
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

                        //重新加载数据
                        NumberPage(intPageCurrent)
                        return;
                    }

                    if (_jsonReTxt.ErrCode != null) {
                        toastWin(_jsonReTxt.ErrMsg);
                        return;
                    }
                }
            }
        });


    }, 400);

}


