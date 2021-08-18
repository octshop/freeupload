using PublicClassNS;
using System;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.IO;
using System.Net;
using System.Threading;
using System.Web;

namespace QhMall.PubWeb.CropZoom
{
    /// <summary>
    /// 处理【剪裁上传图片的 相关数据业务逻辑】
    /// </summary>
    public class CropZoom1 : IHttpHandler
    {

        /// <summary>
        /// 处理，图片裁剪后的 数据处理相关逻辑
        /// </summary>
        /// <param name="pMsgID">信息ID 数据表中尽量是唯一的</param>
        /// <param name="pCropType">裁剪的类别[ShopLogo / ShopHeader]</param>
        /// <param name="pCropSavePath">裁剪后保存的图片路径[/Upload/ShopLogo/ShopLogo_201803121155406520.jpg]</param>
        public void proCropData(string pMsgID, string pCropType,string pCropSavePath)
        {
            //去掉前面的“/”
            pCropSavePath = PublicClass.RemoveFrontAndBackChar(pCropSavePath, "/");

            //调用处理裁剪 【店铺头像和店铺LOGO】数据更新的函数
            //BusiUpload.proCropShopImg(pCropType, pCropSavePath);
            
        }


        public void ProcessRequest(HttpContext context)
        {
            context.Response.ContentType = "text/plain";

            try
            {
                Thread.CurrentThread.CurrentUICulture = new System.Globalization.CultureInfo("en-US");
                Thread.CurrentThread.CurrentCulture = new System.Globalization.CultureInfo("en-US");

                ////context.Response.ContentType = "text/plain";
                //int ID = Convert.ToInt32(context.Request["ID"]); //传递过来的信息ID
                //string prefixFileName = context.Request["PrefixFileName"]; //保存文件名的前缀
                //string savePath = context.Request["SavePath"]; //保存文件的相对路径 [/UploadImgs/RefundImgs/]
                //string cropType = context.Request["CropType"]; //裁剪图片的类别

                string fileRelativePath = context.Request["FileRelativePath"]; //裁剪图片的相对路径包含文件名


                float imageH = float.Parse(context.Request["imageH"]);
                float imageW = float.Parse(context.Request["imageW"]);
                float angle = float.Parse(context.Request["imageRotate"]);
                string img_source = context.Request["imageSource"];
                float imageX = float.Parse(context.Request["imageX"]);
                float imageY = float.Parse(context.Request["imageY"]);
                float selectorH = float.Parse(context.Request["selectorH"]);
                float selectorW = float.Parse(context.Request["selectorW"]);
                float selectorX = float.Parse(context.Request["selectorX"]);
                float selectorY = float.Parse(context.Request["selectorY"]);
                float viewPortH = float.Parse(context.Request["viewPortH"]);
                float viewPortW = float.Parse(context.Request["viewPortW"]);
                //To Values
                float pWidth = imageW;
                float pHeight = imageH;
                Bitmap img = null;

                MemoryStream mstream = null;

                string serverImagePath = "本站ip";
                //string serverImagePath = "10.1.1.215:85";
                if (img_source.IndexOf(serverImagePath) >= 0)   //本站的<a href="http://www.suchso.com/UIweb/jquery-Plupload-use.html" class="keylink" title=" Plupload上传" target="_blank">上传</a>图片
                {
                    string urlall = img_source.ToString();
                    string[] argslist = urlall.Split('/');
                    if (argslist.Length > 3)
                    {
                        string imagename = argslist[argslist.Length - 1];
                        string shopid = argslist[argslist.Length - 2];
                        string shopimagepath = serverImagePath + "/" + shopid;
                        if (!string.IsNullOrEmpty(shopimagepath) &&
                         File.Exists(shopimagepath + "/" + imagename)
                         )
                        {
                            img = (Bitmap)Bitmap.FromFile(shopimagepath + "/" + imagename);
                        }
                    }
                }
                else if (img_source.IndexOf("http") >= 0)   //  网络图片
                {
                    WebClient client = new WebClient();
                    byte[] htmlData = null;
                    htmlData = client.DownloadData(img_source);
                    //MemoryStream mstream = new MemoryStream(htmlData);
                    mstream = new MemoryStream(htmlData);
                    img = (Bitmap)Bitmap.FromStream(mstream);
                }
                else
                {                     //直接是本地路径
                    img = (Bitmap)Bitmap.FromFile(context.Server.MapPath(img_source));
                }
                //Original Values
                int _width = img.Width;
                int _height = img.Height;
                //Resize
                Bitmap image_p = ResizeImage(img, Convert.ToInt32(pWidth), Convert.ToInt32(pHeight));
                int widthR = image_p.Width;
                int heightR = image_p.Height;
                //Rotate if angle is not 0.00 or 360
                if (angle > 0.0F && angle < 360.00F)
                {
                    image_p = (Bitmap)RotateImage(image_p, (double)angle);
                    pWidth = image_p.Width;
                    pHeight = image_p.Height;
                }
                //Calculate Coords of the Image into the ViewPort
                float src_x = 0;
                float dst_x = 0;
                float src_y = 0;
                float dst_y = 0;
                if (pWidth > viewPortW)
                {
                    src_x = (float)Math.Abs(imageX - Math.Abs((imageW - pWidth) / 2));
                    dst_x = 0;
                }
                else
                {
                    src_x = 0;
                    dst_x = (float)(imageX + ((imageW - pWidth) / 2));
                }
                if (pHeight > viewPortH)
                {
                    src_y = (float)Math.Abs(imageY - Math.Abs((imageH - pHeight) / 2));
                    dst_y = 0;
                }
                else
                {
                    src_y = 0;
                    dst_y = (float)(imageY + ((imageH - pHeight) / 2));
                }
                //Get Image viewed into the ViewPort
                image_p = ImageCopy(image_p, dst_x, dst_y, src_x, src_y, viewPortW, viewPortH, pWidth, pHeight);
                //image_p.Save(context.Server.MapPath("test_viewport.jpg"));
                //Get Selector Portion
                image_p = ImageCopy(image_p, 0, 0, selectorX, selectorY, selectorW, selectorH, viewPortW, viewPortH);

                //-----------保存的文件名------------//
                //Random _rnd = new Random();
                //string FileName = String.Format(prefixFileName + "_" + ID + "_" + _rnd.Next(9) + _rnd.Next(9) + "{0}.jpg", DateTime.Now.Ticks.ToString());
                //-----------正式执行保存-------//
                //image_p.Save(context.Server.MapPath("/UploadImgs/" + FileName));

                //string _savePath1 = savePath + FileName;
                string _savePath2 = "/" + fileRelativePath;
                //image_p.Save(context.Server.MapPath(savePath + FileName));
                image_p.Save(context.Server.MapPath(_savePath2));


                image_p.Dispose();
                img.Dispose();
                mstream.Dispose();

                //imgSelector.Dispose();
                //context.htm = htm & ("tmp/" + FileName);
                //context.Response.Write("UploadImgs/" + FileName);

                //-----------这里处理裁剪完成后的业务逻辑-----------//
                //proCropData(ID.ToString().Trim(), cropType, savePath + FileName);

                //if (cropType == "ShopLogo") //店铺Logo图片裁剪
                //{

                //}
                //else
                //{

                //}



            }
            catch (Exception ex)
            {
                //context.htm = htm & ("Error:" + ex.Message + "||" + ex.StackTrace);
                context.Response.Write("Error:" + ex.Message + "||" + ex.StackTrace);
            }
        }


