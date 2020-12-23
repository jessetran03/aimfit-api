const express = require('express')
const WorkoutsService = require('./workouts-service')
const xss = require('xss')
const jsonParser = express.json()
const { requireAuth } = require('../middleware/jwt-auth')

const workoutsRouter = express.Router()

const serializeWorkout = workout => ({
  id: workout.id,
  title: xss(workout.title),
  day: workout.day,
})

const serializeWorkoutExercise = exercise => ({
  id: exercise.id,
  exercise_name: xss(exercise.exercise_name),
  exercise_id: exercise.exercise_id,
})

workoutsRouter
  .route('/')
  .all(requireAuth)
  .get((req, res, next) => {
    const db = req.app.get('db')
    const user_id = req.user.id

    WorkoutsService.getAllWorkouts(db, user_id)
      .then(workouts => {
        res.json(workouts.map(serializeWorkout))
      })
      .catch(next)
  })
  .post(jsonParser, (req, res, next) => {
    const { title, day } = req.body
    const newWorkout = { title, day }
    newWorkout.user_id = req.user.id

    for (const [key, value] of Object.entries(newWorkout))
      if (value == null)
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` }
        })

    WorkoutsService.insertWorkout(
      req.app.get('db'),
      newWorkout
    )
      .then(workout => {
        res
          .status(201)
          .json(serializeWorkout(workout))
      })
      .catch(next)
  })

workoutsRouter
  .route('/:workout_id')
  .all(requireAuth)
  .all(checkWorkoutExists)
  .get((req, res) => {
    res.json(serializeWorkout(res.workout))
  })
  .delete((req, res, next) => {
    WorkoutsService.deleteWorkout(
      req.app.get('db'),
      req.params.workout_id
    )
      .then(numRowsAffected => {
        res.status(204).end()
      })
      .catch(next)
  })

workoutsRouter
  .route('/:workout_id/exercises')
  .all(requireAuth)
  .all(checkWorkoutExists)
  .get((req, res, next) => {
    WorkoutsService.getExercisesForWorkout(
      req.app.get('db'),
      req.params.workout_id
    )
      .then(exercises => {
        res.json(exercises.map(serializeWorkoutExercise))
      })
      .catch(next)
  })

workoutsRouter
  .route('/exercises/:workout_exercise_id')
  .all(checkWorkoutExists)
  .delete((req, res, next) => {
    WorkoutsService.deleteWorkoutExercise(
      req.app.get('db'),
      req.params.workout_id
    )
      .then(numRowsAffected => {
        res.status(204).end()
      })
      .catch(next)
  })

/* async/await syntax for promises */
async function checkWorkoutExists(req, res, next) {
  try {
    const workout = await WorkoutsService.getById(
      req.app.get('db'),
      req.params.workout_id
    )

    if (!workout)
      return res.status(404).json({
        error: `Workout doesn't exist`
      })

    res.workout = workout
    next()
  } catch (error) {
    next(error)
  }
}

module.exports = workoutsRouter