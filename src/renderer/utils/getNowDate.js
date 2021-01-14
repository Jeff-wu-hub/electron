/**
 * 获取当前时间
 * 格式自己定
 * seperator1  日期年月日之间的分隔符
 */
export function getNowFormatDate(seperator1) {
  var date = new Date(); //获取当前日期
  var year = date.getFullYear(); // 年
  var month = date.getMonth() + 1; // 月
  var strDate = date.getDate(); // 日
  if (month >= 1 && month <= 9) { // 月 显示为两位数 如：02
    month = "0" + month;
  }
  if (strDate >= 0 && strDate <= 9) { // 日 显示为两位数 如：04
    strDate = "0" + strDate;
  }
  var currentdate = year + seperator1 + month + seperator1 + strDate;
  return currentdate;
}
