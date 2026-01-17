import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Github, Twitter, Globe, ExternalLink } from 'lucide-react'
import type { SocialLinks } from '@/types'

interface SellerCardProps {
  name: string
  avatarUrl: string | null
  bio: string | null
  portfolioSlug: string
  socialLinks: SocialLinks | null
}

export function SellerCard({ name, avatarUrl, bio, portfolioSlug, socialLinks }: SellerCardProps) {
  return (
    <Card className="overflow-hidden border-brand-slate/10 bg-white">
      <div className="bg-gradient-to-br from-brand-orange/10 to-brand-cream p-6">
        <div className="flex items-center gap-4">
          <Avatar className="h-14 w-14 border-2 border-white shadow-md">
            <AvatarImage src={avatarUrl || ''} alt={name} />
            <AvatarFallback className="bg-brand-orange text-lg font-semibold text-white">
              {name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="text-sm font-medium text-brand-slate/60">Created by</div>
            <div className="text-lg font-semibold text-brand-slate">{name}</div>
          </div>
        </div>
      </div>

      <CardContent className="space-y-4 p-6">
        {bio && <p className="line-clamp-3 text-sm text-brand-slate/70">{bio}</p>}

        <Link href={`/seller/${portfolioSlug}`}>
          <Button
            variant="outline"
            className="w-full border-brand-slate/20 text-brand-slate hover:border-brand-orange hover:bg-brand-orange/5 hover:text-brand-orange"
          >
            <ExternalLink className="mr-2 h-4 w-4" />
            View Full Portfolio
          </Button>
        </Link>

        {socialLinks && (socialLinks.github || socialLinks.twitter || socialLinks.website) && (
          <div className="flex justify-center gap-2 border-t border-brand-slate/10 pt-4">
            {socialLinks.github && (
              <Button
                variant="ghost"
                size="icon"
                className="text-brand-slate/60 hover:bg-brand-orange/10 hover:text-brand-orange"
                asChild
              >
                <a href={socialLinks.github} target="_blank" rel="noopener noreferrer">
                  <Github className="h-5 w-5" />
                </a>
              </Button>
            )}
            {socialLinks.twitter && (
              <Button
                variant="ghost"
                size="icon"
                className="text-brand-slate/60 hover:bg-brand-orange/10 hover:text-brand-orange"
                asChild
              >
                <a href={socialLinks.twitter} target="_blank" rel="noopener noreferrer">
                  <Twitter className="h-5 w-5" />
                </a>
              </Button>
            )}
            {socialLinks.website && (
              <Button
                variant="ghost"
                size="icon"
                className="text-brand-slate/60 hover:bg-brand-orange/10 hover:text-brand-orange"
                asChild
              >
                <a href={socialLinks.website} target="_blank" rel="noopener noreferrer">
                  <Globe className="h-5 w-5" />
                </a>
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
