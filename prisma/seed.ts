import { PrismaClient, UserRole, AgentStatus } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Starting database seed...')

  // Note: User authentication is handled by Supabase Auth
  // Users must be created through Supabase, then synced to Prisma DB
  // This seed file only creates categories and other non-auth data

  console.log('⚠️  Users must be created via Supabase Auth (signup flow)')

  // Create Categories
  const categories = [
    {
      name: 'Customer Support',
      slug: 'customer-support',
      description: 'AI agents that automate customer service and support workflows',
      displayOrder: 1,
    },
    {
      name: 'Sales & Marketing',
      slug: 'sales-marketing',
      description: 'Agents for lead generation, email campaigns, and sales automation',
      displayOrder: 2,
    },
    {
      name: 'Data Analysis',
      slug: 'data-analysis',
      description: 'Intelligent agents for data processing, analysis, and reporting',
      displayOrder: 3,
    },
    {
      name: 'Content Creation',
      slug: 'content-creation',
      description: 'AI-powered content writing, editing, and optimization agents',
      displayOrder: 4,
    },
    {
      name: 'Development Tools',
      slug: 'development-tools',
      description: 'Coding assistants, code review, and development automation agents',
      displayOrder: 5,
    },
    {
      name: 'Productivity',
      slug: 'productivity',
      description: 'Task automation, scheduling, and workflow optimization agents',
      displayOrder: 6,
    },
    {
      name: 'Autonomous Agents',
      slug: 'autonomous-agents',
      description: 'Self-operating AI agents that work independently on complex tasks',
      displayOrder: 7,
    },
    {
      name: 'Frameworks',
      slug: 'frameworks',
      description: 'Developer frameworks and libraries for building AI agents',
      displayOrder: 8,
    },
    {
      name: 'Low-Code/No-Code',
      slug: 'low-code-no-code',
      description: 'Visual and drag-and-drop tools for creating AI agents without coding',
      displayOrder: 9,
    },
    {
      name: 'Multi-Agent Systems',
      slug: 'multi-agent-systems',
      description: 'Platforms for orchestrating multiple AI agents working together',
      displayOrder: 10,
    },
    {
      name: 'Memory & Context',
      slug: 'memory-context',
      description: 'Agents with persistent memory and long-term context management',
      displayOrder: 11,
    },
    {
      name: 'Voice & Speech',
      slug: 'voice-speech',
      description: 'Text-to-speech, voice cloning, and conversational voice agents',
      displayOrder: 12,
    },
    {
      name: 'Browser Automation',
      slug: 'browser-automation',
      description: 'AI agents for web scraping, browser control, and web automation',
      displayOrder: 13,
    },
    {
      name: 'Platforms & Hubs',
      slug: 'platforms-hubs',
      description: 'Agent marketplaces, repositories, and deployment platforms',
      displayOrder: 14,
    },
  ]

  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: {},
      create: category,
    })
  }
  console.log('✅ Categories created')

  // Check if we have a system user for open-source agents
  let systemUser = await prisma.user.findFirst({
    where: { email: 'opensource@rouze.ai' }
  })

  if (!systemUser) {
    // Create a system user ID (this should match a Supabase auth user if you want full functionality)
    const systemUserId = 'system-opensource-user'
    systemUser = await prisma.user.upsert({
      where: { id: systemUserId },
      update: {},
      create: {
        id: systemUserId,
        email: 'opensource@rouze.ai',
        name: 'Open Source Community',
        role: UserRole.SELLER,
      }
    })
    console.log('✅ System user created for open-source agents')
  }

  // Create seller profile for system user
  await prisma.sellerProfile.upsert({
    where: { userId: systemUser.id },
    update: {},
    create: {
      userId: systemUser.id,
      bio: 'Curated collection of open-source AI agents from the community',
      portfolioUrlSlug: 'open-source',
      verificationStatus: 'VERIFIED',
    }
  })
  console.log('✅ Seller profile created')

  // Get category IDs
  const categoryMap = await prisma.category.findMany()
  const getCategoryId = (slug: string) => {
    const cat = categoryMap.find(c => c.slug === slug)
    return cat?.id || categoryMap[0].id
  }

  // Open Source Agents from CSV
  const openSourceAgents = [
    {
      title: 'SuperAGI',
      slug: 'superagi',
      shortDescription: 'Dev-first open source autonomous AI agent framework for building, managing & running agents',
      workflowOverview: 'SuperAGI provides a comprehensive framework for developers to create autonomous AI agents. It includes tools for agent management, execution monitoring, and integration with various AI models.',
      useCase: 'Build custom autonomous agents that can handle complex multi-step tasks, integrate with external tools, and maintain persistent memory across sessions.',
      categorySlug: 'autonomous-agents',
      demoVideoUrl: 'https://www.youtube.com/watch?v=superagi-demo',
      setupGuide: '## Getting Started with SuperAGI\n\n1. Clone the repository from GitHub\n2. Install dependencies with `pip install -r requirements.txt`\n3. Configure your API keys in `.env`\n4. Run `python main.py` to start the agent\n\n**GitHub:** https://github.com/TransformerOptimus/SuperAGI',
    },
    {
      title: 'Agent Zero',
      slug: 'agent-zero',
      shortDescription: 'General-purpose assistant with persistent memory, fully transparent and customizable',
      workflowOverview: 'Agent Zero is designed as a transparent, customizable AI assistant that maintains context across conversations through persistent memory storage.',
      useCase: 'Create a personal AI assistant that remembers your preferences, past conversations, and can be fully customized to your specific needs.',
      categorySlug: 'autonomous-agents',
      setupGuide: '## Getting Started with Agent Zero\n\n1. Clone from GitHub\n2. Install requirements\n3. Configure memory storage\n4. Start the agent\n\n**GitHub:** https://github.com/agent0ai/agent-zero',
    },
    {
      title: 'AutoGPT',
      slug: 'autogpt',
      shortDescription: 'Powerful platform for creating, deploying, and managing continuous AI agents',
      workflowOverview: 'AutoGPT is one of the pioneering autonomous agent platforms, allowing GPT-4 to run autonomously with goal-oriented task completion.',
      useCase: 'Deploy AI agents that can browse the web, execute code, manage files, and complete complex multi-step objectives with minimal human intervention.',
      categorySlug: 'autonomous-agents',
      setupGuide: '## Getting Started with AutoGPT\n\n1. Clone the AutoGPT repository\n2. Set up Python environment\n3. Add OpenAI API key\n4. Configure agent goals\n5. Run the agent\n\n**GitHub:** https://github.com/Significant-Gravitas/AutoGPT',
    },
    {
      title: 'AutoGen',
      slug: 'autogen',
      shortDescription: 'Microsoft multi-agent conversation framework for building AI applications',
      workflowOverview: 'AutoGen enables building applications with multiple agents that can converse with each other to solve tasks. Agents are customizable and can incorporate LLMs, tools, and human input.',
      useCase: 'Build multi-agent systems where different AI agents collaborate, debate, and refine solutions together.',
      categorySlug: 'frameworks',
      setupGuide: '## Getting Started with AutoGen\n\n1. Install via pip: `pip install pyautogen`\n2. Configure your LLM endpoints\n3. Define agent roles and behaviors\n4. Set up conversation flows\n\n**GitHub:** https://github.com/microsoft/autogen',
    },
    {
      title: 'CrewAI',
      slug: 'crewai',
      shortDescription: 'Great for low-code experience with option to dip into code when needed',
      workflowOverview: 'CrewAI allows you to create AI agent crews that work together on complex tasks. Define roles, goals, and let agents collaborate autonomously.',
      useCase: 'Orchestrate teams of AI agents with specific roles (researcher, writer, editor) to complete sophisticated projects.',
      categorySlug: 'low-code-no-code',
      setupGuide: '## Getting Started with CrewAI\n\n1. Install: `pip install crewai`\n2. Define your agents with roles\n3. Create tasks for the crew\n4. Let them collaborate\n\n**GitHub:** https://github.com/joaomdmoura/crewAI',
    },
    {
      title: 'LangChain',
      slug: 'langchain',
      shortDescription: 'Framework for building applications with LLMs, agents, and tool usage',
      workflowOverview: 'LangChain provides building blocks for LLM applications including chains, agents, memory, and tool integrations.',
      useCase: 'Build sophisticated AI applications that combine language models with external data sources, APIs, and custom logic.',
      categorySlug: 'frameworks',
      setupGuide: '## Getting Started with LangChain\n\n1. Install: `pip install langchain`\n2. Set up your LLM provider\n3. Create chains or agents\n4. Add tools and memory as needed\n\n**GitHub:** https://github.com/langchain-ai/langchain',
    },
    {
      title: 'PydanticAI',
      slug: 'pydanticai',
      shortDescription: 'Provides excellent abstractions, agnostic to model/ecosystem',
      workflowOverview: 'PydanticAI brings type-safe, validated AI agent development with Pydantic integration for reliable data handling.',
      useCase: 'Build type-safe AI applications with structured outputs and validated data flows.',
      categorySlug: 'frameworks',
      setupGuide: '## Getting Started with PydanticAI\n\n1. Install: `pip install pydantic-ai`\n2. Define your data models\n3. Create typed agents\n4. Enjoy validated outputs\n\n**GitHub:** https://github.com/pydantic/pydantic-ai',
    },
    {
      title: 'MemGPT',
      slug: 'memgpt',
      shortDescription: 'Create LLM agents with long-term memory and custom tools',
      workflowOverview: 'MemGPT implements a virtual context management system that allows LLMs to have unlimited context through intelligent memory tiering.',
      useCase: 'Build AI assistants that maintain long-term memory, remember past conversations, and manage context efficiently.',
      categorySlug: 'memory-context',
      setupGuide: '## Getting Started with MemGPT\n\n1. Install: `pip install pymemgpt`\n2. Configure memory storage\n3. Create your agent\n4. Start conversations with persistent memory\n\n**GitHub:** https://github.com/cpacker/MemGPT',
    },
    {
      title: 'AutoAgent',
      slug: 'autoagent',
      shortDescription: 'Fully-Automated and Zero-Code framework for creating agents through Natural Language',
      workflowOverview: 'AutoAgent allows you to create AI agents simply by describing what you want in natural language - no coding required.',
      useCase: 'Create custom AI agents by describing their behavior in plain English, perfect for non-technical users.',
      categorySlug: 'low-code-no-code',
      setupGuide: '## Getting Started with AutoAgent\n\n1. Clone the repository\n2. Install dependencies\n3. Describe your agent in natural language\n4. Let AutoAgent generate it\n\n**GitHub:** https://github.com/HKUDS/AutoAgent',
    },
    {
      title: 'Open Agent Platform',
      slug: 'open-agent-platform',
      shortDescription: "LangChain's modern web-based interface for creating, managing agents",
      workflowOverview: 'A visual platform built on LangChain for creating and managing AI agents through a web interface.',
      useCase: 'Manage your LangChain agents through a user-friendly web dashboard with visual workflow builders.',
      categorySlug: 'platforms-hubs',
      setupGuide: '## Getting Started\n\n1. Clone the repository\n2. Install dependencies\n3. Configure your LangChain setup\n4. Launch the web interface\n\n**GitHub:** https://github.com/langchain-ai/open-agent-platform',
    },
    {
      title: 'n8n',
      slug: 'n8n',
      shortDescription: 'Classic open-source tool for agentic automation with hundreds of integrations',
      workflowOverview: 'n8n is a workflow automation platform with a visual editor, supporting AI agents and 400+ integrations.',
      useCase: 'Create automated workflows combining AI agents with hundreds of apps and services through a visual builder.',
      categorySlug: 'low-code-no-code',
      setupGuide: '## Getting Started with n8n\n\n1. Install via npm or Docker\n2. Access the web interface\n3. Create workflows visually\n4. Add AI nodes for agent capabilities\n\n**GitHub:** https://github.com/n8n-io/n8n',
    },
    {
      title: 'LangFlow',
      slug: 'langflow',
      shortDescription: 'Mature visual platform for building LangChain applications with active community',
      workflowOverview: 'LangFlow provides a drag-and-drop interface for building LangChain applications and AI agents visually.',
      useCase: 'Design complex AI workflows by connecting components visually, then export to Python code.',
      categorySlug: 'low-code-no-code',
      setupGuide: '## Getting Started with LangFlow\n\n1. Install: `pip install langflow`\n2. Run: `langflow run`\n3. Open the visual editor\n4. Start building\n\n**GitHub:** https://github.com/logspace-ai/langflow',
    },
    {
      title: 'OWL',
      slug: 'owl',
      shortDescription: 'Multi-agent collaboration framework built on CAMEL-AI, tops GAIA benchmark',
      workflowOverview: 'OWL is a state-of-the-art multi-agent framework achieving top performance on agent benchmarks.',
      useCase: 'Deploy high-performance multi-agent systems for complex reasoning and task completion.',
      categorySlug: 'multi-agent-systems',
      setupGuide: '## Getting Started with OWL\n\n1. Clone the repository\n2. Install dependencies\n3. Configure agents\n4. Run collaborative tasks\n\n**GitHub:** https://github.com/owl-ai',
    },
    {
      title: 'AgentDock',
      slug: 'agentdock',
      shortDescription: 'Open-source foundation to build, manage, and deploy production-ready AI agents',
      workflowOverview: 'AgentDock provides infrastructure for deploying and managing AI agents at scale in production environments.',
      useCase: 'Deploy and manage production AI agents with monitoring, scaling, and enterprise features.',
      categorySlug: 'platforms-hubs',
      setupGuide: '## Getting Started with AgentDock\n\n1. Set up the platform\n2. Deploy your agents\n3. Monitor and scale\n4. Manage through dashboard\n\n**GitHub:** https://github.com/agentdock',
    },
    {
      title: 'Modus',
      slug: 'modus',
      shortDescription: 'Open source serverless framework for building intelligent agents in Go or AssemblyScript',
      workflowOverview: 'Modus enables building serverless AI agents using Go or AssemblyScript for high-performance applications.',
      useCase: 'Build performant, serverless AI agents that scale automatically with demand.',
      categorySlug: 'frameworks',
      setupGuide: '## Getting Started with Modus\n\n1. Install the Modus CLI\n2. Initialize your project\n3. Write agent logic in Go or AssemblyScript\n4. Deploy serverlessly\n\n**GitHub:** https://github.com/modus-ai',
    },
    {
      title: 'Gobii',
      slug: 'gobii',
      shortDescription: 'Open-source platform for deploying and managing browser-use agents at scale',
      workflowOverview: 'Gobii specializes in browser automation agents, allowing AI to interact with web applications like a human user.',
      useCase: 'Deploy AI agents that can browse websites, fill forms, extract data, and automate web-based tasks.',
      categorySlug: 'browser-automation',
      setupGuide: '## Getting Started with Gobii\n\n1. Install Gobii\n2. Configure browser instances\n3. Deploy your agents\n4. Scale as needed\n\n**GitHub:** https://github.com/gobii-ai',
    },
    {
      title: 'Qwen3-TTS',
      slug: 'qwen3-tts',
      shortDescription: 'Open-source TTS model with 3-second voice cloning, multilingual support (10 languages)',
      workflowOverview: 'Qwen3-TTS provides state-of-the-art text-to-speech with instant voice cloning from just 3 seconds of audio.',
      useCase: 'Add natural voice synthesis to your applications with support for voice cloning and 10 languages.',
      categorySlug: 'voice-speech',
      setupGuide: '## Getting Started with Qwen3-TTS\n\n1. Clone the repository\n2. Install dependencies\n3. Load the model\n4. Generate speech from text\n\n**GitHub:** https://github.com/QwenLM/Qwen3-TTS',
    },
    {
      title: 'Memvid',
      slug: 'memvid',
      shortDescription: 'Portable serverless memory layer for AI agents stored as single file with Smart Frames',
      workflowOverview: 'Memvid provides a unique memory solution storing agent memory as video files for efficient retrieval.',
      useCase: 'Add persistent, portable memory to your AI agents that can be stored and transferred as single files.',
      categorySlug: 'memory-context',
      setupGuide: '## Getting Started with Memvid\n\n1. Install Memvid\n2. Initialize memory storage\n3. Connect to your agent\n4. Store and retrieve memories\n\n**GitHub:** https://github.com/memvid/memvid',
    },
    {
      title: 'Dify',
      slug: 'dify',
      shortDescription: 'Low-code platform with visual interface, 93K GitHub stars, supports hundreds of LLMs',
      workflowOverview: 'Dify is a popular LLM application development platform with visual workflow builders and extensive model support.',
      useCase: 'Build AI applications visually with support for RAG, agents, and workflows across multiple LLM providers.',
      categorySlug: 'low-code-no-code',
      setupGuide: '## Getting Started with Dify\n\n1. Deploy Dify (cloud or self-hosted)\n2. Configure your LLM providers\n3. Create applications visually\n4. Deploy and share\n\n**GitHub:** https://github.com/langgenius/dify',
    },
    {
      title: 'Retell AI',
      slug: 'retell-ai',
      shortDescription: 'Platform for building voice AI agents for customer service and sales',
      workflowOverview: 'Retell AI specializes in voice-based AI agents for call centers and customer service applications.',
      useCase: 'Build AI voice agents that can handle phone calls, customer support, and sales conversations.',
      categorySlug: 'voice-speech',
      setupGuide: '## Getting Started with Retell AI\n\n1. Sign up at retellai.com\n2. Configure your voice agent\n3. Set up phone integration\n4. Deploy and monitor\n\n**Website:** https://www.retellai.com',
    },
  ]

  // Insert agents
  for (const agent of openSourceAgents) {
    const categoryId = getCategoryId(agent.categorySlug)

    await prisma.agent.upsert({
      where: { slug: agent.slug },
      update: {
        title: agent.title,
        shortDescription: agent.shortDescription,
        workflowOverview: agent.workflowOverview,
        useCase: agent.useCase,
        setupGuide: agent.setupGuide,
        demoVideoUrl: agent.demoVideoUrl || null,
      },
      create: {
        sellerId: systemUser.id,
        categoryId: categoryId,
        title: agent.title,
        slug: agent.slug,
        shortDescription: agent.shortDescription,
        workflowOverview: agent.workflowOverview,
        useCase: agent.useCase,
        price: 0, // Free/Open Source
        setupGuide: agent.setupGuide,
        demoVideoUrl: agent.demoVideoUrl || null,
        status: AgentStatus.APPROVED,
        featured: ['autogpt', 'langchain', 'crewai', 'dify', 'n8n'].includes(agent.slug),
      }
    })
  }
  console.log(`✅ ${openSourceAgents.length} open-source agents created`)

  console.log('✅ Database seeded successfully!')
  console.log('')
  console.log('📝 To create users:')
  console.log('   1. Use the /signup page in the application')
  console.log('   2. Or create users directly in Supabase Auth dashboard')
  console.log('   3. Users will be automatically synced to the database on signup')
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
