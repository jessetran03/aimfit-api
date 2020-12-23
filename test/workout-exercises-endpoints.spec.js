const knex = require('knex')
const app = require('../src/app')
const helpers = require('./test-helpers')

describe('Workout Exercises Endpoints', function () {
  let db

  const {
    testUsers,
    testExercises,
    testWorkouts,
    testWorkoutExercises,
  } = helpers.makeWorkoutsFixtures()

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DB_URL,
    })
    app.set('db', db)
  })

  after('disconnect from db', () => db.destroy())

  before('cleanup', () => helpers.cleanTables(db))

  afterEach('cleanup', () => helpers.cleanTables(db))

  describe(`DELETE /api/workout_exercises/:workout_exercise_id`, () => {
    context(`Given no workout exercises`, () => {
      it(`responds with 404`, () => {
        const workoutExerciseId = 123456
        return supertest(app)
          .delete(`/api/workout_exercises/${workoutExerciseId}`)
          .expect(404, { error: `Workout exercise doesn't exist` })
      })
    })

    context('Given there are workout exercises in the database', () => {
      beforeEach('insert workouts', () =>
        helpers.seedWorkoutsTables(
          db,
          testUsers,
          testExercises,
          testWorkouts,
          testWorkoutExercises,
        )
      )

      it('responds with 204 and removes the article', () => {
        const idToRemove = 2
        const expectedWorkoutExercises = testWorkoutExercises.filter(workoutExercise => workoutExercise.id !== idToRemove)
        return supertest(app)
          .delete(`/api/workout_exercises/${idToRemove}`)
          .expect(204)
          .then(res =>
            supertest(app)
              .get(`/api/workout_exercises`)
              .expect(expectedWorkoutExercises)
          )
      })
    })
  })

  describe(`POST /api/workout_exercises`, () => {
    beforeEach('insert workouts', () =>
      helpers.seedWorkoutsTables(
        db,
        testUsers,
        testExercises,
        testWorkouts,
        testWorkoutExercises,
      )
    )

    it(`creates an workout exercises, responding with 201`, function () {
      this.retries(3)
      const testWorkout = testWorkouts[0]
      const testExercise = testExercises[0]
      const newWorkoutExercise = {
        workout_id: testWorkout.id,
        exercise_id: testExercise.id,
      }
      return supertest(app)
        .post('/api/workout_exercises')
        .send(newWorkoutExercise)
        .expect(201)
        .expect(res => {
          expect(res.body).to.have.property('id')
          expect(res.body.workout_id).to.eql(newWorkoutExercise.workout_id)
          expect(res.body.exercise_id).to.eql(newWorkoutExercise.exercise_id)
        })
        .expect(res =>
          db
            .from('aimfit_workout_exercises')
            .select('*')
            .where({ id: res.body.id })
            .first()
            .then(row => {
              expect(row.workout_id).to.eql(newWorkoutExercise.workout_id)
              expect(row.exercise_id).to.eql(newWorkoutExercise.exercise_id)
            })
        )
    })
  })

})