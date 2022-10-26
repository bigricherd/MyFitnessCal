import React, { useState, useEffect } from "react";
import addExercise from "../../hooks/exercises/addExercise";
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

// TODO store muscle Groups array here

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
        },
        muscleGroups: props.muscleGroups
    });

    // Update state when props changes, i.e., when muscleGroups in Forms.jsx changes
    useEffect(() => {
        setMuscleGroups(props.muscleGroups);
    }, [props]);

    // Update state in parent (ExercisesPage.jsx) when an exercise is added, i.e. setExercisesByUser(exercisesPostAdd)
    useEffect(() => {
        if (exercisesPostAdd && exercisesPostAdd.length > 0) {
            console.log("going to lift state");
            props.liftState(exercisesPostAdd);
        }
    }, [exercisesPostAdd]);

    // Setup to show feedback messages -- success
    const [showSuccessMsg, setShowSuccessMsg] = useState(false);

    const handleCloseSuccessMsg = () => {
        setShowSuccessMsg(false);
    }

    useEffect(() => {
        if (successMsg) {
            setShowSuccessMsg(true);
            setAttempted(false);
            setTimeout(() => {
                setShowSuccessMsg(false);
            }, 4000)
        }
    }, [successMsg, prevSuccessMsg]);

    // Setup to show feedback messages -- error
    const [showError, setShowError] = useState(false);
    const [attempted, setAttempted] = useState(false);

    const handleCloseError = () => {
        setShowError(false);
    }

    useEffect(() => {
        if (error) {
            setAttempted(true);
            setShowError(true);
            setShowSuccessMsg(false);
            setTimeout(() => {
                setShowError(false);
            }, 4000)
        }
    }, [error, prevError]);

    return (
        <Grid item xs={10} sm={8}>
            <Box onSubmit={handleSubmit} component="form" noValidate>

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
                                error={attempted && (!values.exercise || values.exercise === "")}
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
                                error={attempted && (!values.muscleGroup || values.muscleGroup === "")}
                            />
                        </FormControl>
                    </Stack>

                    {/* Submit button */}
                    <Button className="mb-3"
                        onClick={handleSubmit}
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
