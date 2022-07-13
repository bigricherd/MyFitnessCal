import React, { useState, useEffect } from "react";
import useForm from "../../hooks/useForm";
import Dropdown from "../Dropdown";
import Message from "../Message";
import {
    Button,
    FormLabel,
    FormControl,
    Grid,
    TextField,
    Box,
} from "@mui/material";
import formatEnum from "../../helpers/formatEnum";

function AddExercise(props) {
    const [muscleGroups, setMuscleGroups] = useState(props.muscleGroups);

    const {
        values,
        handleChange,
        handleKeyDown,
        handleSubmit,
        successMsg,
        exercisesPostAdd,
    } = useForm({
        initialValues: {
            exercise: "",
            muscleGroup: "",
        },
        slug: "api/exercises/add",
    });

    // Update state every time props changes, i.e., when muscleGroups in Forms.jsx changes
    useEffect(() => {
        setMuscleGroups(props.muscleGroups);
    }, [props]);

    // Update state in parent (Forms.jsx) when an exercise is added, i.e. setExercisesByUser(exercisesPostAdd)
    useEffect(() => {
        if (exercisesPostAdd && exercisesPostAdd.length > 0) {
            console.log("going to lift state");
            props.liftState(formatEnum(exercisesPostAdd));
        }
    }, [exercisesPostAdd]);

    const customHandleSubmit = (e) => {
        handleSubmit(e);
        console.log(e.target);

        // This loop clears all input fields but skips the last element in the array because it is the submit button.
        for (let i = 0; i < e.target.length - 1; i++) {
            const inputField = e.target[i];
            inputField.value = "";
            console.log(inputField);
        }

        // Clear values fields. Without this, input fields will clear on submit but revert to previous contents on next change
        values.muscleGroup = "";
        values.exercise = "";
    };

    return (
        <Grid item xs={10} sm={8}>
            <Box onSubmit={customHandleSubmit} component="form" noValidate>
                <h1>Add Exercise</h1>
                <FormControl required fullWidth>
                    <FormLabel>Name</FormLabel>
                    <TextField
                        name="exercise"
                        id="exercise"
                        value={values.exercise}
                        onChange={handleChange}
                        onKeyDown={handleKeyDown}
                    ></TextField>
                </FormControl>

                <FormControl required fullWidth>
                    {/* <FormLabel>Muscle Group</FormLabel> */}
                    <Dropdown
                        name="muscleGroup"
                        id="muscleGroup"
                        options={muscleGroups}
                        value={values.muscleGroup}
                        onChange={handleChange}
                        onKeyDown={handleKeyDown}
                    />
                </FormControl>

                <Button className="mb-3"
                    onClick={customHandleSubmit}
                    type="submit"
                    color="primary"
                    variant="contained"
                > Add exercise
                </Button>
            </Box>
            {successMsg && <Message success={successMsg} />}
        </Grid>
    );
}

export default AddExercise;
