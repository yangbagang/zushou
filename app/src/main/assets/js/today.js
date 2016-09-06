//basePath = 'http://192.168.12.100:8080/';
//token = 'e07e054dfc57bf5401088582da1feba9631ab0732f82ad0fbd92b388b1e1d696';
var ids = '';
var isLoading = false;

// 加载销售页面
mainView.loadPage("hours.html");

// 初始化页面
myApp.onPageInit('today_detail', function (page) {
    //加载主题店列表
    initStoreList();
    //初始化数据列表
    initDataTable();
    //初始查询
    searchCountData();
    searchSaleData();
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
        pageNum = 1;
        searchCountData();
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
    var url = basePath + "dataAnalysis/queryHourData";
    var params = {token:token,themeIds:ids};
    $$.postJSON(url, params, function(data){
        if (data.success) {
            isLoading = false;
            myApp.pullToRefreshDone();
            //断路检查
            if (data.moneyList.length == 0) {
                //没有数据
                myApp.alert("没有相关数据", "提示");
                return;
            }
            var s= '';
            //初始更新
            var head = createTableHead();
            s += head;
            //遍历数据
            $$.each(data.moneyList, function(index, detail){
                var num = data.countList[index].num
                var r = createTableRow(detail.hour, detail.money, num);
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
            searchCountData();
            searchSaleData();
        }
    });
}

function createTableHead() {
    var s = '<div class="detail-head">' +
            '<div class="detail-cell today-p-col1">小时</div>' +
            '<div class="detail-cell today-p-col2">总金额</div>' +
            '<div class="detail-cell today-p-col3">总件数</div>' +
            '</div>';
    return s;
}

function createTableRow(time, money, num) {
    var s = '<div class="detail-row">' +
            '<div class="detail-cell today-p-col1">'+time+'</div>' +
            '<div class="detail-cell today-p-col2">'+money+'</div>' +
            '<div class="detail-cell today-p-col3">'+num+'</div>' +
            '</div>';
    return s;
}

function searchCountData() {
    var url = basePath + "dataAnalysis/queryTodayData";
    var params = {token:token,themeIds:ids};
    $$.postJSON(url, params, function(data){
        if (data.success) {
            $$("#saleMoney").html(data.totalMoney);
            $$("#saleCount").html(data.totalCount);
        } else {
            myApp.alert(data.message, "提示");
        }
    });
}

function getMoneyList() {
    mainView.loadPage("goods.html?type=1");
}

function getNumList() {
    mainView.loadPage("goods.html?type=2");
}

var type = 1;

function createGoodsHead() {
    var title = type == 1 ? "金额" : "数量";
    var s = '<div class="detail-head">' +
            '<div class="detail-cell today-p-col1">商品</div>' +
            '<div class="detail-cell today-p-col2">昨天'+title+'</div>' +
            '<div class="detail-cell today-p-col3">今天'+title+'</div>' +
            '</div>';
    return s;
}

var hasMore = true;
var pageNum = 1;
var pageSize = 15;

myApp.onPageInit('goods_compare', function (page) {
    type = page.query.type;
    //初始化变量
    hasMore = true;
    isLoading = false;
    pageNum = 1;
    //初始化数据列表
    initCompareTable();
    //初始查询
    searchGoodsData();
});

//数据搜索入口
function searchGoodsData(){
    var method = type == 1 ? "queryGoodsMoney" : "queryGoodsCount";
    var url = basePath + "dataAnalysis/" + method;
    var params = {token:token,themeIds:ids,orderBy:'desc',pageNum:pageNum, pageSize:pageSize};
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
                //初始更新
                var head = createGoodsHead();
                s += head;
            } else {
                s += $$("#compareTable").html();
            }

            //遍历数据
            $$.each(data.dataList, function(index, detail){
                var r = '';
                if (type == 1) {
                    r = createTableRow(detail.goodsName, detail.transMoney2, detail.transMoney1);
                } else {
                    r = createTableRow(detail.goodsName, detail.transCn2, detail.transCn1);
                }
                s += r;
            });
            $$("#compareTable").html(s);
        } else {
            myApp.alert(data.message, "提示");
        }
    });
}

function initCompareTable() {
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