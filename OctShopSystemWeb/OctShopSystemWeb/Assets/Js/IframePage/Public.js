/*================= Iframe 公共脚本 ==================*/


/************** 公共变量与配置参数 ***************/



/*************** 初始化 *********************/
$(function () {

    //初始化页脚内容
    initFooterContent();

    //是否显示到顶部的 按钮
    showGoToTopBtn();

});



/********************* 自定义函数 *********************/


/**
 * 是否显示到顶部的 按钮
 * */
function showGoToTopBtn() {
    var _isShow = hasScrolled();
    //console.log(_isShow);
    //有滚动条
    if (_isShow) {
        $(".go-page-top").show();

        $('.go-page-top').click(function () {

            document.body.scrollTop = 0;

        });
    }
    else {
        $(".go-page-top").hide();
    }


}

/**
 * 判断标签是否有滚动条
 */
function hasScrolled() {
    return document.body.scrollHeight > (window.innerHeight || document.documentElement.clientHeight);
}

/**
 * 初始化页脚内容
 * */
function initFooterContent() {

    var myJsVal = "";    myJsVal += "    <div class=\"page-footer am-cf am-nbfc\">";    myJsVal += "        版权所有@2019";    myJsVal += "    <\/div>";    myJsVal += "    <div class=\"go-page-top\" data-am-smooth-scroll>";    myJsVal += "        <i class=\"go-page-top-icon am-icon-arrow-up\"><\/i>";    myJsVal += "    <\/div>";
    $(".main").after(myJsVal);
}