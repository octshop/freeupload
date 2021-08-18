//================买家消息========================//

/**-----定义公共变量------**/
var mAjaxUrl = "../BuyerAjax/BuyerMsg";

//统计数量
var mCountAllMsg = 0;
var mCountOrderMsg = 0;
var mCountAfterSaleMsg = 0;
var mCountCusSerMsg = 0;

/**------初始化------**/
$(function () {

    // 加载买家端所有的系统消息阅读集合
    loadReadAllSysMsgBuyerList("All");

});


/**------自定义函数------**/

/**
 * 切换选项卡
 * @param {any} pSysMsgType 系统信息类别 (Order交易 AfterSale 售后 CusSer 客服咨询 All所有消息)
 */
function chgTab(pSysMsgType) {

    $(".tab-item").removeClass("tab-item-current");
    var _TabItemLabelArr = $(".tab-item");

    if (pSysMsgType == "All") {
        $(_TabItemLabelArr[0]).addClass("tab-item-current");
    }
    else if (pSysMsgType == "CusSer") {
        $(_TabItemLabelArr[1]).addClass("tab-item-current");
    }
    else if (pSysMsgType == "Order") {
        $(_TabItemLabelArr[2]).addClass("tab-item-current");
    }
    else if (pSysMsgType == "AfterSale") {
        $(_TabItemLabelArr[3]).addClass("tab-item-current");
    }

    //加载买家端所有的系统消息阅读集合
    loadReadAllSysMsgBuyerList(pSysMsgType)

}

/**
 * 加载买家端所有的系统消息阅读集合
 * @param pSysMsgType 系统信息类别 (Order交易 AfterSale 售后 CusSer 客服咨询 All所有消息)
 * */
