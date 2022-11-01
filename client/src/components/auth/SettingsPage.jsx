import { useState, useEffect } from "react";
import {
    Stack,
    FormControl,
    Typography,
    Button,
    Alert
} from "@mui/material";
import Dropdown from "../Dropdown";
//import ChangePasswordPopup from "./ChangePasswordPopup";
import DeleteUserPopup from './DeleteUserPopup';
import editTimezone from "../../hooks/auth/editTimezone";

function SettingsPage(props) {
    const [user, setUser] = useState(props.user);
    const [userId, setUserId] = useState(props.userId);
    const [timezone, setTimezone] = useState(props.timezone);

    const [showChangePasswordPopup, setShowChangePasswordPopup] = useState(false);
    const [showDeactivatePopup, setShowDeactivatePopup] = useState(false);

    const { values, handleChange, handleKeyDown, handleSubmit, success, prevSuccess, setSuccess, error, prevError } = editTimezone({
        initialValues: {
            timezone: props.timezone,
            userId: props.userId
        },
        timezones: props.timezones,
        setTimezone: props.setTimezone
    });

    // Setup to show feedback messages -- success
    const [showSuccessMsg, setShowSuccessMsg] = useState(false);

    const handleCloseSuccessMsg = () => {
        setShowSuccessMsg(false);
    }

    useEffect(() => {
        if (success) {
            setShowSuccessMsg(true);
            setTimeout(() => {
                setShowSuccessMsg(false);
            }, 4000)
        }
    }, [success, prevSuccess]);

    // Setup to show feedback messages -- error
    const [showError, setShowError] = useState(false);

    const handleCloseError = () => {
        setShowError(false);
    }

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
        <Stack
            direction="column"
            justifyContent="center"
            alignItems="center"
            spacing={3}
            sx={{
                marginTop: {
                    xs: "30%",
                    sm: "23%",
                    md: "17%",
                    lg: "10%",
                    ml: "10%",
                    xl: "7%",
                    xxl: "5%"
                }
            }}
        >
            <Typography sx={{
                fontSize: {
                    xs: "1.65rem",
                    ml: "1.8rem"
                }
            }}>Settings</Typography>

            {/* Change time zone */}
            <Typography variant="h5">Time zone</Typography>
            <Stack direction="column" justifyContent="center" alignItems="center" spacing={1} component="form" onSubmit={handleSubmit}>
                <FormControl>
                    <Dropdown
                        id="timezone"
                        name="timezone"
                        options={props.timezones}
                        value={values.timezone}
                        onChange={handleChange}
                        onKeyDown={handleKeyDown}
                    />
                </FormControl>
                <Button
                    onClick={(e) => {
                        handleSubmit(e);
                    }}
                    variant="outlined"
                    color="success"
                >
                    Save
                </Button>
            </Stack>

            {/* Change password -- not functional because we do not store plain text passwords so no way of checking "old password" validity */}
            {/* <Stack direction="column" justifyContent="center" alignItems="center" spacing={1}>
                <Typography variant="h5">Password</Typography>
                <Button
                    onClick={() => { setShowChangePasswordPopup(true) }}
                    color="primary"
                    variant="outlined"
                >
                    Change
                </Button>

                <ChangePasswordPopup
                    open={showChangePasswordPopup}
                    onClose={() => {
                        setShowChangePasswordPopup(false);
                    }}
                    userId={userId}
                    setSuccess={setSuccess}
                />
            </Stack> */}

            <Stack>
                <Typography variant="h5">Account</Typography>
                <Button
                    onClick={() => { setShowDeactivatePopup(true) }}
                    color="error"
                    variant="outlined"
                >
                    DEACTIVATE
                </Button>

                <DeleteUserPopup
                    open={showDeactivatePopup}
                    onClose={() => { setShowDeactivatePopup(false) }}
                    user={user}
                    userId={userId}
                />
            </Stack>

            {/* Feedback messages */}
            <Stack justifyContent="center" alignItems="center">
                {success && showSuccessMsg && <Alert severity="success" onClose={handleCloseSuccessMsg}>{success}</Alert>}
                {error && showError && <Alert severity="error" onClose={handleCloseError}>{error}</Alert>}
            </Stack>
        </Stack >
    )
}

export default SettingsPage;