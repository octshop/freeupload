

--====================OctAdvertiserSystemDB============================--

use OctAdvertiserSystemDB

select * from Adv_Carousel
update Adv_Carousel set ImgURL= replace(ImgURL, 'fu.opencodetiger.com/', 'fu.xxxx.com/');

select * from Adv_ImgList
update Adv_ImgList set ImgURL= replace(ImgURL, 'fu.opencodetiger.com/', 'fu.xxxx.com/');

select * from Nav_IconMsg
update Nav_IconMsg set IconUrl= replace(IconUrl, 'fu.opencodetiger.com/', 'fu.xxxx.com/');

select * from Rcd_GoodsShop
select * from Search_FindMsg
select * from Search_HistoryGoodsShop


--====================OctAfterSaleAccCusDB============================--

use OctAfterSaleAccCusDB

select * from Admin_PowerMsg
select * from Admin_UserMsg
select * from AfterSale_ApplyMsg
select * from AfterSale_Delivery

select * from AfterSale_ProblemImgs
update AfterSale_ProblemImgs set ImgPath= replace(ImgPath, 'fu.opencodetiger.com/', 'fu.xxxx.com/');
update AfterSale_ProblemImgs set ImgPath= replace(ImgPath, 'fu.opencodetiger.com/', 'fu.xxxx.com/');


select * from AfterSale_SendGoods
select * from Buyer_SysMsg

select * from Explain_Text
update Explain_Text set ExplainContent= replace(ExplainContent, '//fu.opencodetiger.com/Upload/', '//fu.xxxx.com/Upload/');

select * from Order_ComplainMsg
select * from Platform_SysMsg
select * from Refund_ApplyMsg
select * from Refund_ProblemImgs
select * from Refund_SendGoods
select * from Shop_SysMsg


--====================OctFileUploadSystemDB============================--


use OctFileUploadSystemDB

select * from Activity_Img
update Activity_Img set ServerDomain= replace(ServerDomain, 'fu.opencodetiger.com', 'fu.xxxx.com');

select * from Adv_BannerImg
--update Adv_BannerImg set ServerDomain= replace(ServerDomain, 'fu.opencodetiger.com', 'fu.xxxx.com');

select * from Adv_CarouselImg
update Adv_CarouselImg set ServerDomain= replace(ServerDomain, 'fu.opencodetiger.com', 'fu.xxxx.com');
update Adv_CarouselImg set ServerDomain= replace(ServerDomain, 'fu.opencodetiger.com', 'fu.xxxx.com');

select * from Adv_ImgListImg
update Adv_ImgListImg set ServerDomain= replace(ServerDomain, 'fu.opencodetiger.com', 'fu.xxxx.com');
update Adv_ImgListImg set ServerDomain= replace(ServerDomain, 'fu.opencodetiger.com', 'fu.xxxx.com');

select * from AfterSale_ProblemImgs
update AfterSale_ProblemImgs set ServerDomain= replace(ServerDomain, 'fu.opencodetiger.com', 'fu.xxxx.com');
update AfterSale_ProblemImgs set ServerDomain= replace(ServerDomain, 'fu.opencodetiger.com', 'fu.xxxx.com');

select * from Buyer_HeaderImg
update Buyer_HeaderImg set ServerDomain= replace(ServerDomain, 'fu.opencodetiger.com', 'fu.xxxx.com');

select * from Company_CertificateImg
update Company_CertificateImg set ServerDomain= replace(ServerDomain, 'fu.opencodetiger.com', 'fu.xxxx.com');
update Company_CertificateImg set ServerDomain= replace(ServerDomain, 'fu.opencodetiger.com', 'fu.xxxx.com');

select * from Distri_IDCardImg
select * from Distri_OwnerSelfieImg
select * from Distri_ShopHeaderImg
select * from Distri_ShopLogoImg

select * from Explain_Img
update Explain_Img set ServerDomain= replace(ServerDomain, 'fu.opencodetiger.com', 'fu.xxxx.com');

select * from Goo_AppraiseImg
update Goo_AppraiseImg set ServerDomain= replace(ServerDomain, 'fu.opencodetiger.com', 'fu.xxxx.com');
update Goo_AppraiseImg set ServerDomain= replace(ServerDomain, 'fu.opencodetiger.com', 'fu.xxxx.com');

select * from Goo_GiftImg
update Goo_GiftImg set ServerDomain= replace(ServerDomain, 'fu.opencodetiger.com', 'fu.xxxx.com');
update Goo_GiftImg set ServerDomain= replace(ServerDomain, 'fu.opencodetiger.com', 'fu.xxxx.com');

