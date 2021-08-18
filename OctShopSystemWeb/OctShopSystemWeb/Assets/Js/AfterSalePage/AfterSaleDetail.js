//==================售后详情=====================//

/**-----定义公共变量------**/

//AjaxURL
var mAjaxUrl = "../AfterSale/AfterSaleApplyMsg";
var mAID = "";
var mOctWapWebAddrDomain = "";



/**------初始化------**/
$(function () {

    mAID = $("#hidApplyID").val().trim();
    mOctWapWebAddrDomain = $("#hidOctWapWebAddrDomain").val().trim();

    //初始化售后详情信息
    initAsDetail();
});

/**
 * 初始化售后详情信息
 * */
function initAsDetail() {
    //构造POST参数
    var dataPOST = {
        "Type": "11", "ApplyID": mAID,
    };
    console.log(dataPOST);

    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: mAjaxUrl + "?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("初始化商家端售后详情=" + reTxt);

            if (reTxt != "") {
                var _jsonObj = JSON.parse(reTxt);
                //赋值到显示代码中
                setValToXhtml(_jsonObj);
            }
        },
        error: function (xhr, errorTxt, status) {
            console.log("异步请求错误，errorTxt=" + errorTxt + " | status=" + status);
            return;
        }
    });
}

/**
 * 赋值给表单
 * @param {any} pJsonReTxt 初始化返回的Json对象
 */
function setValToXhtml(pJsonReTxt) {

    var AfterSaleMsg = pJsonReTxt.AfterSaleMsg;
    var AfterSaleSysMsg = pJsonReTxt.AfterSaleSysMsg;
    var AfterSaleGoodsMsg = pJsonReTxt.AfterSaleGoodsMsg;
    var AfterSaleDelivery = pJsonReTxt.AfterSaleDelivery;
    var AfterSaleSendGoods = pJsonReTxt.AfterSaleSendGoods;
    var AfterSaleSendGoodsBuyer = pJsonReTxt.AfterSaleSendGoodsBuyer;
    var AfterSaleDeliveryShop = pJsonReTxt.AfterSaleDeliveryShop;
    var ProblemImgsList = pJsonReTxt.ProblemImgsList;

    $("#StatusTtitle").html(pJsonReTxt.StatusTitle);
    $("#StatusDesc").html(pJsonReTxt.StatusDesc);

    if (AfterSaleSysMsg != null && AfterSaleSysMsg != undefined) {
        $("#MsgContent").html("售后动态：" + AfterSaleSysMsg.MsgContent + "  -- [ " + AfterSaleSysMsg.WriteDate + " ]");
    }

    //基本信息
    $("#ApplyID").html(AfterSaleMsg.ApplyID);
    $("#OrderID").html(AfterSaleMsg.OrderID);
    $("#GoodsID").html(AfterSaleMsg.GoodsID);
    $("#ApplyGoodsNum").html(AfterSaleMsg.ApplyGoodsNum);

    $("#OrderTime").html(AfterSaleMsg.OrderTime);
    $("#WriteDate").html(AfterSaleMsg.WriteDate);
    $("#FinishTime").html(AfterSaleMsg.FinishTime);

    //商品信息
    var myJsValGoods = "";    if (AfterSaleGoodsMsg != undefined && AfterSaleGoodsMsg != null) {        myJsValGoods += "<span><a href=\"" + mOctWapWebAddrDomain + "/Goods/GoodsDetailPreMobileIframe?GID=" + AfterSaleGoodsMsg.GoodsID + "\" target=\"_blank\">" + AfterSaleGoodsMsg.GoodsTitle + "  [ " + AfterSaleGoodsMsg.SpecParamVal + " ]</a>";        myJsValGoods += "</span>";        myJsValGoods += " <span>";        myJsValGoods += "&#165;" + AfterSaleGoodsMsg.GoodsUnitPrice + "  x  " + AfterSaleGoodsMsg.OrderNum + "";        myJsValGoods += "</span>";
    }    $("#AsOrderGoodsMsgList").html(myJsValGoods);

    $("#ServiceType").html(AfterSaleMsg.ServiceType + " [ " + getServiceTypeName(AfterSaleMsg.ServiceType) + " ] ");
    $("#ServiceWay").html(AfterSaleMsg.ServiceWay + " [ " + getServiceWay(AfterSaleMsg.ServiceWay) + " ] ");
    $("#RefundMoney").html("&#165; " + AfterSaleMsg.RefundMoney);

    //售后原因，回复说明
    $("#ApplyReason").html(AfterSaleMsg.ApplyReason);
    $("#ProblemDesc").html(AfterSaleMsg.ProblemDesc);
    $("#ReplyExplain").html(AfterSaleMsg.ReplyExplain);
    $("#RefuseReason").html(AfterSaleMsg.RefuseReason);
    $("#ApplyMemo").html(AfterSaleMsg.ApplyMemo);

    //售后问题图片展示
    var myJsValImgs = "";
    if (ProblemImgsList != undefined && ProblemImgsList != null) {
        for (var i = 0; i < ProblemImgsList.length; i++) {
            myJsValImgs += " <a href=\"javascript:void(0)\" onclick=\"openPhotoSwipe(" + i + ")\"><img src=\"//" + ProblemImgsList[i].ImgPath + "\" /></a>";        }
        $("#ProblemImgList").html(myJsValImgs);
        if (ProblemImgsList != null && ProblemImgsList != undefined) {
            if (ProblemImgsList.length > 0) {
                //初始化PhotoSwipe的数据
                initPhotoSwipeData(ProblemImgsList);
            }
        }
    }

    //服务/收货地址(买家)
    $("#DeliNameBuyer").html(AfterSaleDelivery.DeliName);
    $("#MobileBuyer").html(AfterSaleDelivery.Mobile);
    $("#RegionNameArrBuyer").html(AfterSaleDelivery.RegionNameArr);
    $("#DetailAddrBuyer").html(AfterSaleDelivery.DetailAddr);

    //买家发货信息
    if (AfterSaleSendGoodsBuyer.ExpressName != null && AfterSaleSendGoodsBuyer.ExpressName != "") {
        $("#ExpressNameBuyer").html(AfterSaleSendGoodsBuyer.ExpressName);
        $("#ExpressNumberBuyer").html(AfterSaleSendGoodsBuyer.ExpressNumber);
    }

    //商家发货或上门信息 或发货信息 
    if (AfterSaleSendGoods.ExpressName != null && AfterSaleSendGoods.ExpressName != "") {
        $("#ExpressNameShop").html(AfterSaleSendGoods.ExpressName);
        $("#ExpressNumberShop").html(AfterSaleSendGoods.ExpressNumber);
    }
    if (AfterSaleSendGoods.SendType == "Visiting") {
        $("#SendShopManShop").html(AfterSaleSendGoods.SendShopMan);
        $("#SendTelNumberShop").html(AfterSaleSendGoods.SendTelNumber);
    }

    //商家售后服务地址
    if (AfterSaleDeliveryShop.DeliName != null && AfterSaleDeliveryShop.DeliName != "") {
        $("#DeliNameShop").html(AfterSaleDeliveryShop.DeliName);
        $("#MobileShop").html(AfterSaleDeliveryShop.Mobile);
        $("#RegionNameArrShop").html(AfterSaleDeliveryShop.RegionNameArr);
        $("#DetailAddrShop").html(AfterSaleDeliveryShop.DetailAddr);
    }
}

