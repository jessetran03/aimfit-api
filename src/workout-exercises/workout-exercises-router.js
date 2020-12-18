const express = require('express')
const WorkoutExercisesService = require('./workout-exercises-service')
const xss = require('xss')
const jsonParser = express.json()
//const { requireAuth } = require('../middleware/jwt-auth')

const workoutExercisesRouter = express.Router()

const serializeWorkoutExercise = exercise => ({
  id: exercise.id,
  workout_id: exercise.workout_id,
  exercise_id: exercise.exercise_id,
})

workoutExercisesRouter
  .route('/')
  //.all(checkWorkoutExerciseExists)
  .get((req, res, next) => {
    const db = req.app.get('db')
    WorkoutExercisesService.getAllWorkoutExercises(db)
      .then(workout_exercises => {
        res.json(workout_exercises.map(serializeWorkoutExercise))
      })
      .catch(next)
  })
  .post(jsonParser, (req, res, next) => {
    const { workout_id, exercise_id } = req.body
    const newWorkoutExercise = { workout_id, exercise_id }

    for (const [key, value] of Object.entries(newWorkoutExercise))
      if (value == null)
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` }
        })

    WorkoutExercisesService.insertWorkoutExercise(
      req.app.get('db'),
      newWorkoutExercise
    )
      .then(workout_exercise => {
        res
          .status(201)
          .json(serializeWorkoutExercise(workout_exercise))
      })
      .catch(next)
  })
workoutExercisesRouter
  .route('/:workout_exercise_id')
  //.all(checkWorkoutExerciseExists)
  .delete((req, res, next) => {
    WorkoutExercisesService.deleteWorkoutExercise(
      req.app.get('db'),
      req.params.workout_exercise_id
    )
      .then(numRowsAffected => {
        res.status(204).end()
      })
      .catch(next)
  })

/* async/await syntax for promises */
async function checkWorkoutExerciseExists(req, res, next) {
  try {
    const workout_exercise = await WorkoutExercisesService.getById(
      req.app.get('db'),
      req.params.workout_exercise_id
    )

    if (!workout_exercise)
      return res.status(404).json({
        error: `Workout exercise doesn't exist`
      })

    res.workout_exercise = workout_exercise
    next()
  } catch (error) {
    next(error)
  }
}

module.exports = workoutExercisesRouter