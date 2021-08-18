//===================发布商品====================//

/**-----定义公共变量------**/

//AjaxURL
var mAjaxUrl = "../Goods/GoodsAdd";

//编辑器对象
var mEditor;

/******数据分页的变量********/

var mOctWapWeb_AddrDomain = "";

//信息ID
var mMsgID = 0;
//商家UserID
var mUserID = 0;
//信息Guid 与发布商品MsgGuid相关联 ( 62f2c54e-2517-4a18-9082-f9fb2300c5f4 ) 
var mGoodsMsgGuid = "";

//添加规格，价格，库存窗口Html
var mPriceSpecWinHtml = "";
//插入图片窗口Html
var mInsertImgWinHtml = "";
//自定义属性窗口Html
var mGoodsMyPropWinHtml = "";
//添加赠品窗口Html
var mGoodsGiftWinHtml = "";
//规格标题
var mSpecTitle = "";
//属性标题
var mPropTitle = "";

//存储自定义属性的字符串数组 [ 生产地 | 中国 ^ 流行元素 | 短袖 ^ 流行元素 | 短袖 ]
var mGoodsMypropArr = "";
//存储规格，价格，库存的字符串数组 
var mGoodsSpecPriceStockArr = "";
var mGoodsSpecTitle = ""; //规格标题
var mGoodsPropTitle = ""; //属性标题

//初始化上传插件的字符串数组  SpecIndex ~ PropIndex~ PropIndex ^ SpecIndex ~ PropIndex~ PropIndex [1~1~2 ^ 2~1~2]
var mInitUploadSpecPriceArr = "";

//规格属性价格库存 Json对象列表
var mJsonArrSpecProp = "";

//选择的赠品ID拼接字符串数组(用 "^" 连接)
var mSelGiftIDArr = "";
//选择的赠品数量  拼接字符串数组(用 "^" 连接)
var mSelGiftNumArr = "";

//赠品列表 Json对象
var mJsonGooGiftMsgList;

//店铺商品类别子级列表 Json对象
var mJsonShopGoodsTypeSubArr;

/**------初始化------**/
$(function () {

    //判断是通过手机访问还是电脑访问的 定义编辑框的宽度
    if (isVisiteByMobile() == "mobile") {
        $("#EditorGoodsDesc").css("width", "720");
        $(".goods-desc-btn").css("width", "720");
    }

    mOctWapWeb_AddrDomain = $("#hidOctWapWeb_AddrDomain").val().trim();

    //商家UserID
    mUserID = $("#hidShopUserID").val().trim();

    //初始化编辑器
    initEditor();

    //初始化插入图片窗口显示代码
    initInsertImgWinHtml();

    //初始化自定义属性窗口显示代码
    initGoodsMyPropWinHtml();

    //初始化添加赠品窗口显示代码
    initGoodsGiftWinHtml();

    //加载顶级商品类目列表
    loadGoodsTypeFirst();

    //初始化规格价格库存窗口显示代码
    initPriceSpecWinHtml();

    //初始化所有商品图片上传插件
    initAllGoodsImgUploadFile();

    //加载店铺商品类别父级和子级列表
    loadShopGoodsType();

    //初始化商家的运费模板
    initFreightTemplateList();
});


//--------------插入图片窗口-----------//

/**
 * 初始化插入图片窗口显示代码
 */
function initInsertImgWinHtml() {
    //获取窗口显示代码
    mInsertImgWinHtml = $("#InsertImgWin").html();
    $("#InsertImgWin").empty();
}

/**
 * 打开编辑窗口
 */
function openInsertImgWin() {

    //mMsgID = pMsgID;

    //打开Dialog弹出窗口
    openDialogWinNoClose("插入图片", mInsertImgWinHtml, function () {

        //确定按钮
        //alert("mInsertImgArr=" + mInsertImgArr);
        //插入选中的图片到编辑中
        insertImgToEditor();

        //关闭窗口
        closeDialogWin();

    }, function () {

        //清空已选中的图片
        mInsertImgArr = "";

    }, 700);

    //初始化商家的相册信息 [相册名称下拉列表]
    initShopAlbum();
}


/**
 * 初始化编辑器
 * */
function initEditor() {

    // 关闭过滤模式，保留所有标签 ,这样设置后那么 style=\"color:red\" 才有效
    KindEditor.options.filterMode = false;

    //将初始化KindEditor
    KindEditor.ready(function (K) {
        mEditor = window.editor = K.create('#EditorGoodsDesc', {
            newlineTag: "br", //参数设置
            allowUpload: false,
            allowImageUpload: false, //不允许上传图片
            designMode: true,
            items: [
                'source', '|', 'undo', 'redo', '|', 'fontname', 'fontsize', '|', 'forecolor', 'hilitecolor', 'bold', 'italic', 'underline',
                'removeformat', '|', 'justifyleft', 'justifycenter', 'justifyright', 'insertorderedlist',
                'insertunorderedlist', '|', 'emoticons', 'image', 'baidumap']
        });

        //判断是通过手机访问还是电脑访问的
        if (isVisiteByMobile() == "mobile") {
            try {
                mEditor.clickToolbar('source');
            }
            catch (e) { }
        }
    });
}

/**
 * 得到KindEditor的内容
 * */
function getEditorContent() {

    // 同步数据后可以直接取得textarea的value,必须同步否则得不到值
    mEditor.sync();
    //得到编辑器内容
    var _editorContent = $("#EditorGoodsDesc").val().trim();
    return _editorContent;
}

/**
 * 判断是通过手机访问还是电脑访问的
 * @returns 返回值：mobile ， computer
 * */
function isVisiteByMobile() {
    var ua = navigator.userAgent;
    var ipad = ua.match(/(iPad).*OS\s([\d_]+)/),
        isIphone = !ipad && ua.match(/(iPhone\sOS)\s([\d_]+)/),
        isAndroid = ua.match(/(Android)\s+([\d.]+)/),
        isMobile = isIphone || isAndroid;
    if (isMobile) {
        //location.href = 'http://m.domain.com';
        //alert("通过【手机】访问的");
        return "mobile";
    } else {
        //location.href = 'http://www.domain.com';
        //alert("通过【电脑】访问的");
        return "computer";
    }

    //或者单独判断iphone或android 
    if (isIphone) {
        //code 
    }
    else if (isAndroid) {
        //code
    } else {
        //code
    }
}

//===============插入图片函数================//

//存储要插入图片的URL 如：“//localhost:1400/Upload/ShopHeaderImg/SHI_1_201906221720413810.jpg^//localhost:1400/Upload/ShopHeaderImg/SHI_1_201906221720413810.jpg^//localhost:1400/Upload/ShopHeaderImg/SHI_1_201906221720413810.jpg”
var mInsertImgArr = "";

/**
 * 选中和取消插入的图片,CheckBox变化时事件
 * */
function chgSelInsertImgCb() {

    var _dataImgUrl = $(event.currentTarget).attr("data-imgurl");
    var _checked = $(event.currentTarget).prop("checked");
    console.log("_dataImgUrl=" + _dataImgUrl);
    console.log("_checked=" + _checked);

    //alert("开始mInsertImgArr=" + mInsertImgArr);

    //选中图片
    if (_checked) {
        if (mInsertImgArr == "") {
            mInsertImgArr = _dataImgUrl;
        }
        else {
            mInsertImgArr += "^" + _dataImgUrl;
        }

        //alert("选中图片!");
    }
    else {
        //判断被取消选择的是在前，中，后哪个位置
        if (mInsertImgArr.indexOf("^" + _dataImgUrl + "^") >= 0) //在中间
        {
            mInsertImgArr = mInsertImgArr.replace("^" + _dataImgUrl + "^", "^");
            //alert("在中间");
        }
        else if (mInsertImgArr.indexOf(_dataImgUrl + "^") == 0) //在最前
        {
            mInsertImgArr = mInsertImgArr.replace(_dataImgUrl + "^", "");
            //alert("在最前");
        }
        else if (mInsertImgArr.indexOf("^" + _dataImgUrl) >= 0) //在最后
        {
            mInsertImgArr = mInsertImgArr.replace("^" + _dataImgUrl, "");
            //alert("在最后");
        }
        else //只选择一张图片
        {
            mInsertImgArr = "";
            //alert("只选择一张图片!");
        }

        //alert("取消选中图片!");
    }
    console.log("mInsertImgArr=" + mInsertImgArr);
    //alert("mInsertImgArr=" + mInsertImgArr);
}

/**
 * 插入选中的图片到编辑中
 * */
function insertImgToEditor() {

    //构造需要插入的图标显示代码
    var _xhtml = "";
    if (mInsertImgArr.indexOf("^") >= 0) {
        //分割字符
        var _insertImgArr = mInsertImgArr.split('^');
        for (var i = 0; i < _insertImgArr.length; i++) {
            _xhtml += "<div style=\"clear:both;width:100%;padding:0;margin:0;\"><img src=\"" + _insertImgArr[i] + "\" /></div>";
        }
    }
    else {
        _xhtml += "<div style=\"clear:both;width:100%;padding:0;margin:0;\"><img src=\"" + mInsertImgArr + "\" /></div>";
    }
    //显示代码插入编辑器
    mEditor.insertHtml(_xhtml);
    //清空已选中的图片
    mInsertImgArr = "";
}



//-----------------自定义属性窗口-----------------//
/**
 * 初始化自定义属性窗口显示代码
 */
function initGoodsMyPropWinHtml() {
    //获取窗口显示代码
    mGoodsMyPropWinHtml = $("#GoodsMyPropWin").html();
    $("#GoodsMyPropWin").empty();
}

/**
 * 打开自定义属性窗口
 */
function openGoodsMyPropWin() {

    //mMsgID = pMsgID;

    //打开Dialog弹出窗口
    openDialogWinNoClose("添加自定义属性", mGoodsMyPropWinHtml, function () {

        //确定按钮
        //保存自定义属性项
        saveGoodsMyProp();

        //关闭窗口
        closeDialogWin();

    }, function () {


    }, 580);

    //初始化自定义属性编辑窗口项
    initGoodsMyPropItem();
}

/**
 * 初始化自定义属性编辑窗口项
 * */
function initGoodsMyPropItem() {

    if (mGoodsMypropArr == "") {
        return;
    }

    //[ 生产地 | 中国 ^ 流行元素 | 短袖 ^ 流行元素 | 短袖 ]
    var _goodsMyPropArr = mGoodsMypropArr.split('^');

    //构造Item显示代码
    var _goodsMyPropItemHtml = "";
    for (var i = 0; i < _goodsMyPropArr.length; i++) {

        var _goodsMyPropNameValArr = _goodsMyPropArr[i].split('|');
        var _goodsPropName = _goodsMyPropNameValArr[0];
        var _goodsPropValue = _goodsMyPropNameValArr[1];;

        _goodsMyPropItemHtml += "<li><input placeholder=\"属性名称\" name=\"name_GoodsPropName\" class=\"goods-prop-name\" value=\"" + _goodsPropName + "\" />";        _goodsMyPropItemHtml += "<b>:</b>";        _goodsMyPropItemHtml += "<input placeholder=\"属性值\" name=\"name_GoodsPropValue\" class=\"goods-prop-value\" value=\"" + _goodsPropValue + "\" /></li>";
    }
    //显示代码插入前台    $("#GoodsMyPropUl").html(_goodsMyPropItemHtml);
}

/**
 * 添加自定义属性项
 * */
