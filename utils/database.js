import * as SQLite from 'expo-sqlite';


// TABLAS ------------

export async function createTables() {
  const db = await SQLite.openDatabaseAsync('miPuerquito');

  await db.execAsync(`PRAGMA foreign_keys = ON;`);
  await db.execAsync(`PRAGMA journal_mode = WAL;`);

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
      last_four INTEGER CHECK(length(last_four) = 4),
      expiration_date TEXT,
      issuer TEXT,
      billing_date TEXT,
      balance_limit REAL,
      balance REAL,
      FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `)

  // reminders
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS reminders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      name TEXT,
      description TEXT,
      amount REAL,
      due_date TEXT,
      reminder_date TEXT,
      frequency TEXT CHECK(frequency IN ('once', 'daily', 'weekly', 'monthly', 'yearly')),
      status INTEGER CHECK(status IN (0, 1)),
      FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `)

  // savings
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS savings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      current_amount REAL CHECK(current_amount >= 0) DEFAULT 0,
      target_amount REAL CHECK(target_amount >= 0),
      min_amount REAL CHECK(min_amount >= 0),
      start_date TEXT,
      end_date TEXT,
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


// wallet fuctions ------------

export async function insertAccount(user_id, account_type, last_four, expiration_date, issuer, billing_date, balance_limit, balance) {
  const db = await SQLite.openDatabaseAsync('miPuerquito');
  await db.runAsync('INSERT INTO wallet (user_id, account_type, last_four, expiration_date, issuer, billing_date, balance_limit, balance) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    user_id, account_type, last_four, expiration_date, issuer, billing_date, balance_limit, balance);
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

export async function deleteWalletById(wallet_id) {
  const db = await SQLite.openDatabaseAsync('miPuerquito');
  await db.runAsync('DELETE FROM wallet WHERE id = ?', [wallet_id]);
  return 'Cuenta eliminada';
}

export async function updateAccountBalance(wallet_id, new_balance) {
  const db = await SQLite.openDatabaseAsync('miPuerquito');
  await db.runAsync('UPDATE wallet SET balance = ? WHERE id = ?', [new_balance, wallet_id]);
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


// reminder functions ------------

export async function insertReminder(reminder) {
  const db = await SQLite.openDatabaseAsync('miPuerquito');
  await db.runAsync('INSERT INTO reminders (user_id, name, description, amount, due_date, reminder_date, frequency, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', reminder);
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
  const result = await db.getAllAsync('SELECT * FROM reminders WHERE user_id = ?', [user_id]);
  return result;
}

export async function getReminderById(reminder_id) {
  const db = await SQLite.openDatabaseAsync('miPuerquito');
  const result = await db.getAllAsync('SELECT * FROM reminders WHERE id = ?', [reminder_id]);
  return result;
}

export async function updateReminderStatus(reminder_id, new_status) {
  const db = await SQLite.openDatabaseAsync('miPuerquito');
  await db.runAsync('UPDATE reminders SET status = ? WHERE id = ?', [new_status, reminder_id]);
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
      SELECT IFNULL(SUM(balance), 0) as total_balance
      FROM wallet 
      WHERE user_id = ? AND (account_type = 'debit' OR account_type = 'savings')
    `, [user_id]);

  return amount;
}


export async function autoInsertSavings(user_id) {
  await db.execAsync(`
    UPDATE savings
    SET current_amount = (
      SELECT IFNULL(SUM(balance), 0) 
      FROM wallet 
      WHERE user_id = savings.user_id AND (account_type = 'debit' OR account_type = 'savings')
    )
    WHERE user_id = ?;
  `, [user_id]);

}

export async function insertSavings({ user_id, target_amount, min_amount, end_date, status }) {
  const db = await SQLite.openDatabaseAsync('miPuerquito');
  const start_date = new Date().toISOString().split('T')[0];
  const result = await db.getAllAsync(
    'SELECT SUM(balance) as total_balance FROM wallet WHERE user_id = ? AND account_type IN (?, ?)',
    [user_id, 'debit', 'savings']
  );
  const currentAmount = result[0].total_balance || 0;

  await db.runAsync(
    'INSERT INTO savings (user_id, current_amount, target_amount, min_amount, start_date, end_date, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [user_id, currentAmount, target_amount, min_amount, start_date, end_date, status]
  );

  return 'Se insertó correctamente el ahorro';
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


// transactions functions ------------

export async function insertTransaction(transaction) {
  const db = await SQLite.openDatabaseAsync('miPuerquito');
  await db.runAsync('INSERT INTO transactions (user_id, wallet_id, transaction_type, amount, transaction_date, category, description) VALUES (?, ?, ?, ?, ?, ?, ?)', transaction);
  return 'Se insertó correctamente la transacción';
}

export async function getTransactions() {
  const db = await SQLite.openDatabaseAsync('miPuerquito');
  const result = await db.getAllAsync('SELECT * FROM transactions');
  return result;
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

export async function getTransactionsByDate(user_id, start_date, end_date) {
  const db = await SQLite.openDatabaseAsync('miPuerquito');
  const result = await db.getAllAsync('SELECT * FROM transactions WHERE user_id = ? AND transaction_date BETWEEN ? AND ?', [user_id, start_date, end_date]);
  return result;
}

export async function updateTransaction(id, updates) {
  const db = await SQLite.openDatabaseAsync('miPuerquito');

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



