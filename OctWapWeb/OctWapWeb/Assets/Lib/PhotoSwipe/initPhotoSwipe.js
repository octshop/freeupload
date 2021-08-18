
//==================调用方法==========================//
//从Http请求中得到的 需要预览的图片数组信息
/*var _itemImgMsgArr = [
    {
        src: 'https://placekitten.com/600/400',
        title: '<div style=\"font-size: 30px;\">图片标题111111图片标题111111图片标题111111图片标题111111</span>',
        w: 0,
        h: 0

    },
    {
        src: 'https://placekitten.com/1200/900',
        title: '图片标题222222',
        w: 0,
        h: 0
    }
    ,
    {
        src: 'http://i1.shaodiyejin.com/uploads/tu/201909/9999/4e7fb15de9.jpg',
        title: '图片标题222222',
        w: 0,
        h: 0
    }
    ,
    {
        src: 'http://i1.shaodiyejin.com/uploads/tu/201909/9999/906de48376.jpg',
        title: '图片标题222222',
        w: 0,
        h: 0
    }
    ,
    {
        src: 'http://i1.shaodiyejin.com/uploads/tu/201910/9999/7fb59ddf02.jpg',
        title: '图片标题222222',
        w: 0,
        h: 0
    }
    ,
    {
        src: 'http://i1.shaodiyejin.com/uploads/tu/201911/9999/320dc3e405.jpg',
        title: '图片标题222222',
        w: 0,
        h: 0
    }

];

$(function () {

    //初始化 PhotoSwipe 相册浏览   -- $(function(){  在这里调用，必须是加载完成所有文件 });
    initPhotoSwipeAlbum(_itemImgMsgArr, 3);


})*/


//=======================初始化 PhotoSwipe 支持移动手机的纯js图片浏览与切换 ==============//

//引入需要的Js文件 和 Css文件
var myJsValFilePath = "../Assets/Lib/PhotoSwipe/"; //插件文件所有的相对目录

var myJsValFile = "";//加载Css文件myJsValFile += "<link href=\"" + myJsValFilePath + "photoswipe.css\" rel=\"stylesheet\" type=\"text/css\" />";myJsValFile += "<link href=\"" + myJsValFilePath + "default-skin/default-skin.css\" rel=\"stylesheet\" type=\"text/css\" />";//加载Js文件myJsValFile += "<script src=\"" + myJsValFilePath + "photoswipe.min.js\" type=\"text/javascript\"></script>";myJsValFile += "<script src=\"" + myJsValFilePath + "photoswipe-ui-default.min.js\" type=\"text/javascript\"></script>";myJsValFile += "<script src=\"" + myJsValFilePath + "getImageSize.js\" type=\"text/javascript\"></script>";//输出文件内容document.write(myJsValFile);//==============================具体初始化内容=======================================////浏览图片PhotoSwipe的数据列表var _itemImgMsgArr = null;//当前加载的图片索引
var mLoadIndex = 0;
var mIsAllImageSize = false; //是否全部都自动设置了图片尺寸
var gallery = null;

var mIsIniting = false; //是否初始化中

/**
 * 初始化 PhotoSwipe 相册浏览   -- $(function(){  在这里调用，必须是加载完成所有文件 });
 * @param pItemImgMsgArr 需要预览的图片数组信息 [{}]
 * @param pCurrentIndex 当前显示的索引
 */
function initPhotoSwipeAlbum(pItemImgMsgArr, pCurrentIndex) {

    if (pItemImgMsgArr == null || pItemImgMsgArr == "") {
        return;
    }

    _itemImgMsgArr = pItemImgMsgArr;

    if (mIsIniting == true) {
        return;
    }

    gallery = null;
    gallery = undefined;

    mIsIniting = true;


    //添加 图片浏览的主体Html代码
    appendXhtmlPhotoSwipe();

    //自动设置所有 需要预览的图片数组中，图片的尺寸属性值
    autoSetAllImageSize();

    setTimeout(function () {

        try {
            //初始化 PhotoSwipe 插件
            initPhotoSwipe(pItemImgMsgArr, pCurrentIndex);
            console.log("执行啦 222222");

            mIsIniting = false; //结束啦初始化
        }
        catch (e) {

        }


    }, 1000)

    ////检测是否设置了所有图片的尺寸{
    //checkIsSetAllImageSize(function (outReTxt) {

    //    if (outReTxt != undefined && outReTxt != null) {
    //        if (outReTxt == "All") {

    //            //初始化 PhotoSwipe 插件
    //            initPhotoSwipe(pItemImgMsgArr, pCurrentIndex);

    //        }
    //    }

    //});

}

/**
 * 添加 图片浏览的主体Html代码
 * */
