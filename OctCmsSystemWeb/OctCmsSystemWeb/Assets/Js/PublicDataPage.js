//===============数据分页公共脚本=========================//

/**-----定义公共变量------**/


/**------初始化------**/
$(function () {


});



/**------自定义函数------**/


/**
 * 将两个对象拼接在一起 如：var object1 = {"UserID":"huang"}; var object2={"Pwd":"1111"}  --> {"UserID":"huang","Pwd":"1111"}
 * @param {any} object 被拼接的object对象
 * @param {any} objectAdd 要添加进去的object对象
 * @returns  返回值:返回拼接后的Object
 */
function pushTwoObject(object, objectAdd) {
    var data = object
    data.push = function (o) {
        //如果o是object  
        if (typeof (o) == 'object') for (var p in o) this[p] = o[p];
    };

    var data1 = objectAdd;

    data.push(data1)

    //alert(data.UserID + "|" + data1.Pwd);
    return data;
}


