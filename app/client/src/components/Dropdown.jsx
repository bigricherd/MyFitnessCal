import React, { useState, useEffect } from "react";
import { Select, MenuItem, InputLabel, Box, Container, TextField } from "@mui/material";

// Returns a <select> element to be used in a form as a dropdown
// Used in AddExercise, MuscleGroupFilter to show muscleGroups
// Used in AddSet to show Exercises
function Dropdown(props) {
    const [options, setOptions] = useState(props.options);

    let optionsArr = [];
    let dropdownLabel = "";

    // Add a dummy option so that the user is forced to interact with the dropdown.
    // Assign the label to the dummy option depending on which enum will be shown.

    if (props.id === "muscleGroup") {
        optionsArr.push(
            <MenuItem value="" key="0" selected>
                Select a muscle group
            </MenuItem>
        );
        dropdownLabel = "Muscle group";
    } else if (props.id === "exercise") {
        optionsArr.push(
            <MenuItem value="" key="0" selected>
                Select an exercise
            </MenuItem>
        );
        dropdownLabel = "Exercise";
    }

    for (let option of options) {
        optionsArr.push(
            <MenuItem value={option} key={option}>
                {option}
            </MenuItem>
        );
    }

    useEffect(() => {
        setOptions(props.options);
    }, [props]);

    return (
        <>
            {/* <InputLabel id="dropdown-label">{dropdownLabel}</InputLabel> */}
            <TextField select
                rules={{ required: true }}
                name={props.name}
                id={props.id}
                value={props.value}
                label={dropdownLabel}
                onChange={props.onChange}
                onKeyDown={props.onKeyDown}
                // sx={{ display: "block" }}
                required
            >
                {optionsArr}
            </TextField>
        </>
    );
}

export default Dropdown;
