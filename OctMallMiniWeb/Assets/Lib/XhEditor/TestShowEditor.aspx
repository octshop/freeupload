<%@ Page Language="C#" AutoEventWireup="true" CodeFile="TestShowEditor.aspx.cs" Inherits="TestShowEditor" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" >
<head runat="server">
    <title>测试显示框架中的在线Web编辑器</title>
    
    <script type="text/javascript" src="TestShowEditor.js"></script>
    
</head>
<body>
    <form id="form1" runat="server">
    <div>
          <iframe id="EditorIframe" name="EditorIframe" align="middle" width="500px" height="360px" scrolling="no" src="EditorIframe.aspx" marginheight="0" frameborder="0"></iframe>
    </div>
    <div>
        <input id="Button1" type="button" value="插入自定义图片" onclick="InsetMyImg('mytest/InserImgTest1.jpg')" /> &nbsp;&nbsp;&nbsp;
        <input id="Button2" type="button" value="获取编辑后的值" onclick="GetEditValue()" /> &nbsp;&nbsp;&nbsp;
        <input id="Button3" type="button" value="给编辑器赋值" onclick="InitEditorValue()" />
    </div>
    </form>
</body>
</html>
