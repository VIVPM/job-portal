import { useState, useEffect, useContext } from "react";
import { Document, Packer, Paragraph, Table, TableRow, TableCell } from "docx";
import {
  Button,
  Chip,
  Grid,
  IconButton,
  makeStyles,
  Paper,
  Typography,
  Modal,
  Checkbox,
  Avatar,
} from "@material-ui/core";
import Rating from "@material-ui/lab/Rating";
import { saveAs } from 'file-saver';
import axios from "axios";
import emailjs from 'emailjs-com';
import FilterListIcon from "@material-ui/icons/FilterList";
import ArrowUpwardIcon from "@material-ui/icons/ArrowUpward";
import ArrowDownwardIcon from "@material-ui/icons/ArrowDownward";

import { SetPopupContext } from "../../App";

import apiList from "../../lib/apiList";

const useStyles = makeStyles((theme) => ({
  body: {
    height: "inherit",
  },
  statusBlock: {
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    textTransform: "uppercase",
  },
  jobTileOuter: {
    padding: "30px",
    margin: "20px 0",
    boxSizing: "border-box",
    width: "100%",
  },
  popupDialog: {
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  avatar: {
    width: theme.spacing(17),
    height: theme.spacing(17),
  },
  sopBlock: {
    display: 'flex',
    alignItems: 'flex-start',
    marginBottom: theme.spacing(1),
    maxWidth: '90%',
    // justifyContent:'center'
  },
  sopLabel: {
    marginRight: theme.spacing(1),
    whiteSpace: 'nowrap',
  },
  sopContent: {
    wordBreak: 'break-word',
  },
}));

const formatISTDate = (dateInput) =>
  new Date(dateInput).toLocaleDateString("en-IN", { timeZone: "Asia/Kolkata" });

const FilterPopup = (props) => {
  const classes = useStyles();
  const { open, handleClose, searchOptions, setSearchOptions, getData } = props;
  return (
    <Modal open={open} onClose={handleClose} className={classes.popupDialog}>
      <Paper
        style={{
          padding: "50px",
          outline: "none",
          minWidth: "50%",
        }}
      >
        <Grid container direction="column" alignItems="center" spacing={3}>
          <Grid container item alignItems="center">
            <Grid item xs={3}>
              Sort
            </Grid>
            <Grid item container direction="row" xs={9}>
              <Grid
                item
                container
                xs={6}
                justifyContent="space-around"
                alignItems="center"
                style={{ border: "1px solid #D1D1D1", borderRadius: "5px" }}
              >
                <Grid item>
                  <Checkbox
                    name="name"
                    checked={searchOptions.sort["jobApplicant.name"].status}
                    onChange={(event) =>
                      setSearchOptions({
                        ...searchOptions,
                        sort: {
                          ...searchOptions.sort,
                          "jobApplicant.name": {
                            ...searchOptions.sort["jobApplicant.name"],
                            status: event.target.checked,
                          },
                        },
                      })
                    }
                    id="name"
                  />
                </Grid>
                <Grid item>
                  <label for="name">
                    <Typography>Name</Typography>
                  </label>
                </Grid>
                <Grid item>
                  <IconButton
                    disabled={!searchOptions.sort["jobApplicant.name"].status}
                    onClick={() => {
                      setSearchOptions({
                        ...searchOptions,
                        sort: {
                          ...searchOptions.sort,
                          "jobApplicant.name": {
                            ...searchOptions.sort["jobApplicant.name"],
                            desc: !searchOptions.sort["jobApplicant.name"].desc,
                          },
                        },
                      });
                    }}
                  >
                    {searchOptions.sort["jobApplicant.name"].desc ? (
                      <ArrowDownwardIcon />
                    ) : (
                      <ArrowUpwardIcon />
                    )}
                  </IconButton>
                </Grid>
              </Grid>
              <Grid
                item
                container
                xs={6}
                justifyContent="space-around"
                alignItems="center"
                style={{ border: "1px solid #D1D1D1", borderRadius: "5px" }}
              >
                <Grid item>
                  <Checkbox
                    name="jobTitle"
                    checked={searchOptions.sort["job.title"].status}
                    onChange={(event) =>
                      setSearchOptions({
                        ...searchOptions,
                        sort: {
                          ...searchOptions.sort,
                          "job.title": {
                            ...searchOptions.sort["job.title"],
                            status: event.target.checked,
                          },
                        },
                      })
                    }
                    id="jobTitle"
                  />
                </Grid>
                <Grid item>
                  <label for="jobTitle">
                    <Typography>Job Title</Typography>
                  </label>
                </Grid>
                <Grid item>
                  <IconButton
                    disabled={!searchOptions.sort["job.title"].status}
                    onClick={() => {
                      setSearchOptions({
                        ...searchOptions,
                        sort: {
                          ...searchOptions.sort,
                          "job.title": {
                            ...searchOptions.sort["job.title"],
                            desc: !searchOptions.sort["job.title"].desc,
                          },
                        },
                      });
                    }}
                  >
                    {searchOptions.sort["job.title"].desc ? (
                      <ArrowDownwardIcon />
                    ) : (
                      <ArrowUpwardIcon />
                    )}
                  </IconButton>
                </Grid>
              </Grid>
              <Grid
                item
                container
                xs={6}
                justifyContent="space-around"
                alignItems="center"
                style={{ border: "1px solid #D1D1D1", borderRadius: "5px" }}
              >
                <Grid item>
                  <Checkbox
                    name="dateOfJoining"
                    checked={searchOptions.sort.dateOfJoining.status}
                    onChange={(event) =>
                      setSearchOptions({
                        ...searchOptions,
                        sort: {
                          ...searchOptions.sort,
                          dateOfJoining: {
                            ...searchOptions.sort.dateOfJoining,
                            status: event.target.checked,
                          },
                        },
                      })
                    }
                    id="dateOfJoining"
                  />
                </Grid>
                <Grid item>
                  <label for="dateOfJoining">
                    <Typography>Date of Joining</Typography>
                  </label>
                </Grid>
                <Grid item>
                  <IconButton
                    disabled={!searchOptions.sort.dateOfJoining.status}
                    onClick={() => {
                      setSearchOptions({
                        ...searchOptions,
                        sort: {
                          ...searchOptions.sort,
                          dateOfJoining: {
                            ...searchOptions.sort.dateOfJoining,
                            desc: !searchOptions.sort.dateOfJoining.desc,
                          },
                        },
                      });
                    }}
                  >
                    {searchOptions.sort.dateOfJoining.desc ? (
                      <ArrowDownwardIcon />
                    ) : (
                      <ArrowUpwardIcon />
                    )}
                  </IconButton>
                </Grid>
              </Grid>
              <Grid
                item
                container
                xs={6}
                justifyContent="space-around"
                alignItems="center"
                style={{ border: "1px solid #D1D1D1", borderRadius: "5px" }}
              >
                <Grid item>
                  <Checkbox
                    name="rating"
                    checked={searchOptions.sort["jobApplicant.rating"].status}
                    onChange={(event) =>
                      setSearchOptions({
                        ...searchOptions,
                        sort: {
                          ...searchOptions.sort,
                          "jobApplicant.rating": {
                            ...searchOptions.sort[["jobApplicant.rating"]],
                            status: event.target.checked,
                          },
                        },
                      })
                    }
                    id="rating"
                  />
                </Grid>
                <Grid item>
                  <label for="rating">
                    <Typography>Rating</Typography>
                  </label>
                </Grid>
                <Grid item>
                  <IconButton
                    disabled={!searchOptions.sort["jobApplicant.rating"].status}
                    onClick={() => {
                      setSearchOptions({
                        ...searchOptions,
                        sort: {
                          ...searchOptions.sort,
                          "jobApplicant.rating": {
                            ...searchOptions.sort["jobApplicant.rating"],
                            desc: !searchOptions.sort["jobApplicant.rating"]
                              .desc,
                          },
                        },
                      });
                    }}
                  >
                    {searchOptions.sort["jobApplicant.rating"].desc ? (
                      <ArrowDownwardIcon />
                    ) : (
                      <ArrowUpwardIcon />
                    )}
                  </IconButton>
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          <Grid item>
            <Button
              variant="contained"
              color="primary"
              style={{ padding: "10px 50px" }}
              onClick={() => getData()}
            >
              Apply
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Modal>
  );
};

const ApplicationTile = (props) => {
  const classes = useStyles();
  const { application, getData } = props;
  const setPopup = useContext(SetPopupContext);
  const [open, setOpen] = useState(false);
  const [openEndJob, setOpenEndJob] = useState(false);
  const [rating, setRating] = useState(application.jobApplicant.rating);
  const [userEmail, setUserEmail] = useState('');
  const [userEmail1, setUserEmail1] = useState('');
  const [userName,setUserName] = useState('');
  const [phoneNumber,setPhoneNumber] = useState('');
  const [emailSent, setEmailSent] = useState(()=>{
    return localStorage.getItem(`emailSent_${application._id}`) === "true";
  });


  const appliedOn = new Date(application.dateOfApplication);
  const dateofJoining = new Date(application.dateOfJoining);

  const changeRating = () => {
    axios
      .put(
        apiList.rating,
        { rating: rating, applicantId: application.jobApplicant.userId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((response) => {
        console.log(response.data);
        setPopup({
          open: true,
          severity: "success",
          message: "Rating updated successfully",
        });
        // fetchRating();
        getData();
        setOpen(false);
      })
      .catch((err) => {
        // console.log(err.response);
        console.log(err);
        setPopup({
          open: true,
          severity: "error",
          message: err.response.data.message,
        });
        // fetchRating();
        getData();
        setOpen(false);
      });
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCloseEndJob = () => {
    setOpenEndJob(false);
  };

  const updateStatus = (status) => {
    const address = `${apiList.applications}/${application._id}`;
    const statusData = {
      status: status,
      dateOfJoining: new Date().toISOString(),
    };
    axios
      .put(address, statusData, {
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
        handleCloseEndJob();
        getData();
      })
      .catch((err) => {
        setPopup({
          open: true,
          severity: "error",
          message: err.response.data.message,
        });
        console.log(err.response);
        handleCloseEndJob();
      });
  };

  

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const userId = application.jobApplicant.userId;
        const url = `${apiList.user}/${userId}`;

        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });


        setUserEmail(response.data.email);
      } catch (error) {
        console.error('Error fetching user details:', error);

      }
    };

    if (application.jobApplicant.userId) {
      fetchUserDetails();
    }
  }, [application.jobApplicant.userId]);

  useEffect(() => {
    const fetchUserDetails1 = async () => {
      try {
        const userId = application.recruiterId;
        const url = `${apiList.user}/${userId}`;

        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });


        setUserEmail1(response.data.email);
        setUserName(response.data.name);
        setPhoneNumber(response.data.contactNumber);
      } catch (error) {
        console.error('Error fetching user details:', error);

      }
    };

    if (application.recruiterId) {
      fetchUserDetails1();
    }
  }, [application.recruiterId]);

  const getFormattedNumber = (contactNumber) => {
    const cleanedNumber = contactNumber.replace(/(?!^\+)\D/g, '');
    const countryCode = cleanedNumber.slice(0, -10);
    const lastTenDigits = cleanedNumber.slice(-10);
    return `${countryCode} ${lastTenDigits}`;
  };

  const sendEmail = () => {
    // console.log(userEmail,userEmail1)
    const skillsetString = application.job.skillsets.join(', ');
    const templateParams = {
      from_name: userName,
      from_email: userEmail1,
      to_name: application.jobApplicant.name,
      to_email:userEmail,
      position:application.job.title,
      company:application.job.companyName,
      jobType:application.job.jobType,
      duration: application.job.duration !== 0 ? `${application.job.duration} month(s)` : 'Flexible', 
      location:application.job.location,
      salary:application.job.salary,
      from_phoneNumber:getFormattedNumber(phoneNumber),
      skills: skillsetString,
      jobDescription:application.job.jobDescription ,
      dateOfJoining: formatISTDate(dateofJoining),
    };

    emailjs.send('service_fvk9p8i', 'template_yidqktp', templateParams, '4ePreozVVNpMYU4ey')
      .then((response) => {
        console.log('Email successfully sent!', response);
        setPopup({
          open: true,
          severity: "success",
          message: "Email sent successfully",
        });
        setEmailSent(true);
        localStorage.setItem(`emailSent_${application._id}`, "true"); // Persist status
      }, (err) => {
        console.error('Failed to send email. Error: ', err);
        setPopup({
          open: true,
          severity: "error",
          message: "Failed to send email",
        });
      });
  };

  


  return (
    <Paper className={classes.jobTileOuter} elevation={3}>
      <Grid container>
        <Grid
          item
          xs={2}
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Avatar
            src={`${application.jobApplicant.profile}`}
            className={classes.avatar}
          />
        </Grid>
        <Grid container item xs={7} spacing={1} direction="column">
          <Grid item>
            <Typography variant="h5">
              {application.jobApplicant.name}
            </Typography>
          </Grid>
          <Grid item>
            <Rating
              value={
                application.jobApplicant.rating !== -1
                  ? application.jobApplicant.rating
                  : null
              }
              readOnly
            />
          </Grid>
          <Grid item>Job Title: {application.job.title}</Grid>
          <Grid item>Role: {application.job.jobType}</Grid>
          <Grid item>Location: {application.job.location}</Grid>
          <Grid item>Company Name: {application.job.companyName}</Grid>
          <Grid item>Email: {userEmail}</Grid>
          <Grid item>Applied On: {formatISTDate(appliedOn)}</Grid>
          <Grid item>Phone number: {getFormattedNumber(application.jobApplicant.contactNumber)}</Grid>
          <Grid item>
            SOP: {" "}{application.sop !== "" ? application.sop : "Not Submitted"}
          </Grid>
          <Grid item>
            Skill sets:{" "} {application.jobApplicant.skills.map((skill,index) => (
              <Chip key={skill} label={skill} style={{ marginRight: "2px" }} />
            ))}
          </Grid>
        </Grid>
        <Grid item container direction="column" xs={3}>
          <Grid item>
            {!emailSent && (
              <Button
                variant="contained"
                color="primary"
                className={classes.statusBlock}
                onClick={sendEmail}
              >
                Send Email
              </Button>
            )}


          </Grid>
          <Grid item container xs>
            {/* {buttonSet[application.status]} */}
            <Button
              variant="contained"
              color="primary"
              className={classes.statusBlock}
              style={{
                background: "#09BC8A",
              }}
              onClick={() => {
                setOpenEndJob(true);
              }}
            >
              End Job
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              color="primary"
              className={classes.statusBlock}
              onClick={() => {
                setOpen(true);
              }}
            >
              Rate Applicant
            </Button>
          </Grid>
        </Grid>
      </Grid>
      <Modal open={open} onClose={handleClose} className={classes.popupDialog}>
        <Paper
          style={{
            padding: "20px",
            outline: "none",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            minWidth: "30%",
            alignItems: "center",
          }}
        >
          <Rating
            name="simple-controlled"
            style={{ marginBottom: "30px" }}
            value={rating === -1 ? null : rating}
            onChange={(event, newValue) => {
              setRating(newValue);
            }}
          />
          <Button
            variant="contained"
            color="primary"
            style={{ padding: "10px 50px" }}
            onClick={() => changeRating()}
          >
            Submit
          </Button>
        </Paper>
      </Modal>
      <Modal
        open={openEndJob}
        onClose={handleCloseEndJob}
        className={classes.popupDialog}
      >
        <Paper
          style={{
            padding: "20px",
            outline: "none",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            minWidth: "30%",
            alignItems: "center",
          }}
        >
          <Typography variant="h4" style={{ marginBottom: "10px" }}>
            Are you sure?
          </Typography>
          <Grid container justifyContent="center" spacing={5}>
            <Grid item>
              <Button
                variant="contained"
                color="secondary"
                style={{ padding: "10px 50px" }}
                onClick={() => {
                  updateStatus("finished");
                }}
              >
                Yes
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                color="primary"
                style={{ padding: "10px 50px" }}
                onClick={() => handleCloseEndJob()}
              >
                Cancel
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Modal>
    </Paper>
  );
};

