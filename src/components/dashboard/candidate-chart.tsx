
"use client";

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { NeomorphicCard } from '../ui/neomorphic-card';

interface CandidateChartProps {
  data: { name: string; value: number }[];
}

const PASTEL_COLORS = [
  '#A8D8EA', '#AA96DA', '#FCBAD3', '#FFFFD2', 
  '#B2E2F2', '#E2F0CB', '#FCE38A', '#95E1D3', 
  '#FFD3B6', '#FFAAA5'
];

export const CandidateChart = ({ data }: CandidateChartProps) => {
  return (
    <NeomorphicCard className="h-[400px] flex flex-col">
      <h3 className="text-lg font-bold mb-4 font-headline text-primary">Intenção de Voto</h3>
      <div className="flex-1 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E0E5EC" />
            <XAxis type="number" hide />
            <YAxis 
              dataKey="name" 
              type="category" 
              width={100} 
              axisLine={false} 
              tickLine={false}
              tick={{ fill: '#1B3A5C', fontSize: 12, fontWeight: 500 }}
            />
            <Tooltip 
              cursor={{ fill: 'rgba(27, 58, 92, 0.05)' }}
              contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
            />
            <Bar dataKey="value" radius={[0, 4, 4, 0]} animationDuration={1500}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={PASTEL_COLORS[index % PASTEL_COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </NeomorphicCard>
  );
};
