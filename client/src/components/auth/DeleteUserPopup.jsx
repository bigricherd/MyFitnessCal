import { useState, useEffect } from "react";
import {
    Stack,
    FormControl,
    Typography,
    Button,
    Alert,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    FormLabel,
    TextField
} from "@mui/material";
import deleteUser from "../../hooks/auth/deleteUser";


function DeleteUserPopup(props) {

    const { handleSubmit, error, prevError } = deleteUser({
        initialValues: {
            userId: props.userId,
        },
    });

    // Setup to show feedback messages -- error
    const [showError, setShowError] = useState(false);

    const handleCloseError = () => {
        setShowError(false);
    }

    useEffect(() => {
        if (error) {
            setShowError(true);
            setTimeout(() => {
                setShowError(false);
            }, 4000)
        }
    }, [error, prevError]);

    return (
        <Dialog open={props.open}>
            <DialogTitle>
                Delete user {props.user}?
            </DialogTitle>
            <DialogContent>

                <strong>WARNING:</strong> This cannot be undone.

                {/* Feedback messages */}
                <Stack justifyContent="center" alignItems="center">
                    {error && showError && <Alert severity="error" onClose={handleCloseError}>{error}</Alert>}
                </Stack>

            </DialogContent>
            <DialogActions>
                <Button
                    onClick={props.onClose}
                >
                    Back
                </Button>

                <Button
                    onClick={(e) => {
                        handleSubmit(e);
                        props.onClose();
                    }}
                    variant="outlined"
                    color="error"
                >
                    Delete user
                </Button>
            </DialogActions>

        </Dialog >
    )

}

export default DeleteUserPopup;
