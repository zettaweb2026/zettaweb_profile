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

const fontUrl = typeof window !== 'undefined' ? `${window.location.origin}/fonts/NotoSans-Regular.ttf` : '/fonts/NotoSans-Regular.ttf';

try {
  Font.register({
    family: 'NotoSans',
    src: fontUrl,
  });
} catch (e) {
  console.warn('Font registration fallback');
}

const styles = StyleSheet.create({
  page: {
    padding: 35,
    fontSize: 10,
    fontFamily: 'NotoSans',
    lineHeight: 1.6,
    backgroundColor: '#FFFFFF',
    color: '#1e293b',
  },
  watermarkImage: {
    position: 'absolute',
    top: '30%',
    left: '18%',
    width: 300,
    height: 300,
    opacity: 0.06,
    objectFit: 'contain',
  },
  watermarkText: {
    position: 'absolute',
    top: '55%',
    left: '18%',
    fontSize: 55,
    color: '#0f172a',
    opacity: 0.03,
    transform: 'rotate(-25deg)',
    fontWeight: 'bold',
  },
  headerStrip: {
    height: 4,
    backgroundColor: '#0284c7',
    marginBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#cbd5e1',
    paddingBottom: 15,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  contractNo: {
    fontSize: 9,
    color: '#0284c7',
    fontWeight: 'bold',
  },
  company: {
    textAlign: 'right',
  },
  companyName: {
    fontWeight: 'bold',
    fontSize: 12,
    color: '#0284c7',
  },
  subText: {
    fontSize: 8.5,
    color: '#64748b',
    marginBottom: 2,
  },
  partiesGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#f8fafc',
    padding: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 20,
  },
  partyCol: {
    flex: 1,
  },
  partyLabel: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#64748b',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  partyName: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#0284c7',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    paddingBottom: 4,
    marginTop: 15,
    marginBottom: 8,
  },
  paragraph: {
    fontSize: 9.5,
    color: '#334155',
    marginBottom: 10,
    textAlign: 'justify',
  },
  bold: {
    fontWeight: 'bold',
    color: '#0f172a',
  },
  signatureBox: {
    marginTop: 35,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    paddingTop: 15,
  },
  sigCol: {
    width: '45%',
  },
  sigImage: {
    width: 120,
    height: 45,
    marginBottom: 4,
  },
  sigPlaceholder: {
    height: 45,
    borderBottomWidth: 1,
    borderBottomColor: '#cbd5e1',
    marginBottom: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoImage: {
    maxHeight: 40,
    maxWidth: 120,
    marginBottom: 8,
    objectFit: 'contain',
  },
  footer: {
    position: 'absolute',
    bottom: 25,
    left: 35,
    right: 35,
    fontSize: 8,
    color: '#94a3b8',
    textAlign: 'center',
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    paddingTop: 8,
  },
});

const watermarkLogoUrl = typeof window !== 'undefined' ? `${window.location.origin}/logo.png` : '/logo.png';

