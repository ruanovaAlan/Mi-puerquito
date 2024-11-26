import React, { useState } from 'react';
import { View, Pressable, Alert, Text, ActivityIndicator } from 'react-native';
import { printToFileAsync } from 'expo-print';
import { shareAsync } from 'expo-sharing';
import { getMonthlyReportInfo, getAccountById } from '../../utils/database';
import { PDFIcon } from '../Icons';

export default function GenerateReport({ userId, date }) {
  const [loading, setLoading] = useState(false);

  const generatePdf = async () => {
    try {
      setLoading(true);

      const transactions = await getMonthlyReportInfo(userId, date);

      const transactionsWithWallets = await Promise.all(
        transactions.map(async (t) => {
          const walletData = await getAccountById(t.wallet_id);
          const wallet = Array.isArray(walletData) && walletData.length > 0 ? walletData[0] : null;

          let walletDescription;
          if (wallet) {
            const accountTypeMap = {
              credit: 'Credito',
              debit: 'Debito',
              savings: 'Efectivo',
            };

            const accountType = accountTypeMap[wallet.account_type] || 'Desconocido';
            if (wallet.account_type === 'credit' || wallet.account_type === 'debit') {
              walletDescription = `${accountType} ${wallet.issuer} (${wallet.last_four})`;
            } else if (wallet.account_type === 'savings') {
              walletDescription = `${accountType} (${wallet.issuer})`;
            } else {
              walletDescription = 'Tipo desconocido';
            }
          } else {
            walletDescription = 'Cuenta no encontrada';
          }

          return {
            ...t,
            wallet_name: walletDescription,
          };
        })
      );

      const totalIncome = transactionsWithWallets
        .filter(t => t.transaction_type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);

      const totalExpense = transactionsWithWallets
        .filter(t => t.transaction_type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);

      const rows = transactionsWithWallets
        .map(t => {
          const amount =
            t.transaction_type === 'expense'
              ? `- $${Math.abs(t.amount).toFixed(2)}`
              : `$${t.amount.toFixed(2)}`;

          return `
            <tr>
              <td>${t.transaction_date}</td>
              <td>${t.description}</td>
              <td>${t.wallet_name}</td>
              <td>${amount}</td>
            </tr>
          `;
        })
        .join('');

      const totalRows = `
        <tr>
          <td colspan="3" style="text-align: right;"><strong>Total de Ingresos</strong></td>
          <td><strong>$${totalIncome.toFixed(2)}</strong></td>
        </tr>
        <tr>
          <td colspan="3" style="text-align: right;"><strong>Total de Egresos</strong></td>
          <td><strong>$${totalExpense.toFixed(2)}</strong></td>
        </tr>
      `;

      const html = `
        <html>
            <head>
            <style>
                body {
                font-family: Arial, sans-serif;
                margin: 0;
                padding: 0;
                }
                .page {
                padding: 40px; /* Simula márgenes alrededor del contenido */
                }
                table {
                width: 100%;
                border-collapse: collapse;
                }
                th, td {
                border: 1px solid #ddd;
                padding: 8px;
                }
                th {
                text-align: left;
                background-color: #f2f2f2;
                }
                td {
                text-align: left;
                }
                tr {
                page-break-inside: avoid; /* Evitar cortes dentro de filas */
                }
                tfoot {
                page-break-inside: avoid; /* Mantener los totales en una sola página */
                }
                h1 {
                text-align: center;
                margin-bottom: 20px;
                }
            </style>
            </head>
            <body>
            <div class="page">
                <h1>Reporte Mensual (${date})</h1>
                <table>
                <thead>
                    <tr>
                    <th>Fecha</th>
                    <th>Descripción</th>
                    <th>Cuenta</th>
                    <th>Monto</th>
                    </tr>
                </thead>
                <tbody>
                    ${rows}
                </tbody>
                <tfoot>
                    <tr>
                    <td colspan="3" style="text-align: right;"><strong>Total de Ingresos</strong></td>
                    <td><strong>$${totalIncome.toFixed(2)}</strong></td>
                    </tr>
                    <tr>
                    <td colspan="3" style="text-align: right;"><strong>Total de Egresos</strong></td>
                    <td><strong>$${totalExpense.toFixed(2)}</strong></td>
                    </tr>
                </tfoot>
                </table>
            </div>
            </body>
        </html>
    `;

      const file = await printToFileAsync({ html, base64: false });
      await shareAsync(file.uri);

    } catch (error) {
      console.error('Error al generar reporte:', error);
      Alert.alert('Error al generar el reporte', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Pressable onPress={generatePdf}
      disabled={loading} >
      <View className="flex flex-row items-center">
        {loading ? <ActivityIndicator /> : <PDFIcon className="scale-90" />}
        <Text className="text-[#60606C] text-lg font-bold ml-1">Generar Reporte</Text>
      </View>
    </Pressable>

  );
}
