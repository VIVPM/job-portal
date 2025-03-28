import { useState, useEffect } from "react";
import { useLocation, Redirect } from "react-router-dom";
import {
    Grid,
    TextField,
    Button,
    Typography,
    Paper,
    IconButton,
    InputAdornment,
} from "@material-ui/core";
import { Visibility, VisibilityOff } from "@material-ui/icons";
import axios from "axios";
import apiList from "../lib/apiList";

const ResetPassword = () => {
    const location = useLocation();
    const [email, setEmail] = useState("");
    const [token, setToken] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [newPasswordError, setNewPasswordError] = useState("");
    const [confirmPasswordError, setConfirmPasswordError] = useState("");
    const [popup, setPopup] = useState({ open: false, severity: "", message: "" });
    const [redirectToLogin, setRedirectToLogin] = useState(false);
    const [newPasswordStrength, setNewPasswordStrength] = useState("");
    const [confirmPasswordStrength, setConfirmPasswordStrength] = useState("");

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Extract token & email from URL
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const userEmail = params.get("email");
        const userToken = params.get("token");

        if (!userEmail || !userToken) {
            setPopup({
                open: true,
                severity: "error",
                message: "Invalid or expired password reset link.",
            });
        } else {
            setEmail(userEmail);
            setToken(userToken);
        }
    }, [location]);

    // Function to calculate password strength
    const calculatePasswordStrength = (password) => {
        let strength = 0;
        if (password.length >= 8) strength += 1; // Length check
        if (/[A-Z]/.test(password)) strength += 1; // Uppercase check
        if (/[a-z]/.test(password)) strength += 1; // Lowercase check
        if (/\d/.test(password)) strength += 1; // Number check
        if (/[@$!%*?&]/.test(password)) strength += 1; // Special character check

        switch (strength) {
            case 0:
            case 1:
                return "Weak";
            case 2:
                return "Basic";
            case 3:
                return "Medium";
            case 4:
            case 5:
                return "Strong";
            default:
                return "";
        }
    };

    // Handle password input changes and update strength
    const handleNewPasswordChange = (e) => {
        const password = e.target.value;
        setNewPassword(password);
        setNewPasswordStrength(calculatePasswordStrength(password));
    };

    const handleConfirmPasswordChange = (e) => {
        const password = e.target.value;
        setConfirmPassword(password);
        setConfirmPasswordStrength(calculatePasswordStrength(password));
    };

    // Password strength validation for submission
    const validatePassword = (password) => {
        const strongPasswordRegex =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return strongPasswordRegex.test(password);
    };

    // Handle password reset submission
    const handleResetPassword = () => {
        let isValid = true;

        if (!validatePassword(newPassword)) {
            setNewPasswordError(
                "Password must be at least 8 characters long, include an uppercase letter, a lowercase letter, a number, and a special character."
            );
            isValid = false;
        } else {
            setNewPasswordError("");
        }

        if (newPassword !== confirmPassword) {
            setConfirmPasswordError("Passwords do not match!");
            isValid = false;
        } else {
            setConfirmPasswordError("");
        }

        if (isValid) {
            axios
                .post(apiList.resetPassword, { email, token, newPassword })
                .then((response) => {
                    setPopup({
                        open: true,
                        severity: "success",
                        message: response.data.message,
                    });
                    setTimeout(() => setRedirectToLogin(true), 3000);
                })
                .catch((error) => {
                    setPopup({
                        open: true,
                        severity: "error",
                        message: error.response?.data?.message || "Error resetting password",
                    });
                });
        }
    };

    if (redirectToLogin) {
        return <Redirect to="/login" />;
    }

    // Helper function to determine strength color
    const getStrengthColor = (strength) => {
        switch (strength) {
            case "Weak":
                return "red";
            case "Basic":
                return "orange";
            case "Medium":
                return "yellow";
            case "Strong":
                return "green";
            default:
                return "black";
        }
    };

    return (
        <Paper style={{ padding: "40px", width: "400px", margin: "auto" }}>
            <Grid container direction="column" spacing={3} alignItems="center">
                <Grid item>
                    <Typography variant="h4">Reset Password</Typography>
                </Grid>

                <Grid item>
                    <TextField
                        label="New Password"
                        variant="outlined"
                        type={showPassword ? "text" : "password"}
                        fullWidth
                        value={newPassword}
                        onChange={handleNewPasswordChange}
                        error={!!newPasswordError}
                        helperText={newPasswordError}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton onClick={() => setShowPassword(!showPassword)}>
                                        {showPassword ? <Visibility /> : <VisibilityOff />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                        required
                    />
                    {newPassword && (
                        <Typography
                            variant="caption"
                            style={{ color: getStrengthColor(newPasswordStrength) }}
                        >
                            Strength: {newPasswordStrength}
                        </Typography>
                    )}
                </Grid>

                <Grid item>
                    <TextField
                        label="Confirm Password"
                        variant="outlined"
                        type={showConfirmPassword ? "text" : "password"}
                        fullWidth
                        value={confirmPassword}
                        onChange={handleConfirmPasswordChange}
                        error={!!confirmPasswordError}
                        helperText={confirmPasswordError}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    >
                                        {showConfirmPassword ? <Visibility /> : <VisibilityOff />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                        required
                    />
                    {confirmPassword && (
                        <Typography
                            variant="caption"
                            style={{ color: getStrengthColor(confirmPasswordStrength) }}
                        >
                            Strength: {confirmPasswordStrength}
                        </Typography>
                    )}
                </Grid>

                <Grid item>
                    <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        onClick={handleResetPassword}
                    >
                        Reset Password
                    </Button>
                </Grid>

                {popup.open && (
                    <Grid item>
                        <Typography
                            style={{
                                color: popup.severity === "success" ? "green" : "red",
                                marginTop: "20px",
                                textAlign: "center",
                            }}
                        >
                            {popup.message}
                        </Typography>
                    </Grid>
                )}
            </Grid>
        </Paper>
    );
};

export default ResetPassword;