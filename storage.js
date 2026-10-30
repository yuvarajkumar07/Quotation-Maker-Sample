/**
 * ELEVATE EDGE INTERIORS — Persistent Storage & Data Management Engine
 * Handles LocalStorage & IndexedDB, Quotation Numbering, Revisions, Settings, and Backups.
 */

const STORAGE_KEYS = {
  SETTINGS: "eei_company_settings",
  QUOTATIONS: "eei_quotations_list",
  CLIENTS: "eei_clients_directory",
  CATALOGUE: "eei_custom_catalogue",
  PACKAGES: "eei_custom_packages",
  DRAFT: "eei_active_draft_state",
  APP_INITIALIZED: "eei_app_initialized_v1"
};

// Default Company Details & Settings
const DEFAULT_COMPANY_SETTINGS = {
  companyName: "ELEVATE EDGE INTERIORS",
  tagline: "LET'S DESIGN YOUR DREAM SPACE TOGETHER.",
  logoUrl: "assets/logo.png",
  logoBase64: "", // Cached base64 data url for offline / docx / pdf
  registeredAddress: "Jubilee Hills, Hyderabad – 500033, Telangana",
  contactPerson: "Design Director",
  primaryMobile: "+91 90309 19922",
  additionalMobile: "+91 89197 94276",
  businessEmail: "studioelevateedge@gmail.com",
  website: "elevateedgeinteriors.in",
  gstin: "36AAAAA0000A1Z5", // Editable placeholder
  panNumber: "ABCDE1234F",
  validityDays: 30,
  currencySymbol: "₹",
  currencyCode: "INR",
  authorizedRepresentative: "Managing Partner & Principal Designer",
  defaultCreator: "Interior Design Consultant",
  defaultApprover: "Chief Design Officer",
  defaultTaxEnabled: true,
  defaultTaxType: "GST_18", // GST_18, CGST_SGST_9_9, IGST_18, CUSTOM
  defaultTaxRate: 18,
  defaultPaymentSchedule: [
    { milestone: "Booking Advance & Design Signoff", percentage: 50, notes: "Upon 3D design approval and signing contract" },
    { milestone: "Factory Material Dispatch & Civil Readiness", percentage: 40, notes: "Upon carcass completion and site readiness" },
    { milestone: "Final Installation, Snagging & Handover", percentage: 10, notes: "Upon final cleaning, testing, and key handover" }
  ],
  footerNote: "This is a computer-generated document. No physical signature is required.",
  termsAndConditions: [
    { title: "Quotation Validity", text: "This quotation is valid for 30 calendar days from the date of issuance. Material rates and hardware costs are subject to change thereafter due to market fluctuations." },
    { title: "Scope of Work", text: "The scope covers only the items, quantities, and specifications explicitly listed in this document. Any additional carpentry, civil modifications, or electrical alterations requested during execution will be treated as extra work." },
    { title: "Material Specifications & Finishes", text: "All modular carcasses are built using certified BWP / HDHMR Grade plywood. Laminates, veneers, hardware, and fabrics will be sourced strictly as per approved 3D visual specifications." },
    { title: "Design Approvals & Signoffs", text: "Execution will commence only after the client approves the final 2D working drawings, material swatches, and 3D perspectives in writing or via registered email." },
    { title: "Payment Schedule & Milestones", text: "Payments must be made strictly according to milestones: 50% advance on confirmation, 40% upon material dispatch to site, and 10% upon final snagging and handover." },
    { title: "Advance Payment Requirements", text: "Site mobilization, factory production scheduling, and hardware procurement begin only upon realization of the 50% mobilization advance." },
    { title: "Commencement & Completion Timelines", text: "Estimated execution timeframe is 45 to 60 working days from the date of final design sign-off and receipt of advance payment. Timeframes are subject to site readiness and utility availability." },
    { title: "Variations & Additional Work", text: "Any change in dimensions, materials, or scope requested by the client after fabrication commences will be quoted separately and will require an updated revision quotation." },
    { title: "Client Responsibilities", text: "The client shall arrange uninterrupted water, electricity (single/three phase as required), elevator access, and society/building management permissions during working hours." },
    { title: "Site Readiness & Access", text: "The project site must be free of other civil contractors (unless coordinated) and weather-proof with external windows/doors installed prior to woodwork installation." },
    { title: "Material Availability & Delays", text: "Delays arising from force majeure, transporter strikes, imported material port clearance, or society work bans shall extend the handover timeline accordingly." },
    { title: "Installation & Snagging", text: "Our project engineer will conduct a comprehensive snagging walkthrough upon installation. Minor touchups and hinge calibrations will be resolved within 5 working days." },
    { title: "Warranty & After-Sales Support", text: "We provide a 10-year warranty on BWP plywood carcasses and 5-year manufacturer warranty on Hettich / Hafele / Blum hardware against manufacturing defects." },
    { title: "Exclusions", text: "Unless explicitly itemized, this quotation excludes loose decorative artifacts, electronic appliances, TV/audio cabling, deep civil structural beams, and municipal approvals." },
    { title: "Cancellation & Refund Terms", text: "In the event of cancellation before factory cutting, advance is refundable subject to a 10% design & mobilization fee. Customized cut-to-size items cannot be returned or refunded." },
    { title: "Applicable Taxes", text: "Goods and Services Tax (GST) is levied as per prevailing Government of India statutory rates. Any amendment in tax rates will be billed as applicable at the time of invoicing." },
    { title: "Dispute Resolution & Jurisdiction", text: "Any disputes arising under or in connection with this quotation shall be subject to the exclusive jurisdiction of the competent courts in Hyderabad, Telangana." }
  ],
  defaultSpecificationPillars: [
    {
      title: "CARCASS INTEGRITY",
      sub: "Certified BWP / HDHMR Grade",
      desc: "Marine-grade plywood carcasses calibrated with 0.8mm balance laminate."
    },
    {
      title: "GERMAN HARDWARE",
      sub: "Hettich / Hafele Soft-Close",
      desc: "100% German-engineered concealed hinges, tandem boxes, and soft-close sliders."
    },
    {
      title: "10-YEAR WARRANTY",
      sub: "Turnkey Quality Assurance",
      desc: "Comprehensive structural warranty with complimentary maintenance checkups."
    }
  ],
  defaultSignatoryBox: {
    title: "FOR ELEVATE EDGE INTERIORS",
    name: "Managing Partner & Principal Designer",
    subtitle: "Official Authorized Signatory | Hyderabad",
    signatureLine: "Signature & Seal: ________________________"
  },
  defaultIssuanceBox: {
    title: "OFFICIAL ISSUANCE & VERIFICATION",
    refText: "Issuance Reference: {Quotation Number}",
    scopeText: "Scope Verified: {Item Count} Custom Interior Work Items",
    validityText: "Turnkey Proposal Valid for 30 Days from Issuance"
  }
};

