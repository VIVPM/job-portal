// import React from "react";
// import Container from "react-bootstrap/Container";
// import Nav from "react-bootstrap/Nav";
// import Navbar from "react-bootstrap/Navbar";
// import { NavLink } from 'react-router-dom';
// import isAuth, { userType } from "../lib/isAuth";

// function Navbar1() {
//   return (
//     <Navbar bg="primary" className="border-bottom" sticky="top" style={{alignItems:"right"}}>
//       <Container>
//         <Navbar.Brand>
//           <NavLink to="/" className="text-decoration-none text-black">Resume Builder</NavLink>
//         </Navbar.Brand>
//         <Nav className="ms-auto">
//           {/* <Nav.Link as={NavLink} to="/" exact>
//             Home
//           </Nav.Link> */}
//           {isAuth() && userType() !== "recruiter" && (
//             <>
//               <Nav.Link as={NavLink} to="/home">
//                 Find Jobs
//               </Nav.Link>
//               <Nav.Link as={NavLink} to="/applications">
//                 Applications
//               </Nav.Link>
//               <Nav.Link as={NavLink} to="/resume1">
//                 Resume Builder
//               </Nav.Link>
//               <Nav.Link as={NavLink} to="/profile">
//                 Profile
//               </Nav.Link>
//               <Nav.Link as={NavLink} to="/logout">
//                 Logout
//               </Nav.Link>
//             </>
//           )}
//           {!isAuth() && (
//             <>
//               <Nav.Link as={NavLink} to="/login">
//                 Login
//               </Nav.Link>
//               <Nav.Link as={NavLink} to="/signup">
//                 Signup
//               </Nav.Link>
//             </>
//           )}
//         </Nav>
//       </Container>
//     </Navbar>
//   );
// }

// export default Navbar1;

import React from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { NavLink } from 'react-router-dom';
import isAuth, { userType } from "../lib/isAuth";

function Navbar1() {
  return (
    <Navbar bg="primary" className="border-bottom" sticky="top">
      <Container>
        <Navbar.Brand className="text-white">
          <NavLink to="/" className="text-decoration-none text-white">Resume Builder</NavLink>
        </Navbar.Brand>
        <Nav className="ms-auto">
          {isAuth() && userType() !== "recruiter" && (
            <>
              <Nav.Link as={NavLink} to="/home" className="text-white">
                Find Jobs
              </Nav.Link>
              <Nav.Link as={NavLink} to="/applications" className="text-white">
                Applications
              </Nav.Link>
              <Nav.Link as={NavLink} to="/resume1" className="text-white">
                Resume Builder
              </Nav.Link>
              <Nav.Link as={NavLink} to="/profile" className="text-white">
                Profile
              </Nav.Link>
              <Nav.Link as={NavLink} to="/logout" className="text-white">
                Logout
              </Nav.Link>
            </>
          )}
          {!isAuth() && (
            <>
              <Nav.Link as={NavLink} to="/login" className="text-white">
                Login
              </Nav.Link>
              <Nav.Link as={NavLink} to="/signup" className="text-white">
                Signup
              </Nav.Link>
            </>
          )}
        </Nav>
      </Container>
    </Navbar>
  );
}

export default Navbar1;
