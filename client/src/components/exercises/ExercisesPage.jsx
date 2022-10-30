import React, { useState, useEffect } from 'react';
//simport { Link } from 'react-router-dom';
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
    const fetchExercisesByUser = async () => {
        // const userExercises = await axios({
        //     method: 'GET',
        //     url: `/api/exercises/byCurrentUser?id=${userId}`,
        //     headers: new Headers({
        //         'Content-Type': 'application/json',
        //         'Accept': 'application/json'
        //     }),
        //     withCredentials: true

        // });
        const userExercises = await fetch(`/api/exercises/byCurrentUser?id=${userId}`, {
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        });
        const json = await userExercises.json();
        exercisesByUserArr = json.exercisesByUser;
        setExercisesByUser(exercisesByUserArr);
        setCount(exercisesByUserArr.length);
    };

    // Fetch user exercises on initial render
    useEffect(() => {
        fetchExercisesByUser();
    }, []);

    useEffect(() => {
        fetchExercisesByUser();
    }, [count]);

    // Update user information, muscle groups list, and exercisesByUser when props changes
    useEffect(() => {
        setUser(props.user);
        setUserId(props.userId);
        setMuscleGroups(props.muscleGroups);
        fetchExercisesByUser();
    }, [props]);

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


    // // If there is no logged in user, show the prompt with links to Login and Register pages
    // if (!user) {
    //     return (
    //         <div>
    //             <p><Link to={'/register'} className="text-decoration-none">Register</Link> or <Link to={'/login'} className="text-decoration-none">Login</Link> first</p>
    //         </div>
    //     )
    // }

    // else
    return (
        <Stack
            direction="column"
            spacing={1}
            sx={{
                marginTop: {
                    xs: "17%",
                    ml: "10%",
                    xl: "7%"
                }
            }}>

            {/* Add exercise form component */}
            <AddExercise muscleGroups={muscleGroups} liftState={setExercisesByUser} />

            <Stack justifyContent="center" alignItems="center">
                {/* Toggle suggested exercises */}
                <Button
                    variant="outlined"
                    onClick={() => { setShowSuggestedExercises(true) }}
                    sx={{ borderWidth: "2px" }}
                >
                    Suggested Exercises
                </Button>
            </Stack>

            {/* List of user's exercises with delete functionality */}
            <MyExercises exercisesByUser={exercisesByUser} muscleGroups={muscleGroups} liftState={setExercisesByUser} />

            <Stack justifyContent="center" alignItems="center">
                {/* Feedback messages */}
                {successMsg && showSuccessMsg && <Alert severity="success" onClose={handleCloseSuccessMsg}>{successMsg}</Alert>}
            </Stack>

            {/* Suggested exercises popup */}
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