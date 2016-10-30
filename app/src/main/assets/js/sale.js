//basePath = 'http://192.168.12.102:8080/';
//token = 'e07e054dfc57bf5401088582da1feba9631ab0732f82ad0fbd92b388b1e1d696';
var isPortrait = window.screen.height > window.screen.width;
var ids = '';
var hasMore = true;
var isLoading = false;
var pageNum = 1;
var pageSize = 15;
var isRefreshing = false;

// 加载销售页面
mainView.loadPage("detail.html");

// 初始化页面
myApp.onPageInit('sale_detail', function (page) {
    //加载主题店列表
    initStoreList();
    //初始化数据列表
    initDataTable();
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
            pageNum = 1;
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
            pageNum = 1;
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
    var beginDate = $$("#calendar-begin").val();
    var endDate = $$("#calendar-end").val();
    var url = basePath + "orderInfo/listAmountAndDetail";
    var params = {startDate:beginDate,endDate:endDate,pageSize:pageSize,pageNum:pageNum,
    token:token,themeIds:ids};
    $$.postJSON(url, params, function(data){
        if (data.success) {
            isLoading = false;
            //断路检查
            if (data.dataList.length == 0) {
                //没有数据
                hasMore = false;
                if (pageNum == 1) {
                    myApp.pullToRefreshDone();
                    myApp.alert("没有相关数据", "提示");
                }
                return;
            }
            //检查是否还有数据
            if (data.dataList.length < pageSize) {
                hasMore = false;
            } else {
                hasMore = true;
            }
            var s= '';
            //初始更新
            if (pageNum == 1) {
                if (isRefreshing) {
                    isRefreshing = false;
                    myApp.pullToRefreshDone();
                }
                $$("#saleMoney").html(data.salePrice);
                $$("#saleCount").html(data.saleCount);
                var head = createTableHead();
                s += head;
            } else {
                s += $$("#detailTable").html();
            }
            //遍历数据
            $$.each(data.dataList, function(index, detail){
                var zf = detail.transWay == 1 ? "支付宝" : "微信";
                var r = createTableRow(detail.orderTime, detail.storeName, detail.goodName,
                detail.goodNum, detail.orbitalNo, detail.price, zf);
                s += r;
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
            isRefreshing = true;
            searchSaleData();
        }
    });
    // 上拉翻页
    $$('.infinite-scroll').on('infinite', function () {
        if (!isLoading && hasMore) {
            isLoading = true;
            pageNum += 1;
            searchSaleData();
        }
    });
}

function createTableHead() {
    var s = '';
    if (isPortrait) {
        s = '<div class="detail-head">' +
            '<div class="detail-cell detail-p-col1">时间</div>' +
            '<div class="detail-cell detail-p-col2">商品</div>' +
            '<div class="detail-cell detail-p-col3">轨道</div>' +
            '<div class="detail-cell detail-p-col4">价格</div>' +
            '<div class="detail-cell detail-p-col5">支付</div>' +
            '</div>';
    } else {
        s = '<div class="detail-head">' +
             '<div class="detail-cell detail-l-col1">时间</div>' +
             '<div class="detail-cell detail-l-col2">主题店</div>' +
             '<div class="detail-cell detail-l-col3">商品</div>' +
             '<div class="detail-cell detail-l-col4">数量</div>' +
             '<div class="detail-cell detail-l-col5">轨道</div>' +
             '<div class="detail-cell detail-l-col6">价格</div>' +
             '<div class="detail-cell detail-l-col7">支付</div>' +
             '</div>';
    }
    return s;
}

function createTableRow(time, store, goods, num, trackNo, price, zf) {
    var s = '';
    if (isPortrait) {
        s = '<div class="detail-row">' +
            '<div class="detail-cell detail-p-col1">'+time+'</div>' +
            '<div class="detail-cell detail-p-col2">'+goods+'</div>' +
            '<div class="detail-cell detail-p-col3">'+trackNo+'</div>' +
            '<div class="detail-cell detail-p-col4">'+price+'</div>' +
            '<div class="detail-cell detail-p-col5">'+zf+'</div>' +
            '</div>';
    } else {
        s = '<div class="detail-row">' +
             '<div class="detail-cell detail-l-col1">'+time+'</div>' +
             '<div class="detail-cell detail-l-col2">'+store+'</div>' +
             '<div class="detail-cell detail-l-col3">'+goods+'</div>' +
             '<div class="detail-cell detail-l-col4">'+num+'</div>' +
             '<div class="detail-cell detail-l-col5">'+trackNo+'</div>' +
             '<div class="detail-cell detail-l-col6">'+price+'</div>' +
             '<div class="detail-cell detail-l-col7">'+zf+'</div>' +
             '</div>';
    }
    return s;
}