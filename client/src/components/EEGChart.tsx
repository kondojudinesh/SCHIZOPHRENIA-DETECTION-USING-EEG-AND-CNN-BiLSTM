import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Label } from 'recharts';

interface EEGData {
  timestamp: number;
  channels: number[];
}

interface EEGChartProps {
  data: EEGData[];
}

const EEGChart = ({ data }: EEGChartProps) => {
  const channelColors = [
    '#3B82F6', '#14B8A6', '#F59E0B', '#EF4444',
    '#8B5CF6', '#10B981', '#F97316', '#EC4899'
  ];

  // Transform incoming EEGData into recharts-friendly format
  const chartData = data.map((point, index) => ({
    time: index,
    ...point.channels.reduce(
      (acc, value, channelIndex) => ({
        ...acc,
        [`channel${channelIndex}`]: value,
      }),
      {}
    ),
  }));

  const numChannels = data[0]?.channels.length || 8;

  return (
    <div className="space-y-6">
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={chartData} margin={{ top: 10, right: 30, left: 20, bottom: 30 }}>
          <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
          <XAxis 
            dataKey="time"
            tick={{ fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          >
            <Label 
              value="Time (s)" 
              offset={-10} 
              position="insideBottom" 
              style={{ fontSize: '12px', fill: '#6B7280' }} 
            />
          </XAxis>

          <YAxis 
            tick={{ fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            domain={['auto', 'auto']}
          >
            <Label 
              value="Amplitude (µV) / Channels" 
              angle={-90} 
              position="insideLeft" 
              style={{ fontSize: '12px', fill: '#6B7280' }} 
            />
          </YAxis>

          <Tooltip 
            contentStyle={{ fontSize: '12px' }}
            formatter={(value, name) => [`${value.toFixed(2)}`, name]}
          />

          {Array(numChannels).fill(0).map((_, index) => (
            <Line
              key={index}
              type="monotone"
              dataKey={`channel${index}`}
              stroke={channelColors[index % channelColors.length]}
              strokeWidth={1.2}
              dot={false}
              isAnimationActive={false}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>

      {/* Channel Legend */}
      <div className="grid grid-cols-4 gap-3">
        {Array(numChannels).fill(0).map((_, index) => (
          <div key={index} className="flex items-center space-x-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: channelColors[index % channelColors.length] }}
            />
            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
              Channel {index + 1}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EEGChart;