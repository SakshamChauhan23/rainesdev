/**
 * Setup script to create seller, categories, and agents from GitHub repos
 *
 * Run: npx tsx scripts/setup-github-agents.ts
 */

import { PrismaClient } from '@prisma/client'
import { createClient } from '@supabase/supabase-js'
import * as crypto from 'crypto'

const prisma = new PrismaClient()

// Supabase client for auth
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY env vars')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
})

// Configuration
const SELLER_EMAIL = 'saksham.c@navgurukul.org'
const GENERATED_PASSWORD = crypto.randomBytes(12).toString('base64').slice(0, 16) + 'Aa1!'

// Categories to create
const CATEGORIES_TO_CREATE = [
  {
    name: 'Health',
    slug: 'health',
    description: 'AI agents for healthcare, medical diagnostics, and health monitoring',
    displayOrder: 10,
  },
  {
    name: 'Finance',
    slug: 'finance',
    description: 'AI agents for financial analysis, stock trading, and investment strategies',
    displayOrder: 11,
  },
]

// Agents to create
const AGENTS_TO_CREATE = [
  {
    title: 'Health Insights Agent (HIA)',
    slug: 'health-insights-agent-hia',
    categorySlug: 'health',
    shortDescription:
      'AI-powered health monitoring agent that provides personalized insights and proactive health recommendations',
    workflowOverview: `# Health Insights Agent (HIA)

An AI-powered health monitoring solution that delivers personalized health insights and proactive recommendations.

## How It Works

The Health Insights Agent integrates with your health data sources and uses advanced AI to:

1. **Monitor Health Metrics** - Track vital signs, activity levels, sleep patterns, and more
2. **Analyze Trends** - Identify patterns and anomalies in your health data
3. **Provide Insights** - Generate personalized health recommendations
4. **Proactive Alerts** - Notify you of potential health concerns before they become issues

## Key Capabilities

- Real-time health data analysis
- Personalized wellness recommendations
- Integration with wearables and health apps
- Privacy-focused design with local data processing
- Natural language interface for health queries`,
    useCase: `**Best For:**
- Individuals looking to optimize their health and wellness
- People managing chronic conditions who need regular monitoring
- Health-conscious users wanting AI-powered insights
- Healthcare providers seeking automated patient monitoring tools
- Wellness apps looking to add intelligent health analysis

**Use Cases:**
- Daily health tracking and reporting
- Sleep quality analysis and improvement suggestions
- Activity and fitness optimization
- Stress and mental wellness monitoring
- Early warning detection for health anomalies`,
    setupGuide: `# Setup Guide for Health Insights Agent

## Prerequisites
- Python 3.8 or higher
- API key for AI services (OpenAI or similar)
- Access to health data sources (optional but recommended)

## Installation Steps

### 1. Clone the Repository
\`\`\`bash
git clone https://github.com/harshhh28/hia.git
cd hia
\`\`\`

### 2. Create Virtual Environment
\`\`\`bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\\Scripts\\activate
\`\`\`

### 3. Install Dependencies
\`\`\`bash
pip install -r requirements.txt
\`\`\`

### 4. Configure Environment
Create a \`.env\` file with your API credentials:
\`\`\`
OPENAI_API_KEY=your_api_key_here
\`\`\`

### 5. Run the Agent
\`\`\`bash
python main.py
\`\`\`

## Configuration Options
- Configure data sources in \`config.yaml\`
- Customize health metrics in the settings
- Set up notification preferences

## Support
Need help? Contact us through the marketplace for assisted setup.`,
    demoVideoUrl: null,
    thumbnailUrl: null,
  },
  {
    title: 'AI Medical Diagnostics Agent',
    slug: 'ai-medical-diagnostics-agent',
    categorySlug: 'health',
    shortDescription:
      'Multi-specialist AI agent system for comprehensive medical case analysis with cardiology, psychology, and pulmonology expertise',
    workflowOverview: `# AI Agents for Medical Diagnostics

A sophisticated Python-based system that deploys multiple specialized AI agents to examine complex medical scenarios, providing collaborative healthcare insights.

## How It Works

The system orchestrates three GPT-powered specialist agents working concurrently:

### 1. Cardiology Agent
- Identifies cardiac dysfunctions
- Recommends cardiovascular interventions
- Analyzes heart-related symptoms and test results

### 2. Psychology Agent
- Detects mental health conditions
- Suggests therapeutic approaches
- Evaluates psychological symptoms and behavioral patterns

### 3. Pulmonology Agent
- Evaluates respiratory complications
- Recommends lung assessments
- Analyzes breathing issues and pulmonary conditions

## Output
Medical reports flow through all agents simultaneously via threading, with outputs synthesized into three probable diagnoses accompanied by clinical reasoning.

**Important Notice:** This system serves research and educational purposes only and is not intended for clinical use.`,
    useCase: `**Best For:**
- Medical researchers studying AI-assisted diagnostics
- Healthcare educators teaching diagnostic reasoning
- Developers building health AI applications
- Medical students practicing case analysis
- Healthcare innovation teams exploring AI capabilities

**Use Cases:**
- Educational medical case studies
- Research into AI-powered diagnostic assistance
- Prototyping healthcare AI solutions
- Training materials for medical professionals
- Demonstration of multi-agent AI coordination

**Note:** For research and educational purposes only. Not intended for actual clinical diagnosis.`,
    setupGuide: `# Setup Guide for AI Medical Diagnostics Agent

## Prerequisites
- Python 3.8+
- OpenAI API key with GPT-5 access
- Basic understanding of Python virtual environments

## Installation Steps

### 1. Clone the Repository
\`\`\`bash
git clone https://github.com/ahmadvh/AI-Agents-for-Medical-Diagnostics.git
cd AI-Agents-for-Medical-Diagnostics
\`\`\`

### 2. Set Up Virtual Environment
\`\`\`bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\\Scripts\\activate
\`\`\`

### 3. Install Dependencies
\`\`\`bash
pip install -r requirements.txt
\`\`\`

### 4. Configure API Key
Create \`apikey.env\` file:
\`\`\`
OPENAI_API_KEY=your_openai_api_key
\`\`\`

### 5. Run the System
\`\`\`bash
python main.py
\`\`\`

## How to Use
1. Input a medical case description when prompted
2. The system will process it through all three specialist agents
3. Review the synthesized diagnoses and recommendations

## Customization
- Modify agent prompts in the respective agent files
- Add new specialist agents by following the existing pattern
- Adjust threading configuration for performance

## Support
Need assistance? Use the assisted setup option for personalized help.`,
    demoVideoUrl: null,
    thumbnailUrl: null,
  },
  {
    title: 'StockAgent - LLM Trading Simulator',
    slug: 'stockagent-llm-trading-simulator',
    categorySlug: 'finance',
    shortDescription:
      'Multi-agent AI system powered by LLMs that simulates realistic stock trading behaviors and analyzes market dynamics',
    workflowOverview: `# StockAgent: LLM-Based Stock Trading Simulation

A cutting-edge multi-agent AI system that simulates investor trading behaviors within realistic stock market conditions using Large Language Models.

## How It Works

StockAgent operates through four distinct phases:

### 1. Initial Phase
- Agent initialization and market setup
- Portfolio allocation and strategy definition

### 2. Trading Phase
- Real-time market simulation
- LLM-driven trading decisions
- Order execution and portfolio management

### 3. Post-Trading Phase
- Daily performance analysis
- Quarterly earnings events
- Portfolio rebalancing

### 4. Special Events Phase
- Random market events (news, earnings surprises)
- Black swan event simulation
- Market crash/rally scenarios

## Key Features
- **Multi-Agent Architecture**: Multiple LLM-driven agents trading simultaneously
- **External Factor Analysis**: Evaluates macroeconomics, policy changes, company fundamentals
- **Data Integrity**: Addresses test data leakage to ensure fair evaluation
- **Multiple LLM Support**: Compatible with OpenAI GPT models and Google Gemini

## Research Citation
Zhang et al. (2024), arXiv preprint arXiv:2407.18957`,
    useCase: `**Best For:**
- Quantitative researchers studying market dynamics
- Financial educators teaching trading strategies
- AI/ML engineers building trading systems
- Economics researchers analyzing agent behavior
- FinTech developers prototyping trading bots

**Use Cases:**
- Backtesting trading strategies in simulated environments
- Studying how AI agents respond to market events
- Educational demonstrations of market mechanics
- Research into behavioral finance and agent-based modeling
- Prototyping algorithmic trading concepts

**Applications:**
- Academic research in computational finance
- Trading strategy development and testing
- Risk analysis and stress testing
- Market microstructure studies`,
    setupGuide: `# Setup Guide for StockAgent

## Prerequisites
- Python 3.9+
- Conda (recommended) or pip
- API key for OpenAI or Google Gemini

## Installation Steps

### 1. Clone the Repository
\`\`\`bash
git clone https://github.com/MingyuJ666/Stockagent.git
cd Stockagent
\`\`\`

### 2. Create Conda Environment
\`\`\`bash
conda create --name stockagent python=3.9
conda activate stockagent
\`\`\`

### 3. Install Dependencies
\`\`\`bash
pip install -r requirements.txt
\`\`\`

### 4. Configure API Keys
Set your API key as an environment variable:
\`\`\`bash
export OPENAI_API_KEY=your_openai_key
# OR for Gemini
export GOOGLE_API_KEY=your_google_key
\`\`\`

### 5. Run the Simulation
\`\`\`bash
python main.py --model gpt-4
# Or with Gemini
python main.py --model gemini
\`\`\`

## Configuration Options
- \`--model\`: Choose between GPT models or Gemini
- \`--agents\`: Number of trading agents
- \`--episodes\`: Number of trading days to simulate
- \`--initial_capital\`: Starting capital per agent

## Output
Results are saved in the \`output/\` directory including:
- Trading logs
- Performance metrics
- Visualization charts

## Support
Need help configuring or customizing? Use assisted setup for personalized guidance.`,
    demoVideoUrl: null,
    thumbnailUrl: null,
  },
]

