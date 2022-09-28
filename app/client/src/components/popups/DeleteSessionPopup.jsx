import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button
} from '@mui/material';

function DeleteSessionPopup(props) {
    return (
        <>
            <Dialog open={props.open} onClose={props.handleClose}>
                <DialogTitle>
                    Delete session {props.title}?
                </DialogTitle>
                <DialogContent>
                    This cannot be undone.
                </DialogContent>
                <DialogActions>
                    <Button onClick={props.handleClose}>Back</Button>
                    <Button
                        onClick={props.handleDelete}
                        variant="contained"
                        sx={{ backgroundColor: "red" }}
                    >
                        Delete session
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default DeleteSessionPopup;