import React, { useState, useEffect } from "react";
import useForm from "../../hooks/useForm";
import Dropdown from "../Dropdown";
import {
    Button,
    FormLabel,
    FormControl,
    Grid,
    TextField,
    Box,
    Alert
} from "@mui/material";
import formatEnum from "../../helpers/formatEnum";

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

    // User feedback -- success and error
    const [showSuccessMsg, setShowSuccessMsg] = useState(false);

    const handleCloseSuccessMsg = () => {
        setShowSuccessMsg(false);
    }

    useEffect(() => {
        if (successMsg) setShowSuccessMsg(true);
    }, [successMsg, prevSuccessMsg]);

    const [showError, setShowError] = useState(false);

    const handleCloseError = () => {
        setShowError(false);
    }

    useEffect(() => {
        if (error) setShowError(true);
    }, [error, prevError]);

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
            {successMsg && showSuccessMsg && <Alert severity="success" onClose={handleCloseSuccessMsg}>{successMsg}</Alert>}
            {error && showError && <Alert severity="error" onClose={handleCloseError}>{error}</Alert>}
        </Grid>
    );
}

export default AddExercise;
