var global = [];
var printGlobal;
// var orderNumber = global.length;
$(document).ready(function() {
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
        // var strBranches = $(".entering p input[name=branches]").val();
        // var strActiveSize = $(".commponent-wrap .active input").size();
        // var strSelect = $("#select span").text();
        // var reg = /^[0-9]+.?[0-9]*$/;
        // if (!reg.test(strSelect)) {
        //     alert("请选择图形！");
        //     return;
        // }
        // for (var i = 0; i < strActiveSize; i++) {
        //     var strActiveVal = $(".commponent-wrap .active input").eq(i).val();
        //     if (strActiveVal == null || strActiveVal == '') {
        //         alert("请完整填写图形内数字！");
        //         return;
        //     }
        // }
        // if (strBranches == null || strBranches == '') {
        //     alert("条数不能为空！");
        //     return;
        // }

        var len = $('.active input').size(); //input长度
        calculate(len); //调用计算开料长度
        keyArr(len); //调用input类名数组函数
        valArr(len); //调用input值数组函数
        // orderNumber++;

        // 存储数据，调用遍历
        global.push({
            // 'orderNumber': $('input[name=orderNumber]').val(),
            'orderNumber': '',
            'diameter': $('select[name=diameter]').find("option:selected").text(),
            'graphical': $('#select span').text(),
            'length': $('input[name=length]').val(),
            'branches': $('input[name=branches]').val(),
            'detailsKey': keyArr(len), //图形内数值数组
            'detailsValue': valArr(len), //图形内数值数组
        })

        // 录入区序号值
        $('input[name=orderNumber]').val(global.length + 1);

        render();
        addLink();
    })

});

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

// 渲染列表
function render() {
    $('.list tbody').empty();
    var dotitem = ""; //图形数字细节DOM
    var dotStr = ""; //图形数字细节DOM
    for (var i = 0; i < global.length; i++) {

        // 按照直径排序
        global.sort(up);

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
            "</td><td class = 'graph'><div><img src='./images/" + global[i].graphical +
            ".jpg'>" + dotStr + "</div></td><td class = 'length'>" + global[i].length +
            "</td><td class = 'branches'>" + global[i].branches +
            "</td><td class='del'><input type='button' value='删除' onclick = 'del($(this))' ></td></tr>");
        dotitem = '';
        dotStr = '';
    }

}

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