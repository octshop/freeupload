using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using PublicClassNS;
using SendHttpRequestNS;
using System;
using System.Xml;

/// <summary>
/// GetAccessTokenMsg 的摘要说明
/// -------------------处理获取和保存微信的AccessToken值----------------------
/// </summary>
/// 
namespace GetAccessTokenMsgNS
{
    public class GetAccessTokenMsg
    {
        //--------------------------公共配置参数-------------------------
        //微信的appID 第三方用户唯一凭证 AppID(小程序ID)
        public static string strAppID = WebAppConfig.WxMiniAppID;
        // OHOConfig.strAppSecret; //"ce7d18c31d39f4dbcaadbf594fc477ac";
        public static string strAppSecret = WebAppConfig.WxMiniAppSecret;
        //保存微信AccessToken的Xml文件路径
        public static string strAccessTokenXmlPath = System.Web.HttpContext.Current.Server.MapPath("~/Assets/Data/SaveAccessTokenMsg.xml");


        public GetAccessTokenMsg()
        {
            //
            // TODO: 在此处添加构造函数逻辑
            //
        }


        /// <summary>
        /// ---------指定时间间隔从微信服务器上获取AccessToken值(2小时后AccessToken会失效) 没超时则直接从XML文件中读取值--------------
        /// </summary>
        /// <returns>返回获取到的微信AccessToken值</returns>
        public static string getWeiXinAccessTokenOrderByTime()
        {
            //从Xml文件中读取上次存储AccessToken值的时间
            string strPreGetAccessTokenTime = ReadXmlData(strAccessTokenXmlPath, "GetTokenDate");
            //计算上次保存的AccessToken时间距现在多久了，不能超过2小时的
            string strDateDiffMinutes = PublicClass.DateDiffMinutes(strPreGetAccessTokenTime, DateTime.Now.ToString());

            //如果大于指定的时间间隔则重新从微信服务器上获取AccessToken值  以分钟为单位计数 110分钟
            if (Math.Round(Convert.ToDouble(strDateDiffMinutes)) > 110)
            {
                //从微信服务器得到AccessToken 
                string strWeiXinAccessToken = getAccessTokenFromWeiXin();
                //将得到的微信AccessToken值保存到Xml文件中
                saveWeiXinAccessTokenToXml(strAccessTokenXmlPath, strWeiXinAccessToken);

                //showDateTimeAccessToken.InnerHtml = "超过时间间隔重新从微信服务器获取AccessToken并保存！ AccessToken=" + strWeiXinAccessToken;
                return strWeiXinAccessToken;
            }
            else //没有超过时间间隔直接从Xml文件中读取AccessToken
            {
                string strXmlTokenValue = ReadXmlData(strAccessTokenXmlPath, "TokenValue");

                //showDateTimeAccessToken.InnerHtml = "没有超过时间间隔直接从Xml文件中读取AccessToken！ AccessToken=" + strXmlTokenValue;
                return strXmlTokenValue;

            }
        }



        /// <summary>
        /// -----------将得到的微信AccessToken值保存到Xml文件中----------------------
        /// </summary>
        /// <param name="strXmlFilePath">保存的XML文件路径</param>
        /// <param name="strWeiXinAccessToken">得到的AccessToken值</param>
        public static void saveWeiXinAccessTokenToXml(string strXmlFilePath, string strWeiXinAccessToken)
        {
            if (strWeiXinAccessToken != "")
            {
                //初始化一个xml实例
                XmlDocument xml = new XmlDocument();
                //导入指定xml文件
                xml.Load(strXmlFilePath);

                //指定一个节点
                XmlNode root = xml.SelectSingleNode("AccessToken");
                //移除所有的子级标签
                root.RemoveAll();

                //重新添加新的了级标签
                //生成一个TokenValue新节点
                XmlElement nodeTokenValue = xml.CreateElement("TokenValue");
                //赋值
                nodeTokenValue.InnerText = strWeiXinAccessToken;
                //将节点加到指定节点下，作为其子节点
                root.AppendChild(nodeTokenValue);

                //生成一个新节点
                XmlElement nodeGetTokenDate = xml.CreateElement("GetTokenDate");
                //赋值
                nodeGetTokenDate.InnerText = DateTime.Now.ToString();
                //将节点加到指定节点下，作为其子节点
                root.AppendChild(nodeGetTokenDate);

                //保存XML
                xml.Save(strXmlFilePath);
            }
        }


        /// <summary>
        /// -----------------------从微信服务器得到AccessToke --------------------------
        /// 获取AccessToke 需要在公众号上设置【IP白名单】 步骤如下 
        /// 登录公众平台，开发->基本配置->IP白名单->查看->修改->将ip地址添加进去即可
        /// </summary>
        public static string getAccessTokenFromWeiXin()
        {
            //appID 第三方用户唯一凭证
            //string strAppID = "wxeb4f0fe63cb42fe8";
            //第三方用户唯一凭证密钥，即appsecret
            //string strAppSecret = "ce7d18c31d39f4dbcaadbf594fc477ac";

            string strHttpGetTokenUrl = "https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=" + strAppID + "&secret=" + strAppSecret + "";

            //以GET方式发送Https请求 获取accessToken值
            string strTokenJSON = SendHttpRequest.SendHttpRequestTypeGET_BackData(strHttpGetTokenUrl, null, null, null);
            //返回值如：{"access_token":"aVN4L_785RMpA46f66hiQ1Tyht-TOu6t-twcp2yYpOwu5dK7MzDgkoNDL99PhW7GEiUEgzFRjxp2Hvc__C3yF1zB1R8rhRQbWfWznJ9qOvc","expires_in":7200}
            //获取值写入日志
            WriteLogNs.LogClass.WriteLogFile("通过Https获取AccessToken=" + strTokenJSON);

            //解析JSON数据
            string strJsonValue = getJsonValue(strTokenJSON, "access_token");

            return strJsonValue;
        }

        /// <summary>
        /// -----------------------------解析JSON数据-字段对象名称-----------------------
        /// </summary>
        /// <param name="JsonValue">Json数据字符串</param>
        /// <param name="JsonFieldValue">需要读取的字段对象名称</param>
        /// <returns></returns>
        public static string getJsonValue(string JsonValue, string JsonFieldValue)
        {
            //创建JavaScriptObject对象
            //{"access_token":"aVN4L_785RMpA46f66hiQ1Tyht-TOu6t-twcp2yYpOwu5dK7MzDgkoNDL99PhW7GEiUEgzFRjxp2Hvc__C3yF1zB1R8rhRQbWfWznJ9qOvc","expires_in":7200}
            JObject jObject = JsonConvert.DeserializeObject(JsonValue) as JObject;

            //JavaScriptObject jObject = JavaScriptConvert.DeserializeObject(JsonValue) as JavaScriptObject;
            return jObject["" + JsonFieldValue + ""].ToString();
        }



        /// <summary>
        /// ----------------------读取XML文件中指定的节点值-------------------------
        /// </summary>
        /// <param name="strXmlFilePath">XML文件的值</param>
        /// <param name="XmlNodeName">节点名称</param>
        /// <returns></returns>
        public static String ReadXmlData(String strXmlFilePath, String XmlNodeName)
        {
            //初始化一个xml实例
            XmlDocument xml = new XmlDocument();
            //导入指定xml文件
            xml.Load(strXmlFilePath);

            //指定一个节点
            XmlNode root = xml.SelectSingleNode("AccessToken");

            XmlNode root_child = root.SelectSingleNode(XmlNodeName);

            //返回指定节点InnerText值
            return root_child.InnerText;
        }

    }

}