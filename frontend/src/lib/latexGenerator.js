/**
 * Robust line-by-line LaTeX parser for Overleaf live preview.
 * Extracts document fields by scanning line by line for recognizable LaTeX patterns.
 */

const lines = (str) => (str || '').split('\n');

const stripLatex = (str = '') =>
  str
    .replace(/\\begin\{minipage\}(?:\{[^}]*\})*/g, '')
    .replace(/\\end\{minipage\}/g, '')
    .replace(/\\vspace\{[^}]*\}/g, '')
    .replace(/\\rowcolor\{[^}]*\}/g, '')
    .replace(/\\textbf\{([^}]*)\}/g, '$1')
    .replace(/\\textit\{([^}]*)\}/g, '$1')
    .replace(/\\color\{[^}]*\}/g, '')
    .replace(/\\textcolor\{[^}]*\}\{([^}]*)\}/g, '$1')
    .replace(/\\fontsize\{[^}]*\}\{[^}]*\}\\selectfont/g, '')
    .replace(/\\selectfont/g, '')
    .replace(/\\bfseries/g, '')
    .replace(/\\large\b/g, '').replace(/\\Large\b/g, '').replace(/\\Huge\b/g, '')
    .replace(/\\small\b/g, '').replace(/\\scriptsize\b/g, '')
    .replace(/\\hfill\b/g, '')
    .replace(/\\rupee\b/g, 'Rs. ')
    .replace(/\\href\{[^}]*\}\{([^}]*)\}/g, '$1')
    .replace(/\{([^{}]*)\}/g, '$1')
    .replace(/\\\\/g, '')
    .replace(/\\_/g, '_')
    .replace(/\\%/g, '%')
    .replace(/\\#/g, '#')
    .replace(/\\&/g, '&')
    .replace(/\s{2,}/g, ' ')
    .trim();

/** Clean a captured value */
const cleanVal = (str = '') =>
  stripLatex(str)
    .replace(/[{}]/g, '')
    .replace(/\\+\[.*?\]/g, '')
    .replace(/\\\\/g, '')
    .trim();

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// CONTRACT PARSER
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export const parseContractLatexLive = (latexStr, fallback = {}) => {
  const ls = lines(latexStr);
  const result = { ...fallback };

  let afterPartiesHeader = false;
  let partiesDataRowCount = 0;
  let inSection1 = false;
  let inSection2 = false;
  let section1Lines = [];
  let section2Lines = [];

  for (let i = 0; i < ls.length; i++) {
    const s = ls[i].trim();

    if (/Contract Ref/.test(s)) {
      const m = s.match(/\\textcolor\{navyblue\}\{([^}]+)\}/) || s.match(/Contract Ref\s*\\?#:\}\s*([^\n\\]+)/);
      if (m) result.contractNo = m[1].replace(/\}/g, '').trim();
    }

    if (/Effective Date/.test(s)) {
      const m = s.match(/Effective Date:\}\s+([^}\\]+)/) || s.match(/Effective Date:\s*([^\n\\]+)/);
      if (m) result.date = cleanVal(m[1]);
    }

    if (/SERVICE PROVIDER.*CLIENT.*RECIPIENT/i.test(s)) {
      afterPartiesHeader = true;
      partiesDataRowCount = 0;
      continue;
    }

    if (afterPartiesHeader && s.includes('&')) {
      const parts = s.split('&');
      if (partiesDataRowCount === 0 && parts[1]) {
        const m = parts[1].match(/\\textbf\{\\color\{darkslate\}([^}]+)\}/) || parts[1].match(/\\textbf\{([^}]+)\}/);
        if (m) result.clientName = m[1].trim();
        partiesDataRowCount++;
      } else if (partiesDataRowCount === 1 && parts[1]) {
        const m = parts[1].match(/\{\\small\s+([^}]+)\}/);
        if (m && m[1].includes('@')) result.clientEmail = m[1].trim();
        afterPartiesHeader = false;
      }
    }

    if (/as requested by/i.test(s)) {
      const m = s.match(/\\textbf\{([^}]+)\}\s+as requested by/);
      if (m) result.service = m[1].trim();
      else {
        const prev = (ls[i - 1] || '').trim();
        const m2 = prev.match(/\\textbf\{([^}]+)\}/);
        if (m2) result.service = m2[1].trim();
      }
    }

    if (/fixed consideration of/i.test(s)) {
      const m = s.match(/\\textbf\{Rs\.\s*([\d,]+)\/-\}/i);
      if (m) result.amount = m[1].replace(/,/g, '').trim();
    }

    if (/\\section\*\{1\./.test(s)) { inSection1 = true; inSection2 = false; section1Lines = []; }
    else if (/\\section\*\{2\./.test(s)) {
      inSection2 = true; inSection1 = false; section2Lines = [];
      if (section1Lines.length) result.scopeText = section1Lines.map(stripLatex).join(' ').replace(/\s{2,}/g, ' ').trim();
    } else if (/\\section\*\{[3-9]/.test(s) || /\\vspace\{3em\}/.test(s)) {
      if (inSection2 && section2Lines.length) result.compText = section2Lines.map(stripLatex).join(' ').replace(/\s{2,}/g, ' ').trim();
      inSection1 = false; inSection2 = false;
    }

    if (inSection1 && !/\\section\*|\\color\{bodycolor\}/.test(s) && s) section1Lines.push(s);
    if (inSection2 && !/\\section\*|\\color\{bodycolor\}/.test(s) && s) section2Lines.push(s);
  }

  return result;
};

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// INVOICE PARSER â€” Block-Based Multi-Pass (handles any LaTeX template)
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

/**
 * Normalizes a LaTeX string into a single collapsed line for cross-line regex.
 * Preserves %comment lines stripped, and compresses all whitespace.
 */
const collapseLatex = (str = '') =>
  str
    .split('\n')
    .filter(l => !l.trim().startsWith('%'))   // strip comment lines
    .join(' ')
    .replace(/\s{2,}/g, ' ')
    .trim();

/**
 * Extract all occurrences of a top-level {...} after a command like \textbf
 * e.g. extractBraceGroup('\textbf{Hello}') â†’ 'Hello'
 */
const extractBraceGroup = (str) => {
  const m = str.match(/\{([^{}]*(?:\{[^{}]*\}[^{}]*)*)\}/);
  return m ? m[1].trim() : null;
};

/**
 * Normalize currency â€” converts \currency{X}, \rupee X, Rs. X â†’ numeric string
 */
const parseCurrency = (str = '') => {
  // \currency{35,000} â†’ '35,000'
  let m = str.match(/\\currency\{([^}]+)\}/);
  if (m) return Number(m[1].replace(/,/g, ''));
  // \rupee 35,000 or Rs. 35,000
  m = str.match(/(?:\\rupee|Rs\.)\s*([0-9,]+)/i);
  if (m) return Number(m[1].replace(/,/g, ''));
  // plain number
  m = str.match(/([0-9,]+)/);
  if (m) return Number(m[1].replace(/,/g, ''));
  return 0;
};

