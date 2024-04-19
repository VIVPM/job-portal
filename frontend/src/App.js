import { createContext, useState } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import { Grid, makeStyles } from "@material-ui/core";
<<<<<<< HEAD

=======
// import { ChakraProvider } from '@chakra-ui/react'
>>>>>>> 0ee198ce7f1572962fe4ee735b68ac6913e2c17a
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
<<<<<<< HEAD
=======
// import Resume from './Resume';
>>>>>>> 0ee198ce7f1572962fe4ee735b68ac6913e2c17a

const useStyles = makeStyles((theme) => ({
  body: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "98vh",
    paddingTop: "64px",
    boxSizing: "border-box",
    margin:0,
    width: "100%",
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
          {/* <Grid item xs> */}
            {/* <Navbar /> */}
          {/* </Grid> */}
          <Grid item className={classes.body}>
            <Switch>
              <Route exact path="/">
                <Navbar />
                <Welcome />
              </Route>
              <Route exact path="/login">
                <Navbar />
                <Login />
              </Route>
              <Route exact path="/signup">
                <Navbar />
                <Signup />
              </Route>
              <Route exact path="/logout">
                <Navbar />
                <Logout />
              </Route>
              <Route exact path="/home">
                <Navbar />
                <Home />
              </Route>
              <Route exact path="/applications">
                <Navbar />
                <Applications />
              </Route>
              <Route exact path="/profile">
                <Navbar />
                {userType() === "recruiter" ? (

                  <RecruiterProfile />
                ) : (
                  <Profile />
                )}
              </Route>
              <Route exact path="/addjob">
                <Navbar />
                <CreateJobs />
              </Route>
              <Route exact path = "/analytics">
                <Navbar />
                <ApplicationStatusPieChart />
              </Route>
              <Route exact path="/myjobs">
                <Navbar />
                <MyJobs />
              </Route>
              <Route exact path="/job/applications/:jobId">
                <Navbar />
                <JobApplications />
              </Route>
              <Route exact path="/employees">
                <Navbar />
                <AcceptedApplicants />
              </Route>
<<<<<<< HEAD
=======
              {/* <ChakraProvider>
              <Route exaxt path = "/resume">
                <Navbar/>
                <Resume/>
              </Route>
              </ChakraProvider> */}
>>>>>>> 0ee198ce7f1572962fe4ee735b68ac6913e2c17a
              <Route>
                <Navbar />
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
    </BrowserRouter>
  );
}

export default App;

