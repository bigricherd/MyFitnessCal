import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import AddExercise from './AddExercise';
import MyExercises from './MyExercises';
import SuggestedExercises from './SuggestedExercises';
import { Stack, Button, Alert } from '@mui/material';


function ExercisesPage(props) {

    const [user, setUser] = useState(props.user);
    const [userId, setUserId] = useState(props.userId);
    const [muscleGroups, setMuscleGroups] = useState(props.muscleGroups);
    const [showSuggestedExercises, setShowSuggestedExercises] = useState(false);
    const [count, setCount] = useState(0);

    // Fetching exercises by logged in user could not be done in App.js because user begins as undefined
    // Instead, we do it here where user can be passed in as props
    let exercisesByUserArr = [];
    let [exercisesByUser, setExercisesByUser] = useState([]);

    // Fetch exercises created by currently logged in user
    const baseUrl = process.env.REACT_APP_HOME_URL || 'http://localhost:5000';

    const url = `${baseUrl}/api/exercises/byCurrentUser?id=${userId}`;
    const fetchExercisesByUser = useCallback(async () => {
        console.log('fetching exercises');
        const userExercises = await axios({
            method: 'GET',
            url: url,
            headers: new Headers({
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }),
            withCredentials: true

        });
        exercisesByUserArr = userExercises.data.exercisesByUser;
        setExercisesByUser(exercisesByUserArr);
        setCount(exercisesByUserArr.length);
    }, [url]);

    // Update user information, muscle groups list, and exercisesByUser when props changes
    useEffect(() => {
        setUser(props.user);
        setUserId(props.userId);
        setMuscleGroups(props.muscleGroups);
        fetchExercisesByUser();
    }, [props, fetchExercisesByUser, count]);

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


    // If there is no logged in user, show the prompt with links to Login and Register pages
    if (!user) {
        return (
            <div>
                <p><Link to={'/register'} className="text-decoration-none">Register</Link> or <Link to={'/login'} className="text-decoration-none">Login</Link> first</p>
            </div>
        )
    }

    else return (
        <Stack direction="column" spacing={1} sx={{ marginTop: "7%" }}>
            <AddExercise muscleGroups={muscleGroups} liftState={setExercisesByUser} />
            <MyExercises exercisesByUser={exercisesByUser} muscleGroups={muscleGroups} liftState={setExercisesByUser} />
            <Stack justifyContent="center" alignItems="center" spacing={1}>
                {/* Feedback messages */}
                {successMsg && showSuccessMsg && <Alert severity="success" onClose={handleCloseSuccessMsg}>{successMsg}</Alert>}

                <Button
                    variant="outlined"
                    onClick={() => { setShowSuggestedExercises(true) }}
                >
                    Suggested Exercises
                </Button>
            </Stack>
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
                parent="exercises"
            />
        </Stack>

    )
}

export default ExercisesPage;