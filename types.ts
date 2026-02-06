
export interface Candidate {
  id: string;
  name: string;
  avatar: string;
  experienceYears: number;
  skills: string[];
  bio: string;
  previousRole: string;
}

export interface Evaluation {
  candidateId: string;
  crisisManagement: number;
  sustainabilityKnowledge: number;
  teamMotivation: number;
  aiSummary: string;
}

export interface CandidateWithScore extends Candidate {
  scores: Evaluation;
  totalScore: number;
  rank: number;
}
