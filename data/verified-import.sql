-- CV Verified Contractors Import
-- Source: contractorverifiedatx.com
-- Scraped: 2026-02-28

-- Add columns if needed
ALTER TABLE contractors ADD COLUMN logo_url TEXT;
ALTER TABLE contractors ADD COLUMN source TEXT;

-- ELECTRICIANS (17)
INSERT OR REPLACE INTO contractors (name, phone, specialty, logo_url, verification_level, source, created_at) VALUES
('Home and Office Power Solutions', '254-444-7244', 'Electrician', 'https://static.wixstatic.com/media/4e462c_2d5ec06f45f44a96bafac8eba45c16ff~mv2.png', 'verified', 'contractorverifiedatx.com', datetime('now')),
('Mikcor Electric', '512-677-1394', 'Electrician', 'https://static.wixstatic.com/media/4e462c_c460999c1cab4627b3f64cae85c0c914~mv2.png', 'verified', 'contractorverifiedatx.com', datetime('now')),
('Hutto Electrical Services', '512-905-9727', 'Electrician', 'https://static.wixstatic.com/media/4e462c_a14fccd179bb4c3fa2d42db6473b3042~mv2.jpg', 'verified', 'contractorverifiedatx.com', datetime('now')),
('Reese Electric', '737-704-9325', 'Electrician', 'https://static.wixstatic.com/media/488f34_72cce80a53ad41e581161b429fe5e5c3~mv2.jpeg', 'verified', 'contractorverifiedatx.com', datetime('now')),
('Irwin Electric LLC', '512-689-3624', 'Electrician', 'https://static.wixstatic.com/media/4e462c_2a719a2090764ed3bccd4019a327e5c6~mv2.jpg', 'verified', 'contractorverifiedatx.com', datetime('now')),
('J.G & I Electrical Contractor', '512-644-2733', 'Electrician', 'https://static.wixstatic.com/media/b57309_149fb1aa3e5843539a12c88f8c0a2dcf~mv2.jpg', 'verified', 'contractorverifiedatx.com', datetime('now')),
('Ortiz Electrical Services', '512-817-0456', 'Electrician', 'https://static.wixstatic.com/media/8d360e_2916ae5e6b2e41e0afda9c2aa7831f39~mv2.jpeg', 'verified', 'contractorverifiedatx.com', datetime('now')),
('82nd Electric', '512-365-9162', 'Electrician', 'https://static.wixstatic.com/media/4e462c_ba6a2acec8754c8a87b1ef3c2ce74210~mv2.jpg', 'verified', 'contractorverifiedatx.com', datetime('now')),
('We Love Electric', '512-718-5567', 'Electrician', 'https://static.wixstatic.com/media/deba79_a04c72163efb48a2aad36f8bd13dc3cc~mv2.png', 'verified', 'contractorverifiedatx.com', datetime('now')),
('MCTZ Electric', '512-620-6034', 'Electrician', 'https://static.wixstatic.com/media/62098a_c6411e3f91c446ac86b1951ea07c9347~mv2.jpeg', 'verified', 'contractorverifiedatx.com', datetime('now')),
('Main Source Electric', '830-556-4694', 'Electrician', 'https://static.wixstatic.com/media/e1ff27_a94a4b53e89d4ec8a950b76c552139a3~mv2.png', 'verified', 'contractorverifiedatx.com', datetime('now')),
('Rise Electrical Contracting', '979-702-2315', 'Electrician', 'https://static.wixstatic.com/media/4e462c_0d36691f2a2e48759d0afc187adc8f34~mv2.png', 'verified', 'contractorverifiedatx.com', datetime('now')),
('Mireles Innovation Group', '737-888-1486', 'Electrician', 'https://static.wixstatic.com/media/1bdac9_97273856fec846a7892dee074e876d5a~mv2.jpeg', 'verified', 'contractorverifiedatx.com', datetime('now')),
('Watts Up Electric', '512-998-0124', 'Electrician', 'https://static.wixstatic.com/media/8e3b8a_561d42a1d8bb4e6eac94c2b7f111bc33~mv2.png', 'verified', 'contractorverifiedatx.com', datetime('now')),
('Taymar Electric', '512-893-1679', 'Electrician', 'https://static.wixstatic.com/media/c91290_0348ce47b6ca465f8ba62ae0415876ac~mv2.png', 'verified', 'contractorverifiedatx.com', datetime('now')),
('M-1 Electric', '512-619-6095', 'Electrician', 'https://static.wixstatic.com/media/4e462c_81ffe034f893426aa18812f78fdbcf90~mv2.jpg', 'verified', 'contractorverifiedatx.com', datetime('now')),
('LDS Services', '512-000-0000', 'Electrician', 'https://static.wixstatic.com/media/4e462c_d72f94f7a8564e1881a157d6dabe5742~mv2.jpeg', 'verified', 'contractorverifiedatx.com', datetime('now'));

