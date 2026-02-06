/**
 * Add GitHub agents batch 2 - 9 new agents
 * Run: npx tsx scripts/add-github-agents-batch2.ts
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const SELLER_EMAIL = 'saksham.c@navgurukul.org'

// New categories to create
const NEW_CATEGORIES = [
  {
    name: 'E-Commerce',
    slug: 'e-commerce',
    description: 'AI agents for online shopping, product recommendations, and retail automation',
    displayOrder: 12,
  },
  {
    name: 'Travel',
    slug: 'travel',
    description: 'AI agents for travel planning, booking, and itinerary management',
    displayOrder: 13,
  },
  {
    name: 'HR & Recruiting',
    slug: 'hr-recruiting',
    description: 'AI agents for job searching, recruiting, and HR automation',
    displayOrder: 14,
  },
  {
    name: 'Legal',
    slug: 'legal',
    description: 'AI agents for legal research, compliance, and regulatory guidance',
    displayOrder: 15,
  },
  {
    name: 'Productivity',
    slug: 'productivity',
    description: 'AI agents for personal productivity, automation, and task management',
    displayOrder: 16,
  },
  {
    name: 'Industrial',
    slug: 'industrial',
    description: 'AI agents for industrial automation, manufacturing, and IoT systems',
    displayOrder: 17,
  },
  {
    name: 'Automotive',
    slug: 'automotive',
    description: 'AI agents for autonomous driving, vehicle systems, and transportation',
    displayOrder: 18,
  },
  {
    name: 'Education',
    slug: 'education',
    description: 'AI agents for learning, tutoring, and educational content',
    displayOrder: 19,
  },
]

// Agents to create
const AGENTS = [
  {
    title: 'ShoppingGPT - AI Shopping Assistant',
    slug: 'shoppinggpt-ai-shopping-assistant',
    categorySlug: 'e-commerce',
    thumbnailUrl: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop',
    shortDescription:
      'AI-powered shopping assistant combining NLP with e-commerce for intelligent product recommendations and customer support',
    workflowOverview: `# ShoppingGPT - AI Shopping Assistant

An intelligent shopping companion that combines Google's Gemini model with retrieval-augmented generation to deliver personalized product recommendations through natural conversations.

## How It Works

### 1. Natural Language Understanding
The system uses Google's Gemini model to understand customer queries in natural, conversational language.

### 2. Smart Product Search
- Semantic routing classifies queries intelligently
- RAG integration with SQLite database for accurate product details
- Case-insensitive search with partial matching

### 3. Personalized Recommendations
Based on conversation context and user preferences, the agent provides tailored product suggestions.

## Key Capabilities

- **Context-Aware Conversations** - Maintains conversation history for relevant responses
- **Product Discovery** - Intelligent search across inventory
- **Policy Inquiries** - Answers shipping, returns, and store policy questions
- **Customer Service** - Handles general support conversations

## Technical Stack
- Flask web framework
- Google Generative AI (Gemini)
- SQLite + FAISS for vector search
- Semantic Router for query classification`,
    useCase: `**Best For:**
- E-commerce businesses looking to add AI-powered customer support
- Online retailers wanting personalized product recommendations
- Businesses needing 24/7 automated shopping assistance
- Stores with large product catalogs requiring smart search

**Use Cases:**
- Product discovery and recommendations
- Customer policy and guideline inquiries
- General customer service automation
- Inventory browsing with natural language`,
    setupGuide: `# Setup Guide for ShoppingGPT

## Prerequisites
- Python 3.7+
- Google API Key (for Gemini)

## Installation

### 1. Clone the Repository
\`\`\`bash
git clone https://github.com/Hoanganhvu123/ShoppingGPT.git
cd ShoppingGPT
\`\`\`

### 2. Create Virtual Environment
\`\`\`bash
python -m venv venv
source venv/bin/activate  # Windows: venv\\Scripts\\activate
\`\`\`

### 3. Install Dependencies
\`\`\`bash
pip install -r requirements.txt
\`\`\`

### 4. Configure Environment
Create a \`.env\` file:
\`\`\`
GOOGLE_API_KEY=your_google_api_key_here
\`\`\`

### 5. Initialize Database
\`\`\`bash
python scripts/init_db.py
\`\`\`

### 6. Run the Application
\`\`\`bash
python app.py
\`\`\`

Access the chatbot at http://localhost:5000`,
  },
  {
    title: 'AI Travel Agent - Smart Trip Planner',
    slug: 'ai-travel-agent-smart-trip-planner',
    categorySlug: 'travel',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&h=600&fit=crop',
    shortDescription:
      'LangGraph-powered travel assistant for finding flights, booking hotels, and creating personalized travel itineraries',
    workflowOverview: `# AI Travel Agent - Smart Trip Planner

A sophisticated travel planning assistant built with LangGraph that helps users find flights, book hotels, and receive personalized travel itineraries delivered directly to their email.

## How It Works

### 1. Conversation & Context
The agent maintains stateful interactions, remembering your preferences and requirements throughout the planning process.

### 2. Flight & Hotel Search
- Integrates with Google Flights API for real-time flight data
- Connects to Google Hotels for accommodation options
- Compares prices and provides recommendations

### 3. Human-in-the-Loop Control
Before finalizing, you can review and approve travel plans, ensuring everything meets your expectations.

### 4. Automated Delivery
Once approved, receive formatted travel itineraries via email with all booking details.

## Key Features

- **Dynamic LLM Switching** - Uses different models optimized for specific tasks
- **Real-Time Data** - Live flight and hotel availability
- **Email Integration** - SendGrid-powered delivery
- **Streamlit Interface** - User-friendly web application`,
    useCase: `**Best For:**
- Travel agencies looking to automate trip planning
- Businesses needing corporate travel assistance
- Individuals wanting AI-powered vacation planning
- Travel startups building booking platforms

**Use Cases:**
- Flight searching and price comparison
- Hotel booking with preference matching
- Complete travel itinerary creation
- Automated travel plan email delivery`,
    setupGuide: `# Setup Guide for AI Travel Agent

## Prerequisites
- Python 3.11.9 (recommended)
- Poetry package manager
- API Keys: OpenAI, SERPAPI, SendGrid, LangChain

## Installation

### 1. Clone the Repository
\`\`\`bash
git clone https://github.com/nirbar1985/ai-travel-agent.git
cd ai-travel-agent
\`\`\`

### 2. Set Python Version (Optional)
\`\`\`bash
pyenv install 3.11.9
pyenv local 3.11.9
\`\`\`

### 3. Install Dependencies
\`\`\`bash
poetry install --sync
poetry shell
\`\`\`

### 4. Configure Environment
Create a \`.env\` file:
\`\`\`
OPENAI_API_KEY=your_openai_key
SERPAPI_API_KEY=your_serpapi_key
SENDGRID_API_KEY=your_sendgrid_key
LANGCHAIN_API_KEY=your_langchain_key
\`\`\`

### 5. Run the Application
\`\`\`bash
streamlit run app.py
\`\`\``,
  },
  {
    title: 'Jobber - AI Job Application Agent',
    slug: 'jobber-ai-job-application-agent',
    categorySlug: 'hr-recruiting',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800&h=600&fit=crop',
    shortDescription:
      'Autonomous AI agent that searches and applies for jobs on your behalf by controlling your browser',
    workflowOverview: `# Jobber - AI Job Application Agent

An autonomous AI agent built on the Sentient framework that searches and applies for jobs on your behalf by intelligently controlling your browser.

## How It Works

### 1. Resume & Preferences Setup
Provide your resume and job preferences (role, location, platforms) to configure the agent.

### 2. Browser Automation
The agent controls Chrome to navigate job sites like LinkedIn and Wellfound autonomously.

### 3. Multi-Agent Coordination
- **Planner Agent** - Strategizes the job search approach
- **Browser Agent** - Executes actions on job platforms
- Coordinates between components for seamless operation

### 4. Background Operation
Runs job searches and applications without manual intervention while you focus on other tasks.

## Two Implementations

- **jobber** - Simpler multi-agent setup, compatible with various models
- **jobber_fsm** - Finite state machine architecture, better scalability, requires OpenAI structured outputs`,
    useCase: `**Best For:**
- Job seekers wanting to automate repetitive applications
- Professionals conducting broad job searches
- Career changers applying to multiple industries
- Anyone saving time on the job hunt

**Use Cases:**
- Automated job applications on LinkedIn, Wellfound, etc.
- Role-specific searches (e.g., "backend engineer in Helsinki")
- Multi-platform job search campaigns
- Handling repetitive application tasks`,
    setupGuide: `# Setup Guide for Jobber

## Prerequisites
- Python with Poetry
- Chrome browser
- OpenAI API key

## Installation

### 1. Clone the Repository
\`\`\`bash
git clone https://github.com/sentient-engineering/jobber.git
cd jobber
\`\`\`

### 2. Install Dependencies
\`\`\`bash
poetry install
\`\`\`

### 3. Start Chrome in Debug Mode

**macOS:**
\`\`\`bash
/Applications/Google\\ Chrome.app/Contents/MacOS/Google\\ Chrome --remote-debugging-port=9222
\`\`\`

**Windows:**
\`\`\`bash
"C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe" --remote-debugging-port=9222
\`\`\`

### 4. Configure Environment
Set environment variables:
\`\`\`bash
export OPENAI_API_KEY=your_key
export LANGSMITH_API_KEY=your_key  # optional
\`\`\`

### 5. Update Preferences
Edit \`user_preferences.txt\` with your resume path and job preferences.

### 6. Run the Agent
\`\`\`bash
python -u -m jobber_fsm
# or
python -u -m jobber
\`\`\`

### 7. Enter Task
Example: "apply for a backend engineer role based in helsinki on linkedin"`,
  },
  {
    title: 'Legal AI - EU Regulation Assistant',
    slug: 'legal-ai-eu-regulation-assistant',
    categorySlug: 'legal',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&h=600&fit=crop',
    shortDescription:
      'RAG-powered chatbot for understanding EU AI regulations and the Artificial Intelligence Act',
    workflowOverview: `# Legal AI - EU Regulation Assistant

A specialized chatbot designed to help users understand EU AI regulations, built around the Artificial Intelligence Act adopted by the EU Parliament in March 2024.

## How It Works

### 1. Document Processing
The system processes the full EU AI Act and related legal documents using advanced embedding techniques.

### 2. RAG Architecture
- ChromaDB vector database stores document embeddings
- OpenAI embeddings for semantic search
- LangChain agents for intelligent query processing

### 3. Natural Language Queries
Ask questions in plain language and receive accurate, sourced answers about AI regulations.

## Key Capabilities

- **Legal Terminology Interpretation** - Understands and explains complex legal language
- **Regulatory Navigation** - Guides users through compliance requirements
- **Source Citations** - References specific articles and sections
- **Extensible Framework** - Can be adapted to other legal documents`,
    useCase: `**Best For:**
- Companies developing AI products in the EU
- Legal teams researching AI compliance
- Consultants advising on EU AI regulations
- Researchers studying AI governance

**Use Cases:**
- Understanding EU AI Act requirements
- Navigating compliance for AI systems
- Quick reference for regulatory questions
- Training teams on AI regulations`,
    setupGuide: `# Setup Guide for Legal AI

## Prerequisites
- Python 3.x
- OpenAI API Key

## Installation

### 1. Clone the Repository
\`\`\`bash
git clone https://github.com/firica/legalai.git
cd legalai
\`\`\`

### 2. Set API Key
\`\`\`bash
export OPENAI_API_KEY=your_key_value_here
\`\`\`

### 3. Navigate to App Folder
\`\`\`bash
cd app
\`\`\`

### 4. Run the Application
\`\`\`bash
streamlit run app.py
\`\`\`

## Demo
Try the live demo at: https://huggingface.co/spaces/firica/legalai`,
  },
  {
    title: 'MirrorGPT - Personal AI Clone',
    slug: 'mirrorgpt-personal-ai-clone',
    categorySlug: 'productivity',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=600&fit=crop',
    shortDescription:
      'Create personalized AI agents that emulate your facts, speaking patterns, voice, and behavioral preferences',
    workflowOverview: `# MirrorGPT - Personal AI Clone

A toolkit for developing personalized AI agents that emulate individual users, addressing the "personal AI alignment problem" by creating agents that truly reflect you.

## How It Works

### ETL Pipeline

**1. Extract**
Convert your personal data (PDFs, documents, messages) into text using UnstructuredIO.

**2. Transform**
Convert unstructured text into structured statements about you - your facts, preferences, communication style.

**3. Load**
Store transformed data in Chroma database for the Mirror agent to access.

## Key Features

- **Mirror Model Creation** - Build AI models from your personal data
- **Interactive Conversations** - Chat with your Mirror agent
- **Voice Cloning** - Optional ElevenLabs integration for voice replication
- **Local Storage** - Your data stays on your machine for privacy

## Capabilities

- Reflects your facts and biographical information
- Mimics your speaking patterns and communication style
- Represents your preferences and behavioral traits
- Can speak in your cloned voice (optional)`,
    useCase: `**Best For:**
- Professionals wanting AI assistants that represent them
- Content creators building personalized chatbots
- Businesses creating custom AI representatives
- Anyone exploring personal AI alignment

**Use Cases:**
- Personal AI assistant that knows your preferences
- Delegate communications in your style
- Create a digital twin for interactions
- Voice-enabled personal AI representative`,
    setupGuide: `# Setup Guide for MirrorGPT

## Prerequisites
- Python 3.x
- OpenAI API Key
- ElevenLabs API Key (optional, for voice)

## Installation

### 1. Clone the Repository
\`\`\`bash
git clone https://github.com/crosleythomas/MirrorGPT.git
cd MirrorGPT
\`\`\`

### 2. Install Dependencies
\`\`\`bash
pip install -r requirements.txt
\`\`\`

### 3. Prepare Your Data
Place your documents (PDFs, text files) in the data extraction folder.

### 4. Run ETL Pipeline
\`\`\`bash
# Extract
python entrypoints/extract.py

# Transform
python entrypoints/transform.py

# Load
python entrypoints/load.py
\`\`\`

### 5. Run Your Mirror
\`\`\`bash
python entrypoints/run_mirror.py --data-path data/local/loaded -g "Hi what's your name?" -t chroma
\`\`\`

### Voice Integration (Optional)
Configure ElevenLabs API key and voice ID for voice cloning features.`,
  },
  {
    title: 'LLM Industrial Automation Controller',
    slug: 'llm-industrial-automation-controller',
    categorySlug: 'industrial',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&h=600&fit=crop',
    shortDescription:
      'Control industrial automation systems using natural language commands with LLM-powered agents',
    workflowOverview: `# LLM Industrial Automation Controller

Research-backed system demonstrating how Large Language Models can intelligently control industrial automation systems through natural language processing.

## How It Works

### 1. Natural Language Commands
Users interact with automation systems using plain language commands instead of complex interfaces.

### 2. Event-Based Control
The system handles both:
- Routine Standard Operating Procedures (SOP)
- Unexpected events requiring autonomous decision-making

### 3. Model Fine-Tuning
- Supervised fine-tuning (SFT) on industrial control data
- LoRA implementations for efficient adaptation
- Tested across GPT-4o, Llama, Qwen2, and Mistral

## Key Features

- **Multi-Model Support** - Compatible with various LLM architectures
- **Prompt Engineering** - Customizable prompts for specific equipment
- **Laboratory Tested** - Functional prototype demonstrated in real environments`,
    useCase: `**Best For:**
- Manufacturing facilities modernizing control systems
- Industrial engineers exploring AI integration
- Researchers in industrial automation
- Companies building smart factory solutions

**Use Cases:**
- Natural language control of industrial equipment
- Automated standard operating procedure execution
- Autonomous handling of unexpected system events
- Customizing general LLMs for specific machinery`,
    setupGuide: `# Setup Guide for LLM Industrial Automation

## Overview
This is a research project demonstrating LLM-based industrial control.

## Prerequisites
- Python 3.x
- Access to LLM API (GPT-4, Llama, etc.)
- Industrial control system for integration

## Getting Started

### 1. Clone the Repository
\`\`\`bash
git clone https://github.com/YuchenXia/LLM4IAS.git
cd LLM4IAS
\`\`\`

### 2. Review Documentation
- Check the prompt examples in the repository
- Review evaluation datasets (Excel format)
- Study the system architecture

### 3. Configure for Your System
Adapt the prompts and control logic to your specific industrial equipment.

## Training Specifications
- Training data: 0.2 million tokens
- Batch size: 16
- Learning rate: 1e-5

**Note:** This is a research project. Consult the paper and repository for detailed implementation guidance.`,
  },
  {
    title: 'DriVLMe - Autonomous Driving Agent',
    slug: 'drivlme-autonomous-driving-agent',
    categorySlug: 'automotive',
    thumbnailUrl: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=600&fit=crop',
    shortDescription:
      'Vision-language model for autonomous driving with embodied and social experiences, presented at IROS 2024',
    workflowOverview: `# DriVLMe - Autonomous Driving Agent

An advanced autonomous driving agent that enhances LLM-based decision-making by integrating embodied experiences and social interactions. Developed by University of Michigan and ARL researchers, presented at IROS 2024.

## How It Works

### 1. Vision-Language Integration
Built on LLaVA architecture, the system processes driving video footage and understands scenes through combined visual and language understanding.

### 2. Pretraining
- Trained on BDD100K dataset with video features
- Learns general driving scene understanding

### 3. Fine-Tuning
- SDN (Striving for Driving eXpertise) dataset
- LoRA adaptation for efficient training

## Evaluation Tasks

- **NfD (Noticing for Driving)** - Identifying important elements in driving scenes
- **RfN (Reasoning from Noticing)** - Making decisions based on observations`,
    useCase: `**Best For:**
- Autonomous vehicle researchers
- Self-driving car companies
- Automotive AI engineers
- Academic research in embodied AI

**Use Cases:**
- Autonomous vehicle decision-making
- Driving scene understanding
- Multi-task driving evaluation
- Research in vision-language driving models`,
    setupGuide: `# Setup Guide for DriVLMe

## Prerequisites
- Python 3.10
- CUDA-capable GPU
- Conda package manager

## Installation

### 1. Create Environment
\`\`\`bash
conda create --name=drivlme python=3.10
conda activate drivlme
\`\`\`

### 2. Clone Repository
\`\`\`bash
git clone https://github.com/sled-group/driVLMe.git
cd driVLMe
\`\`\`

### 3. Install Dependencies
\`\`\`bash
pip install -r requirements.txt
\`\`\`

### 4. Download LLaVA Weights
Obtain LLaVA-Lightning-7B weights (download directly or apply delta to LLaMA base).

### 5. Download Dataset
Download from the provided Dropbox link and extract to "videos" folder.

### 6. Training
Run pretraining and fine-tuning using the provided torchrun/deepspeed commands in the repository.

**Note:** This is a research project requiring significant computational resources.`,
  },
  {
    title: 'RecAI - LLM Recommender System',
    slug: 'recai-llm-recommender-system',
    categorySlug: 'e-commerce',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop',
    shortDescription:
      'Microsoft research project integrating LLMs into next-generation recommender systems for personalized suggestions',
    workflowOverview: `# RecAI - LLM Recommender System

A Microsoft research project investigating strategies to integrate Large Language Models into recommender systems, creating more intelligent and conversational recommendation experiences.

## Core Components

### 1. Recommender AI Agent
Combines LLMs as the reasoning brain with traditional recommender models as specialized tools.

### 2. Selective Knowledge Plugin
Augments LLMs with domain-specific data through prompt engineering—no model fine-tuning required.

### 3. Embedding RecLM
Optimizes language models specifically for item retrieval tasks.

### 4. Generative RecLM
Fine-tunes models using supervised and reinforcement learning for domain adaptation.

### 5. Model Explainer
Uses LLMs as surrogate models to interpret deep learning recommender systems.

### 6. RecLM Evaluator
Comprehensively assesses LM-based recommenders across retrieval, ranking, and explanation.`,
    useCase: `**Best For:**
- E-commerce platforms building recommendation engines
- Streaming services improving content suggestions
- Researchers in recommender systems
- Companies adding conversational recommendations

**Use Cases:**
- Interactive, conversational product recommendations
- Search and item retrieval applications
- Explainable AI for recommendation systems
- User behavior simulation and analysis`,
    setupGuide: `# Setup Guide for RecAI

## Overview
RecAI is a Microsoft research project with multiple subprojects.

## Getting Started

### 1. Clone the Repository
\`\`\`bash
git clone https://github.com/microsoft/RecAI.git
cd RecAI
\`\`\`

### 2. Explore Subprojects
Each component has its own folder with specific setup instructions:
- \`/agent\` - Recommender AI Agent
- \`/knowledge\` - Selective Knowledge Plugin
- \`/embedding\` - Embedding RecLM
- \`/generative\` - Generative RecLM
- \`/explainer\` - Model Explainer
- \`/evaluator\` - RecLM Evaluator

### 3. Follow Component README
Navigate to the specific component you want to use and follow its individual setup instructions.

**Note:** This is an active research project. Check the repository for the latest documentation and updates.`,
  },
  {
    title: 'EduGPT - AI Instructor & Tutor',
    slug: 'edugpt-ai-instructor-tutor',
    categorySlug: 'education',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&h=600&fit=crop',
    shortDescription:
      'Multi-agent AI tutoring system that creates personalized curricula and adapts teaching to individual student needs',
    workflowOverview: `# EduGPT - AI Instructor & Tutor

An intelligent tutoring system using LLMs and multi-agent architecture to create personalized educational experiences tailored to each learner.

## How It Works

### 1. Curriculum Design
Two AI agents collaborate through dialogue to construct customized curricula based on your learning objectives.

### 2. Adaptive Teaching
The teaching methodology adjusts dynamically to match:
- Individual student preferences
- Current competency levels
- Learning pace and style

### 3. Interactive Sessions
Engage in Q&A sessions with an AI instructor following the generated syllabus.

## Architecture

Based on the CAMEL multi-agent framework:
- **Instructor Agent** - Designs curriculum and teaches
- **Student Agent** - Represents learner needs and provides feedback
- **Dialogue System** - Coordinates agent interactions`,
    useCase: `**Best For:**
- Self-learners wanting structured education
- Educational platforms adding AI tutoring
- Corporate training departments
- Anyone learning new topics independently

**Use Cases:**
- Personalized curriculum generation
- Adaptive tutoring sessions
- Interactive Q&A learning
- Topic-specific education pathways`,
    setupGuide: `# Setup Guide for EduGPT

## Prerequisites
- Python 3.10 or higher
- OpenAI API Key

## Installation

### 1. Clone the Repository
\`\`\`bash
git clone https://github.com/hqanhh/EduGPT.git
cd EduGPT
\`\`\`

### 2. Create Virtual Environment
\`\`\`bash
make venv
\`\`\`

### 3. Configure API Key
Create a \`.env\` file:
\`\`\`
OPENAI_API_KEY=sk-your-api-key-here
\`\`\`

### 4. Run the Application
\`\`\`bash
python src/run.py
\`\`\`

### 5. Access the Interface
Open the Gradio link provided in the terminal and input your desired learning topic to begin!`,
  },
]

async function main() {
  console.log('🚀 Adding GitHub Agents Batch 2\n')
  console.log('='.repeat(50))

  // Get seller
  const seller = await prisma.user.findUnique({
    where: { email: SELLER_EMAIL },
  })

  if (!seller) {
    console.error(`❌ Seller ${SELLER_EMAIL} not found`)
    process.exit(1)
  }

  console.log(`✓ Found seller: ${SELLER_EMAIL}\n`)

  // Create categories
  console.log('📁 Creating categories...')
  const categoryMap: Record<string, string> = {}

  // Get existing categories
  const existingCategories = await prisma.category.findMany()
  existingCategories.forEach(cat => {
    categoryMap[cat.slug] = cat.id
  })

  for (const cat of NEW_CATEGORIES) {
    if (categoryMap[cat.slug]) {
      console.log(`  ✓ Category "${cat.name}" already exists`)
    } else {
      const newCat = await prisma.category.create({ data: cat })
      categoryMap[cat.slug] = newCat.id
      console.log(`  ✅ Created category: ${cat.name}`)
    }
  }

  // Create agents
  console.log('\n🤖 Creating agents...')

  for (const agent of AGENTS) {
    const existing = await prisma.agent.findUnique({
      where: { slug: agent.slug },
    })

    if (existing) {
      console.log(`  ✓ Agent "${agent.title}" already exists`)
      continue
    }

    const categoryId = categoryMap[agent.categorySlug]
    if (!categoryId) {
      console.error(`  ❌ Category ${agent.categorySlug} not found for ${agent.title}`)
      continue
    }

    await prisma.agent.create({
      data: {
        sellerId: seller.id,
        categoryId,
        title: agent.title,
        slug: agent.slug,
        shortDescription: agent.shortDescription,
        workflowOverview: agent.workflowOverview,
        useCase: agent.useCase,
        setupGuide: agent.setupGuide,
        price: 10.0,
        thumbnailUrl: agent.thumbnailUrl,
        status: 'APPROVED',
        approvedAt: new Date(),
      },
    })

    console.log(`  ✅ Created: ${agent.title}`)
  }

  console.log('\n' + '='.repeat(50))
  console.log('✅ Done!')
  console.log(`Added ${AGENTS.length} agents across ${NEW_CATEGORIES.length} new categories`)

  await prisma.$disconnect()
}

main().catch(async e => {
  console.error('Fatal error:', e)
  await prisma.$disconnect()
  process.exit(1)
})
