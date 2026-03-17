"use client";

import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { BentoCard } from './bento-card';

interface ApprovalChartProps {
  data: { name: string; value: number }[];
}

const COLORS = {
  'Aprova': '#ea580c',
  'Desaprova': '#ef4444',
  'NS/NR': '#94a3b8'
};

export const ApprovalChart = ({ data }: ApprovalChartProps) => {
  return (
    <BentoCard title="Aprovação" subtitle="Índice de Confiança">
      <div className="h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              innerRadius={50}
              outerRadius={80}
              paddingAngle={8}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[entry.name as keyof typeof COLORS] || '#f4f4f5'} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ 
                borderRadius: '1.5rem', 
                border: 'none', 
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05)',
                fontSize: '10px',
                fontWeight: 'bold'
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="flex justify-center gap-4 mt-2">
        {data.map((item) => (
          <div key={item.name} className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[item.name as keyof typeof COLORS] }} />
            <span className="text-[10px] font-bold text-zinc-400 uppercase">{item.name}</span>
          </div>
        ))}
      </div>
    </BentoCard>
  );
};
