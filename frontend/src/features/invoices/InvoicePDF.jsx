import React from 'react';
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
  Font,
} from '@react-pdf/renderer';

const fontRegularUrl = typeof window !== 'undefined' ? `${window.location.origin}/fonts/NotoSans-Regular.ttf` : '/fonts/NotoSans-Regular.ttf';
const fontBoldUrl = typeof window !== 'undefined' ? `${window.location.origin}/fonts/NotoSans-Bold.ttf` : '/fonts/NotoSans-Bold.ttf';
const fontItalicUrl = typeof window !== 'undefined' ? `${window.location.origin}/fonts/NotoSans-Italic.ttf` : '/fonts/NotoSans-Italic.ttf';

try {
  Font.register({
    family: 'NotoSans',
    fonts: [
      { src: fontRegularUrl, fontWeight: 'normal' },
      { src: fontBoldUrl, fontWeight: 'bold' },
      { src: fontItalicUrl, fontStyle: 'italic' },
    ],
  });
} catch (e) {
  console.warn('Font registration fallback', e);
}

const styles = StyleSheet.create({
  page: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    fontFamily: 'NotoSans',
    fontSize: 9,
    position: 'relative',
  },

  // WATERMARK LOGO
  watermark: {
    position: 'absolute',
    top: 190,
    right: 30,
    width: 240,
    height: 240,
    opacity: 0.04,
    objectFit: 'contain',
  },

  // LEFT BRANDING PANEL (33% width)
  leftPanel: {
    width: '33%',
    height: 842,
    backgroundColor: '#061B33',
    color: '#FFFFFF',
    padding: 18,
    flexDirection: 'column',
    justifyContent: 'space-between',
    borderRightWidth: 3,
    borderRightColor: '#D99A22',
  },
  logo: {
    width: '100%',
    maxHeight: 55,
    objectFit: 'contain',
    marginBottom: 8,
  },
  brandTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  brandGold: {
    color: '#F0B943',
  },
  brandTagline: {
    fontSize: 6.5,
    color: '#CBD5E1',
    textAlign: 'center',
    marginTop: 2,
    letterSpacing: 0.5,
  },
  infoSection: {
    marginTop: 15,
    borderTopWidth: 0.5,
    borderTopColor: '#334155',
    paddingTop: 12,
  },
  infoItem: {
    marginBottom: 9,
  },
  infoLabel: {
    fontSize: 7,
    fontWeight: 'bold',
    color: '#F0B943',
    marginBottom: 2,
    letterSpacing: 0.5,
  },
  infoValue: {
    fontSize: 7.5,
    color: '#E2E8F0',
    lineHeight: 1.25,
  },
  leftFooter: {
    borderTopWidth: 0.5,
    borderTopColor: '#334155',
    paddingTop: 10,
  },
  leftFooterText: {
    fontSize: 6.5,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  leftFooterGold: {
    fontSize: 6.5,
    fontWeight: 'bold',
    color: '#F0B943',
    letterSpacing: 0.3,
  },

  // RIGHT CONTENT AREA (67% width)
  rightPanel: {
    width: '67%',
    height: 842,
    flexDirection: 'column',
    justifyContent: 'space-between',
    position: 'relative',
    backgroundColor: '#FFFFFF',
  },
  rightContent: {
    paddingTop: 18,
    paddingHorizontal: 20,
    paddingBottom: 6,
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  invoiceTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#061B33',
    letterSpacing: 0.5,
  },
  titleBar: {
    width: 38,
    height: 3,
    backgroundColor: '#D99A22',
    marginTop: 3,
    borderRadius: 1.5,
  },
  invNoLabel: {
    fontSize: 7,
    fontWeight: 'bold',
    color: '#64748B',
    textAlign: 'right',
    letterSpacing: 0.5,
  },
  invNoVal: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#1677C8',
    textAlign: 'right',
    marginTop: 2,
  },
  metaGrid: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingTop: 6,
    marginBottom: 10,
  },
  metaCol: {
    flex: 1,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 2.5,
    paddingRight: 8,
  },
  metaKey: {
    fontSize: 7.5,
    color: '#64748B',
  },
  metaVal: {
    fontSize: 7.5,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  billRefGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  billBox: {
    width: '56%',
  },
  billBadge: {
    fontSize: 7.5,
    fontWeight: 'bold',
    color: '#D99A22',
    marginBottom: 2,
    letterSpacing: 0.5,
  },
  clientName: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  clientSub: {
    fontSize: 7.5,
    color: '#475569',
    marginTop: 1.5,
  },
  projCard: {
    width: '40%',
    backgroundColor: '#F1F6FB',
    padding: 7,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  projTitle: {
    fontSize: 7.5,
    fontWeight: 'bold',
    color: '#1677C8',
    marginBottom: 2,
  },
  projSub: {
    fontSize: 7.5,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  projBar: {
    width: 20,
    height: 1.5,
    backgroundColor: '#D99A22',
    marginVertical: 2,
  },
  projId: {
    fontSize: 6.5,
    color: '#64748B',
  },
  table: {
    marginBottom: 9,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#061B33',
    paddingVertical: 4,
    paddingHorizontal: 4,
  },
  thNum: { width: '8%', fontSize: 7, fontWeight: 'bold', color: '#FFFFFF', textAlign: 'center' },
  thDesc: { width: '42%', fontSize: 7, fontWeight: 'bold', color: '#FFFFFF' },
  thQty: { width: '10%', fontSize: 7, fontWeight: 'bold', color: '#FFFFFF', textAlign: 'center' },
  thRate: { width: '16%', fontSize: 7, fontWeight: 'bold', color: '#FFFFFF', textAlign: 'right' },
  thTax: { width: '10%', fontSize: 7, fontWeight: 'bold', color: '#FFFFFF', textAlign: 'center' },
  thAmt: { width: '14%', fontSize: 7, fontWeight: 'bold', color: '#FFFFFF', textAlign: 'right' },
  
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 3.5,
    paddingHorizontal: 4,
    borderBottomWidth: 0.5,
    borderBottomColor: '#E2E8F0',
    alignItems: 'center',
  },
  tableRowAlt: {
    backgroundColor: '#F8FAFC',
  },
  tdNum: { width: '8%', fontSize: 7.5, fontWeight: 'bold', color: '#1677C8', textAlign: 'center' },
  tdDesc: { width: '42%', fontSize: 7.5, fontWeight: 'bold', color: '#1E293B' },
  tdQty: { width: '10%', fontSize: 7.5, color: '#475569', textAlign: 'center' },
  tdRate: { width: '16%', fontSize: 7.5, color: '#475569', textAlign: 'right' },
  tdTax: { width: '10%', fontSize: 7, color: '#64748B', textAlign: 'center' },
  tdAmt: { width: '14%', fontSize: 7.5, fontWeight: 'bold', color: '#1677C8', textAlign: 'right' },

  bottomGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  paymentCard: {
    width: '48%',
    backgroundColor: '#F1F6FB',
    padding: 7,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  paymentTitle: {
    fontSize: 7.5,
    fontWeight: 'bold',
    color: '#1677C8',
    marginBottom: 3,
  },
  paymentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 1.5,
  },
  paymentKey: {
    fontSize: 7,
    color: '#64748B',
  },
  paymentVal: {
    fontSize: 7,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  totalsCard: {
    width: '48%',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  totalsBody: {
    padding: 5,
  },
  totalsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 2,
    fontSize: 7.5,
    color: '#475569',
  },
  grandTotalBar: {
    backgroundColor: '#061B33',
    paddingVertical: 4,
    paddingHorizontal: 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  grandTotalLabel: {
    fontSize: 7.5,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  grandTotalVal: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#F0B943',
  },
  footerNotesGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: 6,
    borderTopWidth: 0.5,
    borderTopColor: '#E2E8F0',
    paddingTop: 6,
  },
  notesCol: {
    width: '40%',
  },
  notesTitle: {
    fontSize: 7.5,
    fontWeight: 'bold',
    color: '#1677C8',
    marginBottom: 2,
  },
  notesBody: {
    fontSize: 7,
    color: '#475569',
    lineHeight: 1.25,
  },
  sigCol: {
    width: '36%',
    textAlign: 'center',
    alignItems: 'center',
  },
  sigFor: {
    fontSize: 7,
    color: '#475569',
    marginBottom: 2,
    textAlign: 'center',
  },
  sigImage: {
    height: 25,
    maxHeight: 25,
    marginBottom: 2,
    objectFit: 'contain',
  },
  sigLine: {
    width: 75,
    height: 1,
    backgroundColor: '#D99A22',
    marginVertical: 2,
  },
  sigTitle: {
    fontSize: 7.5,
    fontWeight: 'bold',
    color: '#0F172A',
    textAlign: 'center',
  },
  qrCol: {
    width: '20%',
    alignItems: 'center',
    textAlign: 'center',
  },
  qrNavyBox: {
    backgroundColor: '#061B33',
    padding: 3,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qrWhiteBox: {
    width: 32,
    height: 32,
    backgroundColor: '#FFFFFF',
    borderRadius: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qrText: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#061B33',
  },
  qrLabel: {
    fontSize: 6.5,
    fontWeight: 'bold',
    color: '#1E293B',
    marginTop: 2,
  },
  bottomFooter: {
    backgroundColor: '#061B33',
    borderTopWidth: 1.5,
    borderTopColor: '#D99A22',
    height: 22,
    paddingHorizontal: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bottomFooterText: {
    fontSize: 6.5,
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  bottomFooterGold: {
    fontSize: 6.5,
    fontWeight: 'bold',
    color: '#F0B943',
  },
});

const watermarkLogoUrl = typeof window !== 'undefined' ? `${window.location.origin}/logo.png` : '/logo.png';

export const InvoicePDF = ({
  invoiceNo = 'ZW-2026-0508',
  date = '23 May, 2026',
  dueDate = '14 Days',
  client = 'TechNova Solutions Pvt. Ltd.',
  clientEmail = 'info@technova.com',
  items = [],
  subtotal = 92500,
  advancePayment = 2500,
  finalTotal = 90000,
  remarks = 'Thank you for choosing ZettaWeb. We appreciate your business and look forward to working with you again.',
  signature = null,
  companyLogo = null,
  signatureCompany = 'ZettaWeb Technologies Pvt. Ltd.',
}) => {
  const fmtINR = (n) => Number(n || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const sub = Number(subtotal || 0);
  const disc = Number(advancePayment || 0);
  const taxable = Math.max(0, sub - disc);
  const cgst = taxable * 0.09;
  const sgst = taxable * 0.09;
  const grandTotal = taxable + cgst + sgst;

  const displayItems = items.length > 0 ? items : [
    { name: 'Website Design & Development', qty: 1, price: 35000, discount: 0 },
    { name: 'Frontend Development', qty: 1, price: 25000, discount: 0 },
    { name: 'Backend Development', qty: 1, price: 20000, discount: 0 },
    { name: 'Testing & QA', qty: 1, price: 7500, discount: 0 },
    { name: 'Deployment & Support (30 Days)', qty: 1, price: 5000, discount: 0 },
  ];

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        
        {/* WATERMARK LOGO */}
        <Image src={watermarkLogoUrl} style={styles.watermark} />

        {/* LEFT NAVY SIDEBAR */}
        <View style={styles.leftPanel}>
          <View>
            {companyLogo ? (
              <Image src={companyLogo} style={styles.logo} />
            ) : (
              <Image src={watermarkLogoUrl} style={styles.logo} />
            )}
            <Text style={styles.brandTitle}>
              ZETTA<Text style={styles.brandGold}>WEB</Text>
            </Text>
            <Text style={styles.brandTagline}>BUILDING IDEAS. EMPOWERING DIGITAL.</Text>

            <View style={styles.infoSection}>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>LOCATION</Text>
                <Text style={styles.infoValue}>ZettaWeb Technologies Pvt. Ltd.</Text>
                <Text style={styles.infoValue}>Bhubaneswar, Odisha - 751024</Text>
              </View>

              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>EMAIL</Text>
                <Text style={styles.infoValue}>hello@zettaweb.in</Text>
              </View>

              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>WEBSITE</Text>
                <Text style={styles.infoValue}>www.zettaweb.in</Text>
              </View>

              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>PHONE</Text>
                <Text style={styles.infoValue}>+91 78478 01234</Text>
              </View>
            </View>
          </View>

          <View style={styles.leftFooter}>
            <Text style={styles.leftFooterText}>BUILDING DIGITAL EXPERIENCES</Text>
            <Text style={styles.leftFooterGold}>THAT DRIVE GROWTH.</Text>
          </View>
        </View>

        {/* RIGHT CONTENT AREA */}
        <View style={styles.rightPanel}>
          
          <View style={styles.rightContent}>
            <View>
              {/* Header Title & Invoice No */}
              <View style={styles.headerRow}>
                <View>
                  <Text style={styles.invoiceTitle}>INVOICE</Text>
                  <View style={styles.titleBar} />
                </View>
                <View>
                  <Text style={styles.invNoLabel}>INVOICE NO.</Text>
                  <Text style={styles.invNoVal}>{invoiceNo}</Text>
                </View>
              </View>

              {/* Metadata Grid */}
              <View style={styles.metaGrid}>
                <View style={styles.metaCol}>
                  <View style={styles.metaRow}>
                    <Text style={styles.metaKey}>Invoice Date :</Text>
                    <Text style={styles.metaVal}>{date}</Text>
                  </View>
                  <View style={styles.metaRow}>
                    <Text style={styles.metaKey}>Due Date :</Text>
                    <Text style={styles.metaVal}>{dueDate || '14 Days'}</Text>
                  </View>
                  <View style={styles.metaRow}>
                    <Text style={styles.metaKey}>Issue Date :</Text>
                    <Text style={styles.metaVal}>{date}</Text>
                  </View>
                </View>
                <View style={styles.metaCol}>
                  <View style={styles.metaRow}>
                    <Text style={styles.metaKey}>Payment Terms :</Text>
                    <Text style={styles.metaVal}>{dueDate || '14 Days'}</Text>
                  </View>
                  <View style={styles.metaRow}>
                    <Text style={styles.metaKey}>Currency :</Text>
                    <Text style={styles.metaVal}>INR</Text>
                  </View>
                </View>
              </View>

              {/* Bill To & Project Card */}
              <View style={styles.billRefGrid}>
                <View style={styles.billBox}>
                  <Text style={styles.billBadge}>BILL TO</Text>
                  <Text style={styles.clientName}>{client || 'Valued Client'}</Text>
                  <Text style={styles.clientSub}>{clientEmail || 'billing@acme.com'}</Text>
                </View>

                <View style={styles.projCard}>
                  <Text style={styles.projTitle}>PROJECT / REFERENCE</Text>
                  <Text style={styles.projSub}>Digital Solutions</Text>
                  <View style={styles.projBar} />
                  <Text style={styles.projId}>Project ID: ZW-REF-0426</Text>
                </View>
              </View>

              {/* Items Table */}
              <View style={styles.table}>
                <View style={styles.tableHeader}>
                  <Text style={styles.thNum}>#</Text>
                  <Text style={styles.thDesc}>DESCRIPTION</Text>
                  <Text style={styles.thQty}>QTY</Text>
                  <Text style={styles.thRate}>RATE (INR)</Text>
                  <Text style={styles.thTax}>TAX</Text>
                  <Text style={styles.thAmt}>AMOUNT (INR)</Text>
                </View>

                {displayItems.map((item, idx) => {
                  const q = Number(item.qty) || 1;
                  const p = Number(item.price) || 0;
                  const d = Number(item.discount) || 0;
                  const rowAmt = q * p * (1 - d / 100);

                  return (
                    <View style={[styles.tableRow, idx % 2 === 1 ? styles.tableRowAlt : {}]} key={idx}>
                      <Text style={styles.tdNum}>{String(idx + 1).padStart(2, '0')}</Text>
                      <Text style={styles.tdDesc}>{item.name || `Service ${idx + 1}`}</Text>
                      <Text style={styles.tdQty}>{q}</Text>
                      <Text style={styles.tdRate}>{fmtINR(p)}</Text>
                      <Text style={styles.tdTax}>18% GST</Text>
                      <Text style={styles.tdAmt}>{fmtINR(rowAmt)}</Text>
                    </View>
                  );
                })}
              </View>

              {/* Payment Details & Totals Breakdown */}
              <View style={styles.bottomGrid}>
                <View style={styles.paymentCard}>
                  <Text style={styles.paymentTitle}>PAYMENT DETAILS</Text>
                  <View style={styles.paymentRow}><Text style={styles.paymentKey}>Bank Name :</Text><Text style={styles.paymentVal}>HDFC Bank</Text></View>
                  <View style={styles.paymentRow}><Text style={styles.paymentKey}>Account No. :</Text><Text style={styles.paymentVal}>50200012345678</Text></View>
                  <View style={styles.paymentRow}><Text style={styles.paymentKey}>IFSC Code :</Text><Text style={styles.paymentVal}>HDFC0001234</Text></View>
                  <View style={styles.paymentRow}><Text style={styles.paymentKey}>UPI ID :</Text><Text style={styles.paymentVal}>zettaweb@oksbi</Text></View>
                </View>

                <View style={styles.totalsCard}>
                  <View style={styles.totalsBody}>
                    <View style={styles.totalsRow}><Text>Subtotal</Text><Text>₹{fmtINR(sub)}</Text></View>
                    <View style={styles.totalsRow}><Text style={{ color: '#E53935' }}>Discount</Text><Text style={{ color: '#E53935' }}>-₹{fmtINR(disc)}</Text></View>
                    <View style={styles.totalsRow}><Text>Taxable Amount</Text><Text>₹{fmtINR(taxable)}</Text></View>
                    <View style={styles.totalsRow}><Text>CGST (9%)</Text><Text>₹{fmtINR(cgst)}</Text></View>
                    <View style={styles.totalsRow}><Text>SGST (9%)</Text><Text>₹{fmtINR(sgst)}</Text></View>
                  </View>
                  <View style={styles.grandTotalBar}>
                    <Text style={styles.grandTotalLabel}>GRAND TOTAL</Text>
                    <Text style={styles.grandTotalVal}>₹{fmtINR(grandTotal)}</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Footer Notes & Signature & QR */}
            <View style={styles.footerNotesGrid}>
              <View style={styles.notesCol}>
                <Text style={styles.notesTitle}>NOTES</Text>
                <Text style={styles.notesBody}>{remarks || 'Thank you for choosing ZettaWeb. We appreciate your business and look forward to working with you again.'}</Text>
              </View>

              <View style={styles.sigCol}>
                <Text style={styles.sigFor}>For {signatureCompany || 'ZettaWeb Technologies Pvt. Ltd.'}</Text>
                {signature ? (
                  <Image src={signature} style={styles.sigImage} />
                ) : (
                  <Text style={{ fontSize: 13, fontFamily: 'Times-Italic', color: '#1677C8', marginVertical: 2 }}>ZettaWeb</Text>
                )}
                <View style={styles.sigLine} />
                <Text style={styles.sigTitle}>Authorized Signatory</Text>
              </View>

              <View style={styles.qrCol}>
                <View style={styles.qrNavyBox}>
                  <View style={styles.qrWhiteBox}>
                    <Text style={styles.qrText}>QR</Text>
                  </View>
                </View>
                <Text style={styles.qrLabel}>Scan to Pay</Text>
              </View>
            </View>
          </View>

          {/* Bottom Footer Bar */}
          <View style={styles.bottomFooter}>
            <Text style={styles.bottomFooterText}>
              • BUILDING DIGITAL EXPERIENCES <Text style={styles.bottomFooterGold}>THAT DRIVE GROWTH.</Text>
            </Text>
          </View>

        </View>

      </Page>
    </Document>
  );
};

export default InvoicePDF;
