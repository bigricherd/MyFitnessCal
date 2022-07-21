-- DROP TYPE musclegroup CASCADE;
--CREATE TYPE muscleGroup AS ENUM ('chest', 'shoulders', 'biceps', 'triceps', 'forearms', 'traps', 'neck', 'lats', 'lower_back', 'abs', 'hamstrings', 'quads', 'glutes', 'calves', 'tibialis', 'cardio');
--SELECT enum_range(NULL::muscleGroup); -- view muscleGroup enum

-- DROP TABLE appUser;
-- CREATE TABLE appUser(
--     id UUID PRIMARY KEY,
--     username varchar(30) NOT NULL UNIQUE,
--     password varchar(60)
-- );

-- SELECT * FROM appUser;

-- DROP TABLE exercises CASCADE;
--   CREATE TABLE exercises(
--       id UUID,
--       name varchar(25),
--       musclegroup MUSCLEGROUP NOT NULL,
--       nameandmusclegroup varchar(45) PRIMARY KEY NOT NULL,
--       owner UUID NOT NULL,
--                    CONSTRAINT fk_owner
--                    FOREIGN KEY(owner)
--                    REFERENCES appUser(id)
--   );

 --select * from exercises;

-- DROP TABLE SESSION;
-- CREATE TABLE SESSION (
--    id UUID PRIMARY KEY NOT NULL,
--    title varchar(15) NOT NULL,
--    startdatetime timestamptz NOT NULL,
--    enddatetime timestamptz NOT NULL,
--    owner uuid NOT NULL,
--                  CONSTRAINT fk_owner
--                  FOREIGN KEY(OWNER)
--                  REFERENCES appUser(id),
--    comments varchar(40)
-- )

-- select * from session

-- DROP TABLE set1;
--  CREATE TABLE IF NOT EXISTS SET1 (
--                    id UUID NOT NULL,
--                    reps INT NOT NULL,
--                    weight INT NOT NULL,
--                    date DATE NOT NULL,
--                    exercise varchar(45) NOT NULL,
--                                   CONSTRAINT fk_exercise
--                                     FOREIGN KEY(exercise)
--                                   REFERENCES exercises(nameandmusclegroup)
--                                   ON DELETE CASCADE,
--                    musclegroup MUSCLEGROUP NOT NULL,
--                    owner UUID NOT NULL,
--                    CONSTRAINT fk_owner
--                                   FOREIGN KEY(owner)
--                                   REFERENCES appUser(id),
--                    session UUID NOT NULL,
--                     CONSTRAINT fk_session
--                                   FOREIGN KEY(session)
--                                   REFERENCES session(id)
--                                   ON DELETE CASCADE
-- );

-- SELECT * FROM set1