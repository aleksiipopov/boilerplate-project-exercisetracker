const path = require("path");
const fs = require("fs");
const util = require("util");
const sqlite3 = require("sqlite3");
const sqlite = require("sqlite-sync")
require("dotenv").config();


const DB_PATH = path.join(__dirname, "users.db");
const DB_SQL_PATH = path.join(__dirname, "users-db.sql");

const myDB = new sqlite3.Database(DB_PATH);
const SQL3 = {
  run(...args) {
    return new Promise((resolve, reject) => {
      myDB.run(...args, function onResult(err) {
        if (err) reject(err);
        else resolve(this);
      });
    });
  },
  get: util.promisify(myDB.get.bind(myDB)),
  all: util.promisify(myDB.all.bind(myDB)),
  exec: util.promisify(myDB.exec.bind(myDB)),
};

const dbInit = async () => {
  let initSQL = fs.readFileSync(DB_SQL_PATH, "utf-8");
  await SQL3.exec(initSQL);
};


const insertUser = async (username) => {
  let result = await SQL3.run(
    `
      INSERT INTO
        users (username)
      VALUES
        (?)
    `,
    username
  );
  if (!result) {
    return null;
  }
  let userObj = {
    id: result.lastID,
    username: username,
  };
  return userObj;
};

const insertOrLookupUser = async (username) => {
  let result = await getUserByUsername(username);
  if (result) {
    return null;
  }
  return await insertUser(username);
};

const insertExercise = async (user_id, description, duration, date) => {
  const dateToInsert = date ? date : new Date().toISOString().slice(0, 10);
  let result = await SQL3.run(
    `
      INSERT INTO
        exercises (user_id, description, duration, date)
      VALUES
        (?, ?, ?, ?)
    `,
    [user_id, description, duration, dateToInsert]
  );
  if (!result) {
    return null;
  }
  let exerciseObj = {
    user_id: user_id,
    description: description,
    duration: duration,
    date: dateToInsert,
  };
  return exerciseObj;
};

const getAllUsers = async () => {
  const result = await SQL3.all(
    `
      SELECT
        *
      FROM
        users
    `
  );
  if (!result) {
    return null;
  }
  return result;
};

const getAllExercises = async () => {
  const result = await SQL3.all(
    `
      SELECT
        *
      FROM
      exercises
    `
  );
  if (!result) {
    return null;
  }
  return result;
};

const getAllExercisesOfUserById = async (id) => {
  const result = await SQL3.get(
    `
    SELECT
      user_id
    FROM
      exercises
    WHERE
      user_id = ?
    `,
    id
  );
  if (!result) {
    return [];
  }
  return result
}

const getUserByUsername = async (username) => {
  let result = await SQL3.get(
    `
    SELECT
      id, username
    FROM
      users
    WHERE
      username = ?
	`,
    username
  );
  if (!result) {
    return null;
  }
  return {
    id: result.id,
    username: result.username,
  };
};

const getUserById = async (id) => {
  let result = await SQL3.get(
    `
    SELECT
      id, username
    FROM
      users
    WHERE
      id = ?
	`,
    id
  );
  if (!result) {
    return null;
  }
  return {
    id: result.id,
    username: result.username,
  };
};

const getExercisesByUserIdFromToLimit = async (id, from, to, limit) => {
  const arrayOfParams = [id]
  let result = `
	SELECT
    description, duration, date
	FROM
    exercises
	WHERE
    user_id = ?
	`;

  if (from) {
    result += `AND date>?`;
    arrayOfParams.push(from);
  }
  if (to) {
    result += `AND date<?`;
    arrayOfParams.push(to);
  }
  result += `ORDER BY date `;
  if (limit) {
    result += `LIMIT ?`;
    arrayOfParams.push(limit)
  }

  let filteredExercises = await SQL3.all(result, arrayOfParams);
  if (!filteredExercises) {
    return [];
  }
  return filteredExercises;
};

const getCountOfExercisesByUserIdFromTo = async (id, from, to) => {
  const arrayOfParams = [id]
  let queryStr = `
  SELECT
    COUNT(1)
  FROM
    exercises
  WHERE
    user_id=?
  `;
  
  if (from) {
    result += `AND date>?`;
    arrayOfParams.push(from);
  }
  if (to) {
    result += `AND date<?`;
    arrayOfParams.push(to);
  }

  let result = await SQL3.get(queryStr, queryParams);
  return result["COUNT(1)"];
};

module.exports = {
  dbInit,
  insertUser,
  insertOrLookupUser,
  insertExercise,
  getAllUsers,
  getAllExercises,
  getAllExercisesOfUserById,
  getUserById,
  getCountOfExercisesByUserIdFromTo,
  getExercisesByUserIdFromToLimit,
};
