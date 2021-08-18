/**
 * -------暴露接口---------
 */
module.exports = {
  formatTime: formatTime, //格式化日期时间 如( 2018-09-01 12:32:18 )
  navigateToURL: navigateToURL, //跳转到页面，不能是Tab页
  redirectToURL: redirectToURL, //跳转到页面，不能返回上一个页
  switchTabURL: switchTabURL, //跳转到Tab导航页，不能是其他页
  alertWin: alertWin, //弹出提示框
  showLoadingWin: showLoadingWin, //显示加载提示
  hideLoadingWin: hideLoadingWin, //隐藏加载提示
  showToast: showToast, //显示Toast提示
  showToastNoMaskShort: showToastNoMaskShort, //显示Toast提示 没有遮罩，时间短 1500
  showToastSu: showToastSu, //显示操作成功提示
  showToastCb: showToastCb, //显示Toast提示,带返回函数
  confirmWin: confirmWin, //确认提示框
  defineSetTimeOut: defineSetTimeOut, //定义执行一次函数
  setCookie: setCookie, //存储Cookie数据
  getCookie: getCookie, //得到Cookie数据
  makePhoneCall: makePhoneCall, //拨打电话
  openMiniMap: openMiniMap, //直接打开微信内置地图插件
  getMiniLocation: getMiniLocation, //得到当前微信小程序用户的坐标 经纬度
  previewImg: previewImg, //显示图片预览组件
  strReplace: strReplace, //用新的字符 替换 掉指定的字符
  formatBackURLParamChar: formatBackURLParamChar, //格式化，回跳的URL字符串，把 ^ 换成 ?  把 ~ 换成 = 把 & 换成 |
  checkMobileNumber: checkMobileNumber, //验证输入的是否为【手机号码】
  maskMobileNumber: maskMobileNumber, // 遮罩手机号，中间四位显示为****
  formatNumberDotDigit: formatNumberDotDigit, //格式化 小数点位数，后面的四舍五入
  splitStringJoinChar: splitStringJoinChar, //分割拼接字符串为数组
  getNewGuid: getNewGuid, // 得到GUID   例如：ade24d16-db0f-40af-8794-1e08e2040df3 
  getHttpProtocolURL: getHttpProtocolURL, //得到一个URL的 协议头名称 是： http:// 还是 https://
  removeFrontAndBackChar: removeFrontAndBackChar, //去掉前后的指定字符 如“|”
  copyContentClipboard: copyContentClipboard, // 复制内容到剪贴板上
  scanCodeQr: scanCodeQr, //调用弹出扫码框
  logOut:logOut, //输出日志
}

/**
 * 格式化 小数点位数，后面的四舍五入
 * @param {any} pFormatNumber 要格式化的数字
 * @param {any} pDotDigitNum 保留几位小数
 */
function formatNumberDotDigit(pFormatNumber, pDotDigitNum = 2) {

  var s = pFormatNumber
  var n = pDotDigitNum

  n = n > 0 && n <= 20 ? n : 2;
  s = parseFloat((s + "").replace(/[^\d\.-]/g, "")).toFixed(n) + "";
  var l = s.split(".")[0].split("").reverse(),
    r = s.split(".")[1];
  var t = "";
  for (var i = 0; i < l.length; i++) {
    t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "" : "");
  }
  return t.split("").reverse().join("") + "." + r;
}


/**
 * 格式化，回跳的URL字符串，把 ^ 换成 ?  把 ~ 换成 = 把 & 换成 |
 * @param {*} pBackURL 
 */
function formatBackURLParamChar(pBackURL) {
  pBackURL = strReplace(strReplace(strReplace(pBackURL, "^", "?"), "~", "="), "|", "&");
  return pBackURL
}

/**
 * -------------验证输入的是否为【手机号码】------------
 */
function checkMobileNumber(strMobileNumber) {
  strMobileNumber = strMobileNumber.trim();
  if (!strMobileNumber.match(/^1[3|4|5|6|7|8|9][0-9]\d{4,8}$/)) {
    //手机号码格式不正确！请重新输入！
    return false;
  }
  return true;
}

/**
 * ------用新的字符 替换 掉指定的字符------
 */
function strReplace(InputValue, OldStr, NewsStr) {
  var _OldStr = OldStr.trim();
  var _NewsStr = NewsStr.trim();

  var strInputValue = InputValue.replace(_OldStr, _NewsStr);
  //去掉指定字符
  while (strInputValue.indexOf(_OldStr) >= 0) {
    strInputValue = strInputValue.replace(_OldStr, _NewsStr);
  }
  return strInputValue;
}

/**
 * 格式化日期时间 如( 2018-09-01 12:32:18 )
 * @param date 当前的时间
 */
const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

