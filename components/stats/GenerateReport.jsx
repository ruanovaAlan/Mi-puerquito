import React, { useState } from 'react';
import { View, Pressable, Alert, Text, ActivityIndicator } from 'react-native';
import { printToFileAsync } from 'expo-print';
import { shareAsync } from 'expo-sharing';
import { getMonthlyReportInfo, getAccountById, getUserById } from '../../utils/database';
import { PDFIcon } from '../Icons';
import * as FileSystem from 'expo-file-system';
import { Asset } from 'expo-asset';

export default function GenerateReport({ userId, date }) {
  const [loading, setLoading] = useState(false);

  const generatePdf = async () => {
    try {
      setLoading(true);

      // Cargar la imagen y convertirla a Base64
      const splashAsset = Asset.fromModule(require('../../assets/splash.png'));
      await splashAsset.downloadAsync();
      const splashBase64 = await FileSystem.readAsStringAsync(splashAsset.localUri || splashAsset.uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const splashUri = `data:image/png;base64,${splashBase64}`;

      const usernameData = await getUserById(userId);
      const username = usernameData[0]?.user || 'Usuario desconocido';

      const transactions = await getMonthlyReportInfo(userId, date);

      const transactionsWithWallets = await Promise.all(
        transactions.map(async (t) => {
          const walletData = await getAccountById(t.wallet_id);
          const wallet = Array.isArray(walletData) && walletData.length > 0 ? walletData[0] : null;

          let walletDescription;
          if (wallet) {
            const accountTypeMap = {
              credit: 'Crédito',
              debit: 'Débito',
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
        padding: 40px;
      }

      .title-container {
        align-items: center;
        justify-content: space-between; 
        margin-bottom: 20px;
      }

      .title-container h1 {
        margin: 0;
        font-size: 24px;
        text-align: center;
        flex-grow: 1; 
        font-weight: bold;
      }

      .user-info {
        margin-top: 20px;
        text-align: left;
      }

      .user-info table {
        width: 50%; /* Conserva el ancho del 50% */
        border-collapse: collapse;
        margin-top: 10px;
        margin-left: auto; /* Alinea la tabla a la derecha */
      }

      .user-info td {
        padding: 4px;
        border: 1px solid #ddd;
        text-align: left;
      }

      .user-info td[colspan] {
        font-weight: bold;
        text-align: center;
      }

      h2 {
        text-align: center;
        font-size: 18px;
        margin-top: 15px;
        margin-bottom: 15px;  
      }

      .divider {
        border-top: 2px solid #ddd;
        margin-top: 30px;
        margin-bottom: 30px;
        margin-bottom: 4 0px;
      }

      table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 20px;
      }

      th, td {
        border: 1px solid #ddd;
        padding: 4px;
        font-size: 10px;
      }

      th {
        font-weight: bold;
        text-align: left;
      }

      tfoot td {
        text-align: right;
      }

      .totals td {
        font-weight: bold;
      }
    </style>
  </head>
  <body>
    <div class="page">
      <div class="title-container">
        <h1>REPORTE MENSUAL</h1>
      </div>
      <div class="divider"></div>
      <div class="user-info">
        <table>
          <tr>
            <td colspan="2"><strong>MI PUERQUITO</strong></td>
          </tr>
          <tr>
            <td><strong>Usuario</strong></td>
            <td>${username}</td>
          </tr>
          <tr>
            <td><strong>Periodo</strong></td>
            <td>${date}</td>
          </tr>
        </table>
      </div>

      <!-- Tabla de movimientos -->
      <div class="divider"></div>
      <h2>DETALLE DE MOVIMIENTOS REALIZADOS</h2>
      <div class="divider"></div>
      <table>
        <thead>
          <tr>
            <th>FECHA</th>
            <th>DESCRIPCIÓN</th>
            <th>CUENTA</th>
            <th>MONTO</th>
          </tr>
        </thead>
        <tbody>
          ${rows}
        </tbody>
        <tfoot>
          ${totalRows}
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
    <Pressable onPress={generatePdf} disabled={loading}>
      <View className="flex flex-row items-center">
        {loading ? <ActivityIndicator /> : <PDFIcon className="scale-90" />}
        <Text className="text-[#60606C] text-lg font-bold ml-1">Generar Reporte</Text>
      </View>
    </Pressable>
  );
}
