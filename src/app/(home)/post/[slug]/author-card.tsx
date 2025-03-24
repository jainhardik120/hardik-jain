import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Twitter, Linkedin, Globe } from 'lucide-react';

interface AuthorProps {
  author: {
    name: string | null;
    image: string | null;
    bio: string;
    twitter: string | null;
    linkedin: string | null;
    website: string | null;
  };
}

export default function AuthorCard({ author }: AuthorProps) {
  return (
    <div className="bg-card rounded-lg p-6 border">
      <div className="flex flex-col sm:flex-row gap-6">
        <div className="relative w-24 h-24 rounded-full overflow-hidden shrink-0 mx-auto sm:mx-0">
          <Image
            src={author.image ?? '/placeholder.svg'}
            alt={author.name ?? 'Author Name'}
            fill
            className="object-cover"
          />
        </div>
        <div>
          <h3 className="text-xl font-bold mb-2 text-center sm:text-left">{author.name}</h3>
          <p className="text-muted-foreground mb-4">{author.bio}</p>
          <div className="flex space-x-2 justify-center sm:justify-start">
            {author.twitter !== null && author.twitter !== undefined && (
              <Button variant="outline" size="icon" asChild>
                <a
                  href={author.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${author.name}'s Twitter`}
                >
                  <Twitter size={18} />
                </a>
              </Button>
            )}
            {author.linkedin !== null && author.linkedin !== undefined && (
              <Button variant="outline" size="icon" asChild>
                <a
                  href={author.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${author.name}'s LinkedIn`}
                >
                  <Linkedin size={18} />
                </a>
              </Button>
            )}
            {author.website !== null && author.website !== undefined && (
              <Button variant="outline" size="icon" asChild>
                <a
                  href={author.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${author.name}'s Website`}
                >
                  <Globe size={18} />
                </a>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