-- PAINTERS (18)
INSERT OR REPLACE INTO contractors (name, phone, specialty, logo_url, verification_level, source, created_at) VALUES
('Capital Painting & Refinishing', '737-262-7900', 'Painter', 'https://static.wixstatic.com/media/4e462c_026ef7b9c2604034bf00f1354d0a377c~mv2.png', 'verified', 'contractorverifiedatx.com', datetime('now')),
('The Habitat Heroes', '512-228-4851', 'Painter', 'https://static.wixstatic.com/media/4e462c_ff2778648ebc40668beda38be9cc7e86~mv2.png', 'verified', 'contractorverifiedatx.com', datetime('now')),
('Wow 1 Day Painting', '512-382-5093', 'Painter', 'https://static.wixstatic.com/media/e9b920_100e2871381343e4807a8b5a2f20d2ca~mv2.jpeg', 'verified', 'contractorverifiedatx.com', datetime('now')),
('CBC Painting', '337-309-3208', 'Painter', 'https://static.wixstatic.com/media/2a5906_804727dd85f2486eb91e1e357b1e1118~mv2.png', 'verified', 'contractorverifiedatx.com', datetime('now')),
('Atx Elite Painting', '512-897-3265', 'Painter', 'https://static.wixstatic.com/media/4e462c_a12ed6950425474aa48c4dd4f247fc70~mv2.png', 'verified', 'contractorverifiedatx.com', datetime('now')),
('Lion Painting & Services', '512-810-6854', 'Painter', 'https://static.wixstatic.com/media/b519f4_856e3ebaaf30449f8a0d3fe8ee0f629f~mv2.png', 'verified', 'contractorverifiedatx.com', datetime('now')),
('Clean Coat Painting', '512-484-7985', 'Painter', 'https://static.wixstatic.com/media/393efb_23ef95f2f73a488aa45d91415c7cacd6~mv2.png', 'verified', 'contractorverifiedatx.com', datetime('now')),
('Austin Professional Painting', '512-845-7821', 'Painter', 'https://static.wixstatic.com/media/545133_6b7ffee0589b4d8c90a96a36852e197d~mv2.jpg', 'verified', 'contractorverifiedatx.com', datetime('now')),
('MVA Painters', '512-573-9932', 'Painter', 'https://static.wixstatic.com/media/f561b1_cb8be7c3bdc146adb054fcec66a0f619~mv2.jpeg', 'verified', 'contractorverifiedatx.com', datetime('now')),
('Kings Painters', '512-538-6029', 'Painter', 'https://static.wixstatic.com/media/fbcf62_667400c506404561b039457841260776~mv2.jpeg', 'verified', 'contractorverifiedatx.com', datetime('now')),
('TXB Construction Services', '830-352-4295', 'Painter', 'https://static.wixstatic.com/media/046acc_742ee9846c0a43eb8149d822b453f664~mv2.png', 'verified', 'contractorverifiedatx.com', datetime('now')),
('Precision Services of Austin', '512-856-5080', 'Painter', 'https://static.wixstatic.com/media/4c2e4c_9491335175a64c64a2facea5173e6815~mv2.jpg', 'verified', 'contractorverifiedatx.com', datetime('now')),
('Austin Painting & Drywall', '512-993-0948', 'Painter', 'https://static.wixstatic.com/media/2688b2_67580bf3b3e6479181743ca940f13e61~mv2.jpeg', 'verified', 'contractorverifiedatx.com', datetime('now')),
('Alliance Construction and Renovation', '832-434-2364', 'Painter', 'https://static.wixstatic.com/media/4e462c_902ec33c4d5d4a87a5bf518cbc1cdd61~mv2.png', 'verified', 'contractorverifiedatx.com', datetime('now')),
('Painterall Residential Painting', '512-679-6761', 'Painter', 'https://static.wixstatic.com/media/4e462c_33d1e0c2493644b1989601f49104e951~mv2.jpeg', 'verified', 'contractorverifiedatx.com', datetime('now')),
('Joses Remodel', '806-676-7643', 'Painter', 'https://static.wixstatic.com/media/4e462c_c65fe7d13337496e94801155f17686cd~mv2.jpg', 'verified', 'contractorverifiedatx.com', datetime('now')),
('ABG Painting & Handyman', '512-497-1359', 'Painter', 'https://static.wixstatic.com/media/4e462c_5083a85aeb934cb7b7691f50fb399578~mv2.jpg', 'verified', 'contractorverifiedatx.com', datetime('now')),
('Paintegrity', '512-888-2743', 'Painter', 'https://static.wixstatic.com/media/caed3e_48a80b8cba4c4e1c83361d281a25576c~mv2.png', 'verified', 'contractorverifiedatx.com', datetime('now'));

