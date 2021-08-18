//================加密处理类=======================//
//-------引入相关的Js文件-------//
var RSA = require('wx_rsa.js') //引入Rsa加密
var SHA1 = require('sha1.js') //引入SHA1加密

//------------暴露接口---------//
module.exports = {
  rsaEncrypt: rsaEncrypt, //RSA加密
  rsaEncryptSection: rsaEncryptSection, //RSA加密 分段加密
  rsaDecrypt:rsaDecrypt,//RSA解密
  rsaDecryptSection:rsaDecryptSection, //RSA分段解密
  getSHA1:getSHA1 //SHA1加密内容
}

//-------公共变量-------//

//------初始化APP对象-----//
// var app = getApp();

//--------------自定函数-------------//

//=================================RSA相关函数===============================//

//-----私钥进行解密 1024 bit 位 PKCS#8 --------//
var privateKey = '-----BEGIN PRIVATE KEY-----MIICdwIBADANBgkqhkiG9w0BAQEFAASCAmEwggJdAgEAAoGBAPHoEve4mw7uCn1OO8ZmHpQAk84NOm7tyKtgol59pVEXS84bsva88kC6AjqW+0uRkeM/sstIDrNxxcBAb0iVrXnyw0nIfSiEdr/ghEAbCy2IG9l/dbTDjMveoPdJE6bRt9/8AJRr9s855DLlEkyTyj8i06WgOcuy8w6sacnWSDnxAgMBAAECgYEA0CHv5+mSp9bReZyNO5dzab3RbfDdvMGj7Sf4q7oJOesEUvJsGXTaLiycbFKpJgy6a77Lk7GMzIHwNgh6dwYpOV4LGH+jbAtJekusjJFdtf10kBRKgF4SsbmTb+0217uBM53tQwqSi56pODllUdM7ZGpJecRPCPpvaraPvGLCvV0CQQD8k7cu3I9noxSwxLj2hNmQ6HKa738HCgg4GmoCEOHD7T212mYUa2tPLHt9zBZ6Y/mtKTMpG3wnK75gzjx9PLorAkEA9S9Wsf+rEwpnzWb38NEYtUWsV7BsxK6/zJ7VlqF7LluObvN++oZ0UtzXSREa9ffKbPaInNe1AUckidThL86aUwJBAJFCdvipeoQVA2JCUUndz66KMNcwY/Ltbxqs/kif4uemenYq28hkmvuWzpLjnA3Zj49qAXVjzDxO6ReNpLY2Ba8CQF+ECJchTckGJbgcI/0ZyDFeKiyjG0xn82pIelbLI8zEeDF7BH2egZSCWhAp7MHjvWVDiaboVahgybg0SWGxb+cCQFRJTyuiLMbGwCbsUrga452pLS3/thkpowWjTdWGK8kPyCJ0EcpWiQ25ek/xi/8eEIFTxTAmgS913rTOpetvoVU=-----END PRIVATE KEY-----'
//------公钥进行加密 1024 bit 位 PKCS#8 ------//
var publicKey = '-----BEGIN PUBLIC KEY-----MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDx6BL3uJsO7gp9TjvGZh6UAJPODTpu7cirYKJefaVRF0vOG7L2vPJAugI6lvtLkZHjP7LLSA6zccXAQG9Ila158sNJyH0ohHa/4IRAGwstiBvZf3W0w4zL3qD3SROm0bff/ACUa/bPOeQy5RJMk8o/ItOloDnLsvMOrGnJ1kg58QIDAQAB-----END PUBLIC KEY-----';



//----------RSA加密【分段】加密---------//
/**
 * RSA加密 - 分段加密
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
 * RSA解密 - 分段解密
 * @param {*} pDecryptContent  需要解密的内容
 * @param {*} pJoinChar 
 */
function rsaDecryptSection(pDecryptContent, pJoinChar = "^") {

  var _rSAEnTxtArr = new Array();
  if (pDecryptContent.indexOf("^") >= 0)
  {
    _rSAEnTxtArr = pDecryptContent.split("^");
  }
  else{
    _rSAEnTxtArr[0] = pDecryptContent;
  }

  // 进行分段加密
  for (var i = 0; i < _rSAEnTxtArr.length; i++) {
    // 进行加密RSA
    _rSAEnTxtArr[i] = rsaDecrypt(_rSAEnTxtArr[i]);
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
 * RSA加密内容
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
 * RSA解密内容
 * @param {*} pDecryptContent 
 */
function rsaDecrypt(pDecryptContent){
  var encStr = pDecryptContent;

  var decrypt_rsa = new RSA.RSAKey();
  decrypt_rsa = RSA.KEYUTIL.getKey(privateKey);
  encStr = RSA.b64tohex(encStr);
  //console.log(encStr + "001--100")

  var decStr = decrypt_rsa.decrypt(encStr)
  // console.log("解密结果：" + decStr)

  //输出解密后字符串
  return decStr;
}


//=================================SHA1相关函数===============================//

/**
 * 得么SHA1加密后的内容
 * @param {} pContent 
 */
function getSHA1(pContent){
 
  var _SHA1Content = SHA1.hex_sha1(pContent);
  return _SHA1Content;

}
