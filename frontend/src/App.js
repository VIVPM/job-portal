// import { createContext, useState } from "react";
// import { BrowserRouter, Switch, Route } from "react-router-dom";
// import { Grid, makeStyles } from "@material-ui/core";

// import Welcome, { ErrorPage } from "./component/Welcome";
// import Navbar from "./component/Navbar";
// import Login from "./component/Login";
// import Logout from "./component/Logout";
// import Signup from "./component/Signup";
// import Home from "./component/Home";
// import Applications from "./component/Applications";
// import Profile from "./component/Profile";
// import CreateJobs from "./component/recruiter/CreateJobs";
// import MyJobs from "./component/recruiter/MyJobs";
// import JobApplications from "./component/recruiter/JobApplications";
// import AcceptedApplicants from "./component/recruiter/AcceptedApplicants";
// import RecruiterProfile from "./component/recruiter/Profile";
// import MessagePopup from "./lib/MessagePopup";
// import { userType } from "./lib/isAuth";
// import Resume1 from "./Resume1";
// import ApplicationStatusPieChart from "./component/recruiter/ApplicationStatusPieChart";
// import PdfComponent from './components/PdfComponent';

// const useStyles = makeStyles((theme) => ({
//   body: {
//     display: "flex",
//     flexDirection: "column",
//     justifyContent: "center",
//     alignItems: "center",
//     minHeight: "98vh",
//     paddingTop: "64px",
//     boxSizing: "border-box",
//     margin:0,
//     width: "100%",
//   },
// }));

// export const SetPopupContext = createContext();

// function App() {
//   const classes = useStyles();
//   const [popup, setPopup] = useState({
//     open: false,
//     severity: "",
//     message: "",
//   });
//   return (
//     <BrowserRouter>
//       <SetPopupContext.Provider value={setPopup}>
//         <Grid container direction="column">
//           {/* <Grid item xs> */}
//             {/* <Navbar /> */}
//           {/* </Grid> */}
//           <Grid item className={classes.body}>
//             <Switch>
//               <Route exact path="/">
//                 <Navbar />
//                 <Welcome />
//               </Route>
//               <Route exact path="/login">
//                 <Navbar />
//                 <Login />
//               </Route>
//               <Route exact path="/signup">
//                 <Navbar />
//                 <Signup />
//               </Route>
//               <Route exact path="/logout">
//                 <Navbar />
//                 <Logout />
//               </Route>
//               <Route exact path="/home">
//                 <Navbar />
//                 <Home />
//               </Route>
//               <Route exact path="/applications">
//                 <Navbar />
//                 <Applications />
//               </Route>
//               <Route exact path="/profile">
//                 <Navbar />
//                 {userType() === "recruiter" ? (

//                   <RecruiterProfile />
//                 ) : (
//                   <Profile />
//                 )}
//               </Route>
//               <Route exact path="/addjob">
//                 <Navbar />
//                 <CreateJobs />
//               </Route>
//               <Route exact path = "/analytics">
//                 <Navbar />
//                 <ApplicationStatusPieChart />
//               </Route>
//               <Route exact path="/myjobs">
//                 <Navbar />
//                 <MyJobs />
//               </Route>
//               <Route exact path="/job/applications/:jobId">
//                 <Navbar />
//                 <JobApplications />
//               </Route>
//               <Route exact path="/employees">
//                 <Navbar />
//                 <AcceptedApplicants />
//               </Route>
//               <Route exact path="/resume1">
//                 <Resume1/>
//               </Route>
//               <Route exact path="/preview">
//                 <PdfComponent/>
//               </Route>
//               <Route>
//                 <Navbar />
//                 <ErrorPage />
//               </Route>
//             </Switch>
//           </Grid>
//         </Grid>
//         <MessagePopup
//           open={popup.open}
//           setOpen={(status) =>
//             setPopup({
//               ...popup,
//               open: status,
//             })
//           }
//           severity={popup.severity}
//           message={popup.message}
//         />
//       </SetPopupContext.Provider>
//     </BrowserRouter>
//   );
// }

// export default App;

import { createContext, useState } from "react";
import { BrowserRouter, Route, Switch, useLocation } from "react-router-dom";
import { Grid } from "@material-ui/core";

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
import Resume1 from "./Resume1";
import ApplicationStatusPieChart from "./component/recruiter/ApplicationStatusPieChart";
import PdfComponent from './components/PdfComponent';

// const useStyles = makeStyles((theme) => ({
//   body: {
//     display: "flex",
//     flexDirection: "column",
//     justifyContent: "center",
//     alignItems: "center",
//     minHeight: "98vh",
//     paddingTop: "36px",
//     boxSizing: "border-box",
//     margin: 0,
//     width: "100%",
//   },
// }));

export const SetPopupContext = createContext();

function App() {
  // const classes = useStyles();
  const [popup, setPopup] = useState({
    open: false,
    severity: "",
    message: "",
  });

  function MainContent() {
    const location = useLocation(); // React Router hook to access the location object
    const showNavbar = !['/resume1', '/preview'].includes(location.pathname);
    const bodyClass = showNavbar ? "bodyWithNavbar" : "bodyWithoutNavbar";

    const bodyStyle = {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "98vh",
      paddingTop: showNavbar ? "64px" : "0",  // Adjust padding based on navbar visibility
      boxSizing: "border-box",
      width: "100%",
    };

    return (
      <Grid container direction="column" className={bodyClass}>
        {showNavbar && <Navbar />}
        <Grid item style={bodyStyle}>
          <Switch>
            <Route exact path="/" component={Welcome} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/signup" component={Signup} />
            <Route exact path="/logout" component={Logout} />
            <Route exact path="/home" component={Home} />
            <Route exact path="/applications" component={Applications} />
            <Route exact path="/profile" component={userType() === "recruiter" ? RecruiterProfile : Profile} />
            <Route exact path="/addjob" component={CreateJobs} />
            <Route exact path="/analytics" component={ApplicationStatusPieChart} />
            <Route exact path="/myjobs" component={MyJobs} />
            <Route exact path="/job/applications/:jobId" component={JobApplications} />
            <Route exact path="/employees" component={AcceptedApplicants} />
            <Route exact path="/resume1" component={Resume1} />
            <Route exact path="/preview" component={PdfComponent} />
            <Route component={ErrorPage} />
          </Switch>
        </Grid>
      </Grid>
    );
  }

  return (
    <BrowserRouter>
      <SetPopupContext.Provider value={setPopup}>
        <MainContent />
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
