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
    TableContainer,
    Table,
    TableBody,
    Alert,
    Tooltip
} from '@mui/material';
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import addSession from '../../hooks/sessions/addSession';
import AddSetsCollapse from './sets/AddSetsCollapse';

function AddSession(props) {
    const [exercises, setExercises] = useState([]);

    let exercisesTemp = exercises.slice();

    const addExercise = () => {
        const emptyExercise = {
            name: '',
            sets: []
        };
        // Make sure there are no empty exercises before adding a new one
        for (let exercise of exercises) {
            if (exercise.name === "") return;
        }
        // Add exercise
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
        const allSets = [];
        for (let exercise of exercises) {
            allSets.push(...exercise.sets);
        }
        values.sets = allSets;
        if (handleSubmit(event)) {
            props.onClose();
            resetFormFields();
        }
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

    const handleKeySubmit = (event) => {
        if (handleKeyDown(event)) {
            props.onClose();
        }
    };

    useEffect(() => {
        props.liftState(numSessions);
        setAttempted(false); // not necessary because popup closes on successful CREATE Session
    }, [numSessions]);

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
            props.setShow(true);
            setTimeout(() => {
                setShowError(false);
            }, 4000)
        }
    }, [error, prevError]);

    return (
        < Dialog
            open={props.open}
            onClose={props.onClose}
            fullScreen
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
                                onKeyDown={(e) => {
                                    handleKeySubmit(e);
                                }}
                                error={attempted && (!values.title || values.title === "")}
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
                                            error={attempted && (!values.date || values.date === "")}
                                            onKeyDown={(e) => {
                                                handleKeySubmit(e);
                                            }}
                                            required
                                        />
                                    )}

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
                                    renderInput={(params) => <TextField {...params}
                                        error={attempted && (!values.startdatetime || values.startdatetime === "")}
                                        onKeyDown={(e) => {
                                            handleKeySubmit(e);
                                        }}
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
                                    renderInput={(params) => <TextField {...params}
                                        error={attempted && (!values.enddatetime || values.enddatetime === "")}
                                        onKeyDown={(e) => {
                                            handleKeySubmit(e);
                                        }}
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
                                onKeyDown={(e) => {
                                    handleKeySubmit(e);
                                }}
                            >
                            </TextField>
                        </FormControl>
                    </Grid>

                </Grid>

                {/* Feedback messages */}
                {error && showError && <Alert severity="error" onClose={handleCloseError} sx={{ mb: "1rem" }}>{error}</Alert>}

                <Grid container>

                    {/* "Sets" heading */}
                    <Grid item xs={3}>
                        <Typography variant="h5">Sets</Typography>
                    </Grid>

                    {/* "Add Exercise" button */}
                    <Grid item xs={6}>

                        {/* Add a new collapse containing SetRows (AddSetsCollapse)  */}
                        <Button
                            onClick={addExercise}
                            variant="outlined"
                            sx={{ borderWidth: "2px" }}
                        >
                            Add exercise
                        </Button>
                    </Grid>

                    {/* Table containing an array of AddSetsCollapses */}
                    <Grid item xs={12}>
                        <TableContainer
                        // TODO this is a desktop style; needs to actually be limited on mobile
                        // sx={{
                        //     maxWidth: "80%",
                        //     margin: "auto"
                        // }}
                        >
                            <Table>
                                <TableBody>
                                    {exercises.map((exercise, index) => (
                                        <AddSetsCollapse
                                            key={index}
                                            exerciseOptions={props.exercisesByUser}
                                            index={index}
                                            exercise={exercise}
                                            exercises={exercises}
                                            setExercises={setExercises}
                                            onChange={handleExerciseChange}
                                            onDelete={removeExercise}
                                            attempted={attempted}
                                        />
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Grid>

                </Grid>
            </DialogContent>

            <DialogActions>
                <Button onClick={props.onClose}>Back</Button>

                {/* handle submit add session on click */}
                <Button
                    type="submit"
                    onClick={customHandleSubmit}
                    variant="outlined"
                    color="success"
                    sx={{ borderWidth: "2px" }}
                >
                    Create Session
                </Button>
            </DialogActions>
        </Dialog >
    )
}

export default AddSession;