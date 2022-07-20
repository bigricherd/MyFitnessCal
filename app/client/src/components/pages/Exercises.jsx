import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import AddExercise from '../forms/AddExercise';
import ManageExercisesList from '../ManageExercisesList';
import formatEnum from '../../helpers/formatEnum';
import { Box, Grid } from '@mui/material';


function Exercises(props) {

    const [user, setUser] = useState(props.user);
    const [userId, setUserId] = useState(props.userId);
    const [muscleGroups, setMuscleGroups] = useState(props.muscleGroups);

    // Fetching exercises by logged in user could not be done in App.js because user begins as undefined
    // Instead we do it here where user can be passed in as props
    let exercisesByUserArr = [];
    let [exercisesByUser, setExercisesByUser] = useState([]);

    const baseUrl = process.env.REACT_APP_HOME_URL || 'http://localhost:5000';
    const url = `${baseUrl}/api/enums/byCurrentUser`;
    const fetchExercisesByUser = useCallback(async () => {
        const userExercises = await axios({
            method: 'POST',
            url: url,
            data: {
                id: userId
            },
            headers: new Headers({ 'Content-Type': 'application/json', 'Accept': 'application/json' }),
            withCredentials: true

        });
        exercisesByUserArr = formatEnum(userExercises.data.exercisesByUser);
        setExercisesByUser(exercisesByUserArr);
    }, [url])

    useEffect(() => {
        setUser(props.user);
        setUserId(props.userId);
        setMuscleGroups(props.muscleGroups);
        fetchExercisesByUser();
    }, [props, fetchExercisesByUser])


    if (!user) {
        return (
            <div>
                <p><Link to={'/register'} className="text-decoration-none">Register</Link> or <Link to={'/login'} className="text-decoration-none">Login</Link> first</p>
            </div>
        )
    }

    else return (
        <Grid container columns={{ xs: 12, sm: 14, md: 20, lg: 24 }} sx={{ mt: '4rem' }}>
            <Grid item xs={1} sm={3} md={6} lg={8}></Grid> {/** Offset column */}
            <AddExercise muscleGroups={muscleGroups} liftState={setExercisesByUser} />
            <Grid item xs={1} sm={3} md={6} lg={8}></Grid> {/** Offset column */}

            <Grid item xs={1} sm={3} md={6} lg={8}></Grid> {/** Offset column */}
            <ManageExercisesList exercisesByUser={exercisesByUser} liftState={setExercisesByUser} />
            <Grid item xs={1} sm={3} md={6} lg={8}></Grid> {/** Offset column */}
        </Grid >
    )
}

export default Exercises;