        private Bitmap ImageCopy(Bitmap srcBitmap, float dst_x, float dst_y, float src_x, float src_y, float dst_width, float dst_height, float src_width, float src_height)
        {
            // Create the new bitmap and associated graphics object
            RectangleF SourceRec = new RectangleF(src_x, src_y, dst_width, dst_height);
            RectangleF DestRec = new RectangleF(dst_x, dst_y, dst_width, dst_height);
            Bitmap bmp = new Bitmap(Convert.ToInt32(dst_width), Convert.ToInt32(dst_height));
            Graphics g = Graphics.FromImage(bmp);
            // Draw the specified section of the source bitmap to the new one
            g.DrawImage(srcBitmap, DestRec, SourceRec, GraphicsUnit.Pixel);
            // Clean up
            g.Dispose();
            // Return the bitmap
            return bmp;
        }

        private Bitmap ResizeImage(Bitmap img, int width, int height)
        {
            Image.GetThumbnailImageAbort callback = new Image.GetThumbnailImageAbort(GetThumbAbort);
            return (Bitmap)img.GetThumbnailImage(width, height, callback, System.IntPtr.Zero);
        }
        public bool GetThumbAbort()
        {
            return false;
        }
        /// <summary>
        /// method to rotate an image either clockwise or counter-clockwise
        /// </summary>
        /// <param name="img">the image to be rotated</param>
        /// <param name="rotationAngle">the angle (in degrees).
        /// NOTE: 
        /// Positive values will rotate clockwise
        /// negative values will rotate counter-clockwise
        /// </param>
        /// <returns></returns>
        private Image RotateImage(Bitmap img, double rotationAngle)
        {
            //create an empty Bitmap image
            Bitmap bmp = new Bitmap(img.Width, img.Height);
            //turn the Bitmap into a Graphics object
            Graphics gfx = Graphics.FromImage(bmp);
            //now we set the rotation point to the center of our image
            gfx.TranslateTransform((float)bmp.Width / 2, (float)bmp.Height / 2);
            //now rotate the image
            gfx.RotateTransform((float)rotationAngle);
            gfx.TranslateTransform(-(float)bmp.Width / 2, -(float)bmp.Height / 2);
            //set the InterpolationMode to HighQualityBicubic so to ensure a high
            //quality image once it is transformed to the specified size
            gfx.InterpolationMode = InterpolationMode.HighQualityBicubic;
            //now draw our new image onto the graphics object
            gfx.DrawImage(img, new Point(0, 0));
            //dispose of our Graphics object
            gfx.Dispose();
            //return the image
            return bmp;
        }




        public bool IsReusable
        {
            get
            {
                return false;
            }
        }
    }
}