-- CONCRETE (18)
INSERT OR REPLACE INTO contractors (name, phone, specialty, logo_url, verification_level, source, created_at) VALUES
('Capital Construction', '512-988-3666', 'Concrete', 'https://static.wixstatic.com/media/4e462c_dae7d1d0d05644bdae4a69fbd883c8ec~mv2.jpg', 'verified', 'contractorverifiedatx.com', datetime('now')),
('Outdoor Living Care', '512-809-2143', 'Concrete', 'https://static.wixstatic.com/media/b45fb0_12fc36efc1fd44238cf7fadddf28c12e~mv2.jpg', 'verified', 'contractorverifiedatx.com', datetime('now')),
('AJs Concrete', '512-809-0512', 'Concrete', 'https://static.wixstatic.com/media/7fe033_4be9c4fd6160454bbe5f1c30e768302a~mv2.jpeg', 'verified', 'contractorverifiedatx.com', datetime('now')),
('Concrete Unlimited LLC', '713-835-1411', 'Concrete', 'https://static.wixstatic.com/media/4e462c_941e3516add84d38b26ab70ab30d71ce~mv2.jpg', 'verified', 'contractorverifiedatx.com', datetime('now')),
('4B Construction', '469-688-2649', 'Concrete', 'https://static.wixstatic.com/media/4e462c_87b302e1455c41f7ae5a71d7fbfeca07~mv2.jpeg', 'verified', 'contractorverifiedatx.com', datetime('now')),
('Texas First Concrete', '512-635-8573', 'Concrete', 'https://static.wixstatic.com/media/8bd4c9_c768a251152d4e948b1a44d15800cd1d~mv2.png', 'verified', 'contractorverifiedatx.com', datetime('now')),
('Austin Little Batches', '512-877-6656', 'Concrete', 'https://static.wixstatic.com/media/d50842_9a6a990133254aa39dc4200da4b78fdd~mv2.png', 'verified', 'contractorverifiedatx.com', datetime('now')),
('GTO Concrete', '512-705-3527', 'Concrete', 'https://static.wixstatic.com/media/1e37d8_fc308dbf9fba4dbda3a2d9b7b773564b~mv2.jpg', 'verified', 'contractorverifiedatx.com', datetime('now')),
('Superior Concrete Construction', '210-489-9460', 'Concrete', 'https://static.wixstatic.com/media/081a19_1657979da5c84939add259acc15c5d14~mv2.jpg', 'verified', 'contractorverifiedatx.com', datetime('now')),
('ScanXConcrete', '512-828-9904', 'Concrete', 'https://static.wixstatic.com/media/589ce1_c09f009deb6a4f129816db5484dd96e3~mv2.png', 'verified', 'contractorverifiedatx.com', datetime('now')),
('EP Concrete & Construction', '512-998-3199', 'Concrete', 'https://static.wixstatic.com/media/4e462c_fc09b3cef47f476190e37705fb6d6835~mv2.png', 'verified', 'contractorverifiedatx.com', datetime('now')),
('TRUE Construction LLC', '737-362-9471', 'Concrete', 'https://static.wixstatic.com/media/4e462c_ba4cc3b75bc44c8c9f0a518f21aa1669~mv2.png', 'verified', 'contractorverifiedatx.com', datetime('now')),
('LJM Concrete', '512-703-7105', 'Concrete', 'https://static.wixstatic.com/media/4e462c_6d6e814b9ee244869a3ac6232bb2a6f5~mv2.jpeg', 'verified', 'contractorverifiedatx.com', datetime('now')),
('Winsome Concrete Finishes', '512-800-3282', 'Concrete', 'https://static.wixstatic.com/media/5560e2_eedd945af33f4290ae104cbae05cec27~mv2.png', 'verified', 'contractorverifiedatx.com', datetime('now')),
('Terrazas of Texas', '512-217-9460', 'Concrete', 'https://static.wixstatic.com/media/4e462c_ddd57fa00fae4b4eb97650ed83a74b58~mv2.png', 'verified', 'contractorverifiedatx.com', datetime('now')),
('NS CONCRETE', '512-287-0554', 'Concrete', 'https://static.wixstatic.com/media/4e462c_396ddd44662c439e96f9ff886ecac75b~mv2.png', 'verified', 'contractorverifiedatx.com', datetime('now')),
('Stealth Civil Contracting', '512-922-9215', 'Concrete', NULL, 'verified', 'contractorverifiedatx.com', datetime('now')),
('HT Concrete & Excavation', '512-635-9105', 'Concrete', 'https://static.wixstatic.com/media/4e462c_cb1c086d5f6d4467ab23dd014d7c9dcb~mv2.jpg', 'verified', 'contractorverifiedatx.com', datetime('now'));

