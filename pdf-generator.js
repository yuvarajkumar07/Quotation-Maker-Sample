/**
 * ELEVATE EDGE INTERIORS — Professional Multi-Page Vector PDF Generator
 * High-definition, crystal-clear vector document generation using jsPDF + jspdf-autotable.
 * Guarantees zero blank pages, instant download, native typography, and executive formatting.
 */

class PdfExportManager {
  constructor() {
    this.primaryColor = [20, 54, 38];    // #143626 Forest Green
    this.goldColor = [197, 168, 105];     // #C5A869 Champagne Gold
    this.charcoalColor = [31, 36, 33];    // #1F2421 Charcoal
    this.mutedColor = [102, 112, 133];    // #667085 Muted
    this.lightBgColor = [248, 249, 248];  // Light Grey Tint
  }

  formatCurrency(num) {
    if (isNaN(num) || num === null || num === undefined) return "0.00";
    return Number(num).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }

  // =========================================================================
  // EXPORT ADAPTER (Safely delegates to generateJsPdf to prevent html2canvas bugs)
  // =========================================================================
  async exportFromHtml(containerElement, filename) {
    const quote = (typeof app !== "undefined" && app.activeQuotation) 
      ? app.activeQuotation 
      : (typeof storage !== "undefined" ? storage.getQuotations()[0] : null);
    const settings = (typeof storage !== "undefined") ? storage.getSettings() : {};
    
    if (quote) {
      return await this.generateJsPdf(quote, settings);
    }
    throw new Error("No active quotation available to export.");
  }

  // =========================================================================
  // PRIMARY VECTOR ENGINE: HIGH-DEFINITION MULTI-PAGE PDF GENERATOR
  // Native vector graphics, sharp typography, 6 clean columns, repeating headers,
  // embedded company logo, financial summary, and terms & conditions.
  // =========================================================================
  async generateJsPdf(quotation, companySettings) {
    if (typeof window.jspdf === "undefined") {
      throw new Error("jsPDF library is not loaded. Please verify your internet connection.");
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4"
    });

    const activeCompName = quotation.companyName || quotation.companySnapshot?.companyName || companySettings?.companyName || "ELEVATE EDGE INTERIORS";
    const company = Object.assign({
      companyName: activeCompName,
      tagline: quotation.companyTagline || "LET'S DESIGN YOUR DREAM SPACE TOGETHER.",
      registeredAddress: "Plot No. 42, Road No. 36, Jubilee Hills, Hyderabad – 500033",
      primaryMobile: "+91 90309 19922",
      businessEmail: "studioelevateedge@gmail.com",
      website: "elevateedgeinteriors.in",
      gstin: "36AAECE1234F1Z5",
      authorizedRepresentative: "Managing Partner & Principal Designer",
      footerNote: "Elevate Edge Interiors — Luxury Interior Architecture & Turnkey Execution"
    }, quotation.companySnapshot || companySettings || {});
    company.companyName = activeCompName;

    const client = quotation.client || {};
    const pricing = quotation.pricing || {};
    const items = quotation.items || [];
    const terms = quotation.terms || company.termsAndConditions || [];
    const paymentMilestones = quotation.paymentSchedule || company.defaultPaymentSchedule || [];
    const authRep = quotation.signatoryBox?.name || quotation.authorizedRepresentative || company.authorizedRepresentative || "Managing Partner & Principal Designer";

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 14;
    const contentWidth = pageWidth - (margin * 2);

    const logoDataUrl = company.logoBase64 || (typeof EEI_DEFAULT_LOGO_BASE64 !== "undefined" ? EEI_DEFAULT_LOGO_BASE64 : null);

    // =========================================================================
    // PAGE 1: LUXURY EXECUTIVE COVER PAGE (FULL & BALANCED WITH ZERO WASTED SPACE)
    // =========================================================================
    // Top Decorative Accent Band
    doc.setFillColor(20, 54, 38); // Forest Green
    doc.rect(0, 0, pageWidth, 9, "F");
    doc.setFillColor(197, 168, 105); // Gold Accent
    doc.rect(0, 9, pageWidth, 1.8, "F");

    let currentY = 15;

    // Draw Company Logo on Page 1 if available
    if (logoDataUrl) {
      try {
        doc.addImage(logoDataUrl, "PNG", margin, currentY, 18, 18, undefined, "FAST");
      } catch (err) {
        console.warn("Could not render logo in jsPDF:", err);
      }
    }

    // Company Header Text
    const headerTextX = logoDataUrl ? margin + 22 : margin;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.setTextColor(20, 54, 38);
    doc.text(company.companyName, headerTextX, currentY + 6.5);

    doc.setFontSize(8.5);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(197, 168, 105);
    doc.text(company.tagline || "LET'S DESIGN YOUR DREAM SPACE TOGETHER.", headerTextX, currentY + 11.5);

    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(70, 75, 72);
    doc.text(`${company.registeredAddress} | Ph: ${company.primaryMobile}`, headerTextX, currentY + 16.5);

