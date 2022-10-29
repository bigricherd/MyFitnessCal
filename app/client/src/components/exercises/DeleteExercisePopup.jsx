import {
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
} from '@mui/material';
import formatExercise from '../../helpers/formatExercise';

function DeleteExercisePopup(props) {
    return (
        <Dialog
            open={props.open}
            onClose={props.onClose}
        >
            <DialogTitle>Delete exercise {props.name && formatExercise(props.name.split(':')[0])}?</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    This cannot be undone.
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={props.backOnClick}>Back</Button>
                <Button onClick={props.deleteOnClick} variant="outlined" color="error">Delete</Button>
            </DialogActions>
        </Dialog>
    )
}

export default DeleteExercisePopup;