const AcceptedApplicants = (props) => {
  const setPopup = useContext(SetPopupContext);
  const [applications, setApplications] = useState([]);
  const [filterOpen, setFilterOpen] = useState(false);
  const [searchOptions, setSearchOptions] = useState({
    sort: {
      "jobApplicant.name": {
        status: false,
        desc: false,
      },
      "job.title": {
        status: false,
        desc: false,
      },
      dateOfJoining: {
        status: true,
        desc: true,
      },
      "jobApplicant.rating": {
        status: false,
        desc: false,
      },
    },
  });

  useEffect(() => {
    getData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getFormattedNumber = (contactNumber) => {
    const cleanedNumber = contactNumber.replace(/(?!^\+)\D/g, '');
    const countryCode = cleanedNumber.slice(0, -10);
    const lastTenDigits = cleanedNumber.slice(-10);
    return `${countryCode} ${lastTenDigits}`;
  };

  const exportToCSV = () => {
    const csvHeader = "Sl. No,Applicant Name,Phone number,Date of Joining,Rating,Resume,Title,Company Name,Location,Role,Salary,Duration,Status,Skill sets\n";
    const csvRows = applications.map((app, index) => {
      const skillsetString = app.jobApplicant.skills.join(', ');
      const dateofJoining = formatISTDate(app.dateOfJoining);
      return [
        index + 1,
        app.jobApplicant.name,
        `${getFormattedNumber(app.jobApplicant.contactNumber)}`,
        dateofJoining,
        app.jobApplicant.rating,
        app.jobApplicant.resume,
        app.job.title,
        app.job.companyName,
        app.job.location,
        app.job.jobType,
        app.job.salary,
        app.job.duration !== 0 ? `${app.job.duration} months` : 'Flexible',
        app.status,
        `"${skillsetString}"`
      ].join(",");
    }).join("\n");

    const csvContent = csvHeader + csvRows;
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
    saveAs(blob, "applications_export.csv");
  };

  const exportToDocx = (applications) => {
    const doc = new Document({
      sections: [
        {
          properties: {},
          children: [
            new Paragraph({
              text: "Accepted Applicants Details",
              heading: "Heading1"
            }),
            new Table({
              rows: [
                new TableRow({
                  children: [
                    new TableCell({
                      children: [new Paragraph("Sl. No")],
                    }),
                    new TableCell({
                      children: [new Paragraph("Applicant Name")],
                    }),
                    new TableCell({
                      children: [new Paragraph("Phone Number")],
                    }),
                    new TableCell({
                      children: [new Paragraph("Date of Joining")],
                    }),
                    new TableCell({
                      children: [new Paragraph("Rating")],
                    }),
                    new TableCell({
                      children: [new Paragraph("Job Title")],
                    }),
                    new TableCell({
                      children: [new Paragraph("Company Name")],
                    }),
                    new TableCell({
                      children: [new Paragraph("Location")],
                    }),
                    new TableCell({
                      children: [new Paragraph("Role")],
                    }),
                    new TableCell({
                      children: [new Paragraph("Salary")],
                    }),
                    new TableCell({
                      children: [new Paragraph("Duration")],
                    }),
                    new TableCell({
                      children: [new Paragraph("Status")],
                    }),
                    new TableCell({
                      children: [new Paragraph("Skill Sets")],
                    }),
                  ],
                }),
                ...applications.map((app, index) => {
                  return new TableRow({
                    children: [
                      new TableCell({
                        children: [new Paragraph(`${index + 1}`)],
                      }),
                      new TableCell({
                        children: [new Paragraph(app.jobApplicant.name)],
                      }),
                      new TableCell({
                        children: [new Paragraph(`${getFormattedNumber(app.jobApplicant.contactNumber)}`)],
                      }),
                      new TableCell({
                        children: [new Paragraph(formatISTDate(app.dateOfJoining))],
                      }),
                      new TableCell({
                        children: [new Paragraph(`${app.jobApplicant.rating}`)],
                      }),
                      // new TableCell({
                      //   children: [new Paragraph(app.jobApplicant.resume)],
                      // }),
                      new TableCell({
                        children: [new Paragraph(app.job.title)],
                      }),
                      new TableCell({
                        children: [new Paragraph(app.job.companyName)],
                      }),
                      new TableCell({
                        children: [new Paragraph(app.job.location)],
                      }),
                      new TableCell({
                        children: [new Paragraph(app.job.jobType)],
                      }),
                      new TableCell({
                        children: [new Paragraph(`₹${app.job.salary}`)],
                      }),
                      new TableCell({
                        children: [new Paragraph(app.job.duration !== 0 ? `${app.job.duration} month(s)` : 'Flexible')],
                      }),
                      new TableCell({
                        children: [new Paragraph(app.status)],
                      }),
                      new TableCell({
                        children: [new Paragraph(app.jobApplicant.skills.join(', '))],
                      }),
                    ],
                  });
                }),
              ],
            }),
          ],
        },
      ],
    });

    // Pack and download the document
    Packer.toBlob(doc).then((blob) => {
      saveAs(blob, "accepted_applicants.docx");
    });
  };


  const getData = () => {
    let searchParams = [];
    searchParams = [...searchParams, `status=accepted`];

    let asc = [],
      desc = [];

    Object.keys(searchOptions.sort).forEach((obj) => {
      const item = searchOptions.sort[obj];
      if (item.status) {
        if (item.desc) {
          desc = [...desc, `desc=${obj}`];
        } else {
          asc = [...asc, `asc=${obj}`];
        }
      }
    });

    searchParams = [...searchParams, ...asc, ...desc];
    const queryString = searchParams.join("&");
    console.log(queryString);
    let address = `${apiList.applicants}`;
    if (queryString !== "") {
      address = `${address}?${queryString}`;
    }

    console.log(address);

    axios
      .get(address, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        console.log(response.data);
        setApplications(response.data);
      })
      .catch((err) => {
        console.log(err.response);
        // console.log(err.response.data);
        setApplications([]);
        setPopup({
          open: true,
          severity: "error",
          message: err.response.data.message,
        });
      });
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
          <Typography variant="h2">Employees</Typography>
        </Grid>
        <Grid item>
          <IconButton onClick={() => setFilterOpen(true)}>
            <FilterListIcon />
          </IconButton>
          <Button variant="contained" color="primary" onClick={exportToCSV} style={{marginRight:"10px"}}>
            Export to CSV
          </Button>
          <Button variant="contained" color="primary" onClick={() => exportToDocx(applications)}>
            Export to Word
          </Button>

        </Grid>
        <Grid
          container
          item
          xs
          direction="column"
          style={{ width: "100%" }}
          alignItems="stretch"
          justifyContent="center"
        >
          {applications.length > 0 ? (
            applications.map((obj) => (
              <Grid item key={obj._id}>
                {/* {console.log(obj)} */}
                <ApplicationTile application={obj} getData={getData} />
              </Grid>
            ))
          ) : (
            <Typography variant="h5" style={{ textAlign: "center" }}>
              No Applications Found
            </Typography>
          )}
        </Grid>
      </Grid>
      <FilterPopup
        open={filterOpen}
        searchOptions={searchOptions}
        setSearchOptions={setSearchOptions}
        handleClose={() => setFilterOpen(false)}
        getData={() => {
          getData();
          setFilterOpen(false);
        }}
      />
    </>
  );
};

export default AcceptedApplicants;
