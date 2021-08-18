//=========================公共函数-相关逻辑====================//
//-------引入相关的Js文件-------//
var mHttp = require('../utils/http.js');
var mUtils = require('../utils/util.js');
var mBusiLogin = require('../busicode/busilogin.js');

//------------暴露接口---------//
module.exports = {
  //--------------相关逻辑函数--------------//
  addBuyerFocusFav: addBuyerFocusFav, //买家关注店铺
  addToSCartNoSpecPropID:addToSCartNoSpecPropID, //快捷加入购物车，不需要带规格属性ID
  getGoodsPriceDiscount:getGoodsPriceDiscount,//得到 最终打折后的 商品价格
}

//-------公共变量-------//

//------初始化APP对象-----//
var app = getApp();

//--------------自定函数-------------//

/**
   * 快捷加入购物车，不需要带规格属性ID
   * @param pGoodsID
   * @param pNoLoginBackURL 没有登录的跳转页，需要带参数的必须带
   */
  function addToSCartNoSpecPropID (pGoodsID,pNoLoginBackURL = "") {

    //判断买家是否登录 
    mBusiLogin.isLoginUserNavigate(res => {

      if (res == "") {
        return;
      }

      //获取用户登录信息 --异步函数
      mBusiLogin.getLoginCookieAsyn(res => {

        //构造POST参数
        var _dataPOST = {
          "SignKey": mHttp.signKeyRsa(res.UserID, res.LoginPwdSha1),
          "Type": "2",
          "GoodsID": pGoodsID,
        };

        //正式发送Http请求
        mHttp.postHttp(app.apiURLData.shopApi_GoodsAll, _dataPOST, _jsonReTxt => {
          console.log(_jsonReTxt);

          //错误提示
          if (_jsonReTxt.ErrMsg != "" && _jsonReTxt.ErrMsg != null && _jsonReTxt.ErrMsg != undefined) {
            if (_jsonReTxt.ErrMsg.indexOf("购物车失败") >= 0) {
              _jsonReTxt.ErrMsg = "已加入购物车";
            }
            mUtils.showToast(_jsonReTxt.ErrMsg,1500,false);
            return;
          }
          //成功提示
          if (_jsonReTxt.Msg != "" && _jsonReTxt.Msg != null && _jsonReTxt.Msg != undefined) {
            mUtils.showToast(_jsonReTxt.Msg,1500,false);
            return;
          }


        });

      });

    }, false, "", pNoLoginBackURL);


  }

/**
 * 买家关注店铺
 * @param {*} pShopID 店铺ID
 * @param pNoLoginBackURL 返回的URL
 */
function addBuyerFocusFav(pShopID, pNoLoginBackURL = "") {
  //console.log("pNoLoginBackURL=" + pNoLoginBackURL);
  //判断买家是否登录 
  mBusiLogin.isLoginUserNavigate(res => {

    if (res == "")
    {
      return;
    }

    //获取用户登录信息 --异步函数
    mBusiLogin.getLoginCookieAsyn(res => {

      //构造POST参数
      var _dataPOST = {
        "SignKey": mHttp.signKeyRsa(res.UserID, res.LoginPwdSha1),
        "Type": "1",
        "FocusFavType": "shop",
        "ShopID": pShopID,
      };

      //正式发送Http请求
      mHttp.postHttp(app.apiURLData.buyerApi_BuyerFocusFav, _dataPOST, _jsonReTxt => {
        console.log(_jsonReTxt);
        if (_jsonReTxt.ErrMsg != "" && _jsonReTxt.ErrMsg != undefined && _jsonReTxt.ErrMsg != null) {
          mUtils.showToast(_jsonReTxt.ErrMsg,1500,false);
          return;
        }
        if (_jsonReTxt.Msg != "" && _jsonReTxt.Msg != undefined && _jsonReTxt.Msg != null) {
          mUtils.showToast(_jsonReTxt.Msg,1500,false);
          return;
        }

      });

    });



  }, false, "", pNoLoginBackURL);


}

/**
 * 得到 最终打折后的 商品价格
 * @param {*} pFinalDiscount 最终的折扣值 如： 9.5折  
 * @param {*} pGoodsPriceNoDiscount 原始商品价格
 */
function getGoodsPriceDiscount(pFinalDiscount,pGoodsPriceNoDiscount){

  if (pGoodsPriceNoDiscount <= 0)
  {
    return 0;
  }

  var _goodsPrice = 0;
  if (pFinalDiscount <= 0 || pFinalDiscount > 10)
  {
    return pGoodsPriceNoDiscount;
  }

  _goodsPrice = pGoodsPriceNoDiscount * (pFinalDiscount / 10);

  return mUtils.formatNumberDotDigit(_goodsPrice);
}