// Initial Sample Demonstration Quotation
const SAMPLE_QUOTATION = {
  id: "eei-demo-quote-001",
  quotationNumber: "EEI/QTN/2026/0001",
  isSample: true,
  status: "Draft", // Draft, Ready for Review, Approved Internally, Sent to Client, Accepted, Rejected, Revised, Expired, Archived
  revision: 1,
  revisionIdentifier: "Rev 1",
  createdAt: "2026-10-29T10:00:00.000Z",
  updatedAt: "2026-10-29T10:00:00.000Z",
  quotationDate: "2026-10-29",
  validityDate: "2026-11-28",
  documentHeading: "INTERIOR DESIGN & EXECUTION QUOTATION",
  title: "Turnkey Luxury Interior Design & Execution Proposal",
  tableHeading: "SCOPE OF WORK & PRICING SCHEDULE",
  termsHeading: "TERMS AND CONDITIONS",
  showPillars: true,
  specificationPillars: [
    {
      title: "CARCASS INTEGRITY",
      sub: "Certified BWP / HDHMR Grade",
      desc: "Marine-grade plywood carcasses calibrated with 0.8mm balance laminate."
    },
    {
      title: "GERMAN HARDWARE",
      sub: "Hettich / Hafele Soft-Close",
      desc: "100% German-engineered concealed hinges, tandem boxes, and soft-close sliders."
    },
    {
      title: "10-YEAR WARRANTY",
      sub: "Turnkey Quality Assurance",
      desc: "Comprehensive structural warranty with complimentary maintenance checkups."
    }
  ],
  showSignatoryBlock: true,
  signatoryBox: {
    title: "FOR ELEVATE EDGE INTERIORS",
    name: "Managing Partner & Principal Designer",
    subtitle: "Official Authorized Signatory | Hyderabad",
    signatureLine: "Signature & Seal: ________________________"
  },
  issuanceBox: {
    title: "OFFICIAL ISSUANCE & VERIFICATION",
    refText: "Issuance Reference: {Quotation Number}",
    scopeText: "Scope Verified: {Item Count} Custom Interior Work Items",
    validityText: "Turnkey Proposal Valid for 30 Days from Issuance"
  },
  validityDate: "2026-11-28",
  createdBy: "Ar. Vikram Mehta",
  approvedBy: "K. R. Rao (Design Director)",
  title: "Turnkey Luxury Interior Design & Execution Proposal",
  projectDescription: "Premium turnkey residential interior proposal for 3BHK Luxury Residence featuring bespoke modular woodwork, living room feature panelling, master wardrobe, and designer dining suite.",
  internalNotes: "Client requested champagne gold accents and warm lighting. Follow-up meeting scheduled for Saturday.",
  
  // Client Info
  client: {
    clientName: "Mr. Rajesh Varma",
    contactPerson: "Mr. Rajesh Varma",
    mobileNumber: "+91 98490 12345",
    alternateMobile: "+91 94401 56789",
    email: "rajesh.varma@example.com",
    billingAddress: "Villa 42, Palm Meadows, Financial District, Hyderabad – 500032",
    projectName: "Palm Meadows 4BHK Villa",
    projectSiteAddress: "Villa 42, Palm Meadows, Financial District, Gachibowli, Hyderabad – 500032",
    projectLocation: "Financial District, Hyderabad"
  },

  // Company Details Snapshot at time of creation
  companySnapshot: { ...DEFAULT_COMPANY_SETTINGS },

  // Items List — Including the 3 test verification items
  items: [
    {
      id: "item-sample-1",
      sno: 1,
      name: "Living Room TV Base Unit",
      category: "Living Room",
      description: "Custom floor-mounted TV console unit with soft-closing drawers, concealed cable management, and premium laminate finish.",
      subpoints: [
        "Base cabinet with storage drawers.",
        "Premium laminate finish.",
        "Soft-close drawer channels.",
        "Internal storage compartments.",
        "Handleless profile design.",
        "Installation and finishing included."
      ],
      unit: "Nos.",
      quantity: 1,
      unitPrice: 50000,
      amount: 50000,
      discountType: "percentage", // percentage or fixed
      discountValue: 0,
      discountAmount: 0,
      total: 50000,
      notes: "Champagne gold trim profile finish"
    },
    {
      id: "item-sample-2",
      sno: 2,
      name: "Master Bedroom Wardrobe",
      category: "Bedroom",
      description: "Floor-to-ceiling 3-door wardrobe with hydraulic loft storage, internal LED sensor hanger rods, and lockable jewelry chest.",
      subpoints: [
        "Heavy-duty marine-ply carcass with 0.8mm interior balancing laminate.",
        "Soft-closing hinges with 110-degree opening angle (Hettich / Hafele).",
        "Dedicated saree/trouser pullouts and lockable jewelry drawer with velvet liner.",
        "Integrated warm LED sensor hanging rods activated on door opening.",
        "Full-height champagne gold vertical pull handles."
      ],
      unit: "Nos.",
      quantity: 2,
      unitPrice: 40000,
      amount: 80000,
      discountType: "percentage",
      discountValue: 0,
      discountAmount: 0,
      total: 80000,
      notes: "Includes 2 wardrobe units for Master & Guest bedrooms"
    },
    {
      id: "item-sample-3",
      sno: 3,
      name: "Luxury Dining Table",
      category: "Dining Room",
      description: "Contemporary 6-seater dining table with Italian Onyx marble top and champagne gold PVD coated steel pedestal base.",
      subpoints: [
        "20mm natural Italian Statuario marble top with beveled edges.",
        "Stain-resistant nano-coating protection preventing oil and wine spots.",
        "Solid geometric pedestal base with brushed brass trims.",
        "Seats 6 adults comfortably with ample legroom."
      ],
      unit: "Nos.",
      quantity: 1,
      unitPrice: 30000,
      amount: 30000,
      discountType: "percentage",
      discountValue: 0,
      discountAmount: 0,
      total: 30000,
      notes: "Custom size: 6ft x 3.5ft"
    }
  ],

  // Financial Calculations & Discount Engine
  // Verification test check:
  // TV: 1x50,000 = 50,000
  // Wardrobe: 2x40,000 = 80,000
  // Dining: 1x30,000 = 30,000
  // Total Amount: 1,60,000
  // Overall Discount: 10% = 16,000
  // Grand Total: 1,44,000
  pricing: {
    totalBeforeDiscounts: 160000,
    totalItemDiscounts: 0,
    overallDiscountType: "percentage", // percentage or fixed
    overallDiscountValue: 10,
    overallDiscountAmount: 16000,
    subtotalAfterDiscounts: 144000,
    taxEnabled: false,
    taxType: "GST_18",
    taxRate: 18,
    taxAmount: 0,
    additionalCharges: [],
    totalAdditionalCharges: 0,
    grandTotal: 144000,
    grandTotalInWords: "Rupees One Lakh Forty-Four Thousand Only"
  },

  // Terms Snapshot
  terms: [...DEFAULT_COMPANY_SETTINGS.termsAndConditions],

  // Revisions History
  revisionHistory: [
    {
      revisionNumber: 1,
      revisionIdentifier: "Rev 1",
      timestamp: "2026-10-29T10:00:00.000Z",
      author: "Ar. Vikram Mehta",
      notes: "Initial quotation created with TV Base Unit, Wardrobe, and Dining Table.",
      grandTotal: 144000,
      itemsCount: 3,
      changes: "Created base quotation with 3 items and 10% overall discount."
    }
  ],

  // Client discussions log
  clientDiscussions: [
    {
      date: "2026-10-29",
      contactPerson: "Mr. Rajesh Varma",
      notes: "Discussed layout at site. Client liked the contemporary champagne gold theme."
    }
  ]
};

