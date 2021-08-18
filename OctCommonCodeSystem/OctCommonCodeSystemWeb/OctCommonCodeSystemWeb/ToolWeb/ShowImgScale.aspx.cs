using System;
using System.Drawing;
using System.Drawing.Imaging;
using System.Web;

public partial class ShowImgScale : System.Web.UI.Page
{
    //前台调用方法
    //../PubWeb/ShowImgScale.aspx?FilePathFrom=UploadImgs/ActivityImgs/activity_01.jpg&LimitWidthNum=300&LimitHeightNum=40

    protected void Page_Load(object sender, EventArgs e)
    {
        string FilePathFrom = Request["FilePathFrom"].ToString().Trim();
        string LimitWidthNum = Request["LimitWidthNum"].ToString().Trim();
        string LimitHeightNum = Request["LimitHeightNum"].ToString().Trim();

        ImgScaleShow(Server.MapPath("~/" + FilePathFrom), Convert.ToInt32(LimitWidthNum), Convert.ToInt32(LimitHeightNum));
    }

    //按指定的高度LimitHeightNum和宽度LimitWidthNum，生成相应的等比缩略图。但缩放的图片不能大于原图高度和宽度
    public static void ImgScaleShow(string filePath, int LimitWidthNum, int LimitHeightNum)
    {
        //创建图像对方
        System.Drawing.Image image = System.Drawing.Image.FromFile(filePath);

        //得到图片最大显示区域尺寸
        float imgWidth = image.Width; //图片宽度
        float imgHeight = image.Height; //图片高度

        float img_Width = 0; float img_Height = 0;

        Int32 resultWidth = Convert.ToInt32(imgWidth); Int32 resultHeight = Convert.ToInt32(imgHeight); //最终缩略图的高度和宽度


        //如果原始图片的宽度大于LimitWidthNum像则进行缩放
        if (imgWidth > LimitWidthNum)
        {

            if ((imgWidth - LimitWidthNum) > 0)
            {
                //计算多出的尺寸是原图片宽度多少倍
                img_Width = (imgWidth - LimitWidthNum) / imgWidth;
                //计算缩略图的高度
                img_Height = imgHeight - (imgHeight * img_Width);
            }
            else
            {
                //计算少了的尺寸是原图片宽度多少倍
                img_Width = Math.Abs(imgWidth - LimitWidthNum / imgWidth);
                //计算缩略图的高度
                img_Height = imgHeight + (imgHeight * img_Width);
            }

            //为最终图片缩略图定义高度和宽度
            resultWidth = Convert.ToInt32(LimitWidthNum);
            resultHeight = Convert.ToInt32(img_Height);
        }

        //如果经过宽度限制的图片仍然超过限定的高度，则重新计算高度,宽度
        if (resultHeight > LimitHeightNum)
        {
            //计算多出的尺寸是原图高度的多少倍
            img_Height = (imgHeight - LimitHeightNum) / imgHeight;
            //计算缩略图的宽度
            img_Width = imgWidth - (imgWidth * img_Height);

            //为最终图片缩略图定义高度和宽度
            resultWidth = Convert.ToInt32(img_Width);
            resultHeight = Convert.ToInt32(LimitHeightNum);
        }

        //创建缩略图区域
        Rectangle rct = new Rectangle(0, 0, resultWidth, Convert.ToInt32(resultHeight));

        //输出显示图片的缩略图
        //创建位图对象即显示图片的区域大小
        Bitmap backing = new Bitmap(resultWidth, Convert.ToInt32(resultHeight));

        Graphics g = Graphics.FromImage(backing);

        //加载缩略图
        g.DrawImage(image, rct);

        //定义缓存输出的类型
        HttpContext.Current.Response.ClearContent();
        HttpContext.Current.Response.ContentType = "image/Jpeg";

        //保存在服务器上的路径及文件名，只能单独定义
        //string newPath = ScaleImgPath;

        //正式输出缩略图图片
        backing.Save(HttpContext.Current.Response.OutputStream, ImageFormat.Jpeg); //缓存输出

        //将生成的缩略图保存在服务器上
        //backing.Save(newPath);


        //释放资源
        backing.Dispose();
        g.Dispose();
        image.Dispose();

    }
}
