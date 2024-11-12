import * as SQLite from 'expo-sqlite/legacy';

// Abre (o crea) la base de datos
const db = SQLite.openDatabase('miPuerquitoS.db');

//Inicializar las tablas
export const inicializarDB = () => {
  crearTablaUsers();
  crearTablaCards();
}

// TABLA USUARIOS

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
          console.log('Usuario agregado con id:', resultSet.insertId);
          resolve(resultSet.insertId); // Devuelve el id del usuario insertado
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


// TABLA CARDS

export const crearTablaCards = () => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS cards (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER,
          card_type TEXT CHECK(card_type IN ('credit', 'debit')),
          last_four INTEGER CHECK(length(last_four) = 4),
          expiration_date TEXT,
          issuer TEXT,
          billing_date INTEGER,
          balance_limit REAL,
          balance REAL,
          FOREIGN KEY (user_id) REFERENCES users(id)
        );`,
        [],
        () => {
          console.log('Tabla cards creada o ya existe');
          resolve();
        },
        (txObj, error) => {
          console.log('Error al crear la tabla cards:', error);
          reject(error);
        }
      );
    });
  });
};


export const insertarCard = (user_id, card_type, last_four, expiration_date, issuer, billing_date, balance_limit, balance) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `INSERT INTO cards (user_id, card_type, last_four, expiration_date, issuer, billing_date, balance_limit, balance) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?);`,
        [user_id, card_type, last_four, expiration_date, issuer, billing_date, balance_limit, balance],
        (txObj, resultSet) => {
          console.log('Tarjeta agregada con id:', resultSet.insertId);
          resolve(resultSet.insertId); // Devuelve el id de la tarjeta insertada
        },
        (txObj, error) => {
          console.log('Error al agregar tarjeta:', error);
          reject(error);
        }
      );
    });
  });
};

export const obtenerCards = (user_id) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM cards WHERE user_id = ?;',
        [user_id],
        (txObj, results) => {
          const cards = results.rows._array;
          resolve(cards);
        },
        (txObj, error) => {
          console.log('Error al cargar tarjetas:', error);
          reject(error);
        }
      );
    });
  });
}

//Eliminar todos los usuarios
export const eliminarCards = (user_id) => {
  db.transaction(tx => {
    tx.executeSql(
      'DELETE FROM cards WHERE user_id = ?;',
      [user_id],
      () => {
        console.log('Tabla cards vaciada exitosamente');
      },
      (txObj, error) => {
        console.log('Error al vaciar la tabla cards:', error);
      }
    );
  });
}
