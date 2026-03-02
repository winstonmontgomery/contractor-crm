#!/usr/bin/env node
/**
 * Scrape all verified contractors from contractorverifiedatx.com
 * Run: node scripts/scrape-cv-verified.js
 */

const fs = require('fs');
const path = require('path');

// All trade category URLs from the site
const TRADE_CATEGORIES = [
  { name: '3D Rendering & Design', url: '/3d-rendering-and-design' },
  { name: 'Appliance Repair', url: '/appliancerepair' },
  { name: 'Arborists', url: '/arborists' },
  { name: 'Architects', url: '/architects-buildingdesigners' },
  { name: 'Asphalt', url: '/asphalt' },
  { name: 'AV Low Voltage', url: '/av-lowvoltage' },
  { name: 'Bathroom Remodeling', url: '/bathroom-remodeling' },
  { name: 'Bookkeepers', url: '/bookkeepers' },
  { name: 'Builders', url: '/builders' },
  { name: 'Cabinet Companies', url: '/cabinetcompanies' },
  { name: 'Cleaning Services', url: '/cleaningservices' },
  { name: 'Concrete', url: '/concrete' },
  { name: 'Countertops', url: '/countertops' },
  { name: 'Custom Wood Working', url: '/custom-wood-work' },
  { name: 'Damage Restoration', url: '/damage-restoration' },
  { name: 'Decks', url: '/decks' },
  { name: 'Demolition/Excavation', url: '/demolition-excavation' },
  { name: 'Drywall', url: '/drywall' },
  { name: 'Dumpster Rentals', url: '/dumpster-rental' },
  { name: 'Electricians', url: '/electricians' },
  { name: 'Engineers', url: '/engineers' },
  { name: 'Epoxy', url: '/epoxy' },
  { name: 'Fences', url: '/fences' },
  { name: 'Flooring', url: '/flooring' },
  { name: 'Framing', url: '/framing' },
  { name: 'Garage Doors', url: '/garage-doors' },
  { name: 'General Construction', url: '/general-construction' },
  { name: 'Glass & Screens', url: '/glassinstallation' },
  { name: 'Gutters', url: '/gutters' },
  { name: 'Handyman', url: '/handyman' },
  { name: 'Hazard & Safety', url: '/hazard-safety-professionals' },
  { name: 'Health Insurance', url: '/health-insurance' },
  { name: 'Home Inspectors', url: '/home-inspectors' },
  { name: 'HVAC', url: '/hvac' },
  { name: 'Insulation', url: '/insulation' },
  { name: 'Interior Design', url: '/interiordesign' },
  { name: 'Irrigation', url: '/irrigation' },
  { name: 'Kitchen Remodeling', url: '/kitchen-remodeling' },
  { name: 'Landscaping', url: '/landscaping' },
  { name: 'Machine Rentals', url: '/machine-rentals' },
  { name: 'Material Hauling', url: '/material-hauling' },
  { name: 'Material Suppliers', url: '/material-suppliers' },
  { name: 'Masonry', url: '/masonry' },
  { name: 'Metal Buildings', url: '/metal-buildings' },
  { name: 'Mobile Mechanics', url: '/mobile-mechanic' },
  { name: 'Mold Remediation', url: '/mold-remediation' },
  { name: 'Movers', url: '/movers' },
  { name: 'Outdoor Lighting', url: '/outdoorlighting' },
  { name: 'Painters', url: '/painters' },
  { name: 'Parking Lot Striping', url: '/parking-lot-striping' },
  { name: 'Pest Control', url: '/pestcontrol' },
  { name: 'Plumbers', url: '/plumbers' },
  { name: 'Ponds & Water Features', url: '/ponds-water-features' },
  { name: 'Pool Builders', url: '/poolbuilders' },
  { name: 'Pool Cleaners', url: '/poolcleaning' },
  { name: 'Pressure Washing', url: '/pressure-washing' },
  { name: 'Print Shops', url: '/print-shops' },
  { name: 'Professional Organizers', url: '/professional-organizing' },
  { name: 'Project Managers', url: '/projectmanagement' },
  { name: 'Public Adjusters', url: '/public-adjusters' },
  { name: 'Rainwater Collection', url: '/rainwater-collection' },
  { name: 'Roofing', url: '/roofing' },
  { name: 'Septic', url: '/septic' },
  { name: 'Siding', url: '/siding' },
  { name: 'Smart Home', url: '/smarthome-automation' },
  { name: 'Staging', url: '/staging' },
  { name: 'Stairs & Railings', url: '/stairs-and-railings' },
  { name: 'Tile', url: '/tile' },
  { name: 'Title Companies', url: '/title-companies' },
  { name: 'Trash Haul', url: '/trash-haul' },
  { name: 'Tree Trimming', url: '/treetrimming' },
  { name: 'Wallpaper', url: '/wallpaper' },
  { name: 'Waterproofing', url: '/waterproofing' },
  { name: 'Water Damage Restoration', url: '/water-damage-restoration' },
  { name: 'Welding', url: '/welding' },
  { name: 'Windows', url: '/windows' },
  { name: 'Window Cleaning', url: '/window-cleaning-companies' }
];