async function main() {
  console.log('🚀 Starting GitHub Agents Setup Script\n')
  console.log('='.repeat(50))

  // Step 1: Create seller account in Supabase
  console.log('\n📧 Step 1: Creating seller account...')

  let sellerId: string

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email: SELLER_EMAIL },
  })

  if (existingUser) {
    console.log(`  ✓ User ${SELLER_EMAIL} already exists`)
    if (existingUser.role !== 'SELLER' && existingUser.role !== 'ADMIN') {
      // Update to seller role
      await prisma.user.update({
        where: { id: existingUser.id },
        data: { role: 'SELLER' },
      })
      console.log('  ✓ Updated user role to SELLER')
    }
    sellerId = existingUser.id
  } else {
    // Create in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: SELLER_EMAIL,
      password: GENERATED_PASSWORD,
      email_confirm: true,
    })

    if (authError) {
      console.error('  ❌ Failed to create Supabase auth user:', authError.message)
      process.exit(1)
    }

    sellerId = authData.user.id

    // Create in Prisma
    await prisma.user.create({
      data: {
        id: sellerId,
        email: SELLER_EMAIL,
        role: 'SELLER',
        name: 'Saksham C',
      },
    })

    console.log(`  ✅ Created seller account: ${SELLER_EMAIL}`)
    console.log(`  🔑 Password: ${GENERATED_PASSWORD}`)
    console.log('\n  ⚠️  SAVE THIS PASSWORD - it cannot be retrieved later!\n')
  }

  // Step 2: Create categories
  console.log('📁 Step 2: Creating categories...')

  const categoryMap: Record<string, string> = {}

  for (const cat of CATEGORIES_TO_CREATE) {
    const existing = await prisma.category.findUnique({
      where: { slug: cat.slug },
    })

    if (existing) {
      console.log(`  ✓ Category "${cat.name}" already exists`)
      categoryMap[cat.slug] = existing.id
    } else {
      const newCat = await prisma.category.create({
        data: cat,
      })
      console.log(`  ✅ Created category: ${cat.name}`)
      categoryMap[cat.slug] = newCat.id
    }
  }

  // Step 3: Create agents
  console.log('\n🤖 Step 3: Creating agents...')

  for (const agent of AGENTS_TO_CREATE) {
    // Check if agent already exists
    const existing = await prisma.agent.findUnique({
      where: { slug: agent.slug },
    })

    if (existing) {
      console.log(`  ✓ Agent "${agent.title}" already exists`)
      continue
    }

    const categoryId = categoryMap[agent.categorySlug]
    if (!categoryId) {
      console.error(`  ❌ Category ${agent.categorySlug} not found for agent ${agent.title}`)
      continue
    }

    await prisma.agent.create({
      data: {
        sellerId,
        categoryId,
        title: agent.title,
        slug: agent.slug,
        shortDescription: agent.shortDescription,
        workflowOverview: agent.workflowOverview,
        useCase: agent.useCase,
        setupGuide: agent.setupGuide,
        price: 10.0,
        demoVideoUrl: agent.demoVideoUrl,
        thumbnailUrl: agent.thumbnailUrl,
        status: 'APPROVED',
        approvedAt: new Date(),
        assistedSetupEnabled: true,
        assistedSetupPrice: 0,
        bookCallEnabled: false,
      },
    })

    console.log(`  ✅ Created agent: ${agent.title}`)
  }

  // Summary
  console.log('\n' + '='.repeat(50))
  console.log('✅ Setup Complete!\n')
  console.log('📊 Summary:')
  console.log(`  • Seller: ${SELLER_EMAIL}`)
  if (!existingUser) {
    console.log(`  • Password: ${GENERATED_PASSWORD}`)
  }
  console.log(`  • Categories created: ${CATEGORIES_TO_CREATE.length}`)
  console.log(`  • Agents created: ${AGENTS_TO_CREATE.length}`)
  console.log('\n🌐 Agents are now LIVE on the marketplace!')

  await prisma.$disconnect()
}

main().catch(async e => {
  console.error('Fatal error:', e)
  await prisma.$disconnect()
  process.exit(1)
})