select * from Goo_GoodsImg
update Goo_GoodsImg set ServerDomain= replace(ServerDomain, 'fu.opencodetiger.com', 'fu.xxxx.com');
update Goo_GoodsImg set ServerDomain= replace(ServerDomain, 'fu.opencodetiger.com', 'fu.xxxx.com');

select * from Goo_GoodsTypeIcon
update Goo_GoodsTypeIcon set ServerDomain= replace(ServerDomain, 'fu.opencodetiger.com', 'fu.xxxx.com');
update Goo_GoodsTypeIcon set ServerDomain= replace(ServerDomain, 'fu.opencodetiger.com', 'fu.xxxx.com');

select * from Goo_SpecParamImg
update Goo_SpecParamImg set ServerDomain= replace(ServerDomain, 'fu.opencodetiger.com', 'fu.xxxx.com');
update Goo_SpecParamImg set ServerDomain= replace(ServerDomain, 'fu.opencodetiger.com', 'fu.xxxx.com');

select * from LuckyDraw_Img
update LuckyDraw_Img set ServerDomain= replace(ServerDomain, 'fu.opencodetiger.com', 'fu.xxxx.com');
update LuckyDraw_Img set ServerDomain= replace(ServerDomain, 'fu.opencodetiger.com', 'fu.xxxx.com');

select * from Nav_IconImg
update Nav_IconImg set ServerDomain= replace(ServerDomain, 'fu.opencodetiger.com', 'fu.xxxx.com');
update Nav_IconImg set ServerDomain= replace(ServerDomain, 'fu.opencodetiger.com', 'fu.xxxx.com');

select * from Pay_TransCertImg
update Pay_TransCertImg set ServerDomain= replace(ServerDomain, 'fu.opencodetiger.com', 'fu.xxxx.com');
update Pay_TransCertImg set ServerDomain= replace(ServerDomain, 'fu.opencodetiger.com', 'fu.xxxx.com');

select * from Present_Img
update Present_Img set ServerDomain= replace(ServerDomain, 'fu.opencodetiger.com', 'fu.xxxx.com');
update Present_Img set ServerDomain= replace(ServerDomain, 'fu.opencodetiger.com', 'fu.xxxx.com');

select * from Refund_ProblemImgs
update Refund_ProblemImgs set ServerDomain= replace(ServerDomain, 'fu.opencodetiger.com', 'fu.xxxx.com');
update Refund_ProblemImgs set ServerDomain= replace(ServerDomain, 'fu.opencodetiger.com', 'fu.xxxx.com');

select * from Settle_CertificateImg
update Settle_CertificateImg set ServerDomain= replace(ServerDomain, 'fu.opencodetiger.com', 'fu.xxxx.com');
update Settle_CertificateImg set ServerDomain= replace(ServerDomain, 'fu.opencodetiger.com', 'fu.xxxx.com');

select * from Settle_TransferVoucherImg
update Settle_TransferVoucherImg set ServerDomain= replace(ServerDomain, 'fu.opencodetiger.com', 'fu.xxxx.com');
update Settle_TransferVoucherImg set ServerDomain= replace(ServerDomain, 'fu.opencodetiger.com', 'fu.xxxx.com');

select * from Shop_AlbumImg
update Shop_AlbumImg set ServerDomain= replace(ServerDomain, 'fu.opencodetiger.com', 'fu.xxxx.com');
update Shop_AlbumImg set ServerDomain= replace(ServerDomain, 'fu.opencodetiger.com', 'fu.xxxx.com');

select * from Shop_CarouselImg
update Shop_CarouselImg set ServerDomain= replace(ServerDomain, 'fu.opencodetiger.com', 'fu.xxxx.com');
update Shop_CarouselImg set ServerDomain= replace(ServerDomain, 'fu.opencodetiger.com', 'fu.xxxx.com');

select * from Shop_HeaderImg
update Shop_HeaderImg set ServerDomain= replace(ServerDomain, 'fu.opencodetiger.com', 'fu.xxxx.com');
update Shop_HeaderImg set ServerDomain= replace(ServerDomain, 'fu.opencodetiger.com', 'fu.xxxx.com');

select * from Shop_LogoImg
update Shop_LogoImg set ServerDomain= replace(ServerDomain, 'fu.opencodetiger.com', 'fu.xxxx.com');
update Shop_LogoImg set ServerDomain= replace(ServerDomain, 'fu.opencodetiger.com', 'fu.xxxx.com');

