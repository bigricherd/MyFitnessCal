import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import AddExercise from './AddExercise';
import MyExercises from './MyExercises';
import { Box, Grid } from '@mui/material';


function ExercisesPage(props) {

    const [user, setUser] = useState(props.user);
    const [userId, setUserId] = useState(props.userId);
    const [muscleGroups, setMuscleGroups] = useState(props.muscleGroups);

    // Fetching exercises by logged in user could not be done in App.js because user begins as undefined
    // Instead, we do it here where user can be passed in as props
    let exercisesByUserArr = [];
    let [exercisesByUser, setExercisesByUser] = useState([]);

    // Fetch exercises created by currently logged in user
    const baseUrl = process.env.REACT_APP_HOME_URL || 'http://localhost:5000';

    const url = `${baseUrl}/api/exercises/byCurrentUser?id=${userId}`;
    const fetchExercisesByUser = useCallback(async () => {
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
    }, [url]);

    // Update user information, muscle groups list, and exercisesByUser when props changes
    useEffect(() => {
        setUser(props.user);
        setUserId(props.userId);
        setMuscleGroups(props.muscleGroups);
        fetchExercisesByUser();
    }, [props, fetchExercisesByUser]);


    // If there is no logged in user, show the prompt with links to Login and Register pages
    if (!user) {
        return (
            <div>
                <p><Link to={'/register'} className="text-decoration-none">Register</Link> or <Link to={'/login'} className="text-decoration-none">Login</Link> first</p>
            </div>
        )
    }

    else return (
        <Grid container columns={{ xs: 12, sm: 14, md: 20, lg: 24 }} sx={{ mt: '4rem' }}>

            {/* Notice the liftState prop being passed to the two children below. This allows us to induce a re-render of this page when the list of
            exercises added by the current user (exercisesByUser) is changed by either of the two children, i.e., add or delete. */}

            {/* Add exercise form; offset columns on both sides */}
            <Grid item xs={1} sm={3} md={6} lg={8}></Grid>
            <AddExercise muscleGroups={muscleGroups} liftState={setExercisesByUser} />
            <Grid item xs={1} sm={3} md={6} lg={8}></Grid>

            {/* Manage exercises list where a user can delete exercises; offset columns on both sides */}
            <Grid item xs={1} sm={3} md={6} lg={8}></Grid>
            <MyExercises exercisesByUser={exercisesByUser} muscleGroups={muscleGroups} liftState={setExercisesByUser} />
            <Grid item xs={1} sm={3} md={6} lg={8}></Grid>
        </Grid >
    )
}

export default ExercisesPage;