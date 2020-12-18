const WorkoutExercisesService = {
  getAllWorkoutExercises(knex) {
    return knex.select('*').from('aimfit_workout_exercises')
  },
  getById(knex, id) {
    return knex.from('aimfit_workout_exercises').select('*').where('id', id).first()
  },
  insertWorkoutExercise(knex, newWorkoutExercise) {
    return knex
      .insert(newWorkoutExercise)
      .into('aimfit_workout_exercises')
      .returning('*')
      .then(rows => {
        return rows[0]
      })
  },
  deleteWorkoutExercise(knex, id) {
    return knex('aimfit_workout_exercises')
      .where({ id })
      .delete()
  },
}

module.exports = WorkoutExercisesService