select * from Shop_TypeIcon
update Shop_TypeIcon set ServerDomain= replace(ServerDomain, 'fu.opencodetiger.com', 'fu.xxxx.com');
update Shop_TypeIcon set ServerDomain= replace(ServerDomain, 'fu.opencodetiger.com', 'fu.xxxx.com');


--====================OctImSystemDB============================--

use OctImSystemDB

select * from Chat_Imgs

select * from Chat_MemberList
delete from Chat_MemberList

delete from Chat_Msg

select * from Shop_Account
update Shop_Account set ShopHeaderImg= replace(ShopHeaderImg, '192.168.3.10:1900', 'oim.opencodetiger.com');
update Shop_Account set ShopHeaderImg= replace(ShopHeaderImg, 'fu.opencodetiger.com', 'fu.xxxx.com');
update Shop_Account set ShopHeaderImg= replace(ShopHeaderImg, '192.168.3.10:6688', 'oim.opencodetiger.com');

select * from Shop_OnLineUserList
delete from Sms_SendMsg

select * from User_VisitEnter
delete from User_VisitEnter



--====================OctThirdApiCallSystemDB============================--

use OctThirdApiCallSystemDB
delete from Sms_SendMsg


--====================OctTradingSystemDB============================--

use OctTradingSystemDB

select * from Buyer_WithDraw

select * from Pay_TransBankMsg

select * from Pay_TransRecord
update Pay_TransRecord set TransCertImg= replace(TransCertImg, 'fu.opencodetiger.com', 'fu.xxxx.com');

select * from Settle_Apply
update Settle_Apply set TransferVoucherImg= replace(TransferVoucherImg, 'fu.opencodetiger.com', 'fu.xxxx.com');


--====================OctUserGoodsShopSystemDB============================--

use OctUserGoodsShopSystemDB

select * from Activity_Imgs
update Activity_Imgs set ImgURL= replace(ImgURL, 'fu.opencodetiger.com/', 'fu.xxxx.com/');
update Activity_Imgs set ImgURL= replace(ImgURL, 'fu.opencodetiger.com/', 'fu.xxxx.com/');


select * from Activity_Join
update Activity_Join set HeaderImg= replace(HeaderImg, 'fu.opencodetiger.com/', 'fu.xxxx.com/');

select * from Activity_Msg
update Activity_Msg set AcCoverImg= replace(AcCoverImg, 'fu.opencodetiger.com/', 'fu.xxxx.com/');
update Activity_Msg set AcCoverImg= replace(AcCoverImg, 'fu.opencodetiger.com/', 'fu.xxxx.com/');

select * from Buyer_Msg
update Buyer_Msg set HeaderImg= replace(HeaderImg, 'fu.opencodetiger.com/', 'fu.xxxx.com/');

select * from Company_Certificate
update Company_Certificate set CertImg= replace(CertImg, 'fu.opencodetiger.com/', 'fu.xxxx.com/');
update Company_Certificate set CertImg= replace(CertImg, 'fu.opencodetiger.com/', 'fu.xxxx.com/');

select * from Goo_AppraiseImgs
update Goo_AppraiseImgs set ImgUrl= replace(ImgUrl, 'fu.opencodetiger.com/', 'fu.xxxx.com/');
update Goo_AppraiseImgs set ImgUrl= replace(ImgUrl, 'fu.opencodetiger.com/', 'fu.xxxx.com/');

select * from Goo_GiftImg
update Goo_GiftImg set ImgUrl= replace(ImgUrl, 'fu.opencodetiger.com/', 'fu.xxxx.com/');
update Goo_GiftImg set ImgUrl= replace(ImgUrl, 'fu.opencodetiger.com/', 'fu.xxxx.com/');

select * from Goo_GiftMsg
update Goo_GiftMsg set GiftImgUrl= replace(GiftImgUrl, 'fu.opencodetiger.com/', 'fu.xxxx.com/');
update Goo_GiftMsg set GiftImgUrl= replace(GiftImgUrl, 'fu.opencodetiger.com/', 'fu.xxxx.com/');

update Goo_GiftMsg set GiftDesc= replace(GiftDesc, 'fu.opencodetiger.com/', 'fu.xxxx.com/');
update Goo_GiftMsg set GiftDesc= replace(GiftDesc, 'fu.opencodetiger.com/', 'fu.xxxx.com/');

