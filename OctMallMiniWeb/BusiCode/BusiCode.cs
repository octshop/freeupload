using PublicClassNS;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

/// <summary>
/// 【公共】相关业务逻辑 
/// </summary>
namespace OctMallMiniWeb
{
    public class BusiCode
    {
        /// <summary>
        /// 构造函数
        /// </summary>
        public BusiCode()
        {

        }

        /// <summary>
        /// 得到 买家分享商品返佣  Cookie信息数组   pGoodsID + "^" + pBuyerUserID;
        /// </summary>
        /// <param name="pKeyEn">//加密后的 商品分享KEY  带 + 的</param>
        /// <returns></returns>
        public static string[] getBuyerShareGoodsCookieArr(string pKeyEn)
        {
            if (string.IsNullOrWhiteSpace(pKeyEn))
            {
                return null;
            }

            pKeyEn = pKeyEn.Replace("%2B", "+").Replace(" ", "+").Replace("＋", "+").Replace("~","=");
            //KeyEn
            pKeyEn = EncryptionClassNS.EncryptionClass.RSADecrypt("", pKeyEn);
            if (pKeyEn.IndexOf("^") <= 0)
            {
                return null;
            }
            string[] _buyerShareGoodsArr = PublicClass.splitStringJoinChar(pKeyEn);
            return _buyerShareGoodsArr;
        }



    }
}