function addGoodsMyPropItem() {
    //构造显示代码
    var _goodsMyPropItemHtml = "<li><input placeholder=\"属性名称\" name=\"name_GoodsPropName\" class=\"goods-prop-name\" />";    _goodsMyPropItemHtml += "<b>:</b>";    _goodsMyPropItemHtml += "<input placeholder=\"属性值\" name=\"name_GoodsPropValue\" class=\"goods-prop-value\" /></li>";    //显示代码插入前台    $("#GoodsMyPropUl").append(_goodsMyPropItemHtml);}

/**
 * 删除自定义属性项
 * */
function delGoodsMyPropItem() {
    $("#GoodsMyPropUl li:last").remove();
}

/**
 * 保存自定义属性项
 * */
function saveGoodsMyProp() {

    mGoodsMypropArr = "";

    //统计自定义属性项有多少
    var _countGoodsPropNameItem = $("input[name='name_GoodsPropName']").length;
    console.log("_countGoodsPropNameItem=" + _countGoodsPropNameItem);
    //alert("_countGoodsPropNameItem=" + _countGoodsPropNameItem);

    var _goodsPropNameItemArr = $("input[name='name_GoodsPropName']");
    var _goodsPropValueItemArr = $("input[name='name_GoodsPropValue']");

    //构造显示代码
    var _xhtml = "";

    //循环构造 存储自定义属性的字符串数组
    for (var i = 0; i < _countGoodsPropNameItem; i++) {
        var _goodsPropName = $(_goodsPropNameItemArr[i]).val();
        var _goodsPropValue = $(_goodsPropValueItemArr[i]).val();
        console.log("_goodsPropName=" + _goodsPropName + " | _goodsPropValue=" + _goodsPropValue);
        //alert("_goodsPropName=" + _goodsPropName + " | _goodsPropValue=" + _goodsPropValue);
        if (_goodsPropName != "" && _goodsPropValue != "") {
            //保存自定义属性
            mGoodsMypropArr += _goodsPropName + "|" + _goodsPropValue + "^"

            //构造显示代码
            _xhtml += "<li><span>" + _goodsPropName + ":</span>" + _goodsPropValue + "</li>";        }
    }
    //去掉最后一个“^”
    mGoodsMypropArr = removeFrontAndBackChar(mGoodsMypropArr, "^");
    console.log("mGoodsMypropArr=" + mGoodsMypropArr);
    //alert("mGoodsMypropArr=" + mGoodsMypropArr);
    if (mGoodsMypropArr != "") {
        //显示代码插入前台 
        $("#GoodsPropUl").html(_xhtml);
    }
    else {
        $("#GoodsPropUl").html("<li><span>属性名称(如:生产地):</span>属性值(如: 中国大陆)</li>");

    }
}



//--------------添加赠品窗口-----------//
/**
 * 初始化添加赠品窗口显示代码
 */
function initGoodsGiftWinHtml() {
    //获取窗口显示代码
    mGoodsGiftWinHtml = $("#GoodsGiftWin").html();
    $("#GoodsGiftWin").empty();
}

/**
 * 打开添加赠品窗口
 */
function openGoodsGiftWin() {

    //mMsgID = pMsgID;

    //打开Dialog弹出窗口
    openDialogWinNoClose("添加赠品", mGoodsGiftWinHtml, function () {

        mSelGiftNumArr = "";

        //得到选择的赠品ID字符串数组
        getSelGiftIDArr();

        //显示代码插入前台
        $("#GoodsGiftUL").html(xhtmlSelGiftList());

        //得到选择赠品的数量
        getSelGiftNumArr();

        console.log("确认后mSelGiftNumArr=" + mSelGiftNumArr);

        //关闭窗口
        closeDialogWin();

    }, function () {


    }, 600);

    //初始化商家赠品列表
    initShopGiftMsgList();

}



//---------------------添加规格，价格，库存窗口---------------------//
/**
 * 初始化规格价格库存窗口显示代码
 */
function initPriceSpecWinHtml() {
    //获取窗口显示代码
    mPriceSpecWinHtml = $("#GoodsPriceSpecWin").html();
    $("#GoodsPriceSpecWin").empty();
}

/**
 * 打开规格价格库存窗口
 */
function openPriceSpecWin() {

    //mMsgID = pMsgID;

    //打开Dialog弹出窗口
    openCustomDialogWinNoClose("编辑规格价格库存", mPriceSpecWinHtml, 785, function () {

        //添加规格项
        addSpecItem();

    }, function () {
        //[保存]规格
        //alert("[保存]规格");
        saveGooSpecParamPre();

        //关闭窗口
        //closeCustomDialogWin();

    });

    if (mGoodsSpecPriceStockArr == "") {
        //初始化指定索引的规格属性上传插件
        initSpecPropUploadFile(1);
    }
    else {

    }

    //初始化规格属性窗口信息
    initSpecPropFormWin();

}

/**
 * 添加规格项
 * */
function addSpecItem() {

    //得到当前有多少规格项
    var _nameSpecNameCount = document.getElementsByName("name_SpecName").length;
    console.log("nameSpecNameCount=" + _nameSpecNameCount);
    //alert("nameSpecNameCount=" + _nameSpecNameCount);

    //下一个Item的索引
    var _indexItem = _nameSpecNameCount + 1;
    //构造显示代码
    var myJsVal = "";    myJsVal += "                        <div class=\"goods-pricespec-item\">";    myJsVal += "                            <div class=\"pricespec-item-title\">";    myJsVal += "                                <label>规格" + _indexItem + "：</label>";    myJsVal += "                                <span>名称</span><input id=\"id_SpecName_" + _indexItem + "\" name=\"name_SpecName\" type=\"text\" class=\"spec-name-txt\" />";    myJsVal += "<div id=\"id_SpecPriceStock_" + _indexItem + "\"><span>价格</span><input id=\"id_SpecPrice_" + _indexItem + "\" name=\"name_SpecPrice\" type=\"number\" class=\"spec-title-pricestock spec-name-txt\" spec-name-txt\" />";    myJsVal += "                                <span>库存</span><input id=\"id_SpecStock_" + _indexItem + "\" name=\"name_SpecStock\" type=\"number\" class=\"spec-title-pricestock spec-name-txt\" /></div>";    myJsVal += "                                <img id=\"id_SpecPropImg_" + _indexItem + "\"  class=\"pricespec-pre-img\" src=\"../Assets/Imgs/Icon/icon_spec_default.png\" />";    myJsVal += "                                <div class=\"am-form-group am-form-file\">";    myJsVal += "                                    <button type=\"button\" class=\"am-btn am-btn-default am-btn-xs am-round\">";    myJsVal += "                                        <i class=\"am-icon-cloud-upload\"></i> 规格图片(可选)";    myJsVal += "                                    </button>";    myJsVal += "                                    <input id=\"id_SpecPropUpload_" + _indexItem + "\" name=\"name_SpecUpload\" type=\"file\">";    myJsVal += "<input type=\"hidden\" id=\"id_SpecPropUploadValArr_" + _indexItem + "\" name=\"name_SpecUploadValArr\" value=\"\" />";    myJsVal += "                                </div>";    myJsVal += "                            </div>";    myJsVal += "                            <div class=\"pricespec-prop-list\" id=\"id_PropList_" + _indexItem + "\">";    myJsVal += "                            </div>";    myJsVal += "                            <div class=\"pricespec-prop-add\">";    myJsVal += "                                <div class=\"btn-prop-add\" onclick=\"addPropItem(" + _indexItem + ")\">添加属性</div>";    myJsVal += "                                <div onclick=\"removePropItem(" + _indexItem + ")\">删除属性</div>";    myJsVal += "                            </div>";    myJsVal += "                        </div>";
    //显示代码追加前台 
    $("#GoodsPriceSpecList").append(myJsVal);

    //滚动条滚到最后
    $("#GoodsPriceSpecForm").animate({ scrollTop: $("#GoodsPriceSpecForm").prop("scrollHeight") }, 400);

    //初始化指定索引的规格属性上传插件
    initSpecPropUploadFile(_indexItem);
}

/**
 * 添加属性项
 * @param {any} pSpecItemIndex 规格项的索引
 */
function addPropItem(pSpecItemIndex) {

    //得到当前规格项有多少属性项
    var _namePropNameCount = document.getElementsByName("name_PropName_" + pSpecItemIndex).length;
    console.log("_namePropNameCount=" + _namePropNameCount);
    //alert("_namePropNameCount=" + _namePropNameCount);
    //下一个Item的索引
    var _indexPropItem = _namePropNameCount + 1;
    //alert("_indexPropItem=" + _indexPropItem);

    //构造显示代码
    var myJsVal = "";    myJsVal += "<div class=\"pricespec-prop-item\">";    myJsVal += "                                    <span>属性名称</span><input id=\"id_PropName_" + pSpecItemIndex + "_" + _indexPropItem + "\" name=\"name_PropName_" + pSpecItemIndex + "\" type=\"text\" class=\"spec-prop-name-txt spec-name-txt\" />";    myJsVal += "                                    <span>价格</span><input id=\"id_PropPrice_" + pSpecItemIndex + "_" + _indexPropItem + "\" name=\"name_PropPrice_" + pSpecItemIndex + "\" type=\"number\" class=\"spec-name-txt\" />";    myJsVal += "                                    <span>库存</span><input id=\"id_PropStock_" + pSpecItemIndex + "_" + _indexPropItem + "\" name=\"name_PropStock_" + pSpecItemIndex + "\" type=\"number\" class=\"spec-name-txt\" />";    myJsVal += "                                    <img id=\"id_SpecPropImg_" + pSpecItemIndex + "_" + _indexPropItem + "\" class=\"pricespec-pre-img\" src=\"../Assets/Imgs/Icon/icon_spec_default.png\" />";    myJsVal += "                                    <div class=\"am-form-group am-form-file\">";    myJsVal += "                                        <button type=\"button\" class=\"am-btn am-btn-default am-btn-xs am-round\">";    myJsVal += "                                            <i class=\"am-icon-cloud-upload\"></i> 属性图片(可选)";    myJsVal += "                                        </button>";    myJsVal += "                                        <input id=\"id_SpecPropUpload_" + pSpecItemIndex + "_" + _indexPropItem + "\" name=\"name_PropUpload_" + pSpecItemIndex + "\" type=\"file\">";    myJsVal += "<input type=\"hidden\" id=\"id_SpecPropUploadValArr_" + pSpecItemIndex + "_" + _indexPropItem + "\" name=\"name_PropUploadValArr_" + pSpecItemIndex + "\" value=\"\" />";    myJsVal += "                                    </div>";    myJsVal += "                                </div>";    //显示代码追加前台
    $("#id_PropList_" + pSpecItemIndex + "").append(myJsVal);

    //关掉规格的价格和库存
    $("#id_SpecPriceStock_" + pSpecItemIndex).hide();

    //初始化指定索引的规格属性上传插件
    initSpecPropUploadFile(pSpecItemIndex, _indexPropItem);
}


/**
 * 初始化指定索引的规格属性上传插件
 * @param {any} pSpecItemIndex 规格项的索引
 * @param {any} pPropItemIndex 属性项的索引 为“” 则上传规格图片
 */
function initSpecPropUploadFile(pSpecItemIndex, pPropItemIndex) {

    console.log("pSpecItemIndex=" + pSpecItemIndex + " | pPropItemIndex=" + pPropItemIndex);
    //alert("pSpecItemIndex=" + pSpecItemIndex + " | pPropItemIndex=" + pPropItemIndex);

    //if (mUserID == "0" || mUserID == "") {
    //    return;
    //}

    //构造上传控件的ID字符串
    var _uploadIDstr = "id_SpecPropUpload_" + pSpecItemIndex;
    if (pPropItemIndex != "" && pPropItemIndex != undefined) {
        _uploadIDstr += "_" + pPropItemIndex;
    }

    //构造POST参数
    var _dataPost = "Type=1&UserID=" + mUserID;
    console.log(_dataPost);

    $('#' + _uploadIDstr).fileupload({
        url: "../FileUpload/GooSpecParamImg?" + _dataPost + "&rnd=" + Math.random(),
        //dataType: 'json',
        dataType: "text",
        //------------处理上传成功后的事件------------//
        done: function (e, data) {

            //关闭加载提示
            closeLoadingWin();

            //-------------此处是返回后后台文件输出的内容----------------//
            console.log(data.result);
            //alert(data.result);
            //对象化JSON字符串
            var _JsonObj = JSON.parse(data.result);

            //操作错误提示
            if (_JsonObj.ErrCode != null) {
                toastWin(_JsonObj.ErrMsg);
                return;
            }

            mImgKeyGuid = _JsonObj.DataDic.ImgKeyGuid;
            mImgPathDomain = _JsonObj.DataDic.ImgPathDomain;
            console.log("mImgKeyGuid=" + mImgKeyGuid + " | mImgPathDomain=" + mImgPathDomain);
            //alert("mImgKeyGuid=" + mImgKeyGuid + " | mImgPathDomain=" + mImgPathDomain);
            //mImgKeyGuid=91318a05-a4c0-4ff8-95ad-17117eccb7d1 | mImgPathDomain=localhost:1400/Upload/GooSpecParamImg/GSPI_1_201907121414565670.jpg

            //构造隐藏控件的ID字符串
            var _uploadHideIDstr = "id_SpecPropUploadValArr_" + pSpecItemIndex;
            if (pPropItemIndex != "" && pPropItemIndex != undefined) {
                _uploadHideIDstr += "_" + pPropItemIndex;
            }
            //为隐藏控件赋值上传图片信息
            $("#" + _uploadHideIDstr).val(mImgKeyGuid + "~" + mImgPathDomain);

            //构造图片显示控件的ID字符串
            var _uploadSpecPropImgIDstr = "id_SpecPropImg_" + pSpecItemIndex;
            if (pPropItemIndex != "" && pPropItemIndex != undefined) {
                _uploadSpecPropImgIDstr += "_" + pPropItemIndex;
            }
            //为图标赋值
            $("#" + _uploadSpecPropImgIDstr).attr("src", "//" + mImgPathDomain);

        },

        //---------------处理上传进度的方法-------------//
        progressall: function (e, data) {

            console.log("progressall 执行");

            var progress = parseInt(data.loaded / data.total * 100, 10);
            $('#progress').css(
                'width',
                progress + '%'
            );

            //输出进度
            console.log("上传的进度：" + progress);

            if (progress >= 100) {
                //alert("上传成功！");
            }


        }
    }).prop('disabled', !$.support.fileInput)
        .parent().addClass($.support.fileInput ? undefined : 'disabled').on('fileuploadadd', function (e, data) {

            console.log("添加了文件");
            //显示加载提示
            loadingWinToDiv("dragCustomWinDiv");

        });
}


/**
 * 移除最后一个 属性项
 * @param {any} pSpecItemIndex 规格项索引
 */
function removePropItem(pSpecItemIndex) {

    $("#id_PropList_" + pSpecItemIndex + " .pricespec-prop-item:last").remove();
    //(".index li:last").remove()

    //得到当前规格项有多少属性项
    var _namePropNameCount = document.getElementsByName("name_PropName_" + pSpecItemIndex).length;
    console.log("_namePropNameCount=" + _namePropNameCount);

    if (_namePropNameCount <= 0) {
        //显示规格的价格和库存
        $("#id_SpecPriceStock_" + pSpecItemIndex).show();
    }
}

/**
 * 保存 规格，价格，库存窗口
 * */
function saveGooSpecParamPre() {

    //信息Guid 与发布商品MsgGuid相关联
    mGoodsMsgGuid = $("#hidGoodsMsgGuid").val().trim();

    //清除储存值
    mGoodsSpecPriceStockArr = "";

    //规格项数组
    var name_SpecNameArr = $("input[name='name_SpecName']");
    var name_SpecPriceArr = $("input[name='name_SpecPrice']");
    var name_SpecStockArr = $("input[name='name_SpecStock']");
    //这个控件存储的值为 【ImgKeyGuid~ImgURL】 
    var name_SpecUploadValArr = $("input[name='name_SpecUploadValArr']");

    //判断是否添加了规格
    if (name_SpecNameArr.length <= 0) {
        //关闭窗口
        return;
    }

    //标记是否有规格，是否有属性
    var _isHasSpec = false;
    var _isHasProp = false;


    //循环取规格项的属性值数组
    for (var i = 0; i < name_SpecNameArr.length; i++) {

        //规格项的索引从1开始
        var _specIndex = i + 1;

        //获取当前规格项的值
        var val_SpecName = $(name_SpecNameArr[i]).val().trim();
        var val_SpecPrice = $(name_SpecPriceArr[i]).val().trim();
        var val_SpecStock = $(name_SpecStockArr[i]).val().trim();
        var val_SpecUploadValArr = $(name_SpecUploadValArr[i]).val().trim();
        console.log("val_SpecName=" + val_SpecName + " | val_SpecPrice=" + val_SpecPrice + " | val_SpecStock=" + val_SpecStock + " | val_SpecUploadValArr=" + val_SpecUploadValArr);
        //alert("val_SpecName=" + val_SpecName + " | val_SpecPrice=" + val_SpecPrice + " | val_SpecStock=" + val_SpecStock + " | val_SpecUploadValArr=" + val_SpecUploadValArr);

        //属性项数组
        var name_PropNameArr = $("input[name='name_PropName_" + _specIndex + "']");
        var name_PropPriceArr = $("input[name='name_PropPrice_" + _specIndex + "']");
        var name_PropStockArr = $("input[name='name_PropStock_" + _specIndex + "']");
        //这个控件存储的值为 【ImgKeyGuid~ImgURL】 
        var name_PropUploadValArr = $("input[name='name_PropUploadValArr_" + _specIndex + "']");

        //构造规格项拼接字符串
        if (name_PropNameArr.length <= 0 && val_SpecName != "" && val_SpecPrice != "" && val_SpecStock != "" && parseFloat(val_SpecPrice) > 0 && parseFloat(val_SpecStock) > 0) {
            //判断价格和库存是否为数字
            if (checkNumber(val_SpecPrice) == false || isNaN(val_SpecStock)) {
                toastWinToDiv("【价格】和【库存】必须是数字！", "dragCustomWinDiv");
                return;
            }
            //储存规格价格库存值 
            mGoodsSpecPriceStockArr += val_SpecName + "~" + val_SpecPrice + "~" + val_SpecStock + "~" + val_SpecUploadValArr;
        }
        else if (name_PropNameArr.length > 0 && val_SpecName != "") {
            //储存规格价格库存值 
            mGoodsSpecPriceStockArr += val_SpecName + "~" + val_SpecUploadValArr;
        }
        else {
            //继续循环
            continue;
        }

        //标记为有规格
        if (_isHasSpec == false) {
            _isHasSpec = true;
        }

        if (name_PropNameArr.length > 0) {
            mGoodsSpecPriceStockArr += "$";
        }

        //循环取属性项的值 拼接数组
        for (var j = 0; j < name_PropNameArr.length; j++) {

            var val_PropName = $(name_PropNameArr[j]).val().trim();
            var val_PropPrice = $(name_PropPriceArr[j]).val().trim();
            var val_PropStock = $(name_PropStockArr[j]).val().trim();
            var val_PropUploadValArr = $(name_PropUploadValArr[j]).val().trim();


            //判断价格和库存是否为数字
            if (checkNumber(val_PropPrice) == false || val_PropPrice == "" || isNaN(val_PropStock) || val_PropStock == "") {
                toastWinToDiv("属性【价格】和【库存】必须是数字！", "dragCustomWinDiv");
                return;
            }
            if (parseFloat(val_PropPrice) <= 0 || parseFloat(val_PropStock) <= 0) {
                toastWinToDiv("属性【价格】和【库存】必须大于0！", "dragCustomWinDiv");
                return;
            }

            if (val_PropName != "" && val_PropPrice != "" && val_PropStock != "" && parseFloat(val_PropPrice) > 0 && parseFloat(val_PropStock) > 0) {

                //储存规格价格库存
                mGoodsSpecPriceStockArr += val_PropName + "~" + val_PropPrice + "~" + val_PropStock + "~" + val_PropUploadValArr + "|";

                //标记为有属性
                if (_isHasProp == false) {
                    _isHasProp = true;
                }
            }
        }
        //去掉最后一个"|"
        mGoodsSpecPriceStockArr = removeFrontAndBackChar(mGoodsSpecPriceStockArr, "|");

        mGoodsSpecPriceStockArr += "^";

    }
    //去掉最后一个“^”
    mGoodsSpecPriceStockArr = removeFrontAndBackChar(mGoodsSpecPriceStockArr, "^");

    //判断是否输入了规格和属性标题
    if (_isHasSpec) {
        var SpecTitleTxt = $("#SpecTitleTxt").val().trim();
        if (SpecTitleTxt == "") {
            toastWinToDiv("【规格标题】不能为空！", "dragCustomWinDiv");
            $("#SpecTitleTxt").focus();
            return;
        }
        else {
            mGoodsSpecTitle = SpecTitleTxt;
        }
    }
    if (_isHasProp) {
        var SpecAttrNameTxt = $("#SpecAttrNameTxt").val().trim();
        if (SpecAttrNameTxt == "") {
            toastWinToDiv("【属性标题】不能为空！", "dragCustomWinDiv");
            $("#SpecAttrNameTxt").focus();
            return;
        }
        else {
            mGoodsPropTitle = SpecAttrNameTxt;
        }
    }

    //输出规格价格库存
    //console.log("mGoodsSpecPriceStockArr=" + mGoodsSpecPriceStockArr);
    //alert("mGoodsSpecPriceStockArr=" + mGoodsSpecPriceStockArr);

    //当只有规格没有价格库存数时，返回
    if (mGoodsSpecPriceStockArr.indexOf("~$") >= (mGoodsSpecPriceStockArr.length - 2)) {
        mGoodsSpecPriceStockArr = "";
    }

    //--------------发送异步请求保存数据-----------------//
    //显示加载提示
    loadingWinToDiv("dragCustomWinDiv");

    //构造POST参数
    var dataPOST = {
        "Type": "4", "MsgGuid": $("#hidGoodsMsgGuid").val().trim(), "GoodsSpecPriceStockArr": mGoodsSpecPriceStockArr
    };
    console.log(dataPOST);

    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: mAjaxUrl + "?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log(reTxt);
            //移除加载提示
            closeLoadingWin();

            if (reTxt != "") {
                var _jsonObj = JSON.parse(reTxt);
                if (_jsonObj.Msg != "") {
                    toastWinToDiv(_jsonObj.Msg, "dragCustomWinDiv");

                    //保存成功后的逻辑处理

                    mSpecTitle = $("#SpecTitleTxt").val().trim();
                    mPropTitle = $("#SpecAttrNameTxt").val().trim();

                    //console.log("mGoodsSpecPriceStockArr=" + mGoodsSpecPriceStockArr);

                    if (mGoodsSpecPriceStockArr == "") {
                        $("#GoodsSpecPropPriceStockNoDiv").show();
                        $("#GoodsSpecPropPriceStockDiv").hide();
                        $("#BtnDelAllSpecPropMsg").hide();
                    }
                    else {
                        $("#GoodsSpecPropPriceStockNoDiv").hide();
                        $("#GoodsSpecPropPriceStockDiv").show();
                        $("#BtnDelAllSpecPropMsg").show();
                    }

                    //删除因重复上传导致的多余规格图片
                    delGooSpecParamImgRepeat();

                    //关闭窗口
                    closeCustomDialogWin();

                    //加载规格属性信息并构造显示代码
                    loadSpecPropMsgXhtml();

                }
                if (_jsonObj.ErrMsg != "") {
                    toastWinToDiv(_jsonObj.ErrMsg, "dragCustomWinDiv");
                }
            }
        },
        error: function (xhr, errorTxt, status) {
            console.log("异步请求错误，errorTxt=" + errorTxt + " | status=" + status);
            return;
        }
    });
}

