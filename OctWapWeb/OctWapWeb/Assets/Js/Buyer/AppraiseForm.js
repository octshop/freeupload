//==================评价晒单========================//


/**-----定义公共变量------**/
var mAjaxUrl = "../BuyerAjax/AppraiseForm";

var mOrderID = ""; //订单ID
var mUserID = ""; //买家UserID
var mJsonReTxt = ""; //初始化后返回的Json对象


/**------初始化------**/
$(function () {

    mOrderID = $("#hidOrderID").val().trim();
    mUserID = $("#hidUserID").val().trim();

    //alert(createGuid());

    //初始化订单商品信息
    initOrderGoodsMsg();

    //初始化星星评价 表单 -- 店铺评价
    initAppraiseScoreShop();

});


/**------自定义函数------**/

/**
 * 初始化订单商品信息
 * */
function initOrderGoodsMsg() {
    //构造POST参数
    var dataPOST = {
        "Type": "1", "OrderID": mOrderID,
    };
    console.log(dataPOST);
    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: mAjaxUrl + "?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("初始化订单商品信息=" + reTxt);
            if (reTxt != "") {
                var _jsonReTxt = JSON.parse(reTxt);

                //如果不处于“待评价”状态，跳转到订单详情页
                if (_jsonReTxt.OrderStatus != "待评价") {
                    //跳转到订单详情
                    window.location.href = "../Order/OrderDetail?OID=" + mOrderID + "";
                }

                //构造评价列表显示代码
                var _xhtml = xhtmlAppraiseFormItem(_jsonReTxt);
                $("#OrderList").html(_xhtml);

                //初始化所有上传插件 
                for (var i = 0; i < _jsonReTxt.OrderGoodsList.length; i++) {

                    initUploadImg(i);

                }

                //初始化商品评价晒单的返积分信息
                initAppraiseShopIntegralSetting(_jsonReTxt.OrderGoodsList);


            }
        }
    });
}

/**
 * 构造评价列表显示代码
 * */
