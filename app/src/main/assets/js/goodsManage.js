// 加载主题店列表页
mainView.loadPage("stores.html");

// 读取服务器主题店数据
myApp.onPageInit('storeListForBH', function (page) {
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
    mainView.loadPage("manage.html?storeId=" + id);
}

// 调试用数据，完成后删除。
//basePath = 'http://192.168.12.102:8080/';
//token = 'e07e054dfc57bf5401088582da1feba9631ab0732f82ad0fbd92b388b1e1d696';
var isPortrait = window.screen.height > window.screen.width;
var layers = '';
var storeId = 0;
var tabIndex = 1;

//子柜、副机数组，防止重复初始化
var cabArray = new Array();

// 初始化设备数据
myApp.onPageInit('goodsManage', function (page) {
    storeId = page.query.storeId;
    $$("a[href='close']").on('click', function (e) {
         window.location.href = "../close.html";
    });
    //初始化数据
    initData();
});

//初始化数量
function initData() {
    // 加载数据
    $$.postJSON(basePath + 'vendLayerTrackGoods/getGoodsInfo', {themeStoreId: storeId, token:
    token}, function(data) {
        if (data.success) {
            //首先创建底部导航
            $$("#deviceTab").html(createTabBarDiv(data.subList));
            //再创建默认导航内容
            //var num = data.subList.length + 1;
            //var content = createTabContent(num);
            //console.log(content);
            //$$("#contentTab").html(content);
            // 加载主机内容
            updateTabContent(1, data.dataList);
            //选中事件
            infoDivSelect();
            //绑定显示事件
            updateTabShowEvent(data.subList);
        }
    });
}

function setSelectedInfoDiv() {
    var info = $$("#tab"+tabIndex).find(".s_info");
    $$.each(info, function(index, element) {
        var lid = $$(element).data("id");
        if (hasSelected(lid)) {
            $$(element).addClass("saved");
        }
    });
}

function hasSelected(lid) {
    var array = layers.split(",");
    for (i in array) {
        if (array[i] == lid) {
            return true;
        }
    }
    return false;
}

function infoDivSelect() {
    // 选中事件
    $$("#tab" + tabIndex).find(".s_info").on('click', function(e) {
        if ($$(this).hasClass("checked")) {
            $$(this).removeClass("checked");
        } else {
            $$(this).addClass("checked");
        }
    });
}

// 生成色块
function createInfoDiv(sid, sno, sname, snum, sprice, isEmpty) {
    var colStyle = isPortrait ? "col-25" : "col-12";
    var s = '<div class="'+colStyle+'">' +
            '<div class="s_info '+isEmpty+'" data-id="'+sid+'">' +
            '<h3>'+sno+'</h3>' +
            '<div class="s_content">' +
            '<p id="name">'+sname+'</p>' +
            '<p id="num">'+snum+'</p>' +
            '<p id="price">'+sprice+'</p>' +
            '</div>' +
            '</div>' +
            '</div>';
    return s;
}

// 生成bar导航
function createTabBarDiv(subList) {
    var s = '<a href="#tab1" class="active tab-link">主机</a>';
    $$.each(subList, function(index, value){
        var name = '';
        if (value.isCabinet == 1) {
            name += '柜' + value.layer;
        } else {
            name += '副' + value.layer;
        }
        s += '<a href="#tab'+(index+2)+'" class="tab-link" data-id="'+value.id+'">'+name+'</a>';
    });
    return s;
}

//切换弹出菜单内容
function updateFloatingAction(isFull) {
    if (isFull == 1) {
        $$("#popoverMenu").attr("data-popover", ".popover-full");
    } else {
        $$("#popoverMenu").attr("data-popover", ".popover-normal");
    }
}

//生成TAB显示事件
function updateTabShowEvent(subList){
    $$("#tab1").on("show", function() {
        updateFloatingAction(0);
        tabIndex = 1;
    });
    $$.each(subList, function(index, value){
        $$("#tab" + (index + 2)).on("show", function() {
            if (value.isCabinet == 1) {
                updateFloatingAction(1);
            } else {
                updateFloatingAction(0);
            }
            if (cabArray[index] != value.layer) {
                getSubCabinetGoods(index + 2, value.id);
                cabArray[index] = value.layer;
            }
            tabIndex = index + 2;
        });
    });
}

function updateTabContent(index, dataList) {
    var columns = isPortrait ? 4 : 8;
    var s = '<div class="content-block">';
    $$.each(dataList, function(index, value){
        //画行头
        s += createInfoTitle('第 ' + (index + 1) + ' 层');
        //画具体内容
        $$.each(value, function(i, v){
            if (i % columns == 0) {
                s += '<div class="row no-gutter">';
            }
            var snum = '' + v.currentInventory + '/' + v.largestInventory;
            var isEmpty = '';
            if (v.goodsName == '' || v.currentInventory == 0) {
                isEmpty = 'empty';
            }
            s += createInfoDiv(v.lid, v.orbitalNo, v.goodsName, snum, v.standardPrice, isEmpty);
            if (i % columns == (columns - 1) || i == value.length - 1) {
                s += '</div>';
             }
        });
        //画行尾
        s += createInfoSplit();
    });
    s += createFixRow();
    s += '</div>';
    $$("#tab" + index).html(s);
}

function createInfoTitle(title) {
    var s = '<div class="s_info_title">'+title+'</div>';
    return s;
}

function createInfoSplit() {
    var s = '<div class="s_info_split"></div>';
    return s;
}

function createFixRow() {
    var s = '<div class="s_info_fix_row"></div>';
    return s;
}

function openNumWin(num) {
    //关闭弹窗
    myApp.closeModal($$("#menu" + num));
    //检查是否己经选中轨道
    var selectedInfo = $$("#tab" + tabIndex).find(".s_info.checked");
    if (selectedInfo.length == 0) {
        myApp.alert("您还未选择轨道。", "提示");
        return;
    }
    //打开选择器
    myApp.pickerModal('.num-picker-info');
    numDivSelect();
}

//获取格子柜，副机商品数据
function getSubCabinetGoods(index, sid) {
    var url = basePath + 'vendLayerTrackGoods/selectSubCabinetGoods';
    var params = {token: token, sid: sid};
    $$.postJSON(url, params, function(data){
        if (data.success) {
            //更新格子柜，副机数据
            if (data.dataList.length == 64) {//更新格子柜
                updateCabinetGoods(index, data.dataList);
            } else if (data.dataList.length == 88) {
                updateCabinetGoods2(index, data.dataList);
            } else {//更新副机数据
                updateTabContent(index, data.dataList);
            }

            //选中事件
            infoDivSelect();
        } else {
            myApp.alert(data.message, "提示");
        }
    });
}

//更新格子柜内容，为减少代码，当前写死64门格子柜。
function updateCabinetGoods(index, dataList) {
    var columns = isPortrait ? 4 : 8;
    var s = '<div class="content-block">';
    var snum = '';
    var isEmpty = '';
    $$.each(dataList, function(index, value){
        if (index < 47) {//前6层
            if (index % 8 == 0) {
                //画行头
                s += createInfoTitle('第 ' + (index/8 + 1) + ' 层');
            }
            //画具体内容
            if (index % columns == 0) {
                s += '<div class="row no-gutter">';
            }
            snum = '' + value.currentInventory + '/' + value.largestInventory;
            if (value.goodsName == '' || value.currentInventory == 0) {
                isEmpty = 'empty';
            } else {
                isEmpty = '';
            }
            s += createInfoDiv(value.lid, value.orbitalNo, value.goodsName, snum, value.standardPrice, isEmpty);
            if (index % columns == (columns - 1) || index == value.length - 1) {
                s += '</div>';
            }
            if (index % 8 == 7) {
                //画行尾
                s += createInfoSplit();
            }
        } else {//后4层
            if (index % 4 == 0) {
                //画行头
                s += createInfoTitle('第' + ((index-48)/4 + 7) + '层');
            }
            //画具体内容
            if (index % 4 == 0) {
                s += '<div class="row no-gutter">';
            }
            snum = '' + value.currentInventory + '/' + value.largestInventory;
            if (value.goodsName == '' || value.currentInventory == 0) {
                isEmpty = 'empty';
            } else {
                isEmpty = '';
            }
            s += createInfoDiv(value.lid, value.orbitalNo, value.goodsName, snum, value
            .standardPrice, isEmpty);
            if (index % 4 == 3) {
                s += '</div>';
            }
            if (index % 4 == 3) {
                //画行尾
                s += createInfoSplit();
            }
        }
    });
    s += createFixRow();
    s += '</div>';
    $$("#tab" + index).html(s);
}

//更新格子柜内容，为减少代码，当前写死88门格子柜。
function updateCabinetGoods2(index, dataList) {
    var columns = isPortrait ? 4 : 8;
    var s = '<div class="content-block">';
    var snum = '';
    var isEmpty = '';
    $$.each(dataList, function(index, value){
        if (index % 8 == 0) {
            //画行头
            s += createInfoTitle('第 ' + (index/8 + 1) + ' 层');
        }
        //画具体内容
        if (index % columns == 0) {
            s += '<div class="row no-gutter">';
        }
        snum = '' + value.currentInventory + '/' + value.largestInventory;
        if (value.goodsName == '' || value.currentInventory == 0) {
            isEmpty = 'empty';
        } else {
            isEmpty = '';
        }
        s += createInfoDiv(value.lid, value.orbitalNo, value.goodsName, snum, value.standardPrice, isEmpty);
        if (index % columns == (columns - 1) || index == value.length - 1) {
            s += '</div>';
        }
        if (index % 8 == 7) {
            //画行尾
            s += createInfoSplit();
        }
    });
    s += createFixRow();
    s += '</div>';
    $$("#tab" + index).html(s);
}

//商品数量选择事件
function numDivSelect() {
    // 选中事件
    $$(".goods-num").on('click', function(e) {
        $$.each($$(".goods-num"), function(index, element){
            $$(element).removeClass("checked");
        });
        $$(this).addClass("checked");
    });
}

//设置数量
function setGoodsNum() {
    var selectNum = $$(".goods-num.checked");
    if (selectNum.length == 1) {
        //选中了一个数量，开始更新数量。
        var num = selectNum[0].children[0].innerText;
        var selectedInfo = $$("#tab" + tabIndex).find(".s_info.checked");
        layers = getSelectIds(selectedInfo);
        var url = basePath + "vendLayerTrackGoods/setGoodsNum";
        var params = {token: token, layerIds: layers, num: num};
        $$.postJSON(url, params, function(data){
            if (data.success) {
                //操作成功, 更新内容。
                updateDivInfo(selectedInfo);
                //选中原轨道
                setSelectedInfoDiv();
            } else {
                myApp.alert(data.message, "提示");
            }
        });
    } else {
        //未选中数量
        myApp.alert("您还未选择商品数量。", "提示");
    }
}

//将选中的轨道ID拼成字符串
function getSelectIds(selectedInfo) {
    var s = '';
    $$.each(selectedInfo, function(index, element) {
        if (index == 0) {
            s += $$(element).data("id");
        } else {
            s += ',' + $$(element).data("id");
        }
        console.log($$(element).data("id"));
    });
    return s;
}

//局部更新信息
function updateDivInfo(selectedInfo) {
    var url = basePath + "vendLayerTrackGoods/getLayerGoods";
    $$.each(selectedInfo, function(index, element){
        var lid = $$(element).data("id");
        var params = {lid: lid};
        $$.postJSON(url, params, function(data){
            if (data.success) {
                var sid = data.sid;
                var sno = data.sno;
                var goodsName = data.goodsName;
                var currentInventory = data.currentInventory;
                var largestInventory = data.largestInventory;
                var price = data.price;
                var c = $$(element).find(".s_content")[0];
                var s = '<p id="name">'+goodsName+'</p>' +
                        '<p id="num">'+currentInventory + "/" + largestInventory +'</p>' +
                        '<p id="price">'+price+'</p>';
                $$(c).html(s);
            } else {
                myApp.alert(data.msg, "提示");
            }
        });
    });
}

function openGoodsWin(num) {
    //关闭弹窗
    myApp.closeModal($$("#menu" + num));
    //检查是否己经选中轨道
    var selectedInfo = $$("#tab" + tabIndex).find(".s_info.checked");
    if (selectedInfo.length == 0) {
        myApp.alert("您还未选择轨道。", "提示");
        return;
    }
    //弹出商品列表
    myApp.popup('.popup-goods');
    //获取商品信息
    var url = basePath + "themeStoreGoodsInfo/queryGoods";
    var params = {token: token, themeStoreId: storeId};
    $$.postJSON(url, params, function(data) {
        if (data.success) {
            var oldLetter = '';
            var s = '';
            var needCloseDiv = false;
            $$.each(data.dataList, function(index, goods){
                var gid = goods.id;
                var goodsName = goods.goodsName;
                var letter = goods.goodsInitials;
                var price = goods.price;
                //输入头部
                if (oldLetter != letter) {
                    if (needCloseDiv) {
                        var tail1 = '</ul></div>';
                        s += tail1;
                        needCloseDiv = false;
                    }
                    var head = '<div class="list-group">' +
                               '<ul>' +
                               '<li class="list-group-title">'+letter+'</li>';
                    s += head;
                    oldLetter = letter;
                    needCloseDiv = true;
                }
                var c = '<li>' +
                        '<div class="item-content">' +
                        '<div class="item-inner goods_item" data-id="'+gid+'">' +
                        '<div class="item-title">'+goodsName+'['+price+'元]'+'</div>' +
                        '</div>' +
                        '</div>' +
                        '</li>';
                s += c;
            });
            if (needCloseDiv) {
                var tail2 = '</ul></div>';
                s += tail2;
                needCloseDiv = false;
            }
            $$("#goodsList").html(s);
            setGoodsSelectedEvent();
        } else {
            myApp.alert(data.message, "提示");
        }
    });
}

function openDoor() {
    //关闭弹窗
    myApp.closeModal($$("#menu1"));
    //检查是否己经选中轨道
    var selectedInfo = $$("#tab" + tabIndex).find(".s_info.checked");
    if (selectedInfo.length == 0) {
        myApp.alert("您还未选择轨道。", "提示");
        return;
    }
    var url = basePath + "vendLayerTrackGoods/openDoor";
    var params = {token: token, trackNos: layers, themeStoreId: storeId};
    myApp.confirm('此操作可能会造成商品丢失，是否确认此操作？', '重要提示',
        function () {
           $$.postJSON(url, params, function(data){
               if (data.success) {
                   myApp.alert("开门指令己发送", "提示");
               } else {
                   myApp.alert(data.message, "提示");
               }
           });
        },
        function () {
           myApp.alert('操作取消', "提示");
        }
    );
}

function openEmptyDoor() {
    //关闭弹窗
    myApp.closeModal($$("#menu1"));
    var url = basePath + "vendLayerTrackGoods/openEmptyDoor";
    //找到当前层
    var sid = $$("#deviceTab").find(".tab-link.active")[0].data("id");
    var params = {token: token, sid: sid, themeStoreId: storeId};
    myApp.confirm('此操作可能会造成商品丢失，是否确认此操作？', '重要提示',
        function () {
           $$.postJSON(url, params, function(data){
               if (data.success) {
                   myApp.alert("开门指令己发送", "提示");
               } else {
                   myApp.alert(data.message, "提示");
               }
           });
        },
        function () {
           myApp.alert('操作取消', "提示");
        }
    );
}

function setGoods(gid) {
    var selectedInfo = $$("#tab" + tabIndex).find(".s_info.checked");
    console.log(selectedInfo);
    layers = getSelectIds(selectedInfo);
    console.log(layers);
    var url = basePath + "vendLayerTrackGoods/setTrackGoods";
    var params = {token: token, layerIds: layers, goodsId: gid};
    $$.postJSON(url, params, function(data){
        if (data.success) {
            //操作成功, 更新内容。
            updateDivInfo(selectedInfo);
            //选中原轨道
            setSelectedInfoDiv();
        } else {
            myApp.alert(data.message, "提示");
        }
    });
}

function setGoodsSelectedEvent() {
    $$(".goods_item").on("click", function() {
        var gid = $$(this).data("id");
        setGoods(gid);
        myApp.closeModal(".popup-goods");
    });
}