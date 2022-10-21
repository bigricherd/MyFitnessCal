import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import authHook from '../../hooks/auth';
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
        },
        slug: 'api/auth/register'
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

    const handleCloseError = () => {
        setShowError(false);
    }

    useEffect(() => {
        if (error) setShowError(true);
    }, [error, prevError]);

    return (
        <Stack
            direction="column"
            justifyContent="center"
            alignItems="center"
            minHeight="100vh"
        >

            {/* Heading */}
            <Typography variant="h4" gutterBottom>
                Register
            </Typography>

            {/* Form fields */}
            <Stack spacing={2} sx={{ mb: '1rem' }}>

                {/* Username input */}
                <FormControl>
                    <FormLabel>Username</FormLabel>
                    <TextField
                        name="username"
                        value={values.username}
                        onChange={handleChange}
                        onKeyDown={handleKeyDown}
                        required >
                    </TextField>
                </FormControl>

                {/* Password input */}
                <FormControl>
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
                </FormControl>
            </Stack>

            {/* Submit button */}
            <Button
                onClick={handleSubmit}
                type="submit"
                color="primary"
                variant="contained"
                sx={{ mb: '1rem' }}
            > Register
            </Button>

            {/* Feedback message -- error */}
            {error && showError && <Alert severity="error" onClose={handleCloseError} sx={{ mb: '1rem' }}>{error}</Alert>}

            {/* Link to Login page */}
            <Typography>Already have an account? <Link to="/login">Login</Link></Typography>
        </Stack>
    )
}

export default RegisterPage;