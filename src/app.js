require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const { NODE_ENV } = require('./config')
const exercisesRouter = require('./exercises/exercises-router')
const workoutsRouter = require('./workouts/workouts-router')
const workoutExercisesRouter = require('./workout-exercises/workout-exercises-router')
const authRouter = require('./auth/auth-router')
const usersRouter = require('./users/users-router')
const exerciseLogRouter = require('./exercise-log/exercise-log-router')

const app = express()

const morganOption = (NODE_ENV === 'production')
  ? 'tiny'
  : 'common';

app.use(morgan(morganOption))
app.use(helmet())
app.use(cors())

app.use('/api/exercise_log', exerciseLogRouter)

app.use('/api/exercises', exercisesRouter)

app.use('/api/workouts', workoutsRouter)

app.use('/api/workout_exercises', workoutExercisesRouter)

app.use('/api/auth', authRouter)

app.use('/api/users', usersRouter)

app.get('/', (req, res) => {
  res.send('Hello, world!')
})

app.use(function errorHandler(error, req, res, next) {
  let response
  if (NODE_ENV === 'production') {
    response = { error: { message: error.message, error } }
  } else {
    console.error(error)
    response = { message: error.message, error }
  }
  res.status(500).json(response)
})

module.exports = app