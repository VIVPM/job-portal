// import React, { useState, useEffect } from 'react';
// import { Grid, TextField, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button } from '@material-ui/core';
// import axios from 'axios';
// import apiList from '../../lib/apiList';

// const JobTableWithDateFilter = () => {
//     const [jobs, setJobs] = useState([]);
//     const [fromDate, setFromDate] = useState('');
//     const [toDate, setToDate] = useState('');

//     useEffect(() => {
//         fetchJobs();
//     }, []);

//     const fetchJobs = () => {
//         axios.get(apiList.jobs, {
//             headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
//         })
//             .then((response) => {
//                 setJobs(response.data);
//             })
//             .catch((error) => {
//                 console.error('Error fetching jobs', error);
//             });
//     };

//     const filterJobsByDate = () => {
//         const filteredJobs = jobs.filter(job => {
//             const postingDate = new Date(job.dateOfPosting);
//             return postingDate >= new Date(fromDate) && postingDate <= new Date(toDate);
//         });
//         setJobs(filteredJobs);
//     };

//     return (
//         <Grid container spacing={3} style={{ padding: 20 }}>
//             <Grid item xs={12} md={6}>
//                 <TextField
//                     label="From Date"
//                     type="date"
//                     value={fromDate}
//                     onChange={(e) => setFromDate(e.target.value)}
//                     InputLabelProps={{
//                         shrink: true,
//                     }}
//                     fullWidth
//                 />
//             </Grid>
//             <Grid item xs={12} md={6}>
//                 <TextField
//                     label="To Date"
//                     type="date"
//                     value={toDate}
//                     onChange={(e) => setToDate(e.target.value)}
//                     InputLabelProps={{
//                         shrink: true,
//                     }}
//                     fullWidth
//                 />
//             </Grid>
//             <Grid item xs={12}>
//                 <Button variant="contained" color="primary" onClick={filterJobsByDate}>
//                     Filter Jobs
//                 </Button>
//             </Grid>
//             <Grid item xs={12}>
//                 <TableContainer component={Paper}>
//                     <Table>
//                         <TableHead>
//                             <TableRow>
//                                 <TableCell>Sl. No</TableCell>
//                                 <TableCell>Title</TableCell>
//                                 <TableCell>Salary</TableCell>
//                                 <TableCell>Location</TableCell>
//                                 <TableCell>Company Name</TableCell>
//                                 <TableCell>Skillsets</TableCell>
//                             </TableRow>
//                         </TableHead>
//                         <TableBody>
//                             {jobs.map((job, index) => (
//                                 <TableRow key={job._id}>
//                                     <TableCell>{index + 1}</TableCell>
//                                     <TableCell>{job.title}</TableCell>
//                                     <TableCell>{job.salary}</TableCell>
//                                     <TableCell>{job.location}</TableCell>
//                                     <TableCell>{job.companyName}</TableCell>
//                                     <TableCell>{job.skillsets.join(', ')}</TableCell>
//                                 </TableRow>
//                             ))}
//                         </TableBody>
//                     </Table>
//                 </TableContainer>
//             </Grid>
//         </Grid>
//     );
// };

// export default JobTableWithDateFilter;
import React, { useState, useEffect } from 'react';
import { Grid, TextField, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button } from '@material-ui/core';
import axios from 'axios';
import apiList from '../../lib/apiList';
import { saveAs } from 'file-saver';

const JobTableWithDateFilter = () => {
    const [jobs, setJobs] = useState([]);
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = () => {
        axios.get(apiList.jobs, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        })
            .then((response) => {
                setJobs(response.data);
            })
            .catch((error) => {
                console.error('Error fetching jobs', error);
            });
    };

    const exportToCSV = () => {
        const csvHeader = "Sl. No,Title,Salary,Location,Company Name,Role,Duration,Number of Applicants,Remaining Positions,Skill sets\n";
        const csvRows = jobs.map((job, index) => {

            const skillsetString = job.skillsets.join(', ');

            
            return [
                index + 1,
                job.title,
                job.salary,
                job.location,
                job.companyName,
                job.jobType,
                job.duration !== 0 ? `${job.duration} month(s)` : 'Flexible',
                job.maxApplicants,
                job.maxPositions - job.acceptedCandidates,
                `"${skillsetString}"` // Encapsulate in quotes to handle commas in skills
            ].join(",");
        }).join("\n");

        const csvContent = csvHeader + csvRows;
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
        saveAs(blob, "jobs_export.csv");
    };


    const filterJobsByDate = () => {
        const filteredJobs = jobs.filter(job => {
            const postingDate = new Date(job.dateOfPosting);
            return postingDate >= new Date(fromDate) && postingDate <= new Date(toDate);
        });
        setJobs(filteredJobs);
    };


    return (
        <Grid container spacing={3} style={{ padding: 20 }}>
            <Grid item xs={12} md={6}>
                <TextField
                    label="From Date"
                    type="date"
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                    InputLabelProps={{
                        shrink: true,
                    }}
                    fullWidth
                />
            </Grid>
            <Grid item xs={12} md={6}>
                <TextField
                    label="To Date"
                    type="date"
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                    InputLabelProps={{
                        shrink: true,
                    }}
                    fullWidth
                />
            </Grid>
            <Grid item xs={12}>
                <Button variant="contained" color="primary" onClick={filterJobsByDate}>
                    Filter Jobs
                </Button>
                <Button variant="contained" color="secondary" onClick={exportToCSV} style={{ marginLeft: "10px" }}>
                    Export to CSV
                </Button>
            </Grid>
            <Grid item xs={12}>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Sl. No</TableCell>
                                <TableCell>Title</TableCell>
                                <TableCell>Salary</TableCell>
                                <TableCell>Location</TableCell>
                                <TableCell>Company Name</TableCell>
                                <TableCell>Role</TableCell>
                                <TableCell>Duration</TableCell>
                                <TableCell>Number of Applicants</TableCell>
                                <TableCell>Remaining Positions</TableCell>
                                <TableCell>Skill sets</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {jobs.map((job, index) => (
                                <TableRow key={job._id}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{job.title}</TableCell>
                                    <TableCell>{job.salary}</TableCell>
                                    <TableCell>{job.location}</TableCell>
                                    <TableCell>{job.companyName}</TableCell>
                                    <TableCell>{job.jobType}</TableCell>
                                    <TableCell>{job.duration !== 0 ? `${job.duration} months` : 'Flexible'}</TableCell>
                                    <TableCell>{job.maxApplicants}</TableCell>
                                    <TableCell>{job.maxPositions - job.acceptedCandidates}</TableCell>
                                    <TableCell>{job.skillsets.join(', ')}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Grid>
        </Grid>
    );
};

export default JobTableWithDateFilter;
