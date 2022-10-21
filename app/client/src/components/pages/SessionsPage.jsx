import React, { useState, useEffect, useCallback } from "react";
import DefaultCalendarView from "../views/CalendarView";
import axios from 'axios';
import {
    Button,
    Tab,
    Box
} from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import AddSession from "../forms/AddSession";
import LoginPage from "./LoginPage";

function SessionsPage(props) {
    console.log('Sessions page render');

    // Views
    const [view, setView] = useState("0");
    const handleChange = (event, newValue) => {
        setView(newValue);
    }

    // User
    const [user, setUser] = useState(null);
    const [userId, setUserId] = useState(null);

    // Calendar
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
    }, [props, view]);

    useEffect(() => {
        getAllSessions();
    }, [numSessions, numEdits]);

    const [showAddSession, setShowAddSession] = useState(false);

    return (
        <>
            {user ? (
                <>
                    <Button
                        variant="contained"
                        onClick={() => { setShowAddSession(true) }}
                        sx={{
                            marginTop: "5rem",
                            marginBottom: "1rem"
                        }}
                    >
                        Create Session
                    </Button>
                    <AddSession open={showAddSession} onClose={() => setShowAddSession(false)} exercises={exercises} liftState={setNumSessions} />

                    <Box>
                        <TabContext value={view} aria-label="tabs" centered>
                            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                <TabList aria-label="tabs" onChange={handleChange} centered>
                                    <Tab label="Calendar" value={"0"} />
                                    <Tab label="Cards" value={"1"} />
                                </TabList>
                            </Box>


                            <TabPanel value={"0"}>
                                <DefaultCalendarView
                                    calEvents={calEvents}
                                    dbEvents={dbEvents}
                                    liftNumSessions={setNumSessions}
                                    liftNumEdits={setNumEdits}
                                    getSessions={getAllSessions}
                                    exercises={exercises}
                                />
                            </TabPanel>

                            <TabPanel value={"1"}>
                                Card View
                            </TabPanel>
                        </TabContext>
                    </Box>
                </>

            ) : (
                <LoginPage />
            )}
        </>
    );
}

export default SessionsPage;
