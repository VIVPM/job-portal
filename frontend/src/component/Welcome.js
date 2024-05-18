/* eslint-disable jsx-a11y/iframe-has-title */
// import { Grid, Typography } from "@material-ui/core";

// const Welcome = (props) => {
//   return (
//     // <Grid
//     //   container
//     //   item
//     //   direction="column"
//     //   alignItems="center"
//     //   justifyContent="center"
//     //   style={{
//     //     padding: "30px", minHeight: "93vh", backgroundImage: `url('${require("../images/jobs-portal-new-transformed.png")}')`, backgroundRepeat: 'no-repeat', backgroundSize: 'cover',  

//     //   }}
//     // >
//     //   <Grid item>
//     //     <Typography variant="h2">Welcome to Job Portal</Typography>
//     //   </Grid>
//     //   {/* <Typography variant="h2">Welcome to Job Portal</Typography> */}
//     // </Grid>
//     <div style={{ minHeight: '100vh', width: '100%' }}>
//       {/* Text Block */}
//       <Grid
//         container
//         direction="column"
//         alignItems="center"
//         justifyContent="center"
//         style={{ padding: '30px', height: '10vh' }} 
//       >
//         <Grid item>
//           <Typography variant="h2">Welcome to Job Portal</Typography>
//         </Grid>
//       </Grid>


//       <Grid
//         container
//         style={{
//           minHeight: '90vh',
//           backgroundImage: `url('${require("../images/jobs-portal-new-transformed.png")}')`,
//           backgroundRepeat: 'no-repeat',
//           backgroundSize: 'cover',
//           width: '100%',
//         }}
//         alignItems="center"
//         justifyContent="center"
//       >
       
//       </Grid>
//     </div>
//   );
// };

// export const ErrorPage = (props) => {
//   return (
//     <Grid
//       container
//       item
//       direction="column"
//       alignItems="center"
//       justify="center"
//       style={{ padding: "30px", minHeight: "93vh" }}
//     >
//       <Grid item>
//         <Typography variant="h2">Error 404</Typography>
//       </Grid>
//     </Grid>
//   );
// };

// export default Welcome;

import { Grid, Typography } from "@material-ui/core";

const Welcome = (props) => {
  return (
    <div style={{ width: '100%' }}>
      <Grid
        container
        direction="column"
        alignItems="center"
        justifyContent="center"
      >
      </Grid>

      <Grid
        container
        direction="column"
        alignItems="center"
        justifyContent="center"
      >
        <Grid container item spacing={3} justifyContent="center">
          <Grid item xs={12} sm={4}>
            <div style={{
              backgroundImage: `url('${require("../images/amazon.webp")}')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              height: '200px',
              width: '100%'
            }} />
          </Grid>
          <Grid item xs={12} sm={4}>
            <div style={{
              backgroundImage: `url('${require("../images/juniper.jpg")}')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              height: '200px',
              width: '100%'
            }} />
          </Grid>
          <Grid item xs={12} sm={4}>
            <div style={{
              backgroundImage: `url('${require("../images/texas.jpg")}')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              height: '200px',
              width: '100%'
            }} />
          </Grid>
        </Grid>
        <Grid container justifyContent="center">
          <div style={{
            backgroundImage: `url('${require("../images/careerSpark.png")}')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            height: '200px',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center' // Centers the box horizontally and vertically
          }}>
            <div style={{
              backgroundColor: 'rgba(255, 255, 255, 0.5)', // Semi-transparent white background
              padding: '20px',
              borderRadius: '10px', // Rounded corners
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // Subtle shadow for depth
              width: '1450px', // Limits the box width
              textAlign: 'center' // Center the text inside the box
            }}>
              <Typography variant="h5" style={{ fontSize: '50px', fontWeight: '500', color: 'black' }}>
                CareerSpark<br />Ignite Your Career Path Today
              </Typography>
            </div>
          </div>
        </Grid>

        <Grid container item spacing={3} justifyContent="center">
          <Grid item xs={12} sm={4}>
            <div style={{
              backgroundImage: `url('${require("../images/infosys.jpg")}')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              height: '200px',
              width: '100%'
            }} />
          </Grid>
          <Grid item xs={12} sm={4}>
            <div style={{
              backgroundImage: `url('${require("../images/accenture.webp")}')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              height: '200px',
              width: '100%'
            }} />
          </Grid>
          <Grid item xs={12} sm={4}>
            <div style={{
              backgroundImage: `url('${require("../images/sony.jpg")}')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              height: '200px',
              width: '100%'
            }} />
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};




// export const ErrorPage = (props) => {
//   return (
//     <Grid
//       container
//       item
//       direction="column"
//       alignItems="center"
//       justifyContent="center"
//       style={{ padding: "30px", minHeight: "93vh" }}
//     >
//       <Grid item>
//         <Typography variant="h2">Error 404</Typography>
//       </Grid>
//     </Grid>
//   );
// };

// export default Welcome;

// import React from 'react';
// import { Grid, Typography } from "@material-ui/core";

// const Welcome = () => {
//   const images = [
//     { src: '../images/infosys.jpg', title: 'Infosys' },
//     { src: '../images/amazon.webp', title: 'Amazon' },
//     { src: '../images/careerspark.jpg', title: 'CareerSpark', tagline: 'Ignite Your Career Path Today' }, // Example for CareerSpark with tagline
//     { src: '../images/mercedes.jpg', title: 'Mercedes-Benz' },
//     { src: '../images/texas.jpg', title: 'Texas Instruments' }
//   ];

//   return (
//     <div style={{ minHeight: '100vh', width: '100%', color: 'white' }}>
//       {/* Text Block at the top */}
//       <Grid container justifyContent="center" alignItems="center" style={{ padding: '20px' }}>
//         <Typography variant="h2" style={{ textAlign: 'center', color: 'white' }}>
//           CareerSpark: Ignite Your Career Path Today
//         </Typography>
//       </Grid>

//       {/* Image Grid */}
//       <Grid container justifyContent="center" spacing={3}>
//         {images.map((image, index) => (
//           <Grid item xs={12} sm={6} md={4} key={index}>
//             <div style={{
//               backgroundImage: `url('${image.src}')`,
//               backgroundSize: 'cover',
//               backgroundPosition: 'center',
//               height: '300px',
//               width: '100%',
//               display: 'flex',
//               flexDirection: 'column',
//               justifyContent: 'flex-end',
//               padding: '10px'
//             }}>
//               <Typography variant="h6">{image.title}</Typography>
//               {image.tagline && <Typography variant="body2">{image.tagline}</Typography>}
//             </div>
//           </Grid>
//         ))}
//       </Grid>
//     </div>
//   );
// };

export const ErrorPage = (props) => {
  return (
    <Grid
      container
      item
      direction="column"
      alignItems="center"
      justifyContent="center"
      style={{ padding: "30px", minHeight: "93vh" }}
    >
      <Grid item>
        <Typography variant="h2">Error 404</Typography>
      </Grid>
    </Grid>
  );
};

export default Welcome;