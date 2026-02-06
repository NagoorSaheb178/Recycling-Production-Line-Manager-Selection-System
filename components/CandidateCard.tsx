
import React from 'react';
import { Card, Image, Text, Badge, Group, Button, Box } from '@mantine/core';
import { CandidateWithScore } from '../types';

interface Props {
  candidate: CandidateWithScore;
  onEvaluate: () => void;
  onSelect: () => void;
  onShare: () => void;
  isSelected: boolean;
  isEvaluating: boolean;
}

const CandidateCard: React.FC<Props> = ({ candidate, onEvaluate, onSelect, onShare, isSelected, isEvaluating }) => {
  return (
    <Card 
      padding="lg" 
      radius="md" 
      withBorder 
      className={`transition-all duration-300 hover:shadow-lg ${isSelected ? 'ring-2 ring-emerald-500 border-transparent' : 'border-slate-200'}`}
    >
      <Card.Section>
        <div className="h-48 overflow-hidden relative group cursor-pointer" onClick={onSelect}>
          <Image 
            src={candidate.avatar} 
            height={192} 
            alt={candidate.name} 
            className="transition-transform duration-500 group-hover:scale-105"
          />
          {isSelected && (
            <div className="absolute top-2 right-2 bg-emerald-500 text-white p-1 rounded-full shadow-md">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
          )}
        </div>
      </Card.Section>

      <div className="mt-4 mb-4">
        <Text fw={700} size="lg" className="leading-tight">{candidate.name}</Text>
        <Text size="sm" c="dimmed">{candidate.previousRole}</Text>
      </div>

      <Group gap="xs" mb="lg">
        <Badge variant="dot" color="green" size="md" className="normal-case font-medium">
          {candidate.experienceYears} years
        </Badge>
        <Badge variant="outline" color="gray" size="md" className="normal-case font-medium text-slate-500 border-slate-300">
          {candidate.skills[0]}
        </Badge>
      </Group>

      {/* Score Blocks */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        <div className="bg-[#1e293b] rounded-md p-2 flex justify-between items-center text-white">
          <span className="text-xs font-medium">Crisis</span>
          <span className="text-sm font-bold text-emerald-400">{(candidate.scores.crisisManagement/10).toFixed(1)}</span>
        </div>
        <div className="bg-[#334155] rounded-md p-2 flex justify-between items-center text-white">
          <span className="text-xs font-medium">Sustain</span>
          <span className="text-sm font-bold text-emerald-400">{(candidate.scores.sustainabilityKnowledge/10).toFixed(1)}</span>
        </div>
      </div>

      <Group grow>
        <Button 
          size="xs" 
          color="dark" 
          onClick={(e) => { e.stopPropagation(); onEvaluate(); }} 
          loading={isEvaluating}
        >
          Evaluate
        </Button>
        <Button 
          size="xs" 
          variant="default" 
          onClick={(e) => { e.stopPropagation(); onSelect(); }}
        >
          View Details ▸
        </Button>
      </Group>
    </Card>
  );
};

export default CandidateCard;