/**
 * 删除因重复上传导致的多余规格图片
 * */
function delGooSpecParamImgRepeat() {
    //构造POST参数
    var dataPOST = {
        "Type": "2"
    };
    console.log(dataPOST);

    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: "../FileUpload/GooSpecParamImg?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log(reTxt);
            if (reTxt != "") {

            }
        },
        error: function (xhr, errorTxt, status) {
            console.log("异步请求错误，errorTxt=" + errorTxt + " | status=" + status);
            return;
        }
    });
}

/**
 * 加载顶级商品类目列表
 * */
function loadGoodsTypeFirst() {

    //构造POST参数
    var dataPOST = {
        "Type": "1"
    };
    console.log(dataPOST);

    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: mAjaxUrl + "?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log(reTxt);
            if (reTxt != "") {
                var _jsonObj = JSON.parse(reTxt);
                var _goodsTypeSubListArr = _jsonObj.GoodsTypeSubList;
                //构造显示代码
                var _xhtml = "";
                for (var i = 0; i < _goodsTypeSubListArr.length; i++) {
                    _xhtml += "<div id=\"GoodsType_" + _goodsTypeSubListArr[i].GoodsTypeID + "\" class=\"goods-type-item goods-type-item-1\" onclick=\"loadGoodsTypeSecThird(" + _goodsTypeSubListArr[i].GoodsTypeID + ", 'Second','" + _goodsTypeSubListArr[i].GoodsTypeName + "')\">" + _goodsTypeSubListArr[i].GoodsTypeName + "</div>";                }
                //显示代码插入前台
                $("#GoodsTypeFirstDiv").html(_xhtml);
                //二三级为空
                $("#GoodsTypeSecondDiv").html("");
                $("#GoodsTypeThirdDiv").html("");
                $("#GoodsTypeSpanSecond").html("");
                $("#GoodsTypeSpanThird").html("");
            }
        },
        error: function (xhr, errorTxt, status) {
            console.log("异步请求错误，errorTxt=" + errorTxt + " | status=" + status);
            return;
        }
    });
}

/**
 * 加载加载第二级或第三级商品类目
 * @param {any} pFatherTypeID 父级类目ID
 * @param pSecThird 加载第二级还是第三级 [ Second / Third ]
 * @param pFatherTypeName 父级类目名称
 */
function loadGoodsTypeSecThird(pFatherTypeID, pSecThird, pFatherTypeName) {

    if (pSecThird == "Second") {
        $("#GoodsTypeSecondDiv").html("…加载中…");
        $("#GoodsTypeSpanFirst").html(pFatherTypeName);
        //二三级为空
        $("#GoodsTypeSecondDiv").html("");
        $("#GoodsTypeThirdDiv").html("");
        $("#GoodsTypeSpanSecond").html("");
        $("#GoodsTypeSpanThird").html("");

        $(".goods-type-item-1").css("background", "none");

        //为隐藏控件赋值 第一级类目
        $("#hidFirstGoodsTypeID").val(pFatherTypeID);
        $("#hidSecondGoodsTypeID").val("");
        $("#hidThirdGoodsTypeID").val("");
    }
    else if (pSecThird == "Third") {
        $("#GoodsTypeThirdDiv").html("…加载中…");
        $("#GoodsTypeSpanSecond").html(pFatherTypeName);
        //三级为空
        $("#GoodsTypeThirdDiv").html("");
        $("#GoodsTypeSpanThird").html("");

        $(".goods-type-item-2").css("background", "none");

        //为隐藏控件赋值 第二级类目
        $("#hidSecondGoodsTypeID").val(pFatherTypeID);
        $("#hidThirdGoodsTypeID").val("");
    }
    else if (pSecThird == "Four") {
        $("#GoodsTypeSpanThird").html(pFatherTypeName);

        $(".goods-type-item-3").css("background", "none");

        //为隐藏控件赋值 第三级类目
        $("#hidThirdGoodsTypeID").val(pFatherTypeID);

        //加载指定记录条数的 商品简单信息列表，根据第三级商品类目
        loadListGoodsMsgSimpleByThirdType(pFatherTypeID);

    }

    //设置当前选择样式
    $("#GoodsType_" + pFatherTypeID).css("background", "#FFE5E5");

    if (pSecThird == "Four") {
        return;
    }

    //构造POST参数
    var dataPOST = {
        "Type": "2", "FatherTypeID": pFatherTypeID
    };
    console.log(dataPOST);

    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: mAjaxUrl + "?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log(reTxt);
            if (reTxt != "") {
                var _jsonObj = JSON.parse(reTxt);
                var _goodsTypeSubListArr = _jsonObj.GoodsTypeSubList;

                //构造显示代码
                var _xhtml = "";
                if (pSecThird == "Second") {
                    for (var i = 0; i < _goodsTypeSubListArr.length; i++) {
                        _xhtml += "<div id=\"GoodsType_" + _goodsTypeSubListArr[i].GoodsTypeID + "\" class=\"goods-type-item goods-type-item-2\" onclick=\"loadGoodsTypeSecThird(" + _goodsTypeSubListArr[i].GoodsTypeID + ", 'Third','" + _goodsTypeSubListArr[i].GoodsTypeName + "')\">" + _goodsTypeSubListArr[i].GoodsTypeName + "</div>";                    }
                    //显示代码插入前台
                    $("#GoodsTypeSecondDiv").html(_xhtml);
                }
                else if (pSecThird == "Third") {
                    for (var i = 0; i < _goodsTypeSubListArr.length; i++) {
                        _xhtml += "<div id=\"GoodsType_" + _goodsTypeSubListArr[i].GoodsTypeID + "\" class=\"goods-type-item goods-type-item-3\" onclick=\"loadGoodsTypeSecThird(" + _goodsTypeSubListArr[i].GoodsTypeID + ", 'Four','" + _goodsTypeSubListArr[i].GoodsTypeName + "')\">" + _goodsTypeSubListArr[i].GoodsTypeName + "</div>";                    }
                    //显示代码插入前台
                    $("#GoodsTypeThirdDiv").html(_xhtml);

                }

            }
        },
        error: function (xhr, errorTxt, status) {
            console.log("异步请求错误，errorTxt=" + errorTxt + " | status=" + status);
            return;
        }
    });
}

/**
 * 选择类目后，下一步
 * */
function nextStep() {
    var hidThirdGoodsTypeID = $("#hidThirdGoodsTypeID").val().trim();
    if (hidThirdGoodsTypeID == "") {
        toastWin("【商品类目】选择不完整！");
        return;
    }
    else {
        $("#SelGoodsTypeDiv").hide();
        $("#PutGoodsTypePropDiv").show();

        $("#GoodsTypeSpan_First").html($("#GoodsTypeSpanFirst").html());
        $("#GoodsTypeSpan_Second").html($("#GoodsTypeSpanSecond").html());
        $("#GoodsTypeSpan_Third").html($("#GoodsTypeSpanThird").html());

        //加载类目必填属性
        initGoodsTypeNeedProp();
    }
}

/**
 * 编辑类目
 * */
function editGoodsType() {
    $("#SelGoodsTypeDiv").show();
    $("#PutGoodsTypePropDiv").hide();
}

/**
 * 加载类目必填属性
 * */
