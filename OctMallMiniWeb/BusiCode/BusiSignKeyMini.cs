using PublicClassNS;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

/// <summary>
/// 【验证与构造小程序Http签名】 -- 相关业务逻辑
/// </summary>
namespace BusiSignKeyMiniNS
{
    public class BusiSignKeyMini
    {
        /// <summary>
        /// 构造方法 
        /// </summary>
        public BusiSignKeyMini()
        {

        }

        #region【API方法】

        /// <summary>
        /// 验证小程序的签名 SignKey --公共函数 --API方法
        /// </summary>
        /// <param name="pSignKeyRSA">httpSecretKey + "^" + getNewGuid() + "^" + getSystemTime() 签名的内容RSA加密</param>
        /// <returns> "VSKPA_01"; //签名验证成功 ，其他的错误 直接输出提示信息</returns>
        public static string verifySignKeyPubApi(out string outUserID)
        {
            //获取传递的参数
            string _signKeyRSA = PublicClass.FilterRequestTrimNoConvert("SignKey");

            //验证小程序的签名 SignKey --API方法
            string _jsonBack = verifyMiniSignKeyApi(_signKeyRSA, out outUserID);
            if (_jsonBack.IndexOf("签名验证成功") >= 0)
            {
                return "VSKPA_01"; //签名验证成功
            }
            //直接输出提示信息
            return _jsonBack;
        }

        /// <summary> 
        /// 验证小程序的签名 SignKey --API方法
        /// </summary>
        /// <param name="pSignKeyRSA">httpSecretKey + "^" + getNewGuid() + "^" + getSystemTime() 签名的内容RSA加密</param>
        /// <returns>"VMSK_01" Http请求签名验证成功 "VMSK_04" 微信小程序Http请求的Key不正确 "VMSK_06" 微信小程序Http请求的Key已过期 "VMSK_08" 用户登录验证错误</returns>
        public static string verifyMiniSignKeyApi(string pSignKeyRSA, out string outUserID)
        {
            ModelJsonBack _modelJsonBack = new ModelJsonBack();

            string _backCode = verifyMiniSignKey(pSignKeyRSA, out outUserID);
            if (_backCode == "VMSK_01")
            {
                _modelJsonBack.Code = _backCode;
                _modelJsonBack.Msg = "签名验证成功";
            }
            else if (_backCode == "VMSK_04")
            {
                _modelJsonBack.ErrCode = _backCode;
                _modelJsonBack.ErrMsg = "签名验证错误"; //"Key不正确";
            }
            else if (_backCode == "VMSK_06")
            {
                _modelJsonBack.ErrCode = _backCode;
                _modelJsonBack.ErrMsg = "签名验证错误"; // "Key已过期";
            }
            else if (_backCode == "VMSK_08")
            {
                _modelJsonBack.ErrCode = _backCode;
                _modelJsonBack.ErrMsg = "用户登录验证错误";
            }
            else
            {
                _modelJsonBack.ErrCode = "VMSKA_02";
                _modelJsonBack.ErrMsg = "验签失败";
            }

            return ModelJsonBack.convertModelToJson(_modelJsonBack);
        }

        #endregion