// Known verified contractors from manual scrape (starting with roofing)
const VERIFIED_CONTRACTORS = [
  // ROOFING
  { name: 'LIV Roofing', phone: '512-956-3613', category: 'Roofing', website: 'livroofingservices.com' },
  { name: 'Texas Best Roofing Co', phone: '979-213-7022', category: 'Roofing', website: 'texasbestroofingco.com' },
  { name: 'Tex-Martinez Roofing', phone: '254-312-1480', category: 'Roofing', website: 'texmartinezroofing.com' },
  { name: 'Hosch Construction & Roofing', phone: '512-763-2112', category: 'Roofing', website: 'hoschroofing.com' },
  { name: 'American Seamless Gutters', phone: '210-625-2326', category: 'Roofing', website: 'americanseamlesstx.com' },
  { name: 'Elite Roofing & Restoration', phone: '512-430-7141', category: 'Roofing', website: 'eliteroofingtx.com' },
  { name: 'A1 Quality Roofing', phone: '512-722-7740', category: 'Roofing', website: 'saveonroofstx.com' },
  { name: 'Tarrytown Roofing', phone: '713-824-3620', category: 'Roofing', website: 'tarrytownroofing.com' },
  { name: 'Flagstone Roofing & Exteriors', phone: '512-225-0123', category: 'Roofing', website: 'flagstoneroofing.com' },
  { name: 'Green Shield Roofs', phone: '512-496-7363', category: 'Roofing', website: 'greenshieldroofs.com' },
  { name: 'Urtiz Roofing & Waterproofing', phone: '512-619-2976', category: 'Roofing', website: 'urtizroofing.com' },
  { name: 'Impact Building Solutions', phone: '512-364-5350', category: 'Roofing', website: 'ibuildwithimpact.com' },
  { name: 'Roof Roof Roofing', phone: '512-798-8736', category: 'Roofing', website: null },
  { name: 'Clear Choice Roofing', phone: '512-712-4906', category: 'Roofing', website: 'clearchoiceroofingatx.com' },
  { name: 'Summit Roofing', phone: '512-828-7663', category: 'Roofing', website: 'summitrooftexas.com' },
  { name: 'Foster Roofing', phone: '254-421-5333', category: 'Roofing', website: null },
];

// Output path
const OUTPUT_PATH = path.join(__dirname, '..', 'data', 'cv-verified-contractors.json');

// Save to file
fs.writeFileSync(OUTPUT_PATH, JSON.stringify({
  scrapedAt: new Date().toISOString(),
  categories: TRADE_CATEGORIES.length,
  contractors: VERIFIED_CONTRACTORS,
  totalContractors: VERIFIED_CONTRACTORS.length,
  note: 'Partial scrape - roofing category complete. Run browser automation for full scrape.'
}, null, 2));

console.log(`Saved ${VERIFIED_CONTRACTORS.length} verified contractors to ${OUTPUT_PATH}`);
console.log(`Categories to scrape: ${TRADE_CATEGORIES.length}`);
