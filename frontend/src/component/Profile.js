import { useContext, useEffect, useState } from "react";
import {
  Button,
  Grid,
  Typography,
  // Modal,
  Paper,
  makeStyles,
  TextField,
  Avatar,
} from "@material-ui/core";
import axios from "axios";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/material.css";
import ChipInput from "material-ui-chip-input";
import FileUploadInput from "../lib/FileUploadInput";
import DescriptionIcon from "@material-ui/icons/Description";
import FaceIcon from "@material-ui/icons/Face";

import { SetPopupContext } from "../App";

import apiList from "../lib/apiList";

const useStyles = makeStyles((theme) => ({
  body: {
    backgroundColor: '#64b5f6',
    height: "100%",
    
    // width:"200px"
  },
  popupDialog: {
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    // padding: "30px",
  },
  avatar: {
    width: theme.spacing(17), // 136px
    height: theme.spacing(17), // 136px
  },
}));

const MultifieldInput = (props) => {
  const classes = useStyles();
  const { education, setEducation } = props;
  const setPopup = useContext(SetPopupContext);

  const handleDeleteLastInstitution = () => {
    if (education.length <= 1) return; // Prevent deleting if only one entry exists

    const lastEntry = education[education.length - 1];
    const isLastEntryEmpty = Object.values(lastEntry).some(value => value === "");

    if (isLastEntryEmpty) {
      // Remove the last entry from the education array
      const updatedEducation = education.slice(0, -1);
      setEducation(updatedEducation);
    } else {
      setPopup({
        open: true,
        severity: "error",
        message: "The last entry is filled. Cannot delete a filled entry.",
      });
    }
  };

  return (
    <>
      {education.map((obj, key) => (
        <Grid item container className={classes.inputBox} key={key}>
          <Grid item xs={3}>
            <TextField
              label={`Institution Name #${key + 1}`}
              value={education[key].institutionName}
              onChange={(event) => {
                const newEdu = [...education];
                newEdu[key].institutionName = event.target.value;
                setEducation(newEdu);
              }}
              variant="outlined"
              fullWidth
            />
          </Grid>
          <Grid item xs={3}>
            <TextField
              label="Start Year"
              value={obj.startYear}
              variant="outlined"
              type="number"
              onChange={(event) => {
                const newEdu = [...education];
                newEdu[key].startYear = event.target.value;
                setEducation(newEdu);
              }}
            />
          </Grid>
          <Grid item xs={3}>
            <TextField
              label="End Year"
              value={obj.endYear}
              variant="outlined"
              type="number"
              onChange={(event) => {
                const newEdu = [...education];
                newEdu[key].endYear = event.target.value;
                setEducation(newEdu);
              }}
            />
          </Grid>
          <Grid item xs={3}>
            <TextField
              label="Percentage"
              value={obj.Percentage}
              variant="outlined"
              type="number"
              onChange={(event) => {
                const newEdu = [...education];
                newEdu[key].Percentage = event.target.value;
                setEducation(newEdu);
              }}
            />
          </Grid>
        </Grid>
      ))}

      <Grid item container style={{ justifyContent: "center", marginTop: "5px" }}>
        <Grid item>
          <Button
            variant="contained"
            color="secondary"
            onClick={() =>
              setEducation([
                ...education,
                {
                  institutionName: "",
                  startYear: "",
                  endYear: "",
                  Percentage: "",
                },
              ])
            }
            className={classes.inputBox}
            style={{ marginRight: "10px" }} // Add some spacing between the buttons
          >
            Add another institution details
          </Button>
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            color="primary"
            onClick={handleDeleteLastInstitution}
            className={classes.inputBox}
          >
            Delete Institution Details
          </Button>
        </Grid>
      </Grid>

    </>
  );
};

