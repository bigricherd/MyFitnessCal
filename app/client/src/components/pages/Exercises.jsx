import React, { useState, useEffect, useCallback } from 'react';
import AddExercise from '../forms/AddExercise';
import ManageExercisesList from '../ManageExercisesList';
import axios from 'axios';
import formatEnum from '../../helpers/formatEnum';


function Exercises(props) {

    const [user, setUser] = useState(props.user);
    const [userId, setUserId] = useState(props.userId);
    const [muscleGroups, setMuscleGroups] = useState(props.muscleGroups);

    // Fetching exercises by logged in user could not be done in App.js because user begins as undefined
    // Instead we do it here where user can be passed in as props
    let exercisesByUserArr = [];
    const [exercisesByUser, setExercisesByUser] = useState([]);

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

    return (
        <div className="container">
            <div className="row mb-5">
                <AddExercise muscleGroups={muscleGroups} />
                <ManageExercisesList exercisesByUser={exercisesByUser} liftState={setExercisesByUser} />
            </div>
        </div>
    )
}

export default Exercises;