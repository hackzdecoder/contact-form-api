import React, { useState, useEffect } from 'react';
import {
    Box,
    Button,
    TextField,
    Typography,
    Alert
} from '@mui/material';
import Layout from '@components/layout';
import useEndpoint from '@hooks/api';
import { useNavigate } from 'react-router-dom';

const Index = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});
    const [responseState, setResponseState] = useState(null);
    const [triggerLogin, setTriggerLogin] = useState(0);
    const [payload, setPayload] = useState(null);
    const navigate = useNavigate();

    // Check if already logged in
    useEffect(() => {
        const token = localStorage.getItem('auth_token');
        if (token) {
            navigate('/dashboard', { replace: true });
        }
    }, [navigate]);

    const response = useEndpoint({
        url: payload ? "/api/login" : null,
        method: "POST",
        body: payload,
        trigger: triggerLogin
    });

    const validate = () => {
        const newErrors = {};
        if (!username) newErrors.username = "Username is required";
        if (!password) newErrors.password = "Password is required";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            setPayload({ username, password });
            setTriggerLogin(Date.now()); // Trigger login
        }
    };

    useEffect(() => {
        if (!response) return;

        if (response?.token) {
            localStorage.setItem('auth_token', response.token);
            navigate('/dashboard', { replace: true });
        } else {
            setResponseState(response?.message || response?.error || "Login failed");
        }
    }, [response, navigate]);

    return (
        <Layout>
            <Typography variant="h4" align="center" gutterBottom sx={{ color: '#e0e1dd' }}>
                Login
            </Typography>

            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
                <TextField
                    label="Username"
                    fullWidth
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    margin="normal"
                    variant="outlined"
                    error={!!errors.username}
                    helperText={errors.username}
                    InputLabelProps={{ style: { color: '#e0e1dd' } }}
                    InputProps={{
                        style: { color: '#e0e1dd', backgroundColor: '#415a77' },
                    }}
                />

                <TextField
                    label="Password"
                    type="password"
                    fullWidth
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    margin="normal"
                    variant="outlined"
                    error={!!errors.password}
                    helperText={errors.password}
                    InputLabelProps={{ style: { color: '#e0e1dd' } }}
                    InputProps={{
                        style: { color: '#e0e1dd', backgroundColor: '#415a77' },
                    }}
                />

                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{
                        mt: 3,
                        backgroundColor: '#0d47a1',
                        '&:hover': {
                            backgroundColor: '#1565c0',
                        },
                    }}
                >
                    Sign In
                </Button>

                {responseState && (
                    <Box mt={2}>
                        <Alert severity="error">{responseState}</Alert>
                    </Box>
                )}
            </Box>
        </Layout>
    );
};

export default Index;
