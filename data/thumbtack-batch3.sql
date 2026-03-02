-- Thumbtack prospects batch 3 - More categories
-- Landscaping, Fencing, Painting, Pool, Concrete, Garage Doors, Windows
-- Source: thumbtack.com scraped 2026-02-28

INSERT OR IGNORE INTO prospects (name, source, source_url, source_id, service_categories, location, rating, review_count, status) VALUES
-- Landscaping
('Heroes Lawn Care of Austin', 'thumbtack', 'https://www.thumbtack.com/tx/austin/lawn-care/heroes-lawn-care-austin/service/470864552534753302', '470864552534753302', 'Landscaping', 'Austin, TX', 2.5, 6, 'new'),
('Turf Me Up', 'thumbtack', 'https://www.thumbtack.com/tx/austin/artificial-turf-installation/turf-me-up/service/470594112248692760', '470594112248692760', 'Landscaping,Turf', 'Austin, TX', 5.0, 33, 'new'),
('Texas High Maintenance LLC', 'thumbtack', 'https://www.thumbtack.com/tx/round-rock/landscaping/texas-high-maintenance-llc/service/284332562083718301', '284332562083718301', 'Landscaping', 'Austin, TX', 4.7, 124, 'new'),
('The Grate Outdoors', 'thumbtack', 'https://www.thumbtack.com/tx/austin/general-contractors/grate-outdoors/service/569359209480355854', '569359209480355854', 'Landscaping,General Construction', 'Austin, TX', 5.0, 7, 'new'),
('Liberty Tree Service', 'thumbtack', 'https://www.thumbtack.com/tx/round-rock/tree-movers/liberty-tree-service/service/557633333943574538', '557633333943574538', 'Landscaping,Tree Service', 'Austin, TX', 5.0, 95, 'new'),
('Southwest Turf Pros', 'thumbtack', 'https://www.thumbtack.com/tx/austin/artificial-turf-installation/southwest-turf-pros/service/486751504453779486', '486751504453779486', 'Landscaping,Turf', 'Austin, TX', 5.0, 14, 'new'),

-- Fencing
('Freedom Fence & Gates', 'thumbtack', 'https://www.thumbtack.com/tx/dripping-springs/fences/freedom-fence-gates/service/572373898167607302', '572373898167607302', 'Fencing', 'Austin, TX', 4.8, 92, 'new'),
('Secure Fence Solutions', 'thumbtack', 'https://www.thumbtack.com/tx/austin/concrete-contractors/secure-fence-solutions/service/243705524641399912', '243705524641399912', 'Fencing,Concrete', 'Austin, TX', 4.8, 43, 'new'),
('Chase with Purple Fencing Co', 'thumbtack', 'https://www.thumbtack.com/tx/austin/fences/chase-with-purple-fencing-co/service/534203785769869321', '534203785769869321', 'Fencing', 'Austin, TX', 4.8, 110, 'new'),
('Armadillo Landscaping and Construction', 'thumbtack', 'https://www.thumbtack.com/tx/jarrell/concrete-contractors/armadillo-landscaping-construction/service/504498848457220104', '504498848457220104', 'Fencing,Landscaping,Concrete', 'Austin, TX', 5.0, 31, 'new'),
('JC Solutions', 'thumbtack', 'https://www.thumbtack.com/tx/bastrop/general-contractors/jc-solutions/service/288154338339053704', '288154338339053704', 'Fencing,General Construction', 'Austin, TX', 4.8, 17, 'new'),
('JJs Fence and Gate Opener LLC', 'thumbtack', 'https://www.thumbtack.com/tx/round-rock/fences/jjs-fence-gate-opener-llc/service/329198428662522012', '329198428662522012', 'Fencing', 'Austin, TX', NULL, NULL, 'new'),
('Frayre Construction LLC', 'thumbtack', 'https://www.thumbtack.com/tx/kyle/kitchen-cabinet-makers/frayre-construction-llc/service/345576101645033487', '345576101645033487', 'Fencing,Carpentry,Windows', 'Austin, TX', 4.8, 47, 'new'),

