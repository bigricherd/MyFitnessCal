import React, { useEffect, useState } from "react";
import useForm from "../../hooks/useForm";
import Dropdown from "../Dropdown";
import {
    Typography,
    Container,
    Box,
    Button,
    TextField,
    FormControl,
    Stack,
    Alert
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

function AddSet(props) {
    const [exercises, setExercises] = useState(props.exercises); // TODO: update exercises when a new one is added by AddExercise
    const [exercisesByUser, setExercisesByUser] = useState(
        props.exercisesByUser
    );
    const [showByUserOnly, setShowByUserOnly] = useState(false);

    // Update state every time props changes, i.e., when exercises in Forms.jsx changes
    useEffect(() => {
        setExercises(props.exercises);
        setExercisesByUser(props.exercisesByUser);
    }, [props]);

    const { values, handleChange, handleKeyDown, handleSubmit, successMsg } =
        useForm({
            initialValues: {
                reps: 0,
                weight: 0,
                date: null,
                exercise: "",
                muscleGroup: "",
            },
            slug: "api/sets/add",
        });

    const customHandleSubmit = (e) => {
        handleSubmit(e);
        console.log(e.target);

        // This loop clears all input fields but skips the last element in the array because it is the submit button.
        for (let i = 0; i < e.target.length - 1; i++) {
            const inputField = e.target[i];
            inputField.value = "";
            console.log(inputField);
        }

        // TODO: START HERE FOR DUPLICATING LAST SET -- with a button like "anotha one" or something like that
        // tempValues = {
        //     reps: values.reps,
        //     weight: values.weight,
        //     date: values.date,
        //     exercise: values.exercise,
        // }

        // Clear values fields. Without this, input fields will clear on submit but revert to previous contents on next change
        // values.reps = '';
        // values.weight = '';
        // values.date = '';
        // values.exercise = '';
    };

    const toggleShownExercises = () => {
        setShowByUserOnly(!showByUserOnly);
    };

    return (
        <Container>
            <Typography variant="h2" gutterBottom component="div">
                Add Set
            </Typography>
            <Box component="form" autoComplete="on">
                <Button
                    type="button"
                    variant="contained"
                    color="primary"
                    onClick={toggleShownExercises}
                >
                    {showByUserOnly
                        ? "Show all exercises"
                        : "Show my exercises"}
                </Button>

                {/** We give the user the option to view all exercises in the database or only the ones that they added*/}
                {showByUserOnly ? (
                    <Dropdown
                        name="exercise"
                        id="exercise"
                        options={exercisesByUser}
                        value={values.exercise}
                        onChange={handleChange}
                        onKeyDown={handleKeyDown}
                    />
                ) : (
                    <Dropdown
                        name="exercise"
                        id="exercise"
                        options={exercises}
                        value={values.exercise}
                        onChange={handleChange}
                        onKeyDown={handleKeyDown}
                    />
                )}

                {/* see AddExercise.jsx line 74 for a note on this input */}
                {/* <input
                    type="text"
                    className="form-control d-none"
                    placeholder=""
                    id="exercise"
                    name="exercise"
                    value={values.exercise}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    required
                /> */}
                <Stack spacing={2}>
                    <FormControl>
                        <TextField
                            id="reps"
                            name="reps"
                            label="Reps"
                            type="number"
                            value={values.reps}
                            onChange={handleChange}
                            onKeyDown={handleKeyDown}
                            required
                        />
                    </FormControl>
                    <FormControl>
                        <TextField
                            id="weight"
                            name="weight"
                            label="Weight (lb)"
                            type="number"
                            value={values.weight}
                            onChange={handleChange}
                            onKeyDown={handleKeyDown}
                            required
                        />
                    </FormControl>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <FormControl>
                            <DatePicker
                                id="date"
                                views={["day"]}
                                label="Date"
                                value={values.date}
                                onChange={(newValue) => {
                                    let event = {
                                        target: {
                                            value: newValue,
                                            name: "date",
                                        },
                                    };
                                    handleChange(event);
                                }}
                                renderInput={(params) => (
                                    <TextField {...params} />
                                )}
                                onKeyDown={handleKeyDown}
                                required
                            />
                        </FormControl>
                    </LocalizationProvider>
                </Stack>
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    onClick={handleSubmit}
                >
                    Add Set
                </Button>
                {successMsg && <Alert severity="success">{successMsg}</Alert>}
            </Box>
        </Container>
    );
}

export default AddSet;
