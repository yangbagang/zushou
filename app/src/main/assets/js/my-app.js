// Initialize your app
var myApp = new Framework7({
    // If it is webapp, we can enable hash navigation:
    //pushState: true,
    material: true,
    showBarsOnPageScrollEnd: false,
    // Hide and show indicator during ajax requests
    onAjaxStart: function (xhr) {
        myApp.showIndicator();
    },
    onAjaxComplete: function (xhr) {
        myApp.hideIndicator();
    }
});

// Export selectors engine
var $$ = Dom7;
// Add view
var mainView = myApp.addView('.view-main', {
    // Because we use fixed-through navbar we can enable dynamic navbar
    dynamicNavbar: true
});

function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return "";
}

var basePath = getQueryString("server");
var token = getQueryString("token");
var orientationChanged = getQueryString("orientationChanged");

$$.postJSON = function(url, data, success) {
    return $$.ajax({
        url: url,
        method: 'POST',
        data: typeof data === 'function' ? undefined : data,
        success: typeof data === 'function' ? data : success,
        dataType: 'json'
    });
}

function getToday() {
    var date = new Date();
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var today = date.getFullYear() + "-" + month + "-" + strDate;
    return today;
}

var monthNames = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月' , '九月' , '十月', '十一月', '十二月'];
var dayNames = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
var monthNamesShort = ['一', '二', '三', '四', '五', '六', '七', '八' , '九' , '十', '十一', '十二'];
var dayNamesShort = ['日', '一', '二', '三', '四', '五', '六'];

function getDefaultDate(key) {
    if (orientationChanged == "true") {
        var val = localStorage.getItem(key);
        if (val == undefined || val == "" || val == "undefined") {
            return getToday();
        }
        return val;
    } else {
        var today = getToday();
        localStorage.setItem(key, today);
        return today;
    }
}
