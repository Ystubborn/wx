var app = getApp();

// 去前后空格  
var trim = function(str) {
  if (!str) {
    return '';
  }
  return str.replace(/(^\s*)|(\s*$)/g, "");
}

//判断是否为数字
var isNumber = function(str) {
  var n = Number(str);
  if (!isNaN(n)) {
    return true;
  } else {
    return false;
  }
}

//判断是否对象 
var isObj = function(obj) {
  if (typeof obj == "object") {
    return true;
  } else {
    return false;
  }
}
//判断是否为空  
var isNull = function(obj) {
  var obj = obj;
  if (obj == "" || obj == null || obj == undefined || obj == "null" || obj == "undefined") {
    return true;
  } else {
    return false;
  }
}


//获取地址栏参数 
var getQueryString = function(name) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
  var r = window.location.search.substr(1).match(reg);
  if (r != null) return unescape(r[2]);
  return null;
}


//检测IP地址
var isIP = function(s) {
  var patrn = /^[0-9.]{1,20}$/;
  if (!patrn.exec(s)) return false
  return true
}
var httpReq = function(url, reqData, succ, method, fali) {
  if (!app.globalData.cookie || !app.globalData.token) {
    wx.reLaunch({
      url: '/pages/custom/login/login'
    });
    return;
  }
  console.log(url);
  wx.request({
    url: app.globalData.domain + url,
    header: {
      'content-type': 'application/json',
      'accept': '	application/json;charset=utf-8',
      'X-AppId': app.globalData.appId,
      'X-CompanyId': app.globalData.companyId,
      'X-TokenId': app.globalData.token,
      'Cookie': app.globalData.cookie
    },
    method: method ? method : 'POST',
    data: reqData,
    success(res) {
      console.log(res);
      if (res.statusCode == 401) {
        return wx.showModal({
          title: '提示',
          content: '登录失效，请重新登录！',
          success: function() {
            wx.reLaunch({
              url: '/pages/custom/login/login'
            });
          }
        })
      }
      succ(res);
    },
    fail: function() {
      if (fali) {
        fali();
      }
      wx.showToast({
        title: '服务异常,请稍后重试',
        icon: 'none'
      })
    }
  })

}

var httpUpload = function(url, callBack) {
  if (!app.globalData.cookie || !app.globalData.token) {
    try {
      var value = wx.getStorageSync('userInfo')
      if (value) {
        app.globalData.token = value.token;
        app.globalData.cookie = value.cookie;
      }
    } catch (e) {
      console.log(e);
    }
  }
  if (!app.globalData.cookie || !app.globalData.token) {
    wx.reLaunch({
      url: '/pages/custom/login/login'
    });
    return;
  }
  wx.uploadFile({
    url: app.globalData.domain + '/fs/FileInfo/AjaxUpload',
    header: {
      'accept': '	application/json;charset=utf-8',
      'sysCode': 'yidaohome',
      'authCode': 'eWlkYW9ob21lOnlkajc4OWww'
    },
    filePath: url,
    name: "file",
    success(res) {
      callBack(res);
    },
    fail: function() {
      wx.showToast({
        title: '服务异常,请稍后重试',
        icon: 'none'
      })
    }
  })

}

var formatLeadingZeroNumber = function(n, digitNum = 2) {
  n = n.toString()
  const needNum = Math.max(digitNum - n.length, 0)
  return new Array(needNum).fill(0).join('') + n
}

var formatDate = function(date) {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  return [year, month, day].map(value => formatLeadingZeroNumber(value, 2)).join('-')
}


var formatShortDate = function(date) {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  return [month, day].map(value => formatLeadingZeroNumber(value, 2)).join('/')
}

var formatWeek = function(date) {
  var week;
  if (date.getDay() == 0) week = "周日"
  if (date.getDay() == 1) week = "周一"
  if (date.getDay() == 2) week = "周二"
  if (date.getDay() == 3) week = "周三"
  if (date.getDay() == 4) week = "周四"
  if (date.getDay() == 5) week = "周五"
  if (date.getDay() == 6) week = "周六"
  return week;
}

var formatDate = function(date) {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  return [year, month, day].map(value => formatLeadingZeroNumber(value, 2)).join('-')
}

var formatAddDate = function(date, day) {
  var t = new Date(); //你已知的时间
  var t_s = t.getTime(); //转化为时间戳毫秒数 
  t.setTime(t_s + (1000 * 60 * 60 * 24 * day));
  return formatDate(t);
}

