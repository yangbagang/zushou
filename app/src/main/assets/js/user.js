//basePath = 'http://192.168.12.100:8080/';
//token = 'e07e054dfc57bf5401088582da1feba9631ab0732f82ad0fbd92b388b1e1d696';
var ids = '';

// 加载销售页面
mainView.loadPage("user.html");
var mchart;
var nchart;
var pchart;
var option = {
        tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b}: {c} ({d}%)"
        },
        series: [
            {
                name:'',
                type:'pie',
                radius: ['50%', '70%'],
                avoidLabelOverlap: true,
                label: {
                    normal: {
                        show: true,
                        position: 'center'
                    },
                    emphasis: {
                        show: true,
                        textStyle: {
                            fontSize: '30',
                            fontWeight: 'bold'
                        }
                    }
                },
                labelLine: {
                    normal: {
                        show: false
                    }
                },
                data:[]
            }
        ]
    };

// 初始化页面
myApp.onPageInit('user_analysis', function (page) {
    //加载主题店列表
    initStoreList();
    //初始化图表变量
    mchart = echarts.init(document.getElementById('moneyChartCanvas'));
    nchart = echarts.init(document.getElementById('countChartCanvas'));
    pchart = echarts.init(document.getElementById('payChartCanvas'));
    mchart.setOption(option);
    nchart.setOption(option);
    pchart.setOption(option);
    //初始化时间并查询
    initSearchDate();
    //关闭按钮
    $$("a[href='close']").on('click', function (e) {
         window.location.href = "../close.html";
    });
});

//初始化主题店列表
function initStoreList() {
    var url = basePath + 'themeStoreBaseInfo/listThemeStore';
    var params = {token: token};
    $$.getJSON(url, params, function(data) {
        if (data.success) {
            $$("#storeList").html("");
            var content = "<ul>";
            $$.each(data.dataList, function(index, value){
                content += '<li>' +
                           '<div class="item-content">' +
                           '<div class="item-media">' +
                           '<input type="checkbox" value="'+value.id+'" checked="checked" name="sid">' +
                           '</div><div class="item-inner">' +
                           '<div class="item-title">'+value.name+'</div>' +
                           '<div class="item-text">'+value.address+'</div>' +
                           '</div></div></li>';
            });
            content += "</ul>";
            $$("#storeList").html(content);
        } else {
            myApp.alert(data.msg, "提示");
        }
    });
}

//执行缺省查询
function initSearchDate() {
    var today = getToday();
    $$("#calendar-begin").val(today);
    $$("#calendar-end").val(today);
    searchSaleData();
    //开始时间选择器
    var beginCal = myApp.calendar({
        input: "#calendar-begin",
        toolbarCloseText: "确定",
        monthNames: monthNames,
        monthNamesShort: monthNamesShort,
        dayNames: dayNames,
        dayNamesShort: dayNamesShort,
        onClose: function(){
            searchSaleData();
        }
    });
    //结束时间选择器
    var endCal = myApp.calendar({
        input: "#calendar-end",
        toolbarCloseText: "确定",
        monthNames: monthNames,
        monthNamesShort: monthNamesShort,
        dayNames: dayNames,
        dayNamesShort: dayNamesShort,
        onClose: function(){
            searchSaleData();
        }
    });
}

//设置选择的主题店
function setSelectedStore() {
    var s = '';
    $$('input[type="checkbox"][name="sid"][checked]').each(function(){
        if ($$(this).prop("checked")) {
            if (s == '') {
                s = $$(this).val();
            } else {
                s += ',' + $$(this).val();
            }
        }
    });
    if (s == '') {
        myApp.alert("您最少要选择一个主题店", "提示");
    } else {
        ids = s;
        pageNum = 1;
        searchSaleData();
    }
}

function selectAllStores() {
    var isChecked = $$('#checkedAll').prop('checked');
    $$('input[type="checkbox"][name="sid"]').each(function(){
        $$(this).prop('checked', isChecked);
    });
}

//数据搜索入口
function searchSaleData(){
    queryUserData();
    countChart();
    moneyChart();
    payChart();
}