export const ContractPDF = ({
  contractNo = 'ZW-SA-2026-1001',
  date = new Date().toISOString().split('T')[0],
  clientName = 'Client Name',
  clientEmail = 'client@company.com',
  service = 'Web & Mobile Application Development',
  amount = '50000',
  signature,
  companyLogo,
  companyStamp,
}) => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.headerStrip} />
        {/* PERMANENT LOGO WATERMARK */}
        <Image src={watermarkLogoUrl} style={styles.watermarkImage} />
        <Text style={styles.watermarkText}>ZettaWeb</Text>

        {/* HEADER */}
        <View style={styles.header}>
          <View>
            {companyLogo && <Image src={companyLogo} style={styles.logoImage} />}
            <Text style={styles.title}>MASTER SERVICE AGREEMENT</Text>
            <Text style={styles.contractNo}>Contract Reference #: {contractNo}</Text>
            <Text style={styles.subText}>Effective Date: {date}</Text>
          </View>
          <View style={styles.company}>
            <Text style={styles.companyName}>ZettaWeb Pvt. Ltd.</Text>
            <Text style={styles.subText}>support@zetta-web.in</Text>
            <Text style={styles.subText}>www.zetta-web.in</Text>
          </View>
        </View>

        {/* PARTIES */}
        <View style={styles.partiesGrid}>
          <View style={styles.partyCol}>
            <Text style={styles.partyLabel}>Service Provider</Text>
            <Text style={styles.partyName}>ZettaWeb Pvt. Ltd.</Text>
            <Text style={styles.subText}>Authorized Digital Provider</Text>
          </View>
          <View style={styles.partyCol}>
            <Text style={styles.partyLabel}>Client / Recipient</Text>
            <Text style={styles.partyName}>{clientName || 'Valued Client'}</Text>
            <Text style={styles.subText}>{clientEmail || 'Client Contact'}</Text>
          </View>
        </View>

        {/* TERMS */}
        <Text style={styles.sectionTitle}>1. Scope of Work & Deliverables</Text>
        <Text style={styles.paragraph}>
          The Service Provider agrees to perform design, engineering, and deployment services for{' '}
          <Text style={styles.bold}>{service}</Text> as requested by <Text style={styles.bold}>{clientName || 'Client'}</Text>. All deliverables shall comply with industry performance standards and security practices.
        </Text>

        <Text style={styles.sectionTitle}>2. Compensation & Financial Terms</Text>
        <Text style={styles.paragraph}>
          The Client agrees to pay the fixed consideration of{' '}
          <Text style={styles.bold}>₹{Number(amount || 0).toLocaleString('en-IN')}</Text> for the execution of the services detailed above. Payments shall be disbursed according to the agreed milestone structure.
        </Text>

        <Text style={styles.sectionTitle}>3. Intellectual Property Rights</Text>
        <Text style={styles.paragraph}>
          Upon receipt of full financial settlement, all source code, assets, and documentation created specifically under this Agreement shall belong exclusively to the Client.
        </Text>

        <Text style={styles.sectionTitle}>4. Confidentiality & Non-Disclosure</Text>
        <Text style={styles.paragraph}>
          Both parties agree to hold proprietary operational workflows, source code, data schemas, and trade secrets in strict confidence for a period of no less than three (3) years.
        </Text>

        {/* SIGNATURE SECTION */}
        <View style={styles.signatureBox}>
          <View style={styles.sigCol}>
            <Text style={styles.partyLabel}>For ZettaWeb Pvt. Ltd.</Text>
            {companyStamp ? (
              <Image src={companyStamp} style={styles.sigImage} />
            ) : (
              <View style={styles.sigPlaceholder}>
                <Text style={{ fontSize: 11, fontFamily: 'NotoSans', fontWeight: 'bold', color: '#0284c7' }}>
                  ZettaWeb Founder
                </Text>
              </View>
            )}
            <Text style={styles.subText}>Authorized Officer</Text>
            <Text style={styles.subText}>Date: {date}</Text>
          </View>

          <View style={styles.sigCol}>
            <Text style={styles.partyLabel}>For {clientName || 'Client'}</Text>
            {signature ? (
              <Image src={signature} style={styles.sigImage} />
            ) : (
              <View style={styles.sigPlaceholder}>
                <Text style={{ fontSize: 8, color: '#94a3b8' }}>[ Digital Signature Captured ]</Text>
              </View>
            )}
            <Text style={styles.subText}>Client Acceptance Signature</Text>
            <Text style={styles.subText}>Date: {date}</Text>
          </View>
        </View>

        {/* FOOTER */}
        <View style={styles.footer}>
          <Text>ZettaWeb Pvt. Ltd. • Legally binding digital contract generated via ZettaWeb Enterprise Portal.</Text>
        </View>
      </Page>
    </Document>
  );
};

export default ContractPDF;