// Storage Engine Class
class StorageManager {
  constructor() {
    this.init();
  }

  init() {
    // Check if initial settings exist
    if (!localStorage.getItem(STORAGE_KEYS.SETTINGS)) {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(DEFAULT_COMPANY_SETTINGS));
    }

    // Check if initialized before
    if (!localStorage.getItem(STORAGE_KEYS.APP_INITIALIZED)) {
      // Pre-seed sample demonstration quotation
      const initialQuotes = [SAMPLE_QUOTATION];
      localStorage.setItem(STORAGE_KEYS.QUOTATIONS, JSON.stringify(initialQuotes));

      // Pre-seed sample client
      const initialClients = [
        {
          id: "client-001",
          name: "Mr. Rajesh Varma",
          contactPerson: "Mr. Rajesh Varma",
          mobile: "+91 98490 12345",
          alternateMobile: "+91 94401 56789",
          email: "rajesh.varma@example.com",
          billingAddress: "Villa 42, Palm Meadows, Financial District, Hyderabad – 500032",
          projectName: "Palm Meadows 4BHK Villa",
          projectLocation: "Financial District, Hyderabad"
        }
      ];
      localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(initialClients));

      // Pre-seed custom catalogue
      if (typeof DEFAULT_CATALOGUE !== "undefined") {
        localStorage.setItem(STORAGE_KEYS.CATALOGUE, JSON.stringify(DEFAULT_CATALOGUE));
      }

