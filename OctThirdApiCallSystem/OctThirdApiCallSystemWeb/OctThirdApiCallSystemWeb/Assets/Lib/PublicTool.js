//============================公共调用的方法============================//


/**
 * 检测注册日期是否符合yyyy-mm-dd格式和逻辑
 * @param {any} strDate 要检测的日期值
 */
function checkDate(strDate) {
    //日期格式yyyy-mm-dd
    var exp = /\d{4}\-\d{2}\-\d{2}/g;
    if (exp.test(strDate)) {
        var DateArray = strDate.split("-"); //定义数组
        //过滤掉日和月前面的0
        if (DateArray[1].toString().substring(0, 1) == "0") {
            DateArray[1] = DateArray[1].toString().substring(1, 2);
        }
        if (DateArray[2].toString().substring(0, 1) == "0") {
            DateArray[2] = DateArray[2].toString().substring(1, 2);
        }

        var dateElement = new Date(DateArray[0], parseInt(DateArray[1]) - 1, DateArray[2]);

        if (parseInt(dateElement.getFullYear()) < 1911) {
            alert("请输入正确的日期，格式:XXXX-XX-XX 如:2014-05-07!");
            return false;
        }
        //判断日期是否符合逻辑
        if (!((dateElement.getFullYear() == parseInt(DateArray[0])) && ((dateElement.getMonth() + 1) == parseInt(DateArray[1])) && (dateElement.getDate() == parseInt(DateArray[2])))) {
            alert("日期不符合逻辑,格式:XXXX-XX-XX 如:2014-05-07!");
            return false;
        }
    }
    else {
        alert("日期格式不正确,格式:XXXX-XX-XX 如:2014-05-07!");
        return false;
    }
    return true;
}


/**
 * 判断两个日期的大小
 * @param {any} checkStartDate 开始的日期
 * @param {any} checkEndDate 结束的日期
 */
function compareDate(checkStartDate, checkEndDate) {
    var arys1 = new Array();
    var arys2 = new Array();
    if (checkStartDate != null && checkEndDate != null) {
        arys1 = checkStartDate.split('-');
        var sdate = new Date(arys1[0], parseInt(arys1[1] - 1), arys1[2]);
        arys2 = checkEndDate.split('-');
        var edate = new Date(arys2[0], parseInt(arys2[1] - 1), arys2[2]);
        if (sdate > edate) {
            //alert("日期开始时间大于结束时间");
            return false;
        }
        else {
            //alert("日期结束时间大于开始时间");
            return true;
        }
    }
}

/**
 * 计算两个日期间隔的天数 diffDateDay("2019-10-02", "2019-10-05"))
 * @param {any} startDate 开始日期 (小) [2019-10-02]
 * @param {any} endDate 结束日期 (大) [2019-10-05]
 * @returns 返回天数
 */
function diffDateDay(startDate, endDate){
    // let d1 = new Date(faultDate);
    // let d2 = new Date(completeTime);
    var stime = new Date(startDate).getTime();
    var etime = new Date(endDate).getTime();
    var usedTime = etime - stime;  //两个时间戳相差的毫秒数
    var days = Math.floor(usedTime / (24 * 3600 * 1000));
    //计算出小时数
    var leave1 = usedTime % (24 * 3600 * 1000);    //计算天数后剩余的毫秒数
    var hours = Math.floor(leave1 / (3600 * 1000));
    //计算相差分钟数
    var leave2 = leave1 % (3600 * 1000);        //计算小时数后剩余的毫秒数
    var minutes = Math.floor(leave2 / (60 * 1000));
    // var time = days + "天"+hours+"时"+minutes+"分";
    var time = days;
    return time;
}

/**
 * 得到当前的日期时间 格式为:yyyy-mm-dd
 * */
function getTodayDate() {
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


    //var TodayDateTimeStr = yearStr + "-" + monthStr + "-" + dateStr + " " + hourStr + ":" + minutesStr + ":" + secondStr;
    var TodayDateTimeStr = yearStr + "-" + monthStr + "-" + dateStr;

    return TodayDateTimeStr;
}



/**
 * 电子邮件地址判断
 * @param {any} strEmail 邮箱地址
 */
function isEmail(strEmail) {
    if (strEmail.search(/^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/) != -1) {
        return true;
    }
    else {
        return false;
    }
}

