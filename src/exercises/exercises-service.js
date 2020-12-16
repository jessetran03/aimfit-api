const ExercisesService = {
  getAllExercises(knex) {
    return knex.select('*').from('aimfit_exercises')
  },
  insertExercise(knex, newExercise) {
    return knex
      .insert(newExercise)
      .into('aimfit_exercises')
      .returning('*')
      .then(rows => {
        return rows[0]
      })
  },
  getById(knex, id) {
    return knex.from('aimfit_exercises').select('*').where('id', id).first()
  },
  deleteExercise(knex, id) {
    return knex('aimfit_exercises')
      .where({ id })
      .delete()
  },
  updateExercise(knex, id, newExerciseFields) {
    return knex('aimfit_exercises')
      .where({ id })
      .update(newExerciseFields)
  },
}

module.exports = ExercisesService