    // Right-aligned contact header
    doc.setFontSize(7.5);
    doc.setTextColor(80, 85, 80);
    doc.text(`Email: ${company.businessEmail}`, pageWidth - margin, currentY + 6.5, { align: "right" });
    doc.text(`Website: ${company.website || "elevateedgeinteriors.in"}`, pageWidth - margin, currentY + 11.5, { align: "right" });
    doc.text(`GSTIN: ${company.gstin || "—"}`, pageWidth - margin, currentY + 16.5, { align: "right" });

    // Gold Divider Line
    currentY += 23;
    doc.setDrawColor(197, 168, 105);
    doc.setLineWidth(0.6);
    doc.line(margin, currentY, pageWidth - margin, currentY);

    // Document Title Banner (Fully Editable from Quotation Editor)
    currentY += 5;
    doc.setFillColor(20, 54, 38);
    doc.roundedRect(margin, currentY, contentWidth, 20, 1.5, 1.5, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(13.5);
    doc.setTextColor(255, 255, 255);
    const docHeading = quotation.documentHeading || "INTERIOR DESIGN & EXECUTION QUOTATION";
    doc.text(docHeading.toUpperCase(), pageWidth / 2, currentY + 8, { align: "center" });

    doc.setFontSize(8.5);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(223, 202, 155);
    doc.text(quotation.title || "Turnkey Luxury Interior Design & Execution Proposal", pageWidth / 2, currentY + 14.5, { align: "center" });

    // Metadata Strip (3 Columns: Quotation No, Date, Validity — No Revision!)
    currentY += 25;
    doc.setFillColor(248, 245, 237);
    doc.setDrawColor(220, 205, 165);
    doc.roundedRect(margin, currentY, contentWidth, 14, 1.5, 1.5, "FD");

    const colW = contentWidth / 3;
    const metaY = currentY + 5.2;

    doc.setFontSize(7.5);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(20, 54, 38);
    doc.text("QUOTATION NUMBER", margin + 4, metaY);
    doc.setFontSize(8.5);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(30, 30, 30);
    doc.text(quotation.quotationNumber, margin + 4, metaY + 5);

    doc.setFontSize(7.5);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(20, 54, 38);
    doc.text("QUOTATION DATE", margin + colW + 4, metaY);
    doc.setFontSize(8.5);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(30, 30, 30);
    doc.text(quotation.quotationDate || "—", margin + colW + 4, metaY + 5);

    doc.setFontSize(7.5);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(20, 54, 38);
    doc.text("VALID UNTIL", margin + colW * 2 + 4, metaY);
    doc.setFontSize(8.5);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(30, 30, 30);
    doc.text(quotation.validityDate || "—", margin + colW * 2 + 4, metaY + 5);

    // Two Column Client & Project Details Boxes
    currentY += 19;
    const boxWidth = (contentWidth - 6) / 2;
    const boxHeight = 56;

    // Client Box
    doc.setFillColor(248, 249, 248);
    doc.setDrawColor(218, 224, 220);
    doc.roundedRect(margin, currentY, boxWidth, boxHeight, 1.5, 1.5, "FD");

    doc.setFillColor(20, 54, 38);
    doc.rect(margin, currentY, boxWidth, 7, "F");
    doc.setFontSize(8.5);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(255, 255, 255);
    doc.text("PREPARED FOR (CLIENT)", margin + 4, currentY + 5);

    let clientTextY = currentY + 12.5;
    doc.setFontSize(8);
    doc.setTextColor(30, 30, 30);

    doc.setFont("helvetica", "bold");
    doc.text("Client Name:", margin + 4, clientTextY);
    doc.setFont("helvetica", "normal");
    doc.text(client.clientName || "—", margin + 27, clientTextY);

    clientTextY += 6;
    doc.setFont("helvetica", "bold");
    doc.text("Contact:", margin + 4, clientTextY);
    doc.setFont("helvetica", "normal");
    doc.text(client.contactPerson || client.clientName || "—", margin + 27, clientTextY);

    clientTextY += 6;
    doc.setFont("helvetica", "bold");
    doc.text("Mobile:", margin + 4, clientTextY);
    doc.setFont("helvetica", "normal");
    doc.text(client.mobileNumber || "—", margin + 27, clientTextY);

    clientTextY += 6;
    doc.setFont("helvetica", "bold");
    doc.text("Email:", margin + 4, clientTextY);
    doc.setFont("helvetica", "normal");
    doc.text(client.email || "—", margin + 27, clientTextY);

    clientTextY += 6;
    doc.setFont("helvetica", "bold");
    doc.text("Billing Address:", margin + 4, clientTextY);
    doc.setFont("helvetica", "normal");
    const billLines = doc.splitTextToSize(client.billingAddress || client.projectSiteAddress || "—", boxWidth - 36);
    doc.text(billLines.slice(0, 2), margin + 31, clientTextY);

    // Project Details Box
    const projX = margin + boxWidth + 6;
    doc.setFillColor(248, 249, 248);
    doc.setDrawColor(218, 224, 220);
    doc.roundedRect(projX, currentY, boxWidth, boxHeight, 1.5, 1.5, "FD");

    doc.setFillColor(20, 54, 38);
    doc.rect(projX, currentY, boxWidth, 7, "F");
    doc.setFontSize(8.5);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(255, 255, 255);
    doc.text("PROJECT & SITE DETAILS", projX + 4, currentY + 5);

    let projTextY = currentY + 12.5;
    doc.setFontSize(8);
    doc.setTextColor(30, 30, 30);

    doc.setFont("helvetica", "bold");
    doc.text("Project Name:", projX + 4, projTextY);
    doc.setFont("helvetica", "normal");
    doc.text(client.projectName || "—", projX + 27, projTextY);

    projTextY += 6;
    doc.setFont("helvetica", "bold");
    doc.text("Location:", projX + 4, projTextY);
    doc.setFont("helvetica", "normal");
    doc.text(client.projectLocation || "—", projX + 27, projTextY);

    projTextY += 6;
    doc.setFont("helvetica", "bold");
    doc.text("Site Address:", projX + 4, projTextY);
    doc.setFont("helvetica", "normal");
    const siteLines = doc.splitTextToSize(client.projectSiteAddress || client.billingAddress || "—", boxWidth - 32);
    doc.text(siteLines.slice(0, 2), projX + 27, projTextY);

    projTextY += 10;
    doc.setFont("helvetica", "bold");
    doc.text("Prepared By:", projX + 4, projTextY);
    doc.setFont("helvetica", "normal");
    doc.text(quotation.createdBy || company.defaultCreator || "—", projX + 27, projTextY);

    projTextY += 6;
    doc.setFont("helvetica", "bold");
    doc.text("Approved By:", projX + 4, projTextY);
    doc.setFont("helvetica", "normal");
    doc.text(quotation.approvedBy || company.defaultApprover || "—", projX + 27, projTextY);

    // Executive Project Overview Box
    currentY += boxHeight + 7;
    doc.setFillColor(248, 249, 248);
    doc.setDrawColor(218, 224, 220);
    doc.roundedRect(margin, currentY, contentWidth, 34, 1.5, 1.5, "FD");

    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(20, 54, 38);
    doc.text("EXECUTIVE PROJECT OVERVIEW & ARCHITECTURAL INTENT", margin + 5, currentY + 6.5);

    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(50, 55, 52);
    const overviewText = quotation.projectDescription || 
      "Elevate Edge Interiors is committed to crafting spaces that embody luxury, functional elegance, and enduring quality. This comprehensive proposal encompasses bespoke modular woodwork, premium surface finishes, customized hardware, and turnkey architectural execution tailored to your space.";
    const overviewLines = doc.splitTextToSize(overviewText, contentWidth - 10);
    doc.text(overviewLines.slice(0, 4), margin + 5, currentY + 13);

    // =========================================================================
    // LUXURY SPECIFICATION PILLARS (EDITABLE, ADDABLE, DELETABLE, TOGGLEABLE)
    // =========================================================================
    let pillarH = 0;
    if (quotation.showPillars !== false) {
      currentY += 40;
      const pillars = (quotation.specificationPillars && quotation.specificationPillars.length > 0)
        ? quotation.specificationPillars
        : [
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
        ];

      pillarH = 26;
      const pillarCount = Math.max(1, pillars.length);
      const totalSpacing = (pillarCount - 1) * 4;
      const pillarW = (contentWidth - totalSpacing) / pillarCount;

      pillars.forEach((p, pIdx) => {
        const pX = margin + (pIdx * (pillarW + 4));
        doc.setFillColor(252, 252, 251);
        doc.setDrawColor(220, 226, 222);
        doc.roundedRect(pX, currentY, pillarW, pillarH, 1, 1, "FD");

        doc.setFillColor(20, 54, 38);
        doc.rect(pX, currentY, pillarW, 4.5, "F");

        doc.setFontSize(7.5);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(255, 255, 255);
        doc.text(p.title || "", pX + (pillarW / 2), currentY + 3.2, { align: "center" });

        doc.setFontSize(7.2);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(197, 168, 105);
        doc.text(p.sub || "", pX + 3, currentY + 9);

        doc.setFontSize(6.8);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(70, 75, 72);
        const descLines = doc.splitTextToSize(p.desc || "", pillarW - 6);
        doc.text(descLines, pX + 3, currentY + 14);
      });
    }

    // =========================================================================
    // AUTHORIZED SIGNATURE & OFFICIAL ISSUANCE BLOCK (EDITABLE & TOGGLEABLE)
    // =========================================================================
    if (quotation.showSignatoryBlock !== false) {
      currentY += (pillarH > 0 ? pillarH + 7 : 40);
      const signBoxW = 92;
      const signBoxH = 24;

      const signData = quotation.signatoryBox || {};
      const issData = quotation.issuanceBox || {};

      // Left Signature Box
      doc.setFillColor(248, 249, 248);
      doc.setDrawColor(218, 224, 220);
      doc.roundedRect(margin, currentY, signBoxW, signBoxH, 1.5, 1.5, "FD");

      doc.setFontSize(8);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(20, 54, 38);
      doc.text(signData.title || "FOR ELEVATE EDGE INTERIORS", margin + 4, currentY + 5.5);

      doc.setFontSize(7.2);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(70, 75, 72);
      doc.text(authRep, margin + 4, currentY + 11);
      doc.text(signData.subtitle || "Official Authorized Signatory | Hyderabad", margin + 4, currentY + 16);
      doc.text(signData.signatureLine || "Signature & Seal: ________________________", margin + 4, currentY + 21);

      // Right Official Verification Seal Box
      const sealBoxX = margin + signBoxW + 6;
      const sealBoxW = contentWidth - signBoxW - 6;

      doc.setFillColor(248, 249, 248);
      doc.setDrawColor(218, 224, 220);
      doc.roundedRect(sealBoxX, currentY, sealBoxW, signBoxH, 1.5, 1.5, "FD");

      doc.setFontSize(8);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(20, 54, 38);
      doc.text(issData.title || "OFFICIAL ISSUANCE & VERIFICATION", sealBoxX + 4, currentY + 5.5);

      doc.setFontSize(7.2);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(80, 85, 80);
      const refTemplate = (issData.refText || "Issuance Reference: {Quotation Number}").replace(/\s*\(Rev\s*\d+\)/gi, "");
      doc.text(refTemplate.replace("{Quotation Number}", quotation.quotationNumber), sealBoxX + 4, currentY + 11);

      const scopeTemplate = issData.scopeText || "Scope Verified: {Item Count} Custom Interior Work Items";
      doc.text(scopeTemplate.replace("{Item Count}", String(items.length)), sealBoxX + 4, currentY + 16);

      doc.setFont("helvetica", "italic");
      doc.text(issData.validityText || "Turnkey Proposal Valid for 30 Days from Issuance", sealBoxX + 4, currentY + 21);
    }

    // =========================================================================
    // PAGE 2 ONWARD: DETAILED SCOPE & PRICING SCHEDULE
    // 6 Columns: S. No. in single line | Item Name & Specs in BOLD | Total with disc
    // =========================================================================
    doc.addPage();

    // Prepare table body rows and rich data structures
    const tableBody = items.map((item, idx) => {
      let specHeightLines = 1; // item name
      if (item.category) specHeightLines += 1;
      if (item.description) specHeightLines += Math.ceil(item.description.length / 42);
      if (item.subpoints && item.subpoints.length > 0) {
        specHeightLines += 1; // "Key Specifications:"
        item.subpoints.forEach(sp => {
          if (sp && sp.trim()) specHeightLines += Math.max(1, Math.ceil(sp.trim().length / 38));
        });
      }
      if (item.notes && item.notes.trim()) {
        const cleanNote = item.notes.replace(/^Note:\s*/i, "");
        specHeightLines += Math.max(1, Math.ceil((cleanNote.length + 6) / 38));
      }

      // Provide text for autoTable height calculation
      const dummyLines = new Array(specHeightLines).fill(" ").join("\n");

      let totalCellText = `Rs. ${this.formatCurrency(item.total)}`;
      if (item.discountAmount > 0) {
        totalCellText += `\n(Incl. Rs. ${this.formatCurrency(item.discountAmount)} disc)`;
      }

      return [
        idx + 1,
        dummyLines,
        item.unit || "Nos.",
        item.quantity,
        `Rs. ${this.formatCurrency(item.unitPrice)}`,
        totalCellText
      ];
    });

    const tableHeadingText = quotation.tableHeading || "SCOPE OF WORK & PRICING SCHEDULE";

    if (typeof doc.autoTable !== "undefined") {
      doc.autoTable({
        startY: 24,
        margin: { left: margin, right: margin, top: 24, bottom: 18 },
        rowPageBreak: "avoid",
        head: [[
          "S.No.",
          "Item and Specifications",
          "Unit",
          "Qty",
          "Unit Price (Rs.)",
          "Total (Rs.)"
        ]],
        body: tableBody,
        theme: "grid",
        headStyles: {
          fillColor: [20, 54, 38],
          textColor: [255, 255, 255],
          fontStyle: "bold",
          fontSize: 9.5, // Increased as requested
          halign: "center",
          valign: "middle",
          cellPadding: 3.5
        },
        columnStyles: {
          0: { cellWidth: 18, halign: "center", fontStyle: "bold", cellPadding: 2 }, // S.No. in single line!
          1: { cellWidth: "auto", halign: "left" },
          2: { cellWidth: 16, halign: "center" },
          3: { cellWidth: 14, halign: "center" },
          4: { cellWidth: 32, halign: "right" },
          5: { cellWidth: 36, halign: "right", fontStyle: "bold" }
        },
        styles: {
          fontSize: 8.5,
          font: "helvetica",
          cellPadding: 3.5,
          lineColor: [220, 226, 222],
          lineWidth: 0.2
        },
        alternateRowStyles: {
          fillColor: [250, 251, 250]
        },
        didParseCell: (data) => {
          // Make default autoTable dummy text invisible in column 1 so our rich text shines through
          if (data.section === "body" && data.column.index === 1) {
            data.cell.styles.textColor = data.row.index % 2 === 0 ? [255, 255, 255] : [250, 251, 250];
          }
        },
        didDrawCell: (data) => {
          // Custom Rich Typography for Item and Specifications (Bold titles & Bold Key Specifications)
          if (data.section === "body" && data.column.index === 1) {
            const item = items[data.row.index];
            if (!item) return;

            // Clear cell interior with row background
            doc.setFillColor(data.row.index % 2 === 0 ? 255 : 250, data.row.index % 2 === 0 ? 255 : 251, data.row.index % 2 === 0 ? 255 : 250);
            doc.rect(data.cell.x + 0.2, data.cell.y + 0.2, data.cell.width - 0.4, data.cell.height - 0.4, "F");

            let tx = data.cell.x + 3.5;
            let ty = data.cell.y + 5;
            const maxTextW = data.cell.width - 7;

            // 1. Item Name in BOLD Forest Green
            doc.setFont("helvetica", "bold");
            doc.setFontSize(9.5);
            doc.setTextColor(20, 54, 38);
            doc.text(item.name.toUpperCase(), tx, ty);
            ty += 4.5;

            // 2. Category Tag in BOLD Champagne Gold
            if (item.category) {
              doc.setFont("helvetica", "bold");
              doc.setFontSize(7.5);
              doc.setTextColor(197, 168, 105);
              doc.text(`[${item.category}]`, tx, ty);
              ty += 4;
            }

            // 3. Description in Normal Helvetica
            if (item.description) {
              doc.setFont("helvetica", "normal");
              doc.setFontSize(8);
              doc.setTextColor(55, 60, 58);
              const descLines = doc.splitTextToSize(item.description, maxTextW);
              doc.text(descLines, tx, ty);
              ty += descLines.length * 3.6;
            }

            // 4. "Key Specifications:" in BOLD Forest Green
            if (item.subpoints && item.subpoints.length > 0) {
              ty += 0.8;
              doc.setFont("helvetica", "bold");
              doc.setFontSize(8);
              doc.setTextColor(20, 54, 38);
              doc.text("Key Specifications:", tx, ty);
              ty += 3.8;

              doc.setFont("helvetica", "normal");
              doc.setTextColor(65, 70, 68);
              item.subpoints.forEach(sp => {
                if (sp && sp.trim()) {
                  const spLines = doc.splitTextToSize(` • ${sp.trim()}`, maxTextW);
                  doc.text(spLines, tx, ty);
                  ty += spLines.length * 3.6;
                }
              });
            }

            // 5. Notes in Italic
            if (item.notes && item.notes.trim()) {
              ty += 1;
              doc.setFont("helvetica", "italic");
              doc.setFontSize(7.5);
              doc.setTextColor(110, 115, 112);
              const cleanNote = item.notes.replace(/^Note:\s*/i, "");
              const noteLines = doc.splitTextToSize(`Note: ${cleanNote}`, maxTextW);
              doc.text(noteLines, tx, ty);
            }
          }
        },
        didDrawPage: (data) => {
          if (data.pageNumber > 1) {
            // Running Header on every page
            if (logoDataUrl) {
              try {
                doc.addImage(logoDataUrl, "PNG", margin, 6, 12, 12, undefined, "FAST");
              } catch (e) {}
            }
            const hX = logoDataUrl ? margin + 15 : margin;
            doc.setFontSize(8.5);
            doc.setFont("helvetica", "bold");
            doc.setTextColor(20, 54, 38);
            doc.text(company.companyName, hX, 10);
            doc.setFontSize(7.5);
            doc.setFont("helvetica", "normal");
            doc.setTextColor(197, 168, 105);
            doc.text(tableHeadingText, hX, 14.5);

            doc.setFontSize(7.5);
            doc.setFont("helvetica", "bold");
            doc.setTextColor(20, 54, 38);
            doc.text(`Quotation: ${quotation.quotationNumber}`, pageWidth - margin, 10, { align: "right" });
            doc.setFont("helvetica", "normal");
            doc.setTextColor(80, 80, 80);
            doc.text(`Client: ${client.clientName || "—"} | Date: ${quotation.quotationDate || "—"}`, pageWidth - margin, 14.5, { align: "right" });

            doc.setDrawColor(197, 168, 105);
            doc.setLineWidth(0.5);
            doc.line(margin, 18, pageWidth - margin, 18);
          }
        }
      });
    }

    // =========================================================================
    // FINANCIAL SUMMARY BOX & AMOUNT IN WORDS (SIDE-BY-SIDE WITH ZERO OVERLAP)
    // =========================================================================
    let finalTableY = doc.lastAutoTable ? doc.lastAutoTable.finalY + 6 : 180;
    const summaryH = 48;

    // Check if summary fits comfortably on the current page
    if (finalTableY + summaryH > pageHeight - 16) {
      doc.addPage();
      finalTableY = 24;
    }

    const summaryW = 96;
    const summaryX = pageWidth - margin - summaryW;
    const notesW = contentWidth - summaryW - 5;
    const notesX = margin;

    // 1. LEFT BOX: Amount in Words & Commercial Terms (Separated completely)
    doc.setFillColor(248, 249, 248);
    doc.setDrawColor(218, 224, 220);
    doc.roundedRect(notesX, finalTableY, notesW, summaryH, 1.5, 1.5, "FD");

    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(20, 54, 38);
    doc.text("AMOUNT IN WORDS (INR)", notesX + 4, finalTableY + 6.5);

    doc.setDrawColor(197, 168, 105);
    doc.setLineWidth(0.4);
    doc.line(notesX + 4, finalTableY + 8.5, notesX + 45, finalTableY + 8.5);

    doc.setFontSize(8.5);
    doc.setFont("helvetica", "bolditalic");
    doc.setTextColor(40, 45, 42);
    const wordsLines = doc.splitTextToSize(pricing.grandTotalInWords || "Rupees Zero Only", notesW - 8);
    doc.text(wordsLines, notesX + 4, finalTableY + 14);

    doc.setFontSize(7.5);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(20, 54, 38);
    doc.text("COMMERCIAL EXECUTION TERMS:", notesX + 4, finalTableY + 27);

    doc.setFontSize(7);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(70, 75, 72);
    const commTerms = "Prices include complete factory fabrication, precision edge-banding, delivery in Hyderabad, and skilled carpentry installation. Statutory taxes as applicable.";
    const commLines = doc.splitTextToSize(commTerms, notesW - 8);
    doc.text(commLines, notesX + 4, finalTableY + 32);

    // 2. RIGHT BOX: Financial Breakdown & Grand Total
    doc.setFillColor(248, 249, 248);
    doc.setDrawColor(218, 224, 220);
    doc.roundedRect(summaryX, finalTableY, summaryW, summaryH, 1.5, 1.5, "FD");

    let sumLineY = finalTableY + 6.5;
    doc.setFontSize(8);
    doc.setTextColor(40, 40, 40);

    const hasItemDiscount = (pricing.totalItemDiscounts || 0) > 0;
    const hasOverallDiscount = (pricing.overallDiscountAmount || 0) > 0;
    const hasDiscounts = hasItemDiscount || hasOverallDiscount;

    if (hasDiscounts) {
      doc.setFont("helvetica", "normal");
      doc.text("Total Amount Before Discounts:", summaryX + 4, sumLineY);
      doc.setFont("helvetica", "bold");
      doc.text(`Rs. ${this.formatCurrency(pricing.totalBeforeDiscounts || 0)}`, summaryX + summaryW - 4, sumLineY, { align: "right" });

      if (hasItemDiscount) {
        sumLineY += 5.2;
        doc.setFont("helvetica", "normal");
        doc.setTextColor(160, 40, 40);
        doc.text("Item-Level Discounts:", summaryX + 4, sumLineY);
        doc.text(`- Rs. ${this.formatCurrency(pricing.totalItemDiscounts)}`, summaryX + summaryW - 4, sumLineY, { align: "right" });
      }

      if (hasOverallDiscount) {
        sumLineY += 5.2;
        doc.setFont("helvetica", "normal");
        doc.setTextColor(160, 40, 40);
        doc.text(`Additional Overall Discount (${pricing.overallDiscountValue || 0}%):`, summaryX + 4, sumLineY);
        doc.setFont("helvetica", "bold");
        doc.text(`- Rs. ${this.formatCurrency(pricing.overallDiscountAmount)}`, summaryX + summaryW - 4, sumLineY, { align: "right" });
      }

      sumLineY += 5.2;
      doc.setTextColor(40, 40, 40);
      doc.setFont("helvetica", "bold");
      doc.text("Subtotal After Discounts:", summaryX + 4, sumLineY);
      doc.text(`Rs. ${this.formatCurrency(pricing.subtotalAfterDiscounts || 0)}`, summaryX + summaryW - 4, sumLineY, { align: "right" });
    } else {
      // If neither item nor overall discount is added, display ONLY single clean Total row (no discount lines!)
      doc.setFont("helvetica", "bold");
      doc.text("Total Amount (Subtotal):", summaryX + 4, sumLineY);
      doc.text(`Rs. ${this.formatCurrency(pricing.subtotalAfterDiscounts || pricing.totalBeforeDiscounts || 0)}`, summaryX + summaryW - 4, sumLineY, { align: "right" });
    }

    if (pricing.taxEnabled && (pricing.taxAmount || 0) > 0) {
      sumLineY += 5.2;
      doc.setFont("helvetica", "normal");
      doc.text(`Applicable Taxes (${pricing.taxRate || 18}% GST):`, summaryX + 4, sumLineY);
      doc.text(`+ Rs. ${this.formatCurrency(pricing.taxAmount)}`, summaryX + summaryW - 4, sumLineY, { align: "right" });
    }

    if ((pricing.totalAdditionalCharges || 0) > 0) {
      sumLineY += 5.2;
      doc.setFont("helvetica", "normal");
      doc.text("Additional Charges:", summaryX + 4, sumLineY);
      doc.text(`+ Rs. ${this.formatCurrency(pricing.totalAdditionalCharges)}`, summaryX + summaryW - 4, sumLineY, { align: "right" });
    }

    // Grand Total Bar
    sumLineY += 6.5;
    doc.setFillColor(20, 54, 38);
    doc.rect(summaryX, sumLineY - 4.5, summaryW, 10.5, "F");

    doc.setFontSize(8.5);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(255, 255, 255);
    doc.text("FINAL GRAND TOTAL:", summaryX + 4, sumLineY + 2.2);

    doc.setFontSize(10.5);
    doc.setTextColor(223, 202, 155);
    doc.text(`Rs. ${this.formatCurrency(pricing.grandTotal || 0)}`, summaryX + summaryW - 4, sumLineY + 2.2, { align: "right" });

    // =========================================================================
    // FINAL PAGE: TERMS & CONDITIONS, PAYMENT SCHEDULE & ACCEPTANCE SIGN-OFF
    // =========================================================================
    doc.addPage();

    if (logoDataUrl) {
      try {
        doc.addImage(logoDataUrl, "PNG", margin, 6, 12, 12, undefined, "FAST");
      } catch (e) {}
    }
    const thX = logoDataUrl ? margin + 15 : margin;
    doc.setFontSize(8.5);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(20, 54, 38);
    doc.text(company.companyName, thX, 10);
    doc.setFontSize(7.5);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(197, 168, 105);
    const termsHeadText = quotation.termsHeading || "STANDARD TERMS & EXECUTION POLICIES";
    doc.text(termsHeadText, thX, 14.5);

            doc.setFontSize(7.5);
            doc.setFont("helvetica", "bold");
            doc.setTextColor(20, 54, 38);
            doc.text(`Quotation: ${quotation.quotationNumber}`, pageWidth - margin, 10, { align: "right" });
    doc.setFont("helvetica", "normal");
    doc.setTextColor(80, 80, 80);
    doc.text(`Client: ${client.clientName || "—"}`, pageWidth - margin, 14.5, { align: "right" });

    doc.setDrawColor(197, 168, 105);
    doc.setLineWidth(0.5);
    doc.line(margin, 18, pageWidth - margin, 18);

    let termsY = 24;
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(20, 54, 38);
    doc.text(termsHeadText.toUpperCase(), margin, termsY);

    termsY += 3.5;
    doc.setDrawColor(197, 168, 105);
    doc.setLineWidth(0.5);
    doc.line(margin, termsY, margin + 45, termsY);

    termsY += 5.5;
    doc.setFontSize(7.8);
    doc.setTextColor(40, 40, 40);

    terms.forEach((term, i) => {
      if (termsY > pageHeight - 65) {
        doc.addPage();
        termsY = 24;
      }
      doc.setFont("helvetica", "bold");
      const title = `${i + 1}. ${term.title}: `;
      doc.text(title, margin, termsY);
      
      const titleWidth = doc.getTextWidth(title);
      doc.setFont("helvetica", "normal");
      const remainingText = doc.splitTextToSize(term.text, contentWidth - titleWidth);
      doc.text(remainingText[0] || "", margin + titleWidth, termsY);

      if (remainingText.length > 1) {
        for (let j = 1; j < remainingText.length; j++) {
          termsY += 3.8;
          doc.text(remainingText[j], margin + 4, termsY);
        }
      }
      termsY += 4.5;
    });

    // =========================================================================
    // EDITABLE BOTTOM TABLE: PROJECT PAYMENT SCHEDULE (MILESTONE BREAKDOWN)
    // =========================================================================
    if (termsY < pageHeight - 55) {
      termsY += 3;
      doc.setFontSize(8.5);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(20, 54, 38);
      doc.text("PROJECT PAYMENT SCHEDULE (MILESTONE BREAKDOWN)", margin, termsY);

      termsY += 2.5;
      const msBody = paymentMilestones.map(ms => [
        ms.milestone,
        `${ms.percentage}%`,
        ms.notes
      ]);

      if (typeof doc.autoTable !== "undefined") {
        doc.autoTable({
          startY: termsY,
          margin: { left: margin, right: margin },
          head: [["Milestone Stage", "Share (%)", "Trigger & Payment Terms"]],
          body: msBody,
          theme: "grid",
          headStyles: { fillColor: [20, 54, 38], fontSize: 7.8, cellPadding: 2.2 },
          columnStyles: {
            0: { cellWidth: 55, fontStyle: "bold" },
            1: { cellWidth: 20, halign: "center" },
            2: { cellWidth: "auto" }
          },
          styles: { fontSize: 7.4, cellPadding: 2 }
        });
        termsY = doc.lastAutoTable.finalY + 5;
      }
    }

    // Sign-off / Acceptance Boxes
    if (termsY > pageHeight - 42) {
      doc.addPage();
      termsY = 24;
    } else {
      termsY = Math.max(termsY + 3, pageHeight - 45);
    }

    const finalSignW = (contentWidth - 6) / 2;
    const finalSignH = 30;

    doc.setFillColor(250, 251, 250);
    doc.setDrawColor(218, 224, 220);
    doc.roundedRect(margin, termsY, finalSignW, finalSignH, 1.5, 1.5, "FD");
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(20, 54, 38);
    doc.text("FOR ELEVATE EDGE INTERIORS", margin + 4, termsY + 5.5);
    doc.setFontSize(7.5);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(80, 80, 80);
    doc.text(authRep, margin + 4, termsY + finalSignH - 4);

    const clientSignX = margin + finalSignW + 6;
    doc.setFillColor(250, 251, 250);
    doc.setDrawColor(218, 224, 220);
    doc.roundedRect(clientSignX, termsY, finalSignW, finalSignH, 1.5, 1.5, "FD");
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(30, 30, 30);
    doc.text("CLIENT ACCEPTANCE & SIGN-OFF", clientSignX + 4, termsY + 5.5);
    doc.setFontSize(7.2);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 100, 100);
    doc.text("I hereby confirm acceptance of this quotation and terms.", clientSignX + 4, termsY + 10.5);
    doc.text("Client Signature: __________________ Date: ________", clientSignX + 4, termsY + finalSignH - 4);

