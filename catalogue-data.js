/**
 * ELEVATE EDGE INTERIORS — Built-in Interior Items Catalogue
 * Comprehensive luxury interior design & execution items with specifications, units, and indicative pricing.
 */

const DEFAULT_CATALOGUE = [
  // ==================== LIVING ROOM ====================
  {
    id: "lr-01",
    name: "TV Base Unit",
    category: "Living Room",
    unit: "Running ft.",
    indicativePrice: 1850,
    description: "Custom floor-mounted TV console unit with soft-closing drawers, concealed cable management, and premium laminate/veneer finish.",
    subpoints: [
      "Marine grade HDHMR / BWP plywood carcass construction",
      "Soft-close telescopic drawer channels (Hettich / Hafele)",
      "High-gloss acrylic or textured matte laminate finish",
      "Concealed wire management channels with brush grommets",
      "Internal storage compartments with satin finish edge-banding",
      "Handleless profile design with J-pull chamfered edges"
    ]
  },
  {
    id: "lr-02",
    name: "TV Back Panel",
    category: "Living Room",
    unit: "Sq. ft.",
    indicativePrice: 650,
    description: "Aesthetic wooden back panel with concealed perimeter warm-white LED strip lighting and acoustic dampening.",
    subpoints: [
      "18mm calibrated ply with fluted or smooth finish paneling",
      "Grooved vertical fluting with champagne gold T-profile inserts",
      "Concealed warm white (3000K) LED strip light profile channel",
      "Fire-retardant surface coating and anti-termite treatment",
      "Seamless wall mounting with heavy-duty Z-clamps"
    ]
  },
  {
    id: "lr-03",
    name: "TV Wall Panelling",
    category: "Living Room",
    unit: "Sq. ft.",
    indicativePrice: 750,
    description: "Full height accent wall panelling integrating charcoal fluted louvers, marble-finish PVC/quartz sheets, and champagne gold metal inlays.",
    subpoints: [
      "Combination of natural charcoal veneer and Italian PU finish",
      "Champagne gold SS 304 PVD-coated metal inlay strips",
      "Integrated electrical conduit provisions for TV & soundbar mounting",
      "Moisture-resistant treatment for longevity"
    ]
  },
  {
    id: "lr-04",
    name: "Display Unit",
    category: "Living Room",
    unit: "Sq. ft.",
    indicativePrice: 1200,
    description: "Luxury open & closed display curio unit with aluminum profile glass shutters and internal spot illumination.",
    subpoints: [
      "Slim-line anodized gold aluminum frame glass shutters",
      "Toughened 8mm fluted or tinted bronze glass shelves",
      "Recessed micro LED spotlights with sensor switch",
      "PU painted back panel with mirror or stone accent"
    ]
  },
  {
    id: "lr-05",
    name: "Crockery Unit",
    category: "Living Room",
    unit: "Sq. ft.",
    indicativePrice: 1450,
    description: "Dual-tier crockery cabinet with bronze glass top cabinets, quartz counter, and base storage drawers.",
    subpoints: [
      "Upper cabinets with soft-close hydraulic gas-lift shutters",
      "Toughened bronze-tinted glass with integrated warm backlighting",
      "Solid quartz / Kalinga stone service ledge counter",
      "Lower pull-out organizers for cutlery and fine dining sets"
    ]
  },
  {
    id: "lr-06",
    name: "Shoe Rack",
    category: "Living Room",
    unit: "Sq. ft.",
    indicativePrice: 950,
    description: "Foyer shoe storage console with ventilated louvers, cushioned sitting bench, and sock drawer.",
    subpoints: [
      "Ventilated tier shelves for up to 24 pairs of footwear",
      "Upholstered luxury velvet/leatherette seating bench",
      "Upper utility drawer for keys, socks, and shoe-care essentials",
      "Brass profile handles and concealed brass legs"
    ]
  },
  {
    id: "lr-07",
    name: "Sofa",
    category: "Living Room",
    unit: "Nos.",
    indicativePrice: 65000,
    description: "Custom handcrafted 3-seater luxury sofa with solid teakwood internal frame and high-density foam cushions.",
    subpoints: [
      "Solid seasoned Neem/Teak wood internal framework with 10-year warranty",
      "High resilience 40-density Sleepwell foam cushioning",
      "Premium stain-resistant Belgian velvet / suede upholstery",
      "Brushed champagne gold stainless steel accent legs"
    ]
  },
  {
    id: "lr-08",
    name: "Coffee Table",
    category: "Living Room",
    unit: "Nos.",
    indicativePrice: 22000,
    description: "Designer nesting coffee table set with Italian composite marble top and champagne gold PVD coated steel base.",
    subpoints: [
      "20mm beveled Italian marble or sintered stone top",
      "Grade 304 stainless steel base with electroplated gold finish",
      "Anti-scratch floor protectors and weighted stability base",
      "Dual nested nesting design with varying heights"
    ]
  },
  {
    id: "lr-09",
    name: "Centre Table",
    category: "Living Room",
    unit: "Nos.",
    indicativePrice: 26000,
    description: "Sculptural centre table with fluted hardwood base and smoked tempered glass surface.",
    subpoints: [
      "Handcrafted solid fluted ashwood pedestal base",
      "10mm toughened smoked glass top with polished pencil edges",
      "Matte polyurethane clear protective coating"
    ]
  },
  {
    id: "lr-10",
    name: "Side Table",
    category: "Living Room",
    unit: "Nos.",
    indicativePrice: 9500,
    description: "End table with pullout drawer, brass knob, and natural marble top for sofa corners.",
    subpoints: [
      "Compact footprint suited for sofa flanking",
      "Single soft-close storage drawer",
      "Natural stone insert top with brushed gold metal trim"
    ]
  },
  {
    id: "lr-11",
    name: "False Ceiling",
    category: "Living Room",
    unit: "Sq. ft.",
    indicativePrice: 145,
    description: "Designer Gypsum false ceiling with peripheral cove lighting trough, perimeter channel, and AC ducting provision.",
    subpoints: [
      "Saint-Gobain / Gyproc genuine gypsum boards (12.5mm)",
      "Galvanized iron (GI) framing with heavy gauge perimeter brackets",
      "Dual cove trough for indirect warm LED illumination",
      "Smooth level-4 putty finishing ready for premium emulsion"
    ]
  },
  {
    id: "lr-12",
    name: "Decorative Wall Panelling",
    category: "Living Room",
    unit: "Sq. ft.",
    indicativePrice: 580,
    description: "Feature accent wall panelling featuring customized acoustic slats and satin charcoal PU finish.",
    subpoints: [
      "Sound-absorbing felt backing with moisture barrier",
      "Precision CNC grooved wooden battens",
      "Champagne gold metallic accent trims"
    ]
  },
  {
    id: "lr-13",
    name: "Curtains and Blinds",
    category: "Living Room",
    unit: "Sq. ft.",
    indicativePrice: 380,
    description: "Double-track motorized drapery with sheer linen curtains and 100% blackout satin curtains.",
    subpoints: [
      "Motorized silent motorized track compatible with home automation",
      "First layer: Textured natural sheer linen fabric",
      "Second layer: High thread count 100% blackout fabric",
      "S-fold ripple wave styling with precision lead weighted hem"
    ]
  },
  {
    id: "lr-14",
    name: "Lighting Fixtures",
    category: "Living Room",
    unit: "Set",
    indicativePrice: 35000,
    description: "Comprehensive living room architectural lighting package with magnetic track lights, COB warm downlights, and chandelier provision.",
    subpoints: [
      "Magnetic 48V low voltage recessed track system with spotlights",
      "CRI > 90 anti-glare deep recessed COB downlights",
      "3000K warm white high-efficiency LED strips for ceiling coves",
      "Drivers and surge protection included"
    ]
  },

  // ==================== BEDROOM ====================
  {
    id: "br-01",
    name: "Wardrobe",
    category: "Bedroom",
    unit: "Sq. ft.",
    indicativePrice: 1750,
    description: "Full-height master bedroom wardrobe with customized internal organizers, LED sensor hangers, and premium finishes.",
    subpoints: [
      "Heavy-duty marine-ply carcass with 0.8mm interior balancing laminate",
      "Soft-closing hinges with 110-degree opening angle (Hettich / Hafele)",
      "Dedicated saree/trouser pullouts, shoe tray, and lockable jewelry drawer with velvet liner",
      "Integrated LED sensor hanging rods activated on door opening",
      "Full height champagne gold profile handles"
    ]
  },
  {
    id: "br-02",
    name: "Sliding Wardrobe",
    category: "Bedroom",
    unit: "Sq. ft.",
    indicativePrice: 2100,
    description: "Floor-to-ceiling sliding wardrobe with top-hung silent sliding mechanism, lacquered glass and veneer shutter combination.",
    subpoints: [
      "Top-hung soft-closing sliding system (EBE or Hettich InLine XL)",
      "Anodized champagne gold aluminum slim profile shutters",
      "Combination of tinted bronze mirror and anti-fingerprint laminate",
      "Dust-preventing brush seals and integrated floor guide channels"
    ]
  },
  {
    id: "br-03",
    name: "Hinged Wardrobe",
    category: "Bedroom",
    unit: "Sq. ft.",
    indicativePrice: 1650,
    description: "Classic swing door wardrobe with fluted profile detailing, concealed hinges, and external drawer chest.",
    subpoints: [
      "18mm BWP plywood doors with polyurethane matte finish",
      "Clip-on 3D adjustable soft-close hinges with built-in dampers",
      "Ergonomic full-length vertical gold pull handles",
      "Spacious hanging compartments for suits, gowns, and daily wear"
    ]
  },
  {
    id: "br-04",
    name: "Loft Storage",
    category: "Bedroom",
    unit: "Sq. ft.",
    indicativePrice: 1100,
    description: "Top-level overhead loft cabinets with hydraulic upward-lifting flaps for seasonal baggage storage.",
    subpoints: [
      "Heavy-duty hydraulic lift stays for effortless opening",
      "Seamless flush alignment with lower wardrobe face",
      "Reinforced base shelf to hold heavy travel luggage",
      "Dust-proof magnetic push latches"
    ]
  },
  {
    id: "br-05",
    name: "Bed with Storage",
    category: "Bedroom",
    unit: "Nos.",
    indicativePrice: 58000,
    description: "King size upholstered bed with dual hydraulic gas-lift mechanism and massive compartmentalized internal storage.",
    subpoints: [
      "Solid hardwood internal perimeter box with anti-bacterial laminate interior",
      "1200N heavy-duty German hydraulic gas-lift brackets for effortless mattress lift",
      "Anti-creak heavy ply mattress support deck",
      "Padded upholstery base border in stain-resistant leatherette"
    ]
  },
  {
    id: "br-06",
    name: "Headboard",
    category: "Bedroom",
    unit: "Sq. ft.",
    indicativePrice: 650,
    description: "Extended wall-mounted accent headboard with vertical channel tufting, integrated electrical switches, and reading lights.",
    subpoints: [
      "High density foam cushioning with plush velvet fabric upholstery",
      "Concealed cutouts for bedroom bedside switchboards and USB charging hubs",
      "Champagne gold metal vertical inlay accents",
      "Mounted with heavy-duty interlocking cleat brackets"
    ]
  },
  {
    id: "br-07",
    name: "Bedside Table",
    category: "Bedroom",
    unit: "Nos.",
    indicativePrice: 9500,
    description: "Floating / pedestal bedside nightstand with dual drawers and wireless charging station surface.",
    subpoints: [
      "Under-mount synchronized soft-close drawer runners",
      "Chamfered bevel front profiles with brushed brass handles",
      "Scratch-proof quartz / PU top surface"
    ]
  },
  {
    id: "br-08",
    name: "Dressing Table",
    category: "Bedroom",
    unit: "Sq. ft.",
    indicativePrice: 1350,
    description: "Full-length mirror dressing counter with back-lit perimeter vanity lighting and concealed cosmetics organizer.",
    subpoints: [
      "Full-height 5mm Saint-Gobain mirror with beveled edges",
      "Touch-sensor dimmable LED backlight (3000K-4000K daylight)",
      "Side pull-out apothecary tower for perfume, skincare, and jewelry",
      "Compact matching cushioned dressing pouf"
    ]
  },
  {
    id: "br-09",
    name: "Study Table",
    category: "Bedroom",
    unit: "Running ft.",
    indicativePrice: 2200,
    description: "Ergonomic work-from-home study desk with wire conduit, soft-close drawer chest, and laptop ledge.",
    subpoints: [
      "25mm sturdy table top with post-formed or edge-banded finish",
      "Built-in flip-top wire box with HDMI, LAN, and power sockets",
      "Pedestal 3-drawer unit with master central lock"
    ]
  },
  {
    id: "br-10",
    name: "Study Unit",
    category: "Bedroom",
    unit: "Sq. ft.",
    indicativePrice: 1400,
    description: "Combined study workstation and overhead book shelves with display niches and warm under-shelf task light.",
    subpoints: [
      "Asymmetric contemporary open bookshelf niches",
      "Concealed warm white under-shelf task lighting channel",
      "Pin-up cork / magnetic acoustic bulletin board panel"
    ]
  },
  {
    id: "br-11",
    name: "Bedroom False Ceiling",
    category: "Bedroom",
    unit: "Sq. ft.",
    indicativePrice: 135,
    description: "Minimalist ceiling design with central fan island, ambient periphery cove, and focused spot provisions.",
    subpoints: [
      "Moisture-resistant gypsum board suspended on galvanized grid",
      "Integrated cove light groove for glare-free indirect lighting",
      "Smooth ceiling finish with anti-fungal primer coating"
    ]
  },
  {
    id: "br-12",
    name: "Wall Panelling",
    category: "Bedroom",
    unit: "Sq. ft.",
    indicativePrice: 620,
    description: "Accent bed-back wall paneling featuring fabric acoustic tiles and natural oak laminate flutes.",
    subpoints: [
      "Custom geometric layout with chamfered edge details",
      "Acoustic backing reducing ambient reverberation",
      "Integrated warm LED profile channels"
    ]
  },

  // ==================== KITCHEN ====================
  {
    id: "kt-01",
    name: "Modular Kitchen",
    category: "Kitchen",
    unit: "Running ft.",
    indicativePrice: 3800,
    description: "Complete luxury modular kitchen setup including base, wall, and loft cabinetry with tandem boxes and premium hardware.",
    subpoints: [
      "100% 710-grade Boiling Water Proof (BWP) marine plywood carcass",
      "Anti-bacterial inner laminate lining in light grey / linen texture",
      "Blum / Hafele soft-close Tandembox drawer systems with 50kg load capacity",
      "Seamless acrylic / anti-scratch ceramic-finish shutters",
      "10-year comprehensive warranty against moisture and termite damage"
    ]
  },
  {
    id: "kt-02",
    name: "Base Cabinets",
    category: "Kitchen",
    unit: "Running ft.",
    indicativePrice: 2400,
    description: "Under-counter heavy-duty storage modules with adjustable PVC legs, waterproof skirting, and stainless steel baskets.",
    subpoints: [
      "Adjustable 100mm PVC plinth legs with detachable brushed SS skirting",
      "Thali basket, plain basket, and cup-saucer wire baskets in SS 304 grade",
      "Under-sink module with aluminum foil bottom shield against water drips",
      "Full extension soft-close runners with lifetime lubrication"
    ]
  },
  {
    id: "kt-03",
    name: "Wall Cabinets",
    category: "Kitchen",
    unit: "Running ft.",
    indicativePrice: 1950,
    description: "Ergonomic overhead cabinets with bi-fold lift-up shutters, under-cabinet task illumination, and dish drainer rack.",
    subpoints: [
      "Blum Aventos HF bi-fold lift-up mechanism for seamless accessibility",
      "SS 304 dish drainer tray with removable drip tray",
      "Recessed LED profile strip lighting pointing directly onto the countertop",
      "Frosted glass shutter inserts with gold/black aluminum frame"
    ]
  },
  {
    id: "kt-04",
    name: "Tall Units",
    category: "Kitchen",
    unit: "Nos.",
    indicativePrice: 48000,
    description: "Full height pantry appliance tower unit with built-in microwave, oven cavity, and internal pullout larder.",
    subpoints: [
      "Heavy duty larder pullout system with 6 internal chrome baskets",
      "Ventilated cavity for built-in microwave and convection oven",
      "Upper overhead loft storage with push-to-open latch",
      "Reinforced base supporting heavy electrical appliances"
    ]
  },
  {
    id: "kt-05",
    name: "Pantry Unit",
    category: "Kitchen",
    unit: "Nos.",
    indicativePrice: 42000,
    description: "Space-saving tandem pantry swing-out organizer that brings back-shelf items to the front upon door opening.",
    subpoints: [
      "Hafele / Kesseböhmer tandem pullout pantry mechanism",
      "12 adjustable non-slip wire and solid-base shelves",
      "Soft-close damping system for smooth, quiet closure"
    ]
  },
  {
    id: "kt-06",
    name: "Kitchen Island",
    category: "Kitchen",
    unit: "Nos.",
    indicativePrice: 55000,
    description: "Freestanding central kitchen island with waterfall countertop, breakfast bar overhang, and dual-side drawers.",
    subpoints: [
      "Double-sided storage with cutlery and heavy vessel drawers",
      "Concealed pop-up electrical tower with USB and power sockets",
      "Waterfall side edge panels seamlessly extending to the floor",
      "Bar stool leg space with subtle under-counter illumination"
    ]
  },
  {
    id: "kt-07",
    name: "Breakfast Counter",
    category: "Kitchen",
    unit: "Running ft.",
    indicativePrice: 2800,
    description: "Cantilevered solid quartz/wood breakfast counter with footrest rail and decorative pendant lighting support.",
    subpoints: [
      "Solid 35mm reinforced structure with concealed steel supports",
      "Stain-resistant and heat-tolerant engineered quartz top",
      "Comfortable knee clearance matching standard counter stools"
    ]
  },
  {
    id: "kt-08",
    name: "Countertop",
    category: "Kitchen",
    unit: "Sq. ft.",
    indicativePrice: 750,
    description: "Supply, precision fabrication, edge-molding, and installation of premium kitchen countertop stone.",
    subpoints: [
      "Choice of premium Granite (Black Galaxy / Jet Black) or Kalinga Quartz",
      "Half-round / chamfered machine-polished edges with drip groove",
      "Precision cutouts for under-mount granite sink and gas hob",
      "Sealed with high-grade stone impregnating sealer"
    ]
  },
  {
    id: "kt-09",
    name: "Backsplash",
    category: "Kitchen",
    unit: "Sq. ft.",
    indicativePrice: 380,
    description: "Designer kitchen backsplash wall tiling with subway, chevron, or large-format glazed porcelain slabs.",
    subpoints: [
      "Stain-proof epoxy grouting resistant to grease and high heat",
      "Full height tiling up to overhead cabinet underside",
      "Laser-leveled tile joints with neat silicone perimeter sealing"
    ]
  },
  {
    id: "kt-10",
    name: "Drawer Units",
    category: "Kitchen",
    unit: "Nos.",
    indicativePrice: 7500,
    description: "Custom modular drawer box module with customized dividers for pots, pans, and grocery items.",
    subpoints: [
      "Heavy load bearing slides rated up to 45kg dynamic load",
      "Anti-slip washable rubber liners inside every drawer",
      "Customizable internal cross dividers"
    ]
  },
  {
    id: "kt-11",
    name: "Cutlery Organizers",
    category: "Kitchen",
    unit: "Nos.",
    indicativePrice: 3500,
    description: "Removable stainless steel / wood cutlery separator tray for forks, spoons, knives, and spatulas.",
    subpoints: [
      "Food-grade stainless steel or moisture-resistant beechwood trays",
      "Adjustable compartments fitting standard drawer widths",
      "Dishwasher safe and easily removable for cleaning"
    ]
  },
  {
    id: "kt-12",
    name: "Kitchen Accessories",
    category: "Kitchen",
    unit: "Set",
    indicativePrice: 18000,
    description: "Comprehensive modular accessory set including corner carousel, pull-out bottle rack, detergent rack, and waste bin.",
    subpoints: [
      "SS 304 Magic Corner / Blind Corner twin pullout system",
      "2-tier bottle and spice pull-out rack with smooth dampers",
      "Under-sink pull-out dual compartment waste bin with lid",
      "Wall hanging utility rail with ladle hooks and paper towel holder"
    ]
  },

  // ==================== DINING ROOM ====================
  {
    id: "dn-01",
    name: "Dining Table",
    category: "Dining Room",
    unit: "Nos.",
    indicativePrice: 48000,
    description: "Luxury 6-seater dining table with Italian marble / sintered stone top and sculptural hardwood & gold metal base.",
    subpoints: [
      "20mm natural Italian Onyx / Statuario marble or sintered ceramic stone top",
      "Stain-resistant nano-coating protection preventing oil/wine spots",
      "Solid ashwood / steel geometric pedestal base with electroplated brass trims",
      "Comfortably seats 6 adults with ample elbow and legroom"
    ]
  },
  {
    id: "dn-02",
    name: "Dining Chairs",
    category: "Dining Room",
    unit: "Nos.",
    indicativePrice: 9500,
    description: "Ergonomic dining chairs with curved upholstered backrests, high-density foam, and tapered metal legs.",
    subpoints: [
      "Ergonomic barrel back design supporting spine alignment",
      "Premium water-repellent velvet or micro-fiber leather upholstery",
      "Carbon steel tapered legs with gold brushed PVD caps",
      "Non-marking rubber foot glides"
    ]
  },
  {
    id: "dn-03",
    name: "Buffet Unit",
    category: "Dining Room",
    unit: "Sq. ft.",
    indicativePrice: 1550,
    description: "Credenza storage console with fluted shutter doors, champagne gold legs, and stone serving top.",
    subpoints: [
      "Spacious internal shelves for warmers, dinner sets, and table linens",
      "Fluted wooden doors with push-to-open magnetic catches",
      "Top stone ledge resistant to hot serving platters",
      "Warm ambient floor wash lighting underneath"
    ]
  },
  {
    id: "dn-04",
    name: "Display Shelves",
    category: "Dining Room",
    unit: "Sq. ft.",
    indicativePrice: 950,
    description: "Floating asymmetric dining wall shelves with integrated warm LED backlights for displaying crystal ware and artifacts.",
    subpoints: [
      "Concealed heavy-duty bracket mounting with no visible screws",
      "Warm white diffuse LED lighting along rear rebated channels",
      "PU painted finish matching dining room color theme"
    ]
  },
  {
    id: "dn-05",
    name: "Dining Area Panelling",
    category: "Dining Room",
    unit: "Sq. ft.",
    indicativePrice: 680,
    description: "Feature dining wall panelling with beveled bronze mirror segments and vertical gold profile T-strips.",
    subpoints: [
      "Precision cut 5mm tinted bronze mirror with 1-inch beveling",
      "High-density moisture-resistant MDF backing substrate",
      "Champagne gold SS 304 PVD accent inlays"
    ]
  },

  // ==================== BATHROOM ====================
  {
    id: "bt-01",
    name: "Vanity Unit",
    category: "Bathroom",
    unit: "Nos.",
    indicativePrice: 28000,
    description: "Wall-hung luxury vanity cabinet crafted from 100% waterproof PVC/HDHMR boards with soft-close drawers.",
    subpoints: [
      "100% waterproof PVC / Marine plywood carcass with epoxy edge sealing",
      "Soft-close tandem drawers with U-shaped cutout for plumbing siphon",
      "Anti-fingerprint matte polyurethane exterior finish",
      "Concealed heavy-duty wall hanging brackets tested to 150kg"
    ]
  },
  {
    id: "bt-02",
    name: "Mirror Cabinet",
    category: "Bathroom",
    unit: "Nos.",
    indicativePrice: 16500,
    description: "LED touch sensor smart mirror medicine cabinet with demister pad, internal shelves, and shaver socket.",
    subpoints: [
      "Built-in heating demister pad preventing condensation fogging",
      "Touch sensor switch with 3-tone color temperature tuning (Warm, Neutral, White)",
      "Concealed internal storage with adjustable glass shelves",
      "Internal water-resistant 2-pin electrical socket"
    ]
  },
  {
    id: "bt-03",
    name: "Storage Cabinet",
    category: "Bathroom",
    unit: "Sq. ft.",
    indicativePrice: 1100,
    description: "Tall bathroom utility cabinet for linen, extra toiletries, and cleaning supplies with moisture barrier.",
    subpoints: [
      "Waterproof board construction resistant to direct steam exposure",
      "Ventilated door louvers preventing internal mold build-up",
      "Adjustable shelf heights for tall shampoo and cleaner bottles"
    ]
  },
  {
    id: "bt-04",
    name: "Bathroom Shelves",
    category: "Bathroom",
    unit: "Nos.",
    indicativePrice: 2800,
    description: "Toughened glass / brass corner shelving caddy for shower shampoo and soap bottles.",
    subpoints: [
      "10mm clear toughened safety glass with rounded corners",
      "Solid brass wall brackets with chrome / brushed gold finish",
      "Rust-proof SS 304 screws and anchors"
    ]
  },
  {
    id: "bt-05",
    name: "Vanity Counter",
    category: "Bathroom",
    unit: "Sq. ft.",
    indicativePrice: 850,
    description: "Natural marble or quartz basin counter with apron fascia and basin cutout.",
    subpoints: [
      "20mm thick polished quartz with 75mm front apron drop",
      "Under-counter sink machine cut-out with polished internal rim",
      "Faucet hole core-drilling and silicone perimeter sealing"
    ]
  },

  // ==================== OFFICE & COMMERCIAL ====================
  {
    id: "of-01",
    name: "Office Workstation",
    category: "Office and Commercial",
    unit: "Nos.",
    indicativePrice: 18500,
    description: "Modular corporate workstation with acoustic fabric partition, wire management raceway, and 3-drawer pedestal.",
    subpoints: [
      "25mm pre-laminated engineered wood table top with 2mm PVC edge banding",
      "Modular powder-coated triangular steel legs with leveler glides",
      "Aluminium raceway with provisions for power, data, and telephony cables",
      "Pin-up acoustic fabric divider screen between workstations"
    ]
  },
  {
    id: "of-02",
    name: "Office Table",
    category: "Office and Commercial",
    unit: "Nos.",
    indicativePrice: 24000,
    description: "Manager desk with side credenza return, modesty panel, and cable management tray.",
    subpoints: [
      "Spacious working surface (5ft x 2.5ft) with chamfered edge profile",
      "Attached side return credenza with lockable cabinet and sliding shutters",
      "Full depth wooden modesty panel with recessed gold accent line"
    ]
  },
  {
    id: "of-03",
    name: "Executive Desk",
    category: "Office and Commercial",
    unit: "Nos.",
    indicativePrice: 65000,
    description: "Director / CEO executive desk in natural teak veneer with leather writing blotter and motorized wire organizer.",
    subpoints: [
      "Premium natural walnut/teak veneer with high-durability PU coating",
      "Hand-stitched leatherette inset writing pad with soft cushion feel",
      "Motorized pop-up power box with wireless phone charging plate",
      "Integrated side credenza containing lockable safe compartment"
    ]
  },
  {
    id: "of-04",
    name: "Office Chairs",
    category: "Office and Commercial",
    unit: "Nos.",
    indicativePrice: 12500,
    description: "Ergonomic mesh high-back office chair with multi-angle synchro-tilt lock, 3D armrests, and lumbar support.",
    subpoints: [
      "Breathable high-tensile mesh back with adjustable lumbar depth",
      "Molded polyurethane foam seat with waterfall front edge",
      "Class-4 heavy duty gas lift tested for 150kg load capacity",
      "Heavy duty aluminum die-cast base with 60mm nylon castors"
    ]
  },
  {
    id: "of-05",
    name: "Conference Table",
    category: "Office and Commercial",
    unit: "Nos.",
    indicativePrice: 75000,
    description: "10-seater boardroom conference table with dual connectivity troughs and solid fluted base columns.",
    subpoints: [
      "12ft x 4ft seamless boat-shaped top with curved ergonomic edges",
      "Dual aluminum flip-up cable boxes for HDMI, USB-C, power & audio conferencing",
      "Concealed internal column wire risers connecting to floor conduits",
      "Heavy timber structure with anti-deflection steel beams"
    ]
  },
  {
    id: "of-06",
    name: "Reception Desk",
    category: "Office and Commercial",
    unit: "Nos.",
    indicativePrice: 48000,
    description: "Contemporary curved reception greeting counter with acrylic back-lit company logo display and dual receptionist bays.",
    subpoints: [
      "High transaction counter with curved fluted profile and stone facade",
      "Lower internal working desk for computer monitors and billing printers",
      "Concealed warm LED cove lighting highlighting company brand identity",
      "Built-in lockable cash drawer and CPU holder"
    ]
  },
  {
    id: "of-07",
    name: "Reception Backdrop",
    category: "Office and Commercial",
    unit: "Sq. ft.",
    indicativePrice: 750,
    description: "Grand reception feature wall with Italian marble cladding, acoustic felt, and brass lettering provision.",
    subpoints: [
      "Translucent back-lit Onyx or large format porcelain slab accents",
      "Gold PVD finished stainless steel spacer studs for 3D metallic logo mounting",
      "Perimeter diffuse cove lighting providing a welcoming ambiance"
    ]
  },
  {
    id: "of-08",
    name: "Partition Panels",
    category: "Office and Commercial",
    unit: "Sq. ft.",
    indicativePrice: 380,
    description: "Sound-insulated modular glass & gypsum partitions for conference rooms and private cabins.",
    subpoints: [
      "Slimline black powder-coated aluminum framing",
      "12mm clear toughened glass panels with sound acoustic seals",
      "Frosted vinyl film banding for executive privacy"
    ]
  },
  {
    id: "of-09",
    name: "Shelving Units",
    category: "Office and Commercial",
    unit: "Sq. ft.",
    indicativePrice: 850,
    description: "Commercial archival shelving system for records, client folders, and merchandise displays.",
    subpoints: [
      "Reinforced heavy-duty shelves preventing sag under file weight",
      "Label holders on each shelf row for document indexing",
      "Lockable lower storage cabinets for confidential files"
    ]
  },

  // ==================== GENERAL INTERIOR WORKS ====================
  {
    id: "gw-01",
    name: "False Ceiling",
    category: "General Interior Works",
    unit: "Sq. ft.",
    indicativePrice: 140,
    description: "Turnkey gypsum board false ceiling including metal framework, board fixing, joint taping, and primer coat.",
    subpoints: [
      "Genuine Saint-Gobain Gyproc / USG Boral 12.5mm boards",
      "0.5mm GI framing channels spaced at 400mm centers",
      "Fiberglass joint mesh tape and multi-coat Gyproc jointing compound",
      "Cutouts for downlights, ceiling speakers, and smoke detectors included"
    ]
  },
  {
    id: "gw-02",
    name: "Electrical Work",
    category: "General Interior Works",
    unit: "Job",
    indicativePrice: 45000,
    description: "Complete electrical rerouting, copper wiring, switchboards, DB dressing, and lighting fixtures installation.",
    subpoints: [
      "FR-LSH (Fire Retardant Low Smoke Halogen) copper wires (Finolex / Polycab)",
      "Concealed heavy-gauge PVC conduits chased into masonry walls",
      "Schneider / Legrand modular switches, sockets, and faceplates",
      "Distribution board termination with individual MCB and RCCB earth leakage protection"
    ]
  },
  {
    id: "gw-03",
    name: "Plumbing Work",
    category: "General Interior Works",
    unit: "Job",
    indicativePrice: 32000,
    description: "Sanitary plumbing modification, CPVC/UPVC water lines, drainage connection, and luxury CP fitting installations.",
    subpoints: [
      "Astral / Ashirvad composite CPVC pipe lines for hot and cold supply",
      "SWR PVC pipes for waste water drainage with leak-free solvent joints",
      "Installation of wall-hung WC, concealed flush cistern, and diverted shower valves",
      "Pressure testing at 10 bar before wall closure"
    ]
  },
  {
    id: "gw-04",
    name: "Painting",
    category: "General Interior Works",
    unit: "Sq. ft.",
    indicativePrice: 42,
    description: "Premium interior wall painting with 2 coats of acrylic putty, 1 coat of primer, and 2 coats of luxury emulsion.",
    subpoints: [
      "Birla White / Asian Paints Wall Care acrylic putty with machine sanding",
      "Asian Paints Royale Luxury Emulsion or Dulux Velvet Touch finish",
      "Zero-VOC eco-friendly formulations with smooth silk sheen",
      "Complete protective masking of flooring and existing fixtures"
    ]
  },
  {
    id: "gw-05",
    name: "Wallpaper",
    category: "General Interior Works",
    unit: "Sq. ft.",
    indicativePrice: 95,
    description: "Supply and professional pasting of luxury imported textured vinyl / non-woven designer wallpaper.",
    subpoints: [
      "High grade moisture-resistant and scrubbable vinyl textured paper",
      "Seamless pattern matching across adjacent roll panels",
      "Specialized mold-resistant wallpaper paste adhesive",
      "Surface primer preparation included"
    ]
  },
  {
    id: "gw-06",
    name: "Flooring",
    category: "General Interior Works",
    unit: "Sq. ft.",
    indicativePrice: 180,
    description: "Supply and laying of large-format vitrified floor tiles / German laminate wooden flooring with skirting.",
    subpoints: [
      "Laser-leveled mortar bed or self-leveling underlayment",
      "High polymer-modified tile adhesive (Laticrete / Roff)",
      "Zero-lip tile leveling spacers and stain-proof epoxy joint filling",
      "Matching 4-inch perimeter wall skirting with beveled top"
    ]
  },
  {
    id: "gw-07",
    name: "Tiling",
    category: "General Interior Works",
    unit: "Sq. ft.",
    indicativePrice: 160,
    description: "Wall and floor decorative tiling work for wet areas, balconies, and utility wash spaces.",
    subpoints: [
      "Waterproofing barrier coating applied prior to tiling",
      "Precision 45-degree mitered edge corner cuts (jolly cuts)",
      "Anti-skid matte vitrified tiles for wet foot safety"
    ]
  },
  {
    id: "gw-08",
    name: "Carpentry",
    category: "General Interior Works",
    unit: "Job",
    indicativePrice: 35000,
    description: "Custom on-site carpentry, door frames, architraves, niche paneling, and bespoke wooden detailing.",
    subpoints: [
      "Seasoned hardwood / teak frames with anti-warp joinery",
      "Premium hydraulic door closers, magnetic door stops, and mortise locks",
      "Polished PU or melamine wood finish"
    ]
  },
  {
    id: "gw-09",
    name: "Glass Work",
    category: "General Interior Works",
    unit: "Sq. ft.",
    indicativePrice: 420,
    description: "Supply and installation of 10mm toughened safety glass shower enclosures, partitions, and mirrors.",
    subpoints: [
      "10mm clear / frosted Saint-Gobain toughened safety glass with polished edges",
      "SS 304 grade hinges, glass clamps, stabilizer bars, and magnetic water-stop seals",
      "Anti-limescale easy-clean surface coating"
    ]
  },
  {
    id: "gw-10",
    name: "Aluminium Work",
    category: "General Interior Works",
    unit: "Sq. ft.",
    indicativePrice: 380,
    description: "Heavy-gauge anodized aluminum profile sliding windows, louvers, and balcony partitions.",
    subpoints: [
      "Jindal / Hindalco extruded aluminum sections with 25-micron powder coating",
      "Double glazed unit (DGU) acoustic glass for sound reduction",
      "Multi-point espagnolette locking system and EPDM rubber weather gaskets"
    ]
  },
  {
    id: "gw-11",
    name: "Civil Work",
    category: "General Interior Works",
    unit: "Job",
    indicativePrice: 40000,
    description: "Masonry demolition, brickwork, plastering, chemical waterproofing, and debris disposal.",
    subpoints: [
      "Controlled structural wall opening with lintel beam reinforcement",
      "2-coat chemical waterproofing (Fosroc / Dr. Fixit) for wet zones",
      "Cement plaster with curing and debris carting off-site included"
    ]
  },
  {
    id: "gw-12",
    name: "Installation and Fitting",
    category: "General Interior Works",
    unit: "Job",
    indicativePrice: 20000,
    description: "Comprehensive installation, alignment, hardware fitting, and quality inspection of all modular units.",
    subpoints: [
      "Factory-trained technician crew with precision laser-level alignment",
      "Hardware fine-tuning, shutter gap adjustment, and soft-close calibration",
      "Final inspection checklist signoff"
    ]
  },
  {
    id: "gw-13",
    name: "Transportation",
    category: "General Interior Works",
    unit: "Lot",
    indicativePrice: 15000,
    description: "Safe freight logistics, vehicle transport, loading, transit insurance, and vertical lifting to project floor.",
    subpoints: [
      "Enclosed weather-proof container vehicles for factory-to-site transit",
      "Multi-layer bubble wrap, edge protectors, and corrugated packaging",
      "Manual vertical shifting to apartment/site floor included"
    ]
  },
  {
    id: "gw-14",
    name: "Labour Charges",
    category: "General Interior Works",
    unit: "Job",
    indicativePrice: 25000,
    description: "Dedicated skilled site supervision, artisan craftsmanship, daily site cleaning, and material handling.",
    subpoints: [
      "Certified master carpenters, electricians, and painters",
      "Full-time site supervisor ensuring blueprint adherence",
      "Adherence to apartment association working hour guidelines"
    ]
  },
  {
    id: "gw-15",
    name: "Design and Consultation Fees",
    category: "General Interior Works",
    unit: "Job",
    indicativePrice: 50000,
    description: "Turnkey architectural interior design, 3D photorealistic renders, 2D working drawings, and material selection assistance.",
    subpoints: [
      "Comprehensive 3D walkthrough visualization of all key spaces",
      "Detailed 2D execution blueprints (electrical, plumbing, carpentry, ceiling layout)",
      "Assisted showroom visits for tile, veneer, marble, and fabric selection",
      "Regular periodic design audit visits by lead architect"
    ]
  },
  {
    id: "gw-16",
    name: "Custom Furniture",
    category: "General Interior Works",
    unit: "Job",
    indicativePrice: 45000,
    description: "Bespoke handcrafted loose furniture manufactured to custom client specifications and dimensions.",
    subpoints: [
      "Tailor-made dimensions suited to specific room architecture",
      "Choice of solid teak, oak, brass, and luxury fabric combinations",
      "Sample mock-up approval prior to full scale fabrication"
    ]
  },
  {
    id: "gw-17",
    name: "Other Miscellaneous Work",
    category: "General Interior Works",
    unit: "Lot",
    indicativePrice: 10000,
    description: "Specialized client requested customizations, deep post-construction chemical cleaning, and punch-list touchups.",
    subpoints: [
      "Deep chemical scrubbing of floors, glass, and countertops prior to handover",
      "Touch-up painting after furniture and chandelier installation",
      "Formal key handover kit and warranty documentation binder"
    ]
  }
];

