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
    <div style={{ minHeight: '100vh', width: '100%' }}>
      {/* Text Block */}
      <Grid
        container
        direction="column"
        alignItems="center"
        justifyContent="center"
        style={{ padding: '50px', height: '10vh' }}
      >
        <Grid item>
          <Typography variant="h2">CareerSpark: Ignite Your Career Path Today</Typography>
        </Grid>
      </Grid>

      {/* Image Grid */}
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
        <Grid container item spacing={3} justifyContent="center">
          <Grid item xs={12} sm={4}>
            <div style={{
              backgroundImage: `url('${require("../images/kletech.jpg")}')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              height: '200px',
              width: '100%'
            }} />
          </Grid>
          <Grid item xs={12} sm={4}>
            <div style={{
              backgroundImage: `url('${require("../images/kleit.jpeg")}')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              height: '200px',
              width: '100%'
            }} />
          </Grid>
          <Grid item xs={12} sm={4}>
            <div style={{
              backgroundImage: `url('${require("../images/kle belagavi.webp")}')`,
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
