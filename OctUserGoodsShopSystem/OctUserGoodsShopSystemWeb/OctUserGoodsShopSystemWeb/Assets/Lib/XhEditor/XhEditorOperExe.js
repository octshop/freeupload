//===============文本编辑器的相关操作JS============================//
$(function () {

});


//--------显示关闭插入图片的列表区域-----//
function toggleInsertImgsList() {
    var _webEditorInsertImg = $("#webEditorInsertImg");
    if (_webEditorInsertImg.get(0).style.display == "none") {
        _webEditorInsertImg.get(0).style.display = "block";
        //重新加载数据
        NumberPage("1");
    }
    else {
        _webEditorInsertImg.get(0).style.display = "none";
    }
}

//-----------为编辑器赋值----------//
//pVal 赋值的内容
function setEditorVal(pVal) {
    //alert($("#GoodsDescriptionTxtArea").val());
    //为编辑器赋值
    setTimeout("setFramesVal('" + pVal +"')", 3000);
}
function setFramesVal(pVal) {
    //将商品描述写入编辑中    window.frames[0].editor.setSource(pVal);
}

//=====================编辑器的操作=====================//function InsetMyImg(ImgSrcPath) {

    //document.frames["EditorIframe"].editor.pasteHTML("<img src=\""+ ImgSrcPath +"\" />");

    window.frames[0].editor.pasteHTML("<img src=\"" + ImgSrcPath + "\" />");

}//---------------获取编辑器编辑后的值-----------------//
function GetEditValue() {
    var strEditorContent = window.frames[0].editor.getSource()
    // alert(strEditorContent);
    return strEditorContent
}



//------------------------------上传图片分页-------------------------------//

var strPOSTSe = { "type": '3' }; //操作的类型type值

var intPageCurrent = 1; //当前页
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
        //var recordSum = $("recordSum").firstChild.nodeValue;
        var recordSum = $("#recordSum").text();
        //alert(recordSum);

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
    //var recordSum = $("recordSum").firstChild.nodeValue;
    var recordSum = $("#recordSum").text();
    //alert(recordSum);

    //计算总页数
    var intPageSum = recordSum % 15 != 0 ? recordSum / 15 + 1 : recordSum / 15;
    if (intPageCurrent <= parseInt(intPageSum)) {

        //以GET方式发送分页请求的函数
        sendPageHttpGet(intPageCurrent);
        //Request.sendGET("BarterMsgMan.ashx?pageCurrent=" + intPageCurrent + strPOSTSe + "&type=1&rnd=" + Math.random(), pageSuccess, null, true, null)

    }
    else {
        intPageCurrent = parseInt(intPageSum);
    }

}


//----------------以GET方式发送分页请求的函数-----------------//
var sendPageHttpGet = function (intPageCurrent) {
    //构造GET参数
    strPOSTSe = $.pushTwoObject(strPOSTSe, { "pageCurrent": intPageCurrent });

    $.ajax({
        type: "GET",
        url: "ImgsPhotoUpload.ashx?rnd=" + Math.random(),
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
function pageSuccess(reTxt) {
    if (reTxt != "") {
        var reTxtArr = reTxt.split("|");

        //返回显示代码插入前台
        //alert(myJsValStart + reTxtArr[0] + myJsValEnd);
        //$("#credContentDiv").html(myJsValStart + reTxtArr[0] + myJsValEnd); 有兼容性问题
        document.getElementById("insertPhotoDiv").innerHTML = myJsValStart + reTxtArr[0] + myJsValEnd;
        //分页内容
        $("#PageBar1").html(reTxtArr[1]);

        //滚动条回到顶部
        //window.location.href = "#";
    }
}


//---------------------------跳转页---------------------//
function gotoPage() {
    var pageNum = $("#PageNumTxt").val()
    //判断输入的页数是否小于0
    if (parseInt(pageNum) <= 0) {
        alert("跳转的页数不能小于或等于0!");
        return;
    }

    //判断页输入框是否为空
    if (pageNum == "" || pageNum == null) {
        alert("请输入要跳转的页数！");
        return;
    }
    //判断输入的页是否为数字
    if (isNaN(pageNum)) {
        alert("跳转的页数必须是数字！");
        return;
    }

    //调用数据库函数
    NumberPage(pageNum);
}


//-----------------承载具体分页数据的表格内容--------------//
//开始内容
var myJsValStart = "";
//结束内容
var myJsValEnd = "";