/**
 * 验证网址是否合法
 * @param {any} strUrl 网址的URL
 */
function checkURL(strUrl) {
    var urlreg = /^http:|https:\/\/[A-Za-z0-9]+\.[A-Za-z0-9]+[\/=\?%\-&_~`@[\]\':+!]*([^<>\"\"])*$/;
    if (!urlreg.test(strUrl)) {
        return false
    }
    else {
        return true;
    }
}

/**
 * 输入的字符必须是 数字，字母，下划线
 * @param {any} strInput 验证的字符串
 */
function inputCheckChar(strInput) {
    var patrn = /^\w+$/; //用户名只能用，数字，字母，下划线
    if (!patrn.exec(strInput)) {
        return false;
    }
    else {
        return true;
    }
}

/**
 * 验证输入的是否为【手机号码】
 * @param {any} strMobileNumber 验证的手机号
 */
function checkMobileNumber(strMobileNumber) {

    if (!strMobileNumber.match(/^1[3|4|5|7|8][0-9]\d{4,8}$/)) {
        //手机号码格式不正确！请重新输入！
        return false;
    }

    //判断手机号的长度
    if (strMobileNumber.length < 11) {
        //手机号码格式不正确！请重新输入！
        return false;
    }
    return true;
}



/**
 * 验证输入值是否【包含中文】 
 * @param {any} pInputTxt 要验证的输入值
 * @returns 返回 false 没有中文 true 有中文
 */
function checkChineseChar(pInputTxt) {
    var patrn = /[\u4E00-\u9FA5]|[\uFE30-\uFFA0]/gi;
    if (!patrn.exec(pInputTxt)) {
        //alert("没有中文");
        return false;
    }
    else {
        //alert("有中文");
        return true;
    }
}

/**
 * 验证输入值是否 【同时包含字母和数字】
 * @param {any} pInputTxt 要验证的输入值
 * @returns 返回 false 没有同时包含字母和数字  true 同时包含字母和数字
 */
function checkLetterAndNumber(pInputTxt) {
    var reg = new RegExp(/[A-Za-z].*[0-9]|[0-9].*[A-Za-z]/);
    if (reg.test(pInputTxt)) {

        //alert("同时包含字母和数字");
        return true;
    } else {

        //alert("没有同时包含字母和数字");
        return false;
    }
}


/**
 * 用新的字符 替换 掉指定的字符
 * @param {any} InputValue 输入值
 * @param {any} OldStr 被替换的字符串
 * @param {any} NewsStr 新的字符串
 */
function strReplace(InputValue, OldStr, NewsStr) {
    var _OldStr = $.trim(OldStr);
    var _NewsStr = $.trim(NewsStr);

    var strInputValue = InputValue.replace(_OldStr, _NewsStr);
    //去掉指定字符
    while (strInputValue.indexOf(_OldStr) >= 0) {
        strInputValue = strInputValue.replace(_OldStr, _NewsStr);
    }
    return strInputValue;
}

/**
 * 判断是否有特殊字符串
 * @param {any} strInputString 输入字符串
 */
function checkInputSpecial(strInputString) {
    var strFilterString = "'_\"_;_+_&_(_)_:_%_--_*_\\_~_^_<_>_|_!";
    var strFilterStringArr = strFilterString.split("_");
    for (i = 0; i < strFilterStringArr.length; i++) {

        //alert(strFilterStringArr.length);
        //alert(InputTxt.Trim().indexOf(strFilterStringArr[i]));
        //alert(strFilterStringArr[i]);
        var _strInputString = $.trim(strInputString);
        if (_strInputString.indexOf(strFilterStringArr[i]) >= 0) {
            //有特殊字符
            return true;
        }
    }
    //没有特殊字符
    return false;
}


/**
 * 得到当前的日期时间 格式为:yyyy-mm-dd hh:mm:ss
 * */
function getTodayDateTime() {
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
 * 等比列缩放图片 
 * @param {any} ImgD imgD 是图片标签的ID号
 * @param {any} FitWidth  允许的最大宽度
 * @param {any} FitHeight 允许的最大高度
 * @example 调用方法： <img alt="" id="img1" src="http://www.ex8.cn/uploadfile/UploadFile/20077111083773.jpg" onload="DrawImage(img1,200,200)" />
 */
function scaleDrawImage(ImgD, FitWidth, FitHeight) {
    var image = new Image();
    image.src = ImgD.src;
    if (image.width > 0 && image.height > 0) {
        if (image.width / image.height >= FitWidth / FitHeight) {
            if (image.width > FitWidth) {
                ImgD.width = FitWidth;
                ImgD.height = (image.height * FitWidth) / image.width;
            }
            else {
                ImgD.width = image.width;
                ImgD.height = image.height;
            }
        }
        else {
            if (image.height > FitHeight) {
                ImgD.height = FitHeight;
                ImgD.width = (image.width * FitHeight) / image.height;
            }
            else {
                ImgD.width = image.width;
                ImgD.height = image.height;
            }
        }
    }
}

/**
 * 判断是通过手机访问还是电脑访问的
 * @returns 返回值：mobile ， computer
 * */
function isVisiteByMobile() {
    var ua = navigator.userAgent;
    var ipad = ua.match(/(iPad).*OS\s([\d_]+)/),
        isIphone = !ipad && ua.match(/(iPhone\sOS)\s([\d_]+)/),
        isAndroid = ua.match(/(Android)\s+([\d.]+)/),
        isMobile = isIphone || isAndroid;
    if (isMobile) {
        //location.href = 'http://m.domain.com';
        //alert("通过【手机】访问的");
        return "mobile";
    } else {
        //location.href = 'http://www.domain.com';
        //alert("通过【电脑】访问的");
        return "computer";
    }

    //或者单独判断iphone或android 
    if (isIphone) {
        //code 
    }
    else if (isAndroid) {
        //code
    } else {
        //code
    }
}

/**
 * 将两个对象拼接在一起 如：var object1 = {"UserID":"huang"}; var object2={"Pwd":"1111"}  --> {"UserID":"huang","Pwd":"1111"}
 * @param {any} object 被拼接的object对象
 * @param {any} objectAdd 要添加进去的object对象
 * @returns  返回值:返回拼接后的Object
 */
function pushTwoObject(object, objectAdd) {
    var data = object
    data.push = function (o) {
        //如果o是object  
        if (typeof (o) == 'object') for (var p in o) this[p] = o[p];
    };

    var data1 = objectAdd;

    data.push(data1)

    //alert(data.UserID + "|" + data1.Pwd);
    return data;
}

/**
 * 获取URL传递过来的参数
 * @param {any} pParaName URL地址中参数的名称
 */
function getCurrentUrlParam(pParaName) {
    var reg = new RegExp("(^|&)" + pParaName + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    //if (r != null) return unescape(r[2]); return null;
    if (r != null) return unescape(r[2]); return null;
}

/**
 * 去掉前后的指定字符 如“|”
 * @param {any} pStringChar 字符串数组
 * @param {any} pRemoveChar 要移除的字符
 */
function removeFrontAndBackChar(pStringChar, pRemoveChar) {

    //console.log("前：pStringChar=" + pStringChar + " ___ pRemoveChar=" + pRemoveChar);

    var _processChar = pStringChar;

    //移除最后一个指定字符 
    if (pStringChar.lastIndexOf(pRemoveChar) == pStringChar.length - 1) {
        _processChar = pStringChar.substring(0, pStringChar.lastIndexOf(pRemoveChar));
    }
    //移除前面一个指定字符
    if (pStringChar.indexOf(pRemoveChar) == 0) {
        _processChar = _processChar.substring(1);
    }

    //console.log("后：_processChar=" + _processChar);

    //返回处理后的字符串
    return _processChar;
}

/**
 * 格式化 小数点位数，后面的四舍五入
 * @param {any} pFormatNumber 要格式化的数字
 * @param {any} pDotDigitNum 保留几位小数
 */
function formatNumberDotDigit(pFormatNumber, pDotDigitNum) {

    var s = pFormatNumber
    var n = pDotDigitNum

    n = n > 0 && n <= 20 ? n : 2;
    s = parseFloat((s + "").replace(/[^\d\.-]/g, "")).toFixed(n) + "";
    var l = s.split(".")[0].split("").reverse(),
        r = s.split(".")[1];
    t = "";
    for (i = 0; i < l.length; i++) {
        t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "" : "");
    }
    return t.split("").reverse().join("") + "." + r;
}
