import { Grid, Typography } from "@material-ui/core";

const Welcome = (props) => {
  return (
    // <Grid
    //   container
    //   item
    //   direction="column"
    //   alignItems="center"
    //   justifyContent="center"
    //   style={{
    //     padding: "30px", minHeight: "93vh", backgroundImage: `url('${require("../images/jobs-portal-new-transformed.png")}')`, backgroundRepeat: 'no-repeat', backgroundSize: 'cover',  

    //   }}
    // >
    //   <Grid item>
    //     <Typography variant="h2">Welcome to Job Portal</Typography>
    //   </Grid>
    //   {/* <Typography variant="h2">Welcome to Job Portal</Typography> */}
    // </Grid>
    <div style={{ minHeight: '100vh', width: '100%' }}>
      {/* Text Block */}
      <Grid
        container
        direction="column"
        alignItems="center"
        justifyContent="center"
        style={{ padding: '30px', height: '10vh' }} 
      >
        <Grid item>
          <Typography variant="h2">Welcome to Job Portal</Typography>
        </Grid>
      </Grid>


      <Grid
        container
        style={{
          minHeight: '90vh',
          backgroundImage: `url('${require("../images/jobs-portal-new-transformed.png")}')`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          width: '100%',
        }}
        alignItems="center"
        justifyContent="center"
      >
       
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
      justify="center"
      style={{ padding: "30px", minHeight: "93vh" }}
    >
      <Grid item>
        <Typography variant="h2">Error 404</Typography>
      </Grid>
    </Grid>
  );
};

export default Welcome;
