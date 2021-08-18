//===============会员账号详情==================//

/**-----定义公共变量------**/
//AjaxURL
var mAjaxUrl = "../UserGoodsShop/UserAccount";

//用户UserID
var mUserID = "";

var mOctWapWebAddrDomain = "";

/**------初始化------**/
$(function () {

    //mOctWapWebAddrDomain = $("#hidOctWapWebAddrDomain").val().trim();

    mUserID = $("#hidUserID").val().trim();

    //初始化会员账号信息
    initUserAccountDetailView();

});


//===================自定义函数======================//

/**
 * 初始化会员账号信息
 * */
function initUserAccountDetailView() {

    //构造POST参数
    var dataPOST = {
        "Type": "4", "UserID": mUserID,
    };
    console.log(dataPOST);

    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: mAjaxUrl + "?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("初始化会员账号信息=" + reTxt);
            if (reTxt != "") {
                var _jsonReTxt = JSON.parse(reTxt);
                var ModelUserAccount = _jsonReTxt.ModelUserAccount
                var ModelBuyerMsg = _jsonReTxt.ModelBuyerMsg
                var ModelShopMsg = _jsonReTxt.ModelShopMsg

                //会员状态提示
                if (ModelUserAccount.IsTransDividend == "false") {
                    $("#StatusTtitle").html("禁止账号分润转入");
                    $("#StatusDesc").html("分润余额和积分禁止转入账户余额和积分中！");
                    $(".order-status").css("background", "red");
                }
                if (ModelUserAccount.IsLock == "true") {
                    $("#StatusTtitle").html("账号被锁定");
                    $("#StatusDesc").html("被锁定的账号，不能进行任何操作！");
                    $(".order-status").css("background", "red");
                }

                $("#UserID").html(ModelUserAccount.UserID);
                $("#UserAccount").html(ModelUserAccount.UserAccount);
                $("#UserNick").html(ModelUserAccount.UserNick);
                $("#BindMobile").html(ModelUserAccount.BindMobile);
                $("#CreditScore").html(ModelUserAccount.CreditScore);
                $("#VipLevel").html(_jsonReTxt.VipLevelName);
                $("#WxOpenID").html(ModelUserAccount.WxOpenID);
                $("#WxUnionID").html(ModelUserAccount.WxUnionID);

                var _IsOpenShop = "未开店";
                if (ModelUserAccount.IsOpenShop == "true") {
                    _IsOpenShop = "已开店";
                }
                $("#IsOpenShop").html(_IsOpenShop);

                var _IsTransDividend = "可以转入";
                if (ModelUserAccount.IsTransDividend == "true") {
                    _IsTransDividend = "不可以转入";
                }
                $("#IsTransDividend").html(_IsTransDividend);

                var _IsLock = "否";
                if (ModelUserAccount.IsLock == "true") {
                    _IsLock = "是";
                }
                $("#IsLock").html(_IsLock);

                $("#RegDate").html(ModelUserAccount.RegDate);
                $("#SelCityRegionCodeArr").html("" + ModelUserAccount.SelCityRegionCodeArr + " (" + _jsonReTxt.SelCityRegionNameArr + ")");
                $("#CurrentRegionCodeArr").html("" + ModelUserAccount.CurrentRegionCodeArr + " (" + _jsonReTxt.CurrentRegionNameArr + ")");
                $("#LongitudeLatitude").html("<a href=\"https://apis.map.qq.com/uri/v1/marker?marker=coord:" + ModelUserAccount.Latitude + "," + ModelUserAccount.Longitude + ";title:用户当前位置;addr:&referer=myapp\" target=\"_blank\">" + ModelUserAccount.Longitude + "，" + ModelUserAccount.Latitude + "</a>");

                $("#AccountMemo").html(ModelUserAccount.AccountMemo);

                //买家信息显示
                $("#HeaderImgB").html("<img src=\"" + ModelBuyerMsg.HeaderImg + "\" /> " + ModelBuyerMsg.UserNick);
                $("#TrueName").html(ModelBuyerMsg.TrueName);
                $("#LinkMobile").html(ModelBuyerMsg.LinkMobile);
                $("#BuyerSex").html(ModelBuyerMsg.BuyerSex);
                $("#BirthDay").html(ModelBuyerMsg.BirthDay);
                $("#Email").html(ModelBuyerMsg.Email);
                $("#Profession").html(ModelBuyerMsg.Profession);
                $("#RegionCodeArr").html("" + ModelBuyerMsg.RegionCodeArr + " ( " + ModelBuyerMsg.RegionNameArr + " )");
                $("#DetailAddr").html(ModelBuyerMsg.DetailAddr);
                $("#WriteDate").html(ModelBuyerMsg.WriteDate);

                //店铺信息显示
                $("#ShopNameB").html("<img src=\"//" + ModelShopMsg.ShopHeaderImg + "\" /> " + ModelShopMsg.ShopName);
                $("#ShopMobile").html(ModelShopMsg.ShopMobile);
                $("#LinkMan").html(ModelShopMsg.LinkMan);
                $("#LinkManMobile").html(ModelShopMsg.LinkManMobile);
                $("#SeeShopDetailLinkA").attr("href", "../UserGoodsShopPage/ShopMsgDetail?ShopID=" + ModelShopMsg.ShopID + "");
            }
        },
        error: function (xhr, errorTxt, status) {
            console.log("异步请求错误，errorTxt=" + errorTxt + " | status=" + status);
            //alert("异步请求错误，errorTxt=" + errorTxt + " | status=" + status);
            return;
        }
    });



}