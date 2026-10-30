/**
 * ELEVATE EDGE INTERIORS — Quotation Application Master Controller
 * Implements business calculations, subpoint management, revision workflows,
 * filtering, live preview, catalogue integrations, and validation.
 */

class QuotationApp {
  constructor() {
    this.currentView = "dashboard"; // 'dashboard' or 'editor'
    this.activeQuotation = null;
    this.isDirty = false;
    this.searchQuery = "";
    this.statusFilter = "All";
    this.dateFilter = "all";
    this.sortBy = "date_desc";

    this.init();
  }

  init() {
    this.bindEvents();
    this.renderDashboard();
    this.populateCompanyBranding();
  }

  // ================= COMPANY BRANDING SYNC =================
  populateCompanyBranding() {
    const settings = storage.getSettings();
    const brandTitles = document.querySelector(".brand-titles h1");
    if (brandTitles) {
      brandTitles.textContent = settings.companyName || "ELEVATE EDGE INTERIORS";
    }
    const brandTagline = document.querySelector(".brand-tagline");
    if (brandTagline) {
      brandTagline.textContent = settings.tagline || "LET'S DESIGN YOUR DREAM SPACE TOGETHER.";
    }
    const logoImg = document.getElementById("headerCompanyLogo");
    if (logoImg && settings.logoUrl) {
      logoImg.src = settings.logoUrl;
    }
  }

  // ================= EVENT LISTENERS =================
  bindEvents() {
    // Navigation & Dashboard buttons
    document.getElementById("btnCreateNewQuote")?.addEventListener("click", () => this.createNewQuotation());
    document.getElementById("btnOpenSettings")?.addEventListener("click", () => this.openSettingsModal());
    document.getElementById("btnOpenCatalogue")?.addEventListener("click", () => this.openCatalogueModal());
    document.getElementById("btnOpenBackup")?.addEventListener("click", () => this.openBackupModal());
    document.getElementById("btnExportRegisterCSV")?.addEventListener("click", () => this.exportRegisterCSV());

    // Dashboard Search & Filters
    document.getElementById("dashboardSearchInput")?.addEventListener("input", (e) => {
      this.searchQuery = e.target.value.toLowerCase();
      this.renderQuotationsList();
    });

    document.getElementById("statusTabContainer")?.addEventListener("click", (e) => {
      const btn = e.target.closest(".tab-btn");
      if (!btn) return;
      document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      this.statusFilter = btn.dataset.status || "All";
      this.renderQuotationsList();
    });

    document.getElementById("dateFilterSelect")?.addEventListener("change", (e) => {
      this.dateFilter = e.target.value;
      this.renderQuotationsList();
    });

    document.getElementById("sortBySelect")?.addEventListener("change", (e) => {
      this.sortBy = e.target.value;
      this.renderQuotationsList();
    });

    // Editor Header Actions
    document.getElementById("btnBackToDashboard")?.addEventListener("click", () => this.confirmLeaveEditor());
    document.getElementById("btnSaveDraft")?.addEventListener("click", () => this.saveActiveQuotation(false));

    // Editor Item Buttons
    document.getElementById("btnAddItemFromCatalogue")?.addEventListener("click", () => this.openCataloguePickerModal());
    document.getElementById("btnAddCustomItem")?.addEventListener("click", () => this.addBlankItem());
    document.getElementById("btnAddRoomPackage")?.addEventListener("click", () => this.openPackagePickerModal());

    // Editor Tax & Discount Controls
    document.getElementById("taxToggle")?.addEventListener("change", (e) => {
      if (this.activeQuotation) {
        this.activeQuotation.pricing.taxEnabled = e.target.checked;
        this.recalculateAll();
        this.markDirty();
      }
    });

    document.getElementById("taxTypeSelect")?.addEventListener("change", (e) => {
      if (this.activeQuotation) {
        this.activeQuotation.pricing.taxType = e.target.value;
        if (e.target.value === "GST_18" || e.target.value === "CGST_SGST_9_9" || e.target.value === "IGST_18") {
          this.activeQuotation.pricing.taxRate = 18;
          document.getElementById("taxRateInput").value = 18;
        }
        this.recalculateAll();
        this.markDirty();
      }
    });

    document.getElementById("taxRateInput")?.addEventListener("input", (e) => {
      if (this.activeQuotation) {
        this.activeQuotation.pricing.taxRate = parseFloat(e.target.value) || 0;
        this.recalculateAll();
        this.markDirty();
      }
    });

    document.getElementById("overallDiscountType")?.addEventListener("change", (e) => {
      if (this.activeQuotation) {
        this.activeQuotation.pricing.overallDiscountType = e.target.value;
        this.recalculateAll();
        this.markDirty();
      }
    });

    document.getElementById("overallDiscountValue")?.addEventListener("input", (e) => {
      if (this.activeQuotation) {
        this.activeQuotation.pricing.overallDiscountValue = parseFloat(e.target.value) || 0;
        this.recalculateAll();
        this.markDirty();
      }
    });

    document.getElementById("btnAddAdditionalCharge")?.addEventListener("click", () => this.addAdditionalChargeRow());

    // Client Directory Auto-Complete
    document.getElementById("clientNameInput")?.addEventListener("input", (e) => {
      this.handleClientNameInput(e.target.value);
    });

    // Close Modals on click outside or close button
    document.addEventListener("click", (e) => {
      const closeBtn = e.target.closest(".modal-close-btn");
      if (closeBtn) {
        const modal = closeBtn.closest(".modal-overlay");
        if (modal) modal.classList.remove("active");
      } else if (e.target.classList.contains("modal-overlay")) {
        e.target.classList.remove("active");
      }
    });

    // Logo Upload Reader in Settings
    document.getElementById("settingsLogoUpload")?.addEventListener("change", (e) => {
      this.handleLogoUpload(e);
    });
  }

