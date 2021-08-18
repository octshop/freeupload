using BusiRndKeyNS;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

/// <summary>
/// 处理【接口发送Http请求】的相关逻辑
/// </summary>
namespace BusiApiHttpNS
{
    public class BusiApiHttp
    {
        /// <summary>
        /// 构造函数
        /// </summary>
        public BusiApiHttp()
        {

        }

        #region 【OctCommonCodeSystem(各项目通用代码项目)】

        /// <summary>
        /// Api请求用户信息管理
        /// </summary>
        /// <param name="pVerifyType">验证类型</param>
        /// <param name="pType">操作类型</param>
        /// <param name="pDicPOST">发送的POST参数字典</param>
        /// <param name="pIsLogin">是否要登录 [ true / false ] 为true时传加密签名</param>
        /// <param name="pUserID">登录用户UserID</param>
        /// <param name="pLoginPwd">登录密码(没有SHA1加密)</param>
        /// <param name="pExtraDataArr">额外数据，用“|”隔开 [小黄人|28]</param>
        /// <param name="pHeaderParameters">添加Header键值</param>
        /// <param name="isUseCert">是否使用了证书</param>
        /// <param name="timeout">超时时间</param>
        /// <returns></returns>
        public static string httpUserKeyMsg(string pVerifyType, string pType, IDictionary<string, string> pDicPOST, bool pIsLogin = false, string pUserID = "", string pLoginPwd = "", string pExtraDataArr = "", IDictionary<string, string> pHeaderParameters = null, bool isUseCert = false, int timeout = 1)
        {
            //向POST字典中添加参数值
            pDicPOST.Add("Type", pType);

            string _json = "";

            if (pIsLogin == false)
            {
                //正式发送Http请求
                _json = BusiRndKey.httpNoLoginRndKeyRsa(WebAppConfig.ApiUrl_UserKeyMsg, pVerifyType, pDicPOST, pHeaderParameters, isUseCert, timeout);
            }
            else
            {
                //正式发送Http请求
                _json = BusiRndKey.httpLoginSignVal(WebAppConfig.ApiUrl_UserKeyMsg, pVerifyType, pUserID, pLoginPwd, pExtraDataArr, pDicPOST, pHeaderParameters, isUseCert, timeout);
            }

            return _json;
        }

        #endregion


        #region【公共调用函数】

        /// <summary>
        /// 发送Api接口Ajax业务逻辑 Http请求
        /// </summary>
        /// <param name="pApiUrl">Api请求Ajax页面URL</param>
        /// <param name="pVerifyType">验证类型</param>
        /// <param name="pType">操作类型</param>
        /// <param name="pDicPOST">发送的POST参数字典</param>
        /// <param name="pIsLogin">是否要登录 [ true / false ] 为true时传加密签名</param>
        /// <param name="pUserID">登录用户UserID</param>
        /// <param name="pLoginPwd">登录密码(没有SHA1加密)</param>
        /// <param name="pExtraDataArr">额外数据，用“|”隔开 [小黄人|28]</param>
        /// <param name="pHeaderParameters">添加Header键值</param>
        /// <param name="isUseCert">是否使用了证书</param>
        /// <param name="timeout">超时时间</param>
        /// <returns></returns>
        public static string httpApiAjaxPage(string pApiUrl, string pVerifyType, string pType, IDictionary<string, string> pDicPOST, bool pIsLogin = false, string pUserID = "", string pLoginPwd = "", string pExtraDataArr = "", IDictionary<string, string> pHeaderParameters = null, bool isUseCert = false, int timeout = 1)
        {
            //向POST字典中添加参数值
            pDicPOST.Add("Type", pType);

            string _json = "";

            if (pIsLogin == false)
            {
                //正式发送Http请求
                _json = BusiRndKey.httpNoLoginRndKeyRsa(pApiUrl, pVerifyType, pDicPOST, pHeaderParameters, isUseCert, timeout);
            }
            else
            {
                //正式发送Http请求
                _json = BusiRndKey.httpLoginSignVal(pApiUrl, pVerifyType, pUserID, pLoginPwd, pExtraDataArr, pDicPOST, pHeaderParameters, isUseCert, timeout);
            }

            return _json;
        }

        #endregion



    }
}