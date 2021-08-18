<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="CropZoom.aspx.cs" Inherits="QhMall.PubWeb.CropZoom.CropZoom" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta name="viewport" content="width=1400" />

    <title>上传图片裁剪</title>

    <link href="jquery-ui-1.10.3.custom.min.css" rel="stylesheet" />
    <link href="jquery.cropzoom.css" rel="stylesheet" />
    <link href="CropZoom.css" rel="stylesheet" />

    <script src="jquery-1.9.1.min.js"></script>
    <script src="jquery-ui-1.10.3.js"></script>
    <script src="jquery.cropzoom.js"></script>
    <script src="CropZoom.js"></script>

</head>
<body>
    <form id="form1" runat="server">


        <!--============隐藏控件记录================-->

        <!--剪裁预览图片的大小-->
        <input type="hidden" id="hidWidthCropPre" value="1370" runat="server" />
        <input type="hidden" id="hidHideCropPre" value="800" runat="server" />

        <!--剪裁区域的大小-->
        <input type="hidden" id="hidCropZoomWidth" value="1390" runat="server" />
        <input type="hidden" id="hidCropZoomHeight" value="800" runat="server" />

        <!--剪裁框的大小，最终剪裁图片的大小-->
        <input type="hidden" id="hidCropImgWidth" value="300" runat="server" />
        <input type="hidden" id="hidCropImgHeight" value="300" runat="server" />

        <!--信息ID-->
        <input type="hidden" id="hidMsgID" value="11" runat="server" />
        <!--裁剪图片的类别-->
        <input type="hidden" id="hidCropType" value="ShopLogo" runat="server" />
        <!--保存文件名的前缀-->
        <input type="hidden" id="hidPrefixFileName" value="CropZoom" runat="server" />
        <!--保存的文件路径-->
        <input type="hidden" id="hidSavePath" value="/Upload/ShopLogo/" runat="server" />
        <!--文件相对路径-->
        <input type="hidden" id="hidFileRelativePath" value="/Upload/ShopLogo/" runat="server" />

        <!--图片来源URL-->
        <input type="hidden" id="hidImgSourceURL" runat="server" value="http://www.suchso.com/zb_users/upload/2016/3/2016033041086637.jpg" />
        <!--裁剪后返回的URL-->
        <input type="hidden" id="hidCropRedirectURL" runat="server" value="http://www.baidu.com" />

        <div class="crop-main">

            <div class="crop-title" id="CropTitleDiv" runat="server">
                店铺Logo的图片裁剪
            </div>


            <!--图片显示与剪裁操作区域-->
            <div id="cropzoom_container" class="cropzoom_container" style="overflow: hidden;">
            </div>


            <!--按钮-->
            <div class="send_data">
                <div class="send_data_left" onclick="window.location.reload()">重置</div> 
               <div class="send_data_right">裁剪</div> 
            </div>


        </div>

    </form>
</body>
</html>
