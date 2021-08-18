//================ 测试页脚本 ===================//

$(function () {

    var _strContent = "11223344556677889900aab";
    var _splitStrArr = splitStringSection(_strContent, 5);

    for (var i = 0; i < _splitStrArr.length; i++) {
        console.log("数组" + i + "：" + _splitStrArr[i]);
    }

    console.log("用字符串连接数据^：" + joinArrayString(_splitStrArr, "^"));

});


/**
 * 用指定的字符 拼接一个字符串数组
 * 
 * @param pArrayString 字符串数组
 * @param pJoinChar    拼接的字符 [ " |" ]
 * @return
 */
function joinArrayString(pArrayString, pJoinChar) {
    var _backMsg = "";
    for (var i = 0; i < pArrayString.length; i++) {
        _backMsg += pArrayString[i] + pJoinChar;
    }

    // 删除前后的连接字符串
    _backMsg = removeFrontAndBackChar(_backMsg, pJoinChar, 1);

    return _backMsg;
}



/**
 * 如果一个字符串超出了指定的长度，就按指定长度进行分段成数组
 * @param pSectionString 要分段的字符串
 * @param 指定的每段的字符长度
 * @return 数组对象
 */
function splitStringSection(pSectionString, pMaxLength) {

    //创建数组 
    var _arrTxtSection = new Array();

    var _rSAEnTxtLength = pSectionString.length;
    if (_rSAEnTxtLength > pMaxLength) {

        var _float = parseFloat(_rSAEnTxtLength / pMaxLength);

        var _rSAEnTxtArrCount = parseInt(Math.ceil(_float));
        // 定义数组
        _arrTxtSection = new Array(_rSAEnTxtArrCount);
        // 分割加密字符串
        for (var i = 0; i < _rSAEnTxtArrCount; i++) {
            var _lengthLast = pMaxLength * (i + 1);
            // System.out.println("_lengthLast=" + _lengthLast + " |
            // pSectionString.length()=" + pSectionString.length());
            if (_lengthLast >= pSectionString.length) {
                _arrTxtSection[i] = pSectionString.substring(pMaxLength * i);
                // System.out.println("执行了");
            } else {
                _arrTxtSection[i] = pSectionString.substring(pMaxLength * i, pMaxLength * (i + 1));
            }
        }
    } else {
        _arrTxtSection = new Array[1];
        _arrTxtSection[0] = pSectionString;
    }

    return _arrTxtSection;
}


/**
* 删除字符串最前面和最后面指定的字符
* @param pStringChar 字符串值
* @param pRemoveChar 要删除的字符
* @param pCharLength 被去掉的有几个字符
* @return
*/
function removeFrontAndBackChar(pStringChar, pRemoveChar, pCharLength) {
    if (pCharLength == 0) {
        pCharLength = 1;
    }

    pStringChar = pStringChar.toString().trim();
    pRemoveChar = pRemoveChar.toString().trim();

    if (pStringChar == "") {
        return pStringChar;
    }
    if (pStringChar.length < pCharLength) {
        return pStringChar;
    }

    // 除去最前面的“,”和最后的“,”
    if (pStringChar.indexOf("" + pRemoveChar + "") == 0) {
        pStringChar = pStringChar.substring(pCharLength);
    }
    if (pStringChar.lastIndexOf("" + pRemoveChar + "") == pStringChar.length - pCharLength) {
        pStringChar = pStringChar.substring(0, pStringChar.length - pCharLength);
    }

    // 返回替换后的字符串
    return pStringChar;
}