-- Painting
('That 1 Painter', 'thumbtack', 'https://www.thumbtack.com/tx/austin/exterior-painting/that-1-painter/service/415661383334141956', '415661383334141956', 'Painting', 'Austin, TX', 4.9, 72, 'new'),
('VS Pro Painting', 'thumbtack', 'https://www.thumbtack.com/tx/austin/exterior-painting/vs-pro-painting/service/566070762557718539', '566070762557718539', 'Painting', 'Austin, TX', 4.8, 89, 'new'),
('Next Level Home Solutions', 'thumbtack', 'https://www.thumbtack.com/tx/austin/interior-painting/next-level-home-solutions/service/564463091847094279', '564463091847094279', 'Painting', 'Austin, TX', 5.0, 5, 'new'),
('Eriks Drywall & Paint', 'thumbtack', 'https://www.thumbtack.com/tx/austin/drywall-repair/eriks-drywall-paint/service/561781623651385352', '561781623651385352', 'Painting,Drywall', 'Austin, TX', 5.0, 13, 'new'),
('Desert Sky Contracting LLC', 'thumbtack', 'https://www.thumbtack.com/tx/austin/interior-painting/desert-sky-contracting-llc/service/507262262299303938', '507262262299303938', 'Painting', 'Austin, TX', 5.0, 7, 'new'),
('Tex Painting', 'thumbtack', 'https://www.thumbtack.com/tx/austin/interior-painting/tex-painting/service/111200760823350280', '111200760823350280', 'Painting', 'Austin, TX', 4.7, 137, 'new'),
('Coats of Quality Painting', 'thumbtack', 'https://www.thumbtack.com/tx/manor/exterior-painting/coats-quality-painting/service/553696903369441282', '553696903369441282', 'Painting', 'Austin, TX', 4.9, 10, 'new'),

-- Pool
('Texas Pools and Patios', 'thumbtack', 'https://www.thumbtack.com/tx/cedar-park/pool-builders/texas-pools-patios/service/557680165565546496', '557680165565546496', 'Pool', 'Austin, TX', 4.4, 97, 'new'),
('Clean Image Pool n Spa Care', 'thumbtack', 'https://www.thumbtack.com/tx/jarrell/swimming-pool-repair/clean-image-pool-n-spa-care/service/571854916131749896', '571854916131749896', 'Pool', 'Austin, TX', 5.0, 2, 'new'),

-- Concrete
('J Concrete', 'thumbtack', 'https://www.thumbtack.com/tx/leander/concrete-contractors/j-concrete/service/453507403943813121', '453507403943813121', 'Concrete', 'Austin, TX', 5.0, 9, 'new'),
('Hill Country Slabs', 'thumbtack', 'https://www.thumbtack.com/tx/austin/concrete-contractors/hill-country-slabs/service/571853197181902851', '571853197181902851', 'Concrete', 'Austin, TX', 5.0, 3, 'new'),
('Tobias Construction', 'thumbtack', 'https://www.thumbtack.com/tx/austin/concrete-removal/tobias-construction/service/498613162467393554', '498613162467393554', 'Concrete', 'Austin, TX', 5.0, 14, 'new'),
('General Wood Flooring LLC', 'thumbtack', 'https://www.thumbtack.com/tx/austin/hardwood-floor-installation/general-wood-flooring-llc/service/508638301479428096', '508638301479428096', 'Flooring', 'Austin, TX', 5.0, 26, 'new'),
('Uriostegui Hardwood Flooring LLC', 'thumbtack', 'https://www.thumbtack.com/tx/austin/hardwood-floor-refinishing/uriostegui-hardwood-flooring-llc/service/407252814601158658', '407252814601158658', 'Flooring', 'Austin, TX', 4.5, 41, 'new'),
('Oleksandr Salii', 'thumbtack', 'https://www.thumbtack.com/tx/austin/handyman/oleksandr-salii/service/475722412598796312', '475722412598796312', 'Handyman', 'Austin, TX', 4.9, 359, 'new'),

