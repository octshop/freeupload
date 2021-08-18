using BusiApiHttpNS;
using PublicClassNS;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

/// <summary>
/// 【订单】相关业务逻辑
/// </summary>
namespace OctShopSystemWeb
{
    public class BusiOrder
    {
        /// <summary>
        /// 构造函数
        /// </summary>
        public BusiOrder()
        {

        }

        /// <summary>
        /// http请求 扫码跳转验证 订单状态 -- 待消费/自取
        /// </summary>
        /// <param name="pScanDataEncrypt">扫码加密后的内容</param>
        /// <param name="pShopUserID">商家UserID</param>
        /// <returns></returns>
        public static string httpVerifyScanCheckCodeOrderStatusShop(string pScanDataEncrypt,long pShopUserID)
        {
            string _json = "";

            pScanDataEncrypt = pScanDataEncrypt.Replace("%2B", "+").Replace(" ", "+");
            //解密字符串
           string _ScanDataDecrypt = EncryptionClassNS.EncryptionClass.RSADecryptSection("", pScanDataEncrypt);
            //分割字符串  [ 订单ID ^ 验证类型 ^ 验证码 ^ 买家UserID  (26566 ^ ShopCheck ^ 223366 ^ 1006 ) ]
            string[] _scanDataArr = PublicClass.splitStringJoinChar(_ScanDataDecrypt);

            if (_scanDataArr.Length == 4)
            {
                //---发送验证请求----//
   
                //添加POST参数
                IDictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("ShopUserID", pShopUserID.ToString());
                _dic.Add("OrderID", _scanDataArr[0]);
                _dic.Add("CheckType", _scanDataArr[1]);
                _dic.Add("CheckCode", _scanDataArr[2]);
                _dic.Add("BuyerUserID", _scanDataArr[3]);
                
                //正式发送Http请求
                _json = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_T_OrderCheckCode, "T_OrderCheckCode", "2", _dic);
            }
            else
            {
                _json = "{\"Code\":\"HVSCCOSS_02\",\"Msg\":\"验证数据错误\",\"ErrCode\":null,\"ErrMsg\":null,\"DataDic\":null,\"DataListDic\":null,\"DataDicExtra\":null,\"DataListDicExtra\":null}";
            }
            return _json;
        }

    }
}