import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import axios from 'axios';
import apiList  from '../../lib/apiList'; // Assuming apiConfig is the file name where apiList is defined


const ApplicationStatusPieChart = () => {

    const [applicationData, setApplicationData] = useState([]);
    useEffect(() => {
        axios.get(apiList.applications, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`, // Replace with your actual token retrieval method
            },
        })
            .then((response) => {
                setApplicationData(response.data);
                console.log(response.data)
            })
            .catch((error) => {
                console.error('Error fetching application data:', error);
            });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const processData = (data) => {
        const statusCounts = { Accepted: 0, Rejected: 0, Pending: 0 };

        data.forEach(app => {
            switch (app.status) {
                case 'accepted':
                    statusCounts.Accepted += 1;
                    break
                case 'finished':
                    statusCounts.Accepted += 1;
                    break;
                case 'rejected':
                    statusCounts.Rejected += 1;
                    break;
                case 'cancelled':
                    statusCounts.Rejected += 1;
                    break;
                case 'pending':
                    statusCounts.Pending += 1;
                    break
                case 'shortlisted':
                    statusCounts.Pending += 1;
                    break;
                default:
                    // console.warn('Unknown status:', app.status);
            }
        });

        return [
            { name: 'Accepted', value: statusCounts.Accepted },
            { name: 'Rejected', value: statusCounts.Rejected },
            { name: 'Pending', value: statusCounts.Pending },
        ];
    };

    const chartData = processData(applicationData);

    useEffect(() => {
        console.log("Processed Chart Data:", chartData);
    }, [chartData]);


    const COLORS = ['#0088FE', '#FF8042', '#FFBB28'];

    return (
        <PieChart width={800} height={500}>
            <Pie
                data={chartData}
                cx={400}
                cy={250}
                outerRadius={150}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            >
                {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
            </Pie>
            <Tooltip />
            <Legend align="center" verticalAlign="bottom" layout="horizontal" />
        </PieChart>
    );
};

export default ApplicationStatusPieChart;
