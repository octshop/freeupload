//==================商家结算资料=========================//

/**-----定义公共变量------**/

//AjaxURL
var mAjaxUrl = "../Trading/SettleShopMsg";


/******数据分页的变量********/
var strPOSTSe = ""; //搜索条件对象 POST参数
var intPageCurrent = 1; //当前页
var pageSize = 15; //当页的记录条数，与后台保持一致
var recordSum = 0; //总记录数
var tableColNum = 10; //当前表列数


/**------初始化------**/
$(function () {

    if ($("#hidIsCheck").val().trim() != "") {
        var _selOption = $("#IsCheck_se").find("option");
        for (var i = 0; i < _selOption.length; i++) {
            if ($("#hidIsCheck").val().trim() == $(_selOption[i]).val().trim()) {

                $(_selOption[i]).attr("selected", true);
                $("#IsCheck_se").trigger('changed.selected.amui');
                break;
            }
        }
    }


    //初始化加载
    searchContent();

    //搜索按钮单击事件
    $("#btnSearch").click(function () {
        searchContent();
    });

    //初始化详情窗口
    initPopWinHtmlDetail();

    //初始化添加窗口显示代码
    initAddEditWinHtml();

});



//===================自定义函数=====================//

/**
 * 审核 商家结算资料
 * @param {any} pShopUserID 商家UserID
 */
function checkSettleShopMsg(pShopUserID) {

    //获取表单值
    var IsCheck_ae = $("#IsCheck_ae").val().trim();
    var CheckReason_ae = $("#CheckReason_ae").val().trim();

    if (IsCheck_ae == "true" && CheckReason_ae == "") {
        toastWinToDiv("请填写【审核原因】!", "dragWinDiv");
        return;
    }

    //构造POST参数
    var dataPOST = {
        "Type": "3", "ShopUserID": pShopUserID, "IsCheck": IsCheck_ae, "CheckReason": CheckReason_ae
    };
    console.log(dataPOST);

    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: mAjaxUrl + "?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("初始化商家结算资料=" + reTxt);
            if (reTxt != "") {
                var _jsonReTxt = JSON.parse(reTxt);


                if (_jsonReTxt.Msg != undefined && _jsonReTxt.Msg != null && _jsonReTxt.Msg != "") {
                    toastWinToDivCb(_jsonReTxt.Msg, function () {

                        //关闭窗口
                        closeDialogWin();

                        //重新加载数据
                        NumberPage(intPageCurrent);

                    }, "dragWinDiv");

                    if (_jsonReTxt.ErrMsg != undefined && _jsonReTxt.ErrMsg != null && _jsonReTxt.ErrMsg != "") {
                        toastWinToDivCb(_jsonReTxt.Msg, function () {

                        }, "dragWinDiv");

                        return;
                    }
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
 * 初始化商家结算资料
 * @param {any} pShopUserID
 */
function initSettleShopMsg(pShopUserID, pCallBack) {


    //构造POST参数
    var dataPOST = {
        "Type": "2", "ShopUserID": pShopUserID,
    };
    console.log(dataPOST);


    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: mAjaxUrl + "?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("初始化商家结算资料=" + reTxt);
            if (reTxt != "") {

                pCallBack(JSON.parse(reTxt));

            }
            else {

            }
        },
        error: function (xhr, errorTxt, status) {
            console.log("异步请求错误，errorTxt=" + errorTxt + " | status=" + status);
            return;
        }
    });

}




//==================弹出窗口=======================//


//----------详情窗口------------//

var mPopWinHtmlDetail = "";
/**
 * 初始化详情窗口
 */
function initPopWinHtmlDetail() {
    //获取窗口显示代码
    mPopWinHtmlDetail = $("#DetailWin").html();
    $("#DetailWin").empty();
}

/**
 * 打开详情窗口
 */
