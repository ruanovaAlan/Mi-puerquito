import * as SQLite from 'expo-sqlite';


// TABLAS ------------

export async function createTables() {
  const db = await SQLite.openDatabaseAsync('miPuerquito');

  await db.execAsync(`PRAGMA foreign_keys = ON;`);
  await db.execAsync(`PRAGMA journal_mode = WAL;`);

  // await db.execAsync(`DROP TABLE users`);

  // users
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user TEXT
    )
  `)


  // wallet
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS wallet (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      account_type TEXT CHECK(account_type IN ('credit', 'debit', 'savings')),
      last_four TEXT CHECK(length(last_four) = 4),
      expiration_date TEXT,
      issuer TEXT,
      billing_date TEXT,
      balance_limit REAL,
      available_balance REAL,
      FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  // await db.execAsync(`DROP TABLE wallet`);

  // reminders
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS reminders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      description TEXT,
      amount REAL,
      reminder_date TEXT,
      status INTEGER CHECK(status IN (0, 1)),
      FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `)

  // await db.execAsync(`DROP TABLE savings`);


  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS savings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      saving_type TEXT CHECK(saving_type IN ('objective', 'limit')),
      target_amount REAL CHECK(target_amount >= 0),
      min_amount REAL CHECK(min_amount >= 0),
      status INTEGER CHECK(status IN (0, 1)),
      FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `)

  // transactions
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      wallet_id INTEGER,
      transaction_type TEXT CHECK(transaction_type IN ('income', 'expense')),
      amount REAL,
      transaction_date TEXT,
      category TEXT,
      description TEXT,
      FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY(wallet_id) REFERENCES wallet(id) ON DELETE CASCADE
    )
  `)

}


// user functions ------------

export async function insertUser(user) {
  const db = await SQLite.openDatabaseAsync('miPuerquito');
  await db.runAsync('INSERT INTO users (user) VALUES (?)', user);
  return 'Se insertó correctamente el usuario';
}

export async function getUsers() {
  const db = await SQLite.openDatabaseAsync('miPuerquito');
  const result = await db.getAllAsync('SELECT * FROM users');
  return result;
}

export async function deleteUsers() {
  const db = await SQLite.openDatabaseAsync('miPuerquito');
  const result = await db.runAsync('DELETE FROM users');
  return 'Usuarios eliminados';
}

export async function getUserById(user_id) {
  const db = await SQLite.openDatabaseAsync('miPuerquito');
  const result = await db.getAllAsync('SELECT user FROM users WHERE id = ?', [user_id]);
  return result;
}


// wallet fuctions ------------

export async function insertAccount(user_id, account_type, last_four, expiration_date, issuer, billing_date, balance_limit, available_balance) {
  const db = await SQLite.openDatabaseAsync('miPuerquito');
  await db.runAsync(
    'INSERT INTO wallet (user_id, account_type, last_four, expiration_date, issuer, billing_date, balance_limit, available_balance) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [user_id, account_type, last_four, expiration_date, issuer, billing_date, balance_limit, available_balance]
  );
  return 'Se insertó correctamente la cuenta';
}

export async function getAccountsByUser(user_id) {
  const db = await SQLite.openDatabaseAsync('miPuerquito');
  const result = await db.getAllAsync('SELECT * FROM wallet WHERE user_id = ?', [user_id]);
  return result;
}

export async function getAccountById(wallet_id) {
  const db = await SQLite.openDatabaseAsync('miPuerquito');
  const result = await db.getAllAsync('SELECT * FROM wallet WHERE id = ?', [wallet_id]);
  return result;
}

export async function deleteWalletsByUser(user_id) {
  const db = await SQLite.openDatabaseAsync('miPuerquito');
  await db.runAsync('DELETE FROM wallet WHERE user_id = ?', [user_id]);
  return 'Cuentas eliminadas';
}

export async function deleteAccountById(wallet_id) {
  const db = await SQLite.openDatabaseAsync('miPuerquito');
  await db.runAsync('DELETE FROM wallet WHERE id = ?', [wallet_id]);
  return 'Cuenta eliminada';
}

export async function updateAccountBalance(wallet_id, new_balance) {
  const db = await SQLite.openDatabaseAsync('miPuerquito');
  await db.runAsync('UPDATE wallet SET available_balance = ? WHERE id = ?', [new_balance, wallet_id]);
  return 'Saldo actualizado';
}

export async function updateAccountById(wallet_id, updates) {
  const db = await SQLite.openDatabaseAsync('miPuerquito');

  const fields = [];
  const values = [];

  for (const [key, value] of Object.entries(updates)) {
    fields.push(`${key} = ?`);
    values.push(value);
  }

  values.push(wallet_id);
  const query = `UPDATE wallet SET ${fields.join(', ')} WHERE id = ?`;
  await db.runAsync(query, values);
  return 'La cuenta se ha actualizado correctamente';
}