function initGoodsTypeNeedProp() {

    //获取当前类目ID
    var _hidThirdGoodsTypeID = $("#hidThirdGoodsTypeID").val();
    if (_hidThirdGoodsTypeID == "") {
        return;
    }

    //构造POST参数
    var dataPOST = {
        "Type": "3", "GoodsTypeID": _hidThirdGoodsTypeID,
    };
    console.log(dataPOST);

    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: mAjaxUrl + "?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log(reTxt);
            if (reTxt != "") {
                var _jsonObj = JSON.parse(reTxt);
                var _needPropArr = _jsonObj.NeedPropArr;

                var _html = "";                //构造前台显示代码                for (var i = 0; i < _needPropArr.length; i++) {                    //console.log("执行了");                    _html += "<li>";                    _html += "<span>" + _needPropArr[i].PropName + ":</span>";                    var _needPropName = _needPropArr[i].PropName                    if (_needPropArr[i].InputType == "select") {                        //分割值数组                        var _needPropValue = _needPropArr[i].PropValue                        //值数组                        var _propValueArr = new Array();                        if (_needPropValue.indexOf("^") >= 0) {                            _propValueArr = _needPropValue.split('^');
                        }                        else {                            _propValueArr[0] = _needPropValue
                        }                        _html += "<select name=\"NameGoodsProp\" data-goodsprop=\"" + _needPropName + "\" class=\"goods-prop-select\">";                        for (var j = 0; j < _propValueArr.length; j++) {                            _html += "<option value=\"" + _propValueArr[j] + "\">" + _propValueArr[j] + "</option>";
                        }                        _html += "</select>";
                    }                    else if (_needPropArr[i].InputType == "text") {                        _html += "<input name=\"NameGoodsProp\" data-goodsprop=\"" + _needPropName + "\" type=\"text\" class=\"goods-prop-txt\" />";                    }                    _html += "</li>";
                    //console.log(_html);
                }                //显示代码插入前台                $("#GoodsNeedPropUl").html(_html);            }
        },
        error: function (xhr, errorTxt, status) {
            console.log("异步请求错误，errorTxt=" + errorTxt + " | status=" + status);
            return;
        }
    });
}

/**
 * 初始化规格属性窗口信息
 * */
function initSpecPropFormWin() {

    //测试用的
    //mGoodsMsgGuid = "18e29fc8-494d-414d-8174-7a0b8483f229";

    if (mGoodsSpecPriceStockArr != "") {
        //显示加载提示
        loadingWinToDiv("dragCustomWinDiv");
    }
    else {
        //return;
    }


    //构造POST参数
    var dataPOST = {
        "Type": "5", "MsgGuid": mGoodsMsgGuid,
    };
    console.log(dataPOST);

    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: mAjaxUrl + "?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log(reTxt);
            if (mGoodsSpecPriceStockArr != "") {
                //移除加载提示
                closeLoadingWin();
            }

            if (reTxt != "") {
                var _jsonArr = JSON.parse(reTxt);                console.log(_jsonArr);                if (_jsonArr.length > 0) {                    //构造规格属性窗体显示代码                    var _xhtmlForm = xhtmlSpecPropForm(_jsonArr)                    console.log(_xhtmlForm);                    $("#GoodsPriceSpecList").html(_xhtmlForm);

                    //初始化规格价格库存上传插入
                    initUploadSpecPriceFormWin();
                }            }
        },
        error: function (xhr, errorTxt, status) {
            console.log("异步请求错误，errorTxt=" + errorTxt + " | status=" + status);
            return;
        }
    });
}

/**
 * 构造规格属性窗体显示代码
 * @param pJsonArr 构造规格属性Json字符串
 * */
function xhtmlSpecPropForm(pJsonArr) {

    mInitUploadSpecPriceArr = "";

    //为规格标题，属性标题赋值
    $("#SpecTitleTxt").val(mSpecTitle);
    $("#SpecAttrNameTxt").val(mPropTitle);

    var myJsVal = "";    //构造规格显示代码    for (var i = 0; i < pJsonArr.length; i++) {        var pSpecItemIndex = i + 1;        //显隐规格的价格，库存        var _styleDisplay = "normal";        if (pJsonArr[i].GoodsPrice <= 0) {            _styleDisplay = "none";
        }        //构造图片的显示        var _SpecParamImg = "//" + pJsonArr[i].SpecParamImg;        if (_SpecParamImg == "//") {            _SpecParamImg = "../Assets/Imgs/Icon/icon_spec_default.png";
        }        console.log("_SpecParamImg=" + _SpecParamImg);        myJsVal += " <div class=\"goods-pricespec-item\">";        myJsVal += "     <div class=\"pricespec-item-title\">";        myJsVal += "         <label>规格" + pSpecItemIndex + "：</label>";        myJsVal += "         <span>名称</span><input id=\"id_SpecName_" + pSpecItemIndex + "\" name=\"name_SpecName\" type=\"text\" class=\"spec-name-txt\" value=\"" + pJsonArr[i].SpecParamVal + "\" />";        myJsVal += "         <div id=\"id_SpecPriceStock_" + pSpecItemIndex + "\" style=\"display:" + _styleDisplay + "\">";        myJsVal += "             <span>价格</span><input id=\"id_SpecPrice_" + pSpecItemIndex + "\" name=\"name_SpecPrice\" type=\"number\" class=\"spec-title-pricestock spec-name-txt\" spec-name-txt\" value=\"" + pJsonArr[i].GoodsPrice + "\" />";        myJsVal += "             <span>库存</span><input id=\"id_SpecStock_" + pSpecItemIndex + "\" name=\"name_SpecStock\" type=\"number\" value=\"" + pJsonArr[i].StockNum + "\" class=\"spec-title-pricestock spec-name-txt\" />";        myJsVal += "         </div>";        myJsVal += "         <img id=\"id_SpecPropImg_" + pSpecItemIndex + "\" class=\"pricespec-pre-img\" src=\"" + _SpecParamImg + "\" />";        myJsVal += "         <div class=\"am-form-group am-form-file\">";        myJsVal += "             <button type=\"button\" class=\"am-btn am-btn-default am-btn-xs am-round\">";        myJsVal += "                 <i class=\"am-icon-cloud-upload\"></i> 规格图片(可选)";        myJsVal += "             </button>";        myJsVal += "             <input id=\"id_SpecPropUpload_" + pSpecItemIndex + "\" name=\"name_SpecUpload\" type=\"file\">";        myJsVal += "             <input type=\"hidden\" id=\"id_SpecPropUploadValArr_" + pSpecItemIndex + "\" name=\"name_SpecUploadValArr\" value=\"" + pJsonArr[i].UploadGuid + "~" + pJsonArr[i].SpecParamImg + "\" />";        myJsVal += "         </div>";        myJsVal += "     </div>";        myJsVal += "     <div class=\"pricespec-prop-list\" id=\"id_PropList_" + pSpecItemIndex + "\">";        //初始化上传插入字符串数组 SpecIndex ~ PropIndex ^ SpecIndex ~ PropIndex        mInitUploadSpecPriceArr += "^" + pSpecItemIndex;        //构造规格属性显示代码        var _propListArr = pJsonArr[i].PropList;        for (var j = 0; j < _propListArr.length; j++) {            var _indexPropItem = j + 1;            //构造图片的显示            var _PropParamImg = "//" + _propListArr[j].SpecParamImg;            if (_PropParamImg == "//") {                _PropParamImg = "../Assets/Imgs/Icon/icon_spec_default.png";
            }            console.log("_PropParamImg=" + _PropParamImg);
            myJsVal += "<div class=\"pricespec-prop-item\">";            myJsVal += "                                    <span>属性名称</span><input id=\"id_PropName_" + pSpecItemIndex + "_" + _indexPropItem + "\" name=\"name_PropName_" + pSpecItemIndex + "\" type=\"text\" value=\"" + _propListArr[j].SpecParamVal + "\" class=\"spec-prop-name-txt spec-name-txt\" />";            myJsVal += "                                    <span>价格</span><input id=\"id_PropPrice_" + pSpecItemIndex + "_" + _indexPropItem + "\" value=\"" + _propListArr[j].GoodsPrice + "\" name=\"name_PropPrice_" + pSpecItemIndex + "\" type=\"number\" class=\"spec-name-txt\" />";            myJsVal += "                                    <span>库存</span><input id=\"id_PropStock_" + pSpecItemIndex + "_" + _indexPropItem + "\" name=\"name_PropStock_" + pSpecItemIndex + "\" type=\"number\" value=\"" + _propListArr[j].StockNum + "\" class=\"spec-name-txt\" />";            myJsVal += "                                    <img id=\"id_SpecPropImg_" + pSpecItemIndex + "_" + _indexPropItem + "\" class=\"pricespec-pre-img\" src=\"" + _PropParamImg + "\" />";            myJsVal += "                                    <div class=\"am-form-group am-form-file\">";            myJsVal += "                                        <button type=\"button\" class=\"am-btn am-btn-default am-btn-xs am-round\">";            myJsVal += "                <i class=\"am-icon-cloud-upload\"></i> 属性图片(可选)";            myJsVal += "                                        </button>";            myJsVal += "                                        <input id=\"id_SpecPropUpload_" + pSpecItemIndex + "_" + _indexPropItem + "\" name=\"name_PropUpload_" + pSpecItemIndex + "\" type=\"file\">";            myJsVal += "<input type=\"hidden\" id=\"id_SpecPropUploadValArr_" + pSpecItemIndex + "_" + _indexPropItem + "\" value=\"" + _propListArr[j].UploadGuid + "~" + _propListArr[j].SpecParamImg + "\" name=\"name_PropUploadValArr_" + pSpecItemIndex + "\" />";            myJsVal += "                                    </div>";            myJsVal += "                                </div>";


            //初始化上传插入字符串数组 SpecIndex ~ PropIndex ^ SpecIndex ~ PropIndex            mInitUploadSpecPriceArr += "~" + _indexPropItem;
        }        myJsVal += "     </div>";        myJsVal += "     <div class=\"pricespec-prop-add\">";        myJsVal += "         <div class=\"btn-prop-add\" onclick=\"addPropItem(" + pSpecItemIndex + ")\">添加属性</div>";        myJsVal += "         <div onclick=\"removePropItem(" + pSpecItemIndex + ")\">删除属性</div>";        myJsVal += "     </div>";        myJsVal += " </div>";    }

    //删除前后的“^”    mInitUploadSpecPriceArr = removeFrontAndBackChar(mInitUploadSpecPriceArr, "^");

    console.log("mInitUploadSpecPriceArr=" + mInitUploadSpecPriceArr);    //alert("mInitUploadSpecPriceArr=" + mInitUploadSpecPriceArr);

    return myJsVal;
}

/**
 * 初始化规格价格库存上传插入
 * */
function initUploadSpecPriceFormWin() {

    //初始化上传插入字符串数组 SpecIndex ~ PropIndex~ PropIndex ^ SpecIndex ~ PropIndex~ PropIndex [1~1~2 ^ 2~1~2]    if (mInitUploadSpecPriceArr == "") {
        return;
    }

    if (mInitUploadSpecPriceArr.indexOf("^") >= 0) //多个规格的情况
    {
        //分解字符串数组
        var _specPropIndexArr = mInitUploadSpecPriceArr.split("^");
        for (var i = 0; i < _specPropIndexArr.length; i++) {
            if (_specPropIndexArr[i].indexOf("~") >= 0) //有规格有属性
            {
                var _specPropIndexItemArr = _specPropIndexArr[i].split("~");

                for (var j = 0; j < _specPropIndexItemArr.length; j++) {

                    //alert("_specPropIndexItemArr[j]=" + _specPropIndexItemArr[j]);

                    if (j == 0) {
                        //初始化规格属性上传插入
                        initSpecPropUploadFile(_specPropIndexItemArr[0]);
                    }
                    else {
                        //初始化规格属性上传插入
                        initSpecPropUploadFile(_specPropIndexItemArr[0], _specPropIndexItemArr[j]);
                    }
                }
            }
            else //只有规格没有属性
            {
                //初始化规格属性上传插入
                initSpecPropUploadFile(_specPropIndexArr[i]);
            }
        }
    }
    else //只有一个规格属性的情况
    {
        if (mInitUploadSpecPriceArr.indexOf("~") >= 0) //有规格有属性
        {
            var _specPropIndexItemArr = mInitUploadSpecPriceArr.split("~");

            for (var j = 0; j < _specPropIndexItemArr.length; j++) {

                if (j == 0) {
                    //初始化规格属性上传插入
                    initSpecPropUploadFile(_specPropIndexItemArr[0]);
                }
                else {
                    //初始化规格属性上传插入
                    initSpecPropUploadFile(_specPropIndexItemArr[0], _specPropIndexItemArr[j]);
                }
            }
        }
        else //只有规格没有属性
        {
            //初始化规格属性上传插入
            initSpecPropUploadFile(mInitUploadSpecPriceArr);
        }
    }
}

/**
 * 加载规格属性信息并构造显示代码
 * */
function loadSpecPropMsgXhtml() {

    if (mGoodsSpecPriceStockArr == "") {
        return;
    }

    //规格属性标题
    $("#SpecTitleDiv").html(mSpecTitle);
    $("#PropTitleDiv").html(mPropTitle);

    //构造POST参数
    var dataPOST = {
        "Type": "5", "MsgGuid": mGoodsMsgGuid,
    };
    console.log(dataPOST);

    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: mAjaxUrl + "?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            //console.log(reTxt);
            if (reTxt != "") {
                var _jsonArr = JSON.parse(reTxt);                console.log(_jsonArr);                if (_jsonArr.length > 0) {
                    //构造规格属性页面显示代码
                    var xhtmlSpecPropMsgArr = xhtmlSpecPropMsg(_jsonArr).split("^");

                    console.log(xhtmlSpecPropMsgArr);

                    //显示代码插入前台 
                    $("#SpecItemDiv").html(xhtmlSpecPropMsgArr[0]);
                    $("#PropItemDiv").html(xhtmlSpecPropMsgArr[1]);

                    mJsonArrSpecProp = _jsonArr;

                    //初始化规格信息
                    chgTabSpec(mJsonArrSpecProp[0].SpecIDPre, true);
                }            }
        },
        error: function (xhr, errorTxt, status) {
            console.log("异步请求错误，errorTxt=" + errorTxt + " | status=" + status);
            return;
        }
    });
}

/**
 * 构造规格属性页面显示代码
 * @param {any} pJsonArrSpecProp
 */
