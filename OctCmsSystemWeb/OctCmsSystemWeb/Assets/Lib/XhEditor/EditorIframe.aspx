<%@ Page Language="C#" AutoEventWireup="true" CodeFile="EditorIframe.aspx.cs" Inherits="EditorIframe" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" >
<head runat="server">
    <title>在线Web编辑器页面</title>
    
    <script type="text/javascript" charset="utf-8" src="jquery/jquery-1.4.4.min.js"></script>
    <script type="text/javascript" charset="utf-8" src="xheditor-1.2.1.min.js"></script>
    <script type="text/javascript" charset="utf-8" src="xheditor_lang/zh-cn.js"></script>
    
    <style type="text/css">
          html,body{
             margin: 0;
	         padding: 0;
	         text-align: left;
          }
          #WebEditor{
             width:706px; 
             height:468px;
          }
          * html #WebEditor{
            height: 493px;
          }
    </style>
    
</head>
<body>
    <form id="form1" runat="server">
    <div>
    
        <textarea id="WebEditor" name="content" class="xheditor"></textarea>
    
        <!--=========初始化编辑器======-->
         <script type="text/javascript" charset="utf-8">var editor=$('#WebEditor').xheditor({tools:'full',skin:'default',forcePtag:false});</script>
    
    
    </div>
    </form>
</body>
</html>
