//basePath = 'http://192.168.100.9:8080/';
//token = 'e07e054dfc57bf5401088582da1feba9631ab0732f82ad0fbd92b388b1e1d696';

// 加载主题店列表页
mainView.loadPage("themeStore.html");

// 读取服务器主题店数据
myApp.onPageInit('storeListForQH', function (page) {
    $$.getJSON(basePath + 'themeStoreBaseInfo/listThemeStore', {token: token, name: ""}, function
    (data) {
        if (data.success) {
            $$("#themeStoreList").html("");
            var content = "";
            $$.each(data.dataList, function(index, value){
                content += '<li onclick="manageGoods('+value.id+')">' +
                           '<a href="#" class="item-link">' +
                           '<div class="item-content">' +
                           '<div class="item-media"><i class="icon icon-store"></i></div>' +
                           '<div class="item-inner">' +
                           '<div class="item-title">'+value.name+'</div>' +
                           '<div class="item-text">'+value.address+'</div>' +
                           '</div></div></a></li>';
            });
            $$("#themeStoreList").html(content);
        } else {
            myApp.alert(data.msg, "提示");
        }
    });
    $$("a[href='close']").on('click', function (e) {
         window.location.href = "../close.html";
    });
});

// 转到主题店商品管理页
function manageGoods(id) {
    mainView.loadPage("quehuo.html?storeId=" + id);
}

var storeId = 0;
var isLoading = false;

// 初始化设备数据
myApp.onPageInit('quehuo_detail', function (page) {
    storeId = page.query.storeId;
    $$("a[href='close']").on('click', function (e) {
         window.location.href = "../close.html";
    });
    //初始化数据列表
    initDataTable();
    //初始化时间并查询
    searchQueHuoData();
});

function initDataTable() {
    //下接刷新
    $$('.pull-to-refresh-content').on('refresh', function (e) {
        if (!isLoading) {
            isLoading = true;
            searchQueHuoData();
        }
    });
}

function searchQueHuoData() {
    var url = basePath + "vendLayerTrackGoods/listThemeStoreGoods";
    var params = {token:token, storeId:storeId};
    $$.postJSON(url, params, function(data){
        isLoading = false;
        if (data.success) {
            //断路检查
            if (data.dataList.length == 0) {
                myApp.pullToRefreshDone();
                myApp.alert("没有相关数据", "提示");
                return;
            }
            var s= '';
            //初始更新
            s += createTableHead();
            //遍历数据
            $$.each(data.dataList, function(index, detail){
                var r = createTableRow(detail.gid, detail.num1, detail.num2,
                detail.goodsName, detail.storeName);
                s += r;
            });
            $$("#detailTable").html(s);
        } else {
            myApp.alert(data.message, "提示");
        }
    });
}

function createTableHead() {
    var s = '<div class="detail-head">' +
            '<div class="detail-cell detail-p-col1">主题店</div>' +
            '<div class="detail-cell detail-p-col2">商品</div>' +
            '<div class="detail-cell detail-p-col3">当前</div>' +
            '<div class="detail-cell detail-p-col4">最大</div>' +
            '<div class="detail-cell detail-p-col5">缺少</div>' +
            '</div>';
    return s;
}

function createTableRow(gid, num1, num2, goodsName, storeName) {
    var s = '<div class="detail-row" onclick="showDetail('+gid+')">' +
            '<div class="detail-cell detail-p-col1">'+storeName+'</div>' +
            '<div class="detail-cell detail-p-col2">'+goodsName+'</div>' +
            '<div class="detail-cell detail-p-col3">'+num1+'</div>' +
            '<div class="detail-cell detail-p-col4">'+num2+'</div>' +
            '<div class="detail-cell detail-p-col5 quehuo_num">'+(num2-num1)+'</div>' +
            '</div>';
    return s;
}

function showDetail(gid, goodsName) {
    var url = basePath + "vendLayerTrackGoods/listLayerGoods";
    var params = {token:token, goodsId:gid};
    $$.postJSON(url, params, function(data){
        if (data.success) {
            var s= '';
            s += createQuehuoHead();
            //遍历数据
            var goodsName = data.goodsName;
            $$.each(data.dataList, function(index, detail){
                var r = createQuehuoRow(detail.currentInventory, detail.largestInventory,
                goodsName, detail.orbitalNo);
                s += r;
            });
            $$("#detailTable2").html(s);
            myApp.popup(".quehuo-popup");
        } else {
            myApp.alert(data.message, "提示");
        }
    });
}

function createQuehuoHead() {
    var s = '<div class="detail-head">' +
            '<div class="detail-cell detail-p-col1">轨道</div>' +
            '<div class="detail-cell detail-p-col2">商品</div>' +
            '<div class="detail-cell detail-p-col3">当前</div>' +
            '<div class="detail-cell detail-p-col4">最大</div>' +
            '<div class="detail-cell detail-p-col5">缺少</div>' +
            '</div>';
    return s;
}

function createQuehuoRow(num1, num2, goodsName, orbitalNo) {
    var s = '<div class="detail-row">' +
            '<div class="detail-cell detail-p-col1">'+orbitalNo+'</div>' +
            '<div class="detail-cell detail-p-col2">'+goodsName+'</div>' +
            '<div class="detail-cell detail-p-col3">'+num1+'</div>' +
            '<div class="detail-cell detail-p-col4">'+num2+'</div>' +
            '<div class="detail-cell detail-p-col5 quehuo_num">'+(num2-num1)+'</div>' +
            '</div>';
    return s;
}