function xhtmlSpecPropMsg(pJsonArrSpecProp) {

    var _specXhtml = ""; //规格Xhtml
    var _propXhtml = ""; //属性Xhtml

    //循环构造显示代码
    for (var i = 0; i < pJsonArrSpecProp.length; i++) {

        //规格信息
        var _specMsg = pJsonArrSpecProp[i];

        var _currentClass = "";
        if (i == 0) {
            _currentClass = "current-price-spec";
        }

        //构造规格Xhtml
        if (_specMsg.SpecParamImg != "") {
            _specXhtml += "<div name=\"SpecListName\" data-price-stock=\"" + _specMsg.GoodsPrice + "|" + _specMsg.StockNum + "\" onclick=\"chgTabSpec(" + _specMsg.SpecIDPre + ")\" class=\"" + _currentClass + "\"><img src=\"//" + _specMsg.SpecParamImg + "\" /></div>";
        }
        else {
            _specXhtml += "<div name=\"SpecListName\" data-price-stock=\"" + _specMsg.GoodsPrice + "|" + _specMsg.StockNum + "\" onclick=\"chgTabSpec(" + _specMsg.SpecIDPre + ")\" class=\"" + _currentClass + "\"><span>" + _specMsg.SpecParamVal + "</span></div>";
        }

        //规格下面的属性信息数组
        var _propArr = _specMsg.PropList;

        var _currentStyleDisplay = "none";
        if (i == 0) {
            _currentStyleDisplay = "normal";
        }
        _propXhtml += " <div id=\"PropList_" + _specMsg.SpecIDPre + "\" name=\"PropListName\" class=\"price-spec-div-item\" style=\"display:" + _currentStyleDisplay + "\">";

        //构造规格下属性的Xhtml
        for (var j = 0; j < _propArr.length; j++) {
            //属性信息
            var _propMsg = _propArr[j];
            var _currentClass = "";

            if (j == 0) {
                _currentClass = "current-price-spec";
            }
            if (_propMsg.SpecParamImg != "") {                _propXhtml += "<div name=\"PropItemName\" id=\"PropItem_" + _propMsg.SpecIDPre + "\" onclick=\"chgPropTabl(" + _specMsg.SpecIDPre + "," + _propMsg.SpecIDPre + ")\" data-price-stock=\"" + _propMsg.GoodsPrice + "|" + _propMsg.StockNum + "\" class=\"" + _currentClass + "\"><img src=\"//" + _propMsg.SpecParamImg + "\" /></div>";
            }            else {                _propXhtml += "<div name=\"PropItemName\" id=\"PropItem_" + _propMsg.SpecIDPre + "\" onclick=\"chgPropTabl(" + _specMsg.SpecIDPre + "," + _propMsg.SpecIDPre + ")\" data-price-stock=\"" + _propMsg.GoodsPrice + "|" + _propMsg.StockNum + "\" class=\"" + _currentClass + "\"><span>" + _propMsg.SpecParamVal + "</span></div>";
            }        }
        _propXhtml += " </div>";
    }
    //alert("_specXhtml=" + _specXhtml);
    //alert("_propXhtml=" + _propXhtml);
    return _specXhtml + "^" + _propXhtml;
}

/**
 * 切换规格选项卡
 * @param {any} pSpecIDPre 规格属性ID
 * @param {any} pIsLoading 是否为初次加载 [ true / false]
 */
function chgTabSpec(pSpecIDPre, pIsLoading) {



    if (pIsLoading == undefined || pIsLoading == "") {
        pIsLoading = false;
    }

    var _specListNameArr = $("div[name='SpecListName']");
    //去掉所有当前选择规格样式
    for (var i = 0; i < _specListNameArr.length; i++) {

        $(_specListNameArr[i]).removeClass("current-price-spec");
    }
    //设置当前选择Tab
    if (pIsLoading) {
        $(_specListNameArr[0]).addClass("current-price-spec");
    }
    else {
        $(event.currentTarget).addClass("current-price-spec");
    }


    //重新加载属性Xhtml
    var xhtmlSpecPropMsgArr = xhtmlSpecPropMsg(mJsonArrSpecProp).split("^");
    //显示代码插入前台 
    $("#PropItemDiv").html(xhtmlSpecPropMsgArr[1]);


    //隐藏所有的属性列表
    var _propListNameArr = $("div[name='PropListName']");
    for (var j = 0; j < _propListNameArr.length; j++) {
        $(_propListNameArr[j]).hide();
    }
    //显示当前的属性Tab
    $("#PropList_" + pSpecIDPre).show();


    //切换Tab时的价格与库存显示
    var _propItemNameArr = $("#PropList_" + pSpecIDPre + " div[name='PropItemName']");
    if (_propItemNameArr.length > 0) {

        var _priceStockArr = $(_propItemNameArr[0]).attr("data-price-stock").split("|");
        $("#GoodsPriceB").html(_priceStockArr[0]);
        $("#GoodsStockB").html(_priceStockArr[1]);
    }
    else {
        //直接显示规格价格
        var _priceStockArr;

        if (pIsLoading == false) {

            _priceStockArr = $(event.currentTarget).attr("data-price-stock").split("|");
        }
        else {

            _priceStockArr = $(_specListNameArr[0]).attr("data-price-stock").split("|");
        }
        $("#GoodsPriceB").html(_priceStockArr[0]);
        $("#GoodsStockB").html(_priceStockArr[1]);
    }
}

/**
 * 切换属性选项卡
 * @param {any} pSpecIDPre 规格ID
 * @param {any} pPropIDPre 属性ID (字段 SpecIDPre)
 */
function chgPropTabl(pSpecIDPre, pPropIDPre) {
    //去掉所有属性列表选择样式
    var _propItemNameArr = $("#PropList_" + pSpecIDPre + " div[name='PropItemName']");
    for (var i = 0; i < _propItemNameArr.length; i++) {

        $(_propItemNameArr[i]).removeClass("current-price-spec");
    }
    //设置当前选择的Tab样式
    $("#PropItem_" + pPropIDPre).addClass("current-price-spec");

    //设置当前的价格与库存
    var _priceStockArr = $("#PropItem_" + pPropIDPre).attr("data-price-stock").split("|");
    $("#GoodsPriceB").html(_priceStockArr[0]);
    $("#GoodsStockB").html(_priceStockArr[1]);
}

/**
 * 删除所有规格属性信息
 * */
function delAllSpecPriceStock() {

    confirmWinWidth("确定要删除所有规格信息吗？", function () {

        //构造POST参数
        var dataPOST = {
            "Type": "6", "MsgGuid": mGoodsMsgGuid,
        };
        console.log(dataPOST);

        //正式发送异步请求
        $.ajax({
            type: "POST",
            url: mAjaxUrl + "?rnd=" + Math.random(),
            data: dataPOST,
            dataType: "html",
            success: function (reTxt, status, xhr) {
                console.log(reTxt);
                if (reTxt != "") {
                    var _jsonBack = JSON.parse(reTxt);                    if (_jsonBack.Msg != null) {                        toastWin(_jsonBack.Msg);

                        //删除成功
                        mGoodsSpecPriceStockArr = "";
                        $("#GoodsSpecPropPriceStockNoDiv").show();
                        $("#GoodsSpecPropPriceStockDiv").hide();
                        $("#BtnDelAllSpecPropMsg").hide();

                        //删除因重复上传导致的多余规格图片
                        delGooSpecParamImgRepeat();
                    }                    if (_jsonBack.ErrMsg != null) {                        toastWin(_jsonBack.ErrMsg);
                        return;
                    }                }
            },
            error: function (xhr, errorTxt, status) {
                console.log("异步请求错误，errorTxt=" + errorTxt + " | status=" + status);
                return;
            }
        });

    }, 400)
}


//=============商品图片相关===============//

/**
 * 初始化所有商品图片上传插件
 * */
function initAllGoodsImgUploadFile() {

    for (var i = 1; i < 6; i++) {
        //初始化商品图片上传插件
        initGoodsImgUploadFile(i);
    }
}

/**
 * 初始化商品图片上传插件
 * @param {any} pUploadIndex 上传文件域索引
 */
function initGoodsImgUploadFile(pUploadIndex) {

    //console.log("执行了initGoodsImgUploadFile()");

    //构造上传控件的ID字符串
    var _uploadIDstr = "UploadGoods_" + pUploadIndex;


    //构造POST参数
    var _dataPost = "Type=1&UserID=" + mUserID;
    console.log(_dataPost);

    $('#' + _uploadIDstr).fileupload({
        url: "../FileUpload/GooGoodsImg?" + _dataPost + "&rnd=" + Math.random(),
        //dataType: 'json',
        dataType: "text",
        //------------处理上传成功后的事件------------//
        done: function (e, data) {

            //关闭加载提示
            closeLoadingWin();

            //-------------此处是返回后后台文件输出的内容----------------//
            console.log(data.result);
            //alert(data.result);
            //对象化JSON字符串
            var _JsonObj = JSON.parse(data.result);

            //操作错误提示
            if (_JsonObj.ErrCode != null) {
                toastWin(_JsonObj.ErrMsg);
                return;
            }

            mImgKeyGuid = _JsonObj.DataDic.ImgKeyGuid;
            mImgPathDomain = _JsonObj.DataDic.ImgPathDomain;
            console.log("mImgKeyGuid=" + mImgKeyGuid + " | mImgPathDomain=" + mImgPathDomain);
            //alert("mImgKeyGuid=" + mImgKeyGuid + " | mImgPathDomain=" + mImgPathDomain);
            //mImgKeyGuid=91318a05-a4c0-4ff8-95ad-17117eccb7d1 | mImgPathDomain=localhost:1400/Upload/GooSpecParamImg/GSPI_1_201907121414565670.jpg

            //给隐藏控件赋值
            $("#HidUploadGoodsVal_" + pUploadIndex).val(mImgKeyGuid + "|" + mImgPathDomain);

            //给图片控件赋值
            $("#GoodsImgPre_" + pUploadIndex).attr("src", "//" + mImgPathDomain);

            //显示操作按钮组
            $("#BtnGoodsList_" + pUploadIndex).show();

            //----构造按钮显示代码
            //获取图片URL中的 域名和图片相对路径  
            var _domainAndImgPathArr = getImgURLDomainAndImgPathArr(mImgPathDomain).split("^");
            var _btnGoodsListXhtml = "<a href=\"//" + _domainAndImgPathArr[0] + "/ToolWeb/CropZoom/CropZoom.aspx?CropImgWidth=700&CropImgHeight=700&CropTitle=商品&ImgSourceURL=" + _domainAndImgPathArr[1] + "&RedirectURL=#\" target=\"_blank\">裁剪</a>";            _btnGoodsListXhtml += "<div onclick=\"delGooGoodsImg('" + mImgKeyGuid + "','" + _domainAndImgPathArr[0] + "'," + pUploadIndex + ")\">删除</div><div onclick=\"refreshImgSrcRnd('GoodsImgPre_" + pUploadIndex + "')\">刷新</div>";            //显示代码插入前台             $("#BtnGoodsList_" + pUploadIndex).html(_btnGoodsListXhtml);        },

        //---------------处理上传进度的方法-------------//
        progressall: function (e, data) {

            console.log("progressall 执行");

            var progress = parseInt(data.loaded / data.total * 100, 10);
            $('#progress').css(
                'width',
                progress + '%'
            );

            //输出进度
            console.log("上传的进度：" + progress);

            if (progress >= 100) {
                //alert("上传成功！");
            }


        }
    }).prop('disabled', !$.support.fileInput)
        .parent().addClass($.support.fileInput ? undefined : 'disabled').on('fileuploadadd', function (e, data) {

            console.log("添加了文件");
            //显示加载提示
            loadingWin();

        });
}

/**
 * 得到商品上传图片拼接数组 
 * mImgKeyGuid | mImgPathDomain ^ mImgKeyGuid | mImgPathDomain^ mImgKeyGuid | mImgPathDomain
 * */
function getGoodsImgArr() {
    var _goodsImgArr = "";
    for (var i = 1; i < 6; i++) {
        _uploadVal = $("#HidUploadGoodsVal_" + i).val();
        //console.log("_uploadVal=" + _uploadVal);
        if (_uploadVal.indexOf("|") >= 0) {
            _goodsImgArr += $("#HidUploadGoodsVal_" + i).val() + "^";
        }
    }
    //删除前后“^”
    _goodsImgArr = removeFrontAndBackChar(_goodsImgArr, "^");
    return _goodsImgArr;
}

/**
 * 获取图片URL中的 域名和图片相对路径  
 * @param pImgUrl 图片URL地址 [localhost:1400/Upload/ShopHeaderImg/SHI_1_201906160949557860.jpg]
 * */
function getImgURLDomainAndImgPathArr(pImgUrl) {

    //获取图片域名 localhost:1400/Upload/ShopHeaderImg/SHI_1_201906160949557860.jpg
    var _domain = pImgUrl.substring(0, pImgUrl.indexOf("/"));
    //console.log("_domain=" + _domain);
    //获取图片相对路径 
    var _imgPath = pImgUrl.replace(_domain + "/", "");
    //console.log("_imgPath=" + _imgPath);

    return _domain + "^" + _imgPath;
}

/**
 * 刷新Img标签的Src值 以加载裁剪后的图片
 * @param {any} pImgLabelID Img标签的ID
 */
function refreshImgSrcRnd(pImgLabelID) {
    //获取Img标签的Src值
    var _imgSrc = $("#" + pImgLabelID).attr("src");
    console.log("_imgSrc=" + _imgSrc);
    //得到去掉Rnd参数的Src
    var _imgSrcNoRnd = _imgSrc;
    if (_imgSrc.indexOf("?rnd") >= 0) {
        _imgSrcNoRnd = _imgSrc.substring(0, _imgSrc.indexOf("?rnd"));
    }
    console.log("_imgSrcNoRnd=" + _imgSrcNoRnd);

    _imgSrc = _imgSrcNoRnd + "?rnd=" + Math.random();
    console.log("New_imgSrc=" + _imgSrc);
    $("#" + pImgLabelID).attr("src", _imgSrc);
}

/**
 * 删除已上传没保存的商品图片
 * @param pImgKeyGuid 上传图片Key的GUID
 * @param pDomainUpload 上传服务器域名 [localhost:1400]
 * @param pUploadIndex 上传控件索引
 * */
function delGooGoodsImg(pImgKeyGuid, pDomainUpload, pUploadIndex) {

    confirmWinWidth("确定要删除商品照片吗？", function () {

        //构造POST参数
        var dataPOST = {
            "Type": "3", "ImgKeyGuid": pImgKeyGuid, "DomainUpload": pDomainUpload,
        };
        console.log(dataPOST);

        //正式发送异步请求
        $.ajax({
            type: "POST",
            url: "../FileUpload/GooGoodsImg?rnd=" + Math.random(),
            data: dataPOST,
            dataType: "html",
            success: function (reTxt, status, xhr) {
                console.log(reTxt);
                if (reTxt != "") {
                    var _jsonBack = JSON.parse(reTxt);
                    if (_jsonBack.Msg != null) {
                        toastWin(_jsonBack.Msg);

                        //给隐藏控件赋值
                        $("#HidUploadGoodsVal_" + pUploadIndex).val("");

                        //给图片控件赋值
                        $("#GoodsImgPre_" + pUploadIndex).attr("src", "../Assets/Imgs/Icon/icon_camera.png");

                        //显示操作按钮组
                        $("#BtnGoodsList_" + pUploadIndex).hide();

                        return;
                    }
                    if (_jsonBack.ErrMsg != null) {
                        toastWin(_jsonBack.ErrMsg);
                    }

                }
            },
            error: function (xhr, errorTxt, status) {
                console.log("异步请求错误，errorTxt=" + errorTxt + " | status=" + status);
                return;
            }
        });


    }, 400);

}


/**
 * 删除因重复上传导致的多余商品图片
 * */
function delGoodsImgRepeat() {
    //构造POST参数
    var dataPOST = {
        "Type": "2"
    };
    console.log(dataPOST);

    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: "../FileUpload/GooGoodsImg?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log(reTxt);
            if (reTxt != "") {

            }
        },
        error: function (xhr, errorTxt, status) {
            console.log("异步请求错误，errorTxt=" + errorTxt + " | status=" + status);
            return;
        }
    });
}


