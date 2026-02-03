import React from "react";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement, // 👈 Required for Pie Charts
  Title,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

const Dashboard = ({ distribution, isDarkMode }) => {
  // 1. Handle "No Data" State
  if (!distribution || Object.keys(distribution).length === 0) {
    return (
      <div className={`w-full h-96 rounded-2xl border flex flex-col items-center justify-center transition-colors
        ${isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-500' : 'bg-white border-slate-200 text-slate-400'}`}>
        <p className="font-medium">No chart data available</p>
        <p className="text-sm opacity-70">Upload a CSV to view equipment distribution</p>
      </div>
    );
  }

  const labels = Object.keys(distribution);
  const values = Object.values(distribution);

  const pieColors = [
    'rgba(255, 99, 132, 0.8)',
    'rgba(54, 162, 235, 0.8)',
    'rgba(255, 206, 86, 0.8)',
    'rgba(75, 192, 192, 0.8)',
    'rgba(153, 102, 255, 0.8)',
    'rgba(255, 159, 64, 0.8)',
  ];

  const chartData = {
    labels: labels,
    datasets: [
      {
        label: "Count",
        data: values,
        backgroundColor: isDarkMode ? "rgba(96, 165, 250, 0.8)" : "rgba(37, 99, 235, 0.8)", // Single color for Bar
        borderColor: isDarkMode ? "#60a5fa" : "#2563eb",
        borderWidth: 1,
        borderRadius: 6,
      },
    ],
  };

  const pieData = {
    labels: labels,
    datasets: [
      {
        data: values,
        backgroundColor: pieColors,
        borderColor: isDarkMode ? "#1e293b" : "#ffffff",
        borderWidth: 2,
      },
    ],
  };

  const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { 
        display: false, // Hide legend for Bar
        labels: { color: isDarkMode ? "#cbd5e1" : "#334155" }
      },
      title: {
        display: true,
        color: isDarkMode ? "#e2e8f0" : "#1e293b",
        font: { size: 16, weight: 'bold' }
      },
      tooltip: {
        backgroundColor: isDarkMode ? "#1e293b" : "#ffffff",
        titleColor: isDarkMode ? "#ffffff" : "#0f172a",
        bodyColor: isDarkMode ? "#cbd5e1" : "#334155",
        borderColor: isDarkMode ? "#334155" : "#e2e8f0",
        borderWidth: 1,
      }
    },
    scales: {
      x: { ticks: { color: isDarkMode ? "#94a3b8" : "#64748b" }, grid: { display: false } },
      y: { ticks: { color: isDarkMode ? "#94a3b8" : "#64748b" }, grid: { color: isDarkMode ? "#334155" : "#e2e8f0" } }
    }
  };

  const pieOptions = {
    ...commonOptions,
    scales: {}, 
    plugins: {
      ...commonOptions.plugins,
      legend: {
        display: true,
        position: 'right',
        labels: { color: isDarkMode ? "#cbd5e1" : "#334155" }
      },
      title: { ...commonOptions.plugins.title, text: "Distribution Share" }
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      
      {/* 📊 BAR CHART CARD */}
      <div className={`w-full h-96 p-6 rounded-2xl border transition-colors
        ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
        <Bar 
          data={chartData} 
          options={{...commonOptions, plugins: {...commonOptions.plugins, title: { text: "Equipment Count (Bar)", display: true }}}} 
        />
      </div>

      {/* 🥧 PIE CHART CARD */}
      <div className={`w-full h-96 p-6 rounded-2xl border transition-colors
        ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
        <Pie 
          data={pieData} 
          options={pieOptions} 
        />
      </div>

    </div>
  );
};

export default Dashboard;