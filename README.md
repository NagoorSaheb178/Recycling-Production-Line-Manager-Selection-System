
# RecycleFlow - Manager Selection System

A standalone system for ranking and evaluating recycling production line manager candidates using AI-driven scoring and data visualization.

## 🚀 Features
- **AI Scoring System**: Evaluate candidates using specific industrial rubrics for Crisis Management, Sustainability, and Team Motivation.
- **Dynamic Leaderboard**: Real-time ranking of the top 10 candidates based on cumulative performance.
- **Skill Heatmap**: Visual distribution of candidate performance across different facilities.
- **Live AI Integration**: Uses `puter.ai.chat` (GPT-4o) to perform deep semantic analysis of candidate profiles.
- **Responsive Dashboard**: Fully functional on mobile, tablet, and desktop.
- **Bonus Workflow**: "Share Candidate" feature to copy profile links for HR collaboration.

## 🛠 Tech Stack
- **Frontend**: React (ESM), Vite-compatible.
- **UI Library**: Mantine UI + Tailwind CSS.
- **AI Engine**: Puter.ai (GPT-4o).
- **Data Visualization**: Recharts & Custom SVG Gauges.
- **Mock Data**: Custom generator (40 realistic candidates).

## 📂 Project Structure
- `App.tsx`: Core dashboard logic and state management.
- `db-schema.sql`: MySQL-compatible schema + Sample DML data.
- `prompts.md`: The specific prompts and rubrics used for AI evaluation.
- `components/`: Modular Mantine-based UI components.
- `mockData.ts`: 40 candidate generation logic.

## ⚙️ Setup Instructions
1. This is a standalone browser-based application.
2. Open the `index.html` file in any modern browser.
3. Ensure you are connected to the internet to load external libraries and AI capabilities.
4. Toggle **Live AI** in the header to use real GPT analysis (requires Puter.js environment).
5. Click **Evaluate** on any candidate card to trigger the AI analysis.

## 📋 Database Implementation
The `db-schema.sql` file contains the full structure. To deploy:
1. Execute the `CREATE` statements to build the environment.
2. Run the `INSERT` statements to populate the initial 40 candidates.
3. Use the `rankings` VIEW to fetch real-time leaderboards.
