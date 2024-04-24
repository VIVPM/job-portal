// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import apiList from '../../lib/apiList';

// const JobStats = () => {
//     const [jobs, setJobs] = useState([]);
//     const [error, setError] = useState('');

//     const fetchJobs = async () => {
//         try {
//             const response = await axios.get(`${apiList.jobs}`, {
//                 headers: {
//                     Authorization: `Bearer ${localStorage.getItem("token")}`,
//                 },
//             }); 
//             console.log(response.data);
//             setJobs(response.data);
//         } catch (error) {
//             setError('Failed to fetch data');
//             console.error('Error fetching jobs:', error);
//         }
//     };

//     useEffect(() => {
//         fetchJobs();
//     }, []);

//     const getSalaryStats = () => {
//         const salaries = jobs.map(job => job.salary).filter(Boolean);
//         const highest = Math.max(...salaries);
//         const lowest = Math.min(...salaries);
//         const average = salaries.reduce((acc, cur) => acc + cur, 0) / salaries.length || 0;

//         return { highest, lowest, average: average.toFixed(2) };
//     };

//     if (error) {
//         return <p>{error}</p>;
//     }

//     const { highest, lowest, average } = getSalaryStats();

//     return (
//         <div>
//             <h1>Job Salary Statistics</h1>
//             <p>Highest Salary: &#8377; {highest}</p>
//             <p>Lowest Salary: &#8377; {lowest}</p>
//             <p>Average Salary: &#8377; {average}</p>
//         </div>
//     );
// };

// export default JobStats;
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import apiList from '../../lib/apiList';
import { Grid, TextField, Button } from '@material-ui/core';

const JobStats = () => {
    const [jobs, setJobs] = useState([]);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [error, setError] = useState('');
    const [stats, setStats] = useState({ highest: '', lowest: '', average: '' }); // State to hold statistics

    const fetchJobs = async () => {
        try {
            const response = await axios.get(`${apiList.jobs}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            setJobs(response.data);
        } catch (error) {
            setError('Failed to fetch data');
            console.error('Error fetching jobs:', error);
        }
    };

    useEffect(() => {
        fetchJobs();
    }, []);

    const calculateSalaryStats = () => {
        const filteredJobs = jobs.filter(job => {
            const jobDate = new Date(job.dateOfPosting);
            const start = new Date(startDate);
            const end = new Date(endDate);
            return jobDate >= start && jobDate <= end;
        });
        const salaries = filteredJobs.map(job => job.salary).filter(Boolean);
        if (salaries.length === 0) {
            setStats({ highest: 'N/A', lowest: 'N/A', average: 'N/A' });
            return;
        }
        const highest = Math.max(...salaries);
        const lowest = Math.min(...salaries);
        const average = salaries.reduce((acc, cur) => acc + cur, 0) / salaries.length;

        setStats({
            highest,
            lowest,
            average: average.toFixed(2)
        });
    };

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <Grid container spacing={3} style={{ padding: 20 }}>
            <Grid item xs={12} md={6}>
                <TextField
                    label="Start Date"
                    type="date"
                    value={startDate}
                    onChange={e => setStartDate(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                />
            </Grid>
            <Grid item xs={12} md={6}>
                <TextField
                    label="End Date"
                    type="date"
                    value={endDate}
                    onChange={e => setEndDate(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                />
            </Grid>
            <Grid item xs={12}>
                <Button variant="contained" color="primary" onClick={calculateSalaryStats}>
                    Calculate Stats
                </Button>
            </Grid>
            <Grid item xs={12}>
                {stats.highest ? (
                    <div>
                        <p>Highest Salary: &#8377; {stats.highest}</p>
                        <p>Lowest Salary: &#8377; {stats.lowest}</p>
                        <p>Average Salary: &#8377; {stats.average}</p>
                    </div>
                ) : (
                    <p>No stats to display. Please select dates and click 'Calculate Stats'.</p>
                )}
            </Grid>
        </Grid>
    );
};

export default JobStats;
