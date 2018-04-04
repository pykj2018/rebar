var global = [];
var resultGlobal = []; //插入计算总和数组
var deepCopyGlobal; //拷贝数组
var endGlobal = []; //缓存数组
var merge = false; //是否点击合并

// var orderNumber = global.length;
$(document).ready(function() {
    // // 页面加载完，清楚indexDB
    // clearLink();

    // 测试命令，上线删除
    // $(".all-c input").val('2');

    merge = false;
    // 图形选择显示逻辑
    $("#select").click(function() {
        $(".all-c-wrap").toggleClass('on').removeClass('active').find('input').hide();
    });
    $('.all-c-wrap').click(function() {
        $('.all-c-wrap').removeClass('on');
        $(this).addClass('active').siblings().removeClass('active');
        $(this).find('input').show();
        $('#select span').text($(this).index() + 1);
    })

    // 确定按钮
    $('.confirm').click(function() {

        var strBranches = $(".entering p input[name=branches]").val();
        var strActiveSize = $(".commponent-wrap .active input").size();
        var strSelect = $("#select span").text();
        var reg = /^[0-9]+.?[0-9]*$/;
        if (!reg.test(strSelect)) {
            alert("请选择图形！");
            return;
        }
        for (var i = 0; i < strActiveSize; i++) {
            var strActiveVal = $(".commponent-wrap .active input").eq(i).val();
            if (strActiveVal == null || strActiveVal == '') {
                alert("请完整填写图形内数字！");
                return;
            }
        }
        if (strBranches == null || strBranches == '') {
            alert("条数不能为空！");
            return;
        }

        var len = $('.active input').size(); //input长度

        calculate(len); //调用计算开料长度
        keyArr(len); //调用input类名数组函数
        valArr(len); //调用input值数组函数
        // orderNumber++;
        var equal = global.findIndex(checkIndex); //与现有数组中相同的第一项的index值
        // console.log(global.findIndex(checkIndex));

        function checkIndex(globalItem) {
            if (globalItem.diameter == $('select[name=diameter]').find("option:selected").text() &&
                globalItem.graphical == $('#select span').text() &&
                globalItem.detailsValue.equals(valArr(len))
                // globalItem.diameter == 10 ? globalItem.coefficient == Number($('input[name=magnitude]').val()) : true
            ) {
                // console.log(globalItem.detailsValue,valArr(len));
                // console.log(globalItem.detailsValue.equals(valArr(len)));
                return globalItem;
            }
        }

        switch (Number($('select[name=diameter]').find("option:selected").text())) {
            case 6:
                coefficient = 0.4;
                break;
            case 8:
                coefficient = 0.45;
                break;
            case 10:
                coefficient = Number($('input[name=magnitude]').val()) > 0 ? Number($('input[name=magnitude]').val()) : 0; //特殊
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

        // 存储数据，调用遍历
        global.push({
            // 'orderNumber': $('input[name=orderNumber]').val(),
            'orderNumber': '',
            'diameter': Number($('select[name=diameter]').find("option:selected").text()),
            'graphical': Number($('#select span').text()),
            'length': Number($('input[name=length]').val()),
            'branches': Number($('input[name=branches]').val()),
            'coefficient': coefficient,
            'detailsKey': keyArr(len), //图形内数值数组
            'detailsValue': valArr(len), //图形内数值数组
            'weight': Math.round($('input[name=length]').val() * $('input[name=branches]').val() * coefficient) * 100 / 100,
            'equal': equal
        })

        // console.log(global);

        // 录入区序号值
        $('input[name=orderNumber]').val(global.length + 1);

        render();
        // addLink();
    })

});


if (Array.prototype.equals)
    console.warn("Overriding existing Array.prototype.equals. Possible causes: New API defines the method, there's a framework conflict or you've got double inclusions in your code.");
Array.prototype.equals = function(array) {
    if (!array)
        return false;
    if (this.length != array.length)
        return false;
    for (var i = 0, l = this.length; i < l; i++) {
        if (this[i] instanceof Array && array[i] instanceof Array) {
            if (!this[i].equals(array[i]))
                return false;
        } else if (this[i] != array[i]) {
            return false;
        }
    }
    return true;
}

Object.defineProperty(Array.prototype, "equals", { enumerable: false });

// 渲染列表
function render() {
    $('.list tbody').empty();
    var dotitem = ""; //图形数字细节DOM
    var dotStr = ""; //图形数字细节DOM
    for (var i = 0; i < global.length; i++) {

        // 按照直径排序
        // global.sort(up);

        // 列表序号重新计算赋值
        // if (global[i].orderNumber !== i + 1) {}
        global[i].orderNumber = i + 1;

        // 写入数值定位DOM input
        for (var j = 0; j < global[i].detailsKey.length; j++) {
            dotitem = "<input class='" + global[i].detailsKey[j] + "' type='text' disabled value='" + global[i].detailsValue[j] + "'>"
            dotStr += dotitem;
        }

        // 拼接数据DOM
        $('.list tbody').append("<tr><td class='orderNumber'>" + global[i].orderNumber +
            "</td><td class = 'diameter'>" + global[i].diameter +
            "</td><td class = 'graph'><div class='image'><img src='./images/" + global[i].graphical +
            ".jpg'>" + dotStr + "</div></td><td class = 'length'>" + global[i].length +
            "</td><td class = 'branches'>" + global[i].branches +
            "</td><td class='del'><input type='button' value='删除' onclick = 'del($(this))' ></td></tr>");
        dotitem = '';
        dotStr = '';
    }

}
// 计算开料长度方法
function calculate(e) {
    var sum = 0; //input内总和
    for (var i = 0; i < e; i++) {
        sum += (Number($('.active input').eq(i).val()) * 100) / 100;
    }
    $('input[name=length]').val(sum);
}

//key值数组
function keyArr(e) {
    var keyArr = [];
    for (var i = 0; i < e; i++) {
        keyArr.push($('.active input').eq(i).attr('class'));
    }
    return keyArr;
}

// value值数组
function valArr(e) {
    var valArr = [];
    for (var i = 0; i < e; i++) {
        valArr.push($('.active input').eq(i).val());
    }
    return valArr;
}
$('.merge').click(function() {
    endGlobal = [];
    merge = true;
    deepCopyGlobal = JSON.parse(JSON.stringify(global)); //深度拷贝
    for (var i = 0; i < global.length; i++) {
        if (deepCopyGlobal[i].equal !== -1) {
            deepCopyGlobal[deepCopyGlobal[i].equal].branches += deepCopyGlobal[i].branches;
        } else if (deepCopyGlobal[i].equal == -1) {
            endGlobal.push(deepCopyGlobal[i]);
        }
    }
    // console.table(global);
    // console.table(endGlobal);
    // alert("合并完成！");
})

$('.toprint').click(function() {
    if (merge) {
        // console.log('endGlobal')
        window.localStorage.data = null;
        window.localStorage.data = JSON.stringify(endGlobal.sort(up));
        merge = false;
    } else {
        // console.log('global')
        window.localStorage.data = null;
        window.localStorage.data = JSON.stringify(global.sort(up));
    }

    //数据存入缓存，并清空结果数组
    // window.localStorage.data = null;
    // window.localStorage.data = JSON.stringify(global);
    resultGlobal = [];

    window.open("./print.html");

})

//按升序排列
function up(x, y) {
    return x.diameter - y.diameter
}

//按降序排列
function down(x, y) {
    return y.diameter - x.diameter
}

// 删除元素
function del(is) {
    global.splice(is.parents('tr').index(), 1);
    render();
}

// 打印函数
function m_print() {
    window.print();
}