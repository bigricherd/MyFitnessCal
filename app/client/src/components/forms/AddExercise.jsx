import React, { useState, useEffect } from "react";
import addExercise from "../../hooks/addExercise";
import Dropdown from "../Dropdown";
import {
    Typography,
    Button,
    FormLabel,
    FormControl,
    Grid,
    TextField,
    Box,
    Alert,
    Stack
} from "@mui/material";

function AddExercise(props) {
    const [muscleGroups, setMuscleGroups] = useState(props.muscleGroups);

    let {
        values,
        handleChange,
        handleKeyDown,
        handleSubmit,
        successMsg,
        prevSuccessMsg,
        exercisesPostAdd,
        error,
        prevError
    } = addExercise({
        initialValues: {
            exercise: "",
            muscleGroup: "",
        }
    });

    // Update state when props changes, i.e., when muscleGroups in Forms.jsx changes
    useEffect(() => {
        setMuscleGroups(props.muscleGroups);
    }, [props]);

    // Update state in parent (Forms.jsx) when an exercise is added, i.e. setExercisesByUser(exercisesPostAdd)
    useEffect(() => {
        if (exercisesPostAdd && exercisesPostAdd.length > 0) {
            console.log("going to lift state");
            props.liftState(exercisesPostAdd);
        }
    }, [exercisesPostAdd]);

    // Add exercise handler
    const customHandleSubmit = (e) => {
        handleSubmit(e);

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

    // Setup to show feedback messages -- success
    const [showSuccessMsg, setShowSuccessMsg] = useState(false);

    const handleCloseSuccessMsg = () => {
        setShowSuccessMsg(false);
    }

    useEffect(() => {
        if (successMsg) setShowSuccessMsg(true);
    }, [successMsg, prevSuccessMsg]);

    // Setup to show feedback messages -- error
    const [showError, setShowError] = useState(false);

    const handleCloseError = () => {
        setShowError(false);
    }

    useEffect(() => {
        if (error) {
            setShowError(true);
            setShowSuccessMsg(false);
        }
    }, [error, prevError]);

    return (
        <Grid item xs={10} sm={8}>
            <Box onSubmit={customHandleSubmit} component="form" noValidate>

                <Stack
                    justifyContent="center"
                    alignItems="center"
                    spacing={2}
                >

                    {/* Heading */}
                    <Typography
                        variant="h5"
                        sx={{ marginTop: '8%' }}
                    >
                        Add Exercise
                    </Typography>

                    <Stack spacing={2}>
                        {/* Exercise name input */}
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

                        {/* Muscle group dropdown */}
                        <FormControl required fullWidth>
                            <Dropdown
                                name="muscleGroup"
                                id="muscleGroup"
                                options={muscleGroups}
                                value={values.muscleGroup}
                                onChange={handleChange}
                                onKeyDown={handleKeyDown}
                            />
                        </FormControl>
                    </Stack>

                    {/* Submit button */}
                    <Button className="mb-3"
                        onClick={customHandleSubmit}
                        type="submit"
                        color="primary"
                        variant="contained"
                    > Add
                    </Button>


                </Stack>
            </Box>

            {/* Feedback messages */}
            {successMsg && showSuccessMsg && <Alert severity="success" onClose={handleCloseSuccessMsg}>{successMsg}</Alert>}
            {error && showError && <Alert severity="error" onClose={handleCloseError}>{error}</Alert>}
        </Grid>
    );
}

export default AddExercise;