function xhtmlAppraiseFormItem(pJsonReTxt) {

    var OrderGoodsListArr = pJsonReTxt.OrderGoodsList;

    //初始化后返回的商品Json对象
    mJsonReTxt = pJsonReTxt;

    var myJsVal = "";    for (var i = 0; i < OrderGoodsListArr.length; i++) {        if (OrderGoodsListArr[i].GoodsTitle.length > 35) {            OrderGoodsListArr[i].GoodsTitle = OrderGoodsListArr[i].GoodsTitle.substring(0, 35) + "…";
        }        //初始化评价星星        var _appraiseStarHtml = appraiseScore("3", "" + i + "", true);        myJsVal += "<li class=\"order-item\">";
        myJsVal += "<div class=\"order-item-mid\">";        myJsVal += "  <a href=\"../Goods/GoodsDetail?GID=" + OrderGoodsListArr[i].GoodsID + "\" class=\"order-goods-item\">";        myJsVal += "      <div class=\"goods-item-left\">";        myJsVal += "          <img src=\"//" + OrderGoodsListArr[i].GoodsCoverImgPath + "\" />";        myJsVal += "      </div>";        myJsVal += "      <div class=\"goods-item-mid\">";        myJsVal += "          <span class=\"goods-item-title\">" + OrderGoodsListArr[i].GoodsTitle + "</span>";        myJsVal += "          <span class=\"goods-item-spec\">" + OrderGoodsListArr[i].SpecParamVal + "</span>";        myJsVal += "      </div>";        myJsVal += "      <div class=\"goods-item-right\">";        myJsVal += "          <span class=\"goods-item-price\">&#165;" + OrderGoodsListArr[i].GoodsUnitPrice + "</span>";        myJsVal += "          <span class=\"goods-item-ordernum\">&times; " + OrderGoodsListArr[i].OrderNum + "</span>";        myJsVal += "      </div>";        myJsVal += "  </a>";        myJsVal += "  <div class=\"appraise-item-form\">";        myJsVal += "      <div class=\"appraise-form-btn\">";        myJsVal += "          <span id=\"AppraiseIntregralSpan_" + OrderGoodsListArr[i].GoodsID + "\"></span>";        myJsVal += "          <input type=\"button\" class=\"btn-appraise-img\" value=\"评价晒单\" onclick=\"changeAppraiseItem('" + i + "')\" />";        myJsVal += "      </div>";        myJsVal += "      <div class=\"appraise-form-item\" id=\"AppraiseFormItem_" + i + "\" style=\"display:none;\">";        myJsVal += "          <ul class=\"appraise-form-ul\">";        myJsVal += "              <li class=\"aprraise-form-title\">";        myJsVal += "<div class=\"appraise-form-star\">";        myJsVal += "    商品评价：";        myJsVal += "    <span class=\"appraise-star-item\" id=\"AppraiseStarItem_" + i + "\">";        myJsVal += _appraiseStarHtml;        //myJsVal += "        <img src=\"../Assets/Imgs/Icon/appraise_star.png\" />";        //myJsVal += "        <img src=\"../Assets/Imgs/Icon/appraise_star.png\" />";        //myJsVal += "        <img src=\"../Assets/Imgs/Icon/appraise_star.png\" />";        //myJsVal += "        <img src=\"../Assets/Imgs/Icon/appraise_star_gray.png\" />";        //myJsVal += "        <img src=\"../Assets/Imgs/Icon/appraise_star_gray.png\" />";        myJsVal += "    </span>";        //---评价的分数        myJsVal += "<input type=\"hidden\" name=\"AppraiseStarScoreName_" + OrderGoodsListArr[i].GoodsID + "_" + OrderGoodsListArr[i].GoodsSpecID +"\" id=\"hidAppraiseStarScore_" + i + "\" value=\"3\" />";        myJsVal += "</div>";        myJsVal += "<div class=\"appraise-form-noname\" onclick=\"chgIsAnonymityItem('" + i + "')\">";        myJsVal += "    <img id=\"ImgIsAnonymity_" + i + "\" src=\"../Assets/Imgs/Icon/circle_nosel.png\" />匿名评价";        //---是否匿名评价        myJsVal += "<input type=\"hidden\" name=\"IsAnonymity_" + OrderGoodsListArr[i].GoodsID + "_" + OrderGoodsListArr[i].GoodsSpecID  + "\" id=\"hidIsAnonymity_" + i + "\" />";        myJsVal += "</div>";        myJsVal += "              </li>";        myJsVal += "              <li>";        //-----评价内容        myJsVal += "<textarea name=\"AppraiseContentName_" + OrderGoodsListArr[i].GoodsID + "_" + OrderGoodsListArr[i].GoodsSpecID + "\" class=\"appraise-content-txtarea\" placeholder=\"评价商品超过10个字就有机会获得积分！\"></textarea>";        myJsVal += "              </li>";        myJsVal += "              <li class=\"appraise-upload-img\">";        myJsVal += "<div class=\"upload-img\">";        //----上传文件---//        myJsVal += "<div class=\"upload-img-file\" style=\"position:relative\">";        myJsVal += "<img class=\"upload-camera\" src=\"../Assets/Imgs/Icon/camera.png\" />";        myJsVal += "<input id=\"fileupload_" + i + "\" type=\"file\" name=\"files[]\" multiple=\"multiple\" style=\"-moz-opacity:0;filter:alpha(opacity=0);opacity:0; width: 120px; height:50px; background:gray; overflow:hidden; position:absolute; left:0px; top:0\" />";        myJsVal += "</div>晒照片";        //上传的Guid        myJsVal += "<input id=\"hidUploadGuid_" + i + "\" type=\"hidden\" value=\"" + getNewGuid() + "\" />";        //----上传文件---//        myJsVal += "</div>";        myJsVal += "<div class=\"upload-pre\">";        //-----上传的晒单图片        myJsVal += "    <div name=\"UploadPreItemName_" + OrderGoodsListArr[i].GoodsID + "_" + OrderGoodsListArr[i].GoodsSpecID + "\" class=\"upload-pre-item upload-pre-item_" + i + "\" id=\"UploadPreItem_" + i + "_0\" data-upload=\"localhost:1400/Upload/GooAppraiseImg/GAI_10006_202005091850052300.jpg^7fba88e9-8622-5434-a251-7505cc085ed5\">";        myJsVal += "        无照片";        myJsVal += "    </div>";        myJsVal += "    <div name=\"UploadPreItemName_" + OrderGoodsListArr[i].GoodsID + "_" + OrderGoodsListArr[i].GoodsSpecID +"\" class=\"upload-pre-item upload-pre-item_" + i + "\" id=\"UploadPreItem_" + i + "_1\" data-upload=\"\">";        myJsVal += "        无照片";        myJsVal += "    </div>";        myJsVal += "    <div name=\"UploadPreItemName_" + OrderGoodsListArr[i].GoodsID + "_" + OrderGoodsListArr[i].GoodsSpecID + "\" class=\"upload-pre-item upload-pre-item_" + i + "\" id=\"UploadPreItem_" + i + "_2\" data-upload=\"\">";        myJsVal += "        无照片";        myJsVal += "    </div>";        myJsVal += "    <div name=\"UploadPreItemName_" + OrderGoodsListArr[i].GoodsID + "_" + OrderGoodsListArr[i].GoodsSpecID + "\" class=\"upload-pre-item upload-pre-item_" + i + "\" id=\"UploadPreItem_" + i + "_3\" data-upload=\"\">";        myJsVal += "        无照片";        myJsVal += "    </div>";        myJsVal += "</div>";        myJsVal += "              </li>";        myJsVal += "          </ul>";        myJsVal += "      </div>";        myJsVal += "  </div>";        myJsVal += "</div>";        myJsVal += "</li>";    }
    return myJsVal;
}

/**
 * 切换评价表单显示
 * @param {any} pAppraiseItemIndex Item索引
 */
function changeAppraiseItem(pAppraiseItemIndex) {

    //标签
    var _AppraiseItemLabel = $("#AppraiseFormItem_" + pAppraiseItemIndex);
    console.log(_AppraiseItemLabel.get(0).style.display);
    //是否显示
    var _styleDisplay = _AppraiseItemLabel.get(0).style.display;
    if (_styleDisplay == "none") {
        _AppraiseItemLabel.show();
    }
    else {
        _AppraiseItemLabel.hide();
    }
}

/**
 * 是否匿名评价按钮
 * @param {any} pImgIsAnonymityIndex
 */
function chgIsAnonymityItem(pImgIsAnonymityIndex) {

    //标签
    var _ImgIsAnonymityLabel = $("#ImgIsAnonymity_" + pImgIsAnonymityIndex);
    console.log(_ImgIsAnonymityLabel.attr("src"));
    var _ImgSrc = _ImgIsAnonymityLabel.attr("src");
    if (_ImgSrc.indexOf("circle_sel") >= 0) {
        _ImgIsAnonymityLabel.attr("src", "../Assets/Imgs/Icon/circle_nosel.png");
        $("#hidIsAnonymity_" + pImgIsAnonymityIndex).val("false");
    }
    else {
        _ImgIsAnonymityLabel.attr("src", "../Assets/Imgs/Icon/circle_sel.png");
        $("#hidIsAnonymity_" + pImgIsAnonymityIndex).val("true");
    }
}

/**
 * 星星评分函数 -- 商品评价
 * @param {any} pAppraiseScore 评分（1非常不满，2 不满意，3一般，4满意，5 非常满意 ）
 * @param {any} pAppraiseIndex 承载评分的Label索引 从0开始
 * @param pIsBackHtml 是否返回Html [ true / false ]
 */
function appraiseScore(pAppraiseScore, pAppraiseIndex, pIsBackHtml) {

    if (pAppraiseIndex == undefined || pAppraiseIndex == null || pAppraiseIndex == "") {
        pAppraiseIndex = "";
    }

    //console.log("pAppraiseScore=" + pAppraiseScore + " | pAppraiseIndex=" + pAppraiseIndex);

    //构造评分Img
    var _imgScoreHtml = "";

    if (pAppraiseScore == "1") {
        _imgScoreHtml += "<img src=\"../Assets/Imgs/Icon/appraise_star.png\" onclick=\"appraiseScore('1','" + pAppraiseIndex + "',false)\" />";
    }
    else if (pAppraiseScore == "2") {
        _imgScoreHtml += "<img src=\"../Assets/Imgs/Icon/appraise_star.png\" onclick=\"appraiseScore('1','" + pAppraiseIndex + "',false)\" />";
        _imgScoreHtml += "<img src=\"../Assets/Imgs/Icon/appraise_star.png\" onclick=\"appraiseScore('2','" + pAppraiseIndex + "',false)\" />";
    }
    else if (pAppraiseScore == "3") {
        _imgScoreHtml += "<img src=\"../Assets/Imgs/Icon/appraise_star.png\" onclick=\"appraiseScore('1','" + pAppraiseIndex + "',false)\" />";
        _imgScoreHtml += "<img src=\"../Assets/Imgs/Icon/appraise_star.png\" onclick=\"appraiseScore('2','" + pAppraiseIndex + "',false)\" />";
        _imgScoreHtml += "<img src=\"../Assets/Imgs/Icon/appraise_star.png\" onclick=\"appraiseScore('3','" + pAppraiseIndex + "',false)\" />";
    }
    else if (pAppraiseScore == "4") {
        _imgScoreHtml += "<img src=\"../Assets/Imgs/Icon/appraise_star.png\" onclick=\"appraiseScore('1','" + pAppraiseIndex + "',false)\" />";
        _imgScoreHtml += "<img src=\"../Assets/Imgs/Icon/appraise_star.png\" onclick=\"appraiseScore('2','" + pAppraiseIndex + "',false)\" />";
        _imgScoreHtml += "<img src=\"../Assets/Imgs/Icon/appraise_star.png\" onclick=\"appraiseScore('3','" + pAppraiseIndex + "',false)\" />";
        _imgScoreHtml += "<img src=\"../Assets/Imgs/Icon/appraise_star.png\" onclick=\"appraiseScore('4','" + pAppraiseIndex + "',false)\" />";
    }
    else if (pAppraiseScore == "5") {
        _imgScoreHtml += "<img src=\"../Assets/Imgs/Icon/appraise_star.png\" onclick=\"appraiseScore('1','" + pAppraiseIndex + "',false)\" />";
        _imgScoreHtml += "<img src=\"../Assets/Imgs/Icon/appraise_star.png\" onclick=\"appraiseScore('2','" + pAppraiseIndex + "',false)\" />";
        _imgScoreHtml += "<img src=\"../Assets/Imgs/Icon/appraise_star.png\" onclick=\"appraiseScore('3','" + pAppraiseIndex + "',false)\" />";
        _imgScoreHtml += "<img src=\"../Assets/Imgs/Icon/appraise_star.png\" onclick=\"appraiseScore('4','" + pAppraiseIndex + "',false)\" />";
        _imgScoreHtml += "<img src=\"../Assets/Imgs/Icon/appraise_star.png\" onclick=\"appraiseScore('5','" + pAppraiseIndex + "',false)\" />";
    }

    for (var i = 0; i < 5 - parseInt(pAppraiseScore); i++) {

        var _appraiseScore = parseInt(pAppraiseScore) + i + 1;

        _imgScoreHtml += "<img src=\"../Assets/Imgs/Icon/appraise_star_gray.png\" onclick=\"appraiseScore('" + _appraiseScore + "','" + pAppraiseIndex + "',false)\" />";
    }

    //console.log("_imgScoreHtml=" + _imgScoreHtml);

    if (pAppraiseIndex != "") {
        if (pIsBackHtml == false) {
            $("#AppraiseStarItem_" + pAppraiseIndex).html(_imgScoreHtml);
            $("#hidAppraiseStarScore_" + pAppraiseIndex).val(pAppraiseScore);
            console.log("当前评分：" + pAppraiseScore);
        }
    }

    if (pIsBackHtml == true) {
        return _imgScoreHtml;
    }

}


/**
 * 初始化上传插件
 * @param {any} pFileIndex 上传文件域索引 从 0 开始
 */
function initUploadImg(pFileIndex) {

    if (mUserID == "0" || mUserID == "") {
        return;
    }

    //上传的GUID
    var _UploadGuid = $("#hidUploadGuid_" + pFileIndex).val().trim();

    //构造POST参数
    var _dataPost = "Type=1&UploadGuid=" + _UploadGuid;
    console.log(_dataPost);

    $('#fileupload_' + pFileIndex).fileupload({
        url: "../FileUploadAjax/GooAppraiseImg?" + _dataPost + "&rnd=" + Math.random(),
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

            var mImgKeyGuid = _JsonObj.DataDic.ImgKeyGuid;
            var mImgPathDomain = _JsonObj.DataDic.ImgPathDomain;
            console.log("mImgKeyGuid=" + mImgKeyGuid + " | mImgPathDomain=" + mImgPathDomain);

            //插入与显示上传的图片
            insertUploadPreItem(mImgPathDomain, mImgKeyGuid, pFileIndex);

            ////为隐藏换件记录UploadGuid赋值
            //$("#hidUploadGuid_" + pFileIndex).val(mImgKeyGuid);

            ////获取图片域名 localhost:1400/Upload/ShopHeaderImg/SHI_1_201906160949557860.jpg
            //var _domain = mImgPathDomain.substring(0, mImgPathDomain.indexOf("/"));
            //console.log("_domain=" + _domain);
            ////获取图片相对路径 
            //var _imgPath = mImgPathDomain.replace(_domain + "/", "");
            //console.log("_imgPath=" + _imgPath);

            ////构造显示代码 显示上传后的图片
            //var _xhtml = "";
            //_xhtml += "<a href=\"//" + mImgPathDomain + "\" target=\"_blank\">";
            //_xhtml += " <img src=\"//" + mImgPathDomain + "\" />";
            //_xhtml += "</a>";
            //$("#FileUploadPreImg_" + pFileIndex).html(_xhtml);


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
            loadingWin();
            $(".loading-win-content").css("width", "130");
        });
}

/**
 * 插入与显示上传的图片
 * @param {any} pImgPathDomain localhost:1400/Upload/GooAppraiseImg/GAI_10006_202005091850052300.jpg
 * @param {any} pImgKeyGuid 7fba88e9-8622-5434-a251-7505cc085ed5
 * @param pItemIndex 列表Item索引
 */
function insertUploadPreItem(pImgPathDomain, pImgKeyGuid, pItemIndex) {

    var _uploadPreItemArr = $(".upload-pre-item_" + pItemIndex);
    console.log(_uploadPreItemArr);
    for (var i = 0; i < _uploadPreItemArr.length; i++) {
        var _uploadPreItemHtml = $(_uploadPreItemArr[i]).html().trim();
        console.log("_uploadPreItemHtml=" + _uploadPreItemHtml);
        if (_uploadPreItemHtml.indexOf("无照片") >= 0) {

            var myJsVal = "<img src=\"//" + pImgPathDomain + "\" />";            myJsVal += "<img class=\"icon-del\" src=\"../Assets/Imgs/Icon/icon-del.png\" onclick=\"delUploadImg('" + pImgKeyGuid + "','" + pImgPathDomain + "'," + pItemIndex + "," + i + ")\" />";            $(_uploadPreItemArr[i]).attr("data-upload", pImgPathDomain + "^" + pImgKeyGuid);            $(_uploadPreItemArr[i]).html(myJsVal);            return;        }
    }
}

/**
 * 删除上传的图片
 * @param {any} pUploadGuid 上传的GUID
 * @param pImgPath 图片的路径  localhost:1400/Upload/GooAppraiseImg/GAI_10006_202005091850052300.jpg
 * @param pPreImgIndex 预览图片的项索引
 * @param pItemIndex 列表Item索引
 */
function delUploadImg(pUploadGuid, pImgPath, pItemIndex, pPreImgIndex) {

    //去掉图片路径的域名
    pImgPath = pImgPath.substring(pImgPath.indexOf("/") + 1);
    console.log("pImgPath=" + pImgPath);

    //构造POST参数
    var dataPOST = {
        "Type": "3", "ImgKeyGuid": pUploadGuid, "ImgPath": pImgPath
    };
    console.log(dataPOST);
    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: "../FileUploadAjax/GooAppraiseImg?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("删除上传的图片=" + reTxt);
            if (reTxt != "") {
                var _jsonReTxt = JSON.parse(reTxt);

                if (_jsonReTxt.Msg != null && _jsonReTxt.Msg != undefined && _jsonReTxt.Msg != "") {

                    $("#UploadPreItem_" + pItemIndex + "_" + pPreImgIndex).html("无照片");

                    console.log("UploadPreItem_" + pItemIndex + "_" + pPreImgIndex);
                }


            }
        }
    });

}

