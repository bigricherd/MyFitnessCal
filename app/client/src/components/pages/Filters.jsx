import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import MuscleGroupFilter from '../forms/MuscleGroupFilter';
import formatEnum from '../../helpers/formatEnum';

function Filters(props) {
    const [user, setUser] = useState(null);
    let muscleGroupsArr = [];
    const [muscleGroups, setMuscleGroups] = useState([]);

    // Sets muscleGroups after fetching enum from DB.
    // Adds "All" option for user to see an overview of volume for the given date range
    const start = async () => {
        const baseUrl = 'http://localhost:5000';
        const data = await fetch(`${baseUrl}/api/enums`);
        const json = await data.json();
        muscleGroupsArr = formatEnum(json.muscleGroups);
        muscleGroupsArr.unshift('All');
        setMuscleGroups(muscleGroupsArr);
    }

    // Update state every time props.user is updated
    useEffect(() => {
        start();
        setUser(props.user);
    }, [props])

    // If there is no logged in user, show the prompt with links to Login and Register pages
    if (!user) {
        return (
            <div>
                <p><Link to={'/register'} className="text-decoration-none">Register</Link> or <Link to={'/login'} className="text-decoration-none">Login</Link> first</p>
            </div>
        )
    }

    // Show the user a form to assess their volume (# of sets performed) for some date range, filtered by muscle group 
    else return (
        <div>
            <MuscleGroupFilter muscleGroups={muscleGroups} />
        </div>
    )
}

export default Filters;