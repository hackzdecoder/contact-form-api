import React from "react";
import {
    Box,
    Container,
    Paper,
} from '@mui/material';

export default function Layout({ children }) {
    return (
        <Box
            sx={{
                backgroundColor: '#0d1b2a',
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 2,
            }}
        >
            <Container maxWidth="sm">
                <Paper elevation={6} sx={{ padding: 4, backgroundColor: '#1b263b' }}>
                    {children}
                </Paper>
            </Container>
        </Box>
    );
}
