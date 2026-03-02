// Thumbtack scraper - extracts contractor prospects for Austin area
// Run via: node scripts/scrape-thumbtack.js

const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'data', 'cv.db');

// Categories to scrape from Thumbtack
const categories = [
  { slug: 'plumbers', name: 'Plumbing' },
  { slug: 'electrician', name: 'Electrical' },
  { slug: 'hvac', name: 'HVAC' },
  { slug: 'roofing', name: 'Roofing' },
  { slug: 'handyman', name: 'Handyman' },
  { slug: 'house-painting', name: 'Painting' },
  { slug: 'landscaping', name: 'Landscaping' },
  { slug: 'fence-installation', name: 'Fencing' },
  { slug: 'concrete-contractors', name: 'Concrete' },
  { slug: 'flooring-contractors', name: 'Flooring' },
  { slug: 'general-contractors', name: 'General Construction' },
  { slug: 'drywall', name: 'Drywall' },
  { slug: 'carpet-installation', name: 'Carpet' },
  { slug: 'tree-service', name: 'Tree Service' },
  { slug: 'garage-door-repair', name: 'Garage Doors' }
];

// Sample data extracted from browser (this would be populated by browser scraping)
const scrapedData = [
  { name: "Strand Brothers Service Experts", rating: 4.8, reviews: 100, category: "Plumbing", source_url: "https://www.thumbtack.com/tx/austin/pro/thumbtack/service/564618926608064526", source_id: "564618926608064526" },
  { name: "American Leak Detection of Austin", rating: 4.8, reviews: 78, category: "Plumbing", source_url: "https://www.thumbtack.com/tx/boerne/pro/thumbtack/service/554854600557985796", source_id: "554854600557985796" },
  { name: "McCarthy Services", rating: 4.8, reviews: 190, category: "Plumbing", source_url: "https://www.thumbtack.com/tx/austin/affordable-plumbing-services/mccarthy-services/service/454343511544406030", source_id: "454343511544406030" },
  { name: "Handyman Mike", rating: 5.0, reviews: 1397, category: "Handyman,Plumbing", source_url: "https://www.thumbtack.com/tx/austin/attic-or-whole-house-fan-installation/handyman-mike/service/254439670993077370", source_id: "254439670993077370" },
  { name: "Marksman Plumbing", rating: 4.9, reviews: 15, category: "Plumbing", source_url: "https://www.thumbtack.com/tx/new-braunfels/affordable-plumbing-services/marksman-plumbing/service/529096425862529039", source_id: "529096425862529039" },
  { name: "Segura's Plumbing", rating: 4.6, reviews: 137, category: "Plumbing", source_url: "https://www.thumbtack.com/tx/elgin/affordable-plumbing-services/seguras-plumbing/service/526945285423726602", source_id: "526945285423726602" },
  { name: "E.C. Handyman", rating: 4.6, reviews: 66, category: "Handyman,Plumbing", source_url: "https://www.thumbtack.com/tx/leander/affordable-plumbing-services/ec-handyman/service/486439399951499296", source_id: "486439399951499296" },
  { name: "Celtic Maintenance LLC", rating: 5.0, reviews: 144, category: "HVAC,Plumbing", source_url: "https://www.thumbtack.com/tx/austin/furnace-repair/celtic-maintenance-llc/service/429512032674045963", source_id: "429512032674045963" },
  { name: "Crow's Plumbing Service", rating: 4.6, reviews: 197, category: "Plumbing", source_url: "https://www.thumbtack.com/tx/round-rock/water-heater-installation/crows-plumbing-service/service/337633685074657301", source_id: "337633685074657301" },
  { name: "Zoom Drain", rating: 4.9, reviews: 47, category: "Plumbing", source_url: "https://www.thumbtack.com/tx/round-rock/affordable-plumbing-services/zoom-drain/service/465846815235383299", source_id: "465846815235383299" }
];

function importProspects(prospects) {
  const db = new Database(dbPath);
  
  const stmt = db.prepare(`
    INSERT OR IGNORE INTO prospects (
      name, source, source_url, source_id, service_categories, location, rating, review_count
    ) VALUES (?, 'thumbtack', ?, ?, ?, 'Austin, TX', ?, ?)
  `);
  
  let added = 0;
  let skipped = 0;
  
  for (const p of prospects) {
    try {
      const result = stmt.run(
        p.name,
        p.source_url,
        p.source_id,
        p.category,
        p.rating,
        p.reviews
      );
      if (result.changes > 0) {
        added++;
      } else {
        skipped++;
      }
    } catch (err) {
      console.error(`Error importing ${p.name}:`, err.message);
      skipped++;
    }
  }
  
  db.close();
  console.log(`Imported ${added} prospects, ${skipped} skipped (duplicates)`);
}

// Import the sample data
importProspects(scrapedData);
console.log('Done!');
