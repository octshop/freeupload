
//==================���÷���==========================//
//��Http�����еõ��� ��ҪԤ����ͼƬ������Ϣ
/*var _itemImgMsgArr = [
    {
        src: 'https://placekitten.com/600/400',
        title: '<div style=\"font-size: 30px;\">ͼƬ����111111ͼƬ����111111ͼƬ����111111ͼƬ����111111</span>',
        w: 0,
        h: 0

    },
    {
        src: 'https://placekitten.com/1200/900',
        title: 'ͼƬ����222222',
        w: 0,
        h: 0
    }
    ,
    {
        src: 'http://i1.shaodiyejin.com/uploads/tu/201909/9999/4e7fb15de9.jpg',
        title: 'ͼƬ����222222',
        w: 0,
        h: 0
    }
    ,
    {
        src: 'http://i1.shaodiyejin.com/uploads/tu/201909/9999/906de48376.jpg',
        title: 'ͼƬ����222222',
        w: 0,
        h: 0
    }
    ,
    {
        src: 'http://i1.shaodiyejin.com/uploads/tu/201910/9999/7fb59ddf02.jpg',
        title: 'ͼƬ����222222',
        w: 0,
        h: 0
    }
    ,
    {
        src: 'http://i1.shaodiyejin.com/uploads/tu/201911/9999/320dc3e405.jpg',
        title: 'ͼƬ����222222',
        w: 0,
        h: 0
    }

];

$(function () {

    //��ʼ�� PhotoSwipe ������   -- $(function(){  ��������ã������Ǽ�����������ļ� });
    initPhotoSwipeAlbum(_itemImgMsgArr, 3);


})*/


//=======================��ʼ�� PhotoSwipe ֧���ƶ��ֻ��Ĵ�jsͼƬ������л� ==============//

//������Ҫ��Js�ļ� �� Css�ļ�
var myJsValFilePath = "../Assets/Lib/PhotoSwipe/"; //����ļ����е����Ŀ¼

var myJsValFile = "";//����Css�ļ�myJsValFile += "<link href=\"" + myJsValFilePath + "photoswipe.css\" rel=\"stylesheet\" type=\"text/css\" />";myJsValFile += "<link href=\"" + myJsValFilePath + "default-skin/default-skin.css\" rel=\"stylesheet\" type=\"text/css\" />";//����Js�ļ�myJsValFile += "<script src=\"" + myJsValFilePath + "photoswipe.min.js\" type=\"text/javascript\"></script>";myJsValFile += "<script src=\"" + myJsValFilePath + "photoswipe-ui-default.min.js\" type=\"text/javascript\"></script>";myJsValFile += "<script src=\"" + myJsValFilePath + "getImageSize.js\" type=\"text/javascript\"></script>";//����ļ�����document.write(myJsValFile);//==============================�����ʼ������=======================================////���ͼƬPhotoSwipe�������б�var _itemImgMsgArr = null;//��ǰ���ص�ͼƬ����
var mLoadIndex = 0;
var mIsAllImageSize = false; //�Ƿ�ȫ�����Զ�������ͼƬ�ߴ�
var gallery = null;

var mIsIniting = false; //�Ƿ��ʼ����

/**
 * ��ʼ�� PhotoSwipe ������   -- $(function(){  ��������ã������Ǽ�����������ļ� });
 * @param pItemImgMsgArr ��ҪԤ����ͼƬ������Ϣ [{}]
 * @param pCurrentIndex ��ǰ��ʾ������
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


    //��� ͼƬ���������Html����
    appendXhtmlPhotoSwipe();

    //�Զ��������� ��ҪԤ����ͼƬ�����У�ͼƬ�ĳߴ�����ֵ
    autoSetAllImageSize();

    setTimeout(function () {

        try {
            //��ʼ�� PhotoSwipe ���
            initPhotoSwipe(pItemImgMsgArr, pCurrentIndex);
            console.log("ִ���� 222222");

            mIsIniting = false; //��������ʼ��
        }
        catch (e) {

        }


    }, 1000)

    ////����Ƿ�����������ͼƬ�ĳߴ�{
    //checkIsSetAllImageSize(function (outReTxt) {

    //    if (outReTxt != undefined && outReTxt != null) {
    //        if (outReTxt == "All") {

    //            //��ʼ�� PhotoSwipe ���
    //            initPhotoSwipe(pItemImgMsgArr, pCurrentIndex);

    //        }
    //    }

    //});

}

/**
 * ��� ͼƬ���������Html����
 * */
