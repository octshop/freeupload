using HttpServiceNS;
using PublicClassNS;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

/// <summary>
/// 【对接IM在线客服系统】相关业务逻辑
/// </summary>
namespace BusiIMNS
{
    public class BusiIM
    {
        /// <summary>
        /// 构造函数
        /// </summary>
        public BusiIM()
        {

        }

        #region【API方法】

        /// <summary>
        /// 得到商家跳转进入IM客服系统的URL和Key参数信息 Http传递的参数名【KeyEnterMsgRSA】 --API方法
        /// </summary>
        /// <param name="pShopUserID">商家UserID</param>
        /// <param name="pLoginPwdSHA1">商家登录密码 SHA1加密后</param>
        /// <returns></returns>
        public static string buildKeyEnterMsgRSAApi(long pShopUserID, string pLoginPwdSHA1)
        {
            ModelJsonBack _modelJsonBack = new ModelJsonBack();

            //得到商家跳转进入Key参数信息 Http传递的参数名【KeyEnterMsgRSA】
            string _backMsg = buildKeyEnterMsgRSA(pShopUserID, pLoginPwdSHA1);
            if (_backMsg == "BKEMR_02")
            {
                if (WebAppConfig.IMSysIsAbleUse !="false")
                {
                    _modelJsonBack.ErrCode = _backMsg;
                    _modelJsonBack.ErrMsg = "商未开通IM在线客服系统,请联系平台官方";
                }
            }
            else
            {
                _modelJsonBack.Code = "BKEMR_01";
                _modelJsonBack.Msg = "可正常进入IM在线客服系统-商家端";
            }

            //构造进入跳转URL
            _modelJsonBack.DataDic = new Dictionary<string, object>();
            _modelJsonBack.DataDic.Add("GoImSysShopURL", WebAppConfig.ImSystemWebDomainURL + "/EnterThird/ShopEnter?KeyEnterMsgRSA=" + _backMsg);

            return ModelJsonBack.convertModelToJson(_modelJsonBack);
        }

        #endregion

        /// <summary>
        /// 得到商家跳转进入Key参数信息 Http传递的参数名【KeyEnterMsgRSA】
        /// </summary>
        /// <param name="pShopUserID">商家UserID</param>
        /// <param name="pLoginPwdSHA1">商家登录密码 SHA1加密后</param>
        /// <returns></returns>
        public static string buildKeyEnterMsgRSA(long pShopUserID, string pLoginPwdSHA1)
        {
            //IM在线客服系统 == 是否开通了IM在线客服系统 true / false
            if (WebAppConfig.IMSysIsAbleUse == "false")
            {
                return "BKEMR_02"; //未开通了IM在线客服系统
            }

            //跳转到客服系统的Key信息->KeyGuid + "^" + DateTime.Now + "^" + ShopUserID + "^" + LoginPwdSHA1

            //得到商家SHA1加密的 登录密码
            string _ShopEnterKeyMsg = buildKeyEnterMsgShopRSASectionReplace2B(pShopUserID, pLoginPwdSHA1);
            return _ShopEnterKeyMsg;

        }

        /// <summary>
        /// 向IM在线客服系统发送Http请求
        /// </summary>
        /// <param name="pApiUrl">Api请求地址</param>
        /// <param name="pType">操作类型 Type</param>
        /// <param name="pDicPOST">POST参数</param>
        /// <param name="pIsLoginUser">是否 需要第三方商家登录验证 false / true</param>
        /// <param name="timeout">过期时间，以分钟为单位</param>
        /// <returns></returns>
        public static string httpApiImSysPage(string pApiUrl, string pType, IDictionary<string, string> pDicPOST, bool pIsLoginUser = true, int timeout = 1)
        {
            //向POST字典中添加参数值
            pDicPOST.Add("Type", pType);

            //-------根据是否用户登录构造Key信息----------//
            string _KeyEnterMsgRSA = "";
            if (pIsLoginUser == true)
            {
                //得到登录的UserID和登录密码SHA1加密
                string[] _loginCookieArr = OctShopSystemWeb.BusiLogin.getLoginCookieUserIDAndLoginPwdSha1();

                _KeyEnterMsgRSA = buildKeyEnterMsgShopRSASectionReplace2B(Convert.ToInt64(_loginCookieArr[0]), _loginCookieArr[1]);
            }
            else
            {
                _KeyEnterMsgRSA = buildKeyEnterMsgShopRSASectionReplace2B(0, "0");
            }
            pDicPOST.Add("KeyEnterMsgRSA", _KeyEnterMsgRSA);


            //发送Http请求
            string _json = HttpService.Post(pApiUrl, pDicPOST, null, false, timeout);
            return _json;
        }

        #region【-----生成第三方进入 IM客服系统的 KEY 信息-------】

        /// <summary>
        /// 构造商城商家进入IM客服系统的 KeyEnterMsg 信息 已将其中“+” 替换成了“%2B” Http传递的参数名【KeyEnterMsgRSA】
        /// </summary>
        /// <param name="pShopUserID">商家UserID</param>
        /// <param name="pLoginPwdSHA1">商家登录密码 SHA1加密后</param>
        /// <returns></returns>
        public static string buildKeyEnterMsgShopRSASectionReplace2B(long pShopUserID, string pLoginPwdSHA1)
        {
            //跳转到客服系统的Key信息 ->  KeyGuid + "^" + DateTime.Now + "^"  + ShopUserID + "^" + LoginPwdSHA1 
            string _keyEnterMsg = buildKeyEnterMsgShopRSASection(pShopUserID, pLoginPwdSHA1);

            _keyEnterMsg = _keyEnterMsg.Replace("+", "%2B");

            return _keyEnterMsg;
        }

        /// <summary>
        /// 构造商城商家进入IM客服系统的 KeyEnterMsg 信息
        /// </summary>
        /// <param name="pShopUserID">商家UserID</param>
        /// <param name="pLoginPwdSHA1">商家登录密码 SHA1加密后</param>
        /// <returns></returns>
        public static string buildKeyEnterMsgShopRSASection(long pShopUserID, string pLoginPwdSHA1)
        {
            //跳转到客服系统的Key信息 ->  KeyGuid + "^" + DateTime.Now + "^"  + ShopUserID + "^" + LoginPwdSHA1 
            string _keyEnterMsg = buildKeyEnterMsgShop(pShopUserID, pLoginPwdSHA1);

            _keyEnterMsg = EncryptionClassNS.EncryptionClass.RSAEncryptSection("", _keyEnterMsg);

            return _keyEnterMsg;
        }

        /// <summary>
        /// 构造商城商家进入IM客服系统的 KeyEnterMsg 信息
        /// </summary>
        /// <param name="pShopUserID">商家UserID</param>
        /// <param name="pLoginPwdSHA1">商家登录密码 SHA1加密后</param>
        /// <returns></returns>
        public static string buildKeyEnterMsgShop(long pShopUserID, string pLoginPwdSHA1)
        {
            //跳转到客服系统的Key信息 ->  KeyGuid + "^" + DateTime.Now + "^"  + ShopUserID + "^" + LoginPwdSHA1 
            string _keyEnterMsg = WebAppConfig.IMSysKey + "^" + PublicClass.getDateTimeSysCurrent() + "^" + pShopUserID + "^" + pLoginPwdSHA1;

            return _keyEnterMsg;
        }


        #endregion


    }
}