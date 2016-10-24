//basePath = 'http://192.168.12.101:8080/ua/';
//token = 'e07e054dfc57bf5401088582da1feba9631ab0732f82ad0fbd92b388b1e1d696';
var isPortrait = window.screen.height > window.screen.width;

// 加载销售页面
mainView.loadPage("list.html");

var flag = 0;
var hasMore = true;
var isLoading = false;
var pageNum = 1;
var pageSize = 15;
var isRefreshing = false;

// 初始化页面
myApp.onPageInit('feedback-list', function (page) {
    //初始化数据列表
    initDataTable();
    //初始化时间并查询
    searchFeedback();
    //关闭按钮
    $$("a[href='close']").on('click', function (e) {
         window.location.href = "../close.html";
    });
    $$("#showActionSheet").on('click', function (e) {
         var buttons = [
                 {
                     text: '只显示未处理',
                     onClick: function () {
                         flag = 0;
                         pageNum = 1;
                         searchFeedback();
                     }
                 },
                 {
                     text: '只显示己处理',
                     onClick: function () {
                         flag = 1;
                         pageNum = 1;
                         searchFeedback();
                     }
                 },
                 {
                     text: '显示全部反馈',
                     onClick: function () {
                         flag = 9;
                         pageNum = 1;
                         searchFeedback();
                     }
                 },
             ];
         myApp.actions(buttons);
    });
});

//数据搜索入口
function searchFeedback(){
    var url = basePath + "feedback/listAll";
    var params = {token:token, flag: flag, pageNum: pageNum, pageSize: pageSize};
    $$.postJSON(url, params, function(data){
        if (data.success) {
            isLoading = false;
            //检查是否还有数据
            if (data.dataList.length < pageSize) {
                hasMore = false;
            } else {
                hasMore = true;
            }
            if (isRefreshing) {
                isRefreshing = false;
                myApp.pullToRefreshDone();
            }
            var s = '';
            if (pageNum != 1) {
                s = $$("#feedbacks").html();
            }
            //遍历数据
            $$.each(data.dataList, function(index, detail){
                var r = createFeedbackItem(detail.id, detail.type, detail.content, detail.createTime,
                detail.flag);
                s += r;
            });
            $$("#feedbacks").html(s);
        } else {
            myApp.alert(data.message, "提示");
        }
    });
}

function createFeedbackItem(id, type, content, createTime, flag) {
    var pic = flag == 1 ? "finish.png" : "notice.png";
    var s = '<li onclick="loadDetail('+id+');">' +
            '<div class="item-content">' +
            '<div class="item-media">' +
            '<img src="../../img/'+pic+'" width="44"/>' +
            '</div>' +
            '<div class="item-inner">' +
            '<div class="item-title-row">' +
            '<div class="item-title">['+type+']   '+createTime+'</div>' +
            '</div>' +
            '<div class="item-subtitle">'+content+'</div>' +
            '</div>' +
            '</div>' +
            '</li>';
    return s;
}

function initDataTable() {
    //下接刷新
    $$('.pull-to-refresh-content').on('refresh', function (e) {
        if (!isLoading) {
            isLoading = true;
            pageNum = 1;
            isRefreshing = true;
            searchFeedback();
        }
    });
    // 上拉翻页
    $$('.infinite-scroll').on('infinite', function () {
        if (!isLoading && hasMore) {
            isLoading = true;
            pageNum += 1;
            searchFeedback();
        }
    });
}

function loadDetail(id) {
    mainView.loadPage("feedback.html?feedbackId=" + id);
}

var feedbackId = 0;

// 初始化设备数据
myApp.onPageInit('feedback-detail', function (page) {
    feedbackId = page.query.feedbackId;
    $$("a[href='close']").on('click', function (e) {
         window.location.href = "../close.html";
    });
    //初始化时间并查询
    searchDetail();
});

function searchDetail(){
    var url = basePath + "feedback/showDetail";
    var params = {token:token, feedbackId: feedbackId};
    $$.postJSON(url, params, function(data){
        if (data.success) {
            $$("#createTime").val(data.feedback.createTime);
            $$("#vmCode").val(data.feedback.vmCode);
            $$("#type").val(data.feedback.type);
            $$("#content").val(data.feedback.content);
            if (data.feedback.flag == 1) {
                $$("#result").val(data.feedback.result);
                $$("#result").prop("readonly", "readonly");
                $$("#updateTime").val(data.feedback.updateTime);
                $$("#userName").val(data.feedback.partnerUserName);
                $$("#saveButton").hide();
            }
            var s = data.feedback.flag == 1 ? "己处理" : "未处理";
            $$("#flag").val(s);
        } else {
            myApp.alert(data.message, "提示");
        }
    });
}

function saveContent() {
    var url = basePath + "feedback/saveContent";
    var content = $$("#saveButton").val()
    var params = {token:token, feedbackId: feedbackId, content: content};
    $$.postJSON(url, params, function(data){
        if (data.success) {
            searchDetail();//update
            myApp.alert("处理消息己提交", "提示");
        } else {
            myApp.alert(data.message, "提示");
        }
    });
}