function appendXhtmlPhotoSwipe() {

    var myJsVal = "";    myJsVal += "<div class=\"pswp\" id=\"PhotoSwipeCotnent\" tabindex=\"-1\" role=\"dialog\" aria-hidden=\"true\">";    myJsVal += "        <div class=\"pswp__bg\"></div>";    myJsVal += "        <div class=\"pswp__scroll-wrap\">";    myJsVal += "            <div class=\"pswp__container\">";    myJsVal += "                <div class=\"pswp__item\"></div>";    myJsVal += "                <div class=\"pswp__item\"></div>";    myJsVal += "                <div class=\"pswp__item\"></div>";    myJsVal += "            </div>";    myJsVal += "            <div class=\"pswp__ui pswp__ui--hidden\">";    myJsVal += "                <div class=\"pswp__top-bar\">";    myJsVal += "                    <div class=\"pswp__counter\"></div>";    myJsVal += "                    <button class=\"pswp__button pswp__button--close\" title=\"Close (Esc)\"></button>";    myJsVal += "                    <button class=\"pswp__button pswp__button--share\" title=\"Share\"></button>";    myJsVal += "                    <button class=\"pswp__button pswp__button--fs\" title=\"Toggle fullscreen\"></button>";    myJsVal += "                    <button class=\"pswp__button pswp__button--zoom\" title=\"Zoom in/out\"></button>";    myJsVal += "                    <div class=\"pswp__preloader\">";    myJsVal += "                        <div class=\"pswp__preloader__icn\">";    myJsVal += "                            <div class=\"pswp__preloader__cut\">";    myJsVal += "                                <div class=\"pswp__preloader__donut\"></div>";    myJsVal += "                            </div>";    myJsVal += "                        </div>";    myJsVal += "                    </div>";    myJsVal += "                </div>";    myJsVal += "                <div class=\"pswp__share-modal pswp__share-modal--hidden pswp__single-tap\">";    myJsVal += "                    <div class=\"pswp__share-tooltip\"></div>";    myJsVal += "                </div>";    myJsVal += "                <button class=\"pswp__button pswp__button--arrow--left\" title=\"Previous (arrow left)\">";    myJsVal += "                </button>";    myJsVal += "                <button class=\"pswp__button pswp__button--arrow--right\" title=\"Next (arrow right)\">";    myJsVal += "                </button>";    myJsVal += "                <div class=\"pswp__caption\">";    myJsVal += "                    <div class=\"pswp__caption__center\"></div>";    myJsVal += "                </div>";    myJsVal += "            </div>";    myJsVal += "        </div>";    myJsVal += "    </div>";
    //ɾ��֮ǰ��ӵ�
    $("#PhotoSwipeCotnent").remove();
    $("#PhotoSwipeCotnent").empty();

    //������׷�ӵ�Body��
    $("body").append(myJsVal);

}

/**
 * ����Ƿ�����������ͼƬ�ĳߴ�
 * @param pCallBack �ص��������з���ֵ All ��ʾ��ȫ������
 */

function checkIsSetAllImageSize(pCallBack) {

    for (var i = 0; i < _itemImgMsgArr.length; i++) {

        //console.log(_itemImgMsgArr[i].w);
        if (_itemImgMsgArr[i].w <= 0) {

            mIsAllImageSize = false;
            //���½���ѭ�����
            setTimeout(function () {

                checkIsSetAllImageSize(pCallBack);

            }, 300);
            break;
        }
    }

    pCallBack("All");
}


/**
 * �Զ��������� ��ҪԤ����ͼƬ�����У�ͼƬ�ĳߴ�����ֵ
 * */
function autoSetAllImageSize() {

    //��ʱ����
    setTimeout(function () {

        //�õ���������������У�ͼƬ�ĳߴ�
        getSetImageSize(mLoadIndex, function () {


            if (mLoadIndex < _itemImgMsgArr.length - 1) {
                //���µ���,�Զ��������� ��ҪԤ����ͼƬ�����У�ͼƬ�ĳߴ�����ֵ
                autoSetAllImageSize();
            }

            mLoadIndex++;

        })

    }, 1);

}

/**
 * �õ���������������У�ͼƬ�ĳߴ�
 * @param pItemIndexImg ���������ֵ
 * @param pCallBack �첽�ص�����
 */
function getSetImageSize(pItemIndexImg, pCallBack) {

    try {

        var _src = _itemImgMsgArr[pItemIndexImg].src;

        //��ȡҪԤ����ͼƬ��С�ߴ磬��pxΪ��λ
        imgReady(_src, function () {
            console.log('size ready: width=' + this.width + '; height=' + this.height);
            //����ͼƬ�ߴ�
            _itemImgMsgArr[pItemIndexImg].w = this.width;
            _itemImgMsgArr[pItemIndexImg].h = this.height;

            pCallBack();
        });

    }
    catch (e) { }

}


/**
 * ��ʼ�� PhotoSwipe ���
 * @param pItemImgMsgArr ��ҪԤ����ͼƬ������Ϣ [{}]
 * @param ��ǰ��ʾ������
 */
function initPhotoSwipe(pItemImgMsgArr, pCurrentIndex) {

    var pswpElement = document.querySelectorAll('.pswp')[0];

    // build items array
    //var items = [
    //    {
    //        src: 'https://placekitten.com/600/400',
    //        title: '<div style=\"font-size: 30px;\">ͼƬ����111111ͼƬ����111111ͼƬ����111111ͼƬ����111111</span>',
    //        w: 600,
    //        h: 400

    //    },
    //    {
    //        src: 'https://placekitten.com/1200/900',
    //        title: 'ͼƬ����222222',
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





