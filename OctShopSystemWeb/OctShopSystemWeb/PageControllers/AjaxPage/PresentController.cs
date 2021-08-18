using BusiApiHttpNS;
using EncryptionClassNS;
using PublicClassNS;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

/// <summary>
/// 【礼品】相关Ajax请求控制器
/// </summary>
namespace OctShopSystemWeb.PageControllers.AjaxPage
{
    public class PresentController : Controller
    {
        /// <summary>
        /// 发布礼品
        /// </summary>
        /// <returns></returns>
        [ValidateInput(false)]
        public string PresentAdd()
        {


            return "";

        }

        /// <summary>
        /// 编辑礼品
        /// </summary>
        /// <returns></returns>
        [ValidateInput(false)]
        public string PresentEdit()
        {


            return "";

        }

        /// <summary>
        /// 我的礼品
        /// </summary>
        /// <returns></returns>
        public string PresentMsg()
        {


            return "";
        }

        /// <summary>
        /// 礼品照片
        /// </summary>
        /// <returns></returns>
        public string PresentImgs()
        {

            return "";
        }

        /// <summary>
        /// 礼品订单
        /// </summary>
        /// <returns></returns>
        public string PresentOrderMsg()
        {

            return "";
        }



    }
}