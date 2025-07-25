import React, { useState, useEffect } from "react";
import {
    Button,
    Typography,
    Box,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    CircularProgress,
    TextField,
    Alert
} from "@mui/material";
import useEndpoint from '@hooks/api';
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
    const navigate = useNavigate();

    const [fullname, setFullname] = useState('');
    const [contactNo, setContactNo] = useState('');
    const [submitPayload, setSubmitPayload] = useState(null);
    const [triggerCreate, setTriggerCreate] = useState(0);
    const [createResult, setCreateResult] = useState(null);
    const [contactList, setContactList] = useState(null);

    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);

    const [deletePayload, setDeletePayload] = useState(null);
    const [triggerDelete, setTriggerDelete] = useState(0);

    const response = useEndpoint({
        url: submitPayload
            ? isEditing
                ? `/api/contacts/update/${editId}`
                : "/api/contacts/create"
            : null,
        method: "POST",
        body: submitPayload,
        trigger: triggerCreate
    });

    const deleteResponse = useEndpoint({
        url: deletePayload ? `/api/contacts/delete/${deletePayload.id}` : null,
        method: "POST",
        body: {},
        trigger: triggerDelete
    });

    const fetchContacts = async () => {
        try {
            const token = localStorage.getItem("auth_token");
            const res = await fetch("/api/contacts", {
                headers: {
                    'Content-Type': 'application/json',
                    ...(token && { Authorization: `Bearer ${token}` })
                }
            });
            const data = await res.json();
            setContactList(data);
        } catch (err) {
            console.error("Fetch error:", err);
            setContactList({ error: "Failed to fetch contacts" });
        }
    };

    useEffect(() => {
        fetchContacts();
    }, []);

    useEffect(() => {
        const isSuccess =
            response?.success ||
            response?.message?.toLowerCase().includes('created') ||
            response?.message?.toLowerCase().includes('updated');

        const isError = response?.error;

        if (isSuccess && !isError) {
            setCreateResult(isEditing ? "Contact updated successfully!" : "Contact created successfully!");
            setFullname('');
            setContactNo('');
            setIsEditing(false);
            setEditId(null);
            fetchContacts();
            setSubmitPayload(null);
        } else if (isError || response?.message) {
            setCreateResult(response.error || response.message);
        }
    }, [response]);

    useEffect(() => {
        if (deleteResponse?.success || deleteResponse?.message?.toLowerCase().includes("deleted")) {
            setCreateResult("Contact deleted successfully!");
            fetchContacts();
            setDeletePayload(null);
        } else if (deleteResponse?.error) {
            setCreateResult(deleteResponse.error || "Delete failed.");
        }
    }, [deleteResponse]);

    const handleSubmit = () => {
        if (!fullname || !contactNo) {
            setCreateResult("Both fields are required");
            return;
        }
        setSubmitPayload({ fullname, contact_no: contactNo });
        setTriggerCreate(Date.now());
    };

    const handleEdit = (contact) => {
        setFullname(contact.fullname);
        setContactNo(contact.contact_no);
        setEditId(contact.id);
        setIsEditing(true);
    };

    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this contact?")) {
            setDeletePayload({ id });
            setTriggerDelete(Date.now());
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("auth_token");
        navigate("/login");
    };

    return (
        <Box sx={{ p: 5 }}>
            <Typography variant="h4" gutterBottom>
                Welcome to Dashboard
            </Typography>

            <Button variant="outlined" color="error" onClick={handleLogout} sx={{ mb: 4 }}>
                Logout
            </Button>

            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <TextField
                    label="Full Name"
                    value={fullname}
                    onChange={(e) => setFullname(e.target.value)}
                />
                <TextField
                    label="Contact No"
                    value={contactNo}
                    onChange={(e) => setContactNo(e.target.value)}
                />
                <Button variant="contained" onClick={handleSubmit}>
                    {isEditing ? "Update" : "Create"}
                </Button>
            </Box>

            {createResult && (
                <Alert severity={createResult.includes("success") ? "success" : "error"} sx={{ mb: 2 }}>
                    {createResult}
                </Alert>
            )}

            {!contactList ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <CircularProgress />
                </Box>
            ) : contactList.error ? (
                <Typography color="error">{contactList.error}</Typography>
            ) : (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell><strong>ID</strong></TableCell>
                                <TableCell><strong>Full Name</strong></TableCell>
                                <TableCell><strong>Contact No</strong></TableCell>
                                <TableCell><strong>Created At</strong></TableCell>
                                <TableCell><strong>Actions</strong></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {Array.isArray(contactList) && contactList.length > 0 ? (
                                contactList.map((contact) => (
                                    <TableRow key={contact.id}>
                                        <TableCell>{contact.id}</TableCell>
                                        <TableCell>{contact.fullname}</TableCell>
                                        <TableCell>{contact.contact_no}</TableCell>
                                        <TableCell>{new Date(contact.createdAt).toLocaleString()}</TableCell>
                                        <TableCell>
                                            <Button size="small" onClick={() => handleEdit(contact)}>Edit</Button>
                                            <Button
                                                size="small"
                                                color="error"
                                                onClick={() => handleDelete(contact.id)}
                                                sx={{ ml: 1 }}
                                            >
                                                Delete
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={5} align="center">
                                        No contacts found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </Box>
    );
};

export default Dashboard;
