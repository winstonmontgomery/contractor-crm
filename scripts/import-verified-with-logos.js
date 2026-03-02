const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, '..', 'data', 'cv.db'));

// Add logo_url column if not exists
try {
  db.exec("ALTER TABLE contractors ADD COLUMN logo_url TEXT");
  console.log("✅ Added logo_url column");
} catch (e) {
  if (!e.message.includes('duplicate')) console.log("logo_url column exists");
}

const verified = [
  // ROOFING
  {name: "LIV Roofing", phone: "512-956-3613", category: "Roofing", website: "livroofingservices.com", logo: "https://static.wixstatic.com/media/4e462c_fdcf811a754a4755a7b7edb0d5c69105~mv2.jpg/v1/crop/x_0,y_158,w_1688,h_1013/fill/w_235,h_141,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/unnamed-3_edited.jpg"},
  {name: "Texas Best Roofing Co", phone: "979-213-7022", category: "Roofing", website: "texasbestroofingco.com", logo: "https://static.wixstatic.com/media/4e462c_079a5ebbe09a408a97ad0aa12705429f~mv2.jpeg/v1/crop/x_0,y_176,w_1024,h_333/fill/w_254,h_84,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/1700315222505-7ffdb155-9343-4e9e-838d-0622d74305d6_1%202.jpeg"},
  {name: "Tex-Martinez Roofing", phone: "254-312-1480", category: "Roofing", website: "texmartinezroofing.com", logo: "https://static.wixstatic.com/media/4b1f44_d9c46a60323c47e4a0e3939095a161cb~mv2.jpeg/v1/fill/w_180,h_180,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/4b1f44_d9c46a60323c47e4a0e3939095a161cb~mv2.jpeg"},
  {name: "Hosch Construction & Roofing", phone: "512-763-2112", category: "Roofing", website: "hoschroofing.com", logo: "https://static.wixstatic.com/media/da5bf5_98513ee3c9ed43a3ba424bbc067bda26~mv2.jpg/v1/crop/x_0,y_38,w_1016,h_676/fill/w_215,h_143,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/2DD4507A-8FFC-4B66-8A0E-D1B0B522C154.jpg"},
  {name: "American Seamless Gutters", phone: "210-625-2326", category: "Roofing", website: "americanseamlesstx.com", logo: "https://static.wixstatic.com/media/4e462c_4f25e41e8e6443dbab9634b25e6504bc~mv2.webp/v1/fill/w_242,h_110,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/2b4478_b2d95d969d7f4cf3a82918aec09c5213~mv2_png.webp"},
  {name: "Elite Roofing & Restoration", phone: "512-430-7141", category: "Roofing", website: "eliteroofingtx.com", logo: "https://static.wixstatic.com/media/7926ca_80af8b51c1fa401db066017e9d8504ad~mv2.jpeg/v1/crop/x_0,y_373,w_1364,h_652/fill/w_217,h_104,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/7926ca_80af8b51c1fa401db066017e9d8504ad~mv2.jpeg"},
  {name: "A1 Quality Roofing", phone: "512-722-7740", category: "Roofing", website: "saveonroofstx.com", logo: "https://static.wixstatic.com/media/4e462c_8054cde2a90f47ee8f51f1f95aaa27a0~mv2.jpg/v1/fill/w_241,h_84,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/A1%20Quality%20Roofing%20Logo.jpg"},
  {name: "Tarrytown Roofing", phone: "713-824-3620", category: "Roofing", website: "tarrytownroofing.com", logo: "https://static.wixstatic.com/media/67d7cd_a7899592ee8243819e62849f82502a42~mv2.png/v1/fill/w_229,h_125,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Black%20logo%20-%20no%20background.png"},
  {name: "Flagstone Roofing & Exteriors", phone: "512-225-0123", category: "Roofing", website: "flagstoneroofing.com", logo: "https://static.wixstatic.com/media/f39270_4fe1a3c1775340d0b1b7ca93aa45e593~mv2.png/v1/fill/w_171,h_171,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/f39270_4fe1a3c1775340d0b1b7ca93aa45e593~mv2.png"},
  {name: "Green Shield Roofs", phone: "512-496-7363", category: "Roofing", website: "greenshieldroofs.com", logo: "https://static.wixstatic.com/media/7122d4_9fecb19195614fd39ec78ac9e813324f~mv2.png/v1/crop/x_161,y_0,w_957,h_920/fill/w_185,h_178,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/34AFE214-4F43-4BA5-8174-5D0871E0425C.png"},
  {name: "Urtiz Roofing & Waterproofing", phone: "512-619-2976", category: "Roofing", website: "urtizroofing.com", logo: "https://static.wixstatic.com/media/0452cf_8ced43bd58cf49d4a0b467f41d62e1a1~mv2.png/v1/crop/x_0,y_77,w_500,h_289/fill/w_211,h_120,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/0452cf_8ced43bd58cf49d4a0b467f41d62e1a1~mv2.png"},
  {name: "Impact Building Solutions", phone: "512-364-5350", category: "Roofing", website: "ibuildwithimpact.com", logo: "https://static.wixstatic.com/media/4e462c_f7f06a9c075f47d88c22fb41f0bb5d3a~mv2.png/v1/crop/x_93,y_322,w_1383,h_831/fill/w_235,h_141,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Untitled%20design%20(1).png"},
  {name: "Roof Roof Roofing", phone: "512-798-8736", category: "Roofing", website: null, logo: "https://static.wixstatic.com/media/4e462c_0daa4eeb0b1444c1aed0c619546a545a~mv2.png/v1/crop/x_0,y_143,w_1967,h_1180/fill/w_235,h_141,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/2b3007_c1f55d5cdd6e4d01a2cfb085dfa309ef~mv2.png"},
  {name: "Clear Choice Roofing", phone: "512-712-4906", category: "Roofing", website: "clearchoiceroofingatx.com", logo: "https://static.wixstatic.com/media/4e462c_67020d711b4d431d88840c7cc05adb60~mv2.jpg/v1/fill/w_227,h_84,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/topLogo-475w.jpg"},
  {name: "Summit Roofing", phone: "512-828-7663", category: "Roofing", website: "summitrooftexas.com", logo: "https://static.wixstatic.com/media/4e462c_3a2925be95654238ba611096ad2d6535~mv2.jpg/v1/fill/w_244,h_77,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/434770630_858291999645738_6406392841982360650_n.jpg"},
  {name: "Foster Roofing", phone: "254-421-5333", category: "Roofing", website: null, logo: null},
  // PLUMBING
  {name: "Sosa Services", phone: "512-949-0662", category: "Plumbing", website: "sosaservicestx.com", logo: "https://static.wixstatic.com/media/4e462c_dae0e0f893bf4b219b71287b7fad34c2~mv2.png/v1/fill/w_208,h_122,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/logo.png"},
  {name: "Real Texas Plumbing", phone: "512-662-2949", category: "Plumbing", website: "realtexasplumbing.com", logo: "https://static.wixstatic.com/media/cbccd0_f8eeb5dbf4624c6d8d89c68d8c1c8756~mv2.png/v1/fill/w_186,h_186,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/cbccd0_f8eeb5dbf4624c6d8d89c68d8c1c8756~mv2.png"},
  {name: "Austin Area Plumbing", phone: "512-736-7113", category: "Plumbing", website: "austinareaplumbingofroundrock.com", logo: "https://static.wixstatic.com/media/65022e_9b6e946c21a249a4aa6f3aaa637453a8~mv2.png/v1/fill/w_217,h_122,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/65022e_9b6e946c21a249a4aa6f3aaa637453a8~mv2.png"},
  {name: "Dear Plumber", phone: "512-661-9783", category: "Plumbing", website: "dearplumber.com", logo: "https://static.wixstatic.com/media/898781_e33ad9ba6e154334bbbda1c3b4fcaad5~mv2.png/v1/fill/w_210,h_149,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/898781_e33ad9ba6e154334bbbda1c3b4fcaad5~mv2.png"},
  {name: "ET Plumbing", phone: "512-826-1828", category: "Plumbing", website: "theetplumbing.com", logo: "https://static.wixstatic.com/media/4e462c_f47814d0f65b4d98a77fcbf31a6a9dfb~mv2.jpg/v1/crop/x_0,y_4,w_1277,h_1285/fill/w_152,h_153,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/IMG_3339-1_JPG.jpg"},
  {name: "EZG Plumbing Services", phone: "512-363-9215", category: "Plumbing", website: "ezgplumbing.com", logo: "https://static.wixstatic.com/media/1c0f83_62cc9c2b090f4d429bbaff7663e78ba9~mv2.jpeg/v1/crop/x_163,y_291,w_789,h_283/fill/w_219,h_73,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/1c0f83_62cc9c2b090f4d429bbaff7663e78ba9~mv2.jpeg"},
  {name: "M&M Performance Company", phone: "512-373-6514", category: "Plumbing", website: "mmperformanceplumbing.net", logo: "https://static.wixstatic.com/media/108a28_87d1601fe09c42719884f4a9de1710b2~mv2.jpeg/v1/fill/w_194,h_149,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/108a28_87d1601fe09c42719884f4a9de1710b2~mv2.jpeg"},
  {name: "June Plumbing", phone: "737-832-0374", category: "Plumbing", website: null, logo: "https://static.wixstatic.com/media/4e462c_b7907002b7f34da297bb679fcf465a8f~mv2.jpeg/v1/fill/w_206,h_157,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/IMG_5477.jpeg"},
  {name: "Plumbing Outfitters", phone: "512-253-7337", category: "Plumbing", website: null, logo: "https://static.wixstatic.com/media/59b7f0_db48225f26124cd7b27b8ffbc994411e~mv2.jpg/v1/fill/w_120,h_182,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/59b7f0_db48225f26124cd7b27b8ffbc994411e~mv2.jpg"},
  {name: "Bull Plumbing LLC", phone: "325-227-2814", category: "Plumbing", website: null, logo: "https://static.wixstatic.com/media/4e462c_d5e816a4fead4ab9b6561284b972d279~mv2.png/v1/fill/w_173,h_158,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/38ddfa_f59ab6c058e94c35a299028ad3df5307~mv2%20(1).png"},
  {name: "Accredited Plumbing Services", phone: "737-704-4303", category: "Plumbing", website: null, logo: "https://static.wixstatic.com/media/4e462c_3b61b915b55345028d58dab0f40b6d2f~mv2.jpg/v1/fill/w_217,h_83,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/IMG_5998.jpg"},
  {name: "Done Right Plumbing", phone: "254-517-0710", category: "Plumbing", website: "donerightplumbingtx.com", logo: "https://static.wixstatic.com/media/e6a78d_e306ac2ec82c4aa6a2f4f3508807a1c9~mv2.png/v1/fill/w_217,h_99,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/e6a78d_e306ac2ec82c4aa6a2f4f3508807a1c9~mv2.png"},
  {name: "Vaquero Plumbing", phone: "512-893-8705", category: "Plumbing", website: "vaqueroplumbing.com", logo: "https://static.wixstatic.com/media/4e462c_5e76f1c9f7d54d2686e80abef69f6ed5~mv2.jpg/v1/crop/x_92,y_534,w_1845,h_829/fill/w_237,h_105,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/IMG_7397_JPG.jpg"},
  {name: "Plumb Life Industries", phone: "720-280-4321", category: "Plumbing", website: null, logo: "https://static.wixstatic.com/media/4e462c_dee924fe9953497c8bebc1aa2c80322c~mv2.jpg/v1/crop/x_0,y_84,w_1909,h_1922/fill/w_152,h_153,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/plumbers%20inc_edited.jpg"},
  {name: "Garrison Plumbing LLC", phone: "512-295-0825", category: "Plumbing", website: null, logo: "https://static.wixstatic.com/media/4e462c_c9bea5cf114b490dbb931be16f19b05b~mv2.jpeg/v1/fill/w_173,h_153,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/7724ee_3448e1905ab74aa09dd011d2b4b8dacb~mv2.jpeg"},
  // HVAC
  {name: "Northwest Services ATX", phone: "512-921-4497", category: "HVAC", website: null, logo: "https://static.wixstatic.com/media/be6b1f_cc6de14856c246e29aafb6292c853282~mv2.jpeg/v1/fill/w_166,h_168,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/be6b1f_cc6de14856c246e29aafb6292c853282~mv2.jpeg"},
  {name: "Vega Heating & Air", phone: "512-985-7051", category: "HVAC", website: null, logo: "https://static.wixstatic.com/media/b666d9_049a62d759c7460f85c3ae966536f554~mv2.png/v1/crop/x_0,y_684,w_1290,h_1355/fill/w_174,h_182,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/IMG_2263.png"},
  {name: "LOA AC & Heating", phone: "512-354-6497", category: "HVAC", website: null, logo: "https://static.wixstatic.com/media/fb5b53_d2c46ce48793445bae85c3ed57875aef~mv2.jpg/v1/fill/w_215,h_124,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/fb5b53_d2c46ce48793445bae85c3ed57875aef~mv2.jpg"},
  {name: "Rancho Air Conditioning & Heating", phone: "512-949-1447", category: "HVAC", website: null, logo: "https://static.wixstatic.com/media/d3c5d3_e4796609a8414377bbe673e8bee3d21e~mv2.jpeg/v1/crop/x_81,y_111,w_343,h_208/fill/w_221,h_133,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/d3c5d3_e4796609a8414377bbe673e8bee3d21e~mv2.jpeg"},
  {name: "Always Local Heating & Air Conditioning", phone: "512-361-0003", category: "HVAC", website: "alwayslocalac.com", logo: "https://static.wixstatic.com/media/4e462c_cf1e66103ba84d2fafaf063a9ba8048e~mv2.png/v1/fill/w_186,h_133,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/277739186_102944102388940_4657893038930400652_n.png"},
  {name: "US Air HVAC Service", phone: "737-321-9074", category: "HVAC", website: "usairtx.com", logo: "https://static.wixstatic.com/media/47ddbe_33661faa9732434794482cbdc4ac9639~mv2.png/v1/crop/x_48,y_0,w_987,h_720/fill/w_206,h_150,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/47ddbe_33661faa9732434794482cbdc4ac9639~mv2.png"},
  {name: "Belton AC", phone: "254-500-6907", category: "HVAC", website: "beltonac.com", logo: "https://static.wixstatic.com/media/8d047c_fa5982f8a67f45738a01359adbce9b2e~mv2.png/v1/fill/w_221,h_150,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/pcs%20small.png"},
  {name: "Airfix Mechanical", phone: "512-300-6858", category: "HVAC", website: "getyourairfix.com", logo: "https://static.wixstatic.com/media/4e462c_d922bf70da524323b0bf28887e7cc440~mv2.webp/v1/fill/w_186,h_133,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/IMG_SECTION_10.webp"},
  {name: "Jurnee Mechanical", phone: "512-584-5651", category: "HVAC", website: null, logo: "https://static.wixstatic.com/media/4e462c_151aa94487a34bf3aa8363d62a1dfdb9~mv2.jpg/v1/crop/x_0,y_302,w_1481,h_846/fill/w_221,h_126,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/Artboard%201%20copy%204_edited.jpg"},
  {name: "Homegrown Heating & Cooling", phone: "512-786-8400", category: "HVAC", website: "homegrownhc.com", logo: "https://static.wixstatic.com/media/4e462c_c14581cfe058424a9d608884818fb076~mv2.avif/v1/fill/w_260,h_70,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/5d6989_4a92b53266564a038f98f3e42f5be144~mv2_png.avif"},
  {name: "AC Sky", phone: "737-357-2076", category: "HVAC", website: "acskyaustin.net", logo: "https://static.wixstatic.com/media/a62c33_01cfbf9e5e3749088b647c145f9fd11d~mv2.png/v1/fill/w_222,h_124,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/a62c33_01cfbf9e5e3749088b647c145f9fd11d~mv2.png"},
  {name: "Foy's Cooling & Heating", phone: "512-762-5259", category: "HVAC", website: "foyscoolingheating.com", logo: "https://static.wixstatic.com/media/9900b4_727e3acc7d49463a9aaa4eda4a058881~mv2.jpg/v1/fill/w_173,h_173,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/9900b4_727e3acc7d49463a9aaa4eda4a058881~mv2.jpg"},
  {name: "Hook-Em Up HomeServices", phone: "512-554-8458", category: "HVAC", website: null, logo: "https://static.wixstatic.com/media/97007a_770a0eeb46f0484eb6fd004ff9994b2c~mv2.jpg/v1/crop/x_0,y_115,w_1070,h_830/fill/w_205,h_159,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/97007a_770a0eeb46f0484eb6fd004ff9994b2c~mv2.jpg"},
  {name: "Damairv", phone: "512-850-0388", category: "HVAC", website: "damairvac.com", logo: "https://static.wixstatic.com/media/4e462c_0654fa533c1348d1af9d14e3f7f1d980~mv2.png/v1/fill/w_194,h_141,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/logo%20flama%20arriba.png"},
  {name: "All Pro Services", phone: "512-203-7089", category: "HVAC", website: null, logo: "https://static.wixstatic.com/media/4e462c_5ac439203f074a03a67a5f1e4c675b2c~mv2.webp/v1/fill/w_221,h_126,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/all%20Pro%20services%20.webp"},
  {name: "Blue Wave Heating & Air", phone: "512-900-6512", category: "HVAC", website: "bluewaveheatingandair.com", logo: "https://static.wixstatic.com/media/4e462c_10d4d63aee1f421b867de07267f77061~mv2.png/v1/crop/x_0,y_22,w_600,h_628/fill/w_174,h_182,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/logo-1.png"}
];

