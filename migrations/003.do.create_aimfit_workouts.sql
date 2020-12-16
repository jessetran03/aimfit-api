CREATE TYPE week_day AS ENUM (
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday'
);

CREATE TABLE aimfit_workouts (
  id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
  workout_id INTEGER REFERENCES aimfit_users(id)
    ON DELETE SET NULL,
  day week_day,
  title TEXT NOT NULL
);