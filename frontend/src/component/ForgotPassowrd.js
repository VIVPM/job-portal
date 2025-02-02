import { useState, useContext } from "react";
import { Grid, TextField, Button, Typography, Paper } from "@material-ui/core";
import axios from "axios";
import { SetPopupContext } from "../App";
import apiList from "../lib/apiList";

const ForgotPassword = () => {
    const setPopup = useContext(SetPopupContext);
    const [email, setEmail] = useState("");
    const [emailSent, setEmailSent] = useState(false);

    const handleResetRequest = () => {
        axios
            .post(apiList.forgotPassword, { email })
            .then((response) => {
                setEmailSent(true);
                setPopup({
                    open: true,
                    severity: "success",
                    message: "Password reset link sent to your email.",
                });
            })
            .catch(() => {
                setPopup({
                    open: true,
                    severity: "error",
                    message: "Error: Email not found or invalid.",
                });
            });
    };

    return (
        <Paper style={{ padding: "40px", width: "400px", margin: "auto" }}>
            <Grid container direction="column" spacing={3} alignItems="center">
                <Grid item>
                    <Typography variant="h4">Forgot Password?</Typography>
                </Grid>

                {emailSent ? (
                    <Grid item>
                        <Typography color="primary">
                            ✅ A password reset link has been sent to your email.
                        </Typography>
                    </Grid>
                ) : (
                    <>
                        <Grid item>
                            <TextField
                                label="Enter your Email"
                                variant="outlined"
                                fullWidth
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </Grid>
                        <Grid item>
                            <Button
                                variant="contained"
                                color="primary"
                                fullWidth
                                onClick={handleResetRequest}
                            >
                                Send Reset Link
                            </Button>
                        </Grid>
                    </>
                )}
            </Grid>
        </Paper>
    );
};

export default ForgotPassword;
