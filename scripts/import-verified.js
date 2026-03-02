const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, '..', 'data', 'cv.db'));

const verified = [
  {name: "LIV Roofing", phone: "512-956-3613", category: "Roofing", website: "livroofingservices.com"},
  {name: "Texas Best Roofing Co", phone: "979-213-7022", category: "Roofing", website: "texasbestroofingco.com"},
  {name: "Tex-Martinez Roofing", phone: "254-312-1480", category: "Roofing", website: "texmartinezroofing.com"},
  {name: "Hosch Construction & Roofing", phone: "512-763-2112", category: "Roofing", website: "hoschroofing.com"},
  {name: "American Seamless Gutters", phone: "210-625-2326", category: "Roofing", website: "americanseamlesstx.com"},
  {name: "Elite Roofing & Restoration", phone: "512-430-7141", category: "Roofing", website: "eliteroofingtx.com"},
  {name: "A1 Quality Roofing", phone: "512-722-7740", category: "Roofing", website: "saveonroofstx.com"},
  {name: "Tarrytown Roofing", phone: "713-824-3620", category: "Roofing", website: "tarrytownroofing.com"},
  {name: "Flagstone Roofing & Exteriors", phone: "512-225-0123", category: "Roofing", website: "flagstoneroofing.com"},
  {name: "Green Shield Roofs", phone: "512-496-7363", category: "Roofing", website: "greenshieldroofs.com"},
  {name: "Urtiz Roofing & Waterproofing", phone: "512-619-2976", category: "Roofing", website: "urtizroofing.com"},
  {name: "Impact Building Solutions", phone: "512-364-5350", category: "Roofing", website: "ibuildwithimpact.com"},
  {name: "Roof Roof Roofing", phone: "512-798-8736", category: "Roofing", website: null},
  {name: "Clear Choice Roofing", phone: "512-712-4906", category: "Roofing", website: "clearchoiceroofingatx.com"},
  {name: "Summit Roofing", phone: "512-828-7663", category: "Roofing", website: "summitrooftexas.com"},
  {name: "Foster Roofing", phone: "254-421-5333", category: "Roofing", website: null},
  {name: "Sosa Services", phone: "512-949-0662", category: "Plumbing", website: "sosaservicestx.com"},
  {name: "Real Texas Plumbing", phone: "512-662-2949", category: "Plumbing", website: "realtexasplumbing.com"},
  {name: "Austin Area Plumbing", phone: "512-736-7113", category: "Plumbing", website: "austinareaplumbingofroundrock.com"},
  {name: "Dear Plumber", phone: "512-661-9783", category: "Plumbing", website: "dearplumber.com"},
  {name: "ET Plumbing", phone: "512-826-1828", category: "Plumbing", website: "theetplumbing.com"},
  {name: "EZG Plumbing Services", phone: "512-363-9215", category: "Plumbing", website: "ezgplumbing.com"},
  {name: "M&M Performance Company", phone: "512-373-6514", category: "Plumbing", website: "mmperformanceplumbing.net"},
  {name: "June Plumbing", phone: "737-832-0374", category: "Plumbing", website: null},
  {name: "Plumbing Outfitters", phone: "512-253-7337", category: "Plumbing", website: null},
  {name: "Bull Plumbing LLC", phone: "325-227-2814", category: "Plumbing", website: null},
  {name: "Accredited Plumbing Services", phone: "737-704-4303", category: "Plumbing", website: null},
  {name: "Done Right Plumbing", phone: "254-517-0710", category: "Plumbing", website: "donerightplumbingtx.com"},
  {name: "Vaquero Plumbing", phone: "512-893-8705", category: "Plumbing", website: "vaqueroplumbing.com"},
  {name: "Plumb Life Industries", phone: "720-280-4321", category: "Plumbing", website: null},
  {name: "Garrison Plumbing LLC", phone: "512-295-0825", category: "Plumbing", website: null},
  {name: "Northwest Services ATX", phone: "512-921-4497", category: "HVAC", website: null},
  {name: "Vega Heating & Air", phone: "512-985-7051", category: "HVAC", website: null},
  {name: "LOA AC & Heating", phone: "512-354-6497", category: "HVAC", website: null},
  {name: "Rancho Air Conditioning & Heating", phone: "512-949-1447", category: "HVAC", website: null},
  {name: "Always Local Heating & Air Conditioning", phone: "512-361-0003", category: "HVAC", website: "alwayslocalac.com"},
  {name: "US Air HVAC Service", phone: "737-321-9074", category: "HVAC", website: "usairtx.com"},
  {name: "Belton AC", phone: "254-500-6907", category: "HVAC", website: "beltonac.com"},
  {name: "Airfix Mechanical", phone: "512-300-6858", category: "HVAC", website: "getyourairfix.com"},
  {name: "Jurnee Mechanical", phone: "512-584-5651", category: "HVAC", website: null},
  {name: "Homegrown Heating & Cooling", phone: "512-786-8400", category: "HVAC", website: "homegrownhc.com"},
  {name: "AC Sky", phone: "737-357-2076", category: "HVAC", website: "acskyaustin.net"},
  {name: "Foy's Cooling & Heating", phone: "512-762-5259", category: "HVAC", website: "foyscoolingheating.com"},
  {name: "Hook-Em Up HomeServices", phone: "512-554-8458", category: "HVAC", website: null},
  {name: "Damairv", phone: "512-850-0388", category: "HVAC", website: "damairvac.com"},
  {name: "All Pro Services", phone: "512-203-7089", category: "HVAC", website: null},
  {name: "Blue Wave Heating & Air", phone: "512-900-6512", category: "HVAC", website: "bluewaveheatingandair.com"}
];

// Insert or update contractors
const insert = db.prepare(`
  INSERT INTO contractors (name, phone, specialty, website, verification_level, source, created_at)
  VALUES (?, ?, ?, ?, 'verified', 'contractorverifiedatx.com', datetime('now'))
  ON CONFLICT(phone) DO UPDATE SET
    verification_level = 'verified',
    source = 'contractorverifiedatx.com'
`);

let inserted = 0;
let updated = 0;

for (const c of verified) {
  try {
    const result = insert.run(c.name, c.phone, c.category, c.website);
    if (result.changes > 0) {
      if (result.lastInsertRowid) inserted++;
      else updated++;
    }
  } catch (e) {
    console.log(`Skipped ${c.name}: ${e.message}`);
  }
}

const total = db.prepare('SELECT COUNT(*) as count FROM contractors').get();
const verifiedCount = db.prepare("SELECT COUNT(*) as count FROM contractors WHERE verification_level = 'verified'").get();

console.log(`✅ Imported: ${inserted} new, ${updated} updated`);
console.log(`📊 Total contractors: ${total.count}`);
console.log(`✓ Verified: ${verifiedCount.count}`);
