//=========================需要保存到Cookie的数据-相关逻辑====================//
var mUtils = require('../utils/util.js');

//------------暴露接口---------//
module.exports = {
  //--------------相关逻辑函数--------------//
  saveBuyerSelReceiAddrRegionCookie: saveBuyerSelReceiAddrRegionCookie, //设置当前买家选择的收货地址Cookie值【 BReceiAddrID ^ 430000_430100_430121 ^ 湖南省_长沙市_长沙县 】
  getBuyerSelReceiAddrRegionCookie: getBuyerSelReceiAddrRegionCookie, //得到 当前买家选择的收货地址Cookie值
  setOrderGoodsMsgCookieArrSingle: setOrderGoodsMsgCookieArrSingle, //设置需要订单商品Cookie数组,以便下单使用 _单个商品订购通道  用“^”拼接【GoodsID ^ OrderNum ^ SpecID ^ pGroupSettingID】
  getOrderGoodsMsgCookieArrSingle: getOrderGoodsMsgCookieArrSingle, //得到订购的 商品Cookie拼接数组 _单个商品订购通道  用“^”拼接【GoodsID ^ OrderNum ^ SpecID ^ pGroupSettingID】
  saveGoToImSysUrlCookie: saveGoToImSysUrlCookie, //设置跳转到 IM在线客服系统 的 URL cookie值
  getGoToImSysUrlCookie: getGoToImSysUrlCookie, //得到 Cookie 中 进入IM在线客服系统 的 URL
  setScartIDOrderNumArrCookie: setScartIDOrderNumArrCookie, //设置去结算的Cookie  得到购物车信息ID 与之对应的  订购数量 拼接字符串  [ SCartID _ OrderNum ^ SCartID _ OrderNum | SCartID _ OrderNum ^ SCartID _ OrderNum]
  getScartIDOrderNumArrCookie: getScartIDOrderNumArrCookie, //得到去结算的Cookie  得到购物车信息ID 与之对应的  订购数量 拼接字符串  [ SCartID _ OrderNum ^ SCartID _ OrderNum | SCartID _ OrderNum ^ SCartID _ OrderNum]
  setWebViewSrcCookie: setWebViewSrcCookie, //设置 -- WebView的Src的Cookie值, URL网址
  getWebViewSrcCookie: getWebViewSrcCookie, //得到 --  WebView的Src的Cookie值, URL网址
  clearAllCookie: clearAllCookie, //清除所有缓存
  clearFixNameCookie: clearFixNameCookie, //清除指定的Cookie值
  setBuyerShareGoodsCookie: setBuyerShareGoodsCookie, //设置 - 分享商品返佣Cookie
  getBuyerShareGoodsCookie: getBuyerShareGoodsCookie, //得到 - 分享商品返佣Cookie
  setPQRCRSACookie:setPQRCRSACookie, //设置 - 分享好友链接-PQRCRSA的Cookie
  getPQRCRSACookie:getPQRCRSACookie,//得到 - 分享好友链接-PQRCRSA的Cookie
}

//-------公共变量-------//

//------初始化APP对象-----//
var app = getApp();

//=====================收货地址Cookie======================//


/**
 * 设置当前买家选择的收货地址Cookie值【 BReceiAddrID ^ 430000_430100_430121 ^ 湖南省_长沙市_长沙县 】
 * @param {*} pBReceiAddrID  收货地址ID
 * @param {*} pRegionCodeArr  地区范围代码 用"_"连接
 * @param {*} pRegionNameArr  地区范围名称 用"_"连接
 */
function saveBuyerSelReceiAddrRegionCookie(pBReceiAddrID, pRegionCodeArr, pRegionNameArr) {

  //构造Cookie值 【 BReceiAddrID ^ 430000_430100_430121 ^ 湖南省_长沙市_长沙县 】
  //  string _cookieVal = "" + pBReceiAddrID + "^" + pRegionCodeArr + "^" + pRegionNameArr + "";
  var _cookieVal = "" + pBReceiAddrID + "^" + pRegionCodeArr + "^" + pRegionNameArr + "";
  mUtils.setCookie("BuyerSelReceiAddrRegionCookie", _cookieVal);
}
/**
 * 得到 当前买家选择的收货地址Cookie值
 * @param {*} pCallBack 返回对象 BReceiAddrID,RegionCodeArr,RegionNameArr，没有为空值“”
 */
