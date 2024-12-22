import React from 'react';
import Plot from 'react-plotly.js';

const SentimentChart = ({ sentimentData }) => {
  // Prepare data for different charts
  const chartData = sentimentData.map(item => ({
    date: new Date(item.timestamp).toLocaleDateString(),
    sentiment: item.sentiment,
    confidence: item.confidence,
  }));

  // Sentiment distribution (positive, negative counts)
  const sentimentDistribution = sentimentData.reduce(
    (acc, item) => {
      if (item.sentiment === 'POSITIVE') acc.positive++;
      else if (item.sentiment === 'NEGATIVE') acc.negative++;
      return acc;
    },
    { positive: 0, negative: 0 }
  );

  // Sentiment confidence (average)
  const averageConfidence = {
    positive: sentimentData.filter(item => item.sentiment === 'POSITIVE').length > 0
      ? sentimentData.filter(item => item.sentiment === 'POSITIVE').reduce((acc, item) => acc + item.confidence, 0) / sentimentData.filter(item => item.sentiment === 'POSITIVE').length
      : 0,
    negative: sentimentData.filter(item => item.sentiment === 'NEGATIVE').length > 0
      ? sentimentData.filter(item => item.sentiment === 'NEGATIVE').reduce((acc, item) => acc + item.confidence, 0) / sentimentData.filter(item => item.sentiment === 'NEGATIVE').length
      : 0,
  };

  // Grouping data by date for sentiment over time
  const sentimentByDate = sentimentData.reduce((acc, item) => {
    const date = new Date(item.timestamp).toLocaleDateString();
    if (!acc[date]) acc[date] = { positive: 0, negative: 0 };
    if (item.sentiment === 'POSITIVE') acc[date].positive++;
    if (item.sentiment === 'NEGATIVE') acc[date].negative++;
    return acc;
  }, {});

  const dates = Object.keys(sentimentByDate);
  const positiveCounts = dates.map(date => sentimentByDate[date].positive);
  const negativeCounts = dates.map(date => sentimentByDate[date].negative);

  return (
    <div className="chart-container">
      {/* Line Chart for Sentiment Over Time */}
      <div className="chart-item">
        <Plot
          data={[
            {
              x: dates,
              y: positiveCounts,
              type: 'scatter',
              mode: 'lines+markers',
              marker: { color: 'green' },
              name: 'Positive Sentiment',
            },
            {
              x: dates,
              y: negativeCounts,
              type: 'scatter',
              mode: 'lines+markers',
              marker: { color: 'red' },
              name: 'Negative Sentiment',
            },
          ]}
          layout={{
            width: '100%',
            height: 300,
            title: 'Sentiment Distribution Over Time',
            xaxis: { title: 'Date' },
            yaxis: { title: 'Count' },
          }}
        />
      </div>

      {/* Pie Chart for Sentiment Proportions */}
      <div className="chart-item">
        <Plot
          data={[
            {
              labels: ['Positive', 'Negative'],
              values: [sentimentDistribution.positive, sentimentDistribution.negative],
              type: 'pie',
              marker: { colors: ['#66b3ff', '#ff6666'] },
            },
          ]}
          layout={{
            width: '100%',
            height: 300,
            title: 'Sentiment Proportions',
          }}
        />
      </div>

      {/* Bar Chart for Sentiment Counts */}
      <div className="chart-item">
        <Plot
          data={[
            {
              x: ['Positive', 'Negative'],
              y: [sentimentDistribution.positive, sentimentDistribution.negative],
              type: 'bar',
              marker: { color: ['#66b3ff', '#ff6666'] },
            },
          ]}
          layout={{
            width: '100%',
            height: 300,
            title: 'Sentiment Counts',
            xaxis: { title: 'Sentiment' },
            yaxis: { title: 'Count' },
          }}
        />
      </div>

      {/* Heatmap for Sentiment Confidence Over Time */}
      <div className="chart-item">
        <Plot
          data={[
            {
              x: chartData.map(item => item.date),
              y: chartData.map(item => item.sentiment),
              z: chartData.map(item => item.confidence),
              type: 'heatmap',
              colorscale: 'YlGnBu',
              colorbar: {
                title: 'Confidence Score',
              },
            },
          ]}
          layout={{
            width: '100%',
            height: 300,
            title: 'Sentiment Confidence Over Time',
            xaxis: { title: 'Date' },
            yaxis: {
              title: 'Sentiment Type',
              categoryorder: 'array',
              categoryarray: ['POSITIVE', 'NEGATIVE'],
            },
          }}
        />
      </div>
    </div>
  );
};

export default SentimentChart;
