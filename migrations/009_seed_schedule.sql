INSERT INTO schedule_weekly (day_of_week, start_time, end_time)
SELECT d, '10:00', '12:00' FROM generate_series(1, 6) AS d
WHERE NOT EXISTS (SELECT 1 FROM schedule_weekly WHERE day_of_week = d AND start_time = '10:00');

INSERT INTO schedule_weekly (day_of_week, start_time, end_time)
SELECT d, '16:00', '19:00' FROM generate_series(1, 6) AS d
WHERE NOT EXISTS (SELECT 1 FROM schedule_weekly WHERE day_of_week = d AND start_time = '16:00');
