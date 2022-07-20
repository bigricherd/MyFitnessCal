import React, { useState, useEffect, useCallback } from 'react';
import formatEnum from '../helpers/formatEnum';
import {
    Grid,
    Button,
    Box,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Alert
} from '@mui/material';
import useForm from '../hooks/useDeleteForm'

function ManageExercisesList(props) {

    // Two state variables to store index and event corresponding to 
    const [indexToDelete, setIndexToDelete] = useState(null);
    const [deleteEvent, setDeleteEvent] = useState(null);

    // State variable and handlers for the confirm delete dialog
    const [open, setOpen] = useState(false);
    const handleClickOpen = (e, i) => {
        e.persist();
        setOpen(true);
        setIndexToDelete(i);
        setDeleteEvent(e);
    };
    const handleClose = () => {
        console.log(`Selected exercises was at index ${indexToDelete}, now setting to null`);
        setIndexToDelete(null);
        setDeleteEvent(null);
        setOpen(false);
    }

    // Delete form hook 
    const { values, handleSubmit, error, prevError, successMsg, prevSuccessMsg, exercisesPostDelete } = useForm(
        { exercise: '' }
    )

    const handleConfirmDelete = () => {
        // console.log(`I am supposed to delete exercise at index ${indexToDelete}. Corresponding event below`);
        values.exercise = props.exercisesByUser[indexToDelete];
        handleSubmit(deleteEvent);
        values.exercise = '';
        setOpen(false);
    }

    const liftState = useCallback(() => {
        props.liftState(formatEnum(exercisesPostDelete));
    }, [exercisesPostDelete])

    const [list, setList] = useState(props.exercisesByUser.map((item, index) =>
        <Grid container key={index} className="manageExercisesListItem">
            <Box component={Grid} item xs={9} sm={10} bgcolor={'white'} color={'gray'}>
                {item}
            </Box>

            <Button fullWidth variant="contained" color='success' onClick={(e) => handleClickOpen(e, index)}>
                <Grid item xs={3} sm={2}>X</Grid>
            </Button>
        </Grid >
    ));

    useEffect(() => {
        setList(props.exercisesByUser.map((item, index) =>
            <Grid container key={index} className="manageExercisesListItem" >
                <Box component={Grid} item xs={9} sm={10} bgcolor={'white'} color={'gray'}>
                    {item}
                </Box>

                <Grid item xs={3} sm={2}>
                    <Button variant="contained" onClick={(e) => handleClickOpen(e, index)}>X</Button>
                </Grid>
            </Grid >
        ));
    }, [props]); // React complains that onDeleteClick is a missing dependency, but adding it results in "maximum update depth exceeded"

    useEffect(() => {
        console.log(exercisesPostDelete);
        liftState();
    }, [exercisesPostDelete, liftState]);

    // User feedback -- success and error
    const [showSuccessMsg, setShowSuccessMsg] = useState(false);

    const handleCloseSuccessMsg = () => {
        setShowSuccessMsg(false);
    }

    useEffect(() => {
        if (successMsg) setShowSuccessMsg(true);
    }, [successMsg, prevSuccessMsg])

    const [showError, setShowError] = useState(false);

    const handleCloseError = () => {
        setShowError(false);
    }

    useEffect(() => {
        if (error) setShowError(true);
    }, [error, prevError]);

    return (
        <Grid item xs={10} sm={8}>

            {/* Confirm delete dialog, triggered when a user clicks the 'X' button corresponding to some exercise */}
            <Dialog
                open={open}
                onClose={handleClose}
            >
                <DialogTitle>Delete exercise {props.exercisesByUser[indexToDelete]}?</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        This cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Back</Button>
                    <Button onClick={handleConfirmDelete} sx={{ color: 'red' }}>Delete</Button>
                </DialogActions>
            </Dialog>

            {/* Main component content: manage exercises list */}
            <h1>Manage Exercises</h1>
            <div className="manageExercisesList">
                {list}
            </div>

            {/* Feedback messages */}
            {successMsg && showSuccessMsg && <Alert severity="success" onClose={handleCloseSuccessMsg} sx={{ mt: '1rem' }}>{successMsg}</Alert>}
            {error && showError && <Alert severity="error" onClose={handleCloseError}>{error}</Alert>}
        </Grid>
    )
}

export default ManageExercisesList;