      // Pre-seed room packages
      if (typeof ROOM_PACKAGES !== "undefined") {
        localStorage.setItem(STORAGE_KEYS.PACKAGES, JSON.stringify(ROOM_PACKAGES));
      }

      localStorage.setItem(STORAGE_KEYS.APP_INITIALIZED, "true");
    }
  }

  // ================= COMPANY SETTINGS =================
  getSettings() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      const settings = data ? { ...DEFAULT_COMPANY_SETTINGS, ...JSON.parse(data) } : { ...DEFAULT_COMPANY_SETTINGS };
      if (!settings.logoBase64 && typeof EEI_DEFAULT_LOGO_BASE64 !== "undefined") {
        settings.logoBase64 = EEI_DEFAULT_LOGO_BASE64;
      }
      if ((!settings.logoUrl || settings.logoUrl === "assets/logo.png") && typeof EEI_DEFAULT_LOGO_BASE64 !== "undefined") {
        settings.logoUrl = EEI_DEFAULT_LOGO_BASE64;
      }
      return settings;
    } catch (e) {
      console.error("Error reading company settings:", e);
      return { ...DEFAULT_COMPANY_SETTINGS };
    }
  }

  saveSettings(settings) {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
      return true;
    } catch (e) {
      console.error("Error saving company settings:", e);
      return false;
    }
  }

  // ================= QUOTATIONS CRUD =================
  getAllQuotations() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.QUOTATIONS);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error("Error reading quotations:", e);
      return [];
    }
  }

  getQuotationById(id) {
    const list = this.getAllQuotations();
    return list.find(q => q.id === id) || null;
  }

  saveQuotation(quotation) {
    try {
      const list = this.getAllQuotations();
      const index = list.findIndex(q => q.id === quotation.id);

      quotation.updatedAt = new Date().toISOString();

      if (index >= 0) {
        list[index] = quotation;
      } else {
        quotation.createdAt = quotation.createdAt || new Date().toISOString();
        list.unshift(quotation);
      }

      localStorage.setItem(STORAGE_KEYS.QUOTATIONS, JSON.stringify(list));
      this.autoSaveClientFromQuotation(quotation);
      return true;
    } catch (e) {
      console.error("Error saving quotation:", e);
      return false;
    }
  }

  deleteQuotation(id) {
    try {
      const list = this.getAllQuotations().filter(q => q.id !== id);
      localStorage.setItem(STORAGE_KEYS.QUOTATIONS, JSON.stringify(list));
      return true;
    } catch (e) {
      console.error("Error deleting quotation:", e);
      return false;
    }
  }

  archiveQuotation(id) {
    const quote = this.getQuotationById(id);
    if (quote) {
      quote.status = "Archived";
      return this.saveQuotation(quote);
    }
    return false;
  }

  restoreQuotation(id) {
    const quote = this.getQuotationById(id);
    if (quote) {
      quote.status = "Draft";
      return this.saveQuotation(quote);
    }
    return false;
  }

  // ================= AUTOMATIC QUOTATION NUMBERING =================
  generateNextQuotationNumber() {
    const currentYear = new Date().getFullYear();
    const prefix = `EEI/QTN/${currentYear}/`;
    const list = this.getAllQuotations();

    let maxSequence = 0;
    list.forEach(q => {
      if (q.quotationNumber && q.quotationNumber.startsWith(prefix)) {
        const parts = q.quotationNumber.split("/");
        const numPart = parseInt(parts[3], 10);
        if (!isNaN(numPart) && numPart > maxSequence) {
          maxSequence = numPart;
        }
      }
    });

    const nextSeq = maxSequence + 1;
    const padded = String(nextSeq).padStart(4, "0");
    return `${prefix}${padded}`;
  }

  isQuotationNumberUnique(quoteNo, currentQuoteId = null) {
    const list = this.getAllQuotations();
    const found = list.find(q => q.quotationNumber.toLowerCase() === quoteNo.toLowerCase());
    if (!found) return true;
    return currentQuoteId && found.id === currentQuoteId;
  }

  // ================= CLIENTS DIRECTORY =================
  getAllClients() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CLIENTS);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  }

  saveClient(client) {
    try {
      const clients = this.getAllClients();
      const idx = clients.findIndex(c => c.name.toLowerCase() === client.name.toLowerCase());
      if (idx >= 0) {
        clients[idx] = { ...clients[idx], ...client };
      } else {
        client.id = "cli-" + Date.now();
        clients.push(client);
      }
      localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(clients));
      return true;
    } catch (e) {
      return false;
    }
  }

  autoSaveClientFromQuotation(quotation) {
    if (quotation.client && quotation.client.clientName && quotation.client.clientName.trim()) {
      this.saveClient({
        name: quotation.client.clientName.trim(),
        contactPerson: quotation.client.contactPerson || "",
        mobile: quotation.client.mobileNumber || "",
        alternateMobile: quotation.client.alternateMobile || "",
        email: quotation.client.email || "",
        billingAddress: quotation.client.billingAddress || "",
        projectName: quotation.client.projectName || "",
        projectLocation: quotation.client.projectLocation || ""
      });
    }
  }

  // ================= CATALOGUE =================
  getCatalogue() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CATALOGUE);
      return data ? JSON.parse(data) : (typeof DEFAULT_CATALOGUE !== "undefined" ? DEFAULT_CATALOGUE : []);
    } catch (e) {
      return typeof DEFAULT_CATALOGUE !== "undefined" ? DEFAULT_CATALOGUE : [];
    }
  }

  saveCatalogue(catalogue) {
    try {
      localStorage.setItem(STORAGE_KEYS.CATALOGUE, JSON.stringify(catalogue));
      return true;
    } catch (e) {
      return false;
    }
  }

  resetCatalogue() {
    if (typeof DEFAULT_CATALOGUE !== "undefined") {
      this.saveCatalogue(DEFAULT_CATALOGUE);
    }
  }

  addCatalogueItem(item) {
    const list = this.getCatalogue();
    if (!item.id) {
      item.id = "cat-custom-" + Date.now();
    }
    list.unshift(item);
    this.saveCatalogue(list);
    return item;
  }

  updateCatalogueItem(item) {
    const list = this.getCatalogue();
    const idx = list.findIndex(c => c.id === item.id);
    if (idx >= 0) {
      list[idx] = item;
      this.saveCatalogue(list);
      return true;
    }
    return false;
  }

  deleteCatalogueItem(id) {
    const list = this.getCatalogue().filter(c => c.id !== id);
    this.saveCatalogue(list);
    return true;
  }

  // ================= ROOM PACKAGES CRUD =================
  getPackages() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PACKAGES);
      if (data) {
        return JSON.parse(data);
      }
      return typeof ROOM_PACKAGES !== "undefined" ? JSON.parse(JSON.stringify(ROOM_PACKAGES)) : [];
    } catch (e) {
      return typeof ROOM_PACKAGES !== "undefined" ? JSON.parse(JSON.stringify(ROOM_PACKAGES)) : [];
    }
  }

  savePackages(packages) {
    try {
      localStorage.setItem(STORAGE_KEYS.PACKAGES, JSON.stringify(packages));
      return true;
    } catch (e) {
      return false;
    }
  }

  addPackage(pkg) {
    const pkgs = this.getPackages();
    if (!pkg.id) {
      pkg.id = "pkg-custom-" + Date.now();
    }
    pkgs.unshift(pkg);
    this.savePackages(pkgs);
    return pkg;
  }

  updatePackage(pkg) {
    const pkgs = this.getPackages();
    const idx = pkgs.findIndex(p => p.id === pkg.id);
    if (idx >= 0) {
      pkgs[idx] = pkg;
      this.savePackages(pkgs);
      return true;
    }
    return false;
  }

  deletePackage(pkgId) {
    const pkgs = this.getPackages().filter(p => p.id !== pkgId);
    this.savePackages(pkgs);
    return true;
  }

  resetPackages() {
    if (typeof ROOM_PACKAGES !== "undefined") {
      this.savePackages(JSON.parse(JSON.stringify(ROOM_PACKAGES)));
    }
  }

  // ================= BACKUP & RESTORE =================
  exportDatabaseJSON() {
    const backupData = {
      version: "1.0",
      company: "ELEVATE EDGE INTERIORS",
      exportedAt: new Date().toISOString(),
      settings: this.getSettings(),
      quotations: this.getAllQuotations(),
      clients: this.getAllClients(),
      catalogue: this.getCatalogue(),
      packages: this.getPackages()
    };
    return JSON.stringify(backupData, null, 2);
  }

  importDatabaseJSON(jsonString) {
    try {
      const data = JSON.parse(jsonString);
      if (!data.quotations || !Array.isArray(data.quotations)) {
        throw new Error("Invalid backup format: missing quotations collection.");
      }
      if (data.settings) localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(data.settings));
      if (data.quotations) localStorage.setItem(STORAGE_KEYS.QUOTATIONS, JSON.stringify(data.quotations));
      if (data.clients) localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(data.clients));
      if (data.catalogue) localStorage.setItem(STORAGE_KEYS.CATALOGUE, JSON.stringify(data.catalogue));
      if (data.packages) localStorage.setItem(STORAGE_KEYS.PACKAGES, JSON.stringify(data.packages));
      return { success: true, count: data.quotations.length };
    } catch (e) {
      console.error("Backup import failed:", e);
      return { success: false, error: e.message };
    }
  }

  // ================= EXPORT QUOTATION REGISTER CSV =================
  exportQuotationsCSV() {
    const list = this.getAllQuotations();
    const headers = [
      "Quotation No",
      "Revision",
      "Date",
      "Client Name",
      "Contact Number",
      "Email",
      "Project Name",
      "Location",
      "Status",
      "Items Count",
      "Total Before Discount (INR)",
      "Total Discount (INR)",
      "Subtotal (INR)",
      "Tax (INR)",
      "Additional Charges (INR)",
      "Grand Total (INR)"
    ];

    const rows = list.map(q => {
      const p = q.pricing || {};
      const c = q.client || {};
      return [
        `"${q.quotationNumber || ""}"`,
        `"Rev ${q.revision || 1}"`,
        `"${q.quotationDate || ""}"`,
        `"${(c.clientName || "").replace(/"/g, '""')}"`,
        `"${c.mobileNumber || ""}"`,
        `"${c.email || ""}"`,
        `"${(c.projectName || "").replace(/"/g, '""')}"`,
        `"${(c.projectLocation || "").replace(/"/g, '""')}"`,
        `"${q.status || "Draft"}"`,
        q.items ? q.items.length : 0,
        (p.totalBeforeDiscounts || 0).toFixed(2),
        ((p.totalItemDiscounts || 0) + (p.overallDiscountAmount || 0)).toFixed(2),
        (p.subtotalAfterDiscounts || 0).toFixed(2),
        (p.taxAmount || 0).toFixed(2),
        (p.totalAdditionalCharges || 0).toFixed(2),
        (p.grandTotal || 0).toFixed(2)
      ].join(",");
    });

    return [headers.join(","), ...rows].join("\r\n");
  }

  // ================= CLEAR SAMPLE DATA =================
  clearSampleData() {
    const list = this.getAllQuotations().filter(q => !q.isSample);
    localStorage.setItem(STORAGE_KEYS.QUOTATIONS, JSON.stringify(list));
  }
}

// Global instance
const storage = new StorageManager();
