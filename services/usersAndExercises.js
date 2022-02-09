const db = require('../db')
const erorrs = require('./errors')

async function createUser (req, res, next) {
  const userName = req.body.username;
  try {
    const user = await db.insertOrLookupUser(userName);
    if (!user) {
      throw new erorrs.CustomError('404', 'Can not create new user')
    }
    res.json(user);
  }
  catch (error) {
    next(error);
  }
};

async function getAllUsers (req, res, next) {
  try {
    const users = await db.getAllUsers();
    if(!users) {
      throw new erorrs.CustomError('404', 'Can not find anyone users')
    }
    res.json(users)
  }
  catch (error) {
    next(error)
  }
};

async function getUserById (req, res, next) {
  const id = req.params.userId;
  if(!id) {
    next();
    return;
  }

  try {
    const user = await db.getUserById(id);
    if(!user) {
      throw new erorrs.CustomError('404', `Can not find user with this id=${id}`)
    }
    res.json(user)
  }
  catch(error) {
    next(error)
  }
};

async function createExercises (req, res, next) {
  const id = req.params.userId;
  const user = await db.getUserById(id);
  try {
    const exercise = await db.insertExercise(
      id,
      req.body.description,
      req.body.duration,
      req.body.date,
    )
    if (!exercise) {
      throw new error.CustomError('404', 'Can not create exesice')
    }
    user.exercises = exercise
    res.json(user)
  }
  catch (error) {
    next(error)
  }
};

async function getExercisesOfUserById (req, res, next) {
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
};


module.exports = {
  createUser,
  createExercises,
  getAllUsers,
  getUserById,
  getExercisesOfUserById,
}