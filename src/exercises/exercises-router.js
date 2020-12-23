const express = require('express')
const ExercisesService = require('./exercises-service')
const xss = require('xss')

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

module.exports = exercisesRouter