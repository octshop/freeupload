using BusiEnterNS;
using ConfigHelperNS;
using EncryptionClassNS;
using HttpServiceNS;
using PublicClassNS;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Web;

/// <summary>
/// 处理【RndKey】的相关逻辑  具体是保存在RndKeyRsa.config配置文件中
/// </summary>
namespace BusiRndKeyNS
{
    public class BusiRndKey
    {
        //保存RndKeyRsa的有效时间  这里是两个小时
        public static int mRndKeyLifeSecond = 0;//Convert.ToInt32(getAppSettingsValue("RndKeyLifeHour").Trim()) * 60 * 60;

        #region【与RndKey相关的封装】

        /// <summary>
        /// 构造函数
        /// </summary>
        public BusiRndKey()
        {

        }

        /// <summary>
        /// 得到RndKeyRsa  RSA加密后RndKey  并保存在Config文件中
        /// </summary>
        /// <param name="pOneTime">RndKey是否为只使用一次 [true/false]</param>
        /// <returns></returns>
        public static string getRndKeyRsa(string pOneTime = "false")
        {
            //pOneTime = "true";

            //获取保存有效时间的设置
            mRndKeyLifeSecond = Convert.ToInt32(getAppSettingsValue("RndKeyLifeHour").Trim()) * 60 * 60 - 10;

            // 判断保存的RndKeyRsa是否超时
            bool _isTimeOver = isTimeOverRndKeyRsa();
            if (_isTimeOver)
            {
                ////已超时，重新获取RndKeyRsa
                ////通过Http请求获取RSA加密后的RndKey, 一种是两小时有效，别一种只能使用一次
                //string _rndKeyRSA = BusiEnter.httpGetRndKeyRSA(WebAppConfig.ApiUrl_GetRndKeyRSA, WebAppConfig.UserKeyID, WebAppConfig.UserKey, pOneTime);
                ////判断到RndKeyRsa.config配置文件中
                //setAppSettingsValue("RndKeyRsa", _rndKeyRSA);
                ////设置保存时间
                //setAppSettingsValue("CreateDateTime", PublicClass.getDateTimeSysCurrent());
                ////返回新获取的RndKeyRsa
                //return _rndKeyRSA;

                //重新设置只在 RndKeyRsa 值
                return resetRndKeyRsa(pOneTime);
            }
            else //没有超时
            {
                //直接获取配置文件中的RndKeyRsa
                string _appSettingsValue = getAppSettingsValue("RndKeyRsa").Trim();
                if (_appSettingsValue.IndexOf("超时") >= 0 || _appSettingsValue.IndexOf("错误") >= 0 || _appSettingsValue.Length < 40)
                {
                    //重新设置只在 RndKeyRsa 值
                    return resetRndKeyRsa(pOneTime);
                }
                else
                {
                    return _appSettingsValue;
                }
            }
        }

        /// <summary>
        /// 重新设置只在 RndKeyRsa 值 
        /// </summary>
        /// <param name="pOneTime">RndKey是否为只使用一次 [true/false]</param>
        /// <returns></returns>
        public static string resetRndKeyRsa(string pOneTime = "false")
        {
            // 值 不正确，重新获取RndKeyRsa
            //通过Http请求获取RSA加密后的RndKey, 一种是两小时有效，别一种只能使用一次
            string _rndKeyRSA = BusiEnter.httpGetRndKeyRSA(WebAppConfig.ApiUrl_GetRndKeyRSA, WebAppConfig.UserKeyID, WebAppConfig.UserKey, pOneTime);
            //判断到RndKeyRsa.config配置文件中
            setAppSettingsValue("RndKeyRsa", _rndKeyRSA);
            //设置保存时间
            setAppSettingsValue("CreateDateTime", PublicClass.getDateTimeSysCurrent());
            //返回新获取的RndKeyRsa
            return _rndKeyRSA;
        }

        /// <summary>
        /// 得到最新创建的RndKeyRsa RSA加密后RndKey 不保存
        /// </summary>
        /// <param name="pOneTime">RndKey是否为只使用一次 [true/false]</param>
        /// <returns></returns>
        public static string getRndKeyRsaNew(string pOneTime = "false")
        {
            //通过Http请求获取RSA加密后的RndKey, 一种是两小时有效，别一种只能使用一次
            string _rndKeyRSA = BusiEnter.httpGetRndKeyRSA(WebAppConfig.ApiUrl_GetRndKeyRSA, WebAppConfig.UserKeyID, WebAppConfig.UserKey, pOneTime);
            return _rndKeyRSA;
        }

