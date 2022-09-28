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
} from '@mui/material';
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import addSession from './../../hooks/addSession';
import SetRow from './SetRow';

function AddSession(props) {

    const [sets, setSets] = useState([]);

    let setsTemp = sets.slice();

    const addSet = () => {
        const emptySet = {
            'reps': 0,
            'weight': 0,
            exercise: ''
        }

        if (sets.length === 0) {
            setSets([emptySet]);
            values.sets = [emptySet];
        } else {
            setsTemp.push(emptySet);
            setSets(setsTemp);
            values.sets = setsTemp;
        }
    }

    const removeSet = (i) => {
        setsTemp = [...setsTemp.slice(0, i), ...setsTemp.slice(i + 1)];
        setSets(setsTemp);
        values.sets = setsTemp;
    }

    const resetFormFields = () => {
        setValues({
            title: '',
            comments: '',
            date: '',
            startdatetime: '',
            enddatetime: '',
            sets: sets
        });
        setSets([]);
    }

    const { handleChange, handleSetChange, handleKeyDown, values, setValues, handleSubmit, error, prevError, numSessions } = addSession({
        initialValues: {
            title: '',
            comments: '',
            date: '',
            startdatetime: '',
            enddatetime: '',
            sets: sets
        }
    });

    useEffect(() => {
        props.liftState(numSessions);
    }, [numSessions])

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
                <Grid container spacing={2} onSubmit={handleSubmit} component="form" noValidate sx={{
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
                        </Grid>

                        {/* Start time */}
                        <Grid item xs={6}>
                            <FormControl fullWidth>
                                <TimePicker
                                    label="Start time"
                                    value={values.startdatetime}
                                    onChange={(newValue) => {
                                        let event = {
                                            target: {
                                                value: newValue,
                                                name: "startdatetime",
                                            },
                                        };
                                        handleChange(event);
                                    }}
                                    renderInput={(params) => <TextField {...params} />}
                                >

                                </TimePicker>
                            </FormControl>
                        </Grid>

                        {/* End time */}
                        <Grid item xs={6}>
                            <FormControl fullWidth>
                                <TimePicker
                                    label="End time"
                                    value={values.enddatetime}
                                    onChange={(newValue) => {
                                        let event = {
                                            target: {
                                                value: newValue,
                                                name: "enddatetime",
                                            },
                                        };
                                        handleChange(event);
                                    }}
                                    renderInput={(params) => <TextField {...params} />}
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
                                required
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

                        {/* on click: add a new form row  */}
                        <Button
                            type="submit"
                            onClick={addSet}
                            variant="contained"
                        >
                            Add set
                        </Button>
                    </Grid>

                    <Grid item xs={12}>
                        {sets.map((set, i) => (
                            <Grid item xs={12} key={i}>
                                <SetRow set={set} index={i} value={values.sets[i]} handleChange={handleSetChange} onDelete={removeSet} exercises={props.exercises} />
                            </Grid>
                        ))}
                    </Grid>

                </Grid>


            </DialogContent>
            <DialogActions>
                <Button onClick={props.onClose}>Back</Button>

                {/* handle submit add session on click */}
                <Button
                    type="submit"
                    onClick={(e) => {
                        handleSubmit(e);
                        props.onClose();
                        resetFormFields();
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