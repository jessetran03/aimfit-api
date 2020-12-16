BEGIN;

TRUNCATE
  aimfit_workout_exercises,
  aimfit_exercises,
  aimfit_workouts,
  aimfit_users;

INSERT INTO aimfit_users (user_name, full_name, password)
VALUES
  ('test', 'Test User', 'password'),
  ('Russel', 'Russel Orhii', 'password2');

INSERT INTO aimfit_exercises (id, exercise_name)
VALUES
  (1, 'Bench Press'),
  (2, 'Pull up'),
  (3, 'Squat'),
  (4, 'Deadlift'),
  (5, 'Dumbbell Curl'),
  (6, 'Shoulder Press'),
  (7, 'Incline Bench Press'),
  (8, 'Decline Bench Press'),
  (9, 'Pec Fly'),
  (10, 'Barbell Row'),
  (11, 'Cable Row'),
  (12, 'Lat Pulldown');

INSERT INTO aimfit_workouts (id, title, day)
VALUES
  (1, 'Push Workout', 'Monday'),
  (2, 'Pull Workout', 'Tuesday'),
  (3, 'Cardio Workout', 'Wednesday');

INSERT INTO aimfit_workout_exercises (workout_id, exercise_id)
VALUES
  (1, 2),
  (1, 3),
  (1, 4),
  (2, 3);

  COMMIT;