        /// <summary>
        /// 判断保存的RndKeyRsa是否超时
        /// </summary>
        /// <returns>true 已超时</returns>
        public static bool isTimeOverRndKeyRsa()
        {
            //得到RndKeyRsa创建时间
            string _rndkeyRsaTime = getAppSettingsValue("CreateDateTime");
            //判断创建时间是否超时，一般两小时内有效
            string _diffSecond = PublicClass.DateDiffCustomNoAbs(PublicClass.getDateTimeSysCurrent(), _rndkeyRsaTime, "BackSecond");
            //判断是否超时
            if (Convert.ToInt32(_diffSecond) < Convert.ToInt32(mRndKeyLifeSecond))
            {
                return false;
            }
            return true;
        }

        #endregion

        #region 【带RndKey和SignVal值 Http请求封装】

        /// <summary>
        /// 带RndKeyRSA的Http请求 无需进入用户登录验证的操作 
        /// </summary>
        /// <param name="pHttpUrl">API请求的URL [http://192.168.1.220:1200/Test/VerifyApiNoLogin]</param>
        /// <param name="pVerifyType">Http验证类型</param>
        /// <param name="pPostParamDic">额外传递的POST参数</param>
        /// <param name="pHeaderParameters">添加Header键值
        ///var parameters1 = new Dictionary<string, string>();
        ///parameters1.Add("Name", "小黄人");
        ///parameters1.Add("Age", "31");
        ///parameters1.Add("Work", "IT工程师");
        ///获取Header值如下：
        /// string HeaderName = HttpUtility.UrlDecode(Request.Headers["HeaderName"].ToString().Trim());
        /// </param>
        /// <param name="isUseCert">是否使用了证书</param>
        /// <param name="timeout">超时时间</param>
        /// <returns></returns>
        public static string httpNoLoginRndKeyRsa(string pHttpUrl, string pVerifyType, IDictionary<string, string> pPostParamDic, IDictionary<string, string> pHeaderParameters = null, bool isUseCert = false, int timeout = 1)
        {
            //得到RSA加密后的RndKey
            string _rndKeyRSA = getRndKeyRsa();

            //POST参数
            IDictionary<string, string> _dic = new Dictionary<string, string>();
            _dic.Add("RndKeyRSA", _rndKeyRSA);
            _dic.Add("LangType", "C#");
            _dic.Add("VerifyType", pVerifyType);
            //遍历PostParamDic字典
            foreach (KeyValuePair<string, string> item in pPostParamDic)
            {
                //Post添加到Http的POST参数中
                _dic.Add(item.Key, item.Value);
            }

            //发送Http请求
            string _json = HttpService.Post(pHttpUrl, _dic, pHeaderParameters, isUseCert, timeout);
            return _json;
        }

