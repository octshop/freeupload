using BusiApiKeyVerifyNS;
using BusiExpressTracesNS;
using PublicClassNS;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

/// <summary>
/// 【快递查询与跟踪】相关Api接口控制器
/// </summary>
namespace OctThirdApiCallSystemWeb.PageControllers.ApiPage
{
    public class ExpressController : Controller
    {
        // GET: Express
        public ActionResult Index()
        {
            return View();
        }

        /// <summary>
        /// 查询快递跟踪信息
        /// </summary>
        /// <returns></returns>
        public string ExpressTraces()
        {
            //验证RndKeyRsa是否正确
            bool _verifySu = BusiApiKeyVerify.verifyRndKeyRSARequest();
            if (_verifySu == false)
            {
                return "";
            }

            //获取操作类型  Type=1 搜索分页数据
            string _exeType = PublicClass.FilterRequestTrim("Type");
            if (_exeType == "1")
            {
                //获取传递的参数

                //快递单号
                string ExpressNumber = PublicClass.FilterRequestTrim("ExpressNumber");
                //快递类别代号
                string ExpressType = PublicClass.FilterRequestTrim("ExpressType");

                //查询快递物流信息 --API方法
                string _jsonBack = BusiExpressAliCloudApi.searchExpressMsgListApi(ExpressNumber, ExpressType);

                return _jsonBack;
            }

            return "";
            /*

            {
                   "Status": "0",
                   "Msg": "查询成功",
                   "TypeName": "STO",
                   "ExpName": "申通快递",
                   "ExpNumber": "777029897955798",
                   "ExpPhone": "95543",
                   "ExpSite": "www.sto.cn ",
                   "ExpList": [{
                       "Time": "2020-12-06 09:21:01",
                       "Status": "湖南长沙转运中心-已发往-湖南长沙中南公司"
                   }, {
                       "Time": "2020-12-06 09:20:20",
                       "Status": "已到达-湖南长沙转运中心"
                   }, {
                       "Time": "2020-12-06 09:05:38",
                       "Status": "已到达-湖南长沙转运中心"
                   }, {
                       "Time": "2020-12-05 19:40:09",
                       "Status": "浙江义乌公司-已发往-湖南长沙转运中心"
                   }, {
                       "Time": "2020-12-05 18:59:39",
                       "Status": "浙江义乌公司-李放-已收件"
                   }]
               }


            */

        }



    }
}