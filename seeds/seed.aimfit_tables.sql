BEGIN;

TRUNCATE
  aimfit_workout_exercises,
  aimfit_exercises,
  aimfit_workouts,
  aimfit_users;

INSERT INTO aimfit_exercises (id, exercise_name, muscle)
VALUES
  (1, 'Bench Press', 'Chest'),
  (2, 'Incline Bench Press', 'Chest'),
  (3, 'Decline Bench Press', 'Chest'),
  (4, 'Cable Fly', 'Chest'),
  (5, 'Pull up', 'Back'),
  (6, 'Barbell Row', 'Back'),
  (7, 'Cable Row', 'Back'),
  (8, 'Lat Pulldown', 'Back'),
  (9, 'Rope Pulldown', 'Triceps'),
  (10, 'Dumbbell Overhead Extension', 'Triceps'),
  (11, 'Dip', 'Triceps'),
  (12, 'Barbell Curll', 'Biceps'),
  (13, 'Dumbbell Curl', 'Biceps'),
  (14, 'Shoulder Press', 'Shoulders'),
  (15, 'Lateral Dumbbell Raise', 'Shoulders'),
  (16, 'Face Pull', 'Shoulders'),
  (17, 'Shrug', 'Traps'),
  (18, 'Squat', 'Quads'),
  (19, 'Leg Press', 'Quads'),
  (20, 'Leg Extensions', 'Quads'),
  (21, 'Deadlift', 'Hamstrings'),
  (22, 'Hamstring Curl', 'Hamstrings'),
  (23, 'Calf Raise', 'Calves');

  COMMIT;