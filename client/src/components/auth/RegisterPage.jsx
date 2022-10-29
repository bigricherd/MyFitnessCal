import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    Typography,
    Stack,
    FormControl,
    FormLabel,
    Tooltip,
    TextField,
    InputAdornment,
    IconButton,
    Button,
    Alert
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import Dropdown from '../Dropdown';
import authHook from '../../hooks/auth';

const timezones = ["US/Samoa", "US/Hawaii", "US/Alaska", "US/Pacific", "US/Arizona", "US/Mountain",
    "US/Central", "US/Eastern", "Canada/Atlantic", "Canada/Newfoundland", "America/Buenos_Aires",
    "America/Noronha", "Atlantic/Cape_Verde", "Atlantic/Reykjavik", "Europe/London", "Europe/Amsterdam",
    "Africa/Cairo", "Europe/Istanbul", "Asia/Dubai", "Asia/Karachi", "Asia/Omsk", "Asia/Jakarta", "Asia/Hong_Kong",
    "Asia/Tokyo", "Australia/Brisbane", "Australia/Melbourne", "Pacific/Fiji"];

function RegisterPage() {

    // State variable and handler that represents password visibility
    const [showPassword, setShowPassword] = useState(false);

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    }

    // Register hook
    const { values, handleChange, handleKeyDown, handleSubmit, error, prevError } = authHook({
        initialValues: {
            username: '',
            password: '',
            timezone: ''
        },
        slug: 'api/auth/register',
        timezones
    });

    // Password requirements that appear when the user hovers over the password input
    const passwordFieldHover = <Stack>
        <Typography>Password must contain at least:</Typography>
        <Typography>- 6 characters</Typography>
        <Typography>- one lowercase letter (a-z)</Typography>
        <Typography>- one uppercase letter (A-Z)</Typography>
        <Typography> - one digit (0-9)</Typography>
        <Typography>- one symbol {`(!@#$%^&*)`}</Typography>
    </Stack>;

    // Setup to display feedback message -- error
    const [showError, setShowError] = useState(false);
    const [attempted, setAttempted] = useState(false);

    const handleCloseError = () => {
        setShowError(false);
    }

    useEffect(() => {
        if (error) {
            setAttempted(true);
            setShowError(true);
            setTimeout(() => {
                setShowError(false);
            }, 4000)
        }
    }, [error, prevError]);

    return (
        <Stack
            direction="column"
            justifyContent="flex-start"
            alignItems="center"
            minHeight="100vh"
            sx={{
                marginTop: {
                    xs: "30%",
                    sm: "25%",
                    md: "17%",
                    ml: "12%",
                    lg: "10%",
                    xl: "8%",
                    xxl: "6%"
                }
            }}
        >

            {/* Heading */}
            < Typography gutterBottom sx={{
                fontSize: {
                    xs: "1.65rem",
                    ml: "1.8rem"
                }
            }}>
                Register
            </Typography >

            {/* Form fields */}
            < Stack spacing={2} sx={{ mb: '1rem' }}>

                {/* Username input */}
                < FormControl >
                    <FormLabel>Username</FormLabel>
                    <TextField
                        name="username"
                        value={values.username}
                        onChange={handleChange}
                        onKeyDown={handleKeyDown}
                        error={attempted && (!values.username || values.username === "" || values.username.length > 30)}
                        required >
                    </TextField>
                </FormControl >

                {/* Password input */}
                < FormControl >
                    <FormLabel>Password</FormLabel>
                    <Tooltip
                        title={passwordFieldHover}
                        arrow>
                        <TextField
                            name="password"
                            type={showPassword ? 'text' : 'password'}
                            value={values.password}
                            onChange={handleChange}
                            onKeyDown={handleKeyDown}
                            error={attempted && (!values.password || values.password === "")}

                            // endAdornment represents show / hide password button
                            InputProps={{
                                endAdornment:
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={handleClickShowPassword}
                                        > {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                            }}
                            required>
                        </TextField>
                    </Tooltip>
                </FormControl >

                <FormControl>
                    <FormLabel>Time Zone</FormLabel>
                    <Tooltip
                        title={passwordFieldHover
                        }
                        arrow>
                        <Dropdown
                            id="timezone"
                            name="timezone"
                            value={values.timezone || ""}
                            options={timezones}
                            onChange={handleChange}
                            onKeyDown={handleKeyDown}
                            error={attempted && (!values.timezone || values.timezone === "")}
                            tooltip={"This will ensure that your sessions display on the calendar correctly."}
                        />
                    </Tooltip>
                </FormControl>
            </Stack >

            {/* Submit button */}
            < Button
                onClick={handleSubmit}
                type="submit"
                color="primary"
                variant="contained"
                sx={{ mb: '1rem' }}
            > Register
            </Button >

            {/* Feedback message -- error */}
            {error && showError && <Alert severity="error" onClose={handleCloseError} sx={{ mb: '1rem' }}>{error}</Alert>}

            {/* Link to Login page */}
            <Typography>Already have an account? <Link to="/login">Login</Link></Typography>
        </Stack >
    )
}

export default RegisterPage;