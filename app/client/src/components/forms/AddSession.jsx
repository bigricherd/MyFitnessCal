import { useState, useEffect } from 'react';
import {
    Box,
    Grid,
    Typography,
    TextField,
    FormControl,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Table,
    TableBody,
    Alert
} from '@mui/material';
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import addSession from './../../hooks/addSession';
//import SetRow from './SetRow';
import AddSetsCollapse from './AddSetsCollapse';

function AddSession(props) {
    const [exercises, setExercises] = useState([]);

    let exercisesTemp = exercises.slice();

    const addExercise = () => {
        const emptyExercise = {
            name: '',
            sets: []
        };
        if (exercises.length === 0) {
            setExercises([emptyExercise]);
        } else {
            exercisesTemp.push(emptyExercise);
            setExercises(exercisesTemp);
        }
    }

    const removeExercise = (i) => {
        exercisesTemp = [...exercisesTemp.slice(0, i), ...exercisesTemp.slice(i + 1)];
        setExercises(exercisesTemp);
    }

    const handleExerciseChange = (event) => {
        let exists = false;
        for (let exercise of exercises) {
            console.log(exercise);
            if (exercise.name === event.target.value) {
                exists = true;
                break;
            }
        }

        // Only change the value if the exercise has not already been selected
        if (!exists) {
            const index = event.target.name.split("_")[1];
            exercisesTemp[index]['name'] = event.target.value;
        }

        setExercises(exercisesTemp);
    }

    const resetFormFields = () => {
        setValues({
            title: '',
            comments: '',
            date: '',
            startdatetime: '',
            enddatetime: '',
            sets: []
        });
        setExercises([]);
    }

    // Assign state variable 'exercises' to values.sets array
    const customHandleSubmit = (event) => {
        console.log(event.target.form);
        const allSets = [];
        for (let exercise of exercises) {
            allSets.push(...exercise.sets);
        }
        values.sets = allSets;
        handleSubmit(event);
    }

    // Add Session hook
    const { handleChange, handleKeyDown, values, setValues, handleSubmit, error, prevError, numSessions } = addSession({
        initialValues: {
            title: '',
            comments: '',
            date: '',
            startdatetime: '',
            enddatetime: '',
            sets: []
        }
    });

    useEffect(() => {
        props.liftState(numSessions);
    }, [numSessions]);

    // Setup to show feedback messages -- error
    const [showError, setShowError] = useState(false);

    const handleCloseError = () => {
        setShowError(false);
    }

    useEffect(() => {
        if (error) setShowError(true);
    }, [error, prevError]);

    return (
        <Dialog
            open={props.open}
            onClose={props.onClose}
        >
            <DialogTitle>
                Add a new session
            </DialogTitle>
            <DialogContent>

                {/* Add session form; consider creating a separate component */}
                <Grid container spacing={2} onSubmit={customHandleSubmit} component="form" noValidate={true} sx={{
                    "marginBottom": "1.5rem"
                }}>

                    {/* Title */}
                    <Grid item xs={7}>
                        <FormControl fullWidth>
                            <TextField
                                name="title"
                                label="Title"
                                type="text"
                                value={values.title}
                                onChange={handleChange}
                                onKeyDown={handleKeyDown}
                                // error={values.title === ""}
                                required
                            />
                        </FormControl>
                    </Grid>

                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        {/* Date */}
                        <Grid item xs={5}>
                            <FormControl>
                                <DatePicker
                                    id="date"
                                    views={["day"]}
                                    label="Date"
                                    value={values.date || null}
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
                                        <TextField {...params}
                                            required
                                        />
                                    )}
                                    onKeyDown={handleKeyDown}

                                />
                            </FormControl>
                        </Grid>

                        {/* Start time */}
                        <Grid item xs={6}>
                            <FormControl fullWidth>
                                <TimePicker
                                    label="Start time"
                                    value={values.startdatetime || null}
                                    onChange={(newValue) => {
                                        let event = {
                                            target: {
                                                value: newValue,
                                                name: "startdatetime",
                                            },
                                        };
                                        handleChange(event);
                                    }}
                                    onKeyDown={handleKeyDown}
                                    renderInput={(params) => <TextField {...params}
                                        required
                                    />}
                                >

                                </TimePicker>
                            </FormControl>
                        </Grid>

                        {/* End time */}
                        <Grid item xs={6}>
                            <FormControl fullWidth>
                                <TimePicker
                                    label="End time"
                                    value={values.enddatetime || null}
                                    onChange={(newValue) => {
                                        let event = {
                                            target: {
                                                value: newValue,
                                                name: "enddatetime",
                                            },
                                        };
                                        handleChange(event);
                                    }}
                                    onKeyDown={handleKeyDown}
                                    renderInput={(params) => <TextField {...params}
                                        required
                                    />}
                                >

                                </TimePicker>
                            </FormControl>
                        </Grid>

                    </LocalizationProvider>

                    {/* Comments */}
                    <Grid item xs={6}>
                        <FormControl fullWidth>
                            <TextField
                                name="comments"
                                label="Comments"
                                type="text"
                                value={values.comments}
                                onChange={handleChange}
                                onKeyDown={handleKeyDown}
                            >
                            </TextField>
                        </FormControl>
                    </Grid>

                </Grid>

                <Grid container>

                    <Grid item xs={3}>

                        <Typography variant="h5">Sets</Typography>
                    </Grid>

                    <Grid item xs={6}>

                        {/* Add a new collapse containing SetRows (AddSetsCollapse)  */}
                        <Button
                            onClick={addExercise}
                            variant="contained"
                        >
                            Add exercise
                        </Button>
                    </Grid>

                    <Grid item xs={12}>
                        <Table>
                            <TableBody>
                                {exercises.map((exercise, index) => (
                                    <AddSetsCollapse
                                        key={index}
                                        exerciseOptions={props.exercises}
                                        index={index}
                                        exercise={exercise}
                                        exercises={exercises}
                                        setExercises={setExercises}
                                        onChange={handleExerciseChange}
                                        onDelete={removeExercise} />
                                ))}
                            </TableBody>
                        </Table>
                    </Grid>

                </Grid>

                {/* Feedback messages */}
                {error && showError && <Alert severity="error" onClose={handleCloseError}>{error}</Alert>}
            </DialogContent>

            <DialogActions>
                <Button onClick={props.onClose}>Back</Button>

                {/* handle submit add session on click */}
                <Button
                    type="submit"
                    onClick={(e) => {
                        customHandleSubmit(e);
                        //props.onClose();
                        //resetFormFields();
                    }}
                    variant="contained"
                    color="success"
                    sx={{ color: 'white' }}
                >
                    Create Session
                </Button>
            </DialogActions>
        </Dialog >
    )
}

export default AddSession;