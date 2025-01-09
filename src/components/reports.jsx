// src/components/Reports.jsx
import React from 'react';
import { Bar } from 'react-chartjs-2';

const Reports = ({ data }) => {
  const chartData = {
    labels: data.labels,
    datasets: [
      {
        label: 'Expenses',
        data: data.values,
        backgroundColor: 'rgba(75,192,192,0.6)',
      },
    ],
  };

  return (
    <div className="reports">
      <h2>Reports</h2>
      <Bar data={chartData} />
    </div>
  );
};

export default Reports;
