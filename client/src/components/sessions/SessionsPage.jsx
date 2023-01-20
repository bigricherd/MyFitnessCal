import React, { useState, useEffect } from "react";
import DefaultCalendarView from "./CalendarView";
import {
    Button,
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
    const [userId, setUserId] = useState(props.userId);

    // Calendar
    const [calEvents, setCalEvents] = useState([]);
    const [dbEvents, setDbEvents] = useState([]);

    // To detect changes in child components
    const [numSessions, setNumSessions] = useState(null);
    const [numEdits, setNumEdits] = useState(0);
    const [count, setCount] = useState(0); // meant to hold exercisesByUser.length

    // Fetch exercises by current user
    const [exercisesByUser, setExercisesByUser] = useState([]);

    // Fetch exercises created by currently logged in user
    const fetchExercisesByUser = async () => {
        const homeUrl = process.env.REACT_APP_HOME_URL || "http://localhost:3000";
        const userExercises = await fetch(`/api/exercises/byCurrentUser?id=${userId}`, {
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        });
        const data = await userExercises.json();
        setExercisesByUser(data.exercisesByUser);
        setCount(data.exercisesByUser.length);
    };


    const getAllSessions = async () => {
        const data = await fetch(`/api/sessions/all`, {
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        });
        const json = await data.json();
        convertToCalendarEvents(json);
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
                exercisesByUser={exercisesByUser}
                liftState={setNumSessions}
                units={props.units}
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
                darkMode={props.darkMode}
                units={props.units}
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