export async function applyTransactionToAccount(wallet_id, amount, transactionType) {
  const db = await SQLite.openDatabaseAsync('miPuerquito');
  const account = await db.getAllAsync('SELECT available_balance FROM wallet WHERE id = ?', [wallet_id]);

  if (!account || account.length === 0) {
    throw new Error('Cuenta no encontrada');
  }

  let newBalance;

  if (transactionType === 'income') {
    newBalance = account[0].available_balance + amount;
  } else if (transactionType === 'expense') {
    newBalance = account[0].available_balance - amount;
    if (newBalance < 0) {
      throw new Error('El balance no puede ser negativo');
    }
  } else {
    throw new Error('Tipo de transacción inválido. Debe ser "income" o "expense"');
  }

  await db.runAsync('UPDATE wallet SET available_balance = ? WHERE id = ?', [newBalance, wallet_id]);
  return newBalance;
}



export async function getTotalWalletBalance(user_id) {
  const db = await SQLite.openDatabaseAsync('miPuerquito');
  const result = await db.getAllAsync(
    'SELECT IFNULL(SUM(available_balance), 0) AS total_balance FROM wallet WHERE user_id = ?',
    [user_id]
  );
  return result[0]?.total_balance || 0;
}

export async function getWalletSummary(user_id) {
  const db = await SQLite.openDatabaseAsync('miPuerquito');
  const result = await db.getAllAsync(
    `SELECT account_type, SUM(available_balance) AS total_balance
     FROM wallet WHERE user_id = ? GROUP BY account_type`,
    [user_id]
  );
  return result;
}


export async function getTotalCreditInfo(user_id) {
  const db = await SQLite.openDatabaseAsync('miPuerquito');
  const result = await db.getAllAsync(
    `SELECT 
       IFNULL(SUM(available_balance), 0) AS total_credit, 
       IFNULL(SUM(balance_limit), 0) AS total_credit_limit 
     FROM wallet 
     WHERE user_id = ? AND account_type = "credit"`,
    [user_id]
  );
  return {
    total_credit: result[0]?.total_credit || 0,
    total_credit_limit: result[0]?.total_credit_limit || 0
  };
}

// reminder functions ------------

export async function insertReminder(reminder) {
  const db = await SQLite.openDatabaseAsync('miPuerquito');
  // Aseguramos que siempre se inserte con `status = 1`
  await db.runAsync(
    'INSERT INTO reminders (user_id, description, amount, reminder_date, status) VALUES (?, ?, ?, ?, 1)',
    reminder
  );
  return 'Se insertó correctamente el recordatorio';
}


export async function getReminders() {
  const db = await SQLite.openDatabaseAsync('miPuerquito');
  const result = await db.getAllAsync('SELECT * FROM reminders');
  return result;
}

export async function deleteReminders() {
  const db = await SQLite.openDatabaseAsync('miPuerquito');
  const result = await db.runAsync('DELETE FROM reminders');
  return 'Recordatorios eliminados';
}

export async function getRemindersByUser(user_id) {
  const db = await SQLite.openDatabaseAsync('miPuerquito');
  const result = await db.getAllAsync(
    'SELECT * FROM reminders WHERE user_id = ? AND status = 1',
    [user_id]
  );
  return result;
}

export async function getClosestReminderByUser(user_id) {
  const db = await SQLite.openDatabaseAsync('miPuerquito');
  const result = await db.getAllAsync(
    'SELECT * FROM reminders WHERE user_id = ? AND status = 1 ORDER BY reminder_date ASC LIMIT 1',
    [user_id]
  );
  return result;
}


export async function getReminderById(reminder_id) {
  const db = await SQLite.openDatabaseAsync('miPuerquito');
  const result = await db.getAllAsync('SELECT * FROM reminders WHERE id = ?', [reminder_id]);
  return result;
}

export async function updateReminder(reminder, id) {
  const db = await SQLite.openDatabaseAsync('miPuerquito');
  const { description, amount, reminder_date } = reminder; // Extraer propiedades del objeto
  await db.runAsync(
    'UPDATE reminders SET description = ?, amount = ?, reminder_date = ? WHERE id = ?',
    [description, amount, reminder_date, id] // Pasar propiedades individuales
  );
  return 'Recordatorio actualizado';
}


export async function updateReminderStatus(reminder_id) {
  const db = await SQLite.openDatabaseAsync('miPuerquito');
  await db.runAsync('UPDATE reminders SET status = 0 WHERE id = ?', [reminder_id]);
  return 'Estado actualizado';
}

export async function deleteReminderById(reminder_id) {
  const db = await SQLite.openDatabaseAsync('miPuerquito');
  await db.runAsync('DELETE FROM reminders WHERE id = ?', [reminder_id]);
  return 'Recordatorio eliminado';
}


