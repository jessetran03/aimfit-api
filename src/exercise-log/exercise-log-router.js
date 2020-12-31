const express = require('express')
const ExerciseLogService = require('./exercise-log-service')
const jsonParser = express.json()
const { requireAuth } = require('../middleware/jwt-auth')

const exerciseLogRouter = express.Router()

const serializeLogEntry = logEntry => ({
  id: logEntry.id,
  exercise_id: logEntry.exercise_id,
  weight_count: logEntry.weight_count,
  set_count: logEntry.set_count,
  rep_count: logEntry.rep_count,
  date_logged: logEntry.date_logged
})
exerciseLogRouter
  .route('/:exercise_id')
  .all(requireAuth)
  .get((req, res, next) => {
    const db = req.app.get('db')
    ExerciseLogService.getExerciseLog(db, req.params.exercise_id)
      .then(logEntries => {
        res.json(logEntries.map(serializeLogEntry))
      })
      .catch(next)
  })
  .post(jsonParser, (req, res, next) => {
    const { set_count, rep_count, weight_count} = req.body
    const newEntry = { set_count, rep_count, weight_count}

    for (const [key, value] of Object.entries(newEntry))
      if (value == null)
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` }
        })
    newEntry.exercise_id = req.params.exercise_id
    ExerciseLogService.insertLogEntry(
      req.app.get('db'),
      newEntry
    )
      .then(log_entry => {
        res
          .status(201)
          .json(serializeLogEntry(log_entry))
      })
      .catch(next)
  })

exerciseLogRouter
  .route('/:log_entry_id')
  .all(requireAuth)
  .delete((req, res, next) => {
    ExerciseLogService.deleteLogEntry(
      req.app.get('db'),
      req.params.log_entry_id
    )
      .then(numRowsAffected => {
        res.status(204).end()
      })
      .catch(next)
  })

module.exports = exerciseLogRouter