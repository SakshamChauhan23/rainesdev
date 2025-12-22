
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Github, Twitter, Globe } from 'lucide-react';

interface SellerCardProps {
    name: string;
    avatarUrl: string | null;
    bio: string | null;
    portfolioSlug: string;
    socialLinks: Record<string, string> | null;
}

export function SellerCard({ name, avatarUrl, bio, portfolioSlug, socialLinks }: SellerCardProps) {
    return (
        <Card className="border-gray-200 bg-white">
            <CardHeader>
                <CardTitle className="text-lg font-normal text-gray-900">Created By</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12">
                        <AvatarImage src={avatarUrl || ''} alt={name} />
                        <AvatarFallback className="bg-gray-100 text-gray-700">{name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                        <div className="font-semibold text-gray-900">{name}</div>
                        <Link
                            href={`/seller/${portfolioSlug}`}
                            className="text-sm font-light text-gray-600 hover:underline"
                        >
                            View Portfolio
                        </Link>
                    </div>
                </div>

                {bio && (
                    <p className="text-sm font-light text-gray-600 line-clamp-3">
                        {bio}
                    </p>
                )}

                {socialLinks && (
                    <div className="flex gap-2">
                        {socialLinks.github && (
                            <Button variant="ghost" size="icon" className="text-gray-600 hover:bg-gray-50 hover:text-gray-900" asChild>
                                <a href={socialLinks.github} target="_blank" rel="noopener noreferrer">
                                    <Github className="h-4 w-4" />
                                </a>
                            </Button>
                        )}
                        {socialLinks.twitter && (
                            <Button variant="ghost" size="icon" className="text-gray-600 hover:bg-gray-50 hover:text-gray-900" asChild>
                                <a href={socialLinks.twitter} target="_blank" rel="noopener noreferrer">
                                    <Twitter className="h-4 w-4" />
                                </a>
                            </Button>
                        )}
                        {socialLinks.website && (
                            <Button variant="ghost" size="icon" className="text-gray-600 hover:bg-gray-50 hover:text-gray-900" asChild>
                                <a href={socialLinks.website} target="_blank" rel="noopener noreferrer">
                                    <Globe className="h-4 w-4" />
                                </a>
                            </Button>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