/**
 * 初始化星星评价 表单 -- 店铺评价
 * */
function initAppraiseScoreShop() {

    appraiseScoreShop('5', "Goods", false);
    appraiseScoreShop('5', "Service", false);
    appraiseScoreShop('5', "Speed", false);
    appraiseScoreShop('5', "Attitude", false);
}

/**
 * 星星评分函数 -- 店铺评价
 * @param {any} pAppraiseScore 评价分数
 * @param {any} pLabelIDSubName 评价标子名称 [Goods,Service ,Speed,Attitude]
 * @param {any} pIsBackHtml 是否返回Html [true,false]
 */
function appraiseScoreShop(pAppraiseScore, pLabelIDSubName, pIsBackHtml) {


    //console.log("pAppraiseScore=" + pAppraiseScore + " | pAppraiseIndex=" + pAppraiseIndex);

    //构造评分Img
    var _imgScoreHtml = "";

    if (pAppraiseScore == "1") {
        _imgScoreHtml += "<img src=\"../Assets/Imgs/Icon/appraise_star.png\" onclick=\"appraiseScoreShop('1','" + pLabelIDSubName + "',false)\" />";
    }
    else if (pAppraiseScore == "2") {
        _imgScoreHtml += "<img src=\"../Assets/Imgs/Icon/appraise_star.png\" onclick=\"appraiseScoreShop('1','" + pLabelIDSubName + "',false)\" />";
        _imgScoreHtml += "<img src=\"../Assets/Imgs/Icon/appraise_star.png\" onclick=\"appraiseScoreShop('2','" + pLabelIDSubName + "',false)\" />";
    }
    else if (pAppraiseScore == "3") {
        _imgScoreHtml += "<img src=\"../Assets/Imgs/Icon/appraise_star.png\" onclick=\"appraiseScoreShop('1','" + pLabelIDSubName + "',false)\" />";
        _imgScoreHtml += "<img src=\"../Assets/Imgs/Icon/appraise_star.png\" onclick=\"appraiseScoreShop('2','" + pLabelIDSubName + "',false)\" />";
        _imgScoreHtml += "<img src=\"../Assets/Imgs/Icon/appraise_star.png\" onclick=\"appraiseScoreShop('3','" + pLabelIDSubName + "',false)\" />";
    }
    else if (pAppraiseScore == "4") {
        _imgScoreHtml += "<img src=\"../Assets/Imgs/Icon/appraise_star.png\" onclick=\"appraiseScoreShop('1','" + pLabelIDSubName + "',false)\" />";
        _imgScoreHtml += "<img src=\"../Assets/Imgs/Icon/appraise_star.png\" onclick=\"appraiseScoreShop('2','" + pLabelIDSubName + "',false)\" />";
        _imgScoreHtml += "<img src=\"../Assets/Imgs/Icon/appraise_star.png\" onclick=\"appraiseScoreShop('3','" + pLabelIDSubName + "',false)\" />";
        _imgScoreHtml += "<img src=\"../Assets/Imgs/Icon/appraise_star.png\" onclick=\"appraiseScoreShop('4','" + pLabelIDSubName + "',false)\" />";
    }
    else if (pAppraiseScore == "5") {
        _imgScoreHtml += "<img src=\"../Assets/Imgs/Icon/appraise_star.png\" onclick=\"appraiseScoreShop('1','" + pLabelIDSubName + "',false)\" />";
        _imgScoreHtml += "<img src=\"../Assets/Imgs/Icon/appraise_star.png\" onclick=\"appraiseScoreShop('2','" + pLabelIDSubName + "',false)\" />";
        _imgScoreHtml += "<img src=\"../Assets/Imgs/Icon/appraise_star.png\" onclick=\"appraiseScoreShop('3','" + pLabelIDSubName + "',false)\" />";
        _imgScoreHtml += "<img src=\"../Assets/Imgs/Icon/appraise_star.png\" onclick=\"appraiseScoreShop('4','" + pLabelIDSubName + "',false)\" />";
        _imgScoreHtml += "<img src=\"../Assets/Imgs/Icon/appraise_star.png\" onclick=\"appraiseScoreShop('5','" + pLabelIDSubName + "',false)\" />";
    }

    for (var i = 0; i < 5 - parseInt(pAppraiseScore); i++) {

        var _appraiseScore = parseInt(pAppraiseScore) + i + 1;

        _imgScoreHtml += "<img src=\"../Assets/Imgs/Icon/appraise_star_gray.png\" onclick=\"appraiseScoreShop('" + _appraiseScore + "','" + pLabelIDSubName + "',false)\" />";
    }

    //console.log("_imgScoreHtml=" + _imgScoreHtml);

    if (pLabelIDSubName != "") {
        if (pIsBackHtml == false) {
            $("#AppraiseStarItemShop_" + pLabelIDSubName).html(_imgScoreHtml);
            $("#hidAppraiseStarItemShop_" + pLabelIDSubName).val(pAppraiseScore);
            console.log("当前评分：" + pAppraiseScore);
        }
    }

    if (pIsBackHtml == true) {
        return _imgScoreHtml;
    }

}

