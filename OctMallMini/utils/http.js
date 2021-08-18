//var wxConfig = require('../config/wxconfig.js') //引入配置文件
var mUtils = require('../utils/util.js');
var RSA = require('wx_rsa.js') //引入Rsa加密

//初始化APP对象
var app = getApp();

/**
 * --------http工具类和加密类---------
 */

var httpDomain = app.globalData.apiWebDoamin; //小程序Api的网站域名
var httpSecretKey = app.globalData.httpSecretKey; //发送http请求的密钥


//-----暴露接口------//
module.exports = {
  postHttp: postHttp,
  rsaEncrypt: rsaEncrypt,
  rsaEncryptSection: rsaEncryptSection,
  getHttp: getHttp,
  signKeyRsa: signKeyRsa,
  getNewGuid: getNewGuid,
}


/**
 * -------GET  http获取服务数据-------
 * @param pUrl 路径 [Ajax/SubmitLandMsg]
 */
function getHttp(pUrl, pData, callback) {

  //构造的Http的URL
  var _httpUrl = pUrl;

  wx.request({
    url: _httpUrl,
    method: 'GET',
    header: {
      'content-type': 'application/json'
    },
    data: pData,
    success: function (res) {
      callback(res.data);
    },
    fail: function (error) {
      console.log(error);
    }
  })
}

/**
 * --------POST  http获取服务数据-------
 * @param pUrl 路径 [Ajax/SubmitLandMsg]
 */
function postHttp(pUrl, pData, callback) {

  //构造的Http的URL
  var _httpUrl = pUrl;

  mUtils.logOut("POST的URL" + _httpUrl);
  mUtils.logOut("POST的参数" + JSON.stringify(pData));


  wx.request({
    url: _httpUrl,
    method: 'POST',
    header: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    data: pData,
    success: function (res) {

      mUtils.logOut("POST返回=" + JSON.stringify(res.data));

      callback(res.data);
    },
    fail: function (error) {
      console.log(error);
    }
  })
}


//------------------------------- RSA 公钥进行加密----------------------------//
var publicKey = '-----BEGIN PUBLIC KEY-----MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDlMQlg3izT88cFjAag25euW0s0Fiwz2NSkXb+rqcuIzWs1BncTVvsEZ3fN/MwsPPacV5kzfS/uUyOzod0oq+ykN8vZkc1/lG34EjGrt9gru4RoQPFqxR+pR2AUMaMJPmP3qM4w0joWWemb+7aOyZqKU6Pw+W7AP1DmAOBjuRwZGQIDAQAB-----END PUBLIC KEY-----'




//----------RSA加密【分段】加密---------//
/**
 * RSA加密分段加密
 * @param {*} pEncryptContent 
 * @param {*} pJoinChar 
 */
function rsaEncryptSection(pEncryptContent, pJoinChar = "^") {

  var _rSAEnTxtArr = splitStringSection(pEncryptContent, 110);

  // 进行分段加密
  for (var i = 0; i < _rSAEnTxtArr.length; i++) {
    // 进行加密RSA
    _rSAEnTxtArr[i] = rsaEncrypt(_rSAEnTxtArr[i]);
  }

  //return string.Join(pJoinChar.ToString(), _rSAEnTxtArr);
  return _rSAEnTxtArr.join(pJoinChar);
}

/**
 * 如果一个字符串超出了指定的长度，就按指定长度进行分段成数组
 * @param {*} pSectionString 
 * @param {*} pMaxLength 
 */
function splitStringSection(pSectionString, pMaxLength) {
  var _arrTxtSection = null;

  var _rSAEnTxtLength = pSectionString.length;
  if (_rSAEnTxtLength > pMaxLength) {

    var _float = parseFloat(_rSAEnTxtLength) / pMaxLength;

    var _rSAEnTxtArrCount = Math.ceil(_float); //(int)Math.Ceiling(_float);
    // 定义数组
    _arrTxtSection = new Array(_rSAEnTxtArrCount); //new string[_rSAEnTxtArrCount];
    // 分割加密字符串
    for (var i = 0; i < _rSAEnTxtArrCount; i++) {
      var _lengthLast = pMaxLength * (i + 1);
      // System.out.println("_lengthLast=" + _lengthLast + " |
      // pSectionString.length()=" + pSectionString.length());
      if (_lengthLast >= pSectionString.length) {
        var _start = pMaxLength * i;
        _arrTxtSection[i] = pSectionString.substring(_start);
        // System.out.println("执行了");
      } else {
        var _start = pMaxLength * i;
        var _length = pMaxLength;

        _arrTxtSection[i] = pSectionString.substring(_start, _length);
      }
    }
  } else {
    _arrTxtSection = new Array(1);
    _arrTxtSection[0] = pSectionString;
  }

  return _arrTxtSection;
}

