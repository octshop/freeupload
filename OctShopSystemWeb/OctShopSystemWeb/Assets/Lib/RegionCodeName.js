/*-----------------Select2插件专用  选择地方，省级-城市-区县-三级联动JS-------------------------*/

/**
 * 公共变量
 */
var data = "";


/**
 * 初始化
 */
$(function () {

    //读取Json文件
    //loadJsonFile();

});

/**
 * 加载读取Json文件
 * @param {any} pCallBack 加载成功后的回调函数
 */
function initLoadJsonFile(pCallBack) {
    $.getJSON("../../Assets/Data/RegionNameCode.json", function (dataBack) {
        data = dataBack;
        console.log("区域Json文件加载成功");

        pCallBack();
        
    });
}

/**
 * 初始化省市县区域范围值
 * */
function initRegionCodeName() {
    $.getJSON("../../Assets/Data/RegionNameCode.json", function (dataBack) {
        data = dataBack;
        console.log("区域Json文件加载成功");

        //所有的初始化工作要在这里操作

        //初始化下拉列表
        initSelect2ProvinceValue();

        //初始化当前的 省份，城市，区县 值
        //setInitAreaValue("430000", "430200", "430281");

        //得到省份列表
        //getProVinceItems();
        //得到省份下的城市列表
        //getProvinceSubCityItems("430000");
        //得到 指定 REGIONCODE 值的省,市，县信息
        //getProvinceCityCountryByRegionCode("430200");
    });
}

/**
 * 初始化省市县区域范围值 带默认值
 * @param {any} pProvinceRegionCode 省的代号 
 * @param {any} pCityRegionCode 市的代号
 * @param {any} pCountryRegionCode 区县的代号
 */
function initRegionCodeNameDefaultVal(pProvinceRegionCode, pCityRegionCode, pCountryRegionCode) {
    $.getJSON("../../Assets/Data/RegionNameCode.json", function (dataBack) {
        data = dataBack;
        console.log("区域Json文件加载成功");

        //所有的初始化工作要在这里操作

        //初始化下拉列表
        //initSelect2ProvinceValue();

        //初始化当前的 省份，城市，区县 值
        setInitAreaValue(pProvinceRegionCode, pCityRegionCode, pCountryRegionCode);

        //得到省份列表
        //getProVinceItems();
        //得到省份下的城市列表
        //getProvinceSubCityItems("430000");
        //得到 指定 REGIONCODE 值的省,市，县信息
        //getProvinceCityCountryByRegionCode("430200");
    })
}


/**
 * 读取Json文件
 */
function loadJsonFile() {

    $.getJSON("../../Assets/Data/RegionNameCode.json", function (dataBack) {
        data = dataBack;
        console.log("区域Json文件加载成功");

        //所有的初始化工作要在这里操作

        //初始化下拉列表
        //initSelect2ProvinceValue();

        //初始化当前的 省份，城市，区县 值
        //setInitAreaValue("430000", "430200", "430281");

        //得到省份列表
        //getProVinceItems();
        //得到省份下的城市列表
        //getProvinceSubCityItems("430000");
        //得到 指定 REGIONCODE 值的省,市，县信息
        //getProvinceCityCountryByRegionCode("430200");

    })
}

//----------------三级联动 Select 的业务逻辑 ---------------//


/**
 * 初始化下拉表值 没有初始化值
 */
function initSelect2ProvinceValue() {

    var region_province = document.getElementById("region_province");

    region_province.appendChild(new Option("请选择...", ""));
    region_city.appendChild(new Option("请选择...", ""));
    region_county.appendChild(new Option("请选择...", ""));

    //得到所有省份列表对象
    var _proRegion = getProVinceItems();

    for (i = 0; i < _proRegion.length; i++) {

        region_province.appendChild(new Option(_proRegion[i].REGIONNAME, _proRegion[i].REGIONCODE));

    }
    //region_province.appendChild(new Option("2121212", "121212"));

    $("#region_province").change(function () {
        //加载城市列表 
        onProvinceChange();
    });
    $("#region_city").change(function () {
        //加载区县列表
        onCityChange();
    });
}

/**
 * 初始化当前的 省份，城市，区县 值
 * @param {any} pProviceCodeValue 省份值代号
 * @param {any} pCityCodeValue 城市值代号
 * @param {any} pCountyValue 区县值代号
 */