function queryUserData() {
    var url = basePath + "dataAnalysis/userAnalysis";
    var fromDate = $$("#calendar-begin").val();
    var toDate = $$("#calendar-end").val();
    var params = {token: token, themeIds: ids, fromDate: fromDate, toDate: toDate};
    $$.postJSON(url, params, function(data){
        if (data.success) {
            var totalMoney = data.totalMoney
            var totalCount = data.totalCount
            var totalUser = data.totalUser
            var newUserNum = data.newUserNum
            var newUserMoney = data.newUserMoney
            var newUserCount = data.newUserCount
            $$("#newUserNum").html("新增用户数："+newUserNum+"人");
            $$("#newUserMoney").html("新增消费金额："+newUserMoney+"元");
            $$("#newUserCount").html("新增消费数量："+newUserCount+"次");
            $$("#oldUserNum").html("老用户购买人数："+(totalUser-newUserNum)+"人");
            $$("#oldUserMoney").html("老用户消费金额："+(totalMoney-newUserMoney).toFixed(1)+"元");
            $$("#oldUserCount").html("老用户消费数量："+(totalCount-newUserCount)+"次");
        } else {
            myApp.alert(data.message, "提示");
        }
    });
}


function countChart() {
    nchart.showLoading();
    var url = basePath + "dataAnalysis/numberAnalysis";
    var fromDate = $$("#calendar-begin").val();
    var toDate = $$("#calendar-end").val();
    var params = {token: token, themeIds: ids, fromDate: fromDate, toDate: toDate};
    $$.postJSON(url, params, function(result){
        nchart.hideLoading();
        if (result.success) {
            var dataList = result.dataList;
            var num1 = dataList[0].num;
            var num2 = dataList[1].num;
            var num3 = dataList[0].num;
            var num4 = dataList[1].num;
            var num5 = dataList[1].num;
            nchart.setOption({
                series: [{
                    name: '消费次数分布',
                    data: [
                        {value: num1, name: '1次'},
                        {value: num2, name: '2-3次'},
                        {value: num3, name: '4-5次'},
                        {value: num4, name: '6-10次'},
                        {value: num5, name: '10次以上'}
                    ]
                }]
            });
        } else {
            myApp.alert(data.message, "提示");
        }
    });
}

function moneyChart() {
    mchart.showLoading();
    var url = basePath + "dataAnalysis/moneyAnalysis";
    var fromDate = $$("#calendar-begin").val();
    var toDate = $$("#calendar-end").val();
    var params = {token: token, themeIds: ids, fromDate: fromDate, toDate: toDate};
    $$.postJSON(url, params, function(result){
        mchart.hideLoading();
        if (result.success) {
            var dataList = result.dataList;
            var num1 = dataList[0].num;
            var num2 = dataList[1].num;
            var num3 = dataList[0].num;
            var num4 = dataList[1].num;
            var num5 = dataList[1].num;
            mchart.setOption({
                series: [{
                    name: '消费金额分布',
                    data: [
                        {value: num1, name: '10元以下'},
                        {value: num2, name: '10元至50元'},
                        {value: num3, name: '50元至100元'},
                        {value: num4, name: '100元至200元'},
                        {value: num5, name: '200元以上'}
                    ]
                }]
            });
        } else {
            myApp.alert(data.message, "提示");
        }
    });
}

function payChart() {
    pchart.showLoading();
    var url = basePath + "dataAnalysis/payAnalysis";
    var fromDate = $$("#calendar-begin").val();
    var toDate = $$("#calendar-end").val();
    var params = {token: token, themeIds: ids, fromDate: fromDate, toDate: toDate};
    $$.postJSON(url, params, function(result){
        pchart.hideLoading();
        if (result.success) {
            var dataList = result.dataList;
            var zfb = dataList[0].num;
            var wx = dataList[1].num;
            pchart.setOption({
                series: [{
                    name: '支付方式对比',
                    data: [
                        {value: zfb, name: '支付宝'},
                        {value: wx, name: '微信'}
                    ]
                }]
            });
        } else {
            myApp.alert(data.message, "提示");
        }
    });
}
