
import { Page, Text, View, Document, StyleSheet, Font } from '@react-pdf/renderer';
import { TaxBreakdown } from '@/lib/types';

// Register a font (optional, standard Helvetica is fine for now)

const styles = StyleSheet.create({
    page: { flexDirection: 'column', backgroundColor: '#FFFFFF', padding: 30 },
    section: { margin: 10, padding: 10, flexGrow: 1 },
    title: { fontSize: 24, marginBottom: 20, textAlign: 'center', color: '#10b981' }, // Emerald-500
    subtitle: { fontSize: 18, marginBottom: 10, marginTop: 20, borderBottom: '1px solid #CCC' },
    row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
    label: { fontSize: 12, color: '#666' },
    value: { fontSize: 12, fontWeight: 'bold' },
    total: { fontSize: 14, fontWeight: 'bold', marginTop: 10, color: '#10b981' },
    disclaimer: { fontSize: 10, color: '#999', marginTop: 50, textAlign: 'center' }
});

interface PDFProps {
    rvResult: TaxBreakdown;
    uniResult: TaxBreakdown;
    inputs: any;
}

export const FiscalReportPDF = ({ rvResult, uniResult, inputs }: PDFProps) => (
    <Document>
        <Page size="A4" style={styles.page}>
            <View style={styles.section}>
                <Text style={styles.title}>Relatório Fiscal - ContabiliPT</Text>

                <View style={{ marginBottom: 20 }}>
                    <Text style={{ fontSize: 12 }}>Daily Rate: {inputs.dailyRate} €</Text>
                    <Text style={{ fontSize: 12 }}>Faturação Anual: {new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(rvResult.grossAnnual)}</Text>
                </View>

                {/* Recibos Verdes */}
                <Text style={styles.subtitle}>Cenário A: Recibos Verdes</Text>
                <View style={styles.row}>
                    <Text style={styles.label}>Impostos (SS + IRS)</Text>
                    <Text style={styles.value}>-{new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(rvResult.ss + rvResult.irs)}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>Líquido Anual</Text>
                    <Text style={styles.value}>{new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(rvResult.netAnnual)}</Text>
                </View>
                <Text style={styles.total}>Líquido Mensal: {new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(rvResult.netMonthly)}</Text>

                {/* Unipessoal */}
                <Text style={styles.subtitle}>Cenário B: Unipessoal (Empresa)</Text>
                <View style={styles.row}>
                    <Text style={styles.label}>Custos Empresa (Salário + TSU + Contab.)</Text>
                    <Text style={styles.value}>Incluso</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>IRC + Derrama</Text>
                    <Text style={styles.value}>{new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(uniResult.irs - (uniResult.netAnnual * 0.28))}</Text>
                    {/* Note: Logic simplified for display, irs in type includes dividend tax */}
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>Líquido Anual (Salário + Dividendos)</Text>
                    <Text style={styles.value}>{new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(uniResult.netAnnual)}</Text>
                </View>
                <Text style={styles.total}>Líquido Mensal: {new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(uniResult.netMonthly)}</Text>

                {/* Conclusion */}
                <View style={{ marginTop: 30, padding: 15, backgroundColor: '#f0fdf4', borderRadius: 5 }}>
                    <Text style={{ fontSize: 14, textAlign: 'center', color: '#047857' }}>
                        Poupança Potencial: +{new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(uniResult.netAnnual - rvResult.netAnnual)} / ano
                    </Text>
                </View>

                <Text style={styles.disclaimer}>
                    Este relatório é uma simulação e não dispensa a consulta de um Contabilista Certificado.
                    Gerado por ContabiliPT.
                </Text>
            </View>
        </Page>
    </Document>
);