const Profile = (props) => {
  const classes = useStyles();
  const setPopup = useContext(SetPopupContext);
  // const [userData, setUserData] = useState();
  // const [setOpen] = useState(false);
  const [phone, setPhone] = useState("");
  const [profileDetails, setProfileDetails] = useState({
    name: "",
    email: "",
    education: [],
    skills: [],
    resume: "",
    profile: "",
    contactNumber:"",
  });

  const [education, setEducation] = useState([
    {
      institutionName: "",
      startYear: "",
      endYear: "",
      Percentage:"",
    },
  ]);

  const handleInput = (key, value) => {
    setProfileDetails({
      ...profileDetails,
      [key]: value,
    });
  };

  useEffect(() => {
    getData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getData = () => {
    axios
      .get(apiList.user, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        // console.log(response.data);
        setProfileDetails(response.data);
        if (response.data.education.length > 0) {
          setEducation(
            response.data.education.map((edu) => ({
              institutionName: edu.institutionName ? edu.institutionName : "",
              startYear: edu.startYear ? edu.startYear : "",
              endYear: edu.endYear ? edu.endYear : "",
              Percentage: edu.Percentage ? edu.Percentage:"",
            }))
          );
        }
        setPhone(response.data.contactNumber);
      })
      .catch((err) => {
        console.log(err.response.data);
        setPopup({
          open: true,
          severity: "error",
          message: "Error",
        });
      });
  };

  const handleUpdate = () => {
    console.log(profileDetails);

    let updatedDetails = {
      ...profileDetails,
      contactNumber: phone ? `${phone}` : "",
      education: education
        .filter((obj) => obj.institutionName.trim() !== "")
        .map((obj) => {
          if (obj["endYear"] === "") {
            delete obj["endYear"];
          }
          return obj;
        }),
    };
    console.log(updatedDetails)
    axios
      .put(apiList.user, updatedDetails, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        setPopup({
          open: true,
          severity: "success",
          message: response.data.message,
        });
        getData();
      })
      .catch((err) => {
        setPopup({
          open: true,
          severity: "error",
          message: err.response.data.message,
        });
        console.log(err.response);
      });
    // setOpen(false);
  };


  const getResume = () => {
    if (profileDetails.resume && profileDetails.resume !== "") {
      console.log(profileDetails.resume,apiList.downloadResume)
      axios(profileDetails.resume, {
        method: "GET",
        responseType: "blob",
      })
        .then((response) => {
          const file = new Blob([response.data], { type: "application/pdf" });
          const fileURL = URL.createObjectURL(file);
          window.open(fileURL);
        })
        .catch((error) => {
          console.log(error);
          setPopup({
            open: true,
            severity: "error",
            message: "Error downloading resume",
          });
        });
    } else {
      setPopup({
        open: true,
        severity: "error",
        message: "No resume found",
      });
    }
  };

  return (
    <>
      <Grid
        container
        item
        direction="column"
        alignItems="center"
        style={{ padding: "30px", minHeight: "93vh" }}
      >
        <Grid item>
          <Typography variant="h2">Profile</Typography>
        </Grid>
        <Grid item xs >
          <Paper
            style={{
              padding: "20px",
              outline: "none",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              // backgroundColor: '#64b5f6',
            }}
          >
            <Avatar
              src={profileDetails.profile} 
              alt="Profile Image"
              className={classes.avatar}
            />
            <Grid container direction="column" alignItems="stretch" spacing={3}>
              <Grid item>
                <TextField
                  label="Name"
                  value={profileDetails.name}
                  onChange={(event) => handleInput("name", event.target.value)}
                  className={classes.inputBox}
                  variant="outlined"
                  fullWidth
                  style={{ marginTop: "10px" }}
                />
              </Grid>
              <Grid item>
                <TextField
                  label="Email"
                  value={profileDetails.email}
                  onChange={(event) => handleInput("email", event.target.value)}
                  className={classes.inputBox}
                  variant="outlined"
                  fullWidth
                  style={{ marginTop: "10px" }}
                />
              </Grid>
              
              <MultifieldInput
                education={education}
                setEducation={setEducation}
              />
              <Grid item>
                <ChipInput
                  className={classes.inputBox}
                  label="Skills"
                  variant="outlined"
                  helperText="Press enter to add skills"
                  value={profileDetails.skills}
                  onAdd={(chip) =>
                    setProfileDetails({
                      ...profileDetails,
                      skills: [...profileDetails.skills, chip],
                    })
                  }
                  onDelete={(chip, index) => {
                    let skills = profileDetails.skills;
                    skills.splice(index, 1);
                    setProfileDetails({
                      ...profileDetails,
                      skills: skills,
                    });
                  }}
                  fullWidth
                  
                />
                
              </Grid>
              <Grid
                item
                style={{
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <PhoneInput
                  country={"in"}
                  value={phone}
                  onChange={(phone) => setPhone(phone)}
                  style={{ width: "auto" }}
                />
              </Grid>
           
              
            
              <Grid item>
                <FileUploadInput
                  className={classes.inputBox}
                  label="Resume (.pdf)"
                  icon={<DescriptionIcon />}
                  uploadTo={apiList.uploadResume}
                  handleInput={handleInput}
                  identifier={"resume"}
                />
              </Grid>
              <Grid item>
                <FileUploadInput
                  className={classes.inputBox}
                  label="Profile Photo (.jpg/.png)"
                  icon={<FaceIcon />}
                  uploadTo={apiList.uploadProfileImage}
                  handleInput={handleInput}
                  identifier={"profile"}
                />
              </Grid>
            </Grid>
            <Button
              variant="contained"
              color="primary"
              style={{ marginTop: "15px", padding:"10px" }}
              onClick={getResume}
            >
              View Resume
            </Button>
            <Button
              variant="contained"
              color="primary"
              style={{ padding: "10px 50px", marginTop: "20px" }}
              onClick={() => handleUpdate()}
            >
              Update Details
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </>
  );
};

export default Profile;
