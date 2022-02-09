const error = require('./errors');

const validateExercises = (req, res, next) => {
  try {
    if(!req.body.description) {
      throw new error.CustomError(404, `You can't create exsercise withot discription`)
    };
    if(!isNumber(req.body.duration)) {
      throw new error.CustomError(404, `You can't create exsercise your duration invalid`)
    };
    if(!isDate(req.body.duration)) {
      throw new error.CustomError(404, `You can't create exsercise your date invalid`)
    };
  }
  catch (err) {
    next(err);
  };
  next();
};

const validateFilter = (req, res, next) => {
  try {
    if (!isNumber(req.params.userId) ||
        !isNumber (req.query.limit) ||
        !isDate(req.query.from) ||
        !isDate(req.query.to)
      ) {
        throw new error.CustomError(400, 'Check your id, limit, from and to parameters');
      };
  } catch (err) {
    next(err);
  };
  next();
}

const isNumber = (id) => {
  return /^\d+$/.test(id);
};

const isDate = (date) => {
  return /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/.test(date);
};

module.exports = {
  validateExercises,
  validateFilter,
}