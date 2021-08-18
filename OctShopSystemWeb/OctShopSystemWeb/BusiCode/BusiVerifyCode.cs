using BusiApiHttpNS;
using PublicClassNS;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

/// <summary>
/// 【各种验证码信息-验证】相关业务逻辑
/// </summary>
namespace OctShopSystemWeb
{
    public class BusiVerifyCode
    {
        /// <summary>
        /// 构造函数
        /// </summary>
        public BusiVerifyCode()
        {

        }

        /// <summary>
        /// http请求 扫码跳转验证  - 各种验证码信息
        /// </summary>
        /// <param name="pScanDataEncrypt">加密的扫码数据</param>
        /// <param name="pShopUserID">商家UserID</param>
        /// <returns></returns>
        public static string httpVerifyCodeScanData(string pScanDataEncrypt, long pShopUserID)
        {
            string _json = "";

            pScanDataEncrypt = pScanDataEncrypt.Replace("%2B", "+").Replace(" ", "+");
            //解密字符串
            string _ScanDataDecrypt = EncryptionClassNS.EncryptionClass.RSADecryptSection("", pScanDataEncrypt);

            //分割字符串 订单验证信息  [ 额外数据ID ^ 验证类型 ^ 验证码 ^ 买家UserID ^ 商家UserID  (26566 ^ PresentOrder ^ 223366 ^ 1006 ^ 1004 ) ]
            string[] _scanDataArr = PublicClass.splitStringJoinChar(_ScanDataDecrypt);

            if (_scanDataArr.Length == 5)
            {
                //---发送验证请求----//

                //添加POST参数
                IDictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("ShopUserID", pShopUserID.ToString());
                _dic.Add("ExtraData", _scanDataArr[0]);
                _dic.Add("VerifyTypeCode", _scanDataArr[1]);
                _dic.Add("VerifyCode", _scanDataArr[2]);
                _dic.Add("BuyerUserID", _scanDataArr[3]);

                //正式发送Http请求
                _json = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_T_VerifyCodeScanData, "T_VerifyCodeScanData", "1", _dic);
            }
            else
            {
                _json = "{\"Code\":\"HVCSD_02\",\"Msg\":\"验证数据错误\",\"ErrCode\":null,\"ErrMsg\":null,\"DataDic\":null,\"DataListDic\":null,\"DataDicExtra\":null,\"DataListDicExtra\":null}";
            }

            return _json;
        }



    }
}