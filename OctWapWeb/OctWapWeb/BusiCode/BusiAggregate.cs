using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

/// <summary>
/// 【聚合扫码支付】业务逻辑
/// </summary>
namespace BusiAggregateNS
{
    public class BusiAggregate
    {
        /// <summary>
        /// 构造函数
        /// </summary>
        public BusiAggregate()
        {

        }

        /// <summary>
        /// 判断浏览器的类型  AliBrowser 支付宝浏览器  WxBrowser 微信浏览器
        /// </summary>
        /// <param name="pUserAgent">Http请求头 使用request获取名为User-Agent的请求头</param>
        /// <returns></returns>
        public static string isBrowserType(string pUserAgent)
        {
            /*
             支付宝的请求头：ucbrowser/1.0.0.100 u3/0.8.0 mobile safari/534.30
 alipaydefined(nt:wifi,ws:360|604|3.0) 
aliapp(ap/9.9.7.112401) 
alipayclient/9.9.7.112401 language/zh-hans usestatusbar/true

            mozilla/5.0 (linux; u; android 10; zh-cn; vce-al00 build/huaweivce-al00) applewebkit/537.36 (khtml, like gecko) version/4.0 chrome/69.0.3497.100 uws/3.21.0.175 mobile safari/537.36 ucbs/3.21.0.175_200831203602 nebulasdk/1.8.100112 nebula alipaydefined(nt:wifi,ws:360|0|3.0) aliapp(ap/10.2.8.7000) alipayclient/10.2.8.7000 language/zh-hans usestatusbar/true isconcavescreen/true region/cn nebulax/1.0.0 ariver/1.0.0


            微信的请求头： mqqbrowser/6.8 tbs/036887 
safari/537.36 micromessenger/6.3.31.940 
nettype/wifi language/zh_cn

            Mozilla/5.0 (Linux; Android 10; VCE-AL00 Build/HUAWEIVCE-AL00; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/77.0.3865.120 MQQBrowser/6.2 TBS/045425 Mobile Safari/537.36 MMWEBID/3630 MicroMessenger/7.0.21.1800(0x27001537) Process/tools WeChat/arm64 Weixin NetType/WIFI Language/zh_CN ABI/arm64


             */

            pUserAgent = pUserAgent.ToLower();

            if (pUserAgent.IndexOf("alipay") >= 0 || pUserAgent.IndexOf("aliapp") >= 0)
            {
                return "AliBrowser"; //支付宝浏览器
            }

            if (pUserAgent.IndexOf("micromessenger") >= 0 || pUserAgent.IndexOf("wechat") >= 0 || pUserAgent.IndexOf("weixin") >= 0)
            {
                return "WxBrowser"; //微信浏览器
            }

            return "";
        }



    }
}