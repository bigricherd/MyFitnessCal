import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import MuscleGroupFilter from '../forms/MuscleGroupFilter';

function Filters(props) {
    const [user, setUser] = useState(props.user);
    const [muscleGroups, setMuscleGroups] = useState(props.muscleGroups);

    // Update state every time props.user is updated
    useEffect(() => {
        setUser(props.user);
        setMuscleGroups(props.muscleGroups);
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