-- GENERAL CONSTRUCTION (30)
INSERT OR REPLACE INTO contractors (name, phone, specialty, logo_url, verification_level, source, created_at) VALUES
('The Standard Construction', '512-444-1555', 'General Construction', 'https://static.wixstatic.com/media/4e462c_cd367b11af0e4418aebded3a599892f2~mv2.png', 'verified', 'contractorverifiedatx.com', datetime('now')),
('Sky-Lan Services', '512-563-7302', 'General Construction', 'https://static.wixstatic.com/media/193c51_e7faf5aaebca4183bd9d50ceb2f82b62~mv2.jpg', 'verified', 'contractorverifiedatx.com', datetime('now')),
('Build Space Cowboy', '512-781-8265', 'General Construction', 'https://static.wixstatic.com/media/4e462c_19f7a8e3101b45d7a8b1a7ebb3eec382~mv2.jpeg', 'verified', 'contractorverifiedatx.com', datetime('now')),
('Acosta Remodeling & Much More LLC', '210-812-9003', 'General Construction', 'https://static.wixstatic.com/media/4e462c_dea3efa5a4c8424b97619bd6f79f4665~mv2.jpeg', 'verified', 'contractorverifiedatx.com', datetime('now')),
('Maddison Homes', '512-402-5440', 'General Construction', 'https://static.wixstatic.com/media/7cb5d6_823aa41606cf4feab0eb1ba61a24c8e8~mv2.png', 'verified', 'contractorverifiedatx.com', datetime('now')),
('Aarons Handyman & Contracting', '512-410-9258', 'General Construction', 'https://static.wixstatic.com/media/4e462c_ec805662568a40b8a697327f7bc1c5ff~mv2.jpg', 'verified', 'contractorverifiedatx.com', datetime('now')),
('Impact Building', '512-364-5350', 'General Construction', 'https://static.wixstatic.com/media/4e462c_f7f06a9c075f47d88c22fb41f0bb5d3a~mv2.png', 'verified', 'contractorverifiedatx.com', datetime('now')),
('Martin Squared Contracting', '512-644-4430', 'General Construction', 'https://static.wixstatic.com/media/4e462c_0571bbf12af446a2966c69199d161e12~mv2.png', 'verified', 'contractorverifiedatx.com', datetime('now')),
('Proper 3 Renovations', '512-588-4550', 'General Construction', 'https://static.wixstatic.com/media/5ff82b_cfb341e79ae64be6b95579f15123c208~mv2.jpeg', 'verified', 'contractorverifiedatx.com', datetime('now')),
('Recomain LLC', '512-888-3629', 'General Construction', 'https://static.wixstatic.com/media/4e462c_ebe19b4f057c4ee6b5d793589473bcca~mv2.png', 'verified', 'contractorverifiedatx.com', datetime('now')),
('Jaramillo Services', '512-931-9384', 'General Construction', 'https://static.wixstatic.com/media/4e462c_fc97d4826df8455daf4a3e2ec10863c5~mv2.jpg', 'verified', 'contractorverifiedatx.com', datetime('now')),
('Niesen Construction', '512-503-2711', 'General Construction', 'https://static.wixstatic.com/media/4e462c_a4d740f038974b14b4185880ab8b5d96~mv2.webp', 'verified', 'contractorverifiedatx.com', datetime('now')),
('Baig Developers', '214-519-3196', 'General Construction', 'https://static.wixstatic.com/media/4e462c_f9adcf44455247658e1a7981a97579a9~mv2.png', 'verified', 'contractorverifiedatx.com', datetime('now')),
('Alcantara Design', '800-549-3152', 'General Construction', 'https://static.wixstatic.com/media/ba2e77_4281b51e2eb447969a0d1897a0940f49~mv2.jpeg', 'verified', 'contractorverifiedatx.com', datetime('now')),
('Aldairs Construction', '832-651-9198', 'General Construction', 'https://static.wixstatic.com/media/4e462c_290c6b69c16c4565a843c7ae4f8679a1~mv2.jpg', 'verified', 'contractorverifiedatx.com', datetime('now')),
('Brick By Brick Construction LLC', '630-528-7198', 'General Construction', 'https://static.wixstatic.com/media/4e462c_f1269e7dc47344e9bda6b83df57511b9~mv2.png', 'verified', 'contractorverifiedatx.com', datetime('now')),
('S&J Remodeling', '907-227-9434', 'General Construction', 'https://static.wixstatic.com/media/4e462c_76bd5cf5ae2b41b680da76e41609d38d~mv2.jpeg', 'verified', 'contractorverifiedatx.com', datetime('now')),
('J.Cruz Landscaping Services', '512-696-9163', 'General Construction', 'https://static.wixstatic.com/media/33660c_ff1ddd4ecc2b431e83c620a682c8f9f6~mv2.jpg', 'verified', 'contractorverifiedatx.com', datetime('now')),
('Complete Remodeling', '512-809-5466', 'General Construction', 'https://static.wixstatic.com/media/697669_22f0044706a54b86ae3cf5c92ae0f05c~mv2.png', 'verified', 'contractorverifiedatx.com', datetime('now')),
('Oak & Stone Residential', '737-262-4369', 'General Construction', 'https://static.wixstatic.com/media/1603eb_6aa88db619f54a83aa4e5e1b9692a238~mv2.png', 'verified', 'contractorverifiedatx.com', datetime('now')),
('Landry Wheeler Construction', '254-624-1853', 'General Construction', 'https://static.wixstatic.com/media/4e462c_9a892ec70c934f09b40a2dc472738412~mv2.jpg', 'verified', 'contractorverifiedatx.com', datetime('now')),
('B&B Investment Development LLC', '737-351-6994', 'General Construction', 'https://static.wixstatic.com/media/4e462c_d49b8073acb8473a99a318395c478694~mv2.png', 'verified', 'contractorverifiedatx.com', datetime('now')),
('Rise Contracting Services', '512-810-2548', 'General Construction', 'https://static.wixstatic.com/media/4e462c_6c6a6840916940e1a08829b5ca3e10f3~mv2.png', 'verified', 'contractorverifiedatx.com', datetime('now')),
('Square One Construction', '512-661-4365', 'General Construction', 'https://static.wixstatic.com/media/4e462c_3831e258962e47dabfa9a4a1bc83ba9c~mv2.jpg', 'verified', 'contractorverifiedatx.com', datetime('now')),
('Lonestar Renovation & Design', '512-758-0128', 'General Construction', 'https://static.wixstatic.com/media/95b9df_2854bd2993ab4ab2ad680164b9e20edf~mv2.jpeg', 'verified', 'contractorverifiedatx.com', datetime('now')),
('Construction Solutions Inc', '512-470-4439', 'General Construction', 'https://static.wixstatic.com/media/3e153e_8d6b929aca2e47bd81026e0f120f27b3~mv2.jpg', 'verified', 'contractorverifiedatx.com', datetime('now')),
('ROA INDUSTRIES', '956-264-0888', 'General Construction', 'https://static.wixstatic.com/media/4e462c_ad1f30dc2f084453a7789a249b0b7aec~mv2.jpeg', 'verified', 'contractorverifiedatx.com', datetime('now')),
('2F CONSTRUCTION', '512-669-3314', 'General Construction', 'https://static.wixstatic.com/media/4e462c_38e82c35a8804a3fbb50a491278e0d23~mv2.png', 'verified', 'contractorverifiedatx.com', datetime('now')),
('Esquives Construction', '512-668-2896', 'General Construction', 'https://static.wixstatic.com/media/4e462c_c767890976a54ca08a92f363deddd2ed~mv2.jpeg', 'verified', 'contractorverifiedatx.com', datetime('now')),
('TJ Renovate LLC', '512-800-0231', 'General Construction', 'https://static.wixstatic.com/media/4e462c_d020df97b3ab4ec18ada434ac61a3fa7~mv2.jpg', 'verified', 'contractorverifiedatx.com', datetime('now'));

