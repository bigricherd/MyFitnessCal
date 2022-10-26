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
    Alert
} from '@mui/material';
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import editSession from '../../hooks/editSession';
import { useEffect, useState } from 'react';

function EditSessionPopup(props) {

    const {
        handleChange,
        handleKeyDown,
        values,
        setValues,
        handleSubmit,
        error,
        prevError,
        edited
    } = editSession({
        initialValues: {
            sessionId: props.session.id || '',
            title: props.session.title || '',
            comments: props.session.comments || '',
            date: props.session.date || '',
            startdatetime: props.session.start || '',
            enddatetime: props.session.end || ''
        }
    });

    const handleKeySubmit = (event) => {
        if (handleKeyDown(event)) {
            props.setOpen(false);
        }
    };

    // Without this, the comments field does not pre-fill. Still not sure why.
    useEffect(() => {
        setValues({
            ...values,
            'comments': props.session.comments
        })
    }, [props]);

    useEffect(() => {
        props.liftState(edited);
    }, [edited]);

    // Setup to show feedback messages -- error
    const [showError, setShowError] = useState(false);
    const [attempted, setAttempted] = useState(false);

    const handleCloseError = () => {
        setShowError(false);
    }

    useEffect(() => {
        if (error) {
            setAttempted(true);
            props.setOpen(true); //FIX temporary for backend validation testing.
            setShowError(true);
            setTimeout(() => {
                setShowError(false);
            }, 4000)
        }
    }, [error, prevError]);

    return (
        <>
            <Dialog open={props.open} onClose={props.handleClose}>
                <DialogTitle>
                    Edit session {props.session.title}?
                </DialogTitle>
                <DialogContent>
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
                                    onKeyDown={(e) => {
                                        handleKeySubmit(e);
                                    }}
                                    error={attempted && (!values.title || values.title === "")}
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
                    {error && showError && <Alert severity="error" onClose={handleCloseError}>{error}</Alert>}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => {
                        props.setOpen(false);
                    }}>Back</Button>
                    <Button
                        onClick={(e) => {
                            if (handleSubmit(e)) {
                                props.setOpen(false);
                            }
                        }}
                        variant="contained"
                        sx={{ backgroundColor: "green" }}
                    >
                        Save changes
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default EditSessionPopup;