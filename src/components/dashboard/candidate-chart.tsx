"use client";

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { LuxuryCard } from './luxury-card';

interface CandidateChartProps {
  data: { name: string; value: number }[];
}

const COLORS = ['#ea580c', '#fb923c', '#fdba74', '#fed7aa', '#cbd5e1', '#e2e8f0'];

export const CandidateChart = ({ data }: CandidateChartProps) => {
  return (
    <LuxuryCard 
      title="CORRIDA PRESIDENCIAL" 
      subtitle="Intenção de Voto (Estimulada)" 
      className="lg:col-span-2"
    >
      <div className="h-[280px] mt-6">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ left: 10, right: 30, top: 0, bottom: 0 }}>
            <XAxis type="number" hide />
            <YAxis 
              dataKey="name" 
              type="category" 
              width={100} 
              axisLine={false} 
              tickLine={false}
              tick={{ fill: '#71717a', fontSize: 10, fontWeight: 800 }}
            />
            <Tooltip 
              cursor={{ fill: 'rgba(244, 244, 245, 0.6)' }}
              contentStyle={{ 
                borderRadius: '1.5rem', 
                border: 'none', 
                boxShadow: '0 10px 25px rgba(0, 0, 0, 0.05)',
                fontSize: '11px',
                padding: '12px 16px'
              }}
            />
            <Bar 
              dataKey="value" 
              radius={[0, 20, 20, 0]} 
              barSize={32}
              animationDuration={2000}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </LuxuryCard>
  );
};