        /// <summary>
        ///  带SignVal的Http请求 需要进入用户登录验证的操作 
        /// </summary>
        /// <param name="pHttpUrl">API请求的URL [http://192.168.1.220:1200/Test/VerifyApiNoLogin]</param>
        /// <param name="pVerifyType">Http验证类型</param>
        /// <param name="pUserID">用户UserID</param>
        /// <param name="pLoginPwd">用户登录密码，没有SHA1加密</param>
        /// <param name="pExtraDataArr">额外数据，用“|”隔开 [小黄人|28]</param>
        /// <param name="pPostParamDic">额外传递的POST参数</param>
        /// <param name="pHeaderParameters">添加Header键值
        ///var parameters1 = new Dictionary<string, string>();
        ///parameters1.Add("Name", "小黄人");
        ///parameters1.Add("Age", "31");
        ///parameters1.Add("Work", "IT工程师");
        ///获取Header值如下：
        /// string HeaderName = HttpUtility.UrlDecode(Request.Headers["HeaderName"].ToString().Trim());
        /// </param>
        /// <param name="isUseCert">是否使用了证书</param>
        /// <param name="timeout">超时时间</param>
        /// <returns></returns>
        public static string httpLoginSignVal(string pHttpUrl, string pVerifyType, string pUserID, string pLoginPwd, string pExtraDataArr, IDictionary<string, string> pPostParamDic, IDictionary<string, string> pHeaderParameters = null, bool isUseCert = false, int timeout = 1)
        {
            //得到RSA加密后的RndKey
            string _rndKeyRSA = getRndKeyRsa();

            //得到签名信息
            //string _SignValRSA = BusiEnter.getSignValRSA(_rndKeyRSA, pUserID, EncryptionClass.GetSHA1(pLoginPwd), pExtraDataArr);
            string _SignValRSA = BusiEnter.getSignValRSA(_rndKeyRSA, pUserID, pLoginPwd, pExtraDataArr);

            //POST参数
            IDictionary<string, string> _dic = new Dictionary<string, string>();
            _dic.Add("SignValRSA", _SignValRSA);
            _dic.Add("LangType", "C#");
            _dic.Add("VerifyType", pVerifyType);
            //遍历PostParamDic字典
            foreach (KeyValuePair<string, string> item in pPostParamDic)
            {
                //Post添加到Http的POST参数中
                _dic.Add(item.Key, item.Value);
            }

            //发送Http请求
            string _json = HttpService.Post(pHttpUrl, _dic, pHeaderParameters, isUseCert, timeout);
            return _json;
        }


        #endregion

        #region 【公共函数】

        //.config配置文件的路径 
        public static string mConfigPath = System.Web.HttpContext.Current.Server.MapPath("~/SysConfig/RndKeyRsa.config");

        /// <summary>
        /// 初始化Configuration配置对象
        /// </summary>
        /// <returns></returns>
        public static Configuration initConfiguration()
        {

            ExeConfigurationFileMap map = new ExeConfigurationFileMap
            {
                ExeConfigFilename = mConfigPath
            };

            Configuration config = ConfigurationManager.OpenMappedExeConfiguration(map, ConfigurationUserLevel.None);
            //返回配置对象
            return config;
        }

        /// <summary>  
        /// 判断【AppSettings】中是否有此项  
        /// <param name="pKey">key值 键值</param>
        /// </summary>  
        public static bool existAppSettingsKey(string pKey)
        {
            //初始化Configuration
            Configuration config = initConfiguration();
            foreach (string str in config.AppSettings.Settings.AllKeys)
            {
                if (str == pKey)
                {
                    return true;
                }
            }
            return false;
        }

        /// <summary>
        /// 获取【AppSettings】中某一节点值
        /// </summary>
        /// <param name="key">key值 键值</param>
        public static string getAppSettingsValue(string key)
        {
            //ExeConfigurationFileMap map = new ExeConfigurationFileMap();
            //map.ExeConfigFilename = mConfigPath;
            //Configuration config = ConfigurationManager.OpenMappedExeConfiguration(map, ConfigurationUserLevel.None);

            //Configuration config = ConfigurationManager.OpenExeConfiguration(ConfigurationUserLevel.None);

            //初始化Configuration配置对象
            Configuration config = initConfiguration();
            if (config.AppSettings.Settings[key] != null)
                return config.AppSettings.Settings[key].Value;
            else

                return string.Empty;
        }

        /// <summary>
        /// 设置【AppSettings】中配置
        /// </summary>
        /// <param name="key">key值 键值</param>
        /// <param name="value">相应值 键对应的值</param>
        public static bool setAppSettingsValue(string key, string value)
        {
            try
            {

                //ExeConfigurationFileMap map = new ExeConfigurationFileMap();
                //map.ExeConfigFilename = mConfigPath;

                //Configuration config = ConfigurationManager.OpenMappedExeConfiguration(map, ConfigurationUserLevel.None);
                //Configuration config = ConfigurationManager.OpenExeConfiguration(ConfigurationUserLevel.None);

                //初始化Configuration配置对象
                Configuration config = initConfiguration();
                if (config.AppSettings.Settings[key] != null)
                    config.AppSettings.Settings[key].Value = value;
                else
                    config.AppSettings.Settings.Add(key, value);
                config.Save(ConfigurationSaveMode.Modified);
                ConfigurationManager.RefreshSection("appSettings");
                return true;
            }
            catch
            {
                return false;
            }


        }

        #endregion




    }
}