function openDetailWin(pShopUserID) {

    //打开Dialog弹出窗口
    openCustomDialogWin("详情内容", mPopWinHtmlDetail, 600);

    //清除详细窗口
    $("#DetailUL").html("");

    //构造窗口显示代码
    initSettleShopMsg(pShopUserID, function (pJsonReTxt) {

        //资料是否审核(false 待审核 true 不通过 pass 通过)
        var _IsCheck = "待审核";
        if (pJsonReTxt.IsCheck == "pass") {
            _IsCheck = "通过";
        }
        else if (pJsonReTxt.IsCheck == "true") {
            _IsCheck = "不通过";
        }

        //构造窗口显示代码
        var myJsVal = "";
        myJsVal += "<li>";
        myJsVal += " <span>商家UserID:</span>" + pJsonReTxt.ShopUserID + "";
        myJsVal += " <span>统一社会信用代码:</span>" + pJsonReTxt.CertificateID + "";
        myJsVal += "</li>";
        myJsVal += "<li>";
        myJsVal += " <span>公司名称:</span>" + pJsonReTxt.CompanyName + "";
        myJsVal += "</li>";
        myJsVal += "<li>";
        myJsVal += " <span>公司地址</span>" + pJsonReTxt.RegionNameArr + "_" + pJsonReTxt.CompanyAddr;
        myJsVal += "</li>";
        myJsVal += "<li>";
        myJsVal += " <span>公司电话</span>" + pJsonReTxt.CompanyTel + "";
        myJsVal += " <span>营业执照</span><a href=\"" + pJsonReTxt.CertificateImg + "\" target=\"_blank\">查看营业执照照片</a>";
        myJsVal += "</li>";
        myJsVal += "<li>";
        myJsVal += " <span>企业法人：</span>" + pJsonReTxt.LegalPerson + "";
        myJsVal += " <span>联系人：</span>" + pJsonReTxt.LinkMan + "";
        myJsVal += " <span>联系人手机：</span>" + pJsonReTxt.MobileNumber + "";
        myJsVal += "</li>";
        myJsVal += "<li>";
        myJsVal += " <span>所在部门：</span>" + pJsonReTxt.Department + "";
        myJsVal += " <span>邮箱地址：</span>" + pJsonReTxt.Email + "";
        myJsVal += "</li>";
        myJsVal += "<li>";
        myJsVal += " <span>银行账号：</span>" + pJsonReTxt.BankAccount + "";
        myJsVal += " <span>账户名称：</span>" + pJsonReTxt.BankAccName + "";
        myJsVal += "</li>";
        myJsVal += "<li>";
        myJsVal += " <span>开户支行名称：</span>" + pJsonReTxt.OpeningBank + "";
        myJsVal += " <span>审核：</span>" + _IsCheck + "";
        myJsVal += "</li>";
        myJsVal += "<li>";
        myJsVal += " <span>审核原因：</span>" + pJsonReTxt.CheckReason + "";
        myJsVal += "</li>";

        $("#DetailUL").html(myJsVal);

    });
}


//---------审核窗口---------------//

var mAddEditWinHtml = "";

/**
 * 初始化添加窗口显示代码
 */
function initAddEditWinHtml() {
    //获取窗口显示代码
    mAddEditWinHtml = $("#AddEditWin").html();
    $("#AddEditWin").empty();
}


/**
 * 打开编辑窗口
 */
function openEditWin(pShopUserID, pCompanyName) {


    //打开Dialog弹出窗口
    openDialogWinNoClose("信息审核", mAddEditWinHtml, function () {

        //审核 商家结算资料
        checkSettleShopMsg(pShopUserID);

    }, function () {


    }, 600);

    //插入显示代码
    $("#ShopUserID_ae").html("" + pShopUserID + " ，" + pCompanyName + "");

}



//======================数据分页=========================//


