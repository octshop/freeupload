//====================整个项目的配置参数================//

//--------公共配置变量------------//
var wxconfig = {
  httpDomain: httpDomain,
  TotalPayDomain: "http://192.168.1.220/", //"http://192.168.1.220/",
  appid: "wxbe4b97fa51800f1e7", //制冷百科小程序
  //获取 小程序得到用户的登录信息 openid, unionid, session_key 的API 的URL
  getLoginMsgUrl: "WeiXin/MiniGetLoginMsg",
  //支付请求接口
  JlwxCrtOrderApiURL: "TotalPay/JlwxCrtOrderTestApi",
}

//发送Http的后台域名
function httpDomain(){
  //return "http://test2.hvacr.cn/"; 
  //return "http://localhost:90/"; 
  //return "http://10.1.1.215:90/"; 
  return "http://192.168.1.220/"; 
}



//=============暴露接口和对象==============//
module.exports = wxconfig;