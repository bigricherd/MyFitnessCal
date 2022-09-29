import React, { useState, useEffect } from 'react';
import authHook from '../../hooks/auth';
import {
    Box,
    Container,
    Typography,
    Stack,
    FormControl,
    FormLabel,
    TextField,
    InputAdornment,
    IconButton,
    Button,
    Alert
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

function LoginPage() {

    // State variable and handler that represents password visibility
    const [showPassword, setShowPassword] = useState(false);

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    }

    // Login hook
    const { values, handleChange, handleKeyDown, handleSubmit, error, prevError } = authHook({
        initialValues: {
            username: '',
            password: '',
        },
        slug: 'api/auth/login'
    });

    // Setup to display feedback message -- error
    const [showError, setShowError] = useState(false);

    const handleCloseError = () => {
        setShowError(false);
    }

    useEffect(() => {
        if (error) setShowError(true);
    }, [error, prevError]);

    return (
        <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="100vh">
            <Container>

                {/* Heading */}
                <Typography variant="h3" gutterBottom>
                    Login
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
                        <TextField
                            name="password"
                            type={showPassword ? 'text' : 'password'}
                            value={values.password}
                            onChange={handleChange}
                            onKeyDown={handleKeyDown}

                            // endAdornment represents show / hide password button
                            InputProps={{
                                endAdornment: <InputAdornment position="end">
                                    <IconButton
                                        onClick={handleClickShowPassword}
                                    >
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            }}
                            required>
                        </TextField>
                    </FormControl>
                </Stack>

                {/* Submit button */}
                <Button
                    onClick={handleSubmit}
                    type="submit"
                    color="primary"
                    variant="contained"
                    sx={{ mb: '1rem' }}
                > Login
                </Button>

                {/* Feedback message -- error */}
                {error && showError && <Alert severity="error" onClose={handleCloseError}>{error}</Alert>}
            </Container>
        </Box>
    )
}

export default LoginPage;