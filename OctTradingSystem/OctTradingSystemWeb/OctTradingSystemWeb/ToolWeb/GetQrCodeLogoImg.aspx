<%@ Page Language="C#" AutoEventWireup="true" CodeFile="GetQrCodeLogoImg.aspx.cs" Inherits="GetQrCodeLogoImg" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title>利用QrCode生成二维码_在二维码图片中心加Logo或图像 </title>
</head>
<body>
    <form id="form1" runat="server">
    <div>
           <ul>

               <li>
                   <h3>保存生成的二维码</h3>
                   二维码内容：<input type="text" placeholder="请输入二维码的内容" id="SaveQrCode" value="http://www.51clh.com/" runat="server" style="width:300px;" />
                   <button runat="server" onserverclick="Save_QrCodeImg">保存生成的二维码</button>
                   <div id="QrCodeImgToFile" runat="server" style="padding:10px;">

                   </div>
               </li>

               <li>
                   <h3>生成中文二维码</h3>
                   <button runat="server" onserverclick="Save_ChineseQrCode">保存生成的中文二维码</button>
                   <div id="Div1" runat="server" style="padding:10px;">

                   </div>
               </li>

               <li>
                   <h3>调整二维码大小</h3>
                   <button runat="server" onserverclick="Save_ScaleQrCode">调整二维码大小</button>
                   <div id="Div2" runat="server" style="padding:10px;"> </div>
               </li>

               <li>
                   <h2>生成带Logo的二维码</h2>
                   <button runat="server" onserverclick="Save_LogoImgQrCode">生成带Logo的二维码</button>
                   <div id="Div3" runat="server" style="padding:10px;"> </div>
               </li>

               <li>
                    <h2>生成带Logo的二维码,并以MemoryStream方式输出显示</h2>
                   <button runat="server" onserverclick="Response_MsImgQrCode">生成带Logo的二维码,并以MemoryStream方式输出显示</button>

               </li>


           </ul>
    </div>
    </form>
</body>
</html>
