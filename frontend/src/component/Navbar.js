// import {
//   AppBar,
//   Toolbar,
//   Typography,
//   Button,
//   makeStyles,
// } from "@material-ui/core";
// import { useHistory } from "react-router-dom";

// import isAuth, { userType } from "../lib/isAuth";

// const useStyles = makeStyles((theme) => ({
//   root: {
//     flexGrow: 1,
//   },
//   menuButton: {
//     marginRight: theme.spacing(2),
//   },
//   title: {
//     flexGrow: 1,
//   },
// }));

// const Navbar = (props) => {
//   const classes = useStyles();
//   let history = useHistory();

//   const handleClick = (location) => {
//     console.log(location);
//     history.push(location);
//   };

//   return (
//     <AppBar>
//       <Toolbar>
//         <Typography variant="h6" className={classes.title}>
//           <Button color="inherit" onClick={() => handleClick("/")}>CareerSpark</Button>
//         </Typography>
//         {/* <Button color="inherit" onClick={() => handleClick("/")}>
//           <Typography variant="h6" className={classes.title}>
//             CareerSpark
//           </Typography>
//           </Button> */}
          
        
//         {isAuth() ? (
//           userType() === "recruiter" ? (
//             <>
//               {/* <Button color="inherit" onClick={() => handleClick("/home")}>
//                 Home
//               </Button> */}
//               <Button color="inherit" onClick={() => handleClick("/addjob")}>
//                 Add Jobs
//               </Button>
//               <Button color="inherit" onClick={() => handleClick("/myjobs")}>
//                 My Jobs
//               </Button>
//               <Button color="inherit" onClick={() => handleClick("/employees")}>
//                 Employees
//               </Button>
//               <Button color="inherit" onClick={() => handleClick("/analytics")}>
//                 Analytics
//               </Button>
//               <Button color="inherit" onClick={() => handleClick("/profile")}>
//                 Profile
//               </Button>
//               <Button color="inherit" onClick={() => handleClick("/logout")}>
//                 Logout
//               </Button>
//             </>
//           ) : (
//             <>
//               <Button color="inherit" onClick={() => handleClick("/home")}>
//                 Find Jobs
//               </Button>
//               <Button
//                 color="inherit"
//                 onClick={() => handleClick("/applications")}
//               >
//                 Applications
//               </Button>
//                 <Button
//                   color="inherit"
//                   onClick={() => handleClick("/resume")}
//                 >
//                   Resume Builder
//                 </Button>
//               <Button color="inherit" onClick={() => handleClick("/profile")}>
//                 Profile
//               </Button>
//               <Button color="inherit" onClick={() => handleClick("/logout")}>
//                 Logout
//               </Button>
//             </>
//           )
//         ) : (
//           <>
//             <Button color="inherit" onClick={() => handleClick("/login")}>
//               Login
//             </Button>
//             <Button color="inherit" onClick={() => handleClick("/signup")}>
//               Signup
//             </Button>
//           </>
//         )}
//       </Toolbar>
//     </AppBar>
//   );
// };

// export default Navbar;
import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  makeStyles,
  useMediaQuery,
} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import { useTheme } from "@material-ui/core/styles";
import { useHistory } from "react-router-dom";

import isAuth, { userType } from "../lib/isAuth";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  list: {
    width: 250,
    backgroundColor: "#bbdefb", // Light blue background color
    height: "100%", // Ensure it covers the full height of the drawer
  },
  listItem: {
    color: theme.palette.primary.dark, // Customize text color if needed
  },
}));

const Navbar = () => {
  const classes = useStyles();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // Detect screen size
  let history = useHistory();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleClick = (location) => {
    setDrawerOpen(false); // Close drawer when navigating
    history.push(location);
  };

  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };

  const menuItems = isAuth()
    ? userType() === "recruiter"
      ? [
        { text: "Add Jobs", path: "/addjob" },
        { text: "My Jobs", path: "/myjobs" },
        { text: "Employees", path: "/employees" },
        { text: "Analytics", path: "/analytics" },
        { text: "Profile", path: "/profile" },
        { text: "Logout", path: "/logout" },
      ]
      : [
        { text: "Find Jobs", path: "/home" },
        { text: "Applications", path: "/applications" },
        { text: "Resume Builder", path: "/resume" },
        { text: "Profile", path: "/profile" },
        { text: "Logout", path: "/logout" },
      ]
    : [
      { text: "Login", path: "/login" },
      { text: "Signup", path: "/signup" },
    ];

  const drawer = (
    <div className={classes.list} role="presentation">
      <List>
        {menuItems.map((item, index) => (
          <ListItem
            button
            key={index}
            onClick={() => handleClick(item.path)}
            className={classes.listItem}
          >
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            <Button color="inherit" onClick={() => handleClick("/")}>
              CareerSpark
            </Button>
          </Typography>
          {isMobile ? (
            <>
              <IconButton
                edge="end"
                color="inherit"
                aria-label="menu"
                className={classes.menuButton}
                onClick={toggleDrawer(true)}
              >
                <MenuIcon />
              </IconButton>
              <Drawer
                anchor="right"
                open={drawerOpen}
                onClose={toggleDrawer(false)}
              >
                {drawer}
              </Drawer>
            </>
          ) : (
            <>
              {menuItems.map((item, index) => (
                <Button
                  key={index}
                  color="inherit"
                  onClick={() => handleClick(item.path)}
                >
                  {item.text}
                </Button>
              ))}
            </>
          )}
        </Toolbar>
      </AppBar>
    </>
  );
};

export default Navbar;
