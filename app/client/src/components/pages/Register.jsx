import React, { useState } from 'react';
import useForm from '../../hooks/useAuthForm';
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
    Button
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
                <Stack spacing={2}>
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
                    </FormControl>
                </Stack>
                <Button
                    onClick={handleSubmit}
                    type="submit"
                    color="primary"
                    variant="contained"
                > Register
                </Button>
            </Container>
        </Box>
    )
}

export default Register;