var formatDateTime = function(date, withMs = false) {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()
  const ms = date.getMilliseconds()

  let ret = [year, month, day].map(value => formatLeadingZeroNumber(value, 2)).join('-') +
    ' ' + [hour, minute, second].map(value => formatLeadingZeroNumber(value, 2)).join(':')
  if (withMs) {
    ret += '.' + formatLeadingZeroNumber(ms, 3)
  }
  return ret
}
var formatDateTime0 = function(dateStr) {
  if (!dateStr || dateStr.length == 0) {
    return '';
  }
  return dateStr.substr(0, 4) + '-' + dateStr.substr(5, 2) + '-' + dateStr.substr(8, 2) + ' ' + dateStr.substr(11, 2) + ':' + dateStr.substr(14, 2);
}
var formatDateTime2 = function(dateStr) {
  if (!dateStr || dateStr.length == 0) {
    return '';
  }
  return dateStr.substr(5, 2) + '-' + dateStr.substr(8, 2) + ' ' + dateStr.substr(11, 2) + ':' + dateStr.substr(14, 2);
}
var formatDateTime3 = function(dateStr) {
  if (!dateStr || dateStr.length == 0) {
    return '';
  }
  return '-' + dateStr.substr(11, 2) + ':' + dateStr.substr(14, 2);
}
var formatTime = function(time) {
  if (typeof time !== 'number' || time < 0) {
    return time
  }

  const hour = parseInt(time / 3600, 10)
  time %= 3600
  const minute = parseInt(time / 60, 10)
  time = parseInt(time % 60, 10)
  const second = time

  return ([hour, minute, second]).map(function(n) {
    n = n.toString()
    return n[1] ? n : '0' + n
  }).join(':')
}


var convertDateFromString = function(dateString) {
  if (dateString) {
    var arr1 = dateString.split(" ");
    var sdate = arr1[0].split('-');
    var date = new Date(sdate[0], sdate[1] - 1, sdate[2]);
    return date;
  }
}
var compareTime = function(startDate, endDate) {
  if (startDate.length > 0 && endDate.length > 0) {
    var startDateTemp = startDate.split(" ");
    var endDateTemp = endDate.split(" ");

    var arrStartDate = startDateTemp[0].split("-");
    var arrEndDate = endDateTemp[0].split("-");

    var arrStartTime = startDateTemp[1].split(":");
    var arrEndTime = endDateTemp[1].split(":");
    var allStartDate = new Date(parseInt(arrStartDate[0]), parseInt(arrStartDate[1]) - 1, parseInt(arrStartDate[2]), parseInt(arrStartTime[0]), parseInt(arrStartTime[1]), parseInt(arrStartTime[2]));
    var allEndDate = new Date(parseInt(arrEndDate[0]), parseInt(arrEndDate[1]) - 1, parseInt(arrEndDate[2]), parseInt(arrEndTime[0]), parseInt(arrEndTime[1]), parseInt(arrEndTime[2]));

    if (allStartDate.getTime() >= allEndDate.getTime()) {
      return false;
    } else {
      return true;
    }
  } else {
    return false;
  }
}
function checkPhone(phone) { 
  return /^(0|86|17951)?(1[2-9][0-9])[0-9]{8}$/.test(phone); 
  // return (/^1[3456789]\d{9}$/.test(phone));
}

function replaceAll(s, s1, s2) {
  return s.replace(new RegExp(s1, "gm"), s2);
}

function validHasPhone(str) {
  var phoneNums = str.match(/(1[3|4|5|6|7|8|9][\d]{9}|0[\d]{2,3}-[\d]{7,8}|400[-]?[\d]{3}[-]?[\d]{4})/g);
  var newStr;
  if (phoneNums) {
    for (var i = 0; i < phoneNums.length; i++) {
      var temp = phoneNums[i];
      newStr = str.replace(phoneNums[i], temp.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2'));
    }
    return newStr != str;
  } else {
    return false;
  }
}
 
module.exports = {
  httpReq: httpReq,
  httpUpload: httpUpload,
  trim: trim,
  isNumber: isNumber,
  isObj: isObj,
  isIP: isIP,
  isNull: isNull,
  getQueryString: getQueryString,
  formatLeadingZeroNumber: formatLeadingZeroNumber,
  formatDate: formatDate,
  formatShortDate: formatShortDate,
  formatWeek: formatWeek,
  formatDate: formatDate,
  formatAddDate: formatAddDate,
  formatDateTime: formatDateTime,
  formatDateTime0: formatDateTime0,
  formatTime: formatTime,
  formatDateTime2: formatDateTime2,
  formatDateTime3: formatDateTime3,
  convertDateFromString: convertDateFromString,
  compareTime: compareTime,
  checkPhone: checkPhone,
  replaceAll: replaceAll,
  validHasPhone: validHasPhone
}