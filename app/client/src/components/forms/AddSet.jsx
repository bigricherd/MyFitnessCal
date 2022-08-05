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
    const [exercises, setExercises] = useState(props.exercises);
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

        // --- We currently do not clear fields to make it easy to test logging multiple sets --- 
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

            {/* Heading */}
            <Typography variant="h2" gutterBottom component="div">
                Add Set
            </Typography>

            <Box component="form" autoComplete="on">

                {/** Button that gives the user the option to view all exercises in the database or only the ones that they added*/}
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

                {/* Exercise dropdown */}
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

                {/* All other form fields except Exercise, which is above */}
                <Stack spacing={2}>

                    {/* Reps input */}
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

                    {/* Weight input */}
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

                    {/* Date input */}
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

                {/* Submit button */}
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    onClick={handleSubmit}
                >
                    Add Set
                </Button>

                {/* Feedback message -- success */}
                {successMsg && <Alert severity="success">{successMsg}</Alert>}
            </Box>
        </Container>
    );
}

export default AddSet;