/**
 * ----------跳转到页面，不能是Tab页------------------
 * @param pUrl 跳转的路径 [../../pages/detail/detail]
 */
function navigateToURL(pUrl) {
  wx.navigateTo({
    url: '' + pUrl + '',
  });
}

/**
 * ----------跳转到页面，不能返回上一个页------------------
 * @param pUrl 跳转的路径 [../../pages/detail/detail]
 */
function redirectToURL(pUrl) {
  wx.redirectTo({
    url: pUrl,
  })
}

/**
 * --------跳转到Tab导航页，不能是其他页---------
 * @param pUrl 跳转的路径 [../../pages/detail/detail]
 */
function switchTabURL(pUrl) {
  wx.switchTab({
    url: pUrl,
  })
}
/**
 * ------弹出提示框-------
 * @param pContent 提示内容
 */
function alertWin(pContent) {
  wx.showModal({
    title: '提示',
    content: pContent,
    showCancel: false
  })
}
/**
 * ------确认提示框------
 * @param pContent 提示内容
 * @param callback 回调函数
 */
function confirmWin(pContent, callback) {
  wx.showModal({
    title: '确认提示',
    content: pContent,
    success: function (res) {

      if (res.confirm) {
        callback('Ok');
        //console.log('用户点击确定')
      } else if (res.cancel) {
        callback('Cancel');
        //console.log('用户点击取消')
      }
    }
  })
}
/**
 * -----显示加载提示-----
 */
function showLoadingWin(pContent) {
  //显示加载提示
  wx.showLoading({
    title: pContent,
    mask: true,
  })
}
/**
 * -----关闭加载提示-----
 */
function hideLoadingWin() {

  wx.hideLoading({
    success: (res) => {},
  })

}
/**
 * -----显示操作成功提示------
 */
function showToastSu(pContent, pDuration = 2000, pIsMask = true) {
  wx.showToast({
    title: pContent,
    icon: 'success',
    duration: pDuration,
    mask: pIsMask,
  })
}
/**
 * -----显示Toast提示------
 */
function showToast(pContent, pDuration = 2000, pIsMask = true) {
  wx.showToast({
    title: pContent,
    icon: 'none',
    duration: pDuration,
    mask: pIsMask,
  })
}

/**
 * -----显示Toast提示 带回调函数------
 */
function showToastCb(pContent, pCallBack, pDuration = 2000, pIsMask = true) {
  wx.showToast({
    title: pContent,
    icon: 'none',
    duration: pDuration,
    mask: pIsMask,
  });

  setTimeout(() => {
    //回调函数
    pCallBack();
  }, pDuration);

}

/**
 * 显示Toast提示 没有遮罩，时间短 1500
 * @param {*} pContent 
 * @param {*} pDuration 
 * @param {*} pIsMask 
 */
function showToastNoMaskShort(pContent, pDuration = 1500, pIsMask = false) {
  wx.showToast({
    title: pContent,
    icon: 'none',
    duration: pDuration,
    mask: pIsMask,
  })
}

/**
 * -----存储Cookie数据------
 * @param pCookieName Cookie名称 
 * @param pCookieValue Cookie值
 */
function setCookie(pCookieName, pCookieValue) {
  wx.setStorage({
    key: pCookieName,
    data: pCookieValue,
  })
}
/**
 * -----得到Cookie数据------
 * @param pCookieName Cookie名称
 */
function getCookie(pCookieName, callback) {

  wx.getStorage({
    key: pCookieName,
    success: function (res) {
      //console.log("getCookie=" + JSON.stringify(res));
      if (res.data == "" || res.data == null || res.data == undefined) {
        callback("");
      } else {
        callback(res.data);
      }

    },
    fail: function (res) {
      //console.log(res);
      callback("");
    }
  })
}

/**
 * ------定义执行一次函数------
 * @param pDelayedTime 延时时间 毫秒
 */
function defineSetTimeOut(pDelayedTime, callback) {
  setTimeout(function () {

    //回调函数
    callback();

  }, pDelayedTime);
}

/**
 * 拨打电话
 * @param {*} pPhoneNumber 
 */
function makePhoneCall(pPhoneNumber) {
  wx.makePhoneCall({
    phoneNumber: pPhoneNumber,
    success: function () {
      //console.log("拨打电话成功！")
    },
    fail: function () {
      //console.log("拨打电话失败！")
      //showToast("拨打电话失败！");
    }
  })
}

/**
 * 直接打开微信内置地图插件
 * @param {*} pLatitude  纬度，范围为-90~90，负数表示南纬
 * @param {*} pLongitude  经度，范围为-180~180，负数表示西经
 * @param {*} pName 地址名称
 * @param {*} pAddress 地址详细
 */
