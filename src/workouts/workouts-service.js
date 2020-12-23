const WorkoutsService = {
  getAllWorkouts(knex, user_id) {
    return knex.select('*').from('aimfit_workouts')
    .where({ user_id })
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
  getExercisesForWorkout(knex, workout_id) {
    return knex
      .select('we.id', 'e.exercise_name', 'we.exercise_id')
      .from('aimfit_workout_exercises as we')
      .where({'we.workout_id': workout_id})
      .join(
        'aimfit_workouts as w',
        'we.workout_id',
        'w.id',
      )
      .join(
        'aimfit_exercises as e',
        'we.exercise_id',
        'e.id',
      )
  },
  deleteWorkoutExercise(knex, id) {
    return knex('aimfit_workout_exercises')
      .where({ id })
      .delete()
  },
}

module.exports = WorkoutsService