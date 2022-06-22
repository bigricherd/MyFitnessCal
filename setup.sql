--CREATE TYPE exercise AS ENUM ('bench_press:chest', 'incline_db_press:chest', 'db_shoulder_press:shoulders', 'bb_shoulder_press:shoulders');
--CREATE TYPE muscleGroup AS ENUM ('chest', 'shoulders', 'biceps', 'triceps', 'traps', 'lats', 'lower_back', 'abs', 'hamstrings', 'quads', 'glutes', 'calves');

--DROP TABLE set1;
-- CREATE TABLE IF NOT EXISTS SET1 (reps INT NOT NULL,
--                   weight INT NOT NULL,
--                   date DATE NOT NULL,
--                   exercise EXERCISE NOT NULL,
--                   musclegroup MUSCLEGROUP NOT NULL,
--                   comments varchar(40) DEFAULT '');


--SELECT enum_range(NULL::exercise); -- view exercise enum
--SELECT enum_range(NULL::muscleGroup); -- view muscleGroup enum