// savings functions ------------

//OK
export async function getTotalSavings(user_id) {
  const db = await SQLite.openDatabaseAsync('miPuerquito');

  const amount = await db.getAllAsync(`
    SELECT IFNULL(SUM(available_balance), 0) as total_balance
    FROM wallet 
    WHERE user_id = ? AND (account_type = 'debit' OR account_type = 'savings')
`, [user_id]);
  return amount;
}

//OK
export async function insertSavingGoal(user_id, target_amount) {
  const db = await SQLite.openDatabaseAsync('miPuerquito');
  const result = await db.getAllAsync(`INSERT INTO savings (user_id, saving_type, target_amount, min_amount, status) VALUES (?, ?, ?, ?, ?)`, [user_id, 'objective', target_amount, '0', '0']);

  return 'Se insertó correctamente el objetivo de ahorro';
}

//OK
export async function insertSavingLimit(user_id, min_amount) {
  const db = await SQLite.openDatabaseAsync('miPuerquito');
  const result = await db.getAllAsync(`INSERT INTO savings (user_id, saving_type, target_amount, min_amount, status) VALUES (?, ?, ?, ?, ?)`, [user_id, 'limit', '0', min_amount, '0']);

  return 'Se insertó correctamente el límite de ahorro';
}

export async function deleteSavings() {
  const db = await SQLite.openDatabaseAsync('miPuerquito');
  const result = await db.runAsync('DELETE FROM savings');
  return 'Ahorros eliminados';
}

//OK
export async function getObjectiveAndLimit(user_id) {
  const db = await SQLite.openDatabaseAsync('miPuerquito');
  const result = await db.getAllAsync(`SELECT * FROM savings WHERE user_id = ? AND status = 0`, [user_id]);
  return result;
}

//OK
export async function getSavingGoal(user_id) {
  const db = await SQLite.openDatabaseAsync('miPuerquito');
  const result = await db.getAllAsync(`SELECT * FROM savings WHERE user_id = ? AND saving_type = 'objective' AND status = 0`, [user_id]);
  return result;
}

//OK
export async function getSavingLimit(user_id) {
  const db = await SQLite.openDatabaseAsync('miPuerquito');
  const result = await db.getAllAsync(`SELECT * FROM savings WHERE user_id = ? AND saving_type = 'limit' AND status = 0`, [user_id]);
  return result;
}

export async function getSavingsByUser(user_id) {
  const db = await SQLite.openDatabaseAsync('miPuerquito');
  const result = await db.getAllAsync('SELECT * FROM savings WHERE user_id = ? AND status = 1', [user_id]);
  return result;
}

export async function updateSavingsStatus(savings_id, new_status) {
  const db = await SQLite.openDatabaseAsync('miPuerquito');
  await db.runAsync('UPDATE savings SET status = ? WHERE id = ?', [new_status, savings_id]);
  return 'Estado actualizado';
}

export async function deleteSavingsById(savings_id) {
  const db = await SQLite.openDatabaseAsync('miPuerquito');
  await db.runAsync('DELETE FROM savings WHERE id = ?', [savings_id]);
  return 'Ahorro eliminado';
}

export async function updateSavingsAmount(savings_id, new_amount) {
  const db = await SQLite.openDatabaseAsync('miPuerquito');
  await db.runAsync('UPDATE savings SET current_amount = ? WHERE id = ?', [new_amount, savings_id]);
  return 'Monto actualizado';
}

//OK
export async function updateTargetAmount(savings_id, new_target) {
  const db = await SQLite.openDatabaseAsync('miPuerquito');
  await db.runAsync('UPDATE savings SET target_amount = ? WHERE id = ?', [new_target, savings_id]);
  return 'Monto objetivo actualizado';
}

//OK
export async function updateLimitAmount(savings_id, new_limit) {
  const db = await SQLite.openDatabaseAsync('miPuerquito');
  await db.runAsync('UPDATE savings SET min_amount = ? WHERE id = ?', [new_limit, savings_id]);
  return 'Límite actualizado';
}


// transactions functions ------------

export async function insertTransaction(values) {
  const db = await SQLite.openDatabaseAsync('miPuerquito');
  await db.runAsync(
    'INSERT INTO transactions (user_id, wallet_id, transaction_type, amount, transaction_date, category, description) VALUES (?, ?, ?, ?, ?, ?, ?)',
    values
  );
  return 'Se insertó correctamente la transacción';
}


export async function getTransactions() {
  const db = await SQLite.openDatabaseAsync('miPuerquito');
  const result = await db.getAllAsync('SELECT * FROM transactions');
  return result;
}

