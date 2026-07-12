/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { Document, Page, Text, View, StyleSheet, pdf } from '@react-pdf/renderer'

const styles = StyleSheet.create({
  page: {
    padding: '40px 48px',
    fontFamily: 'Helvetica',
    fontSize: 10,
    color: '#1a1a1a',
    background: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
    paddingBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: '#0EA5E9',
  },
  brandBox: {
    flexDirection: 'column',
  },
  brandName: {
    fontSize: 22,
    fontFamily: 'Helvetica-Bold',
    color: '#0EA5E9',
    marginBottom: 4,
  },
  brandSub: {
    fontSize: 9,
    color: '#64748b',
  },
  quoteInfo: {
    alignItems: 'flex-end',
  },
  quoteNumber: {
    fontSize: 14,
    fontFamily: 'Helvetica-Bold',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  quoteDate: {
    fontSize: 9,
    color: '#64748b',
    marginBottom: 2,
  },
  statusBadge: {
    fontSize: 9,
    color: '#0EA5E9',
    marginTop: 4,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
  },
  clientBox: {
    padding: '12px 16px',
    backgroundColor: '#f8fafc',
    borderRadius: 6,
  },
  clientName: {
    fontSize: 13,
    fontFamily: 'Helvetica-Bold',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  clientDetail: {
    fontSize: 9,
    color: '#64748b',
    marginBottom: 2,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#0EA5E9',
    padding: '8px 10px',
    borderRadius: 4,
    marginBottom: 4,
  },
  tableRow: {
    flexDirection: 'row',
    padding: '8px 10px',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  tableRowAlt: {
    flexDirection: 'row',
    padding: '8px 10px',
    backgroundColor: '#f8fafc',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  colDesc:  { flex: 4 },
  colQty:   { flex: 1, textAlign: 'center' },
  colPrice: { flex: 2, textAlign: 'right' },
  colTotal: { flex: 2, textAlign: 'right' },
  headerText: {
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    color: '#ffffff',
    textTransform: 'uppercase',
  },
  cellText: { fontSize: 9, color: '#1a1a1a' },
  cellSub:  { fontSize: 8, color: '#64748b', marginTop: 2 },
  cellMuted:{ fontSize: 9, color: '#64748b' },
  totals: {
    marginTop: 12,
    alignItems: 'flex-end',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 220,
    marginBottom: 4,
  },
  totalLabel: { fontSize: 9, color: '#64748b' },
  totalValue: { fontSize: 9, color: '#1a1a1a' },
  grandTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 220,
    marginTop: 6,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  grandLabel: { fontSize: 13, fontFamily: 'Helvetica-Bold', color: '#1a1a1a' },
  grandValue: { fontSize: 13, fontFamily: 'Helvetica-Bold', color: '#0EA5E9' },
  validity: {
    marginTop: 20,
    padding: '10px 14px',
    backgroundColor: '#f0f9ff',
    borderRadius: 6,
    borderLeftWidth: 3,
    borderLeftColor: '#0EA5E9',
  },
  validityText: { fontSize: 9, color: '#0369a1' },
  notes: {
    marginTop: 12,
    padding: '10px 14px',
    backgroundColor: '#f8fafc',
    borderRadius: 6,
  },
  notesText: { fontSize: 9, color: '#64748b', lineHeight: 1.5 },
  footer: {
    position: 'absolute',
    bottom: 32,
    left: 48,
    right: 48,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    paddingTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  footerText: { fontSize: 8, color: '#94a3b8' },
  footerBrand: { fontSize: 8, color: '#0EA5E9' },
})

function QuoteDocument({ quote, items, settings }: any) {
  const subtotal = items.reduce((s: number, i: any) => s + Number(i.subtotal), 0)
  const validUntil = new Date(quote.createdAt)
  validUntil.setDate(validUntil.getDate() + (quote.validDays || 15))

  return (
    <Document>
      <Page size="A4" style={styles.page}>

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.brandBox}>
            <Text style={styles.brandName}>pgstudio</Text>
            <Text style={styles.brandSub}>Studio de software chileno</Text>
            <Text style={styles.brandSub}>hola@pgstudio.tech · pgstudio.tech</Text>
          </View>
          <View style={styles.quoteInfo}>
            <Text style={styles.quoteNumber}>{quote.number}</Text>
            <Text style={styles.quoteDate}>
              Fecha: {new Date(quote.createdAt).toLocaleDateString('es-CL')}
            </Text>
            <Text style={styles.quoteDate}>
              Válida hasta: {validUntil.toLocaleDateString('es-CL')}
            </Text>
            <Text style={styles.statusBadge}>COTIZACIÓN</Text>
          </View>
        </View>

        {/* Cliente */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Para</Text>
          <View style={styles.clientBox}>
            <Text style={styles.clientName}>{quote.clientName}</Text>
            {quote.clientEmail && <Text style={styles.clientDetail}>{quote.clientEmail}</Text>}
            {quote.clientPhone && <Text style={styles.clientDetail}>{quote.clientPhone}</Text>}
          </View>
        </View>

        {/* Items */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Detalle de servicios</Text>
          <View style={styles.tableHeader}>
            <Text style={[styles.headerText, styles.colDesc]}>Descripción</Text>
            <Text style={[styles.headerText, styles.colQty]}>Cant.</Text>
            <Text style={[styles.headerText, styles.colPrice]}>Precio unit.</Text>
            <Text style={[styles.headerText, styles.colTotal]}>Total</Text>
          </View>
          {items.map((item: any, i: number) => (
            <View key={i} style={i % 2 === 0 ? styles.tableRow : styles.tableRowAlt}>
              <View style={styles.colDesc}>
                <Text style={styles.cellText}>{item.description}</Text>
                {item.detail && <Text style={styles.cellSub}>{item.detail}</Text>}
              </View>
              <Text style={[styles.cellMuted, styles.colQty]}>{item.qty}</Text>
              <Text style={[styles.cellMuted, styles.colPrice]}>
                ${Number(item.unitPrice).toLocaleString('es-CL')} {quote.currency}
              </Text>
              <Text style={[styles.cellText, styles.colTotal]}>
                ${Number(item.subtotal).toLocaleString('es-CL')} {quote.currency}
              </Text>
            </View>
          ))}
        </View>

        {/* Total */}
        <View style={styles.totals}>
          <View style={styles.grandTotal}>
            <Text style={styles.grandLabel}>Total</Text>
            <Text style={styles.grandValue}>
              ${subtotal.toLocaleString('es-CL')} {quote.currency}
            </Text>
          </View>
        </View>

        {/* Validez */}
        <View style={styles.validity}>
          <Text style={styles.validityText}>
            Esta cotización es válida por {quote.validDays || 15} días desde su emisión.
          </Text>
        </View>

        {/* Notas */}
        {quote.notes && (
          <View style={styles.notes}>
            <Text style={[styles.sectionTitle, { marginBottom: 4 }]}>Notas</Text>
            <Text style={styles.notesText}>{quote.notes}</Text>
          </View>
        )}

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>pgstudio · hola@pgstudio.tech</Text>
          <Text style={styles.footerBrand}>pgstudio.tech</Text>
        </View>

      </Page>
    </Document>
  )
}

export async function generateQuotePDF(quote: any, items: any[], settings?: any) {
  const blob = await pdf(<QuoteDocument quote={quote} items={items} settings={settings} />).toBlob()
  const url  = URL.createObjectURL(blob)
  const a    = document.createElement('a')
  a.href     = url
  a.download = `${quote.number}.pdf`
  a.click()
  URL.revokeObjectURL(url)
}