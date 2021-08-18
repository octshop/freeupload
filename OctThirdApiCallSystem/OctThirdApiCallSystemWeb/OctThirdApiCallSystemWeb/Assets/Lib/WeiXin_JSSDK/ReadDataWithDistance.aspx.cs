//using System;
//using System.Collections.Generic;
//using System.Linq;
//using System.Web;
//using System.Web.UI;
//using System.Web.UI.WebControls;

//using System.Data;
//using System.Data.SqlClient;
//using SQLServerDAL;

//public partial class WeiXin_JSSDK_ReadDataWithDistance : System.Web.UI.Page
//{
//    protected void Page_Load(object sender, EventArgs e)
//    {
//        //调用存储过程 (单位“千米”利用的是百度地图坐标)<br />计算两个百度坐标点之间的距离，然后根据距离远近排序，
//        //并且可指定排序方式及表，查询条件，读取的记录数
//        SqlParameter[] parametersDis =
//        {
//            new SqlParameter("@TopNum",SqlDbType.Int),
//            new SqlParameter("@tableName",SqlDbType.NVarChar,50),
//            new SqlParameter("@isCheck",SqlDbType.NVarChar,50),
//            new SqlParameter("@orderType",SqlDbType.NVarChar,50),
//            new SqlParameter("@lat",SqlDbType.NVarChar,50),
//            new SqlParameter("@lng",SqlDbType.NVarChar,50)
//        };
//        parametersDis[0].Value = 10;
//        parametersDis[1].Value = "ShopLocation";
//        parametersDis[2].Value = "ShopName LIKE '%aa%'";
//        parametersDis[3].Value = "ASC";
//        parametersDis[4].Value = "28.190687"; //纬度
//        parametersDis[5].Value = "113.045153"; //经度
//        //执行存储过程
//        DataSet DsSel = SQLHelper.RunProcedure("SelectTopWithDistanceOrder", parametersDis, "DsSel");

//        //构造前台显示代码
//        string strXhtml = "距离(千米) | 店铺ID | 店铺名称 | 纬度 | 经度 | 写入时间 | 排序字段 <br /><br />";
//        for (int i = 0; i < DsSel.Tables[0].Rows.Count; i++)
//        {
//            strXhtml += DsSel.Tables[0].Rows[i][0].ToString().Trim() + " | ";
//            strXhtml += DsSel.Tables[0].Rows[i][1].ToString().Trim() + " | ";
//            strXhtml += DsSel.Tables[0].Rows[i][2].ToString().Trim() + " | ";
//            strXhtml += DsSel.Tables[0].Rows[i][3].ToString().Trim() + " | ";
//            strXhtml += DsSel.Tables[0].Rows[i][4].ToString().Trim() + " | ";
//            strXhtml += DsSel.Tables[0].Rows[i][5].ToString().Trim() + " | ";
//            strXhtml += DsSel.Tables[0].Rows[i][6].ToString().Trim() + " <br /><br /> ";
//        }
//        //显示代码插入前台
//        showShopListContent.InnerHtml = strXhtml;


//        //【数据排序分页_存储过程】——(单位“千米”利用的是百度地图坐标)<br />计算两个百度坐标点之间的距离，然后根据距离远近排序，并且可指定排序方式及表，查询条件
//        SqlParameter[] parametersDisDp =
//       {
//            new SqlParameter("@tableName",SqlDbType.NVarChar,50),
//            new SqlParameter("@pagesize",SqlDbType.Int),
//            new SqlParameter("@pageindex",SqlDbType.Int),
//            new SqlParameter("@orderfield",SqlDbType.NVarChar,20),
//            new SqlParameter("@ordertype",SqlDbType.NVarChar,5),
//            new SqlParameter("@where",SqlDbType.NVarChar,2000),
//            new SqlParameter("@lat",SqlDbType.NVarChar,50),
//            new SqlParameter("@lng",SqlDbType.NVarChar,50),
//            new SqlParameter("@otherwhere",SqlDbType.NVarChar,2000)
//        };
//        parametersDisDp[0].Value = "ShopLocation";
//        parametersDisDp[1].Value = "10";
//        parametersDisDp[2].Value = "1";
//        parametersDisDp[3].Value = "distance";
//        parametersDisDp[4].Value = "ASC";
//        parametersDisDp[5].Value = "ShopName LIKE '%aa%'";
//        parametersDisDp[6].Value = "28.190687";
//        parametersDisDp[7].Value = "113.045153";
//        parametersDisDp[8].Value = "distance<1";
//        //执行存储过程
//        DataSet DsDp = SQLHelper.RunProcedure("DataPage_WithDistance", parametersDisDp, "DsDp");

//        //构造前台显示代码
//        string strXhtmlDp = "距离(千米) | 店铺ID | 店铺名称 | 纬度 | 经度 | 写入时间 | 排序字段 <br /><br />";
//        for (int j = 0; j < DsDp.Tables[0].Rows.Count; j++)
//        {
//            strXhtmlDp += DsDp.Tables[0].Rows[j][0].ToString().Trim() + " | ";
//            strXhtmlDp += DsDp.Tables[0].Rows[j][1].ToString().Trim() + " | ";
//            strXhtmlDp += DsDp.Tables[0].Rows[j][2].ToString().Trim() + " | ";
//            strXhtmlDp += DsDp.Tables[0].Rows[j][3].ToString().Trim() + " | ";
//            strXhtmlDp += DsDp.Tables[0].Rows[j][4].ToString().Trim() + " | ";
//            strXhtmlDp += DsDp.Tables[0].Rows[j][5].ToString().Trim() + " | ";
//            strXhtmlDp += DsDp.Tables[0].Rows[j][6].ToString().Trim() + " <br /><br /> ";
//        }
//        //显示代码插入前台
//        showShopListDistance.InnerHtml = strXhtmlDp;

//    }
//}