function appendXhtmlPhotoSwipe() {

    var myJsVal = "";    myJsVal += "<div class=\"pswp\" id=\"PhotoSwipeCotnent\" tabindex=\"-1\" role=\"dialog\" aria-hidden=\"true\">";    myJsVal += "        <div class=\"pswp__bg\"></div>";    myJsVal += "        <div class=\"pswp__scroll-wrap\">";    myJsVal += "            <div class=\"pswp__container\">";    myJsVal += "                <div class=\"pswp__item\"></div>";    myJsVal += "                <div class=\"pswp__item\"></div>";    myJsVal += "                <div class=\"pswp__item\"></div>";    myJsVal += "            </div>";    myJsVal += "            <div class=\"pswp__ui pswp__ui--hidden\">";    myJsVal += "                <div class=\"pswp__top-bar\">";    myJsVal += "                    <div class=\"pswp__counter\"></div>";    myJsVal += "                    <button class=\"pswp__button pswp__button--close\" title=\"Close (Esc)\"></button>";    myJsVal += "                    <button class=\"pswp__button pswp__button--share\" title=\"Share\"></button>";    myJsVal += "                    <button class=\"pswp__button pswp__button--fs\" title=\"Toggle fullscreen\"></button>";    myJsVal += "                    <button class=\"pswp__button pswp__button--zoom\" title=\"Zoom in/out\"></button>";    myJsVal += "                    <div class=\"pswp__preloader\">";    myJsVal += "                        <div class=\"pswp__preloader__icn\">";    myJsVal += "                            <div class=\"pswp__preloader__cut\">";    myJsVal += "                                <div class=\"pswp__preloader__donut\"></div>";    myJsVal += "                            </div>";    myJsVal += "                        </div>";    myJsVal += "                    </div>";    myJsVal += "                </div>";    myJsVal += "                <div class=\"pswp__share-modal pswp__share-modal--hidden pswp__single-tap\">";    myJsVal += "                    <div class=\"pswp__share-tooltip\"></div>";    myJsVal += "                </div>";    myJsVal += "                <button class=\"pswp__button pswp__button--arrow--left\" title=\"Previous (arrow left)\">";    myJsVal += "                </button>";    myJsVal += "                <button class=\"pswp__button pswp__button--arrow--right\" title=\"Next (arrow right)\">";    myJsVal += "                </button>";    myJsVal += "                <div class=\"pswp__caption\">";    myJsVal += "                    <div class=\"pswp__caption__center\"></div>";    myJsVal += "                </div>";    myJsVal += "            </div>";    myJsVal += "        </div>";    myJsVal += "    </div>";
    //删除之前添加的
    $("#PhotoSwipeCotnent").remove();
    $("#PhotoSwipeCotnent").empty();

    //将代码追加到Body中
    $("body").append(myJsVal);

}

/**
 * 检测是否设置了所有图片的尺寸
 * @param pCallBack 回调函数，有返回值 All 表示已全部设置
 */

function checkIsSetAllImageSize(pCallBack) {

    for (var i = 0; i < _itemImgMsgArr.length; i++) {

        //console.log(_itemImgMsgArr[i].w);
        if (_itemImgMsgArr[i].w <= 0) {

            mIsAllImageSize = false;
            //重新进行循环检测
            setTimeout(function () {

                checkIsSetAllImageSize(pCallBack);

            }, 300);
            break;
        }
    }

    pCallBack("All");
}


/**
 * 自动设置所有 需要预览的图片数组中，图片的尺寸属性值
 * */
function autoSetAllImageSize() {

    //定时任务
    setTimeout(function () {

        //得到并设置数组对象中，图片的尺寸
        getSetImageSize(mLoadIndex, function () {


            if (mLoadIndex < _itemImgMsgArr.length - 1) {
                //重新调用,自动设置所有 需要预览的图片数组中，图片的尺寸属性值
                autoSetAllImageSize();
            }

            mLoadIndex++;

        })

    }, 1);

}

/**
 * 得到并设置数组对象中，图片的尺寸
 * @param pItemIndexImg 数组的索引值
 * @param pCallBack 异步回调函数
 */
function getSetImageSize(pItemIndexImg, pCallBack) {

    try {

        var _src = _itemImgMsgArr[pItemIndexImg].src;

        //获取要预览的图片大小尺寸，以px为单位
        imgReady(_src, function () {
            console.log('size ready: width=' + this.width + '; height=' + this.height);
            //设置图片尺寸
            _itemImgMsgArr[pItemIndexImg].w = this.width;
            _itemImgMsgArr[pItemIndexImg].h = this.height;

            pCallBack();
        });

    }
    catch (e) { }

}


/**
 * 初始化 PhotoSwipe 插件
 * @param pItemImgMsgArr 需要预览的图片数组信息 [{}]
 * @param 当前显示的索引
 */
function initPhotoSwipe(pItemImgMsgArr, pCurrentIndex) {

    var pswpElement = document.querySelectorAll('.pswp')[0];

    // build items array
    //var items = [
    //    {
    //        src: 'https://placekitten.com/600/400',
    //        title: '<div style=\"font-size: 30px;\">图片标题111111图片标题111111图片标题111111图片标题111111</span>',
    //        w: 600,
    //        h: 400

    //    },
    //    {
    //        src: 'https://placekitten.com/1200/900',
    //        title: '图片标题222222',
    //        w: 1200,
    //        h: 900
    //    }
    //];

    var items = pItemImgMsgArr;

    // define options (if needed)
    var options = {
        // optionName: 'option value'
        // for example:
        index: pCurrentIndex // start at first slide
    };

    // Initializes and opens PhotoSwipe
    gallery = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, items, options);
    gallery.init();
    //console.log(gallery);

}





