const express = require('express')
const ExercisesService = require('./exercises-service')
const xss = require('xss')
//const { requireAuth } = require('../middleware/jwt-auth')

const exercisesRouter = express.Router()

const serializeExercise = exercise => ({
  id: exercise.id,
  exercise_name: xss(exercise.exercise_name),
})

exercisesRouter
  .route('/')
  .get((req, res, next) => {
    const db = req.app.get('db')
    ExercisesService.getAllExercises(db)
      .then(exercises => {
        res.json(exercises.map(serializeExercise))
      })
      .catch(next)
  })

exercisesRouter
  .route('/:exercise_id')
  //.all(requireAuth)
  .all(checkExerciseExists)
  .get((req, res) => {
    res.json(serializeExercise(res.exercise))
  })

exercisesRouter.route('/:exercise_id/comments/')
  //.all(requireAuth)
  .all(checkExerciseExists)
  .get((req, res, next) => {
    ExercisesService.getCommentsForExercise(
      req.app.get('db'),
      req.params.exercise_id
    )
      .then(comments => {
        res.json(comments.map(ExercisesService.serializeExerciseComment))
      })
      .catch(next)
  })

/* async/await syntax for promises */
async function checkExerciseExists(req, res, next) {
  try {
    const exercise = await ExercisesService.getById(
      req.app.get('db'),
      req.params.exercise_id
    )

    if (!exercise)
      return res.status(404).json({
        error: `Exercise doesn't exist`
      })

    res.exercise = exercise
    next()
  } catch (error) {
    next(error)
  }
}

module.exports = exercisesRouter