/**
 * 初始化商品评价晒单的返积分信息
 * @param {any} pOrderGoodsList 订单商品信息列表JSON对象
 */
function initAppraiseShopIntegralSetting(pOrderGoodsList) {

    //构造GoodsIDArr
    var _goodsIDArr = "";
    for (var i = 0; i < pOrderGoodsList.length; i++) {
        _goodsIDArr += pOrderGoodsList[i].GoodsID + "^";
    }
    //去掉前后的"^"
    _goodsIDArr = removeFrontAndBackChar(_goodsIDArr, "^")

    //构造POST参数
    var dataPOST = {
        "Type": "3", "GoodsIDArr": _goodsIDArr,
    };
    console.log(dataPOST);
    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: mAjaxUrl + "?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("初始化商品评价晒单的返积分信息=" + reTxt);
            if (reTxt != "") {
                var _jsonReTxt = JSON.parse(reTxt);

                //循环显示商品评价晒单返积分值
                for (var j = 0; j < pOrderGoodsList.length; j++) {
                    //商品ID
                    var _goodsID = pOrderGoodsList[j].GoodsID;
                    //当前GoodsID的评价和晒单的积分
                    var _appraiseIntergralSum = 0;

                    //循环积分
                    for (var k = 0; k < _jsonReTxt.AppraiseIntegralSetting.length; k++) {

                        var _appraiseIntegralSetting = _jsonReTxt.AppraiseIntegralSetting[k];

                        if (_appraiseIntegralSetting.GoodsID == _goodsID && (_appraiseIntegralSetting.InSettingType == "Appraise" || _appraiseIntegralSetting.InSettingType == "AppraiseImg")) {
                            //统计积分
                            _appraiseIntergralSum += parseFloat(_appraiseIntegralSetting.IntegralPrice)

                        }

                    }

                    if (_appraiseIntergralSum > 0) {
                        //总的积分在前台显示
                        $("#AppraiseIntregralSpan_" + _goodsID).html("评价+晒单可获 " + _appraiseIntergralSum + " 积分");
                    }
                    

                }

            }
        }
    });

}


