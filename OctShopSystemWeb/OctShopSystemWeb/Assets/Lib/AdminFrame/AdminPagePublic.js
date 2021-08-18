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

            document.body.scrollTop = document.documentElement.scrollTop = 0;
            console.log("执行了到顶部的");

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

    var _date = new Date();
    var _year = _date.getFullYear();
    $(".year-span-footer").text(_year);

    var myJsVal = "";    myJsVal += "    <div class=\"page-footer am-cf am-nbfc\">";    myJsVal += "        版权所有@2016-" + _year;    myJsVal += "    <\/div>";    myJsVal += "    <div class=\"go-page-top\" data-am-smooth-scroll>";    myJsVal += "        <i class=\"go-page-top-icon am-icon-arrow-up\"><\/i>";    myJsVal += "    <\/div>";
    $(".main").after(myJsVal);
}


/**
 * 将两个对象拼接在一起 如：var object1 = {"UserID":"huang"}; var object2={"Pwd":"1111"}  --> {"UserID":"huang","Pwd":"1111"}
 * @param {any} object 被拼接的object对象
 * @param {any} objectAdd 要添加进去的object对象
 * @returns  返回值:返回拼接后的Object
 */
function pushTwoObject(object, objectAdd) {
    var data = object
    data.push = function (o) {
        //如果o是object  
        if (typeof (o) == 'object') for (var p in o) this[p] = o[p];
    };

    var data1 = objectAdd;

    //console.log(data);
    data.push(data1);

    //alert(data.UserID + "|" + data1.Pwd);
    return data;
}