-- Garage Doors
('MRS Garage Door Services', 'thumbtack', 'https://www.thumbtack.com/tx/houston/garage-door-repair/mrs-garage-door-services/service/504907443092709382', '504907443092709382', 'Garage Doors', 'Austin, TX', 4.7, 391, 'new'),
('Rise & Shine Garage Doors', 'thumbtack', 'https://www.thumbtack.com/tx/austin/garage-door-repair/rise-shine-garage-doors/service/568491060307804173', '568491060307804173', 'Garage Doors', 'Austin, TX', 5.0, 90, 'new'),
('Edge Garage Doors LLC', 'thumbtack', 'https://www.thumbtack.com/tx/austin/garage-door-repair/edge-garage-doors-llc/service/546351472402546693', '546351472402546693', 'Garage Doors', 'Austin, TX', 4.9, 70, 'new'),
('A Plus Garage Doors LLC', 'thumbtack', 'https://www.thumbtack.com/tx/hutto/garage-door-repair/plus-garage-doors-llc/service/340864498199208142', '340864498199208142', 'Garage Doors', 'Austin, TX', 5.0, 488, 'new'),
('Nexa Garage LLC', 'thumbtack', 'https://www.thumbtack.com/tx/pflugerville/garage-door-repair/nexa-garage-llc/service/508012408386412553', '508012408386412553', 'Garage Doors', 'Austin, TX', 5.0, 99, 'new'),
('A1 Garage Door Service', 'thumbtack', 'https://www.thumbtack.com/tx/austin/garage-doors/a1-garage-door-service/service/473895335871119385', '473895335871119385', 'Garage Doors', 'Austin, TX', 4.8, 47, 'new'),
('Dream Bay Garage Door', 'thumbtack', 'https://www.thumbtack.com/tx/corbin/garage-doors/dream-bay-garage-door/service/564122405891661833', '564122405891661833', 'Garage Doors', 'Austin, TX', 5.0, 10, 'new'),
('Anytime Garage Door ATX', 'thumbtack', 'https://www.thumbtack.com/tx/austin/garage-door-repair/anytime-garage-door-atx/service/446068227083804689', '446068227083804689', 'Garage Doors', 'Austin, TX', 4.7, 108, 'new'),

-- Windows
('Bello Remodeling Windows Siding Roofing', 'thumbtack', 'https://www.thumbtack.com/tx/austin/vinyl-siding-install/bello-remodeling-windows-siding-roofing/service/299110693741748459', '299110693741748459', 'Windows,Siding,Roofing', 'Austin, TX', 5.0, 89, 'new'),
('Window Nation of Austin', 'thumbtack', 'https://www.thumbtack.com/tx/austin/window-installation/window-nation-austin/service/504484193547698179', '504484193547698179', 'Windows', 'Austin, TX', 4.3, 78, 'new'),
('JP Exteriors', 'thumbtack', 'https://www.thumbtack.com/tx/austin/vinyl-siding-install/jp-exteriors/service/477424595147505681', '477424595147505681', 'Windows,Siding', 'Austin, TX', 5.0, 9, 'new'),
('Zen Windows Austin', 'thumbtack', 'https://www.thumbtack.com/tx/austin/window-installation/zen-windows-austin/service/491780028089458693', '491780028089458693', 'Windows', 'Austin, TX', 4.8, 46, 'new'),
('Maverick Windows Austin', 'thumbtack', 'https://www.thumbtack.com/tx/georgetown/window-installation/maverick-windows-austin/service/427217580455452693', '427217580455452693', 'Windows', 'Austin, TX', 4.5, 15, 'new'),
('Texas Window Store', 'thumbtack', 'https://www.thumbtack.com/tx/cedar-park/window-installation/texas-window-store/service/322947971921960967', '322947971921960967', 'Windows', 'Austin, TX', 4.6, 17, 'new');
