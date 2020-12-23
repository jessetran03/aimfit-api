const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

function makeUsersArray() {
  return [
    {
      id: 1,
      user_name: 'test-user-1',
      full_name: 'Test user 1',
      password: 'password',
    },
    {
      id: 2,
      user_name: 'test-user-2',
      full_name: 'Test user 2',
      password: 'password',
    },
    {
      id: 3,
      user_name: 'test-user-3',
      full_name: 'Test user 3',
      password: 'password',
    },
    {
      id: 4,
      user_name: 'test-user-4',
      full_name: 'Test user 4',
      password: 'password',
    },
  ]
}

function makeExercisesArray() {
  return [
    {
      id: 1,
      exercise_name: 'First test exercise!',
    },
    {
      id: 2,
      exercise_name: 'Second test exercise!',
    },
    {
      id: 3,
      exercise_name: 'Third test exercise!',
    },
    {
      id: 4,
      exercise_name: 'Fourth test exercise!',
    },
    {
      id: 5,
      exercise_name: 'Fifth test exercise!',
    },
    {
      id: 6,
      exercise_name: 'Sixth test exercise!',
    },
    {
      id: 7,
      exercise_name: 'Seventh test exercise!',
    },
  ];
}

function makeWorkoutsArray(users) {
  return [
    {
      id: 1,
      title: 'First test workout!',
      day: 'Monday',
      user_id: users[0].id,
    },
    {
      id: 2,
      title: 'Second test workout!',
      day: 'Tuesday',
      user_id: users[1].id,
    },
    {
      id: 3,
      title: 'Third test workout!',
      day: 'Wednesday',
      user_id: users[2].id,
    },
    {
      id: 4,
      title: 'Fourth test workout!',
      day: 'Thursday',
      user_id: users[3].id,
    },
  ]
}

function makeWorkoutExercisesArray(workouts, exercises) {
  return [
    {
      id: 1,
      workout_id: workouts[0].id,
      exercise_id: exercises[0].id,
    },
    {
      id: 2,
      workout_id: workouts[0].id,
      exercise_id: exercises[1].id,
    },
    {
      id: 3,
      workout_id: workouts[0].id,
      exercise_id: exercises[2].id,
    },
    {
      id: 4,
      workout_id: workouts[1].id,
      exercise_id: exercises[1].id,
    },
    {
      id: 5,
      workout_id: workouts[1].id,
      exercise_id: exercises[2].id,
    },
    {
      id: 6,
      workout_id: workouts[1].id,
      exercise_id: exercises[3].id,
    },
    {
      id: 7,
      workout_id: workouts[2].id,
      exercise_id: exercises[4].id,
    },
    {
      id: 8,
      workout_id: workouts[2].id,
      exercise_id: exercises[5].id,
    },
    {
      id: 9,
      workout_id: workouts[2].id,
      exercise_id: exercises[6].id,
    },
  ];
}

function makeExpectedWorkout(users, workout, workoutExercises=[]) {
  const user = users
    .find(user => user.id === workout.user_id) || {}

  const number_of_workout_exercises = workoutExercises
    .filter(workoutExercise => workoutExercise.workout_id === workout.id)
    .length

  return {
    id: workout.id,
    day: workout.day,
    title: workout.title,
  }
}

function makeExpectedWorkoutExercises(workoutId, workoutExercises) {
  const expectedWorkoutExercises = workoutExercises
    .filter(workoutExercise => workoutExercise.workout_id === workoutId)

  return expectedWorkoutExercises.map(workout_exercise => {
    return {
      id: workout_exercise.id,
      workout_id: workout_exercise._workout_id,
      exercise_id: workout_exercise.exercise_id,
    }
  })
}

function makeMaliciousWorkout(user) {
  const maliciousWorkout = {
    id: 911,
    day: 'Sunday',
    title: 'Naughty naughty very naughty <script>alert("xss");</script>',
    user_id: user.id,
  }
  const expectedWorkout = {
    ...makeExpectedWorkout([user], maliciousWorkout),
    title: 'Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;',
  }
  return {
    maliciousWorkout,
    expectedWorkout,
  }
}

