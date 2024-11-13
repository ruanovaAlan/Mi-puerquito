import * as SQLite from 'expo-sqlite';


// Table users ------------

export async function createTables() {
  const db = await SQLite.openDatabaseAsync('miPuerquito');

  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user TEXT
    )
  `)
}

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

// Table wallet ------------