//========================提交评价信息======================//

/**
 * 构造提交的评价信息Json字符串 包括商品和店铺的
 * */
function buildJsonSubmitAppraiseMsg() {
    var _OrderGoodsListJson = mJsonReTxt.OrderGoodsList;

    //构造提交的Json字符串
    var _json = "{";
    _json += "\"OrderID\":\"" + mJsonReTxt.OrderID + "\",";
    _json += "\"BuyerUserID\":\"" + mJsonReTxt.BuyerUserID + "\",";
    _json += "\"ShopUserID\":\"" + mJsonReTxt.ShopUserID + "\",";

    _json += "\"AppraiseGoodsArr\":[";

    //订单商品列表
    for (var i = 0; i < _OrderGoodsListJson.length; i++) {

        //获取表单值
        var AppraiseStarScoreNameArr = $("[name='AppraiseStarScoreName_" + _OrderGoodsListJson[i].GoodsID + "_" + _OrderGoodsListJson[i].GoodsSpecID + "']");
        var IsAnonymityArr = $("[name='IsAnonymity_" + _OrderGoodsListJson[i].GoodsID + "_" + _OrderGoodsListJson[i].GoodsSpecID + "']");
        var AppraiseContentArr = $("[name='AppraiseContentName_" + _OrderGoodsListJson[i].GoodsID + "_" + _OrderGoodsListJson[i].GoodsSpecID + "']");

        //晒单图片数组
        var UploadPreItemArr = $("[name='UploadPreItemName_" + _OrderGoodsListJson[i].GoodsID + "_" + _OrderGoodsListJson[i].GoodsSpecID + "']");

        console.log($(AppraiseStarScoreNameArr[0]).val());

        _json += "{";
        _json += "\"GoodsID\":\"" +
            _OrderGoodsListJson[i].GoodsID + "\",";
        _json += "\"SpecParamVal\":\"" +
            _OrderGoodsListJson[i].SpecParamVal + "\",";
        _json += "\"AppraiseScore\":\"" + $(AppraiseStarScoreNameArr[0]).val().trim() + "\",";
        _json += "\"IsAnonymity\":\"" + $(IsAnonymityArr[0]).val().trim() + "\",";
        _json += "\"AppraiseContent\":\"" + $(AppraiseContentArr[0]).val().trim() + "\",";

        //-----晒单图片-----
        _json += "\"AppraiseImgs\":[";


        for (var j = 0; j < UploadPreItemArr.length; j++) {

            var _htmlContent = $(UploadPreItemArr[j]).html().trim();
            //console.log(_htmlContent);
            if (_htmlContent.indexOf("无照片") < 0) {

                //localhost:1400/Upload/GooAppraiseImg/GAI_10006_202005091850052300.jpg^7fba88e9-8622-5434-a251-7505cc085ed5
                var _UploadPreItemImgArr = $(UploadPreItemArr[j]).attr("data-upload").split("^");
                _json += "{";
                _json += "\"UploadGuid\":\"" + _UploadPreItemImgArr[1] + "\",";
                _json += "\"ImgUrl\":\"" + _UploadPreItemImgArr[0] + "\"";
                _json += "},"
            }
        }
        _json = removeFrontAndBackChar(_json, ",");

        _json += "]},";
    }
    _json = removeFrontAndBackChar(_json, ",");
    _json += "],";

    //---------店铺评价内容------------//
    _json += "\"ShopAppraise\":{";
    _json += "\"ConformityScore\":\"" + $("#hidAppraiseStarItemShop_Goods").val().trim() + "\",";
    _json += "\"AttitudeScore\":\"" + $("#hidAppraiseStarItemShop_Service").val().trim() + "\",";
    _json += "\"ExpressScore\":\"" + $("#hidAppraiseStarItemShop_Speed").val().trim() + "\",";
    _json += "\"DeliverymanScore\":\"" + $("#hidAppraiseStarItemShop_Attitude").val().trim() + "\"";
    _json += "}";


    _json += "}"

    console.log(_json);

    return _json;

}

