const express = require('express')
const app = express()
const cors = require('cors')
const db = require('./db')
const validate =require('./services/validate')

const users = require('./services/usersAndExercises')

require('dotenv').config()

main()

async function main () {
  app.use(cors());
  app.use(express.static('public'));


  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  await db.dbInit();


  app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/index.html')
  });
  app.post('/api/users', users.createUser);
  app.get('/api/users', users.getAllUsers);
  app.use('/api/users/:userId/exercises', validate.validateExercises);
  app.post('/api/users/:userId/exercises', users.createExercises);
  app.use('/api/users/:userId/logs', validate.validateFilter);
  app.get('/api/users/:userId/logs', users.getExercisesOfUserById);
}





const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
