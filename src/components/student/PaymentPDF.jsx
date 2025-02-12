import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 20,
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
    borderBottom: '1px solid #E4E4E4',
  },
  header: {
    fontSize: 22,
    marginBottom: 10,
    textAlign: 'center',
    color: '#333333',
    fontWeight: 'bold',
  },
  subHeader: {
    fontSize: 16,
    marginBottom: 5,
    color: '#555555',
  },
  table: {
    display: 'table',
    width: 'auto',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#bfbfbf',
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  tableRow: {
    margin: 'auto',
    flexDirection: 'row',
    backgroundColor: '#f8f8f8',
  },
  tableCol: {
    width: '20%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#bfbfbf',
    borderLeftWidth: 0,
    borderTopWidth: 0,
    padding: 5,
  },
  tableCell: {
    margin: 'auto',
    marginTop: 5,
    fontSize: 10,
    color: '#333333',
  },
});

const PaymentPDF = ({ payments }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text style={styles.header}>Payment History</Text>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <View style={styles.tableCol}><Text style={styles.tableCell}>Date</Text></View>
            <View style={styles.tableCol}><Text style={styles.tableCell}>Amount</Text></View>
            <View style={styles.tableCol}><Text style={styles.tableCell}>Type</Text></View>
            <View style={styles.tableCol}><Text style={styles.tableCell}>Status</Text></View>
            <View style={styles.tableCol}><Text style={styles.tableCell}>Receipt</Text></View>
          </View>
          {payments.map((payment) => (
            <View style={styles.tableRow} key={payment.id}>
              <View style={styles.tableCol}><Text style={styles.tableCell}>{payment.date}</Text></View>
              <View style={styles.tableCol}><Text style={styles.tableCell}>${payment.amount}</Text></View>
              <View style={styles.tableCol}><Text style={styles.tableCell}>{payment.type}</Text></View>
              <View style={styles.tableCol}><Text style={styles.tableCell}>{payment.status}</Text></View>
              <View style={styles.tableCol}><Text style={styles.tableCell}>{payment.receipt}</Text></View>
            </View>
          ))}
        </View>
      </View>
    </Page>
  </Document>
);

export default PaymentPDF; 