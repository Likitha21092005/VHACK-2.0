# GuardianAI - Multi-Agent Content Moderation System

<p align="center">
  <img src="https://img.shields.io/badge/React-18.2.0-blue?style=for-the-badge&logo=react" alt="React">
  <img src="https://img.shields.io/badge/Vite-5.1.4-purple?style=for-the-badge&logo=vite" alt="Vite">
  <img src="https://img.shields.io/badge/TailwindCSS-3.4.1-38bdf8?style=for-the-badge&logo=tailwind-css" alt="Tailwind CSS">
  <img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge" alt="License">
</p>

GuardianAI is an advanced multi-agent content moderation control center that uses AI-powered agents to analyze and moderate text, image, and audio content in real-time. The system automatically routes content to human moderators based on severity levels and tracks their workload to prevent burnout.

![GuardianAI Dashboard](https://via.placeholder.com/800x400?text=GuardianAI+Dashboard+Preview)

## ✨ Features

### 🤖 Multi-Agent AI Processing
- **TextAgent**: Analyzes text content for toxicity, harassment, and threats
- **ImageAgent**: Processes images to detect inappropriate visual content
- **AudioAgent**: Evaluates audio recordings for harmful speech
- **EvaluationAgent**: Routes content based on severity analysis

### 📊 Real-Time Analytics
- Live moderation statistics and trends
- Category-wise breakdown (safe, complaint, harassment, abuse, threat)
- Processing time metrics
- Auto-removal vs. human moderation comparison

### 👥 Moderator Management
- Dynamic moderator assignment based on workload
- Fatigue tracking with automatic break suggestions
- Task distribution with severity-based routing
- Status tracking (active, restricted, on_break)

### 📝 Activity Logging
- Complete audit trail of all moderation actions
- Real-time activity feed with severity indicators
- System event logging

### 📈 Reports & Insights
- Detailed category distribution charts
- Moderator performance metrics
- Retraining logs for model improvement

## 🏗️ Architecture

```
guardianai/
├── public/
│   └── index.html
├── src/
│   ├── api/
│   │   └── base44Client.js          # API client for backend integration
│   ├── components/
│   │   ├── guardian/
│   │   │   ├── ActivityLog.jsx      # Real-time activity feed
│   │   │   ├── AICore.jsx          # AI agent visualization
│   │   │   ├── AnalyticsPanel.jsx  # Analytics dashboard
│   │   │   ├── ContentInput.jsx    # Content submission form
│   │   │   ├── ModeratorCard.jsx   # Moderator status card
│   │   │   ├── OrchestrationView.jsx # Agent orchestration display
│   │   │   ├── ProcessingOverlay.jsx # Processing animation
│   │   │   ├── ReportsPanel.jsx    # Reports and insights
│   │   │   └── sampleDataset.js    # Sample test data
│   │   └── ui/
│   │       ├── button.jsx          # Reusable button component
│   │       └── tabs.jsx            # Tab navigation component
│   ├── lib/
│   │   └── utils.js                # Utility functions
│   ├── pages/
│   │   └── Dashboard.jsx           # Main dashboard component
│   ├── globals.css                 # Global styles
│   └── main.jsx                    # Application entry point
├── package.json
├── vite.config.js                  # Vite configuration
├── tailwind.config.js              # Tailwind CSS configuration
└── postcss.config.js               # PostCSS configuration
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18.0 or higher
- npm or yarn package manager

### Installation

1. Clone the repository:
```
bash
git clone <repository-url>
cd guardianai
```

2. Install dependencies:
```
bash
npm install
```

3. Start the development server:
```
bash
npm run dev
```

4. Open your browser and navigate to:
```
http://localhost:3000
```

### Build for Production

```
bash
npm run build
```

The built files will be in the `dist` directory.

### Preview Production Build

```
bash
npm run preview
```

## 🎮 How to Use

### Submitting Content for Moderation

1. **Select Content Type**: Choose between Text, Image, or Audio
2. **Enter Content**: Type text, paste an image URL, or provide audio URL
3. **Submit**: Click the analyze button to process

### Using Sample Data

The system includes pre-built sample datasets for testing:

| Category | Score Range | Level | Action |
|----------|-------------|-------|--------|
| Positive | 0-20 | 1 | Approved |
| Complaint | 21-40 | 2 | Approved |
| Harassment | 41-60 | 3 | Needs Review |
| Abuse | 61-80 | 4 | Needs Review |
| Threat | 81-100 | 5 | Auto-Removed |

### Moderator Workflow

1. Content is analyzed by AI agents
2. High-threat content (>70 score) is automatically removed
3. Moderate content is assigned to available moderators
4. Moderators track their fatigue score through task assignments
5. Moderators with high fatigue are automatically placed on break

### System Reset

Use the "Reset Demo" button in the header to:
- Reset all moderator scores
- Clear analytics data
- Clear activity logs

## 🔧 Configuration

### Moderator Thresholds

Located in `src/pages/Dashboard.jsx`:

```
javascript
const THRESHOLD_1 = 40;  // Restricted status threshold
const THRESHOLD_2 = 80;  // Break status threshold
const BREAK_COOLDOWN_MS = 3000;  // Break duration in milliseconds
```

### Server Configuration

Modify `vite.config.js` to change the development server port:

```
javascript
server: {
  port: 3000,  // Change this to your preferred port
  host: true,
}
```

## 📦 Dependencies

### Core
- **React** 18.2.0 - UI framework
- **React DOM** 18.2.0 - React rendering
- **Vite** 5.1.4 - Build tool

### UI & Styling
- **Tailwind CSS** 3.4.1 - Utility-first CSS
- **Framer Motion** 11.0.0 - Animation library
- **Lucide React** 0.475.0 - Icon library

### Data & Charts
- **Recharts** 2.12.0 - Charting library
- **Date-fns** 3.6.0 - Date utilities

### UI Components
- **@radix-ui/react-tabs** - Tab components
- **@radix-ui/react-progress** - Progress components
- **class-variance-authority** - CVA for component variants
- **clsx** - Conditional classNames
- **tailwind-merge** - Tailwind class merging

### Data Fetching
- **@tanstack/react-query** - Data fetching and caching

## 🎨 Customization

### Adding New Content Types

1. Add the type to the `ContentInput` component
2. Create a new agent in `OrchestrationView`
3. Update the `sampleDataset` with test cases

### Modifying Moderator Behavior

Edit the `selectModerator` function in `Dashboard.jsx` to customize:
- Assignment logic
- Availability rules
- Load balancing algorithm

### Styling

The project uses Tailwind CSS. Custom styles can be added in:
- `src/globals.css` - Global CSS variables and base styles
- `tailwind.config.js` - Tailwind configuration and theme extension

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Lucide Icons](https://lucide.dev/)
- [Radix UI](https://www.radix-ui.com/)

---

<p align="center">Built with ❤️ using React + Vite + Tailwind CSS</p>
