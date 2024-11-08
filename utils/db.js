import * as SQLite from 'expo-sqlite/legacy';

// Abre (o crea) la base de datos
const db = SQLite.openDatabase('miPuerquitoS.db');

export const crearTablaUsers = () => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user TEXT
        );`,
        [],
        () => {
          console.log('Tabla users creada o ya existe');
          resolve();
        },
        (txObj, error) => {
          console.log('Error al crear la tabla users:', error);
          reject(error);
        }
      );
    });
  });
};


export const obtenerUsers = () => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM users;',
        [],
        (txObj, results) => {
          const users = results.rows._array;
          resolve(users);
        },
        (txObj, error) => {
          console.log('Error al cargar usuarios:', error);
          reject(error);
        }
      );
    });
  });
};


export const insertarUser = (userName) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'INSERT INTO users (user) VALUES (?);',
        [userName],
        (txObj, resultSet) => {
          console.log('Usuario agregado con id:', resultSet.user);
          resolve();
        },
        (txObj, error) => {
          console.log('Error al agregar user:', error);
          reject(error);
        }
      );
    });
  });
};

//Eliminar todos los usuarios
export const eliminarUser = () => {
  //Esto elimina los usuarios
  db.transaction(tx => {
    tx.executeSql(
      'DELETE FROM users;',
      [],
      () => {
        console.log('Tabla users vaciada exitosamente');
      },
      (txObj, error) => {
        console.log('Error al vaciar la tabla users:', error);
      }
    );
  });
  console.log('users', users);
}