  // ================= VIEW SWITCHING =================
  switchView(viewName) {
    this.currentView = viewName;
    document.querySelectorAll(".view-section").forEach(sec => sec.classList.remove("active"));
    if (viewName === "dashboard") {
      document.getElementById("viewDashboard")?.classList.add("active");
      this.renderDashboard();
    } else if (viewName === "editor") {
      document.getElementById("viewEditor")?.classList.add("active");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  confirmLeaveEditor() {
    if (this.isDirty) {
      if (!confirm("You have unsaved changes. Would you like to save before returning to Dashboard?")) {
        this.isDirty = false;
        this.switchView("dashboard");
        return;
      }
      this.saveActiveQuotation(true);
    }
    this.switchView("dashboard");
  }

  // ================= DASHBOARD RENDERING =================
  renderDashboard() {
    const list = storage.getAllQuotations();

    // Calculate Summary Stats
    const totalCount = list.length;
    let draftCount = 0;
    let sentCount = 0;
    let acceptedCount = 0;
    let rejectedCount = 0;
    let revisedCount = 0;
    let totalQuotedValue = 0;

    list.forEach(q => {
      const status = (q.status || "Draft").toLowerCase();
      if (status.includes("draft")) draftCount++;
      else if (status.includes("sent")) sentCount++;
      else if (status.includes("accept")) acceptedCount++;
      else if (status.includes("reject")) rejectedCount++;
      else if (status.includes("revise")) revisedCount++;

      if (q.pricing && q.pricing.grandTotal) {
        totalQuotedValue += Number(q.pricing.grandTotal) || 0;
      }
    });

    // Update Stat Cards
    document.getElementById("statTotalQuotes").textContent = totalCount;
    document.getElementById("statDraftQuotes").textContent = draftCount;
    document.getElementById("statSentQuotes").textContent = sentCount;
    document.getElementById("statAcceptedQuotes").textContent = acceptedCount;
    document.getElementById("statRejectedQuotes").textContent = rejectedCount;
    document.getElementById("statRevisedQuotes").textContent = revisedCount;
    document.getElementById("statTotalValue").textContent = `₹ ${this.formatIndianCurrency(totalQuotedValue)}`;

    this.renderQuotationsList();
  }

  renderQuotationsList() {
    const tableBody = document.getElementById("quotationsTableBody");
    const emptyState = document.getElementById("quotationsEmptyState");
    if (!tableBody) return;

    let list = storage.getAllQuotations();

    // Status Filter
    if (this.statusFilter !== "All") {
      list = list.filter(q => (q.status || "Draft").toLowerCase() === this.statusFilter.toLowerCase());
    }

    // Search Query Filter
    if (this.searchQuery) {
      const q = this.searchQuery;
      list = list.filter(item => {
        const quoteNo = (item.quotationNumber || "").toLowerCase();
        const clientName = (item.client?.clientName || "").toLowerCase();
        const clientPhone = (item.client?.mobileNumber || "").toLowerCase();
        const clientEmail = (item.client?.email || "").toLowerCase();
        const projectName = (item.client?.projectName || "").toLowerCase();
        const projectLoc = (item.client?.projectLocation || "").toLowerCase();
        return quoteNo.includes(q) || clientName.includes(q) || clientPhone.includes(q) ||
               clientEmail.includes(q) || projectName.includes(q) || projectLoc.includes(q);
      });
    }

    // Date Filter
    if (this.dateFilter !== "all") {
      const now = new Date();
      list = list.filter(item => {
        const d = new Date(item.quotationDate || item.createdAt);
        if (this.dateFilter === "today") {
          return d.toDateString() === now.toDateString();
        } else if (this.dateFilter === "week") {
          const diffDays = (now - d) / (1000 * 60 * 60 * 24);
          return diffDays <= 7;
        } else if (this.dateFilter === "month") {
          return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
        } else if (this.dateFilter === "year") {
          return d.getFullYear() === now.getFullYear();
        }
        return true;
      });
    }

    // Sorting
    list.sort((a, b) => {
      if (this.sortBy === "date_desc") {
        return new Date(b.quotationDate || b.createdAt) - new Date(a.quotationDate || a.createdAt);
      } else if (this.sortBy === "date_asc") {
        return new Date(a.quotationDate || a.createdAt) - new Date(b.quotationDate || b.createdAt);
      } else if (this.sortBy === "amount_desc") {
        return (b.pricing?.grandTotal || 0) - (a.pricing?.grandTotal || 0);
      } else if (this.sortBy === "amount_asc") {
        return (a.pricing?.grandTotal || 0) - (b.pricing?.grandTotal || 0);
      } else if (this.sortBy === "client_asc") {
        return (a.client?.clientName || "").localeCompare(b.client?.clientName || "");
      }
      return 0;
    });

    if (list.length === 0) {
      tableBody.innerHTML = "";
      if (emptyState) emptyState.style.display = "block";
      return;
    }

    if (emptyState) emptyState.style.display = "none";

    tableBody.innerHTML = list.map(item => {
      const statusClass = `status-${(item.status || "draft").toLowerCase().replace(/\s+/g, '-')}`;
      const revBadge = item.revisionIdentifier || `Rev ${item.revision || 1}`;
      const grandTotalStr = `₹ ${this.formatIndianCurrency(item.pricing?.grandTotal || 0)}`;
      const sampleTag = item.isSample ? `<span class="revision-badge-pill" style="background:#FFF8E7; color:#B7791F; margin-left:4px;">Sample</span>` : "";

      return `
        <tr>
          <td>
            <div style="font-weight:700; color:var(--color-primary);">${item.quotationNumber} ${sampleTag}</div>
            <div style="font-size:0.75rem; color:var(--color-text-muted);">${item.quotationDate || "—"}</div>
          </td>
          <td>
            <div style="font-weight:600;">${item.client?.clientName || "Unnamed Client"}</div>
            <div style="font-size:0.75rem; color:var(--color-text-muted);">${item.client?.mobileNumber || "No phone"}</div>
          </td>
          <td>
            <div style="font-weight:500;">${item.client?.projectName || "—"}</div>
            <div style="font-size:0.75rem; color:var(--color-text-muted);">${item.client?.projectLocation || ""}</div>
          </td>
          <td>
            <span class="revision-badge-pill">${revBadge}</span>
          </td>
          <td>
            <span class="status-badge ${statusClass}">${item.status || "Draft"}</span>
          </td>
          <td style="text-align:right; font-weight:700; color:var(--color-primary);">
            ${grandTotalStr}
          </td>
          <td>
            <div class="action-buttons" style="justify-content:flex-end;">
              <button class="btn btn-sm btn-outline" title="Edit Quotation" onclick="app.editQuotation('${item.id}')">
                <i class="fas fa-edit"></i> Edit
              </button>
              <button class="btn btn-sm btn-gold" title="Live Preview" onclick="app.previewQuotationById('${item.id}')">
                <i class="fas fa-eye"></i>
              </button>
              <button class="btn btn-sm btn-outline" title="Export PDF" onclick="app.quickPdf('${item.id}')">
                <i class="fas fa-file-pdf"></i>
              </button>
              <button class="btn btn-sm btn-outline" title="Export DOCX" onclick="app.quickDocx('${item.id}')">
                <i class="fas fa-file-word"></i>
              </button>
              <button class="btn btn-sm btn-danger-outline" title="Delete Quotation" onclick="app.deleteQuotation('${item.id}')">
                <i class="fas fa-trash-alt"></i>
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join("");
  }

  // ================= QUOTATION CRUD =================
  createNewQuotation() {
    const settings = storage.getSettings();
    const nextQuoteNo = storage.generateNextQuotationNumber();
    const today = new Date().toISOString().split("T")[0];
    
    // Default valid 30 days
    const validityDate = new Date();
    validityDate.setDate(validityDate.getDate() + (settings.validityDays || 30));
    const validDateStr = validityDate.toISOString().split("T")[0];

    this.activeQuotation = {
      id: "eei-quote-" + Date.now(),
      quotationNumber: nextQuoteNo,
      status: "Draft",
      revision: 1,
      revisionIdentifier: "Rev 1",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      quotationDate: today,
      validityDate: validDateStr,
      createdBy: settings.defaultCreator || "Interior Design Consultant",
      approvedBy: settings.defaultApprover || "Design Director",
      title: "Comprehensive Interior Design & Execution Quotation",
      projectDescription: "Turnkey luxury interior design proposal including customized modular woodwork, designer ceilings, architectural lighting, and premium surface finishes.",
      internalNotes: "",
      client: {
        clientName: "",
        contactPerson: "",
        mobileNumber: "",
        alternateMobile: "",
        email: "",
        billingAddress: "",
        projectName: "",
        projectSiteAddress: "",
        projectLocation: ""
      },
      companySnapshot: { ...settings },
      items: [],
      pricing: {
        totalBeforeDiscounts: 0,
        totalItemDiscounts: 0,
        overallDiscountType: "percentage",
        overallDiscountValue: 0,
        overallDiscountAmount: 0,
        subtotalAfterDiscounts: 0,
        taxEnabled: settings.defaultTaxEnabled !== false,
        taxType: settings.defaultTaxType || "GST_18",
        taxRate: settings.defaultTaxRate || 18,
        taxAmount: 0,
        additionalCharges: [],
        totalAdditionalCharges: 0,
        grandTotal: 0,
        grandTotalInWords: "Rupees Zero Only"
      },
      terms: [...settings.termsAndConditions],
      revisionHistory: [
        {
          revisionNumber: 1,
          revisionIdentifier: "Rev 1",
          timestamp: new Date().toISOString(),
          author: settings.defaultCreator || "Design Consultant",
          notes: "Initial draft created.",
          grandTotal: 0,
          itemsCount: 0,
          changes: "Quotation initialized."
        }
      ],
      clientDiscussions: []
    };

    this.populateEditorForm();
    this.switchView("editor");
    this.markClean();
    this.showToast("New quotation initialized: " + nextQuoteNo, "success");
  }

  editQuotation(id) {
    const quote = storage.getQuotationById(id);
    if (!quote) {
      this.showToast("Quotation not found.", "error");
      return;
    }
    this.activeQuotation = JSON.parse(JSON.stringify(quote)); // Deep copy
    this.populateEditorForm();
    this.switchView("editor");
    this.markClean();
  }

  saveActiveQuotation(silent = false) {
    if (!this.activeQuotation) return;

    this.syncEditorFormToQuotation();

    // Validation
    if (!this.activeQuotation.quotationNumber || !this.activeQuotation.quotationNumber.trim()) {
      this.showToast("Quotation number cannot be blank.", "error");
      return;
    }

    if (!storage.isQuotationNumberUnique(this.activeQuotation.quotationNumber, this.activeQuotation.id)) {
      this.showToast("Quotation number already exists! Please use a unique number.", "error");
      return;
    }

    this.recalculateAll();
    const success = storage.saveQuotation(this.activeQuotation);
    if (success) {
      this.markClean();
      if (!silent) this.showToast("Quotation saved successfully!", "success");
    } else {
      this.showToast("Failed to save quotation. Storage error.", "error");
    }
  }

  deleteQuotation(id) {
    const quote = storage.getQuotationById(id);
    if (!quote) return;
    if (confirm(`Are you sure you want to permanently delete quotation ${quote.quotationNumber} for ${quote.client?.clientName || "Client"}?`)) {
      storage.deleteQuotation(id);
      this.renderDashboard();
      this.showToast("Quotation deleted.", "warning");
    }
  }

  // ================= REVISION MANAGEMENT (SECTION 14 & 15) =================
  openRevisionModal() {
    if (!this.activeQuotation) return;
    this.syncEditorFormToQuotation();
    this.recalculateAll();

    const nextRevNum = (this.activeQuotation.revision || 1) + 1;
    document.getElementById("revisionNumberField").textContent = `Rev ${nextRevNum}`;
    document.getElementById("revisionCurrentTotal").textContent = `₹ ${this.formatIndianCurrency(this.activeQuotation.pricing.grandTotal || 0)}`;
    document.getElementById("revisionNotesInput").value = "";
    document.getElementById("revisionModal").classList.add("active");
  }

  confirmCreateRevision() {
    const notesInput = document.getElementById("revisionNotesInput");
    const notes = notesInput ? notesInput.value.trim() : "";
    if (!notes) {
      this.showToast("Please enter a brief note explaining the changes in this revision.", "warning");
      return;
    }

    const prevRevisionNum = this.activeQuotation.revision || 1;
    const prevIdentifier = this.activeQuotation.revisionIdentifier || `Rev ${prevRevisionNum}`;
    const nextRevisionNum = prevRevisionNum + 1;
    const nextIdentifier = `Rev ${nextRevisionNum}`;

    // Store snapshot of current state before revision increment
    const previousSnapshot = JSON.parse(JSON.stringify(this.activeQuotation));

    // Record revision entry
    const revEntry = {
      revisionNumber: nextRevisionNum,
      revisionIdentifier: nextIdentifier,
      timestamp: new Date().toISOString(),
      author: this.activeQuotation.createdBy || "Authorized Designer",
      notes: notes,
      previousTotal: previousSnapshot.pricing?.grandTotal || 0,
      grandTotal: this.activeQuotation.pricing?.grandTotal || 0,
      itemsCount: this.activeQuotation.items ? this.activeQuotation.items.length : 0,
      changes: notes,
      itemsSnapshot: JSON.parse(JSON.stringify(this.activeQuotation.items))
    };

    this.activeQuotation.revision = nextRevisionNum;
    this.activeQuotation.revisionIdentifier = nextIdentifier;
    this.activeQuotation.status = "Revised";
    if (!this.activeQuotation.revisionHistory) this.activeQuotation.revisionHistory = [];
    this.activeQuotation.revisionHistory.push(revEntry);

    storage.saveQuotation(this.activeQuotation);
    document.getElementById("revisionModal")?.classList.remove("active");
    this.populateEditorForm();
    this.markClean();
    this.showToast(`Revision ${nextIdentifier} successfully created and saved!`, "success");
  }

  // Open Revision History & Comparison Modal (Section 14 & 15)
  openRevisionHistoryModal() {
    if (!this.activeQuotation) return;
    const history = this.activeQuotation.revisionHistory || [];
    const container = document.getElementById("revisionHistoryTimeline");
    if (!container) return;

    if (history.length === 0) {
      container.innerHTML = `<div style="text-align:center; padding:2rem; color:var(--color-text-muted);">No revisions recorded yet. This is the base revision (Rev 1).</div>`;
    } else {
      container.innerHTML = history.slice().reverse().map((rev) => {
        const isLatest = rev.revisionNumber === this.activeQuotation.revision;
        const formattedDate = new Date(rev.timestamp).toLocaleString("en-IN", {
          day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit"
        });
        return `
          <div style="background:#FFF; border:1px solid ${isLatest ? 'var(--color-gold)' : 'var(--color-border)'}; border-left:4px solid ${isLatest ? 'var(--color-gold)' : 'var(--color-primary)'}; border-radius:var(--radius-md); padding:1rem; margin-bottom:1rem; box-shadow:var(--shadow-sm);">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.5rem; flex-wrap:wrap; gap:0.5rem;">
              <div style="display:flex; align-items:center; gap:0.5rem;">
                <span class="revision-badge-pill" style="font-size:0.85rem; font-weight:700;">${rev.revisionIdentifier || `Rev ${rev.revisionNumber}`}</span>
                ${isLatest ? '<span class="status-badge status-accepted" style="font-size:0.7rem;">Current Active</span>' : ''}
                <span style="font-size:0.8rem; color:var(--color-text-muted);"><i class="far fa-clock"></i> ${formattedDate}</span>
              </div>
              <div style="font-weight:700; color:var(--color-primary); font-size:1rem;">
                ₹ ${this.formatIndianCurrency(rev.grandTotal || 0)}
              </div>
            </div>
            <div style="font-size:0.82rem; color:var(--color-text-main); margin-bottom:0.4rem;">
              <strong>Created By:</strong> ${this.escapeHtml(rev.author || "Design Consultant")}
            </div>
            <div style="background:#F9FAF9; border-radius:4px; padding:0.6rem 0.8rem; font-size:0.82rem; color:#333; margin-bottom:0.75rem; border-left:2px solid var(--color-gold);">
              <strong>Revision Notes:</strong> ${this.escapeHtml(rev.notes || rev.changes || "No notes recorded.")}
            </div>
            <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.5rem;">
              <div style="font-size:0.78rem; color:var(--color-text-muted);">
                ${rev.previousTotal ? `Previous Total: ₹ ${this.formatIndianCurrency(rev.previousTotal)} → New Total: ₹ ${this.formatIndianCurrency(rev.grandTotal)}` : `Items Count: ${rev.itemsCount || 0}`}
              </div>
              <div style="display:flex; gap:0.4rem;">
                <button class="btn btn-sm btn-outline" onclick="app.showRevisionDiffModal(${rev.revisionNumber})">
                  <i class="fas fa-columns"></i> View Diff & Comparison
                </button>
              </div>
            </div>
          </div>
        `;
      }).join("");
    }

    document.getElementById("revisionHistoryModal").classList.add("active");
  }

  showRevisionDiffModal(revNum) {
    if (!this.activeQuotation) return;
    const history = this.activeQuotation.revisionHistory || [];
    const rev = history.find(r => r.revisionNumber === revNum);
    if (!rev) return;

    const diffContainer = document.getElementById("revisionDiffContent");
    if (!diffContainer) return;

    const prevSnapshotItems = rev.itemsSnapshot || [];
    const currentItems = this.activeQuotation.items || [];

    // Find added, removed, and modified items
    const addedItems = currentItems.filter(ci => !prevSnapshotItems.some(pi => pi.id === ci.id || pi.name === ci.name));
    const removedItems = prevSnapshotItems.filter(pi => !currentItems.some(ci => ci.id === pi.id || ci.name === pi.name));
    const modifiedItems = [];

    currentItems.forEach(ci => {
      const pi = prevSnapshotItems.find(p => p.id === ci.id || p.name === ci.name);
      if (pi) {
        if (pi.quantity !== ci.quantity || pi.unitPrice !== ci.unitPrice || pi.total !== ci.total) {
          modifiedItems.push({ current: ci, previous: pi });
        }
      }
    });

    diffContainer.innerHTML = `
      <div style="background:#F9FAF9; border:1px solid var(--color-border); border-radius:var(--radius-md); padding:1rem; margin-bottom:1.25rem;">
        <h4 style="color:var(--color-primary); font-size:1rem; margin-bottom:0.25rem;">
          Comparing Revision ${rev.revisionIdentifier || `Rev ${rev.revisionNumber}`} vs Active Quotation
        </h4>
        <div style="font-size:0.85rem; color:var(--color-text-muted);">
          Revision Date: ${new Date(rev.timestamp).toLocaleString("en-IN")} | Recorded Total: ₹ ${this.formatIndianCurrency(rev.grandTotal || 0)}
        </div>
      </div>

      <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap:1rem; margin-bottom:1.5rem;">
        <div style="background:#F0FFF4; border:1px solid #C6F6D5; border-radius:var(--radius-md); padding:1rem;">
          <h5 style="color:#22543D; font-size:0.9rem; margin-bottom:0.5rem;"><i class="fas fa-plus-circle"></i> Added Items (${addedItems.length})</h5>
          ${addedItems.length === 0 ? '<div style="font-size:0.8rem; color:#666;">No items added</div>' : 
            addedItems.map(it => `
              <div style="font-size:0.82rem; margin-bottom:0.4rem; padding-bottom:0.4rem; border-bottom:1px dashed #C6F6D5;">
                <strong>${this.escapeHtml(it.name)}</strong> (${it.quantity} ${it.unit || "Nos."}) — ₹ ${this.formatIndianCurrency(it.total)}
              </div>
            `).join("")}
        </div>

        <div style="background:#FFF5F5; border:1px solid #FED7D7; border-radius:var(--radius-md); padding:1rem;">
          <h5 style="color:#C53030; font-size:0.9rem; margin-bottom:0.5rem;"><i class="fas fa-minus-circle"></i> Removed Items (${removedItems.length})</h5>
          ${removedItems.length === 0 ? '<div style="font-size:0.8rem; color:#666;">No items removed</div>' : 
            removedItems.map(it => `
              <div style="font-size:0.82rem; margin-bottom:0.4rem; padding-bottom:0.4rem; border-bottom:1px dashed #FED7D7;">
                <strong>${this.escapeHtml(it.name)}</strong> (${it.quantity} ${it.unit || "Nos."}) — ₹ ${this.formatIndianCurrency(it.total)}
              </div>
            `).join("")}
        </div>

        <div style="background:#FEFCBF; border:1px solid #F6E05E; border-radius:var(--radius-md); padding:1rem;">
          <h5 style="color:#744210; font-size:0.9rem; margin-bottom:0.5rem;"><i class="fas fa-pencil-alt"></i> Modified Items (${modifiedItems.length})</h5>
          ${modifiedItems.length === 0 ? '<div style="font-size:0.8rem; color:#666;">No items modified</div>' : 
            modifiedItems.map(m => `
              <div style="font-size:0.82rem; margin-bottom:0.4rem; padding-bottom:0.4rem; border-bottom:1px dashed #F6E05E;">
                <strong>${this.escapeHtml(m.current.name)}</strong>: Qty ${m.previous.quantity} → ${m.current.quantity} | Total ₹ ${this.formatIndianCurrency(m.previous.total)} → ₹ ${this.formatIndianCurrency(m.current.total)}
              </div>
            `).join("")}
        </div>
      </div>
    `;

    document.getElementById("revisionDiffModal").classList.add("active");
  }

  // ================= POPULATE & SYNC FORM =================
  populateEditorForm() {
    const q = this.activeQuotation;
    if (!q) return;

    // Header Meta
    document.getElementById("editorQuoteNumber").textContent = q.quotationNumber;
    document.getElementById("editorRevisionBadge").textContent = q.revisionIdentifier || `Rev ${q.revision || 1}`;
    
    // Status Select
    const statusSelect = document.getElementById("editorStatusSelect");
    if (statusSelect) statusSelect.value = q.status || "Draft";

    // Client and Project Info
    document.getElementById("quoteNumberInput").value = q.quotationNumber || "";
    document.getElementById("quoteDateInput").value = q.quotationDate || "";
    document.getElementById("validityDateInput").value = q.validityDate || "";
    document.getElementById("quoteTitleInput").value = q.title || "";
    document.getElementById("quoteCreatedByInput").value = q.createdBy || "";
    document.getElementById("quoteApprovedByInput").value = q.approvedBy || "";

    const c = q.client || {};
    document.getElementById("clientNameInput").value = c.clientName || "";
    document.getElementById("clientContactPersonInput").value = c.contactPerson || "";
    document.getElementById("clientMobileInput").value = c.mobileNumber || "";
    document.getElementById("clientAltMobileInput").value = c.alternateMobile || "";
    document.getElementById("clientEmailInput").value = c.email || "";
    document.getElementById("clientBillingAddressInput").value = c.billingAddress || "";
    document.getElementById("projectNameInput").value = c.projectName || "";
    document.getElementById("projectSiteAddressInput").value = c.projectSiteAddress || "";
    document.getElementById("projectLocationInput").value = c.projectLocation || "";

    document.getElementById("projectOverviewInput").value = q.projectDescription || "";
    document.getElementById("internalNotesInput").value = q.internalNotes || "";

    // Pricing & Tax Controls
    const p = q.pricing || {};
    document.getElementById("taxToggle").checked = !!p.taxEnabled;
    document.getElementById("taxTypeSelect").value = p.taxType || "GST_18";
    document.getElementById("taxRateInput").value = p.taxRate || 18;
    document.getElementById("overallDiscountType").value = p.overallDiscountType || "percentage";
    document.getElementById("overallDiscountValue").value = p.overallDiscountValue || 0;

    // PDF Customization Inputs
    const compNameInput = document.getElementById("pdfCompanyNameInput");
    if (compNameInput) compNameInput.value = q.companyName || (q.companySnapshot?.companyName || "ELEVATE EDGE INTERIORS");

    const docHeadInput = document.getElementById("pdfDocumentHeadingInput");
    if (docHeadInput) docHeadInput.value = q.documentHeading || "INTERIOR DESIGN & EXECUTION QUOTATION";

    const propSubInput = document.getElementById("pdfProposalSubheadingInput");
    if (propSubInput) propSubInput.value = q.title || "Turnkey Luxury Interior Design & Execution Proposal";

    const tableHeadInput = document.getElementById("pdfTableHeadingInput");
    if (tableHeadInput) tableHeadInput.value = q.tableHeading || "SCOPE OF WORK & PRICING SCHEDULE";

    const termsHeadInput = document.getElementById("pdfTermsHeadingInput");
    if (termsHeadInput) termsHeadInput.value = q.termsHeading || "TERMS AND CONDITIONS";

    const repInput = document.getElementById("pdfAuthorizedRepInput");
    if (repInput) repInput.value = q.authorizedRepresentative || (q.companySnapshot?.authorizedRepresentative || "Managing Partner & Principal Designer");

    const footerInput = document.getElementById("pdfFooterNoteInput");
    if (footerInput) footerInput.value = q.footerNote || (q.companySnapshot?.footerNote || "This is a computer-generated document. No physical signature is required.");

    // Toggles for Page 1 Pillars & Bottom Blocks
    const pillarsToggle = document.getElementById("pdfShowPillarsToggle");
    if (pillarsToggle) pillarsToggle.checked = q.showPillars !== false;

    const signBlockToggle = document.getElementById("pdfShowSignatoryBlockToggle");
    if (signBlockToggle) signBlockToggle.checked = q.showSignatoryBlock !== false;

    // Left Signatory Box Inputs
    const signBox = q.signatoryBox || {};
    const signBoxTitle = document.getElementById("pdfSignBoxTitleInput");
    if (signBoxTitle) signBoxTitle.value = signBox.title || "FOR ELEVATE EDGE INTERIORS";

    const signBoxName = document.getElementById("pdfSignBoxNameInput");
    if (signBoxName) signBoxName.value = signBox.name || q.authorizedRepresentative || "Managing Partner & Principal Designer";

    const signBoxSub = document.getElementById("pdfSignBoxSubtitleInput");
    if (signBoxSub) signBoxSub.value = signBox.subtitle || "Official Authorized Signatory | Hyderabad";

    const signBoxLine = document.getElementById("pdfSignBoxLineInput");
    if (signBoxLine) signBoxLine.value = signBox.signatureLine || "Signature & Seal: ________________________";

    // Right Issuance Box Inputs
    const issuanceBox = q.issuanceBox || {};
    const issBoxTitle = document.getElementById("pdfIssuanceBoxTitleInput");
    if (issBoxTitle) issBoxTitle.value = issuanceBox.title || "OFFICIAL ISSUANCE & VERIFICATION";

    const issBoxRef = document.getElementById("pdfIssuanceBoxRefInput");
    if (issBoxRef) issBoxRef.value = issuanceBox.refText || "Issuance Reference: {Quotation Number}";

    const issBoxScope = document.getElementById("pdfIssuanceBoxScopeInput");
    if (issBoxScope) issBoxScope.value = issuanceBox.scopeText || "Scope Verified: {Item Count} Custom Interior Work Items";

    const issBoxValidity = document.getElementById("pdfIssuanceBoxValidityInput");
    if (issBoxValidity) issBoxValidity.value = issuanceBox.validityText || "Turnkey Proposal Valid for 30 Days from Issuance";

    // Render Items, Charges, Terms, Payment Schedule, and Pillars
    this.renderItemsList();
    this.renderAdditionalChargesList();
    this.renderTermsEditor();
    this.renderPaymentScheduleEditor();
    this.renderPillarsEditor();
    this.recalculateAll();
  }

  syncEditorFormToQuotation() {
    const q = this.activeQuotation;
    if (!q) return;

    q.quotationNumber = document.getElementById("quoteNumberInput")?.value.trim() || q.quotationNumber;
    q.status = document.getElementById("editorStatusSelect")?.value || q.status;
    q.quotationDate = document.getElementById("quoteDateInput")?.value || q.quotationDate;
    q.validityDate = document.getElementById("validityDateInput")?.value || q.validityDate;
    q.title = document.getElementById("quoteTitleInput")?.value.trim() || q.title;
    q.createdBy = document.getElementById("quoteCreatedByInput")?.value.trim() || q.createdBy;
    q.approvedBy = document.getElementById("quoteApprovedByInput")?.value.trim() || q.approvedBy;

    if (!q.client) q.client = {};
    q.client.clientName = document.getElementById("clientNameInput")?.value.trim() || "";
    q.client.contactPerson = document.getElementById("clientContactPersonInput")?.value.trim() || "";
    q.client.mobileNumber = document.getElementById("clientMobileInput")?.value.trim() || "";
    q.client.alternateMobile = document.getElementById("clientAltMobileInput")?.value.trim() || "";
    q.client.email = document.getElementById("clientEmailInput")?.value.trim() || "";
    q.client.billingAddress = document.getElementById("clientBillingAddressInput")?.value.trim() || "";
    q.client.projectName = document.getElementById("projectNameInput")?.value.trim() || "";
    q.client.projectSiteAddress = document.getElementById("projectSiteAddressInput")?.value.trim() || "";
    q.client.projectLocation = document.getElementById("projectLocationInput")?.value.trim() || "";

    q.projectDescription = document.getElementById("projectOverviewInput")?.value.trim() || "";
    q.internalNotes = document.getElementById("internalNotesInput")?.value.trim() || "";

    q.companyName = document.getElementById("pdfCompanyNameInput")?.value.trim() || q.companyName || "ELEVATE EDGE INTERIORS";
    q.documentHeading = document.getElementById("pdfDocumentHeadingInput")?.value.trim() || q.documentHeading || "INTERIOR DESIGN & EXECUTION QUOTATION";
    q.tableHeading = document.getElementById("pdfTableHeadingInput")?.value.trim() || q.tableHeading || "SCOPE OF WORK & PRICING SCHEDULE";
    q.termsHeading = document.getElementById("pdfTermsHeadingInput")?.value.trim() || q.termsHeading || "TERMS AND CONDITIONS";
    q.authorizedRepresentative = document.getElementById("pdfAuthorizedRepInput")?.value.trim() || q.authorizedRepresentative || "Managing Partner & Principal Designer";
    q.footerNote = document.getElementById("pdfFooterNoteInput")?.value.trim() || q.footerNote || "This is a computer-generated document. No physical signature is required.";
    q.showPillars = document.getElementById("pdfShowPillarsToggle")?.checked !== false;
    q.showSignatoryBlock = document.getElementById("pdfShowSignatoryBlockToggle")?.checked !== false;

    if (!q.signatoryBox) q.signatoryBox = {};
    q.signatoryBox.title = document.getElementById("pdfSignBoxTitleInput")?.value.trim() || q.signatoryBox.title || "FOR ELEVATE EDGE INTERIORS";
    q.signatoryBox.name = document.getElementById("pdfSignBoxNameInput")?.value.trim() || q.signatoryBox.name || "Managing Partner & Principal Designer";
    q.signatoryBox.subtitle = document.getElementById("pdfSignBoxSubtitleInput")?.value.trim() || q.signatoryBox.subtitle || "Official Authorized Signatory | Hyderabad";
    q.signatoryBox.signatureLine = document.getElementById("pdfSignBoxLineInput")?.value.trim() || q.signatoryBox.signatureLine || "Signature & Seal: ________________________";

    if (!q.issuanceBox) q.issuanceBox = {};
    q.issuanceBox.title = document.getElementById("pdfIssuanceBoxTitleInput")?.value.trim() || q.issuanceBox.title || "OFFICIAL ISSUANCE & VERIFICATION";
    q.issuanceBox.refText = document.getElementById("pdfIssuanceBoxRefInput")?.value.trim() || q.issuanceBox.refText || "Issuance Reference: {Quotation Number}";
    q.issuanceBox.scopeText = document.getElementById("pdfIssuanceBoxScopeInput")?.value.trim() || q.issuanceBox.scopeText || "Scope Verified: {Item Count} Custom Interior Work Items";
    q.issuanceBox.validityText = document.getElementById("pdfIssuanceBoxValidityInput")?.value.trim() || q.issuanceBox.validityText || "Turnkey Proposal Valid for 30 Days from Issuance";
  }

  markDirty() {
    this.isDirty = true;
    const ind = document.getElementById("saveStatusIndicator");
    if (ind) {
      ind.innerHTML = `<i class="fas fa-circle" style="color:var(--color-warning); font-size:0.6rem;"></i> Unsaved changes...`;
    }
  }

  markClean() {
    this.isDirty = false;
    const ind = document.getElementById("saveStatusIndicator");
    if (ind) {
      ind.innerHTML = `<i class="fas fa-check-circle" style="color:var(--color-success); font-size:0.75rem;"></i> All changes saved`;
    }
  }

  // ================= LINE ITEMS & SUBPOINTS ENGINE =================
  renderItemsList() {
    const container = document.getElementById("editorItemsContainer");
    if (!container) return;

    const items = this.activeQuotation.items || [];
    if (items.length === 0) {
      container.innerHTML = `
        <div style="text-align:center; padding:3rem 1rem; color:var(--color-text-muted);">
          <i class="fas fa-couch" style="font-size:2.5rem; color:var(--color-gold); margin-bottom:1rem; opacity:0.7;"></i>
          <h4 style="font-size:1.1rem; color:var(--color-primary); margin-bottom:0.4rem;">No items added to this quotation yet</h4>
          <p style="font-size:0.88rem; margin-bottom:1.25rem;">Choose from our built-in luxury catalogue, insert a standard room package, or add custom line items.</p>
          <div style="display:flex; justify-content:center; gap:0.75rem;">
            <button class="btn btn-gold" onclick="app.openCataloguePickerModal()"><i class="fas fa-book-open"></i> Browse Catalogue</button>
            <button class="btn btn-outline" onclick="app.addBlankItem()"><i class="fas fa-plus"></i> Add Custom Item</button>
          </div>
        </div>
      `;
      return;
    }

    container.innerHTML = `
      <div class="items-table-container">
        <table class="items-table">
          <thead>
            <tr>
              <th style="width:40px; text-align:center;">#</th>
              <th>Item & Specifications</th>
              <th style="width:110px;">Unit</th>
              <th style="width:85px; text-align:right;">Qty</th>
              <th style="width:130px; text-align:right;">Unit Price (₹)</th>
              <th style="width:150px; text-align:right;">Total (₹)</th>
              <th style="width:100px; text-align:center;">Actions</th>
            </tr>
          </thead>
          <tbody>
            ${items.map((item, idx) => this.renderSingleItemRow(item, idx)).join("")}
          </tbody>
        </table>
      </div>
    `;
  }

  renderSingleItemRow(item, idx) {
    const subpoints = item.subpoints || [];
    const unitsOptions = (typeof STANDARD_UNITS !== "undefined" ? STANDARD_UNITS : ["Nos.", "Sq. ft.", "Running ft.", "Lot", "Job"])
      .map(u => `<option value="${u}" ${item.unit === u ? "selected" : ""}>${u}</option>`)
      .join("");

    return `
      <tr class="item-row" data-index="${idx}">
        <td class="item-sno">${idx + 1}</td>
        <td>
          <div style="display:flex; gap:0.5rem; margin-bottom:0.4rem;">
            <input type="text" class="form-control" style="font-weight:600; color:var(--color-primary);" 
              placeholder="Item Name (e.g. Living Room TV Base Unit)" 
              value="${this.escapeHtml(item.name || "")}" 
              oninput="app.updateItemField(${idx}, 'name', this.value)">
            <input type="text" class="form-control" style="width:160px; font-size:0.8rem;" 
              placeholder="Category" 
              value="${this.escapeHtml(item.category || "")}" 
              oninput="app.updateItemField(${idx}, 'category', this.value)">
          </div>

          <textarea class="form-control" style="font-size:0.82rem; min-height:48px; margin-bottom:0.4rem;" 
            placeholder="Detailed description..." 
            oninput="app.updateItemField(${idx}, 'description', this.value)">${this.escapeHtml(item.description || "")}</textarea>

          <!-- SUBPOINTS LIST (CRITICAL REQUIREMENT) -->
          <div class="subpoints-box">
            <div class="subpoints-header">
              <span><i class="fas fa-list-ul"></i> Subpoints & Specifications (${subpoints.length})</span>
              <button type="button" class="btn btn-sm btn-outline" style="padding:0.15rem 0.5rem; font-size:0.75rem;" 
                onclick="app.addSubpoint(${idx})">
                <i class="fas fa-plus"></i> Add Subpoint
              </button>
            </div>
            <ul class="subpoint-list">
              ${subpoints.map((sp, spIdx) => `
                <li class="subpoint-item">
                  <span class="subpoint-bullet">•</span>
                  <input type="text" class="subpoint-input" 
                    placeholder="Specification detail..." 
                    value="${this.escapeHtml(sp)}" 
                    oninput="app.updateSubpoint(${idx}, ${spIdx}, this.value)">
                  <div class="subpoint-actions">
                    <button type="button" class="subpoint-btn" title="Move Up" onclick="app.moveSubpoint(${idx}, ${spIdx}, -1)"><i class="fas fa-arrow-up"></i></button>
                    <button type="button" class="subpoint-btn" title="Move Down" onclick="app.moveSubpoint(${idx}, ${spIdx}, 1)"><i class="fas fa-arrow-down"></i></button>
                    <button type="button" class="subpoint-btn delete" title="Remove Subpoint" onclick="app.deleteSubpoint(${idx}, ${spIdx})"><i class="fas fa-times"></i></button>
                  </div>
                </li>
              `).join("")}
            </ul>
          </div>

          <!-- EDITABLE / ADDABLE / REMOVABLE ITEM NOTE -->
          <div class="item-note-container">
            ${(item.notes !== undefined && item.notes !== null && item.notes.toString().trim() !== "" || item.isEditingNote) ? `
              <div class="item-note-box">
                <span class="item-note-label">
                  <i class="fas fa-sticky-note" style="color:var(--color-gold);"></i> Note:
                </span>
                <input type="text" class="item-note-input" 
                  placeholder="Special note for this item (e.g. Includes 2 wardrobe units for Master & Guest bedrooms)..." 
                  value="${this.escapeHtml(item.notes || '')}" 
                  oninput="app.updateItemField(${idx}, 'notes', this.value)"
                  onblur="if (!this.value.trim()) app.removeItemNote(${idx})">
                <button type="button" class="item-note-remove-btn" 
                  title="Remove this note from item" onclick="app.removeItemNote(${idx})">
                  <i class="fas fa-trash-alt"></i>
                </button>
              </div>
            ` : `
              <button type="button" class="btn-add-item-note" onclick="app.addItemNote(${idx})">
                <i class="fas fa-sticky-note" style="color:var(--color-gold);"></i> + Add Note
              </button>
            `}
          </div>
        </td>
        <td>
          <select class="form-control" style="font-size:0.82rem;" onchange="app.updateItemField(${idx}, 'unit', this.value)">
            ${unitsOptions}
          </select>
        </td>
        <td>
          <input type="number" class="form-control" style="text-align:right;" min="0.01" step="any" 
            value="${item.quantity}" 
            oninput="app.updateItemField(${idx}, 'quantity', parseFloat(this.value) || 0)">
        </td>
        <td>
          <input type="number" class="form-control" style="text-align:right;" min="0" step="any" 
            value="${item.unitPrice}" 
            oninput="app.updateItemField(${idx}, 'unitPrice', parseFloat(this.value) || 0)">
        </td>
        <td style="text-align:right;">
          <div class="item-line-total" style="font-weight:700; color:var(--color-primary); font-size:1.05rem;">
            ₹ ${this.formatIndianCurrency(item.total || 0)}
          </div>
          <div class="item-line-disc-notice" style="font-size:0.75rem; color:var(--color-danger); font-weight:600; min-height:16px; margin-top:2px;">
            ${item.discountAmount > 0 ? `(Incl. -₹${this.formatIndianCurrency(item.discountAmount)} disc)` : ""}
          </div>
          <div style="display:flex; align-items:center; gap:0.25rem; margin-top:4px; justify-content:flex-end;">
            <span style="font-size:0.72rem; color:var(--color-text-muted); font-weight:500;">Disc:</span>
            <select class="form-control" style="font-size:0.72rem; padding:0.15rem 0.3rem; width:54px; height:24px;" 
              onchange="app.updateItemField(${idx}, 'discountType', this.value)">
              <option value="percentage" ${item.discountType === 'percentage' ? 'selected' : ''}>%</option>
              <option value="fixed" ${item.discountType === 'fixed' ? 'selected' : ''}>₹</option>
            </select>
            <input type="number" class="form-control" style="text-align:right; font-size:0.75rem; padding:0.15rem 0.3rem; width:65px; height:24px;" 
              min="0" step="any" placeholder="0" 
              value="${item.discountValue || 0}" 
              oninput="app.updateItemField(${idx}, 'discountValue', parseFloat(this.value) || 0)">
          </div>
        </td>
        <td style="text-align:center;">
          <div style="display:flex; gap:0.25rem; justify-content:center;">
            <button class="btn btn-icon-only" title="Move Up" onclick="app.moveItemRow(${idx}, -1)"><i class="fas fa-chevron-up"></i></button>
            <button class="btn btn-icon-only" title="Move Down" onclick="app.moveItemRow(${idx}, 1)"><i class="fas fa-chevron-down"></i></button>
            <button class="btn btn-icon-only" title="Save this item to Catalogue" onclick="app.saveItemToCatalogue(${idx})"><i class="fas fa-bookmark" style="color:var(--color-gold);"></i></button>
            <button class="btn btn-icon-only" title="Duplicate" onclick="app.duplicateItem(${idx})"><i class="fas fa-clone"></i></button>
            <button class="btn btn-icon-only" style="color:var(--color-danger);" title="Remove" onclick="app.removeItem(${idx})"><i class="fas fa-trash-alt"></i></button>
          </div>
        </td>
      </tr>
    `;
  }

  // ================= SUBPOINT ACTIONS =================
  addSubpoint(itemIdx) {
    const item = this.activeQuotation.items[itemIdx];
    if (!item) return;
    if (!item.subpoints) item.subpoints = [];
    item.subpoints.push("");
    this.renderItemsList();
    this.markDirty();
  }

  updateSubpoint(itemIdx, spIdx, text) {
    const item = this.activeQuotation.items[itemIdx];
    if (item && item.subpoints && item.subpoints[spIdx] !== undefined) {
      item.subpoints[spIdx] = text;
      this.markDirty();
    }
  }

  deleteSubpoint(itemIdx, spIdx) {
    const item = this.activeQuotation.items[itemIdx];
    if (item && item.subpoints) {
      item.subpoints.splice(spIdx, 1);
      this.renderItemsList();
      this.markDirty();
    }
  }

  moveSubpoint(itemIdx, spIdx, dir) {
    const item = this.activeQuotation.items[itemIdx];
    if (!item || !item.subpoints) return;
    const targetIdx = spIdx + dir;
    if (targetIdx < 0 || targetIdx >= item.subpoints.length) return;
    const temp = item.subpoints[spIdx];
    item.subpoints[spIdx] = item.subpoints[targetIdx];
    item.subpoints[targetIdx] = temp;
    this.renderItemsList();
    this.markDirty();
  }

  // ================= ITEM NOTE ACTIONS =================
  addItemNote(itemIdx) {
    if (!this.activeQuotation || !this.activeQuotation.items) return;
    const item = this.activeQuotation.items[itemIdx];
    if (!item) return;
    item.notes = "";
    item.isEditingNote = true;
    this.renderItemsList();
    this.markDirty();
    setTimeout(() => {
      const row = document.querySelector(`.item-row[data-index="${itemIdx}"]`);
      const input = row?.querySelector(".item-note-input");
      if (input) {
        input.focus();
      }
    }, 60);
  }

  removeItemNote(itemIdx) {
    if (!this.activeQuotation || !this.activeQuotation.items) return;
    const item = this.activeQuotation.items[itemIdx];
    if (!item) return;
    item.notes = "";
    item.isEditingNote = false;
    this.renderItemsList();
    this.markDirty();
    this.showToast("Note removed from item.", "info");
  }

  // ================= ITEM ACTIONS =================
  addBlankItem() {
    if (!this.activeQuotation) return;
    if (!this.activeQuotation.items) this.activeQuotation.items = [];

    const newItem = {
      id: "item-" + Date.now(),
      sno: this.activeQuotation.items.length + 1,
      name: "",
      category: "General Interior Works",
      description: "",
      subpoints: [],
      unit: "Nos.",
      quantity: 1,
      unitPrice: 0,
      amount: 0,
      discountType: "percentage",
      discountValue: 0,
      discountAmount: 0,
      total: 0,
      notes: ""
    };

    this.activeQuotation.items.push(newItem);
    this.renderItemsList();
    this.recalculateAll();
    this.markDirty();
  }

  addItemFromCatalogue(catalogueItem) {
    if (!this.activeQuotation) return;
    if (!this.activeQuotation.items) this.activeQuotation.items = [];

    const newItem = {
      id: "item-" + Date.now() + "-" + Math.random().toString(36).substr(2, 4),
      sno: this.activeQuotation.items.length + 1,
      name: catalogueItem.name,
      category: catalogueItem.category,
      description: catalogueItem.description,
      subpoints: [...(catalogueItem.subpoints || [])],
      unit: catalogueItem.unit || "Nos.",
      quantity: 1,
      unitPrice: catalogueItem.indicativePrice || 0,
      amount: catalogueItem.indicativePrice || 0,
      discountType: "percentage",
      discountValue: 0,
      discountAmount: 0,
      total: catalogueItem.indicativePrice || 0,
      notes: ""
    };

    this.activeQuotation.items.push(newItem);
    this.renderItemsList();
    this.recalculateAll();
    this.markDirty();
    this.showToast(`Added ${catalogueItem.name} to quotation.`, "success");
  }

  addItemFromCatalogueById(id) {
    const list = storage.getCatalogue();
    const item = list.find(c => c.id === id);
    if (item) {
      this.addItemFromCatalogue(item);
    }
  }

  saveItemToCatalogue(itemIdx) {
    const item = this.activeQuotation?.items?.[itemIdx];
    if (!item) return;

    const catItem = {
      id: "cat-custom-" + Date.now(),
      name: item.name || "Custom Item",
      category: item.category || "General Interior Works",
      unit: item.unit || "Nos.",
      indicativePrice: item.unitPrice || 0,
      description: item.description || "",
      subpoints: [...(item.subpoints || [])],
      notes: item.notes || ""
    };

    storage.addCatalogueItem(catItem);
    this.showToast(`Saved "${catItem.name}" to Catalogue!`, "success");
  }

  duplicateItem(idx) {
    const item = this.activeQuotation.items[idx];
    if (!item) return;
    const copy = JSON.parse(JSON.stringify(item));
    copy.id = "item-" + Date.now();
    copy.name += " (Copy)";
    this.activeQuotation.items.splice(idx + 1, 0, copy);
    this.renderItemsList();
    this.recalculateAll();
    this.markDirty();
  }

  removeItem(idx) {
    if (confirm("Remove this item from the quotation?")) {
      this.activeQuotation.items.splice(idx, 1);
      this.renderItemsList();
      this.recalculateAll();
      this.markDirty();
    }
  }

  moveItemRow(idx, dir) {
    const target = idx + dir;
    if (target < 0 || target >= this.activeQuotation.items.length) return;
    const temp = this.activeQuotation.items[idx];
    this.activeQuotation.items[idx] = this.activeQuotation.items[target];
    this.activeQuotation.items[target] = temp;
    this.renderItemsList();
    this.recalculateAll();
    this.markDirty();
  }

  updateItemField(idx, field, value) {
    const item = this.activeQuotation.items[idx];
    if (!item) return;

    item[field] = value;

    // Recalculate line total
    const qty = Math.max(0, Number(item.quantity) || 0);
    const unitPrice = Math.max(0, Number(item.unitPrice) || 0);
    const lineAmount = qty * unitPrice;
    item.amount = lineAmount;

    let discountAmt = 0;
    const discVal = Math.max(0, Number(item.discountValue) || 0);
    if (item.discountType === "percentage") {
      discountAmt = (lineAmount * discVal) / 100;
    } else {
      discountAmt = Math.min(lineAmount, discVal);
    }
    item.discountAmount = discountAmt;
    item.total = Math.max(0, lineAmount - discountAmt);

    // Update row total without redrawing the whole table and without wiping inputs
    const row = document.querySelector(`.item-row[data-index="${idx}"]`);
    if (row) {
      const totalDisplay = row.querySelector('.item-line-total');
      const discNotice = row.querySelector('.item-line-disc-notice');
      if (totalDisplay) totalDisplay.textContent = `₹ ${this.formatIndianCurrency(item.total || 0)}`;
      if (discNotice) {
        discNotice.textContent = item.discountAmount > 0 
          ? `(Incl. -₹${this.formatIndianCurrency(item.discountAmount)} disc)` 
          : '';
      }
    }

    this.recalculateSummary();
    this.markDirty();
  }

  // ================= FINANCIAL ENGINE & DISCOUNT CALCULATIONS =================
  recalculateAll() {
    if (!this.activeQuotation) return;
    const items = this.activeQuotation.items || [];

    // 1. Recalculate every line item
    let totalBeforeDiscounts = 0;
    let totalItemDiscounts = 0;

    items.forEach((item, idx) => {
      item.sno = idx + 1;
      const qty = Math.max(0, Number(item.quantity) || 0);
      const unitPrice = Math.max(0, Number(item.unitPrice) || 0);
      const lineAmount = qty * unitPrice;
      item.amount = lineAmount;

      let discountAmt = 0;
      const discVal = Math.max(0, Number(item.discountValue) || 0);
      if (item.discountType === "percentage") {
        discountAmt = (lineAmount * discVal) / 100;
      } else {
        discountAmt = Math.min(lineAmount, discVal);
      }
      item.discountAmount = discountAmt;
      item.total = Math.max(0, lineAmount - discountAmt);

      totalBeforeDiscounts += lineAmount;
      totalItemDiscounts += discountAmt;
    });

    this.recalculateSummary(totalBeforeDiscounts, totalItemDiscounts);
  }

  recalculateSummary(forcedTotalBefore = null, forcedItemDisc = null) {
    const q = this.activeQuotation;
    if (!q) return;

    const p = q.pricing || {};
    const items = q.items || [];

    let totalBefore = forcedTotalBefore !== null ? forcedTotalBefore : 
      items.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
    let itemDiscounts = forcedItemDisc !== null ? forcedItemDisc : 
      items.reduce((sum, item) => sum + (Number(item.discountAmount) || 0), 0);

    p.totalBeforeDiscounts = totalBefore;
    p.totalItemDiscounts = itemDiscounts;

    // Remaining total after item-level discounts
    const remainingAfterItemDiscounts = Math.max(0, totalBefore - itemDiscounts);

    // Overall Discount calculation
    let overallDiscAmt = 0;
    const overallVal = Math.max(0, Number(p.overallDiscountValue) || 0);
    if (p.overallDiscountType === "percentage") {
      overallDiscAmt = (remainingAfterItemDiscounts * overallVal) / 100;
    } else {
      overallDiscAmt = Math.min(remainingAfterItemDiscounts, overallVal);
    }
    p.overallDiscountAmount = overallDiscAmt;

    // Subtotal after all discounts
    const subtotal = Math.max(0, remainingAfterItemDiscounts - overallDiscAmt);
    p.subtotalAfterDiscounts = subtotal;

    // Taxes Calculation
    let taxAmt = 0;
    if (p.taxEnabled) {
      const taxRate = Math.max(0, Number(p.taxRate) || 0);
      taxAmt = (subtotal * taxRate) / 100;
    }
    p.taxAmount = taxAmt;

    // Additional Charges Sum
    const charges = p.additionalCharges || [];
    const totalAdditionalCharges = charges.reduce((sum, ch) => sum + (Number(ch.amount) || 0), 0);
    p.totalAdditionalCharges = totalAdditionalCharges;

    // Final Grand Total
    const grandTotal = subtotal + taxAmt + totalAdditionalCharges;
    p.grandTotal = grandTotal;

    // Grand Total in Words (Indian numbering Lakhs and Crores)
    p.grandTotalInWords = this.numberToIndianWords(Math.round(grandTotal));

    // Update UI Elements
    document.getElementById("summaryTotalBefore").textContent = `₹ ${this.formatIndianCurrency(totalBefore)}`;
    document.getElementById("summaryItemDiscounts").textContent = `- ₹ ${this.formatIndianCurrency(itemDiscounts)}`;
    document.getElementById("summaryOverallDiscount").textContent = `- ₹ ${this.formatIndianCurrency(overallDiscAmt)}`;
    document.getElementById("summarySubtotal").textContent = `₹ ${this.formatIndianCurrency(subtotal)}`;
    document.getElementById("summaryTaxAmount").textContent = `+ ₹ ${this.formatIndianCurrency(taxAmt)}`;
    document.getElementById("summaryAdditionalCharges").textContent = `+ ₹ ${this.formatIndianCurrency(totalAdditionalCharges)}`;
    document.getElementById("summaryGrandTotal").textContent = `₹ ${this.formatIndianCurrency(grandTotal)}`;
    document.getElementById("summaryGrandTotalWords").textContent = p.grandTotalInWords;
  }

  // ================= ADDITIONAL CHARGES =================
  renderAdditionalChargesList() {
    const container = document.getElementById("additionalChargesList");
    if (!container) return;
    const charges = this.activeQuotation?.pricing?.additionalCharges || [];

    if (charges.length === 0) {
      container.innerHTML = `<div style="font-size:0.8rem; color:var(--color-text-muted); font-style:italic;">No additional charges (transportation, installation, etc.) added.</div>`;
      return;
    }

    container.innerHTML = charges.map((ch, idx) => `
      <div style="display:flex; gap:0.5rem; margin-bottom:0.5rem; align-items:center;">
        <input type="text" class="form-control" style="font-size:0.82rem;" 
          placeholder="Charge name (e.g. Transportation, Installation)" 
          value="${this.escapeHtml(ch.name || "")}" 
          oninput="app.updateAdditionalCharge(${idx}, 'name', this.value)">
        <input type="number" class="form-control" style="width:130px; text-align:right; font-size:0.82rem;" 
          placeholder="Amount (₹)" 
          value="${ch.amount || 0}" 
          oninput="app.updateAdditionalCharge(${idx}, 'amount', parseFloat(this.value) || 0)">
        <button type="button" class="btn btn-icon-only" style="color:var(--color-danger);" 
          onclick="app.removeAdditionalCharge(${idx})">
          <i class="fas fa-times"></i>
        </button>
      </div>
    `).join("");
  }

  addAdditionalChargeRow() {
    if (!this.activeQuotation) return;
    if (!this.activeQuotation.pricing.additionalCharges) this.activeQuotation.pricing.additionalCharges = [];
    this.activeQuotation.pricing.additionalCharges.push({ name: "Transportation & Shifting", amount: 0 });
    this.renderAdditionalChargesList();
    this.recalculateAll();
    this.markDirty();
  }

  updateAdditionalCharge(idx, field, value) {
    const ch = this.activeQuotation?.pricing?.additionalCharges?.[idx];
    if (ch) {
      ch[field] = value;
      this.recalculateAll();
      this.markDirty();
    }
  }

  removeAdditionalCharge(idx) {
    this.activeQuotation?.pricing?.additionalCharges?.splice(idx, 1);
    this.renderAdditionalChargesList();
    this.recalculateAll();
    this.markDirty();
  }

  // ================= TERMS & CONDITIONS EDITOR =================
  renderTermsEditor() {
    const container = document.getElementById("termsEditorContainer");
    if (!container) return;

    const terms = this.activeQuotation.terms || [];
    container.innerHTML = terms.map((t, idx) => `
      <div style="background:#FAFBFB; border:1px solid var(--color-border); border-radius:var(--radius-md); padding:0.75rem; margin-bottom:0.75rem;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.4rem;">
          <input type="text" class="form-control" style="font-weight:600; font-size:0.85rem;" 
            value="${this.escapeHtml(t.title || "")}" 
            oninput="app.updateTermField(${idx}, 'title', this.value)">
          <button type="button" class="btn btn-icon-only" style="color:var(--color-danger); margin-left:0.5rem;" 
            onclick="app.deleteTerm(${idx})">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <textarea class="form-control" style="font-size:0.8rem; min-height:50px;" 
          oninput="app.updateTermField(${idx}, 'text', this.value)">${this.escapeHtml(t.text || "")}</textarea>
      </div>
    `).join("");
  }

  addTermClause() {
    if (!this.activeQuotation.terms) this.activeQuotation.terms = [];
    this.activeQuotation.terms.push({ title: "Custom Clause", text: "" });
    this.renderTermsEditor();
    this.markDirty();
  }

  updateTermField(idx, field, value) {
    if (this.activeQuotation.terms?.[idx]) {
      this.activeQuotation.terms[idx][field] = value;
      this.markDirty();
    }
  }

  deleteTerm(idx) {
    if (confirm("Remove this clause?")) {
      this.activeQuotation.terms.splice(idx, 1);
      this.renderTermsEditor();
      this.markDirty();
    }
  }

  resetTermsToDefault() {
    if (confirm("Reset terms to company default template?")) {
      const settings = storage.getSettings();
      this.activeQuotation.terms = JSON.parse(JSON.stringify(settings.termsAndConditions || []));
      this.renderTermsEditor();
      this.markDirty();
      this.showToast("Terms reset to company defaults.", "success");
    }
  }

  // ================= PAYMENT SCHEDULE (BOTTOM TABLE) & PDF CUSTOMIZATION =================
  renderPaymentScheduleEditor() {
    const tbody = document.getElementById("paymentScheduleTableBody");
    if (!tbody) return;

    if (!this.activeQuotation.paymentSchedule || !this.activeQuotation.paymentSchedule.length) {
      const settings = storage.getSettings();
      this.activeQuotation.paymentSchedule = JSON.parse(JSON.stringify(settings.defaultPaymentSchedule || []));
    }

    const milestones = this.activeQuotation.paymentSchedule;
    tbody.innerHTML = milestones.map((ms, idx) => `
      <tr>
        <td>
          <input type="text" class="form-control" style="font-size:0.82rem; font-weight:600;" 
            value="${this.escapeHtml(ms.milestone || '')}" 
            oninput="app.updatePaymentMilestone(${idx}, 'milestone', this.value)">
        </td>
        <td>
          <input type="number" class="form-control" style="text-align:right; font-size:0.82rem; font-weight:600;" 
            value="${ms.percentage || 0}" min="0" max="100" 
            oninput="app.updatePaymentMilestone(${idx}, 'percentage', parseFloat(this.value) || 0)">
        </td>
        <td>
          <input type="text" class="form-control" style="font-size:0.82rem;" 
            value="${this.escapeHtml(ms.notes || '')}" 
            oninput="app.updatePaymentMilestone(${idx}, 'notes', this.value)">
        </td>
        <td style="text-align:center;">
          <button type="button" class="btn btn-icon-only" style="color:var(--color-danger);" 
            title="Remove Milestone" onclick="app.removePaymentMilestone(${idx})">
            <i class="fas fa-times"></i>
          </button>
        </td>
      </tr>
    `).join("");

    const totalPct = milestones.reduce((sum, m) => sum + (Number(m.percentage) || 0), 0);
    const notice = document.getElementById("paymentScheduleTotalNotice");
    if (notice) {
      notice.innerHTML = `Total Milestone Share: <span style="color:${totalPct === 100 ? 'var(--color-success)' : 'var(--color-danger)'};">${totalPct}%</span>`;
    }
  }

  addPaymentMilestone() {
    if (!this.activeQuotation.paymentSchedule) this.activeQuotation.paymentSchedule = [];
    this.activeQuotation.paymentSchedule.push({
      milestone: "New Milestone Stage",
      percentage: 10,
      notes: "Payment upon stage completion"
    });
    this.renderPaymentScheduleEditor();
    this.markDirty();
  }

  updatePaymentMilestone(idx, field, value) {
    if (this.activeQuotation.paymentSchedule?.[idx]) {
      this.activeQuotation.paymentSchedule[idx][field] = value;
      this.markDirty();
      const milestones = this.activeQuotation.paymentSchedule;
      const totalPct = milestones.reduce((sum, m) => sum + (Number(m.percentage) || 0), 0);
      const notice = document.getElementById("paymentScheduleTotalNotice");
      if (notice) {
        notice.innerHTML = `Total Milestone Share: <span style="color:${totalPct === 100 ? 'var(--color-success)' : 'var(--color-danger)'};">${totalPct}%</span>`;
      }
    }
  }

  removePaymentMilestone(idx) {
    if (confirm("Remove this payment milestone?")) {
      this.activeQuotation.paymentSchedule.splice(idx, 1);
      this.renderPaymentScheduleEditor();
      this.markDirty();
    }
  }

  resetPaymentScheduleToDefault() {
    if (confirm("Reset payment schedule to standard company default?")) {
      const settings = storage.getSettings();
      this.activeQuotation.paymentSchedule = JSON.parse(JSON.stringify(settings.defaultPaymentSchedule || []));
      this.renderPaymentScheduleEditor();
      this.markDirty();
      this.showToast("Payment schedule reset to defaults.", "success");
    }
  }

  updatePdfHeading(field, value) {
    if (!this.activeQuotation) return;
    this.activeQuotation[field] = value;
    if (field === 'title') {
      const mainTitle = document.getElementById("quoteTitleInput");
      if (mainTitle) mainTitle.value = value;
    }
    this.markDirty();
  }

  // ================= SPECIFICATION PILLARS & SIGNATORY BOX MANAGEMENT =================
  renderPillarsEditor() {
    const container = document.getElementById("pillarsEditorContainer");
    if (!container) return;

    if (!this.activeQuotation.specificationPillars || !Array.isArray(this.activeQuotation.specificationPillars) || this.activeQuotation.specificationPillars.length === 0) {
      const settings = storage.getSettings();
      this.activeQuotation.specificationPillars = JSON.parse(JSON.stringify(settings.defaultSpecificationPillars || [
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
      ]));
    }

    const pillars = this.activeQuotation.specificationPillars;
    container.innerHTML = pillars.map((p, idx) => `
      <div style="background:#FAFBFB; border:1px solid var(--color-border); border-radius:var(--radius-md); padding:0.85rem; position:relative;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.5rem;">
          <strong style="font-size:0.8rem; color:var(--color-primary); text-transform:uppercase;">Pillar #${idx + 1}</strong>
          <button type="button" class="btn btn-icon-only" style="color:var(--color-danger); font-size:0.8rem;" 
            title="Delete this pillar" onclick="app.deletePillar(${idx})">
            <i class="fas fa-trash-alt"></i>
          </button>
        </div>
        <div class="form-group" style="margin-bottom:0.4rem;">
          <label class="form-label" style="font-size:0.72rem;">Pillar Title</label>
          <input type="text" class="form-control" style="font-size:0.8rem; font-weight:700;" 
            value="${this.escapeHtml(p.title || '')}" 
            placeholder="e.g. CARCASS INTEGRITY"
            oninput="app.updatePillarField(${idx}, 'title', this.value)">
        </div>
        <div class="form-group" style="margin-bottom:0.4rem;">
          <label class="form-label" style="font-size:0.72rem;">Subtitle / Grade / Brand</label>
          <input type="text" class="form-control" style="font-size:0.78rem;" 
            value="${this.escapeHtml(p.sub || '')}" 
            placeholder="e.g. Certified BWP / HDHMR Grade"
            oninput="app.updatePillarField(${idx}, 'sub', this.value)">
        </div>
        <div class="form-group" style="margin-bottom:0;">
          <label class="form-label" style="font-size:0.72rem;">Quality Specification Details</label>
          <textarea class="form-control" rows="2" style="font-size:0.75rem;" 
            placeholder="Detailed description of specification..."
            oninput="app.updatePillarField(${idx}, 'desc', this.value)">${this.escapeHtml(p.desc || '')}</textarea>
        </div>
      </div>
    `).join("");
  }

  addSpecificationPillar() {
    if (!this.activeQuotation.specificationPillars) this.activeQuotation.specificationPillars = [];
    this.activeQuotation.specificationPillars.push({
      title: "NEW SPECIFICATION",
      sub: "Premium Quality Assurance",
      desc: "Architectural grade precision execution and verified quality standard."
    });
    this.renderPillarsEditor();
    this.markDirty();
    this.showToast("Added new quality pillar.", "info");
  }

  updatePillarField(idx, field, value) {
    if (this.activeQuotation.specificationPillars?.[idx]) {
      this.activeQuotation.specificationPillars[idx][field] = value;
      this.markDirty();
    }
  }

  deletePillar(idx) {
    if (confirm("Delete this quality specification pillar?")) {
      this.activeQuotation.specificationPillars.splice(idx, 1);
      this.renderPillarsEditor();
      this.markDirty();
      this.showToast("Pillar deleted.", "info");
    }
  }

  resetPillarsToDefault() {
    if (confirm("Reset pillars to standard company defaults (Carcass, German Hardware, 10-Year Warranty)?")) {
      const settings = storage.getSettings();
      this.activeQuotation.specificationPillars = JSON.parse(JSON.stringify(settings.defaultSpecificationPillars || [
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
      ]));
      this.renderPillarsEditor();
      this.markDirty();
      this.showToast("Quality pillars reset to defaults.", "success");
    }
  }

  toggleShowPillars(checked) {
    if (!this.activeQuotation) return;
    this.activeQuotation.showPillars = checked;
    this.markDirty();
  }

  toggleShowSignatoryBlock(checked) {
    if (!this.activeQuotation) return;
    this.activeQuotation.showSignatoryBlock = checked;
    this.markDirty();
  }

  updateSignatoryBoxField(field, value) {
    if (!this.activeQuotation) return;
    if (!this.activeQuotation.signatoryBox) this.activeQuotation.signatoryBox = {};
    this.activeQuotation.signatoryBox[field] = value;
    this.markDirty();
  }

  updateIssuanceBoxField(field, value) {
    if (!this.activeQuotation) return;
    if (!this.activeQuotation.issuanceBox) this.activeQuotation.issuanceBox = {};
    this.activeQuotation.issuanceBox[field] = value;
    this.markDirty();
  }

  // ================= CLIENT AUTO-COMPLETE =================
  handleClientNameInput(query) {
    if (!query || query.length < 2) return;
    const clients = storage.getAllClients();
    const matches = clients.filter(c => (c.name || "").toLowerCase().includes(query.toLowerCase()));
    const dropdown = document.getElementById("clientSuggestionsDropdown");
    if (!dropdown) return;

    if (matches.length === 0) {
      dropdown.style.display = "none";
      return;
    }

    dropdown.innerHTML = matches.map(c => `
      <div style="padding:0.5rem 0.75rem; cursor:pointer; border-bottom:1px solid #EEE;" 
        onclick="app.selectExistingClient('${c.id}')">
        <strong>${this.escapeHtml(c.name)}</strong>
        <div style="font-size:0.75rem; color:#777;">${c.mobile || ""} | ${c.projectName || ""}</div>
      </div>
    `).join("");
    dropdown.style.display = "block";
  }

  selectExistingClient(clientId) {
    const clients = storage.getAllClients();
    const c = clients.find(item => item.id === clientId);
    if (!c) return;

    document.getElementById("clientNameInput").value = c.name || "";
    document.getElementById("clientContactPersonInput").value = c.contactPerson || c.name || "";
    document.getElementById("clientMobileInput").value = c.mobile || "";
    document.getElementById("clientAltMobileInput").value = c.alternateMobile || "";
    document.getElementById("clientEmailInput").value = c.email || "";
    document.getElementById("clientBillingAddressInput").value = c.billingAddress || "";
    document.getElementById("projectNameInput").value = c.projectName || "";
    document.getElementById("projectLocationInput").value = c.projectLocation || "";

    const dropdown = document.getElementById("clientSuggestionsDropdown");
    if (dropdown) dropdown.style.display = "none";

    this.syncEditorFormToQuotation();
    this.markDirty();
    this.showToast(`Loaded details for ${c.name}`, "success");
  }

  // ================= CATALOGUE MODALS =================
  openCataloguePickerModal() {
    this.renderCataloguePickerList();
    document.getElementById("cataloguePickerModal").classList.add("active");
  }

  renderCataloguePickerList(catFilter = "All Categories", search = "") {
    const list = storage.getCatalogue();
    const container = document.getElementById("cataloguePickerList");
    if (!container) return;

    let filtered = list;
    if (catFilter !== "All Categories") {
      filtered = filtered.filter(i => i.category === catFilter);
    }
    if (search) {
      filtered = filtered.filter(i => i.name.toLowerCase().includes(search.toLowerCase()) || 
        (i.description || "").toLowerCase().includes(search.toLowerCase()));
    }

    container.innerHTML = filtered.map(item => `
      <div style="background:#FFF; border:1px solid var(--color-border); border-radius:var(--radius-md); padding:0.85rem; display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:0.75rem;">
        <div style="flex:1;">
          <div style="display:flex; align-items:center; gap:0.5rem;">
            <strong style="color:var(--color-primary); font-size:0.95rem;">${this.escapeHtml(item.name)}</strong>
            <span class="revision-badge-pill" style="font-size:0.7rem;">${item.category}</span>
          </div>
          <div style="font-size:0.82rem; color:var(--color-text-muted); margin:0.3rem 0;">${this.escapeHtml(item.description)}</div>
          <div style="font-size:0.78rem; color:#555;">
            <strong>Default Specs:</strong> ${(item.subpoints || []).slice(0, 3).join("; ")} ${(item.subpoints?.length > 3 ? `(+${item.subpoints.length - 3} more)` : "")}
          </div>
          <div style="font-size:0.82rem; font-weight:700; color:var(--color-gold-dark); margin-top:0.35rem;">
            Indicative: ₹ ${this.formatIndianCurrency(item.indicativePrice || 0)} / ${item.unit || "Nos."}
          </div>
        </div>
        <button class="btn btn-sm btn-gold" style="margin-left:1rem; white-space:nowrap;" onclick='app.addItemFromCatalogueById("${item.id}")'>
          <i class="fas fa-plus"></i> Add
        </button>
      </div>
    `).join("");
  }

  // ================= ROOM PACKAGES ENGINE =================
  openPackagePickerModal() {
    this.renderRoomPackagesList();
    document.getElementById("roomPackagesModal")?.classList.add("active");
  }

  renderRoomPackagesList(search = "", categoryFilter = "All Categories") {
    const container = document.getElementById("roomPackagesList");
    if (!container) return;

    const pkgs = storage.getPackages();
    let filtered = pkgs;

    if (categoryFilter && categoryFilter !== "All Categories") {
      filtered = filtered.filter(p => p.category === categoryFilter);
    }

    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      filtered = filtered.filter(p => 
        (p.name || "").toLowerCase().includes(q) || 
        (p.description || "").toLowerCase().includes(q) ||
        (p.category || "").toLowerCase().includes(q)
      );
    }

    if (filtered.length === 0) {
      container.innerHTML = `
        <div style="text-align:center; padding:3rem 1rem; color:var(--color-text-muted);">
          <i class="fas fa-boxes" style="font-size:2.5rem; color:#CBD5E0; margin-bottom:0.75rem;"></i>
          <p style="font-size:1rem; font-weight:600;">No matching room packages found.</p>
          <p style="font-size:0.85rem; margin-top:0.35rem;">Click "+ Create Custom Package" above to build a custom room package!</p>
        </div>
      `;
      return;
    }

    const catalogue = storage.getCatalogue();

    container.innerHTML = `
      <div class="pkg-grid">
        ${filtered.map(pkg => {
          // Resolve package items
          let items = [];
          if (pkg.items && Array.isArray(pkg.items) && pkg.items.length > 0) {
            items = pkg.items;
          } else if (pkg.itemIds && Array.isArray(pkg.itemIds)) {
            items = pkg.itemIds.map(id => catalogue.find(c => c.id === id)).filter(Boolean);
          }

          // Calculate estimated total value
          let estTotal = 0;
          items.forEach(it => {
            const qty = Number(it.quantity) || 1;
            const price = Number(it.unitPrice || it.indicativePrice) || 0;
            estTotal += qty * price;
          });

          const isCustom = !pkg.isBuiltIn;

          return `
            <div class="pkg-card">
              <div>
                <div class="pkg-header">
                  <div>
                    <div class="pkg-title">${this.escapeHtml(pkg.name)}</div>
                    <span class="pkg-badge ${isCustom ? 'custom' : ''}">${this.escapeHtml(pkg.category || 'General')}</span>
                    ${isCustom ? `<span class="pkg-badge custom" style="margin-left:4px;"><i class="fas fa-star" style="font-size:0.65rem;"></i> Custom</span>` : ''}
                  </div>
                  ${isCustom ? `
                    <div style="display:flex; gap:4px;">
                      <button class="btn btn-icon-only" title="Edit Package" onclick="app.openEditRoomPackage('${pkg.id}')"><i class="fas fa-edit"></i></button>
                      <button class="btn btn-icon-only" style="color:var(--color-danger);" title="Delete Package" onclick="app.deleteRoomPackage('${pkg.id}')"><i class="fas fa-trash"></i></button>
                    </div>
                  ` : ''}
                </div>

                <p class="pkg-desc">${this.escapeHtml(pkg.description || 'Pre-configured room interior ensemble.')}</p>

                <div class="pkg-items-preview">
                  <div style="font-weight:700; color:var(--color-primary); margin-bottom:4px; font-size:0.75rem;">
                    Included Scope (${items.length} Work Items):
                  </div>
                  ${items.map(it => `
                    <div class="pkg-item-line">
                      <span>• ${this.escapeHtml(it.name)}</span>
                      <span style="font-weight:600; color:var(--color-gold-dark);">${it.quantity || 1} ${it.unit || 'Nos.'}</span>
                    </div>
                  `).join("")}
                </div>
              </div>

              <div class="pkg-footer">
                <div>
                  <div class="pkg-price-est">Estimated Scope Total:</div>
                  <div class="pkg-price-val">₹ ${this.formatIndianCurrency(estTotal)}</div>
                </div>
                <button class="btn btn-sm btn-gold" onclick="app.insertRoomPackage('${pkg.id}')">
                  <i class="fas fa-plus-circle"></i> Insert Package
                </button>
              </div>
            </div>
          `;
        }).join("")}
      </div>
    `;
  }

  insertRoomPackage(pkgId) {
    const pkgs = storage.getPackages();
    const pkg = pkgs.find(p => p.id === pkgId);
    if (!pkg) return;

    if (!this.activeQuotation) {
      // Auto open editor if not active
      const list = storage.getAllQuotations();
      if (list.length > 0) {
        this.openQuotationEditor(list[0].id);
      } else {
        this.createNewQuotation();
      }
    }

    if (!this.activeQuotation.items) this.activeQuotation.items = [];

    const catalogue = storage.getCatalogue();
    let count = 0;

    if (pkg.items && Array.isArray(pkg.items) && pkg.items.length > 0) {
      pkg.items.forEach(it => {
        const qty = Math.max(0.01, Number(it.quantity) || 1);
        const price = Math.max(0, Number(it.unitPrice || it.indicativePrice) || 0);
        const amount = qty * price;

        const newItem = {
          id: "item-" + Date.now() + "-" + Math.random().toString(36).substr(2, 5),
          sno: this.activeQuotation.items.length + 1,
          name: it.name || "Interior Work Item",
          category: it.category || pkg.category || "General Interior Works",
          description: it.description || "",
          subpoints: [...(it.subpoints || [])],
          unit: it.unit || "Nos.",
          quantity: qty,
          unitPrice: price,
          amount: amount,
          discountType: "percentage",
          discountValue: 0,
          discountAmount: 0,
          total: amount,
          notes: it.notes || ""
        };

        this.activeQuotation.items.push(newItem);
        count++;
      });
    } else if (pkg.itemIds && Array.isArray(pkg.itemIds)) {
      pkg.itemIds.forEach(itemId => {
        const catItem = catalogue.find(c => c.id === itemId);
        if (catItem) {
          this.addItemFromCatalogue(catItem);
          count++;
        }
      });
    }

    this.renderItemsList();
    this.recalculateAll();
    this.markDirty();

    document.getElementById("roomPackagesModal")?.classList.remove("active");
    this.showToast(`Inserted ${count} items from "${pkg.name}" into quotation!`, "success");
  }

  saveCurrentQuoteAsPackage() {
    if (!this.activeQuotation || !this.activeQuotation.items || this.activeQuotation.items.length === 0) {
      alert("There are no items in the active quotation to save as a package. Add some interior items first!");
      return;
    }

    const defaultName = (this.activeQuotation.client?.projectName || "Custom Room") + " Package";
    const name = prompt("Enter a name for this new Room Package:", defaultName);
    if (!name || !name.trim()) return;

    const items = this.activeQuotation.items.map(it => ({
      name: it.name,
      category: it.category || "General Interior Works",
      unit: it.unit || "Nos.",
      quantity: it.quantity || 1,
      unitPrice: it.unitPrice || 0,
      description: it.description || "",
      subpoints: [...(it.subpoints || [])],
      notes: it.notes || ""
    }));

    const newPkg = {
      id: "pkg-custom-" + Date.now(),
      name: name.trim(),
      category: this.activeQuotation.items[0]?.category || "General Interior Works",
      description: `Custom package saved from quotation ${this.activeQuotation.quotationNumber} with ${items.length} turnkey interior items.`,
      isBuiltIn: false,
      items: items
    };

    storage.addPackage(newPkg);
    this.renderRoomPackagesList();
    this.showToast(`Saved "${newPkg.name}" (${items.length} items) as custom Room Package!`, "success");
  }

  openNewRoomPackageModal(existingPkg = null) {
    const editIdInput = document.getElementById("pkgEditId");
    const nameInput = document.getElementById("pkgName");
    const catSelect = document.getElementById("pkgCategory");
    const descInput = document.getElementById("pkgDescription");
    const titleEl = document.getElementById("roomPackageModalTitle");
    const tbody = document.getElementById("pkgItemsTableBody");

    if (existingPkg) {
      if (editIdInput) editIdInput.value = existingPkg.id;
      if (nameInput) nameInput.value = existingPkg.name;
      if (catSelect) catSelect.value = existingPkg.category || "General Interior Works";
      if (descInput) descInput.value = existingPkg.description || "";
      if (titleEl) titleEl.innerHTML = `<i class="fas fa-edit" style="color:var(--color-gold);"></i> Edit Room Package`;
      
      // Populate items
      if (tbody) {
        tbody.innerHTML = "";
        const catalogue = storage.getCatalogue();
        let items = [];
        if (existingPkg.items && Array.isArray(existingPkg.items)) {
          items = existingPkg.items;
        } else if (existingPkg.itemIds && Array.isArray(existingPkg.itemIds)) {
          items = existingPkg.itemIds.map(id => catalogue.find(c => c.id === id)).filter(Boolean);
        }
        items.forEach(it => this.addBlankPackageItemRow(it));
      }
    } else {
      if (editIdInput) editIdInput.value = "";
      if (nameInput) nameInput.value = "";
      if (catSelect) catSelect.value = "Living Room";
      if (descInput) descInput.value = "";
      if (titleEl) titleEl.innerHTML = `<i class="fas fa-boxes" style="color:var(--color-gold);"></i> Create Custom Room Package`;
      if (tbody) {
        tbody.innerHTML = "";
        this.addBlankPackageItemRow();
      }
    }

    this.recalculatePackageFormTotal();
    document.getElementById("roomPackageModal")?.classList.add("active");
  }

  openEditRoomPackage(pkgId) {
    const pkgs = storage.getPackages();
    const pkg = pkgs.find(p => p.id === pkgId);
    if (pkg) {
      this.openNewRoomPackageModal(pkg);
    }
  }

  closeRoomPackageModal() {
    document.getElementById("roomPackageModal")?.classList.remove("active");
  }

  addBlankPackageItemRow(item = null) {
    const tbody = document.getElementById("pkgItemsTableBody");
    if (!tbody) return;

    const rowIdx = tbody.children.length;
    const name = item ? (item.name || "") : "";
    const category = item ? (item.category || "Living Room") : "Living Room";
    const unit = item ? (item.unit || "Nos.") : "Nos.";
    const qty = item ? (item.quantity || 1) : 1;
    const price = item ? (item.unitPrice || item.indicativePrice || 0) : 0;
    const total = qty * price;
    const subpointsStr = item && item.subpoints ? item.subpoints.join(" | ") : "";
    const notes = item ? (item.notes || "") : "";

    const tr = document.createElement("tr");
    tr.className = "pkg-form-item-row";
    tr.innerHTML = `
      <td>
        <input type="text" class="form-control pkg-item-name" placeholder="Item name..." value="${this.escapeHtml(name)}" style="font-weight:600; margin-bottom:4px;">
        <div style="display:flex; gap:4px;">
          <input type="text" class="form-control pkg-item-cat" placeholder="Category" value="${this.escapeHtml(category)}" style="font-size:0.75rem;">
          <input type="text" class="form-control pkg-item-notes" placeholder="Notes / finish" value="${this.escapeHtml(notes)}" style="font-size:0.75rem;">
        </div>
        <input type="hidden" class="pkg-item-subpoints" value="${this.escapeHtml(subpointsStr)}">
      </td>
      <td>
        <select class="form-control pkg-item-unit" style="font-size:0.8rem;">
          <option value="Nos." ${unit === 'Nos.' ? 'selected' : ''}>Nos.</option>
          <option value="Sq. ft." ${unit === 'Sq. ft.' ? 'selected' : ''}>Sq. ft.</option>
          <option value="Running ft." ${unit === 'Running ft.' ? 'selected' : ''}>Running ft.</option>
          <option value="Lot" ${unit === 'Lot' ? 'selected' : ''}>Lot</option>
          <option value="Job" ${unit === 'Job' ? 'selected' : ''}>Job</option>
          <option value="Set" ${unit === 'Set' ? 'selected' : ''}>Set</option>
        </select>
      </td>
      <td>
        <input type="number" class="form-control pkg-item-qty" min="0.01" step="any" value="${qty}" style="text-align:right;" oninput="app.recalculatePackageFormTotal()">
      </td>
      <td>
        <input type="number" class="form-control pkg-item-price" min="0" step="any" value="${price}" style="text-align:right;" oninput="app.recalculatePackageFormTotal()">
      </td>
      <td style="text-align:right; font-weight:600; color:var(--color-primary);" class="pkg-item-line-total">
        ₹ ${this.formatIndianCurrency(total)}
      </td>
      <td style="text-align:center;">
        <button type="button" class="btn btn-icon-only" style="color:var(--color-danger);" onclick="this.closest('tr').remove(); app.recalculatePackageFormTotal();"><i class="fas fa-trash"></i></button>
      </td>
    `;

    tbody.appendChild(tr);
    this.recalculatePackageFormTotal();
  }

  addPackageItemFromCataloguePicker() {
    const list = storage.getCatalogue();
    const itemNames = list.map((c, i) => `${i + 1}. ${c.name} (${c.category} - ₹${c.indicativePrice}/${c.unit})`).join("\n");
    const pick = prompt(`Select an item number from the catalogue to add into this package (1 to ${list.length}):\n\n${itemNames.substring(0, 1000)}...`);
    
    if (pick) {
      const num = parseInt(pick, 10);
      if (!isNaN(num) && num >= 1 && num <= list.length) {
        const selected = list[num - 1];
        this.addBlankPackageItemRow({
          name: selected.name,
          category: selected.category,
          unit: selected.unit,
          quantity: 1,
          unitPrice: selected.indicativePrice,
          subpoints: selected.subpoints,
          notes: selected.notes || ""
        });
        this.showToast(`Added ${selected.name} to package builder!`, "success");
      }
    }
  }

  recalculatePackageFormTotal() {
    const tbody = document.getElementById("pkgItemsTableBody");
    const countEl = document.getElementById("pkgItemCount");
    const totalEl = document.getElementById("pkgEstimatedTotal");
    if (!tbody) return;

    const rows = tbody.querySelectorAll(".pkg-form-item-row");
    let total = 0;

    rows.forEach(r => {
      const qty = parseFloat(r.querySelector(".pkg-item-qty")?.value) || 0;
      const price = parseFloat(r.querySelector(".pkg-item-price")?.value) || 0;
      const lineTotal = qty * price;
      total += lineTotal;

      const lineTotalEl = r.querySelector(".pkg-item-line-total");
      if (lineTotalEl) lineTotalEl.textContent = `₹ ${this.formatIndianCurrency(lineTotal)}`;
    });

    if (countEl) countEl.textContent = rows.length;
    if (totalEl) totalEl.textContent = `₹ ${this.formatIndianCurrency(total)}`;
  }

  saveRoomPackageForm() {
    const editId = document.getElementById("pkgEditId")?.value;
    const name = document.getElementById("pkgName")?.value;
    const category = document.getElementById("pkgCategory")?.value;
    const description = document.getElementById("pkgDescription")?.value;
    const tbody = document.getElementById("pkgItemsTableBody");

    if (!name || !name.trim()) {
      alert("Please provide a Package Name.");
      document.getElementById("pkgName")?.focus();
      return;
    }

    const rows = tbody ? tbody.querySelectorAll(".pkg-form-item-row") : [];
    if (rows.length === 0) {
      alert("Please add at least one item to the package.");
      return;
    }

    const items = [];
    rows.forEach(r => {
      const itemName = r.querySelector(".pkg-item-name")?.value.trim();
      if (!itemName) return;

      const itemCat = r.querySelector(".pkg-item-cat")?.value.trim() || category;
      const unit = r.querySelector(".pkg-item-unit")?.value || "Nos.";
      const qty = parseFloat(r.querySelector(".pkg-item-qty")?.value) || 1;
      const price = parseFloat(r.querySelector(".pkg-item-price")?.value) || 0;
      const notes = r.querySelector(".pkg-item-notes")?.value.trim() || "";
      const subpointsRaw = r.querySelector(".pkg-item-subpoints")?.value || "";
      const subpoints = subpointsRaw ? subpointsRaw.split("|").map(s => s.trim()).filter(Boolean) : [];

      items.push({
        name: itemName,
        category: itemCat,
        unit: unit,
        quantity: qty,
        unitPrice: price,
        subpoints: subpoints,
        notes: notes
      });
    });

    const pkgData = {
      id: editId || ("pkg-custom-" + Date.now()),
      name: name.trim(),
      category: category,
      description: description.trim(),
      isBuiltIn: false,
      items: items
    };

    if (editId) {
      storage.updatePackage(pkgData);
      this.showToast(`Updated "${pkgData.name}" successfully!`, "success");
    } else {
      storage.addPackage(pkgData);
      this.showToast(`Created new room package "${pkgData.name}"!`, "success");
    }

    this.closeRoomPackageModal();
    this.renderRoomPackagesList();
  }

  deleteRoomPackage(pkgId) {
    if (confirm("Delete this custom room package?")) {
      storage.deletePackage(pkgId);
      this.renderRoomPackagesList();
      this.showToast("Room package deleted.", "warning");
    }
  }

  resetPackagesConfirm() {
    if (confirm("Reset room packages back to the 10 built-in luxury packages? Custom packages will be replaced.")) {
      storage.resetPackages();
      this.renderRoomPackagesList();
      this.showToast("Room packages reset to default.", "success");
    }
  }

  // ================= LIVE PREVIEW & MULTI-PAGE ENGINE =================
  generatePreviewSheetsHtml(q, company) {
    const client = q.client || {};
    const pricing = q.pricing || {};
    const items = q.items || [];
    const terms = q.terms || company.termsAndConditions || [];
    const logoSrc = company.logoBase64 || company.logoUrl || (typeof EEI_DEFAULT_LOGO_BASE64 !== "undefined" ? EEI_DEFAULT_LOGO_BASE64 : "assets/logo.png");

    // Helper to estimate vertical pixel footprint of an item row with increased typography
    const estimateItemHeight = (item) => {
      let h = 54;
      if (item.description) {
        h += Math.max(16, Math.ceil(item.description.length / 45) * 15);
      }
      if (item.subpoints && item.subpoints.length > 0) {
        h += 18;
        item.subpoints.forEach(sp => {
          if (sp && sp.trim()) {
            h += Math.max(16, Math.ceil(sp.trim().length / 40) * 15);
          }
        });
      }
      return h;
    };

    // Partition items so each page has comfortable breathing room
    const MAX_INTERMEDIATE_HEIGHT = 620;
    const MAX_LAST_PAGE_HEIGHT = 420;
    const MAX_ITEMS_INTERMEDIATE = 3;
    const MAX_ITEMS_LAST_PAGE = 2;

    const pricingPages = [];
    if (items.length === 0) {
      pricingPages.push([]);
    } else {
      let currentPage = [];
      let currentHeight = 0;

      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        const itemH = estimateItemHeight(item);
        const remainingItems = items.slice(i);
        const remainingHeight = remainingItems.reduce((acc, it) => acc + estimateItemHeight(it), 0);

        // Check if all remaining items can comfortably fit on the final pricing page with summary box
        if (currentPage.length === 0 && remainingItems.length <= MAX_ITEMS_LAST_PAGE && remainingHeight <= MAX_LAST_PAGE_HEIGHT) {
          pricingPages.push(remainingItems);
          currentPage = [];
          break;
        }

        if (currentPage.length > 0 && (currentPage.length >= MAX_ITEMS_INTERMEDIATE || (currentHeight + itemH > MAX_INTERMEDIATE_HEIGHT))) {
          pricingPages.push(currentPage);
          currentPage = [item];
          currentHeight = itemH;
        } else {
          currentPage.push(item);
          currentHeight += itemH;
        }
      }

      if (currentPage.length > 0) {
        pricingPages.push(currentPage);
      }
    }

    const totalPages = 1 + pricingPages.length + 1; // 1 Cover + Pricing pages + 1 Terms

    // -------------------------------------------------------------
    // SHEET 1: LUXURY COVER PAGE
    // -------------------------------------------------------------
    const activeCompName = q.companyName || company.companyName || "ELEVATE EDGE INTERIORS";
    const activeFooterNote = q.footerNote || company.footerNote || "This is a computer-generated document. No physical signature is required.";
    const activeDocHeading = q.documentHeading || "INTERIOR DESIGN & EXECUTION QUOTATION";
    const activeTableHeading = q.tableHeading || "SCOPE OF WORK & PRICING SCHEDULE";
    const activeTermsHeading = q.termsHeading || "TERMS AND CONDITIONS";

    const sheet1Html = `
      <div class="a4-sheet" id="previewCoverPage">
        <div class="a4-sheet-content">
          <div class="doc-header-top">
            <div class="doc-logo-title">
              <img src="${logoSrc}" alt="Elevate Edge Logo" onerror="this.style.display='none'">
              <div>
                <div class="doc-title-h1">${this.escapeHtml(activeCompName)}</div>
                <div class="doc-title-sub">${this.escapeHtml(company.tagline || "LET'S DESIGN YOUR DREAM SPACE TOGETHER.")}</div>
              </div>
            </div>
            <div class="doc-company-contact">
              <div>${this.escapeHtml(company.registeredAddress)}</div>
              <div>Ph: ${this.escapeHtml(company.primaryMobile)} ${company.additionalMobile ? `| ${this.escapeHtml(company.additionalMobile)}` : ""}</div>
              <div>Email: ${this.escapeHtml(company.businessEmail)}</div>
              <div>Website: ${this.escapeHtml(company.website)} | GSTIN: ${this.escapeHtml(company.gstin)}</div>
            </div>
          </div>

          <div class="doc-quotation-hero">
            <h2>${this.escapeHtml(activeDocHeading)}</h2>
            <p>${this.escapeHtml(q.title || "Turnkey Luxury Interior Design & Execution Proposal")}</p>
          </div>

          <div class="doc-meta-strip" style="grid-template-columns: repeat(3, 1fr);">
            <div class="doc-meta-item">
              <strong>Quotation Number</strong>
              <span>${this.escapeHtml(q.quotationNumber)}</span>
            </div>
            <div class="doc-meta-item">
              <strong>Quotation Date</strong>
              <span>${this.escapeHtml(q.quotationDate || "—")}</span>
            </div>
            <div class="doc-meta-item">
              <strong>Valid Until</strong>
              <span>${this.escapeHtml(q.validityDate || "—")}</span>
            </div>
          </div>

          <div class="doc-two-col">
            <div class="doc-info-box">
              <div class="doc-info-box-header">PREPARED FOR (CLIENT)</div>
              <div class="doc-info-box-body">
                <div class="doc-info-row"><span class="label">Client Name:</span><span class="val"><strong>${this.escapeHtml(client.clientName || "—")}</strong></span></div>
                <div class="doc-info-row"><span class="label">Contact:</span><span class="val">${this.escapeHtml(client.contactPerson || client.clientName || "—")}</span></div>
                <div class="doc-info-row"><span class="label">Mobile:</span><span class="val">${this.escapeHtml(client.mobileNumber || "—")}</span></div>
                <div class="doc-info-row"><span class="label">Email:</span><span class="val">${this.escapeHtml(client.email || "—")}</span></div>
                <div class="doc-info-row"><span class="label">Billing Address:</span><span class="val">${this.escapeHtml(client.billingAddress || "—")}</span></div>
              </div>
            </div>

            <div class="doc-info-box">
              <div class="doc-info-box-header">PROJECT & SITE DETAILS</div>
              <div class="doc-info-box-body">
                <div class="doc-info-row"><span class="label">Project Name:</span><span class="val"><strong>${this.escapeHtml(client.projectName || "—")}</strong></span></div>
                <div class="doc-info-row"><span class="label">Location:</span><span class="val">${this.escapeHtml(client.projectLocation || "—")}</span></div>
                <div class="doc-info-row"><span class="label">Site Address:</span><span class="val">${this.escapeHtml(client.projectSiteAddress || client.billingAddress || "—")}</span></div>
                <div class="doc-info-row"><span class="label">Prepared By:</span><span class="val">${this.escapeHtml(q.createdBy || company.defaultCreator || "—")}</span></div>
                <div class="doc-info-row"><span class="label">Approved By:</span><span class="val">${this.escapeHtml(q.approvedBy || company.defaultApprover || "—")}</span></div>
              </div>
            </div>
          </div>

          <div class="doc-overview-box">
            <h4>Executive Project Overview</h4>
            <p>${this.escapeHtml(q.projectDescription || "Elevate Edge Interiors is pleased to present this comprehensive interior design proposal. Our bespoke woodwork, moisture-resistant carcasses, and turnkey craftsmanship ensure an unmatched standard of luxury and durability.")}</p>
          </div>

          ${q.showPillars !== false && (q.specificationPillars || []).length > 0 ? `
            <div style="display:grid; grid-template-columns:repeat(${(q.specificationPillars || []).length}, 1fr); gap:8px; margin-top:10px;">
              ${(q.specificationPillars || []).map(p => `
                <div style="background:#FAFBFB; border:1px solid #DCE3DF; border-radius:3px; overflow:hidden;">
                  <div style="background:var(--color-primary); color:#FFF; font-size:7.5px; font-weight:700; text-align:center; padding:3px 4px; text-transform:uppercase;">
                    ${this.escapeHtml(p.title)}
                  </div>
                  <div style="padding:5px 6px;">
                    <div style="font-size:7px; font-weight:700; color:var(--color-gold); margin-bottom:2px;">${this.escapeHtml(p.sub || '')}</div>
                    <div style="font-size:6.8px; color:#555; line-height:1.35;">${this.escapeHtml(p.desc || '')}</div>
                  </div>
                </div>
              `).join("")}
            </div>
          ` : ""}

          ${q.showSignatoryBlock !== false ? `
            <div class="doc-two-col" style="margin-top:10px; margin-bottom:0;">
              <!-- Left Signatory Box -->
              <div style="background:#FAFBFB; border:1px solid #DCE3DF; border-radius:3px; padding:7px 9px; font-size:7.5px;">
                <div style="font-weight:700; color:var(--color-primary); margin-bottom:3px;">
                  ${this.escapeHtml(q.signatoryBox?.title || "FOR ELEVATE EDGE INTERIORS")}
                </div>
                <div style="color:#444; font-weight:600;">
                  ${this.escapeHtml(q.signatoryBox?.name || q.authorizedRepresentative || "Managing Partner & Principal Designer")}
                </div>
                <div style="color:#777; font-size:7px; margin-top:1px;">
                  ${this.escapeHtml(q.signatoryBox?.subtitle || "Official Authorized Signatory | Hyderabad")}
                </div>
                <div style="margin-top:5px; font-size:7px; color:#333;">
                  ${this.escapeHtml(q.signatoryBox?.signatureLine || "Signature & Seal: ________________________")}
                </div>
              </div>

              <!-- Right Official Issuance Box -->
              <div style="background:#FAFBFB; border:1px solid #DCE3DF; border-radius:3px; padding:7px 9px; font-size:7.5px;">
                <div style="font-weight:700; color:var(--color-primary); margin-bottom:3px;">
                  ${this.escapeHtml(q.issuanceBox?.title || "OFFICIAL ISSUANCE & VERIFICATION")}
                </div>
                <div style="color:#444; font-size:7px;">
                  ${this.escapeHtml((q.issuanceBox?.refText || "Issuance Reference: {Quotation Number}").replace("{Quotation Number}", q.quotationNumber))}
                </div>
                <div style="color:#444; font-size:7px; margin-top:1px;">
                  ${this.escapeHtml((q.issuanceBox?.scopeText || "Scope Verified: {Item Count} Custom Interior Work Items").replace("{Item Count}", items.length))}
                </div>
                <div style="color:#777; font-size:7px; font-style:italic; margin-top:4px;">
                  ${this.escapeHtml(q.issuanceBox?.validityText || "Turnkey Proposal Valid for 30 Days from Issuance")}
                </div>
              </div>
            </div>
          ` : ""}
        </div>

        <div class="doc-footer">
          <div>${this.escapeHtml(activeCompName)} | Ph: ${this.escapeHtml(company.primaryMobile)} | Email: ${this.escapeHtml(company.businessEmail)} | Quotation: ${this.escapeHtml(q.quotationNumber)}</div>
          <div>${this.escapeHtml(activeFooterNote)} | Page 1 of ${totalPages}</div>
        </div>
      </div>
    `;

    // -------------------------------------------------------------
    // SHEET 2..N: DETAILED SCOPE & PRICING SCHEDULE SHEETS (6 CLEAN COLUMNS)
    // -------------------------------------------------------------
    let globalItemIndex = 0;
    const pricingSheetsHtml = pricingPages.map((pageItems, pageIdx) => {
      const pageNumber = 2 + pageIdx;
      const isLastPricingPage = pageIdx === pricingPages.length - 1;

      const rowsHtml = pageItems.map(item => {
        globalItemIndex++;
        const sNo = globalItemIndex;

        return `
          <tr>
            <td style="text-align:center; font-weight:600;">${sNo}</td>
            <td>
              <div class="doc-item-title">${this.escapeHtml(item.name)}</div>
              ${item.category ? `<span style="font-size:8.5px; color:#666; font-style:italic;">[${this.escapeHtml(item.category)}]</span>` : ""}
              ${item.description ? `<div class="doc-item-desc">${this.escapeHtml(item.description)}</div>` : ""}
              ${item.subpoints && item.subpoints.length > 0 ? `
                <div style="font-size:8.5px; font-weight:700; color:var(--color-primary); margin-top:3px;">Key Specifications:</div>
                <ul class="doc-subpoints-list">
                  ${item.subpoints.filter(sp => sp && sp.trim()).map(sp => `<li>${this.escapeHtml(sp.trim())}</li>`).join("")}
                </ul>
              ` : ""}
              ${item.notes && item.notes.trim() ? `
                <div style="font-size:8.5px; color:#666; font-style:italic; margin-top:3px; line-height:1.3;">
                  <strong style="color:var(--color-primary); font-style:normal;">Note:</strong> ${this.escapeHtml(item.notes.replace(/^Note:\s*/i, ''))}
                </div>
              ` : ""}
            </td>
            <td style="text-align:center;">${this.escapeHtml(item.unit || "Nos.")}</td>
            <td style="text-align:right;">${item.quantity}</td>
            <td style="text-align:right;" class="currency-cell">₹ ${this.formatIndianCurrency(item.unitPrice)}</td>
            <td style="text-align:right;">
              <div class="currency-cell" style="font-weight:700; color:var(--color-primary);">₹ ${this.formatIndianCurrency(item.total)}</div>
              ${item.discountAmount > 0 ? `
                <div style="font-size:7.5px; color:#A00; font-weight:600; margin-top:1px;">(Incl. ₹${this.formatIndianCurrency(item.discountAmount)} disc)</div>
              ` : ""}
            </td>
          </tr>
        `;
      }).join("");

      return `
        <div class="a4-sheet" id="previewPricingPage_${pageIdx + 1}">
          <div class="a4-sheet-content">
            <!-- Running Header on Every Page -->
            <div class="doc-running-header">
              <div class="running-header-left">
                <img src="${logoSrc}" class="running-logo" alt="Elevate Edge Logo" onerror="this.style.display='none'">
                <div>
                  <div class="running-title">${this.escapeHtml(activeCompName)}</div>
                  <div class="running-subtitle">${this.escapeHtml(activeTableHeading)}</div>
                </div>
              </div>
              <div class="running-header-right">
                <div>Quotation: <strong>${this.escapeHtml(q.quotationNumber)}</strong></div>
                <div>Date: <strong>${this.escapeHtml(q.quotationDate || "—")}</strong> | Client: <strong>${this.escapeHtml(client.clientName || "—")}</strong></div>
              </div>
            </div>

            <!-- Pricing Table (6 Clean Columns) -->
            <table class="doc-table">
              <thead>
                <tr>
                  <th style="width:42px; text-align:center;">S.No.</th>
                  <th>Item and Specifications</th>
                  <th style="width:65px; text-align:center;">Unit</th>
                  <th style="width:45px; text-align:right;">Qty</th>
                  <th style="width:110px; text-align:right;">Unit Price (₹)</th>
                  <th style="width:125px; text-align:right;">Total (₹)</th>
                </tr>
              </thead>
              <tbody>
                ${rowsHtml}
              </tbody>
            </table>

            ${isLastPricingPage ? `
              <!-- Financial Summary Box -->
              <div style="display:flex; justify-content:flex-end; margin-top:10px;">
                <div style="width:330px; background:#F8FAF8; border:1px solid #DCE3DF; border-radius:4px; padding:10px 12px; font-size:9.5px; letter-spacing:normal;">
                  ${(pricing.totalItemDiscounts > 0 || pricing.overallDiscountAmount > 0) ? `
                    <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
                      <span>Total Amount Before Discounts:</span>
                      <strong class="currency-cell">₹ ${this.formatIndianCurrency(pricing.totalBeforeDiscounts || 0)}</strong>
                    </div>
                    ${pricing.totalItemDiscounts > 0 ? `
                      <div style="display:flex; justify-content:space-between; margin-bottom:4px; color:#A00;">
                        <span>Item-Level Discounts:</span>
                        <span class="currency-cell">- ₹ ${this.formatIndianCurrency(pricing.totalItemDiscounts)}</span>
                      </div>
                    ` : ""}
                    ${pricing.overallDiscountAmount > 0 ? `
                      <div style="display:flex; justify-content:space-between; margin-bottom:4px; color:#A00;">
                        <span>Overall Discount (${pricing.overallDiscountValue || 0}%):</span>
                        <strong class="currency-cell">- ₹ ${this.formatIndianCurrency(pricing.overallDiscountAmount)}</strong>
                      </div>
                    ` : ""}
                    <div style="display:flex; justify-content:space-between; margin-bottom:4px; border-top:1px dashed #CCC; padding-top:4px;">
                      <span>Subtotal After Discounts:</span>
                      <strong class="currency-cell">₹ ${this.formatIndianCurrency(pricing.subtotalAfterDiscounts || 0)}</strong>
                    </div>
                  ` : `
                    <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
                      <span>Total Amount (Subtotal):</span>
                      <strong class="currency-cell">₹ ${this.formatIndianCurrency(pricing.subtotalAfterDiscounts || pricing.totalBeforeDiscounts || 0)}</strong>
                    </div>
                  `}
                  ${pricing.taxEnabled && pricing.taxAmount > 0 ? `
                    <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
                      <span>Applicable Taxes (${pricing.taxRate || 18}% GST):</span>
                      <span class="currency-cell">+ ₹ ${this.formatIndianCurrency(pricing.taxAmount)}</span>
                    </div>
                  ` : ""}
                  ${pricing.totalAdditionalCharges > 0 ? `
                    <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
                      <span>Additional Charges:</span>
                      <span class="currency-cell">+ ₹ ${this.formatIndianCurrency(pricing.totalAdditionalCharges)}</span>
                    </div>
                  ` : ""}
                  <div style="display:flex; justify-content:space-between; background:var(--color-primary); color:#FFF; padding:7px 10px; border-radius:3px; margin-top:6px; font-size:11px;">
                    <span style="font-weight:700;">FINAL GRAND TOTAL:</span>
                    <span style="font-weight:700; color:var(--color-gold-light);" class="currency-cell">₹ ${this.formatIndianCurrency(pricing.grandTotal || 0)}</span>
                  </div>
                </div>
              </div>

              <div style="margin-top:8px; font-size:9.5px; letter-spacing:normal;">
                <strong>Amount in Words:</strong> <em>${this.escapeHtml(pricing.grandTotalInWords || "")}</em>
              </div>
            ` : ""}
          </div>

          <div class="doc-footer">
            <div>${this.escapeHtml(activeCompName)} | Ph: ${this.escapeHtml(company.primaryMobile)} | Email: ${this.escapeHtml(company.businessEmail)} | Quotation: ${this.escapeHtml(q.quotationNumber)}</div>
            <div>${this.escapeHtml(activeFooterNote)} | Page ${pageNumber} of ${totalPages}</div>
          </div>
        </div>
      `;
    }).join("");

    // -------------------------------------------------------------
    // SHEET FINAL: TERMS & CONDITIONS & SIGN-OFF
    // -------------------------------------------------------------
    const termsHtml = terms.map((t, idx) => `
      <div class="term-item">
        <strong>${idx + 1}. ${this.escapeHtml(t.title)}:</strong>
        <span>${this.escapeHtml(t.text)}</span>
      </div>
    `).join("");

    const activeSchedule = q.paymentSchedule || company.defaultPaymentSchedule || [];
    const milestonesHtml = activeSchedule.map(ms => `
      <tr>
        <td style="padding:4px 6px; font-weight:600; border:1px solid #DCE3DF;">${this.escapeHtml(ms.milestone)}</td>
        <td style="padding:4px 6px; text-align:center; font-weight:700; color:var(--color-primary); border:1px solid #DCE3DF;">${ms.percentage}%</td>
        <td style="padding:4px 6px; border:1px solid #DCE3DF;">${this.escapeHtml(ms.notes)}</td>
      </tr>
    `).join("");

    const finalSheetHtml = `
      <div class="a4-sheet" id="previewTermsPage">
        <div class="a4-sheet-content">
          <!-- Running Header on Terms Page -->
          <div class="doc-running-header">
            <div class="running-header-left">
              <img src="${logoSrc}" class="running-logo" alt="Elevate Edge Logo" onerror="this.style.display='none'">
              <div>
                <div class="running-title">${this.escapeHtml(activeCompName)}</div>
                <div class="running-subtitle">${this.escapeHtml(activeTermsHeading)}</div>
              </div>
            </div>
            <div class="running-header-right">
              <div>Quotation: <strong>${this.escapeHtml(q.quotationNumber)}</strong></div>
              <div>Date: <strong>${this.escapeHtml(q.quotationDate || "—")}</strong> | Client: <strong>${this.escapeHtml(client.clientName || "—")}</strong></div>
            </div>
          </div>

          <h3 style="font-family:var(--font-serif); font-size:12px; color:var(--color-primary); margin-bottom:8px; border-bottom:2px solid var(--color-gold); padding-bottom:4px; display:inline-block;">
            ${this.escapeHtml(activeTermsHeading)}
          </h3>

          <!-- Compact 2-Column Terms Layout to Fit All Clauses -->
          <div class="terms-grid-2col">
            ${termsHtml}
          </div>

          <h4 style="font-size:10px; font-weight:700; color:var(--color-primary); margin-bottom:5px;">
            Project Payment Schedule
          </h4>
          <table style="width:100%; border-collapse:collapse; font-size:8.5px; margin-bottom:12px;">
            <thead>
              <tr style="background:var(--color-primary); color:#FFF;">
                <th style="padding:4px 6px; text-align:left;">Milestone Stage</th>
                <th style="width:70px; padding:4px 6px; text-align:center;">Share (%)</th>
                <th style="padding:4px 6px; text-align:left;">Trigger & Description</th>
              </tr>
            </thead>
            <tbody>
              ${milestonesHtml}
            </tbody>
          </table>

          <!-- Sign-Off Box -->
          <div class="doc-two-col" style="margin-top:10px;">
            <div style="border:1px solid #DCE3DF; border-radius:4px; padding:10px 12px; font-size:9px; min-height:80px; display:flex; flex-direction:column; justify-content:space-between;">
              <div><strong>${this.escapeHtml(q.signatoryBox?.title || "FOR ELEVATE EDGE INTERIORS")}</strong></div>
              <div>
                <div style="font-weight:600;">${this.escapeHtml(q.signatoryBox?.name || q.authorizedRepresentative || company.authorizedRepresentative || "Managing Partner & Principal Designer")}</div>
                <div style="color:#777; font-size:8px;">${this.escapeHtml(q.signatoryBox?.subtitle || "Official Authorized Signatory | Hyderabad")}</div>
              </div>
            </div>

            <div style="border:1px solid #DCE3DF; border-radius:4px; padding:10px 12px; font-size:9px; min-height:80px; display:flex; flex-direction:column; justify-content:space-between;">
              <div><strong>CLIENT ACCEPTANCE & SIGN-OFF</strong></div>
              <div style="font-size:8px; color:#555;">I confirm acceptance of this quotation and standard terms.</div>
              <div style="border-top:1px dashed #AAA; padding-top:4px; display:flex; justify-content:space-between; font-size:8.5px;">
                <span>Signature: __________________</span>
                <span>Date: ____________</span>
              </div>
            </div>
          </div>
        </div>

        <div class="doc-footer">
          <div>${this.escapeHtml(activeCompName)} | Ph: ${this.escapeHtml(company.primaryMobile)} | Email: ${this.escapeHtml(company.businessEmail)} | Quotation: ${this.escapeHtml(q.quotationNumber)}</div>
          <div>${this.escapeHtml(activeFooterNote)} | Page ${totalPages} of ${totalPages}</div>
        </div>
      </div>
    `;

    return sheet1Html + pricingSheetsHtml + finalSheetHtml;
  }

  openLivePreviewModal() {
    if (!this.activeQuotation) return;
    this.syncEditorFormToQuotation();
    this.recalculateAll();

    const previewContainer = document.getElementById("previewSheetsContainer");
    if (!previewContainer) return;

    const company = this.activeQuotation.companySnapshot || storage.getSettings();
    previewContainer.innerHTML = this.generatePreviewSheetsHtml(this.activeQuotation, company);
    document.getElementById("livePreviewModal").classList.add("active");
  }

  previewQuotationById(id) {
    this.editQuotation(id);
    this.openLivePreviewModal();
  }

  // ================= EXPORTS =================
  async exportQuotationPdf() {
    if (!this.activeQuotation) {
      const all = storage.getQuotations();
      if (all && all.length > 0) {
        this.activeQuotation = all[0];
      } else {
        this.showToast("No active quotation to export.", "error");
        return;
      }
    }

    if (this._isExportingPdf) return;
    this._isExportingPdf = true;

    try {
      this.syncEditorFormToQuotation();
      this.recalculateAll();

      // Soft non-blocking check
      const validation = this.validateQuotationForExport(this.activeQuotation);
      if (!validation.isValid) {
        console.warn("Quotation export validation notes:", validation.errors);
      }

      this.showToast("Generating luxury vector PDF...", "info");
      const settings = storage.getSettings();
      const res = await pdfExporter.generateJsPdf(this.activeQuotation, settings);
      this.showToast("PDF exported successfully!", "success");
      return res;
    } catch (e) {
      console.error("PDF export failed:", e);
      this.showToast("Failed to generate PDF: " + (e.message || e), "error");
    } finally {
      this._isExportingPdf = false;
    }
  }

  async exportQuotationDocx() {
    if (!this.activeQuotation) return;
    this.syncEditorFormToQuotation();
    this.recalculateAll();

    const validation = this.validateQuotationForExport(this.activeQuotation);
    if (!validation.isValid) {
      if (!confirm(`Validation Notice:\n\n${validation.errors.join("\n")}\n\nDo you still wish to proceed with DOCX export?`)) {
        return;
      }
    }

    try {
      this.showToast("Generating Microsoft Word (.docx) document...", "info");
      const settings = storage.getSettings();
      await docxExporter.generateDocx(this.activeQuotation, settings);
      this.showToast("Word document (.docx) exported successfully!", "success");
    } catch (e) {
      console.error("DOCX export error:", e);
      this.showToast("Failed to generate DOCX: " + e.message, "error");
    }
  }

  async quickPdf(id) {
    const quote = storage.getQuotationById(id);
    if (!quote) return;
    try {
      this.showToast("Generating luxury vector PDF...", "info");
      const settings = storage.getSettings();
      await pdfExporter.generateJsPdf(quote, settings);
      this.showToast("PDF exported successfully!", "success");
    } catch (e) {
      console.error("Quick PDF export error:", e);
      this.showToast("Failed to generate PDF: " + e.message, "error");
    }
  }

  quickDocx(id) {
    const quote = storage.getQuotationById(id);
    if (quote) {
      const settings = storage.getSettings();
      docxExporter.generateDocx(quote, settings);
    }
  }

  exportRegisterCSV() {
    try {
      const csv = storage.exportQuotationsCSV();
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const filename = `EEI_Quotation_Register_${new Date().toISOString().split("T")[0]}.csv`;
      
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      this.showToast("Quotation register CSV exported!", "success");
    } catch (e) {
      this.showToast("Failed to export register: " + e.message, "error");
    }
  }

  // ================= VALIDATION ENGINE (SECTION 18) =================
  validateQuotationForExport(q) {
    const errors = [];
    const client = q.client || {};

    if (!client.clientName || !client.clientName.trim()) {
      errors.push("• Client Name is missing.");
    }
    if (!client.mobileNumber || !client.mobileNumber.trim()) {
      errors.push("• Client Mobile Number is missing.");
    }
    if (!q.items || q.items.length === 0) {
      errors.push("• Quotation has no line items added.");
    }

    // Check line items for zero prices or empty names
    (q.items || []).forEach((item, idx) => {
      if (!item.name || !item.name.trim()) {
        errors.push(`• Item #${idx + 1} is missing a name.`);
      }
      if (item.quantity <= 0) {
        errors.push(`• Item #${idx + 1} (${item.name || "Item"}) has zero or negative quantity.`);
      }
    });

    return {
      isValid: errors.length === 0,
      errors: errors
    };
  }

  // ================= COMPANY SETTINGS MODAL =================
  openSettingsModal() {
    const s = storage.getSettings();
    document.getElementById("settingsCompanyName").value = s.companyName || "";
    document.getElementById("settingsTagline").value = s.tagline || "";
    document.getElementById("settingsAddress").value = s.registeredAddress || "";
    document.getElementById("settingsPrimaryMobile").value = s.primaryMobile || "";
    document.getElementById("settingsAdditionalMobile").value = s.additionalMobile || "";
    document.getElementById("settingsEmail").value = s.businessEmail || "";
    document.getElementById("settingsWebsite").value = s.website || "";
    document.getElementById("settingsGstin").value = s.gstin || "";
    document.getElementById("settingsValidityDays").value = s.validityDays || 30;
    document.getElementById("settingsAuthorizedRep").value = s.authorizedRepresentative || "";
    document.getElementById("settingsDefaultCreator").value = s.defaultCreator || "";
    document.getElementById("settingsDefaultApprover").value = s.defaultApprover || "";
    document.getElementById("settingsFooterNote").value = s.footerNote || "";

    const logoPreview = document.getElementById("settingsLogoPreview");
    if (logoPreview) {
      logoPreview.src = s.logoUrl || "assets/logo.png";
    }

    document.getElementById("companySettingsModal").classList.add("active");
  }

  saveCompanySettings() {
    const s = storage.getSettings();
    s.companyName = document.getElementById("settingsCompanyName").value.trim();
    s.tagline = document.getElementById("settingsTagline").value.trim();
    s.registeredAddress = document.getElementById("settingsAddress").value.trim();
    s.primaryMobile = document.getElementById("settingsPrimaryMobile").value.trim();
    s.additionalMobile = document.getElementById("settingsAdditionalMobile").value.trim();
    s.businessEmail = document.getElementById("settingsEmail").value.trim();
    s.website = document.getElementById("settingsWebsite").value.trim();
    s.gstin = document.getElementById("settingsGstin").value.trim();
    s.validityDays = parseInt(document.getElementById("settingsValidityDays").value, 10) || 30;
    s.authorizedRepresentative = document.getElementById("settingsAuthorizedRep").value.trim();
    s.defaultCreator = document.getElementById("settingsDefaultCreator").value.trim();
    s.defaultApprover = document.getElementById("settingsDefaultApprover").value.trim();
    s.footerNote = document.getElementById("settingsFooterNote").value.trim();

    storage.saveSettings(s);
    this.populateCompanyBranding();
    document.getElementById("companySettingsModal")?.classList.remove("active");
    this.showToast("Company settings updated successfully!", "success");
  }

  handleLogoUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target.result;
      const s = storage.getSettings();
      s.logoUrl = base64;
      s.logoBase64 = base64;
      storage.saveSettings(s);

      const logoPreview = document.getElementById("settingsLogoPreview");
      if (logoPreview) logoPreview.src = base64;
      const headerLogo = document.getElementById("headerCompanyLogo");
      if (headerLogo) headerLogo.src = base64;

      this.showToast("Official company logo updated!", "success");
    };
    reader.readAsDataURL(file);
  }

  // ================= CATALOGUE MANAGER MODAL (SECTION 7) =================
  openCatalogueModal() {
    this.renderCatalogueManagerTable();
    document.getElementById("catalogueManagerModal").classList.add("active");
  }

  renderCatalogueManagerTable(search = "", catFilter = "All Categories") {
    const list = storage.getCatalogue();
    const tbody = document.getElementById("catalogueManagerTbody");
    if (!tbody) return;

    let filtered = list;
    if (catFilter && catFilter !== "All Categories") {
      filtered = filtered.filter(i => i.category === catFilter);
    }
    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      filtered = filtered.filter(i => 
        (i.name || "").toLowerCase().includes(q) || 
        (i.category || "").toLowerCase().includes(q) ||
        (i.description || "").toLowerCase().includes(q)
      );
    }

    tbody.innerHTML = filtered.map((item, idx) => `
      <tr>
        <td>
          <strong>${this.escapeHtml(item.name)}</strong>
          ${item.notes ? `<div style="font-size:0.75rem; color:#888; font-style:italic;">Note: ${this.escapeHtml(item.notes)}</div>` : ''}
        </td>
        <td><span class="revision-badge-pill">${item.category}</span></td>
        <td>${item.unit || "Nos."}</td>
        <td style="text-align:right; font-weight:600; color:var(--color-primary);">₹ ${this.formatIndianCurrency(item.indicativePrice || 0)}</td>
        <td style="font-size:0.75rem; color:#666;">${(item.subpoints || []).length} specs</td>
        <td style="text-align:right; white-space:nowrap;">
          <button class="btn btn-sm btn-gold" style="padding:0.2rem 0.5rem; font-size:0.75rem;" title="Add to Active Quotation" onclick="app.addItemFromCatalogueById('${item.id}')">
            <i class="fas fa-plus"></i> Add
          </button>
          <button class="btn btn-sm btn-outline" style="padding:0.2rem 0.4rem; font-size:0.75rem;" title="Edit Full Item" onclick="app.openEditCatalogueItem('${item.id}')">
            <i class="fas fa-edit"></i>
          </button>
          <button class="btn btn-sm btn-danger-outline" style="padding:0.2rem 0.4rem; font-size:0.75rem;" title="Delete Item" onclick="app.deleteCatalogueItem('${item.id}')">
            <i class="fas fa-trash"></i>
          </button>
        </td>
      </tr>
    `).join("");
  }

  // ================= CATALOGUE ITEM EDIT / CREATE MODAL =================
  openNewCatalogueItemModal(source = "manager", existingItem = null) {
    const editIdInput = document.getElementById("catItemEditId");
    const sourceInput = document.getElementById("catItemSource");
    const nameInput = document.getElementById("catItemName");
    const catSelect = document.getElementById("catItemCategory");
    const unitSelect = document.getElementById("catItemUnit");
    const priceInput = document.getElementById("catItemPrice");
    const notesInput = document.getElementById("catItemNotes");
    const descInput = document.getElementById("catItemDescription");
    const titleEl = document.getElementById("catalogueItemModalTitle");
    const subpointsList = document.getElementById("catItemSubpointsList");

    if (sourceInput) sourceInput.value = source;

    if (existingItem) {
      if (editIdInput) editIdInput.value = existingItem.id;
      if (nameInput) nameInput.value = existingItem.name;
      if (catSelect) catSelect.value = existingItem.category || "General Interior Works";
      if (unitSelect) unitSelect.value = existingItem.unit || "Nos.";
      if (priceInput) priceInput.value = existingItem.indicativePrice || 0;
      if (notesInput) notesInput.value = existingItem.notes || "";
      if (descInput) descInput.value = existingItem.description || "";
      if (titleEl) titleEl.innerHTML = `<i class="fas fa-edit" style="color:var(--color-gold);"></i> Edit Catalogue Item`;

      if (subpointsList) {
        subpointsList.innerHTML = "";
        (existingItem.subpoints || []).forEach(sp => this.addCatItemSubpointInput(sp));
      }
    } else {
      if (editIdInput) editIdInput.value = "";
      if (nameInput) nameInput.value = "";
      if (catSelect) catSelect.value = "Living Room";
      if (unitSelect) unitSelect.value = "Nos.";
      if (priceInput) priceInput.value = "";
      if (notesInput) notesInput.value = "";
      if (descInput) descInput.value = "";
      if (titleEl) titleEl.innerHTML = `<i class="fas fa-cube" style="color:var(--color-gold);"></i> Add New Catalogue Item`;

      if (subpointsList) {
        subpointsList.innerHTML = "";
        this.addCatItemSubpointInput("Marine grade HDHMR / BWP plywood carcass");
        this.addCatItemSubpointInput("Soft-close hardware fittings (Hettich / Hafele)");
      }
    }

    this.updateCatItemSubpointCount();
    document.getElementById("catalogueItemModal")?.classList.add("active");
  }

  openEditCatalogueItem(id) {
    const list = storage.getCatalogue();
    const item = list.find(c => c.id === id);
    if (item) {
      this.openNewCatalogueItemModal("manager", item);
    }
  }

  closeCatalogueItemModal() {
    document.getElementById("catalogueItemModal")?.classList.remove("active");
  }

  addCatItemSubpointInput(val = "") {
    const list = document.getElementById("catItemSubpointsList");
    if (!list) return;

    const li = document.createElement("li");
    li.className = "subpoint-item";
    li.innerHTML = `
      <span class="subpoint-bullet">•</span>
      <input type="text" class="subpoint-input cat-subpoint-val" placeholder="Specification detail..." value="${this.escapeHtml(val)}">
      <button type="button" class="subpoint-btn delete" onclick="this.closest('li').remove(); app.updateCatItemSubpointCount();"><i class="fas fa-times"></i></button>
    `;
    list.appendChild(li);
    this.updateCatItemSubpointCount();
  }

  updateCatItemSubpointCount() {
    const list = document.getElementById("catItemSubpointsList");
    const countEl = document.getElementById("catItemSubpointCount");
    if (list && countEl) {
      countEl.textContent = list.children.length;
    }
  }

  saveCatalogueItemForm() {
    const editId = document.getElementById("catItemEditId")?.value;
    const source = document.getElementById("catItemSource")?.value;
    const name = document.getElementById("catItemName")?.value;
    const category = document.getElementById("catItemCategory")?.value;
    const unit = document.getElementById("catItemUnit")?.value;
    const price = parseFloat(document.getElementById("catItemPrice")?.value) || 0;
    const notes = document.getElementById("catItemNotes")?.value || "";
    const description = document.getElementById("catItemDescription")?.value || "";

    if (!name || !name.trim()) {
      alert("Please provide an Item Name.");
      document.getElementById("catItemName")?.focus();
      return;
    }

    const subpointInputs = document.querySelectorAll("#catItemSubpointsList .cat-subpoint-val");
    const subpoints = Array.from(subpointInputs).map(inp => inp.value.trim()).filter(Boolean);

    const itemData = {
      id: editId || ("cat-custom-" + Date.now()),
      name: name.trim(),
      category: category,
      unit: unit,
      indicativePrice: price,
      notes: notes.trim(),
      description: description.trim(),
      subpoints: subpoints
    };

    if (editId) {
      storage.updateCatalogueItem(itemData);
      this.showToast(`Updated "${itemData.name}" in catalogue!`, "success");
    } else {
      storage.addCatalogueItem(itemData);
      this.showToast(`Added "${itemData.name}" to catalogue!`, "success");
    }

    this.closeCatalogueItemModal();

    if (source === "picker") {
      this.renderCataloguePickerList();
      // Also add directly to quotation
      this.addItemFromCatalogue(itemData);
    } else {
      this.renderCatalogueManagerTable();
    }
  }

  deleteCatalogueItem(id) {
    if (confirm("Delete this item from catalogue?")) {
      storage.deleteCatalogueItem(id);
      this.renderCatalogueManagerTable();
      this.showToast("Catalogue item deleted.", "warning");
    }
  }

  resetCatalogueConfirm() {
    if (confirm("Reset catalogue back to built-in 75+ luxury interior items? Custom items will be replaced.")) {
      storage.resetCatalogue();
      this.renderCatalogueManagerTable();
      this.showToast("Catalogue reset to default items.", "success");
    }
  }

  // ================= BACKUP & RESTORE MODAL =================
  openBackupModal() {
    document.getElementById("backupModal").classList.add("active");
  }

  downloadDatabaseBackup() {
    const jsonStr = storage.exportDatabaseJSON();
    const blob = new Blob([jsonStr], { type: "application/json" });
    const filename = `EEI_Database_Backup_${new Date().toISOString().split("T")[0]}.json`;

    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    this.showToast("Full database backup downloaded!", "success");
  }

  handleRestoreUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const res = storage.importDatabaseJSON(event.target.result);
      if (res.success) {
        document.getElementById("backupModal")?.classList.remove("active");
        this.renderDashboard();
        this.populateCompanyBranding();
        this.showToast(`Database restored successfully! (${res.count} quotations)`, "success");
      } else {
        alert("Restore failed: " + res.error);
      }
    };
    reader.readAsText(file);
  }

  clearSampleDataConfirm() {
    if (confirm("Clear all demonstration sample data? Real quotations will remain safe.")) {
      storage.clearSampleData();
      this.renderDashboard();
      this.showToast("Demonstration sample data cleared.", "success");
    }
  }

  // ================= UTILITIES =================
  formatIndianCurrency(num) {
    if (isNaN(num) || num === null || num === undefined) return "0.00";
    return Number(num).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }

  // Number to Indian Words converter (e.g. 144000 -> Rupees One Lakh Forty-Four Thousand Only)
  numberToIndianWords(n) {
    if (isNaN(n) || n === 0) return "Rupees Zero Only";
    const num = Math.floor(Math.abs(n));

    const ones = [
      "", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine",
      "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen",
      "Seventeen", "Eighteen", "Nineteen"
    ];
    const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

    function convertTwoDigits(v) {
      if (v < 20) return ones[v];
      return tens[Math.floor(v / 10)] + (v % 10 > 0 ? " " + ones[v % 10] : "");
    }

    function convertThreeDigits(v) {
      let str = "";
      if (v >= 100) {
        str += ones[Math.floor(v / 100)] + " Hundred ";
        v %= 100;
      }
      if (v > 0) {
        str += convertTwoDigits(v);
      }
      return str.trim();
    }

    let result = "";
    const crore = Math.floor(num / 10000000);
    const lakh = Math.floor((num % 10000000) / 100000);
    const thousand = Math.floor((num % 100000) / 1000);
    const remainder = num % 1000;

    if (crore > 0) result += convertTwoDigits(crore) + " Crore ";
    if (lakh > 0) result += convertTwoDigits(lakh) + " Lakh ";
    if (thousand > 0) result += convertTwoDigits(thousand) + " Thousand ";
    if (remainder > 0) result += convertThreeDigits(remainder) + " ";

    return `Rupees ${result.trim()} Only`;
  }

  escapeHtml(str) {
    if (!str) return "";
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  showToast(message, type = "info") {
    const container = document.getElementById("toastContainer");
    if (!container) return;

    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;
    const icon = type === "success" ? "fa-check-circle" : (type === "error" ? "fa-exclamation-circle" : "fa-info-circle");
    toast.innerHTML = `<i class="fas ${icon}"></i> <span>${this.escapeHtml(message)}</span>`;
    
    container.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transition = "opacity 0.3s";
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }
}

// Instantiate on page load
let app;
window.addEventListener("DOMContentLoaded", () => {
  app = new QuotationApp();
});