function getBuyerSelReceiAddrRegionCookie(pCallBack) {

  mUtils.getCookie("BuyerSelReceiAddrRegionCookie", res => {
    console.log(res);
    if (res.indexOf("undefined") < 0 && res != "" && res != null) {
      var _cookieArr = res.split('^');
      var _cookieObj = {
        "BReceiAddrID": _cookieArr[0],
        "RegionCodeArr": _cookieArr[1],
        "RegionNameArr": _cookieArr[2],
      };
      pCallBack(_cookieObj);
    } else {
      pCallBack("");
    }
  });

}

//=====================订购商品Cookie======================//

/**
 * 设置需要订单商品Cookie数组,以便下单使用 _单个商品订购通道  用“^”拼接【GoodsID ^ OrderNum ^ SpecID ^ pGroupSettingID】
 * @param {*} pGoodsID 
 * @param {*} pOrderNum 
 * @param {*} pSpecID 
 * @param {*} pGroupSettingID 
 */
function setOrderGoodsMsgCookieArrSingle(pGoodsID, pOrderNum, pSpecID = 0, pGroupSettingID = 0) {
  //设置订购参数Cookie 【GoodsID ^ OrderNum ^ SpecID ^ pGroupSettingID】
  var _cookieVal = pGoodsID + "^" + pOrderNum + "^" + pSpecID + "^" + pGroupSettingID;
  mUtils.setCookie("OrderGoodsCookie", _cookieVal);
}
/**
 * 得到订购的 商品Cookie拼接数组 _单个商品订购通道  用“^”拼接【GoodsID ^ OrderNum ^ SpecID ^ pGroupSettingID】
 */
function getOrderGoodsMsgCookieArrSingle(pCallBack) {
  mUtils.getCookie("OrderGoodsCookie", res => {
    console.log(res);
    if (res.indexOf("undefined") < 0 && res != "" && res != null) {
      var _cookieArr = res.split('^');
      var _cookieObj = {
        "GoodsID": _cookieArr[0],
        "OrderNum": _cookieArr[1],
        "SpecID": _cookieArr[2],
        "GroupSettingID": _cookieArr[3],
      };
      pCallBack(_cookieObj);
    } else {
      pCallBack("");
    }
  });
}

//=====================去结算的Cookie======================//
/**
 * 设置去结算的Cookie  得到购物车信息ID 与之对应的  订购数量 拼接字符串  [ SCartID _ OrderNum ^ SCartID _ OrderNum | SCartID _ OrderNum ^ SCartID _ OrderNum]
 * @param {*} pScartIDOrderNumArr 
 */
function setScartIDOrderNumArrCookie(pScartIDOrderNumArr) {
  mUtils.setCookie("ScartIDOrderNumArrCookie", pScartIDOrderNumArr);
}
/**
 * 得到去结算的Cookie  得到购物车信息ID 与之对应的  订购数量 拼接字符串  [ SCartID _ OrderNum ^ SCartID _ OrderNum | SCartID _ OrderNum ^ SCartID _ OrderNum]
 */
function getScartIDOrderNumArrCookie(pCallBack) {
  mUtils.getCookie("ScartIDOrderNumArrCookie", res => {
    console.log(res);
    if (res.indexOf("undefined") < 0 && res != "" && res != null) {
      pCallBack(res);
    } else {
      pCallBack("");
    }
  });
}

//=====================分享商品返佣Cookie======================//

/**
 * 设置 - 分享商品返佣Cookie
 * @param {*} pKeyEn  //加密后的 商品分享KEY  带 + 的
 */
function setBuyerShareGoodsCookie(pKeyEn) {
  mUtils.setCookie("BuyerShareGoodsCookie", pKeyEn);
}

/**
 * 得到 - 分享商品返佣Cookie
 * @param {} pCallBack 
 */
function getBuyerShareGoodsCookie(pCallBack) {
  mUtils.getCookie("BuyerShareGoodsCookie", res => {
    console.log(res);
    if (res.indexOf("undefined") < 0 && res != "" && res != null) {
      pCallBack(res);
    } else {
      pCallBack("");
    }
  });
}

