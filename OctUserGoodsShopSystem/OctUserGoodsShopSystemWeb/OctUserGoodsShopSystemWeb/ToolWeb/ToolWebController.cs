using Gma.QrCodeNet.Encoding;
using Gma.QrCodeNet.Encoding.Windows.Render;
using System;
using System.Collections.Generic;
using System.Drawing;
using System.Drawing.Imaging;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;

/// <summary>
/// 【工具页处理 - 如：二维码生成显示，图片缩略显示，图片裁剪】
/// </summary>
namespace ToolWebNS
{
    public class ToolWebController : Controller
    {
        // GET: ToolWeb
        public ActionResult Index()
        {
            return View();
        }

        /// <summary>
        /// 显示二维码
        /// </summary>
        /// <returns></returns>

        public ActionResult QrCodeImg()
        {
            //获取二维码的内容字符 
            string strQrCodeContent = Server.UrlDecode(Request["QrCodeContent"].ToString().Trim()); //"http://192.168.0.224/BusiShop.aspx?SID=1";//Request["QrCodeContent"].ToString().Trim();

            // Render the QR code as an image
            using (var ms = new MemoryStream())
            {
                string stringtest = strQrCodeContent;

                createQrCode(stringtest, ms);

                Response.ContentType = "image/Png";
                Response.OutputStream.Write(ms.GetBuffer(), 0, (int)ms.Length);
                Response.End();
            }

            return null;
        }

        /// <summary>
        /// 显示带背景图片的二维码  背景图片维持在 1000 x 1000 像素 [背景图片路径：~/Upload/QrCodeImg/bg.png]
        /// </summary>
        /// <returns></returns>

        public ActionResult QrCodeImgBackGround()
        {
            //获取二维码内容
            string _qrContent = Request["QrCodeContent"].ToString().Trim();

            //背景图片长宽值
            int _imgBgWidth = 1000;
            int _imgBgHeight = 1000;

            Bitmap map = new Bitmap(_imgBgWidth, _imgBgHeight);
            Graphics g = Graphics.FromImage(map);

            //追加Logo图片 ,注意控制Logo图片大小和二维码大小的比例
            string logoImgFile = Server.MapPath("~/Upload/QrCodeImg/bg.png");
            //System.Drawing.Image img = System.Drawing.Image.FromFile(@"F:\JavaScript_Solution\QrCode\QrCode\Images\101.jpg");
            System.Drawing.Image img = System.Drawing.Image.FromFile(logoImgFile);
            g.DrawImage(img, 0, 0, _imgBgWidth, _imgBgHeight);

            //二维码的大小为：290x290
            //g.DrawImage(img, logoHalfWidth, logoHalfHeight, logoImgWidthHeightArr[0], logoImgWidthHeightArr[1]);


            QrEncoder qrEncoder = new QrEncoder(ErrorCorrectionLevel.M);
            QrCode qrCode = qrEncoder.Encode(_qrContent);

            GraphicsRenderer render = new GraphicsRenderer(new FixedModuleSize(10, QuietZoneModules.Two), Brushes.Black, Brushes.White);
            DrawingSize dSize = render.SizeCalculator.GetSize(qrCode.Matrix.Width);

            //将 二维码 定位到背景图中心
            Point imgPoint = new Point((img.Width - dSize.CodeWidth) / 2, (img.Height - dSize.CodeWidth) / 2);

            //渲染整个图片
            render.Draw(g, qrCode.Matrix, imgPoint);

            //----------将带Logo图片的二维码写入内存流中------------//
            MemoryStream _memoryStream = new MemoryStream();
            map.Save(_memoryStream, ImageFormat.Png);


            //输出图片流
            Response.ContentType = "image/Png";
            Response.OutputStream.Write(_memoryStream.GetBuffer(), 0, (int)_memoryStream.Length);
            Response.End();

            return null;
            //return View();
        }


        #region【公共函数】

        /// <summary>
        /// 获取二维码
        /// </summary>
        /// <param name="strContent">待编码的字符</param>
        /// <param name="ms">输出流</param>
        ///<returns>True if the encoding succeeded, false if the content is empty or too large to fit in a QR code</returns>
        public static bool createQrCode(string strContent, MemoryStream ms)
        {
            ErrorCorrectionLevel Ecl = ErrorCorrectionLevel.M; //误差校正水平 
            string Content = strContent;//待编码内容
            QuietZoneModules QuietZones = QuietZoneModules.Two;  //空白区域 
            int ModuleSize = 20;//大小
            var encoder = new QrEncoder(Ecl);
            QrCode qr;
            if (encoder.TryEncode(Content, out qr))//对内容进行编码，并保存生成的矩阵
            {
                var render = new GraphicsRenderer(new FixedModuleSize(ModuleSize, QuietZones));
                render.WriteToStream(qr.Matrix, ImageFormat.Png, ms);
            }
            else
            {
                return false;
            }
            return true;


        }

        #endregion

    }
}