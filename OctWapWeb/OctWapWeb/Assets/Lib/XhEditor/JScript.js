// JScript 文件

//------------插入自定义图片-------------------//

function InsetMyImg(ImgSrcPath)
{
		
     editor.pasteHTML("<img src=\""+ ImgSrcPath +"\" />");
}

//---------------获取编辑后的值-----------------//
function GetEditValue()
{
	alert(editor.getSource());
}

//---------------给编辑器赋值------------------//
function InitEditorValue()
{
	editor.setSource("<b>这个一个赋值的测试哦……</b>");
}
