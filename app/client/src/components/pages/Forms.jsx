import React, { useState, useEffect, useCallback } from 'react';
import AddSet from '../forms/AddSet';
import AddExercise from '../forms/AddExercise';
import formatEnum from '../../helpers/formatEnum';
import { Link } from 'react-router-dom';
import axios from 'axios';

// ------ A forms page with a button group to select which form to view: AddSet or AddExercise ------
function Forms(props) {

    const [showAddSet, setShowAddSet] = useState(true);

    const [user, setUser] = useState(props.user);
    const [userId, setUserId] = useState(props.userId);
    const [muscleGroups, setMuscleGroups] = useState(props.muscleGroups);
    const [exercises, setExercises] = useState(props.exercises);

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
        setExercises(props.exercises);
        setMuscleGroups(props.muscleGroups);
        fetchExercisesByUser();
    }, [props, fetchExercisesByUser])

    const addSet = <AddSet exercises={exercises} exercisesByUser={exercisesByUser} />;
    const addExercise = <AddExercise muscleGroups={muscleGroups} exercisesByUser={exercisesByUser} liftState={setExercisesByUser} />;

    // If there is no logged in user, show the prompt with links to Login and Register pages
    if (!user) {
        return (
            <div>
                <p><Link to={'/register'} className="text-decoration-none">Register</Link> or <Link to={'/login'} className="text-decoration-none">Login</Link> first</p>
            </div>
        )
    }

    // Show the user the AddSet or AddExercise form, depending on which button they select
    else return (
        <div className="mt-5 pt-5">
            <div className="btn-group mb-3" role="group" aria-label="Toggle between two components">
                <input type="radio" className="btn-check" name="btnradio" id="pending" checked={showAddSet} onChange={() => setShowAddSet(true)}></input>
                <label className="btn btn-outline-light" htmlFor="pending">Add Set</label>

                <input type="radio" className="btn-check" name="btnradio" id="completed" checked={!showAddSet} onChange={() => setShowAddSet(false)}></input>
                <label className="btn btn-outline-light" htmlFor="completed">Add Exercise</label>
            </div>

            {showAddSet ? addSet : addExercise}
        </div>
    )
}

export default Forms;