function setInitAreaValue(pProviceCodeValue, pCityCodeValue, pCountyValue) {

    //初始化下拉表值，加载省份
    initSelect2ProvinceValue();

    //省份
    $("#region_province").find("option[value='" + pProviceCodeValue + "']").attr("selected", true);
    //加载城市列表 
    onProvinceChange();

    //城市
    $("#region_city").find("option[value='" + pCityCodeValue + "']").attr("selected", true);
    //加载区县列表
    onCityChange();

    //区县
    $("#region_county").find("option[value='" + pCountyValue + "']").attr("selected", true);
}

/**
 * 当省份改变时，加载城市列表
 * @param {any} obj onProvinceChange(this)
 */
function onProvinceChange(obj) {

    if (obj == undefined || obj == "") {
        obj = document.getElementById("region_province");
    }

    var ids = obj.id.split("_");
    var citySelect = document.getElementById(ids[0] + "_city");
    citySelect.length = 0;
    citySelect.options.add(new Option("请选择...", ""));
    if (obj.value != "0") {

        //得到指定省份的城市列表值 REGIONCODE,PCODE,REGIONNAME
        var _dataCitys = getProvinceSubCityItems(obj.value);
        //循环添加
        for (var j = 0; j < _dataCitys.length; j++) {
            citySelect.options.add(new Option(_dataCitys[j].REGIONNAME, _dataCitys[j].REGIONCODE));
        }
    }
    var countySelect = document.getElementById(ids[0] + "_county");
    countySelect.length = 0;
    countySelect.options.add(new Option("请选择...", ""));
}

/**
 * 当城市改变时，加载区县列表
 * @param {any} obj  onCityChange(this)
 */
function onCityChange(obj) {

    if (obj == undefined || obj == "") {
        obj = document.getElementById("region_city");
    }

    var ids = obj.id.split("_");
    var countySelect = document.getElementById(ids[0] + "_county");
    countySelect.length = 0;
    countySelect.options.add(new Option("请选择...", ""));
    if (obj.value != "0") {

        //加载城市下的区县值
        var _dataCountry = getCitySubCountiesItems(obj.value);
        for (var k = 0; k < _dataCountry.length; k++) {
            countySelect.options.add(new Option(_dataCountry[k].REGIONNAME, _dataCountry[k].REGIONCODE));
        }
    }

}


//------------ 得到，省份，城市，区县 列表值 ------------------//

/**
 * 得到所有省份的列表值 REGIONCODE,PCODE,REGIONNAME
 * @returns 返回对象列表
 */
function getProVinceItems() {

    var dataBack = [];

    for (var i = 0; i < data.length; i++) {
        if (data[i].PCODE == "") {
            dataBack.push({ "REGIONCODE": data[i].REGIONCODE, "PCODE": data[i].PCODE, "REGIONNAME": data[i].REGIONNAME });
        }
    }

    //console.log(dataBack);
    return dataBack;
}

/**
 * 得到 得到指定省份下，城市的列表值 REGIONCODE,PCODE,REGIONNAME
 * @param {any} pProvinceCode 省份的 RegionCode值
 * @returns 返回对象列表
 */
function getProvinceSubCityItems(pProvinceCode) {
    var dataBack = [];

    for (var i = 0; i < data.length; i++) {
        if (data[i].PCODE == pProvinceCode) {
            dataBack.push({ "REGIONCODE": data[i].REGIONCODE, "PCODE": data[i].PCODE, "REGIONNAME": data[i].REGIONNAME });
        }
    }
    //console.log(dataBack);
    return dataBack;
}

/**
 * 得到指定城市下，县区列表值 REGIONCODE,PCODE,REGIONNAME
 * @param {any} pCityCode 城市的 RegionCode值
 */
function getCitySubCountiesItems(pCityCode) {
    var dataBack = [];

    for (var i = 0; i < data.length; i++) {
        if (data[i].PCODE == pCityCode) {
            dataBack.push({ "REGIONCODE": data[i].REGIONCODE, "PCODE": data[i].PCODE, "REGIONNAME": data[i].REGIONNAME });
        }
    }
    //console.log(dataBack);
    return dataBack;
}


//-------------- 查询具体的省，市，区县值 --------------------//

/**
 * 得到 指定 REGIONCODE 值的省,市，县信息 REGIONCODE,PCODE,REGIONNAME
 * @param {any} pRegionCode 行政代号 值 REGIONCODE
 */
function getProvinceCityCountryByRegionCode(pRegionCode) {

    var dataBack = [];

    for (var i = 0; i < data.length; i++) {
        if (data[i].REGIONCODE == pRegionCode) {
            dataBack.push({ "REGIONCODE": data[i].REGIONCODE, "PCODE": data[i].PCODE, "REGIONNAME": data[i].REGIONNAME });
        }
    }
    console.log(dataBack);
    return dataBack;

}