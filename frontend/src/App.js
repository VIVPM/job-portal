import { createContext, useState } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import { Grid, makeStyles } from "@material-ui/core";
import Welcome, { ErrorPage } from "./component/Welcome";
import Navbar from "./component/Navbar";
import Login from "./component/Login";
import Logout from "./component/Logout";
import Signup from "./component/Signup";
import Home from "./component/Home";
import Applications from "./component/Applications";
import Profile from "./component/Profile";
import CreateJobs from "./component/recruiter/CreateJobs";
import MyJobs from "./component/recruiter/MyJobs";
import JobApplications from "./component/recruiter/JobApplications";
import AcceptedApplicants from "./component/recruiter/AcceptedApplicants";
import RecruiterProfile from "./component/recruiter/Profile";
import MessagePopup from "./lib/MessagePopup";
import { userType } from "./lib/isAuth";
import ApplicationStatusPieChart from "./component/recruiter/ApplicationStatusPieChart";
import Context from './context/Context';
import Body from "./components/Body/Body";
import Contact from "./component/Contact";
import ForgotPassword from "./component/ForgotPassowrd";
import ResetPassword from "./component/ResetPassword";
import './App.css'

import JobStatsAndTableWithDateFilter from './component/recruiter/JobStatsAndTableWithDateFilter';

const useStyles = makeStyles((theme) => ({
  body: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "90vh",
    boxSizing: "border-box",
    margin: 0,
    width: "100%",
    backgroundRepeat: 'no-repeat',  // Prevents repeating the background image
    backgroundColor: '#bbdefb',
  },
}));

export const SetPopupContext = createContext();

function App() {
  const classes = useStyles();
  const [popup, setPopup] = useState({
    open: false,
    severity: "",
    message: "",
  });
  return (
    <BrowserRouter>
      <SetPopupContext.Provider value={setPopup}>
        <Grid container direction="column">
          <Grid item xs>
            <Navbar />
          </Grid>
          <Grid item className={classes.body}>
            <Switch>
              <Route exact path="/">
                <Welcome />
              </Route>
              <Route exact path="/login" >
                <Login />
              </Route>
              <Route exact path="/signup">
                <Signup />
              </Route>
              <Route exact path="/logout">
                <Logout />
              </Route>
              <Route exact path="/home">
                <Home />
              </Route>
              <Route exact path="/contact">
                <Contact />
              </Route>
              <Route exact path="/applications">
                <Applications />
              </Route>
              <Route exact path="/job/applications/:jobId">
                <JobApplications />
              </Route>
              <Route exact path="/profile">
                {userType() === "recruiter" ? (

                  <RecruiterProfile />
                ) : (
                  <Profile />
                )}
              </Route>
              <Route exact path="/addjob">
                <CreateJobs />
              </Route>
              <Route exact path="/analytics">
                <ApplicationStatusPieChart />
                <JobStatsAndTableWithDateFilter />
              </Route>
              <Route exact path="/myjobs">
                <MyJobs />
              </Route>
              <Route exact path="/forgot-password">
                <ForgotPassword />
              </Route>
              <Route exact path="/reset-password">
                <ResetPassword />
              </Route>


              <Route exact path="/employees">
                <AcceptedApplicants />
              </Route>
              <Route exact path="/resume">
                <Context>
                  <Body />
                </Context>
              </Route>
              <Route>
                <ErrorPage />
              </Route>
            </Switch>
          </Grid>
        </Grid>
        <MessagePopup
          open={popup.open}
          setOpen={(status) =>
            setPopup({
              ...popup,
              open: status,
            })
          }
          severity={popup.severity}
          message={popup.message}
        />
      </SetPopupContext.Provider>
    </BrowserRouter >
  );
}

export default App;

