import { useState } from "react";
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    Button, TextField, RadioGroup, FormControlLabel, Typography,
    Radio, CircularProgress
} from "@material-ui/core";
import axios from "axios";
import apiList from "../lib/apiList";

export default function ResumeCheckerModal({ open, onClose, jobDescription }) {
    const [file, setFile] = useState(null);
    const [type, setType] = useState("quick");
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState("");
    const cleanResult = result.replace(/\*\*/g, "");

    const handleSubmit = async () => {
        if (!file) return;
        const data = new FormData();
        data.append("file", file);
        data.append("job_description", jobDescription);
        data.append("analysis_type", type);

        setLoading(true);
        try {
            const res = await axios.post(
                apiList.resumeChecker,
                data,
                { headers: { "Content-Type": "multipart/form-data" } }
            );
            setResult(res.data.result);
        } catch (e) {
            setResult("Error: " + (e.response?.data?.detail || e.message));
        }
        setLoading(false);
    };

    const handleDownload = () => {
        const element = document.createElement("a");
        const fileBlob = new Blob([cleanResult], { type: "text/plain" });
        element.href = URL.createObjectURL(fileBlob);
        element.download = "recommendations.txt";
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    };

    // Clear state when modal closes
    const handleCloseModal = () => {
        setFile(null);
        setType("quick");
        setResult("");
        onClose();
    };

    return (
        <Dialog open={open} onClose={handleCloseModal} fullWidth maxWidth="md">
            <DialogTitle>Resume Checker</DialogTitle>
            <DialogContent dividers>
                <input
                    type="file"
                    accept="application/pdf"
                    onChange={e => setFile(e.target.files[0])}
                />
                <Typography variant="caption" color="textSecondary">
                    Max size: 200 MB
                </Typography>
                <TextField
                    label="Job Description"
                    fullWidth
                    margin="normal"
                    multiline
                    minRows={3}
                    value={jobDescription}
                    disabled
                />
                <RadioGroup
                    row
                    value={type}
                    onChange={e => setType(e.target.value)}
                >
                    <FormControlLabel
                        value="quick"
                        control={<Radio />}
                        label="Quick Scan"
                    />
                    <FormControlLabel
                        value="detailed"
                        control={<Radio />}
                        label="Detailed Analysis"
                    />
                    <FormControlLabel
                        value="ats"
                        control={<Radio />}
                        label="ATS Optimization"
                    />
                </RadioGroup>

                {loading && <CircularProgress />}
                {cleanResult && (
                    <>
                        <TextField
                            label="Recommendations"
                            fullWidth
                            multiline
                            minRows={10}
                            value={cleanResult}
                            margin="normal"
                        />
                        <Button
                            variant="outlined"
                            onClick={handleDownload}
                            style={{ marginTop: 16 }}
                        >
                            Download Recommendations
                        </Button>
                    </>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={handleCloseModal}>Close</Button>
                <Button
                    color="primary"
                    variant="contained"
                    onClick={handleSubmit}
                    disabled={!file || loading}
                >
                    Analyze
                </Button>
            </DialogActions>
        </Dialog>
    );
}