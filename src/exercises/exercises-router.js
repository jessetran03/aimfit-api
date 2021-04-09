const express = require('express')
const ExercisesService = require('./exercises-service')
const xss = require('xss')
const exercisesRouter = express.Router()

const serializeExercise = exercise => ({
  id: exercise.id,
  exercise_name: xss(exercise.exercise_name),
  muscle: exercise.muscle,
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
  .all(checkExerciseExists)
  .get((req, res, next) => {
    res.json({
      id: res.exercise.id,
      exercise_name: res.exercise.exercise_name,
      muscle: res.exercise.muscle,
    })
  })

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