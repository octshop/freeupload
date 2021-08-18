//================上传图片裁剪=====================//


/*
---------- 全局的变量或配置参数---------------
*/

//Ajax请求路径 
var ajaxUrl = "../../../../PubWeb/CropZoom/CropZoom.ashx";

var mMsgID = 11; //信息的ID
var mCropType = "ShopLogo"; //裁剪图片的类别
var mPrefixFileName = "CropZoom"; //保存文件名的前缀
var mSavePath = "/Upload/ShopLogo/"; //保存的文件路径 


/*
-----------初始化--------------
*/
$(function () {

    //初始化裁剪值
    mMsgID = $("#hidMsgID").val().trim();
    mCropType = $("#hidCropType").val().trim();
    mPrefixFileName = $("#hidPrefixFileName").val().trim();
    mSavePath = $("#hidSavePath").val().trim();

    //初始化裁剪插件
    initCropZoom();

});


/*
--------- 初始化裁剪插件--------
*/
//在网络的情况下，限制多次提交裁剪请求
var limitCropNum = 0;

function initCropZoom() {
    var cropzoom = $('#cropzoom_container').cropzoom({
        //width: 400, //这里是总个剪切操作区的宽高
        //height: 400, //这里是总个剪切操作区的宽高
        width: parseInt($("#hidCropZoomWidth").val()), //这里是总个剪切操作区的宽高
        height: parseInt($("#hidCropZoomHeight").val()), //这里是总个剪切操作区的宽高
        bgColor: '#000', //操作区背景色
        enableRotation: true, //开启旋转
        enableZoom: true, //开启缩放
        selector: {
            //w: 250, //选择区的高度
            //h: 250, //选择区的宽度
            w: parseInt($("#hidCropImgWidth").val()), //选择区的高度
            h: parseInt($("#hidCropImgHeight").val()), //选择区的宽度
            centered: true, //选区是否居中
            borderColor: '#FFFFFF',  //默认边框颜色
            borderColorHover: 'yellow' //鼠标放在选择区的颜色
        },
        image: {
            //source: 'http://www.suchso.com/zb_users/upload/2016/3/2016033041086637.jpg', //剪裁图片的来源URL
            //source: 'http://10.1.1.215:85/PubWeb/ShowImgScale.aspx?FilePathFrom=my01.jpg&LimitWidthNum=500&LimitHeightNum=400', //剪裁图片的来源URL
            source: $("#hidImgSourceURL").val().trim(), //剪裁图片的来源URL
            //width: 500, //剪裁图片初始大小
            //height: 400, //剪裁图片初始大小
            width: parseInt($("#hidWidthCropPre").val()), //剪裁图片初始大小
            height: parseInt($("#hidHideCropPre").val()), //剪裁图片初始大小
            minZoom: 1, //最小缩放
            maxZoom: 200 //最大缩放
        }
    });
    $('.send_data').click(function () {

        console.log("……执行了正式裁剪limitCropNum=" + limitCropNum + "……");
        if (limitCropNum > 0)
        {
            return;
        }
        limitCropNum++;
        //裁剪提示
        $(".send_data").html("…裁剪中…");

        //cropzoom.send('ProcessImage.ashx', 'POST', { ID: 11 }, function (imgRet) {
        cropzoom.send(ajaxUrl, 'POST', { ID: mMsgID, PrefixFileName: mPrefixFileName, SavePath: mSavePath, CropType: mCropType }, function (imgRet) {
            if (imgRet.indexOf('Error') >= 0) {
                alert(imgRet);
            }
            else {  //上传成功后

                console.log("裁剪上传成功返回!");
                //-------上传成功后的代码-------//

                //$(".result").find(".txt").hide();
                //$("#generated").attr("src", imgRet).show();

                //跳转到URL
                window.location.href = "../../../../../" + $("#hidCropRedirectURL").val().trim();
                limitCropNum = 0;
            }
        });
    });
    $(".restore_data").click(function () {
        $("#generated").attr("src", "tmp/head.gif");
        cropzoom.restore();
    });

    //设置裁剪插件样式
    setCropZoomStyle();
    //使图片剪裁区域垂直居中
    setCropVerticalCenter();
}



/*
--------设置裁剪插件样式--------
*/
function setCropZoomStyle() {

    //-----------旋转滑块区-------------//
    //背景条的高度
    $("#rotationContainer").css("height", "98%");
    $("#rotationContainer").css("width", "80px");

    //滑槽的宽高
    $(".ui-slider-vertical").css("height", "80%").css("margin-top", "15px").css("margin-bottom", "15px")
    .css("top","15px");

    //滑块的宽高 样式
    $(".ui-slider-handle").css("height", "70px");
    $(".ui-slider-handle").css("width", "60px");
    $(".ui-slider-handle").css("marginLeft", "-23px");
    //$(".ui-slider-handle").css("marginTop", "60px");

    //----------缩放滑块区------------//
    $("#zoomContainer").css("height", "98%");
    $("#zoomContainer").css("width", "80px");

    //---------选择区域框------------//
    $("#cropzoom_container_selector").css("border-width", "2px");

    $("#cropzoom_container_selector").mouseleave(
        function () {
            $("#cropzoom_container_selector").css("border-width", "2px");
        }
    );

    //-------------是否可改变选择框的大小,复选框的开关----------//
    $(".ui-resizable-handle").hide();
}

/*
-------- 使图片剪裁区域垂直居中------------
*/
function setCropVerticalCenter() {


    //承载Div高度
    var _cropMainHeight = 585;
    //插件区域高度
    var _cropZoomHeight = $("#hidCropZoomHeight").val().trim();
    //最终上边距高度
    var _marginTop = (_cropMainHeight - _cropZoomHeight) / 2
    console.log(_marginTop);

    //设置插件区域边距
    $("#cropzoom_container").css("top", _marginTop + 80);

}


