# AimFit
 * * *
 

 ## Live
 --------------

Demo: [https://aimfit-app.vercel.app/](https://aimfit-app.vercel.app/) </br>
Client Repo: [https://github.com/jessetran03/aimfit](https://github.com/jessetran03/aimfit) </br>
Server Repo: [https://github.com/jessetran03/aimfit-api](https://github.com/jessetran03/aimfit-api)

## Summary
 --------------

 AimFit is a web application that helps you to reach your fitness goals. The application allows the user to create their own workouts and customize the workouts to their needs. The user can also assign a day to each workout to help them organize their weekly workout plan.

## API Documentation
 --------------
 POST /api/auth/login </br>
 POST /api/users </br>
 GET /api/workouts </br>
 POST /api/workouts </br>
 GET /api/workouts/:workout_id </br>
 DELETE /api/workouts/:workout_id </br>
 GET /api/workouts/:workout_id/exercises </br>
 DELETE /api/workouts/exercises/:workout_exercise_id </br>
 GET /api/workout_exercises </br>
 POST /api/workout_exercises </br>
 DELETE /api/workout_exercises/:workout_exercise_id </br>
 GET /api/exercies


 ## Screenshots
  --------------
 Landing Page:
 ![Landing](images/landing-page.jpg)

 Login Page:
 ![Login](images/login-page.jpg)

 Workout List Page:
 ![WorkoutList](images/workout-list.jpg)

 Workout Exercises Page:
 ![WorkoutExercises](images/workout-exercises.jpg)

 Exercise list Page:
 ![ExerciseList](images/exercise-list.jpg)

 Exercise Log Page:
 ![ExerciseLog](images/exercise-log.jpg)


 ## Technologies Used
 --------------

 1. JavaScript
 2. JWT
 3. Node
 4. Express
 5. Chai, Mocha

 psql -U dunder_mifflin -d aimfit -f ./seeds/seed.aimfit_tables.sql
