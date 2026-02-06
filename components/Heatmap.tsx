
import React from 'react';
import { CandidateWithScore } from '../types';

interface Props {
  candidates: CandidateWithScore[];
}

const Heatmap: React.FC<Props> = ({ candidates }) => {
  const facilities = ['Plant Alpha', 'Plant Beta', 'Plant Gamma'];
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
      {facilities.map((facility, fIdx) => (
        <div key={facility} className="space-y-5">
          <div className="flex items-center justify-between px-2">
            <span className="text-[11px] font-black text-slate-300 uppercase tracking-[0.25em]">{facility}</span>
            <span className="text-[10px] font-black text-emerald-600">Active</span>
          </div>
          <div className="grid grid-cols-4 gap-3 p-6 bg-slate-50/50 rounded-[2.5rem] border border-slate-100/50">
            {Array.from({ length: 12 }).map((_, i) => {
              const idx = fIdx * 12 + i;
              const cand = candidates[idx];
              let color = 'bg-slate-200/50 opacity-20';
              let scale = 'hover:scale-100';

              if (cand) {
                const score = cand.totalScore;
                scale = 'hover:scale-110 cursor-pointer shadow-sm';
                if (score >= 85) color = 'bg-emerald-600 shadow-lg shadow-emerald-900/10';
                else if (score >= 70) color = 'bg-emerald-300';
                else color = 'bg-emerald-100';
              }

              return (
                <div 
                  key={idx} 
                  className={`aspect-square rounded-xl transition-all duration-500 ${color} ${scale}`}
                  title={cand ? `${cand.name}: ${cand.totalScore.toFixed(0)} Index` : 'Awaiting Deployment'}
                />
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Heatmap;
