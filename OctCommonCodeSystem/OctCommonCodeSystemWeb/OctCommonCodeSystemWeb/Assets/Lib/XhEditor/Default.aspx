<%@ Page Language="VB" AutoEventWireup="false" CodeFile="Default.aspx.vb" Inherits="_Default" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" >
<head runat="server">
    <title>xheditor在线Web编辑器</title>
    
    <script type="text/javascript" charset="utf-8" src="jquery/jquery-1.4.4.min.js"></script>
    <script type="text/javascript" charset="utf-8" src="xheditor-1.2.1.min.js"></script>
    <script type="text/javascript" charset="utf-8" src="xheditor_lang/zh-cn.js"></script>



<script type="text/javascript" src="JScript.js"></script>




</head>
<body>
    <form id="form1" runat="server">
    
    <div>
     
     <textarea id="WebEditor" style="width:500px; height:300px;" rows="100" cols="100" name="content" class="xheditor">test</textarea>
    
    <!--=========初始化编辑器======-->
    <script type="text/javascript" charset="utf-8">var editor=$('#WebEditor').xheditor({tools:'full',skin:'default',forcePtag:false});</script>
    
    </div>
    
    
    <div>
        <input id="Button1" type="button" value="插入自定义图片" onclick="InsetMyImg('mytest/InserImgTest1.jpg')" /> &nbsp;&nbsp;&nbsp;
        <input id="Button2" type="button" value="获取编辑后的值" onclick="GetEditValue()" /> &nbsp;&nbsp;&nbsp;
        <input id="Button3" type="button" value="给编辑器赋值" onclick="InitEditorValue()" />
    </div>
    
    
    
    </form>
</body>
</html>
