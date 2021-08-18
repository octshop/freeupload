using Gma.QrCodeNet.Encoding;
using Gma.QrCodeNet.Encoding.Windows.Render;
using System;
using System.Drawing;
using System.Drawing.Imaging;
using System.IO;




public partial class GetQrCodeLogoImg : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {


        //生成带Logo图片的二维码，并写入Stream，并以输出流的形式输出显示，不保存图片
        //ResponseQrCodeLogoImg();



    }



    /// <summary>
    /// ------------------保存生成的二维码图片----------------
    /// </summary>
    /// <param name="sender"></param>
    /// <param name="e"></param>
    protected void Save_QrCodeImg(object sender, EventArgs e)
    {
        string strQrCodeContent = "小黄人";//SaveQrCode.Value.ToString().Trim();

        QrEncoder qrEncoder = new QrEncoder(ErrorCorrectionLevel.M);
        QrCode qrCode = qrEncoder.Encode(strQrCodeContent);

        //保存成png文件
        //string filename = @"H:\桌面\截图\url.png";
        string filename = Server.MapPath("~/QrCodeImgs/myQrCode.png");

        GraphicsRenderer render = new GraphicsRenderer(new FixedModuleSize(5, QuietZoneModules.Two), Brushes.Black, Brushes.White);
        using (FileStream stream = new FileStream(filename, FileMode.Create))
        {
            render.WriteToStream(qrCode.Matrix, ImageFormat.Png, stream);
        }

        //QrCodeImgToFile.InnerHtml = filename.ToString().Trim();
    }

    /// <summary>
    /// --------------生成中文二维码--------------------
    /// </summary>
    /// <param name="sender"></param>
    /// <param name="e"></param>
    protected void Save_ChineseQrCode(object sender, EventArgs e)
    {
        QrEncoder qrEncoder = new QrEncoder(ErrorCorrectionLevel.M);
        QrCode qrCode = qrEncoder.Encode("我是小天马");
        //保存成png文件
        //string filename = @"H:\桌面\截图\cn.png";
        string filename = Server.MapPath("~/QrCodeImgs/myChineseQrCode.png");

        //配置绘制二维码的笔刷样式
        GraphicsRenderer render = new GraphicsRenderer(new FixedModuleSize(5, QuietZoneModules.Two), Brushes.LightGreen, Brushes.Blue);

        Bitmap map = new Bitmap(500, 500);
        Graphics g = Graphics.FromImage(map);

        //绘制文字
        string strDesTxt = "自定义二维码的说明文字哦";
        g.DrawString(strDesTxt, new Font("宋体", 15, FontStyle.Bold | FontStyle.Italic), Brushes.Black, 20, 100);


        g.FillRectangle(Brushes.LightGray, 0, 0, 500, 500);
        render.Draw(g, qrCode.Matrix, new Point(20, 20));
        map.Save(filename, ImageFormat.Png);

        //路径插入前台
        //Div1.InnerHtml = filename.ToString().Trim();
    }


    /// <summary>
    /// ---------------设置二维码大小--------------------
    /// </summary>
    /// <param name="sender"></param>
    /// <param name="e"></param>
    protected void Save_ScaleQrCode(object sender, EventArgs e)
    {
        QrEncoder qrEncoder = new QrEncoder(ErrorCorrectionLevel.M);
        QrCode qrCode = qrEncoder.Encode("我是小天马");
        //保存成png文件
        //string filename = @"H:\桌面\截图\size.png";
        string filename = Server.MapPath("~/QrCodeImgs/myScaleQrCode.png");


        //ModuleSize 设置图片大小  
        //QuietZoneModules 设置周边padding
        /*
            * 5----150*150    padding:5
            * 10----300*300   padding:10
            */
        //-----------其中30 这个数据是设置二维图片大小的   QuietZoneModules.Four 设置二维码的边距的 Brushes.Black 绘制笔刷  Brushes.Whit填充色-----------//
        GraphicsRenderer render = new GraphicsRenderer(new FixedModuleSize(30, QuietZoneModules.Four), Brushes.Black, Brushes.White);

        Point padding = new Point(10, 10);

        DrawingSize dSize = render.SizeCalculator.GetSize(qrCode.Matrix.Width);
        Bitmap map = new Bitmap(dSize.CodeWidth + padding.X, dSize.CodeWidth + padding.Y);
        Graphics g = Graphics.FromImage(map);
        render.Draw(g, qrCode.Matrix, padding);
        map.Save(filename, ImageFormat.Png);

        //路径插入前台
        //Div2.InnerHtml = filename.ToString().Trim();
    }


    /// <summary>
    /// ---------------生成带Logo的二维码,并保存二维码图片------------------
    /// </summary>
    /// <param name="sender"></param>
    /// <param name="e"></param>
    protected void Save_LogoImgQrCode(object sender, EventArgs e)
    {
        QrEncoder qrEncoder = new QrEncoder(ErrorCorrectionLevel.M);
        QrCode qrCode = qrEncoder.Encode("我是小天马");

        //保存成png文件
        //string filename = @"H:\桌面\截图\logo.png";
        string filename = Server.MapPath("~/QrCodeImgs/myLogoImgQrCode.png");

        GraphicsRenderer render = new GraphicsRenderer(new FixedModuleSize(10, QuietZoneModules.Two), Brushes.Black, Brushes.White);

        DrawingSize dSize = render.SizeCalculator.GetSize(qrCode.Matrix.Width);
        Bitmap map = new Bitmap(dSize.CodeWidth, dSize.CodeWidth);
        Graphics g = Graphics.FromImage(map);
        render.Draw(g, qrCode.Matrix);

        //追加Logo图片 ,注意控制Logo图片大小和二维码大小的比例
        string logoImgFile = Server.MapPath("~/QrCodeImgs/LogoImg.jpg");
        //System.Drawing.Image img = System.Drawing.Image.FromFile(@"F:\JavaScript_Solution\QrCode\QrCode\Images\101.jpg");
        System.Drawing.Image img = System.Drawing.Image.FromFile(logoImgFile);

        Point imgPoint = new Point((map.Width - img.Width) / 2, (map.Height - img.Height) / 2);

        //g.DrawImage(img, imgPoint.X, imgPoint.Y, img.Width, img.Height);

        //计算出Logo图片的不能超过指定值后的图片大小 
        Int32[] logoImgWidthHeightArr = getScalePercentNumber(img.Width, img.Height, 80, 80);
        //计算出Logo图片居中的坐标值
        float logoHalfWidth = logoImgWidthHeightArr[0] / 2;
        float logoHalfHeight = logoImgWidthHeightArr[1] / 2;

        //二维码的大小为：290x290
        g.DrawImage(img, 145 - logoHalfWidth, 145 - logoHalfHeight, logoImgWidthHeightArr[0], logoImgWidthHeightArr[1]);


        map.Save(filename, ImageFormat.Png);

        //路径插入前台
        //Div3.InnerHtml = filename.ToString().Trim();
    }



    /// <summary>
    /// -------------生成带Logo图片的二维码，并写入Stream，并以输出流的形式输出显示，不保存图片---------------------
    /// </summary>
    protected void ResponseQrCodeLogoImg()
    {
        QrEncoder qrEncoder = new QrEncoder(ErrorCorrectionLevel.M);
        QrCode qrCode = qrEncoder.Encode("我是小天马");

        //保存成png文件
        //string filename = @"H:\桌面\截图\logo.png";
        //string filename = Server.MapPath("~/QrCodeImgs/myLogoImgQrCode.png");

        GraphicsRenderer render = new GraphicsRenderer(new FixedModuleSize(10, QuietZoneModules.Two), Brushes.Black, Brushes.White);

        DrawingSize dSize = render.SizeCalculator.GetSize(qrCode.Matrix.Width);
        Bitmap map = new Bitmap(dSize.CodeWidth, dSize.CodeWidth);
        Graphics g = Graphics.FromImage(map);
        render.Draw(g, qrCode.Matrix);

        //追加Logo图片 ,注意控制Logo图片大小和二维码大小的比例
        string logoImgFile = Server.MapPath("~/QrCodeImgs/LogoImg.jpg");
        //System.Drawing.Image img = System.Drawing.Image.FromFile(@"F:\JavaScript_Solution\QrCode\QrCode\Images\101.jpg");
        System.Drawing.Image img = System.Drawing.Image.FromFile(logoImgFile);

        Point imgPoint = new Point((map.Width - img.Width) / 2, (map.Height - img.Height) / 2);

        //g.DrawImage(img, imgPoint.X, imgPoint.Y, img.Width, img.Height);

        //计算出Logo图片的不能超过指定值后的图片大小 
        Int32[] logoImgWidthHeightArr = getScalePercentNumber(img.Width, img.Height, 80, 80);
        //计算出Logo图片居中的坐标值
        float logoHalfWidth = logoImgWidthHeightArr[0] / 2;
        float logoHalfHeight = logoImgWidthHeightArr[1] / 2;

        //二维码的大小为：290x290
        g.DrawImage(img, 145 - logoHalfWidth, 145 - logoHalfHeight, logoImgWidthHeightArr[0], logoImgWidthHeightArr[1]);



        //----------将带Logo图片的二维码写入内存流中------------//
        MemoryStream _memoryStream = new MemoryStream();
        map.Save(_memoryStream, ImageFormat.Png);


        //输出图片流
        Response.ContentType = "image/Png";
        Response.OutputStream.Write(_memoryStream.GetBuffer(), 0, (int)_memoryStream.Length);
        Response.End();

    }
    protected void Response_MsImgQrCode(object sender, EventArgs e)
    {
        //生成带Logo图片的二维码，并写入Stream，并以输出流的形式输出显示，不保存图片
        ResponseQrCodeLogoImg();
    }




    /// <summary>
    /// --------------计算出不能超过指定宽度和高度后，图片等比的长宽像素值-------------------------
    /// </summary>
    /// <param name="imgWidth">原图片的宽度</param>
    /// <param name="imgHeight">原图片的高度</param>
    /// <param name="LimitWidthNum">新图片不能超过的宽度值</param>
    /// <param name="LimitHeightNum">新图片不能超过的高度值</param>
    /// <returns></returns>
    public Int32[] getScalePercentNumber(float imgWidth, float imgHeight, int LimitWidthNum, int LimitHeightNum)
    {
        //得到图片最大显示区域尺寸
        //float imgWidth = image.Width; //图片宽度
        //float imgHeight = image.Height; //图片高度

        float img_Width = 0; float img_Height = 0;

        Int32 resultWidth = Convert.ToInt32(imgWidth);
        Int32 resultHeight = Convert.ToInt32(imgHeight); //最终缩略图的高度和宽度


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

        Int32[] resultWidthHeightArr = { resultWidth, resultHeight };

        return resultWidthHeightArr;

    }








}