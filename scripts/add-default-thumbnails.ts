/**
 * Script to add default thumbnails to agents that don't have one
 * Usage: npx tsx scripts/add-default-thumbnails.ts
 */

import { prisma } from '../src/lib/prisma'

// Array of placeholder images from Unsplash (AI/Tech themed)
const defaultThumbnails = [
    'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&h=630&fit=crop', // AI Brain
    'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=1200&h=630&fit=crop', // AI Circuit
    'https://images.unsplash.com/photo-1677756119517-756a188d2d94?w=1200&h=630&fit=crop', // AI Abstract
    'https://images.unsplash.com/photo-1655720828018-edd2daec9349?w=1200&h=630&fit=crop', // Tech Blue
    'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1200&h=630&fit=crop', // Circuit Board
]

async function addDefaultThumbnails() {
    try {
        console.log('🔍 Finding agents without thumbnails...')

        // Get all agents without thumbnails
        const agentsWithoutThumbnails = await prisma.agent.findMany({
            where: {
                OR: [
                    { thumbnailUrl: null },
                    { thumbnailUrl: '' }
                ]
            },
            select: {
                id: true,
                title: true,
                thumbnailUrl: true
            }
        })

        console.log(`📊 Found ${agentsWithoutThumbnails.length} agents without thumbnails`)

        if (agentsWithoutThumbnails.length === 0) {
            console.log('✅ All agents already have thumbnails!')
            return
        }

        let updated = 0

        for (const agent of agentsWithoutThumbnails) {
            // Rotate through default thumbnails
            const thumbnailUrl = defaultThumbnails[updated % defaultThumbnails.length]

            await prisma.agent.update({
                where: { id: agent.id },
                data: { thumbnailUrl }
            })

            console.log(`✅ Updated: ${agent.title} → ${thumbnailUrl}`)
            updated++
        }

        console.log('\n📈 Update Summary:')
        console.log(`   ✅ Updated: ${updated} agents`)
        console.log(`   📊 Total: ${agentsWithoutThumbnails.length}`)

    } catch (error) {
        console.error('❌ Error updating thumbnails:', error)
        throw error
    } finally {
        await prisma.$disconnect()
    }
}

addDefaultThumbnails()
    .then(() => {
        console.log('\n✨ Done!')
        process.exit(0)
    })
    .catch(() => {
        process.exit(1)
    })