export async function getTransactionSums() {
  const db = await SQLite.openDatabaseAsync('miPuerquito');

  // Ejecutar la consulta
  const result = await db.getAllAsync(`
    SELECT transaction_type, SUM(amount) AS total
    FROM transactions
    GROUP BY transaction_type
  `);

  // Procesar el resultado
  const sums = {
    income: 0,
    expense: 0,
  };

  result.forEach((row) => {
    if (row.transaction_type === 'income') {
      sums.income = row.total;
    } else if (row.transaction_type === 'expense') {
      sums.expense = row.total;
    }
  });

  return sums; // { income: X, expense: Y }
}

export async function deleteTransactions() {
  const db = await SQLite.openDatabaseAsync('miPuerquito');
  const result = await db.runAsync('DELETE FROM transactions');
  return 'Transacciones eliminadas';
}

export async function getTransactionsByUser(user_id) {
  const db = await SQLite.openDatabaseAsync('miPuerquito');
  const result = await db.getAllAsync('SELECT * FROM transactions WHERE user_id = ?', [user_id]);
  return result;
}

export async function getExpensesByUser(user_id) {
  const db = await SQLite.openDatabaseAsync('miPuerquito');
  const result = await db.getAllAsync('SELECT * FROM transactions WHERE user_id = ? AND transaction_type = ?', [user_id, 'expense']);
  return result;
}

export async function getTransactionsByDate(user_id, start_date, end_date) {
  const db = await SQLite.openDatabaseAsync('miPuerquito');
  const result = await db.getAllAsync('SELECT * FROM transactions WHERE user_id = ? AND transaction_date BETWEEN ? AND ?', [user_id, start_date, end_date]);
  return result;
}

export async function getTransactionById(transaction_id) {
  const db = await SQLite.openDatabaseAsync('miPuerquito');
  const result = await db.getAllAsync('SELECT * FROM transactions WHERE id = ?', [transaction_id]);
  return result;
}

export async function getLast3TransactionsByUserId(user_id) {
  const db = await SQLite.openDatabaseAsync('miPuerquito');
  const query = `
    SELECT * 
    FROM transactions 
    WHERE user_id = ? 
    ORDER BY id DESC 
    LIMIT 3
  `;

  try {
    const result = await db.getAllAsync(query, [user_id]);
    return result;
  } catch (error) {
    console.error("Error fetching transactions:", error);
    throw error;
  }
}

export async function getMonthlyReportInfo(user_id, date) {
  const db = await SQLite.openDatabaseAsync('miPuerquito');
  const query = `
    SELECT 
      wallet_id,
      transaction_date, 
      description, 
      amount, 
      transaction_type 
    FROM transactions 
    WHERE user_id = ? 
      AND strftime('%Y-%m', transaction_date) = ?
    ORDER BY transaction_date ASC
  `;

  try {
    const result = await db.getAllAsync(query, [user_id, date]);
    return result;
  } catch (error) {
    console.error("Error fetching monthly report transactions:", error);
    throw error;
  }
}


export async function updateTransaction(id, updates) {
  const db = await SQLite.openDatabaseAsync('miPuerquito');

  const currentTransaction = await db.getAllAsync('SELECT wallet_id, amount, transaction_type FROM transactions WHERE id = ?', [id]);
  if (!currentTransaction || currentTransaction.length === 0) {
    throw new Error('Transacción no encontrada');
  }

  const { wallet_id, amount: currentAmount, transaction_type: currentType } = currentTransaction[0];
  const amountDifference = updates.amount - currentAmount;

  const transactionType = updates.transaction_type || currentType;
  if (transactionType === 'income') {
    await applyTransactionToAccount(wallet_id, amountDifference, 'income');
  } else if (transactionType === 'expense') {
    await applyTransactionToAccount(wallet_id, amountDifference, 'expense');
  }

  const fields = [];
  const values = [];

  for (const [key, value] of Object.entries(updates)) {
    fields.push(`${key} = ?`);
    values.push(value);
  }

  values.push(id);
  const query = `UPDATE transactions SET ${fields.join(', ')} WHERE id = ?`;
  await db.runAsync(query, values);

  return 'La transacción se ha actualizado correctamente';
}


export async function deleteTransactionById(transaction_id) {
  const db = await SQLite.openDatabaseAsync('miPuerquito');
  await db.runAsync('DELETE FROM transactions WHERE id = ?', [transaction_id]);
  return 'Transacción eliminada';
}

// extra
export async function deleteAllData() {
  const db = await SQLite.openDatabaseAsync('miPuerquito');
  await db.runAsync('DELETE FROM users');
  await db.runAsync('DELETE FROM wallet');
  await db.runAsync('DELETE FROM reminders');
  await db.runAsync('DELETE FROM savings');
  await db.runAsync('DELETE FROM transactions');
  return 'Toda la información ha sido eliminada';
}