//===========编辑器插入图片=====================//

/**
 * 初始化商家的相册信息 [相册名称下拉列表]
 * */
function initShopAlbum() {

    //构造POST参数
    var dataPOST = {
        "Type": "2"
    };
    console.log(dataPOST);

    //显示加载提示
    loadingWinToDiv("dragWinDiv");

    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: "../FileUpload/ShopAlbum?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log(reTxt);

            //关闭加载提示
            closeLoadingWin();

            if (reTxt != "") {
                var _jsonBack = JSON.parse(reTxt);
                var _jsonShopAlbumArr = _jsonBack.ShopAlbum;
                //清除下拉列表值
                $("#ShopAlbumSelect1").empty();
                //循环赋值
                for (var i = 0; i < _jsonShopAlbumArr.length; i++) {

                    $("#ShopAlbumSelect1").append("<option value='" + _jsonShopAlbumArr[i].AlbumID + "'>" + _jsonShopAlbumArr[i].AlbumTitle + "</option>"); //为Select追加一个Option(下拉项)
                }

                //初始化上传相册图片的插件
                initUploadAlbumImg();

                //搜索相册图片
                searchContent();
            }
            else {
                //清除下拉列表值
                $("#ShopAlbumSelect1").empty();
            }

            //搜索商品图片
            searchContent2();

        },
        error: function (xhr, errorTxt, status) {
            console.log("异步请求错误，errorTxt=" + errorTxt + " | status=" + status);
            return;
        }
    });
}

/**
 * 下拉列表框，切换相册名称 
 * @param {any} pSelectType 下拉列表框类型，[1 本地上传,2]
 */
function chgShopAlbumSelect(pSelectType) {

    //初始化上传相册图片的插件
    initUploadAlbumImg();

    //分页加载相册图片
    searchContent();
}

/**
 * 初始化上传相册图片的插件
 * */
function initUploadAlbumImg() {

    //构造上传控件的ID字符串
    var _uploadIDstr = "fileupload_Album";

    //构造POST参数
    var _dataPost = "Type=1&AlbumID=" + $("#ShopAlbumSelect1").val().trim();
    console.log(_dataPost);

    $('#' + _uploadIDstr).fileupload({
        url: "../FileUpload/ShopAlbum?" + _dataPost + "&rnd=" + Math.random(),
        //dataType: 'json',
        dataType: "text",
        //------------处理上传成功后的事件------------//
        done: function (e, data) {

            //关闭加载提示
            closeLoadingWin();

            //-------------此处是返回后后台文件输出的内容----------------//
            console.log(data.result);
            //alert(data.result);
            //对象化JSON字符串
            var _JsonObj = JSON.parse(data.result);

            //操作错误提示
            if (_JsonObj.ErrCode != null) {
                toastWin(_JsonObj.ErrMsg);
                return;
            }

            mImgKeyGuid = _JsonObj.DataDic.ImgKeyGuid;
            mImgPathDomain = _JsonObj.DataDic.ImgPathDomain;
            console.log("mImgKeyGuid=" + mImgKeyGuid + " | mImgPathDomain=" + mImgPathDomain);
            //alert("mImgKeyGuid=" + mImgKeyGuid + " | mImgPathDomain=" + mImgPathDomain);
            //mImgKeyGuid=91318a05-a4c0-4ff8-95ad-17117eccb7d1 | mImgPathDomain=localhost:1400/Upload/GooSpecParamImg/GSPI_1_201907121414565670.jpg
            //搜索相册图片
            searchContent();
        },

        //---------------处理上传进度的方法-------------//
        progressall: function (e, data) {

            console.log("progressall 执行");

            var progress = parseInt(data.loaded / data.total * 100, 10);
            $('#progress').css(
                'width',
                progress + '%'
            );

            //输出进度
            console.log("上传的进度：" + progress);

            if (progress >= 100) {
                //alert("上传成功！");
            }


        }
    }).prop('disabled', !$.support.fileInput)
        .parent().addClass($.support.fileInput ? undefined : 'disabled').on('fileuploadadd', function (e, data) {

            console.log("添加了文件");
            //显示加载提示
            loadingWinToDiv("dragWinDiv");

        });
}


//=====================相册图片数据分页====================//

/******数据分页的变量********/
var strPOSTSe = ""; //搜索条件对象 POST参数
var intPageCurrent = 1; //当前页
var pageSize = 0; //当页的记录条数，与后台保持一致
var recordSum = 0; //总记录数

/**
 * 搜索相册图片
 * */
function searchContent() {

    intPageCurrent = 1; //开始页

    var AlbumID_se = $("#ShopAlbumSelect1").val().trim();

    //构造POST参数
    var strPOST = {
        "pageCurrent": "1", "Type": "3"
    };

    //翻页所用
    var strPOSTSePush = {
        "AlbumID": AlbumID_se,
    };
    //将对象添加到分类对象中

    //搜索内容用
    var strPOSTSeContent = pushTwoObject(strPOST, strPOSTSePush);

    //分页操作用
    var strPOSTSearch = { "Type": "3" };
    strPOSTSe = pushTwoObject(strPOSTSearch, strPOSTSePush);
    console.log(strPOSTSe);

    //加载提示
    $("#PhotoImgUl").html("<li>… 加载中 …</li>");

    //以POST方式发送异步请求
    $.ajax({
        type: "POST",
        url: "../FileUpload/ShopAlbum?rnd=" + Math.random(),
        data: strPOSTSeContent,
        dataType: "html",
        success: function (reTxtJson, status, xhr) {
            //显示返回值
            console.log(reTxtJson);
            if (reTxtJson != "") {

                //分页成功返回，构造显示代码
                pageSuccess(reTxtJson);

            }
            else {

                $("#PhotoImgUl").html("<li></li>");
            }
        },
        error: function (xhr, errorTxt, status) {
            console.log("错误信息errorTxt=" + errorTxt + " | status=" + status);
            //alert("网络出现异常,请重试！");
        }

    });
};

//------------------------------搜索结果分页-------------------------------//
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

    //计算总页数
    var intPageSum = recordSum % pageSize != 0 ? recordSum / pageSize + 1 : recordSum / pageSize;

    if (intPageCurrent <= parseInt(intPageSum)) {

        //以GET方式发送分页请求的函数
        sendPageHttpGet(intPageCurrent);

    }
    else {
        intPageCurrent = parseInt(intPageSum);
    }

}

//----------------以GET方式发送分页请求的函数-----------------//
var sendPageHttpGet = function (intPageCurrent) {
    //构造GET参数
    strPOSTSe = pushTwoObject(strPOSTSe, { "pageCurrent": intPageCurrent });

    //加载提示
    $("#PhotoImgUl").html("<li>… 加载中 …</li>");

    $.ajax({
        type: "GET",
        url: "../FileUpload/ShopAlbum?rnd=" + Math.random(),
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
// @ reTxtJson 返回的Json字符串
function pageSuccess(reTxtJson) {
    if (reTxtJson != "") {

        var reJsonObject = JSON.parse(reTxtJson);
        console.log(reJsonObject);

        //总的记录数
        recordSum = reJsonObject.RecordSum;
        pageSize = reJsonObject.PageSize;


        //解析JSON数据 构造 前台显示代码
        var _xhtmlArr = jsonToXhtml(reJsonObject);

        //显示内容
        $("#PhotoImgUl").html(_xhtmlArr[0]);
        //分页控制条
        $("#PageBar1").html(_xhtmlArr[1]);


        //全不选
        //document.getElementById("SelAllCb").checked = false;

    }
    else {
        $("#PhotoImgUl").html("<li></li>");
    }
}

//------------解析JSON数据 构造 前台显示代码--------------//
// pJsonTxt Json字符串
function jsonToXhtml(pJsonObject) {

    //将字符串转换成功JSON对象
    //var json = JSON.parse(pJsonTxt);
    var json = pJsonObject;

    //-----内容显示前台显示代码----//
    var myJsVal = "";    //循环构造    for (var i = 0; i < json.DataPage.length; i++) {

        var indexDataPage = json.DataPage[i];
        var indexDataPageExtra = json.DataPageExtra[i];

        myJsVal += "<li>";        myJsVal += " <img src=\"//" + indexDataPage.ServerDomain + "/ToolWeb/ShowImgScale.aspx?FilePathFrom=" + indexDataPage.ImgPath + "&LimitWidthNum=80&LimitHeightNum=80\" />";        myJsVal += " <input class=\"sel-img-cb\" type=\"checkbox\" data-imgurl=\"//" + indexDataPage.ServerDomain + "/" + indexDataPage.ImgPath + "\" onchange=\"chgSelInsertImgCb()\" />";        myJsVal += "</li>";    }    //alert(myJsVal);    //-----分页控制条显示代码-------//    var pageBarXhtml = "";    pageBarXhtml += "<div onclick=\"NumberPage('1')\">首页</div>";    pageBarXhtml += "<div onclick=\"PrePage()\">上一页</div>";    pageBarXhtml += "<div onclick=\"NextPage()\">下一页</div>";    pageBarXhtml += "<div onclick=\"NumberPage('" + json.PageSum + "')\">尾页</div>";    var _pageMsgArr = new Array()    //内容显示代码     _pageMsgArr[0] = myJsVal;    //控制条件显示代码    _pageMsgArr[1] = pageBarXhtml;    //返回数组    return _pageMsgArr;
}


//=========================商品图片数据分页=========================//

/******数据分页的变量********/
var strPOSTSe2 = ""; //搜索条件对象 POST参数
var intPageCurrent2 = 1; //当前页
var pageSize2 = 0; //当页的记录条数，与后台保持一致
var recordSum2 = 0; //总记录数

/**
 * 搜索商品图片
 * */
function searchContent2() {

    intPageCurrent2 = 1; //开始页

    //构造POST参数
    var strPOST = {
        "pageCurrent": "1", "Type": "4"
    };

    //翻页所用
    var strPOSTSePush = {
        "1": 1,
    };
    //将对象添加到分类对象中

    //搜索内容用
    var strPOSTSeContent = pushTwoObject(strPOST, strPOSTSePush);

    //分页操作用
    var strPOSTSearch = { "Type": "4" };
    strPOSTSe2 = pushTwoObject(strPOSTSearch, strPOSTSePush);
    console.log(strPOSTSe2);

    //加载提示
    $("#GoodsImgUl").html("<li>… 加载中 …</li>");

    //以POST方式发送异步请求
    $.ajax({
        type: "POST",
        url: "../FileUpload/GooGoodsImg?rnd=" + Math.random(),
        data: strPOSTSeContent,
        dataType: "html",
        success: function (reTxtJson, status, xhr) {
            //显示返回值
            console.log(reTxtJson);
            if (reTxtJson != "") {

                //分页成功返回，构造显示代码
                pageSuccess2(reTxtJson);

            }
            else {

                $("#GoodsImgUl").html("<li></li>");
            }
        },
        error: function (xhr, errorTxt, status) {
            console.log("错误信息errorTxt=" + errorTxt + " | status=" + status);
            //alert("网络出现异常,请重试！");
        }

    });
};



//---------------搜索结果分页--------------//
//具体页
function NumberPage2(pagecurrent) {
    intPageCurrent2 = parseInt(pagecurrent);

    //以GET方式发送分页请求的函数
    sendPageHttpGet2(intPageCurrent2);
}

//上一页
function PrePage2() {
    intPageCurrent2 = intPageCurrent2 - 1;

    if (intPageCurrent2 > 0) {

        //以GET方式发送分页请求的函数
        sendPageHttpGet2(intPageCurrent2);

    }
    else {
        intPageCurrent2 = 1;
    }
}


//下一页
function NextPage2() {

    intPageCurrent2 = parseInt(intPageCurrent2) + 1;

    //计算总页数
    var intPageSum = recordSum2 % pageSize2 != 0 ? recordSum2 / pageSize2 + 1 : recordSum2 / pageSize2;

    if (intPageCurrent2 <= parseInt(intPageSum)) {

        //以GET方式发送分页请求的函数
        sendPageHttpGet2(intPageCurrent2);

    }
    else {
        intPageCurrent2 = parseInt(intPageSum);
    }

}

//----------------以GET方式发送分页请求的函数-----------------//
var sendPageHttpGet2 = function (intPageCurrent) {
    //构造GET参数
    strPOSTSe2 = pushTwoObject(strPOSTSe2, { "pageCurrent": intPageCurrent });

    //加载提示
    $("#GoodsImgUl").html("<li>… 加载中 …</li>");

    $.ajax({
        type: "GET",
        url: "../FileUpload/GooGoodsImg?rnd=" + Math.random(),
        data: strPOSTSe2,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            //成功返回后的处理函数
            pageSuccess2(reTxt)
        },
        error: function (xhr, errorTxt, status) {
            console.log("异步请求错误，errorTxt=" + errorTxt + " | status=" + status);
            //alert("网络出现异常,请重试！");
            return;
        }
    });
}


//------------分页信息成功返回------------//
// @ reTxtJson 返回的Json字符串
function pageSuccess2(reTxtJson) {
    if (reTxtJson != "") {

        var reJsonObject = JSON.parse(reTxtJson);
        console.log(reJsonObject);

        //总的记录数
        recordSum2 = reJsonObject.RecordSum;
        pageSize2 = reJsonObject.PageSize;


        //解析JSON数据 构造 前台显示代码
        var _xhtmlArr = jsonToXhtml2(reJsonObject);

        //显示内容
        $("#GoodsImgUl").html(_xhtmlArr[0]);
        //分页控制条
        $("#PageBar2").html(_xhtmlArr[1]);


        //全不选
        //document.getElementById("SelAllCb").checked = false;

    }
    else {
        $("#GoodsImgUl").html("<li></li>");
    }
}

//------------解析JSON数据 构造 前台显示代码--------------//
// pJsonTxt Json字符串
function jsonToXhtml2(pJsonObject) {

    //将字符串转换成功JSON对象
    //var json = JSON.parse(pJsonTxt);
    var json = pJsonObject;

    //-----内容显示前台显示代码----//
    var myJsVal = "";    //循环构造    for (var i = 0; i < json.DataPage.length; i++) {

        var indexDataPage = json.DataPage[i];
        var indexDataPageExtra = json.DataPageExtra[i];

        myJsVal += "<li>";        myJsVal += " <img src=\"//" + indexDataPage.ServerDomain + "/ToolWeb/ShowImgScale.aspx?FilePathFrom=" + indexDataPage.ImgPath + "&LimitWidthNum=80&LimitHeightNum=80\" />";        myJsVal += " <input class=\"sel-img-cb\" type=\"checkbox\" data-imgurl=\"//" + indexDataPage.ServerDomain + "/" + indexDataPage.ImgPath + "\" onchange=\"chgSelInsertImgCb()\" />";        myJsVal += "</li>";    }    //alert(myJsVal);    //-----分页控制条显示代码-------//    var pageBarXhtml = "";    pageBarXhtml += "<div onclick=\"NumberPage2('1')\">首页</div>";    pageBarXhtml += "<div onclick=\"PrePage2()\">上一页</div>";    pageBarXhtml += "<div onclick=\"NextPage2()\">下一页</div>";    pageBarXhtml += "<div onclick=\"NumberPage2('" + json.PageSum + "')\">尾页</div>";    var _pageMsgArr = new Array()    //内容显示代码     _pageMsgArr[0] = myJsVal;    //控制条件显示代码    _pageMsgArr[1] = pageBarXhtml;    //返回数组    return _pageMsgArr;
}


