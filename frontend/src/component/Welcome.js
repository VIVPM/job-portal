import { Grid, Typography } from "@material-ui/core";
import './Welcome.css';

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
            <div className="company-card slide-in-left" style={{
              backgroundImage: `url('${require("../images/amazon.webp")}')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              height: '200px',
              width: '100%'
            }} />
          </Grid>
          <Grid item xs={12} sm={4}>
            <div className="company-card slide-in-top" style={{
              backgroundImage: `url('${require("../images/accenture.webp")}')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              height: '200px',
              width: '100%'
            }} />
          </Grid>
          <Grid item xs={12} sm={4}>
            <div className="company-card slide-in-right" style={{
              backgroundImage: `url('${require("../images/juniper.jpg")}')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              height: '200px',
              width: '100%'
            }} />
          </Grid>
        </Grid>
        <Grid container justifyContent="center">
          <div className="title-container fade-in" style={{
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            height: '200px',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <div className="title-box" style={{
              padding: '10px',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.5)',
              width: '1450px',
              textAlign: 'center'
            }}>
              <Typography variant="h5" className="main-title" style={{
                fontSize: '60px', fontWeight: '500', color: '#1a237e' }}>
                CareerSpark              
              </Typography>
              <br />
              <Typography variant="h5" className="sub-title" style={{
                fontSize: '30px', fontWeight: '500', color: '#dd2c00' }}>
                Ignite your career path today
              </Typography>
            </div>
          </div>
        </Grid>

        <Grid container item spacing={3} justifyContent="center">
          <Grid item xs={12} sm={4}>
            <div className="company-card slide-in-left delay" style={{
              backgroundImage: `url('${require("../images/infosys.jpg")}')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              height: '200px',
              width: '100%'
            }} />
          </Grid>
          <Grid item xs={12} sm={4}>
            <div className="company-card slide-in-bottom delay" style={{
              backgroundImage: `url('${require("../images/sony.jpg")}')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              height: '200px',
              width: '100%'
            }} />
          </Grid>
          <Grid item xs={12} sm={4}>
            <div className="company-card slide-in-right delay" style={{
              backgroundImage: `url('${require("../images/texas.jpg")}')`,
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