-- -- DROP TYPE musclegroup CASCADE;
-- --CREATE TYPE muscleGroup AS ENUM ('chest', 'shoulders', 'biceps', 'triceps', 'forearms', 'traps', 'neck', 'lats', 'lower_back', 'abs', 'hamstrings', 'quads', 'glutes', 'calves', 'tibialis', 'cardio');
-- --SELECT enum_range(NULL::muscleGroup); -- view muscleGroup enum

-- SELECT * FROM pg_timezone_names
-- -- DROP TYPE timezone CASCADE;
-- -- CREATE TYPE timezone as ENUM (
-- --      'US/Samoa', 'US/Hawaii', 'US/Alaska',
-- --      'America/Los_Angeles', 'America/Denver', 'America/Indiana/Knox', 'America/New_York',
-- --      'America/Halifax', 'Canada/Newfoundland' (-3:30), 'America/Argentina/Buenos_Aires', 'GMT-2', 'Atlantic/Cape_Verde',
-- --      'GMT' TODO: complete this 
-- -- ); 

-- --DROP TABLE appUser CASCADE;
-- CREATE TABLE appUser(
--     id UUID PRIMARY KEY,
--     username varchar(30) NOT NULL UNIQUE,
--     password varchar(60),
--     timezone varchar(30)
-- );


-- Testing time zones
-- UPDATE appUser SET timezone = 'America/Vancouver' WHERE username = 'c';
-- SELECT * FROM appUser;

-- -- DROP TABLE exercises CASCADE;
-- -- DROP TABLE exercise CASCADE;
--   CREATE TABLE EXERCISE(
--       id UUID,
--       name varchar(25),
--       musclegroup MUSCLEGROUP NOT NULL,
--       nameandmusclegroup varchar(45) NOT NULL,
--       key varchar(85) PRIMARY KEY NOT NULL,
--       owner UUID NOT NULL,
--                    CONSTRAINT fk_owner
--                    FOREIGN KEY(owner)
--                    REFERENCES appUser(id)
--                    ON DELETE CASCADE
--   );

-- select * from exercise;

--DROP TABLE SESSION CASCADE;
-- CREATE TABLE SESSION (
--    id UUID PRIMARY KEY NOT NULL,
--    title varchar(35) NOT NULL,
--    startdatetime timestamptz NOT NULL,
--    enddatetime timestamptz NOT NULL,
--    owner uuid NOT NULL,
--                  CONSTRAINT fk_owner
--                  FOREIGN KEY(OWNER)
--                  REFERENCES appUser(id)
--                  ON DELETE CASCADE,
--    comments varchar(40)
-- );

-- -- select * from session

-- DROP TABLE set CASCADE;
--  CREATE TABLE IF NOT EXISTS SET (
--                    id UUID NOT NULL,
--                    reps INT NOT NULL,
--                    weight INT NOT NULL,
--                    date DATE NOT NULL,
--                    exercise varchar(85) NOT NULL,
--                                   CONSTRAINT fk_exercise
--                                      FOREIGN KEY(exercise)
--                                      REFERENCES exercise(key)
--                                      ON DELETE CASCADE,
--                    musclegroup MUSCLEGROUP NOT NULL,
--                    owner UUID NOT NULL,
--                                  CONSTRAINT fk_owner
--                                      FOREIGN KEY(owner)
--                                      REFERENCES appUser(id)
--                                      ON DELETE CASCADE,
--                    session UUID NOT NULL,
--                                  CONSTRAINT fk_session
--                                      FOREIGN KEY(session)
--                                      REFERENCES session(id)
--                                      ON DELETE CASCADE
-- );

--SELECT * FROM set