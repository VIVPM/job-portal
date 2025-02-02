import { useState, useEffect } from "react";
import { useLocation, Redirect } from "react-router-dom";
import { Grid, TextField, Button, Typography, Paper, IconButton, InputAdornment } from "@material-ui/core";
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

    // Password strength validation
    const validatePassword = (password) => {
        const strongPasswordRegex =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return strongPasswordRegex.test(password);
    };

    // Handle password reset
    const handleResetPassword = () => {
        let isValid = true;

        if (!validatePassword(newPassword)) {
            setNewPasswordError(
                "Password must be at least 8 characters long, include an uppercase letter, a lowercase letter, a number, and a special character."
            );
            isValid = false;
        } else {
            setNewPasswordError(""); // Clear error if valid
        }

        if (newPassword !== confirmPassword) {
            setConfirmPasswordError("Passwords do not match!");
            isValid = false;
        } else {
            setConfirmPasswordError(""); // Clear error if valid
        }

        if (isValid) {
            axios
                .post(apiList.resetPassword, { email, token, newPassword })
                .then(() => {
                    setPopup({
                        open: true,
                        severity: "success",
                        message: "Password reset successful! Redirecting to login...",
                    });
                    setTimeout(() => setRedirectToLogin(true), 3000); // Redirect to login after 3 seconds
                })
                .catch(() => {
                    setPopup({
                        open: true,
                        severity: "error",
                        message: "Invalid token or error resetting password.",
                    });
                });
        }
    };

    // Redirect to login if successful
    if (redirectToLogin) {
        return <Redirect to="/login" />;
    }

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
                        onChange={(e) => setNewPassword(e.target.value)}
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
                    />
                </Grid>

                <Grid item>
                    <TextField
                        label="Confirm Password"
                        variant="outlined"
                        type={showConfirmPassword ? "text" : "password"}
                        fullWidth
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        error={!!confirmPasswordError}
                        helperText={confirmPasswordError}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                                        {showConfirmPassword ? <Visibility /> : <VisibilityOff />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
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