function makeWorkoutsFixtures() {
  const testUsers = makeUsersArray()
  const testExercises = makeExercisesArray()
  const testWorkouts = makeWorkoutsArray(testUsers)
  const testWorkoutExercises = makeWorkoutExercisesArray(testWorkouts, testExercises)
  return { testUsers, testExercises, testWorkouts, testWorkoutExercises }
}

function cleanTables(db) {
  return db.transaction(trx =>
    trx.raw(
      `TRUNCATE
        aimfit_workout_exercises,
        aimfit_exercises,
        aimfit_workouts,
        aimfit_users
      `
    )
    .then(() =>
      Promise.all([
        trx.raw(`ALTER SEQUENCE aimfit_workouts_id_seq minvalue 0 START WITH 1`),
        trx.raw(`ALTER SEQUENCE aimfit_users_id_seq minvalue 0 START WITH 1`),
        trx.raw(`ALTER SEQUENCE aimfit_exercises_id_seq minvalue 0 START WITH 1`),
        trx.raw(`SELECT setval('aimfit_workouts_id_seq', 0)`),
        trx.raw(`SELECT setval('aimfit_users_id_seq', 0)`),
        trx.raw(`SELECT setval('aimfit_exercises_id_seq', 0)`),
      ])
    )
  )
}

function seedUsers(db, users) {
  const preppedUsers = users.map(user => ({
    ...user,
    password: bcrypt.hashSync(user.password, 1)
  }))
  return db.into('aimfit_users').insert(preppedUsers)
    .then(() =>
      // update the auto sequence to stay in sync
      db.raw(
        `SELECT setval('aimfit_users_id_seq', ?)`,
        [users[users.length - 1].id],
      )
    )
}

function seedExercises(db, exercises) {
  const preppedExercises = exercises.map(exercise => ({
    ...exercise,
    exercise_name: exercise.exercise_name
  }))
  return db.into('aimfit_exercises').insert(preppedExercises)
    .then(() =>
      // update the auto sequence to stay in sync
      db.raw(
        `SELECT setval('aimfit_exercises_id_seq', ?)`,
        [exercises[exercises.length - 1].id],
      )
    )
}

function seedWorkoutsTables(db, users, exercises = [], workouts = [], workoutExercises=[]) {
  // use a transaction to group the queries and auto rollback on any failure
  return db.transaction(async trx => {
    await seedUsers(trx, users)
    await seedExercises(trx, exercises)
    await trx.into('aimfit_workouts').insert(workouts)
    // update the auto sequence to match the forced id values
    if(workouts.length == 0) {
      return
    }
    await trx.raw(
      `SELECT setval('aimfit_workouts_id_seq', ?)`,
      [workouts[workouts.length - 1].id],
    )
    // only insert workout exercises if there are some, also update the sequence counter
    if (workoutExercises.length) {
      await trx.into('aimfit_workout_exercises').insert(workoutExercises)
      await trx.raw(
        `SELECT setval('aimfit_workout_exercises_id_seq', ?)`,
        [workoutExercises[workoutExercises.length - 1].id],
      )
    }
  })
}

function seedMaliciousWorkout(db, user, workout) {
  return seedUsers(db, [user])
    .then(() =>
      db
        .into('aimfit_workouts')
        .insert([workout])
    )
}

function makeAuthHeader(user, secret = process.env.JWT_SECRET) {
  const token = jwt.sign({ user_id: user.id }, secret, {
    subject: user.user_name,
    algorithm: 'HS256',
  })
  return `Bearer ${token}`
}

module.exports = {
  makeUsersArray,
  makeExercisesArray,
  makeWorkoutsArray,
  makeWorkoutExercisesArray,
  makeExpectedWorkout,
  makeExpectedWorkoutExercises,
  makeMaliciousWorkout,

  makeWorkoutsFixtures,
  cleanTables,
  seedExercises,
  seedWorkoutsTables,
  seedMaliciousWorkout,
  makeAuthHeader,
  seedUsers,
}