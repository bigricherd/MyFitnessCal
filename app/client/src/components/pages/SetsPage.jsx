import React, { useState, useEffect, useCallback } from 'react';
import AddSet from '../forms/AddSet';
import { Link } from 'react-router-dom';
import axios from 'axios';

// ------ A page to test the AddSet form, which will be integrated into the Add Session form (and possibly also when viewing an existing Session) ------
function SetsPage(props) {

    const [user, setUser] = useState(props.user);
    const [userId, setUserId] = useState(props.userId);

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
        exercisesByUserArr = userExercises.data.exercisesByUser;
        setExercisesByUser(exercisesByUserArr);
    }, [url])

    // --- FETCH EXERCISES ---
    const exercisesUrl = `${baseUrl}/api/enums`;
    let exercisesArr = [];
    const [exercises, setExercises] = useState([]);

    const fetchExercises = useCallback(async () => {
        const data = await fetch(exercisesUrl);
        const json = await data.json();
        exercisesArr = json.exercises;
        setExercises(exercisesArr);
    }, [exercisesUrl]);

    useEffect(() => {
        setUser(props.user);
        setUserId(props.userId);
        fetchExercisesByUser();
        fetchExercises();
    }, [props, fetchExercisesByUser, fetchExercises])

    // If there is no logged in user, show the prompt with links to Login and Register pages
    if (!user) {
        return (
            <div>
                <p><Link to={'/register'} className="text-decoration-none">Register</Link> or <Link to={'/login'} className="text-decoration-none">Login</Link> first</p>
            </div>
        )
    }
    else return (
        <AddSet exercises={exercises} exercisesByUser={exercisesByUser} />
    )
}

export default SetsPage;