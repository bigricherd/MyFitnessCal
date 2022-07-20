import React, { useState } from 'react';
import useForm from '../../hooks/useAuthForm';
import {
    Box,
    Container,
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
//import Error from './Error'; //TODO: show error message on duplicate username, password too short(?)


function Register() {
    const [showPassword, setShowPassword] = useState(false);

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    }

    const { values, handleChange, handleKeyDown, handleSubmit, error } = useForm({
        initialValues: {
            username: '',
            password: '',
        },
        slug: 'api/auth/register'
    });

    const passwordFieldHover = <Stack>
        <Typography>Password must contain at least:</Typography>
        <Typography>- 6 characters</Typography>
        <Typography>- one lowercase letter (a-z)</Typography>
        <Typography>- one uppercase letter (A-Z)</Typography>
        <Typography> - one digit (0-9)</Typography>
        <Typography>- one symbol {`(!@#$%^&*)`}</Typography>
    </Stack>

    return (

        <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="100vh">
            <Container component="div">
                <Typography variant="h3" gutterBottom>
                    Register
                </Typography>
                <Stack spacing={2} sx={{ mb: '1rem' }}>
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
                <Button
                    onClick={handleSubmit}
                    type="submit"
                    color="primary"
                    variant="contained"
                    sx={{ mb: '1rem' }}
                > Register
                </Button>
                {error && <Alert severity="error" sx={{ mb: '1rem' }}>{error}</Alert>}
            </Container>

        </Box >
    )
}

export default Register;