/**
 * 得到服务类型名称
 * @param {any} pServiceType 服务类型 (maintain 维修 barter 换货 , refund 退货)
 */
function getServiceTypeName(pServiceType) {
    if (pServiceType == "maintain") {
        return "维修";
    }
    else if (pServiceType == "barter") {
        return "换货";
    }
    else if (pServiceType == "refund") {
        return "退货";
    }
}

/**
 * 得到售后方式名称 
 * @param {any} pServiceWay 售后方式 ( Express 快递售后  , Visiting 上门服务 )
 */
function getServiceWay(pServiceWay) {
    if (pServiceWay == "Express") {
        return "快递售后";
    }
    else if (pServiceWay == "Visiting") {
        return "上门服务";
    }
    return "";
}


//===================浏览图片插件=========================//

var mPhotoSwipeDataList = null; //PhotoSwipe的数据列表

/**
 * 初始化PhotoSwipe的数据
 * @param pDataImgMsgList 浏览图片数据列表-数组
 * */
function initPhotoSwipeData(pDataImgMsgList) {

    //var DataImgMsgList = mReTxtJson.ListGooAppraiseImg[pItemIndex].ListGooAppraiseImgs;

    mPhotoSwipeDataList = null;
    mPhotoSwipeDataList = [];

    //--------初始化PhotoSwipe值------------//

    //浏览图片PhotoSwipe的数据列表    _itemImgMsgArr = null;    //当前加载的图片索引
    mLoadIndex = 0;
    mIsAllImageSize = false; //是否全部都自动设置了图片尺寸
    gallery = null;
    mIsIniting = false; //是否初始化中


    for (var i = 0; i < pDataImgMsgList.length; i++) {


        mPhotoSwipeDataList[i] = {
            src: "//" + pDataImgMsgList[i].ImgPath,
            title: '<div style=\"font-size: 20px;\"></span>',
            w: 0,
            h: 0
        };

    }
    console.log(mPhotoSwipeDataList);

    //打开晒单图片浏览,浏览第一张
    //openPhotoSwipe(0)
}

/**
 * 打开晒单图片浏览
 * @param {any} pImgIndex
 */
function openPhotoSwipe(pImgIndex) {

    //console.log("pImgIndex=" + pImgIndex);

    if (mPhotoSwipeDataList == null) {
        return
    }

    //初始化 PhotoSwipe 相册浏览   -- $(function(){  在这里调用，必须是加载完成所有文件 });
    initPhotoSwipeAlbum(mPhotoSwipeDataList, pImgIndex);
}




