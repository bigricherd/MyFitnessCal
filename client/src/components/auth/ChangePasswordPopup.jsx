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
import changePassword from "../../hooks/auth/changePassword";

function ChangePasswordPopup(props) {

    const [userId, setUserId] = useState(props.userId);

    const { values, handleChange, handleKeyDown, handleSubmit, error, prevError } = changePassword({
        initialValues: {
            userId: props.userId,
            oldPassword: '',
            newPassword: ''
        },
        setSuccess: props.setSuccess
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
                Change Password
            </DialogTitle>
            <DialogContent>

                <Stack direction="column" justifyContent="center" alignItems="center">
                    <FormControl>
                        <FormLabel>
                            Old Password
                        </FormLabel>
                        <TextField
                            id="oldPassword"
                            name="oldPassword"
                            type="password"
                            value={values.oldPassword}
                            onChange={handleChange}
                            onKeyDown={handleKeyDown}
                        />
                    </FormControl>

                    <FormControl>
                        <FormLabel>
                            New Password
                        </FormLabel>
                        <TextField
                            id="newPassword"
                            name="newPassword"
                            type="password"
                            value={values.newPassword}
                            onChange={handleChange}
                            onKeyDown={handleKeyDown}
                        />
                    </FormControl>

                </Stack>

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
                    onClick={handleSubmit}
                    variant="outlined"
                    color="success"
                >
                    Change Password
                </Button>
            </DialogActions>

        </Dialog>
    )

}

export default ChangePasswordPopup
