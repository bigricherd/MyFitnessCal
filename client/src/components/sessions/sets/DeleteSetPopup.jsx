import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Stack,
    Typography
} from '@mui/material';

function DeleteSetPopup(props) {

    return (
        <>
            <Dialog open={props.open} onClose={props.onClose}>
                <DialogTitle>
                    Delete this set from session '{props.sessionTitle}'?
                </DialogTitle>
                <DialogContent>
                    <Stack spacing={1}>
                        <Typography><strong>Exercise:</strong> {props.exercise}</Typography>
                        <Typography><strong>Reps:</strong> {props.set.reps}</Typography>
                        <Typography><strong>Weight:</strong> {props.set.weight}</Typography>

                        <Typography variant="h6"><strong>WARNING: THIS CANNOT BE UNDONE.</strong></ Typography>

                    </Stack>

                </DialogContent>
                <DialogActions>
                    <Button onClick={props.onClose}>Back</Button>
                    <Button
                        onClick={(e) => {
                            props.handleDelete(e);
                        }}
                        variant="outlined"
                        color="error"
                    >
                        Delete set
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default DeleteSetPopup;