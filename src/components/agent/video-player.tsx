
"use client";

interface VideoPlayerProps {
    url: string | null;
    thumbnailUrl: string | null;
}

export function VideoPlayer({ url, thumbnailUrl }: VideoPlayerProps) {
    if (!url) {
        return (
            <div className="aspect-video w-full overflow-hidden rounded-lg bg-muted flex items-center justify-center text-muted-foreground">
                No demo video available
            </div>
        );
    }

    // Simple YouTube embed parser (for MVP)
    // In future, use a library like ReactPlayer
    const getEmbedUrl = (url: string) => {
        if (url.includes('youtube.com') || url.includes('youtu.be')) {
            const videoId = url.split('v=')[1] || url.split('/').pop();
            return `https://www.youtube.com/embed/${videoId}`;
        }
        // Assume it's an embeddable URL if not YouTube
        return url;
    };

    return (
        <div className="aspect-video w-full overflow-hidden rounded-lg bg-black shadow-lg">
            <iframe
                src={getEmbedUrl(url)}
                title="Agent Demo"
                className="h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
            />
        </div>
    );
}
