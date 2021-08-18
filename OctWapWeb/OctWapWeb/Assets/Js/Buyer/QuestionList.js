/*===================说明事项========================*/

/**-----定义公共变量------**/
var mAjaxUrl = "../BuyerAjax/OfficialService";



/**------初始化------**/
$(function () {

    //加载问题类型列表
    loadQuestionList();

});


/**
 * 加载问题类型列表
 * */
function loadQuestionList() {
    //构造GET参数
    var dataPOST = {
        "Type": "1", "ExplainType": "Question", "ClearOrShowPropertyNameArr": "ExplainContent^IsLock^WriteDate^PageOrder"
    };
    //正式发送GET请求
    $.ajax({
        type: "POST",
        url: mAjaxUrl + "?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("加载问题类型列表=" + reTxt);
            if (reTxt != "") {

                //转换为Json对象
                var _jsonReTxt = JSON.parse(reTxt);
                //构造显示代码
                var myJsVal = "";
                for (var i = 0; i < _jsonReTxt.ExplainTextList.length; i++) {

                    var ExplainText = _jsonReTxt.ExplainTextList[i];

                    myJsVal += "<li onclick=\"window.location.href='../Buyer/QuestionDetail?EID=" + ExplainText.ExplainID + "'\"><span>" + ExplainText.ExplainTitle + "</span></li>";

                }
                //显示代码插入前台
                $("#QuestionUl").html(myJsVal);
            }
        },
        error: function (xhr, errorTxt, status) {
            console.log("异步请求错误，errorTxt=" + errorTxt + " | status=" + status);
            return;
        }
    });
}

