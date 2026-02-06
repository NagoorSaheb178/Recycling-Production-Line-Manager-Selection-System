
import { Candidate, Evaluation } from './types';

// Expanded Skill Pool
const skillsPool = [
  "Lean Manufacturing", "OSHA Compliance", "Waste Segregation", "Team Leadership", 
  "Six Sigma Black Belt", "ISO 14001", "Chemical Handling", "PLC Troubleshooting", 
  "Budget Management", "Supply Chain Optimization", "Environmental Safety", "Robotics Integration",
  "Conflict Resolution", "KPI Tracking", "Inventory Control", "Circular Economy Strategies"
];

// Roles mapped to specific primary skills for realism
const roleConfig: Record<string, string[]> = {
  "Plant Supervisor": ["Team Leadership", "Conflict Resolution", "KPI Tracking"],
  "Operations Lead": ["Lean Manufacturing", "Six Sigma Black Belt", "Budget Management"],
  "Logistics Coordinator": ["Supply Chain Optimization", "Inventory Control", "Waste Segregation"],
  "Safety Officer": ["OSHA Compliance", "Environmental Safety", "Chemical Handling"],
  "Floor Manager": ["Team Leadership", "Waste Segregation", "KPI Tracking"],
  "Recycling Supervisor": ["Circular Economy Strategies", "Waste Segregation", "ISO 14001"],
  "Process Engineer": ["PLC Troubleshooting", "Robotics Integration", "Six Sigma Black Belt"],
  "Site Director": ["Budget Management", "Team Leadership", "ISO 14001"]
};

const names = [
  "Liam Smith", "Olivia Johnson", "Noah Williams", "Emma Brown", "James Jones",
  "Ava Garcia", "William Miller", "Sophia Davis", "Benjamin Rodriguez", "Isabella Martinez",
  "Lucas Hernandez", "Mia Lopez", "Henry Gonzalez", "Charlotte Wilson", "Alexander Anderson",
  "Amelia Thomas", "Sebastian Taylor", "Harper Moore", "Jack Jackson", "Evelyn Martin",
  "Michael Lee", "Abigail Perez", "Daniel Thompson", "Ella White", "Jacob Harris",
  "Scarlett Sanchez", "Logan Clark", "Victoria Ramirez", "Levi Lewis", "Madison Robinson",
  "David Walker", "Luna Young", "Joseph Allen", "Grace King", "Samuel Wright",
  "Chloe Scott", "Sebastian Torres", "Penelope Nguyen", "John Hill", "Riley Adams"
];

export const generateCandidates = (): Candidate[] => {
  return names.map((name, index) => {
    const roles = Object.keys(roleConfig);
    const role = roles[Math.floor(Math.random() * roles.length)];
    
    // Select primary skills based on role + random extras
    const primarySkills = roleConfig[role];
    const randomSkill = skillsPool[Math.floor(Math.random() * skillsPool.length)];
    const uniqueSkills = Array.from(new Set([...primarySkills.slice(0, 2), randomSkill]));

    const years = Math.floor(Math.random() * 18) + 3; // 3 to 21 years
    
    // Dynamic Bio Generation
    const bioTemplates = [
      `Results-oriented ${role} with ${years} years of experience. Proven track record in ${uniqueSkills[0]} and optimizing production workflows.`,
      `Dedicated professional specializing in ${uniqueSkills[1]}. Brings ${years} years of expertise in high-volume recycling environments.`,
      `Safety-first ${role} focused on ${uniqueSkills[0]} and ${uniqueSkills[2]}. Successfully reduced incident rates in previous tenure.`,
      `Strategic leader with ${years} years in the field. Expert in implementing ${uniqueSkills[1]} protocols to drive efficiency.`
    ];
    const bio = bioTemplates[Math.floor(Math.random() * bioTemplates.length)];

    return {
      id: `c${index + 1}`, // Matches SQL Schema format (c1, c2...)
      name,
      avatar: `https://i.pravatar.cc/300?u=${name.replace(/\s/g, '')}`,
      experienceYears: years,
      skills: uniqueSkills,
      bio: bio,
      previousRole: role
    };
  });
};

export const generateInitialEvaluations = (candidates: Candidate[]): Evaluation[] => {
  return candidates.map(c => ({
    candidateId: c.id,
    crisisManagement: Math.floor(Math.random() * 35) + 60, // 60-95
    sustainabilityKnowledge: Math.floor(Math.random() * 35) + 60, // 60-95
    teamMotivation: Math.floor(Math.random() * 35) + 60, // 60-95
    aiSummary: "Automated preliminary scoring based on resume keyword density and certification validation."
  }));
};
