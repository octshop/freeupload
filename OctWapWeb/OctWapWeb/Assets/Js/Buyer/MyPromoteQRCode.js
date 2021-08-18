//=================我的推广码=====================//


/**------初始化------**/
$(function () {

    //初始化复制订单ID
    initCopyOrderID();
});


/**
 * 初始化复制订单ID
 * */
function initCopyOrderID() {
    //得到按钮标签
    var btn = document.getElementById('BtnCopyOrderID');
    //实例化ClipBoard对象
    var clipboard = new ClipboardJS(btn);

    clipboard.on('success', function (e) {
        console.log(e);
        toastWin("复制成功");
        //alert("复制成功！");
    });

    clipboard.on('error', function (e) {
        console.log(e);
        toastWin("复制失败");
        //alert("复制失败！");
    });
}