function openMiniMap(pLatitude, pLongitude, pName = "", pAddress = "") {
  //直接打开微信内置地图插件
  wx.openLocation({
    latitude: pLatitude, // 纬度，范围为-90~90，负数表示南纬
    longitude: pLongitude, // 经度，范围为-180~180，负数表示西经
    // scale: 28, // 缩放比例
    name: pName, //"店铺名称",
    address: pAddress, // "店铺地址呀店铺地址呀"
  });
}

/**
 * 得到当前微信小程序用户的坐标 经纬度
 * @param {*} pCallBack 
 */
function getMiniLocation(pCallBack) {
  //这里是执行定位
  wx.getLocation({
    type: 'gcj02', // 默认为 wgs84 返回 gps 坐标，gcj02 返回可用于 wx.openLocation 的坐标
    success: function (res) {
      console.log(res);
      // success
      pCallBack(res);
      return;
    }
  })

// accuracy: 65
// errMsg: "getLocation:ok"
// horizontalAccuracy: 65
// latitude: 28.24595
// longitude: 113.08093
// speed: -1
// verticalAccuracy: 65

}

/**
 * 显示图片预览组件
 * @param {*} pImgUrlArr  预览图片的URL 数组 [https://pic.90tu.com/d/file/update/201410/07/baxea3h1y1z07.jpg]
 * @param 当前图片索引
 */
function previewImg(pImgUrlArr, pCurIndex) {
  //图片预览
  wx.previewImage({
    current: pImgUrlArr[pCurIndex], // 当前显示图片的http链接
    urls: pImgUrlArr // 需要预览的图片http链接列表
  });

}

/**
 * 分割拼接字符串为数组
 * @param {any} pStringArr 拼接字符串
 * @param {any} pJoinChar 分割字符 [ "^" ]
 */
function splitStringJoinChar(pStringArr, pJoinChar = "^") {

  var _strArr = new Array();

  if (pStringArr == "") {
    return _strArr;
  }

  if (pStringArr.indexOf(pJoinChar) >= 0) {
    _strArr = pStringArr.split(pJoinChar);
  } else {
    _strArr[0] = pStringArr;
  }
  return _strArr;
}

/**
 * 得到GUID   例如：ade24d16-db0f-40af-8794-1e08e2040df3 
 */
function getNewGuid() {
  var newGuid_1 = NewGUID(8, 16);
  var newGuid_2 = NewGUID(4, 16);
  var newGuid_3 = NewGUID(4, 16);
  var newGuid_4 = NewGUID(4, 16);
  var newGuid_5 = NewGUID(12, 16);
  var newGuid_6 = NewGUID(9, 16);
  //构造GUID
  var newGuid = newGuid_1 + "-" + newGuid_2 + "-" + newGuid_3 + "-" + newGuid_4 + "-" + newGuid_5; //+ "-" + newGuid_6;

  return newGuid.toLowerCase();
}
/**
 * 生成GUID
 * @param {any} len
 * @param {any} radix
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
/**
 * 得到一个URL的 协议头名称 是： http:// 还是 https://
 * @param {*} pURL 
 */
function getHttpProtocolURL(pURL) {
  var _httpName = pURL.substring(0, pURL.indexOf('://') + 3);
  return _httpName;
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
 * 复制内容到剪贴板上
 * @param {*} pCopyContent 
 */
function copyContentClipboard(pCopyContent) {

  wx.setClipboardData({
    data: "" + pCopyContent + "",
  })

}

/**
 * 遮罩手机号，中间四位显示为****
 * @param {any} pMobileNumber
 */
function maskMobileNumber(pMobileNumber) {

  if (pMobileNumber != "" && pMobileNumber != null && pMobileNumber != undefined && pMobileNumber.length > 7) {

    var _strStart = pMobileNumber.substring(0, 3);
    var _strEnd = pMobileNumber.substring(_strStart.length + 4);

    return _strStart + "****" + _strEnd;
  }
  return pMobileNumber;
}

/**
 * 调用弹出扫码框
 * @param {*} pCallBack 
 */
function scanCodeQr(pCallBack) {
  wx.scanCode({
    onlyFromCamera: false,
    scanType: ['barCode', 'qrCode', 'datamatrix', 'pdf417'],
    success: res => {
      if (res.errMsg == 'scanCode:ok') {
        //回调函数
        pCallBack(res.result);
      }
    },
    fail: res => {
      // 接口调用失败
      // wx.showToast({
      //   icon: 'none',
      //   title: '扫码失败！'
      // })
    },
    complete: res => {
      // 接口调用结束
      //console.log(res)
    }
  });
}

/**
 * 输出日志
 * @param {*} pLogCotnent 
 */
function logOut(pLogCotnent){
   console.log(pLogCotnent);
}