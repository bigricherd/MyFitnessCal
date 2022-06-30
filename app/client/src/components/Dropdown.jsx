import React, { useState, useEffect } from 'react';

// Returns a <select> element to be used in a form as a dropdown
// Used in AddExercise, MuscleGroupFilter to show muscleGroups
// Used in AddSet to show Exercises
function Dropdown(props) {
    const [options, setOptions] = useState(props.options);

    let optionsArr = [];

    // Add a dummy option so that the user is forced to interact with the dropdown.
    // Assign the label to the dummy option depending on which enum will be shown.
    if (props.id === 'muscleGroup') {
        optionsArr.push(<option value="" key="0">Select a muscle group</option>);
    } else if (props.id === 'exercise') {
        optionsArr.push(<option value="" key="0">Select an exercise</option>);
    }

    for (let option of options) {
        optionsArr.push(<option value={option} key={option}>{option}</option>)
    }

    useEffect(() => {
        setOptions(props.options);
    }, [props])
    //console.log(options);

    return (
        <select className="btn btn-light dropdown-toggle" name={props.name} id={props.id} value={props.value} onChange={props.onChange} onKeyDown={props.onKeyDown} required>
            {optionsArr}
        </select>
    )
}

export default Dropdown