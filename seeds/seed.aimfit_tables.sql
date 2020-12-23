BEGIN;

TRUNCATE
  aimfit_workout_exercises,
  aimfit_exercises,
  aimfit_workouts,
  aimfit_users;

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

/*INSERT INTO aimfit_exercises (id, exercise_name, muscle)
VALUES
  (1, 'Bench Press', 'Chest'),
  (2, 'Pull up', 'Back'),
  (3, 'Squat', 'Quads'),
  (4, 'Deadlift', 'Hamstrings'),
  (5, 'Dumbbell Curl', 'Biceps'),
  (6, 'Shoulder Press', 'Shoulders'),
  (7, 'Incline Bench Press', 'Chest'),
  (8, 'Decline Bench Press', 'Chest'),
  (9, 'Pec Fly', 'Chest'),
  (10, 'Barbell Row', 'Back'),
  (11, 'Cable Row', 'Back'),
  (12, 'Lat Pulldown', 'Back');*/

  COMMIT;