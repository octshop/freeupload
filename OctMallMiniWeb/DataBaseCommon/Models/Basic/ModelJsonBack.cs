using Newtonsoft.Json;
using System.Collections.Generic;

/// <summary>
/// 【Api请求返回Json对象,并生成Json字符串】的实体类
/// </summary>
/// <example>
/// 生成的Json字符串：{"Code":"2012","Msg":"添加成功了","ErrCode":null,"ErrMsg":null,"DataDic":{"Nax":"11111","Huawei":"6000"},"DataListDic":[{"Name":"小黄人_0","Age":"30_0"},{"Name":"小黄人_1","Age":"30_1"}],"DataDicExtra":null,"DataListDicExtra":null}
/// 
/// 调用方法如下：
///  ModelJsonBack _modelJsonBack = new ModelJsonBack();
//List<Dictionary<string, object>> _listDic = new List<Dictionary<string, object>>();
//            for (int i = 0; i< 2; i++)
//            {
//                Dictionary<string, object> _dic = new Dictionary<string, object>();
//                 _dic.Add("Name", "小黄人_" + i);
//                _dic.Add("Age", "30_" + i);
//                _listDic.Add(_dic);
//            }
//            _modelJsonBack.DataListDic = _listDic;

//            Dictionary<string, object> _dic2 = new Dictionary<string, object>();
//            _dic2.Add("Nax", "11111");
//            _dic2.Add("Huawei", "6000");
//            _modelJsonBack.DataDic = _dic2;


//            _modelJsonBack.Code = "2012";
//            _modelJsonBack.Msg = "添加成功了";

//            string _json = PublicClassNS.PublicClass.ConvertModelToJson(_modelJsonBack);
/// </example>
public class ModelJsonBack
{
    /// <summary>
    /// 构造函数
    /// </summary>
    public ModelJsonBack()
    {

    }

    //*************************************

    //正常系统返回代码
    public string Code { get; set; }
    //正常系统中文提示信息
    public string Msg { get; set; }
    //错误系统返回代码
    public string ErrCode { get; set; }
    //错误系统中文提示信息
    public string ErrMsg { get; set; }

    //*************************************

    //Json对象 "DataDic":{"Nax":"11111","Huawei":"6000"},
    public Dictionary<string, object> DataDic { get; set; }
    //Json数组 "DataListDic":[{"Name":"小黄人_0","Age":"30_0"},{"Name":"小黄人_1","Age":"30_1"}],
    public List<Dictionary<string, object>> DataListDic { get; set; }

    public Dictionary<string, object> DataDicExtra { get; set; }
    public List<Dictionary<string, object>> DataListDicExtra { get; set; }



    /// <summary>
    /// 将ModelJsonBack对象转换成 Json字符串
    /// </summary>
    /// <param name="pModelJsonBack">Json对象实体类</param>
    /// <returns></returns>
    public static string convertModelToJson(ModelJsonBack pModelJsonBack)
    {
        //JavaScriptSerializer serializer = new JavaScriptSerializer();
        //return serializer.Serialize(pModelJsonBack);

        return JsonConvert.SerializeObject(pModelJsonBack);
    }

    /// <summary>
    /// 将Json字符串 转换成 ModelJsonBack对象
    /// </summary>
    /// <param name="pJsonBackString">Json字符串</param>
    /// <returns></returns>
    public static ModelJsonBack convertJsonToModel(string pJsonBackString)
    {
        ModelJsonBack _modelJsonBack = new ModelJsonBack();
        _modelJsonBack = JsonConvert.DeserializeObject<ModelJsonBack>(pJsonBackString);

        //返回实体类对象
        return _modelJsonBack;
    }


}

