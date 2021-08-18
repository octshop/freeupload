// JScript 文件

//------------插入自定义图片-------------------//

function InsetMyImg(ImgSrcPath)
{
		
   //document.frames["EditorIframe"].editor.pasteHTML("<img src=\""+ ImgSrcPath +"\" />");
   
   window.frames[0].editor.pasteHTML("<img src=\""+ ImgSrcPath +"\" />");
   
}

//---------------获取编辑后的值-----------------//
function GetEditValue()
{
	var strEditorContent = window.frames[0].editor.getSource()
	alert(strEditorContent);
}


//---------------给编辑器赋值------------------//
function InitEditorValue()
{
	window.frames[0].editor.setSource("<b>这个一个赋值的测试哦……</b>");
}