const insert = db.prepare(\`
  INSERT INTO contractors (name, phone, specialty, website, logo_url, verification_level, source, created_at)
  VALUES (?, ?, ?, ?, ?, 'verified', 'contractorverifiedatx.com', datetime('now'))
  ON CONFLICT(phone) DO UPDATE SET
    name = excluded.name,
    specialty = excluded.specialty,
    website = COALESCE(excluded.website, contractors.website),
    logo_url = COALESCE(excluded.logo_url, contractors.logo_url),
    verification_level = 'verified',
    source = 'contractorverifiedatx.com'
\`);

let count = 0;
for (const c of verified) {
  try {
    insert.run(c.name, c.phone, c.category, c.website, c.logo);
    count++;
  } catch (e) {
    console.log(\`Skip \${c.name}: \${e.message}\`);
  }
}

const stats = db.prepare(\`
  SELECT 
    COUNT(*) as total,
    SUM(CASE WHEN verification_level = 'verified' THEN 1 ELSE 0 END) as verified,
    SUM(CASE WHEN logo_url IS NOT NULL THEN 1 ELSE 0 END) as with_logos
  FROM contractors
\`).get();

console.log(\`
✅ Imported \${count} verified contractors with logos

📊 Database totals:
   Total contractors: \${stats.total}
   ✓ Verified: \${stats.verified}
   🖼 With logos: \${stats.with_logos}
\`);
