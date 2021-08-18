using Gma.QrCodeNet.Encoding;
using Gma.QrCodeNet.Encoding.Windows.Render;
using System;
using System.Drawing.Imaging;
using System.IO;

public partial class GetQrCodeImg : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        //获取二维码的内容字符 
        string strQrCodeContent =Server.UrlDecode(Request["QrCodeContent"].ToString().Trim()); //"http://192.168.0.224/BusiShop.aspx?SID=1";//Request["QrCodeContent"].ToString().Trim();

        // Render the QR code as an image
        using (var ms = new MemoryStream())
        {
            string stringtest = strQrCodeContent;

            createQrCode(stringtest, ms);

            Response.ContentType = "image/Png";
            Response.OutputStream.Write(ms.GetBuffer(), 0, (int)ms.Length);
            Response.End();
        }
    }



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
        int ModuleSize = 12;//大小
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


}