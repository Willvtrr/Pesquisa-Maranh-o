
"use client";

import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { NeomorphicCard } from '../ui/neomorphic-card';

interface ApprovalChartProps {
  data: { name: string; value: number }[];
}

const COLORS = {
  'Aprova': '#16A34A',
  'Desaprova': '#DC2626',
  'NS/NR': '#9CA3AF'
};

export const ApprovalChart = ({ data }: ApprovalChartProps) => {
  return (
    <NeomorphicCard className="h-[400px] flex flex-col">
      <h3 className="text-lg font-bold mb-4 font-headline text-primary">Índice de Aprovação</h3>
      <div className="flex-1 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              innerRadius={60}
              outerRadius={100}
              paddingAngle={5}
              dataKey="value"
              animationBegin={0}
              animationDuration={1500}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[entry.name as keyof typeof COLORS] || '#0095A8'} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
            />
            <Legend verticalAlign="bottom" height={36} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </NeomorphicCard>
  );
};
