import React, { useState, useEffect, useCallback } from 'react';
import formatExercise from '../../helpers/formatExercise';
import {
    Grid,
    Button,
    Box,
    Alert,
    Typography,
    TableContainer,
    Table,
    TableRow,
    TableBody,
    TableCell
} from '@mui/material';
import { DeleteOutline } from '@mui/icons-material/';
import Dropdown from '../Dropdown';
import deleteExercise from '../../hooks/exercises/deleteExercise';
import DeleteExercisePopup from './DeleteExercisePopup';
//import editExercise from '../hooks/editExercise';

function MyExercises(props) {

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

    const [exercisesByUser, setExercisesByUser] = useState([]);

    useEffect(() => {
        setExercisesByUser(props.exercisesByUser)
    }, [props]);

    const [list, setList] = useState([]);

    useEffect(() => {
        setList(exercisesByUser.map((item, index) =>
            // TODO style for desktop
            <TableRow key={index} className="myExercisesItem" >

                {/* Exercise name */}
                <TableCell colSpan={4} align="center">
                    {(formatExercise(item.split(':')[0]))}
                </TableCell>

                {/* <Button component={Grid} item xs={3} sm={2} fullWidth variant="contained" color='info' onClick={(e) => handleClickEdit(e, index)}>Edit</Button> */}

                {/* Delete button */}
                <TableCell colSpan={3} align="right">
                    <Button
                        size="small"
                        onClick={(e) => handleClickOpen(e, index)}
                    >
                        <DeleteOutline />
                    </Button>
                </TableCell>
            </TableRow >
        ));
        // setMuscleGroups(props.muscleGroups);
    }, [exercisesByUser]); // React complains that onDeleteClick is a missing dependency, but adding it results in "maximum update depth exceeded"

    useEffect(() => {
        props.liftState(exercisesPostDelete);
    }, [exercisesPostDelete]);


    // ----- FEEDBACK MESSAGES ------

    // Setup to show feedback message -- success
    const [showSuccessMsg, setShowSuccessMsg] = useState(false);
    const handleCloseSuccessMsg = () => { setShowSuccessMsg(false); }

    useEffect(() => {
        if (successMsg) {
            setShowSuccessMsg(true);
            setShowError(false);
            setTimeout(() => {
                setShowSuccessMsg(false);
            }, 4000)
        }
    }, [successMsg, prevSuccessMsg])

    // Setup to show feedback message -- error
    const [showError, setShowError] = useState(false);
    const handleCloseError = () => { setShowError(false); }

    useEffect(() => {
        if (error) {
            setShowError(true);
            setShowSuccessMsg(false);
            setTimeout(() => {
                setShowError(false);
            }, 4000)
        }
    }, [error, prevError]);

    return (
        <Grid item xs={10} sm={8}>

            {/* Confirm delete dialog, which opens when a user clicks the 'X' button corresponding to some exercise */}

            <DeleteExercisePopup open={open} onClose={handleClose} name={props.exercisesByUser[indexToDelete]}
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
            <Typography
                variant="h5"
                sx={{
                    marginTop: '2%',
                    marginBottom: '4%'
                }}
            >
                My Exercises
            </Typography>

            <TableContainer
                sx={{
                    maxHeight: "40vh",
                    maxWidth: "80%",
                    margin: "auto"
                }}>
                <Table>
                    <TableBody>
                        {list}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Feedback messages */}
            {successMsg && showSuccessMsg && <Alert severity="success" onClose={handleCloseSuccessMsg} sx={{ mt: '1rem' }}>{successMsg}</Alert>}
            {error && showError && <Alert severity="error" onClose={handleCloseError}>{error}</Alert>}
        </Grid>
    )
}

export default MyExercises;