//basePath = 'http://192.168.12.100:8080/';
//token = 'e07e054dfc57bf5401088582da1feba9631ab0732f82ad0fbd92b388b1e1d696';
var ids = '';
var index = 0;

// 加载销售页面
mainView.loadPage("analysis.html");

// 初始化页面
myApp.onPageInit('goods_analysis', function (page) {
    index = 0;
    //加载主题店列表
    initStoreList();
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
        queryAnalysisData();
    }
}

function selectAllStores() {
    var isChecked = $$('#checkedAll').prop('checked');
    $$('input[type="checkbox"][name="sid"]').each(function(){
        $$(this).prop('checked', isChecked);
    });
}

//执行缺省查询
function initSearchDate() {
    var today = getToday();
    $$("#calendar-begin").val(today);
    $$("#calendar-end").val(today);
    queryAnalysisData();
    //开始时间选择器
    var beginCal = myApp.calendar({
        input: "#calendar-begin",
        toolbarCloseText: "确定",
        monthNames: monthNames,
        monthNamesShort: monthNamesShort,
        dayNames: dayNames,
        dayNamesShort: dayNamesShort,
        onClose: function(){
            queryAnalysisData();
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
            queryAnalysisData();
        }
    });
}

function queryAnalysisData() {
    var url = basePath + "dataAnalysis/goodsAnalysis";
    var fromDate = $$("#calendar-begin").val();
    var toDate = $$("#calendar-end").val();
    var params = {token:token,themeIds:ids,fromDate:fromDate,toDate:toDate};
    $$.postJSON(url, params, function(data){
        if (data.success) {
            var totalMoney = data.totalMoney
            var totalCount = data.totalCount
            var moneyList = data.moneyList
            var countList = data.countList
            //显示总数
            $$("#saleCount").html(totalCount);
            $$("#saleMoney").html(totalMoney);
            //显示金额榜
            var s= '';
            var head = createMoneyTableHead();
            s += head;
            if (moneyList == null || moneyList.length == 0) {
                var r = createEmptyTableRow();
                s += r;
            } else {
                //遍历数据
                var money = 0;
                var count = 0;
                $$.each(moneyList, function(index, detail){
                    money += detail.money;
                    count += detail.num;
                    var no = index + 1;
                    var r = createMoneyTableRow(no, detail.goods_name, detail.money, detail.num);
                    s += r;
                });
                var t = createMoneyTableRow('合计', '', money, count);
                s += t;
            }
            $$("#detailTable1").html(s);
            //显示数量榜
            s= '';
            head = createCountTableHead();
            s += head;
            if (countList == null || countList.length == 0) {
                var r = createEmptyTableRow();
                s += r;
            } else {
                //遍历数据
                var money = 0;
                var count = 0;
                $$.each(countList, function(index, detail){
                    money += detail.money;
                    count += detail.num;
                    var no = index + 1;
                    var r = createCountTableRow(no, detail.goods_name, detail.num, detail.money);
                    s += r;
                });
                var t = createMoneyTableRow('合计', '', count, money);
                s += t;
            }
            $$("#detailTable2").html(s);
        } else {
            myApp.alert(data.message, "提示");
        }
    });
}

function getGoodsMoneyList() {
    mainView.loadPage("goods.html?orderBy=money");
}

function getGoodsNumList() {
    mainView.loadPage("goods.html?orderBy=count");
}

var hasMore = true;
var isLoading = false;
var pageNum = 1;
var pageSize = 15;
var orderBy = 'money';
var i = 1;//序号
// 初始化页面
myApp.onPageInit('goods_detail', function (page) {
    orderBy = page.query.orderBy;
    //初始化变量
    hasMore = true;
    isLoading = false;
    pageNum = 1;
    i = 1;
    //初始化数据列表
    initDataTable();
    //初始查询
    searchGoodsData();
});
//数据搜索入口
function searchGoodsData(){
    var url = basePath + "dataAnalysis/queryGoods";
    var fromDate = $$("#calendar-begin").val();
    var toDate = $$("#calendar-end").val();
    var params = {token:token,themeIds:ids,orderBy:orderBy,fromDate:fromDate,toDate:toDate,
    pageNum:pageNum, pageSize:pageSize};
    $$.postJSON(url, params, function(data){
        if (data.success) {
            isLoading = false;
            myApp.pullToRefreshDone();
            //断路检查
            if (data.dataList.length == 0) {
                //没有数据
                hasMore = false;
                if (pageNum == 1) {
                    myApp.alert("没有相关数据", "提示");
                }
                return;
            }
            var s= '';
            if (pageNum == 1) {
                i = 1;
                //初始更新
                var head = '';
                if (orderBy == 'money') {
                    head = createMoneyTableHead();
                } else {
                    head = createCountTableHead();
                }
                s += head;
            } else {
                s += $$("#detailTable").html();
            }

            //遍历数据
            $$.each(data.dataList, function(index, detail){
                var r = '';
                if (orderBy == 'money') {
                    r = createMoneyTableRow(i, detail.goods_name, detail.money, detail.num);
                } else {
                    r = createCountTableRow(i, detail.goods_name, detail.num, detail.money);
                }
                s += r;
                i++;
            });
            $$("#detailTable").html(s);
        } else {
            myApp.alert(data.message, "提示");
        }
    });
}

function initDataTable() {
    //下接刷新
    $$('.pull-to-refresh-content').on('refresh', function (e) {
        if (!isLoading) {
            isLoading = true;
            pageNum = 1;
            searchGoodsData();
        }
    });
    // 上拉翻页
    $$('.infinite-scroll').on('infinite', function () {
        if (!isLoading && hasMore) {
            isLoading = true;
            pageNum += 1;
            searchGoodsData();
        }
    });
}

function createMoneyTableHead() {
    var s = '<div class="detail-head">' +
            '<div class="detail-cell goods-p-col1">序号</div>' +
            '<div class="detail-cell goods-p-col2">商品</div>' +
            '<div class="detail-cell goods-p-col3">金额</div>' +
            '<div class="detail-cell goods-p-col4">件数</div>' +
            '</div>';
    return s;
}

function createCountTableHead() {
    var s = '<div class="detail-head">' +
            '<div class="detail-cell goods-p-col1">序号</div>' +
            '<div class="detail-cell goods-p-col2">商品</div>' +
            '<div class="detail-cell goods-p-col3">件数</div>' +
            '<div class="detail-cell goods-p-col4">金额</div>' +
            '</div>';
    return s;
}

function createMoneyTableRow(no, time, money, num) {
    var s = '<div class="detail-row">' +
            '<div class="detail-cell goods-p-col1">'+no+'</div>' +
            '<div class="detail-cell goods-p-col2">'+time+'</div>' +
            '<div class="detail-cell goods-p-col3">'+money+'</div>' +
            '<div class="detail-cell goods-p-col4">'+num+'</div>' +
            '</div>';
    return s;
}

function createCountTableRow(no, time, num, money) {
    var s = '<div class="detail-row">' +
            '<div class="detail-cell goods-p-col1">'+no+'</div>' +
            '<div class="detail-cell goods-p-col2">'+time+'</div>' +
            '<div class="detail-cell goods-p-col3">'+num+'</div>' +
            '<div class="detail-cell goods-p-col4">'+money+'</div>' +
            '</div>';
    return s;
}

function createEmptyTableRow() {
    var s = '<div class="detail-row">' +
                '<div class="detail-cell">暂无数据</div>' +
             '</div>';
    return s;
}