//----------RSA加密---------//
/**
 * @param pEncryptContent  需要加密内容
 */
function rsaEncrypt(pEncryptContent) {

  var input_rsa = pEncryptContent;
  var encrypt_rsa = new RSA.RSAKey();
  encrypt_rsa = RSA.KEYUTIL.getKey(publicKey);
  //console.log('加密RSA:')
  //console.log(encrypt_rsa)

  var encStr = encrypt_rsa.encrypt(input_rsa)
  encStr = RSA.hex2b64(encStr);
  //console.log("加密结果：" + encStr)

  //输出加密后字符串
  return encStr;
}


/**
 * --------------得到Http请求的签名---------------
 * @param pUserID 登录用户UserID
 * @param pLoginPwd 登录密码 没有SHA1加密的
 */
function signKeyRsa(pUserID = "", pLoginPwd = "") {

  //console.log("pUserID=" + pUserID + " | pLoginPwd=" + pLoginPwd);

  if (pUserID == undefined) {
    pUserID = "";
  }
  if (pLoginPwd == undefined) {
    pLoginPwd = "";
  }

  return rsaEncryptSection(httpSecretKey + "^" + getNewGuid() + "^" + getSystemTime() + "^" + pUserID + "^" + pLoginPwd);

}

/**
 * ------------得到当前系统时间------------------
 */
function getSystemTime() {
  var dateTimeStr = new Date();
  var yearStr = dateTimeStr.getFullYear();
  var monthStr = dateTimeStr.getMonth() + 1;
  var dateStr = dateTimeStr.getDate();

  var hourStr = dateTimeStr.getHours();
  var minutesStr = dateTimeStr.getMinutes();
  var secondStr = dateTimeStr.getSeconds();

  //如果只有一位数就在前面加个"0"
  if (monthStr.toString().length <= 1) {
    monthStr = "0" + monthStr.toString();
  }
  if (dateStr.toString().length <= 1) {
    dateStr = "0" + dateStr.toString();
  }

  if (hourStr.toString().length <= 1) {
    hourStr = "0" + hourStr.toString();
  }
  if (minutesStr.toString().length <= 1) {
    minutesStr = "0" + minutesStr.toString();
  }
  if (secondStr.toString().length <= 1) {
    secondStr = "0" + secondStr.toString();
  }

  var TodayDateTimeStr = yearStr + "-" + monthStr + "-" + dateStr + " " + hourStr + ":" + minutesStr + ":" + secondStr;

  return TodayDateTimeStr;
}


/**
 * -----得到GUID-----
 * @example  ade24d16-db0f-40af-8794-1e08e2040df3
 */
function getNewGuid() {
  var newGuid_1 = NewGUID(8, 16);
  var newGuid_2 = NewGUID(4, 16);
  var newGuid_3 = NewGUID(4, 16);
  var newGuid_4 = NewGUID(4, 16);
  var newGuid_5 = NewGUID(12, 16);
  //构造GUID
  var newGuid = newGuid_1 + "-" + newGuid_2 + "-" + newGuid_3 + "-" + newGuid_4 + "-" + newGuid_5;

  return newGuid.toLowerCase();
}

/**
 * ------生成GUID-------
 * @example 
 * // 8 character ID (base=2)
uuid(8, 2)  //  "01001010"
// 8 character ID (base=10)
uuid(8, 10) // "47473046"
// 8 character ID (base=16)
uuid(8, 16) // "098F4D35"
 */
function NewGUID(len, radix) {
  var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
  var uuid = [],
    i;
  radix = radix || chars.length;

  if (len) {
    // Compact form
    for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix];
  } else {
    // rfc4122, version 4 form
    var r;

    // rfc4122 requires these characters
    uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
    uuid[14] = '4';

    // Fill in random data.  At i==19 set the high bits of clock sequence as
    // per rfc4122, sec. 4.1.5
    for (i = 0; i < 36; i++) {
      if (!uuid[i]) {
        r = 0 | Math.random() * 16;
        uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
      }
    }
  }

  return uuid.join('');
}