/*
---------定义搜索函数---------
*/
var searchContent = function () {

    intPageCurrent = 1; //开始页

    var ShopUserID_se = $("#ShopUserID_se").val().trim();
    var CompanyName_se = $("#CompanyName_se").val().trim();
    var CompanyTel_se = $("#CompanyTel_se").val().trim();
    var CertificateID_se = $("#CertificateID_se").val().trim();
    var LegalPerson_se = $("#LegalPerson_se").val().trim();
    var LinkMan_se = $("#LinkMan_se").val().trim();
    var MobileNumber_se = $("#MobileNumber_se").val().trim();
    var BankAccount_se = $("#BankAccount_se").val().trim();
    var IsCheck_se = $("#IsCheck_se").val().trim();
    var IsLock_se = $("#IsLock_se").val().trim();
    var WriteDate_se = $("#WriteDate_se").val().trim();


    //构造POST参数
    var strPOST = {
        "pageCurrent": "1", "Type": "1",
    };

    //翻页所用
    var strPOSTSePush = {
        "ShopUserID": ShopUserID_se, "CompanyName": CompanyName_se, "CompanyTel": CompanyTel_se,
        "CertificateID": CertificateID_se, "LegalPerson": LegalPerson_se, "LinkMan": LinkMan_se, "MobileNumber": MobileNumber_se, "BankAccount": BankAccount_se, "IsCheck": IsCheck_se, "IsLock": IsLock_se, "WriteDate": WriteDate_se,
    };
    //将对象添加到分类对象中

    //搜索内容用
    var strPOSTSeContent = pushTwoObject(strPOST, strPOSTSePush);

    //分页操作用
    var strPOSTSearch = { "Type": "1" };
    strPOSTSe = pushTwoObject(strPOSTSearch, strPOSTSePush);
    console.log(strPOSTSe);

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
    var myJsVal = "";
    //循环构造
    for (var i = 0; i < json.DataPage.length; i++) {

        var indexDataPage = json.DataPage[i];
        var indexDataPageExtra = json.DataPageExtra[i];

        //资料是否审核(false 待审核 true 不通过 pass 通过)
        var _IsCheck = "<font color=\"red\">待审核</font>";
        if (indexDataPage.IsCheck == "pass") {
            _IsCheck = "通过";
        }
        else if (indexDataPage.IsCheck == "true") {
            _IsCheck = "不通过";
        }

        var _IsLock = "否";
        if (indexDataPage.IsLock == "true") {
            _IsLock = "是";
        }

        myJsVal += " <tr>";
        myJsVal += " <td><a href=\"../UserGoodsShopPage/ShopMsgDetail?UserID=" + indexDataPage.ShopUserID + "\" target=\"_blank\">" + indexDataPage.ShopUserID + "<br />" + indexDataPageExtra.ShopName + "</a></td>";
        myJsVal += " <td>" + indexDataPage.CompanyName + "</td>";
        myJsVal += " <td>" + indexDataPage.LinkMan + "</td>";
        myJsVal += " <td><a href=\"tel:" + indexDataPage.MobileNumber + "\">" + indexDataPage.MobileNumber + "</a></td>";
        myJsVal += " <td>" + indexDataPage.BankAccount + "</td>";
        myJsVal += " <td>" + indexDataPage.OpeningBank + "</td>";
        myJsVal += " <td>";
        myJsVal += "" + _IsCheck + "";
        myJsVal += "     <i style=\"color: #939393;display: block\">" + indexDataPage.CheckReason + "</i>";
        myJsVal += " </td>";
        myJsVal += " <td>" + _IsLock + "</td>";
        myJsVal += " <td>";
        myJsVal += "" + indexDataPage.WriteDate + "";
        myJsVal += " </td>";
        myJsVal += " <td>";
        myJsVal += "     <button class=\"table-btn am-btn am-btn-default am-btn-xs am-text-success am-round\" onclick=\"openDetailWin('" + indexDataPage.ShopUserID + "')\">详细</button>";
        myJsVal += "     <button class=\"table-btn am-btn am-btn-default am-btn-xs am-text-danger am-round\" onclick=\"openEditWin('" + indexDataPage.ShopUserID + "', '" + indexDataPage.CompanyName + "')\">审核</button>";
        myJsVal += " </td>";
        myJsVal += "</tr>";

    }
    //alert(myJsVal);

    //-----分页控制条显示代码-------//
    var pageBarXhtml = "";

    pageBarXhtml += " <li><a href=\"javascript:void(0)\" onclick=\"PrePage()\">«</a></li>";
    pageBarXhtml += " <li><a href=\"javascript:void(0)\" onclick=\"NumberPage('1')\">1</a></li>";
    pageBarXhtml += "  <li><span>...</span></li>";


    if ((intPageCurrent - 2) > 0) {
        pageBarXhtml += "  <li><a href=\"javascript:void(0)\" onclick=\"NumberPage('" + (intPageCurrent - 2) + "')\">" + (intPageCurrent - 2) + "</a></li>";
    }
    if ((intPageCurrent - 1) > 0) {
        pageBarXhtml += "  <li><a href=\"javascript:void(0)\" onclick=\"NumberPage('" + (intPageCurrent - 1) + "')\">" + (intPageCurrent - 1) + "</a></li>";
    }


    pageBarXhtml += "  <li class=\"am-active\"><a href=\"javascript:void(0)\" onclick=\"NumberPage('" + json.PageCurrent + "')\">" + json.PageCurrent + "</a></li>";

    //console.log(parseInt(json.PageSum));

    if ((intPageCurrent + 1) <= parseInt(json.PageSum)) {
        pageBarXhtml += "  <li><a href=\"javascript:void(0)\" onclick=\"NumberPage('" + (intPageCurrent + 1) + "')\">" + (intPageCurrent + 1) + "</a></li>";
    }
    if ((intPageCurrent + 2) <= parseInt(json.PageSum)) {
        pageBarXhtml += "  <li><a href=\"javascript:void(0)\" onclick=\"NumberPage('" + (intPageCurrent + 2) + "')\">" + (intPageCurrent + 2) + "</a></li>";
    }

    pageBarXhtml += "  <li><span>...</span></li>";
    pageBarXhtml += "  <li><a href=\"javascript:void(0)\" onclick=\"NumberPage('" + json.PageSum + "')\">" + json.PageSum + "</a></li>";
    pageBarXhtml += "  <li><input type=\"number\" id=\"PageNumTxt\" class=\"page-go-text am-form-field\" placeholder=\"跳转页\" /></li>";
    pageBarXhtml += "  <li><a href=\"javascript:void(0)\" onclick=\"NextPage()\">»</a></li>";

    var _pageMsgArr = new Array()
    //内容显示代码 
    _pageMsgArr[0] = myJsVal;
    //控制条件显示代码
    _pageMsgArr[1] = pageBarXhtml;
    //返回数组
    return _pageMsgArr;
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

    console.log("上一页intPageCurrent=" + intPageCurrent);

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

    console.log("下一页intPageCurrent=" + intPageCurrent);

    console.log("recordSum=" + recordSum);
    console.log("pageSize=" + pageSize);
    //计算总页数
    var intPageSum = recordSum % pageSize != 0 ? recordSum / pageSize + 1 : recordSum / pageSize;
    console.log("intPageSum=" + intPageSum);
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
        //document.getElementById("SelAllCb").checked = false;

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


//======================数据分页=========================//