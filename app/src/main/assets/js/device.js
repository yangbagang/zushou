//basePath = 'http://192.168.12.101:8080/';
//token = 'e07e054dfc57bf5401088582da1feba9631ab0732f82ad0fbd92b388b1e1d696';
var isPortrait = window.screen.height > window.screen.width;

// 加载销售页面
mainView.loadPage("device.html");

// 初始化页面
myApp.onPageInit('device_list', function (page) {
    //初始化时间并查询
    searchDevices();
    //关闭按钮
    $$("a[href='close']").on('click', function (e) {
         window.location.href = "../close.html";
    });
});

//数据搜索入口
function searchDevices(){
    var url = basePath + "vendMachineInfo/listMachine";
    var params = {token:token};
    $$.postJSON(url, params, function(data){
        if (data.success) {
            //断路检查
            if (data.machineList.length == 0) {
                //没有数据
                myApp.alert("没有相关数据", "提示");
                return;
            }
            var s= createDeviceTableHead();
            //遍历数据
            $$.each(data.machineList, function(index, detail){
                var status  = detail.online_status == 1 ? "在线" : "离线";
                var r = createDeviceTableRow(detail.id, index + 1, detail.name, detail.machine_code,
                status, detail.report_time);
                s += r;
            });
            $$("#deviceTable").html(s);
        } else {
            myApp.alert(data.message, "提示");
        }
    });
}

function createDeviceTableHead() {
    var s = '<div class="detail-head">' +
            '<div class="detail-cell detail-p-col5">序号</div>' +
            '<div class="detail-cell detail-p-col2">主题店</div>' +
            '<div class="detail-cell detail-p-col3">编号</div>' +
            '<div class="detail-cell detail-p-col4">状态</div>' +
            '<div class="detail-cell detail-p-col1">更新时间</div>' +
            '</div>';
    return s;
}

function createDeviceTableRow(id, no, store, device, status, time) {
    var s = '<div class="detail-row" onclick="loadDetail('+id+')">' +
            '<div class="detail-cell detail-p-col5">'+no+'</div>' +
            '<div class="detail-cell detail-p-col2">'+store+'</div>' +
            '<div class="detail-cell detail-p-col3">'+device+'</div>' +
            '<div class="detail-cell detail-p-col4">'+status+'</div>' +
            '<div class="detail-cell detail-p-col1">'+time+'</div>' +
            '</div>';
    return s;
}

function loadDetail(id) {
    mainView.loadPage("detail.html?machineId=" + id);
}

var machineId = 0;

// 初始化设备数据
myApp.onPageInit('device_detail', function (page) {
    machineId = page.query.machineId;
    $$("a[href='close']").on('click', function (e) {
         window.location.href = "../close.html";
    });
    //初始化时间并查询
    searchDetail();
});

function searchDetail(){
    var url = basePath + "vendLayerTrackGoods/listNotWork";
    var params = {token:token, machineId: machineId};
    $$.postJSON(url, params, function(data){
        if (data.success) {
            //断路检查
            if (data.dataList.length == 0) {
                //没有数据
                myApp.alert("没有相关数据", "提示");
                return;
            }
            var s= createDetailTableHead();
            //遍历数据
            $$.each(data.dataList, function(index, detail){
                var status  = detail[4] == 1 ? "在售" : "暂停";
                var r = createDetailTableRow(index + 1, detail[0], detail[3],
                detail[1], detail[5], detail[6], status);
                s += r;
            });
            $$("#detailTable").html(s);
        } else {
            myApp.alert(data.message, "提示");
        }
    });
}

function createDetailTableHead() {
    var s = '';
    if (isPortrait) {
        s = '<div class="detail-head">' +
            '<div class="detail-cell detail-p-col5">序号</div>' +
            '<div class="detail-cell detail-p-col1">设备</div>' +
            '<div class="detail-cell detail-p-col3">轨道</div>' +
            '<div class="detail-cell detail-p-col2">商品</div>' +
            '<div class="detail-cell detail-p-col4">数量</div>' +
            '</div>';
    } else {
        s = '<div class="detail-head">' +
             '<div class="detail-cell detail-l-col5">序号</div>' +
             '<div class="detail-cell detail-l-col1">设备</div>' +
             '<div class="detail-cell detail-l-col3">轨道</div>' +
             '<div class="detail-cell detail-l-col2">商品</div>' +
             '<div class="detail-cell detail-l-col4">库存</div>' +
             '<div class="detail-cell detail-l-col7">最多</div>' +
             '<div class="detail-cell detail-l-col6">在售</div>' +
             '</div>';
    }
    return s;
}

function createDetailTableRow(no, device, trackNo, goods, num, maxNum, status) {
    var s = '';
    if (isPortrait) {
        s = '<div class="detail-row">' +
            '<div class="detail-cell detail-p-col5">'+no+'</div>' +
            '<div class="detail-cell detail-p-col1">'+device+'</div>' +
            '<div class="detail-cell detail-p-col3">'+trackNo+'</div>' +
            '<div class="detail-cell detail-p-col2">'+goods+'</div>' +
            '<div class="detail-cell detail-p-col4">'+num+'/'+maxNum+'</div>' +
            '</div>';
    } else {
        s = '<div class="detail-row">' +
             '<div class="detail-cell detail-l-col5">'+no+'</div>' +
             '<div class="detail-cell detail-l-col1">'+device+'</div>' +
             '<div class="detail-cell detail-l-col3">'+trackNo+'</div>' +
             '<div class="detail-cell detail-l-col2">'+goods+'</div>' +
             '<div class="detail-cell detail-l-col4">'+num+'</div>' +
             '<div class="detail-cell detail-l-col7">'+maxNum+'</div>' +
             '<div class="detail-cell detail-l-col6">'+status+'</div>' +
             '</div>';
    }
    return s;
}