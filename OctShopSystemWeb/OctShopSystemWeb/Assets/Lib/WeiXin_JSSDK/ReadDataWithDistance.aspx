<%@ Page Language="C#" AutoEventWireup="true" CodeFile="ReadDataWithDistance.aspx.cs" Inherits="WeiXin_JSSDK_ReadDataWithDistance" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title>利用带地理经度、纬度计算的存储过程，来读取数据库中的数据</title>
</head>
<body>
    <form id="form1" runat="server">
    <div>
          <h1>【存储过程】(单位“千米”利用的是百度地图坐标)<br />计算两个百度坐标点之间的距离，然后根据距离远近排序，并且可指定排序方式及表，查询条件，读取的记录数</h1>
        <div id="showShopListContent" runat="server">

        </div>


         <h1>【数据排序分页_存储过程】——(单位“千米”利用的是百度地图坐标)<br />计算两个百度坐标点之间的距离，然后根据距离远近排序，并且可指定排序方式及表，查询条件</h1>
        <div id="showShopListDistance" runat="server">

        </div>


    </div>
    </form>
</body>
</html>