        /// <summary> 
        /// 验证小程序的签名 SignKey
        /// </summary>
        /// <param name="pSignKeyRSA">httpSecretKey + "^" + getNewGuid() + "^" + getSystemTime() + "^" + pUserID + "^" + pLoginPwd 签名的内容RSA加密</param>
        /// <param name="outUserID">输出登录用户UserID</param>
        /// <returns>"VMSK_01" Http请求签名验证成功 "VMSK_04" 微信小程序Http请求的Key不正确 "VMSK_06" 微信小程序Http请求的Key已过期 "VMSK_08" 用户登录验证错误</returns>
        public static string verifyMiniSignKey(string pSignKeyRSA, out string outUserID)
        {
            outUserID = "";

            //4NLkrBn0WEvrsJfTTO+KI8cE2GE97rFzvRyaVc4QzK8ISyVhn6Jm5a8Ubjb+gk1ZNOkF25/cco9Wr/oq2baywgnYc9OhaHV/bXUIfH7ZzLPBK3ivmDEXDzC0DCdpJeFNYPQ/8/NM4sQu2RXsLsEgbpr1i0hwUCz/WHlSNOXpW3g=

            //把%2B 转换成 "+"
            pSignKeyRSA = pSignKeyRSA.Replace("%2B", "+").Replace("＋", "+").Replace("+", "+");
            //解密SignKey ( 65c2dd28-c8bb-4d88-ad6e-82a4d0c752db^74d64e9d-7e9e-085e-1f56-f1317430eac8^2021-02-26 22:32:00^10003321^3d4f2bf07dc1be38b20cd6e46949a1071f9d0e3d )
            string _signKey = EncryptionJSClassNS.EncryptionJSClass.RsaDecryptSection(pSignKeyRSA, '^');

            //正常是93位
            //int _signKeyLength = _signKey.Length;

            //分割SignKey内容 
            string[] _signKeyArr = PublicClassNS.PublicClass.splitStringJoinChar(_signKey);

            if (_signKeyArr.Length != 5)
            {
                return "VMSK_04";  //微信小程序Http请求的Key不正确
            }
            if (_signKeyArr[0].Length != 36 || _signKeyArr[1].Length != 36)
            {
                return "VMSK_04";  //微信小程序Http请求的Key不正确
            }

            //-----判断微信小程序Http请求的Key是否正确-----//
            if (_signKeyArr[0] != WebAppConfig.HttpSecretKeyMini)
            {
                return "VMSK_04";  //微信小程序Http请求的Key不正确
            }

            //-----判断Http请求的Key是否过期-----//
            string _keyOverTimer = Convert.ToDateTime(_signKeyArr[2]).AddSeconds(WebAppConfig.HttpSecretKeyMiniOverTimeSecond).ToString("yyyy-MM-dd HH:mm:ss");

            int _diffOverTimerNum = PublicClass.DateCompare(_keyOverTimer, PublicClass.getDateTimeSysCurrent());
            if (_diffOverTimerNum < 0)
            {
                return "VMSK_06";  //微信小程序Http请求的Key已过期
            }

            //-------判断是否要验证用户登录相关信息---------//
            if (string.IsNullOrWhiteSpace(_signKeyArr[3]) == false && string.IsNullOrWhiteSpace(_signKeyArr[4]) == false)
            {
                // Http请求 - 判断用户登录是否正确
                string _loginBack = httpIsLoginRetrunUserID(_signKeyArr[3], _signKeyArr[4]);
                if (string.IsNullOrWhiteSpace(_loginBack))
                {
                    return "VMSK_08"; //用户登录验证错误
                }

                outUserID = _loginBack;
            }

            return "VMSK_01"; //Http请求签名验证成功
        }



        /// <summary>
        /// Http请求 - 判断用户登录是否正确
        /// </summary>
        /// <param name="pUserID">买家UserID (用户UserID)</param>
        /// <param name="pLoginPwdSHA1">SHA1加密后的 登录密码</param>
        /// <returns></returns>
        public static string httpIsLoginRetrunUserID(string pUserID, string pLoginPwdSHA1)
        {

            //调用接口 判断用户名和登录密码是否正确
            //POST参数
            Dictionary<string, string> _dicPost = new Dictionary<string, string>();
            _dicPost.Add("BuyerUserID", pUserID);

            //发送验证买家登录UserID和登录密码是否正确 登录密码没有SHA1
            string _jsonBack = BusiApiHttpNS.BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_CheckUserAccount, "CheckUserAccount", "1", _dicPost, true, pUserID, pLoginPwdSHA1);
            if (_jsonBack.IndexOf("用户ID登录密码正确") >= 0)
            {
                return pUserID;
            }
            return "";
        }




    }
}