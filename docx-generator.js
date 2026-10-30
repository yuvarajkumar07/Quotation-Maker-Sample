/**
 * ELEVATE EDGE INTERIORS — Professional DOCX Generator
 * Produces genuine, fully editable Microsoft Word (.docx) documents with proper tables,
 * typography, bulleted subpoints, financial summaries, headers/footers, and terms.
 */

class DocxExportManager {
  constructor() {
    this.brandForestGreen = "143626";
    this.brandGold = "C5A869";
    this.brandCharcoal = "1F2421";
    this.brandMuted = "667085";
    this.brandLightBg = "F4F6F4";
    this.brandGoldPale = "FBF7ED";
  }

  // Format currency with Indian Comma Style
  formatCurrency(num) {
    if (isNaN(num) || num === null || num === undefined) return "0.00";
    return Number(num).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }

  async generateDocx(quotation, companySettings) {
    if (typeof window.docx === "undefined") {
      throw new Error("Word generation library (docx.js) is not loaded yet. Please check your internet connection.");
    }

    const {
      Document,
      Packer,
      Paragraph,
      TextRun,
      Table,
      TableRow,
      TableCell,
      WidthType,
      AlignmentType,
      BorderStyle,
      Header,
      Footer,
      PageNumber,
      PageBreak,
      ShadingType
    } = window.docx;

    const company = quotation.companySnapshot || companySettings;
    const client = quotation.client || {};
    const pricing = quotation.pricing || {};
    const items = quotation.items || [];
    const terms = quotation.terms || company.termsAndConditions || [];

    // Helper for table borders
    const thinBorder = {
      style: BorderStyle.SINGLE,
      size: 4,
      color: "D0D7D2"
    };
    const noBorder = {
      style: BorderStyle.NONE,
      size: 0,
      color: "FFFFFF"
    };

    const tableBordersAll = {
      top: thinBorder,
      bottom: thinBorder,
      left: thinBorder,
      right: thinBorder,
      insideHorizontal: thinBorder,
      insideVertical: thinBorder
    };

    const tableBordersNone = {
      top: noBorder,
      bottom: noBorder,
      left: noBorder,
      right: noBorder,
      insideHorizontal: noBorder,
      insideVertical: noBorder
    };

    // ================= HEADER & FOOTER =================
    const docFooter = new Footer({
      children: [
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({
              text: `${company.companyName} | Ph: ${company.primaryMobile} | Email: ${company.businessEmail} | Quotation: ${quotation.quotationNumber} (${quotation.revisionIdentifier || "Rev 1"})`,
              size: 16,
              color: this.brandMuted
            })
          ]
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({
              text: `${company.footerNote} — Page `,
              size: 15,
              italics: true,
              color: this.brandMuted
            }),
            new TextRun({
              children: [PageNumber.CURRENT],
              size: 15,
              bold: true,
              color: this.brandCharcoal
            }),
            new TextRun({
              text: " of ",
              size: 15,
              color: this.brandMuted
            }),
            new TextRun({
              children: [PageNumber.TOTAL_PAGES],
              size: 15,
              bold: true,
              color: this.brandCharcoal
            })
          ]
        })
      ]
    });

    // ================= SECTION 1: COVER PAGE =================
    const coverPageChildren = [
      // Company Name & Tagline
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 200, after: 100 },
        children: [
          new TextRun({
            text: company.companyName,
            font: "Arial",
            size: 44,
            bold: true,
            color: this.brandForestGreen,
            letterSpacing: 80
          })
        ]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 200 },
        children: [
          new TextRun({
            text: company.tagline || "LET'S DESIGN YOUR DREAM SPACE TOGETHER.",
            size: 20,
            bold: true,
            color: this.brandGold
          })
        ]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 400 },
        children: [
          new TextRun({
            text: `${company.registeredAddress} | ${company.primaryMobile} | ${company.businessEmail}`,
            size: 18,
            color: this.brandCharcoal
          })
        ]
      }),

      // Document Title Box
      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        borders: tableBordersNone,
        rows: [
          new TableRow({
            children: [
              new TableCell({
                shading: { type: ShadingType.CLEAR, fill: this.brandForestGreen },
                margins: { top: 200, bottom: 200, left: 300, right: 300 },
                children: [
                  new Paragraph({
                    alignment: AlignmentType.CENTER,
                    children: [
                      new TextRun({
                        text: "PROJECT QUOTATION",
                        font: "Arial",
                        size: 32,
                        bold: true,
                        color: "FFFFFF",
                        letterSpacing: 100
                      })
                    ]
                  }),
                  new Paragraph({
                    alignment: AlignmentType.CENTER,
                    spacing: { before: 80 },
                    children: [
                      new TextRun({
                        text: quotation.title || "Turnkey Luxury Interior Design & Execution",
                        size: 20,
                        color: this.brandGold
                      })
                    ]
                  })
                ]
              })
            ]
          })
        ]
      }),

      // Quotation Metadata Bar
      new Paragraph({ spacing: { before: 300 } }),
      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        borders: tableBordersAll,
        rows: [
          new TableRow({
            children: [
              new TableCell({
                shading: { type: ShadingType.CLEAR, fill: this.brandGoldPale },
                margins: { top: 120, bottom: 120, left: 160, right: 160 },
                children: [
                  new Paragraph({
                    children: [
                      new TextRun({ text: "Quotation Number: ", size: 18, bold: true, color: this.brandForestGreen }),
                      new TextRun({ text: quotation.quotationNumber, size: 18, bold: true, color: this.brandCharcoal })
                    ]
                  })
                ]
              }),
              new TableCell({
                shading: { type: ShadingType.CLEAR, fill: this.brandGoldPale },
                margins: { top: 120, bottom: 120, left: 160, right: 160 },
                children: [
                  new Paragraph({
                    children: [
                      new TextRun({ text: "Revision: ", size: 18, bold: true, color: this.brandForestGreen }),
                      new TextRun({ text: quotation.revisionIdentifier || `Rev ${quotation.revision || 1}`, size: 18, bold: true })
                    ]
                  })
                ]
              }),
              new TableCell({
                shading: { type: ShadingType.CLEAR, fill: this.brandGoldPale },
                margins: { top: 120, bottom: 120, left: 160, right: 160 },
                children: [
                  new Paragraph({
                    children: [
                      new TextRun({ text: "Date: ", size: 18, bold: true, color: this.brandForestGreen }),
                      new TextRun({ text: quotation.quotationDate || "—", size: 18 })
                    ]
                  })
                ]
              }),
              new TableCell({
                shading: { type: ShadingType.CLEAR, fill: this.brandGoldPale },
                margins: { top: 120, bottom: 120, left: 160, right: 160 },
                children: [
                  new Paragraph({
                    children: [
                      new TextRun({ text: "Valid Until: ", size: 18, bold: true, color: this.brandForestGreen }),
                      new TextRun({ text: quotation.validityDate || "—", size: 18 })
                    ]
                  })
                ]
              })
            ]
          })
        ]
      }),

      // Two-Column Grid: Client Info & Project Info
      new Paragraph({ spacing: { before: 300 } }),
      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        borders: tableBordersNone,
        rows: [
          new TableRow({
            children: [
              // Client Info Box
              new TableCell({
                width: { size: 48, type: WidthType.PERCENTAGE },
                shading: { type: ShadingType.CLEAR, fill: this.brandLightBg },
                borders: tableBordersAll,
                margins: { top: 180, bottom: 180, left: 200, right: 200 },
                children: [
                  new Paragraph({
                    spacing: { after: 100 },
                    children: [
                      new TextRun({ text: "CLIENT INFORMATION", size: 20, bold: true, color: this.brandForestGreen })
                    ]
                  }),
                  new Paragraph({
                    spacing: { after: 60 },
                    children: [
                      new TextRun({ text: "Client Name: ", size: 18, bold: true }),
                      new TextRun({ text: client.clientName || "—", size: 18 })
                    ]
                  }),
                  new Paragraph({
                    spacing: { after: 60 },
                    children: [
                      new TextRun({ text: "Contact Person: ", size: 18, bold: true }),
                      new TextRun({ text: client.contactPerson || client.clientName || "—", size: 18 })
                    ]
                  }),
                  new Paragraph({
                    spacing: { after: 60 },
                    children: [
                      new TextRun({ text: "Mobile: ", size: 18, bold: true }),
                      new TextRun({ text: client.mobileNumber || "—", size: 18 })
                    ]
                  }),
                  new Paragraph({
                    spacing: { after: 60 },
                    children: [
                      new TextRun({ text: "Email: ", size: 18, bold: true }),
                      new TextRun({ text: client.email || "—", size: 18 })
                    ]
                  }),
                  new Paragraph({
                    children: [
                      new TextRun({ text: "Billing Address: ", size: 18, bold: true }),
                      new TextRun({ text: client.billingAddress || "—", size: 18 })
                    ]
                  })
                ]
              }),

              // Spacer
              new TableCell({
                width: { size: 4, type: WidthType.PERCENTAGE },
                children: [new Paragraph({})]
              }),

              // Project Info Box
              new TableCell({
                width: { size: 48, type: WidthType.PERCENTAGE },
                shading: { type: ShadingType.CLEAR, fill: this.brandLightBg },
                borders: tableBordersAll,
                margins: { top: 180, bottom: 180, left: 200, right: 200 },
                children: [
                  new Paragraph({
                    spacing: { after: 100 },
                    children: [
                      new TextRun({ text: "PROJECT DETAILS", size: 20, bold: true, color: this.brandForestGreen })
                    ]
                  }),
                  new Paragraph({
                    spacing: { after: 60 },
                    children: [
                      new TextRun({ text: "Project Name: ", size: 18, bold: true }),
                      new TextRun({ text: client.projectName || "—", size: 18 })
                    ]
                  }),
                  new Paragraph({
                    spacing: { after: 60 },
                    children: [
                      new TextRun({ text: "Site Location: ", size: 18, bold: true }),
                      new TextRun({ text: client.projectLocation || "—", size: 18 })
                    ]
                  }),
                  new Paragraph({
                    spacing: { after: 60 },
                    children: [
                      new TextRun({ text: "Site Address: ", size: 18, bold: true }),
                      new TextRun({ text: client.projectSiteAddress || client.billingAddress || "—", size: 18 })
                    ]
                  }),
                  new Paragraph({
                    spacing: { after: 60 },
                    children: [
                      new TextRun({ text: "Prepared By: ", size: 18, bold: true }),
                      new TextRun({ text: quotation.createdBy || company.defaultCreator || "—", size: 18 })
                    ]
                  }),
                  new Paragraph({
                    children: [
                      new TextRun({ text: "Approved By: ", size: 18, bold: true }),
                      new TextRun({ text: quotation.approvedBy || company.defaultApprover || "—", size: 18 })
                    ]
                  })
                ]
              })
            ]
          })
        ]
      }),

      // Executive Summary
      new Paragraph({ spacing: { before: 300 } }),
      new Paragraph({
        spacing: { after: 100 },
        children: [
          new TextRun({ text: "Executive Project Overview", size: 22, bold: true, color: this.brandForestGreen })
        ]
      }),
      new Paragraph({
        spacing: { after: 400 },
        children: [
          new TextRun({
            text: quotation.projectDescription || "Elevate Edge Interiors is pleased to present this comprehensive quotation for premium interior design and execution. Our bespoke craftsmanship, certified moisture-resistant materials, and turnkey site execution ensure an unmatched standard of luxury and durability.",
            size: 19,
            color: this.brandCharcoal
          })
        ]
      }),

      // Page Break to Page 2
      new Paragraph({
        children: [new PageBreak()]
      })
    ];

    // ================= SECTION 2: DETAILED SCOPE & PRICING TABLE =================
    // Table Header Row
    const tableHeaderRow = new TableRow({
      tableHeader: true,
      children: [
        new TableCell({
          width: { size: 6, type: WidthType.PERCENTAGE },
          shading: { type: ShadingType.CLEAR, fill: this.brandForestGreen },
          margins: { top: 120, bottom: 120, left: 80, right: 80 },
          children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "S.No", bold: true, size: 16, color: "FFFFFF" })] })]
        }),
        new TableCell({
          width: { size: 50, type: WidthType.PERCENTAGE },
          shading: { type: ShadingType.CLEAR, fill: this.brandForestGreen },
          margins: { top: 120, bottom: 120, left: 100, right: 100 },
          children: [new Paragraph({ alignment: AlignmentType.LEFT, children: [new TextRun({ text: "Item & Specifications", bold: true, size: 16, color: "FFFFFF" })] })]
        }),
        new TableCell({
          width: { size: 10, type: WidthType.PERCENTAGE },
          shading: { type: ShadingType.CLEAR, fill: this.brandForestGreen },
          margins: { top: 120, bottom: 120, left: 60, right: 60 },
          children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Unit", bold: true, size: 16, color: "FFFFFF" })] })]
        }),
        new TableCell({
          width: { size: 8, type: WidthType.PERCENTAGE },
          shading: { type: ShadingType.CLEAR, fill: this.brandForestGreen },
          margins: { top: 120, bottom: 120, left: 60, right: 60 },
          children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: "Qty", bold: true, size: 16, color: "FFFFFF" })] })]
        }),
        new TableCell({
          width: { size: 13, type: WidthType.PERCENTAGE },
          shading: { type: ShadingType.CLEAR, fill: this.brandForestGreen },
          margins: { top: 120, bottom: 120, left: 60, right: 60 },
          children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: "Unit Price (₹)", bold: true, size: 16, color: "FFFFFF" })] })]
        }),
        new TableCell({
          width: { size: 13, type: WidthType.PERCENTAGE },
          shading: { type: ShadingType.CLEAR, fill: this.brandForestGreen },
          margins: { top: 120, bottom: 120, left: 60, right: 60 },
          children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: "Total (₹)", bold: true, size: 16, color: "FFFFFF" })] })]
        })
      ]
    });

    // Item Rows with Bulleted Subpoints!
    const itemRows = items.map((item, idx) => {
      const itemDescParas = [
        new Paragraph({
          children: [
            new TextRun({ text: item.name, bold: true, size: 18, color: this.brandForestGreen })
          ]
        })
      ];

      if (item.category) {
        itemDescParas.push(
          new Paragraph({
            spacing: { before: 30, after: 30 },
            children: [
              new TextRun({ text: `[${item.category}]`, size: 14, italics: true, color: this.brandMuted })
            ]
          })
        );
      }

      if (item.description) {
        itemDescParas.push(
          new Paragraph({
            spacing: { after: 50 },
            children: [
              new TextRun({ text: item.description, size: 15, color: this.brandCharcoal })
            ]
          })
        );
      }

      // Add each subpoint as a bulleted paragraph!
      if (item.subpoints && item.subpoints.length > 0) {
        item.subpoints.forEach(sp => {
          if (sp && sp.trim()) {
            itemDescParas.push(
              new Paragraph({
                bullet: { level: 0 },
                spacing: { before: 20, after: 20 },
                children: [
                  new TextRun({ text: sp.trim(), size: 15, color: "333333" })
                ]
              })
            );
          }
        });
      }

      if (item.notes && item.notes.trim()) {
        const cleanNote = item.notes.replace(/^Note:\s*/i, "");
        itemDescParas.push(
          new Paragraph({
            spacing: { before: 40 },
            children: [
              new TextRun({ text: `Note: ${cleanNote}`, size: 14, italics: true, color: this.brandGold })
            ]
          })
        );
      }

      const isEven = idx % 2 === 1;
      const cellBg = isEven ? "F9FAF9" : "FFFFFF";

      const totalParas = [
        new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: this.formatCurrency(item.total), size: 16, bold: true })] })
      ];
      if (item.discountAmount > 0) {
        totalParas.push(
          new Paragraph({
            alignment: AlignmentType.RIGHT,
            spacing: { before: 20 },
            children: [new TextRun({ text: `(Incl. ₹${this.formatCurrency(item.discountAmount)} disc)`, size: 12, italics: true, color: "AA0000" })]
          })
        );
      }

      return new TableRow({
        children: [
          new TableCell({
            shading: { type: ShadingType.CLEAR, fill: cellBg },
            margins: { top: 100, bottom: 100, left: 80, right: 80 },
            children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: String(idx + 1), size: 16, bold: true })] })]
          }),
          new TableCell({
            shading: { type: ShadingType.CLEAR, fill: cellBg },
            margins: { top: 100, bottom: 100, left: 100, right: 100 },
            children: itemDescParas
          }),
          new TableCell({
            shading: { type: ShadingType.CLEAR, fill: cellBg },
            margins: { top: 100, bottom: 100, left: 60, right: 60 },
            children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: item.unit || "Nos.", size: 16 })] })]
          }),
          new TableCell({
            shading: { type: ShadingType.CLEAR, fill: cellBg },
            margins: { top: 100, bottom: 100, left: 60, right: 60 },
            children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: String(item.quantity), size: 16 })] })]
          }),
          new TableCell({
            shading: { type: ShadingType.CLEAR, fill: cellBg },
            margins: { top: 100, bottom: 100, left: 60, right: 60 },
            children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: this.formatCurrency(item.unitPrice), size: 16 })] })]
          }),
          new TableCell({
            shading: { type: ShadingType.CLEAR, fill: cellBg },
            margins: { top: 100, bottom: 100, left: 60, right: 60 },
            children: totalParas
          })
        ]
      });
    });

    // Pricing Table Assembly
    const pricingTable = new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: tableBordersAll,
      rows: [tableHeaderRow, ...itemRows]
    });

    // ================= FINANCIAL SUMMARY BOX =================
    const summaryRows = [
      new TableRow({
        children: [
          new TableCell({
            width: { size: 65, type: WidthType.PERCENTAGE },
            margins: { top: 80, bottom: 80, left: 100, right: 100 },
            children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: "Total Amount Before Discounts:", size: 17 })] })]
          }),
          new TableCell({
            width: { size: 35, type: WidthType.PERCENTAGE },
            margins: { top: 80, bottom: 80, left: 100, right: 100 },
            children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: `₹ ${this.formatCurrency(pricing.totalBeforeDiscounts || 0)}`, size: 17, bold: true })] })]
          })
        ]
      })
    ];

    if ((pricing.totalItemDiscounts || 0) > 0) {
      summaryRows.push(
        new TableRow({
          children: [
            new TableCell({
              margins: { top: 80, bottom: 80, left: 100, right: 100 },
              children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: "Total Item-Level Discounts:", size: 17, color: "990000" })] })]
            }),
            new TableCell({
              margins: { top: 80, bottom: 80, left: 100, right: 100 },
              children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: `- ₹ ${this.formatCurrency(pricing.totalItemDiscounts)}`, size: 17, color: "990000" })] })]
            })
          ]
        })
      );
    }

    if ((pricing.overallDiscountAmount || 0) > 0) {
      summaryRows.push(
        new TableRow({
          children: [
            new TableCell({
              margins: { top: 80, bottom: 80, left: 100, right: 100 },
              children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: `Additional Overall Discount (${pricing.overallDiscountValue || 0}%):`, size: 17, color: "990000" })] })]
            }),
            new TableCell({
              margins: { top: 80, bottom: 80, left: 100, right: 100 },
              children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: `- ₹ ${this.formatCurrency(pricing.overallDiscountAmount)}`, size: 17, bold: true, color: "990000" })] })]
            })
          ]
        })
      );
    }

    summaryRows.push(
      new TableRow({
        children: [
          new TableCell({
            margins: { top: 80, bottom: 80, left: 100, right: 100 },
            children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: "Subtotal After Discounts:", size: 17, bold: true })] })]
          }),
          new TableCell({
            margins: { top: 80, bottom: 80, left: 100, right: 100 },
            children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: `₹ ${this.formatCurrency(pricing.subtotalAfterDiscounts || 0)}`, size: 17, bold: true })] })]
          })
        ]
      })
    );

    if (pricing.taxEnabled && (pricing.taxAmount || 0) > 0) {
      summaryRows.push(
        new TableRow({
          children: [
            new TableCell({
              margins: { top: 80, bottom: 80, left: 100, right: 100 },
              children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: `Applicable Taxes (${pricing.taxRate || 18}% GST):`, size: 17 })] })]
            }),
            new TableCell({
              margins: { top: 80, bottom: 80, left: 100, right: 100 },
              children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: `+ ₹ ${this.formatCurrency(pricing.taxAmount)}`, size: 17 })] })]
            })
          ]
        })
      );
    }

    if (pricing.additionalCharges && pricing.additionalCharges.length > 0) {
      pricing.additionalCharges.forEach(ch => {
        summaryRows.push(
          new TableRow({
            children: [
              new TableCell({
                margins: { top: 80, bottom: 80, left: 100, right: 100 },
                children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: `${ch.name}:`, size: 17 })] })]
              }),
              new TableCell({
                margins: { top: 80, bottom: 80, left: 100, right: 100 },
                children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: `+ ₹ ${this.formatCurrency(ch.amount)}`, size: 17 })] })]
              })
            ]
          })
        );
      });
    }

    // Grand Total Row Highlight
    summaryRows.push(
      new TableRow({
        children: [
          new TableCell({
            shading: { type: ShadingType.CLEAR, fill: this.brandForestGreen },
            margins: { top: 120, bottom: 120, left: 120, right: 120 },
            children: [
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                children: [
                  new TextRun({ text: "FINAL PAYABLE GRAND TOTAL:", size: 20, bold: true, color: "FFFFFF" })
                ]
              })
            ]
          }),
          new TableCell({
            shading: { type: ShadingType.CLEAR, fill: this.brandForestGreen },
            margins: { top: 120, bottom: 120, left: 120, right: 120 },
            children: [
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                children: [
                  new TextRun({ text: `₹ ${this.formatCurrency(pricing.grandTotal || 0)}`, size: 22, bold: true, color: this.brandGold })
                ]
              })
            ]
          })
        ]
      })
    );

    const summaryTable = new Table({
      width: { size: 60, type: WidthType.PERCENTAGE },
      alignment: AlignmentType.RIGHT,
      borders: tableBordersAll,
      rows: summaryRows
    });

    const pricingSectionChildren = [
      new Paragraph({
        spacing: { before: 100, after: 150 },
        children: [
          new TextRun({ text: "Detailed Scope of Work & Pricing Schedule", size: 24, bold: true, color: this.brandForestGreen })
        ]
      }),
      pricingTable,
      new Paragraph({ spacing: { before: 200 } }),
      summaryTable,
      new Paragraph({
        spacing: { before: 150, after: 300 },
        alignment: AlignmentType.RIGHT,
        children: [
          new TextRun({ text: "Amount in Words: ", size: 16, bold: true, color: this.brandForestGreen }),
          new TextRun({ text: pricing.grandTotalInWords || "", size: 16, italics: true, bold: true })
        ]
      }),
      // Page break to Terms & Conditions
      new Paragraph({
        children: [new PageBreak()]
      })
    ];

    // ================= SECTION 3: TERMS AND CONDITIONS & SIGN-OFF =================
    const termsChildren = [
      new Paragraph({
        spacing: { before: 100, after: 150 },
        children: [
          new TextRun({ text: "Standard Terms & Conditions", size: 26, bold: true, color: this.brandForestGreen })
        ]
      })
    ];

    terms.forEach((term, idx) => {
      termsChildren.push(
        new Paragraph({
          spacing: { before: 100, after: 40 },
          children: [
            new TextRun({ text: `${idx + 1}. ${term.title}: `, size: 17, bold: true, color: this.brandCharcoal }),
            new TextRun({ text: term.text, size: 17, color: "333333" })
          ]
        })
      );
    });

    // Milestone Payment Schedule Table
    termsChildren.push(
      new Paragraph({
        spacing: { before: 300, after: 100 },
        children: [
          new TextRun({ text: "Project Payment Milestones", size: 20, bold: true, color: this.brandForestGreen })
        ]
      }),
      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        borders: tableBordersAll,
        rows: [
          new TableRow({
            children: [
              new TableCell({
                shading: { type: ShadingType.CLEAR, fill: this.brandForestGreen },
                margins: { top: 100, bottom: 100, left: 100, right: 100 },
                children: [new Paragraph({ children: [new TextRun({ text: "Milestone Stage", bold: true, color: "FFFFFF" })] })]
              }),
              new TableCell({
                shading: { type: ShadingType.CLEAR, fill: this.brandForestGreen },
                margins: { top: 100, bottom: 100, left: 100, right: 100 },
                children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Share (%)", bold: true, color: "FFFFFF" })] })]
              }),
              new TableCell({
                shading: { type: ShadingType.CLEAR, fill: this.brandForestGreen },
                margins: { top: 100, bottom: 100, left: 100, right: 100 },
                children: [new Paragraph({ children: [new TextRun({ text: "Description & Trigger Condition", bold: true, color: "FFFFFF" })] })]
              })
            ]
          }),
          ...(company.defaultPaymentSchedule || []).map(ms => (
            new TableRow({
              children: [
                new TableCell({
                  margins: { top: 80, bottom: 80, left: 100, right: 100 },
                  children: [new Paragraph({ children: [new TextRun({ text: ms.milestone, size: 16, bold: true })] })]
                }),
                new TableCell({
                  margins: { top: 80, bottom: 80, left: 100, right: 100 },
                  children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: `${ms.percentage}%`, size: 16, bold: true, color: this.brandForestGreen })] })]
                }),
                new TableCell({
                  margins: { top: 80, bottom: 80, left: 100, right: 100 },
                  children: [new Paragraph({ children: [new TextRun({ text: ms.notes, size: 16 })] })]
                })
              ]
            })
          ))
        ]
      })
    );

    // Sign-off / Acceptance Box
    termsChildren.push(
      new Paragraph({ spacing: { before: 400 } }),
      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        borders: tableBordersNone,
        rows: [
          new TableRow({
            children: [
              new TableCell({
                width: { size: 48, type: WidthType.PERCENTAGE },
                borders: tableBordersAll,
                margins: { top: 200, bottom: 200, left: 200, right: 200 },
                children: [
                  new Paragraph({
                    children: [new TextRun({ text: "For ELEVATE EDGE INTERIORS", size: 18, bold: true, color: this.brandForestGreen })]
                  }),
                  new Paragraph({ spacing: { before: 600 } }),
                  new Paragraph({
                    children: [new TextRun({ text: company.authorizedRepresentative || "Authorized Signatory", size: 16, bold: true })]
                  }),
                  new Paragraph({
                    children: [new TextRun({ text: "Lead Architect / Managing Partner", size: 14, color: this.brandMuted })]
                  })
                ]
              }),
              new TableCell({
                width: { size: 4, type: WidthType.PERCENTAGE },
                children: [new Paragraph({})]
              }),
              new TableCell({
                width: { size: 48, type: WidthType.PERCENTAGE },
                borders: tableBordersAll,
                margins: { top: 200, bottom: 200, left: 200, right: 200 },
                children: [
                  new Paragraph({
                    children: [new TextRun({ text: "CLIENT ACCEPTANCE & SIGN-OFF", size: 18, bold: true, color: this.brandCharcoal })]
                  }),
                  new Paragraph({
                    spacing: { before: 100 },
                    children: [new TextRun({ text: "I hereby confirm acceptance of this quotation and terms.", size: 14, color: this.brandMuted })]
                  }),
                  new Paragraph({ spacing: { before: 400 } }),
                  new Paragraph({
                    children: [new TextRun({ text: "Client Signature: __________________________", size: 16 })]
                  }),
                  new Paragraph({
                    spacing: { before: 100 },
                    children: [new TextRun({ text: `Date: _______________ | Location: ${client.projectLocation || "Hyderabad"}`, size: 14 })]
                  })
                ]
              })
            ]
          })
        ]
      })
    );

    // Assemble Full Document
    const doc = new Document({
      sections: [
        {
          properties: {
            page: {
              margin: {
                top: 720, // 0.5 in
                bottom: 720,
                left: 720,
                right: 720
              }
            }
          },
          footers: {
            default: docFooter
          },
          children: [
            ...coverPageChildren,
            ...pricingSectionChildren,
            ...termsChildren
          ]
        }
      ]
    });

    const blob = await Packer.toBlob(doc);
    const filename = `${quotation.quotationNumber.replace(/[\/\\:]/g, "_")}_${(quotation.revisionIdentifier || "Rev1")}.docx`;

    if (typeof window.saveAs !== "undefined") {
      window.saveAs(blob, filename);
    } else {
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }

    return { success: true, filename };
  }
}

const docxExporter = new DocxExportManager();