/**=====================赠品相关========================= */

/**
 * 开关，选择赠品
 */
function toggleGoodsGiftSel() {
    var _curTarget = $(event.currentTarget);
    var _src = _curTarget.attr("src");
    console.log(_src);
    if (_src.indexOf("sel_no") >= 0) {
        //选中状态
        _curTarget.attr("src", "../Assets/Imgs/Icon/sel_yes.png");
    }
    else {
        //未选状态
        _curTarget.attr("src", "../Assets/Imgs/Icon/sel_no.png");
    }
}

/**
 * 初始化商家赠品列表
 * */
function initShopGiftMsgList() {

    //构造POST参数
    var dataPOST = {
        "Type": "6"
    };
    console.log(dataPOST);
    //显示加载提示
    loadingWinToDiv("dragWinDiv");

    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: "../Goods/GooGiftMsg?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log(reTxt);
            //移除加载提示
            closeLoadingWin();
            if (reTxt != "") {
                var _json = JSON.parse(reTxt);
                var _xhtml = xhtmlGiftList(_json.GooGiftMsgList);
                $("#GoodsGiftWinUL").html(_xhtml);

                //赋值 赠品列表 Json对象
                mJsonGooGiftMsgList = _json.GooGiftMsgList;
            }
            else {
                $("#GoodsGiftWinUL").html("<li><a href=\"../GoodsPage/GooGiftMsgAdd\">无赠品,立即添加！</a></li>");
            }
        },
        error: function (xhr, errorTxt, status) {
            console.log("异步请求错误，errorTxt=" + errorTxt + " | status=" + status);
            return;
        }
    });
}

/**
 * 构造赠品列表显示代码
 */
function xhtmlGiftList(pJsonGooGiftMsgList) {

    var myJsVal = "";
    //循环构造显示代码
    for (var i = 0; i < pJsonGooGiftMsgList.length; i++) {

        //----构造按钮显示代码
        //获取图片URL中的 域名和图片相对路径  
        var _domainAndImgPathArr = getImgURLDomainAndImgPathArr(pJsonGooGiftMsgList[i].GiftImgUrl).split("^");
        myJsVal += "<li><div class=\"goods-gift-item-1\">";        myJsVal += "     <img src=\"//" + _domainAndImgPathArr[0] + "/ToolWeb/ShowImgScale.aspx?FilePathFrom=" + _domainAndImgPathArr[1] + "&LimitWidthNum=50&LimitHeightNum=50\" />";        myJsVal += "" + pJsonGooGiftMsgList[i].GiftName + "";        myJsVal += " </div>";        myJsVal += " <div class=\"goods-gift-item-2\">";        myJsVal += "     库存:" + pJsonGooGiftMsgList[i].StockNum + "";        myJsVal += " </div>";        myJsVal += " <div class=\"goods-gift-item-3\">";        myJsVal += "   <img name=\"GoodsGiftName\" data-giftid=\"" + pJsonGooGiftMsgList[i].GiftID + "\" src=\"../Assets/Imgs/Icon/sel_no.png\" onclick=\"toggleGoodsGiftSel()\" />";        myJsVal += " </div></li>";    }
    return myJsVal;
}

/**
 * 得到选择的赠品ID字符串数组
 * @param {any} pJsonGooGiftMsgList 赠品列表 Json对象
 * */
function getSelGiftIDArr() {

    //清空
    mSelGiftIDArr = "";

    var _goodsGiftNameArr = $("img[name='GoodsGiftName']");
    //console.log(_goodsGiftNameArr);
    //console.log(_goodsGiftNameArr.length);

    for (var i = 0; i < _goodsGiftNameArr.length; i++) {

        var _goodsGiftNameSrc = $(_goodsGiftNameArr[i]).attr("src");
        //console.log("_goodsGiftNameSrc=" + _goodsGiftNameSrc);

        if (_goodsGiftNameSrc.indexOf("sel_yes.png") >= 0) {
            mSelGiftIDArr += $(_goodsGiftNameArr[i]).attr("data-giftid") + "^";
        }

    }
    //去掉最后的“^”
    mSelGiftIDArr = removeFrontAndBackChar(mSelGiftIDArr, "^");

    //console.log("mSelGiftIDArr=" + mSelGiftIDArr);
    return mSelGiftIDArr;
}

/**
 * 构造已选择的赠品列表显示代码
 */
function xhtmlSelGiftList() {

    var pJsonGooGiftMsgList = mJsonGooGiftMsgList;

    //分割选择赠品ID字符串数组
    var _selGiftIDArr = mSelGiftIDArr.split("^");

    //分割选择赠品数量字符串数组
    var _selGiftNumArr, _selGiftNum = "1";
    if (mSelGiftNumArr.indexOf("^") >= 0) {
        _selGiftNumArr = mSelGiftNumArr.split("^");
    }
    else if (mSelGiftNumArr != "") {
        _selGiftNum = mSelGiftNumArr;
    }



    var myJsVal = "";
    //循环构造显示代码
    for (var i = 0; i < pJsonGooGiftMsgList.length; i++) {

        for (var j = 0; j < _selGiftIDArr.length; j++) {
            if (_selGiftIDArr[j] != pJsonGooGiftMsgList[i].GiftID) {                continue;
            }            if (mSelGiftNumArr.indexOf("^") >= 0) {                _selGiftNum = _selGiftNumArr[j];
            }            //获取图片URL中的 域名和图片相对路径  
            var _domainAndImgPathArr = getImgURLDomainAndImgPathArr(pJsonGooGiftMsgList[i].GiftImgUrl).split("^");            myJsVal += " <li>";            myJsVal += "   <div class=\"gift-item-1\">";            myJsVal += "     <img src=\"//" + _domainAndImgPathArr[0] + "/ToolWeb/ShowImgScale.aspx?FilePathFrom=" + _domainAndImgPathArr[1] + "&LimitWidthNum=50&LimitHeightNum=50\" />";            myJsVal += "" + pJsonGooGiftMsgList[i].GiftName + "";            myJsVal += "   </div>";            myJsVal += "   <div class=\"gift-item-2\" id=\"GiftStatusTxt_" + pJsonGooGiftMsgList[i].GiftID + "\">";            myJsVal += "正常";            myJsVal += "   </div>";            myJsVal += "   <div class=\"gift-item-3\">";            myJsVal += "       <div class=\"gift-item-input\">";            myJsVal += "           <input type=\"button\" class=\"gift-num-reduce\" onclick=\"reduceGiftNumTxt(" + pJsonGooGiftMsgList[i].GiftID + ")\" value=\" - \" />";            myJsVal += "           <input type=\"number\" name=\"GiftNumName\" id=\"GiftNumTxt_" + pJsonGooGiftMsgList[i].GiftID + "\" data-maxstock=\"" + pJsonGooGiftMsgList[i].StockNum + "\" class=\"gift-num-txt\" value=\"" + _selGiftNum + "\" />";            myJsVal += "           <input type=\"button\" class=\"gift-num-add\" onclick=\"addGiftNumTxt(" + pJsonGooGiftMsgList[i].GiftID + ")\" value=\" + \" />";            myJsVal += "       </div>";            myJsVal += "   </div>";            myJsVal += "   <div class=\"gift-item-4\">";            myJsVal += "       <span class=\"gift-del am-icon-trash-o\" onclick=\"delSelGiftID(" + pJsonGooGiftMsgList[i].GiftID + ")\"></span>";            myJsVal += "   </div>";            myJsVal += "</li>";
        }
    }
    return myJsVal;
}

/**
 * 得到选择赠品的数量
 * */
function getSelGiftNumArr() {

    mSelGiftNumArr = "";

    //得到选择赠品的数量
    var _giftNumNameArr = $("input[name='GiftNumName']");
    for (var i = 0; i < _giftNumNameArr.length; i++) {
        mSelGiftNumArr += $(_giftNumNameArr[i]).val() + "^";
    }
    //去掉最后的"^"
    mSelGiftNumArr = removeFrontAndBackChar(mSelGiftNumArr, "^");
    console.log("mSelGiftNumArr=" + mSelGiftNumArr);
    return mSelGiftNumArr;
}

/**
 * 删除选择的赠品ID 234423 ^ 234 ^ 2934 ^ 2934
 * @param pGiftID 赠品ID
 * */
function delSelGiftID(pGiftID) {

    //选择的赠品ID拼接字符串
    var _selGiftIDArr = mSelGiftIDArr.split("^");
    //选择的赠品数量拼接字符串
    var _selGiftNumArr = mSelGiftNumArr.split("^");

    for (var i = 0; i < _selGiftIDArr.length; i++) {
        if (_selGiftIDArr[i] == pGiftID) {
            _selGiftIDArr.splice(i, 1);
            _selGiftNumArr.splice(i, 1);
        }
    }
    mSelGiftIDArr = _selGiftIDArr.join("^");
    mSelGiftNumArr = _selGiftNumArr.join("^");
    //console.log("删除后mSelGiftIDArr=" + mSelGiftIDArr);
    //console.log("删除后mSelGiftNumArr=" + mSelGiftNumArr);
    if (mSelGiftIDArr == "" || mSelGiftNumArr == "") {
        mJsonGooGiftMsgList = "";
    }

    //重新构造显示代码
    $("#GoodsGiftUL").html(xhtmlSelGiftList());

}

/**
 * 赠品数量加1
 * @param {any} pGiftID 赠品ID
 */
function addGiftNumTxt(pGiftID) {

    var _giftNumTxt = $("#GiftNumTxt_" + pGiftID);
    var _giftNumVal = _giftNumTxt.val().trim();
    var _gifStockMaxNum = _giftNumTxt.attr("data-maxstock");
    //console.log("_giftNumVal=" + _giftNumVal);
    //console.log("_gifStockMaxNum=" + _gifStockMaxNum);
    if (parseInt(_giftNumVal) >= parseInt(_gifStockMaxNum)) {
        //$("#GiftStatusTxt_" + pGiftID).html("库存不足");
        _giftNumTxt.val(_gifStockMaxNum);
        return;
    }
    //库存加1
    _giftNumTxt.val(parseInt(_giftNumVal) + 1);

    //得到选择赠品的数量
    getSelGiftNumArr();
}

/**
 * 赠品数量减1
 * @param {any} pGiftID 赠品ID
 */
function reduceGiftNumTxt(pGiftID) {
    var _giftNumTxt = $("#GiftNumTxt_" + pGiftID);
    var _giftNumVal = _giftNumTxt.val().trim();
    if (parseInt(_giftNumVal) < 2) {
        return;
    }
    //库存加1
    _giftNumTxt.val(parseInt(_giftNumVal) - 1);

    //得到选择赠品的数量
    getSelGiftNumArr();
}

/**
 * 得到已选择的赠品ID和赠品数量的拼接字符串
 * [ GiftID _ GiftNum ^ GiftID _ GiftNum ]
 * */
function getGiftIDGiftNumArr() {
    //选择的赠品ID拼接字符串数组(用 "^" 连接)
    //var mSelGiftIDArr = "";
    //选择的赠品数量  拼接字符串数组(用 "^" 连接)
    //var mSelGiftNumArr = ""
    //循环构造已选择的赠品ID和赠品数量的拼接字符串
    var _giftIDGiftNumArr = "";
    if (mSelGiftIDArr.indexOf("^") >= 0) {
        _selGiftIDArr = mSelGiftIDArr.split("^");
        _selGiftNumArr = mSelGiftNumArr.split("^");
        for (var i = 0; i < _selGiftIDArr.length; i++) {
            _giftIDGiftNumArr += _selGiftIDArr[i] + "_" + _selGiftNumArr[i] + "^";
        }
    }
    else {
        if (mSelGiftIDArr != "" && mSelGiftNumArr != "") {
            _giftIDGiftNumArr += mSelGiftIDArr + "_" + mSelGiftNumArr;
        }
    }
    //去掉前后“^”
    _giftIDGiftNumArr = removeFrontAndBackChar(_giftIDGiftNumArr, "^");
    return _giftIDGiftNumArr;
}

/***===========加载店铺商品类别================ */

/**
 * 加载店铺商品类别父级和子级列表
 * */
