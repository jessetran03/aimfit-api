const ExerciseLogService = {
  getExerciseLog(knex, exercise_id) {
    return knex
      .select('*').from('aimfit_exercise_log')
      .where({ exercise_id })
      .orderBy('date_logged', 'desc')
  },
  insertLogEntry(knex, newLogEntry) {
    return knex
      .insert(newLogEntry)
      .into('aimfit_exercise_log')
      .returning('*')
      .then(rows => {
        return rows[0]
      })
  },
  deleteLogEntry(knex, id) {
    return knex('aimfit_exercise_log')
      .where({ id })
      .delete()
  },
}

module.exports = ExerciseLogService