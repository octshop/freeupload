//==============解密 小程序的加密内容============//

//==============引入相关的Js文件========//
var WXBizDataCrypt = require('../utils/cryptojs/RdWXBizDataCrypt.js');

//----初始化APP对象-----
var app = getApp();


//-----暴露接口------//
module.exports = {
  decryptDataContent: decryptDataContent,
}

//==================自定义函数================//

/**
 * 解密 小程序的加密内容
 * @param {*} pEncryptData  加密内容
 * @param {*} pSessionKey 
 * @param {*} pIv 
 */
function decryptDataContent(pEncryptData, pSessionKey, pIv) {
  var appId = app.globalData.WxMiniAppID;
  var sessionKey = pSessionKey; //'tiihtNczf5v6AKRyjwEUhQ=='
  var encryptedData = pEncryptData;

  var pc = new WXBizDataCrypt(appId,sessionKey);
  var data = pc.decryptData(encryptedData , pIv);
  //console.log('解密后 data: ', data);
  return data;

}