function loadShopGoodsType() {

    //构造POST参数
    var dataPOST = {
        "Type": "1", "IsLock": "false"
    };
    console.log(dataPOST);

    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: "../Shop/ShopGoodsType?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log(reTxt);
            var _json = null;
            if (reTxt != "") {
                try {
                    _json = JSON.parse(reTxt);
                }
                catch (e) {
                    return;
                }

                //初始化父级店铺商品类别
                initTopShopGoodsType(_json.ShopGoodsTypeFather);

                mJsonShopGoodsTypeSubArr = _json.ShopGoodsTypeSub;
            }
            else {

            }
        },
        error: function (xhr, errorTxt, status) {
            console.log("异步请求错误，errorTxt=" + errorTxt + " | status=" + status);
            return;
        }
    });
}

/**
 * 初始化父级店铺商品类别 Select控件
 * @param {any} pJsonShopGoodsTypeFatherArr 父级店铺商品类别列表 Json对象
 */
function initTopShopGoodsType(pJsonShopGoodsTypeFatherArr) {
    var _jsonArrFather = pJsonShopGoodsTypeFatherArr;
    //清空父级Option
    $("#ShopGoodsTypeTop").empty();

    $("#ShopGoodsTypeTop").append("<option value=\"\">选择类别</option>");
    //循环追加option
    for (var i = 0; i < _jsonArrFather.length; i++) {
        $("#ShopGoodsTypeTop").append("<option value='" + _jsonArrFather[i].ShopGoodsTypeID + "'>" + _jsonArrFather[i].ShopGoodsTypeName + "</option>");
    }
}

/**
 * 当父级Select改变时，更改子级店铺商品类别 Select控件
 */
function chgSecondShopGoodsType() {

    if (mJsonShopGoodsTypeSubArr == "" || mJsonShopGoodsTypeSubArr == undefined) {

        $("#ShopGoodsTypeSecond").hide();
    }
    else {
        $("#ShopGoodsTypeSecond").show();
    }

    //得到父级菜单当前索引
    var _fatherSelOptionIndex = $("#ShopGoodsTypeTop").get(0).selectedIndex;
    console.log("_fatherSelOptionIndex=" + _fatherSelOptionIndex);

    if (_fatherSelOptionIndex == 0) {
        $("#ShopGoodsTypeSecond").hide();
        //清空子级Option
        $("#ShopGoodsTypeSecond").empty();
        return;
    }

    //初始化子级类别SELECT控件]
    var _jsonArrSub = mJsonShopGoodsTypeSubArr[_fatherSelOptionIndex - 1].ShopGoodsTypeSubList;

    //清空子级Option
    $("#ShopGoodsTypeSecond").empty();

    $("#ShopGoodsTypeSecond").append("<option value=\"\">选择类别</option>");
    for (var i = 0; i < _jsonArrSub.length; i++) {
        $("#ShopGoodsTypeSecond").append("<option value='" + _jsonArrSub[i].ShopGoodsTypeID + "'>" + _jsonArrSub[i].ShopGoodsTypeName + "</option>");
    }
}

/**
 * 初始化商家的运费模板
 * */
function initFreightTemplateList() {

    //构造POST参数
    var dataPOST = {
        "Type": "2", "IsExtraJson": "false",
    };
    console.log(dataPOST);

    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: "../Shop/FreightTemplate?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("初始化商家的运费模板=" + reTxt);
            if (reTxt != "") {

                var _jsonReTxt = JSON.parse(reTxt);
                var _shopFreightTemplateListArr = _jsonReTxt.ShopFreightTemplateList;

                //为下拉列表赋值
                for (var i = 0; i < _shopFreightTemplateListArr.length; i++) {
                    $("#FtIDSelect").append("<option value='" + _shopFreightTemplateListArr[i].FtID + "'>" + _shopFreightTemplateListArr[i].FtTitle + "</option>");
                }


                //只有实体店才支持，到店消费和自取
                if (_jsonReTxt.ShopMsg.IsEntity == "false") {
                    $("#IsShopExpense").prop("checked", false);
                    $("#IsShopExpense").attr("disabled", true);

                    $("#IsOfflinePay").prop("checked", false);
                    $("#IsOfflinePay").attr("disabled", true);
                }

            }

        },
        error: function (xhr, errorTxt, status) {
            console.log("异步请求错误，errorTxt=" + errorTxt + " | status=" + status);
            return;
        }
    });

}

/**====================提交与发布商品信息=====================**/

/**
 * 提交发布商品信息
 * */
function submitGoodsMsg() {

    //获取表单值
    var hidThirdGoodsTypeID = $("#hidThirdGoodsTypeID").val().trim();
    if (hidThirdGoodsTypeID == "") {
        return;
    }
    var hidGoodsMsgGuid = $("#hidGoodsMsgGuid").val().trim();

    //----获取商品必填属性值---//
    var _nameGoodsPropArr = document.getElementsByName("NameGoodsProp");
    //循环构造必填属性值
    var _goodsTypeNeedPropArr = "";
    //console.log("_nameGoodsPropArr.length=" + _nameGoodsPropArr.length);
    for (var i = 0; i < _nameGoodsPropArr.length; i++) {
        var _goodsPropName = $(_nameGoodsPropArr[i]).attr("data-goodsprop");

        var _goodsPropValue = "";
        var _nameGoodsPropVal = $(_nameGoodsPropArr[i]).val();
        if (_nameGoodsPropVal == null || _nameGoodsPropVal == undefined) {
            _goodsPropValue = "";
        }
        else {
            _goodsPropValue = $(_nameGoodsPropArr[i]).val().trim();
        }

        if (_goodsPropValue == "") {
            toastWin("【商品必填属性】填写不完整！");
            return;
        }

        _goodsTypeNeedPropArr += _goodsPropName + "_" + _goodsPropValue + "^"
    }
    //去掉前后“^”
    _goodsTypeNeedPropArr = removeFrontAndBackChar(_goodsTypeNeedPropArr, "^");
    console.log("提交_goodsTypeNeedPropArr=" + _goodsTypeNeedPropArr);
    //alert("提交_goodsTypeNeedPropArr=" + _goodsTypeNeedPropArr);

    //------获取商品自定义属性值-------//
    console.log("提交mGoodsMypropArr=" + mGoodsMypropArr);
    //alert("提交mGoodsMypropArr=" + mGoodsMypropArr);

    //------商品标题-----//
    var GoodsTitle = $("#GoodsTitle").val().trim();
    if (GoodsTitle == "") {
        toastWin("【商品标题】不能为空！");
        return;
    }
    if (GoodsTitle.length > 80) {
        toastWin("【商品标题】字数不能超过80个！");
        return;
    }

    //-----价格与库存-----//
    var GoodsPrice = $("#GoodsPrice").val().trim();
    var StockNum = $("#StockNum").val().trim();
    //mGoodsSpecTitle = ""; //规格标题
    //mGoodsPropTitle = ""; //属性标题
    console.log("提交mGoodsSpecPriceStockArr=" + mGoodsSpecPriceStockArr + ",mGoodsSpecTitle=" + mGoodsSpecTitle + ",mGoodsPropTitle=" + mGoodsPropTitle);
    //判断是否有规格属性
    var _specPropStyleDisplay = $("#GoodsSpecPropPriceStockDiv").get(0).style.display;
    if (_specPropStyleDisplay == "none") {
        if (GoodsPrice == "" || StockNum == "") {
            toastWin("【价格】和【库存】不能为空！");
            return;
        }
    }

    var MarketPrice = $("#MarketPrice").val().trim();
    var Discount = $("#Discount").val().trim();
    if (isNaN(MarketPrice) || isNaN(Discount)) {
        toastWin("【市场价】【折扣】必须是数字！");
        return;
    }
    if (parseFloat(Discount) <= 0 || parseFloat(Discount) >= 10) {
        toastWin("【折扣】必须是0-10之前的数！");
        return;
    }
    //------商品图片值------//
    //mImgKeyGuid | mImgPathDomain ^ mImgKeyGuid | mImgPathDomain^ mImgKeyGuid | mImgPathDomain
    //得到商品上传图片拼接数组 
    var _goodsImgArr = getGoodsImgArr();
    console.log("提交_goodsImgArr=" + _goodsImgArr);
    //alert("提交_goodsImgArr=" + _goodsImgArr);
    if (_goodsImgArr == "") {
        toastWin("请至少上传一张商品照片！");
        return;
    }

    //-------商品描述---------//
    var GoodsDesc = getEditorContent();
    if (GoodsDesc == "") {
        toastWin("【商品描述】不能为空！");
        return;
    }

    //------赠品-------//
    var _giftIDGiftNumArr = getGiftIDGiftNumArr();
    console.log("提交_giftIDGiftNumArr=" + _giftIDGiftNumArr);
    //alert("提交_giftIDGiftNumArr=" + _giftIDGiftNumArr);

    //------分销------//
    var IsDistri = "";
    var DistriMoney = "";

    var IsShareGoods = $("#IsShareGoods").is(':checked');
    var IsShowShareMoney = $("#IsShowShareMoney").is(':checked');

    //-------其他设置-------//
    //店铺商品类别
    var ShopGoodsTypeTop = $("#ShopGoodsTypeTop").val();
    var ShopGoodsTypeSecond = $("#ShopGoodsTypeSecond").val();
    //选择的类别ID
    var ShopGoodsTypeID = ShopGoodsTypeTop;
    if (ShopGoodsTypeSecond != "" && ShopGoodsTypeSecond != undefined && ShopGoodsTypeSecond != null) {
        ShopGoodsTypeID = ShopGoodsTypeSecond;
    }

    //是否支持 【到店消费 或者 快递，到店都支持】 (true , false , both)
    var IsShopExpense = $("#IsShopExpense").is(':checked');
    var IsExpressHome = $("#IsExpressHome").is(':checked');
    //alert("IsShopExpense=" + IsShopExpense + "|IsExpressHome=" + IsExpressHome);
    var IsShopExpenseVal = "false"; //默认快递发货
    if (IsShopExpense && IsExpressHome == false) {
        IsShopExpenseVal = "true"; //只支持到店消费
    }
    else if (IsShopExpense == false && IsExpressHome) {
        IsShopExpenseVal = "false"; //只支持快递发货
    }
    else if (IsShopExpense && IsExpressHome) {
        IsShopExpenseVal = "both"; //支持到店消费和快递发货
    }
    else {
        toastWin("【到店消费】和【送货上门(快递发货)】必须选择一个！");
        return;
    }
    console.log("提交IsShopExpenseVal=" + IsShopExpenseVal);
    //alert("提交IsShopExpenseVal=" + IsShopExpenseVal);

    //是否支付【货到付款】
    var IsPayDelivery = $("#IsPayDelivery").is(":checked");

    //是否支持【到店付】 true / false
    var IsOfflinePay = $("#IsOfflinePay").is(":checked");

    //包装售后说明
    var PackAfterSaleDesc = $("#PackAfterSaleDesc").val().trim();

    //运费模板ID
    var FtIDSelect = $("#FtIDSelect").val().trim();

    //构造POST参数
    var dataPOST = {
        "Type": "7", "GoodsMsgGuid": hidGoodsMsgGuid, "GoodsImgArr": _goodsImgArr, "GoodsTypeID": hidThirdGoodsTypeID, "GoodsTypeNeedProp": _goodsTypeNeedPropArr, "GoodsTypeCustomProp": mGoodsMypropArr, "GoodsTitle": GoodsTitle, "GoodsDesc": GoodsDesc, "GoodsSpecTitle": mGoodsSpecTitle, "GoodsPropTitle": mGoodsPropTitle, "GiftIDArr": _giftIDGiftNumArr, "ShopGoodsTypeID": ShopGoodsTypeID, "GoodsPrice": GoodsPrice, "StockNum": StockNum, "PackAfterSaleDesc": PackAfterSaleDesc, "IsPayDelivery": IsPayDelivery, "IsShopExpense": IsShopExpenseVal, "IsDistri": IsDistri, "DistriMoney": DistriMoney, "MarketPrice": MarketPrice, "Discount": Discount, "FtID": FtIDSelect, "IsOfflinePay": IsOfflinePay, "IsShareGoods": IsShareGoods, "IsShowShareMoney": IsShowShareMoney,
    };
    console.log(dataPOST);

    //加载提示
    loadingWin();

    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: mAjaxUrl + "?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            //console.log(reTxt);
            //移除加载提示
            closeLoadingWin();
            if (reTxt != "") {
                var _json = JSON.parse(reTxt);

                if (_json.Msg != "") {

                    //删除因重复上传导致的多余商品图片  --  不需要，已在后台处理
                    //delGoodsImgRepeat();

                    toastWinCb(_json.Msg, function () {
                        window.location.href = "../GoodsPage/GoodsMsg";
                    });
                    return;
                }
                if (_json.ErrMsg != "") {
                    toastWin(_json.ErrMsg);
                    return;
                }
            }
        },
        error: function (xhr, errorTxt, status) {
            console.log("异步请求错误，errorTxt=" + errorTxt + " | status=" + status);
            return;
        }
    });


}


/**
 * 加载指定记录条数的 商品简单信息列表，根据第三级商品类目
 * */
function loadListGoodsMsgSimpleByThirdType(pGoodsTypeIDThird) {

    //构造POST参数
    var dataPOST = {
        "Type": "8", "GoodsTypeIDThird": pGoodsTypeIDThird,
    };
    console.log(dataPOST);


    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: mAjaxUrl + "?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("加载指定记录条数的 商品简单信息列表，根据第三级商品类目=" + reTxt);

            if (reTxt != "") {
                var _jsonReTxt = JSON.parse(reTxt);

                //-------加载显示代码--------------//
                var myJsVal = "";
                for (var i = 0; i < _jsonReTxt.length; i++) {
                    myJsVal += " <a href=\"" + mOctWapWeb_AddrDomain + "/Mall/PagePreMobileIframe?LoadPreURL=" + mOctWapWeb_AddrDomain + "/Goods/GoodsDetail?GID=" + _jsonReTxt[i].GoodsID + "\" target=\"_blank\"><img src=\"//" + _jsonReTxt[i].GoodsCoverImgPath + "\" /></a>";                }
                $("#GoodsListPre").html(myJsVal);

            }
        },
        error: function (xhr, errorTxt, status) {
            console.log("异步请求错误，errorTxt=" + errorTxt + " | status=" + status);
            return;
        }
    });

}