/**
 * 提交订单商品评价
 * */
function submitAppraiseMsg() {

    confirmWin("确定提交评价吗？", function () {

        //构造提交的评价信息Json字符串 包括商品和店铺的
        var _jsonSubmitAppraiseMsg = buildJsonSubmitAppraiseMsg();
        //console.log("_jsonSubmitAppraiseMsg=" + _jsonSubmitAppraiseMsg);
        //return;

        //构造POST参数
        var dataPOST = {
            "Type": "2", "AppraiseJson": escape(_jsonSubmitAppraiseMsg),
        };
        console.log(dataPOST);
        //正式发送异步请求
        $.ajax({
            type: "POST",
            url: mAjaxUrl + "?rnd=" + Math.random(),
            data: dataPOST,
            dataType: "html",
            success: function (reTxt, status, xhr) {
                console.log("提交订单商品评价=" + reTxt);
                if (reTxt != "") {
                    var _jsonReTxt = JSON.parse(reTxt);

                    if (_jsonReTxt.ErrMsg != null && _jsonReTxt.ErrMsg != "" && _jsonReTxt.ErrMsg != undefined) {
                        toastWin(_jsonReTxt.ErrMsg);
                    }

                    if (_jsonReTxt.Msg != null && _jsonReTxt.Msg != "" && _jsonReTxt.Msg != undefined) {
                        //跳转到订单详情
                        window.location.href = "../Buyer/AppraiseDetail?OID=" + mOrderID + "";
                    }

                }
            }
        });

    });




}

