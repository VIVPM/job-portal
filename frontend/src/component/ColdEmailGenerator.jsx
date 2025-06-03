// ColdMailGenerator.jsx

import React, { useState } from "react";
import {
    Box,
    Container,
    Typography,
    TextField,
    Button,
    FormControl,
    FormHelperText,
    Paper,
    CircularProgress,
} from "@mui/material";
import apiList from "../lib/apiList";

const ColdMailGenerator = () => {
    const [jobUrl, setJobUrl] = useState("");
    const [resumeFile, setResumeFile] = useState(null);
    const [errors, setErrors] = useState({ url: "", resume: "" });
    const [loading, setLoading] = useState(false);
    const [generatedEmails, setGeneratedEmails] = useState([]);

    const handleUrlChange = (e) => {
        setJobUrl(e.target.value);
        if (errors.url) setErrors((prev) => ({ ...prev, url: "" }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0] || null;
        setResumeFile(file);
        if (errors.resume) setErrors((prev) => ({ ...prev, resume: "" }));
    };

    const validate = () => {
        let valid = true;
        const newErrors = { url: "", resume: "" };

        if (!jobUrl.trim()) {
            newErrors.url = "Job URL is required";
            valid = false;
        } else if (!/^https?:\/\/\S+$/.test(jobUrl.trim())) {
            newErrors.url = "Enter a valid URL (must start with http:// or https://)";
            valid = false;
        }

        if (!resumeFile) {
            newErrors.resume = "Please upload your resume (PDF, DOCX, or TXT)";
            valid = false;
        }

        setErrors(newErrors);
        return valid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        setLoading(true);
        setGeneratedEmails([]);

        try {
            const formData = new FormData();
            formData.append("job_url", jobUrl.trim());
            formData.append("resume_file", resumeFile);

            const response = await fetch(apiList.coldEmail, {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                const errJSON = await response.json().catch(() => null);
                const msg = errJSON?.detail || "Unknown error";
                throw new Error(msg);
            }

            const data = await response.json();
            setGeneratedEmails(data);
        } catch (err) {
            alert(`Error: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    const downloadTxtFile = (role, emailText, index) => {
        const safeRole = role.replace(/[^a-z0-9]/gi, "_").toLowerCase();
        const filename = `${safeRole || "email"}_${index + 1}.txt`;

        const blob = new Blob([emailText], { type: "text/plain" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
    };

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            {/* Title */}
            <Box display="flex" alignItems="center" mb={3}>
                <Typography variant="h4" component="h1" fontWeight={600}>
                    <span role="img" aria-label="envelope">
                        📧
                    </span>{" "}
                    Cold Mail Generator
                </Typography>
            </Box>

            {/* Form */}
            <Box
                component="form"
                onSubmit={handleSubmit}
                noValidate
                sx={{ display: "flex", flexDirection: "column", gap: 2 }}
            >
                {/* Job URL Field */}
                <TextField
                    label="Enter a URL"
                    variant="outlined"
                    fullWidth
                    value={jobUrl}
                    onChange={handleUrlChange}
                    error={Boolean(errors.url)}
                    helperText={errors.url}
                />

                {/* Resume Upload Field */}
                <FormControl error={Boolean(errors.resume)}>
                    <Button
                        variant="outlined"
                        component="label"
                        sx={{ textTransform: "none" }}
                    >
                        {resumeFile ? resumeFile.name : "Choose Resume"}
                        <input
                            type="file"
                            accept=".pdf,.docx,.txt"
                            hidden
                            onChange={handleFileChange}
                        />
                    </Button>
                    {errors.resume && (
                        <FormHelperText>{errors.resume}</FormHelperText>
                    )}
                </FormControl>

                {/* Submit Button */}
                <Box>
                    <Button
                        type="submit"
                        variant="contained"
                        disabled={loading}
                        sx={{ mt: 1, textTransform: "none" }}
                    >
                        {loading ? (
                            <CircularProgress size={24} color="inherit" />
                        ) : (
                            "Submit"
                        )}
                    </Button>
                </Box>
            </Box>

            {/* Generated Emails */}
            <Box mt={4}>
                {generatedEmails.map((item, idx) => (
                    <Paper
                        key={idx}
                        elevation={2}
                        sx={{ p: 2, mb: 3, backgroundColor: "#fafafa" }}
                    >
                        <Typography variant="h6" fontWeight={500} gutterBottom>
                            Role: {item.role}
                        </Typography>
                        <Typography
                            component="pre"
                            sx={{
                                whiteSpace: "pre-wrap",
                                fontFamily: "Roboto, sans-serif",
                                lineHeight: 1.5,
                            }}
                        >
                            {item.email}
                        </Typography>
                        <Box mt={2}>
                            <Button
                                variant="outlined"
                                size="small"
                                onClick={() => downloadTxtFile(item.role, item.email, idx)}
                                sx={{ textTransform: "none" }}
                            >
                                Download as .txt
                            </Button>
                        </Box>
                    </Paper>
                ))}
            </Box>
        </Container>
    );
};

export default ColdMailGenerator;
