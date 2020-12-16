const WorkoutsService = {
  getAllWorkouts(knex) {
    return knex.select('*').from('aimfit_workouts')
  },
  insertWorkout(knex, newWorkout) {
    return knex
      .insert(newWorkout)
      .into('aimfit_workouts')
      .returning('*')
      .then(rows => {
        return rows[0]
      })
  },
  getById(knex, id) {
    return knex.from('aimfit_workouts').select('*').where('id', id).first()
  },
  deleteWorkout(knex, id) {
    return knex('aimfit_workouts')
      .where({ id })
      .delete()
  },
  updateWorkout(knex, id, newWorkoutFields) {
    return knex('aimfit_workouts')
      .where({ id })
      .update(newWorkoutFields)
  },
}

module.exports = WorkoutsService