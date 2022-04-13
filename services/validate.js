const validateExercises = (req, res, next) => {
  if(!req.body.description) {
    res.status(404).json({
      error: `You can't create exsercise withot discription`
    })
  };
  if(!isNumber(req.body.duration)) {
    res.status(404).json({
      error: `You can't create exsercise your duration invalid`
    })
  };
  if(!isDate(req.body.duration)) {
    res.status(404).json({
      error: `You can't create exsercise your date invalid`
    })
  };
  next();
};

const validateFilter = (req, res, next) => {

  if (!isNumber(id)) {
    res.status(404).json({
      error: "Invalid id"
    })
  }
  if (limit && !isNumber(limit)) {
    res.status(404).json({
      error: "Invalid limit"
    })
  }
  if (from && !isDateValid(from)) {
    res.status(404).json({
      error: "Invalid id"
    })
  }
  if (to && !isDateValid(to)) {
    res.status(404).json({
      error: "Invalid id"
    })
  }
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