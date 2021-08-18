using PublicClassNS;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

/// <summary>
/// 【网站Cookie】相关业务逻辑
/// </summary>
namespace OctWapWeb
{
    public class BusiWebCookie
    {
        /// <summary>
        /// 构造函数
        /// </summary>
        public BusiWebCookie()
        {

        }

        #region【O2o选择城市区域】

        /// <summary>
        /// 设置用户选择的城市区域代号信息 --Cookie值 - “ 430000_430100 ^ 湖南省_长沙市 ”
        /// </summary>
        /// <param name="pSelCityRegionCodeNameArr"> 城市区域代号信息拼接 “ 430000_430100 ^ 湖南省_长沙市 ”</param>
        /// <returns></returns>
        public static string setSelCityRegionArrCookie(string pSelCityRegionCodeNameArr)
        {
            PublicClass.clearCookieValue("SelCityRegionArrCookie");

            try
            {
                //Base64位编码
                pSelCityRegionCodeNameArr = EncryptionClassNS.EncryptionClass.EncodeBase64("utf-8", pSelCityRegionCodeNameArr);
            }
            catch
            {
                pSelCityRegionCodeNameArr = "";
            }


            //SelCityRegionArrCookie 拼接值 “ 430000_430100 ^ 湖南省_长沙市 ”
            string _cookieVal = PublicClass.setCookieValue("SelCityRegionArrCookie", pSelCityRegionCodeNameArr, 1000);

            return _cookieVal;
        }

        /// <summary>
        /// 清除 用户选择的城市区域代号信息 --Cookie值
        /// </summary>
        /// <returns></returns>
        public static bool clearSelCityRegionArrCookie()
        {
            return PublicClass.clearCookieValue("SelCityRegionArrCookie");
        }

        /// <summary>
        /// 得到 用户选择的城市区域代号信息 --Cookie值 - “ 430000_430100 ^ 湖南省_长沙市 ”
        /// </summary>
        /// <returns></returns>
        public static string getSelCityRegionArrCookie()
        {
            string _cookieVal = PublicClass.getCookieValue("SelCityRegionArrCookie");

            try
            {
                _cookieVal = EncryptionClassNS.EncryptionClass.DecodeBase64("utf-8", _cookieVal);
            }
            catch
            {
                _cookieVal = "";
            };


            return _cookieVal;
        }

        /// <summary>
        /// 得到 用户选择的城市区域代号拼接  - [ 430000_430100 ] - 省_市
        /// </summary>
        /// <returns></returns>
        public static string getSelCityRegionCodeArrCookie()
        {
            string _cookieVal = getSelCityRegionArrCookie();
            if (string.IsNullOrWhiteSpace(_cookieVal))
            {
                return "";
            }
            else
            {
                string _SelCityRegionCodeArr = _cookieVal.Split('^')[0];
                return _SelCityRegionCodeArr;
            }
        }

        /// <summary>
        /// 得到 用户选择的城市区域代号  - [ 430100 ]
        /// </summary>
        /// <returns></returns>
        public static string getSelCityRegionCodeCookie()
        {
            string _cookieVal = getSelCityRegionCodeArrCookie();
            if (string.IsNullOrWhiteSpace(_cookieVal))
            {
                return "";
            }
            string _SelCityRegionCode = _cookieVal.Split('_')[1];
            return _SelCityRegionCode;
        }

        #endregion

        #region【店铺主推荐新注册用户】

        /// <summary>
        /// 设置 店铺主推荐新注册用户 的Cookie 拼接值 【ShopUserIDPromoteBuyerCookie】
        /// </summary>
        /// <param name="pShopUserIDPromoteBuyerCookieVal">Cookie 拼接值 “ ShopUserID ^ ShopID ^ BindMobile”</param>
        /// <returns></returns>
        public static string setShopUserIDPromoteBuyerCookie(string pShopUserIDPromoteBuyerCookieVal)
        {
            PublicClass.clearCookieValue("ShopUserIDPromoteBuyerCookie");
            //ShopUserIDPromoteBuyerCookie 拼接值 “ ShopUserID ^ ShopID ^ BindMobile”
            string _cookieVal = PublicClass.setCookieValue("ShopUserIDPromoteBuyerCookie", pShopUserIDPromoteBuyerCookieVal, 1000);

            return _cookieVal;
        }

        /// <summary>
        /// 清除 店铺主推荐新注册用户 的Cookie 
        /// </summary>
        /// <returns></returns>
        public static bool clearShopUserIDPromoteBuyerCookie()
        {
            PublicClass.clearCookieValue("ShopUserIDPromoteBuyerCookie");
            return true;
        }

        /// <summary>
        /// 得到店铺主推荐新注册用户的Cookie值中 ShopUserID
        /// </summary>
        /// <returns></returns>
        public static long getShopUserIDFromPromoteBuyerCookie()
        {
            ///ShopUserIDPromoteBuyerCookie 拼接值 “ ShopUserID ^ ShopID ^ BindMobile”
            string _cookieVal = PublicClass.getCookieValue("ShopUserIDPromoteBuyerCookie");
            if (string.IsNullOrWhiteSpace(_cookieVal))
            {
                return 0;
            }
            //分割字符串数据
            string[] _cookieValArr = PublicClass.splitStringJoinChar(_cookieVal);
            if (_cookieValArr != null)
            {
                return Convert.ToInt64(_cookieValArr[0]);
            }
            return 0;
        }

        #endregion

        #region【买家分享商品返佣】

        /// <summary>
        /// 设置买家分享商品返佣  Cookie信息 
        /// </summary>
        /// <param name="pKeyEnRSA">加密后的 分享KEY  并且 + 替换成了 %2B </param>
        /// <returns></returns>
        public static bool setBuyerShareGoodsCookie(string pKeyEnRSA)
        {
            //RSA解密码 分享Key  pGoodsID + "^" + pBuyerUserID;
            //string _keyEn = EncryptionClassNS.EncryptionClass.RSADecrypt("",pKeyEnRSA);

            pKeyEnRSA = pKeyEnRSA.Replace("+", "%2B").Replace("＋", "%2B");

            PublicClass.setCookieValue("BuyerShareGoodsCookie", pKeyEnRSA, 30);

            return true;
        }

        /// <summary>
        /// 得到 买家分享商品返佣  Cookie信息数组   pGoodsID + "^" + pBuyerUserID;
        /// </summary>
        /// <returns></returns>
        public static string[] getBuyerShareGoodsCookieArr()
        {
            //分享Key  pGoodsID + "^" + pBuyerUserID;
            string _buyerShareGoodsCookie = PublicClass.getCookieValue("BuyerShareGoodsCookie");

            _buyerShareGoodsCookie = _buyerShareGoodsCookie.Replace("%2B", "+").Replace("＋", "+");

            if (string.IsNullOrWhiteSpace(_buyerShareGoodsCookie))
            {
                return null;
            }

            _buyerShareGoodsCookie = EncryptionClassNS.EncryptionClass.RSADecrypt("", _buyerShareGoodsCookie);

            if (_buyerShareGoodsCookie.IndexOf("^") <= 0)
            {
                return null;
            }

            string[] _buyerShareGoodsCookieArr = PublicClass.splitStringJoinChar(_buyerShareGoodsCookie);

            return _buyerShareGoodsCookieArr;
        }

        #endregion

    }
}