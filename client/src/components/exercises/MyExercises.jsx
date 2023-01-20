import { useState, useEffect } from 'react';
import formatExercise from '../../helpers/formatExercise';
import {
    Button,
    Alert,
    Typography,
    TableContainer,
    Table,
    TableRow,
    TableBody,
    TableCell,
    Stack
} from '@mui/material';
import { DeleteOutline } from '@mui/icons-material/';
import deleteExercise from '../../hooks/exercises/deleteExercise';
import DeleteExercisePopup from './DeleteExercisePopup';

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
        setIndexToDelete(null);
        setDeleteEvent(null);
        setOpen(false);
    }

    // Delete form hook and handler
    const { values, handleSubmit, error, prevError, successMsg, prevSuccessMsg, exercisesPostDelete } = deleteExercise(
        { exercise: '' }
    )

    const handleConfirmDelete = () => {
        values.exercise = props.exercisesByUser[indexToDelete];
        handleSubmit(deleteEvent);
        values.exercise = '';
        setOpen(false);
    }

    // ------ LIST OF EXERCISES ------
    const [exercisesByUser, setExercisesByUser] = useState([]);

    useEffect(() => {
        setExercisesByUser(props.exercisesByUser)
    }, [props]);

    const [list, setList] = useState([]);

    useEffect(() => {
        setList(exercisesByUser.map((item, index) =>
            <TableRow key={index} className="myExercisesItem" >

                {/* Exercise name */}
                <TableCell colSpan={4} align="center">
                    {(formatExercise(item.split(':')[0]))}
                </TableCell>

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
    }, [exercisesByUser]);

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
    }, [successMsg, prevSuccessMsg]);

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
        <Stack justifyContent="center" alignItems="center" spacing={1}>

            {/* List of exercises (main component content) */}
            {props.exercisesByUser.length > 0 &&
                <Typography
                    variant="h5"
                >
                    My Exercises
                </Typography>
            }

            <Stack justifyContent="center" alignItems="center">

                <TableContainer
                    sx={{
                        maxHeight: "40vh",
                        maxWidth: "100%",
                        margin: "auto"
                    }}>
                    <Table>
                        <TableBody>
                            {list}
                        </TableBody>
                    </Table>
                </TableContainer>

            </Stack>

            {/* Feedback messages */}
            <Stack justifyContent="center" alignItems="center">
                {successMsg && showSuccessMsg && <Alert severity="success" onClose={handleCloseSuccessMsg} sx={{ mt: '1rem' }}>{successMsg}</Alert>}
                {error && showError && <Alert severity="error" onClose={handleCloseError}>{error}</Alert>}
            </Stack>

            {/* Confirm delete dialog, which opens when a user clicks the 'X' button corresponding to some exercise */}

            <DeleteExercisePopup open={open} onClose={handleClose} name={props.exercisesByUser[indexToDelete]}
                backOnClick={handleClose} deleteOnClick={handleConfirmDelete} />
        </Stack>
    )
}

export default MyExercises;