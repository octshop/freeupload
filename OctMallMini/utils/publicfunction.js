/**
 * -----暴露函数-------------
 */
module.exports = {
  strReplace: strReplace,
  arrRemove: arrRemove,
  checkMobileNumber: checkMobileNumber,
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
 * ------删除指定索引的数组-------------
 */
function arrRemove(pArray,index)
{
  pArray.splice(index, 1);
}
// Array.prototype.remove = function (from, to) {
//   var rest = this.slice((to || from) + 1 || this.length);
//   this.length = from < 0 ? this.length + from : from;
//   return this.push.apply(this, rest);
// };

/**
 * -------------验证输入的是否为【手机号码】------------
 */
function checkMobileNumber(strMobileNumber) {
  if (!strMobileNumber.match(/^1[3|4|5|7|8][0-9]\d{4,8}$/)) {
    //手机号码格式不正确！请重新输入！
    return false;
  }
  return true;
}