//=====================	我的分享码，分享好友链接-PQRCRSA的Cookie======================//

/**
 * 设置 - 分享好友链接-PQRCRSA的Cookie
 * @param {*} pPQRCRSA  获取连接传递的推广者信息 二维码内容  BuyerUserID ^ LoginPwdNoSha1 ^ PromoteUser  RSA加密的
 */
function setPQRCRSACookie(pPQRCRSA) {
  //获取连接传递的推广者信息 二维码内容  BuyerUserID ^ LoginPwdNoSha1 ^ PromoteUser  RSA加密的
  mUtils.setCookie("PQRCRSACookie", pPQRCRSA);
}

/**
 * 得到 - 分享好友链接-PQRCRSA的Cookie
 * @param {} pCallBack 
 */
function getPQRCRSACookie(pCallBack) {
  mUtils.getCookie("PQRCRSACookie", res => {
    console.log(res);
    if (res.indexOf("undefined") < 0 && res != "" && res != null) {
      pCallBack(res);
    } else {
      pCallBack("");
    }
  });
}




//==================IM在线客服系统Cooike==================//

/**
 * 设置跳转到 IM在线客服系统 的 URL cookie值
 * @param {*} pGoToImSysUrl 跳转URL http://192.168.3.10:1900/EnterIm/VisitorEnter?ShopUserID=20040&VisitType=Goods&MobileNum=13203156002&IsShowTitleHeader=true&BuyerUserID=30103&BuyerNick=IT独孤键客??&BuyerHeaderImg=https://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTIJ0LzanNRXez3hSyu9xPVyjBhy4AodBPnsBTqat1TacnsOkLVoDibKMfaic9vECJd5GqO8Ox8X2Cpw/132&VisitorMemo=国金拾亿轻奢情侣房&TopTitle=呀呀高档四星酒店_OctIM在线客服&TopAHref=http://localhost:1000/Shop/Index?SID=50039&ShowItemHeaderImgUrl=//localhost:1400/Upload/GooGoodsImg/GoGI_20040_202012131511543080.png&ShowTitle=国金拾亿轻奢情侣房-商品咨询&ShowTitleSub=&OsType=Wap&rnd=20210320104106064
 */
function saveGoToImSysUrlCookie(pGoToImSysUrl) {

  mUtils.setCookie("GoToImSysUrlCookie", pGoToImSysUrl);
  return true;
}
/**
 * 得到 Cookie 中 进入IM在线客服系统 的 URL
 * @param {*} pCallBack 
 */
function getGoToImSysUrlCookie(pCallBack) {
  mUtils.getCookie("GoToImSysUrlCookie", pCallBack);
  return true;
}

//==================WebView相关Cooike==================//

/**
 * 设置 -- WebView的Src的Cookie值, URL网址
 * @param {*} pWebViewSrcUrl 
 */
function setWebViewSrcCookie(pWebViewSrcUrl) {
  //console.log("pWebViewSrcUrl=" + pWebViewSrcUrl);
  mUtils.setCookie("WebViewSrcCookie", pWebViewSrcUrl);
  return true;
}

/**
 * 得到 --  WebView的Src的Cookie值, URL网址
 */
function getWebViewSrcCookie(pCallBack) {
  mUtils.getCookie("WebViewSrcCookie", pCallBack);
  return true;

}


//==================公共函数相关Cooike==================//

/**
 * 清除所有缓存
 */
function clearAllCookie() {

  this.clearFixNameCookie("OctUserLoginCookie");
  this.clearFixNameCookie("BuyerSelReceiAddrRegionCookie");
  this.clearFixNameCookie("OrderGoodsCookie");
  this.clearFixNameCookie("ScartIDOrderNumArrCookie");
  this.clearFixNameCookie("GoToImSysUrlCookie");
  this.clearFixNameCookie("WebViewSrcCookie");

}

/**
 * 清除指定的Cookie值
 * @param {}} pCookieName 
 */
function clearFixNameCookie(pCookieName) {
  //保存登录信息
  mUtils.setCookie(pCookieName, "");
  mUtils.setCookie(pCookieName, null);
  return true;
}