export const parseInvoiceLatexLive = (latexStr, fallback = {}) => {
  const result = { ...fallback };
  const flat = collapseLatex(latexStr);

  // 1. Invoice Number (Matches ZW-2026-0508, ZW-INV-2026-612, INV-001, etc.)
  const invM = flat.match(/\\color\{(?:blue|navy|primary|darktext)\}\s*([A-Z0-9]+-[A-Z0-9-]+)/i)
            || flat.match(/\b((?:ZW|INV)-[A-Z0-9-]+)/i)
            || flat.match(/Invoice\s*\\?#?\s*:?\s*\\?#?\s*([A-Z0-9-]+)/i);
  if (invM) {
    result.invoiceNo = invM[1].trim();
  }

  // 2. Invoice Date
  const dateM = flat.match(/\\smalllabel\{Invoice\s*Date\}[\s\S]*?\\body\{([^}]+)\}/i)
             || flat.match(/(?:Invoice\s*Date|Issued|Issue\s*Date)\s*:\s*(\\body\{)?([^}\\\n]+)/i);
  if (dateM) {
    const rawD = stripLatex(dateM[1] && !dateM[1].startsWith('\\') ? dateM[1] : dateM[2]);
    if (rawD && rawD.length >= 4) result.date = rawD.trim();
  }

  // 3. Due Date
  const dueM = flat.match(/\\smalllabel\{Due\s*Date\}[\s\S]*?\\body\{([^}]+)\}/i)
            || flat.match(/Due\s*Date\s*:\s*(\\body\{)?([^}\\\n]+)/i);
  if (dueM) {
    const rawDue = stripLatex(dueM[1] && !dueM[1].startsWith('\\') ? dueM[1] : dueM[2]);
    if (rawDue) result.dueDate = rawDue.trim();
  }

  // 4. Client Name & Client Email from BILL TO block
  const billToBlockM = flat.match(/(?:BILL\s*TO|Bill\s*To)[\s\S]{1,500}?(?=(?:PROJECT|SERVICES|PAYMENT|NOTES|\\end\{document\}))/i);
  if (billToBlockM) {
    const bt = billToBlockM[0];
    
    // Client Name: look for \bfseries or \color{darktext} or large text after BILL TO
    const cNameM = bt.match(/\\bfseries\s*\\color\{(?:darktext|navy|blue)\}\s*([A-Za-z0-9\s.,&'-]{2,60}?)(?=\s*\\|\s*\}|\s*\vspace)/i)
                || bt.match(/\\textbf\{([^}]{2,60}?)\}/i)
                || bt.match(/\\bfseries\s+([A-Za-z0-9\s.,&'-]{2,60}?)(?=\s*\\|\s*\}|\s*\vspace)/i);
    if (cNameM) {
      const cleanedC = stripLatex(cNameM[1]).trim();
      if (cleanedC && !/BILL\s*TO|Project|ZettaWeb/i.test(cleanedC)) {
        result.client = cleanedC;
      }
    }

    // Client Email
    const cEmailM = bt.match(/\\href\{mailto:([^}]+)\}/i)
                 || bt.match(/\b([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})\b/);
    if (cEmailM) {
      const em = cEmailM[1].trim();
      if (!/zettaweb|zetta-web/i.test(em)) {
        result.clientEmail = em;
      }
    }
  }

  // 5. Itemized Table Rows
  const parsedItems = [];
  const tableEnvRegex = /\\begin\{(?:tabularx|tabular)\}[\s\S]*?\\end\{(?:tabularx|tabular)\}/gi;
  let tableMatch;

  while ((tableMatch = tableEnvRegex.exec(flat)) !== null) {
    const tableBlock = tableMatch[0];

    // SKIP metadata tables, contact info tables, payment info tables, header-only tables
    if (/faCalendarAlt|faCalendarCheck|faClock|faRupeeSign|faMapMarker|faEnvelope|faGlobe|faPhone|faFileAlt/i.test(tableBlock)) {
      continue; // Metadata or contact info table
    }
    if (/Invoice\s*Date|Due\s*Date|Issue\s*Date|Payment\s*Terms|Currency\s*:|Bank\s*Name|Account\s*No|IFSC\s*Code|UPI\s*ID/i.test(tableBlock)) {
      continue; // Metadata or payment info table
    }
    if (/Subtotal|Taxable\s*Amount|CGST|SGST|Grand\s*Total|BALANCE\s*DUE/i.test(tableBlock)) {
      continue; // Totals table
    }
    if (/\\rowcolor\{navy\}\s*\\textcolor\{white\}\{\\bfseries\\#\}|DESCRIPTION\s*QTY\s*RATE/i.test(tableBlock) && !/01|02|03|35,000|25,000|20,000|7,500|5,000/i.test(tableBlock)) {
      continue; // Header-only row table
    }

    // Remove tabularx/tabular wrapper tags
    let content = tableBlock
      .replace(/^\\begin\{(?:tabularx|tabular)\}(?:\{[^}]*\})*/i, '')
      .replace(/\\end\{(?:tabularx|tabular)\}$/i, '')
      .trim();

    // Split rows on \\
    const rowStrings = content.split(/\\\\\s*(?!\[-)/).map(r => r.trim()).filter(Boolean);

    for (const rawRow of rowStrings) {
      if (/^\\(?:addlinespace|midrule|bottomrule|toprule|hline|rowcolor)/i.test(rawRow)) continue;
      if (/\\textcolor\{white\}\{\\bfseries/i.test(rawRow)) continue; // Header row
      if (/faCalendarAlt|faCalendarCheck|faClock|faRupeeSign|faFileAlt|faMapMarker|faEnvelope|faPhone|faGlobe/i.test(rawRow)) continue; // Metadata row
      if ((rawRow.match(/&/g) || []).length < 3) continue;

      const rawCols = rawRow.split('&').map(c => c.trim());

      // Handle 6-column format (# | Description | Qty | Rate | Tax | Amount)
      if (rawCols.length >= 6) {
        const rawDesc = rawCols[1];
        let name = stripLatex(rawDesc);
        name = name.replace(/beginminipage.*?cm/g, '').replace(/endminipage/g, '').replace(/\s{2,}/g, ' ').trim();

        const qty = parseFloat(stripLatex(rawCols[2])) || 1;
        const price = parseCurrency(rawCols[3]);

        if (name && name.length > 1 && !/DESCRIPTION|QTY|RATE|AMOUNT|TAX|Invoice\s*Date/i.test(name)) {
          parsedItems.push({ name, qty, price, discount: 0 });
        }
      } 
      // Handle 5-column format (Description | Qty | Rate | Disc/Tax | Amount)
      else if (rawCols.length === 5) {
        let name = stripLatex(rawCols[0]);
        name = name.replace(/beginminipage.*?cm/g, '').replace(/endminipage/g, '').replace(/\s{2,}/g, ' ').trim();

        const qty = parseFloat(stripLatex(rawCols[1])) || 1;
        const price = parseCurrency(rawCols[2]);
        const discStr = stripLatex(rawCols[3]).replace(/%/g, '').trim();
        const discount = parseFloat(discStr) || 0;

        if (name && name.length > 1 && !/DESCRIPTION|QTY|RATE|AMOUNT|Subtotal|Invoice\s*Date/i.test(name)) {
          parsedItems.push({ name, qty, price, discount });
        }
      }
      // Handle 4-column format (Description | Qty | Rate | Amount)
      else if (rawCols.length === 4) {
        let name = stripLatex(rawCols[0]);
        name = name.replace(/beginminipage.*?cm/g, '').replace(/endminipage/g, '').replace(/\s{2,}/g, ' ').trim();

        const qty = parseFloat(stripLatex(rawCols[1])) || 1;
        const price = parseCurrency(rawCols[2]);

        if (name && name.length > 1 && !/DESCRIPTION|QTY|RATE|AMOUNT|Invoice\s*Date/i.test(name)) {
          parsedItems.push({ name, qty, price, discount: 0 });
        }
      }
    }
  }

  // 6. Discount / Advance Payment
  const discM = flat.match(/Discount[\s\S]*?-\s*(?:\\rupee\\,?)?\s*([\d,.]+)/i)
             || flat.match(/Advance\s*Paid[\s\S]*?-\s*(?:\\rupee\\,?)?\s*([\d,.]+)/i);
  if (discM) {
    result.advancePayment = Number(discM[1].replace(/,/g, ''));
  }

  // 7. Notes / Remarks
  const notesM = flat.match(/NOTES\}[\s\S]*?\\color\{bodytext\}\s*([^}]+)/i)
              || flat.match(/\\smalllabel\{Notes\}[\s\S]*?\\body\{([^}]+)\}/i);
  if (notesM) {
    const rawNotes = stripLatex(notesM[1]).trim();
    if (rawNotes) result.remarks = rawNotes;
  }

  if (parsedItems.length > 0) {
    result.items = parsedItems;
  }

  // 8. Signature Company Name (e.g. For \textbf{ZettaWeb Technologies Pvt. Ltd.})
  const sigCompanyM = flat.match(/For\s*\\textbf\{([^}]+)\}/i)
                   || flat.match(/For\s*([A-Za-z0-9\s.,&'-]+?)(?=\s*\\|\s*\}|\s*\vspace)/i);
  if (sigCompanyM) {
    const rawSigComp = stripLatex(sigCompanyM[1]).trim();
    if (rawSigComp) result.signatureCompany = rawSigComp;
  }

  // Recalculate totals
  const newSubtotal = (result.items || []).reduce((acc, item) => {
    return acc + (Number(item.qty) || 0) * (Number(item.price) || 0) * (1 - (Number(item.discount) || 0) / 100);
  }, 0);
  result.subtotal = newSubtotal;
  result.finalTotal = Math.max(0, newSubtotal - (Number(result.advancePayment) || 0));

  return result;
};

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// LATEX GENERATORS
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export const generateContractLatex = ({
  contractNo = 'ZW-SA-2026-1001',
  date = new Date().toISOString().split('T')[0],
  clientName = 'Acme Corporation',
  clientEmail = 'legal@acme.com',
  service = 'Full-Stack Enterprise Portal Development',
  amount = '75000',
  companyLogo = null,
  signature = null,
  companyStamp = null,
}) => {
  const formattedAmount = Number(amount || 0).toLocaleString('en-IN');
  const logoLatex = companyLogo
    ? `% Company Logo Picture Attached\n\\includegraphics[height=1.4cm]{company_logo.png}\\\\[10pt]`
    : `{\\Huge \\textbf{\\color{navyblue}ZettaWeb}}\\\\[4pt]`;

  const sigLatex = signature
    ? `\\includegraphics[width=3.5cm]{client_signature.png}`
    : `\\rule{4cm}{0.4pt}\\\\[4pt]\n{\\small \\color{gray}[ Digital Signature Placeholder ]}`;

  const stampLatex = companyStamp
    ? `\\includegraphics[width=2.5cm]{company_stamp.png}`
    : `{\\small \\textbf{\\color{navyblue}ZettaWeb Founder}}\\\\[2pt]\n{\\scriptsize Authorized Officer}`;

  return `% =========================================================
% ZettaWeb Master Service Agreement - LaTeX Document
% Overleaf Compatible Template
% =========================================================
\\documentclass[11pt, a4paper]{article}

% --- Required LaTeX Packages ---
\\usepackage[utf8]{utf8}
\\usepackage[margin=1in]{geometry}
\\usepackage{graphicx}
\\usepackage{xcolor}
\\usepackage{hyperref}
\\usepackage{titlesec}
\\usepackage{array}
\\usepackage{fancyhdr}
\\usepackage{eso-pic}

% --- Permanent ZettaWeb Logo Background Watermark ---
\\AddToShipoutPictureBG*{%
  \\AtPageCenter{%
    \\makebox[0pt]{\\raisebox{-0.5\\height}{\\includegraphics[width=11cm]{logo.png}}}%
  }%
}

% --- Color Definitions ---
\\definecolor{navyblue}{RGB}{2, 132, 199}
\\definecolor{darkslate}{RGB}{15, 23, 42}
\\definecolor{bodycolor}{RGB}{51, 65, 85}
\\definecolor{lightbg}{RGB}{248, 250, 252}

% --- Page Setup & Header/Footer ---
\\pagestyle{fancy}
\\fancyhf{}
\\rhead{\\textcolor{gray}{\\scriptsize Ref: ${contractNo}}}
\\lhead{\\textcolor{gray}{\\scriptsize ZettaWeb Master Service Agreement}}
\\rfoot{\\textcolor{gray}{\\scriptsize Page \\thepage}}
\\lfoot{\\textcolor{gray}{\\scriptsize ZettaWeb Pvt. Ltd. \\cdot Enterprise Portal}}
\\renewcommand{\\headrulewidth}{0.4pt}
\\renewcommand{\\footrulewidth}{0.4pt}

\\begin{document}

% --- HEADER SECTION WITH OPTIONAL LOGO ---
\\begin{minipage}[t]{0.55\\textwidth}
  ${logoLatex}
  {\\Large \\textbf{\\color{darkslate}MASTER SERVICE AGREEMENT}}\\\\[4pt]
  {\\small \\textbf{Contract Ref \\#:} \\textcolor{navyblue}{${contractNo}}}\\\\[2pt]
  {\\small \\textbf{Effective Date:} ${date}}
\\end{minipage}
\\hfill
\\begin{minipage}[t]{0.40\\textwidth}
  \\begin{flushright}
    {\\large \\textbf{\\color{navyblue}ZettaWeb Pvt. Ltd.}}\\\\[2pt]
    {\\small support@zetta-web.in}\\\\[2pt]
    {\\small www.zetta-web.in}\\\\[2pt]
    {\\small Kolkata, West Bengal, India}
  \\end{flushright}
\\end{minipage}

\\vspace{1.5em}
\\hrule height 1.5pt \\color{navyblue}
\\vspace{1.5em}

% --- PARTIES GRID ---
\\colorbox{lightbg}{
  \\begin{minipage}{\\dimexpr\\textwidth-2\\fboxsep}
    \\vspace{6pt}
    \\begin{tabular}{p{0.46\\textwidth} p{0.46\\textwidth}}
      \\textbf{\\color{gray}\\scriptsize SERVICE PROVIDER} & \\textbf{\\color{gray}\\scriptsize CLIENT / RECIPIENT} \\\\[4pt]
      \\textbf{\\color{darkslate}ZettaWeb Pvt. Ltd.} & \\textbf{\\color{darkslate}${clientName || 'Valued Client'}} \\\\[2pt]
      {\\small Authorized Digital Provider} & {\\small ${clientEmail || 'client@company.com'}} \\\\
    \\end{tabular}
    \\vspace{6pt}
  \\end{minipage}
}

\\vspace{1.5em}

% --- TERMS & CLAUSES ---
\\section*{1. Scope of Work \\& Deliverables}
\\color{bodycolor}
The Service Provider agrees to perform design, engineering, and deployment services for 
\\textbf{${service}} as requested by \\textbf{${clientName || 'Client'}}. All deliverables shall comply with standard performance benchmarks and security requirements.

\\section*{2. Compensation \\& Financial Terms}
\\color{bodycolor}
The Client agrees to pay the fixed consideration of \\textbf{Rs. ${formattedAmount}/-} for the execution of the services detailed above. Payments shall be disbursed according to the agreed milestone schedule.

\\section*{3. Intellectual Property Rights}
\\color{bodycolor}
Upon receipt of full financial settlement, all custom source code, design assets, and technical documentation created specifically under this Agreement shall belong exclusively to the Client.

\\section*{4. Confidentiality \\& Non-Disclosure}
\\color{bodycolor}
Both parties agree to hold proprietary operational workflows, source code, data schemas, and trade secrets in strict confidence for a period of no less than three (3) years.

\\vspace{3em}

% --- SIGNATURE SECTION WITH PICTURES ---
\\noindent
\\begin{minipage}[t]{0.45\\textwidth}
  \\textbf{\\color{gray}\\scriptsize FOR ZETTAWEB PVT. LTD.}\\\\[15pt]
  ${stampLatex}\\\\[8pt]
  \\hrule width 4cm\\\\[4pt]
  {\\small Authorized Officer}\\\\[2pt]
  {\\scriptsize Date: ${date}}
\\end{minipage}
\\hfill
\\begin{minipage}[t]{0.45\\textwidth}
  \\textbf{\\color{gray}\\scriptsize FOR ${(clientName || 'CLIENT').toUpperCase()}}\\\\[15pt]
  ${sigLatex}\\\\[8pt]
  \\hrule width 4cm\\\\[4pt]
  {\\small Client Acceptance Signature}\\\\[2pt]
  {\\scriptsize Date: ${date}}
\\end{minipage}

\\end{document}
`;
};


export const generateInvoiceLatex = ({
  invoiceNo = 'ZW-2026-0001',
  date = '22 Aug 2026',
  dueDate = '14 Days',
  client = 'Acme Corporation',
  clientEmail = 'billing@acme.com',
  items = [],
  subtotal = 43250,
  advancePayment = 2500,
  finalTotal = 40750,
  remarks = 'Thank you for choosing ZettaWeb. We appreciate your business and look forward to working with you again.',
  companyLogo = null,
  signature = null,
}) => {
  const fmtINR = (n) => Number(n || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const gstRate = 0.18;
  const disc = Number(advancePayment || 0);
  const taxable = Math.max(0, Number(subtotal || 0) - disc);
  const cgst = taxable * (gstRate / 2);
  const sgst = taxable * (gstRate / 2);
  const grandTotal = taxable + cgst + sgst;

  const effectiveItems = items.length > 0 ? items : [
    { name: 'Website Design \\& Development', qty: 1, price: 35000, discount: 0 },
    { name: 'Frontend Development', qty: 1, price: 25000, discount: 0 },
    { name: 'Backend Development', qty: 1, price: 20000, discount: 0 },
  ];

  const logoLatex = companyLogo
    ? `\\\\includegraphics[width=5.9cm,height=3.9cm,keepaspectratio]{company_logo.png}`
    : `\\\\includegraphics[width=5.9cm,height=3.9cm,keepaspectratio]{logo.png}`;

  const sigLatex = signature
    ? `{\\\\fontsize{10}{12}\\\\selectfont\\\\itshape\\\\color{blue} Authorized}\\\\\\\\[4pt]
\\\\includegraphics[width=3.0cm]{authorized_signature.png}\\\\\\\\[4pt]
{\\\\fontsize{7.5}{9}\\\\selectfont\\\\bfseries\\\\color{darktext} Authorized Signatory}`
    : `{\\\\fontsize{21}{23}\\\\selectfont\\\\itshape\\\\color{blue} ZettaWeb}\\\\\\\\[4pt]
\\\\begin{tikzpicture}\\\\fill[gold](0,0) rectangle (2.7cm,0.04cm);\\\\end{tikzpicture}\\\\\\\\[4pt]
{\\\\fontsize{7.5}{9}\\\\selectfont\\\\bfseries\\\\color{darktext} Authorized Signatory}`;

  const itemRows = effectiveItems.map((item, idx) => {
    const num = String(idx + 1).padStart(2, '0');
    const qty = Number(item.qty) || 1;
    const price = Number(item.price) || 0;
    const disc0 = Number(item.discount) || 0;
    const rowAmt = qty * price * (1 - disc0 / 100);
    const nameEsc = (item.name || `Service ${idx + 1}`).replace(/&/g, '\\\\&').replace(/_/g, '\\\\_');
    return `
% ---------------------------------------------------------
% ROW ${num}
% ---------------------------------------------------------

\\\\begin{tabularx}{10.92cm}{
    >{\\\\centering\\\\arraybackslash}p{0.45cm}
    >{\\\\RaggedRight\\\\arraybackslash}X
    >{\\\\centering\\\\arraybackslash}p{0.65cm}
    >{\\\\raggedleft\\\\arraybackslash}p{1.25cm}
    >{\\\\centering\\\\arraybackslash}p{1.15cm}
    >{\\\\raggedleft\\\\arraybackslash}p{1.45cm}
}

{\\\\fontsize{9}{10}\\\\selectfont\\\\bfseries\\\\color{blue}${num}}
&
\\\\begin{minipage}{3.8cm}
{\\\\fontsize{8.2}{10}\\\\selectfont
\\\\bfseries
\\\\color{darktext}
${nameEsc}}
\\\\end{minipage}
&
${qty}
&
${fmtINR(price)}
&
18\\\\% GST
&
\\\\textbf{\\\\color{blue}${fmtINR(rowAmt)}}

\\\\\\\\[8pt]

\\\\end{tabularx}

\\\\begin{tikzpicture}
\\\\fill[border]
(0,0) rectangle (10.65cm,0.015cm);
\\\\end{tikzpicture}

\\\\vspace{5pt}
`;
  }).join('');

  return `% =========================================================
% ZETTAWEB PREMIUM CORPORATE INVOICE
% Split Layout / Navy + Gold / Modern Corporate
% Overleaf Compatible
% =========================================================

\\documentclass[9.5pt,a4paper]{article}

% =========================================================
% PACKAGES
% =========================================================

\\usepackage[utf8]{inputenc}
\\usepackage[T1]{fontenc}
\\usepackage{lmodern}

\\usepackage[
    top=0mm,
    bottom=0mm,
    left=0mm,
    right=0mm
]{geometry}

\\usepackage{xcolor}
\\usepackage{graphicx}
\\usepackage{tikz}
\\usepackage{tabularx}
\\usepackage{array}
\\usepackage{colortbl}
\\usepackage{booktabs}
\\usepackage{multirow}
\\usepackage{ragged2e}
\\usepackage{fontawesome5}
\\usepackage{hyperref}
\\usepackage{qrcode}
\\usepackage{eso-pic}
\\usepackage{lastpage}

\\usetikzlibrary{calc,positioning,fit,shapes.geometric,decorations.pathreplacing}

% =========================================================
% COLORS
% =========================================================

\\definecolor{navy}{HTML}{061B33}
\\definecolor{navy2}{HTML}{0B2745}
\\definecolor{navylight}{HTML}{163A5F}
\\definecolor{blue}{HTML}{1677C8}
\\definecolor{cyan}{HTML}{39B8E8}
\\definecolor{gold}{HTML}{D99A22}
\\definecolor{goldlight}{HTML}{F0B943}
\\definecolor{goldpale}{HTML}{FFF7E6}
\\definecolor{darktext}{HTML}{17233A}
\\definecolor{bodytext}{HTML}{344054}
\\definecolor{muted}{HTML}{667085}
\\definecolor{border}{HTML}{D9E2EC}
\\definecolor{lightbg}{HTML}{F4F7FA}
\\definecolor{cardbg}{HTML}{F1F6FB}
\\definecolor{red}{HTML}{E53935}
\\definecolor{white}{HTML}{FFFFFF}

% =========================================================
% HYPERLINK SETTINGS
% =========================================================

\\hypersetup{colorlinks=true,urlcolor=blue,linkcolor=blue,pdfborder={0 0 0}}

% =========================================================
% PAGE SETTINGS
% =========================================================

\\pagestyle{empty}
\\setlength{\\parindent}{0pt}
\\setlength{\\parskip}{0pt}
\\renewcommand{\\arraystretch}{1.25}

% =========================================================
% CUSTOM COMMANDS
% =========================================================

\\newcommand{\\rupee}{â‚¹}

\\newcommand{\\smalllabel}[1]{
    {\\fontsize{7.2}{8.5}\\selectfont
    \\bfseries
    \\color{muted}
    #1}
}

\\newcommand{\\body}[1]{
    {\\fontsize{8.2}{10.5}\\selectfont
    \\color{bodytext}
    #1}
}

\\newcommand{\\boldbody}[1]{
    {\\fontsize{8.2}{10.5}\\selectfont
    \\bfseries
    \\color{darktext}
    #1}
}

% =========================================================
% BACKGROUND LEFT PANEL
% =========================================================

\\AddToShipoutPictureBG*{
\\begin{tikzpicture}[remember picture,overlay]

    \\path[fill=navy]
    (current page.north west)
        rectangle
    ([xshift=8.35cm,yshift=-16.0cm] current page.north west);

    \\fill[navy]
    ([xshift=7.1cm,yshift=-16.0cm]current page.north west)
    --
    ([xshift=8.35cm,yshift=-16.0cm]current page.north west)
    --
    ([xshift=8.35cm,yshift=-14.5cm]current page.north west)
    --
    ([xshift=8.0cm,yshift=-15.0cm]current page.north west)
    --
    ([xshift=7.5cm,yshift=-15.5cm]current page.north west)
    --
    cycle;

    \\fill[navy2,opacity=0.35]
    (current page.north west)
    rectangle
    ([xshift=8.35cm,yshift=-7.0cm] current page.north west);

    \\fill[gold]
    ([xshift=0.35cm,yshift=-16.0cm]current page.north west)
    rectangle
    ([xshift=0.43cm,yshift=-29.7cm]current page.south west);

\\end{tikzpicture}
}

% =========================================================
% DOCUMENT
% =========================================================

\\begin{document}

% =========================================================
% LEFT BRANDING PANEL
% =========================================================

\\begin{tikzpicture}[remember picture,overlay]

% LOGO
\\node[anchor=north west] at ([xshift=0.75cm,yshift=-0.8cm]current page.north west)
{
    ${logoLatex}
};

% COMPANY NAME
\\node[anchor=north west] at ([xshift=0.42cm,yshift=-4.15cm]current page.north west)
{
\\begin{minipage}{7.2cm}
\\centering
{\\fontsize{24}{26}\\selectfont\\bfseries\\color{white}ZETTA}
{\\fontsize{24}{26}\\selectfont\\bfseries\\color{goldlight}WEB}
\\vspace{3pt}
{\\fontsize{7.2}{9}\\selectfont\\color{white}BUILDING IDEAS. EMPOWERING DIGITAL.}
\\end{minipage}
};

% COMPANY INFO
\\node[anchor=north west] at ([xshift=0.72cm,yshift=-7.05cm]current page.north west)
{
\\begin{minipage}{6.9cm}
\\color{white}
\\begin{tabular}{@{}c p{5.8cm}@{}}
{\\color{goldlight}\\Large\\faMapMarker*}
&
{\\fontsize{7.8}{10}\\selectfont
ZettaWeb Technologies Pvt. Ltd.\\\\
Bhubaneswar, Odisha, India - 751024}
\\\\[12pt]
{\\color{goldlight}\\Large\\faEnvelope}
&
{\\fontsize{7.8}{10}\\selectfont
\\href{mailto:hello@zettaweb.in}{\\color{white}hello@zettaweb.in}}
\\\\[12pt]
{\\color{goldlight}\\Large\\faGlobe}
&
{\\fontsize{7.8}{10}\\selectfont
\\href{https://www.zettaweb.in}{\\color{white}www.zettaweb.in}}
\\\\[12pt]
{\\color{goldlight}\\Large\\faPhone}
&
{\\fontsize{7.8}{10}\\selectfont +91 78478 01234}
\\end{tabular}
\\end{minipage}
};

% LEFT TAGLINE
\\node[anchor=south west] at ([xshift=0.65cm,yshift=1.35cm]current page.south west)
{
\\begin{minipage}{7.0cm}
{\\fontsize{7.2}{9}\\selectfont\\color{white}\\bfseries BUILDING DIGITAL EXPERIENCES}
{\\fontsize{7.2}{9}\\selectfont\\color{goldlight}\\bfseries THAT DRIVE GROWTH.}
\\end{minipage}
};

\\end{tikzpicture}

% =========================================================
% MAIN CONTENT AREA
% =========================================================

\\hspace*{8.75cm}
\\begin{minipage}[t]{11.0cm}

\\vspace*{0.7cm}

% =========================================================
% INVOICE HEADER
% =========================================================

\\begin{minipage}[t]{6.2cm}

{\\fontsize{30}{33}\\selectfont\\bfseries\\color{navy}INVOICE}

\\vspace{4pt}

\\begin{tikzpicture}
\\fill[gold] (0,0) rectangle (1.15cm,0.075cm);
\\end{tikzpicture}

\\end{minipage}
\\hfill
\\begin{minipage}[t]{4.0cm}
\\raggedleft
{\\fontsize{7.5}{9}\\selectfont\\bfseries\\color{darktext}INVOICE NO.}
\\vspace{3pt}
{\\fontsize{15}{17}\\selectfont\\bfseries\\color{blue}${invoiceNo}}
\\end{minipage}

\\vspace{20pt}

% =========================================================
% INVOICE METADATA
% =========================================================

\\begin{minipage}[t]{6.5cm}
\\begin{tabular}{@{}c l c l@{}}

\\faCalendarAlt
&
\\smalllabel{Invoice Date}
&
:
&
\\body{${date}}

\\\\[7pt]

\\faCalendarCheck
&
\\smalllabel{Due Date}
&
:
&
\\body{${dueDate}}

\\\\[7pt]

\\faClock
&
\\smalllabel{Payment Terms}
&
:
&
\\body{${dueDate}}

\\\\[7pt]

\\faRupeeSign
&
\\smalllabel{Currency}
&
:
&
\\body{INR}

\\end{tabular}
\\end{minipage}
\\hfill
\\begin{minipage}[t]{3.7cm}
\\begin{tikzpicture}
\\draw[color=border,dashed,line width=0.7pt] (0,0) -- (0,-3.55cm);
\\end{tikzpicture}
\\end{minipage}

\\vspace{8pt}

% =========================================================
% WATERMARK LOGO
% =========================================================

\\begin{tikzpicture}[remember picture,overlay]
\\node[opacity=0.055] at ([xshift=15.6cm,yshift=-5.0cm]current page.north west)
{\\includegraphics[width=4.4cm]{logo.png}};
\\end{tikzpicture}

% =========================================================
% DIVIDER
% =========================================================

\\begin{tikzpicture}
\\fill[border] (0,0) rectangle (10.95cm,0.02cm);
\\end{tikzpicture}

\\vspace{12pt}

% =========================================================
% BILL TO + PROJECT REFERENCE
% =========================================================

\\begin{minipage}[t]{6.1cm}

\\begin{tikzpicture}
\\node[circle,fill=gold,minimum size=0.7cm,inner sep=0pt]{\\color{white}\\faUser};
\\end{tikzpicture}
\\hspace{5pt}
{\\fontsize{10}{12}\\selectfont\\bfseries\\color{gold}BILL TO}

\\vspace{7pt}

{\\fontsize{10.5}{13}\\selectfont\\bfseries\\color{darktext}${(client || 'Acme Corporation').replace(/&/g, '\\\\&')}}

\\vspace{4pt}

\\body{${(clientEmail || 'billing@acme.com').replace(/&/g, '\\\\&')}}

\\end{minipage}
\\hfill
\\begin{minipage}[t]{4.25cm}

\\begin{tikzpicture}
\\node[fill=cardbg,rounded corners=8pt,inner sep=11pt,text width=3.7cm,anchor=north west]{
\\begin{minipage}{3.5cm}

{\\color{navy}\\faBriefcase}
\\hspace{5pt}
{\\fontsize{8.3}{10}\\selectfont\\bfseries\\color{blue}PROJECT / REFERENCE}

\\vspace{10pt}

{\\fontsize{8.2}{10.5}\\selectfont\\color{darktext}Digital Solutions}

\\vspace{9pt}

\\begin{tikzpicture}\\fill[gold](0,0) rectangle (0.8cm,0.055cm);\\end{tikzpicture}

\\vspace{7pt}

{\\fontsize{7.8}{9}\\selectfont\\color{bodytext}Project ID: \\textbf{ZW-TN-${String(Date.now()).slice(-4)}}}

\\end{minipage}
};
\\end{tikzpicture}

\\end{minipage}

\\vspace{18pt}

% =========================================================
% SERVICES TABLE
% =========================================================

\\begin{tikzpicture}
\\node[anchor=north west,fill=white,draw=border,rounded corners=7pt,inner sep=0pt,minimum width=10.95cm] at (0,0) {
\\begin{minipage}{10.92cm}

% TABLE HEADER
\\rowcolors{2}{white}{white}
\\begin{tabularx}{10.92cm}{
    >{\\centering\\arraybackslash}p{0.45cm}
    >{\\RaggedRight\\arraybackslash}X
    >{\\centering\\arraybackslash}p{0.65cm}
    >{\\raggedleft\\arraybackslash}p{1.25cm}
    >{\\centering\\arraybackslash}p{1.15cm}
    >{\\raggedleft\\arraybackslash}p{1.45cm}
}
\\rowcolor{navy}
\\textcolor{white}{\\bfseries\\#}
&
\\textcolor{white}{\\bfseries DESCRIPTION}
&
\\textcolor{white}{\\bfseries QTY}
&
\\textcolor{white}{\\bfseries RATE (INR)}
&
\\textcolor{white}{\\bfseries TAX}
&
\\textcolor{white}{\\bfseries AMOUNT (INR)}
\\\\[-1pt]
\\end{tabularx}

\\vspace{2pt}

${itemRows}

\\vspace{2pt}

\\end{minipage}
};
\\end{tikzpicture}

\\vspace{15pt}

% =========================================================
% PAYMENT + TOTALS
% =========================================================

\\begin{minipage}[t]{5.35cm}

\\begin{tikzpicture}
\\node[fill=cardbg,rounded corners=8pt,inner sep=12pt,text width=4.8cm,anchor=north west]{

\\begin{tikzpicture}
\\node[circle,fill=navy,minimum size=0.7cm,inner sep=0pt]{\\color{white}\\faUniversity};
\\end{tikzpicture}
\\hspace{4pt}
{\\fontsize{9}{11}\\selectfont\\bfseries\\color{blue}PAYMENT DETAILS}

\\vspace{9pt}

\\begin{tabular}{@{}p{1.15cm} p{2.9cm}@{}}
\\fontsize{7.3}{9}\\selectfont Bank Name & \\fontsize{7.3}{9}\\selectfont : HDFC Bank \\\\[5pt]
\\fontsize{7.3}{9}\\selectfont Account No. & \\fontsize{7.3}{9}\\selectfont : 50200012345678 \\\\[5pt]
\\fontsize{7.3}{9}\\selectfont IFSC Code & \\fontsize{7.3}{9}\\selectfont : HDFC0001234 \\\\[5pt]
\\fontsize{7.3}{9}\\selectfont UPI ID & \\fontsize{7.3}{9}\\selectfont : zettaweb@oksbi
\\end{tabular}

};
\\end{tikzpicture}

\\end{minipage}
\\hfill
\\begin{minipage}[t]{5.25cm}

\\begin{tikzpicture}
\\node[draw=border,rounded corners=8pt,inner sep=0pt,text width=5.05cm,anchor=north west]{
\\begin{minipage}{5.0cm}

\\vspace{10pt}

\\begin{tabular}{@{}p{2.7cm}r@{}}
\\fontsize{8}{10}\\selectfont Subtotal & \\fontsize{8}{10}\\selectfont \\rupee\\,${fmtINR(subtotal)} \\\\[6pt]
\\fontsize{8}{10}\\selectfont Discount & \\fontsize{8}{10}\\selectfont \\color{red}-\\rupee\\,${fmtINR(disc)} \\\\[6pt]
\\fontsize{8}{10}\\selectfont Taxable Amount & \\fontsize{8}{10}\\selectfont \\rupee\\,${fmtINR(taxable)} \\\\[6pt]
\\fontsize{8}{10}\\selectfont CGST (9\\%) & \\fontsize{8}{10}\\selectfont \\rupee\\,${fmtINR(cgst)} \\\\[6pt]
\\fontsize{8}{10}\\selectfont SGST (9\\%) & \\fontsize{8}{10}\\selectfont \\rupee\\,${fmtINR(sgst)}
\\end{tabular}

\\vspace{8pt}

\\begin{tikzpicture}
\\fill[navy] (0,0) rectangle (5.0cm,0.78cm);
\\node[anchor=west] at (0.25cm,0.39cm)
{{\\fontsize{9}{11}\\selectfont\\bfseries\\color{white}GRAND TOTAL}};
\\node[anchor=east] at (4.75cm,0.39cm)
{{\\fontsize{14}{16}\\selectfont\\bfseries\\color{goldlight}\\rupee\\,${fmtINR(grandTotal)}}};
\\end{tikzpicture}

\\end{minipage}
};
\\end{tikzpicture}

\\end{minipage}

\\vspace{15pt}

% =========================================================
% NOTES + SIGNATURE + QR
% =========================================================

\\begin{minipage}[t]{4.2cm}

\\begin{tikzpicture}
\\node[circle,fill=navy,minimum size=0.7cm,inner sep=0pt]{\\color{white}\\faFileAlt};
\\end{tikzpicture}
\\hspace{4pt}
{\\fontsize{9}{11}\\selectfont\\bfseries\\color{blue}NOTES}

\\vspace{7pt}

{\\fontsize{7.5}{9.5}\\selectfont\\color{bodytext}
${(remarks || 'Thank you for choosing ZettaWeb.').replace(/&/g, '\\\\&')}}

\\end{minipage}
\\hfill
\\begin{minipage}[t]{3.3cm}
\\begin{center}
{\\fontsize{7.5}{9}\\selectfont\\color{bodytext}For \\textbf{ZettaWeb Technologies Pvt. Ltd.}}
\\vspace{7pt}
${sigLatex}
\\end{center}
\\end{minipage}
\\hfill
\\begin{minipage}[t]{2.4cm}
\\begin{tikzpicture}
\\node[fill=navy,minimum width=2.25cm,minimum height=2.25cm,inner sep=4pt,anchor=north]{
\\qrcode[height=1.75cm]{upi://pay?pa=zettaweb@oksbi\\&pn=ZettaWeb}
};
\\node[anchor=north] at (1.125cm,-2.35cm){{\\fontsize{7.2}{8}\\selectfont\\bfseries\\color{darktext}Scan to Pay}};
\\end{tikzpicture}
\\end{minipage}

% =========================================================
% BOTTOM FOOTER
% =========================================================

\\vspace{15pt}

\\begin{tikzpicture}[remember picture,overlay]

\\fill[navy]
([xshift=8.35cm,yshift=1.15cm]current page.south west)
rectangle
([xshift=21cm,yshift=0cm]current page.south west);

\\fill[gold]
([xshift=16.1cm,yshift=1.15cm]current page.south west)
--
([xshift=17.0cm,yshift=1.15cm]current page.south west)
--
([xshift=21cm,yshift=0cm]current page.south west)
--
([xshift=15.9cm,yshift=0cm]current page.south west)
--
cycle;

\\node[anchor=west] at ([xshift=8.75cm,yshift=0.57cm]current page.south west)
{{\\fontsize{7.2}{8}\\selectfont\\color{white}\\textbullet\\quad BUILDING DIGITAL EXPERIENCES \\quad\\color{goldlight}THAT DRIVE GROWTH.}};

\\end{tikzpicture}

\\vspace*{1.0cm}

\\end{minipage}

\\end{document}
`;
};


/**
 * Find line number of a section key in the LaTeX string for SyncTeX inverse search.
 */
export const findLatexLineNumber = (latexStr, sectionKey) => {
  if (!latexStr) return 1;
  const ls = latexStr.split('\n');

  const patternMap = {
    header:       [/INVOICE NO\./i, /INVOICE/i, /MASTER SERVICE AGREEMENT/i],
    ref:          [/INVOICE NO\./i, /Contract Ref \\#/i, /Invoice \\#/i, /ZW-2026-/i, /ZW-INV-/i],
    branding:     [/ZettaWeb Technologies Pvt\. Ltd\./i, /BUILDING IDEAS/i, /LEFT BRANDING/i],
    client:       [/BILL TO/i, /Bill To/i, /BILLED TO/i, /CLIENT \/ RECIPIENT/i],
    scope:        [/1\. Scope of Work/i, /Services & Charges/i, /Scope of Work/i],
    compensation: [/2\. Compensation/i, /Payment Summary/i, /fixed consideration/i],
    ip:           [/3\. Intellectual Property/i],
    confidentiality: [/4\. Confidentiality/i],
    items:        [/SERVICES TABLE/i, /Services & Charges/i, /DESCRIPTION/i, /ITEMIZED BILLING TABLE/i, /tabularx/i, /tabular/i],
    totals:       [/PAYMENT DETAILS/i, /GRAND TOTAL/i, /PAYMENT \+ TOTALS/i, /Subtotal/i, /Taxable Amount/i, /Payment Summary/i, /BALANCE DUE/i],
    signatures:   [/For \\textbf\{/i, /For ZettaWeb/i, /Authorized Signatory/i, /\\itshape\\color\{blue\}\s*ZettaWeb/i, /SIGNATURE/i],
    remarks:      [/\\color\{blue\}NOTES/i, /NOTES/i, /Notes & Remarks/i, /Notes \\& Remarks/i, /Payment Information/i],
  };

  const patterns = patternMap[sectionKey] || [];
  for (const pat of patterns) {
    for (let i = 0; i < ls.length; i++) {
      if (pat.test(ls[i])) return i + 1;
    }
  }
  return 1;
};