function loadReadAllSysMsgBuyerList(pSysMsgType) {

    //------暂时关闭客服咨询信息------//
    //if (pSysMsgType == "CusSer") {

    //    $("#MsgList").html("");
    //    return;
    //}

    //构造POST参数
    var dataPOST = {
        "Type": "1", "SysMsgType": pSysMsgType,
    };
    console.log(dataPOST);
    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: mAjaxUrl + "?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            console.log("加载买家端所有的系统消息阅读集合=" + reTxt);
            if (reTxt != "") {
                var _jsonReTxt = JSON.parse(reTxt);

                var ReadAllSysMsgList = _jsonReTxt.ReadAllSysMsgList;
                var ExtraDataList = _jsonReTxt.ExtraDataList;

                mCountOrderMsg = 0;
                mCountAfterSaleMsg = 0;
                mCountCusSerMsg = 0;

                //构造显示代码
                var myJsVal = "";
                for (var i = 0; i < ReadAllSysMsgList.length; i++) {


                    if (ReadAllSysMsgList[i].SysMsgType == "Order") {

                        if (ReadAllSysMsgList[i].IsRead == "false") {
                            mCountOrderMsg++
                        }

                        myJsVal += " <ul class=\"order-list\">";
                        myJsVal += " <li class=\"order-item\">";
                        myJsVal += "     <div class=\"order-item-top\">";
                        myJsVal += "         <div class=\"order-status-txt\">";
                        myJsVal += "[交易]：" + ReadAllSysMsgList[i].MsgTitle + "";
                        myJsVal += "         </div>";
                        myJsVal += "         <div class=\"msg-date-time\">";
                        myJsVal += "" + ReadAllSysMsgList[i].WriteDate + "";
                        myJsVal += "         </div>";
                        myJsVal += "     </div>";
                        myJsVal += "     <div class=\"order-item-mid\" onclick=\"window.location.href='../Order/OrderDetail?OID=" + ReadAllSysMsgList[i].ExtraData + "'\">";

                        //订单商品列表
                        if (ExtraDataList[i].GoodsMsgList != undefined) {
                            for (var j = 0; j < ExtraDataList[i].GoodsMsgList.length; j++) {

                                var GoodsMsg = ExtraDataList[i].GoodsMsgList[j];

                                myJsVal += "         <a href=\"#\" class=\"order-goods-item\">";
                                myJsVal += "             <div class=\"goods-item-left\">";
                                myJsVal += "  <img src=\"//" + GoodsMsg.GoodsCoverImgPath + "\" />";
                                myJsVal += "             </div>";
                                myJsVal += "             <div class=\"goods-item-mid\">";
                                myJsVal += "  <span class=\"goods-item-title\">" + GoodsMsg.GoodsTitle + "</span>";
                                myJsVal += "  <span class=\"goods-item-spec\">" + GoodsMsg.SpecParamVal + "</span>";
                                myJsVal += "             </div>";
                                myJsVal += "             <div class=\"goods-item-right\">";
                                myJsVal += "  <span class=\"goods-item-price\">&#165;" + GoodsMsg.GoodsUnitPrice + "</span>";
                                myJsVal += "  <span class=\"goods-item-ordernum\">&times; " + GoodsMsg.OrderNum + "</span>";
                                myJsVal += "             </div>";
                                myJsVal += "         </a>";
                            }
                        }


                        myJsVal += "     </div>";
                        myJsVal += " </li>";
                        myJsVal += "</ul>";
                    }
                    else if (ReadAllSysMsgList[i].SysMsgType == "AfterSale") //售后
                    {
                        if (ReadAllSysMsgList[i].IsRead == "false") {
                            mCountAfterSaleMsg++
                        }


                        myJsVal += " <ul class=\"order-list\">";
                        myJsVal += " <li class=\"order-item\">";
                        myJsVal += "     <div class=\"order-item-top\">";
                        myJsVal += "         <div class=\"order-status-txt\">";
                        myJsVal += "[售后]：" + ReadAllSysMsgList[i].MsgTitle + "";
                        myJsVal += "         </div>";
                        myJsVal += "         <div class=\"msg-date-time\">";
                        myJsVal += "" + ReadAllSysMsgList[i].WriteDate + "";
                        myJsVal += "         </div>";
                        myJsVal += "     </div>";
                        myJsVal += "     <div class=\"order-item-mid\" onclick=\"window.location.href='../AfterSale/AsDetail?AID=37" + ReadAllSysMsgList[i].ExtraData + "'\">";

                        if (ExtraDataList[i].GoodsTitle != undefined) {
                            myJsVal += "         <a href=\"#\" class=\"order-goods-item\">";
                            myJsVal += "             <div class=\"goods-item-left\">";
                            myJsVal += "  <img src=\"//" + ExtraDataList[i].GoodsCoverImgPath + "\" />";
                            myJsVal += "             </div>";
                            myJsVal += "             <div class=\"goods-item-mid\">";
                            myJsVal += "  <span class=\"goods-item-title\">" + ExtraDataList[i].GoodsTitle + "</span>";
                            myJsVal += "  <span class=\"goods-item-spec\">" + ExtraDataList[i].SpecParamVal + "</span>";
                            myJsVal += "             </div>";
                            myJsVal += "             <div class=\"goods-item-right\">";
                            myJsVal += "  <span class=\"goods-item-price\">&#165;" + ExtraDataList[i].GoodsUnitPrice + "</span>";
                            myJsVal += "  <span class=\"goods-item-ordernum\">&times; " + ExtraDataList[i].OrderNum + "</span>";
                            myJsVal += "             </div>";
                            myJsVal += "         </a>";

                        }

                        myJsVal += "     </div>";
                        myJsVal += " </li>";
                        myJsVal += "</ul>";
                    }
                    else if (ReadAllSysMsgList[i].SysMsgType == "CusSer") //客服咨询
                    {
                        if (ReadAllSysMsgList[i].IsRead == "false") {
                            mCountCusSerMsg++
                        }


                        myJsVal += "<div class=\"customer-list\" onclick=\"buildBuyerGoToImSysURL_ShopWap('" + ReadAllSysMsgList[i].ShopUserID + "', '" + ReadAllSysMsgList[i].BuyerUserID + "')\">";
                        myJsVal += "  <div class=\"customer-list-left\">";
                        myJsVal += "      <img src=\"//" + ExtraDataList[i].ShopHeaderImg + "\" />";
                        myJsVal += "  </div>";
                        myJsVal += "  <div class=\"customer-list-right\">";
                        myJsVal += "      <div class=\"customer-right-top\">";
                        myJsVal += "          <div>";
                        myJsVal += "" + ExtraDataList[i].ShopName + "";
                        myJsVal += "          </div>";
                        myJsVal += "          <div class=\"msg-date-time\">";
                        myJsVal += "" + ReadAllSysMsgList[i].WriteDate + "";
                        myJsVal += "          </div>";
                        myJsVal += "      </div>";
                        myJsVal += "      <div class=\"customer-right-bottom\">";
                        myJsVal += "          [ " + ReadAllSysMsgList[i].MsgContent + " ]";
                        myJsVal += "      </div>";
                        myJsVal += "  </div>";
                        myJsVal += "</div>";
                    }

                }
                //显示代码插入前台
                $("#MsgList").html(myJsVal);

                if (mCountAllMsg == 0) {
                    mCountAllMsg = mCountOrderMsg + mCountAfterSaleMsg + mCountCusSerMsg;
                }
                else {
                    $("#AllBageNum").show();
                }

                if (mCountOrderMsg > 0) {
                    $("#OrderBageNum").html(mCountOrderMsg);
                    $("#OrderBageNum").show();
                }

                if (mCountAfterSaleMsg > 0) {
                    $("#AfterSaleBageNum").html(mCountAfterSaleMsg);
                    $("#AfterSaleBageNum").show();
                }

                if (mCountCusSerMsg > 0) {
                    $("#CusSerBageNum").html(mCountCusSerMsg);
                    $("#CusSerBageNum").show();
                }

                if (mCountAllMsg > 0) {
                    $("#AllBageNum").html(mCountAllMsg);
                    $("#AllBageNum").show();
                }

            }
            else {
                $("#MsgList").html("");
            }
        }
    });

}




