import React, { useState, useEffect, useCallback } from 'react';
import formatEnum from '../helpers/formatEnum';
import {
    Grid,
    Button,
    Box,
    Alert,
    Typography,
    FormControl,
    FormLabel,
    TextField
} from '@mui/material';
import Dropdown from './Dropdown';
import deleteExercise from '../hooks/deleteExercise';
import ConfirmDeleteDialog from './ConfirmDeleteDialog';
//import editExercise from '../hooks/editExercise';

function ManageExercisesList(props) {

    // ------ DELETE EXERCISE ------

    // Two state variables to store index and event corresponding to the exercise in the Confirm Delete dialog
    const [indexToDelete, setIndexToDelete] = useState(null);
    const [deleteEvent, setDeleteEvent] = useState(null);

    // State variable that represents visibility of Confirm Delete dialog
    const [open, setOpen] = useState(false);

    // Open Confirm Delete dialog handler
    const handleClickOpen = (e, i) => {
        e.persist();
        setOpen(true);
        setIndexToDelete(i);
        setDeleteEvent(e);
    };

    // Close Confirm Delete dialog handler
    const handleClose = () => {
        console.log(`Selected exercises was at index ${indexToDelete}, now setting to null`);
        setIndexToDelete(null);
        setDeleteEvent(null);
        setOpen(false);
    }

    // Delete form hook and handler
    const { values, handleSubmit, error, prevError, successMsg, prevSuccessMsg, exercisesPostDelete } = deleteExercise(
        { exercise: '' }
    )

    const handleConfirmDelete = () => {
        // console.log(`I am supposed to delete exercise at index ${indexToDelete}. Corresponding event below`);
        values.exercise = props.exercisesByUser[indexToDelete];
        handleSubmit(deleteEvent);
        values.exercise = '';
        setOpen(false);
    }

    // ------ EDIT EXERCISE ------

    // Edit form hook and handler
    // const { editValues, handleEdit, handleChangeEdit, handleKeyDownEdit, exercisesPostEdit, editError, prevEditError, editSuccessMsg, prevEditSuccessMsg } = editExercise(
    //     {
    //         initialValues: {
    //             exercise: '',
    //             newName: '',
    //             newMuscleGroup: ''
    //         }
    //     }
    // )

    // const customHandleEdit = (e) => {
    //     editValues.exercise = props.exercisesByUser[indexOfEditing];
    //     handleEdit(e);
    //     handleCloseEdit();
    // }

    // // State variable that represents visibility of 'Edit' dialog; handlers follow
    // const [editing, setEditing] = useState(false);
    // const [indexOfEditing, setIndexOfEditing] = useState(null);
    // const handleClickEdit = (e, i) => {
    //     e.persist();
    //     editValues.newName = props.exercisesByUser[i];
    //     console.log(editValues);
    //     setIndexOfEditing(i);
    //     setEditing(true);
    //     console.log(`Going to show edit dialog for item at index ${i}, named ${props.exercisesByUser[i]}`);
    // }

    // const handleCloseEdit = () => {
    //     // editValues.exercise = '';
    //     // editValues.newName = '';
    //     // editValues.newMuscleGroup = '';
    //     setEditing(false);
    //     setIndexOfEditing(null);
    //     console.log('Setting index of editing to null');
    // }


    // ------ LIST OF EXERCISES ------

    // Function that lifts updated list of exercises to the parent component -- pages/Exercises.jsx
    const liftState = useCallback(() => {
        props.liftState(exercisesPostDelete);
    }, [exercisesPostDelete])

    // State variable that represents the list of exercises created by the current user
    const [list, setList] = useState(props.exercisesByUser.map((item, index) =>
        <Grid container key={index} className="manageExercisesListItem">
            <Box component={Grid} item xs={9} sm={10} bgcolor={'white'} color={'gray'}>
                {(formatEnum([item.split(':')[0]]))}
            </Box>

            <Button fullWidth variant="contained" color='success' onClick={(e) => handleClickOpen(e, index)}>
                <Grid item xs={3} sm={2}>X</Grid>
            </Button>
        </Grid >
    ));

    useEffect(() => {
        setList(props.exercisesByUser.map((item, index) =>
            <Grid container key={index} className="manageExercisesListItem" >

                {/* Exercise name */}
                <Box component={Grid} item xs={7} sm={8} bgcolor={'white'} color={'gray'}>
                    {(formatEnum([item.split(':')[0]]))}
                </Box>

                {/* <Button component={Grid} item xs={3} sm={2} fullWidth variant="contained" color='info' onClick={(e) => handleClickEdit(e, index)}>Edit</Button> */}

                {/* Delete button */}
                <Button component={Grid} item xs={2} variant="contained" onClick={(e) => handleClickOpen(e, index)}>
                    X
                </Button>
            </Grid >
        ));
        // setMuscleGroups(props.muscleGroups);
    }, [props]); // React complains that onDeleteClick is a missing dependency, but adding it results in "maximum update depth exceeded"

    useEffect(() => {
        console.log(exercisesPostDelete);
        liftState();
    }, [exercisesPostDelete, liftState]);


    // ----- FEEDBACK MESSAGES ------

    // Setup to show feedback message -- success
    const [showSuccessMsg, setShowSuccessMsg] = useState(false);
    const handleCloseSuccessMsg = () => { setShowSuccessMsg(false); }

    useEffect(() => {
        if (successMsg) setShowSuccessMsg(true);
    }, [successMsg, prevSuccessMsg])

    // Setup to show feedback message -- error
    const [showError, setShowError] = useState(false);
    const handleCloseError = () => { setShowError(false); }

    useEffect(() => {
        if (error) setShowError(true);
    }, [error, prevError]);

    return (
        <Grid item xs={10} sm={8}>

            {/* Confirm delete dialog, which opens when a user clicks the 'X' button corresponding to some exercise */}

            <ConfirmDeleteDialog open={open} onClose={handleClose} name={props.exercisesByUser[indexToDelete]}
                backOnClick={handleClose} deleteOnClick={handleConfirmDelete} />

            {/* Edit dialog */}
            {/* <Dialog
                open={editing}
                onClose={handleCloseEdit}
            >
                <DialogTitle>Edit exercise {props.exercisesByUser[indexOfEditing]}</DialogTitle>
                <DialogContent>
                    <Box component="form" onSubmit={(e) => customHandleEdit(e)}>
                        <FormControl fullWidth>
                            <FormLabel>Name</FormLabel>
                            <TextField
                                name="newName"
                                id="newName"
                                value={props.exercisesByUser[indexOfEditing]}
                                onChange={handleChangeEdit}
                                onKeyDown={handleKeyDownEdit}
                            ></TextField>
                        </FormControl>

                        <FormControl fullWidth>
                            <FormLabel>Muscle Group</FormLabel>
                            <Dropdown
                                name="newMuscleGroup"
                                id="newMuscleGroup"
                                options={muscleGroups}
                                value={editValues.newMuscleGroup}
                                onChange={handleChangeEdit}
                                onKeyDown={handleKeyDownEdit}
                            />
                        </FormControl>
                        <Button
                            type="submit"
                            variant="contained"
                            onClick={(e) => { customHandleEdit(e) }}
                        >Save Changes</Button>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseEdit}>Back</Button>
                </DialogActions>
            </Dialog> */}

            {/* List of exercises (main component content) */}
            <Typography variant="h3" gutterBottom>
                Manage Exercises
            </Typography>

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