//==============提交退货申请=========================//

/**-----定义公共变量------**/




/**------初始化------**/
$(function () {


});




/**------自定义函数------**/


/**
 * -------打开投诉类型窗口------
 */
var mAsReasonTypeWinHtml = "";
function openAsReasonTypeWin() {

    if (mAsReasonTypeWinHtml == "") {

        mAsReasonTypeWinHtml = getAsReasonTypeWinHtml();
    }
    //初始化SliderDown窗口
    initSilderDownWin(600, mAsReasonTypeWinHtml);

    toggleSilderDownWin();

}
/**
 * 得到支付确认窗口显示代码
 */
function getAsReasonTypeWinHtml() {

    var _html = $("#WinSelReasonType").html();

    $("#WinSelReasonType").html("");
    $("#WinSelReasonType").remove();
    $("body").remove("#WinSelReasonType");

    mAsReasonTypeWinHtml = "";

    return _html
}