    // =========================================================================
    // MANDATORY RUNNING FOOTER ON EVERY PAGE (USING CUSTOM FOOTER NOTE)
    // =========================================================================
    const footerStatement = quotation.footerNote || company.footerNote || "This is a computer-generated document. No physical signature is required.";
    const totalPages = doc.internal.getNumberOfPages();
    for (let p = 1; p <= totalPages; p++) {
      doc.setPage(p);

      doc.setDrawColor(218, 224, 220);
      doc.setLineWidth(0.3);
      doc.line(margin, pageHeight - 11, pageWidth - margin, pageHeight - 11);

      doc.setFontSize(7);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(100, 110, 105);
      doc.text(
        `${company.companyName} | Ph: ${company.primaryMobile} | Email: ${company.businessEmail} | Quotation: ${quotation.quotationNumber}`,
        pageWidth / 2,
        pageHeight - 7.5,
        { align: "center" }
      );

      doc.text(
        `${footerStatement} | Page ${p} of ${totalPages}`,
        pageWidth / 2,
        pageHeight - 3.8,
        { align: "center" }
      );
    }

    const clientPart = (client.clientName || "Quotation").replace(/[^a-zA-Z0-9_-]/g, "_");
    const numPart = (quotation.quotationNumber || "QTN").replace(/[\/\\:]/g, "_");
    const filename = `${numPart}_${clientPart}.pdf`;
    
    try {
      doc.save(filename);
    } catch (saveErr) {
      console.warn("Direct doc.save failed, falling back to Blob download:", saveErr);
      const blob = doc.output("blob");
      if (typeof window.saveAs !== "undefined") {
        window.saveAs(blob, filename);
      } else {
        const blobUrl = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = blobUrl;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        setTimeout(() => {
          document.body.removeChild(link);
          URL.revokeObjectURL(blobUrl);
        }, 1500);
      }
    }

    return { success: true, filename };
  }

  printQuotation() {
    window.print();
  }
}

const pdfExporter = new PdfExportManager();
