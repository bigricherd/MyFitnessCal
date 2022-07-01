--DROP TABLE exercises;
--   CREATE TABLE exercises(
--       id UUID,
--       name varchar(25),
--       musclegroup MUSCLEGROUP NOT NULL,
--       nameandmusclegroup varchar(45) PRIMARY KEY NOT NULL
--   )

-- select * from exercises;

-- CREATE TYPE muscleGroup AS ENUM ('chest', 'shoulders', 'biceps', 'triceps', 'traps', 'lats', 'lower_back', 'abs', 'hamstrings', 'quads', 'glutes', 'calves');
-- SELECT enum_range(NULL::muscleGroup); -- view muscleGroup enum

-- DROP TABLE appUser;
-- CREATE TABLE appUser(
--     id UUID PRIMARY KEY,
--     username varchar(30) NOT NULL UNIQUE,
--     password varchar(60)
-- );

--SELECT * FROM appUser;

-- DROP TABLE set1;
--  CREATE TABLE IF NOT EXISTS SET1 (reps INT NOT NULL,
--                    weight INT NOT NULL,
--                    date DATE NOT NULL,
--                    exercise varchar(45) NOT NULL,
--                                   CONSTRAINT fk_exercise
--                                     FOREIGN KEY(exercise)
--                                   REFERENCES exercises(nameandmusclegroup),
--                    musclegroup MUSCLEGROUP NOT NULL,
--                    comments varchar(40) DEFAULT '',
--                    owner UUID NOT NULL,
--                    CONSTRAINT fk_owner
--                                    FOREIGN KEY(owner)
--                                   REFERENCES appUser(id)
-- );

-- SELECT * FROM SET1