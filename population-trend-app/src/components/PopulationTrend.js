import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import 'chart.js/auto';
import { Line } from 'react-chartjs-2';
import _debounce from 'lodash/debounce';
const PopulationTrend = () => {
  const [data, setData] = useState(null);
  const [startYear, setStartYear] = useState(2020);
  const [endYear, setEndYear] = useState(2020);
  const [error, setError] = useState(null);

  // Fetch API key from environment variable, default to the given one during assignment
  const API_KEY = process.env.API_KEY || '1d1bfc73-99b3-45c4-a804-35b0735ee120';

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Trend Graph for Afghanistan',
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            let tooltipLabels = []

            let phaseLabel = context.dataset.label || ''; // Display phase label
            tooltipLabels.push(phaseLabel)

            if (context.parsed.y !== null) {
              let populationNumberLabel = `Number of population: ${context.parsed.y.toLocaleString()}`; // Display population number
              tooltipLabels.push(populationNumberLabel)

              // Find the corresponding data entry for the hovered point
              const dataIndex = context.dataIndex;
              const dataEntry = data[dataIndex];

              // Add population percentage if available
              if (dataEntry && dataEntry.population_percentage) {
                let percentageLabel = `Percentage of population: ${(dataEntry.population_percentage / 1.0) * 100}%`; // Display population percentage
                tooltipLabels.push(percentageLabel)
              }
            }

            return tooltipLabels;
          }
        }
      }
    },
  };

  const handleStartYearChange = (event) => {
    setStartYear(parseInt(event.target.value));
  };

  const handleEndYearChange = (event) => {
    setEndYear(parseInt(event.target.value));
  };

  const generateDatasets = () => {
    if (!data) return [];

    const colors = {
      1: '#ffffff',     // Phase 1
      2: '#ffff00',     // Phase 2 (Yellow)
      3: '#ffa500',     // Phase 3 (Orange)
      4: '#ff0000',     // Phase 4 (Red)
      5: '#8b0000'      // Phase 5 (Dark Red)
    };

    const datasets = [];

    for (let phase = 1; phase <= 5; phase++) {
      const dataset = {
        label: `Phase ${phase}`,
        data: data.map(entry => entry[`phase${phase}_population`]),
        borderColor: colors[phase],
        backgroundColor: colors[phase],
        fill: false
      };

      datasets.push(dataset);
    }

    return datasets;
  };

  const fetchPopulationData = () => {
    axios.get(`https://api.ipcinfo.org/population?country=AF&start=${startYear}&end=${endYear}&key=${API_KEY}`)
    .then(response => {
      if (!response?.data) {
        setError(`Error fetching data for ${startYear}-${endYear}. Please try again later. Error: ` + error);
      } else {
        // Sort the data based on the analysis_date
        const sortedData = response.data.sort((a, b) => {
          const dateA = new Date(a.analysis_date);
          const dateB = new Date(b.analysis_date);
          return dateA - dateB;
        });
        setError(null);
        setData(sortedData);
      }
    })
    .catch(error => {
      if (error?.response?.status === 404) {
        setError(`The API returned 404, likely there is no data for ${startYear}-${endYear}. Please try with any other range`);
      } else {
        setError(`Error fetching data for ${startYear}-${endYear}. Please try again later. Error: ` + error);
      }
    });
  }

  const debouncedFetchPopulationData = _debounce(fetchPopulationData, 500);

  useEffect(() => {
    ChartJS.register(
        CategoryScale,
        LinearScale,
        PointElement,
        LineElement,
        Title,
        Tooltip,
        Legend
    );

    setError(null);

    debouncedFetchPopulationData();

    return () => {
      // clean up function
      debouncedFetchPopulationData.cancel();
    };
  }, [startYear, endYear, debouncedFetchPopulationData]);

  const chartData = { labels: data && data.map(entry => entry.analysis_date), datasets: generateDatasets() }

  return (
      <div style={{margin: '3%'}}>
        <h1>{data ? 'Afghanistan' : 'Loading data for Afghanistan...'}</h1>
        {error && <div style={{ color: 'red' }}>{error}</div>}
        <div>
          <label htmlFor="startYear">Start Year:</label>
          <input type="range" id="startYear" name="startYear" min={2000} max={endYear} value={startYear} onChange={handleStartYearChange} />
          <span>{startYear}</span>
        </div>
        <div style={{marginBottom: '3%'}}>
          <label htmlFor="endYear">End Year:</label>
          <input type="range" id="endYear" name="endYear" min={2000} max={2024} value={endYear} onChange={handleEndYearChange} />
          <span>{endYear}</span>
        </div>
        <div>
          <Line options={options}
                data={chartData}
                height="500rem"
          />
        </div>
      </div>
  );
};

export default PopulationTrend;
