
import React, { useState, useEffect, useMemo } from 'react';
import { notifications } from '@mantine/notifications';
import { 
  Table, 
  Badge, 
  Text, 
  Group, 
  Stack, 
  Title, 
  Grid,
  Avatar,
  Button,
  Paper,
  SimpleGrid,
  Tabs,
  Modal,
  RingProgress,
  ActionIcon,
  ThemeIcon,
  Box,
  Divider,
  Container
} from '@mantine/core';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  Legend, 
  ResponsiveContainer
} from 'recharts';
import { Candidate, Evaluation, CandidateWithScore } from './types';
import { generateCandidates, generateInitialEvaluations } from './mockData';
import CandidateCard from './components/CandidateCard';

const App: React.FC = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [selectedCandidateId, setSelectedCandidateId] = useState<string | null>(null);
  const [evaluatingId, setEvaluatingId] = useState<string | null>(null);
  
  // Activity Log State
  const [logs, setLogs] = useState<{ time: string; action: string }[]>([
    { time: "04/20 13:45", action: "System Ready - Mock Mode" },
    { time: "04/19 10:22", action: "Database Hydrated (40 Records)" },
  ]);

  useEffect(() => {
    const rawCandidates = generateCandidates();
    const initialEvals = generateInitialEvaluations(rawCandidates);
    setCandidates(rawCandidates);
    setEvaluations(initialEvals);
  }, []);

  const candidatesWithScores: CandidateWithScore[] = useMemo(() => {
    const merged = candidates.map(c => {
      const evalData = evaluations.find(e => e.candidateId === c.id) || {
        candidateId: c.id,
        crisisManagement: 0,
        sustainabilityKnowledge: 0,
        teamMotivation: 0,
        aiSummary: "Awaiting review..."
      };
      // Weighted average
      const totalScore = (evalData.crisisManagement + evalData.sustainabilityKnowledge + evalData.teamMotivation) / 30;
      return { ...c, scores: evalData, totalScore, rank: 0 };
    });

    return merged
      .sort((a, b) => b.totalScore - a.totalScore)
      .map((c, index) => ({ ...c, rank: index + 1 }));
  }, [candidates, evaluations]);

  const selectedCandidate = useMemo(() => 
    candidatesWithScores.find(c => c.id === selectedCandidateId), 
  [candidatesWithScores, selectedCandidateId]);

  // Skill Matrix Calculation
  const skillMatrix = useMemo(() => {
    const matrix = {
      crisis: { low: 0, med: 0, high: 0 },
      sustain: { low: 0, med: 0, high: 0 },
      motivate: { low: 0, med: 0, high: 0 }
    };

    evaluations.forEach(e => {
      const getLevel = (val: number) => val >= 80 ? 'high' : val >= 50 ? 'med' : 'low';
      matrix.crisis[getLevel(e.crisisManagement)]++;
      matrix.sustain[getLevel(e.sustainabilityKnowledge)]++;
      matrix.motivate[getLevel(e.teamMotivation)]++;
    });
    return matrix;
  }, [evaluations]);

  // Chart Data Preparation
  const chartData = useMemo(() => [
    { name: 'Crisis', Low: skillMatrix.crisis.low, Medium: skillMatrix.crisis.med, High: skillMatrix.crisis.high },
    { name: 'Sustain', Low: skillMatrix.sustain.low, Medium: skillMatrix.sustain.med, High: skillMatrix.sustain.high },
    { name: 'Motivate', Low: skillMatrix.motivate.low, Medium: skillMatrix.motivate.med, High: skillMatrix.motivate.high },
  ], [skillMatrix]);

  const handleEvaluate = async (id: string) => {
    const cand = candidates.find(c => c.id === id);
    if (!cand || evaluatingId) return;

    setEvaluatingId(id);
    const now = new Date();
    const timeStr = `${now.getMonth() + 1}/${now.getDate()} ${now.getHours()}:${now.getMinutes()}`;

    // Simulate Network Latency for "AI" Calculation
    await new Promise(r => setTimeout(r, 1500));

    // Generate Realistic Random Scores
    const newCrisis = Math.floor(Math.random() * 30) + 70; // 70-100
    const newSustain = Math.floor(Math.random() * 40) + 60; // 60-100
    const newMotivation = Math.floor(Math.random() * 30) + 70; // 70-100
    
    // Generate Contextual Summary based on scores
    let summary = "Balanced performance across all metrics.";
    if (newCrisis > 90) summary = "Exceptional crisis handling capabilities detected.";
    else if (newSustain > 90) summary = "Leading expert in sustainable production loops.";
    else if (newMotivation > 90) summary = "High emotional intelligence and leadership potential.";

    setEvaluations(prev => prev.map(ev => 
      ev.candidateId === id ? { 
        ...ev, 
        crisisManagement: newCrisis,
        sustainabilityKnowledge: newSustain,
        teamMotivation: newMotivation,
        aiSummary: summary
      } : ev
    ));

    setLogs(prev => [{ time: timeStr, action: `AI Audit Complete: ${cand.name}` }, ...prev]);
    
    notifications.show({ 
      title: 'Assessment Complete', 
      message: `Updated profile for ${cand.name}`, 
      color: 'teal',
      icon: '✨'
    });
    
    setEvaluatingId(null);
  };

  const handleShare = (candidate: CandidateWithScore) => {
    const dummyLink = `${window.location.origin}/candidates/${candidate.id}`;
    navigator.clipboard.writeText(dummyLink);
    notifications.show({ title: 'Shared', message: 'Candidate link copied to clipboard', color: 'blue' });
  };

  return (
    <div className="min-h-screen bg-[#F1F5F9] pb-20 font-sans">
      {/* HEADER */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 transition-shadow hover:shadow-md duration-300">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white font-bold text-xl animate-scale-in shadow-lg shadow-emerald-200">♻</div>
            <h1 className="text-lg font-bold text-slate-800 hidden sm:block tracking-tight">RecycleFlow Intelligence</h1>
          </div>
          
          <div className="flex items-center gap-4">
             <Badge 
               size="lg" 
               variant="gradient" 
               gradient={{ from: 'indigo', to: 'cyan' }} 
               className="animate-fade-in-up"
             >
               MOCK SIMULATION
             </Badge>
            <div className="flex items-center gap-2 pl-4 border-l border-slate-200">
               <Avatar src="https://i.pravatar.cc/150?u=admin" size="sm" radius="xl" color="emerald" />
               <Stack gap={0}>
                 <Text size="xs" fw={700} lh={1}>Admin User</Text>
                 <Text size="10px" c="dimmed" lh={1}>HR Lead</Text>
               </Stack>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        
        {/* TOP ROW */}
        <Grid gutter="lg">
          {/* LEADERBOARD */}
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Paper className="custom-card overflow-hidden h-full flex flex-col animate-fade-in-up hover:shadow-xl transition-shadow duration-300">
              <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                <Text fw={700} size="md" c="dark">Top Candidates</Text>
                <Badge variant="dot" color="green">Live Updating</Badge>
              </div>
              <div className="overflow-x-auto max-h-[350px]">
                <Table verticalSpacing="sm" striped highlightOnHover stickyHeader>
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th>Rank</Table.Th>
                      <Table.Th>Name</Table.Th>
                      <Table.Th>Exp</Table.Th>
                      <Table.Th>Final</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {candidatesWithScores.slice(0, 10).map((c, i) => (
                      <Table.Tr 
                        key={c.id} 
                        className={`cursor-pointer transition-all duration-200 hover:bg-slate-50`}
                        onClick={() => setSelectedCandidateId(c.id)}
                      >
                        <Table.Td>
                           {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : <Text size="sm" c="dimmed" fw={600}>{c.rank}</Text>}
                        </Table.Td>
                        <Table.Td>
                          <Text fw={600} size="sm">{c.name}</Text>
                        </Table.Td>
                        <Table.Td>{c.experienceYears}y</Table.Td>
                        <Table.Td>
                          <Text fw={700} c="emerald.7">{c.totalScore.toFixed(2)}</Text>
                        </Table.Td>
                      </Table.Tr>
                    ))}
                  </Table.Tbody>
                </Table>
              </div>
            </Paper>
          </Grid.Col>

          {/* SKILL DISTRIBUTION - ANIMATED CHARTS */}
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Paper className="custom-card p-6 h-full flex flex-col animate-fade-in-up delay-100 hover:shadow-xl transition-shadow duration-300">
              <Group justify="space-between" mb="md">
                <Text fw={700} size="md" c="dark">Skill Distribution</Text>
                <Badge variant="light" color="gray">40 Candidates</Badge>
              </Group>

              <Tabs defaultValue="chart">
                <Tabs.List className="mb-4">
                  <Tabs.Tab value="chart">Analytics View</Tabs.Tab>
                  <Tabs.Tab value="grid">Matrix View</Tabs.Tab>
                </Tabs.List>

                <Tabs.Panel value="chart" className="h-[250px] w-full mt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} barCategoryGap="20%">
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <XAxis dataKey="name" tick={{fontSize: 12, fill: '#64748b'}} axisLine={false} tickLine={false} />
                      <YAxis tick={{fontSize: 12, fill: '#64748b'}} axisLine={false} tickLine={false} />
                      <RechartsTooltip 
                        cursor={{fill: '#f8fafc'}}
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                      />
                      <Legend iconType="circle" />
                      <Bar dataKey="Low" stackId="a" fill="#F87171" radius={[0, 0, 0, 0]} animationDuration={1000} animationBegin={0} />
                      <Bar dataKey="Medium" stackId="a" fill="#FBBF24" radius={[0, 0, 0, 0]} animationDuration={1000} animationBegin={300} />
                      <Bar dataKey="High" stackId="a" fill="#10B981" radius={[4, 4, 0, 0]} animationDuration={1000} animationBegin={600} />
                    </BarChart>
                  </ResponsiveContainer>
                </Tabs.Panel>

                <Tabs.Panel value="grid">
                   <div className="overflow-x-auto">
                    <div className="grid grid-cols-4 gap-4 text-sm mt-4 min-w-[300px]">
                      {/* Header Row */}
                      <div></div>
                      <div className="text-center font-semibold text-slate-500 text-xs uppercase tracking-wider">Crisis</div>
                      <div className="text-center font-semibold text-slate-500 text-xs uppercase tracking-wider">Sustain</div>
                      <div className="text-center font-semibold text-slate-500 text-xs uppercase tracking-wider">Motivate</div>

                      {/* Low Row */}
                      <div className="flex items-center text-slate-500 font-semibold">Low</div>
                      <div className="bg-red-400 text-white font-bold rounded-lg py-3 flex items-center justify-center shadow-sm hover:scale-105 transition-transform cursor-default">{skillMatrix.crisis.low}</div>
                      <div className="bg-red-400 text-white font-bold rounded-lg py-3 flex items-center justify-center shadow-sm hover:scale-105 transition-transform cursor-default">{skillMatrix.sustain.low}</div>
                      <div className="bg-red-400 text-white font-bold rounded-lg py-3 flex items-center justify-center shadow-sm hover:scale-105 transition-transform cursor-default">{skillMatrix.motivate.low}</div>

                      {/* Medium Row */}
                      <div className="flex items-center text-slate-500 font-semibold">Medium</div>
                      <div className="bg-amber-400 text-white font-bold rounded-lg py-3 flex items-center justify-center shadow-sm hover:scale-105 transition-transform cursor-default">{skillMatrix.crisis.med}</div>
                      <div className="bg-amber-400 text-white font-bold rounded-lg py-3 flex items-center justify-center shadow-sm hover:scale-105 transition-transform cursor-default">{skillMatrix.sustain.med}</div>
                      <div className="bg-amber-400 text-white font-bold rounded-lg py-3 flex items-center justify-center shadow-sm hover:scale-105 transition-transform cursor-default">{skillMatrix.motivate.med}</div>

                      {/* High Row */}
                      <div className="flex items-center text-slate-500 font-semibold">High</div>
                      <div className="bg-emerald-500 text-white font-bold rounded-lg py-3 flex items-center justify-center shadow-sm hover:bg-emerald-600 hover:scale-105 transition-all cursor-default">{skillMatrix.crisis.high}</div>
                      <div className="bg-emerald-500 text-white font-bold rounded-lg py-3 flex items-center justify-center shadow-sm hover:bg-emerald-600 hover:scale-105 transition-all cursor-default">{skillMatrix.sustain.high}</div>
                      <div className="bg-emerald-500 text-white font-bold rounded-lg py-3 flex items-center justify-center shadow-sm hover:bg-emerald-600 hover:scale-105 transition-all cursor-default">{skillMatrix.motivate.high}</div>
                    </div>
                   </div>
                </Tabs.Panel>
              </Tabs>
            </Paper>
          </Grid.Col>
        </Grid>

        {/* ALL CANDIDATES */}
        <div>
          <Group justify="space-between" mb="md" className="animate-fade-in-up delay-200">
            <Text fw={700} size="lg" c="dark">Candidate Pool (40)</Text>
            <Group gap="xs">
               <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
               <Text size="xs" c="dimmed">System Active</Text>
            </Group>
          </Group>
          <SimpleGrid cols={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing="lg">
            {candidatesWithScores.map((c, i) => (
              <div key={c.id} className="animate-fade-in-up" style={{ animationDelay: `${ Math.min(i * 50, 1000) }ms` }}>
                <CandidateCard 
                  candidate={c}
                  isSelected={selectedCandidateId === c.id}
                  onSelect={() => setSelectedCandidateId(c.id)}
                  onEvaluate={() => handleEvaluate(c.id)}
                  isEvaluating={evaluatingId === c.id}
                  onShare={() => handleShare(c)}
                />
              </div>
            ))}
          </SimpleGrid>
        </div>
      </div>

      {/* FULL SCREEN PROFILE MODAL */}
      <Modal 
        opened={!!selectedCandidate} 
        onClose={() => setSelectedCandidateId(null)} 
        fullScreen
        radius={0}
        transitionProps={{ transition: 'slide-up', duration: 300 }}
        padding={0}
        zIndex={100}
      >
         {selectedCandidate && (
             <Box className="bg-slate-50 min-h-screen">
                {/* HERO HEADER */}
                <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white pb-20 pt-12 px-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                        <svg width="400" height="400" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L1 21h22L12 2zm0 3.99L19.53 19H4.47L12 5.99zM11 16h2v2h-2zm0-6h2v4h-2z"/></svg>
                    </div>
                    <Container size="xl">
                        <Group justify="space-between" align="start">
                            <ActionIcon variant="subtle" color="gray" size="xl" onClick={() => setSelectedCandidateId(null)} className="absolute top-4 right-4 text-white hover:bg-white/10 z-50">
                                <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-x" width="32" height="32" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M18 6l-12 12" /><path d="M6 6l12 12" /></svg>
                            </ActionIcon>
                            <div className="flex flex-col md:flex-row gap-8 items-center md:items-end w-full md:w-auto">
                                <div className="relative">
                                    <Avatar 
                                        src={selectedCandidate.avatar} 
                                        size={140} 
                                        className="border-4 border-white shadow-2xl rounded-full md:w-[180px] md:h-[180px]"
                                    />
                                    <Badge size="lg" className="absolute -bottom-3 right-4 shadow-md bg-emerald-500 text-white border-2 border-white">
                                        Rank #{selectedCandidate.rank}
                                    </Badge>
                                </div>
                                <div className="text-center md:text-left">
                                    <Text size="sm" tt="uppercase" opacity={0.7} fw={700} tracking="wider">{selectedCandidate.id}</Text>
                                    <Title order={1} className="text-3xl md:text-5xl font-black mb-2 leading-tight">{selectedCandidate.name}</Title>
                                    <Group gap="xs" justify="center" align="center" className="md:justify-start">
                                        <Badge size="lg" variant="white" color="dark" className="text-slate-900 font-bold">{selectedCandidate.previousRole}</Badge>
                                        <Badge size="lg" variant="outline" className="text-white border-white/30">{selectedCandidate.experienceYears} Years Exp</Badge>
                                    </Group>
                                </div>
                            </div>
                            <div className="hidden md:block text-right">
                                <Text size="xs" tt="uppercase" opacity={0.6} fw={700} mb={1}>Total Index Score</Text>
                                <Text className="text-7xl font-black text-emerald-400 leading-none">{selectedCandidate.totalScore.toFixed(0)}</Text>
                                <Text size="sm" className="text-emerald-200">Out of 100</Text>
                            </div>
                        </Group>
                    </Container>
                </div>

                {/* MAIN CONTENT */}
                <Container size="xl" className="-mt-12 pb-20 relative z-10 px-4 md:px-0">
                    <Grid gutter="xl">
                        {/* LEFT COLUMN: INFO */}
                        <Grid.Col span={{ base: 12, md: 4 }}>
                            <Stack gap="md">
                                <Paper p="xl" radius="lg" shadow="sm" className="bg-white border border-slate-200">
                                    <Text fw={700} size="lg" mb="md" c="dark">About Candidate</Text>
                                    <Text size="sm" c="dimmed" lh={1.6}>
                                        {selectedCandidate.bio}
                                    </Text>
                                    <Divider my="lg" />
                                    <Text fw={700} size="sm" mb="xs" c="dark">Core Competencies</Text>
                                    <Group gap="xs">
                                        {selectedCandidate.skills.map(skill => (
                                            <Badge key={skill} variant="light" color="gray" size="md">{skill}</Badge>
                                        ))}
                                    </Group>
                                </Paper>

                                <Paper p="xl" radius="lg" shadow="sm" className="bg-white border border-slate-200">
                                    <Text fw={700} size="lg" mb="md" c="dark">Action Menu</Text>
                                    <Stack>
                                        <Button 
                                            fullWidth 
                                            size="md" 
                                            color="dark" 
                                            onClick={() => handleEvaluate(selectedCandidate.id)}
                                            loading={evaluatingId === selectedCandidate.id}
                                        >
                                            Run AI Re-Evaluation
                                        </Button>
                                        <Button fullWidth size="md" variant="default" onClick={() => handleShare(selectedCandidate)}>
                                            Share Profile Link
                                        </Button>
                                    </Stack>
                                </Paper>

                                <Paper p="xl" radius="lg" shadow="sm" className="bg-white border border-slate-200">
                                     <Text fw={700} size="sm" mb="md" c="dimmed" tt="uppercase">System Logs</Text>
                                     <Stack gap="sm">
                                        {logs.slice(0, 3).map((log, i) => (
                                            <div key={i} className="flex gap-3 items-start text-sm">
                                                <div className="w-2 h-2 mt-1.5 rounded-full bg-slate-300 flex-shrink-0"></div>
                                                <div>
                                                    <Text size="xs" fw={600} c="dark">{log.action}</Text>
                                                    <Text size="xs" c="dimmed">{log.time}</Text>
                                                </div>
                                            </div>
                                        ))}
                                     </Stack>
                                </Paper>
                            </Stack>
                        </Grid.Col>

                        {/* RIGHT COLUMN: STATS */}
                        <Grid.Col span={{ base: 12, md: 8 }}>
                            <Stack gap="lg">
                                {/* AI SUMMARY BOX */}
                                <Paper p="xl" radius="lg" shadow="sm" className="bg-white border-l-4 border-emerald-500">
                                    <Group align="flex-start" wrap="nowrap">
                                        <ThemeIcon size={40} radius="md" color="emerald" variant="light" className="shrink-0">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-robot" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M7 7h10a2 2 0 0 1 2 2v1l1 1v3l-1 1v3a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2v-3l-1 -1v-3l1 -1v-1a2 2 0 0 1 2 -2z" /><path d="M10 16h4" /><circle cx="8.5" cy="11.5" r=".5" fill="currentColor" /><circle cx="15.5" cy="11.5" r=".5" fill="currentColor" /><path d="M9 7l-1 -4" /><path d="M15 7l1 -4" /></svg>
                                        </ThemeIcon>
                                        <div>
                                            <Text size="xs" fw={700} c="emerald.7" tt="uppercase" mb={4}>AI-Generated Executive Summary</Text>
                                            <Text size="lg" className="text-slate-700 italic leading-relaxed">
                                                "{selectedCandidate.scores.aiSummary}"
                                            </Text>
                                        </div>
                                    </Group>
                                </Paper>

                                {/* METRICS GRID */}
                                <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="lg">
                                    <Paper p="lg" radius="lg" shadow="sm" className="bg-white border border-slate-200 flex flex-col items-center text-center hover:border-emerald-200 transition-colors">
                                        <Text size="sm" fw={700} c="slate.5" tt="uppercase" mb="sm">Crisis Mgmt</Text>
                                        <RingProgress
                                            size={120}
                                            roundCaps
                                            thickness={8}
                                            sections={[{ value: selectedCandidate.scores.crisisManagement, color: 'teal' }]}
                                            label={
                                                <Text c="teal" fw={900} ta="center" size="xl">
                                                    {selectedCandidate.scores.crisisManagement}%
                                                </Text>
                                            }
                                        />
                                        <Text size="xs" c="dimmed" mt="sm">Reaction time & Protocol Adherence</Text>
                                    </Paper>
                                    <Paper p="lg" radius="lg" shadow="sm" className="bg-white border border-slate-200 flex flex-col items-center text-center hover:border-emerald-200 transition-colors">
                                        <Text size="sm" fw={700} c="slate.5" tt="uppercase" mb="sm">Sustainability</Text>
                                        <RingProgress
                                            size={120}
                                            roundCaps
                                            thickness={8}
                                            sections={[{ value: selectedCandidate.scores.sustainabilityKnowledge, color: 'cyan' }]}
                                            label={
                                                <Text c="cyan" fw={900} ta="center" size="xl">
                                                    {selectedCandidate.scores.sustainabilityKnowledge}%
                                                </Text>
                                            }
                                        />
                                        <Text size="xs" c="dimmed" mt="sm">Waste Reduction & Circular Econ</Text>
                                    </Paper>
                                    <Paper p="lg" radius="lg" shadow="sm" className="bg-white border border-slate-200 flex flex-col items-center text-center hover:border-emerald-200 transition-colors">
                                        <Text size="sm" fw={700} c="slate.5" tt="uppercase" mb="sm">Motivation</Text>
                                        <RingProgress
                                            size={120}
                                            roundCaps
                                            thickness={8}
                                            sections={[{ value: selectedCandidate.scores.teamMotivation, color: 'orange' }]}
                                            label={
                                                <Text c="orange" fw={900} ta="center" size="xl">
                                                    {selectedCandidate.scores.teamMotivation}%
                                                </Text>
                                            }
                                        />
                                        <Text size="xs" c="dimmed" mt="sm">Leadership & Team Retention</Text>
                                    </Paper>
                                </SimpleGrid>

                                <Paper p="xl" radius="lg" shadow="sm" className="bg-white border border-slate-200">
                                    <Text fw={700} size="lg" mb="md" c="dark">Comparative Analysis (vs. Average)</Text>
                                    <div className="h-64 w-full">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={[
                                                { metric: 'Crisis', Candidate: selectedCandidate.scores.crisisManagement, Average: 75 },
                                                { metric: 'Sustain', Candidate: selectedCandidate.scores.sustainabilityKnowledge, Average: 68 },
                                                { metric: 'Motivate', Candidate: selectedCandidate.scores.teamMotivation, Average: 72 },
                                            ]}>
                                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                                <XAxis dataKey="metric" tick={{fontSize: 12}} axisLine={false} tickLine={false} />
                                                <YAxis tick={{fontSize: 12}} axisLine={false} tickLine={false} />
                                                <RechartsTooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '8px', border:'none', boxShadow:'0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                                                <Legend />
                                                <Bar dataKey="Candidate" fill="#10B981" radius={[4, 4, 0, 0]} />
                                                <Bar dataKey="Average" fill="#94a3b8" radius={[4, 4, 0, 0]} />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </Paper>
                            </Stack>
                        </Grid.Col>
                    </Grid>
                </Container>
             </Box>
         )}
      </Modal>
    </div>
  );
};

export default App;
