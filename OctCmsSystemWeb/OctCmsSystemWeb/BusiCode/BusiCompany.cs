using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

/// <summary>
/// 【公司】相关业务逻辑
/// </summary>
namespace OctCmsSystemWeb
{
    public class BusiCompany
    {
        /// <summary>
        /// 构造函数
        /// </summary>
        public BusiCompany()
        {

        }

        /// <summary>
        /// 公司状态提示文本
        /// </summary>
        /// <param name="pIsCheck">审核是否通过 ( false  通过审核 /  true 加入审核)</param>
        /// <param name="pIsLock">是否锁定 ( true / false )</param>
        /// <param name="pCheckReason">审核原因</param>
        /// <returns>_backArr[2] = "#008903";</returns>
        public static string[] showCompanyStatusTxt(string pIsCheck, string pIsLock, string pCheckReason = "")
        {
            //返回数组
            string[] _backArr = new string[3];
            _backArr[2] = "";

            if (pIsCheck.ToLower() == "true")
            {
                _backArr[0] = "公司信息审核中";
                if (string.IsNullOrWhiteSpace(pCheckReason))
                {
                    _backArr[1] = "公司和相关信息审核中,无法开通店铺,开通的店铺已下线……";
                    _backArr[2] = "#FF6A00";
                }
                else
                {
                    _backArr[1] = pCheckReason;
                }

            }
            else
            {
                _backArr[0] = "公司信息正常";
                _backArr[1] = "公司资质信息审核通过，可以开通店铺……";
                _backArr[2] = "#03AD05";
            }

            if (pIsLock.ToLower() == "true")
            {
                _backArr[0] = "公司信息被锁定";
                _backArr[1] = "公司信息因异常已被官方锁定,公司下所有店铺已下线,请联系客服解决……";
                _backArr[2] = "#FF0000";
            }

            return _backArr;
        }

        /// <summary>
        /// 得到公司证件类别中文名称
        /// </summary>
        /// <param name="pCertType">证件类别 (营业执照 [ 1 ],法人身份证 [ 2 ],银行开户许可 [ 3 ],特许经营许可 [ 4 ],商标证 [ 5 ] , 商品代理授权 [ 6 ] 其他资质许可1 [ 7 ] 其他资质许可2 [ 8 ] 其他资质许可3 [ 9 ])</param>
        /// <returns></returns>
        public static string getCertTypeName(string pCertType)
        {
            if (pCertType == "1")
            {
                return "营业执照";
            }
            else if (pCertType == "2")
            {
                return "法人身份证";
            }
            else if (pCertType == "3")
            {
                return "银行开户许可";
            }
            else if (pCertType == "4")
            {
                return "特许经营许可";
            }
            else if (pCertType == "5")
            {
                return "商标证书";
            }
            else if (pCertType == "6")
            {
                return "商品代理授权";
            }
            else if (pCertType == "7")
            {
                return "其他资质许可1";
            }
            else if (pCertType == "8")
            {
                return "其他资质许可2";
            }
            else if (pCertType == "9")
            {
                return "其他资质许可3";
            }
            else
            {
                return "";
            }
        }

    }
}