-- LANDSCAPING (15)
INSERT OR REPLACE INTO contractors (name, phone, specialty, logo_url, verification_level, source, created_at) VALUES
('Earth In Motion Inc', '512-850-8660', 'Landscaping', 'https://static.wixstatic.com/media/4e462c_f058738839d34d96aae180b189044d2c~mv2.png', 'verified', 'contractorverifiedatx.com', datetime('now')),
('Lone Star Turf', '512-696-9392', 'Landscaping', 'https://static.wixstatic.com/media/44637a_498ace76106f4add9101a1501a1fefc6~mv2.jpeg', 'verified', 'contractorverifiedatx.com', datetime('now')),
('Turf In ATX', '737-275-8301', 'Landscaping', 'https://static.wixstatic.com/media/4ecce4_edee36f69fbc492da811daea64236cdd~mv2.png', 'verified', 'contractorverifiedatx.com', datetime('now')),
('TopGrass Modern Landscapes', '512-718-5260', 'Landscaping', 'https://static.wixstatic.com/media/42f727_1963f6358cda4f81bc36cda3acffc800~mv2.png', 'verified', 'contractorverifiedatx.com', datetime('now')),
('Southern Love Landscaping & Design', '469-237-7137', 'Landscaping', 'https://static.wixstatic.com/media/895335_2631ce199ce44d519d1a37dc9a20e706~mv2.png', 'verified', 'contractorverifiedatx.com', datetime('now')),
('Texas Twins Contractors', '512-574-2312', 'Landscaping', 'https://static.wixstatic.com/media/f3f25a_b52cefab62d44cfd9cc5fda694b525d0~mv2.png', 'verified', 'contractorverifiedatx.com', datetime('now')),
('Austin Turf Pros', '512-649-6842', 'Landscaping', 'https://static.wixstatic.com/media/0e8cfe_976f186fbd71456fabdb090ffbdcf26c~mv2.jpeg', 'verified', 'contractorverifiedatx.com', datetime('now')),
('RcTex Pavers & Hardscapes', '737-704-1473', 'Landscaping', 'https://static.wixstatic.com/media/552522_622e7dca42b942159a89d241d7d44d01~mv2.png', 'verified', 'contractorverifiedatx.com', datetime('now')),
('Texas Raised Gardens', '512-200-2704', 'Landscaping', 'https://static.wixstatic.com/media/ecc245_066f65c2365e4cc5aaa87202376743c5~mv2.jpg', 'verified', 'contractorverifiedatx.com', datetime('now')),
('Finch Design Group', '512-417-5800', 'Landscaping', 'https://static.wixstatic.com/media/4e462c_a6c12d6d255f4aa9ad35c482190e81d2~mv2.jpg', 'verified', 'contractorverifiedatx.com', datetime('now')),
('Austin Gardeners', '512-845-1531', 'Landscaping', 'https://static.wixstatic.com/media/4a6cd9_237f22ca978f4e47906bbbe18dedec80~mv2.png', 'verified', 'contractorverifiedatx.com', datetime('now')),
('Consul Outdoors', '702-610-5103', 'Landscaping', 'https://static.wixstatic.com/media/4e462c_0b46db4cb02f4b48af67a66c95482fb1~mv2.png', 'verified', 'contractorverifiedatx.com', datetime('now')),
('Jays Landscaping Services', '352-888-2601', 'Landscaping', 'https://static.wixstatic.com/media/4e462c_cecc5ad3f4014a7fb70e14332f9fe43e~mv2.jpg', 'verified', 'contractorverifiedatx.com', datetime('now')),
('Sullivans Landscaping & Lawn Service', '512-599-4565', 'Landscaping', 'https://static.wixstatic.com/media/a042b1_565c11f8981e435b92fd3e58cefe6fd9~mv2.png', 'verified', 'contractorverifiedatx.com', datetime('now')),
('Rockin L Land Services', '512-704-3917', 'Landscaping', 'https://static.wixstatic.com/media/30a810_5d84d04e2a2643ae9626e61a693451c7~mv2.jpeg', 'verified', 'contractorverifiedatx.com', datetime('now')),
('Champion Outdoor Solutions', '512-699-6575', 'Landscaping', 'https://static.wixstatic.com/media/4e462c_2f39bfe04d2147ed926359d0fcaf5f76~mv2.jpg', 'verified', 'contractorverifiedatx.com', datetime('now'));

-- Show results
SELECT '=== IMPORT COMPLETE ===' as status;
SELECT COUNT(*) as total_contractors FROM contractors;
SELECT COUNT(*) as verified FROM contractors WHERE verification_level = 'verified';
SELECT specialty, COUNT(*) as count FROM contractors WHERE verification_level = 'verified' GROUP BY specialty ORDER BY count DESC;
