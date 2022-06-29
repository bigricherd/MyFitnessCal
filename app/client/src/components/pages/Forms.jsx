import React, { useState, useEffect } from 'react';
import AddSet from '../forms/AddSet';
import AddExercise from '../forms/AddExercise';
import formatEnum from '../../helpers/formatEnum';
import { Link } from 'react-router-dom';

// ------ A forms page with a button group to select which form to view: AddSet or AddExercise ------
function Forms(props) {

    const [user, setUser] = useState(null);
    const [showAddSet, setShowAddSet] = useState(true);

    // We can get rid of these two arrays by calling setMuscleGroups(formatEnum(json.muscleGroups)) in start() below
    let exercisesArr = [];
    let muscleGroupsArr = [];
    const [muscleGroups, setMuscleGroups] = useState([]);
    const [exercises, setExercises] = useState([]);

    const start = async () => {
        const baseUrl = 'http://localhost:5000';
        const data = await fetch(`${baseUrl}/api/enums`);
        const json = await data.json();
        exercisesArr = formatEnum(json.exercises);
        muscleGroupsArr = formatEnum(json.muscleGroups);
        setMuscleGroups(muscleGroupsArr);
        setExercises(exercisesArr);
        console.log(muscleGroupsArr);
    }

    useEffect(() => {
        start();
        setUser(props.user);
    }, [props])

    const addSet = <AddSet exercises={exercises} />;
    const addExercise = <AddExercise muscleGroups={muscleGroups} />;

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