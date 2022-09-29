import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import DefaultCalendarView from "../views/CalendarView";
import axios from 'axios';
import formatEnum from "../../helpers/formatEnum";
import {
    Button
} from "@mui/material";
import AddSession from "../forms/AddSession";

function SessionsPage(props) {
    console.log('Sessions page render');
    const [user, setUser] = useState(null);
    const [userId, setUserId] = useState(null);
    const [calEvents, setCalEvents] = useState([]);
    const [dbEvents, setDbEvents] = useState([]);

    // To detect changes in child components
    const [numSessions, setNumSessions] = useState(null);
    const [numEdits, setNumEdits] = useState(0);

    const baseUrl = process.env.REACT_APP_HOME_URL || 'http://localhost:5000';

    let exercisesArr = [];
    const [exercises, setExercises] = useState([]);
    const fetchExercises = useCallback(async () => {
        const data = await fetch(`${baseUrl}/api/enums`);
        const json = await data.json();
        exercisesArr = json.exercises;
        setExercises(exercisesArr);
        console.log(exercisesArr);
    }, []);

    let exercisesByUserArr = [];
    const [exercisesByUser, setExercisesByUser] = useState([]);
    const fetchExercisesByUser = useCallback(async (id) => {
        if (id) {
            const userExercises = await axios({
                method: 'POST',
                url: `${baseUrl}/api/enums/byCurrentUser`,
                data: {
                    id: id
                },
                headers: new Headers({ 'Content-Type': 'application/json', 'Accept': 'application/json' }),
                withCredentials: true

            });
            exercisesByUserArr = userExercises.data.exercisesByUser;
            setExercisesByUser(exercisesByUserArr);
            console.log(exercisesByUserArr);
        }
    }, [userId])


    const getAllSessions = async () => {
        console.log('Fetching sessions');
        const baseUrl = "http://localhost:5000";
        const data = await fetch(`${baseUrl}/api/sessions/all`, {
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        });
        const json = await data.json();
        convertToCalendarEvents(json);
        console.log(calEvents);
        console.log(dbEvents);
    };

    const convertToCalendarEvents = (sessions) => {
        let calendarEvents = sessions.map((session) => ({
            id: session.id,
            startAt: session.startdatetime,
            endAt: session.enddatetime,
            summary: session.title,
        }));
        console.log(calendarEvents);
        setCalEvents(calendarEvents);
        setDbEvents(sessions);
    };

    // Update state every time props.user is updated
    useEffect(() => {
        getAllSessions();
        setUser(props.user);
        setUserId(props.userId);
        fetchExercises();
        fetchExercisesByUser(props.userId);
    }, [props]);

    useEffect(() => {
        getAllSessions();
    }, [numSessions, numEdits]);

    const [showAddSession, setShowAddSession] = useState(false);

    return (
        <>
            {user ? (
                <div className="ms-5 mt-5 pt-5">
                    <Button variant="contained" onClick={() => { setShowAddSession(true) }}>Create Session</Button>
                    <AddSession open={showAddSession} onClose={() => setShowAddSession(false)} exercises={exercises} liftState={setNumSessions} />
                    <DefaultCalendarView
                        calEvents={calEvents}
                        dbEvents={dbEvents}
                        liftNumSessions={setNumSessions}
                        liftNumEdits={setNumEdits}
                        getSessions={getAllSessions}
                        exercises={exercises}
                    />
                </div>
            ) : (
                <div>
                    <p>
                        <Link to={"/register"} className="text-decoration-none">
                            Register
                        </Link>{" "}
                        or{" "}
                        <Link to={"/login"} className="text-decoration-none">
                            Login
                        </Link>{" "}
                        first
                    </p>
                </div>
            )}
        </>
    );
}

export default SessionsPage;
