const knex = require('knex')
const app = require('../src/app')
const helpers = require('./test-helpers')

describe('Exercises Endpoints', function() {
  let db

  const { testExercises } = helpers.makeWorkoutsFixtures()

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

  describe(`GET /api/exercises`, () => {
    context(`Given no exercises`, () => {
      it(`responds with 200 and an empty list`, () => {
        return supertest(app)
          .get('/api/exercises')
          .expect(200, [])
      })
    })

    context('Given there are exercises in the database', () => {
      beforeEach('insert exercises', () =>
        helpers.seedExercises(
          db,
          testExercises,
        )
      )

      it('responds with 200 and all of the exercises', () => {
        return supertest(app)
          .get('/api/exercises')
          .expect(200, testExercises)
      })
    })
  })
})