// Available standard Units
const STANDARD_UNITS = [
  "Nos.",
  "Sq. ft.",
  "Running ft.",
  "Sq. m.",
  "Set",
  "Pair",
  "Lot",
  "Job",
  "Month",
  "Hour",
  "Custom unit"
];

// Available Categories
const CATALOGUE_CATEGORIES = [
  "All Categories",
  "Living Room",
  "Bedroom",
  "Kitchen",
  "Dining Room",
  "Bathroom",
  "Office and Commercial",
  "General Interior Works"
];

// Room Packages / Templates for fast quotation generation
const ROOM_PACKAGES = [
  {
    id: "pkg-luxury-living",
    name: "Luxury Living Room Ensemble",
    category: "Living Room",
    description: "Complete luxury living room: TV console, fluted accent wall, LED false ceiling, 5-seater sectional sofa, marble coffee table, and architectural lighting.",
    isBuiltIn: true,
    items: [
      {
        name: "TV Base Unit",
        category: "Living Room",
        unit: "Running ft.",
        quantity: 8,
        unitPrice: 1850,
        description: "Custom floor-mounted TV console unit with soft-closing drawers, concealed cable management, and premium laminate/veneer finish.",
        subpoints: [
          "Marine grade HDHMR / BWP plywood carcass construction",
          "Soft-close telescopic drawer channels (Hettich / Hafele)",
          "High-gloss acrylic or textured matte laminate finish",
          "Concealed wire management channels with brush grommets",
          "Internal storage compartments with satin finish edge-banding"
        ],
        notes: "Champagne gold trim profile finish"
      },
      {
        name: "TV Wall Fluted Panelling",
        category: "Living Room",
        unit: "Sq. ft.",
        quantity: 60,
        unitPrice: 750,
        description: "Full height accent wall panelling integrating charcoal fluted louvers, marble-finish PVC/quartz sheets, and champagne gold metal inlays.",
        subpoints: [
          "Combination of natural charcoal veneer and Italian PU finish",
          "Champagne gold SS 304 PVD-coated metal inlay strips",
          "Integrated electrical conduit provisions for TV & soundbar mounting",
          "Moisture-resistant treatment for longevity"
        ],
        notes: "Warm LED backlight cove inclusion"
      },
      {
        name: "Living Room False Ceiling & Cove Lighting",
        category: "Living Room",
        unit: "Sq. ft.",
        quantity: 180,
        unitPrice: 145,
        description: "Designer gypsum false ceiling with warm white concealed perimeter LED cove lighting and anti-termite framing.",
        subpoints: [
          "Saint-Gobain Gypboard with GI channel framework",
          "Concealed warm white (3000K) LED strip light profile channel",
          "Smooth POP punning and two coats of Asian Paints Royale luxury emulsion"
        ],
        notes: "Includes ceiling cutout provisions for chandelier and downlights"
      },
      {
        name: "Luxury 5-Seater Sectional Sofa",
        category: "Living Room",
        unit: "Job",
        quantity: 1,
        unitPrice: 65000,
        description: "Custom hand-crafted L-shaped sectional sofa upholstered in stain-resistant velvet fabric.",
        subpoints: [
          "Solid neem wood framing with 40-density high-resilience foam",
          "Premium stain-resistant suede velvet upholstery",
          "Brushed champagne gold stainless steel metal leg support"
        ],
        notes: "Fabric shade as per 3D design approval"
      },
      {
        name: "Designer Center Coffee Table",
        category: "Living Room",
        unit: "Nos.",
        quantity: 1,
        unitPrice: 18500,
        description: "Nesting dual coffee table set with Italian marble top and titanium gold PVD coated metal base.",
        subpoints: [
          "Natural Italian marble top with chamfered edge profiling",
          "Titanium gold PVD coated SS frame",
          "Includes lower nesting satellite table"
        ],
        notes: ""
      },
      {
        name: "Architectural Magnetic Track Lighting",
        category: "Living Room",
        unit: "Lot",
        quantity: 1,
        unitPrice: 22000,
        description: "Recessed magnetic track light fixture package with linear diffusers and adjustable spotlight modules.",
        subpoints: [
          "Slimline recessed aluminum magnetic track rail (3 meters)",
          "Includes 2x linear floodlights and 2x adjustable accent spot modules",
          "Warm white 3000K high CRI (>90) LED chips"
        ],
        notes: "Driver and dimming controller included"
      }
    ]
  },
  {
    id: "pkg-master-bedroom",
    name: "Master Bedroom Luxury Suite",
    category: "Bedroom",
    description: "Complete master bedroom set: Floor-to-ceiling sliding wardrobe, King hydraulic bed, tufted headboard, twin nightstands, and vanity dresser.",
    isBuiltIn: true,
    items: [
      {
        name: "Sliding Wardrobe with Integrated Loft",
        category: "Bedroom",
        unit: "Sq. ft.",
        quantity: 60,
        unitPrice: 1950,
        description: "Floor-to-ceiling sliding wardrobe featuring soft-closing rollers, tinted fluted glass shutter accents, and internal sensory LED lighting.",
        subpoints: [
          "Heavy-duty top-hung sliding mechanism with silent soft-close damper",
          "Internal layout with dual hanging rods, soft-close drawers, and jewelry tray",
          "Concealed motion-sensor warm LED profile strip lights inside carcass",
          "BWP marine-grade carcass with 0.8mm balance laminate"
        ],
        notes: "Tinted grey fluted glass and champagne aluminum profile"
      },
      {
        name: "King Bed with Hydraulic Storage",
        category: "Bedroom",
        unit: "Nos.",
        quantity: 1,
        unitPrice: 48000,
        description: "Luxury upholstered King bed (6ft x 6.5ft) with heavy-duty gas-lift hydraulic storage mechanism.",
        subpoints: [
          "German gas-lift hydraulic pistons with 150kg lift capacity",
          "Heavy-duty marine plywood internal storage compartments",
          "Fully cushioned upholstered side rails with stain-resistant fabric"
        ],
        notes: "Mattress excluded"
      },
      {
        name: "Full Height Tufted Velvet Headboard",
        category: "Bedroom",
        unit: "Sq. ft.",
        quantity: 45,
        unitPrice: 650,
        description: "Wall-mounted acoustic accent headboard with vertical geometric channel tufting.",
        subpoints: [
          "High-density foam padding with deep vertical channel fluting",
          "Premium imported stain-resistant velvet fabric",
          "Flanked by vertical brushed champagne gold SS inlays"
        ],
        notes: ""
      },
      {
        name: "Floating Bedside Nightstands",
        category: "Bedroom",
        unit: "Nos.",
        quantity: 2,
        unitPrice: 6500,
        description: "Pair of wall-mounted bedside tables with soft-close drawers and wire grommets.",
        subpoints: [
          "Hettich Quadro concealed soft-close undermount drawer slides",
          "Italian PU paint or matte laminate finish",
          "Integrated electrical cutout provisions for phone charging"
        ],
        notes: "Includes 2 units for left and right bedside"
      },
      {
        name: "Vanity Dresser with Backlit LED Mirror",
        category: "Bedroom",
        unit: "Nos.",
        quantity: 1,
        unitPrice: 22500,
        description: "Floating dressing table with concealed drawer organizer and custom touch-sensor LED mirror.",
        subpoints: [
          "High-definition distortion-free silver mirror with sandblasted LED border",
          "Touch-switch with dual-tone brightness dimmer control",
          "Storage drawer with compartmentalized cosmetic organizer"
        ],
        notes: ""
      },
      {
        name: "Master Bedroom False Ceiling with Perimeter Cove",
        category: "Bedroom",
        unit: "Sq. ft.",
        quantity: 150,
        unitPrice: 145,
        description: "Minimalist perimeter false ceiling with warm white concealed LED cove illumination.",
        subpoints: [
          "Saint-Gobain gypsum board with rust-proof GI channel framework",
          "Smooth POP punning and Asian Paints Royale luxury emulsion finish"
        ],
        notes: ""
      }
    ]
  },
  {
    id: "pkg-kids-bedroom",
    name: "Kids / Guest Bedroom Ensemble",
    category: "Bedroom",
    description: "Versatile bedroom suite: 2-door modular wardrobe, Queen size storage bed, integrated study desk with overhead library, and accent wall panel.",
    isBuiltIn: true,
    items: [
      {
        name: "2-Door Modular Wardrobe with Drawers",
        category: "Bedroom",
        unit: "Sq. ft.",
        quantity: 40,
        unitPrice: 1750,
        description: "Swing-door wardrobe with external bottom drawers, full-length mirror insert, and durable laminate finish.",
        subpoints: [
          "Hettich Sensys soft-close 110-degree clip-on concealed hinges",
          "BWP plywood carcass with anti-termite treatment",
          "Pastel two-tone laminate finish with child-safe rounded edge profile"
        ],
        notes: "Includes hanger rods and adjustable shelving"
      },
      {
        name: "Queen Size Storage Bed",
        category: "Bedroom",
        unit: "Nos.",
        quantity: 1,
        unitPrice: 34000,
        description: "Ergonomic Queen size bed (5ft x 6.5ft) with manual pull-out drawer storage boxes.",
        subpoints: [
          "Heavy-duty marine plywood frame with wooden slatted base",
          "Smooth castor-mounted under-bed storage drawers",
          "Cushioned fabric headboard panel"
        ],
        notes: ""
      },
      {
        name: "Integrated Study Desk & Overhead Library",
        category: "Bedroom",
        unit: "Running ft.",
        quantity: 6,
        unitPrice: 1650,
        description: "Wall-mounted study desk with pen drawer, wire grommets, and overhead display bookshelf.",
        subpoints: [
          "Heavy-duty cantilever bracket support with wire grommets",
          "Overhead open cubbies and closed shutter compartments",
          "Under-shelf warm LED task strip light provision"
        ],
        notes: "Length: 6ft, Depth: 2ft"
      },
      {
        name: "Bedroom Acoustic Fluted Accent Wall",
        category: "Bedroom",
        unit: "Sq. ft.",
        quantity: 35,
        unitPrice: 550,
        description: "Vertical fluted wall panelling creating a vibrant feature wall behind the bed.",
        subpoints: [
          "Eco-friendly charcoal composite fluted wall panels",
          "Seamless tongue-and-groove interlocking system"
        ],
        notes: ""
      }
    ]
  },
  {
    id: "pkg-modular-kitchen",
    name: "Gourmet Modular Kitchen & Breakfast Bar",
    category: "Kitchen",
    description: "Factory-calibrated BWP modular kitchen with tandem boxes, tall pantry pull-out, quartz countertop, and island breakfast bar.",
    isBuiltIn: true,
    items: [
      {
        name: "Under-Counter Base Modular Cabinets",
        category: "Kitchen",
        unit: "Running ft.",
        quantity: 16,
        unitPrice: 2450,
        description: "BWP HDHMR modular base cabinetry with German soft-close tandem boxes and stainless steel bottle pullouts.",
        subpoints: [
          "100% Boiling Water Proof (BWP) marine plywood carcass",
          "Hettich InnoTech Atira double-walled soft-close tandem drawer systems",
          "Thali, cutlery, plain wire baskets, and dual-tier spice bottle pull-out",
          "Scratch-resistant anti-fingerprint acrylic or ceramic PU finish"
        ],
        notes: "Includes PVC waterproof plinth feet and aluminum toe-kick"
      },
      {
        name: "Overhead Hydraulic Wall Cabinets",
        category: "Kitchen",
        unit: "Running ft.",
        quantity: 16,
        unitPrice: 1850,
        description: "Wall-mounted upper storage cabinets featuring Blum Aventos hydraulic bi-fold lift systems and profile glass.",
        subpoints: [
          "Blum Aventos HF bi-fold lift-up mechanism with silent soft-close",
          "Fluted tinted glass shutters in slim champagne gold aluminum profile",
          "Concealed under-cabinet LED strip light for countertop task lighting"
        ],
        notes: ""
      },
      {
        name: "Tall Pantry Pull-Out Larder Unit",
        category: "Kitchen",
        unit: "Nos.",
        quantity: 1,
        unitPrice: 38000,
        description: "Full-height modular larder unit with 6-tier heavy-duty chrome baskets and soft-closing dampers.",
        subpoints: [
          "German heavy-duty central runner mechanism with 100kg load capacity",
          "6 adjustable chrome wire baskets with non-slip transparent acrylic mats",
          "Synchronized door opening action"
        ],
        notes: "Dimensions: 600mm W x 2100mm H"
      },
      {
        name: "Premium Quartz Countertop & Sink Cutout",
        category: "Kitchen",
        unit: "Sq. ft.",
        quantity: 45,
        unitPrice: 850,
        description: "18mm seamless engineered quartz stone countertop with polished bullnose edge and undermount sink fabrication.",
        subpoints: [
          "High-grade stain and scratch resistant engineered quartz slab",
          "Factory CNC waterjet cutout for undermount sink and built-in hob",
          "Double-thickness full bullnose edge profiling"
        ],
        notes: "Sink and hob installation included"
      },
      {
        name: "Island Breakfast Counter with Storage",
        category: "Kitchen",
        unit: "Nos.",
        quantity: 1,
        unitPrice: 32000,
        description: "Freestanding island breakfast table with lower storage shelves and overhang for bar stool seating.",
        subpoints: [
          "Heavy-duty marine plywood frame with quartz waterfall edge top",
          "12-inch knee-recess overhang for comfortable bar stool seating",
          "Dual internal storage drawers with soft-close sliders"
        ],
        notes: "Dimensions: 5ft L x 2.5ft W x 3ft H"
      }
    ]
  },
  {
    id: "pkg-dining-room",
    name: "Executive 6-Seater Dining Space",
    category: "Dining Room",
    description: "Turnkey luxury dining room: Italian marble dining table, 6 velvet dining chairs, crockery buffet credenza, and tinted mirror wall.",
    isBuiltIn: true,
    items: [
      {
        name: "Italian Marble Top 6-Seater Dining Table",
        category: "Dining Room",
        unit: "Nos.",
        quantity: 1,
        unitPrice: 58000,
        description: "Custom dining table with 20mm natural Italian marble top, chamfered edge profiling, and titanium gold PVD coated base.",
        subpoints: [
          "Imported natural Italian marble top with anti-stain epoxy sealer coat",
          "Heavy-gauge SS 304 titanium gold PVD-coated geometric pedestal base",
          "Dimensions: 6ft L x 3.5ft W"
        ],
        notes: ""
      },
      {
        name: "Luxury Velvet Dining Chairs",
        category: "Dining Room",
        unit: "Nos.",
        quantity: 6,
        unitPrice: 7500,
        description: "Ergonomic dining chairs with curved backrest, high-density foam cushioning, and PVD gold metal legs.",
        subpoints: [
          "Solid beechwood inner shell with 32-density contoured foam",
          "Premium imported stain-repellent velvet fabric upholstery",
          "Gold PVD tapered stainless steel legs with nylon floor protectors"
        ],
        notes: "Set of 6 chairs"
      },
      {
        name: "Dining Buffet Sideboard Credenza Unit",
        category: "Dining Room",
        unit: "Running ft.",
        quantity: 6,
        unitPrice: 1950,
        description: "Floor-mounted crockery buffet console with fluted glass shutters, cutlery drawers, and quartz server top.",
        subpoints: [
          "Marine grade HDHMR carcass with 0.8mm balance laminate",
          "Aluminum profile glass shutters with warm interior spotlighting",
          "Soft-close cutlery and crockery storage compartments"
        ],
        notes: ""
      },
      {
        name: "Tinted Bronze Mirror Feature Wall",
        category: "Dining Room",
        unit: "Sq. ft.",
        quantity: 40,
        unitPrice: 650,
        description: "Architectural bronze tinted mirror paneling with diamond bevelled edge grids.",
        subpoints: [
          "5mm Saint-Gobain imported bronze tinted float glass mirror",
          "12mm diamond-cut bevelled edges with seamless V-groove joints",
          "12mm calibrated marine ply backing panel"
        ],
        notes: ""
      }
    ]
  },
  {
    id: "pkg-foyer-entrance",
    name: "Grand Foyer & Entrance Partition",
    category: "Living Room",
    description: "Luxurious entrance foyer: Full-height wood panelling, concealed shoe console with cushioned seating, CNC brass partition screen, and accent ceiling.",
    isBuiltIn: true,
    items: [
      {
        name: "Full-Height Foyer Wall Panelling",
        category: "Living Room",
        unit: "Sq. ft.",
        quantity: 50,
        unitPrice: 750,
        description: "Entrance accent panelling combining natural veneer, vertical louvers, and warm perimeter LED lighting.",
        subpoints: [
          "Calibrated ply backing with natural teak veneer and matte PU finish",
          "Integrated electrical provisions for digital door lock and bell chime",
          "Concealed LED strip light channel creating warm entrance glow"
        ],
        notes: ""
      },
      {
        name: "Concealed Shoe Cabinet with Cushioned Seat",
        category: "Living Room",
        unit: "Running ft.",
        quantity: 5,
        unitPrice: 1750,
        description: "Multi-tiered ventilated shoe console with integrated cushioned seating bench and pull-out sock drawer.",
        subpoints: [
          "Slanted shoe shelving holding up to 24 pairs of footwear",
          "Concealed louver ventilation slots to prevent odor accumulation",
          "High-density foam cushioned seat upholstered in leatherette"
        ],
        notes: ""
      },
      {
        name: "CNC Cut Brass Finish Decorative Screen",
        category: "Living Room",
        unit: "Sq. ft.",
        quantity: 25,
        unitPrice: 1200,
        description: "Architectural spatial divider screen separating foyer from living area with modern geometric lattice work.",
        subpoints: [
          "Heavy-duty metal frame with CNC laser cut motif paneling",
          "PVD champagne gold electroplated finish",
          "Floor-to-ceiling solid anchor mounting"
        ],
        notes: ""
      },
      {
        name: "Foyer Accent False Ceiling with Spotlights",
        category: "Living Room",
        unit: "Sq. ft.",
        quantity: 40,
        unitPrice: 160,
        description: "Compact dropped ceiling feature with warm COB accent downlights.",
        subpoints: [
          "Gypsum board ceiling with concealed cove profile",
          "Includes 2x anti-glare warm white spotlights"
        ],
        notes: ""
      }
    ]
  },
  {
    id: "pkg-2bhk-turnkey",
    name: "Turnkey 2BHK Complete Interior Package",
    category: "General Interior Works",
    description: "Complete turnkey woodwork & execution package for 2BHK apartments: Living room, Modular Kitchen, Master Bedroom, Guest Bedroom, Dining, and Full False Ceiling.",
    isBuiltIn: true,
    items: [
      {
        name: "Living Room TV Unit & Louver Panelling Package",
        category: "Living Room",
        unit: "Job",
        quantity: 1,
        unitPrice: 75000,
        description: "Floor mounted TV console (8ft) with wall panelling, soft-close drawers, wire management, and warm LED cove lighting.",
        subpoints: [
          "BWP marine plywood with high-gloss acrylic and textured laminate",
          "Hettich soft-close drawer channels",
          "Concealed cable routing provisions"
        ],
        notes: "Complete living room focal entertainment unit"
      },
      {
        name: "Gourmet Modular Kitchen with Tandem Drawers",
        category: "Kitchen",
        unit: "Job",
        quantity: 1,
        unitPrice: 165000,
        description: "Complete L-shaped or parallel BWP kitchen with base cabinets, upper wall cabinets, tandem boxes, and quartz countertop.",
        subpoints: [
          "100% BWP plywood carcass with anti-termite and moisture proof core",
          "5x Hettich soft-close tandem drawer boxes with cutlery & spice organizers",
          "Hydraulic lift-up overhead shutters with tinted profile glass",
          "18mm quartz countertop with sink and hob cutouts"
        ],
        notes: "Comprehensive modular kitchen setup"
      },
      {
        name: "Master Bedroom Wardrobe & Hydraulic Bed Package",
        category: "Bedroom",
        unit: "Job",
        quantity: 1,
        unitPrice: 145000,
        description: "Complete master bedroom suite: 7ft sliding wardrobe with loft, King bed with hydraulic storage, headboard, and twin floating nightstands.",
        subpoints: [
          "Heavy-duty soft-close sliding wardrobe mechanism",
          "King size hydraulic storage bed with German gas-lift pistons",
          "Cushioned acoustic headboard panel and floating side drawers"
        ],
        notes: "Includes wardrobe sensor lighting"
      },
      {
        name: "Guest Bedroom Wardrobe & Study Unit Package",
        category: "Bedroom",
        unit: "Job",
        quantity: 1,
        unitPrice: 85000,
        description: "2-door modular wardrobe with loft and integrated study workstation with overhead library shelving.",
        subpoints: [
          "BWP plywood with soft-close concealed hinges",
          "Study desk with wire management grommets and drawer unit"
        ],
        notes: ""
      },
      {
        name: "Dining Crockery Buffet & Feature Mirror",
        category: "Dining Room",
        unit: "Job",
        quantity: 1,
        unitPrice: 35000,
        description: "Floor mounted crockery sideboard with glass shutters and diamond bevelled bronze mirror wall feature.",
        subpoints: [
          "Crockery cabinet with internal spot illumination",
          "Bronze tinted bevelled mirror paneling"
        ],
        notes: ""
      },
      {
        name: "Full 2BHK Designer False Ceiling & Electrical Wiring",
        category: "General Interior Works",
        unit: "Sq. ft.",
        quantity: 650,
        unitPrice: 145,
        description: "Complete flat false ceiling in Saint-Gobain gypsum board with cove lighting and LED downlight wiring across all rooms.",
        subpoints: [
          "Living, dining, kitchen, and two bedrooms covered",
          "Concealed LED strip light cove profiles and downlight cutout points",
          "Finished with 2 coats of Asian Paints Royale luxury emulsion"
        ],
        notes: ""
      }
    ]
  },
  {
    id: "pkg-3bhk-turnkey",
    name: "Turnkey 3BHK Executive Interior Package",
    category: "General Interior Works",
    description: "Premium turnkey execution for 3BHK apartments/villas: Grand Foyer, Living Room, Modular Kitchen, 3 Bedrooms, Dining, Full False Ceiling, and Deep Cleaning.",
    isBuiltIn: true,
    items: [
      {
        name: "Grand Foyer Console & CNC Screen Package",
        category: "Living Room",
        unit: "Job",
        quantity: 1,
        unitPrice: 45000,
        description: "Entrance foyer panelling with shoe cabinet, cushioned seating bench, and laser-cut brass partition screen.",
        subpoints: [
          "Full-height wall paneling with shoe cabinet",
          "CNC laser cut metal partition screen with gold PVD finish"
        ],
        notes: ""
      },
      {
        name: "Luxury Living Room TV Wall & Console Ensemble",
        category: "Living Room",
        unit: "Job",
        quantity: 1,
        unitPrice: 95000,
        description: "Executive TV console (9ft) with acoustic fluted louver accent wall, marble sheet inlay, and champagne gold metal trim.",
        subpoints: [
          "Floor mounted floating TV unit with soft-close drawers",
          "Acoustic fluted wall panelling with titanium gold PVD inlays",
          "Concealed ambient backlight cove"
        ],
        notes: ""
      },
      {
        name: "Island Gourmet Modular Kitchen with Tall Pantry",
        category: "Kitchen",
        unit: "Job",
        quantity: 1,
        unitPrice: 225000,
        description: "Luxury BWP modular kitchen: base cabinets, hydraulic overheads, 6-tier tall pantry unit, quartz countertop, and island breakfast bar.",
        subpoints: [
          "100% BWP plywood carcass with anti-termite core",
          "Hettich InnoTech Atira tandem drawers with internal organizers",
          "Blum Aventos hydraulic bi-fold lift overhead cabinets",
          "Full height 6-tier pantry pullout larder unit",
          "Premium quartz countertop and breakfast counter with bar overhang"
        ],
        notes: ""
      },
      {
        name: "Master Bedroom Suite with Walk-in Wardrobe",
        category: "Bedroom",
        unit: "Job",
        quantity: 1,
        unitPrice: 195000,
        description: "Floor-to-ceiling sliding wardrobe, King hydraulic storage bed, tufted velvet headboard, twin nightstands, and vanity dresser with LED mirror.",
        subpoints: [
          "Sliding wardrobe with sensor LED lights and glass profile shutters",
          "King size bed with German hydraulic lift storage",
          "Full height acoustic headboard with gold metal inlays",
          "Dressing unit with smart touch-sensor LED mirror"
        ],
        notes: ""
      },
      {
        name: "Kids Bedroom Thematic Wardrobe & Study Suite",
        category: "Bedroom",
        unit: "Job",
        quantity: 1,
        unitPrice: 115000,
        description: "Thematic wardrobe with external soft-close drawers, Queen storage bed, and wall-mounted study desk with overhead library.",
        subpoints: [
          "Two-tone laminate modular wardrobe",
          "Queen size bed with smooth drawer storage",
          "Full study workstation with task lighting"
        ],
        notes: ""
      },
      {
        name: "Guest Bedroom Wardrobe & Queen Bed Suite",
        category: "Bedroom",
        unit: "Job",
        quantity: 1,
        unitPrice: 90000,
        description: "Modular swing-door wardrobe with integrated loft and Queen size bed with bedside tables.",
        subpoints: [
          "Wardrobe with soft-close hinges and full length mirror",
          "Queen bed with wooden headboard and matching nightstands"
        ],
        notes: ""
      },
      {
        name: "Dining Console, Bar Unit & Tinted Mirror",
        category: "Dining Room",
        unit: "Job",
        quantity: 1,
        unitPrice: 55000,
        description: "Crockery buffet sideboard, hanging stemware wine glass rack, and bronze tinted diamond bevelled mirror wall.",
        subpoints: [
          "Buffet console with glass shutters and quartz top",
          "Bronze tinted bevelled mirror panelling"
        ],
        notes: ""
      },
      {
        name: "Full 3BHK Gypsum False Ceiling & Cove Lighting",
        category: "General Interior Works",
        unit: "Sq. ft.",
        quantity: 950,
        unitPrice: 145,
        description: "Complete flat false ceiling in Saint-Gobain gypsum board across all 3 bedrooms, living, dining, kitchen, and foyer.",
        subpoints: [
          "Warm white concealed LED cove profiles and spot cutouts",
          "POP punning and Asian Paints Royale luxury emulsion finish"
        ],
        notes: ""
      },
      {
        name: "Professional Snagging & Deep Cleaning Handover",
        category: "General Interior Works",
        unit: "Job",
        quantity: 1,
        unitPrice: 15000,
        description: "Comprehensive multi-point quality snagging walkthrough, hardware calibration, and turnkey deep cleaning prior to key handover.",
        subpoints: [
          "Industrial vacuuming, dust extraction, and floor buffing",
          "Calibrated adjustment of all hinges, drawers, and sliders"
        ],
        notes: "Complimentary with 3BHK turnkey package"
      }
    ]
  },
  {
    id: "pkg-home-office",
    name: "Executive Home Office & Library Lounge",
    category: "Office and Commercial",
    description: "Work-from-home luxury study: Executive wooden desk with wire management, full-height aluminum profile glass bookshelf, and acoustic wall panel.",
    isBuiltIn: true,
    items: [
      {
        name: "Executive Wooden Workstation Desk",
        category: "Office and Commercial",
        unit: "Nos.",
        quantity: 1,
        unitPrice: 28000,
        description: "Ergonomic 5ft x 2.5ft executive desk with cable raceway, lockable 3-drawer pedestal, and modesty panel.",
        subpoints: [
          "Calibrated BWP ply with scratch-resistant matte laminate",
          "Concealed wire raceway with flip-top desktop power module cutout",
          "Central lockable 3-drawer pedestal with soft-closing runners"
        ],
        notes: ""
      },
      {
        name: "Full-Height Bookshelf with Glass Shutters",
        category: "Office and Commercial",
        unit: "Sq. ft.",
        quantity: 45,
        unitPrice: 1450,
        description: "Floor-to-ceiling book display credenza with tinted tempered glass shutters and warm LED vertical shelf lighting.",
        subpoints: [
          "Slim black/gold aluminum profile glass door shutters",
          "Adjustable heavy-duty shelf brackets holding up to 30kg per tier",
          "Integrated warm LED vertical profile illumination"
        ],
        notes: ""
      },
      {
        name: "Acoustic Charcoal Fluted Wall Panelling",
        category: "Office and Commercial",
        unit: "Sq. ft.",
        quantity: 50,
        unitPrice: 650,
        description: "Sound-dampening acoustic fluted accent wall treatment for crystal-clear video conferencing acoustics.",
        subpoints: [
          "Acoustic felt backing with charcoal composite fluted slats",
          "Reduces ambient reverberation and echo"
        ],
        notes: ""
      }
    ]
  },
  {
    id: "pkg-false-ceiling",
    name: "False Ceiling & Architectural Lighting Package",
    category: "General Interior Works",
    description: "Complete architectural false ceiling package with Saint-Gobain gypsum boards, warm white LED cove strips, and anti-glare COB downlights.",
    isBuiltIn: true,
    items: [
      {
        name: "Saint-Gobain Gypsum Board False Ceiling",
        category: "General Interior Works",
        unit: "Sq. ft.",
        quantity: 400,
        unitPrice: 135,
        description: "Seamless monolithic false ceiling using 12.5mm Saint-Gobain Gypboard panels and rust-proof galvanized iron (GI) framework.",
        subpoints: [
          "Gypsteel Ultra GI framework suspended with soffit cleats",
          "Joints reinforced with fiber tape and Gyproc jointing compound",
          "POP punning finish ready for paint"
        ],
        notes: ""
      },
      {
        name: "Concealed Warm White LED Strip Cove",
        category: "General Interior Works",
        unit: "Running ft.",
        quantity: 180,
        unitPrice: 120,
        description: "Perimeter architectural cove illumination featuring continuous high-density 24V LED strip lights.",
        subpoints: [
          "Warm white (3000K) 240 LEDs/meter dotless strip",
          "Heavy-duty aluminum heat-sink profile with frosted diffuser",
          "Includes Mean Well branded LED electronic drivers"
        ],
        notes: ""
      },
      {
        name: "Anti-Glare Deep Recessed COB Downlights",
        category: "General Interior Works",
        unit: "Nos.",
        quantity: 24,
        unitPrice: 650,
        description: "Architectural deep-set circular spotlights with dark reflector providing glare-free illumination.",
        subpoints: [
          "Bridgelux USA LED chip with high color rendering (CRI > 92)",
          "Deep recessed baffle minimizing direct visual glare (UGR < 19)",
          "Die-cast aluminum heat sink for extended lifespan"
        ],
        notes: "Includes installation and ceiling cutouts"
      },
      {
        name: "Ceiling Paint in Asian Paints Royale Luxury Emulsion",
        category: "General Interior Works",
        unit: "Sq. ft.",
        quantity: 400,
        unitPrice: 35,
        description: "Two coats of Asian Paints Royale luxury emulsion paint with primer coat on ceiling surface.",
        subpoints: [
          "One coat of water-based interior acrylic primer",
          "Two coats of Asian Paints Royale matte/silk white finish"
        ],
        notes: ""
      }
    ]
  }
];
