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
  Container,
  Card
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
    <div className="min-h-screen bg-[#F8FAFC] pb-20 font-sans text-slate-900">
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
             <Box className="bg-[#F8FAFC] min-h-screen font-sans">
                {/* HERO HEADER */}
                <div className="bg-slate-900 text-white pb-24 pt-12 px-6 relative overflow-hidden">
                    {/* Abstract Shapes */}
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-900/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
                    <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-slate-800/50 rounded-full blur-2xl translate-y-1/2 -translate-x-1/4"></div>

                    <Container size="xl" className="relative z-10">
                         {/* Close Button */}
                        <div className="absolute top-0 right-0">
                            <ActionIcon variant="transparent" color="white" size="xl" onClick={() => setSelectedCandidateId(null)} className="opacity-70 hover:opacity-100 transition-opacity">
                                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                            </ActionIcon>
                        </div>

                        <div className="flex flex-col md:flex-row gap-8 items-center md:items-end w-full md:w-auto mt-4">
                            <div className="relative group">
                                <Avatar 
                                    src={selectedCandidate.avatar} 
                                    size={160} 
                                    className="border-[6px] border-[#F8FAFC] shadow-2xl rounded-2xl md:w-[180px] md:h-[180px] transition-transform group-hover:scale-[1.02]"
                                />
                                <Badge size="xl" radius="md" className="absolute -bottom-4 -right-4 shadow-lg bg-emerald-500 text-white border-4 border-[#F8FAFC] py-3 px-4 h-auto">
                                    #{selectedCandidate.rank} Ranked
                                </Badge>
                            </div>
                            <div className="text-center md:text-left flex-1">
                                <Text size="sm" tt="uppercase" c="emerald.4" fw={800} className="tracking-widest" mb={4}>{selectedCandidate.id}</Text>
                                <Title order={1} className="text-4xl md:text-6xl font-black mb-4 tracking-tight leading-none text-white">{selectedCandidate.name}</Title>
                                <Group gap="sm" justify="center" align="center" className="md:justify-start">
                                    <Badge size="lg" radius="sm" variant="filled" color="dark" className="bg-slate-800 text-slate-200 font-bold py-3 h-8">{selectedCandidate.previousRole}</Badge>
                                    <Divider orientation="vertical" color="gray" />
                                    <Text className="text-slate-300 font-medium">{selectedCandidate.experienceYears} Years Experience</Text>
                                </Group>
                            </div>
                             <div className="hidden md:flex flex-col items-end justify-end opacity-90">
                                <Text size="xs" tt="uppercase" c="slate.400" fw={700} className="tracking-widest" mb={2}>Overall Index</Text>
                                <div className="flex items-baseline gap-1">
                                    <Text className="text-7xl font-black text-emerald-400 leading-none tracking-tighter">{selectedCandidate.totalScore.toFixed(0)}</Text>
                                    <Text size="xl" className="text-emerald-500/80 font-bold">/100</Text>
                                </div>
                            </div>
                        </div>
                    </Container>
                </div>

                {/* MAIN CONTENT */}
                <Container size="xl" className="-mt-12 pb-20 relative z-10 px-4 md:px-0">
                    <Grid gutter="xl">
                        
                        {/* LEFT COLUMN: INFO & ACTIONS */}
                        <Grid.Col span={{ base: 12, md: 4 }}>
                            <Stack gap="lg">
                                {/* About Card */}
                                <Card radius="lg" p="xl" className="border border-slate-200 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)]">
                                    <Text fw={800} size="sm" tt="uppercase" c="slate.400" className="tracking-widest" mb="lg">Candidate Profile</Text>
                                    <Text size="md" c="slate.700" lh={1.7} fw={500} mb="xl">
                                        {selectedCandidate.bio}
                                    </Text>
                                    
                                    <Text fw={700} size="xs" tt="uppercase" c="slate.900" mb="md" className="tracking-wide">Competencies</Text>
                                    <Group gap="xs">
                                        {selectedCandidate.skills.map(skill => (
                                            <Badge key={skill} variant="outline" color="gray" size="lg" radius="md" className="border-slate-300 text-slate-600 normal-case font-semibold px-3 py-3 h-auto">
                                                {skill}
                                            </Badge>
                                        ))}
                                    </Group>
                                </Card>

                                {/* Actions Card */}
                                <Card radius="lg" p="lg" className="border border-slate-200 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] bg-slate-50">
                                    <Stack gap="sm">
                                        <Button 
                                            fullWidth 
                                            size="lg" 
                                            color="dark" 
                                            radius="md"
                                            className="bg-slate-900 hover:bg-slate-800 transition-colors"
                                            onClick={() => handleEvaluate(selectedCandidate.id)}
                                            loading={evaluatingId === selectedCandidate.id}
                                            leftSection={<span className="text-lg">🤖</span>}
                                        >
                                            Re-Run AI Analysis
                                        </Button>
                                        <Button 
                                            fullWidth 
                                            size="lg" 
                                            variant="white" 
                                            color="gray"
                                            radius="md"
                                            className="border border-slate-200 text-slate-600 hover:bg-slate-100"
                                            onClick={() => handleShare(selectedCandidate)}
                                            leftSection={<span className="text-lg">🔗</span>}
                                        >
                                            Share Profile
                                        </Button>
                                    </Stack>
                                </Card>

                                {/* Logs */}
                                <div className="px-4">
                                     <Text fw={700} size="xs" mb="md" c="slate.400" tt="uppercase" className="tracking-widest">Recent Activity</Text>
                                     <Stack gap="md">
                                        {logs.slice(0, 3).map((log, i) => (
                                            <div key={i} className="flex gap-4 items-center">
                                                <div className="w-2 h-2 rounded-full bg-slate-300"></div>
                                                <div className="flex-1">
                                                    <Text size="sm" fw={600} c="slate.700">{log.action}</Text>
                                                    <Text size="xs" c="slate.400">{log.time}</Text>
                                                </div>
                                            </div>
                                        ))}
                                     </Stack>
                                </div>
                            </Stack>
                        </Grid.Col>

                        {/* RIGHT COLUMN: DATA VISUALIZATION */}
                        <Grid.Col span={{ base: 12, md: 8 }}>
                            <Stack gap="lg">
                                {/* AI Highlight */}
                                <Card radius="lg" p="xl" className="bg-emerald-50/50 border border-emerald-100 shadow-sm relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-100 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                                    <Group align="flex-start" wrap="nowrap" className="relative z-10">
                                        <ThemeIcon size={48} radius="xl" color="emerald" variant="light" className="shrink-0 bg-white shadow-sm">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="text-emerald-600" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/></svg>
                                        </ThemeIcon>
                                        <div>
                                            <Text size="xs" fw={800} c="emerald.8" tt="uppercase" className="tracking-widest" mb={6}>AI Executive Summary</Text>
                                            <Text size="xl" className="text-slate-800 font-serif italic leading-relaxed">
                                                "{selectedCandidate.scores.aiSummary}"
                                            </Text>
                                        </div>
                                    </Group>
                                </Card>

                                {/* METRICS GRID */}
                                <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="lg">
                                    {/* Crisis Metric */}
                                    <Paper radius="md" p="lg" className="border border-slate-200 shadow-sm bg-white relative overflow-hidden flex flex-col items-center justify-between group hover:shadow-md transition-all">
                                        <div className="absolute top-0 w-full h-1 bg-teal-500 opacity-80"></div>
                                        <div className="w-full flex justify-between items-center mb-4">
                                             <Text size="xs" fw={700} c="slate.400" tt="uppercase" className="tracking-widest">Crisis</Text>
                                             <ThemeIcon variant="light" color="teal" size="sm" radius="xl">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-activity" width="14" height="14" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M3 12h4l3 8l4 -16l3 8h4" /></svg>
                                             </ThemeIcon>
                                        </div>
                                        <RingProgress
                                            size={120}
                                            thickness={10}
                                            roundCaps
                                            sections={[{ value: selectedCandidate.scores.crisisManagement, color: 'teal' }]}
                                            label={
                                                <Text c="teal.8" fw={900} ta="center" size="xl">
                                                    {selectedCandidate.scores.crisisManagement}%
                                                </Text>
                                            }
                                        />
                                        <Text size="xs" c="dimmed" ta="center" mt="md" fw={500}>Protocol Adherence</Text>
                                    </Paper>

                                    {/* Sustainability Metric */}
                                    <Paper radius="md" p="lg" className="border border-slate-200 shadow-sm bg-white relative overflow-hidden flex flex-col items-center justify-between group hover:shadow-md transition-all">
                                        <div className="absolute top-0 w-full h-1 bg-cyan-500 opacity-80"></div>
                                        <div className="w-full flex justify-between items-center mb-4">
                                             <Text size="xs" fw={700} c="slate.400" tt="uppercase" className="tracking-widest">Sustainability</Text>
                                             <ThemeIcon variant="light" color="cyan" size="sm" radius="xl">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-leaf" width="14" height="14" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M5 21c.5 -4.5 2.5 -8 7 -10" /><path d="M9 18c6.218 0 10.5 -3.288 11 -12v-2h-4.014c-9 0 -11.986 4 -12 9c0 1 0 3 2 5h3z" /></svg>
                                             </ThemeIcon>
                                        </div>
                                        <RingProgress
                                            size={120}
                                            thickness={10}
                                            roundCaps
                                            sections={[{ value: selectedCandidate.scores.sustainabilityKnowledge, color: 'cyan' }]}
                                            label={
                                                <Text c="cyan.8" fw={900} ta="center" size="xl">
                                                    {selectedCandidate.scores.sustainabilityKnowledge}%
                                                </Text>
                                            }
                                        />
                                        <Text size="xs" c="dimmed" ta="center" mt="md" fw={500}>Circular Economy</Text>
                                    </Paper>

                                    {/* Motivation Metric */}
                                    <Paper radius="md" p="lg" className="border border-slate-200 shadow-sm bg-white relative overflow-hidden flex flex-col items-center justify-between group hover:shadow-md transition-all">
                                        <div className="absolute top-0 w-full h-1 bg-orange-500 opacity-80"></div>
                                        <div className="w-full flex justify-between items-center mb-4">
                                             <Text size="xs" fw={700} c="slate.400" tt="uppercase" className="tracking-widest">Motivation</Text>
                                             <ThemeIcon variant="light" color="orange" size="sm" radius="xl">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-users" width="14" height="14" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M9 7m-4 0a4 4 0 1 0 8 0a4 4 0 1 0 -8 0" /><path d="M3 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /><path d="M21 21v-2a4 4 0 0 0 -3 -3.87" /></svg>
                                             </ThemeIcon>
                                        </div>
                                        <RingProgress
                                            size={120}
                                            thickness={10}
                                            roundCaps
                                            sections={[{ value: selectedCandidate.scores.teamMotivation, color: 'orange' }]}
                                            label={
                                                <Text c="orange.8" fw={900} ta="center" size="xl">
                                                    {selectedCandidate.scores.teamMotivation}%
                                                </Text>
                                            }
                                        />
                                        <Text size="xs" c="dimmed" ta="center" mt="md" fw={500}>Team Retention</Text>
                                    </Paper>
                                </SimpleGrid>

                                {/* Performance Chart */}
                                <Card padding="xl" radius="lg" className="border border-slate-200 shadow-sm bg-white">
                                    <Group justify="space-between" mb="lg">
                                        <Text fw={700} size="sm" c="slate.900">PERFORMANCE VS. BENCHMARK</Text>
                                        <Badge color="gray" variant="light">Average: 71/100</Badge>
                                    </Group>
                                    <div className="h-64 w-full">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={[
                                                { metric: 'Crisis', Candidate: selectedCandidate.scores.crisisManagement, Average: 75 },
                                                { metric: 'Sustain', Candidate: selectedCandidate.scores.sustainabilityKnowledge, Average: 68 },
                                                { metric: 'Motivate', Candidate: selectedCandidate.scores.teamMotivation, Average: 72 },
                                            ]} barCategoryGap="25%">
                                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                                <XAxis dataKey="metric" tick={{fontSize: 12, fontWeight: 600, fill:'#64748b'}} axisLine={false} tickLine={false} dy={10} />
                                                <YAxis tick={{fontSize: 12, fill:'#94a3b8'}} axisLine={false} tickLine={false} />
                                                <RechartsTooltip 
                                                    cursor={{fill: '#f8fafc'}} 
                                                    contentStyle={{borderRadius: '12px', border:'none', boxShadow:'0 10px 15px -3px rgba(0, 0, 0, 0.1)', padding: '12px'}}
                                                    itemStyle={{ fontSize: '12px', fontWeight: 600 }}
                                                />
                                                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }}/>
                                                <Bar dataKey="Candidate" fill="#10B981" radius={[6, 6, 0, 0]} name={selectedCandidate.name.split(' ')[0]} />
                                                <Bar dataKey="Average" fill="#e2e8f0" radius={[6, 6, 0, 0]} name="Company Avg" />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </Card>
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