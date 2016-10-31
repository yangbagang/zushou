//basePath = 'http://192.168.12.100:8080/';
//token = 'e07e054dfc57bf5401088582da1feba9631ab0732f82ad0fbd92b388b1e1d696';
var ids = '';

// 加载销售页面
mainView.loadPage("themeStore.html");
var mchart;
var cchart;
var option = {
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            data:[]
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: []
        },
        yAxis: {
            type: 'value'
        },
        series: []
    };

// 初始化页面
myApp.onPageInit('data_analysis', function (page) {
    //加载主题店列表
    initStoreList();
    //初始化图表变量
    mchart = echarts.init(document.getElementById('moneyChartCanvas'));
    cchart = echarts.init(document.getElementById('countChartCanvas'));
    mchart.setOption(option);
    cchart.setOption(option);
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
    $$("#calendar-begin").val(getDefaultDate("calendar-begin"));
    $$("#calendar-end").val(getDefaultDate("calendar-end"));
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
            localStorage.setItem("calendar-begin", $$("#calendar-begin").val());
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
            localStorage.setItem("calendar-end", $$("#calendar-end").val());
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
    queryStoresData();
    countChart();
    moneyChart();
}

function queryStoresData() {
    var url = basePath + "dataAnalysis/queryThemeStoreData";
    var fromDate = $$("#calendar-begin").val();
    var toDate = $$("#calendar-end").val();
    var params = {token: token, themeIds: ids, fromDate: fromDate, toDate: toDate};
    $$.postJSON(url, params, function(data){
        if (data.success) {
            if (data.dataList.length == 0) {
                myApp.alert("无相关数据", "提示");
                return;
            }
            var s = '';
            s += createTableHead();
            $$.each(data.dataList, function(index, sale){
                s += createTableRow((index+1), sale.name, sale.money, sale.num);
            });
            $$("#detailTable").html(s);
        } else {
            myApp.alert(data.message, "提示");
        }
    });
}

function createTableHead() {
    var s = '<div class="detail-head">' +
            '<div class="detail-cell goods-p-col1">序号</div>' +
            '<div class="detail-cell goods-p-col2">主题店</div>' +
            '<div class="detail-cell goods-p-col3">销售金额</div>' +
            '<div class="detail-cell goods-p-col4">销售次数</div>' +
            '</div>';
    return s;
}

function createTableRow(no, name, money, num) {
    var s = '<div class="detail-row">' +
            '<div class="detail-cell goods-p-col1">'+no+'</div>' +
            '<div class="detail-cell goods-p-col2">'+name+'</div>' +
            '<div class="detail-cell goods-p-col3">'+money+'</div>' +
            '<div class="detail-cell goods-p-col4">'+num+'</div>' +
            '</div>';
    return s;
}

function countChart() {
    cchart.showLoading();
    var url = basePath + "dataAnalysis/storeCount";
    var fromDate = $$("#calendar-begin").val();
    var toDate = $$("#calendar-end").val();
    var params = {token: token, themeIds: ids, fromDate: fromDate, toDate: toDate};
    $$.postJSON(url, params, function(result){
        cchart.hideLoading();
        if (result.success) {
            var stores = result.nameList;
            var days = result.dayList;
            var series = result.dataList;
            cchart.setOption({
                legend: {
                    data:stores
                },
                xAxis: {
                    data: days
                },
                series: series
            });
        } else {
            myApp.alert(data.message, "提示");
        }
    });
}

function moneyChart() {
    mchart.showLoading();
    var url = basePath + "dataAnalysis/storeMoney";
    var fromDate = $$("#calendar-begin").val();
    var toDate = $$("#calendar-end").val();
    var params = {token: token, themeIds: ids, fromDate: fromDate, toDate: toDate};
    $$.postJSON(url, params, function(result){
        mchart.hideLoading();
        if (result.success) {
            var stores = result.nameList;
            var days = result.dayList;
            var series = result.dataList;
            mchart.setOption({
                legend: {
                    data:stores
                },
                xAxis: {
                    data: days
                },
                series: series
            });
        } else {
            myApp.alert(data.message, "提示");
        }
    });
}

