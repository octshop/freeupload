using PublicClassNS;
using System;

/// <summary>
/// 
/// 引用方法如下
/// "http://192.168.1.220:1400/ToolWeb/CropZoom/CropZoom.aspx?CropImgWidth=300&CropImgHeight=300&CropTitle=%e5%ba%97%e9%93%baLOGO&ImgSourceURL=Upload/BuyerHeaderImg/bhi_5625_201905211536412470.jpg&RedirectURL=http://www.baidu.com";
///
/// 请注意，如果传递的参数中有“中文”一定要经过 【Server.UrlEncode("店铺LOGO")】  处理 
/// 传递的参数中与跳转页相关的，不能出现【../../】之类的，否则微信不识别
/// 
/// 此插件也可以裁剪网络图片
/// 
/// </summary>
namespace QhMall.PubWeb.CropZoom
{
    public partial class CropZoom : System.Web.UI.Page
    {
        //网站的域名
        public static string mWebSitDomain = "http://192.168.1.220:1400/";

        protected void Page_Load(object sender, EventArgs e)
        {
            //剪裁框的大小，最终剪裁图片的大小
            string _hidCropImgWidth = PublicClass.FilterRequestTrim("CropImgWidth"); //最终剪裁图片的宽度
            string _hidCropImgHeight = PublicClass.FilterRequestTrim("CropImgHeight"); //最终剪裁图片的高度

            hidCropImgWidth.Value = _hidCropImgWidth;
            hidCropImgHeight.Value = _hidCropImgHeight;

            //裁剪的标题
            string _cropTitle = PublicClass.FilterRequestTrim("CropTitle");

            CropTitleDiv.InnerHtml = _cropTitle + "图片裁剪";

            //裁剪图片来源URL
            string _imgSourceURL = PublicClass.FilterRequestTrim("ImgSourceURL");

            hidImgSourceURL.Value = mWebSitDomain + _imgSourceURL;

            //裁剪文件的相对路径
            hidFileRelativePath.Value = _imgSourceURL;


            //裁剪完后返回的URL
            string _cropRedirectURL = PublicClass.FilterRequestTrim("RedirectURL");

            hidCropRedirectURL.Value = _cropRedirectURL;

            //初始化裁剪相关值
            //hidMsgID.Value = PublicClass.FilterRequestTrim("MsgID"); //信息ID
            //hidCropType.Value = PublicClass.FilterRequestTrim("CropType"); //裁剪图片的类别
            //hidPrefixFileName.Value = PublicClass.FilterRequestTrim("PrefixFileName"); //文件名的前缀
            //hidSavePath.Value = PublicClass.FilterRequestTrim("SavePath"); //保存的文件路径 


            //初始化剪裁插件
            initCropZoom(_imgSourceURL);

        }

        /// <summary>
        /// 初始化剪裁插件
        /// </summary>
        /// <param name="pImgPath">本地图片路径[ Upload/RefundImgs/Rei_201802050914170560.png ]</param>
        public void initCropZoom(string pImgPath)
        {
            //得到指定路径图片，在限制宽高的条件下，重新计算的宽高值 ,与前台显示保持一致
            //string[] _widthHeightArr = getCropImgPreWidthHeight("my01.jpg", 500, 400);
            string[] _widthHeightArr = getCropImgPreWidthHeight(pImgPath, 970, 550);
            //为前台隐藏控件赋值
            hidWidthCropPre.Value = _widthHeightArr[0].ToString().Trim();
            hidHideCropPre.Value = _widthHeightArr[1].ToString().Trim();
        }

        /// <summary>
        /// 得到指定路径图片，在限制宽高的条件下，重新计算的宽高值
        /// </summary>
        /// <param name="filePath">本地图片路径 [UploadImgs/ActivityImgs/activity_01.jpg]</param>
        /// <param name="LimitWidthNum">限制的宽 [300]</param>
        /// <param name="LimitHeightNum">限制的高 [40]</param>
        /// <returns></returns>
        public string[] getCropImgPreWidthHeight(string filePath, int LimitWidthNum, int LimitHeightNum)
        {
            string[] _widthHeightArr = new string[2];

            filePath =System.Web.HttpContext.Current.Server.MapPath("~/" + filePath);

            //创建图像对方
            System.Drawing.Image image = System.Drawing.Image.FromFile(filePath);

            //得到图片最大显示区域尺寸
            float imgWidth = image.Width; //图片宽度
            float imgHeight = image.Height; //图片高度

            //释放资源 这里千万别少了，，否则会占用文件
            image.Dispose();



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

            _widthHeightArr[0] = resultWidth.ToString().Trim();
            _widthHeightArr[1] = resultHeight.ToString().Trim();

           

            return _widthHeightArr;
        }



    }
}