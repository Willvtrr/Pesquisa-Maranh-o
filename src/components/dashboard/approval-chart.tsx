"use client";

import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { LuxuryCard } from './luxury-card';

interface ApprovalChartProps {
  data: { name: string; value: number }[];
}

const COLORS = {
  'Aprova': '#ea580c',
  'Desaprova': '#f87171',
  'NS/NR': '#e2e8f0'
};

export const ApprovalChart = ({ data }: ApprovalChartProps) => {
  return (
    <LuxuryCard title="Aprovação" subtitle="Sentimento do Eleitor">
      <div className="h-[220px] relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              innerRadius={65}
              outerRadius={90}
              paddingAngle={10}
              dataKey="value"
              animationBegin={0}
              animationDuration={1500}
              stroke="none"
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={COLORS[entry.name as keyof typeof COLORS] || '#f4f4f5'}
                  className="hover:opacity-80 transition-opacity cursor-pointer"
                />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ 
                borderRadius: '1.5rem', 
                border: 'none', 
                boxShadow: '0 10px 25px rgba(0, 0, 0, 0.05)',
                fontSize: '11px',
                fontWeight: 'bold',
                padding: '12px 16px'
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="grid grid-cols-3 gap-2 mt-4">
        {data.map((item) => (
          <div key={item.name} className="flex flex-col items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: COLORS[item.name as keyof typeof COLORS] }} />
            <span className="text-[10px] font-black text-zinc-400 uppercase tracking-tighter">{item.name}</span>
            <span className="text-xs font-mono font-bold text-zinc-900">
              {((item.value / data.reduce((a, b) => a + b.value, 0)) * 100).toFixed(0)}%
            </span>
          </div>
        ))}
      </div>
    </LuxuryCard>
  );
};