select * from Goo_GoodsImg
update Goo_GoodsImg set ImgPath= replace(ImgPath, 'fu.opencodetiger.com/', 'fu.xxxx.com/');
update Goo_GoodsImg set ImgPath= replace(ImgPath, 'fu.opencodetiger.com/', 'fu.xxxx.com/');

select * from Goo_GoodsMsg order by PageOrder desc
update Goo_GoodsMsg set GoodsDesc= replace(GoodsDesc, 'fu.opencodetiger.com/', 'fu.xxxx.com/');
update Goo_GoodsMsg set GoodsDesc= replace(GoodsDesc, 'fu.opencodetiger.com/', 'fu.xxxx.com/');


select * from Goo_GoodsType
update Goo_GoodsType set TypeIcon= replace(TypeIcon, 'fu.opencodetiger.com/', 'fu.xxxx.com/');
update Goo_GoodsType set TypeIcon= replace(TypeIcon, 'fu.opencodetiger.com/', 'fu.xxxx.com/');

select * from Goo_SpecParam
update Goo_SpecParam set SpecParamImg= replace(SpecParamImg, 'fu.opencodetiger.com/', 'fu.xxxx.com/');
update Goo_SpecParam set SpecParamImg= replace(SpecParamImg, 'fu.opencodetiger.com/', 'fu.xxxx.com/');

select * from Group_CreateMsg
update Group_CreateMsg set HeaderImg= replace(HeaderImg, 'fu.opencodetiger.com/', 'fu.xxxx.com/');

select * from Group_JoinMsg
update Group_JoinMsg set HeaderImg= replace(HeaderImg, 'fu.opencodetiger.com/', 'fu.xxxx.com/');

select * from LuckyDraw_Imgs
update LuckyDraw_Imgs set ImgURL= replace(ImgURL, 'fu.opencodetiger.com/', 'fu.xxxx.com/');
update LuckyDraw_Imgs set ImgURL= replace(ImgURL, 'fu.opencodetiger.com/', 'fu.xxxx.com/');

select * from LuckyDraw_JoinMsg
update LuckyDraw_JoinMsg set HeaderImg= replace(HeaderImg, 'fu.opencodetiger.com/', 'fu.xxxx.com/');
update LuckyDraw_JoinMsg set HeaderImg= replace(HeaderImg, 'fu.opencodetiger.com/', 'fu.xxxx.com/');

select * from LuckyDraw_Msg
update LuckyDraw_Msg set CoverImgUrl= replace(CoverImgUrl, 'fu.opencodetiger.com/', 'fu.xxxx.com/');
update LuckyDraw_Msg set CoverImgUrl= replace(CoverImgUrl, 'fu.opencodetiger.com/', 'fu.xxxx.com/');

select * from Present_Imgs
update Present_Imgs set ImgURL= replace(ImgURL, 'fu.opencodetiger.com/', 'fu.xxxx.com/');
update Present_Imgs set ImgURL= replace(ImgURL, 'fu.opencodetiger.com/', 'fu.xxxx.com/');

select * from Present_Msg
update Present_Msg set PresentDesc= replace(PresentDesc, 'fu.opencodetiger.com/', 'fu.xxxx.com/');
update Present_Msg set PresentDesc= replace(PresentDesc, 'fu.opencodetiger.com/', 'fu.xxxx.com/');

select * from Shop_Carousel
update Shop_Carousel set ImgURL= replace(ImgURL, 'fu.opencodetiger.com/', 'fu.xxxx.com/');
update Shop_Carousel set ImgURL= replace(ImgURL, 'fu.opencodetiger.com/', 'fu.xxxx.com/');

select * from Shop_LogoImg
update Shop_LogoImg set ImgURL= replace(ImgURL, 'fu.opencodetiger.com/', 'fu.xxxx.com/');
update Shop_LogoImg set ImgURL= replace(ImgURL, 'fu.opencodetiger.com/', 'fu.xxxx.com/');

select * from Shop_Msg
update Shop_Msg set ShopHeaderImg= replace(ShopHeaderImg, 'fu.opencodetiger.com/', 'fu.xxxx.com/');
update Shop_Msg set ShopHeaderImg= replace(ShopHeaderImg, 'fu.opencodetiger.com/', 'fu.xxxx.com/');

select * from Shop_Type
update Shop_Type set TypeIcon= replace(TypeIcon, 'fu.opencodetiger.com/', 'fu.xxxx.com/');
update Shop_Type set TypeIcon= replace(TypeIcon, 'fu.opencodetiger.com/', 'fu.xxxx.com/');

