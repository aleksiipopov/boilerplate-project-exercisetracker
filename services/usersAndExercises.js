const db = require('../db')
const erorrs = require('./errors')

async function createUser (req, res) {
  const userName = req.body.username;
  const user = await db.insertOrLookupUser(userName);
  
  if(!userName) {
    res.status(409).json({
      error: "Can not create without username",
    })
    return
  }
  if (!user) {
    res.status(409).json({
      error: "Can not create new user because such a user already has",
    })
    return
  } else {
    res.json(user);
  }
};

async function getAllUsers (req, res) {
  const users = await db.getAllUsers();
  if(!users) {
    res.status(404).json({
      error: "Can not find anyone users"
    })
    return
  } else {
    res.json(users)
    return
  }
};

async function getUserById (req, res) {
  const id = req.params.userId;
  if(!id) {
    res.status(409).json({
      error: `Can not find user with id=${id}`
    })
    return
  }

  const user = await db.getUserById(id);

  if(!user) {
    res.status(409).json({
      error: `Can not find user with id=${id}`
    })
    return
  } else {
    res.json(user)
    return
  }
};

async function createExercises (req, res) {
  const id = req.params.userId;
  const user = await db.getUserById(id);
  const exercise = await db.insertExercise(
    id,
    req.body.description,
    req.body.duration,
    req.body.date,
  )
  if (!exercise) {
    res.status(404).json({
      error: "Can not create exercise"
    })
    return
  } else {
    user.exercises = exercise
    res.json(user)
    return
  }
};

async function getExercisesOfUserById (req, res) {
  const count = db.getCountOfExercisesByUserIdFromTo(
    req.params.userId,
    req.query.from,
    req.query.to,
    );

  const exercises = db.getExercisesByUserIdFromToLimit(
    eq.params.userId,
    req.query.from,
    req.query.to,
    req.query.limit,
    );

  const user = {
    ...req.user,
    count,
    exercises,
  };

  res.json(user);
  return
};

module.exports = {
  createUser,
  createExercises,
  getAllUsers,
  getUserById,
  getExercisesOfUserById,
}
