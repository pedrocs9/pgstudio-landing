'use client'

import { Document, Page, StyleSheet, Text, View, pdf } from '@react-pdf/renderer'
import { type QuoteItemRecord, type QuoteRecord, formatQuoteMoney, getQuoteDueDate, quotePdfFileName } from '../lib/quote-pipeline'

const styles = StyleSheet.create({
  page: { padding: '40px 46px', fontFamily: 'Helvetica', fontSize: 10, color: '#111827', backgroundColor: '#ffffff' },
  header: { flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 2, borderBottomColor: '#0284c7', paddingBottom: 18, marginBottom: 26 },
  brandName: { fontSize: 22, fontFamily: 'Helvetica-Bold', color: '#07111f', marginBottom: 4 },
  brandAccent: { color: '#0284c7' },
  muted: { fontSize: 9, color: '#64748b', marginBottom: 3 },
  quoteBox: { alignItems: 'flex-end' },
  quoteNumber: { fontSize: 15, fontFamily: 'Helvetica-Bold', marginBottom: 5 },
  badge: { fontSize: 8, color: '#0284c7', marginTop: 5, fontFamily: 'Helvetica-Bold' },
  section: { marginBottom: 18 },
  sectionTitle: { fontSize: 9, fontFamily: 'Helvetica-Bold', color: '#64748b', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 },
  clientBox: { backgroundColor: '#f8fafc', borderRadius: 6, padding: '12px 14px' },
  clientName: { fontSize: 13, fontFamily: 'Helvetica-Bold', marginBottom: 5 },
  tableHeader: { flexDirection: 'row', backgroundColor: '#07111f', padding: '8px 10px', borderRadius: 4 },
  row: { flexDirection: 'row', padding: '9px 10px', borderBottomWidth: 1, borderBottomColor: '#e5e7eb' },
  rowAlt: { flexDirection: 'row', padding: '9px 10px', backgroundColor: '#f8fafc', borderBottomWidth: 1, borderBottomColor: '#e5e7eb' },
  headText: { color: '#ffffff', fontSize: 8, fontFamily: 'Helvetica-Bold' },
  desc: { flex: 4 },
  qty: { flex: 1, textAlign: 'center' },
  price: { flex: 2, textAlign: 'right' },
  total: { flex: 2, textAlign: 'right' },
  itemTitle: { fontSize: 9, fontFamily: 'Helvetica-Bold' },
  itemDetail: { fontSize: 8, color: '#64748b', marginTop: 3, lineHeight: 1.35 },
  totals: { alignItems: 'flex-end', marginTop: 12 },
  totalLine: { flexDirection: 'row', justifyContent: 'space-between', width: 230, borderTopWidth: 1, borderTopColor: '#cbd5e1', paddingTop: 8 },
  totalLabel: { fontSize: 13, fontFamily: 'Helvetica-Bold' },
  totalValue: { fontSize: 13, fontFamily: 'Helvetica-Bold', color: '#0284c7' },
  conditionBox: { backgroundColor: '#f0f9ff', borderLeftWidth: 3, borderLeftColor: '#0284c7', borderRadius: 5, padding: '10px 12px' },
  notes: { fontSize: 9, color: '#334155', lineHeight: 1.5 },
  footer: { position: 'absolute', bottom: 30, left: 46, right: 46, borderTopWidth: 1, borderTopColor: '#e2e8f0', paddingTop: 9, flexDirection: 'row', justifyContent: 'space-between' },
})

function QuoteDocument({ quote, items }: { quote: QuoteRecord; items: QuoteItemRecord[] }) {
  const subtotal = items.reduce((sum, item) => sum + Number(item.subtotal || 0), 0)
  const dueDate = getQuoteDueDate(quote)

  return (
    <Document>
      <Page size="A4" style={styles.page} wrap>
        <View style={styles.header}>
          <View>
            <Text style={styles.brandName}>pgstudio<Text style={styles.brandAccent}>.tech</Text></Text>
            <Text style={styles.muted}>Studio de software chileno</Text>
            <Text style={styles.muted}>hola@pgstudio.tech · pgstudio.tech</Text>
          </View>
          <View style={styles.quoteBox}>
            <Text style={styles.quoteNumber}>{quote.number}</Text>
            <Text style={styles.muted}>Fecha: {quote.createdAt ? new Date(quote.createdAt).toLocaleDateString('es-CL') : 'Sin fecha'}</Text>
            <Text style={styles.muted}>Valida hasta: {dueDate ? dueDate.toLocaleDateString('es-CL') : 'Sin fecha'}</Text>
            <Text style={styles.badge}>COTIZACION COMERCIAL</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Cliente</Text>
          <View style={styles.clientBox}>
            <Text style={styles.clientName}>{quote.clientName}</Text>
            {quote.clientEmail && <Text style={styles.muted}>{quote.clientEmail}</Text>}
            {quote.clientPhone && <Text style={styles.muted}>{quote.clientPhone}</Text>}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Detalle de servicios</Text>
          <View style={styles.tableHeader}>
            <Text style={[styles.headText, styles.desc]}>Descripcion</Text>
            <Text style={[styles.headText, styles.qty]}>Cant.</Text>
            <Text style={[styles.headText, styles.price]}>Valor unit.</Text>
            <Text style={[styles.headText, styles.total]}>Total</Text>
          </View>
          {items.map((item, index) => (
            <View key={`${item.description}-${index}`} style={index % 2 === 0 ? styles.row : styles.rowAlt} wrap={false}>
              <View style={styles.desc}>
                <Text style={styles.itemTitle}>{item.description}</Text>
                {item.detail && <Text style={styles.itemDetail}>{item.detail}</Text>}
              </View>
              <Text style={[styles.muted, styles.qty]}>{item.qty}</Text>
              <Text style={[styles.muted, styles.price]}>{formatQuoteMoney(item.unitPrice, quote.currency)}</Text>
              <Text style={[styles.itemTitle, styles.total]}>{formatQuoteMoney(item.subtotal, quote.currency)}</Text>
            </View>
          ))}
          <View style={styles.totals}>
            <View style={styles.totalLine}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>{formatQuoteMoney(subtotal, quote.currency)}</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Condiciones comerciales</Text>
          <View style={styles.conditionBox}>
            <Text style={styles.notes}>Esta cotizacion es valida por {quote.validDays || 15} dias desde su emision. No corresponde a factura, boleta ni documento tributario.</Text>
          </View>
        </View>

        {quote.notes && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Notas</Text>
            <Text style={styles.notes}>{quote.notes}</Text>
          </View>
        )}

        <View style={styles.footer} fixed>
          <Text style={styles.muted}>pgstudio · hola@pgstudio.tech</Text>
          <Text style={styles.muted} render={({ pageNumber, totalPages }) => `Pagina ${pageNumber} de ${totalPages}`} />
        </View>
      </Page>
    </Document>
  )
}

export async function generateQuotePDF(quote: QuoteRecord, items: QuoteItemRecord[]) {
  const blob = await pdf(<QuoteDocument quote={quote} items={items} />).toBlob()
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = quotePdfFileName(quote.number)
  anchor.click()
  URL.revokeObjectURL(url)
}
