
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

var myJsValFile = "";
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


    //���� ͼƬ���������Html����
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
 * ���� ͼƬ���������Html����
 * */
function appendXhtmlPhotoSwipe() {

    var myJsVal = "";
    //ɾ��֮ǰ���ӵ�
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
            //console.log('size ready: width=' + this.width + '; height=' + this.height);
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




