import React, { useState, useEffect, useCallback } from "react";
import DefaultCalendarView from "./CalendarView";
import axios from 'axios';
import {
    Button,
    // Tab,
    Box,
    Alert,
    Stack
} from "@mui/material";
// import { TabContext, TabList, TabPanel } from "@mui/lab";
import AddSession from "./AddSession";
import SuggestedExercises from "../exercises/SuggestedExercises";

function SessionsPage(props) {
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
    const [count, setCount] = useState(0); // exercisesByUser.length

    const baseUrl = process.env.REACT_APP_HOME_URL || 'http://localhost:5000';

    // Fetch all exercises
    let exercisesArr = [];
    const [exercises, setExercises] = useState([]);
    const fetchExercises = async () => {
        const data = await fetch(`${baseUrl}/api/exercises/all`);
        const json = await data.json();
        exercisesArr = json.exercises;
        setExercises(exercisesArr);
    };

    useEffect(() => {
        fetchExercises();
    }, []);

    // Fetch exercises by current user
    let exercisesByUserArr = [];
    const [exercisesByUser, setExercisesByUser] = useState([]);

    const fetchExercisesByUser = useCallback(async (id) => {
        if (id) {
            const userExercises = await axios({
                method: 'GET',
                url: `${baseUrl}/api/exercises/byCurrentUser?id=${id}`,
                headers: new Headers({ 'Content-Type': 'application/json', 'Accept': 'application/json' }),
                withCredentials: true

            });
            exercisesByUserArr = userExercises.data.exercisesByUser;
            setExercisesByUser(exercisesByUserArr);
            setCount(exercisesByUserArr.length);
        }
    }, [userId]);


    const getAllSessions = async () => {
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
        // console.log(calEvents);
        // console.log(dbEvents);
    };

    const convertToCalendarEvents = (sessions) => {
        let calendarEvents = sessions.map((session) => ({
            id: session.id,
            startAt: session.startdatetime,
            endAt: session.enddatetime,
            summary: session.title,
        }));
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
    const [showSuggestedExercises, setShowSuggestedExercises] = useState(false);

    // Show suggested exercises popup if props.firstVisit is true
    useEffect(() => {
        setTimeout(() => {
            setShowSuggestedExercises(props.firstVisit);
        }, 2000);
    }, [props.firstVisit]);

    // Setup to show feedback message -- success
    const [showSuccessMsg, setShowSuccessMsg] = useState(false);
    const handleCloseSuccessMsg = () => { setShowSuccessMsg(false); }
    const [successMsg, setSuccessMsg] = useState(null);
    const [prevSuccessMsg, setPrevSuccessMsg] = useState(null);

    useEffect(() => {
        if (successMsg) {
            setShowSuccessMsg(true);
            setTimeout(() => {
                setShowSuccessMsg(false);
            }, 4000)
        }
    }, [successMsg, prevSuccessMsg]);

    return (
        <>
            {/* Feedback messages */}
            <Stack justifyContent="center" alignItems="center">
                {successMsg && showSuccessMsg && <Alert severity="success" onClose={handleCloseSuccessMsg} sx={{ marginTop: '5rem', marginBottom: '1rem' }}>{successMsg}</Alert>}
            </Stack>

            <Button
                variant="outlined"
                onClick={() => { setShowAddSession(true) }}
                sx={!showSuccessMsg && {
                    marginTop: {
                        xs: "5rem",
                        md: "5.5rem"
                    },
                    marginBottom: "1rem",
                    borderWidth: "2px"
                }}
            >
                Create Session
            </Button>

            {/* Add Session (dialog) */}
            <AddSession
                open={showAddSession}
                onClose={() => setShowAddSession(false)}
                setShow={setShowAddSession}
                exercises={exercises}
                exercisesByUser={exercisesByUser}
                liftState={setNumSessions}
            />

            {/* Suggested Exercises (dialog) */}
            <SuggestedExercises
                open={showSuggestedExercises}
                onClose={() => setShowSuggestedExercises(false)}
                setShow={setShowSuggestedExercises}
                user={props.user}
                exercisesByUser={exercisesByUser}
                muscleGroups={props.muscleGroups}
                setFirstVisit={props.setFirstVisit}
                setSuccessMsg={setSuccessMsg}
                setPrevSuccessMsg={setPrevSuccessMsg}
                setCount={setCount}
                parent="sessions"
            />

            <DefaultCalendarView
                calEvents={calEvents}
                dbEvents={dbEvents}
                liftNumSessions={setNumSessions}
                liftNumEdits={setNumEdits}
                getSessions={getAllSessions}
                exercisesByUser={exercisesByUser}
                timezone={props.timezone}
            />
        </>
    );
}

export default SessionsPage;

{/* Tabbed version with Card View (not developed) */ }
{/* <Box> 
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
                exercisesByUser={exercisesByUser}
                timezone={props.timezone}
            />
             </TabPanel>

                    <TabPanel value={"1"}>
                        Coming Soon
                    </TabPanel>
                </TabContext> 
            </Box> */}
