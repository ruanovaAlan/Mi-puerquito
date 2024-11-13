import React from 'react';
import { View, Text, Button, Alert } from 'react-native';
import ScreenLayout from '../../components/ScreenLayout';
import {
  // wallet functions
  insertAccount, getAccountsByUser, getAccountById, updateAccountById, updateAccountBalance, deleteWalletById, deleteWalletsByUser,
  // reminders functions
  insertReminder, getReminders, deleteReminders, getRemindersByUser, getReminderById, updateReminderStatus, deleteReminderById,
  // savings functions
  insertSavings, getSavingsByUser, updateSavingsStatus, deleteSavingsById, updateSavingsAmount,
  // transactions functions
  insertTransaction, getTransactions, deleteTransactions, getTransactionsByUser, getTransactionsByDate, updateTransaction, deleteTransactionById,
  // user functions
  insertUser, getUsers
} from '../../utils/database';

export default function Stats() {
  // Datos de prueba para cada tabla
  const testAccount = [1, 'debit', 1234, '2025-12-31', 'Banco Ejemplo', '2024-11-15', 5000.00, 1500.00];
  const testReminder = [1, 'Recordatorio de Prueba', 'Descripción de prueba', 100.00, '2024-11-15', '2024-11-10', 'monthly', 1];
  const testSavings = { user_id: 1, target_amount: 10000.00, min_amount: 500.00, end_date: '2025-12-31', status: 1 };
  const testUser = 'Usuario de Prueba';

  // Funciones de prueba para cada tabla

  // Wallet
  const handleWalletTests = async () => {
    try {
      console.log('Insertando cuenta:', testAccount);
      await insertAccount(testAccount);

      const accounts = await getAccountsByUser(1);
      console.log('Cuentas obtenidas por usuario:', accounts);

      if (accounts.length > 0) {
        const account = await getAccountById(accounts[0].id);
        console.log('Cuenta obtenida por ID:', account);

        console.log('Actualizando saldo de cuenta ID', accounts[0].id, 'a 2000.00');
        await updateAccountBalance(accounts[0].id, 2000.00);

        const updates = { balance: 2500.00, issuer: 'Banco Actualizado' };
        console.log('Actualizando cuenta con ID', accounts[0].id, 'con:', updates);
        await updateAccountById(accounts[0].id, updates);

        console.log('Eliminando cuenta por ID:', accounts[0].id);
        await deleteWalletById(accounts[0].id);
      }

      console.log('Eliminando todas las cuentas por usuario ID:', 1);
      await deleteWalletsByUser(1);
      Alert.alert('Éxito', 'Pruebas de Wallet completadas correctamente.');
    } catch (error) {
      console.error('Error en pruebas de Wallet:', error.message);
      Alert.alert('Error', `Error en pruebas de Wallet: ${error.message}`);
    }
  };

  // Reminders
  const handleRemindersTests = async () => {
    try {
      console.log('Insertando recordatorio:', testReminder);
      await insertReminder(testReminder);

      const reminders = await getRemindersByUser(1);
      console.log('Recordatorios obtenidos por usuario:', reminders);

      if (reminders.length > 0) {
        const reminder = await getReminderById(reminders[0].id);
        console.log('Recordatorio obtenido por ID:', reminder);

        console.log('Actualizando estado de recordatorio ID', reminders[0].id, 'a 0');
        await updateReminderStatus(reminders[0].id, 0);

        console.log('Eliminando recordatorio por ID:', reminders[0].id);
        await deleteReminderById(reminders[0].id);
      }

      console.log('Eliminando todos los recordatorios');
      await deleteReminders();
      Alert.alert('Éxito', 'Pruebas de Reminders completadas correctamente.');
    } catch (error) {
      console.error('Error en pruebas de Reminders:', error.message);
      Alert.alert('Error', `Error en pruebas de Reminders: ${error.message}`);
    }
  };

  // Savings
  const handleSavingsTests = async () => {
    try {
      console.log('Insertando ahorro:', testSavings);
      await insertSavings(testSavings);

      const savings = await getSavingsByUser(1);
      console.log('Ahorros obtenidos por usuario:', savings);

      if (savings.length > 0) {
        console.log('Actualizando monto de ahorro ID', savings[0].id, 'a 6000.00');
        await updateSavingsAmount(savings[0].id, 6000.00);

        console.log('Actualizando estado de ahorro ID', savings[0].id, 'a 0');
        await updateSavingsStatus(savings[0].id, 0);

        console.log('Eliminando ahorro por ID:', savings[0].id);
        await deleteSavingsById(savings[0].id);
      }
      Alert.alert('Éxito', 'Pruebas de Savings completadas correctamente.');
    } catch (error) {
      console.error('Error en pruebas de Savings:', error.message);
      Alert.alert('Error', `Error en pruebas de Savings: ${error.message}`);
    }
  };

  // Transactions
  const handleTransactionsTests = async () => {
    try {
      // Inserta un usuario de prueba si no existe
      const users = await getUsers();
      if (users.length === 0) {
        console.log('Insertando usuario de prueba:', testUser);
        await insertUser(testUser);
      }

      // Inserta una cuenta de prueba si no existe y obtiene su ID
      let walletId;
      const accounts = await getAccountsByUser(1);
      if (accounts.length === 0) {
        console.log('Insertando cuenta de prueba:', testAccount);
        await insertAccount(testAccount);
        const newAccounts = await getAccountsByUser(1);
        walletId = newAccounts[0].id;  // Obtener el ID de la cuenta insertada
      } else {
        walletId = accounts[0].id;
      }

      // Define transacción de prueba con un wallet_id válido
      const testTransaction = [1, walletId, 'income', 500.00, '2024-11-13', 'Salario', 'Descripción de ingreso'];

      // Inserta transacción de prueba
      console.log('Insertando transacción:', testTransaction);
      await insertTransaction(testTransaction);

      const transactions = await getTransactionsByUser(1);
      console.log('Transacciones obtenidas por usuario:', transactions);

      if (transactions.length > 0) {
        console.log('Obteniendo transacciones por fecha para usuario ID 1 entre 2024-01-01 y 2024-12-31');
        const dateFilteredTransactions = await getTransactionsByDate(1, '2024-01-01', '2024-12-31');
        console.log('Transacciones filtradas por fecha:', dateFilteredTransactions);

        const updates = { amount: 1000.00, description: 'Transacción Actualizada' };
        console.log('Actualizando transacción ID', transactions[0].id, 'con:', updates);
        await updateTransaction(transactions[0].id, updates);

        console.log('Eliminando transacción por ID:', transactions[0].id);
        await deleteTransactionById(transactions[0].id);
      }

      console.log('Eliminando todas las transacciones');
      await deleteTransactions();
      Alert.alert('Éxito', 'Pruebas de Transactions completadas correctamente.');
    } catch (error) {
      console.error('Error en pruebas de Transactions:', error.message);
      Alert.alert('Error', `Error en pruebas de Transactions: ${error.message}`);
    }
  };
  
  return (
    <ScreenLayout>
      <Text>Pruebas de Funciones</Text>
      <Button title="Pruebas de Wallet" onPress={handleWalletTests} />
      <Button title="Pruebas de Reminders" onPress={handleRemindersTests} />
      <Button title="Pruebas de Savings" onPress={handleSavingsTests} />
      <Button title="Pruebas de Transactions" onPress={handleTransactionsTests} />
    </ScreenLayout>
  );
}