//-------------构建【商家店铺】咨询进入IM在线客服系统 跳转 URL----------------------//
var mBuyerGoToImSysURL_ShopWap = "";
/**
 * -----构建商家店铺咨询进入IM在线客服系统 跳转 URL-----
 * @param {any} pShopUserID
 * @param {any} pBuyerUserID
 */
function buildBuyerGoToImSysURL_ShopWap(pShopUserID, pBuyerUserID) {

    //构造POST参数
    var dataPOST = {
        "Type": "1", "ShopUserID": pShopUserID, "BuyerUserID": pBuyerUserID,
    };
    console.log(dataPOST);

    //正式发送异步请求
    $.ajax({
        type: "POST",
        url: "../ImSysAjax/Index?rnd=" + Math.random(),
        data: dataPOST,
        dataType: "html",
        success: function (reTxt, status, xhr) {
            //console.log("构建商家店铺咨询进入IM在线客服系统跳转URL=" + reTxt);

            if (reTxt != "") {
                //$("#hidBuyerGoToImSysURL_ShopWap").val(reTxt);

                mBuyerGoToImSysURL_ShopWap = reTxt;


                if (mBuyerGoToImSysURL_ShopWap != "" && mBuyerGoToImSysURL_ShopWap != null && mBuyerGoToImSysURL_ShopWap != undefined) {

                    //$("#CustomServicesOnlineDiv").unbind();
                    ////页脚下面的客服
                    //$("#CustomServicesOnlineDiv").on("click", function () {
                    //    window.location.href = encodeURI(mBuyerGoToImSysURL_ShopWap);
                    //});
                    //$("#CusServiceA").attr("href", encodeURI(mBuyerGoToImSysURL_ShopWap));

                    window.location.href = encodeURI(mBuyerGoToImSysURL_ShopWap);


                }
            }
        }
    });
}


