var database;

window.onload = function() {
    console.log(global)
    var request = window.indexedDB.open("localData", 1);

    request.onsuccess = function(event) {
        // alert("创建/打开数据库成功。");

        //让数据库 可在任何地方访问
        database = request.result;

        //显示数据库中保存的所有链接
        showLinks();
    };

    request.onerror = function(event) {
        alert("发生错误：" + request.error);
    };

    request.onupgradeneeded = function(event) {
        // alert("第一次创建数据库或者更新数据库。");
        //alert("数据库老版本为：" + event.oldVersion + " 更新后新版本为：" + event.newVersion)

        var db = request.result;
        var objectStore = db.createObjectStore("Links", {
            // keyPath: "locGlobal.key",
            keyPath: "id",
            autoIncrement: true
        });
    }
};

function addLink() {
    // var request = dbObject.db.transaction(dbObject.db_store_name, "readwrite").objectStore(dbObject.db_store_name).clear();

    var transaction = database.transaction(["Links"], "readwrite");
    var objectStore = transaction.objectStore("Links");
    var request = objectStore.clear();
    request.onsuccess = function() {
        console.log('清除成功');
    }

    //获取数据(逐条)
    // var orderNumber = 'name';
    // var diameter = "url";
    // var graphical = "description";
    // var length = "description";
    // var branches = "description";
    // var detailsKey = "description";
    // var detailsValue = "description";
    // var linkRecord = new LinkRecord(orderNumber, diameter, graphical, length, branches, detailsKey, detailsValue);

    // 获取数据(整体)
    var locGlobal = global;
    var linkRecord = new LinkRecord(locGlobal);

    var transaction = database.transaction(["Links"], "readwrite");
    var objectStore = transaction.objectStore("Links");

    var request = objectStore.put(linkRecord);
    request.onerror = function(event) {
        alert("发生错误：" + request.error);
    };

    request.onsuccess = function(event) {
        // alert("添加链接成功");

        //显示数据库中保存的所有链接
        // showLinks();
    };
}

function showLinks() {
    var transaction = database.transaction(["Links"], "readonly");
    var objectStore = transaction.objectStore("Links");

    var request = objectStore.openCursor();

    request.onerror = function(event) {
        alert("发生错误：" + request.error);
    };

    //要在页面上显示的字符串
    var markupToInsert = "";

    request.onsuccess = function(event) {
        //创建一个游标
        var cursor = event.target.result;

        //根据游标判断是否有数据
        if (cursor) {
            printGlobal = cursor.value;

            //调用cursor.continue()方法访问下一条数据
            //当游标到达下一条数据时，onsuccess事件会再一次触发
            cursor.continue();
        } else {
            ////如果一个结果也没有，说明游标到底了，输出信息
            console.log(printGlobal.locGlobal.length);
            var appendStr = ""; //tbody内总DOM
            var appendStr2 = ""; //tbody内总DOM
            var appendStrAll = ""; //tbody内总DOM
            var specStr = ""; //总和DOM
            var dotitem = ""; //图形数字细节DOM
            var dotStr = ""; //图形数字细节DOM
            var specSum = 0; //
            var specItem; //
            var coefficient = 0; //系数
            for (var i = 0; i < printGlobal.locGlobal.length; i++) {
                for (var j = 0; j < printGlobal.locGlobal[i].detailsKey.length; j++) {
                    dotitem = "<input class='" + printGlobal.locGlobal[i].detailsKey[j] + "' type='text' disabled value='" + printGlobal.locGlobal[i].detailsValue[j] + "'>"
                    dotStr += dotitem;
                }

                var diameter1 = printGlobal.locGlobal[i].diameter;
                var diameter2 = i + 1 < printGlobal.locGlobal.length ? printGlobal.locGlobal[i + 1].diameter : '';
                switch (Number(diameter1)) {
                    case 6:
                        coefficient = 0.4;
                        break;
                    case 8:
                        coefficient = 0.45;
                        break;
                    case 10:
                        coefficient = 0.4; //特殊
                        break;
                    case 12:
                        coefficient = 0.888;
                        break;
                    case 14:
                        coefficient = 1.21;
                        break;
                    case 16:
                        coefficient = 1.58;
                        break;
                    case 18:
                        coefficient = 2;
                        break;
                    case 20:
                        coefficient = 2.47;
                        break;
                    case 22:
                        coefficient = 2.99;
                        break;
                    case 25:
                        coefficient = 3.86;
                        break;
                    default:
                        break;
                }
                specItem = (printGlobal.locGlobal[i].length * 1) * (printGlobal.locGlobal[i].branches * 1);
                specSum = specSum + coefficient * specItem;
                appendStr2 = "<tr ><td colspan=5>直径为" + diameter1 + "的重量为" + coefficient + "米*" + specItem + "公斤=" + specSum + "公斤</td></tr>";

                // 拼接数据DOM
                appendStr = "<tr><td class = 'diameter'>" + printGlobal.locGlobal[i].diameter +
                    "</td><td class = 'graph'><div><img src='./images/" + printGlobal.locGlobal[i].graphical +
                    ".jpg'>" + dotStr + "</div></td><td class = 'length'>" + printGlobal.locGlobal[i].length +
                    "</td><td class = 'branches'>" + printGlobal.locGlobal[i].branches +
                    "</td></tr>"

                if (Number(diameter1) !== Number(diameter2) && printGlobal.locGlobal.length > 2) { //如果直径改变，执行
                    console.log(coefficient, specItem, specSum);
                    specSum = 0;
                    $('.list-left tbody').append(appendStr + appendStr2);
                } else {

                    $('.list-left tbody').append(appendStr);
                }
                // if (i % 2 == 0) {
                // } else {
                //     $('.list-right tbody').append(appendStr);
                // }

                dotitem = '';
                dotStr = '';
                console.log("数据结束");
            }
            //显示数据
            // var resultsElement = document.getElementById("links");
            // resultsElement.innerHTML = markupToInsert;
        }
    };
}

function getLinkDetails(element) {
    var url = element.getAttribute("data-url");

    var transaction = database.transaction(["Links"], "readonly");
    var objectStore = transaction.objectStore("Links");

    var request = objectStore.get(url);

    request.onerror = function(event) {
        alert("发生错误：" + request.error);
    };

    request.onsuccess = function(event) {
        alert("数据获取成功");
        var linkRecord = request.result;

        var resultsElement = document.getElementById("linkDetails");
        resultsElement.innerHTML = "<b>" + linkRecord.name + "</b><br>" +
            "<b>URL:</b> " + linkRecord.url + "<br>" +
            "<b>描述:</b> " + linkRecord.description;
    }
}

function deleteLink(element) {
    // var url = element.getAttribute("data-url");

    var transaction = database.transaction(["Links"], "readwrite");
    var objectStore = transaction.objectStore("Links");

    var request = objectStore.delete(element);

    request.onerror = function(event) {
        alert("发生错误：" + request.error);
    };

    request.onsuccess = function(event) {
        alert("删除成功");

        //显示数据库中保存的所有链接
        // showLinks();
    }
}

// function LinkRecord(orderNumber, diameter, graphical, length, branches, detailsKey, detailsValue) {
//     this.orderNumber = orderNumber;
//     this.diameter = diameter;
//     this.graphical = graphical;
//     this.length = length;
//     this.branches = branches;
//     this.detailsKey = detailsKey;
//     this.detailsValue = detailsValue;
// }
function LinkRecord(locGlobal) {
    this.locGlobal = locGlobal;
}