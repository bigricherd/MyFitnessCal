import {
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
} from '@mui/material';
import formatEnum from '../helpers/formatEnum';

function ConfirmDeleteDialog(props) {
    return (
        <Dialog
            open={props.open}
            onClose={props.onClose}
        >
            <DialogTitle>Delete exercise {props.name && formatEnum([props.name.split(':')[0]])}?</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    This cannot be undone.
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={props.backOnClick}>Back</Button>
                <Button onClick={props.deleteOnClick} sx={{ color: 'red' }}>Delete</Button>
            </DialogActions>
        </Dialog>
    )
}

export default ConfirmDeleteDialog;