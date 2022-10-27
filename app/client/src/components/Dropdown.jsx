import React, { useState, useEffect } from "react";
import { MenuItem, Tooltip, TextField, Typography } from "@mui/material";
import formatExercise from '../helpers/formatExercise';

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
    } else if (props.id === "timezone") {
        optionsArr.push(
            <MenuItem value="" key="0" selected>
                Select a time zone
            </MenuItem>
        );
        //dropdownLabel = "Timezone";
    }

    // Add options from props to array
    for (let option of options) {
        optionsArr.push(
            <MenuItem value={option} key={option}>
                {formatExercise(option.split(':')[0])}
            </MenuItem>
        );
    }

    useEffect(() => {
        setOptions(props.options);
    }, [props]);

    if (props.tooltip) {
        return (
            <Tooltip
                title={<Typography>{props.tooltip}</Typography>}
            >
                <TextField select
                    rules={{ required: true }}
                    name={props.name}
                    id={props.id}
                    value={props.value}
                    label={dropdownLabel}
                    onChange={props.onChange}
                    onKeyDown={props.onKeyDown}
                    error={props.error}
                    // sx={{ display: "block" }}
                    required
                    fullWidth
                >
                    {optionsArr}
                </TextField>
            </Tooltip>
        )

    } else return (
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
                error={props.error}
                required
                fullWidth
            >
                {optionsArr}
            </TextField>
        </>
    );
}

export default Dropdown;
