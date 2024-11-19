import React from 'react';
import { View, Text, Button, Alert } from 'react-native';
import ScreenLayout from '../../components/ScreenLayout';
import {
  // wallet functions
  insertAccount, getAccountsByUser, getAccountById, updateAccountById, updateAccountBalance, deleteWalletById, deleteWalletsByUser, addFundsToAccount, substractToAccount, getWalletSummary, getTotalWalletBalance,
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

  const testReminder = [1, 'Recordatorio de Prueba', 100.00, '2024-11-15', 1]; // Ajustado
  const testSavings = { user_id: 1, target_amount: 10000.00, min_amount: 500.00, status: 1 }; // Ajustado


  const handleDeleteAllAccounts = async () => {
    // Elimina todas las cuentas del usuario de prueba
    console.log("Eliminando todas las cuentas del usuario con ID 1...");
    await deleteWalletsByUser(1);
    console.log("Todas las cuentas eliminadas.");
  };

  const handleWalletTests = async () => {
    try {
      console.log("Inicio de pruebas de Wallet...");
  
      // Asegúrate de que el usuario exista
      const users = await getUsers();
      let userId = users.length > 0 ? users[0].id : null;
  
      if (!userId) {
        console.log("El usuario no existe. Insertando usuario de prueba...");
        await insertUser('Usuario de Prueba');
        const newUsers = await getUsers();
        userId = newUsers[0].id;
        console.log("Usuario creado con ID:", userId);
      }
  
      // Inserta cuentas de prueba
      const testCreditAccount = [userId, 'credit', 1234, '05/32', 'BBVA', '15', 5000.00, 1500.00];
      const testDebitAccount = [userId, 'debit', 5678, '12/29', 'Santander', null, null, 2500.00];
      const testSavingsAccount = [userId, 'savings', null, null, 'Efectivo en casa', null, null, 8000.00];
  
      console.log("Insertando cuentas de prueba...");
      await insertAccount(...testCreditAccount);
      await insertAccount(...testDebitAccount);
      await insertAccount(...testSavingsAccount);
      console.log("Cuentas de prueba insertadas.");
  
      // Obtiene cuentas por usuario
      console.log("Obteniendo cuentas para el usuario con ID:", userId);
      const accounts = await getAccountsByUser(userId);
      console.log("Cuentas obtenidas:", accounts);
  
      // Iterar sobre las cuentas y realizar pruebas
      for (const account of accounts) {
        const accountId = account.id;
        console.log(`Usando cuenta con ID: ${accountId}, tipo: ${account.account_type}`);
  
        // Prueba obtener cuenta por ID
        console.log(`Obteniendo detalles de la cuenta con ID ${accountId}...`);
        const accountDetails = await getAccountById(accountId);
        console.log("Detalles de la cuenta:", accountDetails);
  
        if (account.account_type !== 'savings') {
          // Prueba actualizar balance directo
          console.log(`Actualizando balance de la cuenta con ID ${accountId} a 2000.00...`);
          await updateAccountBalance(accountId, 2000.00);
          console.log("Balance actualizado a 2000.00");
  
          // Prueba añadir fondos a la cuenta
          const amountToAdd = 500.00;
          console.log(`Añadiendo ${amountToAdd} al balance de la cuenta con ID ${accountId}...`);
          await addFundsToAccount(accountId, amountToAdd);
  
          // Verificar balance actualizado
          console.log(`Verificando balance actualizado para la cuenta con ID ${accountId}...`);
          const updatedAccount = await getAccountById(accountId);
          console.log("Nuevo balance después de añadir fondos:", updatedAccount[0]?.available_balance);
  
          // Prueba restar fondos de la cuenta
          const amountToSubtract = 300.00;
          console.log(`Restando ${amountToSubtract} del balance de la cuenta con ID ${accountId}...`);
          await substractToAccount(accountId, amountToSubtract);
  
          // Verificar balance actualizado después de restar
          console.log(`Verificando balance actualizado para la cuenta con ID ${accountId} después de restar...`);
          const updatedAccountAfterSubtract = await getAccountById(accountId);
          console.log("Nuevo balance después de restar fondos:", updatedAccountAfterSubtract[0]?.available_balance);
        }
  
        // Actualiza campos específicos
        if (account.account_type === 'credit') {
          const updates = { last_four: 4321, issuer: 'HSBC' };
          console.log(`Actualizando campos de la cuenta de crédito con ID ${accountId}...`, updates);
          await updateAccountById(accountId, updates);
          console.log("Campos actualizados correctamente en la cuenta de crédito.");
        }
      }
  
      // Prueba de resumen de balances por tipo de cuenta
      console.log(`Obteniendo resumen de balances para el usuario con ID ${userId}...`);
      const walletSummary = await getWalletSummary(userId);
      console.log("Resumen de balances por tipo de cuenta:", walletSummary);
  
      // Prueba de balance total
      console.log(`Obteniendo balance total para el usuario con ID ${userId}...`);
      const totalBalance = await getTotalWalletBalance(userId);
      console.log("Balance total:", totalBalance);
  
      // Elimina todas las cuentas del usuario de prueba
      //console.log("Eliminando todas las cuentas del usuario con ID:", userId);
      //await deleteWalletsByUser(userId);
      //console.log("Todas las cuentas eliminadas.");
  
      Alert.alert('Éxito', 'Todas las pruebas de Wallet se completaron correctamente');
      console.log("Pruebas de Wallet completadas con éxito.");
    } catch (error) {
      console.error('Error en pruebas de Wallet:', error.message);
      Alert.alert('Error', `Error en pruebas de Wallet: ${error.message}`);
    }
  };
  

  const handleRemindersTests = async () => {
    try {
      await insertReminder(testReminder);
      const reminders = await getRemindersByUser(1);

      if (reminders.length > 0) {
        const reminder = await getReminderById(reminders[0].id);
        await updateReminderStatus(reminders[0].id, 0);
        await deleteReminderById(reminders[0].id);
      }

      await deleteReminders();
      Alert.alert('Éxito', 'Pruebas de Reminders completadas correctamente.');
    } catch (error) {
      console.error('Error en pruebas de Reminders:', error.message);
      Alert.alert('Error', `Error en pruebas de Reminders: ${error.message}`);
    }
  };

  const handleTransactionsTests = async () => {
  try {
    console.log("Inicio de pruebas de Transacciones...");
    
    // Asegúrate de que el usuario exista
    const users = await getUsers();
    let userId = users.length > 0 ? users[0].id : null;
    if (!userId) {
      console.log("El usuario no existe. Insertando usuario de prueba...");
      await insertUser('Usuario de Prueba');
      const newUsers = await getUsers();
      userId = newUsers[0].id;
      console.log("Usuario creado con ID:", userId);
    }

    // Asegúrate de que exista al menos una cuenta
    const accounts = await getAccountsByUser(userId);
    let walletId = accounts.length > 0 ? accounts[0].id : null;
    if (!walletId) {
      console.log("No existen cuentas. Insertando cuenta de prueba...");
      const testAccount = [userId, 'debit', 5678, '12/29', 'Santander', null, null, 2500.00];
      await insertAccount(...testAccount);
      const newAccounts = await getAccountsByUser(userId);
      walletId = newAccounts[0].id;
      console.log("Cuenta creada con ID:", walletId);
    }

    // Definir una transacción de prueba
    const testTransaction = [userId, walletId, 'income', 500.00, '2024-11-13', 'Salario', 'Descripción de ingreso'];

    // Inserta una transacción
    console.log("Insertando transacción de prueba...");
    await insertTransaction(testTransaction);

    // Obtiene transacciones por usuario
    console.log("Obteniendo transacciones para el usuario con ID:", userId);
    const userTransactions = await getTransactionsByUser(userId);
    console.log("Transacciones obtenidas:", userTransactions);

    if (userTransactions.length > 0) {
      const transactionId = userTransactions[0].id;

      // Actualiza la transacción
      const updates = { amount: 1000.00, description: 'Transacción Actualizada' };
      console.log(`Actualizando transacción con ID ${transactionId}...`, updates);
      await updateTransaction(transactionId, updates);

      // Elimina la transacción
      console.log(`Eliminando transacción con ID ${transactionId}...`);
      await deleteTransactionById(transactionId);
      console.log("Transacción eliminada.");
    }

    // Limpia todas las transacciones
    console.log("Eliminando todas las transacciones...");
    await deleteTransactions();
    console.log("Todas las transacciones eliminadas.");

    Alert.alert('Éxito', 'Todas las pruebas de transacciones se completaron correctamente');
    console.log("Pruebas de transacciones completadas con éxito.");
  } catch (error) {
    console.error('Error en pruebas de transacciones:', error.message);
    Alert.alert('Error', `Error en pruebas de transacciones: ${error.message}`);
  }
};

  return (
    <ScreenLayout>
      <Text>Pruebas de Funciones</Text>
      <Button title="Eliminar todas las cuentas" onPress={handleDeleteAllAccounts} />
      <Button title="Pruebas de Wallet" onPress={handleWalletTests} />
      <Button title="Pruebas de Reminders" onPress={handleRemindersTests} />
      <Button title="Pruebas de Transactions" onPress={handleTransactionsTests} />
    </ScreenLayout>
  );
}
