import { prisma } from '../src/lib/prisma'

async function manageAgentStatus() {
    const args = process.argv.slice(2)
    const command = args[0]

    if (command === 'list') {
        // List all agents with their current status
        const agents = await prisma.agent.findMany({
            select: {
                id: true,
                title: true,
                slug: true,
                status: true,
                rejectionReason: true,
                seller: {
                    select: {
                        email: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        })

        console.log('\n📋 All Agents:\n')
        console.log('ID'.padEnd(30), '| Title'.padEnd(35), '| Status'.padEnd(15), '| Seller')
        console.log('─'.repeat(120))

        agents.forEach(agent => {
            console.log(
                agent.id.padEnd(30),
                `| ${agent.title.substring(0, 30).padEnd(30)}`,
                `| ${agent.status.padEnd(13)}`,
                `| ${agent.seller.email}`
            )
            if (agent.rejectionReason) {
                console.log('  └─ Rejection: ' + agent.rejectionReason)
            }
        })
        console.log('\n')
    } else if (command === 'update') {
        const agentId = args[1]
        const newStatus = args[2]
        const rejectionReason = args[3]

        if (!agentId || !newStatus) {
            console.log('\n❌ Usage: npm run manage-agent update <agent-id> <status> [rejection-reason]\n')
            console.log('Valid statuses: DRAFT, UNDER_REVIEW, APPROVED, REJECTED, ARCHIVED\n')
            return
        }

        const validStatuses = ['DRAFT', 'UNDER_REVIEW', 'APPROVED', 'REJECTED', 'ARCHIVED']
        if (!validStatuses.includes(newStatus)) {
            console.log(`\n❌ Invalid status. Must be one of: ${validStatuses.join(', ')}\n`)
            return
        }

        const agent = await prisma.agent.findUnique({
            where: { id: agentId },
            select: { title: true, status: true }
        })

        if (!agent) {
            console.log('\n❌ Agent not found with ID:', agentId, '\n')
            return
        }

        const updateData: any = {
            status: newStatus as any
        }

        if (newStatus === 'APPROVED') {
            updateData.approvedAt = new Date()
            updateData.rejectionReason = null
        } else if (newStatus === 'REJECTED') {
            if (!rejectionReason) {
                console.log('\n❌ Rejection reason required when status is REJECTED\n')
                console.log('Usage: npm run manage-agent update <agent-id> REJECTED "Your reason here"\n')
                return
            }
            updateData.rejectionReason = rejectionReason
        } else if (newStatus === 'DRAFT') {
            updateData.rejectionReason = null
        }

        await prisma.agent.update({
            where: { id: agentId },
            data: updateData
        })

        console.log(`\n✅ Agent status updated:\n`)
        console.log(`   Title: ${agent.title}`)
        console.log(`   Old Status: ${agent.status}`)
        console.log(`   New Status: ${newStatus}`)
        if (rejectionReason) {
            console.log(`   Rejection Reason: ${rejectionReason}`)
        }
        console.log('\n')
    } else {
        console.log('\n📖 Agent Status Manager\n')
        console.log('Commands:')
        console.log('  list                                  - List all agents with their status')
        console.log('  update <id> <status> [reason]         - Update agent status\n')
        console.log('Examples:')
        console.log('  npx tsx scripts/manage-agent-status.ts list')
        console.log('  npx tsx scripts/manage-agent-status.ts update <agent-id> UNDER_REVIEW')
        console.log('  npx tsx scripts/manage-agent-status.ts update <agent-id> APPROVED')
        console.log('  npx tsx scripts/manage-agent-status.ts update <agent-id> REJECTED "Title needs improvement"')
        console.log('  npx tsx scripts/manage-agent-status.ts update <agent-id> DRAFT\n')
    }

    await prisma.$disconnect()
}

manageAgentStatus().catch(console.error)
